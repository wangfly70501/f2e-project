<template>

    <el-card>
      <!-- 會員列表数据 -->
      <el-table :data="limitup" >

        <el-table-column label="操作類型">
                調整提領上限
        </el-table-column>

        <el-table-column label="操作內容" >
          <template slot-scope="scope">
            <div  v-if="scope.row.level_temp =='3' || scope.row.level_temp =='4'|| scope.row.level_temp =='5'"><span>{{scope.row.limitday_temp | NumFormat}}TWD  (臨時)</span></div>
            <div   v-else><span >{{scope.row.limitday_normal | NumFormat}} TWD (永久)</span></div>
          </template>
        </el-table-column>
        <el-table-column label="時間" >
          <template slot-scope="scope">
            {{scope.row.ctime | dateFormat}}
          </template>
        </el-table-column>
             <el-table-column label="操作者" prop="cuser">

        </el-table-column>
        <el-table-column label="審核者" prop="verifier">

        </el-table-column>
             <el-table-column label="調整原因" prop="reason">
        </el-table-column>
          <el-table-column label="進度/說明" prop="status_temp">
              <template slot-scope="scope">
               <div v-if="scope.row.level_temp =='3' || scope.row.level_temp =='4'|| scope.row.level_temp =='5'">
                 <span v-if="scope.row.status_temp===0"><el-tag type="warning">審核中</el-tag></span>
                 <span v-else-if="scope.row.status_temp===1"><el-tag type="success">通過</el-tag> &nbsp;/{{scope.row.failReason}}</span>
                 <span v-else-if="scope.row.status_temp===2"><el-tag type="danger">不通過</el-tag> &nbsp;/{{scope.row.failReason}}</span>
                 </div>
               <div v-else>
                 <span v-if="scope.row.status_normal===1"><el-tag type="success">通過</el-tag></span>
                 <span v-else><el-tag type="danger">不通過</el-tag></span>
                </div>
              </template>
        </el-table-column>

      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

</template>

<script>
import { withdrawlimit } from '../../api/index.js'

export default {
  data () {
    return {

      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      limitup: [],
      total: 0,
      isDisabl: true,
      /*  userList: [{
        active: 1,
        content: '10000000',
        time: '2020-02-19 11:03',
        user: 'user14',
        admin: 'cccc',
        bankacount: '',
        bank: '國泰世華'
      },
      {
        active: 0,
        content: '10000000',
        time: '2020-02-19 11:03',
        user: 'user14',
        admin: 'cccc',
        bankacount: '',
        bank: '國泰世華'
      },
      {
        active: 1,
        content: '10000000',
        time: '2020-02-19 11:03',
        user: 'user14',
        admin: 'cccc',
        bankacount: '',
        bank: '國泰世華'
      },
      {
        active: 0,
        content: '10000000',
        time: '2020-02-19 11:03',
        user: 'user14',
        admin: 'cccc',
        bankacount: '',
        bank: '國泰世華'
      }

      ],
 */
      addressVisible: false

    }
  },

  created () {
    this.getlimitup()
    console.log('13234556', this.$route.query)
  },

  methods: {
    async getlimitup () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        uuid: this.$route.query.uuid,
        searchType: 2
      }
      await withdrawlimit(data).then(res => {
        this.limitup = res.data
        console.log('456', this.limitup)
        this.total = res.pagination.total_record
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getlimitup()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getlimitup()
    },
    resetDateFilter () {
      this.$refs.filterTable.clearFilter('date')
    },
    clearFilter () {
      this.$refs.filterTable.clearFilter()
    },
    filterTag (value, row) {
      return row.active === value
    },
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    }

  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
