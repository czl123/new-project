<template>
  <div class="timeline-container">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :timestamp="activity.timestamp"
      >
        <div class="activity-content">
          <div class="activity-node">
            <span class="node-label">{{ activity.content }}</span>
            <el-tag v-if="activity.status" size="small" :type="activity.statusType" class="node-status">
              {{ activity.status }}
            </el-tag>
          </div>
          <div class="activity-meta">
            <span class="operator"><el-icon><User /></el-icon> {{ activity.operator }}</span>
            <span v-if="activity.remark" class="remark">备注：{{ activity.remark }}</span>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: any[]
}>()

const activities = computed(() => {
  if (!props.data || props.data.length === 0) {
    // 默认示例数据
    return [
      {
        content: '提交测试: 升级为确认样',
        timestamp: '2026-05-09 14:20',
        operator: '张三',
        type: 'primary',
        size: 'large',
        status: '合格',
        statusType: 'success',
        remark: '样品各项指标均符合大货生产要求。'
      },
      {
        content: '样品入库',
        timestamp: '2026-05-08 10:00',
        operator: '系统自动',
        remark: '调研样自动同步入库'
      },
      {
        content: '开发样登记',
        timestamp: '2026-05-08 09:30',
        operator: '李四'
      }
    ]
  }
  return props.data
})
</script>

<style scoped>
.timeline-container {
  padding: 10px 5px;
}
.activity-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.activity-node {
  display: flex;
  align-items: center;
  gap: 8px;
}
.node-label {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}
.activity-meta {
  font-size: 12px;
  color: #909399;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.operator {
  display: flex;
  align-items: center;
  gap: 4px;
}
.remark {
  background-color: #f4f4f5;
  padding: 4px 8px;
  border-radius: 4px;
  color: #606266;
}
</style>
