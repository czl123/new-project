<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { 
  Plus, Delete, DocumentAdd, Picture, Upload, InfoFilled, Box, Setting, Money, CopyDocument, Cellphone, Loading, Check, DocumentChecked, QuestionFilled
} from '@element-plus/icons-vue'
import { SAMPLE_SOURCE, SAMPLE_TYPE } from '@/views/sample/constants'

const props = defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'refresh'])

// 内部控制显示状态，优先使用本地 ref 以支持 open() 方法
const internalVisible = ref(false)
const dialogVisible = computed({
  get: () => props.modelValue !== undefined ? props.modelValue : internalVisible.value,
  set: (val) => {
    internalVisible.value = val
    emit('update:modelValue', val)
  }
})

const loading = ref(false)
const saving = ref(false)
const showQrCode = ref(false)
const qrCodeUrl = ref('')
const uploadStatus = ref<'idle' | 'waiting' | 'success'>('idle')
const currentImgIndex = ref(-1)
const formRef = ref<FormInstance>()
const createDefaultDetail = () => ({
  pattern: '',
  color: '',
  spec: '',
  length: undefined,
  width: undefined,
  height: undefined,
  sampleSizeUnit: 'cm',
  netWeight: undefined,
  netWeightUnit: 'g',
  images: [] as string[],
  pLength: undefined,
  pWidth: undefined,
  pHeight: undefined,
  packagingSizeUnit: 'cm',
  packagingWeight: undefined,
  packagingWeightUnit: 'g',
  size: '',
  diameter: undefined,
  diameterUnit: 'cm',
  capacity: undefined,
  capacityUnit: 'ml'
})

// 模拟正式供应商数据
const formalSuppliers = [
  { label: '浙江恒太工贸有限公司', value: 'S001' },
  { label: '广东奥飞娱乐股份有限公司', value: 'S002' },
  { label: '江苏美派玩具礼品有限公司', value: 'S003' }
]

// 模拟提案数据
const mockProposals = [
  { 
    label: 'PRP20260510-001 | 硅胶耐热厨具套装', 
    value: 'P001', 
    name: '硅胶耐热厨具套装', 
    manager: 'M201',
    style: '经典款',
    mainMaterial: '食品级硅胶',
    applicableTo: '家庭厨房'
  },
  { 
    label: 'PRP20260511-042 | 智能降噪头戴式耳机', 
    value: 'P002', 
    name: '智能降噪头戴式耳机', 
    manager: 'M202',
    style: '商务旗舰款',
    mainMaterial: '蛋白皮+轻质合金',
    applicableTo: '商务人士'
  },
  { 
    label: 'PRP20260512-015 | 便携式无线充移动电源', 
    value: 'P003', 
    name: '便携式无线充移动电源', 
    manager: 'M203',
    style: '极简便携款',
    mainMaterial: '防火PC+ABS',
    applicableTo: '通用'
  }
]

// 模拟人员数据
const mockStaff = {
  purchasers: [
    { label: '张三 (采购部)', value: 'U101' },
    { label: '李四 (采购部)', value: 'U102' },
    { label: '王五 (供应链组)', value: 'U103' }
  ],
  productManagers: [
    { label: '陈经理 (电子事业部)', value: 'M201' },
    { label: '林主管 (家居生活组)', value: 'M202' },
    { label: '赵经理 (运动户外组)', value: 'M203' }
  ]
}

const form = reactive({
  isLinkedToProposal: false,
  proposalId: '',
  source: '1',
  sampleType: '1',
  supplierType: '1',
  supplierName: '',
  purchaseUrl: '',
  shopName: '',
  purchaserId: '',
  productManagerId: '',
  name: '',
  style: '',
  mainMaterial: '',
  applicableTo: '',
  packagingMethod: '',
  packagingQuantity: '',
  hasBattery: false,
  isCE: false,
  sampleFee: 0,
  initialQuote: 0,
  taxRate: 13,
  moq: 100,
  productionCycle: 15,
  receiveDate: '',
  comparisonEndDate: '',
  description: '',
  qualifications: [] as any[],
  details: [createDefaultDetail()]
})

