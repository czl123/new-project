export const SAMPLE_STATUS = [
  { label: '待提交', value: '1', type: 'info', color: '#8c8c8c' },
  { label: '领用中', value: '2', type: 'primary', color: '#1890ff' },
  { label: '归还中', value: '3', type: 'warning', color: '#faad14' },
  { label: '已归还', value: '4', type: 'success', color: '#52c41a' },
  { label: '已封存', value: '5', type: 'info', color: '#595959' },
  { label: '已销毁', value: '6', type: 'danger', color: '#ff4d4f' },
  { label: '已遗失', value: '7', type: 'danger', color: '#f5222d' },
  { label: '已内购', value: '8', type: 'success', color: '#389e0d' },
  { label: '已退仓', value: '12', type: 'warning', color: '#d46b08' },
  { label: '已退供', value: '13', type: 'warning', color: '#ad8b00' }
]

export const STATUS_MAP = SAMPLE_STATUS.reduce((acc, cur) => {
  acc[cur.value] = cur
  return acc
}, {} as any)

export const SAMPLE_SOURCE = [
  { label: '供应商', value: '1' },
  { label: '1688网站', value: '2' },
  { label: '淘宝网站', value: '3' }
]

export const SAMPLE_TYPE = [
  { label: '推荐样', value: '1', desc: '推荐测试样' },
  { label: '首版样', value: '2', desc: '首版测试样' },
  { label: '修改样', value: '3', desc: '修改优化样' },
  { label: '确认样', value: '5', desc: '大货前确认样' },
  { label: '二供对比样', value: '6', desc: '第二供应商的对比测试样' },
  { label: '库存对比样', value: '7', desc: '仓库借调的对比测试样' },
  { label: '大货对比样', value: '8', desc: '供应商借调的对比测试样' }
]

export const INITIAL_QUERY_PARAMS = {
  sampleNo: '',
  sampleName: '',
  round: '',
  source: '',
  status: '',
  dateRange: []
}
