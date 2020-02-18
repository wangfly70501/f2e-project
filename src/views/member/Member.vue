<template>
  <div>
    <TopBreadcrumb :titles="['會員管理', '會員列表']"></TopBreadcrumb>

    <el-card>
   <!--    <SearchTool v-model="queryInfo.query" placeholder="暫不支持搜索">
      </SearchTool> -->

      <!-- 會員列表数据 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="會員姓名" prop="username"></el-table-column>
        <el-table-column label="會員層級" prop="level"></el-table-column>
        <el-table-column label="身分證字號" prop="identityid"></el-table-column>
        <el-table-column label="會員帳號" prop="account"></el-table-column>
 <el-table-column label="金錢" prop="amount"></el-table-column>

        <el-table-column label="啟用狀態" prop="status">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.status =='0'">未啟用</el-tag>
            <el-tag type="success" v-else>已啟用</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="登入時間" prop="lg_in_time">
          <template slot-scope="scope">
            {{scope.row.lg_in_time | dateFormat}}
          </template>
        </el-table-column>
             <el-table-column label="登出時間" prop="lg_out_time">
          <template slot-scope="scope">
            {{scope.row.lg_out_time | dateFormat}}
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
import { userData } from '../../api/index.js'

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
      userList: {},

      addressVisible: false

    }
  },

  created () {
    this.getUserList()
  },

  methods: {
    async getUserList () {
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

        this.total = res.pagination.total_record
      })
    },
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
