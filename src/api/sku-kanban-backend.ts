/**
 * SKU 海外仓看板与 ASIN 跟踪管理 - 本地模拟后台API与持久化存储服务 (无外部数据库依赖)
 * 提供完整的增删改查、领星 BOM 对接解析、海外仓物理库存穿透算量引擎。
 */

// 1. 数据结构定义
export interface AsinTrackRecord {
  id: string
  account: string
  site: string
  countryFlag: string
  asin: string
  sku: string
  materialCode: string
  status: '正常跟踪' | '预警关注' | '已停售'
  addTime: string
}

export interface ChildBomItem {
  childCode: string
  childName: string
  ratio: number
  unitCost?: number
}

export interface MaterialBindingRecord {
  id: string
  parentCode: string
  sku: string
  productName: string
  comboType?: '单品多量' | '单品多包' | '多品多包'
  tpWh: string
  status: '已绑定' | '部分绑定' | '未绑定'
  updateTime: string
  boundChildren: ChildBomItem[]
}

export interface ChildWarehouseDist {
  whName: string
  shortName: string
  qty: number
}

export interface ChildPhysicalStockRecord {
  id: string
  childCode: string
  childName: string
  spec: string
  tpWh: string
  whName: string
  availableQty: number
  transitQty: number
  linkedParents: string[]
}

export interface ParentPenetrateKanbanRecord {
  id: string
  account: string
  site: string
  countryFlag: string
  asin: string
  sku: string
  parentMaterialCode: string
  productName: string
  style: string
  mainMaterial: string
  targetBrand: string
  model: string
  tpOverseasWh: string
  warehouseName: string
  image: string
  childMaterials: {
    childCode: string
    childName: string
    bomRatio: number
    availableQty: number
    transitQty: number
    warehouseDist: ChildWarehouseDist[]
  }[]
  calculatedParentAvailable: number
  calculatedParentTransit: number
  bottleneckChild: {
    childCode: string
    childName: string
    bomRatio: number
    availableQty: number
  } | null
}

export interface CompletenessAlertRecord {
  id: string
  parentCode: string
  productName: string
  warehouseName: string
  otherMaxStock: number
  targetSets: number
  shortageItems: {
    childCode: string
    childName: string
    childStock: number
    bomRatio: number
    suggestedQty: number
  }[]
  explanation: string
}

// 2. Storage Storage Keys
const STORAGE_KEYS = {
  ASIN_TRACK: 'jcerp_asin_track_db_v2',
  MATERIAL_BINDINGS: 'jcerp_material_bindings_db_v1',
  CHILD_PHYSICAL_STOCKS: 'jcerp_child_stocks_db_v2',
  KANBAN_PARENT_SKUS: 'jcerp_kanban_parent_skus_db_v1',
  LAST_SYNC_TIME: 'jcerp_last_lingxing_sync_time'
}

import storeData from './sku-kanban-store.json'

// 3. 初始默认种子数据 (Initial Seed Data)
const INITIAL_ASIN_TRACK: AsinTrackRecord[] = []
const INITIAL_MATERIAL_BINDINGS: MaterialBindingRecord[] = []
const INITIAL_CHILD_PHYSICAL_STOCKS: ChildPhysicalStockRecord[] = []

// Helper: 本地 LocalStorage 读写
function loadFromStorage<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      return JSON.parse(raw) as T
    }
    return defaultData
  } catch {
    return defaultData
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    persistAllToLocalJsonFile()
  } catch (err) {
    console.error('Save to localStorage failed', err)
  }
}

export async function persistAllToLocalJsonFile(): Promise<void> {
  try {
    const asinTrack = loadFromStorage(STORAGE_KEYS.ASIN_TRACK, INITIAL_ASIN_TRACK)
    const materialBindings = loadFromStorage(STORAGE_KEYS.MATERIAL_BINDINGS, INITIAL_MATERIAL_BINDINGS)
    const childPhysicalStocks = loadFromStorage(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, INITIAL_CHILD_PHYSICAL_STOCKS)

    await fetch('/api/local-store/sku-kanban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        asinTrack,
        materialBindings,
        childPhysicalStocks
      }, null, 2)
    })
  } catch (err) {
    console.error('Failed to sync to local JSON file:', err)
  }
}

