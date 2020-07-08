import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { CollectionName } from '~/utils/constant'

type InjectTypeMessenger = {
  list: Message[]
  push(params: MessageParams): void
  pushSystemMessage(params: MessageParams, target: MessageFor): void
  attachMessageList(roomId: string): void
  detachMessageList(): void
  attachJobMessageList(roomId: string, job: 'painter' | 'werewolf'): void
  detachJobMessageList(): void
}

declare module '@nuxt/types' {
  interface Context {
    $messages: InjectTypeMessenger
  }
  interface NuxtAppOptions {
    $messages: InjectTypeMessenger
  }
}
declare module 'vue/types/vue' {
  interface Vue {
    $messages: InjectTypeMessenger
  }
}

export type MessageFor = 'all' | 'paiter' | 'werewolf'
export type Message = {
  id: string
  playerName: string
  color: string
  body: string
  target: MessageFor
  createAt: Date
}
type MessageParams = Pick<Message, 'body'> & {
  roomId: string
}
// compare messege
const _isEqualMsg = (
  msg: Message,
  data: firebase.firestore.DocumentData
): boolean => {
  return (
    msg.id === data.id &&
    msg.body === data.body &&
    msg.createAt === data.createAt?.toDate()
  )
}

// Firestore Document Data to Message Object
const _dataToMessage = (data: any): Message => {
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
  } as Message
}

type State = {
  messages: Message[]
}

/**********************************************
 * メッセンジャー用プラグイン
 * @param {Context} ctx
 * @param {(key: string, value: any) => void} inject
 */
const MessengerPlugin: Plugin = (ctx, inject) => {
  /**
   * Observable properties
   */
  const state = Vue.observable({
    messages: [] as Message[],
  } as State)

  /******************************
   * メッセージを追加する
   * @param {MessageParams} params
   */
  async function push(params: MessageParams) {
    const roomDocRef = ctx.app.$fireStore
      .collection('rooms' as CollectionName)
      .doc(params.roomId)

    // message payload
    const msg = {
      id: ctx.app.$accessor.auth.user.id,
      playerName: ctx.app.$accessor.auth.user.playerName,
      color:
        ctx.$room.info.playersStatus.find((e) => {
          return e.id === ctx.app.$accessor.auth.user.id
        })?.color || '#000',
      body: params.body,
      target: 'all',
    } as Message
    // post message
    await roomDocRef.collection('messages' as CollectionName).add({
      ...msg,
      createAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
    })
  }

  /******************************
   * システムメッセージを追加する
   * @param {MessageParams} params
   * @param {MessageFor} for
   */
  function pushSystemMessage(params: MessageParams, target: MessageFor): void {
    const isWerewolf =
      ctx.app.$accessor.auth.user.id === ctx.$gm.playground?.werewolf
    if (target === 'paiter' && isWerewolf) return
    if (target === 'werewolf' && !isWerewolf) return
    // message payload
    const msg = {
      id: 'SYSTEM',
      playerName: 'ゲームマスター',
      color: '#674129',
      body: params.body,
      target,
      createAt: ctx.$dayjs().toDate(),
    } as Message
    // post message
    state.messages.push(msg)
  }

  let _messageListConnection: () => void | undefined
  /******************************
   * メッセージリストをアタッチする
   * @param {string} roomId
   */
  function attachMessageList(roomId: string): void {
    // detachMessageList()
    const roomDocRef = ctx.app.$fireStore
      .collection('rooms' as CollectionName)
      .doc(roomId)

    _messageListConnection = roomDocRef
      .collection('messages' as CollectionName)
      .where('target', '==', 'all')
      .orderBy('createAt')
      .onSnapshot({ includeMetadataChanges: true }, (snap) => {
        snap.docChanges().forEach((change) => {
          const data = change.doc.data()
          const msg = _dataToMessage(data)
          const idx = state.messages.findIndex((msg) => _isEqualMsg(msg, data))
          switch (change.type) {
            case 'added':
              if (idx === -1) state.messages.push(msg)
              break
            case 'modified':
              state.messages.splice(idx, 1, msg)
              break
            case 'removed':
              state.messages.splice(idx, 1)
              break
          }
        })
      })
  }
  /******************************
   * メッセージリストをデタッチする
   */
  function detachMessageList(): void {
    if (_messageListConnection) {
      _messageListConnection()
      state.messages = [] as Message[]
    }
  }

  let _jobMessageListConnection: () => void | undefined
  /******************************
   * 役職毎のメッセージリストをアタッチする
   * @param {string} roomId
   * @param {'painter' | 'werewolf'} job
   */
  function attachJobMessageList(
    roomId: string,
    job: 'painter' | 'werewolf'
  ): void {
    // detachMessageList()
    const roomDocRef = ctx.app.$fireStore
      .collection('rooms' as CollectionName)
      .doc(roomId)

    _jobMessageListConnection = roomDocRef
      .collection('messages' as CollectionName)
      .where('target', '==', job)
      .orderBy('createAt')
      .onSnapshot({ includeMetadataChanges: true }, (snap) => {
        snap.docChanges().forEach((change) => {
          const data = change.doc.data()
          const msg = _dataToMessage(data)
          const idx = state.messages.findIndex((msg) => _isEqualMsg(msg, data))
          switch (change.type) {
            case 'added':
              if (idx === -1) state.messages.push(msg)
              break
            case 'modified':
              state.messages.splice(idx, 1, msg)
              break
            case 'removed':
              state.messages.splice(idx, 1)
              break
          }
        })
      })
  }
  /******************************
   * 役職毎のメッセージリストをデタッチする
   */
  function detachJobMessageList(): void {
    if (_jobMessageListConnection) {
      _jobMessageListConnection()
    }
  }
  inject('messages', {
    get list() {
      return state.messages
    },
    push,
    pushSystemMessage,
    attachMessageList,
    detachMessageList,
    attachJobMessageList,
    detachJobMessageList,
  })
}

export default MessengerPlugin
