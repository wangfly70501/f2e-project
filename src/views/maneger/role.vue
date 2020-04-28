<template>
  <div>
    <TopBreadcrumb :titles="['權限管理', '角色列表']"></TopBreadcrumb>

    <el-card>
        <el-row>
        <el-button type="primary" @click="addDialogVisible = true" size="small">新增角色</el-button>
      </el-row>
      <!-- 权限列表 -->
      <el-table :data="rightList" stripe border>
        <el-table-column  label="ID" prop="id" width="50%" align="center"></el-table-column>
        <el-table-column label="角色名稱" prop="role_name"></el-table-column>
        <el-table-column label="角色描述" prop="role_des"></el-table-column>
  <!--       <el-table-column label="權限等級" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '1'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '2'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column> -->
          <el-table-column label="創建時間" prop="ctime"></el-table-column>
                    <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.$index, scope.row)"
            >編輯</el-button>
    <!--           <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="distributionDialog = true"
            >分配</el-button> -->
            <!--     <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserById(scope.row.id)"
            ></el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增角色的对话框 -->
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

    <!-- 修改角色的对话框 -->
    <el-dialog title="編輯角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="角色名稱">
          <el-input v-model="editForm.role_name" ></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.role_des"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

        <!--分配權限的对话框 -->
    <el-dialog title="分配權限" :visible.sync="distributionDialog" width="50%" @close="distributionClosed">
<!--
          <el-checkbox-group v-model="distribution">
            <el-checkbox v-for="item in items" :label="item.id">{{item.role_name}}</el-checkbox>
          </el-checkbox-group> -->
        <el-form :model="distributionForm"  label-width="70px">
        <el-form-item label="功能名稱">
          <el-input v-model="distributionForm.role_name" ></el-input>
        </el-form-item>
        <el-form-item label="權限">
          <el-input v-model="distributionForm.role_des"></el-input>
        </el-form-item>
           <el-form-item label="角色">
          <el-checkbox-group v-model="distribution" @change="handleCheckedChange">
            <el-checkbox v-for="item in roleList" :label="item.id" :key="item.id">{{item.role_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
           <el-form-item label="等級">
          <el-input v-model="distributionForm.level"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributionDialog = false">取 消</el-button>
        <el-button type="primary" @click="savedistribution">确 定</el-button>
      </span>
    </el-dialog>
          <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

  </div>
</template>

<script>
import { roleList, roleAdd, roleModify } from '../../api/index.js'
export default {
  data () {
    return {
      distribution: [],
      rightList: [],
      roleList: {},
      addForm: {},
      editForm: {},
      distributionForm: {},
      addDialogVisible: false,
      editDialogVisible: false,
      distributionDialog: false,
      queryInfo: {
        pagenum: 1,
        pagesize: 10
      },
      total: 0
    }
  },

  created () {
    this.getroleList()
    this.getList()
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
        this.rightList = res.data
        /* this.roleList = res.data */
        this.total = res.pagination.total_record
        console.log('rightList', this.rightList)
      })
    },
    async addRole () {
      this.addDialogVisible = false
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        role_name: this.addForm.roleName,
        role_des: this.addForm.roleDesc,
        role_type: '0'
      }
      console.log('data', data)
      await roleAdd(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('新增成功')
        } else {
          this.$message.error('新增失敗')
        }
      })
    },
    addDialogClosed () {

    },

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getroleList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getroleList()
    },
    showEditDialog (index, row) {
      this.editForm = row
      console.log('editform', this.editForm)
      this.editDialogVisible = true
    },
    async saveEdit () {
      this.editDialogVisible = false
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        role_name: this.editForm.role_name,
        role_des: this.editForm.role_des,
        role_type: '0',
        role_id: this.editForm.id
      }
      await roleModify(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('格式不符，修改失敗')
        }
        this.getroleList()
      })
    },
    editDialogClosed () {

    },

    savedistribution () {
      console.log('distribution', this.distribution)
    },
    handleCheckedChange (value) {
      console.log(value)
    },
    distributionClosed () {
      this.distributionForm.role_name = ''
      this.distributionForm.role_des = ''
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
