<template>
<div>
<TopBreadcrumb :titles="['會員管理', '銀行帳號綁定']"></TopBreadcrumb>

<el-card>
<SearchTool v-model="queryInfo.query" placeholder="暫不支持搜尋">
</SearchTool>

<!-- 列表数据 -->
<el-table :data="orderList" border stripe>
<el-table-column type="index"></el-table-column>
<el-table-column label="身分證" prop="identityid"></el-table-column>
<el-table-column label="銀行綁定卡號" prop="bankcard_uuid"></el-table-column>
<el-table-column label="是否綁定" prop="status">
<template slot-scope="scope">
<el-tag type="danger" v-if="scope.row.status === 3">未綁定</el-tag>
<el-tag type="success" v-else>已綁定</el-tag>
</template>
</el-table-column>
<el-table-column label="銀行名稱" prop="bank_ch"></el-table-column>
<el-table-column label="綁定時間" prop="bank_ctime">
<template slot-scope="scope">
{{scope.row.bank_ctime | dateFormat}}
</template>
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

export default {
  data () {
    return {

      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 11
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
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('獲取列表失败')
      }

      this.total = res.data.total

      Object.keys(res.data.goods).map(k => res.data.goods[k].status === 5 && delete res.data.goods[k])

      this.orderList = res.data.goods
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
