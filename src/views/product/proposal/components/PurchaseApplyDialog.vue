<template>
  <el-dialog
    v-model="visible"
    title="购样申请"
    width="1100px"
    class="purchase-apply-dialog"
    destroy-on-close
  >
    <!-- 顶部说明区域 -->
    <div class="feedback-instruction">
      <el-icon class="mr-8"><InfoFilled /></el-icon>
      <span>支持发起多个样品的购样申请，提交后将进入对应的审批流程。</span>
    </div>

    <div class="feedback-content">
      <el-tabs
        v-model="activeTab"
        type="border-card"
        addable
        @tab-add="addItem"
        @tab-remove="removeItemByTab"
        class="feedback-tabs"
      >
        <el-tab-pane
          v-for="(item, index) in form.items"
          :key="index"
          :label="'购样方案 ' + (index + 1)"
          :name="index"
          :closable="form.items.length > 1"
        >
          <el-form :model="form" ref="formRef" label-position="left" label-width="100px" class="feedback-form custom-form">
            <!-- 第一行 -->
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item 
                  label="拿样渠道" 
                  required
                  :prop="'items.' + index + '.channel'"
                  :rules="{ required: true, message: '请选择渠道', trigger: 'change' }"
                >
                  <el-select v-model="item.channel" placeholder="请选择" class="w-full">
                    <el-option label="供应商" value="供应商" />
                    <el-option label="1688" value="1688" />
                    <el-option label="淘宝" value="淘宝" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item 
                  label="供应商类型" 
                  required
                  :prop="'items.' + index + '.supplierType'"
                  :rules="{ required: true, message: '请选择类型', trigger: 'change' }"
                >
                  <el-select v-model="item.supplierType" placeholder="请选择" class="w-full">
                    <el-option label="正式供应商" value="正式" />
                    <el-option label="临时供应商" value="临时" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item 
                  label="供应商" 
                  required
                  :prop="'items.' + index + '.supplier'"
                  :rules="{ required: true, message: '请输入供应商', trigger: 'blur' }"
                >
                  <el-input v-model="item.supplier" placeholder="输入名称" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item 
                  label="货源地" 
                  required
                  :prop="'items.' + index + '.source'"
                  :rules="{ required: true, message: '请输入货源地', trigger: 'blur' }"
                >
                  <el-input v-model="item.source" placeholder="输入货源地" />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第二行 -->
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item 
                  label="样品名称" 
                  required
                  :prop="'items.' + index + '.sampleName'"
                  :rules="{ required: true, message: '请输入样品名称', trigger: 'blur' }"
                >
                  <el-input v-model="item.sampleName" placeholder="输入样品名称" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item 
                  label="购样数量" 
                  required
                  :prop="'items.' + index + '.quantity'"
                  :rules="{ required: true, message: '请输入数量', trigger: 'blur' }"
                >
                  <el-input-number v-model="item.quantity" :min="1" :controls="false" class="w-full" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item 
                  label="购样费用" 
                  required
                  :prop="'items.' + index + '.price'"
                  :rules="{ required: true, message: '请输入费用', trigger: 'blur' }"
                >
                  <el-input-number v-model="item.price" :min="0" :precision="2" :controls="false" class="w-full">
                    <template #append>CNY</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="费用合计">
                  <span class="total-price-text">¥ {{ (item.quantity * item.price).toFixed(2) }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第三行 -->
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item label="收款方式" required>
                  <el-select v-model="item.paymentMethod" placeholder="请选择" class="w-full">
                    <el-option label="银行转账" value="银行转账" />
                    <el-option label="支付宝" value="支付宝" />
                    <el-option label="微信" value="微信" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="银行账号" required>
                  <el-input v-model="item.bankAccount" placeholder="输入账号" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="账号户名" required>
                  <el-input v-model="item.accountName" placeholder="输入户名" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="开户行" required>
                  <el-input v-model="item.bankName" placeholder="输入支行" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item class="refundable-item">
                  <template #label>
                    <el-checkbox v-model="item.isRefundable">是否可退款</el-checkbox>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <div class="footer-left">
          <span class="batch-info">共计 {{ form.items.length }} 个购样申请</span>
        </div>
        <div class="footer-right">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" plain @click="handleSave">保 存</el-button>
          <el-button type="primary" @click="handleSubmit">提 交</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, InfoFilled } from '@element-plus/icons-vue'

