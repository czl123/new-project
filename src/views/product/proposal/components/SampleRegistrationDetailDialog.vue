<template>
  <el-dialog
    v-model="visible"
    title="开发样登记详情"
    width="900px"
    class="premium-dialog"
    destroy-on-close
    align-center
  >
    <div class="sample-detail-container" v-if="detailData">
      <!-- 头部：单号与状态 -->
      <div class="detail-header-card mb-20">
        <div class="header-left">
          <div class="bill-no-badge">
            <el-icon><Document /></el-icon>
            <span>登记单号：{{ detailData.regNo }}</span>
          </div>
          <div class="meta-info mt-6">
            <span class="mr-16">采购员：<strong>{{ detailData.purchaserName || '黄小军' }}</strong>（{{ detailData.receiveTime || '2026-05-24 10:00' }}）</span>
            <span class="mr-16">产品经理：<strong>{{ detailData.pmName || '陈招娣' }}</strong><span v-if="detailData.feedbackTime">（{{ detailData.feedbackTime }}）</span></span>
            <span>时效：<strong class="time-duration-val">{{ durationTime }}</strong></span>
          </div>
        </div>
        <div class="header-right">
          <el-tag :type="getStatusTagType(detailData.status)" size="medium" effect="dark">
            {{ detailData.status || '有效' }}
          </el-tag>
        </div>
      </div>

      <!-- 模块 1：基本属性 -->
      <div class="detail-section mb-20">
        <div class="section-title mb-12">
          <span class="title-bar blue"></span>
          <span>样品基础登记信息</span>
        </div>
        
        <el-descriptions :column="3" border class="custom-desc-table">

          <el-descriptions-item label="样品类型">
            <span>{{ detailData.sampleType || '开发样' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="拿样渠道">
            <span>{{ detailData.source || '供应商' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="供应商" :span="2" v-if="detailData.supplierName">
            <span class="font-medium">{{ detailData.supplierName }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="购买链接" :span="2" v-else-if="detailData.purchaseUrl">
            <el-link :href="detailData.purchaseUrl" target="_blank" type="primary" :underline="false" class="link-text-ellipsis">
              {{ detailData.purchaseUrl }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="样品费">
            <span class="price-text font-bold">{{ detailData.sampleFee || '¥ 0.00' }}</span>
          </el-descriptions-item>
           <el-descriptions-item label="样品名称">
            <span class="font-medium">{{ detailData.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="款式">
            <span class="font-medium">{{ detailData.style || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="主材料">
            <span>{{ detailData.material || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="适用品牌/对象">
            <span>{{ detailData.applicableTo || '通用' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="包装方式">
            <span>{{ detailData.packagingMethod || '盒装' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="包装数量">
            <span>{{ detailData.packagingQuantity || '1pack' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="样品特征">
            <div style="display: flex; gap: 12px;">
              <el-tag size="small" :type="detailData.hasBattery ? 'danger' : 'info'" effect="light">
                {{ detailData.hasBattery ? '带电' : '不带电' }}
              </el-tag>
              <el-tag size="small" :type="detailData.isCE ? 'success' : 'info'" effect="light">
                {{ detailData.isCE ? 'CE认证' : '无CE' }}
              </el-tag>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 模块 2：物理规格与特征 -->
      <div class="detail-section mb-20">
        <div class="section-title mb-12">
          <span class="title-bar orange"></span>
          <span>详细规格物理参数</span>
        </div>
        
        <el-descriptions :column="3" border class="custom-desc-table">
          <el-descriptions-item label="规格">
            <span>{{ detailData.spec || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="颜色">
            <span class="font-medium">{{ detailData.color || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="图案">
            <span>{{ detailData.pattern || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="样品尺寸" :span="2">
            <span class="font-medium">{{ detailData.sampleSize || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="净重">
            <span>{{ detailData.netWeight || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="包装尺寸" :span="2">
            <span>{{ detailData.packagingSize || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="尺码">
            <span>{{ detailData.size || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="外径/内径">
            <span>{{ detailData.diameter || '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="容量">
            <span>{{ detailData.capacity || '-' }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 模块 3：商业与合作信息 -->
      <div class="detail-section mb-20">
        <div class="section-title mb-12">
          <span class="title-bar purple"></span>
          <span>商业及合作信息</span>
        </div>
        <el-descriptions :column="4" border class="custom-desc-table">
          <el-descriptions-item label="初次报价">
            <span class="price-text font-bold">{{ detailData.initialQuote !== undefined && detailData.initialQuote !== null ? '¥ ' + detailData.initialQuote : '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="税率">
            <span>{{ detailData.taxRate !== undefined && detailData.taxRate !== null ? detailData.taxRate + ' %' : '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="起订量">
            <span>{{ detailData.moq !== undefined && detailData.moq !== null ? detailData.moq + ' 个' : '-' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="生产周期">
            <span>{{ detailData.productionCycle !== undefined && detailData.productionCycle !== null ? detailData.productionCycle + ' 天' : '-' }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 模块 4：附件与说明 -->
      <div class="detail-section mb-10">
        <div class="section-title mb-12">
          <span class="title-bar green"></span>
          <span>附件及样品说明</span>
        </div>
        <div class="attachments-grid">
          <div class="attach-group">
            <span class="attach-label">样品图片：</span>
            <div class="attach-images" v-if="detailData.image">
              <el-image 
                :src="detailData.image" 
                :preview-src-list="[detailData.image]" 
                fit="cover" 
                class="attach-img-preview"
                preview-teleported
              />
            </div>
            <span class="no-attach" v-else>暂无样品图片</span>
          </div>

          <div class="attach-group mt-12" v-if="detailData.qualifications && detailData.qualifications.length > 0">
            <span class="attach-label">产品资质：</span>
            <div class="qual-links">
              <div v-for="(file, i) in detailData.qualifications" :key="i" class="qual-link-item">
                <el-link type="primary" :underline="false" :href="file.url" target="_blank">{{ file.name }}</el-link>
              </div>
            </div>
          </div>

          <div class="desc-group mt-12" v-if="detailData.description">
            <span class="attach-label">样品说明：</span>
            <span class="desc-content">{{ detailData.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer-actions">
        <el-button type="primary" @click="visible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Document } from '@element-plus/icons-vue'

const visible = ref(false)
const detailData = ref<any>(null)

const getStatusTagType = (status: string) => {
  switch (status) {
    case '有效': return 'success'
    case '待反馈': return 'warning'
    case '待提交': return 'info'
    case '无效': return 'danger'
    case '已驳回': return 'danger'
    default: return 'info'
  }
}

const durationTime = computed(() => {
  const t1Str = detailData.value?.receiveTime || '2026-05-24 10:00'
  const t1 = new Date(t1Str).getTime()
  if (isNaN(t1)) return ''
  
  let t2: number
  if (detailData.value?.feedbackTime) {
    t2 = new Date(detailData.value.feedbackTime).getTime()
  } else {
    t2 = Date.now()
  }
  
  if (isNaN(t2)) return ''
  const diffMs = t2 - t1
  if (diffMs <= 0) return '1分钟'
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟`
  }
  
  const diffHours = Math.floor(diffMinutes / 60)
  const days = Math.floor(diffHours / 24)
  const hours = diffHours % 24
  
  if (days > 0) {
    return `${days}天${hours}小时`
  }
  return `${hours}小时`
})

const open = (row: any) => {
  // 补充样品的默认状态基础元数据
  const defaultMeta = {
    sampleType: '开发样',
    packagingMethod: '盒装',
    packagingQuantity: '1pack',
    style: '经典系列',
    initialQuote: '85.00',
    taxRate: 13,
    moq: 500,
    productionCycle: 20,
    hasBattery: false,
    isCE: true,
    receiver: '李四',
    receiveDate: '2026-05-24',
    purchaserName: '黄小军',
    pmName: '陈招娣',
    receiveTime: '2026-05-24 10:00',
    feedbackTime: '2026-05-26 14:20',
    qualifications: [
      { name: 'CE符合性证书.pdf', url: '#' },
      { name: '产品质检报告.pdf', url: '#' }
    ],
    description: '样品尺寸及结构完全契合要求，抛光打磨优秀，推荐批量采纳。'
  }

  detailData.value = {
    ...defaultMeta,
    ...row
  }
  
  const currentStatus = detailData.value.status || detailData.value.sampleStatus
  if (!['有效', '无效', '已反馈'].includes(currentStatus) || !row.feedbackTime) {
    delete detailData.value.feedbackTime
  }
  
  visible.value = true
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.sample-detail-container {
  padding: 0 4px;
}

/* 头部卡片 */
.detail-header-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .bill-no-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    .el-icon { color: #1890ff; }
  }
  
  .meta-info {
    font-size: 12px;
    color: #64748b;
    strong {
      color: #334155;
    }
  }
}

/* 模块标题 */
.detail-section {
  background-color: #ffffff;
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

/* Descriptions表格重构 */
.custom-desc-table {
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
  }
}

.link-text-ellipsis {
  display: inline-block;
  max-width: 420px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}

.price-text {
  color: #eab308;
  font-size: 13px;
}

/* 附件及说明 */
.attachments-grid {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px 16px;
}

.attach-group, .desc-group {
  display: flex;
  align-items: center;
}

.attach-group {
  align-items: flex-start;
}

.attach-label {
  width: 80px;
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  flex-shrink: 0;
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

.qual-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.qual-link-item {
  font-size: 12px;
  
  :deep(.el-link) {
    font-size: 12px;
  }
}

.desc-content {
  font-size: 12px;
  color: #475569;
  line-height: 1.5;
}

.no-attach {
  font-size: 12px;
  color: #94a3b8;
}

.dialog-footer-actions {
  text-align: right;
  padding: 0 4px;
}

.font-medium { font-weight: 500; }
.font-bold { font-weight: 700; }
.mb-20 { margin-bottom: 20px; }
.mb-12 { margin-bottom: 12px; }
.mb-10 { margin-bottom: 10px; }
.mt-6 { margin-top: 6px; }
.mt-12 { margin-top: 12px; }
.mr-12 { margin-right: 12px; }
.mr-16 { margin-right: 16px; }
.time-duration-val {
  color: #1890ff;
  font-weight: 700;
}
</style>
