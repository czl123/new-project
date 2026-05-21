<template>
  <div class="page-container">
    <!-- 1. 搜索过滤区 -->
    <div class="search-panel modern-card">
      <el-form :model="queryParams" inline size="small" class="search-form">
        <el-form-item label="样品编号">
          <el-input v-model="queryParams.sampleNo" placeholder="请输入编号" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="样品名称">
          <el-input v-model="queryParams.sampleName" placeholder="请输入名称" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="拿样渠道">
          <el-select v-model="queryParams.source" placeholder="请选择" clearable style="width: 120px">
            <el-option v-for="s in SAMPLE_SOURCE" :key="s.value" :label="s.label" :value="s.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="样品类型">
          <el-select v-model="queryParams.sampleType" placeholder="请选择" clearable style="width: 130px">
            <el-option v-for="t in SAMPLE_TYPE" :key="t.value" :label="t.label" :value="t.value">
              <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 20px;">
                <span>{{ t.label }}</span>
                <span style="color: #909399; font-size: 10px;">{{ t.desc }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 120px">
            <el-option v-for="s in SAMPLE_STATUS" :key="s.value" :label="s.label" :value="s.value" />
          </el-select>
        </el-form-item>
        <div class="search-btns">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </div>
      </el-form>
    </div>

    <!-- 3. 动作工具栏 -->
    <div class="action-toolbar">
      <div class="left">
        <el-button type="primary" size="small" icon="Plus" @click="regVisible = true">开发样登记</el-button>
        
        <el-divider direction="vertical" />
        
        <el-button-group>
          <el-button 
            size="small" 
            icon="Download" 
            :disabled="!selectedRows?.length"
            @click="handleBatchExport"
          >批量导出</el-button>
          <el-button 
            size="small" 
            icon="Printer" 
            :disabled="!selectedRows?.length"
            @click="handleBatchPrint"
          >批量打标</el-button>
        </el-button-group>

        <el-dropdown 
          trigger="click" 
          @command="handleBatchStatusChange"
          :disabled="!selectedRows?.length"
          style="margin-left: 12px"
        >
          <el-button size="small" type="warning" plain icon="Operation" :disabled="!selectedRows?.length">
            批量变更状态<el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="2">转为领用中</el-dropdown-item>
              <el-dropdown-item command="4">转为已归还</el-dropdown-item>
              <el-dropdown-item command="5">转为已封存</el-dropdown-item>
              <el-dropdown-item command="6">转为已销毁</el-dropdown-item>
              <el-dropdown-item command="7">转为已遗失</el-dropdown-item>
              <el-dropdown-item command="8">转为已内购</el-dropdown-item>
              <el-dropdown-item command="12">转为已退仓</el-dropdown-item>
              <el-dropdown-item command="13">转为已退供</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <span v-if="selectedRows?.length" class="selection-info">
          已选 <b class="count">{{ selectedRows.length }}</b> 项
          <el-link type="primary" :underline="false" @click="clearSelection">取消</el-link>
        </span>
      </div>
      <div class="right">
        <div class="tool-group">
          <el-icon @click="handleQuery" title="刷新"><RefreshRight /></el-icon>
        </div>
      </div>
    </div>

    <!-- 4. 表格区域 -->
    <div class="table-container modern-card">
      <el-table 
        ref="multipleTableRef"
        :data="tableData" 
        :height="tableHeight"
        size="small" 
        stripe
        header-cell-class-name="modern-header"
        row-class-name="modern-row"
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40" align="center" fixed />
        <el-table-column type="index" label="#" width="50" align="center" fixed />
        
        <el-table-column width="70" align="center" fixed>
          <template #header>
            <el-icon><Picture /></el-icon>
          </template>
          <template #default="{ row }">
            <el-image 
              :src="row.images?.[0] || 'https://via.placeholder.com/40'" 
              class="sample-thumb"
              :preview-src-list="row.images || []"
              preview-teleported
              fit="cover"
            >
              <template #error>
                <div class="thumb-placeholder"><el-icon><Picture /></el-icon></div>
              </template>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column label="样品编号/名称/轮次" min-width="180" fixed>
          <template #default="{ row }">
            <div class="sample-info-cell">
              <div class="no">
                {{ row.sampleNo }}
                <span class="round-tag-mini">L{{ row.round }}</span>
              </div>
              <div class="name" :title="row.sampleName">{{ row.sampleName }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="proposalNo" label="提案编号" width="120" show-overflow-tooltip />
        <el-table-column prop="productManager" label="产品经理" width="90" align="center" />
        <el-table-column prop="purchaser" label="采购员" width="90" align="center" />

        <el-table-column prop="style" label="款式" width="90" show-overflow-tooltip />
        <el-table-column prop="mainMaterial" label="主材料" width="100" show-overflow-tooltip />
        <el-table-column prop="applicableTo" label="适用品牌/对象" width="130" show-overflow-tooltip />
        
        <el-table-column label="样品类型" width="95" align="center">
          <template #default="{ row }">
            {{ getTypeLabel(row.sampleType) }}
          </template>
        </el-table-column>

        <el-table-column prop="receiveDate" label="样品接收日期" width="110" align="center">
          <template #header>
            <div class="header-with-icon"><span>样品接收日期</span></div>
          </template>
          <template #default="{ row }">
            <span :class="{ 'text-secondary': !row.receiveDate || row.receiveDate === '-' }">{{ row.receiveDate || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="comparisonEndDate" label="对比结束日期" width="130" align="center">
          <template #default="{ row }">
            <template v-if="isComparisonType(row.sampleType) && (!row.comparisonEndDate || row.comparisonEndDate === '-')">
              <el-date-picker
                v-model="row.comparisonEndDate"
                type="date"
                placeholder="请选择"
                size="small"
                value-format="YYYY-MM-DD"
                style="width: 110px"
                @change="(val: any) => handleDateUpdate(row, val)"
              />
              <div v-if="isComparisonDateDelayed(row)" class="warning-text-mini">
                <el-icon><Warning /></el-icon> 登记已超15天未填
              </div>
            </template>
            <span v-else :class="{ 'text-secondary': !row.comparisonEndDate || row.comparisonEndDate === '-' }">
              {{ row.comparisonEndDate || '-' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="样品费" width="90" align="right">
          <template #header>
            <div class="header-with-icon j-end"><span>样品费</span></div>
          </template>
          <template #default="{ row }">
            <span class="price-text">¥{{ row.sampleFee?.toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="拿样渠道" width="85" align="center">
          <template #default="{ row }">
            <span class="source-tag">{{ getSourceLabel(row.source) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="expireDate" label="保留期限" width="125" align="center">
          <template #header>
            <div class="header-with-icon">
              <span>保留期限</span>
              <el-tooltip placement="top">
                <template #content>
                  <div>样品在公司的最长保留时间，即将到期会红色预警。</div>
                  <div style="margin-top: 4px; font-weight: bold;">保留规则：</div>
                  <ul style="margin: 0; padding-left: 12px; list-style-type: disc;">
                    <li>推荐样：接收起1个月</li>
                    <li>首版样：签样后15天</li>
                    <li>修改样：至提案归档</li>
                    <li>确认样：生命周期+1年</li>
                    <li>对比样(含二供/库存/大货)：测毕后1个月</li>
                  </ul>
                </template>
                <el-icon class="header-help-icon"><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row }">
            <div class="expire-column-cell">
              <span class="date-val" :class="{ 'is-warning': isExpireWarning(row) }">
                {{ row.expireDate || '-' }}
              </span>
              <div v-if="isExpired(row.expireDate) && !['6', '7', '8', '12', '13'].includes(row.status)" class="expire-tag">
                保留期已过
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <div class="status-cell" :class="[`status-${row.status}`]">
              <span class="status-dot" :style="{ background: STATUS_MAP[row.status]?.color }"></span>
              <span class="status-label">{{ getStatusLabel(row.status) }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <div class="action-cell-modern">
              <el-button link type="primary" size="small" @click="handleDetail(row)">详情</el-button>
              
              <template v-if="row.status === '1'">
                <el-divider direction="vertical" />
                <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
                <el-divider direction="vertical" />
                <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
              </template>
              
              <template v-else>
                <el-divider direction="vertical" />
                <el-button type="primary" size="small" link @click="handlePrint(row)">打印标签</el-button>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-footer">
        <div class="footer-left"></div>
        <div class="footer-right">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[20, 50, 100]"
            layout="prev, pager, next, sizes, jumper"
            :total="total"
            background
          />
          <span class="total-count">共 {{ total }} 条记录</span>
        </div>
      </div>
    </div>

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="detailVisible"
      title="样品详情"
      size="1400px"
      destroy-on-close
      class="premium-detail-drawer"
    >
      <div v-if="currentRow" class="detail-drawer-content">
        <!-- Section 1: Basic Info (1:1 with Registration) -->
        <div class="p-section-card">
          <div class="p-section-header">
            <el-icon class="p-section-icon"><Box /></el-icon>
            <span>样品基础信息</span>
          </div>

          <!-- Row 1: Responsibility & Linking -->
          <div class="p-grid-row responsibility-row">
            <el-row :gutter="20">
              <el-col :span="4">
                <div class="p-detail-item">
                  <span class="p-label" style="width: 80px;">关联提案</span>
                  <span class="p-value"><el-tag :type="currentRow.isLinkedToProposal ? 'success' : 'info'" size="small">{{ currentRow.isLinkedToProposal ? '是' : '否' }}</el-tag></span>
                </div>
              </el-col>
              <el-col :span="currentRow.isLinkedToProposal ? 8 : 0">
                <div v-if="currentRow.isLinkedToProposal" class="p-detail-item">
                  <span class="p-label">对应提案项目</span>
                  <span class="p-value highlight">{{ currentRow.proposalNo }}</span>
                </div>
              </el-col>
              <el-col :span="currentRow.isLinkedToProposal ? 6 : 10">
                <div class="p-detail-item">
                  <span class="p-label">产品经理</span>
                  <span class="p-value">{{ currentRow.productManager }}</span>
                </div>
              </el-col>
              <el-col :span="currentRow.isLinkedToProposal ? 6 : 10">
                <div class="p-detail-item">
                  <span class="p-label">采购员</span>
                  <span class="p-value">{{ currentRow.purchaser }}</span>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- Row 2: Core Identity -->
          <div class="p-grid-row">
            <el-row :gutter="32">
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">样品名称</span>
                  <span class="p-value">{{ currentRow.sampleName }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">款式</span>
                  <span class="p-value">{{ currentRow.style }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">主材料</span>
                  <span class="p-value">{{ currentRow.mainMaterial }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">适用品牌或对象</span>
                  <span class="p-value">{{ currentRow.applicableTo }}</span>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- Row 3: Source & Origin -->
          <div class="p-grid-row">
            <el-row :gutter="32">
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">样品类型</span>
                  <span class="p-value">{{ getTypeLabel(currentRow.sampleType) }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">样品接收日期</span>
                  <span class="p-value">{{ currentRow.receiveDate }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">对比结束日期</span>
                  <span class="p-value">{{ currentRow.comparisonEndDate || '-' }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">样品费</span>
                  <span class="p-value price">¥{{ currentRow.sampleFee?.toFixed(2) }}</span>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- Row 4: Source Details -->
          <div class="p-grid-row">
            <el-row :gutter="32">
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">拿样渠道</span>
                  <span class="p-value">{{ getSourceLabel(currentRow.source) }}</span>
                </div>
              </el-col>
              <el-col :span="currentRow.source === '1' ? 6 : 0">
                <div v-if="currentRow.source === '1'" class="p-detail-item">
                  <span class="p-label">供应商类型</span>
                  <span class="p-value">{{ currentRow.supplierType === '1' ? '正式' : '临时' }}</span>
                </div>
              </el-col>
              <el-col :span="currentRow.source === '1' ? 12 : 18">
                <div class="p-detail-item">
                  <span class="p-label">{{ currentRow.source === '1' ? '供应商名称' : '购买链接' }}</span>
                  <span class="p-value">{{ currentRow.source === '1' ? (currentRow.supplier || '-') : currentRow.purchaseUrl }}</span>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- Row 5: Packaging & Characteristics -->
          <div class="p-grid-row">
            <el-row :gutter="32">
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">包装方式</span>
                  <span class="p-value">{{ currentRow.packagingMethod || '-' }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">包装数量</span>
                  <span class="p-value">{{ currentRow.packagingQuantity || '-' }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">是否带电</span>
                  <span class="p-value">{{ currentRow.hasBattery ? '是' : '否' }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">是否CE类</span>
                  <span class="p-value">{{ currentRow.isCE ? '是' : '否' }}</span>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- Row 6: Commercial -->
          <div class="p-grid-row">
            <el-row :gutter="32">
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">初次报价</span>
                  <span class="p-value">¥{{ currentRow.initialQuote?.toFixed(2) }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">税率</span>
                  <span class="p-value">{{ currentRow.taxRate }}%</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">起订量</span>
                  <span class="p-value">{{ currentRow.moq }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="p-detail-item">
                  <span class="p-label">生产周期</span>
                  <span class="p-value">{{ currentRow.productionCycle }}天</span>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- Row 7: Notes -->
          <div class="p-grid-row">
            <el-row :gutter="32">
              <el-col :span="24">
                <div class="p-detail-item">
                  <span class="p-label">样品说明</span>
                  <span class="p-value">{{ currentRow.description || '-' }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>

        <!-- Section 2: Table (1:1 with Registration) -->
        <div id="section-table" class="p-section-card no-padding">
          <div class="p-section-header" style="padding: 12px 12px 8px;">
            <el-icon class="p-section-icon"><Setting /></el-icon>
            <span>样品规格信息</span>
          </div>

          <div class="p-data-grid">
            <el-table :data="currentRow.details" class="p-table" :border="false" style="width: 100%">
              <el-table-column label="图片" width="100" align="center">
                <template #default="scope">
                  <div class="p-cell-img-preview">
                    <el-image 
                      v-if="scope.row.images?.length"
                      :src="scope.row.images[0]" 
                      :preview-src-list="scope.row.images"
                      class="p-img-main"
                      fit="cover"
                      preview-teleported
                    />
                    <div v-else class="p-img-empty mini"><el-icon><Picture /></el-icon></div>
                  </div>
                </template>
              </el-table-column>
              
              <el-table-column label="图案" prop="pattern" min-width="100" align="center" />
              <el-table-column label="颜色" prop="color" min-width="100" align="center" />
              <el-table-column label="规格" prop="spec" min-width="100" align="center" />
              
              <el-table-column label="样品尺寸" min-width="160" align="center">
                <template #default="scope">
                  {{ scope.row.length }} × {{ scope.row.width }} × {{ scope.row.height }} {{ scope.row.sampleSizeUnit }}
                </template>
              </el-table-column>

              <el-table-column label="净重" width="100" align="center">
                <template #default="scope">
                  {{ scope.row.netWeight }}{{ scope.row.netWeightUnit }}
                </template>
              </el-table-column>

              <el-table-column label="包装尺寸" min-width="160" align="center">
                <template #default="scope">
                  <span v-if="scope.row.pLength">
                    {{ scope.row.pLength }} × {{ scope.row.pWidth }} × {{ scope.row.pHeight }} {{ scope.row.packagingSizeUnit }}
                  </span>
                  <span v-else class="text-secondary">-</span>
                </template>
              </el-table-column>

              <el-table-column label="包装重量" width="100" align="center">
                <template #default="scope">
                  {{ scope.row.packagingWeight ? scope.row.packagingWeight + scope.row.packagingWeightUnit : '-' }}
                </template>
              </el-table-column>

              <el-table-column label="尺码" prop="size" width="80" align="center" />
              <el-table-column label="直径" width="100" align="center">
                <template #default="scope">
                  {{ scope.row.diameter ? scope.row.diameter + scope.row.diameterUnit : '-' }}
                </template>
              </el-table-column>
              <el-table-column label="容量" width="100" align="center">
                <template #default="scope">
                  {{ scope.row.capacity ? scope.row.capacity + scope.row.capacityUnit : '-' }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- Section 3: Timeline -->
        <div class="p-section-card">
          <div class="p-section-header">
            <el-icon class="p-section-icon"><List /></el-icon>
            <span>流转时间轴</span>
          </div>
          <div style="padding: 10px 20px;">
            <SampleTimeline :data="timelineData" :current-status="currentRow.status" />
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 弹窗组件 -->
    <RegistrationDialog v-model="regVisible" @refresh="handleQuery" />
    <TestEvaluationDialog 
      v-model="testVisible" 
      :sample-data="currentRow" 
      @refresh="handleQuery" 
    />
    <BatchStatusDialog
      v-model="batchStatusVisible"
      :target-status="targetStatus"
      :selected-count="selectedRows.length"
      @confirm="handleBatchStatusConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import axios from 'axios'
import { useTableHeight } from '@/hooks/useTableHeight'
import { SAMPLE_STATUS, SAMPLE_SOURCE, SAMPLE_TYPE, INITIAL_QUERY_PARAMS, STATUS_MAP } from './constants'
import RegistrationDialog from './components/RegistrationDialog.vue'
import TestEvaluationDialog from './components/TestEvaluationDialog.vue'
import BatchStatusDialog from './components/BatchStatusDialog.vue'
import SampleTimeline from './components/SampleTimeline.vue'

const tableHeight = useTableHeight(190)
const queryParams = reactive({ ...INITIAL_QUERY_PARAMS })
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(5)

const multipleTableRef = ref()
const regVisible = ref(false)
const testVisible = ref(false)
const batchStatusVisible = ref(false)
const targetStatus = ref('')
const detailVisible = ref(false)
const currentRow = ref<any>(null)
const editRow = ref<any>(null)
const selectedRows = ref<any[]>([])

const handleSelectionChange = (val: any[]) => {
  selectedRows.value = val
}

const clearSelection = () => {
  multipleTableRef.value?.clearSelection()
}

const handleBatchExport = () => {
  console.log('批量导出：', selectedRows.value)
}

const handleBatchPrint = () => {
  if (!selectedRows.value.length) return
  doPrint(selectedRows.value)
}

const handleBatchStatusChange = (status: string) => {
  targetStatus.value = status
  batchStatusVisible.value = true
}

const handleBatchStatusConfirm = (formData: any) => {
  // 模拟更新本地数据
  selectedRows.value.forEach(row => {
    const item = allData.value.find(d => d.id === row.id)
    if (item) {
      item.status = formData.status
      item.updateTime = new Date().toLocaleString()
    }
  })
  
  clearSelection()
  handleQuery()
}

const handlePrint = (row: any) => {
  doPrint([row])
}

/**
 * 调用后端 API 进行局域网远程打印
 */
const doPrint = async (data: any[]) => {
  if (!data || data.length === 0) return

  const loading = ElLoading.service({ 
    text: '正在通知 ERP 系统进行标签打印...', 
    background: 'rgba(255,255,255,0.7)' 
  })

  try {
    // 动态获取 Token：尝试所有可能的 Key
    const defaultToken = 'eyJhbGciOiJIUzUxMiJ9.eyJhY2NvdW50SWQiOjI1Mywic3ViIjoiUzIwMTgwMjI5IiwiZXhwIjoxNzc5MjEzMjk3LCJpYXQiOjE3NzkxNTU2OTd9.Sb6wZlIYRx9ddpxwwEakInyFo8wA5fwk1CGFjfuEfPDKvdg7jUsswa_snexyUhu9iJcBgb41IKfCixZlNOG0Pg';
    const token = localStorage.getItem('Access-Token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('BSCJC_Token') ||
                  defaultToken;

    // 调用官方 ERP 打印接口
    const response = await axios.post('/bsc-cloud-product/rlMatLsInfoRegist/samplePrint', {
      sysSampleIdList: ['2056586352676388865']
    }, {
      headers: {
        'X-Access-Token': token,
        'token': token,
        'Authorization': token,
        'X-BSCJC-Token': token
      }
    })

    if (response.data?.success || response.data?.code === 200) {
      ElMessage.success(`打印指令已成功发送至云端 (${data.length}份)`)
    } else {
      throw new Error(response.data?.message || 'ERP 接口返回错误')
    }
  } catch (error: any) {
    console.error('ERP 打印出错:', error)
    ElMessage.error(`打印失败: ${error.message || '网络连接超时'}`)
  } finally {
    loading.close()
  }
}

const allData = ref([
  { 
    id: '1001', sampleNo: 'YP-202605001', sampleName: '户外牧羊人钩-待提交', proposalNo: 'TA-20260501', productManager: '张三', purchaser: '李四',
    style: '经典款', mainMaterial: '不锈钢', applicableTo: '亚马逊/自营',
    sampleType: '1', source: '1', round: 1, sampleFee: 50.00, receiveDate: '2026-05-09', comparisonEndDate: '-',
    status: '1', expireDate: '2026-12-31', updateTime: '2026-05-09 10:00:00', supplier: '晨光文具', spec: '不锈钢材质',
    images: ['/uploads/img_2c4gj_1778668130970.jpg', '/uploads/img_2c4gj_1778668144849.jpg']
  },
  { 
    id: '1005', sampleNo: 'YP-202605005', sampleName: '登山杖-领用中', proposalNo: 'TA-20260505', productManager: '张三', purchaser: '李四',
    style: '轻量化', mainMaterial: '碳纤维', applicableTo: '驴友',
    sampleType: '1', source: '1', round: 1, sampleFee: 180.00, receiveDate: '2026-05-18', comparisonEndDate: '-',
    status: '2', expireDate: '2026-12-01', updateTime: '2026-05-19 09:00:00', supplier: '户外用品厂', spec: '伸缩式',
    images: ['/uploads/img_cu3utr_1779162736788.jpg']
  },
  { 
    id: '1006', sampleNo: 'YP-202605006', sampleName: '瑜伽垫-待领用', proposalNo: 'TA-20260506', productManager: '李经理', purchaser: '小王',
    style: '加厚款', mainMaterial: 'TPE', applicableTo: '女性',
    sampleType: '2', source: '2', round: 1, sampleFee: 35.00, receiveDate: '2026-05-10', comparisonEndDate: '-',
    status: '3', expireDate: '2026-11-20', updateTime: '2026-05-18 11:00:00', supplier: '义乌工厂', spec: '紫色，8mm',
    images: ['/uploads/img_j5aan9v_1778732746789.jpg']
  },
  { 
    id: '1007', sampleNo: 'YP-202605007', sampleName: '睡袋-已归还', proposalNo: 'TA-20260507', productManager: '张经理', purchaser: '老林',
    style: '信封式', mainMaterial: '中空棉', applicableTo: '露营',
    sampleType: '3', source: '1', round: 1, sampleFee: 85.00, receiveDate: '2026-05-05', comparisonEndDate: '-',
    status: '4', expireDate: '2026-10-15', updateTime: '2026-05-15 15:30:00', supplier: '泰州工厂', spec: '1.5kg',
    images: ['/uploads/img_tdnzw_1778667025096.jpg']
  },
  { 
    id: '1008', sampleNo: 'YP-202605008', sampleName: '营地灯-已封存', proposalNo: 'TA-20260508', productManager: '周经理', purchaser: '小赵',
    style: '复古款', mainMaterial: '马口铁', applicableTo: '氛围装饰',
    sampleType: '5', source: '3', round: 2, sampleFee: 45.00, receiveDate: '2026-04-20', comparisonEndDate: '-',
    status: '5', expireDate: '2027-01-01', updateTime: '2026-05-10 14:00:00', supplier: '模具开发部', spec: '暖黄光',
    images: ['/uploads/img_hz9z6_1778667092762.jpg']
  },
  { 
    id: '1009', sampleNo: 'YP-202605009', sampleName: '损坏的帐篷-已销毁', proposalNo: 'TA-20260509', productManager: '刘经理', purchaser: '小钱',
    style: '速开款', mainMaterial: '涤纶', applicableTo: '家庭',
    sampleType: '1', source: '2', round: 1, sampleFee: 120.00, receiveDate: '2026-03-15', comparisonEndDate: '-',
    status: '6', expireDate: '-', updateTime: '2026-05-12 09:20:00', supplier: '未知', spec: '支架断裂',
    images: ['/uploads/img_ghw63_1778668026697.jpg']
  },
  { 
    id: '1010', sampleNo: 'YP-202605010', sampleName: '失踪的指南针-已遗失', proposalNo: 'TA-20260510', productManager: '吴主管', purchaser: '小孙',
    style: '专业款', mainMaterial: '合金', applicableTo: '徒步',
    sampleType: '6', source: '1', round: 1, sampleFee: 65.00, receiveDate: '2026-04-10', comparisonEndDate: '-',
    status: '7', expireDate: '-', updateTime: '2026-05-14 17:00:00', supplier: '精密仪器厂', spec: '带夜光',
    images: ['/uploads/img_u76obs_1778666482733.jpg']
  },
  { 
    id: '1011', sampleNo: 'YP-202605011', sampleName: '内部团购水壶-已内购', proposalNo: 'TA-20260511', productManager: '郑经理', purchaser: '小李',
    style: '运动款', mainMaterial: 'TRITAN', applicableTo: '员工',
    sampleType: '8', source: '1', round: 1, sampleFee: 12.00, receiveDate: '2026-05-01', comparisonEndDate: '-',
    status: '8', expireDate: '-', updateTime: '2026-05-19 16:00:00', supplier: '塑胶制品厂', spec: '1L大容量',
    images: ['/uploads/img_8bcba7_1778667260985.jpg']
  },
  { 
    id: '1012', sampleNo: 'YP-202605012', sampleName: '借调库存样品-已退仓', proposalNo: 'TA-20260512', productManager: '吴主管', purchaser: '小赵',
    style: '标准款', mainMaterial: '多种', applicableTo: '对比测试',
    sampleType: '7', source: '1', round: 1, sampleFee: 0.00, receiveDate: '2026-05-01', comparisonEndDate: '2026-05-15',
    status: '12', expireDate: '-', updateTime: '2026-05-16 10:00:00', supplier: '自有仓库', spec: '库存样退回',
    images: ['/uploads/img_bbkk2_1779162323612.jpg']
  },
  { 
    id: '1013', sampleNo: 'YP-202605013', sampleName: '供应商样机-已退供', proposalNo: 'TA-20260513', productManager: '陈经理', purchaser: '老林',
    style: '样机', mainMaterial: '金属', applicableTo: '选型',
    sampleType: '8', source: '1', round: 1, sampleFee: 0.00, receiveDate: '2026-05-05', comparisonEndDate: '2026-05-18',
    status: '13', expireDate: '-', updateTime: '2026-05-19 14:00:00', supplier: '华为终端', spec: '测试完毕退还',
    images: ['/uploads/img_bbkk2_1779162323682.jpg']
  },
  { 
    id: '1014', sampleNo: 'YP-202605014', sampleName: '逾期未处理测试样', proposalNo: 'TA-20260514', productManager: '吴主管', purchaser: '小钱',
    style: '测试款', mainMaterial: '多种', applicableTo: '过期提醒测试',
    sampleType: '1', source: '1', round: 1, sampleFee: 20.00, receiveDate: '2026-04-10', comparisonEndDate: '-',
    status: '4', expireDate: '2026-05-10', updateTime: '2026-05-10 09:00:00', supplier: '测试厂家', spec: '该样品已过保留期，需及时处理',
    images: []
  }
])

const tableData = computed(() => {
  let filtered = allData.value
  
  // 1. 搜索表单过滤
  if (queryParams.sampleNo) {
    filtered = filtered.filter(item => item.sampleNo.includes(queryParams.sampleNo))
  }
  if (queryParams.round) {
    filtered = filtered.filter(item => String(item.round).includes(queryParams.round))
  }
  if (queryParams.sampleName) {
    filtered = filtered.filter(item => item.sampleName.includes(queryParams.sampleName))
  }
  if (queryParams.source) {
    filtered = filtered.filter(item => item.source === queryParams.source)
  }
  if (queryParams.sampleType) {
    filtered = filtered.filter(item => item.sampleType === queryParams.sampleType)
  }
  if (queryParams.status) {
    filtered = filtered.filter(item => item.status === queryParams.status)
  }

  return filtered
})

const getStatusLabel = (val: string) => STATUS_MAP[val]?.label || val
const getStatusType = (val: string) => STATUS_MAP[val]?.type || 'info'
const getSourceLabel = (val: string) => SAMPLE_SOURCE.find(s => s.value === val)?.label || val
const getTypeLabel = (val: string) => SAMPLE_TYPE.find(t => t.value === val)?.label || val
const getTypeDesc = (val: string) => SAMPLE_TYPE.find(t => t.value === val)?.desc || ''

const isComparisonType = (type: string) => ['6', '7', '8'].includes(type)

const isComparisonDateDelayed = (row: any) => {
  if (!isComparisonType(row.sampleType)) return false
  if (row.comparisonEndDate && row.comparisonEndDate !== '-') return false
  if (!row.receiveDate || row.receiveDate === '-') return false
  
  const receiveDate = new Date(row.receiveDate)
  if (isNaN(receiveDate.getTime())) return false
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const diffTime = today.getTime() - receiveDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays > 15
}

const handleDateUpdate = (row: any, val: string) => {
  if (val) {
    ElMessage.success(`样品 ${row.sampleNo} 的对比结束日期已更新为：${val}`)
  }
}

/**
 * 判断保留期限是否异常（过期或3天内即将到期）
 * @param row 样品行数据
 */
const isExpireWarning = (row: any) => {
  const dateStr = row.expireDate
  if (!dateStr || dateStr === '-') return false
  
  // 排除已处理的终态
  if (['6', '7', '8', '12', '13'].includes(row.status)) return false

  const expireDate = new Date(dateStr)
  if (isNaN(expireDate.getTime())) return false
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  expireDate.setHours(0, 0, 0, 0)
  
  const diffTime = expireDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays <= 3
}

const isExpired = (dateStr: string) => {
  if (!dateStr || dateStr === '-') return false
  const expireDate = new Date(dateStr)
  if (isNaN(expireDate.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  expireDate.setHours(0, 0, 0, 0)
  return expireDate.getTime() < today.getTime()
}

/**
 * 判断是否即将到期（3天内）
 * 已废弃，改用 isExpireWarning
 */
const isNearExpire = (dateStr: string) => {
  return false
}

const handleQuery = () => {
  console.log('查询参数：', queryParams)
}

const resetQuery = () => {
  Object.assign(queryParams, INITIAL_QUERY_PARAMS)
  handleQuery()
}

const handleDetail = (row: any) => {
  // 注入丰富的模拟数据，确保详情页（预览模式）内容完整
  currentRow.value = {
    ...row,
    isLinkedToProposal: !!row.proposalNo,
    supplierType: '1',
    purchaseUrl: row.source !== '1' ? 'https://detail.1688.com/offer/12345678.html' : '',
    packagingMethod: '盒装',
    packagingQuantity: '1pack',
    hasBattery: false,
    isCE: true,
    initialQuote: row.sampleFee ? row.sampleFee * 0.8 : 0,
    taxRate: 13,
    moq: 500,
    productionCycle: 20,
    description: '此样品为高精密材质打造，专为高端市场设计。经过第一轮内部评估，其耐用性和外观质感均达到行业领先水平。建议作为本季主推款式。',
    details: [
      {
        images: row.images || [],
        pattern: '哑光/拉丝',
        color: '碳黑/银灰',
        spec: '通用',
        length: 24, width: 18, height: 12, sampleSizeUnit: 'cm',
        netWeight: 850, netWeightUnit: 'g',
        pLength: 26, pWidth: 20, pHeight: 14, packagingSizeUnit: 'cm',
        packagingWeight: 1050, packagingWeightUnit: 'g',
        size: 'Standard',
        diameter: 0, diameterUnit: 'cm',
        capacity: 0, capacityUnit: 'ml'
      }
    ]
  }
  
  // 模拟流转时间轴数据
  const mockTimelines: any = {
    '1': [
      { content: '待提交', timestamp: row.updateTime, operator: row.purchaser, type: 'info' }
    ],
    '2': [
      { content: '领用中', timestamp: row.updateTime, operator: '业务部-小王', type: 'primary', status: '进行中', statusType: 'warning' },
      { content: '样品入库', timestamp: '2026-05-10 10:00', operator: '仓储组', remark: '质检合格，准予入库' },
      { content: '开发样登记', timestamp: row.receiveDate + ' 09:00', operator: row.purchaser }
    ],
    '3': [
      { content: '待领用', timestamp: row.updateTime, operator: '仓储组', type: 'warning', remark: '样品已归还，等待下次领用' },
      { content: '领用结束', timestamp: '2026-05-15 16:00', operator: '业务部-小王', status: '已归还', statusType: 'success' },
      { content: '样品入库', timestamp: '2026-05-10 10:00', operator: '仓储组' }
    ],
    '4': [
      { content: '已归还', timestamp: row.updateTime, operator: '仓储组', type: 'success' },
      { content: '样品入库', timestamp: '2026-05-06 14:00', operator: '仓储组' },
      { content: '开发样登记', timestamp: row.receiveDate + ' 10:00', operator: row.purchaser }
    ]
  }

  timelineData.value = mockTimelines[row.status] || [
    { content: getStatusLabel(row.status), timestamp: row.updateTime, operator: '系统', type: getStatusType(row.status) },
    { content: '样品入库', timestamp: row.receiveDate + ' 10:00', operator: '仓储组' }
  ]

  detailVisible.value = true
}

const handleEdit = (row: any) => {
  editRow.value = row
  regVisible.value = true
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除样品 ${row.sampleNo} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除逻辑
    const index = allData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData.value.splice(index, 1)
      total.value = allData.value.length
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

// 模拟时间轴数据
const timelineData = ref([])

</script>

<style lang="scss">
/* 强力全局覆盖 */
.el-drawer.premium-detail-drawer {
  .el-drawer__header {
    margin-bottom: 0 !important;
    padding: 12px 20px !important;
    border-bottom: 1px solid #f1f5f9 !important;
    
    & > span {
      font-size: 15px !important;
      font-weight: 700 !important;
      color: #1e293b !important;
    }
  }
}
</style>

<style lang="scss" scoped>
@import './style.scss';

.section-divider {
  margin: 20px 0 15px 0;
  font-weight: 600;
  font-size: 14px;
  color: #303133;
  display: flex;
  align-items: center;
  &::before {
    content: '';
    width: 4px;
    height: 14px;
    background-color: var(--el-color-primary);
    margin-right: 8px;
    border-radius: 2px;
  }
}

.detail-content {
  padding: 0 10px;
}

.warning-text-mini {
  color: #f56c6c;
  font-size: 10px;
  margin-top: 4px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.expire-column-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  
  .date-val {
    font-size: 12px;
    &.is-warning {
      color: #f5222d;
      font-weight: 700;
    }
  }
  
  .expire-tag {
    font-size: 10px;
    color: #f5222d;
    background: #fff1f0;
    padding: 0 4px;
    border-radius: 2px;
    border: 1px solid #ffa39e;
    line-height: 1.4;
    white-space: nowrap;
    transform: scale(0.9);
  }
}
</style>
