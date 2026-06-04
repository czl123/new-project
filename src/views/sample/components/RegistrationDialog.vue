<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { 
  Plus, Delete, DocumentAdd, Picture, Upload, InfoFilled, Box, Setting, Money, CopyDocument, Cellphone, Loading, Check, DocumentChecked, QuestionFilled
} from '@element-plus/icons-vue'
import { SAMPLE_SOURCE, SAMPLE_TYPE } from '../constants'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'refresh'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
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
    // 1. 从本地服务器获取 Token 和 移动端上传地址
    const response = await fetch('http://127.0.0.1:3001/api/token/generate')
    const { token, mobileUrl } = await response.json()
    
    // 2. 生成二维码（使用公共 API 将移动端地址转为二维码）
    qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(mobileUrl)}`
    showQrCode.value = true
    
    // 3. 开始轮询服务器状态
    const pollInterval = setInterval(async () => {
      if (!showQrCode.value) {
        clearInterval(pollInterval)
        return
      }

      try {
        const statusRes = await fetch(`http://127.0.0.1:3001/api/status/${token}`)
        const data = await statusRes.json()
        
        if (data.status === 'uploaded' && data.images.length > 0) {
          // 比较当前已有的图片，只添加新上传的
          const currentImages = form.details[index].images
          data.images.forEach((url: string) => {
            if (!currentImages.includes(url)) {
              currentImages.push(url)
              uploadStatus.value = 'success'
              // 1秒后重置为 waiting，以便显示“检测到新图片”
              setTimeout(() => { if(showQrCode.value) uploadStatus.value = 'waiting' }, 1000)
            }
          })
        }
      } catch (err) {
        console.error('轮询失败:', err)
      }
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
        ElMessage({
          message: '数据已同步至云端',
          type: 'success',
          plain: true
        })
        dialogVisible.value = false
        emit('refresh')
      } finally {
        loading.value = false
      }
    }
  })
}

