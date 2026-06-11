<template>
  <div class="page-container">
    <div class="modern-card p-16">
      <div class="header-actions">
        <div class="title">流程审批配置</div>
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon class="mr-4"><Plus /></el-icon> 新增配置
        </el-button>
      </div>
      
      <el-table v-loading="loading" :data="tableData" border stripe class="premium-table mt-16">
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
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleConfig(row)">
              {{ row.status === '已配置' ? '修改配置' : '去配置' }}
            </el-button>
            <el-button 
              v-if="row.status === '已配置'" 
              type="danger" 
              link 
              size="small" 
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增配置弹窗 -->
    <el-dialog v-model="showAddDialog" title="新增业务流程配置" width="400px">
      <el-form :model="addForm" label-position="top">
        <el-form-item label="业务单据类型名称" required>
          <el-input v-model="addForm.bizType" placeholder="请输入业务类型，如：请假申请" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAdd" :disabled="!addForm.bizType">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const showAddDialog = ref(false)
const addForm = ref({ bizType: '' })

const tableData = ref<any[]>([])

const fetchData = async () => {
  loading.value = true
  try {
    const res = await fetch('/api/workflow/def/list')
    const result = await res.json()
    if (result.code === 200) {
      const dbList = result.data || []
      
      // 直接展示数据库中的所有配置
      tableData.value = dbList.map((config: any) => ({
        id: config.id,
        bizType: config.bizType || '未命名类型',
        workflowName: config.name || '-',
        status: '已配置',
        updateTime: formatDate(config.updateTime)
      }))
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('获取列表失败，请确保后台服务已启动')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

const confirmAdd = () => {
  const bizType = addForm.value.bizType.trim()
  if (!bizType) return
  
  showAddDialog.value = false
  router.push({
    path: '/settings/workflow-editor',
    query: { bizType: bizType }
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除 [${row.bizType}] 的流程配置吗？此操作不可恢复。`,
    '警告',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const res = await fetch(`/api/workflow/def/delete/${row.id}`, {
        method: 'DELETE'
      })
      const result = await res.json()
      if (result.code === 200) {
        ElMessage.success('配置已成功删除')
        fetchData()
      } else {
        ElMessage.error(result.message || '删除失败')
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('请求接口失败')
    }
  }).catch(() => {})
}

onMounted(() => {
  fetchData()
})

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
.mr-4 { margin-right: 4px; }

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
