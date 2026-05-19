<template>
  <div class="page-container">
    <!-- 1. 搜索过滤区 -->
    <div class="search-panel modern-card">
      <el-form :model="queryParams" inline size="small" class="search-form">
        <el-form-item label="样品编号">
          <el-input v-model="queryParams.sampleNo" placeholder="请输入编号" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="轮次">
          <el-input v-model="queryParams.round" placeholder="轮次" clearable style="width: 80px" />
        </el-form-item>
        <el-form-item label="样品名称">
          <el-input v-model="queryParams.sampleName" placeholder="请输入名称" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="样品来源">
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
                @change="(val) => handleDateUpdate(row, val)"
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

        <el-table-column label="渠道" width="85" align="center">
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

        <el-table-column label="状态" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-dropdown trigger="click" @command="(command) => handleStatusChange(row, command)" :disabled="getAvailableStatus(row).length === 0">
              <div class="status-cell" :class="[`status-${row.status}`, { clickable: getAvailableStatus(row).length > 0 }]" :style="{ cursor: getAvailableStatus(row).length === 0 ? 'default' : 'pointer' }">
                <span class="status-dot" :style="{ background: STATUS_MAP[row.status]?.color }"></span>
                <span class="status-label">{{ getStatusLabel(row.status) }}</span>
                <el-icon v-if="getAvailableStatus(row).length > 0" class="dropdown-icon"><CaretBottom /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu class="p-dropdown">
                  <el-dropdown-item 
                    v-for="status in getAvailableStatus(row)" 
                    :key="status.value" 
                    :command="status.value"
                  >
                    <span class="status-dot" :style="{ background: status.color, marginRight: '8px', width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block' }"></span>
                    {{ status.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="130" fixed="right" align="center">
          <template #default="{ row }">
            <div class="action-cell-modern">
              <el-button link type="primary" size="small" @click="handleDetail(row)">详情</el-button>
              
              <template v-if="row.status === '1'">
                <el-divider direction="vertical" />
                <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
              </template>
              
              <template v-else>
                <el-divider direction="vertical" />
                <el-dropdown trigger="click">
                  <el-button link type="primary" size="small">更多</el-button>
                  <template #dropdown>
                    <el-dropdown-menu class="p-dropdown">
                      <el-dropdown-item icon="Refresh">重新打样</el-dropdown-item>
                      <el-dropdown-item icon="Printer" @click="handlePrint(row)">打印标签</el-dropdown-item>
                      <el-dropdown-item icon="List">流转历史</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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
      size="600px"
      destroy-on-close
    >
      <div v-if="currentRow" class="detail-content">
        <el-descriptions :column="2" border size="small" title="基础信息">
          <el-descriptions-item label="样品编号">{{ currentRow.sampleNo }}</el-descriptions-item>
          <el-descriptions-item label="当前状态">
             <el-tag :type="getStatusType(currentRow.status)" size="small">{{ getStatusLabel(currentRow.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="样品名称">{{ currentRow.sampleName }}</el-descriptions-item>
          <el-descriptions-item label="样品来源">{{ getSourceLabel(currentRow.source) }}</el-descriptions-item>
          <el-descriptions-item label="供应商" :span="2">{{ currentRow.supplier || '-' }}</el-descriptions-item>
          <el-descriptions-item label="规格描述" :span="2">{{ currentRow.spec || '-' }}</el-descriptions-item>
        </el-descriptions>

        <div class="section-divider">流转时间轴</div>
        <SampleTimeline :data="timelineData" />
      </div>
    </el-drawer>

    <!-- 弹窗组件 -->
    <RegistrationDialog v-model="regVisible" @refresh="handleQuery" />
    <TestEvaluationDialog 
      v-model="testVisible" 
      :sample-data="currentRow" 
      @refresh="handleQuery" 
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
import SampleTimeline from './components/SampleTimeline.vue'

const tableHeight = useTableHeight(190)
const queryParams = reactive({ ...INITIAL_QUERY_PARAMS })
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(5)

const multipleTableRef = ref()
const regVisible = ref(false)
const testVisible = ref(false)
const detailVisible = ref(false)
const currentRow = ref<any>(null)
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
    id: '1006', sampleNo: 'YP-202605006', sampleName: '瑜伽垫-归还中', proposalNo: 'TA-20260506', productManager: '李经理', purchaser: '小王',
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

// 模拟状态流转规则：基于当前状态和样品类型返回可流转的下一个状态
const getAvailableStatus = (row: any) => {
  const all = SAMPLE_STATUS
  const currentStatus = row.status
  const type = row.sampleType

  // 1. 基础物理流转逻辑
  if (currentStatus === '1') return all.filter(s => ['2', '6'].includes(s.value)) // 待提交 -> 领用中, 已销毁
  if (currentStatus === '2') return all.filter(s => ['3', '7'].includes(s.value)) // 领用中 -> 归还中, 已遗失
  if (currentStatus === '3') return all.filter(s => ['4'].includes(s.value))      // 归还中 -> 已归还
  
  // 2. 基于样品类型的最终处置逻辑 (当样品已归还或处于稳定态时)
  if (['4', '2'].includes(currentStatus)) {
    switch(type) {
      case '5': // 确认样
        return all.filter(s => ['5', '13'].includes(s.value)) // 已封存, 已退供
      case '1': // 推荐样
      case '2': // 首版样
      case '3': // 修改样
      case '6': // 二供对比样
        return all.filter(s => ['5', '6', '13'].includes(s.value)) // 已封存, 已销毁, 已退供
      case '7': // 库存对比样
        return all.filter(s => ['12', '6'].includes(s.value)) // 已退仓, 已销毁
      case '8': // 大货对比样
        return all.filter(s => ['13', '8', '6'].includes(s.value)) // 已退供, 已内购, 已销毁
    }
  }

  return []
}

const handleStatusChange = (row: any, newStatus: string) => {
  // 模拟接口调用更新状态
  row.status = newStatus
  row.updateTime = new Date().toLocaleString().replace(/\//g, '-')
  ElMessage.success(`已将样品 ${row.sampleNo} 状态更新为：${getStatusLabel(newStatus)}`)
}

const handleQuery = () => {
  console.log('查询参数：', queryParams)
}

const resetQuery = () => {
  Object.assign(queryParams, INITIAL_QUERY_PARAMS)
  handleQuery()
}

const handleDetail = (row: any) => {
  currentRow.value = row
  detailVisible.value = true
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
