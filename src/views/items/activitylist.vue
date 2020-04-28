<template>
  <div>
    <TopBreadcrumb :titles="['活動管理', '編輯活動']"></TopBreadcrumb>

    <el-card>
      <font-awesome-icon icon="times" size="lg" @click="uppage" style="float:right" />

      <p class="txt">
        前台顯示
        <el-switch
          v-model="editForm.show_status"
          active-color="#169BD5"
          inactive-color="#BEBEBE"
          :active-value="1"
          :inactive-value="0"
          class="fontpadding"
        ></el-switch>&nbsp;
        <el-button size="mini" type="danger" @click="showaddDialog()">
          <font-awesome-icon icon="trash-alt" size="1x" />
        </el-button>
      </p>
       <p class="txt">
        活動類型
            <el-select v-model="editForm.type" placeholder="請選擇" style="width:30%" >
              <el-option
                v-for="(enableValue,index) in enable"
                :key="index"
                v-bind:label="enableValue.label"
                v-bind:value="enableValue.value"
              >{{enableValue.label}}</el-option>
            </el-select>&nbsp;
        </p>
      <div class="txt">
        活動資訊
        <hr />
      </div>
      <!-- 新增活動 -->
      <!-- 活動資訊 -->
      <el-form :model="editForm" :rules="Rules" ref="addFormref" label-width="100px" v-if="editForm.status!==2">
        <div class="text">
          <span>活動名稱</span>
          <span class="description">
            <el-form-item label="繁中" prop="activity_name_GR">
              <el-input v-model="editForm.activity_name_GR" style="width:400px"></el-input>
            </el-form-item>
            <el-form-item label="简中" prop="activity_name_CN">
              <el-input v-model="editForm.activity_name_CN" style="width:100%"></el-input>
            </el-form-item>
            <el-form-item label="EN" prop="activity_name_US">
              <el-input v-model="editForm.activity_name_US" style="width:100%"></el-input>
            </el-form-item>
          </span>
        </div>

        <hr width="80%" />
        <div class="text">
          <span>活動描述</span>
          <span class="description">
            <el-form-item label="繁中" prop="activity_content_GR">
              <el-input v-model="editForm.activity_content_GR" style="width:400px" type="textarea" rows="7"></el-input>
            </el-form-item>
            <el-form-item label="简中" prop="activity_content_CN">
              <el-input v-model="editForm.activity_content_CN" style="width:100%" type="textarea" rows="7"></el-input>
            </el-form-item>
            <el-form-item label="EN" prop="activity_content_US">
              <el-input v-model="editForm.activity_content_US" style="width:100%" type="textarea" rows="7"></el-input>
                <div style="color:#F78989"> (中文256個字，英文512個字)</div>
            </el-form-item>
          </span>
        </div>
         <div class="text">
          <span>連結網址</span><span class="description">
            <el-form-item label="網址" >
              <el-input v-model="editForm.link_url" style="width:400px" ></el-input>
            </el-form-item>
                <el-form-item   label="簡中網址" >
              <el-input v-model="editForm.link_url_cn" style="width:400px" ></el-input>
            </el-form-item>
                  <el-form-item   label="英文網址" >
              <el-input v-model="editForm.link_url_en" style="width:400px" ></el-input>
                <div style="color:#F78989"> （請輸入完整網址，如https://www.google.com）</div>
            </el-form-item>
            </span>
        </div>
      </el-form>
        <!-- 活動資訊無法編輯的部分 -->
          <el-form :model="editForm" :rules="Rules" ref="addFormref" label-width="100px" v-else :disabled="true">
        <div class="text">
          <span>活動名稱</span>
          <span class="description">
            <el-form-item label="繁中" >
              <el-input v-model="editForm.activity_name_GR" style="width:400px" ></el-input>
            </el-form-item>
            <el-form-item label="简中" >
              <el-input v-model="editForm.activity_name_CN" style="width:100%" ></el-input>
            </el-form-item>
            <el-form-item label="EN" >
              <el-input v-model="editForm.activity_name_US" style="width:100%" ></el-input>
            </el-form-item>
          </span>
        </div>

        <hr width="80%" />
        <div class="text">
          <span>活動描述</span>
          <span class="description">
            <el-form-item label="繁中" >
              <el-input v-model="editForm.activity_content_GR" style="width:400px" type="textarea" rows="7"></el-input>
            </el-form-item>
            <el-form-item label="简中" >
              <el-input v-model="editForm.activity_content_CN" style="width:100%" type="textarea"  rows="7"></el-input>
            </el-form-item>
            <el-form-item label="EN" >
              <el-input v-model="editForm.activity_content_US" style="width:100%" type="textarea"  rows="7"></el-input>
            </el-form-item>
             <el-form-item style="color:#BEBEBE" v-if="editForm.status!==2">
            已額滿無法編輯活動資訊
            </el-form-item>
               <el-form-item style="color:#BEBEBE" v-else>

            </el-form-item>
          </span>
        </div>
      </el-form>
      <!-- 活動機制 -->
      <div class="txt">
        活動機制
        <hr />
      </div>
      <div class="mechanism">
        <el-form :model="editForm" :rules="Rules" ref="addFormref" label-width="200px" v-if="editForm.status===0">
