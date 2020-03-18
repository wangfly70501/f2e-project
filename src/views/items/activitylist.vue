<template>
  <div>
    <TopBreadcrumb :titles="['活動管理', '編輯活動']"></TopBreadcrumb>

    <el-card>
     <font-awesome-icon  icon="times" size="lg"  @click="uppage" style="float:right"/><p class="txt">上架
              <el-switch
              v-model="editForm.active"
              active-color="#169BD5"
              inactive-color="#BEBEBE"
              :active-value='1'
              :inactive-value='0'
             @change="changeSwitch()"
            ></el-switch>
                &nbsp;
              <span v-if="editForm.active===0" style="color:#AAAAAA"> <font-awesome-icon  icon="ban" size="lg" /> </span>
              <span v-else style="color:#79BB13"> <font-awesome-icon icon="check-circle" /> </span>

            </p>
      <div class="txt">活動資訊 <hr ></div>
 <!-- 新增活動 -->

      <el-form :model="editForm" :rules="Rules" ref="editFormref" label-width="100px">
         <div class="textname">
       <span>活動名稱</span> <span class="description"><el-form-item label="繁中" prop="el_GR">
          <el-input v-model="editForm.activity_name_GR" style="width:400px" ></el-input>
        </el-form-item>
        <el-form-item label="简中" prop="zh_CN">
          <el-input v-model="editForm.activity_name_CN" style="width:100%" ></el-input>
        </el-form-item>
        <el-form-item label="EN" prop="en_US">
          <el-input v-model="editForm.activity_name_US" style="width:100%" ></el-input>
        </el-form-item>
        </span>
          </div>

          <hr width="80%" />
          <div class="textname"><span>活動描述</span>
        <span class="description"><el-form-item label="繁中" prop="el_GR">
          <el-input v-model="editForm.activity_content_GR" style="width:400px" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="简中" prop="zh_CN">
          <el-input v-model="editForm.activity_content_CN" style="width:100%"  type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="EN" prop="en_US">
          <el-input v-model="editForm.activity_content_US" style="width:100%"  type="textarea"></el-input>
        </el-form-item>
        </span>
          </div>
           </el-form>
          <!-- 活動描述 -->
          <div class="txt">活動機制 <hr ></div>
          <div class="mechanism">
             <el-form :model="editForm" :rules="Rules" ref="editFormref" label-width="200px">
            <el-form-item label="活動類型" >
          <el-select v-model="editForm.type" placeholder="請選擇" style="width:30%">
          <el-option
            v-for="(enableValue,index) in enable"
            :key="index"
            v-bind:label="enableValue.label"
            v-bind:value="enableValue.value"
          >{{enableValue.label}}</el-option>
        </el-select>&nbsp;
        </el-form-item>
        <hr width="80%" />
        <el-form-item label="開始時間">
          <el-date-picker
            type="date"
            v-model="editForm.starttime"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd "
            style="width:30%"
          ></el-date-picker>&nbsp;
          <el-time-picker
            style="width:30%"
            v-model="begintime"
             format="HH:mm"
            value-format="HH:mm"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="結束時間" >
          <el-date-picker
            type="date"
            v-model="editForm.endtime"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd "
            style="width:30%"
          ></el-date-picker>&nbsp;
          <el-time-picker
            style="width:30%"
            format="HH:mm"
            value-format="HH:mm"
            v-model="endtime"
          ></el-time-picker>
        </el-form-item>
          <el-form-item label="人數限制" >
          <el-input v-model="editForm.people_limit" style="width:80px"></el-input> &nbsp;位
        </el-form-item>
        <hr width="80%" />
          <el-form-item label="對象" >
          <el-select v-model="Objecttype.value" placeholder="請選擇" style="width:30%">
          <el-option
            v-for="(item,index) in Objecttype"
            :key="index"
            v-bind:label="item.label"
            v-bind:value="item.value"
          >{{item.label}}</el-option>
        </el-select>&nbsp;
        </el-form-item>
                <el-form-item label="" >

        </el-form-item>
        <hr width="80%" />
          <el-form-item label="獎勵金額" >
          <el-input v-model="editForm.bonus_amount" style="width:80px"  placeholder="金額"></el-input>
            <el-select v-model="coin.value" placeholder="USDT" style="width:10%">
          <el-option
            v-for="(coin,index) in currencyList"
            :key="index"
            v-bind:label="coin.currency"
            v-bind:value="coin.id"
          >{{coin.currency}}</el-option>
        </el-select>
        </el-form-item>
          <el-form-item label="獎勵次數" >
          <el-input v-model="editForm.bonus_limit" style="width:80px"></el-input> &nbsp;次，超過此次數及停止派發獎勵
        </el-form-item>
        <hr width="80%" />
         </el-form >
        </div>

      <!-- 底部区域 -->
      <div class="btn">
     <el-button type="primary" style="width:40%">編輯活動</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
