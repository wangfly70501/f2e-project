 <template>
  <div>
    <TopBreadcrumb :titles="['FAQ管理', '新增FAQ']"></TopBreadcrumb>

    <el-card>
      <p>新增FAQ</p>

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
        <el-form-item label="內容" prop="addtitle">
  <yimo-vue-editor v-model="addForm.addcontent"> </yimo-vue-editor>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
            <div style="text-align:center">
        <el-button @click="uppage">取 消</el-button>
        <el-button type="primary" @click="addFaq">確定</el-button>
            </div>
    </el-card>
  </div>
</template>

<script>
import { faqadd } from '../../api/index.js'
import YimoVueEditor from 'yimo-vue-editor'

export default {
  components: {
    YimoVueEditor
  },
  data () {
    return {
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

      addForm: {},
      realname: {}

    }
  },
  created () {
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
    async addFaq () {
      this.addDialogVisible = false
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
          this.$message.error('新增失敗')
        }
        this.$router.push('/faq')
      })
    },
    uppage () {
      this.$router.push('/faq')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
