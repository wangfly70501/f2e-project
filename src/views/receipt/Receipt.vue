<template>
  <div>
    <TopBreadcrumb :titles="['項目設置', '發票設置']"></TopBreadcrumb>

    <el-card>
      <!-- 搜索工具 -->

      <el-select v-model="queryInfo.enable" placeholder="請選擇">
        <el-option
          v-for="(enableValue,index) in enable"
          :key="index"
          v-bind:label="enableValue.label"
          v-bind:value="enableValue.value"
        >{{enableValue.label}}</el-option>
      </el-select>&nbsp;
          <el-input
        v-model="formData.name"
        style="width:10% "
        placeholder='請輸入內容'
        clearable @clear="handleSearch" @keyup.enter.native="handleSearch">
          </el-input>
      <el-date-picker
        type="daterange"
        start-placeholder="StartTime"
        end-placeholder="EndTime"
        v-model="queryInfo.date"
        value-format="yyyy-MM-dd"
        style="width:30% "
      ></el-date-picker>&nbsp;
      <el-button type="primary" @click="search()">搜尋</el-button>
      <!-- 手續費列表 -->
      <el-table :data="tableDataEnd" stripe border>
        <el-table-column label="性別" prop="sex"></el-table-column>
        <el-table-column label="訂單編號" prop="number"></el-table-column>
        <el-table-column label="載具類型" prop></el-table-column>
        <el-table-column label="身分證" prop="idcard"></el-table-column>
        <el-table-column label="開立日期" prop="date"></el-table-column>
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

    <!--修改會員 -->
    <el-dialog
      title="修改會員資料"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
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
      tableData: [
        {
          id: '1',
          number: 'XA123445678',
          date: '2019-12-11',
          idcard: 'a123456789',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          sex: '女'
        },
        {
          id: '2',
          number: 'XA123445678',
          date: '2019-12-11',
          idcard: 'a123456789',
          name: '王二虎',
          address: '上海市普陀区金沙江路 1518 弄',
          sex: '女'
        },
        {
          id: '3',
          number: 'XA123445678',
          date: '2019-12-11',
          idcard: 'a123456789',
          name: '王4虎',
          address: '上海市普陀区金沙江路 1518 弄',
          sex: '男'
        },
        {
          id: '4',
          number: 'XA123445678',
          date: '2019-12-11',
          idcard: 'a123456789',
          name: '王5虎',
          address: '上海市普陀区金沙江路 1518 弄',
          sex: '男'
        }
      ],
      enable: [
        {
          label: '所有',
          value: '0'
        },
        {
          label: '男',
          value: '1'
        },
        {
          label: '女',
          value: '2'
        }
      ],
      queryInfo: {
        query: '',
        date: '',
        pagenum: 1,
        pagesize: 10
      },
      chargeList: [],
      total: 10, // 总用户数

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
      rolesList: [],
      tableDataEnd: [],
      filterTableDataEnd: [],
      totalItems: 0
    }
  },

  created () {
    this.getChargeList()
    this.search({})
    this.totalItems = this.tableDataBegin.length
    if (this.totalItems > this.pageSize) {
      for (let index = 0; index < this.pageSize; index) {
        this.tableDataEnd.push(this.tableDataBegin[index])
      }
    } else {
      this.tableDataEnd = this.tableData
    }
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

    search ({ name, phone, sex }) {
      this.realList = this.list.filter(item => {
        let matchName = true // // 姓名 筛选
        if (name) {
          // 模糊搜索;
          const keys = name
            .toUpperCase() // 转大写
            .replace(' ', '') // 删掉空格
            .split('') // 切割成 单个字

          matchName = keys.every(key => item.name.toUpperCase().includes(key))
        }
        return matchName
      })
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
