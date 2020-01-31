<template>
  <div>
    <TopBreadcrumb :titles="['實名認證', '實名認證']"></TopBreadcrumb>

    <el-card>
<!--       <p class="text">認證狀態:</p>
      <el-select v-model="enable.value" placeholder="請選擇">
    <el-option
      v-for="item in enable"
      :key="item.id"
      :label="item.label"
      :value="item.value"
    ></el-option>
</el-select>  &nbsp; -->
     <p class="text">Uid:</p>
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
      <el-button type="primary" @click="Search">搜尋</el-button>

      <el-table :data="nameList" stripe border>
        <el-table-column label="UID" prop="uuid"></el-table-column>
        <el-table-column label="使用者姓名" prop="username"></el-table-column>
         <el-table-column label="手機號碼" prop="mobile"></el-table-column>
        <el-table-column label="信箱" prop="email"></el-table-column>
        <el-table-column label="提交時間" prop="ctime"></el-table-column>
        <el-table-column label="狀態審核" >
          <template slot-scope="scope">

            <div  v-if="scope.row.auth_status === 0"><el-button  @click="jump(scope.$index, scope.row)" size="mini"  type="warm">未審核</el-button></div>
            <div  v-else-if="scope.row.auth_status === 1"><el-button  @click="jump(scope.$index, scope.row)" size="mini"  type="success">審核通過</el-button></div>
            <div  v-else><!-- <router-link  :to="{path:'/realnamepic',query:{uuid:`${scope.row.uuid}`}}" >啟用</router-link> -->
            <el-button  @click="jump(scope.$index, scope.row)" size="mini" type="danger">審核不通過</el-button>
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
  </div>
</template>

<script>
import { KycList } from '../../api/index.js'
export default {
  data () {
    return {
      searchlist: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: '',
        date: []
      },
      queryData: {},
      query: {},
      nameList: [],
      total: 0,
      realname: [],
      list: '',
      editDialogVisible: false,
      editForm: {},
      enable: [
        {
          label: '未開通',
          value: 0
        },
        {
          label: '通過',
          value: 1
        }
      ]

    }
  },
  created () {
    this.getnameList()
  },

  methods: {
    async getnameList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        searchValue: 'b',
        kycStartTime: this.queryInfo.date[0],
        kycEndTime: this.queryInfo.date[1],
        searchUuid: this.searchlist
      }
      await KycList(data).then(res => {
        this.nameList = res.data
        this.total = res.pagination.total_record
      })
    },

    showEditDialog (index, row) {
      this.editForm = row
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getnameList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getnameList()
    },
    jump (index, row) {
      let queryData = {}
      queryData = row
      this.$router.push({ path: '/realnamepic', query: queryData })
    },
    async Search () {
      this.queryInfo.pagenum = 1
      await this.getnameList()
    }
  }
}
</script>

<style lang="less" scoped>
.text {
  display: inline-block;
  margin: 0 5px;
  font-size: 12px;
}
</style>
