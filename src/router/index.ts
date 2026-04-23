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
