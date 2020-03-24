<template>
  <div>
    <TopBreadcrumb :titles="['鎖倉列表', '鎖倉參加者列表']"></TopBreadcrumb>

    <el-card class="aligned">

      <!-- 列表 -->
      <p class="acmemtitle">123456 <font-awesome-icon  icon="times" size="lg"  @click="uppage" style="float:right"/></p>
     <div >
        <el-input
          v-model="searchlist"
          @keyup.enter.native="Search"
          style="width:50%"
          placeholder="請輸入UUID"
          size="mini"
        ></el-input>&nbsp;
        <el-button type="primary" @click="Search"  size="mini">搜尋</el-button>
      </div>
      <el-table :data="BehaviorJoin" >
        <el-table-column label="UUID" prop="uuid" ></el-table-column>
        <el-table-column label="派獎時間" prop="ctime" >
              <template slot-scope="scope">
           {{scope.row.ctime|dateFormat}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

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
    font-size: 18px;
    line-height: 30px;
    padding: 10px 15px;
}
.aligned{
    margin: 0 auto;
    width: 500px;
}
</style>
