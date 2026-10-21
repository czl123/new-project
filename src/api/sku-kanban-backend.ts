/**
 * SKU 海外仓看板与 ASIN 跟踪管理 - 本地模拟后台API与持久化存储服务 (无外部数据库依赖)
 * 提供完整的增删改查、领星 BOM 对接解析、海外仓物理库存穿透算量引擎。
 */

// 1. 数据结构定义
export interface AsinTrackRecord {
  id: string
  platform?: string
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
  childProductName?: string
  childStyle?: string
  childMaterial?: string
  childTarget?: string
  childModel?: string
  childBrand?: string
  childPattern?: string
  childColor?: string
  childPackQty?: string
  image?: string
}

import { type ComboType, getFurnitureChildMeta, getFurnitureComboMeta } from '@/data/furniture-bom-library'

export function normalizeComboType(type?: string): ComboType {
  if (!type) return '多件打包'
  if (type === '单品多量') return '多件打包'
  if (type === '单品多包') return '一物多包'
  if (type === '多品多包') return '成套组合'
  if (type === '多件打包' || type === '一物多包' || type === '主附搭配' || type === '成套组合') return type
  return '多件打包'
}

export interface MaterialBindingRecord {
  id: string
  parentCode: string
  sku: string
  productName: string
  style?: string
  material?: string
  brand?: string
  color?: string
  packQty?: string
  category?: string
  salesPlatform?: string
  comboType?: ComboType
  tpWh: string
  status: '已绑定' | '部分绑定' | '未绑定'
  auditStatus?: string
  productLineLeader?: string
  productManager?: string
  purchaser?: string
  operator?: string
  targetBrandOrAudience?: string
  model?: string
  pattern?: string
  size?: string
  holidayTag?: string
  seasonTag?: string
  isCeCategory?: string
  hasBattery?: string
  applicableModel?: string
  materialDetail?: string
  colorCode?: string
  spec?: string
  specModelDesc?: string
  warehouseLabelDesc?: string
  workflowNo?: string
  updateTime: string
  boundChildren: ChildBomItem[]
  children?: ChildBomItem[]
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

export interface ThirdPartyWarehouseBreakdown {
  tpWh: string               // 第三方海外仓服务商 (如: 万邑通, 西邮, 谷仓, 千亚)
  warehouseNames: string     // 涵盖仓库分支名称 (如: 美西洛杉矶1仓、美东新泽西仓)
  availableQty: number       // 海外仓物理在库可售 (件)
  transitQty: number         // 海外仓物理在途 (件)
  availableSets: number      // 穿透折算可售数量 (套)
  transitSets: number        // 穿透折算在途套数 (套)
  orderOccupiedQty: number   // 待发货订单占用 (套)
  unshippedOrderCount: number// 待发货订单笔数
  netAvailableSets: number   // 分仓净可用套数 (availableSets - orderOccupiedQty)
}

export interface ChildWarehouseStockRow {
  childCode: string          // 子物料编码
  childName: string          // 子物料名称
  image?: string             // 子物料图片
  bomRatio: number           // BOM 绑定用量配比
  tpWh: string               // 第三方海外仓 (如: 万邑通, 西邮)
  warehouseName: string      // 涵盖海外仓分支仓库 (如: 美西洛杉矶1仓)
  availableQty: number       // 海外仓物理可售 (件)
  transitQty: number         // 海外仓物理在途 (件)
  penetratedSets: number     // 穿透折算可支持父物料数 (套)
  transitSets: number        // 穿透折算在途套数 (套)
  rowSpan?: number           // 表格合并行数 (用于将同一子物料信息多行合并展示)
  isFirstChildRow?: boolean  // 是否为该子物料的首行
}

export interface ParentPenetrateKanbanRecord {
  id: string
  platform?: string
  account: string
  site: string
  countryFlag: string
  asin: string
  sku: string
  parentMaterialCode: string
  productName: string
  style: string
  mainMaterial: string
  brand?: string
  color?: string
  packQty?: string
  targetBrand: string
  model: string
  tpOverseasWh: string
  warehouseName: string
  coveredWarehouses?: { tpWh: string; warehouseName: string; availableSets: number }[]
  warehouseNamesSummary?: string
  warehouseBreakdown?: WarehouseStockBreakdown[]
  tpWarehouseBreakdown: ThirdPartyWarehouseBreakdown[]
  rawPenetratedAvailable: number
  childWarehouseRows?: ChildWarehouseStockRow[]
  image: string
  childMaterials: {
    childCode: string
    childName: string
    tpWh?: string
    bomRatio: number
    availableQty: number
    transitQty: number
    warehouseDist: ChildWarehouseDist[]
  }[]
  calculatedParentAvailable: number
  calculatedParentTransit: number
  orderOccupiedQty: number
  unshippedOrderCount?: number
  unshippedOrders?: UnshippedOrderRecord[]
  bottleneckChild: {
    childCode: string
    childName: string
    bomRatio: number
    availableQty: number
  } | null
  bottleneckChildren?: {
    childCode: string
    childName: string
    bomRatio: number
    availableQty: number
    availSets: number
  }[]
}

export interface UnshippedOrderRecord {
  orderId: string
  platform: string
  account: string
  site: string
  sku: string
  parentMaterialCode: string
  productName: string
  tpOverseasWh: string
  warehouseName: string
  orderedQty: number
  orderTime: string
  latestShipTime: string
  buyerInfo: string
  orderStatus: 'Unshipped'
}

export interface WarehouseStockBreakdown {
  tpWh: string
  warehouseName: string
  availableSets: number
  transitSets: number
  orderOccupiedQty: number
  unshippedOrderCount?: number
  tpRowSpan?: number
  childMaterials?: {
    childCode: string
    childName: string
    bomRatio: number
    availableQty: number
    transitQty: number
    calcSets: number
  }[]
}

export interface CompletenessShortageItem {
  childCode: string
  childName: string
  childStock: number
  bomRatio: number
  currentSets: number
  gapSets: number
  suggestedQty: number
  transitQty: number
  transitSets: number
  netShortageQty: number
  isBottleneck: boolean
}

export interface CompletenessAlertRecord {
  id: string
  platform?: string
  account?: string
  site?: string
  countryFlag?: string
  asin?: string
  sku?: string
  parentCode: string
  productName: string
  tpOverseasWh?: string
  warehouseName: string
  image?: string
  currentSets: number
  targetSets: number
  gapSets: number
  otherMaxStock: number
  alertType: '断货归零' | '多物料共同短板' | '单物料短板'
  alertLevel: 'danger' | 'warning' | 'info'
  bottleneckCount: number
  shortageItems: CompletenessShortageItem[]
  totalSuggestedQty: number
  totalTransitQty: number
  netSuggestedQty: number
  transitCoverage: '完全覆盖' | '部分覆盖' | '无在途'
  explanation: string
}

// 2. 第三方海外仓服务商与物理仓库标准映射关系字典 (依据真实业务映射构建)
export const TP_OVERSEAS_WAREHOUSES_MAP: Record<string, string[]> = {
  西邮: [
    'WPCHI2',
    'WPGA4',
    'WPHOU4',
    'WPLA11',
    'WPLA4',
    'WPNJ4',
    'WPNJ7',
    'WPLA16',
    'WPHOU7',
    'WPGA5',
    'WPHOU6',
    'WPCHI3',
    'WPCHI4'
  ],
  环世: [
    'USCOI03',
    'USHOU04',
    'USNJHM01',
    'USCAEA02',
    'USGASA01',
    'USSAV02',
    'USNJBW02',
    'USTXHU01',
    'USSAV03',
    'USHOU04-1'
  ],
  千亚: [
    'LA3',
    'QY-NJ02',
    'GA4131',
    'QY-TX01',
    'QY-GA01',
    '自助分仓',
    'QY-PA',
    'QY-LA',
    'QY-LA01'
  ],
  乐歌: [
    'CAP',
    'CAR',
    'CAT',
    'CHI',
    'GAE',
    'HOU05',
    'HOU06',
    'HOU07',
    'MEM',
    'MEM-R',
    'NJF',
    'NJF02',
    'PAW',
    'SAV',
    'SCH',
    'SCM',
    'CAMV'
  ]
}

export const ALL_TP_OVERSEAS_NAMES = Object.keys(TP_OVERSEAS_WAREHOUSES_MAP)

// 2. Storage Storage Keys
const STORAGE_KEYS = {
  ASIN_TRACK: 'jcerp_asin_track_db_v5',
  MATERIAL_BINDINGS: 'jcerp_material_bindings_db_v5',
  CHILD_PHYSICAL_STOCKS: 'jcerp_child_stocks_db_v5',
  KANBAN_PARENT_SKUS: 'jcerp_kanban_parent_skus_db_v5',
  LAST_SYNC_TIME: 'jcerp_last_lingxing_sync_time_v5',
  UNSHIPPED_ORDERS: 'jcerp_unshipped_orders_db_v5',
  LAST_UNSHIPPED_SYNC_TIME: 'jcerp_last_unshipped_sync_time_v5'
}

import storeData from './sku-kanban-store.json'

// 3. 初始默认种子数据 (Initial Seed Data)
const INITIAL_ASIN_TRACK: AsinTrackRecord[] = Array.isArray((storeData as any)?.asinTrack) ? (storeData as any).asinTrack : []
const INITIAL_MATERIAL_BINDINGS: MaterialBindingRecord[] = Array.isArray((storeData as any)?.materialBindings) ? (storeData as any).materialBindings : []
const INITIAL_CHILD_PHYSICAL_STOCKS: ChildPhysicalStockRecord[] = Array.isArray((storeData as any)?.childPhysicalStocks) ? (storeData as any).childPhysicalStocks : []

export const INITIAL_UNSHIPPED_ORDERS: UnshippedOrderRecord[] = [
  {
    orderId: '114-8291048-2849102',
    platform: 'Amazon',
    account: 'MNE',
    site: 'US',
    sku: 'SKU-DEMO-SINGLE',
    parentMaterialCode: 'DEMO-SINGLE-01',
    productName: '法式复古实木餐边柜(2件装)',
    tpOverseasWh: '西邮',
    warehouseName: 'WPGA4',
    orderedQty: 2,
    orderTime: '2026-10-15 10:24:18',
    latestShipTime: '2026-10-17 18:00:00',
    buyerInfo: 'David K. (Atlanta, GA)',
    orderStatus: 'Unshipped'
  },
  {
    orderId: '114-9988112-7766554',
    platform: 'Amazon',
    account: 'MNE',
    site: 'US',
    sku: 'SKU-DEMO-SINGLE',
    parentMaterialCode: 'DEMO-SINGLE-01',
    productName: '法式复古实木餐边柜(2件装)',
    tpOverseasWh: '环世',
    warehouseName: 'USTXHU01',
    orderedQty: 3,
    orderTime: '2026-10-16 09:12:00',
    latestShipTime: '2026-10-18 20:00:00',
    buyerInfo: 'Robert S. (Houston, TX)',
    orderStatus: 'Unshipped'
  },
  {
    orderId: 'WM-84910391204',
    platform: 'Walmart',
    account: 'WKJ',
    site: 'US',
    sku: 'SKU-DEMO-CHAIR2P',
    parentMaterialCode: 'DEMO-SINGLE-02',
    productName: '北欧全实木休闲椅(2把装)',
    tpOverseasWh: '千亚',
    warehouseName: 'LA3',
    orderedQty: 4,
    orderTime: '2026-10-15 14:10:33',
    latestShipTime: '2026-10-18 12:00:00',
    buyerInfo: 'Robert B. (Los Angeles, CA)',
    orderStatus: 'Unshipped'
  },
  {
    orderId: 'TT-20261015-8912',
    platform: 'TikTok',
    account: 'YBS',
    site: 'US',
    sku: 'SKU-DEMO-STOOL4P',
    parentMaterialCode: 'DEMO-SINGLE-03',
    productName: '现代极简折叠圆凳(4把装)',
    tpOverseasWh: '西邮',
    warehouseName: 'WPCHI2',
    orderedQty: 2,
    orderTime: '2026-10-15 20:15:40',
    latestShipTime: '2026-10-17 20:00:00',
    buyerInfo: 'Jessica W. (Chicago, IL)',
    orderStatus: 'Unshipped'
  },
  {
    orderId: '113-4819204-1849201',
    platform: 'Amazon',
    account: 'MNE',
    site: 'US',
    sku: 'SKU-DEMO-BALANCED',
    parentMaterialCode: 'DEMO-BALANCED-01',
    productName: '等比齐套实木书桌',
    tpOverseasWh: '西邮',
    warehouseName: 'WPNJ4',
    orderedQty: 8,
    orderTime: '2026-10-15 11:05:22',
    latestShipTime: '2026-10-17 15:00:00',
    buyerInfo: 'Michael P. (Newark, NJ)',
    orderStatus: 'Unshipped'
  },
  {
    orderId: 'WF-78912034912',
    platform: 'Wayfair',
    account: 'DW',
    site: 'US',
    sku: 'SKU-DEMO-MULTI',
    parentMaterialCode: 'DEMO-MULTI-01',
    productName: '全能储物榻榻米多件套',
    tpOverseasWh: '乐歌',
    warehouseName: 'NJF',
    orderedQty: 5,
    orderTime: '2026-10-15 16:30:00',
    latestShipTime: '2026-10-18 18:00:00',
    buyerInfo: 'Thomas B. (Jersey City, NJ)',
    orderStatus: 'Unshipped'
  },
  {
    orderId: '114-3829104-5829104',
    platform: 'Amazon',
    account: 'MNE',
    site: 'US',
    sku: 'CB-B01*2-PBM-YL-2',
    parentMaterialCode: 'CB-B01*2-PBM-YL-2',
    productName: '餐边柜双门款',
    tpOverseasWh: '西邮',
    warehouseName: 'WPNJ7',
    orderedQty: 12,
    orderTime: '2026-10-15 09:12:44',
    latestShipTime: '2026-10-17 18:00:00',
    buyerInfo: 'Ashley H. (New York, NY)',
    orderStatus: 'Unshipped'
  },
  {
    orderId: 'WM-90284719283',
    platform: 'Walmart',
    account: 'WKJ',
    site: 'US',
    sku: 'CB-B04*3-PBM-HKYL-3',
    parentMaterialCode: 'CB-B04*3-PBM-HKYL-3',
    productName: '餐边柜三门款',
    tpOverseasWh: '环世',
    warehouseName: 'USNJBW02',
    orderedQty: 5,
    orderTime: '2026-10-16 02:40:19',
    latestShipTime: '2026-10-18 16:00:00',
    buyerInfo: 'Jennifer C. (Denver, CO)',
    orderStatus: 'Unshipped'
  },
  {
    orderId: '114-1928401-4920194',
    platform: 'Amazon',
    account: 'MNE',
    site: 'US',
    sku: 'DS-B05*3-PBM-HKYL-3',
    parentMaterialCode: 'DS-B05*3-PBM-HKYL-3',
    productName: '双抽电视柜',
    tpOverseasWh: '千亚',
    warehouseName: '自助分仓',
    orderedQty: 10,
    orderTime: '2026-10-15 13:22:01',
    latestShipTime: '2026-10-17 12:00:00',
    buyerInfo: 'Kevin R. (Dallas, TX)',
    orderStatus: 'Unshipped'
  },
  {
    orderId: '112-7491028-4820192',
    platform: 'Amazon',
    account: 'MNE',
    site: 'US',
    sku: 'SG-B06*3-PBM-YL-3',
    parentMaterialCode: 'SG-B06*3-PBM-YL-3',
    productName: '全开窗书柜',
    tpOverseasWh: '乐歌',
    warehouseName: 'GAE',
    orderedQty: 4,
    orderTime: '2026-10-16 07:14:55',
    latestShipTime: '2026-10-18 20:00:00',
    buyerInfo: 'Laura S. (Atlanta, GA)',
    orderStatus: 'Unshipped'
  },
  {
    orderId: '114-4910293-8492018',
    platform: 'Amazon',
    account: 'MNE',
    site: 'US',
    sku: 'CB-B02*3-PBMGL-YL-3',
    parentMaterialCode: 'CB-B02*3-PBMGL-YL-3',
    productName: '玻璃门餐边柜',
    tpOverseasWh: '西邮',
    warehouseName: 'WPLA16',
    orderedQty: 8,
    orderTime: '2026-10-15 15:45:30',
    latestShipTime: '2026-10-17 22:00:00',
    buyerInfo: 'Brandon F. (Los Angeles, CA)',
    orderStatus: 'Unshipped'
  }
]

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
    const unshippedOrders = loadFromStorage(STORAGE_KEYS.UNSHIPPED_ORDERS, INITIAL_UNSHIPPED_ORDERS)

