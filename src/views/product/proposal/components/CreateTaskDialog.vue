<template>
  <el-dialog
    v-model="visible"
    width="1100px"
    class="proposal-create-task-dialog"
    destroy-on-close
    @closed="handleClosed"
    align-center
  >
    <template #header>
      <div class="dialog-header-custom">
        <span class="title-main">创建拿样任务</span>
        <span class="proposal-no-badge">{{ form.proposalNo }}</span>
      </div>
    </template>

    <div class="create-task-dialog-container">
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
            <div class="value">¥{{ form.totalAmount ? form.totalAmount.toFixed(2) : '0.00' }}</div>
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

        <!-- 提案详细内容回顾 (只读，可收起/展开) -->
        <div class="section-card proposal-review-card">
          <div class="section-title">
            <el-icon><InfoFilled /></el-icon>
            <span>提案详细内容回顾 (只读)</span>
            <el-button type="primary" link size="small" @click="isProposalReviewCollapsed = !isProposalReviewCollapsed" style="margin-left: auto; font-weight: normal;">
              {{ isProposalReviewCollapsed ? '展开提案信息' : '收起提案信息' }}
              <el-icon class="el-icon--right"><ArrowDown v-if="isProposalReviewCollapsed" /><ArrowUp v-else /></el-icon>
            </el-button>
          </div>

          <div v-show="!isProposalReviewCollapsed" class="proposal-review-content mt-12">
            <!-- 1. 提案-基础 -->
            <div class="review-section-block">
              <div class="sub-section-title">
                <el-icon><Management /></el-icon>
                <span>提案-基础</span>
              </div>
              <el-descriptions :column="3" border size="small" class="mb-12">
                <el-descriptions-item label="运营大类">{{ form.category || '-' }}</el-descriptions-item>
                <el-descriptions-item label="团队负责人">{{ form.teamLeader || '-' }}</el-descriptions-item>
                <el-descriptions-item label="产品经理">{{ form.manager || '-' }}</el-descriptions-item>
                
                <el-descriptions-item label="产品名称">{{ form.productName || '-' }}</el-descriptions-item>
                <el-descriptions-item label="款式">{{ form.style || '-' }}</el-descriptions-item>
                <el-descriptions-item label="主材料">{{ form.material || '-' }}</el-descriptions-item>
                
                <el-descriptions-item label="适用品牌/对象">{{ form.applicableObject || '-' }}</el-descriptions-item>
                <el-descriptions-item label="型号">{{ form.model || '-' }}</el-descriptions-item>
                <el-descriptions-item label="SPU">{{ form.spu || '-' }}</el-descriptions-item>
                
                <el-descriptions-item label="产品来源">{{ form.productSource || '-' }}</el-descriptions-item>
                <el-descriptions-item label="开发方式">{{ form.devMethod || '-' }}</el-descriptions-item>
                <el-descriptions-item label="开发品牌">{{ form.brand || '-' }}</el-descriptions-item>

                <el-descriptions-item label="初始Logo位置">{{ form.logoPosition || '-' }}</el-descriptions-item>
                <el-descriptions-item label="初始包装方式">{{ form.packagingMethod || '-' }}</el-descriptions-item>
                <el-descriptions-item label="-"></el-descriptions-item>
              </el-descriptions>

              <div class="sub-section-title mt-12">
                <el-icon><Calendar /></el-icon>
                <span>结项与时效计划</span>
              </div>
              <el-descriptions :column="4" border size="small" class="mb-4 date-descriptions" :label-style="{ width: '15%' }" :content-style="{ width: '10%' }">
                <el-descriptions-item label="提案预计结项日期">{{ form.estProposalDate || '-' }}</el-descriptions-item>
                <el-descriptions-item label="项目预计结项日期">{{ form.estProjectDate || '-' }}</el-descriptions-item>
                <el-descriptions-item label="开发上架时间要求">{{ form.listingTimeDev || '-' }}</el-descriptions-item>
                <el-descriptions-item label="运营上架时间要求">{{ form.listingTimeOps || '-' }}</el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 2. 提案-调研 -->
            <div class="review-section-block mt-16">
              <div class="sub-section-title">
                <el-icon><Monitor /></el-icon>
                <span>提案-调研</span>
              </div>
              <el-descriptions :column="3" border size="small" class="mb-12">
                <el-descriptions-item label="主攻市场">
                  <span v-if="Array.isArray(form.mainMarket)">{{ form.mainMarket.join('、') || '-' }}</span>
                  <span v-else>{{ form.mainMarket || '-' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="使用人群" :span="2">{{ form.userGroup || '-' }}</el-descriptions-item>
                <el-descriptions-item label="市场评估" :span="3">{{ form.marketEst || '-' }}</el-descriptions-item>
                
                <el-descriptions-item label="使用场景">{{ form.usageScenario || '-' }}</el-descriptions-item>
                <el-descriptions-item label="季节标签">
                  <el-tag v-for="tag in form.seasonTags" :key="tag" size="small" class="mr-4">{{ tag }}</el-tag>
                  <span v-if="!form.seasonTags || form.seasonTags.length === 0">-</span>
                </el-descriptions-item>
                <el-descriptions-item label="节日标签">
                  <el-tag v-for="tag in form.holidayTags" :key="tag" size="small" type="success" class="mr-4">{{ tag }}</el-tag>
                  <span v-if="!form.holidayTags || form.holidayTags.length === 0">-</span>
                </el-descriptions-item>
              </el-descriptions>

              <div class="text-block-readonly mb-12">
                <div class="read-label">卖点说明：</div>
                <div class="read-text-value">{{ form.sellingPoints || '-' }}</div>
              </div>

              <el-row :gutter="24">
                <el-col :span="12">
                  <div class="link-block-readonly">
                    <div class="read-label">参考竞品：</div>
                    <div class="multi-links-readonly mt-4">
                      <div v-for="(link, idx) in form.refLinks" :key="idx" class="link-item-readonly">
                        <el-icon><Link /></el-icon>
                        <el-link type="primary" :href="link.url" target="_blank" size="small">{{ link.label || link.url }}</el-link>
                      </div>
                      <div v-if="!form.refLinks || form.refLinks.length === 0" class="text-secondary">-</div>
                    </div>
                  </div>
                  <div class="file-block-readonly mt-12">
                    <div class="read-label">相关文档：</div>
                    <div class="mt-4 flex-wrap">
                      <el-tag v-for="(file, idx) in form.researchFiles" :key="idx" size="small" class="file-tag mr-8 mb-4">
                        <el-icon><Document /></el-icon> {{ file.name }}
                      </el-tag>
                      <span v-if="!form.researchFiles || form.researchFiles.length === 0" class="text-secondary">-</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="image-gallery-readonly">
                    <div class="read-label mb-4">参考图片：</div>
                    <div class="img-list-readonly">
                      <el-image 
                        v-for="(img, idx) in form.refImages" 
                        :key="idx"
                        :src="img.url || img" 
                        :preview-src-list="form.refImages.map((i: any) => i.url || i)"
                        fit="cover"
                        class="gallery-item-readonly"
                      />
                      <span v-if="!form.refImages || form.refImages.length === 0" class="text-secondary">-</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>

            <!-- 3. 提案-设计 -->
            <div class="review-section-block mt-16">
              <div class="sub-section-title">
                <el-icon><Guide /></el-icon>
                <span>提案-设计</span>
              </div>
              <el-descriptions :column="2" border size="small" class="mb-12">
                <el-descriptions-item label="Logo位置">{{ form.designLogoPosition || '-' }}</el-descriptions-item>
                <el-descriptions-item label="设计规格书/图档">
                  <div class="design-file-readonly-list">
                    <div v-for="(file, idx) in form.designFiles" :key="idx" class="design-file-readonly-item">
                      <el-icon><Document /></el-icon>
                      <span class="file-name-span">{{ file.name }}</span>
                      <span class="file-meta-span">({{ file.uploader || '系统' }} · {{ file.date || '-' }})</span>
                    </div>
                    <span v-if="!form.designFiles || form.designFiles.length === 0" class="text-secondary">-</span>
                  </div>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </div>

        <!-- 任务基本设置 -->
        <div class="section-card">
          <div class="section-title">
            <span>任务基本设置</span>
          </div>
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="拿样方式" prop="samplingMethod">
                <el-select v-model="form.samplingMethod" placeholder="请选择拿样方式" class="w-full">
                  <el-option label="现货拿样" value="现货拿样" />
                  <el-option label="定制拿样" value="定制拿样" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Logo位置" prop="logoPosition">
                <el-select v-model="form.logoPosition" placeholder="请选择Logo位置" class="w-full">
                  <el-option label="无" value="无" />
                  <el-option label="正面" value="正面" />
                  <el-option label="背面" value="背面" />
                  <el-option label="侧面" value="侧面" />
                  <el-option label="顶部" value="顶部" />
                  <el-option label="底部" value="底部" />
                  <el-option label="面板" value="面板" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.samplingMethod === '现货拿样'">
              <el-form-item label="任务截止时间" prop="deadline">
                <el-date-picker
                  v-model="form.deadline"
                  type="datetime"
                  placeholder="选择任务截止时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  class="w-full"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.samplingMethod === '定制拿样'">
              <el-form-item label="期望定制用时" prop="customCycle">
                <el-input v-model="form.customCycle" placeholder="请输入天数" class="w-full">
                  <template #append>天</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24" v-if="form.samplingMethod === '定制拿样'">
            <el-col :span="8">
              <el-form-item label="反馈截止时间" prop="feedbackDeadline">
                <el-date-picker
                  v-model="form.feedbackDeadline"
                  type="datetime"
                  placeholder="选择反馈截止时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  class="w-full"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="任务截止时间" prop="deadline">
                <el-date-picker
                  v-model="form.deadline"
                  type="datetime"
                  placeholder="选择任务截止时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  class="w-full"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 任务说明信息 (根据拿样方式切换表单) -->
        <div class="section-card">
          <div class="section-title">
            <span>任务说明信息</span>
          </div>

          <!-- 1. 现货拿样属性表单 -->
          <template v-if="form.samplingMethod === '现货拿样'">
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="底线采购价" prop="bottomLinePrice">
                  <el-input v-model="form.bottomLinePrice" placeholder="例: 32 CNY" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="款式要求" prop="styleRequirement">
                  <el-input v-model="form.styleRequirement" placeholder="款式/形态要求" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="适用品牌/对象" prop="brandRequirement">
                  <el-input v-model="form.brandRequirement" placeholder="适用品牌/对象要求" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="材质要求" prop="materialRequirement">
                  <el-input v-model="form.materialRequirement" placeholder="材质要求" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="图案要求" prop="patternRequirement">
                  <el-input v-model="form.patternRequirement" placeholder="图案/Logo印刷要求" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="颜色要求" prop="colorRequirement">
                  <el-input v-model="form.colorRequirement" placeholder="颜色要求" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="尺寸要求" prop="sizeRequirement">
                  <el-input v-model="form.sizeRequirement" placeholder="尺寸/大小要求" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="重量要求" prop="weightRequirement">
                  <el-input v-model="form.weightRequirement" placeholder="重量要求" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="包装数量要求" prop="packQtyRequirement">
                  <el-input v-model="form.packQtyRequirement" placeholder="包装数量要求" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="功能要求" prop="functionRequirement">
                  <el-input v-model="form.functionRequirement" placeholder="功能/物理优势要求" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="配件要求" prop="accessoryRequirement">
                  <el-input v-model="form.accessoryRequirement" placeholder="配件要求" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="包装要求" prop="packagingRequirement">
                  <el-input v-model="form.packagingRequirement" placeholder="包装要求" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="合规要求" prop="complianceRequirement">
                  <el-input v-model="form.complianceRequirement" placeholder="合规/物理参数" />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="认证要求" prop="certRequirement">
                  <el-input v-model="form.certRequirement" placeholder="认证/标准要求" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>

          <!-- 2. 定制拿样属性表单 -->
          <template v-else>
            <el-row :gutter="24" class="mb-8">
              <el-col :span="12">
                <el-form-item label="底线采购价" prop="bottomLinePrice">
                  <el-input v-model="form.bottomLinePrice" placeholder="例: 32 CNY" />
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
                      <span>上传规格书/设计图档</span>
                    </div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>

            <div class="design-capsule-wrapper mb-12">
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
                  暂无已上传的产品规格书 (默认可使用提案阶段的文档)
                </div>
              </div>
            </div>
          </template>

          <!-- 3. 公共补充说明 -->
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="补充说明" prop="supplementaryRequirement">
                <el-input
                  v-model="form.supplementaryRequirement"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入对该任务的补充说明或特殊注意事项..."
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left">审批流转预览 (模拟配置)</el-divider>
          <el-row :gutter="24" class="mb-4">
            <el-col :span="12">
               <el-form-item label="模拟预估金额" label-width="130px">
                  <el-input-number v-model="form.amount" :min="0" :step="1000" placeholder="调整金额查看右侧流程变化" class="w-full" />
               </el-form-item>
               <div class="hint-text text-secondary" style="margin-left: 130px; font-size: 11px;">
                 提示：根据后台配置的OA规则，当预估金额大于 10000 时，需要总经理额外审批。
               </div>
            </el-col>
            <el-col :span="12">
               <div class="workflow-preview-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                 <TimelineViewer :path="workflowPath" :current-index="0" />
               </div>
            </el-col>
          </el-row>

        </div>
      </el-form>
    </div>

    <!-- 弹窗底部操作按钮 -->
    <template #footer>
      <div class="edit-dialog-footer">
        <div class="footer-left-info">
          <el-icon><InfoFilled /></el-icon>
          <span>任务下发后，系统将自动生成任务单，并以通知形式派发给承接人。</span>
        </div>
        <div class="footer-actions">
          <el-button @click="visible = false" size="small">取消</el-button>
          <el-button type="primary" plain :loading="saving" @click="handleSave(false)" size="small">保存</el-button>
          <el-button type="primary" :loading="saving" @click="handleSave(true)" size="small">提交</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Plus, Document, InfoFilled, ArrowDown, ArrowUp, Management, List, PriceTag, Monitor, Guide, Film, Link } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import TimelineViewer from '@/components/Workflow/TimelineViewer.vue'
import { WorkflowEngine } from '@/components/Workflow/WorkflowEngine'
import { mockWorkflowData } from '@/components/Workflow/mockData'

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
const isProposalReviewCollapsed = ref(true)

// 表单初始值声明
const form = ref<any>({
  proposalNo: '',
  productName: '',
  manager: '',
  devMethod: '',
  level: '',
  totalAmount: 0,
  buyQty: 0,
  unitPrice: 0,
  category: '',
  teamLeader: '周亮亮',
  style: '',
  material: '',
  applicableObject: '',
  model: '',
  spu: '',
  productSource: '工厂选品',
  brand: '',
  logoPosition: '无',
  packagingMethod: '常规包装',
  mainMarket: [],
  userGroup: '',
  marketEst: '',
  usageScenario: '',
  seasonTags: [],
  holidayTags: [],
  sellingPoints: '',
  refLinks: [],
  refImages: [],
  researchFiles: [],
  designLogoPosition: '无',
  designFiles: [],
  estProposalDate: '',
  estProjectDate: '',
  listingTimeDev: '',
  listingTimeOps: '',
  
  taskNo: '',
  user: '杨登峰',
  samplingMethod: '现货拿样',
  priority: 'P1',
  feedbackDeadline: '',
  deadline: '',
  customCycle: '',
  
  bottomLinePrice: '32 CNY',
  styleRequirement: '符合图纸或参考样，无划痕',
  brandRequirement: '通用',
  materialRequirement: '防潮，防霉，承重性强',
  patternRequirement: '无图案',
  colorRequirement: '常规主色',
  sizeRequirement: '适配规格',
  weightRequirement: '单品不超过常规重量',
  packQtyRequirement: '1个/包',
  functionRequirement: '安全，经久耐用',
  accessoryRequirement: '配备必要装配螺丝/配件',
  packagingRequirement: '常规五层纸箱包装',
  complianceRequirement: '符合跨境电商出口标准',
  certRequirement: '无',
  supplementaryRequirement: '请重点确认材质的防刮擦性能与物理强度。'
})

// 监听 rowData，进行深度拷贝和任务生成预配置
watch(() => props.rowData, (newVal: any) => {
  if (newVal && Object.keys(newVal).length > 0) {
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const randNum = Math.floor(100 + Math.random() * 900)
    
    // 默认反馈截止时间为 2 天后
    const fd = new Date()
    fd.setDate(fd.getDate() + 2)
    const fdStr = fd.toISOString().slice(0, 10) + ' 18:00:00'
    
    // 默认任务截止时间为 7 天后
    const d = new Date()
    d.setDate(d.getDate() + 7)
    const dStr = d.toISOString().slice(0, 10) + ' 18:00:00'

    // 基础合并，保证数组 and 对象拥有默认结构 (与 EditDialog.vue 保持一致)
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
    if (!merged.applicableObject) merged.applicableObject = newVal.applicableObject || newVal.applicableTo || '-'
    if (!merged.listingTimeDev) merged.listingTimeDev = newVal.listingTime || '-'
    if (!merged.listingTimeOps) merged.listingTimeOps = newVal.listingTime || '-'
    if (!merged.buyQty) merged.buyQty = newVal.buyQty || 1000
    if (!merged.unitPrice) merged.unitPrice = newVal.unitPrice || 10
    if (!merged.totalAmount) merged.totalAmount = merged.buyQty * merged.unitPrice
    if (!merged.sellingPoints) merged.sellingPoints = newVal.sellingPoints || ''
    if (!merged.marketEst) merged.marketEst = newVal.marketEst || '良好'
    if (!merged.researchFile) merged.researchFile = '深度调研报告_2026.pdf'
    if (!merged.roiFile) merged.roiFile = 'ROI利润测算表_V1.xlsx'
    
    // 任务特有配置 (支持回显已保存的草稿)
    merged.taskNo = newVal.taskNo || `TK${todayStr}${randNum}`
    merged.user = newVal.user || '杨登峰'
    merged.samplingMethod = newVal.samplingMethod || ((newVal.devMethod && newVal.devMethod.includes('现货')) ? '现货拿样' : '定制拿样')
    merged.priority = newVal.priority || 'P1'
    merged.feedbackDeadline = newVal.feedbackDeadline !== undefined ? newVal.feedbackDeadline : fdStr
    merged.deadline = newVal.deadline !== undefined ? newVal.deadline : dStr
    merged.customCycle = newVal.customCycle !== undefined ? newVal.customCycle : ''
    
    merged.bottomLinePrice = newVal.bottomLinePrice !== undefined ? newVal.bottomLinePrice : '32 CNY'
    merged.styleRequirement = newVal.styleRequirement !== undefined ? newVal.styleRequirement : '符合图纸或参考样，无划痕'
    merged.brandRequirement = newVal.brandRequirement !== undefined ? newVal.brandRequirement : '通用'
    merged.materialRequirement = newVal.materialRequirement !== undefined ? newVal.materialRequirement : '防潮，防霉，承重性强'
    merged.patternRequirement = newVal.patternRequirement !== undefined ? newVal.patternRequirement : '无图案'
    merged.colorRequirement = newVal.colorRequirement !== undefined ? newVal.colorRequirement : '常规主色'
    merged.sizeRequirement = newVal.sizeRequirement !== undefined ? newVal.sizeRequirement : '适配规格'
    merged.weightRequirement = newVal.weightRequirement !== undefined ? newVal.weightRequirement : '单品不超过常规重量'
    merged.packQtyRequirement = newVal.packQtyRequirement !== undefined ? newVal.packQtyRequirement : '1个/包'
    merged.functionRequirement = newVal.functionRequirement !== undefined ? newVal.functionRequirement : '安全，经久耐用'
    merged.accessoryRequirement = newVal.accessoryRequirement !== undefined ? newVal.accessoryRequirement : '配备必要装配螺丝/配件'
    merged.packagingRequirement = newVal.packagingRequirement !== undefined ? newVal.packagingRequirement : '常规五层纸箱包装'
    merged.complianceRequirement = newVal.complianceRequirement !== undefined ? newVal.complianceRequirement : '符合跨境电商出口标准'
    merged.certRequirement = newVal.certRequirement !== undefined ? newVal.certRequirement : '无'
    merged.supplementaryRequirement = newVal.supplementaryRequirement !== undefined ? newVal.supplementaryRequirement : '请重点确认材质的防刮擦性能与物理强度。'

    form.value = JSON.parse(JSON.stringify(merged))
  }
}, { immediate: true })

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
  samplingMethod: [{ required: true, message: '请选择拿样方式', trigger: 'change' }],
  logoPosition: [{ required: true, message: '请选择Logo位置', trigger: 'change' }],
  feedbackDeadline: [{ required: true, message: '请选择反馈截止时间', trigger: 'change' }],
  deadline: [{ required: true, message: '请选择任务截止时间', trigger: 'change' }],
  customCycle: [{ required: true, message: '请输入期望定制用时', trigger: 'blur' }]
}

