<template>
  <el-drawer
    v-model="visible"
    :size="drawerSize"
    destroy-on-close
    class="premium-drawer"
  >
    <template #header>
      <div class="drawer-header-v4">
        <div class="title-main">
          <span class="title-icon"><el-icon><Document /></el-icon></span>
          <span class="title-text">关联单据中心</span>
          <span class="title-divider">/</span>
          <span class="title-sub" v-if="feedbackData">反馈单号：{{ feedbackData.code }}</span>
        </div>
      </div>
    </template>

    <div class="workspace-container" v-if="feedbackData">
      <!-- 1. 左侧导航面板：概览 & 购样单列表 Master (320px 宽度) -->
      <div class="workspace-sidebar">
        <!-- 业务基础看板 -->
        <div class="sidebar-block context-card">
          <div class="block-header">
            <span class="block-title-text">单据上下文概览</span>
          </div>
          <div class="context-details">
            <div class="ctx-row">
              <span class="ctx-label">反馈编号</span>
              <span class="ctx-value font-mono">{{ feedbackData.code }}</span>
            </div>
            <div class="ctx-row" v-if="feedbackData.source">
              <span class="ctx-label">拿样来源</span>
              <span class="ctx-value">{{ feedbackData.source }}</span>
            </div>
            <div class="ctx-row" v-if="feedbackData.feeAmount">
              <span class="ctx-label">关联预算</span>
              <span class="ctx-value price-highlight">{{ feedbackData.feeAmount }}</span>
            </div>
          </div>
          
          <div class="quick-kpis">
            <div class="kpi-box">
              <span class="kpi-num">{{ purchaseList.length }}</span>
              <span class="kpi-lbl">购样申请</span>
            </div>
            <div class="kpi-box">
              <span class="kpi-num">{{ getTotalRegCount() }}</span>
              <span class="kpi-lbl">样品登记</span>
            </div>
          </div>
        </div>

        <!-- 购样申请单/直接登记 Master 导航列表 -->
        <div class="sidebar-block nav-list-card" v-if="purchaseList.length > 0 || directRegistrations.length > 0">
          <div class="block-header">
            <span class="block-title-text">单据目录导航</span>
          </div>
          
          <div class="master-navigation-list">
            <!-- 购样申请列表标题 -->
            <div class="nav-section-title" v-if="purchaseList.length > 0">
              <el-icon class="mr-4"><ShoppingCart /></el-icon> 购样申请明细 ({{ purchaseList.length }})
            </div>
            
            <div 
              v-for="item in purchaseList" 
              :key="item.applyNo"
              class="master-nav-item"
              :class="{ active: selectedCategory === 'purchase' && selectedApplyNo === item.applyNo }"
              @click="selectedCategory = 'purchase'; selectedApplyNo = item.applyNo"
            >
              <div class="nav-item-top">
                <span class="nav-item-no">{{ item.applyNo }}</span>
                <span :class="['nav-status-dot', getStatusTagType(item.status)]"></span>
              </div>
              <div class="nav-item-name">{{ item.sampleName }}</div>
              <div class="nav-item-footer">
                <span class="nav-price">{{ item.amount }}</span>
                <span class="nav-reg-count">{{ item.registrations?.length || 0 }} 样品</span>
              </div>
              
              <!-- 审批流转进度微型节点 timeline -->
              <div class="nav-item-approval-nodes" v-if="item.approvalNodes && item.approvalNodes.length > 0">
                <div class="approval-nodes-flow">
                  <template v-for="(node, nIdx) in item.approvalNodes" :key="nIdx">
                    <div class="mini-node" :class="node.status" :title="node.nodeName + (node.operator ? ' (' + node.operator + ')' : '')">
                      <span class="mini-node-dot"></span>
                      <span class="mini-node-text">{{ node.nodeName }}</span>
                    </div>
                    <span class="node-arrow" v-if="nIdx < item.approvalNodes.length - 1">
                      <el-icon><ArrowRight /></el-icon>
                    </span>
                  </template>
                </div>
              </div>
            </div>

            <!-- 直接登记项 -->
            <div class="nav-section-title mt-16" v-if="directRegistrations.length > 0">
              <el-icon class="mr-4"><List /></el-icon> 直接登记
            </div>
            <div 
              v-if="directRegistrations.length > 0"
              class="master-nav-item"
              :class="{ active: selectedCategory === 'direct' }"
              @click="selectedCategory = 'direct'; selectedApplyNo = ''"
            >
              <div class="nav-item-top">
                <span class="nav-item-no">直接登记单明细</span>
                <span class="nav-status-dot success"></span>
              </div>
              <div class="nav-item-name">无需购样直接登记样品</div>
              <div class="nav-item-footer">
                <span class="nav-price">¥ 0.00</span>
                <span class="nav-reg-count">{{ directRegistrations.length }} 笔记录</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 垂直业务链路 -->
        <div class="sidebar-block path-card">
          <div class="block-header">
            <span class="block-title-text">链路执行进度</span>
          </div>
          
          <div class="vertical-timeline mt-16">
            <div class="timeline-node-item" :class="'status-' + getStepStatus(1)">
              <div class="timeline-line"></div>
              <div class="node-bullet">
                <el-icon v-if="getStepStatus(1) === 'completed'"><Check /></el-icon>
                <span v-else>1</span>
              </div>
              <div class="node-content">
                <div class="node-title">反馈单建立</div>
                <div class="node-desc">{{ feedbackData.code }}</div>
              </div>
            </div>

            <div class="timeline-node-item" :class="'status-' + getStepStatus(2)">
              <div class="timeline-line"></div>
              <div class="node-bullet">
                <el-icon v-if="getStepStatus(2) === 'completed'"><Check /></el-icon>
                <span v-else>2</span>
              </div>
              <div class="node-content">
                <div class="node-title">购样申请</div>
                <div class="node-desc">
                  <span v-if="purchaseList.length > 0">关联购样 {{ purchaseList.length }} 单</span>
                  <span v-else>无需购样</span>
                </div>
              </div>
            </div>

            <div class="timeline-node-item" :class="'status-' + getStepStatus(3)">
              <div class="node-bullet">
                <el-icon v-if="getStepStatus(3) === 'completed'"><Check /></el-icon>
                <span v-else>3</span>
              </div>
              <div class="node-content">
                <div class="node-title">样品到货登记</div>
                <div class="node-desc">已入库 {{ getTotalRegCount() }} 条数据</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. 右侧面板：当前选中项的 Detail 详细展示区域 (flex: 1) -->
      <div class="workspace-main">
        <!-- 购样申请详细数据展示 -->
        <template v-if="selectedCategory === 'purchase' && selectedApply">
          <div class="detail-workspace-card">
            <!-- 头部标题栏 -->
            <div class="detail-header-bar">
              <div class="header-left">
                <div class="header-icon"><el-icon><ShoppingCart /></el-icon></div>
                <span class="header-title">采购申请详情：<strong>{{ selectedApply.applyNo }}</strong></span>
                <el-tag :type="getStatusTagType(selectedApply.status)" size="small" effect="light" class="ml-12 custom-status-tag">{{ selectedApply.status }}</el-tag>
              </div>
              <div class="header-right">
                <span class="time-label"><el-icon><Calendar /></el-icon> {{ selectedApply.applyTime }}</span>
                <el-button v-if="selectedApply.status === '待提交'" type="primary" link size="small" @click="handleEditPurchase(selectedApply)" class="ml-16 edit-btn">
                  <el-icon class="mr-4"><Edit /></el-icon>编辑此申请
                </el-button>
              </div>
            </div>

            <!-- 模块 1：拿样渠道信息 -->
            <div class="detail-section mb-20 mt-16">
              <div class="section-title mb-12">
                <span class="title-bar blue"></span>
                <span>拿样渠道信息</span>
              </div>
              
              <!-- 渠道为：供应商 -->
              <el-descriptions :column="2" border v-if="selectedApply.channel === '供应商'" class="custom-desc-table">
                <el-descriptions-item label="拿样渠道">
                  <el-tag size="small" type="info" effect="plain">供应商</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="供应商类型">
                  <span>{{ selectedApply.supplierType || '临时供应商' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="供应商名称">
                  <span class="font-semibold text-bold">{{ selectedApply.supplier }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="货源地">
                  <span>{{ selectedApply.source || '广东深圳' }}</span>
                </el-descriptions-item>
              </el-descriptions>

              <!-- 渠道为：1688 / 淘宝 -->
              <el-descriptions :column="2" border v-else class="custom-desc-table">
                <el-descriptions-item label="拿样渠道">
                  <el-tag size="small" type="warning" effect="plain">{{ selectedApply.channel }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="购买链接" :span="2">
                  <el-link 
                    v-if="selectedApply.purchaseUrl" 
                    :href="selectedApply.purchaseUrl" 
                    target="_blank" 
                    type="primary" 
                    :underline="false"
                    class="link-text-ellipsis"
                  >
                    {{ selectedApply.purchaseUrl }}
                  </el-link>
                  <span v-else>-</span>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 模块 2：费用与退款条款 -->
            <div class="detail-section mb-20">
              <div class="section-title mb-12">
                <span class="title-bar orange"></span>
                <span>费用与退款条款</span>
              </div>
              <el-descriptions :column="2" border class="custom-desc-table">
                <el-descriptions-item label="样品名称">
                  <span class="font-semibold text-bold">{{ selectedApply.sampleName }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="购样数量">
                  <span>{{ selectedApply.qty }} 个</span>
                </el-descriptions-item>
                <el-descriptions-item label="购样单价">
                  <span>{{ selectedApply.price }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="费用合计">
                  <span class="price-text font-bold">{{ selectedApply.amount }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="是否可退款" v-if="selectedApply.channel === '供应商'">
                  <el-tag :type="selectedApply.isRefundable ? 'success' : 'info'" size="small">
                    {{ selectedApply.isRefundable ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="收款方式" v-if="selectedApply.channel === '供应商'">
                  <span>{{ selectedApply.paymentMethod || '银行转账' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="退款条款" v-if="selectedApply.channel === '供应商' && selectedApply.isRefundable" :span="2">
                  <div class="refund-policy">
                    <span class="policy-tag">{{ selectedApply.refundMethod || '抵扣首单' }}</span>
                    <span class="policy-cond" v-if="selectedApply.refundCondition">( 条件: {{ selectedApply.refundCondition }} )</span>
                  </div>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 模块 3：收款账户信息 -->
            <div class="detail-section mb-20" v-if="selectedApply.channel === '供应商'">
              <div class="section-title mb-12">
                <span class="title-bar purple"></span>
                <span>收款账户信息</span>
              </div>
              <el-descriptions :column="2" border class="custom-desc-table" v-if="selectedApply.paymentMethod === '银行转账'">
                <el-descriptions-item label="开户行">
                  <span>{{ selectedApply.bankName || '中国工商银行义乌支行' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="账户名称">
                  <span>{{ selectedApply.accountName || '义乌得力商贸有限公司' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="银行账号" :span="2">
                  <span class="font-semibold code-style">{{ selectedApply.bankAccount || '6217 0038 9001 0293 848' }}</span>
                </el-descriptions-item>
              </el-descriptions>
              <el-descriptions :column="2" border class="custom-desc-table" v-else>
                <el-descriptions-item label="收款方式">
                  <span>{{ selectedApply.paymentMethod }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="收款二维码">
                  <div class="attach-images" v-if="selectedApply.paymentQrCode">
                    <el-image 
                      :src="selectedApply.paymentQrCode" 
                      :preview-src-list="[selectedApply.paymentQrCode]" 
                      fit="cover" 
                      class="attach-img-preview"
                      preview-teleported
                    />
                  </div>
                  <span class="no-attach" v-else>暂无收款二维码</span>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 模块 4：单据附件 -->
            <div class="detail-section mb-20">
              <div class="section-title mb-12">
                <span class="title-bar green"></span>
                <span>单据相关附件</span>
              </div>
              <div class="attachments-grid">
                <div class="attach-group">
                  <span class="attach-label">样品图片：</span>
                  <div class="attach-images" v-if="selectedApply.image">
                    <el-image 
                      :src="selectedApply.image" 
                      :preview-src-list="[selectedApply.image]" 
                      fit="cover" 
                      class="attach-img-preview"
                      preview-teleported
                    />
                  </div>
                  <span class="no-attach" v-else>暂无样品图片</span>
                </div>

                <div class="attach-group mt-12" v-if="selectedApply.orderScreenshot">
                  <span class="attach-label">订单截图：</span>
                  <div class="attach-images">
                    <el-image 
                      :src="selectedApply.orderScreenshot" 
                      :preview-src-list="[selectedApply.orderScreenshot]" 
                      fit="cover" 
                      class="attach-img-preview"
                      preview-teleported
                    />
                  </div>
                </div>
              </div>
            </div>



            <!-- 样品登记子表 -->
            <div class="sub-table-wrapper mt-24">
              <div class="sub-table-header">
                <span class="sub-table-title">关联样品登记记录 ({{ selectedApply.registrations?.length || 0 }})</span>
                <el-button v-if="selectedApply.status === '已通过'" type="primary" size="small" :icon="Plus" class="action-btn-styled" @click="handleRegisterSampleDirect(selectedApply)">
                  登记样品到货
                </el-button>
              </div>
              
              <el-table :data="selectedApply.registrations" size="small" class="premium-table-v4" border>
                <el-table-column label="实物图" width="75" align="center">
                  <template #default="{ row }">
                    <el-image v-if="row.image" :src="row.image" :preview-src-list="[row.image]" fit="cover" class="table-img" preview-teleported />
                    <span v-else class="no-img-text">暂无图片</span>
                  </template>
                </el-table-column>
                <el-table-column prop="regNo" label="登记单号" width="140">
                  <template #default="{ row }">
                    <el-link type="primary" class="font-bold font-mono" :underline="false" @click="handleSampleRegistrationDetail(row)">{{ row.regNo }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="样品状态" width="90" align="center">
                  <template #default="{ row }">
                    <span :class="['status-badge-pill', row.status === '合格' || row.status === '有效' ? 'success' : 'warning']">{{ row.status || '待验' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="pattern" label="款式型号" show-overflow-tooltip />
                <el-table-column prop="spec" label="规格尺寸" width="120" />
                <el-table-column label="操作" width="90" align="center" fixed="right">
                  <template #default="{ row }">
                    <el-button v-if="row.status === '待提交'" link type="primary" size="small" class="table-edit-btn" @click="handleEditSampleRegistration(row)">
                      <el-icon class="mr-2"><Edit /></el-icon>编辑
                    </el-button>
                    <span v-else class="text-placeholder">-</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </template>

        <!-- 直接登记详细数据展示 -->
        <template v-if="selectedCategory === 'direct' && directRegistrations.length > 0">
          <div class="detail-workspace-card">
            <!-- 头部标题栏 -->
            <div class="detail-header-bar">
              <div class="header-left">
                <div class="header-icon direct"><el-icon><List /></el-icon></div>
                <span class="header-title">直接登记明细 <strong>(共 {{ directRegistrations.length }} 笔记录)</strong></span>
              </div>
            </div>

            <!-- 数据明细列表 -->
            <div v-for="(reg, rIdx) in directRegistrations" :key="reg.regNo" class="direct-detail-item" :class="{ 'mt-16': rIdx > 0 }">
              <div class="direct-item-header">
                <span class="reg-no">登记单号：<strong>{{ reg.regNo }}</strong></span>
                <span :class="['status-badge-pill ml-12', reg.sampleStatus === '合格' ? 'success' : 'warning']">{{ reg.sampleStatus || '待验' }}</span>
                <div class="flex-grow"></div>
                <el-button link type="primary" size="small" @click="handleSampleRegistrationDetail(reg)" class="detail-btn">
                  <el-icon class="mr-4"><Document /></el-icon>查看详情
                </el-button>
              </div>

              <!-- 数据展示栅格 -->
              <div class="card-grid mt-12">
                <div class="grid-col span-4">
                  <div class="grid-label">样品名称</div>
                  <div class="grid-value text-bold">{{ reg.name }}</div>
                </div>
                <div class="grid-col span-2">
                  <div class="grid-label">渠道来源</div>
                  <div class="grid-value">
                    <span class="channel-badge">{{ reg.source }}</span>
                  </div>
                </div>
                <div class="grid-col span-2">
                  <div class="grid-label">样品费用</div>
                  <div class="grid-value price-highlight-large">{{ reg.sampleFee }}</div>
                </div>
                <div class="grid-col span-4">
                  <div class="grid-label">规格参数</div>
                  <div class="grid-value font-mono">{{ reg.spec || '-' }} | {{ reg.color || '-' }}</div>
                </div>
                <div class="grid-col span-4">
                  <div class="grid-label">签收信息</div>
                  <div class="grid-value font-semibold">
                    <el-icon class="mr-4"><User /></el-icon> {{ reg.receiver }}
                    <span class="time-label ml-12" v-if="reg.receiveTime">({{ reg.receiveTime }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 空状态 -->
        <el-empty v-if="!purchaseList.length && !directRegistrations.length" description="暂无关联单据数据" class="custom-empty" />
      </div>
    </div>

    <!-- 组件挂载 -->
    <PurchaseDetailDialog ref="purchaseDetailRef" />
    <PurchaseApplyDialog ref="purchaseApplyRef" @submit="handlePurchaseApplySubmit" />
    <SampleRegistrationDialog ref="sampleRegistrationRef" />
    <SampleRegistrationDetailDialog ref="sampleRegistrationDetailRef" />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Check, Clock, ArrowRight, Plus, ShoppingCart, List, Edit, Link, Calendar, User, ArrowDown, ArrowUp } from '@element-plus/icons-vue'

import PurchaseDetailDialog from './PurchaseDetailDialog.vue'
import PurchaseApplyDialog from './PurchaseApplyDialog.vue'
import SampleRegistrationDialog from './SampleRegistrationDialog.vue'
import SampleRegistrationDetailDialog from './SampleRegistrationDetailDialog.vue'

const purchaseDetailRef = ref<any>(null)
const purchaseApplyRef = ref<any>(null)
const sampleRegistrationRef = ref<any>(null)
const sampleRegistrationDetailRef = ref<any>(null)

const handlePurchaseApplyDetail = (row: any) => purchaseDetailRef.value?.open(row)
const handleEditPurchase = (row: any) => purchaseApplyRef.value?.open(row)
const handleSampleRegistrationDetail = (row: any) => sampleRegistrationDetailRef.value?.open({ ...row, proposalNo: feedbackData.value?.code })
const handleEditSampleRegistration = (row: any) => sampleRegistrationRef.value?.open(row)

const handleRegisterSampleDirect = (row: any) => {
  sampleRegistrationRef.value?.open({
    isPurchaseSync: true,
    proposalNo: feedbackData.value?.code,
    productName: row.sampleName,
    supplierName: row.supplier,
    purchaseUrl: row.purchaseUrl,
    sampleFee: parseFloat((row.price || '0').replace(/[^\d.]/g, '')) || 0
  })
}

const handlePurchaseApplySubmit = (items: any[]) => {
  if (!items) return
  items.forEach(item => {
    const idx = purchaseList.value.findIndex(p => p.applyNo === item.applyNo)
    if (idx !== -1) {
      purchaseList.value[idx] = { ...purchaseList.value[idx], ...item }
    } else {
      const newApplyNo = 'PO-NEW-' + Date.now()
      purchaseList.value.push({ ...item, applyNo: newApplyNo, registrations: [], approvalNodes: [] })
      selectedCategory.value = 'purchase'
      selectedApplyNo.value = newApplyNo
    }
  })
}

const visible = ref(false)
const feedbackData = ref<any>(null)
const purchaseList = ref<any[]>([])
const directRegistrations = ref<any[]>([])

const selectedCategory = ref<'purchase' | 'direct'>('purchase')
const selectedApplyNo = ref<string>('')
const selectedApply = computed(() => {
  const row = purchaseList.value.find(p => p.applyNo === selectedApplyNo.value)
  if (!row) return null

  // 补齐查看详情时可能缺失的默认字段数据，以展示完整的多渠道特异信息
  const defaultBank = {
    paymentMethod: '银行转账',
    bankName: '中国工商银行义乌支行',
    accountName: row.supplier || '义乌市得力商贸服务部',
    bankAccount: '6217 0038 9001 0293 848'
  }
  
  const defaultRefund = {
    isRefundable: row.status === '已通过',
    refundMethod: '抵扣首单货款',
    refundCondition: '首批大货订单满1000件返还'
  }

  return {
    ...defaultBank,
    ...defaultRefund,
    ...row,
    // 如果是 1688 / 淘宝，我们配给它对应的付款截图或店铺名
    shopName: row.channel !== '供应商' ? `${row.channel}优质货源店` : '',
    orderScreenshot: row.channel !== '供应商' ? 'https://picsum.photos/300/200?random=40' : '',
    paymentQrCode: (row.paymentQrCodes && row.paymentQrCodes.length > 0) ? row.paymentQrCodes[0] : (row.paymentQrCode || (['支付宝', '微信'].includes(row.paymentMethod) ? 'https://picsum.photos/200/200?random=50' : ''))
  }
})

const drawerSize = computed(() => (purchaseList.value.length === 1 || (purchaseList.value.length === 0 && directRegistrations.value.length > 0)) ? '1100px' : '1250px')

const getCurrentPathStep = () => {
  if (getTotalRegCount() > 0) return 3
  if (purchaseList.value.length > 0) return 2
  return 1
}

const getStepStatus = (stepNum: number) => {
  const current = getCurrentPathStep()
  if (current > stepNum) return 'completed'
  if (current === stepNum) return 'active'
  return 'pending'
}

const getTotalRegCount = () => (purchaseList.value.reduce((acc, p) => acc + (p.registrations?.length || 0), 0) + directRegistrations.value.length)

const open = (row: any) => {
  feedbackData.value = row
  if (row.feeAmount === '¥ 0.00') {
    purchaseList.value = []
    directRegistrations.value = [{ regNo: 'DJ-20260522-71', name: row.additionalConditions || '样品打样件', source: '供应商', sampleFee: '¥ 0.00', sampleStatus: '合格', receiveTime: '2026-05-24 10:00', receiver: '李四' }]
    selectedCategory.value = 'direct'
    selectedApplyNo.value = ''
  } else {
    directRegistrations.value = []
    purchaseList.value = [{ applyNo: 'PO-20260520-01', sampleName: 'DIY灯光板 - 款式A', channel: '供应商', supplier: row.source, qty: 1, price: '¥ 50.00', amount: row.feeAmount, status: '已通过', applyTime: '2026-05-21 14:00', registrations: [{ regNo: 'DJ-20260522-11', pattern: '复古雕花', color: '曜石黑', spec: '通用', status: '待提交', image: 'https://picsum.photos/60/60?random=1' }], approvalNodes: [{ nodeName: "提交申请", operator: "张三", time: "2026-05-21 14:00", status: "completed" }, { nodeName: "部门主管审批", operator: "经理", time: "2026-05-21 15:30", status: "completed" }] }]
    selectedCategory.value = 'purchase'
    selectedApplyNo.value = purchaseList.value[0]?.applyNo || ''
  }
  visible.value = true
}

const getStatusTagType = (status: string) => status === '已通过' ? 'success' : (status === '审批中' ? 'warning' : 'info')
const formatTimeWithoutYear = (ts: string) => ts.split(' ').length === 2 ? ts.split(' ')[0].split('-').slice(1).join('-') + ' ' + ts.split(' ')[1] : ts

defineExpose({ open })
</script>

<style lang="scss" scoped>
/* 高级设计师调色盘 */
$primary: #1890ff;
$success: #52c41a;
$warning: #faad14;
$danger: #ff4d4f;
$text-title: #1f1f1f;
$text-body: #434343;
$text-light: #8c8c8c;
$bg-main: #f4f7f9;

:deep(.el-drawer__body) {
  padding: 0 !important;
  background-color: $bg-main !important;
}

.workspace-container {
  display: flex;
  gap: 24px;
  padding: 24px;
  background-color: $bg-main;
  min-height: calc(100vh - 60px);
  box-sizing: border-box;
}

/* 1. 抽屉头部样式 */
.drawer-header-v4 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 32px;
  
  .title-main {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .title-icon {
      font-size: 20px;
      color: $primary;
      display: flex;
      align-items: center;
    }
    .title-text {
      font-size: 18px;
      font-weight: 700;
      color: $text-title;
    }
    .title-divider {
      font-size: 14px;
      color: $text-light;
    }
    .title-sub {
      font-size: 14px;
      color: $text-light;
      font-weight: 500;
    }
  }
}

/* 左侧面板 sidebar */
.workspace-sidebar {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-block {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  
  .block-header {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 12px;
    margin-bottom: 16px;
    
    .block-title-text {
      font-size: 14px;
      font-weight: 700;
      color: #1f1f1f;
      display: flex;
      align-items: center;
      gap: 6px;
      &::before {
        content: '';
        width: 3px;
        height: 14px;
        background: $primary;
        border-radius: 2px;
      }
    }
  }
}

.context-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .ctx-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    
    .ctx-label {
      color: #8c8c8c;
      font-weight: 500;
    }
    .ctx-value {
      color: #262626;
      font-weight: 600;
      &.font-mono {
        font-family: monospace;
      }
      &.price-highlight {
        color: $danger;
        font-weight: 700;
        font-family: 'DIN Alternate', sans-serif;
      }
    }
  }
}

.quick-kpis {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed #f0f0f0;
  
  .kpi-box {
    flex: 1;
    background: #f8fafc;
    border-radius: 10px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #f0f5ff;
    
    .kpi-num {
      font-size: 22px;
      font-weight: 800;
      color: $primary;
      font-family: 'DIN Alternate', sans-serif;
    }
    
    .kpi-lbl {
      font-size: 11px;
      color: #8c8c8c;
      margin-top: 2px;
      font-weight: 500;
    }
  }
}

/* Master 导航列表样式 */
.master-navigation-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .nav-section-title {
    font-size: 12px;
    font-weight: 700;
    color: #8c8c8c;
    padding: 8px 4px 4px;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .master-nav-item {
    background: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    padding: 12px 14px;
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    flex-direction: column;
    gap: 6px;
    
    &:hover {
      background: #f0f5ff;
      border-color: rgba($primary, 0.3);
      transform: translateY(-1px);
    }
    
    &.active {
      background: #e6f7ff;
      border-color: $primary;
      box-shadow: 0 4px 12px rgba($primary, 0.08);
      
      .nav-item-top .nav-item-no {
        color: $primary;
        font-weight: 700;
      }
    }
    
    .nav-item-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .nav-item-no {
        font-size: 13px;
        font-weight: 600;
        color: #262626;
        font-family: monospace;
      }
      
      .nav-status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;
        
        &.success { background-color: $success; }
        &.warning { background-color: $warning; }
        &.info { background-color: $text-light; }
      }
    }
    
    .nav-item-name {
      font-size: 12px;
      color: #595959;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .nav-item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      
      .nav-price {
        color: $danger;
        font-weight: 700;
        font-family: 'DIN Alternate', sans-serif;
      }
      
      .nav-reg-count {
        color: $text-light;
        font-weight: 500;
      }
    }

    /* 侧边栏微型审批节点流 */
    .nav-item-approval-nodes {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px dashed rgba(0, 0, 0, 0.05);
      
      .approval-nodes-flow {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
        
        .mini-node {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: $text-light;
          
          .mini-node-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #bfbfbf;
            display: inline-block;
          }
          
          .mini-node-text {
            max-width: 65px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          &.completed {
            color: $success;
            .mini-node-dot {
              background-color: $success;
              box-shadow: 0 0 0 2px rgba($success, 0.15);
            }
          }
          
          &.processing {
            color: $primary;
            font-weight: 700;
            .mini-node-dot {
              background-color: $primary;
              box-shadow: 0 0 0 2px rgba($primary, 0.15);
            }
          }
        }

        .node-arrow {
          display: inline-flex;
          align-items: center;
          color: #bfbfbf;
          font-size: 9px;
        }
      }
    }
  }
}

/* 垂直时间线样式 */
.vertical-timeline {
  display: flex;
  flex-direction: column;
  padding-left: 4px;
  
  .timeline-node-item {
    display: flex;
    gap: 16px;
    position: relative;
    padding-bottom: 24px;
    
    &:last-child {
      padding-bottom: 0;
      .timeline-line {
        display: none;
      }
    }
    
    .timeline-line {
      position: absolute;
      left: 13px;
      top: 26px;
      bottom: -6px;
      width: 2px;
      background-color: #eef2f6;
      z-index: 1;
      transition: background-color 0.3s;
    }
    
    .node-bullet {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #ffffff;
      border: 2px solid #bfbfbf;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: #8c8c8c;
      z-index: 2;
      transition: all 0.3s;
    }
    
    .node-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      
      .node-title {
        font-size: 13px;
        font-weight: 700;
        color: #262626;
      }
      
      .node-desc {
        font-size: 11px;
        color: #8c8c8c;
        font-family: monospace;
      }
    }
    
    &.status-completed {
      .timeline-line {
        background-color: $success;
      }
      .node-bullet {
        background-color: $success;
        border-color: $success;
        color: #ffffff;
      }
      .node-content {
        .node-title { color: $success; }
      }
    }
    
    &.status-active {
      .timeline-line {
        background-color: rgba($primary, 0.3);
      }
      .node-bullet {
        background-color: $primary;
        border-color: $primary;
        color: #ffffff;
        box-shadow: 0 0 0 4px rgba($primary, 0.12);
      }
      .node-content {
        .node-title { color: $primary; }
      }
    }
    
    &.status-pending {
      .node-bullet {
        background-color: #f5f5f5;
        border-color: #d9d9d9;
        color: #bfbfbf;
      }
    }
  }
}

/* 右侧面板 main */
.workspace-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.detail-workspace-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  min-height: calc(100vh - 108px);
  box-sizing: border-box;
}

.detail-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 18px;
  border-bottom: 1px dashed #e8e8e8;
  margin-bottom: 20px;
  
  .header-left {
    display: flex;
    align-items: center;
    
    .header-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba($primary, 0.08);
      color: $primary;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      margin-right: 12px;
      
      &.direct {
        background: rgba($warning, 0.08);
        color: $warning;
      }
    }
    
    .header-title {
      font-size: 16px;
      color: #1f1f1f;
      strong {
        color: #000;
        font-family: monospace;
      }
    }
    
    .custom-status-tag {
      font-weight: 600;
      border-radius: 6px;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    
    .time-label {
      font-size: 13px;
      color: #8c8c8c;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    
    .edit-btn {
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  }
}

/* 自定义卡片式数据栅格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  background-color: #fafafa;
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid #f0f0f0;
  
  .grid-col {
    display: flex;
    flex-direction: column;
    gap: 6px;
    
    &.span-1 { grid-column: span 1; }
    &.span-2 { grid-column: span 2; }
    &.span-3 { grid-column: span 3; }
    &.span-4 { grid-column: span 4; }
    &.span-5 { grid-column: span 5; }
    &.span-6 { grid-column: span 6; }
    
    .grid-label {
      font-size: 12px;
      color: #8c8c8c;
      font-weight: 500;
    }
    
    .grid-value {
      font-size: 14px;
      color: #262626;
      font-weight: 600;
      word-break: break-all;
      
      &.text-bold {
        font-weight: 700;
      }
    }
  }
}

.price-highlight-large {
  color: $danger;
  font-weight: 800;
  font-size: 16px;
  font-family: 'DIN Alternate', sans-serif;
}

.channel-badge {
  background-color: #f0f5ff;
  color: $primary;
  border: 1px solid #adc6ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.vendor-text {
  font-weight: 600;
  color: #595959;
}

.purchase-link {
  font-weight: 600;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
}

.flow-link-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: #f0f0f0;
  border: 1px solid #d9d9d9;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba($primary, 0.08);
    border-color: rgba($primary, 0.2);
    color: $primary;
  }
}

/* 子表格区域 */
.sub-table-wrapper {
  background-color: #fafbfd;
  border-radius: 14px;
  border: 1px dashed #d9e6f2;
  padding: 20px;
  
  .sub-table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .sub-table-title {
      font-size: 13px;
      font-weight: 700;
      color: #595959;
      display: flex;
      align-items: center;
      gap: 6px;
      &::before {
        content: '';
        width: 6px;
        height: 6px;
        background: $primary;
        border-radius: 50%;
      }
    }
    
    .action-btn-styled {
      font-weight: 600;
      border-radius: 8px;
    }
  }
}

.premium-table-v4 {
  --el-table-border-color: #eef2f6;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  
  :deep(.el-table__header-wrapper) th {
    background-color: #f0f4f8 !important;
    color: #1f1f1f;
    font-weight: 700;
    height: 40px !important;
    border-bottom: 1px solid #eef2f6 !important;
  }
  
  :deep(.el-table__row) td {
    height: 44px !important;
    background-color: #ffffff;
  }
}

.table-img {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  transition: transform 0.20s ease;
  
  &:hover {
    transform: scale(1.12);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
}

.no-img-text, .text-placeholder {
  color: #bfbfbf;
  font-size: 12px;
}

.status-badge-pill {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  
  &.success {
    background: #f6ffed;
    color: $success;
    border: 1px solid #b7eb8f;
  }
  &.warning {
    background: #fff7e6;
    color: $warning;
    border: 1px solid #ffd591;
  }
}

.table-edit-btn {
  font-weight: 600;
  font-size: 12px;
}

/* 直接登记明细条目 */
.direct-detail-item {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 18px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.01);
  
  .direct-item-header {
    display: flex;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px dashed #e8e8e8;
    
    .reg-no {
      font-size: 14px;
      color: #1f1f1f;
      strong {
        color: #000;
        font-family: monospace;
      }
    }
  }
}

.flex-grow { flex-grow: 1; }
.mb-12 { margin-bottom: 12px; }
.mt-12 { margin-top: 12px; }
.mt-16 { margin-top: 16px; }
.mt-24 { margin-top: 24px; }
.ml-12 { margin-left: 12px; }
.ml-16 { margin-left: 16px; }
.mr-4 { margin-right: 4px; }
.mr-2 { margin-right: 2px; }
.text-bold { font-weight: 700; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-mono { font-family: monospace; }

.custom-empty {
  padding: 80px 0;
}
</style>

<style>
.premium-drawer .el-drawer__body {
  background-color: #f4f7f9 !important;
}

.premium-timeline-popper {
  padding: 16px !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important;
}

.popover-timeline-container {
  padding: 4px 2px;
  
  .popover-title {
    font-size: 13px;
    font-weight: 700;
    color: #1f1f1f;
    margin-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 6px;
  }
  
  .custom-timeline {
    padding-left: 4px;
  }
  
  .timeline-node-name {
    font-size: 13px;
    font-weight: 600;
    color: #262626;
  }
  
  .timeline-node-operator {
    font-size: 11px;
    color: #8c8c8c;
    margin-left: 4px;
  }
}

/* 购样申请单详情风格一致性样式 */
.detail-section {
  background-color: #ffffff;
  margin-top: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .title-bar {
    width: 3px;
    height: 13px;
    border-radius: 2px;
    
    &.blue { background-color: #1890ff; }
    &.orange { background-color: #fa8c16; }
    &.purple { background-color: #722ed1; }
    &.green { background-color: #52c41a; }
  }
  
  span {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
  }
}

.custom-desc-table {
  margin-top: 8px;
  :deep(.el-descriptions__label) {
    background-color: #f8fafc !important;
    color: #64748b;
    font-weight: 600;
    width: 120px;
    padding: 10px 14px;
  }
  :deep(.el-descriptions__content) {
    color: #334155;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 500;
  }
}

.link-text-ellipsis {
  display: inline-block;
  max-width: 580px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}

.price-text {
  color: #fa8c16;
  font-size: 14px;
}

.code-style {
  font-family: Consolas, Monaco, monospace;
  font-size: 13px;
  color: #0f172a;
}

.refund-policy {
  display: flex;
  align-items: center;
  gap: 6px;
  
  .policy-tag {
    background-color: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
  }
  
  .policy-cond {
    font-size: 12px;
    color: #64748b;
  }
}

.attachments-grid {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: 8px;
}

.attach-group {
  display: flex;
  align-items: center;
  
  .attach-label {
    width: 80px;
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
  }
  
  .attach-img-preview {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    border: 1px solid #cbd5e1;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  .no-attach {
    font-size: 12px;
    color: #94a3b8;
  }
}

.approval-timeline-box {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 18px 20px;
}

.inline-timeline {
  :deep(.el-timeline-item) {
    padding-bottom: 20px;
    &:last-child {
      padding-bottom: 0;
    }
  }
}
</style>
