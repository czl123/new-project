<template>
  <div class="page-wrapper">
    <!-- 1. 顶部管理看板 (仅在管理模式显示) -->
    <div v-if="viewMode === 'table'" class="manager-dashboard modern-card mb-12">
      <div class="dash-item">
        <div class="d-label">当前待处理</div>
        <div class="d-value">125 <small>项</small></div>
      </div>
      <div class="dash-item urgent">
        <div class="d-label">逾期/紧急</div>
        <div class="d-value">8 <small>项</small></div>
      </div>
      <div class="dash-item">
        <div class="d-label">平均拿样周期</div>
        <div class="d-value">5.4 <small>天</small></div>
      </div>
      <div class="dash-item">
        <div class="d-label">本月已完成</div>
        <div class="d-value">482 <small>项</small></div>
      </div>
    </div>

    <!-- 2. 视图切换主容器 -->
    <div class="workbench-container" v-if="viewMode === 'workbench'">
      <!-- 左侧任务导航列表 -->
      <div class="list-side">
        <div class="side-header">
          <div class="filter-bar">
            <el-input v-model="searchQuery" placeholder="搜索编号/产品" prefix-icon="Search" size="small" clearable />
            <el-tooltip content="切换至管理大表模式" placement="top">
              <el-button icon="Operation" size="small" circle @click="viewMode = 'table'" />
            </el-tooltip>
          </div>
          
          <div class="side-stats-mini">
            <div class="s-item urgent"><span>急需</span><b>5</b></div>
            <div class="s-item"><span>今日</span><b>12</b></div>
            <div class="s-item"><span>全部</span><b>125</b></div>
          </div>

          <div class="status-scroll-tabs">
            <div 
              v-for="tab in statusTabs" 
              :key="tab.value"
              class="mini-tab"
              :class="{ active: activeTab === tab.value }"
              @click="activeTab = tab.value"
            >
              {{ tab.label }}
            </div>
          </div>
        </div>

        <div class="side-content custom-scrollbar">
          <div class="list-group-title" v-if="filteredSideList.some(i => i.isUrgent)">今日紧急处理</div>
          <div 
            v-for="item in filteredSideList.filter(i => i.isUrgent)" 
            :key="item.proposalNo"
            class="task-card-mini urgent-border"
            :class="{ active: currentTask?.proposalNo === item.proposalNo }"
            @click="currentTask = item"
          >
            <div class="card-top">
              <span class="no">{{ item.proposalNo }}</span>
              <el-tag size="small" type="danger" effect="dark">紧急</el-tag>
            </div>
            <div class="card-main">
              <el-image :src="item.image" class="mini-img" />
              <div class="main-info">
                <div class="name">{{ item.productName }}</div>
                <div class="meta">
                  <span class="pm">{{ item.pm }}</span>
                  <el-divider direction="vertical" />
                  <span class="type">{{ item.sampleMethodText }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer" v-if="activeTab !== 'unfinished'">
              <div class="progress-mini">
                <div class="p-track"><div class="p-bar" :style="{ width: '40%' }"></div></div>
              </div>
              <span class="status-text">{{ item.receiverStatus }}</span>
            </div>
          </div>

          <div class="list-group-title">任务列表 ({{ filteredSideList.length }})</div>
          <div 
            v-for="item in filteredSideList.filter(i => !i.isUrgent)" 
            :key="item.proposalNo"
            class="task-card-mini"
            :class="{ active: currentTask?.proposalNo === item.proposalNo }"
            @click="currentTask = item"
          >
            <div class="card-top">
              <span class="no">{{ item.proposalNo }}</span>
              <el-tag size="small" type="warning" effect="plain">{{ item.remainingDays }}天</el-tag>
            </div>
            <div class="card-main">
              <el-image :src="item.image" class="mini-img" />
              <div class="main-info">
                <div class="name">{{ item.productName }}</div>
                <div class="meta">
                  <span class="pm">{{ item.pm }}</span>
                  <el-divider direction="vertical" />
                  <span class="type">{{ item.sampleMethodText }}</span>
                </div>
              </div>
            </div>
            <div class="card-footer" v-if="activeTab !== 'unfinished'">
              <div class="progress-mini">
                <div class="p-track"><div class="p-bar" :style="{ width: '70%' }"></div></div>
              </div>
              <span class="status-text">{{ item.receiverStatus }}</span>
            </div>
          </div>
          <el-empty v-if="filteredSideList.length === 0" description="暂无此类任务" />
        </div>
      </div>

      <!-- 右侧沉浸式详情工作区 -->
      <div class="detail-workspace" v-if="currentTask">
        <div class="workspace-header">
          <div class="header-left">
            <el-tag size="small" type="danger" effect="plain" class="mr-8">P0</el-tag>
            <h2>{{ currentTask.productName }}</h2>
            <span class="id-copy">{{ currentTask.proposalNo }} <el-icon><CopyDocument /></el-icon></span>
          </div>
          <div class="header-right">
            <template v-if="currentTask.receiverStatus === '待反馈'">
              <el-button size="small" type="primary" @click="handleAccept">承接任务</el-button>
              <el-button size="small" type="warning" @click="handlePurchaseApply">购样申请</el-button>
            </template>
            <template v-else>
              <el-button size="small">转移任务</el-button>
              <el-button size="small" type="primary">保存反馈</el-button>
              <el-button size="small" type="success" icon="Check">提交结论</el-button>
            </template>
          </div>
        </div>

        <div class="workflow-stepper">
          <div v-for="(step, index) in steps" :key="index" class="step-item" :class="getStepClass(index)">
            <el-popover
              placement="bottom"
              :width="260"
              trigger="hover"
              popper-style="padding: 0; border-radius: 8px; overflow: hidden;"
              v-if="getAssigneesAtStep(index).length > 0"
            >
              <template #reference>
                <div class="step-node-trigger">
                  <div class="step-icon">
                    <el-icon v-if="isStepFullyDone(index)"><CircleCheckFilled /></el-icon>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <div class="step-label">{{ step }}</div>
                  <!-- 悬浮的小头像堆叠 -->
                  <div class="member-badges">
                    <div 
                      v-for="user in getAssigneesAtStep(index)" 
                      :key="user.name"
                      class="m-dot"
                      :style="{ backgroundColor: user.color }"
                    ></div>
                  </div>
                </div>
              </template>
              
              <div class="popper-detail-panel">
                <div class="p-header">成员办理进度 - {{ step }}</div>
                <div class="p-list">
                  <div v-for="user in getAssigneesAtStep(index)" :key="user.name" class="p-card">
                    <div class="p-line-1">
                      <span class="p-name">{{ user.name }}</span>
                      <span class="p-status" :style="{ color: user.color, backgroundColor: user.color + '15' }">{{ user.status }}</span>
                    </div>
                    <div class="p-time">{{ user.time }}</div>
                  </div>
                </div>
              </div>
            </el-popover>

            <div v-else class="step-node-trigger">
              <div class="step-icon">
                <span>{{ index + 1 }}</span>
              </div>
              <div class="step-label">{{ step }}</div>
            </div>
            
            <div v-if="index < steps.length - 1" class="step-line"></div>
          </div>
        </div>

        <div class="workspace-body custom-scrollbar">
          <div class="grid-layout">
            <div class="info-block block-main">
              <div class="block-title">提案基础信息</div>
              <div class="field-group">
                <div class="field"><label>运营大类</label><span>{{ currentTask.category }}</span></div>
                <div class="field"><label>开发方式</label><span>{{ currentTask.devMethod }}</span></div>
                <div class="field"><label>提案等级</label><el-tag size="small" type="warning">{{ currentTask.level }} 级</el-tag></div>
                <div class="field"><label>产品经理</label><span>{{ currentTask.pm }}</span></div>
                <div class="field"><label>款式</label><span>亚克力透明款</span></div>
                <div class="field"><label>主材料</label><span>亚克力 + LED</span></div>
              </div>
            </div>

            <div class="info-block block-time">
              <div class="block-title">时效控制</div>
              <div class="time-metrics" :class="{ 'is-custom': currentTask.sampleMethodText === '定制拿样' }">
                <!-- 定制拿样特有：反馈倒计时 -->
                <div class="metric" v-if="currentTask.sampleMethodText === '定制拿样'">
                  <div class="m-val warning">02<small>天</small>14<small>时</small></div>
                  <div class="m-lab">反馈倒计时</div>
                </div>
                
                <div class="metric">
                  <div class="m-val" :class="{ danger: currentTask.remainingDays <= 7 }">
                    {{ currentTask.remainingDays }}<small>天</small>
                  </div>
                  <div class="m-lab">剩余拿样时间</div>
                </div>

                <div class="metric">
                  <div class="m-val">23<small>时</small>45<small>分</small></div>
                  <div class="m-lab">截止倒计时</div>
                </div>
              </div>
            </div>
          </div>

          <div class="info-block mt-16">
            <div class="block-title">采购定制反馈 <el-button type="primary" link icon="Plus" size="small">添加反馈</el-button></div>
            <el-table :data="feedbackData" size="small" border class="flat-table">
              <el-table-column prop="no" label="反馈编号" width="150" />
              <el-table-column prop="user" label="采购员" width="100" />
              <el-table-column prop="moldFee" label="开模费" width="100">
                <template #default="{ row }"><span class="price-text">¥ {{ row.moldFee }}</span></template>
              </el-table-column>
              <el-table-column prop="sampleFee" label="拿样费" width="100">
                <template #default="{ row }"><span class="price-text">¥ {{ row.sampleFee }}</span></template>
              </el-table-column>
              <el-table-column prop="cycle" label="定制周期" width="100" align="center">
                <template #default="{ row }">{{ row.cycle }} 天</template>
              </el-table-column>
              <el-table-column prop="remark" label="采购备注" min-width="200" show-overflow-tooltip />
            </el-table>
          </div>

          <div class="info-block mt-16">
            <div class="block-title">样品登记信息 (SKU)</div>
            <div class="sku-cards-container">
              <div v-for="i in 3" :key="i" class="sku-mini-card">
                <el-image src="https://picsum.photos/100/100?random=10" class="sku-img" />
                <div class="sku-details">
                  <div class="sku-row"><strong>黑色 / 通用</strong></div>
                  <div class="sku-row"><span>净重: 0.617kg</span></div>
                  <div class="sku-row"><span class="status-dot success">已入库</span></div>
                </div>
              </div>
              <div class="sku-add-card">
                <el-icon><Plus /></el-icon>
                <span>登记样品</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="empty-workspace" v-else>
        <el-empty description="选择左侧任务开启高效办公" />
      </div>
    </div>

    <!-- 3. 管理员大表模式 -->
    <div class="table-view-container" v-else>
      <div class="table-header-bar modern-card mb-12">
        <div class="left">
          <el-button type="primary" size="small" icon="Operation" @click="viewMode = 'workbench'">返回工作台</el-button>
          <el-divider direction="vertical" />
          <el-input v-model="searchQuery" placeholder="全量任务搜索..." size="small" style="width: 250px" />
        </div>
        <div class="right">
          <el-button-group>
            <el-button size="small" icon="Download">导出全量</el-button>
            <el-button size="small" icon="Printer">批量打印</el-button>
          </el-button-group>
        </div>
      </div>

      <div class="table-main-box modern-card">
        <el-table :data="tableData" size="small" stripe border height="calc(100vh - 220px)">
          <el-table-column type="index" label="#" width="50" fixed />
          <el-table-column prop="proposalNo" label="提案编号" width="120" fixed />
          <el-table-column prop="productName" label="产品名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="pm" label="产品经理" width="100" />
          <el-table-column prop="category" label="运营大类" width="120" />
          <el-table-column prop="deadline" label="截止日期" width="120" sortable />
          <el-table-column prop="remainingDays" label="剩余天数" width="100" align="center">
            <template #default="{ row }">
              <span :class="{ 'text-danger': row.isUrgent }">{{ row.remainingDays }} 天</span>
            </template>
          </el-table-column>
          <el-table-column prop="receiverStatus" label="状态" width="100" align="center" />
          <el-table-column label="操作" width="220" fixed="right" align="center">
            <template #default="{ row }">
              <el-button type="primary" link @click="switchToTask(row)">去处理</el-button>
              <template v-if="row.receiverStatus === '待反馈'">
                <el-button type="warning" link @click="handlePurchaseApply">购样申请</el-button>
                <el-button type="primary" link @click="handleAccept">承接任务</el-button>
              </template>
              <template v-else>
                <el-button type="info" link>转移</el-button>
                <el-button type="success" link>结论</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, CopyDocument, CircleCheckFilled, Timer, Plus, Operation, Check, Download, Printer } from '@element-plus/icons-vue'

