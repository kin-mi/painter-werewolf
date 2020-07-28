import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as dayjs from 'dayjs'

import {} from '../src'
admin.initializeApp()
const firestore = admin.firestore()
const logging = (label: string, data: any): void => {
  functions.logger.debug('[STATUS CHANGE]', label, data || null)
}

exports.onUserStatusChanged = functions
  .region('asia-northeast1')
  .database.ref('/status/{uid}')
  .onUpdate(async (change, context) => {
    // 更新後のデータ（RTDB）
    const eventStatus = change.after.val()
    const statusSnapshot = await change.after.ref.once('value')
    const status = statusSnapshot.val()
    // 前後関係のチェック
    if (status.last_changed > eventStatus.last_changed) {
      return null
    }
    logging('START', eventStatus)

    // Start transaction
    try {
      await firestore.runTransaction(async (trn) => {
        const roomDocRef = firestore.collection('rooms').doc(eventStatus.roomId)
        // 現在の部屋情報を取得
        const roomSnap = await trn.get(roomDocRef)
        if (!roomSnap.exists)
          throw new Error(`Not found room. ${roomDocRef.id}`)
        const room = roomSnap.data()!
        const roomPlayersStatus = room.playersStatus.find(
          (e: any) => e.id === context.params.uid
        )
        if (!roomPlayersStatus) return undefined
        logging('Fetch Room.', room)

        // ルーム上のステータス更新
        const beforeRoomStatus = roomPlayersStatus.status
        const roomUserPayload = {
          ...roomPlayersStatus,
          status: 'offline',
        }
        const roomPlayersStatusIdx = room.playersStatus.findIndex(
          (e: any) => e.id === context.params.uid
        )
        room.playersStatus.splice(roomPlayersStatusIdx, 1, roomUserPayload)

        // 待機中に落ちた場合
        if (
          room.status === 'wait' &&
          eventStatus.state === 'offline' &&
          beforeRoomStatus === 'online'
        ) {
          // 最後の1人の場合、部屋をクローズする
          const roomStatus =
            room.playersStatus.filter((e: any) => e.status === 'online')
              .length > 0
              ? 'wait'
              : 'close'
          logging('Update Room.', { ...room, status: roomStatus })
          if (roomStatus === 'close') logging('Closing Room.', roomStatus)
          return trn.update(roomDocRef, {
            playersStatus: room.playersStatus,
            status: roomStatus,
            updateAt: new Date(eventStatus.last_changed),
          })
        }

        // 遊戯情報の取得
        const playgroundRef = roomDocRef.collection('playground')
        const playgroundSnap = await playgroundRef.get()
        const playground = playgroundSnap.empty
          ? undefined
          : playgroundSnap.docs[0].data()
        if (!playground) return
        logging('Fetch Playground.', playground)

        const playgroundPlayersStatus = playground.players.find(
          (e: any) => e.id === context.params.uid
        )
        if (!playgroundPlayersStatus) return undefined
        // 遊戯上のステータス更新
        const beforePlaygroundStatus = roomPlayersStatus.status
        const playgroundUserPayload = {
          ...playgroundPlayersStatus,
          status: 'offline',
        }
        const playgroundPlayersIdx = playground.players.findIndex(
          (e: any) => e.id === context.params.uid
        )
        playground.players.splice(
          playgroundPlayersIdx,
          1,
          playgroundUserPayload
        )

        // プレイ中の場合
        if (
          room.status === 'play' &&
          eventStatus.state === 'offline' &&
          beforePlaygroundStatus === 'online'
        ) {
          const isMyTurn = playground.currentTurn.painter === context.params.uid
          // 自分のターンの場合
          if (isMyTurn) {
            // ターンを進める
            functions.logger.info('before next turn', playground)
            logging('Before Exec NextTurn', playground)
            _nextTurn(playground)
            logging('After Exec NextTurn', playground)
          }
          // 未投票の場合
          if (!playground.votes.some((e: any) => e.id === context.params.uid)) {
            // 仮データで投票する
            // vote payload
            const vote = {
              id: context.params.uid,
              voteResult: '-',
              voteDate: dayjs().toDate(),
            }
            playground.votes = [...playground.votes, vote]
            // 最後の投票の場合、結果を判定する
            if (playground.votes.length === playground.players.length) {
              playground.result = _judgment(playground)
              logging('Set Result.', playground.result)
            }
          }
          logging('Update Playground.', playground)
          trn.update(playgroundSnap.docs[0].ref, {
            ...playground,
            updateAt: admin.firestore.FieldValue.serverTimestamp(),
          })

          // 部屋情報の更新
          // 最後の1人の場合、部屋をクローズする
          const roomStatus =
            room.playersStatus.filter((e: any) => e.status === 'online')
              .length > 0
              ? 'play'
              : 'close'
          logging('Update Room.', { ...room, status: roomStatus })
          if (roomStatus === 'close') logging('Closing Room.', roomStatus)
          return trn.update(roomDocRef, {
            playersStatus: room.playersStatus,
            status: roomStatus,
            updateAt: new Date(eventStatus.last_changed),
          })
        }
        return undefined
      })
    } catch (e) {
      functions.logger.error('[STATUS CHANGE]', 'ERROR', e)
      throw e
    } finally {
      functions.logger.debug('[STATUS CHANGE]', 'END')
    }
    return undefined
  })

