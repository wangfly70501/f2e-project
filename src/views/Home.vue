<template>
  <el-container class="home-container">

  <v-head class="font"></v-head>

    <el-container>

        <v-sidebar class="font"></v-sidebar>

      <!-- 主内容区域 -->

              <v-contain></v-contain>

    </el-container>
  </el-container>
</template>

<script>
import vHead from '../components/page/Header.vue'
import vSidebar from '../components/page/Sidebar.vue'
import vContain from '../components/page/Contain.vue'
import bus from '../components/page/bus.js'
export default {
  data () {
    return {

      collapse: false
    }
  },
  components: {
    'v-head': vHead,
    'v-sidebar': vSidebar,
    'v-contain': vContain
  },

  created () {
    bus.$on('collapse-content', msg => {
      this.collapse = msg
    })
  },

  provide () {
    return {

    }
  },

  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style>
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+TC&display=swap');
</style>
<style lang="less" scoped>
.home-container {
  height: 100%;

}
.font{
   font-family: 'Noto Sans TC', sans-serif;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 14px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  -ms-user-select: none;
  -webkit-user-select: none;
  -moz-user-select: -moz-none;
  cursor: pointer;

}

.el-main {
  background-color: #eaedf1;
}

.content-box {
    position: absolute;
    left: 200px;
    right: 0;
    top: 70px;
    bottom: 0;
    padding-bottom: 30px;
    -webkit-transition: left .3s ease-in-out;
    transition: left .3s ease-in-out;
    background: #f0f0f0;
}

.content {

    height: 100%;
    padding: 10px;
    overflow-y: scroll;
    box-sizing: border-box;
}

.content-collapse {
    left: 70px;
}

</style>
