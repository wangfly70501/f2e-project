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
/* import VueQuillEditor from 'vue-quill-editor' // 富文本编辑器 */
import './assets/fonts/fontawes.js'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/fonts/icon.css'
import htmlToPdf from './htmlToPdf.js'
import locale from 'element-ui/lib/locale/lang/zh-TW.js'
import toExcel from './json2excel'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faGooglePlus } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import YimoVueEditor from 'yimo-vue-editor'

library.add(faCoffee, faGooglePlus)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(YimoVueEditor, {
  name: 'v-editor-app', // Custom name
  config: {
    uploadImgUrl: 'http://192.168.50.105:7777/bankendapi?method=faqTest', // upload api
    printLog: false // disabled console.log
    // lang config
  }, // wagnEditor config
  uploadHandler: (type, resTxt) => { // Upload processing hook
    if (type === 'success') {
      var res = JSON.parse(resTxt)// Do not process the default look at the return value bit image path
      if (res.status !== 1) {
        return null
      }
      return res.data
    } else if (type === 'error') {
      // todo toast
    } else if (type === 'timeout') {
      // todo toast
    }
    return 'upload failed__'
  }
})
Vue.prototype.$toExcel = toExcel
Vue.use(htmlToPdf)
Vue.use(ElementUI, { locale })
// 树型表格插件
Vue.use(ZkTable)

// axios处理
// 在 request 拦截器中，展示进度条 NProgress.start()
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
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
/* Vue.use(VueQuillEditor) */

Vue.component('TopBreadcrumb', TopBreadcrumb)
Vue.component('SearchTool', SearchTool)

Vue.filter('phoneformat', function (val) {
  let str = [null, undefined, '']
  if (!str.includes(val) && val.length > 9) {
    let valLen = val.length
    const numt = 1
    const num = 2
    let numf = 2
    if (valLen > 26) {
      numf = numf * 2
    }
    if (valLen % 2 === 0) {
      return val.substring(0, valLen / num - numf) + '****' + val.substring((valLen / num) + numf)
    } else {
      valLen += numt
      return val.substring(0, (valLen / num) - numf - numt) + '****' + val.substring((valLen / num) + numf - numt)
    }
  } else {
    return val
  }
})
/* Vue.filter('phoneformat', function (param) {
  var strlen = param.length
  if (strlen < 9) {
    return strlen
  }
  return param.replace(/^(.{6})(?:\d+)(.{4})$/, '$1******$2')
}) */

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
