<template>
  <div>
    <TopBreadcrumb :titles="['CMS系統', '公告管理']"></TopBreadcrumb>

    <el-card>
      <el-input
        :placeholder="placeholder"
        :value="value"
        @input="handleInput"
        clearable
        @clear="handleSearch"
        @keyup.enter.native="search"
        style="width:30%"
      >
      </el-input>

      <el-date-picker
        type="daterange"
        start-placeholder="StartTime"
        end-placeholder="EndTime"
        v-model="queryInfo.date"
        value-format="yyyy-MM-dd"
        style="width:30% "
      ></el-date-picker>&nbsp;
      <el-button type="primary" @click="search()">搜尋</el-button>

      <el-button type="primary" icon="el-icon-circle-plus" @click="addindexmenu()">新增公告</el-button>

      <!-- 公告列表 -->
      <el-table :data="rightsList" stripe border>
        <el-table-column label="標題"></el-table-column>
        <el-table-column label="語言" prop="authName"></el-table-column>
        <el-table-column label="發佈時間" prop="path"></el-table-column>
        <el-table-column label="最新更新時間" prop="level"></el-table-column>
        <el-table-column label="操作" prop="level"></el-table-column>
      </el-table>
    </el-card>

    <!-- 新增公告視窗 -->
    <div>
      <el-dialog :visible.sync="addshow" title="新增公告" width="100%">
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="5%"
          @close="addDialogClosed"
        >
          <el-form-item label="標題" prop="imgtitle">
            <el-input v-model="addForm.imgtitle"></el-input>
          </el-form-item>
          <el-form-item label="語言" prop="languge">
            <el-checkbox-group v-model="addForm.languge">
              <el-checkbox label="简体中文" name="type"></el-checkbox>
              <el-checkbox label="繁體中文" name="type"></el-checkbox>
              <el-checkbox label="English" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <quill-editor ref="myTextEditor" v-model="content" :init="editorInit"></quill-editor>
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
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  data () {
    return {
      queryInfo: {
        date: ''
      },
      content: '',
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
      },
      components: {
        quillEditor
      },
      editorInit: {
        language_url: '/static/tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/static/tinymce/skins/lightgray',
        height: 300
      }
    }
  },

  created () {},

  methods: {
    async search () {
      this.queryInfo.pagenum = 1
      await this.getDwaList()
    },
    addindexmenu () {
      this.addshow = true
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    }
  }
}
</script>

<style scoped>
.el-form .el-form-item .el-input {
  width: 60%;
}
.test {
  display: flex;
}
</style>
