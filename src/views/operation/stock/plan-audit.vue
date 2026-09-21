<template>
  <div class="plan-audit-page">
    <!-- 顶部智能预警横幅：防重复扣减穿透说明 -->
    <div class="penetration-notice-bar">
      <div class="notice-left">
        <el-icon class="notice-icon"><WarningFilled /></el-icon>
        <span class="notice-text">
          <b>子物料跨部门共享库存穿透机制生效中：</b>
          组合物料中包含独立在售或跨部门共享的子物料时，系统已自动按实际物理在库与全局在途动态排重预占，严防虚拟库存被重复扣减！
        </span>
        <el-tag size="small" type="danger" effect="plain" class="ml-2">
          检测到 3 项共享物料存在跨部门竞争
        </el-tag>
      </div>
      <div class="notice-right">
        <el-button 
          size="small" 
          type="primary" 
          plain 
          :icon="DataLine"
          @click="showCrossDeptDialog = true"
        >
          跨部门共享子物料全景看板
        </el-button>
        <el-button 
          size="small" 
          :icon="isAllExpanded ? ArrowUp : ArrowDown" 
          @click="toggleAllExpand"
        >
          {{ isAllExpanded ? '收起全部子物料' : '展开全部子物料穿透' }}
        </el-button>
      </div>
    </div>

    <!-- 顶部筛选区 -->
    <div class="filter-card">
      <el-form :model="queryParams" inline class="filter-form" size="small">
        <!-- 采购申请单类型 -->
        <el-form-item>
          <el-select 
            v-model="queryParams.orderType" 
            placeholder="采购申请单类型" 
            clearable 
            style="width: 135px"
          >
            <el-option label="全部类型" value="" />
            <el-option label="日常备货" value="日常备货" />
            <el-option label="项目备货" value="项目备货" />
            <el-option label="紧急备货" value="紧急备货" />
          </el-select>
        </el-form-item>

        <!-- 物料形态筛选 -->
        <el-form-item>
          <el-select 
            v-model="queryParams.materialType" 
            placeholder="物料形态" 
            clearable 
            style="width: 120px"
          >
            <el-option label="全部形态" value="" />
            <el-option label="组合物料(BOM)" value="combo" />
            <el-option label="单品独立物料" value="single" />
            <el-option label="跨部门共享竞争" value="shared" />
          </el-select>
        </el-form-item>

        <!-- 复合时间筛选 -->
        <el-form-item>
          <div class="composite-time-picker">
            <el-select v-model="queryParams.timeType" style="width: 125px" class="time-type-select">
              <el-option label="事业部审核时间" value="deptAuditTime" />
              <el-option label="最近一次下单时间" value="lastOrderTime" />
              <el-option label="期望交期" value="expectDeliveryDate" />
            </el-select>
            <el-date-picker
              v-model="queryParams.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD"
              style="width: 220px"
              class="date-range-picker"
            />
          </div>
        </el-form-item>

        <!-- 事业部 -->
        <el-form-item>
          <el-select 
            v-model="queryParams.dept" 
            placeholder="事业部" 
            clearable 
            style="width: 110px"
          >
            <el-option label="全部事业部" value="" />
            <el-option label="事业一部" value="事业一部" />
            <el-option label="事业二部" value="事业二部" />
            <el-option label="事业三部" value="事业三部" />
            <el-option label="事业四部" value="事业四部" />
            <el-option label="实验测试部" value="实验测试部" />
          </el-select>
        </el-form-item>

        <!-- Team组 -->
        <el-form-item>
          <el-select 
            v-model="queryParams.team" 
            placeholder="Team组" 
            clearable 
            style="width: 105px"
          >
            <el-option label="全部Team" value="" />
            <el-option label="Team1" value="Team1" />
            <el-option label="Team2" value="Team2" />
            <el-option label="Team3" value="Team3" />
            <el-option label="Team8" value="Team8" />
            <el-option label="实验测试组" value="实验测试组" />
          </el-select>
        </el-form-item>

        <!-- 物料编码 -->
        <el-form-item>
          <el-input 
            v-model="queryParams.materialCode" 
            placeholder="物料编码" 
            clearable 
            style="width: 115px" 
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <!-- 运营大类 -->
        <el-form-item>
          <el-select 
            v-model="queryParams.category" 
            placeholder="运营大类" 
            clearable 
            style="width: 125px"
          >
            <el-option label="全部大类" value="" />
            <el-option label="餐边柜" value="餐边柜" />
            <el-option label="食品储藏柜" value="食品储藏柜" />
            <el-option label="书柜" value="书柜" />
            <el-option label="组合电视柜" value="组合电视柜" />
            <el-option label="客餐厅单品" value="客餐厅单品" />
            <el-option label="平板电脑保护套" value="平板电脑" />
            <el-option label="平板键盘" value="平板键盘" />
            <el-option label="家居装饰" value="家居装饰" />
          </el-select>
        </el-form-item>

        <!-- 产品名称 -->
        <el-form-item>
          <el-input 
            v-model="queryParams.productName" 
            placeholder="产品名称" 
            clearable 
            style="width: 115px" 
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <!-- 节日标签 -->
        <el-form-item>
          <el-select 
            v-model="queryParams.holidayTag" 
            placeholder="节日标签" 
            clearable 
            style="width: 95px"
          >
            <el-option label="全部" value="" />
            <el-option label="无" value="无" />
            <el-option label="圣诞节" value="圣诞节" />
            <el-option label="万圣节" value="万圣节" />
          </el-select>
        </el-form-item>

        <!-- 季节标签 -->
        <el-form-item>
          <el-select 
            v-model="queryParams.seasonTag" 
            placeholder="季节标签" 
            clearable 
            style="width: 95px"
          >
            <el-option label="全部" value="" />
            <el-option label="无" value="无" />
            <el-option label="春季" value="春季" />
            <el-option label="夏季" value="夏季" />
            <el-option label="秋季" value="秋季" />
            <el-option label="冬季" value="冬季" />
          </el-select>
        </el-form-item>

        <!-- 搜索与重置按钮 -->
        <el-form-item class="action-btn-item">
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 快捷操作栏 -->
    <div class="table-toolbar">
      <div class="left-actions">
        <el-dropdown trigger="click" @command="handleBatchCommand">
          <el-button type="primary" size="small" class="audit-operate-btn">
            审批操作 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="pass" :disabled="!selectedRows.length">
                <el-icon color="#67c23a"><CircleCheck /></el-icon> 批量审批通过
              </el-dropdown-item>
              <el-dropdown-item command="reject" :disabled="!selectedRows.length">
                <el-icon color="#f56c6c"><CircleClose /></el-icon> 批量审批驳回
              </el-dropdown-item>
              <el-dropdown-item command="auto_adjust" :disabled="!selectedRows.length">
                <el-icon color="#409eff"><Cpu /></el-icon> 智能按穿透防重扣建议调整数量
              </el-dropdown-item>
              <el-dropdown-item command="transfer" :disabled="!selectedRows.length">
                <el-icon color="#e6a23c"><Share /></el-icon> 批量转交办理
              </el-dropdown-item>
              <el-dropdown-item divided command="export">
                <el-icon color="#409eff"><Download /></el-icon> 导出当前计划数据
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <span v-if="selectedRows.length" class="selected-tip">
          已勾选 <b>{{ selectedRows.length }}</b> 项
        </span>
      </div>

      <div class="right-tools">
        <el-tag size="small" type="info" class="mr-2">
          当前待审批共 {{ filteredTableData.length }} 条
        </el-tag>
        <el-tooltip content="刷新数据" placement="top">
          <el-button :icon="RefreshRight" circle size="small" @click="handleSearch" />
        </el-tooltip>
      </div>
    </div>

    <!-- 主数据表格 -->
    <div class="table-container">
      <el-table
        ref="tableRef"
        :data="filteredTableData"
        border
        stripe
        size="small"
        row-key="id"
        v-loading="loading"
        :expand-row-keys="expandedRowKeys"
        style="width: 100%; height: 100%"
        header-cell-class-name="custom-table-header"
        cell-class-name="custom-table-cell"
        @selection-change="handleSelectionChange"
        @expand-change="handleExpandChange"
      >
        <!-- 子物料穿透展开列 -->
        <el-table-column type="expand" width="36" fixed="left">
          <template #default="{ row }">
            <div v-if="isTrueCombo(row)" class="expand-penetration-wrapper">
              <!-- 展开区标题与汇总 -->
              <div class="expand-header-bar">
                <div class="expand-title">
                  <el-icon color="#1890ff"><Connection /></el-icon>
                  <span class="main-title">
                    {{ row.childMaterials.length > 1 ? `组合物料 BOM 多子件穿透分析（共 ${row.childMaterials.length} 项子部件）` : `单品多包组合穿透（1套包含 ${row.childMaterials[0].bomRatio} 件）` }}
                  </span>
                  <span class="sub-desc">（申请单号: {{ row.orderNo }} · 备货申请量: <b>{{ row.applyPurchaseQty }}</b> 套）</span>
                </div>
                <div class="expand-tags">
                  <el-tag :type="getRowBottleneckInfo(row).hasBottleneck ? 'warning' : 'success'" size="small" effect="dark">
                    木桶最小分配比例: {{ getRowBottleneckInfo(row).minRatioPercent }}
                  </el-tag>
                  <el-tag size="small" type="primary" effect="plain">
                    系统核定实际可供应数: <b>{{ getRowBottleneckInfo(row).suppliableQty }}</b> 套
                  </el-tag>
                  <el-tag v-if="getRowBottleneckInfo(row).hasBottleneck && getRowBottleneckInfo(row).bottleneckChild" size="small" type="danger" effect="plain">
                    木桶短板: {{ getRowBottleneckInfo(row).bottleneckChild.childCode }} ({{ getRowBottleneckInfo(row).bottleneckChild.ratioPercent }})
                  </el-tag>
                  <span class="deduct-tip">
                    * 依据方案A规则：实际可供应数 = 备货申请量 × 最小分配比例(木桶短板)
                  </span>
                </div>
              </div>

              <!-- 穿透子表格（严格依据截图公式） -->
              <el-table 
                :data="row.childMaterials || []" 
                size="mini" 
                border 
                class="sub-child-table"
              >
                <el-table-column prop="childCode" label="子物料编码" width="135">
                  <template #default="{ row: child }">
                    <span class="child-code-val">{{ child.childCode }}</span>
                    <el-tag v-if="child.isIndependentSale" size="small" type="warning" class="mini-tag">
                      独立在售
                    </el-tag>
                  </template>
                </el-table-column>
                
                <el-table-column prop="childName" label="子物料名称" min-width="140" show-overflow-tooltip />

                <el-table-column prop="bomRatio" label="单套用量" width="85" align="center">
                  <template #default="{ row: child }">
                    <span class="bom-ratio-tag">
                      {{ child.bomRatio > 1 ? `1套:${child.bomRatio}件` : `${child.bomRatio}件/套` }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column label="可用库存(在库+在途)" width="145" align="right">
                  <template #default="{ row: child }">
                    <el-tooltip :content="`国内在库: ${child.domesticStock} | 海外在库: ${child.overseasStock} | 采购在途: ${child.totalInTransit}`" placement="top">
                      <span class="stock-num">{{ getChildAllocationInfo(child.childCode).availableStock }}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>

                <el-table-column label="子SKU穿透总需求" width="145" align="right">
                  <template #header>
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px;">
                      <span>穿透总需求</span>
                      <el-tooltip content="子SKU全局穿透总需求 = SUM(所有组合SKU备货申请量 × BOM用量) + 单品备货申请量。悬停或点击数字可查看该子SKU在各申请单据上的详细分布明细。" placement="top">
                        <el-icon><InfoFilled /></el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                  <template #default="{ row: child }">
                    <el-popover
                      placement="top-end"
                      :width="620"
                      trigger="hover"
                      popper-class="demand-distribution-popover"
                    >
                      <template #reference>
                        <div class="demand-val-trigger" @click.stop="openDemandDistributionDialog(child.childCode)">
                          <span class="demand-num">{{ getChildAllocationInfo(child.childCode).totalDemand }}</span>
                          <el-icon class="demand-sub-icon"><DataAnalysis /></el-icon>
                          <span class="demand-hover-tip">分布</span>
                        </div>
                      </template>

                      <!-- Popover 浮层内容 -->
                      <div class="demand-popover-panel">
                        <div class="popover-header">
                          <div class="popover-header-title">
                            <el-tag size="small" type="primary" effect="plain" style="margin-right: 6px;">子SKU</el-tag>
                            <b>{{ child.childCode }}</b>
                            <span class="sub-name">{{ child.childName }}</span>
                          </div>
                          <div class="popover-header-stats">
                            <span>穿透总需求: <b class="text-primary">{{ getChildAllocationInfo(child.childCode).totalDemand }}</b> 件</span>
                            <span class="divider">|</span>
                            <span>可用库存: <b class="text-success">{{ getChildAllocationInfo(child.childCode).availableStock }}</b> 件</span>
                            <span class="divider">|</span>
                            <span>配给率: <b :class="getChildAllocationInfo(child.childCode).allocationRatio < 1 ? 'text-danger' : 'text-success'">{{ (getChildAllocationInfo(child.childCode).allocationRatio * 100).toFixed(1) }}%</b></span>
                          </div>
                        </div>

                        <div class="popover-summary-bar">
                          <span>该子SKU穿透总需求分布在以下 <b>{{ getChildAllocationInfo(child.childCode).demandBreakdown?.length || 0 }}</b> 笔申请单据上：</span>
                          <span v-if="getChildAllocationInfo(child.childCode).shortageQty > 0" class="text-danger font-bold">
                            需备货缺口: +{{ getChildAllocationInfo(child.childCode).shortageQty }} 件
                          </span>
                        </div>

                        <el-table 
                          :data="getChildAllocationInfo(child.childCode).demandBreakdown || []" 
                          size="mini" 
                          border 
                          stripe 
                          max-height="240"
                          style="width: 100%; margin: 8px 0;"
                        >
                          <el-table-column prop="orderNo" label="申请单号" width="130">
                            <template #default="{ row: item }">
                              <div class="order-no-font">{{ item.orderNo }}</div>
                              <el-tag size="small" :type="item.isCombo ? 'primary' : 'warning'" effect="plain" class="mini-tag">
                                {{ item.itemTypeDesc }}
                              </el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column prop="dept" label="申请部门" width="105" show-overflow-tooltip />
                          <el-table-column prop="parentName" label="申请产品/单据物料" min-width="135" show-overflow-tooltip>
                            <template #default="{ row: item }">
                              <div style="font-weight: 500;">{{ item.parentName }}</div>
                              <div style="font-size: 10px; color: #909399;">{{ item.parentCode }}</div>
                            </template>
                          </el-table-column>
                          <el-table-column label="申请数量" width="85" align="center">
                            <template #default="{ row: item }">
                              <div>{{ item.applyQty }} {{ item.unit }}</div>
                              <div v-if="item.isCombo" style="font-size: 10px; color: #909399;">1:{{ item.bomRatio }}</div>
                            </template>
                          </el-table-column>
                          <el-table-column label="需求贡献量" width="95" align="right">
                            <template #default="{ row: item }">
                              <div class="text-primary font-bold">{{ item.demandQty }} 件</div>
                              <div style="font-size: 10px; color: #909399;">
                                {{ getDemandPercent(item.demandQty, getChildAllocationInfo(child.childCode).totalDemand) }}%
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column label="配给获得量" width="90" align="right">
                            <template #default="{ row: item }">
                              <div class="text-success font-bold">{{ item.allocatedQty }} 件</div>
                              <div style="font-size: 10px; color: #909399;">{{ item.ratioPercent }}</div>
                            </template>
                          </el-table-column>
                        </el-table>

                        <div class="popover-footer-actions">
                          <span class="text-muted text-xs">💡 方案A: 穿透总需求 = ∑(各单申请量 × BOM用量)</span>
                          <el-button 
                            size="small" 
                            type="primary" 
                            link 
                            @click="openDemandDistributionDialog(child.childCode)"
                          >
                            点击打开全景看板 >
                          </el-button>
                        </div>
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>

                <el-table-column label="分配比例" width="115" align="center">
                  <template #header>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                      <span>分配比例</span>
                      <el-tooltip content="分配比例 = MIN(1, 可用库存 / 总需求) -- 考虑共享子SKU的短缺分配" placement="top">
                        <el-icon><InfoFilled /></el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                  <template #default="{ row: child }">
                    <el-tag 
                      size="small" 
                      :type="getChildAllocationInfo(child.childCode).allocationRatio >= 0.9999 ? 'success' : 'danger'"
                      effect="dark"
                    >
                      {{ (getChildAllocationInfo(child.childCode).allocationRatio * 100).toFixed(1) }}%
                    </el-tag>
                  </template>
                </el-table-column>

                <el-table-column label="本单分配量" width="115" align="right">
                  <template #default="{ row: child }">
                    <span class="text-success font-bold">
                      {{ Math.floor(row.applyPurchaseQty * (child.bomRatio || 1) * getChildAllocationInfo(child.childCode).allocationRatio) }}
                    </span>
                    <span class="text-xs text-muted"> / {{ row.applyPurchaseQty * (child.bomRatio || 1) }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="子SKU需备货量" width="130" align="right">
                  <template #header>
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px;">
                      <span>需备货量</span>
                      <el-tooltip content="子SKU需备货量 = MAX(0, 总需求 - 可用库存)" placement="top">
                        <el-icon><InfoFilled /></el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                  <template #default="{ row: child }">
                    <span v-if="getChildAllocationInfo(child.childCode).shortageQty > 0" class="text-danger font-bold">
                      缺口 +{{ getChildAllocationInfo(child.childCode).shortageQty }}
                    </span>
                    <span v-else class="text-success">
                      充足无需补
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 既是独立单品销售，又作为子部件隶属于组合套件的双向穿透面板 -->
            <div v-else-if="row.linkedParentCombo" class="expand-penetration-wrapper single-combo-shared-wrapper">
              <div class="expand-header-bar">
                <div class="expand-title">
                  <el-icon color="#e6a23c"><Share /></el-icon>
                  <span class="main-title">
                    独立在售单品 ⇆ 组合套件双向共享库存穿透监控
                  </span>
                  <span class="sub-desc">
                    （本物料为独立售卖单品，同时作为核心子部件被组合套件 <b>{{ row.linkedParentCombo.parentCode }} {{ row.linkedParentCombo.parentName }}</b> 共享引用）
                  </span>
                </div>
                <el-tag size="small" type="warning" effect="dark">
                  ⚠️ 单品与套件共用库存池锁定中
                </el-tag>
              </div>

              <div class="single-combo-stat-grid">
                <div class="stat-card">
                  <span class="s-label">底层物理在库+在途</span>
                  <span class="s-val text-success">{{ row.domesticStock + row.azOverseasStock + row.unfinishedPurchaseQty }}</span>
                  <span class="s-tip">国内{{ row.domesticStock }} + 海外{{ row.azOverseasStock }} + 在途{{ row.unfinishedPurchaseQty }}</span>
                </div>
                <div class="stat-symbol">-</div>
                <div class="stat-card">
                  <span class="s-label">套装备货单已锁定预占</span>
                  <span class="s-val text-danger">{{ row.linkedParentCombo.reservedQty }}</span>
                  <span class="s-tip">关联单号: {{ row.linkedParentCombo.orderNo }} ({{ row.linkedParentCombo.comboOrderQty }}套)</span>
                </div>
                <div class="stat-symbol">=</div>
                <div class="stat-card">
                  <span class="s-label">防重扣实际净结余</span>
                  <span class="s-val text-primary">{{ (row.domesticStock + row.azOverseasStock + row.unfinishedPurchaseQty) - row.linkedParentCombo.reservedQty }}</span>
                  <span class="s-tip">排重后本单可分配库存上限</span>
                </div>
                <div class="stat-symbol">VS</div>
                <div class="stat-card">
                  <span class="s-label">本单品申请备货数量</span>
                  <span class="s-val text-warning">{{ row.applyPurchaseQty }}</span>
                  <span class="s-tip">独立售卖备货需求</span>
                </div>
              </div>

              <div class="combo-link-alert">
                <el-icon color="#67c23a"><CircleCheckFilled /></el-icon>
                <span>
                  <b>防重复扣减核算结论：</b>
                  底层物理库存与在途总量充足，在锁定组合套件【{{ row.linkedParentCombo.parentCode }}】所需 {{ row.linkedParentCombo.reservedQty }} 件后，净可用结余仍达 {{ (row.domesticStock + row.azOverseasStock + row.unfinishedPurchaseQty) - row.linkedParentCombo.reservedQty }} 件，可直接审批通过本单品 {{ row.applyPurchaseQty }} 件的备货申请，不会导致套件缺料！
                </span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column type="selection" width="42" align="center" fixed="left" />

        <!-- 采购申请单类型 -->
        <el-table-column prop="orderType" label="采购申请单类型" width="115" align="center" fixed="left">
          <template #default="{ row }">
            <span :class="['order-type-tag', getOrderTypeClass(row.orderType)]">
              {{ row.orderType }}
            </span>
          </template>
        </el-table-column>

        <!-- 事业部审核时间 -->
        <el-table-column prop="deptAuditTime" label="事业部审核时间" width="155" align="center" show-overflow-tooltip />

        <!-- 最近一次下单时间 -->
        <el-table-column prop="lastOrderTime" label="最近一次下单时间" width="135" align="center">
          <template #default="{ row }">
            <span>{{ row.lastOrderTime || '-' }}</span>
          </template>
        </el-table-column>

        <!-- 事业部 -->
        <el-table-column prop="dept" label="事业部" width="100" align="center">
          <template #header>
            <div class="col-header-with-filter">
              <span>事业部</span>
              <el-icon class="filter-icon"><Filter /></el-icon>
            </div>
          </template>
        </el-table-column>

        <!-- Team -->
        <el-table-column prop="team" label="Team" width="90" align="center">
          <template #header>
            <div class="col-header-with-filter">
              <span>Team</span>
              <el-icon class="filter-icon"><Filter /></el-icon>
            </div>
          </template>
        </el-table-column>

        <!-- 物料编码 -->
        <el-table-column prop="materialCode" label="物料编码" width="145" align="center">
          <template #header>
            <div class="col-header-with-filter">
              <span>物料编码</span>
              <el-icon class="filter-icon"><Filter /></el-icon>
            </div>
          </template>
          <template #default="{ row }">
            <div class="code-wrapper">
              <span class="code-link" @click="handleApprove(row)">{{ row.materialCode }}</span>
              <div class="badge-row">
                <el-tag v-if="isTrueCombo(row)" size="small" type="primary" class="mini-badge">
                  {{ row.childMaterials.length > 1 ? `组合(${row.childMaterials.length}子件)` : `多包组合(1:${row.childMaterials[0].bomRatio})` }}
                </el-tag>
                <el-tag v-else-if="row.linkedParentCombo || (row.linkedParentCombos && row.linkedParentCombos.length)" size="small" type="warning" class="mini-badge">
                  单品(套件共用)
                </el-tag>
                <el-tag v-else size="small" type="info" class="mini-badge">
                  单品
                </el-tag>
                <el-tooltip v-if="row.hasCrossDeptConflict" content="子物料在其他事业部/备货单中共同占用，请注意防重复扣减" placement="top">
                  <el-tag size="small" type="danger" class="mini-badge">
                    共享冲突
                  </el-tag>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 运营大类 -->
        <el-table-column prop="category" label="运营大类" width="120" align="center" show-overflow-tooltip>
          <template #header>
            <div class="col-header-with-filter">
              <span>运营大类</span>
              <el-icon class="filter-icon"><Filter /></el-icon>
            </div>
          </template>
        </el-table-column>

        <!-- 产品名称 -->
        <el-table-column prop="productName" label="产品名称" width="115" align="center" show-overflow-tooltip>
          <template #header>
            <div class="col-header-with-filter">
              <span>产品名称</span>
              <el-icon class="filter-icon"><Filter /></el-icon>
            </div>
          </template>
        </el-table-column>

        <!-- 节日标签 -->
        <el-table-column prop="holidayTag" label="节日标签" width="85" align="center">
          <template #default="{ row }">
            <span class="tag-text">{{ row.holidayTag || '无' }}</span>
          </template>
        </el-table-column>

        <!-- 季节标签 -->
        <el-table-column prop="seasonTag" label="季节标签" width="85" align="center">
          <template #default="{ row }">
            <span class="tag-text">{{ row.seasonTag || '无' }}</span>
          </template>
        </el-table-column>

        <!-- 国内可用库存 -->
        <el-table-column prop="domesticStock" label="国内可用库存" width="105" align="right">
          <template #default="{ row }">
            <span :class="{ 'text-muted': row.domesticStock === 0 }">{{ row.domesticStock }}</span>
          </template>
        </el-table-column>

        <!-- 采购未完成数量 -->
        <el-table-column prop="unfinishedPurchaseQty" label="采购未完成数量" width="115" align="right">
          <template #default="{ row }">
            <span :class="{ 'text-muted': row.unfinishedPurchaseQty === 0 }">{{ row.unfinishedPurchaseQty }}</span>
          </template>
        </el-table-column>

        <!-- 申请审核中数量 -->
        <el-table-column prop="auditingQty" label="申请审核中数量" width="115" align="right">
          <template #default="{ row }">
            <span :class="{ 'text-muted': row.auditingQty === 0 }">{{ row.auditingQty }}</span>
          </template>
        </el-table-column>

        <!-- AZ海外总库存 -->
        <el-table-column prop="azOverseasStock" label="AZ海外总库存" width="110" align="right">
          <template #default="{ row }">
            <span :class="{ 'text-muted': row.azOverseasStock === 0, 'stock-highlight': row.azOverseasStock > 0 }">
              {{ row.azOverseasStock }}
            </span>
          </template>
        </el-table-column>

        <!-- 7、14、30天销量数量 -->
        <el-table-column prop="salesArray" label="7、14、30天销量数量" width="145" align="center">
          <template #default="{ row }">
            <span class="sales-array-font">{{ row.salesArray }}</span>
          </template>
        </el-table-column>

        <!-- 日均销量 -->
        <el-table-column prop="dailyAvgSales" label="日均销量" width="90" align="right">
          <template #default="{ row }">
            <span :class="{ 'text-muted': row.dailyAvgSales === 0 }">{{ row.dailyAvgSales }}</span>
          </template>
        </el-table-column>

        <!-- 采购申请数量 -->
        <el-table-column prop="applyPurchaseQty" label="申请备货量" width="95" align="right">
          <template #default="{ row }">
            <span class="apply-qty-val">{{ row.applyPurchaseQty }}</span>
          </template>
        </el-table-column>

        <!-- 实际可供应数（木桶最小比例核算） -->
        <el-table-column label="实际可供应数" width="130" align="right">
          <template #header>
            <div class="col-header-with-filter">
              <span>实际可供应数</span>
              <el-tooltip content="实际可供应数 = 备货申请量 × 最小分配比例(木桶短板子SKU)" placement="top">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row }">
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
              <span 
                style="font-weight: 700; font-size: 13px;"
                :class="getRowBottleneckInfo(row).hasBottleneck ? 'text-danger' : 'text-success'"
              >
                {{ getRowBottleneckInfo(row).suppliableQty }}
              </span>
              <el-tag 
                size="small" 
                :type="getRowBottleneckInfo(row).hasBottleneck ? 'danger' : 'success'"
                effect="plain"
                style="font-size: 10px; height: 18px; line-height: 16px; padding: 0 4px;"
              >
                {{ getRowBottleneckInfo(row).minRatioPercent }}
                <span v-if="getRowBottleneckInfo(row).hasBottleneck">短板</span>
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <!-- 申请备货后周转天数 -->
        <el-table-column prop="turnoverDays" label="申请备货后周转天数" width="135" align="right">
          <template #default="{ row }">
            <span :class="getTurnoverClass(row.turnoverDays)">
              {{ row.turnoverDays }}
            </span>
          </template>
        </el-table-column>

        <!-- 期望交期 -->
        <el-table-column prop="expectDeliveryDate" label="期望交期" width="110" align="center" />

        <!-- 操作 -->
        <el-table-column label="操作" width="110" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" class="op-btn" @click="handleApprove(row)">
              审批
            </el-button>
            <template v-if="isTrueCombo(row)">
              <el-divider direction="vertical" />
              <el-button type="info" link size="small" class="op-btn" @click="toggleRowExpand(row)">
                {{ isRowExpanded(row) ? '收起' : '穿透' }}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 底部分页栏 -->
    <div class="pagination-footer">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        size="small"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 计划部审批抽屉 / 弹窗 -->
    <el-drawer
      v-model="drawerVisible"
      :title="`备货计划审批 - ${currentRow?.materialCode || ''}`"
      size="650px"
      direction="rtl"
      destroy-on-close
      class="audit-drawer"
    >
      <div v-if="currentRow" class="drawer-content">
        <!-- 基础单据信息卡片 -->
        <div class="drawer-card">
          <div class="card-title">
            <el-icon color="#409eff"><Document /></el-icon>
            <span>申请单据信息</span>
            <span :class="['order-type-tag', getOrderTypeClass(currentRow.orderType)]" style="margin-left: auto;">
              {{ currentRow.orderType }}
            </span>
          </div>
          <el-descriptions :column="2" size="small" border>
            <el-descriptions-item label="物料编码">{{ currentRow.materialCode }}</el-descriptions-item>
            <el-descriptions-item label="产品名称">{{ currentRow.productName }}</el-descriptions-item>
            <el-descriptions-item label="物料形态">
              <el-tag size="small" :type="isTrueCombo(currentRow) ? 'primary' : 'info'">
                {{ isTrueCombo(currentRow) ? (currentRow.childMaterials?.length > 1 ? `组合物料(${currentRow.childMaterials?.length}子件)` : `多包组合(1:${currentRow.childMaterials[0]?.bomRatio})`) : '单品物料' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="归属部门">{{ currentRow.dept }} / {{ currentRow.team }}</el-descriptions-item>
            <el-descriptions-item label="期望交期">{{ currentRow.expectDeliveryDate }}</el-descriptions-item>
            <el-descriptions-item label="审核提交时间">{{ currentRow.deptAuditTime }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 关键高亮：APS 木桶短板与短缺分配核算引擎（组合物料） -->
        <div v-if="isTrueCombo(currentRow)" class="drawer-card highlight-card">
          <div class="card-title">
            <el-icon color="#f56c6c"><Cpu /></el-icon>
            <span>组合物料 APS 木桶瓶颈与短缺分配核算</span>
            <el-tag size="small" :type="getRowBottleneckInfo(currentRow).hasBottleneck ? 'danger' : 'success'" effect="plain" style="margin-left: auto;">
              {{ getRowBottleneckInfo(currentRow).hasBottleneck ? '⚠️ 木桶短板受限' : '🟢 全子件100%充足' }}
            </el-tag>
          </div>

          <div class="anti-deduct-panel">
            <!-- 核心指标摘要横幅 -->
            <div class="aps-summary-banner" style="background: #f0f9eb; border: 1px solid #c2e7b0; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 12px; color: #67c23a; font-weight: 600;">系统核定实际可供应数</div>
                <div style="font-size: 22px; font-weight: bold; color: #2e7d32;">
                  {{ getRowBottleneckInfo(currentRow).suppliableQty }} <span style="font-size: 13px; font-weight: normal;">套</span>
                </div>
                <div style="font-size: 11px; color: #888;">原备货申请：{{ currentRow.applyPurchaseQty }} 套</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 12px; color: #909399;">组合最小分配比例 (木桶瓶颈)</div>
                <div style="font-size: 18px; font-weight: bold;" :class="getRowBottleneckInfo(currentRow).hasBottleneck ? 'text-danger' : 'text-success'">
                  {{ getRowBottleneckInfo(currentRow).minRatioPercent }}
                </div>
                <div v-if="getRowBottleneckInfo(currentRow).hasBottleneck && getRowBottleneckInfo(currentRow).bottleneckChild" style="font-size: 11px; color: #f56c6c;">
                  木桶短板: {{ getRowBottleneckInfo(currentRow).bottleneckChild.childCode }}
                </div>
              </div>
            </div>

            <!-- 公式解析提示框（方案A：备货申请量净驱动） -->
            <div class="formula-explain-box" style="background: #f4f4f5; border-radius: 4px; padding: 8px 12px; margin-bottom: 12px; font-size: 11px; color: #606266; line-height: 1.6;">
              <div style="font-weight: 600; color: #303133; margin-bottom: 4px;">📐 计划部审批核算公式（方案A · 备货申请驱动）：</div>
              <div>• <b>子SKU穿透总需求</b> = ∑(引用该子件的所有组合SKU申请量 × BOM用量) + 该子件单品备货申请量</div>
              <div>• <b>分配比例</b> = MIN(1, 可用物理库存 / 子SKU穿透总需求) —— 跨单据共享短缺公平等比配给</div>
              <div>• <b>组合实际可供数</b> = 本单组合申请量 × 最小分配比例(木桶最短板子件)</div>
              <div>• <b>子SKU需备货量</b> = MAX(0, 子SKU穿透总需求 - 可用物理库存)</div>
            </div>

            <!-- 子物料穿透明细表 -->
            <el-table :data="currentRow.childMaterials || []" size="mini" border style="width: 100%; margin-bottom: 12px;">
              <el-table-column prop="childCode" label="子物料" min-width="120">
                <template #default="{ row: child }">
                  <div style="font-weight: 600;">{{ child.childCode }}</div>
                  <div style="font-size: 11px; color: #909399;">{{ child.childName }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="bomRatio" label="BOM" width="55" align="center">
                <template #default="{ row: child }">
                  1:{{ child.bomRatio }}
                </template>
              </el-table-column>
              <el-table-column label="可用库存" width="75" align="right">
                <template #default="{ row: child }">
                  {{ getChildAllocationInfo(child.childCode).availableStock }}
                </template>
              </el-table-column>
              <el-table-column label="穿透总需求" width="95" align="right">
                <template #default="{ row: child }">
                  <el-popover
                    placement="left"
                    :width="560"
                    trigger="hover"
                    popper-class="demand-distribution-popover"
                  >
                    <template #reference>
                      <span 
                        class="text-primary font-bold demand-clickable-text" 
                        @click.stop="openDemandDistributionDialog(child.childCode)"
                        title="点击查看申请分布明细"
                      >
                        {{ getChildAllocationInfo(child.childCode).totalDemand }}
                        <el-icon style="font-size: 10px; margin-left: 1px;"><DataAnalysis /></el-icon>
                      </span>
                    </template>
                    <div class="demand-popover-panel">
                      <div class="popover-header">
                        <div class="popover-header-title">
                          <b>{{ child.childCode }}</b> {{ child.childName }}
                        </div>
                        <div class="popover-header-stats">
                          总需: <b class="text-primary">{{ getChildAllocationInfo(child.childCode).totalDemand }}</b> | 
                          可供: <b class="text-success">{{ getChildAllocationInfo(child.childCode).availableStock }}</b> | 
                          比例: <b>{{ (getChildAllocationInfo(child.childCode).allocationRatio * 100).toFixed(1) }}%</b>
                        </div>
                      </div>
                      <el-table :data="getChildAllocationInfo(child.childCode).demandBreakdown || []" size="mini" border stripe max-height="200" style="width: 100%; margin: 6px 0;">
                        <el-table-column prop="orderNo" label="申请单号" width="120" />
                        <el-table-column prop="dept" label="部门" width="95" show-overflow-tooltip />
                        <el-table-column prop="parentName" label="申请产品" min-width="120" show-overflow-tooltip />
                        <el-table-column label="需求量" width="80" align="right">
                          <template #default="{ row: item }">
                            <b class="text-primary">{{ item.demandQty }}</b>
                          </template>
                        </el-table-column>
                        <el-table-column label="分配量" width="80" align="right">
                          <template #default="{ row: item }">
                            <b class="text-success">{{ item.allocatedQty }}</b>
                          </template>
                        </el-table-column>
                      </el-table>
                      <div style="text-align: right;">
                        <el-button size="small" type="primary" link @click="openDemandDistributionDialog(child.childCode)">
                          查看全屏明细 >
                        </el-button>
                      </div>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="分配比例" width="80" align="center">
                <template #default="{ row: child }">
                  <el-tag size="small" :type="getChildAllocationInfo(child.childCode).allocationRatio >= 0.9999 ? 'success' : 'danger'">
                    {{ (getChildAllocationInfo(child.childCode).allocationRatio * 100).toFixed(1) }}%
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="子件需备货" width="85" align="right">
                <template #default="{ row: child }">
                  <span v-if="getChildAllocationInfo(child.childCode).shortageQty > 0" class="text-danger font-bold">
                    +{{ getChildAllocationInfo(child.childCode).shortageQty }}
                  </span>
                  <span v-else class="text-success">0</span>
                </template>
              </el-table-column>
            </el-table>

            <!-- 智能建议采购数量 -->
            <div class="recommend-box" style="display: flex; justify-content: space-between; align-items: center; background: #ecf5ff; border: 1px solid #d9ecff; border-radius: 4px; padding: 10px 14px;">
              <div class="rec-info">
                <span style="font-size: 13px; color: #409eff; font-weight: 600;">系统核定实际可供应数：</span>
                <b class="rec-val" style="font-size: 18px; color: #409eff;">{{ getRecommendedApprovedQty(currentRow) }}</b> 套
                <span class="rec-sub" style="font-size: 12px; color: #909399; margin-left: 6px;">（按木桶最小比例 {{ getRowBottleneckInfo(currentRow).minRatioPercent }} 核定）</span>
              </div>
              <el-button 
                type="primary" 
                size="small" 
                @click="applyRecommendedQty"
              >
                一键采纳实际可供应数
              </el-button>
            </div>
          </div>
        </div>

        <!-- 既是独立在售单品，又属于组合套件的核算卡片 -->
        <div v-else-if="currentRow.linkedParentCombo || (currentRow.linkedParentCombos && currentRow.linkedParentCombos.length)" class="drawer-card highlight-card">
          <div class="card-title">
            <el-icon color="#e6a23c"><Share /></el-icon>
            <span>单品 ⇆ 组合套件共享短缺分配核算</span>
            <el-tag size="small" type="warning" effect="plain" style="margin-left: auto;">
              单品&套件共用物理库存
            </el-tag>
          </div>
          <div class="anti-deduct-panel">
            <div class="anti-desc">
              本物料为独立单品销售，同时作为核心子部件被多个组合套件共享。系统遵循全局穿透与公平比例分配原则。
            </div>

            <!-- 核心指标摘要横幅 -->
            <div class="aps-summary-banner" style="background: #fdf6ec; border: 1px solid #faecd8; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 12px; color: #e6a23c; font-weight: 600;">单品可分配供应数</div>
                <div style="font-size: 22px; font-weight: bold; color: #b88230;">
                  {{ getRowBottleneckInfo(currentRow).suppliableQty }} <span style="font-size: 13px; font-weight: normal;">件</span>
                </div>
                <div style="font-size: 11px; color: #888;">原申请：{{ currentRow.applyPurchaseQty }} 件</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 12px; color: #909399;">全局可用分配比例</div>
                <div style="font-size: 18px; font-weight: bold;" :class="getRowBottleneckInfo(currentRow).hasBottleneck ? 'text-danger' : 'text-success'">
                  {{ getRowBottleneckInfo(currentRow).minRatioPercent }}
                </div>
                <div style="font-size: 11px; color: #909399;">
                  可用存: {{ getChildAllocationInfo(currentRow.materialCode).availableStock }} / 总需: {{ getChildAllocationInfo(currentRow.materialCode).totalDemand }}
                </div>
              </div>
            </div>
            
            <!-- 关联引用的组合套件明细 -->
            <div class="linked-combos-box" style="background: #fff; border: 1px dashed #f5dab1; border-radius: 4px; padding: 8px 12px; margin-bottom: 12px;">
              <div style="font-size: 12px; font-weight: 600; color: #b88230; margin-bottom: 6px;">
                共同消耗该物料的组合套装备货单明细：
              </div>
              <div v-for="(combo, idx) in getLinkedCombosList(currentRow)" :key="idx" style="font-size: 12px; color: #606266; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <el-tag size="small" type="danger" effect="plain" style="margin-right: 6px; font-size: 11px;">
                    组合需 {{ combo.reservedQty }} 件
                  </el-tag>
                  <span>【{{ combo.orderNo }}】<b>{{ combo.parentCode }} {{ combo.parentName }}</b>（申请 {{ combo.comboOrderQty }} 套，单套 {{ combo.bomRatio || 1 }}件）</span>
                </div>
                <el-tag size="small" type="info">{{ combo.dept || '事业部' }}</el-tag>
              </div>
            </div>

            <!-- 需备货补采建议 -->
            <div style="display: flex; justify-content: space-between; align-items: center; background: #fdf6ec; border: 1px solid #faecd8; border-radius: 4px; padding: 10px 14px;">
              <div class="rec-info">
                <span style="font-size: 13px; color: #e6a23c; font-weight: 600;">子SKU需备货采购量：</span>
                <b class="rec-val" style="font-size: 18px; color: #f56c6c;">
                  +{{ getChildAllocationInfo(currentRow.materialCode).shortageQty }}
                </b> 件
                <span class="rec-sub" style="font-size: 12px; color: #909399; margin-left: 6px;">
                  ({{ getChildAllocationInfo(currentRow.materialCode).shortageQty > 0 ? '全域存在缺口需下达采购' : '库存充足' }})
                </span>
              </div>
              <el-button 
                type="warning" 
                size="small" 
                @click="applyRecommendedQty"
              >
                一键采纳单品分配数
              </el-button>
            </div>
          </div>
        </div>

        <div v-else class="drawer-card">
          <div class="card-title">
            <el-icon color="#409eff"><Document /></el-icon>
            <span>单品独立物料库存说明</span>
          </div>
          <div class="single-item-note">
            当前单据为标准独立单品物料，无需BOM多子件配比拆解，在库与在途库存直接由该物料承载。
          </div>
        </div>

        <!-- 经营与库存指标卡片 -->
        <div class="drawer-card">
          <div class="card-title">
            <el-icon color="#67c23a"><DataAnalysis /></el-icon>
            <span>父级业务周转与销售表现</span>
          </div>
          <div class="metric-grid">
            <div class="metric-item">
              <span class="m-label">国内可用库存</span>
              <span class="m-val">{{ currentRow.domesticStock }}</span>
            </div>
            <div class="metric-item">
              <span class="m-label">采购在途未完成</span>
              <span class="m-val">{{ currentRow.unfinishedPurchaseQty }}</span>
            </div>
            <div class="metric-item">
              <span class="m-label">AZ海外总库存</span>
              <span class="m-val highlight">{{ currentRow.azOverseasStock }}</span>
            </div>
            <div class="metric-item">
              <span class="m-label">7/14/30天销量</span>
              <span class="m-val">{{ currentRow.salesArray }}</span>
            </div>
            <div class="metric-item">
              <span class="m-label">日均销量</span>
              <span class="m-val">{{ currentRow.dailyAvgSales }}</span>
            </div>
            <div class="metric-item">
              <span class="m-label">申请备货数量</span>
              <span class="m-val highlight-blue">{{ currentRow.applyPurchaseQty }}</span>
            </div>
            <div class="metric-item wide">
              <span class="m-label">备货后周转天数</span>
              <span class="m-val" :class="getTurnoverClass(currentRow.turnoverDays)">{{ currentRow.turnoverDays }} 天</span>
            </div>
          </div>
        </div>

        <!-- 审批流转轨迹 -->
        <div class="drawer-card">
          <div class="card-title">
            <el-icon color="#e6a23c"><Share /></el-icon>
            <span>审批流程轨迹</span>
          </div>
          <el-steps :active="3" finish-status="success" align-center size="small" class="audit-steps">
            <el-step title="运营发起" description="已提交" />
            <el-step title="Team审核" description="已通过" />
            <el-step title="事业部审核" description="已通过" />
            <el-step title="计划部审批" description="待审批" status="process" />
            <el-step title="PMC确认" description="待处理" />
          </el-steps>
        </div>

        <!-- 计划部审批表单 -->
        <div class="drawer-card">
          <div class="card-title">
            <el-icon color="#409eff"><Edit /></el-icon>
            <span>计划部审批操作</span>
          </div>
          <el-form :model="auditForm" label-position="top" size="small">
            <el-form-item label="审批结果" required>
              <el-radio-group v-model="auditForm.result">
                <el-radio-button label="pass">审批通过</el-radio-button>
                <el-radio-button label="modify_pass">调整数量通过</el-radio-button>
                <el-radio-button label="reject">审批驳回</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item v-if="auditForm.result === 'modify_pass'" label="核定采购数量" required>
              <el-input-number 
                v-model="auditForm.approvedQty" 
                :min="1" 
                :max="99999" 
                style="width: 200px" 
              />
              <span class="form-item-tip">（原申请数量：{{ currentRow.applyPurchaseQty }}）</span>
            </el-form-item>

            <el-form-item label="计划部核准交期">
              <el-date-picker 
                v-model="auditForm.approvedDeliveryDate" 
                type="date" 
                placeholder="确认期望交期"
                value-format="YYYY-MM-DD"
                style="width: 200px"
              />
            </el-form-item>

            <el-form-item label="审批意见 / 批注说明">
              <el-input
                v-model="auditForm.remark"
                type="textarea"
                :rows="3"
                placeholder="请输入计划部审批说明、防重复扣减核减原因或交期调整说明..."
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="submitAudit">
            确认提交审批
          </el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 跨部门共享子物料全景看板弹窗 -->
    <el-dialog
      v-model="showCrossDeptDialog"
      title="跨部门共享子SKU穿透总需求与短缺分配全景看板"
      width="960px"
      destroy-on-close
    >
      <div class="cross-dept-dialog-body">
        <el-alert
          title="APS 木桶瓶颈与短缺分配规则说明（方案A · 备货申请驱动）"
          type="info"
          description="① 子SKU全局穿透总需求 = SUM(所有组合SKU备货申请量 × BOM用量) + 单品备货申请量；② 分配比例 = MIN(1, 可用物理库存 / 子SKU穿透总需求)；③ 组合实际可供数 = 备货申请量 × 最小分配比例；④ 子SKU需备货量 = MAX(0, 子SKU穿透总需求 - 可用物理库存)。"
          show-icon
          :closable="false"
          style="margin-bottom: 16px;"
        />

        <el-table :data="sharedMaterialSummaryList" border size="small">
          <el-table-column prop="childCode" label="共享子SKU编码" width="135">
            <template #default="{ row }">
              <b>{{ row.childCode }}</b>
              <el-tag v-if="row.isIndependentSale" size="small" type="warning" class="mini-tag">
                独立在售
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="childName" label="子物料名称" width="150" show-overflow-tooltip />
          <el-table-column label="可用库存(在库+在途)" width="140" align="right">
            <template #default="{ row }">
              <span class="stock-num">{{ getChildAllocationInfo(row.childCode).availableStock }}</span>
            </template>
          </el-table-column>
          <el-table-column label="子SKU穿透总需求" width="140" align="right">
            <template #default="{ row }">
              <span 
                class="text-primary font-bold demand-clickable-text"
                @click="openDemandDistributionDialog(row.childCode)"
                title="点击查看在各申请单据上的详细分布"
              >
                {{ getChildAllocationInfo(row.childCode).totalDemand }}
                <el-icon style="font-size: 11px; margin-left: 2px;"><DataAnalysis /></el-icon>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="短缺分配比例" width="115" align="center">
            <template #default="{ row }">
              <el-tag 
                size="small" 
                :type="getChildAllocationInfo(row.childCode).allocationRatio >= 0.9999 ? 'success' : 'danger'"
                effect="dark"
              >
                {{ (getChildAllocationInfo(row.childCode).allocationRatio * 100).toFixed(1) }}%
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="子SKU需备货量" width="120" align="right">
            <template #default="{ row }">
              <span v-if="getChildAllocationInfo(row.childCode).shortageQty > 0" class="text-danger font-bold">
                +{{ getChildAllocationInfo(row.childCode).shortageQty }}
              </span>
              <span v-else class="text-success">0 (充足)</span>
            </template>
          </el-table-column>
          <el-table-column label="关联组合与单品需求分布明细" min-width="260">
            <template #default="{ row }">
              <div 
                v-for="(item, i) in (getChildAllocationInfo(row.childCode).demandBreakdown?.length ? getChildAllocationInfo(row.childCode).demandBreakdown : row.relatedOrders)" 
                :key="i" 
                class="compete-item"
                style="margin-bottom: 3px;"
              >
                <el-tag size="small" :type="(item.dept || '').includes('一部') ? 'primary' : 'warning'" effect="plain" class="mini-tag">
                  {{ item.dept }}
                </el-tag>
                <span class="ml-1 text-xs" style="color: #303133;">
                  <b>{{ item.orderNo || '' }}</b> {{ item.parentName || item.orderType }}: 
                  需求 <b class="text-primary">{{ item.demandQty !== undefined ? item.demandQty : item.qty }}</b>件
                  <template v-if="item.allocatedQty !== undefined">
                    (分配 <span class="text-success font-bold">{{ item.allocatedQty }}</span>件)
                  </template>
                </span>
              </div>
              <div style="margin-top: 4px;">
                <el-button size="small" type="primary" link @click="openDemandDistributionDialog(row.childCode)">
                  查看穿透分布图表 >
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <el-button type="primary" @click="showCrossDeptDialog = false">关闭看板</el-button>
      </template>
    </el-dialog>

    <!-- 子SKU穿透总需求在各申请上的分布明细全景看板弹窗 -->
    <el-dialog
      v-model="demandDistributionDialogVisible"
      :title="`子SKU【${selectedChildSkuInfo?.childCode || ''}】穿透总需求在各申请上的分布明细全景看板`"
      width="840px"
      destroy-on-close
      class="demand-dist-dialog"
    >
      <div v-if="selectedChildSkuInfo" class="distribution-dialog-body">
        <!-- 头部子SKU信息卡片 -->
        <div class="sku-header-card">
          <div class="sku-header-left">
            <div class="sku-title-row">
              <span class="sku-badge">子SKU</span>
              <span class="sku-code-text">{{ selectedChildSkuInfo.childCode }}</span>
              <span class="sku-name-text">{{ selectedChildSkuInfo.childName }}</span>
              <el-tag v-if="selectedChildSkuInfo.isIndependentSale" size="small" type="warning" effect="plain">
                独立单品在售
              </el-tag>
            </div>
            <div class="sku-sub-desc">
              遵循方案A备货申请驱动：该子SKU总需求由全域所有引用该子件的组合套件备货申请量（乘BOM用量）及单品直接备货量累加构成，严格防范重复扣减与短缺挤占。
            </div>
          </div>
        </div>

        <!-- 4格核心数据指标 -->
        <div class="dist-stat-cards">
          <div class="dist-card highlight-blue">
            <div class="dist-label">子SKU穿透总需求</div>
            <div class="dist-val text-primary">{{ selectedChildSkuInfo.totalDemand }} <span class="dist-unit">件</span></div>
            <div class="dist-tip">全域 {{ selectedChildSkuInfo.demandBreakdown?.length || 0 }} 笔申请需求汇总</div>
          </div>
          <div class="dist-card">
            <div class="dist-label">物理可用库存(在库+在途)</div>
            <div class="dist-val text-success">{{ selectedChildSkuInfo.availableStock }} <span class="dist-unit">件</span></div>
            <div class="dist-tip">含国内在库、海外在库及在途</div>
          </div>
          <div class="dist-card">
            <div class="dist-label">综合短缺分配比例</div>
            <div class="dist-val" :class="selectedChildSkuInfo.allocationRatio >= 0.9999 ? 'text-success' : 'text-danger'">
              {{ (selectedChildSkuInfo.allocationRatio * 100).toFixed(1) }}%
            </div>
            <div class="dist-tip">{{ selectedChildSkuInfo.allocationRatio >= 0.9999 ? '无短缺 100%全额配给' : '库存不足，各单等比配给' }}</div>
          </div>
          <div class="dist-card">
            <div class="dist-label">子SKU缺口需备货量</div>
            <div class="dist-val" :class="selectedChildSkuInfo.shortageQty > 0 ? 'text-danger' : 'text-success'">
              {{ selectedChildSkuInfo.shortageQty > 0 ? `+${selectedChildSkuInfo.shortageQty}` : '0' }} <span class="dist-unit">件</span>
            </div>
            <div class="dist-tip">{{ selectedChildSkuInfo.shortageQty > 0 ? '需向供应商下达补采计划' : '库存充足 无需额外备货' }}</div>
          </div>
        </div>

        <!-- 需求分布占比条形进度 -->
        <div class="demand-share-bar-section">
          <div class="share-bar-title">
            <span style="font-weight: 600; color: #303133;">各申请单据需求贡献分布占比 (总需求 {{ selectedChildSkuInfo.totalDemand }} 件)：</span>
          </div>
          <div class="share-progress-container">
            <div 
              v-for="(item, idx) in selectedChildSkuInfo.demandBreakdown" 
              :key="idx"
              class="share-progress-item"
              :style="{ width: getDemandPercent(item.demandQty, selectedChildSkuInfo.totalDemand) + '%', backgroundColor: getBarColor(idx) }"
              :title="`${item.orderNo} (${item.parentName}): 需求 ${item.demandQty}件 (${getDemandPercent(item.demandQty, selectedChildSkuInfo.totalDemand)}%)`"
            >
              <span v-if="parseFloat(getDemandPercent(item.demandQty, selectedChildSkuInfo.totalDemand)) >= 15" class="bar-label">
                {{ item.parentName ? item.parentName.slice(0, 6) : item.orderNo }}.. ({{ getDemandPercent(item.demandQty, selectedChildSkuInfo.totalDemand) }}%)
              </span>
            </div>
          </div>
          <div class="share-legend-row">
            <div v-for="(item, idx) in selectedChildSkuInfo.demandBreakdown" :key="idx" class="legend-item">
              <span class="legend-color-dot" :style="{ backgroundColor: getBarColor(idx) }"></span>
              <span class="legend-text">
                {{ item.orderNo }} ({{ item.dept }}): <b>{{ item.demandQty }}件</b> ({{ getDemandPercent(item.demandQty, selectedChildSkuInfo.totalDemand) }}%)
              </span>
            </div>
          </div>
        </div>

        <!-- 申请单据明细分布表格 -->
        <div class="dist-table-wrapper">
          <div class="dist-table-header">
            <span style="font-weight: 600; color: #303133;">分布在以下申请单据明细表：</span>
            <span style="font-size: 12px; color: #909399;">按比例分配量 = 该单需求量 × {{ (selectedChildSkuInfo.allocationRatio * 100).toFixed(1) }}%</span>
          </div>
          <el-table :data="selectedChildSkuInfo.demandBreakdown || []" size="small" border stripe style="width: 100%;">
            <el-table-column prop="orderNo" label="申请单号" width="155">
              <template #default="{ row: item }">
                <div style="font-family: monospace; font-weight: 600; color: #1890ff;">{{ item.orderNo }}</div>
                <el-tag size="small" :type="item.isCombo ? 'primary' : 'warning'" effect="plain" class="mini-tag">
                  {{ item.itemTypeDesc }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dept" label="申请部门 / Team" width="130" />
            <el-table-column prop="parentName" label="申请产品 / 单据物料" min-width="160">
              <template #default="{ row: item }">
                <div style="font-weight: 500;">{{ item.parentName }}</div>
                <div style="font-size: 11px; color: #909399;">物料编码: {{ item.parentCode }}</div>
              </template>
            </el-table-column>
            <el-table-column label="申请数量及用量" width="125" align="center">
              <template #default="{ row: item }">
                <div style="font-weight: 500;">{{ item.applyQty }} {{ item.unit }}</div>
                <div v-if="item.isCombo" style="font-size: 11px; color: #909399;">单套 BOM 1:{{ item.bomRatio }}</div>
                <div v-else style="font-size: 11px; color: #909399;">独立单品 1:1</div>
              </template>
            </el-table-column>
            <el-table-column label="该单需求贡献量" width="130" align="right">
              <template #default="{ row: item }">
                <div class="text-primary font-bold" style="font-size: 14px;">{{ item.demandQty }} 件</div>
                <div style="font-size: 11px; color: #909399;">
                  占比 {{ getDemandPercent(item.demandQty, selectedChildSkuInfo.totalDemand) }}%
                </div>
              </template>
            </el-table-column>
            <el-table-column label="本单分配获得量" width="125" align="right">
              <template #default="{ row: item }">
                <div class="text-success font-bold" style="font-size: 14px;">{{ item.allocatedQty }} 件</div>
                <div style="font-size: 11px; color: #909399;">配给率 {{ item.ratioPercent }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <span style="font-size: 12px; color: #909399;">
            💡 穿透总需求 SUM({{ selectedChildSkuInfo?.totalDemand || 0 }}件) = 各申请单需求贡献量求和
          </span>
          <el-button type="primary" @click="demandDistributionDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search, Refresh, ArrowDown, ArrowUp, CircleCheck, CircleClose, Share, Download,
  RefreshRight, Document, DataAnalysis, Edit, Filter, WarningFilled, CircleCheckFilled,
  Connection, InfoFilled, Cpu, DataLine
} from '@element-plus/icons-vue'

// 筛选表单数据
const queryParams = reactive({
  orderType: '',
  materialType: '',
  timeType: 'deptAuditTime',
  dateRange: [] as string[],
  dept: '',
  team: '',
  materialCode: '',
  category: '',
  productName: '',
  holidayTag: '',
  seasonTag: ''
})

// 分页状态
const pagination = reactive({
  currentPage: 1,
  pageSize: 20
})

const loading = ref(false)
const selectedRows = ref<any[]>([])
const expandedRowKeys = ref<string[]>([])
const showCrossDeptDialog = ref(false)
const demandDistributionDialogVisible = ref(false)
const selectedChildSkuCode = ref('')
const selectedChildSkuInfo = computed(() => getChildAllocationInfo(selectedChildSkuCode.value))

const openDemandDistributionDialog = (childCode: string) => {
  selectedChildSkuCode.value = childCode
  demandDistributionDialogVisible.value = true
}

const getDemandPercent = (qty: number, total: number) => {
  if (!total || total === 0) return '0.0'
  return ((qty / total) * 100).toFixed(1)
}

const getBarColor = (idx: number) => {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#9c27b0', '#00bcd4', '#ff9800', '#795548']
  return colors[idx % colors.length]
}

// 弹窗与表单状态
const drawerVisible = ref(false)
const currentRow = ref<any>(null)
const submitLoading = ref(false)
const auditForm = reactive({
  result: 'pass',
  approvedQty: 0,
  approvedDeliveryDate: '',
  remark: ''
})

// 业务严谨判定：组合物料绝不会只有一个子件且单套配比还是1:1
// 真正的组合物料必须满足：
// 1. 多子件套件组合：拥有 >= 2 个不同的物理子物料（如皮套外壳 + 蓝牙键盘芯 + 充电线）；
// 2. 单品多包组合：同一子物料打包多件销售（单套配比 bomRatio > 1，如1包2件、1包4件）；
// 只有1个子件且配比为1:1的，在业务与库存管理上纯属于单品物料，不作为组合物料展示与拆解。
const isTrueCombo = (row: any) => {
  if (!row || !row.isCombo || !row.childMaterials || row.childMaterials.length === 0) return false
  if (row.childMaterials.length > 1) return true
  return (row.childMaterials[0]?.bomRatio || 1) > 1
}

// 单品物料关联组合套件的辅助计算
const getLinkedCombosList = (row: any) => {
  if (!row) return []
  if (row.linkedParentCombos && Array.isArray(row.linkedParentCombos)) {
    return row.linkedParentCombos
  }
  if (row.linkedParentCombo) {
    return [row.linkedParentCombo]
  }
  return []
}

const getSingleItemLinkedCombosTotalReserved = (row: any) => {
  const list = getLinkedCombosList(row)
  return list.reduce((sum: number, item: any) => sum + (item.reservedQty || 0), 0)
}

const getSingleItemNetRemaining = (row: any) => {
  if (!row) return 0
  const totalPhysical = (row.domesticStock || 0) + (row.azOverseasStock || 0) + (row.unfinishedPurchaseQty || 0)
  const reserved = getSingleItemLinkedCombosTotalReserved(row)
  return totalPhysical - reserved
}

// 原始数据列表（包含基于真实文档的家具组合产品与即是单品又属组合产品的跨部门穿透防重扣数据）
const rawTableList = ref([
  // ===== 【基于文档真实构建】家具组合销售与单品物料数据 =====
  {
    id: 'F01',
    orderNo: 'AP-20260218-001',
    orderType: '日常备货',
    deptAuditTime: '2026-02-18 10:00:15',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team1',
    materialCode: 'CBG-212-205',
    category: '餐边柜',
    productName: '拱形门边柜2+拱形玻璃门边柜1',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 0,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 0,
    salesArray: '18,35,80',
    dailyAvgSales: 2.67,
    applyPurchaseQty: 100, // 申请100套
    turnoverDays: 37,
    expectDeliveryDate: '2026-03-25',
    status: '待审批',
    isCombo: true,
    hasCrossDeptConflict: true,
    childMaterials: [
      {
        childCode: 'IF260212',
        childName: '拱形门边柜(原木色)',
        bomRatio: 2, // 1套需要2件
        isIndependentSale: true,
        independentSku: 'IF260212',
        domesticStock: 450,
        overseasStock: 800,
        totalInTransit: 200,
        totalReserved: 580, // 被单品备货AP-20260218-002占用500件，被食品储藏柜AP-20260218-003占用80件
        reservedBreakdown: [
          { dept: '事业二部-Team3', orderType: '单品日常备货(IF260212)', qty: 500, orderNo: 'AP-20260218-002' },
          { dept: '事业二部-Team2', orderType: '组合备货(SPG-206-212)', qty: 80, orderNo: 'AP-20260218-003' }
        ]
      },
      {
        childCode: 'IF260205',
        childName: '拱形玻璃门边柜(原木色)',
        bomRatio: 1, // 1套需要1件
        isIndependentSale: true,
        independentSku: 'IF260205',
        domesticStock: 320,
        overseasStock: 500,
        totalInTransit: 150,
        totalReserved: 360, // 被单品备货AP-20260218-004占用200件，被电视柜AP-20260218-005占用160件
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '单品日常备货(IF260205)', qty: 200, orderNo: 'AP-20260218-004' },
          { dept: '事业三部-Team1', orderType: '组合电视柜(DSG-213-205-214)', qty: 160, orderNo: 'AP-20260218-005' }
        ]
      }
    ]
  },
  {
    id: 'F02',
    orderNo: 'AP-20260218-002',
    orderType: '日常备货',
    deptAuditTime: '2026-02-18 10:15:00',
    lastOrderTime: '',
    dept: '事业二部',
    team: 'Team3',
    materialCode: 'IF260212',
    category: '客餐厅单品',
    productName: '拱形门边柜(原木色)',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 450,
    unfinishedPurchaseQty: 200,
    auditingQty: 0,
    azOverseasStock: 800,
    salesArray: '45,98,210',
    dailyAvgSales: 7.0,
    applyPurchaseQty: 500, // 单品备货申请500件（首单规划1800件）
    turnoverDays: 207,
    expectDeliveryDate: '2026-03-30',
    status: '待审批',
    isCombo: false, // 既是单品！
    hasCrossDeptConflict: true, // 又属于多个组合套件子部件！
    linkedParentCombos: [
      {
        parentCode: 'CBG-212-205',
        parentName: '餐边柜【拱形门边柜2+拱形玻璃门边柜1】',
        orderNo: 'AP-20260218-001',
        dept: '事业一部-Team1',
        comboOrderQty: 100,
        bomRatio: 2,
        reservedQty: 200 // 组合单申请100套，单套用量2件，锁定占用200件
      },
      {
        parentCode: 'SPG-206-212',
        parentName: '食品储藏柜【拱形门上柜1+拱形门边柜1】',
        orderNo: 'AP-20260218-003',
        dept: '事业二部-Team2',
        comboOrderQty: 80,
        bomRatio: 1,
        reservedQty: 80 // 组合单申请80套，单套用量1件，锁定占用80件
      }
    ],
    childMaterials: []
  },
  {
    id: 'F03',
    orderNo: 'AP-20260218-003',
    orderType: '项目备货',
    deptAuditTime: '2026-02-18 10:20:30',
    lastOrderTime: '',
    dept: '事业二部',
    team: 'Team2',
    materialCode: 'SPG-206-212',
    category: '食品储藏柜',
    productName: '拱形门上柜1+拱形门边柜1',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 0,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 0,
    salesArray: '12,25,60',
    dailyAvgSales: 2.0,
    applyPurchaseQty: 80, // 申请80套
    turnoverDays: 40,
    expectDeliveryDate: '2026-04-05',
    status: '待审批',
    isCombo: true,
    hasCrossDeptConflict: true,
    childMaterials: [
      {
        childCode: 'IF260206',
        childName: '拱形门上柜(原木色)',
        bomRatio: 1,
        isIndependentSale: true,
        independentSku: 'IF260206',
        domesticStock: 100,
        overseasStock: 150,
        totalInTransit: 50,
        totalReserved: 0,
        reservedBreakdown: []
      },
      {
        childCode: 'IF260212',
        childName: '拱形门边柜(原木色)',
        bomRatio: 1,
        isIndependentSale: true,
        independentSku: 'IF260212',
        domesticStock: 450,
        overseasStock: 800,
        totalInTransit: 200,
        totalReserved: 700, // 被餐边柜锁定200件，被单品备货锁定500件
        reservedBreakdown: [
          { dept: '事业一部-Team1', orderType: '组合备货(CBG-212-205)', qty: 200, orderNo: 'AP-20260218-001' },
          { dept: '事业二部-Team3', orderType: '单品备货(IF260212)', qty: 500, orderNo: 'AP-20260218-002' }
        ]
      }
    ]
  },
  {
    id: 'F04',
    orderNo: 'AP-20260218-004',
    orderType: '日常备货',
    deptAuditTime: '2026-02-18 10:30:00',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team2',
    materialCode: 'IF260205',
    category: '客餐厅单品',
    productName: '拱形玻璃门边柜(原木色)',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 320,
    unfinishedPurchaseQty: 150,
    auditingQty: 0,
    azOverseasStock: 500,
    salesArray: '30,68,155',
    dailyAvgSales: 5.17,
    applyPurchaseQty: 200, // 申请200件（首单规划1300件）
    turnoverDays: 187,
    expectDeliveryDate: '2026-03-28',
    status: '待审批',
    isCombo: false, // 独立单品
    hasCrossDeptConflict: true, // 同时被餐边柜与组合电视柜引用
    linkedParentCombos: [
      {
        parentCode: 'CBG-212-205',
        parentName: '餐边柜【拱形门边柜2+拱形玻璃门边柜1】',
        orderNo: 'AP-20260218-001',
        dept: '事业一部-Team1',
        comboOrderQty: 100,
        bomRatio: 1,
        reservedQty: 100
      },
      {
        parentCode: 'DSG-213-205-214',
        parentName: '组合电视柜【上柜2+玻璃门2+单抽2】',
        orderNo: 'AP-20260218-005',
        dept: '事业三部-Team1',
        comboOrderQty: 80,
        bomRatio: 2,
        reservedQty: 160
      }
    ],
    childMaterials: []
  },
  {
    id: 'F05',
    orderNo: 'AP-20260218-005',
    orderType: '紧急备货',
    deptAuditTime: '2026-02-18 10:45:00',
    lastOrderTime: '',
    dept: '事业三部',
    team: 'Team1',
    materialCode: 'DSG-213-205-214',
    category: '组合电视柜',
    productName: '拱形玻璃门上柜2+拱形玻璃门边柜2+Aura单抽边柜2',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 0,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 0,
    salesArray: '10,22,50',
    dailyAvgSales: 1.67,
    applyPurchaseQty: 80, // 申请80套豪华组合电视柜
    turnoverDays: 48,
    expectDeliveryDate: '2026-04-10',
    status: '待审批',
    isCombo: true,
    hasCrossDeptConflict: true,
    childMaterials: [
      {
        childCode: 'IF260213',
        childName: '拱形玻璃门上柜(原木色)',
        bomRatio: 2, // 1套需要2件
        isIndependentSale: true,
        independentSku: 'IF260213',
        domesticStock: 120,
        overseasStock: 80,
        totalInTransit: 50,
        totalReserved: 50,
        reservedBreakdown: [
          { dept: '事业三部-Team2', orderType: '书柜组合(SG-213-205)', qty: 50, orderNo: 'AP-20260218-010' }
        ]
      },
      {
        childCode: 'IF260205',
        childName: '拱形玻璃门边柜(原木色)',
        bomRatio: 2, // 1套需要2件
        isIndependentSale: true,
        independentSku: 'IF260205',
        domesticStock: 320,
        overseasStock: 500,
        totalInTransit: 150,
        totalReserved: 300,
        reservedBreakdown: [
          { dept: '事业一部-Team1', orderType: '餐边柜(CBG-212-205)', qty: 100, orderNo: 'AP-20260218-001' },
          { dept: '事业一部-Team2', orderType: '单品备货(IF260205)', qty: 200, orderNo: 'AP-20260218-004' }
        ]
      },
      {
        childCode: 'IF260214',
        childName: '拱形门单抽边柜(原木色)',
        bomRatio: 2, // 1套需要2件
        isIndependentSale: true,
        independentSku: 'IF260214',
        domesticStock: 80,
        overseasStock: 120,
        totalInTransit: 66,
        totalReserved: 220,
        reservedBreakdown: [
          { dept: '事业一部-Team1', orderType: '单品备货(IF260214)', qty: 100, orderNo: 'AP-20260218-009' },
          { dept: '事业一部-Team2', orderType: '餐边柜(CBG-214-212)', qty: 120, orderNo: 'AP-20260218-007' }
        ]
      }
    ]
  },
  {
    id: 'F06',
    orderNo: 'AP-20260218-006',
    orderType: '日常备货',
    deptAuditTime: '2026-02-18 11:00:00',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team1',
    materialCode: 'CBG-212-X2',
    category: '餐边柜',
    productName: '拱形门边柜*2(双拼组合多包)',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 0,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 0,
    salesArray: '15,32,70',
    dailyAvgSales: 2.33,
    applyPurchaseQty: 50, // 申请50套
    turnoverDays: 21,
    expectDeliveryDate: '2026-03-20',
    status: '待审批',
    isCombo: true, // 单品多包组合！配比为2
    hasCrossDeptConflict: true,
    childMaterials: [
      {
        childCode: 'IF260212',
        childName: '拱形门边柜(原木色)',
        bomRatio: 2, // 单品多包，配比为2，不违背单套配比1:1规则
        isIndependentSale: true,
        independentSku: 'IF260212',
        domesticStock: 450,
        overseasStock: 800,
        totalInTransit: 200,
        totalReserved: 780,
        reservedBreakdown: [
          { dept: '事业一部-Team1', orderType: '餐边柜(CBG-212-205)', qty: 200, orderNo: 'AP-20260218-001' },
          { dept: '事业二部-Team3', orderType: '单品备货(IF260212)', qty: 500, orderNo: 'AP-20260218-002' },
          { dept: '事业二部-Team2', orderType: '食品储藏柜(SPG-206-212)', qty: 80, orderNo: 'AP-20260218-003' }
        ]
      }
    ]
  },
  {
    id: 'F07',
    orderNo: 'AP-20260218-007',
    orderType: '日常备货',
    deptAuditTime: '2026-02-18 11:15:00',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team2',
    materialCode: 'CBG-214-212',
    category: '餐边柜',
    productName: '拱形门单抽边柜2+拱形门边柜1',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 0,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 0,
    salesArray: '11,26,58',
    dailyAvgSales: 1.93,
    applyPurchaseQty: 60,
    turnoverDays: 31,
    expectDeliveryDate: '2026-03-25',
    status: '待审批',
    isCombo: true,
    hasCrossDeptConflict: true,
    childMaterials: [
      {
        childCode: 'IF260214',
        childName: '拱形门单抽边柜(原木色)',
        bomRatio: 2,
        isIndependentSale: true,
        independentSku: 'IF260214',
        domesticStock: 80,
        overseasStock: 120,
        totalInTransit: 66,
        totalReserved: 260,
        reservedBreakdown: [
          { dept: '事业一部-Team1', orderType: '单品备货(IF260214)', qty: 100, orderNo: 'AP-20260218-009' },
          { dept: '事业三部-Team1', orderType: '组合电视柜(DSG-213-205-214)', qty: 160, orderNo: 'AP-20260218-005' }
        ]
      },
      {
        childCode: 'IF260212',
        childName: '拱形门边柜(原木色)',
        bomRatio: 1,
        isIndependentSale: true,
        independentSku: 'IF260212',
        domesticStock: 450,
        overseasStock: 800,
        totalInTransit: 200,
        totalReserved: 880,
        reservedBreakdown: [
          { dept: '事业一部-Team1', orderType: '餐边柜(CBG-212-205)', qty: 200, orderNo: 'AP-20260218-001' },
          { dept: '事业二部-Team3', orderType: '单品备货(IF260212)', qty: 500, orderNo: 'AP-20260218-002' },
          { dept: '事业二部-Team2', orderType: '食品储藏柜(SPG-206-212)', qty: 80, orderNo: 'AP-20260218-003' },
          { dept: '事业一部-Team1', orderType: '多包餐边柜(CBG-212-X2)', qty: 100, orderNo: 'AP-20260218-006' }
        ]
      }
    ]
  },
  {
    id: 'F08',
    orderNo: 'AP-20260218-009',
    orderType: '日常备货',
    deptAuditTime: '2026-02-18 11:30:00',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team1',
    materialCode: 'IF260214',
    category: '客餐厅单品',
    productName: '拱形门单抽边柜(原木色)',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 80,
    unfinishedPurchaseQty: 66,
    auditingQty: 0,
    azOverseasStock: 120,
    salesArray: '16,35,75',
    dailyAvgSales: 2.5,
    applyPurchaseQty: 100, // 申请100件（首单规划350件）
    turnoverDays: 172,
    expectDeliveryDate: '2026-03-22',
    status: '待审批',
    isCombo: false, // 独立单品
    hasCrossDeptConflict: true, // 被组合电视柜和餐边柜引用
    linkedParentCombos: [
      {
        parentCode: 'DSG-213-205-214',
        parentName: '组合电视柜【上柜2+玻璃门2+单抽2】',
        orderNo: 'AP-20260218-005',
        dept: '事业三部-Team1',
        comboOrderQty: 80,
        bomRatio: 2,
        reservedQty: 160
      },
      {
        parentCode: 'CBG-214-212',
        parentName: '餐边柜【单抽2+门边柜1】',
        orderNo: 'AP-20260218-007',
        dept: '事业一部-Team2',
        comboOrderQty: 60,
        bomRatio: 2,
        reservedQty: 120
      }
    ],
    childMaterials: []
  },
  {
    id: 'F09',
    orderNo: 'AP-20260218-008',
    orderType: '日常备货',
    deptAuditTime: '2026-02-18 11:45:00',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team3',
    materialCode: 'CBG-216-X2',
    category: '餐边柜',
    productName: '拱形门边柜*2(黑色)',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 0,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 0,
    salesArray: '8,18,42',
    dailyAvgSales: 1.4,
    applyPurchaseQty: 40, // 申请40套
    turnoverDays: 28,
    expectDeliveryDate: '2026-04-01',
    status: '待审批',
    isCombo: true,
    hasCrossDeptConflict: false,
    childMaterials: [
      {
        childCode: 'IF260216',
        childName: '拱形门边柜(黑色+原木色)',
        bomRatio: 2,
        isIndependentSale: true,
        independentSku: 'IF260216',
        domesticStock: 220,
        overseasStock: 400,
        totalInTransit: 130,
        totalReserved: 0,
        reservedBreakdown: []
      }
    ]
  },
  {
    id: 'F10',
    orderNo: 'AP-20260218-010',
    orderType: '日常备货',
    deptAuditTime: '2026-02-18 12:00:00',
    lastOrderTime: '',
    dept: '事业三部',
    team: 'Team2',
    materialCode: 'SG-213-205',
    category: '书柜',
    productName: '拱形玻璃门上柜1+拱形玻璃门边柜1',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 0,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 0,
    salesArray: '9,20,48',
    dailyAvgSales: 1.6,
    applyPurchaseQty: 50,
    turnoverDays: 31,
    expectDeliveryDate: '2026-03-30',
    status: '待审批',
    isCombo: true,
    hasCrossDeptConflict: true,
    childMaterials: [
      {
        childCode: 'IF260213',
        childName: '拱形玻璃门上柜(原木色)',
        bomRatio: 1,
        isIndependentSale: true,
        independentSku: 'IF260213',
        domesticStock: 120,
        overseasStock: 80,
        totalInTransit: 50,
        totalReserved: 160,
        reservedBreakdown: [
          { dept: '事业三部-Team1', orderType: '组合电视柜(DSG-213-205-214)', qty: 160, orderNo: 'AP-20260218-005' }
        ]
      },
      {
        childCode: 'IF260205',
        childName: '拱形玻璃门边柜(原木色)',
        bomRatio: 1,
        isIndependentSale: true,
        independentSku: 'IF260205',
        domesticStock: 320,
        overseasStock: 500,
        totalInTransit: 150,
        totalReserved: 460,
        reservedBreakdown: [
          { dept: '事业一部-Team1', orderType: '餐边柜(CBG-212-205)', qty: 100, orderNo: 'AP-20260218-001' },
          { dept: '事业一部-Team2', orderType: '单品备货(IF260205)', qty: 200, orderNo: 'AP-20260218-004' },
          { dept: '事业三部-Team1', orderType: '组合电视柜(DSG-213-205-214)', qty: 160, orderNo: 'AP-20260218-005' }
        ]
      }
    ]
  },
  // ===== 保留数码配件备货示例 =====
  {
    id: '1',
    orderNo: 'AP-20250911-001',
    orderType: '项目备货',
    deptAuditTime: '2025-09-11 11:30:22',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team1',
    materialCode: 'ATC220203',
    category: '平板电脑保..',
    productName: '平板皮套',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 0,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 0,
    salesArray: '0,0,0',
    dailyAvgSales: 0,
    applyPurchaseQty: 1,
    turnoverDays: 0,
    expectDeliveryDate: '2026-10-31',
    status: '待审批',
    isCombo: true,
    hasCrossDeptConflict: false,
    childMaterials: [
      {
        childCode: 'ATC220203-A',
        childName: '平板皮套-超纤外皮保护面料',
        bomRatio: 1,
        isIndependentSale: true,
        independentSku: 'SKU-LEATHER-01',
        domesticStock: 20,
        overseasStock: 10,
        totalInTransit: 0,
        totalReserved: 0,
        reservedBreakdown: []
      },
      {
        childCode: 'ATC220203-B',
        childName: '平板皮套-高弹内衬硅胶底壳',
        bomRatio: 1,
        isIndependentSale: false,
        independentSku: '',
        domesticStock: 15,
        overseasStock: 5,
        totalInTransit: 0,
        totalReserved: 0,
        reservedBreakdown: []
      },
      {
        childCode: 'ATC220203-GLASS',
        childName: '配套9H防爆弧边高清钢化保护膜',
        bomRatio: 1,
        isIndependentSale: true,
        independentSku: 'SKU-GLASS-01',
        domesticStock: 100,
        overseasStock: 200,
        totalInTransit: 50,
        totalReserved: 0,
        reservedBreakdown: []
      }
    ]
  },
  {
    id: '2',
    orderNo: 'AP-20251224-002',
    orderType: '日常备货',
    deptAuditTime: '2025-12-24 14:15:30',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team1',
    materialCode: 'ATC210135',
    category: '平板电脑保..',
    productName: '笔套',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 0,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 478,
    salesArray: '25,50,109',
    dailyAvgSales: 3.83,
    applyPurchaseQty: 1000,
    turnoverDays: 355,
    expectDeliveryDate: '2025-12-25',
    status: '待审批',
    isCombo: false,
    hasCrossDeptConflict: false,
    childMaterials: []
  },
  {
    id: '3',
    orderNo: 'AP-20251224-003',
    orderType: '日常备货',
    deptAuditTime: '2025-12-24 14:18:05',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team1',
    materialCode: 'ATC210136',
    category: '平板电脑保..',
    productName: '笔套',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 0,
    unfinishedPurchaseQty: 500,
    auditingQty: 0,
    azOverseasStock: 257,
    salesArray: '14,30,66',
    dailyAvgSales: 2.41,
    applyPurchaseQty: 300,
    turnoverDays: 438,
    expectDeliveryDate: '2025-12-27',
    status: '待审批',
    isCombo: false,
    hasCrossDeptConflict: false,
    childMaterials: []
  },
  {
    id: '4',
    orderNo: 'AP-20260115-004',
    orderType: '项目备货',
    deptAuditTime: '2026-01-15 10:20:11',
    lastOrderTime: '',
    dept: '实验测试部',
    team: '实验测试组',
    materialCode: 'AKC220009',
    category: '平板键盘',
    productName: '蓝牙键盘',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 0,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 0,
    salesArray: '0,0,0',
    dailyAvgSales: 0,
    applyPurchaseQty: 50,
    turnoverDays: 0,
    expectDeliveryDate: '2026-01-31',
    status: '待审批',
    isCombo: true,
    hasCrossDeptConflict: true,
    childMaterials: [
      {
        childCode: 'AKC220009-KEY',
        childName: '剪刀脚蓝牙主控芯片按键模组',
        bomRatio: 1,
        isIndependentSale: true,
        independentSku: 'FBM-KB-CHIP01',
        domesticStock: 80,
        overseasStock: 0,
        totalInTransit: 50,
        totalReserved: 60,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '紧急备货', qty: 60, orderNo: 'AP-20260115-005' }
        ]
      },
      {
        childCode: 'AKC220009-SHELL',
        childName: '铝合金一体冲压外壳',
        bomRatio: 1,
        isIndependentSale: false,
        independentSku: '',
        domesticStock: 60,
        overseasStock: 0,
        totalInTransit: 20,
        totalReserved: 40,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '紧急备货', qty: 40, orderNo: 'AP-20260115-005' }
        ]
      },
      {
        childCode: 'AKC220009-BAT',
        childName: '超薄聚合物锂电池(500mAh)',
        bomRatio: 1,
        isIndependentSale: false,
        independentSku: '',
        domesticStock: 120,
        overseasStock: 0,
        totalInTransit: 50,
        totalReserved: 60,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '紧急备货', qty: 60, orderNo: 'AP-20260115-005' }
        ]
      }
    ]
  },
  {
    id: '5',
    orderNo: 'AP-20260115-005',
    orderType: '紧急备货',
    deptAuditTime: '2026-01-15 10:25:40',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team2',
    materialCode: 'AKC220009',
    category: '平板键盘',
    productName: '蓝牙键盘',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 0,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 0,
    salesArray: '0,0,0',
    dailyAvgSales: 0,
    applyPurchaseQty: 60,
    turnoverDays: 0,
    expectDeliveryDate: '2026-01-31',
    status: '待审批',
    isCombo: true,
    hasCrossDeptConflict: true,
    childMaterials: [
      {
        childCode: 'AKC220009-KEY',
        childName: '剪刀脚蓝牙主控芯片按键模组',
        bomRatio: 1,
        isIndependentSale: true,
        independentSku: 'FBM-KB-CHIP01',
        domesticStock: 80,
        overseasStock: 0,
        totalInTransit: 50,
        totalReserved: 0,
        reservedBreakdown: []
      },
      {
        childCode: 'AKC220009-SHELL',
        childName: '铝合金一体冲压外壳',
        bomRatio: 1,
        isIndependentSale: false,
        independentSku: '',
        domesticStock: 60,
        overseasStock: 0,
        totalInTransit: 20,
        totalReserved: 0,
        reservedBreakdown: []
      },
      {
        childCode: 'AKC220009-BAT',
        childName: '超薄聚合物锂电池(500mAh)',
        bomRatio: 1,
        isIndependentSale: false,
        independentSku: '',
        domesticStock: 120,
        overseasStock: 0,
        totalInTransit: 50,
        totalReserved: 0,
        reservedBreakdown: []
      }
    ]
  },
  {
    id: '6',
    orderNo: 'AP-20260115-006',
    orderType: '紧急备货',
    deptAuditTime: '2026-01-15 11:02:18',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team2',
    materialCode: 'ATC220389',
    category: '平板电脑保..',
    productName: '平板皮套',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 20,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 10,
    salesArray: '15,24,43',
    dailyAvgSales: 2.06,
    applyPurchaseQty: 5,
    turnoverDays: 66,
    expectDeliveryDate: '2026-01-20',
    status: '待审批',
    isCombo: true,
    hasCrossDeptConflict: true,
    childMaterials: [
      {
        childCode: 'ATC220389-COVER',
        childName: '商务多折叠PU外皮保护套',
        bomRatio: 1,
        isIndependentSale: false,
        independentSku: '',
        domesticStock: 50,
        overseasStock: 20,
        totalInTransit: 10,
        totalReserved: 20,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '紧急备货', qty: 20, orderNo: 'AP-20260126-010' }
        ]
      },
      {
        childCode: 'ATC220389-BASE',
        childName: '全包防摔透明亚克力背壳',
        bomRatio: 1,
        isIndependentSale: false,
        independentSku: '',
        domesticStock: 40,
        overseasStock: 15,
        totalInTransit: 10,
        totalReserved: 20,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '紧急备货', qty: 20, orderNo: 'AP-20260126-010' }
        ]
      },
      {
        childCode: 'RAW-LEATHER-02',
        childName: '环保PU合成革面料(单套需2张)',
        bomRatio: 2,
        isIndependentSale: true,
        independentSku: 'FABRIC-PU-02',
        domesticStock: 50,
        overseasStock: 10,
        totalInTransit: 20,
        totalReserved: 40,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '日常备货', qty: 40, orderNo: 'AP-20260126-010' }
        ]
      }
    ]
  },
  {
    id: '7',
    orderNo: 'AP-20260115-007',
    orderType: '日常备货',
    deptAuditTime: '2026-01-15 11:15:30',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team2',
    materialCode: 'AKC220009',
    category: '平板键盘',
    productName: '蓝牙键盘',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 0,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 98,
    salesArray: '3,13,30',
    dailyAvgSales: 1.4,
    applyPurchaseQty: 40,
    turnoverDays: 137,
    expectDeliveryDate: '2025-12-24',
    status: '待审批',
    isCombo: true,
    hasCrossDeptConflict: true,
    childMaterials: [
      {
        childCode: 'AKC220009-KEY',
        childName: '剪刀脚蓝牙主控芯片按键模组',
        bomRatio: 1,
        isIndependentSale: true,
        independentSku: 'FBM-KB-CHIP01',
        domesticStock: 80,
        overseasStock: 0,
        totalInTransit: 50,
        totalReserved: 110,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '紧急备货', qty: 60, orderNo: 'AP-20260115-005' },
          { dept: '实验测试部', orderType: '项目备货', qty: 50, orderNo: 'AP-20260115-004' }
        ]
      },
      {
        childCode: 'AKC220009-SHELL',
        childName: '铝合金一体冲压外壳',
        bomRatio: 1,
        isIndependentSale: false,
        independentSku: '',
        domesticStock: 60,
        overseasStock: 0,
        totalInTransit: 20,
        totalReserved: 70,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '紧急备货', qty: 40, orderNo: 'AP-20260115-005' },
          { dept: '实验测试部', orderType: '项目备货', qty: 30, orderNo: 'AP-20260115-004' }
        ]
      },
      {
        childCode: 'AKC220009-BAT',
        childName: '超薄聚合物锂电池(500mAh)',
        bomRatio: 1,
        isIndependentSale: false,
        independentSku: '',
        domesticStock: 120,
        overseasStock: 0,
        totalInTransit: 50,
        totalReserved: 110,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '紧急备货', qty: 60, orderNo: 'AP-20260115-005' },
          { dept: '实验测试部', orderType: '项目备货', qty: 50, orderNo: 'AP-20260115-004' }
        ]
      }
    ]
  },
  {
    id: '8',
    orderNo: 'AP-20260126-008',
    orderType: '日常备货',
    deptAuditTime: '2026-01-26 16:20:00',
    lastOrderTime: '',
    dept: '事业四部',
    team: 'Team8',
    materialCode: 'P02YJ001',
    category: '家居装饰',
    productName: '风灯',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 144,
    unfinishedPurchaseQty: 6,
    auditingQty: 0,
    azOverseasStock: 258,
    salesArray: '8,19,50',
    dailyAvgSales: 1.51,
    applyPurchaseQty: 30,
    turnoverDays: 110,
    expectDeliveryDate: '2026-01-23',
    status: '待审批',
    isCombo: false,
    hasCrossDeptConflict: false,
    childMaterials: []
  },
  {
    id: '9',
    orderNo: 'AP-20260126-009',
    orderType: '紧急备货',
    deptAuditTime: '2026-01-26 16:35:10',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team2',
    materialCode: 'ATC220389',
    category: '平板电脑保..',
    productName: '平板皮套',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 20,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 10,
    salesArray: '15,24,43',
    dailyAvgSales: 2.06,
    applyPurchaseQty: 5,
    turnoverDays: 40,
    expectDeliveryDate: '2026-01-29',
    status: '待审批',
    isCombo: true,
    hasCrossDeptConflict: true,
    childMaterials: [
      {
        childCode: 'ATC220389-COVER',
        childName: '商务多折叠PU外皮保护套',
        bomRatio: 1,
        isIndependentSale: false,
        independentSku: '',
        domesticStock: 50,
        overseasStock: 20,
        totalInTransit: 10,
        totalReserved: 20,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '紧急备货', qty: 20, orderNo: 'AP-20260126-010' }
        ]
      },
      {
        childCode: 'ATC220389-BASE',
        childName: '全包防摔透明亚克力背壳',
        bomRatio: 1,
        isIndependentSale: false,
        independentSku: '',
        domesticStock: 40,
        overseasStock: 15,
        totalInTransit: 10,
        totalReserved: 20,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '紧急备货', qty: 20, orderNo: 'AP-20260126-010' }
        ]
      },
      {
        childCode: 'RAW-LEATHER-02',
        childName: '环保PU合成革面料(单套需2张)',
        bomRatio: 2,
        isIndependentSale: true,
        independentSku: 'FABRIC-PU-02',
        domesticStock: 50,
        overseasStock: 10,
        totalInTransit: 20,
        totalReserved: 40,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '日常备货', qty: 40, orderNo: 'AP-20260126-010' }
        ]
      }
    ]
  },
  {
    id: '10',
    orderNo: 'AP-20260126-010',
    orderType: '紧急备货',
    deptAuditTime: '2026-01-26 16:40:50',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team2',
    materialCode: 'ATC220389',
    category: '平板电脑保..',
    productName: '平板皮套',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 20,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 10,
    salesArray: '15,24,43',
    dailyAvgSales: 2.06,
    applyPurchaseQty: 20,
    turnoverDays: 55,
    expectDeliveryDate: '2026-01-29',
    status: '待审批',
    isCombo: true,
    hasCrossDeptConflict: true,
    childMaterials: [
      {
        childCode: 'ATC220389-COVER',
        childName: '商务多折叠PU外皮保护套',
        bomRatio: 1,
        isIndependentSale: false,
        independentSku: '',
        domesticStock: 50,
        overseasStock: 20,
        totalInTransit: 10,
        totalReserved: 5,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '紧急备货', qty: 5, orderNo: 'AP-20260115-006' }
        ]
      },
      {
        childCode: 'ATC220389-BASE',
        childName: '全包防摔透明亚克力背壳',
        bomRatio: 1,
        isIndependentSale: false,
        independentSku: '',
        domesticStock: 40,
        overseasStock: 15,
        totalInTransit: 10,
        totalReserved: 5,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '紧急备货', qty: 5, orderNo: 'AP-20260115-006' }
        ]
      },
      {
        childCode: 'RAW-LEATHER-02',
        childName: '环保PU合成革面料(单套需2张)',
        bomRatio: 2,
        isIndependentSale: true,
        independentSku: 'FABRIC-PU-02',
        domesticStock: 50,
        overseasStock: 10,
        totalInTransit: 20,
        totalReserved: 10,
        reservedBreakdown: [
          { dept: '事业一部-Team2', orderType: '紧急备货', qty: 10, orderNo: 'AP-20260115-006' }
        ]
      }
    ]
  },
  {
    id: '11',
    orderNo: 'AP-20260605-011',
    orderType: '日常备货',
    deptAuditTime: '2026-06-05 20:00:15',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team2',
    materialCode: 'AKC220000',
    category: '平板键盘',
    productName: '键盘皮套',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 226,
    unfinishedPurchaseQty: 0,
    auditingQty: 0,
    azOverseasStock: 743,
    salesArray: '14,29,78',
    dailyAvgSales: 2.43,
    applyPurchaseQty: 124,
    turnoverDays: 383,
    expectDeliveryDate: '2025-07-18',
    status: '待审批',
    isCombo: true,
    hasCrossDeptConflict: true,
    childMaterials: [
      {
        childCode: 'AKC220000-CASE',
        childName: '键盘保护套-PU磁吸折叠外壳',
        bomRatio: 1,
        isIndependentSale: false,
        independentSku: '',
        domesticStock: 300,
        overseasStock: 700,
        totalInTransit: 0,
        totalReserved: 0,
        reservedBreakdown: []
      },
      {
        childCode: 'AKC220000-KB',
        childName: '超薄多指触控蓝牙键盘模组',
        bomRatio: 1,
        isIndependentSale: true,
        independentSku: 'SKU-KB-CORE02',
        domesticStock: 350,
        overseasStock: 680,
        totalInTransit: 100,
        totalReserved: 100,
        reservedBreakdown: [
          { dept: '事业一部-Team1', orderType: '单品日常备货', qty: 100, orderNo: 'AP-20260605-012' }
        ]
      },
      {
        childCode: 'ACC-TYPEC-01',
        childName: '标准Type-C编织快速充电源线',
        bomRatio: 1,
        isIndependentSale: true,
        independentSku: 'ACC-CABLE-01',
        domesticStock: 800,
        overseasStock: 1200,
        totalInTransit: 200,
        totalReserved: 0,
        reservedBreakdown: []
      }
    ]
  },
  {
    id: '12',
    orderNo: 'AP-20260605-012',
    orderType: '日常备货',
    deptAuditTime: '2026-06-05 20:10:00',
    lastOrderTime: '',
    dept: '事业一部',
    team: 'Team1',
    materialCode: 'AKC220000-KB',
    category: '数码配件',
    productName: '超薄多指触控蓝牙键盘模组',
    holidayTag: '无',
    seasonTag: '无',
    domesticStock: 350,
    unfinishedPurchaseQty: 100,
    auditingQty: 0,
    azOverseasStock: 680,
    salesArray: '30,65,140',
    dailyAvgSales: 4.67,
    applyPurchaseQty: 100,
    turnoverDays: 242,
    expectDeliveryDate: '2025-07-25',
    status: '待审批',
    isCombo: false, // 独立单品！
    hasCrossDeptConflict: true, // 属于组合套件的子件，跨套件共享排重
    linkedParentCombo: {
      parentCode: 'AKC220000',
      parentName: '键盘皮套',
      orderNo: 'AP-20260605-011',
      comboOrderQty: 124,
      bomRatio: 1,
      reservedQty: 124 // 组合套件申请了124套，预占了124件
    },
    childMaterials: []
  }
])

