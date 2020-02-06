<template>
  <div>
    <TopBreadcrumb :titles="['CMS系統', 'Banner管理']"></TopBreadcrumb>
    <el-button type="info" @click="addDialogVisible = true" class="el-icon-plus" size="min">新增</el-button>
    <el-card>
      <!-- 列表 -->
      <el-table :data="bannerList" stripe border  >
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="標題" prop="title"></el-table-column>
        <el-table-column label="廣告圖片" >
          <template slot-scope="scope">
            <img :src="scope.row.imageURL" style="max-width:50%" />
          </template>
        </el-table-column>
        <el-table-column label="類型" prop="type">
                <template slot-scope="scope">
            <div v-if="scope.row.type === 1">WEB</div>
            <div v-else>APP</div>
          </template>
        </el-table-column>
        <el-table-column label="語系" prop="lang">
                  <template slot-scope="scope">
            <span   v-if="scope.row.lang ==='el_GR'">繁體中文</span>
            <span   v-else-if="scope.row.lang ==='zh_CN'">简体中文</span>
            <span   v-else>Engilsh</span>
          </template>
        </el-table-column>
        <el-table-column label="位置" prop="classify">
                    <template slot-scope="scope">
            <span   v-if="scope.row.classify ===1">BANNER</span>

            <span   v-else>FOOTER</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
               <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.$index, scope.row)"
            >編輯</el-button>
                <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserById(scope.$index, scope.row)"
            >刪除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 新增 -->
      <el-dialog title="新增" :visible.sync="addDialogVisible" width="80%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px">
          <el-form-item label="標題:">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="類型:">
            <el-radio-group v-model="addForm.type">
              <el-radio label="1">WEB</el-radio>
              <el-radio label="2">APP</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="圖片位置:">
            <el-radio-group v-model="addForm.classify">
              <el-radio label="1">BANNER</el-radio>
              <el-radio label="2">FOOTER</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="語系:">
            <el-radio-group v-model="addForm.lang">
              <el-radio label="el_GR">繁體中文</el-radio>
              <el-radio label="zh_CN">简体中文</el-radio>
              <el-radio label="en_US">Engilsh</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序:">
            <el-input v-model="addForm.sort"></el-input>
          </el-form-item>

          <el-form-item label="上傳圖片:">
             <template>
     <!--     <el-upload

                list-type="picture-card"
                action="string"
                accept="image/jpeg,image/gif,image/png"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :auto-upload="false"
                :http-request="addBanner"
                ref="upload"
              >
                <i class="el-icon-plus"></i> -->
              <!-- </el-upload>  -->
                      <el-upload
          class="upload-demo"
          action="string"
          :auto-upload="false"
          :limit="1"
          ref="upload"
          :http-request="addBanner"
          multiple>
         <el-button size="small" type="primary">點擊上傳</el-button>
        </el-upload>

            </template>

          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addBanner">確定</el-button>
        </span>
      </el-dialog>
   <!--修改設置 -->
    <el-dialog
      title="編輯"
      :visible.sync="editDialogVisible"
      width="60%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" ref="editForm" label-width="100px">
             <el-form-item label="標題">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
         <el-form-item label="類型:">
            <el-radio-group v-model="editForm.type">
              <el-radio :label='1'>WEB</el-radio>
              <el-radio :label='2'>APP</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="圖片位置:">
            <el-radio-group v-model="editForm.classify">
              <el-radio :label="1">BANNER</el-radio>
              <el-radio :label="2">FOOTER</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="語系:">
            <el-radio-group v-model="editForm.lang">
              <el-radio label="el_GR">繁體中文</el-radio>
              <el-radio label="zh_CN">简体中文</el-radio>
              <el-radio label="en_US">Engilsh</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序:">
            <el-input v-model="editForm.sort"></el-input>
          </el-form-item>
     <!--      <el-form-item label="廣告圖片" >
          <template slot-scope="scope">
            <img :src="scope.row.image" style="max-width:50%" />
          </template>
        </el-form-item> -->
         <el-form-item label="廣告圖片:">

            <img :src="editForm.imageURL" style="max-width:50%" />

          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">確定</el-button>
      </span>
    </el-dialog>
     <!--刪除 -->