/**
 * 深度全域 LocalStorage 扫描与历史数据全面恢复纠错引擎
 * 遍历浏览器 LocalStorage 所有 Key，提取所有符合 ASIN 跟踪、父子绑定、子物料物理库存特征的数据项，
 * 与当前数据库进行去重合并，绝对防丢！
 */
export function deepScanAndRecoverAllHistoryData(): { asinCount: number; bindingCount: number; stockCount: number } {
  let asinCount = 0
  let bindingCount = 0
  let stockCount = 0

  if (typeof window === 'undefined' || !window.localStorage) {
    return { asinCount, bindingCount, stockCount }
  }

  const currentAsins = loadFromStorage<AsinTrackRecord[]>(STORAGE_KEYS.ASIN_TRACK, INITIAL_ASIN_TRACK)
  const currentBindings = loadFromStorage<MaterialBindingRecord[]>(STORAGE_KEYS.MATERIAL_BINDINGS, INITIAL_MATERIAL_BINDINGS)
  const currentStocks = loadFromStorage<ChildPhysicalStockRecord[]>(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, INITIAL_CHILD_PHYSICAL_STOCKS)

  const asinMap = new Map<string, AsinTrackRecord>()
  currentAsins.forEach(item => asinMap.set(`${item.asin}_${item.sku}`, item))

  const bindingMap = new Map<string, MaterialBindingRecord>()
  currentBindings.forEach(item => bindingMap.set(item.parentCode, item))

  const stockMap = new Map<string, ChildPhysicalStockRecord>()
  currentStocks.forEach(item => stockMap.set(item.childCode, item))

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key) continue
    try {
      const raw = localStorage.getItem(key)
      if (!raw || raw.length < 5) continue
      const parsed = JSON.parse(raw)

      const items = Array.isArray(parsed) ? parsed : (typeof parsed === 'object' && parsed !== null ? [parsed] : [])

      items.forEach((item: any) => {
        if (!item || typeof item !== 'object') return

        // 1. Check ASIN track object structure
        if (item.asin && item.sku) {
          const k = `${item.asin}_${item.sku}`
          if (!asinMap.has(k)) {
            const siteMap: Record<string, string> = { US: '🇺🇸', DE: '🇩🇪', UK: '🇬🇧', JP: '🇯🇵', CA: '🇨🇦' }
            asinMap.set(k, {
              id: item.id || ('asin_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)),
              account: item.account || 'MNE',
              site: item.site || 'US',
              countryFlag: item.countryFlag || siteMap[item.site] || '🇺🇸',
              asin: item.asin,
              sku: item.sku,
              materialCode: item.materialCode || '',
              status: item.status || '正常跟踪',
              addTime: item.addTime || new Date().toLocaleString().slice(0, 16)
            })
            asinCount++
          } else {
            const existing = asinMap.get(k)!
            if (!existing.materialCode && item.materialCode) {
              existing.materialCode = item.materialCode
            }
          }
        }

        // 2. Check Material Binding object structure
        if (item.parentCode && (item.boundChildren || item.productName || item.comboType)) {
          if (!bindingMap.has(item.parentCode)) {
            bindingMap.set(item.parentCode, {
              id: item.id || ('bind_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)),
              parentCode: item.parentCode,
              sku: item.sku || '',
              productName: item.productName || ('物料 ' + item.parentCode),
              comboType: item.comboType || '单品多量',
              tpWh: item.tpWh || '西邮',
              status: item.status || (Array.isArray(item.boundChildren) && item.boundChildren.length > 0 ? '已绑定' : '未绑定'),
              updateTime: item.updateTime || new Date().toLocaleString(),
              boundChildren: Array.isArray(item.boundChildren) ? item.boundChildren : []
            })
            bindingCount++
          } else {
            const existing = bindingMap.get(item.parentCode)!
            if ((!existing.boundChildren || existing.boundChildren.length === 0) && Array.isArray(item.boundChildren) && item.boundChildren.length > 0) {
              existing.boundChildren = item.boundChildren
            }
            if (item.productName && existing.productName.startsWith('物料 ')) {
              existing.productName = item.productName
            }
          }
        }

        // 3. Check Child Physical Stock object structure
        if (item.childCode && (typeof item.availableQty === 'number' || item.childName || item.whName)) {
          if (!stockMap.has(item.childCode)) {
            stockMap.set(item.childCode, {
              id: item.id || ('child_stock_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)),
              childCode: item.childCode,
              childName: item.childName || ('子物料 ' + item.childCode),
              spec: item.spec || '通用规格',
              tpWh: item.tpWh || '西邮',
              whName: item.whName || '美西洛杉矶1仓',
              availableQty: typeof item.availableQty === 'number' ? item.availableQty : 100,
              transitQty: typeof item.transitQty === 'number' ? item.transitQty : 0,
              linkedParents: Array.isArray(item.linkedParents) ? item.linkedParents : []
            })
            stockCount++
          }
        }
      })
    } catch {
      // Ignore JSON parse errors for non-JSON localStorage keys
    }
  }

  const mergedAsins = Array.from(asinMap.values())
  const mergedBindings = Array.from(bindingMap.values())
  const mergedStocks = Array.from(stockMap.values())

  localStorage.setItem(STORAGE_KEYS.ASIN_TRACK, JSON.stringify(mergedAsins))
  localStorage.setItem(STORAGE_KEYS.MATERIAL_BINDINGS, JSON.stringify(mergedBindings))
  localStorage.setItem(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, JSON.stringify(mergedStocks))

  if (asinCount > 0 || bindingCount > 0 || stockCount > 0) {
    persistAllToLocalJsonFile()
  }

  return { asinCount, bindingCount, stockCount }
}

export async function loadServerJsonStore(): Promise<boolean> {
  try {
    const res = await fetch('/api/local-store/sku-kanban')
    if (res.ok) {
      const data = await res.json()
      if (data && typeof data === 'object') {
        localStorage.setItem(STORAGE_KEYS.ASIN_TRACK, JSON.stringify(Array.isArray(data.asinTrack) ? data.asinTrack : []))
        localStorage.setItem(STORAGE_KEYS.MATERIAL_BINDINGS, JSON.stringify(Array.isArray(data.materialBindings) ? data.materialBindings : []))
        localStorage.setItem(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, JSON.stringify(Array.isArray(data.childPhysicalStocks) ? data.childPhysicalStocks : []))
        return true
      }
    }
  } catch (err) {
    console.warn('loadServerJsonStore failed:', err)
  }
  return false
}

export async function initBackendStoreData(): Promise<{ asinCount: number; bindingCount: number; stockCount: number }> {
  await loadServerJsonStore()
  return { asinCount: 0, bindingCount: 0, stockCount: 0 }
}

// 4. Mock Backend Service API Functions

// --- ASIN 跟踪模块后台 API ---
export async function dbFetchAsinTracks(): Promise<AsinTrackRecord[]> {
  return loadFromStorage(STORAGE_KEYS.ASIN_TRACK, INITIAL_ASIN_TRACK)
}

export async function dbSaveAsinTrack(record: Omit<AsinTrackRecord, 'id'> & { id?: string }): Promise<AsinTrackRecord> {
  const list = loadFromStorage(STORAGE_KEYS.ASIN_TRACK, INITIAL_ASIN_TRACK)
  let savedRecord: AsinTrackRecord

  if (record.id) {
    const idx = list.findIndex(item => item.id === record.id)
    if (idx > -1) {
      list[idx] = { ...list[idx], ...record } as AsinTrackRecord
      savedRecord = list[idx]
    } else {
      savedRecord = { ...record, id: 'asin_' + Date.now() } as AsinTrackRecord
      list.unshift(savedRecord)
    }
  } else {
    // 自动通过 asin + sku 判断是否为已存在
    const idx = list.findIndex(item => item.asin === record.asin && item.sku === record.sku)
    if (idx > -1) {
      list[idx] = { ...list[idx], ...record } as AsinTrackRecord
      savedRecord = list[idx]
    } else {
      savedRecord = { ...record, id: 'asin_' + Date.now() } as AsinTrackRecord
      list.unshift(savedRecord)
    }
  }

  saveToStorage(STORAGE_KEYS.ASIN_TRACK, list)
  return savedRecord
}

export async function dbDeleteAsinTrack(asin: string, sku: string): Promise<boolean> {
  const list = loadFromStorage(STORAGE_KEYS.ASIN_TRACK, INITIAL_ASIN_TRACK)
  const newList = list.filter(item => !(item.asin === asin && item.sku === sku))
  saveToStorage(STORAGE_KEYS.ASIN_TRACK, newList)
  return true
}

export async function dbBatchImportAsinTracks(newRecords: Partial<AsinTrackRecord>[]): Promise<number> {
  const list = loadFromStorage(STORAGE_KEYS.ASIN_TRACK, INITIAL_ASIN_TRACK)
  let importedCount = 0

  newRecords.forEach(rec => {
    if (!rec.asin || !rec.sku || !rec.materialCode) return
    const siteFlags: Record<string, string> = { US: '🇺🇸', DE: '🇩🇪', UK: '🇬🇧', JP: '🇯🇵', CA: '🇨🇦' }
    const flag = siteFlags[rec.site || 'US'] || '🌐'

    const idx = list.findIndex(item => item.asin === rec.asin && item.sku === rec.sku)
    const fullItem: AsinTrackRecord = {
      id: 'asin_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      account: rec.account || 'Amazon-US-01',
      site: rec.site || 'US',
      countryFlag: flag,
      asin: rec.asin,
      sku: rec.sku,
      materialCode: rec.materialCode,
      status: rec.status || '正常跟踪',
      addTime: rec.addTime || new Date().toLocaleString().slice(0, 16)
    }

    if (idx > -1) {
      list[idx] = fullItem
    } else {
      list.unshift(fullItem)
    }
    importedCount++
  })

  saveToStorage(STORAGE_KEYS.ASIN_TRACK, list)
  return importedCount
}

// --- 父子物料 BOM 绑定模块后台 API ---
export async function dbFetchMaterialBindings(): Promise<MaterialBindingRecord[]> {
  return loadFromStorage(STORAGE_KEYS.MATERIAL_BINDINGS, INITIAL_MATERIAL_BINDINGS)
}

export async function dbSaveMaterialBinding(binding: Omit<MaterialBindingRecord, 'id'> & { id?: string }): Promise<MaterialBindingRecord> {
  const list = loadFromStorage(STORAGE_KEYS.MATERIAL_BINDINGS, INITIAL_MATERIAL_BINDINGS)
  let saved: MaterialBindingRecord

  const idx = list.findIndex(item => item.parentCode === binding.parentCode)
  const fullItem: MaterialBindingRecord = {
    id: binding.id || 'bind_' + Date.now(),
    parentCode: binding.parentCode,
    sku: binding.sku || '',
    productName: binding.productName,
    comboType: binding.comboType || '单品多量',
    tpWh: binding.tpWh || '万邑通',
    status: binding.boundChildren && binding.boundChildren.length > 0 ? '已绑定' : '未绑定',
    updateTime: new Date().toLocaleString(),
    boundChildren: binding.boundChildren || []
  }

  if (idx > -1) {
    list[idx] = fullItem
    saved = list[idx]
  } else {
    list.unshift(fullItem)
    saved = fullItem
  }

  saveToStorage(STORAGE_KEYS.MATERIAL_BINDINGS, list)
  return saved
}

export async function dbDeleteMaterialBinding(parentCode: string): Promise<boolean> {
  const list = loadFromStorage(STORAGE_KEYS.MATERIAL_BINDINGS, INITIAL_MATERIAL_BINDINGS)
  const newList = list.filter(item => item.parentCode !== parentCode)
  saveToStorage(STORAGE_KEYS.MATERIAL_BINDINGS, newList)
  return true
}

// --- 子物料物理库存后台 API (与父子物料绑定关系的子物料关联同步) ---
export async function dbFetchChildPhysicalStocks(): Promise<ChildPhysicalStockRecord[]> {
  const bindings = loadFromStorage(STORAGE_KEYS.MATERIAL_BINDINGS, INITIAL_MATERIAL_BINDINGS)
  const list = loadFromStorage(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, INITIAL_CHILD_PHYSICAL_STOCKS)

  const existingChildCodes = new Set(list.map(item => item.childCode))

  bindings.forEach(parent => {
    if (parent.boundChildren) {
      parent.boundChildren.forEach(child => {
        if (!child.childCode || existingChildCodes.has(child.childCode)) return
        existingChildCodes.add(child.childCode)
        const defaultWh = parent.tpWh === '谷仓' ? '德法兰克福1仓' : parent.tpWh === '递四方' ? '英伦敦1仓' : parent.tpWh === '乐歌' ? '美东新泽西2仓' : '美西洛杉矶1仓'
        list.push({
          id: 'c_auto_' + child.childCode + '_' + Date.now(),
          childCode: child.childCode,
          childName: child.childName || ('子物料 ' + child.childCode),
          spec: '通用规格',
          tpWh: parent.tpWh || '西邮',
          whName: defaultWh,
          availableQty: 500,
          transitQty: 200,
          linkedParents: [parent.parentCode]
        })
      })
    }
  })

  saveToStorage(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, list)
  return list
}

export async function dbUpdateChildStock(childCode: string, availableQty: number, transitQty?: number): Promise<ChildPhysicalStockRecord | null> {
  const list = loadFromStorage(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, INITIAL_CHILD_PHYSICAL_STOCKS)
  const idx = list.findIndex(item => item.childCode === childCode)
  if (idx > -1) {
    list[idx].availableQty = availableQty
    if (typeof transitQty === 'number') {
      list[idx].transitQty = transitQty
    }
    saveToStorage(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, list)
    return list[idx]
  }
  return null
}

export async function dbSaveChildPhysicalStock(record: Partial<ChildPhysicalStockRecord>): Promise<ChildPhysicalStockRecord> {
  const list = loadFromStorage(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, INITIAL_CHILD_PHYSICAL_STOCKS)
  
  let idx = -1
  if (record.id) {
    idx = list.findIndex(item => item.id === record.id)
  }

  const newItem: ChildPhysicalStockRecord = {
    id: record.id || ('child_stock_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)),
    childCode: record.childCode || 'SUB-NEW',
    childName: record.childName || '未命名子物料',
    spec: record.spec || '通用规格',
    tpWh: record.tpWh || '西邮',
    whName: record.whName || '美西洛杉矶1仓',
    availableQty: record.availableQty ?? 100,
    transitQty: record.transitQty ?? 0,
    linkedParents: record.linkedParents || []
  }

  if (idx > -1) {
    list[idx] = newItem
  } else {
    list.unshift(newItem)
  }

  saveToStorage(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, list)
  return newItem
}

export async function dbDeleteChildPhysicalStock(recordIdOrCode: string): Promise<boolean> {
  const list = loadFromStorage(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, INITIAL_CHILD_PHYSICAL_STOCKS)
  const newList = list.filter(item => item.id !== recordIdOrCode && item.childCode !== recordIdOrCode)
  saveToStorage(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, newList)
  return true
}

// --- 海外仓穿透汇总算量引擎后台 API (Core Penetration Engine) ---
export async function dbFetchPenetratedKanbanData(): Promise<ParentPenetrateKanbanRecord[]> {
  const bindings = loadFromStorage(STORAGE_KEYS.MATERIAL_BINDINGS, INITIAL_MATERIAL_BINDINGS)
  const childStocks = loadFromStorage(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, INITIAL_CHILD_PHYSICAL_STOCKS)
  const asinTracks = loadFromStorage(STORAGE_KEYS.ASIN_TRACK, INITIAL_ASIN_TRACK)

  // 1. 按 childCode 聚合子物料存量明细，同时去除仓库名称前后空格
  const childStockByCode = new Map<string, ChildPhysicalStockRecord[]>()
  childStocks.forEach(st => {
    if (!st.childCode) return
    const cleanedSt: ChildPhysicalStockRecord = {
      ...st,
      whName: (st.whName || '美西洛杉矶1仓').trim(),
      tpWh: (st.tpWh || '西邮').trim()
    }
    const list = childStockByCode.get(st.childCode) || []
    list.push(cleanedSt)
    childStockByCode.set(st.childCode, list)
  })

  const asinTrackMap = new Map<string, AsinTrackRecord>()
  asinTracks.forEach(a => {
    if (a.materialCode) asinTrackMap.set(a.materialCode, a)
    if (a.sku) asinTrackMap.set(a.sku, a)
  })

  const result: ParentPenetrateKanbanRecord[] = []

  bindings.forEach((b, bIdx) => {
    const asinMatch = asinTrackMap.get(b.parentCode) || asinTrackMap.get(b.sku)
    const account = asinMatch ? asinMatch.account : 'MNE'
    const site = asinMatch ? asinMatch.site : 'US'
    const flag = asinMatch ? asinMatch.countryFlag : '🇺🇸'
    const asin = asinMatch ? asinMatch.asin : (b.parentCode ? 'B08' + b.parentCode.slice(-6) : 'B080000000')
    const sku = b.sku || (asinMatch ? asinMatch.sku : b.parentCode)
    const defaultTpWh = b.tpWh || '西邮'

    const boundChildren = b.boundChildren || []

    // 收集当前父物料绑定的所有子物料涉及到的物理仓库列表 (tpWh + whName)
    const warehouseKeysMap = new Map<string, { tpWh: string; whName: string }>()
    boundChildren.forEach(sub => {
      const stocks = childStockByCode.get(sub.childCode) || []
      stocks.forEach(st => {
        const k = `${st.tpWh}___${st.whName}`
        if (!warehouseKeysMap.has(k)) {
          warehouseKeysMap.set(k, { tpWh: st.tpWh, whName: st.whName })
        }
      })
    })

    // 如果该父物料绑定的子物料完全没有任何仓库库存记录
    if (warehouseKeysMap.size === 0) {
      const childMaterials = boundChildren.map(sub => ({
        childCode: sub.childCode,
        childName: sub.childName || sub.childCode,
        bomRatio: sub.ratio || 1,
        availableQty: 0,
        transitQty: 0,
        warehouseDist: [{ whName: '暂无物理库存', shortName: '无', qty: 0 }]
      }))

      result.push({
        id: `k_${bIdx}_default`,
        account,
        site,
        countryFlag: flag,
        asin,
        sku,
        parentMaterialCode: b.parentCode,
        productName: b.productName,
        style: '标准版',
        mainMaterial: '实木/刨花板/碳钢',
        targetBrand: '通用品牌',
        model: b.parentCode,
        tpOverseasWh: defaultTpWh,
        warehouseName: '暂无物理库存',
        image: `https://picsum.photos/100/100?random=${(bIdx % 50) + 100}`,
        childMaterials,
        calculatedParentAvailable: 0,
        calculatedParentTransit: 0,
        bottleneckChild: childMaterials.length > 0 ? {
          childCode: childMaterials[0].childCode,
          childName: childMaterials[0].childName,
          bomRatio: childMaterials[0].bomRatio,
          availableQty: 0
        } : null
      })
      return
    }

    // 针对每个物理仓库独立穿透计算该仓库下的父物料可售套数
    let whIdx = 0
    warehouseKeysMap.forEach(({ tpWh, whName }) => {
      let minParentAvail = Infinity
      let minParentTransit = Infinity
      let bottleneckChild: any = null

      const childMaterials = boundChildren.map(sub => {
        const stocks = childStockByCode.get(sub.childCode) || []
        const matchingWhStocks = stocks.filter(st => st.whName === whName && st.tpWh === tpWh)

        let availInWh = 0
        let transitInWh = 0
        matchingWhStocks.forEach(st => {
          availInWh += Number(st.availableQty || 0)
          transitInWh += Number(st.transitQty || 0)
        })

        const availSets = Math.floor(availInWh / (sub.ratio || 1))
        const transitSets = Math.floor(transitInWh / (sub.ratio || 1))

        if (availSets < minParentAvail) {
          minParentAvail = availSets
          bottleneckChild = {
            childCode: sub.childCode,
            childName: sub.childName || sub.childCode,
            bomRatio: sub.ratio || 1,
            availableQty: availInWh
          }
        }
        if (transitSets < minParentTransit) {
          minParentTransit = transitSets
        }

        return {
          childCode: sub.childCode,
          childName: sub.childName || sub.childCode,
          bomRatio: sub.ratio || 1,
          availableQty: availInWh,
          transitQty: transitInWh,
          warehouseDist: [{
            whName: whName,
            shortName: whName.slice(0, 6),
            qty: availInWh
          }]
        }
      })

      if (boundChildren.length === 0) {
        minParentAvail = 0
        minParentTransit = 0
      }

      result.push({
        id: `k_${bIdx}_wh_${whIdx++}`,
        account,
        site,
        countryFlag: flag,
        asin,
        sku,
        parentMaterialCode: b.parentCode,
        productName: b.productName,
        style: '标准版',
        mainMaterial: '实木/刨花板/碳钢',
        targetBrand: '通用品牌',
        model: b.parentCode,
        tpOverseasWh: tpWh,
        warehouseName: whName,
        image: `https://picsum.photos/100/100?random=${(bIdx % 50) + 100}`,
        childMaterials,
        calculatedParentAvailable: minParentAvail === Infinity ? 0 : minParentAvail,
        calculatedParentTransit: minParentTransit === Infinity ? 0 : minParentTransit,
        bottleneckChild
      })
    })
  })

  return result
}

// --- 齐套缺料预警后台 API ---
export async function dbFetchCompletenessAlerts(): Promise<CompletenessAlertRecord[]> {
  const kanbanData = await dbFetchPenetratedKanbanData()
  const alerts: CompletenessAlertRecord[] = []

  kanbanData.forEach((row, idx) => {
    if (row.childMaterials.length > 1) {
      // 找出当前仓库中支持套数最多的子物料套数 (目标齐套套数)
      const maxSets = Math.max(...row.childMaterials.map(c => Math.floor(c.availableQty / c.bomRatio)))

      if (maxSets > 0) {
        const shortageItems: {
          childCode: string
          childName: string
          childStock: number
          bomRatio: number
          suggestedQty: number
        }[] = []

        row.childMaterials.forEach(c => {
          const currentSets = Math.floor(c.availableQty / c.bomRatio)
          const gapSets = maxSets - currentSets

          if (gapSets > 0) {
            const neededQty = gapSets * c.bomRatio
            shortageItems.push({
              childCode: c.childCode,
              childName: c.childName,
              childStock: c.availableQty,
              bomRatio: c.bomRatio,
              suggestedQty: neededQty
            })
          }
        })

        if (shortageItems.length > 0) {
          const shortDesc = shortageItems.map(item => `${item.childCode}(+${item.suggestedQty}件)`).join('、')
          alerts.push({
            id: `alert_${idx}`,
            parentCode: row.parentMaterialCode + (row.warehouseName ? ` (${row.warehouseName})` : ''),
            productName: row.productName,
            warehouseName: row.warehouseName || '海外仓',
            otherMaxStock: maxSets * (row.childMaterials[0]?.bomRatio || 1),
            targetSets: maxSets,
            shortageItems,
            explanation: `补齐 ${shortDesc} 后，即可达 ${maxSets} 套全齐可售`
          })
        }
      }
    }
  })

  return alerts
}

function otherStocksSets(sets: number[], fallback: number): number {
  return sets.length > 0 ? Math.max(...sets) : fallback
}

// --- 重置与数据初始化后台方法 ---
export function dbClearAllData(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.clear()
    } catch {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i)
        if (k) localStorage.removeItem(k)
      }
    }
    localStorage.setItem(STORAGE_KEYS.ASIN_TRACK, JSON.stringify([]))
    localStorage.setItem(STORAGE_KEYS.MATERIAL_BINDINGS, JSON.stringify([]))
    localStorage.setItem(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, JSON.stringify([]))
    localStorage.setItem(STORAGE_KEYS.KANBAN_PARENT_SKUS, JSON.stringify([]))
  }
  persistAllToLocalJsonFile()
}

export function dbResetAllDataToDefault(): void {
  dbClearAllData()
}
