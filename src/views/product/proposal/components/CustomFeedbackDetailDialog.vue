<template>
  <el-dialog
    v-model="visible"
    width="1200px"
    class="custom-feedback-detail-dialog"
    destroy-on-close
    align-center
  >
    <template #header>
      <div class="dialog-header-custom">
        <span class="title-main">定制任务 & 采购承接反馈明细</span>
        <span class="proposal-no-badge" v-if="taskInfo.proposalNo">{{ taskInfo.proposalNo }}</span>
      </div>
    </template>

    <div class="dialog-container left-right-layout">
      <!-- 左侧：定制任务内容 -->
      <div class="left-pane custom-scrollbar">

        <!-- Logo 区域 -->
        <div class="logo-area">
          <div class="logo-placeholder">
            <el-icon class="logo-icon"><Picture /></el-icon>
            <span class="logo-hint">产品主图</span>
          </div>
          <div class="logo-meta">
            <span class="logo-title">{{ taskInfo.productName || 'ZZ-定制产品' }}</span>
            <el-tag size="small" type="warning" effect="dark" class="logo-tag">定制拿样</el-tag>
          </div>
        </div>

        <div class="pane-divider"></div>

        <div class="task-info-vertical">
          <div class="info-row">
            <span class="label">运营大类：</span>
            <span class="value">{{ taskInfo.category || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label">底线采购价：</span>
            <span class="value highlight-price">{{ taskInfo.bottomLinePrice || '32 CNY' }}</span>
          </div>
          <div class="info-row">
            <span class="label">期望定制周期：</span>
            <span class="value">{{ taskInfo.customCycle || '7天' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Logo 位置：</span>
            <span class="value">{{ taskInfo.logoPosition || '-' }}</span>
          </div>

          <!-- 反馈截止时间 + 倒计时 -->
          <div class="info-row deadline-row">
            <span class="label">反馈截止：</span>
            <div class="deadline-block">
              <span class="deadline-date">{{ taskInfo.feedbackDeadline || '-' }}</span>
              <div class="countdown-chips" v-if="feedbackCountdown">
                <span class="chip" :class="{ urgent: feedbackCountdown.urgent }">{{ feedbackCountdown.days }}天</span>
                <span class="chip" :class="{ urgent: feedbackCountdown.urgent }">{{ feedbackCountdown.hours }}时</span>
                <span class="chip" :class="{ urgent: feedbackCountdown.urgent }">{{ feedbackCountdown.minutes }}分</span>
                <span class="chip" :class="{ urgent: feedbackCountdown.urgent }">{{ feedbackCountdown.seconds }}秒</span>
              </div>
              <el-tag v-else-if="taskInfo.feedbackDeadline" size="small" type="info">已截止</el-tag>
            </div>
          </div>

          <!-- 任务截止时间 + 倒计时 -->
          <div class="info-row deadline-row border-none">
            <span class="label">任务截止：</span>
            <div class="deadline-block">
              <span class="deadline-date">{{ taskInfo.taskDeadline || '-' }}</span>
              <div class="countdown-chips" v-if="taskCountdown">
                <span class="chip" :class="{ urgent: taskCountdown.urgent }">{{ taskCountdown.days }}天</span>
                <span class="chip" :class="{ urgent: taskCountdown.urgent }">{{ taskCountdown.hours }}时</span>
                <span class="chip" :class="{ urgent: taskCountdown.urgent }">{{ taskCountdown.minutes }}分</span>
                <span class="chip" :class="{ urgent: taskCountdown.urgent }">{{ taskCountdown.seconds }}秒</span>
              </div>
              <el-tag v-else-if="taskInfo.taskDeadline" size="small" type="danger">已截止</el-tag>
            </div>
          </div>
        </div>

        <div class="pane-divider"></div>

        <div class="supp-section">
          <div class="section-label">补充说明</div>
          <div class="section-value">
            {{ taskInfo.supplementaryRequirement || '请重点确认魔术贴的使用寿命，以及边缘缝线是否容易脱落。' }}
          </div>
        </div>

        <div class="attach-section mt-16">
          <div class="section-label">产品规格书</div>
          <div class="attach-list">
            <div v-for="(file, idx) in taskInfo.designFiles" :key="idx" class="file-chip">
              <el-icon class="file-icon"><Document /></el-icon>
              <div class="file-info">
                <span class="file-name" :title="file.name">{{ file.name }}</span>
                <span class="file-meta">{{ file.uploader }} · {{ file.date }}</span>
              </div>
            </div>
            <div v-if="!taskInfo.designFiles || taskInfo.designFiles.length === 0" class="file-chip">
              <el-icon class="file-icon"><Document /></el-icon>
              <div class="file-info">
                <span class="file-name">亲肤腰带-隐身薄款(市调).20260416.xlsx</span>
                <span class="file-meta">设计一组 · 2026-04-20</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：采购反馈对比列表 -->
      <div class="right-pane">
        <div class="pane-title">
          <el-icon class="title-icon"><Management /></el-icon>
          <span>采购承接反馈对比列表</span>
          <span class="subtitle-desc ml-12">一个定制任务存在多个采购承接反馈方案</span>
        </div>

        <div class="feedback-table-wrapper">
          <el-table
            :data="feedbackList"
            border
            stripe
            size="small"
            class="premium-table"
            header-cell-class-name="premium-header"
            row-class-name="premium-row"
            height="100%"
          >
            <el-table-column label="反馈编号" prop="code" width="135">
              <template #default="{ row }">
                <span class="code-text">{{ row.code }}</span>
              </template>
            </el-table-column>
            
            <el-table-column label="反馈日期" prop="date" width="95" align="center" />
            
            <el-table-column label="反馈人" prop="user" width="90" align="center">
              <template #default="{ row }">
                <div class="user-cell">
                  <el-avatar :size="20" class="mr-4">{{ row.user.charAt(0) }}</el-avatar>
                  <span>{{ row.user }}</span>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="货源地" prop="source" width="100" align="center">
              <template #default="{ row }">
                <el-tag size="small" type="info" effect="light">{{ row.source }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="费用类型" prop="feeType" width="85" align="center" />
            <el-table-column label="费用" prop="fee" width="90" align="right">
              <template #default="{ row }">
                <span class="fee-text font-bold">{{ row.fee }}</span>
              </template>
            </el-table-column>

            <el-table-column label="是否可退" prop="isRefundable" width="80" align="center">
              <template #default="{ row }">
                <el-tag size="small" :type="row.isRefundable === '是' ? 'success' : 'danger'" effect="plain">
                  {{ row.isRefundable }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="退款条件" prop="refundCondition" width="150" show-overflow-tooltip>
              <template #default="{ row }">
                <span :class="{ 'text-secondary': row.isRefundable === '否' }">
                  {{ row.refundCondition }}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="初次报价" prop="initialQuote" width="90" align="right">
              <template #default="{ row }">
                <span class="price-text">{{ row.initialQuote }}</span>
              </template>
            </el-table-column>
            <el-table-column label="生产周期" prop="productionCycle" width="85" align="center">
              <template #default="{ row }">
                <span class="cycle-text">{{ row.productionCycle }}</span>
              </template>
            </el-table-column>
            <el-table-column label="定制用时" prop="customDuration" width="85" align="center">
              <template #default="{ row }">
                <span class="duration-text">{{ row.customDuration }}</span>
              </template>
            </el-table-column>
            <el-table-column label="起订量" prop="moq" width="75" align="center" />
            
            <el-table-column label="附加条件" prop="additionalConditions" min-width="140" show-overflow-tooltip />
            
            <el-table-column label="备注说明" prop="notes" min-width="170" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.notes || '-' }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="160" align="center">
              <template #default="{ row }">
                <template v-if="row.isAdopted === '待决策'">
                  <el-button type="primary" link size="small" @click="handleAdopt(row)">采纳</el-button>
                  <el-button type="danger" link size="small" @click="handleNotAdopt(row)">不采纳</el-button>
                  <el-button type="warning" link size="small" @click="handleReject(row)">驳回</el-button>
                </template>
                <template v-else-if="row.isAdopted === '已采纳'">
                  <el-tag size="small" type="success" effect="dark">已采纳</el-tag>
                </template>
                <template v-else-if="row.isAdopted === '不采纳'">
                  <el-tag size="small" type="info" effect="dark">不采纳</el-tag>
                </template>
                <template v-else-if="row.isAdopted === '已驳回'">
                  <el-tag size="small" type="warning" effect="dark">已驳回</el-tag>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">关 闭</el-button>
        <el-button type="primary" @click="visible = false">确认完毕</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { InfoFilled, Management, Document, Picture } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const visible = ref(false)
const taskInfo = ref<any>({})
const feedbackList = ref<any[]>([])

// 倒计时
const feedbackCountdown = ref<any>(null)
const taskCountdown = ref<any>(null)
let countdownTimer: ReturnType<typeof setInterval> | null = null

const calcCountdown = (dateStr: string) => {
  const target = new Date(dateStr).getTime()
  const now = Date.now()
  const diff = target - now
  if (diff <= 0) return null
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds, urgent: diff < 86400000 }
}

const startCountdown = () => {
  if (countdownTimer) clearInterval(countdownTimer)
  const tick = () => {
    feedbackCountdown.value = taskInfo.value.feedbackDeadline ? calcCountdown(taskInfo.value.feedbackDeadline) : null
    taskCountdown.value = taskInfo.value.taskDeadline ? calcCountdown(taskInfo.value.taskDeadline) : null
  }
  tick()
  countdownTimer = setInterval(tick, 1000)
}

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

// 模拟不同任务反馈数据的生成器
const getMockFeedbacks = (proposalNo: string) => {
  const num = parseInt(proposalNo.replace(/\D/g, '')) || 0
  const randomSeed = num % 3

  if (randomSeed === 0) {
    return [
      {
        code: 'FB-20260424-001',
        date: '2026-04-24',
        user: '李强',
        source: '浙江义乌',
        feeType: '打样费',
        fee: '¥ 150.00',
        isRefundable: '是',
        refundCondition: '首单达到1000件返还',
        initialQuote: '¥ 32.00',
        productionCycle: '10 天',
        customDuration: '5 天',
        moq: '1000',
        additionalConditions: '含增值税专票，包邮',
        isAdopted: '已采纳',
        notes: '打样板质量优良，魔术贴抗拉强度高，缝线牢固，推荐采纳'
      },
      {
        code: 'FB-20260425-002',
        date: '2026-04-25',
        user: '张华',
        source: '广东深圳',
        feeType: '开模费',
        fee: '¥ 3000.00',
        isRefundable: '否',
        refundCondition: '-',
        initialQuote: '¥ 29.50',
        productionCycle: '15 天',
        customDuration: '8 天',
        moq: '2000',
        additionalConditions: '需首付50%模具费',
        isAdopted: '已驳回',
        notes: '模具费用较高，且起订量要求大，周期较长，不作为首选'
      }
    ]
  } else if (randomSeed === 1) {
    return [
      {
        code: 'FB-20260502-001',
        date: '2026-05-02',
        user: '王健',
        source: '江苏常州',
        feeType: '打样费',
        fee: '¥ 200.00',
        isRefundable: '是',
        refundCondition: '首单订货金额满1万退还',
        initialQuote: '¥ 18.50',
        productionCycle: '8 天',
        customDuration: '4 天',
        moq: '500',
        additionalConditions: '不含税，运费到付',
        isAdopted: '待决策',
        notes: ''
      },
      {
        code: 'FB-20260503-002',
        date: '2026-05-03',
        user: '吴美林',
        source: '福建厦门',
        feeType: '无',
        fee: '免费',
        isRefundable: '否',
        refundCondition: '-',
        initialQuote: '¥ 22.00',
        productionCycle: '12 天',
        customDuration: '6 天',
        moq: '1000',
        additionalConditions: '提供免费设计微调服务',
        isAdopted: '已采纳',
        notes: '打样免费，厂家实力强，虽然单价略高，但整体质量非常符合要求'
      },
      {
        code: 'FB-20260504-003',
        date: '2026-05-04',
        user: '赵铁柱',
        source: '河北廊坊',
        feeType: '打样费',
        fee: '¥ 100.00',
        isRefundable: '是',
        refundCondition: '首单即退',
        initialQuote: '¥ 21.00',
        productionCycle: '14 天',
        customDuration: '7 天',
        moq: '800',
        additionalConditions: '含税13%专票',
        isAdopted: '已驳回',
        notes: '生产周期较慢，不满足紧急上架需求'
      }
    ]
  } else {
    return [
      {
        code: 'FB-20260510-001',
        date: '2026-05-10',
        user: '汪宇',
        source: '河北省-廊坊市',
        feeType: '打样费',
        fee: '¥ 80.00',
        isRefundable: '是',
        refundCondition: '首单满800件退还',
        initialQuote: '¥ 60.00',
        productionCycle: '30 天',
        customDuration: '15 天',
        moq: '1000',
        additionalConditions: '含外包装设计',
        isAdopted: '已采纳',
        notes: '各方面测试反馈完美，打样费极低，满足提案标准，确定采纳'
      }
    ]
  }
}

const open = (row: any) => {
  taskInfo.value = {
    proposalNo: row.proposalNo || '',
    productName: row.productName || 'ZZ-定制产品',
    manager: row.manager || '杨登峰',
    category: row.category || '',
    status: row.status || '拿样中',
    date: row.date || '2026-06-08',
    bottomLinePrice: row.bottomLinePrice || '32 CNY',
    customCycle: row.customCycle || '10天',
    logoPosition: row.logoPosition || '无',
    supplementaryRequirement: row.supplementaryRequirement || '请重点确认魔术贴的使用寿命，以及边缘缝线是否容易脱落。',
    designFiles: row.designFiles || [],
    feedbackDeadline: row.feedbackDeadline || '2026-06-15 18:00:00',
    taskDeadline: row.taskDeadline || '2026-06-30 23:59:59'
  }

  feedbackList.value = getMockFeedbacks(taskInfo.value.proposalNo)
  startCountdown()
  visible.value = true
}

// 采纳操作
const handleAdopt = (row: any) => {
  ElMessageBox.prompt(
    `请输入采纳方案【${row.code}】的开发反馈说明：`,
    '确认采纳',
    {
      confirmButtonText: '确定采纳',
      cancelButtonText: '取消',
      inputPlaceholder: '请填写采纳理由说明，例如：样品符合设计规格，且报价具有较高性价比，满足上架计划。',
      inputValidator: (val) => {
        if (!val || !val.trim()) {
          return '开发反馈说明不能为空'
        }
        return true
      },
      buttonSize: 'small'
    }
  ).then(({ value }) => {
    feedbackList.value.forEach(item => {
      if (item.code === row.code) {
        item.isAdopted = '已采纳'
        item.notes = value
      } else {
        item.isAdopted = '不采纳'
        if (item.isAdopted === '待决策') {
          item.notes = '未被采纳'
        }
      }
    })
    ElMessage.success(`方案【${row.code}】已成功采纳！`)
  }).catch(() => {})
}

// 不采纳操作
const handleNotAdopt = (row: any) => {
  ElMessageBox.prompt(
    `请输入不采纳方案【${row.code}】的开发反馈说明：`,
    '确认不采纳',
    {
      confirmButtonText: '确定不采纳',
      cancelButtonText: '取消',
      inputPlaceholder: '请填写不采纳理由说明，例如：不符合设计规格 / 预算超标。',
      inputValidator: (val) => {
        if (!val || !val.trim()) {
          return '不采纳原因说明不能为空'
        }
        return true
      },
      buttonSize: 'small'
    }
  ).then(({ value }) => {
    row.isAdopted = '不采纳'
    row.notes = value
    ElMessage.success(`方案【${row.code}】已设定为“不采纳”`)
  }).catch(() => {})
}

// 驳回操作
const handleReject = (row: any) => {
  ElMessageBox.prompt(
    `请输入驳回方案【${row.code}】的开发反馈原因：`,
    '确认驳回',
    {
      confirmButtonText: '确定驳回',
      cancelButtonText: '取消',
      inputPlaceholder: '请填写驳回原因说明，例如：方案信息不全，需采购重新核实后提交。',
      inputValidator: (val) => {
        if (!val || !val.trim()) {
          return '驳回原因说明不能为空'
        }
        return true
      },
      buttonSize: 'small'
    }
  ).then(({ value }) => {
    row.isAdopted = '已驳回'
    row.notes = value
    ElMessage.success(`方案【${row.code}】已驳回`)
  }).catch(() => {})
}

defineExpose({ open })
</script>

<style lang="scss">
.custom-feedback-detail-dialog {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 12px 32px 4px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(0, 0, 0, 0.04);

  .el-dialog__header {
    margin-right: 0;
    padding: 14px 20px;
    border-bottom: 1px solid #f1f5f9;
  }

  .el-dialog__body {
    padding: 0 !important;
    background-color: #f8f9fb;
  }
}

.dialog-header-custom {
  display: flex;
  align-items: center;
  gap: 12px;

  .title-main {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
  }

  .proposal-no-badge {
    background-color: #e0f2fe;
    color: #0369a1;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 12px;
    border: 1px solid #bae6fd;
    font-family: monospace;
  }
}

/* 左右分栏布局 */
.left-right-layout {
  display: flex;
  gap: 16px;
  height: 620px;
  padding: 16px 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.left-pane {
  width: 380px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  overflow-y: auto;
  box-sizing: border-box;
}

/* Logo 区域 */
.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  .logo-placeholder {
    width: 72px;
    height: 72px;
    border-radius: 8px;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border: 1px dashed #cbd5e1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    flex-shrink: 0;
    cursor: pointer;
    transition: border-color 0.2s;

    &:hover {
      border-color: #3b82f6;
    }

    .logo-icon {
      font-size: 22px;
      color: #94a3b8;
    }

    .logo-hint {
      font-size: 10px;
      color: #94a3b8;
    }
  }

  .logo-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow: hidden;

    .logo-title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .logo-tag {
      align-self: flex-start;
    }
  }
}

/* 截止时间行 */
.deadline-row {
  flex-direction: column !important;
  align-items: flex-start !important;
  gap: 4px;
  padding: 8px 12px !important;

  .label {
    font-size: 11px;
    color: #94a3b8 !important;
  }
}

.deadline-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  width: 100%;

  .deadline-date {
    font-size: 11px;
    color: #334155;
    font-family: monospace;
    flex-shrink: 0;
  }
}

/* 倒计时 chips */
.countdown-chips {
  display: flex;
  gap: 2px;

  .chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 700;
    font-family: monospace;
    background-color: #eff6ff;
    color: #3b82f6;
    border: 1px solid #bfdbfe;
    min-width: 28px;
    transition: all 0.3s;

    &.urgent {
      background-color: #fef2f2;
      color: #ef4444;
      border-color: #fecaca;
      animation: pulse-red 1s ease-in-out infinite;
    }
  }
}

@keyframes pulse-red {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.right-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  overflow: hidden;
  box-sizing: border-box;
}

.pane-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 10px;
  margin-bottom: 12px;
  flex-shrink: 0;

  .title-icon {
    font-size: 16px;
    color: #3b82f6;
    margin-right: 6px;
  }

  .subtitle-desc {
    font-size: 12px;
    font-weight: normal;
    color: #64748b;
  }
}

