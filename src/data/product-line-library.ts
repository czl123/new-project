/**
 * 产品线管理数据与负责人智能检索库
 * 支持根据【销售平台 + 运营大类】智能匹配产品线负责人并推送到审批流
 */

export interface ProductLinePlatformInfo {
  platform: string
  lineLeader: string
}

export interface SharedProductLineItem {
  code: string
  category: string
  shortCode: string
  teamLeader: string // 综合负责人
  platforms: ProductLinePlatformInfo[]
}

export const DEFAULT_PRODUCT_LINES: SharedProductLineItem[] = [
  {
    code: '046',
    category: '软包床',
    shortCode: 'BF',
    teamLeader: '夏忠保',
    platforms: [
      { platform: 'Amazon', lineLeader: '夏忠保' },
      { platform: 'Wayfair', lineLeader: '王美艳' },
      { platform: 'Walmart', lineLeader: '彭永昌' }
    ]
  },
  {
    code: '045',
    category: '厨房电器',
    shortCode: 'CF',
    teamLeader: '李丹',
    platforms: [
      { platform: 'Amazon', lineLeader: '李丹' },
      { platform: 'eBay', lineLeader: '张小丽' },
      { platform: 'Walmart', lineLeader: '刘洋' }
    ]
  },
  {
    code: '044',
    category: '海信电器',
    shortCode: 'CJ',
    teamLeader: '李梦',
    platforms: [
      { platform: 'Amazon', lineLeader: '李梦' },
      { platform: 'Walmart', lineLeader: '韩旭' }
    ]
  },
  {
    code: '043',
    category: '家用消耗',
    shortCode: 'HY',
    teamLeader: '何阵阵',
    platforms: [
      { platform: 'Amazon', lineLeader: '何阵阵' },
      { platform: 'TikTok', lineLeader: '许静琪' },
      { platform: 'Temu', lineLeader: '张秋霞' }
    ]
  },
  {
    code: '042',
    category: '宠物用品',
    shortCode: 'ZM',
    teamLeader: '邹晨',
    platforms: [
      { platform: 'Amazon', lineLeader: '邹晨' },
      { platform: 'TikTok', lineLeader: '周美美' },
      { platform: 'Temu', lineLeader: '侵权检光' }
    ]
  },
  {
    code: '041',
    category: '环境电器',
    shortCode: 'EE',
    teamLeader: '李丹',
    platforms: [
      { platform: 'Amazon', lineLeader: '李丹' },
      { platform: 'eBay', lineLeader: '王建' }
    ]
  },
  {
    code: '040',
    category: '个护电器',
    shortCode: 'FH',
    teamLeader: '李丹',
    platforms: [
      { platform: 'Amazon', lineLeader: '李丹' },
      { platform: 'TikTok', lineLeader: '张小丽' }
    ]
  },
  {
    code: '039',
    category: '季节电器',
    shortCode: 'SE',
    teamLeader: '李梦',
    platforms: [
      { platform: 'Amazon', lineLeader: '李梦' },
      { platform: 'Walmart', lineLeader: '赵敏' }
    ]
  },
  {
    code: '038',
    category: '户外用品',
    shortCode: 'OD',
    teamLeader: '李强',
    platforms: [
      { platform: 'Amazon', lineLeader: '李强' },
      { platform: 'Walmart', lineLeader: '郑亚良' },
      { platform: 'TikTok', lineLeader: '谢晨' }
    ]
  },
  {
    code: '037',
    category: '竹木家具',
    shortCode: 'HZ',
    teamLeader: '李呈',
    platforms: [
      { platform: 'Amazon', lineLeader: '李呈' },
      { platform: 'Walmart', lineLeader: '钟运全' },
      { platform: 'Wayfair', lineLeader: '谭昌星' }
    ]
  },
  {
    code: '036',
    category: '汽车配件',
    shortCode: 'AA',
    teamLeader: '王世琦',
    platforms: [
      { platform: 'Amazon', lineLeader: '王世琦' },
      { platform: 'eBay', lineLeader: '郑富兴' }
    ]
  },
  {
    code: '035',
    category: '艾草类',
    shortCode: 'ST',
    teamLeader: '孔素粉',
    platforms: [
      { platform: 'Amazon', lineLeader: '孔素粉' },
      { platform: 'TikTok', lineLeader: '张秋霞' }
    ]
  },
  {
    code: '034',
    category: '外拍产品',
    shortCode: 'WP',
    teamLeader: '周美美',
    platforms: [
      { platform: 'Amazon', lineLeader: '周美美' }
    ]
  },
  {
    code: '033',
    category: '摄影监控',
    shortCode: 'SY',
    teamLeader: '张云汉',
    platforms: [
      { platform: 'Amazon', lineLeader: '张云汉' }
    ]
  },
  {
    code: '032',
    category: '办公用品',
    shortCode: 'BG',
    teamLeader: '彭永昌',
    platforms: [
      { platform: 'Amazon', lineLeader: '彭永昌' }
    ]
  },
  {
    code: '031',
    category: '智能手表',
    shortCode: 'SW',
    teamLeader: '何晃',
    platforms: [
      { platform: 'Amazon', lineLeader: '何晃' }
    ]
  },
  {
    code: '030',
    category: '游戏配件',
    shortCode: 'GA',
    teamLeader: '周锐',
    platforms: [
      { platform: 'Amazon', lineLeader: '周锐' }
    ]
  },
  {
    code: '047',
    category: '家具/室内家具',
    shortCode: 'IF',
    teamLeader: '夏忠保',
    platforms: [
      { platform: 'Amazon', lineLeader: '夏忠保' },
      { platform: 'Walmart', lineLeader: '李呈' },
      { platform: 'Wayfair', lineLeader: '王美艳' },
      { platform: 'eBay', lineLeader: '彭永昌' },
      { platform: 'TikTok', lineLeader: '谢晨' },
      { platform: 'Temu', lineLeader: '郑富兴' },
      { platform: '独立站', lineLeader: '张经理' }
    ]
  }
]

