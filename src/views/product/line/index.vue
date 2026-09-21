<template>
  <div class="product-line-page">
    <!-- 1. 查询与检索过滤区 -->
    <div class="filter-card">
      <el-form :model="filterForm" inline class="filter-form" size="default">
        <!-- 运营大类 -->
        <el-form-item label="运营大类">
          <el-select 
            v-model="filterForm.category" 
            placeholder="请选择运营大类" 
            clearable 
            filterable
            class="w-180"
          >
            <el-option 
              v-for="cat in categoryOptions" 
              :key="cat" 
              :label="cat" 
              :value="cat" 
            />
          </el-select>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态">
          <el-select 
            v-model="filterForm.status" 
            placeholder="全部状态" 
            clearable 
            class="w-120"
          >
            <el-option label="正常" value="正常" />
            <el-option label="关闭" value="关闭" />
          </el-select>
        </el-form-item>

        <!-- 产品线负责人 (整个产品线的负责人，放在前面) -->
        <el-form-item label="产品线负责人">
          <el-select 
            v-model="filterForm.teamLeader" 
            placeholder="请选择产品线负责人" 
            clearable 
            filterable
            class="w-170"
          >
            <el-option 
              v-for="leader in teamLeaderOptions" 
              :key="leader" 
              :label="leader" 
              :value="leader" 
            />
          </el-select>
        </el-form-item>

        <!-- 团队负责人 (该产品下某一个团队的负责人) -->
        <el-form-item label="团队负责人">
          <el-select 
            v-model="filterForm.lineLeader" 
            placeholder="请选择团队负责人" 
            clearable 
            filterable
            class="w-160"
          >
            <el-option 
              v-for="leader in lineLeaderOptions" 
              :key="leader" 
              :label="leader" 
              :value="leader" 
            />
          </el-select>
        </el-form-item>



        <!-- 重置与查询按钮 -->
        <el-form-item class="filter-actions">
          <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 3. 数据表格与操作面板 -->
    <div class="table-card">
      <!-- 操作工具栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-button type="primary" :icon="Plus" class="btn-create" @click="handleCreate">
            新增产品线
          </el-button>
        </div>

        <div class="toolbar-right">
          <el-tooltip content="刷新数据" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
          <el-tooltip content="导出当前列表" placement="top">
            <el-button circle :icon="Download" @click="handleExport" />
          </el-tooltip>
          <el-popover placement="bottom-end" :width="200" trigger="click">
            <template #reference>
              <el-button circle :icon="Setting" />
            </template>
            <div class="column-setting-title">自定义列显示</div>
            <div class="column-setting-list">
              <el-checkbox v-model="columnVisible.code">运营大类编码</el-checkbox>
              <el-checkbox v-model="columnVisible.category">运营大类 (含简码)</el-checkbox>
              <el-checkbox v-model="columnVisible.teamLeader">产品线负责人</el-checkbox>
              <el-checkbox v-model="columnVisible.createDate">创建日期</el-checkbox>
              <el-checkbox v-model="columnVisible.enableDate">启用日期</el-checkbox>
              <el-checkbox v-model="columnVisible.closeDate">关闭日期</el-checkbox>
              <el-checkbox v-model="columnVisible.team">负责团队 (团队配置)</el-checkbox>
              <el-checkbox v-model="columnVisible.lineLeader">团队负责人</el-checkbox>
            </div>
          </el-popover>
        </div>
      </div>

      <!-- 表格内容 -->
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="pagedList"
          row-key="id"
          border
          stripe
          class="modern-data-table"
        >
          <el-table-column label="序号" width="65" align="center" fixed="left">
            <template #default="{ $index }">
              <span class="index-num">{{ (pagination.currentPage - 1) * pagination.pageSize + $index + 1 }}</span>
            </template>
          </el-table-column>

          <!-- 展开行：支持一键查看该产品线完整的团队配置全景卡片 -->
          <el-table-column type="expand" width="45">
            <template #default="{ row }">
              <div class="expand-teams-panel">
                <div class="expand-header-strip">
                  <div class="expand-left">
                    <span class="expand-tag-title">团队配置</span>
                    <span class="expand-category-name">【{{ row.code }}】{{ row.category }}</span>
                    <span class="category-short-tag" v-if="row.shortCode">{{ row.shortCode }}</span>
                  </div>
                  <div class="expand-right">
                    <span class="expand-team-count-badge">共 {{ (row.teams && row.teams.length) || 1 }} 个业务团队</span>
                  </div>
                </div>

                <div class="expand-team-cards-grid">
                  <div 
                    v-for="(team, tIdx) in (row.teams && row.teams.length ? row.teams : [{ name: row.teamName, platform: 'Amazon', lineLeader: row.lineLeader, members: row.teamMembers, createDate: row.createDate, status: '启用' }])" 
                    :key="tIdx" 
                    class="expand-team-card"
                  >
                    <div class="card-head">
                      <div class="team-title-row">
                        <span class="team-order-badge">{{ tIdx + 1 }}</span>
                        <el-tag size="small" type="primary" effect="plain" class="team-platform-tag" v-if="team.platform">
                          {{ team.platform }}
                        </el-tag>
                        <span class="team-title-name">{{ team.name || ('团队 ' + (tIdx + 1)) }}</span>
                      </div>
                      <el-tag size="small" :type="team.status === '启用' ? 'success' : 'info'" effect="plain">
                        {{ team.status || '启用' }}
                      </el-tag>
                    </div>

                    <div class="card-meta-row">
                      <div class="meta-item">
                        <span class="meta-lbl">团队负责人:</span>
                        <span class="meta-val text-primary font-bold">{{ team.lineLeader || '-' }}</span>
                      </div>
                      <div class="meta-item">
                        <span class="meta-lbl">生效日期:</span>
                        <span class="meta-val">{{ team.createDate || '-' }}</span>
                      </div>
                    </div>

                    <div class="card-members-section">
                      <div class="members-lbl">团队成员:</div>
                      <div class="members-chip-wrap">
                        <template v-for="m in getPureMembers(team)" :key="m">
                          <span class="expand-member-chip">{{ m }}</span>
                        </template>
                        <span v-if="!getPureMembers(team).length" class="text-muted" style="font-size:12px">-</span>
                      </div>
                    </div>

                    <!-- 卡片底部操作条：编辑团队 / 删除团队 -->
                    <div class="card-footer-actions">
                      <el-button 
                        link 
                        type="primary" 
                        size="small" 
                        @click="handleEditSingleTeam(row, team, tIdx)"
                      >
                        <el-icon class="mr-1"><Edit /></el-icon>编辑
                      </el-button>
                      <span class="action-divider"></span>
                      <el-popconfirm
                        :title="'确定删除业务团队【' + (team.name || ('团队 ' + (tIdx + 1))) + '】吗？'"
                        confirm-button-text="确定删除"
                        cancel-button-text="取消"
                        confirm-button-type="danger"
                        @confirm="handleDeleteSingleTeam(row, tIdx)"
                      >
                        <template #reference>
                          <el-button 
                            link 
                            type="danger" 
                            size="small"
                            :disabled="(row.teams && row.teams.length ? row.teams.length : 1) <= 1"
                          >
                            <el-icon class="mr-1"><Delete /></el-icon>删除
                          </el-button>
                        </template>
                      </el-popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 运营大类编码 (支持一键快捷复制) -->
          <el-table-column 
            v-if="columnVisible.code" 
            prop="code" 
            label="运营大类编码" 
            width="135" 
            sortable
            align="center"
          >
            <template #default="{ row }">
              <div class="code-badge-wrapper" @click="handleCopyCode(row.code)">
                <span class="code-badge">{{ row.code }}</span>
                <el-tooltip content="点击复制编码" placement="top">
                  <el-icon class="copy-icon"><DocumentCopy /></el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>

          <!-- 运营大类 (含简码微标，点击名称直接查看明细) -->
          <el-table-column 
            v-if="columnVisible.category" 
            prop="category" 
            label="运营大类" 
            min-width="155"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <div class="category-cell">
                <span class="category-name clickable" @click="handleDetail(row)">{{ row.category }}</span>
                <span class="category-short-tag" v-if="row.shortCode">{{ row.shortCode }}</span>
              </div>
            </template>
          </el-table-column>

          <!-- 状态 (产品线全局状态，归属于运营大类) -->
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <div class="status-badge" :class="row.status === '正常' ? 'status-active' : 'status-closed'">
                <span class="status-dot"></span>
                <span>{{ row.status }}</span>
              </div>
            </template>
          </el-table-column>

          <!-- 创建日期 -->
          <el-table-column 
            v-if="columnVisible.createDate" 
            prop="createDate" 
            label="创建日期" 
            width="115" 
            align="center"
          />

          <!-- 启用日期 -->
          <el-table-column 
            v-if="columnVisible.enableDate" 
            prop="enableDate" 
            label="启用日期" 
            width="115" 
            align="center"
          />

          <!-- 关闭日期 -->
          <el-table-column 
            v-if="columnVisible.closeDate" 
            prop="closeDate" 
            label="关闭日期" 
            width="115" 
            align="center"
          >
            <template #default="{ row }">
              <span :class="{ 'text-muted': !row.closeDate }">
                {{ row.closeDate || '-' }}
              </span>
            </template>
          </el-table-column>

          <!-- 产品线负责人 (同产品线可由多个平台运营，每个平台产品线负责人可独立展示) -->
          <!-- 运营矩阵: 平台 → 产品线负责人 → 团队负责人 → 团队成员 (一一对应) -->
          <el-table-column
            label="运营矩阵"
            min-width="460"
          >
            <template #header>
              <div class="header-with-tip">
                <span>运营矩阵</span>
                <el-tooltip content="平台 → 产品线负责人 → 团队负责人 → 团队成员，四者一一对应" placement="top">
                  <el-icon class="info-icon text-purple ml-1"><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              <div class="ops-matrix-cell">
                <div class="ops-matrix-header">
                  <span class="col-lbl col-platform">平台</span>
                  <span class="col-lbl col-lineleader">产品线负责人</span>
                  <span class="col-lbl col-teamleader">团队负责人</span>
                  <span class="col-lbl col-members">团队成员</span>
                </div>
                <!-- 按团队分行，每行找对应的平台负责人 -->
                <div
                  v-for="(team, tIdx) in (row.teams && row.teams.length ? row.teams : [{ name: row.teamName, platform: (row.platforms && row.platforms[0] && row.platforms[0].platform) || '-', lineLeader: row.lineLeader, members: row.teamMembers }])"
                  :key="tIdx"
                  class="ops-matrix-row"
                  :class="{ 'border-row': tIdx > 0 }"
                >
                  <!-- 平台 -->
                  <div class="col-platform">
                    <span class="platform-pill" :class="'pf-' + (team.platform || '').toLowerCase()">
                      {{ team.platform || '-' }}
                    </span>
                  </div>
                  <!-- 产品线负责人: 通过 team.platform 关联到 platforms[] -->
                  <div class="col-lineleader">
                    <span class="lineleader-name">
                      {{ getPlatformLineLeader(row, team.platform) }}
                    </span>
                  </div>
                  <!-- 团队负责人 -->
                  <div class="col-teamleader">
                    <el-tag type="success" effect="light" size="small" class="teamleader-tag">
                      <el-icon class="mr-1" style="font-size:10px"><User /></el-icon>
                      {{ team.lineLeader || '-' }}
                    </el-tag>
                  </div>
                  <!-- 团队成员 (不包含团队负责人) -->
                  <div class="col-members">
                    <template v-if="getPureMembers(team).length <= 3">
                      <span
                        v-for="member in getPureMembers(team)"
                        :key="member"
                        class="member-chip"
                      >{{ member }}</span>
                    </template>
                    <template v-else>
                      <span
                        v-for="member in getPureMembers(team).slice(0, 3)"
                        :key="member"
                        class="member-chip"
                      >{{ member }}</span>
                      <el-tooltip :content="'全部成员: ' + getPureMembers(team).join('、')" placement="top">
                        <span class="member-chip more-chip">+{{ getPureMembers(team).length - 3 }}人</span>
                      </el-tooltip>
                    </template>
                    <span v-if="!getPureMembers(team).length" class="text-muted">-</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>


          <!-- 操作 -->
          <el-table-column label="操作" width="280" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-btn-group">
                <el-button link type="primary" size="small" @click="handleEdit(row)">
                  编辑
                </el-button>
                <el-button link type="primary" size="small" @click="handleOpenStatusDialog(row)">
                  状态编辑
                </el-button>
                <el-button link type="primary" size="small" @click="handleQuickAddTeam(row)">
                  增补团队
                </el-button>
                <el-button link type="info" size="small" @click="handleViewLogs(row)">
                  日志
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页栏 -->
      <div class="pagination-bar">
        <div class="page-info-text">
          共 <b>{{ filteredList.length }}</b> 条记录
        </div>
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredList.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 4. 抽屉：新建 / 编辑产品线 -->
    <el-drawer
      v-model="editDialogVisible"
      :title="dialogMode === 'create' ? '新建产品线' : (dialogMode === 'addTeam' ? `增补业务团队 - 【${currentEditForm.code}】${currentEditForm.category}` : '编辑产品线')"
      size="760px"
      destroy-on-close
      :close-on-click-modal="false"
      class="edit-product-line-drawer product-line-modern-drawer"
    >
      <div class="modern-drawer-body">
        <el-form
          :model="currentEditForm"
          ref="editFormRef"
          label-position="top"
          class="modern-drawer-form"
        >
          <!-- 模块 1：品类规划与基础信息 -->
          <div class="form-card-box">
            <div class="card-header">
              <div class="header-indicator" :class="dialogMode === 'addTeam' ? 'bg-gray' : 'bg-blue'"></div>
              <div class="header-title-group">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="card-title">品类规划与基础信息</span>
                  <el-tag size="small" type="info" effect="plain" v-if="dialogMode === 'addTeam'">
                    <el-icon class="mr-1"><Lock /></el-icon>锁定不可编辑
                  </el-tag>
                </div>
                <span class="card-subtitle">{{ dialogMode === 'addTeam' ? '已归属当前产品线基础档案，增补团队模式下不可编辑' : '定义产品线的运营大类与简码，作为全业务流转的基础标识' }}</span>
              </div>
            </div>

            <!-- 增补团队模式：只读卡片展示，完全不渲染表单输入项与必填星号 -->
            <div v-if="dialogMode === 'addTeam'" class="card-content readonly-basic-info-box">
              <div class="readonly-grid">
                <div class="readonly-col">
                  <span class="readonly-label">运营大类编码</span>
                  <div class="readonly-value">
                    <span class="category-code-badge">{{ currentEditForm.code || '-' }}</span>
                  </div>
                </div>
                <div class="readonly-col">
                  <span class="readonly-label">运营大类名称</span>
                  <div class="readonly-value">
                    <span class="category-name-text">{{ currentEditForm.category }}</span>
                  </div>
                </div>
                <div class="readonly-col">
                  <span class="readonly-label">运营大类简码</span>
                  <div class="readonly-value">
                    <span class="shortcode-tag">{{ currentEditForm.shortCode }}</span>
                  </div>
                </div>
              </div>
              <div class="readonly-desc-row mt-3" v-if="currentEditForm.description">
                <span class="readonly-label">规划定位与战略描述</span>
                <div class="readonly-desc-text">{{ currentEditForm.description }}</div>
              </div>
            </div>

            <!-- 新建/编辑模式：正常可编辑表单 -->
            <div v-else class="card-content">
              <el-row :gutter="16">
                <el-col :span="14">
                  <el-form-item label="运营大类名称" required>
                    <el-select
                      v-model="currentEditForm.category"
                      filterable
                      allow-create
                      default-first-option
                      clearable
                      placeholder="请选择或输入运营大类 (如：软包床)"
                      class="w-full"
                      @change="handleCategoryChange"
                    >
                      <el-option 
                        v-for="cat in standardCategoryList" 
                        :key="cat.name" 
                        :label="cat.name" 
                        :value="cat.name" 
                      >
                        <div class="category-select-item">
                          <span>{{ cat.name }}</span>
                          <span class="category-code-text">{{ cat.code }}</span>
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="运营大类简码" required>
                    <el-input 
                      v-model="currentEditForm.shortCode" 
                      placeholder="如: BF" 
                      maxlength="6"
                      clearable
                      @input="handleShortCodeInput"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="规划定位与战略描述 (选填)" class="mt-1">
                <el-input 
                  v-model="currentEditForm.description" 
                  type="textarea" 
                  :rows="2"
                  placeholder="请输入该产品线的战略定位、业务发展目标等说明..."
                />
              </el-form-item>
            </div>
          </div>

          <!-- 模块 2：平台运营与团队协同配置 (层级从属对应 一目了然) -->
          <div class="form-card-box mt-3">
            <div class="card-header space-between">
              <div class="header-left-group">
                <div class="header-indicator bg-purple"></div>
                <div class="header-title-group">
                  <span class="card-title">{{ dialogMode === 'addTeam' ? '增补业务团队配置' : '平台运营与团队协同配置' }}</span>
                  <span class="card-subtitle">{{ dialogMode === 'addTeam' ? '在此为各平台新增下辖负责团队，已存在的历史团队已自动隐藏' : '平台负责人统筹全局，下辖业务团队分工落地，层级对应清晰可辨' }}</span>
                </div>
              </div>
              <el-button 
                v-if="dialogMode !== 'addTeam'"
                type="primary" 
                size="small" 
                plain
                @click="handleAddPlatformConfig"
              >
                <el-icon class="mr-1"><Plus /></el-icon>
                添加运营平台
              </el-button>
            </div>

            <div class="card-content">
              <!-- 按平台循环展示树状工作台卡片 -->
              <div class="platform-hierarchy-stack">
                <div 
                  v-for="(pf, pfIdx) in currentEditForm.platforms" 
                  :key="pfIdx" 
                  class="platform-hierarchy-card"
                >
                  <!-- 平台层头部与负责人统筹栏 -->
                  <div class="platform-card-header">
                    <div class="pf-header-main">
                      <div class="pf-identity">
                        <span class="pf-index-tag">平台 {{ pfIdx + 1 }}</span>
                        <span class="pf-name-text">{{ pf.platform || '未命名平台' }}</span>
                        <span class="pf-teams-count">已配置 {{ getTeamsForPlatform(pf.platform).length }} 个待增补团队</span>
                      </div>
                      <el-button 
                        v-if="dialogMode !== 'addTeam' && currentEditForm.platforms.length > 1" 
                        link 
                        type="danger" 
                        size="small" 
                        @click="handleRemovePlatformConfig(pfIdx)"
                        class="btn-remove-pf"
                      >
                        <el-icon class="mr-1"><Delete /></el-icon>删除该平台
                      </el-button>
                    </div>

                    <!-- 平台与负责人配置表单行 (一目了然) -->
                    <div class="pf-governance-row">
                      <el-row :gutter="14">
                        <el-col :span="10">
                          <el-form-item label="运营平台名称" :required="dialogMode !== 'addTeam'" class="mb-0">
                            <el-select
                              v-model="pf.platform"
                              :disabled="dialogMode === 'addTeam'"
                              placeholder="选择或输入平台"
                              filterable
                              allow-create
                              default-first-option
                              class="w-full"
                              @change="(val: string) => handlePlatformNameUpdated(val, pfIdx)"
                            >
                              <el-option
                                v-for="opt in platformOptions"
                                :key="opt.value"
                                :label="opt.label"
                                :value="opt.value"
                              />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="14">
                          <el-form-item label="平台产品线负责人 (统筹把控)" :required="dialogMode !== 'addTeam'" class="mb-0">
                            <el-select
                              v-model="pf.lineLeader"
                              :disabled="dialogMode === 'addTeam'"
                              placeholder="指定该平台全局负责人 (如: 夏忠保)"
                              filterable
                              allow-create
                              clearable
                              class="w-full leader-select-input"
                            >
                              <el-option 
                                v-for="name in candidateStaffList" 
                                :key="'cand-pf-' + name" 
                                :label="name" 
                                :value="name" 
                              />
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <div class="pf-leader-role-tip">
                        <span class="tip-dot"></span>
                        <span>由 <b>{{ pf.lineLeader || '平台负责人' }}</b> 负责【{{ pf.platform || '该平台' }}】的产品规划、品类战略与跨团队资源协调</span>
                      </div>
                    </div>
                  </div>

                  <!-- 下辖团队工作区 (树状嵌套在当前平台下) -->
                  <div class="platform-teams-zone">
                    <div class="teams-zone-header">
                      <div class="zone-title-box">
                        <span class="zone-tree-icon">↳</span>
                        <span class="zone-title">【{{ pf.platform }}】下辖负责团队</span>
                        <span class="zone-sub">负责该平台日常运营执行</span>
                      </div>
                      <el-button 
                        type="primary" 
                        size="small" 
                        link
                        @click="handleAddTeamForPlatform(pf.platform)"
                        class="btn-add-team-link"
                      >
                        <el-icon class="mr-1"><Plus /></el-icon>为 {{ pf.platform }} 添加团队
                      </el-button>
                    </div>

                    <!-- 团队卡片列表 -->
                    <div class="subteam-cards-list" v-if="getTeamsForPlatform(pf.platform).length > 0">
                      <div 
                        v-for="(team, tIdx) in getTeamsForPlatform(pf.platform)" 
                        :key="team.id || tIdx" 
                        class="subteam-card"
                      >
                        <div class="subteam-card-head">
                          <div class="subteam-head-left">
                            <span class="subteam-seq-badge">{{ tIdx + 1 }}</span>
                            <el-input 
                              v-model="team.name" 
                              size="small" 
                              placeholder="输入团队名称 (如: 团队 1)" 
                              class="subteam-name-input" 
                            />
                            <span class="subteam-pf-pill">{{ pf.platform }}</span>
                          </div>
                          <div class="subteam-head-right">
                            <el-button 
                              v-if="currentEditForm.teams.length > 1" 
                              link 
                              type="danger" 
                              size="small" 
                              @click="handleRemoveTeamById(team.id)"
                            >
                              <el-icon class="mr-1"><Delete /></el-icon>删除团队
                            </el-button>
                          </div>
                        </div>

                        <div class="subteam-card-body">
                          <el-row :gutter="14">
                            <el-col :span="10">
                              <el-form-item label="团队负责人" required class="mb-2">
                                <el-select
                                  v-model="team.lineLeader"
                                  filterable
                                  allow-create
                                  clearable
                                  placeholder="指定团队负责人"
                                  class="w-full"
                                  @change="(val: string) => handleTeamLeaderChange(team, val)"
                                >
                                  <el-option 
                                    v-for="name in candidateStaffList" 
                                    :key="'subteam-ldr-' + name" 
                                    :label="name" 
                                    :value="name" 
                                  />
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="创建/生效日期" class="mb-2">
                                <el-date-picker
                                  v-model="team.createDate"
                                  type="date"
                                  placeholder="选择日期"
                                  value-format="YYYY-MM-DD"
                                  class="w-full"
                                />
                              </el-form-item>
                            </el-col>
                            <el-col :span="6">
                              <el-form-item label="运行状态" required class="mb-2">
                                <el-radio-group v-model="team.status" size="small">
                                  <el-radio label="启用">启用</el-radio>
                                  <el-radio label="关闭">停用</el-radio>
                                </el-radio-group>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-form-item label="团队成员" required class="mb-0">
                            <el-select
                              v-model="team.members"
                              multiple
                              filterable
                              allow-create
                              default-first-option
                              collapse-tags
                              collapse-tags-tooltip
                              :max-collapse-tags="6"
                              placeholder="请选择或直接输入姓名按 Enter 快速加入"
                              class="w-full"
                            >
                              <el-option 
                                v-for="staff in candidateStaffList" 
                                :key="staff" 
                                :label="staff" 
                                :value="staff" 
                              />
                            </el-select>
                            <div class="field-sub-hint">已添加 {{ team.members ? team.members.length : 0 }} 名团队成员，支持直接输入姓名按回车快捷添加（团队成员不包含团队负责人）</div>
                          </el-form-item>
                        </div>
                      </div>
                    </div>

                    <!-- 该平台下若无团队的引导添加状态 -->
                    <div class="empty-platform-teams" v-else>
                      <div class="empty-hint-text">当前【{{ pf.platform }}】平台暂未配置下辖业务团队</div>
                      <el-button 
                        type="primary" 
                        size="small" 
                        plain
                        @click="handleAddTeamForPlatform(pf.platform)"
                      >
                        <el-icon class="mr-1"><Plus /></el-icon>立即为 {{ pf.platform }} 添加负责团队
                      </el-button>
                    </div>
                  </div>
                </div>

                <!-- 虚线添加平台按钮 -->
                <div class="add-platform-action-box" @click="handleAddPlatformConfig">
                  <el-icon class="mr-1.5"><Plus /></el-icon>
                  <span class="btn-text">添加更多运营平台 (如 Walmart、TikTok、Shopee 等)</span>
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>

      <template #footer>
        <div class="modern-drawer-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            :loading="saveLoading" 
            @click="handleSaveForm"
            class="btn-save-primary"
          >
            {{ dialogMode === 'addTeam' ? '确定增补团队' : '确定保存产品线' }}
          </el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 5. 抽屉：产品线详情 (Detail Drawer) -->
    <el-drawer
      v-model="detailDrawerVisible"
      title="产品线明细"
      size="560px"
      destroy-on-close
    >
      <div v-if="currentDetailItem" class="detail-drawer-body">
        <div class="detail-header-card">
          <div class="detail-code-row">
            <span class="code-title">{{ currentDetailItem.code }}</span>
            <el-tag :type="currentDetailItem.status === '正常' ? 'success' : 'danger'">
              {{ currentDetailItem.status }}
            </el-tag>
          </div>
          <div class="detail-name-row">
            <h2 class="name">{{ currentDetailItem.category }}</h2>
            <span class="short-code">简码: {{ currentDetailItem.shortCode }}</span>
          </div>
        </div>

        <el-descriptions title="规划基础信息" :column="2" border class="mt-4">
          <el-descriptions-item label="运营大类编码">{{ currentDetailItem.code }}</el-descriptions-item>
          <el-descriptions-item label="运营大类简码">{{ currentDetailItem.shortCode }}</el-descriptions-item>
          <el-descriptions-item label="创建日期">{{ currentDetailItem.createDate }}</el-descriptions-item>
          <el-descriptions-item label="启用日期">{{ currentDetailItem.enableDate }}</el-descriptions-item>
          <el-descriptions-item label="关闭日期">{{ currentDetailItem.closeDate || '正常运行中' }}</el-descriptions-item>
          <el-descriptions-item label="当前状态">{{ currentDetailItem.status }}</el-descriptions-item>
        </el-descriptions>

        <!-- 核心人员展示 -->
        <div class="leader-highlight-card mt-4">
          <div class="highlight-title">
            <el-icon class="text-amber"><Avatar /></el-icon>
            <span>产品线负责人 (整个产品线负责人)</span>
          </div>
          <div class="highlight-content">
            <div class="leader-avatar-circle">
              {{ currentDetailItem.teamLeader.slice(0, 1) }}
            </div>
            <div class="leader-text-info">
              <div class="name-bar">
                <span class="leader-name">{{ currentDetailItem.teamLeader }}</span>
                <el-tag size="small" type="warning" effect="dark">整个产品线负责人</el-tag>
              </div>
              <div class="desc-bar">统筹负责 {{ currentDetailItem.category }} 整体业务规划、资源调度与跨部门协同</div>
            </div>
          </div>
        </div>

        <div class="team-matrix-card mt-4">
          <div class="section-title">
            <span class="accent-bar"></span>
            <span class="title-text">团队配置明细</span>
          </div>
          <div class="team-block" v-for="team in currentDetailItem.teams" :key="team.name">
            <div class="team-header">
              <span class="team-name">{{ team.name }}</span>
              <el-tag size="small" :type="team.status === '启用' ? 'success' : 'info'">{{ team.status }}</el-tag>
            </div>
            <div class="team-info-grid">
              <div class="info-row">
                <span class="label">团队负责人:</span>
                <span class="val text-success fw-bold">{{ team.lineLeader }}</span>
              </div>
              <div class="info-row">
                <span class="label">产品线负责人:</span>
                <span class="val text-amber fw-bold">{{ team.teamLeader }}</span>
              </div>
              <div class="info-row">
                <span class="label">创建时间:</span>
                <span class="val">{{ team.createDate }}</span>
              </div>
              <div class="info-row full-width">
                <span class="label">团队成员:</span>
                <div class="members-chips mt-1">
                  <el-tag 
                    v-for="m in getPureMembers(team)" 
                    :key="m" 
                    size="small" 
                    type="info" 
                    effect="plain"
                    class="mr-1 mb-1"
                  >
                    {{ m }}
                  </el-tag>
                  <span v-if="!getPureMembers(team).length" class="text-muted" style="font-size:12px">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 6. 抽屉：变更日志 (Log Drawer) -->
    <el-drawer
      v-model="logsDrawerVisible"
      size="680px"
      destroy-on-close
      class="product-line-log-drawer"
    >
      <template #header>
        <div class="log-drawer-custom-header">
          <div class="header-main-title">
            <span class="title-text">操作与审计变更日志</span>
            <el-tag size="small" type="info" effect="plain" class="audit-tag">
              <el-icon class="mr-1"><DocumentCopy /></el-icon>审计跟踪合规
            </el-tag>
          </div>
          <span class="header-sub-text">记录产品线全生命周期的规划变更、团队增补、状态启闭与人员交接全过程</span>
        </div>
      </template>

      <div v-if="currentLogItem" class="log-drawer-body">
        <!-- 顶部产品线基础概览条 -->
        <div class="log-product-banner">
          <div class="banner-left">
            <span class="code-pill">{{ currentLogItem.code }}</span>
            <div class="name-box">
              <div class="category-name">{{ currentLogItem.category }}</div>
              <div class="meta-row">
                <span class="short-code">简码: {{ currentLogItem.shortCode }}</span>
                <span class="divider">/</span>
                <span class="platforms-count">{{ (currentLogItem.platforms || []).length || 1 }} 个运营平台</span>
                <span class="divider">/</span>
                <span class="teams-count">{{ (currentLogItem.teams || []).length }} 个业务团队</span>
              </div>
            </div>
          </div>
          <div class="banner-right">
            <div class="status-chip" :class="currentLogItem.status === '正常' ? 'chip-active' : 'chip-closed'">
              <span class="status-dot"></span>
              <span>{{ currentLogItem.status }}</span>
            </div>
            <div class="total-logs-badge">
              共 <b>{{ currentLogItem.logs?.length || 0 }}</b> 次历史操作留痕
            </div>
          </div>
        </div>

        <!-- 交互与筛选工具栏 -->
        <div class="log-toolbar-box">
          <div class="filter-tabs-row">
            <el-radio-group v-model="logCategoryFilter" size="small" class="custom-log-tabs">
              <el-radio-button label="ALL">全部 ({{ currentLogItem.logs?.length || 0 }})</el-radio-button>
              <el-radio-button label="addTeam">增补团队</el-radio-button>
              <el-radio-button label="status">状态启闭</el-radio-button>
              <el-radio-button label="platform_edit">平台/规划</el-radio-button>
              <el-radio-button label="leader_member">人员异动</el-radio-button>
              <el-radio-button label="create">创建立项</el-radio-button>
            </el-radio-group>
          </div>

          <div class="search-sort-row">
            <el-input
              v-model="logSearchKeyword"
              placeholder="搜索动作、详情、操作人、单号或变更字段..."
              size="small"
              clearable
              class="log-search-input"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>

            <div class="action-btn-cluster">
              <el-button 
                size="small" 
                plain
                @click="logSortOrder = logSortOrder === 'desc' ? 'asc' : 'desc'"
                :title="logSortOrder === 'desc' ? '切换为按时间正序' : '切换为按时间倒序'"
              >
                <el-icon class="mr-1"><Refresh /></el-icon>
                {{ logSortOrder === 'desc' ? '最新在先' : '最早在先' }}
              </el-button>
              <el-button 
                size="small" 
                type="primary" 
                plain
                @click="handleExportLogs"
              >
                <el-icon class="mr-1"><Download /></el-icon>导出
              </el-button>
            </div>
          </div>
        </div>

        <!-- 日志时间线主体 -->
        <div class="log-timeline-container" v-if="currentFilteredLogs.length > 0">
          <el-timeline class="custom-audit-timeline">
            <el-timeline-item
              v-for="(log, idx) in currentFilteredLogs"
              :key="log.id || idx"
              :type="log.type || 'primary'"
              placement="top"
              class="audit-timeline-node"
            >
              <!-- 自定义时间节点卡片 -->
              <div class="audit-card">
                <!-- 卡片头部: 动作标签 + 批次单号 + 时间戳 -->
                <div class="audit-card-header">
                  <div class="header-left">
                    <span 
                      class="action-badge-tag"
                      :style="{ color: getLogActionBadge(log).color, background: getLogActionBadge(log).bg, borderColor: getLogActionBadge(log).border }"
                    >
                      <el-icon class="mr-1"><component :is="getLogActionBadge(log).icon" /></el-icon>
                      {{ getLogActionBadge(log).text }}
                    </span>
                    <span class="action-title">{{ log.action }}</span>
                    <span v-if="log.batchNo" class="batch-no-tag">{{ log.batchNo }}</span>
                  </div>
                  <div class="header-right">
                    <span class="log-time-text">{{ log.time }}</span>
                  </div>
                </div>

                <!-- 卡片正文描述 -->
                <div class="audit-card-detail" v-html="log.detail"></div>

                <!-- 核心价值：字段变更前与变更后对比 (Diffs) -->
                <div v-if="log.diffs && log.diffs.length > 0" class="audit-diff-panel">
                  <div class="diff-panel-title">
                    <el-icon class="mr-1"><EditPen /></el-icon>变更明细对比 (Before ➔ After)
                  </div>
                  <div class="diff-grid">
                    <div v-for="(diff, dIdx) in log.diffs" :key="dIdx" class="diff-row-item">
                      <span class="diff-field-name">{{ diff.field }}</span>
                      <div class="diff-values">
                        <span class="diff-old-val" :title="diff.oldVal">{{ diff.oldVal }}</span>
                        <span class="diff-arrow"><Right /></span>
                        <span class="diff-new-val" :title="diff.newVal">{{ diff.newVal }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 卡片底部元信息栏: 操作人、身份角色、IP终端、审计校验 -->
                <div class="audit-card-footer">
                  <div class="operator-profile">
                    <div class="avatar-dot">{{ (log.operator || '用').slice(0, 1) }}</div>
                    <span class="operator-name">{{ log.operator }}</span>
                    <span v-if="log.operatorRole" class="operator-role-tag">{{ log.operatorRole }}</span>
                  </div>

                  <div class="env-info">
                    <span v-if="log.ip" class="ip-info">IP: {{ log.ip }}</span>
                    <span class="audit-status-tag">
                      <el-icon class="mr-0.5 text-success"><CircleCheckFilled /></el-icon>系统核验入账
                    </span>
                  </div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>

        <!-- 空状态 -->
        <div v-else class="log-empty-state">
          <el-empty description="未检索到符合条件的日志记录" :image-size="80">
            <el-button size="small" type="primary" plain @click="handleResetLogFilters">
              重置筛选条件
            </el-button>
          </el-empty>
        </div>
      </div>

      <template #footer>
        <div class="log-drawer-footer">
          <span class="footer-tip">已启用不可篡改操作留痕保护</span>
          <el-button @click="logsDrawerVisible = false">关闭</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 7. 对话框：编辑单个团队 (从展开行卡片直接唤起) -->
    <el-dialog
      v-model="singleTeamDialogVisible"
      title="编辑业务团队配置"
      width="540px"
      destroy-on-close
      class="single-team-dialog"
      :close-on-click-modal="false"
    >
      <div v-if="editingTeamContext.row" class="single-team-header-hint mb-4">
        <div class="hint-line">
          <span class="hint-lbl">归属产品线:</span>
          <span class="hint-val font-bold text-dark">【{{ editingTeamContext.row.code }}】{{ editingTeamContext.row.category }}</span>
        </div>
        <div class="hint-line">
          <span class="hint-lbl">产品线负责人:</span>
          <span class="hint-val text-amber font-bold">{{ editingTeamContext.row.teamLeader || '-' }}</span>
        </div>
      </div>

      <el-form :model="singleTeamForm" label-position="top" class="single-team-form">
        <el-form-item label="业务团队名称" required>
          <el-input v-model="singleTeamForm.name" placeholder="例如：团队 1、华东跨境运营部" />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="14">
            <el-form-item label="团队负责人" required>
              <el-select
                v-model="singleTeamForm.lineLeader"
                placeholder="选择或输入负责人"
                filterable
                allow-create
                clearable
                class="w-full"
              >
                <el-option-group v-if="singleTeamForm.members && singleTeamForm.members.length > 0" label="当前团队成员">
                  <el-option 
                    v-for="m in singleTeamForm.members" 
                    :key="'team-member-' + m" 
                    :label="m" 
                    :value="m" 
                  />
                </el-option-group>
                <el-option-group label="全员人员库">
                  <el-option 
                    v-for="staff in candidateStaffList" 
                    :key="'cand-staff-' + staff" 
                    :label="staff" 
                    :value="staff" 
                  />
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="团队运行状态" required>
              <el-radio-group v-model="singleTeamForm.status" class="mt-1">
                <el-radio label="启用">正常启用</el-radio>
                <el-radio label="关闭">关闭停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="团队成员" required>
          <el-select
            v-model="singleTeamForm.members"
            multiple
            filterable
            allow-create
            default-first-option
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="5"
            placeholder="请选择人员或直接输入姓名按回车添加"
            class="w-full"
          >
            <el-option 
              v-for="staff in candidateStaffList" 
              :key="'staff-sel-' + staff" 
              :label="staff" 
              :value="staff" 
            />
          </el-select>
          <div class="field-sub-hint">已添加 {{ singleTeamForm.members ? singleTeamForm.members.length : 0 }} 名团队成员，支持直接输入姓名按 Enter 快速加入</div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="singleTeamDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveSingleTeam">保存团队配置</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 6. 对话框：产品线运行状态编辑 -->
    <el-dialog
      v-model="statusDialogVisible"
      :title="currentStatusRow?.status === '正常' ? '状态编辑 - 关闭产品线' : '状态编辑 - 重新启用产品线'"
      width="500px"
      destroy-on-close
      class="status-edit-dialog"
    >
      <div v-if="currentStatusRow" class="status-dialog-content">
        <div class="status-product-summary-card">
          <div class="summary-top">
            <span class="code-badge">{{ currentStatusRow.code }}</span>
            <span class="category-title">{{ currentStatusRow.category }}</span>
            <span class="category-short-tag" v-if="currentStatusRow.shortCode">{{ currentStatusRow.shortCode }}</span>
          </div>
          <div class="summary-status-row">
            <span class="status-label">当前运行状态：</span>
            <div class="status-badge" :class="currentStatusRow.status === '正常' ? 'status-active' : 'status-closed'">
              <span class="status-dot"></span>
              <span>{{ currentStatusRow.status }}</span>
            </div>
          </div>
        </div>

        <el-form label-position="top" class="mt-4">
          <el-form-item label="变更目标状态" required>
            <el-radio-group v-model="statusForm.status" class="status-toggle-radios">
              <el-radio-button 
                label="正常" 
                :disabled="currentStatusRow.status === '正常'"
              >
                <el-icon class="mr-1 text-success"><CircleCheckFilled /></el-icon>正常运行
              </el-radio-button>
              <el-radio-button 
                label="关闭" 
                :disabled="currentStatusRow.status === '关闭'"
              >
                <el-icon class="mr-1 text-danger"><CircleCloseFilled /></el-icon>已关闭 (归档)
              </el-radio-button>
            </el-radio-group>
            <div class="field-sub-hint mt-1 text-muted" style="font-size: 12px; color: #64748b;">
              {{ currentStatusRow.status === '正常' ? '提示：当前产品线为正常运行状态，仅支持变更为「已关闭」' : '提示：当前产品线已关闭，仅支持变更为「正常运行」' }}
            </div>
          </el-form-item>

          <el-form-item :label="statusForm.status === '关闭' ? '关闭 / 归档生效日期' : '重新启用生效日期'">
            <el-date-picker
              v-model="statusForm.date"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择生效日期"
              class="w-full"
            />
          </el-form-item>

          <el-form-item label="状态变更原因 / 说明 (选填)">
            <el-input
              v-model="statusForm.reason"
              type="textarea"
              :rows="2"
              placeholder="请输入本次状态变更的业务原因说明 (选填)..."
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="statusDialogVisible = false">取消</el-button>
          <el-button 
            :type="statusForm.status === '关闭' ? 'danger' : 'success'" 
            :loading="statusSaving" 
            @click="handleSaveStatus"
          >
            {{ statusForm.status === '关闭' ? '确定关闭产品线' : '确定重新启用' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import {
  Connection, CircleCheckFilled, CircleCloseFilled, UserFilled, User, Avatar,
  Search, RefreshLeft, Plus, ArrowDown, Check, Close, Download, Refresh,
  Setting, EditPen, DocumentCopy, Edit, Delete, Right, InfoFilled, Lock
} from '@element-plus/icons-vue'

// 平台与平台产品线负责人配置接口
interface PlatformConfig {
  platform: string        // 运营平台 (如 Amazon、Walmart、TikTok 等)
  lineLeader: string      // 该平台的产品线负责人
  _lastPlatform?: string  // 内部辅助记录平台历史名称以同步更新关联团队
}

// 常用运营平台枚举
const platformOptions = [
  { label: 'Amazon (亚马逊)', value: 'Amazon' },
  { label: 'Walmart (沃尔玛)', value: 'Walmart' },
  { label: 'TikTok (TikTok Shop)', value: 'TikTok' },
  { label: 'eBay', value: 'eBay' },
  { label: 'Shopee (虾皮)', value: 'Shopee' },
  { label: 'Temu', value: 'Temu' },
  { label: 'AliExpress (速卖通)', value: 'AliExpress' },
  { label: '独立站 (Shopify等)', value: '独立站' }
]

// 1. 模拟业务数据 (精准还原图片中的软包床、厨房电器等17项核心记录)
interface TeamItem {
  id: string
  name: string
  platform?: string // 归属运营平台 (Amazon、Walmart、TikTok 等)
  createDate: string
  teamLeader: string // 整个产品团队负责人
  lineLeader: string // 团队负责人
  members: string[] // 团队成员
  status: '启用' | '关闭'
  isEditing?: boolean
}

interface LogDiffItem {
  field: string
  oldVal: string
  newVal: string
}

interface LogItem {
  id?: string
  time: string
  action: string
  actionType?: 'create' | 'edit' | 'addTeam' | 'status' | 'leader' | 'member' | 'platform' | 'system'
  detail: string
  operator: string
  operatorRole?: string
  ip?: string
  batchNo?: string
  diffs?: LogDiffItem[]
  badge?: string
  type: 'primary' | 'success' | 'warning' | 'info' | 'danger'
}

interface ProductLineItem {
  id: string
  code: string
  category: string
  shortCode: string
  teamLeader: string // 综合负责人 (兼容历史数据)
  platforms?: PlatformConfig[] // ★ 核心字段：同产品线多平台运营，每个平台对应的产品线负责人配置
  teamName: string
  teamMembers: string[]
  lineLeader: string
  createDate: string
  enableDate: string
  closeDate: string
  status: '正常' | '关闭'
  description?: string
  teams: TeamItem[]
  logs: LogItem[]
}

// 候选人员库 (包含团队总负责人与责任人)
const candidateStaffList = [
  '夏忠保', '王美艳', '彭永昌', '李丹', '李梦', '张秋霞', '何阵阵', '许静琪',
  '周美美', '邹晨', '郑亚良', '谢晨', '李强', '张云汉', '刘金康', '何晃', '周锐',
  '李呈', '钟运全', '谭昌星', '王世琦', '郑富兴', '孔素粉', '张伟'
]

// 原始数据源
const initialProductLines: ProductLineItem[] = [
  {
    id: '1',
    code: '046',
    category: '软包床',
    shortCode: 'BF',
    teamLeader: '夏忠保', // 综合负责人
    platforms: [
      { platform: 'Amazon', lineLeader: '夏忠保' }
    ],
    teamName: '团队 1',
    teamMembers: ['王美艳', '夏忠保', '彭永昌'],
    lineLeader: '王美艳',
    createDate: '2025-04-02',
    enableDate: '2025-04-02',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-1',
        name: '团队 1',
        platform: 'Amazon',
        createDate: '2025-04-02',
        teamLeader: '夏忠保',
        lineLeader: '王美艳',
        members: ['王美艳', '夏忠保', '彭永昌'],
        status: '启用'
      }
    ],
    logs: [
      {
        id: 'log-046-5',
        time: '2025-05-18 16:20:10',
        action: '增补业务团队',
        actionType: 'addTeam',
        detail: '结合欧洲大件家具出海增长规划，为【Amazon】平台增补下属专线团队【Amazon 团队 2】，指派王美艳统筹',
        operator: '夏忠保',
        operatorRole: '品类产品总监',
        ip: '192.168.1.102',
        batchNo: '#LOG-046-005',
        diffs: [
          { field: '归属平台', oldVal: '-', newVal: 'Amazon' },
          { field: '增补团队', oldVal: '未配置', newVal: 'Amazon 团队 2' },
          { field: '团队负责人', oldVal: '-', newVal: '王美艳' },
          { field: '初始成员', oldVal: '-', newVal: '彭永昌, 许静琪' }
        ],
        type: 'primary'
      },
      {
        id: 'log-046-4',
        time: '2025-05-02 11:35:45',
        action: '团队成员调整',
        actionType: 'member',
        detail: '【Amazon 团队 1】业务人员优化配置，引入供应链运营助理【许静琪】，调离【陈晨】至新品试产组',
        operator: '王美艳',
        operatorRole: '团队负责人',
        ip: '192.168.1.189',
        batchNo: '#LOG-046-004',
        diffs: [
          { field: '团队成员变更', oldVal: '王美艳, 夏忠保, 陈晨', newVal: '王美艳, 夏忠保, 彭永昌, 许静琪' }
        ],
        type: 'info'
      },
      {
        id: 'log-046-3',
        time: '2025-04-10 14:22:00',
        action: '品类规划修订',
        actionType: 'edit',
        detail: '更新大类战略描述，确立“主打北美智能电动软包一体化家具，构建高端家居供应链矩阵”战略发展定位',
        operator: '夏忠保',
        operatorRole: '品类产品总监',
        ip: '192.168.1.102',
        batchNo: '#LOG-046-003',
        diffs: [
          { field: '战略描述', oldVal: '暂无战略定位描述', newVal: '主打北美与欧洲高端智能软包一体化家具市场，构建高端家居矩阵' }
        ],
        type: 'warning'
      },
      {
        id: 'log-046-2',
        time: '2025-04-02 10:30:15',
        action: '状态变更 - 启用',
        actionType: 'status',
        detail: 'ERP立项审批单 #AP-20250402-09 主管审批通过，产品线正式启用并下发渠道销售权限',
        operator: '张伟',
        operatorRole: '运营副总裁 (审批人)',
        ip: '192.168.1.5',
        batchNo: '#LOG-046-002',
        diffs: [
          { field: '运行状态', oldVal: '待审批', newVal: '正常运行' },
          { field: '启用日期', oldVal: '-', newVal: '2025-04-02' }
        ],
        type: 'success'
      },
      {
        id: 'log-046-1',
        time: '2025-04-02 10:15:00',
        action: '创建产品线',
        actionType: 'create',
        detail: '初始化创建运营大类【软包床】，自动分配大类编码【046】，简码【BF】，指定 Amazon 平台总负责人【夏忠保】',
        operator: '系统管理员',
        operatorRole: '系统管理员',
        ip: '127.0.0.1 (系统后台)',
        batchNo: '#LOG-046-001',
        diffs: [
          { field: '大类编码', oldVal: '未分配', newVal: '046' },
          { field: '大类简码', oldVal: '未设置', newVal: 'BF' }
        ],
        type: 'primary'
      }
    ]
  },
  {
    id: '2',
    code: '045',
    category: '厨房电器',
    shortCode: 'CF',
    teamLeader: '李丹',
    platforms: [
      { platform: 'Amazon', lineLeader: '李丹' },
      { platform: 'eBay', lineLeader: '张小丽' }
    ],
    teamName: '团队 1',
    teamMembers: ['李丹', '刘洋', '陈晨'],
    lineLeader: '李丹',
    createDate: '2025-03-27',
    enableDate: '2025-03-27',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-2',
        name: '团队 1',
        platform: 'Amazon',
        createDate: '2025-03-27',
        teamLeader: '李丹',
        lineLeader: '李丹',
        members: ['李丹', '刘洋', '陈晨'],
        status: '启用'
      }
    ],
    logs: [
      {
        id: 'log-045-4',
        time: '2025-05-10 09:12:30',
        action: '拓展运营平台',
        actionType: 'platform',
        detail: '推进全渠道多平台矩阵布局，新增拓展【eBay】平台业务，委派【张小丽】统筹平台选品与日常运营',
        operator: '李丹',
        operatorRole: '厨房电器产品线负责人',
        ip: '192.168.2.14',
        batchNo: '#LOG-045-004',
        diffs: [
          { field: '拓展运营平台', oldVal: 'Amazon', newVal: 'Amazon, eBay' },
          { field: 'eBay 平台负责人', oldVal: '未设置', newVal: '张小丽' }
        ],
        type: 'primary'
      },
      {
        id: 'log-045-3',
        time: '2025-04-18 15:40:22',
        action: '负责人交接',
        actionType: 'leader',
        detail: '根据小家电事业部轮岗要求，【团队 1】团队负责人由【刘洋】正式交接至【李丹】',
        operator: '刘金康',
        operatorRole: 'HRBP人事主管',
        ip: '192.168.1.201',
        batchNo: '#LOG-045-003',
        diffs: [
          { field: '团队 1 负责人', oldVal: '刘洋', newVal: '李丹' }
        ],
        type: 'info'
      },
      {
        id: 'log-045-2',
        time: '2025-04-05 11:00:00',
        action: '增补业务团队',
        actionType: 'addTeam',
        detail: '小家电出海拓展增量，为 Amazon 平台增补配置专职运营团队【团队 2】',
        operator: '李丹',
        operatorRole: '产品线负责人',
        ip: '192.168.2.14',
        batchNo: '#LOG-045-002',
        diffs: [
          { field: '增补团队', oldVal: '团队 1', newVal: '团队 1, 团队 2' }
        ],
        type: 'primary'
      },
      {
        id: 'log-045-1',
        time: '2025-03-27 09:00:00',
        action: '创建产品线',
        actionType: 'create',
        detail: '初始化创建厨房电器产品线 (编码: 045)，配置初始团队 1 与负责人李丹',
        operator: '系统管理员',
        operatorRole: '系统管理员',
        ip: '127.0.0.1',
        batchNo: '#LOG-045-001',
        diffs: [
          { field: '大类编码', oldVal: '-', newVal: '045' },
          { field: '运营状态', oldVal: '-', newVal: '正常' }
        ],
        type: 'primary'
      }
    ]
  },
  {
    id: '3',
    code: '044',
    category: '海信电器',
    shortCode: 'CJ',
    teamLeader: '李梦',
    teamName: '团队 1',
    teamMembers: ['李梦', '韩旭'],
    lineLeader: '李梦',
    createDate: '2025-01-22',
    enableDate: '2025-01-22',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-3',
        name: '团队 1',
        createDate: '2025-01-22',
        teamLeader: '李梦',
        lineLeader: '李梦',
        members: ['李梦', '韩旭'],
        status: '启用'
      }
    ],
    logs: [
      {
        id: 'log-044-3',
        time: '2025-03-12 11:20:00',
        action: '团队成员调整',
        actionType: 'member',
        detail: '引入高级电商美工兼产品分析师【韩旭】协助李梦负责海信系列新品上架',
        operator: '李梦',
        operatorRole: '品牌专线负责人',
        ip: '192.168.2.88',
        batchNo: '#LOG-044-003',
        diffs: [
          { field: '团队成员', oldVal: '李梦', newVal: '李梦, 韩旭' }
        ],
        type: 'info'
      },
      {
        id: 'log-044-2',
        time: '2025-02-01 10:00:00',
        action: '平台运营协同配置',
        actionType: 'edit',
        detail: '海信电器品牌官方授权书备案审核通过，正式录入供应链白名单系统',
        operator: '孔素粉',
        operatorRole: '法务主管',
        ip: '192.168.1.18',
        batchNo: '#LOG-044-002',
        diffs: [
          { field: '品牌授权状态', oldVal: '审核中', newVal: '已生效 (长期)' }
        ],
        type: 'success'
      },
      {
        id: 'log-044-1',
        time: '2025-01-22 14:20:00',
        action: '创建产品线',
        actionType: 'create',
        detail: '创建海信电器产品线 (编码: 044)，指派李梦负责专线大类运营',
        operator: '李梦',
        operatorRole: '运营主管',
        ip: '192.168.2.88',
        batchNo: '#LOG-044-001',
        diffs: [
          { field: '大类编码', oldVal: '-', newVal: '044' }
        ],
        type: 'primary'
      }
    ]
  },
  {
    id: '4',
    code: '043',
    category: '家用消耗',
    shortCode: 'HY',
    teamLeader: '何阵阵',
    teamName: '团队 1',
    teamMembers: ['张秋霞', '何阵阵', '许静琪'],
    lineLeader: '张秋霞',
    createDate: '2025-01-03',
    enableDate: '2025-01-03',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-4',
        name: '团队 1',
        createDate: '2025-01-03',
        teamLeader: '何阵阵',
        lineLeader: '张秋霞',
        members: ['张秋霞', '何阵阵', '许静琪'],
        status: '启用'
      }
    ],
    logs: [
      {
        id: 'log-043-4',
        time: '2025-04-12 16:30:00',
        action: '增补业务团队',
        actionType: 'addTeam',
        detail: '日用消耗快消品线扩大选品，增设下辖负责团队，由许静琪负责跟单采购',
        operator: '何阵阵',
        operatorRole: '家用事业部总监',
        ip: '192.168.3.10',
        batchNo: '#LOG-043-004',
        diffs: [
          { field: '下辖团队总数', oldVal: '1', newVal: '2' }
        ],
        type: 'primary'
      },
      {
        id: 'log-043-3',
        time: '2025-02-18 14:15:00',
        action: '品类规划修订',
        actionType: 'edit',
        detail: '调整品类简码为 HY，明晰日用消耗品的仓储周转考核指标',
        operator: '张秋霞',
        operatorRole: '品类主管',
        ip: '192.168.3.12',
        batchNo: '#LOG-043-003',
        diffs: [
          { field: '考核周期', oldVal: '月度', newVal: '周转双周' }
        ],
        type: 'warning'
      },
      {
        id: 'log-043-2',
        time: '2025-01-05 09:30:00',
        action: '团队成员调整',
        actionType: 'member',
        detail: '张秋霞接入团队 1 担任团队负责人，许静琪加入成员协助跟单',
        operator: '何阵阵',
        operatorRole: '事业部总监',
        ip: '192.168.3.10',
        batchNo: '#LOG-043-002',
        diffs: [
          { field: '团队负责人', oldVal: '待指定', newVal: '张秋霞' }
        ],
        type: 'info'
      },
      {
        id: 'log-043-1',
        time: '2025-01-03 11:00:00',
        action: '创建产品线',
        actionType: 'create',
        detail: '设立家用消耗大类，指定 何阵阵 为团队负责人',
        operator: '张秋霞',
        operatorRole: '品类主管',
        ip: '192.168.3.12',
        batchNo: '#LOG-043-001',
        diffs: [
          { field: '编码', oldVal: '-', newVal: '043' }
        ],
        type: 'primary'
      }
    ]
  },
  {
    id: '5',
    code: '042',
    category: '宠物用品',
    shortCode: 'ZM',
    teamLeader: '邹晨',
    teamName: '团队 1',
    teamMembers: ['周美美', '邹晨', '侵权检光'],
    lineLeader: '周美美',
    createDate: '2024-12-26',
    enableDate: '2024-12-26',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-5',
        name: '团队 1',
        createDate: '2024-12-26',
        teamLeader: '邹晨',
        lineLeader: '周美美',
        members: ['周美美', '邹晨', '侵权检光'],
        status: '启用'
      }
    ],
    logs: [
      {
        id: 'log-042-4',
        time: '2025-06-01 10:00:00',
        action: '状态变更 - 关闭',
        actionType: 'status',
        detail: '欧美宠物出行季节性旺季平稳结束，配合秋季供应链升级与模具迭代，产品线暂时进入关闭归档周期',
        operator: '邹晨',
        operatorRole: '品类负责人',
        ip: '192.168.3.18',
        batchNo: '#LOG-042-004',
        diffs: [
          { field: '运行状态', oldVal: '正常运行', newVal: '已关闭 (归档)' },
          { field: '关闭生效日期', oldVal: '-', newVal: '2025-06-01' }
        ],
        type: 'danger'
      },
      {
        id: 'log-042-3',
        time: '2025-03-15 16:30:10',
        action: '合规安全审计',
        actionType: 'system',
        detail: '全品类外观专利与商标防侵权自动化巡检完成，未发现侵权风险，评级：合规优秀 (0侵权风险)',
        operator: '侵权检光',
        operatorRole: '知识产权与风控专员',
        ip: '192.168.1.88',
        batchNo: '#LOG-042-003',
        diffs: [
          { field: '风控巡检结果', oldVal: '待核验', newVal: '合规通过 (0侵权风险)' }
        ],
        type: 'success'
      },
      {
        id: 'log-042-2',
        time: '2024-12-26 15:40:00',
        action: '团队成员调整',
        actionType: 'member',
        detail: '引入法务合规人员【侵权检光】至团队成员，提供跨境防侵权支撑',
        operator: '邹晨',
        operatorRole: '品类负责人',
        ip: '192.168.3.18',
        batchNo: '#LOG-042-002',
        diffs: [
          { field: '团队成员', oldVal: '周美美, 邹晨', newVal: '周美美, 邹晨, 侵权检光' }
        ],
        type: 'info'
      },
      {
        id: 'log-042-1',
        time: '2024-12-26 10:00:00',
        action: '创建产品线',
        actionType: 'create',
        detail: '正式立项宠物用品产品线，分配编码【042】，简码【ZM】',
        operator: '周美美',
        operatorRole: '品类主管',
        ip: '192.168.3.22',
        batchNo: '#LOG-042-001',
        diffs: [
          { field: '大类编码', oldVal: '-', newVal: '042' }
        ],
        type: 'primary'
      }
    ]
  },
  {
    id: '6',
    code: '041',
    category: '环境电器',
    shortCode: 'EE',
    teamLeader: '李丹',
    teamName: '团队 1',
    teamMembers: ['李丹', '王建'],
    lineLeader: '李丹',
    createDate: '2024-08-12',
    enableDate: '2024-08-12',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-6',
        name: '团队 1',
        createDate: '2024-08-12',
        teamLeader: '李丹',
        lineLeader: '李丹',
        members: ['李丹', '王建'],
        status: '启用'
      }
    ],
    logs: [
      {
        id: 'log-041-3',
        time: '2025-03-20 14:00:00',
        action: '负责人交接',
        actionType: 'leader',
        detail: '环境电器（加湿器/空净）品类负责人调整，由李丹接手统筹海外线上全渠道',
        operator: '张伟',
        operatorRole: '副总经理',
        ip: '192.168.1.5',
        batchNo: '#LOG-041-003',
        diffs: [
          { field: '总负责人', oldVal: '郑富兴', newVal: '李丹' }
        ],
        type: 'info'
      },
      {
        id: 'log-041-2',
        time: '2024-11-05 10:30:00',
        action: '增补业务团队',
        actionType: 'addTeam',
        detail: '为冬季加湿器爆款冲刺增配独立运营专线团队',
        operator: '李丹',
        operatorRole: '负责人',
        ip: '192.168.2.14',
        batchNo: '#LOG-041-002',
        diffs: [
          { field: '增补团队', oldVal: '-', newVal: '加湿器专线团队' }
        ],
        type: 'primary'
      },
      {
        id: 'log-041-1',
        time: '2024-08-12 09:30:00',
        action: '创建产品线',
        actionType: 'create',
        detail: '创建环境电器大类，编码【041】',
        operator: '系统管理员',
        operatorRole: '系统管理员',
        ip: '127.0.0.1',
        batchNo: '#LOG-041-001',
        diffs: [
          { field: '编码', oldVal: '-', newVal: '041' }
        ],
        type: 'primary'
      }
    ]
  },
  {
    id: '7',
    code: '040',
    category: '个护电器',
    shortCode: 'FH',
    teamLeader: '李丹',
    teamName: '团队 1',
    teamMembers: ['李丹', '张小丽'],
    lineLeader: '李丹',
    createDate: '2024-08-12',
    enableDate: '2024-08-12',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-7',
        name: '团队 1',
        createDate: '2024-08-12',
        teamLeader: '李丹',
        lineLeader: '李丹',
        members: ['李丹', '张小丽'],
        status: '启用'
      }
    ],
    logs: [
      {
        id: 'log-040-2',
        time: '2025-02-10 15:30:00',
        action: '团队成员调整',
        actionType: 'member',
        detail: '分配个护品类运营专员张小丽，对接欧洲个护健康认证',
        operator: '李丹',
        operatorRole: '负责人',
        ip: '192.168.2.14',
        batchNo: '#LOG-040-002',
        diffs: [
          { field: '团队成员', oldVal: '李丹', newVal: '李丹, 张小丽' }
        ],
        type: 'info'
      },
      {
        id: 'log-040-1',
        time: '2024-08-12 09:30:00',
        action: '创建产品线',
        actionType: 'create',
        detail: '创建个护电器大类，编码【040】',
        operator: '系统管理员',
        operatorRole: '系统管理员',
        ip: '127.0.0.1',
        batchNo: '#LOG-040-001',
        diffs: [
          { field: '编码', oldVal: '-', newVal: '040' }
        ],
        type: 'primary'
      }
    ]
  },
  {
    id: '8',
    code: '039',
    category: '季节电器',
    shortCode: 'SE',
    teamLeader: '李梦',
    teamName: '团队 1',
    teamMembers: ['李梦', '赵敏'],
    lineLeader: '李梦',
    createDate: '2024-08-12',
    enableDate: '2024-08-12',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-8',
        name: '团队 1',
        createDate: '2024-08-12',
        teamLeader: '李梦',
        lineLeader: '李梦',
        members: ['李梦', '赵敏'],
        status: '启用'
      }
    ],
    logs: [
      {
        id: 'log-039-3',
        time: '2025-05-01 09:00:00',
        action: '状态变更 - 启用',
        actionType: 'status',
        detail: '夏季电风扇与便携冷风机季节周期启动，产品线重新启用',
        operator: '李梦',
        operatorRole: '负责人',
        ip: '192.168.2.88',
        batchNo: '#LOG-039-003',
        diffs: [
          { field: '运行状态', oldVal: '已关闭', newVal: '正常运行' }
        ],
        type: 'success'
      },
      {
        id: 'log-039-2',
        time: '2024-10-30 18:00:00',
        action: '状态变更 - 关闭',
        actionType: 'status',
        detail: '制冷季节品类销售结束，按常规流程做淡季停售归档',
        operator: '李梦',
        operatorRole: '负责人',
        ip: '192.168.2.88',
        batchNo: '#LOG-039-002',
        diffs: [
          { field: '运行状态', oldVal: '正常运行', newVal: '已关闭' }
        ],
        type: 'danger'
      },
      {
        id: 'log-039-1',
        time: '2024-08-12 09:30:00',
        action: '创建产品线',
        actionType: 'create',
        detail: '创建季节电器大类，编码【039】',
        operator: '系统管理员',
        operatorRole: '系统管理员',
        ip: '127.0.0.1',
        batchNo: '#LOG-039-001',
        diffs: [
          { field: '编码', oldVal: '-', newVal: '039' }
        ],
        type: 'primary'
      }
    ]
  },
  {
    id: '9',
    code: '038',
    category: '户外用品',
    shortCode: 'OD',
    teamLeader: '郑亚良',
    platforms: [
      { platform: 'Amazon', lineLeader: '郑亚良' },
      { platform: 'Walmart', lineLeader: '李强' },
      { platform: 'TikTok', lineLeader: '张云汉' }
    ],
    teamName: '团队 1, 团队 2, 团队 3',
    teamMembers: ['栗亚炎', '闭琳琳', '吴敏林', '米哈兰', '郑亚良', '谢晨', '李强', '张云汉', '刘金康', '周锐'],
    lineLeader: '栗亚炎, 郑亚良, 李强',
    createDate: '2024-07-26',
    enableDate: '2024-07-26',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-9-1',
        name: '团队 1',
        platform: 'Amazon',
        createDate: '2024-07-26',
        teamLeader: '郑亚良',
        lineLeader: '栗亚炎',
        members: ['栗亚炎', '闭琳琳', '吴敏林', '米哈兰'],
        status: '启用'
      },
      {
        id: 't-9-2',
        name: '团队 2',
        platform: 'Walmart',
        createDate: '2024-07-26',
        teamLeader: '李强',
        lineLeader: '郑亚良',
        members: ['郑亚良', '谢晨'],
        status: '启用'
      },
      {
        id: 't-9-3',
        name: '团队 3',
        platform: 'TikTok',
        createDate: '2024-07-26',
        teamLeader: '张云汉',
        lineLeader: '李强',
        members: ['李强', '张云汉', '刘金康', '周锐'],
        status: '启用'
      }
    ],
    logs: [
      {
        id: 'log-038-5',
        time: '2025-07-01 09:20:00',
        action: '状态变更 - 重新启用',
        actionType: 'status',
        detail: '夏季露营与户外探险装备旺季启动，海外仓大批量补货入库完成，正式解除关闭并重新投入全渠道运营',
        operator: '李强',
        operatorRole: '户外事业部总经理',
        ip: '192.168.4.11',
        batchNo: '#LOG-038-005',
        diffs: [
          { field: '运行状态', oldVal: '已关闭', newVal: '正常运行' },
          { field: '启用日期', oldVal: '2024-07-26', newVal: '2025-07-01' }
        ],
        type: 'success'
      },
      {
        id: 'log-038-4',
        time: '2025-01-10 17:00:00',
        action: '状态变更 - 关闭',
        actionType: 'status',
        detail: '冬季淡季停盘清点，暂时关闭产品线并归档历史在途订单',
        operator: '李强',
        operatorRole: '户外事业部总经理',
        ip: '192.168.4.11',
        batchNo: '#LOG-038-004',
        diffs: [
          { field: '运行状态', oldVal: '正常运行', newVal: '已关闭 (停用)' },
          { field: '关闭生效日期', oldVal: '-', newVal: '2025-01-10' }
        ],
        type: 'danger'
      },
      {
        id: 'log-038-3',
        time: '2024-10-15 14:30:00',
        action: '增补业务团队',
        actionType: 'addTeam',
        detail: '为拓展露营帐篷专线，在【Amazon】平台下增补配置【Amazon 团队 2】，由谢晨担任团队负责人',
        operator: '郑亚良',
        operatorRole: 'Amazon平台运营主管',
        ip: '192.168.4.30',
        batchNo: '#LOG-038-003',
        diffs: [
          { field: '新增团队', oldVal: '无', newVal: 'Amazon 团队 2 (负责人: 谢晨)' }
        ],
        type: 'primary'
      },
      {
        id: 'log-038-2',
        time: '2024-08-01 11:10:00',
        action: '拓展运营平台',
        actionType: 'platform',
        detail: '签约入驻【Walmart】北美线下超市同步供应商体系，新增 Walmart 与 TikTok 运营平台',
        operator: '李强',
        operatorRole: '事业部总经理',
        ip: '192.168.4.11',
        batchNo: '#LOG-038-002',
        diffs: [
          { field: '运营平台', oldVal: 'Amazon', newVal: 'Amazon, Walmart, TikTok' }
        ],
        type: 'primary'
      },
      {
        id: 'log-038-1',
        time: '2024-07-26 09:00:00',
        action: '创建产品线',
        actionType: 'create',
        detail: '创建户外用品产品线，分配编码【038】，简码【OD】',
        operator: '郑亚良',
        operatorRole: '系统管理员',
        ip: '192.168.4.30',
        batchNo: '#LOG-038-001',
        diffs: [
          { field: '大类编码', oldVal: '-', newVal: '038' }
        ],
        type: 'primary'
      }
    ]
  },
  {
    id: '10',
    code: '037',
    category: '竹木家具',
    shortCode: 'HZ',
    teamLeader: '李呈',
    teamName: '团队 1',
    teamMembers: ['李呈', '钟运全', '谭昌星'],
    lineLeader: '李呈',
    createDate: '2024-06-14',
    enableDate: '2024-06-14',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-10',
        name: '团队 1',
        createDate: '2024-06-14',
        teamLeader: '李呈',
        lineLeader: '李呈',
        members: ['李呈', '钟运全', '谭昌星'],
        status: '启用'
      }
    ],
    logs: []
  },
  {
    id: '11',
    code: '036',
    category: '汽车配件',
    shortCode: 'AA',
    teamLeader: '王世琦',
    teamName: '团队 1',
    teamMembers: ['王世琦', '郑富兴'],
    lineLeader: '王世琦',
    createDate: '2024-04-30',
    enableDate: '2024-04-30',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-11',
        name: '团队 1',
        createDate: '2024-04-30',
        teamLeader: '王世琦',
        lineLeader: '王世琦',
        members: ['王世琦', '郑富兴'],
        status: '启用'
      }
    ],
    logs: []
  },
  {
    id: '12',
    code: '035',
    category: '艾草类',
    shortCode: 'ST',
    teamLeader: '孔素粉',
    teamName: '团队 1',
    teamMembers: ['张秋霞', '孔素粉'],
    lineLeader: '张秋霞',
    createDate: '2024-04-30',
    enableDate: '2024-04-30',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-12',
        name: '团队 1',
        createDate: '2024-04-30',
        teamLeader: '孔素粉',
        lineLeader: '张秋霞',
        members: ['张秋霞', '孔素粉'],
        status: '启用'
      }
    ],
    logs: []
  },
  {
    id: '13',
    code: '034',
    category: '外拍产品',
    shortCode: 'PD',
    teamLeader: '王世琦',
    teamName: '团队 1',
    teamMembers: ['王世琦', '杨秀青', '朱柏诚', '郑富兴'],
    lineLeader: '王世琦',
    createDate: '2024-04-30',
    enableDate: '2024-04-30',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-13',
        name: '团队 1',
        createDate: '2024-04-30',
        teamLeader: '王世琦',
        lineLeader: '王世琦',
        members: ['王世琦', '杨秀青', '朱柏诚', '郑富兴'],
        status: '启用'
      }
    ],
    logs: []
  },
  {
    id: '14',
    code: '033',
    category: '摄影监控',
    shortCode: 'CM',
    teamLeader: '刘金康',
    teamName: '团队 1',
    teamMembers: ['刘金康', '张云汉'],
    lineLeader: '刘金康',
    createDate: '2024-04-30',
    enableDate: '2024-04-30',
    closeDate: '2026-06-22',
    status: '关闭',
    teams: [
      {
        id: 't-14',
        name: '团队 1',
        createDate: '2024-04-30',
        teamLeader: '刘金康',
        lineLeader: '刘金康',
        members: ['刘金康', '张云汉'],
        status: '关闭'
      }
    ],
    logs: [
      { time: '2026-06-22 10:00', action: '关闭产品线', detail: '根据战略决策，正式关闭摄影监控产品线业务', operator: '管理员', type: 'warning' }
    ]
  },
  {
    id: '15',
    code: '032',
    category: '办公用品',
    shortCode: 'OF',
    teamLeader: '孔素粉',
    teamName: '团队 1',
    teamMembers: ['张秋霞', '孔素粉'],
    lineLeader: '张秋霞',
    createDate: '2024-04-30',
    enableDate: '2024-04-30',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-15',
        name: '团队 1',
        createDate: '2024-04-30',
        teamLeader: '孔素粉',
        lineLeader: '张秋霞',
        members: ['张秋霞', '孔素粉'],
        status: '启用'
      }
    ],
    logs: []
  },
  {
    id: '16',
    code: '031',
    category: '智能手表',
    shortCode: 'SW',
    teamLeader: '王世琦',
    teamName: '团队 1',
    teamMembers: ['王世琦', '杨秀青', '朱柏诚', '郑富兴', '刘展亮'],
    lineLeader: '王世琦',
    createDate: '2024-04-30',
    enableDate: '2024-04-30',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-16',
        name: '团队 1',
        createDate: '2024-04-30',
        teamLeader: '王世琦',
        lineLeader: '王世琦',
        members: ['王世琦', '杨秀青', '朱柏诚', '郑富兴', '刘展亮'],
        status: '启用'
      }
    ],
    logs: []
  },
  {
    id: '17',
    code: '030',
    category: '游戏配件',
    shortCode: 'GA',
    teamLeader: '陈泽祥',
    teamName: '团队 1',
    teamMembers: ['陈泽祥', '廖飞飞'],
    lineLeader: '陈泽祥',
    createDate: '2024-04-30',
    enableDate: '2024-04-30',
    closeDate: '',
    status: '正常',
    teams: [
      {
        id: 't-17',
        name: '团队 1',
        createDate: '2024-04-30',
        teamLeader: '陈泽祥',
        lineLeader: '陈泽祥',
        members: ['陈泽祥', '廖飞飞'],
        status: '启用'
      }
    ],
    logs: []
  }
]