// 共享子物料全局全景汇总看板数据
const sharedMaterialSummaryList = computed(() => {
  return [
    {
      childCode: 'IF260212',
      childName: '拱形门边柜(原木色)',
      isIndependentSale: true,
      totalPhysicalStock: 1250, // 国内450 + 海外800
      totalTransitStock: 200,   // 在途200
      totalReserved: 880,       // 累计总锁定占用
      relatedOrders: [
        { dept: '事业一部', team: 'Team1', orderType: '餐边柜【门边柜2+玻璃门1】(CBG-212-205)', qty: 200, status: '已锁份额' },
        { dept: '事业二部', team: 'Team3', orderType: '独立单品日常备货(IF260212)', qty: 500, status: '单品锁定' },
        { dept: '事业二部', team: 'Team2', orderType: '食品储藏柜【上柜1+边柜1】(SPG-206-212)', qty: 80, status: '已锁份额' },
        { dept: '事业一部', team: 'Team1', orderType: '多包餐边柜【门边柜*2】(CBG-212-X2)', qty: 100, status: '已锁份额' }
      ]
    },
    {
      childCode: 'IF260205',
      childName: '拱形玻璃门边柜(原木色)',
      isIndependentSale: true,
      totalPhysicalStock: 820,  // 国内320 + 海外500
      totalTransitStock: 150,   // 在途150
      totalReserved: 510,       // 锁定占用
      relatedOrders: [
        { dept: '事业一部', team: 'Team1', orderType: '餐边柜【门边柜2+玻璃门1】(CBG-212-205)', qty: 100, status: '已锁份额' },
        { dept: '事业一部', team: 'Team2', orderType: '独立单品日常备货(IF260205)', qty: 200, status: '单品锁定' },
        { dept: '事业三部', team: 'Team1', orderType: '组合电视柜(DSG-213-205-214)', qty: 160, status: '已锁份额' },
        { dept: '事业三部', team: 'Team2', orderType: '书柜【上柜1+边柜1】(SG-213-205)', qty: 50, status: '已锁份额' }
      ]
    },
    {
      childCode: 'IF260214',
      childName: '拱形门单抽边柜(原木色)',
      isIndependentSale: true,
      totalPhysicalStock: 350,  // 国内150 + 海外200
      totalTransitStock: 80,    // 在途80
      totalReserved: 380,       // 锁定占用
      relatedOrders: [
        { dept: '事业三部', team: 'Team1', orderType: '组合电视柜(DSG-213-205-214)', qty: 160, status: '已锁份额' },
        { dept: '事业一部', team: 'Team2', orderType: '餐边柜【单抽2+门边柜1】(CBG-214-212)', qty: 120, status: '已锁份额' },
        { dept: '事业一部', team: 'Team1', orderType: '独立单品日常备货(IF260214)', qty: 100, status: '单品锁定' }
      ]
    },
    {
      childCode: 'IF260213',
      childName: '拱形玻璃门上柜(原木色)',
      isIndependentSale: true,
      totalPhysicalStock: 200,
      totalTransitStock: 50,
      totalReserved: 210,
      relatedOrders: [
        { dept: '事业三部', team: 'Team1', orderType: '组合电视柜(DSG-213-205-214)', qty: 160, status: '已锁份额' },
        { dept: '事业三部', team: 'Team2', orderType: '书柜【上柜1+边柜1】(SG-213-205)', qty: 50, status: '已锁份额' }
      ]
    },
    {
      childCode: 'AKC220000-KB',
      childName: '超薄多指触控蓝牙键盘模组(单品在售&套件子件)',
      isIndependentSale: true,
      totalPhysicalStock: 1030,
      totalTransitStock: 100,
      totalReserved: 224,
      relatedOrders: [
        { dept: '事业一部', team: 'Team2', orderType: '组合套装备货(AKC220000)', qty: 124, status: '套件锁定' },
        { dept: '事业一部', team: 'Team1', orderType: '独立单品日常备货(AKC220000-KB)', qty: 100, status: '单品锁定' }
      ]
    }
  ]
})

