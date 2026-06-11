<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="540px"
    class="node-config-drawer"
    append-to-body
    destroy-on-close
  >
    <div v-if="currentNode" class="drawer-content">
      <el-form label-position="top" size="default">
        <!-- 通用属性：节点名称 -->
        <el-form-item label="节点名称">
          <el-input v-model="currentNode.name" placeholder="请输入节点名称" />
        </el-form-item>

        <!-- 审批人/处理人节点配置 -->
        <template v-if="currentNode.type === 'approver' || currentNode.type === 'task'">
          <div class="config-block mt-24">
            <div class="block-title">
              <el-icon class="title-icon" style="color: #409eff;"><Setting /></el-icon> 
              配置{{ currentNode.type === 'approver' ? '审批' : '处理' }}人规则：
            </div>
            
            <!-- 已选规则展示区 -->
            <div class="selected-rules-wrap" v-if="currentNode.props.approverRules?.length">
              <div v-for="(rule, index) in currentNode.props.approverRules" :key="index" class="rule-tag-item">
                <el-tag closable @close="removeRule(index)" effect="plain" type="primary">
                  <el-icon v-if="rule.type === 'user'"><User /></el-icon>
                  <el-icon v-else-if="rule.type === 'director'"><Avatar /></el-icon>
                  <el-icon v-else><Document /></el-icon>
                  {{ getRuleLabel(rule) }}
                </el-tag>
              </div>
            </div>
            <div v-else class="empty-rules-tip">暂未配置规则，请在下方添加</div>

            <!-- 添加规则的操作区 -->
            <div class="add-rule-actions mt-16">
              <el-dropdown trigger="click" @command="handleAddRule">
                <el-button type="primary" plain icon="Plus">添加审批来源</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="user">指定用户</el-dropdown-item>
                    <el-dropdown-item command="director">发起人的主管</el-dropdown-item>
                    <el-dropdown-item command="form">表单内人员</el-dropdown-item>
                    <el-dropdown-item command="form_director">表单人员的主管</el-dropdown-item>
                    <el-dropdown-item command="optional">发起人自选</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <!-- 规则详情编辑区 (点击添加后出现的具体配置) -->
            <div class="rule-config-panel mt-16" v-if="activeRuleType">
              <div class="panel-header">
                <span class="panel-title">配置详情：{{ activeRuleTitle }}</span>
                <el-icon class="close-panel" @click="activeRuleType = ''"><Close /></el-icon>
              </div>
              
              <div class="panel-body">
                <!-- 指定用户 -->
                <template v-if="activeRuleType === 'user'">
                  <el-select
                    v-model="tempRuleData.users"
                    multiple
                    placeholder="请选择人员"
                    style="width: 100%"
                  >
                    <el-option-group v-for="dept in deptTree" :key="dept.id" :label="dept.name">
                      <el-option
                        v-for="member in getAllMembers(dept)"
                        :key="member.empNo"
                        :label="member.name"
                        :value="member.name"
                      />
                    </el-option-group>
                  </el-select>
                </template>

                <!-- 主管级别选择 -->
                <template v-if="activeRuleType === 'director'">
                  <div class="flex-center">
                    <span>发起人的 </span>
                    <el-select v-model="tempRuleData.level" style="width: 150px; margin: 0 10px;">
                      <el-option label="一级主管" value="1" />
                      <el-option label="二级主管" value="2" />
                      <el-option label="三级主管" value="3" />
                    </el-select>
                  </div>
                </template>

                <!-- 表单人员 -->
                <template v-if="activeRuleType === 'form' || activeRuleType === 'form_director'">
                  <div class="flex-center">
                    <span>选择表单字段 </span>
                    <el-select v-model="tempRuleData.field" style="width: 180px; margin: 0 10px;">
                      <el-option label="采购员" value="purchaser" />
                      <el-option label="项目负责人" value="projectLead" />
                      <el-option label="技术支持" value="techSupport" />
                      <el-option label="需求人" value="requester" />
                      <el-option label="运营人员" value="operator" />
                    </el-select>
                    <span v-if="activeRuleType === 'form_director'"> 的主管</span>
                  </div>
                </template>

                <div class="panel-footer mt-16">
                  <el-button size="small" @click="activeRuleType = ''">取消</el-button>
                  <el-button size="small" type="primary" @click="confirmAddRule">确认添加</el-button>
                </div>
              </div>
            </div>
          </div>

          <el-divider class="slim-divider" />

          <!-- 多人审批时审批方式 -->
          <div class="config-block" v-if="currentNode.type === 'approver'">
            <div class="block-title">
              <el-icon class="title-icon" style="color: #67c23a;"><UserFilled /></el-icon> 多人/多规则审批方式：
            </div>
            <el-radio-group v-model="currentNode.props.signType" class="vertical-radio-group">
              <el-radio label="and">会签 (所有规则定义的审批人都同意后，流转至下一节点)</el-radio>
              <el-radio label="or">或签 (任何一个定义的审批人同意后，流转至下一节点)</el-radio>
            </el-radio-group>
          </div>

          <template v-if="currentNode.type === 'approver'">
            <el-divider class="slim-divider" />
            <div class="config-block">
              <div class="block-title">
                <el-icon class="title-icon" style="color: #e6a23c;"><Edit /></el-icon> 第一级审批时允许操作：
              </div>
              <el-checkbox-group v-model="currentNode.props.firstLevelActions" class="vertical-checkbox-group">
                <el-checkbox label="edit">单据已提交审核但未进行审批时，可以编辑</el-checkbox>
                <el-checkbox label="delete">删除</el-checkbox>
              </el-checkbox-group>
            </div>
          </template>

          <template v-else>
             <el-divider class="slim-divider" />
             <div class="config-block">
                <div class="block-title">
                  <el-icon class="title-icon" style="color: #409eff;"><Edit /></el-icon> 处理要求：
                </div>
                <div class="indented">
                  <el-checkbox v-model="currentNode.props.needAttachment">必须上传附件</el-checkbox>
                  <el-checkbox v-model="currentNode.props.needRemark">必须填写备注</el-checkbox>
                </div>
             </div>
          </template>
        </template>

        <!-- 系统自动处理节点配置 -->
        <template v-else-if="currentNode.type === 'system'">
           <div class="config-block mt-24">
              <div class="block-title">
                <el-icon class="title-icon" style="color: #8b5cf6;"><Cpu /></el-icon> 
                自动化任务配置：
              </div>
              <div class="panel-body" style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <el-form-item label="系统执行动作">
                  <el-select v-model="currentNode.props.action" placeholder="请选择自动执行的任务" style="width: 100%">
                    <el-option label="自动匹配关联物料" value="match_material" />
                    <el-option label="自动同步至 ERP" value="sync_erp" />
                    <el-option label="自动更新单据状态" value="update_status" />
                    <el-option label="生成 PDF 归档" value="gen_pdf" />
                  </el-select>
                </el-form-item>
                <div class="tip-text" style="color: #64748b; line-height: 1.6;">
                  提示：该节点由系统后端异步执行，执行成功后流程将自动流转至下一节点。
                  若执行失败，流程将暂停并通知管理员。
                </div>
              </div>
           </div>
        </template>

        <!-- 抄送人节点配置 (简化版) -->
        <template v-else-if="currentNode.type === 'cc'">
          <el-form-item label="选择抄送人">
             <el-select v-model="currentNode.props.nodeUserList" placeholder="请选择抄送人" class="w-full" multiple>
              <el-option-group v-for="dept in deptTree" :key="dept.id" :label="dept.name">
                <el-option v-for="member in getAllMembers(dept)" :key="member.empNo" :label="member.name" :value="member.name" />
              </el-option-group>
            </el-select>
          </el-form-item>
        </template>

        <!-- 条件节点配置 -->
        <template v-else-if="currentNode.type === 'condition'">
          <div class="config-section">
            <div class="section-title">基本信息</div>
            <div class="form-row">
              <span class="row-label">分支名称</span>
              <el-input v-model="currentNode.name" placeholder="请输入分支名称" class="flex-1" />
            </div>
          </div>

          <div class="config-section mt-24">
            <div class="section-title">配置条件</div>
            <div class="condition-rules-box">
              <div v-for="(rule, index) in conditionRules" :key="index" class="rule-row">
                <el-select v-model="rule.field" placeholder="字段" class="rule-select">
                  <el-option label="发起人部门" value="dept" />
                  <el-option label="发起人角色" value="role" />
                  <el-option label="采购金额" value="amount" />
                  <el-option label="商品类型" value="type" />
                </el-select>
                <el-select v-model="rule.operator" placeholder="逻辑" class="rule-select" style="width: 80px">
                  <el-option label="=" value="=" />
                  <el-option label="!=" value="!=" />
                  <el-option label=">" value=">" />
                  <el-option label="<" value="<" />
                </el-select>
                <el-input v-model="rule.value" placeholder="值" class="rule-input" />
                <el-icon class="delete-icon" @click="removeCondition(index)"><Delete /></el-icon>
              </div>
              <el-button class="add-rule-btn" plain @click="addCondition"><el-icon><Plus /></el-icon> 条件</el-button>
            </div>
          </div>
        </template>
      </el-form>
    </div>
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存配置</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { 
  InfoFilled, Delete, Plus, Setting, User, UserFilled, 
  Edit, Document, Share, Close, Avatar, Checked, Cpu
} from '@element-plus/icons-vue'
import { deptTree } from '@/store/orgData'

