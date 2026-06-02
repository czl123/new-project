<template>
  <el-dialog
    v-model="visible"
    title="定制反馈"
    width="1100px"
    class="custom-feedback-dialog"
    destroy-on-close
  >
    <!-- 顶部说明区域 -->
    <div class="feedback-instruction">
      <el-icon class="mr-8"><InfoFilled /></el-icon>
      <span>请录入定制方案，支持添加多个对比方案进行分析。</span>
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
          :label="'反馈方案 ' + (index + 1)"
          :name="index"
          :closable="form.items.length > 1"
        >
          <el-form :model="form" ref="formRef" label-position="left" label-width="100px" class="feedback-form custom-form">
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item 
                  label="货源地" 
                  required
                  :prop="'items.' + index + '.source'"
                  :rules="{ required: true, message: '请选择货源地', trigger: 'change' }"
                >
                  <el-select v-model="item.source" placeholder="请选择" clearable class="w-full">
                    <el-option label="国内" value="domestic" />
                    <el-option label="国外" value="overseas" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item 
                  label="费用类型" 
                  required
                  :prop="'items.' + index + '.feeType'"
                  :rules="{ required: true, message: '请选择费用类型', trigger: 'change' }"
                >
                  <el-select v-model="item.feeType" placeholder="请选择" class="w-full">
                    <el-option label="开模费" value="mold_fee" />
                    <el-option label="打样费" value="sample_fee" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item 
                  label="费用金额" 
                  required
                  :prop="'items.' + index + '.moldFee'"
                  :rules="{ required: true, message: '请输入', trigger: 'blur' }"
                >
                  <el-input v-model="item.moldFee" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="item.feeType === 'mold_fee'">
                <el-form-item 
                  label="模具归属" 
                  required
                  :prop="'items.' + index + '.moldOwnership'"
                  :rules="{ required: true, message: '请选择模具归属', trigger: 'change' }"
                >
                  <el-select v-model="item.moldOwnership" placeholder="请选择" class="w-full">
                    <el-option label="共有" value="joint" />
                    <el-option label="公司" value="company" />
                    <el-option label="供应商" value="supplier" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item 
                  label="定制用时" 
                  required
                  :prop="'items.' + index + '.customTime'"
                  :rules="{ required: true, message: '请输入', trigger: 'blur' }"
                >
                  <el-input v-model="item.customTime" placeholder="请输入">
                    <template #append>天</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item 
                  label="初次报价" 
                  required
                  :prop="'items.' + index + '.initialQuote'"
                  :rules="{ required: true, message: '请输入', trigger: 'blur' }"
                >
                  <el-input v-model="item.initialQuote" placeholder="请输入">
                    <template #append>CNY</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item 
                  label="生产周期" 
                  required
                  :prop="'items.' + index + '.productionCycle'"
                  :rules="{ required: true, message: '请输入', trigger: 'blur' }"
                >
                  <el-input v-model="item.productionCycle" placeholder="请输入">
                    <template #append>天</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item 
                  label="起订量" 
                  required
                  :prop="'items.' + index + '.moq'"
                  :rules="{ required: true, message: '请输入', trigger: 'blur' }"
                >
                  <el-input v-model="item.moq" placeholder="请输入" />
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
              <template v-if="item.isRefundable">
                <el-col :span="6">
                  <el-form-item label="退款方式" required>
                    <el-select v-model="item.refundType" placeholder="请选择" class="w-full">
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
                    :prop="'items.' + index + '.refundCondition'"
                    :rules="[
                      { required: ['order_volume', 'order_amount'].includes(item.refundType), message: '请输入退款条件', trigger: 'blur' }
                    ]"
                  >
                    <el-input v-model="item.refundCondition" placeholder="请输入" class="w-full" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <div class="refund-tip-wrapper" v-if="item.refundType">
                    <div class="refund-tip">
                      <el-icon class="mr-4"><InfoFilled /></el-icon>
                      <span>{{ refundDescriptions[item.refundType] }}</span>
                    </div>
                  </div>
                </el-col>
              </template>
            </el-row>

            <el-form-item label="附加条件">
              <el-input
                v-model="item.additionalNotes"
                type="textarea"
                :rows="3"
                placeholder="请输入方案特殊说明"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <div class="footer-left">
          <span class="batch-info">共计 {{ form.items.length }} 个反馈方案</span>
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
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, InfoFilled } from '@element-plus/icons-vue'

const visible = ref(false)
const activeTab = ref(0)
const formRef = ref<any>(null)

const createEmptyItem = () => ({
  source: '',
  feeType: 'mold_fee',
  moldFee: '',
  moldOwnership: 'company',
  isRefundable: false,
  refundType: '',
  refundCondition: '',
  customTime: '',
  initialQuote: '',
  productionCycle: '',
  moq: '',
  additionalNotes: ''
})

const refundDescriptions: Record<string, string> = {
  first_order: '首单达到起订量即可退回费用',
  order_volume: '订单量累计达到设定数量后退回',
  order_amount: '订单金额累计达到设定金额后退回'
}

const form = ref({
  items: [createEmptyItem()]
})

const open = () => {
  visible.value = true
  form.value.items = [createEmptyItem()]
  activeTab.value = 0
}

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
  
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      ElMessage.success(`成功提交 ${form.value.items.length} 个反馈方案`)
      visible.value = false
    } else {
      ElMessage.warning('请完善必填信息')
    }
  })
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.feedback-instruction {
  margin: 0 20px 8px;
  padding: 6px 16px;
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
      font-size: 12px; 
      font-weight: 500; 
    }
    
    &:hover {
      opacity: 0.8;
      background: transparent !important;
    }
  }

  :deep(.el-tabs__content) {
    padding: 12px 24px !important;
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

  :deep(.el-input-group__append) {
    background-color: #f8fafc;
    border: 1px solid #e5e7eb;
    border-left: none;
    font-size: 11px;
    color: #64748b;
    padding: 0 8px;
  }

  :deep(.el-textarea__inner) {
    font-size: 12px;
    border-radius: 4px;
    box-shadow: 0 0 0 1px #e5e7eb inset !important;
    &:focus {
      box-shadow: 0 0 0 1px #1890ff inset !important;
    }
  }
}

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

.mr-8 { margin-right: 8px; }
.w-full { width: 100%; }
</style>