const rules = computed(() => ({
  name: [{ required: true, message: '请输入样品名称', trigger: 'blur' }],
  style: [{ required: true, message: '请输入款式', trigger: 'blur' }],
  mainMaterial: [{ required: true, message: '请输入主材料', trigger: 'blur' }],
  applicableTo: [{ required: true, message: '请输入适用品牌或对象', trigger: 'blur' }],
  sampleFee: [{ required: true, message: '请输入样品费', trigger: 'blur' }],
  proposalId: [{ required: form.isLinkedToProposal, message: '请选择对应提案项目', trigger: 'change' }],
  source: [{ required: true, message: '请选择拿样渠道', trigger: 'change' }],
  sampleType: [{ required: true, message: '请选择样品类型', trigger: 'change' }],
  receiveDate: [{ required: form.sampleType === '1', message: '请选择样品接收日期', trigger: 'change' }],
  supplierType: [{ required: true, message: '请选择供应商类型', trigger: 'change' }],
  supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
  purchaseUrl: [{ required: true, message: '请输入购买页面链接', trigger: 'blur' }],
  purchaserId: [{ required: true, message: '请选择采购员', trigger: 'change' }],
  productManagerId: [{ required: true, message: '请选择产品经理', trigger: 'change' }]
}))

const handleProposalChange = (val: string) => {
  const proposal = mockProposals.find(p => p.value === val)
  if (proposal) {
    form.name = proposal.name
    form.productManagerId = proposal.manager
    form.style = proposal.style
    form.mainMaterial = proposal.mainMaterial
    form.applicableTo = proposal.applicableTo
    ElMessage.success('已自动填充提案关联信息')
  }
}

const handleAddDetail = () => {
  form.details.push(createDefaultDetail())
}

const handleCopyDetail = (index: number) => {
  const copy = JSON.parse(JSON.stringify(form.details[index]))
  form.details.splice(index + 1, 0, copy)
  ElMessage.success('已复制规格行')
}

const handleImageSuccess = (file: any, index: number) => {
  if (file.raw) {
    const url = URL.createObjectURL(file.raw)
    form.details[index].images.push(url)
    ElMessage.success('图片已添加')
  }
}

const handleScanUpload = async (index: number) => {
  currentImgIndex.value = index
  uploadStatus.value = 'idle'
  
  try {
    const response = await fetch('http://127.0.0.1:3001/api/token/generate')
    const { token, mobileUrl } = await response.json()
    qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(mobileUrl)}`
    showQrCode.value = true
    const pollInterval = setInterval(async () => {
      if (!showQrCode.value) { clearInterval(pollInterval); return }
      try {
        const statusRes = await fetch(`http://127.0.0.1:3001/api/status/${token}`)
        const data = await statusRes.json()
        if (data.status === 'uploaded' && data.images.length > 0) {
          const currentImages = form.details[index].images
          data.images.forEach((url: string) => {
            if (!currentImages.includes(url)) {
              currentImages.push(url)
              uploadStatus.value = 'success'
              setTimeout(() => { if(showQrCode.value) uploadStatus.value = 'waiting' }, 1000)
            }
          })
        }
      } catch (err) {}
    }, 2000)
  } catch (err) {
    ElMessage.error('无法连接本地服务器，请确保 server.js 已启动')
  }
}

const handleRemoveImage = (rowIndex: number, imgIndex: number) => {
  form.details[rowIndex].images.splice(imgIndex, 1)
}

const handleRemoveDetail = (index: number) => {
  if (form.details.length > 1) {
    form.details.splice(index, 1)
  } else {
    ElMessage.warning('请至少保留一项规格明细')
  }
}

const handleClosed = () => {
  formRef.value?.resetFields()
  form.details = [createDefaultDetail()]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        ElMessage.success('数据已同步至云端')
        dialogVisible.value = false
        emit('refresh')
      } finally {
        loading.value = false
      }
    }
  })
}

const handleSave = async () => {
  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    ElMessage.success('草稿已保存')
  } finally {
    saving.value = false
  }
}

const open = (taskData?: any) => {
  dialogVisible.value = true
  if (taskData) {
    form.isLinkedToProposal = true
    form.proposalId = taskData.proposalNo || ''
    form.name = taskData.productName || ''
    form.supplierName = taskData.source || ''
    form.productManagerId = 'M201'
    form.purchaserId = 'U101'
  }
}

