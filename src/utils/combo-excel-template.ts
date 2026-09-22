import ExcelJS from 'exceljs'

export interface ComboTemplateColumn {
  key: string
  label: string
  required: boolean
  width: number
  example: string
  desc: string
  category: string
}

// 严格按照新建组合物料页面的顺序排列表头字段
export const COMBO_TEMPLATE_COLUMNS: ComboTemplateColumn[] = [
  // 1. BOM清单与组合类型
  { key: 'childCodes', label: '子物料编码', required: true, width: 26, example: 'IF260212;IF260216', desc: '必填：多个子物料用英文分号 (;) 分隔', category: 'BOM与组合关系' },
  { key: 'ratios', label: '单套配比', required: true, width: 14, example: '1;2', desc: '必填：对应子部件单套配比，英文分号分隔', category: 'BOM与组合关系' },
  { key: 'comboType', label: '组合类型', required: true, width: 16, example: '成套组合', desc: '必填：多件打包 / 一物多包 / 主附搭配 / 成套组合', category: 'BOM与组合关系' },

  // 2. 同款属性
  { key: 'salesPlatform', label: '销售平台', required: true, width: 16, example: 'Amazon', desc: '必填：如 Amazon, Walmart, TikTok, Wayfair', category: '同款属性' },
  { key: 'category', label: '运营大类', required: true, width: 18, example: '家具/室内家具', desc: '必填：如 家具/室内家具, 软包床, 卫浴/浴室柜', category: '同款属性' },
  { key: 'productName', label: '产品名称', required: true, width: 30, example: '拱形门边柜+边柜木抽组合套件', desc: '必填：组合物料完整品名', category: '同款属性' },
  { key: 'style', label: '款式', required: true, width: 16, example: 'AuraB01', desc: '必填：款式或系列编号', category: '同款属性' },
  { key: 'material', label: '主材料', required: true, width: 18, example: '刨花板+MDF', desc: '必填：主材质说明', category: '同款属性' },
  { key: 'targetBrandOrAudience', label: '适用品牌或对象', required: false, width: 18, example: '通用', desc: '非必填：默认通用', category: '同款属性' },
  { key: 'model', label: '型号', required: false, width: 16, example: 'Aura-M01', desc: '非必填：规格型号编号', category: '同款属性' },

  // 3. 关键属性
  { key: 'brand', label: '公司品牌', required: true, width: 16, example: '中性', desc: '必填：如 中性, Aura, Homary, JC-ERP', category: '关键属性' },
  { key: 'pattern', label: '图案', required: false, width: 14, example: '纯色', desc: '非必填：如 纯色, 木纹', category: '关键属性' },
  { key: 'color', label: '颜色', required: true, width: 14, example: '原木色', desc: '必填：颜色外观描述', category: '关键属性' },
  { key: 'size', label: '尺码', required: false, width: 14, example: '标准款', desc: '非必填：如 标准款, Large', category: '关键属性' },
  { key: 'packQty', label: '包装数量', required: true, width: 14, example: '2pack', desc: '必填：如 1pack, 2pack, 3pack', category: '关键属性' },

  // 4. 业务协同负责人
  { key: 'productManager', label: '产品经理', required: true, width: 22, example: '张经理 (产品经理)', desc: '必填：产品线负责人', category: '业务协同负责人' },
  { key: 'purchaser', label: '采购人员', required: true, width: 18, example: '采购A组-陈工', desc: '必填：供应链采购人', category: '业务协同负责人' },
  { key: 'operator', label: '运营人员', required: true, width: 18, example: '美区运营-Lucy', desc: '必填：责任运营对接人', category: '业务协同负责人' },

  // 5. 一般属性与标签 (非必填)
  { key: 'holidayTag', label: '节日标签', required: false, width: 14, example: '无', desc: '非必填：如 无, 圣诞节, 万圣节', category: '一般属性与标签' },
  { key: 'seasonTag', label: '季节标签', required: false, width: 14, example: '四季通用', desc: '非必填：如 四季通用, 春季, 夏季等', category: '一般属性与标签' },
  { key: 'isCeCategory', label: '是否CE类', required: false, width: 14, example: '否', desc: '非必填：填 否 或 是', category: '一般属性与标签' },
  { key: 'hasBattery', label: '是否带电', required: false, width: 14, example: '否', desc: '非必填：填 否 或 是', category: '一般属性与标签' },
  { key: 'applicableModel', label: '适用机型', required: false, width: 18, example: '通用', desc: '非必填：适用机型/硬件系列', category: '一般属性与标签' },
  { key: 'materialDetail', label: '材质明细', required: false, width: 26, example: 'E1级环保刨花板+贴面', desc: '非必填：详细材质组成成分', category: '一般属性与标签' },
  { key: 'colorCode', label: '色号', required: false, width: 16, example: 'NAT-WOOD-01', desc: '非必填：出厂标准色卡编号', category: '一般属性与标签' },
  { key: 'spec', label: '规格', required: false, width: 16, example: '标准款', desc: '非必填：如 标准款, 加厚款', category: '一般属性与标签' },
  { key: 'specModelDesc', label: '规格型号', required: false, width: 24, example: '外箱130*48*22cm / 31kg', desc: '非必填：标签规格型号描述', category: '一般属性与标签' },
  { key: 'warehouseLabelDesc', label: '入库标签短描述', required: false, width: 26, example: '易碎实木拼装家具 请勿重压', desc: '非必填：入库标签短说明', category: '一般属性与标签' }
]

