<template>
  <div>
    <TopBreadcrumb :titles="['項目管理', 'FaQ']"></TopBreadcrumb>

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
                        <el-select  v-model="enable.value" placeholder="請選擇語系"
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
        <el-button type="primary" @click="addDialogVisible = true">新增</el-button>

      </div>
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
        <el-table-column label="操作" width="180px">
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

    <!-- 新增 -->
    <el-dialog title="新增" :visible.sync="addDialogVisible" width="80%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px">
        <el-form-item label="標題" prop="addtitle">
          <el-input v-model="addForm.addtitle"></el-input>
            </el-form-item>
         <el-form-item label="語系" prop="lang">
    <el-radio-group v-model="addForm.lang">
      <el-radio label="el_GR">繁體中文</el-radio>
      <el-radio label="zh_CN">简体中文</el-radio>
      <el-radio label="en_US">Engilsh</el-radio>
    </el-radio-group>
  </el-form-item>

  <!--       <el-form-item label="內容" >
          <mavon-editor
            v-model="addForm.addcontent"
            ref="md"
            @imgAdd="$imgAdd"
            @change="change"
            style="min-height: 400px"
            placeholder="開始編輯"

          />
        </el-form-item> -->
               <el-form-item label="內容" prop="addtitle">

         <quill-editor
            v-model="addForm.addcontent"
            ref="myQuillEditor"
            :options="editorOption"

           >
        </quill-editor>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFaq">確定</el-button>
      </span>
    </el-dialog>

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

<!--         <el-form-item label="內容">

          <mavon-editor
          placeholder="開始編輯"

            @imgAdd="$imgAdd"
            @change="change"
            style="min-height: 400px"
            ref="md"
            v-model="editForm.content"

          />
        </el-form-item> -->
       <el-form-item label="內容">

         <quill-editor
            v-model="editForm.content"
            ref="myQuillEditor"
            :options="editorOption"
          >
        </quill-editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">確定</el-button>
      </span>
    </el-dialog>

          <!-- 刪除 -->
    <el-dialog  :visible.sync="delDialogVisible" width="30%" >
          <span>確定要刪除？刪除後資料無法復原</span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer" >
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Delete">確定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { faqdata, faqadd, faqedit } from '../../api/index.js'

import moment from 'moment'

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
      faqlist: [],

      total: 0, // 总用户数
      delDialogVisible: false,
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

      editDialogVisible: false,
      table: {},
      editForm: {
        lang: []
      },
      /*   <el-radio label="el_GR">繁體中文</el-radio>
      <el-radio label="zh_CN">简体中文</el-radio>
      <el-radio label="en_US">Engilsh</el-radio> */
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
      ],
      nowTime: moment(new Date()).format('YYYY-MM-DD'),
      nowTimeSubTract: moment(new Date())
        .subtract(7, 'days')
        .format('YYYY-MM-DD')
    }
  },
  /* components: {
     mavonEditor

  }, */
  created () {
    this.getFaqList()
  },

  methods: {

    $imgAdd (pos, $file) {
      var formdata = new FormData()
      formdata.append('file', $file)
      // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
      this.$axios({
        url: '/common/upload',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(url => {
        this.$refs.md.$img2Url(pos, url)
      })
    },
    change (value, render) {
      // render 为 markdown 解析后的结果
      this.html = render
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

    addDialogClosed () {
      this.$refs.addForm.resetFields()
    },

    showEditDialog (index, row) {
      this.editForm = row
      this.editDialogVisible = true
      this.getFaqList()
    },

    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },

    async saveEdit () {
      this.editDialogVisible = false
      /* this.editForm.addcontent = this.$refs.md.d_value */
      var data = {

        id: this.editForm.id,
        content: this.editForm.content,
        lang: this.editForm.lang,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        status: this.editForm.status.toString()
      }
      await faqedit(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('格式不符，修改失敗')
        }
        this.getFaqList()
      })
    },

    async addFaq () {
      this.addDialogVisible = false
      /*  this.addForm.addcontent = this.$refs.md.d_render */
      var data = {
        title: this.addForm.addtitle,
        content: this.addForm.addcontent,
        lang: this.addForm.lang,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')
      }
      await faqadd(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('新增成功')
          this.addForm.addtitle = ''
          this.addForm.addcontent = ''
          this.addForm.lang = ''
          this.$refs.addForm.resetFields()
        } else {
          this.$message.error('格式不符，新增失敗')
        }
        this.getFaqList()
      })
    },
    async Search () {
      this.queryInfo.pagenum = 1
      await this.getFaqList()
    },
    async Delete () {
      this.delDialogVisible = false

      this.queryInfo.pagenum = 1
      await this.getFaqList()
    },
    async clear () {
      this.queryInfo.date = null
      this.searchlist = null
      this.enable.value = null
    }

  }
}
</script>

<style>
</style>