const searchQuery = ref('')
const activeTab = ref('unfinished')
const viewMode = ref('workbench')
const currentTask = ref<any>(null)

const statusTabs = [
  { label: '未完成', value: 'unfinished' },
  { label: '已承接', value: 'accepted' },
  { label: '定制反馈', value: 'custom_feedback' },
  { label: '购样申请', value: 'purchase_apply' },
  { label: '样品待反馈', value: 'sample_feedback' }
]

const steps = computed(() => {
  if (currentTask.value?.sampleMethodText === '定制拿样') {
    return ['任务发布', '任务承接', '定制反馈', '购样申请', '费用审批', '样品登记', '开发反馈', '任务归档']
  }
  return ['提案发起', '任务分配', '拿样反馈', '样品评估', '入库结案']
})

const filteredSideList = computed(() => {
  const statusMap: Record<string, string> = {
    unfinished: '待反馈',
    accepted: '已承接',
    custom_feedback: '定制反馈',
    purchase_apply: '购样申请',
    sample_feedback: '样品待反馈'
  }
  const targetStatus = statusMap[activeTab.value]
  return tableData.value.filter(item => {
    const isStatusMatch = item.receiverStatus === targetStatus
    const isSearchMatch = !searchQuery.value || 
                          item.productName.includes(searchQuery.value) || 
                          item.proposalNo.includes(searchQuery.value)
    return isStatusMatch && isSearchMatch
  })
})

