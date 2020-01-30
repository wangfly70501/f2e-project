<template>
  <div>
    <TopBreadcrumb :titles="['實名認證', '認證審核']"></TopBreadcrumb>

    <el-card>
      <p>認證信息</p>

  <!--      <el-table-column label="時間">
                                <template slot-scope="scope">
                                    <i class="el-icon-time"></i>
                                    <span style="margin-left: 10px">{{ scope.row.txdate }}</span>
                                </template>
                            </el-table-column -->

      <el-table :data="nameList" stripe border >
        <el-table-column label="UID" >
              <template>
                 {{ this.$route.query.uuid }}
              </template>
        </el-table-column>
          <el-table-column label="使用者姓名" >
              <template >
                {{ this.$route.query.uuid }}
              </template>
        </el-table-column>
          <el-table-column label="手機號碼" >
              <template >
            {{ this.$route.query.uuid }}
              </template>
        </el-table-column>
          <el-table-column label="信箱" >
              <template>
               {{this.$route.query.uuid }}
              </template>
        </el-table-column>
          <el-table-column label="提交時間" >
              <template >
                {{ this.$route.query.uuid }}
              </template>
        </el-table-column>
     <!--     <el-table-column label="證件類型" prop="certificate_type">
          <template slot-scope="scope">
            <div v-if="scope.row.certificate_type === 1">身分證</div>
             <div  v-else-if="scope.row.certificate_type === 2">護照</div>
            <div  v-else> 居留證</div>
          </template>
        </el-table-column> -->

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

  <!--     <el-dialog
        title="基本信息"
        :visible.sync="editDialogVisible"
        width="50%"
      >
        <el-form ref="editFormRef" label-width="155px">
          <el-form-item label="姓名">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="國家或地區">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="證件類型">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="證件號碼">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="身分證正面照片">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="身分證反面照片">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="手寫姓名和身分證照片">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input placeholder="如果審核不通過，請填寫打回理由，理由將透過實名認證頁面發送給客戶"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">打 回</el-button>
          <el-button type="primary">審核通過</el-button>
        </span>
      </el-dialog> -->
    </el-card>
  </div>
</template>

<script>
import { KycList } from '../../api/index.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        enable: '',
        date: []
      },
      queryData: {},
      total: 0,
      form: {
        username: ''
      },
      searchlist: '',
      /*  editDialogVisible: false, */
      editForm: {},
      realname: {},
      enable: [
        {
          label: 'zh',
          value: 'zh'
        },
        {
          label: 'en',
          value: 'en'
        }
      ],
      nameList: [ ]
      /*       nameList: [
        {
          uuid: 10025,
          auth_status: 0,
          email: 'ekko@btcbox.com.tw',
          mobile: '0900123123',
          ctime: '2020-01-08 11:26:31',
          username: 'ekko',
          certificate_type: 2,
          first_photo: 'https://images.app.goo.gl/Yc5hbJ6kJsm9Yb4A6',
          second_photo: 'https://images.app.goo.gl/A6JYRZSJYwXfnEubA',
          third_photo: 'https://images.app.goo.gl/rKPEbJxV5Pv3HupM7'
        }
      ] */
    }
  },
  created () {
    this.getnameList()
    console.log('123', this.$route.query)
  },

  methods: {
    async getnameList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        searchValue: this.searchlist,
        kycStartTime: this.queryInfo.date[0],
        kycEndTime: this.queryInfo.date[1],
        searchUuid: ''
      }
      await KycList(data).then(res => {
        console.log(res)
        console.log(res.data)
        this.nameList = res.data
        this.total = res.pagination.total_record
      })
    },
    ttt () {

    },
    /*    showEditDialog (index, row) {
      this.editForm = row
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    }, */
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getFaqList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getFaqList()
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
