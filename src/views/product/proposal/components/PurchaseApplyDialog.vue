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
              <template v-if="item.channel === '供应商'">
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
                    <el-select 
                      v-if="item.supplierType === '正式'" 
                      v-model="item.supplier" 
                      placeholder="选择供应商" 
                      class="w-full"
                      @change="(val) => handleSupplierChange(val, item)"
                    >
                      <el-option v-for="s in formalSuppliers" :key="s.value" :label="s.label" :value="s.label" />
                    </el-select>
                    <el-input v-else v-model="item.supplier" placeholder="输入名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item 
                    label="货源地" 
                    required
                    :prop="'items.' + index + '.source'"
                    :rules="{ required: true, message: '请选择或输入货源地', trigger: 'blur' }"
                  >
                    <el-select 
                      v-model="item.source" 
                      placeholder="请选择" 
                      class="w-full"
                      :disabled="item.supplierType === '正式'"
                    >
                      <el-option label="广东深圳" value="广东深圳" />
                      <el-option label="浙江义乌" value="浙江义乌" />
                      <el-option label="江苏苏州" value="江苏苏州" />
                      <el-option label="福建泉州" value="福建泉州" />
                      <el-option label="山东临沂" value="山东临沂" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="18">
                  <el-form-item 
                    label="购买链接" 
                    required
                    :prop="'items.' + index + '.purchaseUrl'"
                    :rules="{ required: true, message: '请输入购买链接', trigger: 'blur' }"
                  >
                    <el-input v-model="item.purchaseUrl" placeholder="粘贴 1688 或 淘宝 购买链接" />
                  </el-form-item>
                </el-col>
              </template>
            </el-row>

            <!-- 第二行 -->
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item 
                  label="样品名称" 
                  :prop="'items.' + index + '.sampleName'"
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

            <!-- 第三行: 附件上传 (1688/淘宝特有) -->
            <el-row :gutter="24" v-if="item.channel !== '供应商'">
              <el-col :span="12">
                <el-form-item label="样品图片">
                  <el-upload
                    action="#"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="(file) => handleImageSuccess(file, item, 'sampleImages')"
                    class="p-upload-inline"
                  >
                    <div class="p-upload-grid">
                      <div v-for="(img, i) in item.sampleImages" :key="i" class="p-upload-item">
                        <img :src="img" />
                      </div>
                      <div class="p-upload-add">
                        <el-icon><Picture /></el-icon>
                        <span>添加图片</span>
                      </div>
                    </div>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单截图">
                  <el-upload
                    action="#"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="(file) => handleImageSuccess(file, item, 'orderScreenshots')"
                    class="p-upload-inline"
                  >
                    <div class="p-upload-grid">
                      <div v-for="(img, i) in item.orderScreenshots" :key="i" class="p-upload-item">
                        <img :src="img" />
                      </div>
                      <div class="p-upload-add">
                        <el-icon><Camera /></el-icon>
                        <span>添加截图</span>
                      </div>
                    </div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第四行 (原第三行): 收款方式 -->
            <el-row :gutter="24" v-if="item.channel === '供应商'">
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

            <el-row :gutter="24" v-if="item.channel === '供应商'">
              <el-col :span="6">
                <el-form-item class="refundable-item">
                  <template #label>
                    <el-checkbox v-model="item.isRefundable">是否可退款</el-checkbox>
                  </template>
                </el-form-item>
              </el-col>
              <template v-if="item.isRefundable">
                <el-col :span="6">
                  <el-form-item label="退款方式" required>
                    <el-select v-model="item.refundMethod" placeholder="请选择" class="w-full">
                      <el-option label="首单退款" value="first_order" />
                      <el-option label="订单量退款" value="order_volume" />
                      <el-option label="订单金额退款" value="order_amount" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item 
                    label="退款条件" 
                    required
                    :rules="[
                      { required: ['order_volume', 'order_amount'].includes(item.refundMethod), message: '请输入退款条件', trigger: 'blur' }
                    ]"
                  >
                    <el-input v-model="item.refundCondition" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <div class="refund-tip-wrapper" v-if="item.refundMethod">
                    <div class="refund-tip">
                      <el-icon class="mr-4"><InfoFilled /></el-icon>
                      <span>{{ refundDescriptions[item.refundMethod] }}</span>
                    </div>
                  </div>
                </el-col>
              </template>
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
import { Plus, InfoFilled, Picture, Camera } from '@element-plus/icons-vue'

const visible = ref(false)
const activeTab = ref(0)
const formRef = ref<any>(null)
const emit = defineEmits(['submit'])

// 模拟正式供应商数据及其货源地
const formalSuppliers = [
  { label: '浙江恒太工贸有限公司', value: 'S001', source: '浙江义乌' },
  { label: '广东奥飞娱乐股份有限公司', value: 'S002', source: '广东深圳' },
  { label: '江苏美派玩具礼品有限公司', value: 'S003', source: '江苏苏州' }
]

const refundDescriptions: Record<string, string> = {
  first_order: '首单达到起订量即可退回费用',
  order_volume: '订单量累计达到设定数量后退回',
  order_amount: '订单金额累计达到设定金额后退回'
}

const handleSupplierChange = (val: string, item: any) => {
  const supplier = formalSuppliers.find(s => s.label === val)
  if (supplier) {
    item.source = supplier.source
  }
}

