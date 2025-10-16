<template>
  <div class="container" v-loading="pageLoading" element-loading-text="榜单数据加载中...">
    <div class="top-container">
      <el-page-header @back="goBack" content="榜单查看"></el-page-header>
    </div>
    
    <div class="top-container project">
      <!-- 赛道选择 -->
      <div class="track-tabs">
        <div class="section-title">选择赛道</div>
        <el-radio-group 
          v-model="activeTrack" 
          @change="handleTrackChange"
          class="track-selector"
        >
          <el-radio-button label="-1">全部</el-radio-button>
          <el-radio-button label="0">学生赛道</el-radio-button>
          <el-radio-button label="1">教师赛道</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 项目选择 -->
      <div class="project-tabs" v-if="projectList.length > 0">
        <div class="section-title project-section">选择项目</div>
        <div class="project-list-container" :class="{ 'all-track': activeTrack === '-1' }">
          <div class="project-list-wrapper" ref="projectListWrapper">
            <div 
              v-for="(item, index) in projectList" 
              :key="item.id"
              class="project-item"
              :class="{ active: activeProject == item.id }"
              @click="handleProjectClick(item.id)"
            >
              <span class="project-name">{{ item.name }}</span>
            </div>
          </div>
          <div 
            class="scroll-control scroll-left" 
            v-if="showScrollLeft"
            @click="scrollProjects('left')"
          >
            <i class="el-icon-arrow-left"></i>
          </div>
          <div 
            class="scroll-control scroll-right" 
            v-if="showScrollRight"
            @click="scrollProjects('right')"
          >
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>

      <div class="btn">
        <!-- 弹出层按钮 -->
        <el-button 
          type="primary" 
          @click="dialogVisible = true" 
          v-show="checkLogin()"
          icon="el-icon-medal"
          plain
          round
        >
          我的排名
        </el-button>
        <!-- 弹出层 -->
        <el-dialog
          title="我的排名"
          :visible.sync="dialogVisible"
          width="70%"
          :before-close="handleClose"
          custom-class="ranking-dialog"
          append-to-body
          :modal-append-to-body="false"
        >
          <div class="score-content">
            <div class="user-info" v-if="userInfo">
              <div class="user-header">
                <div class="user-avatar">
                  <i class="el-icon-user-solid"></i>
                </div>
                <div class="user-details">
                  <h3>{{ userInfo.name }}</h3>
                  <p>{{ userInfo.organization_name }} - {{ userInfo.department }}</p>
                </div>
              </div>
            </div>
            
            <div class="score-items">
              <div 
                class="score-item" 
                v-for="(item, index) in userEntryList" 
                :key="index"
              >
                <el-card class="score-card">
                  <div slot="header" class="score-card-header">
                    <span class="project-name">{{ item.project_name }}</span>
                    <el-tag size="small" type="success">{{ item.project_type }}</el-tag>
                  </div>
                  
                  <el-row :gutter="20">
                    <el-col :span="16">
                      <el-descriptions :column="2" size="small" border>
                        <el-descriptions-item label="作品名称" min-width="120">
                          {{ item.entries[0].title || '暂无作品名称' }}
                        </el-descriptions-item>
                        <el-descriptions-item label="提交时间" min-width="120">
                          {{ item.entries[0].submit_time }}
                        </el-descriptions-item>
                        <el-descriptions-item label="排名" min-width="120">
                          <el-tag 
                            type="warning" 
                            v-if="item.entries[0].has_score && item.entries[0].rank"
                          >
                            第 {{ item.entries[0].rank }} 名
                          </el-tag>
                          <el-tag v-else>暂无排名</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="平均分" min-width="120">
                          <span 
                            class="score-value" 
                            v-if="item.entries[0].has_score && item.entries[0].score"
                          >
                            {{ item.entries[0].score | formatScore }} 分
                          </span>
                          <span v-else>暂无评分</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="评分人数" min-width="120">
                          {{ item.entries[0].count }} 人
                        </el-descriptions-item>
                        <!-- <el-descriptions-item label="参赛总人数" min-width="120">
                          {{ item.total_participants }} 人
                        </el-descriptions-item> -->
                      </el-descriptions>
                    </el-col>
                    <el-col :span="8">
                      <div class="score-chart-container">
                        <div 
                          class="score-chart" 
                          :ref="'scoreChart'+index" 
                          :style="{ width: '100%', height: '200px' }"
                        ></div>
                        <div class="chart-legend" v-if="item.entries[0].has_score">
                          <div class="legend-item">
                            <span class="legend-color" style="background-color: #409EFF;"></span>
                            <span>当前得分</span>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </div>
            </div>
          </div>
          
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false" round>确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>

    <div class="entry-container">
      <div class="ranking-header">
        <h2 class="ranking-title">{{ currentProjectName }} 榜单</h2>
        <div class="ranking-stats">
          <el-tag style="height: auto;">总参赛作品数: {{ total }} </el-tag>
        </div>
      </div>
      
      <el-table
        :data="entryList"
        style="width: 100%"
        stripe
        :header-cell-style="{background:'#f8f9fa', color:'#495057'}"
      >
        <el-table-column
          prop="rank"
          label="排名"
          width="80"
          align="center">
          <template slot-scope="scope">
            <div class="rank-cell">
              <span 
                class="rank-number" 
                :class="{
                  'first': scope.row.rank === 1,
                  'second': scope.row.rank === 2,
                  'third': scope.row.rank === 3
                }"
              >
                {{ scope.row.rank }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="project_name"
          label="项目"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="title"
          label="作品名"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="score"
          label="评分"
          width="100"
          align="center">
          <template slot-scope="scope">
            <span class="score-cell">{{ scope.row.score | formatScore }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          label="评分人数"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="participant_name"
          label="作者"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="organization_name"
          label="所属学校"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="organization_department"
          label="学院"
          min-width="150">
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50]"
        :pager-count="5">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { formOptions, getProjectsByTrack } from '@/apis/upload';
import { listEntry, listUserEntry } from '@/apis/score';
// 引入 ECharts
import * as echarts from 'echarts';
import { getToken } from '@/utils/auth';

export default {
  data() {
    return {
      activeTrack: '-1', // '-1'表示全部赛道
      activeProject: null,
      dialogVisible: false,
      chartInstances: [],
      // 项目列表
      projectList: [],
      // 当前项目名称
      currentProjectName: '',
      // 个人作品列表
      userEntryList: [],
      // 用户信息
      userInfo: null,
      // 作品列表
      entryList: [],
      // 分页
      total: 0,
      currentPage: 1,
      pageSize: 10,
      // 加载状态
      pageLoading: false,
      // 滚动控制
      showScrollLeft: false,
      showScrollRight: false
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
    this.getProjectList()
    this.getUserEntryList()
  },
  
  mounted() {
    this.$nextTick(() => {
      this.checkScroll();
    });
    window.addEventListener('resize', this.checkScroll);
  },
  
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScroll);
  },

  methods: {
    // 处理赛道切换
    handleTrackChange() {
      this.pageLoading = true;
      
      // 根据选择的赛道获取对应的项目列表
      let trackParam;
      if (this.activeTrack === '-1') {
        trackParam = '全部';
      } else if (this.activeTrack === '0') {
        trackParam = '学生赛道';
      } else if (this.activeTrack === '1') {
        trackParam = '教师赛道';
      } else {
        trackParam = this.activeTrack;
      }
      
      getProjectsByTrack(trackParam).then(res => {
        this.projectList = res;
        if (this.projectList.length > 0) {
          this.activeProject = this.projectList[0].id;
          this.currentProjectName = this.projectList[0].name;
          this.getEntryList();
        } else {
          this.activeProject = null;
          this.currentProjectName = '';
          this.entryList = [];
          this.total = 0;
        }
      }).finally(() => {
        this.pageLoading = false;
        this.$nextTick(() => {
          this.checkScroll();
        });
      });
    },

    // 处理项目切换
    handleProjectClick(projectId) {
      const project = this.projectList.find(p => p.id === projectId);
      if (project) {
        this.activeProject = projectId;
        this.currentProjectName = project.name;
        this.currentPage = 1;
        this.getEntryList();
      }
    },

    goBack() {
      this.$router.go(-1)
    },

    // 获取项目列表
    getProjectList() {
      this.pageLoading = true
      // 使用新的API根据赛道获取项目列表
      getProjectsByTrack('全部').then(res => {
        this.projectList = res
        if (this.projectList.length > 0) {
          this.activeProject = this.projectList[0].id;
          this.currentProjectName = this.projectList[0].name;
          this.getEntryList()
        }
      }).finally(() => {
        this.pageLoading = false
        this.$nextTick(() => {
          this.checkScroll();
        });
      })
    },

    // 获取个人作品列表
    getUserEntryList() {
      if (!this.checkLogin()) {
        return;
      }
      
      // 不设置loading，避免与榜单加载冲突
      listUserEntry({
        participantID: getToken(),
      }).then(res => {
        if (res && res.projects) {
          this.userEntryList = res.projects
        }
        // 保存用户信息
        if (res && res.participant) {
          this.userInfo = res.participant
        }
      }).catch(error => {
        this.$message.error('获取个人作品列表失败');
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

    // 获取项目下的作品列表
    getEntryList() {
      if (!this.activeProject) return;
      
      this.pageLoading = true
      listEntry({
        project_id: this.activeProject,
        page_size: this.pageSize,
        page_number: this.currentPage
      }).then(res => {
        this.entryList = res.data
        this.total = res.total_count
      }).finally(() => {
        this.pageLoading = false
      })
    },

    // 关闭弹出层
    handleClose(done) {
      // 销毁图表实例以避免内存泄漏
      this.chartInstances.forEach(chart => {
        chart.dispose();
      });
      this.chartInstances = [];
      done();
    },

    // 初始化图表
    initChart(index) {
      const item = this.userEntryList[index];
      if (!item) return;

      // 确保 DOM 已经渲染
      this.$nextTick(() => {
        const chartDom = this.$refs['scoreChart' + index][0];
        if (!chartDom) return;

        // 销毁已存在的图表实例
        if (this.chartInstances[index]) {
          this.chartInstances[index].dispose();
        }

        // 初始化新的图表实例
        const myChart = echarts.init(chartDom);
        this.chartInstances[index] = myChart;

        // 获取项目总分（假设为100分）
        const maxScore = 100;
        const currentScore = item.entries[0].score ? parseFloat(item.entries[0].score) : 0;
        
        // 图表配置
        const option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}分'
          },
          series: [
            {
              type: 'gauge',
              startAngle: 180,
              endAngle: 0,
              center: ['50%', '80%'],
              radius: '90%',
              min: 0,
              max: maxScore,
              splitNumber: 5,
              axisLine: {
                lineStyle: {
                  width: 6,
                  color: [
                    [0.5, '#FF6E76'],
                    [0.8, '#FFD700'],
                    [1, '#67C23A']
                  ]
                }
              },
              pointer: {
                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                length: '12%',
                width: 10,
                offsetCenter: [0, '-60%'],
                itemStyle: {
                  color: 'auto'
                }
              },
              axisTick: {
                length: 6,
                lineStyle: {
                  color: 'auto',
                  width: 1
                }
              },
              splitLine: {
                length: 12,
                lineStyle: {
                  color: 'auto',
                  width: 2
                }
              },
              axisLabel: {
                color: '#464646',
                fontSize: 12,
                distance: -30,
                formatter: function (value) {
                  return value;
                }
              },
              title: {
                offsetCenter: [0, '-20%'],
                fontSize: 14
              },
              detail: {
                fontSize: 20,
                offsetCenter: [0, '0%'],
                valueAnimation: true,
                formatter: function (value) {
                  return value.toFixed(1);
                },
                color: 'auto'
              },
              data: [{
                value: currentScore,
                name: '平均分'
              }]
            }
          ]
        };

        // 使用配置项和数据显示图表
        myChart.setOption(option);

        // 监听窗口大小变化，自适应图表
        const resizeHandler = () => {
          myChart.resize();
        };
        window.addEventListener('resize', resizeHandler);
        
        // 保存resize处理函数，以便销毁时移除
        myChart._resizeHandler = resizeHandler;
      });
    },

    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getEntryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getEntryList()
    },
    
    // 检查是否需要显示滚动按钮
    checkScroll() {
      const wrapper = this.$refs.projectListWrapper;
      if (wrapper) {
        this.showScrollLeft = wrapper.scrollLeft > 0;
        this.showScrollRight = wrapper.scrollLeft + wrapper.clientWidth < wrapper.scrollWidth;
      }
    },
    
    // 滚动项目列表
    scrollProjects(direction) {
      const wrapper = this.$refs.projectListWrapper;
      if (wrapper) {
        const scrollAmount = 200;
        if (direction === 'left') {
          wrapper.scrollLeft -= scrollAmount;
        } else {
          wrapper.scrollLeft += scrollAmount;
        }
        this.$nextTick(() => {
          this.checkScroll();
        });
      }
    }
  },

  watch: {
    // 监听弹窗显示状态变化
    dialogVisible(newVal) {
      if (newVal) {
        // 弹窗打开后初始化图表
        this.$nextTick(() => {
          setTimeout(() => {
            this.userEntryList.forEach((_, index) => {
              this.initChart(index);
            });
          }, 100);
        });
      } else {
        // 弹窗关闭时销毁图表
        this.chartInstances.forEach(chart => {
          if (chart && chart._resizeHandler) {
            window.removeEventListener('resize', chart._resizeHandler);
          }
          chart.dispose();
        });
        this.chartInstances = [];
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;

  .top-container {
    width: 90%;
    max-width: 1400px;
    margin: 20px 0 0;

    &.project {
      position: relative;
      margin-top: 30px;
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 15px;
        
        &.project-section {
          margin-top: 25px;
        }
      }

      .track-selector {
        ::v-deep .el-radio-button {
          .el-radio-button__inner {
            border: 1px solid #dcdfe6;
            border-left: 0;
            background: #f8f9fa;
            color: #666;
            
            &:hover {
              color: #409eff;
            }
          }
          
          &:first-child {
            .el-radio-button__inner {
              border-left: 1px solid #dcdfe6;
              border-radius: 4px 0 0 4px;
            }
          }
          
          &:last-child {
            .el-radio-button__inner {
              border-radius: 0 4px 4px 0;
            }
          }
          
          &.is-active {
            .el-radio-button__inner {
              background-color: #409eff;
              border-color: #409eff;
              color: white;
            }
          }
        }
      }

      .project-tabs {
        .project-list-container {
          position: relative;
          
          &.all-track {
            .project-list-wrapper {
              max-height: 120px;
              overflow-y: auto;
              
              .project-item {
                
                @media (max-width: 768px) {
                  width: calc(50% - 10px);
                }
              }
            }
          }
          
          .project-list-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            overflow-x: hidden;
            padding: 5px;
            
            .project-item {
              padding: 10px 20px;
              background: #f8f9fa;
              border-radius: 6px;
              cursor: pointer;
              transition: all 0.3s;
              border: 1px solid #e9ecef;
              
              &:hover {
                background: #e3f2fd;
                border-color: #bbdefb;
              }
              
              &.active {
                background: #409eff;
                color: white;
                border-color: #409eff;
              }
              
              .project-name {
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
          
          .scroll-control {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 30px;
            height: 30px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            z-index: 10;
            transition: all 0.3s;
            
            &:hover {
              background: white;
              box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
            }
            
            &.scroll-left {
              left: -15px;
            }
            
            &.scroll-right {
              right: -15px;
            }
          }
        }
      }

      .btn {
        position: absolute;
        right: 25px;
        top: 25px;
        z-index: 10;
      }
    }
  }
  
  .entry-container {
    width: 90%;
    max-width: 1400px;
    margin: 30px 0;
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    
    .ranking-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      .ranking-title {
        margin: 0;
        color: #333;
        font-size: 22px;
        font-weight: 600;
      }
      
      .ranking-stats {
        ::v-deep .el-tag {
          font-size: 14px;
          padding: 8px 15px;
          background-color: #e3f2fd;
          border-color: #bbdefb;
          color: #1976d2;
        }
      }
    }
    
    ::v-deep .el-table {
      border-radius: 8px;
      overflow: hidden;
      
      .rank-cell {
        display: flex;
        justify-content: center;
        
        .rank-number {
          display: inline-block;
          width: 26px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          border-radius: 6px;
          font-weight: 600;
          color: #666;
          background: #f8f9fa;
          
          &.first {
            background: #fff9e6;
            color: #e6a23c;
            border: 1px solid #f9d87a;
          }
          
          &.second {
            background: #f0f5ff;
            color: #6495ed;
            border: 1px solid #b0cfff;
          }
          
          &.third {
            background: #fff0f0;
            color: #f56c6c;
            border: 1px solid #fab6b6;
          }
        }
      }
      
      .score-cell {
        font-weight: 600;
        color: #409EFF;
        font-size: 16px;
      }
    }
  }
  
  .pagination {
    margin: 30px 0 60px;
    width: 90%;
    max-width: 1400px;
    
    ::v-deep .el-pagination {
      display: flex;
      justify-content: center;
      
      .el-pagination__total {
        margin-right: 20px;
      }
    }
  }
  
  .user-info {
    margin-bottom: 30px;
  }
}

// 弹窗样式
::v-deep .ranking-dialog {
  .el-dialog__header {
    background: #409eff;
    color: white;
    // border-radius: 8px 8px 0 0;
    
    .el-dialog__title {
      color: white;
      font-weight: 600;
    }
    
    .el-dialog__headerbtn .el-dialog__close {
      color: white;
    }
  }
  
  .el-dialog__body {
    padding: 25px;
    max-height: 70vh;
    overflow-y: auto;
  }
}

.user-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #409eff;
  border-radius: 8px;
  color: white;
  margin-bottom: 25px;
  
  .user-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    
    i {
      font-size: 30px;
    }
  }
  
  .user-details {
    h3 {
      margin: 0 0 8px 0;
      font-size: 22px;
      font-weight: 600;
    }
    
    p {
      margin: 0;
      font-size: 16px;
      opacity: 0.9;
    }
  }
}