// 示范数据（覆盖四大类型）
const SAMPLE_DATA_ROWS = [
  {
    childCodes: 'IF260212',
    ratios: '2',
    comboType: '多件打包',
    salesPlatform: 'Amazon',
    category: '家具/室内家具',
    productName: '拱形门边柜(同款2件打包销售)',
    style: 'AuraB01',
    material: '刨花板+MDF',
    targetBrandOrAudience: '通用',
    model: 'Aura-M01',
    brand: '中性',
    pattern: '纯色',
    color: '原木色',
    size: '标准款',
    packQty: '2pack',
    productManager: '张经理 (产品经理)',
    purchaser: '采购A组-陈工',
    operator: '美区运营-Lucy',
    holidayTag: '无',
    seasonTag: '四季通用',
    isCeCategory: '否',
    hasBattery: '否',
    applicableModel: 'Aura系列通用',
    materialDetail: 'E1级环保刨花板+三聚氰胺贴面',
    colorCode: 'NAT-WOOD-01',
    spec: '标准款',
    specModelDesc: '120*40*85cm 原箱打包出库',
    warehouseLabelDesc: '原箱双件乘倍发货'
  },
  {
    childCodes: 'IF260052-A;IF260052-B;IF260052-C',
    ratios: '1;1;1',
    comboType: '一物多包',
    salesPlatform: 'Amazon',
    category: '家具/室内家具',
    productName: '现代压缩转角布艺沙发(拆为3箱)',
    style: 'Modern-S01',
    material: '高弹海绵+实木框架+布艺',
    targetBrandOrAudience: '客厅大件',
    model: 'MD-SFA03',
    brand: 'Homary',
    pattern: '纯色布纹',
    color: '高级灰',
    size: '大号3人位',
    packQty: '3pack',
    productManager: '李工 (产品经理)',
    purchaser: '采购B组-王工',
    operator: '美区运营-Lucy',
    holidayTag: '无',
    seasonTag: '四季通用',
    isCeCategory: '否',
    hasBattery: '否',
    applicableModel: '现代客厅系列',
    materialDetail: '高弹海绵+科技布面料+落叶松实木框架',
    colorCode: 'GREY-02',
    spec: '3人位超大款',
    specModelDesc: '全套3箱齐套方可发货',
    warehouseLabelDesc: '超大拆包 缺一不可'
  },
  {
    childCodes: 'IF260196-G;XST36in-P',
    ratios: '1;1',
    comboType: '主附搭配',
    salesPlatform: 'Amazon',
    category: '卫浴/浴室柜',
    productName: '美式悬挂浴室柜组合(白色主体+通用盆)',
    style: 'Bath-W36',
    material: '实木多层板+陶瓷',
    targetBrandOrAudience: '卫浴空间',
    model: 'BT-36IN-W',
    brand: 'Aura',
    pattern: '哑光白',
    color: '纯白',
    size: '36英寸',
    packQty: '2pack',
    productManager: '张经理 (产品经理)',
    purchaser: '采购A组-陈工',
    operator: '美区运营-Lucy',
    holidayTag: '无',
    seasonTag: '四季通用',
    isCeCategory: '否',
    hasBattery: '否',
    applicableModel: '36in通用浴室盆系列',
    materialDetail: '多层防水实木板+高温煅烧陶瓷盆',
    colorCode: 'WHT-01',
    spec: '36寸悬挂式标准款',
    specModelDesc: '含柜体箱+陶瓷盆箱',
    warehouseLabelDesc: '专用主体+通用公用件'
  },
  {
    childCodes: 'IF260215;IF260207;IF260208',
    ratios: '1;1;1',
    comboType: '成套组合',
    salesPlatform: 'Amazon',
    category: '家具/室内家具',
    productName: '北欧全实木客厅三件套(电视柜+边柜+窗边柜)',
    style: 'Suite-Nordic01',
    material: '橡木+金属五金',
    targetBrandOrAudience: '全屋成套',
    model: 'ST-LV03',
    brand: 'JC-ERP',
    pattern: '原木纹',
    color: '原木色',
    size: '全套组合',
    packQty: '3pack',
    productManager: '赵总 (产品负责人)',
    purchaser: '采购A组-陈工',
    operator: '美区运营-Lucy',
    holidayTag: '圣诞节',
    seasonTag: '秋冬季',
    isCeCategory: '否',
    hasBattery: '否',
    applicableModel: '全屋北欧系列',
    materialDetail: '北美FAS级白橡木+静音缓冲五金配件',
    colorCode: 'NAT-OAK-03',
    spec: '三件成套大套装',
    specModelDesc: '3件独立单品成套发货',
    warehouseLabelDesc: '大套系独立家具组合销售'
  }
]

