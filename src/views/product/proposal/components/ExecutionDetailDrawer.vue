<template>
  <el-drawer
    v-model="visible"
    :size="drawerSize"
    destroy-on-close
    class="premium-drawer"
  >
    <template #header>
      <div class="drawer-header-v4">
        <div class="title-main">
          <span class="title-icon"><el-icon><Document /></el-icon></span>
          <span class="title-text">关联单据</span>
        </div>
      </div>
    </template>

    <div class="workspace-container" v-if="feedbackData">
      <!-- 1. 左侧导航面板：概览 & 购样单列表 Master (320px 宽度) -->
      <div class="workspace-sidebar">
        <!-- 业务基础看板 -->
        <div class="sidebar-block context-card">
          <div class="block-header">
            <span class="block-title-text">单据上下文概览</span>
          </div>
          <div class="context-details">
            <div class="ctx-row">
              <span class="ctx-label">反馈编号</span>
              <span class="ctx-value font-mono">{{ feedbackData.code }}</span>
            </div>
            <div class="ctx-row" v-if="feedbackData.source">
              <span class="ctx-label">拿样来源</span>
              <span class="ctx-value">{{ feedbackData.source }}</span>
            </div>
            <div class="ctx-row" v-if="feedbackData.feeAmount">
              <span class="ctx-label">关联预算</span>
              <span class="ctx-value price-highlight">{{ feedbackData.feeAmount }}</span>
            </div>
          </div>
          
          <div class="quick-kpis">
            <div class="kpi-box">
              <span class="kpi-num">{{ purchaseList.length }}</span>
              <span class="kpi-lbl">购样申请</span>
            </div>
            <div class="kpi-box">
              <span class="kpi-num">{{ getTotalRegCount() }}</span>
              <span class="kpi-lbl">样品登记</span>
            </div>
          </div>
        </div>

        <!-- 购样申请单/直接登记 Master 导航列表 -->
        <div class="sidebar-block nav-list-card" v-if="purchaseList.length > 0 || directRegistrations.length > 0">
          <div class="block-header">
            <span class="block-title-text">{{ purchaseList.length > 0 ? '购样申请记录' : '样品登记记录' }}</span>
          </div>
          
          <div class="master-navigation-list">
            <div 
              v-for="item in purchaseList" 
              :key="item.applyNo"
              class="master-nav-item"
              :class="{ active: selectedCategory === 'purchase' && selectedApplyNo === item.applyNo }"
              @click="selectedCategory = 'purchase'; selectedApplyNo = item.applyNo"
            >
              <div class="nav-item-top">
                <span class="nav-item-no">{{ item.applyNo }}</span>
                <span :class="['nav-status-dot', getStatusTagType(item.status)]"></span>
              </div>
              <div class="nav-item-name">{{ item.sampleName }}</div>
              <div class="nav-item-footer">
                <div class="footer-left" style="display: flex; gap: 6px; align-items: center;">
                  <span class="nav-price">{{ item.amount }}</span>
                  <span :class="['nav-status-text', getStatusTagType(item.status)]">{{ item.status }}</span>
                </div>
                <el-tooltip v-if="getPurchaseDuration(item)" placement="top" effect="dark">
                  <template #content>
                    <div style="font-size: 12px; line-height: 1.6;">
                      <strong>时效计算逻辑：</strong><br/>
                      • 已终审：终审时间 - 提交申请时间<br/>
                      • 审批中：当前时间 - 提交申请时间
                    </div>
                  </template>
                  <span class="nav-duration">
                    <el-icon class="mr-2"><Clock /></el-icon>{{ getPurchaseDuration(item) }}
                    <el-icon class="ml-2 info-icon"><QuestionFilled /></el-icon>
                  </span>
                </el-tooltip>
                <span class="nav-reg-count">{{ item.registrations?.length || 0 }} 样品</span>
              </div>
              
              <!-- 审批流转进度微型节点 timeline -->
              <div class="nav-item-approval-nodes" v-if="item.approvalNodes && item.approvalNodes.length > 0">
                <div class="approval-nodes-flow">
                  <template v-for="(node, nIdx) in item.approvalNodes" :key="nIdx">
                    <div class="mini-node" :class="node.status" :title="node.nodeName + (node.operator ? ' (' + node.operator + ')' : '')">
                      <span class="mini-node-dot"></span>
                      <span class="mini-node-text">{{ node.nodeName }}</span>
                    </div>
                    <span class="node-arrow" v-if="nIdx < item.approvalNodes.length - 1">
                      <el-icon><ArrowRight /></el-icon>
                    </span>
                  </template>
                </div>
              </div>
            </div>

            <!-- 样品登记列表平铺渲染多卡片 -->
            <div 
              v-for="item in directRegistrations" 
              :key="item.regNo"
              class="master-nav-item"
              :class="{ active: selectedCategory === 'direct' && selectedDirectRegNo === item.regNo }"
              @click="selectedCategory = 'direct'; selectedDirectRegNo = item.regNo; selectedApplyNo = ''"
            >
              <div class="nav-item-top">
                <span class="nav-item-no">{{ item.regNo }}</span>
                <span :class="['nav-status-dot', getDirectStatusTagType(item.sampleStatus)]" :title="item.sampleStatus"></span>
              </div>
              <div class="nav-item-name-row" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span class="nav-item-name" style="margin: 0; font-weight: 500; color: #595959; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ item.name }}</span>
                <span class="nav-meta-val" style="font-size: 11px; color: #8c8c8c; margin-left: 8px; flex-shrink: 0; font-weight: normal;">渠道: {{ item.source }}</span>
              </div>
              <div class="nav-item-footer">
                <div class="footer-left" style="display: flex; gap: 6px; align-items: center;">
                  <span class="nav-type-text">{{ item.sampleType || '开发样' }}</span>
                  <span :class="['nav-status-text', getDirectStatusTagType(item.sampleStatus)]">{{ item.sampleStatus }}</span>
                </div>
                
                <el-tooltip v-if="getDirectDuration(item)" placement="top" effect="dark">
                  <template #content>
                    <div style="font-size: 12px; line-height: 1.6;">
                      <strong>反馈时效计算逻辑：</strong><br/>
                      • 未反馈时：当前时间 - 样品登记时间<br/>
                      • 已反馈时：反馈时间 - 样品登记时间
                    </div>
                  </template>
                  <span class="nav-duration" @click.stop>
                    <el-icon class="mr-2"><Clock /></el-icon>{{ getDirectDuration(item) }}
                    <el-icon class="ml-2 info-icon"><QuestionFilled /></el-icon>
                  </span>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. 右侧面板：当前选中项的 Detail 详细展示区域 (flex: 1) -->
      <div class="workspace-main">
        <!-- 购样申请详细数据展示 -->
        <template v-if="selectedCategory === 'purchase' && selectedApply">
          <div class="detail-workspace-card">
            <!-- 头部标题栏 -->
            <div class="detail-header-bar">
              <div class="header-left">
                <span class="header-title">购样申请详情：<strong>{{ selectedApply.applyNo }}</strong></span>
                <el-tag :type="getStatusTagType(selectedApply.status)" size="small" effect="light" class="ml-12 custom-status-tag">{{ selectedApply.status }}</el-tag>
              </div>
              <div class="header-right">
                <span class="time-label"><el-icon><Calendar /></el-icon> {{ selectedApply.applyTime }}</span>
                <span class="time-label ml-16" v-if="getPurchaseDuration(selectedApply)">
                  <el-tooltip placement="top" effect="dark">
                    <template #content>
                      <div style="font-size: 12px; line-height: 1.6;">
                        <strong>时效计算逻辑：</strong><br/>
                        • 已终审：终审时间 - 提交申请时间<br/>
                        • 审批中：当前时间 - 提交申请时间
                      </div>
                    </template>
                    <span class="duration-explain-trigger">
                      <el-icon><Clock /></el-icon> 审批时效：{{ getPurchaseDuration(selectedApply) }}
                      <el-icon class="ml-4 info-icon"><QuestionFilled /></el-icon>
                    </span>
                  </el-tooltip>
                </span>
                <!-- 操作按钮：待提交/待更新合同可编辑，待提交可删除 -->
                <div v-if="['待提交', '待更新合同'].includes(selectedApply.status)" style="display: flex; gap: 6px; align-items: center;" class="ml-16">
                  <el-button link type="primary" :icon="Edit" class="header-action-link" @click="handleEditPurchase(selectedApply)">
                    编辑
                  </el-button>
                  <el-button v-if="selectedApply.status === '待提交'" link type="danger" :icon="Delete" class="header-action-link" @click="handleDeletePurchase(selectedApply)">
                    删除
                  </el-button>
                </div>
              </div>
            </div>

            <!-- 模块 1：拿样渠道信息 -->
            <div class="detail-section mb-20 mt-16">
              <div class="section-title mb-12">
                <span class="title-bar blue"></span>
                <span>拿样渠道信息</span>
              </div>
              
              <!-- 渠道为：供应商 -->
              <el-descriptions :column="2" border v-if="selectedApply.channel === '供应商'" class="custom-desc-table">
                <el-descriptions-item label="拿样渠道">
                  <el-tag size="small" type="info" effect="plain">供应商</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="供应商类型">
                  <span>{{ selectedApply.supplierType || '临时供应商' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="供应商名称">
                  <span class="font-semibold text-bold">{{ selectedApply.supplier }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="货源地">
                  <span>{{ selectedApply.source || '广东深圳' }}</span>
                </el-descriptions-item>
              </el-descriptions>

              <!-- 渠道为：1688 / 淘宝 -->
              <el-descriptions :column="2" border v-else class="custom-desc-table">
                <el-descriptions-item label="拿样渠道">
                  <el-tag size="small" type="warning" effect="plain">{{ selectedApply.channel }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="购买链接" :span="2">
                  <el-link 
                    v-if="selectedApply.purchaseUrl" 
                    :href="selectedApply.purchaseUrl" 
                    target="_blank" 
                    type="primary" 
                    :underline="false"
                    class="link-text-ellipsis"
                  >
                    {{ selectedApply.purchaseUrl }}
                  </el-link>
                  <span v-else>-</span>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 模块 2：费用与退款条款 -->
            <div class="detail-section mb-20">
              <div class="section-title mb-12">
                <span class="title-bar orange"></span>
                <span>费用与退款条款</span>
              </div>
              <el-descriptions :column="2" border class="custom-desc-table">
                <el-descriptions-item label="样品名称">
                  <span class="font-semibold text-bold">{{ selectedApply.sampleName }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="购样数量">
                  <span>{{ selectedApply.qty }} 个</span>
                </el-descriptions-item>
                <el-descriptions-item label="购样单价">
                  <span>{{ selectedApply.price }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="费用合计">
                  <span class="price-text font-bold">{{ selectedApply.amount }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="是否可退款" v-if="selectedApply.channel === '供应商'">
                  <el-tag :type="selectedApply.isRefundable ? 'success' : 'info'" size="small">
                    {{ selectedApply.isRefundable ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="收款方式" v-if="selectedApply.channel === '供应商'">
                  <span>{{ selectedApply.paymentMethod || '银行转账' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="退款条款" v-if="selectedApply.channel === '供应商' && selectedApply.isRefundable" :span="2">
                  <div class="refund-policy">
                    <span class="policy-tag">{{ selectedApply.refundMethod || '抵扣首单' }}</span>
                    <span class="policy-cond" v-if="selectedApply.refundCondition">( 条件: {{ selectedApply.refundCondition }} )</span>
                  </div>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 模块 3：收款账户信息 -->
            <div class="detail-section mb-20" v-if="selectedApply.channel === '供应商'">
              <div class="section-title mb-12">
                <span class="title-bar purple"></span>
                <span>收款账户信息</span>
              </div>
              <el-descriptions :column="2" border class="custom-desc-table" v-if="selectedApply.paymentMethod === '银行转账'">
                <el-descriptions-item label="开户行">
                  <span>{{ selectedApply.bankName || '中国工商银行义乌支行' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="账户名称">
                  <span>{{ selectedApply.accountName || '义乌得力商贸有限公司' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="银行账号" :span="2">
                  <span class="font-semibold code-style">{{ selectedApply.bankAccount || '6217 0038 9001 0293 848' }}</span>
                </el-descriptions-item>
              </el-descriptions>
              <el-descriptions :column="2" border class="custom-desc-table" v-else>
                <el-descriptions-item label="收款方式">
                  <span>{{ selectedApply.paymentMethod }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="收款二维码">
                  <div class="attach-images" v-if="selectedApply.paymentQrCode">
                    <el-image 
                      :src="selectedApply.paymentQrCode" 
                      :preview-src-list="[selectedApply.paymentQrCode]" 
                      fit="cover" 
                      class="attach-img-preview"
                      preview-teleported
                    />
                  </div>
                  <span class="no-attach" v-else>暂无收款二维码</span>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 模块 4：单据附件 -->
            <div class="detail-section mb-20">
              <div class="section-title mb-12">
                <span class="title-bar green"></span>
                <span>单据相关附件</span>
              </div>
              <div class="attachments-grid">
                <div class="attach-group">
                  <span class="attach-label">样品图片：</span>
                  <div class="attach-images" v-if="selectedApply.image">
                    <el-image 
                      :src="selectedApply.image" 
                      :preview-src-list="[selectedApply.image]" 
                      fit="cover" 
                      class="attach-img-preview"
                      preview-teleported
                    />
                  </div>
                  <span class="no-attach" v-else>暂无样品图片</span>
                </div>

                <div class="attach-group mt-12" v-if="selectedApply.orderScreenshot">
                  <span class="attach-label">订单截图：</span>
                  <div class="attach-images">
                    <el-image 
                      :src="selectedApply.orderScreenshot" 
                      :preview-src-list="[selectedApply.orderScreenshot]" 
                      fit="cover" 
                      class="attach-img-preview"
                      preview-teleported
                    />
                  </div>
                </div>
              </div>
            </div>



            <!-- 样品登记子表 -->
            <div class="sub-table-wrapper mt-24" v-if="['已通过', '同意'].includes(selectedApply.status)">
              <div class="sub-table-header">
                <span class="sub-table-title">关联样品登记记录 ({{ selectedApply.registrations?.length || 0 }})</span>
                <el-button type="primary" size="small" :icon="Plus" class="action-btn-styled" @click="handleRegisterSampleDirect(selectedApply)">
                  样品登记
                </el-button>
              </div>
              
              <el-table :data="selectedApply.registrations" size="small" class="premium-table-v4" border>
                <el-table-column prop="regNo" label="登记单号" width="120">
                  <template #default="{ row }">
                    <el-link type="primary" class="font-bold font-mono" :underline="false" @click="handleSampleRegistrationDetail(row)">{{ row.regNo }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="75" align="center">
                  <template #default="{ row }">
                    <span :class="['status-badge-pill', getRegStatusClass(row.status)]">{{ row.status || '待提交' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="图片" width="65" align="center">
                  <template #default="{ row }">
                    <el-image v-if="row.image" :src="row.image" :preview-src-list="[row.image]" fit="cover" class="table-img" preview-teleported />
                    <span v-else class="no-img-text">暂无图片</span>
                  </template>
                </el-table-column>
                <el-table-column prop="pattern" label="图案" show-overflow-tooltip />
                <el-table-column prop="color" label="颜色" width="80" />
                <el-table-column prop="spec" label="规格" width="80" />
                <el-table-column prop="sampleSize" label="样品尺寸" width="95" />
                <el-table-column prop="netWeight" label="净重" width="75" />
                <el-table-column label="操作" width="110" align="center" fixed="right">
                  <template #default="{ row }">
                    <div style="display: flex; gap: 8px; justify-content: center; align-items: center;">
                      <el-button v-if="row.status === '待提交' || row.status === '已驳回'" link type="primary" size="small" class="table-edit-btn" @click="handleEditSampleRegistration(row)">
                        <el-icon class="mr-2"><Edit /></el-icon>编辑
                      </el-button>
                      <el-button v-if="row.status === '待提交' || row.status === '已驳回'" link type="danger" size="small" class="table-edit-btn" @click="handleDeleteSampleRegistration(row)">
                        <el-icon class="mr-2"><Delete /></el-icon>删除
                      </el-button>
                      <span v-if="row.status !== '待提交' && row.status !== '已驳回'" class="text-placeholder">-</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </template>

        <!-- 直接登记详细数据展示 -->
        <template v-if="selectedCategory === 'direct' && selectedDirectDetail">
          <div class="detail-workspace-card">
            <!-- 头部标题栏 -->
            <div class="detail-header-bar">
              <div class="header-left">
                <span class="header-title">样品详情：<strong>{{ selectedDirectDetail.regNo }}</strong></span>
                <el-tag :type="getDirectStatusTagType(selectedDirectDetail.status)" size="small" effect="light" class="ml-12 custom-status-tag">{{ selectedDirectDetail.status }}</el-tag>
              </div>
              <div class="header-right">
                <span class="time-label"><el-icon><Calendar /></el-icon> {{ selectedDirectDetail.receiveTime }}</span>
                <span class="time-label ml-16" v-if="getDirectDuration(selectedDirectDetail)">
                  <el-tooltip placement="top" effect="dark">
                    <template #content>
                      <div style="font-size: 12px; line-height: 1.6;">
                        <strong>时效计算逻辑：</strong><br/>
                        • 未反馈时：当前时间 - 样品登记时间<br/>
                        • 已反馈时：反馈时间 - 样品登记时间
                      </div>
                    </template>
                    <span class="duration-explain-trigger">
                      <el-icon><Clock /></el-icon> 反馈时效：{{ getDirectDuration(selectedDirectDetail) }}
                      <el-icon class="ml-4 info-icon"><QuestionFilled /></el-icon>
                    </span>
                  </el-tooltip>
                </span>
                
                <!-- 操作按钮：待提交/已驳回可编辑、删除 -->
                <template v-if="selectedDirectDetail.status === '待提交' || selectedDirectDetail.status === '已驳回'">
                  <div style="display: flex; gap: 6px; align-items: center;" class="ml-16">
                    <el-button link type="primary" :icon="Edit" class="header-action-link" @click="handleEditSampleRegistration(selectedDirectDetail)">
                      编辑
                    </el-button>
                    <el-button link type="danger" :icon="Delete" class="header-action-link" @click="handleDeleteSampleRegistration(selectedDirectDetail)">
                      删除
                    </el-button>
                  </div>
                </template>
              </div>
            </div>

            <!-- 模块 1：基本属性 -->
            <div class="detail-section mb-20">
              <div class="section-title mb-12">
                <span class="title-bar blue"></span>
                <span>样品基础登记信息</span>
              </div>
              
              <el-descriptions :column="3" border class="custom-desc-table">
                <el-descriptions-item label="样品类型">
                  <span>{{ selectedDirectDetail.sampleType || '开发样' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="拿样渠道">
                  <span>{{ selectedDirectDetail.source || '供应商' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="供应商" :span="2" v-if="selectedDirectDetail.supplierName || selectedDirectDetail.supplier">
                  <span class="font-medium">{{ selectedDirectDetail.supplierName || selectedDirectDetail.supplier || '长期合作-中山光源厂' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="购买链接" :span="2" v-else-if="selectedDirectDetail.purchaseUrl">
                  <el-link :href="selectedDirectDetail.purchaseUrl" target="_blank" type="primary" :underline="false" class="link-text-ellipsis">
                    {{ selectedDirectDetail.purchaseUrl }}
                  </el-link>
                </el-descriptions-item>
                <el-descriptions-item label="样品费">
                  <span class="price-text font-bold">{{ selectedDirectDetail.sampleFee || '¥ 0.00' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="样品名称">
                  <span class="font-medium">{{ selectedDirectDetail.name }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="款式">
                  <span class="font-medium">{{ selectedDirectDetail.style || '经典系列' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="主材料">
                  <span>{{ selectedDirectDetail.material || '亚克力' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="适用品牌/对象">
                  <span>{{ selectedDirectDetail.applicableTo || '通用' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="包装方式">
                  <span>{{ selectedDirectDetail.packagingMethod || '盒装' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="包装数量">
                  <span>{{ selectedDirectDetail.packagingQuantity || '1pack' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="样品特征">
                  <div style="display: flex; gap: 12px;">
                    <el-tag size="small" :type="selectedDirectDetail.hasBattery ? 'danger' : 'info'" effect="light">
                      {{ selectedDirectDetail.hasBattery ? '带电' : '不带电' }}
                    </el-tag>
                    <el-tag size="small" :type="selectedDirectDetail.isCE ? 'success' : 'info'" effect="light">
                      {{ selectedDirectDetail.isCE ? 'CE认证' : '无CE' }}
                    </el-tag>
                  </div>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 模块 2：物理规格与特征 -->
            <div class="detail-section mb-20">
              <div class="section-title mb-12">
                <span class="title-bar orange"></span>
                <span>详细规格物理参数</span>
              </div>
              
              <el-descriptions :column="3" border class="custom-desc-table">
                <el-descriptions-item label="规格">
                  <span>{{ selectedDirectDetail.spec || '通用' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="颜色">
                  <span class="font-medium">{{ selectedDirectDetail.color || '-' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="图案">
                  <span>{{ selectedDirectDetail.pattern || '-' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="样品尺寸" :span="2">
                  <span class="font-medium">{{ selectedDirectDetail.sampleSize || '-' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="净重">
                  <span>{{ selectedDirectDetail.netWeight || '-' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="包装尺寸" :span="2">
                  <span>{{ selectedDirectDetail.packagingSize || '-' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="尺码">
                  <span>{{ selectedDirectDetail.size || '-' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="直径">
                  <span>{{ selectedDirectDetail.diameter || '-' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="容量">
                  <span>{{ selectedDirectDetail.capacity || '-' }}</span>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 模块 3：商业与合作信息 -->
            <div class="detail-section mb-20">
              <div class="section-title mb-12">
                <span class="title-bar purple"></span>
                <span>商业及合作信息</span>
              </div>
              <el-descriptions :column="4" border class="custom-desc-table">
                <el-descriptions-item label="初次报价">
                  <span class="price-text font-bold">{{ selectedDirectDetail.initialQuote !== undefined && selectedDirectDetail.initialQuote !== null ? '¥ ' + selectedDirectDetail.initialQuote : '-' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="税率">
                  <span>{{ selectedDirectDetail.taxRate !== undefined && selectedDirectDetail.taxRate !== null ? selectedDirectDetail.taxRate + ' %' : '-' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="起订量">
                  <span>{{ selectedDirectDetail.moq !== undefined && selectedDirectDetail.moq !== null ? selectedDirectDetail.moq + ' 个' : '-' }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="生产周期">
                  <span>{{ selectedDirectDetail.productionCycle !== undefined && selectedDirectDetail.productionCycle !== null ? selectedDirectDetail.productionCycle + ' 天' : '-' }}</span>
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 模块 4：附件与说明 -->
            <div class="detail-section mb-10">
              <div class="section-title mb-12">
                <span class="title-bar green"></span>
                <span>附件及样品说明</span>
              </div>
              <div class="attachments-grid">
                <div class="attach-group">
                  <span class="attach-label">样品图片：</span>
                  <div class="attach-images" v-if="selectedDirectDetail.image">
                    <el-image 
                      :src="selectedDirectDetail.image" 
                      :preview-src-list="[selectedDirectDetail.image]" 
                      fit="cover" 
                      class="attach-img-preview"
                      preview-teleported
                    />
                  </div>
                  <span class="no-attach" v-else>暂无样品图片</span>
                </div>

                <div class="attach-group mt-12" v-if="selectedDirectDetail.qualifications && selectedDirectDetail.qualifications.length > 0">
                  <span class="attach-label">产品资质：</span>
                  <div class="qual-links">
                    <div v-for="(file, i) in selectedDirectDetail.qualifications" :key="i" class="qual-link-item">
                      <el-link type="primary" :underline="false" :href="file.url" target="_blank">{{ file.name }}</el-link>
                    </div>
                  </div>
                </div>

                <div class="desc-group mt-12" v-if="selectedDirectDetail.description">
                  <span class="attach-label">样品说明：</span>
                  <span class="desc-content">{{ selectedDirectDetail.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 空状态 -->
        <el-empty v-if="!purchaseList.length && !directRegistrations.length" description="暂无关联单据数据" class="custom-empty" />
      </div>
    </div>

    <!-- 组件挂载 -->
    <PurchaseDetailDialog ref="purchaseDetailRef" />
    <PurchaseApplyDialog ref="purchaseApplyRef" @submit="handlePurchaseApplySubmit" />
    <SampleRegistrationDialog ref="sampleRegistrationRef" @refresh="handleSampleRegistrationSubmit" />
    <SampleRegistrationDetailDialog ref="sampleRegistrationDetailRef" />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Check, Clock, ArrowRight, Plus, ShoppingCart, List, Edit, Delete, Link, Calendar, User, ArrowDown, ArrowUp, QuestionFilled } from '@element-plus/icons-vue'

import PurchaseDetailDialog from './PurchaseDetailDialog.vue'
import PurchaseApplyDialog from './PurchaseApplyDialog.vue'
import SampleRegistrationDialog from './SampleRegistrationDialog.vue'
import SampleRegistrationDetailDialog from './SampleRegistrationDetailDialog.vue'

const purchaseDetailRef = ref<any>(null)
const purchaseApplyRef = ref<any>(null)
const sampleRegistrationRef = ref<any>(null)
const sampleRegistrationDetailRef = ref<any>(null)

const editingRegNo = ref('')

const handleEditPurchase = (row: any) => purchaseApplyRef.value?.open(row)
const handleDeletePurchase = (row: any) => {
  ElMessageBox.confirm('确定要删除该购样申请吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const idx = purchaseList.value.findIndex(p => p.applyNo === row.applyNo)
    if (idx !== -1) {
      purchaseList.value.splice(idx, 1)
      ElMessage.success('删除成功')
      if (purchaseList.value.length > 0) {
        selectedApplyNo.value = purchaseList.value[0].applyNo
      } else {
        selectedApplyNo.value = ''
        if (directRegistrations.value.length > 0) {
          selectedCategory.value = 'direct'
          selectedDirectRegNo.value = directRegistrations.value[0].regNo
        }
      }
    }
  }).catch(() => {})
}
const handleSampleRegistrationDetail = (row: any) => sampleRegistrationDetailRef.value?.open({ ...row, proposalNo: feedbackData.value?.code })
const handleEditSampleRegistration = (row: any) => {
  editingRegNo.value = row.regNo
  sampleRegistrationRef.value?.open(row)
}

const handleSampleRegistrationSubmit = (formData: any) => {
  if (selectedCategory.value === 'direct') {
    const reg = directRegistrations.value.find(r => r.regNo === selectedDirectRegNo.value)
    if (reg) {
      reg.name = formData.name
      reg.source = formData.source === '1' ? formData.supplierName : (formData.source === '2' ? '1688' : '淘宝')
      reg.sampleType = formData.sampleType === '1' ? '开发样' : '大货样'
      reg.sampleFee = '¥ ' + (formData.sampleFee || 0).toFixed(2)
      reg.initialQuote = formData.initialQuote
      reg.taxRate = formData.taxRate
      reg.moq = formData.moq
      reg.productionCycle = formData.productionCycle
      reg.description = formData.description
      reg.hasBattery = formData.hasBattery
      reg.isCE = formData.isCE
      if (formData.details && formData.details[0]) {
        reg.pattern = formData.details[0].pattern
        reg.color = formData.details[0].color
        reg.spec = formData.details[0].spec
        reg.sampleSize = `${formData.details[0].length || 0}×${formData.details[0].width || 0}×${formData.details[0].height || 0} ${formData.details[0].sampleSizeUnit}`
        reg.netWeight = `${formData.details[0].netWeight || 0}${formData.details[0].netWeightUnit}`
      }
      ElMessage.success('保存成功')
    }
  } else {
    const purchase = purchaseList.value.find(p => p.applyNo === selectedApplyNo.value)
    if (purchase && purchase.registrations) {
      const reg = purchase.registrations.find((r: any) => r.regNo === editingRegNo.value)
      if (reg) {
        reg.name = formData.name
        reg.status = reg.status || '待提交'
        if (formData.details && formData.details[0]) {
          reg.pattern = formData.details[0].pattern
          reg.color = formData.details[0].color
          reg.spec = formData.details[0].spec
          reg.sampleSize = `${formData.details[0].length || 0}×${formData.details[0].width || 0}×${formData.details[0].height || 0} ${formData.details[0].sampleSizeUnit}`
          reg.netWeight = `${formData.details[0].netWeight || 0}${formData.details[0].netWeightUnit}`
        }
        ElMessage.success('保存成功')
      }
    }
  }
}

const handleDeleteSampleRegistration = (row: any) => {
  ElMessageBox.confirm('确定要删除该样品登记记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (selectedCategory.value === 'direct') {
      const idx = directRegistrations.value.findIndex(d => d.regNo === row.regNo)
      if (idx !== -1) {
        directRegistrations.value.splice(idx, 1)
        ElMessage.success('删除成功')
        if (selectedDirectRegNo.value === row.regNo) {
          selectedDirectRegNo.value = directRegistrations.value[0]?.regNo || ''
        }
      }
    } else {
      const purchase = purchaseList.value.find(p => p.applyNo === selectedApplyNo.value)
      if (purchase && purchase.registrations) {
        const idx = purchase.registrations.findIndex((r: any) => r.regNo === row.regNo)
        if (idx !== -1) {
          purchase.registrations.splice(idx, 1)
          ElMessage.success('删除成功')
        }
      }
    }
  }).catch(() => {})
}

const getRegStatusClass = (status: string) => {
  switch (status) {
    case '有效': return 'success'
    case '待反馈': return 'warning'
    case '待提交': return 'info'
    case '无效': return 'danger'
    case '已驳回': return 'danger'
    default: return 'info'
  }
}

const getPurchaseDuration = (item: any) => {
  if (!item) return ''
  if (!item.applyTime) return ''
  
  const startTime = new Date(item.applyTime).getTime()
  if (isNaN(startTime)) return item.duration || ''
  
  let endTime = Date.now()
  
  if (['已通过', '同意', '待更新合同'].includes(item.status) && item.approvalNodes && item.approvalNodes.length > 0) {
    const completedNodes = item.approvalNodes.filter((n: any) => n.status === 'completed' && n.time)
    if (completedNodes.length > 0) {
      const lastNode = completedNodes[completedNodes.length - 1]
      const lastTime = new Date(lastNode.time).getTime()
      if (!isNaN(lastTime)) {
        endTime = lastTime
      }
    }
  }
  
  const diffMs = endTime - startTime
  if (diffMs <= 0) return '1分钟'
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟`
  }
  
  const diffHours = Math.floor(diffMinutes / 60)
  const remMinutes = diffMinutes % 60
  
  if (remMinutes === 0) {
    return `${diffHours}小时`
  }
  const decimalHours = (diffHours + remMinutes / 60).toFixed(1)
  if (decimalHours.endsWith('.0')) {
    return `${diffHours}小时`
  }
  return `${decimalHours}小时`
}

const handleRegisterSampleDirect = (row: any) => {
  sampleRegistrationRef.value?.open({
    isPurchaseSync: true,
    proposalNo: feedbackData.value?.code,
    productName: row.sampleName,
    supplierName: row.supplier,
    purchaseUrl: row.purchaseUrl,
    sampleFee: parseFloat((row.price || '0').replace(/[^\d.]/g, '')) || 0
  })
}

const handlePurchaseApplySubmit = (items: any[]) => {
  if (!items) return
  items.forEach(item => {
    const idx = purchaseList.value.findIndex(p => p.applyNo === item.applyNo)
    if (idx !== -1) {
      purchaseList.value[idx] = { ...purchaseList.value[idx], ...item }
    } else {
      const newApplyNo = 'PO-NEW-' + Date.now()
      purchaseList.value.push({ ...item, applyNo: newApplyNo, registrations: [], approvalNodes: [] })
      selectedCategory.value = 'purchase'
      selectedApplyNo.value = newApplyNo
    }
  })
}

const visible = ref(false)
const feedbackData = ref<any>(null)
const purchaseList = ref<any[]>([])
const directRegistrations = ref<any[]>([])

const selectedCategory = ref<'purchase' | 'direct'>('purchase')
const selectedApplyNo = ref<string>('')
const selectedDirectRegNo = ref<string>('')
const selectedApply = computed(() => {
  const row = purchaseList.value.find(p => p.applyNo === selectedApplyNo.value)
  if (!row) return null

  // 补齐查看详情时可能缺失的默认字段数据，以展示完整的多渠道特异信息
  const defaultBank = {
    paymentMethod: '银行转账',
    bankName: '中国工商银行义乌支行',
    accountName: row.supplier || '义乌市得力商贸服务部',
    bankAccount: '6217 0038 9001 0293 848'
  }
  
  const defaultRefund = {
    isRefundable: ['已通过', '同意', '待更新合同'].includes(row.status),
    refundMethod: '抵扣首单货款',
    refundCondition: '首批大货订单满1000件返还'
  }

  return {
    ...defaultBank,
    ...defaultRefund,
    ...row,
    // 如果是 1688 / 淘宝，我们配给它对应的付款截图或店铺名
    shopName: row.channel !== '供应商' ? `${row.channel}优质货源店` : '',
    orderScreenshot: row.channel !== '供应商' ? 'https://picsum.photos/300/200?random=40' : '',
    paymentQrCode: (row.paymentQrCodes && row.paymentQrCodes.length > 0) ? row.paymentQrCodes[0] : (row.paymentQrCode || (['支付宝', '微信'].includes(row.paymentMethod) ? 'https://picsum.photos/200/200?random=50' : ''))
  }
})

const selectedDirectDetail = computed(() => {
  if (directRegistrations.value.length === 0) return null
  
  const reg = directRegistrations.value.find(r => r.regNo === selectedDirectRegNo.value) || directRegistrations.value[0]
  
  const defaultMeta = {
    sampleType: '开发样',
    packagingMethod: '盒装',
    packagingQuantity: '1pack',
    style: '经典系列',
    initialQuote: '85.00',
    taxRate: 13,
    moq: 500,
    productionCycle: 20,
    hasBattery: false,
    isCE: true,
    receiver: '李四',
    receiveDate: '2026-05-24',
    purchaserName: '黄小军',
    pmName: '陈招娣',
    receiveTime: '2026-05-24 10:00',
    feedbackTime: '2026-05-26 14:20',
    qualifications: [
      { name: 'CE符合性证书.pdf', url: '#' },
      { name: '产品质检报告.pdf', url: '#' }
    ],
    description: '样品尺寸及结构完全契合要求，抛光打磨优秀，推荐批量采纳。',
    // Physical properties
    spec: reg.spec || '通用',
    color: reg.color || '磨砂透',
    pattern: reg.pattern || '无图案',
    sampleSize: reg.sampleSize || '25*25*8cm',
    netWeight: reg.netWeight || '0.45kg',
    packagingSize: reg.packagingSize || '26*26*10cm',
    size: reg.size || 'M',
    diameter: reg.diameter || '-',
    capacity: reg.capacity || '-'
  }
  
  const status = reg.sampleStatus || '有效'
  const result = {
    ...defaultMeta,
    ...reg,
    status
  }
  if (!['有效', '无效', '已反馈'].includes(status) || !reg.feedbackTime) {
    delete result.feedbackTime
  }
  return result
})

const getDirectStatusTagType = (status: string) => {
  switch (status) {
    case '合格':
    case '有效': return 'success'
    case '待反馈': return 'warning'
    case '待提交': return 'info'
    case '无效':
    case '已驳回': return 'danger'
    default: return 'info'
  }
}

const getDirectDuration = (item: any) => {
  if (!item) return ''
  const t1Str = item.receiveTime
  if (!t1Str) return ''
  const t1 = new Date(t1Str).getTime()
  if (isNaN(t1)) return ''
  
  let t2: number
  const status = item.sampleStatus || item.status
  if (['有效', '无效', '已反馈'].includes(status)) {
    if (item.feedbackTime) {
      t2 = new Date(item.feedbackTime).getTime()
    } else {
      t2 = t1 + 2 * 24 * 60 * 60 * 1000
    }
  } else {
    t2 = Date.now()
  }
  
  if (isNaN(t2)) return ''
  const diffMs = t2 - t1
  if (diffMs <= 0) return '1分钟'
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟`
  }
  
  const diffHours = Math.floor(diffMinutes / 60)
  const days = Math.floor(diffHours / 24)
  const hours = diffHours % 24
  
  if (days > 0) {
    return `${days}天${hours}小时`
  }
  return `${hours}小时`
}

const drawerSize = computed(() => (purchaseList.value.length === 1 || (purchaseList.value.length === 0 && directRegistrations.value.length > 0)) ? '1200px' : '1250px')

const getTotalRegCount = () => (purchaseList.value.reduce((acc, p) => acc + (p.registrations?.length || 0), 0) + directRegistrations.value.length)

const open = (row: any) => {
  feedbackData.value = row
  if (row.feeAmount === '¥ 0.00') {
    purchaseList.value = []
    directRegistrations.value = [
      {
        regNo: 'DJ-20260603-71',
        name: '亚克力透光隔板',
        source: '供应商',
        sampleType: '开发样',
        sampleStatus: '待提交',
        receiveTime: '2026-06-03 10:00',
        receiver: '李四',
        sampleFee: '¥ 0.00'
      },
      {
        regNo: 'DJ-20260603-72',
        name: 'LED七彩发光线圈',
        source: '供应商',
        sampleType: '开发样',
        sampleStatus: '待反馈',
        receiveTime: '2026-06-02 09:00',
        receiver: '李四',
        sampleFee: '¥ 0.00'
      },
      {
        regNo: 'DJ-20260603-73',
        name: '不锈钢微调固定座',
        source: '供应商',
        sampleType: '开发样',
        sampleStatus: '已驳回',
        receiveTime: '2026-06-01 14:00',
        receiver: '李四',
        sampleFee: '¥ 0.00'
      },
      {
        regNo: 'DJ-20260603-74',
        name: '高亮白光背板',
        source: '淘宝',
        sampleType: '开发样',
        sampleStatus: '有效',
        receiveTime: '2026-05-24 10:00',
        feedbackTime: '2026-05-26 14:20',
        receiver: '李四',
        sampleFee: '¥ 0.00'
      },
      {
        regNo: 'DJ-20260603-75',
        name: '超细铜导线样品',
        source: '1688',
        sampleType: '开发样',
        sampleStatus: '无效',
        receiveTime: '2026-05-25 09:00',
        feedbackTime: '2026-05-25 17:30',
        receiver: '李四',
        sampleFee: '¥ 0.00'
      }
    ]
    selectedCategory.value = 'direct'
    selectedApplyNo.value = ''
    selectedDirectRegNo.value = directRegistrations.value[0]?.regNo || ''
  } else {
    directRegistrations.value = []
    purchaseList.value = [
      {
        applyNo: 'PO-20260520-01',
        sampleName: 'DIY灯光板 - 款式A',
        channel: '供应商',
        supplier: row.source || '线下-深圳供应商',
        qty: 1,
        price: '¥ 50.00',
        amount: row.feeAmount || '¥ 50.00',
        status: '同意',
        applyTime: '2026-05-21 14:00',
        duration: '1.5小时',
        registrations: [
          {
            regNo: 'DJ-20260603-01',
            pattern: '复古雕花',
            color: '曜石黑',
            spec: '500*500mm',
            sampleSize: '50*50*10cm',
            netWeight: '1.2kg',
            status: '待提交',
            image: 'https://picsum.photos/60/60?random=1'
          },
          {
            regNo: 'DJ-20260603-02',
            pattern: '现代简约',
            color: '极光银',
            spec: '400*400mm',
            sampleSize: '40*40*8cm',
            netWeight: '0.9kg',
            status: '待反馈',
            image: 'https://picsum.photos/60/60?random=2'
          },
          {
            regNo: 'DJ-20260603-03',
            pattern: '欧式浮雕',
            color: '象牙白',
            spec: '600*600mm',
            sampleSize: '60*60*12cm',
            netWeight: '1.5kg',
            status: '有效',
            image: 'https://picsum.photos/60/60?random=3'
          },
          {
            regNo: 'DJ-20260603-04',
            pattern: '波西米亚',
            color: '古铜色',
            spec: '300*300mm',
            sampleSize: '30*30*6cm',
            netWeight: '0.7kg',
            status: '无效',
            image: 'https://picsum.photos/60/60?random=4'
          },
          {
            regNo: 'DJ-20260603-05',
            pattern: '几何线条',
            color: '香槟金',
            spec: '450*450mm',
            sampleSize: '45*45*9cm',
            netWeight: '1.1kg',
            status: '已驳回',
            image: 'https://picsum.photos/60/60?random=5'
          }
        ],
        approvalNodes: [
          { nodeName: "提交申请", operator: "张三", time: "2026-05-21 14:00", status: "completed" },
          { nodeName: "部门主管审批", operator: "经理", time: "2026-05-21 15:30", status: "completed" }
        ]
      },
      {
        applyNo: 'PO-20260521-02',
        sampleName: '亚克力防尘保护盒 - 淘宝样',
        channel: '淘宝',
        purchaseUrl: 'https://item.taobao.com/item.htm?id=68291039281',
        qty: 2,
        price: '¥ 15.00',
        amount: '¥ 30.00',
        status: '待审批',
        applyTime: '2026-06-03 14:00',
        duration: '3.5小时',
        registrations: [
          {
            regNo: 'DJ-20260603-06',
            pattern: '透明高透款',
            color: '无色透明',
            spec: '20*20*15cm',
            sampleSize: '20*20*15cm',
            netWeight: '0.3kg',
            status: '有效',
            image: 'https://picsum.photos/60/60?random=10'
          }
        ],
        approvalNodes: [
          { nodeName: "提交申请", operator: "张三", time: "2026-06-03 14:00", status: "completed" },
          { nodeName: "部门主管审批", operator: "经理", status: "processing" }
        ]
      },
      {
        applyNo: 'PO-20260522-03',
        sampleName: 'LED高亮背光板 - 1688样',
        channel: '1688',
        purchaseUrl: 'https://detail.1688.com/offer/6791028391.html',
        qty: 5,
        price: '¥ 8.00',
        amount: '¥ 40.00',
        status: '不同意',
        applyTime: '2026-06-02 10:00',
        duration: '1.5小时',
        registrations: [
          {
            regNo: 'DJ-20260603-07',
            pattern: '暖白光微调',
            color: '银白面板',
            spec: '12V直流输入',
            sampleSize: '15*15*0.5cm',
            netWeight: '0.15kg',
            status: '待提交',
            image: 'https://picsum.photos/60/60?random=11'
          }
        ],
        approvalNodes: [
          { nodeName: "提交申请", operator: "张三", time: "2026-06-02 10:00", status: "completed" },
          { nodeName: "部门主管审批", operator: "经理", time: "2026-06-02 11:30", status: "rejected" }
        ]
      },
      {
        applyNo: 'PO-20260523-04',
        sampleName: '不锈钢微调固定座 - 供应商样',
        channel: '供应商',
        supplier: '长期合作-华强北电子',
        qty: 1,
        price: '¥ 120.00',
        amount: '¥ 120.00',
        status: '待更新合同',
        applyTime: '2026-06-01 09:30',
        duration: '4.5小时',
        registrations: [
          {
            regNo: 'DJ-20260603-08',
            pattern: '螺纹加强型',
            color: '金属拉丝',
            spec: 'M8螺纹规格',
            sampleSize: '10*5*5cm',
            netWeight: '0.25kg',
            status: '待提交',
            image: 'https://picsum.photos/60/60?random=12'
          }
        ],
        approvalNodes: [
          { nodeName: "提交申请", operator: "张三", time: "2026-06-01 09:30", status: "completed" },
          { nodeName: "部门主管审批", operator: "经理", time: "2026-06-01 10:30", status: "completed" },
          { nodeName: "合同初审", operator: "法务", time: "2026-06-01 14:00", status: "completed" }
        ]
      },
      {
        applyNo: 'PO-20260524-05',
        sampleName: '超细铜导线样品 - 1688样',
        channel: '1688',
        purchaseUrl: 'https://detail.1688.com/offer/7930192831.html',
        qty: 10,
        price: '¥ 2.50',
        amount: '¥ 25.00',
        status: '待提交',
        applyTime: '2026-06-03 17:00',
        registrations: [],
        approvalNodes: []
      }
    ]

    selectedCategory.value = 'purchase'
    selectedApplyNo.value = purchaseList.value[0]?.applyNo || ''
  }
  visible.value = true
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
const formatTimeWithoutYear = (ts: string) => ts.split(' ').length === 2 ? ts.split(' ')[0].split('-').slice(1).join('-') + ' ' + ts.split(' ')[1] : ts

defineExpose({ open })
</script>

<style lang="scss" scoped>
/* 高级设计师调色盘 */
$primary: #1890ff;
$success: #52c41a;
$warning: #faad14;
$danger: #ff4d4f;
$text-title: #1f1f1f;
$text-body: #434343;
$text-light: #8c8c8c;
$bg-main: #f4f7f9;

:deep(.el-drawer__body) {
  padding: 0 !important;
  background-color: $bg-main !important;
}

.workspace-container {
  display: flex;
  gap: 10px;
  background-color: $bg-main;
  min-height: calc(100vh - 60px);
  box-sizing: border-box;
}

/* 1. 抽屉头部样式 */
.drawer-header-v4 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 32px;
  
  .title-main {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .title-icon {
      font-size: 20px;
      color: $primary;
      display: flex;
      align-items: center;
    }
    .title-text {
      font-size: 18px;
      font-weight: 700;
      color: $text-title;
    }
    .title-divider {
      font-size: 14px;
      color: $text-light;
    }
    .title-sub {
      font-size: 14px;
      color: $text-light;
      font-weight: 500;
    }
  }
}

/* 左侧面板 sidebar */
.workspace-sidebar {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-block {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  
  .block-header {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 12px;
    margin-bottom: 16px;
    
    .block-title-text {
      font-size: 14px;
      font-weight: 700;
      color: #1f1f1f;
      display: flex;
      align-items: center;
      gap: 6px;
      &::before {
        content: '';
        width: 3px;
        height: 14px;
        background: $primary;
        border-radius: 2px;
      }
    }
  }
}

.context-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .ctx-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    
    .ctx-label {
      color: #8c8c8c;
      font-weight: 500;
    }
    .ctx-value {
      color: #262626;
      font-weight: 600;
      &.font-mono {
        font-family: monospace;
      }
      &.price-highlight {
        color: $danger;
        font-weight: 700;
        font-family: 'DIN Alternate', sans-serif;
      }
    }
  }
}

.quick-kpis {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed #f0f0f0;
  
  .kpi-box {
    flex: 1;
    background: #f8fafc;
    border-radius: 10px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #f0f5ff;
    
    .kpi-num {
      font-size: 22px;
      font-weight: 800;
      color: $primary;
      font-family: 'DIN Alternate', sans-serif;
    }
    
    .kpi-lbl {
      font-size: 11px;
      color: #8c8c8c;
      margin-top: 2px;
      font-weight: 500;
    }
  }
}

/* Master 导航列表样式 */
.master-navigation-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .nav-section-title {
    font-size: 12px;
    font-weight: 700;
    color: #8c8c8c;
    padding: 8px 4px 4px;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .master-nav-item {
    background: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    padding: 12px 14px;
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    flex-direction: column;
    gap: 6px;
    
    &:hover {
      background: #f0f5ff;
      border-color: rgba($primary, 0.3);
      transform: translateY(-1px);
    }
    
    &.active {
      background: #e6f7ff;
      border-color: $primary;
      box-shadow: 0 4px 12px rgba($primary, 0.08);
      
      .nav-item-top .nav-item-no {
        color: $primary;
        font-weight: 700;
      }
    }
    
    .nav-item-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .nav-item-no {
        font-size: 13px;
        font-weight: 600;
        color: #262626;
        font-family: monospace;
      }
      
      .nav-status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;
        
        &.success { background-color: $success; }
        &.warning { background-color: $warning; }
        &.info { background-color: $text-light; }
        &.danger { background-color: $danger; }
        &.primary { background-color: $primary; }
      }
    }
    
    .nav-item-name {
      font-size: 12px;
      color: #595959;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .nav-item-name-main {
      font-size: 13px;
      font-weight: 700;
      color: #1f1f1f;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 220px;
    }
    
    .nav-item-middle {
      font-size: 11px;
      color: #8c8c8c;
      margin-top: 2px;
      
      .nav-meta-val {
        font-weight: 600;
        color: #595959;
      }
    }
    
    .nav-type-text {
      font-size: 11px;
      color: #595959;
      background: #f0f0f0;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 500;
    }
    
    .nav-status-text {
      font-size: 11px;
      font-weight: 700;
      
      &.success { color: $success; }
      &.warning { color: $warning; }
      &.info { color: #8c8c8c; }
      &.danger { color: $danger; }
      &.primary { color: $primary; }
    }
    
    .nav-item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      
      .nav-price {
        color: $danger;
        font-weight: 700;
        font-family: 'DIN Alternate', sans-serif;
      }
      
      .nav-reg-count {
        color: $text-light;
        font-weight: 500;
      }
      
      .nav-duration {
        color: $primary;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 2px;
        cursor: pointer;
        
        .info-icon {
          font-size: 11px;
          color: #bfbfbf;
          transition: color 0.2s;
          &:hover {
            color: $primary;
          }
        }
      }
    }

    /* 侧边栏微型审批节点流 */
    .nav-item-approval-nodes {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px dashed rgba(0, 0, 0, 0.05);
      
      .approval-nodes-flow {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
        
        .mini-node {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: $text-light;
          
          .mini-node-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #bfbfbf;
            display: inline-block;
          }
          
          .mini-node-text {
            max-width: 65px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          &.completed {
            color: $success;
            .mini-node-dot {
              background-color: $success;
              box-shadow: 0 0 0 2px rgba($success, 0.15);
            }
          }
          
          &.processing {
            color: $primary;
            font-weight: 700;
            .mini-node-dot {
              background-color: $primary;
              box-shadow: 0 0 0 2px rgba($primary, 0.15);
            }
          }
        }

        .node-arrow {
          display: inline-flex;
          align-items: center;
          color: #bfbfbf;
          font-size: 9px;
        }
      }
    }
  }
}

/* 右侧面板 main */
.workspace-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.detail-workspace-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  min-height: calc(100vh - 108px);
  box-sizing: border-box;
}

.detail-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 18px;
  border-bottom: 1px dashed #e8e8e8;
  margin-bottom: 20px;
  
  .header-left {
    display: flex;
    align-items: center;
    white-space: nowrap;
    flex-shrink: 0;
    
    .header-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba($primary, 0.08);
      color: $primary;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      margin-right: 12px;
      flex-shrink: 0;
      
      &.direct {
        background: rgba($warning, 0.08);
        color: $warning;
      }
    }
    
    .header-title {
      font-size: 16px;
      color: #1f1f1f;
      white-space: nowrap;
      flex-shrink: 0;
      strong {
        color: #000;
        font-family: monospace;
      }
    }
    
    .custom-status-tag {
      font-weight: 600;
      border-radius: 6px;
      flex-shrink: 0;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    white-space: nowrap;
    flex-shrink: 0;
    gap: 12px;
    
    .time-label {
      font-size: 13px;
      color: #8c8c8c;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    
    .edit-btn {
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    
    .header-action-link {
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      flex-shrink: 0;
      padding: 0 4px;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
}

/* 自定义卡片式数据栅格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  background-color: #fafafa;
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid #f0f0f0;
  
  .grid-col {
    display: flex;
    flex-direction: column;
    gap: 6px;
    
    &.span-1 { grid-column: span 1; }
    &.span-2 { grid-column: span 2; }
    &.span-3 { grid-column: span 3; }
    &.span-4 { grid-column: span 4; }
    &.span-5 { grid-column: span 5; }
    &.span-6 { grid-column: span 6; }
    
    .grid-label {
      font-size: 12px;
      color: #8c8c8c;
      font-weight: 500;
    }
    
    .grid-value {
      font-size: 14px;
      color: #262626;
      font-weight: 600;
      word-break: break-all;
      
      &.text-bold {
        font-weight: 700;
      }
    }
  }
}

.price-highlight-large {
  color: $danger;
  font-weight: 800;
  font-size: 16px;
  font-family: 'DIN Alternate', sans-serif;
}

.channel-badge {
  background-color: #f0f5ff;
  color: $primary;
  border: 1px solid #adc6ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.vendor-text {
  font-weight: 600;
  color: #595959;
}

.purchase-link {
  font-weight: 600;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
}

.flow-link-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: #f0f0f0;
  border: 1px solid #d9d9d9;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba($primary, 0.08);
    border-color: rgba($primary, 0.2);
    color: $primary;
  }
}

/* 子表格区域 */
.sub-table-wrapper {
  background-color: #fafbfd;
  border-radius: 14px;
  border: 1px dashed #d9e6f2;
  padding: 20px;
  
  .sub-table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .sub-table-title {
      font-size: 13px;
      font-weight: 700;
      color: #595959;
      display: flex;
      align-items: center;
      gap: 6px;
      &::before {
        content: '';
        width: 6px;
        height: 6px;
        background: $primary;
        border-radius: 50%;
      }
    }
    
    .action-btn-styled {
      font-weight: 600;
      border-radius: 8px;
    }
  }
}

.premium-table-v4 {
  --el-table-border-color: #eef2f6;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  
  :deep(.el-table__header-wrapper) th {
    background-color: #f0f4f8 !important;
    color: #1f1f1f;
    font-weight: 700;
    height: 40px !important;
    border-bottom: 1px solid #eef2f6 !important;
  }
  
  :deep(.el-table__row) td {
    height: 44px !important;
    background-color: #ffffff;
  }
}

.table-img {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  transition: transform 0.20s ease;
  
  &:hover {
    transform: scale(1.12);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
}

.no-img-text, .text-placeholder {
  color: #bfbfbf;
  font-size: 12px;
}

.status-badge-pill {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  
  &.success {
    background: #f6ffed;
    color: $success;
    border: 1px solid #b7eb8f;
  }
  &.warning {
    background: #fff7e6;
    color: $warning;
    border: 1px solid #ffd591;
  }
  &.info {
    background: #f5f5f5;
    color: #8c8c8c;
    border: 1px solid #d9d9d9;
  }
  &.danger {
    background: #fff1f0;
    color: $danger;
    border: 1px solid #ffa39e;
  }
}

.table-edit-btn {
  font-weight: 600;
  font-size: 12px;
}

/* 直接登记明细条目 */
.direct-detail-item {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 18px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.01);
  
  .direct-item-header {
    display: flex;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px dashed #e8e8e8;
    
    .reg-no {
      font-size: 14px;
      color: #1f1f1f;
      strong {
        color: #000;
        font-family: monospace;
      }
    }
  }
}

.flex-grow { flex-grow: 1; }
.mb-12 { margin-bottom: 12px; }
.mt-12 { margin-top: 12px; }
.mt-16 { margin-top: 16px; }
.mt-24 { margin-top: 24px; }
.ml-12 { margin-left: 12px; }
.ml-16 { margin-left: 16px; }
.mr-4 { margin-right: 4px; }
.mr-2 { margin-right: 2px; }
.text-bold { font-weight: 700; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-mono { font-family: monospace; }

.custom-empty {
  padding: 80px 0;
}

.duration-explain-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  
  .info-icon {
    font-size: 11px;
    color: #bfbfbf;
    transition: color 0.2s;
    &:hover {
      color: $primary;
    }
  }
}

.detail-header-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .bill-no-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    .el-icon { color: #1890ff; }
  }
  
  .meta-info {
    font-size: 12px;
    color: #64748b;
    strong {
      color: #334155;
    }
  }
}

.time-duration-val {
  color: #1890ff;
  font-weight: 700;
}

.qual-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.qual-link-item {
  font-size: 12px;
  
  :deep(.el-link) {
    font-size: 12px;
  }
}

.desc-content {
  font-size: 12px;
  color: #475569;
  line-height: 1.5;
}

.custom-status-tag-v2 {
  font-weight: 600;
  border-radius: 6px;
}
</style>

<style>
.premium-drawer {
  max-width: 100vw !important;
}
.premium-drawer .el-drawer__body {
  background-color: #f4f7f9 !important;
  overflow-x: hidden !important;
}

.premium-timeline-popper {
  padding: 16px !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important;
}

.popover-timeline-container {
  padding: 4px 2px;
  
  .popover-title {
    font-size: 13px;
    font-weight: 700;
    color: #1f1f1f;
    margin-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 6px;
  }
  
  .custom-timeline {
    padding-left: 4px;
  }
  
  .timeline-node-name {
    font-size: 13px;
    font-weight: 600;
    color: #262626;
  }
  
  .timeline-node-operator {
    font-size: 11px;
    color: #8c8c8c;
    margin-left: 4px;
  }
}

/* 购样申请单详情风格一致性样式 */
.detail-section {
  background-color: #ffffff;
  margin-top: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .title-bar {
    width: 3px;
    height: 13px;
    border-radius: 2px;
    
    &.blue { background-color: #1890ff; }
    &.orange { background-color: #fa8c16; }
    &.purple { background-color: #722ed1; }
    &.green { background-color: #52c41a; }
  }
  
  span {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
  }
}

.custom-desc-table {
  margin-top: 8px;
  :deep(.el-descriptions__label) {
    background-color: #f8fafc !important;
    color: #64748b;
    font-weight: 600;
    width: 120px;
    padding: 10px 14px;
  }
  :deep(.el-descriptions__content) {
    color: #334155;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 500;
  }
}

.link-text-ellipsis {
  display: inline-block;
  max-width: 580px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}

.price-text {
  color: #fa8c16;
  font-size: 14px;
}

.code-style {
  font-family: Consolas, Monaco, monospace;
  font-size: 13px;
  color: #0f172a;
}

.refund-policy {
  display: flex;
  align-items: center;
  gap: 6px;
  
  .policy-tag {
    background-color: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
  }
  
  .policy-cond {
    font-size: 12px;
    color: #64748b;
  }
}

.attachments-grid {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px 16px;
  margin-top: 8px;
}

.attach-group, .desc-group {
  display: flex;
  align-items: center;
}

.attach-group {
  align-items: flex-start;
}

.attach-label {
  width: 80px;
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  flex-shrink: 0;
}

.attach-group {
  .attach-img-preview {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    border: 1px solid #cbd5e1;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  .no-attach {
    font-size: 12px;
    color: #94a3b8;
  }
}

.approval-timeline-box {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 18px 20px;
}

.inline-timeline {
  :deep(.el-timeline-item) {
    padding-bottom: 20px;
    &:last-child {
      padding-bottom: 0;
    }
  }
}
</style>
