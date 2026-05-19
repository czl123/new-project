<template>
  <el-dialog
    v-model="visible"
    title="样品测试评估"
    width="550px"
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      size="small"
    >
      <el-form-item label="样品信息">
        <el-tag type="info">{{ sampleData?.sampleNo }}</el-tag>
        <span style="margin-left: 10px">{{ sampleData?.sampleName }}</span>
      </el-form-item>

      <el-form-item label="测试结果" prop="result">
        <el-radio-group v-model="form.result">
          <el-radio label="1">合格</el-radio>
          <el-radio label="2">不合格(打回)</el-radio>
          <el-radio label="3">需重新拿样</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 级联逻辑 1：如果选择“合格”，展开升级开关 -->
      <transition name="el-zoom-in-top">
        <div v-if="form.result === '1'" class="cascade-section">
          <el-form-item label="升级确认样" prop="isUpgrade">
            <el-switch
              v-model="form.isUpgrade"
              active-text="是"
              inactive-text="否"
              inline-prompt
            />
            <span class="hint-text">（是否签字升级为【确认样】？）</span>
          </el-form-item>

          <!-- 级联逻辑 2：如果升级了确认样，展开大货标准选项 -->
          <transition name="el-zoom-in-top">
            <div v-if="form.isUpgrade">
              <el-form-item label="大货标准" prop="isMassProduction">
                <el-checkbox v-model="form.isMassProduction">
                  是否已达到大货标准，转为【产前/大货样】？
                </el-checkbox>
              </el-form-item>
            </div>
          </transition>
        </div>
      </transition>

      <el-form-item label="测试备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入测试详细评价或改进建议"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="handleSubmit">
        提交评估
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  sampleData: any
}>()

const emit = defineEmits(['update:modelValue', 'refresh'])

const visible = ref(false)
const loading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  result: '',
  isUpgrade: false,
  isMassProduction: false,
  remark: ''
})

const rules = {
  result: [{ required: true, message: '请选择测试结果', trigger: 'change' }]
}

watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 级联重置逻辑：当结果改变时，重置下级选项
watch(() => form.result, (newVal) => {
  if (newVal !== '1') {
    form.isUpgrade = false
    form.isMassProduction = false
  }
})

watch(() => form.isUpgrade, (newVal) => {
  if (!newVal) {
    form.isMassProduction = false
  }
})

const handleClosed = () => {
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        console.log('提交测试评估：', form)
        await new Promise(resolve => setTimeout(resolve, 800))
        ElMessage.success('评估提交成功')
        visible.value = false
        emit('refresh')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.cascade-section {
  background-color: #f9f9f9;
  padding: 15px 0 1px 0;
  margin-bottom: 18px;
  border-radius: 4px;
}
.hint-text {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}
</style>
