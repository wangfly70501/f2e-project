<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', '鎖倉']"></TopBreadcrumb>

    <el-card>
      <!-- 搜索工具 -->
      <div class="text">
        <el-input v-model="searchlist" @keyup.enter.native="Search" style="width:10%" placeholder="請輸入標題"></el-input>&nbsp;
        <el-date-picker
          type="daterange"
          start-placeholder="StartTime"
          end-placeholder="EndTime"
          v-model="queryInfo.date"
          value-format="yyyy-MM-dd"
          style="width:15% "
        ></el-date-picker>&nbsp;
                        <el-select  v-model="enable.value" placeholder="請選擇"
                         style="width:8% ">
                            <el-option
                                v-for="(enableValue,index) in enable"
                                :key="index"
                                v-bind:label="enableValue.label"
                                v-bind:value="enableValue.value"
                            >{{enableValue.label}}</el-option>
                        </el-select>&nbsp;
                         <el-button type="primary" @click="clear">清除</el-button>
        <el-button type="primary" @click="Search">搜尋</el-button>
        <el-button type="info" @click="addDialogVisible = true" class="btn_right">建立活動</el-button>

      </div>
      <!-- 列表 -->
      <el-table :data="Lockuplist" stripe border @selection-change="handleSelectionChange">
        <!-- <el-table-column
      type="selection"
      width="40px">
    </el-table-column>
        <el-table-column label="ID" prop="id" width="40px"></el-table-column> -->
        <el-table-column label="ID" prop="id"  width="40%"></el-table-column>
        <el-table-column label="活動名稱" prop="title" ></el-table-column>
        <el-table-column label="利率" prop="rate" width="50%"></el-table-column>
        <el-table-column label="幣種" prop="currency"  width="50%"></el-table-column>
         <el-table-column label="申購單位">
            <template slot-scope="scope">
            {{scope.row.minAmount |  NumFormat}} ~ {{scope.row.maxAmount |  NumFormat }}
            </template>
         </el-table-column>
        <el-table-column label="天數" prop="days" width="50%"></el-table-column>
        <el-table-column label="開始時間">
            <template slot-scope="scope">
            {{scope.row.beginTime | datefformat}}
            </template>
        </el-table-column>
        <el-table-column label="活動方式" >
            <template slot-scope="scope">

         <div v-if="scope.row.type ===1" style="color:gray"> </div>
            <div  v-else>
            {{scope.row.endTime | datefformat}} <p style="color:gray">日期到期即結束</p>
            </div>

                <div v-if="scope.row.type ===1" >{{scope.row.people_limit}}  <p style="color:gray">人數到達即結束</p></div>
            <div  v-else  > </div>
            </template>

        </el-table-column>
        <el-table-column label="活動創建者" prop="creator"></el-table-column>
        <el-table-column label="狀態" width="50%">
          <template slot-scope="scope">
            <div v-if="scope.row.active === 1" style="color:blue">啟用</div>
            <div  v-else style="color:gray"> 棄用</div>
          </template>
        </el-table-column>

        <el-table-column label="活動狀態" width="80%">
          <template slot-scope="scope">
              <div v-if="scope.row.status === 0" style="color:orange">未開始</div>
               <div v-else-if="scope.row.status === 1" style="color:red">進行中</div>
            <div  v-else style="color:gray">已結束</div>
          </template>
        </el-table-column>

            <el-table-column label="活動類型" >
          <template slot-scope="scope">
            <div v-if="scope.row.type === 1">人數限制</div>
            <div  v-else>時間限制</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button  v-if="scope.row.status === 0"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.$index, scope.row)"
            >編輯</el-button>

            <el-button v-else disabled   type="info" plain  icon="el-icon-edit"  size="mini">編輯 </el-button>&nbsp;
            <el-button  @click="jump(scope.$index, scope.row)" size="mini"   type="success" plain>參加者列表</el-button>
          <!--        <el-button
              type="success" plain
              icon="el-icon-view"
              size="mini"
              @click="deleteUserById(scope.row.id)"
            >檢視詳細</el-button> -->
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

    <!-- 新增鎖倉 -->
    <el-dialog title="新增鎖倉" :visible.sync="addDialogVisible" width="80%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="活動標題" >
          <el-input v-model="addForm.title"></el-input>
            </el-form-item>
            <el-form-item label="活動人數限制">
          <el-input v-model="addForm.people_limit"></el-input>
        </el-form-item>
            <el-form-item label="活動利率">
          <el-input v-model="addForm.rate"></el-input>
        </el-form-item>
            <el-form-item label="活動天數">
          <el-input v-model="addForm.days"></el-input>
        </el-form-item>
        <el-form-item label="活動幣種">
          <el-input v-model="addForm.currency"></el-input>
        </el-form-item>

               <el-form-item label="活動類型">
        <el-radio-group v-model="addForm.type">
      <el-radio :label='1' >人數限制</el-radio>
      <el-radio :label='2' >時間限制</el-radio>
          </el-radio-group>

        </el-form-item>
            <el-form-item label="活動最小金額">
          <el-input v-model="addForm.minAmount"></el-input>
        </el-form-item>
        <el-form-item label="活動最大金額">
          <el-input v-model="addForm.maxAmount"></el-input>
        </el-form-item>
       <el-form-item label="活動開始日期"  >
          <el-date-picker
          type="datetime"
          v-model="queryInfo.beginTime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          style="width:100%"
        ></el-date-picker></el-form-item>
         <el-form-item label="活動結束日期"  >
        <el-date-picker
          type="datetime"
          v-model="queryInfo.endTime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          style="width:100%"
        ></el-date-picker> </el-form-item>

      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addLockup">確定</el-button>
      </span>
    </el-dialog>

    <!--編輯活動 -->
    <el-dialog
      title="編輯活動"
      :visible.sync="editDialogVisible"
      width="60%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" ref="editFormRef" label-width="100px">
             <el-form-item label="活動標題">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
            <el-form-item label="活動人數限制">
          <el-input v-model="editForm.people_limit"></el-input>
        </el-form-item>
            <el-form-item label="活動利率">
          <el-input v-model="editForm.rate"></el-input>
        </el-form-item>
            <el-form-item label="活動天數">
          <el-input v-model="editForm.days"></el-input>
        </el-form-item>
        <el-form-item label="活動幣種">
          <el-input v-model="editForm.currency"></el-input>
        </el-form-item>

               <el-form-item label="活動類型">
        <el-radio-group v-model="editForm.type">
      <el-radio :label='1' >人數限制</el-radio>
      <el-radio :label='2' >時間限制</el-radio>
          </el-radio-group>

        </el-form-item>
            <el-form-item label="活動最小金額">
          <el-input v-model="editForm.minAmount"></el-input>
        </el-form-item>
        <el-form-item label="活動最大金額">
          <el-input v-model="editForm.maxAmount"></el-input>
        </el-form-item>

             <el-form-item label="活動狀態">
           <el-switch
              v-model="editForm.active"
              active-color="#13ce66"
              inactive-color="#BEBEBE"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
        </el-form-item>
         <div class="form-right">
             <el-form-item label="活動開始日期"  >
          <el-date-picker
          type="datetime"
          format="yyyy-MM-dd HH:mm"

          v-model="editForm.beginTime"

          style="width:100%"
        ></el-date-picker></el-form-item>
         <el-form-item label="活動結束日期"  >
        <el-date-picker

          v-model="editForm.endTime"
          type="datetime"
            format="yyyy-MM-dd HH:mm"

          style="width:100%"
        ></el-date-picker> </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">確定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { addActivity, Lockupdata, Lockupedit } from '../../api/index.js'

