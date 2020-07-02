<template>
  <el-card>
    <h1>Welcome</h1>
  </el-card>
</template>

<script>
export default {
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
    }
  }
}
</script>

<style scoped>
.el-card{
  text-align: center;
  height: 100%;
  font-size: 50px;
}
</style>