<!--           <el-form-item label="活動類型" prop="type">
            <el-select v-model="editForm.type" placeholder="請選擇" style="width:30%" >
              <el-option
                v-for="(enableValue,index) in enable"
                :key="index"
                v-bind:label="enableValue.label"
                v-bind:value="enableValue.value"
              >{{enableValue.label}}</el-option>
            </el-select>&nbsp;
          </el-form-item> -->
          <hr width="80%" />
          <!-- 開始時間 -->
          <el-form-item label="開始時間" :required="true" >
            <el-date-picker
              :editable="false"
              v-model="startBudgetTime"
              :picker-options="pickerOptionsStart"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="選擇開始日期"
            ></el-date-picker>&nbsp;
            <el-select v-model="starttmiehr" style="width:10%" placeholder="00">
              <el-option
                v-for="(time,index) in timehr"
                :key="index"
                :label="time.label"
                :value="time.value"
              >{{time.label}}</el-option>
            </el-select>
            <el-select v-model="starttimemin" style="width:10%" placeholder="00">
              <el-option
                v-for="(starttimemin,index) in timemin"
                :key="index"
                :label="starttimemin.label"
                :value="starttimemin.value"
              >{{starttimemin.label}}</el-option>
            </el-select>
          </el-form-item>
          <!-- 結束時間 -->
          <el-form-item label="結束時間" :required="true" >
            <el-date-picker
              :editable="false"
              v-model="endBudgetTime"
              :picker-options="pickerOptionsEnd"
              type="date"
              format="yyyy-MM-dd "
              value-format="yyyy-MM-dd"
              placeholder="選擇結束日期"
            ></el-date-picker>&nbsp;
                 <el-select v-model="endtimehr" style="width:10%" placeholder="23">
              <el-option
                v-for="(endtimehr,index) in timehr"
                :key="index"
                :label="endtimehr.label"
                :value="endtimehr.value"
              >{{endtimehr.label}}</el-option>
            </el-select>
            <el-select v-model="endtimemin" style="width:10%" placeholder="00">
              <el-option
                v-for="(endtimemin,index) in timemin"
                :key="index"
                :label="endtimemin.label"
                :value="endtimemin.value"
              >{{endtimemin.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人數限制" prop="people_limit">
            <el-input v-model="editForm.people_limit" style="width:80px"></el-input>&nbsp;位 (設0表示無限制)
          </el-form-item>
          <hr width="80%" />
          <el-form-item label="對象" prop="people_set">
            <el-select v-model="editForm.people_set" placeholder="請選擇" style="width:30%">
              <el-option
                v-for="(item,index) in Objecttype"
                :key="index"
                v-bind:label="item.label"
                v-bind:value="item.value"
              >{{item.label}}</el-option>
            </el-select>&nbsp;
          </el-form-item>
          <hr width="80%" />
          <el-form-item label="獎勵金額" prop="bonus_amount">
            <el-input v-model="editForm.bonus_amount" style="width:80px" placeholder="金額"></el-input>
            <el-select v-model="editForm.bonus_currency" placeholder="USDT" style="width:10%">
              <el-option
                v-for="(coin,index) in currencyList"
                :key="index"
                v-bind:label="coin.currency"
                v-bind:value="coin.id"
              >{{coin.currency}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="獎勵次數" prop="bonus_limit">
            <el-input-number v-model="editForm.bonus_limit" :min="1" :max="10" size="mini"></el-input-number>&nbsp;次，超過此次數及停止派發獎勵
          </el-form-item>
          <hr width="80%" />
        </el-form>
        <!-- 活動機制無法編輯的部分 -->
        <el-form :model="editForm" ref="addFormref" label-width="200px" v-else :disabled="true">
 <!--          <el-form-item label="活動類型" >
            <el-select v-model="editForm.type" placeholder="請選擇" style="width:30%">
              <el-option
                v-for="(enableValue,index) in enable"
                :key="index"
                v-bind:label="enableValue.label"
                v-bind:value="enableValue.value"
              >{{enableValue.label}}</el-option>
            </el-select>&nbsp;
          </el-form-item> -->
          <hr width="80%" />
          <!-- 開始時間 -->
          <el-form-item label="開始時間"  >
            <el-date-picker
              :editable="false"
              v-model="startBudgetTime"
              :picker-options="pickerOptionsStart"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="選擇開始日期"
            ></el-date-picker>&nbsp;
            <el-select v-model="starttmiehr" style="width:10%" placeholder="00">
              <el-option
                v-for="(time,index) in timehr"
                :key="index"
                :label="time.label"
                :value="time.value"
              >{{time.label}}</el-option>
            </el-select>
            <el-select v-model="starttimemin" style="width:10%" placeholder="00">
              <el-option
                v-for="(starttimemin,index) in timemin"
                :key="index"
                :label="starttimemin.label"
                :value="starttimemin.value"
              >{{starttimemin.label}}</el-option>
            </el-select>
          </el-form-item>
          <!-- 結束時間 -->
          <el-form-item label="結束時間"  >
            <el-date-picker
              :editable="false"
              v-model="endBudgetTime"
              :picker-options="pickerOptionsEnd"
              type="date"
              format="yyyy-MM-dd "
              value-format="yyyy-MM-dd"
              placeholder="選擇結束日期"
            ></el-date-picker>&nbsp;
                 <el-select v-model="endtimehr" style="width:10%" placeholder="23">
              <el-option
                v-for="(endtimehr,index) in timehr"
                :key="index"
                :label="endtimehr.label"
                :value="endtimehr.value"
              >{{endtimehr.label}}</el-option>
            </el-select>
            <el-select v-model="endtimemin" style="width:10%" placeholder="00">
              <el-option
                v-for="(endtimemin,index) in timemin"
                :key="index"
                :label="endtimemin.label"
                :value="endtimemin.value"
              >{{endtimemin.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人數限制">
            <el-input v-model="editForm.people_limit" style="width:80px"></el-input>&nbsp;位 (設0表示無限制)
          </el-form-item>
          <hr width="80%" />
          <el-form-item label="對象" >
            <el-select v-model="editForm.people_set" placeholder="請選擇" style="width:30%">
              <el-option
                v-for="(item,index) in Objecttype"
                :key="index"
                v-bind:label="item.label"
                v-bind:value="item.value"
              >{{item.label}}</el-option>
            </el-select>&nbsp;
          </el-form-item>
          <hr width="80%" />
          <el-form-item label="獎勵金額">
            <el-input v-model="editForm.bonus_amount" style="width:80px" placeholder="金額"></el-input>
            <el-select v-model="editForm.bonus_currency" placeholder="USDT" style="width:10%">
              <el-option
                v-for="(coin,index) in currencyList"
                :key="index"
                v-bind:label="coin.currency"
                v-bind:value="coin.id"
              >{{coin.currency}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="獎勵次數">
            <!--  <el-input v-model="addForm.people_limit" style="width:80px"></el-input> &nbsp; -->
            <el-input-number v-model="editForm.bonus_limit" :min="1" :max="10" size="mini"></el-input-number>&nbsp;次，超過此次數及停止派發獎勵
          </el-form-item>
            <el-form-item>
                <span style="color:#8C8C8C"  v-if="editForm.status===1 ||editForm.status===3">活動進行中無法編輯活動機制</span >
                <span style="color:#8C8C8C"  v-else></span >
          </el-form-item>
          <hr width="80%" />
        </el-form>
      </div>

      <!-- 底部区域 -->
      <div class="btn"  >
          <el-button type="primary" @click="setacList" style="width:40%">編輯活動</el-button>
      </div>

    </el-card>
    <!-- 審核不通過訊息 -->
    <el-dialog title="確定要刪除?" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delbtn">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  currencyList,
  setBehavior,
  checkBehaviorEndTime
} from '../../api/index.js'
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
      endtimehr: {},
      lasttime: '',
      condition: '',
      starttime: '',
      date: [],
      ActivityJoinlist: [],
      currencyList: [],
      total: 0, // 总用户数

      addDialogVisible: false,
      editForm: {
        bonus_limit: '',
        people_limit: '',
        titlegr: '',
        titlecn: '',
        titleus: ''
      },
      bonuslimit: '',
      coin: {},
      time: {},
      lastttime: {},
      starttmiehr: {},
      starttimemin: {},
      endtime: {},
      endtimemin: {},
      enable: [
        {
          label: '一般',
          value: 5
        },
        {
          label: '註冊',
          value: 1
        },
        {
          label: '實名認證',
          value: 2
        },
        {
          label: '鎖倉認購',
          value: 3
        },
        {
          label: '邀請好友',
          value: 4
        },
        {
          label: '綁定銀行帳戶',
          value: 6
        }
      ],
      Objecttype: [

        {
          label: '不限',
          value: 0
        },
        {
          label: '新用戶(活動開始後註冊)',
          value: 1
        },
        {
          label: '舊用戶(活動開始前註冊)',
          value: 2
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
      options: [
        {
          value: 0,
          label: '不拘'
        },
        {
          value: 1,
          label: '已註冊'
        },
        {
          value: 2,
          label: '已實名認證'
        },
        {
          value: 3,
          label: '已鎖倉認購'
        },
        {
          value: 4,
          label: '已綁定銀行帳戶'
        }
      ],
      Rules: {
        activity_name_GR: [
          { required: true, message: '請輸入活動名稱', trigger: 'blur' }
        ],
        activity_name_CN: [
          { required: true, message: '請輸入活動名稱', trigger: 'blur' }
        ],
        activity_name_US: [
          { required: true, message: '請輸入活動名稱', trigger: 'blur' }
        ],
        activity_content_GR: [
          { required: true, message: '請輸入活動描述', trigger: 'blur' }
        ],
        activity_content_CN: [
          { required: true, message: '請輸入活動描述', trigger: 'blur' }
        ],
        activity_content_US: [
          { required: true, message: '請輸入活動描述', trigger: 'blur' }
        ],
        currency: [
          { required: true, message: '請選擇活動幣種', trigger: 'blur' }
        ],
        type: [{ required: true, trigger: 'blur' }],
        startBudgetTime: [{ required: true, trigger: 'blur' }],
        endBudgetTime: [{ required: true, trigger: 'blur' }],

        people_limit: [{ required: true, trigger: 'blur' }],
        people_set: [{ required: true, trigger: 'blur' }],
        bonus_amount: [{ required: true, trigger: 'blur' }],
        bonus_limit: [{ required: true, trigger: 'blur' }]
        /* condition: [{ required: true, trigger: 'blur' }] */
      }
    }
  },
  watch: {
    starttmiehr (newData, oldData) {
      if (newData.id === oldData.id) return
      this.$refs.audio.play()
    },
    starttimemin (newData, oldData) {
      if (newData.id === oldData.id) return
      this.$refs.audio.play()
    },
    /*     startBudgetTime (newData, oldData) {
      if (newData.id === oldData.id) return
      this.$refs.audio.play()
    }
 */
    endtimehr (newData, oldData) {
      if (newData.id === oldData.id) return
      this.$refs.audio.play()
    },
    endtimemin (newData, oldData) {
      if (newData.id === oldData.id) return
      this.$refs.audio.play()
    }
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
    this.editForm.bonus_currency = Number(this.editForm.bonus_currency)
    this.starttmiehr = this.editForm.starttime.substr(11, 2)
    this.starttimemin = this.editForm.starttime.substr(14, 2)
    this.endtimehr = this.editForm.endtime.substr(11, 2)
    this.endtimemin = this.editForm.endtime.substr(14, 2)
    this.editForm.bonus_limit =
      this.$route.query.bonus_limit / this.$route.query.bonus_amount
    this.startBudgetTime = this.editForm.starttime.substr(0, 10)
    console.log('456789', this.startBudgetTime)
    this.endBudgetTime = this.editForm.endtime.substr(0, 10)
    this.getlasttime()
    this.editForm.type = Number(this.editForm.type)
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

    uppage () {
      this.$router.push('/activity')
    },
    // 獲得最新時間
    async getlasttime () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        behavior_type: this.$route.query.type
      }
      await checkBehaviorEndTime(data).then(res => {
        this.lasttime = res.data
        console.log('this.lasttime', this.lasttime.endtime)
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
      })
    },
    // 設置
    async setacList () {
      this.starttime = moment(this.startBudgetTime).format('YYYY-MM-DD ')
      this.enddate = moment(this.endBudgetTime).format('YYYY-MM-DD ')

      let lastTtem = localStorage.getItem('lasttime')
      let Ctime =
        this.starttime + '' + this.starttmiehr + ':' + this.starttimemin
      let Etime = this.enddate + this.endtimehr + ':' + this.endtimemin

      console.log('lastTtem', lastTtem)
      console.log('Ctime', Ctime)
      console.log('Etime', Etime)
      /*       if (this.$route.query.status === 1) {
        if (
          lastTtem === Ctime ||
          Ctime <= lastTtem ||
          Etime <= lastTtem ||
          Ctime >= Etime
        ) {
          this.$message.error('時間設置異常')
        }
      } else { */
      if (this.editForm.bonus_amount === 0) {
        this.bonuslimit = this.$route.query.bonus_limit
        this.editForm.bonus_limit_status = '0'
      } else {
        this.bonuslimit = this.editForm.bonus_amount * this.editForm.bonus_limit
        this.editForm.bonus_limit_status = '1'
        console.log(this.bonuslimit)
      }

      var data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        type: this.editForm.type,
        activity_name_GR: this.editForm.activity_name_GR,
        activity_name_CN: this.editForm.activity_name_CN,
        activity_name_US: this.editForm.activity_name_US,
        activity_content_US: this.editForm.activity_content_US,
        activity_content_CN: this.editForm.activity_content_CN,
        activity_content_GR: this.editForm.activity_content_GR,
        starttime: this.starttime + '' + this.starttmiehr + ':' + this.starttimemin,
        endtime: this.enddate + this.endtimehr + ':' + this.endtimemin,
        bonus_amount: this.editForm.bonus_amount,
        bonus_currency: this.editForm.bonus_currency,
        bonus_limit: this.bonuslimit,
        people_limit: this.editForm.people_limit,
        bonus_limit_status: this.editForm.bonus_limit_status,
        show_status: this.editForm.show_status.toString(),
        people_set: this.editForm.people_set,
        behavior_id: this.editForm.id,
        link_url: this.editForm.link_url,
        link_url_en: this.editForm.link_url_en,
        link_url_cn: this.editForm.link_url_cn
      }
      console.log('data', data)
      await setBehavior(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('編輯成功')
        } else {
          this.$message.error('修改失敗')
        }
        this.$router.push('/activity')
      })
      /*  } */
    },
    /*  changeStart () {
      console.log('123')
      if (!this.lasttime.endtime) {
        this.pickerOptionsStart = {
          disabledDate: {}
        }
        return
      }
      this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {

        disabledDate: (time) => {
          var times = ''
          times = time.getTime() < this.lasttime.endtime
          return times
        }
      })
    },

    changeEnd () {
      if (!this.startBudgetTime) {
        this.pickerOptionsEnd = {
          disabledDate: {}
        }
        return
      }
      this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
        disabledDate: (time) => {
          return time.getTime() < this.startBudgetTime
        }
      })
    }, */
    delbtn () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        behavior_id: this.editForm.id,
        active: '0'
      }
      setBehavior(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('刪除成功')
        } else {
          this.$message.error('刪除失敗')
        }
        this.$router.push('/activity')
      })
    },
    addDialogClosed () {
      this.addDialogVisible = false
    },
    showaddDialog () {
      this.addDialogVisible = true
    }
  }
}
</script>

<style less>
.txt {
  color: #169bd5;
  font-weight: bold;
}
.txt hr {
  background-color: #169bd5;
  height: 2px;
}
.text {
  font-size: 16px;
  padding: 25px 200px 0px;
  display: flex;
}
.text.description {
  font-size: 16px;
  padding: 25px 40px 0px;
}
/* .el-form-item{
  margin-bottom: 10px;
} */
.mechanism {
  padding: 25px 80px 0px;
}
.mechanism .el-form-item__label {
  font-size: 16px;
  padding: 0 18px 0;
}
.btn {
  width: 30%;
  margin: 20px 180px;
}
.fontpadding {
  margin: 0 10px;
}
</style>
