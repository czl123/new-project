<template>
  <div class="kanban-page custom-scrollbar">
    <!-- 顶部管理统计概览 (Global KPIs) -->
    <div class="dashboard-header-wrapper mb-20">
      <div class="header-title-line">
        <div class="title-left">
          <el-icon class="title-icon"><DataAnalysis /></el-icon>
          <span class="title-text">开发样拿样任务看板 <span class="subtitle">（管理视图）</span></span>
        </div>
        <div class="title-right">
          <span class="refresh-time">数据更新时间：2026-06-04 11:55:00</span>
          <el-button size="small" icon="Refresh" circle @click="handleResetFilters" />
        </div>
      </div>

      <div class="stat-cards-grid">
        <div class="stat-card total-tasks">
          <div class="stat-card-inner">
            <div class="stat-info">
              <span class="label">进行中拿样任务</span>
              <span class="value">158 <span class="unit">个</span></span>
            </div>
            <div class="icon-box"><el-icon><Management /></el-icon></div>
          </div>
          <div class="stat-footer">
            <span class="trendup">较上周 +12%</span>
            <span class="desc">待承接 12 项</span>
          </div>
        </div>

        <div class="stat-card urgent-tasks">
          <div class="stat-card-inner">
            <div class="stat-info">
              <span class="label">超时与预警待办</span>
              <span class="value">12 <span class="unit">项</span></span>
            </div>
            <div class="icon-box"><el-icon><Warning /></el-icon></div>
          </div>
          <div class="stat-footer">
            <span class="trenddown">逾期超 3 天：5 项</span>
            <span class="desc">反馈超时：4 项</span>
          </div>
        </div>

        <div class="stat-card avg-cycle">
          <div class="stat-card-inner">
            <div class="stat-info">
              <span class="label">平均拿样周期</span>
              <span class="value">5.4 <span class="unit">天</span></span>
            </div>
            <div class="icon-box"><el-icon><Timer /></el-icon></div>
          </div>
          <div class="stat-footer">
            <span class="trendup">现货拿样：2.3 天</span>
            <span class="desc">定制拿样：8.5 天</span>
          </div>
        </div>

        <div class="stat-card total-cost">
          <div class="stat-card-inner">
            <div class="stat-info">
              <span class="label">本月累计审批拿样费用</span>
              <span class="value">¥ 15,400</span>
            </div>
            <div class="icon-box"><el-icon><Money /></el-icon></div>
          </div>
          <div class="stat-footer">
            <span class="accent-text">模具费：¥ 13,000</span>
            <span class="desc">打样/购样：¥ 2,400</span>
          </div>
        </div>

        <div class="stat-card refund-pending">
          <div class="stat-card-inner">
            <div class="stat-info">
              <span class="label">应收退还模具/打样费</span>
              <span class="value">¥ 8,000</span>
            </div>
            <div class="icon-box"><el-icon><CreditCard /></el-icon></div>
          </div>
          <div class="stat-footer">
            <span class="highlight-text">已达起订量待退：2 项</span>
            <span class="desc">累计可退：¥ 8,000</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 高级组合筛选区 -->
    <div class="filter-panel modern-card mb-20">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">产品经理:</span>
          <el-select v-model="selectedPm" placeholder="请选择 PM" size="default" style="width: 130px;">
            <el-option label="全部 PM" value="全部" />
            <el-option v-for="item in pmOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>

        <div class="filter-item">
          <span class="filter-label">承接人:</span>
          <el-select v-model="selectedAssignee" placeholder="请选择承接人" size="default" style="width: 130px;">
            <el-option label="全部承接人" value="全部" />
            <el-option v-for="item in assigneeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>

        <div class="filter-item">
          <span class="filter-label">拿样方式:</span>
          <el-select v-model="selectedMethod" placeholder="请选择" size="default" style="width: 130px;">
            <el-option label="全部方式" value="全部" />
            <el-option label="现货拿样" value="现货拿样" />
            <el-option label="定制拿样" value="定制拿样" />
          </el-select>
        </div>

        <div class="filter-item">
          <span class="filter-label">紧急度:</span>
          <el-select v-model="selectedUrgency" placeholder="请选择" size="default" style="width: 110px;">
            <el-option label="全部" value="全部" />
            <el-option label="紧急" value="紧急" />
            <el-option label="普通" value="普通" />
          </el-select>
        </div>

        <div class="filter-item flex-grow">
          <el-input 
            v-model="searchQuery" 
            placeholder="搜索提案编号/产品名称/大类..." 
            prefix-icon="Search" 
            clearable 
            size="default"
            style="max-width: 320px;"
          />
        </div>

        <div class="filter-actions">
          <el-button type="primary" size="default" @click="handleFilter">查询</el-button>
          <el-button size="default" plain @click="handleResetFilters">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 看板主区域 -->
    <div class="kanban-container custom-scrollbar mb-20">
      <div v-for="column in kanbanColumns" :key="column.status" class="kanban-column">
        <div class="column-header" :style="{ borderTopColor: column.color }">
          <div class="header-left">
            <span class="dot" :style="{ backgroundColor: column.color }"></span>
            <span class="title">{{ column.label }}</span>
          </div>
          <span class="count-badge" :style="{ backgroundColor: column.bgColor, color: column.color }">{{ column.tasks.length }}</span>
        </div>
        
        <div class="column-body custom-scrollbar">
          <div 
            v-for="task in column.tasks" 
            :key="task.proposalNo" 
            class="task-card"
            :class="{ urgent: task.isUrgent }"
            @click="handleCardClick(task)"
          >
            <div class="card-tag-wrapper">
              <el-tag size="small" :type="task.isUrgent ? 'danger' : 'info'" effect="dark" class="level-tag">
                {{ task.isUrgent ? 'P0' : 'P1' }}
              </el-tag>
              <el-tag size="small" :type="task.sampleMethodText === '定制拿样' ? 'success' : 'primary'" effect="plain" class="method-tag">
                {{ task.sampleMethodText }}
              </el-tag>
            </div>
            
            <div class="task-top">
              <span class="no">{{ task.proposalNo }}</span>
              <span class="level-indicator">{{ task.level }}级提案</span>
            </div>
            
            <div class="task-info">
              <el-image :src="task.image" class="task-img" fit="cover" />
              <div class="task-details">
                <div class="name" :title="task.productName">{{ task.productName }}</div>
                <div class="meta">{{ task.category }} | PM: {{ task.pm }}</div>
              </div>
            </div>

            <div class="task-cost-line" v-if="task.costText && task.costText !== '无'">
              <el-icon class="cost-icon"><Money /></el-icon>
              <span class="cost-val">{{ task.costText }}</span>
            </div>
            
            <div class="task-footer">
              <div class="time" :class="{ danger: task.remainingDays <= 3 }">
                <el-icon><Timer /></el-icon>
                <span>
                  <template v-if="task.remainingDays < 0">
                    逾期 {{ Math.abs(task.remainingDays) }} 天
                  </template>
                  <template v-else-if="task.remainingDays === 0">
                    今日截止
                  </template>
                  <template v-else>
                    剩 {{ task.remainingDays }} 天
                  </template>
                </span>
              </div>
              
              <div class="assignees-box">
                <template v-if="task.assignees && task.assignees.length">
                  <div 
                    v-for="user in task.assignees" 
                    :key="user.name"
                    class="avatar-circle"
                    :style="{ backgroundColor: user.color }"
                    :title="'承接人: ' + user.name"
                  >
                    {{ user.name.charAt(0) }}
                  </div>
                </template>
                <span v-else class="no-assignee">待认领</span>
              </div>
            </div>
          </div>

          <div v-if="column.tasks.length === 0" class="empty-column-placeholder">
            <el-icon class="empty-icon"><FolderOpened /></el-icon>
            <span>无进行中任务</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部深度图表与监控区域 -->
    <div class="bottom-analytics-grid">
      <!-- 拿样效率时效与瓶颈分析 -->
      <div class="analytics-card modern-card">
        <div class="card-header-v4">
          <div class="title">
            <el-icon class="title-icon"><Timer /></el-icon>
            <span>拿样全流程时效与卡滞瓶颈分析</span>
          </div>
          <span class="header-desc">统计全局任务在各阶段的平均停留时间</span>
        </div>
        
        <div class="funnel-container">
          <div v-for="(step, idx) in bottleneckSteps" :key="step.name" class="funnel-row">
            <div class="step-meta">
              <span class="step-num">0{{ idx + 1 }}</span>
              <span class="step-name">{{ step.name }}</span>
            </div>
            <div class="step-progress-wrapper">
              <div class="step-bar-bg">
                <div 
                  class="step-bar-fill" 
                  :style="{ width: step.percent + '%', backgroundColor: step.isBottleneck ? '#ef4444' : '#3b82f6' }"
                >
                  <span class="duration-text">{{ step.duration }}天</span>
                </div>
              </div>
            </div>
            <div class="step-status">
              <el-tag v-if="step.isBottleneck" size="small" type="danger" effect="dark" class="bottleneck-tag">
                ⚠️ 瓶颈环节
              </el-tag>
              <span v-else class="normal-status">正常</span>
            </div>
          </div>
        </div>

        <div class="efficiency-insights mt-20">
          <div class="insight-title">💡 管理效能洞察</div>
          <p class="insight-text">
            数据表明，从<b>“任务承接”到“方案反馈（寻源）”</b>阶段耗时占比最高，平均达 <b>2.1 天</b>。
            主要卡滞原因为：1688 定制商家反馈回复慢、模具复杂程度评估多。建议优化长期合作供应商打样白名单。
          </p>
        </div>
      </div>

      <!-- 模具/样品退款闭环监控表 -->
      <div class="analytics-card modern-card">
        <div class="card-header-v4">
          <div class="title">
            <el-icon class="title-icon"><CreditCard /></el-icon>
            <span>模具与样品退款闭环追踪看板</span>
          </div>
          <span class="header-desc">关联大货采购数，追踪可退款项进度</span>
        </div>

        <div class="refund-table-wrapper">
          <el-table :data="refundTrackerData" border stripe size="small" class="refund-table">
            <el-table-column label="提案/产品" min-width="150" show-overflow-tooltip>
              <template #default="{ row }">
                <div class="refund-product-cell">
                  <span class="no">{{ row.proposalNo }}</span>
                  <span class="name">{{ row.productName }}</span>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="供应商" prop="supplier" width="130" show-overflow-tooltip />
            
            <el-table-column label="垫付款项" width="105">
              <template #default="{ row }">
                <div class="cost-cell">
                  <span class="amt">{{ row.amount }}</span>
                  <span class="type">{{ row.feeType }}</span>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="退款条款" prop="terms" width="125" show-overflow-tooltip />
            
            <el-table-column label="大货采购进度" min-width="160">
              <template #default="{ row }">
                <div class="progress-cell">
                  <div class="progress-text">
                    <span>{{ row.currentQty }}</span> / <span class="target">{{ row.targetQty }} 件</span>
                  </div>
                  <el-progress 
                    :percentage="Math.min(Math.round((row.currentQty / row.targetQty) * 100), 100)" 
                    :status="row.currentQty >= row.targetQty ? 'success' : 'exception'"
                    :color="row.currentQty >= row.targetQty ? '#10b981' : '#f59e0b'"
                    :stroke-width="6"
                  />
                </div>
              </template>
            </el-table-column>

            <el-table-column label="状态" width="115" align="center">
              <template #default="{ row }">
                <el-tag :type="getRefundStatusTag(row.status)" size="small" effect="dark">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="90" align="center" fixed="right">
              <template #default="{ row }">
                <el-button 
                  v-if="row.status === '已达门槛(待催退)'" 
                  type="danger" 
                  size="small" 
                  link 
                  icon="Bell" 
                  @click="handleRemindRefund(row)"
                >
                  催退
                </el-button>
                <span v-else class="text-muted">-</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 侧边任务详情抽屉 -->
    <TaskDetailDrawer ref="taskDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, Management, Warning, Timer, Money, CreditCard, 
  Refresh, FolderOpened, Bell, DataAnalysis 
} from '@element-plus/icons-vue'
import TaskDetailDrawer from './components/TaskDetailDrawer.vue'

