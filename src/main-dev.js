import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'
import TopBreadcrumb from './components/TopBreadcrumb.vue'
import SearchTool from './components/SearchTool.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css' // 阿里巴巴图标库
import VueQuillEditor from 'vue-quill-editor' // 富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/fonts/icon.css'
import htmlToPdf from './htmlToPdf.js'
import locale from 'element-ui/lib/locale/lang/zh-TW.js'
import toExcel from './json2excel'

Vue.prototype.$toExcel = toExcel
Vue.use(htmlToPdf)
Vue.use(ElementUI, { locale })
// 树型表格插件
Vue.use(ZkTable)

// axios处理
// 在 request 拦截器中，展示进度条 NProgress.start()
axios.defaults.baseURL = 'http://192.168.50.105:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(response => {
  NProgress.done()
  return response
})
Vue.prototype.$http = axios

// 注册富文本编辑器为全局组件
Vue.use(VueQuillEditor)

Vue.component('TopBreadcrumb', TopBreadcrumb)
Vue.component('SearchTool', SearchTool)

Vue.filter('dateFormat', function (val) {
  const dt = new Date(val)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.filter('datefformat', function (val) {
  const dt = new Date(val)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}`
})

// 千分位
Vue.filter('NumFormat', function (value) {
  if (!value) return ' '

  var intPart = Number(value).toFixed(0) // 获取整数部分

  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断

  return intPartFormat
}

)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