// 过滤后的表格数据
const filteredTableData = computed(() => {
  return rawTableList.value.filter(item => {
    if (queryParams.orderType && item.orderType !== queryParams.orderType) return false
    if (queryParams.dept && item.dept !== queryParams.dept) return false
    if (queryParams.team && item.team !== queryParams.team) return false
    if (queryParams.category && !item.category.includes(queryParams.category)) return false
    if (queryParams.materialCode && !item.materialCode.toLowerCase().includes(queryParams.materialCode.toLowerCase())) return false
    if (queryParams.productName && !item.productName.toLowerCase().includes(queryParams.productName.toLowerCase())) return false
    if (queryParams.holidayTag && item.holidayTag !== queryParams.holidayTag) return false
    if (queryParams.seasonTag && item.seasonTag !== queryParams.seasonTag) return false
    
    // 物料形态与共享竞争筛选
    if (queryParams.materialType === 'combo' && !item.isCombo) return false
    if (queryParams.materialType === 'single' && item.isCombo) return false
    if (queryParams.materialType === 'shared' && !item.hasCrossDeptConflict) return false

    // 日期范围过滤
    if (queryParams.dateRange && queryParams.dateRange.length === 2) {
      const [start, end] = queryParams.dateRange
      const targetTime = (item as any)[queryParams.timeType]
      if (targetTime) {
        const itemDate = targetTime.split(' ')[0]
        if (itemDate < start || itemDate > end) return false
      }
    }
    return true
  })
})

