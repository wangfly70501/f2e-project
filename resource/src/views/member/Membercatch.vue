<template>
<div>
    <TopBreadcrumb :titles="['會員管理', '會員列表','檢視會員資料']"></TopBreadcrumb>
    <el-button @click="DialogClosed" type='info' size='mini'>上一頁</el-button>
  <el-container class="home-container">

  <memdetails style="width:30%"  ></memdetails>

   <memdetrans style="width:70%"></memdetrans>

  </el-container>
  </div>
</template>

<script>
import memdetails from '../member/Memberdetails.vue'
import memdetrans from '../member/Membertrans.vue'

export default {
  data () {
    return {

      collapse: false
    }
  },
  components: {
    memdetails,
    memdetrans
  },

  provide () {
    return {

    }
  },
  created () {
    this.objList()
  },
  methods: {

    objList () {
      this.objname = localStorage.getItem('mg_name')
      this.objpwd = localStorage.getItem('mg_pwd')
      console.log(typeof this.objname, this.objpwd)

      if (this.objname == null || this.objpwd == null) {
        console.log('15132321')
        this.$router.push('/login')
      }
    },
    DialogClosed () {
      if (window.history.length <= 1) {
        this.$router.push({ path: '/' })
        return false
      } else { this.$router.go(-1) }
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

</style>
