<template>
  <div>
    <TopBreadcrumb :titles="['鎖倉列表', '鎖倉參加者列表']"></TopBreadcrumb>

    <el-card>
      <el-button  @click="uppage">上一頁</el-button>
      <!-- 列表 -->
      <el-table :data="ActivityJoinlist" stripe border>
        <el-table-column label="Uuid" prop="uuid" ></el-table-column>
          <el-table-column label="幣種"  >
          <template slot-scope="scope">
            <div
              v-for="item in currencyList"
              :key="item.id"
              :label="item.currency"
              :value="item.id"
            >
              <div v-if="item.id==scope.row.currency">{{item.currency}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="參加金額" prop="quota"></el-table-column>
       <!--      <el-table-column label="狀態" >
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.active === 0">棄用</el-tag>
            <el-tag type="success" v-else>啟用</el-tag>
          </template>
        </el-table-column> -->
       <el-table-column label="反息狀態">
         <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.export === 0">尚未返息</el-tag>
            <el-tag type="success" v-else>已返息</el-tag>
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
import { getActivityJoin, currencyList } from '../../api/index.js'

export default {
  data () {
    return {
      currencyList: [],
      content: '',
      html: '',
      configs: {},
      searchlist: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: '',
        date: []

      },
      editorOption: {
        placeholder: '開始編輯'
      },
      date: [],
      ActivityJoinlist: [],

      total: 0, // 总用户数
      delDialogVisible: false,
      addDialogVisible: false,
      addForm: {
        lang: []
      },

      editDialogVisible: false,
      table: {},
      editForm: {
        lang: []
      }

    }
  },
  /*   components: {
    mavonEditor
  }, */
  created () {
    this.getActivityJoin()
    this.objList()
    this.getCurrencyList()
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
    async getActivityJoin () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        /*  activityType: this.$route.query.type, */
        activityId: this.$route.query.id
      /*   exportStatus: '0' */
      /* searchUuid: */
      }
      await getActivityJoin(data).then(res => {
        this.ActivityJoinlist = res.data

        this.total = res.pagination.total_record
      })
    },

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getFaqList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getFaqList()
    },

    uppage () {
      this.$router.push('/lockup')
    },
    async getCurrencyList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')
      }
      await currencyList(data).then(res => {
        this.currencyList = res.data
        console.log(this.currencyList)
      })
    }
  }
}
</script>

<style>
</style>
