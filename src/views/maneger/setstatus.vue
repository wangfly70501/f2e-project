<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', '帳號管理']"></TopBreadcrumb>

    <el-card>
      <!-- 列表 -->
      <el-table :data="AuthList" stripe border>
        <el-table-column label="id" prop="id" ></el-table-column>
        <el-table-column label="帳號" prop="name"></el-table-column>
        <el-table-column label="時間" prop="">
            <template slot-scope="scope">
                {{scope.row.time|dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="手機" prop="mobile">
            <template slot-scope="scope">
                {{scope.row.mobile|phoneformat}}
            </template>
        </el-table-column>
        <el-table-column label="email" prop="email"></el-table-column>
        <el-table-column label="狀態" prop="status">
               <template slot-scope="scope">
             <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#BEBEBE"
              :active-value='1'
              :inactive-value='0'
             @change="changeSwitch(scope.$index, scope.row)"
            ></el-switch>
           <!--  "scope.row.status 1是等於開啟 0是關閉 -->
             </template>
        </el-table-column>
      </el-table>
    <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

  </div>
</template>

<script>
import { setMgState, getAuthList } from '../../api/index.js'

export default {

  data () {
    return {

      date: [],
      maintainlist: [],
      total: 0, // 总用户数
      picDialogVisible: false,
      addDialogVisible: false,
      addForm: {
        lang: []
      },
      addFormRules: {
        addtitle: [
          { required: true, message: '請輸入標題', trigger: 'blur' }
        ],
        lang: [
          { required: true, message: '請選擇語言', trigger: 'blur' }
        ],
        addcontent: [
          { required: true, message: '請輸入內容', trigger: 'blur' }

        ]
      },
      imgList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: '',
        beginTime: '',
        endTime: '',
        date: []
      },
      editDialogVisible: false,
      table: {},
      editForm: {
        lang: []
      },
      AuthList: []

    }
  },

  created () {
    this.getAuthList()
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
    // 获取列表
    async getAuthList  () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum
      }
      await getAuthList(data).then(res => {
        console.log('123456', res.data)
        this.AuthList = res.data
        this.total = res.pagination.total_record
      })
    },
    async changeSwitch (index, row) {
      this.form = row
      console.log('form', this.form)
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        set_mgState: this.form.status.toString(),
        set_mgID: this.form.id.toString()
      }
      await setMgState(data).then(res => {
        console.log('456', data)
        if (res.error_code === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失敗')
        }
        this.getAuthList()
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getAuthList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getAuthList()
    }

  }
}
</script>

<style>
</style>
