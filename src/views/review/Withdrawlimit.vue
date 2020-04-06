<template>
  <div>
    <TopBreadcrumb :titles="['審核管理', '審核提領上限']"></TopBreadcrumb>

    <el-card>

<!--      <p class="text">UUid:</p>
<el-input v-model="searchlist" @keyup.enter.native="Search" style="width:30%" placeholder="請輸入uid"></el-input>&nbsp;
      <p class="text">提交時間:</p>
      <el-date-picker
        type="daterange"
        start-placeholder="StartTime"
        end-placeholder="EndTime"
        v-model="queryInfo.date"
        value-format="yyyy-MM-dd"
        style="width:30%"
      ></el-date-picker>&nbsp;
      <el-button type="primary" @click="Search">搜尋</el-button> -->
      <el-table :data="withdrawlist" :default-sort="{prop: 'id', order: 'descending'}"  :header-cell-style="tableHeaderColor" border>
       <el-table-column label="ID" prop="id" sortable></el-table-column>
        <el-table-column label="UUID/姓名">
            <template slot-scope="scope">
                 <router-link  :to="{path:'/membercatch',query:{uuid:`${scope.row.uuid}`}}" target='_blank'>{{scope.row.uuid }} / {{scope.row.username }}</router-link>
            </template>
        </el-table-column>
        <el-table-column label="調整提領上限/期限" >
              <template slot-scope="scope">
                <div  v-if="scope.row.levelType===0">{{scope.row.limitday_temp |NumFormat }}/永久</div>
                <div  v-else>{{scope.row.limitday_temp |NumFormat }}/ 臨時</div>
            </template></el-table-column>

        <el-table-column label="調整原因" prop="reason"></el-table-column>
        <el-table-column label="時間" >
            <template slot-scope="scope">
                {{scope.row.ctime |dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作者" prop="cuser"></el-table-column>
        <!-- <el-table-column label="審核" >
                <template>
          <div v-if="isShow">
         <el-button type="success"  size="mini">通過</el-button>
        <el-button type="danger" size="mini"   @click="showToggle" >退回</el-button>
          </div> -->
        <!-- 隱藏组件點擊顯示 -->
        <!-- <div v-else>
         <el-input placeholder="退回原因(15字以內)" v-model="queryInfo.reason" @click="showToggle" ></el-input>
         <el-button v-if="queryInfo.reason==''" type="info"  size="mini"   disabled  @click="addjump">退回</el-button>
        <el-button v-else type="danger" @click="addjump" size="mini"    >退回</el-button>
        </div>
            </template>
        </el-table-column> -->

              <el-table-column label="審核" >
               <template slot-scope="scope">
                   <div  v-if="scope.row.status_temp===0">
                      <el-button type="success"  size="mini" @click="showpassDialog(scope.$index,scope.row)">通過</el-button>
                      <el-button type="danger" size="mini"   @click="showaddDialog(scope.$index,scope.row)" >退回</el-button>
                    </div>
                     <div  v-else-if="scope.row.status_temp===1">
                      <el-tag type="success"  size="mini">已通過</el-tag>
                    </div>
                   <div  v-else>
                     <el-tag  type="danger" size="mini"  >已退回</el-tag>

                    </div>
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

    <!-- 不過說明 -->
    <el-dialog title="說明" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed"  class="custom">
      <el-form :model="addForm"  ref="addFormRef" label-width="150px">
        <el-form-item label="請輸入不通過訊息">
           <el-input v-model="queryInfo.reason"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="reviewfail">確定</el-button>
      </span>
    </el-dialog>

        <!-- 通過說明 -->

    <el-dialog title="說明" :visible.sync="passDialogVisible" width="30%" @close="passDialogClosed" class="custom">
      <el-form :model="passForm"  ref="passFormRef" label-width="150px">
        <el-form-item label="請輸入通過訊息">
           <el-input v-model="queryInfo.reason"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="passDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="reviewpass">確定</el-button>
      </span>
    </el-dialog>
    </div>
</template>

<script>
import { withdrawlimit, reviwlimit } from '../../api/index.js'
export default {
  data () {
    return {
      searchlist: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: '',
        date: [],
        reason: ''
      },
      queryData: {},
      query: {},
      nameList: [

      ],

      withdrawlist: [
        {
          /* id: 4,
          uuid: 10185,
          username: '',
          levelType: 0,
          level: 2,
          limitday: 500000,
          formerLevel: 2,
          reason: '2020-01',
          cuser: 'cccc',
          verifier: '',
          status: 0 */
        }
      ],

      total: 0,
      realname: [],
      list: '',
      addDialogVisible: false,
      passDialogVisible: false,
      addForm: {},
      passForm: {},
      form: {},
      enable: [
        {
          label: '未開通',
          value: 0
        },
        {
          label: '通過',
          value: 1
        }
      ],
      isShow: true

    }
  },

  created () {
    this.getwdlimitList()
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
    async getwdlimitList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        /*   token: sessionStorage.getItem('token') */
        searchType: 1
      }
      await withdrawlimit(data).then(res => {
        this.withdrawlist = res.data
        /*  console.log('45478', this.withdrawlist)
        console.log('12245', data.token) */
        this.total = res.pagination.total_record
      })
    },

    showEditDialog (index, row) {
      this.editForm = row
      this.editDialogVisible = true
    },
    addDialogClosed () {
      this.addDialogVisible = false
    },
    passDialogClosed () {
      this.passDialogVisible = false
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getwdlimitList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getwdlimitList()
    },
    async Search () {
      this.queryInfo.pagenum = 1
      await this.getwdlimitList()
    },
    /*    showToggle () {
      let _this = this
      _this.isShow = !_this.isShow
      console.log('123456')
    }, */
    showpassDialog (index, row) {
      this.form = row
      this.passDialogVisible = true
      console.log('123', this.form)
    },
    /* 審核通過 */
    async reviewpass (index, row) {
    /*   this.form = row
      console.log('456', this.form) */
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        id: this.form.id,
        uuid: this.form.uuid,
        status: '1',
        reason: this.queryInfo.reason
      }
      await reviwlimit(data).then(res => {
        console.log('passdata', data)
        if (res.error_code === 0) {
          this.$message.success('審核成功')
        } else {
          this.$message.error('送出失敗')
        }
      })
      this.getwdlimitList()
      this.passDialogVisible = false
    },

    showaddDialog (index, row) {
      this.form = row
      this.addDialogVisible = true
      console.log('456')
    },

    /* 審核失敗 */
    async  reviewfail () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        id: this.form.id,
        uuid: this.form.uuid.toString(),
        status: '0',
        reason: this.queryInfo.reason
      }
      await reviwlimit(data).then(res => {
        console.log('faildata', data)
        if (res.error_code === 0) {
          this.$message.success('已退回')
        } else {
          this.$message.error('失敗,請輸入退回原因')
        }
      })
      this.getwdlimitList()
      this.addDialogVisible = false
    },
    tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color:#F2F2F2 ;color:#7B7B7B;font-size: 12px;'
      }
    }

  }
}
</script>

<style lang="less">
.custom .el-dialog__header {
background-color: #F2F2F2;

}
 .custom .el-dialog__title{
color: #7B7B7B;
font-weight:bold;

 }
</style>