<el-dialog
      title="刪除"
      :visible.sync="delDialogVisible"
      width="30%"
      @close="delDialogClosed"
    >
    <p class="deltxt">確定刪除?</p>
     <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savedel">確定</el-button>
      </span>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getcmslist, editban, delban, uploadban } from '../../api/index.js'

export default {
  data () {
    return {

      name: 'upload',
      queryInfo: {
        pagenum: 1,
        pagesize: 10,
        date: []

      },

      bannerList: [],
      total: 0,

      editForm: {},
      addForm: {},
      addFormRules: {},
      editDialogVisible: false,
      addDialogVisible: false,
      delDialogVisible: false,
      formData: []
    }
  },
  /*   components: {
    OldUploadFile
  }, */
  created () {
    this.getbannerList()
  },

  methods: {
    async getbannerList () {
      let data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        paginate: this.queryInfo.pagesize,
        page: this.queryInfo.pagenum
        /* type: '2',
        lang: '',
        classify: '' */
      }
      await getcmslist(data).then(res => {
        this.bannerList = res.data
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

    /* 新增banner */
    addDialogClosed () {
      this.$refs.addForm.resetFields()
    },
    async addBanner () {
      this.addDialogVisible = false
      /*    let formData = new FormData()
      const file = this.$refs.upload.uploadFiles[0]
      formData.append('file', file.raw)
      formData.append('name', this.name) */
      console.log('refs', this.$refs.upload.uploadFiles[0].raw)
      var data = {
        title: this.addForm.title,
        lang: this.addForm.lang,
        type: this.addForm.type,
        publicPic: this.$refs.upload.uploadFiles[0].raw,
        classify: this.addForm.classify,
        sort: this.addForm.sort,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')
      }
      await uploadban(data).then(res => {
        if (res.error_code === '0') {
          this.$message.success('新增成功')
          this.$refs.addForm.resetFields()
        } else {
          this.$message.error('格式不符，新增失敗')
        }
        this.getbannerList()
      })
    },
    /*  addBanner () {
      this.addDialogVisible = false
      var formData = new FormData()

      formData.append('file', this.$refs.upload.files[0])
      console.log(this.$refs.upload.files[0])
      axios({

        method: 'post',

        url: 'http://192.168.50.105:7777/bankendapi?method=cmsUpload',

        title: this.addForm.title,
        lang: this.addForm.lang,
        type: this.addForm.type,
        publicPic: formData,
        classify: this.addForm.classify,
        sort: this.addForm.sort,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')

      }).then(function (res) {
        console.log(res)
      })
    },
 */
    onChangeFileFun (obj) {
      this.uploadName = obj.name
      this[`${this.uploadName}Loading`] = true
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    uploadUrl () {
      return '192.168.50.105:7777/bankendapi?method=cmsUpload'
    },
    showEditDialog (index, row) {
      this.editForm = row
      this.editDialogVisible = true

      this.getbannerList()
    },
    async saveEdit () {
      this.editDialogVisible = false

      var data = {
        id: this.editForm.id,
        image: this.editForm.image,
        lang: this.editForm.lang,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        title: this.editForm.title,
        type: this.editForm.type,
        classify: this.editForm.classify,
        sort: this.editForm.sort
      }
      await editban(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('格式不符，修改失敗')
        }
        this.getbannerList()
      })
    },
    editDialogClosed () {
      this.$refs.editForm.resetFields()
    },
    deleteUserById (index, row) {
      this.deldata = row
      this.delDialogVisible = true
      console.log('fqf', this.deldata)
      this.getbannerList()
    },
    async savedel () {
      this.delDialogVisible = false
      var data = {
        id: this.deldata.id,
        image: this.deldata.image,
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state')

      }
      await delban(data).then(res => {
        if (res.error_code === 0) {
          this.$message.success('刪除成功')
        } else {
          this.$message.error('刪除失敗')
        }
        this.getbannerList()
      })
    },
    delDialogClosed () {
      this.delDialogVisible = false
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
table,
th,
td {
  border: 1px solid #dddddd;
  border-collapse: collapse;
  padding: 10px;
}
.deltxt{
   text-align:center;
    font-family: 'Noto Sans TC', sans-serif;
    font-size: 24px;
}
</style>
