<template>
  <el-dialog
    v-model="visible"
    title="购样-申请"
    width="1100px"
    append-to-body
    class="purchase-apply-dialog"
  >
    <!-- 置顶的操作与提示栏 -->
    <div class="dialog-top-bar">
      <div class="bar-tip">
        <el-icon><Warning /></el-icon>
        <span>支持同时发起多个方案的购样申请，提交后将进入对应的审批流程。</span>
      </div>
      <el-button type="primary" icon="Plus" @click="addPurchaseItem">新增购样方案</el-button>
    </div>

    <div class="purchase-batch-container custom-scrollbar">
      <div v-for="(item, index) in purchaseList" :key="index" class="purchase-item-block">
        <div class="block-header">
          <span class="block-num">购样方案 #{{ index + 1 }}</span>
          <el-button 
            v-if="purchaseList.length > 1" 
            type="danger" 
            link 
            icon="CloseBold" 
            class="remove-btn"
            @click="removePurchaseItem(index)"
          />
        </div>

        <el-form :model="item" :rules="rules" label-width="90px" label-position="right" size="small">
          <!-- 第一行 -->
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="拿样渠道:" required>
                <el-select v-model="item.channel" placeholder="请选择" class="full-w">
                  <el-option label="供应商" value="供应商" />
                  <el-option label="1688" value="1688" />
                  <el-option label="淘宝" value="淘宝" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商类型:" required>
                <el-select v-model="item.supplierType" placeholder="请选择" class="full-w">
                  <el-option label="正式供应商" value="正式" />
                  <el-option label="临时供应商" value="临时" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商:" required>
                <el-input v-model="item.supplier" placeholder="输入供应商名称" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="货源地:" required>
                <el-select v-model="item.source" placeholder="请选择" class="full-w">
                  <el-option label="广东深圳" value="深圳" />
                  <el-option label="浙江义乌" value="义乌" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第二行 -->
          <el-row :gutter="20" class="mt-8">
            <el-col :span="6">
              <el-form-item label="样品名称:" required>
                <el-input v-model="item.sampleName" placeholder="输入样品名称" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="购样数量:" required>
                <el-input-number v-model="item.quantity" :min="1" :controls="false" class="full-w" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="购样费用:" required>
                <el-input-number v-model="item.price" :min="0" :precision="2" :controls="false" class="full-w" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="费用合计:">
                <span class="price-text">¥ {{ (item.quantity * item.price).toFixed(2) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-checkbox v-model="item.refundable">是否可退款</el-checkbox>
            </el-col>
          </el-row>

          <!-- 第三行 -->
          <el-row :gutter="20" class="mt-8">
            <el-col :span="6">
              <el-form-item label="收款方式:" required>
                <el-select v-model="item.paymentMethod" placeholder="请选择" class="full-w">
                  <el-option label="银行转账" value="银行转账" />
                  <el-option label="支付宝" value="支付宝" />
                  <el-option label="微信" value="微信" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="银行账号:" required>
                <el-input v-model="item.bankAccount" placeholder="输入账号" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="账号户名:" required>
                <el-input v-model="item.accountName" placeholder="输入户名" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开户行:" required>
                <el-input v-model="item.bankName" placeholder="输入支行名称" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer-batch">
        <span class="batch-info">共计 {{ purchaseList.length }} 个购样申请</span>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="info" plain @click="handleSave">保存</el-button>
        <el-button type="success" @click="handleSubmit">确认提交 ({{ purchaseList.length }})</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Warning, Plus, CloseBold } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  taskData?: any
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const purchaseList = ref<any[]>([])

const createInitialItem = (data?: any) => ({
  channel: data?.source || '1688',
  supplierType: '临时',
  supplier: '',
  source: data?.source || '深圳',
  refundable: data?.isRefundable || false,
  sampleName: data?.productName || '',
  quantity: 1,
  price: data?.sampleFee || data?.moldFee || 0,
  paymentMethod: '银行转账',
  bankAccount: '',
  accountName: '',
  bankName: ''
})

watch(() => props.modelValue, (newVal) => {
  if (newVal && purchaseList.value.length === 0) {
    purchaseList.value = [createInitialItem(props.taskData)]
  }
})

const addPurchaseItem = () => {
  purchaseList.value.push(createInitialItem(props.taskData))
}

const removePurchaseItem = (index: number) => {
  purchaseList.value.splice(index, 1)
}

const handleSave = () => {
  ElMessage.success('购样申请草稿已保存')
  visible.value = false
}

const handleSubmit = () => {
  ElMessage.success(`成功提交 ${purchaseList.value.length} 个购样申请`)
  emit('submit', purchaseList.value)
  visible.value = false
}
</script>

<style lang="scss" scoped>
.purchase-apply-dialog {
  :deep(.el-dialog__body) {
    padding: 0 20px 20px;
  }
}

.dialog-top-bar {
  margin: 0 0 20px 0;
  padding: 12px 16px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .bar-tip {
    color: #0050b3;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    .el-icon { font-size: 16px; color: #1890ff; }
  }
}

.purchase-batch-container {
  max-height: 55vh;
  overflow-y: auto;
  padding: 0 10px;
}

.purchase-item-block {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;

  &:hover {
    border-color: #c6e2ff;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .block-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f2f6fc;

    .block-num {
      font-weight: 700;
      color: #303133;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
      &::before {
        content: '';
        width: 4px;
        height: 16px;
        background: #409eff;
        border-radius: 2px;
      }
    }
    
    .remove-btn {
      padding: 4px;
      height: auto;
      font-size: 18px;
      color: #909399;
      &:hover {
        color: #f5222d;
        background: #fff1f0;
        border-radius: 4px;
      }
    }
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #606266;
  }
}

.full-w { width: 100%; }
.mt-8 { margin-top: 12px; }
.price-text { color: #f5222d; font-weight: 700; font-size: 16px; }

.dialog-footer-batch {
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
  margin: 0 -20px -10px -20px;
  padding-right: 20px;
  text-align: right;
  .batch-info {
    float: left;
    line-height: 32px;
    color: #8c8c8c;
    font-size: 13px;
    margin-left: 20px;
  }
  .el-button {
    min-width: 90px;
    margin-left: 12px;
  }
}

.custom-scrollbar {
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #dcdfe6; border-radius: 3px; }
}
</style>
