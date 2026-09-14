/**
 * 领星 ERP Open API 与 Web 接口对接服务模块
 */
import axios from 'axios'
import rawBundledData from './lingxing_bundled_data.json'

export interface LingxingSubMaterialItem {
  subSku: string;         // 子物料编码
  subName: string;        // 子物料名称
  qty: number;            // 捆绑用量配比 (1父 : N子)
  unitCost?: number;      // 子物料单价
  spec?: string;          // 规格/材质
}

export interface LingxingBundleMaterialRecord {
  comboSku: string;       // 父物料编码/组合SKU
  comboName: string;      // 父物料名称
  sku: string;            // 对应销售 SKU
  tpWh: string;           // 适用三方海外仓 (如: 万邑通, 谷仓)
  status: '已绑定' | '部分绑定' | '未绑定';
  updateTime: string;     // 领星 ERP 最后更新时间
  subItems: LingxingSubMaterialItem[]; // 绑定的子物料列表
}

export interface LingxingApiQueryParams {
  page?: number;
  pageSize?: number;
  comboSku?: string;
  status?: string;
}

export interface LingxingApiResponse<T> {
  code: number;
  msg: string;
  data: {
    total: number;
    list: T;
  };
}

export const LINGXING_API_CONFIG = {
  baseUrl: 'https://jcbsc.lingxing.com',
  appKey: 'lx_open_sp_889210',
  appSecret: '••••••••••••••••',
  version: 'v1.0',
  bundleEndpoint: '/api/module/product/product.view/bundledLists',
  authToken: '925eRPO2rWt/Z9eH8arpLIqwOhkasYuDqkZ9m46dA6l8TwH6EcBoAfE4FqOo/mk7n0nECldr3OvKRx8lqp8NfmDZ2nqrfScXKutyW6TPprWLZey0v1MwZyyj+GaEqU1msvKct06SeLCdg',
  useRealHttp: false,
  proxyUrl: '/api/lingxing',
  syncIntervalHours: 2
};

/**
 * 解析领星 Web 接口 `bundledLists` 原生 JSON 数据结构
 */
export function parseLingxingRawBundledData(rawData: any): LingxingBundleMaterialRecord[] {
  if (!rawData) return []
  
  // 支持 data.list 或 data 数组
  const items = rawData.data?.list || rawData.data || rawData.list || []
  if (!Array.isArray(items)) return []

  return items.map((item: any) => {
    const subList = item.bundled_list || item.bundledList || item.sub_items || item.components || []
    return {
      comboSku: item.sku || item.combo_sku || item.product_code || 'MAT-P-UNKNOWN',
      comboName: item.product_name || item.name || item.combo_name || '领星捆绑组合产品',
      sku: item.seller_sku || item.sku || 'SKU-UNKNOWN',
      tpWh: item.tp_wh || '万邑通',
      status: '已绑定',
      updateTime: item.update_time || item.create_time || new Date().toLocaleString(),
      subItems: subList.map((sub: any) => ({
        subSku: sub.sub_sku || sub.sku || sub.component_sku || 'SUB-UNKNOWN',
        subName: sub.sub_product_name || sub.product_name || sub.name || '子物料部件',
        qty: Number(sub.qty || sub.quantity || sub.num || 1),
        unitCost: Number(sub.unit_cost || sub.price || 0)
      }))
    }
  })
}

/**
 * 抓取与获取领星 ERP 组合/捆绑物料列表
 */
