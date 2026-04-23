<template>
  <div class="dashboard-container">
    <div class="query-card">
      <h2 style="margin: 0">欢迎使用新项目工作台</h2>
      <p style="color: #666">本项目已根据 JC 列表页脚手架和 Tadpole Vue3 原型样式规范初始化。</p>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px">
      <div class="query-card" v-for="i in 4" :key="i">
        <div style="font-size: 14px; color: #999">待办事项 {{i}}</div>
        <div style="font-size: 24px; font-weight: bold; margin-top: 8px">{{i * 12}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
