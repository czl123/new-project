const fs = require('fs')
const path = require('path')

const TP_OVERSEAS_WAREHOUSES_MAP = {
  '西邮': [
    'WPCHI2', 'WPGA4', 'WPHOU4', 'WPLA11', 'WPLA4',
    'WPNJ4', 'WPNJ7', 'WPLA16', 'WPHOU7', 'WPGA5',
    'WPHOU6', 'WPCHI3', 'WPCHI4'
  ],
  '环世': [
    'USCOI03', 'USHOU04', 'USNJHM01', 'USCAEA02', 'USGASA01',
    'USSAV02', 'USNJBW02', 'USTXHU01', 'USSAV03', 'USHOU04-1'
  ],
  '千亚': [
    'LA3', 'QY-NJ02', 'GA4131', 'QY-TX01', 'QY-GA01',
    '自助分仓', 'QY-PA', 'QY-LA', 'QY-LA01'
  ],
  '乐歌': [
    'CAP', 'CAR', 'CAT', 'CHI', 'GAE',
    'HOU05', 'HOU06', 'HOU07', 'MEM', 'MEM-R',
    'NJF', 'NJF02', 'PAW', 'SAV', 'SCH',
    'SCM', 'CAMV'
  ]
}

const rawStore = require('../src/api/sku-kanban-store.json')

// 1. Update materialBindings tpWh to one of the 4 providers
const tpProviders = ['西邮', '环世', '千亚', '乐歌']
const updatedBindings = (rawStore.materialBindings || []).map((b, idx) => {
  let tpWh = b.tpWh
  if (b.parentCode === 'DRAFT-1790072625028uvld3') {
    tpWh = '乐歌'
  } else if (!tpProviders.includes(tpWh)) {
    // Specific bindings
    if (b.parentCode === 'DEMO-MULTI-01' || b.parentCode === 'DEMO-SHORT-01' || b.parentCode === 'DEMO-BALANCED-01' || b.parentCode === 'DEMO-SINGLE-01' || b.parentCode === 'DEMO-SINGLE-03') {
      tpWh = '西邮'
    } else if (b.parentCode === 'DEMO-BALANCED-02' || b.parentCode === 'DEMO-OOS-01') {
      tpWh = '环世'
    } else if (b.parentCode === 'DEMO-SINGLE-02' || b.parentCode.includes('DS-B05')) {
      tpWh = '千亚'
    } else if (b.parentCode === 'DEMO-SHORT-02' || b.parentCode.includes('SG-B06')) {
      tpWh = '乐歌'
    } else {
      tpWh = tpProviders[idx % tpProviders.length]
    }
  }
  return {
    ...b,
    tpWh
  }
})

// Build map of childCode -> linkedParents from bindings
const childLinkedParentsMap = new Map()
const childCodeToName = new Map()
updatedBindings.forEach(b => {
  (b.boundChildren || []).forEach(c => {
    if (!c.childCode) return
    if (!childLinkedParentsMap.has(c.childCode)) {
      childLinkedParentsMap.set(c.childCode, new Set())
    }
    childLinkedParentsMap.get(c.childCode).add(b.parentCode)
    if (c.childName && !childCodeToName.has(c.childCode)) {
      childCodeToName.set(c.childCode, c.childName)
    }
  })
})

// 2. Build childPhysicalStocks with all 4 providers and 49 warehouses
const childStocks = []

