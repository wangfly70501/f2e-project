<template>
  <div>
    <TopBreadcrumb :titles="['權限管理', '權限列表']"></TopBreadcrumb>

    <el-card>
      <!-- 权限列表 -->
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="權限名稱" prop="authName"></el-table-column>
        <el-table-column label="路徑" prop="path"></el-table-column>
        <el-table-column label="權限等級" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '1'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '2'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },

  created () {
    this.getrightsList()
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
    // 获取所有的权限
    async getrightsList () {
      const { data: res } = await this.$http.get('rights/list')

      if (res.meta.status !== 200) {
        return this.$message.error('獲取權限列表失敗！')
      }

      this.rightsList = res.data
    }
  }
}
</script>

<style>
</style>
