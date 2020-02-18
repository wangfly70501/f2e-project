<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', '手續費設置']"></TopBreadcrumb>

    <el-card>
      <!-- 搜索工具 -->
      <div style="vertical-align: middle">
        <el-input v-model="searchlist" @keyup.enter.native="Search" style="width:30%" placeholder="請輸入銀行">
        </el-input>
        <el-button type="primary" @click="addDialogVisible = true">新增手續費</el-button>
        <el-button type="primary" @click="Search" >搜尋</el-button>
      </div>
      <!-- 手續費列表 -->
      <el-table :data="chargeList" stripe border>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="銀行" prop="bank_en"></el-table-column>
        <el-table-column label="交易手續費" prop="rate"></el-table-column>
        <el-table-column label="轉帳手續費" prop="txt_rate"></el-table-column>
        <el-table-column label="類別" prop="trans_type">
          <template slot-scope="scope">
            <span v-if="scope.row.trans_type === 0">入金</span>
            <span v-else>出金</span>
          </template>
        </el-table-column>
        <el-table-column label="狀態" >
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.status === 0">停用</el-tag>
            <el-tag type="success" v-else>啟用</el-tag>
          </template>
<!--           <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#BEBEBE"
              :active-value="1"
              :inactive-value="0"
              active-text="啟用"
              inactive-text="停用"

              @change="changeSwitch(scope.$index,scope.row)"
            ></el-switch>
          </template> -->
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
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="選擇銀行">
          <!--  <el-input v-model="addForm.addbank"></el-input> -->
          <el-select v-model="addForm.addbank" placeholder="請選擇">
            <el-option
              v-for="item in bankList"
              :key="item.id"
              :label="item.bank_ch+item.bank_en"
              :value="item.bank_en"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易手續費" prop="addCharge">
          <el-input v-model="addForm.addCharge"></el-input>
        </el-form-item>
              <el-form-item label="轉帳手續費" prop="addCharge">
          <el-input v-model="addForm.addtxtrate"></el-input>
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
      <el-form :model="editForm" ref="editFormRef" label-width="100px">
        <el-form-item label="銀行">
          <el-input v-model="editForm.bank_en" disabled></el-input>
        </el-form-item>
        <el-form-item label="交易手續費" >
          <el-input v-model="editForm.rate"></el-input>
        </el-form-item>
          <el-form-item label="轉帳手續費" >
          <el-input v-model="editForm.txt_rate"></el-input>
        </el-form-item>
          <el-form-item label="類別">
                        <el-select  v-model="editForm.trans_type" placeholder="請選擇" value-key="id">
                            <el-option
                                v-for="(enableValue) in enable"
                                :key="enableValue.value"
                                :label="enableValue.label"
                                :value="enableValue.value"
                            >{{enableValue.label}}</el-option>
                        </el-select>
        </el-form-item>
             <el-form-item label="狀態">
                         <el-select  v-model="editForm.status" placeholder="請選擇">
                             <el-option
                                v-for="(statuslistValue,index) in statuslist"
                                :key="index"
                                :label="statuslistValue.label"
                                :value="statuslistValue.value"
                            >{{statuslistValue.label}}</el-option>

                        </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit()">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  chargeData,
  createCharge,
  editchargedata,

  chargebankList
} from '../../api/index.js'

export default {
  data () {
    return {
      query: {},
      searchlist: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: ''
      },
      chargeList: [],
      bankList: [],
      total: 0,

      addDialogVisible: false,
      addForm: {
        addbank: '',
        addCharge: '',
        addtxtrate: ''
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
      editForm: {

      },
      enable: [
        {
          label: '入金',
          value: 0
        },
        {
          label: '出金',
          value: 1
        }

      ],
      statuslist: [
        {
          label: '停用',
          value: 0
        },
        {
          label: '啟用',
          value: 1
        }

      ]
    }
  },

  created () {
    this.getChargeList()
    this.getBankList()
  },

  methods: {

    // 獲取銀行列表
    async getBankList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')
      }
      await chargebankList(data).then(res => {
        this.bankList = res.data
      })
    },

    // 獲取手續列表
    async getChargeList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        searchValue: this.searchlist
      }

      await chargeData(data).then(res => {
        this.chargeList = res.data
        this.total = res.pagination.total_record
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
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        bank_en: this.editForm.bank_en,
        rate: this.editForm.rate,
        txt_rate: this.editForm.txt_rate,
        trans_type: this.editForm.trans_type.toString(),
        status: this.editForm.status.toString(),
        id: this.editForm.id
      }
      await editchargedata(data).then(res => {
        if (res.error_code === 0) {
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
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        bank_en: this.addForm.addbank,
        rate: this.addForm.addCharge,
        txt_rate: this.addForm.addtxtrate
      }

      await createCharge(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('新增成功')
        } else {
          this.$message.error('此銀行新增過了，請使用編輯修改')
        }
        this.getChargeList()
      })
    },
    async Search () {
      this.queryInfo.pagenum = 1
      await this.getChargeList()
    }
  }
}
</script>

<style>
</style>
