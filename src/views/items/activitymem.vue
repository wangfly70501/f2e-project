<template>
  <div>
    <TopBreadcrumb :titles="['活動列表', '活動參加者列表']"></TopBreadcrumb>

   <div class="aligned">

      <!-- 列表 -->
      <p class="acmemtitle"> {{this.$route.query.activity_name_GR}}    <font-awesome-icon  icon="times" size="lg"  @click="uppage" style="float:right"/></p>

     <div style="padding:20px">
        <el-input
          v-model="searchlist"
          @keyup.enter.native="Search"
          class="searchtool"
          placeholder="請輸入UUID"
          size="mini"
        ></el-input>&nbsp;
        <el-button type="primary" @click="Search"  size="mini">查尋</el-button>
      </div>
      <el-table :data="BehaviorJoin" style="padding:10px">
        <el-table-column label="UUID" prop="uuid" ></el-table-column>
        <el-table-column label="派獎時間" prop="ctime" >
              <template slot-scope="scope">
           {{scope.row.ctime|dateFormat}}
          </template>
        </el-table-column>
      </el-table>
     </div>

  </div>
</template>

<script>
import { getBehaviorJoin } from '../../api/index.js'

export default {
  data () {
    return {

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
      BehaviorJoin: [],

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
    this.getBehaviorJoin()
    this.objList()
    console.log('456789', this.$route.query)
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
    async getBehaviorJoin () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        behavior_id: this.$route.query.id,
        search_uuid: this.searchlist
      }
      await getBehaviorJoin(data).then(res => {
        this.BehaviorJoin = res.data
        console.log(this.BehaviorJoin)
      })
    },

    uppage () {
      this.$router.push('/activity')
    },
    async Search () {
      this.queryInfo.pagenum = 1
      this.getBehaviorJoin()
    }
  }
}
</script>

<style>
.acmemtitle{
    background-color:#02A7F0;
    color: white;
    height: 30px;
    font-size: 16px;
    line-height: 30px;
    padding: 10px 20px;
}
.aligned{
    margin: 0 auto;
    width: 600px;
     background-color:#FFFFFF;
}
.searchtool{
      width:50%;
      background-color:gray
}
</style>
