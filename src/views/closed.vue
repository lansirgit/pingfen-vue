<template>
  <div class="closed-page">
    <div class="closed-content">
      <h1>本次线上比赛结束，登录已关闭</h1>
      <p>请勿重复登录</p>
      <router-link to="/">返回首页</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClosedPage'
}
</script>

<style scoped>
.closed-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.closed-content {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.closed-content h1 {
  color: #333;
  margin-bottom: 1rem;
}

.closed-content p {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}
</style>