<template>
  <div class="kanban-page">
    <!-- 顶部统计概览 -->
    <div class="dashboard-header modern-card mb-16">
      <div class="stat-card">
        <div class="label">任务总数</div>
        <div class="value">158</div>
        <div class="trend up">较上周 +12%</div>
      </div>
      <div class="stat-card urgent">
        <div class="label">紧急待办</div>
        <div class="value">12</div>
        <div class="trend danger">逾期 5 项</div>
      </div>
      <div class="stat-card">
        <div class="label">平均拿样周期</div>
        <div class="value">5.4 <small>天</small></div>
        <div class="trend down">较上周 -0.2d</div>
      </div>
      <div class="stat-card success">
        <div class="label">本月已入库</div>
        <div class="value">86</div>
        <div class="trend">完成率 92%</div>
      </div>
    </div>

    <!-- 看板主区域 -->
    <div class="kanban-container custom-scrollbar">
      <div v-for="column in kanbanColumns" :key="column.status" class="kanban-column">
        <div class="column-header">
          <span class="dot" :style="{ backgroundColor: column.color }"></span>
          <span class="title">{{ column.label }}</span>
          <span class="count">{{ column.tasks.length }}</span>
        </div>
        
        <div class="column-body">
          <div 
            v-for="task in column.tasks" 
            :key="task.proposalNo" 
            class="task-card"
            :class="{ urgent: task.isUrgent }"
          >
            <div class="card-tag" v-if="task.isUrgent">紧急</div>
            <div class="task-top">
              <span class="no">{{ task.proposalNo }}</span>
              <span class="pm">{{ task.pm }}</span>
            </div>
            <div class="task-info">
              <el-image :src="task.image" class="task-img" />
              <div class="task-details">
                <div class="name">{{ task.productName }}</div>
                <div class="meta">{{ task.category }} | {{ task.level }}级</div>
              </div>
            </div>
            <div class="task-footer">
              <div class="time" :class="{ danger: task.remainingDays <= 3 }">
                <el-icon><Timer /></el-icon>
                <span>剩 {{ task.remainingDays }} 天</span>
              </div>
              <div class="assignees">
                <div 
                  v-for="user in task.assignees.slice(0, 2)" 
                  :key="user.name"
                  class="avatar-mini"
                  :style="{ backgroundColor: user.color }"
                  :title="user.name"
                >{{ user.name.charAt(0) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Timer } from '@element-plus/icons-vue'

const rawTasks = ref([
  {
    image: 'https://picsum.photos/100/100?random=1',
    proposalNo: 'TA-202605049',
    productName: 'DIY灯光板 - 亚克力透明款',
    pm: '颜沙沙',
    category: '家居装饰',
    level: 'C',
    remainingDays: 2,
    isUrgent: true,
    receiverStatus: '待反馈',
    assignees: [{ name: '张三', color: '#1890ff' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=11',
    proposalNo: 'TA-202605060',
    productName: '智能香薰机 - 木纹版',
    pm: '王小明',
    category: '生活电器',
    level: 'B',
    remainingDays: 8,
    isUrgent: false,
    receiverStatus: '待反馈',
    assignees: [{ name: '李华', color: '#52c41a' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=21',
    proposalNo: 'TA-202605065',
    productName: '人体工学鼠标 - 旗舰版',
    pm: '张学友',
    category: '数码配件',
    level: 'A',
    remainingDays: 9,
    isUrgent: true,
    receiverStatus: '已承接',
    assignees: [{ name: '黎明', color: '#1890ff' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=31',
    proposalNo: 'TA-202605071',
    productName: '智能猫砂盆 - 自动清理',
    pm: '严选',
    category: '宠物用品',
    level: 'S',
    remainingDays: 20,
    isUrgent: false,
    receiverStatus: '定制反馈',
    assignees: [{ name: '李想', color: '#1890ff' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=41',
    proposalNo: 'TA-202605076',
    productName: '折叠电动滑板车',
    pm: '颜沙沙',
    category: '出行工具',
    level: 'A',
    remainingDays: 6,
    isUrgent: true,
    receiverStatus: '购样申请',
    assignees: [{ name: '易烊千玺', color: '#1890ff' }]
  },
  {
    image: 'https://picsum.photos/100/100?random=51',
    proposalNo: 'TA-202605082',
    productName: '猫咪自动饮水机',
    pm: '颜沙沙',
    category: '宠物用品',
    level: 'B',
    remainingDays: 1,
    isUrgent: true,
    receiverStatus: '样品待反馈',
    assignees: [{ name: '张子枫', color: '#1890ff' }]
  }
])

const kanbanColumns = computed(() => [
  { label: '待反馈', status: '待反馈', color: '#d9d9d9', tasks: rawTasks.value.filter(t => t.receiverStatus === '待反馈') },
  { label: '已承接', status: '已承接', color: '#1890ff', tasks: rawTasks.value.filter(t => t.receiverStatus === '已承接') },
  { label: '定制反馈', status: '定制反馈', color: '#faad14', tasks: rawTasks.value.filter(t => t.receiverStatus === '定制反馈') },
  { label: '购样申请', status: '购样申请', color: '#722ed1', tasks: rawTasks.value.filter(t => t.receiverStatus === '购样申请') },
  { label: '样品评估', status: '样品待反馈', color: '#52c41a', tasks: rawTasks.value.filter(t => t.receiverStatus === '样品待反馈') }
])
</script>

<style lang="scss" scoped>
.kanban-page {
  padding: 16px;
  background: #f0f2f5;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modern-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.mb-16 { margin-bottom: 16px; }

.dashboard-header {
  display: flex;
  gap: 20px;
  padding: 20px 24px;
  flex-shrink: 0;
  
  .stat-card {
    flex: 1;
    .label { font-size: 13px; color: #8c8c8c; margin-bottom: 8px; }
    .value { font-size: 28px; font-weight: 800; color: #262626; margin-bottom: 4px; 
      small { font-size: 14px; font-weight: 400; }
    }
    .trend { font-size: 12px; color: #8c8c8c;
      &.up { color: #52c41a; }
      &.down { color: #f5222d; }
      &.danger { color: #f5222d; font-weight: 600; }
    }
    &.urgent .value { color: #f5222d; }
  }
}

.kanban-container {
  display: flex;
  gap: 16px;
  flex: 1;
  overflow-x: auto;
  padding-bottom: 12px;
}

.kanban-column {
  flex-shrink: 0;
  width: 300px;
  background: #ebedef;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  
  .column-header {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .title { font-weight: 700; color: #434343; font-size: 14px; }
    .count { 
      margin-left: auto;
      background: #d9d9d9;
      color: #595959;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 10px;
    }
  }
  
  .column-body {
    flex: 1;
    overflow-y: auto;
    padding: 0 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.task-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  border: 1px solid transparent;
  position: relative;
  cursor: grab;
  
  &:hover { border-color: #1890ff; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.2s; }
  
  &.urgent { border-left: 4px solid #f5222d; }
  
  .card-tag {
    position: absolute; top: 0; right: 12px; background: #f5222d; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 0 0 4px 4px;
  }
  
  .task-top {
    display: flex; justify-content: space-between; margin-bottom: 10px;
    .no { font-size: 12px; color: #8c8c8c; font-family: monospace; }
    .pm { font-size: 12px; color: #595959; }
  }
  
  .task-info {
    display: flex; gap: 10px; margin-bottom: 12px;
    .task-img { width: 48px; height: 48px; border-radius: 4px; flex-shrink: 0; }
    .task-details {
      .name { font-size: 13px; font-weight: 600; color: #262626; line-height: 1.4; margin-bottom: 4px; 
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
      }
      .meta { font-size: 11px; color: #8c8c8c; }
    }
  }
  
  .task-footer {
    display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f5f5f5; padding-top: 10px;
    .time { 
      display: flex; align-items: center; gap: 4px; font-size: 11px; color: #8c8c8c;
      &.danger { color: #f5222d; }
    }
    .assignees {
      display: flex;
      .avatar-mini {
        width: 20px; height: 20px; border-radius: 50%; color: #fff; font-size: 10px; 
        display: flex; align-items: center; justify-content: center; border: 1.5px solid #fff;
        margin-left: -6px;
        &:first-child { margin-left: 0; }
      }
    }
  }
}

.custom-scrollbar {
  &::-webkit-scrollbar { height: 8px; width: 6px; }
  &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
}
</style>
