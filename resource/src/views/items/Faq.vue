<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', 'FaQ']"></TopBreadcrumb>

    <el-card>
      <!-- 搜索工具 -->

        <el-input v-model="searchlist" @keyup.enter.native="Search" style="width:10%" placeholder="請輸入標題" size="small"></el-input>&nbsp;
        <el-date-picker
          type="daterange"
          start-placeholder="StartTime"
          end-placeholder="EndTime"
          v-model="queryInfo.date"
          value-format="yyyy-MM-dd"
          style="width:15%"
          size="small"
        ></el-date-picker>&nbsp;
                        <el-select  v-model="enable.value" placeholder="請選擇語系"
                         style="width:8% " size="small">
                            <el-option
                                v-for="(enableValue,index) in enable"
                                :key="index"
                                v-bind:label="enableValue.label"
                                v-bind:value="enableValue.value"
                            >{{enableValue.label}}</el-option>
                        </el-select>&nbsp;
                         <el-button type="primary" @click="clear" size="small">清除</el-button>
        <el-button type="primary" @click="Search" size="small">搜尋</el-button>
        <el-button type="primary" @click="addjump" size="small">新增</el-button>

<!--                <el-upload
                class="upload-demo"
                action="string"
                :auto-upload="false"
                :limit="1"
                ref="upload"
                :http-request="addBanner"
                name="publicPic"
                multiple
              >
                <el-button size="small" type="primary">點擊上傳</el-button>
              </el-upload>
              <el-button type="primary" @click="addBanner">確定</el-button> -->

      <!-- 列表 -->
      <el-table :data="faqlist" stripe border>
        <!-- <el-table-column
      type="selection"
      width="40px">
    </el-table-column>
        <el-table-column label="ID" prop="id" width="40px"></el-table-column> -->
        <el-table-column label="標題" prop="title" ></el-table-column>
        <!-- <el-table-column label="內容" prop="content"></el-table-column> -->
        <el-table-column label="發布時間" prop="ctime"></el-table-column>
        <el-table-column label="語系" prop="lang">
          <template slot-scope="scope">
            <span   v-if="scope.row.lang ==='el_GR'">繁體中文</span>
            <span   v-else-if="scope.row.lang ==='zh_CN'">简体中文</span>
            <span   v-else>Engilsh</span>
          </template>

        </el-table-column>
            <el-table-column label="狀態" >
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.status === 0">棄用</el-tag>
            <el-tag type="success" v-else>啟用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.$index, scope.row)"
            >編輯</el-button>
            <!--     <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserById(scope.row.id)"
            ></el-button>-->
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

    <!--修改設置 -->
    <el-dialog
      title="修改FAQ"
      :visible.sync="editDialogVisible"
      width="60%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" ref="editFormRef" label-width="100px">
             <el-form-item label="標題">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="語系">
    <el-radio-group v-model="editForm.lang">
      <el-radio label="el_GR">繁體中文</el-radio>
      <el-radio label="zh_CN">简体中文</el-radio>
      <el-radio label="en_US">Engilsh</el-radio>
    </el-radio-group>
  </el-form-item>
             <el-form-item label="狀態">
           <el-switch
              v-model="editForm.status"
              active-color="#13ce66"
              inactive-color="#BEBEBE"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
        </el-form-item>
       <el-form-item label="內容">
  <yimo-vue-editor v-model="editForm.content"> </yimo-vue-editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { faqdata, faqedit, uploadban } from '../../api/index.js'
import YimoVueEditor from 'yimo-vue-editor'

export default {
  components: {
    YimoVueEditor
  },
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

      date: [],
      faqlist: [],
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
    this.getFaqList()
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
    async getFaqList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum,
        searchValue: this.searchlist,
        starttime: this.queryInfo.date[0],
        endtime: this.queryInfo.date[1],
        langSearch: this.enable.value
      }
      await faqdata(data).then(res => {
        this.faqlist = res.data
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

    showEditDialog (index, row) {
      this.editForm = row
      this.editDialogVisible = true
      console.log('123', this.editForm)
      this.getFaqList()
    },

    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },

    async saveEdit () {
      this.editDialogVisible = false
      var data = {
        id: this.editForm.id,
        title: this.editForm.title,
        content: this.editForm.content,
        lang: this.editForm.lang,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        status: this.editForm.status.toString()
      }
      await faqedit(data).then(res => {
        console.log('456', data)
        if (res.error_code === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失敗')
        }
        this.getFaqList()
      })
    },

    async Search () {
      this.queryInfo.pagenum = 1
      await this.getFaqList()
    },
    async clear () {
      this.queryInfo.date = ''
      this.searchlist = ''
      this.enable.value = ''
    },
    addjump () {
      this.$router.push({ path: '/faqadd' })
    },
    // cms列表
    async piclist () {
      this.picDialogVisible = true
      this.queryInfo.pagenum = 1
      await this.getFaqList()
    },

    async  addBanner () {
      let _this = this
      let reader = new FileReader()
      reader.readAsDataURL(this.$refs.upload.uploadFiles[0].raw)
      console.log('123')
      var data = {
        mg_name: 'cccc',
        mg_pwd: '12345',
        mg_state: '1',
        title: 'faq圖片',
        lang: 'el_GR',
        type: '1',
        classify: '3',
        sort: '3'
      }
      reader.onload = function (e) {
        var imgFile = e.target.result
        data.publicPic = imgFile
        console.log('123', data)
        uploadban(data).then(res => {
          if (res.error_code === 0) {
            _this.$alert('', '新增成功', {
              confirmButtonText: 'OK',
              callback: action => {
                _this.$message({
                  type: 'success',
                  message: '新增成功'
                })
              }
            })
          } else {
            _this.$message.error('格式不符，新增失敗')
          }
        })
      }
    }

  }
}
</script>

<style>
</style>
