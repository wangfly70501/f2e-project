import Vue from 'vue'
import VueRouter from 'vue-router'
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
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/login', redirect: '/forgetpsw' },
  { path: '/forgetpsw', component: Forgetpsw },
  { path: '/login', redirect: '/resetpassword' },
  { path: '/resetpassword', component: Resetpassword },
  {
    path: '/home',
    redirect: '/welcome',
    component: Home,
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/forgetpsw', component: Forgetpsw },
      { path: '/charge', component: Charge },
      { path: '/deposit', component: Deposit },
      { path: '/member', component: Member },
      { path: '/membercatch', component: Membercatch },
      { path: '/blackmember', component: Blackmember },
      { path: '/banner', component: Banner },
      { path: '/bankset', component: Bankset },
      { path: '/realname', component: Realname },
      { path: '/realnamepic', component: Realnamepic },
      { path: '/revenue', component: Revenue },
      { path: '/transaction', component: Transaction },
      { path: '/userlevel', component: Userlevel },
      { path: '/faq', component: Faq },
      { path: '/faqadd', component: faqadd },
      { path: '/lockup', component: Lockup },
      { path: '/lockuplist', component: Lockuplist },
      { path: '/markdown', component: Markdown },
      { path: '/maintain', component: maintain },
      { path: '/withdrawlimit', component: Withdrawlimit },
      { path: '/activity', component: activity },
      { path: '/activitylist', component: activitylist },
      { path: '/addaclist', component: addaclist },
      { path: '/test', component: test },
      { path: '/activitymem', component: activitymem }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 权限控制导航守卫
router.beforeEach((to, from, next) => {
  const tokenStr = window.sessionStorage.getItem('token')

  if (to.path === '/login') {
    if (tokenStr) return next('/home')
    next()
  } else {
  /*   if (!tokenStr) return next('/login') */
    next()
  }
})

export default router