const handleSave = async () => {
  // 保存通常不进行强制校验，或者只进行基础校验
  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    ElMessage.success('草稿已保存')
    // 保存后不关闭弹窗
  } finally {
    saving.value = false
  }
}
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
          <!-- Scrollable Content Area -->
          <div class="p-form-content">
            <!-- Section 1: Basic -->
            <div id="section-basic" class="p-section-card">
              <div class="p-section-header">
                <el-icon class="p-section-icon"><Box /></el-icon>
                <span>样品基础信息</span>
              </div>

              <!-- Row 1: Responsibility & Linking -->
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

              <!-- Row 2: Core Identity -->
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

              <!-- Row 3: Source & Origin -->
              <div class="p-grid-row">
                <el-row :gutter="32">
                  <el-col :span="6">
                    <el-form-item label="样品类型" prop="sampleType">
                      <el-select v-model="form.sampleType" class="full-w" clearable>
                        <el-option 
                          v-for="item in SAMPLE_TYPE" 
                          :key="item.value" 
                          :label="item.label" 
                          :value="item.value"
                        >
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

              <!-- Row 4: Source Details (Source -> Supplier/Link) -->
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

              <!-- Row 5: Packaging & Characteristics -->
              <div class="p-grid-row">
                <el-row :gutter="32">
                  <el-col :span="6">
                    <el-form-item label="包装方式">
                      <el-select v-model="form.packagingMethod" placeholder="请选择" class="full-w" clearable>
                        <el-option label="盒装" value="盒装" />
                        <el-option label="袋装" value="袋装" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <template #label>
                        <div style="display: flex; align-items: center; gap: 4px;">
                          <span>包装数量</span>
                          <el-tooltip effect="dark" placement="top">
                            <template #content>
                              示例1:1pack<br />
                              示例2:1pack+2pack+3pack
                            </template>
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
                        <el-option label="是" :value="true" />
                        <el-option label="否" :value="false" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="是否CE类">
                      <el-select v-model="form.isCE" class="full-w" clearable>
                        <el-option label="是" :value="true" />
                        <el-option label="否" :value="false" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>

              <!-- Row 5: Commercial -->
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

              <!-- Row 6: Notes & Qualifications -->
              <div class="p-grid-row">
                <el-row :gutter="32">
                  <el-col :span="16">
                    <el-form-item label="样品说明">
                      <el-input v-model="form.description" type="textarea" :rows="1" placeholder="详情描述..." />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="产品资质">
                      <el-upload
                        action="#"
                        :auto-upload="false"
                        v-model:file-list="form.qualifications"
                        multiple
                        :limit="5"
                        class="p-qual-upload"
                      >
                        <template #trigger>
                          <div class="p-upload-trigger-mini">
                            <el-icon><DocumentAdd /></el-icon>
                            <span>上传资质</span>
                          </div>
                        </template>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>

            <!-- Section 2: Table -->
            <div id="section-table" class="p-section-card no-padding">
              <div class="p-section-header between" style="padding: 12px 12px 8px;">
                <div class="left" style="display: flex; align-items: center; gap: 8px;">
                  <el-icon class="p-section-icon"><Setting /></el-icon>
                  <span>样品规格信息</span>
                </div>
                <el-button @click="handleAddDetail" class="p-add-row-btn" :icon="Plus">
                  添加规格
                </el-button>
              </div>

              <div class="p-data-grid">
                <el-table :data="form.details" class="p-table" :border="false" style="width: 100%" max-height="400px">
                  <el-table-column label="图片" width="80" align="center" fixed label-class-name="p-required">
                    <template #default="scope">
                      <el-form-item :prop="'details.' + scope.$index + '.images'" :rules="{ required: true, type: 'array', min: 1, message: '', trigger: 'change' }">
                        <el-popover
                          placement="right"
                          :width="260"
                          trigger="click"
                          popper-class="p-img-manager-popover"
                        >
                          <template #reference>
                            <div class="p-cell-img-preview">
                              <div v-if="scope.row.images.length === 0" class="p-img-empty">
                                <el-icon><Picture /></el-icon>
                              </div>
                              <div v-else class="p-img-main-wrapper">
                                <img :src="scope.row.images[0]" class="p-img-main" />
                                <div v-if="scope.row.images.length > 1" class="p-img-count-badge">
                                  +{{ scope.row.images.length - 1 }}
                                </div>
                              </div>
                            </div>
                          </template>

                          <!-- Popover Content: Image Manager -->
                          <div class="p-img-manager">
                            <div class="p-mgr-header">
                              <span>图片管理 ({{ scope.row.images.length }})</span>
                              <div class="p-mgr-btns">
                                <el-button link type="primary" :icon="Cellphone" @click="handleScanUpload(scope.$index)">扫码上传</el-button>
                                <el-upload 
                                  action="#" 
                                  :show-file-list="false" 
                                  :auto-upload="false"
                                  :on-change="(file: any) => handleImageSuccess(file, scope.$index)"
                                >
                                  <el-button link type="primary" :icon="Plus">添加图片</el-button>
                                </el-upload>
                              </div>
                            </div>
                            <div class="p-mgr-grid">
                              <div 
                                v-for="(img, idx) in scope.row.images" 
                                :key="idx" 
                                class="p-mgr-item"
                              >
                                <el-image 
                                  :src="img" 
                                  :preview-src-list="scope.row.images" 
                                  :initial-index="idx"
                                  fit="cover"
                                  preview-teleported
                                  class="p-mgr-el-img"
                                />
                                <div class="p-mgr-del" @click.stop="handleRemoveImage(scope.$index, idx)">
                                  <el-icon><Delete /></el-icon>
                                </div>
                              </div>
                              <div v-if="scope.row.images.length === 0" class="p-mgr-empty">
                                暂无图片，点击上方按钮添加
                              </div>
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
                          <el-option label="通用" value="通用" />
                          <el-option label="英规" value="英规" />
                          <el-option label="美规" value="美规" />
                          <el-option label="欧规" value="欧规" />
                          <el-option label="日规" value="日规" />
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

                  <el-table-column label="包装尺寸" min-width="210">
                    <template #default="scope">
                      <div class="p-unit-input-group">
                        <div class="p-dim-group">
                          <el-input-number v-model="scope.row.pLength" :controls="false" placeholder="长" class="p-dim-input" />
                          <span class="p-dim-sep">×</span>
                          <el-input-number v-model="scope.row.pWidth" :controls="false" placeholder="宽" class="p-dim-input" />
                          <span class="p-dim-sep">×</span>
                          <el-input-number v-model="scope.row.pHeight" :controls="false" placeholder="高" class="p-dim-input" />
                        </div>
                        <div class="p-unit-switcher">
                          <span :class="{ active: scope.row.packagingSizeUnit === 'cm' }" @click="scope.row.packagingSizeUnit = 'cm'">cm</span>
                          <span :class="{ active: scope.row.packagingSizeUnit === 'mm' }" @click="scope.row.packagingSizeUnit = 'mm'">mm</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column label="包装重量" width="110">
                    <template #default="scope">
                      <div class="p-unit-input-group">
                        <el-input-number v-model="scope.row.packagingWeight" :controls="false" placeholder="重量" class="p-table-input-number" />
                        <div class="p-unit-switcher mini">
                          <span :class="{ active: scope.row.packagingWeightUnit === 'g' }" @click="scope.row.packagingWeightUnit = 'g'">g</span>
                          <span :class="{ active: scope.row.packagingWeightUnit === 'kg' }" @click="scope.row.packagingWeightUnit = 'kg'">kg</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column label="尺码" width="90">
                    <template #default="scope">
                      <el-input v-model="scope.row.size" placeholder="尺码" class="p-ghost-input" clearable />
                    </template>
                  </el-table-column>

                  <el-table-column label="直径" width="130">
                    <template #default="scope">
                      <div class="p-unit-input-group">
                        <el-input-number v-model="scope.row.diameter" :controls="false" placeholder="直径" class="p-table-input-number" />
                        <div class="p-unit-switcher mini">
                          <span :class="{ active: scope.row.diameterUnit === 'cm' }" @click="scope.row.diameterUnit = 'cm'">cm</span>
                          <span :class="{ active: scope.row.diameterUnit === 'mm' }" @click="scope.row.diameterUnit = 'mm'">mm</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column label="容量" width="110">
                    <template #default="scope">
                      <div class="p-unit-input-group">
                        <el-input-number v-model="scope.row.capacity" :controls="false" placeholder="容量" class="p-table-input-number" />
                        <div class="p-unit-switcher mini">
                          <span :class="{ active: scope.row.capacityUnit === 'ml' }" @click="scope.row.capacityUnit = 'ml'">ml</span>
                          <span :class="{ active: scope.row.capacityUnit === 'l' }" @click="scope.row.capacityUnit = 'l'">L</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="90" align="center" fixed="right">
                    <template #default="scope">
                      <div class="p-row-actions">
                        <el-button 
                          class="p-row-action-btn" 
                          link 
                          :icon="CopyDocument"
                          title="复制此行"
                          @click="handleCopyDetail(scope.$index)"
                        />
                        <el-button 
                          class="p-row-action-btn del" 
                          link 
                          :icon="Delete"
                          title="删除此行"
                          @click="handleRemoveDetail(scope.$index)"
                        />
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

    <!-- Custom Footer -->
    <template #footer>
      <div class="p-footer">
        <div class="p-footer-info">
          <el-icon class="p-info-icon"><InfoFilled /></el-icon>
          <span>当前已录入 {{ form.details.length }} 项规格条目，请确认信息完整后提交。</span>
        </div>
        <div class="p-footer-actions">
          <button class="p-btn-secondary" @click="dialogVisible = false">取消</button>
          <button class="p-btn-secondary" :disabled="saving || loading" @click="handleSave">
            <el-icon v-if="saving" class="is-loading"><Loading /></el-icon>
            {{ saving ? '保存中...' : '保存' }}
          </button>
          <button class="p-btn-primary" :disabled="loading || saving" @click="handleSubmit">
            <el-icon v-if="loading" class="is-loading"><Loading /></el-icon>
            {{ loading ? '提交中...' : '提交' }}
          </button>
        </div>
      </div>
    </template>
  </el-dialog>

  <!-- 扫码上传弹窗 -->
  <el-dialog
    v-model="showQrCode"
    title="扫码同步样品图片"
    width="420px"
    align-center
    class="qr-upload-dialog"
    :close-on-click-modal="false"
  >
    <div class="qr-container">
      <div class="qr-main-layout">
        <div class="qr-left">
          <div class="qr-code-wrapper">
            <el-image :src="qrCodeUrl" class="qr-image" />
            
            <!-- 状态提示 -->
            <div v-if="uploadStatus === 'success'" class="qr-status-toast">
              <el-icon><Check /></el-icon>
              <span>同步成功</span>
            </div>
          </div>
          <div class="qr-hint">手机扫码，拍完即传</div>
        </div>

        <!-- 实时预览区 -->
        <div class="qr-sync-list">
          <div class="sync-header">已实时同步 ({{ form.details[currentImgIndex]?.images.length || 0 }})</div>
          <div class="sync-grid">
            <div v-for="(img, i) in form.details[currentImgIndex]?.images" :key="i" class="sync-item">
              <img :src="img" />
            </div>
            <div v-if="!form.details[currentImgIndex]?.images.length" class="sync-empty">
              等待手机拍照...
            </div>
          </div>
        </div>
      </div>
      
      <div class="qr-footer-actions">
        <el-button type="primary" class="qr-done-btn" @click="showQrCode = false">同步完成</el-button>
        <p class="qr-timer">该二维码将在 5 分钟后失效</p>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
