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
            <!-- 演示视频区域 -->
            <div class="video-container" v-if="rateDetail.url">
              <video 
                :src="rateDetail.url" 
                controls
                preload="metadata"
                style="width: 100%; height: 100%; object-fit: contain;">
                您的浏览器不支持视频播放。
              </video>
            </div>
            <div class="video-placeholder" v-else>
              <el-empty description="暂无视频"></el-empty>
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
              
              <div class="scoring-items">
                <div 
                  class="scoring-item" 
                  v-for="item in scoringCriteria" 
                  :key="item.id">
                  <div class="scoring-item-header">
                    <h4 class="scoring-item-title">{{ item.name }} ({{ item.weight }}分)</h4>
                    <!-- 每个模块添加一个总评分控件，用于设置该模块的总分 -->
                    <div class="module-rate">
                      <el-slider
                        v-model="item.score"
                        :min="0"
                        :max="item.weight"
                        :step="1"
                        show-input>
                      </el-slider>
                    </div>
                  </div>
                  
                  <div class="scoring-item-content">
                    <div 
                      class="score-option"
                      v-for="(option, index) in getSortedOptions(item)"
                      :key="index"
                      :class="{ active: item.score >= option.score }">
                      <!-- 使用el-rate组件显示每个选项的星星，每行星星数都等于模块权重 -->
                      <el-rate
                        :value="getRateValue(item.score, option.score, getPrevOptionScore(item, option))"
                        :max="item.maxScore"
                        :disabled="true">
                      </el-rate>
                      <span class="score-text">{{ option.text }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="total-score">
                <el-tag type="success" class="total-score-tag">
                  总分: {{ totalScore }} 分
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
</template>

<script>
import { detailDimensions, detailEntry, submitRate, listUnreviewed, listReviewed } from '@/apis/rate'
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

  created() {
    // 根据isUpdate判断是否是已评分作品详情页
    
    if (this.id) {
      this.getRateDetail()
      this.getEntryDetail()
      // 添加获取作品列表
      this.getEntriesList()
    } else {
      
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
        evaluation_record_id: item.id,
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
          
          .video-container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #000;
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
          
          .scoring-content {
            .scoring-title {
              margin-top: 0;
              color: #333;
              font-size: 20px;
              text-align: left;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            
            .scoring-items {
              .scoring-item {
                margin-bottom: 20px;
                
                .scoring-item-header {
                  .scoring-item-title {
                    margin: 0 0 10px 0;
                    color: #333;
                    font-size: 16px;
                    text-align: left;
                  }
                  
                  .module-rate {
                    margin: 10px 0;
                  }
                }
                
                .scoring-item-content {
                  .score-option {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                    padding: 8px;
                    border-radius: 4px;
                    transition: background-color 0.3s;
                    
                    &.active {
                      background-color: #f0f9ff;
                    }
                    
                    ::v-deep .el-rate {
                      margin-right: 15px;
                      
                      .el-rate__icon {
                        font-size: 16px;
                      }
                      
                      .el-rate__decimal {
                        color: #F7BA2A;
                      }
                    }
                    
                    .score-text {
                      font-size: 14px;
                      color: #666;
                    }
                  }
                }
              }
            }
            
            .total-score {
              text-align: center;
              margin: 20px 0;
              
              .total-score-tag {
                font-size: 18px;
                padding: 12px 20px;
                height: auto;
              }
            }
            
            .scoring-actions {
              text-align: center;
            }
          }
        }
      }
    }
  }
}

// 响应式设计，小屏幕时改为垂直布局
@media (max-width: 1200px) {
  .container .content .main-layout {
    flex-direction: column;
    
    .work-info-section {
      width: 100%;
      padding-right: 0;
      margin-bottom: 20px;
      
      .work-video-area {
        height: 300px;
      }
    }
    
    .scoring-section {
      width: 100%;
      padding-left: 0;
    }
  }
}
</style>