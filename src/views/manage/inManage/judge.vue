<template>
  <div class="judge-container">
    <div style="display: flex; font-weight: bold; font-size: 24px; margin-bottom: 20px;">
        评委管理
    </div>
    <!-- 添加评委按钮 -->
    <div class="header-bar">
      <el-button type="primary" plain icon="el-icon-plus" @click="openAddDialog">
        添加评委
      </el-button>
    </div>

    <!-- 评委列表 -->
    <el-table :data="judgeList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="organization_id" label="组织机构ID" width="120"></el-table-column>
      <el-table-column prop="contact" label="联系方式">
        <template slot-scope="scope">
          {{ scope.row.contact || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">
            {{ scope.row.role === 'admin' ? '管理员' : '评委' }}
          </el-tag>
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

    <!-- 添加/编辑评委对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form :model="judgeForm" :rules="formRules" ref="judgeForm" label-width="100px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="judgeForm.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="judgeForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="judgeForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="组织机构ID" prop="organization_id">
          <el-input-number 
            v-model="judgeForm.organization_id" 
            :min="1" 
            controls-position="right"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="judgeForm.contact" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="judgeForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="评委" value="judge"></el-option>
            <el-option label="管理员" value="admin"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input 
            type="textarea" 
            v-model="judgeForm.remark" 
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
      judgeList: [],
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      judgeForm: {
        id: null,
        account: '',
        name: '',
        password: '',
        organization_id: null,
        contact: '',
        role: 'judge',
        remark: ''
      },
      formRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        organization_id: [
          { required: true, message: '请输入组织机构ID', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    this.getJudgeList()
  },

  methods: {
    // 获取评委列表
    getJudgeList() {
      this.loading = true;
      const data = {
        tableName: 'judge'
      }
      listTable(data).then(res => { 
        this.judgeList = res;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    
    // 打开添加对话框
    openAddDialog() {
      this.dialogTitle = '添加评委';
      this.isEdit = false;
      this.dialogVisible = true;
    },
    
    // 打开编辑对话框
    openEditDialog(row) {
      this.dialogTitle = '编辑评委';
      this.isEdit = true;
      // 编辑时不清空密码字段，除非用户明确要修改密码
      this.judgeForm = { ...row, password: '' };
      this.dialogVisible = true;
    },
    
    // 关闭对话框时重置表单
    handleDialogClose() {
      this.$refs.judgeForm.resetFields();
      this.judgeForm = {
        id: null,
        account: '',
        name: '',
        password: '',
        organization_id: null,
        contact: '',
        role: 'judge',
        remark: ''
      };
    },
    
    // 提交表单
    submitForm() {
      this.$refs.judgeForm.validate((valid) => {
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
    
    // 添加评委
    handleAdd() {
      const { id, ...addData } = this.judgeForm;
      addRecord('judge', addData).then(res => {
        if (res.success) {
          this.$message.success('添加成功');
          this.dialogVisible = false;
          this.getJudgeList();
        } else {
          this.$message.error(res.message || '添加失败');
        }
      }).catch(err => {
        this.$message.error('添加失败');
      });
    },
    
    // 编辑评委
    handleEdit() {
      const { id, ...updateData } = this.judgeForm;
      // 如果密码为空，则不更新密码字段
      if (!updateData.password) {
        delete updateData.password;
      }
      updateRecord('judge', id, updateData).then(res => {
        if (res.success) {
          this.$message.success('编辑成功');
          this.dialogVisible = false;
          this.getJudgeList();
        } else {
          this.$message.error(res.message || '编辑失败');
        }
      }).catch(err => {
        this.$message.error('编辑失败');
      });
    },
    
    // 删除评委
    handleDelete(row) {
      this.$confirm('此操作将永久删除该评委, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRecord('judge', row.id).then(res => {
          if (res.success) {
            this.$message.success('删除成功');
            this.getJudgeList();
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
.judge-container {
  padding: 20px;
  
  .header-bar {
    margin-bottom: 20px;
    text-align: right;
  }
}
</style>