/**
 * 创建并生成带精美配色、规范说明的 Excel 模板
 */
export async function generateStyledComboTemplateExcel(): Promise<Blob> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'JC-ERP 组合物料管理系统'
  workbook.created = new Date()

  // -------------------------------------------------------------
  // 工作表 1：组合物料数据录入
  // -------------------------------------------------------------
  const ws = workbook.addWorksheet('组合物料导入数据录入', {
    views: [{ showGridLines: true }]
  })

  // 1. 设置列宽
  ws.columns = COMBO_TEMPLATE_COLUMNS.map(col => ({
    key: col.key,
    width: col.width
  }))

  const colCount = COMBO_TEMPLATE_COLUMNS.length

  // 2. 行 1：系统大标题横幅
  ws.mergeCells(1, 1, 1, colCount)
  const titleCell = ws.getCell('A1')
  titleCell.value = '组合物料批量导入标准录入表 (JC-ERP V2.2 规范版)'
  titleCell.font = { name: 'Microsoft YaHei', size: 16, bold: true, color: { argb: 'FFFFFFFF' } }
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E3A8A' } // 深邃皇家蓝
  }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  ws.getRow(1).height = 38

  // 3. 行 2：规范说明提示条
  ws.mergeCells(2, 1, 2, colCount)
  const tipCell = ws.getCell('A2')
  tipCell.value = '【填写指引】粉红底色且标有“*”的表头为必填字段；多个子物料与配比用英文分号 (;) 分隔；严禁删除或调换表头列顺序。录入完成后直接上传即可。'
  tipCell.font = { name: 'Microsoft YaHei', size: 9.5, italic: true, color: { argb: 'FF92400E' } }
  tipCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFEF3C7' } // 淡琥珀黄
  }
  tipCell.alignment = { vertical: 'middle', horizontal: 'center' }
  ws.getRow(2).height = 24

  // 4. 行 3：大分类分组表头
  ws.getRow(3).height = 24
  const groupRanges = [
    { start: 1, end: 3, label: '【1. BOM清单与组合关系 (核心)】', bg: 'FFEDE9FE', color: 'FF5B21B6' }, // 紫色
    { start: 4, end: 10, label: '【2. 同款属性】', bg: 'FFE0F2FE', color: 'FF0369A1' }, // 天蓝
    { start: 11, end: 15, label: '【3. 关键属性】', bg: 'FFE0E7FF', color: 'FF3730A3' }, // 靛蓝
    { start: 16, end: 18, label: '【4. 业务协同负责人 (必填)】', bg: 'FFFFEDD5', color: 'FFC2410C' }, // 橙色
    { start: 19, end: 28, label: '【5. 一般属性与标签规范 (非必填)】', bg: 'FFF1F5F9', color: 'FF475569' } // 灰色
  ]

  groupRanges.forEach(g => {
    ws.mergeCells(3, g.start, 3, g.end)
    const cell = ws.getCell(3, g.start)
    cell.value = g.label
    cell.font = { name: 'Microsoft YaHei', size: 10, bold: true, color: { argb: g.color } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: g.bg } }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    }
  })

  // 5. 行 4：正式列标题
  ws.getRow(4).height = 30
  COMBO_TEMPLATE_COLUMNS.forEach((col, idx) => {
    const colNum = idx + 1
    const cell = ws.getCell(4, colNum)
    cell.value = (col.required ? '* ' : '') + col.label
    cell.font = {
      name: 'Microsoft YaHei',
      size: 10,
      bold: true,
      color: { argb: col.required ? 'FF9F1239' : 'FF334155' } // 必填项标深红
    }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: col.required ? 'FFFFE4E6' : 'FFF8FAFC' } // 必填项淡粉红背景，非必填极淡灰
    }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF94A3B8' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'medium', color: { argb: 'FF94A3B8' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
    }
  })

  // 6. 行 5~8：注入高质量真实示范数据行
  SAMPLE_DATA_ROWS.forEach((sample, rIdx) => {
    const rowNum = 5 + rIdx
    const row = ws.getRow(rowNum)
    row.height = 24

    COMBO_TEMPLATE_COLUMNS.forEach((col, cIdx) => {
      const colNum = cIdx + 1
      const cell = ws.getCell(rowNum, colNum)
      cell.value = (sample as any)[col.key] || ''
      cell.font = { name: 'Microsoft YaHei', size: 9.5, color: { argb: 'FF1E293B' } }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: rIdx % 2 === 0 ? 'FFFFFFFF' : 'FFF9FAFB' }
      }
      cell.alignment = {
        vertical: 'middle',
        horizontal: ['comboType', 'ratios', 'brand', 'packQty', 'hasBattery', 'seasonTag'].includes(col.key) ? 'center' : 'left'
      }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      }
    })
  })

  // -------------------------------------------------------------
  // 工作表 2：填写规范说明与字典
  // -------------------------------------------------------------
  const wsSpec = workbook.addWorksheet('填写规范说明与字典', {
    views: [{ showGridLines: true }]
  })

  wsSpec.columns = [
    { key: 'colName', width: 22 },
    { key: 'req', width: 14 },
    { key: 'type', width: 22 },
    { key: 'allowed', width: 36 },
    { key: 'rule', width: 50 }
  ]

  // 表头
  wsSpec.mergeCells('A1:E1')
  const specTitle = wsSpec.getCell('A1')
  specTitle.value = '组合物料字段属性定义与规范要求清单'
  specTitle.font = { name: 'Microsoft YaHei', size: 14, bold: true, color: { argb: 'FFFFFFFF' } }
  specTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } }
  specTitle.alignment = { vertical: 'middle', horizontal: 'center' }
  wsSpec.getRow(1).height = 32

  wsSpec.getRow(2).values = ['字段名称', '必填属性', '数据类型', '格式/可选值', '业务填写准则与防错要点']
  wsSpec.getRow(2).height = 26
  wsSpec.getRow(2).font = { name: 'Microsoft YaHei', size: 10, bold: true }
  wsSpec.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' }

  COMBO_TEMPLATE_COLUMNS.forEach((col, i) => {
    const r = wsSpec.addRow([
      col.label,
      col.required ? '必填 (*)' : '非必填',
      '文本字符',
      col.desc,
      `示例值：${col.example} （归属：${col.category}）`
    ])
    r.height = 22
    r.getCell(2).font = { color: { argb: col.required ? 'FFDC2626' : 'FF64748B' }, bold: col.required }
    r.alignment = { vertical: 'middle' }
  })

  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

