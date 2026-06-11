<template>
  <el-dialog
    v-model="visible"
    :title="form.id ? '编辑模具申请' : '新建模具申请'"
    width="1200px"
    class="mould-standard-dialog"
    destroy-on-close
    align-center
  >
    <div class="workspace-container">
      <!-- 1. 左侧：参考信息面板 (Master/Context) -->
      <div class="workspace-sidebar custom-scrollbar" style="overflow-y: auto;">
        <!-- 上半部分：定制任务内容 -->
        <div class="sidebar-block context-card">
          <div class="block-header">
            <span class="block-title-text">定制任务内容</span>
          </div>
          
          <div class="product-mini-preview">
            <div class="img-placeholder">
              <el-icon><Picture /></el-icon>
            </div>
            <div class="p-info">
              <div class="p-name">{{ taskInfo.productName }}</div>
              <el-tag size="small" type="info">{{ taskInfo.category }}</el-tag>
            </div>
          </div>

          <div class="context-details mt-16">
            <div class="ctx-row">
              <span class="ctx-label">提案编号</span>
              <span class="ctx-value font-mono">{{ taskInfo.proposalNo }}</span>
            </div>
            <div class="ctx-row">
              <span class="ctx-label">产品经理</span>
              <span class="ctx-value">{{ taskInfo.pmName || '陈招娣' }}</span>
            </div>
            <div class="ctx-row">
              <span class="ctx-label">期望周期</span>
              <span class="ctx-value">{{ taskInfo.customCycle }}</span>
            </div>
            <div class="ctx-row">
              <span class="ctx-label">底线价格</span>
              <span class="ctx-value price-highlight">{{ taskInfo.bottomLinePrice }}</span>
            </div>
          </div>

          <!-- 详细需求说明 -->
          <div class="requirement-content mt-12">
            <div class="text-light mb-4" style="font-size: 11px;">补充说明：</div>
            {{ taskInfo.supplementaryRequirement || '无补充说明' }}
          </div>

          <!-- 参考附件 -->
          <div class="reference-files mt-12">
            <div class="text-light mb-4" style="font-size: 11px;">研发附件：</div>
            <div class="file-item-link">
              <el-icon><Document /></el-icon>
              <span>设计规格说明书.pdf</span>
            </div>
          </div>
        </div>

        <!-- 下半部分：任务反馈内容 -->
        <div class="sidebar-block context-card mt-12">
          <div class="block-header">
            <span class="block-title-text">任务反馈内容</span>
          </div>
          
          <div class="context-details">
            <div class="ctx-row">
              <span class="ctx-label">采购员</span>
              <span class="ctx-value">{{ taskInfo.purchaserName || '黄小军' }}</span>
            </div>
            <div class="ctx-row">
              <span class="ctx-label">初次报价</span>
              <span class="ctx-value price-highlight">{{ taskInfo.initialQuote || '¥ 48.00' }}</span>
            </div>
            <div class="ctx-row">
              <span class="ctx-label">反馈费用</span>
              <span class="ctx-value price-highlight">{{ taskInfo.feedbackFee || '¥ 15,000.00 (开模费)' }}</span>
            </div>
            <div class="ctx-row">
              <span class="ctx-label">生产周期</span>
              <span class="ctx-value">{{ taskInfo.productionCycle || '20 天' }}</span>
            </div>
            <div class="ctx-row">
              <span class="ctx-label">定制用时</span>
              <span class="ctx-value">{{ taskInfo.actualCustomCycle || '15 天' }}</span>
            </div>
            <div class="ctx-row">
              <span class="ctx-label">起订量(MOQ)</span>
              <span class="ctx-value">{{ taskInfo.moq || '1000 件' }}</span>
            </div>
          </div>

          <div class="requirement-content mt-12" style="background: #fffbe6; color: #d46b08; border: 1px solid #ffe58f;">
            <div class="text-light mb-4" style="font-size: 11px; color: #fa8c16;">供应商反馈意见：</div>
            {{ taskInfo.feedbackNotes || '模具精度要求高，建议采用 S136 钢材以保证设计寿命。' }}
          </div>
        </div>
      </div>

      <!-- 2. 右侧：填报表单面板 (Detail/Form) -->
      <div class="workspace-main">
        <div class="detail-workspace-card">
          <el-form :model="form" ref="formRef" label-position="left" label-width="110px" class="standard-form">
            <!-- 模块 1：基础信息 -->
            <div class="form-section-title">
              <span class="title-bar blue"></span>
              <span>基础信息</span>
            </div>
            
            <div class="section-container">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="运营人员" required>
                    <el-select v-model="form.operator" multiple placeholder="请选择运营人员" style="width: 100%">
                      <el-option label="张三" value="张三" />
                      <el-option label="李四" value="李四" />
                      <el-option label="王五" value="王五" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="是否免费" required>
                    <el-radio-group v-model="form.isFree">
                      <el-radio value="是">是</el-radio>
                      <el-radio value="否">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="是否自主设计" required>
                    <el-radio-group v-model="form.isSelfDesigned">
                      <el-radio value="是">是</el-radio>
                      <el-radio value="否">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="ID设计师" :required="form.isSelfDesigned === '是'">
                    <el-input v-model="form.idDesigner" placeholder="请输入ID设计师" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="报价金额" :required="form.isFree === '否'">
                    <el-input-number v-model="form.quoteAmount" :precision="2" :min="0" style="width: 100%" placeholder="0.00" :disabled="form.isFree === '是'" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="报价意见">
                    <el-input v-model="form.quoteOpinion" placeholder="请输入报价意见" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="参考图">
                    <el-upload action="#" list-type="picture-card" :auto-upload="false" v-model:file-list="form.referenceImage" class="small-uploader">
                      <el-icon><Plus /></el-icon>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- 模块 2：功能及自主设计特点 -->
            <div class="form-section-title mt-24">
              <span class="title-bar orange"></span>
              <span>功能及自主设计特点</span>
              <el-button type="primary" link size="small" style="margin-left: auto;" @click="addFeature">
                <el-icon class="mr-4"><Plus /></el-icon>新增特点
              </el-button>
            </div>
            <div class="section-container">
              <div v-for="(feature, index) in form.features" :key="index" style="display: flex; gap: 12px; margin-bottom: 16px; align-items: flex-start;">
                <el-form-item label-width="0" style="flex: 1; margin-bottom: 0;">
                  <el-input v-model="feature.description" placeholder="请输入功能或设计特点..." />
                </el-form-item>
                <el-button 
                  v-if="form.features.length > 1" 
                  type="danger" 
                  link 
                  style="margin-top: 6px;"
                  @click="removeFeature(index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>

            <!-- 模块 3：其他信息 -->
            <div class="form-section-title mt-24">
              <span class="title-bar green"></span>
              <span>说明及附件</span>
            </div>
            <div class="section-container">
              <el-form-item label="备注说明">
                <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入申请备注..." />
              </el-form-item>
              <el-form-item label="图纸/技术合同附件" required>
                <el-upload action="#" list-type="picture-card" :auto-upload="false">
                  <el-icon><Plus /></el-icon>
                </el-upload>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="standard-footer">
        <div class="footer-left-info">
          <span class="label">当前关联提案:</span>
          <span class="value font-mono">{{ taskInfo.proposalNo }}</span>
        </div>
        <div class="footer-btns">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="info" plain @click="handleSubmit(false)">保存</el-button>
          <el-button type="primary" @click="handleSubmit(true)">提交</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture, Document, Plus, Delete } from '@element-plus/icons-vue'

