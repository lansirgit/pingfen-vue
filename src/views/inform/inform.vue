<!-- 赛事通知 -->
 <template>
  <div class="inform">
    <div class="card-container">
      <div class="card" v-for="(item, index) in inform" :key="index">
        <div class="card-header">
          <span class="time">{{ item.time }}</span>
          <h3 class="title">{{ item.title }}</h3>
        </div>
        <div class="card-body">
          <p class="content">{{ item.content }}</p>
        </div>
        <div class="card-footer">
          <button class="preview-btn" @click="previewFile(item.url)">
            预览
          </button>
          <button class="download-btn" @click="downloadFile(item.url, item.title)">
            下载
          </button>
        </div>
      </div>
    </div>
    
    <!-- 文件预览模态框 -->
    <div class="modal" v-if="showPreview" @click="closePreview">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closePreview">&times;</span>
        <iframe :src="previewUrl" class="preview-frame">
          <p>您的浏览器不支持此文件类型。</p>
        </iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPreview: false,
      previewUrl: '',
      inform: [
        {
          time: '2025-10-24 - 2025-10-27',
          title: '大会邀请函',
          content: '大会邀请函',
          url:"http://www.csasai.cn/tmp/bisai/大会邀请函.docx"
        },
        {
          time: '2025-10-24 - 2025-10-27',
          title: '大赛议程',
          content: 'AI大赛会议议程10.19修订(简化版）.doc',
          url:"http://www.csasai.cn/tmp/bisai/AI大赛会议议程10.19修订(简化版）.doc"
        },
        {
          time: '2025-10-24 - 2025-10-27',
          title: '决赛通知',
          content: 'AI解剖大赛现场决赛通知（最终版）.pdf',
          url:"http://www.csasai.cn/tmp/bisai/AI解剖大赛现场决赛通知（最终版）.pdf"
        }
      ]
    }
  },
  methods: {
    previewFile(url) {
      // 使用 Google Docs Viewer 预览文档
      this.previewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
      this.showPreview = true;
    },
    closePreview() {
      this.showPreview = false;
      this.previewUrl = '';
    },
    downloadFile(url, filename) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
</script>

<style scoped>
.inform {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #eee;
}

.time {
  font-size: 14px;
  color: #999;
}

.title {
  margin: 10px 0 0;
  font-size: 18px;
  color: #333;
}

.card-body {
  padding: 15px 20px;
}

.content {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.card-footer {
  padding: 15px 20px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.preview-btn, .download-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.preview-btn {
  background-color: #409eff;
  color: white;
}

.preview-btn:hover {
  background-color: #66b1ff;
}

.download-btn {
  background-color: #67c23a;
  color: white;
}

.download-btn:hover {
  background-color: #85ce61;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  width: 90%;
  height: 90%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 30px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  z-index: 1001;
}

.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
}

@media (max-width: 768px) {
  .card-container {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    height: 95%;
  }
}
</style>