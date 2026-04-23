<template>
  <div class="page-container">
    <!-- 顶部状态待办统计 (卡片化) -->
    <div class="stat-tabs modern-card">
      <div class="stat-label">待办：</div>
      <div class="stat-items">
        <div 
          v-for="item in statTabs" 
          :key="item.label" 
          class="stat-item" 
          :class="{ active: activeStat === item.label }"
          @click="handleStatClick(item.label)"
        >
          {{ item.label }}<span class="count">{{ getStatCount(item.label) }}</span>
          <el-icon class="info-icon"><QuestionFilled /></el-icon>
        </div>
      </div>
    </div>

    <!-- 查询过滤区域 (紧凑对齐) -->
    <div class="search-section modern-card">
      <el-form :model="queryParams" inline size="small">
        <el-form-item>
          <el-select v-model="queryParams.dateType" style="width: 100px">
            <el-option label="立项日期" value="1" />
          </el-select>
          <el-date-picker
            v-model="queryParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 230px; margin-left: 8px"
          />
        </el-form-item>
        
        <el-form-item>
          <el-select v-model="queryParams.platform" placeholder="平台" clearable style="width: 100px">
            <el-option label="Amazon" value="Amazon" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryParams.category" placeholder="运营大类" clearable style="width: 110px">
            <el-option label="运动户外" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryParams.manager" placeholder="产品经理" clearable style="width: 100px">
            <el-option label="谢东桥" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryParams.progress" placeholder="进度" clearable style="width: 100px">
            <el-option label="待设计" value="待设计" />
            <el-option label="拿样中" value="拿样中" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryParams.proposalNo" placeholder="请输入内容" style="width: 210px">
            <template #prepend>
              <el-select v-model="queryParams.searchType" style="width: 85px">
                <el-option label="提案编号" value="1" />
              </el-select>
            </template>
            <template #suffix>
              <div class="input-inner-icons">
                <el-icon><Search /></el-icon>
                <el-divider direction="vertical" />
                <el-icon><Menu /></el-icon>
              </div>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="resetQuery" class="btn-ghost">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 (呼吸感优化) -->
    <div class="table-container modern-card">
      <div class="table-toolbar">
        <div class="left">
          <el-button type="primary" size="small" icon="Plus">创建提案</el-button>
        </div>
        <div class="right">
          <div class="tool-icons">
            <el-icon><RefreshRight /></el-icon>
            <el-icon><Download /></el-icon>
            <el-icon><Operation /></el-icon>
          </div>
        </div>
      </div>

      <el-table 
        :data="tableData" 
        :height="tableHeight"
        size="small" 
        header-cell-class-name="modern-header"
        row-class-name="modern-row"
        highlight-current-row
        row-key="proposalNo"
        :expand-row-keys="expandedRowKeys"
        @expand-change="handleExpandChange"
      >
        <el-table-column type="index" label="#" width="45" align="center" fixed />
        <el-table-column type="expand" width="20" fixed>
          <template #default="{ row }">
            <div class="expand-wrapper">
              <!-- 左侧组合列：统计 + 待办 -->
              <div class="expand-column-left">
                <!-- 统计板块 -->
                <div class="expand-section">
                  <div class="section-title">提案概况</div>
                  <div class="info-list">
                    <div class="info-item">任务发布：<span class="val">共【0/1/1】轮</span> <el-icon class="hint-icon"><QuestionFilled /></el-icon></div>
                    <div class="info-item">开模次数：<span class="val">共【0】次</span></div>
                    <div class="info-item">定品申请：<span class="val">共【1】轮</span></div>
                    <div class="info-item">提案用时：<span class="val">共【7(0)】天</span> <el-icon class="hint-icon"><QuestionFilled /></el-icon></div>
                    <div class="info-item">样品数量：<span class="val-link">共【1/1/0】件</span> <el-icon class="hint-icon"><QuestionFilled /></el-icon></div>
                    <div class="info-item">研发投入：<span class="val">共【0】元</span></div>
                  </div>
                </div>

                <!-- 待办板块 -->
                <div class="expand-section">
                  <div class="section-title">待办流程</div>
                  <div class="todo-pipeline">
                    <!-- 阶段 1: 拿样 -->
                    <div class="pipeline-node">
                      <div class="node-tag">拿样阶段</div>
                      <div class="node-content">
                        <div class="info-item">任务待发：<el-link type="primary" :underline="false">0</el-link></div>
                        <div class="info-item">定制反馈：<el-link type="primary" :underline="false">0</el-link></div>
                      </div>
                    </div>
                    <!-- 阶段 2: 反馈 -->
                    <div class="pipeline-node">
                      <div class="node-tag">反馈阶段</div>
                      <div class="node-content">
                        <div class="info-item">样品反馈：<el-link type="primary" :underline="false">0</el-link></div>
                        <div class="info-item">样品待还：<el-link type="primary" :underline="false">0</el-link></div>
                      </div>
                    </div>
                    <!-- 阶段 3: 定品 -->
                    <div class="pipeline-node">
                      <div class="node-tag">定品阶段</div>
                      <div class="node-content">
                        <div class="info-item">信息补充：<el-link type="primary" :underline="false">0</el-link></div>
                        <div class="info-item">首单需求：<span class="status-text">已确认</span> <el-icon class="hint-icon"><QuestionFilled /></el-icon></div>
                        <div class="info-item">定品待申：<el-link type="primary" :underline="false">0</el-link></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 协作图表板块 -->
              <div class="expand-section chart-section">
                <div class="section-title">协作进度</div>
                <div class="chart-container">
                  <div class="chart-legend">
                    <span class="leg-item"><i class="dot blue"></i>时长</span>
                    <span class="leg-item"><i class="dot green"></i>样品数</span>
                    <span class="leg-item"><i class="dot yellow"></i>费用</span>
                  </div>
                  <div class="mock-chart">
                    <!-- 模拟 Y 轴 -->
                    <div class="y-axis"><span>15</span><span>12</span><span>9</span><span>6</span><span>3</span><span>0</span></div>
                    <!-- 模拟绘图区 -->
                    <div class="chart-area">
                      <div class="grid-line"></div><div class="grid-line"></div><div class="grid-line"></div><div class="grid-line"></div><div class="grid-line"></div>
                      <div class="bars">
                        <!-- 节点 1 -->
                        <div class="bar-group" style="left: 10%">
                          <div class="bars-inner">
                            <div class="bar-item"><div class="bar-val">2d</div><div class="bar blue" style="height: 15%"></div></div>
                            <div class="bar-item"><div class="bar-val">3p</div><div class="bar green" style="height: 20%"></div></div>
                            <div class="bar-item"><div class="bar-val">¥0.1</div><div class="bar yellow" style="height: 10%"></div></div>
                          </div>
                          <div class="label-bottom">第【1】轮<br/>【定制拿样】</div>
                        </div>
                        <!-- 节点 2 -->
                        <div class="bar-group" style="left: 35%">
                          <div class="bars-inner">
                            <div class="bar-item"><div class="bar-val">5d</div><div class="bar blue" style="height: 35%"></div></div>
                            <div class="bar-item"><div class="bar-val">8p</div><div class="bar green" style="height: 45%"></div></div>
                            <div class="bar-item"><div class="bar-val">¥0.3</div><div class="bar yellow" style="height: 30%"></div></div>
                          </div>
                          <div class="label-bottom">第【1】轮<br/>【样品反馈】</div>
                        </div>
                        <!-- 节点 3 -->
                        <div class="bar-group" style="left: 60%">
                          <div class="bars-inner">
                            <div class="bar-item"><div class="bar-val">3d</div><div class="bar blue" style="height: 20%"></div></div>
                            <div class="bar-item"><div class="bar-val">2p</div><div class="bar green" style="height: 15%"></div></div>
                            <div class="bar-item"><div class="bar-val">¥0.1</div><div class="bar yellow" style="height: 10%"></div></div>
                          </div>
                          <div class="label-bottom">第【2】轮<br/>【需求确认】</div>
                        </div>
                        <!-- 节点 4 -->
                        <div class="bar-group" style="left: 85%">
                          <div class="bars-inner">
                            <div class="bar-item"><div class="bar-val">12d</div><div class="bar blue" style="height: 75%"></div></div>
                            <div class="bar-item"><div class="bar-val">18p</div><div class="bar green" style="height: 90%"></div></div>
                            <div class="bar-item"><div class="bar-val">¥0.8</div><div class="bar yellow" style="height: 80%"></div></div>
                          </div>
                          <div class="label-bottom">第【1】次<br/>【定品审批】</div>
                        </div>
                      </div>
                      <!-- 模拟背景趋势线 -->
                      <div class="mock-line-bg"></div>
                    </div>
                    <!-- 模拟右侧 Y 轴 -->
                    <div class="y-axis-right"><span>费用</span><span>1元</span><span>0.8元</span><span>0.6元</span><span>0.4元</span><span>0.2元</span><span>0元</span></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="proposalNo" label="提案编号" width="120" fixed class-name="font-bold text-dark" />
        <el-table-column label="提案来源" width="100">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" class="source-link">{{ row.source }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="立项日期" width="95" align="center" />
        <el-table-column label="当前进度" width="100" align="center">
          <template #default="{ row }">
            <el-popover
              placement="top"
              :width="220"
              trigger="hover"
              popper-class="modern-status-popover"
            >
              <template #reference>
                <div class="modern-status-wrap">
                  <el-tag :class="['soft-tag', getStatusClass(row.status)]" size="small">
                    {{ row.status }}
                  </el-tag>
                  <div v-if="row.hasBadge" class="modern-badge">?</div>
                </div>
              </template>
              <div class="popover-content">
                <div class="pop-row">
                  <span class="label">当前待办人：</span>
                  <span class="value">{{ row.handler || '杨登峰' }}</span>
                </div>
                <div class="pop-row" style="margin-top: 12px">
                  <span class="label">已等待时长：</span>
                  <span class="value-box">【<span class="highlight-red">{{ row.waitingDays || '2' }}</span>】(天)</span>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="spu" label="SPU" width="90" class-name="text-secondary" />
        <el-table-column prop="platform" label="平台" width="80" align="center" />
        <el-table-column prop="category" label="运营大类" width="110" show-overflow-tooltip />
        <el-table-column prop="productName" label="产品名称" width="150" class-name="font-medium text-dark" show-overflow-tooltip />
        <el-table-column prop="style" label="款式" width="110" show-overflow-tooltip class-name="text-secondary" />
        <el-table-column prop="material" label="主材料" width="110" show-overflow-tooltip class-name="text-secondary" />
        <el-table-column prop="brand" label="适用品牌或..." width="110" show-overflow-tooltip />
        <el-table-column prop="model" label="型号" width="100" show-overflow-tooltip />
        <el-table-column prop="manager" label="产品经理" width="85" align="center" />
        <el-table-column prop="devMethod" label="开发方式" width="110" />
        <el-table-column prop="level" label="提案等级" width="90" align="center" />
        <el-table-column prop="launchTime" label="上架时间" width="100" align="center" />
        <el-table-column prop="isResearched" label="预调研" width="70" align="center" />
        
        <el-table-column label="预计结项日期" width="130" align="center">
          <template #header>
            <div class="header-hint">预计结项 <el-icon><InfoFilled /></el-icon></div>
          </template>
          <template #default="{ row }">{{ row.estProposalDate }}</template>
        </el-table-column>

        <el-table-column prop="actProposalDate" label="实际结项" width="110" align="center" class-name="text-secondary" />

        <el-table-column label="新品开发进度" width="120" align="center">
          <template #default="{ row }">
            <div class="dev-progress-cell" v-if="row.devStatus">
              {{ row.devStatus }} <el-icon class="icon-success"><SuccessFilled /></el-icon>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="archiveTime" label="归档时间" width="110" align="center" class-name="text-secondary" />
        <el-table-column prop="archiveDesc" label="归档说明" width="120" show-overflow-tooltip />

        <el-table-column label="操作" width="110" fixed="right" align="center">
          <template #default>
            <div class="action-cell">
              <el-link type="primary" :underline="false">详情</el-link>
              <el-divider direction="vertical" />
              <el-dropdown trigger="click">
                <span class="dropdown-trigger">更多</span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>编辑提案</el-dropdown-item>
                    <el-dropdown-item>流程审批</el-dropdown-item>
                    <el-dropdown-item divided class="text-red">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-footer">
        <div class="footer-left">
          <div class="toolbar-tip">
            <el-icon><InfoFilled /></el-icon>
            <span>提示：点击行首 <el-icon class="mini-expand"><ArrowRight /></el-icon> 展开，查看详细概况、待办流程及协作进度。</span>
          </div>
        </div>
        
        <div class="footer-right">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[20, 50, 100]"
            layout="prev, pager, next, sizes, jumper"
            :total="2292"
            background
          />
          <span class="total-count">共 2292 条记录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useTableHeight } from '../../../hooks/useTableHeight'