.score-items {
  .score-item {
    margin-bottom: 25px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    ::v-deep .score-card {
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      border: none;
      
      .score-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background: #f8fafc;
        border-bottom: 1px solid #eee;
        
        .project-name {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }
      }
      
      .el-card__body {
        padding: 20px;
      }
    }
  }
}

.score-chart-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .score-chart {
    flex: 1;
    min-height: 200px;
  }
  
  .chart-legend {
    text-align: center;
    margin-top: 10px;
    
    .legend-item {
      display: inline-flex;
      align-items: center;
      margin: 0 10px;
      
      .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }
  }
}

.score-value {
  font-weight: 600;
  color: #409EFF;
  font-size: 18px;
}

// 响应式设计
@media (max-width: 768px) {
  .container {
    padding: 10px;
    
    .top-container {
      width: 95%;
      
      &.project {
        padding: 15px;
        
        .btn {
          position: static;
          margin-top: 15px;
          text-align: center;
        }
        
        .project-list-container {
          &.all-track {
            .project-list-wrapper {
              max-height: none;
              
              .project-item {
                width: calc(50% - 10px);
              }
            }
          }
        }
      }
    }
    
    .entry-container {
      width: 95%;
      padding: 15px;
      
      .ranking-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      ::v-deep .el-table {
        font-size: 12px;
        
        .el-table__cell {
          padding: 8px 0;
        }
      }
    }
    
    .pagination {
      width: 95%;
      
      ::v-deep .el-pagination {
        .el-pagination__sizes,
        .el-pagination__jump {
          display: none;
        }
      }
    }
  }
  
  ::v-deep .ranking-dialog {
    width: 95% !important;
    
    .el-dialog__body {
      padding: 15px;
    }
  }
  
  .user-header {
    flex-direction: column;
    text-align: center;
    
    .user-avatar {
      margin-right: 0;
      margin-bottom: 15px;
    }
  }
  
  .score-items {
    ::v-deep .el-row {
      flex-direction: column;
      
      .el-col {
        width: 100%;
        margin-bottom: 15px;
      }
    }
  }
}
</style>