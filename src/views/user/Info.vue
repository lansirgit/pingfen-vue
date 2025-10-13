<template>
  <div class="container">
    <div class="content">
      <div class="top-container">
        <el-page-header @back="goBack" content="个人信息"></el-page-header>
      </div>

      <!-- 个人信息表单 -->
      <div class="form-container">
        <div class="form-header">
          <h3 class="section-title">个人信息</h3>
          <div class="header-decoration"></div>
        </div>
        <el-form ref="form" 
          :model="form" 
          label-width="80px" 
          label-position="top" 
          size="medium"
          :rules="rules"
          hide-required-asterisk
          >

          <el-form-item label="账号" prop="account">
            <el-input v-model="form.account" disabled placeholder="暂无账号信息"></el-input>
          </el-form-item>
  
          <el-form-item label="单位" prop="organization_name">
            <el-input v-model="form.organization_name" disabled placeholder="暂无单位信息"></el-input>
          </el-form-item>

          <el-form-item label="学院" prop="department_name">
            <el-input v-model="form.department_name" disabled placeholder="暂无学院信息"></el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item>

          <el-form-item label="联系方式" prop="contact">
            <el-input v-model="form.contact" placeholder="请输入手机号"></el-input>
          </el-form-item>
  
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
          </el-form-item>

        </el-form>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <button type="submit" class="action-btn submit-btn" @click="submitForm">
            <i class="el-icon-check"></i> 保存信息
          </button>
        </div>
      </div>

      <!-- 作品信息展示 -->
      <div class="form-container">
        <div class="form-header">
          <h3 class="section-title">我的作品</h3>
          <div class="header-decoration"></div>
        </div>
        <div class="entries-container">
          <el-collapse v-model="activeEntryNames">
            <el-collapse-item 
              v-for="project in userProjects" 
              :key="project.project_id"
              :name="project.project_id"
            >
              <template slot="title">
                <div class="project-header">
                  <i class="el-icon-folder-opened project-icon"></i>
                  <span class="project-name">{{ project.project_name }}</span>
                  <el-tag size="small" type="success">{{ project.project_type }}</el-tag>
                  <div class="project-stats">
                    <!-- <el-tag size="mini" type="info">作品数: {{ project.entries.length }}</el-tag> -->
                    <el-tag size="mini" type="primary">参赛人数: {{ project.total_participants }}</el-tag>
                  </div>
                </div>
              </template>
              <div class="project-entries">
                <el-table 
                  :data="project.entries" 
                  style="width: 100%"
                  :header-cell-style="{background:'#f5f7fa', color:'#606266'}"
                  stripe
                >
                  <el-table-column prop="title" label="作品名称" min-width="150">
                    <template slot-scope="scope">
                      <span class="entry-title">{{ scope.row.title }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="submit_time" label="提交时间" width="180">
                    <template slot-scope="scope">
                      <i class="el-icon-time time-icon"></i>
                      {{ scope.row.submit_time }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="rank" label="当前排名" width="100" align="center">
                    <template slot-scope="scope">
                      <el-tag 
                        v-if="scope.row.has_score && scope.row.rank" 
                        type="warning" 
                        size="small"
                      >
                        {{ scope.row.rank }}
                      </el-tag>
                      <el-tag v-else size="small">未排名</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="平均分" width="100" align="center">
                    <template slot-scope="scope">
                      <span 
                        v-if="scope.row.has_score && scope.row.score" 
                        class="score-value"
                      >
                        {{ scope.row.score | formatScore }}
                      </span>
                      <span v-else class="no-score">未评分</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="count" label="评分人数" width="100" align="center">
                    <template slot-scope="scope">
                      <el-tag 
                        :type="scope.row.count > 0 ? 'success' : 'info'" 
                        size="small"
                      >
                        {{ scope.row.count }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="参赛总人数" width="120" align="center">
                    <template slot-scope="scope">
                      <el-tag type="primary" size="small">
                        {{ project.total_participants }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
          
          <div v-if="userProjects.length === 0" class="no-entries">
            <el-empty description="暂无作品信息">
              <el-button type="primary" @click="goToUpload">去上传作品</el-button>
            </el-empty>
          </div>
        </div>
      </div>

      <!-- 密码修改表单 -->
      <div class="form-container">
        <div class="form-header">
          <h3 class="section-title">修改密码</h3>
          <div class="header-decoration"></div>
        </div>
        <el-form 
          ref="passwordForm" 
          :model="passwordForm" 
          label-width="80px" 
          label-position="top" 
          size="medium"
          :rules="passwordRules"
          hide-required-asterisk
        >
          <el-form-item label="新密码" prop="newPassword">
            <el-input 
              v-model="passwordForm.newPassword" 
              type="password" 
              placeholder="请输入新密码（至少6位）"
              show-password
            >
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input 
              v-model="passwordForm.confirmPassword" 
              type="password" 
              placeholder="请再次输入新密码"
              show-password
            >
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
        </el-form>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <button type="submit" class="action-btn submit-btn" @click="submitPasswordForm">
            <i class="el-icon-refresh"></i> 修改密码
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userEntries, userInfo, userUpdate } from '@/apis/user'
import { getToken } from '@/utils/auth'

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
    // 在data中定义验证规则，确保this指向正确
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    
    return {
      title: '个人信息',
      content: '这是个人信息页面',
      filePreviewText: '',
      
      form: {
        account: undefined,
        contact: undefined,
        organization_name: undefined,
        department_name: undefined,
        name: undefined,
        remark: undefined,
      },
      
      // 密码表单数据
      passwordForm: {
        newPassword: '',
        confirmPassword: ''
      },
      
      // 用户参与的项目和作品信息
      userProjects: [],
      
      // 折叠面板激活项 - 默认展开所有项目
      activeEntryNames: [],
      
      group: undefined,
      
      // 学校列表
      schoolList: [],
      // 院系列表
      departList: [],
      
      // 项目列表
      projectsList: [],
      
      departDisabled: true,
      
      // 原有表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],

        contact: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: validatePhone, message: '请输入正确的手机号格式', trigger: 'blur' }
        ],
      },
      
      // 密码表单验证规则
      passwordRules: {
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },

  // 添加过滤器
  filters: {
    // 格式化分数，保留一位小数
    formatScore(value) {
      if (value === null || value === undefined || value === '') {
        return '暂无评分';
      }
      return parseFloat(value).toFixed(1);
    }
  },

  created() {
    this.getUserInfo()
    this.getUserEntries()
  },

  methods: {
    goBack() {
      this.$router.go(-1)
    },

    // 获取用户信息方法
    getUserInfo() {
      if(!this.checkLogin()) {
        return
      }

      userInfo({id: getToken()}).then(res => {
        this.form = res
      })
    },

    // 获取用户作品信息
    getUserEntries() {
      if(!this.checkLogin()) {
        return
      }

      userEntries({id: getToken()}).then(res => {
        // 将作品信息存储到userProjects变量中
        this.userProjects = res.projects || []
        
        // 默认展开所有项目
        this.$nextTick(() => {
          this.activeEntryNames = this.userProjects.map(project => project.project_id)
        })
      })
    },

    // 查看作品详情
    viewEntryDetail(entry) {
      // 跳转到作品详情页面，这里可以根据实际路由进行调整
      this.$message.info(`查看作品: ${entry.title}`)
      // 示例跳转:
      // this.$router.push({ 
      //   path: '/entry/detail', 
      //   query: { id: entry.id } 
      // })
    },

    // 去上传作品
    goToUpload() {
      this.$router.push('/upload')
    },

    // 当前登录信息判断
    checkLogin() {
      if(getToken()) {
        return true
      }else{
        return false
      }
    },

    // 提交密码修改表单
    submitPasswordForm() {

      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          // 这里可以调用修改密码的API
          userUpdate({
            ...this.passwordForm, 
            ...this.form, 
            id: getToken(), 
            password: this.passwordForm.newPassword || undefined
          }).then(res => {
            if(res.message === "参赛人员信息更新成功"){
              this.$message.success('修改密码成功！')
              // 清空密码表单
              this.passwordForm.newPassword = ''
              this.passwordForm.confirmPassword = ''
              this.$refs.passwordForm.clearValidate()
            }else{
              this.$message.error('修改密码失败！')
            }
          })
        } else {
          return false;
        }
      });
    },

    // 重置表单
    resetForm() {
      this.$refs.form.resetFields();
      this.filePreviewText = '';
    },

    submitForm() {
      
      this.$refs.form.validate((valid) => {
        if (valid) {
          userUpdate({
            ...this.form,
            id: getToken()
          }).then(res => {
            if(res.message === "参赛人员信息更新成功"){
              this.$message.success('修改成功！')
            }else{
              this.$message.error('修改失败！')
            }
          })
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
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  min-height: 100vh;
  padding: 20px 0;

  .content {
    width: 1200px;
    background-color: #FFFFFF;
    flex-direction: column;
    display: flex;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

    .top-container {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }

    .form-container {
      width: 800px;
      padding: 30px 40px;
      margin: auto;
      margin-top: 20px;
      margin-bottom: 30px;
      text-align: left;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }
      
      .form-header {
        margin-bottom: 25px;
        
        .section-title {
          margin-top: 0;
          margin-bottom: 15px;
          color: #333;
          font-size: 22px;
          font-weight: 600;
        }
        
        .header-decoration {
          width: 50px;
          height: 3px;
          background: linear-gradient(90deg, #409EFF, #1e88e5);
          border-radius: 2px;
        }
      }
      
      .form-actions {
        text-align: center;
        margin-top: 30px;
      }
    }
    
    .entries-container {
      .project-header {
        display: flex;
        align-items: center;
        gap: 15px;
        width: 100%;
        
        .project-icon {
          font-size: 18px;
          color: #409EFF;
        }
        
        .project-name {
          font-weight: 600;
          font-size: 16px;
          color: #333;
        }
        
        .project-stats {
          margin-left: auto;
          display: flex;
          gap: 10px;
        }
      }
      
      .project-entries {
        padding: 15px 0;
        
        ::v-deep .el-table {
          .entry-title {
            font-weight: 500;
            color: #409EFF;
          }
          
          .time-icon {
            margin-right: 5px;
            color: #909399;
          }
          
          .score-value {
            font-weight: 600;
            color: #409EFF;
            font-size: 16px;
          }
          
          .no-score {
            color: #909399;
          }
        }
      }
      
      .no-entries {
        text-align: center;
        padding: 40px 0;
        
        ::v-deep .el-button {
          margin-top: 20px;
        }
      }
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

.error .error-message { 
  display: block; 
}

.action-btn {
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.submit-btn {
  background: linear-gradient(135deg, #409EFF 0%, #1e88e5 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(30, 136, 229, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #1e88e5 0%, #0d47a1 100%);
    box-shadow: 0 6px 20px rgba(30, 136, 229, 0.4);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.cancel-btn {
  background: #f8fafc;
  color: #334155;
  
  &:hover {
    background: #e2e8f0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .container {
    padding: 10px;
    
    .content {
      width: 100%;
      border-radius: 10px;
      
      .form-container {
        width: 95%;
        padding: 20px;
        margin: 15px auto;
      }
      
      .entries-container {
        .project-header {
          flex-wrap: wrap;
          
          .project-stats {
            width: 100%;
            margin-top: 10px;
            margin-left: 35px;
          }
        }
      }
    }
  }
}
</style>