const totalCount = computed(() => filteredTableData.value.length)

// ===== 【供应链木桶瓶颈与短缺按比例配给核心引擎（严格遵循用户业务公式）】 =====

// 1. 全局计算所有子物料的物理可用库存、穿透总需求、分配比例、需备货量及各单据明细分布
const materialAllocationMap = computed(() => {
  const map: Record<string, {
    childCode: string
    childName: string
    isIndependentSale: boolean
    availableStock: number // 可用库存 = 国内在库 + 海外在库 + 在途
    totalDemand: number    // 父SKU穿透总需求 = SUM(所有组合SKU预估销量 * BOM用量) + 单品自身预估需求
    allocationRatio: number // 分配比例 = MIN(1, 可用库存 / 总需求)
    shortageQty: number    // 子SKU需备货量 = MAX(0, 总需求 - 可用库存)
    demandBreakdown: Array<{
      orderNo: string
      orderType: string
      isCombo: boolean
      itemTypeDesc: string
      parentCode: string
      parentName: string
      dept: string
      applyQty: number
      unit: string
      bomRatio: number
      demandQty: number
      allocatedQty: number
      ratioPercent: string
    }>
    relatedComboUsages: Array<{
      orderNo: string
      parentCode: string
      parentName: string
      dept: string
      comboOrderQty: number
      bomRatio: number
      demandQty: number
      allocatedQty: number
    }>
  }> = {}

  // 第一轮循环：初始化并累加汇总底层物理可用库存和穿透总需求
  rawTableList.value.forEach(row => {
    // A. 组合物料的所有子件穿透需求
    if (row.isCombo && row.childMaterials?.length) {
      row.childMaterials.forEach((child: any) => {
        const code = child.childCode
        if (!map[code]) {
          const avail = (child.domesticStock || 0) + (child.overseasStock || 0) + (child.totalInTransit || 0)
          map[code] = {
            childCode: code,
            childName: child.childName,
            isIndependentSale: !!child.isIndependentSale,
            availableStock: avail,
            totalDemand: 0,
            allocationRatio: 1,
            shortageQty: 0,
            demandBreakdown: [],
            relatedComboUsages: []
          }
        }
        const needed = (row.applyPurchaseQty || 0) * (child.bomRatio || 1)
        map[code].totalDemand += needed
      })
    } 
    // B. 单品独立物料自身的需求与库存
    else {
      const code = row.materialCode
      if (!map[code]) {
        const avail = (row.domesticStock || 0) + (row.azOverseasStock || 0) + (row.unfinishedPurchaseQty || 0)
        map[code] = {
          childCode: code,
          childName: row.productName,
          isIndependentSale: true,
          availableStock: avail,
          totalDemand: 0,
          allocationRatio: 1,
          shortageQty: 0,
          demandBreakdown: [],
          relatedComboUsages: []
        }
      }
      map[code].totalDemand += (row.applyPurchaseQty || 0)
    }
  })

  // 第二轮循环：按截图公式计算各子物料的【分配比例】与【子SKU需备货量】
  Object.keys(map).forEach(code => {
    const item = map[code]
    if (item.totalDemand > 0) {
      // 公式14：分配比例 = MIN(1, 可用库存 / 总需求) -- 考虑共享子SKU的短缺分配
      item.allocationRatio = Math.min(1, item.availableStock / item.totalDemand)
      // 公式17：子SKU需备货量 = MAX(0, 总需求 - 可用库存)
      item.shortageQty = Math.max(0, item.totalDemand - item.availableStock)
    } else {
      item.allocationRatio = 1
      item.shortageQty = 0
    }
  })

  // 第三轮循环：精准收集各组合单与单品单在子SKU上的穿透需求分布与按比例分配明细
  rawTableList.value.forEach(row => {
    if (row.isCombo && row.childMaterials?.length) {
      row.childMaterials.forEach((child: any) => {
        const code = child.childCode
        const info = map[code]
        if (info) {
          const needed = (row.applyPurchaseQty || 0) * (child.bomRatio || 1)
          const allocated = Math.floor(needed * info.allocationRatio)
          const deptText = row.dept + (row.team ? `-${row.team}` : '')
          const usageItem = {
            orderNo: row.orderNo,
            orderType: row.orderType,
            isCombo: true,
            itemTypeDesc: '组合套件备货',
            parentCode: row.materialCode,
            parentName: row.productName,
            dept: deptText,
            applyQty: row.applyPurchaseQty || 0,
            unit: '套',
            bomRatio: child.bomRatio || 1,
            demandQty: needed,
            allocatedQty: allocated,
            ratioPercent: (info.allocationRatio * 100).toFixed(1) + '%'
          }
          info.demandBreakdown.push(usageItem)
          info.relatedComboUsages.push({
            orderNo: row.orderNo,
            parentCode: row.materialCode,
            parentName: row.productName,
            dept: deptText,
            comboOrderQty: row.applyPurchaseQty,
            bomRatio: child.bomRatio || 1,
            demandQty: needed,
            allocatedQty: allocated
          })
        }
      })
    } else if (!row.isCombo) {
      const code = row.materialCode
      const info = map[code]
      if (info) {
        const needed = row.applyPurchaseQty || 0
        const allocated = Math.floor(needed * info.allocationRatio)
        const deptText = row.dept + (row.team ? `-${row.team}` : '')
        const usageItem = {
          orderNo: row.orderNo,
          orderType: row.orderType,
          isCombo: false,
          itemTypeDesc: '单品独立备货',
          parentCode: row.materialCode,
          parentName: row.productName,
          dept: deptText,
          applyQty: needed,
          unit: '件',
          bomRatio: 1,
          demandQty: needed,
          allocatedQty: allocated,
          ratioPercent: (info.allocationRatio * 100).toFixed(1) + '%'
        }
        info.demandBreakdown.push(usageItem)
        info.relatedComboUsages.push({
          orderNo: row.orderNo,
          parentCode: row.materialCode,
          parentName: row.productName,
          dept: deptText,
          comboOrderQty: needed,
          bomRatio: 1,
          demandQty: needed,
          allocatedQty: allocated
        })
      }
    }
  })

  return map
})

