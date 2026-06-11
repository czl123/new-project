<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <el-popover placement="right-start" trigger="click" width="auto">
        <template #reference>
          <div class="btn">
            <el-icon><Plus /></el-icon>
          </div>
        </template>
        <div class="add-node-popover">
          <div class="item" @click="handleAdd('approver')">
            <el-icon class="icon approver"><Avatar /></el-icon>
            <span>审批人</span>
          </div>
          <div class="item" @click="handleAdd('task')">
            <el-icon class="icon task"><Checked /></el-icon>
            <span>处理人</span>
          </div>
          <div class="item" @click="handleAdd('system')">
            <el-icon class="icon system"><Cpu /></el-icon>
            <span>系统处理</span>
          </div>
          <div class="item" @click="handleAdd('cc')">
            <el-icon class="icon cc"><Position /></el-icon>
            <span>抄送人</span>
          </div>
          <div class="item" @click="handleAdd('route')">
            <el-icon class="icon condition"><Share /></el-icon>
            <span>条件分支</span>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Avatar, Position, Share, Checked, Cpu } from '@element-plus/icons-vue'

const emit = defineEmits(['add-node'])

const handleAdd = (type: string) => {
  emit('add-node', type)
}
</script>

<style lang="scss" scoped>
.add-node-btn-box {
  width: 220px;
  display: inline-flex;
  flex-shrink: 0;
  position: relative;
  padding: 30px 0;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 2px;
    height: 100%;
    background-color: #cbd5e1;
    z-index: 0;
  }

  .add-node-btn {
    user-select: none;
    width: 240px;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    transition: all .3s;
    z-index: 1;

    .btn {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #3b82f6;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
      transition: all .3s;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 8px 0 rgba(0,0,0,.15);
      }
    }
  }
}

.add-node-popover {
  display: flex;
  gap: 16px;
  padding: 8px;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: background 0.2s;

    &:hover { background: #f1f5f9; }

    .icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #fff;
      
      &.approver { background: #3b82f6; }
      &.task { background: #f59e0b; }
      &.system { background: #8b5cf6; }
      &.cc { background: #10b981; }
      &.condition { background: #8b5cf6; }
    }

    span {
      font-size: 12px;
      color: #475569;
    }
  }
}
</style>
