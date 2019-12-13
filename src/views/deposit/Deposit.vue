<template>
<div>
<TopBreadcrumb :titles="['出入金管理', '出入金列表']"></TopBreadcrumb>

<el-card>
<SearchTool v-model="queryInfo.query" placeholder="暫不支持搜尋">
</SearchTool>

<!-- 列表数据 -->
<el-table :data="orderList" border stripe>
<el-table-column type="index"></el-table-column>
<el-table-column label="姓名" prop="username"></el-table-column>

 <!--<template slot-scope="scope">
<el-tag type="danger" v-if="scope.row.status === 3">未綁定</el-tag>
<el-tag type="success" v-else>已綁定</el-tag>
</template>
-->

<el-table-column label="身分證" prop="identityid"></el-table-column>
<el-table-column label="銀行帳號" prop="bankcard_uuid"></el-table-column>

<el-table-column label="幣種" prop="currency"></el-table-column>
<el-table-column label="交易前" prop="quota_before"></el-table-column>
<el-table-column label="交易後" prop="quota_after"></el-table-column>

<el-table-column label="手續費" prop="cost"></el-table-column>
<el-table-column label="金額" prop="amount"></el-table-column>
<el-table-column label="總資產" prop="uamount"></el-table-column>
<el-table-column label="入金" prop="status">
 <template slot-scope="scope">
<el-tag  type="danger" v-if="scope.row.status ===0 ">未</el-tag>
 <el-tag type="success" v-else>已</el-tag>
</template>
</el-table-column>
<el-table-column label="入金" prop="status"></el-table-column>
<el-table-column label="出金" prop="mode"></el-table-column>
<el-table-column label="交易日期" prop="txdate">
</el-table-column>
<el-table-column label="操作">
<template>
<el-button size="mini" type="primary" icon="el-icon-edit"
@click="addressVisible = true" :disabled="isDisabl"></el-button>
<el-button size="mini" type="success" icon="el-icon-location"
 :disabled="isDisabl"></el-button>
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
        pagesize: 20
      },
      orderList: [],
      total: 0,
      isDisabl: true,

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

      this.total = res.data.total
      console.log(res.data)
      this.orderList = res.data
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
