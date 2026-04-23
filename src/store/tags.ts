import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TagItem {
  title: string
  path: string
  name?: string
}

export const useTagsStore = defineStore('tags', () => {
  const visitedViews = ref<TagItem[]>([
    { title: '首页', path: '/dashboard', name: 'Dashboard' }
  ])

  function addVisitedView(view: TagItem) {
    if (visitedViews.value.some(v => v.path === view.path)) return
    if (!view.title) return
    visitedViews.value.push(view)
  }

  function delVisitedView(path: string) {
    const index = visitedViews.value.findIndex(v => v.path === path)
    if (index > -1) {
      visitedViews.value.splice(index, 1)
    }
  }

  return { visitedViews, addVisitedView, delVisitedView }
})
