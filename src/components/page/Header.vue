<template>
  <div class="header">
      <!-- 折叠按钮 -->
     <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>

    <div class="logo" @click="home">
      <img src="../../assets/logo.png" />後臺管理系統
    </div>

    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <!--                <div class="btn-bell">
                    <el-tooltip
                        effect="dark"
                        :content="message?`有${message}條未讀消息`:`消息中心`"
                        placement="bottom"
                    >
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
        </div>-->
        <!-- 用户名下拉菜单 -->
        <el-dropdown class trigger="click">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- 語系選擇 -->
            <!--     <el-dropdown-item @click.native="toggleLang('zh')" :disabled="$i18n.locale == 'zh'">中文</el-dropdown-item>
            <el-dropdown-item
              @click.native="toggleLang('en')"
              :disabled="$i18n.locale == 'en'"
            >English</el-dropdown-item>-->
            <el-dropdown-item divided @click.native="logout">登出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import bus from '../page/bus.js'
export default {
  data () {
    return {
      fullscreen: false,
      name: '',
      message: 2,
      collapse: false
    }
  },
  computed: {
    username () {
      let username = localStorage.getItem('mg_name')
      return username || this.name
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      localStorage.clear()
      this.$router.push('/login')
    },
    // 侧边栏折叠
    collapseChage () {
      this.collapse = !this.collapse
      bus.$emit('collapse', this.collapse)
    },

    // 全屏事件
    handleFullScreen () {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    home () {
      this.$router.push('/home')
    }
  },

  mounted () {
    if (document.body.clientWidth < 1500) {
      this.collapseChage()
    }
  }

}
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
  background-color: #373d41;
}
.header .logo {
  float: left;
    width: 500px;
  line-height: 70px;
  font-size: 28px;
}
.header .logo img {
  height: 70px;
  min-width: 10%;
  float: left;
}
.header .logo:hover {
    background-color: #283446 ;
}

.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.collapse-btn:hover{
    background-color:#283446;
}

.header-right {
  float: right;
   padding-right:50px;

}

.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
/* .header nav {
    text-align: left;
    width: 100%;
    padding: 6px 10px;
    font-size:14px
}
.header nav a {
    display: inline-block;
    line-height: 50px;
    text-decoration: none;
    color: #fff;
    padding: 6px 10px;
}
.header nav a:hover {
    color: red;;
} */
</style>