// 辅助方法：获取单个子件的分配信息
const getChildAllocationInfo = (childCode: string) => {
  return materialAllocationMap.value[childCode] || {
    childCode,
    childName: '',
    isIndependentSale: false,
    availableStock: 0,
    totalDemand: 0,
    allocationRatio: 1,
    shortageQty: 0,
    demandBreakdown: [],
    relatedComboUsages: []
  }
}

// 辅助方法：获取整行单据的【最小分配比例】与【瓶颈木桶短板子件】与【实际可供应数】
const getRowBottleneckInfo = (row: any) => {
  if (!row) return { minRatio: 1, minRatioPercent: '100.0%', bottleneckChild: null, suppliableQty: 0, hasBottleneck: false }

  // 1. 如果是组合物料：遍历所有子件，取最小分配比例（木桶短板）
  if (row.isCombo && row.childMaterials?.length) {
    let minRatio = 1
    let bottleneckChild: any = null

    row.childMaterials.forEach((child: any) => {
      const info = getChildAllocationInfo(child.childCode)
      if (info.allocationRatio < minRatio) {
        minRatio = info.allocationRatio
        bottleneckChild = {
          childCode: child.childCode,
          childName: child.childName,
          ratio: info.allocationRatio,
          ratioPercent: (info.allocationRatio * 100).toFixed(1) + '%',
          availableStock: info.availableStock,
          totalDemand: info.totalDemand,
          shortageQty: info.shortageQty
        }
      }
    })

    const hasBottleneck = minRatio < 0.9999
    // 公式15：实际可供应数 = 预估销售数量 * 最小分配比例(该组合所有子SKU中的最小比例)
    const suppliableQty = Math.floor((row.applyPurchaseQty || 0) * minRatio)
    return {
      minRatio,
      minRatioPercent: (minRatio * 100).toFixed(1) + '%',
      bottleneckChild,
      suppliableQty,
      hasBottleneck
    }
  }

  // 2. 如果是单品物料：自身的分配比例就是其最小分配比例
  const info = getChildAllocationInfo(row.materialCode)
  const minRatio = info.allocationRatio
  const hasBottleneck = minRatio < 0.9999
  const suppliableQty = Math.floor((row.applyPurchaseQty || 0) * minRatio)
  return {
    minRatio,
    minRatioPercent: (minRatio * 100).toFixed(1) + '%',
    bottleneckChild: {
      childCode: row.materialCode,
      childName: row.productName,
      ratio: minRatio,
      ratioPercent: (minRatio * 100).toFixed(1) + '%',
      availableStock: info.availableStock,
      totalDemand: info.totalDemand,
      shortageQty: info.shortageQty
    },
    suppliableQty,
    hasBottleneck
  }
}

