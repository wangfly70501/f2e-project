<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', '鎖倉管理']"></TopBreadcrumb>

    <el-card>
      <!-- 搜索工具 -->
      <div class="text">
        <el-input
          v-model="searchlist"
          @keyup.enter.native="Search"
          style="width:10%"
          placeholder="請輸入標題"
        ></el-input>&nbsp;
        <el-date-picker
          type="daterange"
          start-placeholder="StartTime"
          end-placeholder="EndTime"
          v-model="queryInfo.date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width:20% "
        ></el-date-picker>&nbsp;
        <el-select v-model="enable.value" placeholder="請選擇" style="width:8% ">
          <el-option
            v-for="(enableValue,index) in enable"
            :key="index"
            v-bind:label="enableValue.label"
            v-bind:value="enableValue.value"
          >{{enableValue.label}}</el-option>
        </el-select>&nbsp;
        <el-button type="info" @click="clear" >清除</el-button>
        <el-button type="primary" @click="Search">搜尋</el-button>
        <el-button type="primary" @click="addDialogVisible = true" class="btn_right">建立活動</el-button>
      </div>
      <!-- 列表 -->
      <el-table :data="Lockuplist"  @selection-change="handleSelectionChange"  :header-cell-style="tableHeaderColor" border>
        <!-- <el-table-column
      type="selection"
      width="40px">
    </el-table-column>
        <el-table-column label="ID" prop="id" width="40px"></el-table-column>-->
        <el-table-column label="ID" prop="id" width="40%"></el-table-column>
        <el-table-column label="活動名稱" prop="title"></el-table-column>

        <el-table-column label="幣種" >
          <template slot-scope="scope">
            <div
              v-for="item in currencyList"
              :key="item.id"
              :label="item.currency"
              :value="item.id"
            >
              <div v-if="item.id==scope.row.currency">{{item.currency}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="申購單位">
          <template slot-scope="scope">
            <p>最低 {{scope.row.minAmount | NumFormat}}</p>
            <p>最高 {{scope.row.maxAmount | NumFormat }}</p>
          </template>
        </el-table-column>
        <el-table-column label="利率" prop="rate" width="80%">
          <template slot-scope="scope">{{scope.row.rate*100 }} %</template>
        </el-table-column>
        <el-table-column label="增值期間" width="80%">
          <template slot-scope="scope">{{scope.row.days }} 天</template>
        </el-table-column>
        <el-table-column label="派息方式/時間">
          <template slot-scope="scope">
            <div v-if="scope.row.mode ===1">

              <p>每天派息</p>
            </div>
            <div v-else>

              <p>期滿隔天派息 </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="活動方式">
          <template slot-scope="scope">
            <div v-if="scope.row.type ===1">
              <p>開始: {{scope.row.beginTime | datefformat}}</p>
              <p>結束: 申購人數達{{scope.row.people_limit}} 人</p>
            </div>
            <div v-else>
              <p>開始: {{scope.row.beginTime | datefformat}}</p>
              <p>結束: {{scope.row.endTime | datefformat}}</p>
            </div>
          </template>
        </el-table-column>
        <!--   <el-table-column label="建立時間">
          <template slot-scope="scope">{{scope.row.beginTime | datefformat}}</template>
        </el-table-column>-->
        <el-table-column label="活動創建者" prop="creator" width="90%"></el-table-column>
        <el-table-column label="啟用狀態" width="80%">
          <template slot-scope="scope">
            <div v-if="scope.row.active === 1" style="color:blue">啟用</div>
            <div v-else style="color:gray">棄用</div>
          </template>
        </el-table-column>

        <el-table-column label="活動狀態" width="80%">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0" style="color:orange">未開始</div>
            <div v-else-if="scope.row.status === 1" style="color:red">進行中</div>
            <div v-else style="color:gray">已結束</div>
          </template>
        </el-table-column>

        <el-table-column label="活動類型" width="80%">
          <template slot-scope="scope">
            <div v-if="scope.row.type === 1">人數限制</div>
            <div v-else-if="scope.row.type ===2">時間限制</div>
            <div v-else-if="scope.row.type ===3">活動常駐</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              v-if="scope.row.status === 0"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.$index, scope.row)"
            ></el-button>

            <el-button v-else disabled type="info" plain icon="el-icon-edit" size="mini">
              <el-tooltip effect="dark" content="活動開始或結束無法編輯" placement="top-start"></el-tooltip>
            </el-button>&nbsp;
            <el-button
              @click="jump(scope.$index, scope.row)"
              size="mini"
              type="success"
              plain
              icon="el-icon-tickets"
            ></el-button>
            <!--        <el-button
              type="success" plain
              icon="el-icon-view"
              size="mini"
              @click="deleteUserById(scope.row.id)"
            >檢視詳細</el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 新增鎖倉 -->
    <el-dialog title="建立鎖倉活動" :visible.sync="addDialogVisible" width="70%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="Rules" ref="addFormref" label-width="100px">
        <el-form-item label="活動名稱" prop="title">
          <el-input v-model="addForm.title" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="活動幣種" prop="currency">
          <el-select v-model="addForm.currency" placeholder="請選擇">
            <el-option
              v-for="item in currencyList"
              :key="item.id"
              :label="item.currency"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申購單位" prop="Amount">
          <el-input v-model="addForm.minAmount" placeholder="最低申購" style="width:200px"></el-input>~
          <el-input v-model="addForm.maxAmount" placeholder="最高申購" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="活動利率" prop="rate">
          <el-input v-model="addForm.rate" style="width:180px"></el-input>%
        </el-form-item>
        <el-form-item label="增值期間" prop="days">
          <el-input v-model="addForm.days" style="width:180px"></el-input>天
        </el-form-item>
        <el-form-item label="派息方式" prop="mode">
          <el-radio-group v-model="addForm.mode">
            <el-radio :label="0">期滿派息</el-radio>
            <el-radio :label="1">每天派息</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活動方式" prop="type">
          <el-radio-group v-model="addForm.type">
            <el-radio :label="1">人數限制</el-radio>
            <el-radio :label="2">時間限制</el-radio>
            <el-radio :label="3">活動常駐</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 時間限制:人數可以不用填寫 -->
        <el-form-item label="人數限制" v-if="addForm.type===1">
          <el-input v-model="addForm.people_limit" style="width:180px" placeholder="請輸限制入數"></el-input>人
        </el-form-item>
        <el-form-item label="人數限制" v-else-if="addForm.type===2">
          <el-input
            v-model="addForm.people_limit"
            style="width:180px"
            placeholder="時間限制可以不用填寫"
            disabled
          ></el-input>人
        </el-form-item>
               <el-form-item label="活動常駐" v-else-if="addForm.type===3">
          <el-input
            v-model="addForm.people_limit"
            style="width:180px"
            placeholder="活動常駐可以不用填寫"
            disabled
          ></el-input>人
        </el-form-item>
        <el-form-item label="人數限制" v-else>
          <el-input v-model="addForm.people_limit" style="width:180px"></el-input>人
        </el-form-item>
        <!-- 人數限制:時間限制可以不用填寫 -->
        <!--    <div style="display: flex"> -->
        <el-form-item label="活動開始日期">
          <el-date-picker
            type="date"
            v-model="addForm.beginTime"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd "
            style="width:30%"
          ></el-date-picker>&nbsp;
          <el-time-select
            style="width:30%"
            v-model="addForm.starttime"
            :picker-options="{
    start: '00:00',
    step: '00:30',
    end: '23:30'
  }"
          ></el-time-select>
        </el-form-item>
        <el-form-item label="活動結束日期" v-if="addForm.type===1">
          <el-date-picker
            type="date"
            v-model="addForm.endTime"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd "
            style="width:30%"
            disabled
            placeholder="人數限制可以不用填寫"
            picker-options:step
          ></el-date-picker>&nbsp;
          <el-time-select
            style="width:30%"
            v-model="addForm.endtimes"
            :picker-options="{
    start: '00:00',
    step: '00:30',
    end: '23:30'
  }"
            disabled
          ></el-time-select>
        </el-form-item>
        <el-form-item label="活動結束日期" v-else-if="addForm.type===2">
          <el-date-picker
            type="date"
            v-model="addForm.endTime"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd "
            style="width:30%"
            picker-options:step
          ></el-date-picker>&nbsp;
          <el-time-select
            style="width:30%"
            v-model="addForm.endtimes"
            :picker-options="{
    start: '00:00',
    step: '00:30',
    end: '23:30'
  }"
          ></el-time-select>
        </el-form-item>
                <el-form-item label="活動結束日期" v-else-if="addForm.type===3">
          <el-date-picker
            type="date"
            v-model="addForm.endTime"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd "
            style="width:30%"
            picker-options:step
            disabled
          ></el-date-picker>&nbsp;
          <el-time-select
            style="width:30%"
            v-model="addForm.endtimes"
            disabled
            :picker-options="{
    start: '00:00',
    step: '00:30',
    end: '23:30'
  }"
          ></el-time-select>
        </el-form-item>

        <el-form-item label="活動結束日期" v-else>
          <el-date-picker
            type="date"
            v-model="addForm.endTime"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd "
            style="width:30%"
          ></el-date-picker>&nbsp;
          <el-time-select
            style="width:30%"
            v-model="addForm.endtimes"
            :picker-options="{
    start: '00:00',
    step: '00:30',
    end: '23:30'
  }"
          ></el-time-select>
        </el-form-item>
        <!--  </div> -->
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addLockup">確定</el-button>
      </span>
    </el-dialog>

    <!--編輯活動 -->
    <el-dialog title="編輯活動" :visible.sync="editDialogVisible" width="60%" @close="editDialogClosed">
      <el-form :model="editForm" ref="editFormRef" label-width="100px" :rules="Rules">
        <el-form-item label="活動名稱" prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="活動幣種" prop="currency">
          <el-select v-model="editForm.currency" placeholder="請選擇">
            <el-option
              v-for="item in currencyList"
              :key="item.id"
              :label="item.currency"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="申購單位" prop="Amount">
          <el-form-item>
            <el-input v-model="editForm.minAmount" placeholder="最低申購" style="width:200px"></el-input>~
            <el-input v-model="editForm.maxAmount" placeholder="最高申購" style="width:200px"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="活動利率" prop="rate">
          <el-input v-model="editForm.rate" style="width:180px"></el-input>%
        </el-form-item>

        <el-form-item label="增值期間" prop="days">
          <el-input v-model="editForm.days" style="width:180px"></el-input>天
        </el-form-item>
        <el-form-item label="派息方式" prop="type">
          <el-radio-group v-model="editForm.mode">
            <el-radio :label="0">期滿</el-radio>
            <el-radio :label="1">每天</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="活動啟用">
          <el-switch
            v-model="editForm.active"
            active-color="#13ce66"
            inactive-color="#BEBEBE"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="活動方式">
          <el-radio-group v-model="editForm.type">
            <el-radio :label="1">人數限制</el-radio>
            <el-radio :label="2">時間限制</el-radio>
            <el-radio :label="3">活動常駐</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 時間限制:人數可以不用填寫 -->
        <el-form-item label="人數限制" v-if="editForm.type===1">
          <el-input v-model="editForm.people_limit" style="width:180px" placeholder="請輸限制入數"></el-input>人
        </el-form-item>
        <el-form-item label="人數限制" v-else-if="editForm.type===2">
          <el-input v-model="people_limit" style="width:180px" placeholder="時間限制可以不用填寫" disabled></el-input>人
        </el-form-item>
              <el-form-item label="人數限制" v-else-if="editForm.type===3">
          <el-input v-model="people_limit" style="width:180px" placeholder="活動常駐可以不用填寫" disabled></el-input>人
        </el-form-item>
        <el-form-item label="人數限制" v-else>
          <el-input v-model="editForm.people_limit" style="width:180px"></el-input>人
        </el-form-item>

        <!--   <div style="display:flex"> -->
        <el-form-item label="活動開始日期">
          <el-date-picker
            type="date"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd "
            v-model="editForm.beginTime"
            style="width:30%"
          ></el-date-picker>&nbsp;
          <el-time-select
            style="width:30%"
            v-model="editForm.startTime"
            :picker-options="{
    start: '00:00',
    step: '00:30',
    end: '23:30'
  }"
          ></el-time-select>
        </el-form-item>
        <el-form-item label="活動結束日期" v-if="editForm.type===1">
          <el-date-picker
            v-model="endTime"
            type="date"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd "
            style="width:30%"
            disabled
          ></el-date-picker>&nbsp;
          <el-time-select
            style="width:30%"
            v-model="endTime"
            :picker-options="{
    start: '00:00',
    step: '00:30',
    end: '23:30'
  }"
            disabled
          ></el-time-select>
        </el-form-item>
        <el-form-item label="活動結束日期" v-else-if="editForm.type===2">
          <el-date-picker
            v-model="editForm.endTime"
            type="date"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd "
            style="width:30%"
          ></el-date-picker>&nbsp;
          <el-time-select
            style="width:30%"
            v-model="editForm.endTimes"
            :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:30'
            }"
          ></el-time-select>
        </el-form-item>
                <el-form-item label="活動結束日期" v-else>
          <el-date-picker
            v-model="editForm.endTime"
            type="date"

            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd "
            style="width:30%"
          ></el-date-picker>&nbsp;
          <el-time-select
            style="width:30%"

            v-model="editForm.endTimes"
            :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:30'
            }"
          ></el-time-select>
        </el-form-item>

        <!--    </div> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addActivity,
  Lockupdata,
  Lockupedit,
  currencyList
} from '../../api/index.js'

