<template>
  <div class="workflow-editor-container">
    <!-- 顶部工具栏 -->
    <div class="editor-toolbar">
      <div class="left">
        <el-button link @click="goBack" style="margin-right: 12px">
          <el-icon><Back /></el-icon> 返回
        </el-button>
        <span class="title">审批流程配置 <el-tag size="small" type="info" class="ml-4" v-if="bizType">{{ bizType }}</el-tag></span>
      </div>
      <div class="right">
        <el-button size="small" @click="zoomOut">-</el-button>
        <span class="zoom-text">{{ Math.round(zoom * 100) }}%</span>
        <el-button size="small" @click="zoomIn">+</el-button>
        <el-button type="primary" size="small" class="ml-4" @click="handleSave">保存配置</el-button>
      </div>
    </div>

    <!-- 画布区域 -->
    <div class="editor-canvas">
      <div 
        class="zoom-container" 
        :style="{ transform: `scale(${zoom})`, transformOrigin: '50% 0' }"
      >
        <WorkflowTree 
          :nodeConfig="workflowData" 
          @click-node="handleNodeClick"
          @add-node="handleAddNode"
          @delete-node="handleDeleteNode"
        />
      </div>
    </div>

    <NodeConfigDrawer ref="nodeConfigDrawerRef" @save="handleNodeSave" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Back } from '@element-plus/icons-vue'
import WorkflowTree from './WorkflowTree.vue'
import NodeConfigDrawer from './NodeConfigDrawer.vue'
import { mockWorkflowData } from './mockData'

const route = useRoute()
const router = useRouter()
const bizType = ref('')
const workflowData = ref(JSON.parse(JSON.stringify(mockWorkflowData)))

const loadConfig = async () => {
  if (!bizType.value) return
  
  try {
    const res = await fetch(`/api/workflow/def/get?bizType=${encodeURIComponent(bizType.value)}`)
    const result = await res.json()
    if (result.code === 200 && result.data && result.data.workflowJson) {
      workflowData.value = JSON.parse(result.data.workflowJson)
      ElMessage.success(`已加载 [${bizType.value}] 的现有配置`)
    }
  } catch (error) {
    console.error('加载配置失败:', error)
  }
}

onMounted(() => {
  bizType.value = route.query.bizType as string || ''
  loadConfig()
})
const zoom = ref(1)
const nodeConfigDrawerRef = ref<any>(null)

const zoomIn = () => { if (zoom.value < 2) zoom.value += 0.1 }
const zoomOut = () => { if (zoom.value > 0.5) zoom.value -= 0.1 }

const handleNodeClick = (node: any) => {
  if (node.type === 'start') {
    ElMessage.info('发起人节点默认不可配置复杂规则')
    return
  }
  nodeConfigDrawerRef.value?.open(node)
}

const handleNodeSave = (updatedNode: any) => {
  ElMessage.success('节点配置已更新')
}

const generateId = () => `node_${Math.random().toString(36).substring(2, 9)}`

const handleAddNode = ({ parentNode, type }: any) => {
  if (type === 'condition_branch') {
    // 为已有的路由节点增加一个新分支
    parentNode.conditionNodes.push({
      nodeId: generateId(),
      name: `条件${parentNode.conditionNodes.length + 1}`,
      type: 'condition',
      content: '请设置条件',
      childNode: null
    })
    return
  }

  const newNodeId = generateId()
  let newNode: any = {
    nodeId: newNodeId,
    type: type,
    childNode: parentNode.childNode // 继承原有的子节点
  }

  if (type === 'approver') {
    newNode.name = '审批人'
    newNode.content = '请设置审批人'
    newNode.props = { assigneeType: 'director', signType: 'and' }
  } else if (type === 'task') {
    newNode.name = '处理人'
    newNode.content = '请设置处理人'
    newNode.props = { assigneeType: 'form' }
  } else if (type === 'system') {
    newNode.name = '系统自动处理'
    newNode.content = '自动匹配关联物料'
    newNode.props = { action: 'match_material' }
  } else if (type === 'cc') {
    newNode.name = '抄送人'
    newNode.content = '请设置抄送人'
    newNode.props = {}
  } else if (type === 'route') {
    newNode.name = '路由'
    // 条件节点特殊结构
    newNode.conditionNodes = [
      {
        nodeId: generateId(),
        name: '条件1',
        type: 'condition',
        content: '请设置条件',
        childNode: null
      },
      {
        nodeId: generateId(),
        name: '条件2',
        type: 'condition',
        content: '请设置条件',
        childNode: null
      }
    ]
  }

  // 插入到当前节点之下
  parentNode.childNode = newNode
}

