<template>
  <div class="combo-material-container">
    <!-- 1. 顶部数据看板 & 组合类型透视 -->
    <div class="stat-overview-row">
      <div 
        class="stat-card" 
        :class="{ active: filterForm.comboType === '' && filterForm.status === '' }"
        @click="handleFilterAll"
      >
        <div class="stat-content">
          <div class="stat-label">组合物料总数</div>
          <div class="stat-num text-primary">{{ totalComboCount }} <span class="unit">款</span></div>
          <div class="stat-desc">涵盖多包、打包、搭配、套系</div>
        </div>
        <div class="stat-icon-box bg-blue">
          <el-icon><Box /></el-icon>
        </div>
      </div>

      <div 
        class="stat-card" 
        :class="{ active: filterForm.status === '待审核' }"
        @click="handleFilterPendingAudit"
      >
        <div class="stat-content">
          <div class="stat-label">
            <span class="type-badge badge-warning">审批中</span>
          </div>
          <div class="stat-num text-warning">{{ pendingAuditCount }} <span class="unit">款</span></div>
          <div class="stat-desc">新提交物料 · 等待主管审核</div>
        </div>
        <div class="stat-icon-box bg-amber">
          <el-icon><Stamp /></el-icon>
        </div>
      </div>

      <div 
        class="stat-card" 
        :class="{ active: filterForm.comboType === '多件打包' }"
        @click="filterForm.comboType = filterForm.comboType === '多件打包' ? '' : '多件打包'"
      >
        <div class="stat-content">
          <div class="stat-label">
            <span class="type-badge badge-gray">多件打包</span>
          </div>
          <div class="stat-num">{{ statsByType['多件打包'] || 0 }} <span class="unit">款</span></div>
          <div class="stat-desc">同款多件 · 原箱乘倍销售</div>
        </div>
        <div class="stat-icon-box bg-slate">
          <el-icon><CopyDocument /></el-icon>
        </div>
      </div>

      <div 
        class="stat-card" 
        :class="{ active: filterForm.comboType === '一物多包' }"
        @click="filterForm.comboType = filterForm.comboType === '一物多包' ? '' : '一物多包'"
      >
        <div class="stat-content">
          <div class="stat-label">
            <span class="type-badge badge-warning">一物多包</span>
          </div>
          <div class="stat-num text-amber-600">{{ statsByType['一物多包'] || 0 }} <span class="unit">款</span></div>
          <div class="stat-desc">单品超大拆多箱 · 缺一不可</div>
        </div>
        <div class="stat-icon-box bg-amber-gradient">
          <el-icon><Grid /></el-icon>
        </div>
      </div>

      <div 
        class="stat-card" 
        :class="{ active: filterForm.comboType === '成套组合' }"
        @click="filterForm.comboType = filterForm.comboType === '成套组合' ? '' : '成套组合'"
      >
        <div class="stat-content">
          <div class="stat-label">
            <span class="type-badge badge-primary">成套组合</span>
          </div>
          <div class="stat-num text-indigo">{{ statsByType['成套组合'] || 0 }} <span class="unit">款</span></div>
          <div class="stat-desc">独立家具整合 · 大套系销售</div>
        </div>
        <div class="stat-icon-box bg-purple">
          <el-icon><Collection /></el-icon>
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

    <!-- 3. 操作工具栏 (已移除从标准库选用按钮) -->
    <div class="ak-operate-container">
      <div class="ak-operate-section">
        <el-button type="primary" icon="Plus" size="small" @click="handleOpenCreateDialog">
          新建组合物料
        </el-button>
        <el-button type="success" plain icon="Upload" size="small" @click="handleOpenImportDialog">
          批量导入组合物料
        </el-button>
        <el-button 
          type="danger" 
          icon="Delete" 
          size="small" 
          :disabled="!selectedRows.length"
          @click="handleBatchDelete"
        >
          批量删除 ({{ selectedRows.length }})
        </el-button>
        <el-button icon="Download" size="small" @click="handleExportCsv">
          导出 BOM 清单
        </el-button>
      </div>

      <div class="ak-table-btn">
        <el-button 
          link 
          type="primary" 
          icon="DocumentCopy" 
          size="small" 
          @click="toggleExpandAll"
        >
          {{ isAllExpanded ? '全部收起 BOM' : '全部展开 BOM' }}
        </el-button>
        <el-button 
          type="info" 
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

    <!-- 本次导入结果提示与操作快捷条 -->
    <transition name="el-zoom-in-top">
      <div v-if="newlyImportedCodes.length > 0" class="newly-imported-banner">
        <div class="banner-left">
          <div class="banner-icon-box">
            <el-icon><CircleCheckFilled /></el-icon>
          </div>
          <div class="banner-info">
            <span class="banner-title">
              本次成功导入 <b>{{ newlyImportedCodes.length }}</b> 款组合物料
            </span>
            <span class="banner-desc">（已为您在列表中优先置顶并进行淡绿高亮标注）</span>
          </div>
          <el-tag size="small" :type="lastImportTargetStatus === '待审核' ? 'warning' : 'info'" effect="light" class="ml-2">
            业务状态：{{ lastImportTargetStatus === '待审核' ? '待产品线负责人审核' : '暂存待提交草稿' }}
          </el-tag>
        </div>
        <div class="banner-right">
          <el-button 
            size="small" 
            :type="isFilteringOnlyImported ? 'primary' : 'default'" 
            plain 
            @click="isFilteringOnlyImported = !isFilteringOnlyImported"
          >
            <el-icon class="mr-1"><Filter /></el-icon>
            {{ isFilteringOnlyImported ? '显示全部物料' : '仅看本次导入' }}
          </el-button>
          <el-button 
            size="small" 
            link 
            type="primary" 
            @click="importResultDialogVisible = true"
          >
            <el-icon class="mr-1"><Document /></el-icon> 查看导入报告
          </el-button>
          <el-button 
            size="small" 
            link 
            type="info" 
            @click="handleClearImportHighlight"
          >
            <el-icon class="mr-1"><Close /></el-icon> 清除高亮
          </el-button>
        </div>
      </div>
    </transition>

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
              <div class="expand-bom-header">
                <div class="bom-title">
                  <el-icon class="mr-1 text-primary"><Connection /></el-icon>
                  <span>组合物料 <b>[{{ row.parentCode }}]</b> BOM 结构展开清单（共 <b>{{ (row.children || []).length }}</b> 项子部件）</span>
                </div>
                <div class="bom-badge-info">
                  <span class="type-tag-sub">组合类型：{{ row.comboType }}</span>
                  <span class="total-ratio">单套整件累计：{{ calculateTotalRatio(row.children) }} 件</span>
                </div>
              </div>

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
                <el-table-column label="物料编码" prop="childCode" min-width="150">
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
                    <el-tag size="small" type="primary" effect="dark" class="font-bold font-mono">
                      1:{{ child.ratio }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="产品名称" prop="childProductName" min-width="140" show-overflow-tooltip>
                  <template #default="{ row: child }">
                    <span class="font-medium text-slate-800">{{ child.childProductName || child.childName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="款式" prop="childStyle" width="110" show-overflow-tooltip>
                  <template #default="{ row: child }">
                    <span>{{ child.childStyle || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="主材料" prop="childMaterial" min-width="130" show-overflow-tooltip>
                  <template #default="{ row: child }">
                    <span>{{ child.childMaterial || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="适用品牌或对象" prop="childTarget" width="130" show-overflow-tooltip>
                  <template #default="{ row: child }">
                    <span class="text-xs text-gray-600">{{ child.childTarget || '通用' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="型号" prop="childModel" width="110" show-overflow-tooltip>
                  <template #default="{ row: child }">
                    <span class="font-mono text-xs">{{ child.childModel || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="公司品牌" prop="childBrand" width="95" align="center">
                  <template #default="{ row: child }">
                    <el-tag size="small" effect="plain" type="info">{{ child.childBrand || '中性' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="颜色" prop="childColor" width="100" align="center">
                  <template #default="{ row: child }">
                    <el-tag v-if="child.childColor" size="small" effect="plain" type="success">
                      {{ child.childColor }}
                    </el-tag>
                    <span v-else class="text-gray-400">-</span>
                  </template>
                </el-table-column>
                <el-table-column label="包装数量" prop="childPackQty" width="95" align="center">
                  <template #default="{ row: child }">
                    <span class="font-mono text-gray-600">{{ child.childPackQty || '1pack' }}</span>
                  </template>
                </el-table-column></el-table>
            </div>
          </template>
        </el-table-column>

        <el-table-column type="index" label="序号" width="55" align="center" />

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
              <el-tag 
                v-if="row.isNewlyImported" 
                size="small" 
                type="success" 
                effect="dark" 
                class="newly-imported-tag"
              >
                本次导入
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="运营大类" prop="category" width="115" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag size="small" effect="plain" type="info">
              {{ row.category || '家具/室内家具' }}
            </el-tag>
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
            <span class="text-xs text-gray-700">{{ row.brand || '中性' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="颜色" prop="color" width="75" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.color" size="small" effect="light" type="info">
              {{ row.color }}
            </el-tag>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>

        <el-table-column label="包装数量" prop="packQty" width="80" align="center">
          <template #default="{ row }">
            <span class="font-mono text-gray-600">{{ row.packQty || (row.children?.length ? `${row.children.length}pack` : '1pack') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="组合类型" prop="comboType" width="100" align="center">
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
            <div class="bom-count-pill">
              <span class="num">{{ (row.children || []).length }}</span>
              <span class="sub">项子件</span>
            </div>
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
              <el-icon class="mr-1"><Check /></el-icon>审核通过
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="审核流程" min-width="165" align="center">
          <template #default="{ row }">
            <div class="audit-flow-summary-cell">
              <!-- 待审核状态 -->
              <div v-if="row.auditStatus === '待审核' || row.status === '待审核'" class="flow-badge-row">
                <el-tag size="small" type="warning" effect="dark" class="flow-pill-tag">
                  <el-icon class="is-loading mr-1"><Loading /></el-icon> 节点1: 审批中
                </el-tag>
                <div class="flow-sub-tip">
                  <span>待</span><b class="text-slate-800">{{ row.productLineLeader || '夏忠保' }}</b><span>审核</span>
                </div>
              </div>

              <!-- 待提交状态 -->
              <div v-else-if="row.auditStatus === '待提交' || row.auditStatus === '草稿' || row.status === '草稿'" class="flow-badge-row">
                <el-tag size="small" type="info" effect="plain" class="flow-pill-tag">
                  暂存草稿 (待提交)
                </el-tag>
                <div class="flow-sub-tip text-gray-400">
                  <span>创建人：{{ row.operator || '美区运营' }}</span>
                </div>
              </div>

              <!-- 已驳回状态 -->
              <div v-else-if="row.auditStatus === '已驳回'" class="flow-badge-row">
                <el-tooltip :content="row.auditRemark ? `驳回原因：${row.auditRemark}` : '审核已驳回，可点击编辑修改后重新提交'" placement="top">
                  <el-tag size="small" type="danger" effect="plain" class="flow-pill-tag cursor-pointer">
                    <el-icon class="mr-1"><Close /></el-icon> 节点1: 已驳回
                  </el-tag>
                </el-tooltip>
                <div class="flow-sub-tip text-red-600 font-medium">
                  <span>可编辑后再次提交</span>
                </div>
              </div>

              <!-- 审核不通过状态 -->
              <div v-else-if="row.auditStatus === '审核不通过'" class="flow-badge-row">
                <el-tooltip :content="row.auditRemark ? `不通过原因：${row.auditRemark}` : '单据审核不予通过，已归档不可删除'" placement="top">
                  <el-tag size="small" type="danger" effect="dark" class="flow-pill-tag cursor-pointer">
                    <el-icon class="mr-1"><CircleClose /></el-icon> 审核不通过
                  </el-tag>
                </el-tooltip>
                <div class="flow-sub-tip text-gray-500">
                  <span>已归档 · 不可删除</span>
                </div>
              </div>

              <!-- 审核通过状态 -->
              <div v-else class="flow-badge-row">
                <el-tag size="small" type="success" effect="plain" class="flow-pill-tag">
                  <el-icon class="mr-1"><Check /></el-icon> 流程办结 · 已生效
                </el-tag>
                <div class="flow-sub-tip text-emerald-600">
                  <span>审批人：{{ row.productLineLeader || '夏忠保' }}</span>
                </div>
              </div>

              <!-- 快捷查看流程详情入口 -->
              <el-button 
                link 
                type="primary" 
                size="small" 
                class="view-flow-btn mt-1" 
                @click="handleViewWorkflow(row)"
              >
                查看流程
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="210" fixed="right">
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

            <!-- 删除按钮：审核通过或不通过不可删除 -->
            <el-tooltip 
              v-if="isRowNonDeletable(row)" 
              content="审核通过或不通过的组合物料不可删除" 
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
              <span class="step-title">属性智能推导与核验</span>
              <span class="step-sub">品名/材质/参数自动聚合</span>
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
                <div class="mode-core">{{ item.coreRule }}</div>
                <div class="mode-desc">{{ item.shortDesc }}</div>
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

          <!-- 步骤 2：属性智能推导与核验 (Auto-Enriched Attributes) -->
          <div v-show="currentStep === 2" class="step-content-box">
            <div class="pane-headline">
              <span class="badge-step-dot">Step 2</span>
              <span class="title">核验智能推导属性与基础资料</span>
              <span class="desc">系统已根据步骤 1 的 BOM 子物料自动合并了产品名称、材质与包装规格</span>
            </div>

            <!-- 智能推导高光 Banner -->
            <div class="auto-derive-banner">
              <div class="banner-left">
                <el-icon class="magic-icon"><MagicStick /></el-icon>
                <div>
                  <div class="banner-title">✨ BOM 智能推导引擎已完成聚合</div>
                  <div class="banner-sub">
                    推荐品名：<b>{{ formData.productName || '未命名' }}</b> ；
                    主材质：<b>{{ formData.material || '待提取' }}</b> ；
                    包装总数：<b>{{ formData.packQty || '1pack' }}</b>
                  </div>
                </div>
              </div>
              <el-button size="small" type="primary" plain @click="forceReDerive">
                重新按子物料聚合
              </el-button>
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

              <!-- 审批流精准推送产品线负责人联动条 -->
              <div class="leader-matched-badge mt-3">
                <el-icon class="mr-1 text-primary"><Connection /></el-icon>
                <span>
                  审批流推送联动：已根据【<b>{{ formData.salesPlatform }}</b>】平台 +【<b>{{ formData.category }}</b>】大类，从产品线管理精准检索出产品线负责人：
                </span>
                <el-tag size="small" type="success" effect="dark" class="font-bold ml-1 mr-1">
                  {{ currentMatchedLeaderInfo.leader }}
                </el-tag>
                <span class="text-xs text-gray-600">
                  (对应产品线：{{ currentMatchedLeaderInfo.lineName }} / {{ currentMatchedLeaderInfo.lineCode }}，提交后将直接推送至其审核队列)
                </span>
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
              暂存草稿
            </el-button>

            <el-button 
              v-if="currentStep < 3" 
              type="primary" 
              icon="ArrowRight" 
              @click="nextWizardStep"
            >
              下一步：{{ currentStep === 1 ? '属性智能推导与核验' : '采购与装箱规格' }}
            </el-button>

            <el-button 
              v-else 
              type="primary" 
              class="submit-deep-btn" 
              :loading="saving" 
              @click="handleSaveCombo(true)"
            >
              <el-icon class="mr-1"><Promotion /></el-icon>
              提交并推送审核
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
      title="组合物料业务审核处理"
      width="560px"
      destroy-on-close
      class="audit-action-dialog"
    >
      <div v-if="activeAuditRow" class="audit-action-modal-body">
        <div class="audit-target-card">

          <div class="target-item">
            <span class="label">组合品名：</span>
            <span class="val font-medium text-slate-800">{{ activeAuditRow.productName }}</span>
          </div>
          <div class="target-item">
            <span class="label">组合类型：</span>
            <span class="val">{{ activeAuditRow.comboType }}</span>
          </div>
          <div class="target-item">
            <span class="label">当前状态：</span>
            <el-tag size="small" type="warning" effect="light"><el-icon class="mr-1"><Clock /></el-icon>待审核</el-tag>
          </div>
          <div class="target-item">
            <span class="label">审批责任人：</span>
            <span class="val font-bold text-emerald-600">{{ activeAuditRow.productLineLeader || '夏忠保 (产品线负责人)' }}</span>
          </div>
        </div>

        <el-form label-width="90px" class="mt-4 audit-decision-form">
          <el-form-item label="审核结果" required>
            <el-radio-group v-model="auditDecision">
              <el-radio label="pass">
                <span class="text-success font-bold text-sm">通过</span>
                <span class="text-xs text-gray-400 font-normal">（自动分配正式物料编码，单据生效不可删）</span>
              </el-radio>
              <el-radio label="reject">
                <span class="text-warning font-bold text-sm">驳回</span>
                <span class="text-xs text-gray-400 font-normal">（单据退回可编辑，操作员可修改后重提）</span>
              </el-radio>
              <el-radio label="disapprove">
                <span class="text-danger font-bold text-sm">不通过</span>
                <span class="text-xs text-gray-400 font-normal">（审批不通过归档，不可删除）</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item 
            label="审核意见" 
            :required="auditDecision !== 'pass'"
          >
            <el-input 
              v-model="auditRemark" 
              type="textarea" 
              :rows="3" 
              :placeholder="auditDecision === 'pass' ? '可输入审核附言（选填）...' : (auditDecision === 'reject' ? '请输入驳回原因，便于操作人员据此修改后重新提交（必填）...' : '请输入不通过原因说明（必填）...')" 
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="auditModalVisible = false">取消</el-button>
        <el-button 
          :type="auditDecision === 'pass' ? 'success' : (auditDecision === 'reject' ? 'warning' : 'danger')" 
          :loading="auditSubmitting" 
          @click="handleConfirmAuditModal"
        >
          确定提交审核结果
        </el-button>
      </template>
    </el-dialog>

    <!-- 7. 对话框：【推送审批流详情 / 审核进度弹窗】 -->
    <el-dialog
      v-model="workflowDialogVisible"
      title="组合物料多级审批流进度"
      width="680px"
      destroy-on-close
    >
      <div v-if="activeWorkflowRow" class="workflow-modal-body">
        <div class="wf-summary-box">
          <div class="row"><span class="k">组合物料品名：</span><span class="v font-bold text-slate-800">{{ activeWorkflowRow.productName }}</span></div>
          <div class="row"><span class="k">组合物料编码：</span><span class="v font-mono font-bold text-primary">{{ activeWorkflowRow.parentCode || '审核通过后系统自动生成' }}</span></div>
          <div class="row"><span class="k">运营大类：</span><span class="v text-gray-700">{{ activeWorkflowRow.category || '家具/室内家具' }}</span></div>
          <div class="row"><span class="k">产品线负责人：</span><span class="v font-bold text-emerald-600">{{ activeWorkflowRow.productLineLeader || '夏忠保' }}</span></div>
          <div class="row"><span class="k">产品经理：</span><span class="v text-slate-700">{{ activeWorkflowRow.productManager || '张经理 (产品经理)' }}</span></div>
          <div class="row"><span class="k">运营人员：</span><span class="v text-slate-700">{{ activeWorkflowRow.operator || '美区运营-Lucy' }}</span></div>
          <div class="row">
            <span class="k">当前业务状态：</span>
            <el-tag v-if="activeWorkflowRow.auditStatus === '待审核' || activeWorkflowRow.status === '待审核'" type="warning" size="small">
              <el-icon class="mr-1"><Clock /></el-icon>待审核
            </el-tag>
            <el-tag v-else-if="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿'" type="info" size="small">
              待提交
            </el-tag>
            <el-tag v-else-if="activeWorkflowRow.auditStatus === '已驳回'" type="danger" effect="plain" size="small">
              <el-icon class="mr-1"><Close /></el-icon>已驳回
            </el-tag>
            <el-tag v-else-if="activeWorkflowRow.auditStatus === '审核不通过'" type="danger" effect="dark" size="small">
              审核不通过
            </el-tag>
            <el-tag v-else type="success" size="small">
              <el-icon class="mr-1"><Check /></el-icon>审核通过 (已生效)
            </el-tag>
          </div>
        </div>

        <div class="wf-timeline-wrap mt-4">
          <el-timeline>
            <!-- 步骤 1：暂存操作 -->
            <el-timeline-item 
              timestamp="2026-09-22 09:30" 
              placement="top" 
              type="success" 
              icon="Document"
            >
              <div class="timeline-title font-medium text-slate-800">步骤一：暂存草稿 (状态: 待提交)</div>
              <div class="timeline-desc text-xs text-gray-500 mt-1">
                操作人员：<b>{{ activeWorkflowRow.operator || '美区运营-Lucy' }}</b>，完成子部件 BOM 清单关联与单套配比录入，暂存为【待提交】业务状态。
              </div>
            </el-timeline-item>

            <!-- 步骤 2：提交操作 -->
            <el-timeline-item 
              v-if="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿'"
              timestamp="等待发起提交" 
              placement="top" 
              type="info" 
              icon="Clock"
            >
              <div class="timeline-title font-medium text-gray-400">步骤二：提交审核 (待发起)</div>
              <div class="timeline-desc text-xs text-gray-400 mt-1">
                单据暂存中，操作人员可点击列表【编辑】按钮完善信息后，点击【提交并推送审核】。
              </div>
            </el-timeline-item>
            <el-timeline-item 
              v-else
              timestamp="2026-09-22 10:15" 
              placement="top" 
              type="success" 
              icon="Check"
            >
              <div class="timeline-title font-medium text-slate-800">步骤二：提交申请 (状态: 待审核)</div>
              <div class="timeline-desc text-xs text-gray-500 mt-1">
                操作人员：<b>{{ activeWorkflowRow.operator || '美区运营-Lucy' }}</b> 已确认物料信息并提交审核；单据自动派发至产品线负责人 <b>【{{ activeWorkflowRow.productLineLeader || '夏忠保' }}】</b> 待办队列。
              </div>
            </el-timeline-item>

            <!-- 步骤 3：审核操作 -->
            <el-timeline-item 
              v-if="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿'"
              timestamp="等待提交后触发" 
              placement="top" 
              type="info"
            >
              <div class="timeline-title font-medium text-gray-400">步骤三：审核操作 (未触发)</div>
              <div class="timeline-desc text-xs text-gray-400 mt-1">
                待提交申请后，将由产品线负责人 <b>【{{ activeWorkflowRow.productLineLeader || '夏忠保' }}】</b> 进行定品与 BOM 关系审核。
              </div>
            </el-timeline-item>

            <el-timeline-item 
              v-else-if="activeWorkflowRow.auditStatus === '待审核' || activeWorkflowRow.status === '待审核'"
              timestamp="审核处理中..." 
              placement="top" 
              type="warning" 
              icon="Loading"
            >
              <div class="timeline-title font-medium text-amber-600">步骤三：审核操作 (待审核处理)</div>
              <div class="timeline-desc text-xs text-gray-600 mt-1">
                审批责任人：<b class="text-slate-800">{{ activeWorkflowRow.productLineLeader || '夏忠保' }}</b>（产品线负责人，根据运营大类自动路由派单）
              </div>
              <div class="mt-2 flex gap-2">
                <el-button type="success" size="small" @click="handlePassAudit(activeWorkflowRow)">通过 (分配物料编码)</el-button>
                <el-button type="warning" size="small" plain @click="handleRejectAudit(activeWorkflowRow)">驳回 (退回修改)</el-button>
                <el-button type="danger" size="small" plain @click="handleDisapproveAudit(activeWorkflowRow)">不通过 (归档)</el-button>
              </div>
            </el-timeline-item>

            <el-timeline-item 
              v-else
              timestamp="2026-09-22 11:15" 
              placement="top" 
              type="success" 
              icon="Check"
            >
              <div class="timeline-title font-medium text-slate-800">步骤三：审核操作 (已完成业务评估)</div>
              <div class="timeline-desc text-xs text-gray-500 mt-1">
                审批责任人：<b>{{ activeWorkflowRow.productLineLeader || '夏忠保' }}</b> 已完成定品合规性与 BOM 齐套性复核。
              </div>
            </el-timeline-item>

            <!-- 步骤 4：已审核节点 (终审结果) -->
            <el-timeline-item 
              v-if="activeWorkflowRow.auditStatus === '待提交' || activeWorkflowRow.auditStatus === '草稿'"
              timestamp="待提交与审核" 
              placement="top" 
              type="info"
            >
              <div class="timeline-title font-medium text-gray-400">步骤四：已审核节点 (未开始)</div>
              <div class="timeline-desc text-xs text-gray-400 mt-1">
                单据尚未提交与审核，待审核完成后在此生成终审结果与物料正式编码。
              </div>
            </el-timeline-item>

            <el-timeline-item 
              v-else-if="activeWorkflowRow.auditStatus === '待审核' || activeWorkflowRow.status === '待审核'"
              timestamp="待生成审核结论" 
              placement="top" 
              type="info" 
              icon="Clock"
            >
              <div class="timeline-title font-medium text-gray-500">步骤四：已审核节点 (等待审核结论)</div>
              <div class="timeline-desc text-xs text-gray-400 mt-1">
                等待产品线负责人给出审核结论（通过 / 驳回 / 不通过）。审核通过后系统将正式分配组合编码并生效启用。
              </div>
            </el-timeline-item>

            <el-timeline-item 
              v-else-if="activeWorkflowRow.auditStatus === '已驳回'"
              timestamp="2026-09-22 11:20" 
              placement="top" 
              type="danger" 
              icon="Close"
            >
              <div class="timeline-title font-medium text-red-600">步骤四：已审核节点 (已驳回退回修改)</div>
              <div class="timeline-desc text-xs text-gray-600 mt-1">
                审批结论：<b class="text-red-600">已驳回</b> ｜ 审批责任人：<b class="text-slate-800">{{ activeWorkflowRow.productLineLeader || '夏忠保' }}</b>
              </div>
              <div class="mt-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded border border-amber-200">
                <b>驳回意见：</b>{{ activeWorkflowRow.auditRemark || 'BOM单套配比核对有误，建议核查后再重新提交' }}
                <div class="text-xs text-gray-500 mt-1">提示：单据已退回，操作人员可直接在列表点击【编辑】修改后再次提交审核。</div>
              </div>
            </el-timeline-item>

            <el-timeline-item 
              v-else-if="activeWorkflowRow.auditStatus === '审核不通过'"
              timestamp="2026-09-22 11:20" 
              placement="top" 
              type="danger" 
              icon="CircleClose"
            >
              <div class="timeline-title font-medium text-red-600">步骤四：已审核节点 (审核不通过)</div>
              <div class="timeline-desc text-xs text-gray-600 mt-1">
                审批结论：<b class="text-red-600">不予通过</b> ｜ 审批责任人：<b class="text-slate-800">{{ activeWorkflowRow.productLineLeader || '夏忠保' }}</b>
              </div>
              <div class="mt-2 text-xs text-red-800 bg-red-50 p-2.5 rounded border border-red-200">
                <b>不通过原因：</b>{{ activeWorkflowRow.auditRemark || '材质参数未达标，不符合上架规范' }}
                <div class="text-xs text-gray-500 mt-1">提示：单据已终审归档留存，且根据规则不可删除。</div>
              </div>
            </el-timeline-item>

            <el-timeline-item 
              v-else
              timestamp="2026-09-22 11:20" 
              placement="top" 
              type="success" 
              icon="Check"
            >
              <div class="timeline-title font-medium text-emerald-600">步骤四：已审核节点 (审核通过 · 正式生效)</div>
              <div class="timeline-desc text-xs text-gray-600 mt-1">
                审批结论：<b class="text-emerald-600">审核通过</b> ｜ 审批责任人：<b class="text-slate-800">{{ activeWorkflowRow.productLineLeader || '夏忠保' }}</b>
              </div>
              <div class="mt-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200">
                <b>审核结论：</b>审核通过，系统已正式分配组合物料编码 <b class="font-mono text-primary">[{{ activeWorkflowRow.parentCode }}]</b>，已正式生效启用并同步海外仓看板！根据规则不可删除。
              </div>
            </el-timeline-item>
          </el-timeline>
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

    <!-- 8.5. 对话框：【批量导入组合物料 (含BOM配置规范与模板下载)】 -->
    <el-dialog
      v-model="importDialogVisible"
      title="批量导入组合物料 (含 BOM 清单与规范字典)"
      width="920px"
      destroy-on-close
      class="import-modal-dialog"
    >
      <div class="import-dialog-body">
        <!-- 步骤 1：模板下载与字段规范说明 -->
        <div class="import-step-card mb-3">
          <div class="step-card-header">
            <span class="step-badge">步骤 1</span>
            <span class="step-title">下载标准 Excel 导入模板并按规范填写</span>
          </div>

          <div class="template-box">
            <div class="template-left">
              <div class="excel-icon-pill">
                <span class="excel-ext">XLSX</span>
              </div>
              <div class="template-meta">
                <div class="template-main-title">
                  组合物料批量导入标准模板
                  <span class="version-tag">V2.2 规范版</span>
                </div>
                <div class="template-tags-row">
                  <span class="meta-tag tag-blue">{{ COMBO_TEMPLATE_COLUMNS.length }} 项标准字段</span>
                  <span class="meta-tag tag-purple">内置 4 大组合类型范例</span>
                  <span class="meta-tag tag-teal">双 Sheet 规范字典说明</span>
                </div>
              </div>
            </div>

            <div class="template-actions">
              <el-button type="primary" class="download-btn" size="small" @click="downloadImportTemplate">
                <el-icon class="mr-1"><Download /></el-icon>
                下载标准模板 (.xlsx)
              </el-button>
              <el-button type="default" size="small" @click="showTemplateSpec = !showTemplateSpec">
                <el-icon class="mr-1"><Tickets /></el-icon>
                {{ showTemplateSpec ? '收起填写规范' : `查看字段规范 (${COMBO_TEMPLATE_COLUMNS.length} 项)` }}
              </el-button>
            </div>
          </div>

          <!-- 规范要点提醒条 -->
          <div class="template-notice-bar">
            <el-icon class="notice-icon"><InfoFilled /></el-icon>
            <span><b>填写指引：</b>粉红底色且标“*”为必填字段；子物料与单套配比用英文分号 (;) 分隔；严禁删除或调换表头列顺序。</span>
          </div>

          <!-- 模板填写规范说明卡片 (展开查看) -->
          <el-collapse-transition>
            <div v-show="showTemplateSpec" class="template-spec-table-box mt-2.5">
              <div class="spec-header-row">
                <div class="spec-title">
                  <el-icon class="mr-1 text-primary"><Tickets /></el-icon>
                  <span>严格按新建页面字段顺序排列的规范清单（共 {{ COMBO_TEMPLATE_COLUMNS.length }} 项）：</span>
                </div>
                <span class="spec-required-tip">标有 * 号为必填项</span>
              </div>
              <div class="spec-table-scroll">
                <table class="spec-mini-table">
                  <thead>
                    <tr>
                      <th width="45" align="center">#</th>
                      <th width="140">字段名称</th>
                      <th width="85" align="center">必填状态</th>
                      <th width="130">所属业务模块</th>
                      <th width="160">示范值</th>
                      <th>填写规范与说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(col, cIdx) in COMBO_TEMPLATE_COLUMNS" :key="col.key">
                      <td align="center" class="col-index">{{ cIdx + 1 }}</td>
                      <td class="col-name">
                        <span :class="{ 'required-name': col.required }">
                          {{ col.required ? '* ' : '' }}{{ col.label }}
                        </span>
                      </td>
                      <td align="center">
                        <span class="status-pill" :class="col.required ? 'pill-req' : 'pill-opt'">
                          {{ col.required ? '必填' : '非必填' }}
                        </span>
                      </td>
                      <td>
                        <span class="category-pill">{{ col.category }}</span>
                      </td>
                      <td><code class="example-code">{{ col.example }}</code></td>
                      <td class="col-desc">{{ col.desc }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </el-collapse-transition>
        </div>

        <!-- 步骤 2：上传并解析文件 -->
        <div class="import-step-card mb-3">
          <div class="step-card-header">
            <span class="step-badge">步骤 2</span>
            <span class="step-title">上传并解析 Excel 模板文件</span>
          </div>

          <!-- 未上传状态：现代轻盈上传拖拽框 -->
          <div v-if="!importPreviewList.length" class="upload-zone-wrapper">
            <el-upload
              ref="importUploadRef"
              drag
              action=""
              accept=".csv,.xlsx,.xls"
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
                  支持标准 .xlsx / .xls / .csv 格式，单次最大支持解析 500 款组合物料
                </div>
              </div>
            </el-upload>
          </div>

          <!-- 已解析状态：精简高颜值文件状态条（避免占用大块多余空间） -->
          <div v-else class="file-parsed-status-card">
            <div class="file-info-left">
              <div class="file-icon-box">
                <el-icon><Document /></el-icon>
              </div>
              <div class="file-text-details">
                <div class="file-name-line">
                  <span class="file-name">{{ uploadedFileName || '已解析数据文件.xlsx' }}</span>
                  <span v-if="uploadedFileSize" class="file-size">({{ uploadedFileSize }})</span>
                  <span class="parse-success-tag">
                    <el-icon class="mr-0.5"><SuccessFilled /></el-icon> 解析成功
                  </span>
                </div>
                <div class="file-stat-line">
                  共识别到 <b class="text-primary">{{ importPreviewList.length }}</b> 款有效组合物料，包含 <b class="text-slate-800">{{ totalParsedChildCount }}</b> 项 BOM 子部件关联
                </div>
              </div>
            </div>
            <div class="file-actions-right">
              <el-button size="small" @click="handleResetUpload">
                <el-icon class="mr-1"><Refresh /></el-icon>
                重新选择文件
              </el-button>
            </div>
          </div>
        </div>

        <!-- 步骤 3：数据核对与目标单据状态 -->
        <div v-if="importPreviewList.length" class="import-step-card">
          <div class="step-card-header justify-between">
            <div class="flex items-center gap-2">
              <span class="step-badge">步骤 3</span>
              <span class="step-title">核对物料数据并配置单据业务状态</span>
            </div>
            <div class="status-selector-row">
              <span class="selector-label">导入后单据状态：</span>
              <el-radio-group v-model="importTargetStatus" size="small">
                <el-radio-button value="待提交">
                  暂存草稿 (待提交)
                </el-radio-button>
                <el-radio-button value="待审核">
                  直接提交审核 (待审核)
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <div class="preview-table-container">
            <el-table :data="importPreviewList.slice(0, 5)" border size="small" class="styled-preview-table">
              <el-table-column type="index" label="#" width="45" align="center" />
              <el-table-column label="组合品名" prop="productName" min-width="160" show-overflow-tooltip>
                <template #default="{ row }">
                  <div class="preview-name-cell">
                    <span class="name-text">{{ row.productName }}</span>
                    <span v-if="row.style" class="sub-style">{{ row.style }} / {{ row.material || '标准材质' }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="运营大类" prop="category" width="115" show-overflow-tooltip />
              <el-table-column label="组合类型" prop="comboType" width="105" align="center">
                <template #default="{ row }">
                  <span class="type-badge" :class="getComboTypeBadgeClass(row.comboType)">{{ row.comboType }}</span>
                </template>
              </el-table-column>
              <el-table-column label="BOM 配比清单" min-width="190" show-overflow-tooltip>
                <template #default="{ row }">
                  <div class="bom-tags-cell">
                    <span 
                      v-for="(c, cIdx) in (row.children || [])" 
                      :key="cIdx" 
                      class="bom-item-tag"
                    >
                      {{ c.childCode }}<em class="ratio">×{{ c.ratio }}</em>
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="协同负责人" width="160" show-overflow-tooltip>
                <template #default="{ row }">
                  <div class="personnel-cell">
                    <div class="p-line"><span class="k">产品:</span> {{ row.productManager || '未填' }}</div>
                    <div class="p-line text-gray-500"><span class="k">采购:</span> {{ row.purchaser || '未填' }} ｜ <span class="k">运营:</span> {{ row.operator || '未填' }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="一般属性" width="130" align="center">
                <template #default="{ row }">
                  <div class="flex flex-wrap gap-1 justify-center">
                    <el-tag size="small" effect="plain" :type="row.hasBattery === '是' ? 'warning' : 'info'">
                      {{ row.hasBattery === '是' ? '带电' : '普货' }}
                    </el-tag>
                    <el-tag v-if="row.isCeCategory === '是'" size="small" type="success" effect="plain">
                      CE认证
                    </el-tag>
                    <el-tag v-if="row.seasonTag && row.seasonTag !== '四季通用'" size="small" type="primary" effect="plain">
                      {{ row.seasonTag }}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <div class="preview-footer-notice">
              <span>当前展示前 5 条样本预览，确认导入后将完整入库共 <b>{{ importPreviewList.length }}</b> 款组合物料。</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="import-dialog-footer">
          <div class="footer-left-tip">
            <el-icon class="mr-1 text-primary"><InfoFilled /></el-icon>
            <span>提示：导入完成后数据将实时持久化至看板；若选择【待审核】将自动推送产品线负责人待办。</span>
          </div>
          <div class="footer-right-actions">
            <el-button @click="importDialogVisible = false">取消</el-button>
            <el-button 
              type="primary" 
              class="confirm-import-btn"
              :disabled="!importPreviewList.length" 
              :loading="importLoading"
              @click="handleConfirmImport"
            >
              确认批量导入 ({{ importPreviewList.length }} 款)
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 8.1 批量导入结果详细报告面板 -->
    <el-dialog
      v-model="importResultDialogVisible"
      title="批量导入执行报告"
      width="880px"
      destroy-on-close
      class="import-result-dialog"
      :close-on-click-modal="false"
    >
      <!-- 结果横幅头部 -->
      <div class="result-header-banner">
        <div class="result-badge-icon">
          <el-icon><CircleCheckFilled /></el-icon>
        </div>
        <div class="result-header-text">
          <div class="result-header-title">
            恭喜！批量导入组合物料已完成入库
          </div>
          <div class="result-header-desc">
            本次共解析并录入 <b>{{ importedBatchResult?.count || 0 }}</b> 款组合物料，已生成 <b>{{ importedBatchResult?.childCount || 0 }}</b> 个 BOM 子物料配比项。数据已实时持久化至系统看板！
          </div>
        </div>
        <div class="result-header-status">
          <el-tag :type="importedBatchResult?.status === '待审核' ? 'warning' : 'info'" size="large" effect="dark" class="status-pill">
            {{ importedBatchResult?.status === '待审核' ? '流转审批中 (待审核)' : '暂存草稿 (待提交)' }}
          </el-tag>
        </div>
      </div>

      <!-- 核心指标统计卡片 -->
      <div class="result-metric-grid">
        <div class="metric-card">
          <div class="metric-label">导入组合款式</div>
          <div class="metric-val text-primary">{{ importedBatchResult?.count || 0 }} <span class="unit">款</span></div>
          <div class="metric-tip">主组合物料已创建</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">包含 BOM 子部件</div>
          <div class="metric-val text-indigo">{{ importedBatchResult?.childCount || 0 }} <span class="unit">个</span></div>
          <div class="metric-tip">子物料与单套配比</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">初始业务状态</div>
          <div class="metric-val" :class="importedBatchResult?.status === '待审核' ? 'text-warning' : 'text-slate'">
            {{ importedBatchResult?.status || '待提交' }}
          </div>
          <div class="metric-tip">{{ importedBatchResult?.status === '待审核' ? '已自动推送负责人待办' : '可继续编辑并提交' }}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">协同审核负责人</div>
          <div class="metric-val text-emerald">{{ importedBatchResult?.leaderName || '夏忠保' }}</div>
          <div class="metric-tip">根据运营大类智能分配</div>
        </div>
      </div>

      <!-- 导入明细表格清单 -->
      <div class="result-table-box">
        <div class="box-title flex items-center justify-between mb-2">
          <span class="font-bold text-slate-700 flex items-center gap-1.5">
            <el-icon class="text-primary"><List /></el-icon> 本次成功入库组合物料清单
          </span>
          <span class="text-xs text-slate-400">已在列表中置顶并以淡绿色行高亮标识</span>
        </div>
        <el-table :data="importedBatchResult?.items || []" border size="small" max-height="290" stripe>
          <el-table-column type="index" label="#" width="45" align="center" />
          <el-table-column label="物料/流程单号" min-width="160">
            <template #default="{ row }">
              <span class="font-mono font-bold text-slate-700">{{ row.parentCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品名称" prop="productName" min-width="160" show-overflow-tooltip />
          <el-table-column label="运营大类" prop="category" width="115" show-overflow-tooltip />
          <el-table-column label="组合类型" prop="comboType" width="100">
            <template #default="{ row }">
              <el-tag size="small" effect="plain">{{ row.comboType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="BOM子项" width="95" align="center">
            <template #default="{ row }">
              <span class="text-xs text-blue-600 font-semibold">{{ row.children?.length || 0 }} 个部件</span>
            </template>
          </el-table-column>
          <el-table-column label="产品线负责人" width="115" align="center">
            <template #default="{ row }">
              <el-tag size="small" type="success" effect="plain">{{ row.productLineLeader || '夏忠保' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110" align="center" fixed="right">
            <template #default="{ row }">
              <el-button 
                v-if="row.auditStatus === '待审核'" 
                link 
                type="primary" 
                size="small" 
                icon="View" 
                @click="handleViewWorkflowFromResult(row)"
              >
                查看流程
              </el-button>
              <el-button 
                v-else 
                link 
                type="primary" 
                size="small" 
                icon="Edit" 
                @click="handleEditFromResult(row)"
              >
                编辑草稿
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <div class="result-dialog-footer">
          <div class="footer-left-tip text-xs text-slate-500 flex items-center">
            <el-icon class="mr-1 text-success"><CircleCheck /></el-icon>
            数据已同步至主表格首屏置顶，并以淡绿高亮标注
          </div>
          <div class="footer-right-buttons flex items-center gap-2">
            <el-button 
              v-if="importedBatchResult?.status === '待审核'" 
              type="warning" 
              plain 
              icon="Compass" 
              @click="handleViewFirstWorkflowFromResult"
            >
              查看首条审批流程
            </el-button>
            <el-button 
              type="primary" 
              icon="Check" 
              class="complete-btn"
              @click="handleCompleteAndHighlight"
            >
              在列表中高亮查看 (置顶显示)
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 9. 抽屉：四大组合类型标准定义规范与业务指南 -->
    <el-drawer
      v-model="showTypeGuideDrawer"
      size="720px"
      direction="rtl"
      custom-class="type-guide-drawer"
    >
      <template #header>
        <div class="guide-drawer-header flex items-center justify-between">
          <div class="flex items-center gap-2">
            <el-icon class="text-primary text-xl"><Guide /></el-icon>
            <span class="font-bold text-base text-slate-800">组合物料四大类型标准定义与作业规范</span>
          </div>
          <el-tag size="small" type="success" effect="plain" class="mr-4">ERP 标准规范 v2.2</el-tag>
        </div>
      </template>

      <div class="guide-drawer-content">
        <!-- 导语 Banner -->
        <div class="guide-banner-card">
          <div class="banner-title">
            <el-icon class="mr-1 text-primary"><Compass /></el-icon>
            <span>为什么必须规范定义组合类型？</span>
          </div>
          <div class="banner-desc">
            组合家具在供应链与海外仓履约中存在<b>「整箱发货」</b>、<b>「多箱齐套」</b>与<b>「混包组装」</b>等截然不同的物流作业逻辑。准确界定组合类型，是保障 ERP 需求计算、海外仓出库防错以及 BOM 结构齐套的根本依据。
          </div>
        </div>

        <!-- 3秒快速判定决策导航 -->
        <div class="decision-guide-card mt-4">
          <div class="sec-title">
            <el-icon class="mr-1 text-amber-600"><HelpFilled /></el-icon>
            <span>3秒快速判定指引 (如何正确选择类型？)</span>
          </div>
          <div class="decision-flow-grid mt-2">
            <div class="decision-node bg-slate-50 border-slate-200">
              <div class="node-q">① 仅1种物料，原箱翻倍卖？</div>
              <div class="node-arrow">↓ 判定为</div>
              <div class="node-res text-slate-700 font-bold">多件打包 (1物*N)</div>
            </div>
            <div class="decision-node bg-amber-50 border-amber-200">
              <div class="node-q">② 单品超大，拆成A/B/C箱？</div>
              <div class="node-arrow">↓ 判定为</div>
              <div class="node-res text-amber-700 font-bold">一物多包 (A+B+C)</div>
            </div>
            <div class="decision-node bg-rose-50 border-rose-200">
              <div class="node-q">③ 核心专用款 + 通用公用配件？</div>
              <div class="node-arrow">↓ 判定为</div>
              <div class="node-res text-rose-700 font-bold">主附搭配 (主+附)</div>
            </div>
            <div class="decision-node bg-indigo-50 border-indigo-200">
              <div class="node-q">④ 多个独立单品，组合大套系？</div>
              <div class="node-arrow">↓ 判定为</div>
              <div class="node-res text-indigo-700 font-bold">成套组合 (套系)</div>
            </div>
          </div>
        </div>

        <!-- 横向特征对比速查表 -->
        <div class="matrix-table-card mt-4">
          <div class="sec-title">
            <el-icon class="mr-1 text-blue-600"><DataAnalysis /></el-icon>
            <span>四大组合类型特征对比矩阵</span>
          </div>
          <table class="guide-matrix-table mt-2">
            <thead>
              <tr>
                <th width="105">组合类型</th>
                <th width="115">子物料种类</th>
                <th width="120">子物料独立可售?</th>
                <th width="140">海外仓出库逻辑</th>
                <th>关键防错要点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="type-badge badge-gray">多件打包</span></td>
                <td>必须仅 1 种</td>
                <td><span class="text-emerald-600 font-medium">是</span> (单件可售)</td>
                <td>按箱规原箱乘倍发货</td>
                <td>配比必须大于1，禁止混挂其他物料</td>
              </tr>
              <tr>
                <td><span class="type-badge badge-warning">一物多包</span></td>
                <td>多件 (A/B/C箱)</td>
                <td><span class="text-red-500 font-medium">否</span> (拆包不可用)</td>
                <td>校验全套物理箱齐套方可放行</td>
                <td>子物料为该单品的分箱，缺一不可</td>
              </tr>
              <tr>
                <td><span class="type-badge badge-danger">主附搭配</span></td>
                <td>1主体 + N通用件</td>
                <td>主体是 / 配件可公用</td>
                <td>主体与公用配件合并贴标出库</td>
                <td>配件跨款式通用，提升备货柔性</td>
              </tr>
              <tr>
                <td><span class="type-badge badge-primary">成套组合</span></td>
                <td>多个独立单品</td>
                <td><span class="text-emerald-600 font-medium">是</span> (各子件均能单卖)</td>
                <td>多单品集结出库，客单价高</td>
                <td>必须全部为具备独立编码的现成品</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 四大类型深度解析卡片 -->
        <div class="type-detail-cards mt-4">
          <div class="sec-title mb-2">
            <el-icon class="mr-1 text-purple-600"><DocumentChecked /></el-icon>
            <span>标准定义深度解析与典型案例</span>
          </div>

          <div 
            v-for="item in comboTypeGuideList" 
            :key="item.type" 
            class="enhanced-guide-card"
            :class="'theme-' + item.badgeClass"
          >
            <div class="guide-card-top">
              <div class="flex items-center gap-2">
                <span class="type-badge" :class="item.badgeClass">{{ item.type }}</span>
                <span class="en-name font-mono text-xs text-gray-500">{{ item.enName }}</span>
              </div>
              <div class="core-rule-tag">{{ item.coreRule }}</div>
            </div>

            <div class="guide-card-body">
              <div class="info-row">
                <span class="info-label">业务本质：</span>
                <span class="info-val">{{ item.detailDesc }}</span>
              </div>

              <div class="feature-bullets mt-2">
                <div v-for="(feat, fIdx) in item.features" :key="fIdx" class="bullet-item">
                  <el-icon class="text-success text-xs mr-1"><Check /></el-icon>
                  <span>{{ feat }}</span>
                </div>
              </div>

              <div class="example-box mt-2.5">
                <div class="example-label">典型案例：</div>
                <code class="font-mono text-xs text-slate-800">{{ item.example }}</code>
              </div>

              <div class="guidelines-row mt-2">
                <div class="rule-chip chip-bom">
                  <span class="chip-k">BOM 维护：</span>
                  <span class="chip-v">{{ item.bomRules }}</span>
                </div>
                <div class="rule-chip chip-wh">
                  <span class="chip-k">仓储物流：</span>
                  <span class="chip-v">{{ item.whRule }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 常见混淆 FAQ -->
        <div class="guide-faq-card mt-4 mb-3">
          <div class="sec-title">
            <el-icon class="mr-1 text-teal-600"><QuestionFilled /></el-icon>
            <span>常见疑问与防混淆解答</span>
          </div>
          <div class="faq-item mt-2">
            <div class="faq-q">Q1: “一物多包” 与 “成套组合” 怎么区分？</div>
            <div class="faq-a"><b>关键看子件能否单独拿出去使用或销售：</b>若拆开后任何一个箱子都无法作为完整家具独立使用（如：沙发靠背箱、框架五金箱），则必须选<b>【一物多包】</b>；若每个子件本身就是一张完整的床、边柜或独立椅子，只是在电商上拼成套系卖，则必须选<b>【成套组合】</b>。</div>
          </div>
          <div class="faq-item mt-2">
            <div class="faq-q">Q2: 为什么主附搭配的通用配件不能直接做成一物多包？</div>
            <div class="faq-a">因为通用配件（如通用洗手盆、通用五金抽屉）通常会被多个不同款式的组合物料复用。若做成一物多包，会导致配件库存无法跨款调拨，造成大量死库。选用<b>【主附搭配】</b>才能最大化通用件的备货灵活性。</div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  generateStyledComboTemplateExcel,
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

// --- 基础状态 ---
const loading = ref(false)
const saving = ref(false)
const comboList = ref<any[]>([])
const selectedRows = ref<any[]>([])
const mainTableRef = ref<any>(null)
const isAllExpanded = ref(false)
const currentSubmitter = ref('当前登录人 (产品开发部)')

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

// 判断是否允许编辑：待提交、草稿、已驳回
const canEditRow = (row: any) => {
  const status = row.auditStatus || (row.status === '待审核' ? '待审核' : (row.status === '已启用' ? '审核通过' : '待提交'))
  return status === '待提交' || status === '草稿' || status === '已驳回'
}

// 获取编辑禁用原因提示
const getEditDisabledTip = (row: any) => {
  const status = row.auditStatus || row.status
  if (status === '待审核') {
    return '当前单据正在审核中，不可编辑；需先审核驳回后方可修改'
  }
  if (status === '审核通过' || status === '已启用' || row.status === '已生效') {
    return '已审核通过的物料单据不可直接编辑'
  }
  if (status === '审核不通过') {
    return '审核不通过的物料单据已归档，不可编辑'
  }
  return '当前状态不可编辑'
}

// 判断单据是否不可删除：审核通过或不通过 不可删除
const isRowNonDeletable = (row: any) => {
  const status = row.auditStatus || row.status
  return status === '审核通过' || status === '已启用' || status === '已生效' || status === '已绑定' && (!row.auditStatus || row.auditStatus === '已启用') || status === '审核不通过'
}

// 打开审核操作弹窗
const handleOpenAuditModal = (row: any) => {
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
  ElMessage.success('已根据当前 BOM 子部件清单完整推导并更新第 2、3 步属性！')
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

  // 若开启了【仅看本次导入】
  if (isFilteringOnlyImported.value && newlyImportedCodes.value.length > 0) {
    const newlySet = new Set(newlyImportedCodes.value)
    list = list.filter(item => newlySet.has(item.parentCode))
  }

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

  // 若有本次新导入的数据，自动置顶在最上方
  if (newlyImportedCodes.value.length > 0) {
    const newlySet = new Set(newlyImportedCodes.value)
    list = [...list].sort((a, b) => {
      const aIsNew = newlySet.has(a.parentCode) ? 1 : 0
      const bIsNew = newlySet.has(b.parentCode) ? 1 : 0
      return bIsNew - aIsNew
    })
  }

  return list
})

const pagedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const newlySet = new Set(newlyImportedCodes.value)
  return filteredTableData.value.slice(start, start + pageSize.value).map(item => ({
    ...item,
    salesPlatform: item.salesPlatform || 'Amazon',
    category: item.category || '家具/室内家具',
    brand: item.brand || '中性',
    auditRemark: (item as any).auditRemark || '',
    packQty: item.packQty || (item.boundChildren?.length ? `${item.boundChildren.length}pack` : (item.children?.length ? `${item.children.length}pack` : '1pack')),
    children: item.boundChildren || item.children || [],
    isNewlyImported: newlySet.has(item.parentCode)
  }))
})

// 表格行动态高亮样式类名
const getTableRowClassName = ({ row }: { row: any }) => {
  if (newlyImportedCodes.value.includes(row.parentCode)) {
    return 'row-newly-imported'
  }
  return ''
}

const comboTypeGuideList = computed(() => {
  return [
    {
      type: '多件打包',
      badgeClass: 'badge-gray',
      enName: 'Multi-Pack (1 SKU × N)',
      shortDesc: COMBO_TYPE_DEFINITIONS['多件打包'].shortDesc,
      coreRule: COMBO_TYPE_DEFINITIONS['多件打包'].coreRule,
      detailDesc: COMBO_TYPE_DEFINITIONS['多件打包'].detailDesc,
      example: COMBO_TYPE_DEFINITIONS['多件打包'].example,
      features: [
        '子物料品种只有 1 种（单套配比 N ≥ 2）',
        '供应商原厂原箱打包，仓库出库时不拆箱、不分拣',
        '主要用于椅子、抱枕、餐垫等小件或易成双成对销售商品'
      ],
      bomRules: '仅关联 1 项子物料，配比必须大于 1（如 1:2 或 1:4）',
      whRule: '原箱整箱发货，无需二次包装组装'
    },
    {
      type: '一物多包',
      badgeClass: 'badge-warning',
      enName: 'Multi-Box Single Item (A+B+C)',
      shortDesc: COMBO_TYPE_DEFINITIONS['一物多包'].shortDesc,
      coreRule: COMBO_TYPE_DEFINITIONS['一物多包'].coreRule,
      detailDesc: COMBO_TYPE_DEFINITIONS['一物多包'].detailDesc,
      example: COMBO_TYPE_DEFINITIONS['一物多包'].example,
      features: [
        '本质为 1 件独立商品，因体积或重量超标被拆分为 A/B/C 多个物理箱',
        '子部件不能单独使用或对外销售，缺一不可',
        '各物理箱独立贴标（Box 1/2, Box 2/2）'
      ],
      bomRules: '关联属于该商品的分箱子部件（如 沙发主体箱、扶手五金箱）',
      whRule: '海外仓出库必须严格校验全部箱号齐套方可放行'
    },
    {
      type: '主附搭配',
      badgeClass: 'badge-danger',
      enName: 'Main Body + Generic Parts',
      shortDesc: COMBO_TYPE_DEFINITIONS['主附搭配'].shortDesc,
      coreRule: COMBO_TYPE_DEFINITIONS['主附搭配'].coreRule,
      detailDesc: COMBO_TYPE_DEFINITIONS['主附搭配'].detailDesc,
      example: COMBO_TYPE_DEFINITIONS['主附搭配'].example,
      features: [
        '专用核心主体（如柜体）搭配标准通用配件（如公用陶瓷盆、镜子、五金件）',
        '配件具有跨款式/跨系列的通用性，不同款式组合共用同款通用子物料',
        '有效降低配件库存冗余，提升备货柔性'
      ],
      bomRules: '必须明确 1 项主体物料与 1~N 项通用标准件',
      whRule: '出库时将主体箱与通用配件箱一并核发'
    },
    {
      type: '成套组合',
      badgeClass: 'badge-primary',
      enName: 'Furniture Suite / Set Collection',
      shortDesc: COMBO_TYPE_DEFINITIONS['成套组合'].shortDesc,
      coreRule: COMBO_TYPE_DEFINITIONS['成套组合'].coreRule,
      detailDesc: COMBO_TYPE_DEFINITIONS['成套组合'].detailDesc,
      example: COMBO_TYPE_DEFINITIONS['成套组合'].example,
      features: [
        '每个子件均为功能完整的独立家具单品，平时也可单独对外销售',
        '按设计风格、功能场景（客厅、卧房、餐厅）组合打包销售',
        '客单价高，整套搭配可提升店铺转化率与客单价'
      ],
      bomRules: '关联多个已具备独立物料编码与独立包装的单品',
      whRule: '多件独立单品集结发货，支持合并发货或分批配送'
    }
  ]
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
          productLineLeader: '夏忠保',
          updateTime: new Date().toLocaleString(),
          boundChildren: item.children
        }
      })
      await dbBatchImportMaterialBindings(defaultToImport)
      comboList.value = await dbFetchMaterialBindings()
    } else {
      let modified = false
      dataList.forEach((item: any, idx: number) => {
        if (item.auditStatus === '草稿') {
          item.auditStatus = '待提交'
          modified = true
        }
        if (item.auditStatus === '已启用') {
          item.auditStatus = '审核通过'
          item.status = '已生效'
          modified = true
        }
        if (idx === 0 && !dataList.some((x: any) => x.auditStatus === '待审核')) {
          item.auditStatus = '待审核'
          item.productLineLeader = '夏忠保'
          item.workflowNo = 'WF-MAT-20260922001'
          modified = true
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
    case '多件打包': return 'badge-gray'
    case '一物多包': return 'badge-warning'
    case '主附搭配': return 'badge-danger'
    case '成套组合': return 'badge-primary'
    default: return 'badge-gray'
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
    if (!c.childCode || !c.childName) {
      currentStep.value = 1
      ElMessage.warning('请将所有子部件的编码和品名填写完整！')
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

    // 附加审核流扩展字段 (暂存草稿的业务状态为待提交，提交之后是待审核)
    const targetStatus = isSubmit ? '待审核' : '待提交'
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
        auditStatus: targetStatus,
        workflowNo: workflowNo,
        salesPlatform: formData.salesPlatform || 'Amazon',
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
        warehouseLabelDesc: formData.warehouseLabelDesc
      }
      localStorage.setItem('SKU_KANBAN_BINDINGS_V2', JSON.stringify(currentList))
    }

    editDialogVisible.value = false

    if (isSubmit) {
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
    ElMessage.warning(`组合物料 [${row.parentCode}] 处于【${row.auditStatus || '已生效'}】状态，审核通过或不通过不可删除！`)
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

const handleBatchDelete = async () => {
  if (!selectedRows.value.length) return
  const totalCount = selectedRows.value.length
  const nonDeletableList = selectedRows.value.filter(r => isRowNonDeletable(r))

  if (nonDeletableList.length > 0) {
    ElMessageBox.alert(
      `选中的 ${totalCount} 款组合物料中，有 <b class="text-danger">${nonDeletableList.length}</b> 款处于【审核通过】或【审核不通过】状态。<br/><br/>` +
      `<span class="text-danger font-bold">规则限制：</span>审核通过或不通过的组合物料不可删除！<br/>请取消勾选已审核物料后再执行批量删除。`,
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
const importResultDialogVisible = ref(false)
const showTemplateSpec = ref(false)
const importLoading = ref(false)
const importPreviewList = ref<any[]>([])
const importTargetStatus = ref<'待提交' | '待审核'>('待提交')
const lastImportTargetStatus = ref<'待提交' | '待审核'>('待提交')
const importUploadRef = ref<any>(null)
const uploadedFileName = ref('')
const uploadedFileSize = ref('')

// 本次导入产生的结果集与高亮标识
const newlyImportedCodes = ref<string[]>([])
const isFilteringOnlyImported = ref(false)
const importedBatchResult = ref<{
  count: number
  childCount: number
  status: '待提交' | '待审核'
  leaderName: string
  items: any[]
  timestamp: string
} | null>(null)

const totalParsedChildCount = computed(() => {
  return importPreviewList.value.reduce((acc, item) => acc + (item.children?.length || 0), 0)
})

const handleResetUpload = () => {
  importPreviewList.value = []
  uploadedFileName.value = ''
  uploadedFileSize.value = ''
}

const handleOpenImportDialog = () => {
  handleResetUpload()
  showTemplateSpec.value = false
  importTargetStatus.value = '待提交'
  importDialogVisible.value = true
}

// 下载标准 Excel 导入模板 (带精美配色、分组表头、必填标红与示范数据)
const downloadImportTemplate = async () => {
  try {
    const blob = await generateStyledComboTemplateExcel()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', '组合物料标准导入模板_含BOM与必填规范_V2.2.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    ElMessage.success('【组合物料标准 Excel 导入模板】已成功下载！包含精美配色与字段填写规范说明，请填写后上传导入。')
  } catch (err: any) {
    ElMessage.error('生成 Excel 模板失败: ' + err.message)
  }
}

// 解析导入文件 (.xlsx / .xls / .csv)
const handleImportFileChange = async (file: any) => {
  const rawFile = file.raw
  if (!rawFile) return

  uploadedFileName.value = file.name || '已选模板数据.xlsx'
  uploadedFileSize.value = file.size ? `${(file.size / 1024).toFixed(1)} KB` : ''

  try {
    const arrayBuffer = await rawFile.arrayBuffer()
    const parsed = await parseComboExcelFile(arrayBuffer, importTargetStatus.value)
    importPreviewList.value = parsed
    ElMessage.success(`Excel 文件解析成功！共识别到 ${parsed.length} 款有效组合物料。`)
  } catch (err: any) {
    ElMessage.error('Excel 文件解析失败: ' + err.message)
    handleResetUpload()
  }
}

// 确认批量导入并呈现完善的反馈报告
const handleConfirmImport = async () => {
  if (!importPreviewList.value.length) return
  importLoading.value = true
  try {
    const targetStatus = importTargetStatus.value
    const listToSave = importPreviewList.value.map(item => {
      const leader = lookupProductLineLeader(item.category, item.salesPlatform) || item.productLineLeader || '夏忠保'
      const uniqueSuffix = Date.now().toString().slice(-6) + Math.random().toString(36).substring(2, 5).toUpperCase()
      const wfNo = item.workflowNo || ('WF-MAT-' + uniqueSuffix)
      const draftCode = item.parentCode?.startsWith('DRAFT-') ? item.parentCode : ('DRAFT-' + uniqueSuffix)

      return {
        ...item,
        parentCode: targetStatus === '待审核' ? wfNo : draftCode,
        workflowNo: wfNo,
        productLineLeader: leader,
        auditStatus: targetStatus,
        status: targetStatus === '待审核' ? '待审核' : '已绑定',
        updateTime: new Date().toLocaleString()
      }
    })

    await dbBatchImportMaterialBindings(listToSave)

    // 记录本次导入的高亮物料与结果报告
    const newCodes = listToSave.map(i => i.parentCode)
    newlyImportedCodes.value = newCodes
    lastImportTargetStatus.value = targetStatus
    isFilteringOnlyImported.value = false

    importedBatchResult.value = {
      count: listToSave.length,
      childCount: listToSave.reduce((acc, i) => acc + (i.children?.length || 0), 0),
      status: targetStatus,
      leaderName: listToSave[0]?.productLineLeader || '夏忠保',
      items: listToSave,
      timestamp: new Date().toLocaleTimeString()
    }

    importDialogVisible.value = false
    handleResetUpload()
    await loadData()

    // 默认跳转到首屏展示置顶新数据
    currentPage.value = 1

    // 弹出专业的结果报告卡片弹窗
    importResultDialogVisible.value = true

    ElMessage.success({
      message: `批量导入成功！已为您录入 ${listToSave.length} 款组合物料，已置顶并高亮显示。`,
      duration: 3500
    })
  } catch (err: any) {
    ElMessage.error('批量导入保存失败: ' + err.message)
  } finally {
    importLoading.value = false
  }
}

// 导入结果弹窗操作：高亮查看完成
const handleCompleteAndHighlight = () => {
  importResultDialogVisible.value = false
  ElMessage.success({
    message: `已为您在主表格首屏置顶展示本次导入的 ${newlyImportedCodes.value.length} 款组合物料`,
    duration: 3000
  })
}

// 导入结果弹窗操作：查看首条审批流程
const handleViewFirstWorkflowFromResult = () => {
  importResultDialogVisible.value = false
  if (importedBatchResult.value?.items?.length) {
    const first = importedBatchResult.value.items[0]
    const matched = comboList.value.find(c => c.parentCode === first.parentCode) || first
    handleViewWorkflow(matched)
  }
}

// 导入结果弹窗操作：查看单条审批流程
const handleViewWorkflowFromResult = (row: any) => {
  importResultDialogVisible.value = false
  const matched = comboList.value.find(c => c.parentCode === row.parentCode) || row
  handleViewWorkflow(matched)
}

// 导入结果弹窗操作：编辑草稿
const handleEditFromResult = (row: any) => {
  importResultDialogVisible.value = false
  const matched = comboList.value.find(c => c.parentCode === row.parentCode) || row
  handleEdit(matched)
}

// 清除导入高亮
const handleClearImportHighlight = () => {
  newlyImportedCodes.value = []
  isFilteringOnlyImported.value = false
  ElMessage.info('已清除本次导入的高亮标记')
}

// 导出 CSV
const handleExportCsv = () => {
  const list = selectedRows.value.length ? selectedRows.value : filteredTableData.value
  if (!list.length) {
    ElMessage.warning('没有可导出的数据')
    return
  }

  const headers = ['组合物料编码', '组合物料品名', '组合类型', '审核状态', '款式', '主材质', '颜色', '子物料编码', '子物料品名', '单套配比', '子物料包装']
  const rows: string[][] = []

  list.forEach(item => {
    const children = item.boundChildren || item.children || []
    if (children.length === 0) {
      rows.push([
        item.parentCode,
        item.productName || '',
        item.comboType || '',
        item.auditStatus || '已启用',
        item.style || '',
        item.material || '',
        item.color || '',
        '-', '-', '-', '-'
      ])
    } else {
      children.forEach((c: any) => {
        rows.push([
          item.parentCode,
          item.productName || '',
          item.comboType || '',
          item.auditStatus || '已启用',
          item.style || '',
          item.material || '',
          item.color || '',
          c.childCode || '',
          c.childName || '',
          String(c.ratio || 1),
          c.childPackQty || '1pack'
        ])
      })
    }
  })

  const csvContent = '\uFEFF' + [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `组合物料_BOM清单_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  ElMessage.success(`成功导出 ${list.length} 款组合物料明细！`)
}

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

/* 顶部统计卡片 */
.stat-overview-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;

  .stat-card {
    background: #fff;
    border-radius: 8px;
    padding: 14px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #eef0f3;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border-color: #409eff;
    }

    &.active {
      border-color: #409eff;
      background: #f0f7ff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .stat-label {
        font-size: 13px;
        color: #64748b;
        font-weight: 500;
      }

      .stat-num {
        font-size: 24px;
        font-weight: 700;
        color: #1e293b;

        .unit {
          font-size: 13px;
          font-weight: normal;
          color: #94a3b8;
          margin-left: 2px;
        }

        &.text-primary { color: #2563eb; }
        &.text-warning { color: #d97706; }
        &.text-indigo { color: #4f46e5; }
        &.text-amber-600 { color: #b45309; }
      }

      .stat-desc {
        font-size: 11px;
        color: #94a3b8;
      }
    }

    .stat-icon-box {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #fff;

      &.bg-blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
      &.bg-slate { background: linear-gradient(135deg, #64748b, #334155); }
      &.bg-amber { background: linear-gradient(135deg, #f59e0b, #d97706); }
      &.bg-amber-gradient { background: linear-gradient(135deg, #fbbf24, #d97706); }
      &.bg-purple { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
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
  padding: 10px 14px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.table-card {
  background: #fff;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  flex: 1;
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
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;

  &.badge-gray {
    background-color: #f1f5f9;
    color: #475569;
    border: 1px solid #cbd5e1;
  }

  &.badge-warning {
    background-color: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
  }

  &.badge-danger {
    background-color: #ffe4e6;
    color: #e11d48;
    border: 1px solid #fecdd3;
  }

  &.badge-primary {
    background-color: #ede9fe;
    color: #6d28d9;
    border: 1px solid #ddd6fe;
  }
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
  padding: 12px 16px;
  border-radius: 6px;
  margin: 6px 0;
  border: 1px dashed #cbd5e1;

  .expand-bom-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .bom-title {
      font-size: 13px;
      color: #334155;
      display: flex;
      align-items: center;

      b {
        color: #1e293b;
      }
    }

    .bom-badge-info {
      display: flex;
      gap: 12px;
      font-size: 12px;

      .total-ratio {
        color: #2563eb;
        font-weight: 600;
      }
    }
  }

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
  padding: 14px 0 6px;
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

/* 审批弹窗样式 */
.workflow-modal-body {
  .wf-summary-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px 16px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;

    .row {
      font-size: 13px;
      .k { color: #64748b; }
      .v { color: #1e293b; }
    }
  }

  .wf-timeline-wrap {
    padding: 10px 16px;

    .timeline-title {
      font-size: 13px;
      margin-bottom: 2px;
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

.audit-action-modal-body .audit-target-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
}

.audit-action-modal-body .target-item {
  font-size: 13px;
  display: flex;
  align-items: center;
}

.audit-action-modal-body .target-item .label {
  color: #64748b;
  width: 90px;
  flex-shrink: 0;
}

.audit-action-modal-body .target-item .val {
  color: #1e293b;
  word-break: break-all;
}

.audit-decision-form .el-radio {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

/* 组合类型标准定义规范抽屉高级样式 */
.guide-drawer-content {
  padding: 4px 10px 30px 10px;
}

.guide-banner-card {
  background: linear-gradient(135deg, #f0f7ff 0%, #e0effe 100%);
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 12px 16px;
}

.guide-banner-card .banner-title {
  font-weight: 700;
  font-size: 14px;
  color: #0369a1;
  display: flex;
  align-items: center;
}

.guide-banner-card .banner-desc {
  font-size: 12px;
  line-height: 18px;
  color: #334155;
  margin-top: 6px;
}

.sec-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
}

.decision-flow-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.decision-node {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 10px 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.decision-node .node-q {
  font-size: 11px;
  line-height: 15px;
  font-weight: 500;
  color: #475569;
}

.decision-node .node-arrow {
  font-size: 10px;
  color: #94a3b8;
  margin: 4px 0 2px 0;
}

.decision-node .node-res {
  font-size: 12px;
}

.guide-matrix-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.guide-matrix-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 8px 10px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.guide-matrix-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}

.guide-matrix-table tr:hover {
  background: #f8fafc;
}

.enhanced-guide-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.enhanced-guide-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.enhanced-guide-card.theme-badge-gray {
  border-left: 4px solid #64748b;
}

.enhanced-guide-card.theme-badge-warning {
  border-left: 4px solid #d97706;
}

.enhanced-guide-card.theme-badge-danger {
  border-left: 4px solid #e11d48;
}

.enhanced-guide-card.theme-badge-primary {
  border-left: 4px solid #4f46e5;
}

.guide-card-top {
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
  border-top-right-radius: 8px;
}

.core-rule-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #475569;
}

.guide-card-body {
  padding: 12px 14px;
}

.guide-card-body .info-row {
  font-size: 12px;
  line-height: 18px;
}

.guide-card-body .info-label {
  font-weight: 600;
  color: #64748b;
}

.guide-card-body .info-val {
  color: #1e293b;
}

.feature-bullets {
  background: #f8fafc;
  border-radius: 6px;
  padding: 8px 10px;
}

.bullet-item {
  font-size: 11px;
  line-height: 18px;
  color: #334155;
  display: flex;
  align-items: center;
}

.example-box {
  background: #f1f5f9;
  border-left: 3px solid #3b82f6;
  border-radius: 4px;
  padding: 6px 10px;
}

.example-box .example-label {
  font-size: 11px;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 2px;
}

.guidelines-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.rule-chip {
  font-size: 11px;
  padding: 5px 8px;
  border-radius: 4px;
  line-height: 15px;
}

.rule-chip.chip-bom {
  background: #eff6ff;
  border: 1px solid #dbeafe;
}

.rule-chip.chip-bom .chip-k {
  font-weight: 600;
  color: #1d4ed8;
}

.rule-chip.chip-wh {
  background: #fefce8;
  border: 1px solid #fef08a;
}

.rule-chip.chip-wh .chip-k {
  font-weight: 600;
  color: #a16207;
}

.guide-faq-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 14px;
}

.faq-item {
  font-size: 12px;
  line-height: 18px;
}

.faq-q {
  font-weight: 700;
  color: #0f766e;
}

.faq-a {
  color: #334155;
  margin-top: 2px;
  padding-left: 10px;
  border-left: 2px solid #cbd5e1;
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
          padding: 1px 6px;
          border-radius: 4px;
          font-weight: 500;

          &.tag-blue {
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #dbeafe;
          }

          &.tag-purple {
            background: #f5f3ff;
            color: #6d28d9;
            border: 1px solid #ede9fe;
          }

          &.tag-teal {
            background: #f0fdfa;
            color: #0f766e;
            border: 1px solid #ccfbf1;
          }
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

/* 底部操作条 */
.import-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .footer-left-tip {
    font-size: 11.5px;
    color: #64748b;
    display: flex;
    align-items: center;
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

/* --- 本次导入后提示条与高亮样式 --- */
.newly-imported-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border: 1px solid #86efac;
  border-radius: 6px;
  padding: 8px 14px;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.08);
  margin-bottom: 10px;

  .banner-left {
    display: flex;
    align-items: center;
    gap: 8px;

    .banner-icon-box {
      font-size: 18px;
      color: #10b981;
      display: flex;
      align-items: center;
    }

    .banner-info {
      font-size: 13px;
      color: #065f46;

      b {
        color: #047857;
        font-size: 14px;
      }

      .banner-desc {
        color: #059669;
        font-size: 12px;
      }
    }
  }

  .banner-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

/* 主表格中本次导入行高亮样式 */
:deep(.el-table .row-newly-imported) {
  background-color: #f0fdf4 !important;
  box-shadow: inset 4px 0 0 #10b981;
  transition: background-color 0.2s ease;

  &:hover > td {
    background-color: #dcfce7 !important;
  }
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped.row-newly-imported td) {
  background-color: #ecfdf5 !important;
}

.newly-imported-tag {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  border-color: #059669 !important;
  color: #ffffff !important;
  font-size: 10.5px !important;
  font-weight: 600 !important;
  padding: 0 6px !important;
  height: 20px !important;
  line-height: 20px !important;
  border-radius: 4px !important;
  box-shadow: 0 1px 3px rgba(16, 185, 129, 0.25);
  display: inline-flex;
  align-items: center;
}

/* --- 导入结果报告弹窗样式 --- */
.import-result-dialog {
  :deep(.el-dialog__header) {
    padding: 16px 20px 12px;
    border-bottom: 1px solid #f1f5f9;
  }

  :deep(.el-dialog__body) {
    padding: 16px 20px;
  }

  .result-header-banner {
    display: flex;
    align-items: center;
    gap: 16px;
    background: linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%);
    border-radius: 8px;
    padding: 16px 20px;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(6, 95, 70, 0.2);
    margin-bottom: 16px;

    .result-badge-icon {
      font-size: 38px;
      color: #a7f3d0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .result-header-text {
      flex: 1;

      .result-header-title {
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 4px;
        letter-spacing: 0.3px;
      }

      .result-header-desc {
        font-size: 12.5px;
        color: #d1fae5;
        line-height: 1.5;

        b {
          color: #ffffff;
          font-weight: 700;
        }
      }
    }

    .result-header-status {
      flex-shrink: 0;

      .status-pill {
        font-weight: 600;
        letter-spacing: 0.5px;
      }
    }
  }

  .result-metric-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 16px;

    .metric-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 12px;
      text-align: center;
      transition: all 0.2s ease;

      &:hover {
        border-color: #cbd5e1;
        background: #ffffff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      }

      .metric-label {
        font-size: 11px;
        color: #64748b;
        margin-bottom: 4px;
      }

      .metric-val {
        font-size: 18px;
        font-weight: 700;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        margin-bottom: 2px;

        .unit {
          font-size: 11px;
          font-weight: normal;
          color: #64748b;
        }
      }

      .metric-tip {
        font-size: 10.5px;
        color: #94a3b8;
      }
    }
  }

  .result-table-box {
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px;
    background: #ffffff;

    .box-title {
      font-size: 12.5px;
    }
  }

  .result-dialog-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .complete-btn {
      background: linear-gradient(135deg, #10b981, #059669);
      border-color: #059669;
      box-shadow: 0 2px 6px rgba(16, 185, 129, 0.25);
    }
  }
}
</style>

