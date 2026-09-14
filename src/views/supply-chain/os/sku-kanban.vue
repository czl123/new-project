<template>
  <div class="sku-kanban-page custom-scrollbar">
    <!-- 顶部 Header 卡片 -->
    <div class="dashboard-header-card mb-20">
      <div class="header-title-bar">
        <div class="title-left">
          <div class="icon-wrapper">
            <el-icon class="header-icon"><DataAnalysis /></el-icon>
          </div>
          <div class="title-text-group">
            <span class="main-title">SKU海外仓库存与 ASIN 跟踪管理中心</span>
            <span class="sub-title">ASIN 跟踪列表 · ERP API 对接 · 海外仓子物料物理库存穿透汇总分析</span>
          </div>
        </div>
      </div>

      <!-- KPI 核心指标网格 -->
      <div class="kpi-grid">
        <div class="kpi-card total-sku">
          <div class="kpi-inner">
            <div class="kpi-content">
              <span class="kpi-label">跟踪 ASIN / 父物料</span>
              <div class="kpi-value-row">
                <span class="kpi-value">{{ totalAsinCount }}</span>
                <span class="kpi-unit">跟踪 ASIN ({{ totalParentCount }} 父物料)</span>
              </div>
            </div>
            <div class="kpi-icon-box"><el-icon><Goods /></el-icon></div>
          </div>
          <div class="kpi-sub-info">
            <span class="badge-active">核心在售 ASIN 跟踪中</span>
          </div>
        </div>

        <div class="kpi-card stock-qty">
          <div class="kpi-inner">
            <div class="kpi-content">
              <span class="kpi-label">父物料穿透折算总可售</span>
              <div class="kpi-value-row">
                <span class="kpi-value">{{ totalParentAvailable.toLocaleString() }}</span>
                <span class="kpi-unit">套</span>
              </div>
            </div>
            <div class="kpi-icon-box"><el-icon><Box /></el-icon></div>
          </div>
          <div class="kpi-sub-info">
            <span class="text-secondary">子物料物理存量: {{ totalChildStockQty.toLocaleString() }} 件</span>
          </div>
        </div>

        <div class="kpi-card transit-qty">
          <div class="kpi-inner">
            <div class="kpi-content">
              <span class="kpi-label">父物料穿透折算总在途</span>
              <div class="kpi-value-row">
                <span class="kpi-value">{{ totalParentTransit.toLocaleString() }}</span>
                <span class="kpi-unit">套</span>
              </div>
            </div>
            <div class="kpi-icon-box"><el-icon><Van /></el-icon></div>
          </div>
          <div class="kpi-sub-info">
            <span class="text-blue">在途物理子物料: {{ totalChildTransitQty.toLocaleString() }} 件</span>
          </div>
        </div>

        <div class="kpi-card danger-alert">
          <div class="kpi-inner">
            <div class="kpi-content">
              <span class="kpi-label">子物料短板致缺料预警</span>
              <div class="kpi-value-row">
                <span class="kpi-value danger-text">{{ completenessAlertCount }}</span>
                <span class="kpi-unit">项缺料预警</span>
              </div>
            </div>
            <div class="kpi-icon-box danger-icon"><el-icon><Warning /></el-icon></div>
          </div>
          <div class="kpi-sub-info">
            <span class="badge-danger" v-if="completenessAlertCount > 0">存在关键子物料存量告急</span>
            <span class="badge-active" v-else>子物料齐套状态良好</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 顶部 Tab 页签导航 -->
    <div class="tabs-container-card mb-20">
      <el-tabs v-model="activeTab" type="card" class="custom-tabs" @tab-change="handleTabChange">
        <el-tab-pane label="父子物料绑定关系" name="binding">
          <template #label>
            <span class="tab-label-inner">
              <el-icon><Connection /></el-icon> 父子物料绑定关系
            </span>
          </template>
        </el-tab-pane>

        <el-tab-pane label="ASIN跟踪管理" name="asinTrack">
          <template #label>
            <span class="tab-label-inner">
              <el-icon><Promotion /></el-icon> ASIN 跟踪管理
            </span>
          </template>
        </el-tab-pane>

        <el-tab-pane label="子物料物理库存明细" name="childStock">
          <template #label>
            <span class="tab-label-inner">
              <el-icon><Box /></el-icon> 子物料物理库存明细
            </span>
          </template>
        </el-tab-pane>

        <el-tab-pane label="SKU海外仓库存看板" name="kanban">
          <template #label>
            <span class="tab-label-inner">
              <el-icon><DataAnalysis /></el-icon> SKU海外仓库存看板
            </span>
          </template>
        </el-tab-pane>

        <el-tab-pane label="穿透齐套与缺料预警" name="completeness">
          <template #label>
            <span class="tab-label-inner">
              <el-icon><Warning /></el-icon> 穿透齐套与缺料预警
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 选项卡 1: SKU海外仓库存看板 -->
    <div v-if="activeTab === 'kanban'" class="tab-content">
      <!-- 多维筛选区 -->
      <div class="filter-panel-card mb-20">
        <div class="filter-row">
          <div class="filter-group">
            <span class="filter-label">账号:</span>
            <el-select v-model="filterAccount" placeholder="全部账号" size="default" style="width: 130px;" clearable>
              <el-option label="全部账号" value="全部" />
              <el-option v-for="acc in accountOptions" :key="acc" :label="acc" :value="acc" />
            </el-select>
          </div>

          <div class="filter-group">
            <span class="filter-label">站点:</span>
            <el-select v-model="filterSite" placeholder="全部站点" size="default" style="width: 100px;" clearable>
              <el-option label="全部" value="全部" />
              <el-option label="🇺🇸 US" value="US" />
            </el-select>
          </div>

          <div class="filter-group">
            <span class="filter-label">三方海外仓:</span>
            <el-select v-model="filterTpOverseasWh" placeholder="全部" size="default" style="width: 120px;" clearable>
              <el-option label="全部" value="全部" />
              <el-option v-for="tp in tpWhOptions" :key="tp" :label="tp" :value="tp" />
            </el-select>
          </div>

          <div class="filter-group">
            <span class="filter-label">仓库名称:</span>
            <el-select v-model="filterWarehouseName" placeholder="全部仓库" size="default" style="width: 140px;" clearable>
              <el-option label="全部仓库" value="全部" />
              <el-option v-for="wh in warehouseNameOptions" :key="wh" :label="wh" :value="wh" />
            </el-select>
          </div>

          <div class="filter-group search-input-box">
            <el-input
              v-model="searchKey"
              placeholder="搜索 父物料 / 子物料编码 / SKU / ASIN..."
              prefix-icon="Search"
              clearable
              size="default"
              style="width: 280px;"
              @keyup.enter="handleSearch"
            />
          </div>

          <div class="filter-actions">
            <el-button type="primary" size="default" icon="Search" @click="handleSearch">查询</el-button>
            <el-button size="default" icon="RefreshLeft" plain @click="handleReset">重置</el-button>
          </div>
        </div>
      </div>

      <!-- 主数据表格 -->
      <div class="main-content-card">
        <div class="table-toolbar mb-16">
          <div class="toolbar-left">
            <span class="result-count">
              检索到 <b>{{ filteredTableData.length }}</b> 项父物料（绑定关系来源于 ERP，由海外仓子物料存量实时穿透汇总）
            </span>
          </div>

          <div class="toolbar-right">
            <el-checkbox v-model="onlyShowBottleneck" label="仅看子物料瓶颈告急" size="default" @change="handleSearch" />
            <el-button type="primary" plain size="small" icon="Connection" @click="handleBatchAnalysis">
              子物料齐套分析
            </el-button>
          </div>
        </div>

        <div class="table-container">
          <el-table
            :data="paginatedData"
            border
            stripe
            highlight-current-row
            size="default"
            style="width: 100%;"
          >
            <!-- 展开列: 展示绑定该父物料的【子物料 BOM 明细】 -->
            <el-table-column type="expand" width="45">
              <template #default="{ row }">
                <div class="expand-wrapper">
                  <div class="expand-header">
                    <div class="expand-title">
                      <el-icon><Connection /></el-icon>
                      父物料 <b>[{{ row.parentMaterialCode }}]</b> 的 BOM 绑定关系与海外仓物理库存穿透汇总
                    </div>
                    <div class="expand-total">
                      父物料穿透折算可售套数: <b class="text-primary">{{ row.calculatedParentAvailable }} 套</b> 
                      <span class="bottleneck-info" v-if="row.bottleneckChild">
                        (⚠️ 受限于子物料: <b class="text-danger">{{ row.bottleneckChild.childCode }}</b>)
                      </span>
                    </div>
                  </div>
                  
                  <el-table :data="row.childMaterials" border size="small" class="sub-table mt-10">
                    <el-table-column label="子物料编码" prop="childCode" width="140">
                      <template #default="{ row: subRow }">
                        <span class="child-code">{{ subRow.childCode }}</span>
                      </template>
                    </el-table-column>
                    
                    <el-table-column label="子物料名称" prop="childName" min-width="160" show-overflow-tooltip />
                    
                    <el-table-column label="绑定用量(配比)" prop="bomRatio" width="115" align="center">
                      <template #default="{ row: subRow }">
                        <el-tag size="small" type="info" effect="plain">1 父 : {{ subRow.bomRatio }} 子</el-tag>
                      </template>
                    </el-table-column>

                    <el-table-column label="海外仓物理可售" prop="availableQty" width="130" align="right">
                      <template #default="{ row: subRow }">
                        <span class="num-bold" :class="{ 'text-danger': subRow.availableQty < 100 }">
                          {{ subRow.availableQty.toLocaleString() }} 件
                        </span>
                      </template>
                    </el-table-column>

                    <el-table-column label="海外仓物理在途" prop="transitQty" width="130" align="right">
                      <template #default="{ row: subRow }">
                        <span class="num-blue" v-if="subRow.transitQty > 0">+{{ subRow.transitQty.toLocaleString() }} 件</span>
                        <span class="text-muted" v-else>0</span>
                      </template>
                    </el-table-column>

                    <el-table-column label="穿透折算可支持父物料数" width="170" align="right">
                      <template #default="{ row: subRow }">
                        <span class="num-bold text-primary">
                          {{ Math.floor(subRow.availableQty / subRow.bomRatio).toLocaleString() }} 套
                        </span>
                      </template>
                    </el-table-column>

                    <el-table-column label="同海外仓分支仓库物理分布" min-width="230">
                      <template #default="{ row: subRow }">
                        <div class="sub-wh-dist">
                          <span 
                            v-for="dist in subRow.warehouseDist" 
                            :key="dist.whName" 
                            class="dist-pill"
                            :class="{ current: dist.whName === row.warehouseName }"
                          >
                            {{ dist.shortName }}: {{ dist.qty }}件
                          </span>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column label="齐套状态" width="110" align="center">
                      <template #default="{ row: subRow }">
                        <el-tag 
                          v-if="Math.floor(subRow.availableQty / subRow.bomRatio) === row.calculatedParentAvailable" 
                          type="danger" 
                          size="small"
                          effect="dark"
                        >
                          短板瓶颈
                        </el-tag>
                        <el-tag v-else type="success" size="small" effect="plain">存量充足</el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="账号" prop="account" width="130" show-overflow-tooltip />
            <el-table-column label="站点" width="85" align="center">
              <template #default="{ row }">
                <span class="site-tag"><span class="flag">{{ row.countryFlag }}</span> {{ row.site }}</span>
              </template>
            </el-table-column>
            <el-table-column label="ASIN" prop="asin" width="125" show-overflow-tooltip>
              <template #default="{ row }"><span class="code-link">{{ row.asin }}</span></template>
            </el-table-column>
            <el-table-column label="物料编码(父)" min-width="150" show-overflow-tooltip>
              <template #default="{ row }">
                <div class="parent-mat-cell">
                  <el-tag size="small" type="warning" effect="dark" class="parent-badge">父物料</el-tag>
                  <span class="parent-code">{{ row.parentMaterialCode }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="产品名称" min-width="180" show-overflow-tooltip>
              <template #default="{ row }">
                <div class="prod-name-cell">
                  <el-image :src="row.image" class="prod-img" fit="cover" />
                  <span class="name-text" :title="row.productName">{{ row.productName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="三方海外仓" prop="tpOverseasWh" width="120" align="center" show-overflow-tooltip />
            <el-table-column label="仓库名称" prop="warehouseName" width="140" show-overflow-tooltip />
            <el-table-column label="可售(穿透汇总)" width="130" align="right" sortable prop="calculatedParentAvailable">
              <template #default="{ row }">
                <div class="penetrate-stock-cell">
                  <span class="num-bold text-primary">{{ row.calculatedParentAvailable.toLocaleString() }}</span>
                  <el-tag size="small" type="success" effect="plain" class="penetrate-tag">穿透</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="在途(穿透汇总)" width="125" align="right" sortable prop="calculatedParentTransit">
              <template #default="{ row }">
                <span class="num-blue" v-if="row.calculatedParentTransit > 0">+{{ row.calculatedParentTransit.toLocaleString() }}</span>
                <span class="text-muted" v-else>0</span>
              </template>
            </el-table-column>
            <el-table-column label="绑定子物料及短板说明" min-width="220">
              <template #default="{ row }">
                <div class="child-summary-box">
                  <span class="child-count">BOM 绑定 {{ row.childMaterials.length }} 款子物料</span>
                  <div v-if="row.bottleneckChild" class="bottleneck-tag-row">
                    <span class="bottleneck-label">瓶颈:</span>
                    <span class="bottleneck-code" :title="row.bottleneckChild.childName">
                      {{ row.bottleneckChild.childCode }} (存量可折算 {{ Math.floor(row.bottleneckChild.availableQty / row.bottleneckChild.bomRatio) }} 套)
                    </span>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="100" align="center" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" icon="Connection" @click="handlePenetrateDetail(row)">穿透算量</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-wrapper mt-16">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="filteredTableData.length"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 选项卡 2: ASIN 跟踪管理 (要求包含: 账号 站点 ASIN SKU 物料编码) -->
    <div v-else-if="activeTab === 'asinTrack'" class="tab-content">
      <div class="filter-panel-card mb-20">
        <div class="filter-row">
          <div class="filter-group">
            <span class="filter-label">账号:</span>
            <el-select v-model="asinFilterAccount" placeholder="全部账号" size="default" style="width: 140px;" clearable>
              <el-option label="全部账号" value="全部" />
              <el-option label="MNE" value="MNE" />
              <el-option label="WKJ" value="WKJ" />
              <el-option label="YBS" value="YBS" />
              <el-option label="DW" value="DW" />
              <el-option label="BYH" value="BYH" />
            </el-select>
          </div>

          <div class="filter-group">
            <span class="filter-label">站点:</span>
            <el-select v-model="asinFilterSite" placeholder="全部站点" size="default" style="width: 110px;" clearable>
              <el-option label="全部" value="全部" />
              <el-option label="US" value="US" />
            </el-select>
          </div>

          <div class="filter-group search-input-box">
            <el-input
              v-model="asinSearchKey"
              placeholder="搜索 ASIN / SKU / 物料编码 / 产品名称..."
              prefix-icon="Search"
              clearable
              size="default"
              style="width: 320px;"
            />
          </div>

          <div class="filter-actions">
            <el-button type="primary" icon="Plus" size="default" @click="handleOpenAddAsinModal">
              + 新增跟踪 ASIN
            </el-button>
            <el-button plain icon="Upload" size="default" @click="handleBatchImportAsin">
              批量导入 ASIN
            </el-button>
          </div>
        </div>
      </div>

      <div class="main-content-card">
        <div class="table-toolbar mb-16">
          <div class="toolbar-left">
            <span class="result-count">当前共跟踪 <b>{{ filteredAsinTrackData.length }}</b> 项 ASIN 信息</span>
          </div>
          <div class="toolbar-right">
            <el-tag type="primary" size="small">实时监控缺货/断货状态</el-tag>
          </div>
        </div>

        <el-table :data="filteredAsinTrackData" border stripe size="default" style="width: 100%;">
          <!-- 1. 账号 -->
          <el-table-column label="账号" prop="account" width="160" show-overflow-tooltip />

          <!-- 2. 站点 -->
          <el-table-column label="站点" width="110" align="center">
            <template #default="{ row }">
              <span class="site-tag">
                {{ row.site }}
              </span>
            </template>
          </el-table-column>

          <!-- 3. ASIN -->
          <el-table-column label="ASIN" prop="asin" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="code-link font-bold">{{ row.asin }}</span>
            </template>
          </el-table-column>

          <!-- 4. SKU -->
          <el-table-column label="SKU" prop="sku" min-width="170" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="code-bold">{{ row.sku }}</span>
            </template>
          </el-table-column>

          <!-- 5. 物料编码 -->
          <el-table-column label="物料编码" prop="materialCode" min-width="170" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="parent-code">{{ row.materialCode }}</span>
            </template>
          </el-table-column>

          <!-- 6. 产品名称 (自动关联父子物料绑定关系带出) -->
          <el-table-column label="产品名称" min-width="240" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="product-name font-medium">{{ getProductNameByMaterialCode(row.materialCode) }}</span>
            </template>
          </el-table-column>



          <!-- 添加时间 -->
          <el-table-column label="添加时间" prop="addTime" width="160" align="center" />

          <!-- 操作 -->
          <el-table-column label="操作" width="160" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" icon="Edit" @click="handleEditAsinTrack(row)">编辑</el-button>
              <el-button type="danger" link size="small" icon="Delete" @click="handleDeleteAsinTrack(row)">取消跟踪</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 选项卡 1: 父子物料绑定关系 -->
    <div v-else-if="activeTab === 'binding'" class="tab-content">
      <div class="filter-panel-card mb-20">
        <div class="filter-row">
          <div class="filter-group search-input-box">
            <el-input
              v-model="bindingSearchKey"
              placeholder="搜索 父物料编码 / 产品名称 / 子物料编码..."
              prefix-icon="Search"
              clearable
              size="default"
              style="width: 300px;"
            />
          </div>

          <div class="filter-group combo-type-tabs">
            <span class="filter-label">组合类型:</span>
            <el-radio-group v-model="comboTypeFilter" size="default">
              <el-radio-button label="全部">全部 ({{ bindingTableData.length }})</el-radio-button>
              <el-radio-button label="单品多量">单品多量 ({{ countSingleQty }})</el-radio-button>
              <el-radio-button label="单品多包">单品多包 ({{ countSinglePkg }})</el-radio-button>
              <el-radio-button label="多品多包">多品多包 ({{ countMultiPkg }})</el-radio-button>
            </el-radio-group>
          </div>

          <div class="filter-actions">
            <el-button type="primary" icon="Plus" size="default" @click="handleOpenAddBinding">
              + 新增父子物料绑定
            </el-button>
          </div>
        </div>
      </div>

      <div class="main-content-card">
        <div class="table-toolbar mb-16">
          <div class="toolbar-left">
            <span class="result-count">
              共 <b>{{ filteredBindingTableData.length }}</b> 项父子物料 BOM 绑定关系
            </span>
          </div>
        </div>

        <el-table :data="filteredBindingTableData" border stripe size="default" style="width: 100%;">
          <!-- 展开列: 展示父 SKU 绑定的所有子 SKU 明细清单 -->
          <el-table-column type="expand" width="45">
            <template #default="{ row }">
              <div class="expand-wrapper">
                <div class="expand-header mb-10">
                  <span class="expand-title">
                    <el-icon><Connection /></el-icon>
                    父物料 <b>[{{ row.parentCode }}]</b> 绑定的子物料 BOM 明细列表
                  </span>
                  <span class="text-secondary" v-if="row.boundChildren && row.boundChildren.length">
                    共绑定 <b>{{ row.boundChildren.length }}</b> 款子物料
                  </span>
                  <span class="text-warning" v-else>
                    ⚠️ 暂无绑定的子物料明细（可点击操作栏【编辑】进行绑定）
                  </span>
                </div>

                <el-table v-if="row.boundChildren && row.boundChildren.length" :data="row.boundChildren" border size="small" class="sub-table">
                  <el-table-column label="子 SKU / 子物料编码" prop="childCode" width="220">
                    <template #default="{ row: sub }">
                      <span class="child-code font-bold">{{ sub.childCode }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="子物料名称" prop="childName" min-width="260" show-overflow-tooltip />

                  <el-table-column label="绑定用量配比" prop="ratio" width="160" align="center">
                    <template #default="{ row: sub }">
                      <el-tag size="small" type="primary" effect="light" class="ratio-badge">
                        1 父 : {{ sub.ratio }} 子
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-table-column>

          <!-- 1. 父物料编码 (父 SKU) -->
          <el-table-column label="父物料编码 (父SKU)" prop="parentCode" min-width="220" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="parent-mat-cell flex-center">
                <el-tag size="small" type="warning" effect="dark" class="parent-badge mr-6">父SKU</el-tag>
                <span class="parent-code font-bold mr-6">{{ row.parentCode }}</span>
                <el-tooltip content="复制父SKU" placement="top" :hide-after="1000">
                  <el-button
                    type="primary"
                    link
                    size="small"
                    icon="CopyDocument"
                    class="copy-btn"
                    @click.stop="handleCopyText(row.parentCode, '父SKU')"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>

          <!-- 2. 产品名称 -->
          <el-table-column label="产品名称" prop="productName" min-width="240" show-overflow-tooltip />

          <!-- 3. 组合类型 -->
          <el-table-column label="组合类型" prop="comboType" width="130" align="center">
            <template #default="{ row }">
              <el-tag
                :type="row.comboType === '单品多量' ? 'primary' : row.comboType === '单品多包' ? 'warning' : 'success'"
                effect="dark"
                size="small"
                class="combo-type-tag"
              >
                {{ row.comboType || '单品多量' }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 4. 绑定的子物料明细预览 -->
          <el-table-column label="绑定子物料明细" min-width="280" show-overflow-tooltip>
            <template #default="{ row }">
              <div v-if="row.boundChildren && row.boundChildren.length" class="child-chips-preview">
                <el-tag
                  v-for="(child, idx) in row.boundChildren"
                  :key="idx"
                  size="small"
                  type="info"
                  effect="plain"
                  class="mr-4 mb-4"
                >
                  {{ child.childCode }} (1:{{ child.ratio }})
                </el-tag>
              </div>
              <span v-else class="text-muted">暂未绑定子物料</span>
            </template>
          </el-table-column>

          <!-- 4. 绑定的子物料数 -->
          <el-table-column label="子物料数" width="120" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="row.boundChildren && row.boundChildren.length > 0 ? 'success' : 'info'" 
                effect="plain" 
                size="default"
              >
                {{ row.boundChildren ? row.boundChildren.length : 0 }} 款子物料
              </el-tag>
            </template>
          </el-table-column>


          <!-- 更新时间 -->
          <el-table-column label="更新时间" prop="updateTime" width="170" align="center" />

          <!-- 8. 操作 -->
          <el-table-column label="操作" width="130" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" icon="Edit" @click="handleEditBinding(row)">编辑</el-button>
              <el-button type="danger" link size="small" icon="Delete" @click="handleUnbind(row)">解绑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 选项卡 4: 子物料物理库存明细 -->
    <div v-else-if="activeTab === 'childStock'" class="tab-content">
      <div class="main-content-card">
        <div class="table-toolbar mb-16">
          <div class="toolbar-left">
            <span class="result-count">全仓共有 <b>{{ childPhysicalStockData.length }}</b> 项物理子物料存放于海外仓</span>
          </div>
          <div class="toolbar-right">
            <el-button type="primary" plain size="small" icon="Plus" @click="handleNewChildStock">新增子物料盘点</el-button>
          </div>
        </div>

        <el-table :data="childPhysicalStockData" border stripe size="default" style="width: 100%;">
          <el-table-column label="子物料编码" prop="childCode" min-width="180">
            <template #default="{ row }">
              <div class="flex-center">
                <span class="child-code font-bold mr-6">{{ row.childCode }}</span>
                <el-tooltip content="复制子物料编码" placement="top" :hide-after="1000">
                  <el-button
                    type="primary"
                    link
                    size="small"
                    icon="CopyDocument"
                    class="copy-btn"
                    @click.stop="handleCopyText(row.childCode, '子物料编码')"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="子物料名称" prop="childName" min-width="240" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="flex-center">
                <span class="mr-6 font-medium overflow-ellipsis">{{ row.childName }}</span>
                <el-tooltip content="复制子物料名称" placement="top" :hide-after="1000">
                  <el-button
                    type="primary"
                    link
                    size="small"
                    icon="CopyDocument"
                    class="copy-btn"
                    @click.stop="handleCopyText(row.childName, '子物料名称')"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="三方海外仓" prop="tpWh" width="140" align="center" />
          <el-table-column label="物理仓库名称" prop="whName" min-width="180" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="flex-center">
                <span class="mr-6 overflow-ellipsis">{{ row.whName }}</span>
                <el-tooltip content="复制物理仓库名称" placement="top" :hide-after="1000">
                  <el-button
                    type="primary"
                    link
                    size="small"
                    icon="CopyDocument"
                    class="copy-btn"
                    @click.stop="handleCopyText(row.whName, '物理仓库名称')"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="物理可售库存" prop="availableQty" width="150" align="right">
            <template #default="{ row }">
              <b class="text-primary">{{ row.availableQty.toLocaleString() }} 件</b>
            </template>
          </el-table-column>
          <el-table-column label="物理在途库存" prop="transitQty" width="150" align="right">
            <template #default="{ row }">
              <span class="num-blue" v-if="row.transitQty > 0">+{{ row.transitQty.toLocaleString() }} 件</span>
              <span class="text-muted" v-else>0 件</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="210" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" icon="DocumentCopy" @click="handleCopyRowChildStock(row)">复制行</el-button>
              <el-button type="primary" link size="small" icon="Edit" @click="handleEditChildStockModal(row)">编辑</el-button>
              <el-button type="danger" link size="small" icon="Delete" @click="handleDeleteChildStock(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 选项卡 5: 穿透齐套与缺料预警 -->
    <div v-else-if="activeTab === 'completeness'" class="tab-content">
      <div class="main-content-card">
        <div class="card-title-bar mb-12">
          <el-icon class="icon text-danger"><Warning /></el-icon>
          <span class="title">子物料存量告急导致的父物料缺料短板洞察</span>
        </div>

        <div class="formula-banner mini mb-12">
          <span class="formula-title">📐 补货量计算公式：</span>
          <span class="formula-desc">建议单独采购/补货量 <b>=</b> ( 其他子物料最高充盈度套数 <b>−</b> 当前短板子物料可售套数 ) <b>×</b> 单套 BOM 配比</span>
        </div>

        <el-table :data="completenessAlertData" border stripe size="default" style="width: 100%;">
          <el-table-column label="父物料编码 (仓库)" prop="parentCode" min-width="190">
            <template #default="{ row }"><span class="parent-code">{{ row.parentCode }}</span></template>
          </el-table-column>
          <el-table-column label="产品名称" prop="productName" min-width="200" show-overflow-tooltip />
          <el-table-column label="短板子物料存量明细" min-width="220">
            <template #default="{ row }">
              <div class="child-chips-preview">
                <el-tag
                  v-for="item in row.shortageItems"
                  :key="item.childCode"
                  type="danger"
                  effect="plain"
                  size="small"
                  class="mr-4 mb-4"
                >
                  {{ item.childCode }}: 现有{{ item.childStock }}件
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="目标齐套度" width="120" align="center">
            <template #default="{ row }">
              <el-tag type="success" effect="dark" size="small">{{ row.targetSets }} 套</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="建议单独采购/备货明细" min-width="240">
            <template #default="{ row }">
              <div class="child-chips-preview">
                <el-tag
                  v-for="item in row.shortageItems"
                  :key="item.childCode"
                  type="warning"
                  effect="dark"
                  size="small"
                  class="mr-4 mb-4"
                >
                  + {{ item.suggestedQty }} 件 {{ item.childCode }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="齐套说明" min-width="280" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="text-secondary">{{ row.explanation }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 弹窗 1: 新增/编辑 跟踪 ASIN Dialog -->
    <el-dialog
      v-model="addAsinDialogVisible"
      :title="isEditAsin ? '编辑跟踪 ASIN 信息' : '手动新增跟踪 ASIN'"
      width="560px"
      destroy-on-close
    >
      <el-form :model="asinForm" label-width="120px" size="default">
        <el-form-item label="账号" required>
          <el-select v-model="asinForm.account" style="width: 100%;">
            <el-option label="MNE" value="MNE" />
            <el-option label="WKJ" value="WKJ" />
            <el-option label="YBS" value="YBS" />
            <el-option label="DW" value="DW" />
            <el-option label="BYH" value="BYH" />
          </el-select>
        </el-form-item>
        <el-form-item label="站点" required>
          <el-select v-model="asinForm.site" style="width: 100%;">
            <el-option label="US" value="US" />
          </el-select>
        </el-form-item>
        <el-form-item label="ASIN" required>
          <el-input v-model="asinForm.asin" placeholder="请输入 Amazon ASIN 编码 (如: B08N5WRWNW)" />
        </el-form-item>
        <el-form-item label="对应 SKU" required>
          <el-input v-model="asinForm.sku" placeholder="请输入销售 SKU / 亚马逊 SKU (如: SKU-US-00192)" />
        </el-form-item>
        <el-form-item label="物料编码" required>
          <el-select
            v-model="asinForm.materialCode"
            placeholder="请从父子物料绑定关系中选择物料编码"
            filterable
            allow-create
            style="width: 100%;"
          >
            <el-option
              v-for="item in bindingTableData"
              :key="item.parentCode"
              :label="item.parentCode + (item.productName ? ' (' + item.productName + ')' : '')"
              :value="item.parentCode"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="addAsinDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAsinForm">保存 ASIN 跟踪</el-button>
      </template>
    </el-dialog>

    <!-- 弹窗 2: 领星 Open API 对接配置 Dialog -->
    <el-dialog
      v-model="lingxingConfigDialogVisible"
      title="ERP Open API 捆绑物料接口对接设置"
      width="580px"
      destroy-on-close
    >
      <el-form label-width="150px" size="default">
        <el-form-item label="对接数据模式">
          <el-switch
            v-model="lingxingApiConfig.useRealHttp"
            active-text="真实 HTTP API 直连/代理"
            inactive-text="API 演示模式 (Mock)"
          />
        </el-form-item>
        <el-form-item label="ERP API Domain">
          <el-input v-model="lingxingApiConfig.baseUrl" placeholder="https://api.erp.com" />
        </el-form-item>
        <el-form-item label="App Key">
          <el-input v-model="lingxingApiConfig.appKey" placeholder="请输入开放平台 AppKey" />
        </el-form-item>
        <el-form-item label="App Secret">
          <el-input v-model="lingxingApiConfig.appSecret" type="password" show-password placeholder="请输入 AppSecret" />
        </el-form-item>
        <el-form-item label="捆绑物料 Endpoint">
          <el-input v-model="lingxingApiConfig.bundleEndpoint" placeholder="例如: /api/module/product/product.view/bundledLists" clearable />
        </el-form-item>
        <el-form-item label="前端代理前缀 (Proxy)">
          <el-input v-model="lingxingApiConfig.proxyUrl" placeholder="如: /api/lingxing (解决跨域)" />
        </el-form-item>
        <el-form-item label="自动同步频率">
          <el-select v-model="lingxingApiConfig.syncIntervalHours" style="width: 100%;">
            <el-option label="每 1 小时自动同步" :value="1" />
            <el-option label="每 2 小时自动同步 (推荐)" :value="2" />
            <el-option label="每 6 小时自动同步" :value="6" />
            <el-option label="每天定时同步" :value="24" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button icon="Connection" @click="handleTestLingxingAuth">测试 API 连通性</el-button>
        <el-button type="primary" @click="handleSaveLingxingConfig">保存接口设置</el-button>
      </template>
    </el-dialog>

    <!-- 弹窗 3: 粘贴领星接口响应 JSON 弹窗 -->
    <el-dialog
      v-model="pasteJsonDialogVisible"
      title="粘贴 DevTools 接口返回的响应 JSON 数据"
      width="640px"
      destroy-on-close
    >
      <div class="mb-10 text-secondary" style="font-size: 13px;">
        💡 请在浏览器开发者工具 (F12 ➔ Network) 中点击 <b>bundledLists</b> 接口，在 <b>Response / 响应</b> 页签下全选复制 JSON，粘贴在下方：
      </div>
      <el-input
        v-model="pastedJsonText"
        type="textarea"
        :rows="12"
        placeholder="请在此粘贴 bundledLists 接口返回的原生 JSON 内容..."
      />
      <template #footer>
        <el-button @click="pasteJsonDialogVisible = false">取消</el-button>
        <el-button type="primary" icon="Check" @click="handleParsePastedJson">解析并导入数据</el-button>
      </template>
    </el-dialog>

    <!-- 弹窗 4: 穿透算量弹窗 Dialog -->
    <el-dialog
      v-model="penetrateDialogVisible"
      :title="'父物料 [' + (activePenetrateRow?.parentMaterialCode || '') + '] BOM 穿透算量计算器'"
      width="680px"
      destroy-on-close
    >
      <div v-if="activePenetrateRow" class="penetrate-dialog-body">
        <div class="parent-info-card mb-16">
          <div class="info-row">
            <span><b>父物料编码：</b>{{ activePenetrateRow.parentMaterialCode }}</span>
            <span><b>SKU：</b>{{ activePenetrateRow.sku }}</span>
            <span><b>三方海外仓：</b>{{ activePenetrateRow.tpOverseasWh }} ({{ activePenetrateRow.warehouseName }})</span>
          </div>
        </div>

        <div class="formula-banner mb-16">
          <span class="formula-title">📐 BOM 穿透计算公式：</span>
          <span class="formula-desc">父物料穿透可售套数 = Min ( 子物料物理可售库存 ÷ 绑定配比用量 )</span>
        </div>

        <el-table :data="activePenetrateRow.childMaterials" border stripe size="small">
          <el-table-column label="子物料编码" prop="childCode" width="130" />
          <el-table-column label="子物料名称" prop="childName" min-width="150" show-overflow-tooltip />
          <el-table-column label="单套用量" prop="bomRatio" width="90" align="center" />
          <el-table-column label="物理可售" prop="availableQty" width="100" align="right" />
          <el-table-column label="可折算套数" width="110" align="right">
            <template #default="{ row }">
              <b :class="{ 'text-danger': Math.floor(row.availableQty / row.bomRatio) === activePenetrateRow.calculatedParentAvailable }">
                {{ Math.floor(row.availableQty / row.bomRatio) }} 套
              </b>
            </template>
          </el-table-column>
        </el-table>

        <div class="penetrate-summary-result mt-16">
          <span>最终父物料穿透汇总可售：<b class="result-num">{{ activePenetrateRow.calculatedParentAvailable }} 套</b></span>
        </div>
      </div>
    </el-dialog>

    <!-- 弹窗 5: 手动新增/编辑父子物料绑定关系 Dialog -->
    <el-dialog
      v-model="bindingDialogVisible"
      :title="isEditBinding ? '编辑父子物料 BOM 绑定关系' : '新增父子物料 BOM 绑定关系'"
      width="640px"
      destroy-on-close
    >
      <el-form :model="bindingForm" label-width="120px" size="default">
        <el-form-item label="父物料编码" required>
          <el-input v-model="bindingForm.parentCode" placeholder="如: MAT-P8801" />
        </el-form-item>
        <el-form-item label="产品名称" required>
          <el-input v-model="bindingForm.productName" placeholder="如: 多功能磁吸无线充电器 15W" />
        </el-form-item>
        <el-form-item label="组合类型" required>
          <el-select v-model="bindingForm.comboType" placeholder="请选择组合类型" style="width: 100%;">
            <el-option label="单品多量" value="单品多量" />
            <el-option label="单品多包" value="单品多包" />
            <el-option label="多品多包" value="多品多包" />
          </el-select>
        </el-form-item>

        <el-divider content-position="left">绑定子物料列表及用量配比</el-divider>

        <div v-for="(item, idx) in bindingForm.children" :key="idx" class="form-child-row mb-10">
          <el-input v-model="item.childCode" placeholder="子物料编码" style="width: 180px;" />
          <el-input v-model="item.childName" placeholder="子物料名称" style="width: 200px;" />
          <el-input-number v-model="item.ratio" :min="1" placeholder="配比" style="width: 100px;" />
          <el-button type="danger" icon="Delete" circle size="small" @click="handleRemoveChildForm(idx)" />
        </div>

        <el-button type="primary" plain icon="Plus" size="small" class="mt-10" @click="handleAddChildForm">
          添加子物料项
        </el-button>
      </el-form>

      <template #footer>
        <el-button @click="bindingDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveBinding">保存绑定</el-button>
      </template>
    </el-dialog>

    <!-- 弹窗 4: 新增/编辑 子物料物理库存明细 Dialog -->
    <el-dialog
      v-model="childStockDialogVisible"
      :title="isEditChildStock ? '编辑子物料物理库存明细' : '新增子物料物理库存盘点'"
      width="560px"
      destroy-on-close
    >
      <el-form :model="childStockForm" label-width="130px" size="default">
        <el-form-item label="子物料编码" required>
          <el-select
            v-if="!isEditChildStock"
            v-model="childStockForm.childCode"
            placeholder="请选择绑定关系中的子物料编码"
            filterable
            style="width: 100%;"
            @change="handleChildCodeSelectInForm"
          >
            <el-option
              v-for="c in allChildMaterialOptions"
              :key="c.childCode"
              :label="c.childCode + ' (' + c.childName + ')'"
              :value="c.childCode"
            />
          </el-select>
          <el-input v-else :value="childStockForm.childCode" disabled />
        </el-form-item>

        <el-form-item label="子物料名称" required>
          <el-input :value="childStockForm.childName" disabled placeholder="根据选择的子物料编码自动带出" />
        </el-form-item>

        <el-form-item label="三方海外仓" required>
          <el-select v-model="childStockForm.tpWh" filterable allow-create placeholder="请选择或输入三方海外仓" style="width: 100%;">
            <el-option label="西邮" value="西邮" />
            <el-option label="千亚" value="千亚" />
            <el-option label="环世" value="环世" />
            <el-option label="乐歌" value="乐歌" />
          </el-select>
        </el-form-item>

        <el-form-item label="物理仓库名称" required>
          <el-input v-model="childStockForm.whName" placeholder="请输入物理仓库名称 (如: 美西洛杉矶1仓)" />
        </el-form-item>

        <el-form-item label="物理可售库存" required>
          <el-input-number v-model="childStockForm.availableQty" :min="0" style="width: 100%;" />
        </el-form-item>

        <el-form-item label="物理在途库存" required>
          <el-input-number v-model="childStockForm.transitQty" :min="0" style="width: 100%;" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="childStockDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveChildStockForm">保存库存明细</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DataAnalysis, Timer, Refresh, Download, Goods, Box, Van, Odometer, Warning,
  Search, RefreshLeft, Connection, Promotion, Plus, Edit, Delete, Setting, CopyDocument, MagicStick, DocumentCopy
} from '@element-plus/icons-vue'
import {
  fetchLingxingBundleMaterials, testLingxingApiAuth, saveLingxingRawJsonData, LINGXING_API_CONFIG,
  type LingxingBundleMaterialRecord
} from '@/api/lingxing'
import {
  dbFetchAsinTracks, dbSaveAsinTrack, dbDeleteAsinTrack, dbBatchImportAsinTracks,
  dbFetchMaterialBindings, dbSaveMaterialBinding, dbDeleteMaterialBinding,
  dbFetchChildPhysicalStocks, dbUpdateChildStock, dbSaveChildPhysicalStock, dbDeleteChildPhysicalStock,
  dbFetchPenetratedKanbanData, dbFetchCompletenessAlerts, dbResetAllDataToDefault, dbClearAllData, initBackendStoreData,
  type AsinTrackRecord, type MaterialBindingRecord, type ChildPhysicalStockRecord,
  type ParentPenetrateKanbanRecord, type CompletenessAlertRecord
} from '@/api/sku-kanban-backend'

// 1. Tab 切换状态
const activeTab = ref('binding')

// 2. 看板选项卡筛选状态
const filterAccount = ref('全部')
const filterSite = ref('全部')
const filterTpOverseasWh = ref('全部')
const filterWarehouseName = ref('全部')
const searchKey = ref('')
const onlyShowBottleneck = ref(false)

// 3. 分页状态
const currentPage = ref(1)
const pageSize = ref(10)

// 4. 领星 API 对接与同步状态
const isSyncingFromLingxing = ref(false)
const lastLingxingSyncTime = ref('2026-09-14 12:15:00')
const lingxingConfigDialogVisible = ref(false)
const lingxingApiConfig = ref({ ...LINGXING_API_CONFIG })

const pasteJsonDialogVisible = ref(false)
const pastedJsonText = ref('')

// 5. ASIN 跟踪管理选项卡数据与状态
const asinFilterAccount = ref('全部')
const asinFilterSite = ref('全部')
const asinSearchKey = ref('')
const addAsinDialogVisible = ref(false)
const isEditAsin = ref(false)
const activeEditAsinIndex = ref(-1)

const asinForm = ref({
  account: 'Amazon-US-01',
  site: 'US',
  asin: '',
  sku: '',
  materialCode: '',
  status: '正常跟踪'
})

const asinTrackData = ref<AsinTrackRecord[]>([])

const getProductNameByMaterialCode = (materialCode: string) => {
  if (!materialCode) return '-'
  const match = bindingTableData.value.find(b => b.parentCode === materialCode)
  return match ? match.productName : '-'
}

const filteredAsinTrackData = computed(() => {
  return asinTrackData.value.filter(item => {
    if (asinFilterAccount.value && asinFilterAccount.value !== '全部' && item.account !== asinFilterAccount.value) return false
    if (asinFilterSite.value && asinFilterSite.value !== '全部' && item.site !== asinFilterSite.value) return false
    if (asinSearchKey.value) {
      const k = asinSearchKey.value.toLowerCase()
      const mAsin = item.asin.toLowerCase().includes(k)
      const mSku = item.sku.toLowerCase().includes(k)
      const mMat = item.materialCode.toLowerCase().includes(k)
      const mProd = getProductNameByMaterialCode(item.materialCode).toLowerCase().includes(k)
      if (!mAsin && !mSku && !mMat && !mProd) return false
    }
    return true
  })
})

// 6. 弹窗状态
const penetrateDialogVisible = ref(false)
const activePenetrateRow = ref<any>(null)

const bindingDialogVisible = ref(false)
const isEditBinding = ref(false)
const bindingForm = ref<{
  parentCode: string
  sku: string
  productName: string
  comboType: '单品多量' | '单品多包' | '多品多包'
  tpWh: string
  children: { childCode: string; childName: string; ratio: number }[]
}>({
  parentCode: '',
  sku: '',
  productName: '',
  comboType: '单品多量',
  tpWh: '万邑通',
  children: [
    { childCode: '', childName: '', ratio: 1 }
  ]
})

const comboTypeFilter = ref('全部')
const bindingSearchKey = ref('')
const bindingTableData = ref<MaterialBindingRecord[]>([])

const countSingleQty = computed(() => bindingTableData.value.filter(b => (b.comboType || '单品多量') === '单品多量').length)
const countSinglePkg = computed(() => bindingTableData.value.filter(b => b.comboType === '单品多包').length)
const countMultiPkg = computed(() => bindingTableData.value.filter(b => b.comboType === '多品多包').length)

const filteredBindingTableData = computed(() => {
  return bindingTableData.value.filter(item => {
    if (comboTypeFilter.value !== '全部' && (item.comboType || '单品多量') !== comboTypeFilter.value) {
      return false
    }
    if (bindingSearchKey.value) {
      const k = bindingSearchKey.value.toLowerCase()
      const mParent = item.parentCode.toLowerCase().includes(k)
      const mName = item.productName.toLowerCase().includes(k)
      const mChild = item.boundChildren?.some(c => c.childCode.toLowerCase().includes(k) || c.childName.toLowerCase().includes(k))
      if (!mParent && !mName && !mChild) return false
    }
    return true
  })
})

// 核心 dynamic KPI 计算属性
const totalAsinCount = computed(() => asinTrackData.value.length)
const totalParentCount = computed(() => bindingTableData.value.length)
const totalParentAvailable = computed(() => rawKanbanData.value.reduce((sum, item) => sum + (item.calculatedParentAvailable || 0), 0))
const totalChildStockQty = computed(() => childPhysicalStockData.value.reduce((sum, item) => sum + (item.availableQty || 0), 0))
const totalParentTransit = computed(() => rawKanbanData.value.reduce((sum, item) => sum + (item.calculatedParentTransit || 0), 0))
const totalChildTransitQty = computed(() => childPhysicalStockData.value.reduce((sum, item) => sum + (item.transitQty || 0), 0))
const completenessAlertCount = computed(() => completenessAlertData.value.length)

// 动态下拉筛选项
const accountOptions = computed(() => {
  const set = new Set<string>(['MNE', 'WKJ', 'YBS', 'DW', 'BYH'])
  asinTrackData.value.forEach(a => { if (a.account) set.add(a.account) })
  rawKanbanData.value.forEach(k => { if (k.account) set.add(k.account) })
  return Array.from(set)
})

const tpWhOptions = computed(() => {
  const set = new Set<string>(['西邮', '千亚', '环世', '乐歌'])
  childPhysicalStockData.value.forEach(c => { if (c.tpWh) set.add(c.tpWh) })
  rawKanbanData.value.forEach(k => { if (k.tpOverseasWh) set.add(k.tpOverseasWh) })
  return Array.from(set)
})

const warehouseNameOptions = computed(() => {
  const set = new Set<string>()
  childPhysicalStockData.value.forEach(c => { if (c.whName) set.add(c.whName.trim()) })
  rawKanbanData.value.forEach(k => { if (k.warehouseName) set.add(k.warehouseName.trim()) })
  return Array.from(set)
})

// 8. 子物料物理库存明细选项卡数据
const childPhysicalStockData = ref<ChildPhysicalStockRecord[]>([])

// 9. 齐套缺料预警数据
const completenessAlertData = ref<CompletenessAlertRecord[]>([])

// 10. 看板穿透算量后台数据
const rawKanbanData = ref<ParentPenetrateKanbanRecord[]>([])

// 全局加载与初始化后台数据方法
const refreshAllBackendData = async () => {
  await initBackendStoreData()
  asinTrackData.value = await dbFetchAsinTracks()
  bindingTableData.value = await dbFetchMaterialBindings()
  childPhysicalStockData.value = await dbFetchChildPhysicalStocks()
  rawKanbanData.value = await dbFetchPenetratedKanbanData()
  completenessAlertData.value = await dbFetchCompletenessAlerts()
}

const handleRecoverHistoryData = async () => {
  const result = await initBackendStoreData()
  await refreshAllBackendData()
  ElMessage.success(`历史数据恢复完成！重新检测并合并 ASIN 跟踪: ${result.asinCount} 条，绑定关系: ${result.bindingCount} 条，子物料物理库存: ${result.stockCount} 条。已持久化到磁盘中。`)
}

onMounted(async () => {
  await refreshAllBackendData()
})

const filteredTableData = computed(() => {
  return rawKanbanData.value.filter(item => {
    if (onlyShowBottleneck.value) {
      if (!item.bottleneckChild) return false
      const availSets = item.calculatedParentAvailable
      const otherMaxSets = item.childMaterials.length > 1
        ? Math.max(...item.childMaterials.map(c => Math.floor(c.availableQty / c.bomRatio)))
        : availSets
      if (otherMaxSets <= availSets) return false
    }
    if (filterAccount.value && filterAccount.value !== '全部' && item.account !== filterAccount.value) return false
    if (filterSite.value && filterSite.value !== '全部' && item.site !== filterSite.value) return false
    if (filterTpOverseasWh.value && filterTpOverseasWh.value !== '全部' && item.tpOverseasWh !== filterTpOverseasWh.value) return false
    if (filterWarehouseName.value && filterWarehouseName.value !== '全部' && item.warehouseName !== filterWarehouseName.value) return false
    if (searchKey.value) {
      const k = searchKey.value.toLowerCase()
      const mParent = item.parentMaterialCode.toLowerCase().includes(k)
      const mSku = item.sku.toLowerCase().includes(k)
      const mAsin = item.asin.toLowerCase().includes(k)
      const mName = item.productName.toLowerCase().includes(k)
      const mChild = item.childMaterials.some((c: any) => c.childCode.toLowerCase().includes(k) || c.childName.toLowerCase().includes(k))
      if (!mParent && !mSku && !mAsin && !mName && !mChild) return false
    }
    return true
  })
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredTableData.value.slice(start, start + pageSize.value)
})

// 复制通用方法
const handleCopyText = (text: string, label = '内容') => {
  if (!text) return
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      ElMessage.success(`已成功复制${label}：${text}`)
    }).catch(() => {
      fallbackCopyText(text, label)
    })
  } else {
    fallbackCopyText(text, label)
  }
}

const fallbackCopyText = (text: string, label: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.select()
  try {
    document.execCommand('copy')
    ElMessage.success(`已成功复制${label}：${text}`)
  } catch (err) {
    ElMessage.error(`复制${label}失败`)
  }
  document.body.removeChild(textArea)
}

// 11. ASIN 跟踪管理方法

const handleOpenAddAsinModal = () => {
  isEditAsin.value = false
  activeEditAsinIndex.value = -1
  asinForm.value = { account: 'MNE', site: 'US', asin: '', sku: '', materialCode: '', status: '正常跟踪' }
  addAsinDialogVisible.value = true
}

const handleEditAsinTrack = (row: AsinTrackRecord) => {
  isEditAsin.value = true
  const idx = asinTrackData.value.findIndex(item => item.asin === row.asin && item.sku === row.sku)
  activeEditAsinIndex.value = idx
  asinForm.value = { account: row.account, site: row.site, asin: row.asin, sku: row.sku, materialCode: row.materialCode, status: row.status }
  addAsinDialogVisible.value = true
}

const handleSaveAsinForm = async () => {
  if (!asinForm.value.asin || !asinForm.value.sku || !asinForm.value.materialCode) {
    ElMessage.warning('请填写 ASIN、SKU 和物料编码')
    return
  }

  const siteMap: Record<string, string> = { US: '🇺🇸', DE: '🇩🇪', UK: '🇬🇧', JP: '🇯🇵', CA: '🇨🇦' }
  const flag = siteMap[asinForm.value.site] || '🌐'

  await dbSaveAsinTrack({
    account: asinForm.value.account,
    site: asinForm.value.site,
    countryFlag: flag,
    asin: asinForm.value.asin,
    sku: asinForm.value.sku,
    materialCode: asinForm.value.materialCode,
    status: asinForm.value.status as any,
    addTime: new Date().toLocaleString().slice(0, 16)
  })

  await refreshAllBackendData()
  addAsinDialogVisible.value = false
  ElMessage.success(`跟踪 ASIN [${asinForm.value.asin}] 已成功保存并持久化到后台！`)
}

const handleDeleteAsinTrack = (row: AsinTrackRecord) => {
  ElMessageBox.confirm(`确定取消对 ASIN [${row.asin}] (SKU: ${row.sku}) 的跟踪吗？`, '取消跟踪', { confirmButtonText: '确定取消', cancelButtonText: '关闭', type: 'warning' })
    .then(async () => {
      await dbDeleteAsinTrack(row.asin, row.sku)
      await refreshAllBackendData()
      ElMessage.success(`已成功取消 ASIN [${row.asin}] 的跟踪！`)
    }).catch(() => {})
}

const handleBatchImportAsin = async () => {
  const sampleImport: Partial<AsinTrackRecord>[] = [
    { account: 'Amazon-US-02', site: 'US', asin: 'B089K888XX', sku: 'SKU-US-00999', materialCode: 'MAT-P9999', status: '正常跟踪' }
  ]
  const count = await dbBatchImportAsinTracks(sampleImport)
  await refreshAllBackendData()
  ElMessage.success(`成功批量导入 ${count} 条 ASIN 跟踪记录！`)
}

// 12. 领星 API 同步对接逻辑
const handleSyncFromLingxing = async () => {
  isSyncingFromLingxing.value = true
  try {
    const res = await fetchLingxingBundleMaterials(undefined, lingxingApiConfig.value)
    if (res.code === 200 && res.data?.list) {
      for (const item of res.data.list) {
        await dbSaveMaterialBinding({
          parentCode: item.comboSku,
          sku: item.sku,
          productName: item.comboName,
          tpWh: item.tpWh,
          status: item.status,
          updateTime: item.updateTime,
          boundChildren: item.subItems.map(s => ({ childCode: s.subSku, childName: s.subName, ratio: s.qty }))
        })
      }
      await refreshAllBackendData()
      lastLingxingSyncTime.value = new Date().toLocaleString()
      const modeText = lingxingApiConfig.value.useRealHttp ? 'ERP 真实 API' : 'ERP Open API'
      ElMessage.success(`成功从 ${modeText} [${lingxingApiConfig.value.bundleEndpoint}] 同步 ${res.data.list.length} 条捆绑物料 BOM！已自动更新后台持久化数据。`)
    }
  } catch (err) {
    ElMessage.error('调用 ERP Open API 同步失败，请检查网络或 API Key 设置')
  } finally {
    isSyncingFromLingxing.value = false
  }
}

const handleOpenLingxingConfig = () => {
  lingxingConfigDialogVisible.value = true
}

const handleOpenPasteJsonDialog = () => {
  pastedJsonText.value = ''
  pasteJsonDialogVisible.value = true
}

const handleParsePastedJson = async () => {
  if (!pastedJsonText.value.trim()) {
    ElMessage.warning('请先粘贴 bundledLists 接口返回的 JSON 内容')
    return
  }

  const parsed = saveLingxingRawJsonData(pastedJsonText.value)
  if (parsed && parsed.length > 0) {
    for (const item of parsed) {
      await dbSaveMaterialBinding({
        parentCode: item.comboSku,
        sku: item.sku,
        productName: item.comboName,
        tpWh: item.tpWh,
        status: item.status,
        updateTime: item.updateTime,
        boundChildren: item.subItems.map(s => ({ childCode: s.subSku, childName: s.subName, ratio: s.qty }))
      })
    }
    await refreshAllBackendData()
    lastLingxingSyncTime.value = new Date().toLocaleString()
    pasteJsonDialogVisible.value = false
    ElMessage.success(`成功解析并导入 ${parsed.length} 条捆绑物料 BOM 数据到后台数据库！海外仓存量已重新计算。`)
  } else {
    ElMessage.error('JSON 解析失败，请确认粘贴的内容是从领星 DevTools 网络响应中复制的完整 JSON 格式。')
  }
}

const handleTestLingxingAuth = async () => {
  const res = await testLingxingApiAuth(lingxingApiConfig.value)
  if (res.success) {
    ElMessage.success(res.message)
  } else {
    ElMessage.error('ERP API 鉴权失败: ' + res.message)
  }
}

const handleSaveLingxingConfig = () => {
  lingxingConfigDialogVisible.value = false
  ElMessage.success('ERP API 认证参数设置保存成功！')
}

// 13. 其他通用方法与后台同步
const handleTabChange = (name: any) => {
  refreshAllBackendData()
  ElMessage.info(`切换至: ${name === 'kanban' ? 'SKU海外仓库存看板' : name === 'asinTrack' ? 'ASIN 跟踪管理' : name === 'binding' ? '父子物料绑定关系' : name === 'childStock' ? '子物料物理库存明细' : '穿透齐套与缺料预警'}`)
}

const handleSearch = () => { currentPage.value = 1; ElMessage.success('已筛选数据') }
const handleReset = () => {
  filterAccount.value = '全部'; filterSite.value = '全部'; filterTpOverseasWh.value = '全部'; filterWarehouseName.value = '全部'
  searchKey.value = ''; onlyShowBottleneck.value = false; currentPage.value = 1; ElMessage.info('已重置筛选条件')
}
const handleRefresh = async () => {
  await refreshAllBackendData()
  ElMessage.success('已刷新最新后台持久化数据')
}
const handleResetDatabase = async () => {
  ElMessageBox.confirm('确定要彻底清空系统中的所有数据（ASIN跟踪、父子绑定、物理库存）吗？清空后您可以重新手动添加。', '清空所有数据', { confirmButtonText: '确定清空', cancelButtonText: '取消', type: 'warning' })
    .then(async () => {
      dbClearAllData()
      await refreshAllBackendData()
      ElMessage.success('系统所有数据已彻底清空！您可以开始全新添加数据。')
    }).catch(() => {})
}

const handleExport = () => { ElMessage.success('正在导出当前 Tab 对应的数据表 Excel...') }
const handlePenetrateDetail = (row: any) => { activePenetrateRow.value = row; penetrateDialogVisible.value = true }
const handleApplyRestock = (row: any) => {
  ElMessageBox.prompt(`正在为父物料 [${row.parentMaterialCode}] 发起补货申请:`, '发起补货申请', { confirmButtonText: '提交', cancelButtonText: '取消', inputValue: '1000' })
    .then(({ value }) => { ElMessage.success(`已提交补货 ${value} 件！`) }).catch(() => {})
}
const handleBatchAnalysis = () => { ElMessage.success('已完成齐套分析') }

// 绑定管理方法
const handleViewBomDetail = (row: any) => {
  const childCount = row.boundChildren ? row.boundChildren.length : 0
  if (childCount === 0) {
    ElMessage.warning(`父 SKU [${row.parentCode}] 当前未绑定任何子 SKU，可点击“编辑”进行绑定`)
  } else {
    ElMessage.info(`请点击行首 [+] 展开查看父 SKU [${row.parentCode}] 绑定的 ${childCount} 款子 SKU BOM 明细`)
  }
}

const handleEditParentBindingFromKanban = (row: any) => {
  const existing = bindingTableData.value.find(b => b.parentCode === row.parentMaterialCode)
  if (existing) {
    handleEditBinding(existing)
  } else {
    isEditBinding.value = false
    bindingForm.value = {
      parentCode: row.parentMaterialCode,
      sku: row.sku,
      productName: row.productName,
      comboType: '单品多量',
      tpWh: row.tpOverseasWh || '万邑通',
      children: row.childMaterials ? row.childMaterials.map((c: any) => ({ childCode: c.childCode, childName: c.childName, ratio: c.bomRatio })) : [{ childCode: '', childName: '', ratio: 1 }]
    }
    bindingDialogVisible.value = true
  }
}

const handleOpenAddBinding = () => {
  isEditBinding.value = false
  bindingForm.value = { parentCode: '', sku: '', productName: '', comboType: '单品多量', tpWh: '万邑通', children: [{ childCode: '', childName: '', ratio: 1 }] }
  bindingDialogVisible.value = true
}

const handleEditBinding = (row: MaterialBindingRecord) => {
  isEditBinding.value = true
  bindingForm.value = {
    parentCode: row.parentCode,
    sku: row.sku,
    productName: row.productName,
    comboType: row.comboType || '单品多量',
    tpWh: row.tpWh,
    children: row.boundChildren.map(b => ({ ...b }))
  }
  bindingDialogVisible.value = true
}

const handleAddChildForm = () => { bindingForm.value.children.push({ childCode: '', childName: '', ratio: 1 }) }
const handleRemoveChildForm = (idx: number) => { bindingForm.value.children.splice(idx, 1) }

const handleSaveBinding = async () => {
  if (!bindingForm.value.parentCode) {
    ElMessage.warning('请填写父物料编码')
    return
  }

  await dbSaveMaterialBinding({
    parentCode: bindingForm.value.parentCode,
    sku: bindingForm.value.sku,
    productName: bindingForm.value.productName || '多功能组装件',
    comboType: bindingForm.value.comboType,
    tpWh: bindingForm.value.tpWh,
    status: bindingForm.value.children.length > 0 ? '已绑定' : '未绑定',
    updateTime: new Date().toLocaleString(),
    boundChildren: bindingForm.value.children.map(c => ({ childCode: c.childCode, childName: c.childName || c.childCode, ratio: c.ratio || 1 }))
  })

  await refreshAllBackendData()
  bindingDialogVisible.value = false
  ElMessage.success(`成功保存父物料 [${bindingForm.value.parentCode}] 的 BOM 绑定关系与组合类型 [${bindingForm.value.comboType}]！`)
}

const handleUnbind = (row: MaterialBindingRecord) => {
  ElMessageBox.confirm(`确定要解除父物料 [${row.parentCode}] 的子物料 BOM 绑定关系吗？`, '解绑确认', { confirmButtonText: '确定解绑', cancelButtonText: '取消', type: 'warning' })
    .then(async () => {
      await dbDeleteMaterialBinding(row.parentCode)
      await refreshAllBackendData()
      ElMessage.success(`已成功解除 [${row.parentCode}] 的绑定关系`)
    }).catch(() => {})
}

// 从父子物料绑定关系中提取所有可供选择的子物料
const allChildMaterialOptions = computed(() => {
  const list: { childCode: string; childName: string }[] = []
  const seen = new Set<string>()
  bindingTableData.value.forEach(parent => {
    if (parent.boundChildren) {
      parent.boundChildren.forEach(child => {
        if (child.childCode && !seen.has(child.childCode)) {
          seen.add(child.childCode)
          list.push({
            childCode: child.childCode,
            childName: child.childName
          })
        }
      })
    }
  })
  return list
})

const childStockDialogVisible = ref(false)
const isEditChildStock = ref(false)
const childStockForm = ref<{
  id?: string
  childCode: string
  childName: string
  tpWh: string
  whName: string
  availableQty: number
  transitQty: number
}>({
  childCode: '',
  childName: '',
  tpWh: '万邑通',
  whName: '美西洛杉矶1仓',
  availableQty: 0,
  transitQty: 0
})

const handleChildCodeSelectInForm = (code: string) => {
  const match = allChildMaterialOptions.value.find(c => c.childCode === code)
  if (match) {
    childStockForm.value.childName = match.childName
  }
}

const handleNewChildStock = () => {
  isEditChildStock.value = false
  const defaultOption = allChildMaterialOptions.value[0]
  childStockForm.value = {
    childCode: defaultOption ? defaultOption.childCode : '',
    childName: defaultOption ? defaultOption.childName : '',
    tpWh: '万邑通',
    whName: '美西洛杉矶1仓',
    availableQty: 100,
    transitQty: 0
  }
  childStockDialogVisible.value = true
}

const handleCopyRowChildStock = (row: ChildPhysicalStockRecord) => {
  isEditChildStock.value = false
  childStockForm.value = {
    id: undefined,
    childCode: row.childCode,
    childName: row.childName,
    tpWh: row.tpWh || '西邮',
    whName: row.whName,
    availableQty: row.availableQty,
    transitQty: row.transitQty
  }
  childStockDialogVisible.value = true
  ElMessage.info(`已自动带出行数据 [${row.childCode}]，调整后点击保存即可新增为新明细。`)
}

const handleEditChildStockModal = (row: ChildPhysicalStockRecord) => {
  isEditChildStock.value = true
  childStockForm.value = {
    id: row.id,
    childCode: row.childCode,
    childName: row.childName,
    tpWh: row.tpWh || '万邑通',
    whName: row.whName || '美西洛杉矶1仓',
    availableQty: row.availableQty,
    transitQty: row.transitQty
  }
  childStockDialogVisible.value = true
}

const handleSaveChildStockForm = async () => {
  if (!childStockForm.value.childCode) {
    ElMessage.warning('请选择子物料编码')
    return
  }
  await dbSaveChildPhysicalStock({
    id: childStockForm.value.id,
    childCode: childStockForm.value.childCode,
    childName: childStockForm.value.childName,
    tpWh: childStockForm.value.tpWh,
    whName: childStockForm.value.whName,
    availableQty: childStockForm.value.availableQty,
    transitQty: childStockForm.value.transitQty
  })
  await refreshAllBackendData()
  childStockDialogVisible.value = false
  ElMessage.success(`子物料 [${childStockForm.value.childCode}] 物理库存明细已保存！`)
}

const handleDeleteChildStock = (row: ChildPhysicalStockRecord) => {
  ElMessageBox.confirm(`确定删除子物料 [${row.childCode}] 的物理库存明细记录吗？`, '删除确定', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await dbDeleteChildPhysicalStock(row.id || row.childCode)
    await refreshAllBackendData()
    ElMessage.success(`已删除子物料 [${row.childCode}] 的物理库存明细！`)
  }).catch(() => {})
}

const handleEmergencyRestock = async (row: CompletenessAlertRecord) => {
  const targetStock = row.otherMaxStock
  await dbUpdateChildStock(row.bottleneckChildCode, targetStock)
  await refreshAllBackendData()
  ElMessage.success(`已为短板子物料 [${row.bottleneckChildCode}] 紧急加补 ${row.suggestedQty} 件，缺料告警已接触！`)
}
</script>

<style lang="scss" scoped>
.sku-kanban-page {
  padding: 20px; background: #f8fafc; height: calc(100vh - 48px); overflow-y: auto; box-sizing: border-box; display: flex; flex-direction: column;
}

.mb-10 { margin-bottom: 10px; }
.mb-12 { margin-bottom: 12px; }
.mb-16 { margin-bottom: 16px; }
.mb-20 { margin-bottom: 20px; }
.mt-10 { margin-top: 10px; }
.mt-16 { margin-top: 16px; }
.ml-4 { margin-left: 4px; }

// 顶部 Header
.dashboard-header-card {
  background: #ffffff; border-radius: 14px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  .header-title-bar {
    display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px dashed #e2e8f0; margin-bottom: 16px;
    .title-left {
      display: flex; align-items: center; gap: 12px;
      .icon-wrapper { width: 40px; height: 40px; background: rgba(59, 130, 246, 0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; .header-icon { font-size: 22px; color: #3b82f6; } }
      .title-text-group { display: flex; flex-direction: column; .main-title { font-size: 18px; font-weight: 700; color: #1e293b; } .sub-title { font-size: 12px; color: #64748b; } }
    }
    .title-right { display: flex; align-items: center; gap: 12px; .update-tag { font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 4px; } }
  }

  .kpi-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
    .kpi-card {
      background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px; padding: 14px; transition: all 0.2s ease;
      &:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04); background: #ffffff; }
      .kpi-inner {
        display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;
        .kpi-content {
          .kpi-label { font-size: 12px; color: #64748b; font-weight: 500; }
          .kpi-value-row { margin-top: 4px; display: flex; align-items: baseline; gap: 4px; .kpi-value { font-size: 22px; font-weight: 800; color: #0f172a; font-family: 'DIN Alternate', -apple-system, sans-serif; &.danger-text { color: #ef4444; } } .kpi-unit { font-size: 11px; color: #94a3b8; } }
        }
        .kpi-icon-box { width: 34px; height: 34px; border-radius: 8px; background: rgba(59, 130, 246, 0.08); color: #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 18px; &.danger-icon { background: rgba(239, 68, 68, 0.1); color: #ef4444; } }
      }
      .kpi-sub-info { font-size: 11px; display: flex; gap: 8px; .badge-active { color: #10b981; font-weight: 500; } .badge-warn { color: #f59e0b; font-weight: 500; } .badge-danger { color: #ef4444; font-weight: 600; } .text-secondary { color: #64748b; } .text-blue { color: #3b82f6; } .text-green { color: #10b981; } }
    }
  }
}

// 页面 Tabs 卡片样式
.tabs-container-card {
  background: #ffffff; border-radius: 12px; padding: 12px 16px 0 16px; border: 1px solid #e2e8f0;
  :deep(.custom-tabs) {
    .el-tabs__header { margin-bottom: 0; border-bottom: none; }
    .el-tabs__nav { border: none !important; gap: 8px; }
    .el-tabs__item {
      border: 1px solid #e2e8f0 !important; border-radius: 8px 8px 0 0 !important; background: #f8fafc; font-weight: 600; font-size: 13px; color: #64748b; padding: 0 20px !important; height: 40px; transition: all 0.2s;
      &:hover { color: #3b82f6; background: #ffffff; }
      &.is-active { background: #ffffff !important; border-color: #3b82f6 !important; border-bottom-color: #ffffff !important; color: #3b82f6 !important; }
    }
  }
  .tab-label-inner { display: flex; align-items: center; gap: 6px; }
  .tab-badge { margin-left: 4px; :deep(.el-badge__content) { border: none; font-size: 10px; height: 16px; line-height: 16px; padding: 0 4px; } }
}

.tab-content { display: flex; flex-direction: column; flex: 1; }

// 筛选 Card
.filter-panel-card {
  background: #ffffff; border-radius: 12px; padding: 14px 20px; border: 1px solid #e2e8f0;
  .filter-row {
    display: flex; align-items: center; flex-wrap: wrap; gap: 16px;
    .filter-group { display: flex; align-items: center; gap: 6px; .filter-label { font-size: 13px; color: #475569; font-weight: 500; white-space: nowrap; } }
    .filter-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
  }
}

// 主表格 Card
.main-content-card {
  background: #ffffff; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; flex: 1; display: flex; flex-direction: column;
  .table-toolbar {
    display: flex; justify-content: space-between; align-items: center;
    .toolbar-left { .result-count { font-size: 13px; color: #64748b; b { color: #3b82f6; } } }
    .toolbar-right { display: flex; align-items: center; gap: 16px; }
  }
  .table-container { flex: 1; display: flex; flex-direction: column; }
  .card-title-bar { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; color: #1e293b; .icon { font-size: 18px; } }
}

// 基础单元格样式
.site-tag { font-size: 12px; font-weight: 600; color: #1e293b; .flag { font-size: 14px; } }
.code-link { color: #2563eb; font-weight: 600; font-family: monospace; }
.code-bold { font-weight: 700; color: #0f172a; font-family: monospace; }

.parent-mat-cell {
  display: flex; align-items: center; gap: 6px;
  .parent-badge { padding: 0 4px; font-size: 10px; height: 18px; }
  .parent-code { font-weight: 700; color: #d97706; font-family: monospace; }
}

.child-code { font-weight: 700; color: #059669; font-family: monospace; }

.prod-name-cell {
  display: flex; align-items: center; gap: 8px;
  .prod-img { width: 32px; height: 32px; border-radius: 4px; border: 1px solid #e2e8f0; flex-shrink: 0; }
  .name-text { font-size: 12px; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
}

.penetrate-stock-cell { display: flex; align-items: center; justify-content: flex-end; gap: 6px; .penetrate-tag { font-size: 10px; height: 18px; padding: 0 4px; border-radius: 4px; } }

.num-bold { font-weight: 700; color: #0f172a; }
.num-blue { font-weight: 600; color: #2563eb; }
.text-danger { color: #ef4444; font-weight: 700; }
.text-muted { color: #94a3b8; }
.text-primary { color: #2563eb; }
.text-secondary { color: #64748b; }
.text-green { color: #10b981; }
.font-bold { font-weight: 700; }

.child-summary-box {
  display: flex; flex-direction: column; gap: 2px;
  .child-count { font-size: 12px; color: #64748b; font-weight: 500; }
  .bottleneck-tag-row {
    font-size: 11px; display: flex; align-items: center; gap: 4px;
    .bottleneck-label { color: #ef4444; font-weight: 700; }
    .bottleneck-code { color: #991b1b; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
  }
}

.expand-wrapper {
  padding: 12px 16px; background: #fafafa; border-radius: 8px; border: 1px solid #f0f0f0;
  .expand-header {
    display: flex; justify-content: space-between; align-items: center; font-size: 13px;
    .expand-title { display: flex; align-items: center; gap: 6px; color: #334155; b { color: #0f172a; } }
    .expand-total { font-size: 12px; color: #64748b; .bottleneck-info { margin-left: 8px; } }
  }
  .sub-wh-dist {
    display: flex; flex-wrap: wrap; gap: 4px;
    .dist-pill { font-size: 11px; background: #f1f5f9; color: #475569; padding: 1px 6px; border-radius: 4px; &.current { background: #dcfce7; color: #15803d; font-weight: 600; } }
  }
}

.child-chips-preview {
  display: flex; flex-wrap: wrap; gap: 4px; align-items: center;
  :deep(.el-tag) { font-family: monospace; font-size: 11px; }
}

.mr-4 { margin-right: 4px; }
.mb-4 { margin-bottom: 4px; }

.combo-type-tabs {
  margin-left: 12px;
}

.form-child-row { display: flex; align-items: center; gap: 10px; }

.formula-banner {
  background: #f0f7ff; border: 1px solid #d0e1fd; border-radius: 6px; padding: 6px 12px; font-size: 11px; color: #1e40af; display: inline-flex; align-items: center; gap: 4px;
  .formula-title { font-weight: 700; color: #1d4ed8; }
  .formula-desc { font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #2563eb; b { font-weight: 800; color: #1d4ed8; margin: 0 4px; font-size: 13px; } }
  &.mini { padding: 4px 10px; font-size: 11px; border-radius: 6px; display: inline-flex; width: fit-content; }
}

.penetrate-dialog-body {
  .parent-info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; .info-row { display: flex; gap: 16px; font-size: 13px; color: #334155; } }
  .formula-banner { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #1d4ed8; .formula-title { font-weight: 700; } }
  .penetrate-summary-result { text-align: right; font-size: 14px; color: #1e293b; .result-num { font-size: 18px; color: #2563eb; } }
}

.pagination-wrapper { display: flex; justify-content: flex-end; }
</style>
