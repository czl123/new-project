import ExcelJS from 'exceljs'

export interface AsinTemplateColumn {
  key: string
  label: string
  required: boolean
  width: number
  example: string
  desc: string
}

/** 批量导入 ASIN 核心 6 大字段标准定义 */
export const ASIN_TEMPLATE_COLUMNS: AsinTemplateColumn[] = [
  {
    key: 'platform',
    label: '平台',
    required: true,
    width: 16,
    example: 'Amazon',
    desc: '必填：销售平台，如 Amazon、Walmart、TikTok、Wayfair'
  },
  {
    key: 'account',
    label: '账号',
    required: true,
    width: 18,
    example: 'MNE',
    desc: '必填：店铺或账号名称，如 MNE、WKJ、YBS、DW、BYH'
  },
  {
    key: 'site',
    label: '站点',
    required: true,
    width: 14,
    example: 'US',
    desc: '必填：站点国家缩写，如 US、DE、UK、JP、CA'
  },
  {
    key: 'asin',
    label: 'ASIN',
    required: true,
    width: 20,
    example: 'B08N5WRWNW',
    desc: '必填：Amazon ASIN 或平台唯一商品编码 (10位字符)'
  },
  {
    key: 'sku',
    label: '销售SKU',
    required: true,
    width: 24,
    example: 'SKU-US-00192',
    desc: '必填：店铺销售 SKU (Seller SKU)'
  },
  {
    key: 'materialCode',
    label: '组合物料编码',
    required: true,
    width: 28,
    example: 'CB-B01*2-PBM-YL-2',
    desc: '必填：系统对应的父物料编码 / 组合物料编码'
  }
]

/** 默认示范数据（覆盖真实家具业务场景） */
export const SAMPLE_ASIN_IMPORT_ROWS = [
  {
    platform: 'Amazon',
    account: 'MNE',
    site: 'US',
    asin: 'B08N5WRWNW',
    sku: 'SKU-US-00192',
    materialCode: 'CB-B01*2-PBM-YL-2'
  },
  {
    platform: 'Amazon',
    account: 'WKJ',
    site: 'US',
    asin: 'B09X1V8901',
    sku: 'WKJ-US-00214',
    materialCode: 'DS-B05*2-PBM-YL-2'
  },
  {
    platform: 'Amazon',
    account: 'YBS',
    site: 'DE',
    asin: 'B07TH88910',
    sku: 'YBS-DE-00305',
    materialCode: 'CB-B02*2-PBMGL-YL-2'
  },
  {
    platform: 'Amazon',
    account: 'DW',
    site: 'US',
    asin: 'B089K888XX',
    sku: 'DW-US-00418',
    materialCode: 'CB-B03*2-PBMTC-YL-2'
  },
  {
    platform: 'Amazon',
    account: 'BYH',
    site: 'UK',
    asin: 'B09L1K4582',
    sku: 'BYH-UK-00520',
    materialCode: 'CB-B04*2-PBM-YL-2'
  },
  {
    platform: 'Amazon',
    account: 'BYH',
    site: 'JP',
    asin: 'B08M3P7713',
    sku: 'BYH-JP-00632',
    materialCode: 'SG-B06*2-PBM-HKYL-2'
  }
]

/**
 * 生成美化的 ASIN 导入 Excel 模板 Blob
 */
