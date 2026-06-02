<template>
  <div class="sample-task-page">
    <div class="workbench-layout">
      <!-- 左侧任务导航 -->
      <aside class="side-panel">
        <div class="side-header">
          <div class="search-box">
            <el-input v-model="searchQuery" placeholder="搜索编号/产品" prefix-icon="Search" size="small" />
          </div>
          
          <div class="urgent-container">
            <div class="urgent-summary-line">
              <el-icon class="clock-icon"><Clock /></el-icon>
              <span class="label">今日紧急处理</span>
              <span class="count-badge">11</span>
            </div>

            <div class="urgent-card-list">
              <div v-for="item in urgentTasks" :key="item.proposalNo" 
                   :class="['urgent-mini-card', { active: currentTask?.proposalNo === item.proposalNo }]"
                   @click="currentTask = item">
                <div class="card-top">
                  <span class="id">{{ item.proposalNo }}</span>
                  <div class="urgent-label-tag">紧急</div>
                </div>
                <div class="card-main">
                  <el-image :src="item.image" class="product-thumb" />
                  <div class="info">
                    <div class="title">{{ item.productName }}</div>
                    <div class="sub">{{ item.pm }} <span class="v-line">|</span> {{ item.sampleMethodText }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tabs-scroll-nav">
            <div v-for="tab in statusTabs" :key="tab.value" 
                 :class="['tab-item', { active: activeTab === tab.value }]"
                 @click="activeTab = tab.value">
              {{ tab.label }}(12)
            </div>
          </div>
        </div>

        <div class="side-body custom-scrollbar">
          <!-- 普通任务组 -->
          <div v-for="item in normalTasks" :key="item.proposalNo" 
               :class="['normal-task-card', { active: currentTask?.proposalNo === item.proposalNo }]"
               @click="currentTask = item">
            <div class="card-top">
              <span class="id">{{ item.proposalNo }}</span>
              <span class="days-tag">{{ item.remainingDays }}天</span>
            </div>
            <div class="card-main">
              <el-image :src="item.image" class="product-thumb" />
              <div class="info">
                <div class="title">{{ item.productName }}</div>
                <div class="sub">{{ item.pm }} <span class="v-line">|</span> {{ item.sampleMethodText }}</div>
              </div>
            </div>
            <div class="card-footer">
              <div class="separator-line"></div>
              <span class="status-link">已承接</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧详情区 -->
      <main class="main-content" v-if="currentTask">
        <header class="content-header">
          <div class="header-left">
            <el-tag size="small" type="danger" effect="plain" class="tag-p0">P0</el-tag>
            <el-tag size="small" color="#faad14" effect="dark" class="tag-level">A级提案</el-tag>
            <el-tag size="small" type="success" effect="plain" class="tag-method">定制拿样</el-tag>
            <h1 class="product-name">{{ currentTask.productName }}</h1>
            <div class="proposal-id">
              <span>{{ currentTask.proposalNo }}</span>
              <el-icon class="copy-btn"><CopyDocument /></el-icon>
            </div>
          </div>
          <div class="header-actions">
            <template v-if="currentTask.sampleMethodText === '定制拿样'">
              <el-button type="primary" class="action-btn blue" @click="handleCustomFeedback">定制反馈</el-button>
              <el-button type="primary" icon="Plus" class="action-btn blue" @click="handleSampleRegistration()">样品登记</el-button>
              <el-button class="action-btn plain">转移任务</el-button>
            </template>
            <template v-else-if="currentTask.sampleMethodText === '现货拿样'">
              <el-button type="primary" class="action-btn blue" @click="handlePurchaseApply()">购样申请</el-button>
              <el-button type="primary" icon="Plus" class="action-btn blue" @click="handleSampleRegistration()">样品登记</el-button>
              <el-button class="action-btn plain">转移任务</el-button>
            </template>
            <template v-else>
              <el-button type="primary" class="action-btn blue">反馈</el-button>
              <el-button type="primary" icon="Plus" class="action-btn blue" @click="handleSampleRegistration()">样品登记</el-button>
              <el-button class="action-btn plain">转移任务</el-button>
            </template>
          </div>
        </header>

        <!-- 8步进度条 -->
        <div class="stepper-container">
          <div v-for="(step, index) in steps" :key="index" :class="['step-node', getStepStatus(index)]">
            <div class="node-main">
              <div class="circle">
                <el-icon v-if="index < 1"><Check /></el-icon>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span class="label">{{ step }}</span>
            </div>
            <div v-if="index < steps.length - 1" :class="['line', { completed: index < 1 }]"></div>
          </div>
        </div>

        <div class="content-body custom-scrollbar">
          <!-- 顶部卡片布局：三个卡片并排显示 -->
          <div class="info-cards-row mb-12">
            <div class="info-card">
              <h3 class="card-title">提案-基础信息</h3>
              <div class="card-grid grid-2">
                <div class="item"><label>运营大类</label><span>智能硬件</span></div>
                <div class="item"><label>团队负责人</label><span>廖飞飞</span></div>
                <div class="item"><label>产品经理</label><span>{{ currentTask.pm }}</span></div>
                <div class="item"><label>产品名称</label><span>{{ currentTask.productName }}</span></div>
                <div class="item"><label>款式</label><span>{{ currentTask.style || '亚克力透明款' }}</span></div>
                <div class="item"><label>型号</label><span>{{ currentTask.model || 'JK-2026-X1' }}</span></div>
                <div class="item"><label>主材料</label><span>{{ currentTask.material || '亚克力 + LED' }}</span></div>
                <div class="item"><label>适用品牌</label><span>{{ currentTask.applicableTo || '通用 / 通用' }}</span></div>
                <div class="item"><label>SPU</label><span>{{ currentTask.spu || 'SPU882910' }}</span></div>
              </div>
            </div>

            <div class="info-card">
              <h3 class="card-title">提案-拿样要求</h3>
              <div class="card-grid grid-2">
                <div class="item flex-row"><label>开发方式</label><el-tag size="small" class="custom-tag">{{ currentTask.devMethod || '全新品-定制' }}</el-tag></div>
                <div class="item"><label>开发品牌</label><span>{{ currentTask.brand || 'MoKo' }}</span></div>
                <div class="item"><label>初始Logo位置</label><span>{{ currentTask.logoPosition || '无' }}</span></div>
                <div class="item"><label>初始包装方式</label><span>{{ currentTask.packagingMethod || '盒装' }}</span></div>
                <div class="item"><label>首单采购数量</label><span>{{ currentTask.buyQty || '500' }}</span></div>
                <div class="item"><label>首单采购总金额</label><span>¥ {{ currentTask.totalAmount || '115,000.00' }}</span></div>
                <div class="item"><label>上架时间要求</label><span>{{ currentTask.launchTime || '2026-07-15' }}</span></div>
              </div>
            </div>

            <div class="info-card no-padding-bottom">
              <h3 class="card-title">提案-时效要求</h3>
              <div class="time-list">
                <div class="time-row"><label>任务发布时间</label><span>05-20 09:00</span></div>
                <div class="time-row"><label>反馈截止时间</label><span>05-22 18:00</span></div>
                <div class="time-row"><label>任务截止时间</label><span>05-31 18:00</span></div>
              </div>
              <div class="custom-dotted-divider"></div>
              <div class="card-countdown">
                <div class="cd-box feedback">
                  <div class="val">02<small>d</small>14<small>h</small></div>
                  <div class="lab">反馈倒计时</div>
                </div>
                <div class="cd-box task">
                  <div class="val">11<small>d</small>23<small>h</small></div>
                  <div class="lab">任务倒计时</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. 提案-调研信息 -->
          <div class="info-card mb-12">
            <h3 class="card-title">提案-调研信息</h3>
            <div class="data-grid grid-3 mb-20">
              <div class="item"><label>产品来源</label><span>-</span></div>
              <div class="item"><label>使用场景</label><span>室内居家、工作室</span></div>
              <div class="item"><label>使用人群</label><span>全年龄段拼图爱好者</span></div>
              
              <div class="item"><label>主攻市场</label><span>北美</span></div>
              <div class="item"><label>季节标签</label><span>无</span></div>
              <div class="item"><label>节日标签</label><span>无</span></div>

              <div class="item span-2">
                <label>卖点说明</label>
                <span class="value-text">1.可旋转可调节高度拼图桌 2.改抽屉和腿，差评抽屉阻挡调节和旋转 放腿 3.优化腿部的结构，防止撞到小腿</span>
              </div>
              <div class="item"><label>市场预估</label><span>圣诞旺季产品 预估销量1000</span></div>

              <div class="item"><label>调研分析文档</label><el-link type="primary" :underline="false">空白.xls</el-link></div>
              <div class="item flex-row">
                <label><span class="red-star">*</span>参考链接1</label>
                <el-link type="primary" :underline="false" class="ml-4">https://www.amazon.com/...</el-link>
              </div>
              <div class="item flex-row align-start">
                <label>参考图片</label>
                <el-image :src="currentTask.image" class="ref-image-box" />
              </div>
            </div>
          </div>

          <!-- 5. 提案-任务明细 -->
          <div class="info-card">
            <h3 class="card-title">提案-任务明细</h3>
            <div class="detail-sub-title mb-12">
              <el-icon class="icon"><Document /></el-icon>
              <span>任务说明</span>
            </div>

            <div class="data-grid grid-2 mb-20">
              <div class="item">
                <label>产品规格书</label>
                <el-link type="primary" :underline="false">亲肤腰带-隐身薄款(市调).20260416.xlsx</el-link>
              </div>
              <div class="item flex-row justify-end">
                <label style="width: auto; margin-right: 12px;">底线采购价</label>
                <span class="value" style="font-size: 16px; font-weight: 700; color: #262626;">32 CNY</span>
              </div>
            </div>

            <div class="supplementary-box mb-20">
              <span class="label">补充说明</span>
              <span class="content">请工厂重点确认魔术贴的使用寿命，以及边缘缝线是否容易脱落</span>
            </div>

            <div class="detail-sub-title mb-12">
              <el-icon class="icon"><Management /></el-icon>
              <span>任务执行</span>
            </div>

            <!-- 定制反馈列表 -->
            <div class="feedback-list-container">
              <div class="list-header">
                <span class="title">定制反馈列表</span>
                <el-button type="primary" link icon="Plus" @click="handleCustomFeedback">添加反馈</el-button>
              </div>
              <el-table :data="feedbackListData" border stripe size="small" class="custom-table">
                <el-table-column label="反馈编号" prop="code" width="140" fixed="left" />
                <el-table-column label="货源地" prop="source" width="120" />
                <el-table-column label="费用类型" prop="feeType" width="100" />
                <el-table-column label="费用金额" prop="feeAmount" width="100" />
                <el-table-column label="模具归属" prop="moldOwnership" width="100" />
                <el-table-column label="定制用时" prop="customDuration" width="100" />
                <el-table-column label="初次报价" prop="initialQuote" width="100" />
                <el-table-column label="生产周期" prop="productionCycle" width="100" />
                <el-table-column label="起订量" prop="moq" width="80" />
                <el-table-column label="是否可退款" prop="isRefundable" width="100" />
                <el-table-column label="退款方式" prop="refundMethod" width="100" />
                <el-table-column label="退款条件" prop="refundCondition" min-width="150" show-overflow-tooltip />
                <el-table-column label="附加条件" prop="additionalConditions" min-width="150" show-overflow-tooltip />
                <el-table-column label="状态" width="100" fixed="right">
                  <template #default="{ row }">
                    <el-tag :type="row.statusType" size="small">{{ row.status }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="160" fixed="right">
                  <template #default="{ row }">
                    <template v-if="['待提交', '已驳回'].includes(row.status)">
                      <el-button type="primary" link size="small">编辑</el-button>
                      <el-button type="danger" link size="small">删除</el-button>
                    </template>
                    <template v-if="row.status === '已采纳'">
                      <el-button v-if="row.feeAmount === '¥ 0.00'" type="primary" link size="small" @click="handleSampleRegistration(row)">样品登记</el-button>
                      <el-button v-else type="primary" link size="small" @click="handlePurchaseApply(row)">购样申请</el-button>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </main>
    </div>
    
    <!-- 弹窗组件挂载 -->
    <CustomFeedbackDialog ref="customFeedbackRef" />
    <PurchaseApplyDialog ref="purchaseApplyRef" />
    <SampleRegistrationDialog ref="sampleRegistrationRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Clock, CopyDocument, Check, Plus, Document, Management } from '@element-plus/icons-vue'
import CustomFeedbackDialog from './components/CustomFeedbackDialog.vue'
import PurchaseApplyDialog from './components/PurchaseApplyDialog.vue'
import SampleRegistrationDialog from './components/SampleRegistrationDialog.vue'

const searchQuery = ref('')
const activeTab = ref('accepted')
const currentTask = ref<any>(null)
const customFeedbackRef = ref<any>(null)
const purchaseApplyRef = ref<any>(null)
const sampleRegistrationRef = ref<any>(null)

const statusTabs = [
  { label: '未完成', value: 'unfinished' },
  { label: '已承接', value: 'accepted' },
  { label: '定制反馈', value: 'custom_feedback' },
  { label: '购样申请', value: 'purchase_apply' },
  { label: '样品待反馈', value: 'sample_feedback' }
]

const steps = ['任务发布', '任务承接', '定制反馈', '购样申请', '费用审批', '样品登记', '开发反馈', '任务归档']

const tableData = ref([
  {
    image: 'https://picsum.photos/100/100?random=1',
    proposalNo: 'TA-202605049',
    productName: 'DIY灯光板 - 亚克力透明款',
    pm: '颜沙沙',
    sampleMethodText: '现货拿样',
    category: '家居装饰',
    remainingDays: 7,
    isUrgent: true,
    style: '透明款',
    material: '亚克力',
    model: 'DIY-001',
    applicableTo: '通用',
    spu: 'SPU001',
    brand: 'MoKo',
    logoPosition: '侧面',
    packagingMethod: '盒装',
    buyQty: '100',
    totalAmount: '2,000.00',
    launchTime: '2026-06-30'
  },
  {
    image: 'https://picsum.photos/100/100?random=11',
    proposalNo: 'TA-202605061',
    productName: '折叠笔记本支架 - 加厚版',
    pm: '赵敏',
    sampleMethodText: '现货拿样',
    category: '数码配件',
    remainingDays: 5,
    isUrgent: true,
    style: '加厚版',
    material: '铝合金',
    model: 'NB-ST01',
    applicableTo: '笔记本电脑',
    spu: 'SPU002',
    brand: 'MoKo',
    logoPosition: '面板',
    packagingMethod: '盒装',
    buyQty: '200',
    totalAmount: '8,000.00',
    launchTime: '2026-07-10'
  },
  {
    image: 'https://picsum.photos/200/200?random=25',
    proposalNo: 'TA-202605069',
    productName: '电子墨水屏阅读器',
    pm: '李健',
    sampleMethodText: '定制拿样',
    category: '智能硬件',
    remainingDays: 11,
    isUrgent: false,
    style: '墨水屏Pro版',
    material: '复合塑胶 + 电子墨水屏',
    model: 'EP-2026-V1',
    applicableTo: '商务人士',
    spu: 'SPU882910',
    brand: 'MoKo',
    logoPosition: '背面',
    packagingMethod: '礼盒装',
    buyQty: '500',
    totalAmount: '115,000.00',
    launchTime: '2026-07-15'
  },
  {
    image: 'https://picsum.photos/200/200?random=22',
    proposalNo: 'TA-202605066',
    productName: '多功能露营灯',
    pm: '颜沙沙',
    sampleMethodText: '现货拿样',
    category: '户外运动',
    remainingDays: 11,
    isUrgent: false,
    style: '多功能款',
    material: 'ABS',
    model: 'CP-L01',
    applicableTo: '露营爱好者',
    spu: 'SPU004',
    brand: 'MoKo',
    logoPosition: '顶部',
    packagingMethod: '彩盒',
    buyQty: '300',
    totalAmount: '5,000.00',
    launchTime: '2026-08-01'
  },
  {
    image: 'https://picsum.photos/200/200?random=24',
    proposalNo: 'TA-202605068',
    productName: '桌面加湿器 - 极简版',
    pm: '邓紫棋',
    sampleMethodText: '现货拿样',
    category: '生活电器',
    remainingDays: 13,
    isUrgent: false,
    style: '极简版',
    material: 'PP',
    model: 'HM-D01',
    applicableTo: '通用',
    spu: 'SPU005',
    brand: 'MoKo',
    logoPosition: '正面',
    packagingMethod: '白盒',
    buyQty: '1000',
    totalAmount: '12,000.00',
    launchTime: '2026-09-01'
  },
  {
    image: 'https://picsum.photos/200/200?random=26',
    proposalNo: 'TA-202605070',
    productName: '机械键盘 - 复古款',
    pm: '颜沙沙',
    sampleMethodText: '现货拿样',
    category: '数码配件',
    remainingDays: 12,
    isUrgent: false,
    style: '复古款',
    material: 'PBT',
    model: 'KB-R01',
    applicableTo: '电脑用户',
    spu: 'SPU006',
    brand: 'MoKo',
    logoPosition: '底部',
    packagingMethod: '礼盒',
    buyQty: '150',
    totalAmount: '15,000.00',
    launchTime: '2026-10-15'
  }
])

currentTask.value = tableData.value[2]

const urgentTasks = computed(() => tableData.value.filter(i => i.isUrgent))
const normalTasks = computed(() => tableData.value.filter(i => !i.isUrgent))

const getStepStatus = (index: number) => {
  if (index < 1) return 'done'
  if (index === 1) return 'active'
  return 'pending'
}

const handleCustomFeedback = () => {
  customFeedbackRef.value?.open()
}

const handlePurchaseApply = (row?: any) => {
  console.log('Opening Purchase Apply Dialog', row)
  if (purchaseApplyRef.value) {
    purchaseApplyRef.value.open(row)
  } else {
    console.error('purchaseApplyRef is not initialized')
  }
}

const handleSampleRegistration = (taskData?: any) => {
  console.log('Opening Sample Registration Dialog', taskData)
  if (sampleRegistrationRef.value) {
    // 这里的 taskData 可能是反馈列表中的某一行，也可能为空（点击顶部按钮）
    // 为了同步规格信息，我们需要确保传给弹窗的数据包含 currentTask 的基础信息
    const syncData = {
      ...(currentTask.value || {}),
      ...(taskData || {})
    }
    sampleRegistrationRef.value.open(syncData)
  } else {
    console.error('sampleRegistrationRef is not initialized')
  }
}

const feedbackListData = ref([
  {
    code: 'FA-20260520-01',
    source: '1688-广州某工厂',
    feeType: '开模费',
    feeAmount: '¥ 5,000.00',
    moldOwnership: '公司',
    customDuration: '15天',
    initialQuote: '¥ 85.00',
    productionCycle: '25天',
    moq: '1000',
    isRefundable: '是',
    refundMethod: '返现金',
    refundCondition: '首单满1万',
    additionalConditions: '含彩盒包装',
    status: '待开发反馈',
    statusType: 'primary'
  },
  {
    code: 'FA-20260520-02',
    source: '线下-深圳供应商',
    feeType: '打样费',
    feeAmount: '¥ 50.00',
    moldOwnership: '-',
    customDuration: '7天',
    initialQuote: '¥ 78.00',
    productionCycle: '20天',
    moq: '500',
    isRefundable: '否',
    refundMethod: '-',
    refundCondition: '-',
    additionalConditions: '无',
    status: '已采纳',
    statusType: 'success'
  },
  {
    code: 'FA-20260520-03',
    source: '阿里国际-义乌供应商',
    feeType: '打样费',
    feeAmount: '¥ 150.00',
    moldOwnership: '-',
    customDuration: '5天',
    initialQuote: '¥ 92.00',
    productionCycle: '30天',
    moq: '2000',
    isRefundable: '是',
    refundMethod: '抵扣货款',
    refundCondition: '起订量翻倍',
    additionalConditions: '运费自理',
    status: '未采纳',
    statusType: 'info'
  },
  {
    code: 'FA-20260521-04',
    source: '東莞某五金厂',
    feeType: '开模费',
    feeAmount: '¥ 12,000.00',
    moldOwnership: '共有',
    customDuration: '30天',
    initialQuote: '¥ 65.00',
    productionCycle: '45天',
    moq: '5000',
    isRefundable: '否',
    refundMethod: '-',
    refundCondition: '-',
    additionalConditions: '模具寿命20万模',
    status: '已驳回',
    statusType: 'danger'
  },
  {
    code: 'FA-20260521-05',
    source: '线下-苏州电子',
    feeType: '开模费',
    feeAmount: '¥ 8,000.00',
    moldOwnership: '供应商',
    customDuration: '20天',
    initialQuote: '¥ 110.00',
    productionCycle: '35天',
    moq: '1500',
    isRefundable: '是',
    refundMethod: '抵扣首单',
    refundCondition: '满5万退',
    additionalConditions: '含两轮功能验证',
    status: '待提交',
    statusType: 'warning'
  },
  {
    code: 'FA-20260522-06',
    source: '长期合作-惠州工厂',
    feeType: '打样费',
    feeAmount: '¥ 0.00',
    moldOwnership: '-',
    customDuration: '3天',
    initialQuote: '¥ 62.00',
    productionCycle: '15天',
    moq: '300',
    isRefundable: '否',
    refundMethod: '-',
    refundCondition: '-',
    additionalConditions: '样机免费寄送',
    status: '已采纳',
    statusType: 'success'
  }
])
</script>

<style lang="scss" scoped>
.sample-task-page { height: 100vh; background: #f0f2f5; display: flex; flex-direction: column; }
.workbench-layout { display: flex; flex: 1; overflow: hidden; }

// Side Panel
.side-panel {
  width: 320px; background: #fff; border-right: 1px solid #e8e8e8; display: flex; flex-direction: column;
  .side-header {
    padding: 12px; border-bottom: 1px solid #f0f0f0;
    .search-box { margin-bottom: 12px; }
    .urgent-container {
      background: #fafafa; border: 1px solid #f0f0f0; border-radius: 8px; padding: 12px; margin-bottom: 12px;
      .urgent-summary-line {
        display: flex; align-items: center; margin-bottom: 12px;
        .clock-icon { color: #f5222d; margin-right: 8px; font-size: 14px; }
        .label { color: #f5222d; font-size: 12px; font-weight: 600; flex: 1; }
        .count-badge { background: #f5222d; color: #fff; font-size: 11px; padding: 1px 6px; border-radius: 10px; }
      }
      .urgent-card-list {
        display: flex; flex-direction: column; gap: 8px;
        .urgent-mini-card {
          background: #fff; border: 1px solid #f0f0f0; border-radius: 4px; padding: 10px; cursor: pointer; position: relative;
          &.active { border-color: #1890ff; background: #f0f7ff; }
          &::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #f5222d; }
          .card-top { display: flex; justify-content: space-between; margin-bottom: 8px; .id { font-size: 11px; color: #8c8c8c; } .urgent-label-tag { background: #f5222d; color: #fff; font-size: 10px; padding: 1px 6px; border-radius: 2px; } }
          .card-main { display: flex; gap: 8px; .product-thumb { width: 36px; height: 36px; border-radius: 2px; } .info { overflow: hidden; .title { font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .sub { font-size: 11px; color: #8c8c8c; } } }
        }
      }
    }
    .tabs-scroll-nav {
      display: flex; gap: 16px; overflow-x: auto; padding-bottom: 4px;
      &::-webkit-scrollbar { height: 0; }
      .tab-item {
        white-space: nowrap; font-size: 12px; color: #8c8c8c; cursor: pointer; padding: 8px 0; position: relative;
        &.active { color: #1890ff; font-weight: 600; &::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #1890ff; } }
      }
    }
  }
  .side-body {
    flex: 1; padding: 12px; overflow-y: auto; background: #fff;
    .normal-task-card {
      background: #fff; border: 1px solid #f0f0f0; border-radius: 4px; padding: 12px; margin-bottom: 12px; cursor: pointer;
      &.active { border-color: #1890ff; background: #f0f7ff; }
      .card-top { display: flex; justify-content: space-between; margin-bottom: 10px; .id { font-size: 12px; color: #bfbfbf; } .days-tag { font-size: 11px; color: #fa8c16; background: #fff7e6; border: 1px solid #ffd591; padding: 1px 6px; border-radius: 4px; } }
      .card-main { display: flex; gap: 12px; .product-thumb { width: 44px; height: 44px; border-radius: 4px; } .info { overflow: hidden; .title { font-size: 13px; font-weight: 600; color: #262626; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .sub { font-size: 11px; color: #bfbfbf; .v-line { margin: 0 4px; } } } }
      .card-footer { margin-top: 10px; text-align: right; .separator-line { height: 1px; background: #f0f0f0; margin-bottom: 8px; } .status-link { font-size: 11px; color: #bfbfbf; text-decoration: underline; cursor: default; } }
    }
  }
}

// Main Content
.main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #fff; }
.content-header { padding: 16px 24px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center;
  .header-left { display: flex; align-items: center; gap: 8px; .product-name { margin: 0 12px; font-size: 18px; font-weight: 700; } .proposal-id { display: flex; align-items: center; gap: 4px; color: #bfbfbf; font-size: 13px; } }
}
.stepper-container { padding: 24px 60px; display: flex; justify-content: space-between; border-bottom: 1px solid #f0f0f0;
  .step-node { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative;
    .circle { width: 26px; height: 26px; border-radius: 50%; border: 1px solid #d9d9d9; display: flex; align-items: center; justify-content: center; font-size: 13px; }
    .label { margin-top: 8px; font-size: 12px; color: #bfbfbf; }
    .line { position: absolute; left: calc(50% + 13px); right: calc(-50% + 13px); height: 1px; background: #f0f0f0; top: 13px; &.completed { background: #52c41a; } }
    &.done { .circle { background: #52c41a; border-color: #52c41a; color: #fff; } .label { color: #52c41a; } }
    &.active { .circle { background: #1890ff; border-color: #1890ff; color: #fff; } .label { color: #1890ff; font-weight: 600; } }
  }
}

.content-body { flex: 1; padding: 12px 16px 60px; overflow-y: auto; background: #f0f2f5;
  .info-cards-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .info-card { 
    background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1px 20px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    .card-title { font-size: 14px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; &::before { content: ''; width: 3px; height: 14px; background: #1890ff; margin-right: 8px; } }
    
    // Grid for horizontal label-value
    .card-grid { 
      display: grid; grid-template-columns: 1fr; gap: 12px; 
      &.grid-2 { grid-template-columns: repeat(2, 1fr); gap: 12px 24px; }
      .item { 
        display: flex; align-items: baseline;
        label { width: 90px; font-size: 12px; color: #8c8c8c; flex-shrink: 0; margin-bottom: 0; }
        span { font-size: 13px; color: #262626; font-weight: 500; }
      }
    }
    
    .time-list {
      padding: 4px 0;
      .time-row { 
        display: flex; align-items: baseline; margin-bottom: 10px; 
        label { width: 100px; font-size: 12px; color: #8c8c8c; flex-shrink: 0; }
        span { font-size: 13px; color: #262626; font-weight: 600; flex: 1; text-align: right; }
      }
    }
    
    .custom-dotted-divider { 
      height: 1px; width: 100%; margin: 12px 0;
      background-image: linear-gradient(to right, #94a3b8 40%, rgba(255,255,255,0) 0%);
      background-position: bottom;
      background-size: 6px 1px;
      background-repeat: repeat-x;
    }
    
    .card-countdown {
      display: flex; gap: 12px; margin-top: 12px;
      .cd-box {
        flex: 1; text-align: center; background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #eef2f6; border-radius: 6px; padding: 12px 0;
        .val { font-size: 18px; font-weight: 700; margin-bottom: 2px; small { font-size: 11px; margin-left: 1px; font-weight: 400; } }
        .lab { font-size: 11px; color: #8c8c8c; }
        &.feedback { .val { color: #fa8c16; } }
        &.task { .val { color: #262626; } }
      }
    }

    // Grid for horizontal label-value in research/details blocks
    .data-grid { 
      display: grid; gap: 16px 40px; 
      &.grid-3 { grid-template-columns: repeat(3, 1fr); }
      &.grid-2 { grid-template-columns: repeat(2, 1fr); }
      .item.span-2 { grid-column: span 2; }
    }
    
    .item {
      display: flex; align-items: baseline;
      label { width: 90px; font-size: 12px; color: #8c8c8c; flex-shrink: 0; margin-bottom: 0; }
      span { font-size: 13px; color: #262626; font-weight: 600; flex: 1; }
      &.flex-row { display: flex; align-items: center; label { margin-right: 0; } }
      &.align-start { align-items: flex-start; }
      .value-text { font-size: 13px; color: #262626; font-weight: 600; line-height: 1.6; }
      .red-star { color: #f5222d; margin-right: 2px; font-weight: bold; }
    }
    
    .ref-image-box { width: 44px; height: 44px; border-radius: 4px; border: 1px solid #e8e8e8; margin-top: 4px; }
    .detail-sub-title {
      display: flex; align-items: center; gap: 8px; margin-top: 8px;
      .icon { color: #1890ff; font-size: 16px; }
      span { font-size: 13px; font-weight: 700; color: #1e293b; }
    }
    .footer-row-flex { display: flex; justify-content: space-between; align-items: center; .price-col { .label { font-size: 12px; color: #8c8c8c; margin-right: 24px; } .value { font-size: 14px; font-weight: 700; } } }
    .supplementary-box { 
      display: flex; align-items: baseline; background: #fffdf6; border: 1px solid #fef3c7; border-radius: 6px; padding: 14px 18px; 
      .label { font-size: 12px; color: #92400e; margin-right: 24px; flex-shrink: 0; font-weight: 600; } 
      .content { font-size: 13px; color: #78350f; font-weight: 500; line-height: 1.6; } 
    }
  }
}

.custom-tag { 
  background: #e6f7ff; 
  border-color: #91d5ff; 
  color: #1890ff; 
  font-weight: 500; 
  border-radius: 4px;
  padding: 0 8px;
  height: 22px;
  line-height: 20px;
}
.mb-20 { margin-bottom: 20px; }
.mb-12 { margin-bottom: 12px; }
.ml-8 { margin-left: 8px; }
.ml-4 { margin-left: 4px; }

.feedback-list-container {
  margin-top: 16px; border-top: 1px dashed #e2e8f0; padding-top: 16px;
  .list-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
    .title { font-size: 13px; font-weight: 700; color: #475569; }
  }
  .price-info { font-size: 11px; line-height: 1.5; color: #64748b; .amt { color: #f59e0b; font-weight: 600; } }
  .custom-table {
    :deep(.el-table__header) { th { background-color: #f8fafc; color: #475569; font-weight: 700; } }
  }
}
.custom-scrollbar { &::-webkit-scrollbar { width: 4px; } &::-webkit-scrollbar-thumb { background: #d9d9d9; border-radius: 2px; } }
</style>
