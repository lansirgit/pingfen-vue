<template>
  <div class="manage-container">
    <div class="top-container">
      <h1>后台管理面板</h1>
    </div>
    <div class="main-container">
      <div class="left-container">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          @select="handleMenuSelect"
        >
          <el-menu-item index="/manage/index">
            <span slot="title"><i class="el-icon-s-home"></i>首页</span>
          </el-menu-item>
          <el-menu-item index="/manage/organization">
            <span slot="title"><i class="el-icon-s-data"></i>组织机构</span>
          </el-menu-item>
          <el-menu-item index="/manage/project">
            <span slot="title"><i class="el-icon-s-flag"></i>比赛项目</span>
          </el-menu-item>
          <el-menu-item index="/manage/participant">
            <span slot="title"><i class="el-icon-s-custom"></i>参赛人员</span>
          </el-menu-item>
          <el-menu-item index="/manage/judge">
            <span slot="title"><i class="el-icon-s-check"></i>评委管理</span>
          </el-menu-item>
          <el-menu-item index="/manage/entry">
            <span slot="title"><i class="el-icon-menu"></i>参赛作品</span>
          </el-menu-item>
          <el-menu-item index="/manage/record">
            <span slot="title"><i class="el-icon-s-claim"></i>评分记录</span>
          </el-menu-item>
          
          
        </el-menu>
      </div>
      
      <div class="right-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ManagePanel',
  data() {
    return {
      activeMenu: this.$route.path
    }
  },
  watch: {
    $route(to) {
      this.activeMenu = to.path
    }
  },
  methods: {
    handleMenuSelect(key, keyPath) {
        
    }
  }
}
</script>

<style lang="scss" scoped>
.manage-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.top-container {
  height: 60px;
  background-color: #545C64;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
  
  h1 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }
}

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-container {
  width: 200px;
  background-color: #545c64;
  height: calc(100vh - 60px);
  overflow-y: auto;
  
  .sidebar-menu {
    border-right: none;
    height: 100%;
  }
  
  ::v-deep .el-menu-item,
  ::v-deep .el-submenu__title {
    height: 60px;
    line-height: 60px;
  }
}

.right-container {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f5f7fa;
  overflow-y: auto;
  height: calc(100vh - 60px);
}
</style>