const visible = ref(false)
const currentNode = ref<any>(null)
let originalNodeRef: any = null

const emit = defineEmits(['save'])

// 映射字典
const formFieldMap: Record<string, string> = {
  'purchaser': '采购员',
  'projectLead': '项目负责人',
  'techSupport': '技术支持',
  'requester': '需求人',
  'operator': '运营人员'
}
const levelMap: Record<string, string> = { '1': '一级主管', '2': '二级主管', '3': '三级主管' }
const systemActionMap: Record<string, string> = {
  'match_material': '自动匹配关联物料',
  'sync_erp': '自动同步至 ERP',
  'update_status': '自动更新单据状态',
  'gen_pdf': '生成 PDF 归档'
}

// 规则配置状态
const activeRuleType = ref('')
const tempRuleData = reactive<any>({ users: [], level: '1', field: '' })

const activeRuleTitle = computed(() => {
  const map: any = { user: '指定用户', director: '发起人的主管', form: '表单人员', form_director: '表单人员的主管', optional: '发起人自选' }
  return map[activeRuleType.value] || ''
})

const drawerTitle = computed(() => {
  if (!currentNode.value) return '节点配置'
  switch (currentNode.value.type) {
    case 'approver': return '审批人配置'
    case 'task': return '处理人配置'
    case 'system': return '系统自动处理'
    case 'cc': return '抄送人配置'
    case 'condition': return '条件设置'
    default: return '节点配置'
  }
})

