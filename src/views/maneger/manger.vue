<template>
  <div>
    <TopBreadcrumb :titles="['權限管理', '帳號管理']"></TopBreadcrumb>

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
        <el-table-column label="角色名稱" prop="role_name"></el-table-column>
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
         <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showEditDialog (scope.$index, scope.row)"
            >分配角色</el-button>
                 </template>
         </el-table-column>

      </el-table>
            <!--分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="distributionDialog" width="50%" @close="distributionClosed">
<!--
          <el-checkbox-group v-model="distribution">
            <el-checkbox v-for="item in items" :label="item.id">{{item.role_name}}</el-checkbox>
          </el-checkbox-group> -->
        <el-form :model="distributionForm"  label-width="70px">
        <el-form-item label="帳號">
          <el-input v-model="distributionForm.name" ></el-input>
        </el-form-item>
        <el-form-item label="手機">
          <el-input v-model="distributionForm.mobile"></el-input>
        </el-form-item>
          <el-form-item label="email">
          <el-input v-model="distributionForm.email"></el-input>
        </el-form-item>
           <el-form-item label="角色">
          <el-checkbox-group v-model="distribution">
            <el-checkbox v-for="item in roleList" :label="item.id" :key="item.id">{{item.role_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributionDialog = false">取 消</el-button>
        <el-button type="primary" @click="savedistribution">确 定</el-button>
      </span>
    </el-dialog>
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
import { setMgState, getAuthList, roleList } from '../../api/index.js'

export default {

  data () {
    return {
      roleList: {},
      distribution: [],
      distributionForm: {},
      distributionDialog: false,
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
    this.getList()
    this.getAuthList()
    this.objList()
    console.log('!!!', process.env)
  },

  methods: {
    async getList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: 100,
        page: 1
      }
      console.log('4565', data)
      await roleList(data).then(res => {
        this.roleList = res.data
      })
    },

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
    },
    distributionClosed () {
      this.distributionForm.role_name = ''
      this.distributionForm.role_des = ''
    },
    async savedistribution () {
      const arr = Array.prototype.slice.call(this.distribution)
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        role_id: arr,
        id: this.distributionForm.id.toString()
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
    showEditDialog (index, row) {
      this.distributionDialog = true
      this.distributionForm = row
      console.log('456', this.distributionForm)
    }
  }
}
</script>

<style>
</style>
