<template>
  <el-dialog
    v-model="visible"
    title="购样申请单详情"
    width="850px"
    class="premium-dialog"
    destroy-on-close
    align-center
  >
    <div class="purchase-detail-container" v-if="detailData">
      <!-- 头部：单号与状态 -->
      <div class="detail-header-card mb-20">
        <div class="header-left">
          <div class="bill-no-badge">
            <el-icon><Document /></el-icon>
            <span>申请单号：{{ detailData.applyNo }}</span>
          </div>
          <div class="apply-time mt-6">
            <span>申请时间：{{ detailData.applyTime }}</span>
          </div>
        </div>
        <div class="header-right">
          <el-tag :type="getStatusTagType(detailData.status)" size="medium" effect="dark">
            {{ detailData.status }}
          </el-tag>
        </div>
      </div>

      <!-- 模块 1：拿样渠道信息 -->
      <div class="detail-section mb-20">
        <div class="section-title mb-12">
          <span class="title-bar blue"></span>
          <span>拿样渠道信息</span>
        </div>
        
        <!-- 渠道为：供应商 -->
        <el-descriptions :column="2" border v-if="detailData.channel === '供应商'" class="custom-desc-table">
          <el-descriptions-item label="拿样渠道">
            <el-tag size="small" type="info" effect="plain">供应商</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="供应商类型">
            <span>{{ detailData.supplierType || '临时供应商' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="供应商名称">
            <span class="font-medium">{{ detailData.supplier }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="货源地">
            <span>{{ detailData.source || '广东深圳' }}</span>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 渠道为：1688 / 淘宝 -->
        <el-descriptions :column="2" border v-else class="custom-desc-table">
          <el-descriptions-item label="拿样渠道">
            <el-tag size="small" type="warning" effect="plain">{{ detailData.channel }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="购买链接" :span="2">
            <el-link 
              v-if="detailData.purchaseUrl" 
              :href="detailData.purchaseUrl" 
              target="_blank" 
              type="primary" 
              :underline="false"
              class="link-text-ellipsis"
            >
              {{ detailData.purchaseUrl }}
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
            <span class="font-medium">{{ detailData.sampleName }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="购样数量">
            <span>{{ detailData.qty }} 个</span>
          </el-descriptions-item>
          <el-descriptions-item label="购样单价">
            <span>{{ detailData.price }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="费用合计">
            <span class="price-text font-bold">{{ detailData.amount }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="是否可退款" v-if="detailData.channel === '供应商'">
            <el-tag :type="detailData.isRefundable ? 'success' : 'info'" size="small">
              {{ detailData.isRefundable ? '是' : '否' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="收款方式" v-if="detailData.channel === '供应商'">
            <span>{{ detailData.paymentMethod || '银行转账' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="退款条款" v-if="detailData.channel === '供应商' && detailData.isRefundable" :span="2">
            <div class="refund-policy">
              <span class="policy-tag">{{ detailData.refundMethod || '抵扣首单' }}</span>
              <span class="policy-cond" v-if="detailData.refundCondition">( 条件: {{ detailData.refundCondition }} )</span>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 模块 3：收款账户信息 -->
      <div class="detail-section mb-20" v-if="detailData.channel === '供应商'">
        <div class="section-title mb-12">
          <span class="title-bar purple"></span>
          <span>收款账户信息</span>
        </div>
        <el-descriptions :column="2" border class="custom-desc-table" v-if="detailData.paymentMethod === '银行转账'">
          <el-descriptions-item label="开户行">
            <span>{{ detailData.bankName || '中国工商银行义乌支行' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="账户名称">
            <span>{{ detailData.accountName || '义乌得力商贸有限公司' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="银行账号" :span="2">
            <span class="font-medium code-style">{{ detailData.bankAccount || '6217 0038 9001 0293 848' }}</span>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="2" border class="custom-desc-table" v-else>
          <el-descriptions-item label="收款方式">
            <span>{{ detailData.paymentMethod }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="收款二维码">
            <div class="attach-images" v-if="detailData.paymentQrCode">
              <el-image 
                :src="detailData.paymentQrCode" 
                :preview-src-list="[detailData.paymentQrCode]" 
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
      <div class="detail-section mb-10">
        <div class="section-title mb-12">
          <span class="title-bar green"></span>
          <span>单据相关附件</span>
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

          <div class="attach-group mt-12" v-if="detailData.orderScreenshot">
            <span class="attach-label">订单截图：</span>
            <div class="attach-images">
              <el-image 
                :src="detailData.orderScreenshot" 
                :preview-src-list="[detailData.orderScreenshot]" 
                fit="cover" 
                class="attach-img-preview"
                preview-teleported
              />
            </div>
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
import { ref } from 'vue'
import { Document } from '@element-plus/icons-vue'

const visible = ref(false)
const detailData = ref<any>(null)

const open = (row: any) => {
  // 补齐查看详情时可能缺失的默认字段数据，以展示完整的多渠道特异信息
  const defaultBank = {
    paymentMethod: '银行转账',
    bankName: '中国工商银行义乌支行',
    accountName: row.supplier || '义乌市得力商贸服务部',
    bankAccount: '6217 0038 9001 0293 848'
  }
  
  const defaultRefund = {
    isRefundable: ['已通过', '同意', '待更新合同'].includes(row.status),
    refundMethod: '抵扣首单货款',
    refundCondition: '首批大货订单满1000件返还'
  }

  detailData.value = {
    ...defaultBank,
    ...defaultRefund,
    ...row,
    // 如果是 1688 / 淘宝，我们配给它对应的付款截图或店铺名
    shopName: row.channel !== '供应商' ? `${row.channel}优质货源店` : '',
    orderScreenshot: row.channel !== '供应商' ? 'https://picsum.photos/300/200?random=40' : '',
    paymentQrCode: (row.paymentQrCodes && row.paymentQrCodes.length > 0) ? row.paymentQrCodes[0] : (row.paymentQrCode || (['支付宝', '微信'].includes(row.paymentMethod) ? 'https://picsum.photos/200/200?random=50' : ''))
  }
  visible.value = true
}

const getStatusTagType = (status: string) => {
  switch (status) {
    case '同意':
    case '已通过': return 'success'
    case '待审批':
    case '审批中': return 'warning'
    case '不同意':
    case '已驳回': return 'danger'
    case '待更新合同': return 'primary'
    case '待提交': return 'info'
    default: return 'info'
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.purchase-detail-container {
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
  
  .apply-time {
    font-size: 12px;
    color: #64748b;
  }
}

/* 模块设计 */
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
  max-width: 580px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}

.price-text {
  color: #eab308;
  font-size: 14px;
}

.code-style {
  font-family: Consolas, Monaco, monospace;
  font-size: 13px;
  color: #0f172a;
}

/* 退款条款 */
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

/* 附件网格 */
.attachments-grid {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px 16px;
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
</style>
