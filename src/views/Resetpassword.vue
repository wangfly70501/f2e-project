<template>
  <div class="login-container">
          <div class="avatar-box">
        <img src="../assets/btcbox_icon.jpg" />
      </div>
    <div class="login-box">
        <div class="text">重設帳號</div>
        <el-form
        ref="checkForm"
        :model="checkForm"
        :rules="rules"
        label-width="0"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="checkForm.username"

            placeholder="帳號"
            @keyup.enter.native="confirm"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="checkForm.email"

            placeholder="信箱"
            @keyup.enter.native="confirm"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="checkForm.password"
            type="password"
            placeholder="密碼"
            @keyup.enter.native="confirm"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkpwd">
          <el-input
            v-model="checkForm.checkpsw"
            type="password"
            placeholder="確認密碼"
            @keyup.enter.native="confirm"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="info" @click="signin">上一頁</el-button>
          <el-button type="info" @click="reset">清除</el-button>
          <el-button type="primary" @click="confirm">確認</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { resetpsw } from '../api/index.js'

export default {
  data () {
    return {
      activeName: 'signin',
      data: '',
      checkForm: {
        username: '',
        email: '',
        checkpsw: '',
        password: ''
      },
      signupForm: {
        username: '',
        password: '',
        checkpass: '',
        mobile: '',
        email: ''
      },
      rules: {
        username: [
          { required: true, message: '請輸入帳號', trigger: 'blur' },
          { min: 3, max: 10, message: '長度在 3 到 10 個字元', trigger: 'blur' }
        ],
        password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }],
        checkpwd: [{ required: true, message: '請確認密碼', trigger: 'blur' }],
        email: [
          { required: true, message: '請輸入信箱', trigger: 'blur' },
          {
            type: 'email', // 要检验的类型（number，email，date等）
            message: '請輸入正確的信箱',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    async confirm () {
      let data = {
        mg_name: this.checkForm.username,
        mg_email: this.checkForm.email,
        mg_pwd: this.checkForm.password,
        check_pwd: this.checkForm.checkpsw
      }

      await resetpsw(data).then(res => {
        if (res.error_code !== 0) {
          return this.$message.error('失敗，請重新確認')
        } else if (res.error_code === 0) {
          this.data = res.data.mg_state

          // 登陆成功，保存token到sessionStorage，并跳转到首页
          this.$message.success('重設成功')
          this.$router.push('/login')
        }
      })
    },
    signin () {
      this.$router.push('/forgetpsw')
    },

    reset () {
      this.$refs.checkForm.resetFields()
    }

  }
}
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Noto+Sans+TC&display=swap");
</style>
<style lang="less" scoped>

.text {
  font-size: 24px;
  color: #5b5b5b;
  text-align: center;
  font-family: "Noto Sans TC", sans-serif;
}
.login-container {
  height: 100%;
  background: #2b4b6b;
}

.login-box {
  background: white;
  border-radius: 4px;
  width: 450px;
  height: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.avatar-box {
  height: 130px;
  width: 130px;
  background: white;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  top:150px;
  left: 50%;
  transform: translate(-50%, -50%);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login-form {

  padding: 50px 20px;

  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
