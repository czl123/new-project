<template>
  <el-drawer
    v-model="visible"
    title="任务执行详情"
    size="78%"
    class="task-detail-drawer-v4"
    :destroy-on-close="true"
    @opened="handleOpened"
  >
    <template #header>
      <div class="task-drawer-header-v4">
        <div class="title-main">
          <div class="title-tag" :class="taskInfo.priority">{{ taskInfo.priority }}</div>
          <span class="title-text">{{ taskInfo.name }}</span>
          <span class="title-id">{{ taskInfo.no }}</span>
        </div>
        <div class="header-actions">
           <div class="status-pill" :class="taskInfo.status">{{ taskInfo.status }}</div>
        </div>
      </div>
    </template>

    <div class="task-main-v4" v-if="visible">
      <!-- 1. 顶部看板 -->
      <div class="perspective-stats">
        <div class="p-stat-card">
          <div class="p-icon ic-stage"><el-icon><Management /></el-icon></div>
          <div class="p-info">
            <div class="p-label">执行进度</div>
            <div class="p-value">采购反馈 / 购样中</div>
          </div>
        </div>
        <div class="p-stat-card">
          <div class="p-icon ic-fee"><el-icon><Money /></el-icon></div>
          <div class="p-info">
            <div class="p-label">累计费用申请</div>
            <div class="p-value price">¥ 125.00</div>
          </div>
        </div>
        <div class="p-stat-card">
          <div class="p-icon ic-user"><el-icon><User /></el-icon></div>
          <div class="p-info">
            <div class="p-label">当前负责人</div>
            <div class="p-value user">{{ taskInfo.user }}</div>
          </div>
        </div>
        <div class="p-stat-card">
          <div class="p-icon ic-time"><el-icon><Timer /></el-icon></div>
          <div class="p-info">
            <div class="p-label">反馈时限</div>
            <div class="p-value countdown">18h 25m</div>
          </div>
        </div>
      </div>

      <!-- 2. 核心内容区 -->
      <div class="content-body-v4">
        <!-- 任务反馈全记录 -->
        <div class="biz-module-v4">
          <div class="m-header"><div class="m-title">任务反馈全记录</div></div>
          
          <div class="spec-table-container">
            <el-table 
              :key="activeFeedbackNo"
              ref="feedbackTableRef"
              :data="feedbackList" 
              border 
              size="small"
              class="final-spec-style-table"
              :row-class-name="getRowClass"
              @cell-mouse-enter="(row: any) => setHighlight(row.no)"
              @cell-mouse-leave="clearHighlight"
            >
              <!-- 组 1：基础归属 (t-base 关联颜色) -->
              <el-table-column label="基础归属" align="center" class-name="bg-base" label-class-name="t-base">
                <el-table-column type="index" label="序号" width="50" align="center" label-class-name="t-base" />
                <el-table-column prop="no" label="反馈编号" width="160" align="center" label-class-name="t-base" />
                <el-table-column prop="user" label="采购员" width="90" align="center" label-class-name="t-base" />
                <el-table-column prop="date" label="反馈日期" width="110" align="center" label-class-name="t-base" />
              </el-table-column>

              <!-- 组 2：采购反馈详情 (t-purchase 关联颜色) -->
              <el-table-column label="采购反馈详情" align="center" class-name="bg-purchase" label-class-name="t-purchase">
                <el-table-column prop="source" label="货源地" width="140" show-overflow-tooltip label-class-name="t-purchase" />
                <el-table-column prop="moldFee" label="开模费" width="90" align="right" label-class-name="t-purchase" />
                <el-table-column prop="sampleFee" label="打样费" width="90" align="right" label-class-name="t-purchase" />
                <el-table-column prop="quote" label="初始报价" width="90" align="right" label-class-name="t-purchase" />
                <el-table-column prop="customCycle" label="定制周期" width="85" align="center" label-class-name="t-purchase" />
                <el-table-column prop="prodCycle" label="生产周期" width="85" align="center" label-class-name="t-purchase" />
                <el-table-column prop="moq" label="起订量" width="90" align="center" label-class-name="t-purchase" />
                <el-table-column prop="refundable" label="是否可退款" width="100" align="center" label-class-name="t-purchase" />
                <el-table-column prop="remark" label="附加条件" width="150" show-overflow-tooltip label-class-name="t-purchase" />
              </el-table-column>
              
              <!-- 组 3：开发反馈信息 (t-dev 关联颜色) -->
              <el-table-column label="开发反馈信息" align="center" class-name="bg-dev" label-class-name="t-dev">
                <el-table-column prop="result" label="反馈结果" width="100" align="center" label-class-name="t-dev">
                  <template #default="{ row }">
                    <span class="res-mini-tag" :class="{ 'is-ok': row.result === '采纳' }">{{ row.result }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="devStatus" label="反馈状态" width="90" align="center" label-class-name="t-dev" />
                <el-table-column prop="devTime" label="反馈时间" width="145" align="center" label-class-name="t-dev" />
                <el-table-column prop="devRemark" label="反馈说明" width="280" show-overflow-tooltip label-class-name="t-dev" />
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 费用申请与购样 -->
        <div class="biz-module-v4 mt-20">
          <div class="m-header"><div class="m-title">费用申请与购样</div></div>
          <div class="spec-table-container">
            <el-table 
              :key="activeFeedbackNo"
              :data="feeAppList" 
              border 
              size="small" 
              class="final-spec-style-table" 
              :row-class-name="getRowClass"
              @cell-mouse-enter="(row: any) => setHighlight(row.no)"
              @cell-mouse-leave="clearHighlight"
            >
              <el-table-column label="申请基础" align="center" class-name="bg-base" label-class-name="t-base">
                <el-table-column type="index" label="序号" width="50" align="center" label-class-name="t-base" />
                <el-table-column prop="batch" label="费用申请批次" width="120" label-class-name="t-base" />
                <el-table-column prop="no" label="费用申请编号" width="150" label-class-name="t-base" />
                <el-table-column prop="channel" label="拿样渠道" width="100" align="center" label-class-name="t-base" />
                <el-table-column prop="refundable" label="是否可退款" width="100" align="center" label-class-name="t-base" />
              </el-table-column>
              <el-table-column label="样品详情" align="center" class-name="bg-purchase" label-class-name="t-purchase">
                <el-table-column prop="name" label="样品名称" min-width="180" show-overflow-tooltip label-class-name="t-purchase" />
                <el-table-column prop="qty" label="购样数量" width="80" align="center" label-class-name="t-purchase" />
                <el-table-column prop="moldFee" label="开模费" width="85" align="right" label-class-name="t-purchase" />
                <el-table-column prop="sampleFee" label="打样费" width="85" align="right" label-class-name="t-purchase" />
                <el-table-column prop="purchaseFee" label="购样费" width="85" align="right" label-class-name="t-purchase" />
              </el-table-column>
              <el-table-column label="申请状态" align="center" class-name="bg-dev" label-class-name="t-dev">
                <el-table-column prop="status" label="状态" width="100" align="center" label-class-name="t-dev" />
                <el-table-column prop="audit" label="审核结果" width="90" align="center" label-class-name="t-dev">
                  <template #default="{ row }"><span :class="{ 'text-success': row.audit === '同意' }">{{ row.audit }}</span></template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 样品登记库 -->
        <div class="biz-module-v4 mt-20">
          <div class="m-header"><div class="m-title">样品登记库</div></div>
          <div class="m-stats-cards-v4">
            <div class="ms-card"><el-icon class="ms-icon ic-total"><List /></el-icon><div class="ms-content"><span class="ms-label">样品总数</span><strong class="ms-value">{{ sampleList.length }}</strong></div></div>
            <div class="ms-card success"><el-icon class="ms-icon ic-success"><CircleCheckFilled /></el-icon><div class="ms-content"><span class="ms-label">有效样品</span><strong class="ms-value">{{ sampleList.filter(s=>s.isValid).length }}</strong></div></div>
            <div class="ms-card info"><el-icon class="ms-icon ic-info"><CircleClose /></el-icon><div class="ms-content"><span class="ms-label">无效样品</span><strong class="ms-value">{{ sampleList.filter(s=>!s.isValid).length }}</strong></div></div>
            <div class="ms-card warning" :class="{ 'is-shining': efficiencyStatus === 'normal' }"><el-icon class="ms-icon ic-warning"><Timer /></el-icon><div class="ms-content"><span class="ms-label">拿样历时</span><strong class="ms-value">6 <small>天</small></strong></div></div>
            <div class="ms-card danger"><el-icon class="ms-icon ic-danger"><Warning /></el-icon><div class="ms-content"><span class="ms-label">超时天数</span><strong class="ms-value">0 <small>天</small></strong></div></div>
          </div>
          <div class="spec-table-container">
            <el-table :data="sampleList" border size="small" class="final-spec-style-table" :row-class-name="getRowClass">
              <el-table-column label="关联归属" align="center" class-name="bg-base" label-class-name="t-base">
                <el-table-column type="index" label="序号" width="50" align="center" label-class-name="t-base" />
                <el-table-column prop="feedbackNo" label="反馈编号" width="150" label-class-name="t-base" />
                <el-table-column prop="feeNo" label="费用申请编号" width="160" label-class-name="t-base" />
                <el-table-column prop="sampleNo" label="样品编号" width="130" label-class-name="t-base" />
              </el-table-column>
              <el-table-column label="采集详情" align="center" class-name="bg-purchase" label-class-name="t-purchase">
                <el-table-column label="实物图" width="70" align="center" label-class-name="t-purchase">
                  <template #default="{ row }"><el-image :src="row.image" :preview-src-list="[row.image]" :preview-teleported="true" class="sample-mini-img" fit="cover" /></template>
                </el-table-column>
                <el-table-column prop="channel" label="拿样渠道" width="100" align="center" label-class-name="t-purchase" />
                <el-table-column prop="user" label="拿样人" width="90" align="center" label-class-name="t-purchase" />
                <el-table-column prop="name" label="样品名称" min-width="180" show-overflow-tooltip label-class-name="t-purchase" />
                <el-table-column prop="regTime" label="登记时间" width="140" align="center" label-class-name="t-purchase" />
              </el-table-column>
              <el-table-column label="入库状态" align="center" class-name="bg-dev" label-class-name="t-dev">
                <el-table-column prop="isValid" label="是否有效" width="90" align="center" label-class-name="t-dev">
                  <template #default="{ row }"><el-tag v-if="row.isValid" size="mini" type="success" effect="dark">有效</el-tag><el-tag v-else size="mini" type="info">无效</el-tag></template>
                </el-table-column>
                <el-table-column prop="status" label="样品状态" width="100" align="center" label-class-name="t-dev" />
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 任务结论 -->
        <div class="biz-module-v4 mt-20 conclusion-card">
          <div class="m-header"><div class="m-title">任务执行结论</div></div>
          <div class="conclusion-content">
             <div class="c-row">
               <div class="c-col"><label>关闭方式</label><span>{{ closeInfo.method }}</span></div>
               <div class="c-col"><label>执行确认人</label><span>{{ closeInfo.user }}</span></div>
               <div class="c-col"><label>完成日期</label><span>2026-04-25</span></div>
             </div>
             <div class="c-row mt-12"><div class="c-col full"><label>总结说明</label><p>{{ closeInfo.reason }}</p></div></div>
             <div class="conclusion-stamp">COMPLETED</div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, computed } from 'vue'
