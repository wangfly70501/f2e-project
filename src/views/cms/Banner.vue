<template>
  <div>
    <TopBreadcrumb :titles="['CMS系統', 'banner管理']"></TopBreadcrumb>
    <el-button type="info" @click="addDialogVisible = true" class="el-icon-plus" size="min">新增</el-button>&nbsp;
          <!-- 搜索工具 -->
                        <el-select  v-model="enable.value" placeholder="請選擇語系"  clearable
                         style="width:10% ">
                            <el-option
                                v-for="(enableValue,index) in enable"
                                :key="index"
                                v-bind:label="enableValue.label"
                                v-bind:value="enableValue.value"
                            >{{enableValue.label}}</el-option>
                        </el-select>&nbsp;
                         <el-button type="primary" @click="clear">清除</el-button>
        <el-button type="primary" @click="Search">搜尋</el-button>
    <el-card>
      <!-- 列表 -->
      <el-table :data="bannerList" stripe border>
        <el-table-column label="ID" prop="id" width="50px"></el-table-column>
        <el-table-column label="標題" prop="title"></el-table-column>
        <el-table-column label="廣告圖片">
          <template slot-scope="scope">
            <img :src="scope.row.imageURL"  class="imgwidth"/>
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
            <span v-if="scope.row.lang ==='el_GR'">繁體中文</span>
            <span v-else-if="scope.row.lang ==='zh_CN'">简体中文</span>
            <span v-else>Engilsh</span>
          </template>
        </el-table-column>
        <el-table-column label="位置" prop="classify">
          <template slot-scope="scope">
            <span v-if="scope.row.classify ===1">BANNER</span>
             <span v-else-if="scope.row.classify ===2">FOOTER</span>
            <span v-else>FaQ</span>
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
      <!-- 新增 -->
      <el-dialog title="新增" :visible.sync="addDialogVisible" width="80%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
          <el-form-item label="標題:" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="類型:" prop="type">
            <el-radio-group v-model="addForm.type">
              <el-radio label="1">WEB</el-radio>
              <el-radio label="2">APP</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="圖片位置:" prop="classify">
            <el-radio-group v-model="addForm.classify">
              <el-radio label="1">BANNER</el-radio>
              <el-radio label="2">FOOTER</el-radio>
              <el-radio label="3">FaQ</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="語系:" prop="lang">
            <el-radio-group v-model="addForm.lang">
              <el-radio label="el_GR">繁體中文</el-radio>
              <el-radio label="zh_CN">简体中文</el-radio>
              <el-radio label="en_US">Engilsh</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序:" prop="sort">
            <el-input-number v-model="addForm.sort"  :min="1" :max="5" label="描述文字"></el-input-number>
          </el-form-item>

          <el-form-item label="上傳圖片:" prop="publicPic">
            <template>
              <el-upload
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
      <el-dialog title="編輯" :visible.sync="editDialogVisible" width="70%" @close="editDialogClosed">
        <el-form :model="editForm" ref="editForm" label-width="100px" :rules="rules">
          <el-form-item label="標題" prop="title">
            <el-input v-model="editForm.title"></el-input>
          </el-form-item>
          <el-form-item label="類型:" prop="type">
            <el-radio-group v-model="editForm.type">
              <el-radio :label="1">WEB</el-radio>
              <el-radio :label="2">APP</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="圖片位置:" prop="classify">
            <el-radio-group v-model="editForm.classify">
              <el-radio :label="1">BANNER</el-radio>
              <el-radio :label="2">FOOTER</el-radio>
               <el-radio :label="3">FaQ</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="語系:" prop="lang">
            <el-radio-group v-model="editForm.lang">
              <el-radio label="el_GR">繁體中文</el-radio>
              <el-radio label="zh_CN">简体中文</el-radio>
              <el-radio label="en_US">Engilsh</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序:" prop="sort">
            <el-input-number v-model="editForm.sort" :min="1" :max="5" label="描述文字"></el-input-number>
          </el-form-item>
          <!--      <el-form-item label="廣告圖片" >
          <template slot-scope="scope">
            <img :src="scope.row.image" style="max-width:50%" />
          </template>
          </el-form-item>-->
          <el-form-item label="廣告圖片:" >
            <img :src="editForm.imageURL" style="max-width:100%" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">確定</el-button>
        </span>
      </el-dialog>
      <!--刪除 -->
      <el-dialog :visible.sync="delDialogVisible" width="20%" @close="delDialogClosed">
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
      fileList: [],
      name: 'upload',
      queryInfo: {
        pagenum: 1,
        pagesize: 10,
        date: []
      },

      bannerList: [],
      total: 0,

      editForm: {},
      addForm: {
        title: '',
        type: '',
        lang: '',
        classify: '',
        sort: ''
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
      ],

      editDialogVisible: false,
      addDialogVisible: false,
      delDialogVisible: false,
      formData: [],
      rules: {
        title: [
          { required: true, trigger: 'blur' }
        ],
        type: [
          { required: true, trigger: 'blur' }
        ],
        lang: [
          { required: true, trigger: 'blur' }
        ],
        classify: [
          { required: true, trigger: 'blur' }
        ],
        sort: [
          { required: true, trigger: 'blur' }
        ],
        publicPic: [
          { required: true, trigger: 'blur' }
        ]
      }
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
        page: this.queryInfo.pagenum,
        type: '',
        lang: this.enable.value,
        classify: ''
      }
      await getcmslist(data).then(res => {
        this.bannerList = res.data
        this.total = res.pagination.total_record
        console.log('12323', this.bannerList)
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
    async  addBanner () {
      let _this = this
      this.addDialogVisible = false
      let reader = new FileReader()
      reader.readAsDataURL(this.$refs.upload.uploadFiles[0].raw)

      var data = {
        mg_name: localStorage.getItem('mg_name'),
        mg_pwd: localStorage.getItem('mg_pwd'),
        mg_state: localStorage.getItem('mg_state'),
        title: this.addForm.title,
        lang: this.addForm.lang,
        type: this.addForm.type.toString(),
        classify: this.addForm.classify.toString(),
        sort: this.addForm.sort
      }
      reader.onload = function (e) {
        var imgFile = e.target.result
        data.publicPic = imgFile
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
            _this.getbannerList()
          } else {
            _this.$message.error('格式不符，新增失敗')
          }
        })
      }
    },

    onChangeFileFun (obj) {
      this.uploadName = obj.name
      this[`${this.uploadName}Loading`] = true
    },

    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
    },
    async clear () {
      this.enable.value = ''
    },
    async Search () {
      this.queryInfo.pagenum = 1
      this.getbannerList()
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
.deltxt {
  text-align: center;
  font-family: "Noto Sans TC", sans-serif;
  font-size: 24px;
}
.imgwidth{
   max-width:60%;
   margin:  auto;
  display: block;
}
</style>