    await fetch('/api/local-store/sku-kanban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        asinTrack,
        materialBindings,
        childPhysicalStocks,
        unshippedOrders
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
              platform: item.platform || 'Amazon',
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
      if (data && typeof data === 'object' && Array.isArray(data.materialBindings) && data.materialBindings.length > 0) {
        localStorage.setItem(STORAGE_KEYS.ASIN_TRACK, JSON.stringify(Array.isArray(data.asinTrack) ? data.asinTrack : []))
        localStorage.setItem(STORAGE_KEYS.MATERIAL_BINDINGS, JSON.stringify(Array.isArray(data.materialBindings) ? data.materialBindings : []))
        localStorage.setItem(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, JSON.stringify(Array.isArray(data.childPhysicalStocks) ? data.childPhysicalStocks : []))
        if (Array.isArray(data.unshippedOrders) && data.unshippedOrders.length > 0) {
          localStorage.setItem(STORAGE_KEYS.UNSHIPPED_ORDERS, JSON.stringify(data.unshippedOrders))
        }
        return true
      }
    }
  } catch (err) {
    console.warn('loadServerJsonStore failed:', err)
  }
  if (storeData && typeof storeData === 'object' && Array.isArray((storeData as any).materialBindings)) {
    localStorage.setItem(STORAGE_KEYS.ASIN_TRACK, JSON.stringify((storeData as any).asinTrack || []))
    localStorage.setItem(STORAGE_KEYS.MATERIAL_BINDINGS, JSON.stringify((storeData as any).materialBindings || []))
    localStorage.setItem(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, JSON.stringify((storeData as any).childPhysicalStocks || []))
    if (Array.isArray((storeData as any).unshippedOrders) && (storeData as any).unshippedOrders.length > 0) {
      localStorage.setItem(STORAGE_KEYS.UNSHIPPED_ORDERS, JSON.stringify((storeData as any).unshippedOrders))
    }
    return true
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
  const list = loadFromStorage<AsinTrackRecord[]>(STORAGE_KEYS.ASIN_TRACK, INITIAL_ASIN_TRACK)
  return list.map(item => ({
    ...item,
    platform: item.platform || 'Amazon'
  }))
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
      savedRecord = { ...record, platform: record.platform || 'Amazon', id: 'asin_' + Date.now() } as AsinTrackRecord
      list.unshift(savedRecord)
    }
  } else {
    // 自动通过 asin + sku 判断是否为已存在
    const idx = list.findIndex(item => item.asin === record.asin && item.sku === record.sku)
    if (idx > -1) {
      list[idx] = { ...list[idx], ...record } as AsinTrackRecord
      savedRecord = list[idx]
    } else {
      savedRecord = { ...record, platform: record.platform || 'Amazon', id: 'asin_' + Date.now() } as AsinTrackRecord
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
      platform: rec.platform || 'Amazon',
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

export async function dbUpdateSingleAsinTrack(asin: string, sku: string): Promise<AsinTrackRecord | null> {
  const list = loadFromStorage<AsinTrackRecord[]>(STORAGE_KEYS.ASIN_TRACK, INITIAL_ASIN_TRACK)
  const idx = list.findIndex(item => item.asin === asin && item.sku === sku)
  if (idx === -1) return null

  const existing = list[idx]
  const siteFlags: Record<string, string> = { US: '🇺🇸', DE: '🇩🇪', UK: '🇬🇧', JP: '🇯🇵', CA: '🇨🇦' }
  const flag = siteFlags[existing.site || 'US'] || existing.countryFlag || '🌐'

  const updated: AsinTrackRecord = {
    ...existing,
    countryFlag: flag,
    addTime: existing.addTime || new Date().toLocaleString().slice(0, 16)
  }

  list[idx] = updated
  saveToStorage(STORAGE_KEYS.ASIN_TRACK, list)
  return updated
}

export async function dbUpdateAllAsinTracks(): Promise<number> {
  const list = loadFromStorage<AsinTrackRecord[]>(STORAGE_KEYS.ASIN_TRACK, INITIAL_ASIN_TRACK)
  const siteFlags: Record<string, string> = { US: '🇺🇸', DE: '🇩🇪', UK: '🇬🇧', JP: '🇯🇵', CA: '🇨🇦' }
  let count = 0

  const updatedList = list.map(item => {
    count++
    return {
      ...item,
      countryFlag: siteFlags[item.site || 'US'] || item.countryFlag || '🌐'
    }
  })

  saveToStorage(STORAGE_KEYS.ASIN_TRACK, updatedList)
  return count
}

// --- 父子物料 BOM 绑定模块后台 API ---
export async function dbFetchMaterialBindings(): Promise<MaterialBindingRecord[]> {
  return loadFromStorage(STORAGE_KEYS.MATERIAL_BINDINGS, INITIAL_MATERIAL_BINDINGS)
}

export async function dbSaveMaterialBinding(binding: Omit<MaterialBindingRecord, 'id'> & { id?: string }): Promise<MaterialBindingRecord> {
  const list = loadFromStorage(STORAGE_KEYS.MATERIAL_BINDINGS, INITIAL_MATERIAL_BINDINGS)
  let saved: MaterialBindingRecord
  const comboMeta = getFurnitureComboMeta(binding.parentCode)

  const enrichedChildren: ChildBomItem[] = (binding.boundChildren || []).map((child: ChildBomItem) => {
    const cMeta = getFurnitureChildMeta(child.childCode)
    return {
      ...child,
      childName: child.childName || cMeta?.childName || child.childCode,
      childProductName: child.childProductName || cMeta?.childProductName || '',
      childStyle: child.childStyle || cMeta?.childStyle || '',
      childMaterial: child.childMaterial || cMeta?.childMaterial || '',
      childTarget: child.childTarget || cMeta?.childTarget || '通用',
      childModel: child.childModel || cMeta?.childModel || '通用',
      childBrand: child.childBrand || cMeta?.childBrand || '中性',
      childPattern: child.childPattern || cMeta?.childPattern || '',
      childColor: child.childColor || cMeta?.childColor || '',
      childPackQty: child.childPackQty || cMeta?.childPackQty || '1pack'
    }
  })

  const idx = list.findIndex(item => item.parentCode === binding.parentCode)
  const fullItem: MaterialBindingRecord = {
    ...binding,
    id: binding.id || 'bind_' + Date.now(),
    parentCode: binding.parentCode,
    sku: binding.sku || '',
    productName: binding.productName,
    style: binding.style || comboMeta?.style || '',
    material: binding.material || comboMeta?.material || '',
    brand: binding.brand || comboMeta?.brand || '中性',
    color: binding.color || comboMeta?.color || '',
    packQty: binding.packQty || comboMeta?.packQty || '',
    comboType: normalizeComboType(binding.comboType || comboMeta?.comboType),
    tpWh: binding.tpWh || '万邑通',
    status: enrichedChildren.length > 0 ? '已绑定' : '未绑定',
    updateTime: new Date().toLocaleString(),
    boundChildren: enrichedChildren
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

export async function dbBatchDeleteMaterialBindings(parentCodes: string[]): Promise<number> {
  const codeSet = new Set(parentCodes)
  const list = loadFromStorage(STORAGE_KEYS.MATERIAL_BINDINGS, INITIAL_MATERIAL_BINDINGS)
  const newList = list.filter(item => !codeSet.has(item.parentCode))
  saveToStorage(STORAGE_KEYS.MATERIAL_BINDINGS, newList)
  return list.length - newList.length
}

export async function dbBatchImportMaterialBindings(bindings: (Omit<MaterialBindingRecord, 'id'> & { id?: string })[]): Promise<number> {
  const list = loadFromStorage(STORAGE_KEYS.MATERIAL_BINDINGS, INITIAL_MATERIAL_BINDINGS)
  let count = 0
  const nowStr = new Date().toLocaleString()
  bindings.forEach(b => {
    if (!b.parentCode) return
    const comboMeta = getFurnitureComboMeta(b.parentCode)
    const enrichedChildren: ChildBomItem[] = (b.boundChildren || []).map((child: ChildBomItem) => {
      const cMeta = getFurnitureChildMeta(child.childCode)
      return {
        ...child,
        childName: child.childName || cMeta?.childName || child.childCode,
        childProductName: child.childProductName || cMeta?.childProductName || '',
        childStyle: child.childStyle || cMeta?.childStyle || '',
        childMaterial: child.childMaterial || cMeta?.childMaterial || '',
        childTarget: child.childTarget || cMeta?.childTarget || '通用',
        childModel: child.childModel || cMeta?.childModel || '通用',
        childBrand: child.childBrand || cMeta?.childBrand || '中性',
        childPattern: child.childPattern || cMeta?.childPattern || '',
        childColor: child.childColor || cMeta?.childColor || '',
        childPackQty: child.childPackQty || cMeta?.childPackQty || '1pack'
      }
    })

    const rawLeader = (b as any).productLineLeader
    let cleanLeader = '夏忠保'
    if (typeof rawLeader === 'string') {
      if (rawLeader.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(rawLeader)
          cleanLeader = parsed.leader || '夏忠保'
        } catch {
          cleanLeader = rawLeader
        }
      } else {
        cleanLeader = rawLeader
      }
    } else if (typeof rawLeader === 'object' && rawLeader !== null) {
      cleanLeader = rawLeader.leader || '夏忠保'
    }

    const idx = list.findIndex(item => item.parentCode === b.parentCode)
    const fullItem: MaterialBindingRecord = {
      ...b,
      id: b.id || ('bind_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
      parentCode: b.parentCode,
      sku: b.sku || b.parentCode,
      productName: b.productName,
      style: b.style || comboMeta?.style || '',
      material: b.material || comboMeta?.material || '',
      brand: b.brand || comboMeta?.brand || '中性',
      color: b.color || comboMeta?.color || '',
      packQty: b.packQty || comboMeta?.packQty || '',
      comboType: normalizeComboType(b.comboType || comboMeta?.comboType),
      tpWh: b.tpWh || '万邑通',
      status: b.status || (enrichedChildren.length > 0 ? '已绑定' : '未绑定'),
      auditStatus: b.auditStatus || '待提交',
      productLineLeader: cleanLeader,
      updateTime: nowStr,
      boundChildren: enrichedChildren
    }
    if (idx > -1) {
      list[idx] = fullItem
    } else {
      list.unshift(fullItem)
    }
    count++
  })
  saveToStorage(STORAGE_KEYS.MATERIAL_BINDINGS, list)
  return count
}

export async function dbUpdateSingleMaterialBinding(parentCode: string): Promise<MaterialBindingRecord | null> {
  const list = loadFromStorage<MaterialBindingRecord[]>(STORAGE_KEYS.MATERIAL_BINDINGS, INITIAL_MATERIAL_BINDINGS)
  const idx = list.findIndex(item => item.parentCode === parentCode)
  if (idx === -1) return null

  const existing = list[idx]
  const comboMeta = getFurnitureComboMeta(parentCode)

  let boundChildren = existing.boundChildren || []
  if (comboMeta && comboMeta.children && comboMeta.children.length > 0) {
    boundChildren = comboMeta.children.map(c => {
      const cMeta = getFurnitureChildMeta(c.childCode)
      return {
        childCode: c.childCode,
        childName: c.childName || cMeta?.childName || c.childCode,
        ratio: c.ratio || 1,
        childProductName: c.childProductName || cMeta?.childProductName || '',
        childStyle: c.childStyle || cMeta?.childStyle || '',
        childMaterial: c.childMaterial || cMeta?.childMaterial || '',
        childTarget: c.childTarget || cMeta?.childTarget || '通用',
        childModel: c.childModel || cMeta?.childModel || '通用',
        childBrand: c.childBrand || cMeta?.childBrand || '中性',
        childPattern: c.childPattern || cMeta?.childPattern || '',
        childColor: c.childColor || cMeta?.childColor || '',
        childPackQty: c.childPackQty || cMeta?.childPackQty || '1pack',
        image: c.image || cMeta?.image
      }
    })
  } else {
    boundChildren = boundChildren.map(c => {
      const cMeta = getFurnitureChildMeta(c.childCode)
      return {
        ...c,
        childName: c.childName || cMeta?.childName || c.childCode,
        childProductName: c.childProductName || cMeta?.childProductName || '',
        childStyle: c.childStyle || cMeta?.childStyle || '',
        childMaterial: c.childMaterial || cMeta?.childMaterial || '',
        childTarget: c.childTarget || cMeta?.childTarget || '通用',
        childModel: c.childModel || cMeta?.childModel || '通用',
        childBrand: c.childBrand || cMeta?.childBrand || '中性',
        childPattern: c.childPattern || cMeta?.childPattern || '',
        childColor: c.childColor || cMeta?.childColor || '',
        childPackQty: c.childPackQty || cMeta?.childPackQty || '1pack',
        image: c.image || cMeta?.image
      }
    })
  }

  const updated: MaterialBindingRecord = {
    ...existing,
    productName: comboMeta?.productName || existing.productName,
    style: comboMeta?.style || existing.style || '',
    material: comboMeta?.material || existing.material || '',
    brand: comboMeta?.brand || existing.brand || '中性',
    color: comboMeta?.color || existing.color || '',
    packQty: comboMeta?.packQty || existing.packQty || '',
    comboType: normalizeComboType(comboMeta?.comboType || existing.comboType),
    status: boundChildren.length > 0 ? '已绑定' : '未绑定',
    updateTime: new Date().toLocaleString(),
    boundChildren
  }

  list[idx] = updated
  saveToStorage(STORAGE_KEYS.MATERIAL_BINDINGS, list)
  return updated
}

export async function dbUpdateAllMaterialBindings(): Promise<number> {
  const list = loadFromStorage<MaterialBindingRecord[]>(STORAGE_KEYS.MATERIAL_BINDINGS, INITIAL_MATERIAL_BINDINGS)
  let count = 0
  const now = new Date().toLocaleString()

  const updatedList = list.map(item => {
    const comboMeta = getFurnitureComboMeta(item.parentCode)
    let boundChildren = item.boundChildren || []
    if (comboMeta && comboMeta.children && comboMeta.children.length > 0) {
      boundChildren = comboMeta.children.map(c => {
        const cMeta = getFurnitureChildMeta(c.childCode)
        return {
          childCode: c.childCode,
          childName: c.childName || cMeta?.childName || c.childCode,
          ratio: c.ratio || 1,
          childProductName: c.childProductName || cMeta?.childProductName || '',
          childStyle: c.childStyle || cMeta?.childStyle || '',
          childMaterial: c.childMaterial || cMeta?.childMaterial || '',
          childTarget: c.childTarget || cMeta?.childTarget || '通用',
          childModel: c.childModel || cMeta?.childModel || '通用',
          childBrand: c.childBrand || cMeta?.childBrand || '中性',
          childPattern: c.childPattern || cMeta?.childPattern || '',
          childColor: c.childColor || cMeta?.childColor || '',
          childPackQty: c.childPackQty || cMeta?.childPackQty || '1pack',
          image: c.image || cMeta?.image
        }
      })
    } else {
      boundChildren = boundChildren.map(c => {
        const cMeta = getFurnitureChildMeta(c.childCode)
        return {
          ...c,
          childName: c.childName || cMeta?.childName || c.childCode,
          childProductName: c.childProductName || cMeta?.childProductName || '',
          childStyle: c.childStyle || cMeta?.childStyle || '',
          childMaterial: c.childMaterial || cMeta?.childMaterial || '',
          childTarget: c.childTarget || cMeta?.childTarget || '通用',
          childModel: c.childModel || cMeta?.childModel || '通用',
          childBrand: c.childBrand || cMeta?.childBrand || '中性',
          childPattern: c.childPattern || cMeta?.childPattern || '',
          childColor: c.childColor || cMeta?.childColor || '',
          childPackQty: c.childPackQty || cMeta?.childPackQty || '1pack',
          image: c.image || cMeta?.image
        }
      })
    }
    count++
    return {
      ...item,
      productName: comboMeta?.productName || item.productName,
      style: comboMeta?.style || item.style || '',
      material: comboMeta?.material || item.material || '',
      brand: comboMeta?.brand || item.brand || '中性',
      color: comboMeta?.color || item.color || '',
      packQty: comboMeta?.packQty || item.packQty || '',
      comboType: normalizeComboType(comboMeta?.comboType || item.comboType),
      status: boundChildren.length > 0 ? '已绑定' : '未绑定',
      updateTime: now,
      boundChildren
    } as MaterialBindingRecord
  })

  saveToStorage(STORAGE_KEYS.MATERIAL_BINDINGS, updatedList)
  return count
}


// --- 子物料物理库存后台 API (子物料严格来源于父子物料绑定关系的子物料) ---
export async function dbFetchChildPhysicalStocks(): Promise<ChildPhysicalStockRecord[]> {
  const bindings = loadFromStorage(STORAGE_KEYS.MATERIAL_BINDINGS, INITIAL_MATERIAL_BINDINGS)
  const list = loadFromStorage(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, INITIAL_CHILD_PHYSICAL_STOCKS)

  // 1. 严格从当前父子物料绑定关系中提取全部绑定的子物料及关联父物料集合
  const bindingChildMap = new Map<string, {
    childCode: string
    childName: string
    spec: string
    tpWh: string
    parents: Set<string>
  }>()

  bindings.forEach(parent => {
    if (parent.boundChildren) {
      parent.boundChildren.forEach(child => {
        if (!child.childCode) return
        if (!bindingChildMap.has(child.childCode)) {
          const cMeta = getFurnitureChildMeta(child.childCode)
          const childName = child.childName || cMeta?.childName || ('子物料 ' + child.childCode)
          bindingChildMap.set(child.childCode, {
            childCode: child.childCode,
            childName,
            spec: cMeta?.childStyle || '通用规格',
            tpWh: parent.tpWh || '西邮',
            parents: new Set()
          })
        }
        bindingChildMap.get(child.childCode)!.parents.add(parent.parentCode)
      })
    }
  })

  // 2. 过滤现有库存记录：只保留严格存在于父子物料绑定关系中的子物料
  const existingMap = new Map<string, ChildPhysicalStockRecord>()
  list.forEach(item => {
    if (bindingChildMap.has(item.childCode)) {
      existingMap.set(item.childCode, item)
    }
  })

  // 3. 构造最新且完整的子物料物理库存列表，并同步补齐 linkedParents
  const resultList: ChildPhysicalStockRecord[] = []
  bindingChildMap.forEach((info, code) => {
    const existing = existingMap.get(code)
    if (existing) {
      existing.childName = info.childName
      existing.linkedParents = Array.from(info.parents)
      resultList.push(existing)
    } else {
      const targetTpWh = info.tpWh && TP_OVERSEAS_WAREHOUSES_MAP[info.tpWh] ? info.tpWh : '西邮'
      const defaultWh = TP_OVERSEAS_WAREHOUSES_MAP[targetTpWh]?.[0] || 'WPLA11'
      resultList.push({
        id: 'c_auto_' + code + '_' + Date.now(),
        childCode: code,
        childName: info.childName,
        spec: info.spec,
        tpWh: targetTpWh,
        whName: defaultWh,
        availableQty: 500,
        transitQty: 200,
        linkedParents: Array.from(info.parents)
      })
    }
  })

  saveToStorage(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, resultList)
  return resultList
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

  const assignedTpWh = record.tpWh && TP_OVERSEAS_WAREHOUSES_MAP[record.tpWh] ? record.tpWh : '西邮'
  const assignedWhName = record.whName && TP_OVERSEAS_WAREHOUSES_MAP[assignedTpWh]?.includes(record.whName)
    ? record.whName
    : (TP_OVERSEAS_WAREHOUSES_MAP[assignedTpWh]?.[0] || 'WPLA11')

  const newItem: ChildPhysicalStockRecord = {
    id: record.id || ('child_stock_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)),
    childCode: record.childCode || 'SUB-NEW',
    childName: record.childName || '未命名子物料',
    spec: record.spec || '通用规格',
    tpWh: assignedTpWh,
    whName: assignedWhName,
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
  const unshippedOrders = loadFromStorage(STORAGE_KEYS.UNSHIPPED_ORDERS, INITIAL_UNSHIPPED_ORDERS)

  // 1. 过滤已废弃的三方海外仓及旧测试仓库，确保严格对齐西邮、环世、千亚、乐歌 49 个标准物理仓
  const validProviders = Object.keys(TP_OVERSEAS_WAREHOUSES_MAP)
  let cleanStocks = childStocks.filter(s => validProviders.includes(s.tpWh) && TP_OVERSEAS_WAREHOUSES_MAP[s.tpWh]?.includes(s.whName))
  if (cleanStocks.length === 0 && INITIAL_CHILD_PHYSICAL_STOCKS.length > 0) {
    cleanStocks = [...INITIAL_CHILD_PHYSICAL_STOCKS]
  }

  // 2. 构造不同海外仓与分仓的丰富业务场景 (支持同销售SKU在不同海外仓同时存在缺货、在途覆盖或健康充盈)
  // 场景 1: DEMO-MULTI-01 全能储物榻榻米
  // 1.1 西邮 - WPLA11 (断货归零场景：地台为0，全套停摆)
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-13' && s.tpWh === '西邮' && s.whName === 'WPLA11')) {
    cleanStocks.push({
      id: 'c_demo_C13_xy_wpla11',
      childCode: 'DEMO-C-13',
      childName: '大容量气压高箱储物榻榻米床体',
      spec: 'Tatami-Storage',
      tpWh: '西邮',
      whName: 'WPLA11',
      availableQty: 0,
      transitQty: 0,
      linkedParents: ['DEMO-MULTI-01']
    })
  }
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-14' && s.tpWh === '西邮' && s.whName === 'WPLA11')) {
    cleanStocks.push({
      id: 'c_demo_C14_xy_wpla11',
      childCode: 'DEMO-C-14',
      childName: '顶天立地分区挂衣储物三门大衣柜',
      spec: 'Wardrobe-3Door',
      tpWh: '西邮',
      whName: 'WPLA11',
      availableQty: 180,
      transitQty: 40,
      linkedParents: ['DEMO-MULTI-01']
    })
  }
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-15' && s.tpWh === '西邮' && s.whName === 'WPLA11')) {
    cleanStocks.push({
      id: 'c_demo_C15_xy_wpla11',
      childCode: 'DEMO-C-15',
      childName: 'L型加宽加厚转角多功能书桌架',
      spec: 'Desk-LCorner',
      tpWh: '西邮',
      whName: 'WPLA11',
      availableQty: 180,
      transitQty: 40,
      linkedParents: ['DEMO-MULTI-01']
    })
  }

  // 1.2 千亚 - QY-TX01 (多物料协同短板：榻榻米与大衣柜同为 60 套短板)
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-13' && s.tpWh === '千亚' && s.whName === 'QY-TX01')) {
    cleanStocks.push({
      id: 'c_demo_C13_qy_tx01',
      childCode: 'DEMO-C-13',
      childName: '大容量气压高箱储物榻榻米床体',
      spec: 'Tatami-Storage',
      tpWh: '千亚',
      whName: 'QY-TX01',
      availableQty: 60,
      transitQty: 30,
      linkedParents: ['DEMO-MULTI-01']
    })
  }
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-14' && s.tpWh === '千亚' && s.whName === 'QY-TX01')) {
    cleanStocks.push({
      id: 'c_demo_C14_qy_tx01',
      childCode: 'DEMO-C-14',
      childName: '顶天立地分区挂衣储物三门大衣柜',
      spec: 'Wardrobe-3Door',
      tpWh: '千亚',
      whName: 'QY-TX01',
      availableQty: 60,
      transitQty: 30,
      linkedParents: ['DEMO-MULTI-01']
    })
  }
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-15' && s.tpWh === '千亚' && s.whName === 'QY-TX01')) {
    cleanStocks.push({
      id: 'c_demo_C15_qy_tx01',
      childCode: 'DEMO-C-15',
      childName: 'L型加宽加厚转角多功能书桌架',
      spec: 'Desk-LCorner',
      tpWh: '千亚',
      whName: 'QY-TX01',
      availableQty: 200,
      transitQty: 50,
      linkedParents: ['DEMO-MULTI-01']
    })
  }

  // 1.3 乐歌 - NJF (单物料短板 + 在途足额完全覆盖场景)
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-13' && s.tpWh === '乐歌' && s.whName === 'NJF')) {
    cleanStocks.push({
      id: 'c_demo_C13_lg_njf',
      childCode: 'DEMO-C-13',
      childName: '大容量气压高箱储物榻榻米床体',
      spec: 'Tatami-Storage',
      tpWh: '乐歌',
      whName: 'NJF',
      availableQty: 250,
      transitQty: 0,
      linkedParents: ['DEMO-MULTI-01']
    })
  }
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-14' && s.tpWh === '乐歌' && s.whName === 'NJF')) {
    cleanStocks.push({
      id: 'c_demo_C14_lg_njf',
      childCode: 'DEMO-C-14',
      childName: '顶天立地分区挂衣储物三门大衣柜',
      spec: 'Wardrobe-3Door',
      tpWh: '乐歌',
      whName: 'NJF',
      availableQty: 50,
      transitQty: 200,
      linkedParents: ['DEMO-MULTI-01']
    })
  }
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-15' && s.tpWh === '乐歌' && s.whName === 'NJF')) {
    cleanStocks.push({
      id: 'c_demo_C15_lg_njf',
      childCode: 'DEMO-C-15',
      childName: 'L型加宽加厚转角多功能书桌架',
      spec: 'Desk-LCorner',
      tpWh: '乐歌',
      whName: 'NJF',
      availableQty: 250,
      transitQty: 0,
      linkedParents: ['DEMO-MULTI-01']
    })
  }

  // 1.4 环世 - USNJHM01 (平衡充盈健康在库)
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-13' && s.tpWh === '环世' && s.whName === 'USNJHM01')) {
    cleanStocks.push({
      id: 'c_demo_C13_hs_njhm01',
      childCode: 'DEMO-C-13',
      childName: '大容量气压高箱储物榻榻米床体',
      spec: 'Tatami-Storage',
      tpWh: '环世',
      whName: 'USNJHM01',
      availableQty: 300,
      transitQty: 60,
      linkedParents: ['DEMO-MULTI-01']
    })
  }
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-14' && s.tpWh === '环世' && s.whName === 'USNJHM01')) {
    cleanStocks.push({
      id: 'c_demo_C14_hs_njhm01',
      childCode: 'DEMO-C-14',
      childName: '顶天立地分区挂衣储物三门大衣柜',
      spec: 'Wardrobe-3Door',
      tpWh: '环世',
      whName: 'USNJHM01',
      availableQty: 300,
      transitQty: 60,
      linkedParents: ['DEMO-MULTI-01']
    })
  }
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-15' && s.tpWh === '环世' && s.whName === 'USNJHM01')) {
    cleanStocks.push({
      id: 'c_demo_C15_hs_njhm01',
      childCode: 'DEMO-C-15',
      childName: 'L型加宽加厚转角多功能书桌架',
      spec: 'Desk-LCorner',
      tpWh: '环世',
      whName: 'USNJHM01',
      availableQty: 300,
      transitQty: 60,
      linkedParents: ['DEMO-MULTI-01']
    })
  }

  // 场景 2: DEMO-SHORT-01 轻奢岩板餐桌椅套装
  // 西邮 - WPCHI3 (断货归零场景：餐椅为0)
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-09' && s.tpWh === '西邮' && s.whName === 'WPCHI3')) {
    cleanStocks.push({
      id: 'c_demo_C09_xy_wpchi3',
      childCode: 'DEMO-C-09',
      childName: '黑胡桃实木加厚长餐桌主台(1.6m)',
      spec: 'Table-160cm',
      tpWh: '西邮',
      whName: 'WPCHI3',
      availableQty: 150,
      transitQty: 30,
      linkedParents: ['DEMO-SHORT-01']
    })
  }
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-10' && s.tpWh === '西邮' && s.whName === 'WPCHI3')) {
    cleanStocks.push({
      id: 'c_demo_C10_xy_wpchi3',
      childCode: 'DEMO-C-10',
      childName: '人体工学弧形靠背餐椅(单把装)',
      spec: 'Chair-Curve',
      tpWh: '西邮',
      whName: 'WPCHI3',
      availableQty: 0,
      transitQty: 0,
      linkedParents: ['DEMO-SHORT-01']
    })
  }

  // 千亚 - GA4131 (单物料短板场景)
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-09' && s.tpWh === '千亚' && s.whName === 'GA4131')) {
    cleanStocks.push({
      id: 'c_demo_C09_qy_ga4131',
      childCode: 'DEMO-C-09',
      childName: '黑胡桃实木加厚长餐桌主台(1.6m)',
      spec: 'Table-160cm',
      tpWh: '千亚',
      whName: 'GA4131',
      availableQty: 120,
      transitQty: 20,
      linkedParents: ['DEMO-SHORT-01']
    })
  }
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-10' && s.tpWh === '千亚' && s.whName === 'GA4131')) {
    cleanStocks.push({
      id: 'c_demo_C10_qy_ga4131',
      childCode: 'DEMO-C-10',
      childName: '人体工学弧形靠背餐椅(单把装)',
      spec: 'Chair-Curve',
      tpWh: '千亚',
      whName: 'GA4131',
      availableQty: 160,
      transitQty: 120,
      linkedParents: ['DEMO-SHORT-01']
    })
  }

  // 场景 3: DEMO-SHORT-02 主卧高箱大床套组
  // 乐歌 - SAV (协同短板)
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-11' && s.tpWh === '乐歌' && s.whName === 'SAV')) {
    cleanStocks.push({
      id: 'c_demo_C11_lg_sav',
      childCode: 'DEMO-C-11',
      childName: '北美白橡木高箱大床主框架',
      spec: 'Bed-Oak180',
      tpWh: '乐歌',
      whName: 'SAV',
      availableQty: 30,
      transitQty: 20,
      linkedParents: ['DEMO-SHORT-02']
    })
  }
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-12' && s.tpWh === '乐歌' && s.whName === 'SAV')) {
    cleanStocks.push({
      id: 'c_demo_C12_lg_sav',
      childCode: 'DEMO-C-12',
      childName: '亲肤乳胶高弹独立袋装弹簧床垫',
      spec: 'Mattress-Spring',
      tpWh: '乐歌',
      whName: 'SAV',
      availableQty: 30,
      transitQty: 20,
      linkedParents: ['DEMO-SHORT-02']
    })
  }

  // 环世 - USSAV02 (断货归零)
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-11' && s.tpWh === '环世' && s.whName === 'USSAV02')) {
    cleanStocks.push({
      id: 'c_demo_C11_hs_sav02',
      childCode: 'DEMO-C-11',
      childName: '北美白橡木高箱大床主框架',
      spec: 'Bed-Oak180',
      tpWh: '环世',
      whName: 'USSAV02',
      availableQty: 100,
      transitQty: 0,
      linkedParents: ['DEMO-SHORT-02']
    })
  }
  if (!cleanStocks.some(s => s.childCode === 'DEMO-C-12' && s.tpWh === '环世' && s.whName === 'USSAV02')) {
    cleanStocks.push({
      id: 'c_demo_C12_hs_sav02',
      childCode: 'DEMO-C-12',
      childName: '亲肤乳胶高弹独立袋装弹簧床垫',
      spec: 'Mattress-Spring',
      tpWh: '环世',
      whName: 'USSAV02',
      availableQty: 0,
      transitQty: 0,
      linkedParents: ['DEMO-SHORT-02']
    })
  }

  // 场景 4: 物理编码 DRAFT-1790072625028uvld3 在乐歌 CAMV、SAV、SCM 都有库存且存在不齐套
  const targetDraftStocks = [
    // 4.1 乐歌 - CAMV (断货归零场景: IF260215=0, IF260207=160, IF260208=160 -> 齐套 0 套, 缺 160 套)
    { childCode: 'IF260215', tpWh: '乐歌', whName: 'CAMV', availableQty: 0, transitQty: 0, spec: 'Suite-Nordic-Top' },
    { childCode: 'IF260207', tpWh: '乐歌', whName: 'CAMV', availableQty: 160, transitQty: 30, spec: 'Suite-Nordic-Side' },
    { childCode: 'IF260208', tpWh: '乐歌', whName: 'CAMV', availableQty: 160, transitQty: 30, spec: 'Suite-Nordic-Window' },
    // 4.2 乐歌 - SAV (多物料协同短板场景: IF260215=40, IF260207=40并列短板, IF260208=180 -> 齐套 40 套, 缺 140 套)
    { childCode: 'IF260215', tpWh: '乐歌', whName: 'SAV', availableQty: 40, transitQty: 20, spec: 'Suite-Nordic-Top' },
    { childCode: 'IF260207', tpWh: '乐歌', whName: 'SAV', availableQty: 40, transitQty: 20, spec: 'Suite-Nordic-Side' },
    { childCode: 'IF260208', tpWh: '乐歌', whName: 'SAV', availableQty: 180, transitQty: 40, spec: 'Suite-Nordic-Window' },
    // 4.3 乐歌 - SCM (单物料短板场景: IF260208=60短板在途100, IF260215=200, IF260207=200 -> 齐套 60 套, 缺 140 套)
    { childCode: 'IF260215', tpWh: '乐歌', whName: 'SCM', availableQty: 200, transitQty: 40, spec: 'Suite-Nordic-Top' },
    { childCode: 'IF260207', tpWh: '乐歌', whName: 'SCM', availableQty: 200, transitQty: 40, spec: 'Suite-Nordic-Side' },
    { childCode: 'IF260208', tpWh: '乐歌', whName: 'SCM', availableQty: 60, transitQty: 100, spec: 'Suite-Nordic-Window' }
  ]

  // 清除乐歌除 CAMV, SAV, SCM 外可能残存的 IF260215, IF260207, IF260208 旧数据
  cleanStocks = cleanStocks.filter(s => {
    if (['IF260215', 'IF260207', 'IF260208'].includes(s.childCode) && s.tpWh === '乐歌') {
      return ['CAMV', 'SAV', 'SCM'].includes(s.whName)
    }
    return true
  })

  targetDraftStocks.forEach(t => {
    const existing = cleanStocks.find(s => s.childCode === t.childCode && s.tpWh === t.tpWh && s.whName === t.whName)
    if (existing) {
      existing.availableQty = t.availableQty
      existing.transitQty = t.transitQty
    } else {
      cleanStocks.push({
        id: `c_${t.childCode}_${t.whName.toLowerCase()}`,
        childCode: t.childCode,
        childName: t.childCode === 'IF260215' ? '组合电视柜上架' : (t.childCode === 'IF260207' ? '边柜' : '窗边柜'),
        spec: t.spec,
        tpWh: t.tpWh,
        whName: t.whName,
        availableQty: t.availableQty,
        transitQty: t.transitQty,
        linkedParents: ['DRAFT-1790072625028uvld3']
      })
    }
  })

  const draftBinding = bindings.find(b => b.parentCode === 'DRAFT-1790072625028uvld3')
  if (draftBinding) {
    draftBinding.tpWh = '乐歌'
  }

  saveToStorage(STORAGE_KEYS.CHILD_PHYSICAL_STOCKS, cleanStocks)

  // 3. 按 childCode 聚合子物料存量明细，同时去除仓库名称前后空格
  const childStockByCode = new Map<string, ChildPhysicalStockRecord[]>()
  cleanStocks.forEach(st => {
    if (!st.childCode) return
    const cleanedSt: ChildPhysicalStockRecord = {
      ...st,
      whName: (st.whName || 'WPLA11').trim(),
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
    const platform = asinMatch?.platform || 'Amazon'
    const account = asinMatch ? asinMatch.account : 'MNE'
    const site = asinMatch ? asinMatch.site : 'US'
    const flag = asinMatch ? asinMatch.countryFlag : '🇺🇸'
    const asin = asinMatch ? asinMatch.asin : (b.parentCode ? 'B08' + b.parentCode.slice(-6) : 'B080000000')
    const sku = b.sku || (asinMatch ? asinMatch.sku : b.parentCode)
    const defaultTpWh = b.tpWh || '西邮'
    const comboMeta = getFurnitureComboMeta(b.parentCode)
    const style = b.style || comboMeta?.style || '标准版'
    const mainMaterial = b.material || comboMeta?.material || '实木/刨花板/碳钢'
    const brand = b.brand || comboMeta?.brand || '中性'
    const color = b.color || comboMeta?.color || '-'
    const packQty = b.packQty || comboMeta?.packQty || '1pack'

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
        tpWh: defaultTpWh,
        bomRatio: sub.ratio || 1,
        availableQty: 0,
        transitQty: 0,
        warehouseDist: [{ whName: '暂无物理库存', shortName: '无', qty: 0 }]
      }))

      const childWarehouseRows: ChildWarehouseStockRow[] = boundChildren.map(sub => ({
        childCode: sub.childCode,
        childName: sub.childName || sub.childCode,
        bomRatio: sub.ratio || 1,
        tpWh: defaultTpWh,
        warehouseName: '暂无物理库存',
        availableQty: 0,
        transitQty: 0,
        penetratedSets: 0,
        transitSets: 0,
        rowSpan: 1,
        isFirstChildRow: true
      }))

      result.push({
        id: `k_${bIdx}`,
        platform,
        account,
        site,
        countryFlag: flag,
        asin,
        sku,
        parentMaterialCode: b.parentCode,
        productName: b.productName,
        style,
        mainMaterial,
        brand,
        color,
        packQty,
        targetBrand: brand,
        model: b.parentCode,
        coveredWarehouses: [],
        warehouseNamesSummary: '暂无物理仓储',
        tpOverseasWh: defaultTpWh,
        warehouseName: '暂无物理库存',
        image: `https://picsum.photos/100/100?random=${(bIdx % 50) + 100}`,
        childMaterials,
        childWarehouseRows,
        warehouseBreakdown: [],
        tpWarehouseBreakdown: [],
        rawPenetratedAvailable: 0,
        calculatedParentAvailable: 0,
        calculatedParentTransit: 0,
        orderOccupiedQty: 0,
        unshippedOrderCount: 0,
        unshippedOrders: [],
        bottleneckChild: childMaterials.length > 0 ? {
          childCode: childMaterials[0].childCode,
          childName: childMaterials[0].childName,
          bomRatio: childMaterials[0].bomRatio,
          availableQty: 0
        } : null,
        bottleneckChildren: []
      })
      return
    }

    // 针对每个物理仓库独立穿透计算该仓库下的齐套可售与在途套数（跨国电商各仓独立齐套打包发货）
    const warehouseBreakdown: WarehouseStockBreakdown[] = []
    let totalParentAvail = 0
    let totalParentTransit = 0
    const coveredWarehouses: { tpWh: string; warehouseName: string; availableSets: number }[] = []

    warehouseKeysMap.forEach(({ tpWh, whName }) => {
      let minWhAvail = Infinity
      let minWhTransit = Infinity
      const whChildMaterials: {
        childCode: string
        childName: string
        bomRatio: number
        availableQty: number
        transitQty: number
        calcSets: number
      }[] = []

      boundChildren.forEach(sub => {
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

        if (availSets < minWhAvail) minWhAvail = availSets
        if (transitSets < minWhTransit) minWhTransit = transitSets

        whChildMaterials.push({
          childCode: sub.childCode,
          childName: sub.childName || sub.childCode,
          bomRatio: sub.ratio || 1,
          availableQty: availInWh,
          transitQty: transitInWh,
          calcSets: availSets
        })
      })

      if (boundChildren.length === 0) {
        minWhAvail = 0
        minWhTransit = 0
      }

      const finalWhAvail = minWhAvail === Infinity ? 0 : minWhAvail
      const finalWhTransit = minWhTransit === Infinity ? 0 : minWhTransit

      // 计算该分仓匹配的待发货 (Unshipped) 订单占用
      const whOrders = unshippedOrders.filter(o => {
        const matchCode = (o.parentMaterialCode && o.parentMaterialCode === b.parentCode) || (o.sku && (o.sku === sku || o.sku === b.parentCode))
        const matchWh = o.warehouseName ? o.warehouseName === whName : (o.tpOverseasWh ? o.tpOverseasWh === tpWh : true)
        return matchCode && matchWh
      })
      const whOccupied = whOrders.reduce((sum, o) => sum + Number(o.orderedQty || 0), 0)

      warehouseBreakdown.push({
        tpWh,
        warehouseName: whName,
        availableSets: finalWhAvail,
        transitSets: finalWhTransit,
        orderOccupiedQty: whOccupied,
        unshippedOrderCount: whOrders.length,
        childMaterials: whChildMaterials
      })

      totalParentAvail += finalWhAvail
      totalParentTransit += finalWhTransit

      coveredWarehouses.push({
        tpWh,
        warehouseName: whName,
        availableSets: finalWhAvail
      })
    })

    // 按照第三方海外仓 (tpWh) 分组排序，确保属于同一个三方海外仓的多个仓库连续排列
    warehouseBreakdown.sort((a, b) => a.tpWh.localeCompare(b.tpWh, 'zh-CN'))

    // 计算同一个第三方海外仓的 rowSpan
    let currentTpWh = ''
    let startIndex = 0
    warehouseBreakdown.forEach((item, index) => {
      if (item.tpWh !== currentTpWh) {
        if (currentTpWh !== '') {
          const count = index - startIndex
          warehouseBreakdown[startIndex].tpRowSpan = count
          for (let k = startIndex + 1; k < index; k++) {
            warehouseBreakdown[k].tpRowSpan = 0
          }
        }
        currentTpWh = item.tpWh
        startIndex = index
      }
    })
    if (warehouseBreakdown.length > 0) {
      const count = warehouseBreakdown.length - startIndex
      warehouseBreakdown[startIndex].tpRowSpan = count
      for (let k = startIndex + 1; k < warehouseBreakdown.length; k++) {
        warehouseBreakdown[k].tpRowSpan = 0
      }
    }

    // 针对每个【第三方海外仓】(tpWh) 独立计算该三方仓下的物理可售、物理在途、穿透折算可售数量、在途及待发货占用
    const tpWhSet = new Set<string>()
    boundChildren.forEach(sub => {
      const stocks = childStockByCode.get(sub.childCode) || []
      stocks.forEach(st => {
        if (st.tpWh) tpWhSet.add(st.tpWh)
      })
    })
    if (tpWhSet.size === 0) tpWhSet.add(defaultTpWh || '西邮')

    const tpWarehouseBreakdown: ThirdPartyWarehouseBreakdown[] = []
    let totalPenetratedAvail = 0
    let totalPenetratedTransit = 0

    tpWhSet.forEach(tpWh => {
      let tpPhysicalAvail = 0
      let tpPhysicalTransit = 0
      const whNameSet = new Set<string>()

      let minTpAvail = Infinity
      let minTpTransit = Infinity

      boundChildren.forEach(sub => {
        const stocks = childStockByCode.get(sub.childCode) || []
        const matchingStocks = stocks.filter(st => st.tpWh === tpWh)

        let childAvailInTp = 0
        let childTransitInTp = 0
        matchingStocks.forEach(st => {
          childAvailInTp += Number(st.availableQty || 0)
          childTransitInTp += Number(st.transitQty || 0)
          if (st.whName) whNameSet.add(st.whName)
        })

        tpPhysicalAvail += childAvailInTp
        tpPhysicalTransit += childTransitInTp

        const availSets = Math.floor(childAvailInTp / (sub.ratio || 1))
        const transitSets = Math.floor(childTransitInTp / (sub.ratio || 1))

        if (availSets < minTpAvail) minTpAvail = availSets
        if (transitSets < minTpTransit) minTpTransit = transitSets
      })

      if (boundChildren.length === 0) {
        minTpAvail = 0
        minTpTransit = 0
      }

      // 跨国电商各分仓独立齐套备货与发货：同一三方海外仓的可售套数 = 其下属各物理分仓独立齐套可售套数之和
      const tpWhBreakdowns = warehouseBreakdown.filter(w => w.tpWh === tpWh)
      const finalTpAvail = tpWhBreakdowns.length > 0
        ? tpWhBreakdowns.reduce((sum, w) => sum + w.availableSets, 0)
        : (minTpAvail === Infinity ? 0 : minTpAvail)
      const finalTpTransit = tpWhBreakdowns.length > 0
        ? tpWhBreakdowns.reduce((sum, w) => sum + w.transitSets, 0)
        : (minTpTransit === Infinity ? 0 : minTpTransit)

      // 计算该第三方海外仓匹配的待发货 (Unshipped) 订单占用
      const whOrders = unshippedOrders.filter(o => {
        const matchCode = (o.parentMaterialCode && o.parentMaterialCode === b.parentCode) || (o.sku && (o.sku === sku || o.sku === b.parentCode))
        const matchWh = o.tpOverseasWh ? o.tpOverseasWh === tpWh : Array.from(whNameSet).includes(o.warehouseName)
        return matchCode && matchWh
      })
      const whOccupied = whOrders.reduce((sum, o) => sum + Number(o.orderedQty || 0), 0)

      tpWarehouseBreakdown.push({
        tpWh,
        warehouseNames: Array.from(whNameSet).join('、') || `${tpWh}主仓`,
        availableQty: tpPhysicalAvail,
        transitQty: tpPhysicalTransit,
        availableSets: finalTpAvail,
        transitSets: finalTpTransit,
        orderOccupiedQty: whOccupied,
        unshippedOrderCount: whOrders.length,
        netAvailableSets: Math.max(0, finalTpAvail - whOccupied)
      })

      totalPenetratedAvail += finalTpAvail
      totalPenetratedTransit += finalTpTransit
    })

    // 汇总各子物料在全海外仓的物理总存量及分仓分布
    const childMaterials = boundChildren.map(sub => {
      const stocks = childStockByCode.get(sub.childCode) || []
      let totalChildAvail = 0
      let totalChildTransit = 0
      const warehouseDist: ChildWarehouseDist[] = []

      warehouseKeysMap.forEach(({ tpWh, whName }) => {
        const matchingWhStocks = stocks.filter(st => st.whName === whName && st.tpWh === tpWh)
        let q = 0
        matchingWhStocks.forEach(st => {
          q += Number(st.availableQty || 0)
          totalChildTransit += Number(st.transitQty || 0)
        })
        totalChildAvail += q
        warehouseDist.push({
          whName,
          shortName: whName.length > 7 ? whName.slice(0, 7) : whName,
          qty: q
        })
      })

      const tpList = Array.from(new Set(stocks.map(st => st.tpWh).filter(Boolean)))
      const tpWh = tpList.length > 0 ? tpList.join('、') : defaultTpWh

      return {
        childCode: sub.childCode,
        childName: sub.childName || sub.childCode,
        tpWh,
        bomRatio: sub.ratio || 1,
        availableQty: totalChildAvail,
        transitQty: totalChildTransit,
        warehouseDist
      }
    })

    // 为子物料生成按每个三方海外仓及分支仓库独立成行的明细列表 (展开行分多行展示)
    const childWarehouseRows: ChildWarehouseStockRow[] = []

    boundChildren.forEach(sub => {
      const stocks = childStockByCode.get(sub.childCode) || []
      const childWhEntries: {
        tpWh: string
        whName: string
        avail: number
        transit: number
      }[] = []

      // 按仓库分支汇总该子物料在各仓的物理在库与在途
      warehouseKeysMap.forEach(({ tpWh, whName }) => {
        const matchingStocks = stocks.filter(st => st.whName === whName && st.tpWh === tpWh)
        let whAvail = 0
        let whTransit = 0
        matchingStocks.forEach(st => {
          whAvail += Number(st.availableQty || 0)
          whTransit += Number(st.transitQty || 0)
        })
        if (whAvail > 0 || whTransit > 0 || warehouseKeysMap.size === 1) {
          childWhEntries.push({
            tpWh,
            whName,
            avail: whAvail,
            transit: whTransit
          })
        }
      })

      // 若未过滤出有库存仓，则补充各仓 0 存量行
      if (childWhEntries.length === 0) {
        if (warehouseKeysMap.size > 0) {
          warehouseKeysMap.forEach(({ tpWh, whName }) => {
            childWhEntries.push({ tpWh, whName, avail: 0, transit: 0 })
          })
        } else {
          childWhEntries.push({ tpWh: defaultTpWh, whName: '暂无物理库存', avail: 0, transit: 0 })
        }
      }

      const rowCount = childWhEntries.length
      childWhEntries.forEach((entry, idx) => {
        const availSets = Math.floor(entry.avail / (sub.ratio || 1))
        const transitSets = Math.floor(entry.transit / (sub.ratio || 1))

        childWarehouseRows.push({
          childCode: sub.childCode,
          childName: sub.childName || sub.childCode,
          bomRatio: sub.ratio || 1,
          tpWh: entry.tpWh,
          warehouseName: entry.whName,
          availableQty: entry.avail,
          transitQty: entry.transit,
          penetratedSets: availSets,
          transitSets: transitSets,
          rowSpan: idx === 0 ? rowCount : 0,
          isFirstChildRow: idx === 0
        })
      })
    })

    // 提取全局短板子物料
    const sortedChildren = childMaterials
      .map(c => ({
        childCode: c.childCode,
        childName: c.childName,
        bomRatio: c.bomRatio,
        availableQty: c.availableQty,
        availSets: Math.floor(c.availableQty / c.bomRatio)
      }))
      .sort((a, b) => a.availSets - b.availSets)

    const lowestSets = sortedChildren.length > 0 ? sortedChildren[0].availSets : 0
    const primaryBottlenecks = sortedChildren.filter(c => c.availSets === lowestSets)
    const primaryBottleneck = primaryBottlenecks.length > 0 ? primaryBottlenecks[0] : null

    // 该 SKU 在所有海外仓的总待发货 (Unshipped) 订单占用
    const allMatchingOrders = unshippedOrders.filter(o => 
      (o.parentMaterialCode && o.parentMaterialCode === b.parentCode) || 
      (o.sku && (o.sku === sku || o.sku === b.parentCode))
    )
    const totalOccupiedQty = allMatchingOrders.reduce((sum, o) => sum + Number(o.orderedQty || 0), 0)

    // 外层可售数量 = 多个第三方海外仓穿透可售汇总 - 订单占用套数
    const outerAvailable = Math.max(0, totalPenetratedAvail - totalOccupiedQty)

    const tpWhList = Array.from(new Set(coveredWarehouses.map(w => w.tpWh)))
    const whNameList = coveredWarehouses.map(w => w.warehouseName)
    const warehouseNamesSummary = coveredWarehouses.map(w => `${w.tpWh}(${w.warehouseName})`).join('、') || '暂无仓储'

    result.push({
      id: `k_${bIdx}`,
      platform,
      account,
      site,
      countryFlag: flag,
      asin,
      sku,
      parentMaterialCode: b.parentCode,
      productName: b.productName,
      style,
      mainMaterial,
      brand,
      color,
      packQty,
      targetBrand: brand,
      model: b.parentCode,
      coveredWarehouses,
      warehouseNamesSummary,
      tpOverseasWh: tpWhList.join('、') || defaultTpWh,
      warehouseName: whNameList.join('、') || '暂无物理库存',
      image: `https://picsum.photos/100/100?random=${(bIdx % 50) + 100}`,
      childMaterials,
      childWarehouseRows,
      warehouseBreakdown,
      tpWarehouseBreakdown,
      rawPenetratedAvailable: totalPenetratedAvail,
      orderOccupiedQty: totalOccupiedQty,
      unshippedOrderCount: allMatchingOrders.length,
      unshippedOrders: allMatchingOrders,
      calculatedParentAvailable: outerAvailable,
      calculatedParentTransit: totalPenetratedTransit,
      bottleneckChild: primaryBottleneck,
      bottleneckChildren: primaryBottlenecks
    })
  })

  return result
}