// 筛选响应式变量
const searchQuery = ref('')
const selectedPm = ref('全部')
const selectedAssignee = ref('全部')
const selectedMethod = ref('全部')
const selectedUrgency = ref('全部')

const taskDetailDrawerRef = ref<any>(null)

// 选项列表数据
const pmOptions = ['颜沙沙', '王小明', '张学友', '严选', '赵敏', '李健']
const assigneeOptions = ['张三', '李四', '王五', '黎明', '李想', '易烊千玺', '张子枫', '赵铁柱', '孙悟空']

// 模拟任务列表原始数据
const rawTasks = ref([
  {
    image: 'https://picsum.photos/100/100?random=1',
    proposalNo: 'TA-202605049',
    productName: 'DIY灯光板 - 亚克力透明款',
    pm: '颜沙沙',
    category: '家居装饰',
    level: 'A',
    remainingDays: 2,
    isUrgent: true,
    receiverStatus: '待承接',
    assignees: [],
    costText: '打样费: ¥ 150',
    sampleMethodText: '定制拿样'
  },
  {
    image: 'https://picsum.photos/100/100?random=11',
    proposalNo: 'TA-202605060',
    productName: '智能香薰机 - 木纹版',
    pm: '王小明',
    category: '生活电器',
    level: 'B',
    remainingDays: 8,
    isUrgent: false,
    receiverStatus: '已承接',
    assignees: [{ name: '李华', color: '#3b82f6' }],
    costText: '无',
    sampleMethodText: '现货拿样'
  },
  {
    image: 'https://picsum.photos/100/100?random=21',
    proposalNo: 'TA-202605065',
    productName: '人体工学鼠标 - 旗舰版',
    pm: '张学友',
    category: '数码配件',
    level: 'A',
    remainingDays: 1,
    isUrgent: true,
    receiverStatus: '待审批',
    assignees: [{ name: '黎明', color: '#10b981' }],
    costText: '开模费: ¥ 8,000',
    sampleMethodText: '定制拿样'
  },
  {
    image: 'https://picsum.photos/100/100?random=31',
    proposalNo: 'TA-202605071',
    productName: '智能猫砂盆 - 自动清理',
    pm: '严选',
    category: '宠物用品',
    level: 'S',
    remainingDays: 20,
    isUrgent: false,
    receiverStatus: '样品运输中',
    assignees: [{ name: '李想', color: '#8b5cf6' }],
    costText: '购样费: ¥ 450',
    sampleMethodText: '现货拿样'
  },
  {
    image: 'https://picsum.photos/100/100?random=41',
    proposalNo: 'TA-202605076',
    productName: '折叠电动滑板车',
    pm: '颜沙沙',
    category: '出行工具',
    level: 'A',
    remainingDays: 6,
    isUrgent: true,
    receiverStatus: '样品评估中',
    assignees: [{ name: '易烊千玺', color: '#ec4899' }],
    costText: '打样费: ¥ 600',
    sampleMethodText: '定制拿样'
  },
  {
    image: 'https://picsum.photos/100/100?random=51',
    proposalNo: 'TA-202605082',
    productName: '猫咪自动饮水机',
    pm: '颜沙沙',
    category: '宠物用品',
    level: 'B',
    remainingDays: 0,
    isUrgent: true,
    receiverStatus: '已归档',
    assignees: [{ name: '张子枫', color: '#f59e0b' }],
    costText: '购样费: ¥ 120',
    sampleMethodText: '现货拿样'
  },
  {
    image: 'https://picsum.photos/100/100?random=61',
    proposalNo: 'TA-202605088',
    productName: '露营多功能手电筒',
    pm: '赵敏',
    category: '户外运动',
    level: 'C',
    remainingDays: 4,
    isUrgent: false,
    receiverStatus: '待承接',
    assignees: [],
    costText: '无',
    sampleMethodText: '现货拿样'
  },
  {
    image: 'https://picsum.photos/100/100?random=71',
    proposalNo: 'TA-202605090',
    productName: '亲肤减压腰带 - 隐身薄款',
    pm: '李健',
    category: '个护健康',
    level: 'A',
    remainingDays: 12,
    isUrgent: false,
    receiverStatus: '已承接',
    assignees: [{ name: '王五', color: '#6366f1' }],
    costText: '开模费: ¥ 5,000',
    sampleMethodText: '定制拿样'
  },
  {
    image: 'https://picsum.photos/100/100?random=81',
    proposalNo: 'TA-202605092',
    productName: '复古蓝牙音箱',
    pm: '王小明',
    category: '数码配件',
    level: 'B',
    remainingDays: -2,
    isUrgent: true,
    receiverStatus: '待审批',
    assignees: [{ name: '赵铁柱', color: '#14b8a6' }],
    costText: '打样费: ¥ 200',
    sampleMethodText: '现货拿样'
  },
  {
    image: 'https://picsum.photos/100/100?random=91',
    proposalNo: 'TA-202605095',
    productName: '户外防潮睡垫',
    pm: '严选',
    category: '户外运动',
    level: 'C',
    remainingDays: 15,
    isUrgent: false,
    receiverStatus: '样品评估中',
    assignees: [{ name: '孙悟空', color: '#a855f7' }],
    costText: '无',
    sampleMethodText: '现货拿样'
  }
])

