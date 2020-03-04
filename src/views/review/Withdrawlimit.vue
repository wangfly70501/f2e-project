<template>
  <div>
    <TopBreadcrumb :titles="['實名認證', '實名認證']"></TopBreadcrumb>

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
      <el-button type="primary" @click="Search">搜尋</el-button>-->
      <el-table :data="withdrawlist" stripe border>
        <el-table-column label="UUID/姓名">
          <template slot-scope="scope">
            <router-link
              :to="{path:'/member'}"
              target="_blank"
            >{{scope.row.uuid }}/ {{scope.row.name }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="調整提領上限/期限">
          <template slot-scope="scope">
            <div v-if="scope.row.state===0">{{scope.row.limit |NumFormat }}/永久</div>
            <div v-else>{{scope.row.limit |NumFormat }}/ 臨時</div>
          </template>
        </el-table-column>

        <el-table-column label="調整原因" prop="reason"></el-table-column>
        <el-table-column label="時間">
          <template slot-scope="scope">{{scope.row.time |dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作者" prop="user"></el-table-column>
        <el-table-column label="審核">
          <el-button type="success" size="mini" v-show="isShow">通過</el-button>
          <el-button type="danger" size="mini" @click="showToggle" v-show="isShow">退回</el-button>

          <!-- 隱藏组件點擊顯示 -->
          <el-input
            placeholder="退回原因(15字以內)"
            v-model="queryInfo.reason"
            @click="showToggle"
            :disabled="isdisabledFn"
          ></el-input>
          <el-button type="info" size="mini"  :disabled="isdisabledFn">退回</el-button>
          <!--   <el-button  type="danger" @click="addjump" size="mini"    v-show="!isShow">退回</el-button>
          -->
        </el-table-column>
        <el-table-column label="時間"></el-table-column>
      </el-table>
      <el-button
        icon="el-icon-edit"
        type="primary"
        size="mini"
        style="float:right"
        v-show="isShow"
        @click="showToggle"
      ></el-button>
      <el-button type="primary" size="mini" style="float:right" v-show="!isShow">儲存</el-button>
      <el-button
        type="primary"
        size="mini"
        style="float:right"
        @click="showToggle"
        v-show="!isShow"
        plain
      >取消</el-button>
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
        date: [],
        reason: '',
        isDisabl: true
      },
      queryData: {},
      query: {},
      nameList: [

      ],

      withdrawlist: [{
        uuid: 10180,
        name: 'test',
        limit: 15000000,
        state: 1,
        reason: '123456789721264578',
        time: '2020-03-04',
        user: 'admin'
      }
      ],

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
      ],
      isShow: true

    }
  },

  created () {
    this.getnameList()
   this.isdisabledFn() {
        if(后台传过来的数据!=null){
        return this.isdisabled=false;
        }else{
          return this.isdisabled=true;
          }
    }
  },
  methods: {
    async getnameList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,

        kycStartTime: this.queryInfo.date[0],
        kycEndTime: this.queryInfo.date[1],
        searchUuid: this.searchlist
      }
      await KycList(data).then(res => {
        this.nameList = res.data
        console.log(this.nameList)
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
    },
    showToggle () {
      this.isShow = !this.isShow
      console.log('123456')
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
