import { getRolePermissions } from '@/api'
// import { getCookie } from '@/utils/cookie'

const RECEIVE_USER_RULE = 'RECEIVE_USER_RULE'
const CALL_API_LOADING = 'CALL_API_LOADING'
const USER_TOKEN_ERROR = 'USER_TOKEN_ERROR'
const USER_DATA_RECEIVED = 'USER_DATA_RECEIVED'

const formatRules = (data) => {
  console.log('data1234', data)
  let allowPage = []
  data.map(item => {
    if (item.component) {
      allowPage.push(item.component.toUpperCase())
    }
  })
  return {
    allowPage
  }
}

export default {
  state: {
    profile: null,
    isRecieved: false,
    isLogin: false,
    ruleList: [],
    allowPage: [],
    pageWhiteList: [
      'LOGIN', 'HOME', 'DASHBOARD', 'WELCOME', 'LOGIN'
    ]
  },
  actions: {
    getRolePermissions ({ commit }, payload) {
      commit('CALL_API_LOADING', true)
      const user = {
        mg_name: localStorage.getItem('mg_name') || '',
        mg_pwd: localStorage.getItem('mg_pwd') || '',
        mg_state: localStorage.getItem('mg_state') || '',
        role_id: localStorage.getItem('role_id') || ''
      }
      getRolePermissions(user).then((res) => {
        if (String(res.error_code) === '0') {
        //   getCookie('user')
          const rules = formatRules(res.data)
          commit('RECEIVE_USER_RULE', rules)
        } else if (String(res.error_code) === '110') {
        // token 錯誤
          commit('USER_TOKEN_ERROR', true)
        }
        commit('CALL_API_LOADING', false)
      })
    }
  },
  mutations: {
    [RECEIVE_USER_RULE] (state, result) {
      state.allowPage = result.allowPage
      state.isLogin = true
      state.isRecieved = true
    },
    [CALL_API_LOADING] (state, val) {
      state.isAjaxLoading = val
    },
    [USER_DATA_RECEIVED] (state, val) {
      state.isRecieved = val
    },
    [USER_TOKEN_ERROR] (state, val) { // Token 錯誤登出
      state.userTokenErr = val
      // state.isRecieved = true
      state.isLogin = false
      state.profile = null
    }
  }
}