.task-info-vertical {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;

  .info-row {
    background: #ffffff;
    padding: 8px 12px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;

    &.border-none {
      border-bottom: none;
    }

    .label {
      color: #64748b;
      font-weight: 500;
      flex-shrink: 0;
    }

    .value {
      color: #1e293b;
      text-align: right;
    }
  }
}

.pane-divider {
  height: 1px;
  background-color: #f1f5f9;
  margin: 16px 0;
  flex-shrink: 0;
}

.supp-section {
  display: flex;
  flex-direction: column;
  gap: 6px;

  .section-label {
    font-size: 12px;
    font-weight: 700;
    color: #475569;
  }

  .section-value {
    font-size: 12px;
    line-height: 1.6;
    color: #0f172a;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 12px;
  }
}

.attach-section {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .section-label {
    font-size: 12px;
    font-weight: 700;
    color: #475569;
  }

  .attach-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .file-chip {
    background-color: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 8px 12px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    box-sizing: border-box;

    .file-icon {
      color: #64748b;
      font-size: 16px;
      margin-top: 2px;
    }

    .file-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow: hidden;
    }

    .file-name {
      color: #334155;
      font-weight: 600;
      font-size: 11px;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-meta {
      color: #94a3b8;
      font-size: 10px;
    }
  }
}