const productLines = ref<ProductLineItem[]>([...initialProductLines])
const loading = ref(false)

// 2. 筛选表单
const filterForm = reactive({
  category: '',
  platform: '', // ★ 运营平台筛选
  team: '',
  teamLeader: '', // 产品线负责人筛选 (支持匹配任意平台负责人)
  lineLeader: '',
  searchType: 'code',
  keyword: '',
  status: ''
})

// 选项计算
const categoryOptions = computed(() => Array.from(new Set(productLines.value.map(item => item.category))))
const teamOptions = computed(() => ['团队 1', '团队 2', '战队 A'])
const teamLeaderOptions = computed(() => {
  const set = new Set<string>()
  productLines.value.forEach(item => {
    if (item.teamLeader) set.add(item.teamLeader)
    if (item.platforms) {
      item.platforms.forEach(pf => {
        if (pf.lineLeader) set.add(pf.lineLeader)
      })
    }
  })
  return Array.from(set)
})
const lineLeaderOptions = computed(() => Array.from(new Set(productLines.value.map(item => item.lineLeader).filter(Boolean))))

// 顶部统计
const totalLinesCount = computed(() => productLines.value.length)
const totalTeamsCount = computed(() => {
  return productLines.value.reduce((acc, item) => acc + ((item.teams && item.teams.length) || 1), 0)
})
const activeLinesCount = computed(() => productLines.value.filter(item => item.status === '正常').length)
const closedLinesCount = computed(() => productLines.value.filter(item => item.status === '关闭').length)
const uniqueCategoryCount = computed(() => categoryOptions.value.length)
const teamLeadersCount = computed(() => teamLeaderOptions.value.length)
const lineLeadersCount = computed(() => lineLeaderOptions.value.length)