/**
 * 解析用户上传的 Excel / CSV 文件
 */
export async function parseComboExcelFile(arrayBuffer: ArrayBuffer, targetStatus: '待提交' | '待审核'): Promise<any[]> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(arrayBuffer)

  const worksheet = workbook.worksheets[0]
  if (!worksheet) {
    throw new Error('未在上传的 Excel 文件中找到有效工作表！')
  }

  // 寻找表头所在行（寻找包含“产品名称”或“子物料编码”的行）
  let headerRowNum = -1
  const colIndexMap: Record<string, number> = {}

  worksheet.eachRow((row, rowNumber) => {
    if (headerRowNum > -1) return
    const rowValues = row.values as any[]
    if (!rowValues || !rowValues.length) return

    for (let c = 1; c < rowValues.length; c++) {
      const val = String(rowValues[c] || '').trim().replace(/^\*\s*/, '')
      if (val === '产品名称' || val === '子物料编码') {
        headerRowNum = rowNumber
        break
      }
    }

    if (headerRowNum > -1) {
      // 建立列索引映射
      for (let c = 1; c < rowValues.length; c++) {
        const val = String(rowValues[c] || '').trim().replace(/^\*\s*/, '')
        const matchedCol = COMBO_TEMPLATE_COLUMNS.find(tc => tc.label === val)
        if (matchedCol) {
          colIndexMap[matchedCol.key] = c
        }
      }
    }
  })

  if (headerRowNum === -1) {
    throw new Error('未能识别到合法的表头行！请使用官方提供的标准 Excel 模板录入。')
  }

  const parsedItems: any[] = []
  const nowStr = new Date().toLocaleString()

  for (let r = headerRowNum + 1; r <= worksheet.rowCount; r++) {
    const row = worksheet.getRow(r)
    const getVal = (key: string): string => {
      const colIdx = colIndexMap[key]
      if (!colIdx) return ''
      const cellVal = row.getCell(colIdx).value
      if (cellVal === null || cellVal === undefined) return ''
      if (typeof cellVal === 'object' && 'text' in cellVal) {
        return String((cellVal as any).text || '').trim()
      }
      return String(cellVal).trim()
    }

    const productName = getVal('productName')
    if (!productName) continue // 空行跳过

    const childCodesStr = getVal('childCodes')
    const ratiosStr = getVal('ratios')
    const comboType = getVal('comboType') || '多件打包'
    const salesPlatform = getVal('salesPlatform') || 'Amazon'
    const category = getVal('category') || '家具/室内家具'
    const style = getVal('style') || ''
    const material = getVal('material') || ''
    const targetBrandOrAudience = getVal('targetBrandOrAudience') || '通用'
    const model = getVal('model') || ''
    const brand = getVal('brand') || '中性'
    const pattern = getVal('pattern') || ''
    const color = getVal('color') || ''
    const size = getVal('size') || ''
    const packQty = getVal('packQty') || ''
    const productManager = getVal('productManager') || '张经理 (产品经理)'
    const purchaser = getVal('purchaser') || '采购A组-陈工'
    const operator = getVal('operator') || '美区运营-Lucy'
    const holidayTag = getVal('holidayTag') || '无'
    const seasonTag = getVal('seasonTag') || '四季通用'
    const isCeCategory = getVal('isCeCategory') || '否'
    const hasBattery = getVal('hasBattery') || '否'
    const applicableModel = getVal('applicableModel') || '通用'
    const materialDetail = getVal('materialDetail') || ''
    const colorCode = getVal('colorCode') || ''
    const spec = getVal('spec') || '标准款'
    const specModelDesc = getVal('specModelDesc') || ''
    const warehouseLabelDesc = getVal('warehouseLabelDesc') || ''

    const childCodes = childCodesStr.split(/;|；/).map(c => c.trim()).filter(Boolean)
    const ratios = ratiosStr.split(/;|；/).map(rt => Number(rt.trim()) || 1)

    const children = childCodes.map((cc, cIdx) => ({
      childCode: cc,
      childName: `${productName}-子部件${cIdx + 1}`,
      ratio: ratios[cIdx] || 1,
      childProductName: productName,
      childStyle: style,
      childMaterial: material,
      childTarget: targetBrandOrAudience,
      childModel: model || '通用',
      childBrand: brand,
      childPattern: pattern,
      childColor: color,
      childPackQty: '1pack'
    }))

    if (children.length === 0) {
      children.push({
        childCode: 'IF260212',
        childName: `${productName}-部件1`,
        ratio: comboType === '多件打包' ? 2 : 1,
        childProductName: productName,
        childStyle: style,
        childMaterial: material,
        childTarget: targetBrandOrAudience,
        childModel: model || '通用',
        childBrand: brand,
        childPattern: pattern,
        childColor: color,
        childPackQty: '1pack'
      })
    }

    const uniqueId = Date.now() + Math.random().toString(36).substring(2, 7)
    const wfNo = 'WF-MAT-' + uniqueId

    parsedItems.push({
      id: uniqueId,
      parentCode: targetStatus === '待审核' ? wfNo : 'DRAFT-' + uniqueId,
      sku: '',
      productName,
      comboType,
      salesPlatform,
      category,
      style,
      material,
      targetBrandOrAudience,
      model,
      brand,
      pattern,
      color,
      size,
      packQty: packQty || (children.length > 1 ? `${children.length}pack` : '1pack'),
      productManager,
      purchaser,
      operator,
      productLineLeader: '夏忠保',
      holidayTag,
      seasonTag,
      isCeCategory,
      hasBattery,
      applicableModel,
      materialDetail,
      colorCode,
      spec,
      specModelDesc,
      warehouseLabelDesc,
      auditStatus: targetStatus,
      status: targetStatus === '待审核' ? '待审核' : '已绑定',
      workflowNo: wfNo,
      updateTime: nowStr,
      children,
      boundChildren: children
    })
  }

  if (parsedItems.length === 0) {
    throw new Error('未从 Excel 表格中识别出任何有效组合物料数据行，请核实是否在【组合物料导入数据录入】工作表中填写！')
  }

  return parsedItems
}
