<template>
  <div class="entry-container">
    <div style="display: flex; font-weight: bold; font-size: 24px; margin-bottom: 20px;">
        参赛作品管理
    </div>
    <!-- 参赛作品列表 -->
    <el-table :data="entryList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="title" label="作品标题"></el-table-column>
      <el-table-column prop="participant_id" label="参赛者ID" width="100"></el-table-column>
      <el-table-column prop="project_id" label="项目ID" width="100"></el-table-column>
      <el-table-column prop="description" label="描述">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            trigger="hover"
            :content="scope.row.description"
            v-if="scope.row.description"
          >
            <div slot="reference" class="description-ellipsis">
              {{ scope.row.description }}
            </div>
          </el-popover>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="得分" width="100">
        <template slot-scope="scope">
          {{ scope.row.score !== null ? scope.row.score.toFixed(2) : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="review_status" label="评审状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.review_status === 1 ? 'success' : 'info'">
            {{ scope.row.review_status === 1 ? '已评审' : '未评审' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="submit_time" label="提交时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.submit_time || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="count" label="评审次数" width="100"></el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button 
            size="mini" 
            type="primary" 
            @click="viewVideo(scope.row)"
            :disabled="!scope.row.url"
          >
            查看视频
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 视频查看对话框 -->
    <el-dialog
      :title="videoDialogTitle"
      :visible.sync="videoDialogVisible"
      width="600px"
      @close="handleVideoDialogClose"
    >
      <div class="video-container">
        <video 
          v-if="currentVideoUrl" 
          :src="currentVideoUrl" 
          controls 
          style="width: 100%; height: auto;"
        >
          您的浏览器不支持视频播放。
        </video>
        <div v-else class="no-video">
          无视频可供播放
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="videoDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listTable } from '@/apis/manage';

export default {
  data() {
    return {
      loading: false,
      entryList: [],
      videoDialogVisible: false,
      videoDialogTitle: '',
      currentVideoUrl: ''
    }
  },

  created() {
    this.getEntryList()
  },

  methods: {
    // 获取参赛作品列表
    getEntryList() {
      this.loading = true;
      const data = {
        tableName: 'entry'
      }
      listTable(data).then(res => { 
        this.entryList = res;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    
    // 查看视频
    viewVideo(row) {
      this.videoDialogTitle = `查看视频 - ${row.title}`;
      this.currentVideoUrl = row.url;
      this.videoDialogVisible = true;
    },
    
    // 关闭视频对话框
    handleVideoDialogClose() {
      this.currentVideoUrl = '';
    }
  }
}
</script>

<style lang="scss" scoped>
.entry-container {
  padding: 20px;
  
  .description-ellipsis {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    max-height: 3em;
  }
  
  .video-container {
    text-align: center;
    
    .no-video {
      padding: 20px;
      color: #909399;
    }
  }
  
  .dialog-footer {
    text-align: right;
  }
}
</style>