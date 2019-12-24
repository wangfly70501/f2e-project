<template>
<div>
<TopBreadcrumb :titles="['出入金管理', '出入金列表']"></TopBreadcrumb>

<el-card>
<SearchTool v-model="queryInfo.query" placeholder="暫不支持搜尋" >
</SearchTool>

<!-- 列表数据 -->
<el-table :data="orderList" border stripe :default-sort="{prop: 'id', order: 'descending'}">
<el-table-column label="id" prop="id" sortable :sort-orders="['ascending', 'descending']" width="80px"></el-table-column>
<el-table-column label="姓名" prop="username"></el-table-column>
<el-table-column label="身分證" prop="identityid"></el-table-column>
<el-table-column label="銀行帳號" prop="bankcard_uuid"></el-table-column>
<el-table-column label="幣種" prop="currency"></el-table-column>
<el-table-column label="交易前" prop="quota_before"></el-table-column>
<el-table-column label="交易後" prop="quota_after"></el-table-column>
<el-table-column label="手續費" prop="cost"></el-table-column>
<el-table-column label="總資產" prop="amount"></el-table-column>
<el-table-column label="類別" prop="status">
 <template slot-scope="scope">
<el-tag  type="success" v-if="scope.row.status !==0 ">入金</el-tag>
 <el-tag type="danger" v-else>出金</el-tag>
</template>
</el-table-column>
<el-table-column label="狀態" prop="status">
   <template slot-scope="scope">
<el-tag   v-if="scope.row.status ==='0' ">未申請</el-tag>
<el-tag  v-else>已完成</el-tag>
</template>
</el-table-column>
<el-table-column label="交易日期" prop="txdate">
   <template slot-scope="scope">
  {{scope.row.txdate| dateFormat}}
  </template>
</el-table-column>
<!-- <el-table-column label="操作">
<template>
<el-button size="mini" type="primary" icon="el-icon-edit"
@click="addressVisible = true" :disabled="isDisabl"></el-button>
<el-button size="mini" type="success" icon="el-icon-location"
 :disabled="isDisabl"></el-button>
</template>
</el-table-column> -->
</el-table>

<!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-count="6"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
</el-pagination>
</el-card>

</div>
</template>

<script>
import cityData from '../../plugins/citydata.js'

export default {
  data () {
    return {
      cityData: cityData,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      addressVisible: false,
      addressForm: {
        city: [],
        addressDetail: ''
      },

      progressVisible: false,
      progressInfo: []
    }
  },

  created () {
    this.getOrderList()
    console.log('123', this.orderList)
  },

  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('amount', {
        params: this.queryInfo
      })
      console.log('res.meta.status', res.meta.status)
      if (res.meta.status !== 200) {
        return this.$message.error('獲取列表失败')
      }
      console.log('123', res)
      console.log('res.data', res.data)
      this.total = res.data.length
      console.log('total111', this.total)
      /* this.orderList = res.data */

      /* Object.keys(res.data).map(k => res.data[k].status === 3 && delete res.data[k]) */
      this.orderList = res.data.slice(this.total / this.queryInfo.pagesize * this.pagenum, 10)
      console.log('res.data.length', res)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    }

  }
}
</script>

<style lang="less" scoped>
.el-cascader {
width: 100%;
}
</style>
