import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// 路由分组懒加载定义
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Welcome.vue')
const Forgetpsw = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Forgetpsw.vue')
const Resetpassword = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Resetpassword.vue')
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/maneger/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/maneger/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/maneger/Roles.vue')
const Charge = () => import(/* webpackChunkName: "service_Charges" */ '../views/charge/Charge.vue')
const Bankset = () => import(/* webpackChunkName: "service_Charges" */ '../views/charge/Bankset.vue')
const Deposit = () => import(/* webpackChunkName: "service_Charges" */ '../views/deposit/Deposit.vue')
const Member = () => import(/* webpackChunkName: "service_Charges" */ '../views/member/Member.vue')
const Membercatch = () => import(/* webpackChunkName: "service_Charges" */ '../views/member/Membercatch.vue')
const Blackmember = () => import(/* webpackChunkName: "service_Charges" */ '../views/member/blackmem.vue')
const Banner = () => import(/* webpackChunkName: "service_Charges" */ '../views/cms/Banner.vue')
const Realname = () => import(/* webpackChunkName: "service_Charges" */ '../views/review/Realname.vue')
const Realnamepic = () => import(/* webpackChunkName: "service_Charges" */ '../views/review/Realnamepic.vue')
const Withdrawlimit = () => import(/* webpackChunkName: "service_Charges" */ '../views/review/Withdrawlimit.vue')
const Userlevel = () => import(/* webpackChunkName: "service_Charges" */ '../views/member/Userlevel.vue')
const Revenue = () => import(/* webpackChunkName: "service_Charges" */ '../views/report/Revenue.vue')
const Transaction = () => import(/* webpackChunkName: "service_Charges" */ '../views/report/Transaction.vue')
const Markdown = () => import(/* webpackChunkName: "service_Charges" */ '../views/items/Markdown.vue')
const Faq = () => import(/* webpackChunkName: "service_Charges" */ '../views/items/Faq.vue')
const faqadd = () => import(/* webpackChunkName: "service_Charges" */ '../views/items/faqadd.vue')
const Lockup = () => import(/* webpackChunkName: "service_Charges" */ '../views/items/Lockup.vue')
const Lockuplist = () => import(/* webpackChunkName: "service_Charges" */ '../views/items/Lockuplist.vue')
const maintain = () => import(/* webpackChunkName: "service_Charges" */ '../views/items/maintain.vue')
const activity = () => import(/* webpackChunkName: "service_Charges" */ '../views/items/activity.vue')
const activitylist = () => import(/* webpackChunkName: "service_Charges" */ '../views/items/activitylist.vue')
const addaclist = () => import(/* webpackChunkName: "service_Charges" */ '../views/items/addaclist.vue')
const activitymem = () => import(/* webpackChunkName: "service_Charges" */ '../views/items/activitymem.vue')
const test = () => import(/* webpackChunkName: "service_Charges" */ '../views/items/test.vue')
const staking = () => import(/* webpackChunkName: "service_Charges" */ '../views/items/staking.vue')
const setstatus = () => import(/* webpackChunkName: "service_Charges" */ '../views/maneger/setstatus.vue')
const manger = () => import(/* webpackChunkName: "service_Charges" */ '../views/maneger/manger.vue')
const role = () => import(/* webpackChunkName: "service_Charges" */ '../views/maneger/role.vue')
const right = () => import(/* webpackChunkName: "service_Charges" */ '../views/maneger/right.vue')
Vue.use(VueRouter)
Vue.use(store)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { path: '/login', name: 'login', redirect: '/forgetpsw' },
  { path: '/forgetpsw', name: 'forgetpsw', component: Forgetpsw },
  { path: '/login', name: 'login', redirect: '/resetpassword' },
  { path: '/resetpassword', name: 'resetpassword', component: Resetpassword },
  {
    path: '/home',
    redirect: '/welcome',
    component: Home,
    children: [
      { path: '/welcome', name: 'welcome', component: Welcome },
      { path: '/users', name: 'users', component: Users },
      { path: '/rights', name: 'rights', component: Rights },
      { path: '/roles', name: 'roles', component: Roles },
      { path: '/forgetpsw', name: 'forgetpsw', component: Forgetpsw },
      { path: '/charge', name: 'charge', component: Charge },
      { path: '/deposit', name: 'deposit', component: Deposit },
      { path: '/member', name: 'member', component: Member },
      { path: '/membercatch', name: 'membercatch', component: Membercatch },
      { path: '/blackmember', name: 'blackmember', component: Blackmember },
      { path: '/banner', name: 'banner', component: Banner },
      { path: '/bankset', name: 'bankset', component: Bankset },
      { path: '/realname', name: 'realname', component: Realname },
      { path: '/realnamepic', name: 'realnamepic', component: Realnamepic },
      { path: '/revenue', name: 'revenue', component: Revenue },
      { path: '/transaction', name: 'transaction', component: Transaction },
      { path: '/userlevel', name: 'userlevel', component: Userlevel },
      { path: '/faq', name: 'faq', component: Faq },
      { path: '/faqadd', name: 'faqadd', component: faqadd },
      { path: '/lockup', name: 'lockup', component: Lockup },
      { path: '/lockuplist', name: 'lockuplist', component: Lockuplist },
      { path: '/markdown', name: 'markdown', component: Markdown },
      { path: '/maintain', name: 'maintain', component: maintain },
      { path: '/withdrawlimit', name: 'withdrawlimit', component: Withdrawlimit },
      { path: '/activity', name: 'activity', component: activity },
      { path: '/activitylist', name: 'activitylist', component: activitylist },
      { path: '/addaclist', name: 'addaclist', component: addaclist },
      { path: '/test', name: 'test', component: test },
      { path: '/activitymem', name: 'activitymem', component: activitymem },
      { path: '/setstatus', name: 'setstatus', component: setstatus },
      { path: '/staking', name: 'staking', component: staking },
      { path: '/role', name: 'role', component: role },
      { path: '/right', name: 'right', component: right },
      { path: '/manger', name: 'manger', component: manger }
    ]
  }
]

const authChecking = (to) => {
  let isAllowEnter = false
  if (!store.getters.isAuthed) {
    store.dispatch('getRolePermissions')
  }
  let allowPage = [...store.getters.allowPage, ...store.getters.pageWhiteList]
  isAllowEnter = allowPage.indexOf(to.name.toUpperCase()) > -1
  return isAllowEnter
}

const router = new VueRouter({
  routes
})

// 权限控制导航守卫
router.beforeEach((to, from, next) => {
  const tokenStr = window.localStorage.getItem('token')
  const allowEnter = authChecking(to)

  if (tokenStr && tokenStr !== '') {
    if (!store.getters.isAuthed && to.path !== '/login') { // 沒取到就先返回
      window.sessionStorage.setItem('previewPage', to.name)
      return next('/login')
    }
    if (allowEnter) {
      next()
    } else {
      router.app.$message.error('您無該頁面權限')
      if (from) {
        next(from.name)
      } else {
        next(to.name)
      }
    }
  } else { // 未登入
    if (to.path === '/login') {
      next()
    } else {
      router.app.$message.error('請登入')
      next('/login')
    }
  }
})

export default router