const tableHeight = useTableHeight(310)
const activeStat = ref('全部')
const currentPage = ref(1)
const pageSize = ref(20)
const expandedRowKeys = ref<string[]>([])

const handleExpandChange = (row: any, expandedRows: any[]) => {
  if (expandedRows.length > 0) {
    expandedRowKeys.value = [row.proposalNo]
  } else {
    expandedRowKeys.value = []
  }
}

const statTabs = [
  { label: '全部' }, { label: '待设计' }, { label: '任务待发' }, { label: '定制反馈' },
  { label: '样品反馈' }, { label: '样品待还' }, { label: '信息补充' }, { label: '首单需求待采集' },
  { label: '定品待申' }, { label: '定品二级审批' }
]

const queryParams = reactive({
  dateType: '1', dateRange: [], platform: '', category: '', manager: '', progress: '', devMethod: '', level: '', proposalNo: '', searchType: '1'
})

const allTableData = ref([
  { proposalNo: 'TA-202604101', source: '开发预案', date: '2026-04-22', status: '待设计', spu: 'US0218', platform: 'Amazon', category: '运动户外', productName: 'ZZ-户外牧羊人钩', style: '防鼠挡板配件', material: 'ABS+金属', manager: '谢东桥', devMethod: '全新品-现货', level: 'D', estProposalDate: '2026-05-15', devStatus: '未完结-正常', brand: '-', model: '-', launchTime: '-', isResearched: '否' },
  { proposalNo: 'TA-202604100', source: '需求预案', date: '2026-04-20', status: '拿样中', hasBadge: true, spu: 'HC0867', platform: 'Amazon', category: '个人护理', productName: 'ZZ-牙刷保护套', style: '-', material: '-', manager: '吴美林', devMethod: '全新品-现货', level: 'D', estProposalDate: '2026-05-15', devStatus: '未完结-正常', brand: '-', model: '-', launchTime: '2026-05', isResearched: '' },
  { proposalNo: 'TA-202604099', source: '需求预案', date: '2026-04-20', status: '拿样中', hasBadge: true, spu: 'HC0866', platform: 'Amazon', category: '个人护理', productName: 'ZZ-牙刷头保护套', style: '保护套', material: '-', manager: '吴美林', devMethod: '全新品-现货', level: 'D', estProposalDate: '2026-05-15', devStatus: '未完结-正常', brand: '-', model: '-', launchTime: '2026-05', isResearched: '' },
  { proposalNo: 'TA-202604093', source: '开发预案', date: '2026-04-20', status: '设计中', spu: 'HW0548', platform: 'Amazon', category: '家装工具', productName: '自行车支架', style: '停车架可折叠', material: '碳钢+塑料', manager: '闵咪咪', devMethod: '全新品-现货', level: 'D', estProposalDate: '2026-06-05', devStatus: '未完结-正常', brand: '-', model: '-', launchTime: '-', isResearched: '是' },
])