const tableData = ref([
  // 待反馈 (Status: 待反馈) - 6 items
  {
    image: 'https://picsum.photos/100/100?random=1',
    proposalNo: 'TA-202605049',
    productName: 'DIY灯光板 - 亚克力透明款',
    devMethod: '派生品-拓新',
    level: 'C',
    pm: '颜沙沙',
    sampleMethodText: '现货拿样',
    category: '家居装饰',
    deadline: '2026-05-27',
    remainingDays: 7,
    isUrgent: true,
    receiverStatus: '待反馈',
    assignees: [{ name: '张三', status: '任务发布', step: 0, color: '#1890ff', time: '2026-05-20 09:30' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=11',
    proposalNo: 'TA-202605060',
    productName: '智能香薰机 - 木纹版',
    devMethod: '全新品-定制',
    level: 'B',
    pm: '王小明',
    sampleMethodText: '定制拿样',
    category: '生活电器',
    deadline: '2026-05-28',
    remainingDays: 8,
    isUrgent: false,
    receiverStatus: '待反馈',
    assignees: [{ name: '李华', status: '任务发布', step: 0, color: '#52c41a', time: '2026-05-20 10:00' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=12',
    proposalNo: 'TA-202605061',
    productName: '折叠笔记本支架',
    devMethod: '现货采购',
    level: 'A',
    pm: '赵敏',
    sampleMethodText: '现货拿样',
    category: '数码配件',
    deadline: '2026-05-25',
    remainingDays: 5,
    isUrgent: true,
    receiverStatus: '待反馈',
    assignees: [{ name: '孙悟空', status: '任务发布', step: 0, color: '#faad14', time: '2026-05-20 08:45' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=13',
    proposalNo: 'TA-202605062',
    productName: '车载吸尘器 - 无线版',
    devMethod: '全新品-定制',
    level: 'C',
    pm: '颜沙沙',
    sampleMethodText: '定制拿样',
    category: '汽车用品',
    deadline: '2026-05-30',
    remainingDays: 10,
    isUrgent: false,
    receiverStatus: '待反馈',
    assignees: [{ name: '猪八戒', status: '任务发布', step: 0, color: '#ff4d4f', time: '2026-05-20 11:30' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=14',
    proposalNo: 'TA-202605063',
    productName: '桌面空气净化器',
    devMethod: '派生品',
    level: 'B',
    pm: '周杰',
    sampleMethodText: '现货拿样',
    category: '生活电器',
    deadline: '2026-05-26',
    remainingDays: 6,
    isUrgent: true,
    receiverStatus: '待反馈',
    assignees: [{ name: '沙僧', status: '任务发布', step: 0, color: '#722ed1', time: '2026-05-20 09:15' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=15',
    proposalNo: 'TA-202605064',
    productName: '蓝牙防丢器 - 迷你款',
    devMethod: '拓新采购',
    level: 'D',
    pm: '刘德华',
    sampleMethodText: '现货拿样',
    category: '智能硬件',
    deadline: '2026-06-05',
    remainingDays: 15,
    isUrgent: false,
    receiverStatus: '待反馈',
    assignees: [{ name: '郭富城', status: '任务发布', step: 0, color: '#13c2c2', time: '2026-05-20 14:00' }]
  },

  // 已承接 (Status: 已承接) - 6 items
  {
    image: 'https://picsum.photos/100/100?random=21',
    proposalNo: 'TA-202605065',
    productName: '人体工学鼠标 - 旗舰版',
    devMethod: '全新品-定制',
    level: 'A',
    pm: '张学友',
    sampleMethodText: '定制拿样',
    category: '数码配件',
    deadline: '2026-05-29',
    remainingDays: 9,
    isUrgent: true,
    receiverStatus: '已承接',
    assignees: [{ name: '黎明', status: '任务承接', step: 1, color: '#1890ff', time: '2026-05-20 10:30' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=22',
    proposalNo: 'TA-202605066',
    productName: '多功能露营灯',
    devMethod: '派生品',
    level: 'C',
    pm: '颜沙沙',
    sampleMethodText: '现货拿样',
    category: '户外运动',
    deadline: '2026-06-01',
    remainingDays: 11,
    isUrgent: false,
    receiverStatus: '已承接',
    assignees: [{ name: '陈奕迅', status: '任务承接', step: 1, color: '#52c41a', time: '2026-05-20 11:00' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=23',
    proposalNo: 'TA-202605067',
    productName: '降噪蓝牙耳机',
    devMethod: '现货采购',
    level: 'B',
    pm: '周杰伦',
    sampleMethodText: '现货拿样',
    category: '数码配件',
    deadline: '2026-05-27',
    remainingDays: 7,
    isUrgent: true,
    receiverStatus: '已承接',
    assignees: [{ name: '林俊杰', status: '任务承接', step: 1, color: '#faad14', time: '2026-05-20 09:45' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=24',
    proposalNo: 'TA-202605068',
    productName: '桌面加湿器 - 极简版',
    devMethod: '拓新采购',
    level: 'D',
    pm: '邓紫棋',
    sampleMethodText: '现货拿样',
    category: '生活电器',
    deadline: '2026-06-03',
    remainingDays: 13,
    isUrgent: false,
    receiverStatus: '已承接',
    assignees: [{ name: '王嘉尔', status: '任务承接', step: 1, color: '#ff4d4f', time: '2026-05-20 15:00' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=25',
    proposalNo: 'TA-202605069',
    productName: '电子墨水屏阅读器',
    devMethod: '全新品-定制',
    level: 'A',
    pm: '李健',
    sampleMethodText: '定制拿样',
    category: '智能硬件',
    deadline: '2026-05-31',
    remainingDays: 11,
    isUrgent: false,
    receiverStatus: '已承接',
    assignees: [{ name: '毛不易', status: '任务承接', step: 1, color: '#722ed1', time: '2026-05-20 13:20' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=26',
    proposalNo: 'TA-202605070',
    productName: '机械键盘 - 复古款',
    devMethod: '派生品',
    level: 'B',
    pm: '颜沙沙',
    sampleMethodText: '现货拿样',
    category: '数码配件',
    deadline: '2026-06-02',
    remainingDays: 12,
    isUrgent: false,
    receiverStatus: '已承接',
    assignees: [{ name: '肖战', status: '任务承接', step: 1, color: '#13c2c2', time: '2026-05-20 16:30' }]
  },

  // 定制反馈 (Status: 定制反馈) - 6 items
  {
    image: 'https://picsum.photos/100/100?random=2',
    proposalNo: 'TA-202605051',
    productName: '儿童画板 - 底座RGB9色灯',
    devMethod: '全新品-定制',
    level: 'D',
    pm: '廖飞飞',
    sampleMethodText: '定制拿样',
    category: '游戏配件',
    deadline: '2026-05-27',
    remainingDays: 12,
    isUrgent: false,
    receiverStatus: '定制反馈',
    assignees: [
      { name: '李四', status: '定制反馈', step: 2, color: '#52c41a', time: '2026-05-19 14:20' },
      { name: '王五', status: '任务承接', step: 1, color: '#faad14', time: '2026-05-18 11:05' }
    ]
  },
  {
    image: 'https://picsum.photos/100/100?random=31',
    proposalNo: 'TA-202605071',
    productName: '智能猫砂盆 - 自动清理版',
    devMethod: '全新品-定制',
    level: 'S',
    pm: '严选',
    sampleMethodText: '定制拿样',
    category: '宠物用品',
    deadline: '2026-06-10',
    remainingDays: 20,
    isUrgent: true,
    receiverStatus: '定制反馈',
    assignees: [{ name: '李想', status: '定制反馈', step: 2, color: '#1890ff', time: '2026-05-20 09:00' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=32',
    proposalNo: 'TA-202605072',
    productName: '便携式咖啡机',
    devMethod: '派生品',
    level: 'B',
    pm: '颜沙沙',
    sampleMethodText: '定制拿样',
    category: '厨房电器',
    deadline: '2026-06-05',
    remainingDays: 15,
    isUrgent: false,
    receiverStatus: '定制反馈',
    assignees: [{ name: '何炅', status: '定制反馈', step: 2, color: '#52c41a', time: '2026-05-20 10:45' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=33',
    proposalNo: 'TA-202605073',
    productName: '全息投影音箱',
    devMethod: '拓新采购',
    level: 'A',
    pm: '汪涵',
    sampleMethodText: '定制拿样',
    category: '影音娱乐',
    deadline: '2026-06-15',
    remainingDays: 25,
    isUrgent: false,
    receiverStatus: '定制反馈',
    assignees: [{ name: '撒贝宁', status: '定制反馈', step: 2, color: '#faad14', time: '2026-05-20 14:15' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=34',
    proposalNo: 'TA-202605074',
    productName: '智能健身环 - 互动版',
    devMethod: '全新品-定制',
    level: 'B',
    pm: '蔡徐坤',
    sampleMethodText: '定制拿样',
    category: '运动器材',
    deadline: '2026-06-08',
    remainingDays: 18,
    isUrgent: false,
    receiverStatus: '定制反馈',
    assignees: [{ name: '王一博', status: '定制反馈', step: 2, color: '#ff4d4f', time: '2026-05-20 11:30' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=35',
    proposalNo: 'TA-202605075',
    productName: '恒温电水壶 - 彩屏版',
    devMethod: '派生品',
    level: 'C',
    pm: '赵丽颖',
    sampleMethodText: '定制拿样',
    category: '厨房电器',
    deadline: '2026-06-12',
    remainingDays: 22,
    isUrgent: false,
    receiverStatus: '定制反馈',
    assignees: [{ name: '杨幂', status: '定制反馈', step: 2, color: '#722ed1', time: '2026-05-20 15:45' }]
  },

  // 购样申请 (Status: 购样申请) - 6 items
  {
    image: 'https://picsum.photos/100/100?random=41',
    proposalNo: 'TA-202605076',
    productName: '折叠电动滑板车',
    devMethod: '拓新采购',
    level: 'A',
    pm: '颜沙沙',
    sampleMethodText: '现货拿样',
    category: '出行工具',
    deadline: '2026-05-26',
    remainingDays: 6,
    isUrgent: true,
    receiverStatus: '购样申请',
    assignees: [{ name: '易烊千玺', status: '购样申请', step: 3, color: '#1890ff', time: '2026-05-20 09:30' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=42',
    proposalNo: 'TA-202605077',
    productName: '智能感应垃圾桶',
    devMethod: '派生品',
    level: 'B',
    pm: '王俊凯',
    sampleMethodText: '现货拿样',
    category: '家居用品',
    deadline: '2026-05-30',
    remainingDays: 10,
    isUrgent: false,
    receiverStatus: '购样申请',
    assignees: [{ name: '王源', status: '购样申请', step: 3, color: '#52c41a', time: '2026-05-20 10:00' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=43',
    proposalNo: 'TA-202605078',
    productName: '高速吹风机 - 负离子版',
    devMethod: '全新品-定制',
    level: 'A',
    pm: '颜沙沙',
    sampleMethodText: '定制拿样',
    category: '个人护理',
    deadline: '2026-05-28',
    remainingDays: 8,
    isUrgent: true,
    receiverStatus: '购样申请',
    assignees: [{ name: '迪丽热巴', status: '购样申请', step: 3, color: '#faad14', time: '2026-05-20 11:20' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=44',
    proposalNo: 'TA-202605079',
    productName: '多功能早餐机',
    devMethod: '现货采购',
    level: 'C',
    pm: '古力娜扎',
    sampleMethodText: '现货拿样',
    category: '厨房电器',
    deadline: '2026-06-04',
    remainingDays: 14,
    isUrgent: false,
    receiverStatus: '购样申请',
    assignees: [{ name: '佟丽娅', status: '购样申请', step: 3, color: '#ff4d4f', time: '2026-05-20 14:40' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=45',
    proposalNo: 'TA-202605080',
    productName: '智能筋膜枪 - 迷你款',
    devMethod: '拓新采购',
    level: 'B',
    pm: '颜沙沙',
    sampleMethodText: '现货拿样',
    category: '健康保健',
    deadline: '2026-05-27',
    remainingDays: 7,
    isUrgent: true,
    receiverStatus: '购样申请',
    assignees: [{ name: '黄渤', status: '购样申请', step: 3, color: '#722ed1', time: '2026-05-20 15:50' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=46',
    proposalNo: 'TA-202605081',
    productName: '颈椎按摩仪',
    devMethod: '派生品',
    level: 'C',
    pm: '沈腾',
    sampleMethodText: '现货拿样',
    category: '健康保健',
    deadline: '2026-06-06',
    remainingDays: 16,
    isUrgent: false,
    receiverStatus: '购样申请',
    assignees: [{ name: '贾玲', status: '购样申请', step: 3, color: '#13c2c2', time: '2026-05-20 17:10' }]
  },

  // 样品待反馈 (Status: 样品待反馈) - 6 items
  {
    image: 'https://picsum.photos/100/100?random=51',
    proposalNo: 'TA-202605082',
    productName: '猫咪自动饮水机',
    devMethod: '现货采购',
    level: 'B',
    pm: '颜沙沙',
    sampleMethodText: '现货拿样',
    category: '宠物用品',
    deadline: '2026-05-25',
    remainingDays: 5,
    isUrgent: true,
    receiverStatus: '样品待反馈',
    assignees: [{ name: '张子枫', status: '开发反馈', step: 6, color: '#1890ff', time: '2026-05-20 09:10' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=52',
    proposalNo: 'TA-202605083',
    productName: '智能感应小夜灯',
    devMethod: '派生品',
    level: 'D',
    pm: '彭昱畅',
    sampleMethodText: '现货拿样',
    category: '家居灯饰',
    deadline: '2026-05-29',
    remainingDays: 9,
    isUrgent: false,
    receiverStatus: '样品待反馈',
    assignees: [{ name: '张艺兴', status: '开发反馈', step: 6, color: '#52c41a', time: '2026-05-20 10:30' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=53',
    proposalNo: 'TA-202605084',
    productName: '多功能工具钳',
    devMethod: '拓新采购',
    level: 'C',
    pm: '颜沙沙',
    sampleMethodText: '现货拿样',
    category: '五金工具',
    deadline: '2026-05-28',
    remainingDays: 8,
    isUrgent: true,
    receiverStatus: '样品待反馈',
    assignees: [{ name: '黄磊', status: '开发反馈', step: 6, color: '#faad14', time: '2026-05-20 11:45' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=54',
    proposalNo: 'TA-202605085',
    productName: '便携式投影仪',
    devMethod: '全新品-定制',
    level: 'A',
    pm: '何炅',
    sampleMethodText: '定制拿样',
    category: '影音娱乐',
    deadline: '2026-06-07',
    remainingDays: 17,
    isUrgent: false,
    receiverStatus: '样品待反馈',
    assignees: [{ name: '谢娜', status: '开发反馈', step: 6, color: '#ff4d4f', time: '2026-05-20 15:15' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=55',
    proposalNo: 'TA-202605086',
    productName: '真无线降噪耳机',
    devMethod: '拓新采购',
    level: 'B',
    pm: '颜沙沙',
    sampleMethodText: '现货拿样',
    category: '数码配件',
    deadline: '2026-05-31',
    remainingDays: 11,
    isUrgent: false,
    receiverStatus: '样品待反馈',
    assignees: [{ name: '维嘉', status: '开发反馈', step: 6, color: '#722ed1', time: '2026-05-20 16:40' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=56',
    proposalNo: 'TA-202605087',
    productName: '智能跳绳 - 计数版',
    devMethod: '派生品',
    level: 'C',
    pm: '吴昕',
    sampleMethodText: '现货拿样',
    category: '运动器材',
    deadline: '2026-06-03',
    remainingDays: 13,
    isUrgent: false,
    receiverStatus: '样品待反馈',
    assignees: [{ name: '海涛', status: '开发反馈', step: 6, color: '#13c2c2', time: '2026-05-20 17:50' }]
  }
])

const feedbackData = ref([
  { no: 'FB2026052001', user: '张三', moldFee: '1200', sampleFee: '50', cycle: '15', remark: '供应商反馈模具需重新开发' }
])

// 设置默认选中一个“定制拿样”的任务，以便观察倒计时变化
currentTask.value = tableData.value[1] 

const getAssigneesAtStep = (index: number) => {
  return currentTask.value?.assignees?.filter((a: any) => a.step === index) || []
}

const isStepFullyDone = (index: number) => {
  if (!currentTask.value?.assignees) return false
  return currentTask.value.assignees.every((a: any) => a.step > index)
}

const getStepClass = (index: number) => {
  if (!currentTask.value?.assignees) return ''
  const anyAtStep = currentTask.value.assignees.some((a: any) => a.step === index)
  const allBeyondStep = currentTask.value.assignees.every((a: any) => a.step > index)
  
  if (allBeyondStep) return 'done'
  if (anyAtStep) return 'active'
  return ''
}

const switchToTask = (row: any) => {
  currentTask.value = row
  viewMode.value = 'workbench'
}

const handleAccept = () => {
  if (currentTask.value) {
    currentTask.value.receiverStatus = '已承接'
    // 实际业务逻辑：调用接口更新状态
  }
}

const handlePurchaseApply = () => {
  // 实际业务逻辑：打开购样申请弹窗
  console.log('Open Purchase Apply Dialog')
}
</script>

<style lang="scss" scoped>
.page-wrapper { padding: 12px; background: #f0f2f5; height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
.modern-card { background: #fff; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.mb-12 { margin-bottom: 12px; }

/* 管理看板 */
.manager-dashboard {
  display: flex; gap: 24px; padding: 16px 24px; flex-shrink: 0;
  .dash-item {
    flex: 1; border-right: 1px solid #f0f0f0;
    &:last-child { border-right: none; }
    .d-label { font-size: 12px; color: #8c8c8c; margin-bottom: 4px; }
    .d-value { font-size: 24px; font-weight: 800; color: #262626; small { font-size: 14px; font-weight: 400; } }
    &.urgent .d-value { color: #f5222d; }
  }
}

.workbench-container { display: flex; flex: 1; overflow: hidden; gap: 12px; }

.list-side {
  width: 320px; background: #fff; border-radius: 8px; display: flex; flex-direction: column; flex-shrink: 0;
  .side-header {
    padding: 16px; border-bottom: 1px solid #f0f0f0;
    .filter-bar { display: flex; gap: 10px; margin-bottom: 12px; }
    .side-stats-mini {
      display: flex; gap: 8px; margin-bottom: 12px;
      .s-item {
        flex: 1; background: #f5f5f5; border-radius: 4px; padding: 6px; text-align: center;
        span { display: block; font-size: 10px; color: #8c8c8c; }
        b { font-size: 14px; color: #262626; }
        &.urgent { background: #fff1f0; b { color: #f5222d; } }
      }
    }
    .status-scroll-tabs {
      display: flex; gap: 12px; overflow-x: auto;
      .mini-tab { white-space: nowrap; font-size: 12px; color: #8c8c8c; cursor: pointer; padding-bottom: 4px;
        &.active { color: #1890ff; font-weight: 600; border-bottom: 2px solid #1890ff; }
      }
    }
  }
  .side-content {
    flex: 1; overflow-y: auto; padding: 12px;
    .list-group-title { font-size: 11px; color: #bfbfbf; margin: 16px 0 8px 4px; }
    .task-card-mini {
      background: #fafafa; border-radius: 8px; padding: 12px; margin-bottom: 12px; cursor: pointer; border: 1px solid transparent;
      &.active { background: #e6f7ff; border-color: #1890ff; }
      &.urgent-border { border-left: 3px solid #f5222d; }
      .card-top { display: flex; justify-content: space-between; margin-bottom: 8px; .no { font-size: 12px; color: #8c8c8c; } }
      .card-main { display: flex; gap: 10px; .mini-img { width: 44px; height: 44px; border-radius: 4px; }
        .main-info { .name { font-size: 13px; font-weight: 600; color: #262626; } .meta { font-size: 11px; color: #8c8c8c; } }
      }
      .card-footer { display: flex; align-items: center; gap: 8px; margin-top: 8px;
        .progress-mini { flex: 1; height: 4px; background: #e8e8e8; border-radius: 2px; .p-bar { height: 100%; background: #1890ff; border-radius: 2px; } }
        .status-text { font-size: 11px; color: #faad14; }
      }
    }
  }
}

.detail-workspace {
  flex: 1; background: #fff; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden;
  .workspace-header { padding: 16px 24px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center;
    .header-left { display: flex; align-items: center; h2 { margin: 0 12px; font-size: 18px; } .id-copy { font-size: 13px; color: #8c8c8c; } }
  }
  .workflow-stepper {
    padding: 30px 40px; display: flex; justify-content: space-between; border-bottom: 1px solid #f0f0f0; background: #fff;
    .step-item {
      flex: 1; display: flex; flex-direction: column; align-items: center; position: relative;
      .step-node-trigger {
        display: flex; flex-direction: column; align-items: center; cursor: pointer; position: relative; z-index: 5;
        .step-icon {
          width: 26px; height: 26px; border-radius: 50%; border: 2px solid #d9d9d9;
          display: flex; align-items: center; justify-content: center; font-size: 12px;
          background: #fff; transition: all 0.3s;
        }
        .step-label { margin-top: 8px; font-size: 12px; color: #8c8c8c; font-weight: 500; white-space: nowrap; }
        
        .member-badges {
          position: absolute; top: -6px; right: -6px; display: flex; gap: 2px;
          .m-dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        }
      }
      .step-line {
        position: absolute; left: calc(50% + 13px); right: calc(-50% + 13px); height: 2px;
        background: #d9d9d9; top: 13px; z-index: 1; transition: all 0.3s;
      }
      &.done {
        .step-icon { border-color: #52c41a; color: #52c41a; }
        .step-line { background: #52c41a; }
        .step-label { color: #262626; }
      }
      &.active {
        .step-icon { border-color: #1890ff; background: #1890ff; color: #fff; box-shadow: 0 0 0 4px rgba(24,144,255,0.1); }
        .step-label { color: #1890ff; font-weight: 600; }
      }
    }
  }
}

.popper-detail-panel {
  .p-header { padding: 10px 12px; background: #fafafa; border-bottom: 1px solid #f0f0f0; font-size: 12px; font-weight: 600; color: #595959; }
  .p-list { padding: 8px; display: flex; flex-direction: column; gap: 8px; }
  .p-card {
    padding: 8px 10px; background: #fff; border-radius: 4px; border: 1px solid #f0f0f0;
    &:hover { border-color: #1890ff; }
    .p-line-1 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;
      .p-name { font-size: 13px; font-weight: 600; color: #262626; }
      .p-status { font-size: 11px; padding: 1px 6px; border-radius: 10px; }
    }
    .p-time { font-size: 11px; color: #bfbfbf; font-family: monospace; }
  }
}

.workspace-body { flex: 1; overflow-y: auto; padding: 20px;
  .grid-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
  .info-block { padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;
    .block-title { font-size: 15px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
      &::before { content: ''; width: 3px; height: 14px; background: #1890ff; }
    }
  }
  .field-group { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    .field { label { display: block; font-size: 12px; color: #8c8c8c; margin-bottom: 4px; } span { font-size: 14px; font-weight: 500; } }
  }
  .time-metrics { display: flex; justify-content: space-around; 
    .metric { text-align: center; 
      .m-val { font-size: 22px; font-weight: 800; 
        &.danger { color: #f5222d; } 
        &.warning { color: #faad14; }
        small { font-size: 12px; font-weight: 400; margin: 0 2px; }
      } 
      .m-lab { font-size: 12px; color: #8c8c8c; } 
    }
    &.is-custom { display: grid; grid-template-columns: repeat(3, 1fr); }
  }
  .sku-cards-container { display: flex; gap: 16px; overflow-x: auto; .sku-mini-card { width: 180px; flex-shrink: 0; background: #fafafa; padding: 12px; border-radius: 8px; display: flex; gap: 12px; .sku-img { width: 50px; height: 50px; } .sku-details { font-size: 12px; } }
    .sku-add-card { width: 100px; flex-shrink: 0; border: 1px dashed #d9d9d9; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #8c8c8c; cursor: pointer; }
  }
}

.table-view-container { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.table-header-bar { padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
.table-main-box { flex: 1; overflow: hidden; }

.text-danger { color: #f5222d; }
.mt-16 { margin-top: 16px; }
.mr-8 { margin-right: 8px; }
.price-text { color: #f5222d; font-weight: 700; }
.custom-scrollbar { &::-webkit-scrollbar { width: 4px; } &::-webkit-scrollbar-thumb { background: #d9d9d9; border-radius: 2px; } }
</style>
