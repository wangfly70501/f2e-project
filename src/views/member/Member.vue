<template>
  <div>
    <TopBreadcrumb :titles="['會員管理', '會員列表']"></TopBreadcrumb>

    <el-card>
      <SearchTool v-model="queryInfo.query" placeholder="暫不支持搜索">
      </SearchTool>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="會員姓名" prop="username"></el-table-column>
        <el-table-column label="身分證字號" prop="identityid"></el-table-column>
        <el-table-column label="會員帳號" prop="account"></el-table-column>
 <el-table-column label="信箱" prop="email"></el-table-column>
 <el-table-column label="國別" prop="country"></el-table-column>
 <el-table-column label="銀行帳號" prop="bankcard_uuid"></el-table-column>
 <el-table-column label="金錢" prop="amount"></el-table-column>

        <el-table-column label="是否付款" prop="status">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '1'">未開通</el-tag>
            <el-tag type="success" v-else>已開通</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="註冊時間" prop="ctime">
          <template slot-scope="scope">
            {{scope.row.ctime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit"
          :disabled="isDisabl"></el-button>
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
      const { data: res } = await this.$http.get('mem', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('獲取列表失败')
      }

      this.total = res.data.total

      Object.keys(res.data.goods).map(k => res.data.goods[k].status === 3 && delete res.data.goods[k])

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
