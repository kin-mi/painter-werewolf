import { getterTree, mutationTree, actionTree } from 'typed-vuex'

export declare type User = {
  id: string
  displayName: string
  playerName: string
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
    // getOlder({ getters, commit }): boolean {
    //   const currentAge = getters.age
    //   commit('setAge', currentAge + 1)
    //   return true
    // },
  }
)