.feedback-table-wrapper {
  flex: 1;
  overflow: hidden;
  margin-top: 4px;
}

/* 反馈表格美化 */
.premium-table {
  --el-table-border-color: #e2e8f0;

  .premium-header {
    background-color: #f8fafc !important;
    color: #334155 !important;
    font-weight: 600;
    font-size: 12px;

    &.el-table__cell {
      background-color: #f8fafc !important;
    }
  }

  .premium-row {
    font-size: 12px;
    background-color: #ffffff;

    td.el-table__cell {
      background-color: #ffffff !important;
    }

    &:hover td.el-table__cell {
      background-color: #f1f5f9 !important;
    }

    &.el-table__row--striped td.el-table__cell {
      background-color: #fafafa !important;
    }

    &.el-table__row--striped:hover td.el-table__cell {
      background-color: #f1f5f9 !important;
    }
  }

  .code-text {
    font-family: monospace;
    font-weight: 600;
    color: #0f172a;
  }

  .user-cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fee-text {
    color: #b91c1c;
  }

  .price-text {
    color: #0284c7;
    font-weight: 600;
  }

  .cycle-text,
  .duration-text {
    font-weight: 500;
    color: #334155;
  }

  .text-secondary {
    color: #94a3b8;
  }
}

/* 固定右侧列叠加层背景修复 - 必须对容器本身设背景，否则透明 */
.premium-table .el-table__fixed-right {
  background-color: #ffffff;
}
.premium-table .el-table__fixed-right-patch {
  background-color: #f8fafc;
}
.premium-table .el-table__fixed-right .el-table__fixed-header-wrapper {
  background-color: #f8fafc;
}
.premium-table .el-table__fixed-right .el-table__fixed-body-wrapper {
  background-color: #ffffff;
}
.premium-table .el-table__fixed-right .el-table__cell {
  background-color: #ffffff !important;
}
.premium-table .el-table__fixed-right .premium-header.el-table__cell {
  background-color: #f8fafc !important;
}
.premium-table .el-table__fixed-right .el-table__row td.el-table__cell {
  background-color: #ffffff !important;
}
.premium-table .el-table__fixed-right .el-table__row:hover td.el-table__cell {
  background-color: #f1f5f9 !important;
}
.premium-table .el-table__fixed-right .el-table__row--striped td.el-table__cell {
  background-color: #fafafa !important;
}
.premium-table .el-table__fixed-right .el-table__row--striped:hover td.el-table__cell {
  background-color: #f1f5f9 !important;
}

.dialog-footer {
  padding: 10px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #f1f5f9;
  background-color: #ffffff;
}

.ml-auto {
  margin-left: auto;
}
.ml-12 {
  margin-left: 12px;
}
.mt-12 {
  margin-top: 12px;
}
.mt-16 {
  margin-top: 16px;
}
.mr-4 {
  margin-right: 4px;
}
.font-bold {
  font-weight: bold;
}
</style>