/* ... existing premium-dialog styles ... */

/* QR Upload Dialog Refined */
:deep(.qr-upload-dialog) {
  border-radius: 16px;
  .el-dialog__header {
    border-bottom: 1px solid #f1f5f9;
    padding: 16px 20px;
    .el-dialog__title { font-size: 15px; font-weight: 700; color: #1e293b; }
  }
  .el-dialog__body { padding: 20px; }
}

.qr-main-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.qr-left {
  flex: 0 0 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.qr-code-wrapper {
  width: 160px;
  height: 160px;
  background: #fff;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  .qr-image { width: 100%; height: 100%; }
}

.qr-status-toast {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(34, 197, 94, 0.9);
  color: #fff;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px;
  animation: fadeInOut 1s ease forwards;
  
  .el-icon { font-size: 32px; }
  span { font-size: 12px; font-weight: 600; }
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}

.qr-hint {
  font-size: 12px; color: #64748b; font-weight: 500;
}

.qr-sync-list {
  flex: 1;
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  height: 200px;
  display: flex;
  flex-direction: column;
  border: 1px solid #f1f5f9;
  
  .sync-header {
    font-size: 11px; font-weight: 700; color: #1890ff; margin-bottom: 10px;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  
  .sync-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    overflow-y: auto;
    
    .sync-item {
      aspect-ratio: 1; border-radius: 4px; overflow: hidden; border: 1px solid #e2e8f0;
      img { width: 100%; height: 100%; object-fit: cover; }
    }
    
    .sync-empty {
      grid-column: span 3;
      padding-top: 40px; text-align: center; font-size: 11px; color: #94a3b8;
    }
  }
}

.qr-footer-actions {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  
  .qr-done-btn {
    width: 100%; height: 40px; border-radius: 10px; font-weight: 600;
  }
  
  .qr-timer { font-size: 11px; color: #94a3b8; }
}

/* Qual Upload Optimized */
.p-qual-upload {
  :deep(.el-upload-list) {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .el-upload-list__item {
      margin-bottom: 0;
      border: 1px solid #f1f5f9;
      border-radius: 6px;
      transition: all 0.2s;
      background: #fcfdfe;
      padding: 4px 8px;
      height: 32px;
      
      &:hover {
        background: #f1f5f9;
        border-color: #e2e8f0;
      }
      
      .el-upload-list__item-name {
        font-size: 11px;
        color: #475569;
        display: flex;
        align-items: center;
        gap: 6px;
        padding-left: 0;
        
        &::before {
          content: '\e6e4'; /* Element icon code for document */
          font-family: 'element-icons' !important;
          color: #94a3b8;
        }
      }
      
      .el-icon--close {
        top: 8px;
        right: 8px;
        font-size: 12px;
      }
    }
  }
}

.p-upload-trigger-mini {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  height: 26px;
  background: #f1f5f9;
  border-radius: 4px;
  color: #475569;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  width: fit-content;
  
  &:hover {
    background: #e2e8f0;
    color: #1890ff;
    border-color: #cbd5e1;
  }
  
  .el-icon {
    font-size: 14px;
  }
}

/* Container & Layout */
.p-container {
  background: #f8fafc;
  overflow: hidden;
}

.p-main-layout {
  display: flex;
  flex-direction: column;
  min-height: 500px; /* 最小高度，防止弹窗太小显得单薄 */
  max-height: 82vh;  /* 最大高度，防止超出屏幕 */
}

/* Sidebar Navigation */
.p-aside {
  width: 160px;
  background: #ffffff;
  border-right: 1px solid #f1f5f9;
  padding: 16px 0;
  flex-shrink: 0;

  .p-nav-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 12px;
  }

  .p-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: #64748b;
    font-size: 13px;
    font-weight: 500;

    .el-icon {
      font-size: 16px;
    }

    &:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    &.active {
      background: #e6f7ff;
      color: #1890ff;
      font-weight: 600;
    }
  }
}

/* Content Area */
.p-form-content {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
}

.p-section-card {
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02);
  padding: 8px 12px;
  margin-bottom: 8px;

  &.no-padding {
    padding: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }

  .p-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
    
    &.between { 
      justify-content: space-between; 
      margin-bottom: 6px;
    }
    
    .p-section-icon {
      font-size: 16px;
      color: #1890ff;
    }
  }
}
/* Grid & Inputs */
.p-grid-row {
  padding: 0 16px;
  margin-bottom: 20px;
  &:last-child { margin-bottom: 0; }

  &.responsibility-row {
    background: #f8fafc;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    margin-bottom: 20px;
  }
}
.p-form {
  :deep(.el-form-item) {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    position: relative;
  }
  :deep(.el-form-item__error) {
    font-size: 10px;
    padding-top: 1px;
    line-height: 1;
    position: absolute;
    top: 100%;
    left: 0;
  }
  :deep(.el-form-item__label) {
    font-weight: 600;
    color: #475569;
    padding-right: 2px !important;
    line-height: 1.2 !important;
    height: auto !important;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    &::before {
      margin-right: 4px !important;
      color: #ef4444 !important;
    }
  }
  :deep(.el-form-item__content) {
    margin-left: 0 !important;
    flex: 1;
    min-width: 0;
  }

  /* 统一所有输入控件的样式 - 超紧凑 */
  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper),
  :deep(.el-textarea__inner) {
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

  :deep(.el-textarea__inner) {
    height: auto !important;
    min-height: 30px !important;
    padding: 6px 10px !important;
  }

  :deep(.el-select) {
    width: 100%;
    .el-select__wrapper {
      line-height: 1;
      min-height: 30px !important;
    }
  }

  :deep(.el-input-number) {
    width: 100%;
    .el-input__wrapper {
      padding-right: 28px !important;
    }
  }
}

