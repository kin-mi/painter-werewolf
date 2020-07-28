import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { v4 as uuid } from 'uuid'
import { firestore } from 'firebase'
import { RoomUser, dataToRoom } from './room'
import { CollectionName, RoomStatus } from '~/utils/constant'
import { shuffle } from '~/utils/array'
import { ThemeMap } from '~/utils/theme'
import { SystemMessage } from '~/utils/message'

type InjectTypeGM = {
  playground: Playground
  isMyTurn: boolean
  isRoundFinished: boolean
  isGameFinished: boolean
  start(roomId: string): Promise<void>
  init(roomId: string): Promise<void>
  reJoin(uid: string): Promise<void>
  next(roomId: string): Promise<void>
  acceptVote(roomId: string, voteResult: string): Promise<void>
  close(roomId: string): Promise<void>
  initialize(): void
  attachPlayground(roomId: string, playId: string): void
  detachPlayground(): void
  attachLineList(roomId: string, playId: string): void
  detachLineList(): void
}

declare module '@nuxt/types' {
  interface Context {
    $gm: InjectTypeGM
  }
  interface NuxtAppOptions {
    $gm: InjectTypeGM
  }
}
declare module 'vue/types/vue' {
  interface Vue {
    $gm: InjectTypeGM
  }
}
export type CurrentTurn = {
  round: number
  turn: number
  painter?: string
}
export type Vote = {
  id: string
  voteResult: string
  voteDate: Date
}
export type PlayUser = RoomUser & { order: number }
export type Playground = {
  id: string
  players: PlayUser[]
  watchers: RoomUser[]
  round: number
  currentTurn: CurrentTurn
  werewolf: string
  answer: string
  votes: Vote[]
  lastPainter: string
  result: 'painter' | 'werewolf' | ''
  createAt?: Date | firestore.Timestamp
  updateAt?: Date | firestore.Timestamp
}
// Firestore Document Data to Room Object
export const dataToPlayground = (data: firestore.DocumentData): Playground => {
  return {
    ...data,
    createAt:
      data.createAt && 'toDate' in data.createAt
        ? data.createAt.toDate()
        : undefined,
    updateAt:
      data.updateAt && 'toDate' in data.updateAt
        ? data.updateAt.toDate()
        : undefined,
  } as Playground
}
const sleep = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))
type State = {
  playground: Playground | undefined
  isRoundFinished: boolean
  isGameFinished: boolean
}
const initialState = {
  playground: undefined,
  isRoundFinished: false,
  isGameFinished: false,
} as State

/**********************************************
 * ゲーム管理用プラグイン
 * @param {Context} ctx
 * @param {(key: string, value: any) => void} inject
 */
