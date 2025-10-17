<template>
  <div class="container">
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
    </div>
    
    <el-dropdown placement="bottom" @command="handleCommand" style="position: absolute; right: 40px; top: 40px; padding: 0 20px; cursor: pointer;" v-show="userName !== ''"> 
      <span style="color: #1E40AF; border: #1E40AF 1px solid; border-radius: 10px; padding: 10px 20px;">
        {{ userName }} <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="info"><i class="el-icon-user-solid"></i> 个人信息</el-dropdown-item>
        <el-dropdown-item command="logout"><i class="el-icon-switch-button"></i> 退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    
    <div class="header-title">
      <h1>AI应用能力大赛平台</h1>
      <p>智启解剖·AI赋能教与学</p>
    </div>
    
    <div class="entry-row">
      <div class="entry-card" v-for="item in cardList" :key="item.title" @click="goTo(item.path)" v-if="item.isLogin === 'show' || (checkLogin()? item.isLogin === 'login' : item.isLogin === 'unlogin')">
        <div class="icon">
          <img :src="item.icon" alt="">
        </div>
        <div class="title"> {{ item.title }} </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userInfo } from '@/apis/user'
import { getToken, removeToken } from '@/utils/auth'

export default {
  data() {
    return {
      title: '入口',
      content: '这是入口页面',
      userName: '',
      
      // 入口卡片列表 isLogin: login-登录后显示 unlogin-未登录显示 show-始终显示
      cardList: [
        {
          title: '赛事说明',
          icon: require('@/assets/img/fa-info.png'),
          path: '/desc',
          isLogin: 'show'
        },
        {
          title: '作品上传/修改',
          icon: require('@/assets/img/fa-upload.png'),
          path: '/upload',
          isLogin: 'login'
        },
        {
          title: '参赛作品查看',
          icon: require('@/assets/img/fa-view.png'),
          path: '/entry',
          isLogin: 'login'
        },
        {
          title: '用户登录',
          icon: require('@/assets/img/fa-user.png'),
          path: '/login',
          isLogin: 'unlogin'
        },
        {
          title: '榜单查看',
          icon: require('@/assets/img/fa-table.png'),
          path: '/score',
          isLogin: 'false'
        },
        {
          title: '个人中心',
          icon: require('@/assets/img/fa-user.png'),
          path: '/info',
          isLogin: 'login'
        },
        {
          title: '评委入口',
          icon: require('@/assets/img/fa-star.png'),
          path: '/rateLogin',
          isLogin: 'unlogin'
        },
      ]
    }
  },

  created() {
    this.getUserInfo()
  },

  methods: {
    // 路由跳转方法
    goTo(path) {
      this.$router.push(path)
    },

    // 获取用户信息方法
    getUserInfo() {
      if(!this.checkLogin()) {
        return
      }

      userInfo({id: getToken()}).then(res => {
        this.userName = res.name
      }).catch(err => {
        removeToken()
        this.$message({
          type: 'error',
          message: '当前登录信息失效，请重新登录!'
        });
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

    handleCommand(command) {
      if (command === 'info') {
        this.$router.push({
          path: '/info'
        })
      }

      if (command === 'logout') {
        this.$confirm('确定要退出登录吗?', '退出登录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确认退出
          removeToken(); // 清除token
          this.userName = ''
          this.$message({
            type: 'success',
            message: '退出登录成功!'
          });
        }).catch(() => {
          // 取消退出
          this.$message({
            type: 'info',
            message: '已取消退出登录'
          });
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  position: relative;
  overflow: hidden;

  .background-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    
    .circle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(28, 64, 175, 0.05) 100%);
      
      &.circle-1 {
        width: 300px;
        height: 300px;
        top: -100px;
        right: -100px;
      }
      
      &.circle-2 {
        width: 200px;
        height: 200px;
        bottom: -80px;
        left: 10%;
      }
      
      &.circle-3 {
        width: 150px;
        height: 150px;
        top: 20%;
        left: 5%;
      }
    }
    
    .wave {
      position: absolute;
      border-radius: 45%;
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(28, 64, 175, 0.02) 100%);
      opacity: 0.7;
      
      &.wave-1 {
        width: 500px;
        height: 500px;
        top: -200px;
        right: -200px;
        animation: wave 15s infinite linear;
      }
      
      &.wave-2 {
        width: 300px;
        height: 300px;
        bottom: -150px;
        left: -100px;
        animation: wave 20s infinite linear reverse;
      }
    }
  }
  
  .header-title {
    position: absolute;
    top: 100px;
    text-align: center;
    width: 100%;
    z-index: 1;
    
    h1 {
      font-size: 2.5rem;
      color: #1e40af;
      margin-bottom: 10px;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    p {
      font-size: 1.2rem;
      color: #3b82f6;
      font-weight: 500;
    }
  }

  .entry-row {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 5rem;
    z-index: 1;
    position: relative;

    .entry-card {
      width: 180px;
      height: 180px;
      justify-self: center;
      border: 2px solid #2563eb;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 8px 32px rgba(37, 99, 235, 0.15);
      backdrop-filter: blur(4px);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(37, 99, 235, 0.25);
        background: rgba(255, 255, 255, 1);
      }

      .icon img {
        width: 2.5rem;
        height: 2.5rem;
        transition: transform 0.3s ease;
      }
      
      &:hover .icon img {
        transform: scale(1.1);
      }

      .title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1e40af;
        text-align: center;
      }
    }
  }
}

@keyframes wave {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .container {
    .header-title {
      top: 80px;
      
      h1 {
        font-size: 2rem;
      }
      
      p {
        font-size: 1rem;
      }
    }
    
    .entry-row {
      gap: 2.5rem;
      
      .entry-card {
        width: 140px;
        height: 140px;
        
        .icon img {
          width: 2rem;
          height: 2rem;
        }
        
        .title {
          font-size: 1rem;
        }
      }
    }
  }
}
</style>