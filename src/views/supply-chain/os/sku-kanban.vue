<template>
  <div class="sku-kanban-page custom-scrollbar">


    <!-- 顶部 Tab 页签导航 (现代化沉浸胶囊分段风格) -->
    <!-- 顶部 Tab 页签导航 (下划线指示风格，参考示例图) -->
    <div class="tabs-container-card">
      <el-tabs v-model="activeTab" class="custom-tabs" @tab-change="handleTabChange">
        <el-tab-pane label="父子物料绑定关系" name="binding" />
        <el-tab-pane label="ASIN 跟踪管理" name="asinTrack" />
        <el-tab-pane label="子物料库存明细" name="childStock" />
        <el-tab-pane label="SKU海外仓库存看板" name="kanban" />
        <el-tab-pane name="completeness">
          <template #label>
            <span class="tab-label-inner">
              <span>穿透齐套与缺料预警</span>
              <span class="tab-badge-alert" v-if="completenessAlertCount > 0">
                {{ completenessAlertCount }}
              </span>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 选项卡 1: SKU海外仓库存看板 -->
    <div v-if="activeTab === 'kanban'" class="tab-content">
      <!-- 多维筛选区 (统一标准 filter-panel-card 风格) -->
      <div class="filter-panel-card mb-20">
        <div class="filter-row">
          <div class="filter-group">
            <span class="filter-label">账号:</span>
            <el-select v-model="filterAccount" placeholder="全部账号" size="small" clearable style="width: 130px;">
              <el-option label="全部账号" value="全部" />
              <el-option v-for="acc in accountOptions" :key="acc" :label="acc" :value="acc" />
            </el-select>
          </div>

          <div class="filter-group">
            <span class="filter-label">站点:</span>
            <el-select v-model="filterSite" placeholder="全部站点" size="small" clearable style="width: 100px;">
              <el-option label="全部" value="全部" />
              <el-option label="🇺🇸 US" value="US" />
            </el-select>
          </div>

          <div class="filter-group">
            <span class="filter-label">三方海外仓:</span>
            <el-select
              v-model="filterTpOverseasWh"
              placeholder="全部海外仓"
              size="small"
              clearable
              style="width: 120px;"
              @change="() => { filterWarehouseName = '全部' }"
            >
              <el-option label="全部海外仓" value="全部" />
              <el-option v-for="tp in tpWhOptions" :key="tp" :label="tp" :value="tp" />
            </el-select>
          </div>

          <div class="filter-group">
            <span class="filter-label">仓库名称:</span>
            <el-select
              v-model="filterWarehouseName"
              placeholder="全部仓库"
              size="small"
              clearable
              style="width: 145px;"
            >
              <el-option label="全部仓库" value="全部" />
              <el-option v-for="wh in warehouseNameOptions" :key="wh" :label="wh" :value="wh" />
            </el-select>
          </div>

          <div class="filter-group search-input-box">
            <el-input
              v-model="searchKey"
              placeholder="搜索 父/子物料编码 / SKU / ASIN..."
              prefix-icon="Search"
              clearable
              size="small"
              style="width: 260px;"
              @keyup.enter="handleSearch"
            />
          </div>

          <div class="filter-actions flex-center">
            <el-button type="primary" plain icon="Search" size="small" @click="handleSearch">
              查询
            </el-button>
            <el-button plain icon="RefreshRight" size="small" @click="handleReset">
              重置
            </el-button>
          </div>
        </div>
      </div>

      <!-- 主数据表格 -->
      <div class="main-content-card">

        <div class="table-container">
          <el-table
            :data="paginatedData"
            border
            stripe
            highlight-current-row
            show-summary
            :summary-method="getKanbanSummary"
            size="default"
            style="width: 100%;"
          >
            <!-- 各海外仓库存已升级为弹窗展示 (方案三: 分仓明细弹窗) -->

            <!-- 1. 平台 -->
            <el-table-column label="平台" prop="platform" width="95" align="center">
              <template #default="{ row }">
                <el-tag size="small" type="info" effect="plain">{{ row.platform || 'Amazon' }}</el-tag>
              </template>
            </el-table-column>

            <!-- 2. 账号 -->
            <el-table-column label="账号" prop="account" width="65" align="center" show-overflow-tooltip />

            <!-- 3. 站点 -->
            <el-table-column label="站点" prop="site" width="60" align="center">
              <template #default="{ row }">
                <span class="site-tag">{{ row.site }}</span>
              </template>
            </el-table-column>

            <!-- 4. ASIN -->
            <el-table-column label="ASIN" prop="asin" width="118" show-overflow-tooltip>
              <template #default="{ row }">
                <div class="flex-center">
                  <span class="code-link mr-4">{{ row.asin }}</span>
                  <el-tooltip content="复制 ASIN" placement="top" :hide-after="1000">
                    <el-button
                      type="primary"
                      link
                      size="small"
                      icon="CopyDocument"
                      class="copy-btn"
                      @click.stop="handleCopyText(row.asin, 'ASIN')"
                    />
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>

            <!-- 5. 销售SKU -->
            <el-table-column label="销售SKU" prop="sku" min-width="145" show-overflow-tooltip>
              <template #default="{ row }">
                <div class="flex-center">
                  <span class="font-mono font-bold mr-4">{{ row.sku }}</span>
                  <el-tooltip content="复制销售SKU" placement="top" :hide-after="1000">
                    <el-button
                      type="primary"
                      link
                      size="small"
                      icon="CopyDocument"
                      class="copy-btn"
                      @click.stop="handleCopyText(row.sku, '销售SKU')"
                    />
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>

            <!-- 6. 物料编码 -->
            <el-table-column label="物料编码" prop="parentMaterialCode" min-width="160" show-overflow-tooltip>
              <template #default="{ row }">
                <div class="flex-center">
                  <span class="parent-code font-bold mr-4">{{ row.parentMaterialCode }}</span>
                  <el-tooltip content="复制物料编码" placement="top" :hide-after="1000">
                    <el-button
                      type="primary"
                      link
                      size="small"
                      icon="CopyDocument"
                      class="copy-btn"
                      @click.stop="handleCopyText(row.parentMaterialCode, '物料编码')"
                    />
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>

            <!-- 7. 产品名称 -->
            <el-table-column label="产品名称" prop="productName" min-width="160" show-overflow-tooltip>
              <template #default="{ row }">
                <div class="prod-name-cell">
                  <el-image :src="row.image" class="prod-img" fit="cover" />
                  <span class="name-text" :title="row.productName">{{ row.productName }}</span>
                </div>
              </template>
            </el-table-column>

            <!-- 8. 款式 -->
            <el-table-column label="款式" min-width="110" align="center" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.style || getFurnitureComboMeta(row.parentMaterialCode)?.style || '-' }}</span>
              </template>
            </el-table-column>

            <!-- 9. 主材料 -->
            <el-table-column label="主材料" min-width="130" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.mainMaterial || getFurnitureComboMeta(row.parentMaterialCode)?.material || '-' }}</span>
              </template>
            </el-table-column>

            <!-- 10. 公司品牌 -->
            <el-table-column label="公司品牌" min-width="100" align="center" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.brand || getFurnitureComboMeta(row.parentMaterialCode)?.brand || row.targetBrand || '-' }}</span>
              </template>
            </el-table-column>

            <!-- 11. 颜色 -->
            <el-table-column label="颜色" min-width="100" align="center" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.color || getFurnitureComboMeta(row.parentMaterialCode)?.color || '-' }}</span>
              </template>
            </el-table-column>

            <!-- 12. 包装数量 -->
            <el-table-column label="包装数量" min-width="90" align="center">
              <template #default="{ row }">
                <span class="font-mono text-xs text-slate-600">{{ row.packQty || getFurnitureComboMeta(row.parentMaterialCode)?.packQty || '-' }}</span>
              </template>
            </el-table-column>

            <!-- 13. 订单占用库存 (Unshipped 待发货订单占用) -->
            <el-table-column width="150" align="right" sortable prop="orderOccupiedQty">
              <template #header>
                <span class="inline-flex items-center gap-4">
                  <span>订单占用库存</span>
                  <el-tooltip placement="top" :show-after="100" effect="dark">
                    <template #content>
                      <div style="font-size: 12px; line-height: 1.6; max-width: 280px;">
                        <div style="font-weight: 700; color: #f59e0b; margin-bottom: 4px;">订单占用库存说明：</div>
                        <div>拉取后台 <b>Unshipped（待发货）</b> 订单，锁定/占用对应海外仓的物理存量套数。</div>
                        <div style="color: #cbd5e1; font-size: 11px; margin-top: 4px;">* 点击数值可查看该物料在该海外仓的待发货订单明细。</div>
                      </div>
                    </template>
                    <el-icon class="text-slate-400 hover:text-amber-500 cursor-pointer"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </span>
              </template>
              <template #default="{ row }">
                <template v-if="getDisplayOccupied(row) > 0">
                  <div
                    class="order-occupied-badge-wrap cursor-pointer"
                    @click.stop="handleViewUnshippedOrders(row)"
                  >
                    <span class="occupied-num font-bold">{{ getDisplayOccupied(row).toLocaleString() }} 套</span>
                    <span class="occupied-count-tag" title="点击查看待发货订单明细">{{ row.unshippedOrderCount || row.unshippedOrders?.length || 1 }}单</span>
                  </div>
                </template>
                <span v-else class="text-slate-400 text-xs">0 套</span>
              </template>
            </el-table-column>

            <!-- 15. 实际可售 -->
            <el-table-column width="135" align="right" sortable prop="calculatedParentAvailable">
              <template #header>
                <span class="inline-flex items-center gap-4">
                  <span>{{ actualAvailableColumnTitle }}</span>
                  <el-tooltip placement="top" :show-after="100" effect="dark">
                    <template #content>
                      <div style="font-size: 12px; line-height: 1.6; max-width: 290px;">
                        <div style="font-weight: 700; color: #60a5fa; margin-bottom: 4px;">实际可售 说明：</div>
                        <div v-if="filterWarehouseName !== '全部' || filterTpOverseasWh !== '全部'">
                          当前已按选中仓库过滤，展示该仓库独立备货的实际可售套数。
                        </div>
                        <div v-else>
                          各个海外仓独立齐套备货套数汇总，扣除待发货订单占用套数。
                        </div>
                        <div style="color: #cbd5e1; font-size: 11px; margin-top: 4px;">* 跨国电商各海外仓独立齐套发货，点击数值可查看各仓分仓备货明细。</div>
                      </div>
                    </template>
                    <el-icon class="text-slate-400 hover:text-primary cursor-pointer"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </span>
              </template>
              <template #default="{ row }">
                <div class="flex flex-col items-end">
                  <span
                    class="num-bold text-emerald-600 font-mono cursor-pointer hover:underline"
                    title="点击查看各海外仓分仓明细"
                    @click="handleViewWarehouseDetail(row)"
                  >
                    {{ getDisplayAvailable(row).toLocaleString() }} 套
                  </span>
                  <span
                    v-if="(filterWarehouseName === '全部' && filterTpOverseasWh === '全部') && (row.coveredWarehouses && row.coveredWarehouses.length > 1)"
                    class="text-xs text-slate-400 hover:text-primary cursor-pointer mt-1"
                    title="点击查看各海外仓分仓明细"
                    @click.stop="handleViewWarehouseDetail(row)"
                  >
                    {{ row.coveredWarehouses.length }}仓独立备货
                  </span>
                  <span
                    v-else-if="filterWarehouseName !== '全部' || filterTpOverseasWh !== '全部'"
                    class="text-xs text-slate-400 mt-1"
                  >
                    全仓: {{ row.calculatedParentAvailable }}套
                  </span>
                </div>
              </template>
            </el-table-column>

            <!-- 16. 在途 -->
            <el-table-column width="105" align="right" sortable prop="calculatedParentTransit">
              <template #header>
                <span class="inline-flex items-center gap-4">
                  <span>{{ transitColumnTitle }}</span>
                  <el-tooltip placement="top" :show-after="100" effect="dark">
                    <template #content>
                      <div style="font-size: 12px; line-height: 1.6; max-width: 290px;">
                        <div style="font-weight: 700; color: #60a5fa; margin-bottom: 4px;">在途 说明：</div>
                        <div v-if="filterWarehouseName !== '全部' || filterTpOverseasWh !== '全部'">
                          当前选中仓库的在途套数（国内发往该仓途中或入库清点中）。
                        </div>
                        <div v-else>
                          各个海外仓在途备货套数汇总。
                        </div>
                      </div>
                    </template>
                    <el-icon class="text-slate-400 hover:text-primary cursor-pointer"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </span>
              </template>
              <template #default="{ row }">
                <span
                  class="num-blue font-mono cursor-pointer hover:underline"
                  v-if="getDisplayTransit(row) > 0"
                  title="点击查看各海外仓分仓明细"
                  @click="handleViewWarehouseDetail(row)"
                >
                  +{{ getDisplayTransit(row).toLocaleString() }} 套
                </span>
                <span class="text-muted" v-else>0 套</span>
              </template>
            </el-table-column>

            <!-- 17. 操作 -->
            <el-table-column label="操作" width="165" align="center" fixed="right">
              <template #default="{ row }">
                <div class="flex-center gap-6">
                  <el-button
                    type="primary"
                    link
                    size="small"
                    @click="handleViewWarehouseDetail(row)"
                  >
                    分仓明细
                  </el-button>
                  <el-button
                    type="primary"
                    link
                    size="small"
                    @click="handleViewBomDetail(row)"
                  >
                    BOM明细
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-wrapper mt-16 flex-between">
            <div class="pagination-stat-info">
              共 <span class="stat-num">{{ filteredTableData.length }}</span> 项海外仓库存看板数据，当前第 <span class="stat-num">{{ currentPage }}</span> / {{ Math.ceil(filteredTableData.length / pageSize) || 1 }} 页
            </div>
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
            <span class="filter-label">平台:</span>
            <el-select v-model="asinFilterPlatform" placeholder="全部平台" size="small" style="width: 120px;" clearable>
              <el-option label="全部平台" value="全部" />
              <el-option v-for="plat in platformOptions" :key="plat" :label="plat" :value="plat" />
            </el-select>
          </div>

          <div class="filter-group">
            <span class="filter-label">账号:</span>
            <el-select v-model="asinFilterAccount" placeholder="全部账号" size="small" style="width: 130px;" clearable>
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
            <el-select v-model="asinFilterSite" placeholder="全部站点" size="small" style="width: 110px;" clearable>
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
              size="small"
              style="width: 280px;"
            />
          </div>
        </div>
      </div>

      <div class="main-content-card">
        <div class="table-toolbar mb-16">
          <div class="toolbar-left flex-center gap-10">
            <el-button
              type="primary"
              plain
              size="small"
              icon="Plus"
              @click="handleOpenAddAsinModal"
            >
              新增跟踪 ASIN
            </el-button>
            <el-button
              plain
              size="small"
              icon="Upload"
              @click="handleBatchImportAsin"
            >
              批量导入 ASIN
            </el-button>
            <el-button
              type="primary"
              plain
              size="small"
              icon="Refresh"
              :loading="isUpdatingAsin"
              @click="handleUpdateAllAsinTracks"
            >
              全量更新属性与关系
            </el-button>
            <el-button
              v-if="selectedAsinRows.length"
              type="success"
              plain
              size="small"
              icon="Refresh"
              :loading="isUpdatingAsin"
              @click="handleUpdateSelectedAsinTracks"
            >
              更新所选 ({{ selectedAsinRows.length }})
            </el-button>
            <el-button
              size="small"
              :type="selectedAsinRows.length ? 'danger' : 'default'"
              plain
              icon="Delete"
              :disabled="selectedAsinRows.length === 0"
              @click="handleBatchDeleteAsinTracks"
            >
              批量取消跟踪
            </el-button>
          </div>
          <div class="toolbar-right flex-center gap-10">
            <span class="toolbar-count-text">
              当前共跟踪 <span class="num-highlight">{{ filteredAsinTrackData.length }}</span> 项 ASIN 信息
            </span>
            <span v-if="selectedAsinRows.length" class="selected-badge">
              已勾选 <span class="selected-num">{{ selectedAsinRows.length }}</span> 项
            </span>
          </div>
        </div>

        <el-table
          ref="asinTableRef"
          :data="paginatedAsinTrackData"
          :row-key="(row: any) => `${row.asin}_${row.sku}`"
          border
          stripe
          size="default"
          style="width: 100%;"
          @selection-change="handleAsinSelectionChange"
        >
          <!-- 多选列: 支持批量取消跟踪 -->
          <el-table-column type="selection" width="45" align="center" fixed="left" />
          <!-- 0. 平台 (账号前面增加显示平台信息项) -->
          <el-table-column label="平台" prop="platform" width="105" align="center">
            <template #default="{ row }">
              <el-tag size="small" effect="plain" class="platform-tag" :class="getPlatformTagClass(row.platform)">
                {{ row.platform || 'Amazon' }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 1. 账号 -->
          <el-table-column label="账号" prop="account" width="65" align="center" show-overflow-tooltip />

          <!-- 2. 站点 -->
          <el-table-column label="站点" width="60" align="center">
            <template #default="{ row }">
              <span class="site-tag">
                {{ row.site }}
              </span>
            </template>
          </el-table-column>

          <!-- 3. ASIN -->
          <el-table-column label="ASIN" prop="asin" min-width="118" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="code-link font-bold">{{ row.asin }}</span>
            </template>
          </el-table-column>

          <!-- 4. SKU -->
          <el-table-column label="SKU" prop="sku" min-width="145" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="code-bold">{{ row.sku }}</span>
            </template>
          </el-table-column>

          <!-- 5. 物料编码 -->
          <el-table-column label="物料编码" prop="materialCode" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="parent-code font-bold">{{ row.materialCode }}</span>
            </template>
          </el-table-column>

          <!-- 6. 产品名称 -->
          <el-table-column label="产品名称" min-width="130" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="product-name font-medium">{{ getComboMetaByMaterialCode(row.materialCode)?.productName || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 7. 款式 -->
          <el-table-column label="款式" min-width="140" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="font-medium text-slate-800">{{ getComboMetaByMaterialCode(row.materialCode)?.style || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 8. 主材料 -->
          <el-table-column label="主材料" min-width="130" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ getComboMetaByMaterialCode(row.materialCode)?.material || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 9. 公司品牌 -->
          <el-table-column label="公司品牌" width="95" align="center">
            <template #default="{ row }">
              <el-tag size="small" type="info" effect="plain">{{ getComboMetaByMaterialCode(row.materialCode)?.brand || '中性' }}</el-tag>
            </template>
          </el-table-column>

          <!-- 10. 颜色 -->
          <el-table-column label="颜色" width="105" align="center">
            <template #default="{ row }">
              <span class="text-slate-700">{{ getComboMetaByMaterialCode(row.materialCode)?.color || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 11. 包装数量 -->
          <el-table-column label="包装数量" width="95" align="center">
            <template #default="{ row }">
              <span class="font-mono text-xs text-slate-600">{{ getComboMetaByMaterialCode(row.materialCode)?.packQty || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 添加时间 -->
          <el-table-column label="添加时间" prop="addTime" width="150" align="center" />

          <!-- 操作 -->
          <el-table-column label="操作" width="220" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" icon="Refresh" @click="handleUpdateSingleAsin(row)">更新属性与关系</el-button>
              <el-button type="primary" link size="small" icon="Edit" @click="handleEditAsinTrack(row)">编辑</el-button>
              <el-button type="danger" link size="small" icon="Delete" @click="handleDeleteAsinTrack(row)">取消跟踪</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-wrapper mt-16 flex-between">
          <div class="pagination-stat-info">
            共 <span class="stat-num">{{ filteredAsinTrackData.length }}</span> 项 ASIN 跟踪记录，当前第 <span class="stat-num">{{ asinCurrentPage }}</span> / {{ Math.ceil(filteredAsinTrackData.length / asinPageSize) || 1 }} 页
          </div>
          <el-pagination
            v-model:current-page="asinCurrentPage"
            v-model:page-size="asinPageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filteredAsinTrackData.length"
          />
        </div>
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
              size="small"
              style="width: 280px;"
            />
          </div>

          <div class="filter-group combo-type-tabs">
            <span class="filter-label">组合类型:</span>
            <el-radio-group v-model="comboTypeFilter" size="small" class="combo-radio-group">
              <el-radio-button label="全部">全部 ({{ bindingTableData.length }})</el-radio-button>
              <el-radio-button label="多件打包">多件打包 ({{ countMultiPack }})</el-radio-button>
              <el-radio-button label="一物多包">一物多包 ({{ countSingleMultiPkg }})</el-radio-button>
              <el-radio-button label="主附搭配">主附搭配 ({{ countMainSub }})</el-radio-button>
              <el-radio-button label="成套组合">成套组合 ({{ countCompleteSet }})</el-radio-button>
            </el-radio-group>

            <el-tooltip content="点击展开或收起4大组合类型标准业务定义、判定法则及案例对照" placement="top">
              <el-button
                :type="showComboTypeLegend ? 'primary' : 'default'"
                plain
                size="small"
                class="guide-toggle-btn ml-8"
                @click="showComboTypeLegend = !showComboTypeLegend"
              >
                <el-icon><InfoFilled /></el-icon>
                <span>{{ showComboTypeLegend ? '收起定义指南' : '导图定义指南' }}</span>
              </el-button>
            </el-tooltip>
          </div>
        </div>

        <!-- 组合类型标准定义说明卡片指南 (精致紧凑版) -->
        <el-collapse-transition>
          <div v-if="showComboTypeLegend" class="combo-type-legend-container mt-12">
            <div class="legend-grid">
              <div
                v-for="item in COMBO_TYPE_LIST"
                :key="item.type"
                class="legend-card"
                :class="[item.type, { active: comboTypeFilter === item.type }]"
                @click="comboTypeFilter = comboTypeFilter === item.type ? '全部' : item.type"
              >
                <div class="card-top flex-between">
                  <div class="type-name-box flex-center gap-6">
                    <span class="type-dot" :class="item.type"></span>
                    <span class="type-title font-bold">{{ item.name }}</span>
                  </div>
                  <span class="core-rule-badge" :class="item.type">{{ item.coreRule }}</span>
                </div>

                <div class="card-desc text-xs text-secondary mt-6">
                  {{ item.detailDesc }}
                </div>

                <div class="card-example-pill mt-6">
                  <span class="pill-tag">示例</span>
                  <span class="pill-text" :title="item.example">{{ item.example }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-transition>
      </div>

      <div class="main-content-card">
        <div class="table-toolbar mb-16 flex-between">
          <div class="toolbar-left flex-center gap-10">
            <el-button
              type="primary"
              plain
              size="small"
              icon="Collection"
              @click="openBaseLibraryBrowser"
            >
              组合物料库
            </el-button>
            <el-button
              type="primary"
              plain
              size="small"
              icon="Refresh"
              :loading="isUpdatingBinding"
              @click="handleUpdateAllBindings"
            >
              全量更新属性与关系
            </el-button>
            <el-button
              v-if="selectedBindingRows.length"
              type="success"
              plain
              size="small"
              icon="Refresh"
              :loading="isUpdatingBinding"
              @click="handleUpdateSelectedBindings"
            >
              更新所选 ({{ selectedBindingRows.length }})
            </el-button>
            <el-button
              size="small"
              :type="selectedBindingRows.length ? 'danger' : 'default'"
              plain
              icon="Delete"
              :disabled="selectedBindingRows.length === 0"
              @click="handleBatchUnbindSelected"
            >
              批量解绑
            </el-button>
          </div>
          <div class="toolbar-right flex-center gap-10">
            <span class="toolbar-count-text">
              共 <span class="num-highlight">{{ filteredBindingTableData.length }}</span> 项父子物料 BOM 绑定关系
            </span>
            <span v-if="selectedBindingRows.length" class="selected-badge">
              已勾选 <span class="selected-num">{{ selectedBindingRows.length }}</span> 项
            </span>
          </div>
        </div>

        <el-table
          ref="bindingTableRef"
          :data="paginatedBindingTableData"
          row-key="parentCode"
          border
          stripe
          size="default"
          style="width: 100%;"
          @selection-change="handleBindingSelectionChange"
        >
          <!-- 多选列: 支持表格表头全选与单选 -->
          <el-table-column type="selection" width="45" align="center" fixed="left" />

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
                  <el-table-column label="子物料图片" width="80" align="center">
                    <template #default="{ row: sub }">
                      <div class="flex-center">
                        <el-image
                          :src="sub.image || getChildMaterialImage(sub.childCode)"
                          :preview-src-list="[sub.image || getChildMaterialImage(sub.childCode)]"
                          preview-teleported
                          fit="cover"
                          style="width: 36px; height: 36px; border-radius: 4px; border: 1px solid #e2e8f0; cursor: pointer;"
                        />
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column label="子 SKU / 子物料编码" prop="childCode" width="160">
                    <template #default="{ row: sub }">
                      <span
                        class="child-code-link font-bold"
                        title="点击查看该子物料绑定的父物料清单"
                        @click="handleViewChildLinkedParents(sub.childCode)"
                      >
                        {{ sub.childCode }}
                      </span>
                    </template>
                  </el-table-column>

                  <el-table-column label="子物料名称" min-width="160" show-overflow-tooltip>
                    <template #default="{ row: sub }">
                      <span>{{ sub.childName || getFurnitureChildMeta(sub.childCode)?.childName || sub.childCode }}</span>
                    </template>
                  </el-table-column>

                  <!-- 展开子物料在名称后增加显示：款式 主材料 适用品牌或对象 型号 公司品牌 图案 颜色 包装数量 -->
                  <el-table-column label="款式" width="110" align="center">
                    <template #default="{ row: sub }">
                      <span class="font-medium text-slate-700">{{ sub.childStyle || getFurnitureChildMeta(sub.childCode)?.childStyle || '-' }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="主材料" min-width="130" show-overflow-tooltip>
                    <template #default="{ row: sub }">
                      <span>{{ sub.childMaterial || getFurnitureChildMeta(sub.childCode)?.childMaterial || '-' }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="适用品牌或对象" width="120" align="center">
                    <template #default="{ row: sub }">
                      <span>{{ sub.childTarget || getFurnitureChildMeta(sub.childCode)?.childTarget || '通用' }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="型号" width="90" align="center">
                    <template #default="{ row: sub }">
                      <span>{{ sub.childModel || getFurnitureChildMeta(sub.childCode)?.childModel || '通用' }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="公司品牌" width="95" align="center">
                    <template #default="{ row: sub }">
                      <el-tag size="small" type="info" effect="plain">{{ sub.childBrand || getFurnitureChildMeta(sub.childCode)?.childBrand || '中性' }}</el-tag>
                    </template>
                  </el-table-column>

                  <el-table-column label="图案" width="115" align="center">
                    <template #default="{ row: sub }">
                      <span>{{ sub.childPattern || getFurnitureChildMeta(sub.childCode)?.childPattern || '-' }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="颜色" width="105" align="center">
                    <template #default="{ row: sub }">
                      <span class="text-slate-700">{{ sub.childColor || getFurnitureChildMeta(sub.childCode)?.childColor || '-' }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="包装数量" width="95" align="center">
                    <template #default="{ row: sub }">
                      <span class="font-mono text-xs text-slate-600">{{ sub.childPackQty || getFurnitureChildMeta(sub.childCode)?.childPackQty || '1pack' }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="绑定用量配比" prop="ratio" width="130" align="center">
                    <template #default="{ row: sub }">
                      <span class="ratio-badge-text">1 父 : {{ sub.ratio }} 子</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-table-column>

          <!-- 0. 物料图片 -->
          <el-table-column label="物料图片" width="75" align="center">
            <template #default="{ row }">
              <div class="flex-center">
                <el-image
                  :src="row.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=160&auto=format&fit=crop&q=80'"
                  :preview-src-list="[row.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=160&auto=format&fit=crop&q=80']"
                  preview-teleported
                  fit="cover"
                  style="width: 38px; height: 38px; border-radius: 4px; border: 1px solid #e2e8f0; cursor: pointer;"
                />
              </div>
            </template>
          </el-table-column>

          <!-- 1. 父物料编码 (父 SKU) -->
          <el-table-column label="父物料编码 (父SKU)" prop="parentCode" min-width="190" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="parent-mat-cell flex-center">
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
          <el-table-column label="产品名称" prop="productName" width="115" align="center" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="product-name font-medium">{{ row.productName || getFurnitureComboMeta(row.parentCode)?.productName || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 父子绑定关系在产品名称后新增：款式 主材料 公司品牌 颜色 包装数量 -->
          <el-table-column label="款式" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="font-medium text-slate-800">{{ row.style || getFurnitureComboMeta(row.parentCode)?.style || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="主材料" min-width="145" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.material || getFurnitureComboMeta(row.parentCode)?.material || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="公司品牌" width="95" align="center">
            <template #default="{ row }">
              <el-tag size="small" type="info" effect="plain">{{ row.brand || getFurnitureComboMeta(row.parentCode)?.brand || '中性' }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="颜色" width="105" align="center">
            <template #default="{ row }">
              <span class="text-slate-700">{{ row.color || getFurnitureComboMeta(row.parentCode)?.color || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="包装数量" width="95" align="center">
            <template #default="{ row }">
              <span class="font-mono text-xs text-slate-600">{{ row.packQty || getFurnitureComboMeta(row.parentCode)?.packQty || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 3. 组合类型 -->
          <el-table-column label="组合类型" prop="comboType" width="115" align="center">
            <template #default="{ row }">
              <el-tooltip
                v-if="getComboTypeMeta(row.comboType)"
                placement="top"
                :show-after="200"
              >
                <template #content>
                  <div style="max-width: 280px; line-height: 1.5; padding: 2px;">
                    <div style="font-weight: 700; color: #60a5fa; margin-bottom: 3px;">
                      【{{ getComboTypeMeta(row.comboType).name }}】
                    </div>
                    <div style="font-size: 12px; margin-bottom: 4px; color: #ffffff;">
                      {{ getComboTypeMeta(row.comboType).detailDesc }}
                    </div>
                    <div style="font-size: 11px; color: #cbd5e1;">
                      法则：{{ getComboTypeMeta(row.comboType).coreRule }}
                    </div>
                    <div style="font-size: 11px; color: #93c5fd; margin-top: 3px;">
                      示例：{{ getComboTypeMeta(row.comboType).example }}
                    </div>
                  </div>
                </template>
                <span class="type-badge" :class="getComboTypeBadgeClass(row.comboType)">
                  {{ getComboTypeMeta(row.comboType).name }}
                </span>
              </el-tooltip>
              <span v-else class="type-badge badge-neutral">
                {{ row.comboType || '多件打包' }}
              </span>
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
          <el-table-column label="子物料数" width="105" align="center">
            <template #default="{ row }">
              <span class="font-mono text-xs font-semibold text-slate-700">
                {{ row.boundChildren ? row.boundChildren.length : 0 }} 款
              </span>
            </template>
          </el-table-column>


          <!-- 更新时间 -->
          <el-table-column label="更新时间" prop="updateTime" width="170" align="center" />

          <!-- 8. 操作 -->
          <el-table-column label="操作" width="220" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" icon="Refresh" @click="handleUpdateSingleBinding(row)">更新属性与关系</el-button>
              <el-button type="primary" link size="small" icon="Edit" @click="handleEditBinding(row)">编辑</el-button>
              <el-button type="danger" link size="small" icon="Delete" @click="handleUnbind(row)">解绑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-wrapper mt-16 flex-between">
          <div class="pagination-stat-info">
            共 <span class="stat-num">{{ filteredBindingTableData.length }}</span> 款父子物料 BOM 绑定关系，当前第 <span class="stat-num">{{ bindingCurrentPage }}</span> / {{ Math.ceil(filteredBindingTableData.length / bindingPageSize) || 1 }} 页
          </div>
          <el-pagination
            v-model:current-page="bindingCurrentPage"
            v-model:page-size="bindingPageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filteredBindingTableData.length"
          />
        </div>
      </div>
    </div>

    <!-- 选项卡 4: 子物料库存明细 -->
    <div v-else-if="activeTab === 'childStock'" class="tab-content">
      <div class="filter-panel-card mb-20">
        <div class="filter-row">
          <!-- 1. 子物料编码 -->
          <div class="filter-group">
            <span class="filter-label">子物料编码:</span>
            <el-input
              v-model="filterChildStockCode"
              placeholder="搜索子物料编码..."
              prefix-icon="Search"
              clearable
              size="small"
              style="width: 160px;"
            />
          </div>

          <!-- 2. 产品名称 -->
          <div class="filter-group">
            <span class="filter-label">产品名称:</span>
            <el-input
              v-model="filterChildStockProductName"
              placeholder="搜索产品名称..."
              clearable
              size="small"
              style="width: 150px;"
            />
          </div>

          <!-- 3. 款式 -->
          <div class="filter-group">
            <span class="filter-label">款式:</span>
            <el-select
              v-model="filterChildStockStyle"
              placeholder="全部款式"
              clearable
              filterable
              size="small"
              style="width: 130px;"
            >
              <el-option label="全部款式" value="全部" />
              <el-option v-for="st in childStyleOptions" :key="st" :label="st" :value="st" />
            </el-select>
          </div>

          <!-- 4. 主材料 -->
          <div class="filter-group">
            <span class="filter-label">主材料:</span>
            <el-select
              v-model="filterChildStockMaterial"
              placeholder="全部主材料"
              clearable
              filterable
              size="small"
              style="width: 130px;"
            >
              <el-option label="全部主材料" value="全部" />
              <el-option v-for="mat in childMaterialOptions" :key="mat" :label="mat" :value="mat" />
            </el-select>
          </div>

          <!-- 5. 三方海外仓 -->
          <div class="filter-group">
            <span class="filter-label">三方海外仓:</span>
            <el-select
              v-model="filterChildStockTpWh"
              placeholder="全部海外仓"
              clearable
              size="small"
              style="width: 120px;"
            >
              <el-option label="全部海外仓" value="全部" />
              <el-option v-for="tp in childTpWhOptions" :key="tp" :label="tp" :value="tp" />
            </el-select>
          </div>

          <!-- 6. 仓库名称 -->
          <div class="filter-group">
            <span class="filter-label">仓库名称:</span>
            <el-select
              v-model="filterChildStockWhName"
              placeholder="全部仓库"
              clearable
              filterable
              size="small"
              style="width: 150px;"
            >
              <el-option label="全部仓库" value="全部" />
              <el-option v-for="wh in childWhNameOptions" :key="wh" :label="wh" :value="wh" />
            </el-select>
          </div>

          <!-- 操作按钮 -->
          <div class="filter-actions flex-center">
            <el-button plain icon="RefreshRight" size="small" @click="handleResetChildStockFilter">
              重置筛选
            </el-button>
          </div>
        </div>
      </div>

      <div class="main-content-card">
        <div class="table-toolbar mb-16">
          <div class="toolbar-left flex-center gap-10">
            <el-dropdown
              split-button
              type="primary"
              size="small"
              :loading="isSyncingChildStock"
              @click="handleSyncAllOverseasWh"
              @command="handleSyncSingleOverseasWh"
            >
              <el-icon class="mr-4"><Refresh /></el-icon>
              <span>同步全部海外仓</span>
              <template #dropdown>
                <el-dropdown-menu class="overseas-wh-dropdown-menu">
                  <el-dropdown-item disabled class="dropdown-header-tip">
                    <span class="text-xs font-semibold text-slate-600">按三方海外仓独立单仓同步:</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-for="tp in overseasWhSyncStatusList"
                    :key="tp.name"
                    :command="tp.name"
                    :divided="tp.name === overseasWhSyncStatusList[0].name"
                  >
                    <div class="flex-between" style="min-width: 210px;">
                      <span class="font-medium mr-12">{{ tp.name }}</span>
                      <div class="flex-center">
                        <el-tag
                          :type="tp.status === 'success' ? 'success' : tp.status === 'failed' ? 'danger' : 'info'"
                          size="small"
                          effect="plain"
                          class="mr-6"
                        >
                          {{ tp.status === 'success' ? '成功' : tp.status === 'failed' ? '异常' : '就绪' }}
                        </el-tag>
                        <span class="text-xs text-slate-400 font-mono">{{ tp.lastSyncTime }}</span>
                      </div>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="toolbar-right flex-center gap-12">
            <el-tooltip :content="syncStatusTooltipContent" placement="top">
              <span class="text-xs text-slate-400 cursor-pointer flex-center">
                <el-icon class="mr-4"><InfoFilled /></el-icon>
                数据源: 海外仓 WMS API
              </span>
            </el-tooltip>
            <span class="toolbar-count-text">
              筛选出 <span class="num-highlight">{{ filteredChildPhysicalStockData.length }}</span> 款子物料库存
              <span class="text-slate-400 text-xs ml-4 font-normal">（全仓共 {{ childPhysicalStockData.length }} 款）</span>
            </span>
          </div>
        </div>

        <el-table
          :data="paginatedChildPhysicalStockData"
          border
          stripe
          show-summary
          :summary-method="getChildStockSummary"
          size="default"
          style="width: 100%;"
        >
          <!-- 1. 子物料图片 -->
          <el-table-column label="子物料图片" width="75" align="center">
            <template #default="{ row }">
              <div class="flex-center">
                <el-image
                  :src="row.image || getChildMaterialImage(row.childCode)"
                  :preview-src-list="[row.image || getChildMaterialImage(row.childCode)]"
                  preview-teleported
                  fit="cover"
                  style="width: 36px; height: 36px; border-radius: 4px; border: 1px solid #e2e8f0; cursor: pointer;"
                />
              </div>
            </template>
          </el-table-column>

          <!-- 2. 子物料编码 -->
          <el-table-column label="子物料编码" prop="childCode" min-width="170">
            <template #default="{ row }">
              <div class="flex-column items-start">
                <div class="flex-center">
                  <span
                    class="child-code-link font-bold mr-6"
                    title="点击查看该子物料绑定的父物料清单"
                    @click="handleViewChildLinkedParents(row.childCode)"
                  >
                    {{ row.childCode }}
                  </span>
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
                <div class="mt-4">
                  <el-tag
                    size="small"
                    type="primary"
                    effect="plain"
                    class="cursor-pointer bound-parent-tag"
                    title="点击查看该子物料绑定的父物料清单"
                    @click.stop="handleViewChildLinkedParents(row.childCode)"
                  >
                    <el-icon class="mr-2"><Connection /></el-icon>
                    绑定 {{ getChildBoundParents(row.childCode).length }} 款父物料
                  </el-tag>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 3. 产品名称 -->
          <el-table-column label="产品名称" min-width="140" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ getFurnitureChildMeta(row.childCode)?.childProductName || row.childName || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 4. 款式 -->
          <el-table-column label="款式" min-width="115" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ getFurnitureChildMeta(row.childCode)?.childStyle || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 5. 主材料 -->
          <el-table-column label="主材料" min-width="130" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ getFurnitureChildMeta(row.childCode)?.childMaterial || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 6. 适用品牌或机型 -->
          <el-table-column label="适用品牌或机型" min-width="125" align="center" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ getFurnitureChildMeta(row.childCode)?.childTarget || '通用' }}</span>
            </template>
          </el-table-column>

          <!-- 7. 型号 -->
          <el-table-column label="型号" width="95" align="center" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ getFurnitureChildMeta(row.childCode)?.childModel || '通用' }}</span>
            </template>
          </el-table-column>

          <!-- 8. 公司品牌 -->
          <el-table-column label="公司品牌" width="95" align="center">
            <template #default="{ row }">
              <el-tag size="small" type="info" effect="plain">{{ getFurnitureChildMeta(row.childCode)?.childBrand || '中性' }}</el-tag>
            </template>
          </el-table-column>

          <!-- 9. 颜色 -->
          <el-table-column label="颜色" width="105" align="center" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="text-slate-700">{{ getFurnitureChildMeta(row.childCode)?.childColor || row.color || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 10. 包装数量 -->
          <el-table-column label="包装数量" width="95" align="center">
            <template #default="{ row }">
              <span class="font-mono text-xs text-slate-600">{{ getFurnitureChildMeta(row.childCode)?.childPackQty || '1pack' }}</span>
            </template>
          </el-table-column>

          <!-- 11. 三方海外仓 -->
          <el-table-column label="三方海外仓" prop="tpWh" width="115" align="center" />

          <!-- 12. 仓库名称 -->
          <el-table-column label="仓库名称" prop="whName" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="flex-center">
                <span class="mr-6 overflow-ellipsis">{{ row.whName }}</span>
                <el-tooltip content="复制仓库名称" placement="top" :hide-after="1000">
                  <el-button
                    type="primary"
                    link
                    size="small"
                    icon="CopyDocument"
                    class="copy-btn"
                    @click.stop="handleCopyText(row.whName, '仓库名称')"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>

          <!-- 13. 可售库存 -->
          <el-table-column label="可售库存" prop="availableQty" width="130" align="right">
            <template #default="{ row }">
              <span class="num-bold">{{ row.availableQty.toLocaleString() }} 件</span>
            </template>
          </el-table-column>

          <!-- 14. 在途库存 -->
          <el-table-column label="在途库存" prop="transitQty" width="130" align="right">
            <template #default="{ row }">
              <span class="num-blue" v-if="row.transitQty > 0">+{{ row.transitQty.toLocaleString() }} 件</span>
              <span class="text-muted" v-else>0 件</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-wrapper mt-16 flex-between">
          <div class="pagination-stat-info">
            筛选出 <span class="stat-num">{{ filteredChildPhysicalStockData.length }}</span> 款子物料库存（全仓共 {{ childPhysicalStockData.length }} 款），当前第 <span class="stat-num">{{ childStockCurrentPage }}</span> / {{ Math.ceil(filteredChildPhysicalStockData.length / childStockPageSize) || 1 }} 页
          </div>
          <el-pagination
            v-model:current-page="childStockCurrentPage"
            v-model:page-size="childStockPageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filteredChildPhysicalStockData.length"
          />
        </div>
      </div>
    </div>

    <!-- 选项卡 5: 穿透齐套与缺料预警 -->
    <div v-else-if="activeTab === 'completeness'" class="tab-content completeness-container">
      <div class="main-content-card">
        <!-- 1. 顶部全局 KPI 卡片网格 (沉稳、纯净、指标清晰，点击即可筛选) -->
        <div class="completeness-kpi-grid mb-16">
          <div 
            class="kpi-card" 
            :class="{ active: completenessFilterType === '全部' }"
            @click="completenessFilterType = '全部'"
          >
            <div class="kpi-label">全部预警组合</div>
            <div class="kpi-value-row">
              <span class="kpi-num">{{ completenessAlertData.length }}</span>
              <span class="kpi-unit">款</span>
            </div>
            <div class="kpi-subtext">全量多物料缺料与失衡记录</div>
          </div>

          <div 
            class="kpi-card is-danger" 
            :class="{ active: completenessFilterType === '断货归零' }"
            @click="completenessFilterType = '断货归零'"
          >
            <div class="kpi-label">
              <span class="kpi-status-dot danger"></span>
              严重断货 (0套)
            </div>
            <div class="kpi-value-row">
              <span class="kpi-num text-danger">{{ completenessAlertData.filter(x => x.alertType === '断货归零').length }}</span>
              <span class="kpi-unit">款</span>
              <span class="kpi-badge-danger" v-if="completenessAlertData.filter(x => x.alertType === '断货归零').length > 0">最高优先级</span>
            </div>
            <div class="kpi-subtext">整套商品已不可售，急需紧急补齐短板</div>
          </div>

          <div 
            class="kpi-card is-warning" 
            :class="{ active: completenessFilterType === '多物料共同短板' }"
            @click="completenessFilterType = '多物料共同短板'"
          >
            <div class="kpi-label">
              <span class="kpi-status-dot warning"></span>
              共同短板协同
            </div>
            <div class="kpi-value-row">
              <span class="kpi-num text-warning">{{ completenessAlertData.filter(x => x.alertType === '多物料共同短板').length }}</span>
              <span class="kpi-unit">款</span>
            </div>
            <div class="kpi-subtext">存在多款并列短板，必须同步采购</div>
          </div>

          <div 
            class="kpi-card is-info" 
            :class="{ active: completenessFilterType === '单物料短板' }"
            @click="completenessFilterType = '单物料短板'"
          >
            <div class="kpi-label">
              <span class="kpi-status-dot info"></span>
              单物料短板
            </div>
            <div class="kpi-value-row">
              <span class="kpi-num text-slate">{{ completenessAlertData.filter(x => x.alertType === '单物料短板').length }}</span>
              <span class="kpi-unit">款</span>
            </div>
            <div class="kpi-subtext">仅单一部件制约，定向补货即可释放套数</div>
          </div>
        </div>

        <!-- 2. 多维筛选区 (样式参考SKU海外仓库存看板) -->
        <div class="filter-panel-card mb-12">
          <div class="filter-row">
            <div class="filter-group">
              <span class="filter-label">三方海外仓:</span>
              <el-select
                v-model="completenessTpOverseasWh"
                placeholder="全部海外仓"
                size="small"
                clearable
                style="width: 120px;"
                @change="() => { completenessWarehouseName = '全部' }"
              >
                <el-option label="全部海外仓" value="全部" />
                <el-option v-for="tp in tpWhOptions" :key="tp" :label="tp" :value="tp" />
              </el-select>
            </div>

            <div class="filter-group">
              <span class="filter-label">仓库名称:</span>
              <el-select
                v-model="completenessWarehouseName"
                placeholder="全部仓库"
                size="small"
                clearable
                style="width: 145px;"
              >
                <el-option label="全部仓库" value="全部" />
                <el-option v-for="wh in completenessWarehouseOptions" :key="wh" :label="wh" :value="wh" />
              </el-select>
            </div>

            <div class="filter-group search-input-box">
              <el-input
                v-model="completenessSearchKey"
                placeholder="搜索 父/子物料编码 / SKU / ASIN..."
                prefix-icon="Search"
                clearable
                size="small"
                style="width: 260px;"
                @keyup.enter="handleCompletenessSearch"
              />
            </div>

            <div class="flex-center" style="gap: 8px;">
              <el-button type="primary" plain icon="Search" size="small" @click="handleCompletenessSearch">
                查询
              </el-button>
              <el-button plain icon="RefreshRight" size="small" @click="handleCompletenessReset">
                重置
              </el-button>
            </div>

            <div class="toolbar-right flex-center gap-10" style="margin-left: auto;">
              <button 
                class="rule-toggle-btn btn-alert-logic"
                :class="{ active: activeRuleTab === 'alertLogic' }"
                @click="handleToggleRuleTab('alertLogic')"
              >
                <span class="btn-icon-wrapper amber-icon"><el-icon><Warning /></el-icon></span>
                <span class="btn-text">预警等级计算逻辑</span>
                <span class="arrow-icon">{{ activeRuleTab === 'alertLogic' ? '▴' : '▾' }}</span>
              </button>

              <button 
                class="rule-toggle-btn btn-calc-rule"
                :class="{ active: activeRuleTab === 'calculationRule' }"
                @click="handleToggleRuleTab('calculationRule')"
              >
                <span class="btn-icon-wrapper blue-icon"><el-icon><InfoFilled /></el-icon></span>
                <span class="btn-text">齐套算量规则说明</span>
                <span class="arrow-icon">{{ activeRuleTab === 'calculationRule' ? '▴' : '▾' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 规则与计算逻辑全览卡片面板 -->
        <transition name="panel-fade">
          <div v-show="activeRuleTab !== null" class="rule-details-panel mb-16">
            <!-- 右上角轻量收起按钮 -->
            <button class="panel-corner-close-btn" @click="activeRuleTab = null" title="收起说明面板">
              <el-icon><Close /></el-icon>
            </button>

            <!-- 模式 1: 预警等级计算逻辑 -->
            <div v-show="activeRuleTab === 'alertLogic'" class="rule-view-content">
              <!-- 4 大等级详解卡片网格 -->
              <div class="alert-logic-grid">
                <!-- 卡片 1: 严重断货 (0套) -->
                <div class="logic-card is-danger">
                  <div class="logic-card-header">
                    <div class="flex items-center gap-6">
                      <span class="level-priority-tag priority-p0">P0 停摆级</span>
                      <span class="level-title text-rose-700">严重断货 (0套)</span>
                    </div>
                    <span class="formula-code-badge code-danger">min(各件套数) === 0</span>
                  </div>
                  <div class="logic-card-body">
                    <div class="logic-info-row">
                      <span class="info-tag tag-condition">判定条件</span>
                      <span class="info-content">存在任一关键子物料在库物理库存为 0（支撑套数归零）。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-impact">业务影响</span>
                      <span class="info-content">整套商品不可售，直接面临停售断货风险，对链接权重产生不可逆打击。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-action action-p0">加急行动</span>
                      <span class="info-content action-text"><b>紧急加急采购/调拨！</b> 锁定为 0 的孤立短板加急直发该仓，优先恢复基础可售。</span>
                    </div>
                    <div class="logic-example-box example-danger">
                      <span class="example-label">典型场景:</span>
                      <span>配比(A:1, B:2)；A部件在库0件、B在库200件 ➔ 实际可售 0 套（整套瘫痪）。</span>
                    </div>
                  </div>
                </div>

                <!-- 卡片 2: 协同短板 (N款) -->
                <div class="logic-card is-warning">
                  <div class="logic-card-header">
                    <div class="flex items-center gap-6">
                      <span class="level-priority-tag priority-p1">P1 协同级</span>
                      <span class="level-title text-amber-700">协同短板 (N款)</span>
                    </div>
                    <span class="formula-code-badge code-warning">套数 &gt; 0 且 短板数 ≥ 2</span>
                  </div>
                  <div class="logic-card-body">
                    <div class="logic-info-row">
                      <span class="info-tag tag-condition">判定条件</span>
                      <span class="info-content">存在 2 款及以上子部件并列处于该仓最低套数，构成多瓶颈制约木桶。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-impact">业务影响</span>
                      <span class="info-content">单补任意一款短板均无法增加整套可售套数，极易造成采购资金与仓租浪费。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-action action-p1">协同行动</span>
                      <span class="info-content action-text"><b>必须协同同步采购！</b> 严格按 BOM 配比协同补齐所有并列短板，避免次生积压。</span>
                    </div>
                    <div class="logic-example-box example-warning">
                      <span class="example-label">典型场景:</span>
                      <span>A部件折算20套，B部件折算20套，C部件100套 ➔ A与B必须同时采购补齐80套。</span>
                    </div>
                  </div>
                </div>

                <!-- 卡片 3: 单物料短板 -->
                <div class="logic-card is-info">
                  <div class="logic-card-header">
                    <div class="flex items-center gap-6">
                      <span class="level-priority-tag priority-p2">P2 突破级</span>
                      <span class="level-title text-sky-700">单物料短板</span>
                    </div>
                    <span class="formula-code-badge code-info">套数 &gt; 0 且 短板数 === 1</span>
                  </div>
                  <div class="logic-card-body">
                    <div class="logic-info-row">
                      <span class="info-tag tag-condition">判定条件</span>
                      <span class="info-content">整套商品仅受制于单一款卡脖子部件，其余所有部件套数充盈富余。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-impact">业务影响</span>
                      <span class="info-content">整套商品受制于单一孤立瓶颈，长板部件产生高额库存积压与资金沉淀。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-action action-p2">突破行动</span>
                      <span class="info-content action-text"><b>定向精准突破！</b> 投产比最高阶段，单补该款短板即可全额释放长板存量价值。</span>
                    </div>
                    <div class="logic-example-box example-info">
                      <span class="example-label">典型场景:</span>
                      <span>A部件折算10套，B部件折算100套 ➔ 仅需单补A部件90套，立即可售100套。</span>
                    </div>
                  </div>
                </div>

                <!-- 卡片 4: 齐套平衡 (健康) -->
                <div class="logic-card is-success">
                  <div class="logic-card-header">
                    <div class="flex items-center gap-6">
                      <span class="level-priority-tag priority-p3">P3 健康级</span>
                      <span class="level-title text-emerald-700">齐套平衡 (健康)</span>
                    </div>
                    <span class="formula-code-badge code-success">currentSets === targetSets</span>
                  </div>
                  <div class="logic-card-body">
                    <div class="logic-info-row">
                      <span class="info-tag tag-condition">判定条件</span>
                      <span class="info-content">该仓所有子物料折算套数完全齐平，无任何多余积压或缺料短板。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-impact">业务影响</span>
                      <span class="info-content">仓库物理存量结构完美匹配 BOM 配比，零部件无冗余，资金周转率最高。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-action action-p3">常规运维</span>
                      <span class="info-content action-text"><b>维持常规运转！</b> 物理存量健康，不产生预警，维持常规周转备货节奏。</span>
                    </div>
                    <div class="logic-example-box example-success">
                      <span class="example-label">典型场景:</span>
                      <span>A部件折算50套，B部件折算50套 ➔ 实际50套，目标50套，缺口为 0 套。</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 模式 2: 齐套算量规则说明 -->
            <div v-show="activeRuleTab === 'calculationRule'" class="rule-view-content">
              <!-- 4 大计算规则卡片网格 -->
              <div class="alert-logic-grid">
                <!-- 卡片 1: 单部件折算套数 -->
                <div class="logic-card is-info">
                  <div class="logic-card-header">
                    <div class="flex items-center gap-6">
                      <span class="level-priority-tag priority-p2">Step 1</span>
                      <span class="level-title text-sky-700">单部件折算套数</span>
                    </div>
                    <span class="formula-code-badge code-info">floor(物理在库 / 配比)</span>
                  </div>
                  <div class="logic-card-body">
                    <div class="logic-info-row">
                      <span class="info-tag tag-condition">计算原理</span>
                      <span class="info-content">将各子部件物理在库库存除以 BOM 配比向下取整，折算为整套物理支撑力。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-impact">核心作用</span>
                      <span class="info-content">抹平螺丝、五金、主板等不同包装件数差异，统一转换到“整套商品”唯一量纲。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-action action-p2">关键细节</span>
                      <span class="info-content action-text"><b>严格向下取整！</b> 散件无法组成完整商品，零头散件暂不计入整套有效可售。</span>
                    </div>
                    <div class="logic-example-box example-info">
                      <span class="example-label">算例参考:</span>
                      <span>A物料在库 55 件，BOM配比为 2 ➔ 折算套数 = floor(55 / 2) = 27 套（余 1 件散件）。</span>
                    </div>
                  </div>
                </div>

                <!-- 卡片 2: 实际可售 vs 目标齐套 -->
                <div class="logic-card is-warning">
                  <div class="logic-card-header">
                    <div class="flex items-center gap-6">
                      <span class="level-priority-tag priority-p1">Step 2</span>
                      <span class="level-title text-amber-700">实际可售 vs 目标齐套</span>
                    </div>
                    <span class="formula-code-badge code-warning">min() vs max()</span>
                  </div>
                  <div class="logic-card-body">
                    <div class="logic-info-row">
                      <span class="info-tag tag-condition">计算原理</span>
                      <span class="info-content">木桶最短板决定实际可售（min）；以该仓充盈最高的长板部件作为目标齐套（max）。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-impact">核心作用</span>
                      <span class="info-content">消除盲目采购，明确将整套短板追平至长板所需的差额（缺口套数 = 目标 - 实际）。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-action action-p1">关键细节</span>
                      <span class="info-content action-text"><b>锁定补货上限！</b> 杜绝盲目按最大需求多备长板部件，牢牢锁住上限，严控库存积压。</span>
                    </div>
                    <div class="logic-example-box example-warning">
                      <span class="example-label">算例参考:</span>
                      <span>A部件27套(短板)，B部件80套(长板) ➔ 实际可售27套，目标80套，缺口53套。</span>
                    </div>
                  </div>
                </div>

                <!-- 卡片 3: 协同补齐法则 -->
                <div class="logic-card is-danger">
                  <div class="logic-card-header">
                    <div class="flex items-center gap-6">
                      <span class="level-priority-tag priority-p0">Step 3</span>
                      <span class="level-title text-rose-700">协同补齐法则</span>
                    </div>
                    <span class="formula-code-badge code-danger">毛缺口 = 缺口套数 × 配比</span>
                  </div>
                  <div class="logic-card-body">
                    <div class="logic-info-row">
                      <span class="info-tag tag-condition">计算原理</span>
                      <span class="info-content">存在多款并列短板时必须协同同步采购；毛缺口折算为工厂采购物理件数。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-impact">核心作用</span>
                      <span class="info-content">确保下达的采购量能精确满足整套齐套要求，杜绝因单品补单引发次生短板。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-action action-p0">关键细节</span>
                      <span class="info-content action-text"><b>同步下单与发运！</b> 确保所有短板部件同时入仓，单补一款不会释放任何整套可售。</span>
                    </div>
                    <div class="logic-example-box example-danger">
                      <span class="example-label">算例参考:</span>
                      <span>缺口53套，A配比为2、C配比为1 ➔ A需补 106 件，C需补 53 件，两款必须协同补。</span>
                    </div>
                  </div>
                </div>

                <!-- 卡片 4: 在途冲抵免重采 -->
                <div class="logic-card is-success">
                  <div class="logic-card-header">
                    <div class="flex items-center gap-6">
                      <span class="level-priority-tag priority-p3">Step 4</span>
                      <span class="level-title text-emerald-700">在途冲抵免重采</span>
                    </div>
                    <span class="formula-code-badge code-success">净缺口 = max(0, 毛缺口 - 在途)</span>
                  </div>
                  <div class="logic-card-body">
                    <div class="logic-info-row">
                      <span class="info-tag tag-condition">计算原理</span>
                      <span class="info-content">自动结合采购在途与海运在途物流，直接抵扣毛缺口；在途充足时自动标记覆盖。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-impact">核心作用</span>
                      <span class="info-content">杜绝计划员与采购员因看到缺料而重复下单，最大化节省流动资金和海外仓租。</span>
                    </div>
                    <div class="logic-info-row">
                      <span class="info-tag tag-action action-p3">关键细节</span>
                      <span class="info-content action-text"><b>免二次采购！</b> 若在途数量 ≥ 毛缺口，系统自动提示「在途已足额覆盖」，建议补货 0 件。</span>
                    </div>
                    <div class="logic-example-box example-success">
                      <span class="example-label">算例参考:</span>
                      <span>A部件毛缺口 106 件，已有采购在途 120 件 ➔ 净缺口 0 件，建议采购 0 件。</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- 3. 预警数据表格 (无噪点、突出核心指标与行动点) -->
        <el-table
          :data="alertTableDataWithSpans"
          border
          stripe
          show-summary
          :summary-method="getCompletenessSummary"
          :span-method="handleCompletenessSpanMethod"
          size="default"
          style="width: 100%;"
          class="completeness-clean-table"
        >
          <!-- 1. 物料编码 (同物料合并展示，点击查看 BOM 明细) -->
          <el-table-column label="物料编码" min-width="150" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="flex-center">
                <el-tooltip content="点击查看 BOM 明细" placement="top" :show-after="200">
                  <span
                    class="parent-code font-bold mr-4 text-primary cursor-pointer hover:underline"
                    @click.stop="handleViewBomDetailFromAlert(row)"
                  >
                    {{ row.parentCode.replace(/\s*\(.*?\)\s*$/, '') }}
                  </span>
                </el-tooltip>
                <el-tooltip content="复制物料编码" placement="top" :hide-after="1000">
                  <el-button
                    type="primary"
                    link
                    size="small"
                    icon="CopyDocument"
                    class="copy-btn"
                    @click.stop="handleCopyText(row.parentCode.replace(/\s*\(.*?\)\s*$/, ''), '物料编码')"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>

          <!-- 2. 产品名称 (带缩略图，同物料合并展示) -->
          <el-table-column label="产品名称" min-width="155" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="prod-name-cell flex items-center gap-8">
                <el-image
                  :src="row.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=160&auto=format&fit=crop&q=80'"
                  class="prod-img"
                  fit="cover"
                  style="width: 32px; height: 32px; border-radius: 4px; border: 1px solid #e2e8f0; flex-shrink: 0;"
                />
                <span class="name-text text-slate-700 text-xs" :title="row.productName">{{ row.productName }}</span>
              </div>
            </template>
          </el-table-column>

          <!-- 3. 海外仓 (三方服务商，同仓合并展示) -->
          <el-table-column label="海外仓" prop="tpOverseasWh" width="105" align="center">
            <template #default="{ row }">
              <el-tag size="small" type="primary" effect="plain" class="font-bold">
                {{ row.tpOverseasWh || '西邮' }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 4. 仓库 (具体物理仓) -->
          <el-table-column label="仓库" prop="warehouseName" width="105" align="center">
            <template #default="{ row }">
              <span class="text-xs text-slate-700 font-semibold font-mono">{{ row.warehouseName }}</span>
            </template>
          </el-table-column>

          <!-- 5. 预警等级 (紧邻仓库后面，独立区分每个仓库的齐套短板等级) -->
          <el-table-column prop="alertType" width="135" align="center">
            <template #header>
              <div class="flex-center gap-4 cursor-pointer">
                <span>预警等级</span>
                <el-tooltip placement="top" :show-after="100">
                  <template #content>
                    <div style="max-width: 330px; line-height: 1.6; font-size: 12px; padding: 4px;">
                      <div style="font-weight: 700; color: #60a5fa; margin-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 3px;">
                        预警等级计算逻辑（木桶短板模型）
                      </div>
                      <div style="margin-bottom: 5px; color: #cbd5e1;">
                        <b>核心公式：</b><br/>
                        • 子件套数 = floor(在库 / 配比)<br/>
                        • 实际可售 = min(各子件套数)<br/>
                        • 目标齐套 = max(各子件套数)
                      </div>
                      <div style="margin-bottom: 4px;">
                        <span style="color: #f87171; font-weight: 700;">● 严重断货 (0套)：</span>可售为 0，任一子件缺货导致整套停摆（需加急）
                      </div>
                      <div style="margin-bottom: 4px;">
                        <span style="color: #fbbf24; font-weight: 700;">● 协同短板 (N款)：</span>并列最低短板 ≥ 2 款，单补一款无法增加整套（需同步协同补）
                      </div>
                      <div>
                        <span style="color: #93c5fd; font-weight: 700;">● 单物料短板：</span>仅 1 款短板卡脖子，定向补齐即可释放套数（投产比最高）
                      </div>
                    </div>
                  </template>
                  <el-icon class="text-slate-400 hover:text-primary"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <el-tooltip v-if="row.explanation" :content="row.explanation" placement="top" :show-after="200">
                <el-tag
                  size="small"
                  :type="row.alertType === '断货归零' ? 'danger' : row.alertType === '多物料共同短板' ? 'warning' : 'info'"
                  effect="plain"
                  class="font-bold cursor-pointer"
                >
                  <span v-if="row.alertType === '断货归零'">严重断货 (0套)</span>
                  <span v-else-if="row.alertType === '多物料共同短板'">协同短板 ({{ row.bottleneckCount }})</span>
                  <span v-else>单物料短板</span>
                </el-tag>
              </el-tooltip>
              <template v-else>
                <el-tag
                  size="small"
                  :type="row.alertType === '断货归零' ? 'danger' : row.alertType === '多物料共同短板' ? 'warning' : 'info'"
                  effect="plain"
                  class="font-bold"
                >
                  <span v-if="row.alertType === '断货归零'">严重断货 (0套)</span>
                  <span v-else-if="row.alertType === '多物料共同短板'">协同短板 ({{ row.bottleneckCount }})</span>
                  <span v-else>单物料短板</span>
                </el-tag>
              </template>
            </template>
          </el-table-column>

          <!-- 6. 实际可售 / 目标充盈 (重点突出：现存 vs 缺口) -->
          <el-table-column label="实际可售 / 目标" width="135" align="center">
            <template #default="{ row }">
              <div class="flex-column items-center">
                <div class="font-mono">
                  <span class="text-base font-bold" :class="row.currentSets === 0 ? 'text-rose-600' : 'text-emerald-600'">
                    {{ row.currentSets }}
                  </span>
                  <span class="text-slate-400 text-xs"> / {{ row.targetSets }} 套</span>
                </div>
                <div class="mt-2">
                  <span class="text-xs font-semibold px-6 py-1 rounded font-mono" :class="row.currentSets === 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'">
                    缺口 {{ row.gapSets }} 套
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 7. 短板子物料 (视觉降噪：清爽单行排版，去除冗余短板标签与配比) -->
          <el-table-column label="短板子物料" min-width="160">
            <template #default="{ row }">
              <div class="flex-column gap-6">
                <div
                  v-for="item in row.shortageItems"
                  :key="item.childCode"
                  class="flex items-center justify-between text-xs py-2 border-b border-slate-50 last:border-b-0"
                >
                  <div class="flex items-center gap-4">
                    <el-tooltip :content="`配比 1:${item.bomRatio} · 点击查看关联父物料清单`" placement="top" :show-after="200">
                      <span
                        class="font-mono font-bold text-slate-800 cursor-pointer hover:text-primary hover:underline"
                        @click="handleViewChildLinkedParents(item.childCode)"
                      >
                        {{ item.childCode }}
                      </span>
                    </el-tooltip>
                  </div>
                  <div class="font-mono text-xs">
                    <span :class="item.childStock === 0 ? 'text-rose-600 font-bold' : 'text-slate-700'">{{ item.childStock }} 件</span>
                    <span class="text-slate-400"> ({{ item.currentSets }}套)</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 8. 补货建议 (在途冲抵) (视觉降噪：覆盖标记 vs 需补数字) -->
          <el-table-column label="采购/补货建议 (在途冲抵)" min-width="210">
            <template #default="{ row }">
              <div class="flex-column gap-6">
                <div
                  v-for="item in row.shortageItems"
                  :key="item.childCode"
                  class="flex-column text-xs py-2 border-b border-slate-50 last:border-b-0"
                >
                  <template v-if="item.netShortageQty === 0">
                    <div class="flex items-center gap-4 text-emerald-600 font-medium">
                      <el-icon><CircleCheck /></el-icon>
                      <span>在途已足额覆盖</span>
                      <span class="text-slate-400 font-mono text-2xs ml-auto">在途 +{{ item.transitQty }}件</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="flex items-center justify-between font-mono">
                      <span class="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-4 py-1 rounded">
                        需补 +{{ item.suggestedQty }} 件
                      </span>
                      <span class="text-slate-500 text-2xs">
                        净缺口 <b class="text-rose-600">{{ item.netShortageQty }}</b> 件
                      </span>
                    </div>
                    <div class="text-2xs text-slate-400 mt-2 font-mono flex items-center justify-between">
                      <span>在途: {{ item.transitQty > 0 ? '+' + item.transitQty : '0' }} 件</span>
                      <span class="text-slate-400">({{ item.childCode }})</span>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 9. 操作列 (多维操作联动) -->
          <el-table-column label="操作" width="95" align="center" fixed="right">
            <template #default="{ row }">
              <div class="flex-center">
                <el-button type="primary" size="small" link @click="handlePenetrateDetailFromAlert(row)">
                  穿透算量
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-wrapper mt-16 flex-between">
          <div class="text-xs text-slate-500">
            共 <b>{{ filteredCompletenessAlertData.length }}</b> 项齐套与缺料预警，当前第 <b>{{ completenessCurrentPage }}</b> / <b>{{ Math.ceil(filteredCompletenessAlertData.length / completenessPageSize) || 1 }}</b> 页
          </div>
          <el-pagination
            v-model:current-page="completenessCurrentPage"
            v-model:page-size="completenessPageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="filteredCompletenessAlertData.length"
          />
        </div>
      </div>
    </div>

    <!-- 弹窗 0: 子物料关联绑定的父物料清单 (点击任意子物料可查看绑定的父组合物料清单、用量配比及海外仓库存) -->
    <el-dialog
      v-model="childLinkedParentsDialogVisible"
      width="1140px"
      destroy-on-close
      class="child-linked-parents-dialog"
    >
      <template #header>
        <div class="dialog-custom-header">
          <div class="header-title-box">
            <span class="main-title">子物料关联绑定的父物料清单</span>
            <span class="sub-badge">BOM 关系穿透</span>
          </div>
          <div class="header-tip-text">
            查看子物料 <b>{{ currentViewingChildCode }}</b> 被哪些组合父物料 BOM 选用绑定、配比用量及海外仓配套可售套数
          </div>
        </div>
      </template>

      <div class="child-linked-parents-body">
        <!-- 顶部: 子物料基础档案卡片 -->
        <div class="child-meta-overview-card mb-16">
          <div class="child-meta-left">
            <el-image
              :src="getChildMaterialImage(currentViewingChildCode)"
              :preview-src-list="[getChildMaterialImage(currentViewingChildCode)]"
              preview-teleported
              fit="cover"
              class="child-avatar-img"
            />
            <div class="child-meta-main">
              <div class="child-title-row">
                <el-tag size="small" type="info" effect="dark" class="mr-8">子物料</el-tag>
                <span class="child-code-display">{{ currentViewingChildCode }}</span>
                <el-tooltip content="复制子物料编码" placement="top" :hide-after="1000">
                  <el-button
                    type="primary"
                    link
                    size="small"
                    icon="CopyDocument"
                    class="copy-btn ml-4"
                    @click.stop="handleCopyText(currentViewingChildCode, '子物料编码')"
                  />
                </el-tooltip>
                <span class="child-name-display ml-12">
                  {{ currentViewingChildMeta?.childProductName || currentViewingChildMeta?.childName || currentViewingChildCode }}
                </span>
                <el-tag size="default" type="primary" effect="plain" class="ml-auto font-medium">
                  共绑定 {{ allCurrentBoundParents.length }} 款组合父物料
                </el-tag>
              </div>

              <div class="child-props-grid mt-10">
                <div class="prop-item"><span class="prop-label">款式:</span><span class="prop-val">{{ currentViewingChildMeta?.childStyle || '-' }}</span></div>
                <div class="prop-item"><span class="prop-label">主材料:</span><span class="prop-val">{{ currentViewingChildMeta?.childMaterial || '-' }}</span></div>
                <div class="prop-item"><span class="prop-label">适用品牌/机型:</span><span class="prop-val">{{ currentViewingChildMeta?.childTarget || '-' }}</span></div>
                <div class="prop-item"><span class="prop-label">型号:</span><span class="prop-val">{{ currentViewingChildMeta?.childModel || '-' }}</span></div>
                <div class="prop-item"><span class="prop-label">公司品牌:</span><span class="prop-val">{{ currentViewingChildMeta?.childBrand || '-' }}</span></div>
                <div class="prop-item"><span class="prop-label">颜色:</span><span class="prop-val">{{ currentViewingChildMeta?.childColor || '-' }}</span></div>
                <div class="prop-item"><span class="prop-label">包装数量:</span><span class="prop-val">{{ currentViewingChildMeta?.childPackQty || '-' }}</span></div>
              </div>
            </div>
          </div>
          
          <div class="child-stock-summary-box">
            <div class="stock-sum-title">海外仓物理库存汇总</div>
            <div class="stock-sum-row">
              <span class="sum-lbl">全仓可售:</span>
              <span class="sum-val num-bold">{{ currentViewingChildTotalAvail.toLocaleString() }} 件</span>
            </div>
            <div class="stock-sum-row">
              <span class="sum-lbl">全仓在途:</span>
              <span class="sum-val num-blue">+{{ currentViewingChildTotalTransit.toLocaleString() }} 件</span>
            </div>
            <div class="stock-sum-wh-count text-xs text-slate-400 mt-4">
              分布在 {{ currentViewingChildStock.length }} 个海外仓明细
            </div>
          </div>
        </div>

        <!-- 列表工具栏 -->
        <div class="bound-parents-toolbar flex-between mb-12">
          <div class="toolbar-left flex-center">
            <span class="text-sm font-semibold text-slate-700 mr-8">
              绑定的父组合物料清单
            </span>
            <span class="text-xs text-slate-500">
              (共 <b>{{ filteredCurrentBoundParents.length }}</b> 款父物料)
            </span>
          </div>

          <div class="toolbar-right flex-center">
            <el-input
              v-model="childBoundParentsSearchKey"
              placeholder="搜索父组合物料编码 / SKU / 产品名称 / 款式..."
              prefix-icon="Search"
              clearable
              size="small"
              style="width: 280px;"
            />
          </div>
        </div>

        <!-- 表格: 关联父物料清单 -->
        <el-table
          :data="filteredCurrentBoundParents"
          border
          stripe
          size="small"
          max-height="380"
          style="width: 100%;"
        >
          <el-table-column type="index" label="#" width="45" align="center" />
          
          <!-- 父物料图片 -->
          <el-table-column label="父物料图片" width="75" align="center">
            <template #default="{ row }">
              <div class="flex-center">
                <el-image
                  :src="row.image || getChildMaterialImage(row.parentCode)"
                  :preview-src-list="[row.image || getChildMaterialImage(row.parentCode)]"
                  preview-teleported
                  fit="cover"
                  style="width: 36px; height: 36px; border-radius: 4px; border: 1px solid #e2e8f0; cursor: pointer;"
                />
              </div>
            </template>
          </el-table-column>

          <!-- 父组合物料编码 -->
          <el-table-column label="父组合物料编码" min-width="155">
            <template #default="{ row }">
              <div class="flex-center">
                <span class="font-bold text-slate-800 font-mono">{{ row.parentCode }}</span>
                <el-tooltip content="复制父组合物料编码" placement="top" :hide-after="1000">
                  <el-button
                    type="primary"
                    link
                    size="small"
                    icon="CopyDocument"
                    class="copy-btn ml-4"
                    @click.stop="handleCopyText(row.parentCode, '父组合物料编码')"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>

          <!-- 父产品名称 -->
          <el-table-column label="父产品名称" prop="productName" min-width="140" show-overflow-tooltip />

          <!-- 款式 -->
          <el-table-column label="款式" prop="style" width="100" align="center" show-overflow-tooltip />

          <!-- 主材料 -->
          <el-table-column label="主材料" prop="material" min-width="110" show-overflow-tooltip />

          <!-- 组合类型 -->
          <el-table-column label="组合类型" width="105" align="center">
            <template #default="{ row }">
              <el-tag
                size="small"
                :type="getComboTypeMeta(row.comboType).tagType"
                effect="light"
              >
                {{ row.comboType }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 公司品牌 -->
          <el-table-column label="公司品牌" prop="brand" width="95" align="center" show-overflow-tooltip />

          <!-- 颜色 -->
          <el-table-column label="颜色" prop="color" width="95" align="center" show-overflow-tooltip />

          <!-- 包装数量 -->
          <el-table-column label="包装数量" prop="packQty" width="90" align="center" />

          <!-- BOM 配比用量 -->
          <el-table-column label="BOM 配比用量" width="120" align="center">
            <template #default="{ row }">
              <el-tag size="small" type="primary" effect="plain" class="font-bold">
                1 父 : {{ row.ratio }} 子
              </el-tag>
            </template>
          </el-table-column>

          <!-- 绑定状态 -->
          <el-table-column label="绑定状态" width="85" align="center">
            <template #default>
              <el-tag size="small" type="success">已绑定</el-tag>
            </template>
          </el-table-column>

          <!-- 海外仓折算可售套数 -->
          <el-table-column label="海外仓可售套数" width="125" align="right">
            <template #default="{ row }">
              <span class="num-bold" v-if="row.availableSets !== undefined">{{ row.availableSets.toLocaleString() }} 套</span>
              <span class="text-slate-400 text-xs" v-else>按需折算</span>
            </template>
          </el-table-column>

          <!-- 快捷联动 -->
          <el-table-column label="快捷联动" width="150" align="center" fixed="right">
            <template #default="{ row }">
              <el-button
                type="primary"
                link
                size="small"
                icon="DataAnalysis"
                @click="handleGoToKanbanForParent(row.parentCode)"
                title="切换到看板并检索该父物料"
              >
                查看看板
              </el-button>
              <el-button
                type="primary"
                link
                size="small"
                icon="Connection"
                @click="handleGoToBindingForParent(row.parentCode)"
                title="切换到父子物料绑定关系页面查看"
              >
                BOM详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <div class="dialog-footer flex-between">
          <div class="text-xs text-slate-500">
            * 提示：点击操作栏中的【查看看板】或【BOM详情】可快速穿透跳转至对应模块。
          </div>
          <el-button @click="childLinkedParentsDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 弹窗 1: 新增跟踪 ASIN 弹窗 (表格展示 ASIN 候选池，支持按账号、站点、ASIN/SKU 查询后批量勾选添加) -->
    <el-dialog
      v-model="addAsinDialogVisible"
      width="1180px"
      destroy-on-close
      class="candidate-asin-dialog"
    >
      <template #header>
        <div class="dialog-custom-header">
          <div class="header-title-box">
            <span class="main-title">新增跟踪 ASIN</span>
            <span class="sub-badge">候选池检索与批量添加</span>
          </div>
          <div class="header-tip-text">
            已智能对比当前跟踪库，可按账号、站点、ASIN 或 SKU 查询后批量勾选入库
          </div>
        </div>
      </template>

      <div class="candidate-filter-container">
        <div class="filter-flex-row">
          <div class="filter-left-group">
            <div class="filter-field">
              <span class="field-label">平台</span>
              <el-select v-model="candidateFilterPlatform" placeholder="全部平台" size="default" style="width: 120px;" clearable>
                <el-option label="全部平台" value="全部" />
                <el-option v-for="plat in platformOptions" :key="plat" :label="plat" :value="plat" />
              </el-select>
            </div>

            <div class="filter-field">
              <span class="field-label">账号</span>
              <el-select v-model="candidateFilterAccount" placeholder="全部账号" size="default" style="width: 130px;" clearable>
                <el-option label="全部账号" value="全部" />
                <el-option v-for="acc in candidateAccountOptions" :key="acc" :label="acc" :value="acc" />
              </el-select>
            </div>

            <div class="filter-field">
              <span class="field-label">站点</span>
              <el-select v-model="candidateFilterSite" placeholder="全部站点" size="default" style="width: 125px;" clearable>
                <el-option label="全部站点" value="全部" />
                <el-option v-for="st in candidateSiteOptions" :key="st.value" :label="st.label" :value="st.value" />
              </el-select>
            </div>

            <div class="filter-field">
              <span class="field-label">查询</span>
              <el-input
                v-model="candidateSearchKey"
                placeholder="输入 ASIN / SKU / 物料编码 / 产品名称..."
                prefix-icon="Search"
                clearable
                size="default"
                style="width: 320px;"
              />
            </div>

            <el-checkbox v-model="candidateOnlyUntracked" label="仅看未跟踪" size="default" class="untracked-checkbox" />
          </div>

          <div class="filter-right-group">
            <el-button size="default" icon="RefreshLeft" @click="handleResetCandidateFilter">重置筛选</el-button>
            <el-button type="primary" plain size="default" icon="Plus" @click="handleOpenManualAddModal">手动单条录入</el-button>
          </div>
        </div>
      </div>

      <!-- 候选 ASIN 列表 -->
      <div class="candidate-table-wrapper">
        <el-table
          ref="candidateTableRef"
          :data="paginatedCandidateList"
          row-key="rowKey"
          border
          stripe
          size="default"
          max-height="460px"
          style="width: 100%;"
          @selection-change="handleCandidateSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" :selectable="canSelectCandidateRow" />
          <el-table-column label="平台" prop="platform" width="95" align="center">
            <template #default="{ row }">
              <el-tag size="small" effect="plain" class="platform-tag" :class="getPlatformTagClass(row.platform)">
                {{ row.platform || 'Amazon' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="账号" prop="account" width="100" align="center">
            <template #default="{ row }">
              <span class="account-badge">{{ row.account }}</span>
            </template>
          </el-table-column>
          <el-table-column label="站点" width="95" align="center">
            <template #default="{ row }">
              <span class="site-badge">
                <span class="flag-icon">{{ getSiteFlagEmoji(row.site) }}</span>
                <span>{{ row.site }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="ASIN" prop="asin" width="135" align="center">
            <template #default="{ row }">
              <span class="asin-code-text">{{ row.asin }}</span>
            </template>
          </el-table-column>
          <el-table-column label="销售 SKU" prop="sku" min-width="170" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="sku-code-text font-mono">{{ row.sku }}</span>
            </template>
          </el-table-column>
          <el-table-column label="对应物料编码" prop="materialCode" min-width="190" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="mat-code-text font-mono font-semibold">{{ row.materialCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品名称" prop="productName" min-width="150" show-overflow-tooltip />
          <el-table-column label="款式" prop="style" width="115" show-overflow-tooltip />
          <el-table-column label="颜色" prop="color" width="85" align="center" />
          <el-table-column label="包装数量" prop="packQty" width="85" align="center">
            <template #default="{ row }">
              <span class="font-mono text-xs text-slate-600">{{ row.packQty || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="跟踪状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="isRowAlreadyTracked(row)" size="small" type="info" effect="plain">已在跟踪</el-tag>
              <el-tag v-else size="small" type="success" effect="plain">可添加</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <div class="candidate-pagination-bar">
          <div class="pagination-info text-xs text-slate-500">
            候选池共 <b>{{ filteredCandidateList.length }}</b> 项 ASIN，当前显示第 <b>{{ candidateCurrentPage }}</b> / <b>{{ Math.ceil(filteredCandidateList.length / candidatePageSize) || 1 }}</b> 页
          </div>
          <el-pagination
            v-model:current-page="candidateCurrentPage"
            v-model:page-size="candidatePageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            :total="filteredCandidateList.length"
            size="small"
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer-content">
          <div class="selected-summary">
            <span>已勾选 <b class="count-highlight">{{ selectedCandidateRows.length }}</b> 项 ASIN</span>
            <span v-if="selectedCandidateRows.length > 0" class="sub-ready-tip">
              (可添加: {{ selectableCountInSelection }} 项)
            </span>
          </div>
          <div class="footer-actions">
            <el-button @click="addAsinDialogVisible = false">取消</el-button>
            <el-button
              type="primary"
              :disabled="selectedCandidateRows.length === 0"
              icon="Plus"
              @click="handleConfirmBatchAddAsin"
            >
              批量添加到跟踪列表 (已选 {{ selectedCandidateRows.length }} 项)
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 弹窗 1.1: 编辑跟踪 ASIN Dialog -->
    <el-dialog
      v-model="editAsinDialogVisible"
      title="编辑跟踪 ASIN 信息"
      width="560px"
      destroy-on-close
    >
      <el-form :model="asinForm" label-width="120px" size="default">
        <el-form-item label="平台" required>
          <el-select v-model="asinForm.platform" placeholder="请选择平台" style="width: 100%;">
            <el-option v-for="plat in platformOptions" :key="plat" :label="plat" :value="plat" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号" required>
          <el-select v-model="asinForm.account" style="width: 100%;">
            <el-option v-for="acc in candidateAccountOptions" :key="acc" :label="acc" :value="acc" />
          </el-select>
        </el-form-item>
        <el-form-item label="站点" required>
          <el-select v-model="asinForm.site" style="width: 100%;">
            <el-option v-for="st in candidateSiteOptions" :key="st.value" :label="st.label" :value="st.value" />
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
        <el-form-item label="跟踪状态">
          <el-radio-group v-model="asinForm.status">
            <el-radio label="正常跟踪">正常跟踪</el-radio>
            <el-radio label="预警关注">预警关注</el-radio>
            <el-radio label="已停售">已停售</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editAsinDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAsinForm">保存修改</el-button>
      </template>
    </el-dialog>

    <!-- 弹窗 1.2: 手动新增单个 ASIN Dialog -->
    <el-dialog
      v-model="manualAddDialogVisible"
      title="手动录入单个跟踪 ASIN"
      width="560px"
      destroy-on-close
    >
      <el-form :model="asinForm" label-width="120px" size="default">
        <el-form-item label="平台" required>
          <el-select v-model="asinForm.platform" placeholder="请选择平台" style="width: 100%;">
            <el-option v-for="plat in platformOptions" :key="plat" :label="plat" :value="plat" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号" required>
          <el-select v-model="asinForm.account" style="width: 100%;">
            <el-option v-for="acc in candidateAccountOptions" :key="acc" :label="acc" :value="acc" />
          </el-select>
        </el-form-item>
        <el-form-item label="站点" required>
          <el-select v-model="asinForm.site" style="width: 100%;">
            <el-option v-for="st in candidateSiteOptions" :key="st.value" :label="st.label" :value="st.value" />
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
        <el-button @click="manualAddDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveManualAddAsin">确认录入</el-button>
      </template>
    </el-dialog>

    <!-- 弹窗 1.3: 批量导入 ASIN 弹窗 (包含美化模板下载、Excel/CSV 文件解析与快捷文本粘贴) -->
    <el-dialog
      v-model="batchImportAsinDialogVisible"
      width="1080px"
      destroy-on-close
      class="batch-import-asin-dialog"
    >
      <template #header>
        <div class="dialog-custom-header">
          <div class="header-title-box">
            <span class="main-title">批量导入跟踪 ASIN</span>
            <span class="sub-badge">Excel / CSV 模板解析导入</span>
          </div>
          <div class="header-tip-text">
            系统支持 6 大核心字段自动映射：平台、账号、站点、ASIN、销售SKU、组合物料编码
          </div>
        </div>
      </template>

      <!-- 顶部指引与模板下载横幅 -->
      <div class="import-guide-banner mb-16">
        <div class="guide-steps-box">
          <div class="step-badge">三步极速导入</div>
          <div class="step-text">
            1. 点击右侧按钮下载美化模板 &nbsp;➔&nbsp; 2. 填写 6 项字段数据 &nbsp;➔&nbsp; 3. 上传 Excel 文件或直接粘贴解析即可批量入库
          </div>
        </div>
        <div class="guide-action-box">
          <el-button type="success" size="default" icon="Download" @click="handleDownloadAsinTemplate">
            下载美化导入模板 (.xlsx)
          </el-button>
        </div>
      </div>

      <!-- 导入模式切换 -->
      <div class="import-mode-tabs mb-14">
        <el-radio-group v-model="importActiveTab" size="default">
          <el-radio-button label="file">
            <el-icon class="mr-4"><UploadFilled /></el-icon> 文件上传解析 (.xlsx / .csv)
          </el-radio-button>
          <el-radio-button label="text">
            <el-icon class="mr-4"><DocumentCopy /></el-icon> 快捷文本粘贴导入 (Ctrl+V)
          </el-radio-button>
        </el-radio-group>
      </div>

      <!-- 模式 1: 文件拖拽上传 -->
      <div v-if="importActiveTab === 'file'" class="file-upload-section mb-16">
        <el-upload
          drag
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          accept=".xlsx, .xls, .csv"
          :on-change="handleFileImportChange"
          class="custom-drag-uploader"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            将填写好的 Excel 或 CSV 文件拖到此处，或 <em>点击选取本地文件上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip text-xs text-secondary mt-6">
              支持 Microsoft Excel (.xlsx / .xls) 或 CSV 文件，系统将自动识别表头并解析 6 大核心字段。
            </div>
          </template>
        </el-upload>
      </div>

      <!-- 模式 2: 快捷文本粘贴 -->
      <div v-else class="text-paste-section mb-16">
        <el-input
          v-model="importPasteText"
          type="textarea"
          :rows="5"
          placeholder="从 Excel 电子表格中直接选中复制行，并在此处快捷粘贴 (Ctrl + V)。&#10;支持格式（制表符或逗号分隔）：&#10;平台	账号	站点	ASIN	销售SKU	组合物料编码&#10;Amazon	MNE	US	B08N5WRWNW	SKU-US-00192	CB-B01*2-PBM-YL-2"
        />
        <div class="paste-actions mt-8 flex-between">
          <span class="text-xs text-secondary">
            提示：可以直接从本地 Excel 复制若干行单元格后在此框粘贴，首行可带表头或不带表头。
          </span>
          <div class="flex-center gap-8">
            <el-button size="small" @click="handleFillSamplePasteText">填充示例数据</el-button>
            <el-button type="primary" size="small" icon="Check" :disabled="!importPasteText.trim()" @click="handleParsePasteText">
              解析文本数据
            </el-button>
          </div>
        </div>
      </div>

      <!-- 数据预览与校验表格 -->
      <div v-if="importParsedList.length" class="parsed-preview-container">
        <div class="preview-header mb-8 flex-between">
          <div class="flex-center gap-8">
            <span class="font-bold text-slate-800 text-sm">解析数据预览与校验</span>
            <el-tag size="small" type="info">共 {{ importParsedList.length }} 行</el-tag>
            <el-tag size="small" type="success">可入库: {{ validImportCount }} 行</el-tag>
            <el-tag v-if="invalidImportCount > 0" size="small" type="danger">格式异常: {{ invalidImportCount }} 行</el-tag>
          </div>
          <el-button type="info" link size="small" icon="Delete" @click="importParsedList = []">清空解析结果</el-button>
        </div>

        <el-table
          :data="importParsedList"
          border
          stripe
          size="small"
          max-height="340px"
          style="width: 100%;"
        >
          <el-table-column type="index" label="#" width="45" align="center" />
          <el-table-column label="平台" prop="platform" width="95" align="center">
            <template #default="{ row }">
              <el-tag size="small" effect="plain">{{ row.platform || 'Amazon' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="账号" prop="account" width="105" align="center">
            <template #default="{ row }">
              <span class="account-badge">{{ row.account }}</span>
            </template>
          </el-table-column>
          <el-table-column label="站点" prop="site" width="85" align="center">
            <template #default="{ row }">
              <span class="site-badge">
                <span class="flag-icon">{{ getSiteFlagEmoji(row.site) }}</span>
                <span>{{ row.site }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="ASIN" prop="asin" width="135" align="center">
            <template #default="{ row }">
              <span class="asin-code-text">{{ row.asin }}</span>
            </template>
          </el-table-column>
          <el-table-column label="销售SKU" prop="sku" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="sku-code-text font-mono">{{ row.sku }}</span>
            </template>
          </el-table-column>
          <el-table-column label="组合物料编码" prop="materialCode" min-width="180" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="mat-code-text font-mono font-semibold">{{ row.materialCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联品名" min-width="140" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="text-xs text-slate-700">
                {{ getComboMetaByMaterialCode(row.materialCode)?.productName || '-' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="校验状态" width="145" align="center">
            <template #default="{ row }">
              <el-tag v-if="!row.isValid" size="small" type="danger" effect="light">
                {{ row.errorMsg || '数据有误' }}
              </el-tag>
              <el-tag v-else-if="row.isAlreadyTracked" size="small" type="warning" effect="light">
                已在跟踪(将覆盖)
              </el-tag>
              <el-tag v-else size="small" type="success" effect="light">
                格式正确(待导入)
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <div class="dialog-footer-content">
          <div class="selected-summary">
            <span v-if="importParsedList.length">
              共解析出 <b>{{ importParsedList.length }}</b> 条，有效待入库 <b class="count-highlight">{{ validImportCount }}</b> 条
            </span>
            <span v-else class="text-secondary text-xs">请先下载美化模板录入数据，或直接在此上传/粘贴解析</span>
          </div>
          <div class="footer-actions">
            <el-button @click="batchImportAsinDialogVisible = false">取消</el-button>
            <el-button
              type="primary"
              :disabled="validImportCount === 0"
              icon="UploadFilled"
              @click="handleConfirmExecuteImport"
            >
              确认批量导入入库 ({{ validImportCount }} 条)
            </el-button>
          </div>
        </div>
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
      title="BOM 穿透算量计算器"
      width="700px"
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
          <span class="formula-desc">父物料穿透可售套数 = Min ( 子物料可售库存 ÷ 绑定配比用量 )</span>
        </div>

        <el-table :data="activePenetrateRow.childMaterials" border stripe size="small" style="width: 100%;">
          <el-table-column label="子物料编码" prop="childCode" width="115" />
          <el-table-column label="子物料名称" prop="childName" min-width="130" show-overflow-tooltip />
          <el-table-column label="单套用量" prop="bomRatio" width="75" align="center" />
          <el-table-column label="可售" prop="availableQty" width="75" align="right" />
          <el-table-column label="在途" prop="transitQty" width="75" align="right">
            <template #default="{ row }">
              <span class="num-blue" v-if="(row.transitQty || 0) > 0">+{{ row.transitQty }}</span>
              <span class="text-muted" v-else>0</span>
            </template>
          </el-table-column>
          <el-table-column label="可折算套数" width="95" align="right">
            <template #default="{ row }">
              <b :class="{ 'text-danger': Math.floor((row.availableQty || 0) / (row.bomRatio || 1)) === activePenetrateRow.calculatedParentAvailable }">
                {{ Math.floor((row.availableQty || 0) / (row.bomRatio || 1)) }} 套
              </b>
            </template>
          </el-table-column>
        </el-table>

        <div class="penetrate-summary-result mt-16 flex items-center justify-between">
          <span class="text-xs text-slate-500">
            * 基于木桶原理公式 Min(各子部件可售 ÷ 配比) 独立算量
          </span>
          <span>
            <span v-if="activePenetrateRow.warehouseName && activePenetrateRow.warehouseName !== '全部' && activePenetrateRow.warehouseName !== '暂无物理库存'">
              【{{ activePenetrateRow.tpOverseasWh }} · {{ activePenetrateRow.warehouseName }}】分仓穿透可售：
            </span>
            <span v-else>
              当前海外仓穿透汇总可售：
            </span>
            <b class="result-num">{{ activePenetrateRow.calculatedParentAvailable }} 套</b>
          </span>
        </div>
      </div>
    </el-dialog>

    <!-- 弹窗 5: 手动新增/编辑父子物料绑定关系 Dialog -->
    <el-dialog
      v-model="bindingDialogVisible"
      :title="isEditBinding ? '编辑父子物料 BOM 绑定关系' : '新增父子物料 BOM 绑定关系'"
      width="720px"
      destroy-on-close
    >
      <!-- 从基础数据库快捷选择 (仅新增模式) -->
      <div v-if="!isEditBinding" class="base-data-picker-box mb-16">
        <div class="picker-header flex-between">
          <div class="picker-title flex-center gap-6">
            <el-icon color="#2563eb"><MagicStick /></el-icon>
            <span class="font-bold text-primary">从组合物料库快速选用</span>
            <el-tag size="small" type="success" effect="plain" class="ml-4">待添加 {{ unaddedComboCount }} 款</el-tag>
          </div>
          <el-button type="primary" link size="small" @click="openBaseLibraryBrowser">
            全览组合物料库手册 &gt;
          </el-button>
        </div>
        <div class="picker-body mt-8">
          <el-select
            v-model="selectedBaseComboCode"
            filterable
            clearable
            placeholder="🔍 输入未添加的组合物料编码、款式、品名搜索选用..."
            style="width: 100%;"
            @change="handleSelectBaseComboFromSelect"
          >
            <el-option
              v-for="item in unaddedFurnitureComboList"
              :key="item.parentCode"
              :label="`${item.parentCode} - ${item.productName} (${item.style} / ${item.color} / ${item.packQty})`"
              :value="item.parentCode"
            >
              <div class="combo-option-row">
                <div class="flex-between">
                  <span class="font-bold text-primary font-mono">{{ item.parentCode }}</span>
                  <el-tag size="small" :type="getComboTypeMeta(item.comboType).tagType" effect="light">
                    {{ item.comboType }} · {{ item.packQty }}
                  </el-tag>
                </div>
                <div class="option-desc text-secondary text-xs mt-2 flex-between">
                  <span>{{ item.productName }} · {{ item.style }} · {{ item.color }} · {{ item.material }}</span>
                  <span class="text-xs font-mono text-muted">[{{ item.children.map(c => `${c.childCode}×${c.ratio}`).join(', ') }}]</span>
                </div>
              </div>
            </el-option>
          </el-select>
        </div>
        <div v-if="selectedBaseComboCode" class="picker-tip mt-6 text-xs text-green flex-center gap-4">
          <span>✨ 已载入组合物料库 BOM：父编码、品名、组合类型 [{{ bindingForm.comboType }}] 及 {{ bindingForm.children.length }} 项子物料用量，可根据需要微调。</span>
        </div>
      </div>

      <el-form :model="bindingForm" label-width="120px" size="default">
        <el-form-item label="父物料编码" required>
          <el-input v-model="bindingForm.parentCode" placeholder="如: CB-B01*2-PBM-YL-2 或 MAT-P8801" />
        </el-form-item>
        <el-form-item label="产品名称" required>
          <el-input v-model="bindingForm.productName" placeholder="如: 餐边柜" />
        </el-form-item>

        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="款式">
              <el-input v-model="bindingForm.style" placeholder="如: AuraB01*2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主材料">
              <el-input v-model="bindingForm.material" placeholder="如: 刨花板+MDF" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="12">
          <el-col :span="8">
            <el-form-item label="公司品牌">
              <el-input v-model="bindingForm.brand" placeholder="如: 中性" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="颜色">
              <el-input v-model="bindingForm.color" placeholder="如: 原木色" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="包装数量">
              <el-input v-model="bindingForm.packQty" placeholder="如: 2pack" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="组合类型" required>
          <el-select v-model="bindingForm.comboType" placeholder="请选择组合类型" style="width: 100%;">
            <el-option
              v-for="item in COMBO_TYPE_LIST"
              :key="item.type"
              :label="`${item.name} (${item.shortDesc})`"
              :value="item.type"
            >
              <div class="combo-type-opt-row">
                <div class="flex-between">
                  <span class="font-bold">
                    <el-tag size="small" :type="item.tagType" effect="dark" class="mr-6">{{ item.name }}</el-tag>
                    <span>{{ item.shortDesc }}</span>
                  </span>
                  <span class="text-xs text-primary font-bold">【{{ item.coreRule }}】</span>
                </div>
                <div class="opt-desc text-secondary text-xs mt-2 flex-between">
                  <span>{{ item.detailDesc }}</span>
                  <span class="text-muted ml-8 font-mono">示例: {{ item.example }}</span>
                </div>
              </div>
            </el-option>
          </el-select>

          <!-- 动态提示当前选中的组合类型定义说明 (按思维导图标准定义) -->
          <div v-if="activeComboTypeDefinition" class="combo-definition-card mt-8">
            <div class="def-header flex-between">
              <div class="flex-center gap-6">
                <el-tag size="small" :type="activeComboTypeDefinition.tagType" effect="dark">
                  {{ activeComboTypeDefinition.name }}
                </el-tag>
                <span class="font-bold text-xs text-primary">核心法则：{{ activeComboTypeDefinition.coreRule }}</span>
              </div>
              <span class="text-xs text-secondary">{{ activeComboTypeDefinition.shortDesc }}</span>
            </div>
            <div class="def-detail text-xs text-secondary mt-4">
              {{ activeComboTypeDefinition.detailDesc }}
            </div>
            <div class="def-example text-xs mt-3 font-mono">
              <span class="example-tag">典型示例</span> {{ activeComboTypeDefinition.example }}
            </div>
          </div>
        </el-form-item>

        <el-divider content-position="left">绑定子物料列表及用量配比</el-divider>

        <div v-for="(item, idx) in bindingForm.children" :key="idx" class="form-child-row mb-10 flex-center gap-8">
          <el-select
            v-model="item.childCode"
            filterable
            allow-create
            default-first-option
            placeholder="子物料编码/从基础库选择"
            style="width: 240px;"
            @change="(val: string) => handleChildCodeChangeInRow(item, val)"
          >
            <el-option-group label="22 款基础家具物理子物料">
              <el-option
                v-for="c in FURNITURE_CHILD_MATERIALS"
                :key="c.childCode"
                :label="`${c.childCode} - ${c.childName}`"
                :value="c.childCode"
              >
                <div class="flex-between" style="width: 100%;">
                  <span class="font-bold font-mono">{{ c.childCode }}</span>
                  <span class="text-secondary text-xs">{{ c.childName }} ({{ c.model }}/{{ c.color }})</span>
                </div>
              </el-option>
            </el-option-group>
            <el-option-group v-if="existingOtherChildOptions.length" label="其他现有子物料">
              <el-option
                v-for="c in existingOtherChildOptions"
                :key="c.childCode"
                :label="`${c.childCode} - ${c.childName}`"
                :value="c.childCode"
              />
            </el-option-group>
          </el-select>
          <el-input v-model="item.childName" placeholder="子物料名称" style="flex: 1;" />
          <div class="flex-center">
            <span class="text-xs text-secondary mr-4">配比:</span>
            <el-input-number v-model="item.ratio" :min="1" placeholder="配比" style="width: 95px;" />
          </div>
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

    <!-- 弹窗 4: 新增/编辑 子物料库存明细 Dialog -->
    <el-dialog
      v-model="childStockDialogVisible"
      :title="isEditChildStock ? '编辑子物料库存明细' : '新增子物料库存盘点'"
      width="560px"
      destroy-on-close
    >
      <el-form :model="childStockForm" label-width="130px" size="default">
        <el-form-item label="子物料编码" required>
          <el-select
            v-if="!isEditChildStock"
            v-model="childStockForm.childCode"
            placeholder="请选择父子物料绑定关系中的子物料编码"
            filterable
            style="width: 100%;"
            @change="handleChildCodeSelectInForm"
          >
            <el-option
              v-for="c in allChildMaterialOptions"
              :key="c.childCode"
              :label="`${c.childCode} - ${c.childName} (绑定${c.linkedParents.length}款父SKU)`"
              :value="c.childCode"
            >
              <div class="flex-between">
                <span class="font-bold font-mono">{{ c.childCode }}</span>
                <span class="text-xs text-secondary">{{ c.childName }}</span>
                <el-tag size="small" type="primary" effect="plain">绑定{{ c.linkedParents.length }}款父SKU</el-tag>
              </div>
            </el-option>
          </el-select>
          <el-input v-else :value="childStockForm.childCode" disabled />
          <div v-if="selectedChildLinkedParents.length" class="text-xs text-secondary mt-4 font-mono">
            🔗 来源于父子物料绑定关系（已关联 {{ selectedChildLinkedParents.length }} 款父物料：
            <span class="text-primary">{{ selectedChildLinkedParents.slice(0, 3).join(', ') }}{{ selectedChildLinkedParents.length > 3 ? ' 等' : '' }}</span>）
          </div>
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

    <!-- 弹窗 6: 组合物料库手册 Dialog (规范化布局) -->
    <el-dialog
      v-model="furnitureLibraryDialogVisible"
      width="1160px"
      top="4vh"
      destroy-on-close
      class="furniture-manual-dialog"
    >
      <template #header>
        <div class="dialog-custom-header">
          <div class="header-left">
            <div class="header-icon-box">
              <el-icon><Collection /></el-icon>
            </div>
            <div class="header-title-wrap">
              <div class="title-main-row">
                <span class="dialog-title-text">组合物料库手册</span>
                <span class="dialog-badge-tag">自动过滤已入库组合</span>
              </div>
              <div class="dialog-sub-desc">
                支持按品类多维筛选，可单款快速选用或批量勾选一键导入系统
              </div>
            </div>
          </div>

          <div class="header-stats-pill-group">
            <div class="stat-bubble primary">
              <span class="bubble-label">待入库待选</span>
              <span class="bubble-val">{{ unaddedComboCount }} 款</span>
            </div>
            <div class="stat-bubble success">
              <span class="bubble-label">系统已绑定</span>
              <span class="bubble-val">{{ addedParentCodeSet.size }} 款</span>
            </div>
          </div>
        </div>
      </template>

      <div class="furniture-lib-dialog">
        <!-- 规范化单行多维筛选区 -->
        <div class="furniture-filter-panel mb-12">
          <div class="filter-conditions-row">
            <div class="filter-item">
              <span class="filter-sub-label">品类:</span>
              <el-select v-model="furnitureLibCategory" size="small" style="width: 110px;">
                <el-option label="全部品类" value="全部" />
                <el-option label="餐边柜" value="餐边柜" />
                <el-option label="电视柜" value="电视柜" />
                <el-option label="书柜" value="书柜" />
                <el-option label="组合电视柜" value="组合电视柜" />
                <el-option label="食品储藏柜" value="食品储藏柜" />
                <el-option label="斗柜" value="斗柜" />
              </el-select>
            </div>

            <div class="filter-item">
              <span class="filter-sub-label">颜色:</span>
              <el-select v-model="furnitureLibColor" size="small" style="width: 105px;">
                <el-option label="全部颜色" value="全部" />
                <el-option label="原木色" value="原木色" />
                <el-option label="黑色/黑木" value="黑色" />
              </el-select>
            </div>

            <div class="filter-item">
              <span class="filter-sub-label">包装数:</span>
              <el-select v-model="furnitureLibPack" size="small" style="width: 105px;">
                <el-option label="全部规格" value="全部" />
                <el-option label="2pack" value="2pack" />
                <el-option label="3pack" value="3pack" />
                <el-option label="4pack" value="4pack" />
                <el-option label="6pack" value="6pack" />
                <el-option label="7pack" value="7pack" />
              </el-select>
            </div>

            <div class="filter-item">
              <span class="filter-sub-label">组合类型:</span>
              <el-select v-model="furnitureLibComboType" size="small" style="width: 120px;">
                <el-option label="全部类型" value="全部" />
                <el-option
                  v-for="ct in COMBO_TYPE_LIST"
                  :key="ct.type"
                  :label="ct.name"
                  :value="ct.type"
                />
              </el-select>
            </div>

            <div class="filter-item search-box">
              <el-input
                v-model="furnitureLibSearch"
                placeholder="搜索编码 / 款式 / 材质 / 子物料..."
                prefix-icon="Search"
                clearable
                size="small"
                style="width: 250px;"
              />
            </div>

            <el-button size="small" icon="RefreshRight" plain @click="handleResetFurnitureFilter">
              重置
            </el-button>
          </div>
        </div>

        <!-- 基础库规范化数据表格 -->
        <el-table
          :data="filteredFurnitureLibrary"
          border
          stripe
          size="small"
          height="450px"
          class="furniture-lib-table"
          @selection-change="handleFurnitureSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="组合物料编码" prop="parentCode" min-width="210" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="flex-center gap-6">
                <span class="font-bold font-mono text-primary">{{ row.parentCode }}</span>
                <el-tooltip content="复制编码" placement="top" :hide-after="800">
                  <el-button
                    type="primary"
                    link
                    size="small"
                    :icon="CopyDocument"
                    @click="handleCopyText(row.parentCode, '组合物料编码')"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="产品名称" prop="productName" width="100" align="center" />
          <el-table-column label="款式" prop="style" min-width="150" show-overflow-tooltip />
          <el-table-column label="主材料" prop="material" min-width="130" show-overflow-tooltip />
          <el-table-column label="公司品牌" prop="brand" width="90" align="center">
            <template #default="{ row }">
              <el-tag size="small" type="info" effect="plain">{{ row.brand || '中性' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="颜色" prop="color" width="90" align="center" />
          <el-table-column label="包装数量" prop="packQty" width="85" align="center" />
          <el-table-column label="组合类型" width="115" align="center">
            <template #default="{ row }">
              <el-tooltip
                v-if="getComboTypeMeta(row.comboType)"
                placement="top"
                :show-after="200"
              >
                <template #content>
                  <div style="max-width: 260px; line-height: 1.4; padding: 2px;">
                    <div style="font-weight: 700; color: #60a5fa; margin-bottom: 2px;">
                      {{ getComboTypeMeta(row.comboType).name }}（{{ getComboTypeMeta(row.comboType).shortDesc }}）
                    </div>
                    <div style="font-size: 11px; margin-bottom: 2px; color: #fff;">
                      {{ getComboTypeMeta(row.comboType).detailDesc }}
                    </div>
                    <div style="font-size: 10px; color: #cbd5e1;">
                      法则：{{ getComboTypeMeta(row.comboType).coreRule }}
                    </div>
                  </div>
                </template>
                <el-tag size="small" :type="getComboTypeMeta(row.comboType).tagType" effect="dark" class="cursor-pointer">
                  {{ row.comboType }}
                </el-tag>
              </el-tooltip>
              <el-tag v-else size="small" type="info">{{ row.comboType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="子物料 BOM 组成" min-width="220">
            <template #default="{ row }">
              <div class="child-chips-preview">
                <el-tooltip
                  v-for="(sub, sIdx) in row.children"
                  :key="sIdx"
                  :content="`${sub.childName} (用量: ${sub.ratio})`"
                  placement="top"
                >
                  <el-tag size="small" type="success" effect="light" class="mr-4 mb-4">
                    {{ sub.childCode }} × {{ sub.ratio }}
                  </el-tag>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="115" align="center" fixed="right">
            <template #default="{ row }">
              <el-button
                type="primary"
                link
                size="small"
                icon="Plus"
                class="choose-bom-link-btn"
                @click="handleChooseComboFromLibrary(row)"
              >
                选用此BOM
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <div class="dialog-custom-footer">
          <div class="footer-left-info">
            <span>当前筛选共 <b>{{ filteredFurnitureLibrary.length }}</b> 款组合物料</span>
            <span v-if="furnitureLibSelection.length" class="selected-text">
              （已勾选 <b>{{ furnitureLibSelection.length }}</b> 项）
            </span>
          </div>
          <div class="footer-right-actions">
            <el-button @click="furnitureLibraryDialogVisible = false">关闭</el-button>
            <el-button
              type="primary"
              plain
              :disabled="furnitureLibSelection.length === 0"
              @click="handleBatchImportSelectedBoms"
            >
              批量导入已勾选项 ({{ furnitureLibSelection.length }})
            </el-button>
            <el-button
              type="primary"
              :disabled="unaddedComboCount === 0"
              @click="handleImportAllUnaddedBoms"
            >
              {{ unaddedComboCount > 0 ? `一键导入全部待选 (${unaddedComboCount} 款)` : '全部组合已添加完成' }}
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 弹窗 7: Unshipped 待发货订单占用明细 Dialog -->
    <el-dialog
      v-model="unshippedDialogVisible"
      :title="`Unshipped 订单占用明细 - ${activeUnshippedRow?.parentMaterialCode || activeUnshippedRow?.sku || ''}`"
      width="960px"
      destroy-on-close
      class="unshipped-orders-dialog"
    >
      <template #header>
        <div class="flex-center gap-8">
          <el-icon class="text-amber-500 text-lg"><Timer /></el-icon>
          <span class="font-bold text-slate-800 text-base">Unshipped 待发货订单占用明细</span>
          <el-tag size="small" type="warning" effect="light">后台实时同步</el-tag>
        </div>
      </template>

      <div v-if="activeUnshippedRow" class="unshipped-dialog-content">
        <!-- 顶部物料与仓库信息卡片 (现代化高颜值3列信息网格) -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 16px;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px 24px;">
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 11.5px; color: #64748b;">销售平台 / 账号 / 站点</span>
              <span style="font-size: 13px; font-weight: 600; color: #1e293b;">
                {{ activeUnshippedRow.platform || 'Amazon' }} / {{ activeUnshippedRow.account }} / {{ activeUnshippedRow.site }}
              </span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 11.5px; color: #64748b;">销售 SKU</span>
              <span style="font-size: 13px; font-family: monospace; font-weight: 700; color: #1e293b;">{{ activeUnshippedRow.sku }}</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 11.5px; color: #64748b;">父物料编码</span>
              <span style="font-size: 13px; font-family: monospace; font-weight: 700; color: #2563eb;">{{ activeUnshippedRow.parentMaterialCode }}</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 11.5px; color: #64748b;">覆盖海外仓分布</span>
              <span style="font-size: 13px; font-weight: 600; color: #334155;">
                {{ activeUnshippedRow.warehouseNamesSummary || activeUnshippedRow.warehouseName }}
              </span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 11.5px; color: #64748b;">待发货订单占用</span>
              <span style="font-size: 14px; font-weight: 700; color: #d97706;">
                {{ activeUnshippedRow.orderOccupiedQty }} 套 <span style="font-size: 12px; font-weight: normal; color: #92400e;">(共 {{ activeUnshippedRow.unshippedOrderCount || activeUnshippedRow.unshippedOrders?.length || 0 }} 笔)</span>
              </span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <span style="font-size: 11.5px; color: #64748b;">海外仓穿透折算可售</span>
              <span style="font-size: 14px; font-weight: 700; color: #059669;">
                {{ activeUnshippedRow.calculatedParentAvailable }} 套
              </span>
            </div>
          </div>
        </div>

        <!-- 待发货订单列表表格 -->
        <el-table
          :data="activeUnshippedRow.unshippedOrders || []"
          border
          stripe
          size="small"
          max-height="420px"
          style="width: 100%;"
        >
          <el-table-column type="index" label="#" width="45" align="center" />
          <el-table-column label="平台订单编号" prop="orderId" min-width="190">
            <template #default="{ row }">
              <div class="flex-center gap-6">
                <el-tag size="small" effect="plain" type="info">{{ row.platform }}</el-tag>
                <span class="font-mono font-bold text-slate-800">{{ row.orderId }}</span>
                <el-button
                  type="primary"
                  link
                  size="small"
                  icon="CopyDocument"
                  @click.stop="handleCopyText(row.orderId, '订单编号')"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="分配海外仓" width="160" show-overflow-tooltip>
            <template #default="{ row }">
              <span class="text-xs text-slate-700 font-medium">{{ row.tpOverseasWh || '-' }} - {{ row.warehouseName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="店铺账号" prop="account" width="85" align="center">
            <template #default="{ row }">
              <span class="account-badge">{{ row.account }}</span>
            </template>
          </el-table-column>
          <el-table-column label="站点" prop="site" width="70" align="center">
            <template #default="{ row }">
              <span class="site-badge">{{ row.site }}</span>
            </template>
          </el-table-column>
          <el-table-column label="占用套数" prop="orderedQty" width="105" align="right">
            <template #default="{ row }">
              <span class="text-amber-600 font-bold font-mono">{{ row.orderedQty }} 套</span>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" width="100" align="center">
            <template #default>
              <el-tag size="small" type="warning" effect="dark">Unshipped</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="下单时间" prop="orderTime" width="155" align="center" />
          <el-table-column label="最迟发货时限" prop="latestShipTime" width="155" align="center">
            <template #default="{ row }">
              <span class="text-rose-600 font-semibold">{{ row.latestShipTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="收件人 / 目的地" prop="buyerInfo" min-width="150" show-overflow-tooltip />
        </el-table>

        <div v-if="!activeUnshippedRow.unshippedOrders || activeUnshippedRow.unshippedOrders.length === 0" class="empty-unshipped-tip text-center py-20 text-slate-400">
          暂无待发货 (Unshipped) 订单占用此海外仓库存
        </div>
      </div>

      <template #footer>
        <div class="flex-between">
          <span class="text-xs text-slate-400">
            数据来源：跨境平台后台待发货订单中心 · 自动匹配对应物料与海外仓库存
          </span>
          <div class="flex-center gap-8">
            <el-button @click="unshippedDialogVisible = false">关闭</el-button>
            <el-button type="warning" icon="Refresh" :loading="isSyncingUnshipped" @click="handleSyncUnshippedOrders">
              立即重新拉取
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 弹窗 8: 查看父物料 BOM 明细清单 Dialog -->
    <el-dialog
      v-model="bomDetailDialogVisible"
      width="960px"
      destroy-on-close
      class="bom-detail-dialog"
    >
      <template #header>
        <span class="font-bold text-slate-800 text-base">父物料 BOM 绑定明细清单</span>
      </template>

      <div v-if="activeBomRow" class="bom-dialog-content">
        <!-- 子物料 BOM 构成明细表格 -->
        <el-table
          :data="activeBomChildList"
          border
          stripe
          size="small"
          style="width: 100%;"
        >
          <el-table-column type="index" label="#" width="40" align="center" />
          <el-table-column label="图片" width="50" align="center">
            <template #default="{ row }">
              <el-image
                :src="row.image"
                :preview-src-list="[row.image]"
                preview-teleported
                fit="cover"
                style="width: 32px; height: 32px; border-radius: 4px; border: 1px solid #e2e8f0; cursor: pointer;"
              />
            </template>
          </el-table-column>
          <el-table-column label="子物料编码" prop="childCode" width="120">
            <template #default="{ row }">
              <span class="font-mono font-bold text-slate-800">{{ row.childCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="子物料名称" prop="childName" min-width="130" show-overflow-tooltip />
          <el-table-column label="款式" prop="style" width="90" align="center" show-overflow-tooltip />
          <el-table-column label="主材料" prop="mainMaterial" width="100" show-overflow-tooltip />
          <el-table-column label="公司品牌" prop="brand" width="80" align="center" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tag size="small" type="info" effect="plain">{{ row.brand || '中性' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="颜色" prop="color" width="70" align="center" />
          <el-table-column label="包装数量" prop="packQty" width="75" align="center" />
          <el-table-column label="单套用量配比" width="105" align="center">
            <template #default="{ row }">
              <el-tag size="small" type="primary" effect="plain" class="font-bold">
                1 父 : {{ row.bomRatio }} 子
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <div style="display: flex; justify-content: flex-end;">
          <el-button @click="bomDetailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 弹窗 9: 查看海外仓分仓库存明细 Dialog (方案三) -->
    <el-dialog
      v-model="warehouseDetailDialogVisible"
      width="840px"
      destroy-on-close
      class="warehouse-detail-dialog"
    >
      <template #header>
        <span class="font-bold text-slate-800 text-base">海外仓分仓库存明细</span>
      </template>

      <div v-if="activeWarehouseRow" class="warehouse-dialog-content">
        <!-- 顶部信息与核心 KPI 统计卡片区（突出核心指标，一目了然） -->
        <div style="display: flex; justify-content: space-between; align-items: stretch; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; gap: 16px;">
          <!-- 左侧物料档案信息 -->
          <div style="display: flex; flex-direction: column; justify-content: center; min-width: 0; flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 6px;">
              <span style="font-size: 11px; color: #64748b; font-weight: 500;">销售SKU</span>
              <span class="font-mono font-bold text-slate-800 text-sm" style="background: #ffffff; padding: 2px 8px; border-radius: 4px; border: 1px solid #cbd5e1;">
                {{ activeWarehouseRow.sku }}
              </span>
              <span style="font-size: 11px; color: #64748b; font-weight: 500; margin-left: 8px;">物料编码</span>
              <span class="font-mono font-bold text-slate-700 text-sm" style="background: #ffffff; padding: 2px 8px; border-radius: 4px; border: 1px solid #cbd5e1;">
                {{ activeWarehouseRow.parentMaterialCode }}
              </span>
            </div>
            <div v-if="activeWarehouseRow.productName" style="font-size: 12px; color: #475569; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <span style="color: #94a3b8; margin-right: 4px;">产品:</span>
              <span :title="activeWarehouseRow.productName">{{ activeWarehouseRow.productName }}</span>
            </div>
          </div>

          <!-- 右侧：核心 KPI 指标卡片（醒目大字、一目了然、不折行） -->
          <div style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
            <!-- 实际可售 -->
            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 8px 18px; min-width: 135px; text-align: center; box-shadow: 0 1px 2px rgba(16, 185, 129, 0.05);">
              <div style="font-size: 12px; font-weight: 600; color: #047857; display: flex; align-items: center; justify-content: center; gap: 5px; margin-bottom: 2px;">
                <span style="width: 7px; height: 7px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
                实际可售
              </div>
              <div style="display: flex; align-items: baseline; justify-content: center; gap: 3px; white-space: nowrap;">
                <span class="font-mono font-bold" style="font-size: 24px; color: #059669; line-height: 1.1;">
                  {{ (activeWarehouseRow.calculatedParentAvailable || 0).toLocaleString() }}
                </span>
                <span style="font-size: 12px; color: #047857; font-weight: 500;">套</span>
              </div>
              <div v-if="activeWarehouseRow.orderOccupiedQty > 0" style="font-size: 10px; color: #059669; margin-top: 2px; opacity: 0.85; white-space: nowrap;">
                已扣减占用 {{ activeWarehouseRow.orderOccupiedQty }} 套
              </div>
            </div>

            <!-- 在途汇总 -->
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 8px 18px; min-width: 135px; text-align: center; box-shadow: 0 1px 2px rgba(59, 130, 246, 0.05);">
              <div style="font-size: 12px; font-weight: 600; color: #1d4ed8; display: flex; align-items: center; justify-content: center; gap: 5px; margin-bottom: 2px;">
                <span style="width: 7px; height: 7px; border-radius: 50%; background: #3b82f6; display: inline-block;"></span>
                在途汇总
              </div>
              <div style="display: flex; align-items: baseline; justify-content: center; gap: 3px; white-space: nowrap;">
                <span class="font-mono font-bold" style="font-size: 24px; color: #2563eb; line-height: 1.1;">
                  {{ activeWarehouseRow.calculatedParentTransit > 0 ? '+' + activeWarehouseRow.calculatedParentTransit.toLocaleString() : '0' }}
                </span>
                <span style="font-size: 12px; color: #1d4ed8; font-weight: 500;">套</span>
              </div>
              <div style="font-size: 10px; color: #3b82f6; margin-top: 2px; opacity: 0.85; white-space: nowrap;">
                各仓在途累计
              </div>
            </div>
          </div>
        </div>

        <el-table
          :data="activeWarehouseRow.warehouseBreakdown || []"
          border
          stripe
          size="small"
          class="sub-table"
          :span-method="handleWarehouseSpanMethod"
          style="width: 100%;"
          :header-cell-style="{ background: '#f8fafc', color: '#1e293b', fontWeight: 'bold' }"
        >
          <!-- 1. 第三方海外仓 -->
          <el-table-column label="第三方海外仓" prop="tpWh" width="140" align="center">
            <template #default="{ row: whRow }">
              <el-tag size="small" type="primary" effect="plain" class="font-bold">
                {{ whRow.tpWh }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- 2. 仓库 -->
          <el-table-column label="仓库" prop="warehouseName" min-width="180">
            <template #default="{ row: whRow }">
              <span class="text-slate-800 text-xs font-semibold">{{ whRow.warehouseName }}</span>
            </template>
          </el-table-column>

          <!-- 3. 可售(穿透汇总) -->
          <el-table-column label="可售(穿透汇总)" prop="availableSets" width="150" align="right">
            <template #default="{ row: whRow }">
              <span class="num-bold text-emerald-600 font-mono text-sm">
                {{ (whRow.availableSets || 0).toLocaleString() }} 套
              </span>
            </template>
          </el-table-column>

          <!-- 4. 在途(穿透汇总) -->
          <el-table-column label="在途(穿透汇总)" prop="transitSets" width="150" align="right">
            <template #default="{ row: whRow }">
              <span class="num-blue font-mono" v-if="(whRow.transitSets || 0) > 0">
                +{{ whRow.transitSets.toLocaleString() }} 套
              </span>
              <span class="text-muted" v-else>0 套</span>
            </template>
          </el-table-column>

          <!-- 5. 操作（穿透算量） -->
          <el-table-column label="操作" width="120" align="center">
            <template #default="{ row: whRow }">
              <el-button
                type="primary"
                link
                size="small"
                icon="Connection"
                @click="handlePenetrateFromModal(whRow)"
              >
                穿透算量
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <div style="display: flex; justify-content: flex-end;">
          <el-button @click="warehouseDetailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DataAnalysis, Timer, Refresh, Download, Goods, Box, Van, Odometer, Warning,
  Search, RefreshLeft, RefreshRight, Connection, Promotion, Plus, Edit, Delete, Setting, CopyDocument, MagicStick, DocumentCopy, InfoFilled,
  UploadFilled, Check, Document, Collection, QuestionFilled, Close
} from '@element-plus/icons-vue'
import {
  downloadAsinExcelTemplate,
  parseAsinExcelFile,
  parseAsinPasteText,
  type ParsedAsinItem
} from '@/utils/asin-excel-template'
import {
  fetchLingxingBundleMaterials, testLingxingApiAuth, saveLingxingRawJsonData, LINGXING_API_CONFIG,
  type LingxingBundleMaterialRecord
} from '@/api/lingxing'
import {
  FURNITURE_COMBO_BOM_LIBRARY,
  FURNITURE_CHILD_MATERIALS,
  COMBO_TYPE_DEFINITIONS,
  getFurnitureChildMeta,
  getFurnitureComboMeta,
  type FurnitureComboRecord,
  type ComboType,
  type ComboTypeDefinition
} from '@/data/furniture-bom-library'
import {
  dbFetchAsinTracks, dbSaveAsinTrack, dbDeleteAsinTrack, dbBatchImportAsinTracks,
  dbUpdateSingleAsinTrack, dbUpdateAllAsinTracks,
  dbFetchMaterialBindings, dbSaveMaterialBinding, dbDeleteMaterialBinding, dbBatchDeleteMaterialBindings, dbBatchImportMaterialBindings,
  dbUpdateSingleMaterialBinding, dbUpdateAllMaterialBindings,
  dbFetchChildPhysicalStocks, dbUpdateChildStock, dbSaveChildPhysicalStock, dbDeleteChildPhysicalStock,
  dbFetchPenetratedKanbanData, dbFetchCompletenessAlerts, dbResetAllDataToDefault, dbClearAllData, initBackendStoreData,
  dbSyncUnshippedOrders, dbFetchUnshippedOrders, TP_OVERSEAS_WAREHOUSES_MAP,
  type AsinTrackRecord, type MaterialBindingRecord, type ChildPhysicalStockRecord,
  type ParentPenetrateKanbanRecord, type CompletenessAlertRecord, type UnshippedOrderRecord
} from '@/api/sku-kanban-backend'
import { exportKanbanDataToExcel } from '@/utils/kanban-excel-export'

// 0. ECharts 可视化图表状态与方法
const showVisualCharts = ref(true)
const warehouseChartRef = ref<HTMLDivElement | null>(null)
const bottleneckChartRef = ref<HTMLDivElement | null>(null)
let warehouseChartInstance: echarts.ECharts | null = null
let bottleneckChartInstance: echarts.ECharts | null = null

const initCharts = () => {
  if (!showVisualCharts.value) return

  // 1. 各海外仓折算可售套数分布
  if (warehouseChartRef.value) {
    if (!warehouseChartInstance) {
      warehouseChartInstance = echarts.init(warehouseChartRef.value)
    }
    const whMap: Record<string, number> = {}
    filteredTableData.value.forEach(item => {
      const wh = item.tpOverseasWh || item.warehouseName || '其他'
      whMap[wh] = (whMap[wh] || 0) + (item.calculatedParentAvailable || 0)
    })
    const categories = Object.keys(whMap)
    const values = Object.values(whMap)

    warehouseChartInstance.setOption({
      title: { text: '各三方海外仓折算可售套数分布', left: 'center', textStyle: { fontSize: 13, color: '#1e293b' } },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: {c} 套' },
      grid: { left: '3%', right: '4%', bottom: '8%', containLabel: true },
      xAxis: { type: 'category', data: categories, axisLabel: { fontSize: 11, color: '#475569' } },
      yAxis: { type: 'value', name: '可售套数', axisLabel: { fontSize: 11 } },
      series: [{
        name: '可售套数',
        type: 'bar',
        data: values,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#93c5fd' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '40%'
      }]
    })
  }

  // 2. 短板子物料瓶颈致缺频次分布
  if (bottleneckChartRef.value) {
    if (!bottleneckChartInstance) {
      bottleneckChartInstance = echarts.init(bottleneckChartRef.value)
    }
    const bottleneckMap: Record<string, { code: string; count: number; name: string }> = {}
    rawKanbanData.value.forEach(item => {
      if (item.bottleneckChild) {
        const code = item.bottleneckChild.childCode
        const name = item.bottleneckChild.childName || code
        if (!bottleneckMap[code]) {
          bottleneckMap[code] = { code, name, count: 0 }
        }
        bottleneckMap[code].count += 1
      }
    })
    const pieData = Object.values(bottleneckMap).map(b => ({
      name: `${b.code} (${b.name.slice(0, 8)})`,
      value: b.count
    }))

    bottleneckChartInstance.setOption({
      title: { text: '短板子物料瓶颈致缺频次分布', left: 'center', textStyle: { fontSize: 13, color: '#1e293b' } },
      tooltip: { trigger: 'item', formatter: '{b}: {c} 次 ({d}%)' },
      legend: { orient: 'vertical', left: 'left', textStyle: { fontSize: 10 } },
      series: [{
        name: '瓶颈短板频次',
        type: 'pie',
        radius: ['35%', '65%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, fontSize: 11 },
        data: pieData.length > 0 ? pieData : [{ name: '无瓶颈告警', value: 1 }]
      }]
    })
  }
}

const handleResize = () => {
  warehouseChartInstance?.resize()
  bottleneckChartInstance?.resize()
}

watch(showVisualCharts, (val) => {
  if (val) {
    nextTick(() => {
      initCharts()
    })
  }
})

// 1. Tab 切换状态
const activeTab = ref('kanban')

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
const platformOptions = ['Amazon', 'Walmart', 'TikTok', 'Wayfair']
const asinFilterPlatform = ref('全部')
const asinFilterAccount = ref('全部')
const asinFilterSite = ref('全部')
const asinSearchKey = ref('')
const addAsinDialogVisible = ref(false)
const editAsinDialogVisible = ref(false)
const manualAddDialogVisible = ref(false)
const batchImportAsinDialogVisible = ref(false)
const importActiveTab = ref<'file' | 'text'>('file')
const importParsedList = ref<ParsedAsinItem[]>([])
const importPasteText = ref('')
const isParsingImportFile = ref(false)

const validImportCount = computed(() => {
  return importParsedList.value.filter(i => i.isValid).length
})

const invalidImportCount = computed(() => {
  return importParsedList.value.filter(i => !i.isValid).length
})

const isEditAsin = ref(false)
const activeEditAsinIndex = ref(-1)

// 候选 ASIN 弹窗检索与状态
const candidateFilterPlatform = ref('全部')
const candidateFilterAccount = ref('全部')
const candidateFilterSite = ref('全部')
const candidateSearchKey = ref('')
const candidateOnlyUntracked = ref(false)
const candidateCurrentPage = ref(1)
const candidatePageSize = ref(10)
const selectedCandidateRows = ref<CandidateAsinItem[]>([])
const candidateTableRef = ref()

const candidateAccountOptions = ['MNE', 'WKJ', 'YBS', 'DW', 'BYH', 'Amazon-US-01', 'Amazon-US-02']
const candidateSiteOptions = [
  { label: '🇺🇸 US (美国)', value: 'US', flag: '🇺🇸' },
  { label: '🇩🇪 DE (德国)', value: 'DE', flag: '🇩🇪' },
  { label: '🇬🇧 UK (英国)', value: 'UK', flag: '🇬🇧' },
  { label: '🇯🇵 JP (日本)', value: 'JP', flag: '🇯🇵' },
  { label: '🇨🇦 CA (加拿大)', value: 'CA', flag: '🇨🇦' }
]

const getSiteFlagEmoji = (site?: string) => {
  if (!site) return '🇺🇸'
  const upper = site.trim().toUpperCase()
  const map: Record<string, string> = {
    US: '🇺🇸',
    DE: '🇩🇪',
    UK: '🇬🇧',
    GB: '🇬🇧',
    JP: '🇯🇵',
    CA: '🇨🇦',
    FR: '🇫🇷',
    IT: '🇮🇹',
    ES: '🇪🇸'
  }
  return map[upper] || '🌐'
}

const getPlatformTagClass = (platform?: string) => {
  const p = (platform || 'Amazon').toLowerCase()
  if (p.includes('walmart')) return 'platform-walmart'
  if (p.includes('tiktok')) return 'platform-tiktok'
  if (p.includes('wayfair')) return 'platform-wayfair'
  return 'platform-amazon'
}

export interface CandidateAsinItem {
  rowKey: string
  platform?: string
  account: string
  site: string
  countryFlag: string
  asin: string
  sku: string
  materialCode: string
  productName: string
  style: string
  material: string
  brand: string
  color: string
  packQty: string
}

const asinForm = ref({
  platform: 'Amazon',
  account: 'Amazon-US-01',
  site: 'US',
  asin: '',
  sku: '',
  materialCode: '',
  status: '正常跟踪'
})

const asinTrackData = ref<AsinTrackRecord[]>([])

const getComboMetaByMaterialCode = (materialCode: string) => {
  if (!materialCode) return null
  const match = bindingTableData.value.find(b => b.parentCode === materialCode)
  const meta = getFurnitureComboMeta(materialCode)
  return {
    productName: match?.productName || meta?.productName || '-',
    style: match?.style || meta?.style || '-',
    material: match?.material || meta?.material || '-',
    brand: match?.brand || meta?.brand || '中性',
    color: match?.color || meta?.color || '-',
    packQty: match?.packQty || meta?.packQty || '-'
  }
}

const getProductNameByMaterialCode = (materialCode: string) => {
  if (!materialCode) return '-'
  return getComboMetaByMaterialCode(materialCode)?.productName || '-'
}

const filteredAsinTrackData = computed(() => {
  return asinTrackData.value.filter(item => {
    if (asinFilterPlatform.value && asinFilterPlatform.value !== '全部' && (item.platform || 'Amazon') !== asinFilterPlatform.value) return false
    if (asinFilterAccount.value && asinFilterAccount.value !== '全部' && item.account !== asinFilterAccount.value) return false
    if (asinFilterSite.value && asinFilterSite.value !== '全部' && item.site !== asinFilterSite.value) return false
    if (asinSearchKey.value) {
      const k = asinSearchKey.value.toLowerCase()
      const mAsin = item.asin.toLowerCase().includes(k)
      const mSku = item.sku.toLowerCase().includes(k)
      const mMat = item.materialCode.toLowerCase().includes(k)
      const meta = getComboMetaByMaterialCode(item.materialCode)
      const mProd = (meta?.productName || '').toLowerCase().includes(k)
      const mStyle = (meta?.style || '').toLowerCase().includes(k)
      const mColor = (meta?.color || '').toLowerCase().includes(k)
      if (!mAsin && !mSku && !mMat && !mProd && !mStyle && !mColor) return false
    }
    return true
  })
})

const asinCurrentPage = ref(1)
const asinPageSize = ref(10)

const paginatedAsinTrackData = computed(() => {
  const start = (asinCurrentPage.value - 1) * asinPageSize.value
  return filteredAsinTrackData.value.slice(start, start + asinPageSize.value)
})

watch([asinFilterPlatform, asinFilterAccount, asinFilterSite, asinSearchKey], () => {
  asinCurrentPage.value = 1
})

// 候选 ASIN 弹窗逻辑与算量
const isRowAlreadyTracked = (row: { asin: string; sku?: string }) => {
  return asinTrackData.value.some(item => item.asin === row.asin && (!row.sku || item.sku === row.sku))
}

const canSelectCandidateRow = (row: CandidateAsinItem) => {
  return !isRowAlreadyTracked(row)
}

const selectableCountInSelection = computed(() => {
  return selectedCandidateRows.value.filter(r => !isRowAlreadyTracked(r)).length
})

function generateDeterministicAsin(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let res = 'B0'
  let h = Math.abs(hash)
  for (let i = 0; i < 8; i++) {
    res += chars[h % chars.length]
    h = Math.floor(h / chars.length) + (i * 13) + 7
  }
  return res
}

const allCandidateAsinList = computed<CandidateAsinItem[]>(() => {
  const result: CandidateAsinItem[] = []
  const seenKey = new Set<string>()

  // 1. 先加入 rawKanbanData 中的真实看板记录
  if (rawKanbanData.value && rawKanbanData.value.length) {
    rawKanbanData.value.forEach(k => {
      if (!k.asin) return
      const platform = (k as any).platform || 'Amazon'
      const key = `${platform}_${k.account || 'MNE'}_${k.site || 'US'}_${k.asin}_${k.sku || k.parentMaterialCode}`
      if (!seenKey.has(key)) {
        seenKey.add(key)
        const meta = getComboMetaByMaterialCode(k.parentMaterialCode)
        result.push({
          rowKey: key,
          platform,
          account: k.account || 'MNE',
          site: k.site || 'US',
          countryFlag: k.countryFlag || '🇺🇸',
          asin: k.asin,
          sku: k.sku || k.parentMaterialCode,
          materialCode: k.parentMaterialCode,
          productName: k.productName || meta?.productName || '-',
          style: k.style || meta?.style || '-',
          material: k.mainMaterial || meta?.material || '-',
          brand: k.targetBrand || meta?.brand || '中性',
          color: meta?.color || '-',
          packQty: meta?.packQty || '1pack'
        })
      }
    })
  }

  // 2. 基于 bindingTableData 与 FURNITURE_COMBO_BOM_LIBRARY 组合构建丰富候选池
  const combosToUse = bindingTableData.value.length >= 10
    ? bindingTableData.value
    : FURNITURE_COMBO_BOM_LIBRARY

  const accountStorePresets = [
    { platform: 'Amazon', account: 'MNE', site: 'US', flag: '🇺🇸' },
    { platform: 'Amazon', account: 'WKJ', site: 'US', flag: '🇺🇸' },
    { platform: 'Amazon', account: 'YBS', site: 'DE', flag: '🇩🇪' },
    { platform: 'Walmart', account: 'DW', site: 'US', flag: '🇺🇸' },
    { platform: 'Amazon', account: 'BYH', site: 'UK', flag: '🇬🇧' },
    { platform: 'TikTok', account: 'BYH', site: 'US', flag: '🇺🇸' },
    { platform: 'Amazon', account: 'Amazon-US-01', site: 'US', flag: '🇺🇸' }
  ]

  combosToUse.forEach((item, idx) => {
    const parentCode = 'parentCode' in item ? item.parentCode : (item as any).parentCode
    if (!parentCode) return
    const meta = getComboMetaByMaterialCode(parentCode) || {
      productName: (item as any).productName || '家具单品',
      style: (item as any).style || '-',
      material: (item as any).material || '-',
      brand: (item as any).brand || '中性',
      color: (item as any).color || '-',
      packQty: (item as any).packQty || '1pack'
    }

    const preset1 = accountStorePresets[idx % accountStorePresets.length]
    const asin1 = generateDeterministicAsin(parentCode + '_' + preset1.account)
    const sku1 = `SKU-${preset1.site}-${parentCode.replace(/[^a-zA-Z0-9]/g, '').slice(-8)}`
    const key1 = `${preset1.platform}_${preset1.account}_${preset1.site}_${asin1}_${sku1}`
    if (!seenKey.has(key1)) {
      seenKey.add(key1)
      result.push({
        rowKey: key1,
        platform: preset1.platform,
        account: preset1.account,
        site: preset1.site,
        countryFlag: preset1.flag,
        asin: asin1,
        sku: sku1,
        materialCode: parentCode,
        productName: meta.productName,
        style: meta.style,
        material: meta.material,
        brand: meta.brand,
        color: meta.color,
        packQty: meta.packQty
      })
    }

    if (idx % 2 === 0) {
      const preset2 = accountStorePresets[(idx + 2) % accountStorePresets.length]
      const asin2 = generateDeterministicAsin(parentCode + '_' + preset2.account + '_2')
      const sku2 = `${preset2.account}-${parentCode.replace(/[^a-zA-Z0-9]/g, '').slice(-8)}`
      const key2 = `${preset2.platform}_${preset2.account}_${preset2.site}_${asin2}_${sku2}`
      if (!seenKey.has(key2)) {
        seenKey.add(key2)
        result.push({
          rowKey: key2,
          platform: preset2.platform,
          account: preset2.account,
          site: preset2.site,
          countryFlag: preset2.flag,
          asin: asin2,
          sku: sku2,
          materialCode: parentCode,
          productName: meta.productName,
          style: meta.style,
          material: meta.material,
          brand: meta.brand,
          color: meta.color,
          packQty: meta.packQty
        })
      }
    }
  })

  return result
})

const filteredCandidateList = computed(() => {
  return allCandidateAsinList.value.filter(item => {
    if (candidateFilterPlatform.value && candidateFilterPlatform.value !== '全部' && (item.platform || 'Amazon') !== candidateFilterPlatform.value) {
      return false
    }
    if (candidateFilterAccount.value && candidateFilterAccount.value !== '全部' && item.account !== candidateFilterAccount.value) {
      return false
    }
    if (candidateFilterSite.value && candidateFilterSite.value !== '全部' && item.site !== candidateFilterSite.value) {
      return false
    }
    if (candidateSearchKey.value && candidateSearchKey.value.trim()) {
      const k = candidateSearchKey.value.trim().toLowerCase()
      const mAsin = item.asin.toLowerCase().includes(k)
      const mSku = item.sku.toLowerCase().includes(k)
      const mMat = item.materialCode.toLowerCase().includes(k)
      const mName = item.productName.toLowerCase().includes(k)
      if (!mAsin && !mSku && !mMat && !mName) return false
    }
    if (candidateOnlyUntracked.value) {
      if (isRowAlreadyTracked(item)) return false
    }
    return true
  })
})

const paginatedCandidateList = computed(() => {
  const start = (candidateCurrentPage.value - 1) * candidatePageSize.value
  return filteredCandidateList.value.slice(start, start + candidatePageSize.value)
})

const handleCandidateSelectionChange = (selection: CandidateAsinItem[]) => {
  selectedCandidateRows.value = selection
}

const handleResetCandidateFilter = () => {
  candidateFilterPlatform.value = '全部'
  candidateFilterAccount.value = '全部'
  candidateFilterSite.value = '全部'
  candidateSearchKey.value = ''
  candidateOnlyUntracked.value = false
  candidateCurrentPage.value = 1
}

// 6. 弹窗状态
const penetrateDialogVisible = ref(false)
const activePenetrateRow = ref<any>(null)
const bomDetailDialogVisible = ref(false)
const activeBomRow = ref<any>(null)
const warehouseDetailDialogVisible = ref(false)
const activeWarehouseRow = ref<any>(null)

const bindingDialogVisible = ref(false)
const isEditBinding = ref(false)
const bindingForm = ref<{
  parentCode: string
  sku: string
  productName: string
  style?: string
  material?: string
  brand?: string
  color?: string
  packQty?: string
  comboType: ComboType
  tpWh: string
  children: {
    childCode: string
    childName: string
    ratio: number
    childProductName?: string
    childStyle?: string
    childMaterial?: string
    childTarget?: string
    childModel?: string
    childBrand?: string
    childPattern?: string
    childColor?: string
    childPackQty?: string
  }[]
}>({
  parentCode: '',
  sku: '',
  productName: '',
  style: '',
  material: '',
  brand: '中性',
  color: '',
  packQty: '',
  comboType: '多件打包',
  tpWh: '万邑通',
  children: [
    { childCode: '', childName: '', ratio: 1 }
  ]
})

// 组合类型标准定义与计算
const COMBO_TYPE_LIST = computed(() => Object.values(COMBO_TYPE_DEFINITIONS))

const getComboTypeMeta = (type?: string): ComboTypeDefinition => {
  if (type && COMBO_TYPE_DEFINITIONS[type as ComboType]) {
    return COMBO_TYPE_DEFINITIONS[type as ComboType]
  }
  if (type === '单品多量') return COMBO_TYPE_DEFINITIONS['多件打包']
  if (type === '单品多包') return COMBO_TYPE_DEFINITIONS['一物多包']
  if (type === '多品多包') return COMBO_TYPE_DEFINITIONS['成套组合']
  return COMBO_TYPE_DEFINITIONS['多件打包']
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

const activeComboTypeDefinition = computed(() => {
  return getComboTypeMeta(bindingForm.value.comboType)
})

const showComboTypeLegend = ref(false)

// 基础数据选用状态 (来源于组合家具物料命名汇总确认版)
const bindingTableData = ref<MaterialBindingRecord[]>([])

// 已添加的组合物料编码集合 (已添加的组合不展示在基础数据手册中)
const addedParentCodeSet = computed(() => new Set(bindingTableData.value.map(b => b.parentCode)))

// 组合物料库中尚未添加的组合物料清单
const unaddedFurnitureComboList = computed(() => {
  return FURNITURE_COMBO_BOM_LIBRARY.filter(item => !addedParentCodeSet.value.has(item.parentCode))
})

// 待添加组合物料总数
const unaddedComboCount = computed(() => unaddedFurnitureComboList.value.length)

// 各品类待添加数量统计
const unaddedCountByCategory = computed(() => {
  const counts: Record<string, number> = {
    '餐边柜': 0,
    '电视柜': 0,
    '书柜': 0,
    '组合电视柜': 0,
    '食品储藏柜': 0,
    '斗柜': 0
  }
  unaddedFurnitureComboList.value.forEach(item => {
    if (counts[item.productName] !== undefined) {
      counts[item.productName]++
    }
  })
  return counts
})

// 组合物料库手册选用状态
const selectedBaseComboCode = ref('')
const furnitureLibraryDialogVisible = ref(false)
const furnitureLibCategory = ref('全部')
const furnitureLibColor = ref('全部')
const furnitureLibPack = ref('全部')
const furnitureLibComboType = ref('全部')
const furnitureLibSearch = ref('')
const furnitureLibSelection = ref<FurnitureComboRecord[]>([])

const filteredFurnitureLibrary = computed(() => {
  return unaddedFurnitureComboList.value.filter(item => {
    if (furnitureLibCategory.value !== '全部' && item.productName !== furnitureLibCategory.value) {
      return false
    }
    if (furnitureLibColor.value !== '全部') {
      if (furnitureLibColor.value === '原木色' && !item.color.includes('原木色')) return false
      if (furnitureLibColor.value === '黑色' && !item.color.includes('黑')) return false
    }
    if (furnitureLibPack.value !== '全部' && item.packQty !== furnitureLibPack.value) {
      return false
    }
    if (furnitureLibComboType.value !== '全部' && item.comboType !== furnitureLibComboType.value) {
      return false
    }
    if (furnitureLibSearch.value) {
      const q = furnitureLibSearch.value.toLowerCase().trim()
      const mCode = item.parentCode.toLowerCase().includes(q)
      const mName = item.productName.toLowerCase().includes(q)
      const mStyle = item.style.toLowerCase().includes(q)
      const mColor = item.color.toLowerCase().includes(q)
      const mChild = item.children.some(c => c.childCode.toLowerCase().includes(q) || c.childName.toLowerCase().includes(q))
      if (!mCode && !mName && !mStyle && !mColor && !mChild) return false
    }
    return true
  })
})

const handleResetFurnitureFilter = () => {
  furnitureLibCategory.value = '全部'
  furnitureLibColor.value = '全部'
  furnitureLibPack.value = '全部'
  furnitureLibComboType.value = '全部'
  furnitureLibSearch.value = ''
}

const comboTypeFilter = ref('全部')
const bindingSearchKey = ref('')

// 组合类型对应数据统计
const countMultiPack = computed(() => bindingTableData.value.filter(b => getComboTypeMeta(b.comboType).type === '多件打包').length)
const countSingleMultiPkg = computed(() => bindingTableData.value.filter(b => getComboTypeMeta(b.comboType).type === '一物多包').length)
const countMainSub = computed(() => bindingTableData.value.filter(b => getComboTypeMeta(b.comboType).type === '主附搭配').length)
const countCompleteSet = computed(() => bindingTableData.value.filter(b => getComboTypeMeta(b.comboType).type === '成套组合').length)

const filteredBindingTableData = computed(() => {
  return bindingTableData.value.filter(item => {
    if (comboTypeFilter.value !== '全部') {
      const curType = getComboTypeMeta(item.comboType).type
      if (curType !== comboTypeFilter.value) {
        return false
      }
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

const bindingCurrentPage = ref(1)
const bindingPageSize = ref(10)

const paginatedBindingTableData = computed(() => {
  const start = (bindingCurrentPage.value - 1) * bindingPageSize.value
  const end = start + bindingPageSize.value
  return filteredBindingTableData.value.slice(start, end)
})

watch([bindingSearchKey, comboTypeFilter], () => {
  bindingCurrentPage.value = 1
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
  return Object.keys(TP_OVERSEAS_WAREHOUSES_MAP)
})

const warehouseNameOptions = computed(() => {
  if (filterTpOverseasWh.value && filterTpOverseasWh.value !== '全部' && TP_OVERSEAS_WAREHOUSES_MAP[filterTpOverseasWh.value]) {
    return TP_OVERSEAS_WAREHOUSES_MAP[filterTpOverseasWh.value]
  }
  const all: string[] = []
  Object.values(TP_OVERSEAS_WAREHOUSES_MAP).forEach(list => all.push(...list))
  return all
})

// 多海外仓独立备货逻辑：动态计算当前筛选仓库/汇总的实际可售与在途
const actualAvailableColumnTitle = computed(() => {
  if (filterWarehouseName.value && filterWarehouseName.value !== '全部') {
    return `${filterWarehouseName.value} 可售`
  }
  if (filterTpOverseasWh.value && filterTpOverseasWh.value !== '全部') {
    return `${filterTpOverseasWh.value} 可售`
  }
  return '实际可售'
})

const transitColumnTitle = computed(() => {
  if (filterWarehouseName.value && filterWarehouseName.value !== '全部') {
    return `${filterWarehouseName.value} 在途`
  }
  if (filterTpOverseasWh.value && filterTpOverseasWh.value !== '全部') {
    return `${filterTpOverseasWh.value} 在途`
  }
  return '在途'
})

const getDisplayAvailable = (row: any): number => {
  if ((!filterWarehouseName.value || filterWarehouseName.value === '全部') &&
      (!filterTpOverseasWh.value || filterTpOverseasWh.value === '全部')) {
    return row.calculatedParentAvailable || 0
  }
  const matching = (row.warehouseBreakdown || []).filter((w: any) => {
    const matchTp = (!filterTpOverseasWh.value || filterTpOverseasWh.value === '全部') || w.tpWh === filterTpOverseasWh.value
    const matchWh = (!filterWarehouseName.value || filterWarehouseName.value === '全部') || w.warehouseName === filterWarehouseName.value
    return matchTp && matchWh
  })
  if (matching.length === 0) return 0
  const avail = matching.reduce((sum: number, w: any) => sum + (w.availableSets || 0), 0)
  const occupied = matching.reduce((sum: number, w: any) => sum + (w.orderOccupiedQty || 0), 0)
  return Math.max(0, avail - occupied)
}

const getDisplayTransit = (row: any): number => {
  if ((!filterWarehouseName.value || filterWarehouseName.value === '全部') &&
      (!filterTpOverseasWh.value || filterTpOverseasWh.value === '全部')) {
    return row.calculatedParentTransit || 0
  }
  const matching = (row.warehouseBreakdown || []).filter((w: any) => {
    const matchTp = (!filterTpOverseasWh.value || filterTpOverseasWh.value === '全部') || w.tpWh === filterTpOverseasWh.value
    const matchWh = (!filterWarehouseName.value || filterWarehouseName.value === '全部') || w.warehouseName === filterWarehouseName.value
    return matchTp && matchWh
  })
  return matching.reduce((sum: number, w: any) => sum + (w.transitSets || 0), 0)
}

const getDisplayOccupied = (row: any): number => {
  if ((!filterWarehouseName.value || filterWarehouseName.value === '全部') &&
      (!filterTpOverseasWh.value || filterTpOverseasWh.value === '全部')) {
    return row.orderOccupiedQty || 0
  }
  const matching = (row.warehouseBreakdown || []).filter((w: any) => {
    const matchTp = (!filterTpOverseasWh.value || filterTpOverseasWh.value === '全部') || w.tpWh === filterTpOverseasWh.value
    const matchWh = (!filterWarehouseName.value || filterWarehouseName.value === '全部') || w.warehouseName === filterWarehouseName.value
    return matchTp && matchWh
  })
  return matching.reduce((sum: number, w: any) => sum + (w.orderOccupiedQty || 0), 0)
}

// 8. 子物料物理库存明细选项卡数据与筛选
const childPhysicalStockData = ref<ChildPhysicalStockRecord[]>([])
const childStockCurrentPage = ref(1)
const childStockPageSize = ref(10)

// 6 项专属筛选状态：子物料编码、产品名称、款式、主材料、三方海外仓、仓库名称
const filterChildStockCode = ref('')
const filterChildStockProductName = ref('')
const filterChildStockStyle = ref('全部')
const filterChildStockMaterial = ref('全部')
const filterChildStockTpWh = ref('全部')
const filterChildStockWhName = ref('全部')

// 动态提取下拉选项
const childStyleOptions = computed(() => {
  const set = new Set<string>()
  childPhysicalStockData.value.forEach(row => {
    const style = getFurnitureChildMeta(row.childCode)?.childStyle
    if (style && style !== '-') set.add(style.trim())
  })
  return Array.from(set)
})

const childMaterialOptions = computed(() => {
  const set = new Set<string>()
  childPhysicalStockData.value.forEach(row => {
    const mat = getFurnitureChildMeta(row.childCode)?.childMaterial
    if (mat && mat !== '-') set.add(mat.trim())
  })
  return Array.from(set)
})

const childTpWhOptions = computed(() => {
  return Object.keys(TP_OVERSEAS_WAREHOUSES_MAP)
})

const childWhNameOptions = computed(() => {
  if (filterChildStockTpWh.value && filterChildStockTpWh.value !== '全部' && TP_OVERSEAS_WAREHOUSES_MAP[filterChildStockTpWh.value]) {
    return TP_OVERSEAS_WAREHOUSES_MAP[filterChildStockTpWh.value]
  }
  const all: string[] = []
  Object.values(TP_OVERSEAS_WAREHOUSES_MAP).forEach(list => all.push(...list))
  return all
})

const filteredChildPhysicalStockData = computed(() => {
  return childPhysicalStockData.value.filter(row => {
    // 1. 子物料编码
    if (filterChildStockCode.value.trim()) {
      const q = filterChildStockCode.value.trim().toLowerCase()
      if (!row.childCode.toLowerCase().includes(q)) return false
    }
    // 2. 产品名称
    if (filterChildStockProductName.value.trim()) {
      const q = filterChildStockProductName.value.trim().toLowerCase()
      const pName = (getFurnitureChildMeta(row.childCode)?.childProductName || row.childName || '').toLowerCase()
      if (!pName.includes(q)) return false
    }
    // 3. 款式
    if (filterChildStockStyle.value && filterChildStockStyle.value !== '全部') {
      const style = getFurnitureChildMeta(row.childCode)?.childStyle || ''
      if (style !== filterChildStockStyle.value) return false
    }
    // 4. 主材料
    if (filterChildStockMaterial.value && filterChildStockMaterial.value !== '全部') {
      const mat = getFurnitureChildMeta(row.childCode)?.childMaterial || ''
      if (mat !== filterChildStockMaterial.value) return false
    }
    // 5. 三方海外仓
    if (filterChildStockTpWh.value && filterChildStockTpWh.value !== '全部') {
      if ((row.tpWh || '') !== filterChildStockTpWh.value) return false
    }
    // 6. 仓库名称
    if (filterChildStockWhName.value && filterChildStockWhName.value !== '全部') {
      if ((row.whName || '') !== filterChildStockWhName.value) return false
    }
    return true
  })
})

const paginatedChildPhysicalStockData = computed(() => {
  const start = (childStockCurrentPage.value - 1) * childStockPageSize.value
  return filteredChildPhysicalStockData.value.slice(start, start + childStockPageSize.value)
})

const handleResetChildStockFilter = () => {
  filterChildStockCode.value = ''
  filterChildStockProductName.value = ''
  filterChildStockStyle.value = '全部'
  filterChildStockMaterial.value = '全部'
  filterChildStockTpWh.value = '全部'
  filterChildStockWhName.value = '全部'
  childStockCurrentPage.value = 1
}

watch([
  filterChildStockCode,
  filterChildStockProductName,
  filterChildStockStyle,
  filterChildStockMaterial,
  filterChildStockTpWh,
  filterChildStockWhName
], () => {
  childStockCurrentPage.value = 1
})

const overseasWhSyncStatusList = ref<Array<{ name: string; status: 'success' | 'failed' | 'idle'; lastSyncTime: string }>>([
  { name: '西邮', status: 'success', lastSyncTime: '刚刚' },
  { name: '环世', status: 'success', lastSyncTime: '刚刚' },
  { name: '千亚', status: 'success', lastSyncTime: '刚刚' },
  { name: '乐歌', status: 'success', lastSyncTime: '刚刚' }
])

const lastSyncOverviewText = computed(() => {
  const times = overseasWhSyncStatusList.value.map(i => i.lastSyncTime).filter(t => t)
  return times.length ? times[0] : '已同步'
})

const syncStatusTooltipContent = computed(() => {
  return overseasWhSyncStatusList.value
    .map(i => `${i.name}: ${i.status === 'success' ? '同步成功' : '同步异常'} (${i.lastSyncTime})`)
    .join(' | ')
})

const isSyncingChildStock = ref(false)

const handleSyncAllOverseasWh = async () => {
  isSyncingChildStock.value = true
  const nowStr = new Date().toTimeString().slice(0, 8)
  try {
    const promises = overseasWhSyncStatusList.value.map(wh => {
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          wh.status = 'success'
          wh.lastSyncTime = nowStr
          resolve(wh.name)
        }, 400 + Math.random() * 300)
      })
    })
    await Promise.allSettled(promises)
    await refreshAllBackendData()
    ElMessage.success(`全量海外仓 API 同步完成！已更新全部 ${overseasWhSyncStatusList.value.length} 个三方海外仓物理库存`)
  } catch (err) {
    ElMessage.error('海外仓 API 同步异常，请检查网络或服务商配置')
  } finally {
    isSyncingChildStock.value = false
  }
}

const handleSyncSingleOverseasWh = async (whName: string) => {
  const item = overseasWhSyncStatusList.value.find(w => w.name === whName)
  if (!item) return
  isSyncingChildStock.value = true
  const nowStr = new Date().toTimeString().slice(0, 8)
  try {
    await new Promise(r => setTimeout(r, 600))
    item.status = 'success'
    item.lastSyncTime = nowStr
    await refreshAllBackendData()
    ElMessage.success(`[${whName}] 海外仓 WMS API 独立同步成功！相关在库与在途库存已刷新至最新状态。`)
  } catch (err) {
    item.status = 'failed'
    ElMessage.error(`[${whName}] API 同步异常，请检查该服务商密钥或网络`)
  } finally {
    isSyncingChildStock.value = false
  }
}

// 9. 齐套缺料预警数据
const completenessAlertData = ref<CompletenessAlertRecord[]>([])
const completenessCurrentPage = ref(1)
const completenessPageSize = ref(10)
const completenessFilterType = ref<string>('全部')
const completenessSearchKey = ref<string>('')
const completenessTpOverseasWh = ref<string>('全部')
const completenessWarehouseName = ref<string>('全部')
const activeRuleTab = ref<'alertLogic' | 'calculationRule' | null>('alertLogic')
const handleToggleRuleTab = (tab: 'alertLogic' | 'calculationRule') => {
  if (activeRuleTab.value === tab) {
    activeRuleTab.value = null
  } else {
    activeRuleTab.value = tab
  }
}

const completenessWarehouseOptions = computed(() => {
  if (completenessTpOverseasWh.value && completenessTpOverseasWh.value !== '全部' && TP_OVERSEAS_WAREHOUSES_MAP[completenessTpOverseasWh.value]) {
    return TP_OVERSEAS_WAREHOUSES_MAP[completenessTpOverseasWh.value]
  }
  const all: string[] = []
  Object.values(TP_OVERSEAS_WAREHOUSES_MAP).forEach(list => all.push(...list))
  return all
})

const handleCompletenessSearch = () => {
  completenessCurrentPage.value = 1
  ElMessage.success('已筛选数据')
}

const handleCompletenessReset = () => {
  completenessTpOverseasWh.value = '全部'
  completenessWarehouseName.value = '全部'
  completenessSearchKey.value = ''
  completenessFilterType.value = '全部'
  completenessCurrentPage.value = 1
  ElMessage.info('已重置筛选条件')
}

watch([completenessTpOverseasWh, completenessWarehouseName, completenessFilterType], () => {
  completenessCurrentPage.value = 1
})

const filteredCompletenessAlertData = computed(() => {
  return completenessAlertData.value.filter(item => {
    // 1. KPI 预警状态类型过滤
    if (completenessFilterType.value !== '全部' && item.alertType !== completenessFilterType.value) {
      return false
    }
    // 2. 三方海外仓过滤
    if (completenessTpOverseasWh.value && completenessTpOverseasWh.value !== '全部') {
      if ((item.tpOverseasWh || '') !== completenessTpOverseasWh.value) {
        return false
      }
    }
    // 3. 物理仓库名称过滤
    if (completenessWarehouseName.value && completenessWarehouseName.value !== '全部') {
      if (item.warehouseName !== completenessWarehouseName.value) {
        return false
      }
    }
    // 4. 关键字检索 (父/子物料编码 / SKU / ASIN / 产品名称 / 海外仓 / 仓库)
    if (completenessSearchKey.value && completenessSearchKey.value.trim()) {
      const k = completenessSearchKey.value.trim().toLowerCase()
      const mParent = item.parentCode.toLowerCase().includes(k)
      const mName = item.productName.toLowerCase().includes(k)
      const mTpWh = (item.tpOverseasWh || '').toLowerCase().includes(k)
      const mWh = item.warehouseName.toLowerCase().includes(k)
      const mSku = (item.sku || '').toLowerCase().includes(k)
      const mAsin = (item.asin || '').toLowerCase().includes(k)
      const mChild = item.shortageItems.some(s => s.childCode.toLowerCase().includes(k) || s.childName.toLowerCase().includes(k))
      if (!mParent && !mName && !mTpWh && !mWh && !mSku && !mAsin && !mChild) return false
    }
    return true
  })
})

const paginatedCompletenessAlertData = computed(() => {
  const start = (completenessCurrentPage.value - 1) * completenessPageSize.value
  return filteredCompletenessAlertData.value.slice(start, start + completenessPageSize.value)
})

// 预警表格合并行计算：计算当前页同物料编码 (parentCode) 及同三方海外仓 (tpOverseasWh) 的跨行合并数
const alertTableDataWithSpans = computed(() => {
  const list = paginatedCompletenessAlertData.value.map(item => ({ ...item, parentRowSpan: 1, tpRowSpan: 1 }))

  // 1. 同物料编码合并 (第 0 列 物料编码 & 第 1 列 产品名称)
  let currentParent = ''
  let parentStartIndex = 0
  list.forEach((item, index) => {
    if (item.parentCode !== currentParent) {
      if (currentParent !== '') {
        const count = index - parentStartIndex
        list[parentStartIndex].parentRowSpan = count
        for (let k = parentStartIndex + 1; k < index; k++) {
          list[k].parentRowSpan = 0
        }
      }
      currentParent = item.parentCode
      parentStartIndex = index
    }
  })
  if (list.length > 0) {
    const count = list.length - parentStartIndex
    list[parentStartIndex].parentRowSpan = count
    for (let k = parentStartIndex + 1; k < list.length; k++) {
      list[k].parentRowSpan = 0
    }
  }

  // 2. 同物料下同三方海外仓合并 (第 2 列 海外仓)
  let currentTpKey = ''
  let tpStartIndex = 0
  list.forEach((item, index) => {
    const key = `${item.parentCode}___${item.tpOverseasWh || ''}`
    if (key !== currentTpKey) {
      if (currentTpKey !== '') {
        const count = index - tpStartIndex
        list[tpStartIndex].tpRowSpan = count
        for (let k = tpStartIndex + 1; k < index; k++) {
          list[k].tpRowSpan = 0
        }
      }
      currentTpKey = key
      tpStartIndex = index
    }
  })
  if (list.length > 0) {
    const count = list.length - tpStartIndex
    list[tpStartIndex].tpRowSpan = count
    for (let k = tpStartIndex + 1; k < list.length; k++) {
      list[k].tpRowSpan = 0
    }
  }

  return list
})

// 预警表格跨行合并回调
const handleCompletenessSpanMethod = ({ row, columnIndex }: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  // 第 0 列 (物料编码) 与 第 1 列 (产品名称)：同物料编码合并展示
  if (columnIndex === 0 || columnIndex === 1) {
    const span = row.parentRowSpan !== undefined ? row.parentRowSpan : 1
    return span > 0 ? { rowspan: span, colspan: 1 } : { rowspan: 0, colspan: 0 }
  }
  // 第 2 列 (海外仓)：同物料下同海外仓服务商合并展示
  if (columnIndex === 2) {
    const span = row.tpRowSpan !== undefined ? row.tpRowSpan : 1
    return span > 0 ? { rowspan: span, colspan: 1 } : { rowspan: 0, colspan: 0 }
  }
  // 仓库、预警等级、实际可售/目标、卡脖子短板、采购建议、操作保持单行独立
  return { rowspan: 1, colspan: 1 }
}

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
    if (filterTpOverseasWh.value && filterTpOverseasWh.value !== '全部') {
      const matchTp = (item.coveredWarehouses && item.coveredWarehouses.some((w: any) => w.tpWh === filterTpOverseasWh.value)) ||
        (item.tpOverseasWh && item.tpOverseasWh.includes(filterTpOverseasWh.value))
      if (!matchTp) return false
    }
    if (filterWarehouseName.value && filterWarehouseName.value !== '全部') {
      const matchWh = (item.coveredWarehouses && item.coveredWarehouses.some((w: any) => w.warehouseName === filterWarehouseName.value)) ||
        (item.warehouseName && item.warehouseName.includes(filterWarehouseName.value))
      if (!matchWh) return false
    }
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

watch(filteredTableData, () => {
  if (showVisualCharts.value) {
    nextTick(() => {
      initCharts()
    })
  }
}, { deep: true })

onMounted(async () => {
  await refreshAllBackendData()
  nextTick(() => {
    initCharts()
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  warehouseChartInstance?.dispose()
  bottleneckChartInstance?.dispose()
})

// 汇总行计算 1: SKU海外仓库存看板汇总
const getKanbanSummary = (param: { columns: any[]; data: any[] }) => {
  const { columns, data } = param
  const sums: string[] = []
  
  const isFiltered = (filterWarehouseName.value && filterWarehouseName.value !== '全部') || (filterTpOverseasWh.value && filterTpOverseasWh.value !== '全部')

  const grandTotalAvail = rawKanbanData.value.reduce((s, i) => s + (i.calculatedParentAvailable || 0), 0)
  const grandTotalTransit = rawKanbanData.value.reduce((s, i) => s + (i.calculatedParentTransit || 0), 0)
  const grandTotalOccupied = rawKanbanData.value.reduce((s, i) => s + (i.orderOccupiedQty || 0), 0)

  const pageTotalAvail = data.reduce((s, i) => s + getDisplayAvailable(i), 0)
  const pageTotalTransit = data.reduce((s, i) => s + getDisplayTransit(i), 0)
  const pageTotalOccupied = data.reduce((s, i) => s + getDisplayOccupied(i), 0)

  columns.forEach((col, index) => {
    if (index === 0) {
      sums[index] = ''
      return
    }
    if (col.property === 'platform') {
      sums[index] = ''
      return
    }
    if (col.property === 'orderOccupiedQty') {
      sums[index] = isFiltered
        ? `${pageTotalOccupied.toLocaleString()} 套`
        : `${pageTotalOccupied.toLocaleString()} 套 (总 ${grandTotalOccupied.toLocaleString()})`
      return
    }
    if (col.property === 'calculatedParentAvailable') {
      sums[index] = isFiltered
        ? `${pageTotalAvail.toLocaleString()} 套`
        : `${pageTotalAvail.toLocaleString()} 套 (总 ${grandTotalAvail.toLocaleString()})`
      return
    }
    if (col.property === 'calculatedParentTransit') {
      sums[index] = isFiltered
        ? `+${pageTotalTransit.toLocaleString()} 套`
        : `+${pageTotalTransit.toLocaleString()} 套 (总 +${grandTotalTransit.toLocaleString()})`
      return
    }
    if (!col.property || col.label === '操作') {
      sums[index] = ''
      return
    }
    sums[index] = '-'
  })

  return sums
}

// 汇总行计算 2: 子物料物理库存明细汇总
const getChildStockSummary = (param: { columns: any[]; data: any[] }) => {
  const { columns, data } = param
  const sums: string[] = []

  const grandTotalAvail = childPhysicalStockData.value.reduce((s, i) => s + (i.availableQty || 0), 0)
  const grandTotalTransit = childPhysicalStockData.value.reduce((s, i) => s + (i.transitQty || 0), 0)

  const pageTotalAvail = data.reduce((s, i) => s + (i.availableQty || 0), 0)
  const pageTotalTransit = data.reduce((s, i) => s + (i.transitQty || 0), 0)

  columns.forEach((col, index) => {
    if (index === 0) {
      sums[index] = '汇总'
      return
    }
    if (col.property === 'availableQty') {
      sums[index] = `${pageTotalAvail.toLocaleString()} 件 (总 ${grandTotalAvail.toLocaleString()})`
      return
    }
    if (col.property === 'transitQty') {
      sums[index] = `+${pageTotalTransit.toLocaleString()} 件 (总 +${grandTotalTransit.toLocaleString()})`
      return
    }
    if (col.property === 'childCode') {
      sums[index] = `本页 ${data.length} / 筛选 ${filteredChildPhysicalStockData.value.length} (总 ${childPhysicalStockData.value.length})`
      return
    }
    sums[index] = '-'
  })

  return sums
}

// 汇总行计算 3: 穿透齐套与缺料预警汇总
const getCompletenessSummary = (param: { columns: any[]; data: any[] }) => {
  const { columns, data } = param
  const sums: string[] = []

  const totalCurrentSets = data.reduce((s, i) => s + (i.currentSets || 0), 0)
  const totalTargetSets = data.reduce((s, i) => s + (i.targetSets || 0), 0)
  const totalGapSets = data.reduce((s, i) => s + (i.gapSets || 0), 0)
  let totalSuggestedQty = 0
  let totalNetSuggestedQty = 0
  data.forEach(row => {
    if (row.shortageItems) {
      row.shortageItems.forEach((st: any) => {
        totalSuggestedQty += st.suggestedQty || 0
        totalNetSuggestedQty += st.netShortageQty || 0
      })
    }
  })

  columns.forEach((col, index) => {
    if (index === 0 || col.label === '物料编码') {
      sums[index] = '缺料汇总'
      return
    }
    if (col.label === '预警等级') {
      sums[index] = `共 ${data.length} 项预警`
      return
    }
    if (col.label?.includes('实际可售') || col.label?.includes('目标')) {
      sums[index] = `${totalCurrentSets.toLocaleString()} / 缺 ${totalGapSets.toLocaleString()} 套`
      return
    }
    if (col.label?.includes('补货建议') || col.label?.includes('采购')) {
      sums[index] = `需补 ${totalSuggestedQty.toLocaleString()} 件 (净缺 ${totalNetSuggestedQty.toLocaleString()} 件)`
      return
    }
    if (col.label === '操作') {
      sums[index] = ''
      return
    }
    sums[index] = '-'
  })

  return sums
}



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
  candidateFilterPlatform.value = '全部'
  candidateFilterAccount.value = '全部'
  candidateFilterSite.value = '全部'
  candidateSearchKey.value = ''
  candidateOnlyUntracked.value = false
  candidateCurrentPage.value = 1
  selectedCandidateRows.value = []
  if (candidateTableRef.value) {
    candidateTableRef.value.clearSelection()
  }
  addAsinDialogVisible.value = true
}

const handleConfirmBatchAddAsin = async () => {
  if (selectedCandidateRows.value.length === 0) {
    ElMessage.warning('请至少勾选一个待添加的 ASIN')
    return
  }

  const itemsToAdd = selectedCandidateRows.value.filter(r => !isRowAlreadyTracked(r))
  if (itemsToAdd.length === 0) {
    ElMessage.info('所选 ASIN 已全部在跟踪列表中，无需重复添加')
    return
  }

  const siteFlags: Record<string, string> = { US: '🇺🇸', DE: '🇩🇪', UK: '🇬🇧', JP: '🇯🇵', CA: '🇨🇦' }
  const newRecords: Partial<AsinTrackRecord>[] = itemsToAdd.map(item => ({
    platform: item.platform || 'Amazon',
    account: item.account,
    site: item.site,
    countryFlag: item.countryFlag || siteFlags[item.site] || '🌐',
    asin: item.asin,
    sku: item.sku,
    materialCode: item.materialCode,
    status: '正常跟踪',
    addTime: new Date().toLocaleString().slice(0, 16)
  }))

  const count = await dbBatchImportAsinTracks(newRecords)
  await refreshAllBackendData()
  addAsinDialogVisible.value = false
  selectedCandidateRows.value = []
  ElMessage.success(`成功批量添加 ${count} 项跟踪 ASIN 至列表！`)
}

const handleOpenManualAddModal = () => {
  asinForm.value = {
    platform: candidateFilterPlatform.value !== '全部' ? candidateFilterPlatform.value : 'Amazon',
    account: candidateFilterAccount.value !== '全部' ? candidateFilterAccount.value : 'MNE',
    site: candidateFilterSite.value !== '全部' ? candidateFilterSite.value : 'US',
    asin: '',
    sku: '',
    materialCode: '',
    status: '正常跟踪'
  }
  manualAddDialogVisible.value = true
}

const handleSaveManualAddAsin = async () => {
  if (!asinForm.value.asin || !asinForm.value.sku || !asinForm.value.materialCode) {
    ElMessage.warning('请填写 ASIN、SKU 和物料编码')
    return
  }

  const siteMap: Record<string, string> = { US: '🇺🇸', DE: '🇩🇪', UK: '🇬🇧', JP: '🇯🇵', CA: '🇨🇦' }
  const flag = siteMap[asinForm.value.site] || '🌐'

  await dbSaveAsinTrack({
    platform: asinForm.value.platform || 'Amazon',
    account: asinForm.value.account,
    site: asinForm.value.site,
    countryFlag: flag,
    asin: asinForm.value.asin.trim(),
    sku: asinForm.value.sku.trim(),
    materialCode: asinForm.value.materialCode.trim(),
    status: asinForm.value.status as any,
    addTime: new Date().toLocaleString().slice(0, 16)
  })

  await refreshAllBackendData()
  manualAddDialogVisible.value = false
  ElMessage.success(`跟踪 ASIN [${asinForm.value.asin}] 已成功保存并持久化到后台！`)
}

const handleEditAsinTrack = (row: AsinTrackRecord) => {
  isEditAsin.value = true
  const idx = asinTrackData.value.findIndex(item => item.asin === row.asin && item.sku === row.sku)
  activeEditAsinIndex.value = idx
  asinForm.value = {
    platform: row.platform || 'Amazon',
    account: row.account,
    site: row.site,
    asin: row.asin,
    sku: row.sku,
    materialCode: row.materialCode,
    status: row.status
  }
  editAsinDialogVisible.value = true
}

const handleSaveAsinForm = async () => {
  if (!asinForm.value.asin || !asinForm.value.sku || !asinForm.value.materialCode) {
    ElMessage.warning('请填写 ASIN、SKU 和物料编码')
    return
  }

  const siteMap: Record<string, string> = { US: '🇺🇸', DE: '🇩🇪', UK: '🇬🇧', JP: '🇯🇵', CA: '🇨🇦' }
  const flag = siteMap[asinForm.value.site] || '🌐'

  await dbSaveAsinTrack({
    platform: asinForm.value.platform || 'Amazon',
    account: asinForm.value.account,
    site: asinForm.value.site,
    countryFlag: flag,
    asin: asinForm.value.asin.trim(),
    sku: asinForm.value.sku.trim(),
    materialCode: asinForm.value.materialCode.trim(),
    status: asinForm.value.status as any,
    addTime: new Date().toLocaleString().slice(0, 16)
  })

  await refreshAllBackendData()
  editAsinDialogVisible.value = false
  ElMessage.success(`跟踪 ASIN [${asinForm.value.asin}] 已成功更新！`)
}

const asinTableRef = ref()
const selectedAsinRows = ref<AsinTrackRecord[]>([])

const handleAsinSelectionChange = (rows: AsinTrackRecord[]) => {
  selectedAsinRows.value = rows
}

const handleDeleteAsinTrack = (row: AsinTrackRecord) => {
  ElMessageBox.confirm(`确定取消对 ASIN [${row.asin}] (SKU: ${row.sku}) 的跟踪吗？`, '取消跟踪', { confirmButtonText: '确定取消', cancelButtonText: '关闭', type: 'warning' })
    .then(async () => {
      await dbDeleteAsinTrack(row.asin, row.sku)
      await refreshAllBackendData()
      selectedAsinRows.value = selectedAsinRows.value.filter(r => !(r.asin === row.asin && r.sku === row.sku))
      ElMessage.success(`已成功取消 ASIN [${row.asin}] 的跟踪！`)
    }).catch(() => {})
}

// 批量取消已选中的 ASIN 跟踪
const handleBatchDeleteAsinTracks = () => {
  if (selectedAsinRows.value.length === 0) {
    ElMessage.warning('请先勾选需要取消跟踪的 ASIN 项')
    return
  }
  const count = selectedAsinRows.value.length
  ElMessageBox.confirm(
    `确定要批量取消已选中的 ${count} 项 ASIN 跟踪吗？`,
    '批量取消跟踪确认',
    {
      confirmButtonText: '确定取消',
      cancelButtonText: '放弃',
      type: 'warning'
    }
  ).then(async () => {
    try {
      for (const row of selectedAsinRows.value) {
        await dbDeleteAsinTrack(row.asin, row.sku)
      }
      await refreshAllBackendData()
      selectedAsinRows.value = []
      ElMessage.success(`已成功批量取消 ${count} 项 ASIN 跟踪`)
    } catch (err: any) {
      ElMessage.error(err?.message || '批量取消跟踪失败')
    }
  }).catch(() => {})
}

const isUpdatingAsin = ref(false)

// 单个更新 ASIN 对应物料属性与关系
const handleUpdateSingleAsin = (row: AsinTrackRecord) => {
  ElMessageBox.confirm(
    `确定要更新 ASIN [${row.asin}] (销售SKU: ${row.sku}) 的对应物料属性与绑定关系信息吗？\n• 将校验并同步关联组合物料 [${row.materialCode}] 的最新品名、款式、材质、规格及映射关系。`,
    '更新属性与关系确认',
    {
      confirmButtonText: '立即更新',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(async () => {
    try {
      await dbUpdateSingleAsinTrack(row.asin, row.sku)
      await refreshAllBackendData()
      ElMessage.success(`ASIN [${row.asin}] (SKU: ${row.sku}) 对应物料属性与关系已成功更新！`)
    } catch (err: any) {
      ElMessage.error(err?.message || '更新失败')
    }
  }).catch(() => {})
}

// 全量更新全部 ASIN 属性与关系
const handleUpdateAllAsinTracks = () => {
  if (asinTrackData.value.length === 0) {
    ElMessage.info('暂无 ASIN 跟踪记录可更新')
    return
  }
  const count = asinTrackData.value.length
  ElMessageBox.confirm(
    `确定要全量更新当前全部 ${count} 条 ASIN 记录的对应属性与物料关系信息吗？\n系统将自动校验映射关系、匹配最新父物料属性并同步海外仓穿透数据。`,
    '全量更新属性与关系确认',
    {
      confirmButtonText: `确定全量更新 (${count}条)`,
      cancelButtonText: '取消',
      type: 'primary'
    }
  ).then(async () => {
    isUpdatingAsin.value = true
    try {
      const updatedCount = await dbUpdateAllAsinTracks()
      await refreshAllBackendData()
      ElMessage.success(`已成功全量更新 ${updatedCount} 项 ASIN 对应物料属性与映射关系信息！`)
    } catch (err: any) {
      ElMessage.error(err?.message || '全量更新失败')
    } finally {
      isUpdatingAsin.value = false
    }
  }).catch(() => {})
}

// 批量更新已勾选的 ASIN 属性与关系
const handleUpdateSelectedAsinTracks = () => {
  if (selectedAsinRows.value.length === 0) {
    ElMessage.warning('请先勾选需要更新的 ASIN 项')
    return
  }
  const count = selectedAsinRows.value.length
  ElMessageBox.confirm(
    `确定要批量更新已勾选的 ${count} 条 ASIN 的对应物料属性与关系信息吗？`,
    '批量更新属性与关系确认',
    {
      confirmButtonText: `确定更新已选 (${count}条)`,
      cancelButtonText: '取消',
      type: 'primary'
    }
  ).then(async () => {
    isUpdatingAsin.value = true
    try {
      for (const row of selectedAsinRows.value) {
        await dbUpdateSingleAsinTrack(row.asin, row.sku)
      }
      await refreshAllBackendData()
      ElMessage.success(`已成功批量更新勾选的 ${count} 项 ASIN 对应物料属性与关系！`)
    } catch (err: any) {
      ElMessage.error(err?.message || '批量更新失败')
    } finally {
      isUpdatingAsin.value = false
    }
  }).catch(() => {})
}

const handleBatchImportAsin = () => {
  importParsedList.value = []
  importPasteText.value = ''
  importActiveTab.value = 'file'
  batchImportAsinDialogVisible.value = true
}

const handleDownloadAsinTemplate = async () => {
  try {
    await downloadAsinExcelTemplate()
    ElMessage.success('已生成并下载 ASIN 跟踪标准美化导入模板！')
  } catch (err: any) {
    ElMessage.error(err?.message || '下载模板失败')
  }
}

const handleFileImportChange = async (uploadFile: any) => {
  if (!uploadFile || !uploadFile.raw) return
  try {
    isParsingImportFile.value = true
    const buffer = await uploadFile.raw.arrayBuffer()
    const parsed = await parseAsinExcelFile(buffer)
    parsed.forEach(item => {
      item.isAlreadyTracked = isRowAlreadyTracked({ asin: item.asin, sku: item.sku })
    })
    importParsedList.value = parsed
    const valid = parsed.filter(p => p.isValid).length
    ElMessage.success(`成功从文件 [${uploadFile.name}] 解析出 ${parsed.length} 条记录 (其中 ${valid} 条格式有效)`)
  } catch (err: any) {
    ElMessage.error(err.message || '解析 Excel 文件失败，请确认文件格式')
  } finally {
    isParsingImportFile.value = false
  }
}

const handleParsePasteText = () => {
  if (!importPasteText.value.trim()) {
    ElMessage.warning('请先粘贴或输入数据文本')
    return
  }
  const parsed = parseAsinPasteText(importPasteText.value)
  if (!parsed.length) {
    ElMessage.warning('未能识别出有效数据行')
    return
  }
  parsed.forEach(item => {
    item.isAlreadyTracked = isRowAlreadyTracked({ asin: item.asin, sku: item.sku })
  })
  importParsedList.value = parsed
  const valid = parsed.filter(p => p.isValid).length
  ElMessage.success(`成功解析出 ${parsed.length} 条数据 (其中 ${valid} 条格式有效)`)
}

const handleFillSamplePasteText = () => {
  importPasteText.value = [
    '平台\t账号\t站点\tASIN\t销售SKU\t组合物料编码',
    'Amazon\tMNE\tUS\tB08N5WRWNW\tSKU-US-00192\tCB-B01*2-PBM-YL-2',
    'Amazon\tWKJ\tUS\tB09X1V8901\tWKJ-US-00214\tDS-B05*2-PBM-YL-2',
    'Amazon\tYBS\tDE\tB07TH88910\tYBS-DE-00305\tCB-B02*2-PBMGL-YL-2',
    'Amazon\tDW\tUS\tB089K888XX\tDW-US-00418\tCB-B03*2-PBMTC-YL-2',
    'Amazon\tBYH\tUK\tB09L1K4582\tBYH-UK-00520\tCB-B04*2-PBM-YL-2'
  ].join('\n')
  ElMessage.info('已填充 5 条标准示范数据，点击【解析文本数据】即可预览校验')
}

const handleConfirmExecuteImport = async () => {
  const validList = importParsedList.value.filter(i => i.isValid)
  if (!validList.length) {
    ElMessage.warning('暂无可导入的有效记录')
    return
  }
  const siteFlags: Record<string, string> = { US: '🇺🇸', DE: '🇩🇪', UK: '🇬🇧', JP: '🇯🇵', CA: '🇨🇦' }
  const newRecords: Partial<AsinTrackRecord>[] = validList.map(item => ({
    platform: item.platform || 'Amazon',
    account: item.account,
    site: item.site,
    countryFlag: siteFlags[item.site] || '🌐',
    asin: item.asin,
    sku: item.sku,
    materialCode: item.materialCode,
    status: '正常跟踪',
    addTime: new Date().toLocaleString().slice(0, 16)
  }))

  const count = await dbBatchImportAsinTracks(newRecords)
  await refreshAllBackendData()
  batchImportAsinDialogVisible.value = false
  importParsedList.value = []
  ElMessage.success(`成功批量导入 ${count} 条 ASIN 跟踪记录！已更新至看板与后台数据库。`)
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

// 判断父物料各子物料折算套数是否完全齐套平衡（存量无短板）
const isRowBalanced = (row: any): boolean => {
  if (!row || !row.childMaterials || row.childMaterials.length <= 1) return false
  const avail = row.calculatedParentAvailable ?? 0
  if (avail === 0) return false
  return row.childMaterials.every((c: any) => Math.floor((c.availableQty || 0) / (c.bomRatio || 1)) === avail)
}

// 展开行：子物料多海外仓分行展示合并单元格方法 (前4列合并同一子物料)
const handleChildSpanMethod = ({ row, columnIndex }: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  // 合并前4列：子物料图片(0)、子物料编码(1)、子物料名称(2)、绑定用量(配比)(3)
  if (columnIndex <= 3) {
    const rowSpan = row.rowSpan !== undefined ? row.rowSpan : 1
    if (rowSpan > 0) {
      return { rowspan: rowSpan, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
  return { rowspan: 1, colspan: 1 }
}

// 13. 其他通用方法与后台同步
const handleTabChange = (name: any) => {
  refreshAllBackendData()
  ElMessage.info(`切换至: ${name === 'kanban' ? 'SKU海外仓库存看板' : name === 'asinTrack' ? 'ASIN 跟踪管理' : name === 'binding' ? '父子物料绑定关系' : name === 'childStock' ? '子物料库存明细' : '穿透齐套与缺料预警'}`)
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

const isSyncing = ref(false)
const handleManualSync = async () => {
  isSyncing.value = true
  try {
    await refreshAllBackendData()
    ElMessage.success('已刷新同步最新的 ERP 海外仓库存数据！')
  } finally {
    isSyncing.value = false
  }
}

const isExportingKanban = ref(false)
const handleExportKanbanData = async () => {
  if (!filteredTableData.value.length) {
    ElMessage.warning('当前筛选条件下无可用看板数据可导出')
    return
  }
  isExportingKanban.value = true
  try {
    await exportKanbanDataToExcel(filteredTableData.value, {
      account: filterAccount.value,
      site: filterSite.value,
      tpOverseasWh: filterTpOverseasWh.value,
      warehouseName: filterWarehouseName.value,
      searchKey: searchKey.value,
      onlyShowBottleneck: onlyShowBottleneck.value
    })
    ElMessage.success(`已成功导出 ${filteredTableData.value.length} 款海外仓库存看板数据 Excel 表格！`)
  } catch (err: any) {
    ElMessage.error(err?.message || '导出 Excel 失败')
  } finally {
    isExportingKanban.value = false
  }
}
const handleExport = handleExportKanbanData
const handleExportAsinTrackData = handleExportKanbanData

// 订单占用库存 (Unshipped) 弹窗与后台实时拉取逻辑
const unshippedDialogVisible = ref(false)
const activeUnshippedRow = ref<ParentPenetrateKanbanRecord | null>(null)
const isSyncingUnshipped = ref(false)

const handleViewUnshippedOrders = (row: ParentPenetrateKanbanRecord) => {
  activeUnshippedRow.value = row
  unshippedDialogVisible.value = true
}

const handleSyncUnshippedOrders = async () => {
  try {
    isSyncingUnshipped.value = true
    const res = await dbSyncUnshippedOrders()
    await refreshAllBackendData()
    if (activeUnshippedRow.value) {
      const updatedRow = rawKanbanData.value.find(r => r.id === activeUnshippedRow.value?.id)
      if (updatedRow) {
        activeUnshippedRow.value = updatedRow
      }
    }
    ElMessage.success(`成功拉取后台 Unshipped 待发货订单！已同步 ${res.count} 笔订单，总锁定占用 ${res.totalOccupied} 套海外仓物理库存。`)
  } catch (err: any) {
    ElMessage.error(err?.message || '拉取后台订单失败，请重试')
  } finally {
    isSyncingUnshipped.value = false
  }
}
const activeBomChildList = computed(() => {
  if (!activeBomRow.value) return []
  const parentCode = activeBomRow.value.parentMaterialCode
  const binding = bindingTableData.value.find(b => b.parentCode === parentCode)
  const boundMap = new Map<string, any>()
  if (binding && binding.boundChildren) {
    binding.boundChildren.forEach((bc: any) => {
      boundMap.set(bc.childCode, bc)
    })
  }

  return (activeBomRow.value.childMaterials || []).map((cm: any) => {
    const bound: any = boundMap.get(cm.childCode) || {}
    const meta: any = getFurnitureChildMeta(cm.childCode) || {}
    return {
      childCode: cm.childCode,
      childName: cm.childName || bound.childName || meta.childName || cm.childCode,
      image: bound.image || meta.image || getChildMaterialImage(cm.childCode),
      style: bound.childStyle || meta.childStyle || '-',
      mainMaterial: bound.childMaterial || meta.childMaterial || '-',
      brand: bound.childBrand || meta.childBrand || '中性',
      color: bound.childColor || meta.childColor || '-',
      packQty: bound.childPackQty || meta.childPackQty || '1pack',
      bomRatio: cm.bomRatio || bound.ratio || 1,
      availableQty: cm.availableQty ?? 0,
      transitQty: cm.transitQty ?? 0
    }
  })
})

const handleViewBomDetail = (row: any) => {
  activeBomRow.value = row
  bomDetailDialogVisible.value = true
}

const handleViewWarehouseDetail = (row: any) => {
  activeWarehouseRow.value = row
  warehouseDetailDialogVisible.value = true
}

const handlePenetrateFromModal = (whRow: any) => {
  if (!activeWarehouseRow.value) return
  handlePenetrateWarehouse(activeWarehouseRow.value, whRow)
}

const handleGoToBindingFromBom = () => {
  if (!activeBomRow.value) return
  const code = activeBomRow.value.parentMaterialCode
  bomDetailDialogVisible.value = false
  handleGoToBindingForParent(code)
}

const handlePenetrateDetail = (row: any) => { activePenetrateRow.value = row; penetrateDialogVisible.value = true }

const handlePenetrateWarehouse = (parentRow: any, whRow: any) => {
  activePenetrateRow.value = {
    ...parentRow,
    tpOverseasWh: whRow.tpWh,
    warehouseName: whRow.warehouseName,
    calculatedParentAvailable: whRow.availableSets,
    calculatedParentTransit: whRow.transitSets,
    childMaterials: whRow.childMaterials && whRow.childMaterials.length
      ? whRow.childMaterials
      : parentRow.childMaterials
  }
  penetrateDialogVisible.value = true
}

// 展开列表：同一个第三方海外仓涵盖多个仓库时，第 0 列 (第三方海外仓) 进行行合并
const handleWarehouseSpanMethod = ({ row, columnIndex }: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  if (columnIndex === 0) {
    const span = row.tpRowSpan !== undefined ? row.tpRowSpan : 1
    if (span > 0) {
      return { rowspan: span, colspan: 1 }
    } else {
      return { rowspan: 0, colspan: 0 }
    }
  }
  return { rowspan: 1, colspan: 1 }
}
const handlePenetrateDetailFromAlert = (alertRow: CompletenessAlertRecord) => {
  const cleanCode = alertRow.parentCode.replace(/\s*\(.*?\)\s*$/, '')
  const parentMatch = rawKanbanData.value.find(k => 
    k.parentMaterialCode === cleanCode || alertRow.parentCode.startsWith(k.parentMaterialCode)
  )

  if (parentMatch) {
    // 优先从该父物料的 warehouseBreakdown 中找到该特定物理分仓的数据
    const whBreakdown = parentMatch.warehouseBreakdown?.find(w => 
      w.warehouseName === alertRow.warehouseName && (!alertRow.tpOverseasWh || w.tpWh === alertRow.tpOverseasWh)
    )

    if (whBreakdown && whBreakdown.childMaterials && whBreakdown.childMaterials.length > 0) {
      activePenetrateRow.value = {
        ...parentMatch,
        tpOverseasWh: whBreakdown.tpWh,
        warehouseName: whBreakdown.warehouseName,
        calculatedParentAvailable: whBreakdown.availableSets,
        calculatedParentTransit: whBreakdown.transitSets,
        childMaterials: whBreakdown.childMaterials.map(c => ({
          childCode: c.childCode,
          childName: c.childName,
          bomRatio: c.bomRatio,
          availableQty: c.availableQty,
          transitQty: c.transitQty
        }))
      }
    } else {
      // 备用：从 alertRow 的 shortageItems 提取该仓数据
      const whChildMats = parentMatch.childMaterials.map(c => {
        const item = alertRow.shortageItems?.find(s => s.childCode === c.childCode)
        return {
          childCode: c.childCode,
          childName: c.childName,
          bomRatio: c.bomRatio,
          availableQty: item ? item.childStock : 0,
          transitQty: item ? item.transitQty : 0
        }
      })
      activePenetrateRow.value = {
        ...parentMatch,
        tpOverseasWh: alertRow.tpOverseasWh || parentMatch.tpOverseasWh,
        warehouseName: alertRow.warehouseName,
        calculatedParentAvailable: alertRow.currentSets,
        calculatedParentTransit: 0,
        childMaterials: whChildMats
      }
    }
    penetrateDialogVisible.value = true
  } else {
    ElMessage.info(`正在查看 [${cleanCode}] 的缺料穿透明细`)
  }
}

const handleViewBomDetailFromAlert = (alertRow: CompletenessAlertRecord) => {
  const cleanCode = alertRow.parentCode.replace(/\s*\(.*?\)\s*$/, '')
  const matched = rawKanbanData.value.find(k => 
    k.parentMaterialCode === cleanCode || alertRow.parentCode.startsWith(k.parentMaterialCode)
  )
  if (matched) {
    handleViewBomDetail(matched)
  } else {
    activeBomRow.value = {
      parentMaterialCode: cleanCode,
      sku: alertRow.sku || cleanCode,
      productName: alertRow.productName,
      childMaterials: alertRow.shortageItems.map(s => ({
        childCode: s.childCode,
        childName: s.childName,
        bomRatio: s.bomRatio
      }))
    }
    bomDetailDialogVisible.value = true
  }
}
const handleApplyRestock = (row: any) => {
  ElMessageBox.prompt(`正在为父物料 [${row.parentMaterialCode}] 发起补货申请:`, '发起补货申请', { confirmButtonText: '提交', cancelButtonText: '取消', inputValue: '1000' })
    .then(({ value }) => { ElMessage.success(`已提交补货 ${value} 件！`) }).catch(() => {})
}
const handleBatchAnalysis = () => { ElMessage.success('已完成齐套分析') }

// 绑定管理方法
const handleViewBomDetailInBinding = (row: any) => {
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
      comboType: row.childMaterials && row.childMaterials.length > 1 ? '成套组合' : '多件打包',
      tpWh: row.tpOverseasWh || '万邑通',
      children: row.childMaterials ? row.childMaterials.map((c: any) => ({ childCode: c.childCode, childName: c.childName, ratio: c.bomRatio })) : [{ childCode: '', childName: '', ratio: 1 }]
    }
    bindingDialogVisible.value = true
  }
}

const handleOpenAddBinding = () => {
  isEditBinding.value = false
  selectedBaseComboCode.value = ''
  bindingForm.value = { parentCode: '', sku: '', productName: '', comboType: '多件打包', tpWh: '万邑通', children: [{ childCode: '', childName: '', ratio: 1 }] }
  bindingDialogVisible.value = true
}

const applyBaseComboToBindingForm = (combo: FurnitureComboRecord) => {
  bindingForm.value.parentCode = combo.parentCode
  bindingForm.value.sku = combo.parentCode
  bindingForm.value.productName = combo.productName
  bindingForm.value.style = combo.style
  bindingForm.value.material = combo.material
  bindingForm.value.brand = combo.brand
  bindingForm.value.color = combo.color
  bindingForm.value.packQty = combo.packQty
  bindingForm.value.comboType = combo.comboType
  bindingForm.value.children = combo.children.map(c => ({
    childCode: c.childCode,
    childName: c.childName,
    ratio: c.ratio,
    childProductName: c.childProductName,
    childStyle: c.childStyle,
    childMaterial: c.childMaterial,
    childTarget: c.childTarget,
    childModel: c.childModel,
    childBrand: c.childBrand,
    childPattern: c.childPattern,
    childColor: c.childColor,
    childPackQty: c.childPackQty
  }))
  selectedBaseComboCode.value = combo.parentCode
  ElMessage.success(`已选用基础库 [${combo.parentCode}]，自动载入 ${combo.children.length} 款子物料配比！`)
}

const handleSelectBaseComboFromSelect = (code: string) => {
  if (!code) return
  const found = FURNITURE_COMBO_BOM_LIBRARY.find(c => c.parentCode === code)
  if (found) {
    applyBaseComboToBindingForm(found)
  }
}

const handleChooseComboFromLibrary = (row: FurnitureComboRecord) => {
  isEditBinding.value = false
  applyBaseComboToBindingForm(row)
  furnitureLibraryDialogVisible.value = false
  bindingDialogVisible.value = true
}

const openBaseLibraryBrowser = () => {
  furnitureLibSelection.value = []
  furnitureLibraryDialogVisible.value = true
}

const handleFurnitureSelectionChange = (selection: FurnitureComboRecord[]) => {
  furnitureLibSelection.value = selection
}

const handleBatchImportSelectedBoms = async () => {
  if (furnitureLibSelection.value.length === 0) {
    ElMessage.warning('请先勾选需要导入的组合物料')
    return
  }
  const count = await dbBatchImportMaterialBindings(furnitureLibSelection.value.map(item => ({
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
    status: '已绑定',
    updateTime: new Date().toLocaleString(),
    boundChildren: item.children.map(c => ({
      childCode: c.childCode,
      childName: c.childName,
      ratio: c.ratio,
      childProductName: c.childProductName,
      childStyle: c.childStyle,
      childMaterial: c.childMaterial,
      childTarget: c.childTarget,
      childModel: c.childModel,
      childBrand: c.childBrand,
      childPattern: c.childPattern,
      childColor: c.childColor,
      childPackQty: c.childPackQty
    }))
  })))
  await refreshAllBackendData()
  furnitureLibraryDialogVisible.value = false
  ElMessage.success(`成功将勾选的 ${count} 款组合物料 BOM 关系批量导入系统！`)
}

const handleImportAllUnaddedBoms = () => {
  if (unaddedFurnitureComboList.value.length === 0) {
    ElMessage.info('所有组合物料已添加完成，无需导入')
    return
  }
  ElMessageBox.confirm(
    `确定要将当前未添加的 ${unaddedComboCount.value} 款组合物料 BOM 数据批量导入到父子物料绑定关系中吗？`,
    '批量导入未添加组合物料',
    { confirmButtonText: `确定导入全部未添加 (${unaddedComboCount.value}款)`, cancelButtonText: '取消', type: 'success' }
  ).then(async () => {
    const count = await dbBatchImportMaterialBindings(unaddedFurnitureComboList.value.map(item => ({
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
      status: '已绑定',
      updateTime: new Date().toLocaleString(),
      boundChildren: item.children.map(c => ({
        childCode: c.childCode,
        childName: c.childName,
        ratio: c.ratio,
        childProductName: c.childProductName,
        childStyle: c.childStyle,
        childMaterial: c.childMaterial,
        childTarget: c.childTarget,
        childModel: c.childModel,
        childBrand: c.childBrand,
        childPattern: c.childPattern,
        childColor: c.childColor,
        childPackQty: c.childPackQty
      }))
    })))
    await refreshAllBackendData()
    furnitureLibraryDialogVisible.value = false
    ElMessage.success(`已成功批量导入 ${count} 款组合物料 BOM 绑定数据！`)
  }).catch(() => {})
}

const handleChildCodeChangeInRow = (item: any, code: string) => {
  if (!code) return
  const foundInBase = FURNITURE_CHILD_MATERIALS.find(c => c.childCode === code)
  if (foundInBase) {
    item.childName = foundInBase.childName
    item.childProductName = foundInBase.childProductName
    item.childStyle = foundInBase.childStyle
    item.childMaterial = foundInBase.childMaterial
    item.childTarget = foundInBase.childTarget
    item.childModel = foundInBase.childModel
    item.childBrand = foundInBase.childBrand
    item.childPattern = foundInBase.childPattern
    item.childColor = foundInBase.childColor
    item.childPackQty = foundInBase.childPackQty
    return
  }
  const foundInExisting = allChildMaterialOptions.value.find(c => c.childCode === code)
  if (foundInExisting) {
    item.childName = foundInExisting.childName
  }
}

const handleEditBinding = (row: MaterialBindingRecord) => {
  isEditBinding.value = true
  bindingForm.value = {
    parentCode: row.parentCode,
    sku: row.sku,
    productName: row.productName,
    style: row.style,
    material: row.material,
    brand: row.brand,
    color: row.color,
    packQty: row.packQty,
    comboType: getComboTypeMeta(row.comboType).type,
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
    style: bindingForm.value.style,
    material: bindingForm.value.material,
    brand: bindingForm.value.brand,
    color: bindingForm.value.color,
    packQty: bindingForm.value.packQty,
    comboType: bindingForm.value.comboType,
    tpWh: bindingForm.value.tpWh,
    status: bindingForm.value.children.length > 0 ? '已绑定' : '未绑定',
    updateTime: new Date().toLocaleString(),
    boundChildren: bindingForm.value.children.map(c => ({
      childCode: c.childCode,
      childName: c.childName || c.childCode,
      ratio: c.ratio || 1,
      childProductName: c.childProductName,
      childStyle: c.childStyle,
      childMaterial: c.childMaterial,
      childTarget: c.childTarget,
      childModel: c.childModel,
      childBrand: c.childBrand,
      childPattern: c.childPattern,
      childColor: c.childColor,
      childPackQty: c.childPackQty
    }))
  })

  await refreshAllBackendData()
  bindingDialogVisible.value = false
  ElMessage.success(`成功保存父物料 [${bindingForm.value.parentCode}] 的 BOM 绑定关系与组合类型 [${bindingForm.value.comboType}]！`)
}

const bindingTableRef = ref()
const selectedBindingRows = ref<MaterialBindingRecord[]>([])

const handleBindingSelectionChange = (rows: MaterialBindingRecord[]) => {
  selectedBindingRows.value = rows
}

const handleUnbind = (row: MaterialBindingRecord) => {
  ElMessageBox.confirm(`确定要解除父物料 [${row.parentCode}] 的子物料 BOM 绑定关系吗？`, '解绑确认', { confirmButtonText: '确定解绑', cancelButtonText: '取消', type: 'warning' })
    .then(async () => {
      await dbDeleteMaterialBinding(row.parentCode)
      await refreshAllBackendData()
      ElMessage.success(`已成功解除 [${row.parentCode}] 的绑定关系`)
    }).catch(() => {})
}

// 批量解绑已选中的绑定关系
const handleBatchUnbindSelected = () => {
  if (selectedBindingRows.value.length === 0) {
    ElMessage.warning('请先勾选需要解绑的父子物料项')
    return
  }
  const count = selectedBindingRows.value.length
  ElMessageBox.confirm(
    `确定要批量解除已勾选的 ${count} 款父子物料 BOM 绑定关系吗？\n解绑后，这些物料将重新回到组合物料库待添加列表中。`,
    '批量解绑确认',
    { confirmButtonText: `确定解绑已选 (${count}款)`, cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {
    const codes = selectedBindingRows.value.map(r => r.parentCode)
    await dbBatchDeleteMaterialBindings(codes)
    await refreshAllBackendData()
    selectedBindingRows.value = []
    ElMessage.success(`已成功批量解除 ${count} 款物料的父子 BOM 绑定关系！`)
  }).catch(() => {})
}

// 全选解绑全部已添加的绑定关系
const handleUnbindAll = () => {
  if (filteredBindingTableData.value.length === 0) {
    ElMessage.info('当前无可解绑的绑定关系')
    return
  }
  const count = filteredBindingTableData.value.length
  ElMessageBox.confirm(
    `确定要全选解除当前展示的全部 ${count} 款父子物料 BOM 绑定关系吗？\n解绑后所有物料将全部恢复至组合物料库待添加列表中。`,
    '全选解绑确认 (高危操作)',
    { confirmButtonText: `确定全部解绑 (${count}款)`, cancelButtonText: '取消', type: 'error' }
  ).then(async () => {
    const codes = filteredBindingTableData.value.map(r => r.parentCode)
    await dbBatchDeleteMaterialBindings(codes)
    await refreshAllBackendData()
    selectedBindingRows.value = []
    ElMessage.success(`已成功全选解除全部 ${count} 款父子物料绑定关系！`)
  }).catch(() => {})
}

const isUpdatingBinding = ref(false)

// 单个更新父子物料属性与 BOM 关系信息
const handleUpdateSingleBinding = (row: MaterialBindingRecord) => {
  ElMessageBox.confirm(
    `确定要根据最新物料标准库，更新父物料 [${row.parentCode}] 的属性与 BOM 子物料绑定关系吗？\n• 将同步：品名、款式、材质、品牌、颜色、包装数量及子物料规格配比。`,
    '更新属性与关系确认',
    {
      confirmButtonText: '立即更新',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(async () => {
    try {
      await dbUpdateSingleMaterialBinding(row.parentCode)
      await refreshAllBackendData()
      ElMessage.success(`父物料 [${row.parentCode}] 的属性与 BOM 绑定关系信息已成功更新！`)
    } catch (err: any) {
      ElMessage.error(err?.message || '更新失败')
    }
  }).catch(() => {})
}

// 全量更新全部父子物料属性与 BOM 关系
const handleUpdateAllBindings = () => {
  if (bindingTableData.value.length === 0) {
    ElMessage.info('暂无父子物料绑定关系可更新')
    return
  }
  const count = bindingTableData.value.length
  ElMessageBox.confirm(
    `确定要对当前全部 ${count} 项父子物料执行全量更新吗？\n将根据最新基础物料库，全量同步品名、款式、材质、品牌、颜色、规格属性以及子物料 BOM 绑定关系与配比。`,
    '全量更新属性与关系确认',
    {
      confirmButtonText: `确定全量更新 (${count}项)`,
      cancelButtonText: '取消',
      type: 'primary'
    }
  ).then(async () => {
    isUpdatingBinding.value = true
    try {
      const updatedCount = await dbUpdateAllMaterialBindings()
      await refreshAllBackendData()
      ElMessage.success(`已成功全量更新全部 ${updatedCount} 项父子物料的属性与 BOM 绑定关系！`)
    } catch (err: any) {
      ElMessage.error(err?.message || '全量更新失败')
    } finally {
      isUpdatingBinding.value = false
    }
  }).catch(() => {})
}

// 批量更新已勾选的父子物料属性与 BOM 关系
const handleUpdateSelectedBindings = () => {
  if (selectedBindingRows.value.length === 0) {
    ElMessage.warning('请先勾选需要更新的父子物料项')
    return
  }
  const count = selectedBindingRows.value.length
  ElMessageBox.confirm(
    `确定要批量更新已勾选的 ${count} 款父子物料的属性与 BOM 关系信息吗？`,
    '批量更新属性与关系确认',
    {
      confirmButtonText: `确定更新已选 (${count}款)`,
      cancelButtonText: '取消',
      type: 'primary'
    }
  ).then(async () => {
    isUpdatingBinding.value = true
    try {
      for (const row of selectedBindingRows.value) {
        await dbUpdateSingleMaterialBinding(row.parentCode)
      }
      await refreshAllBackendData()
      ElMessage.success(`已成功批量更新勾选的 ${count} 款父子物料属性与 BOM 绑定关系！`)
    } catch (err: any) {
      ElMessage.error(err?.message || '批量更新失败')
    } finally {
      isUpdatingBinding.value = false
    }
  }).catch(() => {})
}

// 现有其他子物料（排除 22 款基础物料）
const existingOtherChildOptions = computed(() => {
  const baseCodes = new Set(FURNITURE_CHILD_MATERIALS.map(c => c.childCode))
  const list: { childCode: string; childName: string }[] = []
  const seen = new Set<string>()
  bindingTableData.value.forEach(parent => {
    if (parent.boundChildren) {
      parent.boundChildren.forEach(child => {
        if (child.childCode && !baseCodes.has(child.childCode) && !seen.has(child.childCode)) {
          seen.add(child.childCode)
          list.push({ childCode: child.childCode, childName: child.childName })
        }
      })
    }
  })
  return list
})

// 子物料物理库存明细的子物料选项严格来源于父子物料绑定关系的子物料
const allChildMaterialOptions = computed(() => {
  const map = new Map<string, { childCode: string; childName: string; linkedParents: string[] }>()
  bindingTableData.value.forEach(parent => {
    if (parent.boundChildren) {
      parent.boundChildren.forEach(child => {
        if (!child.childCode) return
        if (!map.has(child.childCode)) {
          const cMeta = getFurnitureChildMeta(child.childCode)
          map.set(child.childCode, {
            childCode: child.childCode,
            childName: child.childName || cMeta?.childName || ('子物料 ' + child.childCode),
            linkedParents: []
          })
        }
        if (!map.get(child.childCode)!.linkedParents.includes(parent.parentCode)) {
          map.get(child.childCode)!.linkedParents.push(parent.parentCode)
        }
      })
    }
  })
  return Array.from(map.values())
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

const selectedChildLinkedParents = computed(() => {
  if (!childStockForm.value.childCode) return []
  const match = allChildMaterialOptions.value.find(c => c.childCode === childStockForm.value.childCode)
  return match ? match.linkedParents : []
})

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

const handleEmergencyRestock = async (row: any) => {
  const targetStock = row.otherMaxStock
  const bottleneckCode = row.bottleneckChildCode || row.shortageItems?.[0]?.childCode
  const suggestedQty = row.suggestedQty || row.shortageItems?.[0]?.suggestedQty || 0
  if (bottleneckCode) {
    await dbUpdateChildStock(bottleneckCode, targetStock)
    await refreshAllBackendData()
    ElMessage.success(`已为短板子物料 [${bottleneckCode}] 紧急加补 ${suggestedQty} 件，缺料告警已接触！`)
  }
}

// ------------------- 子物料查看绑定父物料相关业务逻辑 -------------------
export interface BoundParentItem {
  parentCode: string
  sku?: string
  productName: string
  style?: string
  material?: string
  brand?: string
  color?: string
  packQty?: string
  comboType: ComboType
  ratio: number
  status?: string
  tpWh?: string
  image?: string
  availableSets?: number
}

const childLinkedParentsDialogVisible = ref(false)
const currentViewingChildCode = ref('')
const childBoundParentsSearchKey = ref('')

const getChildBoundParents = (childCode?: string): BoundParentItem[] => {
  if (!childCode) return []
  const parentsMap = new Map<string, BoundParentItem>()

  // 1. 从当前系统活跃的 bindingTableData 中检索
  bindingTableData.value.forEach(p => {
    const matchedBom = p.boundChildren?.find(c => c.childCode === childCode) || (p.children as any)?.find((c: any) => c.childCode === childCode)
    if (matchedBom) {
      const kanbanItem = rawKanbanData.value.find(k => k.parentMaterialCode === p.parentCode)
      parentsMap.set(p.parentCode, {
        parentCode: p.parentCode,
        sku: p.sku || p.parentCode,
        productName: p.productName || '组合物料',
        style: p.style || getFurnitureComboMeta(p.parentCode)?.style || '-',
        material: p.material || getFurnitureComboMeta(p.parentCode)?.material || '-',
        brand: p.brand || getFurnitureComboMeta(p.parentCode)?.brand || '-',
        color: p.color || getFurnitureComboMeta(p.parentCode)?.color || '-',
        packQty: p.packQty || getFurnitureComboMeta(p.parentCode)?.packQty || '-',
        comboType: p.comboType || getFurnitureComboMeta(p.parentCode)?.comboType || '多件打包',
        ratio: matchedBom.ratio || (matchedBom as any).bomRatio || 1,
        status: p.status || '已绑定',
        tpWh: p.tpWh || (kanbanItem ? (kanbanItem.tpOverseasWh || kanbanItem.warehouseName) : '万邑通'),
        image: kanbanItem?.image,
        availableSets: kanbanItem ? kanbanItem.calculatedParentAvailable : undefined
      })
    }
  })

  // 2. 检查 childPhysicalStockData 中的 linkedParents
  const stockItem = childPhysicalStockData.value.find(s => s.childCode === childCode)
  if (stockItem && stockItem.linkedParents && stockItem.linkedParents.length) {
    stockItem.linkedParents.forEach(pCode => {
      if (!parentsMap.has(pCode)) {
        const comboMeta = getFurnitureComboMeta(pCode)
        const bindingItem = bindingTableData.value.find(b => b.parentCode === pCode)
        const kanbanItem = rawKanbanData.value.find(k => k.parentMaterialCode === pCode)
        const ratio = comboMeta?.children?.find(c => c.childCode === childCode)?.ratio || 1
        parentsMap.set(pCode, {
          parentCode: pCode,
          sku: bindingItem?.sku || pCode,
          productName: comboMeta?.productName || bindingItem?.productName || '组合物料',
          style: comboMeta?.style || bindingItem?.style || '-',
          material: comboMeta?.material || bindingItem?.material || '-',
          brand: comboMeta?.brand || bindingItem?.brand || '-',
          color: comboMeta?.color || bindingItem?.color || '-',
          packQty: comboMeta?.packQty || bindingItem?.packQty || '-',
          comboType: comboMeta?.comboType || bindingItem?.comboType || '多件打包',
          ratio: ratio,
          status: '已绑定',
          tpWh: bindingItem?.tpWh || (kanbanItem ? (kanbanItem.tpOverseasWh || kanbanItem.warehouseName) : '万邑通'),
          image: kanbanItem?.image,
          availableSets: kanbanItem ? kanbanItem.calculatedParentAvailable : undefined
        })
      }
    })
  }

  // 3. 兜底匹配 FURNITURE_COMBO_BOM_LIBRARY (完整组合物料库)
  if (parentsMap.size === 0) {
    FURNITURE_COMBO_BOM_LIBRARY.forEach(combo => {
      const matchedChild = combo.children.find(c => c.childCode === childCode)
      if (matchedChild) {
        const kanbanItem = rawKanbanData.value.find(k => k.parentMaterialCode === combo.parentCode)
        parentsMap.set(combo.parentCode, {
          parentCode: combo.parentCode,
          sku: combo.parentCode,
          productName: combo.productName,
          style: combo.style,
          material: combo.material,
          brand: combo.brand,
          color: combo.color,
          packQty: combo.packQty,
          comboType: combo.comboType,
          ratio: matchedChild.ratio || 1,
          status: '已绑定',
          tpWh: kanbanItem ? (kanbanItem.tpOverseasWh || kanbanItem.warehouseName) : '万邑通',
          image: kanbanItem?.image,
          availableSets: kanbanItem ? kanbanItem.calculatedParentAvailable : undefined
        })
      }
    })
  }

  return Array.from(parentsMap.values())
}

const currentViewingChildMeta = computed(() => getFurnitureChildMeta(currentViewingChildCode.value))

const currentViewingChildStock = computed(() => {
  return childPhysicalStockData.value.filter(s => s.childCode === currentViewingChildCode.value)
})

const currentViewingChildTotalAvail = computed(() => {
  return currentViewingChildStock.value.reduce((s, i) => s + (i.availableQty || 0), 0)
})

const currentViewingChildTotalTransit = computed(() => {
  return currentViewingChildStock.value.reduce((s, i) => s + (i.transitQty || 0), 0)
})

const allCurrentBoundParents = computed(() => getChildBoundParents(currentViewingChildCode.value))

const filteredCurrentBoundParents = computed(() => {
  let list = allCurrentBoundParents.value
  if (childBoundParentsSearchKey.value.trim()) {
    const q = childBoundParentsSearchKey.value.trim().toLowerCase()
    list = list.filter(p =>
      p.parentCode.toLowerCase().includes(q) ||
      p.productName.toLowerCase().includes(q) ||
      (p.style && p.style.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q))
    )
  }
  return list
})

const handleViewChildLinkedParents = (childCode: string) => {
  if (!childCode) return
  currentViewingChildCode.value = childCode
  childBoundParentsSearchKey.value = ''
  childLinkedParentsDialogVisible.value = true
}

const handleGoToKanbanForParent = (parentCode: string) => {
  searchKey.value = parentCode
  filterAccount.value = '全部'
  filterSite.value = '全部'
  filterTpOverseasWh.value = '全部'
  filterWarehouseName.value = '全部'
  onlyShowBottleneck.value = false
  activeTab.value = 'kanban'
  childLinkedParentsDialogVisible.value = false
  ElMessage.success(`已切换至 [SKU海外仓库存看板] 并自动筛选父物料 [${parentCode}]`)
}

const handleGoToBindingForParent = (parentCode: string) => {
  comboTypeFilter.value = '全部'
  bindingSearchKey.value = parentCode
  activeTab.value = 'binding'
  childLinkedParentsDialogVisible.value = false
  ElMessage.success(`已切换至 [父子物料绑定关系] 并自动筛选父物料 [${parentCode}]`)
}
</script>

<style lang="scss" scoped>
.sku-kanban-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 12px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 48px);
  overflow-y: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;

  :deep(.el-table) {
    --el-table-header-bg-color: #f8fafc;
    --el-table-header-text-color: #475569;
    --el-table-border-color: #e2e8f0;
    font-size: 13px;

    th.el-table__cell {
      background-color: #f8fafc !important;
      color: #475569;
      font-weight: 600;
      font-size: 12.5px;
      padding: 6px 0;
    }

    td.el-table__cell {
      padding: 5px 0;
    }

    .el-table__footer-wrapper {
      td.el-table__cell {
        padding: 4px 0 !important;
        font-weight: 600;
        background-color: #f8fafc !important;
        line-height: 1.25 !important;
        white-space: nowrap;

        .cell {
          padding-left: 6px;
          padding-right: 6px;
          line-height: 1.25;
          white-space: nowrap;
        }
      }
    }
  }
}

.mb-4 { margin-bottom: 4px; }
.mb-10 { margin-bottom: 8px; }
.mb-12 { margin-bottom: 10px; }
.mb-16 { margin-bottom: 12px; }
.mb-20 { margin-bottom: 12px; }
.mt-6 { margin-top: 4px; }
.mt-8 { margin-top: 6px; }
.mt-10 { margin-top: 8px; }
.mt-12 { margin-top: 8px; }
.mt-16 { margin-top: 10px; }
.ml-4 { margin-left: 4px; }
.ml-8 { margin-left: 8px; }
.mr-4 { margin-right: 4px; }
.mr-6 { margin-right: 6px; }

/* 顶部统计卡片 (参照 combo.vue 4 栏网格卡片 · 沉稳灰阶视觉降噪 · 紧凑省高) */
.stat-overview-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 8px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .stat-card {
    background: #ffffff;
    border-radius: 6px;
    padding: 7px 12px;
    border: 1px solid #e2e8f0;
    cursor: default;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
    position: relative;
    overflow: hidden;

    &:hover {
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04);
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
      margin-bottom: 3px;

      .type-badge {
        padding: 1px 6px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
        line-height: 1.2;

        &.badge-neutral {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        &.badge-danger {
          background: #fff1f2;
          color: #be123c;
          border: 1px solid #fecdd3;
        }
      }
    }

    .stat-icon-box {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      transition: all 0.2s;

      &.bg-neutral {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        color: #64748b;
      }

      &.bg-rose {
        background: #fff1f2;
        border: 1px solid #fecdd3;
        color: #e11d48;
      }
    }

    .stat-num-row {
      display: flex;
      align-items: baseline;
      gap: 3px;
      margin-bottom: 2px;

      .stat-num {
        font-size: 19px;
        font-weight: 700;
        line-height: 1.1;
        font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
        color: #0f172a;

        &.text-rose {
          color: #be123c;
        }
      }

      .unit {
        font-size: 11px;
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
        font-size: 10.5px;
        color: #94a3b8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .active-indicator {
        flex-shrink: 0;
        font-size: 9.5px;
        font-weight: 600;
        padding: 0 3px;
        border-radius: 2px;
        line-height: 13px;

        &.alert-badge {
          background: #ef4444;
          color: #ffffff;
        }
      }
    }

    &.card-alert.has-alert {
      border-color: #fda4af;
      background: linear-gradient(180deg, #fffbfb 0%, #fff1f2 100%);
    }
  }
}

/* 检索筛选区 (参照 combo.vue query-card) */
.query-card {
  background: #ffffff;
  padding: 12px 16px 4px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  margin-bottom: 10px;

  .search-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .form-actions {
      margin-left: auto;
    }
  }
}

/* 操作工具栏 (参照 combo.vue ak-operate-container) */
.ak-operate-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  margin-bottom: 10px;

  .ak-operate-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

// 页面 Tabs 样式 (经典下划线平铺指示风格，参考示例图)
.tabs-container-card {
  background: #ffffff;
  border-radius: 6px;
  padding: 0 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  :deep(.custom-tabs) {
    flex: 1;

    .el-tabs__header {
      margin: 0 !important;
      border-bottom: 1px solid #e5e7eb !important;
    }

    .el-tabs__nav-wrap {
      margin-bottom: -1px !important;
      &::after {
        display: none !important;
      }
    }

    .el-tabs__nav-scroll {
      overflow: visible;
    }

    .el-tabs__nav {
      border: none !important;
      background: transparent !important;
      padding: 0 !important;
      display: inline-flex;
      align-items: center;
      gap: 0;
    }

    .el-tabs__item {
      border: none !important;
      background: transparent !important;
      font-weight: 400;
      font-size: 14px;
      color: #1f2937;
      padding: 0 24px !important;
      height: 44px !important;
      line-height: 44px !important;
      transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      box-shadow: none !important;

      &:first-child {
        padding-left: 6px !important;
      }

      &:hover {
        color: #1677ff !important;
      }

      &.is-active {
        background: transparent !important;
        color: #1677ff !important;
        font-weight: 600;
      }

      .tab-label-inner {
        display: inline-flex;
        align-items: center;
        gap: 6px;

        .tab-badge-alert {
          background: #fee2e2;
          color: #dc2626;
          font-size: 11px;
          font-weight: 700;
          padding: 0 6px;
          height: 18px;
          line-height: 18px;
          border-radius: 9999px;
          margin-left: 4px;
        }
      }
    }

    .el-tabs__active-bar {
      display: block !important;
      height: 2.5px !important;
      background-color: #1677ff !important;
      border-radius: 2px 2px 0 0 !important;
    }
  }

  .tabs-right-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #94a3b8;
    padding-right: 6px;
    user-select: none;

    .sync-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    }
  }
}

.tab-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

// 筛选面板 Card (参照 combo.vue .query-card)
.filter-panel-card {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", sans-serif;
  background: #ffffff;
  border-radius: 6px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  .filter-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;

    .filter-group {
      display: flex;
      align-items: center;
      gap: 6px;

      .filter-label {
        font-size: 13px;
        color: #475569;
        font-weight: 500;
        white-space: nowrap;
        font-family: inherit;
      }
    }

    .filter-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }
  }
}

// 可视化图表 Card 样式 (参照 combo.vue 精致插图框)
.charts-container-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  .chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }

  .chart-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px;

    .chart-canvas {
      width: 100%;
      height: 250px;
    }
  }
}

// 主表格 Card (参照 combo.vue .table-card 及 .ak-operate-container)
.main-content-card {
  background: #ffffff;
  border-radius: 6px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  flex: 1;
  display: flex;
  flex-direction: column;

  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toolbar-count-text {
      font-size: 13px;
      color: #64748b;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
      display: inline-flex;
      align-items: center;
      gap: 3px;

      .num-highlight {
        font-weight: 700;
        color: #1e293b;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 13px;
      }
    }

    .selected-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 2px 8px;
      background-color: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      color: #2563eb;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;

      .selected-num {
        font-weight: 700;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 12.5px;
      }
    }
  }

  .table-container {
    flex: 1;
    display: flex;
    flex-direction: column;

    // 表头单元格与排序按钮精细化排版
    :deep(.el-table th.el-table__cell) {
      .cell {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        overflow: visible;
      }
      &.is-right .cell {
        justify-content: flex-end;
      }
      &.is-center .cell {
        justify-content: center;
      }
    }

    // 优化排序按钮：精巧紧凑，单行横向排布，不换行，不撑高表头
    :deep(.caret-wrapper) {
      display: inline-flex !important;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 14px !important;
      width: 12px !important;
      margin-left: 4px !important;
      flex-shrink: 0 !important;
      vertical-align: middle;
      cursor: pointer;

      .sort-caret {
        border-width: 4px !important;
        left: 2px !important;
        &.ascending {
          top: -1px !important;
          border-bottom-color: #94a3b8;
        }
        &.descending {
          bottom: -1px !important;
          border-top-color: #94a3b8;
        }
      }
    }

    :deep(.el-table th.is-sortable.ascending .sort-caret.ascending) {
      border-bottom-color: var(--el-color-primary) !important;
    }
    :deep(.el-table th.is-sortable.descending .sort-caret.descending) {
      border-top-color: var(--el-color-primary) !important;
    }
  }

  .card-title-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    .icon { font-size: 18px; }
  }
}

// 基础单元格与编码复制样式 (参照 combo.vue .code-copy-cell)
.site-tag {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  .flag { font-size: 14px; }
}

.code-link {
  color: #2563eb;
  font-weight: 600;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.code-bold {
  font-weight: 700;
  color: #0f172a;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.parent-mat-cell {
  display: flex;
  align-items: center;
  gap: 6px;

  .parent-badge {
    padding: 0 4px;
    font-size: 10px;
    height: 18px;
  }

  .parent-code {
    font-weight: 600;
    color: #1e293b;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }
}

.child-code {
  font-weight: 600;
  color: #334155;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.child-code-link {
  font-weight: 600;
  color: #2563eb;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  border-bottom: 1px dashed transparent;
  transition: all 0.15s ease;

  &:hover {
    color: #1d4ed8;
    border-bottom-color: #2563eb;
    text-decoration: underline;
  }
}

.bound-parent-tag {
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 11px;
  height: 22px;
  line-height: 20px;
  padding: 0 6px;

  &:hover {
    background-color: #dbeafe !important;
    border-color: #3b82f6 !important;
    color: #1d4ed8 !important;
    transform: translateY(-1px);
  }
}

.child-linked-parents-dialog {
  :deep(.el-dialog__body) {
    padding: 16px 20px;
  }
}

.child-meta-overview-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px 18px;
  gap: 16px;

  .child-meta-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 0;

    .child-avatar-img {
      width: 58px;
      height: 58px;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      flex-shrink: 0;
      background: #fff;
    }

    .child-meta-main {
      flex: 1;
      min-width: 0;

      .child-title-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;

        .child-code-display {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .child-name-display {
          font-size: 14px;
          font-weight: 600;
          color: #334155;
        }
      }

      .child-props-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;

        .prop-item {
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;

          .prop-label {
            color: #64748b;
          }

          .prop-val {
            color: #1e293b;
            font-weight: 500;
          }
        }
      }
    }
  }

  .child-stock-summary-box {
    border-left: 1px dashed #cbd5e1;
    padding-left: 18px;
    flex-shrink: 0;
    min-width: 170px;

    .stock-sum-title {
      font-size: 12px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 6px;
    }

    .stock-sum-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 3px;

      .sum-lbl {
        color: #64748b;
      }
    }
  }
}

.copy-btn {
  color: #94a3b8 !important;
  padding: 0 2px !important;
  font-size: 13px !important;
  transition: color 0.15s ease;

  &:hover {
    color: #2563eb !important;
  }
}

.ratio-badge-text {
  font-size: 11px;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 1px 6px;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.prod-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .prod-img {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
    flex-shrink: 0;
  }

  .name-text {
    font-size: 12px;
    color: #334155;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.penetrate-stock-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;

  .penetrate-tag {
    font-size: 10px;
    height: 18px;
    padding: 0 4px;
    border-radius: 4px;
  }
}

.num-bold { font-weight: 700; color: #0f172a; }
.num-blue { font-weight: 600; color: #2563eb; }
.text-danger { color: #ef4444; font-weight: 700; }
.text-muted { color: #94a3b8; }
.text-primary { color: #2563eb; }
.text-secondary { color: #64748b; }
.text-green { color: #10b981; }
.font-bold { font-weight: 700; }

.child-summary-box {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .child-count {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
  }

  .bottleneck-tag-row {
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 4px;

    .bottleneck-label { color: #ef4444; font-weight: 700; }
    .bottleneck-code {
      color: #991b1b;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 180px;
    }
  }
}

// 展开 BOM 明细样式 (参照 combo.vue .expand-bom-wrapper)
.expand-wrapper {
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 6px;
  margin: 4px 0;
  border: 1px dashed #cbd5e1;

  .expand-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    margin-bottom: 8px;

    .expand-title {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #334155;
      b { color: #0f172a; }
    }

    .expand-total {
      font-size: 12px;
      color: #64748b;
      .bottleneck-info { margin-left: 8px; }
    }
  }

  .sub-wh-dist {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    .dist-pill {
      font-size: 11px;
      background: #f1f5f9;
      color: #475569;
      padding: 1px 6px;
      border-radius: 4px;

      &.current {
        background: #dcfce7;
        color: #15803d;
        font-weight: 600;
      }
    }
  }
}

.child-chips-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  :deep(.el-tag) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
  }
}

// 组合类型 Badge 样式 (参照 combo.vue .type-badge 降噪设计)
.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 500;
  text-align: center;
  line-height: 1.3;
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

  &.badge-danger {
    background-color: #fff1f2;
    color: #e11d48;
    border: 1px solid #fecdd3;
  }

  /* 表格内组合类型轻量点缀: 微型圆点区分，不用整个标签都是高饱和度背景 */
  &.badge-multi-pack::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #64748b;
  }

  &.badge-multi-box::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #d97706;
  }

  &.badge-main-attach::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #e11d48;
  }

  &.badge-suite::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #2563eb;
  }
}

.combo-type-tabs {
  margin-left: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  .combo-radio-group {
    :deep(.el-radio-button__inner) {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
      font-size: 12.5px;
      font-weight: 500;
      letter-spacing: 0.2px;
    }
  }

  .guide-toggle-btn {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 12px;
    font-weight: 500;
  }
}

.form-child-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.formula-banner {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 11px;
  color: #475569;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  .formula-title {
    font-weight: 600;
    color: #334155;
  }

  .formula-desc {
    font-weight: 400;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    color: #64748b;
    b {
      font-weight: 700;
      color: #1e293b;
      margin: 0 4px;
      font-size: 12px;
    }
  }

  &.mini {
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 6px;
    display: inline-flex;
    width: fit-content;
  }
}

.penetrate-dialog-body {
  .parent-info-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px;

    .info-row {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #334155;
    }
  }

  .formula-banner {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 12px;
    color: #1d4ed8;

    .formula-title {
      font-weight: 700;
    }
  }

  .penetrate-summary-result {
    text-align: right;
    font-size: 14px;
    color: #1e293b;

    .result-num {
      font-size: 18px;
      color: #2563eb;
    }
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &.flex-between {
    justify-content: space-between;
  }

  .pagination-stat-info {
    font-size: 12.5px;
    color: #64748b;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 3px;

    .stat-num {
      font-weight: 600;
      color: #334155;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      padding: 0 1px;
    }
  }
}

// 基础数据选择卡片样式 (参照 combo.vue)
.base-data-picker-box {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  padding: 12px 16px;

  .picker-title {
    font-size: 13px;
  }
}

.combo-option-row {
  display: flex;
  flex-direction: column;
  padding: 4px 0;

  .option-desc {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
  }
}

// 组合物料库手册 Dialog 规范化现代中台样式
:deep(.furniture-manual-dialog) {
  border-radius: 12px;
  overflow: hidden;

  .el-dialog__header {
    padding: 16px 20px 14px;
    margin-right: 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .el-dialog__body {
    padding: 16px 20px 12px;
  }

  .el-dialog__footer {
    padding: 12px 20px 16px;
    border-top: 1px solid #f1f5f9;
  }
}

.dialog-custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 28px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .header-icon-box {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: #eff6ff;
      color: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .header-title-wrap {
      .title-main-row {
        display: flex;
        align-items: center;
        gap: 8px;

        .dialog-title-text {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .dialog-badge-tag {
          font-size: 11px;
          color: #64748b;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 1px 7px;
          border-radius: 4px;
        }
      }

      .dialog-sub-desc {
        font-size: 12px;
        color: #94a3b8;
        margin-top: 2px;
      }
    }
  }

  .header-stats-pill-group {
    display: flex;
    align-items: center;
    gap: 8px;

    .stat-bubble {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;

      &.primary {
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        color: #1d4ed8;
        .bubble-val {
          color: #2563eb;
          font-weight: 700;
        }
      }

      &.success {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #15803d;
        .bubble-val {
          color: #16a34a;
          font-weight: 700;
        }
      }
    }
  }
}

.furniture-lib-dialog {
  .furniture-filter-panel {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px 12px;

    .filter-conditions-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;

      .filter-item {
        display: flex;
        align-items: center;
        gap: 6px;

        .filter-sub-label {
          font-size: 12px;
          color: #64748b;
          white-space: nowrap;
        }

        &.search-box {
          margin-left: auto;
        }
      }
    }
  }

  .choose-bom-link-btn {
    font-weight: 600;
    padding: 0 4px;
    &:hover {
      text-decoration: underline;
    }
  }
}

.dialog-custom-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .footer-left-info {
    font-size: 12.5px;
    color: #64748b;

    b {
      color: #0f172a;
    }

    .selected-text {
      color: #2563eb;
      margin-left: 6px;
      b {
        color: #2563eb;
      }
    }
  }

  .footer-right-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

// 组合类型标准定义卡片指南容器 (参照 combo.vue 6/4 栏网格卡片)
.combo-type-legend-container {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 14px;
  margin-top: 12px;

  .legend-header {
    .legend-title {
      font-size: 13px;
      .title-badge {
        background: #2563eb;
        color: #ffffff;
        font-size: 11px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
        letter-spacing: 0.5px;
      }
    }
  }

  .legend-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    .legend-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
      cursor: pointer;
      transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
        transform: translateY(-2px);
      }

      &.active {
        border-color: #2563eb;
        background: linear-gradient(180deg, #f8faff 0%, #eff6ff 100%);
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
      }

      .card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .type-name-box {
          display: flex;
          align-items: center;
          gap: 6px;

          .type-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
            &.多件打包 { background: #64748b; }
            &.一物多包 { background: #f59e0b; }
            &.主附搭配 { background: #ef4444; }
            &.成套组合 { background: #2563eb; }
          }

          .type-title {
            font-size: 13px;
            color: #0f172a;
          }
        }

        .core-rule-badge {
          font-size: 11px;
          padding: 1px 6px;
          border-radius: 4px;
          font-weight: 600;
          white-space: nowrap;

          &.多件打包 { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
          &.一物多包 { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
          &.主附搭配 { background: #ffe4e6; color: #e11d48; border: 1px solid #fecdd3; }
          &.成套组合 { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
        }
      }

      .card-desc {
        color: #475569;
        font-size: 12px;
        line-height: 1.45;
        min-height: 34px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .card-example-pill {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        padding: 3px 6px;
        font-size: 11px;
        overflow: hidden;

        .pill-tag {
          background: #e2e8f0;
          color: #475569;
          font-size: 10px;
          font-weight: 700;
          padding: 0 4px;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .pill-text {
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

// 弹窗中组合类型下拉选项与卡片
.combo-type-opt-row {
  display: flex;
  flex-direction: column;
  padding: 4px 0;
  width: 100%;
}

.combo-definition-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #2563eb;
  border-radius: 6px;
  padding: 8px 12px;

  .def-header {
    font-size: 12px;
  }
  .def-detail {
    line-height: 1.4;
    color: #475569;
    font-size: 12px;
  }
  .def-example {
    color: #1d4ed8;
    background: #eff6ff;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11px;
    .example-tag {
      font-weight: 700;
      color: #2563eb;
      margin-right: 4px;
    }
  }
}

// 候选 ASIN 弹窗整体优化样式
.candidate-asin-dialog {
  :deep(.el-dialog) {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  :deep(.el-dialog__header) {
    padding: 16px 24px;
    margin-right: 0;
    border-bottom: 1px solid #f1f5f9;
    background: #ffffff;
  }

  :deep(.el-dialog__body) {
    padding: 16px 24px;
    background: #ffffff;
  }

  :deep(.el-dialog__footer) {
    padding: 12px 24px 16px;
    border-top: 1px solid #f1f5f9;
    background: #f8fafc;
  }
}

.dialog-custom-header {
  display: flex;
  align-items: baseline;
  gap: 12px;

  .header-title-box {
    display: flex;
    align-items: center;
    gap: 8px;

    .main-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }

    .sub-badge {
      font-size: 11px;
      font-weight: 600;
      color: #2563eb;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      padding: 1px 8px;
      border-radius: 9999px;
    }
  }

  .header-tip-text {
    font-size: 12px;
    color: #64748b;
  }
}

.candidate-filter-container {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 14px;

  .filter-flex-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .filter-left-group {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .filter-field {
    display: flex;
    align-items: center;
    gap: 6px;

    .field-label {
      font-size: 13px;
      font-weight: 500;
      color: #475569;
      white-space: nowrap;
    }
  }

  .untracked-checkbox {
    margin-left: 2px;
    margin-right: 0;
  }

  .filter-right-group {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
}

.candidate-table-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;

  :deep(.el-table) {
    --el-table-header-bg-color: #f8fafc;
    --el-table-header-text-color: #334155;

    th.el-table__cell {
      font-weight: 600;
      font-size: 12px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    td.el-table__cell {
      font-size: 12px;
      padding: 7px 0;
    }
  }
}

.account-badge {
  display: inline-block;
  font-weight: 600;
  color: #334155;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.site-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  color: #1e293b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;

  .flag-icon {
    font-size: 13px;
  }
}

.asin-code-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 700;
  color: #2563eb;
  letter-spacing: 0.2px;
}

.sku-code-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: #1e293b;
  font-weight: 500;
}

.mat-code-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: #0f172a;
  font-weight: 600;
}

.candidate-pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 6px 4px;
}

.dialog-footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .selected-summary {
    font-size: 13px;
    color: #475569;

    .count-highlight {
      color: #2563eb;
      font-size: 15px;
      font-weight: 700;
      margin: 0 2px;
    }

    .sub-ready-tip {
      color: #059669;
      font-weight: 600;
      margin-left: 8px;
    }
  }

  .footer-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

// 批量导入 ASIN 弹窗样式
.batch-import-asin-dialog {
  :deep(.el-dialog) {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  :deep(.el-dialog__header) {
    padding: 16px 24px;
    margin-right: 0;
    border-bottom: 1px solid #f1f5f9;
    background: #ffffff;
  }

  :deep(.el-dialog__body) {
    padding: 16px 24px;
    background: #ffffff;
  }

  :deep(.el-dialog__footer) {
    padding: 12px 24px 16px;
    border-top: 1px solid #f1f5f9;
    background: #f8fafc;
  }
}

.import-guide-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 12px 18px;

  .guide-steps-box {
    display: flex;
    align-items: center;
    gap: 10px;

    .step-badge {
      font-size: 11px;
      font-weight: 700;
      color: #15803d;
      background: #dcfce7;
      border: 1px solid #86efac;
      padding: 2px 8px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .step-text {
      font-size: 13px;
      color: #166534;
      font-weight: 500;
    }
  }

  .guide-action-box {
    flex-shrink: 0;
  }
}

.import-mode-tabs {
  display: flex;
  align-items: center;
}

.custom-drag-uploader {
  :deep(.el-upload-dragger) {
    padding: 28px 16px;
    border: 1.5px dashed #cbd5e1;
    border-radius: 8px;
    background-color: #f8fafc;
    transition: all 0.2s ease;

    &:hover {
      border-color: #2563eb;
      background-color: #eff6ff;
    }

    .el-icon--upload {
      font-size: 44px;
      color: #3b82f6;
      margin-bottom: 10px;
    }

    .el-upload__text {
      font-size: 13px;
      color: #475569;

      em {
        color: #2563eb;
        font-weight: 600;
      }
    }
  }
}

.text-paste-section {
  .paste-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.parsed-preview-container {
  margin-top: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  background: #ffffff;

  .preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  :deep(.el-table) {
    --el-table-header-bg-color: #f8fafc;
    --el-table-header-text-color: #334155;

    th.el-table__cell {
      font-weight: 600;
      font-size: 12px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    td.el-table__cell {
      font-size: 12px;
      padding: 6px 0;
    }
  }
}

.flex-column {
  display: flex !important;
  flex-direction: column !important;
}

// 平台标签精致化降噪样式
.platform-tag {
  font-weight: 600;
  border-radius: 4px;
  font-size: 11px;
  padding: 0 7px;
  height: 22px;
  line-height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &.platform-amazon {
    color: #b45309;
    background: #fffbeb;
    border-color: #fde68a;
  }
  &.platform-walmart {
    color: #1d4ed8;
    background: #eff6ff;
    border-color: #bfdbfe;
  }
  &.platform-tiktok {
    color: #0f172a;
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
  &.platform-wayfair {
    color: #6d28d9;
    background: #f5f3ff;
    border-color: #ddd6fe;
  }
}

// ===============================================
// 选项卡 5: 穿透齐套与缺料预警 专属极简专业降噪样式
// ===============================================
.completeness-container {
  // 1. 顶部全局 KPI 卡片网格 (沉稳、纯净、指标清晰)
  .completeness-kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;

    .kpi-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      display: flex;
      flex-direction: column;

      &:hover {
        border-color: #cbd5e1;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
      }

      &.active {
        background: #f8fafc;
        border-color: #0284c7;
        box-shadow: 0 0 0 1px #0284c7, 0 2px 8px rgba(2, 132, 199, 0.08);

        &.is-danger {
          border-color: #ef4444;
          box-shadow: 0 0 0 1px #ef4444, 0 2px 8px rgba(239, 68, 68, 0.08);
          background: #fffafa;
        }

        &.is-warning {
          border-color: #f59e0b;
          box-shadow: 0 0 0 1px #f59e0b, 0 2px 8px rgba(245, 158, 11, 0.08);
          background: #fffdfa;
        }

        &.is-info {
          border-color: #64748b;
          box-shadow: 0 0 0 1px #64748b, 0 2px 8px rgba(100, 116, 139, 0.08);
          background: #f8fafc;
        }
      }

      .kpi-label {
        font-size: 12px;
        font-weight: 600;
        color: #475569;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .kpi-status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;

        &.danger { background: #ef4444; }
        &.warning { background: #f59e0b; }
        &.info { background: #64748b; }
      }

      .kpi-value-row {
        display: flex;
        align-items: baseline;
        gap: 4px;
        margin-top: 6px;

        .kpi-num {
          font-size: 24px;
          font-weight: 700;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          color: #0f172a;
          line-height: 1;

          &.text-danger { color: #dc2626; }
          &.text-warning { color: #d97706; }
          &.text-slate { color: #334155; }
        }

        .kpi-unit {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        .kpi-badge-danger {
          margin-left: auto;
          font-size: 10px;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          padding: 1px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
      }

      .kpi-subtext {
        font-size: 11px;
        color: #94a3b8;
        margin-top: 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  // 2. 工具栏与轻量化规则说明
  .completeness-toolbar-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f1f5f9;

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      margin-left: auto;
    }

    .rule-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #475569;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);

      .btn-icon-wrapper {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        &.amber-icon { color: #f59e0b; }
        &.blue-icon { color: #3b82f6; }
      }

      .btn-text {
        font-weight: 500;
      }

      .btn-sub-badge {
        font-size: 10px;
        font-weight: 600;
        padding: 1px 6px;
        border-radius: 4px;

        &.amber-badge {
          background: #fef3c7;
          color: #b45309;
        }
        &.blue-badge {
          background: #eff6ff;
          color: #1d4ed8;
        }
      }

      .arrow-icon {
        font-size: 10px;
        color: #94a3b8;
        transition: transform 0.2s ease;
      }

      &:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
        color: #0f172a;
      }

      &.btn-alert-logic.active {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        border-color: #f59e0b;
        color: #92400e;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);

        .arrow-icon { color: #b45309; }
      }

      &.btn-calc-rule.active {
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        border-color: #3b82f6;
        color: #1e40af;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);

        .arrow-icon { color: #1d4ed8; }
      }
    }
  }

  .rule-details-panel {
    position: relative;
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 16px;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
    margin-bottom: 16px;

    .panel-corner-close-btn {
      position: absolute;
      top: -8px;
      right: 10px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 11px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
      transition: all 0.2s ease;
      z-index: 10;

      &:hover {
        background: #fee2e2;
        border-color: #fca5a5;
        color: #ef4444;
        transform: scale(1.1);
      }
    }

    .alert-logic-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;

      @media (max-width: 1440px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }

      .logic-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 14px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        display: flex;
        flex-direction: column;
        gap: 10px;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;

        &:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
          transform: translateY(-2px);
        }

        &.is-danger {
          border-top: 3px solid #f43f5e;
          &:hover { border-color: #fca5a5; border-top-color: #f43f5e; }
        }
        &.is-warning {
          border-top: 3px solid #f59e0b;
          &:hover { border-color: #fde68a; border-top-color: #f59e0b; }
        }
        &.is-info {
          border-top: 3px solid #0ea5e9;
          &:hover { border-color: #bae6fd; border-top-color: #0ea5e9; }
        }
        &.is-success {
          border-top: 3px solid #10b981;
          &:hover { border-color: #bbf7d0; border-top-color: #10b981; }
        }

        .logic-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f1f5f9;

          .level-priority-tag {
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            letter-spacing: 0.3px;

            &.priority-p0 { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
            &.priority-p1 { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
            &.priority-p2 { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
            &.priority-p3 { background: #d1fae5; color: #047857; border: 1px solid #a7f3d0; }
          }

          .level-title {
            font-size: 13px;
            font-weight: 700;
          }

          .formula-code-badge {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 4px;
            border: 1px solid;
            white-space: nowrap;

            &.code-danger { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }
            &.code-warning { background: #fffbeb; color: #d97706; border-color: #fde68a; }
            &.code-info { background: #f0f9ff; color: #0284c7; border-color: #bae6fd; }
            &.code-success { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
          }
        }

        .logic-card-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;

          .logic-info-row {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            font-size: 12px;
            line-height: 1.5;

            .info-tag {
              font-size: 10.5px;
              font-weight: 700;
              padding: 1px 6px;
              border-radius: 3px;
              flex-shrink: 0;

              &.tag-condition {
                background: #f1f5f9;
                color: #475569;
              }

              &.tag-impact {
                background: #f8fafc;
                color: #64748b;
                border: 1px solid #e2e8f0;
              }

              &.tag-action {
                &.action-p0 { background: #fff1f2; color: #e11d48; border: 1px solid #fecdd3; }
                &.action-p1 { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
                &.action-p2 { background: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd; }
                &.action-p3 { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
              }
            }

            .info-content {
              color: #334155;
              flex: 1;

              &.action-text {
                color: #0f172a;
              }
            }
          }

          .logic-example-box {
            margin-top: auto;
            padding: 7px 10px;
            border-radius: 5px;
            font-size: 11.5px;
            line-height: 1.45;
            display: flex;
            flex-direction: column;
            gap: 2px;

            &.example-danger { background: #fef2f2; border: 1px solid #fee2e2; color: #991b1b; }
            &.example-warning { background: #fffbeb; border: 1px solid #fef3c7; color: #92400e; }
            &.example-info { background: #f0f9ff; border: 1px solid #e0f2fe; color: #075985; }
            &.example-success { background: #f0fdf4; border: 1px solid #dcfce7; color: #166534; }

            .example-label {
              font-weight: 700;
              font-size: 10.5px;
              opacity: 0.9;
            }
          }
        }
      }
    }
  }

  // 展开收起淡入淡出动效
  .panel-fade-enter-active,
  .panel-fade-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .panel-fade-enter-from,
  .panel-fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }

  // 3. 表格核心元素样式 (低饱和、高可读、降噪)
  .clean-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 11.5px;
    font-weight: 600;
    line-height: 1.3;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    &.badge-danger {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
      .dot { background: #ef4444; }
    }
    &.badge-warning {
      background: #fffbeb;
      color: #b45309;
      border: 1px solid #fde68a;
      .dot { background: #f59e0b; }
    }
    &.badge-neutral {
      background: #f8fafc;
      color: #475569;
      border: 1px solid #e2e8f0;
      .dot { background: #94a3b8; }
    }
  }

  // 父物料
  .parent-cell-box {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .code-title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      font-family: ui-monospace, monospace;
      line-height: 1.3;
    }

    .meta-sub {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #64748b;

      .wh-tag {
        background: #f1f5f9;
        color: #475569;
        padding: 1px 5px;
        border-radius: 3px;
        font-size: 11px;
      }

      .platform-text {
        color: #94a3b8;
      }
    }

    .sku-text {
      font-size: 11px;
      color: #94a3b8;
      font-family: ui-monospace, monospace;
    }
  }

  // 套数对比
  .sets-compare-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 2px 0;

    .sets-main-val {
      display: flex;
      align-items: center;
      gap: 2px;
      font-family: ui-monospace, monospace;
      font-size: 13px;

      .curr-val {
        font-weight: 700;
        color: #0f172a;
        &.is-zero {
          color: #dc2626;
          font-weight: 800;
        }
      }

      .sep {
        color: #cbd5e1;
        margin: 0 3px;
      }

      .target-val {
        color: #475569;
        font-weight: 600;
      }
    }

    .sets-bar-track {
      width: 100%;
      max-width: 110px;
      height: 4px;
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
      margin: 4px 0;

      .sets-bar-fill {
        height: 100%;
        border-radius: 9999px;
        transition: width 0.3s ease;
      }
    }

    .sets-gap-row {
      font-size: 11px;
      color: #64748b;

      .gap-num {
        color: #334155;
        font-weight: 700;
        &.text-danger {
          color: #dc2626;
        }
      }

      .rate-text {
        color: #94a3b8;
        margin-left: 2px;
      }
    }
  }

  // 短板子物料存量明细 (清爽列表，无粉红大卡片)
  .clean-shortage-list {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .clean-shortage-item {
      padding: 4px 6px;
      border-radius: 4px;
      background: #f8fafc;
      border: 1px solid #f1f5f9;

      .item-line-1 {
        display: flex;
        align-items: center;
        gap: 6px;
        line-height: 1.25;

        .child-code-btn {
          font-family: ui-monospace, monospace;
          font-weight: 700;
          color: #0f172a;
          cursor: pointer;
          font-size: 12px;

          &:hover {
            color: #2563eb;
            text-decoration: underline;
          }
        }

        .tag-shortage-point {
          font-size: 10px;
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          padding: 0 4px;
          border-radius: 3px;
          font-weight: 600;
        }

        .bom-ratio-text {
          font-size: 10px;
          color: #94a3b8;
          font-family: ui-monospace, monospace;
          margin-left: auto;
        }
      }

      .item-line-2 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 3px;
        font-size: 11px;
        color: #475569;

        .stock-text {
          b {
            color: #0f172a;
          }
          .calc-sets {
            color: #64748b;
          }
        }

        .transit-sub {
          font-size: 10.5px;
          color: #059669;
          font-weight: 500;
          background: #ecfdf5;
          padding: 0 4px;
          border-radius: 3px;
        }
      }
    }
  }

  // 建议采购/备货明细 (白底轻框，重点放在需补数量上，在途已覆盖弱化显示)
  .clean-action-list {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .clean-action-item {
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      background: #ffffff;

      .covered-row {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        color: #475569;
        padding: 2px 0;

        .icon-ok {
          color: #10b981;
          font-size: 13px;
        }

        .covered-title {
          color: #059669;
          font-weight: 600;
        }

        .covered-desc {
          color: #94a3b8;
          font-size: 10.5px;
          margin-left: auto;
          font-family: ui-monospace, monospace;
        }
      }

      .shortage-action-box {
        .action-top-row {
          display: flex;
          align-items: center;
          gap: 6px;

          .action-label {
            font-size: 10px;
            color: #ffffff;
            background: #d97706;
            padding: 0 4px;
            border-radius: 3px;
            font-weight: 600;
            line-height: 1.4;
          }

          .action-num {
            font-family: ui-monospace, monospace;
            font-weight: 700;
            font-size: 12.5px;
            color: #0f172a;
          }

          .action-child {
            font-family: ui-monospace, monospace;
            font-size: 11px;
            color: #64748b;
            margin-left: auto;
          }
        }

        .action-bottom-row {
          font-size: 10.5px;
          color: #64748b;
          margin-top: 2px;
          line-height: 1.3;

          .net-gap {
            color: #dc2626;
            font-weight: 700;
          }

          .no-transit {
            color: #9a3412;
            font-weight: 500;
          }
        }
      }
    }
  }

  // 齐套协同说明 (优雅中性排版，无红黄蓝大文本框)
  .clean-explanation-box {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 11.5px;
    line-height: 1.5;
    padding: 4px 6px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    border-radius: 4px;

    .exp-chip {
      flex-shrink: 0;
      font-size: 10px;
      padding: 1px 5px;
      border-radius: 3px;
      font-weight: 600;
      margin-top: 2px;

      &.chip-danger {
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
      }
      &.chip-warning {
        background: #fffbeb;
        color: #b45309;
        border: 1px solid #fde68a;
      }
      &.chip-neutral {
        background: #f1f5f9;
        color: #475569;
        border: 1px solid #e2e8f0;
      }
    }

    .exp-text {
      color: #475569;
    }
  }

  // 订单占用库存 (Unshipped) 单元格样式
  .order-occupied-badge-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    padding: 2px 6px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: #fef3c7;
      .occupied-num {
        color: #b45309;
        text-decoration: underline;
      }
    }

    .occupied-num {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      font-weight: 700;
      color: #d97706;
    }

    .occupied-count-tag {
      font-size: 10.5px;
      padding: 0 5px;
      line-height: 1.4;
      border-radius: 10px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      color: #b45309;
      font-weight: 600;
    }
  }

  // 展开行容器与卡片样式
  .expand-wrapper {
    padding: 12px 16px 16px;
    background: #f8fafc;
    border-radius: 6px;

    .expand-table-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px 14px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    .sub-table-header {
      margin-bottom: 8px;
    }

    .wh-summary-tag {
      font-size: 11px;
      padding: 1px 8px;
      background: #e0f2fe;
      color: #0284c7;
      border: 1px solid #bae6fd;
      border-radius: 12px;
      font-weight: 600;
    }

    .child-code-link {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: #2563eb;
      font-weight: 600;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
        color: #1d4ed8;
      }
    }
  }
}
</style>
