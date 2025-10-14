<template>
  <div class="container">
    <div class="content" v-loading="loading">
      <h1>评分入口</h1>
      <div class="describe">
        {{ describe }}
      </div>

      <!-- 添加空状态显示 -->
      <div v-if="!loading && rateList.length === 0" class="empty-state">
        <el-empty description="暂无评分项目">
          <el-button type="primary" @click="getRateList">重新加载</el-button>
        </el-empty>
      </div>

      <div v-else class="card-row">
        <div class="card" v-for="(item, index) in rateList" :key="index" @click="handleClick(item.id)">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <div :ref="`chart${index}`" class="charts" :style="{ height: '350px', backgroundColor: '#f5f7fa' }">
            </div>

            <div class="info">
              <div class="label">大赛名称</div>
              <div class="title">{{ item.name }}</div>
              <div class="label">类型</div>
              <div class="type"> {{ item.type }}</div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listRate } from '@/apis/rate';
import { getRateId } from '@/utils/auth';
import * as echarts from 'echarts';

export default {
  data() {
    return {
      rateList: [],
      charts: [],
      describe: '一、大赛名称 中国解剖学会首届AI应用能力大赛 二、大赛主题 “智启解剖·AI赋能教与学” 三、组织机构 主办单位：中国解剖学会 承办单位：中山大学医学院（深圳）和 广东省解剖学会',
      loading: false,
      isNavigating: false // 添加这个属性以避免重复点击
    }
  },
  created() {
    this.getRateList();
  },
  methods: {
    getRateList() {
      this.loading = true;
      const data = {
        judge_id: getRateId()
        // judge_id: this.$store.state.user.userInfo.id
      }
      listRate(data).then(res => {
        this.rateList = res;
        this.$nextTick(() => {
          this.initCharts();
        });
        this.loading = false;
        
      })
    },

    // 点击事件
    handleClick(id, type) {
      // 防止重复点击
      if (this.isNavigating) return;
      
      this.isNavigating = true;
      
      this.$router.push({
        path: '/rate/rateList',
        query: {
          projectId: id,
          isUpdate: type || undefined
        }
      }).catch(err => {
        // 忽略导航取消错误
        if (err.name !== 'NavigationDuplicated' && 
            err.name !== 'NavigationCancelled') {
          console.error(err);
        }
      }).finally(() => {
        // 延迟重置状态，防止连续点击
        setTimeout(() => {
          this.isNavigating = false;
        }, 1000);
      });
    },


    // 初始化图表
    initCharts() {
      this.rateList.forEach((item, index) => {
        const chartDom = this.$refs[`chart${index}`][0];
        const myChart = echarts.init(chartDom);
        
        const option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          series: [
            {
              name: '评价情况',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 20,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: item.reviewed_count, name: '已评分  ' + item.reviewed_count },
                { value: item.unreviewed_count, name: '待评分  ' + item.unreviewed_count }
              ]
            }
          ]
        };
        
        myChart.setOption(option);

        myChart.on('click', (params) => {
          if (params.dataIndex == 0) {
            this.handleClick(item.id, 0);
          } else {
            this.handleClick(item.id, 1);
          }
        });
        this.charts.push(myChart);
      });
    }
  },
  beforeDestroy() {
    // 销毁图表实例，防止内存泄漏
    this.charts.forEach(chart => {
      chart.dispose();
    });
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #FEFEFE;
  min-height: calc(100vh - 61px);

  .content {
    padding: 40px 200px;

    h1 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .describe {
      font-size: 16px;
      color: #888888;
      margin-bottom: 40px;
    }

    .empty-state {
      text-align: center;
      padding: 40px 0;
    }

    .card-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 60px;

      .card {
        width: 350px;
        cursor: pointer;

        .info {
          padding: 20px;
          text-align: left;
          
          .label {
            color: #888888;
            font-size: 12px;
          }

          .title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
}
</style>