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
            <span class="label">期望定制用时：</span>
            <span class="value">{{ taskInfo.customCycle || '5天' }}</span>
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
            ref="feedbackTableRef"
            :data="feedbackList"
            border
            stripe
            size="small"
            class="premium-table"
            header-cell-class-name="premium-header"
            row-class-name="premium-row"
            max-height="350"
            highlight-current-row
            @row-click="handleRowClick"
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

            <el-table-column label="操作" width="185" align="center" fixed="right">
              <template #default="{ row }">
                <div class="action-btns-flex">
                  <el-button 
                    type="primary" 
                    link
                    size="small" 
                    @click="handleAdopt(row)"
                    :class="{ 'is-active-link': row.isAdopted === '已采纳' }"
                  >采纳</el-button>
                  <el-button 
                    type="danger" 
                    link
                    size="small" 
                    @click="handleNotAdopt(row)"
                    :class="{ 'is-active-link': row.isAdopted === '不采纳' }"
                  >不采纳</el-button>
                  <el-button 
                    type="warning" 
                    link
                    size="small" 
                    @click="handleReject(row)"
                    :class="{ 'is-active-link': row.isAdopted === '已驳回' }"
                  >驳回</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 方案详细说明区 -->
        <div class="feedback-detail-panel" v-if="selectedFeedback">
          <div class="detail-panel-header">
            <el-icon class="mr-4"><InfoFilled /></el-icon>
            <span>方案详细说明 [{{ selectedFeedback.code }}]</span>
          </div>
          <div class="detail-panel-content">
            <!-- 第一行：基础属性 -->
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">反馈日期：</span>
                <span class="value">{{ selectedFeedback.date }}</span>
              </div>
              <div class="detail-item">
                <span class="label">反馈人：</span>
                <span class="value">{{ selectedFeedback.user }}</span>
              </div>
              <div class="detail-item">
                <span class="label">货源地：</span>
                <span class="value">{{ selectedFeedback.source }}</span>
              </div>
              <div class="detail-item">
                <span class="label">费用类型：</span>
                <span class="value">{{ selectedFeedback.feeType }} ({{ selectedFeedback.fee }})</span>
              </div>
            </div>

            <!-- 第二行：商务条款 -->
            <div class="detail-grid border-top">
              <div class="detail-item">
                <span class="label">初次报价：</span>
                <span class="value highlight">{{ selectedFeedback.initialQuote }}</span>
              </div>
              <div class="detail-item">
                <span class="label">生产周期：</span>
                <span class="value">{{ selectedFeedback.productionCycle }}</span>
              </div>
              <div class="detail-item">
                <span class="label">起订量：</span>
                <span class="value">{{ selectedFeedback.moq }}</span>
              </div>
              <div class="detail-item">
                <span class="label">定制用时：</span>
                <div class="value-with-warn">
                  <span class="value" :class="{ 'text-danger': isDurationOver }">{{ selectedFeedback.customDuration }}</span>
                  <el-tooltip
                    v-if="isDurationOver"
                    content="当前反馈定制用时已超过期望定制用时"
                    placement="top"
                  >
                    <el-icon class="ml-4 text-warning"><Warning /></el-icon>
                  </el-tooltip>
                </div>
              </div>
            </div>

            <!-- 第三行：退款相关 -->
            <div class="detail-grid border-top">
              <div class="detail-item">
                <span class="label">是否可退：</span>
                <el-tag size="small" :type="selectedFeedback.isRefundable === '是' ? 'success' : 'danger'" effect="plain">
                  {{ selectedFeedback.isRefundable }}
                </el-tag>
              </div>
              <div class="detail-item full-width-3" v-if="selectedFeedback.isRefundable === '是'">
                <span class="label">退款条件：</span>
                <span class="value">{{ selectedFeedback.refundCondition }}</span>
              </div>
            </div>

            <!-- 第四行：说明文字 -->
            <div class="detail-text-block border-top">
              <div class="detail-item full-width">
                <span class="label">附加条件：</span>
                <span class="value">{{ selectedFeedback.additionalConditions || '-' }}</span>
              </div>
              <div class="detail-item full-width mt-8">
                <span class="label">备注说明：</span>
                <span class="value">{{ selectedFeedback.notes || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="feedback-detail-empty" v-else>
          <el-empty :image-size="40" description="点击表格行查看方案详细说明" />
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
import { ref, onUnmounted, computed } from 'vue'
import { InfoFilled, Management, Document, Picture, Warning } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const visible = ref(false)
const feedbackTableRef = ref<any>(null)
const taskInfo = ref<any>({})
const feedbackList = ref<any[]>([])
const selectedFeedback = ref<any>(null)

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
    customCycle: row.customCycle || '5天',
    logoPosition: row.logoPosition || '无',
    supplementaryRequirement: row.supplementaryRequirement || '请重点确认魔术贴的使用寿命，以及边缘缝线是否容易脱落。',
    designFiles: row.designFiles || [],
    feedbackDeadline: row.feedbackDeadline || '2026-06-15 18:00:00',
    taskDeadline: row.taskDeadline || '2026-06-30 23:59:59'
  }

  feedbackList.value = getMockFeedbacks(taskInfo.value.proposalNo)
  selectedFeedback.value = null
  startCountdown()
  visible.value = true
  
  // 强制表格重排，解决固定列偏移
  setTimeout(() => {
    feedbackTableRef.value?.doLayout()
  }, 100)
}

