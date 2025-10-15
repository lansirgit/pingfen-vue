<template>
  <div class="container" v-loading="loading" :element-loading-text="loadingText">
    <div class="content">
      <div class="top-container">
        <el-page-header @back="goBack" content="参赛作品查看"></el-page-header>
      </div>

      <div class="form-container">
        <div class="form-header">
          <h2 class="form-title">参赛作品查看</h2>
          <p class="form-subtitle">请选择查看参加项目</p>
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

          <el-form-item label="参加赛道" prop="track">
            <el-select 
              v-model="form.track" 
              placeholder="请选择参赛赛道" 
              @change="handTrackChange"
              clearable
            >
              <el-option 
                v-for="item in trackList" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>

          <el-form-item label="参加项目" prop="project" v-if="form.track">
            <el-select 
              v-model="form.project" 
              placeholder="请选择参赛项目" 
              @change="handleProjectChange"
              clearable
            >
              <el-option
                v-for="item in currentProjectsList"
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
                  placeholder="暂无作品名称"
                  disabled
                >
                  <i slot="prefix" class="el-input__icon el-icon-edit"></i>
                </el-input>
              </el-form-item>

              <el-form-item label="作品描述" prop="description">
                <el-input 
                  v-model="form.description" 
                  type="textarea" 
                  :rows="5" 
                  placeholder="暂无作品描述"
                  disabled
                ></el-input>
              </el-form-item>
            </div>
    
            <div class="upload-section">
              <h3 class="section-title">作品演示</h3>
              <div class="file-container">
                <div v-if="fileUrl" class="file-player">
                  <!-- 视频文件 -->
                  <div v-if="isVideoFile" class="video-player">
                    <video 
                      :src="fileUrl" 
                      controls
                      preload="metadata"
                      style="width: 100%; height: 100%; object-fit: contain;">
                      您的浏览器不支持视频播放。
                    </video>
                  </div>
                  
                  <!-- PDF文件 -->
                  <div v-else-if="isPdfFile" class="pdf-viewer">
                    <iframe 
                      :src="fileUrl" 
                      style="width: 100%; height: 600px; border: none;"
                      title="PDF Viewer">
                    </iframe>
                  </div>
                  
                  <!-- 其他文件类型 (如PPT等) -->
                  <div v-else class="other-file">
                    <el-card class="file-card">
                      <div class="file-info">
                        <i class="el-icon-document file-icon"></i>
                        <div class="file-details">
                          <p class="file-name">{{ fileName }}</p>
                          <p class="file-type">文件类型: {{ fileType }}</p>
                        </div>
                        <el-button 
                          type="primary" 
                          @click="downloadFile"
                          icon="el-icon-download">
                          下载文件
                        </el-button>
                      </div>
                    </el-card>
                  </div>
                </div>
                <div v-else class="no-file">
                  <el-empty description="暂无作品文件">
                    <p style="color: #999; font-size: 14px;">该项目下未找到您的作品</p>
                  </el-empty>
                </div>
              </div>
            </div>
          </template>
          
          <!-- 无项目选择时的提示 -->
          <div v-else-if="!form.track" class="no-project-hint">
            <el-empty description="请选择参赛赛道和项目以查看作品信息"></el-empty>
          </div>
          <div v-else class="no-project-hint">
            <el-empty description="请选择参赛项目以查看作品信息"></el-empty>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import { formOptions } from '../../apis/upload'
  import { userInfo, userEntry } from '../../apis/user'
  import { getToken } from '@/utils/auth'

  export default {
    data() {
      return {
        title: '参赛作品查看',
        content: '这是参赛作品查看页面',
        
        // loading状态
        loading: false,
        loadingText: '加载中...',

        form: {
          organization_name: undefined,
          department_name: undefined,
          account: undefined,
          name: undefined,
          contact: undefined,
          project: undefined,
          workName: undefined,
          description: undefined,
          track: undefined
        },
        
        group: undefined,

        // 赛道列表
        trackList: [
          { id: 1, name: '学生赛道' },
          { id: 2, name: '教师赛道' },
        ],

        // 学校列表
        schoolList: [],
        // 院系列表
        departList: [],

        // 项目列表
        projectsList: [],
        //当前赛道项目列表
        currentProjectsList: [],

        departDisabled: true,
        
        // 视频URL
        videoUrl: '',
        
        // 表单验证规则
        rules: {
          project: [
            // { required: true, message: '请选择参加项目', trigger: 'change' }
          ]
        },

        // 文件相关数据
        fileUrl: '',
        fileName: '',
        fileType: ''
      }
    },

    created() {
      this.getFormOptions()
      this.getUserInfo()
    },

    computed: {
      // 判断是否为视频文件
      isVideoFile() {
        if (!this.fileType) return false;
        const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
        return videoTypes.includes(this.fileType.toLowerCase());
      },
      
      // 判断是否为PDF文件
      isPdfFile() {
        if (!this.fileType) return false;
        return this.fileType.toLowerCase() === 'pdf';
      }
    },

    methods: {
      goBack() {
        this.$router.go(-1)
      },

      // 获取学校/项目列表
      getFormOptions() {
        this.loading = true;
        this.loadingText = '正在加载项目信息...';
        
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
                track: item.track
              })
            })
          }
        }).finally(() => {
          this.loading = false;
        })
      },

      // 处理赛道变化
      handTrackChange(value) {
        this.form.track = value;
        this.currentProjectsList = this.projectsList.filter(item => item.track === value)
        this.handleProjectChange(undefined)
      },

      // 获取用户信息
      getUserInfo() {
        if(!this.checkLogin()) {
          return
        }

        this.loading = true;
        this.loadingText = '正在加载用户信息...';
        
        userInfo({id: getToken()}).then(res => {
          this.form.account = res.account
          this.form.department_name = res.department_name
          this.form.organization_name = res.organization_name
          this.form.name = res.name
          this.form.contact = res.contact
        }).finally(() => {
          this.loading = false;
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
          // 清空作品相关字段
          this.form.workName = '';
          this.form.description = '';
          this.videoUrl = '';
        }
      },

      // 检查是否已存在作品
    checkExistingEntry(projectId) {
      const params = {
        participantID: getToken(),
        project: projectId
      };
      
      // 设置loading状态
      this.loading = true;
      this.loadingText = '正在加载作品信息...';
      
      // 调用检查接口
      userEntry(params).then(res => {
        if (res && res.entries && res.entries.length > 0) {
          // 存在作品
          const entry = res.entries[0];
          this.form.workName = entry.title;
          this.form.description = entry.description;
          
          // 处理文件URL
          if (entry.url) {
            this.fileUrl = this.processFileUrl(entry.url);
            this.fileName = this.getFileName(entry.url);
            this.fileType = this.getFileExtension(entry.url);
          } else {
            this.fileUrl = '';
            this.fileName = '';
            this.fileType = '';
          }
        } else {
          // 不存在作品
          this.form.workName = '';
          this.form.description = '';
          this.fileUrl = '';
          this.fileName = '';
          this.fileType = '';
          this.$message.info('该项目下未找到您的作品');
        }
      }).catch(error => {
        console.error('检查作品失败:', error);
        this.form.workName = '';
        this.form.description = '';
        this.fileUrl = '';
        this.fileName = '';
        this.fileType = '';
        this.form.project = undefined;
        this.$message.warning('该比赛项目未找到参赛作品');
      }).finally(() => {
        // 关闭loading
        this.loading = false;
      });
    },
    
    // 处理文件URL路径
    processFileUrl(url) {
      if (!url) return '';
      
      // 如果URL包含后端地址，则替换为代理路径
      if (url.startsWith('/pingfen/static/')) {
        return url; // 通过代理访问
      }
      
      // 如果是完整URL，保持不变
      if (url.startsWith('http')) {
        return url;
      }
      
      // 其他情况返回原URL
      return url;
    },
    
    // 获取文件名
    getFileName(url) {
      if (!url) return '';
      return url.split('/').pop().split('?')[0].split('#')[0];
    },
    
    // 获取文件扩展名
    getFileExtension(url) {
      if (!url) return '';
      const fileName = this.getFileName(url);
      const parts = fileName.split('.');
      return parts.length > 1 ? parts.pop() : '';
    },
    
    // 下载文件
    downloadFile() {
      if (!this.fileUrl) return;
      
      const link = document.createElement('a');
      link.href = this.fileUrl;
      link.download = this.fileName || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      
      .video-container {
        .video-player {
          width: 100%;
          height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #000;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .no-video {
          text-align: center;
          padding: 40px 0;
        }
      }
      
      .no-project-hint {
        text-align: center;
        padding: 40px 0;
      }
    }
  }
}
.upload-section {
  .file-container {
    .file-player {
      width: 100%;
      
      .video-player {
        width: 100%;
        height: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #000;
        border-radius: 12px;
        overflow: hidden;
      }
      
      .pdf-viewer {
        width: 100%;
        height: 600px;
        border: 1px solid #ddd;
        border-radius: 12px;
        overflow: hidden;
      }
      
      .other-file {
        .file-card {
          .file-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            
            .file-icon {
              font-size: 48px;
              color: #409EFF;
              margin-right: 20px;
            }
            
            .file-details {
              flex: 1;
              min-width: 0;
              
              .file-name {
                width: 90%;
                overflow: hidden; /* 隐藏超出部分 */
                text-overflow: ellipsis; /* 使用省略号表示超出部分 */
                white-space: nowrap; /* 不换行 */
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
              }
              
              .file-type {
                color: #666;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
    
    .no-file {
      text-align: center;
      padding: 40px 0;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .upload-section {
    .file-container {
      .file-player {
        .video-player {
          height: 300px;
        }
        
        .pdf-viewer {
          height: 400px;
        }
        
        .other-file {
          .file-card {
            .file-info {
              flex-direction: column;
              text-align: center;
              
              .file-icon {
                margin-right: 0;
                margin-bottom: 15px;
              }
              
              .file-details {
                margin-bottom: 15px;
              }
            }
          }
        }
      }
    }
  }
}
</style>