export async function dbFetchUnshippedOrders(): Promise<UnshippedOrderRecord[]> {
  return loadFromStorage(STORAGE_KEYS.UNSHIPPED_ORDERS, INITIAL_UNSHIPPED_ORDERS)
}

export async function dbSyncUnshippedOrders(): Promise<{ count: number; totalOccupied: number; syncTime: string }> {
  await new Promise(resolve => setTimeout(resolve, 400))
  const orders = loadFromStorage<UnshippedOrderRecord[]>(STORAGE_KEYS.UNSHIPPED_ORDERS, INITIAL_UNSHIPPED_ORDERS)
  const syncTime = new Date().toLocaleString()
  saveToStorage(STORAGE_KEYS.UNSHIPPED_ORDERS, orders)
  localStorage.setItem(STORAGE_KEYS.LAST_UNSHIPPED_SYNC_TIME, syncTime)
  const totalOccupied = orders.reduce((sum, o) => sum + (o.orderedQty || 0), 0)
  return { count: orders.length, totalOccupied, syncTime }
}

export function dbGetLastUnshippedSyncTime(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_UNSHIPPED_SYNC_TIME) || '刚刚'
  } catch {
    return '刚刚'
  }
}

// --- 齐套缺料预警后台 API ---
export async function dbFetchCompletenessAlerts(): Promise<CompletenessAlertRecord[]> {
  const kanbanData = await dbFetchPenetratedKanbanData()
  const alerts: CompletenessAlertRecord[] = []

  kanbanData.forEach((row, idx) => {
    // 1. 仅对多子物料组合 BOM 进行齐套分析 (单品打包不产生多子物料木桶短板)
    if (!row.childMaterials || row.childMaterials.length <= 1) return

    // 多海外仓独立备货业务模型：按每个物理海外仓独立进行齐套与缺料预警分析
    const whList = (row.warehouseBreakdown && row.warehouseBreakdown.length > 0)
      ? row.warehouseBreakdown
      : [{
          tpWh: row.tpOverseasWh || '西邮',
          warehouseName: row.warehouseName || 'WPLA11',
          availableSets: row.calculatedParentAvailable || 0,
          transitSets: row.calculatedParentTransit || 0,
          orderOccupiedQty: row.orderOccupiedQty || 0,
          childMaterials: row.childMaterials
        }]

    whList.forEach((wh, whIdx) => {
      const whChildren = wh.childMaterials || []
      if (whChildren.length <= 1) return

      const currentSets = Math.max(0, (wh.availableSets ?? 0) - (wh.orderOccupiedQty ?? 0))

      // 2. 找出当前物理仓库中各子物料支持的最大套数 (该仓的目标齐套基准)
      const childSetsList = whChildren.map(c => Math.floor((c.availableQty || 0) / (c.bomRatio || 1)))
      const maxSets = Math.max(...childSetsList)

      // 如果最高充盈套数为 0，说明该仓全部子物料均无库存，不属于木桶短板失衡
      if (maxSets <= 0) return

      // 3. 如果该仓各子物料套数完全齐套平衡 (maxSets === currentSets)，无短板制约，不产生缺料预警
      if (maxSets <= currentSets) return

      // 4. 提取该仓达到最低折算套数的子物料 (当前仓真正的瓶颈短板)
      const bottleneckItems = whChildren.filter(c => Math.floor((c.availableQty || 0) / (c.bomRatio || 1)) === currentSets)
      const bottleneckCount = bottleneckItems.length

      // 判定预警类型与严重级别
      let alertType: '断货归零' | '多物料共同短板' | '单物料短板'
      let alertLevel: 'danger' | 'warning' | 'info'
      if (currentSets === 0) {
        alertType = '断货归零'
        alertLevel = 'danger'
      } else if (bottleneckCount > 1) {
        alertType = '多物料共同短板'
        alertLevel = 'warning'
      } else {
        alertType = '单物料短板'
        alertLevel = 'warning'
      }

      const shortageItems: CompletenessShortageItem[] = []
      let totalSuggestedQty = 0
      let totalTransitQty = 0
      let netSuggestedQty = 0

      whChildren.forEach(c => {
        const cAvail = c.availableQty || 0
        const cRatio = c.bomRatio || 1
        const cSets = Math.floor(cAvail / cRatio)
        const gapSets = maxSets - cSets

        if (gapSets > 0) {
          const neededQty = gapSets * cRatio
          const tQty = c.transitQty || 0
          const tSets = Math.floor(tQty / cRatio)
          const netQty = Math.max(0, neededQty - tQty)

          totalSuggestedQty += neededQty
          totalTransitQty += tQty
          netSuggestedQty += netQty

          shortageItems.push({
            childCode: c.childCode,
            childName: c.childName,
            childStock: cAvail,
            bomRatio: cRatio,
            currentSets: cSets,
            gapSets,
            suggestedQty: neededQty,
            transitQty: tQty,
            transitSets: tSets,
            netShortageQty: netQty,
            isBottleneck: cSets === currentSets
          })
        }
      })

      if (shortageItems.length === 0) return

      let transitCoverage: '完全覆盖' | '部分覆盖' | '无在途' = '无在途'
      if (netSuggestedQty === 0 && totalTransitQty > 0) {
        transitCoverage = '完全覆盖'
      } else if (totalTransitQty > 0) {
        transitCoverage = '部分覆盖'
      }

      // 智能业务说明与协同指引 (明确指向具体收货海外仓)
      let explanation = ''
      if (alertType === '断货归零') {
        explanation = `[严重断货 · ${wh.warehouseName}] 子物料 ${bottleneckItems.map(b => b.childCode).join('、')} 存量为 0 件，整套商品停摆！需加急补齐 +${totalSuggestedQty} 件发往【${wh.warehouseName}】以达 ${maxSets} 套全齐可售。`
      } else if (alertType === '多物料共同短板') {
        explanation = `[协同补货 · ${wh.warehouseName}] 存在 ${bottleneckCount} 款并列共同短板(${bottleneckItems.map(b => b.childCode).join('、')})，必须协同补齐短板物料，该仓整套方可由 ${currentSets} 套提升至 ${maxSets} 套！`
      } else {
        explanation = `[定向补货 · ${wh.warehouseName}] 仅受制于单款瓶颈 ${bottleneckItems[0]?.childCode}，定向单独采购 +${shortageItems.find(s => s.isBottleneck)?.suggestedQty || totalSuggestedQty} 件发往【${wh.warehouseName}】即可释放 ${maxSets} 套全齐可售。`
      }

      if (transitCoverage === '完全覆盖') {
        explanation += ` (🚚 在途 ${totalTransitQty} 件已足额覆盖缺口，到货入库后将自动解除告警)`
      } else if (transitCoverage === '部分覆盖') {
        explanation += ` (🚚 已有在途 ${totalTransitQty} 件，抵扣后净缺口为 ${netSuggestedQty} 件)`
      }

      alerts.push({
        id: `alert_${idx}_${whIdx}`,
        platform: row.platform || 'Amazon',
        account: row.account || 'MNE',
        site: row.site || 'US',
        countryFlag: row.countryFlag || '🇺🇸',
        asin: row.asin || '',
        sku: row.sku || row.parentMaterialCode,
        parentCode: row.parentMaterialCode,
        productName: row.productName,
        tpOverseasWh: wh.tpWh,
        warehouseName: wh.warehouseName || '海外仓',
        image: row.image,
        currentSets,
        targetSets: maxSets,
        gapSets: maxSets - currentSets,
        otherMaxStock: maxSets * (whChildren[0]?.bomRatio || 1),
        alertType,
        alertLevel,
        bottleneckCount,
        shortageItems,
        totalSuggestedQty,
        totalTransitQty,
        netSuggestedQty,
        transitCoverage,
        explanation
      })
    })
  })

  // 按照物料编码优先分组排序，同物料编码的分仓记录必须连续排列，以便在前端表格中进行同物料编码字段合并展示
  const levelScore = { danger: 3, warning: 2, info: 1 }
  const parentPriorityMap = new Map<string, { maxScore: number; maxGap: number }>()
  alerts.forEach(a => {
    const s = levelScore[a.alertLevel] || 0
    const current = parentPriorityMap.get(a.parentCode) || { maxScore: 0, maxGap: 0 }
    if (s > current.maxScore) current.maxScore = s
    if (a.gapSets > current.maxGap) current.maxGap = a.gapSets
    parentPriorityMap.set(a.parentCode, current)
  })

  alerts.sort((a, b) => {
    // 1. 先按物料的最高危险级别排序 (存在断货归零的父物料整体排最前)
    const pA = parentPriorityMap.get(a.parentCode) || { maxScore: 0, maxGap: 0 }
    const pB = parentPriorityMap.get(b.parentCode) || { maxScore: 0, maxGap: 0 }
    if (pA.maxScore !== pB.maxScore) return pB.maxScore - pA.maxScore
    if (pA.maxGap !== pB.maxGap) return pB.maxGap - pA.maxGap

    // 2. 同优先级父物料按 parentCode 聚集
    if (a.parentCode !== b.parentCode) {
      return a.parentCode.localeCompare(b.parentCode)
    }

    // 3. 同一父物料下：按三方海外仓名称聚集 (使相同三方海外仓的物理分仓连续)
    if (a.tpOverseasWh !== b.tpOverseasWh) {
      return (a.tpOverseasWh || '').localeCompare(b.tpOverseasWh || '', 'zh-CN')
    }

    // 4. 同一三方海外仓内部：按该分仓的预警严重等级降序排列
    const sA = levelScore[a.alertLevel] || 0
    const sB = levelScore[b.alertLevel] || 0
    if (sA !== sB) return sB - sA
    return b.gapSets - a.gapSets
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