import { currencyList } from '../../api/index.js'

export default {
  data () {
    return {
      begintime: '',
      endtime: '',
      content: '',
      html: '',
      configs: {},
      searchlist: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: '',
        date: []

      },
      date: [],
      ActivityJoinlist: [],
      currencyList: [],
      total: 0, // 总用户数
      delDialogVisible: false,
      addDialogVisible: false,
      editForm: {
        lang: []
      },
      coin: {},
      enable: [
        {
          label: '註冊',
          value: '1'
        },
        {
          label: '實名認證',
          value: '2'
        },
        {
          label: '邀請好友',
          value: '3'
        },
        {
          label: '鎖倉認購',
          value: '4'
        },
        {
          label: '綁定銀行帳戶',
          value: '5'
        }
      ],
      Objecttype: [
        {
          label: '新用戶(活動開始後註冊)',
          value: '1'
        },
        {
          label: '舊用戶(活動開始前註冊)',
          value: '2'
        },
        {
          label: '新用戶及舊用戶',
          value: '3'
        }
      ],
      Rules: {
        title: [{ required: true, message: '請輸入活動名稱', trigger: 'blur' }],
        currency: [
          { required: true, message: '請選擇活動幣種', trigger: 'blur' }
        ],
        Amount: [{ required: true, trigger: 'blur' }],

        rate: [{ required: true, message: '請輸入活動利率', trigger: 'blur' }],
        days: [{ required: true, message: '請輸入增值期間', trigger: 'blur' }],
        mode: [{ required: true, trigger: 'blur' }],
        lang: [{ required: true, trigger: 'blur' }],
        type: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  watch: {
    begintime (newData, oldData) {
    },
    endtime (newData, oldData) {}

  },
  created () {
    this.objList()
    console.log('1223', this.$route.query)
    this.editForm = this.$route.query
    console.log('788988', this.editForm)
    this.getCurrencyList()
    this.begintime = this.editForm.starttime.substr(11, 5)
    console.log('status', this.editForm.active)
    this.endtime = this.editForm.endtime.substr(11, 5)
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
    // 获取列表

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getFaqList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getFaqList()
    },

    uppage () {
      this.$router.push('/activity')
    },

    async getCurrencyList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')
      }
      await currencyList(data).then(res => {
        this.currencyList = res.data
        console.log('currencyList', this.currencyList)
      })
    }
  }
}
</script>

<style>
.txt{
  color:#169BD5;
  font-weight:bold;
}
.txt hr {
    background-color: #169BD5;
    height: 2px
}
.textname{
  font-size: 16px ;
  padding: 25px 200px 0px;
display: flex;
}
.text.description{
  font-size: 16px ;
   padding: 25px 40px 0px;
}
/* .el-form-item{
  margin-bottom: 10px;
} */
.mechanism{
  padding: 25px 80px 0px;

}
.mechanism .el-form-item__label{
  font-size: 16px;
  padding: 0 18px 0;
}
.btn{
  width: 30%;
  margin: 0 180px;
}
.font-awesome-icon .fa-hover a.fa{
    font-size: 20px;
}
</style>
