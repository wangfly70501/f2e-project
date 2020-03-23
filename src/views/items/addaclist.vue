<template>
  <div>
    <TopBreadcrumb :titles="['活動管理', '新增活動']"></TopBreadcrumb>

    <el-card>
    <font-awesome-icon  icon="times" size="lg"  @click="uppage" style="float:right"/>

     <p class="txt">前台顯示

              <el-switch
              v-model="addForm.show_status"
              active-color="#169BD5"
              inactive-color="#BEBEBE"
              :active-value='1'
              :inactive-value='0'
              class="fontpadding"
            ></el-switch>
                &nbsp;
            </p>

      <div class="txt">活動資訊 <hr ></div>
 <!-- 新增活動 -->

      <el-form :model="addForm" :rules="Rules" ref="addFormref" label-width="100px">
         <div class="text">
       <span>活動名稱</span> <span class="description">
         <el-form-item label="繁中" prop="titlegr">
          <el-input v-model="addForm.titlegr" style="width:400px" ></el-input>
        </el-form-item>
        <el-form-item label="简中" prop="titlecn">
          <el-input v-model="addForm.titlecn" style="width:100%" ></el-input>
        </el-form-item>
        <el-form-item label="EN" prop="titleus">
          <el-input v-model="addForm.titleus" style="width:100%" ></el-input>
        </el-form-item>
        </span>
          </div>

          <hr width="80%" />
          <div class="text"><span>活動描述</span>
        <span class="description"><el-form-item label="繁中" prop="activity_content_GR">
          <el-input v-model="addForm.activity_content_GR" style="width:400px" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="简中" prop="activity_content_CN">
          <el-input v-model="addForm.activity_content_CN" style="width:100%"  type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="EN" prop="activity_content_US">
          <el-input v-model="addForm.activity_content_US" style="width:100%"  type="textarea"></el-input>
        </el-form-item>
        </span>
          </div>
           </el-form>
          <!-- 活動描述 -->
          <div class="txt">活動機制 <hr ></div>
          <div class="mechanism">
             <el-form :model="addForm" :rules="Rules" ref="addFormref" label-width="200px">
            <el-form-item label="活動類型" prop="actype">
          <el-select v-model="enable.value" placeholder="請選擇" style="width:30%" @change="getlasttime ()">
          <el-option
            v-for="(enableValue,index) in enable"
            :key="index"
            v-bind:label="enableValue.label"
            v-bind:value="enableValue.value"
          >{{enableValue.label}}</el-option>
        </el-select>&nbsp;
        </el-form-item>
        <hr width="80%" />
        <!-- 開始時間 -->
        <el-form-item label="開始時間" >
          <el-date-picker
           :editable="false"
     v-model="startBudgetTime"
    :picker-options="pickerOptionsStart"
    type="date"
    format="yyyy-MM-dd"
    value-format="timestamp"
    placeholder="選擇開始日期"
    @change="changeEnd"
          ></el-date-picker>&nbsp;
<!--           <el-time-picker
            style="width:30%"
            v-model="addForm.starttime"
             format="HH:mm"
            value-format="HH:mm"
          ></el-time-picker> -->
            <el-select v-model="time.value" style="width:10%" placeholder="00">
          <el-option
            v-for="(time,index) in timehr"
            :key="index"
           :label="time.label"
            :value="time.value"

          >{{time.label}}</el-option>
        </el-select>
               <el-select v-model="starttimemin.value" style="width:10%"  placeholder="00">
          <el-option
            v-for="(starttimemin,index) in timemin"
            :key="index"
           :label="starttimemin.label"
            :value="starttimemin.value"
          >{{starttimemin.label}}</el-option>
        </el-select>
        </el-form-item>
        <!-- 結束時間 -->
        <el-form-item label="結束時間" prop="endBudgetTime">
          <el-date-picker
           :editable="false"
    v-model="endBudgetTime"
    :picker-options="pickerOptionsEnd"

    type="date"
    format="yyyy-MM-dd "
    value-format="timestamp"
    placeholder="選擇結束日期"
    @change="changeStart"
          ></el-date-picker>&nbsp;
    <!--       <el-time-picker
            style="width:30%"
            format="HH:mm"
            value-format="HH:mm"
            v-model="addForm.endtimes"
          ></el-time-picker> -->
                <el-select v-model="endtime.value" style="width:10%" placeholder="23">
          <el-option
            v-for="(endtime,index) in timehr"
            :key="index"
           :label="endtime.label"
            :value="endtime.value"

          >{{endtime.label}}</el-option>
        </el-select>
               <el-select v-model="endtimemin.value" style="width:10%"  placeholder="00">
          <el-option
            v-for="(endtimemin,index) in timemin"
            :key="index"
           :label="endtimemin.label"
            :value="endtimemin.value"
          >{{endtimemin.label}}</el-option>
        </el-select>
        </el-form-item>
          <el-form-item label="人數限制" prop="people_limit">
          <el-input v-model="addForm.people_limit" style="width:80px"></el-input> &nbsp;位 (設0表示無限制)
        </el-form-item>
        <hr width="80%" />
          <el-form-item label="對象" prop="Objecttype">
          <el-select v-model="Objecttype.value" placeholder="請選擇" style="width:30%">
          <el-option
            v-for="(item,index) in Objecttype"
            :key="index"
            v-bind:label="item.label"
            v-bind:value="item.value"
          >{{item.label}}</el-option>
        </el-select>&nbsp;
        </el-form-item>
 <!--        <el-form-item label="資格條件" prop="condition"  style="width:80px" >
              <el-select v-model="condition" multiple placeholder="請選擇">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
        </el-form-item> -->
        <hr width="80%" />
          <el-form-item label="獎勵金額" prop="bonus_amount">
          <el-input v-model="addForm.bonus_amount" style="width:80px"  placeholder="金額"></el-input>
            <el-select v-model="coin.value" placeholder="USDT" style="width:10%">
          <el-option
            v-for="(coin,index) in currencyList"
            :key="index"
            v-bind:label="coin.currency"
            v-bind:value="coin.id"
          >{{coin.currency}}</el-option>
        </el-select>
        </el-form-item>
          <el-form-item label="獎勵次數" prop="bonus_limit">
         <!--  <el-input v-model="addForm.people_limit" style="width:80px"></el-input> &nbsp; -->
          <el-input-number v-model="addForm.bonus_limit" :min="1" :max="10" size="mini"></el-input-number>&nbsp;次，超過此次數及停止派發獎勵
        </el-form-item>
        <hr width="80%" />
         </el-form >
        </div>

      <!-- 底部区域 -->
      <div class="btn">
     <el-button type="primary" @click="addacList" style="width:40%">新增活動</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
