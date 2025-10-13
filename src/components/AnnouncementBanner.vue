<template>
  <div class="announcement-banner" v-if="true">
    <div class="announcement-content">
      <span class="announcement-icon">📢</span>
      <span class="announcement-text">{{ message }}</span>
      <button class="announcement-close" @click="close">×</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnnouncementBanner',
  data() {
    return {
      visible: true,
      message: '当前系统正在升级维护中，预计需要1-2天，请各位老师在维护期间暂停上传作品，谢谢！'
    }
  },
  methods: {
    close() {
      this.visible = false;
      // 可以在这里添加本地存储，记录用户已关闭公告
      localStorage.setItem('announcement_closed', 'true');
    }
  },
  mounted() {
    // 检查本地存储，判断是否显示公告
    const isClosed = localStorage.getItem('announcement_closed');
    if (isClosed === 'true') {
      this.visible = false;
    }
  }
}
</script>

<style scoped>
.announcement-banner {
  background-color: #fff3cd;
  border-bottom: 1px solid #ffeaa7;
  padding: 10px 0;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.announcement-content {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.announcement-icon {
  margin-right: 10px;
  font-size: 18px;
}

.announcement-text {
  flex: 1;
  text-align: center;
  color: #856404;
  font-size: 18px;
}

.announcement-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #856404;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.announcement-close:hover {
  background-color: rgba(133, 100, 4, 0.1);
}
</style>