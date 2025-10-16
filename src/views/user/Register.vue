<template>
  <div class="register-container">
    <div class="register-panel">

      <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" label-position="left" style="width: 400px;">
        <el-form-item>
          <div class="form-title">人体解剖学AI应用能力大赛 | 注册</div>
        </el-form-item>

        <el-form-item prop="account">
          <template #label>
            <div class="custom-label">
              <span class="default" :class="{focus:registerFormLabelStatus.account}">账号</span>
              <span class="custom" :class="{focus:registerFormLabelStatus.account}" @click="$refs['accountRef'].focus()">账号</span>
            </div>
          </template>
          <el-input ref="accountRef" :disabled="inputLock" v-model="registerForm.account" prefix-icon="el-icon-user" @focus="changeFormItemStatus('account', 'focus')" @blur="changeFormItemStatus('account', 'blur')"></el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <template #label>
            <div class="custom-label">
              <span class="default" :class="{focus:registerFormLabelStatus.password}">密码</span>
              <span class="custom" :class="{focus:registerFormLabelStatus.password}" @click="$refs['passwordRef'].focus()">密码</span>
            </div>
          </template>
          <el-input ref="passwordRef" :disabled="inputLock" type="password" v-model="registerForm.password"  prefix-icon="el-icon-view"  @focus="changeFormItemStatus('password', 'focus')" @blur="changeFormItemStatus('password', 'blur')"></el-input>
        </el-form-item>
        
        <el-form-item prop="name">
          <template #label>
            <div class="custom-label">
              <span class="default" :class="{focus:registerFormLabelStatus.name}">姓名</span>
              <span class="custom" :class="{focus:registerFormLabelStatus.name}" @click="$refs['nameRef'].focus()">姓名</span>
            </div>
          </template>
          <el-input ref="nameRef" :disabled="inputLock" v-model="registerForm.name" prefix-icon="el-icon-user" @focus="changeFormItemStatus('name', 'focus')" @blur="changeFormItemStatus('name', 'blur')"></el-input>
        </el-form-item>

        <el-form-item prop="contact">
          <template #label>
            <div class="custom-label">
              <span class="default" :class="{focus:registerFormLabelStatus.contact}">手机号</span>
              <span class="custom" :class="{focus:registerFormLabelStatus.contact}" @click="$refs['contactRef'].focus()">手机号</span>
            </div>
          </template>
          <el-input ref="contactRef" :disabled="inputLock" v-model="registerForm.contact" prefix-icon="el-icon-phone" @focus="changeFormItemStatus('contact', 'focus')" @blur="changeFormItemStatus('contact', 'blur')"></el-input>
        </el-form-item>

        <el-form-item label="所属学校" prop="school">
          <el-select v-model="registerForm.school" placeholder="请选择学校" @change="handleSchoolChange" filterable clearable>
            <el-option
              v-for="item in schoolList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
  
        <el-form-item label="所属院系" prop="department">
          <el-select v-model="registerForm.department" placeholder="请选择院系"  clearable filterable :disabled="departDisabled">
            <el-option
              v-for="item in departList"
              :key="item.id"
              :label="item.department"
              :value="item.department"
            />
          </el-select>
        </el-form-item>

        <el-row type="flex" justify="space-between">
          <el-button type="primary" @click="handleregister">注册</el-button>

            <div>
              已有账号
              <el-button type="text">
                <router-link to="/login" tag="span">立即登录</router-link>
              </el-button>
            </div>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { userRegister } from '@/apis/user'
import { formOptions } from '../../apis/upload'

// 手机号验证规则
  const validatePhone = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入联系方式'));
    } else {
      const reg = /^1[3-9]\d{9}$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的手机号格式'));
      }
    }
  };


export default {
  name: "",
  data() {
    return {
      registerForm: {
        account: undefined,
        name: undefined,
        password: undefined,
        contact: undefined,
        school: undefined,
        department: undefined,
      },
      group: undefined,
      registerFormRules: {
        account: [
          { required: true, message: "请输入账号", trigger: ['blur'] },
          { min: 3, message: '账号长度至少3位', trigger: 'blur' }
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: ['blur'] },
          { min: 2, message: '姓名长度至少2位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: ['blur'] },
          { min: 6, message: '密码长度至少6位', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: "请输入手机号", trigger: ['blur'] },
          { validator: validatePhone, message: '请输入正确的手机号格式', trigger: 'blur' }
        ],
        school: [{ required: true, message: "请选择学校", trigger: ['blur'] }],
        department: [{ required: true, message: "请选择院系", trigger: ['blur'] }],
      },
      // 学校列表
      schoolList: [],
      // 院系列表
      departList: [],
      departDisabled: true,

      registerFormLabelStatus: {
        account: false,
        name: false,
        password: false,
        contact: false,
      },
      inputLock: false
    }
  },
  created() {
    this.getFormOptions()
  },

  methods: {
    changeFormItemStatus(itemName, type) {
      switch (type) {
        case 'focus':
          this.registerFormLabelStatus[itemName] = true
          break
        case 'blur':
          if(!this.registerForm[itemName]){
            this.registerFormLabelStatus[itemName] = false
          }
          break
        }
    },

    // 获取学校/项目列表
    getFormOptions() {
      formOptions().then(res => {
        if(res) {
          const group = Object.groupBy(res.organizations, ({name}) => name);
          this.group = group
          this.schoolList = []
          Object.keys(group).forEach(key => {
            this.schoolList.push({
              name: key,
            })
          })

          this.projectsList = []
          res.projects.forEach(item => {
            this.projectsList.push({
              name: item.name,
              id: item.id,
            })
          })
        }
      })
    },

    // 当所选择的学校切换时触发方法 替换院系列表
    handleSchoolChange() {
      this.registerForm.department = undefined

      if(!this.registerForm.school) {
        this.departDisabled = true
        return
      }else {
        this.departDisabled = false
      }

      this.departList = []
      this.group[this.registerForm.school].forEach(item => {
        this.departList.push({
          department: item.department,
          id: item.id,
        })
      })
   
    },

    handleregister() {

      this.$refs['registerFormRef'].validate((valid) => {
        if(!valid) return

        // 按键锁
        this.inputLock = true

        // 发请求
        userRegister({
          ...this.registerForm,
        }).then(res => {
          if(res.success != true){
            this.$message.error(res.message)
          } else {
            this.$message.success(res.message)
            this.$router.push('/login')
          }
        }).finally(() => {
          // 解按键锁
          this.inputLock = false
        }).catch(err => {
          this.$message.error(err.response.data.message)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  width: 100vw;
  height: 100vh;
  min-height: 800px;
  min-width: 1200px;
  background-image: url(https://csasai.cn/uploads/allimg/20250619/1-2506191G15MW.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  
  display: flex;
  justify-content: flex-end;

  .register-panel {
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
      text-align: center;
      margin-bottom: 30px;
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

// 响应式设计
@media (max-width: 768px) {
  .register-container {
    min-width: auto;
    
    .register-panel {
      width: 100%;
      border-radius: 0;
      padding: 20px;
    }
  }
}
</style>