// 递归查找并删除节点
const handleDeleteNode = (nodeIdToDelete: string) => {
  const deleteFromTree = (currNode: any, parentNode: any = null): boolean => {
    if (!currNode) return false

    // 1. 如果匹配到普通节点
    if (currNode.nodeId === nodeIdToDelete) {
      if (parentNode) {
        if (parentNode.type === 'route') {
          // 如果父节点是路由，说明当前节点是一个分支(condition)，从数组中移除
          parentNode.conditionNodes = parentNode.conditionNodes.filter((c: any) => c.nodeId !== nodeIdToDelete)
          // 如果条件分支少于2个，则把整个路由节点删除
          if (parentNode.conditionNodes.length < 2) {
             handleDeleteNode(parentNode.nodeId)
          }
        } else if (parentNode.type === 'condition') {
           // 如果父节点是分支节点，说明当前节点是分支内部的首个节点
           parentNode.childNode = currNode.childNode
        } else {
          // 普通单向链表删除：将父节点的 childNode 指向被删除节点的 childNode
          parentNode.childNode = currNode.childNode
        }
      }
      return true
    }

    // 2. 如果当前节点是路由节点，遍历其所有分支寻找并删除
    if (currNode.type === 'route' && currNode.conditionNodes) {
      for (const conditionNode of currNode.conditionNodes) {
        // 先检查分支节点本身是否就是要删除的
        if (conditionNode.nodeId === nodeIdToDelete) {
           currNode.conditionNodes = currNode.conditionNodes.filter((c: any) => c.nodeId !== nodeIdToDelete)
           if (currNode.conditionNodes.length < 2) {
             handleDeleteNode(currNode.nodeId) // 分支不够了，自杀
           }
           return true
        }
        // 如果不是分支节点本身，深入分支内部寻找
        if (deleteFromTree(conditionNode.childNode, conditionNode)) {
          return true
        }
      }
    }

    // 3. 继续向下递归公共路径
    return deleteFromTree(currNode.childNode, currNode)
  }

  deleteFromTree(workflowData.value)
}

const handleSave = async () => {
  try {
    const res = await fetch('/api/workflow/def/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bizType: bizType.value,
        workflowData: workflowData.value
      })
    })
    
    if (res.ok) {
      const data = await res.json()
      ElMessage.success(`配置已成功同步到后端 (节点: ${data.data})`)
    } else {
      ElMessage.error('保存失败，请检查后端服务是否启动')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('网络请求异常，请确保后台 Java 服务 (8080端口) 已启动')
  }
}
</script>

<style lang="scss" scoped>
.workflow-editor-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 撑满全屏 */
  background: #f1f5f9;
}

.editor-toolbar {
  height: 54px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  z-index: 100;

  .title {
    font-weight: 700;
    color: #1e293b;
    font-size: 16px;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .zoom-text {
      font-size: 13px;
      color: #64748b;
      min-width: 40px;
      text-align: center;
    }
  }
}

.editor-canvas {
  flex: 1;
  overflow: auto;
  position: relative;
  display: flex;
  justify-content: center;
  padding: 40px 20px;

  /* 网格背景 */
  background-image: 
    linear-gradient(#e2e8f0 1px, transparent 1px),
    linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: center center;

  .zoom-container {
    transition: transform 0.2s ease;
    display: flex;
    justify-content: center;
    /* 确保容器宽度足够容纳最宽的分支 */
    min-width: 1000px; 
  }
}
</style>