// 表格列可见性
const columnVisible = reactive({
  code: true,
  category: true,
  shortCode: false,
  teamLeader: true,
  team: true,
  lineLeader: true,
  createDate: true,
  enableDate: true,
  closeDate: true
})

// 筛选后数据
const filteredList = computed(() => {
  return productLines.value.filter(item => {
    // 状态过滤
    if (filterForm.status && item.status !== filterForm.status) return false
    // 运营大类
    if (filterForm.category && item.category !== filterForm.category) return false
    // 运营平台过滤 (匹配platforms或teams)
    if (filterForm.platform) {
      const p = filterForm.platform
      const hasInPlatforms = (item.platforms || []).some(pf => pf.platform === p)
      const hasInTeams = (item.teams || []).some(t => t.platform === p)
      if (!hasInPlatforms && !hasInTeams) return false
    }
    // 产品团队
    if (filterForm.team && item.teamName !== filterForm.team) return false
    // 产品线负责人 (支持匹配综合负责人或该大类下任一平台负责人)
    if (filterForm.teamLeader) {
      const target = filterForm.teamLeader
      const matchOverall = item.teamLeader === target
      const matchPlatform = (item.platforms || []).some(pf => pf.lineLeader === target)
      if (!matchOverall && !matchPlatform) return false
    }
    // 团队负责人
    if (filterForm.lineLeader && item.lineLeader !== filterForm.lineLeader) return false
    
    // 关键词搜索
    if (filterForm.keyword) {
      const kw = filterForm.keyword.trim().toLowerCase()
      if (filterForm.searchType === 'code') {
        return item.code.toLowerCase().includes(kw)
      } else if (filterForm.searchType === 'category') {
        return item.category.toLowerCase().includes(kw)
      } else if (filterForm.searchType === 'shortCode') {
        return item.shortCode.toLowerCase().includes(kw)
      } else if (filterForm.searchType === 'member') {
        return item.teamMembers.some(m => m.toLowerCase().includes(kw))
      }
    }
    return true
  })
})