import { Management, Money, User, Timer, List, CircleCheckFilled, CircleClose, Warning } from '@element-plus/icons-vue'

const visible = ref(false)
const feedbackTableRef = ref()
const taskInfo = reactive({ no: '', name: '', priority: '', status: '', user: '', deadline: '' })

const handleOpened = () => { nextTick(() => { feedbackTableRef.value?.doLayout() }) }

// 1. 跨表联动逻辑
const activeFeedbackNo = ref('')
const setHighlight = (no: string) => { activeFeedbackNo.value = no }
const clearHighlight = () => { activeFeedbackNo.value = '' }
const getRowClass = ({ row }: { row: any }) => {
  if (!activeFeedbackNo.value) return ''
  return (row.feedbackNo === activeFeedbackNo.value || row.no === activeFeedbackNo.value) ? 'row-highlight-link' : ''
}

// 2. 模拟数据
const feedbackList = reactive([{
  no: 'Task-FB-202604060', user: '汪宇', date: '2026-04-22', source: '河北省-廊坊市', moldFee: '-', sampleFee: '80', quote: '60', customCycle: '15', prodCycle: '30', moq: '1000', refundable: '是', remark: '', result: '采纳', devStatus: '已完成', devTime: '2026-04-23 14:20', devRemark: '符合 D 级标准。'
}])
const feeAppList = reactive([{ batch: 'GYSQPC260187', no: 'FeeApp-202604220003', channel: '供应商', refundable: '是', name: '厨房收纳架', qty: 1, moldFee: '-', sampleFee: '80', purchaseFee: '-', status: '样品待登记', audit: '同意' }])
const sampleList = reactive([{ feedbackNo: 'Task-FB-202604060', feeNo: 'FeeApp-202604220003', sampleNo: 'S20260422-01', channel: '供应商', user: '汪宇', name: '厨房收纳架', image: 'https://picsum.photos/200/200?random=20', regTime: '2026-04-23 10:00', isValid: true, status: '已入库' }])
const efficiencyStatus = computed(() => 'normal')
const closeInfo = reactive({ method: '正常关闭', user: '谢东桥', reason: '样品在材质耐用性与初始报价上最具优势。' })