defineExpose({ open })
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="开发样登记"
    width="1400px"
    class="premium-dialog"
    @closed="handleClosed"
    align-center
  >
    <div class="p-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="110px"
        class="p-form"
      >
        <div class="p-main-layout">
          <div class="p-form-content">
            <div id="section-basic" class="p-section-card">
              <div class="p-section-header">
                <el-icon class="p-section-icon"><Box /></el-icon>
                <span>样品基础信息</span>
              </div>
              <div class="p-grid-row responsibility-row">
                <el-row :gutter="20">
                  <el-col :span="4">
                    <el-form-item label="关联提案">
                      <el-switch v-model="form.isLinkedToProposal" @change="form.proposalId = ''" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="form.isLinkedToProposal ? 8 : 0">
                    <el-form-item v-if="form.isLinkedToProposal" label="对应提案项目" prop="proposalId">
                      <el-select v-model="form.proposalId" placeholder="搜索项目" class="full-w" filterable @change="handleProposalChange">
                        <el-option v-for="p in mockProposals" :key="p.value" :label="p.label" :value="p.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="form.isLinkedToProposal ? 6 : 10">
                    <el-form-item label="产品经理" prop="productManagerId">
                      <el-select v-model="form.productManagerId" class="full-w" filterable>
                        <el-option v-for="m in mockStaff.productManagers" :key="m.value" :label="m.label" :value="m.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="form.isLinkedToProposal ? 6 : 10">
                    <el-form-item label="采购员" prop="purchaserId">
                      <el-select v-model="form.purchaserId" class="full-w" filterable>
                        <el-option v-for="u in mockStaff.purchasers" :key="u.value" :label="u.label" :value="u.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="p-grid-row">
                <el-row :gutter="32">
                  <el-col :span="6">
                    <el-form-item label="样品名称" prop="name">
                      <el-input v-model="form.name" placeholder="输入样品完整名称" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="款式" prop="style">
                      <el-input v-model="form.style" placeholder="如：升级款" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="主材料" prop="mainMaterial">
                      <el-input v-model="form.mainMaterial" placeholder="材质" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="适用品牌或对象" prop="applicableTo">
                      <el-input v-model="form.applicableTo" placeholder="适用范围" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="p-grid-row">
                <el-row :gutter="32">
                  <el-col :span="6">
                    <el-form-item label="样品类型" prop="sampleType">
                      <el-select v-model="form.sampleType" class="full-w" clearable>
                        <el-option v-for="item in SAMPLE_TYPE" :key="item.value" :label="item.label" :value="item.value">
                          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 20px;">
                            <span>{{ item.label }}</span>
                            <span style="color: #909399; font-size: 10px;">{{ item.desc }}</span>
                          </div>
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-if="form.sampleType === '1'">
                    <el-form-item label="样品接收日期" prop="receiveDate">
                      <el-date-picker v-model="form.receiveDate" type="date" placeholder="选择日期" class="full-w" value-format="YYYY-MM-DD" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" v-if="['6', '7', '8'].includes(form.sampleType)">
                    <el-form-item label="对比结束日期" prop="comparisonEndDate">
                      <el-date-picker v-model="form.comparisonEndDate" type="date" placeholder="选择日期" class="full-w" value-format="YYYY-MM-DD" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="样品费" prop="sampleFee">
                      <div class="p-input-with-unit">
                        <el-input-number v-model="form.sampleFee" :precision="2" :controls="false" class="full-w" />
                        <span class="p-unit-tag">元</span>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="p-grid-row">
                <el-row :gutter="32">
                  <el-col :span="6">
                    <el-form-item label="拿样渠道" prop="source">
                      <el-select v-model="form.source" class="full-w" clearable>
                        <el-option v-for="item in SAMPLE_SOURCE" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="form.source === '1' ? 4 : 0">
                    <el-form-item v-if="form.source === '1'" label="供应商类型">
                      <el-select v-model="form.supplierType" class="full-w" clearable>
                        <el-option label="正式" value="1" /><el-option label="临时" value="2" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="form.source === '1' ? 14 : 18">
                    <el-form-item v-if="form.source === '1'" label="供应商名称" prop="supplierName">
                      <el-select v-if="form.supplierType === '1'" v-model="form.supplierName" placeholder="选择供应商" class="full-w" filterable clearable>
                        <el-option v-for="s in formalSuppliers" :key="s.value" :label="s.label" :value="s.label" />
                      </el-select>
                      <el-input v-else v-model="form.supplierName" placeholder="输入临时供应商名称" clearable />
                    </el-form-item>
                    <el-form-item v-else label="购买链接" prop="purchaseUrl">
                      <el-input v-model="form.purchaseUrl" placeholder="粘贴链接" clearable>
                        <template #prepend>{{ form.source === '2' ? '1688' : '淘宝' }}</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="p-grid-row">
                <el-row :gutter="32">
                  <el-col :span="6">
                    <el-form-item label="包装方式">
                      <el-select v-model="form.packagingMethod" placeholder="请选择" class="full-w" clearable>
                        <el-option label="盒装" value="盒装" /><el-option label="袋装" value="袋装" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <template #label>
                        <div style="display: flex; align-items: center; gap: 4px;">
                          <span>包装数量</span>
                          <el-tooltip effect="dark" placement="top">
                            <template #content>示例1:1pack<br />示例2:1pack+2pack+3pack</template>
                            <el-icon style="cursor: help; color: #94a3b8; font-size: 14px;"><QuestionFilled /></el-icon>
                          </el-tooltip>
                        </div>
                      </template>
                      <el-input v-model="form.packagingQuantity" placeholder="如: 1pack" class="full-w" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="是否带电">
                      <el-select v-model="form.hasBattery" class="full-w" clearable>
                        <el-option label="是" :value="true" /><el-option label="否" :value="false" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="是否CE类">
                      <el-select v-model="form.isCE" class="full-w" clearable>
                        <el-option label="是" :value="true" /><el-option label="否" :value="false" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="p-grid-row">
                <el-row :gutter="32">
                  <el-col :span="6">
                    <el-form-item label="初次报价">
                      <div class="p-input-with-unit">
                        <el-input-number v-model="form.initialQuote" :precision="2" :controls="false" class="full-w" />
                        <span class="p-unit-tag">元</span>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="税率">
                      <div class="p-input-with-unit">
                        <el-input-number v-model="form.taxRate" :controls="false" class="full-w" />
                        <span class="p-unit-tag">%</span>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="起订量">
                      <el-input-number v-model="form.moq" :controls="false" class="full-w" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="生产周期">
                      <div class="p-input-with-unit">
                        <el-input-number v-model="form.productionCycle" :controls="false" class="full-w" />
                        <span class="p-unit-tag">天</span>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="p-grid-row">
                <el-row :gutter="32">
                  <el-col :span="16">
                    <el-form-item label="样品说明">
                      <el-input v-model="form.description" type="textarea" :rows="1" placeholder="详情描述..." />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="产品资质">
                      <el-upload action="#" :auto-upload="false" v-model:file-list="form.qualifications" multiple :limit="5" class="p-qual-upload">
                        <template #trigger>
                          <div class="p-upload-trigger-mini"><el-icon><DocumentAdd /></el-icon><span>上传资质</span></div>
                        </template>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div id="section-table" class="p-section-card no-padding">
              <div class="p-section-header between" style="padding: 12px 12px 8px;">
                <div class="left" style="display: flex; align-items: center; gap: 8px;">
                  <el-icon class="p-section-icon"><Setting /></el-icon>
                  <span>样品规格信息</span>
                </div>
                <el-button @click="handleAddDetail" class="p-add-row-btn" :icon="Plus">添加规格</el-button>
              </div>
              <div class="p-data-grid">
                <el-table :data="form.details" class="p-table" :border="false" style="width: 100%" max-height="400px">
                  <el-table-column label="图片" width="80" align="center" fixed label-class-name="p-required">
                    <template #default="scope">
                      <el-form-item :prop="'details.' + scope.$index + '.images'" :rules="{ required: true, type: 'array', min: 1, message: '', trigger: 'change' }">
                        <el-popover placement="right" :width="260" trigger="click" popper-class="p-img-manager-popover">
                          <template #reference>
                            <div class="p-cell-img-preview">
                              <div v-if="scope.row.images.length === 0" class="p-img-empty"><el-icon><Picture /></el-icon></div>
                              <div v-else class="p-img-main-wrapper">
                                <img :src="scope.row.images[0]" class="p-img-main" />
                                <div v-if="scope.row.images.length > 1" class="p-img-count-badge">+{{ scope.row.images.length - 1 }}</div>
                              </div>
                            </div>
                          </template>
                          <div class="p-img-manager">
                            <div class="p-mgr-header">
                              <span>图片管理 ({{ scope.row.images.length }})</span>
                              <div class="p-mgr-btns">
                                <el-button link type="primary" :icon="Cellphone" @click="handleScanUpload(scope.$index)">扫码上传</el-button>
                                <el-upload action="#" :show-file-list="false" :auto-upload="false" :on-change="(file) => handleImageSuccess(file, scope.$index)">
                                  <el-button link type="primary" :icon="Plus">添加图片</el-button>
                                </el-upload>
                              </div>
                            </div>
                            <div class="p-mgr-grid">
                              <div v-for="(img, idx) in scope.row.images" :key="idx" class="p-mgr-item">
                                <el-image :src="img" :preview-src-list="scope.row.images" :initial-index="idx" fit="cover" preview-teleported class="p-mgr-el-img" />
                                <div class="p-mgr-del" @click.stop="handleRemoveImage(scope.$index, idx)"><el-icon><Delete /></el-icon></div>
                              </div>
                              <div v-if="scope.row.images.length === 0" class="p-mgr-empty">暂无图片</div>
                            </div>
                          </div>
                        </el-popover>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="图案" min-width="100" label-class-name="p-required">
                    <template #default="scope">
                      <el-form-item :prop="'details.' + scope.$index + '.pattern'" :rules="{ required: true, message: '', trigger: 'blur' }">
                        <el-input v-model="scope.row.pattern" placeholder="输入图案" class="p-ghost-input" clearable />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="颜色" min-width="100" label-class-name="p-required">
                    <template #default="scope">
                      <el-form-item :prop="'details.' + scope.$index + '.color'" :rules="{ required: true, message: '', trigger: 'blur' }">
                        <el-input v-model="scope.row.color" placeholder="输入颜色" class="p-ghost-input" clearable />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="规格" min-width="120" label-class-name="p-required">
                    <template #default="scope">
                      <el-form-item :prop="'details.' + scope.$index + '.spec'" :rules="{ required: true, message: '', trigger: 'change' }">
                        <el-select v-model="scope.row.spec" placeholder="选择规格" class="p-ghost-select full-w" clearable>
                          <el-option label="通用" value="通用" /><el-option label="英规" value="英规" /><el-option label="美规" value="美规" />
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="样品尺寸" min-width="210" label-class-name="p-required">
                    <template #default="scope">
                      <el-form-item :prop="'details.' + scope.$index + '.length'" :rules="{ required: true, message: '', trigger: 'blur' }">
                        <div class="p-unit-input-group">
                          <div class="p-dim-group">
                            <el-input-number v-model="scope.row.length" :controls="false" placeholder="长" class="p-dim-input" />
                            <span class="p-dim-sep">×</span>
                            <el-input-number v-model="scope.row.width" :controls="false" placeholder="宽" class="p-dim-input" />
                            <span class="p-dim-sep">×</span>
                            <el-input-number v-model="scope.row.height" :controls="false" placeholder="高" class="p-dim-input" />
                          </div>
                          <div class="p-unit-switcher">
                            <span :class="{ active: scope.row.sampleSizeUnit === 'cm' }" @click="scope.row.sampleSizeUnit = 'cm'">cm</span>
                            <span :class="{ active: scope.row.sampleSizeUnit === 'mm' }" @click="scope.row.sampleSizeUnit = 'mm'">mm</span>
                          </div>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="净重" width="110" label-class-name="p-required">
                    <template #default="scope">
                      <el-form-item :prop="'details.' + scope.$index + '.netWeight'" :rules="{ required: true, message: '', trigger: 'blur' }">
                        <div class="p-unit-input-group">
                          <el-input-number v-model="scope.row.netWeight" :controls="false" placeholder="净重" class="p-table-input-number" />
                          <div class="p-unit-switcher mini">
                            <span :class="{ active: scope.row.netWeightUnit === 'g' }" @click="scope.row.netWeightUnit = 'g'">g</span>
                            <span :class="{ active: scope.row.netWeightUnit === 'kg' }" @click="scope.row.netWeightUnit = 'kg'">kg</span>
                          </div>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="90" align="center" fixed="right">
                    <template #default="scope">
                      <div class="p-row-actions">
                        <el-button class="p-row-action-btn" link :icon="CopyDocument" @click="handleCopyDetail(scope.$index)" />
                        <el-button class="p-row-action-btn del" link :icon="Delete" @click="handleRemoveDetail(scope.$index)" />
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="p-footer">
        <div class="p-footer-info"><el-icon class="p-info-icon"><InfoFilled /></el-icon><span>请确认信息完整后提交</span></div>
        <div class="p-footer-actions">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" plain @click="handleSave" :loading="saving">保存</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="loading">提交</el-button>
        </div>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="showQrCode" title="扫码同步图片" width="420px" align-center class="qr-upload-dialog">
    <div class="qr-container">
      <div class="qr-main-layout">
        <div class="qr-left">
          <div class="qr-code-wrapper"><el-image :src="qrCodeUrl" class="qr-image" /></div>
          <div class="qr-hint">拍完即传</div>
        </div>
        <div class="qr-sync-list">
          <div class="sync-header">已同步 ({{ form.details[currentImgIndex]?.images.length || 0 }})</div>
          <div class="sync-grid">
            <div v-for="(img, i) in form.details[currentImgIndex]?.images" :key="i" class="sync-item"><img :src="img" /></div>
          </div>
        </div>
      </div>
      <div class="qr-footer-actions"><el-button type="primary" @click="showQrCode = false">完成</el-button></div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.p-container { background: #f8fafc; overflow: hidden; }
.p-main-layout { display: flex; flex-direction: column; max-height: 82vh; }
.p-form-content { flex: 1; padding: 8px; overflow-y: auto; &::-webkit-scrollbar { width: 5px; } &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; } }
.p-section-card { background: #fff; border-radius: 6px; border: 1px solid #f1f5f9; padding: 8px 12px; margin-bottom: 8px; &.no-padding { padding: 0; } .p-section-header { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 8px; &.between { justify-content: space-between; } .p-section-icon { color: #1890ff; } } }
.p-grid-row { padding: 0 16px; margin-bottom: 20px; &.responsibility-row { background: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; } }
.p-form { :deep(.el-form-item) { margin-bottom: 0; display: flex; align-items: center; } :deep(.el-form-item__label) { font-weight: 600; color: #475569; line-height: 1.2 !important; display: flex; align-items: center; } :deep(.el-input__wrapper), :deep(.el-select__wrapper) { height: 30px !important; font-size: 12px !important; } }
.p-data-grid { border: 1px solid #f1f5f9; border-radius: 8px; .p-table { :deep(th) { background: #f8fafc; font-size: 11px; } :deep(.el-form-item__error) { display: none; } } }
.p-cell-img-preview { width: 44px; height: 44px; margin: 0 auto; cursor: pointer; }
.p-img-empty { width: 100%; height: 100%; background: #f1f5f9; border: 1px dashed #cbd5e1; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.p-img-main-wrapper { width: 100%; height: 100%; border-radius: 6px; overflow: hidden; .p-img-main { width: 100%; height: 100%; object-fit: cover; } }
.p-unit-input-group { display: flex; align-items: center; border: 1px solid #e5e7eb; border-radius: 6px; padding: 2px; .p-dim-group { display: flex; flex: 1; .p-dim-input { flex: 1; } } .p-unit-switcher { display: flex; background: #f1f5f9; padding: 2px; span { padding: 0 6px; font-size: 10px; cursor: pointer; &.active { background: #fff; color: #1890ff; } } } }
.p-footer { padding: 4px 20px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; .p-footer-info { font-size: 11px; display: flex; align-items: center; gap: 6px; } }
.full-w { width: 100%; }
.qr-container { padding: 20px; .qr-main-layout { display: flex; gap: 20px; .qr-left { flex: 0 0 160px; .qr-code-wrapper { width: 160px; height: 160px; border: 1px solid #e2e8f0; } } .qr-sync-list { flex: 1; background: #f8fafc; padding: 12px; height: 200px; } } }
</style>
