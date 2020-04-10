<template>
  <div>
    <TopBreadcrumb :titles="['權限管理', '權限列表']"></TopBreadcrumb>

    <el-card>
        <el-row>
        <el-button type="primary" @click="addDialogVisible = true" size="small">新增權限</el-button>
      </el-row>
      <!-- 权限列表 -->
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="權限名稱" prop="authName"></el-table-column>
        <el-table-column label="權限ID" prop="role_id"></el-table-column>
  <!--       <el-table-column label="權限等級" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '1'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '2'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column> -->
          <el-table-column label="描述" prop="path"></el-table-column>
      </el-table>

      <!-- 新增權限的对话框 -->
    <el-dialog title="新增權限" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed" class="dialog">
      <el-form :model="addForm" ref="addFormRef" label-width="100px">
        <el-form-item label="權限名稱" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="權限描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">確 定</el-button>
      </span>
    </el-dialog>
    </el-card>

  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: [],
      addForm: {},
      addDialogVisible: false
    }
  },

  created () {
    this.getRightsList()
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
    // 获取所有的权限
    async getRightsList () {

    },
    addDialogClosed () {

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
    }

  }
}
</script>

<style>
.dialog .el-dialog__header{
  background-color: #E8EAED;
}
.dialog .el-dialog__title{
  color: black;
}
</style>
