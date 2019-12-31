<template>
  <div>
    <TopBreadcrumb :titles="['CMS系統', 'Banner管理']"></TopBreadcrumb>

    <el-card>
      <el-button type="primary" icon="el-icon-circle-plus" @click="addbanner()">新增Banner</el-button>

      <!-- banner列表 -->
      <el-table :data="rightsList" stripe border>
        <el-table-column label="標題"></el-table-column>
        <el-table-column label="廣告圖片" prop="authName"></el-table-column>
        <el-table-column label="連結" prop="path"></el-table-column>
        <el-table-column label="類型" prop="level"></el-table-column>
        <el-table-column label="排序" prop="level"></el-table-column>
        <el-table-column label="語言" prop="level"></el-table-column>
        <el-table-column label="操作" prop="level"></el-table-column>
      </el-table>
    </el-card>

    <!-- 新增視窗 -->
    <div >
    <el-dialog :visible.sync="addshow" title="新增Banner" width="50%">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="30%"
        @close="addDialogClosed"
      >
        <el-form-item label="圖片標題" prop="imgtitle">
          <el-input v-model="addForm.imgtitle"></el-input>
        </el-form-item>
        <el-form-item label="語言" prop="languge">
          <el-checkbox-group v-model="addForm.languge">
            <el-checkbox label="简体中文" name="type"></el-checkbox>
            <el-checkbox label="繁體中文" name="type"></el-checkbox>
            <el-checkbox label="English" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="連結" prop="resource">
          <el-radio-group v-model="addForm.resource">
            <el-radio label="URL"></el-radio>
            <el-radio label="APP原生頁面"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="路徑類型" prop="url">
          <el-input v-model="addForm.url"></el-input>
        </el-form-item>
        <el-form-item label="類型" prop="type">
          <el-checkbox-group v-model="addForm.type">
            <el-checkbox label="Android" name="type"></el-checkbox>
            <el-checkbox label="Ios" name="type"></el-checkbox>
            <el-checkbox label="Web" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="addForm.sort"></el-input>
        </el-form-item>

        <el-form-item label="圖片:" style="font-family:18px">
            <el-upload
            action
            accept="image/jpeg, image/png"
            :on-change="onUploadChange"
            :before-remove="onUploadRemove"
            :auto-upload="false"
            :show-file-list="true"
            :file-list="fileList"
          >
          <el-input v-model="addForm.imgup" style="width:60%" placeholder="支持jpg/png" disabled>
          </el-input>

               <el-button size="small" type="primary">選擇圖片</el-button>

          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addshow = false">取 消</el-button>
        <!--  <el-button type="primary" @click="addUser">確定</el-button> -->
      </span>
    </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addshow: false,
      addForm: {
        imgtitle: '',
        languge: '',
        resource: '',
        url: '',
        type: '',
        sort: '',
        setBase64: '',
        imgup: ''
      },
      addFormRules: {
        imgtitle: [
          { required: true, message: '請輸入標題', trigger: 'blur' },
          { min: 3, max: 10, message: '長度在 3 到 10 個字元', trigger: 'blur' }
        ],
        resource: [{ required: true, trigger: 'blur' }],
        languge: [{ required: true, message: '請選擇語言', trigger: 'blur' }],
        url: [{ required: true, message: '請輸入路徑', trigger: 'blur' }],
        type: [{ required: true, trigger: 'blur' }],
        sort: [{ required: true, message: '請輸入排序', trigger: 'blur' }]

      }
    }
  },

  created () {},

  methods: {
    addbanner () {
      this.addshow = true
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    }
    /*    onUploadChange: async function (file) {
      const isIMAGE =
        file.raw.type === 'image/jpeg' || file.raw.type === 'image/png' // 判別格式
      const isLt1M = file.size / 1024 / 1024 < 500000 // 判別大小

      if (!isIMAGE) {
        this.$message.error('只能上傳jpg,png格式')
        return false
      }
      if (!isLt1M) {
        this.$message.error('上傳圖片大小不能大於5MB')
        return false
      }
      this.picBase64 = await setBase64(file) // 這邊將base64存入變數(setBase64()額外實作)
    },
    onUploadRemove: async function () {
      this.picBase64 = null
    } */
  }
}
</script>

<style scoped>
.el-form .el-form-item .el-input {
  width: 60%;
}
.test{
 display:flex;
}
</style>
