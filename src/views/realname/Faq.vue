<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', 'Faq']"></TopBreadcrumb>

    <el-card>
      <!-- 搜索工具 -->
      <div class="text">
        <el-input v-model="searchlist" @keyup.enter.native="Search" style="width:10%"></el-input>&nbsp;
        <el-date-picker
          type="daterange"
          start-placeholder="StartTime"
          end-placeholder="EndTime"
          v-model="queryInfo.date"
          value-format="yyyy-MM-dd"
          style="width:30% "
        ></el-date-picker>&nbsp;

        <el-button type="primary" @click="Search">搜尋</el-button>
        <el-button type="primary" @click="addDialogVisible = true">新增</el-button>
         <el-button type="danger" @click="delDialogVisible = true">刪除</el-button>
      </div>
      <!-- 列表 -->
      <el-table :data="bankList" stripe border @selection-change="handleSelectionChange">
        <el-table-column
      type="selection"
      width="40px">
    </el-table-column>
        <el-table-column label="ID" prop="id" width="40px"></el-table-column>
        <el-table-column label="標題" prop ></el-table-column>
        <el-table-column label="分類" prop></el-table-column>
        <el-table-column label="發布者" prop></el-table-column>
        <el-table-column label="發布時間" prop></el-table-column>
        <el-table-column label="發布時間" prop></el-table-column>

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

    <!-- 新增 -->
    <el-dialog title="新增" :visible.sync="addDialogVisible" width="80%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="標題" prop="addbankcode">
          <el-input v-model="addForm.addbankcode"></el-input>
        </el-form-item>
        <el-form-item label="分類" prop="addbankch">
          <el-input v-model="addForm.addbankch"></el-input>
        </el-form-item>
        <el-form-item label="英文簡寫" prop="addbanken">
          <el-input v-model="addForm.addbanken"></el-input>
        </el-form-item>

        <el-form-item>
          <mavon-editor
            v-model="addForm.txt"
            ref="md"
            @imgAdd="$imgAdd"
            @change="change"
            style="min-height: 400px"
          />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFaq">確定</el-button>
      </span>
    </el-dialog>

    <!--修改設置 -->
    <el-dialog
      title="修改銀行設置"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" ref="editFormRef" label-width="100px">
        <el-form-item label="銀行中文名稱">
          <el-input v-model="editForm.bank_ch"></el-input>
        </el-form-item>
        <el-form-item label="銀行英文名稱">
          <el-input v-model="editForm.bank_en"></el-input>
        </el-form-item>
        <el-form-item label="銀行代碼">
          <el-input v-model="editForm.bankcode"></el-input>
        </el-form-item>

        <el-form-item label="內容">
          <mavon-editor
            v-model="editForm.txt"
            ref="md"
            @imgAdd="$imgAdd"
            @change="change"
            style="min-height: 400px"
          />
        </el-form-item>
        <!--        <el-form-item label="狀態">
           <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#BEBEBE"
              :active-value="1"
              :inactive-value="0"

            ></el-switch>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">確定</el-button>
      </span>
    </el-dialog>

          <!-- 刪除 -->
    <el-dialog  :visible.sync="delDialogVisible" width="30%" >
          <span>確定要刪除？刪除後資料無法復原</span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer" >
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Delete">確定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { editbankData, bankdata, createBank } from '../../api/index.js'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import moment from 'moment'
export default {
  data () {
    return {
      content: '',
      html: '',
      configs: {},
      searchlist: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: '',
        date: []
      },
      date: [],
      bankList: [],

      total: 0, // 总用户数
      delDialogVisible: false,
      addDialogVisible: false,
      addForm: {},
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
      ],
      nowTime: moment(new Date()).format('YYYY-MM-DD'),
      nowTimeSubTract: moment(new Date())
        .subtract(7, 'days')
        .format('YYYY-MM-DD')
    }
  },
  components: {
    mavonEditor
  },
  created () {
    this.getFaqList()
  },

  methods: {
    $imgAdd (pos, $file) {
      var formdata = new FormData()
      formdata.append('file', $file)
      // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
      this.$axios({
        url: '/common/upload',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(url => {
        this.$refs.md.$img2Url(pos, url)
      })
    },
    change (value, render) {
      // render 为 markdown 解析后的结果
      this.html = render
    },

    // 获取列表
    async getFaqList () {
      this.queryInfo.date[1] = this.nowTime
      this.queryInfo.date[0] = this.nowTimeSubTract
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        searchValue: this.searchlist,
        starttime: this.queryInfo.date[0],
        endtime: this.queryInfo.date[1]
      }
      await bankdata(data).then(res => {
        this.bankList = res.data
        this.total = res.pagination.total_record
      })
    },

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getFaqList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getFaqList()
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
        status: this.editForm.status
      }
      await editbankData(data).then(res => {
        if (res.error_code === 0) {
          console.log('1', res)
          console.log('2', res)
          this.$message.success('修改成功')
        } else {
          this.$message.error('格式不符，修改失敗')
        }
        this.getFaqList()
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

    async addFaq () {
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
        console.log('asdsad', data)
        console.log(typeof res.error_code)
        if (res.error_code === 0) {
          console.log('1', res)
          console.log('2', res)
          this.$message.success('新增成功')
        } else {
          this.$message.error('格式不符，新增失敗')
        }
        this.getFaqList()
      })
    },
    async Search () {
      console.log()
      this.queryInfo.pagenum = 1
      await this.getFaqList()
    },
    async Delete () {
      this.delDialogVisible = false

      this.queryInfo.pagenum = 1
      await this.getFaqList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }

  }
}
</script>

<style>
</style>
