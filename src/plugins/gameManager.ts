import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { v4 as uuid } from 'uuid'
import { firestore } from 'firebase'
import { RoomUser, dataToRoom } from './room'
import { CollectionName } from '~/utils/constant'
import { shuffle } from '~/utils/array'

type InjectTypeGM = {
  playground: Playground
  start(roomId: string): Promise<void>
  init(roomId: string): Promise<void>
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
type PlayUser = RoomUser & { order: number }
export type Playground = {
  id: string
  players: PlayUser[]
  watchers: RoomUser[]
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

type State = {
  playground: Playground | undefined
}

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
    playground: undefined,
  } as State)

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
      const playground = {
        id: `${ctx.$dayjs().format('YYYYMMDDHHmmss')}${uuid().replace(
          /-/g,
          ''
        )}`,
        players: shuffle(room.players).map((e, i) => ({ ...e, order: i })),
        watchers: room.watchers,
      } as Playground
      const playgroundRef = roomDocRef
        .collection('playground' as CollectionName)
        .doc(playground.id)
      trn.set(playgroundRef, {
        ...playground,
        updateAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
        createAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
      })
    })
  }

  /******************************
   * ゲーム初期処理
   * @param {string} roomId
   */
  async function init(roomId: string): Promise<void> {
    const playgroundCollectionRef = ctx.app.$fireStore
      .collection('rooms' as CollectionName)
      .doc(roomId)
      .collection('playground' as CollectionName)
      .limit(1)
    await playgroundCollectionRef.get().then((snap) => {
      if (snap.empty) return
      snap.forEach((doc) => {
        const data = doc.data()
        state.playground = dataToPlayground(data)
      })
    })
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
        snap.docChanges().forEach((change) => {
          if (change.type === 'added') {
            ctx.$canvas.loadLine(change.doc.data()!.line)
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
    start,
    init,
    attachPlayground,
    detachPlayground,
    attachLineList,
    detachLineList,
  })
}

export default GameManagerPlugin