export async function generateStyledAsinTemplateExcel(customRows?: any[]): Promise<Blob> {
  const isCustomExport = Boolean(customRows && customRows.length)
  const rowsToRender = isCustomExport ? customRows! : SAMPLE_ASIN_IMPORT_ROWS

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'JC-ERP ASIN 跟踪管理系统'
  workbook.created = new Date()

  // -------------------------------------------------------------
  // 工作表 1：ASIN 跟踪导入数据录入
  // -------------------------------------------------------------
  const ws = workbook.addWorksheet('ASIN跟踪导入数据录入', {
    views: [{ showGridLines: true }]
  })

  // 1. 设置列宽
  ws.columns = ASIN_TEMPLATE_COLUMNS.map(col => ({
    key: col.key,
    width: col.width
  }))

  const colCount = ASIN_TEMPLATE_COLUMNS.length

  // 2. 行 1：系统大标题横幅
  ws.mergeCells(1, 1, 1, colCount)
  const titleCell = ws.getCell('A1')
  titleCell.value = isCustomExport
    ? 'ASIN 跟踪管理 - 导出数据清单 (JC-ERP V2.2 规范版)'
    : 'ASIN 跟踪管理 - 批量导入标准模板 (JC-ERP V2.2 规范版)'
  titleCell.font = { name: 'Microsoft YaHei', size: 15, bold: true, color: { argb: 'FFFFFFFF' } }
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: isCustomExport ? 'FF0F766E' : 'FF1E3A8A' } // 导出墨绿，模板深蓝
  }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  ws.getRow(1).height = 38

  // 3. 行 2：规范指引说明条
  ws.mergeCells(2, 1, 2, colCount)
  const tipCell = ws.getCell('A2')
  tipCell.value = isCustomExport
    ? '【导出说明】本文件包含当前系统已跟踪 ASIN 清单，可直接归档核对或修改后再次批量导入。'
    : '【填写指引】标有“*”的表头为必填字段；平台推荐填 Amazon；站点支持 US、DE、UK、JP、CA；组合物料编码请填写父 SKU / 父物料编码。录入后在系统直接上传即可批量导入。'
  tipCell.font = { name: 'Microsoft YaHei', size: 9.5, italic: true, color: { argb: isCustomExport ? 'FF065F46' : 'FF92400E' } }
  tipCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: isCustomExport ? 'FFECFDF5' : 'FFFEF3C7' } // 导出淡绿，模板淡黄
  }
  tipCell.alignment = { vertical: 'middle', horizontal: 'center' }
  ws.getRow(2).height = 26

  // 4. 行 3：正式列标题
  ws.getRow(3).height = 30
  ASIN_TEMPLATE_COLUMNS.forEach((col, idx) => {
    const colNum = idx + 1
    const cell = ws.getCell(3, colNum)
    cell.value = `${col.label}*`
    cell.font = { name: 'Microsoft YaHei', size: 11, bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E40AF' } // 优雅中深蓝
    }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF94A3B8' } },
      left: { style: 'thin', color: { argb: 'FF94A3B8' } },
      bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
      right: { style: 'thin', color: { argb: 'FF94A3B8' } }
    }
  })

  // 5. 填入数据行
  rowsToRender.forEach((item, rIdx) => {
    const rowNum = rIdx + 4
    const row = ws.getRow(rowNum)
    row.height = 24

    ASIN_TEMPLATE_COLUMNS.forEach((col, cIdx) => {
      const colNum = cIdx + 1
      const cell = row.getCell(colNum)
      cell.value = (item as any)[col.key] || ''

      const isZebra = rIdx % 2 === 1
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isZebra ? 'FFF8FAFC' : 'FFFFFFFF' }
      }

      // 等宽字体优化
      const isCodeCol = col.key === 'asin' || col.key === 'sku' || col.key === 'materialCode'
      cell.font = {
        name: isCodeCol ? 'Consolas' : 'Microsoft YaHei',
        size: isCodeCol ? 10 : 9.5,
        bold: col.key === 'asin' || col.key === 'materialCode',
        color: { argb: col.key === 'asin' ? 'FF2563EB' : 'FF0F172A' }
      }

      cell.alignment = {
        vertical: 'middle',
        horizontal: col.key === 'sku' || col.key === 'materialCode' ? 'left' : 'center'
      }

      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      }
    })
  })

  // 启用自动筛选
  ws.autoFilter = {
    from: { row: 3, column: 1 },
    to: { row: 3 + rowsToRender.length, column: colCount }
  }

  // -------------------------------------------------------------
  // 工作表 2：填写规范与字典说明
  // -------------------------------------------------------------
  const wsGuide = workbook.addWorksheet('规范与字典说明', {
    views: [{ showGridLines: true }]
  })

  wsGuide.columns = [
    { key: 'colName', width: 18 },
    { key: 'colKey', width: 16 },
    { key: 'required', width: 12 },
    { key: 'dict', width: 28 },
    { key: 'rule', width: 36 },
    { key: 'example', width: 22 }
  ]

  // 标题
  wsGuide.mergeCells('A1:F1')
  const guideTitle = wsGuide.getCell('A1')
  guideTitle.value = 'ASIN 跟踪管理 - 字段填写规范与枚举说明'
  guideTitle.font = { name: 'Microsoft YaHei', size: 14, bold: true, color: { argb: 'FFFFFFFF' } }
  guideTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } }
  guideTitle.alignment = { vertical: 'middle', horizontal: 'center' }
  wsGuide.getRow(1).height = 36

  // 说明表头
  wsGuide.getRow(2).height = 26
  const guideHeaders = ['字段名称', '字段 Key', '必填属性', '推荐字典 / 枚举值', '业务校验与判别法则', '示范案例']
  guideHeaders.forEach((h, idx) => {
    const cell = wsGuide.getCell(2, idx + 1)
    cell.value = h
    cell.font = { name: 'Microsoft YaHei', size: 10, bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF115E59' } }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
  })

  const guideRows = [
    ['平台', 'platform', '必填', 'Amazon, Walmart, TikTok, Wayfair', '默认主要为 Amazon 平台销售商品', 'Amazon'],
    ['账号', 'account', '必填', 'MNE, WKJ, YBS, DW, BYH, Amazon-US-01', '对应公司运营店铺或ERP已建账号', 'MNE'],
    ['站点', 'site', '必填', 'US, DE, UK, JP, CA', '二字大写国家站点代码', 'US'],
    ['ASIN', 'asin', '必填', '10位字符，如 B08... / B09...', '亚马逊商品的唯一商品识别码 ASIN', 'B08N5WRWNW'],
    ['销售SKU', 'sku', '必填', '店铺自定义销售 SKU', 'Seller SKU，需与店铺后台 Listing 保持一致', 'SKU-US-00192'],
    ['组合物料编码', 'materialCode', '必填', '对应已绑定的父物料编码', '必须在 ERP 父子物料绑定关系中已存在，用于穿透海外仓库存', 'CB-B01*2-PBM-YL-2']
  ]

  guideRows.forEach((r, idx) => {
    const row = wsGuide.getRow(idx + 3)
    row.height = 24
    r.forEach((val, cIdx) => {
      const cell = row.getCell(cIdx + 1)
      cell.value = val
      cell.font = { name: 'Microsoft YaHei', size: 9.5 }
      cell.alignment = { vertical: 'middle', horizontal: cIdx === 2 ? 'center' : 'left' }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      }
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
}

/**
 * 触发浏览器直接下载 ASIN 导入 Excel 模板
 */
export async function downloadAsinExcelTemplate(customRows?: any[]): Promise<void> {
  const blob = await generateStyledAsinTemplateExcel(customRows)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = customRows && customRows.length
    ? `ASIN跟踪管理数据清单_${new Date().toISOString().slice(0, 10)}.xlsx`
    : `ASIN跟踪批量导入模板_JC-ERP.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export interface ParsedAsinItem {
  rowNum: number
  platform: string
  account: string
  site: string
  asin: string
  sku: string
  materialCode: string
  isValid: boolean
  errorMsg?: string
  isAlreadyTracked?: boolean
}

/**
 * 解析用户上传的 Excel 文件
 */
export async function parseAsinExcelFile(arrayBuffer: ArrayBuffer): Promise<ParsedAsinItem[]> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(arrayBuffer)

  const worksheet = workbook.worksheets[0]
  if (!worksheet) {
    throw new Error('未在上传的 Excel 文件中找到有效工作表！')
  }

  // 寻找表头所在行
  let headerRowNum = -1
  const colIndexMap: Record<string, number> = {}

  worksheet.eachRow((row, rowNumber) => {
    if (headerRowNum > -1) return
    const rowValues = row.values as any[]
    if (!rowValues || !rowValues.length) return

    for (let c = 1; c < rowValues.length; c++) {
      const val = String(rowValues[c] || '').trim().replace(/^\*\s*/, '').replace(/\*$/, '')
      if (val === 'ASIN' || val === '销售SKU' || val === '组合物料编码' || val === '平台') {
        headerRowNum = rowNumber
        break
      }
    }

    if (headerRowNum > -1) {
      for (let c = 1; c < rowValues.length; c++) {
        const val = String(rowValues[c] || '').trim().replace(/^\*\s*/, '').replace(/\*$/, '').replace(/\s+/g, '')
        if (val === '平台') colIndexMap['platform'] = c
        else if (val === '账号') colIndexMap['account'] = c
        else if (val === '站点') colIndexMap['site'] = c
        else if (val.toUpperCase() === 'ASIN') colIndexMap['asin'] = c
        else if (val === '销售SKU' || val === '销售sku' || val.toUpperCase() === 'SKU') colIndexMap['sku'] = c
        else if (val === '组合物料编码' || val === '物料编码' || val === '父物料编码') colIndexMap['materialCode'] = c
      }
    }
  })

  if (headerRowNum === -1) {
    throw new Error('未能识别到合法的表头行！请使用官方提供的标准 Excel 模板录入。')
  }

  const parsedItems: ParsedAsinItem[] = []

  for (let r = headerRowNum + 1; r <= worksheet.rowCount; r++) {
    const row = worksheet.getRow(r)
    const getVal = (key: string): string => {
      const colIdx = colIndexMap[key]
      if (!colIdx) return ''
      const cellVal = row.getCell(colIdx).value
      if (cellVal === null || cellVal === undefined) return ''
      if (typeof cellVal === 'object') {
        if ('text' in cellVal) return String((cellVal as any).text || '').trim()
        if ('result' in cellVal) return String((cellVal as any).result || '').trim()
        if ('richText' in cellVal && Array.isArray((cellVal as any).richText)) {
          return (cellVal as any).richText.map((t: any) => t.text || '').join('').trim()
        }
        return ''
      }
      return String(cellVal).trim()
    }

    const platform = getVal('platform') || 'Amazon'
    const account = getVal('account')
    const site = (getVal('site') || 'US').toUpperCase()
    const asin = getVal('asin')
    const sku = getVal('sku')
    const materialCode = getVal('materialCode')

    // 跳过全空行
    if (!account && !asin && !sku && !materialCode) continue

    const errors: string[] = []
    if (!account) errors.push('账号必填')
    if (!site) errors.push('站点必填')
    if (!asin) errors.push('ASIN必填')
    if (!sku) errors.push('销售SKU必填')
    if (!materialCode) errors.push('组合物料编码必填')

    parsedItems.push({
      rowNum: r,
      platform,
      account,
      site,
      asin,
      sku,
      materialCode,
      isValid: errors.length === 0,
      errorMsg: errors.join('; ')
    })
  }

  return parsedItems
}

/**
 * 解析用户从 Excel 直接复制粘贴的制表符/逗号分隔文本 (TSV / CSV)
 */
export function parseAsinPasteText(text: string): ParsedAsinItem[] {
  if (!text || !text.trim()) return []

  const lines = text.trim().split(/\r?\n/).filter(line => line.trim())
  if (!lines.length) return []

  // 判断第一行是否为表头
  const firstLine = lines[0].toLowerCase()
  const hasHeader = firstLine.includes('asin') || firstLine.includes('sku') || firstLine.includes('账号') || firstLine.includes('平台')
  const dataLines = hasHeader ? lines.slice(1) : lines

  const parsedItems: ParsedAsinItem[] = []

  dataLines.forEach((line, idx) => {
    // 优先制表符分隔，其次逗号分隔
    const delimiter = line.includes('\t') ? '\t' : (line.includes(',') ? ',' : ' ')
    const parts = line.split(delimiter).map(p => p.trim())

    let platform = 'Amazon'
    let account = ''
    let site = 'US'
    let asin = ''
    let sku = ''
    let materialCode = ''

    if (parts.length >= 6) {
      platform = parts[0] || 'Amazon'
      account = parts[1] || ''
      site = (parts[2] || 'US').toUpperCase()
      asin = parts[3] || ''
      sku = parts[4] || ''
      materialCode = parts[5] || ''
    } else if (parts.length === 5) {
      account = parts[0] || ''
      site = (parts[1] || 'US').toUpperCase()
      asin = parts[2] || ''
      sku = parts[3] || ''
      materialCode = parts[4] || ''
    } else if (parts.length === 4) {
      account = parts[0] || ''
      site = 'US'
      asin = parts[1] || ''
      sku = parts[2] || ''
      materialCode = parts[3] || ''
    } else if (parts.length >= 1) {
      // 容错单列 ASIN
      asin = parts[0] || ''
    }

    const errors: string[] = []
    if (!account) errors.push('账号必填')
    if (!site) errors.push('站点必填')
    if (!asin) errors.push('ASIN必填')
    if (!sku) errors.push('销售SKU必填')
    if (!materialCode) errors.push('组合物料编码必填')

    parsedItems.push({
      rowNum: idx + 1,
      platform,
      account,
      site,
      asin,
      sku,
      materialCode,
      isValid: errors.length === 0,
      errorMsg: errors.join('; ')
    })
  })

  return parsedItems
}