const handleRowClick = (row: any) => {
  selectedFeedback.value = row
}

// 比较时间：判断反馈的定制用时是否超过期望周期
const isDurationOver = computed(() => {
  if (!selectedFeedback.value || !taskInfo.value.customCycle) return false
  
  const parseDays = (str: string) => {
    const num = parseInt(str.replace(/\D/g, '')) || 0
    return num
  }
  
  const expected = parseDays(taskInfo.value.customCycle)
  const actual = parseDays(selectedFeedback.value.customDuration)
  
  return actual > expected
})

// 采纳操作
const handleAdopt = async (row: any) => {
  // 校验定制用时
  const parseDays = (str: string) => parseInt(str.replace(/\D/g, '')) || 0
  const expected = parseDays(taskInfo.value.customCycle)
  const actual = parseDays(row.customDuration)

  if (actual > expected) {
    try {
      await ElMessageBox.confirm(
        `当前方案的定制用时（${row.customDuration}）已超过期望定制用时（${taskInfo.value.customCycle}），是否仍要采纳该方案？`,
        '超时提醒',
        {
          confirmButtonText: '坚持采纳',
          cancelButtonText: '取消',
          type: 'warning',
          buttonSize: 'small'
        }
      )
    } catch (e) {
      return // 用户点击取消，终止采纳
    }
  }

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
  width: 100%;
  overflow: hidden;
  margin-top: 4px;
  flex-shrink: 0;
}

/* 方案详情面板样式 */
.feedback-detail-panel {
  margin-top: 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.detail-panel-header {
  background: #f8fafc;
  padding: 8px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
}

.detail-panel-content {
  padding: 12px 16px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 8px 0;

  &.border-top {
    border-top: 1px dashed #f1f5f9;
  }
}

.detail-text-block {
  padding: 12px 0 4px;
  &.border-top {
    border-top: 1px dashed #f1f5f9;
  }
}

.detail-item {
  display: flex;
  align-items: flex-start;
  font-size: 12px;
  line-height: 1.5;

  &.full-width {
    grid-column: span 4;
  }
  &.full-width-3 {
    grid-column: span 3;
  }

  .label {
    color: #64748b;
    font-weight: 500;
    width: 65px;
    flex-shrink: 0;
  }
  .value {
    color: #1e293b;
    word-break: break-all;
    &.highlight {
      color: #0284c7;
      font-weight: 700;
    }
  }

  .value-with-warn {
    display: flex;
    align-items: center;
  }

  .text-danger {
    color: #ef4444 !important;
    font-weight: 700;
  }

  .text-warning {
    color: #f59e0b;
    font-size: 14px;
    cursor: pointer;
  }
}

.feedback-detail-empty {
  margin-top: 20px;
  padding: 20px;
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
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

  .action-btns-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: nowrap;

    :deep(.el-button) {
      /* 核心结构强制一致 */
      width: auto !important; /* 取消固定宽度，让链接自然排列 */
      height: 24px !important;
      padding: 0 4px !important;
      margin: 0 !important;
      font-size: 12px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      transition: all 0.2s;
      
      span {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1 !important;
      }

      &.el-button--primary { color: #3b82f6 !important; }
      &.el-button--danger { color: #ef4444 !important; }
      &.el-button--warning { color: #f59e0b !important; }

      &:hover {
        opacity: 0.7;
      }

      /* 选中状态：加粗并显示下划线 */
      &.is-active-link {
        font-weight: 800 !important;
        text-decoration: underline !important;
        text-underline-offset: 4px !important;
      }
    }
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
