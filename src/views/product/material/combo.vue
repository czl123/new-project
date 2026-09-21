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

        <el-form-item label="审核状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 110px">
            <el-option label="全部状态" value="" />
            <el-option label="待审核" value="待审核" />
            <el-option label="已生效" value="已启用" />
            <el-option label="草稿" value="草稿" />
            <el-option label="已停产" value="停产" />
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
                <el-table-column label="子物料编码" prop="childCode" min-width="160">
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
                <el-table-column label="子物料品名" prop="childName" min-width="180" show-overflow-tooltip>
                  <template #default="{ row: child }">
                    <span class="font-medium text-slate-800">{{ child.childName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="单套配比 (Ratio)" prop="ratio" width="130" align="center">
                  <template #default="{ row: child }">
                    <el-tag size="small" type="primary" effect="dark" class="font-bold font-mono">
                      1 套 : {{ child.ratio }} 件
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="款式" prop="childStyle" width="120" show-overflow-tooltip>
                  <template #default="{ row: child }">
                    <span>{{ child.childStyle || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="主材料" prop="childMaterial" min-width="130" show-overflow-tooltip>
                  <template #default="{ row: child }">
                    <span>{{ child.childMaterial || '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="颜色" prop="childColor" width="110">
                  <template #default="{ row: child }">
                    <el-tag v-if="child.childColor" size="small" effect="plain" type="info">
                      {{ child.childColor }}
                    </el-tag>
                    <span v-else class="text-gray-400">-</span>
                  </template>
                </el-table-column>
                <el-table-column label="包装规格" prop="childPackQty" width="100" align="center">
                  <template #default="{ row: child }">
                    <span class="font-mono text-gray-600">{{ child.childPackQty || '1pack' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="品牌/对象" prop="childBrand" width="100">
                  <template #default="{ row: child }">
                    <span class="text-xs text-gray-500">{{ child.childBrand || '中性' }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>

        <el-table-column type="index" label="序号" width="55" align="center" />

        <el-table-column label="组合物料编码" prop="parentCode" min-width="180">
          <template #default="{ row }">
            <div class="code-copy-cell">
              <span class="parent-code font-bold font-mono">{{ row.parentCode }}</span>
              <el-tooltip content="点击复制" placement="top">
                <el-icon class="copy-icon" @click="handleCopy(row.parentCode, '组合物料编码')">
                  <CopyDocument />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="组合物料品名" prop="productName" min-width="210" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="product-name font-medium">{{ row.productName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="组合类型" prop="comboType" width="130" align="center">
          <template #default="{ row }">
            <el-tooltip :content="getComboTypeTip(row.comboType)" placement="top">
              <span class="type-badge" :class="getComboTypeBadgeClass(row.comboType)">
                {{ row.comboType }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="BOM 子件数" width="120" align="center">
          <template #default="{ row }">
            <div class="bom-count-pill">
              <span class="num">{{ (row.children || []).length }}</span>
              <span class="sub">项子件</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="款式" prop="style" width="120" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.style || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="主材质" prop="material" min-width="130" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.material || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="审核/业务状态" prop="auditStatus" width="110" align="center">
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
              v-else-if="row.auditStatus === '草稿' || row.status === '草稿'" 
              type="info" 
              effect="plain" 
              size="small"
            >
              草稿
            </el-tag>
            <el-tag 
              v-else-if="row.status === '停产'" 
              type="danger" 
              size="small"
            >
              已停产
            </el-tag>
            <el-tag 
              v-else 
              type="success" 
              size="small"
            >
              已生效
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="更新时间" prop="updateTime" width="150" align="center" show-overflow-tooltip />

        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              link 
              size="small" 
              icon="Compass" 
              @click="handleOpenCalculator(row)"
            >
              BOM 试算
            </el-button>
            <el-button 
              v-if="row.auditStatus === '待审核' || row.status === '待审核'"
              type="warning" 
              link 
              size="small" 
              icon="View" 
              @click="handleViewWorkflow(row)"
            >
              审批流
            </el-button>
            <el-button 
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
            <el-button 
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
      <div class="wizard-header-nav">
        <div class="steps-wrapper">
          <div 
            class="wizard-step-node" 
            :class="{ active: currentStep === 1, done: currentStep > 1 }"
            @click="currentStep = 1"
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
            @click="currentStep = 2"
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
            @click="currentStep = 3"
          >
            <div class="step-num">3</div>
            <div class="step-meta">
              <span class="step-title">采购合规与装箱信息</span>
              <span class="step-sub">开票 · 包装 · 外箱规格</span>
            </div>
          </div>
        </div>

        <div class="workflow-hint-tag">
          <el-icon class="mr-1 text-warning"><BellFilled /></el-icon>
          <span>提交后将自动接入【组合物料多级审批流】</span>
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
              :title="`【${formData.comboType}】作业规范：${getComboTypeRuleDesc(formData.comboType)}`"
              type="info"
              show-icon
              :closable="false"
              class="mt-3 mb-3 rule-alert"
            />

            <!-- 1.2 组合物料基本标识 -->
            <div class="sub-form-card mb-3">
              <div class="card-bar-title">组合物料编码与基础识别</div>
              <el-row :gutter="16">
                <el-col :span="12">
                  <div class="flex-field">
                    <span class="field-label required">组合物料编码：</span>
                    <el-input 
                      v-model="formData.parentCode" 
                      :disabled="isEditMode" 
                      placeholder="自动组合生成，例如: IF260212+216" 
                      size="small" 
                    />
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="flex-field">
                    <span class="field-label required">组合产品名称：</span>
                    <el-input 
                      v-model="formData.productName" 
                      placeholder="可手动修改或由下方子件自动推导生成" 
                      size="small" 
                    />
                  </div>
                </el-col>
              </el-row>
            </div>

            <!-- 1.3 BOM 子部件列表 (已去除从标准库选用按钮) -->
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

              <el-table :data="formData.children" border size="mini" class="wizard-bom-table">
                <el-table-column type="index" label="#" width="45" align="center" />
                <el-table-column label="子物料编码/从物料档案联想" min-width="190">
                  <template #default="{ row }">
                    <el-autocomplete
                      v-model="row.childCode"
                      :fetch-suggestions="querySearchChildMaterial"
                      placeholder="输入子物料编码或品名搜索..."
                      size="small"
                      style="width: 100%"
                      @select="(item: any) => onSelectChildMaterial(row, item)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="子物料品名" min-width="190">
                  <template #default="{ row }">
                    <el-input v-model="row.childName" placeholder="子部件品名" size="small" @input="triggerAutoDerive" />
                  </template>
                </el-table-column>
                <el-table-column label="单套配比 (Ratio)" width="140" align="center">
                  <template #default="{ row }">
                    <el-input-number 
                      v-model="row.ratio" 
                      :min="1" 
                      :max="999" 
                      size="small" 
                      style="width: 110px" 
                      @change="triggerAutoDerive"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="款式/材质" width="150">
                  <template #default="{ row }">
                    <el-input v-model="row.childStyle" placeholder="款式" size="small" class="mb-1" @input="triggerAutoDerive" />
                    <el-input v-model="row.childMaterial" placeholder="材质" size="small" @input="triggerAutoDerive" />
                  </template>
                </el-table-column>
                <el-table-column label="包装规格" width="110">
                  <template #default="{ row }">
                    <el-input v-model="row.childPackQty" placeholder="1pack" size="small" @input="triggerAutoDerive" />
                  </template>
                </el-table-column>
                <el-table-column label="颜色" width="100">
                  <template #default="{ row }">
                    <el-input v-model="row.childColor" placeholder="颜色" size="small" @input="triggerAutoDerive" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="65" align="center">
                  <template #default="{ $index }">
                    <el-button 
                      type="danger" 
                      icon="Delete" 
                      link 
                      size="small" 
                      @click="handleRemoveChildRow($index)" 
                    />
                  </template>
                </el-table-column>
              </el-table>
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
                  <span class="label required">运营大类：</span>
                  <el-select v-model="formData.category" size="small" style="width: 100%">
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
                <div class="form-item-cell">
                  <span class="label required">主材料：</span>
                  <el-input v-model="formData.material" size="small" />
                </div>
              </div>

              <div class="form-grid-4 mt-2">
                <div class="form-item-cell">
                  <span class="label">适用品牌或对象：</span>
                  <el-input v-model="formData.targetBrandOrAudience" size="small" />
                </div>
                <div class="form-item-cell">
                  <span class="label">型号：</span>
                  <el-input v-model="formData.model" size="small" />
                </div>
                <div class="form-item-cell"></div>
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
                <div class="form-item-cell">
                  <span class="label">审批流发起人：</span>
                  <el-input v-model="currentSubmitter" disabled size="small" />
                </div>
                <div class="form-item-cell"></div>
                <div class="form-item-cell"></div>
              </div>
            </div>

            <!-- 一般属性与负责人 -->
            <div class="sub-form-card">
              <div class="card-bar-title mb-2">一般属性与负责人</div>
              <div class="form-grid-4">
                <div class="form-item-cell">
                  <span class="label">是否带电：</span>
                  <el-select v-model="formData.hasBattery" size="small" style="width: 100%">
                    <el-option label="否" value="否" />
                    <el-option label="是" value="是" />
                  </el-select>
                </div>
                <div class="form-item-cell">
                  <span class="label">季节标签：</span>
                  <el-select v-model="formData.seasonTag" size="small" style="width: 100%">
                    <el-option label="四季通用" value="四季通用" />
                    <el-option label="春季" value="春季" />
                    <el-option label="夏季" value="夏季" />
                    <el-option label="秋季" value="秋季" />
                    <el-option label="冬季" value="冬季" />
                  </el-select>
                </div>
                <div class="form-item-cell">
                  <span class="label">产品经理 (初审人)：</span>
                  <el-select v-model="formData.productManager" size="small" style="width: 100%">
                    <el-option label="张经理 (产品负责人)" value="张经理 (产品负责人)" />
                    <el-option label="李主管 (高级定品)" value="李主管 (高级定品)" />
                  </el-select>
                </div>
                <div class="form-item-cell">
                  <span class="label">采购人员：</span>
                  <el-select v-model="formData.purchaser" size="small" style="width: 100%">
                    <el-option label="采购A组-陈工" value="采购A组-陈工" />
                    <el-option label="采购B组-赵工" value="采购B组-赵工" />
                  </el-select>
                </div>
              </div>

              <div class="form-grid-2 mt-3">
                <div class="form-item-cell">
                  <span class="label">规格型号 (标签)：</span>
                  <el-input 
                    v-model="formData.specModelDesc" 
                    type="textarea" 
                    :rows="2" 
                    maxlength="200" 
                    show-word-limit 
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
                    size="small" 
                  />
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
                  <span class="label required">生产周期：</span>
                  <el-input v-model="formData.productionCycle" size="small">
                    <template #suffix>天</template>
                  </el-input>
                </div>
                <div class="form-item-cell">
                  <span class="label required">来货起订量：</span>
                  <el-input v-model="formData.moq" size="small" />
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
              <div class="card-bar-title mb-2">单品规格与包装毛重</div>
              <div class="spec-dual-row">
                <div class="spec-cell-group">
                  <span class="spec-label-req">* 单品规格：</span>
                  <div class="lwh-input-box">
                    <span class="unit-sub">长</span>
                    <el-input v-model="formData.itemLength" size="small" />
                    <span class="unit-sub">宽</span>
                    <el-input v-model="formData.itemWidth" size="small" />
                    <span class="unit-sub">高</span>
                    <el-input v-model="formData.itemHeight" size="small" />
                    <span class="unit-tail">cm</span>
                  </div>
                </div>

                <div class="spec-cell-group weight-group">
                  <span class="spec-label-req">* 净重：</span>
                  <div class="weight-input-box">
                    <el-input v-model="formData.netWeight" size="small" />
                    <span class="unit-tail">kg</span>
                  </div>
                </div>

                <div class="spec-cell-group">
                  <span class="spec-label-req">* 包装规格：</span>
                  <div class="lwh-input-box">
                    <span class="unit-sub">长</span>
                    <el-input v-model="formData.pkgLength" size="small" />
                    <span class="unit-sub">宽</span>
                    <el-input v-model="formData.pkgWidth" size="small" />
                    <span class="unit-sub">高</span>
                    <el-input v-model="formData.pkgHeight" size="small" />
                    <span class="unit-tail">cm</span>
                  </div>
                </div>

                <div class="spec-cell-group weight-group">
                  <span class="spec-label-req">* 毛重：</span>
                  <div class="weight-input-box">
                    <el-input v-model="formData.grossWeight" size="small" />
                    <span class="unit-tail">kg</span>
                  </div>
                </div>
              </div>

              <!-- 装箱表格 -->
              <div class="custom-box-table-wrap mt-2">
                <table class="custom-box-table">
                  <thead>
                    <tr>
                      <th style="width: 15%">整箱毛重 (kg)</th>
                      <th style="width: 12%">装箱件数</th>
                      <th style="width: 15%">组合总毛重 (kg)</th>
                      <th style="width: 28%">外箱规格 (cm)</th>
                      <th style="width: 15%">外箱体积 (cm3)</th>
                      <th style="width: 15%">单件毛重 (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div class="table-inner-input">
                          <el-input v-model="formData.boxGrossWeight" size="small" />
                          <span class="unit">kg</span>
                        </div>
                      </td>
                      <td>
                        <div class="table-inner-input">
                          <el-input v-model="formData.boxPcs" size="small" />
                          <span class="unit">pcs</span>
                        </div>
                      </td>
                      <td>
                        <div class="table-inner-input">
                          <el-input v-model="formData.comboTotalGrossWeight" size="small" />
                          <span class="unit">kg</span>
                        </div>
                      </td>
                      <td>
                        <div class="table-lwh-box">
                          <el-input v-model="formData.outerBoxLength" placeholder="长" size="small" @input="calcOuterBoxVolume" />
                          <el-input v-model="formData.outerBoxWidth" placeholder="宽" size="small" @input="calcOuterBoxVolume" />
                          <el-input v-model="formData.outerBoxHeight" placeholder="高" size="small" @input="calcOuterBoxVolume" />
                          <span class="unit">cm</span>
                        </div>
                      </td>
                      <td>
                        <div class="table-inner-input">
                          <el-input v-model="formData.outerBoxVolume" size="small" />
                          <span class="unit">cm3</span>
                        </div>
                      </td>
                      <td>
                        <div class="table-inner-input">
                          <el-input v-model="formData.singleGrossWeight" size="small" />
                          <span class="unit">kg</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 产品图与包装图上传 -->
            <div class="sub-form-card">
              <div class="card-bar-title mb-2">物料多视角图片</div>
              <div class="upload-flex-row">
                <div class="upload-block">
                  <div class="upload-sub-title">产品图 (最多 12 张)</div>
                  <div class="upload-drop-zone">
                    <el-icon class="cloud-icon"><UploadFilled /></el-icon>
                    <div class="drop-text">将文件拖到此处，或 <span class="click-link">点击上传</span></div>
                  </div>
                </div>

                <div class="upload-block">
                  <div class="upload-sub-title">包装图 (1 ~ 6 张)</div>
                  <div class="upload-drop-zone">
                    <el-icon class="cloud-icon"><UploadFilled /></el-icon>
                    <div class="drop-text">将文件拖到此处，或 <span class="click-link">点击上传</span></div>
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
              <div v-else class="empty-hero">
                <el-icon><Picture /></el-icon>
                <span>无主图预览</span>
              </div>
              <span class="type-pill" :class="getComboTypeBadgeClass(formData.comboType)">
                {{ formData.comboType }}
              </span>
            </div>

            <!-- 组合主要标识 -->
            <div class="preview-title-box">
              <div class="parent-code-text">{{ formData.parentCode || '待生成父物料编码' }}</div>
              <div class="product-name-text">{{ formData.productName || '未命名组合物料' }}</div>
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

            <!-- 审批流预览条 -->
            <div class="workflow-preview-card">
              <div class="wf-title">
                <el-icon class="mr-1 text-primary"><Share /></el-icon>
                <span>预设审核流程 (提交后即时派单)</span>
              </div>
              <div class="wf-nodes-list">
                <div class="wf-node">
                  <span class="dot done"></span>
                  <span class="node-name">1. 发起提交 ({{ currentSubmitter }})</span>
                </div>
                <div class="wf-node">
                  <span class="dot pending"></span>
                  <span class="node-name">2. 产品经理审核 ({{ formData.productManager }})</span>
                </div>
                <div class="wf-node">
                  <span class="dot waiting"></span>
                  <span class="node-name">3. PMC/研发齐套确认</span>
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

    <!-- 7. 对话框：【推送审批流详情 / 审核进度弹窗】 -->
    <el-dialog
      v-model="workflowDialogVisible"
      title="组合物料多级审批流进度"
      width="680px"
      destroy-on-close
    >
      <div v-if="activeWorkflowRow" class="workflow-modal-body">
        <div class="wf-summary-box">
          <div class="row"><span class="k">组合编码：</span><span class="v font-bold text-primary">{{ activeWorkflowRow.parentCode }}</span></div>
          <div class="row"><span class="k">物料品名：</span><span class="v">{{ activeWorkflowRow.productName }}</span></div>
          <div class="row"><span class="k">审批单号：</span><span class="v font-mono text-gray-700">{{ activeWorkflowRow.workflowNo || 'WF-MAT-20260921008' }}</span></div>
          <div class="row"><span class="k">当前状态：</span><el-tag type="warning" size="small"><el-icon><Clock /></el-icon> 审批中</el-tag></div>
        </div>

        <div class="wf-timeline-wrap mt-4">
          <el-timeline>
            <el-timeline-item timestamp="2026-09-21 11:15" placement="top" type="success" icon="Check">
              <div class="timeline-title font-medium">发起组合物料新增申请</div>
              <div class="timeline-desc text-xs text-gray-500">提交人：{{ currentSubmitter }}，已自动完成 BOM 子件合规推导校验。</div>
            </el-timeline-item>

            <el-timeline-item timestamp="审核处理中..." placement="top" type="warning" icon="Loading">
              <div class="timeline-title font-medium text-amber-600">节点 1：产品部负责人定品审批</div>
              <div class="timeline-desc text-xs text-gray-500">审批人：{{ activeWorkflowRow.productManager || '张经理 (产品负责人)' }}</div>
              <div class="mt-2">
                <el-button type="success" size="small" @click="handlePassAudit(activeWorkflowRow)">模拟审批通过</el-button>
                <el-button type="danger" size="small" plain @click="handleRejectAudit(activeWorkflowRow)">驳回修改</el-button>
              </div>
            </el-timeline-item>

            <el-timeline-item timestamp="待处理" placement="top" type="info">
              <div class="timeline-title text-gray-400">节点 2：研发工程 BOM 齐套复审</div>
              <div class="timeline-desc text-xs text-gray-400">审批人：研发工程部</div>
            </el-timeline-item>

            <el-timeline-item timestamp="待处理" placement="top" type="info">
              <div class="timeline-title text-gray-400">节点 3：生效入库与 PMC 备货启用</div>
              <div class="timeline-desc text-xs text-gray-400">系统自动生效并下发至供应链海外仓看板</div>
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

    <!-- 9. 抽屉：四大组合类型标准定义规范与业务指南 -->
    <el-drawer
      v-model="showTypeGuideDrawer"
      title="组合家具物料四大组合类型标准定义与作业规范"
      size="560px"
      direction="rtl"
    >
      <div class="guide-drawer-content">
        <div 
          v-for="item in comboTypeGuideList" 
          :key="item.type" 
          class="guide-card"
        >
          <div class="guide-card-header">
            <span class="type-badge" :class="item.badgeClass">{{ item.type }}</span>
            <span class="guide-short-desc">{{ item.shortDesc }}</span>
          </div>

          <div class="guide-rule-box">
            <b>核心判定规则：</b> {{ item.coreRule }}
          </div>

          <div class="guide-detail-desc">
            <b>业务场景：</b> {{ item.detailDesc }}
          </div>

          <div class="guide-example">
            <b>典型案例：</b> <code>{{ item.example }}</code>
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
  auditStatus: '已启用',
  workflowNo: '',

  // 基本信息 - 同款属性
  category: '家具/室内家具',
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
  comboType: '成套组合' as ComboType,
  status: '启用' as '启用' | '停产',
  children: [] as FurnitureComboBomItem[]
})

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

// 触发自动推导回填
const triggerAutoDerive = () => {
  if (!formData.children.length) return

  if (!formData.productName || formData.productName.includes('组合') || formData.productName === '') {
    const names = formData.children.map(c => c.childName?.replace(/\(.*?\)/g, '')).filter(Boolean)
    const uniqueNames = Array.from(new Set(names))
    if (uniqueNames.length === 1) {
      formData.productName = `${uniqueNames[0]} (${formData.comboType})`
    } else if (uniqueNames.length > 1) {
      formData.productName = `${uniqueNames.slice(0, 2).join('+')}两组合`
    }
  }

  const materials = formData.children.map(c => c.childMaterial).filter(Boolean)
  if (materials.length) {
    formData.material = Array.from(new Set(materials)).join('+')
  }

  if (!formData.parentCode && formData.children.length) {
    const codes = formData.children.map(c => c.childCode).filter(Boolean)
    if (codes.length === 1) {
      formData.parentCode = `${codes[0]}X${formData.children[0].ratio || 2}`
    } else if (codes.length > 1) {
      formData.parentCode = `${codes[0]}+${codes[1]?.slice(-3) || 'COM'}`
    }
  }

  formData.packQty = derivedMetrics.value.totalPacks
  formData.grossWeight = derivedMetrics.value.totalGrossWeight
  formData.netWeight = derivedMetrics.value.totalNetWeight
  formData.boxGrossWeight = derivedMetrics.value.totalGrossWeight
  formData.comboTotalGrossWeight = derivedMetrics.value.totalGrossWeight
  formData.singleGrossWeight = (Number(derivedMetrics.value.totalGrossWeight) / (Number(formData.children[0]?.ratio) || 1)).toFixed(1)
}

const forceReDerive = () => {
  formData.productName = ''
  formData.material = ''
  triggerAutoDerive()
  ElMessage.success('已重新从当前 BOM 子物料清单推导属性！')
}

const onSelectComboType = (type: ComboType) => {
  formData.comboType = type
  triggerAutoDerive()
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
    currentStep.value = 3
  }
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
  formData.productName = row.productName || formData.productName
  formData.style = row.style || formData.style
  formData.material = row.material || formData.material
  formData.color = row.color || formData.color
  formData.brand = row.brand || formData.brand
  formData.packQty = row.packQty || formData.packQty
  formData.comboType = (row.comboType || formData.comboType) as ComboType
  quoteDialogVisible.value = false
  ElMessage.success(`已引用物料 [${row.parentCode}] 的同款关键属性！`)
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
    } else if (filterForm.status === '已启用') {
      list = list.filter(item => (!item.auditStatus || item.auditStatus === '已启用') && item.status !== '停产' && item.status !== '待审核')
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
    children: item.boundChildren || item.children || []
  }))
})

const comboTypeGuideList = computed(() => {
  return [
    {
      type: '多件打包',
      badgeClass: 'badge-gray',
      shortDesc: COMBO_TYPE_DEFINITIONS['多件打包'].shortDesc,
      coreRule: COMBO_TYPE_DEFINITIONS['多件打包'].coreRule,
      detailDesc: COMBO_TYPE_DEFINITIONS['多件打包'].detailDesc,
      example: COMBO_TYPE_DEFINITIONS['多件打包'].example
    },
    {
      type: '一物多包',
      badgeClass: 'badge-warning',
      shortDesc: COMBO_TYPE_DEFINITIONS['一物多包'].shortDesc,
      coreRule: COMBO_TYPE_DEFINITIONS['一物多包'].coreRule,
      detailDesc: COMBO_TYPE_DEFINITIONS['一物多包'].detailDesc,
      example: COMBO_TYPE_DEFINITIONS['一物多包'].example
    },
    {
      type: '主附搭配',
      badgeClass: 'badge-danger',
      shortDesc: COMBO_TYPE_DEFINITIONS['主附搭配'].shortDesc,
      coreRule: COMBO_TYPE_DEFINITIONS['主附搭配'].coreRule,
      detailDesc: COMBO_TYPE_DEFINITIONS['主附搭配'].detailDesc,
      example: COMBO_TYPE_DEFINITIONS['主附搭配'].example
    },
    {
      type: '成套组合',
      badgeClass: 'badge-primary',
      shortDesc: COMBO_TYPE_DEFINITIONS['成套组合'].shortDesc,
      coreRule: COMBO_TYPE_DEFINITIONS['成套组合'].coreRule,
      detailDesc: COMBO_TYPE_DEFINITIONS['成套组合'].detailDesc,
      example: COMBO_TYPE_DEFINITIONS['成套组合'].example
    }
  ]
})

const loadData = async () => {
  loading.value = true
  try {
    const list = await dbFetchMaterialBindings()
    if (!list || list.length === 0) {
      const defaultToImport = FURNITURE_COMBO_BOM_LIBRARY.slice(0, 35).map(item => ({
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
        status: '已绑定' as const,
        auditStatus: '已启用',
        updateTime: new Date().toLocaleString(),
        boundChildren: item.children
      }))
      await dbBatchImportMaterialBindings(defaultToImport)
      comboList.value = await dbFetchMaterialBindings()
    } else {
      comboList.value = list
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
  formData.parentCode = ''
  formData.productName = ''
  formData.comboType = '成套组合'
  formData.style = 'AuraB01'
  formData.material = '刨花板+MDF'
  formData.brand = '中性'
  formData.color = '原木色'
  formData.packQty = '1pack'
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
    }
  ]
  triggerAutoDerive()
  editDialogVisible.value = true
}

const handleEdit = (row: any) => {
  isEditMode.value = true
  currentStep.value = 1

  formData.id = row.id || ''
  formData.parentCode = row.parentCode || ''
  formData.productName = row.productName || ''
  formData.comboType = (row.comboType || '成套组合') as ComboType
  formData.style = row.style || ''
  formData.material = row.material || ''
  formData.brand = row.brand || '中性'
  formData.color = row.color || ''
  formData.packQty = row.packQty || '1pack'
  formData.auditStatus = row.auditStatus || '已启用'
  formData.status = (row.status === '停产' ? '停产' : '启用')
  formData.children = (row.children || row.boundChildren || []).map((c: any) => ({ ...c }))

  editDialogVisible.value = true
}

const handleClone = (row: any) => {
  handleEdit(row)
  isEditMode.value = false
  formData.id = ''
  formData.parentCode = row.parentCode + '-COPY'
  formData.productName = row.productName + ' (副本)'
  formData.auditStatus = '待审核'
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
    row.childProductName = item.childProductName || ''
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

// 保存提交 (关键：提交后推送审批流)
const handleSaveCombo = async (isSubmit = false) => {
  if (!formData.parentCode) {
    currentStep.value = 1
    ElMessage.warning('请填写组合物料编码！')
    return
  }
  if (!formData.productName) {
    currentStep.value = 2
    ElMessage.warning('请填写产品名称！')
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

  try {
    const saved = await dbSaveMaterialBinding({
      id: formData.id || undefined,
      parentCode: formData.parentCode,
      sku: formData.parentCode,
      productName: formData.productName,
      style: formData.style,
      material: formData.material,
      brand: formData.brand,
      color: formData.color,
      packQty: formData.packQty,
      comboType: formData.comboType,
      tpWh: '万邑通',
      status: '已绑定',
      updateTime: new Date().toLocaleString(),
      boundChildren: formData.children
    })

    // 附加审核流扩展字段
    const targetStatus = isSubmit ? '待审核' : '草稿'
    ;(saved as any).auditStatus = targetStatus
    ;(saved as any).workflowNo = workflowNo
    ;(saved as any).productManager = formData.productManager

    // 同步到本地存储并刷新
    const currentList = await dbFetchMaterialBindings()
    const idx = currentList.findIndex(i => i.parentCode === formData.parentCode)
    if (idx > -1) {
      (currentList[idx] as any).auditStatus = targetStatus
      ;(currentList[idx] as any).workflowNo = workflowNo
      ;(currentList[idx] as any).productManager = formData.productManager
      localStorage.setItem('SKU_KANBAN_BINDINGS_V2', JSON.stringify(currentList))
    }

    editDialogVisible.value = false

    if (isSubmit) {
      ElMessageBox.alert(
        `组合物料 <b>[${formData.parentCode}]</b> 已成功提交！<br/>系统已自动生成审批单号：<b class="text-primary">${workflowNo}</b><br/>当前审批节点：<b>【${formData.productManager}】</b>，已推送至产品经理审核队列！`,
        '提交并推送审核成功',
        { dangerouslyUseHTMLString: true, confirmButtonText: '查看审批进度', cancelButtonText: '好的', type: 'success' }
      ).then(() => {
        handleViewWorkflow({
          parentCode: formData.parentCode,
          productName: formData.productName,
          workflowNo: workflowNo,
          productManager: formData.productManager,
          auditStatus: '待审核'
        })
      }).catch(() => {})
    } else {
      ElMessage.info(`组合物料 [${formData.parentCode}] 已暂存为草稿！`)
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

// 模拟审核通过
const handlePassAudit = async (row: any) => {
  const currentList = await dbFetchMaterialBindings()
  const idx = currentList.findIndex(i => i.parentCode === row.parentCode)
  if (idx > -1) {
    (currentList[idx] as any).auditStatus = '已启用'
    ;(currentList[idx] as any).status = '已绑定'
    localStorage.setItem('SKU_KANBAN_BINDINGS_V2', JSON.stringify(currentList))
  }
  ElMessage.success(`组合物料 [${row.parentCode}] 审核通过，正式生效！`)
  workflowDialogVisible.value = false
  await loadData()
}

// 模拟驳回修改
const handleRejectAudit = async (row: any) => {
  const currentList = await dbFetchMaterialBindings()
  const idx = currentList.findIndex(i => i.parentCode === row.parentCode)
  if (idx > -1) {
    (currentList[idx] as any).auditStatus = '草稿'
    localStorage.setItem('SKU_KANBAN_BINDINGS_V2', JSON.stringify(currentList))
  }
  ElMessage.warning(`组合物料 [${row.parentCode}] 已驳回修改`)
  workflowDialogVisible.value = false
  await loadData()
}

const handleDelete = async (row: any) => {
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
  const count = selectedRows.value.length
  const confirm = await ElMessageBox.confirm(
    `确定要批量删除已勾选的 ${count} 款组合物料吗？`,
    '批量删除确认',
    { confirmButtonText: '批量删除', cancelButtonText: '取消', type: 'warning' }
  ).catch(() => false)

  if (!confirm) return

  try {
    const ids = selectedRows.value.map(r => r.id || r.parentCode)
    await dbBatchDeleteMaterialBindings(ids)
    ElMessage.success(`成功批量删除 ${count} 款组合物料！`)
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

.spec-dual-row {
  display: grid;
  grid-template-columns: 2.2fr 1fr 2.2fr 1fr;
  column-gap: 12px;
  align-items: center;

  .spec-cell-group {
    display: flex;
    align-items: center;
    gap: 6px;

    .spec-label-req {
      font-size: 12px;
      color: #334155;
      white-space: nowrap;
    }

    .lwh-input-box {
      display: flex;
      align-items: center;
      gap: 3px;

      .unit-sub {
        font-size: 11px;
        color: #94a3b8;
      }

      .unit-tail {
        font-size: 11px;
        color: #64748b;
      }

      .el-input {
        width: 58px;
      }
    }

    &.weight-group {
      .weight-input-box {
        display: flex;
        align-items: center;
        gap: 3px;

        .el-input {
          width: 70px;
        }

        .unit-tail {
          font-size: 11px;
          color: #64748b;
        }
      }
    }
  }
}

.custom-box-table-wrap {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e2e8f0;

  .custom-box-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;

    th {
      background: #f8fafc;
      color: #475569;
      font-weight: 600;
      padding: 6px 8px;
      border: 1px solid #e2e8f0;
      text-align: center;
    }

    td {
      padding: 6px 8px;
      border: 1px solid #e2e8f0;
      background: #fff;
      text-align: center;

      .table-inner-input,
      .table-lwh-box {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;

        .unit {
          color: #64748b;
          font-size: 11px;
        }

        .el-input {
          max-width: 90px;
        }
      }

      .table-lwh-box .el-input {
        width: 55px;
      }
    }
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
</style>
