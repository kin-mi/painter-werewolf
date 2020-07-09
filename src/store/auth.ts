import { getterTree, mutationTree, actionTree } from 'typed-vuex'

export declare type User = {
  id: string
  displayName: string
  playerName: string
  photoURL: string
}

export const state = () => ({
  user: {} as User,
  loggedIn: false,
  ready: false,
})

export const getters = getterTree(state, {
  user: (state) => state.user,
  isLoggedIn: (state) => state.loggedIn,
  isReady: (state) => state.ready,
})

export const mutations = mutationTree(state, {
  ON_AUTH_STATE_CHANGED_MUTATION(
    state,
    { authUser }: { authUser: firebase.User }
  ): void {
    if (authUser) {
      state.user = {
        ...state.user,
        id: authUser.uid,
        displayName: authUser.displayName || '',
        photoURL: authUser.photoURL || '',
      } as User
    }
    state.ready = true
  },
  SET_USER(state, payload: User): void {
    state.loggedIn = true
    state.user = payload
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async asyncAuth({ getters, commit }): Promise<string> {
      // 認証状態の監視 （待機 最大1秒）
      const waitReady = (nowSec: number): Promise<string> => {
        if (nowSec > 1000) {
          // time over
          throw new Error('Time over.')
        }
        setTimeout(() => {}, 50)
        if (getters.isReady) {
          if (getters.user.id && !getters.user.playerName) {
            commit('SET_USER', {
              id: getters.user.id,
              displayName: getters.user.displayName || '',
              playerName: getters.user.displayName,
              photoURL: getters.user.photoURL,
            })
            // already logged in
            return new Promise<string>((resolve) =>
              resolve('already logged in')
            )
          } else if (getters.user.playerName) {
            // from Login page
            return new Promise<string>((resolve) =>
              resolve('already logged in')
            )
          } else {
            // not logged in
            throw new Error('not logged in')
          }
        }
        // not ready
        return waitReady(nowSec + 50)
      }
      const result = await waitReady(0)
      return result
    },
  }
)
