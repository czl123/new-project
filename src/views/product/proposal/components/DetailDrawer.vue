<template>
  <el-drawer
    v-model="visible"
    title="提案详情"
    size="85%"
    custom-class="proposal-detail-drawer"
    :destroy-on-close="true"
  >
    <template #header>
      <div class="drawer-header">
        <div class="title-area">
          <span class="no">{{ detailData.proposalNo }}</span>
          <span class="name">{{ detailData.productName }}</span>
          <el-tag :type="getStatusType(detailData.status)" effect="dark" size="small">{{ detailData.status }}</el-tag>
        </div>
        <div class="action-area">
          <el-button size="small">打印提案</el-button>
          <el-button size="small">历史记录</el-button>
          <el-button size="small" type="primary">编辑提案</el-button>
        </div>
      </div>
    </template>

    <div class="detail-container">
      <!-- 1. 顶部流程进度 (18节点阶段化流转) -->
      <div class="section-card process-section">
        <div class="section-title">提案全生命周期追踪</div>
        
        <!-- 阶段进度条 -->
        <!-- 宏观阶段进度条 (集成统计与悬浮详情) -->
        <div class="phase-progress-v2">
          <!-- 阶段 1 -->
          <div class="phase-node done">
            <div class="p-circle">1</div>
            <div class="p-info">
              <div class="p-name">立项准备</div>
              <div class="p-nodes">创建 > 编辑 > 任务</div>
            </div>
          </div>
          <div class="phase-line done"></div>
          
          <!-- 阶段 2 (集成 Popover) -->
          <el-popover placement="bottom" :width="340" trigger="hover" popper-class="stage-detail-popper">
            <template #reference>
              <div class="phase-node done has-tasks">
                <div class="p-circle">2</div>
                <div class="p-info">
                  <div class="p-name">开发承接</div>
                  <div class="p-nodes">承接 > 反馈 > 采纳</div>
                </div>
                <div class="task-badge">2</div>
              </div>
            </template>
            <div class="popover-task-list">
               <div class="pop-header">开发承接阶段 (2个采购)</div>
               <!-- 采购卡片 B -->
               <div class="actor-card-v2 processing mb-12">
                  <div class="card-status-bar"></div>
                  <div class="card-main">
                    <div class="card-top">
                      <span class="current-node">定制反馈</span>
                      <span class="actor-name">@李华</span>
                    </div>
                    <div class="mini-graph-steps mt-12">
                      <div class="gs-item done">
                        <div class="gs-dot"></div>
                        <div class="gs-lab">承接</div>
                        <div class="gs-time">04-22 09:00</div>
                      </div>
                      <div class="gs-line done"></div>
                      <div class="gs-item active">
                        <div class="gs-dot"></div>
                        <div class="gs-lab">反馈</div>
                        <div class="gs-time">进行中...</div>
                      </div>
                      <div class="gs-line"></div>
                      <div class="gs-item wait">
                        <div class="gs-dot"></div>
                        <div class="gs-lab">采纳</div>
                        <div class="gs-time">-</div>
                      </div>
                    </div>
                    <div class="card-footer mt-12">
                      <el-icon><Timer /></el-icon> 正在寻找工厂打样中...
                    </div>
                  </div>
               </div>
               <!-- 采购卡片 C -->
               <div class="actor-card-v2 pending">
                  <div class="card-status-bar"></div>
                  <div class="card-main">
                    <div class="card-top">
                      <span class="current-node">任务承接</span>
                      <span class="actor-name">@赵敏</span>
                    </div>
                    <div class="mini-graph-steps mt-12">
                      <div class="gs-item active">
                        <div class="gs-dot"></div>
                        <div class="gs-lab">承接</div>
                        <div class="gs-time">04-23 10:15</div>
                      </div>
                      <div class="gs-line"></div>
                      <div class="gs-item wait">
                        <div class="gs-dot"></div>
                        <div class="gs-lab">反馈</div>
                        <div class="gs-time">-</div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </el-popover>
          
          <div class="phase-line done"></div>

          <!-- 阶段 3 -->
          <el-popover placement="bottom" :width="340" trigger="hover" popper-class="stage-detail-popper">
            <template #reference>
              <div class="phase-node active has-tasks">
                <div class="p-circle">3</div>
                <div class="p-info">
                  <div class="p-name">购样支付</div>
                  <div class="p-nodes">申请 > 审核 > 研发费 > 支付</div>
                </div>
                <div class="task-badge danger">1</div>
              </div>
            </template>
            <div class="popover-task-list">
               <div class="pop-header">购样支付阶段 (1个采购)</div>
               <div class="actor-card-v2 advanced">
                  <div class="card-status-bar"></div>
                  <div class="card-main">
                    <div class="card-top">
                      <span class="current-node">购样申请</span>
                      <el-tag size="mini" type="danger" effect="plain">关键节点</el-tag>
                      <span class="actor-name">@王强</span>
                    </div>
                    <div class="mini-graph-steps mt-12">
                      <div class="gs-item done">
                        <div class="gs-dot"></div>
                        <div class="gs-lab">采纳</div>
                        <div class="gs-time">04-22 16:30</div>
                      </div>
                      <div class="gs-line done"></div>
                      <div class="gs-item active">
                        <div class="gs-dot"></div>
                        <div class="gs-lab">申请</div>
                        <div class="gs-time">进行中...</div>
                      </div>
                      <div class="gs-line"></div>
                      <div class="gs-item wait">
                        <div class="gs-dot"></div>
                        <div class="gs-lab">审核</div>
                        <div class="gs-time">-</div>
                      </div>
                    </div>
                    <div class="card-footer mt-12 highlight-text">
                      <el-icon><Warning /></el-icon> 需在 04-25 前完成支付审批
                    </div>
                  </div>
               </div>
            </div>
          </el-popover>

          <div class="phase-line"></div>

          <!-- 阶段 4 -->
          <div class="phase-node wait">
            <div class="p-circle">4</div>
            <div class="p-info">
              <div class="p-name">样品验证</div>
              <div class="p-nodes">登记 > 反馈</div>
            </div>
          </div>
          
          <div class="phase-line"></div>

          <!-- 阶段 5 -->
          <div class="phase-node wait">
            <div class="p-circle">5</div>
            <div class="p-info">
              <div class="p-name">定品结项</div>
              <div class="p-nodes">补充 > 定品 > 归档</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. 基础信息看板 -->
      <div class="info-dashboard">
        <div class="dash-item">
          <div class="label">首单采购金额</div>
          <div class="value">¥{{ detailData.totalAmount }}</div>
        </div>
        <div class="dash-item">
          <div class="label">首单采购数量</div>
          <div class="value">{{ detailData.buyQty }} <span class="unit">PCS</span></div>
        </div>
        <div class="dash-item">
          <div class="label">单价</div>
          <div class="value">¥{{ detailData.unitPrice }}</div>
        </div>
        <div class="dash-item">
          <div class="label">提案等级</div>
          <div class="value-tag" :data-level="detailData.level">{{ detailData.level }} 级</div>
        </div>
      </div>

      <!-- 3. 核心信息卡片组 -->
      <el-row :gutter="16">
        <!-- 左侧：基础与调研 -->
        <el-col :span="16">
          <div class="section-card">
            <div class="section-title">基础信息</div>
            <el-descriptions :column="3" border size="small">
              <el-descriptions-item label="运营大类">{{ detailData.category }}</el-descriptions-item>
              <el-descriptions-item label="团队负责人">{{ detailData.teamLeader }}</el-descriptions-item>
              <el-descriptions-item label="产品经理">{{ detailData.manager }}</el-descriptions-item>
              <el-descriptions-item label="SPU">{{ detailData.spu }}</el-descriptions-item>
              <el-descriptions-item label="款式">{{ detailData.style }}</el-descriptions-item>
              <el-descriptions-item label="主材料">{{ detailData.material }}</el-descriptions-item>
              <el-descriptions-item label="开发方式">{{ detailData.devMethod }}</el-descriptions-item>
              <el-descriptions-item label="开发品牌">{{ detailData.brand }}</el-descriptions-item>
              <el-descriptions-item label="产品包装">{{ detailData.package }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="section-card mt-16">
            <div class="section-title">调研深度信息</div>
            <div class="research-content">
              <!-- 调研基础文本 -->
              <div class="research-main-info">
                <el-descriptions :column="2" border size="small">
                  <el-descriptions-item label="主攻市场">{{ detailData.mainMarket }}</el-descriptions-item>
                  <el-descriptions-item label="使用人群">{{ detailData.userGroup }}</el-descriptions-item>
                </el-descriptions>
                
                <div class="text-block mt-16">
                  <div class="sub-label">卖点说明：</div>
                  <p class="content-text">{{ detailData.sellingPoints }}</p>
                </div>
              </div>

              <!-- 参考与文档 -->
              <el-row :gutter="24" class="mt-16">
                <el-col :span="12">
                  <div class="link-block">
                    <div class="sub-label">参考链接：</div>
                    <el-link type="primary" :href="detailData.refLink" target="_blank" class="ref-link">
                      {{ detailData.refLink }}
                    </el-link>
                  </div>
                  <div class="file-block mt-12">
                    <div class="sub-label">调研文档：</div>
                    <el-tag size="small" closable @close="void 0" class="file-tag">
                      <el-icon><Document /></el-icon> {{ detailData.researchFile }}
                    </el-tag>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="image-gallery">
                    <div class="sub-label mb-8">参考图片：</div>
                    <div class="img-list">
                      <el-image 
                        v-for="(img, idx) in detailData.images" 
                        :key="idx"
                        :src="img" 
                        :preview-src-list="detailData.images"
                        fit="cover"
                        class="gallery-item"
                      />
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>

        <!-- 右侧：由于市场信息移走，这里可以放一些辅助信息或调整布局 -->
        <el-col :span="8">
          <div class="section-card full-height mini-stats-card">
            <div class="section-title">提案摘要</div>
            <div class="summary-list">
              <div class="summary-item">
                <div class="s-label">预计结项</div>
                <div class="s-value">{{ detailData.estFinishDate }}</div>
              </div>
              <div class="summary-item">
                <div class="s-label">当前待办</div>
                <div class="s-value">杨登峰</div>
              </div>
              <div class="summary-item">
                <div class="s-label">已耗时</div>
                <div class="s-value">7 (天)</div>
              </div>
            </div>
            
            <el-divider border-style="dashed" />
            
            <div class="memo-area">
              <div class="sub-label mb-8">备注信息：</div>
              <div class="memo-text">暂无更多补充备注...</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 4. 任务与定品 (Tab 化处理) -->
      <div class="section-card mt-16">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="任务追踪" name="tasks">
            <el-table :data="detailData.tasks" size="small" border stripe>
              <el-table-column type="index" label="序号" width="50" />
              <el-table-column prop="name" label="任务名称" />
              <el-table-column prop="type" label="拿样方式" width="100" />
              <el-table-column prop="user" label="承接人" width="100" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-badge is-dot :type="row.status === '已完成' ? 'success' : 'warning'" /> {{ row.status }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default><el-link type="primary" :underline="false">详情</el-link></template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="定品信息" name="final">
            <el-table :data="detailData.finalSpecs" size="small" border>
              <el-table-column prop="code" label="物料编码" width="120" />
              <el-table-column prop="color" label="颜色" width="80" />
              <el-descriptions-item label="尺寸">{{ detailData.size }}</el-descriptions-item>
              <el-table-column prop="material" label="材质明细" show-overflow-tooltip />
              <el-table-column prop="logistics" label="物流方式" width="120" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="首单信息" name="firstOrder">
             <div class="empty-placeholder">暂无首单数据</div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 5. 底部结项信息 -->
      <div class="section-card mt-16 footer-stats">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="footer-item">
              <span class="label">预计结项：</span>
              <span class="val">{{ detailData.estFinishDate }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="footer-item">
              <span class="label">实际结项：</span>
              <span class="val">-</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Document, CircleCheckFilled, Check } from '@element-plus/icons-vue'

const visible = ref(false)
const activeTab = ref('tasks')

// 模拟详情数据 (根据截图还原)
const detailData = reactive({
  proposalNo: 'TA-202604101',
  productName: 'ZZ-户外牧羊人挂钩',
  status: '待设计',
  category: '运动户外-通用',
  teamLeader: '周亮亮',
  manager: '谢东桥',
  spu: 'US0218',
  style: '防鼠挡板配件',
  material: 'ABS+金属',
  devMethod: '全新品-现货',
  brand: 'Rhino Valley',
  package: '袋装',
  buyQty: 20,
  unitPrice: 7.20,
  totalAmount: 144.00,
  level: 'D',
  sellingPoints: 'Rhino Valley牧羊人挂钩 新品物料号: US250113, 防鼠挡板配件的套装，装一起 做种子链接 补给顾客;',
  refLink: 'https://www.amazon.com/dp/B0GH4SLH8B',
  researchFile: '种子链接-空白.xlsx',
  mainMarket: '北美',
  userGroup: '户外爱好者',
  estFinishDate: '2026-05-15',
  images: [
    'https://picsum.photos/200/200?random=1',
    'https://picsum.photos/200/200?random=2',
    'https://picsum.photos/200/200?random=3'
  ],
  tasks: [
    { name: '样品采集任务', type: '购样', user: '杨登峰', status: '进行中' }
  ],
  finalSpecs: []
})

const getStatusType = (status: string) => {
  if (status === '已完结') return 'success'
  if (status === '待设计') return 'danger'
  return 'warning'
}

const open = () => {
  visible.value = true
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.detail-container {
  padding: 0 12px 20px 12px;
  background-color: #f8f9fb;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 40px;
  .title-area {
    display: flex;
    align-items: center;
    gap: 12px;
    .no { font-weight: bold; color: #1890ff; font-size: 16px; }
    .name { font-weight: 500; color: #262626; font-size: 16px; }
  }
}

.section-card {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.04);
  
  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    &::before {
      content: '';
      width: 4px;
      height: 14px;
      background: #1890ff;
      margin-right: 8px;
      border-radius: 2px;
    }
  }
}

/* 顶部进度条优化 */
.process-section {
  margin-top: -10px;
  border-radius: 0 0 8px 8px;
  padding-top: 24px;
}

.phase-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;

  .phase-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    
    .p-head {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 8px;
      color: #bfbfbf;
    }
    
    .p-nodes {
      font-size: 11px;
      color: #bfbfbf;
      white-space: nowrap;
    }

    &.done {
      .p-head { color: #52c41a; }
      .p-nodes { color: #8c8c8c; }
    }

    &.active {
      .p-head { color: #1890ff; }
      .p-nodes { color: #1890ff; font-weight: bold; }
    }
  }

  .phase-connector {
    width: 40px;
    height: 1px;
    background: #f0f0f0;
    margin-top: -20px;
    &.done { background: #52c41a; }
  }
}

.current-node-detail {
  padding: 16px;
  border: 1px solid #e6f7ff;
  background: #fcfdfe;
  
  .detail-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    .active-node-name { font-size: 14px; font-weight: 600; color: #1890ff; }
  }
}

/* 阶段进度条 V2 (支持气泡与悬浮) */
.phase-progress-v2 {
  display: flex;
  align-items: center;
  padding: 20px 10px 30px 10px; // 底部留空给 Popover
  
  .phase-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    cursor: default;
    
    .p-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #fff;
      border: 2px solid #d9d9d9;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      color: #bfbfbf;
      z-index: 2;
      transition: all 0.3s;
    }
    
    .p-info {
      margin-top: 8px;
      text-align: center;
      .p-name { font-size: 13px; font-weight: bold; color: #8c8c8c; margin-bottom: 2px; }
      .p-nodes { font-size: 10px; color: #bfbfbf; white-space: nowrap; transform: scale(0.9); }
    }

    /* 数字气泡 */
    .task-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #1890ff;
      color: #fff;
      font-size: 10px;
      min-width: 16px;
      height: 16px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      border: 2px solid #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      
      &.danger { background: #f5222d; }
    }

    &.done {
      .p-circle { border-color: #52c41a; color: #52c41a; }
      .p-name { color: #52c41a; }
    }
    
    &.active {
      .p-circle { background: #1890ff; border-color: #1890ff; color: #fff; box-shadow: 0 0 0 4px rgba(24,144,255,0.1); }
      .p-name { color: #1890ff; }
    }

    &.has-tasks { cursor: pointer; &:hover .p-circle { transform: scale(1.1); } }
  }

  .phase-line {
    flex: 1;
    height: 2px;
    background: #f0f0f0;
    margin: -35px 8px 0 8px;
    &.done { background: #52c41a; }
  }
}

/* Popover 内部样式 */
.popover-task-list {
  .pop-header {
    font-size: 12px;
    font-weight: bold;
    color: #595959;
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid #f0f0f0;
  }
}

/* 执行看板增强样式 */
.execution-kanban {
  display: flex;
  align-items: stretch;
  gap: 0;
  overflow-x: auto;
  padding: 10px 0;

  .kanban-column {
    flex: 1;
    min-width: 300px; // 加宽以容纳更多视觉元素
    background: #f8f9fa;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 0; // 改为头部填充
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .column-header {
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid transparent;
      
      .c-title-group {
        display: flex;
        flex-direction: column;
        .c-stage-no { font-size: 10px; color: rgba(0,0,0,0.45); font-family: monospace; }
        .c-title { font-size: 14px; font-weight: bold; color: #262626; }
      }

      &.stage-2 { background: #e6f7ff; border-bottom-color: #1890ff; }
      &.stage-3 { background: #fff1f0; border-bottom-color: #f5222d; }
      &.stage-next { background: #f5f5f5; border-bottom-color: #d9d9d9; }
    }

    .column-body {
      padding: 16px 12px;
      flex: 1;
    }

    &.active-col {
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      border-color: #1890ff;
      z-index: 2;
    }
  }

  .kanban-arrow {
    display: flex;
    align-items: center;
    padding: 0 12px;
    color: #1890ff;
    font-size: 24px;
    opacity: 0.5;
  }
}

/* 新版卡片样式 Actor Card V2 */
.actor-card-v2 {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  display: flex;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  transition: all 0.3s;

  &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

  .card-status-bar {
    width: 4px;
    background: #d9d9d9;
  }

  .card-main {
    flex: 1;
    padding: 12px;
  }

  .card-top {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    .current-node { font-size: 15px; font-weight: bold; color: #262626; }
    .actor-name { font-size: 12px; color: #8c8c8c; margin-left: auto; }
  }

  .card-footer {
    font-size: 12px;
    color: #595959;
    display: flex;
    align-items: center;
    gap: 6px;
    background: #fafafa;
    padding: 6px 10px;
    border-radius: 4px;
    .el-icon { font-size: 14px; }
  }

  /* 状态色定义 */
  &.processing {
    border-color: #91d5ff;
    .card-status-bar { background: #1890ff; }
    .current-node { color: #1890ff; }
  }
  
  &.advanced {
    border-color: #ffa39e;
    .card-status-bar { background: #f5222d; }
    .current-node { color: #f5222d; }
    .highlight-text { color: #f5222d; background: #fff1f0; font-weight: 500; }
  }

  &.pending {
    .card-status-bar { background: #d9d9d9; }
  }
}

/* 图形化微型进度条 */
.mini-graph-steps {
  display: flex;
  align-items: center;
  
  .gs-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    
    .gs-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #f0f0f0;
      border: 1px solid #d9d9d9;
    }
    
    .gs-lab { font-size: 10px; color: #bfbfbf; white-space: nowrap; }
    .gs-time { font-size: 9px; color: rgba(0,0,0,0.25); margin-top: 2px; transform: scale(0.9); }

    &.done {
      .gs-dot { background: #52c41a; border-color: #52c41a; }
      .gs-lab { color: #52c41a; }
      .gs-time { color: rgba(82, 196, 26, 0.6); }
    }
    
    &.active {
      .gs-dot { 
        background: #1890ff; 
        border-color: #1890ff; 
        box-shadow: 0 0 0 3px rgba(24,144,255,0.2); 
      }
      .gs-lab { color: #1890ff; font-weight: bold; }
      .gs-time { color: #1890ff; }
    }
  }

  .gs-line {
    flex: 1;
    height: 1px;
    background: #f0f0f0;
    margin: -14px 4px 0 4px;
    &.done { background: #52c41a; }
  }
}

.empty-state-v2 {
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #bfbfbf;
  .e-icon { font-size: 32px; margin-bottom: 8px; }
  p { font-size: 12px; }
}

/* 泳道卡片样式 */
.actor-swimlanes {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  padding: 0 10px;
  width: 100%;
  
  .actor-card {
    flex: 1;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    position: relative;
    overflow: hidden;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .a-name { font-size: 12px; font-weight: 600; color: #262626; }
      .status-text { font-size: 11px; font-weight: 500; }
      .status-icon { color: #52c41a; font-size: 14px; }
      .blink { color: #1890ff; animation: blink-ani 1.5s infinite; }
    }
    
    .card-body {
      .b-row {
        font-size: 11px;
        margin-bottom: 4px;
        display: flex;
        .b-lab { color: #8c8c8c; flex-shrink: 0; }
        .b-val { color: #595959; }
      }
      .placeholder-text { font-size: 11px; color: #bfbfbf; font-style: italic; margin-top: 4px; }
    }

    .card-progress {
      height: 2px;
      background: #f0f0f0;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      .prog-bar { height: 100%; background: #1890ff; transition: width 0.3s; }
    }

    &.finished {
      background: #f6ffed;
      border-color: #b7eb8f;
      .card-progress .prog-bar { background: #52c41a; }
    }
    
    &.processing {
      border-color: #91d5ff;
      border-top: 2px solid #1890ff;
    }
    
    &.pending {
      background: #fafafa;
      .status-text { color: #8c8c8c; }
    }
  }

  /* 微型节点流样式 */
  .micro-flow {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    
    .m-node {
      padding: 2px 6px;
      border-radius: 10px;
      background: #f0f2f5;
      color: #bfbfbf;
      
      &.done {
        background: #f6ffed;
        color: #52c41a;
      }
      
      &.active {
        background: #e6f7ff;
        color: #1890ff;
        font-weight: bold;
      }
      
      &.wait {
        background: #fafafa;
        color: #d9d9d9;
      }
    }
    
    .m-arrow {
      color: #d9d9d9;
      font-size: 10px;
    }
  }
}

@keyframes blink-ani {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* 看板样式 */
.info-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 16px 0;
  
  .dash-item {
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.04);
    .label { font-size: 12px; color: #8c8c8c; margin-bottom: 8px; }
    .value { font-size: 24px; font-weight: bold; color: #262626; font-family: 'DIN Alternate', sans-serif; }
    .unit { font-size: 12px; color: #bfbfbf; margin-left: 4px; }
    
    .value-tag {
      font-size: 20px; font-weight: bold;
      &[data-level="A"] { color: #f5222d; }
      &[data-level="D"] { color: #fa8c16; }
    }
  }
}

.mt-16 { margin-top: 16px; }
.mt-12 { margin-top: 12px; }
.mb-8 { margin-bottom: 8px; }

.sub-label { font-size: 13px; font-weight: 500; color: #595959; }

.img-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  .gallery-item {
    width: 100%;
    height: 100px;
    border-radius: 4px;
    cursor: zoom-in;
    border: 1px solid #f0f0f0;
  }
}

.file-tag {
  background: #f0f7ff;
  border: 1px solid #adc6ff;
  color: #2f54eb;
  cursor: pointer;
  &:hover { opacity: 0.8; }
}

.footer-stats {
  background: #fafafa;
  .footer-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    .label { color: #8c8c8c; }
    .val { color: #262626; font-weight: 500; }
  }
}

.empty-placeholder {
  padding: 40px;
  text-align: center;
  color: #bfbfbf;
  font-size: 13px;
}

/* 调研深度信息样式优化 */
.research-content {
  .content-text {
    font-size: 13px;
    line-height: 1.6;
    color: #262626;
    background: #fafafa;
    padding: 12px;
    border-radius: 4px;
    margin: 8px 0 0 0;
  }
  
  .ref-link {
    font-size: 12px;
    word-break: break-all;
    margin-top: 4px;
  }
}

/* 提案摘要样式 */
.mini-stats-card {
  .summary-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .s-label { font-size: 12px; color: #8c8c8c; }
      .s-value { font-size: 13px; font-weight: 600; color: #262626; }
    }
  }
  
  .memo-text {
    font-size: 12px;
    color: #8c8c8c;
    font-style: italic;
  }
}

:deep(.el-descriptions__label) {
  background-color: #fafafa !important;
  font-weight: 500;
  width: 100px;
}
</style>
