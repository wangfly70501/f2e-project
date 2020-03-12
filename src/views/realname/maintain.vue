<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', '維護管理']"></TopBreadcrumb>

    <el-card>
      <!-- 列表 -->
      <el-table :data="maintainlist" stripe border>
        <el-table-column label="id" prop="id" ></el-table-column>
        <el-table-column label="標題" prop="title"></el-table-column>
        <el-table-column label="類型" prop="os"></el-table-column>
        <el-table-column label="狀態" prop="switch">
               <template slot-scope="scope">
             <el-switch
              v-model="scope.row.switch"
              active-color="#13ce66"
              inactive-color="#BEBEBE"
              :active-value='0'
              :inactive-value='1'
             @change="changeSwitch(scope.$index, scope.row)"
            ></el-switch>
             </template>
        </el-table-column>
      </el-table>

    </el-card>

  </div>
</template>

<script>
import { maintainList, maintainedit } from '../../api/index.js'

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
      editDialogVisible: false,
      table: {},
      editForm: {
        lang: []
      },

      enable: [
        {
          label: '繁體中文',
          value: 'el_GR'
        },
        {
          label: '简体中文',
          value: 'zh_CN'
        },
        {
          label: 'Engilsh',
          value: 'en_US'
        }
      ]

    }
  },

  created () {
    this.getmaintainList()
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
    async getmaintainList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')
      }
      await maintainList(data).then(res => {
        console.log('123456', res.data)
        this.maintainlist = res.data
      })
    },
    changeSwitch (index, row) {
      this.form = row
      console.log('123', this.form)
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        switch: this.form.switch.toString(),
        id: this.form.id.toString()
      }
      maintainedit(data).then(res => {
        console.log('456', data)
        if (res.error_code === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失敗')
        }
        this.getmaintainList()
      })
    }

  }
}
</script>

<style>
</style>