const open = (data: any) => { if (data) Object.assign(taskInfo, data); visible.value = true; }
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

.task-main-v4 { 
  padding: 24px; 
  background-color: $bg-main; 
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* 1. 顶部看板重塑：更像现代仪表盘 */
.perspective-stats {
  display: grid; 
  grid-template-columns: repeat(4, 1fr); 
  gap: 20px; 
  margin-bottom: 24px;
  
  .p-stat-card {
    background: #fff; 
    border-radius: 16px; 
    padding: 20px; 
    display: flex; 
    align-items: center; 
    gap: 20px; 
    border: 1px solid rgba(0,0,0,0.03);
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.06); }

    .p-icon { 
      width: 52px; height: 52px; border-radius: 14px; 
      display: flex; align-items: center; justify-content: center; 
      font-size: 24px;
      &.ic-stage { background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%); color: #096dd9; } 
      &.ic-fee { background: linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%); color: #cf1322; } 
      &.ic-user { background: linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%); color: #531dab; } 
      &.ic-time { background: linear-gradient(135deg, #fffbe6 0%, #ffe58f 100%); color: #d48806; } 
    }
    
    .p-info {
      .p-label { font-size: 13px; color: $text-light; margin-bottom: 4px; font-weight: 500; }
      .p-value { 
        font-size: 18px; font-weight: 700; color: $text-title;
        &.price { color: $danger; font-family: 'DIN Alternate', 'Helvetica Neue', sans-serif; } 
        &.countdown { color: $warning; font-family: 'DIN Alternate', 'Helvetica Neue', sans-serif; } 
      }
    }
  }
}

/* 2. 业务模块容器优化 */
.biz-module-v4 {
  background: #fff; 
  border-radius: 16px; 
  padding: 24px; 
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 2px 12px rgba(0,0,0,0.02);
  margin-bottom: 24px;

  .m-header { 
    margin-bottom: 20px; 
    .m-title { 
      font-size: 16px; font-weight: 700; color: $text-title; 
      display: flex; align-items: center; gap: 10px;
      &::before { 
        content: ''; width: 4px; height: 18px; 
        background: linear-gradient(to bottom, $primary, #69c0ff); 
        border-radius: 2px; 
      } 
    } 
  }
}

/* 3. 样品指标卡片：统一视觉语言 */
.m-stats-cards-v4 {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin: 0 0 24px 0;
  .ms-card {
    background: #fff; border: 1px solid #f0f0f0; border-radius: 12px; padding: 16px; 
    display: flex; align-items: center; gap: 14px; transition: all 0.3s;
    
    .ms-icon { 
      width: 36px; height: 36px; border-radius: 8px; font-size: 18px;
      background: #f5f5f5; color: #595959; display: flex; align-items: center; justify-content: center;
    }
    .ms-content {
       .ms-label { font-size: 12px; color: $text-light; display: block; margin-bottom: 2px; }
       .ms-value { font-size: 20px; font-weight: 700; color: $text-title; small { font-size: 12px; font-weight: 400; color: $text-light; margin-left: 2px; } }
    }
    
    &.success { background: #f6ffed; border-color: #d9f7be; .ms-icon { color: $success; background: #fff; } }
    &.warning { background: #fff7e6; border-color: #ffe7ba; .ms-icon { color: $warning; background: #fff; } }
    &.danger { background: #fff1f0; border-color: #ffccc7; .ms-icon { color: $danger; background: #fff; } }
    &.is-shining { box-shadow: 0 0 15px rgba($primary, 0.15); border-color: $primary; }
  }
}

/* 4. 表格：极致专业感 */
.spec-table-container { border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; }
.final-spec-style-table {
  --el-table-border-color: #f0f0f0;
  
  :deep(.el-table__header-wrapper) {
    th {
      height: 48px !important; background-color: #fafafa !important; 
      font-weight: 600; color: $text-title;
      border-bottom: 1px solid #f0f0f0 !important;
      
      // 核心改动：用顶部彩线区分逻辑
      &.bg-base { border-top: 3px solid #adc6ff !important; }
      &.bg-purchase { border-top: 3px solid #ffd591 !important; }
      &.bg-dev { border-top: 3px solid #b7eb8f !important; }
      
      &.t-base .cell { color: #1d39c4 !important; }
      &.t-purchase .cell { color: #d46b08 !important; }
      &.t-dev .cell { color: #389e0d !important; }
    }
  }

  :deep(.el-table__row) {
    td { height: 44px !important; transition: background-color 0.2s; }
    &:hover td { background-color: #fafafa !important; }
  }
  
  :deep(table) { table-layout: fixed !important; border-collapse: separate !important; border-spacing: 0 !important; }
}

/* 5. 联动高亮：专业蓝 (加强选择器权重，确保盖过 bg-base 等) */
:deep(.el-table__row.row-highlight-link) { 
  td { 
    background-color: #e6f7ff !important; 
    border-top: 1px solid #91d5ff !important; 
    border-bottom: 1px solid #91d5ff !important; 
    transition: all 0.2s;
    
    // 强制覆盖单元格内部原本的背景色
    &.bg-base, &.bg-purchase, &.bg-dev {
      background-color: #e6f7ff !important;
    }
  }
  &:hover td { background-color: #d1e9ff !important; }
}

/* 6. 结论区：水印化结案感 */
.conclusion-card {
  .conclusion-content {
    background: #fafafa; border: 1px dashed #d9d9d9; border-radius: 12px; padding: 30px; position: relative;
    .c-row { display: flex; gap: 40px; }
    .c-col {
      label { display: block; color: $text-light; font-size: 13px; margin-bottom: 8px; }
      span, p { font-size: 15px; color: $text-title; font-weight: 600; margin: 0; line-height: 1.6; }
      &.full { flex: 1; }
    }
    .conclusion-stamp { 
      position: absolute; font-size: 56px; font-weight: 900;
      color: rgba($success, 0.08); 
      border: 6px double rgba($success, 0.08);
      padding: 4px 20px; border-radius: 12px;
      right: 60px; top: 20px; transform: rotate(-15deg);
      pointer-events: none; text-transform: uppercase;
    }
  }
}

.sample-mini-img { width: 36px; height: 36px; border-radius: 6px; border: 1px solid #eee; transition: transform 0.2s; &:hover { transform: scale(1.1); } }
.res-mini-tag { padding: 2px 8px; border-radius: 4px; font-size: 12px; background: #f5f5f5; color: $text-light; &.is-ok { background: $success; color: #fff; } }

/* 抽屉头部优化 */
.task-drawer-header-v4 {
  display: flex; justify-content: space-between; align-items: center; width: 100%; padding-right: 32px;
  .title-main {
    display: flex; align-items: center; gap: 16px;
    .title-tag { padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 800; color: #fff; &.P0 { background: $danger; } &.P1 { background: $warning; } }
    .title-text { font-size: 20px; font-weight: 700; color: $text-title; letter-spacing: -0.5px; }
    .title-id { font-size: 14px; color: $text-light; font-family: monospace; }
  }
  .status-pill { 
    padding: 5px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; 
    background: #fff; border: 1px solid $primary; color: $primary;
    &.已完成 { border-color: $success; color: $success; }
  }
}

.text-success { color: $success; font-weight: 700; }
.mt-20 { margin-top: 20px; }
</style>