// 兼容旧接口，并统一由新模型驱动
const getChildNetRemaining = (child: any, parent: any) => {
  const info = getChildAllocationInfo(child.childCode)
  return info.availableStock
}

const getSuggestedBuy = (child: any, parent: any) => {
  const info = getChildAllocationInfo(child.childCode)
  return info.shortageQty
}

// 系统推荐核准数量（即公式15：实际可供应数）
const getRecommendedApprovedQty = (row: any) => {
  if (!row) return 0
  const info = getRowBottleneckInfo(row)
  return info.suppliableQty
}

// 一键填入系统推荐核准数量
const applyRecommendedQty = () => {
  if (!currentRow.value) return
  const info = getRowBottleneckInfo(currentRow.value)
  const rec = info.suppliableQty
  auditForm.result = 'modify_pass'
  auditForm.approvedQty = rec
  
  if (info.hasBottleneck && info.bottleneckChild) {
    auditForm.remark = `[APS木桶瓶颈短缺核减]：受限于瓶颈子件【${info.bottleneckChild.childCode} ${info.bottleneckChild.childName}】分配比例(${info.bottleneckChild.ratioPercent})，当前可用物理库存核定最大可供应 ${rec} 套。超出部分已进入子SKU补货需求清单。`
  } else {
    auditForm.remark = `[APS核算通过]：底层各子物料分配比例均为100%充足，当前在库及在途库存完全可覆盖本单备货申请量 ${rec} 套。`
  }
  
  ElMessage.success(`已按木桶最小分配比例一键核定可供应数: ${rec} 套`)
}

