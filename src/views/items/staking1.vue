<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', '定投管理']"></TopBreadcrumb>

    <el-card>

        <el-button type="primary" @click="addaclist" class="btn_right">建立定投</el-button>

      <!-- 列表 -->
      <el-table :data="stakinglist"    >
        <el-table-column label="ID" prop="id" width="50%"  align="center"></el-table-column>
        <el-table-column label="顯示"  align="center" width="100%">
            <template slot-scope="scope">
              <div v-if="scope.row.show_status===0" style="color:#AAAAAA"> <font-awesome-icon  icon="ban" size="lg" /> </div>
             <!--  <div v-else-if="scope.row.show_status===1" style="color:#79BB13"> <font-awesome-icon icon="check-circle" size="lg" /> </div> -->
              <div v-else style="color:#79BB13"> <font-awesome-icon icon="check-circle"  size="lg"/> </div>
          </template>
        </el-table-column>
            <el-table-column label="定投名稱"  align="center" width="100%" prop="staking_name">

        </el-table-column>
             <el-table-column label="from幣種"  align="center" width="100%" prop="from_currency">
         <template slot-scope="scope">
            <div
              v-for="item in currencyList"
              :key="item.id"
              :label="item.currency"
              :value="item.id"
            >
              <div v-if="item.id==scope.row.from_currency"   class="coinpadding">{{item.currency}}</div>
            </div>
          </template>
        </el-table-column>
          <el-table-column label="to幣種" >
                 <template slot-scope="scope">
            <div
              v-for="item in currencyList"
              :key="item.id"
              :label="item.currency"
              :value="item.id"
            >
              <div v-if="item.id==scope.row.to_currency"   class="coinpadding">{{item.currency}}</div>
            </div>
          </template>
          </el-table-column>
        <el-table-column label="定投日期"  style="background-color:#FFFFF1" >
          <template slot-scope="scope">
         <div>{{scope.row.cdate}}</div>
          </template>
        </el-table-column>

        <el-table-column label="成交手續費" prop="people_limit" width="100%">
          <template slot-scope="scope">
          {{scope.row.charge}} %
            </template>
        </el-table-column>
        <el-table-column label="代買手續費"  align="center">
          <template slot-scope="scope">
        {{scope.row.bcharge}} %
          </template>
        </el-table-column>
       <el-table-column label="躉繳優惠">
               <template slot-scope="scope">
           {{scope.row.discount}} %
              </template>
        </el-table-column>
      <el-table-column label="開放期限">
        <template slot-scope="scope">
         <div>{{scope.row.starttime}}</div>~
         <div>{{scope.row.endtime}}</div>
          </template>
        </el-table-column>
          <el-table-column label="人數上限">
            <template slot-scope="scope">
           {{scope.row.people_limit}} 人
              </template>
        </el-table-column>
          <el-table-column label="認購名單">
            <template slot-scope="scope">
               <el-button type="success"  plain size="mini" @click="showpassDialog(scope.$index,scope.row)">  {{scope.row.joinpeople}}</el-button>

              </template>
        </el-table-column>
          <el-table-column label="餘額不足">
            <template slot-scope="scope">
               <el-button type="success"  plain size="mini" @click="showpassDialog(scope.$index,scope.row)">   {{scope.row.balance}}</el-button>

              </template>
        </el-table-column>
             <el-table-column label="">
             <div class="el-icon-edit" @click="showEditDialog(scope.$index, scope.row)" style="font-size:18px;">
            </div>
        </el-table-column>
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
      stakinglist: [
        {
          id: 1,
          show_status: 1,
          staking_name: 'test',
          from_currency: '23',
          to_currency: '23',
          cdate: 123,
          charge: 0.1,
          bcharge: 0.1,
          discount: 5,
          starttime: '2020/04/10',
          endtime: '2020/04/20',
          people_limit: 1000,
          joinpeople: 37,
          balance: 6
        }
      ],
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
        console.log('456668', this.currencyList)
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
    /*   tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color:#F2F2F2 ;color:#7B7B7B;font-size: 12px;'
      }
    },
 */
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
