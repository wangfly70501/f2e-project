<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', '活動管理']"></TopBreadcrumb>

    <el-card>
      <!-- 搜索工具 -->
          <el-select v-model="showValue" placeholder="前台顯示" style="width:10% ">
          <el-option
            v-for="(showValue,index) in showstatus"
            :key="index"
            v-bind:label="showValue.label"
            v-bind:value="showValue.value"
          >{{showValue.label}}</el-option>
        </el-select>&nbsp;
        <el-input
          v-model="searchlist"
          @keyup.enter.native="Search"
          style="width:10%"
          placeholder="請輸入標題"
        ></el-input>&nbsp;
    <!--     <el-date-picker
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
        </el-select>&nbsp; -->
        <el-button type="info" @click="clear" >清除</el-button>
        <el-button type="primary" @click="Search">搜尋</el-button>
        <el-button type="primary" @click="addaclist" class="btn_right">建立活動</el-button>

      <!-- 列表 -->
      <el-table :data="activitylist"  @selection-change="handleSelectionChange"  :header-cell-style="tableHeaderColor"   :cell-style="cellStyle">
        <el-table-column label="排序" prop="id" width="50%"  align="center"></el-table-column>
        <el-table-column label="前台顯示"  align="center" width="100%">
            <template slot-scope="scope">
              <div v-if="scope.row.show_status===0" style="color:#AAAAAA"> <font-awesome-icon  icon="ban" size="lg" /> </div>
             <!--  <div v-else-if="scope.row.show_status===1" style="color:#79BB13"> <font-awesome-icon icon="check-circle" size="lg" /> </div> -->
              <div v-else style="color:#79BB13"> <font-awesome-icon icon="check-circle"  size="lg"/> </div>
          </template>
        </el-table-column>
             <el-table-column label="類型"  align="center" width="100%">
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
          <el-table-column label="活動名稱" width="400%">
              <template slot-scope="scope" >
             <router-link :to="{path:'/activitylist', query: scope.row}" >{{scope.row.activity_name_GR}}</router-link>
              </template>
          </el-table-column>
        <el-table-column label="開放期間"  style="background-color:#FFFFF1" >
          <template slot-scope="scope">
         <div>{{scope.row.starttime|datefformat}}</div>
         <div>{{scope.row.endtime|datefformat}}</div>
          </template>
        </el-table-column>

        <el-table-column label="名額" prop="people_limit" width="100%">
          <template slot-scope="scope">
           <span v-if="scope.row.people_limit===0"> 99999</span>
           <span v-else> {{scope.row.people_limit}} 人</span>
            </template>
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
        <el-table-column label="上限(次)" prop="bonus_limit" align="center"  width="80%">
          <template slot-scope="scope" >
         <span  v-if="scope.row.bonus_limit=='0'"> 0</span>
         <span  v-else-if="scope.row.bonus_amount=='0'"> 0</span>
         <span  v-else> {{scope.row.bonus_limit/scope.row.bonus_amount}}</span>
            </template>
            </el-table-column>
       <el-table-column label="已參加人數" align="center">
         <template slot-scope="scope">
         <span v-if="scope.row.status === 0"><el-button type="info" size="mini" plain  @click="jump(scope.$index, scope.row)">{{scope.row.people_count}}</el-button></span>
         <span v-else-if="scope.row.status === 1"><el-button type="success" size="mini" plain  @click="jump(scope.$index, scope.row)">{{scope.row.people_count}}</el-button></span>
         <span v-else><el-button type="danger" size="mini" plain  @click="jump(scope.$index, scope.row)">{{scope.row.people_count}}</el-button></span>
         </template>
       </el-table-column>
        <el-table-column label="進展" width="80%" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 0 " style="color:gray">尚未開始</div>
            <div v-else-if="scope.row.status === 1 || scope.row.status === 3" style="color:#79BB13">進行中</div>
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
        :page-sizes="[ 10,20,50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

  </div>
</template>

<script>
import {
  currencyList,
  info_task,
  info_behavior
} from '../../api/index.js'

export default {
  data () {
    return {
      showValue: '2',
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
      activitylist: [ ],
      actypelist: [],
      total: 0,
      addDialogVisible: false,
      addForm: {},
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
        show_status: this.showValue.toString(),
        search_name: this.searchlist
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
