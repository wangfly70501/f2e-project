<template>
  <div>
    <TopBreadcrumb :titles="['實名認證', '實名認證']"></TopBreadcrumb>

    <el-card>
      <p class="text">認證狀態:</p>
      <el-select
        style="width:8%"
      ></el-select>&nbsp;
      <el-input
        @keyup.enter.native="search"
        style="width:15%"
      ></el-input>&nbsp;
      <el-select
        style="width:8%"
      ></el-select>
      <p class="text">提交時間:</p>
      <el-date-picker
        type="daterange"
        start-placeholder="StartTime"
        end-placeholder="EndTime"
        v-model="queryInfo.date"
        value-format="yyyy-MM-dd"
        style="width:30%"
      ></el-date-picker>&nbsp;
      <el-button type="primary" @click="search()">搜尋</el-button>

      <el-table :data="nameList" stripe border>
        <el-table-column label="UID" prop="uuid"></el-table-column>
        <el-table-column label="使用者姓名" prop="username"></el-table-column>
         <el-table-column label="手機號碼" prop="mobile"></el-table-column>
        <el-table-column label="信箱" prop="email"></el-table-column>
        <el-table-column label="提交時間" prop="ctime"></el-table-column>

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

      <!-- 分页组件 -->

      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <el-dialog
        title="基本信息"
        :visible.sync="editDialogVisible"
        width="50%"
      >
        <el-form ref="editFormRef" label-width="155px">
          <el-form-item label="姓名">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="國家或地區">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="證件類型">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="證件號碼">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="身分證正面照片">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="身分證反面照片">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="手寫姓名和身分證照片">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input placeholder="如果審核不通過，請填寫打回理由，理由將透過實名認證頁面發送給客戶"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">打 回</el-button>
          <el-button type="primary">審核通過</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { KycList } from '../../api/index.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: '',
        date: []
      },
      total: 0,
      nameList: [],
      searchlist: '',
      editDialogVisible: false,
      editForm: {},
      enable: [
        {
          label: 'zh',
          value: 'zh'
        },
        {
          label: 'en',
          value: 'en'
        }
      ]
    }
  },
  created () {
    this.getnameList()
  },

  methods: {
    async getnameList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        searchValue: this.searchlist,
        kycStartTime: this.queryInfo.date[0],
        kycEndTime: this.queryInfo.date[1],
        searchUuid: ''
      }
      await KycList(data).then(res => {
        console.log(res)
        console.log(res.data)
        this.nameList = res.data
        this.total = res.pagination.total_record
      })
    },

    showEditDialog (index, row) {
      this.editForm = row
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getFaqList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getFaqList()
    }
  }
}
</script>

<style lang="less" scoped>
.text {
  display: inline-block;
  margin: 0 5px;
  font-size: 12px;
}
</style>