export const SALES_PLATFORMS = [
  'Amazon',
  'Walmart',
  'eBay',
  'TikTok',
  'Wayfair',
  'Temu',
  'SHEIN',
  '独立站'
] as const

export type SalesPlatform = typeof SALES_PLATFORMS[number]

/**
 * 获取当前所有产品线数据（优先从 localStorage 读取产品线管理维护的配置，若无则使用默认库）
 */
export function getAllProductLines(): SharedProductLineItem[] {
  try {
    const raw = localStorage.getItem('PRODUCT_LINES_STORE_V1')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    // ignore
  }
  return DEFAULT_PRODUCT_LINES
}

/**
 * 根据【销售平台 + 运营大类】智能检索产品线负责人
 * @param category 运营大类名称（例如：'家具/室内家具', '软包床', '厨房电器' 等）
 * @param platform 销售平台（例如：'Amazon', 'Walmart', 'Wayfair' 等）
 * @returns 产品线负责人及产品线信息
 */
export function lookupProductLineLeader(category?: string, platform?: string): {
  leader: string
  matchType: 'platform-exact' | 'category-default' | 'system-fallback'
  productLineName: string
  lineName: string
  lineCode: string
} {
  const list = getAllProductLines()
  const trimmedCat = (category || '').trim().toLowerCase()
  const trimmedPlat = (platform || '').trim().toLowerCase()

  if (!trimmedCat) {
    return {
      leader: '张经理 (产品负责人)',
      matchType: 'system-fallback',
      productLineName: '通用产品线',
      lineName: '通用产品线',
      lineCode: '000'
    }
  }

  // 1. 匹配运营大类（精确或包含）
  const matchedLine = list.find(item => {
    const c = item.category.toLowerCase()
    return c === trimmedCat || c.includes(trimmedCat) || trimmedCat.includes(c)
  })

  if (matchedLine) {
    // 2. 如果指定了销售平台，在对应平台的负责团队/负责人中检索
    if (trimmedPlat && matchedLine.platforms && matchedLine.platforms.length > 0) {
      const matchedPf = matchedLine.platforms.find(p => p.platform.toLowerCase() === trimmedPlat)
      if (matchedPf && matchedPf.lineLeader) {
        return {
          leader: matchedPf.lineLeader,
          matchType: 'platform-exact',
          productLineName: matchedLine.category,
          lineName: matchedLine.category,
          lineCode: matchedLine.code
        }
      }
    }

    // 若无对应平台负责人，返回该产品线的综合负责人
    return {
      leader: matchedLine.teamLeader || '张经理 (产品负责人)',
      matchType: 'category-default',
      productLineName: matchedLine.category,
      lineName: matchedLine.category,
      lineCode: matchedLine.code
    }
  }

  // 默认兜底
  return {
    leader: '张经理 (产品负责人)',
    matchType: 'system-fallback',
    productLineName: category || '默认产品线',
    lineName: category || '默认产品线',
    lineCode: '047'
  }
}
