<template>
  <div>
    <TopBreadcrumb :titles="['權限管理', '權限列表']"></TopBreadcrumb>

    <el-card>
        <el-row>
           <el-button type="primary" @click="distributionDialog = true" size="small">新增權限</el-button>
      </el-row>
      <!-- 权限列表 -->
      <el-table :data="rightList" stripe border>
        <el-table-column  label="角色名稱" prop="role_name" ></el-table-column>
        <el-table-column label="功能名稱" prop="component_name"></el-table-column>
        <!-- <el-table-column label="權限等級" prop="ps_level"></el-table-column> -->
       <el-table-column label="權限等級">
          <template v-slot="scope">
            <el-tag v-if="scope.row.ps_level == 0">LV1</el-tag>
            <el-tag v-else-if="scope.row.ps_level == 1" type="success">LV2</el-tag>
            <el-tag v-else type="warning">LV3</el-tag>
          </template>
        </el-table-column>
      </el-table>
        <!--分配權限的对话框 -->
    <el-dialog title="新增權限" :visible.sync="distributionDialog" width="50%" @close="distributionClosed">
<!--
          <el-checkbox-group v-model="distribution">
            <el-checkbox v-for="item in items" :label="item.id">{{item.role_name}}</el-checkbox>
          </el-checkbox-group> -->
        <el-form :model="distributionForm"  label-width="70px">
        <el-form-item label="功能名稱">
          <el-input v-model="distributionForm.component_name" ></el-input>
        </el-form-item>
        <el-form-item label="路徑">
          <el-input v-model="distributionForm.component"></el-input>
        </el-form-item>
           <el-form-item label="角色">
          <el-checkbox-group v-model="distribution" @change="handleCheckedChange">
            <el-checkbox v-for="item in roleList" :label="item" :key="item.id">{{item.role_name}}</el-checkbox>
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

    </el-card>

  </div>
</template>

<script>
import { roleList, rolePermissionList, rolePermissionAdd } from '../../api/index.js'
export default {
  data () {
    return {
      qqq: {},
      rolename: [],
      roleid: [],
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
        pagesize: 50
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

      await roleList(data).then(res => {
        this.roleList = res.data
        console.log('4565', this.roleList)
      })
    },
    // 获取所有的角色
    async getroleList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        status: '1'
      }
      console.log('4565', data)
      await rolePermissionList(data).then(res => {
        this.rightList = res.data
        /* this.roleList = res.data */
        this.total = res.pagination.total_record
        console.log('rightList', this.rightList)
      })
    },
    /*    showEditDialog (index, row) {
      this.editForm = row
      console.log('editform', this.editForm)
      this.editDialogVisible = true
    }, */

    async savedistribution () {
      this.distributionDialog = false
      console.log('32323456', this.distribution)
      console.log('777', this.distribution.length)
      for (var i = 0; i < this.distribution.length; i++) {
        console.log('444', this.distribution[i].id)
        console.log('555', this.distribution[i].role_name)
        this.$set(this.distribution, this.distribution[i], this.distribution[i].role_name)

        this.rolename = this.distribution[i].role_name
        this.roleid = this.distribution[i].id
      }
      console.log('666', this.rolename)
      console.log('666', this.roleid)
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        role_id: this.roleid,
        ps_level: this.distributionForm.level,
        component_name: this.distributionForm.component_name,
        component: this.distributionForm.component,
        role_name: this.rolename
      }

      console.log('data', data)
      await rolePermissionAdd(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('新增成功')
        } else {
          this.$message.error('格式不符，新增失敗')
        }
        this.getroleList()
      })
    },
    handleCheckedChange (value) {
      console.log(value)
      for (var i = 0; i < this.distribution.length; i++) {
        if (this.distribution[i].id === this.roleList[i].id) { // 問答題   讓當前對象的鍵名 爲當前題的id
          this.rolename = this.roleList[i].role_name
        }
      }
      console.log(' this.rolename', this.rolename)
    },
    distributionClosed () {
      this.distributionForm.role_name = ''
      this.distributionForm.role_des = ''
    }
    /*     async changeSwitch (index, row) {
      this.form = row
      console.log('form', this.form)
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        status: this.form.status.toString(),
        component_name: this.form.component_name
      }
      await rolePermissionStatus(data).then(res => {
        console.log('456', data)
        if (res.error_code === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失敗')
        }
        this.getroleList()
      })
    } */

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
