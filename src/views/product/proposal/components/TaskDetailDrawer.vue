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
              ref="feedbackTableRef"
              :data="feedbackList" 
              border 
              size="small"
              class="final-spec-style-table"
              style="width: 100%"
            >
              <!-- 组 1：基础归属 -->
              <el-table-column label="基础归属" align="center" class-name="bg-base">
                <el-table-column type="index" label="序号" width="50" align="center" label-class-name="t-base" />
                <el-table-column prop="no" label="反馈编号" width="160" align="center" label-class-name="t-base" />
                <el-table-column prop="user" label="采购员" width="90" align="center" label-class-name="t-base" />
                <el-table-column prop="date" label="反馈日期" width="110" align="center" label-class-name="t-base" />
              </el-table-column>

              <!-- 组 2：采购反馈详情 -->
              <el-table-column label="采购反馈详情" align="center" class-name="bg-purchase">
                <el-table-column prop="source" label="货源地" width="140" show-overflow-tooltip label-class-name="t-purchase" />
                <el-table-column prop="moldFee" label="开模费" width="90" align="right" label-class-name="t-purchase" />
                <el-table-column prop="sampleFee" label="打样费" width="90" align="right" label-class-name="t-purchase" />
                <el-table-column prop="quote" label="初始报价" width="90" align="right" label-class-name="t-purchase" />
                <el-table-column prop="customCycle" label="定制周期" width="80" align="center" label-class-name="t-purchase" />
                <el-table-column prop="prodCycle" label="生产周期" width="80" align="center" label-class-name="t-purchase" />
                <el-table-column prop="moq" label="起订量" width="90" align="center" label-class-name="t-purchase" />
                <el-table-column prop="refundable" label="是否可退款" width="100" align="center" label-class-name="t-purchase" />
              </el-table-column>
              
              <el-table-column label="开发反馈信息" align="center" class-name="bg-dev">
                <el-table-column prop="result" label="反馈结果" width="100" align="center" label-class-name="t-dev">
                  <template #default="{ row }">
                    <span class="res-mini-tag" :class="{ 'is-ok': row.result === '采纳' }">{{ row.result }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="devStatus" label="反馈状态" width="90" align="center" label-class-name="t-dev" />
                <el-table-column prop="devTime" label="反馈时间" width="145" align="center" label-class-name="t-dev" />
                <!-- 注意：最后一列也必须写死宽度，绝对不能 min-width，这是对齐的关键 -->
                <el-table-column prop="devRemark" label="反馈说明" width="280" show-overflow-tooltip label-class-name="t-dev" />
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 费用申请模块 -->
        <div class="biz-module-v4 mt-20">
          <div class="m-header"><div class="m-title">费用申请与购样</div></div>
          <el-table :data="feeAppList" border size="small" class="final-spec-style-table" style="width: 100%">
            <el-table-column type="index" label="序号" width="50" align="center" />
            <el-table-column prop="batch" label="申请批次" width="130" />
            <el-table-column prop="no" label="单据编号" width="160" />
            <el-table-column prop="name" label="样品名称" width="180" show-overflow-tooltip />
            <el-table-column prop="moldFee" label="开模" width="90" align="right" />
            <el-table-column prop="sampleFee" label="打样" width="90" align="right" />
            <el-table-column prop="purchaseFee" label="购样" width="90" align="right" />
            <el-table-column prop="status" label="状态" width="100" align="center" />
            <el-table-column prop="audit" label="审核" width="80" align="center" label-class-name="t-base">
              <template #default="{ row }"><span :class="{ 'text-success': row.audit === '同意' }">{{ row.audit }}</span></template>
            </el-table-column>
          </el-table>
          <div class="summary-line-v4">
            <span class="lab">费用汇总：</span>
            <span class="val">¥ 125.00</span>
          </div>
        </div>

        <!-- 样品库模块 -->
        <div class="biz-module-v4 mt-20">
          <div class="m-header"><div class="m-title">样品登记库</div></div>
          <el-table :data="sampleList" border size="small" class="final-spec-style-table" style="width: 100%">
            <el-table-column type="index" label="序号" width="50" align="center" />
            <el-table-column prop="sampleNo" label="样品编号" width="140" />
            <el-table-column prop="name" label="样品名称" width="220" />
            <el-table-column prop="user" label="拿样人" width="100" align="center" />
            <el-table-column prop="regTime" label="登记时间" width="150" align="center" />
            <el-table-column prop="isValid" label="有效性" width="90" align="center">
              <template #default="{ row }"><el-tag v-if="row.isValid" size="mini" type="success">有效</el-tag></template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="110" align="center" />
          </el-table>
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
import { ref, reactive, nextTick } from 'vue'
import { Management, Money, User, Timer } from '@element-plus/icons-vue'

const visible = ref(false)
const feedbackTableRef = ref()
const taskInfo = reactive({ no: '', name: '', priority: '', status: '', user: '', deadline: '' })

const handleOpened = () => {
  nextTick(() => {
    feedbackTableRef.value?.doLayout()
  })
}

const feedbackList = reactive([{
  no: 'Task-FB-202604060', user: '汪宇', date: '2026-04-22', source: '河北省-廊坊市',
  moldFee: '-', sampleFee: '80', quote: '60', customCycle: '15', prodCycle: '30',
  moq: '1000', refundable: '是', result: '采纳',
  devStatus: '已完成', devTime: '2026-04-23 14:20', devRemark: '样品工艺符合 D 级标准，成本控制在预期范围内。'
}])

const feeAppList = reactive([{
  batch: 'GYSQPC260187', no: 'FeeApp-202604220003', user: '汪宇', channel: '供应商',
  refundable: '是', name: '厨房收纳架', qty: 1, moldFee: '-', sampleFee: '80',
  purchaseFee: '-', status: '样品待登记', audit: '同意'
}])

const sampleList = reactive([{
  sampleNo: 'S20260422-01', name: '厨房收纳架', user: '汪宇', regTime: '2026-04-23 10:00',
  isValid: true, status: '已入库'
}])

const closeInfo = reactive({ method: '正常关闭', user: '谢东桥', reason: '经多维度对比，该样品在材质耐用性与初始报价上最具优势。' })

const open = (data: any) => { if (data) Object.assign(taskInfo, data); visible.value = true; }
defineExpose({ open })
</script>

<style lang="scss" scoped>
.task-main-v4 { padding: 20px; background-color: #f0f2f5; min-height: 100vh; }

.perspective-stats {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px;
  .p-stat-card {
    background: #fff; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    .p-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; &.ic-stage { background: #e6f7ff; color: #1890ff; } &.ic-fee { background: #fff1f0; color: #f5222d; } &.ic-user { background: #f9f0ff; color: #722ed1; } &.ic-time { background: #fffbe6; color: #faad14; } }
    .p-label { font-size: 12px; color: #8c8c8c; margin-bottom: 4px; }
    .p-value { font-size: 16px; font-weight: 700; color: #262626; &.price { color: #f5222d; } &.countdown { color: #fa8c16; font-family: 'DIN Alternate', sans-serif; } }
  }
}

.biz-module-v4 {
  background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  .m-header { margin-bottom: 16px; .m-title { font-size: 15px; font-weight: 800; color: #262626; display: flex; align-items: center; gap: 8px; &::before { content: ''; width: 4px; height: 16px; background: #1890ff; border-radius: 2px; } } }
}

/* 核心：复刻“定品属性表”对齐逻辑的 CSS 补丁 */
.spec-table-container {
  border: 1px solid #d9d9d9; border-radius: 4px; overflow: hidden;
}

.final-spec-style-table {
  /* 强制禁用所有可能导致偏移的内置间距 */
  --el-table-border-color: #d9d9d9;
  --el-table-header-bg-color: #f8f9fb;

  :deep(.el-table__header-wrapper) {
    th {
      height: 38px !important; padding: 0 !important; font-size: 12px; font-weight: bold; color: #262626 !important;
      border-bottom: 1px solid #d9d9d9 !important; border-right: 1px solid #d9d9d9 !important;
      &.bg-base { background-color: #f0f5ff !important; }
      &.bg-purchase { background-color: #fff7e6 !important; }
      &.bg-dev { background-color: #f6ffed !important; }
    }
  }

  /* 子列文字颜色：与所属组的主题背景色保持一致（深色系化以确保可读性） */
  :deep(.t-base) { .cell { color: #003a8c !important; } }      /* 基础组：深蓝色 */
  :deep(.t-purchase) { .cell { color: #873800 !important; } }  /* 采购组：深褐色 */
  :deep(.t-dev) { .cell { color: #135200 !important; } }       /* 开发组：深绿色 */

  :deep(.el-table__row) {
    td { height: 38px !important; padding: 0 !important; border-right: 1px solid #f0f0f0 !important; }
  }

  /* 对齐必杀技：锁定表格布局算法，并禁止浏览器自行调整 */
  :deep(.el-table__header), :deep(.el-table__body) {
    width: 100% !important;
    table-layout: fixed !important;
    border-collapse: separate !important;
    border-spacing: 0 !important;
  }

  /* 彻底移除 gutter 造成的表头 1px 漂移 */
  :deep(.gutter) { display: none !important; width: 0 !important; }
  :deep(col[name="gutter"]) { display: none !important; width: 0 !important; }

  .res-mini-tag {
    font-size: 11px; font-weight: bold; color: #8c8c8c; background: #f5f5f5; padding: 2px 8px; border-radius: 2px; border: 1px solid #d9d9d9;
    &.is-ok { color: #52c41a; background: #f6ffed; border-color: #b7eb8f; }
  }
}

.summary-line-v4 { margin-top: 16px; padding: 12px 20px; background: #fcfcfd; border-radius: 8px; border: 1px dashed #e8e8e8; display: flex; align-items: center; justify-content: flex-end; gap: 8px; .lab { font-size: 13px; color: #595959; } .val { font-size: 18px; font-weight: 800; color: #f5222d; } }
.stats-line-v4 { justify-content: center; gap: 40px; .s-item { font-size: 13px; color: #8c8c8c; display: flex; align-items: center; gap: 8px; strong { color: #262626; font-size: 18px; font-family: monospace; } } }
.conclusion-card { position: relative; overflow: hidden; .conclusion-content { background: #fdfdfe; border: 2px solid #f0f0f0; border-radius: 8px; padding: 24px; position: relative; .c-row { display: flex; gap: 32px; } .c-col { display: flex; flex-direction: column; gap: 6px; label { font-size: 12px; color: #bfbfbf; text-transform: uppercase; } span { font-size: 14px; font-weight: 600; color: #262626; } p { font-size: 13px; color: #595959; line-height: 1.6; margin: 0; } &.full { flex: 1; } } .conclusion-stamp { position: absolute; right: 40px; top: 10px; font-size: 32px; font-weight: 900; color: rgba(82, 196, 26, 0.15); border: 4px double rgba(82, 196, 26, 0.15); padding: 4px 12px; transform: rotate(-15deg); border-radius: 8px; pointer-events: none; } } }
.task-drawer-header-v4 { display: flex; justify-content: space-between; align-items: center; width: 100%; padding-right: 30px; .title-main { display: flex; align-items: center; gap: 12px; .title-tag { padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 900; color: #fff; &.P0 { background: #f5222d; } &.P1 { background: #fa8c16; } } .title-text { font-size: 18px; font-weight: 800; color: #262626; } .title-id { font-size: 13px; color: #bfbfbf; font-family: monospace; } } .status-pill { padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; background: #e6f7ff; color: #1890ff; &.已完成 { background: #f6ffed; color: #52c41a; } } }
.text-success { color: #52c41a; font-weight: bold; }
.mt-20 { margin-top: 20px; }
</style>