// 获取指定平台对应的产品线负责人
const getPlatformLineLeader = (row: ProductLineItem, platform?: string): string => {
  if (platform && row.platforms) {
    const pf = row.platforms.find(p => p.platform === platform)
    if (pf && pf.lineLeader) return pf.lineLeader
  }
  return row.teamLeader || '-'
}

// 获取纯团队成员（过滤掉该团队的负责人，避免重复展示）
const getPureMembers = (team: any): string[] => {
  if (!team || !team.members) return []
  const leader = team.lineLeader
  return (team.members as string[]).filter(m => !leader || m !== leader)
}

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10
})

const pagedList = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  return filteredList.value.slice(start, start + pagination.pageSize)
})

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.currentPage = 1
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
}

const handleSearch = () => {
  pagination.currentPage = 1
}

const handleReset = () => {
  filterForm.category = ''
  filterForm.platform = ''
  filterForm.team = ''
  filterForm.teamLeader = ''
  filterForm.lineLeader = ''
  filterForm.searchType = 'code'
  filterForm.keyword = ''
  filterForm.status = ''
  pagination.currentPage = 1
  ElMessage.info('已重置所有筛选条件')
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据已刷新')
  }, 350)
}

const handleExport = () => {
  ElMessage.success(`已导出当前展示的 ${filteredList.value.length} 条产品线数据`)
}

