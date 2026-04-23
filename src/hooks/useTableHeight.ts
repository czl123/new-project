import { onMounted, onUnmounted, ref } from 'vue'

/**
 * 自动计算表格高度的 Hook
 * @param offset 底部偏移量
 * @returns 响应式高度值
 */
export function useTableHeight(offset = 0) {
  const tableHeight = ref(400)

  const calcHeight = () => {
    const windowHeight = window.innerHeight
    // 默认给一个合理的最小值，防止高度计算为负数
    tableHeight.value = Math.max(windowHeight - offset, 200)
  }

  onMounted(() => {
    calcHeight()
    window.addEventListener('resize', calcHeight)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', calcHeight)
  })

  return tableHeight
}

export default useTableHeight

// 保留原有函数以兼容其他可能引用此文件的地方
export function useTableHeightById(id: HTMLElement | null, offset = 0) {
  const tableHeight = ref(400)

  const calcHeight = () => {
    if (!id) return
    const rect = id.getBoundingClientRect()
    const windowHeight = window.innerHeight
    tableHeight.value = windowHeight - rect.top - offset - 40
  }

  onMounted(() => {
    calcHeight()
    window.addEventListener('resize', calcHeight)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', calcHeight)
  })

  return { tableHeight, calcHeight }
}
