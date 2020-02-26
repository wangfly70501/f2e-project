<template>

    <el-card>
      <!-- 會員列表数据 -->
      <el-table :data="userList" >

        <el-table-column label="操作類型" prop="status">
          <template slot-scope="scope">
            <div  v-if="scope.row.status =='1'"><span >帳號管理</span></div>

          </template>
        </el-table-column>

        <el-table-column label="操作內容" prop="active" sortable>
          <template slot-scope="scope">
            <div  v-if="scope.row.active =='0'"><span >禁用帳號</span></div>
            <div   v-else><span>啟用帳號</span></div>
          </template>
        </el-table-column>
        <el-table-column label="時間" prop="time"  sortable>
          <template slot-scope="scope">
            {{scope.row.time | dateFormat}}
          </template>
        </el-table-column>
             <el-table-column label="操作者" prop="user" sortable>

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
/* import { userData } from '../../api/index.js' */

export default {
  data () {
    return {

      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      isDisabl: true,
      userList: [{
        status: 1,
        active: 1,
        content: '10000000',
        time: '2020-02-19 11:03',
        user: 'user14',
        admin: 'cccc',
        bankacount: '',
        bank: '國泰世華'
      },
      {
        status: 1,
        active: 0,
        content: '10000000',
        time: '2020-02-19 11:03',
        user: 'user14',
        admin: 'cccc',
        bankacount: '',
        bank: '國泰世華'
      }
      ],

      addressVisible: false

    }
  },

  created () {
    /* this.getUserList() */
  },

  methods: {
    /*     async getUserList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        searchValue: this.searchlist
      }
      await userData(data).then(res => {
        this.userList = res.data
        console.log('1323', this.userList)
        this.total = res.pagination.total_record
      })
    }, */
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    }

  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