// 快速切换启用 / 关闭状态
const handleToggleStatus = (row: ProductLineItem) => {
  if (row.status === '正常') {
    row.status = '关闭'
    row.closeDate = new Date().toISOString().slice(0, 10)
    row.logs.unshift({
      time: new Date().toLocaleString(),
      action: '关闭产品线',
      detail: '状态切换为已关闭',
      operator: '当前用户',
      type: 'warning'
    })
    ElMessage.warning(`产品线【${row.category}】已关闭`)
  } else {
    row.status = '正常'
    row.closeDate = ''
    row.logs.unshift({
      time: new Date().toLocaleString(),
      action: '重新启用',
      detail: '状态重新恢复为正常',
      operator: '当前用户',
      type: 'success'
    })
    ElMessage.success(`产品线【${row.category}】已启用`)
  }
}

// 3. 对话框表单管理 (新增 / 编辑产品线)
const editDialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit' | 'addTeam'>('edit')
const editFormRef = ref<FormInstance>()
const saveLoading = ref(false)

const currentEditForm = reactive<{
  id: string
  code: string
  category: string
  shortCode: string
  teamLeader: string // 综合负责人
  platforms: PlatformConfig[] // ★ 运营平台与各平台产品线负责人列表
  description: string
  status: '正常' | '关闭'
  teams: TeamItem[]
}>({
  id: '',
  code: '',
  category: '',
  shortCode: '',
  teamLeader: '',
  platforms: [
    { platform: 'Amazon', lineLeader: '' }
  ],
  description: '',
  status: '正常',
  teams: []
})

const formRules = {
  category: [{ required: true, message: '请输入运营大类', trigger: 'blur' }],
  shortCode: [{ required: true, message: '请输入运营大类简码', trigger: 'blur' }]
}

// 常用运营大类及标准简码库
const standardCategoryList = [
  { name: '软包床', code: 'BF' },
  { name: '厨房电器', code: 'CF' },
  { name: '海信电器', code: 'CJ' },
  { name: '家用消耗', code: 'HY' },
  { name: '宠物用品', code: 'ZM' },
  { name: '环境电器', code: 'EE' },
  { name: '个护电器', code: 'FH' },
  { name: '季节电器', code: 'SE' },
  { name: '户外用品', code: 'OD' },
  { name: '竹木家具', code: 'HZ' },
  { name: '汽车配件', code: 'AA' },
  { name: '艾草类', code: 'ST' },
  { name: '外拍产品', code: 'PD' },
  { name: '摄影监控', code: 'CM' },
  { name: '办公用品', code: 'OF' },
  { name: '智能手表', code: 'SW' },
  { name: '游戏配件', code: 'GA' }
]

// 快捷推荐品类
const quickCategories = [
  { name: '软包床', code: 'BF' },
  { name: '厨房电器', code: 'CF' },
  { name: '户外用品', code: 'OD' },
  { name: '智能手表', code: 'SW' },
  { name: '宠物用品', code: 'ZM' },
  { name: '竹木家具', code: 'HZ' }
]

const applyQuickCategory = (cat: { name: string, code: string }) => {
  currentEditForm.category = cat.name
  currentEditForm.shortCode = cat.code
  ElMessage.success(`已快速套用【${cat.name} (${cat.code})】`)
}

// 运营大类变更自动建议简码
const handleCategoryChange = (val: string) => {
  if (!val) return
  const matched = standardCategoryList.find(c => c.name === val)
  if (matched && !currentEditForm.shortCode) {
    currentEditForm.shortCode = matched.code
  }
}

// 运营大类简码大写处理
const handleShortCodeInput = (val: string) => {
  currentEditForm.shortCode = (val || '').toUpperCase()
}

// ★ 根据平台获取下辖负责团队列表 (一目了然对应)
const getTeamsForPlatform = (platformName: string): TeamItem[] => {
  if (!currentEditForm.teams) return []
  return currentEditForm.teams.filter(t => t.platform === platformName)
}

// 运营平台名称修改时，自动同步该平台下关联团队的归属平台
const handlePlatformNameUpdated = (newVal: string, pfIdx: number) => {
  if (!newVal) return
  const pf = currentEditForm.platforms[pfIdx]
  const oldVal = pf._lastPlatform || pf.platform
  if (oldVal && oldVal !== newVal) {
    if (currentEditForm.teams) {
      currentEditForm.teams.forEach(t => {
        if (t.platform === oldVal) {
          t.platform = newVal
        }
      })
    }
    pf._lastPlatform = newVal
  }
}

// 团队负责人变动时，确保团队成员中剔除团队负责人
const handleTeamLeaderChange = (team: TeamItem, val: string) => {
  if (val && team.members && team.members.includes(val)) {
    team.members = team.members.filter(m => m !== val)
  }
}

// ★ 添加运营平台与产品线负责人配置 (并为新平台生成 1 个初始团队)
const handleAddPlatformConfig = () => {
  if (!currentEditForm.platforms) currentEditForm.platforms = []
  const added = currentEditForm.platforms.map(p => p.platform)
  const available = platformOptions.find(opt => !added.includes(opt.value))
  const targetPf = available ? available.value : `平台 ${currentEditForm.platforms.length + 1}`
  
  currentEditForm.platforms.push({
    platform: targetPf,
    lineLeader: '',
    _lastPlatform: targetPf
  })

  if (!currentEditForm.teams) currentEditForm.teams = []
  currentEditForm.teams.push({
    id: 't-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    name: `${targetPf} 团队 1`,
    platform: targetPf,
    createDate: new Date().toISOString().slice(0, 10),
    teamLeader: currentEditForm.teamLeader || '',
    lineLeader: '',
    members: [],
    status: '启用'
  })

  ElMessage.success(`已添加运营平台【${targetPf}】及其团队配置`)
}

// 移除运营平台配置 (连带清理或归整归属团队，至少保留 1 个平台)
const handleRemovePlatformConfig = (idx: number) => {
  if (currentEditForm.platforms.length <= 1) {
    ElMessage.warning('一条产品线至少需要保留一个运营平台！')
    return
  }
  const removed = currentEditForm.platforms.splice(idx, 1)[0]
  if (currentEditForm.teams) {
    currentEditForm.teams = currentEditForm.teams.filter(t => t.platform !== removed.platform)
    // 若所有团队被删除，则在剩余第一个平台下补建一个默认团队
    if (currentEditForm.teams.length === 0 && currentEditForm.platforms.length > 0) {
      const firstPf = currentEditForm.platforms[0].platform
      currentEditForm.teams.push({
        id: 't-' + Date.now(),
        name: `${firstPf} 团队 1`,
        platform: firstPf,
        createDate: new Date().toISOString().slice(0, 10),
        teamLeader: '',
        lineLeader: '',
        members: [],
        status: '启用'
      })
    }
  }
  ElMessage.info(`已移除运营平台【${removed.platform}】及其关联团队`)
}

// ★ 为指定运营平台快速新增业务团队
const handleAddTeamForPlatform = (platformName: string) => {
  if (!currentEditForm.teams) {
    currentEditForm.teams = []
  }
  let existingCount = 0
  if (dialogMode.value === 'addTeam') {
    const target = productLines.value.find(item => item.id === currentEditForm.id)
    if (target && target.teams) {
      existingCount = target.teams.filter(t => t.platform === platformName).length
    }
  }
  const pfTeams = getTeamsForPlatform(platformName)
  const nextNum = existingCount + pfTeams.length + 1
  currentEditForm.teams.push({
    id: 't-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    name: `${platformName} 团队 ${nextNum}`,
    platform: platformName,
    createDate: new Date().toISOString().slice(0, 10),
    teamLeader: currentEditForm.teamLeader || '',
    lineLeader: '',
    members: [],
    status: '启用'
  })
  ElMessage.success(dialogMode.value === 'addTeam' ? `已为【${platformName}】新增待增补团队` : `已为【${platformName}】新增业务团队`)
}

// 快速新增业务团队 (默认添加到第一个平台)
const handleAddTeam = () => {
  const targetPf = (currentEditForm.platforms && currentEditForm.platforms[0]?.platform) || 'Amazon'
  handleAddTeamForPlatform(targetPf)
}

// 移除指定业务团队 (按 ID 移除，至少保留 1 个团队)
const handleRemoveTeamById = (teamId: string) => {
  if (currentEditForm.teams.length <= 1) {
    ElMessage.warning(dialogMode.value === 'addTeam' ? '增补团队时至少需保留 1 个待添加的团队！' : '一条产品线至少需要保留 1 个负责团队！')
    return
  }
  const idx = currentEditForm.teams.findIndex(t => t.id === teamId)
  if (idx !== -1) {
    const removedName = currentEditForm.teams[idx].name || '该团队'
    currentEditForm.teams.splice(idx, 1)
    ElMessage.info(`已移除【${removedName}】`)
  }
}

// 打开新增产品线
const handleCreate = () => {
  dialogMode.value = 'create'
  currentEditForm.id = Date.now().toString()
  currentEditForm.code = '' // 运营大类编码在保存后自动生成
  currentEditForm.category = ''
  currentEditForm.shortCode = ''
  currentEditForm.description = ''
  currentEditForm.status = '正常'
  currentEditForm.teamLeader = ''
  currentEditForm.platforms = [
    { platform: 'Amazon', lineLeader: '', _lastPlatform: 'Amazon' }
  ]
  currentEditForm.teams = [
    {
      id: 't-' + Date.now(),
      name: 'Amazon 团队 1',
      platform: 'Amazon',
      createDate: new Date().toISOString().slice(0, 10),
      teamLeader: '',
      lineLeader: '',
      members: [],
      status: '启用'
    }
  ]
  editDialogVisible.value = true
}

