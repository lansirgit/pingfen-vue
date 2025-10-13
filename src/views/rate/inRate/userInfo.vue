<template>
  <div class="container">
    <div class="content">
      <div class="top-container">
        <el-page-header @back="goBack" content="个人信息"></el-page-header>
      </div>

      <div class="form-container">
        <el-form ref="form" 
          :model="form" 
          :rules="rules" 
          label-width="80px" 
          label-position="top" 
          size="medium"
          hide-required-asterisk>

          <el-form-item label="账号" prop="account">
            <el-input v-model="form.account" placeholder="请输入账号" disabled></el-input>
          </el-form-item>

          <!-- <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item> -->

          <!-- <el-form-item label="联系方式" prop="contact">
            <el-input v-model="form.contact" placeholder="请输入手机号"></el-input>
          </el-form-item> -->
          
          <el-form-item label="组织名称" prop="organization_name">
            <el-input v-model="form.organization_name" placeholder="请输入组织名称" disabled></el-input>
          </el-form-item>
          
          <!-- <el-form-item label="部门" prop="organization_department">
            <el-input v-model="form.organization_department" placeholder="请输入部门" disabled></el-input>
          </el-form-item> -->
          
          <!-- <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" rows="5" placeholder="请输入备注信息"></el-input>
          </el-form-item> -->
        </el-form>

        <!-- 提交按钮 -->
        <div>
          <!-- <button type="submit" class="action-btn submit-btn" @click="submitForm">立即上传</button> -->
          <!-- <button type="button" class="action-btn cancel-btn" @click="resetForm">重置表单</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { rateInfo } from '@/apis/rate';
import { getRateId } from '@/utils/auth';

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
  data() {
    return {
      title: '参赛作品上传',
      content: '这是参赛作品上传页面',
      filePreviewText: '',

      form: {
        account: undefined,
        name: undefined,
        contact: undefined,
        organization_name: undefined,
        organization_department: undefined,
        remark: undefined
      },

      // 表单验证规则
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        organization_name: [
          { required: true, message: '请输入组织名称', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getRateInfo()
  },

  methods: {
    goBack() {
      this.$router.go(-1)
    },

    // 获取评委信息
    getRateInfo() {
      if(!getRateId()){
        this.$router.push({
          path: '/rateLogin'
        })
      }
      rateInfo({
        judge_id: getRateId()
      }).then(res => {
        this.form = res
      })
    },

    


    // 重置表单
    resetForm() {
      this.$refs.form.resetFields();
      this.filePreviewText = '';
    },

    submitForm() {
       this.$refs.form.validate((valid) => {
        if (valid) {
          // 这里可以添加实际的提交逻辑
          // 例如调用API接口提交数据
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
  background-color: #EEEEEE;
  min-height: 100vh;

  .content {
    width: 1200px;
    background-color: #FFFFFF;

    .top-container {
      display: flex;
      justify-content: space-between;
      padding: 20px;
    }

    .form-container {
      width: 800px;
      padding: 20px 40px;
      margin: auto;
      margin-top: 20px;
      margin-bottom: 60px;
      text-align: left;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
    }
  }
}

.input-group {
  margin-bottom: 1.5rem;
}
.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}
.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #334155;
  transition: all 0.2s ease;
}
.input-field:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px #e0f2fe;
}
.error-message {
  display: none;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #dc2626;
}
.error .error-message { display: block; }

.action-btn {
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}
.submit-btn {
  background: #2563eb;
  color: white;
  margin-right: 1rem;
}
.submit-btn:hover {
  background: #1d4ed8;
}
.cancel-btn {
  background: #f8fafc;
  color: #334155;
}
.cancel-btn:hover {
  background: #e2e8f0;
}
</style>