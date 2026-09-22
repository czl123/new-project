/**
 * 组合家具基础物料库与 BOM 关系清单 (来源于用户最新提供的《组合家具-组合物料命名汇总》)
 * 组合类型按标准定义：多件打包、一物多包、主附搭配、成套组合
 */

export type ComboType = '多件打包' | '一物多包' | '主附搭配' | '成套组合'

export interface ComboTypeDefinition {
  type: ComboType
  name: string
  shortDesc: string
  detailDesc: string
  coreRule: string
  example: string
  tagType: 'info' | 'warning' | 'danger' | 'primary'
}

/** 组合类型标准定义与说明字典 */
export const COMBO_TYPE_DEFINITIONS: Record<ComboType, ComboTypeDefinition> = {
  '多件打包': {
    type: '多件打包',
    name: '多件打包',
    shortDesc: '同款多件乘倍销售',
    detailDesc: '同款单品卖多件（如 2 件装、4 件装），不拆原包装，出库时直接按倍数发货。',
    coreRule: '物料仅1种 · 原箱乘倍',
    example: '吧椅 (深棕色)：IF250223 × 2',
    tagType: 'info'
  },
  '一物多包': {
    type: '一物多包',
    name: '一物多包',
    shortDesc: '单品超大拆为多箱',
    detailDesc: '商品本来是1个完整整体，因包装太重太大被拆分成 A、B、C 多箱，必须全套齐套才是一个完整成品。',
    coreRule: '大件拆包 · 缺一不可',
    example: '压缩沙发 (黑色)：IF260052-A + B + C',
    tagType: 'warning'
  },
  '主附搭配': {
    type: '主附搭配',
    name: '主附搭配',
    shortDesc: '专用主体 + 通用配件',
    detailDesc: '由核心主体（如不同颜色的柜体）配上通用标准零部件或公用件，不同款式可共用同款配件。',
    coreRule: '专用主体 + 通用公用件',
    example: '洗手台：白色柜体 IF260196-G + 通用盆 XST36in-P',
    tagType: 'danger'
  },
  '成套组合': {
    type: '成套组合',
    name: '成套组合',
    shortDesc: '独立家具组合成大套系',
    detailDesc: '将多个原本可以拿出来单独销售的家具单品凑成一套（大套系销售），每个子件均能作为独立家具。',
    coreRule: '独立单品 · 成套组合',
    example: '组合电视柜 (原木色)：上架 IF260215 + 边柜 IF260207 + 窗边柜 IF260208',
    tagType: 'primary'
  }
}

export interface FurnitureChildMaterial {
  childCode: string
  childName: string
  model: string
  color: string
  childProductName: string
  childStyle: string
  childMaterial: string
  childTarget: string
  childModel: string
  childBrand: string
  childPattern: string
  childColor: string
  childPackQty: string
  image?: string
}

export interface FurnitureComboBomItem {
  childCode: string
  childName: string
  ratio: number
  childProductName: string
  childStyle: string
  childMaterial: string
  childTarget: string
  childModel: string
  childBrand: string
  childPattern: string
  childColor: string
  childPackQty: string
  image?: string
}

export interface FurnitureComboRecord {
  parentCode: string
  productName: string
  style: string
  material: string
  brand: string
  color: string
  packQty: string
  comboType: ComboType
  children: FurnitureComboBomItem[]
}