const tableData = computed(() => {
  if (activeStat.value === '全部') return allTableData.value
  return allTableData.value.filter(item => item.status === activeStat.value)
})

const getStatCount = (label: string) => {
  if (label === '全部') return allTableData.value.length
  return allTableData.value.filter(item => item.status === label).length
}

const handleStatClick = (label: string) => activeStat.value = label

const getStatusClass = (status: string) => {
  const map: any = { '待设计': 'blue', '拿样中': 'orange', '设计中': 'green' }
  return map[status] || 'grey'
}

const resetQuery = () => Object.keys(queryParams).forEach(key => (queryParams as any)[key] = '')
</script>

<style lang="scss" scoped>
.page-container {
  padding: 12px;
  background-color: #f5f7fa;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modern-card {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

/* 顶部统计 */
.stat-tabs {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  overflow-x: auto;
  .stat-label { font-size: 13px; color: #8c8c8c; margin-right: 12px; }
  .stat-items { display: flex; gap: 6px; }
  .stat-item {
    padding: 3px 12px;
    background: #f0f0f0;
    border-radius: 12px;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 4px;
    color: #595959;
    transition: all 0.2s;
    .count { margin-left: 2px; font-weight: 600; }
    &:hover { background: #e8e8e8; }
    &.active { background: var(--color-primary); color: #fff; box-shadow: 0 2px 6px rgba(24, 144, 255, 0.3); }
    .info-icon { font-size: 12px; opacity: 0.5; }
  }
}

/* 查询区域 */
.search-section {
  padding: 16px 16px 4px 16px;
  :deep(.el-form-item) { margin-bottom: 12px; margin-right: 16px; }
  .input-inner-icons { display: flex; align-items: center; gap: 4px; color: #bfbfbf; }
  .btn-ghost { color: #595959; border-color: #d9d9d9; &:hover { color: var(--color-primary); border-color: var(--color-primary); } }
}

/* 表格容器 */
.table-container {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.table-toolbar {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  
  .left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .toolbar-tip {
    font-size: 11px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%);
    padding: 2px 14px;
    border-radius: 20px;
    border: 1px solid rgba(24, 144, 255, 0.2);
    color: #409eff;
    box-shadow: 0 2px 6px rgba(0, 102, 255, 0.05);
    margin-left: 12px;

    .pulse-dot {
      width: 6px;
      height: 6px;
      background: #409eff;
      border-radius: 50%;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: inherit;
        animation: pulse 2s infinite;
      }
    }

    .mini-expand {
      font-size: 10px;
      color: #1890ff;
      font-weight: bold;
      transform: rotate(90deg); // 模拟展开后的向下箭头
    }
  }
  .tool-icons {
    display: flex; gap: 16px; font-size: 16px; color: #8c8c8c; cursor: pointer;
    .el-icon:hover { color: var(--color-primary); }
  }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  70% { transform: scale(2.5); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}

/* 现代表格样式 */
:deep(.modern-header) {
  background-color: #fafafa !important;
  color: #262626;
  font-weight: 600;
  height: 44px;
}

:deep(.modern-row) {
  &:hover > td { background-color: #f0f7ff !important; }
}

:deep(.font-bold) { font-weight: 600; }
:deep(.font-medium) { font-weight: 500; }
:deep(.text-dark) { color: #262626; }
:deep(.text-secondary) { color: #8c8c8c; }

.source-link { font-size: 12px; font-weight: 500; }

/* 现代状态标签与徽标 */
.modern-status-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px 0; // 增加垂直保护空间
  
  .soft-tag { border-radius: 4px; border: none; padding: 0 8px; font-weight: 500; }
  .blue { background: #e6f7ff; color: #1890ff; }
  .orange { background: #fff7e6; color: #fa8c16; }
  .green { background: #f6ffed; color: #52c41a; }
  
  .modern-badge {
    position: absolute;
    top: -4px; // 稍微调低一点，避免触顶
    right: -10px;
    width: 14px;
    height: 14px;
    background: #ff4d4f;
    color: #fff;
    border-radius: 50%;
    border: 1px solid #fff;
    font-size: 10px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(255, 77, 79, 0.2);
    z-index: 10;
  }
}

// 核心修复：允许表格单元格溢出显示徽标
:deep(.el-table__row) {
  td.el-table__cell {
    overflow: visible !important;
    .cell { overflow: visible !important; }
  }
}

.header-hint { display: flex; align-items: center; justify-content: center; gap: 4px; .el-icon { color: #bfbfbf; } }
.dev-progress-cell { display: flex; align-items: center; justify-content: center; gap: 4px; color: #52c41a; .icon-success { font-size: 14px; } }

.action-cell {
  display: flex; align-items: center; justify-content: center;
  .dropdown-trigger { color: #1890ff; cursor: pointer; font-size: 12px; margin-left: 4px; }
}

.text-red { color: #ff4d4f; }

/* 分页区布局最终修正方案：左提示，右分页+总数 */
.pagination-footer {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between; // 核心：左右两端对齐
  align-items: center;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  
  .footer-left {
    display: flex;
    align-items: center;
  }

  .footer-right {
    display: flex;
    align-items: center;
    gap: 12px; // 分页与总条数的间距

    .total-count { 
      font-size: 13px; 
      color: #8c8c8c; 
      white-space: nowrap;
    }

    :deep(.el-pagination) {
      padding: 0;
      width: auto;
      justify-content: flex-end;
    }
  }

  .toolbar-tip {
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f0f7ff;
    padding: 5px 14px;
    border-radius: 4px;
    border: 1px solid #91d5ff;
    color: #1890ff;
    white-space: nowrap;
    
    .el-icon { font-size: 14px; color: #1890ff; }
    .mini-expand {
      font-size: 10px;
      color: #1890ff;
      border: 1px solid #91d5ff;
      border-radius: 2px;
      padding: 1px;
      background: #fff;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
    }
  }
}
/* 展开行详细样式优化版 */
.expand-wrapper {
  display: flex;
  padding: 24px 40px;
  background: #fcfdfe;
  gap: 60px;
  border-bottom: 1px solid #f0f0f0;
  border-left: 4px solid var(--color-primary);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.02);
  
  /* 核心：随屏幕视口自适应，不受表格横向滚动影响 */
  position: sticky;
  left: 0;
  width: calc(100vw - 120px); // 减去侧边栏和内边距的预估宽度
  box-sizing: border-box;
  overflow: hidden;

  .expand-column-left {
    display: flex;
    flex-direction: column;
    gap: 32px;
    flex-shrink: 0;
  }

  .expand-section {
    flex-shrink: 0;
    .section-title { 
      font-size: 13px; font-weight: 600; color: #1f1f1f; margin-bottom: 16px; 
      display: flex; align-items: center; gap: 8px;
      &::before { content: ''; width: 3px; height: 12px; background: var(--color-primary); border-radius: 1px; }
    }
    
    /* 统计表格化布局 */
    .info-list {
      display: grid;
      grid-template-columns: repeat(2, 210px);
      gap: 1px;
      background: #f0f0f0;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      overflow: hidden;

      .info-item {
        background: #fff;
        padding: 8px 12px;
        font-size: 12px;
        color: #595959;
        display: flex;
        align-items: center;
        
        .val, .val-link { color: #1f1f1f; font-weight: 600; margin-left: auto; }
        .val-link { color: var(--color-primary); cursor: pointer; text-decoration: none; border-bottom: 1px dashed var(--color-primary); }
        .hint-icon { font-size: 12px; color: #bfbfbf; margin-left: 6px; cursor: help; }
        
        &:hover { background: #fafafa; }
      }
    }

    /* 待办流水线布局 */
    .todo-pipeline {
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      padding-left: 20px;

      /* 垂直进度线 */
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 8px;
        bottom: 8px;
        width: 2px;
        background: #f0f0f0;
        border-radius: 1px;
      }

      .pipeline-node {
        position: relative;
        
        /* 进度圆点 */
        &::before {
          content: '';
          position: absolute;
          left: -24px;
          top: 8px;
          width: 8px;
          height: 8px;
          background: #fff;
          border: 2px solid var(--color-primary);
          border-radius: 50%;
          z-index: 1;
        }

        .node-tag {
          font-size: 11px;
          color: var(--color-primary);
          font-weight: 600;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          &::after {
            content: '';
            flex: 1;
            height: 1px;
            background: linear-gradient(to right, #f0f0f0, transparent);
            margin-left: 8px;
          }
        }

        .node-content {
          display: grid;
          grid-template-columns: repeat(2, 210px);
          gap: 1px;
          background: #f0f0f0;
          border: 1px solid #f0f0f0;
          border-radius: 4px;
          overflow: hidden;

          .info-item {
            background: #fff;
            padding: 8px 12px;
            font-size: 12px;
            color: #595959;
            display: flex;
            align-items: center;
            
            .el-link, .status-text { 
              margin-left: auto; 
              font-weight: 600; 
              font-size: 12px; 
              --el-link-font-size: 12px;
            }
            .status-text { color: #52c41a; }
            .hint-icon { font-size: 12px; color: #bfbfbf; margin-left: 6px; cursor: help; }
            
            &:hover { background: #fafafa; }
          }
        }
      }
    }

    &.chart-section { 
      flex: 1; 
      min-width: 500px;
      display: flex;
      flex-direction: column;

      .chart-container {
        flex: 1; // 关键：撑满剩余高度
        display: flex;
        flex-direction: column;
        background: #fff; border: 1px solid #f0f0f0; border-radius: 8px; padding: 24px; position: relative;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        width: 100%;

        .mock-chart {
          flex: 1; // 关键：图表区域随容器拉伸
          min-height: 180px; 
          display: flex; 
          position: relative;
        }
      }
    }
  }

  /* 协作图表图例与坐标轴 */
  .chart-legend {
    display: flex; justify-content: flex-start; gap: 24px; margin-bottom: 24px;
    padding-left: 35px;
    .leg-item {
      display: flex; align-items: center; gap: 8px; font-size: 11px; color: #595959;
      .dot { display: inline-block; position: relative; }
      .dot.blue { width: 14px; height: 2px; background: #1890ff; border-radius: 1px; }
      .dot.green { width: 10px; height: 10px; background: #52c41a; border-radius: 2px; }
      .dot.yellow { width: 12px; height: 12px; border-radius: 50%; border: 2px solid #faad14; background: #fff; }
    }
  }

  .mock-chart {
    .y-axis, .y-axis-right {
      display: flex; flex-direction: column; justify-content: space-between; font-size: 10px; color: #bfbfbf; width: 25px; text-align: right;
    }
    .y-axis-right { width: 40px; text-align: left; margin-left: 10px; }
    
    .chart-area {
      flex: 1; border-bottom: 1px solid #f0f0f0; position: relative; margin: 0 8px;
      .grid-line { height: 20%; border-top: 1px dashed #f5f5f5; width: 100%; }
      
      .bars {
        position: absolute; inset: 0;
        .bar-group {
          position: absolute; bottom: 0; width: 100px; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
          
          .bars-inner {
            display: flex; align-items: flex-end; gap: 4px; height: 100%; padding-bottom: 4px;
            
            .bar-item {
              display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%;
              .bar-val { font-size: 9px; color: #8c8c8c; margin-bottom: 2px; font-weight: 500; }
              .bar { 
                width: 14px; border-radius: 2px 2px 0 0; transition: height 0.3s ease;
              }
              .bar.blue { background: linear-gradient(to top, #1890ff, #91d5ff); }
              .bar.green { background: linear-gradient(to top, #52c41a, #b7eb8f); }
              .bar.yellow { background: linear-gradient(to top, #faad14, #ffe58f); }
            }
          }
          
          .label-bottom { 
            position: absolute; top: 102%; width: 110px; font-size: 10px; color: #8c8c8c; text-align: center; line-height: 1.2; 
          }
        }
      }
      
      /* 背景趋势线 */
      .mock-line-bg {
        position: absolute; top: 0; left: 0; right: 0; bottom: 0;
        background-image: radial-gradient(circle at 10% 70%, rgba(250, 173, 20, 0.05) 0%, transparent 50%),
                          radial-gradient(circle at 85% 25%, rgba(250, 173, 20, 0.05) 0%, transparent 50%);
        pointer-events: none;
        &::after {
          content: ''; position: absolute; top: 45%; left: 5%; right: 5%; height: 1px;
          background: linear-gradient(to right, transparent, rgba(250, 173, 20, 0.2), transparent);
          border-bottom: 1px dashed rgba(250, 173, 20, 0.1);
        }
      }
    }
  }
}
</style>
