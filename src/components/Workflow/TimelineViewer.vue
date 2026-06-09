<template>
  <div class="workflow-timeline-viewer">
    <el-timeline v-if="path && path.length > 0">
      <template v-for="(node, index) in path" :key="index">
        <el-timeline-item
          v-if="node"
          :type="getNodeType(node.status, index)"
          :color="getNodeColor(node.status, index)"
          :size="node.status === 'active' ? 'large' : 'normal'"
          :hollow="node.status === 'pending'"
        >
          <div class="timeline-content">
            <div class="header">
              <span class="name">{{ node.name }}</span>
              <el-tag size="small" :type="getTagType(node.status)" effect="plain" class="status-tag">
                {{ getStatusText(node.status, index) }}
              </el-tag>
            </div>
            <div class="desc">
              <el-icon class="mr-4"><User /></el-icon>
              <span>{{ node.content }}</span>
            </div>
          </div>
        </el-timeline-item>
      </template>
    </el-timeline>
    <el-empty v-else description="暂无审批流程数据" :image-size="60" />
  </div>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue'

const props = defineProps({
  path: {
    type: Array as () => any[],
    default: () => []
  },
  currentIndex: {
    type: Number,
    default: 0 // 当前走到第几步
  }
})

// 根据业务状态动态计算显示样式
const getNodeStatus = (baseStatus: string, index: number) => {
  if (index < props.currentIndex) return 'passed'
  if (index === props.currentIndex) return 'active'
  return 'pending'
}

const getNodeType = (status: string, index: number) => {
  const s = getNodeStatus(status, index)
  if (s === 'passed') return 'success'
  if (s === 'active') return 'primary'
  return 'info'
}

const getNodeColor = (status: string, index: number) => {
  const s = getNodeStatus(status, index)
  if (s === 'active') return '#3b82f6'
  return ''
}

const getTagType = (status: string) => {
  if (status === 'passed') return 'success'
  if (status === 'active') return 'primary'
  return 'info'
}

const getStatusText = (status: string, index: number) => {
  const s = getNodeStatus(status, index)
  if (s === 'passed') return '已完成'
  if (s === 'active') return '审批中'
  return '待处理'
}
</script>

<style lang="scss" scoped>
.workflow-timeline-viewer {
  padding: 16px 10px;
  
  .timeline-content {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px;
    margin-top: -6px; // 对齐圆点
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      .name {
        font-size: 13px;
        font-weight: 600;
        color: #1e293b;
      }
    }
    
    .desc {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #64748b;
    }
  }

  .mr-4 { margin-right: 4px; }
}
</style>
