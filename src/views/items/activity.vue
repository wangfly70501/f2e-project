<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', '活動管理']"></TopBreadcrumb>

    <el-card>
      <!-- 搜索工具 -->

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
        <el-button type="primary" @click="addaclist" class="btn_right">建立活動</el-button>

      <!-- 列表 -->
      <el-table :data="activitylist"  @selection-change="handleSelectionChange"  :header-cell-style="tableHeaderColor"   :cell-style="cellStyle">
        <el-table-column label="排序" prop="id" width="50%"  align="center"></el-table-column>
        <el-table-column label="上架" width="50%" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.active===0" style="color:#AAAAAA"> <font-awesome-icon  icon="ban" size="lg" /> </div>
              <div v-else-if="scope.row.active===1" style="color:#79BB13"> <font-awesome-icon icon="check-circle" size="lg" /> </div>
              <div v-else style="color:#79BB13"> <font-awesome-icon icon="check-circle" /> </div>
          </template>
        </el-table-column>
             <el-table-column label="類型" width="80%" align="center">
                    <template slot-scope="scope">
            <div
              v-for="item in actypelist"
              :key="item.BehaviorType"
              :label="item.BehaviorName"
              :value="item.BehaviorType"
            >
              <div v-if="item.BehaviorType==scope.row.type">{{item.BehaviorName}}</div>
            </div>
          </template>
        </el-table-column>
          <el-table-column label="活動名稱" >
              <template slot-scope="scope">
             <router-link :to="{path:'/activitylist', query: scope.row}" >{{scope.row.activity_name_CN}}</router-link>
              </template>
          </el-table-column>
        <el-table-column label="開放期間"  style="background-color:#FFFFF1" >
          <template slot-scope="scope">
         <p>{{scope.row.starttime|datefformat}}</p>
         <p>{{scope.row.endtime|datefformat}}</p>
          </template>
        </el-table-column>

        <el-table-column label="名額" prop="people_limit">
          <template slot-scope="scope">{{scope.row.people_limit }} 人</template>
        </el-table-column>
        <el-table-column label="獎勵金額"  align="center">
          <template slot-scope="scope">
            <div
              v-for="item in currencyList"
              :key="item.id"
              :label="item.currency"
              :value="item.id"

            >
              <div v-if="item.id==scope.row.bonus_currency"   class="coinpadding">{{scope.row.bonus_amount}}&nbsp;{{item.currency}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="上限(次)" prop="bonus_limit" align="center" ></el-table-column>

       <el-table-column label="已參加人數" align="center">
         <template slot-scope="scope">
         <span v-if="scope.row.status === 0"><el-tag type="info">{{scope.row.people_count}}</el-tag></span>
         <span v-else-if="scope.row.status === 1"><el-tag type="success">{{scope.row.people_count}}</el-tag></span>
         <span v-else><el-tag type="danger">{{scope.row.people_count}}</el-tag></span>
         </template>
       </el-table-column>
        <el-table-column label="進展" width="80%" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0" style="color:gray">尚未開始</div>
            <div v-else-if="scope.row.status === 1" style="color:#79BB13">進行中</div>
            <div v-else style="color:red">已結束</div>
          </template>
        </el-table-column>
     <!--        <el-table-column label="實際結束時間" >
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0" ></div>
            <div v-else-if="scope.row.status === 1" ></div>
            <div v-else style="color:red">{{scope.row.endTime}}</div>
          </template>
        </el-table-column> -->

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

  </div>
</template>

<script>
import {
  addActivity,
  Lockupedit,
  currencyList,
  info_task,
  info_behavior
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
      activitylist: [ ],
      actypelist: [],

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
        lang: [{ required: true, trigger: 'blur' }],
        type: [{ required: true, trigger: 'blur' }]
      },

      editDialogVisible: false,
      table: {},
      editForm: {
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
    }

  },

  created () {
    this.getactivitylist()
    this.getCurrencyList()
    this.getactypelist()
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
    async getactypelist () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')
      }
      await info_behavior(data).then(res => {
        this.actypelist = res.data
        console.log('123', this.actypelist)
      })
    },

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
    async getactivitylist () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        active: '2'
      }

      await info_task(data).then(res => {
        this.activitylist = res.data
        this.total = res.pagination.total_record
        console.log('activitylist', this.activitylist)
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
      console.log(typeof this.editForm.beginTime)
      console.log('123456', this.editForm.beginTime)
      console.log('789456', this.startTime)

      this.startTime = this.editForm.beginTime.substr(11, 5)
      this.lastTime = this.editForm.endTime.substr(11, 5)
      console.log(typeof this.startTime)
      /* this.editForm.sTime = this.editForm.beginTime.substr(0, 10) */

      console.log('1234', this.editForm.startTime)
      console.log('4567', this.editForm.sTime)
      /*  var xxx = this.editForm.endTime
      this.editForm.endTimes = xxx.substr(11, 5)
      console.log('565', this.editForm) */
      console.log(this.editForm)
    },

    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
      this.getLockupList()
    },

    async saveEdit () {
      this.editDialogVisible = false
      var ddd = this.editForm.type
      this.editForm.type = Number(ddd)
      var strtime = this.editForm.beginTime
      this.editForm.beginTime = strtime.substring(0, 11)
      var lsttime = this.editForm.beginTime
      this.editForm.beginTime = lsttime.substring(0, 11)
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
        beginTime: this.editForm.beginTime + this.startTime,
        endTime: this.editForm.endTime + this.lastTime,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        active: this.editForm.active.toString(),
        days: this.editForm.days,
        type: this.editForm.type.toString(),
        mode: this.editForm.mode.toString()
      }
      console.log('data', data)
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
    },
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 9 || columnIndex === 8 || columnIndex === 10) { // 指定坐标rowIndex ：行，columnIndex ：列
        return 'background:#FFFFF1' // rgb(105,0,7)
      } else {
        return ''
      }
    },
    addaclist () {
      this.$router.push('/addaclist')
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
.coinpadding{
  margin: 10px;
}

</style>
