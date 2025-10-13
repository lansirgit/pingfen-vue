<template>
  <div class="login-container">
    <div class="login-panel">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-position="left" style="width: 400px;">
        <el-form-item>
          <div class="form-title">人体解剖学AI应用能力大赛 | 评委登录</div>
        </el-form-item>

        <el-form-item prop="account">
          <template #label>
            <div class="custom-label">
              <span class="default" :class="{focus:loginFormLabelStatus.account}">账号</span>
              <span class="custom" :class="{focus:loginFormLabelStatus.account}" @click="$refs['accountRef'].focus()">账号</span>
            </div>
          </template>
          <el-input ref="accountRef" :disabled="inputLock" v-model="loginForm.account" prefix-icon="el-icon-user" @focus="changeFormItemStatus('account', 'focus')" @blur="changeFormItemStatus('account', 'blur')"></el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <template #label>
            <div class="custom-label">
              <span class="default" :class="{focus:loginFormLabelStatus.password}">密码</span>
              <span class="custom" :class="{focus:loginFormLabelStatus.password}" @click="$refs['passwordRef'].focus()">密码</span>
            </div>
          </template>
          <el-input ref="passwordRef" :disabled="inputLock" type="password" v-model="loginForm.password"  prefix-icon="el-icon-view"  @focus="changeFormItemStatus('password', 'focus')" @blur="changeFormItemStatus('password', 'blur')"></el-input>
        </el-form-item>
        
        <el-form-item prop="role">
          <template #label>
            <div class="custom-label">
              <span class="default">角色</span>
            </div>
          </template>
          <el-select ref="roleRef" v-model="loginForm.role" placeholder="请选择角色" disabled>
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-row type="flex" justify="space-between" style="padding: 40px 0;">
          <el-button type="primary" @click="handleLogin">登录</el-button>
            <el-button type="text" style="color: #888888;">
              <router-link to="/entrance" tag="span">暂不登录</router-link>
            </el-button>

            <!-- <div>
              没有账号?
              <el-button type="text">
                <router-link to="/rateRegister" tag="span">立即注册</router-link>

              </el-button>
            </div> -->
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { rateLogin } from '@/apis/rate'
import { getRateId, setRateId } from '@/utils/auth'

export default {
  name: "",
  data() {
    return {
      loginForm: {
        account: undefined,
        password: undefined,
        role: 'judge' // 默认选项为评委
      },
      loginFormRules: {
        account: [{required: true, message: "请输入账号", trigger: ['blur']}],
        password: [{required: true, message: "请输入密码", trigger: ['blur']}],
        role: [{required: true, message: "请选择角色", trigger: ['blur']}]
      },
      // 角色选项
      roleOptions: [
        {
          value: 'judge',
          label: '评委'
        },
        {
          value: 'admin',
          label: '管理员'
        }
      ],
      loginFormLabelStatus: {
        account: false,
        password: false,
        role: false
      },
      inputLock: false
    }
  },
  created() {
    this.checkLogin()

  },

  methods: {
    changeFormItemStatus(itemName, type) {
      switch (type) {
        case 'focus':
          this.loginFormLabelStatus[itemName] = true
          break
        case 'blur':
          if(!this.loginForm[itemName]){
            this.loginFormLabelStatus[itemName] = false
          }
          break
        }
    },

    handleLogin() {
      this.$refs['loginFormRef'].validate((valid) => {
        if(!valid) return

        // 按键锁
        this.inputLock = true

        // 发请求
        rateLogin({
          ...this.loginForm
          // uuid: this.captchaInfo.uuid
        }).then(res => {
        //   return
          if(res.success != true){
            this.$message.error(res.msg || '登录失败')
            // this.getCaptchaImage()
          } else {
            setRateId(res.id)
            this.$message.success(res.msg || '登录成功')
            setTimeout(() => {
              this.$router.push('/rate/index')
            }, 2000)
          }
        }).catch(err => {
          this.$message.error(err.response.data.message)
        }).finally(() => {
          // 解按键锁
          this.inputLock = false
        })
      })
    },

    // 判断登录状态
    checkLogin() { 
      if(getRateId()) {
        this.$router.push('/rate/index')
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  min-height: 800px;
  min-width: 1200px;
  background-image: url(https://csasai.cn/uploads/allimg/20250619/1-2506191G15MW.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  
  display: flex;
  justify-content: flex-end;

  .login-panel {
    width: 800px;
    height: 100%;
    background-color: #ffffff;
    opacity: 0.95;
    border-radius: 50% 0 0 50%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: bold;


    .form-title {
      color: rgb(64, 158, 255);
      font-size: 1.5em;
      line-height: 40px;
      font-weight: bold;
    }
  }
}


.custom-label {
  position: relative;
  display: inline-block;
  
  .default {
    opacity: 1;

    &.focus {
      opacity: 0;
      transition: 0.5s;
    }
  }

  .custom {
    position: absolute;
    top: 40px;
    left: 25px;
    z-index: 2;
    display: inline-block;
    width: 3em;
    color: #C0C4CC;
    font-weight: normal;
    transition: 0.3s;

    &.focus {
      top: 0px;
      left: 0px;
      font-weight: bold;
      color: rgb(64, 158, 255);

    }
  }
}
</style>