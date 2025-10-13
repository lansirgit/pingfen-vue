<template>
  <div class="organization-container">
    <div style="display: flex; font-weight: bold; font-size: 24px; margin-bottom: 20px;">
        组织机构管理
    </div>
    <!-- 添加组织机构按钮 -->
    <div class="header-bar">
      <el-button type="primary" plain icon="el-icon-plus" @click="openAddDialog">
        添加组织机构
      </el-button>
    </div>

    <!-- 组织机构列表 -->
    <el-table :data="organizationList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="机构名称"></el-table-column>
      <el-table-column prop="department" label="部门">
        <template slot-scope="scope">
          {{ scope.row.department || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark || '-' }}
        </template>
      </el-table-column>
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

    <!-- 添加/编辑组织机构对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form :model="organizationForm" :rules="formRules" ref="organizationForm" label-width="100px">
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="organizationForm.name" placeholder="请输入机构名称"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="organizationForm.department" placeholder="请输入部门"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input 
            type="textarea" 
            v-model="organizationForm.remark" 
            placeholder="请输入备注信息"
            :rows="3"
          ></el-input>
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
import { listTable, addRecord, updateRecord, deleteRecord } from '@/apis/manage';

export default {
  data() {
    return {
      loading: false,
      organizationList: [],
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      organizationForm: {
        id: null,
        name: '',
        department: '',
        remark: ''
      },
      formRules: {
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getOrganizationList()
  },

  methods: {
    // 获取组织机构列表
    getOrganizationList() {
      this.loading = true;
      const data = {
        tableName: 'organization'
      }
      listTable(data).then(res => { 
        this.organizationList = res;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    
    // 打开添加对话框
    openAddDialog() {
      this.dialogTitle = '添加组织机构';
      this.isEdit = false;
      this.dialogVisible = true;
    },
    
    // 打开编辑对话框
    openEditDialog(row) {
      this.dialogTitle = '编辑组织机构';
      this.isEdit = true;
      this.organizationForm = { ...row };
      this.dialogVisible = true;
    },
    
    // 关闭对话框时重置表单
    handleDialogClose() {
      this.$refs.organizationForm.resetFields();
      this.organizationForm = {
        id: null,
        name: '',
        department: '',
        remark: ''
      };
    },
    
    // 提交表单
    submitForm() {
      this.$refs.organizationForm.validate((valid) => {
        if (valid) {
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
    
    // 添加组织机构
    handleAdd() {
      const { id, ...addData } = this.organizationForm;
      addRecord('organization', addData).then(res => {
        if (res.success) {
          this.$message.success('添加成功');
          this.dialogVisible = false;
          this.getOrganizationList();
        } else {
          this.$message.error(res.message || '添加失败');
        }
      }).catch(err => {
        this.$message.error('添加失败');
      });
    },
    
    // 编辑组织机构
    handleEdit() {
      const { id, ...updateData } = this.organizationForm;
      updateRecord('organization', id, updateData).then(res => {
        if (res.success) {
          this.$message.success('编辑成功');
          this.dialogVisible = false;
          this.getOrganizationList();
        } else {
          this.$message.error(res.message || '编辑失败');
        }
      }).catch(err => {
        this.$message.error('编辑失败');
      });
    },
    
    // 删除组织机构
    handleDelete(row) {
      this.$confirm('此操作将永久删除该组织机构, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRecord('organization', row.id).then(res => {
          if (res.success) {
            this.$message.success('删除成功');
            this.getOrganizationList();
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
.organization-container {
  padding: 20px;
  
  .header-bar {
    margin-bottom: 20px;
    text-align: right;
  }
}
</style>