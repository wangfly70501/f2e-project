<template>
  <div>
    <TopBreadcrumb :titles="['權限管理', '角色列表']"></TopBreadcrumb>

    <el-card>
        <el-row>
        <el-button type="primary" @click="addDialogVisible = true" size="small">新增角色</el-button>
      </el-row>
      <!-- 权限列表 -->
      <el-table :data="roleList " stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名稱" prop="authName"></el-table-column>
        <el-table-column label="角色描述" prop="role_id"></el-table-column>
  <!--       <el-table-column label="權限等級" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '1'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '2'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column> -->
          <el-table-column label="創建時間" prop="path"></el-table-column>
      </el-table>

      <!-- 新增權限的对话框 -->
    <el-dialog title="新增角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed" class="dialog">
      <el-form :model="addForm" ref="addFormRef" label-width="100px">
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
    </el-card>

  </div>
</template>

<script>
import { roleList } from '../../api/index.js'
export default {
  data () {
    return {
      roleList: [],
      addForm: {},
      addDialogVisible: false,
      queryInfo: {
        pagenum: 1,
        pagesize: 10,
        date: [],
        enable: '0'
      },
      total: 0
    }
  },

  created () {
    this.getroleList()
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
    // 获取所有的角色
    async getroleList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum

      }
      console.log('4565', data)
      await roleList(data).then(res => {
        this.roleList = res.data
        /* this.total = res.pagination.total_record */
        console.log('4561212', this.roleList)
      })
    },
    addDialogClosed () {

    },
    addRole () {
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