export default {
  data () {
    return {
      people_limit: '',
      endTime: '',
      queryData: {},
      content: '',
      html: '',
      configs: {},
      searchlist: '',
      currencyList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: '',
        beginTime: '',
        endTime: '',
        date: []
      },

      date: [],
      Lockuplist: [],

      total: 0,
      addDialogVisible: false,
      addForm: {
        lang: []
      },
      Rules: {
        title: [{ required: true, message: '請輸入活動名稱', trigger: 'blur' }],
        currency: [
          { required: true, message: '請選擇活動幣種', trigger: 'blur' }
        ],
        Amount: [{ required: true, trigger: 'blur' }],

        rate: [{ required: true, message: '請輸入活動利率', trigger: 'blur' }],
        days: [{ required: true, message: '請輸入增值期間', trigger: 'blur' }],
        mode: [{ required: true, trigger: 'blur' }],
        type: [{ required: true, trigger: 'blur' }]
      },

      editDialogVisible: false,
      table: {},
      editForm: {
        startTime: [],
        lang: []
      },

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
      ]
    }
  },
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

  created () {
    this.getLockupList()
    this.getCurrencyList()
  },

  methods: {
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
    // 获取列表
    async getLockupList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        startDate: this.queryInfo.date[0],
        endDate: this.queryInfo.date[1],
        searchValue: this.searchlist,
        activityType: this.enable.value
      }

      await Lockupdata(data).then(res => {
        this.Lockuplist = res.data
        console.log(this.Lockuplist)
        console.log(this.Lockuplist.endTime)
        this.total = res.pagination.total_record
      })
    },

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getLockupList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getLockupList()
    },

    addDialogClosed () {
      this.$refs.addFormref.resetFields()
      this.addForm.minAmount = ''
      this.addForm.maxAmount = ''
      this.addForm.people_limit = ''
      this.addForm.beginTime = ''
      this.addForm.starttime = ''
      this.addForm.endTime = ''
      this.addForm.endTimes = ''
    },

    showEditDialog (index, row) {
      this.editDialogVisible = true
      this.editForm = row
      var ccc = this.editForm.currency
      this.editForm.currency = Number(ccc)
      var bbb = this.editForm.rate
      this.editForm.rate = Number(bbb) * 100
    /*   var zzz = this.editForm.beginTime
      this.editForm.startTime = zzz.substr(11, 5)
      console.log(this.editForm.startTime)
      var xxx = this.editForm.endTime
      this.editForm.endTimes = xxx.substr(11, 5)
      console.log('565', this.editForm) */
    },

    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
      this.getLockupList()
    },

    async saveEdit () {
      this.editDialogVisible = false
      var ddd = this.editForm.type
      this.editForm.type = Number(ddd)
      /*  var str = this.editForm.endTime
      this.editForm.endTime = str.substring(0, str.length - 8) */
      /*    var strtime = this.editForm.beginTime
      this.editForm.beginTime = strtime.substring(0, str.length - 8) */

      var data = {
        id: this.editForm.id,
        title: this.editForm.title,
        people_limit: this.editForm.people_limit,
        rate: this.editForm.rate / 100,
        currency: this.editForm.currency,
        minAmount: this.editForm.minAmount,
        maxAmount: this.editForm.maxAmount,
        beginTime: this.editForm.beginTime + this.editForm.startTime,
        endTime: this.editForm.endTime + this.editForm.endTimes,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        active: this.editForm.active.toString(),
        days: this.editForm.days,
        type: this.editForm.type.toString(),
        mode: this.editForm.mode.toString()
      }
      await Lockupedit(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('格式不符，修改失敗')
        }
        this.getLockupList()
      })
    },
    // 新增鎖倉
    async addLockup () {
      this.addDialogVisible = false
      var data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        type: this.addForm.type.toString(),
        title: this.addForm.title,
        people_limit: this.addForm.people_limit,
        rate: this.addForm.rate / 100,
        currency: this.addForm.currency,
        minAmount: this.addForm.minAmount,
        maxAmount: this.addForm.maxAmount,
        beginTime: this.addForm.beginTime + this.addForm.starttime,
        endTime: this.addForm.endTime + this.addForm.endtimes,
        days: this.addForm.days,
        mode: this.addForm.mode.toString()
      }

      await addActivity(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('新增成功')
          this.$refs.addFormref.resetFields()
          this.addForm.minAmount = ''
          this.addForm.maxAmount = ''
          this.addForm.people_limit = ''
          this.addForm.beginTime = ''
          this.addForm.endTime = ''
          this.addForm.starttime = ''
          this.addForm.endTimes = ''
        } else {
          this.$message.error('格式不符，新增失敗')
        }
        this.getLockupList()
      })
    },
    async Search () {
      this.queryInfo.pagenum = 1
      this.getLockupList()
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    async clear () {
      this.searchlist = ''
      this.enable.value = ''
      this.queryInfo.date = ''
      this.getLockupList()
    },
    jump (index, row) {
      let queryData = {}
      queryData = row
      this.$router.push({ path: '/lockuplist', query: queryData })
    },
    tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color:#F2F2F2 ;color:#7B7B7B;font-size: 12px;'
      }
    }
  }
}
/* 數字千分位 */
</script>

<style>
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
</style>