/** 22款基础子物料清单 (包含最新字段：款式、主材料、适用品牌或对象、型号、公司品牌、图案、颜色、包装数量) */
export const FURNITURE_CHILD_MATERIALS: FurnitureChildMaterial[] = [
  {
    "childCode": "IF260212",
    "childName": "拱形门边柜(原木色)",
    "model": "AuraB01",
    "color": "原木色",
    "childProductName": "边柜",
    "childStyle": "AuraB01",
    "childMaterial": "刨花板+MDF",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形门",
    "childColor": "原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260216",
    "childName": "拱形门边柜(黑色+原木色)",
    "model": "AuraB01",
    "color": "黑色+原木色",
    "childProductName": "边柜",
    "childStyle": "AuraB01",
    "childMaterial": "刨花板+MDF",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形门",
    "childColor": "黑色+原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260205",
    "childName": "拱形玻璃门边柜(原木色)",
    "model": "AuraB02",
    "color": "原木色",
    "childProductName": "边柜",
    "childStyle": "AuraB02",
    "childMaterial": "刨花板+MDF+玻璃",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形玻璃门",
    "childColor": "原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260223",
    "childName": "拱形玻璃门边柜(黑色+原木色)",
    "model": "AuraB02",
    "color": "黑色+原木色",
    "childProductName": "边柜",
    "childStyle": "AuraB02",
    "childMaterial": "刨花板+MDF+玻璃",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形玻璃门",
    "childColor": "黑色+原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260208",
    "childName": "拱形藤编门边柜(原木色)",
    "model": "AuraB03",
    "color": "原木色",
    "childProductName": "边柜",
    "childStyle": "AuraB03",
    "childMaterial": "刨花板+MDF+藤编",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形藤编门",
    "childColor": "原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260219",
    "childName": "拱形藤编门边柜(黑色+原木色)",
    "model": "AuraB03",
    "color": "黑色+原木色",
    "childProductName": "边柜",
    "childStyle": "AuraB03",
    "childMaterial": "刨花板+MDF+藤编",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形藤编门",
    "childColor": "黑色+原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260214",
    "childName": "拱形门单抽边柜(原木色)",
    "model": "AuraB04",
    "color": "原木色",
    "childProductName": "边柜",
    "childStyle": "AuraB04",
    "childMaterial": "刨花板+MDF",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形门单抽",
    "childColor": "原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260217",
    "childName": "拱形门单抽边柜(黑色+原木色)",
    "model": "AuraB04",
    "color": "黑色+原木色",
    "childProductName": "边柜",
    "childStyle": "AuraB04",
    "childMaterial": "刨花板+MDF",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形门单抽",
    "childColor": "黑色+原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260210",
    "childName": "拱形双抽边柜(原木色)",
    "model": "AuraB05",
    "color": "原木色",
    "childProductName": "边柜",
    "childStyle": "AuraB05",
    "childMaterial": "刨花板+MDF",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形双抽",
    "childColor": "原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260224",
    "childName": "拱形双抽边柜(黑色+原木色)",
    "model": "AuraB05",
    "color": "黑色+原木色",
    "childProductName": "边柜",
    "childStyle": "AuraB05",
    "childMaterial": "刨花板+MDF",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形双抽",
    "childColor": "黑色+原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260215",
    "childName": "拱形全开窗边柜(原木色)",
    "model": "AuraB06",
    "color": "原木色",
    "childProductName": "边柜",
    "childStyle": "AuraB06",
    "childMaterial": "刨花板+MDF",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形全开窗",
    "childColor": "原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260226",
    "childName": "拱形全开窗边柜(黑色+原木色)",
    "model": "AuraB06",
    "color": "黑色+原木色",
    "childProductName": "边柜",
    "childStyle": "AuraB06",
    "childMaterial": "刨花板+MDF",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形全开窗",
    "childColor": "黑色+原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260213",
    "childName": "拱形玻璃门上柜(原木色)",
    "model": "AuraU02",
    "color": "原木色",
    "childProductName": "上柜",
    "childStyle": "AuraU02",
    "childMaterial": "刨花板+MDF+玻璃",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形玻璃门",
    "childColor": "原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260218",
    "childName": "拱形玻璃门上柜(黑色+原木色)",
    "model": "AuraU02",
    "color": "黑色+原木色",
    "childProductName": "上柜",
    "childStyle": "AuraU02",
    "childMaterial": "刨花板+MDF+玻璃",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形玻璃门",
    "childColor": "黑色+原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260211",
    "childName": "拱形Y全开窗上架(原木色)",
    "model": "AuraU05",
    "color": "原木色",
    "childProductName": "上架",
    "childStyle": "AuraU05",
    "childMaterial": "刨花板+MDF",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形Y全开窗",
    "childColor": "原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260221",
    "childName": "拱形Y全开窗上架(黑色+原木色)",
    "model": "AuraU05",
    "color": "黑色+原木色",
    "childProductName": "上架",
    "childStyle": "AuraU05",
    "childMaterial": "刨花板+MDF",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形Y全开窗",
    "childColor": "黑色+原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260207",
    "childName": "拱形F全开窗上架(原木色)",
    "model": "AuraU04",
    "color": "原木色",
    "childProductName": "上架",
    "childStyle": "AuraU04",
    "childMaterial": "刨花板+MDF",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形F全开窗",
    "childColor": "原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260220",
    "childName": "拱形F全开窗上架(黑色+原木色)",
    "model": "AuraU04",
    "color": "黑色+原木色",
    "childProductName": "上架",
    "childStyle": "AuraU04",
    "childMaterial": "刨花板+MDF",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形F全开窗",
    "childColor": "黑色+原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260209",
    "childName": "拱形藤编门上柜(原木色)",
    "model": "AuraU03",
    "color": "原木色",
    "childProductName": "上柜",
    "childStyle": "AuraU03",
    "childMaterial": "刨花板+MDF+藤编",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形藤编门",
    "childColor": "原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260225",
    "childName": "拱形藤编门上柜(黑色+原木色)",
    "model": "AuraU03",
    "color": "黑色+原木色",
    "childProductName": "上柜",
    "childStyle": "AuraU03",
    "childMaterial": "刨花板+MDF+藤编",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形藤编门",
    "childColor": "黑色+原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260206",
    "childName": "拱形门上柜(原木色)",
    "model": "AuraU01",
    "color": "原木色",
    "childProductName": "上柜",
    "childStyle": "AuraU01",
    "childMaterial": "刨花板+MDF",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形门",
    "childColor": "原木色",
    "childPackQty": "1pack"
  },
  {
    "childCode": "IF260222",
    "childName": "拱形门上柜(黑色+原木色)",
    "model": "AuraU01",
    "color": "黑色+原木色",
    "childProductName": "上柜",
    "childStyle": "AuraU01",
    "childMaterial": "刨花板+MDF",
    "childTarget": "通用",
    "childModel": "通用",
    "childBrand": "中性",
    "childPattern": "拱形门",
    "childColor": "黑色+原木色",
    "childPackQty": "1pack"
  }
]