// 展开收起控制
const isAllExpanded = computed(() => {
  return expandedRowKeys.value.length === filteredTableData.value.length && filteredTableData.value.length > 0
})

const toggleAllExpand = () => {
  if (isAllExpanded.value) {
    expandedRowKeys.value = []
  } else {
    expandedRowKeys.value = filteredTableData.value.map(i => i.id)
  }
}

const toggleRowExpand = (row: any) => {
  const idx = expandedRowKeys.value.indexOf(row.id)
  if (idx > -1) {
    expandedRowKeys.value.splice(idx, 1)
  } else {
    expandedRowKeys.value.push(row.id)
  }
}

const isRowExpanded = (row: any) => {
  return expandedRowKeys.value.includes(row.id)
}

const handleExpandChange = (row: any, expandedRows: any[]) => {
  expandedRowKeys.value = expandedRows.map(r => r.id)
}

// 样式与辅助方法
const getOrderTypeClass = (type: string) => {
  switch (type) {
    case '紧急备货': return 'tag-urgent'
    case '项目备货': return 'tag-project'
    case '日常备货': return 'tag-normal'
    default: return 'tag-default'
  }
}

const getTurnoverClass = (days: number) => {
  if (days > 300) return 'turnover-warning'
  if (days > 0 && days < 60) return 'turnover-success'
  return ''
}

// 搜索操作
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据已刷新，已同步最新跨部门子物料锁定状态')
  }, 250)
}

// 重置操作
const resetQuery = () => {
  queryParams.orderType = ''
  queryParams.materialType = ''
  queryParams.timeType = 'deptAuditTime'
  queryParams.dateRange = []
  queryParams.dept = ''
  queryParams.team = ''
  queryParams.materialCode = ''
  queryParams.category = ''
  queryParams.productName = ''
  queryParams.holidayTag = ''
  queryParams.seasonTag = ''
  handleSearch()
}

// 多选变化
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

// 单条审批
const handleApprove = (row: any) => {
  currentRow.value = row
  auditForm.result = 'pass'
  auditForm.approvedQty = row.applyPurchaseQty
  auditForm.approvedDeliveryDate = row.expectDeliveryDate
  auditForm.remark = ''
  drawerVisible.value = true
}

// 提交审批
const submitAudit = () => {
  submitLoading.value = true
  setTimeout(() => {
    submitLoading.value = false
    drawerVisible.value = false
    const actionText = auditForm.result === 'pass' ? '审批通过' : auditForm.result === 'modify_pass' ? '调整数量并通过' : '驳回'
    ElMessage.success(`物料 [${currentRow.value.materialCode}] 已完成审批：${actionText}`)
    
    // 更新本地列表状态
    const idx = rawTableList.value.findIndex(item => item.id === currentRow.value.id)
    if (idx !== -1) {
      if (auditForm.result === 'modify_pass') {
        rawTableList.value[idx].applyPurchaseQty = auditForm.approvedQty
      }
      rawTableList.value[idx].status = actionText
    }
  }, 350)
}