// 打开编辑产品线
const handleEdit = (row: ProductLineItem) => {
  dialogMode.value = 'edit'
  currentEditForm.id = row.id
  currentEditForm.code = row.code
  currentEditForm.category = row.category
  currentEditForm.shortCode = row.shortCode
  currentEditForm.description = row.description || ''
  currentEditForm.status = row.status
  currentEditForm.teamLeader = row.teamLeader || ''

  // 载入平台配置 (兼容历史单平台情况)
  if (row.platforms && row.platforms.length > 0) {
    currentEditForm.platforms = row.platforms.map(p => ({
      platform: p.platform,
      lineLeader: p.lineLeader,
      _lastPlatform: p.platform
    }))
  } else {
    currentEditForm.platforms = [{ platform: 'Amazon', lineLeader: row.teamLeader || '', _lastPlatform: 'Amazon' }]
  }

  // 载入团队数据
  const firstPf = currentEditForm.platforms[0]?.platform || 'Amazon'
  const rawTeams: any[] = row.teams && row.teams.length > 0 ? row.teams : [{
    name: row.teamName || '团队 1',
    platform: firstPf,
    createDate: row.createDate || new Date().toISOString().slice(0, 10),
    teamLeader: row.teamLeader || '',
    lineLeader: row.lineLeader || '',
    members: row.teamMembers ? [...row.teamMembers] : [],
    status: '启用'
  }]
  currentEditForm.teams = rawTeams.map((t: any, idx: number): TeamItem => ({
    id: t.id || ('t-' + Date.now() + '-' + idx),
    name: t.name || (`团队 ${idx + 1}`),
    platform: t.platform || firstPf,
    createDate: t.createDate || new Date().toISOString().slice(0, 10),
    teamLeader: t.teamLeader || currentEditForm.teamLeader || '',
    lineLeader: t.lineLeader || '',
    members: t.members ? t.members.filter((m: string) => m !== (t.lineLeader || '')) : [],
    status: (t.status === '关闭' ? '关闭' : '启用')
  }))

  // 确保团队中出现的平台都包含在 platforms 中
  currentEditForm.teams.forEach(t => {
    if (t.platform && !currentEditForm.platforms.some(p => p.platform === t.platform)) {
      currentEditForm.platforms.push({
        platform: t.platform,
        lineLeader: t.lineLeader || '',
        _lastPlatform: t.platform
      })
    }
  })

  editDialogVisible.value = true
}

// 提交保存产品线 (支持多平台矩阵与多团队聚合保存)
const handleSaveForm = () => {
  const cat = currentEditForm.category ? currentEditForm.category.trim() : ''
  const sc = currentEditForm.shortCode ? currentEditForm.shortCode.trim() : ''

  if (!cat) {
    ElMessage.warning('请填写或选择运营大类！')
    return
  }
  if (!sc) {
    ElMessage.warning('请填写运营大类简码！')
    return
  }
  if (!currentEditForm.platforms || currentEditForm.platforms.length === 0) {
    ElMessage.warning('请至少配置 1 个运营平台及产品线负责人！')
    return
  }
  // 校验平台与平台负责人
  for (let i = 0; i < currentEditForm.platforms.length; i++) {
    const pf = currentEditForm.platforms[i]
    if (!pf.platform) {
      ElMessage.warning(`请选择第 ${i + 1} 个运营平台！`)
      return
    }
    if (!pf.lineLeader) {
      ElMessage.warning(`请指定【${pf.platform}】平台的产品线负责人！`)
      return
    }
  }

  if (!currentEditForm.teams || currentEditForm.teams.length === 0) {
    ElMessage.warning('请至少配置 1 个负责团队！')
    return
  }

  // 综合负责人取第一个有效平台负责人或逗号拼接
  const allPlatformLeaders = currentEditForm.platforms.map(p => p.lineLeader).filter(Boolean)
  const mainLeader = allPlatformLeaders[0] || ''

  // 逐一校验各团队
  for (let i = 0; i < currentEditForm.teams.length; i++) {
    const t = currentEditForm.teams[i]
    if (!t.name || !t.name.trim()) {
      ElMessage.warning(`请填写第 ${i + 1} 个团队的团队名称！`)
      return
    }
    if (!t.platform) {
      t.platform = currentEditForm.platforms[0].platform
    }
    if (!t.lineLeader) {
      ElMessage.warning(`请指定【${t.name}】的团队负责人！`)
      return
    }
    if (!t.members || t.members.length === 0) {
      ElMessage.warning(`请为【${t.name}】至少添加 1 名团队成员！`)
      return
    }
    // 确保团队成员中不包含团队负责人
    if (t.lineLeader && t.members) {
      t.members = t.members.filter(m => m !== t.lineLeader)
    }
    t.teamLeader = mainLeader
  }

  saveLoading.value = true
  setTimeout(() => {
    saveLoading.value = false
    const teamList = currentEditForm.teams
    const teamNames = teamList.map(t => t.name).join(', ')
    // 汇总成员与负责人
    const allMembersSet = new Set<string>()
    teamList.forEach(t => (t.members || []).forEach(m => allMembersSet.add(m)))
    const allMembers = Array.from(allMembersSet)
    const lineLeaders = Array.from(new Set(teamList.map(t => t.lineLeader))).join(', ')

    // 平台负责人描述
    const pfLeadersDesc = currentEditForm.platforms.map(p => `${p.platform}: ${p.lineLeader}`).join('; ')

    if (dialogMode.value === 'create') {
      // 自动分配编码
      const nextNum = (Math.max(...productLines.value.map(i => parseInt(i.code) || 0), 0) + 1).toString().padStart(3, '0')

      const newItem: ProductLineItem = {
        id: currentEditForm.id || Date.now().toString(),
        code: nextNum,
        category: cat,
        shortCode: sc.toUpperCase(),
        teamLeader: mainLeader,
        platforms: JSON.parse(JSON.stringify(currentEditForm.platforms)),
        teamName: teamNames,
        teamMembers: allMembers,
        lineLeader: lineLeaders,
        createDate: teamList[0].createDate || new Date().toISOString().slice(0, 10),
        enableDate: new Date().toISOString().slice(0, 10),
        closeDate: '',
        status: '正常', // ★ 新增产品线均默认为正常运行状态
        description: currentEditForm.description,
        teams: JSON.parse(JSON.stringify(teamList)),
        logs: [
          {
            time: new Date().toLocaleString(),
            action: '创建产品线',
            detail: `成功创建【${cat}】(编码: ${nextNum})，平台负责人: [${pfLeadersDesc}]，共配置 ${teamList.length} 个负责团队`,
            operator: '当前用户',
            type: 'primary'
          }
        ]
      }
      productLines.value.unshift(newItem)
      ElMessage.success(`产品线【${newItem.category}】创建成功，已自动分配大类编码【${nextNum}】！`)
    } else if (dialogMode.value === 'addTeam') {
      const target = productLines.value.find(item => item.id === currentEditForm.id)
      if (target) {
        const newlyAddedTeams = currentEditForm.teams
        if (!target.teams) target.teams = []
        target.teams = [...target.teams, ...JSON.parse(JSON.stringify(newlyAddedTeams))]

        // 检查是否有新增的平台配置
        currentEditForm.platforms.forEach(p => {
          if (!target.platforms) target.platforms = []
          if (!target.platforms.some(tp => tp.platform === p.platform)) {
            target.platforms.push({ platform: p.platform, lineLeader: p.lineLeader })
          }
        })

        // 重新汇总团队名称与成员列表
        target.teamName = target.teams.map(t => t.name).join(', ')
        const allMembersSet = new Set<string>()
        target.teams.forEach(t => (t.members || []).forEach(m => allMembersSet.add(m)))
        target.teamMembers = Array.from(allMembersSet)
        target.lineLeader = Array.from(new Set(target.teams.map(t => t.lineLeader))).join(', ')

        const newTeamNames = newlyAddedTeams.map(t => t.name).join(', ')
        target.logs.unshift({
          id: 'log-' + Date.now(),
          time: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 8),
          action: '增补业务团队',
          actionType: 'addTeam',
          detail: `成功为产品线新增补了 <b>${newlyAddedTeams.length}</b> 个业务团队（${newTeamNames}），已自动建立组织架构映射`,
          operator: '当前操作用户',
          operatorRole: '组织与协同管理员',
          ip: '192.168.1.108',
          batchNo: `#LOG-${target.code}-${Date.now().toString().slice(-4)}`,
          diffs: newlyAddedTeams.map(t => ({
            field: `新增团队 [${t.platform || 'Amazon'}]`,
            oldVal: '未配置',
            newVal: `${t.name} (负责人: ${t.lineLeader || '未分配'}, 成员: ${t.members?.length || 0}人)`
          })),
          type: 'primary'
        })
        ElMessage.success(`已成功为产品线【${target.category}】增补 ${newlyAddedTeams.length} 个新团队！`)
      }
    } else {
      const target = productLines.value.find(item => item.id === currentEditForm.id)
      if (target) {
        target.category = cat
        target.shortCode = sc.toUpperCase()
        target.description = currentEditForm.description
        target.teamLeader = mainLeader
        target.platforms = JSON.parse(JSON.stringify(currentEditForm.platforms))
        target.teamName = teamNames
        target.teamMembers = allMembers
        target.lineLeader = lineLeaders
        target.teams = JSON.parse(JSON.stringify(teamList))

        target.logs.unshift({
          id: 'log-' + Date.now(),
          time: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 8),
          action: '品类规划与配置编辑',
          actionType: 'edit',
          detail: `更新产品线多平台配置（${pfLeadersDesc}）及下属负责团队配置（共 ${teamList.length} 个团队）`,
          operator: '当前操作用户',
          operatorRole: '品类运营主管',
          ip: '192.168.1.108',
          batchNo: `#LOG-${target.code}-${Date.now().toString().slice(-4)}`,
          diffs: [
            { field: '运营大类', oldVal: target.category, newVal: cat },
            { field: '大类简码', oldVal: target.shortCode, newVal: sc.toUpperCase() },
            { field: '下属团队数', oldVal: `${target.teams?.length || 0} 个`, newVal: `${teamList.length} 个` }
          ],
          type: 'warning'
        })
        ElMessage.success(`产品线【${target.category}】更新成功！`)
      }
    }
    editDialogVisible.value = false
  }, 280)
}

// 4. 明细抽屉与辅助交互
const handleCopyCode = (code: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code)
    ElMessage.success(`运营大类编码【${code}】已复制到剪贴板！`)
  } else {
    ElMessage.info(`大类编码: ${code}`)
  }
}

// ★ 打开增补团队抽屉 (品类基础信息锁定不可编辑，已存在的团队不显示，只配置增补的新团队)
const handleQuickAddTeam = (row: ProductLineItem) => {
  dialogMode.value = 'addTeam'
  currentEditForm.id = row.id
  currentEditForm.code = row.code
  currentEditForm.category = row.category
  currentEditForm.shortCode = row.shortCode
  currentEditForm.description = row.description || ''
  currentEditForm.status = row.status
  currentEditForm.teamLeader = row.teamLeader || ''

  // 载入平台配置 (兼容历史单平台情况)
  if (row.platforms && row.platforms.length > 0) {
    currentEditForm.platforms = row.platforms.map(p => ({
      platform: p.platform,
      lineLeader: p.lineLeader,
      _lastPlatform: p.platform
    }))
  } else {
    currentEditForm.platforms = [{ platform: 'Amazon', lineLeader: row.teamLeader || '', _lastPlatform: 'Amazon' }]
  }

  // ★ 核心要求：已存在的团队不显示！
  // currentEditForm.teams 仅初始化本次待增补的新团队
  const firstPf = currentEditForm.platforms[0]?.platform || 'Amazon'
  const existingPfTeams = (row.teams || []).filter(t => t.platform === firstPf)
  const nextNum = existingPfTeams.length + 1
  currentEditForm.teams = [
    {
      id: 't-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: `${firstPf} 团队 ${nextNum}`,
      platform: firstPf,
      createDate: new Date().toISOString().slice(0, 10),
      teamLeader: currentEditForm.teamLeader || '',
      lineLeader: '',
      members: [],
      status: '启用'
    }
  ]

  editDialogVisible.value = true
}

const detailDrawerVisible = ref(false)
const currentDetailItem = ref<ProductLineItem | null>(null)
const handleDetail = (row: ProductLineItem) => {
  currentDetailItem.value = row
  detailDrawerVisible.value = true
}

// 5. 日志抽屉及增强筛选分析
const logsDrawerVisible = ref(false)
const currentLogItem = ref<ProductLineItem | null>(null)
const logCategoryFilter = ref('ALL')
const logSearchKeyword = ref('')
const logSortOrder = ref<'desc' | 'asc'>('desc')

const handleViewLogs = (row: ProductLineItem) => {
  currentLogItem.value = row
  logCategoryFilter.value = 'ALL'
  logSearchKeyword.value = ''
  logSortOrder.value = 'desc'
  logsDrawerVisible.value = true
}

const currentFilteredLogs = computed(() => {
  if (!currentLogItem.value || !currentLogItem.value.logs) return []
  let list = [...currentLogItem.value.logs]

  // 分类筛选
  if (logCategoryFilter.value !== 'ALL') {
    if (logCategoryFilter.value === 'addTeam') {
      list = list.filter(l => l.actionType === 'addTeam' || l.action.includes('增补'))
    } else if (logCategoryFilter.value === 'status') {
      list = list.filter(l => l.actionType === 'status' || l.action.includes('状态') || l.action.includes('启用') || l.action.includes('关闭'))
    } else if (logCategoryFilter.value === 'platform_edit') {
      list = list.filter(l => l.actionType === 'platform' || l.actionType === 'edit' || l.action.includes('平台') || l.action.includes('规划') || l.action.includes('编辑'))
    } else if (logCategoryFilter.value === 'leader_member') {
      list = list.filter(l => l.actionType === 'leader' || l.actionType === 'member' || l.action.includes('人员') || l.action.includes('成员') || l.action.includes('负责人'))
    } else if (logCategoryFilter.value === 'create') {
      list = list.filter(l => l.actionType === 'create' || l.action.includes('创建'))
    }
  }

  // 关键词过滤
  if (logSearchKeyword.value.trim()) {
    const kw = logSearchKeyword.value.trim().toLowerCase()
    list = list.filter(l =>
      (l.action && l.action.toLowerCase().includes(kw)) ||
      (l.detail && l.detail.toLowerCase().includes(kw)) ||
      (l.operator && l.operator.toLowerCase().includes(kw)) ||
      (l.operatorRole && l.operatorRole.toLowerCase().includes(kw)) ||
      (l.batchNo && l.batchNo.toLowerCase().includes(kw)) ||
      (l.diffs && l.diffs.some(d => d.field.toLowerCase().includes(kw) || d.oldVal.toLowerCase().includes(kw) || d.newVal.toLowerCase().includes(kw)))
    )
  }

  // 时间排序
  list.sort((a, b) => {
    const timeA = new Date(a.time).getTime() || 0
    const timeB = new Date(b.time).getTime() || 0
    return logSortOrder.value === 'desc' ? timeB - timeA : timeA - timeB
  })

  return list
})

