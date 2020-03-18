<template>
  <div>

    <el-card>
      <el-button  @click="uppage" size="mini">儲存</el-button>

    </el-card>

  </div>
</template>

<script>
import { getActivityJoin } from '../../api/index.js'

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
        activityType: this.$route.query.type,
        activityId: this.$route.query.id,
        exportStatus: '0'
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
    }
  }
}
</script>

<style>
</style>
