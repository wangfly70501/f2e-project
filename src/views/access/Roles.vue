<template>
  <div>
    <TopBreadcrumb :titles="['權限管理', '角色列表']"></TopBreadcrumb>

    <el-card>
      <el-row>
        <el-button type="primary" @click="addDialogVisible = true">新增角色</el-button>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="roleList" stripe border>
        <!-- 二级展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(right_1, idx_1) in scope.row.children"
              :class="['v-center', 'bd-bottom', { 'bd-top': idx_1 === 0 }]"
              :key="right_1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="deleteRightById(scope.row, right_1.id)">{{right_1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="19">
                <el-row v-for="(right_2, idx_2) in right_1.children"
                  :class="['v-center', {'bd-top': idx_2 !== 0}]"
                  :key="right_2.id">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable
                      @close="deleteRightById(scope.row, right_2.id)">
                      {{right_2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" closable
                      v-for="right_3 in right_2.children"
                      :key="right_3.id"
                      @close="deleteRightById(scope.row, right_3.id)">
                      {{right_3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名稱" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEditRole">編輯</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoleById(scope.row.id)">刪除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini"
              @click="showSetRightDialog(scope.row)">分配權限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog title="新增角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="角色名稱" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">確 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配權限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <el-tree
        :data="rightsList" :props="treeProps" ref="treeRef"
        show-checkbox node-key="id" default-expand-all
        :default-checked-keys="defaultKeys">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">確 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],

      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          { required: true, message: '請輸入角色', trigger: 'blur' },
          { min: 2, max: 10, message: '長度在 2 到 10 個字元', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '請輸入備註', trigger: 'blur' },
          { min: 3, max: 15, message: '長度在 3 到 15 個字元', trigger: 'blur' }
        ]
      },

      roleId: null,
      rightsList: [],
      setRightDialogVisible: false,
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认勾选的节点key(此处只存放三级权限的key)
      defaultKeys: []
    }
  },

  created () {
    this.getRoleList()
  },

  methods: {
    // 获取所有的角色
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error('獲取角色列表失敗')
      }

      this.roleList = res.data
    },

    // 根据id删除指定角色的单个权限
    async deleteRightById (roleInfo, rightId) {
      const confirmResult = await this.$confirm(
        '此操作將刪除角色權限，是否操作?',
        '提示',
        {
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消')
      }

      const { data: res } = await this.$http.delete(
        `roles/${roleInfo.id}/rights/${rightId}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除權限失敗')
      }

      roleInfo.children = res.data
    },

    addRole () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('roles', this.addForm)

        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }

        this.$message.success('添加角色成功')
        this.getRoleList()
        this.addDialogVisible = false
      })
    },

    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },

    handleEditRole () {
      this.$message.error('角色信息暂不支持修改')
    },

    async deleteRoleById (roleId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除該角色, 是否繼續?',
        '提示',
        {
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('操作已取消')
      }

      const { data: res } = await this.$http.delete(`roles/${roleId}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }

      this.$message.success('删除角色成功')
      this.getRoleList()
    },

    // 打开分配权限对话框
    async showSetRightDialog (roleInfo) {
      this.roleId = roleInfo.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('獲取權限失敗')
      }

      this.rightsList = res.data
      this.getLeafKeys(roleInfo, this.defaultKeys)
      this.setRightDialogVisible = true
    },

    // 通过递归获取节点（角色/权限）的所有三级权限的id，保存到数组中
    getLeafKeys (node, arr) {
      // 没有子节点时即为三级权限节点，保存并返回
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },

    // 分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配權限失敗')
      }

      this.$message.success('分配權限成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    },

    setRightDialogClosed () {
      this.roleId = null
      this.defaultKeys = []
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bd-top {
  border-top: 1px solid #eee;
}

.bd-bottom {
  border-bottom: 1px solid #eee;
}

.v-center {
  display: flex;
  align-items: center;
}
</style>
