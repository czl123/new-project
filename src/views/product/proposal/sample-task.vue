<template>
  <div class="sample-task-page">
    <div class="workbench-layout">
      <!-- 左侧任务导航 -->
      <aside class="side-panel">
        <div class="side-header">
          <div class="search-box">
            <el-input v-model="searchQuery" placeholder="搜索编号/产品" prefix-icon="Search" size="small" />
          </div>
          
          <div class="urgent-container">
            <div class="urgent-summary-line">
              <el-icon class="clock-icon"><Clock /></el-icon>
              <span class="label">今日紧急处理</span>
              <span class="count-badge">11</span>
            </div>

            <div class="urgent-card-list">
              <div v-for="item in urgentTasks" :key="item.proposalNo" 
                   :class="['urgent-mini-card', { active: currentTask?.proposalNo === item.proposalNo }]"
                   @click="currentTask = item">
                <div class="card-top">
                  <span class="id">{{ item.proposalNo }}</span>
                  <div class="urgent-label-tag">紧急</div>
                </div>
                <div class="card-main">
                  <el-image :src="item.image" class="product-thumb" />
                  <div class="info">
                    <div class="title">{{ item.category ? `${item.category}-${item.productName}` : item.productName }}</div>
                    <div class="sub">
                      {{ item.pm }} <span class="v-line">|</span> {{ item.sampleMethodText }}
                      <div v-if="activeTab === 'unfinished'" class="urgent-acceptors-line">
                        已承接: {{ item.acceptors && item.acceptors.length ? item.acceptors.join('、') : '暂无' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tabs-scroll-nav">
            <div v-for="tab in statusTabs" :key="tab.value" 
                 :class="['tab-item', { active: activeTab === tab.value }]"
                 @click="activeTab = tab.value">
              <span>{{ tab.label }}</span>
              <span class="tab-count-badge">12</span>
            </div>
          </div>
        </div>

        <div class="side-body custom-scrollbar">
          <!-- 普通任务组 -->
          <div v-for="item in normalTasks" :key="item.proposalNo" 
               :class="['normal-task-card', { active: currentTask?.proposalNo === item.proposalNo }]"
               @click="currentTask = item">
            <div class="card-top">
              <span class="id">{{ item.proposalNo }}</span>
              <el-tooltip :disabled="!daysTooltipContent" effect="dark" :content="daysTooltipContent" placement="top">
                <span class="days-tag">{{ item.remainingDays }}天</span>
              </el-tooltip>
            </div>
            <div class="card-main">
              <el-image :src="item.image" class="product-thumb" />
              <div class="info">
                <div class="title">{{ item.category ? `${item.category}-${item.productName}` : item.productName }}</div>
                <div class="sub">{{ item.pm }} <span class="v-line">|</span> {{ item.sampleMethodText }}</div>
              </div>
            </div>
            <div class="card-footer" v-if="activeTab === 'unfinished'">
              <div class="separator-line"></div>
              <div class="acceptors-info">
                <span class="label">已承接人：</span>
                <span class="names" :title="item.acceptors && item.acceptors.length ? item.acceptors.join('、') : '暂无'">
                  {{ item.acceptors && item.acceptors.length ? item.acceptors.join('、') : '暂无' }}
                </span>
              </div>
            </div>
            <div class="card-footer" v-else>
              <div class="separator-line"></div>
              <span class="status-link">已承接</span>
            </div>
          </div>
        </div>
        
      </aside>

      <!-- 右侧详情区 -->
      <main class="main-content" v-if="currentTask">
        <header class="content-header">
          <div class="header-left">
            <h1 class="product-name">{{ currentTask.productName }}</h1>
            <div class="proposal-id">
              <span>{{ currentTask.proposalNo }}</span>
              <el-icon class="copy-btn"><CopyDocument /></el-icon>
            </div>
            <el-tag size="small" :type="currentTask.sampleMethodText === '定制拿样' ? 'success' : 'primary'" effect="plain" class="tag-method">{{ currentTask.sampleMethodText }}</el-tag>
            <el-tag size="small" color="#faad14" effect="dark" class="tag-level">A级提案</el-tag>
            <el-tag size="small" type="danger" effect="plain" class="tag-p0">P0</el-tag>
          </div>
          <div class="header-actions">
            <template v-if="activeTab === 'unfinished'">
              <el-button type="primary" class="action-btn blue" @click="handleAcceptTask">承接任务</el-button>
            </template>
            <template v-else>
              <template v-if="currentTask.sampleMethodText === '定制拿样'">
                <el-button type="primary" class="action-btn blue" @click="handleCustomFeedback">定制反馈</el-button>
                <el-button class="action-btn plain">转移任务</el-button>
              </template>
              <template v-else-if="currentTask.sampleMethodText === '现货拿样'">
                <el-button type="primary" class="action-btn blue" @click="handlePurchaseApply()">购样申请</el-button>
                <el-button type="primary" icon="Plus" class="action-btn blue" @click="handleSampleRegistration()">样品登记</el-button>
                <el-button class="action-btn plain">转移任务</el-button>
              </template>
              <template v-else>
                <el-button type="primary" class="action-btn blue">反馈</el-button>
                <el-button type="primary" icon="Plus" class="action-btn blue" @click="handleSampleRegistration()">样品登记</el-button>
                <el-button class="action-btn plain">转移任务</el-button>
              </template>
            </template>
          </div>
        </header>


        <div class="content-body custom-scrollbar">
          <!-- 顶部卡片布局：三个卡片并排显示 -->
          <div :class="['info-cards-row', 'mb-12', { 'grid-2-cols': activeTab === 'unfinished' }]">
            <div class="info-card">
              <h3 class="card-title">提案-基础信息</h3>
              <div class="card-grid grid-2">
                <div class="item"><label>运营大类</label><span>智能硬件</span></div>
                <div class="item"><label>团队负责人</label><span>廖飞飞</span></div>
                <div class="item"><label>产品经理</label><span>{{ currentTask.pm }}</span></div>
                <div class="item"><label>产品名称</label><span>{{ currentTask.productName }}</span></div>
                <div class="item"><label>款式</label><span>{{ currentTask.style || '亚克力透明款' }}</span></div>
                <div class="item"><label>型号</label><span>{{ currentTask.model || 'JK-2026-X1' }}</span></div>
                <div class="item"><label>主材料</label><span>{{ currentTask.material || '亚克力 + LED' }}</span></div>
                <div class="item"><label>适用品牌</label><span>{{ currentTask.applicableTo || '通用 / 通用' }}</span></div>
                <div class="item"><label>SPU</label><span>{{ currentTask.spu || 'SPU882910' }}</span></div>
                <div class="item span-2" v-if="activeTab === 'unfinished'">
                   <label>已承接人</label>
                   <div class="acceptors-tags">
                     <template v-if="currentTask.acceptors && currentTask.acceptors.length">
                       <el-tag v-for="user in currentTask.acceptors" :key="user" size="small" type="primary" effect="plain">{{ user }}</el-tag>
                     </template>
                     <span v-else class="no-acceptors">暂无承接人</span>
                   </div>
                 </div>
              </div>
            </div>

            <div class="info-card" v-if="activeTab !== 'unfinished'">
              <h3 class="card-title">提案-拿样要求</h3>
              <div class="card-grid grid-2">
                <div class="item flex-row"><label>开发方式</label><el-tag size="small" class="custom-tag">{{ currentTask.devMethod || '全新品-定制' }}</el-tag></div>
                <div class="item"><label>开发品牌</label><span>{{ currentTask.brand || 'MoKo' }}</span></div>
                <div class="item"><label>初始Logo位置</label><span>{{ currentTask.logoPosition || '无' }}</span></div>
                <div class="item"><label>初始包装方式</label><span>{{ currentTask.packagingMethod || '盒装' }}</span></div>
                <div class="item"><label>首单采购数量</label><span>{{ currentTask.buyQty || '500' }}</span></div>
                <div class="item"><label>首单采购总金额</label><span>¥ {{ currentTask.totalAmount || '115,000.00' }}</span></div>
                <div class="item"><label>上架时间要求</label><span>{{ currentTask.launchTime || '2026-07-15' }}</span></div>
              </div>
            </div>

          <div class="info-card no-padding-bottom">
              <h3 class="card-title">提案-时效要求</h3>
              <div class="time-list">
                <div class="time-row"><label>任务发布时间</label><span>05-20 09:00</span></div>
                <div class="time-row"><label>反馈截止时间</label><span>05-22 18:00</span></div>
                <div class="time-row"><label>任务截止时间</label><span>05-31 18:00</span></div>
              </div>
              <div class="custom-dotted-divider"></div>
              <div class="card-countdown">
                <div class="cd-box feedback">
                  <div class="val">02<small>d</small>14<small>h</small></div>
                  <div class="lab">反馈倒计时</div>
                </div>
                <div class="cd-box task">
                  <div class="val">11<small>d</small>23<small>h</small></div>
                  <div class="lab">任务倒计时</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. 提案-调研信息 -->
          <div class="info-card mb-12" v-if="activeTab !== 'unfinished'">
            <h3 class="card-title">提案-调研信息</h3>
            <div class="data-grid grid-3 mb-20">
              <div class="item"><label>产品来源</label><span>-</span></div>
              <div class="item"><label>使用场景</label><span>室内居家、工作室</span></div>
              <div class="item"><label>使用人群</label><span>全年龄段拼图爱好者</span></div>
              
              <div class="item"><label>主攻市场</label><span>北美</span></div>
              <div class="item"><label>季节标签</label><span>无</span></div>
              <div class="item"><label>节日标签</label><span>无</span></div>

              <div class="item span-2">
                <label>卖点说明</label>
                <span class="value-text">1.可旋转可调节高度拼图桌 2.改抽屉和腿，差评抽屉阻挡调节和旋转 放腿 3.优化腿部的结构，防止撞到小腿</span>
              </div>
              <div class="item"><label>市场预估</label><span>圣诞旺季产品 预估销量1000</span></div>

              <div class="item"><label>调研分析文档</label><el-link type="primary" :underline="false">空白.xls</el-link></div>
              <div class="item flex-row">
                <label><span class="red-star">*</span>参考链接1</label>
                <el-link type="primary" :underline="false" class="ml-4">https://www.amazon.com/...</el-link>
              </div>
              <div class="item flex-row align-start">
                <label>参考图片</label>
                <el-image :src="currentTask.image" class="ref-image-box" />
              </div>
            </div>
          </div>

          <!-- 5. 提案-任务明细 -->
          <div class="info-card" v-if="activeTab !== 'unfinished'">
            <h3 class="card-title">提案-任务明细</h3>
            <div class="detail-sub-title mb-12">
              <el-icon class="icon"><Document /></el-icon>
              <span>任务说明</span>
            </div>

            <!-- 现货拿样任务说明 -->
            <template v-if="currentTask.sampleMethodText === '现货拿样'">
              <div class="data-grid grid-3 mb-20 spec-requirements-grid">
                <div class="item span-3 highlight-price">
                  <label>底线采购价</label>
                  <span class="value">{{ currentTask.bottomLinePrice || '32 CNY' }}</span>
                </div>
                
                <div class="item">
                  <label>款式要求</label>
                  <span>{{ currentTask.styleRequirement || '透明无划痕，边缘光滑' }}</span>
                </div>
                <div class="item">
                  <label>适用品牌或对象要求</label>
                  <span>{{ currentTask.brandRequirement || '通用' }}</span>
                </div>

                <div class="item">
                  <label>材质要求</label>
                  <span>{{ currentTask.materialRequirement || '高透亚克力，厚度不低于3mm' }}</span>
                </div>
                <div class="item">
                  <label>图案要求</label>
                  <span>{{ currentTask.patternRequirement || '无图案' }}</span>
                </div>

                <div class="item">
                  <label>颜色要求</label>
                  <span>{{ currentTask.colorRequirement || '无色透明' }}</span>
                </div>
                <div class="item">
                  <label>尺寸要求</label>
                  <span>{{ currentTask.sizeRequirement || '适配 20*20*15cm 的拼图成品' }}</span>
                </div>

                <div class="item">
                  <label>重量要求</label>
                  <span>{{ currentTask.weightRequirement || '单品重量不超过150g' }}</span>
                </div>
                <div class="item">
                  <label>包装数量要求</label>
                  <span>{{ currentTask.packQtyRequirement || '1个/盒' }}</span>
                </div>

                <div class="item">
                  <label>功能要求</label>
                  <span>{{ currentTask.functionRequirement || '防尘、通透度好' }}</span>
                </div>
                <div class="item">
                  <label>配件要求</label>
                  <span>{{ currentTask.accessoryRequirement || '无' }}</span>
                </div>

                <div class="item">
                  <label>包装要求</label>
                  <span>{{ currentTask.packagingRequirement || '独立OPP袋+气泡袋保护' }}</span>
                </div>
                <div class="item">
                  <label>合规要求</label>
                  <span>{{ currentTask.complianceRequirement || '符合玩具安全标准 EN71' }}</span>
                </div>

                <div class="item">
                  <label>认证要求</label>
                  <span>{{ currentTask.certRequirement || '无' }}</span>
                </div>
              </div>

              <div class="supplementary-box mb-20">
                <span class="label">补充说明</span>
                <span class="content">{{ currentTask.supplementaryRequirement || '请重点确认材质的防刮擦性能' }}</span>
              </div>
            </template>

            <!-- 定制拿样任务说明 -->
            <template v-else>
              <div class="data-grid grid-2 mb-20">
                <div class="item">
                  <label>产品规格书</label>
                  <el-link type="primary" :underline="false">亲肤腰带-隐身薄款(市调).20260416.xlsx</el-link>
                </div>
                <div class="item flex-row justify-end">
                  <label style="width: auto; margin-right: 12px;">底线采购价</label>
                  <span class="value" style="font-size: 16px; font-weight: 700; color: #262626;">32 CNY</span>
                </div>
              </div>

              <div class="supplementary-box mb-20">
                <span class="label">补充说明</span>
                <span class="content">请工厂重点确认魔术贴的使用寿命，以及边缘缝线是否容易脱落</span>
              </div>
            </template>

            <div class="detail-sub-title mb-12">
              <el-icon class="icon"><Management /></el-icon>
              <span>任务执行</span>
            </div>

            <!-- 定制反馈列表 (定制拿样显示) -->
            <div class="feedback-list-container" v-if="currentTask.sampleMethodText === '定制拿样'">
              <div class="list-header">
                <span class="title">定制反馈列表</span>
                <el-button type="primary" link icon="Plus" @click="handleCustomFeedback">添加反馈</el-button>
              </div>
              <el-table :data="feedbackListData" border stripe size="small" class="custom-table">
                <el-table-column label="反馈编号" prop="code" width="130" fixed="left" />
                <el-table-column label="货源地" prop="source" width="140" />
                <el-table-column label="费用(类型)" width="100">
                  <template #default="{ row }">
                    <div class="fee-cell">
                      <span class="fee-amt">{{ row.feeAmount }}</span>
                      <span class="fee-type">{{ row.feeType }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="模具归属" prop="moldOwnership" width="80" />
                <el-table-column label="定制用时" prop="customDuration" width="80" />
                <el-table-column label="初次报价" prop="initialQuote" width="90" />
                <el-table-column label="生产周期" prop="productionCycle" width="80" />
                <el-table-column label="起订量" prop="moq" width="75" />
                <el-table-column label="是否可退款" prop="isRefundable" width="90" />
                <el-table-column label="退款条款" min-width="160" show-overflow-tooltip>
                  <template #default="{ row }">
                    <div v-if="row.isRefundable === '是'" class="refund-cell">
                      <span class="refund-method">{{ row.refundMethod }}</span>
                      <span class="refund-condition">条件: {{ row.refundCondition }}</span>
                    </div>
                    <span v-else class="text-secondary">-</span>
                  </template>
                </el-table-column>
                <el-table-column label="附加条件" prop="additionalConditions" min-width="160" show-overflow-tooltip />
                <el-table-column label="状态" width="95" fixed="right">
                  <template #default="{ row }">
                    <el-tag :type="row.statusType" size="small">{{ row.status }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="160" fixed="right">
                  <template #default="{ row }">
                    <template v-if="['待提交', '已驳回'].includes(row.status)">
                      <el-button type="primary" link size="small">编辑</el-button>
                      <el-button type="danger" link size="small" @click="handleDeleteFeedback(row)">删除</el-button>
                    </template>
                    <template v-if="row.status === '已采纳'">
                      <el-button v-if="row.feeAmount === '¥ 0.00'" type="primary" link size="small" @click="handleSampleRegistration(row)">样品登记</el-button>
                      <el-button v-else type="primary" link size="small" @click="handlePurchaseApply(row)">{{ row.feeType === '开模费' ? '模具申请' : '购样申请' }}</el-button>
                      <el-button type="primary" link size="small" @click="handleExecutionDetail(row)">关联单据</el-button>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 拿样执行列表 (现货拿样显示) -->
            <div class="feedback-list-container" v-if="currentTask.sampleMethodText === '现货拿样'">
              <div class="list-header">
                <span class="title">拿样执行列表</span>
                <div style="display: flex; gap: 8px;">
                  <el-button type="primary" link icon="Plus" @click="handlePurchaseApply()">发起购样申请</el-button>
                  <el-button type="primary" link icon="Plus" @click="handleSampleRegistration()">样品登记</el-button>
                </div>
              </div>
              <el-table :data="purchaseListData" border stripe size="small" class="custom-table">
                <el-table-column label="单据编号" prop="applyNo" width="145" fixed="left">
                  <template #default="{ row }">
                    <span class="font-mono">{{ row.applyNo }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="单据类型" width="95">
                  <template #default="{ row }">
                    <el-tag v-if="row.type === 'direct'" size="small" type="success" effect="light">直接登记</el-tag>
                    <el-tag v-else size="small" type="primary" effect="light">购样申请</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="样品名称" prop="sampleName" min-width="120" />
                <el-table-column label="渠道" prop="channel" width="80" />
                <el-table-column label="供应商/链接" min-width="160" show-overflow-tooltip>
                  <template #default="{ row }">
                    <span v-if="row.channel === '供应商'">{{ row.supplier }}</span>
                    <el-link v-else type="primary" :underline="false" :href="row.purchaseUrl" target="_blank" class="link-text-ellipsis">{{ row.purchaseUrl }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="数量" prop="qty" width="70" />
                <el-table-column label="单价" prop="price" width="80" />
                <el-table-column label="费用合计" prop="amount" width="100">
                  <template #default="{ row }">
                    <span v-if="row.type === 'direct'" style="color: #52c41a; font-weight: 600;">{{ row.amount }}</span>
                    <span v-else style="color: #fa8c16; font-weight: 600;">{{ row.amount }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="费用类型" width="90">
                  <template #default="{ row }">
                    <el-tag size="small" type="warning" effect="light">{{ row.feeType || '购样费' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="95" fixed="right">
                  <template #default="{ row }">
                    <el-tag :type="getStatusTagType(row.status)" size="small">{{ row.status }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="220" fixed="right">
                  <template #default="{ row }">
                    <!-- 直接登记的操作 -->
                    <template v-if="row.type === 'direct'">
                      <el-button type="primary" link size="small" @click="handleExecutionDetail(row)">关联单据</el-button>
                      <el-button v-if="row.status === '待提交'" type="primary" link size="small" @click="handleSampleEdit(row)">编辑</el-button>
                      <el-button v-if="row.status === '待提交'" type="danger" link size="small" @click="handlePurchaseDelete(row)">删除</el-button>
                    </template>
                    
                    <!-- 购样申请的操作 -->
                    <template v-else>
                      <el-button type="primary" link size="small" @click="handleExecutionDetail(row)">关联单据</el-button>
                      <el-button v-if="['待提交', '待更新合同'].includes(row.status)" type="primary" link size="small" @click="handlePurchaseEdit(row)">编辑</el-button>
                      <el-button v-if="row.status === '待提交'" type="danger" link size="small" @click="handlePurchaseDelete(row)">删除</el-button>
                      <!-- 样品登记 (审批同意时显示) -->
                      <el-button v-if="row.status === '同意'" type="primary" link size="small" @click="handleSampleRegistration(row)">样品登记</el-button>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </main>
    </div>
    
    <!-- 弹窗组件挂载 -->
    <CustomFeedbackDialog ref="customFeedbackRef" />
    <PurchaseApplyDialog ref="purchaseApplyRef" @submit="handlePurchaseApplySubmit" />
    <PurchaseDetailDialog ref="purchaseDetailRef" />
    <SampleRegistrationDialog ref="sampleRegistrationRef" @refresh="handleSampleRegistrationSubmit" />
    <SampleRegistrationDetailDialog ref="sampleRegistrationDetailRef" />
    <ExecutionDetailDrawer ref="executionDetailDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Clock, CopyDocument, Check, Plus, Document, Management, ShoppingCart, List } from '@element-plus/icons-vue'
import CustomFeedbackDialog from './components/CustomFeedbackDialog.vue'
import PurchaseApplyDialog from './components/PurchaseApplyDialog.vue'
import PurchaseDetailDialog from './components/PurchaseDetailDialog.vue'
import SampleRegistrationDialog from './components/SampleRegistrationDialog.vue'
import SampleRegistrationDetailDialog from './components/SampleRegistrationDetailDialog.vue'
import ExecutionDetailDrawer from './components/ExecutionDetailDrawer.vue'

const searchQuery = ref('')
const activeTab = ref('accepted')
const currentTask = ref<any>(null)
const customFeedbackRef = ref<any>(null)
const purchaseApplyRef = ref<any>(null)
const purchaseDetailRef = ref<any>(null)
const sampleRegistrationRef = ref<any>(null)
const sampleRegistrationDetailRef = ref<any>(null)
const executionDetailDrawerRef = ref<any>(null)

const daysTooltipContent = computed(() => {
  if (activeTab.value === 'unfinished') {
    return '计算逻辑：当前时间-任务发布时间'
  }
  if (activeTab.value === 'accepted') {
    return '计算逻辑：当前时间-任务承接时间'
  }
  if (activeTab.value === 'completed') {
    return '计算逻辑：任务完成时间-任务发布时间'
  }
  return ''
})

const statusTabs = [
  { label: '未完成', value: 'unfinished' },
  { label: '已承接', value: 'accepted' },
  { label: '已完成', value: 'completed' },
  { label: '购样申请', value: 'purchase_apply' },
  { label: '样品待反馈', value: 'sample_feedback' }
]

const steps = ['任务发布', '任务承接', '定制反馈', '购样申请', '费用审批', '样品登记', '开发反馈', '任务归档']

const tableData = ref([
  {
    image: 'https://picsum.photos/100/100?random=1',
    proposalNo: 'TA-202605049',
    productName: 'DIY灯光板 - 亚克力透明款',
    pm: '颜沙沙',
    sampleMethodText: '现货拿样',
    category: '家居装饰',
    remainingDays: 7,
    isUrgent: true,
    style: '透明款',
    material: '亚克力',
    model: 'DIY-001',
    applicableTo: '通用',
    spu: 'SPU001',
    brand: 'MoKo',
    logoPosition: '侧面',
    packagingMethod: '盒装',
    buyQty: '100',
    totalAmount: '2,000.00',
    launchTime: '2026-06-30',
    bottomLinePrice: '32 CNY',
    styleRequirement: '透明无划痕，边缘光滑',
    materialRequirement: '高透亚克力，厚度不低于3mm',
    colorRequirement: '无色透明',
    weightRequirement: '单品重量不超过150g',
    functionRequirement: '防尘、通透度好',
    packagingRequirement: '独立OPP袋+气泡袋保护',
    certRequirement: '无',
    brandRequirement: '通用',
    patternRequirement: '无图案',
    sizeRequirement: '适配 20*20*15cm 的拼图成品',
    packQtyRequirement: '1个/盒',
    accessoryRequirement: '无',
    complianceRequirement: '符合玩具安全标准 EN71',
    supplementaryRequirement: '请重点确认材质的防刮擦性能',
    acceptors: ['张三', '李四']
  },
  {
    image: 'https://picsum.photos/100/100?random=11',
    proposalNo: 'TA-202605061',
    productName: '折叠笔记本支架 - 加厚版',
    pm: '赵敏',
    sampleMethodText: '现货拿样',
    category: '数码配件',
    remainingDays: 5,
    isUrgent: true,
    style: '加厚版',
    material: '铝合金',
    model: 'NB-ST01',
    applicableTo: '笔记本电脑',
    spu: 'SPU002',
    brand: 'MoKo',
    logoPosition: '面板',
    packagingMethod: '盒装',
    buyQty: '200',
    totalAmount: '8,000.00',
    launchTime: '2026-07-10',
    acceptors: ['王五']
  },
  {
    image: 'https://picsum.photos/200/200?random=25',
    proposalNo: 'TA-202605069',
    productName: '电子墨水屏阅读器',
    pm: '李健',
    sampleMethodText: '定制拿样',
    category: '智能硬件',
    remainingDays: 11,
    isUrgent: false,
    style: '墨水屏Pro版',
    material: '复合塑胶 + 电子墨水屏',
    model: 'EP-2026-V1',
    applicableTo: '商务人士',
    spu: 'SPU882910',
    brand: 'MoKo',
    logoPosition: '背面',
    packagingMethod: '礼盒装',
    buyQty: '500',
    totalAmount: '115,000.00',
    launchTime: '2026-07-15',
    acceptors: []
  },
  {
    image: 'https://picsum.photos/200/200?random=22',
    proposalNo: 'TA-202605066',
    productName: '多功能露营灯',
    pm: '颜沙沙',
    sampleMethodText: '现货拿样',
    category: '户外运动',
    remainingDays: 11,
    isUrgent: false,
    style: '多功能款',
    material: 'ABS',
    model: 'CP-L01',
    applicableTo: '露营爱好者',
    spu: 'SPU004',
    brand: 'MoKo',
    logoPosition: '顶部',
    packagingMethod: '彩盒',
    buyQty: '300',
    totalAmount: '5,000.00',
    launchTime: '2026-08-01',
    acceptors: ['李四', '赵铁柱']
  },
  {
    image: 'https://picsum.photos/200/200?random=24',
    proposalNo: 'TA-202605068',
    productName: '桌面加湿器 - 极简版',
    pm: '邓紫棋',
    sampleMethodText: '现货拿样',
    category: '生活电器',
    remainingDays: 13,
    isUrgent: false,
    style: '极简版',
    material: 'PP',
    model: 'HM-D01',
    applicableTo: '通用',
    spu: 'SPU005',
    brand: 'MoKo',
    logoPosition: '正面',
    packagingMethod: '白盒',
    buyQty: '1000',
    totalAmount: '12,000.00',
    launchTime: '2026-09-01',
    acceptors: []
  },
  {
    image: 'https://picsum.photos/200/200?random=26',
    proposalNo: 'TA-202605070',
    productName: '机械键盘 - 复古款',
    pm: '颜沙沙',
    sampleMethodText: '现货拿样',
    category: '数码配件',
    remainingDays: 12,
    isUrgent: false,
    style: '复古款',
    material: 'PBT',
    model: 'KB-R01',
    applicableTo: '电脑用户',
    spu: 'SPU006',
    brand: 'MoKo',
    logoPosition: '底部',
    packagingMethod: '礼盒',
    buyQty: '150',
    totalAmount: '15,000.00',
    launchTime: '2026-10-15',
    acceptors: ['张三']
  }
])

currentTask.value = tableData.value[2]

const urgentTasks = computed(() => tableData.value.filter(i => i.isUrgent))
const normalTasks = computed(() => tableData.value.filter(i => !i.isUrgent))

const getStepStatus = (index: number) => {
  if (index < 1) return 'done'
  if (index === 1) return 'active'
  return 'pending'
}

const handleAcceptTask = () => {
  if (!currentTask.value) return
  if (!currentTask.value.acceptors) {
    currentTask.value.acceptors = []
  }
  if (currentTask.value.acceptors.includes('我')) {
    ElMessage.warning('您已经承接了该任务')
    return
  }

  ElMessageBox.confirm(
    `确定要承接提案任务吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
      buttonSize: 'small'
    }
  ).then(() => {
    currentTask.value.acceptors.push('我')
    ElMessage.success('任务承接成功')
  }).catch(() => {})
}

const handleCustomFeedback = () => {
  customFeedbackRef.value?.open()
}

const handlePurchaseApply = (row?: any) => {
  console.log('Opening Purchase Apply Dialog', row)
  if (purchaseApplyRef.value) {
    const data = row ? { ...row } : {}
    if (currentTask.value?.sampleMethodText === '现货拿样' && !data.feeType) {
      data.feeType = '购样费'
    }
    purchaseApplyRef.value.open(data)
  } else {
    console.error('purchaseApplyRef is not initialized')
  }
}

const handlePurchaseDetail = (row: any) => {
  purchaseDetailRef.value?.open(row)
}

const handlePurchaseEdit = (row: any) => {
  purchaseApplyRef.value?.open(row)
}

const handlePurchaseDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除购样申请 ${row.applyNo} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    buttonSize: 'small'
  }).then(() => {
    const index = purchaseListData.value.findIndex(i => i.applyNo === row.applyNo)
    if (index !== -1) {
      purchaseListData.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

const handlePurchaseApplySubmit = (items: any[]) => {
  if (!items) return
  items.forEach(item => {
    const idx = purchaseListData.value.findIndex(p => p.applyNo === item.applyNo)
    if (idx !== -1) {
      purchaseListData.value[idx] = { ...purchaseListData.value[idx], ...item }
      ElMessage.success('保存成功')
    } else {
      const newApplyNo = 'PO-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900)
      purchaseListData.value.push({
        ...item,
        applyNo: newApplyNo,
        status: '待提交',
        applyTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        registrations: []
      })
      ElMessage.success('成功发起购样申请')
    }
  })
}

const getStatusTagType = (status: string) => {
  switch (status) {
    case '同意':
    case '已通过': return 'success'
    case '待审批':
    case '审批中': return 'warning'
    case '不同意':
    case '已驳回': return 'danger'
    case '待更新合同': return 'primary'
    case '待提交': return 'info'
    default: return 'info'
  }
}

const purchaseListData = ref<any[]>([
  {
    applyNo: 'PO-20260524-01',
    sampleName: 'DIY灯光板样品',
    channel: '1688',
    purchaseUrl: 'https://detail.1688.com/offer/6791028391.html',
    qty: 10,
    price: '¥ 15.00',
    amount: '¥ 150.00',
    feeType: '购样费',
    status: '待提交',
    applyTime: '2026-06-03 17:00'
  },
  {
    applyNo: 'PO-20260524-02',
    sampleName: '亚克力保护外壳',
    channel: '供应商',
    supplier: '线下-深圳供应商',
    qty: 1,
    price: '¥ 200.00',
    amount: '¥ 200.00',
    feeType: '打样费',
    status: '待审批',
    applyTime: '2026-06-03 14:00'
  },
  {
    applyNo: 'PO-20260524-03',
    sampleName: '折叠笔记本底座',
    channel: '供应商',
    supplier: '长期合作-东莞五金厂',
    qty: 2,
    price: '¥ 4000.00',
    amount: '¥ 8000.00',
    feeType: '开模费',
    status: '待更新合同',
    applyTime: '2026-06-01 09:30',
    contractFiles: [{ name: '五金底座开模合同.pdf', url: '#' }],
    contractAmount: 8000,
    contractRemark: '模具产权归我司，订单满5万件退还'
  },
  {
    applyNo: 'PO-20260524-04',
    sampleName: '发光LED灯珠小样',
    channel: '淘宝',
    purchaseUrl: 'https://item.taobao.com/item.htm?id=12891923',
    qty: 50,
    price: '¥ 1.20',
    amount: '¥ 60.00',
    feeType: '购样费',
    status: '同意',
    applyTime: '2026-05-21 14:00',
    registrations: [
      {
        regNo: 'DJ-20260603-10',
        pattern: '高亮红光',
        color: '红色',
        spec: '3mm圆头',
        sampleSize: '3*3*5mm',
        netWeight: '0.01kg',
        status: '待提交',
        image: 'https://picsum.photos/60/60?random=15'
      }
    ]
  },
  {
    applyNo: 'PO-20260524-05',
    sampleName: '多功能露营灯外壳',
    channel: '1688',
    purchaseUrl: 'https://detail.1688.com/offer/982103982.html',
    qty: 2,
    price: '¥ 35.00',
    amount: '¥ 70.00',
    feeType: '购样费',
    status: '不同意',
    applyTime: '2026-06-02 10:00'
  },
  {
    applyNo: 'DJ-20260603-12',
    sampleName: '亚克力外壳拼图框样品',
    channel: '供应商',
    supplier: '长期合作-中山光源厂',
    qty: 1,
    price: '¥ 0.00',
    amount: '免费',
    feeType: '无',
    status: '已登记',
    type: 'direct',
    applyTime: '2026-06-03 18:00',
    registrations: [
      {
        regNo: 'DJ-20260603-12',
        name: '亚克力外壳拼图框样品',
        pattern: '无',
        color: '透明',
        spec: '通用',
        sampleSize: '20×20×15 cm',
        netWeight: '120g',
        status: '有效',
        image: 'https://picsum.photos/60/60?random=18'
      }
    ]
  },
  {
    applyNo: 'DJ-20260603-13',
    sampleName: 'LED高亮红光灯珠配件',
    channel: '淘宝',
    purchaseUrl: 'https://item.taobao.com/item.htm?id=12891923',
    qty: 10,
    price: '¥ 0.00',
    amount: '免费',
    feeType: '无',
    status: '待提交',
    type: 'direct',
    applyTime: '2026-06-03 19:30',
    registrations: [
      {
        regNo: 'DJ-20260603-13',
        name: 'LED高亮红光灯珠配件',
        pattern: '红光',
        color: '红色',
        spec: '英规',
        sampleSize: '5×5×8 mm',
        netWeight: '5g',
        status: '待提交',
        image: 'https://picsum.photos/60/60?random=19'
      }
    ]
  }
])

const handleDeleteFeedback = (row: any) => {
  ElMessageBox.confirm(`确定要删除反馈方案 ${row.code} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    buttonSize: 'small'
  }).then(() => {
    const index = feedbackListData.value.findIndex(i => i.code === row.code)
    if (index !== -1) {
      feedbackListData.value.splice(index, 1)
      ElMessage.success('方案已删除')
    }
  }).catch(() => {})
}

const activeRegisteringPurchase = ref<any>(null)
const editingRegNo = ref('')

const handleSampleRegistration = (taskData?: any) => {
  console.log('Opening Sample Registration Dialog', taskData)
  if (sampleRegistrationRef.value) {
    activeRegisteringPurchase.value = taskData || null
    const syncData = {
      ...(currentTask.value || {}),
      ...(taskData || {})
    }
    sampleRegistrationRef.value.open(syncData)
  } else {
    console.error('sampleRegistrationRef is not initialized')
  }
}

const handleSampleEdit = (row: any) => {
  const reg = row.registrations?.[0] || row
  editingRegNo.value = reg.regNo
  sampleRegistrationRef.value?.open(reg)
}

const handleViewSample = (row: any) => {
  if (row.registrations && row.registrations.length > 0) {
    sampleRegistrationDetailRef.value?.open(row.registrations[0])
  } else if (row.type === 'direct') {
    sampleRegistrationDetailRef.value?.open(row.registrations?.[0] || row)
  }
}

const handleSampleRegistrationSubmit = (formData: any) => {
  const newRegNo = 'DJ-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900)
  
  if (editingRegNo.value) {
    const row = purchaseListData.value.find(p => p.registrations && p.registrations.some((r: any) => r.regNo === editingRegNo.value))
    if (row) {
      const reg = row.registrations.find((r: any) => r.regNo === editingRegNo.value)
      if (reg) {
        reg.name = formData.name
        if (formData.details && formData.details[0]) {
          reg.pattern = formData.details[0].pattern
          reg.color = formData.details[0].color
          reg.spec = formData.details[0].spec
          reg.sampleSize = `${formData.details[0].length || 0}×${formData.details[0].width || 0}×${formData.details[0].height || 0} ${formData.details[0].sampleSizeUnit}`
          reg.netWeight = `${formData.details[0].netWeight || 0}${formData.details[0].netWeightUnit}`
          reg.image = formData.details[0].images?.[0] || reg.image
        }
        if (row.type === 'direct') {
          row.sampleName = formData.name
          row.channel = formData.source === '1' ? '供应商' : (formData.source === '2' ? '1688' : '淘宝')
          row.supplier = formData.supplierName
          row.purchaseUrl = formData.purchaseUrl
          row.price = '¥ ' + (formData.sampleFee || 0).toFixed(2)
          row.amount = formData.sampleFee > 0 ? '¥ ' + (formData.sampleFee || 0).toFixed(2) : '免费'
        }
        ElMessage.success('保存成功')
      }
    }
    editingRegNo.value = ''
    return
  }

  if (activeRegisteringPurchase.value && activeRegisteringPurchase.value.applyNo) {
    const po = purchaseListData.value.find(p => p.applyNo === activeRegisteringPurchase.value.applyNo)
    if (po) {
      if (!po.registrations) po.registrations = []
      po.registrations.push({
        regNo: newRegNo,
        name: formData.name,
        pattern: formData.details?.[0]?.pattern || '',
        color: formData.details?.[0]?.color || '',
        spec: formData.details?.[0]?.spec || '通用',
        sampleSize: `${formData.details?.[0]?.length || 0}×${formData.details?.[0]?.width || 0}×${formData.details?.[0]?.height || 0} ${formData.details?.[0]?.sampleSizeUnit || 'cm'}`,
        netWeight: `${formData.details?.[0]?.netWeight || 0}${formData.details?.[0]?.netWeightUnit || 'g'}`,
        status: '已提交',
        image: formData.details?.[0]?.images?.[0] || 'https://picsum.photos/60/60?random=15'
      })
      ElMessage.success('样品登记成功')
    }
  } else {
    purchaseListData.value.push({
      applyNo: newRegNo,
      sampleName: formData.name || '样品直接登记',
      channel: formData.source === '1' ? '供应商' : (formData.source === '2' ? '1688' : '淘宝'),
      supplier: formData.supplierName,
      purchaseUrl: formData.purchaseUrl,
      qty: 1,
      price: '¥ ' + (formData.sampleFee || 0).toFixed(2),
      amount: formData.sampleFee > 0 ? '¥ ' + (formData.sampleFee || 0).toFixed(2) : '免费',
      feeType: '无',
      status: '已登记',
      type: 'direct',
      applyTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      registrations: [{
        regNo: newRegNo,
        name: formData.name,
        pattern: formData.details?.[0]?.pattern || '',
        color: formData.details?.[0]?.color || '',
        spec: formData.details?.[0]?.spec || '通用',
        sampleSize: `${formData.details?.[0]?.length || 0}×${formData.details?.[0]?.width || 0}×${formData.details?.[0]?.height || 0} ${formData.details?.[0]?.sampleSizeUnit || 'cm'}`,
        netWeight: `${formData.details?.[0]?.netWeight || 0}${formData.details?.[0]?.netWeightUnit || 'g'}`,
        status: '已提交',
        image: formData.details?.[0]?.images?.[0] || 'https://picsum.photos/60/60?random=15'
      }]
    })
    ElMessage.success('样品直接登记成功')
  }
}

const handleExecutionDetail = (row: any) => {
  if (executionDetailDrawerRef.value) {
    executionDetailDrawerRef.value.open(row)
  }
}

const feedbackListData = ref([
  {
    code: 'FA-20260520-01',
    source: '1688-广州某工厂',
    feeType: '开模费',
    feeAmount: '¥ 5,000.00',
    moldOwnership: '公司',
    customDuration: '15天',
    initialQuote: '¥ 85.00',
    productionCycle: '25天',
    moq: '1000',
    isRefundable: '是',
    refundMethod: '返现金',
    refundCondition: '首单满1万',
    additionalConditions: '含彩盒包装',
    status: '待开发反馈',
    statusType: 'primary'
  },
  {
    code: 'FA-20260520-02',
    source: '线下-深圳供应商',
    feeType: '打样费',
    feeAmount: '¥ 50.00',
    moldOwnership: '-',
    customDuration: '7天',
    initialQuote: '¥ 78.00',
    productionCycle: '20天',
    moq: '500',
    isRefundable: '否',
    refundMethod: '-',
    refundCondition: '-',
    additionalConditions: '无',
    status: '已采纳',
    statusType: 'success'
  },
  {
    code: 'FA-20260523-07',
    source: '阿里国际-义乌供应商',
    feeType: '打样费',
    feeAmount: '¥ 120.00',
    moldOwnership: '-',
    customDuration: '4天',
    initialQuote: '¥ 88.00',
    productionCycle: '20天',
    moq: '1000',
    isRefundable: '是',
    refundMethod: '抵扣货款',
    refundCondition: '首单退',
    additionalConditions: '测试单个待提交购样单',
    status: '已采纳',
    statusType: 'success'
  },
  {
    code: 'FA-20260523-08',
    source: '阿里国际-宁波供应商',
    feeType: '打样费',
    feeAmount: '¥ 350.00',
    moldOwnership: '-',
    customDuration: '6天',
    initialQuote: '¥ 95.00',
    productionCycle: '25天',
    moq: '1500',
    isRefundable: '是',
    refundMethod: '抵扣货款',
    refundCondition: '满2万退',
    additionalConditions: '测试多个购样申请记录',
    status: '已采纳',
    statusType: 'success'
  },
  {
    code: 'FA-20260525-09',
    source: '长期合作-东莞模具厂',
    feeType: '开模费',
    feeAmount: '¥ 8,000.00',
    moldOwnership: '公司',
    customDuration: '18天',
    initialQuote: '¥ 120.00',
    productionCycle: '30天',
    moq: '2000',
    isRefundable: '是',
    refundMethod: '抵扣大货款',
    refundCondition: '满10万退',
    additionalConditions: '含试模样品及两次改模',
    status: '已采纳',
    statusType: 'success'
  },
  {
    code: 'FA-20260520-03',
    source: '阿里国际-义乌供应商',
    feeType: '打样费',
    feeAmount: '¥ 150.00',
    moldOwnership: '-',
    customDuration: '5天',
    initialQuote: '¥ 92.00',
    productionCycle: '30天',
    moq: '2000',
    isRefundable: '是',
    refundMethod: '抵扣货款',
    refundCondition: '起订量翻倍',
    additionalConditions: '运费自理',
    status: '未采纳',
    statusType: 'info'
  },
  {
    code: 'FA-20260521-04',
    source: '東莞某五金厂',
    feeType: '开模费',
    feeAmount: '¥ 12,000.00',
    moldOwnership: '共有',
    customDuration: '30天',
    initialQuote: '¥ 65.00',
    productionCycle: '45天',
    moq: '5000',
    isRefundable: '否',
    refundMethod: '-',
    refundCondition: '-',
    additionalConditions: '模具寿命20万模',
    status: '已驳回',
    statusType: 'danger'
  },
  {
    code: 'FA-20260521-05',
    source: '线下-苏州电子',
    feeType: '开模费',
    feeAmount: '¥ 8,000.00',
    moldOwnership: '供应商',
    customDuration: '20天',
    initialQuote: '¥ 110.00',
    productionCycle: '35天',
    moq: '1500',
    isRefundable: '是',
    refundMethod: '抵扣首单',
    refundCondition: '满5万退',
    additionalConditions: '含两轮功能验证',
    status: '待提交',
    statusType: 'warning'
  },
  {
    code: 'FA-20260522-06',
    source: '长期合作-惠州工厂',
    feeType: '打样费',
    feeAmount: '¥ 0.00',
    moldOwnership: '-',
    customDuration: '3天',
    initialQuote: '¥ 62.00',
    productionCycle: '15天',
    moq: '300',
    isRefundable: '否',
    refundMethod: '-',
    refundCondition: '-',
    additionalConditions: '样机免费寄送',
    status: '已采纳',
    statusType: 'success'
  },
  {
    code: 'FA-20260522-07',
    source: '长期合作-中山光源厂',
    feeType: '打样费',
    feeAmount: '¥ 0.00',
    moldOwnership: '-',
    customDuration: '4天',
    initialQuote: '¥ 45.00',
    productionCycle: '12天',
    moq: '500',
    isRefundable: '否',
    refundMethod: '-',
    refundCondition: '-',
    additionalConditions: '测试多个直接登记（免费打样）',
    status: '已采纳',
    statusType: 'success'
  }
])
</script>

<style lang="scss" scoped>
.sample-task-page { height: 100vh; background: #f0f2f5; display: flex; flex-direction: column; }
.workbench-layout { display: flex; flex: 1; overflow: hidden; }

// Side Panel
.side-panel {
  width: 320px; 
  background: #f8fafc; 
  border-right: 1px solid #e2e8f0; 
  display: flex; 
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.015);
  z-index: 10;
  
  .side-header {
    padding: 16px 14px; 
    border-bottom: 1px solid #edf2f7;
    background: #ffffff;
    
    .search-box { 
      margin-bottom: 16px; 
      :deep(.el-input__wrapper) {
        border-radius: 8px;
        box-shadow: 0 0 0 1px #e2e8f0 inset;
        background-color: #f8fafc;
        transition: all 0.25s ease;
        &.is-focus, &:hover {
          background-color: #ffffff;
          box-shadow: 0 0 0 1px #3b82f6 inset, 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
      }
    }
    
    .urgent-container {
      background: linear-gradient(135deg, #fff5f5 0%, #fff8f8 100%); 
      border: 1px solid #fee2e2; 
      border-radius: 10px; 
      padding: 14px; 
      margin-bottom: 16px;
      box-shadow: 0 2px 6px rgba(239, 68, 68, 0.03);
      
      .urgent-summary-line {
        display: flex; 
        align-items: center; 
        margin-bottom: 12px;
        .clock-icon { color: #ef4444; margin-right: 8px; font-size: 15px; animation: pulse 2s infinite; }
        .label { color: #dc2626; font-size: 13px; font-weight: 700; flex: 1; }
        .count-badge { background: #ef4444; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 12px; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2); }
      }
      
      .urgent-card-list {
        display: flex; 
        flex-direction: column; 
        gap: 10px;
        
        .urgent-mini-card {
          background: #ffffff; 
          border: 1px solid #f3f4f6; 
          border-radius: 8px; 
          padding: 12px; 
          cursor: pointer; 
          position: relative;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
          
          &::before { 
            content: ''; 
            position: absolute; 
            left: 0; 
            top: 0; 
            bottom: 0; 
            width: 4px; 
            background: #ef4444; 
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
          }
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.08);
            border-color: #fca5a5;
          }
          
          &.active { 
            border-color: #ef4444; 
            background: #fffbfa; 
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.08);
          }
          
          .card-top { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 10px; 
            align-items: center;
            .id { font-size: 11px; color: #9ca3af; font-family: monospace; font-weight: 500; } 
            .urgent-label-tag { 
              background: #fee2e2; 
              color: #ef4444; 
              font-size: 10px; 
              font-weight: 700;
              padding: 2px 6px; 
              border-radius: 4px; 
            } 
          }
          
          .card-main { 
            display: flex; 
            gap: 10px; 
            align-items: center;
            .product-thumb { width: 40px; height: 40px; border-radius: 6px; border: 1px solid #f3f4f6; } 
            .info { 
              overflow: hidden; 
              flex: 1;
              .title { font-size: 12px; font-weight: 700; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; } 
              .sub { 
                font-size: 11px; color: #6b7280; font-weight: 500; 
                .urgent-acceptors-line {
                  margin-top: 4px;
                  font-size: 10px;
                  color: #0284c7;
                  font-weight: 600;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              } 
            } 
          }
        }
      }
    }
    
    .tabs-scroll-nav {
      display: flex; 
      gap: 6px; 
      overflow-x: auto; 
      padding-bottom: 2px;
      margin-top: 4px;
      &::-webkit-scrollbar { height: 0; }
      
      .tab-item {
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap; 
        font-size: 12px; 
        color: #64748b; 
        cursor: pointer; 
        padding: 6px 12px; 
        border-radius: 6px;
        transition: all 0.2s ease;
        font-weight: 500;
        
        .tab-count-badge {
          font-size: 10px;
          background: #e2e8f0;
          color: #64748b;
          padding: 1px 5px;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        
        &:hover {
          background: #f1f5f9;
          color: #334155;
        }
        
        &.active { 
          color: #3b82f6; 
          background: #eff6ff;
          font-weight: 700;
          
          .tab-count-badge {
            background: #3b82f6;
            color: #ffffff;
          }
        }
      }
    }
  }
  
  .side-body {
    flex: 1; 
    padding: 14px; 
    overflow-y: auto; 
    background: #f8fafc;
    
    .normal-task-card {
      background: #ffffff; 
      border: 1px solid #e2e8f0; 
      border-radius: 10px; 
      padding: 14px; 
      margin-bottom: 14px; 
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(148, 163, 184, 0.12);
        border-color: #cbd5e1;
      }
      
      &.active { 
        border-color: #3b82f6; 
        background: #fcfeff; 
        box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
        position: relative;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: 14px;
          bottom: 14px;
          width: 3px;
          background: #3b82f6;
          border-radius: 0 4px 4px 0;
        }
      }
      
      .card-top { 
        display: flex; 
        justify-content: space-between; 
        margin-bottom: 12px; 
        align-items: center;
        .id { font-size: 11px; color: #94a3b8; font-family: monospace; font-weight: 500; } 
        .days-tag { 
          font-size: 10px; 
          font-weight: 700;
          color: #d97706; 
          background: #fef3c7; 
          border: 1px solid #fde68a; 
          padding: 2px 6px; 
          border-radius: 6px; 
        } 
      }
      
      .card-main { 
        display: flex; 
        gap: 12px; 
        align-items: center;
        .product-thumb { width: 46px; height: 46px; border-radius: 8px; border: 1px solid #edf2f7; } 
        .info { 
          overflow: hidden; 
          flex: 1;
          .title { font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } 
          .sub { font-size: 11px; color: #64748b; font-weight: 500; .v-line { margin: 0 6px; color: #cbd5e1; } } 
        } 
      }
      
      .card-footer { 
        margin-top: 12px; 
        display: flex;
        flex-direction: column;
        .separator-line { height: 1px; background: #f1f5f9; margin-bottom: 10px; } 
        .status-link { 
          font-size: 11px; 
          color: #94a3b8; 
          text-align: right;
          font-weight: 600;
          transition: all 0.2s ease;
          &:hover {
            color: #64748b;
          }
        } 
        .acceptors-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2px;
          font-size: 11px;
          .label { color: #64748b; font-weight: 500; }
          .names { color: #0284c7; font-weight: 700; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        }
      }
    }
  }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

// Main Content
.main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #fff; }
.content-header { padding: 16px 24px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center;
  .header-left { display: flex; align-items: center; gap: 8px; .product-name { margin: 0; margin-right: 4px; font-size: 18px; font-weight: 700; } .proposal-id { display: flex; align-items: center; gap: 4px; color: #bfbfbf; font-size: 13px; margin-right: 8px; } }
}
.stepper-container { padding: 24px 60px; display: flex; justify-content: space-between; border-bottom: 1px solid #f0f0f0;
  .step-node { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative;
    .circle { width: 26px; height: 26px; border-radius: 50%; border: 1px solid #d9d9d9; display: flex; align-items: center; justify-content: center; font-size: 13px; }
    .label { margin-top: 8px; font-size: 12px; color: #bfbfbf; }
    .line { position: absolute; left: calc(50% + 13px); right: calc(-50% + 13px); height: 1px; background: #f0f0f0; top: 13px; &.completed { background: #52c41a; } }
    &.done { .circle { background: #52c41a; border-color: #52c41a; color: #fff; } .label { color: #52c41a; } }
    &.active { .circle { background: #1890ff; border-color: #1890ff; color: #fff; } .label { color: #1890ff; font-weight: 600; } }
  }
}

.content-body { flex: 1; padding: 12px 16px 60px; overflow-y: auto; background: #f0f2f5;
  .info-cards-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    &.grid-2-cols { grid-template-columns: repeat(2, 1fr); }
  }
  .info-card { 
    background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1px 20px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    .card-title { font-size: 14px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; &::before { content: ''; width: 3px; height: 14px; background: #1890ff; margin-right: 8px; } }
    
    // Grid for horizontal label-value
    .card-grid { 
      display: grid; grid-template-columns: 1fr; gap: 12px; 
      &.grid-2 { grid-template-columns: repeat(2, 1fr); gap: 12px 24px; }
      .item { 
        display: flex; align-items: baseline;
        label { width: 90px; font-size: 12px; color: #8c8c8c; flex-shrink: 0; margin-bottom: 0; }
        span { font-size: 13px; color: #262626; font-weight: 500; }
        
        .acceptors-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          flex: 1;
          align-items: center;
          :deep(.el-tag) { border-radius: 4px; font-weight: 600; }
        }
        .no-acceptors {
          font-size: 13px;
          color: #94a3b8;
        }
      }
    }
    
    .time-list {
      padding: 4px 0;
      .time-row { 
        display: flex; align-items: baseline; margin-bottom: 10px; 
        label { width: 100px; font-size: 12px; color: #8c8c8c; flex-shrink: 0; }
        span { font-size: 13px; color: #262626; font-weight: 600; flex: 1; text-align: right; }
      }
    }
    
    .custom-dotted-divider { 
      height: 1px; width: 100%; margin: 12px 0;
      background-image: linear-gradient(to right, #94a3b8 40%, rgba(255,255,255,0) 0%);
      background-position: bottom;
      background-size: 6px 1px;
      background-repeat: repeat-x;
    }
    
    .card-countdown {
      display: flex; gap: 12px; margin-top: 12px;
      .cd-box {
        flex: 1; text-align: center; background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #eef2f6; border-radius: 6px; padding: 12px 0;
        .val { font-size: 18px; font-weight: 700; margin-bottom: 2px; small { font-size: 11px; margin-left: 1px; font-weight: 400; } }
        .lab { font-size: 11px; color: #8c8c8c; }
        &.feedback { .val { color: #fa8c16; } }
        &.task { .val { color: #262626; } }
      }
    }

    // Grid for horizontal label-value in research/details blocks
    .data-grid { 
      display: grid; gap: 16px 40px; 
      &.grid-3 { grid-template-columns: repeat(3, 1fr); }
      &.grid-2 { grid-template-columns: repeat(2, 1fr); }
      .item.span-2 { grid-column: span 2; }
      .item.span-3 { grid-column: span 3; }
    }
    
    .item {
      display: flex; align-items: baseline;
      label { width: 90px; font-size: 12px; color: #8c8c8c; flex-shrink: 0; margin-bottom: 0; }
      span { font-size: 13px; color: #262626; font-weight: 600; flex: 1; }
      &.flex-row { display: flex; align-items: center; label { margin-right: 0; } }
      &.align-start { align-items: flex-start; }
      .value-text { font-size: 13px; color: #262626; font-weight: 600; line-height: 1.6; }
      .red-star { color: #f5222d; margin-right: 2px; font-weight: bold; }
    }
    
    .ref-image-box { width: 44px; height: 44px; border-radius: 4px; border: 1px solid #e8e8e8; margin-top: 4px; }
    .detail-sub-title {
      display: flex; align-items: center; gap: 8px; margin-top: 8px;
      .icon { color: #1890ff; font-size: 16px; }
      span { font-size: 13px; font-weight: 700; color: #1e293b; }
    }
    .footer-row-flex { display: flex; justify-content: space-between; align-items: center; .price-col { .label { font-size: 12px; color: #8c8c8c; margin-right: 24px; } .value { font-size: 14px; font-weight: 700; } } }
    .supplementary-box { 
      display: flex; align-items: baseline; background: #fffdf6; border: 1px solid #fef3c7; border-radius: 6px; padding: 14px 18px; 
      .label { font-size: 12px; color: #92400e; margin-right: 24px; flex-shrink: 0; font-weight: 600; } 
      .content { font-size: 13px; color: #78350f; font-weight: 500; line-height: 1.6; } 
    }
  }
}

.custom-tag { 
  background: #e6f7ff; 
  border-color: #91d5ff; 
  color: #1890ff; 
  font-weight: 500; 
  border-radius: 4px;
  padding: 0 8px;
  height: 22px;
  line-height: 20px;
}
.mb-20 { margin-bottom: 20px; }
.mb-12 { margin-bottom: 12px; }
.ml-8 { margin-left: 8px; }
.ml-4 { margin-left: 4px; }

.feedback-list-container {
  margin-top: 16px; border-top: 1px dashed #e2e8f0; padding-top: 16px;
  .list-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
    .title { font-size: 13px; font-weight: 700; color: #475569; }
  }
  .price-info { font-size: 11px; line-height: 1.5; color: #64748b; .amt { color: #f59e0b; font-weight: 600; } }
  .custom-table {
    :deep(.el-table__header) { th { background-color: #f8fafc; color: #475569; font-weight: 700; } }
  }
  .fee-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: flex-start;
  }
  .fee-amt {
    font-weight: 700;
    color: #fa8c16;
    font-size: 12px;
  }
  .fee-type {
    color: #64748b;
    font-size: 11px;
  }
  .refund-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: flex-start;
  }
  .refund-method {
    font-weight: 600;
    color: #10b981;
    font-size: 12px;
  }
  .refund-condition {
    color: #64748b;
    font-size: 11px;
  }
}
.spec-requirements-grid {
  .item {
    label {
      width: 140px !important;
    }
  }
  .highlight-price {
    .value {
      font-size: 16px;
      font-weight: 700;
      color: var(--el-color-primary);
    }
  }
}

.custom-scrollbar { &::-webkit-scrollbar { width: 4px; } &::-webkit-scrollbar-thumb { background: #d9d9d9; border-radius: 2px; } }
</style>
