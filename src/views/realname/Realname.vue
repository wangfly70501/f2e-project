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
        <el-table-column label="UID" prop="uid"></el-table-column>
        <el-table-column label="郵箱" prop="mail"></el-table-column>
        <el-table-column label="手機號碼" prop="mobile"></el-table-column>
        <el-table-column label="提交審核時間" prop="time"></el-table-column>
        <el-table-column label="首次審核時間" prop="firsttime"></el-table-column>
        <el-table-column label="最近審核時間" prop="lasttime"></el-table-column>
        <el-table-column label="實名" prop="name"></el-table-column>
        <el-table-column label="狀態" prop="status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status ==='0' ">未審核</el-tag>
            <el-tag v-else>已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.$index, scope.row)"
            >編輯</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination></el-pagination>

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
export default {
  data () {
    return {
      queryInfo: {
        date: ''
      },
      nameList: [
        {
          uid: 10025,
          mail: 'ekko@btcbox.com.tw',
          mobile: '0900123123',
          time: '2020-01-08 11:26:31',
          firsttime: '-',
          lasttime: '-',
          name: 'ekko',
          status: '0'
        }
      ],
      editDialogVisible: false,
      editForm: {}
    }
  },
  methods: {
    showEditDialog (index, row) {
      this.editForm = row
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
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
