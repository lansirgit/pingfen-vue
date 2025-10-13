<template>
  <div class="container">
    <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      style="padding: 0 10%; position: relative;">
      <el-menu-item index="/rate/index"><i class="el-icon-s-home"></i> 首页</el-menu-item>
      <el-menu-item index="/rate/about"><i class="el-icon-info"></i> 关于</el-menu-item>
      <el-menu-item index="/entrance"><i class="el-icon-menu"></i> 退出</el-menu-item>
    
      <el-dropdown placement="bottom" @command="handleCommand" style="position: absolute; right: 10%; top: calc(50% - 8px); padding: 0 20px; cursor: pointer;"> 
        <span style="color: #FFFFFF;">
          {{ rateInfo.account || '' }} <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="info"><i class="el-icon-user-solid"></i> 个人信息</el-dropdown-item>
          <el-dropdown-item command="logout"><i class="el-icon-switch-button"></i> 退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
import { rateInfo } from '@/apis/rate';
import { getRateId, removeRateId } from '@/utils/auth';

export default {
  data() {
    return {
      rateInfo: {},
    }
  },

  created() {
    this.getRateInfo()
  },

  methods: {
    handleSelect(key, keyPath) {
    },

    handleInfo() {
      
      this.$router.push({
        path: '/rate/userInfo'
      })
    },

    getRateInfo() {
      if(!getRateId()){
        this.$router.push({
          path: '/rateLogin'
        })

      }
      rateInfo({
        judge_id: getRateId()
      }).then(res => {
        this.rateInfo = res
      })

    },

    handleCommand(command) {
      if (command === 'info') {
        this.$router.push({
          path: '/rate/userInfo'
        })
      }

      if (command === 'logout') {
        // 添加确认退出对话框
        this.$confirm('确定要退出登录吗？', '退出确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确认退出，清除登录信息
          removeRateId();
          this.$message({
            type: 'success',
            message: '已退出登录!'
          });
          this.$router.push({
            path: '/rateLogin'
          })

        }).catch(() => {
          // 取消退出，不执行任何操作
          this.$message({
            type: 'info',
            message: '已取消退出'
          });
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-menu-item {
  min-width: 120px;
}
</style>