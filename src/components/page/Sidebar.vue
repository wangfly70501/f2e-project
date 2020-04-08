<template>
  <div class="sidebar">
    <!-- 折叠按钮 -->
    <!--     <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>-->

    <!-- 菜单栏 -->
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon" class="menuls"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../page/bus.js'
export default {
  data () {
    return {
      items: [
        /*      {
          icon: 'el-icon-lx-home',
          index: 'welcome',
          title: '系统首頁'
        }, */
        {
          index: '1',
          title: '管理者管理',
          icon: 'iconfont icon-user',
          subs: [
          /*   { index: 'users', title: '管理者列表' },
            { index: 'roles', title: '角色列表' },
            { index: 'rights', title: '權限列表' } */
            { index: 'setstatus', title: '權限管理' }
          ]
        },
        {

          index: '2',
          title: '會員管理',
          icon: 'iconfont icon-users',
          subs: [
            { index: 'member', title: '會員列表' },
            { index: 'blackmember', title: '黑名單會員列表' },
            { index: 'userlevel', title: '會員層級列表' }
          ]
        },
        /*  {
          icon: 'iconfont icon-tijikongjian',
          index: '3',
          title: '出入金管理',
          subs: [{ index: 'deposit', title: '出入金列表' }]
        }, */
        /*    {

          index: '4',
          title: '財務管理',
          icon: 'iconfont icon-baobiao',
          subs: [

            { index: 'bankset', title: '銀行設置' },
            { index: 'charge', title: '手續費設置' },
            { index: 'revenue', title: '營收報表' },
            { index: 'transaction', title: '交易報表' }
          ]
        }, */
        {

          index: '6',
          title: '審核管理',
          icon: 'iconfont icon-shangpin',
          subs: [
            { index: 'withdrawlimit', title: '審核提領上限' },
            { index: 'realname', title: '審核實名認證' }

          ]
        },
        {

          index: '5',
          title: 'CMS系統',
          icon: 'iconfont icon-tijikongjian',
          subs: [
            /*  { index: 'indexmenu', title: '公告管理' }, */
            { index: 'faq', title: 'FaQ管理' },
            { index: 'banner', title: 'banner管理' }

          ]
        },

        {
          icon: 'iconfont icon-danju',
          index: '7',
          title: '項目管理',
          subs: [
            { index: 'lockup', title: '鎖倉管理' },
            { index: 'activity', title: '活動管理' },
            { index: 'maintain', title: '維護管理' },
            { index: 'staking', title: '定投管理' }
            /*    { index: 'test', title: 'tset' } */
          ]
        }
      ],
      collapse: false
    }
  },

  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '')
    }
  },
  created () {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
      bus.$emit('collapse-content', msg)
    })
  }
}
</script>

<style  scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
  background-color: #324157;
  width: 100%;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
  position: relative;
}
.menuls {
  text-align: right;
  margin: 0 5px;
}
.sidebar-el-menu.el-menu{
  border-right:0 ;
}
</style>
