import ExcelJS from 'exceljs'
import type { ParentPenetrateKanbanRecord } from '@/api/sku-kanban-backend'

export interface KanbanExportFilterMeta {
  account?: string
  site?: string
  tpOverseasWh?: string
  warehouseName?: string
  searchKey?: string
  onlyShowBottleneck?: boolean
}

/**
 * 格式化当前日期时间为 YYYY-MM-DD HH:mm:ss
 */
function formatDateTime(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/**
 * 判断父物料是否各子物料等比齐套
 */
function isRowBalanced(row: ParentPenetrateKanbanRecord): boolean {
  if (!row.childMaterials || row.childMaterials.length <= 1) return false
  const firstSets = Math.floor(row.childMaterials[0].availableQty / row.childMaterials[0].bomRatio)
  return row.childMaterials.every(
    c => Math.floor(c.availableQty / c.bomRatio) === firstSets
  )
}

/**
 * 获取齐套健康状态描述与评级
 */
function getCompletenessStatus(row: ParentPenetrateKanbanRecord): {
  statusText: string
  statusType: 'single' | 'balanced' | 'bottleneck' | 'multipleBottlenecks'
  bottleneckDesc: string
} {
  if (!row.childMaterials || row.childMaterials.length <= 1) {
    return {
      statusText: '单物料打包',
      statusType: 'single',
      bottleneckDesc: '无多物料木桶短板'
    }
  }
  if (isRowBalanced(row)) {
    return {
      statusText: '存量齐套平衡',
      statusType: 'balanced',
      bottleneckDesc: `全部 ${row.childMaterials.length} 款子物料存量完全等比齐套 (各折算 ${row.calculatedParentAvailable} 套)`
    }
  }
  if (row.bottleneckChildren && row.bottleneckChildren.length > 1) {
    const codes = row.bottleneckChildren.map(c => c.childCode).join('、')
    return {
      statusText: `共同瓶颈(${row.bottleneckChildren.length}款)`,
      statusType: 'multipleBottlenecks',
      bottleneckDesc: `受制于并列短板: ${codes} (各折算 ${row.calculatedParentAvailable} 套，需协同补货)`
    }
  }
  if (row.bottleneckChild) {
    const sets = Math.floor(row.bottleneckChild.availableQty / row.bottleneckChild.bomRatio)
    return {
      statusText: '单款短板瓶颈',
      statusType: 'bottleneck',
      bottleneckDesc: `受制于短板: ${row.bottleneckChild.childCode} (可用 ${row.bottleneckChild.availableQty} 件 ÷ ${row.bottleneckChild.bomRatio} = ${sets} 套)`
    }
  }
  return {
    statusText: '正常',
    statusType: 'single',
    bottleneckDesc: '-'
  }
}

/**
 * 导出 SKU 海外仓库存看板全量专业数据至 Excel (.xlsx)
 * 包含：
 * Sheet 1: 【SKU海外仓库存看板汇总】（标准穿透汇总、状态高亮、自动冻结、求和统计）
 * Sheet 2: 【父子物料穿透折算明细】（展开到每一个子物料的物理在库、BOM配比及折算套数）
 * Sheet 3: 【组合类型业务规范对照】（业务判定法则与说明）
 */
export async function exportKanbanDataToExcel(
  list: ParentPenetrateKanbanRecord[],
  filterMeta?: KanbanExportFilterMeta
): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'JC-ERP 供应链系统'
  workbook.lastModifiedBy = 'JC-ERP 供应链系统'
  workbook.created = new Date()
  workbook.modified = new Date()

  const exportTimeStr = formatDateTime()

  // ==========================================
  // 1. Sheet 1: SKU海外仓库存看板汇总
  // ==========================================
  const wsSummary = workbook.addWorksheet('SKU海外仓库存看板汇总', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 4 }]
  })

  // 1.1 顶部大标题 Banner
  wsSummary.mergeCells('A1:R1')
  const titleCell = wsSummary.getCell('A1')
  titleCell.value = 'JC-ERP · SKU 海外仓库存穿透折算看板汇总报表'
  titleCell.font = { name: 'Microsoft YaHei', size: 14, bold: true, color: { argb: 'FFFFFFFF' } }
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }
  titleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }
  wsSummary.getRow(1).height = 36

  // 1.2 导出元数据说明栏
  wsSummary.mergeCells('A2:R2')
  const metaCell = wsSummary.getCell('A2')
  const filterDescList: string[] = []
  if (filterMeta?.account && filterMeta.account !== '全部') filterDescList.push(`账号: ${filterMeta.account}`)
  if (filterMeta?.site && filterMeta.site !== '全部') filterDescList.push(`站点: ${filterMeta.site}`)
  if (filterMeta?.tpOverseasWh && filterMeta.tpOverseasWh !== '全部') filterDescList.push(`海外仓: ${filterMeta.tpOverseasWh}`)
  if (filterMeta?.warehouseName && filterMeta.warehouseName !== '全部') filterDescList.push(`仓库: ${filterMeta.warehouseName}`)
  if (filterMeta?.onlyShowBottleneck) filterDescList.push('仅看短板告急')
  if (filterMeta?.searchKey) filterDescList.push(`关键词: "${filterMeta.searchKey}"`)
  const filterText = filterDescList.length ? filterDescList.join(' | ') : '全部范围'

  metaCell.value = `导出时间: ${exportTimeStr}  |  筛选条件: [${filterText}]  |  记录总数: 共 ${list.length} 款父物料  |  穿透计算法则: 木桶短板 Min(各子物料可用物理库存 ÷ BOM配比)`
  metaCell.font = { name: 'Microsoft YaHei', size: 9.5, color: { argb: 'FF475569' } }
  metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }
  metaCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }
  wsSummary.getRow(2).height = 24

  // 空行
  wsSummary.getRow(3).height = 6

  // 1.3 表头定义
  const summaryHeaders = [
    { header: '销售平台', key: 'platform', width: 12, align: 'center', bg: 'FF1E3A8A' },
    { header: '账号', key: 'account', width: 12, align: 'center', bg: 'FF1E3A8A' },
    { header: '站点', key: 'site', width: 10, align: 'center', bg: 'FF1E3A8A' },
    { header: 'ASIN', key: 'asin', width: 16, align: 'center', bg: 'FF1E3A8A' },
    { header: '销售SKU', key: 'sku', width: 20, align: 'left', bg: 'FF1E3A8A' },
    { header: '父物料编码', key: 'parentMaterialCode', width: 25, align: 'left', bg: 'FF1E3A8A' },
    { header: '产品名称', key: 'productName', width: 28, align: 'left', bg: 'FF1E3A8A' },
    { header: '款式', key: 'style', width: 14, align: 'center', bg: 'FF1E3A8A' },
    { header: '主材料', key: 'mainMaterial', width: 20, align: 'left', bg: 'FF1E3A8A' },
    { header: '公司品牌', key: 'brand', width: 12, align: 'center', bg: 'FF1E3A8A' },
    { header: '颜色', key: 'color', width: 12, align: 'center', bg: 'FF1E3A8A' },
    { header: '包装数量', key: 'packQty', width: 11, align: 'center', bg: 'FF1E3A8A' },
    { header: '订单占用库存', key: 'orderOccupiedQty', width: 15, align: 'right', bg: 'FFEAB308' },
    { header: '实际可售套数', key: 'calculatedParentAvailable', width: 16, align: 'right', bg: 'FF0D9488' },
    { header: '在途套数', key: 'calculatedParentTransit', width: 16, align: 'right', bg: 'FF0D9488' },
    { header: '绑定子物料数', key: 'childCount', width: 14, align: 'center', bg: 'FF475569' },
    { header: '齐套健康状态', key: 'statusText', width: 16, align: 'center', bg: 'FF475569' },
    { header: '瓶颈短板与制约说明', key: 'bottleneckDesc', width: 38, align: 'left', bg: 'FF475569' }
  ]

  const headerRow = wsSummary.getRow(4)
  headerRow.height = 28
  summaryHeaders.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1)
    cell.value = col.header
    cell.font = { name: 'Microsoft YaHei', size: 10, bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: col.bg } }
    cell.alignment = { vertical: 'middle', horizontal: col.align as any }
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    }
  })

  // 设置列宽
  summaryHeaders.forEach((col, idx) => {
    wsSummary.getColumn(idx + 1).width = col.width
  })

  // 1.4 写入数据行
  let totalOccupiedSets = 0
  let totalAvailableSets = 0
  let totalTransitSets = 0

  list.forEach((item, index) => {
    const rowIdx = index + 5
    const row = wsSummary.getRow(rowIdx)
    row.height = 24

    const statusInfo = getCompletenessStatus(item)
    totalOccupiedSets += item.orderOccupiedQty || 0
    totalAvailableSets += item.calculatedParentAvailable || 0
    totalTransitSets += item.calculatedParentTransit || 0

    const rowData = [
      item.platform || 'Amazon',
      item.account || '-',
      item.site || '-',
      item.asin || '-',
      item.sku || '-',
      item.parentMaterialCode || '-',
      item.productName || '-',
      item.style || '-',
      item.mainMaterial || '-',
      item.brand || item.targetBrand || '中性',
      item.color || '-',
      item.packQty || '1pack',
      item.orderOccupiedQty || 0,
      item.calculatedParentAvailable || 0,
      item.calculatedParentTransit || 0,
      item.childMaterials ? `${item.childMaterials.length}款` : '0款',
      statusInfo.statusText,
      statusInfo.bottleneckDesc
    ]

    const isEven = index % 2 === 0
    const rowBg = isEven ? 'FFFFFFFF' : 'FFF8FAFC'

    rowData.forEach((val, cIdx) => {
      const cell = row.getCell(cIdx + 1)
      cell.value = val
      cell.font = { name: 'Microsoft YaHei', size: 9.5 }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      }

      const colDef = summaryHeaders[cIdx]
      cell.alignment = { vertical: 'middle', horizontal: colDef.align as any }

      // 针对编码列采用 monospace 字体
      if (['asin', 'sku', 'parentMaterialCode'].includes(colDef.key)) {
        cell.font = { name: 'Consolas', size: 9.5, bold: colDef.key === 'parentMaterialCode' }
      }

      // 数字格式化
      if (['orderOccupiedQty', 'calculatedParentAvailable', 'calculatedParentTransit'].includes(colDef.key)) {
        cell.numFmt = '#,##0'
        cell.font = { name: 'Consolas', size: 10, bold: true }
        if (colDef.key === 'orderOccupiedQty') {
          cell.font = { name: 'Consolas', size: 10, bold: true, color: { argb: 'FFD97706' } }
        } else if (colDef.key === 'calculatedParentAvailable') {
          if (Number(val) === 0) {
            cell.font = { name: 'Consolas', size: 10, bold: true, color: { argb: 'FFDC2626' } }
          } else {
            cell.font = { name: 'Consolas', size: 10, bold: true, color: { argb: 'FF0F766E' } }
          }
        }
      }

      // 齐套健康状态标签美化高亮
      if (colDef.key === 'statusText') {
        if (statusInfo.statusType === 'balanced') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }
          cell.font = { name: 'Microsoft YaHei', size: 9.5, bold: true, color: { argb: 'FF15803D' } }
        } else if (statusInfo.statusType === 'bottleneck' || statusInfo.statusType === 'multipleBottlenecks') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } }
          cell.font = { name: 'Microsoft YaHei', size: 9.5, bold: true, color: { argb: 'FFB91C1C' } }
        } else if (statusInfo.statusType === 'single') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }
          cell.font = { name: 'Microsoft YaHei', size: 9.5, color: { argb: 'FF64748B' } }
        }
      }
    })
  })

  // 1.5 底部求和汇总统计行
  const totalRowIdx = list.length + 5
  const totalRow = wsSummary.getRow(totalRowIdx)
  totalRow.height = 26

  wsSummary.mergeCells(`A${totalRowIdx}:L${totalRowIdx}`)
  const totalLabelCell = wsSummary.getCell(`A${totalRowIdx}`)
  totalLabelCell.value = `【数据汇总合计】  父物料总计: ${list.length} 款`
  totalLabelCell.font = { name: 'Microsoft YaHei', size: 10, bold: true, color: { argb: 'FF1E3A8A' } }
  totalLabelCell.alignment = { vertical: 'middle', horizontal: 'right', indent: 1 }

  // 汇总单元格背景与边框
  for (let c = 1; c <= 18; c++) {
    const cCell = totalRow.getCell(c)
    cCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } }
    cCell.border = {
      top: { style: 'medium', color: { argb: 'FF2563EB' } },
      left: { style: 'thin', color: { argb: 'FFBFDBFE' } },
      bottom: { style: 'medium', color: { argb: 'FF2563EB' } },
      right: { style: 'thin', color: { argb: 'FFBFDBFE' } }
    }
  }

  // 总订单占用套数
  const totalOccupiedCell = totalRow.getCell(13)
  totalOccupiedCell.value = totalOccupiedSets
  totalOccupiedCell.numFmt = '#,##0'
  totalOccupiedCell.font = { name: 'Consolas', size: 10.5, bold: true, color: { argb: 'FFD97706' } }
  totalOccupiedCell.alignment = { vertical: 'middle', horizontal: 'right' }

  // 总可售套数
  const totalAvailCell = totalRow.getCell(14)
  totalAvailCell.value = totalAvailableSets
  totalAvailCell.numFmt = '#,##0'
  totalAvailCell.font = { name: 'Consolas', size: 10.5, bold: true, color: { argb: 'FF0F766E' } }
  totalAvailCell.alignment = { vertical: 'middle', horizontal: 'right' }

  // 总在途套数
  const totalTransitCell = totalRow.getCell(15)
  totalTransitCell.value = totalTransitSets
  totalTransitCell.numFmt = '#,##0'
  totalTransitCell.font = { name: 'Consolas', size: 10.5, bold: true, color: { argb: 'FF2563EB' } }
  totalTransitCell.alignment = { vertical: 'middle', horizontal: 'right' }

  // 开启自动筛选
  wsSummary.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: totalRowIdx - 1, column: 18 }
  }

  // ==========================================
  // 2. Sheet 2: 父子物料穿透折算明细 (BOM 明细展开)
  // ==========================================
  const wsDetail = workbook.addWorksheet('父子物料穿透折算明细', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 4 }]
  })

  // 2.1 标题
  wsDetail.mergeCells('A1:M1')
  const dTitleCell = wsDetail.getCell('A1')
  dTitleCell.value = 'JC-ERP · 父子物料 BOM 关联与海外仓物理库存穿透折算明细表'
  dTitleCell.font = { name: 'Microsoft YaHei', size: 13, bold: true, color: { argb: 'FFFFFFFF' } }
  dTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } }
  dTitleCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }
  wsDetail.getRow(1).height = 34

  // 2.2 提示
  wsDetail.mergeCells('A2:M2')
  const dMetaCell = wsDetail.getCell('A2')
  dMetaCell.value = `导出时间: ${exportTimeStr}  |  展示组合父物料下各子物料在多个三方海外仓的物理可用、物理在途、BOM用量配比及单项折算套数，快速定位木桶短板`
  dMetaCell.font = { name: 'Microsoft YaHei', size: 9.5, color: { argb: 'FF475569' } }
  dMetaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDFA' } }
  dMetaCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }
  wsDetail.getRow(2).height = 22

  wsDetail.getRow(3).height = 6

  // 2.3 表头
  const detailHeaders = [
    { header: '父物料编码', key: 'parentCode', width: 24, align: 'left' },
    { header: '销售SKU', key: 'sku', width: 18, align: 'left' },
    { header: '组合物料名称', key: 'productName', width: 26, align: 'left' },
    { header: '父物料总可售套数', key: 'parentAvail', width: 16, align: 'right' },
    { header: '子物料编码', key: 'childCode', width: 22, align: 'left' },
    { header: '子物料名称', key: 'childName', width: 26, align: 'left' },
    { header: 'BOM单套配比', key: 'bomRatio', width: 14, align: 'center' },
    { header: '第三方海外仓', key: 'tpWh', width: 15, align: 'center' },
    { header: '涵盖仓库分支', key: 'warehouseName', width: 18, align: 'left' },
    { header: '海外仓物理在库(件)', key: 'childAvail', width: 18, align: 'right' },
    { header: '海外仓物理在途(件)', key: 'childTransit', width: 18, align: 'right' },
    { header: '穿透折算支持套数', key: 'calcSets', width: 18, align: 'right' },
    { header: '齐套短板判定', key: 'bottleneckTag', width: 16, align: 'center' }
  ]

  const dHeaderRow = wsDetail.getRow(4)
  dHeaderRow.height = 28
  detailHeaders.forEach((col, idx) => {
    const cell = dHeaderRow.getCell(idx + 1)
    cell.value = col.header
    cell.font = { name: 'Microsoft YaHei', size: 10, bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF134E4A' } }
    cell.alignment = { vertical: 'middle', horizontal: col.align as any }
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'medium', color: { argb: 'FF042F2E' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    }
  })

  detailHeaders.forEach((col, idx) => {
    wsDetail.getColumn(idx + 1).width = col.width
  })

  // 2.4 写入详细行
  let detailRowIdx = 5
  list.forEach((parent) => {
    const rows = (parent.childWarehouseRows && parent.childWarehouseRows.length)
      ? parent.childWarehouseRows
      : (parent.childMaterials && parent.childMaterials.length ? parent.childMaterials : []).map(c => ({
          childCode: c.childCode,
          childName: c.childName,
          bomRatio: c.bomRatio,
          tpWh: c.tpWh || parent.tpOverseasWh || '西邮',
          warehouseName: parent.warehouseName || '主仓',
          availableQty: c.availableQty,
          transitQty: c.transitQty,
          penetratedSets: Math.floor((c.availableQty || 0) / (c.bomRatio || 1))
        }))

    const isSingle = (parent.childMaterials || []).length <= 1
    const isBalanced = isRowBalanced(parent)

    rows.forEach((child: any) => {
      const row = wsDetail.getRow(detailRowIdx)
      row.height = 23

      const calcSets = child.penetratedSets !== undefined
        ? child.penetratedSets
        : Math.floor((child.availableQty || 0) / (child.bomRatio || 1))
      const isBottleneck = !isSingle && !isBalanced && calcSets <= (parent.calculatedParentAvailable || 0)

      let bottleneckTag = '存量充裕'
      if (isSingle) bottleneckTag = '单品独立'
      else if (isBalanced) bottleneckTag = '等比齐套'
      else if (isBottleneck) bottleneckTag = '制约短板 ⚠️'

      const rowValues = [
        parent.parentMaterialCode || '-',
        parent.sku || '-',
        parent.productName || '-',
        parent.calculatedParentAvailable || 0,
        child.childCode || '-',
        child.childName || '-',
        `1 : ${child.bomRatio || 1}`,
        child.tpWh || parent.tpOverseasWh || '西邮',
        child.warehouseName || '-',
        child.availableQty || 0,
        child.transitQty || 0,
        calcSets,
        bottleneckTag
      ]

      rowValues.forEach((val, cIdx) => {
        const cell = row.getCell(cIdx + 1)
        cell.value = val
        cell.font = { name: 'Microsoft YaHei', size: 9.5 }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: detailRowIdx % 2 === 0 ? 'FFFFFFFF' : 'FFF0FDFA' } }
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        }

        const colDef = detailHeaders[cIdx]
        cell.alignment = { vertical: 'middle', horizontal: colDef.align as any }

        if (['parentCode', 'sku', 'childCode'].includes(colDef.key)) {
          cell.font = { name: 'Consolas', size: 9.5 }
        }

        if (['parentAvail', 'childAvail', 'childTransit', 'calcSets'].includes(colDef.key)) {
          cell.numFmt = '#,##0'
          cell.font = { name: 'Consolas', size: 9.5, bold: true }
        }

        // 短板特别高亮
        if (colDef.key === 'bottleneckTag') {
          if (isBottleneck) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } }
            cell.font = { name: 'Microsoft YaHei', size: 9.5, bold: true, color: { argb: 'FFB91C1C' } }
          } else if (isBalanced) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }
            cell.font = { name: 'Microsoft YaHei', size: 9.5, bold: true, color: { argb: 'FF15803D' } }
          }
        }
      })

      detailRowIdx++
    })
  })

  // 开启明细表筛选
  wsDetail.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: detailRowIdx - 1, column: 12 }
  }

  // ==========================================
  // 3. Sheet 3: 组合物料四大类型业务标准规范
  // ==========================================
  const wsStandard = workbook.addWorksheet('组合类型业务规范对照')
  wsStandard.views = [{ state: 'frozen', xSplit: 0, ySplit: 3 }]

  wsStandard.mergeCells('A1:F1')
  const sTitle = wsStandard.getCell('A1')
  sTitle.value = 'JC-ERP · 组合物料四大类型标准业务判定法则与说明'
  sTitle.font = { name: 'Microsoft YaHei', size: 13, bold: true, color: { argb: 'FFFFFFFF' } }
  sTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } }
  sTitle.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }
  wsStandard.getRow(1).height = 32

  const standardHeaders = [
    { header: '组合类型', key: 'type', width: 15 },
    { header: '典型业务场景', key: 'scenario', width: 22 },
    { header: 'BOM物料构成特征', key: 'feature', width: 28 },
    { header: '发货/装箱形态', key: 'pack', width: 22 },
    { header: '海外仓穿透计算法则', key: 'rule', width: 32 },
    { header: '标杆案例对照', key: 'example', width: 28 }
  ]

  const sHeaderRow = wsStandard.getRow(3)
  sHeaderRow.height = 26
  standardHeaders.forEach((col, idx) => {
    const cell = sHeaderRow.getCell(idx + 1)
    cell.value = col.header
    cell.font = { name: 'Microsoft YaHei', size: 10, bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF475569' } }
    cell.alignment = { vertical: 'middle', horizontal: 'left' }
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    }
    wsStandard.getColumn(idx + 1).width = col.width
  })

  const standardRows = [
    [
      '多件打包',
      '同款单品批量打包促销',
      '绑定 1 款子物料，配比数量 > 1 (如 2件/4件装)',
      '多件合并装箱或单箱多件',
      '可售套数 = 物理在库 ÷ 单套打包数量',
      '餐椅2件装 (IF260212 × 2)、挂钩4件装'
    ],
    [
      '一物多包',
      '超大件/重型家具拆包发货',
      '绑定 2 款或以上独立子包裹(箱)，配比通常为 1:1',
      '多个独立物理外箱，各箱必须齐套发货',
      '可售套数 = Min(各分包在库数)（缺任一分箱不可售）',
      '双人床架 (床头箱 IF260301-A + 床身箱 IF260301-B)'
    ],
    [
      '主附搭配',
      '核心主件 + 辅助/赠品配件',
      '1款核心主物料 + 1款或多款专属副件/配件/赠品',
      '主体与配件分别在库，发货时拼装或附赠',
      '可售套数 = Min(主件折算, 各附配件折算)',
      '电动升降桌 (桌板 IF260501 + 电机架 IF260502)'
    ],
    [
      '成套组合',
      '跨品类/跨系列家具场景套系',
      '多款可独立销售的成品按特定空间场景打包组合销售',
      '各单品独立原包装，作为整套组合出库',
      '可售套数 = Min(各单品在库 ÷ 配比)（强木桶短板约束）',
      '客厅沙发+茶几组合 (转角沙发 + 组合岩板茶几)'
    ]
  ]

  standardRows.forEach((r, idx) => {
    const row = wsStandard.getRow(idx + 4)
    row.height = 28
    r.forEach((val, cIdx) => {
      const cell = row.getCell(cIdx + 1)
      cell.value = val
      cell.font = { name: 'Microsoft YaHei', size: 9.5 }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: idx % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC' } }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      }
      cell.alignment = { vertical: 'middle', horizontal: cIdx === 0 ? 'center' : 'left' }
      if (cIdx === 0) {
        cell.font = { name: 'Microsoft YaHei', size: 10, bold: true, color: { argb: 'FF1E293B' } }
      }
    })
  })

  // 4. 生成 Buffer 并触发下载
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  a.download = `SKU海外仓库存穿透看板汇总数据_${dateTag}_共${list.length}款.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