// 模拟工作流引擎计算审批路径
const workflowPath = ref<any[]>([])
const engine = new WorkflowEngine(mockWorkflowData)

watch(() => form.value.amount, (newVal) => {
  // 实时根据表单填写的金额（由于此表单无金额，使用一个模拟值或者假设有 amount 字段）计算流转路径
  workflowPath.value = engine.resolvePath({ amount: newVal || 0 })
}, { immediate: true })

// 保存并下发任务
const handleSave = async (isSubmit = true) => {
  if (isSubmit) {
    if (!formRef.value) return
    await formRef.value.validate(async (valid: boolean) => {
      if (valid) {
        await executeSave(true)
      } else {
        ElMessage.warning('表单信息校验失败，请检查必填项')
      }
    })
  } else {
    await executeSave(false)
  }
}

const executeSave = async (isSubmit: boolean) => {
  saving.value = true
  try {
    // 模拟网络传输延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    emit('save', { ...JSON.parse(JSON.stringify(form.value)), isSubmit })
    ElMessage.success(isSubmit ? `任务 ${form.value.taskNo} 创建且已成功下发！` : `任务 ${form.value.taskNo} 草稿保存成功！`)
    visible.value = false
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss">
.proposal-create-task-dialog {
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

  .el-descriptions__label {
    white-space: nowrap;
  }

  .date-descriptions {
    .el-descriptions__table {
      table-layout: fixed;
      width: 100%;
    }
  }

}

.create-task-dialog-container {
  max-height: 72vh;
  overflow-y: auto;
  padding: 8px 10px 12px 10px;
  background-color: #f8f9fb;

  .el-form-item {
    margin-bottom: 12px !important;
  }
}

/* 提案详细内容回顾 */
.proposal-review-card {
  .proposal-review-content {
    background: #fafbfc;
    padding: 16px;
    border-radius: 6px;
    border: 1px dashed #dcdfe6;
  }
}

.review-section-block {
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  padding: 12px;
}

.text-block-readonly {
  margin-top: 10px;
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  
  .read-label {
    font-size: 11px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 4px;
  }
  .read-text-value {
    font-size: 12px;
    color: #0f172a;
    line-height: 1.6;
    white-space: pre-wrap;
  }
}

.link-block-readonly, .file-block-readonly, .image-gallery-readonly {
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  box-sizing: border-box;

  .read-label {
    font-size: 11px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 4px;
  }
}

.image-gallery-readonly {
  height: 100%;
}

.link-item-readonly {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  margin-top: 4px;
  .el-icon {
    font-size: 12px;
    color: #94a3b8;
  }
}

.img-list-readonly {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  
  .gallery-item-readonly {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.05);
    }
  }
}

.design-file-readonly-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.design-file-readonly-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  .el-icon {
    font-size: 13px;
    color: #94a3b8;
  }
  .file-name-span {
    font-weight: 600;
    color: #1e293b;
  }
  .file-meta-span {
    color: #64748b;
  }
}
</style>