.p-mini-radio-group {
  display: flex;
  width: 100%;
  :deep(.el-radio-button__inner) {
    flex: 1;
    padding: 6px 0 !important;
    font-size: 12px !important;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    border-color: #e5e7eb !important;
    background: #f9fafb;
    color: #64748b;
  }
  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    background-color: #1890ff !important;
    border-color: #1890ff !important;
    color: #ffffff !important;
    box-shadow: -1px 0 0 0 #1890ff !important;
  }
}

.full-w { width: 100% !important; }

.centered-label {
  display: flex;
  align-items: center;
  :deep(.el-form-item) {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
}

/* Data Grid / Table Styles */
.p-add-row-btn {
  background: #f1f5f9;
  border: none;
  color: #1890ff;
  font-weight: 600;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 4px;
  &:hover {
    background: #e2e8f0;
    color: #096dd9;
  }
}

.p-data-grid {
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  overflow: hidden;
  
  .p-table {
    :deep(.el-table__header-wrapper) th {
      background: #f8fafc;
      color: #64748b;
      font-weight: 600;
      font-size: 11px;
      padding: 6px 0;
      
      &.p-required .cell::before {
        content: '*';
        color: #ef4444;
        margin-right: 4px;
        font-size: 14px;
      }
    }
    :deep(.el-table__row) td {
      padding: 6px 0;
    }
    :deep(.el-form-item) {
      margin-bottom: 0;
      .el-form-item__content {
        justify-content: center;
      }
      .el-form-item__error {
        display: none; /* 在表格中隐藏文字报错，仅通过边框变红提示 */
      }
      &.is-error {
        .el-input__wrapper, .el-select__wrapper, .p-unit-input-group {
          box-shadow: 0 0 0 1px #ef4444 inset !important;
        }
      }
    }
  }
}

/* Image Cell Preview */
.p-cell-img-preview {
  width: 44px;
  height: 44px;
  margin: 0 auto;
  cursor: pointer;
}

.p-img-empty {
  width: 100%;
  height: 100%;
  background: #f1f5f9;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 18px;
  &:hover { border-color: #1890ff; color: #1890ff; }
}

.p-img-main-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  
  .p-img-main { width: 100%; height: 100%; object-fit: cover; }
  
  .p-img-count-badge {
    position: absolute;
    bottom: 0;
    right: 0;
    background: rgba(15, 23, 42, 0.7);
    color: #fff;
    font-size: 10px;
    padding: 0 4px;
    border-top-left-radius: 4px;
    font-weight: 600;
  }
}

/* Image Manager Popover */
.p-img-manager {
  .p-mgr-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #f1f5f9;
    margin-bottom: 12px;
    span { font-size: 12px; font-weight: 600; color: #1e293b; }
    
    .p-mgr-btns {
      display: flex;
      align-items: center;
      gap: 12px;
      .el-upload { display: flex; align-items: center; }
    }
  }
  
.p-mgr-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    
    .p-mgr-item {
      aspect-ratio: 1;
      background: #f8fafc;
      border-radius: 6px;
      position: relative;
      overflow: hidden;
      border: 1px solid #f1f5f9;
      cursor: pointer;
      
      .p-mgr-el-img-instance {
        width: 100%;
        height: 100%;
        display: block;
        transition: transform 0.3s;
        &:hover { transform: scale(1.05); }
      }
      
      .p-mgr-del {
        position: absolute;
        top: 0;
        right: 0;
        width: 24px;
        height: 24px;
        background: rgba(244, 63, 94, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        opacity: 0;
        transition: opacity 0.2s;
        cursor: pointer;
        border-bottom-left-radius: 6px;
        z-index: 10;
      }
      
      &:hover .p-mgr-del { opacity: 1; }
    }
    
    .p-mgr-empty {
      grid-column: span 4;
      padding: 20px 0;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
    }
  }
}

:deep(.p-img-manager-popover) {
  padding: 12px !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
}

.p-cell-inputs {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.p-ghost-input {
  :deep(.el-input__wrapper) {
    background: transparent !important;
    border: 1px solid #e5e7eb;
    padding: 0 8px !important;
    height: 28px !important;
    &:hover { background: #f1f5f9 !important; border-color: #cbd5e1; }
    &.is-focus { background: #fff !important; border-color: #1890ff; }
  }
}

.p-ghost-select {
  :deep(.el-select__wrapper) {
    background: transparent !important;
    box-shadow: 0 0 0 1px #e5e7eb inset !important;
    padding: 0 8px !important;
    min-height: 28px !important;
    height: 28px !important;
    &:hover { box-shadow: 0 0 0 1px #cbd5e1 inset !important; }
    &.is-focused { background: #fff !important; box-shadow: 0 0 0 1px #1890ff inset !important; }
  }
}

.p-input-with-unit {
  display: flex;
  align-items: center;
  width: 100%;
  
  :deep(.el-input-number) {
    flex: 1;
    .el-input__wrapper {
      border-radius: 4px 0 0 4px !important;
    }
  }
  
  .p-unit-tag {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
    background: #f8fafc;
    padding: 0 10px;
    height: 30px;
    display: flex;
    align-items: center;
    border-radius: 0 4px 4px 0;
    border: 1px solid #e5e7eb;
    border-left: none;
    white-space: nowrap;
  }
}

.p-table-input-number {
  flex: 1;
  :deep(.el-input__wrapper) {
    background: transparent !important;
    border: 1px solid #e5e7eb !important;
    padding: 0 8px !important;
    height: 28px !important;
    border-radius: 4px 0 0 4px !important;
    &:hover { background: #f1f5f9 !important; border-color: #cbd5e1 !important; }
    &.is-focus { background: #fff !important; border-color: #1890ff !important; }
  }
}

.p-unit-input-group {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
  padding: 2px;
  
  &:hover {
    border-color: #cbd5e1;
    background: #fcfdfe;
  }
  
  &:focus-within {
    border-color: #1890ff;
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.08);
  }

  .p-table-input, .p-table-input-number {
    flex: 1;
    :deep(.el-input__wrapper) {
      background: transparent !important;
      box-shadow: none !important;
      border: none !important;
      height: 24px !important;
      padding: 0 8px !important;
    }
  }
  
  /* 维度组 (长宽高) */
  .p-dim-group {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    
    .p-dim-input {
      flex: 1;
      min-width: 30px;
      :deep(.el-input__wrapper) {
        padding: 0 2px !important;
        text-align: center;
        .el-input__inner { text-align: center; }
      }
    }
    
    .p-dim-sep {
      padding: 0 2px;
      color: #94a3b8;
      font-size: 10px;
      font-weight: bold;
      user-select: none;
    }
  }

  /* 现代分段切换器 */
  .p-unit-switcher {
    display: flex;
    align-items: center;
    background: #f1f5f9;
    border-radius: 5px;
    padding: 2px;
    margin-left: 4px;
    
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 28px;
      height: 20px;
      padding: 0 6px;
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      
      &:hover:not(.active) { 
        color: #1e293b;
        background: rgba(255, 255, 255, 0.4);
      }
      
      &.active {
        background: #ffffff;
        color: #1890ff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.06);
        transform: scale(1.02);
      }
    }
    
    &.mini {
      padding: 1px;
      span { min-width: 20px; height: 18px; padding: 0 4px; }
    }
  }
}

.p-mini-input-group {
  display: flex;
  align-items: center;
  gap: 4px;
  :deep(.el-input-number) {
    flex: 1;
    .el-input__wrapper { height: 22px !important; background: transparent !important; }
  }
  .p-unit { font-size: 10px; color: #94a3b8; font-weight: 500; }
}

.p-mini-select {
  :deep(.el-select__wrapper) {
    background: #f8fafc !important;
    border-radius: 0 4px 4px 0 !important;
    box-shadow: none !important;
    padding: 0 4px !important;
    min-height: 22px !important;
    height: 22px !important;
    border-left: 1px solid #e2e8f0 !important;
    .el-select__placeholder { font-size: 10px !important; color: #64748b; font-weight: 600; }
    .el-select__caret { font-size: 10px !important; width: 10px; }
  }
}

.p-row-actions {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.p-row-action-btn {
  color: #94a3b8;
  font-size: 14px;
  padding: 4px !important;
  height: auto !important;
  
  &:hover { 
    color: #1890ff; 
    background: #e6f7ff !important; 
    border-radius: 4px; 
  }
  
  &.del:hover {
    color: #f43f5e;
    background: #fff1f2 !important;
  }
}

/* Footer Styles */
.p-footer {
  padding: 4px 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;

  .p-footer-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #64748b;
    .p-info-icon { color: #1890ff; font-size: 12px; }
  }

  .p-footer-actions {
    display: flex;
    gap: 10px;
  }
}

.p-btn-secondary {
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #f8fafc; color: #0f172a; border-color: #cbd5e1; }
}

.p-btn-outline {
  padding: 5px 16px;
  border-radius: 6px;
  border: 1px solid #1890ff;
  background: #fff;
  color: #1890ff;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover { background: #e6f7ff; box-shadow: 0 2px 6px -1px rgba(24, 144, 255, 0.2); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}

.p-btn-primary {
  padding: 5px 16px;
  border-radius: 6px;
  border: none;
  background: #1890ff;
  color: #fff;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 6px -1px rgba(24, 144, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    background: #096dd9;
    box-shadow: 0 4px 10px -1px rgba(24, 144, 255, 0.4);
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}
</style>

