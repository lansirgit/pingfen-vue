<template>
  <div class="projects-container">
    <div style="display: flex; font-weight: bold; font-size: 24px; margin-bottom: 20px;">
        评分记录管理
    </div>

    <!-- 评分记录列表 -->
    <el-table :data="recordList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="记录ID"></el-table-column>
      <el-table-column prop="project_id" label="项目ID"></el-table-column>
      <el-table-column prop="entry_id" label="参赛作品ID" width="120"></el-table-column>
      <el-table-column prop="judge_id" label="评委ID"></el-table-column>
      <el-table-column prop="score" label="分数"></el-table-column>
      <el-table-column prop="score_time" label="评分时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listTable } from '@/apis/manage';

export default {
  name: 'Record',
  data() {
    return {
      loading: true,
      recordList: []
    }
  },
  
  created() {
    this.getRecordList()
  },
  
  methods: {
    // 获取评分记录列表
    getRecordList() {
      this.loading = true;
      const data = {
        tableName: 'evaluation_record'
      }
      listTable(data).then(res => { 
        this.recordList = res;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.projects-container {
  padding: 20px;
}
</style>