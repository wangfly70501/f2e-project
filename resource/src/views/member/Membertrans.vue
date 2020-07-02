<template>

    <el-card>
          <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="提領上限紀錄" name="limitup">
             <limitup></limitup>
        </el-tab-pane>
  <!--       <el-tab-pane label="法幣交易記錄" name="trans">
           <trains></trains>
        </el-tab-pane>
        <el-tab-pane label="帳號記錄" name="account">
             <account></account>
        </el-tab-pane> -->

      </el-tabs>

      <template>
        <span style="font-size:12px">
          幣幣交易查詢：請至 <a href='https://cms.btc-box.one/login.html' target="_blank" > 幣幣後台</a>，[用戶管理>會員管理] 的頁籤 [交易信息]、[充值信息]、[提現信息]，選擇[幣種]後查詢。
        </span>
      </template>
    </el-card>

</template>

<script>
/* import trains from '../../views/member/translist.vue'
import account from '../../views/member/accountlist.vue' */
import limitup from '../../views/member/limitup.vue'
export default {
  data () {
    return {
      activeName: 'limitup'

    }
  },
  components: {
    /*     account,
    trains, */
    limitup
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
    }
  }

}

</script>

<style lang="less" scoped>

</style>
