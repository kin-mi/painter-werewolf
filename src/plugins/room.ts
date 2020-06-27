import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { v4 as uuid } from 'uuid'
import { firestore } from 'firebase'
import { RoomStatus, OnlineStatus, CollectionName } from '~/utils/constant'

type InjectTypeRoom = {
  get(): Room
  create(options: CreateParams): Promise<void>
  list: Room[]
  join(roomId: string): Promise<void>
  attachRoom(): void
  detachRoom(): void
  attachList(): void
  detachList(): void
}

declare module '@nuxt/types' {
  interface Context {
    $room: InjectTypeRoom
  }
  interface NuxtAppOptions {
    $room: InjectTypeRoom
  }
}
declare module 'vue/types/vue' {
  interface Vue {
    $room: InjectTypeRoom
  }
}

export type RoomUser = {
  id: string
  playerName: string
  status: OnlineStatus
}
export type Room = {
  id: string
  status: RoomStatus
  users: RoomUser[]
  watchers: RoomUser[]
  message: string
  turn: number
  limitPlayers: number
  watch: boolean
  chat: boolean
  createAt?: Date | firestore.Timestamp
  updateAt?: Date | firestore.Timestamp
}
type CreateParams = Pick<
  Room,
  'turn' | 'limitPlayers' | 'watch' | 'chat' | 'message'
>

// Firestore Document Data to Room Object
const _dataToRoom = (data: any): Room => {
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
  } as Room
}

type State = {
  currentRoom: Room
  list: Room[]
}

/**********************************************
 * 部屋管理用プラグイン
 * @param {Context} ctx
 * @param {(key: string, value: any) => void} inject
 */
const RoomPlugin: Plugin = (ctx, inject) => {
  /**
   * Observable properties
   */
  const state = Vue.observable({
    currentRoom: {} as Room,
    list: [] as Room[],
  } as State)

  /******************************
   * 新規部屋作成用関数
   * @param {CreateParams} params
   */
  async function create({
    message,
    turn,
    limitPlayers,
    watch,
    chat,
  }: CreateParams): Promise<void> {
    const user = ctx.app.$accessor.auth.user
    // room payload
    const room = {
      id: uuid().replace(/-/g, ''),
      users: [
        {
          id: user.id,
          playerName: user.playerName,
          status: 'online',
        } as RoomUser,
      ],
      status: 'wait',
      message,
      turn,
      limitPlayers,
      watch,
      chat,
    } as Room
    // create room
    await ctx.app.$fireStore
      .collection('rooms')
      .doc(room.id)
      .set({
        ...room,
        createAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
        updateAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
      })
    // set current room
    state.currentRoom = room
  }

  /******************************
   * 参加用関数
   * @param {string} roomId
   */
  async function join(roomId: string): Promise<void> {
    // parameter check
    const doc = await ctx.app.$fireStore.collection('rooms').doc(roomId).get()
    if (!doc.exists) return

    const room = _dataToRoom(doc.data())
    // add user payload
    const user = {
      id: ctx.app.$accessor.auth.user.id,
      playerName: ctx.app.$accessor.auth.user.playerName,
      status: 'online',
    } as RoomUser

    // join user
    await ctx.app.$fireStore
      .collection('rooms')
      .doc(room.id)
      .update({
        users: ctx.app.$fireStoreObj.FieldValue.arrayUnion(user),
        updateAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
      })
  }

  let _roomConnection: () => void | undefined
  /******************************
   * 部屋情報をアタッチする
   * @param {string} roomId
   */
  const attachRoom = (roomId: string): void => {
    _roomConnection = ctx.app.$fireStore
      .collection('rooms')
      .doc(roomId)
      .onSnapshot((doc) => {
        const data = doc.data()
        if (doc.exists && data !== undefined) {
          state.currentRoom = _dataToRoom(data)
        }
      })
  }
  /******************************
   * 部屋情報をデタッチする
   */
  function detachRoom(): void {
    if (_roomConnection) _roomConnection()
  }

  let _waitRoomListConnection: () => void | undefined
  let _playRoomListConnection: () => void | undefined
  /******************************
   * 部屋の一覧をアタッチする
   * @param {string} roomId
   */
  function attachList(): void {
    // 待機ステータスの部屋一覧
    _waitRoomListConnection = ctx.app.$fireStore
      .collection('rooms' as CollectionName)
      .where('status', '==', 'wait' as RoomStatus)
      .onSnapshot((snap) => {
        snap.docChanges().forEach((change) => {
          _setRoomList(change)
        })
      })
    // 遊戯中ステータスの部屋一覧
    _playRoomListConnection = ctx.app.$fireStore
      .collection('rooms' as CollectionName)
      .where('status', '==', 'play' as RoomStatus)
      .onSnapshot((snap) => {
        snap.docChanges().forEach((change) => {
          _setRoomList(change)
        })
      })
  }
  /******************************
   * 部屋の一覧をデタッチする
   */
  function detachList(): void {
    if (_waitRoomListConnection) _waitRoomListConnection()
    if (_playRoomListConnection) _playRoomListConnection()
  }
  const _setRoomList = (change: firebase.firestore.DocumentChange): void => {
    const data = change.doc.data() as Room
    const romm = _dataToRoom(data)
    switch (change.type) {
      case 'added':
        if (state.list.findIndex((e) => e.id === romm.id) === -1)
          state.list.push(romm)
        break
      case 'modified':
        state.list.splice(
          state.list.findIndex((e) => e.id === romm.id),
          1,
          romm
        )
        break
      case 'removed':
        state.list.splice(
          state.list.findIndex((e) => e.id === romm.id),
          1
        )
        break
    }
    state.list.sort((a, b) => {
      if (!a.createAt) return 1
      else if (!b.createAt) return -1
      const dateA = 'getTime' in a.createAt ? a.createAt.getTime() : 0
      const dateB = 'getTime' in b.createAt ? b.createAt?.getTime() : 0
      return dateB - dateA
    })
  }

  /**
   * Injection
   */
  inject('room', {
    get() {
      return state.currentRoom
    },
    get list(): Room[] {
      return state.list
    },
    create,
    join,
    attachRoom,
    detachRoom,
    attachList,
    detachList,
  })
}

export default RoomPlugin
