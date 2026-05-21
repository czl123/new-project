<template>
  <el-dialog
    v-model="visible"
    :title="`批量转换状态 - ${statusLabel}`"
    width="500px"
    destroy-on-close
    append-to-body
    class="batch-status-dialog"
  >
    <div class="selection-notice">
      <el-alert
        :title="`您已选择 ${selectedCount} 个样品进行状态转换`"
        type="info"
        show-icon
        :closable="false"
      />
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      style="margin-top: 20px;"
    >
      <!-- 已封存特有字段 -->
      <template v-if="targetStatus === '5'">
        <el-form-item label="封存地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入封存地点（如：A库房-03架）" />
        </el-form-item>
      </template>

      <!-- 统一的承接人和时间字段 (适用于除封存外的所有状态) -->
      <template v-else>
        <el-form-item label="承接人" prop="operator">
          <el-input v-model="form.operator" :placeholder="`请输入${statusLabel}承接人`" />
        </el-form-item>
        <el-form-item label="操作时间" prop="time">
          <el-date-picker
            v-model="form.time"
            type="datetime"
            placeholder="请选择时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
      </template>

      <el-form-item label="操作备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          rows="3"
          placeholder="请输入补充备注信息（可选）"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">确认转换</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const props = defineProps<{
  modelValue: boolean
  targetStatus: string // '2' | '4' | '5' | '6' | '7' | '8' | '12' | '13'
  selectedCount: number
}>()

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const formRef = ref()

const statusLabel = computed(() => {
  const map: any = { 
    '2': '领用中', 
    '4': '已归还',
    '5': '已封存', 
    '6': '已销毁', 
    '7': '已遗失',
    '8': '已内购',
    '12': '已退仓',
    '13': '已退供'
  }
  return map[props.targetStatus] || ''
})

const form = reactive({
  operator: '',
  time: '',
  location: '',
  remark: ''
})

const rules = {
  operator: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
  time: [{ required: true, message: '请选择操作时间', trigger: 'change' }],
  location: [{ required: true, message: '请输入封存地点', trigger: 'blur' }]
}

// 默认值设置
watch(() => props.modelValue, (val) => {
  if (val) {
    form.operator = ''
    form.time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    form.location = ''
    form.remark = ''
  }
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      // 模拟提交逻辑
      setTimeout(() => {
        emit('confirm', { ...form, status: props.targetStatus })
        loading.value = false
        visible.value = false
        ElMessage.success(`成功将 ${props.selectedCount} 个样品转换为 ${statusLabel.value} 状态`)
      }, 800)
    }
  })
}
</script>

<style scoped lang="scss">
.selection-notice {
  margin-bottom: 20px;
}
:deep(.el-form-item__label) {
  font-weight: 600;
  color: #475569;
}
</style>