function _nextTurn(playground: any) {
  let currentUserStatus: 'online' | 'offline' | undefined
  logging('Start NextTurn.', playground)
  do {
    const currentPlayerIdx = playground.players.findIndex(
      (e: any) => e.id === playground.currentTurn.painter
    )
    if (playground.players[currentPlayerIdx + 1]) {
      // 次のユーザーへ切り替え
      playground.currentTurn.painter =
        playground.players[currentPlayerIdx + 1].id
    } else if (playground.currentTurn.round === playground.round) {
      // ラウンド終了
      playground.currentTurn.painter = ''
    } else {
      // ラウンドを進めて先頭のユーザーへ切り替え
      playground.currentTurn.painter = playground.players[0].id
      playground.currentTurn.round = playground.currentTurn.round + 1
    }
    currentUserStatus =
      playground.players.find(
        (e: any) => e.id === playground.currentTurn.painter
      )?.status || undefined
    logging('Set NextTurn.', playground)
  } while (
    currentUserStatus === 'offline' &&
    playground.currentTurn.painter !== ''
  )
  logging('Finished NextTurn.', playground)
  return playground
}

/******************************
 * 勝敗を決定する
 * @param {Playground} playground
 */
function _judgment(playground: any): '' | 'painter' | 'werewolf' {
  const groupBy = <K, V>(
    array: readonly V[],
    getKey: (cur: V, idx: number, src: readonly V[]) => K
  ): [K, V[]][] =>
    Array.from(
      array.reduce((map, cur, idx, src) => {
        const key = getKey(cur, idx, src)
        const list = map.get(key)
        if (list) list.push(cur)
        else map.set(key, [cur])
        return map
      }, new Map<K, V[]>())
    )
  // 投票を集計
  const sumVotes = groupBy(playground.votes, (v: any) => v.voteResult)
  logging('Judgment sumVotes', sumVotes)
  // 投票数の最大値
  const maxVoteCount = sumVotes.map((v) => v[1].length).sort((a, b) => b - a)[0]
  logging('Judgment maxVoteCount', maxVoteCount)
  // 一番投票された人（複数有り）
  const topMembers = sumVotes
    .filter((v) => v[1].length === maxVoteCount)
    .map((v) => v[0])
  logging('Judgment topMembers', topMembers)
  // 人狼の答え
  const werewolfAnswer = playground.votes.find(
    (e: any) => e.id === playground.werewolf
  )?.voteResult
  logging('Judgment werewolfAnswer', werewolfAnswer)
  // 上記に人狼が含まれる場合、画家陣営の勝ち
  const result = topMembers.includes(playground.werewolf)
    ? playground.answer === werewolfAnswer
      ? 'werewolf'
      : 'painter'
    : 'werewolf'
  return result
}