const visible = ref(false)
const taskInfo = ref<any>({})

const form = reactive({
  id: undefined,
  operator: [],
  isSelfDesigned: '是',
  idDesigner: '',
  isFree: '否',
  referenceImage: [],
  quoteAmount: null,
  quoteOpinion: '',
  features: [{ description: '' }],
  remark: ''
})

const addFeature = () => {
  form.features.push({ description: '' })
}

const removeFeature = (index: number) => {
  form.features.splice(index, 1)
}

const open = (row: any = {}) => {
  taskInfo.value = {
    proposalNo: row.proposalNo || 'TA-20260611',
    productName: row.productName || 'ZZ-定制多功能折叠支架',
    category: row.category || '家居五金',
    bottomLinePrice: '¥ 45.00',
    customCycle: '7天',
    supplementaryRequirement: '该产品结构复杂，模具需要支持高频次开合，重点关注转轴部分的耐磨性与表面纹理处理。'
  }

  Object.assign(form, {
    operator: [],
    isSelfDesigned: '是',
    idDesigner: '',
    isFree: '否',
    referenceImage: [],
    quoteAmount: 15000,
    quoteOpinion: '',
    cavityCount: '1出4',
    material: 'S136',
    designLife: 100,
    cycleTime: 25,
    remark: ''
  })
  
  visible.value = true
}