const getLogActionBadge = (log: LogItem) => {
  if (log.actionType === 'create' || log.action.includes('创建')) {
    return { text: '创建立项', icon: 'Plus', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' }
  }
  if (log.actionType === 'addTeam' || log.action.includes('增补')) {
    return { text: '增补团队', icon: 'Connection', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' }
  }
  if (log.action.includes('关闭')) {
    return { text: '状态关闭', icon: 'CircleCloseFilled', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
  }
  if (log.action.includes('启用') || log.action.includes('恢复')) {
    return { text: '状态启用', icon: 'CircleCheckFilled', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' }
  }
  if (log.actionType === 'platform' || log.action.includes('平台')) {
    return { text: '平台矩阵', icon: 'Connection', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' }
  }
  if (log.actionType === 'leader' || log.action.includes('负责人')) {
    return { text: '负责人变更', icon: 'Avatar', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' }
  }
  if (log.actionType === 'member' || log.action.includes('成员')) {
    return { text: '成员调整', icon: 'UserFilled', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' }
  }
  if (log.actionType === 'edit' || log.action.includes('规划') || log.action.includes('编辑')) {
    return { text: '规划修订', icon: 'EditPen', color: '#d97706', bg: '#fffbeb', border: '#fde68a' }
  }
  return { text: '业务记录', icon: 'InfoFilled', color: '#475569', bg: '#f8fafc', border: '#e2e8f0' }
}

const handleExportLogs = () => {
  ElMessage.success(`产品线【${currentLogItem.value?.category}】的 ${currentFilteredLogs.value.length} 条操作变更日志已成功导出为电子存根！`)
}

const handleResetLogFilters = () => {
  logCategoryFilter.value = 'ALL'
  logSearchKeyword.value = ''
  logSortOrder.value = 'desc'
}

// 6. 状态编辑对话框管理 (在列表操作列独立编辑状态)
const statusDialogVisible = ref(false)
const currentStatusRow = ref<ProductLineItem | null>(null)
const statusSaving = ref(false)
const statusForm = reactive({
  status: '正常' as '正常' | '关闭',
  date: '',
  reason: ''
})

const handleOpenStatusDialog = (row: ProductLineItem) => {
  currentStatusRow.value = row
  // ★ 业务规则约束：当前为正常的只可以关闭；当前为关闭的只可以启用 (正常)
  statusForm.status = row.status === '正常' ? '关闭' : '正常'
  statusForm.date = new Date().toISOString().slice(0, 10)
  statusForm.reason = ''
  statusDialogVisible.value = true
}

const handleSaveStatus = () => {
  if (!currentStatusRow.value) return
  const row = currentStatusRow.value
  // ★ 强制约束：当前为正常只可关闭，当前为关闭只可启用
  const targetStatus: '正常' | '关闭' = row.status === '正常' ? '关闭' : '正常'

  statusSaving.value = true
  setTimeout(() => {
    statusSaving.value = false
    row.status = targetStatus
    if (targetStatus === '关闭') {
      row.closeDate = statusForm.date || new Date().toISOString().slice(0, 10)
      row.logs.unshift({
        id: 'log-' + Date.now(),
        time: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 8),
        action: '状态变更 - 关闭',
        actionType: 'status',
        detail: `产品线因业务调整执行关闭归档流程，终止新增排产与渠道调拨${statusForm.reason ? `。变更原因：<b>${statusForm.reason}</b>` : ''}`,
        operator: '当前操作用户',
        operatorRole: '品类运营主管',
        ip: '192.168.1.108',
        batchNo: `#LOG-${row.code}-${Date.now().toString().slice(-4)}`,
        diffs: [
          { field: '运行状态', oldVal: '正常运行', newVal: '已关闭 (停用)' },
          { field: '关闭生效日期', oldVal: '无', newVal: row.closeDate }
        ],
        type: 'danger'
      })
      ElMessage.warning(`产品线【${row.category}】已关闭停用`)
    } else {
      row.closeDate = ''
      row.enableDate = statusForm.date || row.enableDate || new Date().toISOString().slice(0, 10)
      row.logs.unshift({
        id: 'log-' + Date.now(),
        time: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 8),
        action: '状态变更 - 重新启用',
        actionType: 'status',
        detail: `产品线解除关闭，恢复全渠道正常运行与业务排产${statusForm.reason ? `。启用说明：<b>${statusForm.reason}</b>` : ''}`,
        operator: '当前操作用户',
        operatorRole: '品类运营总监',
        ip: '192.168.1.108',
        batchNo: `#LOG-${row.code}-${Date.now().toString().slice(-4)}`,
        diffs: [
          { field: '运行状态', oldVal: '已关闭', newVal: '正常运行' },
          { field: '重启生效日期', oldVal: '-', newVal: row.enableDate }
        ],
        type: 'success'
      })
      ElMessage.success(`产品线【${row.category}】已恢复启用`)
    }
    statusDialogVisible.value = false
  }, 250)
}

// 6. 展开行中针对某一个团队进行编辑与删除
const singleTeamDialogVisible = ref(false)
const editingTeamContext = reactive<{
  row: ProductLineItem | null
  teamIndex: number
}>({
  row: null,
  teamIndex: -1
})

const singleTeamForm = reactive<{
  name: string
  platform: string
  lineLeader: string
  status: '启用' | '关闭'
  members: string[]
}>({
  name: '',
  platform: 'Amazon',
  lineLeader: '',
  status: '启用',
  members: []
})

// 确保 row.teams 存在
const ensureRowTeams = (row: ProductLineItem) => {
  if (!row.teams || !row.teams.length) {
    const defaultPf = (row.platforms && row.platforms[0]?.platform) || 'Amazon'
    row.teams = [{
      id: 'team-' + Date.now(),
      name: row.teamName || '团队 1',
      platform: defaultPf,
      createDate: row.createDate || new Date().toISOString().split('T')[0],
      teamLeader: row.teamLeader || '',
      lineLeader: row.lineLeader || '',
      members: Array.isArray(row.teamMembers) ? [...row.teamMembers] : [],
      status: '启用'
    }]
  }
}

// 同步汇总字段给主表格行
const syncRowSummary = (row: ProductLineItem) => {
  if (!row.teams || !row.teams.length) return
  row.teamName = row.teams.map((t, idx) => t.name || ('团队 ' + (idx + 1))).join(', ')
  row.lineLeader = row.teams.map(t => t.lineLeader).filter(Boolean).join(', ')
  
  const allMembers = new Set<string>()
  row.teams.forEach(t => (t.members || []).forEach(m => allMembers.add(m)))
  row.teamMembers = Array.from(allMembers)
}

// 打开编辑团队弹窗
const handleEditSingleTeam = (row: ProductLineItem, team: TeamItem, tIdx: number) => {
  ensureRowTeams(row)
  editingTeamContext.row = row
  editingTeamContext.teamIndex = tIdx

  const curTeam = row.teams[tIdx] || team
  const defaultPf = (row.platforms && row.platforms[0]?.platform) || 'Amazon'
  singleTeamForm.name = curTeam.name || ('团队 ' + (tIdx + 1))
  singleTeamForm.platform = curTeam.platform || defaultPf
  singleTeamForm.lineLeader = curTeam.lineLeader || ''
  singleTeamForm.status = curTeam.status || '启用'
  singleTeamForm.members = curTeam.members ? curTeam.members.filter((m: string) => m !== (curTeam.lineLeader || '')) : []

  singleTeamDialogVisible.value = true
}

// 保存团队编辑
const handleSaveSingleTeam = () => {
  const { row, teamIndex } = editingTeamContext
  if (!row || teamIndex < 0) return

  if (!singleTeamForm.name.trim()) {
    ElMessage.warning('请输入业务团队名称')
    return
  }

  ensureRowTeams(row)
  const targetTeam = row.teams[teamIndex]
  if (!targetTeam) return

  const oldName = targetTeam.name
  const oldLeader = targetTeam.lineLeader

  targetTeam.name = singleTeamForm.name.trim()
  targetTeam.platform = singleTeamForm.platform
  targetTeam.lineLeader = singleTeamForm.lineLeader
  targetTeam.status = singleTeamForm.status
  targetTeam.members = [...singleTeamForm.members]

  // 保持团队成员中不包含团队负责人
  if (targetTeam.lineLeader) {
    targetTeam.members = targetTeam.members.filter(m => m !== targetTeam.lineLeader)
  }

  syncRowSummary(row)

  if (!row.logs) row.logs = []
  row.logs.unshift({
    time: new Date().toLocaleString(),
    action: '修改业务团队配置',
    detail: `修改了【${targetTeam.platform}】团队【${targetTeam.name}】（负责人: ${oldLeader || '-'} -> ${targetTeam.lineLeader || '-'}，成员共 ${targetTeam.members.length} 人）`,
    operator: '当前操作员',
    type: 'primary'
  })

  singleTeamDialogVisible.value = false
  ElMessage.success(`业务团队【${targetTeam.name}】配置已成功保存！`)
}

// 删除某一个团队
const handleDeleteSingleTeam = (row: ProductLineItem, tIdx: number) => {
  ensureRowTeams(row)
  if (row.teams.length <= 1) {
    ElMessage.warning('该产品线至少保留一个业务团队，不可删除最后一个团队')
    return
  }

  const removed = row.teams.splice(tIdx, 1)[0]
  syncRowSummary(row)

  if (!row.logs) row.logs = []
  row.logs.unshift({
    time: new Date().toLocaleString(),
    action: '删除业务团队',
    detail: `删除了业务团队【${removed.name || ('团队 ' + (tIdx + 1))}】（原负责人: ${removed.lineLeader || '-'}）`,
    operator: '当前操作员',
    type: 'warning'
  })

  ElMessage.success(`已删除业务团队【${removed.name || ('团队 ' + (tIdx + 1))}】`)
}
</script>

<style scoped lang="scss">
.product-line-page {
  padding: 16px 20px 48px;
  background-color: #f5f7fa;
  min-height: 100%;
  box-sizing: border-box;
}

/* 颜色辅助类 */
.text-blue { color: #2563eb; }
.text-green { color: #16a34a; }
.text-red { color: #dc2626; }
.text-purple { color: #9333ea; }
.text-amber { color: #d97706; }

/* 1. 检索卡片 */
.filter-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 16px 20px 6px;
  margin-bottom: 14px;
  border: 1px solid #edf0f5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);

  .filter-form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .w-180 { width: 170px; }
    .w-160 { width: 150px; }
    .w-170 { width: 160px; }
    .w-120 { width: 120px; }

    .leader-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }



    .filter-actions {
      margin-left: auto;
    }
  }
}

/* 3. 数据表格卡片 */
.table-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 18px 20px;
  border: 1px solid #edf0f5;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

  .table-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .btn-create {
        font-weight: 500;
        letter-spacing: 0.3px;
        box-shadow: 0 2px 6px rgba(59, 130, 246, 0.25);
      }

      .selection-tip {
        font-size: 13px;
        color: #64748b;
        background: #f1f5f9;
        padding: 4px 10px;
        border-radius: 6px;
        b {
          color: #2563eb;
        }
      }
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .table-container {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #f1f5f9;
  }
}

/* 表格内元素样式 */
.index-num {
  font-family: monospace;
  color: #94a3b8;
  font-weight: 500;
}

.code-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #f1f5f9;
  color: #1e293b;
  font-family: 'SFMono-Regular', Consolas, Menlo, monospace;
  font-weight: 600;
  border-radius: 4px;
  font-size: 13px;
  border: 1px solid #e2e8f0;
}

.code-badge-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 1px 4px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: #eff6ff;
    .copy-icon {
      opacity: 1;
      color: #2563eb;
    }
  }

  .copy-icon {
    font-size: 13px;
    color: #94a3b8;
    opacity: 0.6;
    transition: all 0.2s;
  }
}

.category-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .category-name {
    font-weight: 600;
    color: #1e293b;
    font-size: 14px;

    &.clickable {
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: #2563eb;
        text-decoration: underline;
      }
    }
  }

  .category-short-tag {
    font-size: 11px;
    font-family: monospace;
    font-weight: 700;
    background: #f1f5f9;
    color: #475569;
    padding: 1px 6px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }
}

.short-code-tag {
  font-family: monospace;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #475569;
}

.header-with-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  .info-icon {
    font-size: 14px;
    cursor: pointer;
  }
}

.team-leader-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #fde68a;
  padding: 3px 10px;
  border-radius: 20px;
  color: #b45309;
  font-weight: 600;
  font-size: 13px;
  box-shadow: 0 1px 3px rgba(217, 119, 6, 0.08);

  .leader-avatar-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #f59e0b;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
  }
}

/* 运营矩阵: 平台→产品线负责人→团队负责人→团队成员 一一对应 */
.ops-matrix-cell {
  width: 100%;
  font-size: 12px;

  .ops-matrix-header {
    display: grid;
    grid-template-columns: 88px 108px 108px 1fr;
    gap: 0;
    padding: 3px 6px 4px;
    background: #f1f5f9;
    border-radius: 4px 4px 0 0;
    border: 1px solid #e2e8f0;
    border-bottom: none;
    margin-bottom: 0;

    .col-lbl {
      font-size: 11px;
      font-weight: 600;
      color: #94a3b8;
      letter-spacing: 0.3px;
    }
  }

  .ops-matrix-row {
    display: grid;
    grid-template-columns: 88px 108px 108px 1fr;
    gap: 0;
    align-items: center;
    min-height: 34px;
    padding: 4px 6px;
    border: 1px solid #e2e8f0;
    border-top: none;
    transition: background 0.15s;

    &:last-child {
      border-radius: 0 0 4px 4px;
    }

    &.border-row {
      border-top: 1px dashed #e2e8f0;
    }

    &:hover {
      background: #f8fafc;
    }

    .platform-pill {
      display: inline-flex;
      align-items: center;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 10px;
      background: #e0e7ff;
      color: #4338ca;
      letter-spacing: 0.3px;
      white-space: nowrap;

      &.pf-amazon   { background: #fff7ed; color: #c2410c; }
      &.pf-walmart  { background: #eff6ff; color: #1d4ed8; }
      &.pf-tiktok   { background: #fdf2f8; color: #9d174d; }
      &.pf-ebay     { background: #f0fdf4; color: #166534; }
      &.pf-shopee   { background: #fff7ed; color: #ea580c; }
      &.pf-temu     { background: #fdf4ff; color: #7e22ce; }
      &.pf-aliexpress { background: #fef2f2; color: #dc2626; }
    }

    .lineleader-name {
      font-weight: 600;
      color: #d97706;
      font-size: 12px;
      padding-left: 2px;
    }

    .teamleader-tag {
      font-weight: 600;
      font-size: 11px;
    }

    .col-members {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
      padding-left: 4px;

      .member-chip {
        font-size: 11px;
        color: #475569;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 1px 5px;
        border-radius: 4px;
        white-space: nowrap;

        &.is-leader {
          background: #eff6ff;
          color: #1d4ed8;
          border-color: #bfdbfe;
          font-weight: 600;
        }

        &.more-chip {
          background: #f1f5f9;
          color: #2563eb;
          font-weight: 600;
          cursor: pointer;
          border-color: #dbeafe;

          &:hover { background: #eff6ff; }
        }
      }
    }
  }
}

/* 展开行全景面板样式 */
.expand-teams-panel {
  background: #f8fafc;
  border-radius: 8px;
  padding: 14px 18px;
  margin: 6px 10px;
  border: 1px solid #e2e8f0;

  .expand-header-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid #edf2f7;
    margin-bottom: 12px;

    .expand-left {
      display: flex;
      align-items: center;
      gap: 10px;

      .expand-tag-title {
        font-size: 12px;
        font-weight: 700;
        color: #2563eb;
        background: #eff6ff;
        padding: 2px 8px;
        border-radius: 4px;
        border: 1px solid #bfdbfe;
      }

      .expand-category-name {
        font-size: 14px;
        font-weight: 700;
        color: #0f172a;
      }

      .expand-leader-text {
        font-size: 13px;
        color: #475569;
        margin-left: 6px;
        display: inline-flex;
        align-items: center;
        b {
          color: #b45309;
          margin-left: 3px;
        }
      }
    }

    .expand-team-count-badge {
      font-size: 12px;
      color: #64748b;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      padding: 2px 10px;
      border-radius: 12px;
      font-weight: 500;
    }
  }

  .expand-team-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;

    .expand-team-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px 14px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);

      .card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 8px;
        border-bottom: 1px solid #f1f5f9;
        margin-bottom: 8px;

        .team-title-row {
          display: flex;
          align-items: center;
          gap: 6px;

          .team-order-badge {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #2563eb;
            color: #ffffff;
            font-size: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
          }

          .team-title-name {
            font-size: 13px;
            font-weight: 700;
            color: #1e293b;
          }
        }
      }

      .card-meta-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 12px;

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;

          .meta-lbl {
            color: #64748b;
          }
          .meta-val {
            color: #0f172a;
          }
        }
      }

      .card-members-section {
        .members-lbl {
          font-size: 11px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .members-chip-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;

          .expand-member-chip {
            font-size: 11px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            color: #334155;
            padding: 1px 6px;
            border-radius: 4px;
            display: inline-flex;
            align-items: center;
            gap: 3px;

            &.is-leader {
              background: #fffbeb;
              border-color: #fde68a;
              color: #b45309;
              font-weight: 600;
            }

            .tag-role-hint {
              font-size: 9px;
              background: rgba(245, 158, 11, 0.15);
              color: #d97706;
              padding: 0 3px;
              border-radius: 2px;
            }
          }
        }
      }

      .card-footer-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px dashed #f1f5f9;

        .action-divider {
          width: 1px;
          height: 12px;
          background: #e2e8f0;
        }

        .el-button {
          font-size: 12px;
          padding: 0 4px;
        }
      }
    }
  }
}

/* 展开行单独编辑团队对话框 */
.single-team-dialog {
  :deep(.el-dialog__header) {
    margin-right: 0;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
  }
  :deep(.el-dialog__body) {
    padding: 20px;
  }
  :deep(.el-dialog__footer) {
    padding: 12px 20px;
    border-top: 1px solid #f1f5f9;
  }

  .single-team-header-hint {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;

    .hint-line {
      display: flex;
      align-items: center;
      gap: 8px;

      .hint-lbl {
        color: #64748b;
      }
      .hint-val {
        color: #0f172a;
      }
    }
  }

  .field-sub-hint {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 4px;
  }
}

/* 状态微胶囊 */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  &.status-active {
    background-color: #ecfdf5;
    color: #059669;
    .status-dot {
      background-color: #10b981;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    }
  }

  &.status-closed {
    background-color: #fef2f2;
    color: #dc2626;
    .status-dot {
      background-color: #ef4444;
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
    }
  }
}

.action-btn-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

/* 分页栏 */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;

  .page-info {
    font-size: 13px;
    color: #64748b;

    .total-highlight {
      font-weight: 600;
      color: #0f172a;
    }
  }
}

