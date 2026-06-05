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
        <!-- 基础信息看板 -->
        <div class="info-dashboard">
          <div class="dash-item">
            <div class="label">首单采购金额</div>
            <div class="value">¥{{ formattedTotalAmount }}</div>
          </div>
          <div class="dash-item">
            <div class="label">首单采购数量</div>
            <div class="value">{{ form.buyQty ? form.buyQty.toLocaleString() : 0 }} <span class="unit">PCS</span></div>
          </div>
          <div class="dash-item">
            <div class="label">单价</div>
            <div class="value">¥{{ form.unitPrice || 0 }}</div>
          </div>
          <div class="dash-item">
            <div class="label">提案等级</div>
            <div class="value-tag" :data-level="form.level">{{ form.level }} 级</div>
          </div>
        </div>

        <!-- 提案-基础 -->
        <div class="section-card">
          <div class="section-title">
            <span>提案-基础</span>
            <el-button type="primary" link size="small" @click="isReadonlyCollapsed = !isReadonlyCollapsed" style="margin-left: auto; font-weight: normal;">
              {{ isReadonlyCollapsed ? '展开只读信息' : '收起只读信息' }}
              <el-icon class="el-icon--right"><ArrowDown v-if="isReadonlyCollapsed" /><ArrowUp v-else /></el-icon>
            </el-button>
          </div>
          
          <div v-show="!isReadonlyCollapsed" class="readonly-content-collapse-wrapper mb-12">
            <!-- 分组 1：管理与时效 -->
            <div class="sub-section-title">
              <el-icon><Management /></el-icon>
              <span>管理与时效</span>
            </div>
            <el-descriptions :column="3" border size="small" class="mb-12">
              <el-descriptions-item label="运营大类">{{ form.category || '-' }}</el-descriptions-item>
              <el-descriptions-item label="团队负责人">{{ form.teamLeader || '-' }}</el-descriptions-item>
              <el-descriptions-item label="产品经理">{{ form.manager || '-' }}</el-descriptions-item>
            </el-descriptions>

            <!-- 分组 2：SPU 核心属性 -->
            <div class="sub-section-title">
              <el-icon><List /></el-icon>
              <span>SPU 核心属性</span>
            </div>
            <el-descriptions :column="3" border size="small" class="mb-12">
              <el-descriptions-item label="产品名称">{{ form.productName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="款式">{{ form.style || '-' }}</el-descriptions-item>
              <el-descriptions-item label="主材料">{{ form.material || '-' }}</el-descriptions-item>
              
              <el-descriptions-item label="适用品牌/对象">{{ form.applicableObject || '-' }}</el-descriptions-item>
              <el-descriptions-item label="型号">{{ form.model || '-' }}</el-descriptions-item>
              <el-descriptions-item label="SPU">{{ form.spu || '-' }}</el-descriptions-item>
            </el-descriptions>

            <!-- 分组 3：开发与品牌 -->
            <div class="sub-section-title">
              <el-icon><PriceTag /></el-icon>
              <span>开发与品牌</span>
            </div>
            <el-descriptions :column="3" border size="small">
              <el-descriptions-item label="产品来源">{{ form.productSource || '-' }}</el-descriptions-item>
              <el-descriptions-item label="开发方式">{{ form.devMethod || '-' }}</el-descriptions-item>
              <el-descriptions-item label="开发品牌">{{ form.brand || '-' }}</el-descriptions-item>
              
              <el-descriptions-item label="初始Logo位置">{{ form.logoPosition || '-' }}</el-descriptions-item>
              <el-descriptions-item label="初始包装方式">{{ form.packagingMethod || '-' }}</el-descriptions-item>
              <el-descriptions-item label="-"></el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 结项与时效计划 -->
          <div class="sub-section-title">
            <el-icon><Calendar /></el-icon>
            <span>结项与时效计划</span>
          </div>
          
          <el-row :gutter="24">
            <el-col :span="6">
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
            <el-col :span="6">
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
            <el-col :span="6">
              <el-form-item label="开发上架时间要求" prop="listingTimeDev">
                <el-date-picker v-model="form.listingTimeDev" type="date" placeholder="选择上架日期" value-format="YYYY-MM-DD" class="w-full" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="运营上架时间要求" prop="listingTimeOps">
                <el-input v-model="form.listingTimeOps" disabled placeholder="-" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 提案-调研 -->
        <div class="section-card">
          <div class="section-title">提案-调研</div>

          <!-- 分组 1：市场与人群 -->
          <div class="sub-section-title">
            <el-icon><Monitor /></el-icon>
            <span>市场与人群</span>
          </div>
          <el-row :gutter="24" class="mb-8">
            <el-col :span="12">
              <el-form-item label="主攻市场" prop="mainMarket">
                <el-select v-model="form.mainMarket" multiple collapse-tags placeholder="选择销售市场" class="w-full">
                  <el-option label="北美市场 (🇺🇸/🇨🇦)" value="北美" />
                  <el-option label="欧洲市场 (🇪🇺)" value="欧洲" />
                  <el-option label="日本市场 (🇯🇵)" value="日本" />
                  <el-option label="澳洲市场 (🇦🇺)" value="澳洲" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用人群" prop="userGroup">
                <el-input v-model="form.userGroup" placeholder="如：中高端户外爱好者" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" class="mb-4">
            <el-col :span="24">
              <el-form-item label="市场评估" prop="marketEst">
                <el-input
                  v-model="form.marketEst"
                  type="textarea"
                  :rows="3"
                  placeholder="提示要点：&#10;1. 对应竞品月销预估与客单价定位&#10;2. 核心流量入口与搜索热度趋势&#10;3. ROI测算与目标毛利率范围"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 分组 2：场景与标签 -->
          <div class="sub-section-title">
            <el-icon><Guide /></el-icon>
            <span>场景与标签</span>
          </div>
          <el-row :gutter="24" class="mb-4">
            <el-col :span="8">
              <el-form-item label="使用场景" prop="usageScenario">
                <el-input v-model="form.usageScenario" placeholder="如：户外露营、庭院美化" />
              </el-form-item>
            </el-col>
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
          </el-row>

          <!-- 分组 3：素材与卖点 -->
          <div class="sub-section-title">
            <el-icon><Film /></el-icon>
            <span>素材与卖点</span>
          </div>
          <el-row :gutter="24" class="mb-8">
            <el-col :span="12">
              <el-form-item label="卖点说明" prop="sellingPoints">
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
              <el-form-item label="调研分析文档">
                <div style="width: 100%;">
                  <div class="research-capsule-list mb-4">
                    <div v-for="(file, idx) in form.researchFiles" :key="idx" class="design-capsule-item">
                      <el-icon class="file-icon" :class="getFileIconClass(file.name)"><Document /></el-icon>
                      <div class="file-info">
                        <span class="file-name" :title="file.name">{{ file.name }}</span>
                      </div>
                      <el-button type="danger" link size="small" class="delete-btn" @click="removeResearchFile(idx)">删除</el-button>
                    </div>
                    <div v-if="!form.researchFiles || form.researchFiles.length === 0" class="no-design-placeholder">
                      暂无已上传的调研分析文档
                    </div>
                  </div>
                  <el-upload
                    action="#"
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="handleResearchFileUpload"
                    class="doc-upload-inline"
                  >
                    <div class="doc-upload-trigger-dashed">
                      <el-icon><Plus /></el-icon>
                      <span>上传分析文档</span>
                    </div>
                  </el-upload>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="参考竞品">
                <div class="links-list-v3">
                  <div v-for="(link, idx) in form.refLinks" :key="idx" class="link-row-v3 mb-4">
                    <el-input v-model="link.url" placeholder="链接地址 (例: https://...)" style="flex: 1;" />
                    <el-button type="danger" plain :icon="Delete" circle size="small" @click="removeRefLink(idx)" />
                  </div>
                  <div class="link-add-dashed-row" @click="addRefLink">
                    <el-icon><Plus /></el-icon>
                    <span>添加竞品参考链接</span>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
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
            </el-col>
          </el-row>
        </div>

        <!-- 提案-设计 -->
        <div class="section-card">
          <div class="section-title">提案-设计</div>
          <el-row :gutter="24" class="mb-8">
            <el-col :span="12">
              <el-form-item label="Logo位置" prop="designLogoPosition">
                <el-input v-model="form.designLogoPosition" placeholder="例: 产品背部激光打标, 印白" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品规格书">
                <el-upload
                  action="#"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="handleDesignFileUpload"
                  class="doc-upload-inline"
                >
                  <div class="doc-upload-trigger-dashed">
                    <el-icon><Plus /></el-icon>
                    <span>上传产品规格书</span>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="design-capsule-wrapper">
            <div class="design-capsule-list">
              <div v-for="(file, idx) in form.designFiles" :key="idx" class="design-capsule-item">
                <el-icon class="file-icon"><Document /></el-icon>
                <div class="file-info">
                  <span class="file-name" :title="file.name">{{ file.name }}</span>
                  <span class="file-meta">{{ file.uploader }} · {{ file.date }}</span>
                </div>
                <el-button type="danger" link size="small" class="delete-btn" @click="removeDesignFile(idx)">删除</el-button>
              </div>
              <div v-if="!form.designFiles || form.designFiles.length === 0" class="no-design-placeholder">
                暂无已上传的产品规格书
              </div>
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
          <el-button @click="visible = false" size="small">取消</el-button>
          <el-button type="primary" plain :loading="saving" @click="handleSave('save')" size="small">保存</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSave('submit')" size="small">提交</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Plus, Delete, Upload, Document, DataAnalysis, InfoFilled, Goods, User, Wallet, Lock, QuestionFilled, ArrowDown, ArrowUp, Calendar, Link, Setting, Monitor, Guide, Film, Management, List, PriceTag } from '@element-plus/icons-vue'
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
const submitting = ref(false)
const isReadonlyCollapsed = ref(true)

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

// 上传产品规格书模拟
const handleDesignFileUpload = (uploadFile: any) => {
  const newFile = {
    date: new Date().toISOString().split('T')[0],
    name: uploadFile.name || '产品规格书.pdf',
    uploader: form.value.manager || '系统用户',
    method: '手动上传'
  }
  form.value.designFiles.push(newFile)
  ElMessage.success('成功上传并登记产品规格书')
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

// 保存 / 提交数据
const handleSave = async (action: 'save' | 'submit') => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (action === 'submit') {
        submitting.value = true
      } else {
        saving.value = true
      }
      try {
        // 模拟网络传输延迟
        await new Promise((resolve) => setTimeout(resolve, 1000))
        form.value.totalAmount = form.value.buyQty * form.value.unitPrice
        
        if (action === 'submit') {
          if (form.value.status === '待设计') {
            form.value.status = '设计中'
          }
          emit('save', JSON.parse(JSON.stringify(form.value)))
          ElMessage.success('提案已成功提交并同步状态')
        } else {
          emit('save', JSON.parse(JSON.stringify(form.value)))
          ElMessage.success('提案内容已保存草稿')
        }
        visible.value = false
      } finally {
        saving.value = false
        submitting.value = false
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
    padding: 0 !important;
    background-color: #f8f9fb;
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
  padding: 8px 10px 12px 10px;
  background-color: #f8f9fb;
}

.workspace-form {
  display: flex;
  flex-direction: column;

  .el-form-item, .el-form-item--small {
    margin-bottom: 10px !important;
  }
  .el-form-item__label {
    font-size: 11px;
    color: #475569;
    font-weight: 600;
  }
  .el-input__wrapper, .el-textarea__inner {
    padding: 3px 6px;
    transition: border-color 0.2s, box-shadow 0.2s;
    
    &:hover {
      border-color: #cbd5e1;
    }
  }
  
  .el-input__wrapper.is-focus, .el-textarea__inner:focus {
    box-shadow: 0 0 0 1px #1890ff inset, 0 0 0 2px rgba(24, 144, 255, 0.08) !important;
  }
}

/* 基础信息看板 */
.info-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 10px;
  
  .dash-item {
    background: #ffffff;
    padding: 8px 12px;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 21, 41, 0.03);
    border: 1px solid #e2e8f0;
    
    .label { font-size: 11px; color: #8c8c8c; margin-bottom: 4px; font-weight: 600; }
    .value { font-size: 18px; font-weight: bold; color: #262626; font-family: monospace; }
    .unit { font-size: 10px; color: #bfbfbf; margin-left: 2px; font-weight: normal; }
    
    .value-tag {
      font-size: 16px; font-weight: bold;
      &[data-level="A"] { color: #f5222d; }
      &[data-level="B"] { color: #fa8c16; }
      &[data-level="C"] { color: #1890ff; }
      &[data-level="D"] { color: #faad14; }
    }
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

/* Section Cards - 保持与详情一致的经典质感 */
.section-card {
  background: #ffffff;
  padding: 12px 14px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.04);
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 13px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    
    &::before {
      content: '';
      width: 4px;
      height: 12px;
      background: #1890ff;
      margin-right: 6px;
      border-radius: 2px;
    }
  }

  .sub-section-title {
    font-size: 12px;
    font-weight: bold;
    color: #262626;
    background: linear-gradient(90deg, #f0f7ff 0%, #ffffff 100%);
    padding: 4px 10px 6px 10px;
    margin-bottom: 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
    
    &:not(:first-of-type) {
      margin-top: 8px;
    }
    
    .el-icon {
      color: #1890ff;
      font-size: 13px;
    }
  }

  .el-row:last-child {
    margin-bottom: 0 !important;
    .el-form-item {
      margin-bottom: 0 !important;
    }
  }

  .el-descriptions__table {
    border-radius: 4px;
    overflow: hidden;
  }
  .el-descriptions__cell {
    padding: 4px 8px !important;
    font-size: 11px;
    line-height: 1.3;
  }
  .el-descriptions__label {
    background-color: #fafafa !important;
    color: #475569;
    font-weight: 600;
    width: 110px;
  }
  .el-descriptions__content {
    color: #0f172a;
    background-color: #ffffff !important;
  }
}

.form-label-with-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 8px;
  
  .btn-add-link {
    font-size: 11px;
    font-weight: normal;
    padding: 0;
    height: auto;
  }
}


/* 排型辅助 */
.w-full {
  width: 100%;
}

.mb-24 {
  margin-bottom: 12px;
}

.mb-16 {
  margin-bottom: 8px;
}

.mb-12 {
  margin-bottom: 6px;
}

.mb-8 {
  margin-bottom: 4px;
}

.mb-4 {
  margin-bottom: 2px;
}

.mt-12 {
  margin-top: 6px;
}

.mt-6 {
  margin-top: 4px;
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
  width: 100%;

  .link-row-v3 {
    display: flex;
    gap: 6px;
    align-items: center;
    width: 100%;
    
    .el-input {
      flex: 1;
    }
  }

  .no-links-placeholder-v3 {
    font-size: 11px;
    color: #94a3b8;
    text-align: center;
    padding: 4px 0;
  }
}

/* 工业图档胶囊列表 */
.research-capsule-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.design-capsule-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  
  .no-design-placeholder {
    grid-column: span 2;
  }
}

.design-capsule-item {
  display: flex;
  align-items: center;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px 8px;
  gap: 6px;
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
    &.pdf { color: #ef4444; }
    &.excel { color: #22c55e; }
    &.word { color: #3b82f6; }
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
  text-align: center;
  font-size: 11px;
  color: #94a3b8;
  padding: 8px;
  border: 1px dashed #e2e8f0;
  border-radius: 6px;
  background-color: #f8fafc;
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
  
  .el-upload-list--picture-card {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .el-upload-list__item {
      width: 96px !important;
      height: 96px !important;
      margin: 0 !important;
      border-radius: 4px;
    }
  }
  
  .el-upload--picture-card {
    width: 96px !important;
    height: 96px !important;
    line-height: 94px !important;
    border-radius: 4px;
    margin: 0 !important;
    
    .el-icon {
      font-size: 20px;
      line-height: inherit;
    }
  }
}

.link-add-dashed-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 24px;
  border: 1px dashed #cbd5e1;
  border-radius: 4px;
  background-color: #f8fafc;
  color: #64748b;
  font-size: 11px;
  cursor: pointer;
  margin-top: 4px;
  transition: all 0.2s;
  width: 100%;
  
  &:hover {
    border-color: #1890ff;
    color: #1890ff;
    background-color: #f0f7ff;
  }
}

.doc-upload-inline {
  width: 100%;
  margin-top: 4px;
  
  :deep(.el-upload) {
    width: 100%;
    display: block;
  }
}

.doc-upload-trigger-dashed {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  padding: 4px 8px;
  border-radius: 3px;
  width: 100%;
  height: 24px;
  color: #64748b;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #1890ff;
    color: #1890ff;
    background: #f0f7ff;
  }
}

.design-upload-capsule {
  width: 100%;
  display: block;
  
  :deep(.el-upload) {
    width: 100%;
    display: block;
  }
}

.design-upload-trigger-dashed {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  padding: 8px;
  height: 38px;
  color: #64748b;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #1890ff;
    color: #1890ff;
    background-color: #f0f7ff;
  }
}
</style>
