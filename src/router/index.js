import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由分组懒加载定义
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Welcome.vue')
const Forgetpsw = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Forgetpsw.vue')
const Resetpassword = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Resetpassword.vue')
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/access/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/access/Roles.vue')

// const Categories = () => import(/* webpackChunkName: "Categories_Params" */ '../views/goods/Categories.vue')
// const Params = () => import(/* webpackChunkName: "Categories_Params" */ '../views/goods/Params.vue')
const GoodsList = () => import(/* webpackChunkName: "GoodsList_GoodsAdd" */ '../views/goods/List.vue')
const GoodsAdd = () => import(/* webpackChunkName: "GoodsList_GoodsAdd" */ '../views/goods/Add.vue')
const Orders = () => import(/* webpackChunkName: "Orders_Report" */ '../views/order/Orders.vue')

const Charge = () => import(/* webpackChunkName: "service_Charges" */ '../views/charge/Charge.vue')
const Bankset = () => import(/* webpackChunkName: "service_Charges" */ '../views/charge/Bankset.vue')
const Deposit = () => import(/* webpackChunkName: "service_Charges" */ '../views/deposit/Deposit.vue')
const Receipt = () => import(/* webpackChunkName: "service_Charges" */ '../views/receipt/Receipt.vue')
const Member = () => import(/* webpackChunkName: "service_Charges" */ '../views/member/Member.vue')
const Blackmember = () => import(/* webpackChunkName: "service_Charges" */ '../views/member/blackmem.vue')
const Banner = () => import(/* webpackChunkName: "service_Charges" */ '../views/cms/Banner.vue')
const Realname = () => import(/* webpackChunkName: "service_Charges" */ '../views/realname/Realname.vue')
const Realnamepic = () => import(/* webpackChunkName: "service_Charges" */ '../views/realname/Realnamepic.vue')

const Userlevel = () => import(/* webpackChunkName: "service_Charges" */ '../views/member/Userlevel.vue')
const Revenue = () => import(/* webpackChunkName: "service_Charges" */ '../views/report/Revenue.vue')
const Transaction = () => import(/* webpackChunkName: "service_Charges" */ '../views/report/Transaction.vue')
const Markdown = () => import(/* webpackChunkName: "service_Charges" */ '../views/realname/Markdown.vue')
const Faq = () => import(/* webpackChunkName: "service_Charges" */ '../views/realname/Faq.vue')
const Lockup = () => import(/* webpackChunkName: "service_Charges" */ '../views/realname/Lockup.vue')
const Lockuplist = () => import(/* webpackChunkName: "service_Charges" */ '../views/realname/Lockuplist.vue')
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
      /*  { path: '/forgetpsw', component: Forgetpsw }, */
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/forgetpsw', component: Forgetpsw },
      /* { path: '/categories', component: Categories }, */
      /*  { path: '/params', component: Params }, */
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: GoodsAdd },
      { path: '/orders', component: Orders },

      { path: '/charge', component: Charge },
      { path: '/deposit', component: Deposit },
      { path: '/member', component: Member },
      { path: '/blackmember', component: Blackmember },
      { path: '/banner', component: Banner },
      { path: '/receipt', component: Receipt },
      { path: '/bankset', component: Bankset },
      { path: '/realname', component: Realname },
      { path: '/realnamepic', component: Realnamepic },
      { path: '/revenue', component: Revenue },
      { path: '/transaction', component: Transaction },
      { path: '/userlevel', component: Userlevel },
      { path: '/faq', component: Faq },
      { path: '/lockup', component: Lockup },
      { path: '/lockuplist', component: Lockuplist },
      { path: '/markdown', component: Markdown }
    ]
  }
]

const router = new VueRouter({
  routes
})

/* // 权限控制导航守卫
router.beforeEach((to, from, next) => {
  const tokenStr = window.sessionStorage.getItem('token')

  if (to.path === '/login') {
    if (tokenStr) return next('/home')
    next()
  } else {
    if (!tokenStr) return next('/login')
    next()
  }
}) */

export default router