/* 列设置浮窗 */
.column-setting-title {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
}
.column-setting-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 4. 现代化工作台抽屉：模块化卡片流 + 多团队管理 */
:deep(.edit-product-line-drawer),
:deep(.product-line-modern-drawer) {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 16px 24px;
    border-bottom: 1px solid #f1f5f9;
    background-color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
  }

  .el-drawer__body {
    padding: 0;
    background-color: #f8fafc;
  }

  .el-drawer__footer {
    padding: 14px 24px;
    border-top: 1px solid #f1f5f9;
    background-color: #ffffff;
  }

  .modern-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .drawer-main-title {
        font-size: 17px;
        font-weight: 700;
        color: #0f172a;
      }

      .code-badge {
        font-size: 12px;
        font-family: monospace;
        background: #f1f5f9;
        color: #475569;
        padding: 2px 8px;
        border-radius: 4px;
        border: 1px solid #e2e8f0;
        font-weight: 600;

        &.code-badge-pending {
          background: #eff6ff;
          color: #2563eb;
          border-color: #bfdbfe;
          font-family: inherit;
        }
      }
    }

    .header-right-hint {
      font-size: 12px;
      color: #94a3b8;
    }
  }

  .modern-drawer-body,
  .drawer-scroll-body {
    padding: 20px 24px;
    max-height: calc(100vh - 126px);
    overflow-y: auto;

    .modern-drawer-form,
    .modern-form-workflow {
      .form-card-box {
        background: #ffffff;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        overflow: hidden;

        .card-header {
          padding: 14px 20px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;

          &.space-between {
            justify-content: space-between;
          }

          .header-left-group {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .header-indicator {
            width: 4px;
            height: 16px;
            border-radius: 2px;

            &.bg-blue {
              background: #2563eb;
            }

            &.bg-purple {
              background: #7c3aed;
            }

            &.bg-gray {
              background: #64748b;
            }
          }

          .header-title-group {
            display: flex;
            flex-direction: column;
            gap: 2px;

            .card-title {
              font-size: 14px;
              font-weight: 700;
              color: #1e293b;
              line-height: 1.3;
            }

            .card-subtitle {
              font-size: 12px;
              color: #64748b;
              line-height: 1.3;
            }
          }

          .count-badge {
            font-size: 12px;
            color: #7c3aed;
            background: #f5f3ff;
            border: 1px solid #ddd6fe;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: 600;
            margin-left: 6px;
          }
        }

        .card-content {
          padding: 18px 20px;

          &.readonly-basic-info-box {
            background: #f8fafc;
            padding: 16px 20px;

            .readonly-grid {
              display: grid;
              grid-template-columns: 140px 1fr 140px;
              gap: 16px;

              .readonly-col {
                display: flex;
                flex-direction: column;
                gap: 6px;

                .readonly-label {
                  font-size: 12px;
                  color: #64748b;
                  font-weight: 500;
                }

                .readonly-value {
                  display: flex;
                  align-items: center;

                  .category-code-badge {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 13px;
                    font-weight: 700;
                    color: #2563eb;
                    background: #eff6ff;
                    border: 1px solid #bfdbfe;
                    padding: 2px 10px;
                    border-radius: 6px;
                  }

                  .category-name-text {
                    font-size: 15px;
                    font-weight: 700;
                    color: #0f172a;
                  }

                  .shortcode-tag {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 13px;
                    font-weight: 700;
                    color: #0d9488;
                    background: #f0fdfa;
                    border: 1px solid #ccfbf1;
                    padding: 2px 8px;
                    border-radius: 4px;
                  }
                }
              }
            }

            .readonly-desc-row {
              display: flex;
              flex-direction: column;
              gap: 4px;
              padding-top: 12px;
              border-top: 1px solid #e2e8f0;

              .readonly-label {
                font-size: 12px;
                color: #64748b;
                font-weight: 500;
              }

              .readonly-desc-text {
                font-size: 13px;
                color: #334155;
                line-height: 1.5;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                padding: 8px 12px;
              }
            }
          }

          .matrix-relation-banner {
            display: flex;
            align-items: center;
            gap: 12px;
            background: #faf5ff;
            border: 1px solid #f3e8ff;
            padding: 10px 14px;
            border-radius: 8px;
            margin-bottom: 14px;

            .banner-title {
              display: flex;
              align-items: center;
              font-size: 12px;
              font-weight: 700;
              color: #6b21a8;
              white-space: nowrap;
            }

            .banner-chain {
              display: flex;
              align-items: center;
              gap: 8px;
              flex-wrap: wrap;

              .chain-badge {
                font-size: 12px;
                padding: 2px 10px;
                border-radius: 20px;
                font-weight: 600;

                &.pf-badge {
                  background: #e0f2fe;
                  color: #0369a1;
                  border: 1px solid #bae6fd;
                }

                &.leader-badge {
                  background: #ede9fe;
                  color: #6d28d9;
                  border: 1px solid #ddd6fe;
                }

                &.team-badge {
                  background: #f0fdf4;
                  color: #15803d;
                  border: 1px solid #bbf7d0;
                }
              }

              .chain-arrow {
                font-size: 12px;
                color: #a855f7;
              }
            }
          }

          .platform-hierarchy-stack {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .platform-hierarchy-card {
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-radius: 10px;
              box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
              overflow: hidden;
              transition: all 0.2s ease;

              &:hover {
                border-color: #94a3b8;
                box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
              }

              .platform-card-header {
                background: linear-gradient(to right, #f8fafc, #f1f5f9);
                padding: 14px 18px;
                border-bottom: 1px solid #e2e8f0;

                .pf-header-main {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 12px;

                  .pf-identity {
                    display: flex;
                    align-items: center;
                    gap: 10px;

                    .pf-index-tag {
                      background: #2563eb;
                      color: #ffffff;
                      font-size: 11px;
                      font-weight: 700;
                      padding: 2px 8px;
                      border-radius: 4px;
                      letter-spacing: 0.5px;
                    }

                    .pf-name-text {
                      font-size: 15px;
                      font-weight: 700;
                      color: #0f172a;
                    }

                    .pf-teams-count {
                      font-size: 12px;
                      background: #f5f3ff;
                      color: #7c3aed;
                      border: 1px solid #ddd6fe;
                      padding: 2px 8px;
                      border-radius: 12px;
                      font-weight: 500;
                    }
                  }

                  .btn-remove-pf {
                    font-size: 12px;
                  }
                }

                .pf-governance-row {
                  background: #ffffff;
                  padding: 12px 14px;
                  border-radius: 8px;
                  border: 1px solid #e2e8f0;

                  .leader-select-input {
                    :deep(.el-input__wrapper) {
                      box-shadow: 0 0 0 1px #cbd5e1 inset;
                      &:hover {
                        box-shadow: 0 0 0 1px #7c3aed inset;
                      }
                    }
                  }

                  .pf-leader-role-tip {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    color: #475569;
                    margin-top: 8px;
                    padding-top: 8px;
                    border-top: 1px dashed #f1f5f9;

                    .tip-dot {
                      width: 6px;
                      height: 6px;
                      border-radius: 50%;
                      background: #3b82f6;
                      display: inline-block;
                    }

                    b {
                      color: #1e293b;
                    }
                  }
                }
              }

              .platform-teams-zone {
                padding: 14px 18px;
                background: #fafbfc;

                .teams-zone-header {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 12px;

                  .zone-title-box {
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    .zone-tree-icon {
                      font-size: 16px;
                      color: #7c3aed;
                      font-weight: 900;
                      line-height: 1;
                    }

                    .zone-title {
                      font-size: 13px;
                      font-weight: 700;
                      color: #334155;
                    }

                    .zone-sub {
                      font-size: 12px;
                      color: #94a3b8;
                    }
                  }

                  .btn-add-team-link {
                    font-weight: 600;
                    font-size: 12px;
                  }
                }

                .subteam-cards-list {
                  display: flex;
                  flex-direction: column;
                  gap: 12px;

                  .subteam-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 14px 16px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
                    border-left: 3px solid #7c3aed;
                    transition: all 0.2s;

                    &:hover {
                      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                      border-color: #cbd5e1;
                      border-left-color: #6d28d9;
                    }

                    .subteam-card-head {
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      margin-bottom: 12px;
                      padding-bottom: 8px;
                      border-bottom: 1px solid #f8fafc;

                      .subteam-head-left {
                        display: flex;
                        align-items: center;
                        gap: 8px;

                        .subteam-seq-badge {
                          width: 20px;
                          height: 20px;
                          border-radius: 50%;
                          background: #f5f3ff;
                          color: #7c3aed;
                          border: 1px solid #ddd6fe;
                          font-size: 11px;
                          font-weight: 700;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                        }

                        .subteam-name-input {
                          width: 180px;
                          font-weight: 600;
                        }

                        .subteam-pf-pill {
                          font-size: 11px;
                          background: #eff6ff;
                          color: #2563eb;
                          border: 1px solid #bfdbfe;
                          padding: 1px 8px;
                          border-radius: 10px;
                          font-weight: 500;
                        }
                      }
                    }

                    .subteam-card-body {
                      .field-sub-hint {
                        font-size: 12px;
                        color: #94a3b8;
                        margin-top: 4px;
                      }
                    }
                  }
                }

                .empty-platform-teams {
                  padding: 20px;
                  text-align: center;
                  background: #ffffff;
                  border: 1px dashed #cbd5e1;
                  border-radius: 8px;

                  .empty-hint-text {
                    font-size: 13px;
                    color: #64748b;
                    margin-bottom: 10px;
                  }
                }
              }
            }

            .add-platform-action-box {
              border: 2px dashed #93c5fd;
              background: #f0f7ff;
              border-radius: 10px;
              padding: 14px 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              color: #2563eb;
              font-size: 14px;
              font-weight: 600;
              transition: all 0.2s;

              &:hover {
                border-color: #3b82f6;
                background: #e0f2fe;
              }
            }
          }
        }
      }
    }
  }

  .modern-drawer-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;

    .btn-save-primary {
      padding: 9px 24px;
      font-weight: 600;
    }
  }
}

.category-select-item,
.category-select-option,
.leader-select-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .category-code-text,
  .code-hint {
    font-family: monospace;
    color: #94a3b8;
    font-size: 12px;
  }
}

/* 5. 详情与日志抽屉 */
.detail-drawer-body {
  padding: 0 4px;

  .detail-header-card {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: 12px;
    padding: 20px;
    color: #ffffff;

    .detail-code-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;

      .code-title {
        font-family: monospace;
        font-size: 18px;
        font-weight: 700;
        color: #93c5fd;
      }
    }

    .detail-name-row {
      .name {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
      }
      .short-code {
        font-size: 13px;
        color: #94a3b8;
      }
    }
  }

  .leader-highlight-card {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 10px;
    padding: 16px;

    .highlight-title {
      font-size: 13px;
      font-weight: 700;
      color: #92400e;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 12px;
    }

    .highlight-content {
      display: flex;
      align-items: center;
      gap: 14px;

      .leader-avatar-circle {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: #f59e0b;
        color: #ffffff;
        font-size: 20px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
      }

      .leader-text-info {
        flex: 1;

        .name-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;

          .leader-name {
            font-size: 17px;
            font-weight: 700;
            color: #78350f;
          }
        }

        .desc-bar {
          font-size: 12px;
          color: #a16207;
        }
      }
    }
  }

  .team-matrix-card {
    .team-block {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      margin-top: 10px;

      .team-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        padding-bottom: 6px;
        border-bottom: 1px dashed #cbd5e1;

        .team-name {
          font-weight: 700;
          color: #1e293b;
        }
      }

      .team-info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;

        .info-row {
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;

          .label { color: #64748b; }
          .val { color: #0f172a; }

          &.full-width {
            grid-column: span 2;
            display: block;
          }
        }
      }
    }
  }
}

.log-drawer-body {
  .log-header-badge {
    background: #f1f5f9;
    padding: 10px 14px;
    border-radius: 8px;
    color: #334155;
    font-size: 13px;
  }

  .log-item-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

    .log-action {
      font-weight: 700;
      font-size: 14px;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .log-detail {
      font-size: 13px;
      color: #475569;
      line-height: 1.5;
    }

    .log-operator {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 6px;
    }
  }
}

/* 6. 状态编辑弹窗样式 */
:deep(.status-edit-dialog) {
  border-radius: 12px;
  overflow: hidden;

  .el-dialog__header {
    margin-right: 0;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
    font-weight: 700;
  }

  .el-dialog__body {
    padding: 20px;
  }

  .status-product-summary-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px 16px;

    .summary-top {
      display: flex;
      align-items: center;
      gap: 10px;

      .code-badge {
        font-size: 13px;
        font-family: monospace;
        font-weight: 700;
        background: #e2e8f0;
        color: #334155;
        padding: 2px 8px;
        border-radius: 4px;
      }

      .category-title {
        font-size: 15px;
        font-weight: 700;
        color: #0f172a;
      }
    }

    .summary-status-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
      font-size: 13px;
      color: #64748b;
    }
  }

  .status-toggle-radios {
    width: 100%;
    display: flex;

    .el-radio-button {
      flex: 1;

      .el-radio-button__inner {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 16px;
        font-weight: 600;
      }
    }
  }
}

/* 优化版操作变更日志抽屉 */
:deep(.product-line-log-drawer) {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 16px 24px;
    border-bottom: 1px solid #f1f5f9;
  }

  .el-drawer__body {
    padding: 0;
    background: #f8fafc;
  }

  .el-drawer__footer {
    padding: 14px 24px;
    border-top: 1px solid #f1f5f9;
    background: #ffffff;
  }
}

.log-drawer-custom-header {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .header-main-title {
    display: flex;
    align-items: center;
    gap: 10px;

    .title-text {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }

    .audit-tag {
      font-weight: 500;
      border-radius: 4px;
    }
  }

  .header-sub-text {
    font-size: 12px;
    color: #64748b;
  }
}

.log-drawer-body {
  padding: 18px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .log-product-banner {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);

    .banner-left {
      display: flex;
      align-items: center;
      gap: 14px;

      .code-pill {
        font-family: 'JetBrains Mono', monospace;
        font-size: 15px;
        font-weight: 800;
        color: #2563eb;
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        padding: 4px 10px;
        border-radius: 6px;
      }

      .name-box {
        display: flex;
        flex-direction: column;
        gap: 3px;

        .category-name {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #64748b;

          .divider {
            color: #cbd5e1;
          }
        }
      }
    }

    .banner-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;

      .status-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: 20px;

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        &.chip-active {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
          .status-dot { background: #16a34a; }
        }

        &.chip-closed {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          .status-dot { background: #dc2626; }
        }
      }

      .total-logs-badge {
        font-size: 12px;
        color: #64748b;

        b {
          color: #2563eb;
          font-size: 13px;
        }
      }
    }
  }

  .log-toolbar-box {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);

    .filter-tabs-row {
      .custom-log-tabs {
        width: 100%;
        display: flex;

        :deep(.el-radio-button) {
          flex: 1;

          .el-radio-button__inner {
            width: 100%;
            padding: 7px 10px;
            font-size: 12px;
            border-color: #e2e8f0;
          }

          &.is-active .el-radio-button__inner {
            background-color: #2563eb;
            border-color: #2563eb;
            color: #ffffff;
            font-weight: 600;
          }
        }
      }
    }

    .search-sort-row {
      display: flex;
      align-items: center;
      gap: 10px;

      .log-search-input {
        flex: 1;
      }

      .action-btn-cluster {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
  }

  .log-timeline-container {
    max-height: calc(100vh - 280px);
    overflow-y: auto;
    padding: 6px 12px 24px 6px;

    .custom-audit-timeline {
      :deep(.el-timeline-item__node) {
        box-shadow: 0 0 0 2px #ffffff;
      }

      :deep(.el-timeline-item__tail) {
        border-left: 2px solid #e2e8f0;
      }

      .audit-timeline-node {
        padding-bottom: 20px;
      }
    }

    .audit-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px 18px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
      transition: all 0.2s ease;

      &:hover {
        border-color: #cbd5e1;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
        transform: translateY(-1px);
      }

      .audit-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        .header-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;

          .action-badge-tag {
            display: inline-flex;
            align-items: center;
            font-size: 11px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 4px;
            border: 1px solid;
          }

          .action-title {
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
          }

          .batch-no-tag {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            color: #64748b;
            background: #f1f5f9;
            padding: 1px 6px;
            border-radius: 3px;
          }
        }

        .header-right {
          .log-time-text {
            font-size: 12px;
            color: #94a3b8;
            font-family: 'JetBrains Mono', monospace;
          }
        }
      }

      .audit-card-detail {
        font-size: 13px;
        color: #334155;
        line-height: 1.6;
        word-break: break-word;

        b {
          color: #0f172a;
        }
      }

      .audit-diff-panel {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 10px 14px;
        margin-top: 10px;

        .diff-panel-title {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }

        .diff-grid {
          display: flex;
          flex-direction: column;
          gap: 6px;

          .diff-row-item {
            display: flex;
            align-items: center;
            font-size: 12px;

            .diff-field-name {
              width: 120px;
              color: #475569;
              font-weight: 600;
              flex-shrink: 0;
            }

            .diff-values {
              display: flex;
              align-items: center;
              gap: 8px;
              flex-wrap: wrap;

              .diff-old-val {
                color: #94a3b8;
                background: #f1f5f9;
                padding: 1px 8px;
                border-radius: 4px;
                text-decoration: line-through;
              }

              .diff-arrow {
                color: #94a3b8;
                font-size: 11px;
                display: flex;
                align-items: center;
              }

              .diff-new-val {
                color: #0f172a;
                background: #e0f2fe;
                font-weight: 600;
                padding: 1px 8px;
                border-radius: 4px;
              }
            }
          }
        }
      }

      .audit-card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid #f1f5f9;
        font-size: 12px;

        .operator-profile {
          display: flex;
          align-items: center;
          gap: 8px;

          .avatar-dot {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #eff6ff;
            color: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            border: 1px solid #bfdbfe;
          }

          .operator-name {
            font-weight: 600;
            color: #1e293b;
          }

          .operator-role-tag {
            color: #64748b;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 11px;
          }
        }

        .env-info {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          color: #94a3b8;

          .audit-status-tag {
            display: flex;
            align-items: center;
            color: #16a34a;
            font-weight: 500;
          }
        }
      }
    }
  }

  .log-empty-state {
    padding: 40px 0;
    background: #ffffff;
    border-radius: 10px;
    border: 1px dashed #cbd5e1;
    display: flex;
    justify-content: center;
  }
}

.log-drawer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .footer-tip {
    font-size: 12px;
    color: #94a3b8;
  }
}
</style>