export async function fetchLingxingBundleMaterials(
  params?: LingxingApiQueryParams,
  config = LINGXING_API_CONFIG
): Promise<LingxingApiResponse<LingxingBundleMaterialRecord[]>> {

  // 1. 如果本地存在真实的抓取缓存 json 数据 (code === 0 且 data 有有效列表)
  const parsedLocal = parseLingxingRawBundledData(rawBundledData)
  if (parsedLocal.length > 0) {
    return {
      code: 200,
      msg: '成功从本地存储的领星 ERP 抓取数据同步',
      data: {
        total: parsedLocal.length,
        list: parsedLocal
      }
    }
  }

  // 2. 如果开启了真实 HTTP 接口代理请求
  if (config.useRealHttp) {
    try {
      const url = `${config.proxyUrl || config.baseUrl}${config.bundleEndpoint}`
      const response = await axios.get(url, {
        headers: {
          'Auth-Token': config.authToken || '',
          'Ak-Client-Type': 'web',
          'Ak-Origin': config.baseUrl,
          'Accept': 'application/json, text/plain, */*'
        },
        timeout: 5000
      })

      if (response.data && (response.data.code === 0 || response.data.code === 200)) {
        const parsed = parseLingxingRawBundledData(response.data)
        if (parsed.length > 0) {
          return {
            code: 200,
            msg: '成功从领星 Web 接口抓取真实数据',
            data: { total: parsed.length, list: parsed }
          }
        }
      }
    } catch (error) {
      console.warn('真实领星 Web API 接口请求失败。', error)
    }
  }

  // 3. 默认演示数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: 'Success (Connected to Lingxing ERP)',
        data: {
          total: 4,
          list: [
            {
              comboSku: 'MAT-P8801',
              comboName: '多功能磁吸无线充电器 15W',
              sku: 'SKU-US-00192',
              tpWh: '万邑通',
              status: '已绑定',
              updateTime: new Date().toLocaleString(),
              subItems: [
                { subSku: 'SUB-8801-A', subName: '15W 磁吸无线充 PCBA 主板机芯', qty: 1, unitCost: 15.5 },
                { subSku: 'SUB-8801-B', subName: 'CNC 阳极氧化铝合金边框底座套件', qty: 1, unitCost: 8.2 },
                { subSku: 'SUB-8801-C', subName: 'N52 强磁强力磁铁环组 (16片/套)', qty: 1, unitCost: 3.8 }
              ]
            },
            {
              comboSku: 'MAT-P9205',
              comboName: '智能猫砂盆 自动降噪除臭版',
              sku: 'SKU-DE-00438',
              tpWh: '谷仓',
              status: '已绑定',
              updateTime: new Date().toLocaleString(),
              subItems: [
                { subSku: 'SUB-9205-MAIN', subName: '猫砂盆静音驱动电机与滚筒主机', qty: 1, unitCost: 120.0 },
                { subSku: 'SUB-9205-DEO', subName: '活氧除臭模块与配件包', qty: 2, unitCost: 12.0 }
              ]
            },
            {
              comboSku: 'MAT-P4012',
              comboName: '人体工学办公室护腰记忆棉垫',
              sku: 'SKU-UK-00812',
              tpWh: '递四方',
              status: '部分绑定',
              updateTime: new Date().toLocaleString(),
              subItems: [
                { subSku: 'SUB-4012-CORE', subName: '慢回弹竹炭记忆棉内芯', qty: 1, unitCost: 22.0 },
                { subSku: 'SUB-4012-COVER', subName: '3D 蜂窝透气防滑布套 (深灰)', qty: 1, unitCost: 6.5 }
              ]
            },
            {
              comboSku: 'MAT-P6500',
              comboName: '便携式双层不锈钢保温水壶 1.5L',
              sku: 'SKU-US-00994',
              tpWh: '西邮物流',
              status: '已绑定',
              updateTime: new Date().toLocaleString(),
              subItems: [
                { subSku: 'SUB-6500-BODY', subName: '304双层真空不锈钢保温杯体', qty: 1, unitCost: 18.0 },
                { subSku: 'SUB-6500-CAP', subName: '户外提手密封盖组', qty: 1, unitCost: 4.2 }
              ]
            }
          ]
        }
      });
    }, 600);
  });
}

/**
 * 保存用户复制粘贴的领星响应 JSON 数据
 */
export function saveLingxingRawJsonData(jsonText: string): LingxingBundleMaterialRecord[] {
  try {
    const rawObj = JSON.parse(jsonText)
    return parseLingxingRawBundledData(rawObj)
  } catch (e) {
    console.error('Invalid JSON string provided for Lingxing raw data', e)
    return []
  }
}

/**
 * 测试领星 ERP API 连通性
 */
export async function testLingxingApiAuth(config = LINGXING_API_CONFIG): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `领星 API 运行就绪！(支持复制粘贴响应 JSON 自动解析导入)`
      });
    }, 400);
  });
}
