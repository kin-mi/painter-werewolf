import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { v4 as uuid } from 'uuid'
import { firestore } from 'firebase'
import {
  RoomStatus,
  UserStatus,
  CollectionName,
  userColors,
  UserColors,
} from '~/utils/constant'

type InjectTypeRoom = {
  info: Room
  list: Room[]
  create(options: CreateParams): Promise<void>
  join(roomId: string): Promise<void>
  watch(roomId: string): Promise<void>
  exit(roomId: string): Promise<void>
  close(roomId: string): Promise<void>
  attachRoom(roomId: string): void
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
  status: UserStatus
  color: UserColors
}
export type Room = {
  id: string
  status: RoomStatus
  players: RoomUser[]
  watchers: RoomUser[]
  createAt?: Date | firestore.Timestamp
  updateAt?: Date | firestore.Timestamp
  // ↓Parameters
  message: string
  turn: number
  limitPlayers: number
  watch: boolean
  chat: boolean
}
type CreateParams = Pick<
  Room,
  'message' | 'turn' | 'limitPlayers' | 'watch' | 'chat'
>

// Firestore Document Data to Room Object
export const dataToRoom = (data: firestore.DocumentData): Room => {
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
   * 部屋を作成する
   * @param {CreateParams} params
   */
  async function create(params: CreateParams): Promise<void> {
    const user = ctx.app.$accessor.auth.user
    // room payload
    const room = {
      id: `${ctx.$dayjs().format('YYYYMMDDHHmmss')}${uuid().replace(/-/g, '')}`,
      players: [
        {
          id: user.id,
          playerName: user.playerName,
          status: 'online',
          color: userColors.black,
        } as RoomUser,
      ],
      watchers: [],
      status: 'wait',
      ...params,
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
   * 部屋に参加する
   * @param {string} roomId
   */
  async function join(roomId: string): Promise<void> {
    const roomDocRef = ctx.app.$fireStore.collection('rooms').doc(roomId)
    const roomDoc = await roomDocRef.get()
    if (!roomDoc.exists) return

    const user = ctx.app.$accessor.auth.user
    const room = dataToRoom(roomDoc.data()!)
    const userPayload = {
      id: user.id,
      playerName: user.playerName,
      status: 'online',
      color: _findNextColor(room),
    } as RoomUser

    const currentRoom = await _updateUserStatus(roomDocRef, userPayload)

    // set current room
    state.currentRoom = currentRoom!
  }
  // 次の色を探す
  function _findNextColor(room: Room): UserColors {
    const alreadyExistsColors = room.players
      .filter((e) => e.status === 'online')
      .map((e) => e.color)
    console.log(alreadyExistsColors)
    console.log(Object.values(userColors))
    console.log(
      Object.values(userColors).find((e) => !alreadyExistsColors.includes(e))
    )
    return (
      Object.values(userColors).find((e) => !alreadyExistsColors.includes(e)) ||
      userColors.black
    )
  }

  /******************************
   * 部屋から退出する
   * @param {string} roomId
   */
  async function exit(roomId: string): Promise<void> {
    const user = ctx.app.$accessor.auth.user
    const joinedUser =
      state.currentRoom.players.find(
        (e) => e.id === user.id && e.status === 'online'
      ) ||
      state.currentRoom.watchers.find(
        (e) => e.id === user.id && e.status === 'online'
      )
    if (!joinedUser) return

    const roomDocRef = ctx.app.$fireStore.collection('rooms').doc(roomId)

    const userPayload = {
      ...joinedUser,
      status: 'exit',
    } as RoomUser

    await _updateUserStatus(roomDocRef, userPayload)

    // set current room
    state.currentRoom = {} as Room
  }

  // 部屋にいるユーザーステータスを更新する
  async function _updateUserStatus(
    roomDocRef: firestore.DocumentReference,
    user: RoomUser
  ): Promise<Room | undefined> {
    let room: Room | undefined
    // Start transaction.
    await ctx.app.$fireStore.runTransaction(async (trn) => {
      // 現在の部屋情報を取得
      const roomSnap = await trn.get(roomDocRef)
      if (!roomSnap.exists) throw new Error(`Not found room. ${roomDocRef.id}`)
      room = dataToRoom(roomSnap.data()!)
      console.log('user', user)
      console.log('room.players', room.players)
      const targetUserIdx = room.players.findIndex(
        (e) => e.id === user.id && e.status === 'online'
      )
      if (targetUserIdx !== -1) {
        room.players.splice(targetUserIdx, 1, user)
      } else {
        room.players.push(user)
      }
      trn.update(roomDocRef, {
        players: room.players,
        updateAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
      } as Room)
    })
    return room
  }

  /******************************
   * 部屋を閉じる
   * @param {string} roomId
   */
  async function close(roomId: string): Promise<void> {
    // parameter check
    const doc = await ctx.app.$fireStore.collection('rooms').doc(roomId).get()
    if (!doc.exists) return

    const room = dataToRoom(doc.data()!)
    // close room
    await ctx.app.$fireStore
      .collection('rooms')
      .doc(room.id)
      .update({
        status: 'close' as RoomStatus,
        updateAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
      })
    // set current room
    state.currentRoom = {} as Room
  }

  let _roomConnection: () => void | undefined
  /******************************
   * 部屋情報をアタッチする
   * @param {string} roomId
   */
  function attachRoom(roomId: string): void {
    // detachRoom()

    _roomConnection = ctx.app.$fireStore
      .collection('rooms' as CollectionName)
      .doc(roomId)
      .onSnapshot((doc) => {
        const data = doc.data()
        if (doc.exists && data !== undefined) {
          state.currentRoom = dataToRoom(data)
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
    // detachList()

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
    const romm = dataToRoom(data)
    const idx = state.list.findIndex((e) => e.id === romm.id)
    switch (change.type) {
      case 'added':
        if (idx !== -1) break
        state.list.push(romm)
        break
      case 'modified':
        if (idx === -1) break
        state.list.splice(idx, 1, romm)
        break
      case 'removed':
        if (idx === -1) break
        state.list.splice(idx, 1)
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
    get info() {
      return state.currentRoom
    },
    set info(arg: Room) {
      state.currentRoom = arg
    },
    get list(): Room[] {
      return state.list
    },
    create,
    join,
    exit,
    close,
    attachRoom,
    detachRoom,
    attachList,
    detachList,
  })
}

export default RoomPlugin
