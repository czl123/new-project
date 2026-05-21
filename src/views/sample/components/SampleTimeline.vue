<template>
  <div class="operation-log-container">
    <div class="log-scroll-box">
      <el-timeline v-if="data && data.length > 0">
        <el-timeline-item
          v-for="(log, index) in data"
          :key="index"
          :timestamp="log.timestamp"
          placement="top"
          class="custom-timeline-item"
        >
          <!-- 自定义节点样式 -->
          <template #node>
            <div class="custom-node" :class="[log.type || 'info']" :style="{ backgroundColor: log.color }">
              <div class="inner-dot"></div>
            </div>
          </template>

          <div class="log-item-card" :class="[log.type || 'info']">
            <!-- 左侧装饰色条 -->
            <div class="status-indicator"></div>
            
            <div class="card-body">
              <div class="log-header">
                <span class="log-content">{{ log.content }}</span>
                <div class="log-operator-pill">
                  <el-icon><User /></el-icon>
                  <span>{{ log.operator }}</span>
                </div>
              </div>
              
              <div v-if="log.remark" class="log-remark">
                <div class="remark-quote"></div>
                <div class="remark-text">{{ log.remark }}</div>
              </div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
      <div v-else class="empty-state">
        <el-empty description="暂无操作日志记录" :image-size="80" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue'

defineProps<{
  data: any[]
}>()
</script>

<style scoped lang="scss">
.operation-log-container {
  padding: 10px 0;
}

.log-scroll-box {
  max-height: 450px;
  overflow-y: auto;
  padding: 0 20px 10px 10px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;
  }
}

/* 1. 自定义时间轴项间距 */
.custom-timeline-item {
  padding-bottom: 25px;
  &:last-child {
    padding-bottom: 0;
  }
}

/* 2. 自定义节点样式：双层圆环 */
.custom-node {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  box-shadow: 0 0 0 3px #fff;

  .inner-dot {
    width: 6px;
    height: 6px;
    background: #fff;
    border-radius: 50%;
  }

  &.info { background-color: #94a3b8; }
  &.primary { background-color: #3b82f6; box-shadow: 0 0 0 3px #fff, 0 0 8px rgba(59, 130, 246, 0.4); }
  &.success { background-color: #10b981; }
  &.warning { background-color: #f59e0b; }
  &.danger { background-color: #ef4444; }
}

/* 3. 卡片精修 */
.log-item-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #edf2f7;
  border-radius: 8px;
  display: flex;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: #e2e8f0;
  }

  /* 状态指示条 */
  .status-indicator {
    width: 4px;
    background: #94a3b8;
    flex-shrink: 0;
  }

  &.primary .status-indicator { background: #3b82f6; }
  &.success .status-indicator { background: #10b981; }
  &.warning .status-indicator { background: #f59e0b; }
  &.danger .status-indicator { background: #ef4444; }

  .card-body {
    flex: 1;
    padding: 12px 16px;
  }
}

/* 4. 日志内容排版 */
.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .log-content {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    letter-spacing: -0.01em;
  }

  .log-operator-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    background: #f1f5f9;
    padding: 2px 10px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }
}

/* 5. 备注样式优化 */
.log-remark {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  
  .remark-quote {
    width: 2px;
    background: #cbd5e1;
    border-radius: 1px;
    flex-shrink: 0;
  }

  .remark-text {
    font-size: 13px;
    color: #475569;
    line-height: 1.6;
    font-style: italic;
  }
}

/* 6. 时间戳优化 */
:deep(.el-timeline-item__timestamp) {
  font-family: 'JetBrains Mono', 'Menlo', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 10px;
  display: inline-block;
  background: #f8fafc;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

/* 7. 空状态 */
.empty-state {
  padding: 40px 0;
  background: #fff;
  border-radius: 8px;
  border: 1px dashed #e2e8f0;
}

/* 调整时间轴主线颜色 */
:deep(.el-timeline-item__tail) {
  border-left: 2px solid #f1f5f9;
}
</style>
