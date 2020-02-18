<template>
  <div>
    <TopBreadcrumb :titles="['會員管理', '會員層級列表']"></TopBreadcrumb>

    <el-card>
      <el-button type="primary" @click="addDialogVisible = true">新增層級</el-button>

      <!-- 會員列表数据 -->
      <el-table :data="userlevelList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="會員層級" prop="level"></el-table-column>
        <el-table-column label="限額" prop="limitamt"></el-table-column>
        <el-table-column label="是否開通" prop="status">
                <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.status === 0">禁用</el-tag>
            <el-tag type="success" v-else>啟用</el-tag>
          </template>
        </el-table-column>
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

    </el-card>
   <!--新增會員層級 -->
      <el-dialog title="新增層級" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" ref="addFormRef" label-width="100px">
          <el-form-item label="會員層級" >
          <el-input v-model="addForm.level"  placeholder="請輸入層級"></el-input>
        </el-form-item>
        <el-form-item label="限額">
          <el-input v-model="addForm.limitamt"  placeholder="請輸入限額"></el-input>
           </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduserlevel">確定</el-button>
      </span>
    </el-dialog>

    <!--修改會員層級 -->
    <el-dialog
      title="修改會員層級"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm"  ref="editFormRef" label-width="70px">
        <el-form-item label="銀行層級">
          <el-input v-model="editForm.level"></el-input>
        </el-form-item>
        <el-form-item label="銀行限額" prop="editcharge">
          <el-input v-model="editForm.limitamt"></el-input>
        </el-form-item>
                <el-form-item label="銀行狀態">
                        <el-select v-model="editForm.status" placeholder="請選擇">
                            <el-option
                                v-for="(enableValue,index) in enable"
                                :key="index"
                                v-bind:label="enableValue.label"
                                v-bind:value="enableValue.value"
                            >{{enableValue.label}}</el-option>
                        </el-select>
        </el-form-item></el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userlevelData, userlevelSet, adduserlevel } from '../../api/index.js'

export default {
  data () {
    return {
      editForm: {},
      queryInfo: {
        query: '',
        enable: '1'
      },

      userlevelList: [],
      addDialogVisible: false,
      editDialogVisible: false,
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
      addForm: {
        level: '',
        limitamt: ''

      }

    }
  },

  created () {
    this.getUserlevelList()
  },

  methods: {
    async getUserlevelList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')

      }
      await userlevelData(data).then(res => {
        this.userlevelList = res.data
      })
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
        level: this.editForm.level,
        limitamt: this.editForm.limitamt,
        status: parseInt(this.editForm.status),
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')

      }

      await userlevelSet(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('格式不符，修改失敗')
        }
        this.getUserlevelList()
      })
    },
    async adduserlevel () {
      this.addDialogVisible = false
      var data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        level: this.addForm.level,
        limitamt: this.addForm.limitamt
      }

      await adduserlevel(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('新增成功')
        } else {
          this.$message.error('格式不符，新增失敗')
        }
        this.getUserlevelList()
      })
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
