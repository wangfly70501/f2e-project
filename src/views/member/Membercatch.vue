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
  methods: {
    DialogClosed () {
      this.$router.push('/member')
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