const visible = ref(false)
const activeTab = ref(0)
const formRef = ref<any>(null)

const createEmptyItem = (data?: any) => ({
  channel: data?.source || '1688',
  supplierType: '临时',
  supplier: '',
  source: data?.source || '',
  isRefundable: data?.isRefundable === '是',
  sampleName: data?.productName || '',
  quantity: 1,
  price: 0,
  paymentMethod: '银行转账',
  bankAccount: '',
  accountName: '',
  bankName: ''
})

const form = ref({
  items: [createEmptyItem()]
})

const addItem = () => {
  form.value.items.push(createEmptyItem())
  activeTab.value = form.value.items.length - 1
}

const removeItemByTab = (targetName: number) => {
  const items = form.value.items
  if (items.length <= 1) return
  
  items.splice(targetName, 1)
  if (activeTab.value >= items.length) {
    activeTab.value = items.length - 1
  }
}

const handleSave = () => {
  ElMessage.success('保存成功')
  visible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  ElMessage.success(`成功提交 ${form.value.items.length} 个购样申请`)
  emit('submit', form.value.items)
  visible.value = false
}

const open = (taskData?: any) => {
  visible.value = true
  form.value.items = [createEmptyItem(taskData)]
  activeTab.value = 0
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.feedback-instruction {
  margin: 0 20px 20px;
  padding: 10px 16px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #0369a1;
  .mr-8 { margin-right: 8px; }
}

.feedback-content {
  padding: 0 20px;
}

.feedback-tabs {
  border: 1px solid #e2e8f0 !important;
  border-radius: 8px !important;
  box-shadow: none !important;
  
  :deep(.el-tabs__header) {
    background-color: #f8fafc !important;
    margin: 0 !important;
    border-bottom: 1px solid #e2e8f0 !important;
    border-radius: 8px 8px 0 0 !important;
    display: flex;
    align-items: center;
  }

  :deep(.el-tabs__nav-wrap) {
    margin-bottom: 0 !important;
    flex: 0 1 auto;
    &::after { display: none; }
  }

  :deep(.el-tabs__new-tab) {
    position: static !important;
    margin-left: 12px !important;
    margin-right: 12px !important;
    background: var(--el-color-primary) !important;
    color: #fff !important;
    border-radius: 4px;
    width: auto !important;
    height: 28px !important;
    padding: 0 12px !important;
    border: none !important;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    float: none !important;
    
    .el-icon { margin: 0 !important; color: #fff !important; font-weight: bold; }
    &::after { content: '新增方案'; margin-left: 6px; font-size: 12px; font-weight: 500; white-space: nowrap; }
    &:hover { background: var(--el-color-primary-light-3) !important; }
  }

  :deep(.el-tabs__content) {
    padding: 32px 24px !important;
    background: #fff !important;
    border-radius: 0 0 8px 8px !important;
  }
}

.custom-form {
  :deep(.el-form-item) { margin-bottom: 20px !important; display: flex; align-items: center; }
  :deep(.el-form-item__label) { height: 36px !important; display: inline-flex; align-items: center; line-height: 1.2 !important; padding-bottom: 0 !important; font-size: 13px; color: #475569; font-weight: 500; }
  :deep(.el-input__wrapper), :deep(.el-select .el-input__wrapper) { height: 36px !important; }
}

.total-price-text { color: #f59e0b; font-weight: 700; font-size: 16px; }

:deep(.refundable-item) {
  margin-bottom: 0 !important;
  .el-form-item__label { width: 100px !important; justify-content: flex-start; }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  
  .batch-info { font-size: 13px; color: #64748b; }
  
  .footer-right {
    display: flex; gap: 8px;
    :deep(.el-button) { height: 32px; padding: 0 20px; font-size: 13px; border-radius: 4px; }
  }
}

.w-full { width: 100%; }
.mr-8 { margin-right: 8px; }
</style>
