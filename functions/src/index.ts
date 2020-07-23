import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()
const firestore = admin.firestore()

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

    // Start transaction
    await firestore.runTransaction(async (trn) => {
      const roomDocRef = firestore.collection('rooms').doc(eventStatus.roomId)
      // 現在の部屋情報を取得
      const roomSnap = await trn.get(roomDocRef)
      if (!roomSnap.exists) throw new Error(`Not found room. ${roomDocRef.id}`)
      const room = roomSnap.data()!
      const playersStatus = room.playersStatus.find(
        (e: any) => e.id === context.params.uid
      )
      if (!playersStatus) return undefined

      // 待機中に落ちた場合
      if (
        room.status === 'wait' &&
        eventStatus.state === 'offline' &&
        playersStatus.status === 'online'
      ) {
        const userPayload = {
          ...playersStatus,
          status: 'offline',
        }
        const playersStatusIdx = room.playersStatus.findIndex(
          (e: any) => e.id === context.params.uid
        )
        room.playersStatus.splice(playersStatusIdx, 1, userPayload)
        // 最後の1人の場合、部屋をクローズする
        const roomStatus =
          room.playersStatus.filter((e: any) => e.status === 'online').length >
          0
            ? 'wait'
            : 'close'

        return trn.update(roomDocRef, {
          playersStatus: room.playersStatus,
          status: roomStatus,
          updateAt: new Date(eventStatus.last_changed),
        })
      }
      // プレイ中の場合
      // 自分のターンの場合
      // 投票中、かつ未投票の場合
      return undefined
      // // 遊戯情報の取得
      // const playgroundSnap = await roomDocRef.collection('playground').get()
      // const playground = playgroundSnap.empty
      //   ? undefined
      //   : playgroundSnap.docs[0].data()
    })
    return undefined
  })
