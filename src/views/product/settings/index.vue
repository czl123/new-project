<template>
  <div class="settings-master-detail">
    <div class="md-layout-body">
      <!-- 左侧菜单 (Master) -->
      <aside class="md-sidebar">
        <ul class="md-menu">
          <li class="menu-group-title">基础规则</li>
          <li 
            class="menu-item" 
            :class="{ active: activeMenu === 'grade' }"
            @click="activeMenu = 'grade'"
          >
            <div class="item-text">
              <span class="title">提案等级基准</span>
            </div>
          </li>
          <li 
            class="menu-item" 
            :class="{ active: activeMenu === 'duration' }"
            @click="activeMenu = 'duration'"
          >
            <div class="item-text">
              <span class="title">拿样时效标准</span>
            </div>
          </li>
          
          <li class="menu-group-title mt-4">审批流配置</li>
          <li 
            class="menu-item" 
            :class="{ active: activeMenu === 'approver' }"
            @click="activeMenu = 'approver'"
          >
            <div class="item-text">
              <span class="title">新品提案审批配置</span>
            </div>
          </li>
          <li 
            class="menu-item" 
            :class="{ active: activeMenu === 'approval' }"
            @click="activeMenu = 'approval'"
          >
            <div class="item-text">
              <span class="title">研发费审批配置</span>
            </div>
          </li>
        </ul>
      </aside>

      <!-- 右侧详情 (Detail) -->
      <main class="md-content">
        <transition name="fade-slide" mode="out-in">
          <!-- 详情：提案等级 -->
          <div v-if="activeMenu === 'grade'" class="detail-pane" key="grade">
            <div class="pane-header">
              <div class="info">
                <h3>提案等级基准配置</h3>
                <p>设置不同级别提案的首单采购准入门槛，系统将根据此规则进行自动化校验。</p>
              </div>
              <div class="actions">
                <el-button icon="Document" @click="showLog('grade')">操作日志</el-button>
              </div>
            </div>
            
            <div class="pane-body">
              <el-table :data="proposalGrades" class="detail-table" border>
                <el-table-column label="提案等级" width="120" align="center">
                  <template #default="{ row }">
                    <el-tag :type="getGradeType(row.grade)" effect="dark" size="small">{{ row.grade }}级</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="首单采购数量(>= PCS)">
                  <template #default="{ row }">
                    <el-input-number v-model="row.minQty" :controls="false" class="full-input" />
                  </template>
                </el-table-column>
                <el-table-column label="首单采购金额(>= CNY)">
                  <template #default="{ row }">
                    <el-input-number v-model="row.minAmount" :precision="2" :controls="false" class="full-input" />
                  </template>
                </el-table-column>
                <el-table-column label="开启自动审批" width="120" align="center">
                  <template #default="{ row }">
                    <el-switch v-model="row.autoApprove" />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 详情：拿样时效 -->
          <div v-else-if="activeMenu === 'duration'" class="detail-pane" key="duration">
            <div class="pane-header">
              <div class="info">
                <h3>拿样任务时效控制</h3>
                <p>定义不同类型样品在开发流程中的生命周期标准。</p>
              </div>
              <div class="actions">
                <el-button icon="Document" @click="showLog('duration')">操作日志</el-button>
              </div>
            </div>
            
            <div class="pane-body">
              <el-table :data="sampleDurations" class="detail-table" border>
                <el-table-column prop="type" label="样品类型" width="150" />
                <el-table-column label="要求反馈时效 (天)">
                  <template #default="{ row }">
                    <el-input-number v-model="row.feedbackDays" :controls="false" class="full-input" />
                  </template>
                </el-table-column>
                <el-table-column label="要求拿样时效 (天)">
                  <template #default="{ row }">
                    <el-input-number v-model="row.sampleDays" :controls="false" class="full-input" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                  <template #default="{ row }">
                    <el-button link type="primary" icon="Edit" @click="handleDurationEdit(row)">编辑</el-button>
                  </template>
                </el-table-column>
                </el-table>
                </div>

                <!-- 拿样时效编辑弹窗 -->
                <el-dialog v-model="durationEditDialogVisible" title="编辑时效标准" width="500px" append-to-body>
                <el-form :model="durationEditForm" label-width="120px" style="padding: 20px 40px 0 0;">
                <el-form-item label="样品类型">
                  <el-input v-model="durationEditForm.type" disabled />
                </el-form-item>
                <el-form-item label="反馈时效 (天)">
                  <el-input-number v-model="durationEditForm.feedbackDays" :min="1" style="width: 100%" />
                </el-form-item>
                <el-form-item label="拿样时效 (天)">
                  <el-input-number v-model="durationEditForm.sampleDays" :min="1" style="width: 100%" />
                </el-form-item>
                </el-form>
                <template #footer>
                <el-button @click="durationEditDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveDurationEdit">提交</el-button>
                </template>
                </el-dialog>
                </div>
          <!-- 详情：新品提案审批配置 -->
          <div v-else-if="activeMenu === 'approver'" class="detail-pane" key="approver">
            <div class="pane-header">
              <div class="info">
                <h3>新品提案审批配置</h3>
                <p>为不同平台和等级的提案定制“一级/二级”审批流。开启“强制二级审批”的等级将默认进入二级流程。</p>
              </div>
              <div class="actions">
                <el-button icon="Document" @click="showLog('approver')">操作日志</el-button>
                <el-select v-model="filterPlatform" placeholder="平台过滤" clearable style="width: 150px" class="pane-search">
                  <el-option label="Amazon" value="Amazon" />
                  <el-option label="Tiktok" value="Tiktok" />
                </el-select>
                <el-button type="primary" icon="Plus" @click="handleAdd">新增等级</el-button>
              </div>
            </div>
            
            <div class="pane-body">
              <el-table :data="filteredApproverList" class="detail-table pro-matrix-table" border>
                <el-table-column label="等级" width="100" align="center">
                  <template #default="{ row }">
                    <el-tag :type="getGradeType(row.grade)" effect="dark" size="small">{{ row.grade }}级</el-tag>
                  </template>
                </el-table-column>

                <el-table-column label="平台配置详情">
                  <template #default="{ row }">
                    <div class="platform-configs-list">
                      <div v-for="conf in row.configs" :key="conf.platform" class="platform-row">
                        <div class="platform-info">
                          <el-tag size="small" class="platform-tag">
                            <el-icon v-if="conf.platform === 'Amazon'"><Shop /></el-icon>
                            <el-icon v-else><VideoPlay /></el-icon>
                            {{ conf.platform }}
                          </el-tag>
                        </div>
                        <div class="approver-info">
                          <div class="node">
                            <span class="label">一级:</span>
                            <div class="chips">
                              <el-tag v-for="u in conf.firstApprover" :key="u" size="small" effect="plain">{{ u }}</el-tag>
                            </div>
                          </div>
                          <div class="node">
                            <span class="label">二级:</span>
                            <div class="chips" v-if="row.mandatoryL2 || conf.l2Triggers.length > 0">
                              <el-tag v-for="u in conf.secondApprover" :key="u" size="small" effect="plain" type="success">{{ u }}</el-tag>
                              <span v-if="conf.secondApprover.length === 0" class="placeholder">待设置</span>
                            </div>
                            <span v-else class="skip">跳过</span>
                          </div>
                        </div>
                        <div class="trigger-info">
                          <div v-if="row.mandatoryL2" class="mandatory">强制激活</div>
                          <div v-else-if="conf.l2Triggers.length > 0" class="condition">
                            <span v-if="conf.l2Triggers.includes('mold')">开模触发</span>
                            <span v-if="conf.l2Triggers.includes('cost')">门槛:{{ conf.costThreshold }}</span>
                          </div>
                          <div v-else class="none">无激活条件</div>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="100" align="center" fixed="right">
                  <template #default="{ row }">
                    <el-button link type="primary" icon="Edit" @click="handleEdit(row)">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <div class="matrix-hint">
                <el-icon><InfoFilled /></el-icon>
                <span>逻辑说明：开启“强制二级审批”的等级将默认进入二级流程。其余等级仅在满足勾选的“激活条件”时才会进入。</span>
              </div>
            </div>

            <!-- 编辑弹窗 -->
            <el-dialog v-model="editDialogVisible" :title="currentEditingIndex === -1 ? '新增等级' : '编辑等级'" width="1100px" append-to-body custom-class="matrix-edit-dialog">
              <div class="edit-header" style="justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="grade-label">提案级别:</span>
                  <el-select 
                    v-if="currentEditingIndex === -1" 
                    v-model="editForm.grade" 
                    allow-create 
                    filterable 
                    placeholder="选择或输入级别" 
                    style="width: 160px"
                  >
                    <el-option 
                      v-for="g in ['S', 'A', 'B', 'C', 'D', 'E', 'F']" 
                      :key="g" 
                      :label="g + '级'" 
                      :value="g" 
                      :disabled="approverConfigs.some(c => c.grade === g)"
                    />
                  </el-select>
                  <el-tag v-else :type="getGradeType(editForm.grade)" effect="dark">{{ editForm.grade }}级</el-tag>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 13px; color: #606266;">强制执行二级审批:</span>
                  <el-switch v-model="editForm.mandatoryL2" />
                </div>
              </div>

              <el-table :data="editForm.configs" border size="small" class="edit-sub-table">
                <el-table-column label="平台" width="150">
                  <template #default="{ row }">
                    <el-select v-model="row.platform" placeholder="选择平台">
                      <el-option label="Amazon" value="Amazon" />
                      <el-option label="Tiktok" value="Tiktok" />
                      <el-option label="Shopee" value="Shopee" />
                      <el-option label="Lazada" value="Lazada" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="一级审批人">
                  <template #default="{ row }">
                    <el-select v-model="row.firstApprover" multiple collapse-tags placeholder="选择人员" style="width: 100%">
                      <el-option label="张经理" value="张经理" />
                      <el-option label="李总监" value="李总监" />
                      <el-option label="王组长" value="王组长" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="二级激活条件">
                  <template #default="{ row }">
                    <div v-if="editForm.mandatoryL2" class="mandatory-text">已开启强制激活</div>
                    <div v-else class="trigger-edit">
                      <el-checkbox-group v-model="row.l2Triggers">
                        <el-checkbox label="mold">开模</el-checkbox>
                        <el-checkbox label="cost">门槛</el-checkbox>
                      </el-checkbox-group>
                      <el-input-number v-if="row.l2Triggers.includes('cost')" v-model="row.costThreshold" :controls="false" size="small" style="width: 80px" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="二级审批人">
                  <template #default="{ row }">
                    <el-select 
                      v-model="row.secondApprover" 
                      multiple 
                      collapse-tags 
                      placeholder="选择人员"
                      style="width: 100%"
                      :disabled="!editForm.mandatoryL2 && row.l2Triggers.length === 0"
                    >
                      <el-option label="陈副总" value="陈副总" />
                      <el-option label="王副总" value="王副总" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="60" align="center">
                  <template #default="{ $index }">
                    <el-button link type="danger" icon="Delete" @click="removePlatformConfig($index)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <div class="dialog-actions">
                <el-button type="primary" link icon="Plus" @click="addPlatformConfig">添加平台配置</el-button>
              </div>

              <template #footer>
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" :disabled="!editForm.grade" @click="saveEdit">提交</el-button>
              </template>

            </el-dialog>
          </div>

          <!-- 详情：研发费审批配置 -->
          <div v-else-if="activeMenu === 'approval'" class="detail-pane" key="approval">
            <div class="pane-header">
              <div class="info">
                <h3>研发费用审批配置</h3>
                <p>根据研发费用金额区间，为各运营大类及业务组定制差异化的审批流及免审策略，确保每一笔支出都合规、透明且高效。</p>
              </div>
              <div class="actions">
                <el-button icon="Document" @click="showLog('approval')">操作日志</el-button>
                <el-input v-model="searchKeyword" placeholder="检索业务组或审核人..." prefix-icon="Search" class="pane-search" clearable style="width: 260px" />
                <el-button type="primary" icon="Plus" @click="handleRdAdd">新增区间</el-button>
              </div>
            </div>

            <div class="pane-body">
              <el-table :data="filteredApprovals" class="detail-table pro-matrix-table" border>
                <el-table-column label="状态/金额区间 (CNY)" width="260">
                  <template #default="{ row }">
                    <div style="display: flex; align-items: center; gap: 12px; padding-left: 8px;">
                      <el-switch v-model="row.enabled" size="small" @click.stop />
                      <div class="visual-range">
                        <div class="part inc">
                          <span class="sym">≥</span>
                          <span class="val" :style="{ color: getAmountRiskColor(row.minAmount) }">{{ row.minAmount.toLocaleString() }}</span>
                        </div>
                        <div class="divider"></div>
                        <div class="part exc">
                          <span class="sym">&lt;</span>
                          <span class="val" :style="{ color: row.maxAmount === Infinity ? '#6b7280' : getAmountRiskColor(row.maxAmount) }">
                            {{ row.maxAmount === Infinity ? '∞' : row.maxAmount.toLocaleString() }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="业务路由及审批详情">
                  <template #default="{ row }">
                    <div class="platform-configs-list">
                      <div v-for="(rule, idx) in row.rules" :key="idx" class="platform-row" :class="{ 'rule-disabled': !row.enabled || !rule.enabled }">
                        <div class="platform-info" style="width: 200px;">
                          <div style="display: flex; align-items: flex-start; gap: 8px;">
                            <div v-if="row.isDefault" class="default-rule-text">所有未匹配分类 (兜底)</div>
                            <div v-else class="chips-group">
                              <span v-for="cat in rule.categories" :key="cat" class="chip">{{ cat }}</span>
                              <span v-if="rule.categories.length === 0" style="color: #9ca3af; font-size: 12px;">未指定分类</span>
                            </div>
                          </div>
                        </div>
                        <div class="approver-info" style="gap: 32px; flex-wrap: wrap;">
                          <!-- 业务组节点 -->
                          <div class="identity-node node-group">
                            <div class="icon-box group-icon"><el-icon><OfficeBuilding /></el-icon></div>
                            <div class="text">
                              <span class="role-tag">业务组</span>
                              <span class="name">{{ rule.group || '-' }}</span>
                            </div>
                          </div>

                          <!-- 主审节点 -->
                          <div class="identity-node node-approver">
                            <template v-if="rule.skipApproval">
                              <div class="icon-box skip-icon"><el-icon><CircleCheckFilled /></el-icon></div>
                              <div class="text">
                                <span class="role-tag">流程指令</span>
                                <span class="name skip-text">无需审批</span>
                              </div>
                            </template>
                            <template v-else>
                              <div class="icon-box approver-icon"><el-icon><User /></el-icon></div>
                              <div class="text">
                                <span class="role-tag">主审节点</span>
                                <div class="approver-chips" style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; align-items: center;">
                                  <el-tag v-for="u in rule.approvers" :key="u" size="small" effect="plain">{{ u }}</el-tag>
                                  <span v-if="!rule.approvers || rule.approvers.length === 0" style="color: #fbbf24; font-size: 12px;">待设置</span>
                                  <!-- 逻辑标识 -->
                                  <template v-if="rule.approvers && rule.approvers.length > 1">
                                    <el-tooltip :content="rule.approvalType === 'and' ? '会签：须所有成员审批通过' : '或签：任一成员审批通过即可'">
                                      <el-tag size="small" :type="rule.approvalType === 'and' ? 'warning' : 'info'" effect="dark" style="transform: scale(0.8); margin-left: -4px;">
                                        {{ rule.approvalType === 'and' ? '会签' : '或签' }}
                                      </el-tag>
                                    </el-tooltip>
                                  </template>
                                </div>
                              </div>
                            </template>
                          </div>

                          <!-- 抄送节点 -->
                          <div v-if="!rule.skipApproval" class="identity-node node-cc" style="flex: 1; min-width: 250px;">
                            <div class="icon-box cc-icon"><el-icon><Promotion /></el-icon></div>
                            <div class="text" style="width: 100%;">
                              <span class="role-tag">抄送人员 (CC)</span>
                              <div class="cc-tag-list" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
                                <el-tag v-for="cc in rule.ccList" :key="cc" size="small" effect="plain" type="info" round>
                                  {{ cc }}
                                </el-tag>
                                <span v-if="!rule.ccList || rule.ccList.length === 0" class="none-text">未设置抄送人</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="120" align="center" fixed="right">
                  <template #default="{ row }">
                    <div style="display: flex; gap: 8px; justify-content: center;">
                      <el-button link type="primary" @click="handleRdEdit(row)">编辑</el-button>
                      <el-button v-if="!row.isDefault" link type="danger" @click="handleRdDelete(row)">删除</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 研发费编辑弹窗 -->
            <el-dialog v-model="rdEditDialogVisible" :title="currentRdEditingIndex === -1 ? '新增区间' : '编辑区间'" width="1250px" append-to-body class="approval-config-container">

              <div class="edit-header" style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; gap: 32px; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-weight: 600; color: #475569;">金额区间:</span>
                    <el-input-number v-model="rdEditForm.minAmount" :controls="false" size="small" style="width: 120px" />
                    <span style="color: #9ca3af;">至</span>
                    <el-input-number v-if="rdEditForm.maxAmount !== Infinity" v-model="rdEditForm.maxAmount" :controls="false" size="small" style="width: 120px" />
                    <el-checkbox :model-value="rdEditForm.maxAmount === Infinity" @change="(val) => rdEditForm.maxAmount = val ? Infinity : 1000">无上限 (∞)</el-checkbox>
                  </div>
                  <div v-if="rdEditForm.isDefault" style="color: #64748b; font-size: 13px;">
                    <el-icon><InfoFilled /></el-icon> 当前为系统兜底配置
                  </div>
                </div>
                <div style="display: flex; gap: 24px; align-items: center;">
                  <el-switch v-model="rdEditForm.enabled" active-text="开启区间" />
                </div>
              </div>

              <el-table :data="rdEditForm.rules" border size="small" class="edit-sub-table">
                <el-table-column label="状态" width="70" align="center">
                  <template #default="{ row }">
                    <el-switch v-model="row.enabled" size="small" :disabled="!rdEditForm.enabled" />
                  </template>
                </el-table-column>
                <el-table-column label="免审" width="70" align="center">
                  <template #default="{ row }">
                    <el-checkbox v-model="row.skipApproval" :disabled="!rdEditForm.enabled || !row.enabled" />
                  </template>
                </el-table-column>
                <el-table-column label="适用大类" min-width="200">
                  <template #default="{ row }">
                    <el-select v-if="!rdEditForm.isDefault" v-model="row.categories" multiple collapse-tags placeholder="选择大类" style="width: 100%" :disabled="!rdEditForm.enabled || !row.enabled">
                      <el-option label="宠物用品" value="宠物用品" />
                      <el-option label="水上运动" value="水上运动" />
                      <el-option label="家居生活" value="家居生活" />
                      <el-option label="美妆个护" value="美妆个护" />
                      <el-option label="户外运动" value="户外运动" />
                      <el-option label="电子产品" value="电子产品" />
                      <el-option label="母婴玩具" value="母婴玩具" />
                    </el-select>
                    <span v-else class="default-rule-text">所有剩余分类</span>
                  </template>
                </el-table-column>
                <el-table-column label="业务组" width="150">
                  <template #default="{ row }">
                    <el-input v-model="row.group" placeholder="组名" :disabled="!rdEditForm.enabled || !row.enabled" />
                  </template>
                </el-table-column>
                <el-table-column label="主审人员" min-width="220">
                  <template #default="{ row }">
                    <el-select v-model="row.approvers" multiple collapse-tags placeholder="选择审核人" :disabled="!rdEditForm.enabled || !row.enabled || row.skipApproval" style="width: 100%">
                      <el-option label="余郝~" value="余郝~" />
                      <el-option label="张海国" value="张海国" />
                      <el-option label="CEO" value="CEO" />
                      <el-option label="CFO" value="CFO" />
                      <el-option label="财务BP" value="财务BP" />
                    </el-select>
                  </template>
                </el-table-column>
                
                <el-table-column label="审批模式" width="160" align="center">
                  <template #default="{ row }">
                    <div v-if="row.approvers && row.approvers.length > 1" class="logic-capsule-wrapper column-mode">
                      <div class="logic-capsule">
                        <div 
                          class="capsule-item mini" 
                          :class="{ active: row.approvalType === 'and' }"
                          @click="row.approvalType = 'and'"
                        >
                          <el-icon><UserFilled /></el-icon>
                          <span>会签</span>
                        </div>
                        <div 
                          class="capsule-item mini" 
                          :class="{ active: row.approvalType === 'or' }"
                          @click="row.approvalType = 'or'"
                        >
                          <el-icon><Pointer /></el-icon>
                          <span>或签</span>
                        </div>
                      </div>
                    </div>
                    <span v-else-if="!row.skipApproval && row.approvers.length === 1" class="mode-placeholder">单人通过</span>
                    <span v-else class="mode-placeholder">-</span>
                  </template>
                </el-table-column>
                <el-table-column label="抄送" min-width="180">
                  <template #default="{ row }">
                    <el-select v-model="row.ccList" multiple collapse-tags placeholder="选择" :disabled="!rdEditForm.enabled || !row.enabled || row.skipApproval">
                      <el-option label="财务部" value="财务部" />
                      <el-option label="项目办" value="项目办" />
                      <el-option label="总经办" value="总经办" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="60" align="center">
                  <template #default="{ $index }">
                    <el-button link type="danger" icon="Delete" @click="removeRdRule($index)" :disabled="rdEditForm.rules.length <= 1"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <div class="dialog-actions">
                <el-button type="primary" link icon="Plus" @click="addRdRule">添加业务路由</el-button>
              </div>

              <template #footer>
                <el-button @click="rdEditDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveRdEdit">提交</el-button>
              </template>
            </el-dialog>
          </div>
        </transition>
      </main>
    </div>

    <!-- 操作日志弹窗 -->
    <el-dialog v-model="logDialogVisible" title="操作日志" width="600px" append-to-body custom-class="log-dialog">
      <div class="history-timeline-wrapper">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in logRecords"
            :key="index"
            :timestamp="item.time"
            placement="top"
          >
            <div class="history-round-card">
              <div class="h-card-header">
                <span class="h-round-no">{{ item.operator }}</span>
                <el-tag size="small" :type="item.action.includes('新增') ? 'success' : 'primary'" effect="plain">{{ item.action }}</el-tag>
              </div>
              <div class="h-card-reason" style="margin-top: 8px;">{{ item.detail }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { TrendCharts, Timer, Money, Search, Plus, UserFilled, Shop, VideoPlay, InfoFilled, Delete, CircleCheckFilled, Edit, Right, OfficeBuilding, User, Promotion, Pointer, CircleCheck } from '@element-plus/icons-vue'

const activeMenu = ref('grade')
const searchKeyword = ref('')
const filterPlatform = ref('')

const logDialogVisible = ref(false)
const currentLogModule = ref('')
const logRecords = ref([
  { operator: '系统管理员', time: '2024-05-09 10:00:00', action: '修改配置', detail: '将提案S级的首单采购金额门槛从 400,000 调整为 500,000' },
  { operator: '张三', time: '2024-05-08 14:30:00', action: '新增规则', detail: '新增研发费审批阶梯：0-100 免审' },
  { operator: '李四', time: '2024-05-07 09:15:00', action: '开启状态', detail: '开启了 拿样时效标准 的自动审批开关' }
])

const showLog = (module: string) => {
  currentLogModule.value = module
  logDialogVisible.value = true
}

const proposalGrades = ref([
  { grade: 'S', minQty: 10000, minAmount: 500000, autoApprove: false },
  { grade: 'A', minQty: 5000, minAmount: 300000, autoApprove: false },
  { grade: 'B', minQty: 3000, minAmount: 150000, autoApprove: false },
  { grade: 'C', minQty: 2000, minAmount: 80000, autoApprove: true },
  { grade: 'D', minQty: 1000, minAmount: 1, autoApprove: true }
])

const sampleDurations = ref([
  { type: '现货', feedbackDays: 1, sampleDays: 7 },
  { type: '定制', feedbackDays: 3, sampleDays: 30 }
])

const durationEditDialogVisible = ref(false)
const durationEditForm = ref<any>({
  type: '',
  feedbackDays: 0,
  sampleDays: 0
})
let currentDurationIndex = -1

const handleDurationEdit = (row: any) => {
  currentDurationIndex = sampleDurations.value.findIndex(i => i.type === row.type)
  durationEditForm.value = JSON.parse(JSON.stringify(row))
  durationEditDialogVisible.value = true
}

const saveDurationEdit = () => {
  if (currentDurationIndex > -1) {
    sampleDurations.value[currentDurationIndex] = JSON.parse(JSON.stringify(durationEditForm.value))
  }
  durationEditDialogVisible.value = false
  ElMessage.success('时效标准已更新')
}

// 提案节点审批人配置数据 (矩阵版)
const approverConfigs = ref([
  {
    grade: 'S',
    mandatoryL2: true,
    configs: [
      { platform: 'Amazon', firstApprover: ['张经理'], l2Triggers: ['mold'], costThreshold: 1000, secondApprover: ['陈副总'] },
      { platform: 'Tiktok', firstApprover: ['李总监'], l2Triggers: ['mold'], costThreshold: 1000, secondApprover: ['陈副总'] }
    ]
  },
  {
    grade: 'A',
    mandatoryL2: true,
    configs: [
      { platform: 'Amazon', firstApprover: ['李总监'], l2Triggers: [], costThreshold: 1000, secondApprover: ['陈副总'] },
      { platform: 'Tiktok', firstApprover: ['王组长'], l2Triggers: [], costThreshold: 1000, secondApprover: ['陈副总'] }
    ]
  },
  {
    grade: 'B',
    mandatoryL2: false,
    configs: [
      { platform: 'Tiktok', firstApprover: ['王组长'], l2Triggers: ['cost'], costThreshold: 2000, secondApprover: ['陈副总'] }
    ]
  },
  {
    grade: 'C',
    mandatoryL2: false,
    configs: [
      { platform: 'Amazon', firstApprover: ['王组长'], l2Triggers: [], costThreshold: 1000, secondApprover: [] },
      { platform: 'Tiktok', firstApprover: ['王组长'], l2Triggers: [], costThreshold: 1000, secondApprover: [] }
    ]
  }
])

const rdFeeApprovals = ref([
  { 
    id: 1, 
    minAmount: 0, 
    maxAmount: 100, 
    enabled: true,
    isDefault: false,
    rules: [
      { enabled: true, skipApproval: true, categories: ['纺织品', '服装'], group: '纺织品类组', approvers: [], approvalType: 'or', ccList: [] },
      { enabled: true, skipApproval: true, categories: [], group: '通用开发组', approvers: [], approvalType: 'or', ccList: [] }
    ]
  },
  { 
    id: 2, 
    minAmount: 100, 
    maxAmount: 300, 
    enabled: true,
    isDefault: false,
    rules: [
      { enabled: true, skipApproval: false, categories: ['纺织品', '服装'], group: '纺织品类组', approvers: ['王经理', '张总监'], approvalType: 'and', ccList: ['财务部'] },
      { enabled: true, skipApproval: true, categories: [], group: '通用开发组', approvers: [], approvalType: 'or', ccList: [] }
    ]
  },
  { 
    id: 3, 
    minAmount: 300, 
    maxAmount: 5000, 
    enabled: true,
    isDefault: false,
    rules: [
      { enabled: true, skipApproval: false, categories: ['纺织品', '服装'], group: '纺织品类组', approvers: ['王经理'], approvalType: 'or', ccList: ['财务部'] },
      { enabled: true, skipApproval: false, categories: [], group: '通用开发组', approvers: ['余郝~', '财务BP'], approvalType: 'or', ccList: ['项目办'] }
    ]
  },
  { 
    id: 4, 
    minAmount: 5000, 
    maxAmount: Infinity, 
    enabled: true,
    isDefault: true,
    rules: [
      { enabled: true, skipApproval: false, categories: [], group: '决策委员会', approvers: ['CEO', 'CFO'], approvalType: 'and', ccList: ['总经办'] }
    ]
  }
])

const rdEditDialogVisible = ref(false)
const rdEditForm = ref<any>({
  minAmount: 0,
  maxAmount: 100,
  enabled: true,
  isDefault: false,
  rules: []
})
let currentRdEditingIndex = -1

const handleRdEdit = (row: any) => {
  currentRdEditingIndex = rdFeeApprovals.value.findIndex(item => item.id === row.id)
  const cloned = JSON.parse(JSON.stringify(row))
  // 确保旧数据也有 approvalType 属性，保证响应式
  cloned.rules.forEach((rule: any) => {
    if (!rule.approvalType) rule.approvalType = 'or'
    if (!rule.approvers) rule.approvers = []
  })
  rdEditForm.value = cloned
  rdEditDialogVisible.value = true
}

const handleRdAdd = () => {
  currentRdEditingIndex = -1
  const maxMin = Math.max(...rdFeeApprovals.value.filter(i => !i.isDefault).map(i => i.maxAmount))
  rdEditForm.value = {
    id: Date.now(),
    minAmount: maxMin || 0,
    maxAmount: (maxMin || 0) + 100,
    enabled: true,
    skipApproval: false,
    isDefault: false,
    rules: [
      { enabled: true, skipApproval: false, categories: [], group: '', approvers: [], approvalType: 'or', ccList: [] }
    ]
  }
  rdEditDialogVisible.value = true
}


const saveRdEdit = () => {
  if (currentRdEditingIndex > -1) {
    rdFeeApprovals.value[currentRdEditingIndex] = JSON.parse(JSON.stringify(rdEditForm.value))
  } else {
    rdFeeApprovals.value.push(JSON.parse(JSON.stringify(rdEditForm.value)))
  }
  rdFeeApprovals.value.sort((a, b) => {
    if (a.isDefault) return 1
    if (b.isDefault) return -1
    return a.minAmount - b.minAmount
  })
  rdEditDialogVisible.value = false
}

const handleRdDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除金额区间 [${row.minAmount} - ${row.maxAmount === Infinity ? '∞' : row.maxAmount}] 吗？删除后该区间的业务路由将全部失效。`,
    '删除警告',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(() => {
    rdFeeApprovals.value = rdFeeApprovals.value.filter(item => item.id !== row.id)
    ElMessage.success('已成功删除该金额区间')
  }).catch(() => {})
}

const addRdRule = () => {
  rdEditForm.value.rules.push({ enabled: true, skipApproval: false, categories: [], group: '', approvers: [], approvalType: 'or', ccList: [] })
}

const removeRdRule = (index: number) => {
  rdEditForm.value.rules.splice(index, 1)
}

const getAmountRiskColor = (amount: number) => {
  if (amount < 500) return '#16a34a'
  if (amount < 1000) return '#ca8a04'
  return '#dc2626'
}

const filteredApprovals = computed(() => {
  return rdFeeApprovals.value.filter(item => {
    const kw = searchKeyword.value.toLowerCase()
    if (!kw) return true
    return item.rules.some(rule => 
      (rule.group && rule.group.toLowerCase().includes(kw)) || 
      (rule.approver && rule.approver.toLowerCase().includes(kw))
    )
  })
})

const filteredApproverList = computed(() => {
  return approverConfigs.value.map(gradeGroup => {
    return {
      ...gradeGroup,
      configs: gradeGroup.configs.filter(c => !filterPlatform.value || c.platform === filterPlatform.value)
    }
  }).filter(group => group.configs.length > 0)
})

const getGradeType = (grade: string) => {
  const map: any = { S: 'danger', A: 'warning', B: 'primary', C: 'success', D: 'info' }
  return map[grade] || 'info'
}

const editDialogVisible = ref(false)
const editForm = ref<any>({
  grade: '',
  mandatoryL2: false,
  configs: []
})
let currentEditingIndex = -1

const handleEdit = (row: any) => {
  currentEditingIndex = approverConfigs.value.findIndex(item => item === row)
  editForm.value = JSON.parse(JSON.stringify(row))
  editDialogVisible.value = true
}

const handleAdd = () => {
  currentEditingIndex = -1
  editForm.value = {
    grade: '',
    mandatoryL2: false,
    configs: [
      { platform: '', firstApprover: [], l2Triggers: [], costThreshold: 1000, secondApprover: [] }
    ]
  }
  editDialogVisible.value = true
}

const saveEdit = () => {
  if (currentEditingIndex > -1) {
    approverConfigs.value[currentEditingIndex] = JSON.parse(JSON.stringify(editForm.value))
  } else {
    approverConfigs.value.push(JSON.parse(JSON.stringify(editForm.value)))
    // 按级别排序 (优先处理 S-A-B-C-D，其余按字母)
    const order = ['S', 'A', 'B', 'C', 'D']
    approverConfigs.value.sort((a, b) => {
      const idxA = order.indexOf(a.grade)
      const idxB = order.indexOf(b.grade)
      if (idxA > -1 && idxB > -1) return idxA - idxB
      if (idxA > -1) return -1
      if (idxB > -1) return 1
      return a.grade.localeCompare(b.grade)
    })
  }
  editDialogVisible.value = false
}

const addPlatformConfig = () => {
  editForm.value.configs.push({
    platform: '',
    firstApprover: [],
    l2Triggers: [],
    costThreshold: 1000,
    secondApprover: []
  })
}

const removePlatformConfig = (index: number) => {
  editForm.value.configs.splice(index, 1)
}
</script>

<style scoped lang="scss">
$color-bg: #f3f4f6;
$color-surface: #ffffff;
$color-border: #e2e8f0;
$color-text-primary: #111827;
$color-text-secondary: #6b7280;
$color-brand: #2563eb;

.settings-master-detail {
  height: 100%; display: flex; flex-direction: column; background: $color-bg; font-family: -apple-system, sans-serif;

  .md-header {
    background: $color-surface; border-bottom: 1px solid $color-border; padding: 0 32px; height: 72px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    .header-content { width: 100%; max-width: 1780px; display: flex; justify-content: space-between; align-items: center; }
    .header-titles {
      h2 { margin: 0; font-size: 20px; font-weight: 600; color: $color-text-primary; }
      p { margin: 2px 0 0; font-size: 12px; color: $color-text-secondary; text-transform: uppercase; letter-spacing: 0.5px; }
    }
  }

  .md-layout-body {
    flex: 1; display: flex; overflow: hidden; width: 100%;
  }

  /* 左侧菜单 */
  .md-sidebar {
    width: 280px; background: $color-surface; border-right: 1px solid $color-border; display: flex; flex-direction: column; flex-shrink: 0;
    .sidebar-search { padding: 20px 24px; border-bottom: 1px solid transparent; }
    .md-menu {
      list-style: none; padding: 12px; margin: 0; overflow-y: auto;
      .menu-group-title { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; padding: 12px 12px 8px; letter-spacing: 0.5px; &.mt-4 { margin-top: 16px; } }
      .menu-item {
        display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; margin-bottom: 4px;
        .item-icon { width: 36px; height: 36px; border-radius: 8px; background: #f3f4f6; color: #4b5563; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.2s; }
        .item-text { display: flex; flex-direction: column; gap: 2px; .title { font-size: 14px; font-weight: 500; color: $color-text-primary; } .desc { font-size: 12px; color: $color-text-secondary; } }
        
        &:hover { background: #f9fafb; }
        &.active {
          background: #eff6ff;
          .item-icon { background: $color-brand; color: #fff; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
          .item-text .title { color: $color-brand; font-weight: 600; }
        }
      }
    }
  }

  /* 右侧详情 */
  .md-content {
    flex: 1; padding: 0; padding-left: 12px; overflow-y: auto; background: #f3f4f6;
    
    .detail-pane {
      background: $color-surface; border-radius: 0; border: none; min-height: 100%;
      .pane-header {
        padding: 32px; border-bottom: 1px solid $color-border; display: flex; justify-content: space-between; align-items: flex-start;
        h3 { margin: 0 0 8px 0; font-size: 22px; font-weight: 600; color: $color-text-primary; }
        p { margin: 0; font-size: 14px; color: $color-text-secondary; max-width: 600px; line-height: 1.5; }
        .actions { display: flex; gap: 16px; }
      }
      .pane-body { padding: 32px; }
    }
  }

  /* 审批模式胶囊切换器 (通用) */
  .logic-capsule-wrapper {
    display: inline-flex; align-items: center; gap: 8px;
    &.column-mode { margin: 0 auto; }
    
    .logic-capsule {
      display: flex; background: #f1f5f9; border-radius: 20px; padding: 2px; border: 1px solid #e2e8f0; width: fit-content;
      .capsule-item {
        padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; color: #64748b; transition: all 0.2s;
        .el-icon { font-size: 14px; }
        &:hover { color: $color-brand; background: rgba(37, 99, 235, 0.05); }
        &.active { background: #fff !important; color: $color-brand !important; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        &.mini { padding: 2px 8px; font-size: 11px; .el-icon { font-size: 12px; } }
      }
    }
    .logic-help-icon { color: #94a3b8; font-size: 14px; cursor: help; &:hover { color: $color-brand; } }
  }

  .mode-placeholder { color: #94a3b8; font-size: 12px; font-style: italic; }

  /* 审批模式选择器优化 (已弃用，保留结构兼容) */
  .approver-edit-cell {
    display: flex; flex-direction: column; gap: 8px; padding: 4px 0;
  }
  .approver-edit-stack {
    display: flex; flex-direction: column; gap: 8px;
  }

  /* 表格样式定制 */
  .detail-table {
    --el-table-border-color: #e5e7eb;
    :deep(.el-table__header) th { background: #f9fafb !important; color: #4b5563; font-size: 12px; font-weight: 600; height: 48px; }
    
    .rank-tag {
      display: inline-flex; align-items: center; border-radius: 6px; overflow: hidden; border: 1px solid currentColor; font-weight: 700; font-size: 12px;
      .l { padding: 2px 8px; color: #fff; } .r { padding: 2px 8px; background: #fff; }
      &.s { color: #dc2626; .l { background: #dc2626; } }
      &.a { color: #ea580c; .l { background: #ea580c; } }
      &.b { color: #2563eb; .l { background: #2563eb; } }
      &.c { color: #16a34a; .l { background: #16a34a; } }
      &.d { color: #4b5563; .l { background: #4b5563; } }
    }

    .full-input { width: 100%; :deep(.el-input__wrapper) { box-shadow: none !important; border: 1px solid transparent; background: transparent; transition: all 0.2s; &:hover { background: #f3f4f6; } &.is-focus { border-color: $color-brand; background: #fff; } } }

    .visual-range {
      display: inline-flex; align-items: center; background: #f3f4f6; border-radius: 8px; padding: 4px; border: 1px solid #e5e7eb;
      .part { display: flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 6px; font-family: monospace; font-size: 13px; font-weight: 600;
        .sym { font-weight: 800; }
        &.inc { background: #fff; color: $color-text-primary; box-shadow: 0 1px 2px rgba(0,0,0,0.05); .sym { color: #16a34a; } }
        &.exc { color: $color-text-secondary; .sym { color: #9ca3af; } }
      }
      .divider { width: 1px; height: 16px; background: #d1d5db; margin: 0 4px; }
    }

    .chips-group { display: flex; flex-wrap: wrap; gap: 6px; .chip { background: #f3f4f6; color: #4b5563; padding: 2px 8px; border-radius: 4px; font-size: 12px; } }
    
    .platform-cell { display: flex; align-items: center; gap: 8px; font-weight: 600; .el-icon { font-size: 16px; color: $color-brand; } }

    /* 高级矩阵表格特有样式 */
    &.pro-matrix-table {
      :deep(.el-table__row) td { padding: 16px 0; }
      .dim-cell { 
        display: flex; flex-direction: column; gap: 8px; 
        &.display {
          .platforms-display { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; .platform-tag { display: flex; align-items: center; gap: 4px; padding: 0 6px; } }
        }
      }
      .platform-mini { display: flex; align-items: center; gap: 4px; font-size: 12px; color: $color-text-secondary; .el-icon { color: $color-brand; } }
      
      .approver-chips { display: flex; flex-wrap: wrap; gap: 6px; }
      .trigger-display { .no-trigger { color: #9ca3af; font-size: 12px; font-style: italic; } .trigger-items { display: flex; flex-wrap: wrap; gap: 6px; } }
      .skip-node { color: #9ca3af; font-size: 12px; }

      .mandatory-trigger-tag {
        display: flex; align-items: center; gap: 8px; color: #10b981; font-size: 12px; font-weight: 600;
        padding: 8px 12px; background: #f0fdf4; border-radius: 6px; border: 1px solid #dcfce7;
        .el-icon { font-size: 16px; }
      }

      .trigger-config-cell {
        display: flex; flex-direction: column; gap: 8px;
        :deep(.el-checkbox) { margin-right: 12px; height: 20px; .el-checkbox__label { font-size: 12px; padding-left: 6px; } }
        .cost-threshold-input {
          display: flex; align-items: center; gap: 4px; padding: 4px 8px; background: #eff6ff; border-radius: 4px; width: fit-content;
          .prefix { font-size: 11px; color: $color-brand; font-weight: bold; }
          .unit { font-size: 11px; color: #9ca3af; }
          :deep(.el-input-number) { width: 70px; .el-input__wrapper { background: transparent; box-shadow: none !important; border-bottom: 1px solid #dcdfe6; border-radius: 0; padding: 0 2px; } }
        }
      }

      .node-disabled {
        opacity: 0.4; filter: grayscale(1);
        :deep(.el-input__inner) { cursor: not-allowed; }
      }

      /* 矩阵分组样式 */
      .platform-configs-list {
        display: flex; flex-direction: column; gap: 12px;
        .platform-row {
          display: flex; align-items: center; gap: 24px; padding: 12px; background: #f9fafb; border-radius: 8px; border: 1px solid #f3f4f6;
          .platform-info { width: 100px; flex-shrink: 0; .platform-tag { font-weight: 600; display: flex; align-items: center; gap: 4px; } }
          .approver-info {
            flex: 1; display: flex; gap: 32px;
            .node {
              display: flex; align-items: center; gap: 8px;
              .label { font-size: 12px; color: #9ca3af; }
              .chips { display: flex; gap: 4px; }
              .skip { font-size: 12px; color: #d1d5db; font-style: italic; }
              .placeholder { font-size: 12px; color: #fbbf24; }
            }
          }
          .trigger-info {
            width: 180px; text-align: right; font-size: 12px;
            .mandatory { color: #10b981; font-weight: 600; }
            .condition { color: #6b7280; display: flex; flex-direction: column; gap: 2px; }
            .none { color: #d1d5db; }
          }
        }
      }
    }
  }

  /* 弹窗样式 */
  .edit-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; .grade-label { font-weight: 600; } }
  .edit-sub-table { margin-bottom: 16px; }
  .dialog-actions { margin-bottom: 24px; }
  .trigger-edit { display: flex; align-items: center; gap: 12px; }
  .mandatory-text { color: #10b981; font-weight: 600; font-size: 12px; }

  .matrix-hint { margin-top: 20px; font-size: 12px; display: flex; align-items: center; gap: 6px; padding: 12px; background: #fffbeb; border-radius: 8px; color: #b45309; .el-icon { color: #f59e0b; } }
  .pane-search { width: 240px; }

  /* 研发费特有样式 */
  .identity-node {
    display: flex; align-items: center; gap: 12px; min-width: 140px;
    .icon-box {
      width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px;
    }
    .text { display: flex; flex-direction: column; gap: 2px; }
    .role-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; }
    .name { font-size: 14px; font-weight: 600; color: #1e293b; }

    &.node-group { .icon-box { background: #f0f9ff; color: #0369a1; } }
    &.node-approver { 
      .icon-box { background: #fdf2f8; color: #be185d; } 
      .skip-icon { background: #f0fdf4; color: #16a34a; }
      .skip-text { color: #16a34a; font-style: italic; }
    }
    &.node-cc { 
      .icon-box { background: #f0fdf4; color: #15803d; }
      min-width: 250px;
      .cc-tag-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
      .none-text { font-size: 12px; color: #cbd5e1; }
    }
  }

  .flow-connector {
    display: flex; align-items: center; justify-content: center; color: #cbd5e1; font-size: 18px;
    &.sub { color: #e2e8f0; font-size: 14px; margin: 0 -8px; }
  }

  .node-flow {
    display: flex; align-items: center; gap: 16px;
    .approver-node, .cc-nodes { display: flex; flex-direction: column; gap: 4px; align-items: center; }
    .role-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }
    .flow-arrow { color: #d1d5db; font-size: 16px; }
    .chip.mini { padding: 1px 6px; font-size: 11px; background: #f8fafc; border: 1px dashed #cbd5e1; }
  }
  .default-rule-text { color: #64748b; font-style: italic; font-size: 13px; }

  /* 操作日志样式 (参考物料详情) */
  .history-timeline-wrapper {
    padding: 8px 12px; max-height: 500px; overflow-y: auto;
    :deep(.el-timeline-item__node) { background-color: $color-brand; }
    .history-round-card {
      padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; transition: all 0.2s;
      &:hover { background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: $color-brand; }
      .h-card-header {
        display: flex; justify-content: space-between; align-items: center;
        .h-round-no { font-size: 14px; font-weight: 700; color: #1e293b; }
      }
      .h-card-reason { font-size: 13px; color: #64748b; line-height: 1.6; word-break: break-all; }
    }
  }
}

/* 审批模式胶囊切换器 (独立于 Master-Detail 容器以支持 Append-to-body 弹窗) */
.logic-capsule-wrapper {
  display: inline-flex; align-items: center; gap: 8px; justify-content: center; width: 100%;
  
  .logic-capsule {
    display: flex; background: #f1f5f9; border-radius: 20px; padding: 2px; border: 1px solid #e2e8f0; width: fit-content;
    .capsule-item {
      padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; color: #64748b; transition: all 0.2s;
      .el-icon { font-size: 14px; }
      &:hover { color: #2563eb; background: rgba(37, 99, 235, 0.05); }
      &.active { background: #fff !important; color: #2563eb !important; box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important; }
      &.mini { padding: 2px 10px; font-size: 11px; .el-icon { font-size: 12px; } }
    }
  }
}

.mode-placeholder { color: #94a3b8; font-size: 12px; font-style: italic; }

/* 过渡动画 */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }
</style>

<!-- 审批配置专项样式 (非 Scoped，确保支持 Body 挂载的弹窗) -->
<style lang="scss">
.approval-config-container {
  .logic-capsule-wrapper {
    display: inline-flex; align-items: center; gap: 8px; justify-content: center; width: 100%;
    
    .logic-capsule {
      display: flex; background: #f1f5f9; border-radius: 20px; padding: 2px; border: 1px solid #e2e8f0; width: fit-content;
      .capsule-item {
        padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; color: #64748b; transition: all 0.2s;
        .el-icon { font-size: 14px; }
        &:hover { color: #2563eb; background: rgba(37, 99, 235, 0.05); }
        &.active { background: #fff !important; color: #2563eb !important; box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important; }
        &.mini { padding: 2px 10px; font-size: 11px; .el-icon { font-size: 12px; } }
      }
    }
  }
  .mode-placeholder { color: #94a3b8; font-size: 12px; font-style: italic; }
}
</style>
