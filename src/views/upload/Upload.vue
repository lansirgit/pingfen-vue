<template>
  <div class="container">
    <div class="content">
      <div class="top-container">
        <el-page-header @back="goBack" content="参赛作品上传"></el-page-header>
      </div>

      <div class="form-container">
        <div class="form-header">
          <h2 class="form-title">参赛作品上传</h2>
          <p class="form-subtitle">请填写作品信息并上传参赛视频</p>
          <div class="header-decoration"></div>
        </div>
        
        <el-form ref="form" 
          :model="form" 
          :rules="rules" 
          label-width="100px" 
          label-position="top" 
          size="medium"
          hide-required-asterisk
          >

          <el-form-item label="参加项目" prop="project">
            <el-select 
              v-model="form.project" 
              placeholder="请选择参赛项目" 
              @change="handleProjectChange"
              clearable
            >
              <el-option
                v-for="item in projectsList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <template v-if="form.project">
            <div class="info-section">
              <h3 class="section-title">个人信息</h3>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="单位" prop="organization_name">
                    <el-input v-model="form.organization_name" disabled placeholder="暂无单位信息">
                      <i slot="prefix" class="el-input__icon el-icon-office-building"></i>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="学院" prop="department_name">
                    <el-input v-model="form.department_name" disabled placeholder="暂无学院信息">
                      <i slot="prefix" class="el-input__icon el-icon-school"></i>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" disabled placeholder="暂无姓名信息">
                      <i slot="prefix" class="el-input__icon el-icon-user"></i>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系方式" prop="contact">
                    <el-input v-model="form.contact" disabled placeholder="暂无联系方式信息">
                      <i slot="prefix" class="el-input__icon el-icon-phone"></i>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div class="work-section">
              <h3 class="section-title">作品信息</h3>
              <el-form-item label="作品名称" prop="workName">
                <el-input 
                  v-model="form.workName" 
                  placeholder="请输入作品名称"
                  maxlength="50"
                  show-word-limit
                >
                  <i slot="prefix" class="el-input__icon el-icon-edit"></i>
                </el-input>
              </el-form-item>

              <el-form-item label="指导老师" prop="adviser">
                <el-input
                  v-model="form.adviser"
                  placeholder="请输入指导老师姓名"
                  maxlength="50"
                  show-word-limit
                >
                  <i slot="prefix" class="el-input__icon el-icon-user"></i>
                </el-input>
              </el-form-item>

              <el-form-item label="作品描述" prop="description">
                <el-input 
                  v-model="form.description" 
                  type="textarea" 
                  :rows="5" 
                  placeholder="请输入作品描述，详细说明作品的创新点和应用价值"
                  maxlength="5000"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </div>
    
            <div class="upload-section">
              <h3 class="section-title">作品上传</h3>
              <el-form-item label="视频上传" prop="videoUpload">
                <div class="upload-container">
                  <div class="upload-area" @click="triggerFileInput">
                    <div class="upload-icon">
                      <i class="el-icon-upload"></i>
                    </div>
                    <p class="upload-text">点击上传视频文件</p>
                    <p class="upload-hint">支持MP4格式，最大100MB</p>
                    <el-button type="primary" plain size="small">选择文件</el-button>
                    <input 
                      ref="fileInput"
                      type="file" 
                      id="videoUpload" 
                      name="videoUpload" 
                      style="display: none;" 
                      accept="video/mp4" 
                      required 
                      @change="handleVideoUploadChange"
                    >
                  </div>
                  
                  <div v-if="filePreviewText" class="file-preview">
                    <div class="preview-content">
                      <i class="el-icon-document preview-icon"></i>
                      <div class="preview-info">
                        <p class="file-name">{{ filePreviewText }}</p>
                        <p class="file-status" :class="{ 'success': existingEntry }">
                          <i :class="existingEntry ? 'el-icon-refresh' : 'el-icon-upload-success'"></i>
                          {{ existingEntry ? '已存在作品，可更新' : '文件已选择' }}
                        </p>
                      </div>
                      <el-button 
                        type="danger" 
                        icon="el-icon-delete" 
                        size="mini" 
                        circle
                        @click.stop="clearFile"
                      ></el-button>
                    </div>
                  </div>
                  
                  <div v-if="existingEntry" class="existing-warning">
                    <i class="el-icon-warning"></i>
                    检测到您已上传过该作品，修改作品需重新上传视频
                  </div>
                </div>
              </el-form-item>
            </div>
          </template>
        </el-form>

        <!-- 提交按钮 -->
        <div v-if="form.project" class="form-actions">
          <el-button type="primary" @click="submitForm" size="medium" :loading="uploading">
            <i :class="existingEntry ? 'el-icon-refresh' : 'el-icon-upload'"></i>
            {{ existingEntry ? '更新作品' : '立即上传' }}
          </el-button>
          <el-button @click="resetForm" size="medium">
            <i class="el-icon-refresh-left"></i>
            重置表单
          </el-button>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
  import { formOptions, uploadEntry } from '../../apis/upload'
  import { userInfo, userEntry } from '../../apis/user'
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
      return {
        title: '参赛作品上传',
        content: '这是参赛作品上传页面',
        uploading: false, // 上传状态

        filePreviewText: '',

        form: {
          organization_name: undefined,
          department_name: undefined,
          account: undefined,
          name: undefined,
          contact: undefined,
          project: undefined,
          workName: undefined,
          description: undefined,
          videoUpload: undefined,
        },
        
        group: undefined,

        // 学校列表
        schoolList: [],
        // 院系列表
        departList: [],

        // 项目列表
        projectsList: [],

        departDisabled: true,
        
        // 是否已存在作品
        existingEntry: null,

        // 表单验证规则
        rules: {
          project: [
            { required: true, message: '请选择参加项目', trigger: 'change' }
          ],
          school: [
            { required: true, message: '请选择所属学校', trigger: 'change' }
          ],
          depart: [
            { required: true, message: '请选择所属部门', trigger: 'change' }
          ],
          account: [
            { required: true, message: '请输入学号', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          contact: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { validator: validatePhone, message: '请输入正确的手机号格式', trigger: 'blur' }

          ],
          workName: [
            { required: true, message: '请输入作品名称', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入作品描述', trigger: 'blur' }
          ],
          videoUpload: [
            { required: true, message: '请上传视频文件', trigger: 'change' }
          ]
        }

      }
    },

    created() {
      this.getFormOptions()
      this.getUserInfo()
    },

    methods: {
      goBack() {
        this.$router.go(-1)
      },
      
      // 触发文件选择
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      
      // 清除已选择的文件
      clearFile(event) {
        event.stopPropagation();
        this.$refs.fileInput.value = '';
        this.filePreviewText = '';
        this.form.videoUpload = undefined;
        this.existingEntry = null;
        this.$refs.form.validateField('videoUpload');
      },
      
      handleVideoUploadChange(event) {
        const file = event.target.files[0];
        if (file) {
          // 检查文件大小
          if (file.size > 100 * 1024 * 1024) { // 100MB
            this.$message.error('文件大小不能超过100MB');
            this.$refs.fileInput.value = '';
            return;
          }
          
          // 检查文件类型
          if (!file.type.startsWith('video/')) {
            this.$message.error('请上传视频文件');
            this.$refs.fileInput.value = '';
            return;
          }
          
          this.filePreviewText = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`;
        } else {
          this.filePreviewText = '';
        }
        this.form.videoUpload = file;

        // 手动触发验证
        this.$refs.form.validateField('videoUpload');
      },

      // 获取学校/项目列表
      getFormOptions() {
        formOptions().then(res => {
          if(res) {
            const group = Object.groupBy(res.organizations, ({name}) => name);
            this.group = group;

            this.schoolList = []
            Object.keys(group).forEach(key => {
              this.schoolList.push({
                name: key,
              })
            });

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
        this.form.depart = undefined
        if(!this.form.school) {
          this.departDisabled = true
          return
        }else {
          this.departDisabled = false
        }

        this.departList = []
        this.group[this.form.school].forEach(item => {
          this.departList.push({
            department: item.department,
            id: item.id,
          })
        })
      },

      // 获取用户信息
      getUserInfo() {
        if(!this.checkLogin()) {
          return
        }

        userInfo({id: getToken()}).then(res => {
          this.form.account = res.account
          this.form.department_name = res.department_name
          this.form.organization_name = res.organization_name
          this.form.name = res.name
          this.form.contact = res.contact
        })
      },

      // 当前登录信息判断
      checkLogin() {
        if(getToken()) {
          return true
        }else{
          return false
        }
      },

      // 项目选择变化处理
      handleProjectChange(value) {
        this.form.project = value;
        
        // 当选择了项目后，检查是否已存在作品
        if (value && this.checkLogin()) {
          this.checkExistingEntry(value);
        } else {
          // 清空已存在的作品信息
          this.existingEntry = null;
          // 清空作品相关字段
          this.form.workName = '';
          this.form.description = '';
          this.filePreviewText = '';
          this.form.videoUpload = undefined;
        }
        
        // 手动触发项目字段验证
        this.$refs.form.validateField('project');
      },

      // 检查是否已存在作品
      checkExistingEntry(projectId) {
        const params = {
          participantID: getToken(),
          project: projectId
        };
        
        // 调用检查接口
        userEntry(params).then(res => {
          
          if (res && res.entries && res.entries.length > 0) {
            // 存在已上传的作品
            this.existingEntry = res.entries[0];
            
            // 填充表单信息
            this.form.workName = this.existingEntry.title;
            this.form.description = this.existingEntry.description;
            
            // 显示文件信息
            this.filePreviewText = `已存在作品视频文件`;
            
            // 显示提示信息
            this.$message.info('检测到您已上传过该作品，可直接修改');
          } else {
            // 不存在作品，清空相关字段
            this.existingEntry = null;
            this.form.workName = '';
            this.form.description = '';
            this.filePreviewText = '';
            this.form.videoUpload = undefined;
          }
        }).catch(error => {
          // this.$message.error('检查作品信息失败');
          // 清空已存在的作品信息
          this.existingEntry = null;
          // 清空作品相关字段
          this.form.workName = '';
          this.form.description = '';
          this.filePreviewText = '';
          this.form.videoUpload = undefined;

        });
      },

      // 重置表单
      resetForm() {
        this.$refs.form.resetFields();
        this.filePreviewText = '';
        this.existingEntry = null;
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
      },

      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            
            // 设置上传状态
            this.uploading = true;
            
            // 创建 FormData 对象
            const formData = new FormData();
            
            // 添加表单数据
            formData.append('participantID', getToken());
            formData.append('project', this.form.project);
            formData.append('workName', this.form.workName);
            formData.append('description', this.form.description);
            formData.append('adviser', this.form.adviser);
            
            // 添加视频文件
            if (this.form.videoUpload) {
              formData.append('videoUpload', this.form.videoUpload);
            }
            
            // 调用上传接口
            uploadEntry(formData).then(res => {
              if(res) {
                this.$message.success(this.existingEntry ? res.message ? res.message : '上传成功' : '上传成功');
                this.resetForm();
              } else {
                this.$message.error(this.existingEntry ? '作品更新失败' : '上传失败');
              }
            }).catch(error => {
              this.$message.error(this.existingEntry ? '作品更新失败' : '上传失败');
            }).finally(() => {
              // 重置上传状态
              this.uploading = false;
            });
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
      margin-bottom: 40px;
      text-align: left;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      
      .form-header {
        text-align: center;
        margin-bottom: 30px;
        
        .form-title {
          color: #333;
          font-size: 28px;
          margin-bottom: 10px;
          font-weight: 600;
        }
        
        .form-subtitle {
          color: #666;
          font-size: 16px;
          margin-bottom: 20px;
        }
        
        .header-decoration {
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #409EFF, #1e88e5);
          border-radius: 2px;
          margin: 0 auto;
        }
      }
      
      .section-title {
        color: #333;
        font-size: 20px;
        margin: 25px 0 15px;
        font-weight: 600;
        position: relative;
        padding-left: 15px;
        
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 3px;
          width: 4px;
          height: 20px;
          background: #409EFF;
          border-radius: 2px;
        }
      }
      
      .info-section,
      .work-section,
      .upload-section {
        margin-bottom: 25px;
        padding: 20px;
        border-radius: 12px;
        background: #f8fafc;
        
        &:hover {
          background: #f0f7ff;
        }
      }
      
      .upload-container {
        .upload-area {
          border: 2px dashed #dcdfe6;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fafafa;
          
          &:hover {
            border-color: #409EFF;
            background: #f0f9ff;
          }
          
          .upload-icon {
            font-size: 48px;
            color: #409EFF;
            margin-bottom: 15px;
          }
          
          .upload-text {
            font-size: 18px;
            color: #666;
            margin-bottom: 10px;
            font-weight: 500;
          }
          
          .upload-hint {
            font-size: 14px;
            color: #999;
            margin-bottom: 20px;
          }
        }
        
        .file-preview {
          margin-top: 20px;
          padding: 15px;
          border-radius: 8px;
          background: #f0f9ff;
          border: 1px solid #d0e9ff;
          
          .preview-content {
            display: flex;
            align-items: center;
            gap: 15px;
            
            .preview-icon {
              font-size: 24px;
              color: #409EFF;
            }
            
            .preview-info {
              flex: 1;
              
              .file-name {
                font-size: 14px;
                color: #333;
                margin-bottom: 5px;
                word-break: break-all;
              }
              
              .file-status {
                font-size: 13px;
                color: #666;
                
                &.success {
                  color: #67c23a;
                }
                
                i {
                  margin-right: 5px;
                }
              }
            }
          }
        }
        
        .existing-warning {
          margin-top: 15px;
          padding: 12px 15px;
          border-radius: 8px;
          background: #fff7e6;
          border: 1px solid #ffe58f;
          color: #faad14;
          font-size: 14px;
          
          i {
            margin-right: 8px;
          }
        }
      }
      
      .form-actions {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        
        ::v-deep .el-button {
          padding: 12px 25px;
          font-size: 16px;
          border-radius: 8px;
          margin: 0 10px;
          
          i {
            margin-right: 8px;
          }
        }
      }
    }
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
        
        .form-header {
          .form-title {
            font-size: 24px;
          }
        }
        
        ::v-deep .el-row {
          flex-direction: column;
          
          .el-col {
            width: 100%;
            margin-bottom: 15px;
          }
        }
      }
    }
  }
}
</style>