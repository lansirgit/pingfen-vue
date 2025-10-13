<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-header">
        <h2>后台登录</h2>
        <!-- <p>中国解剖学会AI应用能力大赛</p> -->
      </div>
      
      <el-form 
        ref="loginForm" 
        :model="loginForm" 
        :rules="loginRules"
        class="form-content"
        @keyup.enter.native="handleLogin"
      >
        <el-form-item prop="account">
          <el-input
            v-model="loginForm.account"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { rateLogin } from '@/apis/rate'

export default {
  name: 'ManageLogin',
  data() {
    return {
      loginForm: {
        account: '',
        password: '',
        role: 'admin'
      },
      loginRules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    // 登录处理
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          
          rateLogin({...this.loginForm}).then(res => { 
            if (res.id) {
              this.$message.success('登录成功')
              this.$router.push('/manage/index')
            } else {
              this.$message.error(res.msg)
            }
          }).catch(err => {
            this.$message.error(err.msg)
          }).finally(() => {
            this.loading = false
          })
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    },
    
    // 登录接口调用方法（可以替换为实际的API调用）
    loginApi(formData) {
      // 这里是调用登录接口的地方
      // 根据您的实际API接口进行调整
      return login({
        account: formData.account,
        password: formData.password
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  
  .login-header {
    text-align: center;
    margin-bottom: 30px;
    
    h2 {
      font-size: 24px;
      color: #333;
      margin-bottom: 10px;
    }
    
    p {
      font-size: 14px;
      color: #666;
    }
  }
  
  .form-content {
    ::v-deep .el-form-item {
      margin-bottom: 25px;
    }
    
    ::v-deep .el-input__inner {
      height: 45px;
      line-height: 45px;
      font-size: 14px;
      border-radius: 5px;
    }
    
    .login-button {
      width: 100%;
      height: 45px;
      font-size: 16px;
      border-radius: 5px;
      margin-top: 10px;
    }
  }
}

// 响应式设计
@media (max-width: 500px) {
  .login-form {
    padding: 30px 20px;
    margin: 0 15px;
  }
}
</style>