// Specific scenario stocks
const specificStocks = [
  // DEMO-MULTI-01
  // 西邮 - WPLA11 (断货归零)
  { childCode: 'DEMO-C-13', tpWh: '西邮', whName: 'WPLA11', availableQty: 0, transitQty: 0, spec: 'Tatami-Storage' },
  { childCode: 'DEMO-C-14', tpWh: '西邮', whName: 'WPLA11', availableQty: 180, transitQty: 40, spec: 'Wardrobe-3Door' },
  { childCode: 'DEMO-C-15', tpWh: '西邮', whName: 'WPLA11', availableQty: 180, transitQty: 40, spec: 'Desk-LCorner' },

  // 千亚 - QY-TX01 (多物料协同短板)
  { childCode: 'DEMO-C-13', tpWh: '千亚', whName: 'QY-TX01', availableQty: 60, transitQty: 30, spec: 'Tatami-Storage' },
  { childCode: 'DEMO-C-14', tpWh: '千亚', whName: 'QY-TX01', availableQty: 60, transitQty: 30, spec: 'Wardrobe-3Door' },
  { childCode: 'DEMO-C-15', tpWh: '千亚', whName: 'QY-TX01', availableQty: 200, transitQty: 50, spec: 'Desk-LCorner' },

  // 乐歌 - NJF (单物料短板 + 在途足额覆盖)
  { childCode: 'DEMO-C-13', tpWh: '乐歌', whName: 'NJF', availableQty: 250, transitQty: 0, spec: 'Tatami-Storage' },
  { childCode: 'DEMO-C-14', tpWh: '乐歌', whName: 'NJF', availableQty: 50, transitQty: 200, spec: 'Wardrobe-3Door' },
  { childCode: 'DEMO-C-15', tpWh: '乐歌', whName: 'NJF', availableQty: 250, transitQty: 0, spec: 'Desk-LCorner' },

  // 环世 - USNJHM01 (平衡充盈)
  { childCode: 'DEMO-C-13', tpWh: '环世', whName: 'USNJHM01', availableQty: 300, transitQty: 60, spec: 'Tatami-Storage' },
  { childCode: 'DEMO-C-14', tpWh: '环世', whName: 'USNJHM01', availableQty: 300, transitQty: 60, spec: 'Wardrobe-3Door' },
  { childCode: 'DEMO-C-15', tpWh: '环世', whName: 'USNJHM01', availableQty: 300, transitQty: 60, spec: 'Desk-LCorner' },

  // DEMO-SHORT-01 (轻奢餐桌椅套装: C-09 台 ×1, C-10 椅 ×4)
  // 西邮 - WPCHI3 (断货归零)
  { childCode: 'DEMO-C-09', tpWh: '西邮', whName: 'WPCHI3', availableQty: 150, transitQty: 30, spec: 'Table-160cm' },
  { childCode: 'DEMO-C-10', tpWh: '西邮', whName: 'WPCHI3', availableQty: 0, transitQty: 0, spec: 'Chair-Curve' },

  // 千亚 - GA4131 (单物料短板)
  { childCode: 'DEMO-C-09', tpWh: '千亚', whName: 'GA4131', availableQty: 120, transitQty: 20, spec: 'Table-160cm' },
  { childCode: 'DEMO-C-10', tpWh: '千亚', whName: 'GA4131', availableQty: 160, transitQty: 120, spec: 'Chair-Curve' },

  // 环世 - USCAEA02 (平衡健康)
  { childCode: 'DEMO-C-09', tpWh: '环世', whName: 'USCAEA02', availableQty: 200, transitQty: 40, spec: 'Table-160cm' },
  { childCode: 'DEMO-C-10', tpWh: '环世', whName: 'USCAEA02', availableQty: 800, transitQty: 160, spec: 'Chair-Curve' },

  // DEMO-SHORT-02 (主卧高箱床: C-11 床架 ×1, C-12 床垫 ×1)
  // 乐歌 - SAV (协同短板)
  { childCode: 'DEMO-C-11', tpWh: '乐歌', whName: 'SAV', availableQty: 30, transitQty: 20, spec: 'Bed-Oak180' },
  { childCode: 'DEMO-C-12', tpWh: '乐歌', whName: 'SAV', availableQty: 30, transitQty: 20, spec: 'Mattress-Spring' },

  // 环世 - USSAV02 (断货归零)
  { childCode: 'DEMO-C-11', tpWh: '环世', whName: 'USSAV02', availableQty: 100, transitQty: 0, spec: 'Bed-Oak180' },
  { childCode: 'DEMO-C-12', tpWh: '环世', whName: 'USSAV02', availableQty: 0, transitQty: 0, spec: 'Mattress-Spring' },

  // 西邮 - WPHOU4 (平衡充盈)
  { childCode: 'DEMO-C-11', tpWh: '西邮', whName: 'WPHOU4', availableQty: 180, transitQty: 30, spec: 'Bed-Oak180' },
  { childCode: 'DEMO-C-12', tpWh: '西邮', whName: 'WPHOU4', availableQty: 180, transitQty: 30, spec: 'Mattress-Spring' },

  // DEMO-BALANCED-01
  // 西邮 - WPNJ4
  { childCode: 'DEMO-C-04', tpWh: '西邮', whName: 'WPNJ4', availableQty: 150, transitQty: 30, spec: 'Desk-Top' },
  { childCode: 'DEMO-C-05', tpWh: '西邮', whName: 'WPNJ4', availableQty: 150, transitQty: 30, spec: 'Desk-Legs' },
  { childCode: 'DEMO-C-06', tpWh: '西邮', whName: 'WPNJ4', availableQty: 150, transitQty: 30, spec: 'Desk-Drawer' },
  // 乐歌 - CHI
  { childCode: 'DEMO-C-04', tpWh: '乐歌', whName: 'CHI', availableQty: 220, transitQty: 40, spec: 'Desk-Top' },
  { childCode: 'DEMO-C-05', tpWh: '乐歌', whName: 'CHI', availableQty: 220, transitQty: 40, spec: 'Desk-Legs' },
  { childCode: 'DEMO-C-06', tpWh: '乐歌', whName: 'CHI', availableQty: 220, transitQty: 40, spec: 'Desk-Drawer' },
  // 千亚 - QY-NJ02
  { childCode: 'DEMO-C-04', tpWh: '千亚', whName: 'QY-NJ02', availableQty: 180, transitQty: 30, spec: 'Desk-Top' },
  { childCode: 'DEMO-C-05', tpWh: '千亚', whName: 'QY-NJ02', availableQty: 180, transitQty: 30, spec: 'Desk-Legs' },
  { childCode: 'DEMO-C-06', tpWh: '千亚', whName: 'QY-NJ02', availableQty: 180, transitQty: 30, spec: 'Desk-Drawer' },

  // DEMO-BALANCED-02
  // 环世 - USGASA01
  { childCode: 'DEMO-C-07', tpWh: '环世', whName: 'USGASA01', availableQty: 120, transitQty: 20, spec: 'Sofa-2Seat' },
  { childCode: 'DEMO-C-08', tpWh: '环世', whName: 'USGASA01', availableQty: 120, transitQty: 20, spec: 'Sofa-Chaise' },
  // 千亚 - QY-GA01
  { childCode: 'DEMO-C-07', tpWh: '千亚', whName: 'QY-GA01', availableQty: 160, transitQty: 30, spec: 'Sofa-2Seat' },
  { childCode: 'DEMO-C-08', tpWh: '千亚', whName: 'QY-GA01', availableQty: 160, transitQty: 30, spec: 'Sofa-Chaise' },
  // 乐歌 - HOU05
  { childCode: 'DEMO-C-07', tpWh: '乐歌', whName: 'HOU05', availableQty: 140, transitQty: 30, spec: 'Sofa-2Seat' },
  { childCode: 'DEMO-C-08', tpWh: '乐歌', whName: 'HOU05', availableQty: 140, transitQty: 30, spec: 'Sofa-Chaise' },

  // DEMO-SINGLE-01
  { childCode: 'DEMO-C-01', tpWh: '西邮', whName: 'WPGA4', availableQty: 240, transitQty: 40, spec: 'Retro-Cab-Body' },
  { childCode: 'DEMO-C-01', tpWh: '西邮', whName: 'WPHOU7', availableQty: 180, transitQty: 20, spec: 'Retro-Cab-Body' },
  { childCode: 'DEMO-C-01', tpWh: '环世', whName: 'USTXHU01', availableQty: 320, transitQty: 60, spec: 'Retro-Cab-Body' },
  { childCode: 'DEMO-C-01', tpWh: '乐歌', whName: 'CAP', availableQty: 260, transitQty: 50, spec: 'Retro-Cab-Body' },
  { childCode: 'DEMO-C-01', tpWh: '千亚', whName: 'LA3', availableQty: 150, transitQty: 30, spec: 'Retro-Cab-Body' },

  // DEMO-SINGLE-02
  { childCode: 'DEMO-C-02', tpWh: '千亚', whName: 'LA3', availableQty: 400, transitQty: 80, spec: 'Chair-Nordic' },
  { childCode: 'DEMO-C-02', tpWh: '西邮', whName: 'WPLA4', availableQty: 300, transitQty: 60, spec: 'Chair-Nordic' },
  { childCode: 'DEMO-C-02', tpWh: '乐歌', whName: 'CAR', availableQty: 250, transitQty: 50, spec: 'Chair-Nordic' },
  { childCode: 'DEMO-C-02', tpWh: '环世', whName: 'USHOU04', availableQty: 200, transitQty: 40, spec: 'Chair-Nordic' },

  // DEMO-SINGLE-03
  { childCode: 'DEMO-C-03', tpWh: '西邮', whName: 'WPCHI2', availableQty: 500, transitQty: 100, spec: 'Stool-Round' },
  { childCode: 'DEMO-C-03', tpWh: '环世', whName: 'USCOI03', availableQty: 350, transitQty: 70, spec: 'Stool-Round' },
  { childCode: 'DEMO-C-03', tpWh: '千亚', whName: 'QY-PA', availableQty: 280, transitQty: 50, spec: 'Stool-Round' },
  { childCode: 'DEMO-C-03', tpWh: '乐歌', whName: 'CAT', availableQty: 420, transitQty: 90, spec: 'Stool-Round' },

  // DEMO-MULTI-02
  { childCode: 'DEMO-C-16', tpWh: '西邮', whName: 'WPNJ7', availableQty: 120, transitQty: 20, spec: 'Wardrobe-Frame' },
  { childCode: 'DEMO-C-17', tpWh: '西邮', whName: 'WPNJ7', availableQty: 120, transitQty: 20, spec: 'Wardrobe-Mirror' },
  { childCode: 'DEMO-C-16', tpWh: '环世', whName: 'USNJBW02', availableQty: 150, transitQty: 30, spec: 'Wardrobe-Frame' },
  { childCode: 'DEMO-C-17', tpWh: '环世', whName: 'USNJBW02', availableQty: 150, transitQty: 30, spec: 'Wardrobe-Mirror' },
  { childCode: 'DEMO-C-16', tpWh: '乐歌', whName: 'MEM', availableQty: 100, transitQty: 20, spec: 'Wardrobe-Frame' },
  { childCode: 'DEMO-C-17', tpWh: '乐歌', whName: 'MEM', availableQty: 100, transitQty: 20, spec: 'Wardrobe-Mirror' },

  // DEMO-OOS-01 (全缺断货)
  { childCode: 'DEMO-C-18', tpWh: '环世', whName: 'USSAV03', availableQty: 0, transitQty: 0, spec: 'OOS-Part1' },
  { childCode: 'DEMO-C-19', tpWh: '环世', whName: 'USSAV03', availableQty: 0, transitQty: 0, spec: 'OOS-Part2' },
  { childCode: 'DEMO-C-20', tpWh: '环世', whName: 'USSAV03', availableQty: 0, transitQty: 0, spec: 'OOS-Part3' },

  // DRAFT-1790072625028uvld3 在乐歌 CAMV, SAV, SCM 都有库存且存在不齐套
  // 1. 乐歌 - CAMV (断货归零场景: IF260215=0, IF260207=160, IF260208=160 -> 齐套 0 套, 缺 160 套)
  { childCode: 'IF260215', tpWh: '乐歌', whName: 'CAMV', availableQty: 0, transitQty: 0, spec: 'Suite-Nordic-Top' },
  { childCode: 'IF260207', tpWh: '乐歌', whName: 'CAMV', availableQty: 160, transitQty: 30, spec: 'Suite-Nordic-Side' },
  { childCode: 'IF260208', tpWh: '乐歌', whName: 'CAMV', availableQty: 160, transitQty: 30, spec: 'Suite-Nordic-Window' },

  // 2. 乐歌 - SAV (协同短板场景: IF260215=40, IF260207=40并列短板, IF260208=180 -> 齐套 40 套, 缺 140 套)
  { childCode: 'IF260215', tpWh: '乐歌', whName: 'SAV', availableQty: 40, transitQty: 20, spec: 'Suite-Nordic-Top' },
  { childCode: 'IF260207', tpWh: '乐歌', whName: 'SAV', availableQty: 40, transitQty: 20, spec: 'Suite-Nordic-Side' },
  { childCode: 'IF260208', tpWh: '乐歌', whName: 'SAV', availableQty: 180, transitQty: 40, spec: 'Suite-Nordic-Window' },

  // 3. 乐歌 - SCM (单物料短板场景: IF260208=60短板在途100, IF260215=200, IF260207=200 -> 齐套 60 套, 缺 140 套)
  { childCode: 'IF260215', tpWh: '乐歌', whName: 'SCM', availableQty: 200, transitQty: 40, spec: 'Suite-Nordic-Top' },
  { childCode: 'IF260207', tpWh: '乐歌', whName: 'SCM', availableQty: 200, transitQty: 40, spec: 'Suite-Nordic-Side' },
  { childCode: 'IF260208', tpWh: '乐歌', whName: 'SCM', availableQty: 60, transitQty: 100, spec: 'Suite-Nordic-Window' }
]