// 组合筛选过滤逻辑
const filteredTasks = computed(() => {
  return rawTasks.value.filter(task => {
    // 关键字搜索
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchNo = task.proposalNo.toLowerCase().includes(q)
      const matchName = task.productName.toLowerCase().includes(q)
      const matchCat = task.category.toLowerCase().includes(q)
      if (!matchNo && !matchName && !matchCat) return false
    }
    // PM 筛选
    if (selectedPm.value !== '全部' && task.pm !== selectedPm.value) {
      return false
    }
    // 承接人筛选
    if (selectedAssignee.value !== '全部') {
      const hasAssignee = task.assignees.some(u => u.name === selectedAssignee.value)
      if (!hasAssignee) return false
    }
    // 拿样方式筛选
    if (selectedMethod.value !== '全部' && task.sampleMethodText !== selectedMethod.value) {
      return false
    }
    // 紧急度筛选
    if (selectedUrgency.value !== '全部') {
      const isUrgent = selectedUrgency.value === '紧急'
      if (task.isUrgent !== isUrgent) return false
    }
    return true
  })
})

// 看板列计算数据
const kanbanColumns = computed(() => [
  { label: '待承接', status: '待承接', color: '#64748b', bgColor: '#f1f5f9', tasks: filteredTasks.value.filter(t => t.receiverStatus === '待承接') },
  { label: '已承接/定制中', status: '已承接', color: '#3b82f6', bgColor: '#eff6ff', tasks: filteredTasks.value.filter(t => t.receiverStatus === '已承接') },
  { label: '待审批', status: '待审批', color: '#fa8c16', bgColor: '#fff7e6', tasks: filteredTasks.value.filter(t => t.receiverStatus === '待审批') },
  { label: '样品运输中', status: '样品运输中', color: '#9c27b0', bgColor: '#fdf4ff', tasks: filteredTasks.value.filter(t => t.receiverStatus === '样品运输中') },
  { label: '样品评估中', status: '样品评估中', color: '#10b981', bgColor: '#ecfdf5', tasks: filteredTasks.value.filter(t => t.receiverStatus === '样品评估中') },
  { label: '已归档/已完成', status: '已归档', color: '#8c8c8c', bgColor: '#f5f5f5', tasks: filteredTasks.value.filter(t => t.receiverStatus === '已归档') }
])

