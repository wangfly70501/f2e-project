const CALL_API_LOADING = 'CALL_API_LOADING'

export default {
  state: {
    isAjaxLoading: false
  },
  actions: {
  },
  mutations: {
    [CALL_API_LOADING] (state, val) {
      state.isAjaxLoading = val
    }
  }
}
