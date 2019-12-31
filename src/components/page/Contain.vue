
<template>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <div class="content">
                <transition name="move" mode="out-in">
                        <router-view></router-view>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
 </template>

<script>
import bus from '../page/bus.js'
export default {
  data () {
    return {

      collapse: false
    }
  },
  created () {
    console.log('test babel-plugin (remove console.xxx at production environment)')

    bus.$on('collapse-content', msg => {
      this.collapse = msg
    })
  }
}
</script>
<style scoped>
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