import { currencyList, inserttask, checkBehaviorEndTime } from '../../api/index.js'
import moment from 'moment'
export default {
  data () {
    return {
      pickerOptionsStart: {},
      pickerOptionsEnd: {},
      startBudgetTime: '', // 預算開始時間
      endBudgetTime: '', // 預算結束時間
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
      lasttime: '',
      condition: '',
      starttime: '',
      date: [],
      ActivityJoinlist: [],
      currencyList: [],
      total: 0, // 总用户数
      delDialogVisible: false,
      addDialogVisible: false,
      addForm: {
        bonus_limit: 1,
        people_limit: '0',
        titlegr: '',
        titlecn: '',
        titleus: ''
      },
      coin: {},
      time: {},
      lastttime: {},
      starttimemin: {},
      endtime: {},
      endtimemin: {},
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
          label: '鎖倉認購',
          value: '3'
        },
        {
          label: '邀請好友',
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
          value: '0'
        }
      ],
      timehr: [
        {
          label: '00',
          value: '00'
        },
        {
          label: '01',
          value: '01'
        },
        {
          label: '02',
          value: '02'
        },
        {
          label: '03',
          value: '03'
        },
        {
          label: '04',
          value: '04'
        },
        {
          label: '05',
          value: '05'
        },
        {
          label: '06',
          value: '06'
        },
        {
          label: '07',
          value: '07'
        },
        {
          label: '08',
          value: '08'
        },
        {
          label: '09',
          value: '09'
        },
        {
          label: '10',
          value: '10'
        },
        {
          label: '11',
          value: '11'
        },
        {
          label: '12',
          value: '12'
        },
        {
          label: '13',
          value: '13'
        },
        {
          label: '14',
          value: '14'
        },
        {
          label: '15',
          value: '15'
        },
        {
          label: '16',
          value: '16'
        },
        {
          label: '17',
          value: '17'
        },
        {
          label: '18',
          value: '18'
        },
        {
          label: '19',
          value: '19'
        },
        {
          label: '20',
          value: '20'
        },
        {
          label: '21',
          value: '21'
        },
        {
          label: '22',
          value: '22'
        },
        {
          label: '23',
          value: '23'
        }
      ],
      timemin: [
        {
          label: '00',
          value: '00'
        },
        {
          label: '10',
          value: '10'
        },
        {
          label: '20',
          value: '20'
        },
        {
          label: '30',
          value: '30'
        },
        {
          label: '40',
          value: '40'
        },
        {
          label: '50',
          value: '50'
        }
      ],
      options: [{
        value: '0',
        label: '不拘'
      }, {
        value: '1',
        label: '已註冊'
      }, {
        value: '2',
        label: '已實名認證'
      }, {
        value: '3',
        label: '已鎖倉認購'
      }, {
        value: '4',
        label: '已綁定銀行帳戶'
      }
      ],
      Rules: {
        titlegr: [{ required: true, message: '請輸入活動名稱', trigger: 'blur' }],
        titlecn: [{ required: true, message: '請輸入活動名稱', trigger: 'blur' }],
        titleus: [{ required: true, message: '請輸入活動名稱', trigger: 'blur' }],
        activity_content_GR: [{ required: true, message: '請輸入活動描述', trigger: 'blur' }],
        activity_content_CN: [{ required: true, message: '請輸入活動描述', trigger: 'blur' }],
        activity_content_US: [{ required: true, message: '請輸入活動描述', trigger: 'blur' }],
        currency: [
          { required: true, message: '請選擇活動幣種', trigger: 'blur' }
        ],
        actype: [{ required: true, trigger: 'blur' }],
        startBudgetTime: [{ required: true, trigger: 'blur' }],
        endBudgetTime: [{ required: true, trigger: 'blur' }],

        people_limit: [{ required: true, trigger: 'blur' }],
        Objecttype: [{ required: true, trigger: 'blur' }],
        bonus_amount: [{ required: true, trigger: 'blur' }],
        bonus_limit: [{ required: true, trigger: 'blur' }]
        /* condition: [{ required: true, trigger: 'blur' }] */
      }
    }
  },

  created () {
    this.objList()
    console.log('1223', this.$route.query)
    this.getCurrencyList()
  },

  methods: {
    objList () {
      this.objname = localStorage.getItem('mg_name')
      this.objpwd = localStorage.getItem('mg_pwd')
      console.log(typeof this.objname, this.objpwd)

      if (this.objname == null || this.objpwd == null) {
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
    // 最新時間
    async getlasttime () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        behavior_type: this.enable.value
      }
      await checkBehaviorEndTime(data).then(res => {
        this.lasttime = res.data
        console.log('15132321', this.lasttime.endtime)

        localStorage.setItem('lasttime', this.lasttime.endtime)
      })
    },
    // 幣種列表
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
    },
    // 新增
    async addacList () {
      if (this.addForm.bonus_limit === '0') {
        this.addForm.bonus_limit_status = '0'
      } else {
        this.addForm.bonus_limit_status = '1'
      }
      this.starttime = moment(this.startBudgetTime).format('YYYY-MM-DD ')
      this.enddate = moment(this.endBudgetTime).format('YYYY-MM-DD ')
      this.starttime = this.starttime + '' + this.time.value + ':' + this.starttimemin.value
      this.enddate = this.enddate + this.endtime.value + ':' + this.endtimemin.value
      console.log('starttime', this.starttime, this.enddate)
      let lastTtem = localStorage.getItem('lasttime')
      console.log('lastTtem', lastTtem)

      if (lastTtem === this.starttime || this.starttime <= lastTtem || this.enddate <= lastTtem || this.starttime >= this.enddate) {
        this.$message.error('時間異常,開始時間不能在上一個活動時間內')
      } else {
        var data = {
          mg_name: localStorage.getItem('mg_name'),
          mg_pwd: localStorage.getItem('mg_pwd'),
          mg_state: localStorage.getItem('mg_state'),
          type: this.enable.value.toString(),
          activity_name_GR: this.addForm.titlegr,
          activity_name_CN: this.addForm.titlecn,
          activity_name_US: this.addForm.titleus,
          activity_content_US: this.addForm.activity_content_US,
          activity_content_CN: this.addForm.activity_content_CN,
          activity_content_GR: this.addForm.activity_content_GR,
          starttime: this.starttime,
          endtime: this.enddate,
          bonus_amount: this.addForm.bonus_amount,
          bonus_currency: this.coin.value,
          bonus_limit: this.addForm.bonus_amount * this.addForm.bonus_limit,
          people_limit: this.addForm.people_limit,
          bonus_limit_status: this.addForm.bonus_limit_status,
          show_status: this.addForm.show_status.toString(),
          people_set: this.Objecttype.value.toString()
        }

        console.log('data', data)
        await inserttask(data).then(res => {
          if (res.error_code === 0) {
            this.$message.success('新增成功')
            this.$router.push('/activity')
          } else {
            this.$message.error('格式不符，新增失敗')
          }
        })
      }
    },
    changeStart () {
      if (!this.lasttime.endtime) {
        this.pickerOptionsStart = {
          disabledDate: {}
        }
        return
      }
      this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
        // 可通過箭頭函式的方式訪問到this
        disabledDate: (time) => {
          var times = ''
          times = time.getTime() < this.lasttime.endtime
          return times
        }
      })
    },
    // 開始時間 控制結束時間
    changeEnd () {
      if (!this.startBudgetTime) {
        this.pickerOptionsEnd = {
          disabledDate: {}
        }
        return
      }
      this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
        disabledDate: (time) => {
          console.log('123456', this.startBudgetTime)
          return time.getTime() < this.startBudgetTime
        }
      })
    }

  }
}
</script>

<style less>
.txt{
  color:#169BD5;
  font-weight:bold;
}
.txt hr {
    background-color: #169BD5;
    height: 2px
}
.text{
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
.fontpadding{
    margin: 0 10px;
}
</style>
