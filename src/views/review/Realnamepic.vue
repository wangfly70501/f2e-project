<template>
  <div>
    <TopBreadcrumb :titles="['實名認證', '認證信息']"></TopBreadcrumb>

    <el-card>
      <p>認證信息</p>

      <table style="width:100%" >
        <tr style="text-align:left">
          <th>UID</th>
          <th>使用者姓名</th>
          <th>手機號碼</th>
          <th>信箱</th>
          <th>提交時間</th>
          <th>身分字號</th>
          <!-- <th>是否重複</th -->
        </tr>
        <tr>
          <td>{{ this.$route.query.uuid }}</td>
          <td>{{ this.$route.query.username }}</td>
          <td>{{ this.$route.query.mobile }}</td>
          <td>{{this.$route.query.email }}</td>
          <td>{{ this.$route.query.ctime |dateFormat}}</td>
          <td>{{ this.checkidlist.certificate_number}}</td>
      <!--     <td v-if="this.checkidlist.count>1">是 UID:{{ this.checkidlist.uuid}}</td>
           <td v-else>否</td> -->
        </tr>
      </table>

      <!-- 下方資訊 -->
<!--       <p>姓名:{{this.$route.query.username}}</p>
      <div>
        狀態:
        <div style="color:red" v-if="this.$route.query.auth_status === 0">未開通</div>
        <div style="color:green" v-else>開通</div>
      </div>
      <div>
        證件類型:
        <div v-if="this.$route.query.certificate_type === 1">身分證</div>
        <div v-else-if="this.$route.query.certificate_type === 2">護照</div>
        <div v-else>居留證</div>
      </div>
      <p>身分證正面照片:</p>
      <img :src="this.$route.query.first_photo" />
      <p>身分證反面照片:</p>
      <img :src="this.$route.query.second_photo" />
      <p>手寫姓名和身分證照片:</p>
      <img :src="this.$route.query.third_photo" />
      <div style="text-align:center">
        <el-button @click="editDialogVisible = false">審核不通過</el-button>
        <el-button type="primary">審核通過</el-button>
      </div> -->

<el-form ref="form" :model="form" label-width="10%">
  <el-form-item label="姓名:">
    {{this.$route.query.username}}
  </el-form-item>
  <el-form-item label="狀態:">
<div style="color:brown" v-if="this.$route.query.auth_status == '0'">未審核</div>
<div style="color:green" v-else-if="this.$route.query.auth_status  == '1'" >審核通過</div>
<div v-else style="color:red">審核不通過</div>
       <!--  <div style="color:green" v-else>啟用</div> -->
  </el-form-item>
 <el-form-item label="證件類型:">
        <div v-if="this.$route.query.certificate_type == '1'">身分證</div>
        <div v-else-if="this.$route.query.certificate_type == '2'">護照</div>
        <div v-else>居留證</div>
  </el-form-item>
   <el-form-item label="身分證正面照片:">
<img :src="this.$route.query.first_photo" style="max-width:50%"/>
  </el-form-item>
     <el-form-item label="身分證背面照片:">
<img :src="this.$route.query.second_photo" style="max-width:50%"/>
  </el-form-item>
     <el-form-item label="第二證件照:">
 <img :src="this.$route.query.third_photo" style="max-width:50%"/>
  </el-form-item>
       <el-form-item label="手寫簽名照:">
 <img :src="this.$route.query.fourth_photo" style="max-width:50%"/>
  </el-form-item>
  <el-form-item label="審核不過說明：" v-if="this.$route.query.auth_status===0" required>
    <el-input type="textarea" v-model="form.desc"></el-input>
  </el-form-item>
    <el-form-item  v-else-if="this.$route.query.auth_status===1" label="說明：">
        {{this.$route.query.reason}}
  </el-form-item>
      <el-form-item  v-else label="審核不過說明：" style="color:red">
          {{this.$route.query.reason}}
  </el-form-item>
  <el-form-item style="text-align:center">
    <el-button  @click="uppage">上一頁</el-button>&nbsp;&nbsp;
    <span v-if="this.$route.query.auth_status===0">
    <el-button  @click="Submitunpass"  type="danger" :disabled="fail">審核不通過</el-button>
    <el-button type="primary" @click.once="Submitpass" :disabled="Success">審核通過</el-button>
    </span>
        <span v-else>
    </span>
  </el-form-item>
</el-form>

    </el-card>
  </div>
</template>

<script>
import { KycSuccess, KycFail, getKYCcertificateBumber } from '../../api/index.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: '',
        date: []
      },
      fail: false,
      Success: false,
      getdata: '',
      total: 0,
      form: {
        username: '',
        desc: ''
      },
      searchlist: '',
      /*  editDialogVisible: false, */
      editForm: {},
      realname: {},
      nameList: [],
      checkidlist: {}
    }
  },
  created () {
    console.log('1223', this.$route.query)
    this.objList()
    this.checkid()
  },

  methods: {
    async  checkid () {
      var data = {
        uuid: this.$route.query.uuid,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')
      }
      await getKYCcertificateBumber(data).then(res => {
        this.checkidlist = res.data
        console.log('check', this.checkidlist)
      })
    },

    objList () {
      this.objname = localStorage.getItem('mg_name')
      this.objpwd = localStorage.getItem('mg_pwd')
      console.log(typeof this.objname, this.objpwd)

      if (this.objname == null || this.objpwd == null) {
        console.log('15132321')
        this.$router.push('/login')
      }
    },
    /* 實名認證不通過 */
    async Submitunpass () {
      var data = {
        uuid: this.$route.query.uuid,
        reason: this.form.desc,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')
      }
      await KycFail(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('已送出審核不通過原因')
          this.fail = false
          this.$router.push('/realname')
        } else {
          this.$message.error('請填寫失敗原因,送出失敗')
        }
      })
    },
    uppage () {
      this.$router.push('/realname')
    },
    /* 實名認證通過 */
    async Submitpass () {
      let data = {
        uuid: this.$route.query.uuid,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        reason: this.form.desc
      }
      await KycSuccess(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('審核成功')
          this.Success = true
          this.$router.push('/realname')
        } else {
          this.$message.error('送出失敗')
        }
      })
    }

  }
}
</script>

<style lang="less" scoped>
.text {
  display: inline-block;
  margin: 0 5px;
  font-size: 12px;
}
table, th, td {
  border: 1px solid #dddddd;
  border-collapse: collapse;
  padding: 10px;
}
</style>
