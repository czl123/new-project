<template>
  <div class="standard-list-container">
    <!-- Query Area -->
    <div class="query-card">
      <el-form :model="queryForm" inline class="non-check-form" size="small">
        <el-form-item label="关键词">
          <el-input v-model="queryForm.keyword" placeholder="请输入关键词" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择" style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Action Bar -->
    <div class="ak-operate-container">
      <div class="ak-operate-section">
        <el-button type="primary" icon="Plus" size="small">新增</el-button>
        <el-button type="danger" icon="Delete" size="small" :disabled="!selectedRows.length">批量删除</el-button>
      </div>
      <div class="ak-table-btn">
        <el-button icon="Refresh" circle size="small" @click="handleSearch" />
      </div>
    </div>

    <!-- Table -->
    <div class="table-card" id="mainTable">
      <vxe-table
        border
        show-overflow
        keep-source
        size="mini"
        :loading="loading"
        :data="tableData"
        :height="tableHeight"
        @checkbox-change="handleSelectionChange"
        @checkbox-all="handleSelectionChange"
      >
        <vxe-column type="checkbox" width="40" fixed="left"></vxe-column>
        <vxe-column type="seq" title="序号" width="60" fixed="left"></vxe-column>
        <vxe-column field="name" title="名称" min-width="150"></vxe-column>
        <vxe-column field="code" title="编码" width="120"></vxe-column>
        <vxe-column field="status" title="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'info'" size="small">
              {{ row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </vxe-column>
        <vxe-column field="updateTime" title="更新时间" width="160"></vxe-column>
        <vxe-column title="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small">编辑</el-button>
            <el-button type="danger" link size="small">删除</el-button>
          </template>
        </vxe-column>
      </vxe-table>

      <vxe-pager
        :current-page="pager.pageNo"
        :page-size="pager.pageSize"
        :total="pager.total"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handlePageChange"
      >
      </vxe-pager>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useTableHeightById } from '@/hooks/useTableHeight'

const queryForm = reactive({
  keyword: '',
  status: '',
  refreshCount: 0
})

const pager = reactive({
  pageNo: 1,
  pageSize: 20,
  total: 0
})

const loading = ref(false)
const tableData = ref<any[]>([])
const selectedRows = ref<any[]>([])

const { tableHeight } = useTableHeightById(null, 0) // Placeholder for demo

const handleSearch = () => {
  queryForm.refreshCount++
  getPage()
}

const resetQuery = () => {
  queryForm.keyword = ''
  queryForm.status = ''
  handleSearch()
}

const getPage = () => {
  loading.value = true
  // Mock API call
  setTimeout(() => {
    tableData.value = [
      { id: 1, name: '示例数据 1', code: 'CODE_001', status: '1', updateTime: '2026-04-22 10:00:00' },
      { id: 2, name: '示例数据 2', code: 'CODE_002', status: '0', updateTime: '2026-04-22 11:00:00' },
    ]
    pager.total = 2
    loading.value = false
  }, 500)
}

const handlePageChange = ({ currentPage, pageSize }: any) => {
  pager.pageNo = currentPage
  pager.pageSize = pageSize
  getPage()
}

const handleSelectionChange = ({ records }: any) => {
  selectedRows.value = records
}

onMounted(() => {
  getPage()
  // Correctly link table height
  const tableEl = document.getElementById('mainTable')
  if (tableEl) {
    const { tableHeight: h } = useTableHeightById(tableEl, 0)
    // In a real project, we'd use a more robust way to sync this
  }
})
</script>

<style scoped>
.standard-list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
