<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', '定投管理']"></TopBreadcrumb>

    <el-card>
      <el-button type="primary" @click="addDialogVisible = true" class="btn_right">建立定投</el-button>

<!-- 列表 -->
      <el-table :data="stakinglist">
        <el-table-column label="ID" prop="id" align="center" width="50%" >
        </el-table-column>
        <el-table-column label="顯示"  align="center" width="50%">
          <template slot-scope="scope">
              <div v-if="scope.row.show_status===0" style="color:#AAAAAA"> <font-awesome-icon  icon="ban" size="lg" /> </div>
              <!--  <div v-else-if="scope.row.show_status===1" style="color:#79BB13"> <font-awesome-icon icon="check-circle" size="lg" /> </div> -->
              <div v-else style="color:#79BB13"> <font-awesome-icon icon="check-circle"  size="lg"/> </div>
          </template>
        </el-table-column>
        <el-table-column label="定投名稱"  align="center" prop="title_GR">
        </el-table-column>
        <el-table-column label="from幣種"  align="center" >
          <template slot-scope="scope">
            <div
              v-for="item in currencyList"
              :key="item.id"
              :label="item.currency"
              :value="item.id"
            >
            <div v-if="item.id==scope.row.currency_basic"   class="coinpadding">{{item.currency}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="to幣種" align="center" >
          <template slot-scope="scope">
            <div
              v-for="item in currencyList"
              :key="item.id"
              :label="item.currency"
              :value="item.id"
            >
            <div v-if="item.id==scope.row.currency_purchase"   class="coinpadding">{{item.currency}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="定投日期"  align="center"  style="background-color:#FFFFF1"  prop="purchase_day">

          每月6,16,26日

        </el-table-column>
        <el-table-column label="成交手續費" align="center"  prop="rate_deal">
          <template slot-scope="scope">
          {{scope.row.rate_deal}} %
            </template>
        </el-table-column>
        <el-table-column label="代買手續費" align="center"  prop="rate_purchase">
          <template slot-scope="scope">
          {{scope.row.rate_purchase*100}} %
          </template>
        </el-table-column>
        <el-table-column label="躉繳優惠" align="center"  prop="sp_rate">
          <template slot-scope="scope">
           {{scope.row.sp_rate*100}} %
          </template>
        </el-table-column>
        <el-table-column label="開放期限" align="left" width="150%" >
          <template slot-scope="scope">
            {{scope.row.sp_starttime}} ~
            <div>{{scope.row.sp_endtime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="人數上限" align="center" >
          <template slot-scope="scope">
           {{scope.row.sp_people_limit}} 人
          </template>
        </el-table-column>
        <el-table-column label="認購名單" align="center" >
          <template slot-scope="scope">
            <el-button type="success"  plain size="mini" @click="joinPeople(scope.$index, scope.row)">{{scope.row.people_count}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="餘額不足" align="center"  >
          <template slot-scope="scope">
            <el-button type="success"  plain size="mini" @click="balancePeople(scope.$index, scope.row)">{{scope.row.people_count}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="編輯" align="center" width="100%" >
          <template slot-scope="scope">
            <el-button  :to="{path:'/activitylist', query: scope.row}" class="el-icon-edit" plain size="mini" @click="openEditInvestment(scope.$index, scope.row)"></el-button>
                         <router-link :to="{path:'/activitylist', query: scope.row}" >{{scope.row.activity_name_GR}}</router-link>

          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10,20,50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

<!-- 建立定投 -->
    <el-dialog title="建立定投" :visible.sync="addDialogVisible" width="60%" >
      <el-form  :model="addForm" ref="addFormRef" label-width="100px" class="addform">

        <el-form-item label="前台顯示" prop="show_status">
                     <el-switch
              v-model="addForm.show_status"
              active-color="#169BD5"
              inactive-color="#BEBEBE"
              :active-value='1'
              :inactive-value='0'
              class="fontpadding"
            ></el-switch>
        </el-form-item>

        <el-form-item label="名稱(繁)" prop="title_GR" class="title_input_size">
          <el-input v-model="addForm.title_GR" class="inputcharge"></el-input>
        </el-form-item>

        <el-form-item label="名稱(簡)" prop="title_CN" class="title_input_size">
          <el-input v-model="addForm.title_CN" class="inputcharge"></el-input>
        </el-form-item>

        <el-form-item label="名稱(英)" prop="title_US" class="title_input_size">
          <el-input v-model="addForm.title_US" class="inputcharge"></el-input>
        </el-form-item>
<hr class="hr-style1">
<br>
        <el-form-item label="幣種from" prop="currency_basic">
          <el-select v-model="addForm.currency_basic" placeholder="請選擇幣種">
            <el-option label="USDT" value="23"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="幣種to" prop="currency_purchase">
          <el-select v-model="addForm.currency_purchase" placeholder="請選擇幣種">
            <el-option label="BTC" value="24"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="最低認購" prop="minAmount" class="title_input_size">
          <el-input v-model="addForm.minAmount" class="inputcharge"></el-input>
         <span v-if="addForm.currency_basic==23">USDT</span>
        </el-form-item>
        <el-form-item label="定投日期" prop="purchase_day">
        <div class="orange-text">每月6日、16日、26日 早上10:00</div>
        </el-form-item>
        <el-form-item label="成交手續費" prop="rate_deal" class="percent_input_size">
        <el-input v-model="addForm.rate_deal" class="inputcharge" type="number"></el-input>
        </el-form-item>
        <el-form-item label="代買手續費" prop="rate_purchase" class="percent_input_size">
          <el-input v-model="addForm.rate_purchase" class="inputcharge" type="number"></el-input>％
        </el-form-item>
<hr class="hr-style1">
<div class="subtitle">躉繳</div>
        <el-form-item label="躉繳違約手續費" prop="sp_quit_rate" class="percent_input_size" >
          <el-input v-model="addForm.sp_quit_rate" class="inputcharge"></el-input>％ <br/>（從剩餘期數金額中扣除)
        </el-form-item>
        <el-form-item label="躉繳優惠" prop="sp_rate" class="percent_input_size" >
          <el-input v-model="addForm.sp_rate" class="inputcharge" type="number"></el-input>％
        </el-form-item>
        <el-form-item label="躉繳優惠期間">
          <el-date-picker
            v-model="addForm.addtxtrate"
            type="datetimerange"
            format="yyyy-MM-dd HH:hh"
            value-format="yyyy-MM-dd HH:hh"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="躉繳優惠人數上限" prop="sp_people_limit" class="percent_input_size">
          <el-input v-model="addForm.sp_people_limit" class="inputcharge" type="number"></el-input>人
        </el-form-item>
         <el-form-item label="躉繳優惠金額上限(每月)" prop="sp_maxAmount" class="percent_input_size">
          <el-input v-model="addForm.sp_maxAmount" class="inputcharge"></el-input><span v-if="addForm.currency_basic==23">USDT</span>
        </el-form-item>
      </el-form>
      <!-- 底部區域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="canceladd">取 消</el-button>
        <el-button type="primary" @click="fixedInvestment">儲 存</el-button>
      </span>
    </el-dialog>

<!-- 認購名單 -->
    <el-dialog title="認購用戶名單" :visible.sync="joinPeopleVisible" width="60%" >
      <div>定投名稱：BTC定投</div>
        <el-table :data="StakingMemberList">
          <el-table-column label="UUID" prop="uuid"  align="center"></el-table-column>
          <el-table-column label="定投金額" align="center" >
            <template slot-scope="scope">
              <div>{{scope.row.amount}} {{scope.row.currencyName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="定投日期"  style="background-color:#FFFFF1" align="center" >
            <template slot-scope="scope">
              <div>每月 {{scope.row.purchase_day}} 日</div>
            </template>
          </el-table-column>
          <el-table-column label="認購日期"  style="background-color:#FFFFF1" align="left" >
            <template slot-scope="scope" >
              <div >{{scope.row.ctime}}</div>
            </template>
          </el-table-column>
          <el-table-column label="退出日期"  style="background-color:#FFFFF1" align="left" >
            <template slot-scope="scope">
              <div align="left">{{scope.row.quittime}}</div>
            </template>
          </el-table-column>
          <el-table-column label="退出原因"  style="background-color:#FFFFF1" align="center" >
            <template slot-scope="scope">
              <div>{{scope.row.quit_reason}}</div>
            </template>
          </el-table-column>
        </el-table>
    </el-dialog>

<!-- 編輯定投 -->
    <el-dialog title="編輯定投" :visible.sync="editDialogVisible" width="50%" >
      <el-form  :model="editForm" ref="editFormRef" label-width="130px" class="editForm" >

        <el-form-item label="前台顯示" prop="show_status">
            <el-switch
              v-model="editForm.show_status"
              active-color="#169BD5"
              inactive-color="#BEBEBE"
              :active-value='1'
              :inactive-value='0'
              class="fontpadding"
            ></el-switch>
        </el-form-item>

        <el-form-item label="名稱(繁)" prop="title_GR" class="title_input_size">
          <el-input v-model="editForm.title_GR" class="inputcharge">
            <template slot-scope="scope">
              {{scope.row.title_GR}}
            </template></el-input>
        </el-form-item>

        <el-form-item label="名稱(簡)" prop="title_CN" class="title_input_size">
          <el-input v-model="editForm.title_CN" class="inputcharge">
          <template slot-scope="scope">
              {{scope.row.title_CN}}
            </template></el-input>
        </el-form-item>

        <el-form-item label="名稱(英)" prop="title_US" class="title_input_size">
          <el-input v-model="editForm.title_US" class="inputcharge">
          <template slot-scope="scope">
              {{scope.row.title_US}}
            </template></el-input>
        </el-form-item>
<hr class="hr-style1">
<br>
        <el-form-item label="幣種from" prop="currency_basic">
          <el-select v-model="editForm.currency_basic" placeholder="請選擇幣種">
            <el-option label="USDT" value="23"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="幣種to" prop="currency_purchase">
          <el-select v-model="editForm.currency_purchase" placeholder="請選擇幣種">
            <el-option label="BTC" value="24"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="最低認購" prop="minAmount" class="title_input_size">
          <el-input v-model="editForm.minAmount" class="inputcharge" type="number"></el-input>
          <!-- {{editForm.currency_basic}} -->
          <span v-if="editForm.currency_basic==23">USDT</span>
        </el-form-item>
        <el-form-item label="定投日期" prop="purchase_day">
        <div class="orange-text">每月6日、16日、26日 早上10:00</div>
        </el-form-item>
        <el-form-item label="成交手續費" prop="rate_deal" class="percent_input_size">
        <el-input v-model="editForm.rate_deal" class="inputcharge" type="number"></el-input>
        </el-form-item>
        <el-form-item label="代買手續費" prop="rate_purchase" class="percent_input_size">
          <el-input v-model="editForm.rate_purchase" class="inputcharge" type="number"></el-input>％
        </el-form-item>
<hr class="hr-style1">
<div class="subtitle">躉繳</div>
        <el-form-item label="躉繳違約手續費" prop="sp_quit_rate" class="percent_input_size" >
          <el-input v-model="editForm.sp_quit_rate" class="inputcharge" type="number"></el-input>％（從剩餘期數金額中扣除)
        </el-form-item>
        <el-form-item label="躉繳優惠" prop="sp_rate" class="percent_input_size">
          <el-input v-model="editForm.sp_rate" class="inputcharge" type="number"></el-input>％
        </el-form-item>
        <el-form-item label="躉繳優惠期間">
          <el-date-picker
            v-model="editForm.sp_starttime"
            type="datetime"
            format="yyyy-MM-dd HH:hh"
            value-format="yyyy-MM-dd HH:hh"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            >
          </el-date-picker>
          <el-date-picker
            v-model="editForm.sp_endtime"
            type="datetime"
            format="yyyy-MM-dd HH:hh"
            value-format="yyyy-MM-dd HH:hh"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="躉繳優惠人數上限" prop="sp_people_limit" class="percent_input_size">
          <el-input v-model="editForm.sp_people_limit" class="inputcharge" type="number"></el-input>人
        </el-form-item>
         <el-form-item label="躉繳優惠金額上限(每月)" prop="sp_maxAmount" class="percent_input_size">
          <el-input v-model="editForm.sp_maxAmount" class="inputcharge" type="number"></el-input>人
        </el-form-item>
      </el-form>
      <!-- 底部區域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateStaking">儲 存</el-button>
      </span>
    </el-dialog>
<!-- 餘額不足 -->
    <el-dialog title="餘額不足名單" :visible.sync="balancePeopleVisible" width="60%" >
        <div>定投名稱：BTC定投</div>
        <div>報表產製：2020/05/06 10:00</div>
        <div>定投時間：每月6日 10:00</div>
        <el-table :data="StakingBalanceLackList">
          <el-table-column label="UUID" prop="uuid" width="100px"  align="center"></el-table-column>
          <el-table-column label="認購日期"  style="background-color:#FFFFF1" align="center" >
            <template slot-scope="scope">
              <div>{{scope.row.ctime}}</div>
            </template>
          </el-table-column>
          <el-table-column label="定投金額" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.amount}} {{scope.row.currencyName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="可用餘額" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.balance}} {{scope.row.currencyName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="手機號碼"  style="background-color:#FFFFF1" >
            <template slot-scope="scope">
              <div>{{scope.row.mobile}}</div>
            </template>
          </el-table-column>
          <el-table-column label="電子信箱"  style="background-color:#FFFFF1" >
            <template slot-scope="scope">
              <div>{{scope.row.email}}</div>
            </template>
          </el-table-column>
        </el-table>
    </el-dialog>

    </el-card>
  </div>
</template>

<script>
import {
  currencyList,
  getStakingList,
  getStakingMemberList,
  getStakingBalanceLackList,
  addStaking,
  setStaking
} from '../../api/index.js'

export default {
  data () {
    return {
      StakingBalanceLackList: [],
      showValue: '2',
      setStaking: [],
      StakingMemberList: [],
      people_limit: '',
      endTime: '',
      queryData: {},
      content: '',
      searchlist: '',
      currencyList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: '',
        beginTime: '',
        endTime: ''
      },
      date: [],
      stakinglist: [ ],
      actypelist: [],
      total: 0,
      addDialogVisible: false,
      joinPeopleVisible: false,
      balancePeopleVisible: false,
      addForm: {
        addtxtrate: []
      },
      editDialogVisible: false,
      table: {},
      editForm: {
        sp_starttime: [],
        sp_endtime: [],
        startTime: '',
        lang: [],
        beginTime: []
      },
      startTime: '',
      lastTime: '',
      enable: [
        /*     {
          label: '所有',
          value: ''
        }, */
        {
          label: '人數限制',
          value: '1'
        },
        {
          label: '時間限制',
          value: '2'
        },
        {
          label: '活動常駐',
          value: '3'
        }
      ],
      showstatus: [
        {
          label: '請選擇',
          value: '2'
        },
        {
          label: '顯示',
          value: '1'
        },
        {
          label: '不顯示',
          value: '0'
        }
      ]
    }
  },
  /*   components: {
    savesort
  }, */
  Filter: {
    commaFormat: function (value) {
      // 加上千分位符號
      return value
        .toString()
        .replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (
          all,
          pre,
          groupOf3Digital
        ) {
          return pre + groupOf3Digital.replace(/\d{3}/g, ',$&')
        })
    }
  },
  watch: {
    startTime (newData, oldData) {
      if (newData.id === oldData.id) return
      this.$refs.audio.play()
    },
    lastTime (newData, oldData) {
      if (newData.id === oldData.id) return
      this.$refs.audio.play()
    },
    editForm (val) {
      console.log(val)
    }

  },

  created () {
    this.staList()
    this.getCurrencyList()
    this.staBalanceLackList()
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
    // 獲取定投列表

    async staList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        show_status: this.showValue.toString()
      }
      await getStakingList(data).then(res => {
        this.stakinglist = res.data

        console.log('stakinglist', this.stakinglist)
      })
    },

    async staBalanceLackList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        show_status: this.showValue.toString()
      }
      await getStakingBalanceLackList(data).then(res => {
        this.stakinglist = res.data

        console.log('stakinglist', this.stakinglist)
      })
    },

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getactivitylist()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getactivitylist()
    },

    async Search () {
      this.queryInfo.pagenum = 1
      this.getactivitylist()
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    async clear () {
      this.searchlist = ''
      this.showValue = '2'
      this.enable.value = ''
      /* this.queryInfo.date = '' */
      this.getactivitylist()
    },
    jump (index, row) {
      let queryData = {}
      queryData = row
      this.$router.push({ path: '/activitymem', query: queryData })
    },
    async fixedInvestment () {
      this.addDialogVisible = false
      var data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        title_GR: this.addForm.title_GR,
        title_CN: this.addForm.title_CN,
        title_US: this.addForm.title_US,
        minAmount: this.addForm.minAmount,
        currency_basic: this.addForm.currency_basic,
        currency_purchase: this.addForm.currency_purchase,
        purchase_day: '6',
        rate_deal: '0',
        rate_purchase: this.addForm.rate_purchase / 100,
        show_status: this.addForm.show_status.toString(),
        sp_quit_rate: this.addForm.sp_quit_rate / 100,
        sp_rate: this.addForm.sp_rate / 100,
        sp_starttime: this.addForm.addtxtrate[0],
        sp_endtime: this.addForm.addtxtrate[1],
        sp_people_limit: this.addForm.sp_people_limit,
        sp_maxAmount: this.addForm.sp_maxAmount
      }
      await addStaking(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('新增成功')
        } else {
          this.$message.error('新增錯誤')
        }
        this.staList()
      })
    },
    openEditInvestment (index, row) {
      this.editDialogVisible = true
      console.log('!!!', row)
      this.editForm = { ...row }
      this.editForm.rate_purchase = Number(this.editForm.rate_purchase) * 100
      this.editForm.sp_quit_rate = Number(this.editForm.sp_quit_rate) * 100
      this.editForm.sp_rate = Number(this.editForm.sp_rate) * 100
    //   this.editForm = Object.assign({}, row)
    //   console.log(index)
    //   console.log('1234', this.editForm)
    //   console.log(this)
    },
    async updateStaking () {
      var data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        title_GR: this.editForm.title_GR,
        title_CN: this.editForm.title_CN,
        title_US: this.editForm.title_US,
        minAmount: this.editForm.minAmount,
        currency_basic: this.editForm.currency_basic,
        currency_purchase: this.editForm.currency_purchase,
        purchase_day: '6',
        rate_deal: '0',
        rate_purchase: this.editForm.rate_purchase / 100,
        show_status: this.editForm.show_status.toString(),
        sp_quit_rate: this.editForm.sp_quit_rate / 100,
        sp_rate: this.editForm.sp_rate / 100,
        sp_starttime: this.editForm.sp_starttime,
        sp_endtime: this.editForm.sp_endtime,
        sp_people_limit: this.editForm.sp_people_limit,
        sp_maxAmount: this.editForm.sp_maxAmount,
        staking_id: this.editForm.id
      }
      console.log('$$$$$$$$$', data)
      await setStaking(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('儲存成功')
          this.editDialogVisible = false
        } else {
          this.$message.error('儲存錯誤')
        }
        this.staList()
      })
    },
    joinPeople (index, row) {
      this.joinform = row
      console.log('111', this.joinform)
      this.joinPeopleVisible = true
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        staking_id: this.joinform.id
      }
      getStakingMemberList(data).then(res => {
        this.StakingMemberList = res.data
        console.log('StakingMemberList', this.StakingMemberList)
      })
    },
    balancePeople (index, row) {
      this.lackform = row
      this.balancePeopleVisible = true
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        staking_id: this.lackform.id,
        purchase_day: '06'
      }
      getStakingBalanceLackList(data).then(res => {
        this.StakingBalanceLackList = res.data
        console.log('StakingBalanceLackList', this.StakingBalanceLackList)
      })
    },
    canceladd () {
      this.addForm.title_GR = ''
      this.addForm.title_CN = ''
      this.addForm.title_US = ''
      this.addForm.minAmount = ''
      this.addForm.currency_basic = ''
      this.addForm.currency_purchase = ''
      this.addForm.rate_deal = ''
      this.addForm.rate_purchase = ''
      this.addForm.rate_purchase = ''
      this.addForm.show_status = ''
      this.addForm.sp_quit_rate = ''
      this.addForm.sp_rate = ''
      this.addForm.addtxtrate[0] = ''
      this.addForm.addtxtrate[1] = ''
      this.addForm.sp_people_limit = ''
      this.addForm.sp_maxAmount = ''
      this.addDialogVisible = false
    }
  }
}
/* 數字千分位 */
</script>

<style>
*{
  font-family: 'Noto Sans TC', sans-serif;
}

.form-right {
  width: 50%;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
}
.btn_right {
  float: right;
  left: 50px;
}
input::-webkit-input-placeholder {
  /* placeholder颜色  */
  color: #aab2bd;
  /* placeholder字体大小  */
  font-size: 12px;
}
.coinpadding{
  margin: 10px;
}

.hr-style1{
    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, rgb(247, 162, 162), rgb(248, 218, 119), rgb(247, 162, 162));
    margin:10px;
}

.subtitle{
  text-align:center;
  color:#E67C4B;
  font-size:22px;
  font-weight:400;
  padding:20px;
}

.orange-text{
  color:#E67C4B;
  font-weight:600;
}

.title_input_size{

width:40%;

}
.percent_input_size{
width:40%;
}
.inputcharge{
  width: 80%;
}
.addform{
  padding:0 60px;

}
</style>
