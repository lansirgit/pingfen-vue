<template>
  <div class="container">
    <div class="content">
      <h1>{{ projectName }}</h1>

      <el-tabs type="border-card" v-model="activeTab" @tab-click="handleClick" v-loading="loading">
        <el-tab-pane label="已评分" name="reviewed">
          <el-table :data="reviewedList" style="width: 100%" stripe>
            <el-table-column prop="title" label="作品名称" />
            <el-table-column prop="project_type" label="所属类别" />
            <el-table-column prop="score" label="评分">
              <template #default="scope">
                <el-tag :type="getScoreTagType(scope.row.score)">
                  {{ scope.row.score }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="score_time" label="评分时间" />
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button type="warning" size="mini" plain @click="handleDetail(scope.row.id, true)">修改评分</el-button>


              </template>
            </el-table-column>
          </el-table>

          <div class="pagination" style="padding: 40px;">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="reviewedTotal"
              :current-page.sync="reviewedCurrentPage"
              :page-size.sync="pageSize"
              @size-change="handleSizeChange"
              @current-change="handleReviewedCurrentChange">
            </el-pagination>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="待评分" name="unreviewed">
          <template #label>
            <span>待评分</span>
            <el-badge :value="unreviewedTotal" v-show="unreviewedTotal > 0" />
          </template>
          
          <div class="table-container" style="display: flex; align-items: center; justify-content: space-between; gap: 20px;">
            <el-table :data="unreviewedList" style="width: 60%" stripe>
              <el-table-column prop="title" label="作品名称" />
              <el-table-column prop="project_type" label="所属项目" />
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button type="primary" size="mini" plain @click="handleDetail(scope.row.id, false)">评分</el-button>


                </template>
              </el-table-column>
            </el-table>
            
            <div style="width: 40%;">
              <div class="title" style="font-size: 20px;">
                待评分作品数
              </div>
              <div class="num-wrapper" :class="{ 'zero': unreviewedTotal === 0 }">
                <div class="num">
                  {{ unreviewedTotal }}
                </div>
              </div>
            </div>
          </div>

          <div class="pagination" style="padding: 40px;">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="unreviewedTotal"
              :current-page.sync="unreviewedCurrentPage"
              :page-size.sync="pageSize"
              @size-change="handleSizeChange"
              @current-change="handleUnreviewedCurrentChange">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { listReviewed, listUnreviewed } from '@/apis/rate';

export default {
  data() {
    return {
      projectId: this.$route.query.projectId,
      isUpdate: this.$route.query.isUpdate || 0,
      projectName: '',
      activeTab: 'reviewed',
      loading: false,

      // 分页
      pageSize: 10,
      reviewedTotal: 0,
      unreviewedTotal: 0,
      reviewedCurrentPage: 1,
      unreviewedCurrentPage: 1,

      reviewedList: [],
      unreviewedList: [],
    }
  },
  
  created() {
    this.getRateList();
  },

  mounted() {

    // 初始tab
    if(this.isUpdate==0) {
      this.activeTab = 'reviewed';
    } else {
      this.activeTab = 'unreviewed';
    }
    
  },
  
  methods: {
    // 获取评分列表
    getRateList() {
      this.loading = true;
      
      // 分别获取已评分和待评分列表
      Promise.all([
        this.fetchReviewedList(),
        this.fetchUnreviewedList()
      ]).then(() => {
        this.loading = false;
      }).catch(error => {
        console.error('获取评分列表失败:', error);
        this.loading = false;
        this.$message.error('获取数据失败');
      });
    },

    // 获取已评分列表
    fetchReviewedList() {
      const data = {
        project_id: this.projectId,
        page_number: this.reviewedCurrentPage,
        page_size: this.pageSize,
        judge_id: 19
      };

      return listReviewed(data).then(res => {
        this.reviewedList = res.data || [];
        if (this.reviewedList.length > 0 && !this.projectName) {
          this.projectName = this.reviewedList[0].project_name;
        }
        this.reviewedTotal = res.total_count || 0;
      }).catch(error => {
        this.reviewedList = [];
        this.reviewedTotal = 0;
        throw error;
      });
    },

    // 获取待评分列表
    fetchUnreviewedList() {
      const data = {
        project_id: this.projectId,
        page_number: this.unreviewedCurrentPage,
        page_size: this.pageSize,
        judge_id: 19
      };

      return listUnreviewed(data).then(res => {
        this.unreviewedList = res.data || [];
        this.unreviewedTotal = res.total_count || this.unreviewedList.length || 0;
      }).catch(error => {
        console.error('获取待评分列表失败:', error);
        this.unreviewedList = [];
        this.unreviewedTotal = 0;
        throw error;
      });
    },

    // 切换tab
    handleClick(tab) {
      this.activeTab = tab.name;
      
    },

    // 跳转评分详情页面
    handleDetail(id, isUpdate) {
      this.$router.push({
        path: '/rate/rateDetail',
        query: {
          detailId: id,
          projectId: this.projectId,
          isUpdate: isUpdate
        }
      });
    },

    // 获取评分标签类型
    getScoreTagType(score) {
      if (score >= 90) {
        return 'success';
      } else if (score >= 80) {
        return '';
      } else if (score >= 70) {
        return 'warning';
      } else if (score >= 60) {
        return 'info';
      } else {
        return 'danger';
      }
    },

    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getRateList();
    },
    
    handleReviewedCurrentChange(val) {
      this.reviewedCurrentPage = val;
      this.fetchReviewedList();
    },
    
    handleUnreviewedCurrentChange(val) {
      this.unreviewedCurrentPage = val;
      this.fetchUnreviewedList();
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #FEFEFE;
  min-height: calc(100vh - 61px);

  .content {
    padding: 20px 200px;
  }
}

// 添加圆环样式
.num-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border: 10px solid #409EFF; // 蓝色圆环
  border-radius: 50%; // 圆形
  margin: 20px auto; // 居中显示
  box-sizing: border-box;

  .num {
    font-size: 36px;
    font-weight: bold;
    color: #333;
  }
}

// 当待评分作品数为0时，圆环变为绿色
.num-wrapper.zero {
  border-color: #67C23A; // 绿色圆环
}
</style>