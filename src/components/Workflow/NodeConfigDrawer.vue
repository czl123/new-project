<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    size="500px"
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

        <!-- 审批人节点配置 -->
        <template v-if="currentNode.type === 'approver'">
          <!-- 1. 选择审批对象 -->
          <div class="config-block mt-24">
            <div class="block-title">
              <el-icon class="title-icon" style="color: #409eff;"><Setting /></el-icon> 选择审批对象：
            </div>
            <el-radio-group v-model="currentNode.props.assigneeType" class="modern-radio-group">
              <el-radio label="user">指定用户</el-radio>
              <el-radio label="role">指定角色</el-radio>
              <el-radio label="optional">发起人自选</el-radio>
              <el-radio label="director">部门主管</el-radio>
            </el-radio-group>

            <!-- 动态下级选项 -->
            <div class="sub-options indented" v-if="currentNode.props.assigneeType === 'user'">
              <el-button type="primary" size="default">选择人员</el-button>
            </div>
            
            <div class="sub-options indented" v-if="currentNode.props.assigneeType === 'role'">
              <el-button type="primary" size="default">选择系统角色</el-button>
            </div>

            <div class="sub-options indented" v-if="currentNode.props.assigneeType === 'director'">
              <div class="director-select-row">
                <el-icon class="sub-icon" style="color: #e6a23c;"><User /></el-icon> 指定主管：
                <div class="select-wrapper">
                  发起人的 
                  <el-select v-model="currentNode.props.directorLevel" size="default" style="width: 120px; margin: 0 8px;">
                    <el-option label="上级主管" value="1" />
                    <el-option label="二级主管" value="2" />
                  </el-select>
                  <el-icon class="info-icon"><InfoFilled /></el-icon>
                </div>
              </div>
            </div>
          </div>

          <el-divider class="slim-divider" />

          <!-- 2. 多人审批时审批方式 -->
          <div class="config-block">
            <div class="block-title">
              <el-icon class="title-icon" style="color: #67c23a;"><UserFilled /></el-icon> 多人审批时审批方式：
            </div>
            <el-radio-group v-model="currentNode.props.signType" class="vertical-radio-group indented-more">
              <el-radio label="and">会签(所有人都审批通过后，流转至下一节点)</el-radio>
              <el-radio label="or">或签(任意一个人审批通过后，流转至下一节点)</el-radio>
            </el-radio-group>
          </div>

          <el-divider class="slim-divider" />

          <!-- 3. 第一级审批时允许操作 -->
          <div class="config-block">
            <div class="block-title">
              <el-icon class="title-icon" style="color: #e6a23c;"><Edit /></el-icon> 第一级审批时允许操作：
            </div>
            <el-checkbox-group v-model="currentNode.props.firstLevelActions" class="vertical-checkbox-group indented-more">
              <el-checkbox label="edit">单据已提交审核但未进行审批时，可以编辑</el-checkbox>
              <el-checkbox label="delete">删除</el-checkbox>
            </el-checkbox-group>
          </div>

          <el-divider class="slim-divider" />

          <!-- 4. 审批人删除或禁用后 -->
          <div class="config-block">
            <div class="block-title no-icon">审批人删除或禁用后：</div>
            <el-checkbox v-model="currentNode.props.autoTransferToAdmin" class="indented">自动转交给管理员</el-checkbox>
          </div>
        </template>

        <!-- 抄送人节点配置 -->
        <template v-else-if="currentNode.type === 'cc'">
          <el-form-item label="选择抄送人">
             <el-select v-model="currentNode.content" placeholder="请选择抄送人 (模拟)" class="w-full" multiple>
              <el-option label="财务部" value="财务部" />
              <el-option label="人事部" value="人事部" />
              <el-option label="老板" value="老板" />
            </el-select>
          </el-form-item>
          <div class="tip-text">抄送人将在流程到达此节点时收到通知，无需进行审批操作。</div>
        </template>

        <!-- 条件节点配置 -->
        <template v-else-if="currentNode.type === 'condition'">
          <!-- 基本信息 -->
          <div class="config-section">
            <div class="section-title">基本信息</div>
            <div class="form-row">
              <span class="row-label">分支名称</span>
              <el-input v-model="currentNode.name" placeholder="请输入分支名称" class="flex-1" />
            </div>
          </div>

          <!-- 配置条件 -->
          <div class="config-section mt-24">
            <div class="section-title">
              配置条件 
              <el-tooltip content="如果有多个条件，则同时满足时执行该分支" placement="top">
                <el-icon class="title-hint"><InfoFilled /></el-icon>
              </el-tooltip>
              <span class="title-desc">如有多个条件，则同时满足时执行该分支</span>
            </div>
            
            <div class="condition-rules-box">
              <div v-for="(rule, index) in conditionRules" :key="index" class="rule-row">
                <el-select v-model="rule.field" placeholder="请选择字段" class="rule-select" size="default">
                  <el-option label="采购员" value="buyer" />
                  <el-option label="采购金额" value="amount" />
                  <el-option label="商品类型" value="type" />
                </el-select>
                <el-select v-model="rule.operator" placeholder="请选择" class="rule-select" size="default">
                  <el-option label="等于" value="=" />
                  <el-option label="不等于" value="!=" />
                  <el-option label="包含" value="contains" />
                  <el-option label="大于" value=">" />
                  <el-option label="小于" value="<" />
                </el-select>
                <el-input v-model="rule.value" placeholder="请输入" class="rule-input" size="default" />
                <el-icon class="delete-icon" @click="removeRule(index)"><Delete /></el-icon>
              </div>
              
              <el-button class="add-rule-btn" plain @click="addRule">
                <el-icon><Plus /></el-icon> 条件
              </el-button>
            </div>
          </div>
        </template>
      </el-form>
    </div>
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { InfoFilled, Delete, Plus, Setting, User, UserFilled, Edit } from '@element-plus/icons-vue'

