<template>
  <div class="login-container">
    <!--         <div class="avatar-box">
        <img src="../assets/btcbox_icon.jpg" />
    </div>-->
    <div class="login-box">
      <el-tabs v-model="activeName">
        <el-tab-pane label="登入" name="signin">
          <div class="text">
            歡迎登入
            <el-form
              ref="loginForm"
              :model="loginForm"
              :rules="rules"
              label-width="0"
              class="login-form"
            >
              <el-form-item prop="username">
                <el-input v-model="loginForm.username" placeholder="帳號" @keyup.enter.native="login"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="密碼"
                  @keyup.enter.native="login"
                ></el-input>
              </el-form-item>
              <el-form-item class="btns">
                <el-button type="primary" @click="login">登入</el-button>
                <el-button type="primary" @click="forgetpsw">忘記密碼</el-button>
                <el-button type="info" @click="reset(loginForm)">清除</el-button>
                <!--  <router-link to="/forgetpsw">忘記密碼</router-link> -->
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="註冊" name="signup">
          <div class="text">註冊</div>
          <el-form
            ref="signupForm"
            :model="signupForm"
            :rules="rules"
            label-width="0"
            class="login-form"
          >
            <el-form-item prop="username" label="帳號" label-width="20%">
              <el-input v-model="signupForm.username" placeholder="帳號" @keyup.enter.native="signup"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密碼" label-width="20%">
              <el-input
                v-model="signupForm.password"
                type="password"
                placeholder="密碼"
                @keyup.enter.native="signup"
              ></el-input>
            </el-form-item>

            <el-form-item prop="checkpass" label="確認密碼" label-width="20%">
              <el-input
                v-model="signupForm.checkpass"
                type="password"
                placeholder="確認密碼"
                @keyup.enter.native="signup"
              ></el-input>
            </el-form-item>
            <el-form-item prop="mobile" label="手機" label-width="20%">
              <el-input v-model="signupForm.mobile" placeholder="手機" @keyup.enter.native="signup"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="email" label-width="20%">
              <el-input v-model="signupForm.email" placeholder="email" @keyup.enter.native="signup"></el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary" @click="signup">註冊</el-button>
              <el-button type="info" @click="resetsignup">清除</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { login, signup } from '../api/index.js'

export default {
  data () {
    return {
      activeName: 'signin',
      data: '',
      loginForm: {
        username: '',
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
        checkpass: [{ required: true, message: '請確認密碼', trigger: 'blur' }],
        mobile: [
          { required: true, message: '請輸入手機', trigger: 'blur' },
          {
            required: true,
            type: Number,
            pattern: /^[0-9]{10}$/,
            message: '目前只支持台灣手機,共10碼',
            trigger: 'blur'
          }
        ],
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
    async login () {
      let data = {
        mg_name: this.loginForm.username,
        mg_pwd: this.loginForm.password
      }

      await login(data).then(res => {
        if (res.error_code !== 0) {
          return this.$message.error('登入失敗，請確認帳號密碼')
        } else if (res.error_code === 0) {
          this.data = res.data.mg_state
          localStorage.setItem('mg_name', this.loginForm.username)
          localStorage.setItem('mg_pwd', this.loginForm.password)
          localStorage.setItem('mg_state', this.data)

          // 登陆成功，保存token到sessionStorage，并跳转到首页
          this.$message.success(' 登入成功')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    },
    // 註冊
    async signup () {
      let data = {
        mg_name: this.signupForm.username,
        mg_pwd: this.signupForm.password,
        check_pwd: this.signupForm.checkpass,
        mg_mobile: this.signupForm.mobile,
        mg_email: this.signupForm.email
      }

      await signup(data).then(res => {
        if (res.error_code !== 0) {
          return this.$message.error('註冊失敗，請確認資料')
        } else {
          // 登陆成功，保存token到sessionStorage，并跳转到首页
          this.$message.success('註冊成功,請洽管理員新增權限')
          window.sessionStorage.setItem('token', res.data.token)
          this.$refs.signupForm.resetFields()
          this.$router.push('/login')
        }
      })
    },

    reset () {
      this.$refs.loginForm.resetFields()
    },
    resetsignup () {
      this.$refs.signupForm.resetFields()
    },
    forgetpsw () {
      this.$router.push('/forgetpsw')
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
  padding: 20px;
}

/* .avatar-box {
  height: 130px;
  width: 130px;
  background: white;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 50%;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #ddd;
  position: relative;
  top:150px;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
} */

.login-form {
  padding: 30px 20px;
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
