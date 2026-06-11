<template>
  <div class="workflow-tree">
    <!-- 当前节点渲染 -->
    <div class="node-wrap" v-if="nodeConfig">
      <!-- 渲染普通节点或条件路由 -->
      <template v-if="nodeConfig.type !== 'route'">
        <NodeCard 
          :nodeConfig="nodeConfig" 
          @click-node="$emit('click-node', $event)" 
          @delete-node="$emit('delete-node', $event)"
        />
        <AddNode @add-node="handleAddNode" />
      </template>

      <!-- 渲染条件路由分支 -->
      <template v-else>
        <div class="branch-wrap">
          <div class="branch-box">
            <el-button class="add-branch-btn" size="small" round @click="handleAddCondition">添加条件</el-button>
            <div class="col-box" v-for="(condNode, index) in nodeConfig.conditionNodes" :key="condNode.nodeId">
              <!-- 分支线条样式 -->
              <div class="top-left-cover-line" v-if="index === 0"></div>
              <div class="bottom-left-cover-line" v-if="index === 0"></div>
              <div class="top-right-cover-line" v-if="index === nodeConfig.conditionNodes.length - 1"></div>
              <div class="bottom-right-cover-line" v-if="index === nodeConfig.conditionNodes.length - 1"></div>
              
              <div class="condition-node-delete" v-if="nodeConfig.conditionNodes.length > 2" @click="$emit('delete-node', condNode.nodeId)">
                <el-icon><Close /></el-icon>
              </div>

              <!-- 递归渲染分支内部节点：标记为分支路径 -->
              <WorkflowTree 
                :nodeConfig="condNode" 
                :isBranch="true"
                @click-node="$emit('click-node', $event)"
                @add-node="$emit('add-node', $event)"
                @delete-node="$emit('delete-node', $event)"
              />
            </div>
          </div>
          <AddNode @add-node="handleAddNode" />
        </div>
      </template>

      <!-- 递归渲染子节点：保持当前的 isBranch 状态 -->
      <WorkflowTree 
        v-if="nodeConfig.childNode" 
        :nodeConfig="nodeConfig.childNode" 
        :isBranch="isBranch"
        @click-node="$emit('click-node', $event)"
        @add-node="$emit('add-node', $event)"
        @delete-node="$emit('delete-node', $event)"
      />
    </div>
    
    <!-- 流程结束标识：仅在主路径彻底终结时显示 -->
    <div class="end-node" v-if="isAbsoluteEnd">
      <div class="circle">流程结束</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Close } from '@element-plus/icons-vue'
import NodeCard from './NodeCard.vue'
import AddNode from './AddNode.vue'

const props = defineProps({
  nodeConfig: {
    type: Object,
    default: null
  },
  // 新增：标识当前是否处于分支路径中
  isBranch: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click-node', 'add-node', 'delete-node'])

// 判断是否为绝对终点：没有后续子节点，且当前不处于任何未汇聚的分支中
const isAbsoluteEnd = computed(() => {
  const node = props.nodeConfig
  if (!node) return false
  
  // 1. 如果还在分支路径中，即使没有后续节点，也不显示结束标识（因为它会汇聚到主路径）
  if (props.isBranch) return false
  
  // 2. 如果当前节点还有子节点，说明流程还在继续
  if (node.childNode) return false
  
  // 3. 路由节点（route）本身不直接挂结束标识，它的结束由其 childNode（汇聚点）决定
  if (node.type === 'route') return false
  
  // 4. 分支节点（condition）属于结构支撑，不显示结束标识
  if (node.type === 'condition') return false
  
  return true
})

const handleAddNode = (type: string) => {
  emit('add-node', { parentNode: props.nodeConfig, type })
}

const handleAddCondition = () => {
  emit('add-node', { parentNode: props.nodeConfig, type: 'condition_branch' })
}
</script>

<style lang="scss" scoped>
.condition-node-delete {
  position: absolute;
  top: -10px;
  right: 50%;
  transform: translateX(50%);
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: #f87171;
  font-size: 14px;
  cursor: pointer;
  z-index: 10;
  display: none;
}

.col-box:hover .condition-node-delete {
  display: flex;
}

.workflow-tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
}

.node-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
}

/* 结束节点 */
.end-node {
  font-size: 14px;
  color: #a3b2c6;
  text-align: center;
  margin-top: 20px;
  .circle {
    display: inline-block;
    width: 60px;
    height: 30px;
    line-height: 30px;
    background: #f1f5f9;
    border-radius: 15px;
  }
}

/* 分支容器 */
.branch-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
  margin-top: 15px;
}

.branch-box {
  display: flex;
  position: relative;
  border-bottom: 2px solid #cbd5e1;
  border-top: 2px solid #cbd5e1;
  background: #f8fafc; /* 背景为了遮盖竖线 */
  min-height: 180px;

  > .col-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    background: #f8fafc;
    padding: 30px 20px 0;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 2px;
      background: #cbd5e1;
      transform: translateX(-50%);
      z-index: 0;
    }
  }

  .add-branch-btn {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
}

/* 分支边缘线条遮盖逻辑 */
.top-left-cover-line, .bottom-left-cover-line, 
.top-right-cover-line, .bottom-right-cover-line {
  position: absolute;
  height: 3px;
  background: #f8fafc;
  z-index: 1;
}

.top-left-cover-line { top: -2px; left: -1px; width: 50%; }
.bottom-left-cover-line { bottom: -2px; left: -1px; width: 50%; }
.top-right-cover-line { top: -2px; right: -1px; width: 50%; }
.bottom-right-cover-line { bottom: -2px; right: -1px; width: 50%; }
</style>
