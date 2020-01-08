<template>
  <div>
    <TopBreadcrumb :titles="['會員管理', '會員層級列表']"></TopBreadcrumb>

    <el-card>
      <SearchTool v-model="queryInfo.query" placeholder="暫不支持搜索">
      </SearchTool>

      <!-- 會員列表数据 -->
      <el-table :data="userlevelList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="會員層級" prop="level"></el-table-column>
        <el-table-column label="限額" prop="limitamt"></el-table-column>
        <el-table-column label="是否付款" prop="status">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.status =='1'">未開通</el-tag>
            <el-tag type="success" v-else>已開通</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.$index, scope.row)"
            >編輯</el-button>
            <!--     <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserById(scope.row.id)"
            ></el-button>-->
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
import { userlevelData, userlevelSet, adduserlevel } from '../../api/index.js'

export default {
  data () {
    return {

      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },

      total: 0,
      isDisabl: true,
      userlevelList: [],
      addressVisible: false

    }
  },

  created () {
    this.getUserlevelList()
  },

  methods: {
    async getUserlevelList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        searchValue: this.searchlist
      }
      await userlevelData(data).then(res => {
        this.userlevelList = res.data
        console.log(res.data)
        console.log(res)
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
    },
    showEditDialog (index, row) {
      this.editForm = row
      this.editDialogVisible = true
    },
    async saveEdit () {
      this.editDialogVisible = false
      var data = {
        bank_en: this.editForm.bank_en,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        rate: this.editForm.rate
      }
      await userlevelSet(data).then(res => {
        if (res.error_code === 0) {
          console.log('1', res)
          console.log('2', res)
          this.$message.success('修改成功')
        } else {
          this.$message.error('格式不符，修改失敗')
        }
        this.getChargeList()
      })
    },
    async adduserlevel () {
      this.addDialogVisible = false
      var data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        bank_en: this.addForm.addbank,
        rate: this.addForm.addCharge,
        txt_rate: '0'
      }

      await adduserlevel(data).then(res => {
        console.log('asdsad', data)
        console.log(typeof res.error_code)
        if (res.error_code === 0) {
          console.log('1', res)
          console.log('2', res)
          this.$message.success('新增成功')
        } else {
          this.$message.error('格式不符，新增失敗')
        }
        this.getChargeList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
