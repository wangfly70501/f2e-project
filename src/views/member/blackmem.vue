<template>
  <div>
    <TopBreadcrumb :titles="['會員管理', '黑名單會員列表']"></TopBreadcrumb>

    <el-card>
      <SearchTool v-model="queryInfo.query" placeholder="暫不支持搜索">
      </SearchTool>

      <!-- 列表数据 -->
      <el-table :data="blackmemList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="會員姓名" prop="username"></el-table-column>
        <el-table-column label="會員層級" prop="level"></el-table-column>
        <el-table-column label="身分證字號" prop="identityid">
         <template slot-scope="scope">
            {{scope.row.identityid | phoneformat}}          </template>

        </el-table-column>
        <el-table-column label="會員帳號" prop="account"></el-table-column>
      <el-table-column label="狀態" prop="status">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.blacklist =='0'">禁用</el-tag>
            <el-tag type="success" v-else>啟用</el-tag>
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
import { blackmemData } from '../../api/index.js'

export default {
  data () {
    return {

      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      blackmemList: [],
      total: 0,
      isDisabl: true,
      addressVisible: false

    }
  },

  created () {
    this.getblackusrList()
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
    async getblackusrList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        searchValue: this.searchlist
      }
      await blackmemData(data).then(res => {
        this.blackmemList = res.data

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
