import Vue from 'vue'
import Vuex from 'vuex'
import common from './common'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    siteInfo: {
      name: 'Btcbox.com.tw'
    }
  },
  getters: {
    isAuthed: state => state.user.isRecieved,
    allowPage: state => state.user.allowPage,
    pageWhiteList: state => state.user.pageWhiteList
  },
  mutations: {},
  actions: {},
  modules: {
    common,
    user
  }
})
