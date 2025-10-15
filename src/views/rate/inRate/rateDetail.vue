<template>
  <div class="container" v-loading="loading">
    <div class="content">
      <div class="top-container">
        <el-page-header @back="goBack" content="作品详情"></el-page-header>
      </div>

      <div class="main-layout">
        <!-- 左侧作品信息区域 (60%) -->
        <div class="work-info-section">
          <div class="work-title-area">
            <!-- 作品标题区域 -->
            <div class="title-content">
              <h2 class="work-title">{{ rateDetail.title }}</h2>
              <p class="project-info">
                <el-tag class="project-tag">{{ rateDetail.project_name }}</el-tag>
                <el-tag type="success" class="type-tag">{{ rateDetail.project_type }}</el-tag>
              </p>
            </div>
          </div>
          
          <div class="work-video-area">
            <!-- 根据文件类型展示不同内容 -->
            <div class="file-content-container" v-if="rateDetail.url">
              <!-- 视频文件 -->
              <div class="video-container" v-if="isVideoFile(rateDetail.url)">
                <video 
                  :src="rateDetail.url" 
                  controls
                  preload="metadata"
                  style="width: 100%; height: 100%; object-fit: contain;">
                  您的浏览器不支持视频播放。
                </video>
              </div>
              
              <!-- PDF文件 -->
              <div class="pdf-container" v-else-if="isPdfFile(rateDetail.url)">
                <iframe 
                  :src="rateDetail.url" 
                  style="width: 100%; height: 100%; border: none;"
                  title="PDF Viewer">
                </iframe>
              </div>
              
              <!-- 图片文件 -->
              <div class="image-container" v-else-if="isImageFile(rateDetail.url)">
                <img 
                  :src="rateDetail.url" 
                  alt="作品图片" 
                  style="max-width: 100%; max-height: 100%; object-fit: contain;">
              </div>
              
              <!-- 其他文件类型提供下载 -->
              <div class="file-download-container" v-else>
                <div class="file-info-card">
                  <div class="file-icon">
                    <i class="el-icon-document"></i>
                  </div>
                  <div class="file-details">
                    <h3 class="file-name">{{ rateDetail.title }}{{ getFileExtension(rateDetail.url) }}</h3>
                    <p class="file-type">文件类型: {{ getFileExtension(rateDetail.url).toUpperCase().substring(1) }}</p>
                    <p class="file-action-tip">此文件需要下载后查看</p>
                    <el-button 
                      type="primary" 
                      @click="downloadFile(rateDetail.url, rateDetail.title)"
                      icon="el-icon-download">
                      下载文件
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="video-placeholder" v-else>
              <el-empty description="暂无内容"></el-empty>
            </div>
          </div>

          <!-- 新增：下一个作品按钮 -->
          <div class="navigation-area" v-if="entriesList.length > 1">
            <div class="navigation-button">
              <el-button 
                type="primary" 
                size="medium"
                @click="goToNextEntry"
                :disabled="entriesList.length <= 1">
                下一个作品
              </el-button>
            </div>
          </div>
          
          <div class="work-description-area">
            <!-- 作品详情描述区域 -->
            <div class="description-content">
              <h3 class="description-title">作品描述</h3>
              <p class="description-text">{{ rateDetail.description }}</p>
            </div>
          </div>
        </div>

        <!-- 右侧打分区域 (40%) -->
        <div class="scoring-section">
          <div class="scoring-form-area">
            <!-- 打分表单区域 -->
            <div class="scoring-content">
              <h3 class="scoring-title">作品评分</h3>
              
              <div class="scoring-dimensions">
                <!-- 按dimension_name分组展示 -->
                <div 
                  class="dimension-group" 
                  v-for="(group, dimensionName) in groupedScoringCriteria" 
                  :key="dimensionName">
                  <div class="dimension-header">
                    <h3 class="dimension-name">{{ dimensionName }}</h3>
                    <el-tag type="info" class="dimension-total-score">
                      总分: {{ calculateDimensionTotal(group) }} 分
                    </el-tag>
                  </div>
                  
                  <div class="dimension-items">
                    <div 
                      class="scoring-item"
                      v-for="item in group" 
                      :key="item.id">
                      <div class="scoring-item-content">
                        <div class="item-main">
                          <div class="item-title">
                            <span class="item-name">{{ item.name }}</span>
                            <span class="item-score">({{ item.maxScore }}分)</span>
                          </div>
                          
                          <div class="item-slider-container">
                            <el-slider
                              v-model="item.score"
                              :min="0"
                              :max="item.maxScore"
                              :step="1"
                              show-input
                              input-size="mini">
                            </el-slider>
                          </div>
                        </div>
                        
                        <div class="item-description" v-if="item.description && item.description.trim()">
                          <i class="el-icon-info description-icon"></i>
                          <span class="description-text">{{ item.description }}</span>
                        </div>
                        
                        <div class="score-options" v-if="getSortedOptions(item).length > 0">
                          <div 
                            class="score-option"
                            v-for="(option, index) in getSortedOptions(item)"
                            :key="index"
                            :class="{ active: item.score >= option.score }">
                            <el-rate
                              :value="getRateValue(item.score, option.score, getPrevOptionScore(item, option))"
                              :max="item.maxScore"
                              :disabled="true"
                              size="small">
                            </el-rate>
                            <span class="score-text">{{ option.text }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="total-score-summary">
                <div class="total-score-display">
                  <span class="label">总分:</span>
                  <el-tag type="success" class="total-score-tag">
                    {{ totalScore }} 分
                  </el-tag>
                </div>
                
                <div class="scoring-actions">
                  <el-button type="primary" @click="submitScore">提交评分</el-button>
                  <el-button @click="resetScore">重置评分</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { detailDimensions, detailEntry, submitRate, listUnreviewed, listReviewed, detailRate } from '@/apis/rate'
import { getRateId, getToken } from '@/utils/auth'

export default {
  data() {
    return {
      id: this.$route.query.detailId,
      projectId: this.$route.query.projectId,

      isUpdate: this.$route.query.isUpdate === 'true' || false,

      rateDetail: {
        title: '',
        project_type: '',
        project_name: '',
        description: '',
        url: '',
        score: 0,
        entry_id: 0,
        project_id: 0,
      },
      
      // 评分细则数据
      scoringCriteria: [],
      
      // 作品列表（根据来源决定是已评分还是待评分列表）
      entriesList: [],
      // 当前作品在列表中的索引
      currentIndex: -1,
      
      // 添加loading状态
      loading: false
    }
  },

  computed: {
    // 计算总分
    totalScore() {
      return this.scoringCriteria.reduce((total, item) => total + item.score, 0);
    },
    
    // 按dimension_name分组评分项
    groupedScoringCriteria() {
      return this.scoringCriteria.reduce((groups, item) => {
        const dimensionName = item.dimension_name;
        if (!groups[dimensionName]) {
          groups[dimensionName] = [];
        }
        groups[dimensionName].push(item);
        return groups;
      }, {});
    }
  },

  watch: {
    // 监听路由变化
    $route(to, from) {
      // 当路由参数发生变化时重新加载数据
      if (to.query.detailId !== from.query.detailId) {
        this.id = to.query.detailId;
        this.projectId = to.query.projectId;
        this.getEntryDetail();
        this.getRateDetail();
        this.getEntriesList();
      }
    }
  },

  async created() {
    if (this.id) {
      this.loading = true;
      try {
        await Promise.all([
          this.getRateDetail(),
          this.getEntryDetail()
        ]);
        
        if (this.isUpdate) {
          await this.getRateDetails();
        }
        
        await this.getEntriesList();
      } finally {
        this.loading = false;
      }
    }
  },

  methods: {
    goBack() {
      this.$router.push({
        path: '/rate/rateList',
        query: {
          projectId: this.projectId,
          isUpdate: this.isUpdate? 0: 1
        }
      });
    },

    // 获取评分细则
    getRateDetail() {
      this.loading = true;
      detailDimensions({
        project_id: this.projectId,
      }).then(res => {
        // 转换数据格式，将API返回的数据转换为组件所需格式
        this.scoringCriteria = res.map(item => ({
          ...item,
          // 将API返回的score作为maxScore
          maxScore: item.score,
          // 初始化当前评分为0
          score: 0
        }));
      }).finally(() => {
        this.loading = false;
      })
    },

    // 获取作品详情
    getEntryDetail() {
      this.loading = true;
      detailEntry({
        entry_id: this.id,
      }).then(res => {
        // 这里可以将返回的数据赋值给 rateDetail
        this.rateDetail = res.data

        // 处理视频URL
        if (this.rateDetail.url) {
          this.rateDetail.url = this.processVideoUrl(this.rateDetail.url);
        }
      }).finally(() => {
        this.loading = false;
      })
    },

    // 查询作品评分详情
    getRateDetails() { 
      this.loading = true;
      detailRate({
        entry_id: this.id,
        judge_id: getRateId(),
      }).then(res => {
        // 处理评分详情回显
        if (res && res.evaluation && res.evaluation.details) {
          // 遍历评分细则，将已有的评分回显到对应项中
          this.scoringCriteria.forEach(criteria => {
            const detail = res.evaluation.details.find(d => d.evaluation_grade_id === criteria.id);
            if (detail) {
              criteria.score = detail.score;
            }
          });
        }
      }).finally(() => {
        this.loading = false;
      })
    },

    // 处理视频URL路径
    processVideoUrl(url) {
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

    // 获取作品列表（根据来源决定获取已评分还是待评分列表）
    getEntriesList() {  
      this.loading = true;
      
      // 根据isUpdate判断获取已评分列表还是待评分列表
      if (this.isUpdate) {
        // 获取已评分列表
        listReviewed({
          project_id: this.projectId,
          judge_id: Number(getRateId()),
          page_number: 1,
          page_size: 100
        }).then(res => {
          // 适配返回的数据结构，实际数据在 res.data 中
          this.entriesList = res.data || [];
          // 找到当前作品在列表中的索引
          this.currentIndex = this.entriesList.findIndex(entry => 
            entry.id == this.id
          );
        }).catch(error => {
          console.error('获取已评分作品列表失败:', error);
        }).finally(() => {
          this.loading = false;
        });
      } else {
        // 获取待评分列表
        listUnreviewed({
          project_id: this.projectId,
          judge_id: Number(getRateId()),
          page_number: 1,
          page_size: 100
        }).then(res => {
          // 适配返回的数据结构，实际数据在 res.data 中
          this.entriesList = res.data || [];
          // 找到当前作品在列表中的索引
          this.currentIndex = this.entriesList.findIndex(entry => 
            entry.id == this.id
          );
        }).catch(error => {
          console.error('获取未评分作品列表失败:', error);
        }).finally(() => {
          this.loading = false;
        });
      }
    },

    // 判断是否为视频文件
    isVideoFile(url) {
      if (!url) return false;
      const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
      const ext = this.getFileExtension(url).toLowerCase();
      return videoExtensions.includes(ext);
    },
    
    // 判断是否为PDF文件
    isPdfFile(url) {
      if (!url) return false;
      const ext = this.getFileExtension(url).toLowerCase();
      return ext === '.pdf';
    },
    
    // 判断是否为图片文件
    isImageFile(url) {
      if (!url) return false;
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      const ext = this.getFileExtension(url).toLowerCase();
      return imageExtensions.includes(ext);
    },

    // 获取文件名（不含扩展名）
    getFileNameWithoutExtension(url) {
      if (!url) return '';
      try {
        const urlObj = new URL(url, window.location.origin);
        const pathname = urlObj.pathname;
        const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
        const lastDotIndex = fileName.lastIndexOf('.');
        return lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
      } catch (e) {
        // 处理相对路径
        const lastSlashIndex = url.lastIndexOf('/');
        const fileName = lastSlashIndex !== -1 ? url.substring(lastSlashIndex + 1) : url;
        const lastDotIndex = fileName.lastIndexOf('.');
        return lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
      }
    },
    
    // 获取文件扩展名
    getFileExtension(url) {
      if (!url) return '';
      try {
        const urlObj = new URL(url, window.location.origin);
        const pathname = urlObj.pathname;
        const lastDotIndex = pathname.lastIndexOf('.');
        return lastDotIndex !== -1 ? pathname.substring(lastDotIndex) : '';
      } catch (e) {
        // 处理相对路径
        const lastDotIndex = url.lastIndexOf('.');
        return lastDotIndex !== -1 ? url.substring(lastDotIndex) : '';
      }
    },
    
    // 下载文件
    downloadFile(url, filename) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `作品文件${this.getFileExtension(url)}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // 新增：跳转到下一个作品
    goToNextEntry() {
      if (this.entriesList.length <= 1) return;
      
      // 计算下一个作品的索引（循环到第一个）
      const nextIndex = (this.currentIndex + 1) % this.entriesList.length;
      const nextEntry = this.entriesList[nextIndex];
      
      // 检查是否是当前作品（避免重复导航）
      if (nextEntry.id == this.id) {
        this.$message.info('这已经是当前作品');
        return;
      }
      
      // 跳转到下一个作品详情页
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          detailId: nextEntry.id,
          isUpdate: this.isUpdate  // 保持来源状态
        }
      }).catch(err => {
        // 处理导航错误（包括重复导航）
        if (err.name !== 'NavigationDuplicated') {
          console.error('导航错误:', err);
          this.$message.error('跳转失败');
        } else {
          this.$message.info('已经在该作品页面');
        }
      });
    },

    // 计算维度总分
    calculateDimensionTotal(group) {
      return group.reduce((total, item) => total + item.maxScore, 0);
    },

    // 提交评分
    submitScore() {
      // 验证是否所有评分项都有分数
      const hasUnscored = this.scoringCriteria.some(item => item.score === undefined || item.score === null);
      if (hasUnscored) {
        this.$message.warning('请为所有评分项打分');
        return;
      }

      this.loading = true;
      // 构造评分详情数据
      const scoreDetails = this.scoringCriteria.map(item => ({
        evaluation_grade_id: item.id,
        score: item.score
      }));

      // 构造提交数据
      const submitData = {
        entry_id: this.id,
        project_id: this.projectId,
        judge_id: Number(getRateId()), 
        score: this.totalScore,
        score_details: scoreDetails
      };


      // 调用评分提交接口
      submitRate(submitData).then(res => {
        if (res && (res.message === '评分提交成功' || res.message === '更新评分提交成功')) {
          this.$message.success(res.message);
          this.goToNextEntry()
          // this.goBack();
        } else {
          this.$message.error('评分提交失败');
        }
      }).catch(error => {
        console.error('评分提交出错:', error);
        this.$message.error('评分提交失败');
      }).finally(() => {
        this.loading = false;
      });
    },

    // 获取排序后的选项
    getSortedOptions(item) {
      const options = this.parseScoreOptions(item.description);
      const filteredOptions = options.filter(option => 
        option && option.text && option.score > 0
      );
      return filteredOptions.sort((a, b) => a.score - b.score);
    },
    
    // 解析评分选项
    parseScoreOptions(description) {
      return description.split('\n').map(line => {
        const match = line.match(/^(\d+)\s*分：(.*)$/);
        if (match) {
          return {
            score: parseInt(match[1]),
            text: `${match[1]} 分：${match[2]}`
          };
        }
        return {
          score: 0,
          text: line
        };
      });
    },
    
    // 获取上一个选项的分数
    getPrevOptionScore(item, currentOption) {
      const options = this.getSortedOptions(item);
      const index = options.findIndex(opt => opt.score === currentOption.score);
      return index > 0 ? options[index - 1].score : 0;
    },
    
    // 获取评分值（用于el-rate显示）
    getRateValue(moduleScore, optionScore, prevOptionScore) {
      // 如果模块得分大于等于当前选项分数，该选项的所有星星都亮
      if (moduleScore >= optionScore) {
        return optionScore - prevOptionScore;
      }
      
      // 如果模块得分在当前选项和上一个选项之间，计算应该亮几个星星
      if (moduleScore > prevOptionScore && moduleScore < optionScore) {
        return moduleScore - prevOptionScore;
      }
      
      // 其他情况不亮星星
      return 0;
    },

    // 重置评分
    resetScore() {
      this.scoringCriteria.forEach(item => {
        item.score = 0;
      });
      this.$message.info('评分已重置');
    }
  }
}
</script>

<style lang="scss" scoped>
/* 样式部分保持不变 */
.container {
  background-color: #FEFEFE;
  min-height: calc(100vh - 61px);

  .content {
    padding: 20px 60px;
    
    .main-layout {
      display: flex;
      margin-top: 20px;
      
      // 左侧作品信息区域 (60%宽度)
      .work-info-section {
        width: 60%;
        padding-right: 20px;
        
        .work-title-area {
          padding: 0;
          border-radius: 8px;
          
          .title-content {
            text-align: left;
            
            .work-title {
              margin: 0 0 15px 0;
              color: #333;
              font-size: 24px;
              text-align: left;
            }
            
            .project-info {
              display: flex;
              gap: 15px;
              justify-content: flex-start;
              
              .project-tag {
                font-size: 14px;
                padding: 5px 15px;
                height: auto;
              }
              
              .type-tag {
                font-size: 14px;
                padding: 5px 15px;
                height: auto;
              }
            }
          }
        }
        
        .work-video-area {
          height: 500px;
          margin-bottom: 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          
          .file-content-container {
            width: 100%;
            height: 100%;
            
            .video-container,
            .pdf-container,
            .image-container {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .video-container {
              background-color: #000;
            }
            
            .pdf-container {
              background-color: #f5f5f5;
            }
            
            .image-container {
              background-color: #000;
            }
            
            .file-download-container {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #fafafa;
              
              .file-info-card {
                text-align: center;
                padding: 30px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                max-width: 500px;
                
                .file-icon {
                  font-size: 64px;
                  color: #409EFF;
                  margin-bottom: 20px;
                }
                
                .file-details {
                  .file-name {
                    font-size: 20px;
                    color: #333;
                    margin: 0 0 10px 0;
                    word-break: break-all;
                  }
                  
                  .file-type {
                    font-size: 16px;
                    color: #666;
                    margin: 0 0 10px 0;
                  }
                  
                  .file-action-tip {
                    font-size: 14px;
                    color: #999;
                    margin: 0 0 20px 0;
                  }
                }
              }
            }
          }
        }

        .navigation-area {
          text-align: end;
          margin-bottom: 20px;
          
          .navigation-button {
            display: inline-block;
          }
        }
        
        .work-description-area {
          min-height: 100px;
          border-radius: 8px;
          padding: 0;
          
          .description-content {
            text-align: left;
            
            .description-title {
              margin-top: 0;
              color: #333;
              font-size: 20px;
              text-align: left;
            }
            
            .description-text {
              line-height: 1.6;
              color: #666;
              font-size: 16px;
              text-align: left;
            }
          }
        }
      }
      
      // 右侧打分区域 (40%宽度)
      .scoring-section {
        width: 40%;
        padding-left: 20px;
        
        .scoring-form-area {
          min-height: 500px;
          border-radius: 8px;
          padding: 20px;
          background-color: #f9f9f9;
          
          .scoring-content {
            .scoring-title {
              margin-top: 0;
              color: #333;
              font-size: 20px;
              text-align: left;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            
            .scoring-dimensions {
              .dimension-group {
                margin-bottom: 25px;
                background: white;
                border-radius: 6px;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
                padding: 15px;
                
                .dimension-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 15px;
                  padding-bottom: 10px;
                  border-bottom: 1px solid #f0f0f0;
                  
                  .dimension-name {
                    margin: 0;
                    color: #333;
                    font-size: 18px;
                    font-weight: 600;
                  }
                  
                  .dimension-total-score {
                    font-size: 12px;
                    padding: 3px 8px;
                  }
                }
                
                .dimension-items {
                  .scoring-item {
                    margin-bottom: 15px;
                    padding: 12px;
                    border-radius: 4px;
                    background-color: #fafafa;
                    transition: all 0.3s;
                    
                    &:last-child {
                      margin-bottom: 0;
                    }
                    
                    &:hover {
                      background-color: #f0f9ff;
                      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
                    }
                    
                    .scoring-item-content {
                      .item-header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 8px;
                        
                        .item-title {
                          flex: 1;
                          display: flex;
                          align-items: center;
                          
                          .item-name {
                            font-weight: 500;
                            color: #333;
                            margin-right: 8px;
                          }
                          
                          .item-score {
                            font-size: 12px;
                            color: #999;
                          }
                        }
                        
                        .item-slider {
                          width: 200px;
                          margin-left: 15px;
                          
                          ::v-deep .el-slider {
                            .el-slider__runway {
                              margin: 8px 0;
                            }
                            
                            .el-slider__input {
                              width: 60px;
                            }
                          }
                        }
                      }
                      
                      .item-description {
                        font-size: 13px;
                        color: #666;
                        margin-bottom: 10px;
                        line-height: 1.4;
                      }
                      
                      .score-options {
                        .score-option {
                          display: flex;
                          align-items: center;
                          margin-bottom: 6px;
                          padding: 6px;
                          border-radius: 3px;
                          transition: background-color 0.3s;
                          
                          &.active {
                            background-color: #e6f7ff;
                          }
                          
                          ::v-deep .el-rate {
                            margin-right: 12px;
                            
                            .el-rate__icon {
                              font-size: 14px;
                            }
                            
                            .el-rate__decimal {
                              color: #F7BA2A;
                            }
                          }
                          
                          .score-text {
                            font-size: 13px;
                            color: #666;
                            flex: 1;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            
            .total-score-summary {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 20px;
              padding-top: 15px;
              border-top: 1px solid #eee;
              
              .total-score-display {
                display: flex;
                align-items: center;
                
                .label {
                  font-size: 16px;
                  font-weight: 500;
                  color: #333;
                  margin-right: 10px;
                }
                
                .total-score-tag {
                  font-size: 16px;
                  padding: 8px 15px;
                  height: auto;
                }
              }
              
              .scoring-actions {
                .el-button {
                  margin-left: 10px;
                }
              }
            }
          }
        }
      }
    }
  }
}



// 响应式设计，小屏幕时改为垂直布局
@media (max-width: 1200px) {
  .scoring-section {
    width: 100%;
    padding-left: 0;
    margin-top: 20px;
    
    .scoring-form-area {
      min-height: auto;
    }
  }
  
  .scoring-section .scoring-form-area .scoring-content .scoring-dimensions .dimension-group .dimension-items .scoring-item .scoring-item-content .item-header {
    flex-direction: column;
    align-items: flex-start;
    
    .item-slider {
      width: 100%;
      margin-left: 0;
      margin-top: 10px;
    }
  }
  
  .total-score-summary {
    flex-direction: column;
    
    .total-score-display {
      margin-bottom: 15px;
    }
    
    .scoring-actions {
      .el-button {
        margin: 0 5px;
      }
    }
  }
}
</style>