const handleImageSuccess = (file: any, item: any, field: 'sampleImages' | 'orderScreenshots') => {
  if (file.raw) {
    const url = URL.createObjectURL(file.raw)
    item[field].push(url)
  }
}

const createEmptyItem = (data?: any) => ({
  channel: data?.source === '1688' || data?.source === '淘宝' ? data.source : '供应商',
  supplierType: '临时',
  supplier: '',
  source: data?.source || '',
  purchaseUrl: '',
  isRefundable: data?.isRefundable === '是',
  sampleName: data?.productName || '',
  quantity: 1,
  price: 0,
  paymentMethod: '银行转账',
  bankAccount: '',
  accountName: '',
  bankName: '',
  refundMethod: '抵扣首单',
  refundCondition: '',
  sampleImages: [] as string[],
  orderScreenshots: [] as string[]
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
  margin: 0 20px 12px;
  padding: 8px 16px;
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
  box-shadow: 0 1px 3px rgba(0,0,0,0.02) !important;
  overflow: hidden;
  
  :deep(.el-tabs__header) {
    background-color: #f8fafc !important;
    margin: 0 !important;
    border-bottom: 1px solid #e2e8f0 !important;
    display: flex;
    align-items: center;
    padding: 0 4px;
  }

  :deep(.el-tabs__nav-wrap) {
    margin-bottom: -1px !important;
    &::after { display: none; }
  }

  :deep(.el-tabs__item) {
    height: 36px !important;
    line-height: 36px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    color: #64748b !important;
    border: none !important;
    transition: all 0.2s;
    margin: 0 2px;
    
    &.is-active {
      color: var(--el-color-primary) !important;
      background: #fff !important;
      font-weight: 600 !important;
      border-left: 1px solid #e2e8f0 !important;
      border-right: 1px solid #e2e8f0 !important;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: var(--el-color-primary);
      }
    }
    
    &:hover:not(.is-active) {
      color: var(--el-color-primary) !important;
    }
  }

  :deep(.el-tabs__new-tab) {
    margin-left: 12px !important;
    background: transparent !important;
    border: none !important;
    color: var(--el-color-primary) !important;
    width: auto !important;
    height: 36px !important;
    padding: 0 8px !important;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    cursor: pointer;
    
    .el-icon { 
      margin: 0 !important; 
      font-weight: bold;
      font-size: 14px;
    }
    &::after { 
      content: '新增方案'; 
      margin-left: 4px; 
      font-size: 13px; 
      font-weight: 500; 
    }
    
    &:hover {
      opacity: 0.8;
      background: transparent !important;
    }
  }

  :deep(.el-tabs__content) {
    padding: 20px 24px !important;
    background: #fff !important;
  }
}

.custom-form {
  :deep(.el-form-item) { 
    margin-bottom: 12px !important; 
    display: flex; 
    align-items: center; 
  }
  
  :deep(.el-form-item__label) { 
    font-weight: 600;
    color: #475569;
    padding-right: 8px !important;
    line-height: 1.2 !important;
    height: auto !important;
    display: flex;
    align-items: center;
    font-size: 12px;
  }

  /* 统一所有输入控件的样式 - 参考样品登记的超紧凑风格 */
  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper),
  :deep(.el-input-number__wrapper) {
    background-color: #ffffff !important;
    box-shadow: 0 0 0 1px #e5e7eb inset !important;
    border-radius: 4px !important;
    padding: 2px 10px !important;
    height: 30px !important;
    font-size: 12px !important;
    transition: all 0.15s ease;
    
    &:hover {
      box-shadow: 0 0 0 1px #cbd5e1 inset !important;
    }
    
    &.is-focus, &.is-focused {
      background-color: #ffffff !important;
      box-shadow: 0 0 0 1px #1890ff inset, 0 0 0 2px rgba(24, 144, 255, 0.05) !important;
    }
  }

  :deep(.el-input-number) {
    width: 100%;
    .el-input__wrapper {
      padding-right: 0 !important;
    }
  }
}

.total-price-text { color: #f59e0b; font-weight: 700; font-size: 16px; }

/* 退款提示样式 */
.refund-tip-wrapper {
  display: flex;
  align-items: center;
  height: 30px;
}
.refund-tip {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #0369a1;
  background: #f0f9ff;
  padding: 2px 10px;
  border-radius: 4px;
  border: 1px solid #bae6fd;
  line-height: 1.3;
  .el-icon { font-size: 13px; margin-right: 4px; }
}

:deep(.refundable-item) {
  margin-bottom: 0 !important;
  .el-form-item__label { width: 100px !important; justify-content: flex-start; }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 44px;
  box-sizing: border-box;
  
  .batch-info { font-size: 13px; color: #64748b; }
  
  .footer-right {
    display: flex; gap: 8px;
    :deep(.el-button) { height: 32px; padding: 0 20px; font-size: 13px; border-radius: 4px; }
  }
}

.w-full { width: 100%; }
.mr-8 { margin-right: 8px; }

/* 附件上传样式 */
.p-upload-inline {
  width: 100%;
}
.p-upload-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.p-upload-item {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  img { width: 100%; height: 100%; object-fit: cover; }
}
.p-upload-add {
  width: 60px;
  height: 60px;
  border: 1px dashed #cbd5e1;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: var(--el-color-primary); color: var(--el-color-primary); }
  .el-icon { font-size: 16px; margin-bottom: 2px; }
  span { font-size: 10px; transform: scale(0.9); }
}
</style>