/** 子物料快速映射字典 */
export const FURNITURE_CHILD_MAP: Record<string, FurnitureChildMaterial> = Object.fromEntries(
  FURNITURE_CHILD_MATERIALS.map(item => [item.childCode, item])
)

/** 获取子物料全量元数据（提供完善兜底） */
export function getFurnitureChildMeta(childCode: string): FurnitureChildMaterial | undefined {
  return FURNITURE_CHILD_MAP[childCode]
}

/** 202款组合家具物料命名与 BOM 基础库 (包含父级款式、主材料、公司品牌、颜色、包装数量及子物料详细字段) */
export const FURNITURE_COMBO_BOM_LIBRARY: FurnitureComboRecord[] = [
  {
    "parentCode": "CB-B01*2-PBM-YL-2",
    "productName": "餐边柜",
    "style": "AuraB01*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B01*2-PBM-HKYL-2",
    "productName": "餐边柜",
    "style": "AuraB01*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色+原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B02*2-PBMGL-YL-2",
    "productName": "餐边柜",
    "style": "AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B02*2-PBMGL-HKYL-2",
    "productName": "餐边柜",
    "style": "AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色+原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B03*2-PBMTC-YL-2",
    "productName": "餐边柜",
    "style": "AuraB03*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B03*2-PBMTC-HKYL-2",
    "productName": "餐边柜",
    "style": "AuraB03*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色+原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B04*2-PBM-YL-2",
    "productName": "餐边柜",
    "style": "AuraB04*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B04*2-PBM-HKYL-2",
    "productName": "餐边柜",
    "style": "AuraB04*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色+原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B05*2-PBM-YL-2",
    "productName": "电视柜",
    "style": "AuraB05*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260210",
        "childName": "拱形双抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B05*2-PBM-HKYL-2",
    "productName": "电视柜",
    "style": "AuraB05*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色+原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260224",
        "childName": "拱形双抽边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "SG-B06*2-PBM-YL-2",
    "productName": "书柜",
    "style": "AuraB06*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "SG-B06*2-PBM-HKYL-2",
    "productName": "书柜",
    "style": "AuraB06*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色+原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B01*3-PBM-YL-3",
    "productName": "餐边柜",
    "style": "AuraB01*3",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B01*3-PBM-HKYL-3",
    "productName": "餐边柜",
    "style": "AuraB01*3",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色+原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B02*3-PBMGL-YL-3",
    "productName": "餐边柜",
    "style": "AuraB02*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B02*3-PBMGL-HKYL-3",
    "productName": "餐边柜",
    "style": "AuraB02*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色+原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B03*3-PBMTC-YL-3",
    "productName": "餐边柜",
    "style": "AuraB03*3",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B03*3-PBMTC-HKYL-3",
    "productName": "餐边柜",
    "style": "AuraB03*3",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色+原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B04*3-PBM-YL-3",
    "productName": "餐边柜",
    "style": "AuraB04*3",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "CB-B04*3-PBM-HKYL-3",
    "productName": "餐边柜",
    "style": "AuraB04*3",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色+原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B05*3-PBM-YL-3",
    "productName": "电视柜",
    "style": "AuraB05*3",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260210",
        "childName": "拱形双抽边柜(原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B05*3-PBM-HKYL-3",
    "productName": "电视柜",
    "style": "AuraB05*3",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色+原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260224",
        "childName": "拱形双抽边柜(黑色+原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "SG-B06*3-PBM-YL-3",
    "productName": "书柜",
    "style": "AuraB06*3",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "SG-B06*3-PBM-HKYL-3",
    "productName": "书柜",
    "style": "AuraB06*3",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色+原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B05*2+B02*1-PBMGL-YL-3",
    "productName": "电视柜",
    "style": "AuraB05*2+AuraB02*1",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260210",
        "childName": "拱形双抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "CB-B04*2+B01*1-PBM-YL-3",
    "productName": "餐边柜",
    "style": "AuraB04*2+AuraB01*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "CB-B01*2+B02*1-PBMGL-YL-3",
    "productName": "餐边柜",
    "style": "AuraB01*2+AuraB02*1",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "CB-B02*2+B01*1-PBMGL-YL-3",
    "productName": "餐边柜",
    "style": "AuraB02*2+AuraB01*1",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B06*2+B02*1-PBM-YL-3",
    "productName": "电视柜",
    "style": "AuraB06*2+AuraB02*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B03*2+B06*1-PBMTC-YL-3",
    "productName": "电视柜",
    "style": "AuraB03*2+AuraB06*1",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "CB-B02*2+B04*1-PBMGL-YL-3",
    "productName": "餐边柜",
    "style": "AuraB02*2+AuraB04*1",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "CB-B02*2+B04*1-PBMGL-HK-3",
    "productName": "餐边柜",
    "style": "AuraB02*2+AuraB04*1",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "CB-B02*2+B05*1-PBMGL-YL-3",
    "productName": "餐边柜",
    "style": "AuraB02*2+AuraB05*1",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260210",
        "childName": "拱形双抽边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "CB-B02*2+B05*1-PBMGL-HK-3",
    "productName": "餐边柜",
    "style": "AuraB02*2+AuraB05*1",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260224",
        "childName": "拱形双抽边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B04*2+B05*1-PBM-YL-3",
    "productName": "电视柜",
    "style": "AuraB04*2+AuraB05*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260210",
        "childName": "拱形双抽边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B04*2+B05*1-PBM-HK-3",
    "productName": "电视柜",
    "style": "AuraB04*2+AuraB05*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260224",
        "childName": "拱形双抽边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "CB-B01*2+B06*1-PBM-YL-3",
    "productName": "餐边柜",
    "style": "AuraB01*2+AuraB06*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "CB-B01*2+B06*1-PBM-HK-3",
    "productName": "餐边柜",
    "style": "AuraB01*2+AuraB06*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "CB-B01*2+B04*1-PBM-YL-3",
    "productName": "餐边柜",
    "style": "AuraB01*2+AuraB04*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "CB-B01*2+B04*1-PBM-HK-3",
    "productName": "餐边柜",
    "style": "AuraB01*2+AuraB04*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B05*2+B04*1-PBM-YL-3",
    "productName": "电视柜",
    "style": "AuraB05*2+AuraB04*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260210",
        "childName": "拱形双抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B05*2+B04*1-PBM-HK-3",
    "productName": "电视柜",
    "style": "AuraB05*2+AuraB04*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "3pack",
    "children": [
      {
        "childCode": "IF260224",
        "childName": "拱形双抽边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B03*2+B06*2-PBMTC-YL-4",
    "productName": "电视柜",
    "style": "AuraB03*2+AuraB06*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B03*2+B06*2-PBMTC-HK-4",
    "productName": "电视柜",
    "style": "AuraB03*2+AuraB06*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B03*4-PBMTC-YL-4",
    "productName": "电视柜",
    "style": "AuraB03*4",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B03*4-PBMTC-HK-4",
    "productName": "电视柜",
    "style": "AuraB03*4",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B03*2+B02*2-PBMTC-YL-4",
    "productName": "电视柜",
    "style": "AuraB03*2+AuraB02*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B03*2+B02*2-PBMTC-HK-4",
    "productName": "电视柜",
    "style": "AuraB03*2+AuraB02*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B04*2+B06*2-PBM-YL-4",
    "productName": "电视柜",
    "style": "AuraB04*2+AuraB06*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B04*2+B06*2-PBM-HK-4",
    "productName": "电视柜",
    "style": "AuraB04*2+AuraB06*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B04*4-PBM-YL-4",
    "productName": "电视柜",
    "style": "AuraB04*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B04*4-PBM-HK-4",
    "productName": "电视柜",
    "style": "AuraB04*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B02*4-PBMGL-YL-4",
    "productName": "电视柜",
    "style": "AuraB02*4",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B02*4-PBMGL-HK-4",
    "productName": "电视柜",
    "style": "AuraB02*4",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B02*2+B06*2-PBMGL-YL-4",
    "productName": "电视柜",
    "style": "AuraB02*2+AuraB06*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B02*2+B06*2-PBMGL-HK-4",
    "productName": "电视柜",
    "style": "AuraB02*2+AuraB06*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B02*2+B05*2-PBMGL-YL-4",
    "productName": "电视柜",
    "style": "AuraB02*2+AuraB05*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260210",
        "childName": "拱形双抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B02*2+B05*2-PBMGL-HK-4",
    "productName": "电视柜",
    "style": "AuraB02*2+AuraB05*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260224",
        "childName": "拱形双抽边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B06*4-PBM-YL-4",
    "productName": "电视柜",
    "style": "AuraB06*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B06*4-PBM-HK-4",
    "productName": "电视柜",
    "style": "AuraB06*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DG-B05*4-PBM-YL-4",
    "productName": "斗柜",
    "style": "AuraB05*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260210",
        "childName": "拱形双抽边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DG-B05*4-PBM-HK-4",
    "productName": "斗柜",
    "style": "AuraB05*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260224",
        "childName": "拱形双抽边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B05*2+B04*2-PBM-YL-4",
    "productName": "电视柜",
    "style": "AuraB05*2+AuraB04*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260210",
        "childName": "拱形双抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B05*2+B04*2-PBM-HK-4",
    "productName": "电视柜",
    "style": "AuraB05*2+AuraB04*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260224",
        "childName": "拱形双抽边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B05*2+B02*2-PBMGL-YL-4",
    "productName": "电视柜",
    "style": "AuraB05*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260210",
        "childName": "拱形双抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B05*2+B02*2-PBMGL-HK-4",
    "productName": "电视柜",
    "style": "AuraB05*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260224",
        "childName": "拱形双抽边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B01*4-PBM-YL-4",
    "productName": "电视柜",
    "style": "AuraB01*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B01*4-PBM-HK-4",
    "productName": "电视柜",
    "style": "AuraB01*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "多件打包"
  },
  {
    "parentCode": "DS-B01*2+B02*2-PBMGL-YL-4",
    "productName": "电视柜",
    "style": "AuraB01*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B01*2+B02*2-PBMGL-HK-4",
    "productName": "电视柜",
    "style": "AuraB01*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U02*2+B02*2+B01*3-PBMGL-YL-7",
    "productName": "电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB01*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260213",
        "childName": "拱形玻璃门上柜(原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U02*2+B02*2+B01*3-PBMGL-HK-7",
    "productName": "电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB01*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260218",
        "childName": "拱形玻璃门上柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U02*2+B02*2+B06*3-PBMGL-YL-7",
    "productName": "电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB06*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260213",
        "childName": "拱形玻璃门上柜(原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U02*2+B02*2+B06*3-PBMGL-HK-6",
    "productName": "电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB06*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260218",
        "childName": "拱形玻璃门上柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U02*2+B02*2+B05*2-PBMGL-YL-6",
    "productName": "电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB05*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260213",
        "childName": "拱形玻璃门上柜(原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260210",
        "childName": "拱形双抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U02*2+B02*2+B05*2-PBMGL-HK-6",
    "productName": "电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB05*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260218",
        "childName": "拱形玻璃门上柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260224",
        "childName": "拱形双抽边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U02*2+B02*2+B05*3-PBMGL-YL-6",
    "productName": "电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB05*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260213",
        "childName": "拱形玻璃门上柜(原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260210",
        "childName": "拱形双抽边柜(原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U02*2+B02*2+B05*3-PBMGL-HK-6",
    "productName": "电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB05*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260218",
        "childName": "拱形玻璃门上柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260224",
        "childName": "拱形双抽边柜(黑色+原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U02*2+B02*5-PBMGL-YL-7",
    "productName": "电视柜",
    "style": "AuraU02*2+AuraB02*5",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260213",
        "childName": "拱形玻璃门上柜(原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 5,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U02*2+B02*5-PBMGL-HK-7",
    "productName": "电视柜",
    "style": "AuraU02*2+AuraB02*5",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260218",
        "childName": "拱形玻璃门上柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 5,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U02*2+B02*2+B04*3-PBMGL-YL-7",
    "productName": "电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB04*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260213",
        "childName": "拱形玻璃门上柜(原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U02*2+B02*2+B04*3-PBMGL-HK-7",
    "productName": "电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB04*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260218",
        "childName": "拱形玻璃门上柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B04*4-PBM-YL-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB04*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B04*4-PBM-HK-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB04*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B04*5-PBM-YL-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB04*5",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 5,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B04*5-PBM-HK-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB04*5",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 5,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B01*4-PBM-YL-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB01*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B01*4-PBM-HK-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB01*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B01*5-PBM-YL-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB01*5",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 5,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B01*5-PBM-HK-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB01*5",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 5,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B01*2+B06*2-PBM-YL-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB01*2+AuraB06*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B01*2+B06*2-PBM-HK-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB01*2+AuraB06*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B01*2+B06*3-PBM-YL-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB01*2+AuraB06*3",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B01*2+B06*3-PBM-HK-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB01*2+AuraB06*3",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B01*2+B02*2-PBMGL-YL-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB01*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B01*2+B02*2-PBMGL-HK-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB01*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B01*2+B02*3-PBMGL-YL-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB01*2+AuraB02*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B01*2+B02*3-PBMGL-HK-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB01*2+AuraB02*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B06*4-PBM-YL-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB06*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B06*4-PBM-HK-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB06*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B06*5-PBM-YL-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB06*5",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 5,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B06*5-PBM-HK-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB06*5",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 5,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B03*4-PBMTC-YL-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB03*4",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B03*4-PBMTC-HK-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB03*4",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B03*5-PBMTC-YL-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB03*5",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 5,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B03*5-PBMTC-HK-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB03*5",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 5,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B02*4-PBMGL-YL-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB02*4",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B02*4-PBMGL-HK-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB02*4",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B02*5-PBMGL-YL-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB02*5",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 5,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B02*5-PBMGL-HK-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB02*5",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 5,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B02*2+B06*2-PBMGL-YL-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB02*2+AuraB06*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B02*2+B06*2-PBMGL-HK-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB02*2+AuraB06*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B02*2+B06*3-PBMGL-YL-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB02*2+AuraB06*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B02*2+B06*3-PBMGL-HK-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB02*2+AuraB06*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B02*2+B01*2-PBMGL-YL-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB02*2+AuraB01*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B02*2+B01*2-PBMGL-HK-6",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB02*2+AuraB01*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B02*2+B01*3-PBMGL-YL-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB02*2+AuraB01*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-U05*2+B02*2+B01*3-PBMGL-HK-7",
    "productName": "电视柜",
    "style": "AuraU05*2+AuraB02*2+AuraB01*3",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "7pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 3,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "CB-B02*2+B04*2-PBMGL-YL-4",
    "productName": "餐边柜",
    "style": "AuraB02*2+AuraB04*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B04*2+B05*2-PBM-YL-4",
    "productName": "电视柜",
    "style": "AuraB04*2+AuraB05*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260210",
        "childName": "拱形双抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形双抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B02*2+B03*2-PBMGLTC-YL-4",
    "productName": "电视柜",
    "style": "AuraB02*2+AuraB03*2",
    "material": "刨花板+MDF+玻璃+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B04*2+B02*2-PBMGL-YL-4",
    "productName": "电视柜",
    "style": "AuraB04*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B02*2+B01*2-PBMGL-YL-4",
    "productName": "电视柜",
    "style": "AuraB02*2+AuraB01*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "DS-B01*2+B06*2-PBM-YL-4",
    "productName": "电视柜",
    "style": "AuraB01*2+AuraB06*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U02*2+B02*2+B04*2-PBMGL-YL-6",
    "productName": "组合电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB04*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260213",
        "childName": "拱形玻璃门上柜(原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U02*2+B02*2+B04*2-PBMGL-HK-6",
    "productName": "组合电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB04*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260218",
        "childName": "拱形玻璃门上柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B03*4-PBMTC-YL-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB03*4",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B03*4-PBMTC-HK-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB03*4",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B06*4-PBM-YL-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB06*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B06*4-PBM-HK-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB06*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U02*2+B02*2+B01*2-PBMGL-YL-6",
    "productName": "组合电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB01*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260213",
        "childName": "拱形玻璃门上柜(原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U02*2+B02*2+B01*2-PBMGL-HK-6",
    "productName": "组合电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB01*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260218",
        "childName": "拱形玻璃门上柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U02*2+B02*2+B06*2-PBMGL-YL-6",
    "productName": "组合电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB06*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260213",
        "childName": "拱形玻璃门上柜(原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U02*2+B02*2+B06*2-PBMGL-HK-6",
    "productName": "组合电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB06*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260218",
        "childName": "拱形玻璃门上柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U02*2+B02*2+B03*2-PBMGLTC-YL-6",
    "productName": "组合电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB03*2",
    "material": "刨花板+MDF+玻璃+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260213",
        "childName": "拱形玻璃门上柜(原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U02*2+B02*2+B03*2-PBMGLTC-HK-6",
    "productName": "组合电视柜",
    "style": "AuraU02*2+AuraB02*2+AuraB03*2",
    "material": "刨花板+MDF+玻璃+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260218",
        "childName": "拱形玻璃门上柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B03*2+B02*2-PBMGLTC-YL-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB03*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B03*2+B02*2-PBMGLTC-HK-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB03*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U02*2+B02*4-PBMGL-YL-6",
    "productName": "组合电视柜",
    "style": "AuraU02*2+AuraB02*4",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260213",
        "childName": "拱形玻璃门上柜(原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U02*2+B02*4-PBMGL-HK-6",
    "productName": "组合电视柜",
    "style": "AuraU02*2+AuraB02*4",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260218",
        "childName": "拱形玻璃门上柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B01*4-PBM-YL-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB01*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B01*4-PBM-HK-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB01*4",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 4,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B02*2+B01*2-PBMGL-YL-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB02*2+AuraB01*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B02*2+B01*2-PBMGL-HK-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB02*2+AuraB01*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B03*2+B06*2-PBMTC-YL-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB03*2+AuraB06*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B03*2+B06*2-PBMTC-HK-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB03*2+AuraB06*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B03*2+B04*2-PBMTC-YL-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB03*2+AuraB04*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B03*2+B04*2-PBMTC-HK-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB03*2+AuraB04*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B02*2+B03*2-PBMGLTC-YL-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB02*2+AuraB03*2",
    "material": "刨花板+MDF+玻璃+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "ZHSJ-U04*2+B02*2+B03*2-PBMGLTC-HK-6",
    "productName": "组合电视柜",
    "style": "AuraU04*2+AuraB02*2+AuraB03*2",
    "material": "刨花板+MDF+玻璃+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "6pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U02*1+B02*1-PBMGL-YL-2",
    "productName": "书柜",
    "style": "AuraU02*1+AuraB02*1",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260213",
        "childName": "拱形玻璃门上柜(原木色)",
        "ratio": 1,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U02*1+B02*1-PBMGL-HK-2",
    "productName": "书柜",
    "style": "AuraU02*1+AuraB02*1",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260218",
        "childName": "拱形玻璃门上柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*1+B02*1-PBMGL-YL-2",
    "productName": "书柜",
    "style": "AuraU05*1+AuraB02*1",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*1+B02*1-PBMGL-HK-2",
    "productName": "书柜",
    "style": "AuraU05*1+AuraB02*1",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*1+B06*1-PBM-YL-2",
    "productName": "书柜",
    "style": "AuraU04*1+AuraB06*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*1+B06*1-PBM-HK-2",
    "productName": "书柜",
    "style": "AuraU04*1+AuraB06*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*1+B03*1-PBMTC-YL-2",
    "productName": "书柜",
    "style": "AuraU04*1+AuraB03*1",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*1+B03*1-PBMTC-HK-2",
    "productName": "书柜",
    "style": "AuraU04*1+AuraB03*1",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*1+B06*1-PBM-YL-2",
    "productName": "书柜",
    "style": "AuraU05*1+AuraB06*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*1+B06*1-PBM-HK-2",
    "productName": "书柜",
    "style": "AuraU05*1+AuraB06*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*1+B01*1-PBM-YL-2",
    "productName": "书柜",
    "style": "AuraU05*1+AuraB01*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*1+B01*1-PBM-HK-2",
    "productName": "书柜",
    "style": "AuraU05*1+AuraB01*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*1+B02*1-PBMGL-YL-2",
    "productName": "书柜",
    "style": "AuraU04*1+AuraB02*1",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*1+B02*1-PBMGL-HK-2",
    "productName": "书柜",
    "style": "AuraU04*1+AuraB02*1",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*1+B03*1-PBMTC-YL-2",
    "productName": "书柜",
    "style": "AuraU05*1+AuraB03*1",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*1+B03*1-PBMTC-HK-2",
    "productName": "书柜",
    "style": "AuraU05*1+AuraB03*1",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*1+B01*1-PBM-YL-2",
    "productName": "书柜",
    "style": "AuraU04*1+AuraB01*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*1+B01*1-PBM-HK-2",
    "productName": "书柜",
    "style": "AuraU04*1+AuraB01*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*1+B04*1-PBM-YL-2",
    "productName": "书柜",
    "style": "AuraU04*1+AuraB04*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*1+B04*1-PBM-HK-2",
    "productName": "书柜",
    "style": "AuraU04*1+AuraB04*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*1+B04*1-PBM-YL-2",
    "productName": "书柜",
    "style": "AuraU05*1+AuraB04*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*1+B04*1-PBM-HK-2",
    "productName": "书柜",
    "style": "AuraU05*1+AuraB04*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 1,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*2+B01*2-PBM-YL-4",
    "productName": "书柜",
    "style": "AuraU04*2+AuraB01*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*2+B01*2-PBM-HK-4",
    "productName": "书柜",
    "style": "AuraU04*2+AuraB01*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U02*2+B02*2-PBMGL-YL-4",
    "productName": "书柜",
    "style": "AuraU02*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260213",
        "childName": "拱形玻璃门上柜(原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U02*2+B02*2-PBMGL-HK-4",
    "productName": "书柜",
    "style": "AuraU02*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260218",
        "childName": "拱形玻璃门上柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*2+B02*2-PBMGL-YL-4",
    "productName": "书柜",
    "style": "AuraU05*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*2+B02*2-PBMGL-HK-4",
    "productName": "书柜",
    "style": "AuraU05*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*2+B06*2-PBM-YL-4",
    "productName": "书柜",
    "style": "AuraU04*2+AuraB06*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*2+B06*2-PBM-HK-4",
    "productName": "书柜",
    "style": "AuraU04*2+AuraB06*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*2+B03*2-PBMTC-YL-4",
    "productName": "书柜",
    "style": "AuraU04*2+AuraB03*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*2+B03*2-PBMTC-HK-4",
    "productName": "书柜",
    "style": "AuraU04*2+AuraB03*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*2+B06*2-PBM-YL-4",
    "productName": "书柜",
    "style": "AuraU05*2+AuraB06*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260215",
        "childName": "拱形全开窗边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*2+B06*2-PBM-HK-4",
    "productName": "书柜",
    "style": "AuraU05*2+AuraB06*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260226",
        "childName": "拱形全开窗边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB06",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*2+B01*2-PBM-YL-4",
    "productName": "书柜",
    "style": "AuraU05*2+AuraB01*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*2+B01*2-PBM-HK-4",
    "productName": "书柜",
    "style": "AuraU05*2+AuraB01*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*2+B02*2-PBMGL-YL-4",
    "productName": "书柜",
    "style": "AuraU04*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260205",
        "childName": "拱形玻璃门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*2+B02*2-PBMGL-HK-4",
    "productName": "书柜",
    "style": "AuraU04*2+AuraB02*2",
    "material": "刨花板+MDF+玻璃",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260223",
        "childName": "拱形玻璃门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB02",
        "childMaterial": "刨花板+MDF+玻璃",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形玻璃门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*2+B03*2-PBMTC-YL-4",
    "productName": "书柜",
    "style": "AuraU05*2+AuraB03*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*2+B03*2-PBMTC-HK-4",
    "productName": "书柜",
    "style": "AuraU05*2+AuraB03*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*2+B04*2-PBM-YL-4",
    "productName": "书柜",
    "style": "AuraU04*2+AuraB04*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260207",
        "childName": "拱形F全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U04*2+B04*2-PBM-HK-4",
    "productName": "书柜",
    "style": "AuraU04*2+AuraB04*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260220",
        "childName": "拱形F全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形F全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*2+B04*2-PBM-YL-4",
    "productName": "书柜",
    "style": "AuraU05*2+AuraB04*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260211",
        "childName": "拱形Y全开窗上架(原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260214",
        "childName": "拱形门单抽边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SG-U05*2+B04*2-PBM-HK-4",
    "productName": "书柜",
    "style": "AuraU05*2+AuraB04*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260221",
        "childName": "拱形Y全开窗上架(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上架",
        "childStyle": "AuraU05",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形Y全开窗",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260217",
        "childName": "拱形门单抽边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB04",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门单抽",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SP-U03*1+B03*1-PBMTC-YL-2",
    "productName": "食品储藏柜",
    "style": "AuraU03*1+AuraB03*1",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260209",
        "childName": "拱形藤编门上柜(原木色)",
        "ratio": 1,
        "childProductName": "上柜",
        "childStyle": "AuraU03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SP-U03*1+B03*1-PBMTC-HK-2",
    "productName": "食品储藏柜",
    "style": "AuraU03*1+AuraB03*1",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260225",
        "childName": "拱形藤编门上柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "上柜",
        "childStyle": "AuraU03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SP-U01*1+B01*1-PBM-YL-2",
    "productName": "食品储藏柜",
    "style": "AuraU01*1+AuraB01*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260206",
        "childName": "拱形门上柜(原木色)",
        "ratio": 1,
        "childProductName": "上柜",
        "childStyle": "AuraU01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SP-U01*1+B01*1-PBM-HK-2",
    "productName": "食品储藏柜",
    "style": "AuraU01*1+AuraB01*1",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "2pack",
    "children": [
      {
        "childCode": "IF260222",
        "childName": "拱形门上柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "上柜",
        "childStyle": "AuraU01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 1,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SP-U03*2+B03*2-PBMTC-YL-4",
    "productName": "食品储藏柜",
    "style": "AuraU03*2+AuraB03*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260209",
        "childName": "拱形藤编门上柜(原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260208",
        "childName": "拱形藤编门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SP-U03*2+B03*2-PBMTC-HK-4",
    "productName": "食品储藏柜",
    "style": "AuraU03*2+AuraB03*2",
    "material": "刨花板+MDF+藤编",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260225",
        "childName": "拱形藤编门上柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260219",
        "childName": "拱形藤编门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB03",
        "childMaterial": "刨花板+MDF+藤编",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形藤编门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SP-U01*2+B01*2-PBM-YL-4",
    "productName": "食品储藏柜",
    "style": "AuraU01*2+AuraB01*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "原木色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260206",
        "childName": "拱形门上柜(原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260212",
        "childName": "拱形门边柜(原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  },
  {
    "parentCode": "SP-U01*2+B01*2-PBM-HK-4",
    "productName": "食品储藏柜",
    "style": "AuraU01*2+AuraB01*2",
    "material": "刨花板+MDF",
    "brand": "中性",
    "color": "黑色",
    "packQty": "4pack",
    "children": [
      {
        "childCode": "IF260222",
        "childName": "拱形门上柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "上柜",
        "childStyle": "AuraU01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      },
      {
        "childCode": "IF260216",
        "childName": "拱形门边柜(黑色+原木色)",
        "ratio": 2,
        "childProductName": "边柜",
        "childStyle": "AuraB01",
        "childMaterial": "刨花板+MDF",
        "childTarget": "通用",
        "childModel": "通用",
        "childBrand": "中性",
        "childPattern": "拱形门",
        "childColor": "黑色+原木色",
        "childPackQty": "1pack"
      }
    ],
    "comboType": "成套组合"
  }
]

/** 组合物料快速映射字典 */
export const FURNITURE_COMBO_MAP: Record<string, FurnitureComboRecord> = Object.fromEntries(
  FURNITURE_COMBO_BOM_LIBRARY.map(item => [item.parentCode, item])
)

/** 获取组合物料全量元数据（提供完善兜底） */
export function getFurnitureComboMeta(parentCode: string): FurnitureComboRecord | undefined {
  return FURNITURE_COMBO_MAP[parentCode]
}