const getAllMembers = (dept: any): any[] => {
  let members = [...(dept.members || [])]
  if (dept.children) dept.children.forEach((c: any) => members = [...members, ...getAllMembers(c)])
  return members
}

const open = (node: any) => {
  originalNodeRef = node
  currentNode.value = JSON.parse(JSON.stringify(node))
  if (!currentNode.value.props) currentNode.value.props = {}
  if (!currentNode.value.props.approverRules) currentNode.value.props.approverRules = []
  
  if (currentNode.value.type === 'condition') {
    conditionRules.value = currentNode.value.props.rules || [{ field: 'dept', operator: '=', value: '' }]
  }
  visible.value = true
}

// 规则管理
const handleAddRule = (type: string) => {
  activeRuleType.value = type
  tempRuleData.users = []
  tempRuleData.level = '1'
  tempRuleData.field = 'purchaser'
}

const confirmAddRule = () => {
  const rule: any = { type: activeRuleType.value }
  if (activeRuleType.value === 'user') rule.value = [...tempRuleData.users]
  else if (activeRuleType.value === 'director') rule.level = tempRuleData.level
  else if (activeRuleType.value === 'form' || activeRuleType.value === 'form_director') rule.field = tempRuleData.field
  
  currentNode.value.props.approverRules.push(rule)
  activeRuleType.value = ''
}

