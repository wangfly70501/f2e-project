<template>
  <div>
    <TopBreadcrumb :titles="['項目設置', '發票載具']"></TopBreadcrumb>

    <el-card>
      <!-- 搜索工具 -->
      <SearchTool v-model="queryInfo.query" @search="getChargeList">
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">新增載具</el-button>
        </el-col>
      </SearchTool>

      <!-- 手續費列表 -->
      <el-table :data="chargeList" stripe border>
        <el-table-column type="index" prop></el-table-column>
        <el-table-column label="銀行" prop=""></el-table-column>
        <el-table-column label="手續費" prop=""></el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserById(scope.row.id)"
            ></el-button>

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

    <!-- 新增會員 -->
    <el-dialog title="新增會員" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="帳號" prop="account">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="信箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手機" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">確 定</el-button>
      </span>
    </el-dialog>

    <!--修改會員 -->
    <el-dialog title="修改會員資料" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="銀行">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手續費" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">確 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) return cb()
      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) return cb()
      cb(new Error('请输入合法的手机号'))
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      chargeList: [],
      total: 0, // 总用户数

      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '請輸入姓名', trigger: 'blur' },
          { min: 3, max: 10, message: '長度在 3 到 10 個字元', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '請輸入帳號', trigger: 'blur' },
          { min: 3, max: 10, message: '長度在 3 到 10 個字元', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { min: 3, max: 15, message: '長度在 3 到 10 個字元', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '請輸入信箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '請輸入手機', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      editDialogVisible: false,
      table: {},
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '請輸入信箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '請輸入手機', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      setRoleDialogVisible: false,
      selectedRoleId: null,
      userInfo: {},
      rolesList: []
    }
  },

  created () {
    this.getChargeList()
  },

  methods: {
    // 获取用户列表
    async getChargeList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('獲取用户列表失败')
      }

      this.chargeList = res.data.users
      this.total = res.data.total
    },

    // 更改用户状态
    async userStateChanged (userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )

      if (res.meta.status !== 200) {
        userInfo.mg_state = res.data.mg_state
        return this.$message.error('更新用户狀態失败')
      }
      this.$message.success('更新用戶狀態成功')
    },

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getChargeList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getChargeList()
    },

    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },

    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('users', this.addForm)

        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }

        this.$message.success('添加用户成功')
        this.getChargeList()
        this.addDialogVisible = false
      })
    },

    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('查詢用户信息失败')
      }

      this.editForm = res.data
      this.editDialogVisible = true
    },

    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },

    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }

        this.$message.success('更新用户信息成功')
        this.getChargeList()
        this.editDialogVisible = false
      })
    },

    async deleteUserById (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否繼續?',
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
        return this.$message.error('删除用户失败')
      }

      this.$message.success('删除用户成功')
      this.getChargeList()
    },

    setRoleDialogClosed () {
      this.selectedRoleId = null
      this.userInfo = {}
    },

    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        return this.$message.error('請選擇要分配的角色')
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败')
      }

      this.$message.success('更新角色成功')
      this.getChargeList()
      this.setRoleDialogVisible = false
    }
  }
}
</script>

<style>
</style>