export default {
  data () {
    return {
      queryData: {},
      content: '',
      html: '',
      configs: {},
      searchlist: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: '',
        beginTime: '',
        endTime: ''
      },
      editorOption: {
        placeholder: '開始編輯'
      },
      date: [],
      Lockuplist: [],

      total: 0,
      addDialogVisible: false,
      addForm: {
        lang: []
      },
      addFormRules: {
        addbanken: [
          { required: true, message: '請輸入銀行英文名稱', trigger: 'blur' },
          { min: 3, max: 12, message: '長度在 3 到 12 個字元', trigger: 'blur' }
        ],
        addbankcode: [
          { required: true, message: '請輸入銀行英文名稱', trigger: 'blur' },
          { min: 3, max: 10, message: '長度在 3 到 10 個字元', trigger: 'blur' }
        ],
        addbankch: [
          { required: true, message: '請輸入銀行中文名稱', trigger: 'blur' },
          { min: 3, max: 10, message: '長度在 3 到 10 個字元', trigger: 'blur' }
        ]
      },

      editDialogVisible: false,
      table: {},
      editForm: {
        lang: []
      },

      enable: [
        {
          label: '所有',
          value: ''
        },
        {
          label: '人數限制',
          value: '1'
        },
        {
          label: '時間限制',
          value: '2'
        }

      ]

    }
  },
  Filter: {
    commaFormat: function (value) {
      // 加上千分位符號
      return value
        .toString()
        .replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, groupOf3Digital) {
          return pre + groupOf3Digital.replace(/\d{3}/g, ',$&')
        })
    }
  },

  created () {
    this.getLockupList()
    console.log(this.Lockuplist)
  },

  methods: {

    // 获取列表
    async getLockupList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        starttime: this.queryInfo.beginTime,
        endtime: this.queryInfo.endTime,
        searchValue: this.searchlist,
        activityType: this.enable.value

      }
      await Lockupdata(data).then(res => {
        this.Lockuplist = res.data
        console.log('123', res.data)
        this.total = res.pagination.total_record
      })
    },

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getLockupList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getLockupList()
    },

    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },

    showEditDialog (index, row) {
      this.editForm = row
      this.editDialogVisible = true
      this.getLockupList()
    },

    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },

    async saveEdit () {
      this.editDialogVisible = false
      var data = {
        id: this.editForm.id,
        title: this.editForm.title,
        people_limit: this.editForm.people_limit,
        rate: this.editForm.rate,
        currency: this.editForm.currency,
        minAmount: this.editForm.minAmount,
        maxAmount: this.editForm.maxAmount,
        beginTime: this.editForm.beginTime,
        endTime: this.editForm.endTime,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        active: this.editForm.active.toString(),
        days: this.editForm.days,
        type: this.editForm.type
      }
      await Lockupedit(data).then(res => {
        console.log('endTime', this.endTime)
        if (res.error_code === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('格式不符，修改失敗')
        }
        this.getLockupList()
      })
    },
    // 新增鎖倉
    async addLockup () {
      this.addDialogVisible = false
      var data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        type: this.addForm.type,
        title: this.addForm.title,
        people_limit: this.addForm.people_limit,
        rate: this.addForm.rate,
        currency: this.addForm.currency,
        minAmount: this.addForm.minAmount,
        maxAmount: this.addForm.maxAmount,
        beginTime: this.queryInfo.beginTime,
        endTime: this.queryInfo.endTime,
        days: this.addForm.days

      }
      console.log('beginTime', this.queryInfo.adddate)
      await addActivity(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('新增成功')
        } else {
          this.$message.error('格式不符，新增失敗')
        }
        this.getLockupList()
      })
    },
    async Search () {
      this.queryInfo.pagenum = 1
      await this.getLockupList()
    },

    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    async clear () {
      this.$refs.enableValue.resetFields()
    },
    jump (index, row) {
      let queryData = {}
      queryData = row
      this.$router.push({ path: '/lockuplist', query: queryData })
    }

  }
}
/* 數字千分位 */

</script>

<style>
   .form-right {
    width:50%; padding-left:1rem; padding-right:1rem; padding-top:1rem;

  }
  .btn_right{
    float: right;
    left: 50px;
  }
  .el-dialog__header{
    background-color: #F2F2F2;
  }
</style>
