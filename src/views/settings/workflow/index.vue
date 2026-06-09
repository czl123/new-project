<template>
  <div class="page-container">
    <div class="modern-card p-16">
      <div class="header-actions">
        <div class="title">流程审批配置</div>
      </div>
      
      <el-table :data="tableData" border stripe class="premium-table mt-16">
        <el-table-column type="index" label="#" width="60" align="center" />
        <el-table-column prop="bizType" label="业务单据类型" width="200" />
        <el-table-column prop="workflowName" label="关联流程名称" min-width="200" />
        <el-table-column prop="status" label="配置状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === '已配置' ? 'success' : 'info'" effect="dark" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后更新时间" width="160" align="center" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleConfig(row)">
              {{ row.status === '已配置' ? '修改配置' : '去配置' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tableData = ref([
  {
    bizType: '模具申请',
    workflowName: '模具申请通用审批流',
    status: '已配置',
    updateTime: '2026-06-08 14:30'
  },
  {
    bizType: '付款申请',
    workflowName: '对公付款审批流',
    status: '未配置',
    updateTime: '-'
  },
  {
    bizType: '拿样任务下发',
    workflowName: '-',
    status: '未配置',
    updateTime: '-'
  },
  {
    bizType: '定品申请',
    workflowName: '标准定品审批流',
    status: '已配置',
    updateTime: '2026-05-20 10:15'
  }
])

const handleConfig = (row: any) => {
  router.push({
    path: '/settings/workflow-editor',
    query: { bizType: row.bizType }
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 10px;
  background-color: #f0f2f5;
  min-height: 100vh;
  box-sizing: border-box;
}

.modern-card {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.p-16 { padding: 16px; }
.mt-16 { margin-top: 16px; }

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    border-left: 4px solid #1890ff;
    padding-left: 8px;
  }
}

.premium-table {
  --el-table-border-color: #e2e8f0;
  
  :deep(.el-table__header-wrapper) th {
    background-color: #f8fafc !important;
    color: #334155;
    font-weight: 600;
  }
}
</style>
