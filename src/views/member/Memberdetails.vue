<template>

    <el-card>
   <!--    <SearchTool v-model="queryInfo.query" placeholder="暫不支持搜索">
      </SearchTool> -->

      <!-- 會員列表数据 -->

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
        uuid: '10080',
        username: '測試資料',
        identityid: 'b123456789',
        mobile: '0911111111',
        level: 1,
        amount: 10000000,
        lg_in_time: '2020-02-19 11:03',
        lg_out_time: '2020-02-19 11:03',
        email: 'wang777@gmail.com',
        bankacount: '111111111111',
        bank: '國泰世華',
        銀行戶名: '測試資料'
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