const GameManagerPlugin: Plugin = (ctx, inject) => {
  /**
   * Observable properties
   */
  const state = Vue.observable({
    ...initialState,
  } as State)
  function _stateInit(): void {
    state.playground = initialState.playground
    state.isGameFinished = initialState.isGameFinished
    state.isRoundFinished = initialState.isRoundFinished
  }

  /******************************
   * ゲーム開始
   * @param {string} roomId
   */
  async function start(roomId: string): Promise<void> {
    // Start transaction.
    await ctx.app.$fireStore.runTransaction(async (trn) => {
      const roomDocRef = ctx.app.$fireStore
        .collection('rooms' as CollectionName)
        .doc(roomId)

      // 現在の部屋情報を取得
      const roomSnap = await trn.get(roomDocRef)
      if (!roomSnap.exists) throw new Error(`Not found room. ${roomDocRef.id}`)
      const room = dataToRoom(roomSnap.data()!)
      trn.set(roomDocRef, {
        ...room,
        status: 'play',
        updateAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
        createAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
      })

      // playground payload
      const roomPlayers = room.playersStatus.filter(
        (e) => e.status === 'online'
      )
      const shufflePlayers = shuffle(roomPlayers).map((e, i) => ({
        ...e,
        order: i,
      }))
      const ansewrs = (ThemeMap as ThemeMap)[room.category].find(
        (e) => e.theme === room.theme
      )?.answer
      const answer = ansewrs![Math.floor(Math.random() * ansewrs!.length)]

      const playground: Playground = {
        id: `${ctx.$dayjs().format('YYYYMMDDHHmmss')}${uuid().replace(
          /-/g,
          ''
        )}`,
        players: shufflePlayers,
        watchers: room.watchers,
        round: room.round,
        currentTurn: {
          round: 1,
          turn: 1,
          painter: shufflePlayers[0].id,
        },
        werewolf:
          room.playersStatus[
            Math.floor(Math.random() * room.playersStatus.length)
          ].id,
        answer,
        votes: [],
        result: '',
        lastPainter: '',
      }
      const playgroundDocRef = roomDocRef
        .collection('playground' as CollectionName)
        .doc(playground.id)
      return trn.set(playgroundDocRef, {
        ...playground,
        updateAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
        createAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
      } as Playground)
    })
  }

  /******************************
   * ゲーム初期処理
   * @param {string} roomId
   */
  async function init(roomId: string): Promise<void> {
    _stateInit()
    const playgroundCollectionRef = ctx.app.$fireStore
      .collection('rooms' as CollectionName)
      .doc(roomId)
      .collection('playground' as CollectionName)
      .limit(1)
    await playgroundCollectionRef.get().then(async (snap) => {
      if (snap.empty) return
      const playground = dataToPlayground(snap.docs[0].data())
      state.playground = playground
      await _initMessage(roomId, playground)
    })
  }
  // 初期メッセージ
  async function _initMessage(
    roomId: string,
    playground: Playground
  ): Promise<void> {
    ctx.$messages.pushSystemMessage(
      { body: SystemMessage.INFO_FOR_A_GAME_START, roomId },
      'all'
    )
    await sleep()
    ctx.$messages.pushSystemMessage(
      { body: SystemMessage.INFO_FOR_P_YOUR_PAINTER, roomId },
      'paiter'
    )
    ctx.$messages.pushSystemMessage(
      { body: SystemMessage.INFO_FOR_W_YOUR_WEREWOLF, roomId },
      'werewolf'
    )
    await sleep()
    ctx.$messages.pushSystemMessage(
      {
        body: SystemMessage.INFO_FOR_P_ANSWER(playground.answer),
        roomId,
      },
      'paiter'
    )
    // 自身が最初のユーザーの場合、アナウンス
    if (playground.players[0].id === ctx.app.$accessor.auth.user.id) {
      await sleep()
      ctx.$messages.pushSystemMessage(
        {
          body: SystemMessage.INFO_FOR_A_YOUR_TURN,
          roomId,
        },
        'all'
      )
    }
  }

  /******************************
   * 再度入室する時の処理
   * @param {string} uid
   */
  async function reJoin(uid: string): Promise<void> {
    // 自身が参加している遊戯中の部屋を検索
    const roomCollectionRef = ctx.app.$fireStore
      .collection('rooms' as CollectionName)
      .where('players', 'array-contains', uid)
      .where('status', '==', 'play' as RoomStatus)
      .limit(1)
    const roomSnap = await roomCollectionRef.get()
    if (roomSnap.empty) throw new Error('Not joined.')
    const room = dataToRoom(roomSnap.docs[0].data())
    ctx.$room.info = room
    // 部屋情報をアタッチ
    ctx.$room.attachRoom(room.id)
    // 存在する場合、プレイグラウンドを取得
    const playgroundRef = roomSnap.docs[0].ref.collection(
      'playground' as CollectionName
    )
    const playgroundSnap = await playgroundRef.get()
    if (playgroundSnap.empty) throw new Error('Not joined.')
    const playground = dataToPlayground(playgroundSnap.docs[0].data())
    state.playground = playground
  }

  /******************************
   * 次のターンへ進める
   * @param {string} roomId
   */
  async function next(roomId: string): Promise<void> {
    // Start transaction.
    await ctx.app.$fireStore.runTransaction(async (trn) => {
      const playgroundDocRef = ctx.app.$fireStore
        .collection('rooms' as CollectionName)
        .doc(roomId)
        .collection('playground' as CollectionName)
        .doc(state.playground?.id)
      const playgroundSnap = await trn.get(playgroundDocRef)
      if (!playgroundSnap.exists) return
      const playground = dataToPlayground(playgroundSnap.data()!)

      let currentUserStatus: 'online' | 'offline' | undefined
      do {
        const currentPlayerIdx = playground.players.findIndex(
          (e) => e.id === playground.currentTurn.painter
        )
        if (playground.players[currentPlayerIdx + 1]) {
          // 次のユーザーへ切り替え
          playground.currentTurn.painter =
            playground.players[currentPlayerIdx + 1].id
          playground.currentTurn.turn++
        } else if (playground.currentTurn.round === playground.round) {
          // ラウンド終了
          playground.lastPainter = playground.currentTurn.painter || ''
          playground.currentTurn.painter = ''
        } else {
          // ラウンドを進めて先頭のユーザーへ切り替え
          playground.currentTurn.painter = playground.players[0].id
          playground.currentTurn.turn++
          playground.currentTurn.round = playground.currentTurn.round + 1
        }
        currentUserStatus =
          playground.players.find(
            (e) => e.id === playground.currentTurn.painter
          )?.status || undefined

        // offlineユーザーの場合、次へ
      } while (
        currentUserStatus === 'offline' &&
        playground.currentTurn.painter !== ''
      )
      state.playground = playground
      return trn.set(playgroundDocRef, {
        ...playground,
        updateAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
      })
    })
  }

  /******************************
   * 投票システム
   * @param {string} roomId
   * @param {string} voteResult
   */
  async function acceptVote(roomId: string, voteResult: string): Promise<void> {
    // Start transaction.
    await ctx.app.$fireStore.runTransaction(async (trn) => {
      const playgroundDocRef = ctx.app.$fireStore
        .collection('rooms' as CollectionName)
        .doc(roomId)
        .collection('playground' as CollectionName)
        .doc(state.playground?.id)
      const playgroundSnap = await trn.get(playgroundDocRef)
      if (!playgroundSnap.exists) return
      const playground = dataToPlayground(playgroundSnap.data()!)
      // 投票済の場合
      const findIdx = playground.votes.findIndex(
        (e) => e.id === ctx.app.$accessor.auth.user.id
      )
      if (findIdx !== -1) return

      // vote payload
      const vote: Vote = {
        id: ctx.app.$accessor.auth.user.id,
        voteResult,
        voteDate: ctx.$dayjs().toDate(),
      }
      // 最後の投票の場合、結果を判定する
      if (playground.votes.length + 1 === playground.players.length) {
        playground.result = _judgment({
          ...playground,
          votes: [...playground.votes, vote],
        })
      }
      return trn.update(playgroundDocRef, {
        ...playground,
        votes: ctx.app.$fireStoreObj.FieldValue.arrayUnion(vote),
        updateAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
      })
    })
  }

  /******************************
   * 勝敗を決定する
   * @param {Playground} playground
   */
  function _judgment(playground: Playground): '' | 'painter' | 'werewolf' {
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
    const sumVotes = groupBy(playground.votes, (v) => v.voteResult)
    // 投票数の最大値
    const maxVoteCount = sumVotes
      .map((v) => v[1].length)
      .sort((a, b) => b - a)[0]
    // 一番投票された人（複数有り）
    const topMembers = sumVotes
      .filter((v) => v[1].length === maxVoteCount)
      .map((v) => v[0])
    // 人狼の答え
    const werewolfAnswer = playground.votes.find(
      (e) => e.id === state.playground!.werewolf
    )?.voteResult
    // 上記に人狼が含まれる場合、画家陣営の勝ち
    const result = topMembers.includes(state.playground!.werewolf)
      ? state.playground?.answer === werewolfAnswer
        ? 'werewolf'
        : 'painter'
      : 'werewolf'
    return result
  }

  /******************************
   * クローズ処理
   * @param {string} roomId
   */
  async function close(roomId: string): Promise<void> {
    // 結果メッセージの出力
    if (state.playground?.result !== '') {
      ctx.$messages.pushSystemMessage(
        { body: SystemMessage.INFO_FOR_A_ALL_VOTED, roomId },
        'all'
      )
      setTimeout(() => {}, 1000)
      state.playground?.result === 'painter'
        ? ctx.$messages.pushSystemMessage(
            { body: SystemMessage.INFO_FOR_A_WIN_PAINTER, roomId },
            'all'
          )
        : ctx.$messages.pushSystemMessage(
            { body: SystemMessage.INFO_FOR_A_WIN_WEREWOLF, roomId },
            'all'
          )
    }
    // 部屋をクローズする
    if (ctx.$room.info.status !== 'close') {
      // Start transaction.
      await ctx.app.$fireStore.runTransaction(async (trn) => {
        const roomDocRef = ctx.app.$fireStore
          .collection('rooms' as CollectionName)
          .doc(roomId)
        const roomSnap = await trn.get(roomDocRef)
        if (!roomSnap.exists) return
        const room = dataToRoom(roomSnap.data()!)
        if (room.status === 'close') return
        trn.update(roomDocRef, {
          status: 'close',
          updateAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
        })
      })
    }
  }

  let _playgroundConnection: () => void | undefined
  /******************************
   * ゲーム情報をアタッチする
   * @param {string} roomId
   * @param {string} playId
   */
  function attachPlayground(roomId: string, playId: string): void {
    // detachRoom()

    _playgroundConnection = ctx.app.$fireStore
      .collection('rooms' as CollectionName)
      .doc(roomId)
      .collection('playground' as CollectionName)
      .doc(playId)
      .onSnapshot((doc) => {
        const data = doc.data()
        if (doc.exists && data !== undefined) {
          state.playground = dataToPlayground(data)
        }
      })
  }
  /******************************
   * ゲーム情報をデタッチする
   */
  function detachPlayground(): void {
    if (_playgroundConnection) _playgroundConnection()
    state.playground = undefined
  }

  let _lineListConnection: () => void | undefined
  /******************************
   * 描画情報をアタッチする
   * 追加があった場合、自動でキャンバスに描画する
   * @param {string} roomId
   * @param {string} playId
   */
  function attachLineList(roomId: string, playId: string): void {
    _lineListConnection = ctx.app.$fireStore
      .collection('rooms' as CollectionName)
      .doc(roomId)
      .collection('playground' as CollectionName)
      .doc(playId)
      .collection('lines' as CollectionName)
      .orderBy('createAt')
      .onSnapshot((snap) => {
        snap.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            await ctx.$canvas.loadLine(change.doc.data())
          }
        })
      })
  }
  /******************************
   * 描画情報をデタッチする
   */
  function detachLineList(): void {
    if (_lineListConnection) _lineListConnection()
  }

  inject('gm', {
    get playground() {
      return state.playground
    },
    get isMyTurn(): boolean {
      if (!state.playground || state.playground.currentTurn?.painter === '')
        return false
      return (
        state.playground!.currentTurn?.painter ===
        ctx.app.$accessor.auth.user.id
      )
    },
    get isRoundFinished(): boolean {
      return state.isRoundFinished
    },
    set isRoundFinished(flag: boolean) {
      state.isRoundFinished = flag
    },
    get isGameFinished(): boolean {
      return state.isGameFinished
    },
    set isGameFinished(flag: boolean) {
      state.isGameFinished = flag
    },
    start,
    init,
    reJoin,
    next,
    acceptVote,
    close,
    attachPlayground,
    detachPlayground,
    attachLineList,
    detachLineList,
  })
}

export default GameManagerPlugin
