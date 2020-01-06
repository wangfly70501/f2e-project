<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', '手續費設置']"></TopBreadcrumb>

    <el-card>
      <!-- 搜索工具 -->
      <div>
      <el-input v-model="searchlist" @keyup.enter.native="Search" style="width:30%">
        <el-button type="primary" @click="Search" slot="append">搜尋</el-button>
      </el-input>
        <el-button type="primary" @click="addDialogVisible = true">新增手續費</el-button>
      </div>
      <!-- 手續費列表 -->
      <el-table :data="chargeList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="銀行" prop="bank_en"></el-table-column>
        <el-table-column label="手續費" prop="rate"></el-table-column>
        <el-table-column label="類別" prop="trans_type">
            <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.trans_type === 0">入金</el-tag>
            <el-tag type="success" v-else>出金</el-tag>
        </template>
</el-table-column>
        <el-table-column label="狀態">
          <!--    <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.status === 0">禁用</el-tag>
            <el-tag type="success" v-else>啟用</el-tag>
          </template>-->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#BEBEBE"
              :active-value="1"
              :inactive-value="0"
              @change.native="changeSwitch($event,scope.$index,scope.row)"
            ></el-switch>
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
    </el-card>

    <!-- 新增手續費 -->
    <el-dialog title="新增手續費" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="銀行" prop="addbank">
          <el-input v-model="addForm.addbank"></el-input>
        </el-form-item>
        <el-form-item label="手續費" prop="addCharge">
          <el-input v-model="addForm.addCharge"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCharge">確定</el-button>
      </span>
    </el-dialog>

    <!--修改手續費 -->
    <el-dialog
      title="修改手續費"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="銀行">
          <el-input v-model="editForm.bank_en" disabled></el-input>
        </el-form-item>
        <el-form-item label="手續費" prop="editcharge">
          <el-input v-model="editForm.rate"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { chargeData, createCharge, editchargedata, changeSw } from '../../api/index.js'

export default {
  data () {
    return {
      searchlist: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: '0'
      },
      chargeList: [],

      total: 0, // 总用户数

      addDialogVisible: false,
      addForm: {
        addbank: '',
        addCharge: ''
      },
      addFormRules: {
        addbank: [
          { required: true, message: '請輸入銀行', trigger: 'blur' },
          { min: 3, max: 10, message: '長度在 3 到 10 個字元', trigger: 'blur' }
        ],
        addCharge: [
          { required: true, message: '請輸入手續費', trigger: 'blur' },
          { min: 1, max: 10, message: '長度在 3 到 10 個字元', trigger: 'blur' }
        ]
      },

      editDialogVisible: false,
      table: {},
      editForm: {},
      editFormRules: {
        editcharge: [
          { required: true, message: '請輸入手續費', trigger: 'blur' },
          { min: 1, max: 10, message: '長度在 3 到 10 個字元', trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.getChargeList()
  },

  methods: {
    async changeSwitch (index, row) {
      console.log(row)
      let data = {
        mg_name: 'cccc',
        mg_pwd: '12345',
        status: this.scope.row.status
      }
      await changeSw(data).then(res => {
        if (res.error_code === 0) {
          console.log('1', res)
          console.log('2', res)
          this.$message.success('修改成功')
        } else {
          this.$message.error('格式不符，修改失敗')
        }
        this.getChargeList()
      })

      /* changesw(a).then(res => {
        if (res.error_code === 0) {
          console.log('1', res)
          console.log('2', res)
          this.$message.success('修改成功')
        } else {
          let newData = a
          newData.status = newData.status === 0 ? '1' : '0'
          this.chargeList[index] = newData
        }
      }) */
    },
    // 获取列表
    async getChargeList () {
      let data = {
        mg_name: 'cccc',
        mg_pwd: '12345',
        mg_state: 1,
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        searchValue: this.searchlist
      }
      await chargeData(data).then(res => {
        this.chargeList = res.data
        this.total = res.pagination.total_record
        console.log('res', res)
        console.log('res.data', res.data)
      })
    },

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getChargeList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getChargeList()
    },

    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },

    showEditDialog (index, row) {
      this.editForm = row
      this.editDialogVisible = true
    },

    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },

    async saveEdit () {
      this.editDialogVisible = false
      var data = {
        bank_en: this.editForm.bank_en,
        mg_name: 'cccc',
        mg_pwd: '12345',
        mg_state: 1,
        rate: this.editForm.rate
      }
      await editchargedata(data).then(res => {
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
    /*
         async deleteUserById (id) {
      const confirmResult = await this.$confirm(
        '此操作將永久删除, 是否繼續?',
        '提示信息',
        {
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('操作已取消')
      }

      const { data: res } = await this.$http.delete('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('删除失敗')
      }

      this.$message.success('删除成功')
      this.getChargeList()
    },  */

    async addCharge () {
      this.addDialogVisible = false
      var data = {
        bank_en: this.addForm.addbank,
        rate: this.addForm.addCharge,
        mg_name: 'cccc',
        mg_pwd: '12345',
        mg_state: 1
      }

      await createCharge(data).then(res => {
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
    },
    async Search () {
      console.log()
      this.queryInfo.pagenum = 1
      await this.getChargeList()
    }
  }
}
</script>

<style>
</style>