const seenKey = new Set()
specificStocks.forEach(st => {
  const k = `${st.childCode}__${st.tpWh}__${st.whName}`
  seenKey.add(k)
  const parents = Array.from(childLinkedParentsMap.get(st.childCode) || [])
  childStocks.push({
    id: `c_${st.childCode}_${st.whName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    childCode: st.childCode,
    childName: childCodeToName.get(st.childCode) || st.childCode,
    spec: st.spec || '通用标准规格',
    tpWh: st.tpWh,
    whName: st.whName,
    availableQty: st.availableQty,
    transitQty: st.transitQty,
    linkedParents: parents
  })
})

// Now distribute remaining child materials across ALL 49 warehouses so every warehouse has stocks!
const furnitureChildCodes = [
  'IF260212', 'IF260216', 'IF260205', 'IF260223',
  'IF260196-G',
  'XST36in-P', 'IF260052-A', 'IF260052-B', 'IF260052-C',
  'IF260214', 'IF260210', 'IF260224', 'IF260217',
  'IF260226', 'IF260219'
]

// For each provider and each warehouse of that provider:
Object.entries(TP_OVERSEAS_WAREHOUSES_MAP).forEach(([tpWh, whList]) => {
  whList.forEach((whName, wIdx) => {
    // Pick 3-4 furniture child codes deterministically for this warehouse
    for (let i = 0; i < 4; i++) {
      const cIdx = (wIdx * 3 + i * 5) % furnitureChildCodes.length
      const cCode = furnitureChildCodes[cIdx]
      const k = `${cCode}__${tpWh}__${whName}`
      if (!seenKey.has(k)) {
        seenKey.add(k)
        const parents = Array.from(childLinkedParentsMap.get(cCode) || [])
        // Give healthy stock with varying numbers
        const avail = 120 + ((wIdx * 17 + i * 37) % 350)
        const transit = ((wIdx * 7 + i * 19) % 80)
        childStocks.push({
          id: `c_${cCode}_${whName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${i}`,
          childCode: cCode,
          childName: childCodeToName.get(cCode) || cCode,
          spec: '标准款',
          tpWh: tpWh,
          whName: whName,
          availableQty: avail,
          transitQty: transit,
          linkedParents: parents
        })
      }
    }
  })
})

// 3. Update unshippedOrders to use valid tpWh & whName
const updatedOrders = [
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

const finalStore = {
  asinTrack: rawStore.asinTrack || [],
  materialBindings: updatedBindings,
  childPhysicalStocks: childStocks,
  unshippedOrders: updatedOrders
}

const outputPath = path.join(__dirname, '../src/api/sku-kanban-store.json')
fs.writeFileSync(outputPath, JSON.stringify(finalStore, null, 2), 'utf8')

console.log('Successfully updated sku-kanban-store.json!')
console.log('Total child stocks:', childStocks.length)
console.log('Unique warehouses covered:', new Set(childStocks.map(s => s.whName)).size)
console.log('Unique providers covered:', new Set(childStocks.map(s => s.tpWh)).size)
