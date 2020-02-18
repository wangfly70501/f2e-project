<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', '銀行設置']"></TopBreadcrumb>

    <el-card>
      <!-- 搜索工具 -->
      <div  class="text">
      <el-input v-model="searchlist" @keyup.enter.native="Search" style="width:30%" placeholder="請輸入銀行">

      </el-input>&nbsp;
        <el-button type="primary" @click="addDialogVisible = true">新增銀行</el-button>
        <el-button type="primary" @click="Search" >搜尋</el-button>
      </div>
      <!-- 銀行列表 -->
      <el-table :data="bankList" stripe border>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="銀行代碼" prop="bankcode" ></el-table-column>
        <el-table-column label="銀行名稱" prop="bank_ch"></el-table-column>
        <el-table-column label="銀行名稱" prop="bank_en"></el-table-column>

        <el-table-column label="狀態">
              <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.status === 0">禁用</el-tag>
            <el-tag type="success" v-else>啟用</el-tag>
          </template>
 <!--          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#BEBEBE"
              :active-value="1"
              :inactive-value="0"
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

    <!-- 新增銀行 -->
    <el-dialog title="新增銀行" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="銀行代碼" prop="addbankcode">
          <el-input v-model="addForm.addbankcode"  placeholder="ex:809"></el-input>
        </el-form-item>
        <el-form-item label="中文名稱" prop="addbankch">
          <el-input v-model="addForm.addbankch"  placeholder="ex:凱基銀行"></el-input>
        </el-form-item>
                <el-form-item label="英文簡寫" prop="addbanken">
          <el-input v-model="addForm.addbanken"  placeholder="ex:KGI Bank"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBank">確定</el-button>
      </span>
    </el-dialog>

    <!--修改銀行設置 -->
    <el-dialog
      title="修改銀行設置"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" ref="editFormRef" label-width="100px">
        <el-form-item label="銀行中文名稱">
          <el-input v-model="editForm.bank_ch" ></el-input>
        </el-form-item>
     <el-form-item label="銀行英文名稱">
          <el-input v-model="editForm.bank_en" ></el-input>
        </el-form-item>
        <el-form-item label="銀行代碼">
          <el-input v-model="editForm.bankcode" ></el-input>
        </el-form-item>
           <el-form-item label="銀行狀態">
                        <el-select  v-model="editForm.status" placeholder="請選擇">
                            <el-option
                                v-for="(enableValue,index) in enable"
                                :key="index"
                                v-bind:label="enableValue.label"
                                v-bind:value="enableValue.value"
                            >{{enableValue.label}}</el-option>
                        </el-select>
        </el-form-item>
   <!--        <el-form-item label="狀態">
           <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#BEBEBE"
              :active-value="1"
              :inactive-value="0"

            ></el-switch>
        </el-form-item> -->
        </el-form >
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">確定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import { editbankData, bankdata, createBank } from '../../api/index.js'

export default {
  data () {
    return {
      searchlist: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: ''
      },
      bankList: [],

      total: 0, // 总用户数

      addDialogVisible: false,
      addForm: {
        addbankch: '',
        addbanken: '',
        addbankcode: ''
      },
      addFormRules: {
        addbanken: [
          { required: true, message: '請輸入銀行英文名稱', trigger: 'blur' },
          { min: 3, max: 12, message: '長度在 3 到 12 個字元', trigger: 'blur' }
        ],
        addbankcode: [
          { required: true, message: '請輸入銀行英文名稱', trigger: 'blur' },
          { min: 3, max: 10, message: '長度在 3 到 10 個字元', trigger: 'blur' }
        ],
        addbankch: [
          { required: true, message: '請輸入銀行中文名稱', trigger: 'blur' },
          { min: 3, max: 10, message: '長度在 3 到 10 個字元', trigger: 'blur' }
        ]
      },

      editDialogVisible: false,
      table: {},
      editForm: {},
      /*       editFormRules: {
        editcharge: [
          { required: true, message: '請輸入手續費', trigger: 'blur' },
          { min: 1, max: 10, message: '長度在 3 到 10 個字元', trigger: 'blur' }
        ]
      } */
      enable: [
        {
          label: '禁用',
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
    this.getbankList()
  },

  methods: {
    async changeSwitch (index, row) {
      let data = {
        bank_en: this.editForm.bank_en,
        bank_ch: this.editForm.bank_ch,
        bankcode: this.editForm.bankcode,
        status: this.scope.row.status,
        id: this.editForm.id
      }
      await editbankData(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('格式不符，修改失敗')
        }
        this.getbankList()
      })
    },
    // 获取列表
    async getbankList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        searchValue: this.searchlist
      }
      await bankdata(data).then(res => {
        this.bankList = res.data
        this.total = res.pagination.total_record
      })
    },

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getbankList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getbankList()
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
        bank_ch: this.editForm.bank_ch,
        bankcode: this.editForm.bankcode,
        id: this.editForm.id,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        status: this.editForm.status.toString()
      }
      await editbankData(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('格式不符，修改失敗')
        }
        this.getbankList()
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

    async addBank () {
      this.addDialogVisible = false
      var data = {
        bank_en: this.addForm.addbanken,
        bank_ch: this.addForm.addbankch,
        bankcode: this.addForm.addbankcode,
        status: 1,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')
      }

      await createBank(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('新增成功')
        } else {
          this.$message.error('格式不符，新增失敗')
        }
        this.getbankList()
      })
    },
    async Search () {
      this.queryInfo.pagenum = 1
      await this.getbankList()
    }
  }
}
</script>

<style>

</style>
