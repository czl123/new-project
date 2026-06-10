import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      },
      {
        path: 'example/standard',
        name: 'StandardList',
        component: () => import('@/views/example/standard-list.vue'),
        meta: { title: '标准列表', icon: 'List' }
      },
      {
        path: 'product/proposal/manage',
        name: 'ProposalManage',
        component: () => import('@/views/product/proposal/manage.vue'),
        meta: { title: '提案管理', icon: 'Edit' }
      },
      {
        path: 'product/proposal/sample-task',
        name: 'SampleTask',
        component: () => import('@/views/product/proposal/sample-task.vue'),
        meta: { title: '开发样拿样任务', icon: 'List' }
      },
      {
        path: 'product/proposal/sample-task-kanban',
        name: 'SampleTaskKanban',
        component: () => import('@/views/product/proposal/sample-task-kanban.vue'),
        meta: { title: '开发样拿样任务看板', icon: 'DataAnalysis' }
      },
      {
        path: 'product/settings',
        name: 'ProductSettings',
        component: () => import('@/views/product/settings/index.vue'),
        meta: { title: '设置', icon: 'Setting' }
      },
      {
        path: 'set/org/dept',
        name: 'DeptManage',
        component: () => import('@/views/settings/organization/index.vue'),
        meta: { title: '部门管理', icon: 'OfficeBuilding' }
      },
      {
        path: 'settings/workflow-list',
        name: 'WorkflowList',
        component: () => import('@/views/settings/workflow/index.vue'),
        meta: { title: '流程单据配置列表', icon: 'List' }
      },
      {
        path: 'settings/workflow-editor',
        name: 'WorkflowEditor',
        component: () => import('@/components/Workflow/WorkflowEditor.vue'),
        meta: { title: '流程审批配置', icon: 'Share' }
      },
      {
        path: 'product/proposal/sample-manage',
        name: 'SampleManage',
        component: () => import('@/views/sample/manage.vue'),
        meta: { title: '开发样管理', icon: 'Memo' }
      },
      {
        path: 'sample/manage',
        name: 'SampleMainList',
        component: () => import('@/views/sample/manage.vue'),
        meta: { title: '样品主列表', icon: 'Memo' }
      },
      {
        path: 'product/:pathMatch(.*)*',
        name: 'ProductPlaceholder',
        component: () => import('@/views/example/standard-list.vue'),
        meta: { title: '产品', icon: 'Goods' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
