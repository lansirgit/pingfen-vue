<template>
  <div class="projects-container">
    <div style="display: flex; font-weight: bold; font-size: 24px; margin-bottom: 20px;">
        比赛项目管理
    </div>
    <!-- 添加项目按钮 -->
    <div class="header-bar">
      <el-button type="primary" plain icon="el-icon-plus" @click="openAddDialog">
        添加项目
      </el-button>
    </div>

    <!-- 项目列表 -->
    <el-table :data="projectsList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="type" label="类型" width="150"></el-table-column>
      <el-table-column prop="description" label="描述" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.description || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="competition_id" label="比赛ID" width="100"></el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" plain @click="openEditDialog(scope.row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑项目对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form :model="projectForm" :rules="formRules" ref="projectForm" label-width="100px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="projectForm.name" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="projectForm.type" placeholder="请输入项目类型"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            type="textarea" 
            v-model="projectForm.description" 
            placeholder="请输入项目描述"
            :rows="3"
          ></el-input>
        </el-form-item>
        <el-form-item label="比赛ID" prop="competition_id">
          <el-input-number 
            v-model="projectForm.competition_id" 
            :min="1" 
            controls-position="right"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
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
      projectsList: [],
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      projectForm: {
        id: null,
        name: '',
        type: '',
        description: '',
        competition_id: null
      },
      formRules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入项目类型', trigger: 'blur' }
        ],
        competition_id: [
          { required: true, message: '请输入比赛ID', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getProjectsList()
  },

  methods: {
    // 获取项目列表
    getProjectsList() {
      this.loading = true;
      const data = {
        tableName: 'project'
      }
      listTable(data).then(res => { 
        this.projectsList = res;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    
    // 打开添加对话框
    openAddDialog() {
      this.dialogTitle = '添加项目';
      this.isEdit = false;
      this.dialogVisible = true;
    },
    
    // 打开编辑对话框
    openEditDialog(row) {
      this.dialogTitle = '编辑项目';
      this.isEdit = true;
      this.projectForm = { ...row };
      this.dialogVisible = true;
    },
    
    // 关闭对话框时重置表单
    handleDialogClose() {
      this.$refs.projectForm.resetFields();
      this.projectForm = {
        id: null,
        name: '',
        type: '',
        description: '',
        competition_id: null
      };
    },
    
    // 提交表单
    submitForm() {
      this.$refs.projectForm.validate((valid) => {
        if (valid) {
          // 这里可以调用添加或编辑的API
          if (this.isEdit) {
            // 编辑逻辑
            this.handleEdit();
          } else {
            // 添加逻辑
            this.handleAdd();
          }
        }
      });
    },
    
    // 添加项目
handleAdd() {
  addRecord('project', this.projectForm).then(res => {
    if (res.success) {
      this.$message.success('添加成功');
      this.dialogVisible = false;
      this.getProjectsList();
    } else {
      this.$message.error(res.message || '添加失败');
    }
  }).catch(err => {
    this.$message.error('添加失败');
  });
},

// 编辑项目
handleEdit() {
  const { id, ...updateData } = this.projectForm;
  updateRecord('project', id, updateData).then(res => {
    if (res.success) {
      this.$message.success('编辑成功');
      this.dialogVisible = false;
      this.getProjectsList();
    } else {
      this.$message.error(res.message || '编辑失败');
    }
  }).catch(err => {
    this.$message.error('编辑失败');
  });
},

// 删除项目
handleDelete(row) {
  this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteRecord('project', row.id).then(res => {
      if (res.success) {
        this.$message.success('删除成功');
        this.getProjectsList();
      } else {
        this.$message.error(res.message || '删除失败');
      }
    }).catch(err => {
      this.$message.error('删除失败');
    });
  }).catch(() => {
    this.$message.info('已取消删除');
  });
}
  }
}
</script>

<style lang="scss" scoped>
.projects-container {
  padding: 20px;
  
  .header-bar {
    margin-bottom: 20px;
    text-align: right;
  }
}
</style>