// 批量操作
const handleBatchCommand = (cmd: string) => {
  if (!selectedRows.value.length && cmd !== 'export') {
    ElMessage.warning('请先在表格左侧勾选需要操作的申请单！')
    return
  }

  if (cmd === 'pass') {
    ElMessageBox.confirm(
      `确定对已选中的 ${selectedRows.value.length} 笔备货申请单执行【计划部审批通过】吗？系统将自动锁定对应子物料物理库存。`,
      '批量审批确认',
      { type: 'warning' }
    ).then(() => {
      ElMessage.success(`成功批量通过 ${selectedRows.value.length} 笔备货申请，单据已流转至PMC排产节点！`)
      selectedRows.value = []
    }).catch(() => {})
  } else if (cmd === 'reject') {
    ElMessageBox.prompt('请输入驳回原因批注：', '批量驳回确认', {
      confirmButtonText: '确定驳回',
      cancelButtonText: '取消',
      inputPattern: /^.+$/,
      inputErrorMessage: '驳回原因不能为空'
    }).then(({ value }) => {
      ElMessage.warning(`已驳回 ${selectedRows.value.length} 笔备货申请，原因：${value}`)
      selectedRows.value = []
    }).catch(() => {})
  } else if (cmd === 'auto_adjust') {
    let adjustedCount = 0
    selectedRows.value.forEach(row => {
      const rec = getRecommendedApprovedQty(row)
      if (rec < row.applyPurchaseQty) {
        row.applyPurchaseQty = rec
        adjustedCount++
      }
    })
    ElMessage.success(`已根据APS木桶最小分配比例，智能核减调整了 ${adjustedCount} 笔备货单的实际可供应数！`)
  } else if (cmd === 'transfer') {
    ElMessage.info('转办功能已调用，已通知协同审批人！')
  } else if (cmd === 'export') {
    ElMessage.success(`正在导出当前包含子物料穿透明细的 ${filteredTableData.value.length} 条计划审批数据...`)
  }
}

// 分页变化
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
}

onMounted(() => {
  // 默认展开充足组合F01与短板受限组合F05供直观对比体验
  expandedRowKeys.value = ['F01', 'F05']
})
</script>

<style lang="scss" scoped>
.plan-audit-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 8px 12px 10px 12px;
  background-color: #f0f2f5;
  box-sizing: border-box;
  overflow: hidden;
}

/* 顶部智能预警横幅 */
.penetration-notice-bar {
  background: linear-gradient(90deg, #fff7e6 0%, #fffbe6 100%);
  border: 1px solid #ffd591;
  border-radius: 4px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  box-shadow: 0 1px 2px rgba(250, 140, 22, 0.08);

  .notice-left {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #873800;

    .notice-icon {
      font-size: 15px;
      color: #fa8c16;
      margin-right: 6px;
    }
  }

  .notice-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

/* 顶部搜索卡片 */
.filter-card {
  background: #ffffff;
  padding: 10px 14px 2px 14px;
  border-radius: 4px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .filter-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    :deep(.el-form-item) {
      margin-right: 8px;
      margin-bottom: 8px;

      .el-form-item__content {
        line-height: 28px;
      }
    }

    .composite-time-picker {
      display: inline-flex;
      align-items: center;

      :deep(.time-type-select) {
        .el-input__wrapper {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-right: none;
          background-color: #fafafa;
        }
      }

      :deep(.date-range-picker) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }

    .action-btn-item {
      margin-left: auto;
      margin-right: 0;
    }
  }
}

/* 动作操作栏 */
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;

  .left-actions {
    display: flex;
    align-items: center;
    gap: 12px;

    .audit-operate-btn {
      background-color: #1890ff;
      border-color: #1890ff;
      font-weight: 500;
      padding: 6px 14px;
    }

    .selected-tip {
      font-size: 12px;
      color: #606266;

      b {
        color: #1890ff;
      }
    }
  }

  .right-tools {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

/* 表格容器卡片 */
.table-container {
  flex: 1;
  background: #ffffff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  :deep(.custom-table-header) {
    background-color: #f7f9fc !important;
    color: #333333;
    font-weight: 600;
    font-size: 12px;
    height: 38px;
    padding: 2px 0;
  }

  :deep(.custom-table-cell) {
    font-size: 12px;
    color: #262626;
    padding: 4px 0;
  }

  .col-header-with-filter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 2px;

    .filter-icon {
      font-size: 11px;
      color: #bfbfbf;
      cursor: pointer;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .code-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    .code-link {
      color: #1890ff;
      cursor: pointer;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }

    .badge-row {
      display: flex;
      gap: 3px;

      .mini-badge {
        font-size: 10px;
        line-height: 14px;
        padding: 0 4px;
        height: 16px;
      }
    }
  }

  .order-type-tag {
    display: inline-block;
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 11px;
    line-height: 18px;

    &.tag-normal {
      background-color: #e6f7ff;
      color: #1890ff;
      border: 1px solid #91d5ff;
    }

    &.tag-project {
      background-color: #fff7e6;
      color: #fa8c16;
      border: 1px solid #ffd591;
    }

    &.tag-urgent {
      background-color: #fff1f0;
      color: #f5222d;
      border: 1px solid #ffa39e;
      font-weight: 500;
    }
  }

  .tag-text {
    color: #8c8c8c;
  }

  .text-muted {
    color: #bfbfbf;
  }

  .stock-highlight {
    font-weight: 500;
    color: #262626;
  }

  .sales-array-font {
    font-family: Consolas, Monaco, monospace;
    font-size: 12px;
    color: #595959;
  }

  .apply-qty-val {
    font-weight: 600;
    color: #1890ff;
  }

  .turnover-warning {
    color: #fa8c16;
    font-weight: 500;
  }

  .turnover-success {
    color: #52c41a;
  }

  .op-btn {
    font-weight: 500;
  }
}

/* 子物料展开穿透卡片 */
.expand-penetration-wrapper {
  padding: 12px 16px 14px 16px;
  background-color: #f8fafd;
  border-left: 4px solid #1890ff;
  margin: 4px 10px 8px 10px;
  border-radius: 4px;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.03);

  .expand-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .expand-title {
      display: flex;
      align-items: center;
      gap: 6px;

      .main-title {
        font-weight: 600;
        font-size: 13px;
        color: #1d1d1f;
      }

      .sub-desc {
        font-size: 12px;
        color: #8c8c8c;

        b {
          color: #1890ff;
        }
      }
    }

    .expand-tags {
      display: flex;
      align-items: center;
      gap: 8px;

      .deduct-tip {
        font-size: 11px;
        color: #8c8c8c;
      }
    }
  }

  .sub-child-table {
    background: #ffffff;

    .child-code-val {
      font-weight: 600;
      color: #262626;
      margin-right: 4px;
    }

    .mini-tag {
      font-size: 10px;
      height: 16px;
      padding: 0 4px;
    }

    .bom-ratio-tag {
      background: #f0f5ff;
      color: #2f54eb;
      padding: 1px 6px;
      border-radius: 3px;
      font-weight: 600;
      font-size: 11px;
    }

    .stock-num {
      font-weight: 600;
      color: #52c41a;
    }

    .transit-num {
      color: #1890ff;
      font-weight: 500;
    }

    .reserved-num {
      color: #8c8c8c;

      &.has-reserved {
        color: #f5222d;
        font-weight: 600;
        cursor: pointer;
      }

      .info-icon {
        font-size: 11px;
        margin-left: 2px;
      }
    }

    .net-available {
      font-weight: 700;
      color: #52c41a;

      &.is-short {
        color: #f5222d;
      }
    }

    .needed-qty {
      color: #1890ff;
      font-weight: 600;
    }

    .suggest-qty {
      font-size: 11px;
      color: #52c41a;

      &.need-buy {
        color: #f5222d;
        font-weight: 600;
      }
    }
  }
}

/* 既是单品又属于组合套件的双向穿透面板 */
.single-combo-shared-wrapper {
  background-color: #fffdf5 !important;
  border-left: 4px solid #fa8c16 !important;

  .single-combo-stat-grid {
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid #ffe58f;
    border-radius: 4px;
    padding: 10px 14px;
    margin-bottom: 8px;
    gap: 8px;

    .stat-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;

      .s-label {
        font-size: 11px;
        color: #8c8c8c;
        margin-bottom: 2px;
      }
      .s-val {
        font-size: 15px;
        font-weight: 700;
      }
      .s-tip {
        font-size: 10px;
        color: #bfbfbf;
        margin-top: 2px;
      }
    }

    .stat-symbol {
      font-size: 14px;
      font-weight: 700;
      color: #bfbfbf;
    }
  }

  .combo-link-alert {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #389e0d;
    background: #f6ffed;
    border: 1px solid #b7eb8f;
    padding: 8px 12px;
    border-radius: 4px;
  }
}

/* 跨部门预占浮层 */
.reserved-popover {
  .pop-title {
    font-weight: 600;
    font-size: 12px;
    margin-bottom: 6px;
    color: #262626;
  }
  .pop-item {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    padding: 3px 0;
    border-bottom: 1px dashed #f0f0f0;

    b {
      color: #f5222d;
    }
  }
}

/* 底部分页 */
.pagination-footer {
  display: flex;
  justify-content: flex-end;
  padding: 8px 12px;
  background: #ffffff;
  border-top: 1px solid #f0f0f0;
  border-radius: 0 0 4px 4px;
}

/* 抽屉样式 */
.audit-drawer {
  .drawer-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .drawer-card {
    background: #fbfbfc;
    border: 1px solid #eef0f3;
    border-radius: 6px;
    padding: 14px;

    &.highlight-card {
      background: #fdfbf7;
      border: 1px solid #ffe7ba;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: #1d1d1f;
      margin-bottom: 12px;
    }

    .anti-deduct-panel {
      .anti-desc {
        font-size: 12px;
        color: #8c8c8c;
        margin-bottom: 10px;
        line-height: 1.5;
      }

      .child-calc-item {
        background: #ffffff;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        padding: 10px;
        margin-bottom: 10px;

        .calc-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;

          .c-code {
            font-weight: 600;
            color: #262626;
            font-size: 12px;
          }

          .c-ratio {
            background: #e6f7ff;
            color: #1890ff;
            padding: 0 4px;
            font-size: 11px;
            border-radius: 2px;
          }

          .c-sale-tag {
            background: #fffbe6;
            color: #d48806;
            border: 1px solid #ffe58f;
            padding: 0 4px;
            font-size: 10px;
            border-radius: 2px;
          }
        }

        .calc-row {
          display: flex;
          align-items: center;
          background: #f8fafc;
          padding: 8px 10px;
          border-radius: 4px;
          gap: 6px;

          .row-cell {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;

            .label {
              font-size: 10px;
              color: #8c8c8c;
            }
            .val {
              font-size: 13px;
              font-weight: 700;
            }
          }

          .math-symbol {
            font-size: 13px;
            font-weight: 700;
            color: #bfbfbf;
          }

          .text-danger { color: #f5222d; }
          .text-success { color: #52c41a; }
          .text-primary { color: #1890ff; }
        }

        .calc-conclusion {
          margin-top: 6px;
          font-size: 12px;

          .shortage-alert {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #f5222d;
            b { text-decoration: underline; }
          }

          .sufficient-alert {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #52c41a;
          }
        }
      }

      .recommend-box {
        background: #e6f7ff;
        border: 1px solid #91d5ff;
        border-radius: 4px;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .rec-info {
          font-size: 13px;
          color: #0050b3;

          .rec-val {
            font-size: 18px;
            color: #f5222d;
            font-weight: 700;
            margin: 0 2px;
          }

          .rec-sub {
            font-size: 11px;
            color: #8c8c8c;
            margin-left: 6px;
          }
        }
      }
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;

      .metric-item {
        background: #ffffff;
        border: 1px solid #eaedf1;
        border-radius: 4px;
        padding: 8px 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        &.wide {
          grid-column: span 3;
        }

        .m-label {
          font-size: 11px;
          color: #8c8c8c;
        }

        .m-val {
          font-size: 14px;
          font-weight: 600;
          color: #262626;

          &.highlight {
            color: #52c41a;
          }

          &.highlight-blue {
            color: #1890ff;
            font-size: 16px;
          }
        }
      }
    }

    .audit-steps {
      padding: 10px 0 6px 0;
    }

    .form-item-tip {
      font-size: 12px;
      color: #8c8c8c;
      margin-left: 8px;
    }
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

/* 穿透总需求互动触发器与浮层样式 */
.demand-val-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
  background: rgba(24, 144, 255, 0.06);
  border: 1px solid rgba(24, 144, 255, 0.2);

  &:hover {
    background: #e6f7ff;
    border-color: #1890ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.15);
  }

  .demand-num {
    font-weight: 700;
    color: #1890ff;
    font-size: 13px;
  }

  .demand-sub-icon {
    font-size: 12px;
    color: #1890ff;
  }

  .demand-hover-tip {
    font-size: 10px;
    background: #1890ff;
    color: #fff;
    padding: 0 4px;
    border-radius: 2px;
    line-height: 14px;
  }
}

.demand-clickable-text {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  transition: color 0.2s;

  &:hover {
    color: #40a9ff;
    text-decoration: underline;
  }
}

.demand-popover-panel {
  .popover-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 8px;
    margin-bottom: 8px;

    .popover-header-title {
      display: flex;
      align-items: center;
      font-size: 13px;

      .sub-name {
        margin-left: 6px;
        font-size: 11px;
        color: #8c8c8c;
      }
    }

    .popover-header-stats {
      font-size: 11px;
      color: #595959;

      .divider {
        margin: 0 6px;
        color: #d9d9d9;
      }
    }
  }

  .popover-summary-bar {
    background: #f6ffed;
    border: 1px solid #b7eb8f;
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 11px;
    color: #389e0d;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .order-no-font {
    font-family: monospace;
    font-size: 11px;
    font-weight: 600;
  }

  .popover-footer-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f0f0f0;
    padding-top: 8px;
    margin-top: 4px;
  }
}

/* 子SKU穿透总需求在申请上的分布明细看板弹窗 */
.distribution-dialog-body {
  .sku-header-card {
    background: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    padding: 12px 16px;
    margin-bottom: 14px;

    .sku-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;

      .sku-badge {
        background: #1890ff;
        color: #fff;
        font-size: 11px;
        padding: 1px 6px;
        border-radius: 3px;
        font-weight: 600;
      }

      .sku-code-text {
        font-size: 15px;
        font-weight: 700;
        color: #262626;
        font-family: monospace;
      }

      .sku-name-text {
        font-size: 13px;
        color: #595959;
      }
    }

    .sku-sub-desc {
      font-size: 12px;
      color: #8c8c8c;
      line-height: 1.5;
    }
  }

  .dist-stat-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 16px;

    .dist-card {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;

      &.highlight-blue {
        border-color: #91d5ff;
        background: #e6f7ff;
      }

      .dist-label {
        font-size: 12px;
        color: #8c8c8c;
      }

      .dist-val {
        font-size: 20px;
        font-weight: 700;
        color: #262626;

        .dist-unit {
          font-size: 12px;
          font-weight: normal;
          color: #8c8c8c;
        }
      }

      .dist-tip {
        font-size: 11px;
        color: #bfbfbf;
      }
    }
  }

  .demand-share-bar-section {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    padding: 12px 14px;
    margin-bottom: 16px;

    .share-bar-title {
      font-size: 12px;
      margin-bottom: 8px;
    }

    .share-progress-container {
      height: 24px;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      background: #f0f2f5;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.06);

      .share-progress-item {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 11px;
        font-weight: 600;
        transition: width 0.3s ease;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 4px;

        &:hover {
          filter: brightness(1.1);
        }

        .bar-label {
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
      }
    }

    .share-legend-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 8px;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        color: #595959;

        .legend-color-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
      }
    }
  }

  .dist-table-wrapper {
    .dist-table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
  }
}

/* 跨部门弹窗 */
.cross-dept-dialog-body {
  .mini-tag {
    font-size: 10px;
    height: 16px;
    margin-left: 4px;
  }

  .compete-item {
    font-size: 12px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
  }

  .text-xs { font-size: 11px; color: #595959; }
  .text-danger { color: #f5222d; }
  .text-success { color: #52c41a; }
  .font-bold { font-weight: 700; }
}
</style>
