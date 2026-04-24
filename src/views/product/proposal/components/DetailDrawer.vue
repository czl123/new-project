<template>
  <el-drawer
    v-model="visible"
    title="提案详情"
    size="85%"
    class="proposal-detail-drawer"
    :destroy-on-close="true"
  >
    <template #header>
      <div class="drawer-header">
        <div class="title-area">
          <span class="no">{{ detailData.proposalNo }}</span>
          <span class="name">{{ detailData.productName }}</span>
          <el-tag :type="getStatusType(detailData.status)" effect="dark" size="small">{{ detailData.status }}</el-tag>
        </div>
      </div>
    </template>

    <div class="detail-container">
      <!-- 1. 顶部流程进度 (18节点阶段化流转) -->
      <div class="section-card process-section">
        <div class="section-title">
          <div class="title-left">提案全生命周期追踪</div>
          <el-link type="warning" class="header-action-link" @click="showHistory">
            <el-icon><History /></el-icon> 查看历史档案
          </el-link>
        </div>
        
        <!-- 阶段进度条 -->
        <!-- 宏观阶段进度条 (集成统计与悬浮详情) -->
        <div class="phase-progress-v2">
          <!-- 阶段 1：立项准备 -->
          <el-popover placement="bottom" :width="340" trigger="hover" popper-class="stage-detail-popper">
            <template #reference>
              <div class="phase-node done has-tasks">
                <div class="p-circle-wrap">
                  <div class="p-circle">1</div>
                </div>
                <div class="p-info">
                  <div class="p-name">立项准备</div>
                  <div class="p-nodes">创建 > 编辑 > 任务</div>
                </div>
              </div>
            </template>
            <div class="popover-task-list">
               <div class="pop-header-v2">
                 <div class="ph-top">
                   <span class="ph-title">立项准备阶段</span>
                   <el-tag size="small" type="warning" effect="dark" class="round-badge">第 2 轮任务</el-tag>
                 </div>
               </div>
               <div class="task-cards-container">
                  <div class="actor-card-v2 processing">
                      <div class="card-status-bar"></div>
                      <div class="card-main">
                        <div class="card-top"><span class="current-node">创建任务</span><span class="actor-name">@谢东桥</span></div>
                        <div class="mini-graph-steps mt-12">
                          <div class="gs-item done"><div class="gs-dot"></div><div class="gs-lab">创建</div><div class="gs-time">04-20</div></div>
                          <div class="gs-line done"></div>
                          <div class="gs-item done"><div class="gs-dot"></div><div class="gs-lab">编辑</div><div class="gs-time">04-20</div></div>
                          <div class="gs-line done"></div>
                          <div class="gs-item done"><div class="gs-dot"></div><div class="gs-lab">任务</div><div class="gs-time">04-21</div></div>
                        </div>
                      </div>
                  </div>
               </div>
            </div>
          </el-popover>
          
          <div class="phase-line done"></div>
          
          <!-- 阶段 2：采购承接 -->
          <el-popover placement="bottom" :width="340" trigger="hover" popper-class="stage-detail-popper">
            <template #reference>
              <div class="phase-node done has-tasks">
                <div class="p-circle-wrap">
                  <div class="p-circle">2</div>
                  <div class="task-badge">2</div>
                </div>
                <div class="p-info">
                  <div class="p-name">采购承接</div>
                  <div class="p-nodes">承接 > 反馈 > 采纳</div>
                </div>
              </div>
            </template>
            <div class="popover-task-list">
               <div class="pop-header-v2">
                 <div class="ph-top">
                   <span class="ph-title">采购承接阶段</span>
                   <el-tag size="small" type="warning" effect="dark" class="round-badge">第 2 轮任务</el-tag>
                 </div>
               </div>

               <div class="task-cards-container">
                  <div class="actor-card-v2 processing">
                      <div class="card-status-bar"></div>
                      <div class="card-main">
                        <div class="card-top"><span class="current-node">定制反馈</span><span class="actor-name">@李华</span></div>
                        <div class="mini-graph-steps mt-12">
                          <div class="gs-item done"><div class="gs-dot"></div><div class="gs-lab">承接</div><div class="gs-time">04-22</div></div>
                          <div class="gs-line done"></div>
                          <div class="gs-item active"><div class="gs-dot"></div><div class="gs-lab">反馈</div><div class="gs-time">进行中</div></div>
                          <div class="gs-line"></div>
                          <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">采纳</div><div class="gs-time">-</div></div>
                        </div>
                      </div>
                  </div>
                  <div class="actor-card-v2 processing">
                      <div class="card-status-bar"></div>
                      <div class="card-main">
                        <div class="card-top"><span class="current-node">任务承接</span><span class="actor-name">@赵敏</span></div>
                        <div class="mini-graph-steps mt-12">
                          <div class="gs-item active"><div class="gs-dot"></div><div class="gs-lab">承接</div><div class="gs-time">04-23</div></div>
                          <div class="gs-line"></div>
                          <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">反馈</div><div class="gs-time">-</div></div>
                          <div class="gs-line"></div>
                          <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">采纳</div><div class="gs-time">-</div></div>
                        </div>
                      </div>
                  </div>
               </div>
            </div>
          </el-popover>
          
          <div class="phase-line done"></div>

          <!-- 阶段 3：样品采买 -->
          <el-popover placement="bottom" :width="340" trigger="hover" popper-class="stage-detail-popper">
            <template #reference>
              <div class="phase-node active has-tasks">
                <div class="p-circle-wrap">
                  <div class="p-circle">3</div>
                  <div class="task-badge danger">1</div>
                </div>
                <div class="p-info">
                  <div class="p-name">样品采买</div>
                  <div class="p-nodes">申请 > 审核 > 研发费 > 支付</div>
                </div>
              </div>
            </template>
            <div class="popover-task-list">
               <div class="pop-header-v2">
                 <div class="ph-top">
                   <span class="ph-title">样品采买阶段</span>
                   <el-tag size="small" type="warning" effect="dark" class="round-badge">第 2 轮任务</el-tag>
                 </div>
               </div>
               <div class="task-cards-container">
                 <div class="actor-card-v2 advanced">
                    <div class="card-status-bar"></div>
                    <div class="card-main">
                      <div class="card-top"><span class="current-node">购样申请</span><span class="actor-name">@王强</span></div>
                      <div class="mini-graph-steps mt-12">
                        <div class="gs-item done"><div class="gs-dot"></div><div class="gs-lab">申请</div><div class="gs-time">04-22</div></div>
                        <div class="gs-line done"></div>
                        <div class="gs-item active"><div class="gs-dot"></div><div class="gs-lab">审核</div><div class="gs-time">进行中</div></div>
                        <div class="gs-line"></div>
                        <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">研发费</div><div class="gs-time">-</div></div>
                        <div class="gs-line"></div>
                        <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">支付</div><div class="gs-time">-</div></div>
                      </div>
                    </div>
                 </div>
               </div>
            </div>
          </el-popover>

          <div class="phase-line"></div>

          <!-- 阶段 4：样品验证 -->
          <el-popover placement="bottom" :width="340" trigger="hover" popper-class="stage-detail-popper">
            <template #reference>
              <div class="phase-node wait">
                <div class="p-circle">4</div>
                <div class="p-info">
                  <div class="p-name">样品验证</div>
                  <div class="p-nodes">登记 > 反馈</div>
                </div>
              </div>
            </template>
            <div class="popover-task-list">
               <div class="pop-header-v2"><div class="ph-top"><span class="ph-title">样品验证阶段</span></div></div>
               <div class="task-cards-container">
                  <div class="actor-card-v2 pending">
                      <div class="card-status-bar"></div>
                      <div class="card-main">
                        <div class="card-top"><span class="current-node">等待样品登记</span></div>
                        <div class="mini-graph-steps mt-12">
                          <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">登记</div><div class="gs-time">-</div></div>
                          <div class="gs-line"></div>
                          <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">反馈</div><div class="gs-time">-</div></div>
                        </div>
                      </div>
                  </div>
               </div>
            </div>
          </el-popover>
          
          <div class="phase-line"></div>

          <!-- 阶段 5：首单准备 -->
          <el-popover placement="bottom" :width="340" trigger="hover" popper-class="stage-detail-popper">
            <template #reference>
              <div class="phase-node wait">
                <div class="p-circle">5</div>
                <div class="p-info">
                  <div class="p-name">首单准备</div>
                  <div class="p-nodes">补充 > 采集 > 询价 > 确认</div>
                </div>
              </div>
            </template>
            <div class="popover-task-list">
               <div class="pop-header-v2">
                 <div class="ph-top">
                   <span class="ph-title">首单准备阶段</span>
                   <el-tag size="small" type="warning" effect="dark" class="round-badge">第 2 轮任务</el-tag>
                 </div>
               </div>
               <div class="task-cards-container">
                  <div class="actor-card-v2 pending">
                      <div class="card-status-bar"></div>
                      <div class="card-main">
                        <div class="card-top"><span class="current-node">等待信息补充</span></div>
                        <div class="mini-graph-steps mt-12">
                          <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">补充</div><div class="gs-time">-</div></div>
                          <div class="gs-line"></div>
                          <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">采集</div><div class="gs-time">-</div></div>
                          <div class="gs-line"></div>
                          <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">询价</div><div class="gs-time">-</div></div>
                          <div class="gs-line"></div>
                          <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">确认</div><div class="gs-time">-</div></div>
                        </div>
                      </div>
                  </div>
               </div>
            </div>
          </el-popover>

          <div class="phase-line"></div>

          <!-- 阶段 6：定品结项 -->
          <el-popover placement="bottom" :width="400" trigger="hover" popper-class="stage-detail-popper">
            <template #reference>
              <div class="phase-node wait">
                <div class="p-circle">6</div>
                <div class="p-info">
                  <div class="p-name">定品结项</div>
                  <div class="p-nodes">定品 > 审核 > 审批 > 归档</div>
                </div>
              </div>
            </template>
            <div class="popover-task-list">
               <div class="pop-header-v2">
                 <div class="ph-top">
                   <span class="ph-title">定品结项阶段</span>
                   <el-tag size="small" type="warning" effect="dark" class="round-badge">第 2 轮任务</el-tag>
                 </div>
               </div>
               <div class="task-cards-container">
                  <div class="actor-card-v2 pending">
                      <div class="card-status-bar"></div>
                      <div class="card-main">
                        <div class="card-top"><span class="current-node">等待定品申请</span></div>
                        <div class="mini-graph-steps mt-12">
                          <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">定品</div><div class="gs-time">-</div></div>
                          <div class="gs-line"></div>
                          <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">审核</div><div class="gs-time">-</div></div>
                          <div class="gs-line"></div>
                          <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">审批</div><div class="gs-time">-</div></div>
                          <div class="gs-line"></div>
                          <div class="gs-item wait"><div class="gs-dot"></div><div class="gs-lab">归档</div><div class="gs-time">-</div></div>
                        </div>
                      </div>
                  </div>
               </div>
            </div>
          </el-popover>
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
        <el-col :span="24">
          <div class="section-card">
            <div class="section-title">提案-基础</div>
            
            <!-- 分组 1：管理与时效 -->
            <div class="sub-section-title">
              <el-icon><Management /></el-icon>管理与时效
            </div>
            <el-descriptions :column="3" border size="small" class="mb-16">
              <el-descriptions-item label="运营大类">{{ detailData.category }}</el-descriptions-item>
              <el-descriptions-item label="团队负责人">{{ detailData.teamLeader }}</el-descriptions-item>
              <el-descriptions-item label="产品经理">{{ detailData.manager }}</el-descriptions-item>
              
              <el-descriptions-item label="上架时间(运营)">{{ detailData.listingTimeOps }}</el-descriptions-item>
              <el-descriptions-item label="上架时间(开发)">{{ detailData.listingTimeDev }}</el-descriptions-item>
              <el-descriptions-item label="-"></el-descriptions-item>
            </el-descriptions>

            <!-- 分组 2：SPU 核心属性 -->
            <div class="sub-section-title">
              <el-icon><List /></el-icon>SPU 核心属性
            </div>
            <el-descriptions :column="3" border size="small" class="mb-16">
              <el-descriptions-item label="产品名称">{{ detailData.productName }}</el-descriptions-item>
              <el-descriptions-item label="款式">{{ detailData.style }}</el-descriptions-item>
              <el-descriptions-item label="主材料">{{ detailData.material }}</el-descriptions-item>
              
              <el-descriptions-item label="适用品牌/对象">{{ detailData.applicableObject }}</el-descriptions-item>
              <el-descriptions-item label="型号">{{ detailData.model }}</el-descriptions-item>
              <el-descriptions-item label="SPU">{{ detailData.spu }}</el-descriptions-item>
            </el-descriptions>

            <!-- 分组 3：开发与品牌 -->
            <div class="sub-section-title">
              <el-icon><PriceTag /></el-icon>开发与品牌
            </div>
            <el-descriptions :column="3" border size="small">
              <el-descriptions-item label="产品来源">{{ detailData.productSource }}</el-descriptions-item>
              <el-descriptions-item label="开发方式">{{ detailData.devMethod }}</el-descriptions-item>
              <el-descriptions-item label="开发品牌">{{ detailData.brand }}</el-descriptions-item>
              
              <el-descriptions-item label="初始Logo位置">{{ detailData.logoPosition }}</el-descriptions-item>
              <el-descriptions-item label="初始包装方式">{{ detailData.packagingMethod }}</el-descriptions-item>
              <el-descriptions-item label="-"></el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="section-card mt-16">
            <div class="section-title">提案-调研</div>
            <div class="research-content">
              
              <!-- 分组 1：市场与人群 -->
              <div class="sub-section-title">
                <el-icon><Monitor /></el-icon>市场与人群
              </div>
              <el-descriptions :column="3" border size="small" class="mb-16">
                <el-descriptions-item label="主攻市场">{{ detailData.mainMarket }}</el-descriptions-item>
                <el-descriptions-item label="使用人群" :span="2">{{ detailData.userGroup }}</el-descriptions-item>
                <el-descriptions-item label="市场预估" :span="3">{{ detailData.marketEst }}</el-descriptions-item>
              </el-descriptions>

              <!-- 分组 2：场景与标签 -->
              <div class="sub-section-title">
                <el-icon><Guide /></el-icon>场景与标签
              </div>
              <el-descriptions :column="3" border size="small" class="mb-16">
                <el-descriptions-item label="使用场景">{{ detailData.usageScenario }}</el-descriptions-item>
                <el-descriptions-item label="季节标签">
                  <el-tag v-for="tag in detailData.seasonTags" :key="tag" size="small" class="mr-4">{{ tag }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="节日标签">
                  <el-tag v-for="tag in detailData.holidayTags" :key="tag" size="small" type="success" class="mr-4">{{ tag }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>

              <!-- 分组 3：素材与卖点 -->
              <div class="sub-section-title">
                <el-icon><Film /></el-icon>素材与卖点
              </div>
              
              <div class="text-block mb-16">
                <div class="sub-label">卖点说明：</div>
                <p class="content-text">{{ detailData.sellingPoints }}</p>
              </div>

              <el-row :gutter="24">
                <el-col :span="12">
                  <div class="link-block">
                    <div class="sub-label">参考链接：</div>
                    <div class="multi-links mt-8">
                      <div v-for="(link, idx) in detailData.refLinks" :key="idx" class="link-item">
                        <el-icon><Link /></el-icon>
                        <el-link type="primary" :href="link.url" target="_blank">{{ link.label }}</el-link>
                      </div>
                    </div>
                  </div>
                  <div class="file-block mt-16">
                    <div class="sub-label">相关文档：</div>
                    <div class="mt-8 flex-wrap">
                      <el-tag size="small" class="file-tag mr-8 mb-4">
                        <el-icon><Document /></el-icon> 调研：{{ detailData.researchFile }}
                      </el-tag>
                      <el-tag size="small" class="file-tag roi-tag mb-4">
                        <el-icon><DataAnalysis /></el-icon> ROI：{{ detailData.roiFile }}
                      </el-tag>
                    </div>
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
          <!-- 3. 提案-任务 -->
          <div class="section-card mt-16">
            <div class="section-title">提案-任务</div>
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
          </div>

          <!-- 4. 提案-定品 (多级表头与业务分类) -->
          <div class="section-card mt-16">
            <div class="section-title">提案-定品</div>
            <el-tabs v-model="finalTabActive" class="inner-tabs">
              <el-tab-pane label="属性信息" name="attr">
                <el-table 
                  :data="detailData.finalSpecList" 
                  size="small" 
                  border 
                  class="business-spec-table"
                  style="width: 100%"
                >
                  <!-- 固定列 -->
                  <el-table-column prop="materialCode" label="物料编码" width="120" fixed />

                  <!-- 分类 1：基本属性 -->
                  <el-table-column label="基本属性" header-align="center" label-class-name="h-basic">
                    <el-table-column prop="brand" width="100">
                      <template #header><span class="t-basic">公司品牌</span></template>
                    </el-table-column>
                    <el-table-column prop="pattern" width="100">
                      <template #header><span class="t-basic">图案</span></template>
                    </el-table-column>
                    <el-table-column prop="color" width="90">
                      <template #header><span class="t-basic">颜色</span></template>
                    </el-table-column>
                    <el-table-column prop="hasBattery" width="80">
                      <template #header><span class="t-basic">是否带电</span></template>
                    </el-table-column>
                    <el-table-column prop="isCe" width="80">
                      <template #header><span class="t-basic">是否CE类</span></template>
                    </el-table-column>
                    <el-table-column prop="specs" width="90">
                      <template #header><span class="t-basic">规格</span></template>
                    </el-table-column>
                    <el-table-column prop="pkgMethod" width="110">
                      <template #header><span class="t-basic">包装方式</span></template>
                    </el-table-column>
                    <el-table-column prop="pkgQty" width="90">
                      <template #header><span class="t-basic">包装数量</span></template>
                    </el-table-column>
                    <el-table-column prop="colorNo" width="80">
                      <template #header><span class="t-basic">色号</span></template>
                    </el-table-column>
                    <el-table-column prop="subCategory" width="100">
                      <template #header><span class="t-basic">二级类目</span></template>
                    </el-table-column>
                    <el-table-column prop="logoReplaceable" width="100">
                      <template #header><span class="t-basic">Logo可替换</span></template>
                    </el-table-column>
                    <el-table-column prop="suggestLogistics" width="110">
                      <template #header><span class="t-basic">建议物流方式</span></template>
                    </el-table-column>
                    <el-table-column prop="firstLogistics" width="110">
                      <template #header><span class="t-basic">首单物流方式</span></template>
                    </el-table-column>
                    <el-table-column prop="model" width="110">
                      <template #header><span class="t-basic">适用机型</span></template>
                    </el-table-column>
                    <el-table-column prop="materialDetail" width="120" show-overflow-tooltip>
                      <template #header><span class="t-basic">材质明细</span></template>
                    </el-table-column>
                    <el-table-column prop="multiPackage" width="80">
                      <template #header><span class="t-basic">一品多包</span></template>
                    </el-table-column>
                    <el-table-column prop="packageCount" width="80">
                      <template #header><span class="t-basic">包裹数量</span></template>
                    </el-table-column>
                  </el-table-column>

                  <!-- 分类 2：规格参数 -->
                  <el-table-column label="规格参数" header-align="center" label-class-name="h-params">
                    <el-table-column prop="size" width="80">
                      <template #header><span class="req-star">*</span> <span class="t-params">尺码</span></template>
                    </el-table-column>
                    <el-table-column prop="diameter" width="80">
                      <template #header><span class="req-star">*</span> <span class="t-params">直径</span></template>
                    </el-table-column>
                    <el-table-column prop="capacity" width="80">
                      <template #header><span class="t-params">容量</span></template>
                    </el-table-column>
                    <el-table-column prop="unitSize" width="100">
                      <template #header><span class="t-params">单品尺寸</span></template>
                    </el-table-column>
                    <el-table-column prop="pkgSize" width="100">
                      <template #header><span class="t-params">包装尺寸</span></template>
                    </el-table-column>
                    <el-table-column prop="pkgWeight" width="90">
                      <template #header><span class="t-params">包装重量</span></template>
                    </el-table-column>
                  </el-table-column>

                  <!-- 分类 3：知识产权信息 -->
                  <el-table-column label="知识产权信息" header-align="center" label-class-name="h-ip">
                    <el-table-column prop="patentDesc" width="120">
                      <template #header><span class="t-ip">专利说明</span></template>
                    </el-table-column>
                    <el-table-column prop="patentCert" width="100">
                      <template #header><span class="t-ip">专利证书</span></template>
                    </el-table-column>
                    <el-table-column prop="patentDate" width="100">
                      <template #header><span class="t-ip">下证日期</span></template>
                    </el-table-column>
                    <el-table-column prop="copyrightDesc" width="120">
                      <template #header><span class="t-ip">版权说明</span></template>
                    </el-table-column>
                  </el-table-column>

                  <!-- 分类 4：营销卖点设计 -->
                  <el-table-column label="营销卖点设计" header-align="center" label-class-name="h-marketing">
                    <el-table-column prop="opsLeader" width="90">
                      <template #header><span class="t-marketing">运营负责人</span></template>
                    </el-table-column>
                    <el-table-column prop="copyLevel" width="80">
                      <template #header><span class="t-marketing">文案等级</span></template>
                    </el-table-column>
                    <el-table-column prop="copyReq" width="120">
                      <template #header><span class="t-marketing">文案要求</span></template>
                    </el-table-column>
                    <el-table-column prop="imgLevel" width="80">
                      <template #header><span class="t-marketing">图片等级</span></template>
                    </el-table-column>
                    <el-table-column prop="imgReq" width="120">
                      <template #header><span class="t-marketing">图片要求</span></template>
                    </el-table-column>
                    <el-table-column prop="refLink" width="120" show-overflow-tooltip>
                      <template #header><span class="t-marketing">参考链接</span></template>
                    </el-table-column>
                  </el-table-column>

                  <!-- 分类 5/6/7：核心、仓储、质量 (保留表头颜色，去掉单元格颜色) -->
                  <el-table-column label="营销核心卖点" header-align="center" label-class-name="h-core">
                    <el-table-column prop="points" width="180" show-overflow-tooltip>
                      <template #header><span class="t-core">产品要点</span></template>
                    </el-table-column>
                  </el-table-column>

                  <el-table-column label="仓储识别标识" header-align="center" label-class-name="h-storage">
                    <el-table-column prop="shortDesc" width="180" show-overflow-tooltip>
                      <template #header><span class="t-storage">入库标签短描述</span></template>
                    </el-table-column>
                  </el-table-column>

                  <el-table-column label="质量与生产要求" header-align="center" label-class-name="h-quality">
                    <el-table-column prop="qualityReq" width="180" show-overflow-tooltip>
                      <template #header><span class="t-quality">质量要求点</span></template>
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="采购信息" name="design">
                <el-table :data="detailData.procurementList" size="small" border stripe style="width: 100%" class="business-spec-table">
                  <el-table-column prop="materialCode" label="物料编码" width="120" fixed />
                  
                  <!-- 分类 1：基础归属 -->
                  <el-table-column label="基础项" header-align="center" label-class-name="h-basic">
                    <el-table-column prop="procurement" width="100">
                       <template #header><span class="t-basic">采购负责人</span></template>
                    </el-table-column>
                  </el-table-column>

                  <!-- 分类 2：成本与税项 -->
                  <el-table-column label="成本与税项" header-align="center" label-class-name="h-ip">
                    <el-table-column prop="priceTaxInc" width="100">
                      <template #header><span class="t-ip">含税单价</span></template>
                    </el-table-column>
                    <el-table-column prop="priceTaxExc" width="110">
                      <template #header><span class="t-ip">不含税单价</span></template>
                    </el-table-column>
                    <el-table-column prop="taxRate" width="70">
                      <template #header><span class="t-ip">税率</span></template>
                    </el-table-column>
                    <el-table-column prop="latestPriceInc" width="140">
                      <template #header><span class="t-ip">最新单价(含税)</span></template>
                    </el-table-column>
                    <el-table-column prop="latestPriceExc" width="150">
                      <template #header><span class="t-ip">最新单价(不含税)</span></template>
                    </el-table-column>
                  </el-table-column>

                  <!-- 分类 3：订购与周期 -->
                  <el-table-column label="订购与周期" header-align="center" label-class-name="h-marketing">
                    <el-table-column prop="moq" width="100">
                      <template #header><span class="t-marketing">采购起订量</span></template>
                    </el-table-column>
                    <el-table-column prop="moqMemo" width="150" show-overflow-tooltip>
                      <template #header><span class="t-marketing">起订量备注</span></template>
                    </el-table-column>
                    <el-table-column prop="leadTime" width="100">
                      <template #header><span class="t-marketing">生产周期</span></template>
                    </el-table-column>
                  </el-table-column>

                  <!-- 分类 4：首单交付 -->
                  <el-table-column label="交付进度" header-align="center" label-class-name="h-storage">
                    <el-table-column prop="estDelivery" width="130">
                      <template #header><span class="t-storage">首单预估交期</span></template>
                    </el-table-column>
                    <el-table-column prop="actDelivery" width="130">
                      <template #header><span class="t-storage">首单实际交期</span></template>
                    </el-table-column>
                  </el-table-column>

                  <!-- 分类 5：开票与报关 -->
                  <el-table-column label="开票与报关" header-align="center" label-class-name="h-params">
                    <el-table-column prop="canInvoice" width="80">
                      <template #header><span class="t-params">能否开票</span></template>
                    </el-table-column>
                    <el-table-column prop="invoiceUnit" width="80">
                      <template #header><span class="t-params">开票单位</span></template>
                    </el-table-column>
                    <el-table-column prop="invoiceName" width="120">
                      <template #header><span class="t-params">开票品名</span></template>
                    </el-table-column>
                    <el-table-column prop="invoiceSpecs" width="150" show-overflow-tooltip>
                      <template #header><span class="t-params">开票规格型号</span></template>
                    </el-table-column>
                    <el-table-column prop="customsMaterial" width="120">
                      <template #header><span class="t-params">报关材质</span></template>
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>

          <!-- 4. 提案-首单 (回归原始宽表结构) -->
          <div class="section-card mt-16">
            <div class="section-title">提案-首单</div>
            <el-table :data="detailData.firstOrderList" size="small" border stripe style="width: 100%">
              <el-table-column type="index" label="序号" width="50" fixed />
              <el-table-column prop="proposalNo" label="提案编码" width="130" />
              <el-table-column prop="category" label="运营大类" width="120" />
              <el-table-column prop="productName" label="产品名称" width="150" show-overflow-tooltip />
              <el-table-column prop="style" label="款式" width="100" />
              <el-table-column prop="material" label="主材料" width="100" />
              <el-table-column prop="applicable" label="适用品牌或对象" width="130" />
              <el-table-column prop="model" label="型号" width="110" />
              <el-table-column prop="manager" label="产品经理" width="90" />
              <el-table-column prop="procurement" label="采购负责人" width="100" />
              <el-table-column prop="sourcingDate" label="采集日期" width="110" />
              <el-table-column prop="inquiryDate" label="询价完成日期" width="110" />
              <el-table-column prop="confirmDate" label="需求确认时间" width="110" />
              <el-table-column prop="finishDate" label="完成时间" width="110" />
              <el-table-column prop="materialCode" label="物料编码" width="120" />
            </el-table>
          </div>
        </el-col>
      </el-row>

      <!-- 5. 底部结项时效横梁 (4列并排 + 悬浮提示) -->
      <div class="completion-schedule-bar mt-16">
        <div class="schedule-item">
          <div class="s-label">
            <el-tooltip content="说明：首单预计下单日期" placement="top">
              <el-icon class="info-btn"><InfoFilled /></el-icon>
            </el-tooltip>
            提案预计结项日期：
          </div>
          <div class="s-value">{{ detailData.estProposalDate }}</div>
        </div>
        <div class="schedule-item">
          <div class="s-label">
            <el-tooltip content="说明：首单预计入库日期" placement="top">
              <el-icon class="info-btn"><InfoFilled /></el-icon>
            </el-tooltip>
            项目预计结项日期：
          </div>
          <div class="s-value">{{ detailData.estProjectDate }}</div>
        </div>
        <div class="schedule-item">
          <div class="s-label">
            <el-tooltip content="说明：首单实际下单日期(取值来源：金蝶采购订单首单审核时间)" placement="top">
              <el-icon class="info-btn"><InfoFilled /></el-icon>
            </el-tooltip>
            提案实际结项日期：
          </div>
          <div class="s-value">{{ detailData.actProposalDate }}</div>
        </div>
        <div class="schedule-item">
          <div class="s-label">
            <el-tooltip content="说明：首单实际入库日期(取值来源：金蝶采购入库单首单审核时间)" placement="top">
              <el-icon class="info-btn"><InfoFilled /></el-icon>
            </el-tooltip>
            项目实际结项日期：
          </div>
          <div class="s-value">{{ detailData.actProjectDate }}</div>
        </div>
      </div>
    </div>
  </el-drawer>

  <!-- 历史档案对话框 -->
  <el-dialog
    v-model="historyDialogVisible"
    title="历史任务档案追踪"
    width="600px"
    append-to-body
    custom-class="history-records-dialog"
  >
    <div class="history-timeline-wrapper">
      <el-timeline>
        <el-timeline-item
          v-for="(record, index) in historyRecords"
          :key="index"
          :timestamp="record.endDate"
          placement="top"
          type="danger"
        >
          <div class="history-round-card">
            <div class="h-card-header">
              <span class="h-round-no">{{ record.round }} 整体关闭</span>
              <el-tag size="mini" type="info">归档</el-tag>
            </div>
            <div class="h-card-reason mt-8">
              <strong>关闭原因：</strong>{{ record.reason }}
            </div>
            <el-divider border-style="dashed" class="my-12" />
            <div class="h-card-actors">
              <div v-for="actor in record.actors" :key="actor.name" class="h-actor-row">
                <span class="ha-name">{{ actor.name }}</span>
                <span class="ha-res">{{ actor.result }}</span>
                <el-icon class="ha-status"><CircleCloseFilled /></el-icon>
              </div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Document, CircleCheckFilled, Check, InfoFilled, Timer, ArrowRight, Warning, CoffeeCup, CircleClose } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: Boolean,
  detailData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const activeTab = ref('tasks')
const finalTabActive = ref('attr')
const historyDialogVisible = ref(false)

// 模拟历史轮次数据 (增加多轮次演示)
const historyRecords = reactive([
  {
    round: 'R2',
    endDate: '2026-04-22',
    reason: '样品验证环节不通过：款式细节与品牌定位存在偏差，需重新寻样',
    actors: [
      { name: '王强', result: '样品材质手感偏硬', status: 'closed' },
      { name: '李华', result: '工厂打样周期过长', status: 'closed' }
    ]
  },
  {
    round: 'R1',
    endDate: '2026-04-21',
    reason: '采购承接环节整体不匹配：首轮采购反馈均不匹配需求或单价过高',
    actors: [
      { name: '王强', result: '工厂单价超出预算', status: 'closed' },
      { name: '李华', result: '工厂无法提供ABS+金属复合材质', status: 'closed' },
      { name: '赵敏', result: '样品款式与提案描述不符', status: 'closed' }
    ]
  }
])

const showHistory = () => {
  historyDialogVisible.value = true
}

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
  applicableObject: '户外喂鸟器挂钩',
  model: 'RV-HOOK-01',
  productSource: '工厂选品',
  devMethod: '全新品-现货',
  brand: 'Rhino Valley',
  logoPosition: '产品正面激光镭射',
  packagingMethod: 'OPP袋+彩卡',
  listingTimeOps: '2026-05-10',
  listingTimeDev: '2026-05-15',
  marketEst: '预计月均 1500+, 细分 Top 50 占有率 12%',
  usageScenario: '花园挂饰、庭院喂鸟器固定',
  seasonTags: ['春季', '夏季'],
  holidayTags: ['母亲节', '圣诞节'],
  buyQty: 20,
  unitPrice: 7.20,
  totalAmount: 144.00,
  level: 'D',
  sellingPoints: 'Rhino Valley牧羊人挂钩 新品物料号: US250113, 防鼠挡板配件的套装，装一起 做种子链接 补给顾客; 加厚金属杆身，承重可达 20lbs。',
  refLinks: [
    { label: '亚马逊竞品 A', url: 'https://www.amazon.com/dp/B0GH4SLH8B' },
    { label: '亚马逊竞品 B', url: 'https://www.amazon.com/dp/B0DJ789123' }
  ],
  researchFile: '深度调研报告_2026.pdf',
  roiFile: 'ROI利润测算表_V1.xlsx',
  mainMarket: '北美',
  userGroup: '户外园艺爱好者',
  estFinishDate: '2026-05-15',
  // 结项时效数据
  estProposalDate: '2026-05-10',
  estProjectDate: '2026-06-30',
  actProposalDate: '-',
  actProjectDate: '-',
  images: [
    'https://picsum.photos/200/200?random=1',
    'https://picsum.photos/200/200?random=2',
    'https://picsum.photos/200/200?random=3'
  ],
  tasks: [
    { name: '样品采集任务', type: '购样', user: '杨登峰', status: '进行中' }
  ],
  finalSpecList: [
    {
      materialCode: 'MT2604-G01',
      // 基本属性
      brand: 'Rhino Valley', pattern: '复古雕花', color: '经典黑', hasBattery: '否', isCe: '否', 
      specs: '标准套装', pkgMethod: 'OPP袋+彩卡', pkgQty: '2 PCS/Box', colorNo: 'BK-001', 
      subCategory: '园艺挂钩', logoReplaceable: '是', suggestLogistics: '海运直发', 
      firstLogistics: '快船', model: 'RV-HOOK-01', materialDetail: 'ABS+碳钢', multiPackage: '否', packageCount: '1',
      // 规格参数
      size: '120cm', diameter: '15mm', capacity: '-', unitSize: '120*15*2.5cm', pkgSize: '125*16*5cm', pkgWeight: '1.2kg',
      // 知识产权
      patentDesc: '外观专利已申请', patentCert: '已上传', patentDate: '2026-01-10', copyrightDesc: '自有版权',
      // 营销设计
      opsLeader: '谢东桥', copyLevel: 'A', copyReq: '突出防鼠卖点', imgLevel: 'S', imgReq: '渲染3D精修图', refLink: 'https://...',
      // 核心/仓储/质量
      points: '防鼠挡板设计、超强承重',
      shortDesc: '户外牧羊人挂钩-黑色',
      qualityReq: '表面无划痕、承重测试 10kg'
    }
  ],
  procurementList: [
    {
      materialCode: 'MT2604-G01',
      procurement: '杨登峰',
      priceTaxInc: 7.20,
      priceTaxExc: 6.37,
      taxRate: '13%',
      latestPriceInc: 7.15,
      latestPriceExc: 6.33,
      moq: 500,
      moqMemo: '首单试样支持 200pcs',
      leadTime: '30天',
      estDelivery: '2026-05-20',
      actDelivery: '-',
      canInvoice: '是',
      invoiceUnit: '把',
      invoiceName: '园艺金属挂钩',
      invoiceSpecs: 'RV-HOOK-01/120cm',
      customsMaterial: 'ABS塑料+铁'
    }
  ],
  firstOrderList: [
    {
      proposalNo: 'TA-202604101',
      category: '运动户外-通用',
      productName: 'ZZ-户外牧羊人挂钩',
      style: '防鼠挡板配件',
      material: 'ABS+金属',
      applicable: '户外园艺',
      model: 'RV-HOOK-01',
      manager: '谢东桥',
      procurement: '杨登峰',
      sourcingDate: '2026-04-20',
      inquiryDate: '2026-04-22',
      confirmDate: '2026-04-23',
      finishDate: '-',
      materialCode: 'MT2604-G01'
    }
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
  padding: 10px 12px 20px 12px; // 增加顶部 10px 间距
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

:deep(.el-drawer__header) {
  margin-bottom: 26px !important;
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
    
    .header-action-link {
      margin-left: auto; // 推向右侧
      font-size: 12px;
      font-weight: normal;
      .el-icon { vertical-align: middle; margin-right: 2px; }
    }
  }

  .sub-section-title {
    font-size: 13px;
    font-weight: bold;
    color: #262626;
    background: linear-gradient(90deg, #f0f7ff 0%, #ffffff 100%);
    padding: 6px 12px;
    margin-bottom: 4px; // 缩小与自身表格的间距
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
    
    // 除了第一个标题，后续标题上方都增加间距，拉开分类感
    &:not(:first-of-type) {
      margin-top: 20px;
    }
    
    .el-icon {
      color: #1890ff;
      font-size: 14px;
    }
  }
}

/* 顶部进度条优化 */
.process-section {
  border-radius: 8px;
  padding-top: 16px;
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
  padding: 12px 10px 20px 10px; // 缩小整体内边距
  
  .phase-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    cursor: default;
    
    .p-circle-wrap {
      position: relative;
    }

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
      top: -10px; 
      right: -12px; 
      background: #1890ff;
      color: #fff;
      font-size: 10px;
      min-width: 14px; // 缩小尺寸
      height: 14px;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 3px;
      border: 1px solid #fff; // 减薄边框
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
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .pop-header-v2 {
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 4px; // 增加与列表的微调间距
    .ph-top { display: flex; align-items: center; gap: 10px; .ph-title { font-size: 14px; font-weight: bold; color: #262626; } }
    .ph-context { font-size: 11px; color: #fa8c16; display: flex; align-items: center; gap: 4px; line-height: 1.4; }
  }

  .task-cards-container {
    display: flex;
    flex-direction: column;
    gap: 8px; // 缩小间距
  }

  .pop-footer {
    padding-top: 8px;
    border-top: 1px solid #f5f5f5;
    text-align: right;
  }
}

/* 历史档案对话框样式 */
.history-timeline-wrapper {
  padding: 10px 20px;
  max-height: 500px;
  overflow-y: auto;
  
  .history-round-card {
    background: #fcfcfd;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    padding: 16px;
    
    .h-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .h-round-no { font-size: 14px; font-weight: bold; color: #262626; }
    }
    
    .h-card-reason { font-size: 12px; color: #595959; line-height: 1.6; }
    
    .h-card-actors {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .h-actor-row {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 12px;
        .ha-name { width: 60px; color: #262626; font-weight: 500; }
        .ha-res { flex: 1; color: #8c8c8c; }
        .ha-status { color: #ff4d4f; font-size: 14px; }
      }
    }
  }
}

.my-12 { margin-top: 12px; margin-bottom: 12px; }

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
    
    .node-with-round {
      display: flex;
      align-items: center;
      gap: 6px;
      .round-tag { font-family: monospace; font-weight: bold; border-radius: 4px; padding: 0 4px; }
    }
    
    .current-node { font-size: 15px; font-weight: bold; color: #262626; }
    .actor-name { font-size: 12px; color: #8c8c8c; margin-left: auto; }
  }

  /* 多轮次历史简述样式 */
  .history-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #fdfdfe;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px dashed #e8e8e8;
    
    .h-item {
      font-size: 10px;
      white-space: nowrap;
      
      &.done { color: #8c8c8c; text-decoration: line-through rgba(0,0,0,0.1); .el-icon { vertical-align: middle; color: #ff4d4f; } }
      &.active { color: #1890ff; font-weight: 500; }
    }
    .h-arrow { font-size: 10px; color: #d9d9d9; }
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
    .footer-msg.warn { color: #fa8c16; display: flex; align-items: center; gap: 4px; font-weight: 500; }
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
  margin: 12px 0;
  
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
.mt-10 { margin-top: 10px; }
.mb-16 { margin-bottom: 16px; }
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

/* 底部结项时效横梁样式 */
.completion-schedule-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  background: #fff;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;

  .schedule-item {
    display: flex;
    align-items: center;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    height: 32px;

    .s-label {
      background-color: #f5f7fa;
      padding: 0 10px;
      color: #595959;
      font-size: 12px;
      height: 100%;
      display: flex;
      align-items: center;
      gap: 4px;
      border-right: 1px solid #f0f0f0;
      white-space: nowrap;
      
      .el-icon { color: #8c8c8c; font-size: 14px; }
    }

    .s-value {
      padding: 0 12px;
      color: #262626;
      font-size: 13px;
      font-weight: 500;
      flex: 1;
      background: #fff;
    }
  }
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
  
  .multi-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
    .link-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      .el-icon { color: #8c8c8c; }
    }
  }

  .mr-4 { margin-right: 4px; }
}

/* 提案摘要样式 */
/* 定品对比矩阵样式 */
/* 定品业务宽表样式优化 - 精确匹配截图配色 */
.business-spec-table {
  :deep(.el-table__header-wrapper) {
    th { padding: 8px 0; }
  }
  
  /* 分类表头 (第一层) */
  :deep(.h-basic) { background-color: #e6f7ff !important; color: #1d39c4 !important; font-weight: bold; }
  :deep(.h-params) { background-color: #f9f0ff !important; color: #531dab !important; font-weight: bold; }
  :deep(.h-ip) { background-color: #f6ffed !important; color: #135200 !important; font-weight: bold; }
  :deep(.h-marketing), :deep(.h-core) { background-color: #fffbe6 !important; color: #874d00 !important; font-weight: bold; }
  :deep(.h-storage) { background-color: #f0f5ff !important; color: #003a8c !important; font-weight: bold; }
  :deep(.h-quality) { background-color: #fff1f0 !important; color: #a8071a !important; font-weight: bold; }

  /* 字段文字颜色 (第二层表头使用) */
  .t-basic { color: #1d39c4 !important; }
  .t-params { color: #531dab !important; }
  .t-ip { color: #135200 !important; }
  .t-marketing, .t-core { color: #874d00 !important; }
  .t-storage { color: #003a8c !important; }
  .t-quality { color: #a8071a !important; }

  /* 必填星号 */
  .req-star { color: #ff4d4f; margin-right: 4px; font-weight: bold; font-family: SimSun, sans-serif; }

  /* 单元格内容胶囊块 */
  .capsule-block {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    line-height: 1.4;
    
    &.core-bg { background: #fffbe6; border: 1px solid #ffe58f; color: #874d00; }
    &.storage-bg { background: #f0f5ff; border: 1px solid #adc6ff; color: #003a8c; }
    &.quality-bg { background: #fff1f0; border: 1px solid #ffa39e; color: #a8071a; }
  }
}

.comparison-matrix-wrapper {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 12px;

  .matrix-scroll-container {
    overflow-x: auto;
    width: 100%;
  }

  .matrix-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed; // 固定布局方便控制宽度

    th, td {
      padding: 10px 12px;
      border: 1px solid #f0f0f0;
      font-size: 12px;
      text-align: left;
      min-width: 120px;
    }

    /* 左侧属性名固定 */
    .sticky-col {
      position: sticky;
      left: 0;
      background: #fafafa;
      font-weight: 500;
      color: #595959;
      width: 100px;
      min-width: 100px;
      z-index: 10;
      border-right: 2px solid #e8e8e8;
    }

    .label-header {
      background: #f0f5ff;
      color: #1890ff;
    }

    .item-header {
      background: #fafafa;
      .item-code { font-weight: bold; color: #262626; }
    }

    /* 逻辑分组行样式 */
    .group-row {
      background: #fdfdfe;
      td {
        color: #1890ff;
        font-weight: bold;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 6px 12px;
      }
    }

    .long-text {
      color: #8c8c8c;
      line-height: 1.4;
      font-size: 11px;
      min-width: 200px; // 长文本列加宽
    }
    
    tr:hover td {
      background-color: #f5f7fa;
    }
  }
}

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

<style lang="scss">
/* 全局覆盖：解决 el-drawer 样式在 scoped 下无法修改的问题 */
.proposal-detail-drawer {
  .el-drawer__header {
    margin-bottom: -22px !important; 
    padding: 16px 20px !important;
  }
}
</style>