// 拿样环节耗时分析模拟数据
const bottleneckSteps = ref([
  { name: '任务发布 ➔ 业务承接', duration: 0.5, percent: 15, isBottleneck: false },
  { name: '业务承接 ➔ 定制反馈(寻源)', duration: 2.1, percent: 85, isBottleneck: true },
  { name: '方案确认 ➔ 发起购样申请', duration: 0.8, percent: 25, isBottleneck: false },
  { name: '购样申请 ➔ 财务及经理审批', duration: 1.2, percent: 45, isBottleneck: false },
  { name: '审批同意 ➔ 样品到货登记', duration: 5.8, percent: 100, isBottleneck: false }, // 国际或定制生产长耗时属常规但正常
  { name: '样品到货 ➔ 评估及开发反馈', duration: 2.3, percent: 65, isBottleneck: false }
])

// 模具/样品退款监控闭环表格模拟数据
const refundTrackerData = ref([
  {
    proposalNo: 'TA-202605069',
    productName: '电子墨水屏阅读器 (皮套模具)',
    supplier: '东莞模具厂',
    amount: '¥ 8,000.00',
    feeType: '模具费',
    terms: '大货满2,000套退款',
    currentQty: 2500,
    targetQty: 2000,
    status: '已达门槛(待催退)'
  },
  {
    proposalNo: 'TA-202605065',
    productName: '人体工学鼠标底壳模具',
    supplier: '中山光源五金厂',
    amount: '¥ 5,000.00',
    feeType: '模具费',
    terms: '大货满5,000套退款',
    currentQty: 1600,
    targetQty: 5000,
    status: '未达门槛'
  },
  {
    proposalNo: 'TA-202605021',
    productName: '厨房收纳置物架打样',
    supplier: '廊坊收纳制品厂',
    amount: '¥ 80.00',
    feeType: '打样费',
    terms: '首单满100套返现金',
    currentQty: 120,
    targetQty: 100,
    status: '退款申请中'
  },
  {
    proposalNo: 'TA-202604901',
    productName: '多功能露营灯外壳模具',
    supplier: '深圳精密塑料厂',
    amount: '¥ 12,000.00',
    feeType: '模具费',
    terms: '累计大货抵扣完毕',
    currentQty: 10000,
    targetQty: 10000,
    status: '已退款/归档'
  }
])

