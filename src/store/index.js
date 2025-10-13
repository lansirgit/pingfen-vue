import { removeToken } from '@/utils/auth'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    sighOut() {
      removeToken
    }
  },
  modules: {
  }
})
