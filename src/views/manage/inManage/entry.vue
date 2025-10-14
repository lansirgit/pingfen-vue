<template>
  <div class="entry-container">
    <div style="display: flex; font-weight: bold; font-size: 24px; margin-bottom: 20px;">
      参赛作品管理
    </div>
    
    <!-- 筛选条件 -->
    <div class="filter-container">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="项目">
          <el-select v-model="filterForm.project_id" placeholder="请选择项目" clearable>
            <el-option
              v-for="project in projects"
              :key="project.id"
              :label="project.name"
              :value="project.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 参赛作品列表 -->
    <el-table :data="entryList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="title" label="作品标题"></el-table-column>
      <el-table-column prop="project_name" label="项目名称" width="200"></el-table-column>
      <el-table-column prop="type" label="文件类型" width="100">
        <template slot-scope="scope">
          <el-tag>{{ getFileTypeAlias(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
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
      <el-table-column prop="count" label="评审次数" width="100"></el-table-column>
      <el-table-column prop="submit_time" label="提交时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.submit_time || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button 
            size="mini" 
            type="primary" 
            @click="viewFile(scope.row)"
            :disabled="!scope.row.entry_url"
          >
            查看作品
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      style="margin-top: 20px; text-align: right;">
    </el-pagination>

    <!-- 文件查看对话框 -->
    <el-dialog
      :title="fileDialogTitle"
      :visible.sync="fileDialogVisible"
      width="800px"
      @close="handleFileDialogClose"
      :fullscreen="isMobileView"
    >
      <div class="file-content-container">
        <!-- 视频文件 -->
        <div class="video-container" v-if="currentFileUrl && isVideoFile(currentFileUrl)">
          <video 
            :src="currentFileUrl" 
            controls 
            style="width: 100%; height: auto;"
          >
            您的浏览器不支持视频播放。
          </video>
        </div>
        
        <!-- PDF文件 -->
        <div class="pdf-container" v-else-if="currentFileUrl && isPdfFile(currentFileUrl)">
          <iframe 
            :src="currentFileUrl" 
            style="width: 100%; height: 500px; border: none;"
            title="PDF Viewer">
          </iframe>
        </div>
        
        <!-- 图片文件 -->
        <div class="image-container" v-else-if="currentFileUrl && isImageFile(currentFileUrl)">
          <img 
            :src="currentFileUrl" 
            alt="作品图片" 
            style="max-width: 100%; max-height: 500px; display: block; margin: 0 auto;">
        </div>
        
        <!-- 其他文件类型提供下载 -->
        <div class="file-download-container" v-else-if="currentFileUrl">
          <div class="file-info-card">
            <div class="file-icon">
              <i class="el-icon-document"></i>
            </div>
            <div class="file-details">
              <h3 class="file-name">{{ currentFileName }}{{ getFileExtension(currentFileUrl) }}</h3>
              <p class="file-type">文件类型: {{ getFileExtension(currentFileUrl).toUpperCase().substring(1) }}</p>
              <p class="file-action-tip">此文件需要下载后查看</p>
              <el-button 
                type="primary" 
                @click="downloadFile(currentFileUrl, currentFileName)"
                icon="el-icon-download">
                下载文件
              </el-button>
            </div>
          </div>
        </div>
        
        <div v-else class="no-file">
          无文件可供查看
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fileDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listEntries } from '@/apis/manage';
import { formOptions } from '@/apis/upload';

export default {
  data() {
    return {
      loading: false,
      entryList: [],
      projects: [],
      filterForm: {
        project_id: null
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      fileDialogVisible: false,
      fileDialogTitle: '',
      currentFileUrl: '',
      currentFileName: '',
      isMobileView: false
    }
  },

  created() {
    // 获取比赛项目
    this.getProjects()
    this.getEntryList()
    this.checkMobileView()
    window.addEventListener('resize', this.checkMobileView)
  },
  
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobileView)
  },

  methods: {
    // 获取比赛项目
    getProjects() {
      formOptions().then(res => {
        this.projects = res.projects || [];
      })
    },

    // 获取参赛作品列表
    getEntryList() {
      this.loading = true;
      const data = {
        tableName: 'entry',
        page_number: this.pagination.currentPage,
        page_size: this.pagination.pageSize,
        project_id: this.filterForm.project_id
      }
      
      listEntries(data).then(res => { 
        this.entryList = res.entries || [];
        this.pagination.total = res.total_count || 0;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    
    // 查询
    handleSearch() {
      this.pagination.currentPage = 1;
      this.getEntryList();
    },
    
    // 重置筛选条件
    resetFilter() {
      this.filterForm.project_id = null;
      this.handleSearch();
    },
    
    // 分页大小改变
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.getEntryList();
    },
    
    // 当前页改变
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getEntryList();
    },
    
    // 查看文件
    viewFile(row) {
      this.fileDialogTitle = `查看文件 - ${row.title}`;
      this.currentFileUrl = row.entry_url;
      this.currentFileName = row.title;
      this.fileDialogVisible = true;
    },
    
    // 关闭文件对话框
    handleFileDialogClose() {
      this.currentFileUrl = '';
      this.currentFileName = '';
    },
    
    // 获取文件类型别名
    getFileTypeAlias(type) {
      if (!type) return '-';
      
      const typeMap = {
        'pdf': 'PDF',
        'video': '视频',
        'image': '图片',
        'ppt': 'PPT',
        'zip': '压缩包',
        'web': '网页'
      };
      
      return typeMap[type] || type.toUpperCase();
    },
    
    // 判断是否为视频文件
    isVideoFile(url) {
      if (!url) return false;
      const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mpg'];
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
    
    // 检查是否为移动视图
    checkMobileView() {
      this.isMobileView = window.innerWidth < 768;
    }
  }
}
</script>

<style lang="scss" scoped>
.entry-container {
  padding: 20px;
  
  .filter-container {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 4px;
    
    .filter-form {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;

      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
  
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
  
  .file-content-container {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .video-container,
    .pdf-container,
    .image-container {
      width: 100%;
      text-align: center;
    }
    
    .pdf-container {
      background-color: #f5f5f5;
    }
    
    .file-download-container {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fafafa;
      padding: 20px;
      
      .file-info-card {
        text-align: center;
        padding: 30px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        max-width: 500px;
        width: 100%;
        
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
    
    .no-file {
      padding: 40px;
      color: #909399;
      text-align: center;
      font-size: 16px;
    }
  }
  
  .dialog-footer {
    text-align: right;
  }
}
</style>