const handleFilter = () => {
  ElMessage.success('筛选条件已应用')
}

const handleResetFilters = () => {
  searchQuery.value = ''
  selectedPm.value = '全部'
  selectedAssignee.value = '全部'
  selectedMethod.value = '全部'
  selectedUrgency.value = '全部'
  ElMessage.success('筛选条件已重置')
}

// 标签样式计算
const getRefundStatusTag = (status: string) => {
  switch (status) {
    case '已达门槛(待催退)': return 'danger'
    case '未达门槛': return 'info'
    case '退款申请中': return 'warning'
    case '已退款/归档': return 'success'
    default: return 'info'
  }
}

// 催办样品退款
const handleRemindRefund = (row: any) => {
  ElMessageBox.confirm(
    `系统将向采购承接人员及供应商发送“催退样品/模具费”商务邮件与站内提示，确认催办？`,
    '退款催款提醒',
    {
      confirmButtonText: '确定发送',
      cancelButtonText: '取消',
      type: 'warning',
      buttonSize: 'small'
    }
  ).then(() => {
    row.status = '退款申请中'
    ElMessage.success(`已向 ${row.supplier} 发起模具费 ¥ ${row.amount} 退款催办，状态已更新为“退款申请中”`)
  }).catch(() => {})
}

// 点击卡片打开详情抽屉
const handleCardClick = (task: any) => {
  if (taskDetailDrawerRef.value) {
    taskDetailDrawerRef.value.open({
      no: task.proposalNo,
      name: task.productName,
      priority: task.isUrgent ? 'P0' : 'P1',
      status: task.receiverStatus,
      user: task.assignees?.[0]?.name || '未指派/待承接',
      deadline: task.remainingDays < 0 ? `已超期 ${Math.abs(task.remainingDays)} 天` : `剩余 ${task.remainingDays} 天`
    })
  } else {
    ElMessage.error('详情抽屉未正确加载')
  }
}
</script>

