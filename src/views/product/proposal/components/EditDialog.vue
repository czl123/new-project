<template>
  <el-dialog
    v-model="visible"
    width="1100px"
    class="proposal-edit-dialog"
    destroy-on-close
    @closed="handleClosed"
    align-center
  >
    <template #header>
      <div class="dialog-header-custom">
        <span class="title-main">提案编辑</span>
        <span class="proposal-no-badge">{{ form.proposalNo }}</span>
        <el-tag :type="getStatusType(form.status)" size="small" effect="dark">{{ form.status }}</el-tag>
      </div>
    </template>

    <div class="edit-dialog-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="130px"
        class="workspace-form"
        size="small"
      >
        <!-- 🔒 只读归类基本信息区 -->
        <div class="readonly-wrapper">
          <div class="readonly-header-collapse">
            <span class="readonly-title-text">{{ isCollapsed ? '已归档只读信息 (摘要)' : '已归档只读信息 (完整)' }}</span>
            <el-button type="primary" link size="small" @click="isCollapsed = !isCollapsed">
              {{ isCollapsed ? '展开完整信息' : '收起' }}
              <el-icon class="el-icon--right"><ArrowDown v-if="isCollapsed" /><ArrowUp v-else /></el-icon>
            </el-button>
          </div>

          <!-- 当折叠时展示的极简摘要 -->
          <el-descriptions v-if="isCollapsed" :column="4" border size="small" class="locked-descriptions">
            <el-descriptions-item label="产品名称" :span="2">
              <span class="font-bold text-highlight">{{ form.productName }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="SPU">
              <span class="font-mono">{{ form.spu || '-' }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="提案等级">
              <span class="font-bold text-highlight-orange">{{ form.level }} 级</span>
            </el-descriptions-item>

            <el-descriptions-item label="首单采购数量">
              <span>{{ form.buyQty ? form.buyQty.toLocaleString() + ' PCS' : '-' }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="首单采购单价">
              <span>{{ form.unitPrice ? '¥' + form.unitPrice.toFixed(2) : '-' }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="首单采购金额" :span="2">
              <span class="text-green font-bold text-lg-amount">¥{{ formattedTotalAmount }}</span>
            </el-descriptions-item>
          </el-descriptions>

          <!-- 未折叠时展示的完整三大版块 -->
          <div v-else class="readonly-full-content">
            <div class="readonly-group-title">
              <el-icon class="group-icon"><Goods /></el-icon>
              <span>产品基础档案</span>
            </div>
            <el-descriptions :column="4" border size="small" class="locked-descriptions mb-8">
              <el-descriptions-item label="产品名称" :span="2">
                <span class="font-bold text-highlight">{{ form.productName }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="SPU">
                <span class="font-mono">{{ form.spu || '-' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="运营大类">{{ form.category || '-' }}</el-descriptions-item>

              <el-descriptions-item label="款式">{{ form.style || '-' }}</el-descriptions-item>
              <el-descriptions-item label="型号">{{ form.model || '-' }}</el-descriptions-item>
              <el-descriptions-item label="主材料">{{ form.material || '-' }}</el-descriptions-item>
              <el-descriptions-item label="适用品牌或对象">{{ form.applicableObject || '-' }}</el-descriptions-item>
            </el-descriptions>

            <div class="readonly-group-title">
              <el-icon class="group-icon"><User /></el-icon>
              <span>项目开发与归属</span>
            </div>
            <el-descriptions :column="4" border size="small" class="locked-descriptions mb-8">
              <el-descriptions-item label="产品经理">{{ form.manager || '-' }}</el-descriptions-item>
              <el-descriptions-item label="团队负责人">{{ form.teamLeader || '-' }}</el-descriptions-item>
              <el-descriptions-item label="开发方式">{{ form.devMethod || '-' }}</el-descriptions-item>
              <el-descriptions-item label="提案等级">
                <span class="font-bold text-highlight-orange">{{ form.level }} 级</span>
              </el-descriptions-item>

              <el-descriptions-item label="开发品牌">{{ form.brand || '-' }}</el-descriptions-item>
              <el-descriptions-item label="契合平台">{{ form.platform || '-' }}</el-descriptions-item>
              <el-descriptions-item label="产品来源" :span="2">{{ form.productSource || '-' }}</el-descriptions-item>
            </el-descriptions>

            <div class="readonly-group-title">
              <el-icon class="group-icon"><Wallet /></el-icon>
              <span>首单及包装预算</span>
            </div>
            <el-descriptions :column="4" border size="small" class="locked-descriptions">
              <el-descriptions-item label="初始Logo位置">{{ form.logoPosition || '-' }}</el-descriptions-item>
              <el-descriptions-item label="初始包装方式">{{ form.packagingMethod || '-' }}</el-descriptions-item>
              <el-descriptions-item label="运营上架时间要求" :span="2">{{ form.listingTimeOps || '-' }}</el-descriptions-item>

              <el-descriptions-item label="首单采购数量">
                <span>{{ form.buyQty ? form.buyQty.toLocaleString() + ' PCS' : '-' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="首单采购单价">
                <span>{{ form.unitPrice ? '¥' + form.unitPrice.toFixed(2) : '-' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="首单采购金额" :span="2">
                <span class="text-green font-bold text-lg-amount">¥{{ formattedTotalAmount }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>

        <!-- 📅 结项与时效计划 -->
        <div class="p-section-card">
          <div class="p-section-header">
            <el-icon class="p-section-icon"><Calendar /></el-icon>
            <span>结项与时效计划</span>
          </div>
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item prop="estProposalDate">
                <template #label>
                  <div class="form-label-with-tip">
                    <span>提案预计结项日期</span>
                    <el-tooltip content="预计下单日期" placement="top" effect="dark">
                      <el-icon class="label-info-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-date-picker v-model="form.estProposalDate" type="date" placeholder="选择下单日期" value-format="YYYY-MM-DD" class="w-full" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="estProjectDate">
                <template #label>
                  <div class="form-label-with-tip">
                    <span>项目预计结项日期</span>
                    <el-tooltip content="预计首单入库日期" placement="top" effect="dark">
                      <el-icon class="label-info-icon"><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <el-date-picker v-model="form.estProjectDate" type="date" placeholder="选择入库交期" value-format="YYYY-MM-DD" class="w-full" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开发上架时间要求" prop="listingTimeDev">
                <el-input v-model="form.listingTimeDev" placeholder="如: 预计 2026-05-15 售卖" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 🔍 市场调研与定位 -->
        <div class="p-section-card">
          <div class="p-section-header">
            <el-icon class="p-section-icon"><DataAnalysis /></el-icon>
            <span>市场调研与定位</span>
          </div>
          <el-row :gutter="12" class="mb-8">
            <el-col :span="12">
              <el-form-item label="核心卖点说明" prop="sellingPoints">
                <el-input
                  v-model="form.sellingPoints"
                  type="textarea"
                  :rows="4"
                  placeholder="提示要点：&#10;1. 核心材质及物理优势&#10;2. 结构创新与功能亮点&#10;3. 配套赠品及视觉差异化"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="市场评估" prop="marketEst">
                <el-input
                  v-model="form.marketEst"
                  type="textarea"
                  :rows="4"
                  placeholder="提示要点：&#10;1. 对应竞品月销预估与客单价定位&#10;2. 核心流量入口与搜索热度趋势&#10;3. ROI测算与目标毛利率范围"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="12" class="mb-8">
            <el-col :span="8">
              <el-form-item label="主攻市场" prop="mainMarket">
                <el-select v-model="form.mainMarket" multiple collapse-tags placeholder="选择销售市场" class="w-full">
                  <el-option label="北美市场 (🇺🇸/🇨🇦)" value="北美" />
                  <el-option label="欧洲市场 (🇪🇺)" value="欧洲" />
                  <el-option label="日本市场 (🇯🇵)" value="日本" />
                  <el-option label="澳洲市场 (🇦🇺)" value="澳洲" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用场景" prop="usageScenario">
                <el-input v-model="form.usageScenario" placeholder="如：户外露营、庭院美化" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用人群" prop="userGroup">
                <el-input v-model="form.userGroup" placeholder="如：中高端户外爱好者" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="季节标签" prop="seasonTags">
                <el-select v-model="form.seasonTags" multiple collapse-tags placeholder="选择季节" class="w-full">
                  <el-option v-for="tag in presetSeasons" :key="tag" :label="tag" :value="tag" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="节日属性" prop="holidayTags">
                <el-select v-model="form.holidayTags" multiple collapse-tags placeholder="选择节日" class="w-full">
                  <el-option v-for="tag in presetHolidays" :key="tag" :label="tag" :value="tag" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="调研分析文档">
                <div class="associated-docs-list-v3 mb-4">
                  <div class="doc-item-v3" v-for="(file, idx) in form.researchFiles" :key="idx">
                    <el-icon class="doc-icon" :class="getFileIconClass(file.name)"><Document /></el-icon>
                    <span class="doc-name">{{ file.name }}</span>
                    <el-button type="danger" link size="small" @click="removeResearchFile(idx)">移除</el-button>
                  </div>
                  <div v-if="!form.researchFiles || form.researchFiles.length === 0" class="no-doc-placeholder-v3">
                    暂无关联文档
                  </div>
                </div>
                <el-upload
                  action="#"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="handleResearchFileUpload"
                >
                  <el-button type="primary" size="small" :icon="Upload">添加上传文档</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 🔗 参考竞品 -->
        <div class="p-section-card">
          <div class="p-section-header">
            <el-icon class="p-section-icon"><Link /></el-icon>
            <span>参考竞品</span>
            <el-button type="primary" link :icon="Plus" size="small" @click="addRefLink" class="ml-auto">添加参考链接</el-button>
          </div>
          <div class="links-list-v3">
            <div v-for="(link, idx) in form.refLinks" :key="idx" class="link-row-v3 mb-4">
              <el-input v-model="link.label" placeholder="参考名称 (例: 竞品A)" style="width: 180px" />
              <el-input v-model="link.url" placeholder="网站 URL 地址" style="flex: 1;" />
              <el-button type="danger" plain :icon="Delete" circle size="small" @click="removeRefLink(idx)" />
            </div>
            <div v-if="form.refLinks.length === 0" class="no-links-placeholder-v3 mb-8">
              暂无参考链接，点击“添加参考链接”按钮进行添加
            </div>

            <!-- 🖼️ 参考图上传 -->
            <el-form-item label="参考图片" class="ref-images-form-item">
              <el-upload
                action="#"
                v-model:file-list="form.refImages"
                list-type="picture-card"
                :auto-upload="false"
                :on-preview="handleRefImagePreview"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </div>
        </div>

        <!-- 📐 工业设计与图档 -->
        <div class="p-section-card">
          <div class="p-section-header">
            <el-icon class="p-section-icon"><Setting /></el-icon>
            <span>工业设计与图档</span>
          </div>
          <el-row :gutter="12" class="mb-8">
            <el-col :span="12">
              <el-form-item label="Logo位置" prop="designLogoPosition">
                <el-input v-model="form.designLogoPosition" placeholder="例: 产品背部激光打标, 印白" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品规格书" prop="productManual">
                <el-input v-model="form.productManual" placeholder="说明书归档文件名称/编号" />
              </el-form-item>
            </el-col>
          </el-row>

          <div class="design-capsule-wrapper">
            <div class="design-capsule-list mb-8">
              <div v-for="(file, idx) in form.designFiles" :key="idx" class="design-capsule-item">
                <el-icon class="file-icon"><Document /></el-icon>
                <div class="file-info">
                  <span class="file-name" :title="file.name">{{ file.name }}</span>
                  <span class="file-meta">{{ file.uploader }} · {{ file.date }}</span>
                </div>
                <el-button type="danger" link size="small" class="delete-btn" @click="removeDesignFile(idx)">删除</el-button>
              </div>
              <div v-if="!form.designFiles || form.designFiles.length === 0" class="no-design-placeholder">
                暂无上传设计图档
              </div>
            </div>
            <div class="upload-bar">
              <el-upload
                action="#"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleDesignFileUpload"
              >
                <el-button type="primary" size="small" :icon="Upload">新增上传设计图档</el-button>
              </el-upload>
            </div>
          </div>
        </div>
      </el-form>

      <!-- 参考图片预览对话框 -->
      <el-dialog v-model="previewVisible" title="参考图片预览" width="50%" append-to-body align-center>
        <img :src="previewImageUrl" style="width: 100%; object-fit: contain; max-height: 70vh;" />
      </el-dialog>
    </div>

    <!-- 弹窗底部操作按钮 -->
    <template #footer>
      <div class="edit-dialog-footer">
        <div class="footer-left-info">
          <el-icon><InfoFilled /></el-icon>
          <span>保存后，修改的数据将同步更新提案列表并持久化保存草稿。</span>
        </div>
        <div class="footer-actions">
          <el-button @click="visible = false" size="default">取消</el-button>
          <el-button type="primary" :loading="saving" @click="handleSave" size="default">
            {{ saving ? '正在同步数据...' : '确认保存修改' }}
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Plus, Delete, Upload, Document, DataAnalysis, InfoFilled, Goods, User, Wallet, Lock, QuestionFilled, ArrowDown, ArrowUp, Calendar, Link, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  rowData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref()
const saving = ref(false)
const isCollapsed = ref(true)

// 预设的多选标签
const presetSeasons = ['春季', '夏季', '秋季', '冬季', '常规/四季通用']
const presetHolidays = ['圣诞节', '情人节', '母亲节', '父亲节', '万圣节', '感恩节', '无']

// 表单初始值声明
const form = ref<any>({
  proposalNo: '',
  productName: '',
  status: '待设计',
  category: '',
  teamLeader: '周亮亮',
  manager: '',
  spu: '',
  style: '',
  material: '',
  applicableObject: '',
  model: '',
  platform: 'Amazon',
  devMethod: '全新品-现货',
  brand: '',
  productSource: '工厂选品',
  logoPosition: '无',
  packagingMethod: '常规包装',
  buyQty: 0,
  unitPrice: 0,
  totalAmount: 0,
  level: 'D',
  listingTimeOps: '',
  listingTimeDev: '',
  sellingPoints: '',
  marketEst: '',
  usageScenario: '',
  userGroup: '',
  seasonTags: [],
  holidayTags: [],
  mainMarket: [],
  researchFile: '',
  roiFile: '',
  refLinks: [],
  refImages: [],
  researchFiles: [],
  designLogoPosition: '无',
  productManual: '',
  designFiles: [],
  estProposalDate: '',
  estProjectDate: '',
  date: ''
})

// 监听 rowData，进行深度拷贝
watch(() => props.rowData, (newVal: any) => {
  if (newVal && Object.keys(newVal).length > 0) {
    // 基础合并，保证数组 and 对象拥有默认结构
    const merged: any = {
      ...newVal,
      seasonTags: newVal.seasonTags || [],
      holidayTags: newVal.holidayTags || [],
      mainMarket: Array.isArray(newVal.mainMarket) ? newVal.mainMarket : (newVal.mainMarket ? [newVal.mainMarket] : []),
      refLinks: newVal.refLinks || [
        { label: '竞品参考链接 A', url: 'https://www.amazon.com/dp/B0GH4SLH8B' }
      ],
      refImages: newVal.refImages || [
        { name: '参考样照.jpg', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop' }
      ],
      researchFiles: newVal.researchFiles || [
        { name: newVal.researchFile || '深度调研报告_2026.pdf' },
        { name: newVal.roiFile || 'ROI利润测算表_V1.xlsx' }
      ],
      designFiles: newVal.designFiles || [
        { date: '2026-04-20', name: 'ZZ-牧羊人钩设计初稿_V1.pdf', uploader: '设计二组', method: '手动上传' }
      ]
    }
    
    // 补足可能不存在的属性
    if (!merged.applicableObject) merged.applicableObject = newVal.applicableObject || '-'
    if (!merged.listingTimeDev) merged.listingTimeDev = newVal.listingTime || '-'
    if (!merged.listingTimeOps) merged.listingTimeOps = newVal.listingTime || '-'
    if (!merged.buyQty) merged.buyQty = newVal.buyQty || 1000
    if (!merged.unitPrice) merged.unitPrice = newVal.unitPrice || 10
    if (!merged.totalAmount) merged.totalAmount = merged.buyQty * merged.unitPrice
    if (!merged.sellingPoints) merged.sellingPoints = newVal.sellingPoints || ''
    if (!merged.marketEst) merged.marketEst = newVal.marketEst || '良好'
    if (!merged.researchFile) merged.researchFile = '深度调研报告_2026.pdf'
    if (!merged.roiFile) merged.roiFile = 'ROI利润测算表_V1.xlsx'

    form.value = JSON.parse(JSON.stringify(merged))
  }
}, { immediate: true })

// 计算预估总额格式化
const formattedTotalAmount = computed(() => {
  const amount = form.value.buyQty * form.value.unitPrice
  return amount ? amount.toFixed(2) : '0.00'
})

// 数量/单价变更联动逻辑
const handleFinancialChange = () => {
  form.value.totalAmount = form.value.buyQty * form.value.unitPrice
}

const previewVisible = ref(false)
const previewImageUrl = ref('')

const handleRefImagePreview = (file: any) => {
  previewImageUrl.value = file.url || ''
  previewVisible.value = true
}

const getFileIconClass = (fileName: string) => {
  if (!fileName) return 'pdf'
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  if (['xls', 'xlsx'].includes(ext)) return 'excel'
  if (['doc', 'docx'].includes(ext)) return 'word'
  return 'pdf'
}

const handleResearchFileUpload = (uploadFile: any) => {
  const newFile = {
    name: uploadFile.name || '新上传文档.pdf'
  }
  if (!form.value.researchFiles) {
    form.value.researchFiles = []
  }
  form.value.researchFiles.push(newFile)
  ElMessage.success('成功上传调研分析文档')
}

const removeResearchFile = (index: number) => {
  form.value.researchFiles.splice(index, 1)
  ElMessage.warning('已移除该文档')
}

// 季节标签切换
const toggleSeasonTag = (tag: string) => {
  const index = form.value.seasonTags.indexOf(tag)
  if (index > -1) {
    form.value.seasonTags.splice(index, 1)
  } else {
    form.value.seasonTags.push(tag)
  }
}

// 节日标签切换
const toggleHolidayTag = (tag: string) => {
  const index = form.value.holidayTags.indexOf(tag)
  if (index > -1) {
    form.value.holidayTags.splice(index, 1)
  } else {
    form.value.holidayTags.push(tag)
  }
}

// 获取状态对应 Tag 类型
const getStatusType = (status: string) => {
  const map: any = {
    '待设计': 'info',
    '拿样中': 'warning',
    '设计中': 'success'
  }
  return map[status] || 'info'
}

// 动态增删参考链接
const addRefLink = () => {
  form.value.refLinks.push({ label: '', url: '' })
}

const removeRefLink = (index: number) => {
  form.value.refLinks.splice(index, 1)
}

// 上传设计图档模拟
const handleDesignFileUpload = (uploadFile: any) => {
  const newFile = {
    date: new Date().toISOString().split('T')[0],
    name: uploadFile.name || '新设计图纸.dwg',
    uploader: form.value.manager || '系统用户',
    method: '手动上传'
  }
  form.value.designFiles.push(newFile)
  ElMessage.success('成功上传并登记新图档')
}

const removeDesignFile = (index: number) => {
  form.value.designFiles.splice(index, 1)
  ElMessage.warning('已移除该设计图档')
}

const handleClosed = () => {
  formRef.value?.resetFields()
}

// 校验规则
const rules = {
  productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择运营大类', trigger: 'change' }],
  manager: [{ required: true, message: '请选择产品经理', trigger: 'change' }],
  level: [{ required: true, message: '请选择提案等级', trigger: 'change' }]
}

// 保存数据
const handleSave = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      saving.value = true
      try {
        // 模拟网络传输延迟
        await new Promise((resolve) => setTimeout(resolve, 1000))
        form.value.totalAmount = form.value.buyQty * form.value.unitPrice
        emit('save', JSON.parse(JSON.stringify(form.value)))
        ElMessage.success('提案内容已保存并同步至主列表')
        visible.value = false
      } finally {
        saving.value = false
      }
    } else {
      ElMessage.warning('表单信息校验失败，请检查红框必填项')
    }
  })
}
</script>

<style lang="scss">
.proposal-edit-dialog {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 12px 32px 4px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(0, 0, 0, 0.04);
  
  .el-dialog__header {
    margin-right: 0;
    padding: 12px 20px;
    border-bottom: 1px solid #f1f5f9;
  }

  .el-dialog__body {
    padding: 12px 16px !important;
    background-color: #ffffff;
  }
}

/* 自定义头部 */
.dialog-header-custom {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .header-indicator {
    width: 3px;
    height: 12px;
    background-color: #1890ff;
    border-radius: 2px;
  }
  
  .title-main {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
  }
  
  .proposal-no-badge {
    font-family: Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
    font-weight: 600;
    color: #475569;
    background-color: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }
}

.edit-dialog-container {
  max-height: 72vh;
  overflow-y: auto;
  padding: 2px;
}

.workspace-form {
  display: flex;
  flex-direction: column;

  :deep(.el-form-item) {
    margin-bottom: 10px !important;
  }
  :deep(.el-form-item__label) {
    font-size: 11px;
    color: #475569;
    font-weight: 600;
  }
  :deep(.el-input__wrapper), :deep(.el-textarea__inner) {
    padding: 4px 8px;
    transition: border-color 0.2s, box-shadow 0.2s;
    
    &:hover {
      border-color: #cbd5e1;
    }
  }
  
  :deep(.el-input__wrapper.is-focus), :deep(.el-textarea__inner:focus) {
    box-shadow: 0 0 0 1px #1890ff inset, 0 0 0 2px rgba(24, 144, 255, 0.08) !important;
  }
}

/* 只读区域包裹容器 */
.readonly-wrapper {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 10px 12px 12px 12px;
  margin-bottom: 16px;
  
  .locked-descriptions {
    :deep(.el-descriptions__table) {
      border-radius: 4px;
      overflow: hidden;
    }
    :deep(.el-descriptions__cell) {
      padding: 5px 8px !important;
      font-size: 11px;
      line-height: 1.3;
    }
    :deep(.el-descriptions__label) {
      background-color: #f1f5f9 !important;
      color: #475569;
      font-weight: 600;
      width: 110px;
    }
    :deep(.el-descriptions__content) {
      background-color: #ffffff !important;
      color: #0f172a;
    }
  }
}

.readonly-header-collapse {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #e2e8f0;
  padding-bottom: 6px;
  margin-bottom: 8px;
  
  .readonly-title-text {
    font-size: 11px;
    font-weight: 700;
    color: #475569;
  }
}

.readonly-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #e2e8f0;
  padding-bottom: 6px;
  margin-bottom: 6px;
  
  .readonly-title-text {
    font-size: 11px;
    font-weight: 700;
    color: #475569;
  }
  
  .lock-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    color: #64748b;
    background-color: #e2e8f0;
    padding: 1.5px 6px;
    border-radius: 4px;
    font-weight: 600;
  }
}

/* 只读分组标题 */
.readonly-group-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  margin-bottom: 6px;
  
  .group-icon {
    font-size: 13px;
    color: #64748b;
  }
  
  span {
    font-size: 11px;
    font-weight: 700;
    color: #475569;
    letter-spacing: 0.5px;
  }
}

.text-highlight {
  color: #0f172a;
  font-weight: 700;
}

.text-highlight-orange {
  color: #ea580c;
  font-weight: 700;
}

.text-lg-amount {
  font-size: 12px;
  color: #16a34a !important;
  font-weight: 800;
}

.text-green {
  color: #15803d !important;
}

.form-label-with-tip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.label-info-icon {
  font-size: 13px;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #1890ff;
  }
}

/* Section Cards - 保持拿样任务一致的超轻质感 */
.p-section-card {
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02);
  padding: 10px 14px;
  margin-bottom: 12px;

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
    margin-bottom: 10px;
    
    .p-section-icon {
      font-size: 16px;
      color: #1890ff;
    }
    
    .ml-auto {
      margin-left: auto;
    }
  }
}

/* 排型辅助 */
.w-full {
  width: 100%;
}

.mb-24 {
  margin-bottom: 16px;
}

.mb-16 {
  margin-bottom: 10px;
}

.mb-12 {
  margin-bottom: 8px;
}

.mb-8 {
  margin-bottom: 6px;
}

.mb-4 {
  margin-bottom: 4px;
}

.mt-12 {
  margin-top: 8px;
}

.mt-6 {
  margin-top: 6px;
}

.font-mono {
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 11px;
}

.font-bold {
  font-weight: 700;
}

/* 关联文档 - 紧凑型 */
.associated-docs-list-v3 {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 6px 10px;
  background-color: #f8fafc;
  min-height: 58px;
  justify-content: center;

  .doc-item-v3 {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    padding: 4px 8px;
    border-radius: 3px;
    
    .doc-icon {
      font-size: 14px;
      &.pdf { color: #ef4444; }
      &.excel { color: #22c55e; }
      &.word { color: #3b82f6; }
    }
    
    .doc-name {
      font-size: 11px;
      color: #334155;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  .no-doc-placeholder-v3 {
    font-size: 11px;
    color: #94a3b8;
    text-align: center;
  }
}

/* 参考链接 - 紧凑型 */
.links-list-v3 {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 0 0 0;
  background-color: transparent;
  border: none;
  border-radius: 0;

  .link-row-v3 {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .no-links-placeholder-v3 {
    font-size: 11px;
    color: #94a3b8;
    text-align: center;
    padding: 4px 0;
  }
}

/* 工业图档胶囊列表 */
.design-capsule-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  
  .design-capsule-item {
    display: flex;
    align-items: center;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 6px 12px;
    gap: 8px;
    position: relative;
    transition: all 0.2s;
    
    &:hover {
      border-color: #cbd5e1;
      background-color: #f1f5f9;
      
      .delete-btn {
        opacity: 1;
      }
    }
    
    .file-icon {
      font-size: 18px;
      color: #64748b;
    }
    
    .file-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
      
      .file-name {
        font-size: 11px;
        font-weight: 600;
        color: #334155;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .file-meta {
        font-size: 10px;
        color: #94a3b8;
        margin-top: 1px;
      }
    }
    
    .delete-btn {
      opacity: 0;
      transition: opacity 0.2s;
    }
  }
  
  .no-design-placeholder {
    grid-column: span 2;
    text-align: center;
    font-size: 11px;
    color: #94a3b8;
    padding: 16px;
    border: 1px dashed #e2e8f0;
    border-radius: 6px;
    background-color: #f8fafc;
  }
}

.upload-bar {
  display: flex;
  justify-content: flex-end;
}

/* 底部操作 */
.edit-dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 4px 2px;

  .footer-left-info {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #64748b;
    .el-icon { color: #1890ff; font-size: 13px; }
  }

  .footer-actions {
    display: flex;
    gap: 8px;
  }
}

.ref-images-form-item {
  margin-top: 10px;
  
  :deep(.el-upload-list--picture-card) {
    --el-upload-list-picture-card-size: 70px;
    margin-bottom: 0;
  }
  :deep(.el-upload--picture-card) {
    --el-upload-picture-card-size: 70px;
  }
}
</style>
