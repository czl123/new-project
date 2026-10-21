<template>
  <div class="combo-material-container">
    <!-- 1. 顶部数据看板 & 组合类型透视 (共 6 张分类看板) -->
    <div class="stat-overview-row">
      <!-- 1. 全部组合物料 -->
      <div 
        class="stat-card card-all" 
        :class="{ active: filterForm.comboType === '' && filterForm.status === '' }"
        @click="handleFilterAll"
      >
        <div class="stat-card-inner">
          <div class="stat-card-header">
            <span class="type-badge badge-neutral">全部物料</span>
            <div class="stat-icon-box bg-neutral">
              <el-icon><Box /></el-icon>
            </div>
          </div>
          <div class="stat-num-row">
            <span class="stat-num">{{ totalComboCount }}</span>
            <span class="unit">款</span>
          </div>
          <div class="stat-desc-row">
            <span class="stat-desc">全库总览 · 涵盖 4 大业务类型</span>
            <span v-if="filterForm.comboType === '' && filterForm.status === ''" class="active-indicator">已选</span>
          </div>
        </div>
      </div>

      <!-- 2. 审批中 (关键待办 · 保留柔和琥珀强调) -->
      <div 
        class="stat-card card-pending" 
        :class="{ active: filterForm.status === '待审核' }"
        @click="handleFilterPendingAudit"
      >
        <div class="stat-card-inner">
          <div class="stat-card-header">
            <span class="type-badge badge-amber">审批中</span>
            <div class="stat-icon-box bg-amber">
              <el-icon><Stamp /></el-icon>
            </div>
          </div>
          <div class="stat-num-row">
            <span class="stat-num text-amber">{{ pendingAuditCount }}</span>
            <span class="unit">款</span>
          </div>
          <div class="stat-desc-row">
            <span class="stat-desc">待办流转 · 等待责任人审核</span>
            <span v-if="filterForm.status === '待审核'" class="active-indicator">已选</span>
          </div>
        </div>
      </div>

      <!-- 3. 多件打包 (1物*N) -->
      <div 
        class="stat-card card-multi-pack" 
        :class="{ active: filterForm.comboType === '多件打包' }"
        @click="filterForm.comboType = filterForm.comboType === '多件打包' ? '' : '多件打包'"
      >
        <div class="stat-card-inner">
          <div class="stat-card-header">
            <span class="type-badge badge-neutral">多件打包</span>
            <div class="stat-icon-box bg-neutral">
              <el-icon><CopyDocument /></el-icon>
            </div>
          </div>
          <div class="stat-num-row">
            <span class="stat-num">{{ statsByType['多件打包'] || 0 }}</span>
            <span class="unit">款</span>
          </div>
          <div class="stat-desc-row">
            <span class="stat-desc">1物*N · 原箱乘倍出库销售</span>
            <span v-if="filterForm.comboType === '多件打包'" class="active-indicator">已选</span>
          </div>
        </div>
      </div>

      <!-- 4. 一物多包 (A+B+C) -->
      <div 
        class="stat-card card-multi-box" 
        :class="{ active: filterForm.comboType === '一物多包' }"
        @click="filterForm.comboType = filterForm.comboType === '一物多包' ? '' : '一物多包'"
      >
        <div class="stat-card-inner">
          <div class="stat-card-header">
            <span class="type-badge badge-neutral">一物多包</span>
            <div class="stat-icon-box bg-neutral">
              <el-icon><Grid /></el-icon>
            </div>
          </div>
          <div class="stat-num-row">
            <span class="stat-num">{{ statsByType['一物多包'] || 0 }}</span>
            <span class="unit">款</span>
          </div>
          <div class="stat-desc-row">
            <span class="stat-desc">A+B+C · 单品大件拆包齐套</span>
            <span v-if="filterForm.comboType === '一物多包'" class="active-indicator">已选</span>
          </div>
        </div>
      </div>

      <!-- 5. 主附搭配 (主+附) -->
      <div 
        class="stat-card card-main-attach" 
        :class="{ active: filterForm.comboType === '主附搭配' }"
        @click="filterForm.comboType = filterForm.comboType === '主附搭配' ? '' : '主附搭配'"
      >
        <div class="stat-card-inner">
          <div class="stat-card-header">
            <span class="type-badge badge-neutral">主附搭配</span>
            <div class="stat-icon-box bg-neutral">
              <el-icon><Link /></el-icon>
            </div>
          </div>
          <div class="stat-num-row">
            <span class="stat-num">{{ statsByType['主附搭配'] || 0 }}</span>
            <span class="unit">款</span>
          </div>
          <div class="stat-desc-row">
            <span class="stat-desc">主+附 · 专用主体与通用件</span>
            <span v-if="filterForm.comboType === '主附搭配'" class="active-indicator">已选</span>
          </div>
        </div>
      </div>

      <!-- 6. 成套组合 (套系) -->
      <div 
        class="stat-card card-suite" 
        :class="{ active: filterForm.comboType === '成套组合' }"
        @click="filterForm.comboType = filterForm.comboType === '成套组合' ? '' : '成套组合'"
      >
        <div class="stat-card-inner">
          <div class="stat-card-header">
            <span class="type-badge badge-neutral">成套组合</span>
            <div class="stat-icon-box bg-neutral">
              <el-icon><Collection /></el-icon>
            </div>
          </div>
          <div class="stat-num-row">
            <span class="stat-num">{{ statsByType['成套组合'] || 0 }}</span>
            <span class="unit">款</span>
          </div>
          <div class="stat-desc-row">
            <span class="stat-desc">套系搭配 · 独立单品成套组合</span>
            <span v-if="filterForm.comboType === '成套组合'" class="active-indicator">已选</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 查询与检索区 -->
    <div class="query-card">
      <el-form :model="filterForm" inline class="non-check-form search-form" size="small">
        <el-form-item label="组合物料编码">
          <el-input 
            v-model="filterForm.parentCode" 
            placeholder="组合编码/前缀..." 
            clearable 
            style="width: 170px" 
          />
        </el-form-item>


        <el-form-item label="品名/款式/材质">
          <el-input 
            v-model="filterForm.keyword" 
            placeholder="搜索品名、款式、材质或颜色" 
            clearable 
            style="width: 200px" 
          />
        </el-form-item>

        <el-form-item label="组合类型">
          <el-select v-model="filterForm.comboType" placeholder="全部类型" clearable style="width: 140px">
            <el-option label="全部类型" value="" />
            <el-option label="多件打包 (1物*N)" value="多件打包" />
            <el-option label="一物多包 (A+B+C)" value="一物多包" />
            <el-option label="主附搭配 (主+附)" value="主附搭配" />
            <el-option label="成套组合 (套系)" value="成套组合" />
          </el-select>
        </el-form-item>

        <el-form-item label="穿透搜索子物料">
          <el-input 
            v-model="filterForm.childKeyword" 
            placeholder="包含的子物料编码/品名..." 
            clearable 
            style="width: 180px" 
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="业务状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 130px">
            <el-option label="全部状态" value="" />
            <el-option label="待提交" value="待提交" />
            <el-option label="待审核" value="待审核" />
            <el-option label="审核通过" value="审核通过" />
            <el-option label="已驳回" value="已驳回" />
            <el-option label="审核不通过" value="审核不通过" />
          </el-select>
        </el-form-item>

        <el-form-item class="form-actions">
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
          <el-button icon="RefreshRight" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 3. 操作工具栏 -->
    <div class="ak-operate-container">
      <div class="ak-operate-section">
        <el-button type="primary" icon="Plus" size="small" @click="handleOpenCreateDialog">
          新建组合物料
        </el-button>
        <el-button icon="Upload" size="small" @click="handleOpenImportDialog">
          批量导入
        </el-button>
        <el-button 
          icon="Promotion" 
          size="small" 
          :disabled="!selectedRows.length"
          @click="handleBatchSubmit"
        >
          批量提交 {{ selectedRows.length ? `(${selectedRows.length})` : '' }}
        </el-button>
        <el-button 
          icon="Stamp" 
          size="small" 
          :disabled="!selectedRows.length"
          @click="handleOpenBatchAuditModal"
        >
          批量审核 {{ selectedRows.length ? `(${selectedRows.length})` : '' }}
        </el-button>
        <el-button 
          class="danger-btn"
          icon="Delete" 
          size="small" 
          :disabled="!selectedRows.length"
          @click="handleBatchDelete"
        >
          批量删除 {{ selectedRows.length ? `(${selectedRows.length})` : '' }}
        </el-button>
        <el-button icon="Download" size="small" @click="handleExportExcel">
          导出 BOM 清单
        </el-button>
      </div>

      <div class="ak-table-btn">
        <el-button 
          type="primary" 
          plain 
          icon="Guide" 
          size="small" 
          @click="showTypeGuideDrawer = true"
        >
          组合类型标准定义规范
        </el-button>
        <el-tooltip content="刷新数据" placement="top">
          <el-button icon="Refresh" circle size="small" @click="loadData" />
        </el-tooltip>
      </div>
    </div>

    <!-- 4. 主表格：父物料及其 BOM 树形穿透视图 -->
    <div class="table-card">
      <el-table
        ref="mainTableRef"
        v-loading="loading"
        :data="pagedTableData"
        border
        stripe
        row-key="parentCode"
        size="small"
        :row-class-name="getTableRowClassName"
        class="combo-main-table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" align="center" />
        
        <!-- BOM 展开行 -->
        <el-table-column type="expand" width="45">
          <template #default="{ row }">
            <div class="expand-bom-wrapper">
              <el-table :data="row.children" border size="mini" class="inner-bom-table">
                <el-table-column type="index" label="#" width="45" align="center" />
                <el-table-column label="图片" width="65" align="center">
                  <template #default="{ row: child }">
                    <div class="table-img-cell">
                      <el-image 
                        :src="child.image || getChildMaterialImage(child.childCode)" 
                        :preview-src-list="[child.image || getChildMaterialImage(child.childCode)]"
                        preview-teleported
                        fit="cover" 
                        class="bom-thumb-img"
                      >
                        <template #error>
                          <div class="img-fallback">
                            <el-icon><Picture /></el-icon>
                          </div>
                        </template>
                      </el-image>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="子物料编码" prop="childCode" min-width="150">
                  <template #default="{ row: child }">
                    <div class="code-copy-cell">
                      <span class="child-code font-mono">{{ child.childCode }}</span>
                      <el-tooltip content="复制子物料编码" placement="top">
                        <el-icon class="copy-icon" @click="handleCopy(child.childCode, '子物料编码')">
                          <CopyDocument />
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="单套配比" prop="ratio" width="90" align="center">
                  <template #default="{ row: child }">
                    <span class="ratio-pill font-mono">1:{{ child.ratio }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="产品名称" prop="childProductName" min-width="140" show-overflow-tooltip>
                  <template #default="{ row: child }">
                    <span class="font-medium text-slate-800">{{ child.childProductName || child.childName || child.productName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="款式" prop="childStyle" width="110" show-overflow-tooltip>
                  <template #default="{ row: child }">
                    <span>{{ child.childStyle || child.style || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="主材料" prop="childMaterial" min-width="130" show-overflow-tooltip>
                  <template #default="{ row: child }">
                    <span>{{ child.childMaterial || child.material || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="适用品牌或机型" prop="childTarget" width="130" show-overflow-tooltip>
                  <template #default="{ row: child }">
                    <span class="text-xs text-gray-600">{{ child.applicableBrandOrModel || child.childTarget || child.targetBrandOrAudience || child.applicableModel || '通用' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="型号" prop="childModel" width="110" show-overflow-tooltip>
                  <template #default="{ row: child }">
                    <span class="font-mono text-xs">{{ child.childModel || child.model || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="公司品牌" prop="childBrand" width="95" align="center">
                  <template #default="{ row: child }">
                    <span class="text-xs text-slate-700">{{ child.childBrand || child.brand || '中性' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="包装数量" prop="childPackQty" width="95" align="center">
                  <template #default="{ row: child }">
                    <span class="font-mono text-xs text-gray-600">{{ child.childPackQty || child.packQty || '1pack' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="颜色" prop="childColor" width="100" align="center">
                  <template #default="{ row: child }">
                    <span v-if="child.childColor || child.color" class="color-text-cell">
                      <span class="color-dot"></span>
                      <span class="text-xs text-slate-700">{{ child.childColor || child.color }}</span>
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>

        <el-table-column type="index" label="序号" width="55" align="center" />

        <!-- 物料图片 -->
        <el-table-column label="物料图片" width="75" align="center">
          <template #default="{ row }">
            <div class="table-img-cell">
              <el-image 
                :src="getParentMaterialImage(row)" 
                :preview-src-list="[getParentMaterialImage(row)]"
                preview-teleported
                fit="cover" 
                class="combo-thumb-img"
              >
                <template #error>
                  <div class="img-fallback">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="物料编码" prop="parentCode" min-width="190">
          <template #default="{ row }">
            <div class="code-wrapper flex items-center gap-1.5 flex-wrap">
              <div v-if="row.auditStatus === '待审核' || row.status === '待审核'" class="pending-code-cell">
                <el-tooltip content="物料编码由系统在审核通过后自动生成" placement="top">
                  <el-tag size="small" type="warning" effect="plain" class="font-mono">
                    <el-icon class="mr-1"><Clock /></el-icon> 审核通过后生成
                  </el-tag>
                </el-tooltip>
              </div>
              <div v-else class="code-copy-cell">
                <span class="parent-code font-bold font-mono">{{ row.parentCode }}</span>
                <el-tooltip content="点击复制" placement="top">
                  <el-icon class="copy-icon" @click="handleCopy(row.parentCode, '物料编码')">
                    <CopyDocument />
                  </el-icon>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="运营大类" prop="category" width="115" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="text-xs text-slate-700">{{ row.category || '家具/室内家具' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="产品名称" prop="productName" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="product-name font-medium">{{ row.productName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="款式" prop="style" width="100" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.style || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="主材料" prop="material" min-width="110" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.material || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="公司品牌" prop="brand" width="85" align="center">
          <template #default="{ row }">
            <span class="text-xs text-slate-700">{{ row.brand || '中性' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="颜色" prop="color" width="85" align="center">
          <template #default="{ row }">
            <span v-if="row.color" class="color-text-cell">
              <span class="color-dot"></span>
              <span class="text-xs text-slate-700">{{ row.color }}</span>
            </span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>

        <el-table-column label="包装数量" prop="packQty" width="80" align="center">
          <template #default="{ row }">
            <span class="font-mono text-xs text-slate-600">{{ row.packQty || (row.children?.length ? `${row.children.length}pack` : '1pack') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="组合类型" prop="comboType" width="105" align="center">
          <template #default="{ row }">
            <el-tooltip :content="getComboTypeTip(row.comboType)" placement="top">
              <span class="type-badge" :class="getComboTypeBadgeClass(row.comboType)">
                {{ row.comboType }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="BOM子件数" width="90" align="center">
          <template #default="{ row }">
            <span class="font-mono text-xs font-semibold text-slate-700">{{ (row.children || []).length }} 项</span>
          </template>
        </el-table-column>

        <el-table-column label="业务状态" prop="auditStatus" width="100" align="center">
          <template #default="{ row }">
            <el-tag 
              v-if="row.auditStatus === '待审核' || row.status === '待审核'" 
              type="warning" 
              effect="light" 
              size="small"
              class="audit-pulse-tag"
            >
              <el-icon class="mr-1"><Clock /></el-icon> 待审核
            </el-tag>
            <el-tag 
              v-else-if="row.auditStatus === '待提交' || row.auditStatus === '草稿' || row.status === '草稿'" 
              type="info" 
              effect="plain" 
              size="small"
            >
              待提交
            </el-tag>
            <el-tag 
              v-else-if="row.auditStatus === '已驳回'" 
              type="danger" 
              effect="plain" 
              size="small"
            >
              <el-icon class="mr-1"><Close /></el-icon>已驳回
            </el-tag>
            <el-tag 
              v-else-if="row.auditStatus === '审核不通过'" 
              type="danger" 
              effect="dark" 
              size="small"
            >
              审核不通过
            </el-tag>
            <el-tag 
              v-else-if="row.status === '停产'" 
              type="info" 
              size="small"
            >
              已停产
            </el-tag>
            <el-tag 
              v-else 
              type="success" 
              size="small"
            >
              <el-icon class="mr-1"><Check /></el-icon>已生效
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="审核流程" min-width="120" align="center">
          <template #default="{ row }">
            <div class="audit-flow-summary-cell">
              <!-- 待审核状态 -->
              <div v-if="row.auditStatus === '待审核' || row.status === '待审核'" class="flow-sub-tip">
                <span>待</span><b class="text-slate-800 mx-0.5">{{ row.productLineLeader || '夏忠保' }}</b><span>审批</span>
              </div>

              <!-- 待提交状态 -->
              <div v-else-if="row.auditStatus === '待提交' || row.auditStatus === '草稿' || row.status === '草稿'" class="flow-sub-tip text-gray-500">
                <span>创建人：{{ row.operator || '美区运营' }}</span>
              </div>

              <!-- 已驳回状态 -->
              <div v-else-if="row.auditStatus === '已驳回'" class="flow-sub-tip text-rose-600 font-medium">
                <el-tooltip :content="row.auditRemark ? `驳回原因：${row.auditRemark}` : '审核已驳回，可点击编辑修改后重新提交'" placement="top">
                  <span class="cursor-pointer">可编辑重提</span>
                </el-tooltip>
              </div>

              <!-- 审核不通过状态 -->
              <div v-else-if="row.auditStatus === '审核不通过'" class="flow-sub-tip text-gray-400">
                <el-tooltip :content="row.auditRemark ? `不通过原因：${row.auditRemark}` : '单据审核不予通过，已归档不可删除'" placement="top">
                  <span class="cursor-pointer">已归档</span>
                </el-tooltip>
              </div>

              <!-- 审核通过状态 -->
              <div v-else class="flow-sub-tip text-slate-600">
                <span>审批人：{{ row.productLineLeader || '夏忠保' }}</span>
              </div>

              <!-- 快捷查看流程详情入口 -->
              <el-button 
                link 
                type="primary" 
                size="small" 
                class="view-flow-btn mt-0.5" 
                @click="handleViewWorkflow(row)"
              >
                查看流程
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">

            <!-- 待审核时提供专门的审核按钮 (含通过、不通过、驳回) -->
            <el-button 
              v-if="row.auditStatus === '待审核' || row.status === '待审核'"
              type="warning" 
              link 
              size="small" 
              icon="Stamp" 
              @click="handleOpenAuditModal(row)"
            >
              审核
            </el-button>

            <!-- 待提交或已驳回时提供快捷提交按钮 -->
            <el-button 
              v-if="row.auditStatus === '待提交' || row.auditStatus === '草稿' || row.auditStatus === '已驳回'"
              type="success" 
              link 
              size="small" 
              icon="Promotion" 
              @click="handleSingleSubmit(row)"
            >
              提交
            </el-button>

            <!-- 编辑按钮：待提交和驳回允许编辑，其余状态禁用 -->
            <el-tooltip 
              v-if="!canEditRow(row)" 
              :content="getEditDisabledTip(row)" 
              placement="top"
            >
              <span>
                <el-button 
                  type="primary" 
                  link 
                  size="small" 
                  icon="Edit" 
                  disabled
                >
                  编辑
                </el-button>
              </span>
            </el-tooltip>
            <el-button 
              v-else
              type="primary" 
              link 
              size="small" 
              icon="Edit" 
              @click="handleEdit(row)"
            >
              编辑
            </el-button>

            <el-button 
              type="primary" 
              link 
              size="small" 
              icon="DocumentCopy" 
              @click="handleClone(row)"
            >
              复制
            </el-button>

            <!-- 删除按钮：待审核不可删除，只有待提交可以删除 -->
            <el-tooltip 
              v-if="isRowNonDeletable(row)" 
              :content="getDeleteDisabledTooltip(row)" 
              placement="top"
            >
              <span>
                <el-button 
                  type="danger" 
                  link 
                  size="small" 
                  icon="Delete" 
                  disabled
                >
                  删除
                </el-button>
              </span>
            </el-tooltip>
            <el-button 
              v-else
              type="danger" 
              link 
              size="small" 
              icon="Delete" 
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页栏 -->
      <div class="pagination-footer">
        <span class="page-summary">
          共检索到 <b>{{ filteredTableData.length }}</b> 款组合物料
        </span>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredTableData.length"
          size="small"
        />
      </div>
    </div>

    <!-- 5. 【新建组合物料：纯粹的智能向导流与数字孪生工作台】 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEditMode ? '编辑组合物料' : '新建组合物料 (智能向导流)'"
      width="1320px"
      top="2.5vh"
      destroy-on-close
      class="wizard-modal-dialog"
    >
      <!-- 弹窗顶栏：向导步骤条 (已去除经典平铺切换) -->
      <!-- 驳回修改提示条 -->
      <div v-if="formData.auditStatus === '已驳回'" class="reject-reason-banner mb-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
        <div class="flex items-center text-red-700 text-sm">
          <el-icon class="mr-2 text-base"><Warning /></el-icon>
          <span><b>单据已被驳回修改：</b>{{ formData.auditRemark || '请核实BOM配比及品名后重新提交' }}</span>
        </div>
        <el-tag size="small" type="danger" effect="dark">请修改后重新提交审核</el-tag>
      </div>


      <div class="wizard-header-nav">
        <div class="steps-wrapper">
          <div 
            class="wizard-step-node" 
            :class="{ active: currentStep === 1, done: currentStep > 1 }"
            @click="switchWizardStep(1)"
          >
            <div class="step-num">{{ currentStep > 1 ? '✓' : '1' }}</div>
            <div class="step-meta">
              <span class="step-title">组合模式与 BOM 定义</span>
              <span class="step-sub">定模式 · 选子件 · 设配比</span>
            </div>
          </div>
          <div class="step-line" :class="{ done: currentStep > 1 }"></div>

          <div 
            class="wizard-step-node" 
            :class="{ active: currentStep === 2, done: currentStep > 2 }"
            @click="switchWizardStep(2)"
          >
            <div class="step-num">{{ currentStep > 2 ? '✓' : '2' }}</div>
            <div class="step-meta">
              <span class="step-title">物料属性与基础资料</span>
              <span class="step-sub">品名 · 材质 · 规格参数</span>
            </div>
          </div>
          <div class="step-line" :class="{ done: currentStep > 2 }"></div>

          <div 
            class="wizard-step-node" 
            :class="{ active: currentStep === 3, done: currentStep === 3 }"
            @click="switchWizardStep(3)"
          >
            <div class="step-num">3</div>
            <div class="step-meta">
              <span class="step-title">采购合规与装箱信息</span>
              <span class="step-sub">开票 · 包装 · 外箱规格</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 智能向导模式双栏布局 (70% 工作区 + 30% 实时组合数字卡片) -->
      <div class="wizard-workspace-layout">
        <!-- 左侧向导交互区 (70%) -->
        <div class="wizard-left-pane">
          <!-- 步骤 1：组合模式与 BOM 定义 (Core BOM First) -->
          <div v-show="currentStep === 1" class="step-content-box">
            <div class="pane-headline">
              <span class="badge-step-dot">Step 1</span>
              <span class="title">选择组合业务模式并绑定 BOM 子部件</span>
              <span class="desc">系统将基于您选择的模式和子部件，自动计算并填充后续所有物料属性</span>
            </div>


            <!-- 1.1 四大组合模式大卡片选择器 -->
            <div class="combo-mode-cards-grid">
              <div 
                v-for="item in comboModeCards" 
                :key="item.type"
                class="mode-choice-card"
                :class="{ active: formData.comboType === item.type }"
                @click="onSelectComboType(item.type)"
              >
                <div class="card-top">
                  <span class="mode-tag" :class="item.tagClass">{{ item.type }}</span>
                  <el-icon class="mode-icon"><component :is="item.icon" /></el-icon>
                </div>
                <div class="mode-name">{{ item.name }}</div>
              </div>
            </div>

            <!-- 组合模式防错提示 -->
            <el-alert
              v-if="formData.comboType"
              :title="`【${formData.comboType}】作业规范：${getComboTypeRuleDesc(formData.comboType)}`"
              type="info"
              show-icon
              :closable="false"
              class="mt-3 mb-3 rule-alert"
            />
            <el-alert
              v-else
              title="提示：请先选择上方的组合业务模式（多件打包、一物多包、主附搭配或成套组合），以明确该组合物料的 BOM 结构与作业规则"
              type="warning"
              show-icon
              :closable="false"
              class="mt-3 mb-3 rule-alert"
            />

            <!-- 1.2 BOM 子部件列表 (已去除从标准库选用按钮) -->
            <div class="sub-form-card">
              <div class="flex-between mb-2">
                <div class="card-bar-title">
                  <span>关联子物料 BOM 清单 (当前已配置 {{ formData.children.length }} 项)</span>
                  <span class="sub-hint">输入编码/品名即可模糊联想，自动回填子件规格与重量</span>
                </div>
                <el-button type="primary" size="small" icon="Plus" @click="handleAddChildRow">
                  添加子部件
                </el-button>
              </div>

              <div class="wizard-bom-table-wrap">
                <el-table :data="formData.children" border size="small" class="wizard-bom-table" style="width: 100%">
                  <el-table-column type="index" label="#" width="42" align="center" />
                  <el-table-column label="图片" width="58" align="center">
                    <template #default="{ row }">
                      <div class="table-img-cell">
                        <el-image 
                          :src="row.image || getChildMaterialImage(row.childCode)" 
                          :preview-src-list="[row.image || getChildMaterialImage(row.childCode)]"
                          preview-teleported
                          fit="cover" 
                          class="bom-thumb-img"
                        >
                          <template #error>
                            <div class="img-fallback">
                              <el-icon><Picture /></el-icon>
                            </div>
                          </template>
                        </el-image>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="物料编码" min-width="155">
                    <template #default="{ row }">
                      <el-autocomplete
                        v-model="row.childCode"
                        :fetch-suggestions="querySearchChildMaterial"
                        placeholder="检索物料编码/品名..."
                        size="small"
                        clearable
                        class="code-autocomplete-input"
                        style="width: 100%"
                        @select="(item: any) => onSelectChildMaterial(row, item)"
                        @change="onChildCodeChange(row)"
                        @clear="onChildCodeClear(row)"
                      >
                        <template #prefix>
                          <el-icon class="text-gray-400"><Search /></el-icon>
                        </template>
                      </el-autocomplete>
                    </template>
                  </el-table-column>
                  <el-table-column label="单套配比" width="82" align="center">
                    <template #default="{ row }">
                      <el-input-number 
                        v-model="row.ratio" 
                        :min="1" 
                        :max="999" 
                        size="small" 
                        controls-position="right"
                        style="width: 68px" 
                        @change="triggerAutoDerive"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="产品名称" prop="childProductName" min-width="110" show-overflow-tooltip>
                    <template #default="{ row }">
                      <span class="font-medium text-slate-800">{{ row.childProductName || row.childName || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="款式" prop="childStyle" width="90" align="center" show-overflow-tooltip>
                    <template #default="{ row }">
                      <span class="font-mono text-slate-700">{{ row.childStyle || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="主材料" prop="childMaterial" min-width="110" show-overflow-tooltip>
                    <template #default="{ row }">
                      <span class="text-slate-700">{{ row.childMaterial || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="适用品牌或对象" prop="childTarget" width="120" align="center" show-overflow-tooltip>
                    <template #default="{ row }">
                      <span class="text-xs text-gray-600">{{ row.childTarget || '通用' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="型号" prop="childModel" width="90" align="center" show-overflow-tooltip>
                    <template #default="{ row }">
                      <span class="font-mono text-xs text-slate-600">{{ row.childModel || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="公司品牌" prop="childBrand" width="85" align="center">
                    <template #default="{ row }">
                      <el-tag size="small" effect="plain" type="info">{{ row.childBrand || '中性' }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="颜色" prop="childColor" width="85" align="center">
                    <template #default="{ row }">
                      <el-tag v-if="row.childColor" size="small" effect="plain" type="success">
                        {{ row.childColor }}
                      </el-tag>
                      <span v-else class="text-gray-400">-</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="包装数量" prop="childPackQty" width="80" align="center">
                    <template #default="{ row }">
                      <span class="font-mono text-gray-600 text-xs">{{ row.childPackQty || '1pack' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="55" align="center">
                    <template #default="{ $index }">
                      <el-tooltip content="移除该子件" placement="top">
                        <el-button 
                          type="danger" 
                          icon="Delete" 
                          link 
                          size="small" 
                          class="del-btn"
                          @click="handleRemoveChildRow($index)" 
                        />
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>

          <!-- 步骤 2：物料属性与基础资料 -->
          <div v-show="currentStep === 2" class="step-content-box">
            <div class="pane-headline">
              <span class="badge-step-dot">Step 2</span>
              <span class="title">物料属性与基础资料</span>
              <span class="desc">核验并完善组合物料的品名、材质、同款属性及规格参数</span>
            </div>


            <!-- 同款属性 -->
            <div class="sub-form-card mb-3">
              <div class="flex-between mb-2">
                <div class="card-bar-title">同款属性</div>
                <el-button link type="primary" size="small" @click="handleOpenQuoteDialog">
                  引用同款物料
                </el-button>
              </div>

              <div class="form-grid-4">
                <div class="form-item-cell">
                  <span class="label required">销售平台：</span>
                  <el-select v-model="formData.salesPlatform" size="small" style="width: 100%" @change="onPlatformOrCategoryChange">
                    <el-option v-for="p in SALES_PLATFORMS" :key="p" :label="p" :value="p" />
                  </el-select>
                </div>
                <div class="form-item-cell">
                  <span class="label required">运营大类：</span>
                  <el-select v-model="formData.category" size="small" style="width: 100%" @change="onPlatformOrCategoryChange">
                    <el-option label="软包床" value="软包床" />
                    <el-option label="厨房电器" value="厨房电器" />
                    <el-option label="户外用品" value="户外用品" />
                    <el-option label="竹木家具" value="竹木家具" />
                    <el-option label="家具/室内家具" value="家具/室内家具" />
                    <el-option label="家居/收纳置物" value="家居/收纳置物" />
                    <el-option label="卫浴/浴室柜" value="卫浴/浴室柜" />
                    <el-option label="户外/庭院家具" value="户外/庭院家具" />
                  </el-select>
                </div>
                <div class="form-item-cell">
                  <span class="label required">产品名称：</span>
                  <el-input v-model="formData.productName" size="small" />
                </div>
                <div class="form-item-cell">
                  <span class="label required">款式：</span>
                  <el-input v-model="formData.style" size="small" />
                </div>
              </div>

              <div class="form-grid-4 mt-2">
                <div class="form-item-cell">
                  <span class="label required">主材料：</span>
                  <el-input v-model="formData.material" size="small" />
                </div>
                <div class="form-item-cell">
                  <span class="label">适用品牌或对象：</span>
                  <el-input v-model="formData.targetBrandOrAudience" size="small" />
                </div>
                <div class="form-item-cell">
                  <span class="label">型号：</span>
                  <el-input v-model="formData.model" size="small" />
                </div>
                <div class="form-item-cell"></div>
              </div>

            </div>

            <!-- 关键属性 -->
            <div class="sub-form-card mb-3">
              <div class="card-bar-title mb-2">关键属性</div>
              <div class="form-grid-4">
                <div class="form-item-cell">
                  <span class="label required">公司品牌：</span>
                  <el-select v-model="formData.brand" size="small" style="width: 100%">
                    <el-option label="中性" value="中性" />
                    <el-option label="Aura" value="Aura" />
                    <el-option label="Homary" value="Homary" />
                    <el-option label="JC-ERP" value="JC-ERP" />
                  </el-select>
                </div>
                <div class="form-item-cell">
                  <span class="label">图案：</span>
                  <el-input v-model="formData.pattern" size="small" />
                </div>
                <div class="form-item-cell">
                  <span class="label required">颜色：</span>
                  <el-input v-model="formData.color" size="small" />
                </div>
                <div class="form-item-cell">
                  <span class="label">尺码：</span>
                  <el-input v-model="formData.size" size="small" />
                </div>
              </div>

              <div class="form-grid-4 mt-2">
                <div class="form-item-cell">
                  <span class="label required">包装数量：</span>
                  <el-input v-model="formData.packQty" size="small" />
                </div>
                <div class="form-item-cell"></div>
                <div class="form-item-cell"></div>
                <div class="form-item-cell"></div>
              </div>
            </div>

            <!-- 一般属性与负责人 -->
            <div class="sub-form-card">
              <div class="card-bar-title mb-3">一般属性与负责人</div>

              <!-- 业务岗位协同负责人面板 -->
              <div class="personnel-team-card mb-3">
                <div class="personnel-title-bar">
                  <span class="p-title">
                    <el-icon class="mr-1 text-primary"><UserFilled /></el-icon>
                    业务岗位协同负责人
                  </span>
                  <span class="p-sub">产品线生命周期各环节协同对接人</span>
                </div>
                <div class="personnel-inputs-row">
                  <div class="form-item-cell">
                    <span class="label required">产品经理：</span>
                    <el-select v-model="formData.productManager" placeholder="请选择产品经理" size="small" clearable style="width: 100%">
                      <el-option label="张经理 (产品经理)" value="张经理 (产品经理)" />
                      <el-option label="李经理 (定品经理)" value="李经理 (定品经理)" />
                      <el-option label="王经理 (研发产品)" value="王经理 (研发产品)" />
                    </el-select>
                  </div>
                  <div class="form-item-cell">
                    <span class="label required">采购人员：</span>
                    <el-select v-model="formData.purchaser" placeholder="请选择采购人员" size="small" clearable style="width: 100%">
                      <el-option label="采购A组-陈工" value="采购A组-陈工" />
                      <el-option label="采购B组-赵工" value="采购B组-赵工" />
                    </el-select>
                  </div>
                  <div class="form-item-cell">
                    <span class="label required">运营人员：</span>
                    <el-select v-model="formData.operator" placeholder="请选择运营人员" size="small" clearable style="width: 100%">
                      <el-option label="美区运营-Lucy" value="美区运营-Lucy" />
                      <el-option label="欧区运营-David" value="欧区运营-David" />
                      <el-option label="沃尔玛运营-Sarah" value="沃尔玛运营-Sarah" />
                      <el-option label="TikTok运营-Alex" value="TikTok运营-Alex" />
                    </el-select>
                  </div>
                </div>
              </div>

              <!-- 一般属性与标签规范 (非必填) -->
              <div class="general-attrs-section">
                <div class="general-attrs-title-bar mb-2.5">
                  <span class="g-title">
                    <el-icon class="mr-1 text-primary"><CollectionTag /></el-icon>
                    一般属性与标签规范
                  </span>
                  <span class="g-sub">包含合规、规格特征、色号及标签信息（均为非必填项）</span>
                </div>

                <!-- 第 1 排：节日标签、季节标签、是否CE类、是否带电 -->
                <div class="form-grid-4 mb-2.5">
                  <div class="form-item-cell">
                    <span class="label">节日标签：</span>
                    <el-select 
                      v-model="formData.holidayTag" 
                      placeholder="请选择或输入节日" 
                      size="small" 
                      filterable 
                      allow-create 
                      default-first-option 
                      clearable 
                      style="width: 100%"
                    >
                      <el-option label="无" value="无" />
                      <el-option label="圣诞节" value="圣诞节" />
                      <el-option label="万圣节" value="万圣节" />
                      <el-option label="复活节" value="复活节" />
                      <el-option label="黑色星期五" value="黑色星期五" />
                      <el-option label="元旦新年" value="元旦新年" />
                      <el-option label="感恩节" value="感恩节" />
                    </el-select>
                  </div>
                  <div class="form-item-cell">
                    <span class="label">季节标签：</span>
                    <el-select v-model="formData.seasonTag" placeholder="请选择季节标签" size="small" clearable style="width: 100%">
                      <el-option label="四季通用" value="四季通用" />
                      <el-option label="春季" value="春季" />
                      <el-option label="夏季" value="夏季" />
                      <el-option label="秋季" value="秋季" />
                      <el-option label="冬季" value="冬季" />
                    </el-select>
                  </div>
                  <div class="form-item-cell">
                    <span class="label">是否CE类：</span>
                    <el-radio-group v-model="formData.isCeCategory" size="small">
                      <el-radio-button value="否">否 (非CE)</el-radio-button>
                      <el-radio-button value="是">是 (CE认证)</el-radio-button>
                    </el-radio-group>
                  </div>
                  <div class="form-item-cell">
                    <span class="label">是否带电：</span>
                    <el-radio-group v-model="formData.hasBattery" size="small">
                      <el-radio-button value="否">否 (普货)</el-radio-button>
                      <el-radio-button value="是">是 (含电)</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>

                <!-- 第 2 排：适用机型、色号、规格、材质明细 -->
                <div class="form-grid-4 mb-2.5">
                  <div class="form-item-cell">
                    <span class="label">适用机型：</span>
                    <el-input 
                      v-model="formData.applicableModel" 
                      placeholder="如 Aura系列通用、通用" 
                      size="small" 
                      clearable 
                    />
                  </div>
                  <div class="form-item-cell">
                    <span class="label">色号：</span>
                    <el-input 
                      v-model="formData.colorCode" 
                      placeholder="如 NAT-WOOD-01、GREY-02" 
                      size="small" 
                      clearable 
                    />
                  </div>
                  <div class="form-item-cell">
                    <span class="label">规格：</span>
                    <el-input 
                      v-model="formData.spec" 
                      placeholder="如 标准款、双件套、常规" 
                      size="small" 
                      clearable 
                    />
                  </div>
                  <div class="form-item-cell">
                    <span class="label">材质明细：</span>
                    <el-input 
                      v-model="formData.materialDetail" 
                      placeholder="如 E1级环保刨花板+三聚氰胺贴面" 
                      size="small" 
                      clearable 
                    />
                  </div>
                </div>

                <!-- 第 3 排：规格型号 (标签)、入库标签短描述 -->
                <div class="form-grid-2">
                  <div class="form-item-cell">
                    <span class="label">规格型号 (标签)：</span>
                    <el-input 
                      v-model="formData.specModelDesc" 
                      type="textarea" 
                      :rows="2" 
                      maxlength="200" 
                      show-word-limit 
                      placeholder="用于箱唛/吊牌标签上的规格型号展示"
                      size="small" 
                    />
                  </div>
                  <div class="form-item-cell">
                    <span class="label">入库标签短描述：</span>
                    <el-input 
                      v-model="formData.warehouseLabelDesc" 
                      type="textarea" 
                      :rows="2" 
                      maxlength="200" 
                      show-word-limit 
                      placeholder="入库/质检条码签上的精简描述"
                      size="small" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> 
          <!-- 步骤 3：采购合规与装箱信息 (Procurement & Packaging) -->
          <div v-show="currentStep === 3" class="step-content-box">
            <div class="pane-headline">
              <span class="badge-step-dot">Step 3</span>
              <span class="title">采购信息、开票与装箱规格</span>
              <span class="desc">外箱规格已结合子件长宽高进行预估，核对无误后点击下方按钮推送审批</span>
            </div>

            <!-- 采购与开票 -->
            <div class="sub-form-card mb-3">
              <div class="card-bar-title mb-2">采购与开票信息</div>
              <div class="form-grid-3">
                <div class="form-item-cell">
                  <span class="label">生产周期：</span>
                  <el-input v-model="formData.productionCycle" placeholder="生产周期(天)" size="small">
                    <template #suffix>天</template>
                  </el-input>
                </div>
                <div class="form-item-cell">
                  <span class="label">采购起订量：</span>
                  <el-input v-model="formData.moq" placeholder="采购起订量(MOQ)" size="small" />
                </div>
                <div class="form-item-cell">
                  <span class="label">能否开票：</span>
                  <el-select v-model="formData.canInvoice" size="small" style="width: 100%">
                    <el-option label="能开专票(13%)" value="能开专票(13%)" />
                    <el-option label="能开普票" value="能开普票" />
                    <el-option label="无法开票" value="无法开票" />
                  </el-select>
                </div>
              </div>

              <div class="form-grid-3 mt-2">
                <div class="form-item-cell">
                  <span class="label">拼单类型：</span>
                  <el-select v-model="formData.orderGroupType" size="small" style="width: 100%">
                    <el-option label="同款同色拼单" value="同款同色拼单" />
                    <el-option label="整柜拼单" value="整柜拼单" />
                  </el-select>
                </div>
                <div class="form-item-cell">
                  <span class="label">拼单起订量：</span>
                  <el-input v-model="formData.orderGroupMoq" size="small" />
                </div>
                <div class="form-item-cell">
                  <span class="label">开票品名：</span>
                  <el-input v-model="formData.invoiceName" size="small" />
                </div>
              </div>
            </div>

            <!-- 规格与装箱 -->
            <div class="sub-form-card mb-3">
              <div class="card-bar-title mb-3">单品规格与包装装箱</div>
              
              <!-- 双规格面板：单品裸机 vs 包装出厂 -->
              <div class="spec-dual-container">
                <!-- 左卡片：单品规格 (成品裸机) -->
                <div class="spec-card">
                  <div class="spec-card-header">
                    <div class="title-with-badge">
                      <span class="spec-card-title">单品规格 (成品裸机)</span>
                      <span class="spec-badge">净尺寸/净重</span>
                    </div>
                  </div>
                  <div class="spec-card-body">
                    <div class="spec-row-item">
                      <span class="field-label">单品规格:</span>
                      <div class="dim-inputs-wrap">
                        <el-input v-model="formData.itemLength" placeholder="长" size="small">
                          <template #suffix><span class="unit-text">cm</span></template>
                        </el-input>
                        <span class="dim-sep">×</span>
                        <el-input v-model="formData.itemWidth" placeholder="宽" size="small">
                          <template #suffix><span class="unit-text">cm</span></template>
                        </el-input>
                        <span class="dim-sep">×</span>
                        <el-input v-model="formData.itemHeight" placeholder="高" size="small">
                          <template #suffix><span class="unit-text">cm</span></template>
                        </el-input>
                      </div>
                    </div>
                    <div class="spec-row-item">
                      <span class="field-label">单品净重:</span>
                      <div class="weight-input-wrap">
                        <el-input v-model="formData.netWeight" placeholder="0.0" size="small">
                          <template #suffix><span class="unit-text">kg</span></template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 右卡片：包装规格与毛重 (出厂箱规) -->
                <div class="spec-card">
                  <div class="spec-card-header">
                    <div class="title-with-badge">
                      <span class="spec-card-title">包装规格 (出厂箱规)</span>
                      <span class="spec-badge blue">包装尺寸/毛重</span>
                    </div>
                  </div>
                  <div class="spec-card-body">
                    <div class="spec-row-item">
                      <span class="field-label">包装规格:</span>
                      <div class="dim-inputs-wrap">
                        <el-input v-model="formData.pkgLength" placeholder="长" size="small">
                          <template #suffix><span class="unit-text">cm</span></template>
                        </el-input>
                        <span class="dim-sep">×</span>
                        <el-input v-model="formData.pkgWidth" placeholder="宽" size="small">
                          <template #suffix><span class="unit-text">cm</span></template>
                        </el-input>
                        <span class="dim-sep">×</span>
                        <el-input v-model="formData.pkgHeight" placeholder="高" size="small">
                          <template #suffix><span class="unit-text">cm</span></template>
                        </el-input>
                      </div>
                    </div>
                    <div class="spec-row-item">
                      <span class="field-label">包装毛重:</span>
                      <div class="weight-input-wrap">
                        <el-input v-model="formData.grossWeight" placeholder="0.0" size="small">
                          <template #suffix><span class="unit-text">kg</span></template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 装箱表格 -->
              <div class="packing-table-container mt-3">
                <div class="packing-table-header-bar">
                  <span class="table-title">装箱规格与参数核算</span>
                  <span class="table-subtip">系统已结合子件长宽高进行预估，可根据实际装箱方案核对调整</span>
                </div>
                <div class="table-responsive-box">
                  <table class="packing-calc-table">
                    <thead>
                      <tr>
                        <th style="width: 14%">整箱毛重</th>
                        <th style="width: 12%">装箱件数</th>
                        <th style="width: 14%">组合总毛重</th>
                        <th style="width: 32%">外箱规格 (长 × 宽 × 高)</th>
                        <th style="width: 14%">外箱体积</th>
                        <th style="width: 14%">单件毛重</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <el-input v-model="formData.boxGrossWeight" size="small" placeholder="0.0">
                            <template #suffix><span class="unit-text">kg</span></template>
                          </el-input>
                        </td>
                        <td>
                          <el-input v-model="formData.boxPcs" size="small" placeholder="1">
                            <template #suffix><span class="unit-text">pcs</span></template>
                          </el-input>
                        </td>
                        <td>
                          <el-input v-model="formData.comboTotalGrossWeight" size="small" placeholder="0.0">
                            <template #suffix><span class="unit-text">kg</span></template>
                          </el-input>
                        </td>
                        <td>
                          <div class="table-lwh-box">
                            <el-input v-model="formData.outerBoxLength" placeholder="长" size="small" @input="calcOuterBoxVolume" />
                            <span class="dim-sep">×</span>
                            <el-input v-model="formData.outerBoxWidth" placeholder="宽" size="small" @input="calcOuterBoxVolume" />
                            <span class="dim-sep">×</span>
                            <el-input v-model="formData.outerBoxHeight" placeholder="高" size="small" @input="calcOuterBoxVolume" />
                            <span class="unit-text">cm</span>
                          </div>
                        </td>
                        <td>
                          <el-input v-model="formData.outerBoxVolume" size="small" placeholder="0">
                            <template #suffix><span class="unit-text">cm³</span></template>
                          </el-input>
                        </td>
                        <td>
                          <el-input v-model="formData.singleGrossWeight" size="small" placeholder="0.0">
                            <template #suffix><span class="unit-text">kg</span></template>
                          </el-input>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- 产品图与包装图上传 -->
            <div class="sub-form-card">
              <div class="card-bar-title mb-2">
                <span>物料多视角图片与装箱实拍</span>
                <span class="sub-hint">支持本地多选/拖拽上传，或一键导入标准多角度实景</span>
              </div>
              
              <div class="upload-dual-container">
                <!-- 1. 产品多视角图 -->
                <div class="upload-panel-card">
                  <div class="upload-panel-header">
                    <div class="header-left">
                      <span class="upload-title">产品图 (多视角/细节)</span>
                      <span class="upload-count-tag" :class="{ maxed: formData.productImages.length >= 12 }">
                        {{ formData.productImages.length }} / 12 张
                      </span>
                    </div>
                    <div class="header-actions">
                      <el-button 
                        v-if="formData.productImages.length < 12"
                        type="primary" 
                        link 
                        size="small" 
                        @click="handleInjectProductAnglePresets"
                      >
                        <el-icon class="mr-1"><MagicStick /></el-icon> 注入预设立体多视角
                      </el-button>
                      <el-button 
                        v-if="formData.productImages.length > 0" 
                        type="danger" 
                        link 
                        size="small" 
                        @click="handleClearProductImages"
                      >
                        清空
                      </el-button>
                    </div>
                  </div>

                  <!-- 图片列表与上传卡片 -->
                  <div class="image-gallery-grid">
                    <div 
                      v-for="(img, idx) in formData.productImages" 
                      :key="idx" 
                      class="img-card-item"
                      :class="{ 'is-primary': formData.imageUrl === img || idx === 0 }"
                    >
                      <img :src="img" class="thumb-img" alt="产品视角图" />
                      <div class="img-badge" v-if="formData.imageUrl === img || (idx === 0 && !formData.imageUrl)">主图</div>
                      <div class="img-overlay">
                        <el-tooltip content="大图预览" placement="top">
                          <el-icon class="icon-btn" @click="handlePreviewSingleImg(img)"><ZoomIn /></el-icon>
                        </el-tooltip>
                        <el-tooltip content="设为主外观图" placement="top">
                          <el-icon class="icon-btn" @click="formData.imageUrl = img"><Star /></el-icon>
                        </el-tooltip>
                        <el-tooltip content="删除图片" placement="top">
                          <el-icon class="icon-btn del" @click="handleRemoveProductImage(idx)"><Delete /></el-icon>
                        </el-tooltip>
                      </div>
                    </div>

                    <!-- 上传触发卡片 -->
                    <div 
                      v-if="formData.productImages.length < 12" 
                      class="upload-trigger-card"
                      @click="triggerProductFileInput"
                      @dragover.prevent
                      @drop.prevent="handleProductDrop"
                    >
                      <input 
                        ref="productFileInputRef" 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        class="hidden-file-input" 
                        @change="handleProductFileSelect" 
                      />
                      <el-icon class="plus-icon"><Plus /></el-icon>
                      <div class="trigger-label">点击或拖拽上传</div>
                      <div class="trigger-sub">JPG/PNG 实拍</div>
                    </div>
                  </div>
                </div>

                <!-- 2. 包装实拍图 -->
                <div class="upload-panel-card">
                  <div class="upload-panel-header">
                    <div class="header-left">
                      <span class="upload-title">包装装箱图 (外箱/唛头)</span>
                      <span class="upload-count-tag" :class="{ maxed: formData.packageImages.length >= 6 }">
                        {{ formData.packageImages.length }} / 6 张
                      </span>
                    </div>
                    <div class="header-actions">
                      <el-button 
                        v-if="formData.packageImages.length < 6"
                        type="primary" 
                        link 
                        size="small" 
                        @click="handleInjectPackagePresets"
                      >
                        <el-icon class="mr-1"><MagicStick /></el-icon> 注入预设箱规唛头图
                      </el-button>
                      <el-button 
                        v-if="formData.packageImages.length > 0" 
                        type="danger" 
                        link 
                        size="small" 
                        @click="formData.packageImages = []"
                      >
                        清空
                      </el-button>
                    </div>
                  </div>

                  <!-- 包装图列表与上传卡片 -->
                  <div class="image-gallery-grid">
                    <div 
                      v-for="(img, idx) in formData.packageImages" 
                      :key="idx" 
                      class="img-card-item"
                    >
                      <img :src="img" class="thumb-img" alt="包装箱规图" />
                      <div class="img-badge gray">包装{{ idx + 1 }}</div>
                      <div class="img-overlay">
                        <el-tooltip content="大图预览" placement="top">
                          <el-icon class="icon-btn" @click="handlePreviewSingleImg(img)"><ZoomIn /></el-icon>
                        </el-tooltip>
                        <el-tooltip content="删除图片" placement="top">
                          <el-icon class="icon-btn del" @click="handleRemovePackageImage(idx)"><Delete /></el-icon>
                        </el-tooltip>
                      </div>
                    </div>

                    <!-- 包装图上传触发卡片 -->
                    <div 
                      v-if="formData.packageImages.length < 6" 
                      class="upload-trigger-card"
                      @click="triggerPackageFileInput"
                      @dragover.prevent
                      @drop.prevent="handlePackageDrop"
                    >
                      <input 
                        ref="packageFileInputRef" 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        class="hidden-file-input" 
                        @change="handlePackageFileSelect" 
                      />
                      <el-icon class="plus-icon"><Plus /></el-icon>
                      <div class="trigger-label">上传包装实拍</div>
                      <div class="trigger-sub">外箱六面/侧唛</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 向导底部动作按钮栏 -->
          <div class="wizard-bottom-actions">
            <el-button v-if="currentStep > 1" icon="ArrowLeft" @click="currentStep--">
              上一步
            </el-button>
            <div class="flex-spacer"></div>

            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="info" plain :loading="saving" @click="handleSaveCombo(false)">
              {{ formData.auditStatus === '待审核' ? '保存修改' : '暂存草稿' }}
            </el-button>

            <el-button 
              v-if="currentStep < 3" 
              type="primary" 
              icon="ArrowRight" 
              @click="nextWizardStep"
            >
              下一步：{{ currentStep === 1 ? '物料属性与基础资料' : '采购与装箱规格' }}
            </el-button>

            <el-button 
              v-else 
              type="primary" 
              class="submit-deep-btn" 
              :loading="saving" 
              @click="handleSaveCombo(true)"
            >
              <el-icon class="mr-1">
                <Check v-if="formData.auditStatus === '待审核'" />
                <Promotion v-else />
              </el-icon>
              {{ formData.auditStatus === '待审核' ? '保存修改并维持待审核' : '提交并推送审核' }}
            </el-button>
          </div>
        </div>

        <!-- 右侧：组合物料实时数字孪生卡片 (30%) -->
        <aside class="wizard-right-preview-pane">
          <div class="preview-sticky-card">
            <div class="preview-card-header">
              <span class="title">组合物料实时数字预览</span>
              <span class="sync-badge">实时聚合同步</span>
            </div>

            <!-- 物料主图预览 -->
            <div class="preview-hero-img-box">
              <img v-if="formData.imageUrl" :src="formData.imageUrl" class="hero-img" alt="物料图" />
              <div v-else class="hero-img-empty">
                <el-icon class="empty-icon"><PictureFilled /></el-icon>
                <span>暂无组合外观图</span>
              </div>
            </div>
            <!-- 多视角缩略图切图条 -->
            <div v-if="formData.productImages && formData.productImages.length > 1" class="preview-thumbs-strip">
              <div 
                v-for="(img, idx) in formData.productImages.slice(0, 5)" 
                :key="idx" 
                class="strip-item"
                :class="{ active: formData.imageUrl === img }"
                @click="formData.imageUrl = img"
              >
                <img :src="img" alt="视角小图" />
              </div>
              <span v-if="formData.productImages.length > 5" class="strip-more">+{{ formData.productImages.length - 5 }}</span>
            </div>

            <!-- 智能自动计算聚合指标 (黑科技) -->
            <div class="aggregated-metrics-grid">
              <div class="metric-item">
                <span class="m-label">包装包裹数</span>
                <span class="m-val text-primary">{{ derivedMetrics.totalPacks }}</span>
              </div>
              <div class="metric-item">
                <span class="m-label">预估组合总毛重</span>
                <span class="m-val text-warning">{{ derivedMetrics.totalGrossWeight }} <small>kg</small></span>
              </div>
              <div class="metric-item">
                <span class="m-label">预估组合总净重</span>
                <span class="m-val text-indigo">{{ derivedMetrics.totalNetWeight }} <small>kg</small></span>
              </div>
              <div class="metric-item">
                <span class="m-label">预估外箱总体积</span>
                <span class="m-val text-danger">{{ derivedMetrics.totalVolume }} <small>m³</small></span>
              </div>
            </div>

            <!-- BOM 构成爆炸图 -->
            <div class="bom-breakdown-box">
              <div class="breakdown-title">
                <span>BOM 子部件构成 ({{ formData.children.length }} 项)</span>
                <span class="ratio-sum">总计 {{ calculateTotalRatio(formData.children) }} 件</span>
              </div>

              <div class="breakdown-list">
                <div 
                  v-for="(child, idx) in formData.children" 
                  :key="idx" 
                  class="breakdown-item"
                >
                  <div class="item-left">
                    <span class="child-idx">{{ idx + 1 }}</span>
                    <div class="item-texts">
                      <span class="child-c font-mono">{{ child.childCode || '待选子件' }}</span>
                      <span class="child-n text-ellipsis">{{ child.childName || '未命名部件' }}</span>
                    </div>
                  </div>
                  <div class="item-right">
                    <span class="ratio-tag">x{{ child.ratio || 1 }}</span>
                  </div>
                </div>
              </div>
            </div>


            <!-- 健康度与防错提示 -->
            <div class="preview-health-tip">
              <el-icon class="tip-icon"><InfoFilled /></el-icon>
              <span>{{ healthAuditTip }}</span>
            </div>
          </div>
        </aside>
      </div>
    </el-dialog>

    <!-- 大图全屏预览弹窗 -->
    <el-dialog v-model="previewImgVisible" title="物料多视角图片高清预览" width="560px" align-center>
      <div class="img-modal-preview-body">
        <img :src="previewImgUrl" class="modal-large-img" alt="大图预览" />
      </div>
    </el-dialog>

    <!-- 6. 对话框：【引用同款】快速选用弹窗 -->
    <el-dialog
      v-model="quoteDialogVisible"
      title="引用同款物料属性"
      width="800px"
      destroy-on-close
    >
      <div class="quote-dialog-body">
        <el-input 
          v-model="quoteSearchKey" 
          placeholder="搜索已有物料的编码、产品名称、款式或主材料..." 
          prefix-icon="Search"
          clearable 
          size="small" 
          class="mb-3"
        />

        <el-table 
          :data="filteredQuoteList" 
          border 
          stripe 
          height="320" 
          size="small"
          highlight-current-row
          @current-change="handleSelectQuoteRow"
        >
          <el-table-column label="物料编码" prop="parentCode" width="170" />
          <el-table-column label="产品名称" prop="productName" min-width="180" show-overflow-tooltip />
          <el-table-column label="款式" prop="style" width="110" />
          <el-table-column label="主材质" prop="material" width="120" />
          <el-table-column label="颜色" prop="color" width="90" />
          <el-table-column label="操作" width="90" align="center">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="applyQuote(row)">
                引用此款
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="quoteDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 6.5. 对话框：【组合物料审批处理弹窗 (通过/不通过/驳回)】 -->
    <el-dialog
      v-model="auditModalVisible"
      width="880px"
      destroy-on-close
      class="audit-action-dialog"
      :close-on-click-modal="false"
    >
      <template #header>
        <div class="audit-action-dialog-header">
          <div class="header-left">
            <span class="header-title">组合物料审核处理</span>
          </div>
        </div>
      </template>

      <div v-if="activeAuditRow" class="audit-action-modal-body">
        <!-- 1. 待审核单据状态条 -->
        <div class="audit-status-strip">
          <div class="strip-left">
            <span class="strip-icon-circle">
              <el-icon><Stamp /></el-icon>
            </span>
            <div class="strip-text">
              <span class="strip-main">
                正在审核物料：<b>{{ activeAuditRow.productName }}</b>
              </span>
            </div>
          </div>
          <div class="strip-right">
            <el-tag size="small" type="warning" effect="light" class="audit-status-badge">
              <el-icon class="mr-1"><Clock /></el-icon> 待产品线审核
            </el-tag>
          </div>
        </div>

        <!-- 2. 单据基础属性与 BOM 子件核对 -->
        <div class="audit-target-details-section">
          <div class="section-title-bar">
            <div class="title-left">
              <span class="bar-title">单据核对信息</span>
              <span v-if="(activeAuditRow.boundChildren || activeAuditRow.children || []).length" class="text-xs text-slate-400 font-normal">
                （含 {{ (activeAuditRow.boundChildren || activeAuditRow.children || []).length }} 项 BOM 子部件）
              </span>
            </div>
            <div class="title-right">
              <span class="text-xs text-slate-400">审批责任人：<b class="text-slate-700 font-semibold">{{ activeAuditRow.productLineLeader || '夏忠保' }}</b></span>
            </div>
          </div>

          <!-- 属性概览小网格 -->
          <div class="meta-info-grid mb-2.5">
            <div class="meta-cell">
              <span class="cell-label">组合品名：</span>
              <span class="cell-val font-semibold text-slate-800">{{ activeAuditRow.productName }}</span>
            </div>
            <div class="meta-cell">
              <span class="cell-label">组合类型：</span>
              <span class="type-badge" :class="getComboTypeBadgeClass(activeAuditRow.comboType)">{{ activeAuditRow.comboType }}</span>
            </div>
            <div class="meta-cell">
              <span class="cell-label">销售平台：</span>
              <el-tag size="small" effect="plain">{{ activeAuditRow.salesPlatform || 'Amazon' }}</el-tag>
            </div>
            <div class="meta-cell">
              <span class="cell-label">运营大类：</span>
              <span class="cell-val">{{ activeAuditRow.category || '家具/室内家具' }}</span>
            </div>
          </div>

          <!-- 子件列表表格简略核对 (若有子部件) -->
          <div v-if="(activeAuditRow.boundChildren || activeAuditRow.children || []).length" class="audit-bom-mini-table">
            <el-table 
              :data="activeAuditRow.boundChildren || activeAuditRow.children || []" 
              border 
              size="small" 
              max-height="160" 
              stripe 
              class="bom-preview-table"
            >
              <el-table-column type="index" label="#" width="40" align="center" />
              <el-table-column label="子物料编码" prop="childCode" min-width="145">
                <template #default="{ row: c }">
                  <span class="font-mono text-xs font-semibold text-primary whitespace-nowrap">{{ c.childCode }}</span>
                </template>
              </el-table-column>
              <el-table-column label="单套配比" prop="ratio" width="85" align="center">
                <template #default="{ row: c }">
                  <span class="ratio-pill font-mono">1:{{ c.ratio }}</span>
                </template>
              </el-table-column>
              <el-table-column label="产品名称" prop="childProductName" min-width="150" show-overflow-tooltip>
                <template #default="{ row: c }">
                  <span class="font-medium text-slate-800">{{ c.childProductName || c.childName || c.productName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="款式" prop="childStyle" width="95" show-overflow-tooltip>
                <template #default="{ row: c }">
                  <span>{{ c.childStyle || c.style || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="主材料" prop="childMaterial" width="100" show-overflow-tooltip>
                <template #default="{ row: c }">
                  <span>{{ c.childMaterial || c.material || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="适用品牌或机型" prop="childTarget" width="125" show-overflow-tooltip>
                <template #default="{ row: c }">
                  <span class="text-xs text-gray-600">{{ c.applicableBrandOrModel || c.childTarget || c.targetBrandOrAudience || c.applicableModel || '通用' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="型号" prop="childModel" width="95" show-overflow-tooltip>
                <template #default="{ row: c }">
                  <span class="font-mono text-xs">{{ c.childModel || c.model || '-' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="公司品牌" prop="childBrand" width="90" align="center">
                <template #default="{ row: c }">
                  <span class="text-xs text-slate-700 font-medium">{{ c.childBrand || c.brand || '中性' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="包装数量" prop="childPackQty" width="85" align="center">
                <template #default="{ row: c }">
                  <span class="font-mono text-xs text-slate-600">{{ c.childPackQty || c.packQty || '1pack' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="颜色" prop="childColor" width="85" align="center">
                <template #default="{ row: c }">
                  <span v-if="c.childColor || c.color" class="color-text-cell">
                    <span class="color-dot"></span>
                    <span class="text-xs text-slate-700">{{ c.childColor || c.color }}</span>
                  </span>
                  <span v-else class="text-slate-400">-</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 3. 审批决策卡片选择 -->
        <div class="audit-decision-cards-section">
          <div class="section-title-bar">
            <div class="title-left">
              <span class="bar-title">选择审批决策</span>
              <span class="bar-sub">点击卡片切换审核结果与流转动作</span>
            </div>
            <div class="title-right">
              <span class="text-xs text-slate-400">单选（共 3 项决策）</span>
            </div>
          </div>

          <div class="decision-cards-grid">
            <!-- 1. 通过 -->
            <div 
              class="decision-choice-card card-pass" 
              :class="{ 'is-selected': auditDecision === 'pass' }"
              @click="auditDecision = 'pass'"
            >
              <div class="card-radio-ring">
                <span class="radio-inner-dot"></span>
              </div>
              <div class="card-main">
                <div class="card-top-line">
                  <div class="title-wrap">
                    <el-icon class="status-icon"><CircleCheckFilled /></el-icon>
                    <span class="decision-name">审核通过</span>
                  </div>
                  <span class="status-action-tag pass">准予生效</span>
                </div>
                <div class="decision-desc">
                  自动分配正式组合编码并生效，单据锁定归档不可删除
                </div>
              </div>
            </div>

            <!-- 2. 驳回 -->
            <div 
              class="decision-choice-card card-reject" 
              :class="{ 'is-selected': auditDecision === 'reject' }"
              @click="auditDecision = 'reject'"
            >
              <div class="card-radio-ring">
                <span class="radio-inner-dot"></span>
              </div>
              <div class="card-main">
                <div class="card-top-line">
                  <div class="title-wrap">
                    <el-icon class="status-icon"><RefreshLeft /></el-icon>
                    <span class="decision-name">审核驳回</span>
                  </div>
                  <span class="status-action-tag reject">退回修改</span>
                </div>
                <div class="decision-desc">
                  单据退回可编辑状态，操作员修改 BOM 后可重新提交
                </div>
              </div>
            </div>

            <!-- 3. 不通过 -->
            <div 
              class="decision-choice-card card-disapprove" 
              :class="{ 'is-selected': auditDecision === 'disapprove' }"
              @click="auditDecision = 'disapprove'"
            >
              <div class="card-radio-ring">
                <span class="radio-inner-dot"></span>
              </div>
              <div class="card-main">
                <div class="card-top-line">
                  <div class="title-wrap">
                    <el-icon class="status-icon"><CircleCloseFilled /></el-icon>
                    <span class="decision-name">审核不通过</span>
                  </div>
                  <span class="status-action-tag disapprove">终止归档</span>
                </div>
                <div class="decision-desc">
                  不符合规划规范，单据终审归档留痕不可再重新流转
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. 审核意见说明表单区 -->
        <div class="audit-remark-section">
          <div class="remark-title-bar">
            <div class="title-left">
              <span class="bar-title">审核意见说明</span>
              <span v-if="auditDecision !== 'pass'" class="require-tag">* 必填驳回说明</span>
              <span v-else class="optional-tag">（选填附言）</span>
            </div>
            <!-- 快捷预设短语 -->
            <div class="preset-phrases-group">
              <span class="preset-label">快捷填入：</span>
              <button 
                v-for="(phrase, pIdx) in singleAuditPresets" 
                :key="pIdx" 
                type="button"
                class="phrase-chip-btn"
                @click="applySingleAuditPreset(phrase)"
              >
                {{ phrase }}
              </button>
            </div>
          </div>

          <el-input 
            v-model="auditRemark" 
            type="textarea" 
            :rows="3" 
            class="remark-textarea"
            :placeholder="auditDecision === 'pass' ? '可输入审核附言（选填，点击上方快捷短语可直接填入，如：全部核对无误，准予生效备货）...' : (auditDecision === 'reject' ? '请输入驳回原因说明（必填，便于操作人员据此修改后重新提交）...' : '请输入审核不通过原因说明（必填）...')" 
          />
        </div>
      </div>

      <template #footer>
        <div class="audit-action-dialog-footer">
          <div class="footer-left-status">
            <span class="status-label">当前审批决策：</span>
            <el-tag 
              :type="auditDecision === 'pass' ? 'success' : (auditDecision === 'reject' ? 'warning' : 'danger')" 
              effect="light"
              class="status-tag"
            >
              {{ auditDecision === 'pass' ? '审核通过 · 准予生效' : (auditDecision === 'reject' ? '审核驳回 · 退回修改' : '审核不通过 · 终止归档') }}
            </el-tag>
          </div>
          <div class="footer-right-buttons">
            <el-button @click="auditModalVisible = false">取消</el-button>
            <el-button 
              type="primary" 
              plain 
              icon="Edit" 
              @click="handleEditFromAuditModal"
            >
              修改物料资料
            </el-button>
            <el-button 
              :type="auditDecision === 'pass' ? 'success' : (auditDecision === 'reject' ? 'warning' : 'danger')" 
              :loading="auditSubmitting" 
              class="confirm-audit-btn"
              @click="handleConfirmAuditModal"
            >
              <el-icon class="mr-1">
                <CircleCheckFilled v-if="auditDecision === 'pass'" />
                <RefreshLeft v-else-if="auditDecision === 'reject'" />
                <CircleCloseFilled v-else />
              </el-icon>
              确定提交审核结果
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 6.5. 对话框：【批量审核操作弹窗】 -->
    <el-dialog
      v-model="batchAuditModalVisible"
      width="960px"
      destroy-on-close
      class="batch-audit-dialog"
      :close-on-click-modal="false"
    >
      <template #header>
        <div class="batch-audit-dialog-header">
          <div class="header-left">
            <span class="header-title">批量审核组合物料</span>
            <el-tag 
              size="small" 
              :type="currentUser.role === 'admin' ? 'danger' : 'primary'" 
              effect="light" 
              class="ml-2 font-medium"
            >
              当前审批：{{ currentUser.name }}（{{ currentUser.role === 'admin' ? '系统管理员 · 全量权限' : currentUser.roleName }}）
            </el-tag>
          </div>
        </div>
      </template>

      <div class="batch-audit-modal-body">
        <!-- 1. 待审核单据状态条 -->
        <div class="batch-audit-status-strip">
          <div class="strip-left">
            <span class="strip-icon-circle">
              <el-icon><Stamp /></el-icon>
            </span>
            <div class="strip-text">
              <span class="strip-main">
                共识别到 <b>{{ batchAuditTargetList.length }}</b> 款待审核组合物料
              </span>
            </div>
          </div>
          <div class="strip-right flex items-center gap-2">
            <span v-if="batchAuditSkippedLeaderCount > 0" class="skipped-pill text-amber-700 bg-amber-50 border-amber-300">
              已自动过滤 {{ batchAuditSkippedLeaderCount }} 款非本人负责单据
            </span>
            <span v-if="batchAuditSkippedCount > 0" class="skipped-pill">
              已自动过滤 {{ batchAuditSkippedCount }} 款非待审单据
            </span>
            <span v-if="batchAuditSkippedLeaderCount === 0 && batchAuditSkippedCount === 0" class="all-valid-pill">
              {{ currentUser.role === 'admin' ? '超管权限已生效 · 选中待审单据全量准入' : '已选单据均符合审核权限' }}
            </span>
          </div>
        </div>

        <!-- 2. 待审核明细清单表格 -->
        <div class="batch-audit-table-section">
          <div class="section-title-bar">
            <div class="title-left">
              <span class="bar-title">待审核物料清单</span>
              <span class="bar-badge">{{ batchAuditTargetList.length }} 款</span>
            </div>
          </div>
          <el-table 
            :data="batchAuditTargetList" 
            border 
            size="small" 
            max-height="250" 
            stripe 
            class="batch-audit-table"
          >
            <!-- 展开显示子件清单 -->
            <el-table-column type="expand" width="40">
              <template #default="{ row }">
                <div class="batch-expand-bom-wrap">
                  <div class="expand-header flex items-center justify-between mb-1.5">
                    <span class="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <el-icon class="text-primary"><Connection /></el-icon>
                      【{{ row.productName }}】BOM 子件清单（共 {{ (row.children || row.boundChildren || []).length }} 项）：
                    </span>
                    <span class="text-xs text-slate-400">请核对单套配比与规格信息</span>
                  </div>
                  <el-table 
                    :data="row.children || row.boundChildren || []" 
                    border 
                    size="small" 
                    class="inner-bom-table"
                  >
                    <el-table-column type="index" label="#" width="40" align="center" />
                    <el-table-column label="子物料编码" prop="childCode" min-width="140">
                      <template #default="{ row: c }">
                        <span class="font-mono text-xs font-semibold text-primary whitespace-nowrap">{{ c.childCode }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="单套配比" prop="ratio" width="85" align="center">
                      <template #default="{ row: c }">
                        <span class="ratio-pill font-mono">1:{{ c.ratio }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="产品名称" prop="childProductName" min-width="150" show-overflow-tooltip>
                      <template #default="{ row: c }">
                        <span class="font-medium text-slate-800">{{ c.childProductName || c.childName || c.productName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="款式" prop="childStyle" width="95" show-overflow-tooltip>
                      <template #default="{ row: c }">
                        <span>{{ c.childStyle || c.style || '-' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="主材料" prop="childMaterial" width="105" show-overflow-tooltip>
                      <template #default="{ row: c }">
                        <span>{{ c.childMaterial || c.material || '-' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="适用品牌或机型" prop="childTarget" width="125" show-overflow-tooltip>
                      <template #default="{ row: c }">
                        <span class="text-xs text-gray-600">{{ c.applicableBrandOrModel || c.childTarget || c.targetBrandOrAudience || c.applicableModel || '通用' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="型号" prop="childModel" width="95" show-overflow-tooltip>
                      <template #default="{ row: c }">
                        <span class="font-mono text-xs">{{ c.childModel || c.model || '-' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="公司品牌" prop="childBrand" width="90" align="center">
                      <template #default="{ row: c }">
                        <span class="text-xs text-slate-700 font-medium">{{ c.childBrand || c.brand || '中性' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="颜色" prop="childColor" width="80" align="center">
                      <template #default="{ row: c }">
                        <span v-if="c.childColor || c.color" class="color-text-cell">
                          <span class="color-dot"></span>
                          <span class="text-xs text-slate-700">{{ c.childColor || c.color }}</span>
                        </span>
                        <span v-else class="text-slate-400">-</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="包装数量" prop="childPackQty" width="85" align="center">
                      <template #default="{ row: c }">
                        <span class="font-mono text-xs text-slate-600">{{ c.childPackQty || c.packQty || '1pack' }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </el-table-column>

            <el-table-column type="index" label="#" width="40" align="center" />
            <el-table-column label="组合类型" prop="comboType" width="100" align="center">
              <template #default="{ row }">
                <span class="type-badge" :class="getComboTypeBadgeClass(row.comboType)">{{ row.comboType }}</span>
              </template>
            </el-table-column>
            <el-table-column label="运营大类" prop="category" width="115" show-overflow-tooltip />
            <el-table-column label="产品名称" prop="productName" min-width="170" show-overflow-tooltip>
              <template #default="{ row }">
                <span class="font-medium text-slate-800">{{ row.productName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="款式" prop="style" width="95" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.style || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="主材料" prop="material" width="105" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.material || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="公司品牌" prop="brand" width="90" align="center">
              <template #default="{ row }">
                <span class="text-xs text-slate-700 font-medium">{{ row.brand || '中性' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="颜色" prop="color" width="80" align="center">
              <template #default="{ row }">
                <span v-if="row.color" class="color-text-cell">
                  <span class="color-dot"></span>
                  <span class="text-xs text-slate-700">{{ row.color }}</span>
                </span>
                <span v-else class="text-slate-400">-</span>
              </template>
            </el-table-column>
            <el-table-column label="包装数量" prop="packQty" width="85" align="center">
              <template #default="{ row }">
                <span class="font-mono text-xs text-slate-600">{{ row.packQty || '1pack' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="子件数" width="75" align="center">
              <template #default="{ row }">
                <span class="font-mono text-xs font-semibold text-slate-700">{{ (row.children || row.boundChildren || []).length }} 项</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 3. 审批决策卡片选择 -->
        <div class="batch-audit-decision-section">
          <div class="section-title-bar">
            <div class="title-left">
              <span class="bar-title">选择审批决策</span>
              <span class="bar-sub">点击卡片切换批量审核结果</span>
            </div>
            <div class="title-right">
              <span class="text-xs text-slate-400">单选（共 3 项决策）</span>
            </div>
          </div>

          <div class="decision-cards-grid">
            <!-- 1. 通过 -->
            <div 
              class="decision-choice-card card-pass" 
              :class="{ 'is-selected': batchAuditDecision === 'pass' }"
              @click="batchAuditDecision = 'pass'"
            >
              <div class="card-radio-ring">
                <span class="radio-inner-dot"></span>
              </div>
              <div class="card-main">
                <div class="card-top-line">
                  <div class="title-wrap">
                    <el-icon class="status-icon"><CircleCheckFilled /></el-icon>
                    <span class="decision-name">审核通过</span>
                  </div>
                  <span class="status-action-tag pass">准予生效</span>
                </div>
                <div class="decision-desc">
                  自动分配正式组合编码并生效，单据锁定归档不可删除
                </div>
              </div>
            </div>

            <!-- 2. 驳回 -->
            <div 
              class="decision-choice-card card-reject" 
              :class="{ 'is-selected': batchAuditDecision === 'reject' }"
              @click="batchAuditDecision = 'reject'"
            >
              <div class="card-radio-ring">
                <span class="radio-inner-dot"></span>
              </div>
              <div class="card-main">
                <div class="card-top-line">
                  <div class="title-wrap">
                    <el-icon class="status-icon"><RefreshLeft /></el-icon>
                    <span class="decision-name">审核驳回</span>
                  </div>
                  <span class="status-action-tag reject">退回修改</span>
                </div>
                <div class="decision-desc">
                  单据退回可编辑状态，操作员修改 BOM 后可重新提交
                </div>
              </div>
            </div>

            <!-- 3. 不通过 -->
            <div 
              class="decision-choice-card card-disapprove" 
              :class="{ 'is-selected': batchAuditDecision === 'disapprove' }"
              @click="batchAuditDecision = 'disapprove'"
            >
              <div class="card-radio-ring">
                <span class="radio-inner-dot"></span>
              </div>
              <div class="card-main">
                <div class="card-top-line">
                  <div class="title-wrap">
                    <el-icon class="status-icon"><CircleCloseFilled /></el-icon>
                    <span class="decision-name">审核不通过</span>
                  </div>
                  <span class="status-action-tag disapprove">终止归档</span>
                </div>
                <div class="decision-desc">
                  不符合规划规范，单据终审归档留痕不可再重新流转
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. 审核意见说明表单区 -->
        <div class="batch-audit-remark-section">
          <div class="remark-title-bar">
            <div class="title-left">
              <span class="bar-title">批量审核意见</span>
              <span v-if="batchAuditDecision !== 'pass'" class="require-tag">* 必填驳回说明</span>
              <span v-else class="optional-tag">（选填附言）</span>
            </div>
            <!-- 快捷预设短语 -->
            <div class="preset-phrases-group">
              <span class="preset-label">快捷填入：</span>
              <button 
                v-for="(phrase, pIdx) in batchAuditPresets" 
                :key="pIdx" 
                type="button"
                class="phrase-chip-btn"
                @click="applyAuditPreset(phrase)"
              >
                {{ phrase }}
              </button>
            </div>
          </div>

          <el-input 
            v-model="batchAuditRemark" 
            type="textarea" 
            :rows="3" 
            class="remark-textarea"
            :placeholder="batchAuditDecision === 'pass' ? '可输入审核附言（选填，点击上方快捷短语可直接填入，如：全部核对无误，准予生效备货）...' : (batchAuditDecision === 'reject' ? '请输入批量驳回原因说明（必填，便于操作人员据此修改后重新提交）...' : '请输入批量不通过原因说明（必填）...')" 
          />
        </div>
      </div>

      <template #footer>
        <div class="batch-audit-dialog-footer">
          <div class="footer-left-status">
            <span class="status-label">当前审批决策：</span>
            <el-tag 
              :type="batchAuditDecision === 'pass' ? 'success' : (batchAuditDecision === 'reject' ? 'warning' : 'danger')" 
              effect="light"
              class="status-tag"
            >
              {{ batchAuditDecision === 'pass' ? '批量通过 · 准予生效' : (batchAuditDecision === 'reject' ? '批量驳回 · 退回修改' : '批量不通过 · 终止归档') }}
            </el-tag>
            <span class="status-count">共 {{ batchAuditTargetList.length }} 款单据</span>
          </div>
          <div class="footer-right-buttons">
            <el-button @click="batchAuditModalVisible = false">取消</el-button>
            <el-button 
              :type="batchAuditDecision === 'pass' ? 'success' : (batchAuditDecision === 'reject' ? 'warning' : 'danger')" 
              :loading="batchAuditSubmitting" 
              class="confirm-audit-btn"
              @click="handleConfirmBatchAudit"
            >
              <el-icon class="mr-1">
                <CircleCheckFilled v-if="batchAuditDecision === 'pass'" />
                <RefreshLeft v-else-if="batchAuditDecision === 'reject'" />
                <CircleCloseFilled v-else />
              </el-icon>
              确定执行批量审核 ({{ batchAuditTargetList.length }} 款)
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 7. 对话框：【推送审批流详情 / 审核进度弹窗】 -->
    <el-dialog
      v-model="workflowDialogVisible"
      title="审批流程进度"
      width="540px"
      destroy-on-close
    >
      <div v-if="activeWorkflowRow" class="workflow-modal-body">
        <!-- 紧凑概览卡片 -->
        <div class="wf-compact-header">
          <div class="header-top-row">
            <div class="title-and-code">
              <span class="product-title" :title="activeWorkflowRow.productName">{{ activeWorkflowRow.productName }}</span>
              <span class="parent-code font-mono">{{ activeWorkflowRow.parentCode || '待生成编码' }}</span>
            </div>
            <el-tag 
              :type="activeWorkflowRow.auditStatus === '待审核' || activeWorkflowRow.status === '待审核' ? 'warning' : (activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿' ? 'info' : (activeWorkflowRow.auditStatus === '已驳回' ? 'danger' : (activeWorkflowRow.auditStatus === '审核不通过' ? 'danger' : 'success')))"
              :effect="activeWorkflowRow.auditStatus === '已驳回' ? 'plain' : 'light'"
              size="small"
              class="status-pill"
            >
              <el-icon class="mr-1">
                <Clock v-if="activeWorkflowRow.auditStatus === '待审核' || activeWorkflowRow.status === '待审核'" />
                <Close v-else-if="activeWorkflowRow.auditStatus === '已驳回'" />
                <CircleClose v-else-if="activeWorkflowRow.auditStatus === '审核不通过'" />
                <Document v-else-if="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿'" />
                <Check v-else />
              </el-icon>
              {{ (activeWorkflowRow.auditStatus === '审核通过' || activeWorkflowRow.status === '已生效') ? '已生效' : (activeWorkflowRow.auditStatus || activeWorkflowRow.status || '已生效') }}
            </el-tag>
          </div>

          <div class="header-meta-row">
            <div class="meta-item">
              <span class="meta-label">类别：</span>
              <span class="meta-val">{{ activeWorkflowRow.category || '家具/室内家具' }}</span>
            </div>
            <span class="meta-sep">/</span>
            <div class="meta-item">
              <span class="meta-label">类型：</span>
              <span class="meta-val">{{ activeWorkflowRow.comboType || '普通组合' }}</span>
            </div>
            <span class="meta-sep">/</span>
            <div class="meta-item">
              <span class="meta-label">发起人：</span>
              <span class="meta-val">{{ activeWorkflowRow.operator || '美区运营-Lucy' }}</span>
            </div>
            <span class="meta-sep">/</span>
            <div class="meta-item">
              <span class="meta-label">审批人：</span>
              <span class="meta-val font-medium text-emerald-700">{{ activeWorkflowRow.productLineLeader || '夏忠保' }}</span>
            </div>
          </div>
        </div>

        <!-- 极简流程时间线 -->
        <div class="wf-clean-steps">
          <!-- 节点 1：创建草稿 (对应业务状态：待提交) -->
          <div class="step-item" :class="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿' ? 'is-active' : 'is-done'">
            <div class="step-rail">
              <div class="step-dot">
                <el-icon v-if="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿'"><Document /></el-icon>
                <el-icon v-else><Check /></el-icon>
              </div>
              <div class="step-line"></div>
            </div>
            <div class="step-body">
              <div class="step-headline">
                <span class="step-name">1. 创建草稿</span>
                <span class="step-tag" :class="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿' ? 'tag-active' : 'tag-done'">待提交</span>
              </div>
              <div class="step-info">
                <span>操作人：{{ activeWorkflowRow.operator || '美区运营-Lucy' }}</span>
                <span class="sep">·</span>
                <span v-if="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿'">暂存草稿，业务状态为【待提交】</span>
                <span v-else>{{ activeWorkflowRow.createTime || '2026-09-22 09:30' }}</span>
              </div>
            </div>
          </div>

          <!-- 节点 2：提交审核 -->
          <div class="step-item" :class="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿' ? 'is-wait' : 'is-done'">
            <div class="step-rail">
              <div class="step-dot">
                <el-icon v-if="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿'"><Clock /></el-icon>
                <el-icon v-else><Check /></el-icon>
              </div>
              <div class="step-line"></div>
            </div>
            <div class="step-body">
              <div class="step-headline">
                <span class="step-name">2. 提交审核</span>
                <span v-if="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿'" class="step-tag tag-wait">待发起</span>
                <span v-else class="step-tag tag-done">已提交</span>
              </div>
              <div class="step-info">
                <span v-if="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿'">草稿暂存中，待操作人确认后发起审核</span>
                <template v-else>
                  <span>提交人：{{ activeWorkflowRow.operator || '美区运营-Lucy' }}</span>
                  <span class="sep">·</span>
                  <span>2026-09-22 10:15</span>
                </template>
              </div>
            </div>
          </div>

          <!-- 节点 3：责任人审核 -->
          <div class="step-item" :class="[
            activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿' ? 'is-wait' :
            (activeWorkflowRow.auditStatus === '待审核' || activeWorkflowRow.status === '待审核' ? 'is-active' :
            (activeWorkflowRow.auditStatus === '已驳回' ? 'is-reject' :
            (activeWorkflowRow.auditStatus === '审核不通过' ? 'is-disapprove' : 'is-done')))
          ]">
            <div class="step-rail">
              <div class="step-dot">
                <el-icon v-if="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿'"><Clock /></el-icon>
                <el-icon v-else-if="activeWorkflowRow.auditStatus === '待审核' || activeWorkflowRow.status === '待审核'"><Clock /></el-icon>
                <el-icon v-else-if="activeWorkflowRow.auditStatus === '已驳回'"><RefreshLeft /></el-icon>
                <el-icon v-else-if="activeWorkflowRow.auditStatus === '审核不通过'"><Close /></el-icon>
                <el-icon v-else><Check /></el-icon>
              </div>
              <div class="step-line"></div>
            </div>
            <div class="step-body">
              <div class="step-headline">
                <span class="step-name">3. 产品线审核</span>
                <span v-if="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿'" class="step-tag tag-wait">未触发</span>
                <span v-else-if="activeWorkflowRow.auditStatus === '待审核' || activeWorkflowRow.status === '待审核'" class="step-tag tag-active">待审核</span>
                <span v-else-if="activeWorkflowRow.auditStatus === '已驳回'" class="step-tag tag-reject">已驳回</span>
                <span v-else-if="activeWorkflowRow.auditStatus === '审核不通过'" class="step-tag tag-disapprove">不通过</span>
                <span v-else class="step-tag tag-done">已通过</span>
              </div>
              <div class="step-info">
                <span>审批人：{{ activeWorkflowRow.productLineLeader || '夏忠保' }}</span>
                <template v-if="activeWorkflowRow.auditStatus !== '待提交' && activeWorkflowRow.auditStatus !== '草稿' && activeWorkflowRow.auditStatus !== '待审核' && activeWorkflowRow.status !== '待审核'">
                  <span class="sep">·</span>
                  <span>2026-09-22 11:20</span>
                </template>
              </div>
              <!-- 驳回/不通过意见或附言 -->
              <div v-if="activeWorkflowRow.auditStatus === '已驳回'" class="step-note note-reject">
                <span class="note-k">驳回意见：</span>{{ activeWorkflowRow.auditRemark || 'BOM单套配比核对有误，请修改后重新提交' }}
              </div>
              <div v-else-if="activeWorkflowRow.auditStatus === '审核不通过'" class="step-note note-disapprove">
                <span class="note-k">原因：</span>{{ activeWorkflowRow.auditRemark || '材质参数未达标，不符合上架规范' }}
              </div>
              <div v-else-if="activeWorkflowRow.auditRemark && activeWorkflowRow.auditRemark !== '审核通过，准予生效备货'" class="step-note note-pass">
                <span class="note-k">附言：</span>{{ activeWorkflowRow.auditRemark }}
              </div>
            </div>
          </div>

          <!-- 节点 4：正式生效 (对应业务状态：已生效) -->
          <div class="step-item is-last" :class="[
            activeWorkflowRow.auditStatus === '审核通过' || activeWorkflowRow.status === '已生效' || (!activeWorkflowRow.auditStatus && activeWorkflowRow.status !== '待审核' && activeWorkflowRow.status !== '待提交') ? 'is-done' :
            (activeWorkflowRow.auditStatus === '已驳回' ? 'is-wait' :
            (activeWorkflowRow.auditStatus === '审核不通过' ? 'is-disapprove' : 'is-wait'))
          ]">
            <div class="step-rail">
              <div class="step-dot">
                <el-icon v-if="activeWorkflowRow.auditStatus === '审核通过' || activeWorkflowRow.status === '已生效' || (!activeWorkflowRow.auditStatus && activeWorkflowRow.status !== '待审核' && activeWorkflowRow.status !== '待提交')"><Check /></el-icon>
                <el-icon v-else-if="activeWorkflowRow.auditStatus === '审核不通过'"><Close /></el-icon>
                <el-icon v-else><Clock /></el-icon>
              </div>
            </div>
            <div class="step-body">
              <div class="step-headline">
                <span class="step-name">4. 正式生效</span>
                <span class="step-tag" :class="activeWorkflowRow.auditStatus === '审核通过' || activeWorkflowRow.status === '已生效' || (!activeWorkflowRow.auditStatus && activeWorkflowRow.status !== '待审核' && activeWorkflowRow.status !== '待提交') ? 'tag-done' : (activeWorkflowRow.auditStatus === '审核不通过' ? 'tag-disapprove' : 'tag-wait')">{{ activeWorkflowRow.auditStatus === '审核不通过' ? '未生效' : '已生效' }}</span>
              </div>
              <div class="step-info">
                <span v-if="activeWorkflowRow.auditStatus === '审核通过' || activeWorkflowRow.status === '已生效' || (!activeWorkflowRow.auditStatus && activeWorkflowRow.status !== '待审核' && activeWorkflowRow.status !== '待提交')">
                  正式编码：<code class="code-pill font-mono font-bold">{{ activeWorkflowRow.parentCode }}</code>，已同步启用，对应业务状态【已生效】
                </span>
                <span v-else-if="activeWorkflowRow.auditStatus === '审核不通过'">单据审核未通过，归档留存</span>
                <span v-else>审核通过后系统分配正式编码，进入【已生效】状态</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="workflowDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 8. 对话框：BOM 需求与齐套性试算计算器 -->
    <el-dialog
      v-model="calculatorDialogVisible"
      title="BOM 需求与齐套性试算模拟器"
      width="780px"
      destroy-on-close
      class="custom-dialog"
    >
      <div v-if="activeCalculatorRow" class="calc-container">
        <div class="calc-meta-card">
          <div class="meta-row">
            <div class="meta-item">
              <span class="label">组合编码：</span>
              <span class="val font-bold text-primary">{{ activeCalculatorRow.parentCode }}</span>
            </div>
            <div class="meta-item">
              <span class="label">组合品名：</span>
              <span class="val">{{ activeCalculatorRow.productName }}</span>
            </div>
            <div class="meta-item">
              <span class="label">组合类型：</span>
              <span class="type-badge" :class="getComboTypeBadgeClass(activeCalculatorRow.comboType)">
                {{ activeCalculatorRow.comboType }}
              </span>
            </div>
          </div>

          <div class="calc-input-row mt-3">
            <span class="calc-prompt">计划备货/发货成品套数：</span>
            <el-input-number 
              v-model="calcBatchSets" 
              :min="1" 
              :max="100000" 
              :step="50" 
              size="default" 
              style="width: 180px" 
            />
            <span class="unit-text">套</span>
            <div class="flex-spacer"></div>
            <el-button type="primary" plain size="small" icon="DocumentCopy" @click="handleCopyCalcResult">
              一键复制领料清单
            </el-button>
          </div>
        </div>

        <div class="calc-result-title mt-4">
          <el-icon><Tickets /></el-icon>
          <span>子部件理论需求清单 (需备齐以下全部子物料)：</span>
        </div>

        <el-table :data="calculatedChildrenList" border stripe size="small" class="mt-2">
          <el-table-column type="index" label="#" width="45" align="center" />
          <el-table-column label="子物料编码" prop="childCode" width="160">
            <template #default="{ row }">
              <span class="font-mono font-bold">{{ row.childCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="子物料品名" prop="childName" min-width="180" show-overflow-tooltip />
          <el-table-column label="单套配比" prop="ratio" width="100" align="center">
            <template #default="{ row }">
              <span>1 : {{ row.ratio }}</span>
            </template>
          </el-table-column>
          <el-table-column label="计算需求总量" width="140" align="center">
            <template #default="{ row }">
              <el-tag type="danger" effect="dark" size="small" class="font-bold font-mono">
                {{ row.requiredQty }} 件
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="包装规格说明" prop="childPackQty" width="110" align="center">
            <template #default="{ row }">
              <span class="text-xs text-gray-500">{{ row.childPackQty || '1pack' }}</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="calc-footer-summary mt-3">
          <el-icon class="mr-1 text-primary"><InfoFilled /></el-icon>
          <span>生产/出库 <b>{{ calcBatchSets }}</b> 套【{{ activeCalculatorRow.parentCode }}】，共计需领用 <b>{{ calculatedTotalParts }}</b> 个独立物理包裹/箱。</span>
        </div>
      </div>
    </el-dialog>

    <!-- 8.5. 对话框：【批量导入组合物料 (含BOM配置规范与全量预览核对)】 -->
    <el-dialog
      v-model="importDialogVisible"
      :title="importActiveStep === 1 ? '批量导入组合物料 (第 1 步：模板下载与上传文件)' : '批量导入组合物料 - 全量数据校验与预览 (第 2 步：核对无误后再提交)'"
      :width="importActiveStep === 1 ? '920px' : '1360px'"
      destroy-on-close
      class="import-modal-dialog"
      :close-on-click-modal="false"
    >
      <div class="import-dialog-body">
        <!-- 阶段指示器 Stepper -->
        <div class="custom-import-stepper mb-3">
          <div class="stepper-item" :class="{ 'is-active': importActiveStep === 1, 'is-done': importActiveStep > 1 }">
            <span class="step-badge-num">
              <el-icon v-if="importActiveStep > 1"><Check /></el-icon>
              <span v-else>1</span>
            </span>
            <div class="step-text-wrap">
              <div class="step-title">1. 模板下载与文件上传</div>
            </div>
          </div>
          <div class="stepper-arrow-divider">
            <el-icon><ArrowRight /></el-icon>
          </div>
          <div class="stepper-item" :class="{ 'is-active': importActiveStep === 2 }">
            <span class="step-badge-num">
              <span v-if="importActiveStep === 2" class="step-pulse-dot"></span>
              <span>2</span>
            </span>
            <div class="step-text-wrap">
              <div class="step-title">2. 全量数据校验与预览 (未入库)</div>
            </div>
          </div>
          <div class="stepper-arrow-divider">
            <el-icon><ArrowRight /></el-icon>
          </div>
          <div class="stepper-item is-pending">
            <span class="step-badge-num">3</span>
            <div class="step-text-wrap">
              <div class="step-title">3. 确认入库并流转</div>
            </div>
          </div>
        </div>

        <!-- 阶段 1：模板下载与文件上传 -->
        <div v-if="importActiveStep === 1" class="step1-container">
          <!-- 步骤 1：模板下载 -->
          <div class="import-step-card mb-3">
            <div class="step-card-header">
              <span class="step-badge">步骤 1</span>
              <span class="step-title">下载标准 Excel 导入模板</span>
            </div>

            <div class="template-box">
              <div class="template-left">
                <div class="excel-icon-pill">
                  <span class="excel-ext">XLSX</span>
                </div>
                <div class="template-meta">
                  <div class="template-main-title">
                    组合物料批量导入标准模板 (.xlsx)
                  </div>
                </div>
              </div>

              <div class="template-actions">
                <el-button type="primary" class="download-btn" size="small" @click="downloadImportTemplate">
                  <el-icon class="mr-1"><Download /></el-icon>
                  下载标准模板 (.xlsx)
                </el-button>
              </div>
            </div>
          </div>

          <!-- 步骤 2：上传并解析文件 -->
          <div class="import-step-card mb-3">
            <div class="step-card-header">
              <span class="step-badge">步骤 2</span>
              <span class="step-title">上传并解析 Excel 模板文件 (上传后将自动进入全量预览核对)</span>
            </div>

            <!-- 现代轻盈上传拖拽框 (支持拖拽与点击选择，附带解析遮罩防卡死) -->
            <div 
              class="upload-zone-wrapper" 
              v-loading="importParsingLoading" 
              element-loading-text="正在读取并解析 Excel 数据，构建 BOM 校验沙箱，请稍候..."
            >
              <el-upload
                ref="importUploadRef"
                drag
                action="#"
                accept=".xlsx,.xls,.csv"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleImportFileChange"
                class="combo-import-uploader"
              >
                <div class="upload-inner-content">
                  <div class="upload-icon-circle">
                    <el-icon><UploadFilled /></el-icon>
                  </div>
                  <div class="upload-main-text">
                    将填写好的 Excel (.xlsx / .xls) 模板文件拖拽到此处，或 <span class="upload-highlight">点击浏览本地文件</span>
                  </div>
                  <div class="upload-sub-tip">
                    支持标准 .xlsx / .xls / .csv 格式。上传后系统将先在内存中全量预览，核对无误前<b>绝不写入数据库</b>。
                  </div>
                </div>
              </el-upload>
            </div>
          </div>
        </div>

        <!-- 阶段 2：全量数据校验与预览核对工作台 (未入库) -->
        <div v-else class="step2-preview-container">
          <!-- 核对工作台控制栏 -->
          <div class="preview-toolbar-card mb-2.5">
            <div class="toolbar-left">
              <div class="metric-status-item">
                <span class="status-label">入库业务状态：</span>
                <el-radio-group v-model="importTargetStatus" size="small" class="preview-status-radios">
                  <el-radio-button value="待提交">
                    暂存草稿 (待提交)
                  </el-radio-button>
                  <el-radio-button value="待审核">
                    直接提交审批流 (待审核)
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>

            <div class="toolbar-right">
              <el-input 
                v-model="previewSearchKeyword" 
                placeholder="在预览中搜索品名/编码/子件..." 
                prefix-icon="Search" 
                size="small" 
                clearable 
                style="width: 230px;" 
              />
              <el-button size="small" @click="handleBackToUpload">
                <el-icon class="mr-1"><RefreshLeft /></el-icon>
                重新选择文件
              </el-button>
            </div>
          </div>

          <!-- 全量可展开预览数据表格 -->
          <div class="full-preview-table-box">
            <el-table 
              :data="filteredPreviewList" 
              border 
              size="small" 
              stripe
              max-height="520" 
              style="width: 100%"
              class="full-preview-table"
            >
              <!-- 序号与展开 -->
              <el-table-column type="expand" width="40" fixed="left">
                <template #default="{ row }">
                  <div class="expanded-bom-box">
                    <div class="bom-box-header">
                      <el-icon class="text-primary mr-1"><Box /></el-icon>
                      <span class="font-bold text-slate-800">【{{ row.productName }}】BOM 子物料构成明细清单 (共 {{ (row.children || []).length }} 个部件)：</span>
                      <span class="text-xs text-slate-400 ml-2">海外仓备货齐套依据</span>
                    </div>
                    <el-table :data="row.children || []" border size="small" stripe class="bom-sub-table mt-1.5">
                      <el-table-column type="index" label="#" width="40" align="center" />
                      <el-table-column label="子物料编码" prop="childCode" width="130">
                        <template #default="scope">
                          <span class="code-chip">{{ scope.row.childCode }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="单套配比" prop="ratio" width="85" align="center">
                        <template #default="scope">
                          <span class="ratio-chip">1 : {{ scope.row.ratio }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="产品名称" prop="childProductName" min-width="150" show-overflow-tooltip>
                        <template #default="scope">
                          <span class="font-medium text-slate-800">{{ scope.row.childProductName || scope.row.productName || row.productName }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="款式" prop="childStyle" width="95" show-overflow-tooltip>
                        <template #default="scope">
                          <span>{{ scope.row.childStyle || scope.row.style || row.style || '-' }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="主材料" prop="childMaterial" width="110" show-overflow-tooltip>
                        <template #default="scope">
                          <span>{{ scope.row.childMaterial || scope.row.material || row.material || '-' }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="适用品牌或机型" prop="applicableBrandOrModel" width="125" show-overflow-tooltip>
                        <template #default="scope">
                          <span class="text-xs text-slate-600">{{ scope.row.applicableBrandOrModel || scope.row.targetBrandOrAudience || scope.row.applicableModel || row.targetBrandOrAudience || '通用' }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="型号" prop="childModel" width="95" show-overflow-tooltip>
                        <template #default="scope">
                          <span class="font-mono text-xs">{{ scope.row.childModel || scope.row.model || row.model || '-' }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="公司品牌" prop="childBrand" width="90" align="center">
                        <template #default="scope">
                          <span class="text-xs text-slate-700 font-medium">{{ scope.row.childBrand || scope.row.brand || row.brand || '中性' }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="包装数量" prop="childPackQty" width="85" align="center">
                        <template #default="scope">
                          <span class="font-mono text-slate-600">{{ scope.row.childPackQty || scope.row.packQty || row.packQty || '1pack' }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="颜色" prop="childColor" width="85" align="center">
                        <template #default="scope">
                          <span v-if="scope.row.childColor || scope.row.color || row.color" class="color-text-cell">
                            <span class="color-dot"></span>
                            <span class="text-xs text-slate-700">{{ scope.row.childColor || scope.row.color || row.color }}</span>
                          </span>
                          <span v-else class="text-slate-400">-</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </template>
              </el-table-column>

              <el-table-column type="index" label="#" width="45" align="center" fixed="left" />

              <!-- 分组 1：BOM清单与组合关系 (核心) -->
              <el-table-column>
                <template #header>
                  <div class="group-header-pill">
                    <el-icon class="mr-1 text-slate-500"><Box /></el-icon>
                    <span>1. BOM清单与组合关系</span>
                  </div>
                </template>
                <el-table-column label="子物料编码" min-width="170">
                  <template #default="{ row }">
                    <div class="code-chips-wrap">
                      <span 
                        v-for="(code, cIdx) in (row.childCodes ? row.childCodes.split(';') : (row.children || []).map((c: any) => c.childCode))" 
                        :key="cIdx" 
                        class="code-chip"
                      >
                        {{ String(code).trim() }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="单套配比" width="95" align="center">
                  <template #default="{ row }">
                    <div class="ratio-chips-wrap">
                      <span 
                        v-for="(r, rIdx) in (row.ratios ? String(row.ratios).split(';') : (row.children || []).map((c: any) => c.ratio))" 
                        :key="rIdx" 
                        class="ratio-chip"
                      >
                        {{ String(r).trim() }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="组合类型" width="105" align="center">
                  <template #default="{ row }">
                    <span class="type-badge" :class="getComboTypeBadgeClass(row.comboType)">{{ row.comboType }}</span>
                  </template>
                </el-table-column>
              </el-table-column>

              <!-- 分组 2：同款属性 -->
              <el-table-column>
                <template #header>
                  <div class="group-header-pill">
                    <el-icon class="mr-1 text-slate-500"><Tickets /></el-icon>
                    <span>2. 同款属性</span>
                  </div>
                </template>
                <el-table-column label="销售平台" width="95" align="center">
                  <template #default="{ row }">
                    <span class="text-xs text-slate-700 font-medium">{{ row.salesPlatform || 'Amazon' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="运营大类" prop="category" width="120" show-overflow-tooltip />
                <el-table-column label="产品名称" prop="productName" min-width="170" show-overflow-tooltip>
                  <template #default="{ row }">
                    <span class="font-bold text-slate-800">{{ row.productName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="款式" prop="style" width="100" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.style || '-' }}</template>
                </el-table-column>
                <el-table-column label="主材料" prop="material" width="120" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.material || '-' }}</template>
                </el-table-column>
                <el-table-column label="适用品牌或对象" prop="targetBrandOrAudience" width="120" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.targetBrandOrAudience || '-' }}</template>
                </el-table-column>
                <el-table-column label="型号" prop="model" width="100" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.model || '-' }}</template>
                </el-table-column>
              </el-table-column>

              <!-- 分组 3：关键属性 -->
              <el-table-column>
                <template #header>
                  <div class="group-header-pill">
                    <el-icon class="mr-1 text-slate-500"><Key /></el-icon>
                    <span>3. 关键属性</span>
                  </div>
                </template>
                <el-table-column label="公司品牌" prop="brand" width="95" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.brand || '中性' }}</template>
                </el-table-column>
                <el-table-column label="图案" prop="pattern" width="85" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.pattern || '-' }}</template>
                </el-table-column>
                <el-table-column label="颜色" prop="color" width="85" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.color || '-' }}</template>
                </el-table-column>
                <el-table-column label="尺码" prop="size" width="85" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.size || '-' }}</template>
                </el-table-column>
                <el-table-column label="包装数量" prop="packQty" width="90" align="center">
                  <template #default="{ row }">
                    <span class="font-mono text-xs">{{ row.packQty || '1pack' }}</span>
                  </template>
                </el-table-column>
              </el-table-column>

              <!-- 分组 4：业务协同负责人 -->
              <el-table-column>
                <template #header>
                  <div class="group-header-pill">
                    <el-icon class="mr-1 text-slate-500"><User /></el-icon>
                    <span>4. 业务协同负责人</span>
                  </div>
                </template>
                <el-table-column label="产品经理" prop="productManager" width="115" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.productManager || '-' }}</template>
                </el-table-column>
                <el-table-column label="采购人员" prop="purchaser" width="115" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.purchaser || '-' }}</template>
                </el-table-column>
                <el-table-column label="运营人员" prop="operator" width="115" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.operator || '-' }}</template>
                </el-table-column>
                <el-table-column label="产品线负责人" width="115" align="center">
                  <template #default="{ row }">
                    <span class="inline-flex items-center text-xs text-slate-700 font-medium">
                      <el-icon class="mr-1 text-slate-400"><User /></el-icon>{{ resolveLeaderName(row.productLineLeader) }}
                    </span>
                  </template>
                </el-table-column>
              </el-table-column>

              <!-- 分组 5：一般属性与标签规范 -->
              <el-table-column>
                <template #header>
                  <div class="group-header-pill">
                    <el-icon class="mr-1 text-slate-500"><Document /></el-icon>
                    <span>5. 一般属性与标签规范</span>
                  </div>
                </template>
                <el-table-column label="节日标签" prop="holidayTag" width="95" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.holidayTag || '-' }}</template>
                </el-table-column>
                <el-table-column label="季节标签" prop="seasonTag" width="95" align="center">
                  <template #default="{ row }">
                    <span v-if="row.seasonTag && row.seasonTag !== '四季通用'" class="text-xs text-slate-700 font-medium">{{ row.seasonTag }}</span>
                    <span v-else class="text-xs text-slate-400">四季通用</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否CE类" prop="isCeCategory" width="85" align="center">
                  <template #default="{ row }">
                    <span :class="row.isCeCategory === '是' ? 'text-xs text-emerald-700 font-semibold' : 'text-xs text-slate-400'">{{ row.isCeCategory || '否' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否带电" prop="hasBattery" width="85" align="center">
                  <template #default="{ row }">
                    <span :class="row.hasBattery === '是' ? 'text-xs text-amber-700 font-semibold' : 'text-xs text-slate-400'">{{ row.hasBattery || '否' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="适用机型" prop="applicableModel" width="110" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.applicableModel || '-' }}</template>
                </el-table-column>
                <el-table-column label="材质明细" prop="materialDetail" width="130" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.materialDetail || '-' }}</template>
                </el-table-column>
                <el-table-column label="色号" prop="colorCode" width="95" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.colorCode || '-' }}</template>
                </el-table-column>
                <el-table-column label="规格" prop="spec" width="95" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.spec || '-' }}</template>
                </el-table-column>
                <el-table-column label="规格型号" prop="specModelDesc" width="120" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.specModelDesc || '-' }}</template>
                </el-table-column>
                <el-table-column label="入库标签短描述" prop="warehouseLabelDesc" min-width="130" show-overflow-tooltip>
                  <template #default="{ row }">{{ row.warehouseLabelDesc || '-' }}</template>
                </el-table-column>
              </el-table-column>

              <!-- 固定操作列 -->
              <el-table-column label="操作" width="70" align="center" fixed="right">
                <template #default="scope">
                  <el-button 
                    link 
                    type="danger" 
                    size="small" 
                    icon="Delete" 
                    @click="handleRemovePreviewItem(scope.$index)"
                  >
                    移出
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="import-dialog-footer">
          <div class="footer-left-tip">
            <template v-if="importActiveStep === 2">
              <div class="preview-footer-status-pill">
                <el-icon class="text-primary mr-1.5"><InfoFilled /></el-icon>
                <span class="pill-main">全量待核对：共 <b>{{ filteredPreviewList.length }}</b> 款组合物料（<b>{{ totalParsedChildCount }}</b> 项 BOM 子件）</span>
                <span class="pill-dot">·</span>
                <span class="pill-sub">支持点击行首箭头展开明细 · 确认提交前绝不改动主库</span>
              </div>
            </template>
          </div>
          <div class="footer-right-actions">
            <el-button @click="importDialogVisible = false">
              {{ importActiveStep === 2 ? '放弃并关闭' : '取消' }}
            </el-button>
            <el-button 
              v-if="importActiveStep === 2"
              type="primary" 
              class="confirm-import-btn"
              :disabled="!importPreviewList.length" 
              :loading="importLoading"
              @click="handleConfirmImport"
            >
              <el-icon class="mr-1"><Check /></el-icon>
              确认无误，提交入库 (共 {{ importPreviewList.length }} 款)
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 9. 抽屉：四大组合类型标准定义规范与业务指南 (全新高颜值规范看板) -->
    <el-drawer
      v-model="showTypeGuideDrawer"
      size="860px"
      direction="rtl"
      class="type-guide-drawer"
    >
      <template #header>
        <div class="guide-drawer-header">
          <span class="header-title">组合物料四大类型标准定义与作业规范</span>
        </div>
      </template>

      <div class="guide-drawer-content">
        <!-- 导语 Banner -->
        <div class="guide-banner-card">
          <div class="banner-badge-row">
            <div class="banner-title">
              <el-icon class="banner-icon"><Compass /></el-icon>
              <span>为什么必须严格规范定义组合类型？</span>
            </div>
            <span class="banner-sub-tag">供应链防错底线</span>
          </div>
          <p class="banner-desc">
            组合家具在供应链与海外仓履约中存在<b>「整箱发货」</b>、<b>「多箱齐套」</b>与<b>「混包组装」</b>等截然不同的物流作业逻辑。准确界定组合类型，是保障 ERP 需求计算、海外仓出库防错以及 BOM 结构齐套的根本依据。
          </p>
          <div class="banner-tracks">
            <div class="track-pill track-1">
              <span class="track-dot"></span>
              <span class="track-name">整箱原发</span>
              <span class="track-hint">零开箱 / 乘倍直发</span>
            </div>
            <div class="track-pill track-2">
              <span class="track-dot"></span>
              <span class="track-name">多箱齐套</span>
              <span class="track-hint">严格条码配全放行</span>
            </div>
            <div class="track-pill track-3">
              <span class="track-dot"></span>
              <span class="track-name">公用混包</span>
              <span class="track-hint">专用主件 + 跨款配件</span>
            </div>
          </div>
        </div>

        <!-- 3秒快速判定决策导航 -->
        <div class="decision-guide-card mt-4">
          <div class="sec-title-bar">
            <div class="sec-title">
              <el-icon class="sec-icon text-amber-500"><HelpFilled /></el-icon>
              <span>3秒快速判定指引 (如何正确选择类型？)</span>
            </div>
            <span class="sec-tip">点击卡片可快速定位并高亮对应类型规范 ↓</span>
          </div>

          <div class="decision-flow-grid mt-2">
            <!-- 1. 多件打包 -->
            <div 
              class="decision-node theme-slate" 
              @click="scrollToGuideType('多件打包')"
              title="点击查看「多件打包」标准定义规范"
            >
              <div class="node-header">
                <span class="node-step">判定 01</span>
                <span class="node-theme-tag">同款倍数</span>
              </div>
              <div class="node-q">① 仅 1 种物料，原箱翻倍卖？</div>
              <div class="node-arrow-bar">
                <span class="arrow-line"></span>
                <span class="arrow-text">判定为</span>
                <span class="arrow-line"></span>
              </div>
              <div class="node-res">
                <span class="res-badge">多件打包</span>
                <span class="res-formula">1物 × N</span>
              </div>
              <div class="node-footer">
                <span>查看规范详情 →</span>
              </div>
            </div>

            <!-- 2. 一物多包 -->
            <div 
              class="decision-node theme-amber" 
              @click="scrollToGuideType('一物多包')"
              title="点击查看「一物多包」标准定义规范"
            >
              <div class="node-header">
                <span class="node-step">判定 02</span>
                <span class="node-theme-tag">大件拆包</span>
              </div>
              <div class="node-q">② 单品超大超重，拆成 A/B/C 箱？</div>
              <div class="node-arrow-bar">
                <span class="arrow-line"></span>
                <span class="arrow-text">判定为</span>
                <span class="arrow-line"></span>
              </div>
              <div class="node-res">
                <span class="res-badge">一物多包</span>
                <span class="res-formula">A + B + C 箱</span>
              </div>
              <div class="node-footer">
                <span>查看规范详情 →</span>
              </div>
            </div>

            <!-- 3. 主附搭配 -->
            <div 
              class="decision-node theme-rose" 
              @click="scrollToGuideType('主附搭配')"
              title="点击查看「主附搭配」标准定义规范"
            >
              <div class="node-header">
                <span class="node-step">判定 03</span>
                <span class="node-theme-tag">公用配件</span>
              </div>
              <div class="node-q">③ 核心专用款 + 跨款通用配件？</div>
              <div class="node-arrow-bar">
                <span class="arrow-line"></span>
                <span class="arrow-text">判定为</span>
                <span class="arrow-line"></span>
              </div>
              <div class="node-res">
                <span class="res-badge">主附搭配</span>
                <span class="res-formula">主 + 附配件</span>
              </div>
              <div class="node-footer">
                <span>查看规范详情 →</span>
              </div>
            </div>

            <!-- 4. 成套组合 -->
            <div 
              class="decision-node theme-indigo" 
              @click="scrollToGuideType('成套组合')"
              title="点击查看「成套组合」标准定义规范"
            >
              <div class="node-header">
                <span class="node-step">判定 04</span>
                <span class="node-theme-tag">独立套系</span>
              </div>
              <div class="node-q">④ 多个独立单品，组合大套系？</div>
              <div class="node-arrow-bar">
                <span class="arrow-line"></span>
                <span class="arrow-text">判定为</span>
                <span class="arrow-line"></span>
              </div>
              <div class="node-res">
                <span class="res-badge">成套组合</span>
                <span class="res-formula">大套系 (场景化)</span>
              </div>
              <div class="node-footer">
                <span>查看规范详情 →</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 横向特征对比速查表 -->
        <div class="matrix-table-card mt-4">
          <div class="sec-title-bar">
            <div class="sec-title">
              <el-icon class="sec-icon text-blue-600"><DataAnalysis /></el-icon>
              <span>四大组合类型特征对比矩阵</span>
            </div>
            <span class="sec-tip">核心业务维度横向比对</span>
          </div>

          <div class="matrix-table-wrapper mt-2">
            <table class="guide-matrix-table">
              <thead>
                <tr>
                  <th width="125">组合类型</th>
                  <th width="145">子物料种类构成</th>
                  <th width="145">子物料独立可售?</th>
                  <th width="200">海外仓出库履约逻辑</th>
                  <th>关键防错与合规底线</th>
                </tr>
              </thead>
              <tbody>
                <tr class="row-hover">
                  <td>
                    <div class="matrix-type-cell">
                      <span class="type-badge badge-gray">多件打包</span>
                      <span class="cell-sub">Multi-Pack</span>
                    </div>
                  </td>
                  <td>
                    <div class="cell-strong">必须仅 1 种</div>
                    <div class="cell-sub">单套配比 N ≥ 2</div>
                  </td>
                  <td>
                    <span class="status-pill green">
                      <span class="dot"></span>
                      <b>是</b> (单件可单独售卖)
                    </span>
                  </td>
                  <td>
                    <div class="wh-cell">
                      <el-icon class="wh-icon text-slate-600"><Box /></el-icon>
                      <span>按箱规原箱乘倍发货，免拆包组装</span>
                    </div>
                  </td>
                  <td>
                    <div class="risk-cell text-slate-700">
                      配比必须大于1，禁止混挂其他物料
                    </div>
                  </td>
                </tr>

                <tr class="row-hover">
                  <td>
                    <div class="matrix-type-cell">
                      <span class="type-badge badge-warning">一物多包</span>
                      <span class="cell-sub">Multi-Box (A+B+C)</span>
                    </div>
                  </td>
                  <td>
                    <div class="cell-strong">多件 (A/B/C 分箱)</div>
                    <div class="cell-sub">均为该单品物理箱</div>
                  </td>
                  <td>
                    <span class="status-pill red">
                      <span class="dot"></span>
                      <b>否</b> (拆包即为残件不可用)
                    </span>
                  </td>
                  <td>
                    <div class="wh-cell">
                      <el-icon class="wh-icon text-amber-600"><Files /></el-icon>
                      <span>校验全套物理箱齐全方可放行</span>
                    </div>
                  </td>
                  <td>
                    <div class="risk-cell text-amber-800">
                      子物料为该单品分箱，全套缺一不可
                    </div>
                  </td>
                </tr>

                <tr class="row-hover">
                  <td>
                    <div class="matrix-type-cell">
                      <span class="type-badge badge-danger">主附搭配</span>
                      <span class="cell-sub">Main + Generic</span>
                    </div>
                  </td>
                  <td>
                    <div class="cell-strong">1 主体 + N 通用件</div>
                    <div class="cell-sub">配件跨款式共享</div>
                  </td>
                  <td>
                    <span class="status-pill purple">
                      <span class="dot"></span>
                      <b>主体是 / 配件公用</b>
                    </span>
                  </td>
                  <td>
                    <div class="wh-cell">
                      <el-icon class="wh-icon text-rose-600"><Connection /></el-icon>
                      <span>主体与公用配件合单贴标出库</span>
                    </div>
                  </td>
                  <td>
                    <div class="risk-cell text-rose-800">
                      配件跨款式通用，大幅提升备货柔性
                    </div>
                  </td>
                </tr>

                <tr class="row-hover">
                  <td>
                    <div class="matrix-type-cell">
                      <span class="type-badge badge-primary">成套组合</span>
                      <span class="cell-sub">Suite Set</span>
                    </div>
                  </td>
                  <td>
                    <div class="cell-strong">多个独立单品</div>
                    <div class="cell-sub">场景化大套系打包</div>
                  </td>
                  <td>
                    <span class="status-pill green">
                      <span class="dot"></span>
                      <b>是</b> (各子件均能单独销售)
                    </span>
                  </td>
                  <td>
                    <div class="wh-cell">
                      <el-icon class="wh-icon text-indigo-600"><Collection /></el-icon>
                      <span>多单品集结出库，客单价高</span>
                    </div>
                  </td>
                  <td>
                    <div class="risk-cell text-indigo-800">
                      必须全部为具备独立编码的完整现成品
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 四大类型深度解析卡片 -->
        <div class="type-detail-cards mt-5">
          <div class="sec-title-bar mb-3">
            <div class="sec-title">
              <el-icon class="sec-icon text-purple-600"><DocumentChecked /></el-icon>
              <span>标准定义深度解析与典型案例</span>
            </div>
            
            <!-- 快速切换 Tab -->
            <div class="type-nav-tabs">
              <button 
                class="tab-btn" 
                :class="{ active: activeGuideType === '全部' }"
                @click="activeGuideType = '全部'"
              >
                全部 4 类
              </button>
              <button 
                v-for="item in comboTypeGuideList" 
                :key="item.type"
                class="tab-btn"
                :class="[{ active: activeGuideType === item.type }, 'tab-' + item.themeClass]"
                @click="scrollToGuideType(item.type)"
              >
                {{ item.type }}
              </button>
            </div>
          </div>

          <!-- 卡片列表 -->
          <div 
            v-for="item in filteredComboTypeGuideList" 
            :key="item.type" 
            :id="'guide-card-' + item.type"
            class="enhanced-guide-card"
            :class="['theme-' + item.themeClass, { 'is-highlighted': highlightedCardType === item.type }]"
          >
            <!-- 卡片顶部 -->
            <div class="guide-card-top">
              <div class="card-title-cluster">
                <div class="card-icon-tag" :class="'icon-' + item.themeClass">
                  <el-icon><component :is="item.iconName" /></el-icon>
                </div>
                <span class="type-badge" :class="item.badgeClass">{{ item.type }}</span>
                <span class="en-name font-mono text-xs">{{ item.enName }}</span>
                <span class="formula-chip">{{ item.formulaBadge }}</span>
              </div>
              <div class="core-rule-tag" :class="'rule-' + item.themeClass">
                <el-icon class="mr-1 text-xs"><CircleCheck /></el-icon>
                <span>{{ item.coreRule }}</span>
              </div>
            </div>

            <!-- 卡片内容 -->
            <div class="guide-card-body">
              <!-- 业务本质 -->
              <div class="essence-callout">
                <div class="essence-label">
                  <el-icon class="mr-1"><InfoFilled /></el-icon>
                  <span>业务本质</span>
                </div>
                <div class="essence-text">{{ item.detailDesc }}</div>
              </div>

              <!-- 特征要点 -->
              <div class="feature-bullets mt-3">
                <div class="feature-title">关键作业特征：</div>
                <div class="bullet-list">
                  <div v-for="(feat, fIdx) in item.features" :key="fIdx" class="bullet-item">
                    <div class="bullet-check">
                      <el-icon><Check /></el-icon>
                    </div>
                    <span>{{ feat }}</span>
                  </div>
                </div>
              </div>

              <!-- 典型案例看板 -->
              <div class="example-ticket mt-3">
                <div class="example-ticket-header">
                  <div class="ticket-title">
                    <el-icon class="mr-1 text-primary"><ShoppingBag /></el-icon>
                    <span>ERP 典型实物案例映射</span>
                  </div>
                  <span class="ticket-sub">标准范例</span>
                </div>
                <div class="ticket-body">
                  <div class="example-desc-text">
                    <b>案例说明：</b>{{ item.example }}
                  </div>
                  <div class="example-sku-chips mt-2">
                    <div 
                      v-for="(sku, sIdx) in item.exampleSkuList" 
                      :key="sIdx" 
                      class="sku-chip"
                    >
                      <span class="sku-code font-mono">{{ sku.code }}</span>
                      <span class="sku-name">{{ sku.name }}</span>
                      <span class="sku-qty">{{ sku.qty }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 双栏规范对齐 -->
              <div class="guidelines-dual-grid mt-3">
                <div class="spec-card spec-bom">
                  <div class="spec-header">
                    <div class="spec-icon-box">
                      <el-icon><EditPen /></el-icon>
                    </div>
                    <span class="spec-title">BOM 维护规范</span>
                  </div>
                  <div class="spec-content">{{ item.bomRules }}</div>
                </div>

                <div class="spec-card spec-wh">
                  <div class="spec-header">
                    <div class="spec-icon-box">
                      <el-icon><Van /></el-icon>
                    </div>
                    <span class="spec-title">海外仓储出库控制</span>
                  </div>
                  <div class="spec-content">{{ item.whRule }}</div>
                </div>
              </div>

              <!-- 防错底线警示 -->
              <div class="risk-callout mt-2.5">
                <el-icon class="risk-icon"><WarningFilled /></el-icon>
                <span class="risk-text"><b>防错底线：</b>{{ item.riskWarning }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 常见混淆 FAQ -->
        <div class="guide-faq-card mt-4 mb-2">
          <div class="sec-title-bar">
            <div class="sec-title">
              <el-icon class="sec-icon text-teal-600"><QuestionFilled /></el-icon>
              <span>常见疑问与防混淆解答 (FAQ)</span>
            </div>
            <span class="sec-tip">避免选错类型导致海外仓退单</span>
          </div>

          <div class="faq-list mt-3">
            <div class="faq-item">
              <div class="faq-q-box">
                <span class="q-tag">Q1</span>
                <span class="faq-q">“一物多包” 与 “成套组合” 的核心判据是什么？</span>
              </div>
              <div class="faq-a">
                <b>黄金判据看子件能否独立使用：</b><br />
                • 若拆开后任何一个箱子都<b>无法作为完整家具独立使用</b>（如：沙发靠背箱、扶手五金箱），则必须选<b>【一物多包】</b>；<br />
                • 若每个子件本身就是一张<b>完整的床、边柜或独立椅子</b>，平时有独立品号且能单卖，在电商上拼成套系卖，则必须选<b>【成套组合】</b>。
              </div>
            </div>

            <div class="faq-item mt-3">
              <div class="faq-q-box">
                <span class="q-tag">Q2</span>
                <span class="faq-q">为什么主附搭配的通用配件不能直接做成“一物多包”？</span>
              </div>
              <div class="faq-a">
                通用配件（如公用洗手盆、通用五金配件包）会被多个不同款式的组合物料复用。若做成一物多包，配件就会与特定主体永久绑定，无法跨款式灵活调拨，造成大量死库。选用<b>【主附搭配】</b>才能最大化通用配件的备货柔性。
              </div>
            </div>

            <div class="faq-item mt-3">
              <div class="faq-q-box">
                <span class="q-tag">Q3</span>
                <span class="faq-q">“多件打包” 与一件代发如何高效协同出库？</span>
              </div>
              <div class="faq-a">
                多件打包（如餐椅 2 件装）要求供应商原厂包装时直接按销售包装入箱并贴好外箱标。海外仓出库时<b>严禁开箱分拣</b>，直接按原箱整件扫码贴面单出库，出库时效最高、破损率最低。
              </div>
            </div>
          </div>

          <!-- 30秒选型极简口诀 -->
          <div class="mnemonic-card mt-3">
            <div class="mnemonic-title">
              <el-icon class="mr-1 text-amber-500"><StarFilled /></el-icon>
              <span>30 秒业务极简选型口诀</span>
            </div>
            <div class="mnemonic-grid mt-2">
              <div class="m-pill">
                <span class="m-num">1</span>
                <span class="m-cond">数量翻倍原箱走</span>
                <span class="m-arrow">➔</span>
                <span class="m-type text-slate-700">【多件打包】</span>
              </div>
              <div class="m-pill">
                <span class="m-num">2</span>
                <span class="m-cond">单品超重拆多箱</span>
                <span class="m-arrow">➔</span>
                <span class="m-type text-amber-700">【一物多包】</span>
              </div>
              <div class="m-pill">
                <span class="m-num">3</span>
                <span class="m-cond">跨款复用配公件</span>
                <span class="m-arrow">➔</span>
                <span class="m-type text-rose-700">【主附搭配】</span>
              </div>
              <div class="m-pill">
                <span class="m-num">4</span>
                <span class="m-cond">独立现品拼大套</span>
                <span class="m-arrow">➔</span>
                <span class="m-type text-indigo-700">【成套组合】</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import {
  generateStyledComboTemplateExcel,
  exportComboListToExcel,
  parseComboExcelFile,
  COMBO_TEMPLATE_COLUMNS
} from '@/utils/combo-excel-template'
import {
  SALES_PLATFORMS,
  lookupProductLineLeader,
  type SalesPlatform
} from '@/data/product-line-library'
import {
  FURNITURE_COMBO_BOM_LIBRARY,
  FURNITURE_CHILD_MATERIALS,
  COMBO_TYPE_DEFINITIONS,
  type FurnitureComboBomItem,
  type ComboType
} from '@/data/furniture-bom-library'
import {
  dbFetchMaterialBindings,
  dbSaveMaterialBinding,
  dbDeleteMaterialBinding,
  dbBatchDeleteMaterialBindings,
  dbBatchImportMaterialBindings,
  type MaterialBindingRecord
} from '@/api/sku-kanban-backend'

// --- 子物料图片映射辅助 ---
const FURNITURE_IMG_MAP: Record<string, string> = {
  'IF260212': 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=120&auto=format&fit=crop&q=60',
  'IF260216': 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=120&auto=format&fit=crop&q=60',
  'IF260205': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=120&auto=format&fit=crop&q=60',
  'IF260207': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&auto=format&fit=crop&q=60',
  'IF260208': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=120&auto=format&fit=crop&q=60',
  'IF260215': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=120&auto=format&fit=crop&q=60',
  'IF250223': 'https://images.unsplash.com/photo-1503602642458-232111445657?w=120&auto=format&fit=crop&q=60',
  'IF260052': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=120&auto=format&fit=crop&q=60',
  'IF260196': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=120&auto=format&fit=crop&q=60',
  'XST36in': 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=120&auto=format&fit=crop&q=60'
}

const getChildMaterialImage = (childCode?: string) => {
  if (!childCode) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&auto=format&fit=crop&q=60'
  const key = Object.keys(FURNITURE_IMG_MAP).find(k => childCode.includes(k))
  return key ? FURNITURE_IMG_MAP[key] : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&auto=format&fit=crop&q=60'
}

// 组合物料/父物料主图解析辅助方法
const getParentMaterialImage = (row: any): string => {
  if (!row) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=160&auto=format&fit=crop&q=80'
  if (row.imageUrl) return row.imageUrl
  if (row.image) return row.image
  const children = row.boundChildren || row.children || []
  if (children.length > 0) {
    if (children[0].image) return children[0].image
    if (children[0].childCode) {
      return getChildMaterialImage(children[0].childCode)
    }
  }
  const typeMap: Record<string, string> = {
    '多件打包': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=160&auto=format&fit=crop&q=80',
    '一物多包': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=160&auto=format&fit=crop&q=80',
    '主附搭配': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=160&auto=format&fit=crop&q=80',
    '成套组合': 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=160&auto=format&fit=crop&q=80'
  }
  return typeMap[row.comboType] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=160&auto=format&fit=crop&q=80'
}

// --- 基础状态 ---
const loading = ref(false)
const saving = ref(false)
const comboList = ref<any[]>([])
const selectedRows = ref<any[]>([])
const mainTableRef = ref<any>(null)
const isAllExpanded = ref(false)
const currentSubmitter = ref('当前登录人 (产品开发部)')

// 当前登录用户与审批权限体系
export interface CurrentUserInfo {
  name: string
  role: 'admin' | 'line_leader'
  roleName: string
}

const userOptions: CurrentUserInfo[] = [
  { name: '夏忠保', role: 'line_leader', roleName: '软包床负责人' },
  { name: '李丹', role: 'line_leader', roleName: '厨房电器负责人' },
  { name: '王美艳', role: 'line_leader', roleName: 'Wayfair负责人' },
  { name: '系统管理员', role: 'admin', roleName: '超级管理员 (可审全量)' }
]

const currentUser = ref<CurrentUserInfo>(
  (() => {
    try {
      const saved = localStorage.getItem('COMBO_CURRENT_LOGIN_USER')
      if (saved) return JSON.parse(saved)
    } catch {}
    return userOptions[0]
  })()
)

const handleSwitchUser = (u: CurrentUserInfo) => {
  currentUser.value = u
  localStorage.setItem('COMBO_CURRENT_LOGIN_USER', JSON.stringify(u))
  ElMessage.success(`已切换当前登录身份：${u.name}（${u.roleName}）`)
}

// 负责人解析辅助方法：保证负责人始终为姓名字符串，兼容历史对象/JSON格式
const resolveLeaderName = (val: any): string => {
  if (!val) return '夏忠保'
  if (typeof val === 'string') {
    if (val.trim().startsWith('{')) {
      try {
        const obj = JSON.parse(val)
        return obj.leader || '夏忠保'
      } catch {
        return val
      }
    }
    return val
  }
  if (typeof val === 'object' && val !== null) {
    return val.leader || val.productLineLeader || '夏忠保'
  }
  return String(val)
}

// 筛选表单
const filterForm = reactive({
  parentCode: '',
  salesPlatform: '',
  keyword: '',
  comboType: '',
  childKeyword: '',
  status: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(20)

// --- 弹窗与向导状态 ---
const editDialogVisible = ref(false)
const isEditMode = ref(false)
const currentStep = ref(1)

// 审批流相关弹窗
const workflowDialogVisible = ref(false)
const activeWorkflowRow = ref<any>(null)

// 专门的审核处理弹窗状态
const auditModalVisible = ref(false)
const activeAuditRow = ref<any>(null)
const auditDecision = ref<'pass' | 'reject' | 'disapprove'>('pass')
const auditRemark = ref('')
const auditSubmitting = ref(false)

// 批量审核状态
const batchAuditModalVisible = ref(false)
const batchAuditTargetList = ref<any[]>([])
const batchAuditSkippedCount = ref(0)
const batchAuditSkippedLeaderCount = ref(0)
const batchAuditDecision = ref<'pass' | 'reject' | 'disapprove'>('pass')
const batchAuditRemark = ref('')
const batchAuditSubmitting = ref(false)

const applyAuditPreset = (phrase: string) => {
  batchAuditRemark.value = phrase
}

const batchAuditPresets = computed(() => {
  if (batchAuditDecision.value === 'pass') {
    return [
      '全部核对无误，准予生效备货',
      'BOM齐套完整，配比符合规范',
      '款式与品类规划一致，通过'
    ]
  } else if (batchAuditDecision.value === 'reject') {
    return [
      'BOM单套配比有误，请核实后重提',
      '子部件品名或款式描述不完整',
      '包装规格与箱数需进一步核查'
    ]
  } else {
    return [
      '不符合当前运营大类规划，不予通过',
      '材质参数未达标，终止审批'
    ]
  }
})

// 单个审核快捷短语
const applySingleAuditPreset = (phrase: string) => {
  auditRemark.value = phrase
}

const singleAuditPresets = computed(() => {
  if (auditDecision.value === 'pass') {
    return [
      '全部核对无误，准予生效备货',
      'BOM齐套完整，配比符合规范',
      '款式与品类规划一致，通过'
    ]
  } else if (auditDecision.value === 'reject') {
    return [
      'BOM单套配比有误，请核实后重提',
      '子部件品名或款式描述不完整',
      '包装规格与箱数需进一步核查'
    ]
  } else {
    return [
      '不符合当前运营大类规划，不予通过',
      '材质参数未达标，终止审批'
    ]
  }
})

// 判断是否允许编辑：待提交、草稿、已驳回，以及提交审核后审批人（责任人或管理员）可修改
const canEditRow = (row: any) => {
  const status = row.auditStatus || (row.status === '待审核' ? '待审核' : (row.status === '已启用' ? '审核通过' : '待提交'))
  if (status === '待提交' || status === '草稿' || status === '已驳回') {
    return true
  }
  if (status === '待审核') {
    // 提交审核后，审批责任人与系统管理员允许修改
    const isAdmin = currentUser.value.role === 'admin'
    const isLeader = currentUser.value.role === 'leader'
    const leader = resolveLeaderName(row.productLineLeader)
    return isAdmin || isLeader || leader === currentUser.value.name
  }
  return false
}

// 获取编辑禁用原因提示
const getEditDisabledTip = (row: any) => {
  const status = row.auditStatus || row.status
  if (status === '待审核') {
    const leader = resolveLeaderName(row.productLineLeader)
    return `当前单据处于【待审核】状态，仅审批责任人（${leader}）或系统管理员可修改`
  }
  if (status === '审核通过' || status === '已启用' || row.status === '已生效') {
    return '已审核通过的物料单据不可直接编辑'
  }
  if (status === '审核不通过') {
    return '审核不通过的物料单据已归档，不可编辑'
  }
  return '当前状态不可编辑'
}

// 判断单据是否可删除：待审核不可删除，只有待提交状态可以删除
const isRowDeletable = (row: any) => {
  const status = row.auditStatus || row.status
  return status === '待提交' || status === '草稿'
}

const isRowNonDeletable = (row: any) => {
  return !isRowDeletable(row)
}

const getDeleteDisabledTooltip = (row: any) => {
  const status = row.auditStatus || row.status
  if (status === '待审核') {
    return '【待审核】状态的组合物料不可删除，需等待审核完成或驳回'
  }
  return '只有【待提交】状态的组合物料可以删除'
}

// 打开审核操作弹窗 (权限校验：仅审批责任人与系统管理员可审核)
const handleOpenAuditModal = (row: any) => {
  const isAdmin = currentUser.value.role === 'admin'
  const leader = resolveLeaderName(row.productLineLeader)
  if (!isAdmin && leader !== currentUser.value.name) {
    ElMessageBox.alert(
      `组合物料【<b>${row.productName}</b>】的审批责任人为 <b class="text-primary">${leader}</b>。<br/><br/>` +
      `您当前的登录身份为：<b>${currentUser.value.name}</b>（${currentUser.value.roleName}）。<br/><br/>` +
      `<span class="text-amber-600 font-medium">权限限制：</span>审批人非当前登录人的单据不可操作；产品线负责人仅可审批本人负责的物料。<br/>` +
      `<span class="text-slate-500 text-xs">提示：系统管理员具备全量跨责任人审批权限，可切换为【系统管理员】身份操作。</span>`,
      '无审批权限',
      { dangerouslyUseHTMLString: true, type: 'warning' }
    )
    return
  }

  activeAuditRow.value = row
  auditDecision.value = 'pass'
  auditRemark.value = ''
  auditModalVisible.value = true
}

// 确认提交审核结果
const handleConfirmAuditModal = async () => {
  if (!activeAuditRow.value) return
  if (auditDecision.value !== 'pass' && !auditRemark.value.trim()) {
    ElMessage.warning(auditDecision.value === 'reject' ? '请填写驳回原因！' : '请填写不通过原因说明！')
    return
  }

  auditSubmitting.value = true
  try {
    if (auditDecision.value === 'pass') {
      await handlePassAudit(activeAuditRow.value, auditRemark.value)
    } else if (auditDecision.value === 'reject') {
      await handleRejectAudit(activeAuditRow.value, auditRemark.value)
    } else {
      await handleDisapproveAudit(activeAuditRow.value, auditRemark.value)
    }
    auditModalVisible.value = false
  } finally {
    auditSubmitting.value = false
  }
}

// 审批人在审核弹窗中直接进入编辑修改
const handleEditFromAuditModal = () => {
  if (!activeAuditRow.value) return
  const target = activeAuditRow.value
  auditModalVisible.value = false
  handleEdit(target)
}

// 四大模式选择卡片元数据
const comboModeCards = [
  {
    type: '多件打包' as ComboType,
    name: '多件打包 (1物*N)',
    tagClass: 'badge-gray',
    icon: 'CopyDocument',
    coreRule: '同款单品 · 原箱乘倍销售',
    shortDesc: '物料仅1种，如 2件装、4件装，出库直接按倍数发货。'
  },
  {
    type: '一物多包' as ComboType,
    name: '一物多包 (A+B+C)',
    tagClass: 'badge-warning',
    icon: 'Grid',
    coreRule: '大件拆包 · 缺一不可',
    shortDesc: '单品超大拆分为 A、B、C 箱，全套齐套才为完整成品。'
  },
  {
    type: '主附搭配' as ComboType,
    name: '主附搭配 (主+附)',
    tagClass: 'badge-danger',
    icon: 'Link',
    coreRule: '专用主体 + 通用配件',
    shortDesc: '核心专用主体配上通用零部件，不同款式可共用配件。'
  },
  {
    type: '成套组合' as ComboType,
    name: '成套组合 (套系)',
    tagClass: 'badge-primary',
    icon: 'Collection',
    coreRule: '独立单品 · 大套系销售',
    shortDesc: '多个原本能单独销售的家具凑成一套，各子件可单售。'
  }
]

// 完整表单对象
const formData = reactive({
  id: '',
  imageUrl: '',
  productImages: [] as string[],
  packageImages: [] as string[],
  auditStatus: '待提交',
  auditRemark: '',
  workflowNo: '',

  // 基本信息 - 同款属性
  salesPlatform: 'Amazon' as SalesPlatform | string,
  category: '软包床',
  productName: '',
  style: '',
  material: '',
  targetBrandOrAudience: '通用',
  model: '',

  // 基本信息 - 关键属性
  brand: '中性',
  pattern: '',
  color: '',
  size: '',
  packQty: '1pack',

  // 基本信息 - 一般属性
  holidayTag: '',
  seasonTag: '四季通用',
  hasBattery: '否',
  isCeCategory: '否',
  applicableModel: '',
  materialDetail: '',
  colorCode: '',
  spec: '标准款',

  // 基本信息 - 其他信息
  specModelDesc: '',
  warehouseLabelDesc: '',

  // 基本信息 - 负责人信息
  productManager: '张经理 (产品负责人)',
  purchaser: '采购A组-陈工',
  operator: '美区运营-Lucy',

  // 采购信息 - 采购信息
  productionCycle: 25 as number | string,
  moq: 100 as number | string,
  moqRemark: '',
  orderGroupType: '同款同色拼单',
  orderGroupMoq: 50 as number | string,
  orderGroupRemark: '',
  needSupplierLabel: '否',
  isOriginalBoxSupply: '是',

  // 采购信息 - 开票信息
  canInvoice: '能开专票(13%)',
  invoiceName: '',
  invoiceModel: '',
  customsMaterial: '',
  invoiceUnit: '套',

  // 采购信息 - 规格信息
  itemLength: 120 as number | string,
  itemWidth: 40 as number | string,
  itemHeight: 85 as number | string,
  netWeight: 28.5 as number | string,
  netWeightUnit: 'kg',
  pkgLength: 130 as number | string,
  pkgWidth: 48 as number | string,
  pkgHeight: 22 as number | string,
  grossWeight: 31.0 as number | string,
  grossWeightUnit: 'kg',

  // 采购信息 - 装箱信息
  isFullBoxDelivery: '是',
  isSuitableDirectShip: '是',
  boxGrossWeight: 31.0 as number | string,
  boxPcs: 1 as number | string,
  comboTotalGrossWeight: 31.0 as number | string,
  outerBoxLength: 130 as number | string,
  outerBoxWidth: 48 as number | string,
  outerBoxHeight: 22 as number | string,
  outerBoxVolume: (130 * 48 * 22).toString() as number | string,
  singleGrossWeight: 31.0 as number | string,

  // 关联子物料
  parentCode: '',
  comboType: '' as ComboType | '',
  status: '启用' as '启用' | '停产',
  children: [] as FurnitureComboBomItem[]
})

// --- 产品线负责人智能检索联动 (销售平台 + 运营大类) ---
const currentMatchedLeaderInfo = computed(() => {
  return lookupProductLineLeader(formData.category, formData.salesPlatform)
})

const onPlatformOrCategoryChange = () => {
  // 产品线负责人由 currentMatchedLeaderInfo 自动响应根据【销售平台 + 运营大类】计算
  // 保持产品经理与产品线负责人为两个独立角色，互不混淆
}

// --- 自动计算外箱体积 ---
const calcOuterBoxVolume = () => {
  const l = Number(formData.outerBoxLength) || 0
  const w = Number(formData.outerBoxWidth) || 0
  const h = Number(formData.outerBoxHeight) || 0
  if (l && w && h) {
    formData.outerBoxVolume = (l * w * h).toFixed(0)
  }
}

// --- BOM 自动推导引擎 ---
const derivedMetrics = computed(() => {
  const children = formData.children || []
  let totalPacks = 0
  let totalGrossWeight = 0
  let totalNetWeight = 0

  children.forEach(c => {
    const ratio = Number(c.ratio) || 1
    totalPacks += ratio
    totalNetWeight += ratio * 14.2
    totalGrossWeight += ratio * 15.5
  })

  const length = Number(formData.outerBoxLength) || 120
  const width = Number(formData.outerBoxWidth) || 50
  const height = Number(formData.outerBoxHeight) || 20
  const totalVolume = ((length * width * height) / 1000000).toFixed(3)

  return {
    totalPacks: `${totalPacks || 1}pack`,
    totalGrossWeight: totalGrossWeight ? totalGrossWeight.toFixed(1) : '31.0',
    totalNetWeight: totalNetWeight ? totalNetWeight.toFixed(1) : '28.5',
    totalVolume
  }
})

// 触发自动推导回填 (完整聚合 Step 1、Step 2、Step 3 全部属性)
const triggerAutoDerive = (force = false) => {
  if (!formData.children || !formData.children.length) return

  // 1. 父物料编码推导
  if (force || !formData.parentCode) {
    const codes = formData.children.map(c => c.childCode).filter(Boolean)
    if (codes.length === 1) {
      formData.parentCode = `${codes[0]}X${formData.children[0].ratio || 2}`
    } else if (codes.length > 1) {
      const secondPart = codes[1]?.length > 3 ? codes[1].slice(-3) : codes[1]
      formData.parentCode = `${codes[0]}+${secondPart}`
    } else {
      formData.parentCode = 'IF' + Date.now().toString().slice(-6)
    }
  }

  // 2. 产品名称推导
  if (force || !formData.productName || formData.productName.includes('组合') || formData.productName === '') {
    const names = formData.children.map(c => c.childName?.replace(/\(.*?\)/g, '')).filter(Boolean)
    const uniqueNames = Array.from(new Set(names))
    if (uniqueNames.length === 1) {
      formData.productName = formData.comboType ? `${uniqueNames[0]} (${formData.comboType})` : `${uniqueNames[0]} 组合套件`
    } else if (uniqueNames.length > 1) {
      formData.productName = `${uniqueNames.slice(0, 2).join('+')}组合套件`
    } else {
      formData.productName = '定制家具组合套件'
    }
  }

  // 3. 运营大类
  if (force || !formData.category) {
    formData.category = '家具/室内家具'
  }

  // 4. 款式推导
  if (force || !formData.style) {
    const styles = formData.children.map(c => c.childStyle).filter(Boolean)
    formData.style = Array.from(new Set(styles)).join('+') || 'AuraB01'
  }

  // 5. 主材质推导
  if (force || !formData.material) {
    const materials = formData.children.map(c => c.childMaterial).filter(Boolean)
    formData.material = Array.from(new Set(materials)).join('+') || '刨花板+MDF'
  }

  // 6. 适用品牌/对象
  if (force || !formData.targetBrandOrAudience) {
    const targets = formData.children.map(c => c.childTarget).filter(Boolean)
    formData.targetBrandOrAudience = targets[0] || '通用'
  }

  // 7. 型号
  if (force || !formData.model) {
    const models = formData.children.map(c => c.childModel).filter(Boolean)
    formData.model = Array.from(new Set(models)).join('+') || 'Aura-CB2026'
  }

  // 8. 公司品牌
  if (force || !formData.brand) {
    const brands = formData.children.map(c => c.childBrand).filter(Boolean)
    formData.brand = brands[0] || '中性'
  }

  // 9. 图案
  if (force || !formData.pattern) {
    const patterns = formData.children.map(c => c.childPattern).filter(Boolean)
    formData.pattern = Array.from(new Set(patterns)).join('+') || '拱门/木抽拼接'
  }

  // 10. 颜色
  if (force || !formData.color) {
    const colors = formData.children.map(c => c.childColor).filter(Boolean)
    formData.color = Array.from(new Set(colors)).join('+') || '原木色'
  }

  // 11. 包装数量
  formData.packQty = derivedMetrics.value.totalPacks

  // 12. 尺码与规格
  if (force || !formData.size) {
    formData.size = `${formData.itemLength || 120}*${formData.itemWidth || 48}*${formData.itemHeight || 85}cm`
  }

  // 13. 标签与描述信息
  if (force || !formData.specModelDesc) {
    formData.specModelDesc = formData.comboType ? `${formData.productName} [${formData.comboType}] - ${formData.style} ${formData.color} 套件` : `${formData.productName} - ${formData.style} ${formData.color} 套件`
  }
  if (force || !formData.warehouseLabelDesc) {
    formData.warehouseLabelDesc = `${formData.parentCode} | ${formData.productName} | ${formData.packQty} | 箱规:${formData.outerBoxLength || 130}*${formData.outerBoxWidth || 50}*${formData.outerBoxHeight || 28}cm`
  }

  // 14. 采购信息与开票信息 (Step 3)
  if (force || !formData.productionCycle) formData.productionCycle = 25
  if (force || !formData.moq) formData.moq = 100
  if (force || !formData.canInvoice) formData.canInvoice = '能开专票(13%)'
  if (force || !formData.invoiceName) {
    formData.invoiceName = formData.productName || '木制收纳柜家具组合套件'
  }
  if (force || !formData.invoiceModel) {
    formData.invoiceModel = formData.parentCode || 'COMBO-SET'
  }
  if (force || !formData.customsMaterial) {
    formData.customsMaterial = formData.material || '刨花板/中纤板(MDF)/五金配件'
  }
  if (force || !formData.orderGroupType) formData.orderGroupType = '同款同色拼单'
  if (force || !formData.orderGroupMoq) formData.orderGroupMoq = 50

  // 15. 单品与包装规格指标 (Step 3)
  formData.grossWeight = derivedMetrics.value.totalGrossWeight
  formData.netWeight = derivedMetrics.value.totalNetWeight
  formData.boxGrossWeight = derivedMetrics.value.totalGrossWeight
  formData.comboTotalGrossWeight = derivedMetrics.value.totalGrossWeight
  const totalRatio = formData.children.reduce((acc, c) => acc + (Number(c.ratio) || 1), 0) || 1
  formData.boxPcs = totalRatio
  formData.singleGrossWeight = (Number(derivedMetrics.value.totalGrossWeight) / totalRatio).toFixed(1)

  if (force || !formData.outerBoxLength) formData.outerBoxLength = 130
  if (force || !formData.outerBoxWidth) formData.outerBoxWidth = 50
  if (force || !formData.outerBoxHeight) formData.outerBoxHeight = 28
  calcOuterBoxVolume()

  // 16. 同步根据【销售平台 + 运营大类】检索产品线负责人
  onPlatformOrCategoryChange()
}

const forceReDerive = () => {
  formData.productName = ''
  formData.material = ''
  formData.style = ''
  formData.color = ''
  formData.invoiceName = ''
  formData.invoiceModel = ''
  formData.customsMaterial = ''
  formData.specModelDesc = ''
  formData.warehouseLabelDesc = ''
  triggerAutoDerive(true)
  ElMessage.success('已根据当前 BOM 子部件清单聚合更新第 2、3 步属性！')
}

const switchWizardStep = (step: number) => {
  if (step > 1 && !formData.comboType) {
    ElMessage.warning('请先选择组合业务模式（多件打包、一物多包、主附搭配或成套组合）！')
    return
  }
  if (step > 2) {
    if (!formData.productName) {
      ElMessage.warning('请核验并输入产品名称！')
      return
    }
    if (!formData.productManager) {
      ElMessage.warning('请选择产品经理（必填项）！')
      return
    }
    if (!formData.purchaser) {
      ElMessage.warning('请选择采购人员（必填项）！')
      return
    }
    if (!formData.operator) {
      ElMessage.warning('请选择运营人员（必填项）！')
      return
    }
  }
  triggerAutoDerive()
  currentStep.value = step
}

const onSelectComboType = (type: ComboType) => {
  formData.comboType = type
  triggerAutoDerive(true)
}

const healthAuditTip = computed(() => {
  if (!formData.children.length) return '提示：请至少添加 1 项 BOM 子部件'
  if (formData.comboType === '多件打包' && formData.children.length > 1) {
    return '提示：多件打包标准为 1 款单品原箱乘倍，目前配置了多款子物料'
  }
  if (formData.comboType === '一物多包' && formData.children.length < 2) {
    return '提示：一物多包通常由 2 个或以上的包裹拆箱组合'
  }
  return 'BOM 齐套性良好，各项属性与装箱指标均已自动联动校验！'
})

// 向导下一步验证
const nextWizardStep = () => {
  if (currentStep.value === 1) {
    if (!formData.comboType) {
      ElMessage.warning('请先选择组合业务模式（多件打包、一物多包、主附搭配或成套组合）！')
      return
    }
    if (!formData.parentCode) {
      ElMessage.warning('请输入或生成组合物料编码！')
      return
    }
    if (!formData.children.length) {
      ElMessage.warning('请至少添加 1 项 BOM 子部件！')
      return
    }
    for (const c of formData.children) {
      if (!c.childCode || !c.childName) {
        ElMessage.warning('请将所有子部件的编码和品名填写完整！')
        return
      }
    }
    triggerAutoDerive()
    currentStep.value = 2
  } else if (currentStep.value === 2) {
    if (!formData.productName) {
      ElMessage.warning('请核验并输入产品名称！')
      return
    }
    if (!formData.productManager) {
      ElMessage.warning('请选择产品经理（必填项）！')
      return
    }
    if (!formData.purchaser) {
      ElMessage.warning('请选择采购人员（必填项）！')
      return
    }
    if (!formData.operator) {
      ElMessage.warning('请选择运营人员（必填项）！')
      return
    }
    currentStep.value = 3
  }
}

// --- 物料多视角图片上传与预览机制 ---
const productFileInputRef = ref<HTMLInputElement | null>(null)
const packageFileInputRef = ref<HTMLInputElement | null>(null)
const previewImgVisible = ref(false)
const previewImgUrl = ref('')

const handlePreviewSingleImg = (url: string) => {
  previewImgUrl.value = url
  previewImgVisible.value = true
}

const triggerProductFileInput = () => {
  productFileInputRef.value?.click()
}

const triggerPackageFileInput = () => {
  packageFileInputRef.value?.click()
}

const handleProductFileSelect = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || !files.length) return
  processUploadedFiles(files, formData.productImages, 12, true)
  if (productFileInputRef.value) productFileInputRef.value.value = ''
}

const handlePackageFileSelect = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files || !files.length) return
  processUploadedFiles(files, formData.packageImages, 6, false)
  if (packageFileInputRef.value) packageFileInputRef.value.value = ''
}

const handleProductDrop = (e: DragEvent) => {
  const files = e.dataTransfer?.files
  if (!files || !files.length) return
  processUploadedFiles(files, formData.productImages, 12, true)
}

const handlePackageDrop = (e: DragEvent) => {
  const files = e.dataTransfer?.files
  if (!files || !files.length) return
  processUploadedFiles(files, formData.packageImages, 6, false)
}

const processUploadedFiles = (files: FileList, targetList: string[], maxCount: number, isProduct = false) => {
  let count = 0
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return
    if (targetList.length >= maxCount) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      if (dataUrl && targetList.length < maxCount) {
        targetList.push(dataUrl)
        if (isProduct && !formData.imageUrl) {
          formData.imageUrl = dataUrl
        }
      }
    }
    reader.readAsDataURL(file)
    count++
  })
  ElMessage.success(`成功载入 ${count} 张实拍图片！`)
}

const handleRemoveProductImage = (index: number) => {
  const removed = formData.productImages.splice(index, 1)
  if (formData.imageUrl === removed[0]) {
    formData.imageUrl = formData.productImages[0] || ''
  }
}

const handleRemovePackageImage = (index: number) => {
  formData.packageImages.splice(index, 1)
}

const handleClearProductImages = () => {
  formData.productImages = []
  formData.imageUrl = ''
}

// 预设多角度多视角产品实景图库
const PRODUCT_ANGLE_PRESETS = [
  'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=80'
]

// 预设箱规实拍图库
const PACKAGE_ANGLE_PRESETS = [
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80'
]

const handleInjectProductAnglePresets = () => {
  PRODUCT_ANGLE_PRESETS.forEach(url => {
    if (formData.productImages.length < 12 && !formData.productImages.includes(url)) {
      formData.productImages.push(url)
    }
  })
  if (!formData.imageUrl && formData.productImages.length > 0) {
    formData.imageUrl = formData.productImages[0]
  }
  ElMessage.success('已一键载入 5 张高品质多视角立体产品图（正视/侧视/内部结构等）！')
}

const handleInjectPackagePresets = () => {
  PACKAGE_ANGLE_PRESETS.forEach(url => {
    if (formData.packageImages.length < 6 && !formData.packageImages.includes(url)) {
      formData.packageImages.push(url)
    }
  })
  ElMessage.success('已一键载入 3 张包装装箱实拍图（箱规外形/侧唛标签/缓冲保护）！')
}

// 引用同款功能
const quoteDialogVisible = ref(false)
const quoteSearchKey = ref('')
const selectedQuoteRow = ref<any>(null)

const handleOpenQuoteDialog = () => {
  quoteSearchKey.value = ''
  quoteDialogVisible.value = true
}

const filteredQuoteList = computed(() => {
  let list = comboList.value
  if (quoteSearchKey.value) {
    const k = quoteSearchKey.value.trim().toLowerCase()
    list = list.filter(item => 
      item.parentCode.toLowerCase().includes(k) ||
      item.productName.toLowerCase().includes(k) ||
      (item.style && item.style.toLowerCase().includes(k)) ||
      (item.material && item.material.toLowerCase().includes(k))
    )
  }
  return list
})

const handleSelectQuoteRow = (row: any) => {
  selectedQuoteRow.value = row
}

const applyQuote = (row: any) => {
  formData.salesPlatform = row.salesPlatform || formData.salesPlatform
  formData.category = row.category || formData.category
  formData.productName = row.productName || formData.productName
  formData.style = row.style || formData.style
  formData.material = row.material || formData.material
  formData.color = row.color || formData.color
  formData.brand = row.brand || formData.brand
  formData.packQty = row.packQty || formData.packQty
  formData.comboType = (row.comboType || formData.comboType) as ComboType
  onPlatformOrCategoryChange()
  quoteDialogVisible.value = false
  ElMessage.success(`已引用物料 [${row.parentCode}] 的同款关键属性与销售平台！`)
}

// 试算模拟器
const calculatorDialogVisible = ref(false)
const activeCalculatorRow = ref<any>(null)
const calcBatchSets = ref(100)

// 规范指南抽屉
const showTypeGuideDrawer = ref(false)

// --- 数据统计 ---
const totalComboCount = computed(() => comboList.value.length)

const pendingAuditCount = computed(() => {
  return comboList.value.filter(item => item.auditStatus === '待审核' || item.status === '待审核').length
})

const statsByType = computed(() => {
  const map: Record<string, number> = {
    '多件打包': 0,
    '一物多包': 0,
    '主附搭配': 0,
    '成套组合': 0
  }
  comboList.value.forEach(item => {
    if (item.comboType && map[item.comboType] !== undefined) {
      map[item.comboType]++
    }
  })
  return map
})

// 筛选快捷点击
const handleFilterAll = () => {
  filterForm.comboType = ''
  filterForm.status = ''
}

const handleFilterPendingAudit = () => {
  filterForm.comboType = ''
  filterForm.status = '待审核'
}

// --- 表格过滤与分页 ---
const filteredTableData = computed(() => {
  let list = comboList.value

  if (filterForm.parentCode) {
    const k = filterForm.parentCode.trim().toLowerCase()
    list = list.filter(item => item.parentCode.toLowerCase().includes(k))
  }

  if (filterForm.salesPlatform) {
    list = list.filter(item => (item.salesPlatform || 'Amazon') === filterForm.salesPlatform)
  }

  if (filterForm.keyword) {
    const k = filterForm.keyword.trim().toLowerCase()
    list = list.filter(item => 
      (item.productName && item.productName.toLowerCase().includes(k)) ||
      (item.style && item.style.toLowerCase().includes(k)) ||
      (item.material && item.material.toLowerCase().includes(k)) ||
      (item.color && item.color.toLowerCase().includes(k))
    )
  }

  if (filterForm.comboType) {
    list = list.filter(item => item.comboType === filterForm.comboType)
  }

  if (filterForm.childKeyword) {
    const ck = filterForm.childKeyword.trim().toLowerCase()
    list = list.filter(item => 
      (item.boundChildren || []).some((c: any) => 
        c.childCode.toLowerCase().includes(ck) || 
        c.childName.toLowerCase().includes(ck)
      )
    )
  }

  if (filterForm.status) {
    if (filterForm.status === '待审核') {
      list = list.filter(item => item.auditStatus === '待审核' || item.status === '待审核')
    } else if (filterForm.status === '待提交') {
      list = list.filter(item => item.auditStatus === '待提交' || item.auditStatus === '草稿' || item.status === '草稿')
    } else if (filterForm.status === '审核通过') {
      list = list.filter(item => item.auditStatus === '审核通过' || item.auditStatus === '已启用' || item.status === '已生效' || (item.status === '已绑定' && (!item.auditStatus || item.auditStatus === '已启用')))
    } else if (filterForm.status === '已驳回') {
      list = list.filter(item => item.auditStatus === '已驳回')
    } else if (filterForm.status === '审核不通过') {
      list = list.filter(item => item.auditStatus === '审核不通过')
    } else {
      list = list.filter(item => item.status === filterForm.status || item.auditStatus === filterForm.status)
    }
  }

  return list
})

const pagedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredTableData.value.slice(start, start + pageSize.value).map(item => ({
    ...item,
    salesPlatform: item.salesPlatform || 'Amazon',
    category: item.category || '家具/室内家具',
    brand: item.brand || '中性',
    auditRemark: (item as any).auditRemark || '',
    packQty: item.packQty || (item.boundChildren?.length ? `${item.boundChildren.length}pack` : (item.children?.length ? `${item.children.length}pack` : '1pack')),
    children: item.boundChildren || item.children || []
  }))
})

// 表格行动态样式类名
const getTableRowClassName = () => ''

// 组合类型标准定义规范抽屉：分类状态与卡片联动
const activeGuideType = ref<string>('全部')
const highlightedCardType = ref<string>('')

const scrollToGuideType = (type: string) => {
  activeGuideType.value = '全部'
  highlightedCardType.value = type
  setTimeout(() => {
    const el = document.getElementById(`guide-card-${type}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 60)
  setTimeout(() => {
    highlightedCardType.value = ''
  }, 2400)
}

const comboTypeGuideList = computed(() => {
  return [
    {
      type: '多件打包',
      badgeClass: 'badge-gray',
      themeClass: 'slate',
      iconName: 'Box',
      enName: 'Multi-Pack (1 SKU × N)',
      formulaBadge: '1物 × N 倍数',
      stepNum: '01',
      stepQuestion: '仅 1 种物料，原箱翻倍卖？',
      shortDesc: COMBO_TYPE_DEFINITIONS['多件打包'].shortDesc,
      coreRule: COMBO_TYPE_DEFINITIONS['多件打包'].coreRule,
      detailDesc: COMBO_TYPE_DEFINITIONS['多件打包'].detailDesc,
      example: COMBO_TYPE_DEFINITIONS['多件打包'].example,
      exampleSkuList: [
        { code: 'IF250223', name: '吧椅 (深棕色)', qty: '× 2 箱 (原箱发货)' }
      ],
      features: [
        '子物料品种只有 1 种（单套配比 N ≥ 2）',
        '供应商原厂原箱打包，仓库出库时不拆箱、不分拣',
        '主要用于椅子、抱枕、餐垫等小件或易成双成对销售商品'
      ],
      bomRules: '仅关联 1 项子物料，配比必须大于 1（如 1:2 或 1:4），严禁混挂其他物料',
      whRule: '海外仓整箱原箱直发，无需二次拆箱或合包组装，外箱扫条码秒级出库',
      riskWarning: '严禁混挂第 2 种物料！防呆系统强制校验单套关联子物料种类 = 1。'
    },
    {
      type: '一物多包',
      badgeClass: 'badge-warning',
      themeClass: 'amber',
      iconName: 'Files',
      enName: 'Multi-Box Single Item (A+B+C)',
      formulaBadge: 'A + B + C 多箱齐套',
      stepNum: '02',
      stepQuestion: '单品超大超重，拆成 A/B/C 箱？',
      shortDesc: COMBO_TYPE_DEFINITIONS['一物多包'].shortDesc,
      coreRule: COMBO_TYPE_DEFINITIONS['一物多包'].coreRule,
      detailDesc: COMBO_TYPE_DEFINITIONS['一物多包'].detailDesc,
      example: COMBO_TYPE_DEFINITIONS['一物多包'].example,
      exampleSkuList: [
        { code: 'IF260052-A', name: '压缩沙发 (主体箱)', qty: '1 箱' },
        { code: 'IF260052-B', name: '压缩沙发 (扶手箱)', qty: '1 箱' },
        { code: 'IF260052-C', name: '压缩沙发 (五金配件箱)', qty: '1 箱' }
      ],
      features: [
        '本质为 1 件独立商品，因体积或重量超标被拆分为 A/B/C 多个物理箱',
        '子部件不能单独使用或对外销售，全套缺一不可',
        '各物理箱独立贴标（Box 1/3, Box 2/3, Box 3/3）'
      ],
      bomRules: '关联属于该商品的分箱子部件（如 沙发主体箱、扶手五金箱），单套配比均为 1:1',
      whRule: '海外仓出库必须严格校验全部箱号齐套方可放行，缺任一箱严禁出库',
      riskWarning: '分箱不可独立销售！严禁在缺少任意分箱的情况下先行出库，导致残套死货。'
    },
    {
      type: '主附搭配',
      badgeClass: 'badge-danger',
      themeClass: 'rose',
      iconName: 'Connection',
      enName: 'Main Body + Generic Parts',
      formulaBadge: '1 主体 + N 通用配件',
      stepNum: '03',
      stepQuestion: '专用主体款 + 跨款通用配件？',
      shortDesc: COMBO_TYPE_DEFINITIONS['主附搭配'].shortDesc,
      coreRule: COMBO_TYPE_DEFINITIONS['主附搭配'].coreRule,
      detailDesc: COMBO_TYPE_DEFINITIONS['主附搭配'].detailDesc,
      example: COMBO_TYPE_DEFINITIONS['主附搭配'].example,
      exampleSkuList: [
        { code: 'IF260196-G', name: '白色浴室主柜 (核心主体)', qty: '1 箱' },
        { code: 'XST36in-P', name: '标准陶瓷盆 (多款公用件)', qty: '1 箱' }
      ],
      features: [
        '专用核心主体（如柜体）搭配标准通用配件（如公用陶瓷盆、镜子、五金件）',
        '配件具有跨款式/跨系列的通用性，不同款式组合共用同款通用子物料',
        '有效降低配件库存冗余，提升备货柔性与资金周转率'
      ],
      bomRules: '必须明确 1 项核心主体物料与 1~N 项通用标准件，通用件支持复用于其他款式',
      whRule: '出库时将主体箱与通用配件箱从不同储位同时拣出并合并贴标出库',
      riskWarning: '配件必须具备通用属性！若为专属不可复用配件，应优先评估是否作为一物多包管理。'
    },
    {
      type: '成套组合',
      badgeClass: 'badge-primary',
      themeClass: 'indigo',
      iconName: 'Collection',
      enName: 'Furniture Suite / Set Collection',
      formulaBadge: '独立成品 · 场景化大套系',
      stepNum: '04',
      stepQuestion: '多个独立现成品，组合大套系？',
      shortDesc: COMBO_TYPE_DEFINITIONS['成套组合'].shortDesc,
      coreRule: COMBO_TYPE_DEFINITIONS['成套组合'].coreRule,
      detailDesc: COMBO_TYPE_DEFINITIONS['成套组合'].detailDesc,
      example: COMBO_TYPE_DEFINITIONS['成套组合'].example,
      exampleSkuList: [
        { code: 'IF260215', name: '实木电视主柜 (独立单品)', qty: '1 件' },
        { code: 'IF260207', name: '实木轻奢茶几 (独立单品)', qty: '1 件' },
        { code: 'IF260208', name: '多功能窗边斗柜 (独立单品)', qty: '1 件' }
      ],
      features: [
        '每个子件均为功能完整的独立家具单品，平时也可单独对外销售',
        '按设计风格、功能场景（客厅、卧房、餐厅）组合打包销售',
        '客单价高，整套搭配可提升店铺转化率与客单价'
      ],
      bomRules: '关联多个已具备独立物料编码与独立商品包装的独立成品，各子件配比按需设定',
      whRule: '多件独立单品集结发货，支持作为一个物流订单合并发货或分批配送',
      riskWarning: '严禁挂载无独立包装或半成品！所有子物料必须是可直接出库销售的完整成品。'
    }
  ]
})

const filteredComboTypeGuideList = computed(() => {
  if (activeGuideType.value === '全部') {
    return comboTypeGuideList.value
  }
  return comboTypeGuideList.value.filter(item => item.type === activeGuideType.value)
})

const loadData = async () => {
  loading.value = true
  try {
    const list = await dbFetchMaterialBindings()
    let dataList = list || []
    if (dataList.length === 0) {
      const defaultToImport = FURNITURE_COMBO_BOM_LIBRARY.slice(0, 35).map((item, index) => {
        let st = '审核通过'
        let wfNo = ''
        let remark = ''
        if (index === 0) {
          st = '待审核'
          wfNo = 'WF-MAT-20260922001'
        } else if (index === 1) {
          st = '待提交'
        } else if (index === 2) {
          st = '已驳回'
          wfNo = 'WF-MAT-20260921003'
          remark = 'BOM单套配比核对有误，建议核查后再重新提交'
        } else if (index === 3) {
          st = '审核不通过'
          wfNo = 'WF-MAT-20260920002'
          remark = '材质参数未达标，不符合上架规范'
        } else if (index === 4) {
          st = '待审核'
          wfNo = 'WF-MAT-20260922002'
        }
        return {
          parentCode: item.parentCode,
          sku: item.parentCode,
          productName: item.productName,
          style: item.style,
          material: item.material,
          brand: item.brand,
          color: item.color,
          packQty: item.packQty,
          comboType: item.comboType,
          tpWh: '万邑通',
          status: (st === '待审核' ? '待审核' : (st === '审核通过' ? '已生效' : '已绑定')) as any,
          auditStatus: st,
          auditRemark: remark,
          workflowNo: wfNo,
          productLineLeader: index === 4 ? '李丹' : '夏忠保',
          updateTime: new Date().toLocaleString(),
          boundChildren: item.children
        }
      })
      await dbBatchImportMaterialBindings(defaultToImport)
      comboList.value = await dbFetchMaterialBindings()
    } else {
      let modified = false
      dataList.forEach((item: any, idx: number) => {
        // 清洗负责人字段，防止历史数据或导入数据残留 JSON 字符串/对象
        if (item.productLineLeader) {
          const cleanLeader = resolveLeaderName(item.productLineLeader)
          if (cleanLeader !== item.productLineLeader) {
            item.productLineLeader = cleanLeader
            modified = true
          }
        }

        if (item.auditStatus === '草稿') {
          item.auditStatus = '待提交'
          modified = true
        }
        if (item.auditStatus === '已启用') {
          item.auditStatus = '审核通过'
          item.status = '已生效'
          modified = true
        }
        if (idx === 0) {
          if (item.auditStatus !== '待审核' || item.productLineLeader !== '夏忠保') {
            item.auditStatus = '待审核'
            item.productLineLeader = '夏忠保'
            item.workflowNo = item.workflowNo || 'WF-MAT-20260922001'
            modified = true
          }
        } else if (idx === 1 && !dataList.some((x: any) => x.auditStatus === '待提交')) {
          item.auditStatus = '待提交'
          modified = true
        } else if (idx === 2 && !dataList.some((x: any) => x.auditStatus === '已驳回')) {
          item.auditStatus = '已驳回'
          item.productLineLeader = '夏忠保'
          item.auditRemark = 'BOM配比核对有误，单套配比建议核实后重新提交'
          modified = true
        } else if (idx === 3 && !dataList.some((x: any) => x.auditStatus === '审核不通过')) {
          item.auditStatus = '审核不通过'
          item.auditRemark = '不符合品类规划与上架规范，审核不予通过'
          modified = true
        } else if (idx === 4) {
          if (item.auditStatus !== '待审核' || item.productLineLeader !== '李丹') {
            item.auditStatus = '待审核'
            item.productLineLeader = '李丹'
            item.workflowNo = item.workflowNo || 'WF-MAT-20260922002'
            modified = true
          }
        }
      })
      if (modified) {
        localStorage.setItem('SKU_KANBAN_BINDINGS_V2', JSON.stringify(dataList))
      }
      comboList.value = dataList
    }
  } catch (err: any) {
    ElMessage.error('加载组合物料数据失败: ' + err.message)
  } finally {
    loading.value = false
  }
}

const toggleExpandAll = () => {
  if (!mainTableRef.value) return
  isAllExpanded.value = !isAllExpanded.value
  pagedTableData.value.forEach(row => {
    mainTableRef.value.toggleRowExpansion(row, isAllExpanded.value)
  })
}

const handleCopy = (text: string, title: string) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success(`已复制${title} [${text}]`)
  }).catch(() => {
    ElMessage.info(`复制内容: ${text}`)
  })
}

const getComboTypeBadgeClass = (type?: string) => {
  switch (type) {
    case '多件打包': return 'badge-neutral badge-multi-pack'
    case '一物多包': return 'badge-neutral badge-multi-box'
    case '主附搭配': return 'badge-neutral badge-main-attach'
    case '成套组合': return 'badge-neutral badge-suite'
    default: return 'badge-neutral'
  }
}

const getComboTypeTip = (type?: string) => {
  if (!type) return ''
  const item = COMBO_TYPE_DEFINITIONS[type as ComboType]
  return item ? `${item.shortDesc}（${item.coreRule}）` : type
}

const getComboTypeRuleDesc = (type: ComboType) => {
  const item = COMBO_TYPE_DEFINITIONS[type]
  return item ? `${item.shortDesc} - ${item.coreRule}` : ''
}

const calculateTotalRatio = (children: FurnitureComboBomItem[]) => {
  return (children || []).reduce((acc, c) => acc + (Number(c.ratio) || 1), 0)
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  filterForm.parentCode = ''
  filterForm.salesPlatform = ''
  filterForm.keyword = ''
  filterForm.comboType = ''
  filterForm.childKeyword = ''
  filterForm.status = ''
  currentPage.value = 1
}

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 打开新建
const handleOpenCreateDialog = () => {
  isEditMode.value = false
  currentStep.value = 1

  formData.id = ''
  formData.imageUrl = ''
  formData.parentCode = '' // 物料编码由系统在审核通过后生成，此处新建时不预设
  formData.salesPlatform = 'Amazon'
  formData.category = '软包床'
  formData.productName = '拱形门边柜+边柜木抽组合套件'
  formData.comboType = '' as any
  formData.style = 'AuraB01'
  formData.material = '刨花板+MDF'
  formData.targetBrandOrAudience = '通用/客餐厅'
  formData.model = 'Aura-CB2026'
  formData.brand = '中性'
  formData.pattern = '拱门/木抽拼接'
  formData.color = '原木色'
  formData.size = '120*48*85cm'
  formData.packQty = '2pack'
  formData.holidayTag = '无'
  formData.seasonTag = '四季通用'
  formData.hasBattery = '否'
  formData.isCeCategory = '否'
  formData.applicableModel = 'Aura系列通用'
  formData.materialDetail = 'E1级环保刨花板+三聚氰胺贴面+静音滑轨'
  formData.colorCode = 'NAT-WOOD-01'
  formData.spec = '双件成套组合款'
  formData.specModelDesc = '拱形门边柜+边柜木抽两件套组合家具 (原木色/AuraB01款)'
  formData.warehouseLabelDesc = 'IF260212+216 | 拱形门边柜+边柜木抽组合 | 2pack | 130*50*28cm | 31kg'
  formData.productManager = '张经理 (产品经理)'
  formData.purchaser = '采购A组-陈工'
  formData.operator = '美区运营-Lucy'
  formData.productionCycle = 25
  formData.moq = 100
  formData.moqRemark = '单次起订100套，支持同系列拼柜'
  formData.orderGroupType = '同款同色拼单'
  formData.orderGroupMoq = 50
  formData.orderGroupRemark = '支持每50套混色拼单'
  formData.needSupplierLabel = '否'
  formData.isOriginalBoxSupply = '是'
  formData.canInvoice = '能开专票(13%)'
  formData.invoiceName = '木制收纳柜家具组合套件'
  formData.invoiceModel = 'IF260212+216'
  formData.customsMaterial = '刨花板/中纤板(MDF)/五金连接件'
  formData.invoiceUnit = '套'
  formData.itemLength = 120
  formData.itemWidth = 48
  formData.itemHeight = 85
  formData.netWeight = 28.5
  formData.netWeightUnit = 'kg'
  formData.pkgLength = 130
  formData.pkgWidth = 50
  formData.pkgHeight = 28
  formData.grossWeight = 31.0
  formData.grossWeightUnit = 'kg'
  formData.isFullBoxDelivery = '是'
  formData.isSuitableDirectShip = '是'
  formData.boxGrossWeight = 31.0
  formData.boxPcs = 2
  formData.comboTotalGrossWeight = 31.0
  formData.outerBoxLength = 130
  formData.outerBoxWidth = 50
  formData.outerBoxHeight = 28
  formData.outerBoxVolume = '182000'
  formData.singleGrossWeight = '15.5'
  formData.auditStatus = '待审核'
  formData.children = [
    {
      childCode: 'IF260212',
      childName: '拱形门边柜(原木色)',
      ratio: 1,
      childProductName: '边柜',
      childStyle: 'AuraB01',
      childMaterial: '刨花板+MDF',
      childTarget: '通用',
      childModel: '通用',
      childBrand: '中性',
      childPattern: '拱形门',
      childColor: '原木色',
      childPackQty: '1pack'
    },
    {
      childCode: 'IF260216',
      childName: '边柜木抽(原木色)',
      ratio: 1,
      childProductName: '边柜配件',
      childStyle: 'AuraB01',
      childMaterial: '刨花板+MDF',
      childTarget: '通用',
      childModel: '通用',
      childBrand: '中性',
      childPattern: '木抽',
      childColor: '原木色',
      childPackQty: '1pack'
    }
  ]
  triggerAutoDerive()
  editDialogVisible.value = true
}

const handleEdit = (row: any) => {
  if (!canEditRow(row)) {
    ElMessage.warning(getEditDisabledTip(row))
    return
  }
  isEditMode.value = true
  currentStep.value = 1

  formData.id = row.id || ''
  formData.parentCode = row.parentCode || ''
  formData.salesPlatform = row.salesPlatform || 'Amazon'
  formData.category = row.category || '家具/室内家具'
  formData.productName = row.productName || ''
  formData.comboType = (row.comboType || '成套组合') as ComboType
  formData.style = row.style || ''
  formData.material = row.material || ''
  formData.brand = row.brand || '中性'
  formData.color = row.color || ''
  formData.productManager = row.productManager || '张经理 (产品经理)'
  formData.operator = row.operator || '美区运营-Lucy'
  formData.purchaser = row.purchaser || '采购A组-陈工'
  formData.targetBrandOrAudience = row.targetBrandOrAudience || '通用'
  formData.model = row.model || ''
  formData.pattern = row.pattern || ''
  formData.size = row.size || ''
  formData.holidayTag = row.holidayTag || '无'
  formData.seasonTag = row.seasonTag || '四季通用'
  formData.isCeCategory = row.isCeCategory || '否'
  formData.hasBattery = row.hasBattery || '否'
  formData.applicableModel = row.applicableModel || ''
  formData.materialDetail = row.materialDetail || ''
  formData.colorCode = row.colorCode || ''
  formData.spec = row.spec || '标准款'
  formData.specModelDesc = row.specModelDesc || ''
  formData.warehouseLabelDesc = row.warehouseLabelDesc || ''
  formData.auditStatus = row.auditStatus || '待提交'
  ;(formData as any).auditRemark = row.auditRemark || ''
  formData.status = (row.status === '停产' ? '停产' : '启用')
  formData.children = (row.children || row.boundChildren || []).map((c: any) => ({ ...c }))
  onPlatformOrCategoryChange()

  editDialogVisible.value = true
}

const handleClone = (row: any) => {
  handleEdit(row)
  isEditMode.value = false
  formData.id = ''
  formData.parentCode = row.parentCode + '-COPY'
  formData.productName = row.productName + ' (副本)'
  formData.salesPlatform = row.salesPlatform || 'Amazon'
  formData.category = row.category || '家具/室内家具'
  formData.productManager = row.productManager || '张经理 (产品经理)'
  formData.operator = row.operator || '美区运营-Lucy'
  formData.purchaser = row.purchaser || '采购A组-陈工'
  formData.auditStatus = '待审核'
  onPlatformOrCategoryChange()
}

const handleAddChildRow = () => {
  formData.children.push({
    childCode: '',
    childName: '',
    ratio: 1,
    childProductName: '',
    childStyle: '',
    childMaterial: '',
    childTarget: '通用',
    childModel: '通用',
    childBrand: '中性',
    childPattern: '',
    childColor: '',
    childPackQty: '1pack'
  })
}

const handleRemoveChildRow = (index: number) => {
  if (formData.children.length <= 1) {
    ElMessage.warning('组合物料至少需要保留 1 项子物料！')
    return
  }
  formData.children.splice(index, 1)
  triggerAutoDerive()
}

const querySearchChildMaterial = (queryString: string, cb: any) => {
  const list = FURNITURE_CHILD_MATERIALS.map(item => ({
    value: `${item.childCode} - ${item.childName}`,
    raw: item
  }))
  const results = queryString
    ? list.filter(i => i.value.toLowerCase().includes(queryString.toLowerCase()))
    : list
  cb(results)
}

const onSelectChildMaterial = (row: FurnitureComboBomItem, selected: any) => {
  const item = selected.raw
  if (item) {
    row.childCode = item.childCode
    row.childName = item.childName
    row.childProductName = item.childProductName || item.childName || ''
    row.image = item.image || getChildMaterialImage(item.childCode)
    row.childStyle = item.childStyle || ''
    row.childMaterial = item.childMaterial || ''
    row.childTarget = item.childTarget || '通用'
    row.childModel = item.childModel || '通用'
    row.childBrand = item.childBrand || '中性'
    row.childPattern = item.childPattern || ''
    row.childColor = item.childColor || ''
    row.childPackQty = item.childPackQty || '1pack'
    triggerAutoDerive()
  }
}

const onChildCodeClear = (row: FurnitureComboBomItem) => {
  row.childCode = ''
  row.childName = ''
  row.childProductName = ''
  row.image = ''
  row.childStyle = ''
  row.childMaterial = ''
  row.childTarget = '通用'
  row.childModel = '-'
  row.childBrand = '中性'
  row.childPattern = ''
  row.childColor = ''
  row.childPackQty = '1pack'
  triggerAutoDerive()
}

const onChildCodeChange = (row: FurnitureComboBomItem) => {
  if (!row.childCode) {
    onChildCodeClear(row)
    return
  }
  const code = row.childCode.trim().toLowerCase()
  const found = FURNITURE_CHILD_MATERIALS.find(
    m => m.childCode.toLowerCase() === code || `${m.childCode} - ${m.childName}`.toLowerCase() === code
  )
  if (found) {
    row.childCode = found.childCode
    row.childName = found.childName
    row.childProductName = found.childProductName || found.childName || ''
    row.image = found.image || getChildMaterialImage(found.childCode)
    row.childStyle = found.childStyle || ''
    row.childMaterial = found.childMaterial || ''
    row.childTarget = found.childTarget || '通用'
    row.childModel = found.childModel || '通用'
    row.childBrand = found.childBrand || '中性'
    row.childPattern = found.childPattern || ''
    row.childColor = found.childColor || ''
    row.childPackQty = found.childPackQty || '1pack'
  }
  triggerAutoDerive()
}

// 保存提交 (关键：提交后推送审批流，物料编码审核通过后由系统生成)
const handleSaveCombo = async (isSubmit = false) => {
  if (!formData.comboType) {
    currentStep.value = 1
    ElMessage.warning('请先选择组合业务模式！')
    return
  }
  if (!formData.productName) {
    currentStep.value = 2
    ElMessage.warning('请填写产品名称！')
    return
  }
  if (!formData.productManager) {
    currentStep.value = 2
    ElMessage.warning('请选择产品经理（必填项）！')
    return
  }
  if (!formData.purchaser) {
    currentStep.value = 2
    ElMessage.warning('请选择采购人员（必填项）！')
    return
  }
  if (!formData.operator) {
    currentStep.value = 2
    ElMessage.warning('请选择运营人员（必填项）！')
    return
  }
  if (!formData.children || formData.children.length === 0) {
    currentStep.value = 1
    ElMessage.warning('请至少添加 1 项 BOM 子部件！')
    return
  }

  for (const c of formData.children) {
    if (!c.childCode) {
      currentStep.value = 1
      ElMessage.warning('请将所有子部件的物料编码填写完整！')
      return
    }
  }

  saving.value = true
  const workflowNo = 'WF-MAT-' + Date.now().toString().slice(-8)
  // 物料编码由系统在审核通过后正式生成；待审核期间内部使用流程单号作为唯一键
  const officialParentCode = formData.parentCode || workflowNo

  try {
    const saved = await dbSaveMaterialBinding({
      id: formData.id || undefined,
      parentCode: officialParentCode,
      sku: officialParentCode,
      salesPlatform: formData.salesPlatform || 'Amazon',
      category: formData.category || '家具/室内家具',
      productName: formData.productName,
      style: formData.style,
      material: formData.material,
      brand: formData.brand,
      color: formData.color,
      packQty: formData.packQty,
      comboType: formData.comboType,
      targetBrandOrAudience: formData.targetBrandOrAudience,
      model: formData.model,
      pattern: formData.pattern,
      size: formData.size,
      productManager: formData.productManager,
      purchaser: formData.purchaser,
      operator: formData.operator,
      holidayTag: formData.holidayTag,
      seasonTag: formData.seasonTag,
      isCeCategory: formData.isCeCategory,
      hasBattery: formData.hasBattery,
      applicableModel: formData.applicableModel,
      materialDetail: formData.materialDetail,
      colorCode: formData.colorCode,
      spec: formData.spec,
      specModelDesc: formData.specModelDesc,
      warehouseLabelDesc: formData.warehouseLabelDesc,
      tpWh: '万邑通',
      status: '已绑定',
      updateTime: new Date().toLocaleString(),
      boundChildren: formData.children
    })

    // 附加审核流扩展字段 (若原本单据为待审核，修改保存后维持待审核)
    const wasPendingAudit = isEditMode.value && (formData.auditStatus === '待审核')
    const targetStatus = wasPendingAudit ? '待审核' : (isSubmit ? '待审核' : '待提交')
    const matchedLineLeader = currentMatchedLeaderInfo.value.leader
    ;(saved as any).auditStatus = targetStatus
    ;(saved as any).workflowNo = workflowNo
    ;(saved as any).salesPlatform = formData.salesPlatform || 'Amazon'
    ;(saved as any).productLineLeader = matchedLineLeader
    ;(saved as any).productManager = formData.productManager
    ;(saved as any).purchaser = formData.purchaser
    ;(saved as any).operator = formData.operator
    ;(saved as any).holidayTag = formData.holidayTag
    ;(saved as any).seasonTag = formData.seasonTag
    ;(saved as any).isCeCategory = formData.isCeCategory
    ;(saved as any).hasBattery = formData.hasBattery
    ;(saved as any).applicableModel = formData.applicableModel
    ;(saved as any).materialDetail = formData.materialDetail
    ;(saved as any).colorCode = formData.colorCode
    ;(saved as any).spec = formData.spec
    ;(saved as any).specModelDesc = formData.specModelDesc
    ;(saved as any).warehouseLabelDesc = formData.warehouseLabelDesc

    // 同步到本地存储并刷新
    const currentList = await dbFetchMaterialBindings()
    const idx = currentList.findIndex(i => i.parentCode === officialParentCode || (formData.id && i.id === formData.id))
    if (idx > -1) {
      currentList[idx] = {
        ...currentList[idx],
        productName: formData.productName,
        style: formData.style,
        material: formData.material,
        brand: formData.brand,
        color: formData.color,
        comboType: formData.comboType,
        packQty: formData.packQty,
        boundChildren: formData.children,
        children: formData.children,
        auditStatus: targetStatus,
        workflowNo: currentList[idx].workflowNo || workflowNo,
        salesPlatform: formData.salesPlatform || 'Amazon',
        category: formData.category,
        productLineLeader: matchedLineLeader,
        productManager: formData.productManager,
        purchaser: formData.purchaser,
        operator: formData.operator,
        targetBrandOrAudience: formData.targetBrandOrAudience,
        model: formData.model,
        pattern: formData.pattern,
        size: formData.size,
        holidayTag: formData.holidayTag,
        seasonTag: formData.seasonTag,
        isCeCategory: formData.isCeCategory,
        hasBattery: formData.hasBattery,
        applicableModel: formData.applicableModel,
        materialDetail: formData.materialDetail,
        colorCode: formData.colorCode,
        spec: formData.spec,
        specModelDesc: formData.specModelDesc,
        warehouseLabelDesc: formData.warehouseLabelDesc,
        updateTime: new Date().toLocaleString()
      }
      localStorage.setItem('SKU_KANBAN_BINDINGS_V2', JSON.stringify(currentList))
    }

    editDialogVisible.value = false

    if (wasPendingAudit) {
      ElMessage.success(`审批人已成功更新待审核组合物料【${formData.productName}】资料！`)
    } else if (isSubmit) {
      ElMessageBox.alert(
        `组合物料申请已成功提交审核！<br/>` +
        `系统自动生成审批单号：<b class="text-primary font-mono">${workflowNo}</b><br/>` +
        `销售平台：<b class="text-blue-600 font-mono">${formData.salesPlatform || 'Amazon'}</b> ｜ 运营大类：<b class="text-blue-600">${formData.category}</b><br/>` +
        `根据【销售平台 + 运营大类】已检索产品线负责人：<b class="text-success font-bold">【${matchedLineLeader}】</b><br/>` +
        `产品经理：<b>${formData.productManager}</b> ｜ 运营人员：<b>${formData.operator}</b><br/>` +
        `<span class="text-warning font-medium">提示：物料编码将在产品线负责人审核通过后由系统统一自动生成。</span><br/>` +
        `单据已自动推送至产品线负责人 <b>【${matchedLineLeader}】</b> 待办审核队列！`,
        '提交并推送审核成功',
        { dangerouslyUseHTMLString: true, confirmButtonText: '查看审批进度', cancelButtonText: '好的', type: 'success' }
      ).then(() => {
        handleViewWorkflow({
          parentCode: officialParentCode,
          productName: formData.productName,
          salesPlatform: formData.salesPlatform || 'Amazon',
          category: formData.category,
          workflowNo: workflowNo,
          productLineLeader: matchedLineLeader,
          productManager: formData.productManager,
          operator: formData.operator,
          auditStatus: '待审核'
        })
      }).catch(() => {})
    } else {
      ElMessage.info(`组合物料申请已暂存为【待提交】状态！`)
    }

    await loadData()
  } catch (err: any) {
    ElMessage.error('保存失败: ' + err.message)
  } finally {
    saving.value = false
  }
}

// 查看审批流进度
const handleViewWorkflow = (row: any) => {
  activeWorkflowRow.value = row
  workflowDialogVisible.value = true
}

// 审核通过 (分配正式物料编码并生效，审核通过后不可删除)
const handlePassAudit = async (row: any, remark = '') => {
  const currentList = await dbFetchMaterialBindings()
  const idx = currentList.findIndex(i => (row.id && i.id === row.id) || i.parentCode === row.parentCode)
  let generatedCode = row.parentCode

  if (idx > -1) {
    const item = currentList[idx]
    if (!item.parentCode || item.parentCode.startsWith('WF-') || item.auditStatus === '待审核') {
      const children = item.boundChildren || item.children || []
      const codes = children.map((c: any) => c.childCode).filter(Boolean)
      if (codes.length === 1) {
        generatedCode = `${codes[0]}X${children[0]?.ratio || 2}`
      } else if (codes.length > 1) {
        const p2 = codes[1]?.length > 3 ? codes[1].slice(-3) : codes[1]
        generatedCode = `${codes[0]}+${p2}`
      } else {
        generatedCode = 'IF' + Date.now().toString().slice(-6)
      }
      item.parentCode = generatedCode
      item.sku = generatedCode
    }
    ;(item as any).auditStatus = '审核通过'
    ;(item as any).status = '已生效'
    ;(item as any).auditRemark = remark || '审核通过，准予生效备货'
    item.updateTime = new Date().toLocaleString()
    localStorage.setItem('SKU_KANBAN_BINDINGS_V2', JSON.stringify(currentList))
    ElMessage.success(`审核通过！系统已正式分配组合物料编码：[${generatedCode}]，正式生效！不可删除。`)
  } else {
    ElMessage.success(`组合物料审核通过，已正式生效！`)
  }

  workflowDialogVisible.value = false
  await loadData()
}

// 审核驳回修改 (驳回后状态为已驳回，允许操作员编辑重新提交)
const handleRejectAudit = async (row: any, remark = '') => {
  const currentList = await dbFetchMaterialBindings()
  const idx = currentList.findIndex(i => (row.id && i.id === row.id) || i.parentCode === row.parentCode)
  const finalRemark = remark || 'BOM配置及品名需进一步核对，请修改后重新提交'
  if (idx > -1) {
    (currentList[idx] as any).auditStatus = '已驳回'
    ;(currentList[idx] as any).auditRemark = finalRemark
    currentList[idx].updateTime = new Date().toLocaleString()
    localStorage.setItem('SKU_KANBAN_BINDINGS_V2', JSON.stringify(currentList))
  }
  ElMessage.warning(`组合物料 [${row.parentCode}] 已驳回！操作员可点击【编辑】修改后再次提交审核。`)
  workflowDialogVisible.value = false
  await loadData()
}

// 审核不通过 (审核不通过后不可删除，不可编辑)
const handleDisapproveAudit = async (row: any, remark = '') => {
  const currentList = await dbFetchMaterialBindings()
  const idx = currentList.findIndex(i => (row.id && i.id === row.id) || i.parentCode === row.parentCode)
  const finalRemark = remark || '不符合品类规划与上架规范，审核不予通过'
  if (idx > -1) {
    (currentList[idx] as any).auditStatus = '审核不通过'
    ;(currentList[idx] as any).auditRemark = finalRemark
    currentList[idx].updateTime = new Date().toLocaleString()
    localStorage.setItem('SKU_KANBAN_BINDINGS_V2', JSON.stringify(currentList))
  }
  ElMessage.error(`组合物料 [${row.parentCode}] 审核不通过！单据已归档且不可删除。`)
  workflowDialogVisible.value = false
  await loadData()
}

const handleDelete = async (row: any) => {
  if (isRowNonDeletable(row)) {
    const status = row.auditStatus || row.status || '已生效'
    if (status === '待审核') {
      ElMessage.warning(`组合物料 [${row.parentCode || row.productName}] 处于【待审核】状态，不可删除！`)
    } else {
      ElMessage.warning(`组合物料 [${row.parentCode || row.productName}] 处于【${status}】状态，只有【待提交】状态可以删除！`)
    }
    return
  }

  const confirm = await ElMessageBox.confirm(
    `确定要删除组合物料 [${row.parentCode}] 及其 BOM 关系吗？`,
    '删除确认',
    { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' }
  ).catch(() => false)

  if (!confirm) return

  try {
    await dbDeleteMaterialBinding(row.id || row.parentCode)
    ElMessage.success(`已删除组合物料 [${row.parentCode}]`)
    await loadData()
  } catch (err: any) {
    ElMessage.error('删除失败: ' + err.message)
  }
}

// 单条提交审核
const handleSingleSubmit = async (row: any) => {
  const confirm = await ElMessageBox.confirm(
    `确定要将组合物料【<b>${row.productName}</b>】提交审核吗？<br/>` +
    `<span class="text-slate-500 text-xs">提交后单据将自动流转至产品线负责人待办审核队列。</span>`,
    '提交审核确认',
    { dangerouslyUseHTMLString: true, confirmButtonText: '提交审核', cancelButtonText: '取消', type: 'info' }
  ).catch(() => false)

  if (!confirm) return

  try {
    const currentList = await dbFetchMaterialBindings()
    const idx = currentList.findIndex(i => (row.id && i.id === row.id) || i.parentCode === row.parentCode)
    if (idx > -1) {
      const item = currentList[idx]
      const uniqueSuffix = Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 5).toUpperCase()
      const wfNo = (item as any).workflowNo || ('WF-MAT-' + uniqueSuffix)
      const leaderRes = lookupProductLineLeader(item.category, item.salesPlatform)
      const cleanLeaderName = (leaderRes && typeof leaderRes === 'object') ? leaderRes.leader : (resolveLeaderName((item as any).productLineLeader) || '夏忠保')

      ;(item as any).workflowNo = wfNo
      if (!item.parentCode || item.parentCode.startsWith('DRAFT-')) {
        item.parentCode = wfNo
        item.sku = wfNo
      }
      ;(item as any).auditStatus = '待审核'
      ;(item as any).status = '待审核'
      ;(item as any).auditRemark = ''
      ;(item as any).productLineLeader = cleanLeaderName
      item.updateTime = new Date().toLocaleString()

      localStorage.setItem('SKU_KANBAN_BINDINGS_V2', JSON.stringify(currentList))
      ElMessage.success(`组合物料【${row.productName}】已成功提交审核！审批单号：${wfNo}`)
      await loadData()
    }
  } catch (err: any) {
    ElMessage.error('提交失败: ' + err.message)
  }
}

// 批量提交审核
const handleBatchSubmit = async () => {
  if (!selectedRows.value.length) {
    ElMessage.warning('请先勾选需要提交审核的组合物料！')
    return
  }

  // 筛选出待提交或已驳回的单据
  const submittableList = selectedRows.value.filter(r => {
    const st = r.auditStatus || r.status
    return st === '待提交' || st === '草稿' || st === '已驳回'
  })

  if (submittableList.length === 0) {
    ElMessageBox.alert(
      `选中的 ${selectedRows.value.length} 款组合物料中，没有处于【待提交】或【已驳回】状态的单据。<br/><br/>` +
      `<span class="text-slate-600 text-xs">说明：处于【待审核】状态的单据已在审批流中；处于【审核通过】或【审核不通过】的单据流程已办结。</span>`,
      '无待提交单据',
      { dangerouslyUseHTMLString: true, type: 'warning' }
    )
    return
  }

  const skippedCount = selectedRows.value.length - submittableList.length
  const confirm = await ElMessageBox.confirm(
    `确定要将选中的 <b class="text-primary">${submittableList.length}</b> 款组合物料批量提交审核吗？<br/>` +
    (skippedCount > 0 ? `<span class="text-gray-400 text-xs">（已自动跳过 ${skippedCount} 款处于审核中或已办结状态的物料）</span><br/>` : '') +
    `<span class="text-slate-600 text-xs mt-1 block">提交后系统将根据【销售平台 + 运营大类】自动生成审批单号并派发至各产品线负责人待办队列。</span>`,
    '批量提交审核确认',
    { dangerouslyUseHTMLString: true, confirmButtonText: '确定批量提交', cancelButtonText: '取消', type: 'info' }
  ).catch(() => false)

  if (!confirm) return

  try {
    const currentList = await dbFetchMaterialBindings()
    let successCount = 0

    submittableList.forEach(target => {
      const idx = currentList.findIndex(i => (target.id && i.id === target.id) || i.parentCode === target.parentCode)
      if (idx > -1) {
        const item = currentList[idx]
        const uniqueSuffix = Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 5).toUpperCase()
        const wfNo = (item as any).workflowNo || ('WF-MAT-' + uniqueSuffix)

        const leaderRes = lookupProductLineLeader(item.category, item.salesPlatform)
        const cleanLeaderName = (leaderRes && typeof leaderRes === 'object') ? leaderRes.leader : (resolveLeaderName((item as any).productLineLeader) || '夏忠保')

        ;(item as any).workflowNo = wfNo
        if (!item.parentCode || item.parentCode.startsWith('DRAFT-')) {
          item.parentCode = wfNo
          item.sku = wfNo
        }
        ;(item as any).auditStatus = '待审核'
        ;(item as any).status = '待审核'
        ;(item as any).auditRemark = ''
        ;(item as any).productLineLeader = cleanLeaderName
        item.updateTime = new Date().toLocaleString()
        successCount++
      }
    })

    localStorage.setItem('SKU_KANBAN_BINDINGS_V2', JSON.stringify(currentList))
    ElMessage.success({
      message: `成功批量提交 ${successCount} 款组合物料至产品线负责人审批队列！`,
      duration: 3500
    })
    selectedRows.value = []
    await loadData()
  } catch (err: any) {
    ElMessage.error('批量提交失败: ' + err.message)
  }
}

// 打开批量审核弹窗 (权限控制：需过滤审批人非当前登录人的数据，但系统管理员可全量操作)
const handleOpenBatchAuditModal = () => {
  if (!selectedRows.value.length) {
    ElMessage.warning('请先勾选需要审核的组合物料！')
    return
  }

  // 1. 过滤出待审核状态单据
  const pendingRows = selectedRows.value.filter(r => r.auditStatus === '待审核' || r.status === '待审核')
  const nonPendingCount = selectedRows.value.length - pendingRows.length

  if (pendingRows.length === 0) {
    ElMessageBox.alert(
      `选中的 ${selectedRows.value.length} 款组合物料中，没有处于【待审核】状态的单据。<br/><br/>` +
      `<span class="text-slate-600 text-xs">说明：批量审核仅支持对【待审核】状态的物料进行审批操作。</span>`,
      '无待审核单据',
      { dangerouslyUseHTMLString: true, type: 'warning' }
    )
    return
  }

  // 2. 审批人权限过滤：需过滤审批人非当前登录人的数据，但系统管理员可全量操作
  const isAdmin = currentUser.value.role === 'admin'
  let auditable = pendingRows
  let skippedLeaderCount = 0

  if (!isAdmin) {
    auditable = pendingRows.filter(r => resolveLeaderName(r.productLineLeader) === currentUser.value.name)
    skippedLeaderCount = pendingRows.length - auditable.length

    if (auditable.length === 0) {
      ElMessageBox.alert(
        `选中的 ${pendingRows.length} 款待审核单据中，审批人均为其他负责人（非当前登录人 <b>${currentUser.value.name}</b>）。<br/><br/>` +
        `<span class="text-amber-600 font-medium">权限控制：</span>批量审批需过滤审批人非当前登录人的数据；产品线负责人仅可审批本人负责的单据。<br/><br/>` +
        `<span class="text-slate-500 text-xs">提示：系统管理员具备全量跨责任人审批权限，可切换为【系统管理员】身份操作。</span>`,
        '无本人负责的待审核单据',
        { dangerouslyUseHTMLString: true, type: 'warning' }
      )
      return
    }
  }

  batchAuditTargetList.value = auditable
  batchAuditSkippedCount.value = nonPendingCount
  batchAuditSkippedLeaderCount.value = skippedLeaderCount
  batchAuditDecision.value = 'pass'
  batchAuditRemark.value = ''
  batchAuditModalVisible.value = true
}

// 确认执行批量审核
const handleConfirmBatchAudit = async () => {
  if (!batchAuditTargetList.value.length) return
  if (batchAuditDecision.value !== 'pass' && !batchAuditRemark.value.trim()) {
    ElMessage.warning(batchAuditDecision.value === 'reject' ? '请填写批量驳回原因！' : '请填写批量不通过原因说明！')
    return
  }

  batchAuditSubmitting.value = true
  try {
    const currentList = await dbFetchMaterialBindings()
    const decision = batchAuditDecision.value
    const remark = batchAuditRemark.value.trim()
    let processedCount = 0

    batchAuditTargetList.value.forEach(target => {
      const idx = currentList.findIndex(i => (target.id && i.id === target.id) || i.parentCode === target.parentCode)
      if (idx > -1) {
        const item = currentList[idx]
        if (decision === 'pass') {
          let generatedCode = item.parentCode
          if (!item.parentCode || item.parentCode.startsWith('WF-') || item.parentCode.startsWith('DRAFT-') || item.auditStatus === '待审核') {
            const children = item.boundChildren || item.children || []
            const codes = children.map((c: any) => c.childCode).filter(Boolean)
            if (codes.length === 1) {
              generatedCode = `${codes[0]}X${children[0]?.ratio || 2}`
            } else if (codes.length > 1) {
              const p2 = codes[1]?.length > 3 ? codes[1].slice(-3) : codes[1]
              generatedCode = `${codes[0]}+${p2}`
            } else {
              generatedCode = 'IF' + Date.now().toString().slice(-6)
            }
            item.parentCode = generatedCode
            item.sku = generatedCode
          }
          ;(item as any).auditStatus = '审核通过'
          ;(item as any).status = '已生效'
          ;(item as any).auditRemark = remark || '批量审核通过，准予生效备货'
        } else if (decision === 'reject') {
          ;(item as any).auditStatus = '已驳回'
          ;(item as any).status = '已驳回'
          ;(item as any).auditRemark = remark || 'BOM配置及品名需进一步核对，批量驳回修改'
        } else {
          ;(item as any).auditStatus = '审核不通过'
          ;(item as any).status = '审核不通过'
          ;(item as any).auditRemark = remark || '不符合品类规划与上架规范，审核不予通过'
        }
        item.updateTime = new Date().toLocaleString()
        processedCount++
      }
    })

    localStorage.setItem('SKU_KANBAN_BINDINGS_V2', JSON.stringify(currentList))
    const actionText = decision === 'pass' ? '审核通过并正式生效' : (decision === 'reject' ? '审核驳回' : '审核不通过')
    ElMessage.success(`成功批量${actionText} ${processedCount} 款组合物料！`)
    batchAuditModalVisible.value = false
    selectedRows.value = []
    await loadData()
  } catch (err: any) {
    ElMessage.error('批量审核处理失败: ' + err.message)
  } finally {
    batchAuditSubmitting.value = false
  }
}

const handleBatchDelete = async () => {
  if (!selectedRows.value.length) return
  const totalCount = selectedRows.value.length
  const nonDeletableList = selectedRows.value.filter(r => isRowNonDeletable(r))

  if (nonDeletableList.length > 0) {
    const hasPendingAudit = nonDeletableList.some(r => r.auditStatus === '待审核' || r.status === '待审核')
    ElMessageBox.alert(
      `选中的 ${totalCount} 款组合物料中，有 <b class="text-danger">${nonDeletableList.length}</b> 款不可删除。<br/><br/>` +
      `<span class="text-danger font-bold">规则限制：</span>${hasPendingAudit ? '【待审核】状态的单据不可删除！' : ''}<br/>` +
      `<b>系统只有【待提交】状态的组合物料可以删除。</b><br/>请取消勾选非待提交的物料后再执行批量删除。`,
      '存在不可删除的单据',
      { dangerouslyUseHTMLString: true, type: 'error' }
    )
    return
  }

  const confirm = await ElMessageBox.confirm(
    `确定要批量删除已勾选的 ${totalCount} 款组合物料吗？`,
    '批量删除确认',
    { confirmButtonText: '批量删除', cancelButtonText: '取消', type: 'warning' }
  ).catch(() => false)

  if (!confirm) return

  try {
    const ids = selectedRows.value.map(r => r.id || r.parentCode)
    await dbBatchDeleteMaterialBindings(ids)
    ElMessage.success(`成功批量删除 ${totalCount} 款组合物料！`)
    selectedRows.value = []
    await loadData()
  } catch (err: any) {
    ElMessage.error('批量删除失败: ' + err.message)
  }
}

// 试算模拟器
const handleOpenCalculator = (row: any) => {
  activeCalculatorRow.value = row
  calcBatchSets.value = 100
  calculatorDialogVisible.value = true
}

const calculatedChildrenList = computed(() => {
  if (!activeCalculatorRow.value) return []
  const children = activeCalculatorRow.value.boundChildren || activeCalculatorRow.value.children || []
  const sets = calcBatchSets.value || 0
  return children.map((c: any) => ({
    ...c,
    requiredQty: sets * (c.ratio || 1)
  }))
})

const calculatedTotalParts = computed(() => {
  return calculatedChildrenList.value.reduce((acc: number, c: any) => acc + c.requiredQty, 0)
})

const handleCopyCalcResult = () => {
  if (!activeCalculatorRow.value) return
  const row = activeCalculatorRow.value
  let text = `【领料与备货测算清单】\n`
  text += `组合物料：${row.parentCode} (${row.productName})\n`
  text += `组合类型：${row.comboType}\n`
  text += `计划成品套数：${calcBatchSets.value} 套\n`
  text += `--------------------------------------\n`
  calculatedChildrenList.value.forEach((c: any, idx: number) => {
    text += `${idx + 1}. 子物料: ${c.childCode} | ${c.childName} | 单套配比: 1:${c.ratio} | 需备料: ${c.requiredQty} 件\n`
  })
  text += `--------------------------------------\n`
  text += `合计物理件数总消耗: ${calculatedTotalParts.value} 件`

  handleCopy(text, '领料试算清单')
}

// --- 批量导入组合物料相关逻辑 ---
const importDialogVisible = ref(false)
const showTemplateSpec = ref(false)
const importLoading = ref(false)
const importParsingLoading = ref(false)
const importPreviewList = ref<any[]>([])
const importTargetStatus = ref<'待提交' | '待审核'>('待提交')
const importUploadRef = ref<any>(null)
const uploadedFileName = ref('')
const uploadedFileSize = ref('')

// 导入阶段管理：1 = 模板下载与上传文件；2 = 全量数据校验与预览 (未入库)
const importActiveStep = ref<1 | 2>(1)
const previewSearchKeyword = ref('')

const totalParsedChildCount = computed(() => {
  return importPreviewList.value.reduce((acc, item) => acc + (item.children?.length || 0), 0)
})

// 预览搜索筛选
const filteredPreviewList = computed(() => {
  if (!previewSearchKeyword.value.trim()) {
    return importPreviewList.value
  }
  const k = previewSearchKeyword.value.trim().toLowerCase()
  return importPreviewList.value.filter(item => {
    return (
      (item.productName && item.productName.toLowerCase().includes(k)) ||
      (item.category && item.category.toLowerCase().includes(k)) ||
      (item.style && item.style.toLowerCase().includes(k)) ||
      (item.children || []).some((c: any) => c.childCode?.toLowerCase().includes(k) || c.childName?.toLowerCase().includes(k))
    )
  })
})

const handleResetUpload = () => {
  importPreviewList.value = []
  uploadedFileName.value = ''
  uploadedFileSize.value = ''
  previewSearchKeyword.value = ''
}

// 打开导入弹窗，默认进入第 1 阶段（上传）
const handleOpenImportDialog = () => {
  handleResetUpload()
  importActiveStep.value = 1
  showTemplateSpec.value = false
  importTargetStatus.value = '待提交'
  importDialogVisible.value = true
}

// 返回第 1 阶段重新上传
const handleBackToUpload = () => {
  importActiveStep.value = 1
  handleResetUpload()
}

// 在预览阶段单条移出不符合要求的物料
const handleRemovePreviewItem = (index: number) => {
  importPreviewList.value.splice(index, 1)
  if (importPreviewList.value.length === 0) {
    ElMessage.warning('预览列表已无数据，已自动返回上传页面')
    importActiveStep.value = 1
  } else {
    ElMessage.info('已移出该条组合物料')
  }
}

// 下载标准 Excel 导入模板 (带精美配色、分组表头、必填标红与示范数据)
const downloadImportTemplate = async () => {
  try {
    const blob = await generateStyledComboTemplateExcel()
    const url = window.URL.createObjectURL(blob)
    const fileName = '组合物料标准导入模板_含BOM与必填规范_V2.2.xlsx'
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      try {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (_) {}
    }, 60000)
    ElMessage.success('【组合物料标准 Excel 导入模板】已成功下载！包含精美配色与字段填写规范说明，请填写后上传导入。')
  } catch (err: any) {
    ElMessage.error('生成 Excel 模板失败: ' + err.message)
  }
}

// 解析导入文件 (.xlsx / .xls / .csv)
const handleImportFileChange = async (file: any) => {
  const rawFile = file.raw
  if (!rawFile) return

  // 1. 严格防呆格式校验
  const fileName = file.name || ''
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  if (!['xlsx', 'xls', 'csv'].includes(ext)) {
    ElMessage.warning('仅支持上传 .xlsx、.xls 或 .csv 格式的标准 Excel 文件！')
    if (importUploadRef.value) {
      importUploadRef.value.clearFiles()
    }
    return
  }

  uploadedFileName.value = fileName || '已选模板数据.xlsx'
  uploadedFileSize.value = file.size ? `${(file.size / 1024).toFixed(1)} KB` : ''

  // 2. 开启解析加载动画遮罩，提示用户正在处理
  importParsingLoading.value = true

  // 3. 延迟 80ms 执行解析，确保 Windows 原生文件选择弹窗能够顺畅完成关闭动画，避免主线程互斥假死
  setTimeout(async () => {
    try {
      const arrayBuffer = await rawFile.arrayBuffer()
      const parsed = await parseComboExcelFile(arrayBuffer, importTargetStatus.value)
      importPreviewList.value = parsed
      // 成功解析后，自动流转至第 2 阶段（全量数据校验与预览，此时完全未写入数据库）
      importActiveStep.value = 2
      ElMessage.success(`Excel 文件解析成功！共识别到 ${parsed.length} 款组合物料，已进入全量预览核对阶段（尚未入库）。`)
    } catch (err: any) {
      ElMessage.error('Excel 文件解析失败: ' + err.message)
      handleResetUpload()
    } finally {
      importParsingLoading.value = false
      if (importUploadRef.value) {
        importUploadRef.value.clearFiles()
      }
    }
  }, 80)
}

// 确认批量导入并呈现完善的反馈报告
const handleConfirmImport = async () => {
  if (!importPreviewList.value.length) return
  importLoading.value = true
  try {
    const targetStatus = importTargetStatus.value
    const listToSave = importPreviewList.value.map(item => {
      const leaderRes = lookupProductLineLeader(item.category, item.salesPlatform)
      const cleanLeaderName = (leaderRes && typeof leaderRes === 'object') ? leaderRes.leader : (resolveLeaderName(item.productLineLeader) || '夏忠保')
      const lineName = (leaderRes && typeof leaderRes === 'object') ? leaderRes.productLineName : (item.category || '家具/室内家具')
      const uniqueSuffix = Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 5).toUpperCase()
      const wfNo = item.workflowNo || ('WF-MAT-' + uniqueSuffix)
      const draftCode = item.parentCode?.startsWith('DRAFT-') ? item.parentCode : ('DRAFT-' + uniqueSuffix)

      return {
        ...item,
        parentCode: targetStatus === '待审核' ? wfNo : draftCode,
        workflowNo: wfNo,
        productLineLeader: cleanLeaderName,
        productLineName: lineName,
        auditStatus: targetStatus,
        status: targetStatus === '待审核' ? '待审核' : '已绑定',
        updateTime: new Date().toLocaleString()
      }
    })

    await dbBatchImportMaterialBindings(listToSave)

    // 关闭导入工作台弹窗
    importDialogVisible.value = false
    handleResetUpload()
    await loadData()

    // 默认跳转到首屏展示数据
    currentPage.value = 1

    ElMessage.success({
      message: `批量导入成功！已成功录入 ${listToSave.length} 款组合物料。`,
      duration: 3500
    })
  } catch (err: any) {
    ElMessage.error('批量导入保存失败: ' + err.message)
  } finally {
    importLoading.value = false
  }
}

// 导出 BOM 清单 (标准多工作表 Excel 文件)
const handleExportExcel = async () => {
  const list = selectedRows.value.length ? selectedRows.value : filteredTableData.value
  if (!list.length) {
    ElMessage.warning('没有可导出的组合物料数据！')
    return
  }

  const isBatchSelected = selectedRows.value.length > 0
  const exportLoading = ElLoading.service({
    lock: true,
    text: `正在生成 ${list.length} 款组合物料的标准 BOM 清单 Excel 文件...`,
    background: 'rgba(0, 0, 0, 0.65)'
  })

  try {
    const blob = await exportComboListToExcel(list)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const fileName = isBatchSelected
      ? `组合物料BOM清单_已选${list.length}款_${dateStr}.xlsx`
      : `组合物料BOM全量清单_${list.length}款_${dateStr}.xlsx`

    // 安全可靠的浏览器下载处理（兼容各类 Chromium 内核浏览器）
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    link.download = fileName
    document.body.appendChild(link)
    link.click()

    // 核心防呆：异步延迟释放 ObjectURL，避免 Chrome 同步释放导致丢弃扩展名或以 UUID 命名
    setTimeout(() => {
      try {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (_) {}
    }, 60000)

    ElMessage.success({
      message: `BOM 清单导出成功！已生成标准 Excel 文件【${fileName}】（包含 BOM 穿透明细、物料汇总与批量导入三重视图）。`,
      duration: 4500
    })
  } catch (err: any) {
    ElMessage.error('导出 Excel 失败: ' + err.message)
  } finally {
    exportLoading.close()
  }
}

const handleExportCsv = handleExportExcel

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.combo-material-container {
  padding: 12px;
  background-color: #f0f2f5;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 顶部统计卡片 (专业企业级中性收敛设计) */
.stat-overview-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;

  @media (max-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-card {
    background: #ffffff;
    border-radius: 8px;
    padding: 10px 13px;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
    position: relative;
    overflow: hidden;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      border-color: #cbd5e1;
    }

    .stat-card-inner {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .stat-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;

      .type-badge {
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11.5px;
        font-weight: 500;
        line-height: 1.2;

        &.badge-neutral {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        &.badge-amber {
          background: #fffbeb;
          color: #b45309;
          border: 1px solid #fde68a;
        }
      }
    }

    .stat-icon-box {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all 0.2s;

      &.bg-neutral {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        color: #64748b;
      }

      &.bg-amber {
        background: #fffbeb;
        border: 1px solid #fde68a;
        color: #d97706;
      }
    }

    .stat-num-row {
      display: flex;
      align-items: baseline;
      gap: 3px;
      margin-bottom: 3px;

      .stat-num {
        font-size: 22px;
        font-weight: 700;
        line-height: 1.1;
        font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
        color: #0f172a;

        &.text-amber {
          color: #d97706;
        }
      }

      .unit {
        font-size: 11.5px;
        font-weight: 500;
        color: #94a3b8;
      }
    }

    .stat-desc-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;

      .stat-desc {
        font-size: 11px;
        color: #94a3b8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .active-indicator {
        flex-shrink: 0;
        font-size: 10px;
        font-weight: 600;
        padding: 0 4px;
        border-radius: 3px;
        line-height: 15px;
        background: #2563eb;
        color: #fff;
      }
    }

    /* 统一的沉稳激活态 */
    &.active {
      border-color: #2563eb;
      background: #f8faff;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);

      &.card-pending {
        border-color: #f59e0b;
        background: #fffdfa;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.08);

        .active-indicator {
          background: #d97706;
        }
      }
    }
  }
}

.query-card {
  background: #fff;
  padding: 12px 16px 4px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  .search-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .form-actions {
      margin-left: auto;
    }
  }
}

.ak-operate-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);

  .ak-operate-section {
    display: flex;
    align-items: center;
    gap: 8px;

    .danger-btn:not(:disabled):hover {
      color: #ef4444;
      border-color: #fca5a5;
      background: #fef2f2;
    }
  }
}

.table-card {
  background: #fff;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  flex: 1;
}

.table-img-cell {
  display: flex;
  align-items: center;
  justify-content: center;

  .combo-thumb-img,
  .bom-thumb-img {
    width: 38px;
    height: 38px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    background-color: #f8fafc;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
      transform: scale(1.08);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }
  }

  .img-fallback {
    width: 38px;
    height: 38px;
    border-radius: 4px;
    background: #f1f5f9;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    border: 1px dashed #cbd5e1;
  }
}

.code-copy-cell {
  display: flex;
  align-items: center;
  gap: 6px;

  .parent-code {
    color: #1e293b;
    font-size: 13px;
  }

  .child-code {
    color: #3b82f6;
    font-size: 12px;
  }

  .copy-icon {
    font-size: 14px;
    color: #94a3b8;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #3b82f6;
    }
  }
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 500;
  text-align: center;
  background-color: #f8fafc;
  color: #334155;
  border: 1px solid #e2e8f0;

  &.badge-neutral {
    background-color: #f8fafc;
    color: #475569;
    border: 1px solid #e2e8f0;
  }

  &.badge-amber {
    background-color: #fffbeb;
    color: #b45309;
    border: 1px solid #fde68a;
  }

  /* 表格内组合类型轻量点缀 */
  &.badge-multi-pack::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #64748b;
  }
  &.badge-multi-box::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #d97706;
  }
  &.badge-main-attach::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #0284c7;
  }
  &.badge-suite::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #6366f1;
  }
}

.color-text-cell {
  display: inline-flex;
  align-items: center;
  gap: 5px;

  .color-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #94a3b8;
    display: inline-block;
  }
}

.ratio-pill {
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 1px 6px;
  border-radius: 3px;
}

.audit-pulse-tag {
  font-weight: 600;
  animation: pulseWarning 2s infinite ease-in-out;
}

@keyframes pulseWarning {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

.bom-count-pill {
  display: inline-flex;
  align-items: baseline;
  gap: 3px;
  background: #f8fafc;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  .num {
    font-weight: 700;
    color: #2563eb;
    font-family: monospace;
  }

  .sub {
    font-size: 11px;
    color: #64748b;
  }
}

.expand-bom-wrapper {
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 6px;
  margin: 4px 0;
  border: 1px dashed #cbd5e1;

  .inner-bom-table {
    background: #fff;
  }
}

.pagination-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;

  .page-summary {
    font-size: 13px;
    color: #64748b;

    b {
      color: #1e293b;
    }
  }
}

/* ================================================================= */
/* 智能向导流弹窗 */
/* ================================================================= */
:deep(.wizard-modal-dialog) {
  border-radius: 10px;
  overflow: hidden;

  .el-dialog__header {
    margin-right: 0;
    padding: 12px 20px;
    border-bottom: 1px solid #eef0f3;
    background: #fff;

    .el-dialog__title {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
    }
  }

  .el-dialog__body {
    padding: 0;
    background: #f8fafc;
    max-height: 84vh;
    overflow-y: hidden;
  }

  .el-dialog__footer {
    display: none;
  }
}

.wizard-header-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;

  .steps-wrapper {
    display: flex;
    align-items: center;
    gap: 16px;

    .wizard-step-node {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.25s ease;

      .step-num {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #e2e8f0;
        color: #475569;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        transition: all 0.25s ease;
      }

      .step-meta {
        display: flex;
        flex-direction: column;

        .step-title {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .step-sub {
          font-size: 11px;
          color: #94a3b8;
        }
      }

      &.active {
        opacity: 1;

        .step-num {
          background: #2563eb;
          color: #fff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.18);
        }

        .step-title {
          color: #2563eb;
        }
      }

      &.done {
        opacity: 0.9;

        .step-num {
          background: #10b981;
          color: #fff;
        }
      }
    }

    .step-line {
      width: 40px;
      height: 2px;
      background: #e2e8f0;
      transition: all 0.25s ease;

      &.done {
        background: #10b981;
      }
    }
  }

  .workflow-hint-tag {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #475569;
    background: #fefce8;
    border: 1px solid #fef08a;
    padding: 4px 10px;
    border-radius: 20px;
  }
}

.wizard-workspace-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  height: calc(84vh - 65px);
  background: #f1f5f9;

  .wizard-left-pane {
    padding: 16px 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #f8fafc;
  }

  .wizard-right-preview-pane {
    background: #fff;
    border-left: 1px solid #e2e8f0;
    padding: 16px;
    overflow-y: auto;
  }
}

.pane-headline {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;

  .badge-step-dot {
    background: #eff6ff;
    color: #2563eb;
    border: 1px solid #bfdbfe;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .title {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
  }

  .desc {
    font-size: 12px;
    color: #64748b;
  }
}

.combo-mode-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  .mode-choice-card {
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px 14px;
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    flex-direction: column;
    gap: 4px;

    &:hover {
      border-color: #93c5fd;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    &.active {
      border-color: #2563eb;
      background: #eff6ff;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);

      .mode-name {
        color: #1d4ed8;
      }
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .mode-icon {
        font-size: 16px;
        color: #64748b;
      }
    }

    .mode-name {
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 2px;
    }

    .mode-core {
      font-size: 11px;
      font-weight: 600;
      color: #2563eb;
    }

    .mode-desc {
      font-size: 11px;
      color: #64748b;
      line-height: 1.4;
    }
  }
}

.sub-form-card {
  background: #fff;
  border-radius: 6px;
  padding: 12px 16px;
  border: 1px solid #eef2f6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);

  .card-bar-title {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
    position: relative;
    padding-left: 8px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 2px;
      bottom: 2px;
      width: 3px;
      background-color: #2563eb;
      border-radius: 1px;
    }

    .sub-hint {
      font-size: 11px;
      color: #94a3b8;
      font-weight: normal;
    }
  }
}

.flex-field {
  display: flex;
  align-items: center;
  gap: 8px;

  .field-label {
    font-size: 12px;
    color: #475569;
    white-space: nowrap;

    &.required::before {
      content: '* ';
      color: #ef4444;
    }
  }
}

.auto-derive-banner {
  background: linear-gradient(135deg, #eff6ff, #f0fdf4);
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .banner-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .magic-icon {
      font-size: 24px;
      color: #2563eb;
    }

    .banner-title {
      font-size: 13px;
      font-weight: 700;
      color: #1e3a8a;
    }

    .banner-sub {
      font-size: 12px;
      color: #3b82f6;

      b {
        color: #1d4ed8;
      }
    }
  }
}

.personnel-team-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 10px 14px 12px 14px;

  .personnel-title-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px dashed #e2e8f0;

    .p-title {
      font-size: 12px;
      font-weight: 600;
      color: #334155;
      display: flex;
      align-items: center;
    }

    .p-sub {
      font-size: 11px;
      color: #64748b;
    }
  }

  .personnel-inputs-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 14px;
  }
}

.general-attrs-section {
  padding-top: 4px;

  .general-attrs-title-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 6px;
    border-bottom: 1px dashed #e2e8f0;

    .g-title {
      font-size: 12px;
      font-weight: 600;
      color: #334155;
      display: inline-flex;
      align-items: center;
    }

    .g-sub {
      font-size: 11px;
      color: #94a3b8;
    }
  }
}

.form-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 14px;
  row-gap: 10px;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 14px;
  row-gap: 10px;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 14px;
  row-gap: 10px;
}

.form-item-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 12px;
    color: #475569;

    &.required::before {
      content: '* ';
      color: #ef4444;
    }
  }
}

.spec-dual-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  .spec-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px 16px;

    .spec-card-header {
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px dashed #e2e8f0;

      .title-with-badge {
        display: flex;
        align-items: center;
        gap: 8px;

        .spec-card-title {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .spec-badge {
          font-size: 11px;
          padding: 1px 6px;
          border-radius: 4px;
          background: #ecfdf5;
          color: #059669;

          &.blue {
            background: #eff6ff;
            color: #2563eb;
          }
        }
      }
    }

    .spec-card-body {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .spec-row-item {
        display: flex;
        align-items: center;
        gap: 10px;

        .field-label {
          font-size: 12px;
          color: #475569;
          white-space: nowrap;
          width: 80px;

          &.required::before {
            content: '* ';
            color: #ef4444;
            font-weight: bold;
          }
        }

        .dim-inputs-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 6px;

          .el-input {
            flex: 1;
          }

          .dim-sep {
            color: #94a3b8;
            font-weight: bold;
            font-size: 12px;
          }
        }

        .weight-input-wrap {
          width: 150px;
        }

        .unit-text {
          font-size: 11px;
          color: #64748b;
        }
      }
    }
  }
}

.packing-table-container {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;

  .packing-table-header-bar {
    background: #f1f5f9;
    padding: 8px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid #e2e8f0;

    .table-title {
      font-size: 12px;
      font-weight: 600;
      color: #334155;
    }

    .table-subtip {
      font-size: 11px;
      color: #64748b;
    }
  }

  .table-responsive-box {
    overflow-x: auto;
  }

  .packing-calc-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;

    th {
      background: #fafafa;
      color: #475569;
      font-weight: 600;
      padding: 8px 10px;
      border: 1px solid #e2e8f0;
      text-align: center;
    }

    td {
      padding: 8px 10px;
      border: 1px solid #e2e8f0;
      background: #fff;
      text-align: center;

      .table-lwh-box {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;

        .el-input {
          flex: 1;
          min-width: 48px;
        }

        .dim-sep {
          color: #94a3b8;
          font-weight: bold;
          font-size: 12px;
        }

        .unit-text {
          color: #64748b;
          font-size: 11px;
          white-space: nowrap;
        }
      }

      .unit-text {
        color: #64748b;
        font-size: 11px;
      }
    }
  }
}

.upload-dual-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  .upload-panel-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px 14px;

    .upload-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px dashed #e2e8f0;

      .header-left {
        display: flex;
        align-items: center;
        gap: 8px;

        .upload-title {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .upload-count-tag {
          font-size: 11px;
          padding: 1px 6px;
          border-radius: 4px;
          background: #e2e8f0;
          color: #475569;
          font-family: monospace;

          &.maxed {
            background: #fef2f2;
            color: #ef4444;
          }
        }
      }
    }

    .image-gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(78px, 1fr));
      gap: 10px;

      .img-card-item {
        position: relative;
        width: 78px;
        height: 78px;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #cbd5e1;
        background: #fff;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);

        &.is-primary {
          border: 2px solid #2563eb;
        }

        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .img-badge {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(37, 99, 235, 0.85);
          color: #fff;
          font-size: 10px;
          text-align: center;
          padding: 1px 0;
          font-weight: 600;

          &.gray {
            background: rgba(71, 85, 105, 0.85);
          }
        }

        .img-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          opacity: 0;
          transition: opacity 0.2s;

          .icon-btn {
            font-size: 16px;
            color: #fff;
            cursor: pointer;
            padding: 3px;
            border-radius: 4px;
            transition: transform 0.15s;

            &:hover {
              transform: scale(1.25);
              color: #60a5fa;
            }

            &.del:hover {
              color: #f87171;
            }
          }
        }

        &:hover .img-overlay {
          opacity: 1;
        }
      }

      .upload-trigger-card {
        width: 78px;
        height: 78px;
        border-radius: 6px;
        border: 1px dashed #94a3b8;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;

        .plus-icon {
          font-size: 18px;
          color: #64748b;
          margin-bottom: 2px;
        }

        .trigger-label {
          font-size: 10px;
          color: #334155;
          font-weight: 500;
          text-align: center;
        }

        .trigger-sub {
          font-size: 9px;
          color: #94a3b8;
          text-align: center;
        }

        &:hover {
          border-color: #2563eb;
          background: #eff6ff;

          .plus-icon {
            color: #2563eb;
          }
          .trigger-label {
            color: #2563eb;
          }
        }
      }
    }
  }
}

.hidden-file-input {
  display: none;
}

.preview-thumbs-strip {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 8px;
  overflow-x: auto;
  padding-bottom: 2px;

  .strip-item {
    width: 38px;
    height: 38px;
    border-radius: 4px;
    border: 1px solid #cbd5e1;
    overflow: hidden;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.15s;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &.active {
      border: 2px solid #2563eb;
      box-shadow: 0 0 0 1px #2563eb;
    }

    &:hover {
      transform: scale(1.08);
    }
  }

  .strip-more {
    font-size: 11px;
    color: #64748b;
    font-family: monospace;
    font-weight: 600;
    background: #e2e8f0;
    padding: 2px 6px;
    border-radius: 4px;
  }
}

.img-modal-preview-body {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 480px;
  overflow: hidden;

  .modal-large-img {
    max-width: 100%;
    max-height: 460px;
    object-fit: contain;
    border-radius: 6px;
  }
}

.upload-flex-row {
  display: flex;
  gap: 16px;

  .upload-block {
    flex: 1;

    .upload-sub-title {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 6px;
    }

    .upload-drop-zone {
      border: 1px dashed #cbd5e1;
      border-radius: 4px;
      background: #fbfcfe;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: #3b82f6;
        background: #f0f7ff;
      }

      .cloud-icon {
        font-size: 26px;
        color: #94a3b8;
      }

      .drop-text {
        font-size: 12px;
        color: #64748b;
        margin-top: 4px;

        .click-link {
          color: #2563eb;
          font-weight: 500;
        }
      }
    }
  }
}

.wizard-bottom-actions {
  display: flex;
  align-items: center;
  position: sticky;
  bottom: 0;
  background: #f8fafc;
  z-index: 20;
  padding: 12px 0 6px;
  border-top: 1px solid #e2e8f0;
  margin-top: auto;
  gap: 10px;

  .submit-deep-btn {
    background-color: #1d4ed8;
    border-color: #1d4ed8;
    font-weight: 700;

    &:hover {
      background-color: #1e40af;
      border-color: #1e40af;
    }
  }
}

/* 审批流预览与卡片 */
.preview-sticky-card {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .preview-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 8px;

    .title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
    }

    .sync-badge {
      font-size: 11px;
      background: #ecfdf5;
      color: #059669;
      padding: 2px 6px;
      border-radius: 10px;
      border: 1px solid #a7f3d0;
    }
  }

  .preview-hero-img-box {
    width: 100%;
    height: 130px;
    background: #f8fafc;
    border-radius: 6px;
    border: 1px dashed #cbd5e1;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .empty-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: #94a3b8;
      font-size: 12px;

      .el-icon {
        font-size: 26px;
      }
    }

    .type-pill {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    }
  }

  .preview-title-box {
    .parent-code-text {
      font-size: 15px;
      font-weight: 800;
      font-family: monospace;
      color: #1e293b;
    }

    .parent-code-pending-notice {
      display: inline-flex;
      align-items: center;
      font-size: 11px;
      color: #b45309;
      background: #fffbeb;
      border: 1px dashed #fcd34d;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 500;
    }

    .product-name-text {
      font-size: 13px;
      font-weight: 500;
      color: #64748b;
      margin-top: 2px;
    }
  }

  .aggregated-metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;

    .metric-item {
      background: #f8fafc;
      border: 1px solid #eef2f6;
      border-radius: 6px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;

      .m-label {
        font-size: 11px;
        color: #64748b;
      }

      .m-val {
        font-size: 16px;
        font-weight: 800;
        font-family: monospace;

        small {
          font-size: 11px;
          font-weight: normal;
          color: #94a3b8;
        }

        &.text-primary { color: #2563eb; }
        &.text-warning { color: #d97706; }
        &.text-indigo { color: #4f46e5; }
        &.text-danger { color: #e11d48; }
      }
    }
  }

  .bom-breakdown-box {
    border: 1px solid #f1f5f9;
    border-radius: 6px;
    padding: 8px 10px;
    background: #fafafa;

    .breakdown-title {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 700;
      color: #334155;
      margin-bottom: 6px;

      .ratio-sum {
        color: #2563eb;
        font-weight: 600;
      }
    }

    .breakdown-list {
      display: flex;
      flex-direction: column;
      gap: 5px;
      max-height: 140px;
      overflow-y: auto;

      .breakdown-item {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        padding: 5px 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .item-left {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow: hidden;

          .child-idx {
            font-size: 10px;
            color: #94a3b8;
            background: #f1f5f9;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .item-texts {
            display: flex;
            flex-direction: column;
            overflow: hidden;

            .child-c {
              font-size: 11px;
              color: #1e293b;
              font-weight: 700;
            }

            .child-n {
              font-size: 11px;
              color: #64748b;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 180px;
            }
          }
        }

        .ratio-tag {
          font-size: 11px;
          font-weight: 800;
          background: #eff6ff;
          color: #2563eb;
          padding: 2px 6px;
          border-radius: 4px;
        }
      }
    }
  }

  .workflow-preview-card {
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 6px;
    padding: 8px 10px;

    .wf-title {
      font-size: 11px;
      font-weight: 700;
      color: #334155;
      display: flex;
      align-items: center;
      margin-bottom: 6px;
    }

    .wf-nodes-list {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .wf-node {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: #475569;

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;

          &.done { background-color: #10b981; }
          &.pending { background-color: #f59e0b; }
          &.waiting { background-color: #cbd5e1; }
        }
      }

      .wf-route-hint {
        margin: 2px 0 2px 12px;
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        align-items: center;

        .route-tag {
          font-size: 10px;
          padding: 1px 5px;
          background: #e2e8f0;
          color: #334155;
          border-radius: 3px;
        }
        .route-line {
          font-size: 10px;
          color: #0284c7;
          font-weight: 600;
        }
      }
    }
  }

  .preview-health-tip {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 4px;
    padding: 8px 10px;
    font-size: 11px;
    color: #166534;
    line-height: 1.4;

    .tip-icon {
      font-size: 14px;
      color: #16a34a;
      flex-shrink: 0;
      margin-top: 1px;
    }
  }
}

/* 极简审批流程弹窗样式 */
.workflow-modal-body {
  padding: 4px 6px;

  /* 顶部紧凑卡片 */
  .wf-compact-header {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 14px;
    margin-bottom: 20px;

    .header-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      .title-and-code {
        display: flex;
        align-items: baseline;
        gap: 8px;
        min-width: 0;

        .product-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .parent-code {
          font-size: 12px;
          color: #2563eb;
          font-weight: 600;
          flex-shrink: 0;
        }
      }

      .status-pill {
        flex-shrink: 0;
        font-weight: 500;
      }
    }

    .header-meta-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
      font-size: 12px;
      color: #64748b;

      .meta-item {
        display: inline-flex;
        align-items: center;

        .meta-label {
          color: #94a3b8;
        }

        .meta-val {
          color: #475569;
        }
      }

      .meta-sep {
        color: #cbd5e1;
        font-size: 11px;
      }
    }
  }

  /* 垂直流程步骤条 */
  .wf-clean-steps {
    display: flex;
    flex-direction: column;
    padding: 4px 8px 10px 12px;

    .step-item {
      display: flex;
      position: relative;
      min-height: 56px;

      &.is-last {
        min-height: unset;
      }

      /* 导轨 & 图标圆圈 */
      .step-rail {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 12px;
        position: relative;
        flex-shrink: 0;
        padding-top: 3px;

        .step-dot {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          background: #ffffff;
          color: #94a3b8;
          border: 1.5px solid #cbd5e1;
          z-index: 2;
          transition: all 0.2s;
        }

        .step-line {
          width: 1.5px;
          flex: 1;
          background: #e2e8f0;
          margin-top: 3px;
          margin-bottom: 3px;
        }
      }

      /* 右侧内容 */
      .step-body {
        flex: 1;
        padding-bottom: 14px;

        .step-headline {
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 22px;

          .step-name {
            font-size: 13.5px;
            font-weight: 600;
            color: #1e293b;
          }

          .step-tag {
            font-size: 11px;
            font-weight: 500;
            padding: 1px 7px;
            border-radius: 4px;
            line-height: 16px;

            &.tag-done {
              background: #eff6ff;
              color: #2563eb;
              border: 1px solid #bfdbfe;
            }

            &.tag-active {
              background: #fffbeb;
              color: #b45309;
              border: 1px solid #fde68a;
            }

            &.tag-reject {
              background: #fff1f2;
              color: #e11d48;
              border: 1px solid #fecdd3;
            }

            &.tag-disapprove {
              background: #fef2f2;
              color: #dc2626;
              border: 1px solid #fecaca;
            }

            &.tag-wait {
              background: #f8fafc;
              color: #64748b;
              border: 1px solid #e2e8f0;
            }
          }
        }

        .step-info {
          font-size: 12px;
          color: #64748b;
          margin-top: 2px;
          display: flex;
          align-items: center;
          gap: 6px;

          .sep {
            color: #cbd5e1;
          }

          .code-pill {
            background: #eff6ff;
            color: #2563eb;
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 11.5px;
          }
        }

        /* 审核附言/意见框 */
        .step-note {
          margin-top: 6px;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12px;
          line-height: 1.5;

          .note-k {
            font-weight: 600;
          }

          &.note-reject {
            background: #fff1f2;
            border: 1px solid #fecdd3;
            color: #9f1239;
          }

          &.note-disapprove {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
          }

          &.note-pass {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1e40af;
          }
        }
      }

      /* 节点状态驱动样式 (克制高雅，与整体系统风格深度融合) */
      &.is-done {
        .step-rail {
          .step-dot {
            background: #eff6ff;
            border-color: #3b82f6;
            color: #2563eb;
          }
          .step-line {
            background: #cbd5e1;
          }
        }
      }

      &.is-active {
        .step-rail {
          .step-dot {
            background: #ffffff;
            border-color: #3b82f6;
            color: #2563eb;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          }
        }
      }

      &.is-reject {
        .step-rail {
          .step-dot {
            background: #fff1f2;
            border-color: #f43f5e;
            color: #e11d48;
          }
        }
      }

      &.is-disapprove {
        .step-rail {
          .step-dot {
            background: #fef2f2;
            border-color: #ef4444;
            color: #dc2626;
          }
        }
      }

      &.is-wait {
        .step-rail {
          .step-dot {
            background: #f8fafc;
            border-color: #cbd5e1;
            color: #94a3b8;
          }
        }
      }
    }
  }
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-spacer {
  flex: 1;
}

.rule-alert {
  border-radius: 6px;
}

.leader-matched-badge {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
  border: 1px solid #a7f3d0;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  color: #065f46;
  line-height: 1.5;
}

/* 审核流程列与状态样式 */
.audit-flow-summary-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 2px 0;
}

.flow-badge-row {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flow-pill-tag {
  font-weight: 600;
  border-radius: 4px;
}

.flow-sub-tip {
  font-size: 11px;
  line-height: 14px;
  margin-top: 2px;
  color: #64748b;
}

.view-flow-btn {
  font-size: 11px !important;
  padding: 0 !important;
  height: auto !important;
}

/* 单个审核弹窗现代高阶样式（与批量审核弹窗保持一致的高端质感） */
.audit-action-dialog {
  :deep(.el-dialog__header) {
    padding: 16px 20px 14px;
    border-bottom: 1px solid #f1f5f9;
    margin-right: 0;
  }

  :deep(.el-dialog__body) {
    padding: 16px 20px 18px;
  }

  :deep(.el-dialog__footer) {
    padding: 12px 20px 16px;
    border-top: 1px solid #f1f5f9;
    background: #fafafa;
  }

  .audit-action-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;

      .header-title {
        font-size: 15px;
        font-weight: 700;
        color: #0f172a;
      }

      .header-sub-tag {
        font-size: 11px;
        font-weight: 600;
        color: #2563eb;
        background: #eff6ff;
        border: 1px solid #dbeafe;
        border-radius: 12px;
        padding: 1px 8px;
      }
    }
  }

  .audit-action-modal-body {
    /* 1. 待审核单据状态条 */
    .audit-status-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 9px 14px;
      margin-bottom: 14px;

      .strip-left {
        display: flex;
        align-items: center;
        gap: 10px;

        .strip-icon-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          font-size: 14px;
          flex-shrink: 0;
        }

        .strip-text {
          font-size: 12.5px;
          color: #334155;

          .strip-main {
            font-weight: 500;

            b {
              color: #0f172a;
              font-size: 13px;
              margin: 0 1px;
            }
          }

          .strip-hint {
            color: #64748b;
            font-size: 12px;
          }
        }
      }

      .strip-right {
        .audit-status-badge {
          font-size: 11.5px;
          font-weight: 600;
        }
      }
    }

    /* 共享小标题栏 */
    .section-title-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;

      .title-left {
        display: flex;
        align-items: center;
        gap: 8px;

        .bar-title {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
        }

        .bar-badge {
          font-size: 11px;
          font-weight: 600;
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 10px;
          padding: 1px 7px;
        }

        .bar-sub {
          font-size: 11.5px;
          color: #64748b;
        }
      }
    }

    /* 2. 单据基础属性与 BOM 子件核对区 */
    .audit-target-details-section {
      margin-bottom: 14px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;

      .meta-info-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 10px;
        padding-bottom: 10px;
        border-bottom: 1px dashed #f1f5f9;

        .meta-cell {
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;

          .cell-label {
            color: #64748b;
            flex-shrink: 0;
          }

          .cell-val {
            color: #1e293b;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      .audit-bom-mini-table {
        margin-top: 8px;

        .bom-preview-table {
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #e2e8f0;

          :deep(th) {
            background: #f8fafc;
            font-size: 11.5px;
            font-weight: 600;
            color: #475569;
            padding: 5px 0;
          }

          :deep(td) {
            padding: 5px 0;
            font-size: 12px;
          }
        }
      }
    }

    /* 3. 决策卡片三栏网格 */
    .audit-decision-cards-section {
      margin-bottom: 14px;

      .decision-cards-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;

        .decision-choice-card {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px 14px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;

          &:hover {
            border-color: #cbd5e1;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }

          .card-radio-ring {
            margin-top: 2px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 1.5px solid #cbd5e1;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.2s;

            .radio-inner-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: transparent;
              transition: all 0.2s;
            }
          }

          .card-main {
            flex: 1;
            min-width: 0;

            .card-top-line {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 5px;

              .title-wrap {
                display: flex;
                align-items: center;
                gap: 6px;

                .status-icon {
                  font-size: 15px;
                }

                .decision-name {
                  font-size: 13.5px;
                  font-weight: 700;
                  color: #1e293b;
                }
              }

              .status-action-tag {
                font-size: 11px;
                font-weight: 600;
                padding: 1px 6px;
                border-radius: 4px;

                &.pass {
                  color: #059669;
                  background: #ecfdf5;
                  border: 1px solid #a7f3d0;
                }
                &.reject {
                  color: #d97706;
                  background: #fffbeb;
                  border: 1px solid #fde68a;
                }
                &.disapprove {
                  color: #e11d48;
                  background: #fff1f2;
                  border: 1px solid #fecdd3;
                }
              }
            }

            .decision-desc {
              font-size: 11.5px;
              line-height: 1.45;
              color: #64748b;
            }
          }

          /* Pass 态 */
          &.card-pass {
            .title-wrap .status-icon {
              color: #10b981;
            }

            &.is-selected {
              border-color: #10b981;
              background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
              box-shadow: 0 2px 10px rgba(16, 185, 129, 0.15);

              .card-radio-ring {
                border-color: #10b981;
                background: #10b981;

                .radio-inner-dot {
                  background: #ffffff;
                }
              }

              .title-wrap .decision-name {
                color: #065f46;
              }
            }
          }

          /* Reject 态 */
          &.card-reject {
            .title-wrap .status-icon {
              color: #f59e0b;
            }

            &.is-selected {
              border-color: #f59e0b;
              background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
              box-shadow: 0 2px 10px rgba(245, 158, 11, 0.15);

              .card-radio-ring {
                border-color: #f59e0b;
                background: #f59e0b;

                .radio-inner-dot {
                  background: #ffffff;
                }
              }

              .title-wrap .decision-name {
                color: #92400e;
              }
            }
          }

          /* Disapprove 态 */
          &.card-disapprove {
            .title-wrap .status-icon {
              color: #f43f5e;
            }

            &.is-selected {
              border-color: #f43f5e;
              background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
              box-shadow: 0 2px 10px rgba(244, 63, 94, 0.15);

              .card-radio-ring {
                border-color: #f43f5e;
                background: #f43f5e;

                .radio-inner-dot {
                  background: #ffffff;
                }
              }

              .title-wrap .decision-name {
                color: #9f1239;
              }
            }
          }
        }
      }
    }

    /* 4. 审核意见区 */
    .audit-remark-section {
      .remark-title-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        .title-left {
          display: flex;
          align-items: center;
          gap: 6px;

          .bar-title {
            font-size: 13px;
            font-weight: 700;
            color: #1e293b;
          }

          .require-tag {
            font-size: 11px;
            font-weight: 600;
            color: #e11d48;
            background: #fff1f2;
            border: 1px solid #fecdd3;
            border-radius: 4px;
            padding: 1px 6px;
          }

          .optional-tag {
            font-size: 11.5px;
            color: #94a3b8;
          }
        }

        .preset-phrases-group {
          display: flex;
          align-items: center;
          gap: 6px;

          .preset-label {
            font-size: 11.5px;
            color: #94a3b8;
          }

          .phrase-chip-btn {
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            color: #475569;
            font-size: 11.5px;
            border-radius: 12px;
            padding: 2px 10px;
            cursor: pointer;
            transition: all 0.18s;
            outline: none;

            &:hover {
              background: #eff6ff;
              border-color: #93c5fd;
              color: #1d4ed8;
              transform: translateY(-1px);
            }
          }
        }
      }

      .remark-textarea {
        :deep(.el-textarea__inner) {
          border-radius: 8px;
          font-size: 12.5px;
          padding: 8px 12px;
          line-height: 1.5;
          border-color: #cbd5e1;
          transition: all 0.2s;

          &:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
          }
        }
      }
    }
  }

  /* 弹窗底部操作条 */
  .audit-action-dialog-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .footer-left-status {
      display: flex;
      align-items: center;
      gap: 6px;

      .status-label {
        font-size: 12px;
        color: #64748b;
      }

      .status-tag {
        font-size: 12px;
        font-weight: 600;
        padding: 0 10px;
        height: 24px;
        line-height: 22px;
      }
    }

    .footer-right-buttons {
      display: flex;
      align-items: center;
      gap: 10px;

      .confirm-audit-btn {
        padding: 8px 18px;
        font-weight: 600;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        transition: all 0.2s;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        }
      }
    }
  }
}

/* ==========================================================================
   组合物料四大类型标准定义规范看板 (高颜值企业级精细化重构)
   ========================================================================== */
.type-guide-drawer {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 14px 20px;
    border-bottom: 1px solid #e2e8f0;
    background: #ffffff;
  }

  :deep(.el-drawer__body) {
    padding: 0;
    background: #f8fafc;
  }
}

.guide-drawer-header {
  display: flex;
  align-items: center;
  width: 100%;

  .header-title {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.2px;
  }
}

.guide-drawer-content {
  padding: 16px 22px 40px 22px;
  overflow-y: auto;
}

/* 导语 Banner */
.guide-banner-card {
  background: linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 50%, #f5f3ff 100%);
  border: 1px solid #bae6fd;
  border-radius: 10px;
  padding: 14px 18px;
  box-shadow: 0 2px 8px rgba(186, 230, 253, 0.35);

  .banner-badge-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .banner-title {
    font-weight: 700;
    font-size: 14px;
    color: #0284c7;
    display: flex;
    align-items: center;
    gap: 6px;

    .banner-icon {
      font-size: 16px;
    }
  }

  .banner-sub-tag {
    font-size: 11px;
    font-weight: 600;
    color: #0369a1;
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid #bae6fd;
    padding: 1px 8px;
    border-radius: 9999px;
  }

  .banner-desc {
    font-size: 12px;
    line-height: 19px;
    color: #334155;
    margin: 8px 0 0 0;

    b {
      color: #0f172a;
    }
  }

  .banner-tracks {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    flex-wrap: wrap;

    .track-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #e0f2fe;
      font-size: 11px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);

      .track-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }

      .track-name {
        font-weight: 700;
      }

      .track-hint {
        color: #64748b;
      }

      &.track-1 {
        .track-dot { background: #64748b; }
        .track-name { color: #334155; }
      }
      &.track-2 {
        .track-dot { background: #d97706; }
        .track-name { color: #b45309; }
      }
      &.track-3 {
        .track-dot { background: #e11d48; }
        .track-name { color: #be123c; }
      }
    }
  }
}

/* 通用小节标题条 */
.sec-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .sec-title {
    font-size: 13.5px;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 6px;

    .sec-icon {
      font-size: 16px;
    }
  }

  .sec-tip {
    font-size: 11px;
    color: #94a3b8;
  }
}

/* 3秒快速判定指引 (4 栏网格卡片) */
.decision-guide-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

.decision-flow-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;

  .decision-node {
    border-radius: 8px;
    border: 1px solid;
    padding: 10px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    user-select: none;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);

      .node-footer {
        opacity: 1;
        font-weight: 700;
      }
    }

    .node-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .node-step {
        font-size: 10px;
        font-weight: 800;
        padding: 1px 6px;
        border-radius: 4px;
        letter-spacing: 0.3px;
      }

      .node-theme-tag {
        font-size: 10.5px;
        font-weight: 600;
      }
    }

    .node-q {
      font-size: 11.5px;
      font-weight: 600;
      line-height: 16px;
      margin: 8px 0 6px 0;
      min-height: 32px;
      display: flex;
      align-items: center;
    }

    .node-arrow-bar {
      display: flex;
      align-items: center;
      gap: 5px;
      margin: 4px 0 6px 0;

      .arrow-line {
        flex: 1;
        height: 1px;
        background: currentColor;
        opacity: 0.25;
      }

      .arrow-text {
        font-size: 10px;
        font-weight: 600;
        opacity: 0.75;
      }
    }

    .node-res {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 6px 4px;
      border-radius: 6px;
      margin-bottom: 6px;

      .res-badge {
        font-size: 12px;
        font-weight: 700;
      }

      .res-formula {
        font-size: 10px;
        font-family: monospace;
        opacity: 0.85;
        margin-top: 1px;
      }
    }

    .node-footer {
      font-size: 10.5px;
      text-align: center;
      opacity: 0.7;
      transition: all 0.2s ease;
    }

    /* 4 类主题色系 */
    &.theme-slate {
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
      border-color: #cbd5e1;
      color: #334155;

      .node-step { background: #e2e8f0; color: #1e293b; }
      .node-theme-tag { color: #475569; }
      .node-q { color: #1e293b; }
      .node-res { background: #e2e8f0; color: #0f172a; }
      .node-footer { color: #475569; }

      &:hover { border-color: #64748b; box-shadow: 0 6px 16px rgba(100, 116, 139, 0.2); }
    }

    &.theme-amber {
      background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);
      border-color: #fde68a;
      color: #92400e;

      .node-step { background: #fef3c7; color: #78350f; }
      .node-theme-tag { color: #b45309; }
      .node-q { color: #78350f; }
      .node-res { background: #fde68a; color: #78350f; }
      .node-footer { color: #b45309; }

      &:hover { border-color: #d97706; box-shadow: 0 6px 16px rgba(217, 119, 6, 0.2); }
    }

    &.theme-rose {
      background: linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%);
      border-color: #fecdd3;
      color: #be123c;

      .node-step { background: #ffe4e6; color: #9f1239; }
      .node-theme-tag { color: #be123c; }
      .node-q { color: #881337; }
      .node-res { background: #fecdd3; color: #881337; }
      .node-footer { color: #be123c; }

      &:hover { border-color: #e11d48; box-shadow: 0 6px 16px rgba(225, 29, 72, 0.2); }
    }

    &.theme-indigo {
      background: linear-gradient(180deg, #eef2ff 0%, #e0e7ff 100%);
      border-color: #c7d2fe;
      color: #4338ca;

      .node-step { background: #e0e7ff; color: #3730a3; }
      .node-theme-tag { color: #4338ca; }
      .node-q { color: #312e81; }
      .node-res { background: #c7d2fe; color: #312e81; }
      .node-footer { color: #4338ca; }

      &:hover { border-color: #4f46e5; box-shadow: 0 6px 16px rgba(79, 70, 229, 0.2); }
    }
  }
}

/* 横向特征对比矩阵卡片 */
.matrix-table-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);

  .matrix-table-wrapper {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  }

  .guide-matrix-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;

    th {
      background: #f8fafc;
      color: #475569;
      font-weight: 700;
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      text-align: left;
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      vertical-align: middle;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr.row-hover {
      transition: background-color 0.15s ease;
      &:hover {
        background: #f8fafc;
      }
    }

    .matrix-type-cell {
      display: flex;
      flex-direction: column;
      gap: 3px;

      .cell-sub {
        font-size: 10.5px;
        color: #94a3b8;
        font-family: monospace;
      }
    }

    .cell-strong {
      font-weight: 600;
      color: #0f172a;
    }

    .cell-sub {
      font-size: 11px;
      color: #64748b;
      margin-top: 1px;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      line-height: 16px;

      .dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
      }

      &.green {
        background: #ecfdf5;
        border: 1px solid #a7f3d0;
        color: #065f46;
        .dot { background: #059669; }
      }

      &.red {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #991b1b;
        .dot { background: #dc2626; }
      }

      &.purple {
        background: #f5f3ff;
        border: 1px solid #ddd6fe;
        color: #5b21b6;
        .dot { background: #7c3aed; }
      }
    }

    .wh-cell {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      line-height: 16px;

      .wh-icon {
        font-size: 14px;
        flex-shrink: 0;
      }
    }

    .risk-cell {
      font-size: 11.5px;
      line-height: 16px;
      font-weight: 500;
    }
  }
}

/* 规范 Tab 切换条 */
.type-nav-tabs {
  display: flex;
  align-items: center;
  gap: 6px;

  .tab-btn {
    border: 1px solid #e2e8f0;
    background: #ffffff;
    color: #64748b;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: #cbd5e1;
      color: #334155;
    }

    &.active {
      background: #3b82f6;
      border-color: #3b82f6;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
    }
  }
}

/* 增强深度卡片 */
.enhanced-guide-card {
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  margin-bottom: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  transition: all 0.25s ease;
  overflow: hidden;

  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.07);
    transform: translateY(-2px);
  }

  &.is-highlighted {
    animation: guide-card-pulse 2.2s ease;
  }

  /* 4类主题色边框 */
  &.theme-slate {
    border-left: 5px solid #475569;
    .guide-card-top { background: linear-gradient(90deg, #f8fafc 0%, #ffffff 100%); }
    .icon-slate { background: #e2e8f0; color: #334155; }
    .rule-slate { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; }
  }

  &.theme-amber {
    border-left: 5px solid #d97706;
    .guide-card-top { background: linear-gradient(90deg, #fffbeb 0%, #ffffff 100%); }
    .icon-amber { background: #fef3c7; color: #b45309; }
    .rule-amber { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
  }

  &.theme-rose {
    border-left: 5px solid #e11d48;
    .guide-card-top { background: linear-gradient(90deg, #fff1f2 0%, #ffffff 100%); }
    .icon-rose { background: #ffe4e6; color: #be123c; }
    .rule-rose { background: #ffe4e6; color: #9f1239; border: 1px solid #fecdd3; }
  }

  &.theme-indigo {
    border-left: 5px solid #4f46e5;
    .guide-card-top { background: linear-gradient(90deg, #eef2ff 0%, #ffffff 100%); }
    .icon-indigo { background: #e0e7ff; color: #4338ca; }
    .rule-indigo { background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }
  }

  .guide-card-top {
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;

    .card-title-cluster {
      display: flex;
      align-items: center;
      gap: 8px;

      .card-icon-tag {
        width: 26px;
        height: 26px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }

      .en-name {
        color: #64748b;
      }

      .formula-chip {
        font-size: 10.5px;
        font-family: monospace;
        font-weight: 600;
        padding: 1px 7px;
        border-radius: 4px;
        background: #f1f5f9;
        color: #475569;
        border: 1px solid #e2e8f0;
      }
    }

    .core-rule-tag {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
    }
  }

  .guide-card-body {
    padding: 14px 16px;

    /* 业务本质 */
    .essence-callout {
      display: flex;
      gap: 10px;
      background: #f8fafc;
      border-left: 3px solid #3b82f6;
      border-radius: 0 6px 6px 0;
      padding: 8px 12px;
      font-size: 12px;

      .essence-label {
        font-weight: 700;
        color: #1d4ed8;
        white-space: nowrap;
        display: flex;
        align-items: center;
      }

      .essence-text {
        color: #334155;
        line-height: 18px;
      }
    }

    /* 关键特征列表 */
    .feature-bullets {
      background: #f8fafc;
      border-radius: 8px;
      padding: 10px 12px;
      border: 1px solid #f1f5f9;

      .feature-title {
        font-size: 11px;
        font-weight: 700;
        color: #475569;
        margin-bottom: 6px;
      }

      .bullet-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .bullet-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 11.5px;
        line-height: 18px;
        color: #334155;

        .bullet-check {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #dcfce7;
          color: #15803d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          flex-shrink: 0;
        }
      }
    }

    /* ERP 典型案例票据卡片 */
    .example-ticket {
      background: #ffffff;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 10px 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

      .example-ticket-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .ticket-title {
          font-size: 11.5px;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
        }

        .ticket-sub {
          font-size: 10.5px;
          color: #94a3b8;
        }
      }

      .ticket-body {
        .example-desc-text {
          font-size: 11.5px;
          color: #475569;
          margin-top: 4px;
          line-height: 17px;

          b {
            color: #0f172a;
          }
        }

        .example-sku-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;

          .sku-chip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 8px;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 5px;
            font-size: 11px;

            .sku-code {
              font-weight: 700;
              color: #0f172a;
              background: #ffffff;
              padding: 1px 5px;
              border-radius: 3px;
              border: 1px solid #e2e8f0;
            }

            .sku-name {
              color: #475569;
            }

            .sku-qty {
              font-weight: 700;
              color: #2563eb;
            }
          }
        }
      }
    }

    /* 双栏规范 */
    .guidelines-dual-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;

      .spec-card {
        border-radius: 8px;
        padding: 9px 12px;
        font-size: 11.5px;

        .spec-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;

          .spec-icon-box {
            font-size: 13px;
          }

          .spec-title {
            font-weight: 700;
          }
        }

        .spec-content {
          line-height: 17px;
        }

        &.spec-bom {
          background: #eff6ff;
          border: 1px solid #dbeafe;
          .spec-icon-box, .spec-title { color: #1d4ed8; }
          .spec-content { color: #1e3a8a; }
        }

        &.spec-wh {
          background: #fefce8;
          border: 1px solid #fef08a;
          .spec-icon-box, .spec-title { color: #a16207; }
          .spec-content { color: #713f12; }
        }
      }
    }

    /* 防错底线警示 */
    .risk-callout {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #fff1f2;
      border: 1px solid #ffe4e6;
      border-radius: 6px;
      font-size: 11.5px;
      color: #be123c;

      .risk-icon {
        font-size: 13px;
        flex-shrink: 0;
      }

      .risk-text {
        line-height: 16px;
      }
    }
  }
}

@keyframes guide-card-pulse {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); border-color: #3b82f6; }
  50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.2); border-color: #2563eb; }
  100% { box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03); border-color: #e2e8f0; }
}

/* 常见混淆 FAQ 卡片 */
.guide-faq-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .faq-item {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 12px;

    .faq-q-box {
      display: flex;
      align-items: center;
      gap: 8px;

      .q-tag {
        background: #ccfbf1;
        color: #0f766e;
        font-weight: 800;
        font-size: 10.5px;
        padding: 1px 6px;
        border-radius: 4px;
        border: 1px solid #99f6e4;
      }

      .faq-q {
        font-weight: 700;
        color: #0f766e;
        font-size: 12.5px;
      }
    }

    .faq-a {
      font-size: 11.5px;
      color: #334155;
      line-height: 19px;
      margin-top: 6px;
      padding-left: 30px;
      border-left: 2px solid #cbd5e1;

      b {
        color: #0f172a;
      }
    }
  }

  /* 30秒极简速记口诀 */
  .mnemonic-card {
    background: linear-gradient(135deg, #fefce8 0%, #fffbeb 50%, #eff6ff 100%);
    border: 1px solid #fde68a;
    border-radius: 8px;
    padding: 12px 14px;

    .mnemonic-title {
      font-size: 12.5px;
      font-weight: 700;
      color: #92400e;
      display: flex;
      align-items: center;
    }

    .mnemonic-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;

      .m-pill {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid #fef08a;
        border-radius: 6px;
        font-size: 11.5px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

        .m-num {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fef3c7;
          color: #b45309;
          font-weight: 800;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .m-cond {
          color: #334155;
          font-weight: 500;
        }

        .m-arrow {
          color: #94a3b8;
          font-size: 10px;
        }

        .m-type {
          font-weight: 700;
        }
      }
    }
  }
}


/* ==========================================================================
   批量导入组合物料弹窗样式 (高颜值精细化重构)
   ========================================================================== */
.import-modal-dialog {
  :deep(.el-dialog__header) {
    padding: 16px 20px;
    margin-right: 0;
    border-bottom: 1px solid #eef2f6;
    background: #f8fafc;
    border-radius: 8px 8px 0 0;

    .el-dialog__title {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
    }
  }

  :deep(.el-dialog__body) {
    padding: 16px 20px;
    background: #f8fafc;
    max-height: 72vh;
    overflow-y: auto;
  }

  :deep(.el-dialog__footer) {
    padding: 12px 20px;
    border-top: 1px solid #eef2f6;
    background: #ffffff;
    border-radius: 0 0 8px 8px;
  }
}

.import-step-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

  .step-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    &.justify-between {
      justify-content: space-between;
    }

    .step-badge {
      font-size: 11px;
      font-weight: 700;
      color: #2563eb;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 1px 8px;
      border-radius: 10px;
      letter-spacing: 0.5px;
    }

    .step-title {
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
    }
  }
}

/* 步骤 1：模板卡片 */
.template-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%);
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  padding: 12px 14px;
  gap: 16px;

  .template-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .excel-icon-pill {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: linear-gradient(135deg, #15803d, #16a34a);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(22, 163, 74, 0.25);
      flex-shrink: 0;

      .excel-ext {
        color: #ffffff;
        font-family: monospace;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.5px;
      }
    }

    .template-meta {
      display: flex;
      flex-direction: column;
      gap: 3px;

      .template-main-title {
        font-size: 13.5px;
        font-weight: 700;
        color: #0f172a;
        display: flex;
        align-items: center;
        gap: 6px;

        .version-tag {
          font-size: 10.5px;
          background: #dcfce7;
          color: #166534;
          padding: 1px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
      }

      .template-tags-row {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;

        .meta-tag {
          font-size: 11px;
          padding: 1px 7px;
          border-radius: 4px;
          font-weight: 500;
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        }
      }
    }
  }

  .template-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;

    .download-btn {
      background: linear-gradient(135deg, #16a34a, #15803d);
      border-color: #15803d;
      box-shadow: 0 2px 4px rgba(22, 163, 74, 0.2);

      &:hover {
        background: linear-gradient(135deg, #22c55e, #16a34a);
      }
    }
  }
}

.template-notice-bar {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: #854d0e;
  background: #fefce8;
  border: 1px dashed #fef08a;
  padding: 6px 12px;
  border-radius: 4px;

  .notice-icon {
    font-size: 14px;
    color: #ca8a04;
    flex-shrink: 0;
  }
}

.template-spec-table-box {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 10px 12px;

  .spec-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    .spec-title {
      font-size: 12px;
      font-weight: 700;
      color: #334155;
      display: flex;
      align-items: center;
    }

    .spec-required-tip {
      font-size: 11px;
      color: #e11d48;
    }
  }

  .spec-table-scroll {
    max-height: 220px;
    overflow-y: auto;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }
}

.spec-mini-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  background: #fff;

  th {
    background: #f1f5f9;
    color: #475569;
    font-weight: 600;
    padding: 6px 8px;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  td {
    padding: 5px 8px;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;

    &.col-index {
      color: #94a3b8;
      font-family: monospace;
    }

    &.col-name {
      font-weight: 600;

      .required-name {
        color: #e11d48;
        font-weight: 700;
      }
    }

    .status-pill {
      font-size: 10.5px;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;

      &.pill-req {
        background: #ffe4e6;
        color: #e11d48;
      }

      &.pill-opt {
        background: #f1f5f9;
        color: #64748b;
      }
    }

    .category-pill {
      font-size: 10.5px;
      background: #f8fafc;
      color: #475569;
      border: 1px solid #e2e8f0;
      padding: 1px 5px;
      border-radius: 3px;
    }

    .example-code {
      font-family: monospace;
      color: #1d4ed8;
      font-size: 11px;
      background: #eff6ff;
      padding: 1px 4px;
      border-radius: 3px;
    }

    &.col-desc {
      color: #64748b;
      font-size: 11px;
    }
  }
}

/* 步骤 2：上传与解析 */
.combo-import-uploader {
  width: 100%;

  :deep(.el-upload) {
    width: 100%;
  }

  :deep(.el-upload-dragger) {
    width: 100%;
    padding: 24px 16px;
    border: 2px dashed #93c5fd;
    background: #f8fafc;
    border-radius: 8px;
    transition: all 0.2s ease-in-out;

    &:hover {
      border-color: #2563eb;
      background: #eff6ff;
    }
  }

  .upload-inner-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .upload-icon-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #eff6ff;
      color: #2563eb;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 8px;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.12);
    }

    .upload-main-text {
      font-size: 13px;
      color: #334155;

      .upload-highlight {
        color: #2563eb;
        font-weight: 600;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .upload-sub-tip {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 4px;
    }
  }
}

/* 已解析状态条 */
.file-parsed-status-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%);
  border: 1px solid #86efac;
  border-radius: 6px;
  padding: 10px 14px;

  .file-info-left {
    display: flex;
    align-items: center;
    gap: 10px;

    .file-icon-box {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      background: #dcfce7;
      color: #16a34a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    .file-text-details {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .file-name-line {
        display: flex;
        align-items: center;
        gap: 6px;

        .file-name {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
        }

        .file-size {
          font-size: 11px;
          color: #94a3b8;
        }

        .parse-success-tag {
          font-size: 10.5px;
          background: #dcfce7;
          color: #15803d;
          padding: 1px 7px;
          border-radius: 10px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }
      }

      .file-stat-line {
        font-size: 11.5px;
        color: #64748b;
      }
    }
  }
}

/* 步骤 3：数据核对与目标单据状态 */
.status-selector-row {
  display: flex;
  align-items: center;
  gap: 6px;

  .selector-label {
    font-size: 12px;
    color: #475569;
    font-weight: 500;
  }
}

.preview-table-container {
  .styled-preview-table {
    border-radius: 4px;
    overflow: hidden;

    :deep(th) {
      background: #f8fafc;
      color: #475569;
      font-weight: 600;
      font-size: 12px;
    }

    .preview-name-cell {
      display: flex;
      flex-direction: column;
      gap: 1px;

      .name-text {
        font-weight: 600;
        color: #1e293b;
      }

      .sub-style {
        font-size: 11px;
        color: #94a3b8;
      }
    }

    .bom-tags-cell {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;

      .bom-item-tag {
        font-family: monospace;
        font-size: 11px;
        background: #eff6ff;
        color: #1d4ed8;
        border: 1px solid #dbeafe;
        padding: 1px 5px;
        border-radius: 3px;

        .ratio {
          color: #dc2626;
          font-weight: 700;
          font-style: normal;
          margin-left: 2px;
        }
      }
    }

    .personnel-cell {
      line-height: 1.4;

      .p-line {
        font-size: 11px;

        .k {
          color: #94a3b8;
        }
      }
    }
  }

  .preview-footer-notice {
    font-size: 11px;
    color: #94a3b8;
    text-align: right;
    margin-top: 6px;

    b {
      color: #2563eb;
    }
  }
}

/* 阶段指示器 Stepper (高质感现代流程卡片) */
.custom-import-stepper {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 14px;

  .stepper-item {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    padding: 6px 12px;
    border-radius: 6px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    transition: all 0.25s ease;

    .step-badge-num {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #f1f5f9;
      color: #64748b;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
    }

    .step-text-wrap {
      min-width: 0;

      .step-title {
        font-size: 12.5px;
        font-weight: 600;
        color: #334155;
        line-height: 1.3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .step-desc {
        font-size: 11px;
        color: #94a3b8;
        line-height: 1.2;
        margin-top: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &.is-done {
      background: #f0fdf4;
      border-color: #bbf7d0;

      .step-badge-num {
        background: #10b981;
        color: #ffffff;
      }

      .step-title {
        color: #065f46;
      }

      .step-desc {
        color: #059669;
      }
    }

    &.is-active {
      background: #eff6ff;
      border-color: #93c5fd;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.12);

      .step-badge-num {
        background: #2563eb;
        color: #ffffff;
      }

      .step-title {
        color: #1e40af;
        font-weight: 700;
      }

      .step-desc {
        color: #2563eb;
      }
    }

    &.is-pending {
      opacity: 0.85;
      background: #f8fafc;
      border-color: #e2e8f0;
    }
  }

  .stepper-arrow-divider {
    color: #cbd5e1;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
}

/* 阶段2：预览核对横幅提示 (轻量化中性提示) */
.preview-notice-callout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 3px solid #3b82f6;
  border-radius: 6px;
  padding: 8px 14px;

  .callout-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .callout-icon-box {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    background: #eff6ff;
    border: 1px solid #dbeafe;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2563eb;
    font-size: 16px;
    flex-shrink: 0;
  }

  .callout-text-group {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .callout-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .callout-title {
    font-size: 12.5px;
    font-weight: 600;
    color: #1e293b;
  }

  .callout-tag {
    font-size: 10.5px;
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
    padding: 0 6px;
    border-radius: 4px;
    font-weight: 500;
  }

  .callout-desc {
    font-size: 11.5px;
    color: #64748b;
    line-height: 1.4;
  }

  .sandbox-ready-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    color: #334155;
    font-size: 11.5px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 16px;
    white-space: nowrap;

    .live-dot {
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
    }
  }
}

/* 阶段2：操作控制卡 (单行高协调度指标与控制栏) */
.preview-toolbar-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: nowrap;
    min-width: 0;

    .metric-group-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      line-height: 1;

      .metric-icon {
        width: 22px;
        height: 22px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        background: #f1f5f9;
        color: #475569;
        border: 1px solid #e2e8f0;

        &.blue,
        &.indigo {
          background: #f1f5f9;
          color: #475569;
          border-color: #e2e8f0;
        }
      }

      .metric-title {
        color: #64748b;
        font-weight: 500;
        font-size: 12px;
      }

      .metric-num {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 14px;
        font-weight: 700;
        line-height: 1;
        color: #0f172a;

        &.blue,
        &.indigo {
          color: #0f172a;
        }
      }

      .metric-unit {
        color: #94a3b8;
        font-size: 11.5px;
      }
    }

    .toolbar-v-sep {
      width: 1px;
      height: 16px;
      background: #e2e8f0;
    }

    .metric-status-item {
      display: inline-flex;
      align-items: center;
      gap: 8px;

      .status-label {
        font-size: 12px;
        font-weight: 600;
        color: #334155;
        white-space: nowrap;
      }

      .preview-status-radios {
        :deep(.el-radio-button__inner) {
          font-size: 12px;
          padding: 5px 12px;
        }
      }
    }
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
}

/* 阶段2：全量预览表格与展开 BOM (含 28 字段多层分组表头) */
.full-preview-table-box {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

  .full-preview-table {
    :deep(.el-table__header-wrapper th) {
      font-size: 11.5px;
      padding: 5px 0;
      text-align: center;
    }

    /* 分组大表头层级与背景色彩优化：极简中性灰底色 */
    :deep(.el-table__header tr:first-child th) {
      background: #f8fafc;
      color: #334155;
      font-weight: 600;
      border-bottom: 1px solid #cbd5e1;
      padding: 6px 0;
    }

    :deep(.el-table__header tr:nth-child(2) th) {
      background: #f1f5f9;
      color: #475569;
      font-weight: 600;
      font-size: 11.5px;
      padding: 5px 0;
    }

    :deep(.el-table__cell) {
      padding: 5px 0;
    }

    .group-header-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 2px 10px;
      border-radius: 4px;
      font-size: 11.5px;
      font-weight: 600;
      letter-spacing: 0.2px;
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
      white-space: nowrap;

      &.group-header-purple,
      &.group-header-sky,
      &.group-header-indigo,
      &.group-header-orange,
      &.group-header-slate {
        background: #f1f5f9;
        color: #334155;
        border: 1px solid #cbd5e1;
      }
    }

    /* BOM 子部件与配比标签芯片 */
    .code-chips-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
    }

    .code-chip {
      display: inline-block;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11.5px;
      font-weight: 600;
      color: #2563eb;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 1px 6px;
      border-radius: 3px;
      line-height: 1.35;
      letter-spacing: 0.2px;
    }

    .ratio-chips-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      justify-content: center;
      align-items: center;
    }

    .ratio-chip {
      display: inline-block;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11.5px;
      font-weight: 600;
      color: #334155;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 1px 6px;
      border-radius: 3px;
      line-height: 1.35;
    }

    .leader-tag {
      font-weight: 500;
    }
  }

  .expanded-bom-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 14px;
    margin: 4px 0;

    .bom-box-header {
      font-size: 12px;
      margin-bottom: 6px;
    }

    .bom-sub-table {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
      border-radius: 4px;
      overflow: hidden;

      :deep(th) {
        background: #f1f5f9;
        font-size: 11.5px;
        font-weight: 600;
        color: #475569;
        padding: 5px 0;
      }

      :deep(td) {
        padding: 4px 0;
        font-size: 12px;
      }
    }
  }
}

/* 底部操作条 */
.import-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .footer-left-tip {
    display: flex;
    align-items: center;

    .preview-footer-status-pill {
      display: inline-flex;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 5px 14px;
      font-size: 12px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);

      .pill-main {
        color: #334155;
        font-weight: 500;

        b {
          color: #2563eb;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 13px;
          margin: 0 2px;
        }
      }

      .pill-dot {
        color: #cbd5e1;
        margin: 0 8px;
        font-weight: bold;
      }

      .pill-sub {
        color: #64748b;
        font-size: 11.5px;
      }
    }
  }

  .footer-right-actions {
    display: flex;
    align-items: center;
    gap: 8px;

    .confirm-import-btn {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      border-color: #1d4ed8;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
    }
  }
}

/* 批量审核弹窗现代高阶样式 */
.batch-audit-dialog {
  :deep(.el-dialog__header) {
    padding: 16px 20px 14px;
    border-bottom: 1px solid #f1f5f9;
    margin-right: 0;
  }

  :deep(.el-dialog__body) {
    padding: 16px 20px 18px;
  }

  :deep(.el-dialog__footer) {
    padding: 12px 20px 16px;
    border-top: 1px solid #f1f5f9;
    background: #fafafa;
  }

  .batch-audit-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;

      .header-title {
        font-size: 15px;
        font-weight: 700;
        color: #0f172a;
      }

      .header-sub-tag {
        font-size: 11px;
        font-weight: 600;
        color: #2563eb;
        background: #eff6ff;
        border: 1px solid #dbeafe;
        border-radius: 12px;
        padding: 1px 8px;
      }
    }
  }

  .batch-audit-modal-body {
    /* 1. 待审核单据状态条 */
    .batch-audit-status-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 9px 14px;
      margin-bottom: 14px;

      .strip-left {
        display: flex;
        align-items: center;
        gap: 10px;

        .strip-icon-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          font-size: 14px;
          flex-shrink: 0;
        }

        .strip-text {
          font-size: 12.5px;
          color: #334155;

          .strip-main {
            font-weight: 500;

            b {
              color: #2563eb;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              font-size: 13.5px;
              margin: 0 1px;
            }
          }

          .strip-hint {
            color: #64748b;
            font-size: 12px;
          }
        }
      }

      .strip-right {
        .skipped-pill {
          font-size: 11.5px;
          font-weight: 500;
          color: #b45309;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 12px;
          padding: 2px 9px;
        }

        .all-valid-pill {
          font-size: 11.5px;
          color: #059669;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 12px;
          padding: 2px 9px;
        }
      }
    }

    /* 共享小标题栏 */
    .section-title-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;

      .title-left {
        display: flex;
        align-items: center;
        gap: 8px;

        .bar-title {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
        }

        .bar-badge {
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          background: #f1f5f9;
          border-radius: 10px;
          padding: 1px 7px;
        }

        .bar-sub {
          font-size: 11.5px;
          color: #64748b;
        }
      }
    }

    /* 2. 待审核表格卡片 */
    .batch-audit-table-section {
      margin-bottom: 14px;

      .batch-audit-table {
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #e2e8f0;

        :deep(th) {
          background: #f8fafc;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          padding: 6px 0;
        }

        :deep(td) {
          padding: 6px 0;
          font-size: 12px;
        }

        .batch-expand-bom-wrap {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px 12px;
          margin: 4px 0;

          .inner-bom-table {
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid #e2e8f0;

            :deep(th) {
              background: #f1f5f9;
              font-size: 11.5px;
              color: #475569;
              font-weight: 600;
              padding: 5px 0;
            }

            :deep(td) {
              padding: 5px 0;
              font-size: 12px;
            }
          }
        }
      }
    }

    /* 3. 决策卡片三栏网格 */
    .batch-audit-decision-section {
      margin-bottom: 14px;

      .decision-cards-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;

        .decision-choice-card {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px 14px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;

          &:hover {
            border-color: #cbd5e1;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }

          .card-radio-ring {
            margin-top: 2px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 1.5px solid #cbd5e1;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.2s;

            .radio-inner-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: transparent;
              transition: all 0.2s;
            }
          }

          .card-main {
            flex: 1;
            min-width: 0;

            .card-top-line {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 5px;

              .title-wrap {
                display: flex;
                align-items: center;
                gap: 6px;

                .status-icon {
                  font-size: 15px;
                }

                .decision-name {
                  font-size: 13.5px;
                  font-weight: 700;
                  color: #1e293b;
                }
              }

              .status-action-tag {
                font-size: 11px;
                font-weight: 600;
                padding: 1px 6px;
                border-radius: 4px;

                &.pass {
                  color: #059669;
                  background: #ecfdf5;
                  border: 1px solid #a7f3d0;
                }
                &.reject {
                  color: #d97706;
                  background: #fffbeb;
                  border: 1px solid #fde68a;
                }
                &.disapprove {
                  color: #e11d48;
                  background: #fff1f2;
                  border: 1px solid #fecdd3;
                }
              }
            }

            .decision-desc {
              font-size: 11.5px;
              line-height: 1.45;
              color: #64748b;
            }
          }

          /* Pass 态 */
          &.card-pass {
            .title-wrap .status-icon {
              color: #10b981;
            }

            &.is-selected {
              border-color: #10b981;
              background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
              box-shadow: 0 2px 10px rgba(16, 185, 129, 0.15);

              .card-radio-ring {
                border-color: #10b981;
                background: #10b981;

                .radio-inner-dot {
                  background: #ffffff;
                }
              }

              .title-wrap .decision-name {
                color: #065f46;
              }
            }
          }

          /* Reject 态 */
          &.card-reject {
            .title-wrap .status-icon {
              color: #f59e0b;
            }

            &.is-selected {
              border-color: #f59e0b;
              background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
              box-shadow: 0 2px 10px rgba(245, 158, 11, 0.15);

              .card-radio-ring {
                border-color: #f59e0b;
                background: #f59e0b;

                .radio-inner-dot {
                  background: #ffffff;
                }
              }

              .title-wrap .decision-name {
                color: #92400e;
              }
            }
          }

          /* Disapprove 态 */
          &.card-disapprove {
            .title-wrap .status-icon {
              color: #f43f5e;
            }

            &.is-selected {
              border-color: #f43f5e;
              background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
              box-shadow: 0 2px 10px rgba(244, 63, 94, 0.15);

              .card-radio-ring {
                border-color: #f43f5e;
                background: #f43f5e;

                .radio-inner-dot {
                  background: #ffffff;
                }
              }

              .title-wrap .decision-name {
                color: #9f1239;
              }
            }
          }
        }
      }
    }

    /* 4. 审核意见区 */
    .batch-audit-remark-section {
      .remark-title-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        .title-left {
          display: flex;
          align-items: center;
          gap: 6px;

          .bar-title {
            font-size: 13px;
            font-weight: 700;
            color: #1e293b;
          }

          .require-tag {
            font-size: 11px;
            font-weight: 600;
            color: #e11d48;
            background: #fff1f2;
            border: 1px solid #fecdd3;
            border-radius: 4px;
            padding: 1px 6px;
          }

          .optional-tag {
            font-size: 11.5px;
            color: #94a3b8;
          }
        }

        .preset-phrases-group {
          display: flex;
          align-items: center;
          gap: 6px;

          .preset-label {
            font-size: 11.5px;
            color: #94a3b8;
          }

          .phrase-chip-btn {
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            color: #475569;
            font-size: 11.5px;
            border-radius: 12px;
            padding: 2px 10px;
            cursor: pointer;
            transition: all 0.18s;
            outline: none;

            &:hover {
              background: #eff6ff;
              border-color: #93c5fd;
              color: #1d4ed8;
              transform: translateY(-1px);
            }
          }
        }
      }

      .remark-textarea {
        :deep(.el-textarea__inner) {
          border-radius: 8px;
          font-size: 12.5px;
          padding: 8px 12px;
          line-height: 1.5;
          border-color: #cbd5e1;
          transition: all 0.2s;

          &:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
          }
        }
      }
    }
  }

  /* 弹窗底部操作条 */
  .batch-audit-dialog-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .footer-left-status {
      display: flex;
      align-items: center;
      gap: 6px;

      .status-label {
        font-size: 12px;
        color: #64748b;
      }

      .status-tag {
        font-size: 12px;
        font-weight: 600;
        padding: 0 10px;
        height: 24px;
        line-height: 22px;
      }

      .status-count {
        font-size: 12px;
        color: #94a3b8;
        margin-left: 2px;
      }
    }

    .footer-right-buttons {
      display: flex;
      align-items: center;
      gap: 10px;

      .confirm-audit-btn {
        padding: 8px 18px;
        font-weight: 600;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        transition: all 0.2s;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        }
      }
    }
  }
}

/* 操作栏当前登录身份徽章 */
.login-user-pill {
  display: inline-flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 3px 9px;
  font-size: 12px;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: #94a3b8;
    background: #f8fafc;
  }

  .user-name b {
    color: #1e293b;
    font-weight: 600;
  }

  .user-role-tag {
    height: 20px;
    padding: 0 6px;
    font-size: 11px;
    font-weight: 600;
  }
}
</style>

