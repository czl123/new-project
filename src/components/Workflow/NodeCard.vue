<template>
  <div class="node-card" :class="nodeClass" @click="$emit('click-node', nodeConfig)">
    <div class="node-header">
      <div class="title">
        <el-icon v-if="nodeConfig.type === 'approver'" class="mr-1"><Avatar /></el-icon>
        <el-icon v-else-if="nodeConfig.type === 'task'" class="mr-1"><Checked /></el-icon>
        <el-icon v-else-if="nodeConfig.type === 'system'" class="mr-1"><Cpu /></el-icon>
        <el-icon v-else-if="nodeConfig.type === 'cc'" class="mr-1"><Position /></el-icon>
        <el-icon v-else-if="nodeConfig.type === 'start'" class="mr-1"><UserFilled /></el-icon>
        <span>{{ nodeConfig.name }}</span>
      </div>
      <el-icon class="close-icon" v-if="nodeConfig.type !== 'start'" @click.stop="$emit('delete-node', nodeConfig.nodeId)"><Close /></el-icon>
    </div>
    <div class="node-content">
      <span class="text">{{ nodeConfig.content || '请设置' }}</span>
      <el-icon class="arrow-icon"><ArrowRight /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, Position, UserFilled, Close, ArrowRight, Checked, Cpu } from '@element-plus/icons-vue'

const props = defineProps({
  nodeConfig: {
    type: Object,
    required: true
  }
})

const nodeClass = computed(() => {
  return {
    'node-approver': props.nodeConfig.type === 'approver',
    'node-task': props.nodeConfig.type === 'task',
    'node-system': props.nodeConfig.type === 'system',
    'node-cc': props.nodeConfig.type === 'cc',
    'node-start': props.nodeConfig.type === 'start',
    'node-condition': props.nodeConfig.type === 'condition'
  }
})
</script>

<style lang="scss" scoped>
.node-card {
  width: 220px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.1);
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  z-index: 10;

  &:hover {
    box-shadow: 0 4px 10px 0 rgba(0,0,0,0.1);
    &::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      border: 1px solid #3b82f6;
      border-radius: 4px;
      pointer-events: none;
    }
    :deep(.close-icon) { display: block !important; }
  }

  .node-header {
    height: 24px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px 4px 0 0;
    color: #fff;
    font-size: 12px;

    .title {
      display: flex;
      align-items: center;
    }
    
    .close-icon {
      display: none;
      font-size: 14px;
      &:hover { color: #f87171; }
    }
  }

  .node-content {
    padding: 12px;
    font-size: 13px;
    color: #334155;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .arrow-icon {
      color: #cbd5e1;
      font-size: 14px;
    }
  }

  /* 颜色主题 */
  &.node-start .node-header { background: #94a3b8; }
  &.node-approver .node-header { background: #3b82f6; }
  &.node-task .node-header { background: #f59e0b; }
  &.node-system .node-header { background: #8b5cf6; }
  &.node-cc .node-header { background: #10b981; }
  
  &.node-condition {
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    .node-header {
      background: #fff;
      color: #10b981;
      border-bottom: 1px solid #e2e8f0;
    }
  }
}

.mr-1 { margin-right: 4px; }
</style>