<script lang="ts">
export default {
  name: 'SampleTaskKanban'
}
</script>

<style lang="scss" scoped>
.kanban-page {
  padding: 20px;
  background: #f8fafc;
  height: calc(100vh - 48px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.modern-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.mb-20 { margin-bottom: 20px; }
.mt-20 { margin-top: 20px; }
.flex-grow { flex-grow: 1; }

// 1. KPI 区域样式重塑
.dashboard-header-wrapper {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #edf2f7;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.02);

  .header-title-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px dashed #e2e8f0;

    .title-left {
      display: flex;
      align-items: center;
      gap: 10px;
      .title-icon {
        color: #3b82f6;
        font-size: 22px;
      }
      .title-text {
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;
        .subtitle {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
      }
    }

    .refresh-time {
      font-size: 12px;
      color: #94a3b8;
      margin-right: 12px;
    }
  }

  .stat-cards-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;

    .stat-card {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 12px;
      padding: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      }

      .stat-card-inner {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          .label {
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
          }
          .value {
            font-size: 22px;
            font-weight: 800;
            color: #1e293b;
            font-family: 'DIN Alternate', -apple-system, sans-serif;
            .unit {
              font-size: 12px;
              font-weight: 500;
              color: #94a3b8;
            }
          }
        }

        .icon-box {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
      }

      .stat-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
        color: #94a3b8;
        border-top: 1px solid #f1f5f9;
        padding-top: 8px;
        .trendup { color: #10b981; font-weight: 600; }
        .trenddown { color: #ef4444; font-weight: 600; }
        .accent-text { color: #f59e0b; font-weight: 600; }
        .highlight-text { color: #3b82f6; font-weight: 600; }
        .desc { color: #64748b; }
      }

      // 卡片专属主题色彩
      &.total-tasks .icon-box { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
      &.urgent-tasks {
        border-left: 3px solid #ef4444;
        .stat-card-inner .stat-info .value { color: #ef4444; }
        .icon-box { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
      }
      &.avg-cycle .icon-box { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      &.total-cost .icon-box { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
      &.refund-pending {
        border-left: 3px solid #3b82f6;
        .stat-card-inner .stat-info .value { color: #3b82f6; }
        .icon-box { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
      }
    }
  }
}

// 2. 筛选面板
.filter-panel {
  padding: 16px 20px;
  background: #ffffff;
  
  .filter-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;

    .filter-item {
      display: flex;
      align-items: center;
      gap: 8px;
      .filter-label {
        font-size: 13px;
        font-weight: 600;
        color: #475569;
        white-space: nowrap;
      }
    }

    .filter-actions {
      display: flex;
      gap: 8px;
    }
  }
}

// 3. 看板主区域
.kanban-container {
  display: flex;
  gap: 16px;
  flex: 1;
  overflow-x: auto;
  padding-bottom: 8px;
}

.kanban-column {
  flex-shrink: 0;
  width: 290px;
  background: #f1f5f9;
  border-radius: 12px;
  border-top: 4px solid #64748b;
  display: flex;
  flex-direction: column;
  max-height: 520px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  
  .column-header {
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.6);
    border-bottom: 1px solid #e2e8f0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
      .title {
        font-weight: 700;
        color: #334155;
        font-size: 13px;
      }
    }

    .count-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 10px;
    }
  }
  
  .column-body {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.task-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 20px -8px rgba(148, 163, 184, 0.3);
    border-color: #cbd5e1;
  }
  
  &.urgent {
    border-left: 4px solid #ef4444;
  }

  .card-tag-wrapper {
    display: flex;
    gap: 6px;
    margin-bottom: 10px;
    .level-tag {
      font-weight: 800;
      border-radius: 4px;
    }
    .method-tag {
      font-weight: 600;
      border-radius: 4px;
    }
  }
  
  .task-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    .no {
      font-size: 11px;
      color: #94a3b8;
      font-family: monospace;
      font-weight: 600;
    }
    .level-indicator {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
    }
  }
  
  .task-info {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    .task-img {
      width: 44px;
      height: 44px;
      border-radius: 6px;
      border: 1px solid #f1f5f9;
      flex-shrink: 0;
    }
    .task-details {
      flex: 1;
      overflow: hidden;
      .name {
        font-size: 13px;
        font-weight: 700;
        color: #1e293b;
        line-height: 1.4;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .meta {
        font-size: 11px;
        color: #64748b;
      }
    }
  }

  .task-cost-line {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #fffbeb;
    border: 1px solid #fef3c7;
    border-radius: 4px;
    padding: 4px 8px;
    margin-bottom: 10px;
    .cost-icon {
      color: #d97706;
      font-size: 13px;
    }
    .cost-val {
      font-size: 11px;
      color: #b45309;
      font-weight: 600;
    }
  }
  
  .task-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f1f5f9;
    padding-top: 10px;
    .time { 
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
      &.danger {
        color: #ef4444;
        font-weight: 700;
      }
    }
    .assignees-box {
      display: flex;
      align-items: center;
      .avatar-circle {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        color: #ffffff;
        font-size: 10px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      .no-assignee {
        font-size: 11px;
        color: #94a3b8;
        font-weight: 600;
        background: #f1f5f9;
        padding: 1px 6px;
        border-radius: 4px;
      }
    }
  }
}

.empty-column-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #94a3b8;
  gap: 8px;
  .empty-icon {
    font-size: 24px;
  }
  span {
    font-size: 12px;
    font-weight: 500;
  }
}

// 4. 底部深度图表与监控区域
.bottom-analytics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  flex-shrink: 0;

  .analytics-card {
    padding: 20px;
    display: flex;
    flex-direction: column;
    min-height: 380px;

    .card-header-v4 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f1f5f9;

      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 700;
        color: #1e293b;
        .title-icon {
          color: #3b82f6;
          font-size: 16px;
        }
      }
      .header-desc {
        font-size: 12px;
        color: #94a3b8;
      }
    }
  }
}

// 漏斗样式
.funnel-container {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .funnel-row {
    display: flex;
    align-items: center;
    gap: 16px;

    .step-meta {
      width: 140px;
      display: flex;
      align-items: center;
      gap: 8px;
      .step-num {
        font-size: 11px;
        font-weight: 700;
        color: #94a3b8;
        background: #f1f5f9;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .step-name {
        font-size: 12px;
        font-weight: 600;
        color: #334155;
      }
    }

    .step-progress-wrapper {
      flex: 1;
      .step-bar-bg {
        background: #f1f5f9;
        height: 22px;
        border-radius: 4px;
        overflow: hidden;
        position: relative;
        .step-bar-fill {
          height: 100%;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 8px;
          box-sizing: border-box;
          transition: width 0.6s ease;
          .duration-text {
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
          }
        }
      }
    }

    .step-status {
      width: 90px;
      text-align: right;
      .bottleneck-tag {
        font-weight: 700;
        border-radius: 4px;
        font-size: 10px;
      }
      .normal-status {
        font-size: 12px;
        color: #94a3b8;
        font-weight: 500;
      }
    }
  }
}

.efficiency-insights {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 12px 16px;
  .insight-title {
    font-size: 12px;
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 6px;
  }
  .insight-text {
    font-size: 12px;
    color: #1e3a8a;
    line-height: 1.6;
    margin: 0;
  }
}

// 退款追踪表格
.refund-table-wrapper {
  flex: 1;
  overflow: hidden;
  
  .refund-table {
    --el-table-header-bg-color: #f8fafc;
    border-radius: 8px;
    overflow: hidden;
  }

  .refund-product-cell {
    display: flex;
    flex-direction: column;
    .no {
      font-size: 10px;
      color: #94a3b8;
      font-family: monospace;
      font-weight: 600;
    }
    .name {
      font-size: 12px;
      font-weight: 700;
      color: #334155;
    }
  }

  .cost-cell {
    display: flex;
    flex-direction: column;
    .amt {
      font-size: 12px;
      font-weight: 700;
      color: #ef4444;
      font-family: monospace;
    }
    .type {
      font-size: 10px;
      color: #94a3b8;
    }
  }

  .progress-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    .progress-text {
      font-size: 11px;
      font-weight: 700;
      color: #334155;
      .target {
        color: #94a3b8;
        font-weight: 500;
      }
    }
  }
}

.text-muted {
  color: #cbd5e1;
}

// 滚动条样式
.custom-scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}
</style>
