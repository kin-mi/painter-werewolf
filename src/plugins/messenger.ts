import Vue from 'vue'
import { Plugin } from '@nuxt/types'

declare module '@nuxt/types' {
  interface Context {
    $messages: {
      get(): Message[]
      push(body: string): void
      listen(): void
    }
  }
  interface NuxtAppOptions {
    $messages: {
      get(): Message[]
      push(body: string): void
      listen(): void
    }
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $messages: {
      get(): Message[]
      push(body: string): void
      listen(): void
    }
  }
}

export type Message = {
  id: string
  playerName: string
  body: string
  createAt: Date
}
type State = {
  messages: Message[]
}

const MessengerPlugin: Plugin = (ctx, inject) => {
  const state = Vue.observable({
    messages: [],
  } as State)

  const push = async (body: string) => {
    const msg = {
      id: ctx.app.$accessor.auth.user.id,
      playerName: ctx.app.$accessor.auth.user.playerName,
      body,
    } as Message
    await ctx.app.$fireStore.collection('messages').add({
      ...msg,
      createAt: ctx.app.$fireStoreObj.FieldValue.serverTimestamp(),
    })
  }

  const listen = () => {
    ctx.app.$fireStore
      .collection('messages')
      .orderBy('createAt')
      .onSnapshot({ includeMetadataChanges: true }, (snap) => {
        snap.docChanges().forEach((change) => {
          const data = change.doc.data()
          const snapMsg = {
            id: data.id,
            playerName: data.playerName,
            body: data.body,
            createAt: data.createAt?.toDate(),
          } as Message
          const idx = state.messages.findIndex(
            (msg) =>
              msg.id === data.id &&
              msg.body === data.body &&
              msg.createAt === data.createAt?.toDate()
          )
          if (
            change.type === 'added' &&
            (idx === -1 || data.createAt === null)
          ) {
            state.messages.push(snapMsg)
          } else if (change.type === 'modified') {
            state.messages.splice(idx, 1, snapMsg)
          }
        })
      })
  }

  inject('messages', {
    get() {
      return state.messages
    },
    push,
    listen,
  })
}

export default MessengerPlugin