const handleSubmit = (isSubmit: boolean) => {
  ElMessage({
    message: isSubmit ? '提交成功，已触发审批流' : '保存成功',
    type: isSubmit ? 'success' : 'info'
  })
  visible.value = false
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
/* 调色盘参考 ExecutionDetailDrawer */
$primary: #1890ff;
$success: #52c41a;
$warning: #faad14;
$danger: #ff4d4f;
$bg-main: #f4f7f9;
$text-title: #1f1f1f;
$text-body: #434343;
$text-light: #8c8c8c;

.mould-standard-dialog {
  :deep(.el-dialog__body) {
    padding: 0 !important;
    background-color: $bg-main !important;
  }
}

.workspace-container {
  display: flex;
  gap: 10px;
  background-color: $bg-main;
  height: 680px;
  box-sizing: border-box;
}

/* 左侧侧边栏 */
.workspace-sidebar {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0 12px 12px;
}

.sidebar-block {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);

  .block-header {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 8px;
    margin-bottom: 12px;
    
    .block-title-text {
      font-size: 13px;
      font-weight: 700;
      color: $text-title;
      display: flex;
      align-items: center;
      gap: 6px;
      &::before {
        content: ''; width: 3px; height: 12px; background: $primary; border-radius: 2px;
      }
    }
  }
}

.product-mini-preview {
  display: flex;
  gap: 12px;
  align-items: center;
  .img-placeholder {
    width: 60px; height: 60px; background: #f8fafc; border: 1px dashed #dcdfe6; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #dcdfe6;
  }
  .p-info {
    flex: 1;
    .p-name { font-size: 13px; font-weight: 700; color: $text-title; margin-bottom: 4px; line-height: 1.4; }
  }
}

.context-details {
  display: flex; flex-direction: column; gap: 8px;
  .ctx-row {
    display: flex; justify-content: space-between; align-items: center; font-size: 12px;
    .ctx-label { color: $text-light; }
    .ctx-value { color: #262626; font-weight: 600; }
    .price-highlight { color: $danger; font-weight: 700; }
  }
}

.requirement-content {
  font-size: 12px; color: $text-body; line-height: 1.6; background: #f8f9fb; padding: 10px; border-radius: 6px; font-style: italic;
}

.reference-files {
  .file-item-link {
    display: flex; align-items: center; gap: 8px; font-size: 12px; color: $primary; cursor: pointer; padding: 6px 0;
    &:hover { text-decoration: underline; }
  }
}

/* 右侧主区域 */
.workspace-main {
  flex: 1;
  padding: 12px;
}

.detail-workspace-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.form-section-title {
  display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #1f1f1f; margin-bottom: 16px;
  .title-bar {
    width: 4px; height: 14px; border-radius: 2px;
    &.blue { background: $primary; }
    &.orange { background: $warning; }
    &.green { background: $success; }
  }
}

.section-container {
  padding-left: 12px;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
  .el-form-item__label { font-size: 12px; color: $text-light; font-weight: 500; padding-bottom: 4px; line-height: 1; }
}

/* 页脚样式 */
.standard-footer {
  display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 4px 0;
  .footer-left-info {
    display: flex; align-items: center; gap: 8px; font-size: 12px;
    .label { color: $text-light; }
    .value { color: $text-body; font-weight: 700; }
  }
  .footer-btns { display: flex; gap: 10px; }
}

.mt-16 { margin-top: 16px; }
.mt-24 { margin-top: 24px; }
.font-mono { font-family: monospace; }
.border-none { border: none !important; }
.shadow-none { box-shadow: none !important; }

/* 滚动条 */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #dcdfe6; border-radius: 3px; }

/* 小尺寸上传组件 */
.small-uploader {
  :deep(.el-upload--picture-card) {
    width: 80px;
    height: 80px;
    line-height: 86px;
    i {
      font-size: 20px;
    }
  }
  :deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 80px;
    height: 80px;
  }
}
</style>