const removeRule = (index: number) => currentNode.value.props.approverRules.splice(index, 1)

const getRuleLabel = (rule: any) => {
  if (rule.type === 'user') return rule.value.join(', ')
  if (rule.type === 'director') return `发起人的${levelMap[rule.level]}`
  if (rule.type === 'form') return `表单内: ${formFieldMap[rule.field]}`
  if (rule.type === 'form_director') return `[${formFieldMap[rule.field]}] 的主管`
  return '发起人自选'
}

// 条件逻辑
const conditionRules = ref<any[]>([])
const addCondition = () => conditionRules.value.push({ field: '', operator: '=', value: '' })
const removeCondition = (index: number) => conditionRules.value.splice(index, 1)

const handleSave = () => {
  const props = currentNode.value.props
  if (currentNode.value.type === 'approver' || currentNode.value.type === 'task') {
    if (props.approverRules?.length > 0) {
      currentNode.value.content = props.approverRules.map((r: any) => getRuleLabel(r)).join(' + ')
    } else {
      currentNode.value.content = currentNode.value.type === 'approver' ? '未配置审批人' : '未配置处理人'
    }
  } else if (currentNode.value.type === 'system') {
    currentNode.value.content = systemActionMap[props.action] || '自动处理任务'
  } else if (currentNode.value.type === 'condition') {
    props.rules = conditionRules.value
    currentNode.value.content = conditionRules.value[0]?.field ? `${conditionRules.value[0].field}...` : '请设置条件'
  }
  
  Object.assign(originalNodeRef, currentNode.value)
  visible.value = false
  emit('save', originalNodeRef)
}

defineExpose({ open })
</script>

<script lang="ts">
export default { name: 'NodeConfigDrawer' }
</script>

<style lang="scss" scoped>
.node-config-drawer {
  .drawer-content { padding: 0 20px; }
  .mt-16 { margin-top: 16px; }
  .mt-24 { margin-top: 24px; }
  .flex-center { display: flex; align-items: center; font-size: 13px; color: #4b5563; }
  .w-full { width: 100%; }

  .selected-rules-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 6px;
    min-height: 40px;
  }

  .empty-rules-tip {
    font-size: 12px;
    color: #94a3b8;
    text-align: center;
    padding: 10px;
  }

  .rule-config-panel {
    background: #f1f5f9;
    border-radius: 8px;
    padding: 16px;
    position: relative;

    .panel-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      .panel-title { font-size: 13px; font-weight: bold; color: #1e293b; }
      .close-panel { cursor: pointer; color: #64748b; &:hover { color: #f87171; } }
    }
  }

  .config-block {
    .block-title {
      font-size: 13px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      .title-icon { margin-right: 8px; }
    }

    .vertical-radio-group, .vertical-checkbox-group {
      display: block;
      :deep(.el-radio), :deep(.el-checkbox) {
        display: flex;
        margin: 0 0 12px 0;
        align-items: flex-start;
        .el-radio__label, .el-checkbox__label { font-size: 13px; color: #4b5563; line-height: 1.6; white-space: normal; }
      }
    }
  }

  .condition-rules-box {
    background: #f8fafc;
    padding: 16px;
    border-radius: 6px;
    .rule-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      .rule-select { width: 120px; }
      .delete-icon { color: #f87171; cursor: pointer; }
    }
    .add-rule-btn { width: 100%; border-style: dashed; }
  }

  .slim-divider { margin: 24px 0; border-color: #f3f4f6; }
}
</style>
