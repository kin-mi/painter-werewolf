import { getAccessorType } from 'typed-vuex'
import * as auth from '~/store/auth'

export const state = () => ({})
export type RootState = ReturnType<typeof state>

export const getters = {}

export const mutations = {}

export const actions = {}

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    auth,
  },
})
