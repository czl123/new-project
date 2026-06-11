import { ref } from 'vue'

interface Member {
  name: string
  empNo: string
  position: string
  role: string
  status: string
  joinDate: string
}

interface Department {
  id: number
  name: string
  type: string
  leader: string
  phone: string
  location: string
  desc: string
  sort: number
  members: Member[]
  memberCount?: number
  children?: Department[]
}

// 共享的部门 tree 数据
export const deptTree = ref<Department[]>([
  {
    id: 1, name: '总裁室', type: '职能部门', leader: '黄凡畅', phone: '未设置', location: '深圳',
    desc: '总裁办及核心决策团队', sort: 1, 
    memberCount: 5,
    members: [
      { name: '杜云', empNo: 'D001', position: '常务副总裁', role: '部门主管', status: '在职', joinDate: '2018-01-01' },
      { name: '王美艳', empNo: 'M001', position: '运营副总裁', role: '部门主管', status: '在职', joinDate: '2018-01-01' },
      { name: '黄凡畅', empNo: 'P001', position: '总裁', role: '部门主管', status: '在职', joinDate: '2018-01-01' },
      { name: '李恩群', empNo: 'P002', position: '总裁', role: '部门主管', status: '在职', joinDate: '2018-01-01' }
    ],
    children: [
      { id: 101, name: '法务中心', type: '职能部门', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 1, members: [], memberCount: 1, children: [] }
    ]
  },
  {
    id: 2, name: '供应链本部', type: '事业部', leader: '朱全胜', phone: '未设置', location: '深圳',
    desc: '负责公司全球供应链管理与采购业务', sort: 2, 
    memberCount: 186,
    members: [
      { name: '朱全胜', empNo: 'S001', position: '供应链总监', role: '部门主管', status: '在职', joinDate: '2018-01-01' }
    ],
    children: [
      { 
        id: 201, name: '采购中心', type: '业务团队', leader: '张海围', phone: '未设置', location: '深圳', desc: '', sort: 1, 
        memberCount: 46, 
        members: [
          { name: '张海围', empNo: 'S101', position: '高级经理', role: '部门主管', status: '在职', joinDate: '2019-05-20' }
        ],
        children: [
          { 
            id: 2011, name: '采购商务部', type: '业务团队', leader: '张海围', phone: '未设置', location: '深圳', desc: '', sort: 1, 
            memberCount: 46,
            members: [
              { name: '张海围', empNo: 'S101', position: '高级经理', role: '部门主管', status: '在职', joinDate: '2019-05-20' },
              { name: '胡新斌', empNo: 'S102', position: '采购开发经理', role: '普通员工', status: '在职', joinDate: '2020-11-12' }
            ],
            children: [
              { 
                id: 20111, name: '家居家电组', type: '业务团队', leader: '黄晓君', phone: '未设置', location: '深圳', desc: '', sort: 1, 
                memberCount: 5, 
                members: [
                  { name: '黄晓君', empNo: 'S111', position: '采购开发专员', role: '普通员工', status: '在职', joinDate: '2021-02-01' },
                  { name: '李霞', empNo: 'S112', position: '后端采购专员', role: '普通员工', status: '在职', joinDate: '2021-03-15' },
                  { name: '罗泽文', empNo: 'S113', position: '后端采购专员', role: '普通员工', status: '在职', joinDate: '2021-05-20' },
                  { name: '杨登峰', empNo: 'S114', position: '采购开发专员', role: '普通员工', status: '在职', joinDate: '2021-06-10' },
                  { name: '汪宇', empNo: 'S115', position: '采购专员', role: '普通员工', status: '在职', joinDate: '2021-08-01' }
                ],
                children: [] 
              },
              { 
                id: 20112, name: '江浙沪组', type: '业务团队', leader: '余本娇', phone: '未设置', location: '深圳', desc: '', sort: 2, 
                memberCount: 13, 
                members: [
                  { name: '余本娇', empNo: 'S201', position: '采购组长', role: '组长', status: '在职', joinDate: '2020-01-01' },
                  { name: '关紫玲', empNo: 'S202', position: '后端采购专员', role: '普通员工', status: '在职', joinDate: '2020-02-15' },
                  { name: '蔡金利', empNo: 'S203', position: '采购物控组长', role: '组长', status: '在职', joinDate: '2020-03-10' },
                  { name: '李文静', empNo: 'S204', position: 'HRBP', role: '普通员工', status: '在职', joinDate: '2020-04-20' },
                  { name: '吴东东', empNo: 'S205', position: '采购开发专员', role: '普通员工', status: '在职', joinDate: '2020-05-12' },
                  { name: '杨座林', empNo: 'S206', position: '质检组长', role: '组长', status: '在职', joinDate: '2020-06-01' },
                  { name: '唐晶', empNo: 'S207', position: 'SQE质量工程师', role: '普通员工', status: '在职', joinDate: '2020-07-15' },
                  { name: '何午江', empNo: 'S208', position: '外派QC', role: '普通员工', status: '在职', joinDate: '2020-08-05' },
                  { name: '徐灵锋', empNo: 'S209', position: '采购开发专员', role: '普通员工', status: '在职', joinDate: '2020-09-18' },
                  { name: '吴秋晓', empNo: 'S210', position: '采购专员', role: '普通员工', status: '在职', joinDate: '2020-10-30' },
                  { name: '陈浩翔', empNo: 'S211', position: '采购专员', role: '普通员工', status: '在职', joinDate: '2020-11-22' },
                  { name: '肖宏宇', empNo: 'S212', position: '采购专员', role: '普通员工', status: '在职', joinDate: '2020-12-10' },
                  { name: '张涛涛', empNo: 'S213', position: '采购专员', role: '普通员工', status: '在职', joinDate: '2021-01-05' }
                ],
                children: [] 
              },
              { 
                id: 20113, name: '纺织组', type: '业务团队', leader: '刘成华', phone: '未设置', location: '深圳', desc: '', sort: 3, 
                memberCount: 6,
                members: [
                  { name: '刘成华', empNo: 'S311', position: '采购组长', role: '组长', status: '在职', joinDate: '2020-05-01' },
                  { name: '孙柳', empNo: 'S312', position: '采购物控专员', role: '普通员工', status: '在职', joinDate: '2021-02-15' },
                  { name: '备用', empNo: 'S313', position: '采购专员', role: '普通员工', status: '在职', joinDate: '2021-06-01' },
                  { name: '陈志锋', empNo: 'S314', position: '采购开发专员', role: '普通员工', status: '在职', joinDate: '2021-09-20' }
                ],
                children: [] 
              },
              { 
                id: 20114, name: '通用组', type: '业务团队', leader: '吴锋', phone: '未设置', location: '深圳', desc: '', sort: 4, 
                memberCount: 4, 
                members: [
                  { name: '吴锋', empNo: 'S411', position: '采购专员', role: '普通员工', status: '在职', joinDate: '2021-01-20' },
                  { name: '陈敏玲', empNo: 'S412', position: '后端采购专员', role: '普通员工', status: '在职', joinDate: '2021-06-15' },
                  { name: '林敏婷', empNo: 'S413', position: '后端采购专员', role: '普通员工', status: '在职', joinDate: '2022-02-28' },
                  { name: '刘小群', empNo: 'S414', position: '后端采购专员', role: '普通员工', status: '在职', joinDate: '2022-05-12' }
                ],
                children: [] 
              },
              { 
                id: 20115, name: '3C组', type: '业务团队', leader: '唐清真', phone: '未设置', location: '深圳', desc: '', sort: 5, 
                memberCount: 6, 
                members: [
                  { name: '唐清真', empNo: 'S511', position: '采购组长', role: '组长', status: '在职', joinDate: '2020-03-01' },
                  { name: '曾志骞', empNo: 'S512', position: '采购开发专员', role: '普通员工', status: '在职', joinDate: '2021-04-15' },
                  { name: '邓俊婷', empNo: 'S513', position: '后端采购专员', role: '普通员工', status: '在职', joinDate: '2021-09-01' },
                  { name: '李梦桃', empNo: 'S514', position: '采购物控专员', role: '普通员工', status: '在职', joinDate: '2022-02-10' },
                  { name: '周爱平', empNo: 'S515', position: '采购助理', role: '普通员工', status: '在职', joinDate: '2022-06-18' },
                  { name: '韦小柱', empNo: 'S516', position: '采购专员', role: '普通员工', status: '在职', joinDate: '2022-08-01' }
                ],
                children: [] 
              },
              { 
                id: 20116, name: '家具五金塑胶组', type: '业务团队', leader: '姚春玲', phone: '未设置', location: '深圳', desc: '', sort: 6, 
                memberCount: 6, 
                members: [
                  { name: '姚春玲', empNo: 'S611', position: '采购开发专员', role: '普通员工', status: '在职', joinDate: '2021-05-10' },
                  { name: '林琦杰', empNo: 'S612', position: '采购开发专员', role: '普通员工', status: '在职', joinDate: '2021-11-20' },
                  { name: '陶红玲', empNo: 'S613', position: '采购物控专员', role: '普通员工', status: '在职', joinDate: '2022-03-15' },
                  { name: '订单文员.备用账号', empNo: 'S614', position: '采购专员', role: '普通员工', status: '在职', joinDate: '2022-07-01' },
                  { name: '盛自清', empNo: 'S615', position: '采购物控专员', role: '普通员工', status: '在职', joinDate: '2022-10-12' }
                ],
                children: [] 
              },
              { 
                id: 20117, name: '采购下单组', type: '业务团队', leader: '石宏彪', phone: '未设置', location: '深圳', desc: '', sort: 7, 
                memberCount: 3, 
                members: [
                  { name: '石宏彪', empNo: 'S711', position: '物控专员', role: '普通员工', status: '在职', joinDate: '2021-08-15' }
                ],
                children: [] 
              },
              { 
                id: 20118, name: 'TK采购组', type: '业务团队', leader: '杨雪', phone: '未设置', location: '深圳', desc: '', sort: 8, 
                memberCount: 6, 
                members: [
                  { name: '杨雪', empNo: 'S811', position: '采购开发专员', role: '普通员工', status: '在职', joinDate: '2021-12-01' },
                  { name: '刘兴日', empNo: 'S812', position: '采购开发专员', role: '普通员工', status: '在职', joinDate: '2022-04-10' },
                  { name: '李运娥', empNo: 'S813', position: '采购开发专员', role: '普通员工', status: '在职', joinDate: '2022-07-15' },
                  { name: '余郁', empNo: 'S814', position: '采购专员', role: '普通员工', status: '在职', joinDate: '2022-10-20' },
                  { name: '杨涛', empNo: 'S815', position: '采购开发专员', role: '普通员工', status: '在职', joinDate: '2023-01-12' },
                  { name: '韦俊', empNo: 'S816', position: '采购物控专员', role: '普通员工', status: '在职', joinDate: '2023-05-05' }
                ],
                children: [] 
              }
            ] 
          }
        ] 
      },
      { id: 202, name: '物流关务中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 2, members: [], memberCount: 22, children: [] },
      { id: 203, name: '仓储中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 3, members: [], memberCount: 118, children: [] },
      { id: 204, name: '美国仓', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 4, members: [], memberCount: 0, children: [] }
    ]
  },
  {
    id: 3, name: '运营本部', type: '事业部', leader: '王美艳', phone: '未设置', location: '深圳',
    desc: '负责各平台店铺运营与业绩增长', sort: 3, 
    memberCount: 162,
    members: [
      { name: '王美艳', empNo: 'M001', position: '运营副总裁', role: '部门主管', status: '在职', joinDate: '2018-01-01' },
      { name: '涂兹能', empNo: 'M002', position: '总经理助理', role: '普通员工', status: '在职', joinDate: '2019-03-15' }
    ],
    children: [
      { 
        id: 301, name: '运营一中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 1, 
        memberCount: 14, 
        members: [],
        children: [
          {
            id: 3011, name: '事业一部', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 1, 
            memberCount: 6,
            members: [],
            children: [
              {
                id: 30111, name: 'Team1', type: '业务团队', leader: '姚娟旋', phone: '未设置', location: '深圳', desc: '', sort: 1, 
                memberCount: 6,
                members: [
                  { name: '姚娟旋', empNo: 'O111', position: '运营主管', role: '组长', status: '在职', joinDate: '2021-03-01' },
                  { name: '唐莉莎', empNo: 'O112', position: '运营专员', role: '普通员工', status: '在职', joinDate: '2021-05-15' },
                  { name: '吴凡', empNo: 'O113', position: '运营专员', role: '普通员工', status: '在职', joinDate: '2021-08-20' },
                  { name: '薛俊浩', empNo: 'O114', position: '运营专员', role: '普通员工', status: '在职', joinDate: '2021-11-10' },
                  { name: '周铭贤', empNo: 'O115', position: '运营专员', role: '普通员工', status: '在职', joinDate: '2022-02-15' },
                  { name: '曹安娜', empNo: 'O116', position: '运营专员', role: '普通员工', status: '在职', joinDate: '2022-05-01' }
                ],
                children: []
              }
            ]
          }
        ] 
      },
      { id: 302, name: '运营二中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 2, members: [], memberCount: 14, children: [] },
      { id: 303, name: '运营三中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 3, members: [], memberCount: 9, children: [] },
      { id: 304, name: '运营四中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 4, members: [], memberCount: 14, children: [] },
      { id: 305, name: '运营五中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 5, members: [], memberCount: 13, children: [] },
      { id: 306, name: '运营六中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 6, members: [], memberCount: 22, children: [] },
      { id: 307, name: '运营七中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 7, members: [], memberCount: 10, children: [] },
      { id: 308, name: '运营八中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 8, members: [], memberCount: 10, children: [] },
      { id: 309, name: '平台发展中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 9, members: [], memberCount: 9, children: [] },
      { id: 310, name: 'Tiktok业务中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 10, members: [], memberCount: 17, children: [] },
      { id: 311, name: '精品一中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 11, members: [], memberCount: 6, children: [] },
      { id: 312, name: '精品二中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 12, members: [], memberCount: 9, children: [] },
      { id: 313, name: '精品三中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 13, members: [], memberCount: 4, children: [] },
      { id: 314, name: '精品七中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 14, members: [], memberCount: 3, children: [] },
      { id: 315, name: 'Walmart发展中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 15, members: [], memberCount: 6, children: [] },
      { id: 316, name: '精品四中心', type: '业务团队', leader: '未设置', phone: '未设置', location: '深圳', desc: '', sort: 16, members: [], memberCount: 1, children: [] }
    ]
  },
  {
    id: 4, name: '运营支持本部', type: '职能部门', leader: '未设置', phone: '未设置', location: '深圳',
    desc: '为业务团队提供流量、设计、数据等中台支持', sort: 4, members: [], memberCount: 163, children: []
  },
  {
    id: 5, name: '综合管理本部', type: '职能部门', leader: '未设置', phone: '未设置', location: '深圳',
    desc: '负责公司人力、行政、财务及 IT 流程管理', sort: 5, members: [], memberCount: 76, children: []
  }
])
