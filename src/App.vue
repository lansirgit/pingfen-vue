<template>
  <div id="app">
    <!-- 公告横幅 -->
    <AnnouncementBanner/>
    
    <!-- <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav> -->
    <router-view/>
  </div>
</template>

<script>
import AnnouncementBanner from './components/AnnouncementBanner.vue'

export default {
  name: 'App',
  components: {
    AnnouncementBanner
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
}

</style>