const visible = ref(false)
const currentNode = ref<any>(null)
let originalNodeRef: any = null // 引用原始节点用于保存

// 条件规则列表
const conditionRules = ref<any[]>([])

const drawerTitle = computed(() => {
  if (!currentNode.value) return '节点配置'
  switch (currentNode.value.type) {
    case 'approver': return '审批人配置'
    case 'cc': return '抄送人配置'
    case 'condition': return '条件设置'
    default: return '节点配置'
  }
})

const open = (node: any) => {
  originalNodeRef = node
  // 深拷贝一份用于编辑，避免实时污染画布
  currentNode.value = JSON.parse(JSON.stringify(node))
  
  // 确保 props 存在
  if (!currentNode.value.props) {
    currentNode.value.props = {}
  }

  // 初始化条件规则
  if (currentNode.value.type === 'condition') {
    conditionRules.value = currentNode.value.props.rules || [
      { field: 'buyer', operator: '=', value: '' }
    ]
  }
  
  visible.value = true
}

const emit = defineEmits(['save'])

const addRule = () => {
  conditionRules.value.push({ field: '', operator: '=', value: '' })
}

const removeRule = (index: number) => {
  conditionRules.value.splice(index, 1)
}

const handleSave = () => {
  // 根据不同的配置更新显示内容(简化的逻辑)
  if (currentNode.value.type === 'approver') {
    if (currentNode.value.props.assigneeType === 'director') currentNode.value.content = '直属主管'
    if (currentNode.value.props.assigneeType === 'optional') currentNode.value.content = '发起人自选'
  } else if (currentNode.value.type === 'condition') {
    currentNode.value.props.rules = conditionRules.value
    // 简易拼装描述显示在节点卡片上
    if (conditionRules.value.length > 0) {
      const firstRule = conditionRules.value[0]
      currentNode.value.content = firstRule.field ? `${firstRule.field} ${firstRule.operator} ${firstRule.value} ...` : '请设置条件'
    } else {
      currentNode.value.content = '请设置条件'
    }
  }
  
  // 将修改合并回原始节点
  Object.assign(originalNodeRef, currentNode.value)
  visible.value = false
  emit('save', originalNodeRef)
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.node-config-drawer {
  .drawer-content {
    padding: 0 10px;
  }
  
  .assignee-type-group {
    width: 100%;
    display: flex;
    :deep(.el-radio-button) {
      flex: 1;
      .el-radio-button__inner {
        width: 100%;
      }
    }
  }

  .w-full {
    width: 100%;
  }

  .tip-text {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.5;
  }
  
  .mt-2 { margin-top: 8px; }

  .condition-group-mock {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 16px;
    border-radius: 6px;
    width: 100%;

    .cg-title {
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 12px;
    }
  }

  /* 新版条件配置样式 */
  .config-section {
    margin-bottom: 24px;
    
    &.mt-24 {
      margin-top: 24px;
    }

    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      
      &::before {
        content: '';
        display: inline-block;
        width: 3px;
        height: 14px;
        background-color: #e6a23c; /* 橙色竖线 */
        margin-right: 8px;
        border-radius: 2px;
      }

      .title-hint {
        color: #1890ff;
        margin-left: 8px;
        margin-right: 4px;
        font-size: 14px;
      }

      .title-desc {
        font-size: 12px;
        color: #909399;
        font-weight: normal;
      }
    }

    .form-row {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .row-label {
        font-size: 13px;
        color: #606266;
        white-space: nowrap;
      }
      
      .flex-1 {
        flex: 1;
      }
    }
  }

  .condition-rules-box {
    background-color: #f5f7fa;
    padding: 16px;
    border-radius: 6px;

    .rule-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

      .rule-select {
        flex: 1;
      }

      .rule-input {
        flex: 1.5;
      }

      .delete-icon {
        color: #f56c6c;
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
        transition: opacity 0.3s;
        
        &:hover {
          opacity: 0.7;
        }
      }
    }

    .add-rule-btn {
      width: 100%;
      border-style: dashed;
      color: #606266;
      background: transparent;
      
      &:hover {
        color: #1890ff;
        border-color: #1890ff;
      }
    }
  }

  /* 审批人节点配置新样式 */
  .config-block {
    margin-bottom: 24px;
    
    &.mt-24 { margin-top: 24px; }

    .block-title {
      font-size: 13px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 16px;
      display: flex;
      align-items: center;

      .title-icon {
        font-size: 16px;
        color: #4b5563;
        margin-right: 8px;
      }
      
      &.no-icon {
        padding-left: 24px; /* 与有 icon 的对齐 */
        font-size: 13px;
        color: #4b5563;
      }
    }

    .modern-radio-group {
      display: flex;
      gap: 32px;
      padding-left: 24px;
      
      :deep(.el-radio) {
        margin-right: 0;
        .el-radio__label {
          color: #4b5563;
          font-size: 13px;
        }
        &.is-checked .el-radio__label {
          color: #3b82f6;
          font-weight: 600;
        }
      }
    }

    .sub-options {
      margin-top: 16px;
      
      &.indented {
        padding-left: 24px;
      }

      .director-select-row {
        display: flex;
        align-items: center;
        font-size: 13px;
        color: #4b5563;

        .sub-icon {
          margin-right: 6px;
          font-size: 15px;
          color: #6b7280;
        }

        .select-wrapper {
          display: flex;
          align-items: center;
          margin-left: 8px;
          background: #ffffff;
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid #d1d5db;

          .info-icon {
            color: #9ca3af;
            font-size: 14px;
            cursor: help;
          }
        }
      }
    }

    .vertical-radio-group,
    .vertical-checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
      
      &.indented-more {
        padding-left: 44px; /* 根据截图稍微往右缩进更多 */
      }

      :deep(.el-radio), :deep(.el-checkbox) {
        margin-right: 0;
        white-space: normal;
        height: auto;
        
        .el-radio__label, .el-checkbox__label {
          color: #4b5563;
          line-height: 1.5;
          font-size: 13px;
        }
      }
    }

    .indented {
      margin-left: 24px;
      :deep(.el-checkbox__label) { 
        color: #4b5563; 
        font-size: 13px;
      }
    }
  }

  .slim-divider {
    margin: 24px 0;
    border-color: #f3f4f6;
  }
}
</style>
