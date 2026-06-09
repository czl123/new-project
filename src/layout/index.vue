<template>
  <div class="app-wrapper">
    <div class="navbar">
      <div class="navbar-left">
        <div class="logo-container">
          <img src="@/assets/logo.png" alt="logo" class="logo-img" />
        </div>
      </div>

      <div class="tags-view-container">
        <div 
          v-for="tag in tagsStore.visitedViews" 
          :key="tag.path"
          class="tag-item"
          :class="{ active: currentPath === tag.path }"
          @click="handleTagClick(tag)"
        >
          <span class="tag-title">{{ tag.title }}</span>
          <el-icon v-if="tag.path !== '/dashboard'" class="tag-close" @click.stop="handleCloseTag(tag)"><Close /></el-icon>
        </div>
      </div>

      <div class="right-menu">
        <div class="menu-search-container">
          <el-autocomplete
            v-model="searchQuery"
            :fetch-suggestions="querySearch"
            placeholder="搜索功能 (Ctrl + K)"
            prefix-icon="Search"
            class="menu-search-input"
            @select="handleSearchSelect"
          >
            <template #default="{ item }">
              <div class="search-result-item">
                <span class="category">{{ item.category }}</span>
                <el-icon class="divider-icon"><ArrowRight /></el-icon>
                <span class="title">{{ item.title }}</span>
              </div>
            </template>
          </el-autocomplete>
        </div>
        <div class="action-icons">
          <el-icon><Bell /></el-icon>
          <el-icon><User /></el-icon>
        </div>
      </div>
    </div>

    <div class="main-container">
      <div class="sidebar-container">
        <div 
          v-for="item in menuItems" 
          :key="item.path"
          class="sidebar-item"
          :class="{ active: currentPath.startsWith(item.path) || (activeSubMenu === item.title) }"
          @click="handleMenuClick(item)"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span class="menu-title">{{ item.title }}</span>
        </div>
      </div>

      <transition name="portal-fade">
        <div v-if="showSubMenu" class="sub-menu-overlay" @click="closeSubMenu">
          <div class="portal-panel" @click.stop>
            <div class="portal-header">
              <div class="portal-title">
                <el-icon class="portal-icon"><component :is="activeMenuIcon" /></el-icon>
                <span>{{ activeMenuTitle }}中心 / Hub</span>
              </div>
              <div class="portal-desc">管理您的{{ activeMenuTitle }}核心业务流程与数据资产</div>
            </div>
            
            <div class="portal-grid">
              <div 
                v-for="(group, index) in currentSubMenuGroups" 
                :key="group.title" 
                class="portal-group staggered-fade-in"
                :style="{ animationDelay: (index * 0.04) + 's' }"
              >
                <div class="group-caption">
                  <div class="caption-icon"><el-icon><component :is="group.icon || 'Menu'" /></el-icon></div>
                  <span>{{ group.title }}</span>
                </div>
                <div class="group-items">
                  <div 
                    v-for="item in group.items" 
                    :key="item.title" 
                    class="portal-item" 
                    :class="{ active: currentPath === item.path }"
                    @click="handleSubMenuClick(item)"
                  >
                    <span class="item-label">{{ item.title }}</span>
                    <el-icon class="item-arrow"><ArrowRight /></el-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div class="app-main">
        <div class="view-content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsStore } from '@/store/tags'
import { 
  Select, Search, ArrowRight, Goods, Bell, User, Wallet, TrendCharts, Cpu, Files, Share, Tools, Setting,
  Document, Calendar, Edit, PieChart, Connection, Money, Box, ShoppingCart, DataAnalysis, Histogram, 
  List, Stamp, CreditCard, Ticket, Menu, Shop, Management, DataLine, OfficeBuilding, Download, Position,
  Ship, Location, WarnTriangleFilled, Van, Back, House, Avatar, Odometer, Operation, Key, Guide, Notebook,
  Close
} from '@element-plus/icons-vue'

const route = useRoute(); const router = useRouter()
const tagsStore = useTagsStore()
const showSubMenu = ref(false); const activeSubMenu = ref(''); const searchQuery = ref('')
const currentPath = computed(() => route.path)

watch(() => route.path, () => {
  if (route.meta && route.meta.title) {
    tagsStore.addVisitedView({ title: route.meta.title as string, path: route.path, name: route.name as string })
  }
}, { immediate: true })

const menuItems = [
  { title: '财务', icon: 'Wallet', path: '/finance' },
  { title: '产品', icon: 'Goods', path: '/product' },
  { title: '运营', icon: 'TrendCharts', path: '/operation' },
  { title: '供应链', icon: 'Cpu', path: '/supply-chain' },
  { title: '资源', icon: 'Files', path: '/resource' },
  { title: '第三方', icon: 'Share', path: '/third-party' },
  { title: '工具', icon: 'Tools', path: '/tools' },
  { title: '设置', icon: 'Setting', path: '/settings' }
]

const productSubMenu = {
  columns: [
    [
      { title: '产品规划', icon: 'Document', items: [{ title: 'SPU管理', path: '/product/spu' }, { title: '产品线管理', path: '/product/line' }] },
      { title: '产品预案', icon: 'Calendar', items: [{ title: '开发预案', path: '/product/pre-plan/develop' }, { title: '需求预案', path: '/product/pre-plan/demand' }, { title: '推样预案', path: '/product/pre-plan/sample' }, { title: '预案反馈', path: '/product/pre-plan/feedback' }] },
      { title: '产品提案', icon: 'Edit', items: [{ title: '提案管理', path: '/product/proposal/manage' }, { title: '开发样拿样任务', path: '/product/proposal/sample-task' }, { title: '开发样拿样任务看板', path: '/product/proposal/sample-task-kanban' }, { title: '开发样管理', path: '/product/proposal/sample-manage' }] },
      { title: '设置', icon: 'Setting', items: [{ title: '基础设置', path: '/product/settings' }] },
      { title: '产品运营', icon: 'PieChart', items: [{ title: '首单采购需求', path: '/product/operation/first-order-demand' }, { title: '首单采购管理', path: '/product/operation/first-order-manage' }, { title: '拓新首单管理', path: '/product/operation/new-first-order-manage' }, { title: '拓新首单需求', path: '/product/operation/new-first-order-demand' }] }
    ],
    [
      { title: '研发管理', icon: 'Connection', items: [{ title: '预案指派', path: '/product/rd/assign' }, { title: '预案审核', path: '/product/rd/audit' }, { title: '预案一级审批', path: '/product/rd/approve1' }, { title: '预案二级审批', path: '/product/rd/approve2' }, { title: '定品审核', path: '/product/rd/product-audit' }, { title: '定品一级审批', path: '/product/rd/product-approve1' }, { title: '定品二级审批', path: '/product/rd/product-approve2' }, { title: '拓新定品审批', path: '/product/rd/new-product-approve' }] },
      { title: '研发费管理', icon: 'Money', items: [{ title: '研发费支付', path: '/product/rd-fee/payment' }, { title: '研发费审批', path: '/product/rd-fee/approve' }, { title: '尾款支付管理', path: '/product/rd-fee/final-payment' }] },
      { title: '物料', icon: 'Box', items: [{ title: '物料商检复核', path: '/product/material/inspection' }, { title: '物料管理', path: '/product/material/manage' }, { title: '物料拓新', path: '/product/material/new' }, { title: '物料修改审核', path: '/product/material/edit-audit' }, { title: '组合物料', path: '/product/material/combo' }, { title: '多码物料管理', path: '/product/material/multi-code' }] },
      { title: '大货样管理', icon: 'Files', items: [{ title: '大货样争样管理', path: '/product/bulk-sample/task' }, { title: '大货样DQE测试', path: '/product/bulk-sample/dqe' }, { title: '大货样样品管理', path: '/product/bulk-sample/manage' }] }
    ]
  ]
}

const financeSubMenu = {
  columns: [
    [{ title: '预算管理', icon: 'Money', items: [{ title: '目标管理', path: '/finance/budget/target' }] },
     { title: 'AZ销售订单', icon: 'ShoppingCart', items: [{ title: '订单源报告数据监控', path: '/finance/order/monitor' }, { title: '订单异常情况汇总', path: '/finance/order/abnormal' }, { title: 'AZ销售订单预结算', path: '/finance/order/pre-settle' }, { title: '利润率参数表管理', path: '/finance/order/profit-params' }] },
     { title: 'AZ库存列表', icon: 'Box', items: [{ title: '源报告列表', path: '/finance/inventory/source' }, { title: '销售出库列表', path: '/finance/inventory/outbound' }, { title: '销售退货列表', path: '/finance/inventory/return' }, { title: '销毁移除跟踪表', path: '/finance/inventory/destroy-track' }, { title: '库存调整列表', path: '/finance/inventory/adjust' }, { title: '期末库存列表', path: '/finance/inventory/final' }, { title: '库存移除&销毁申请', path: '/finance/inventory/destroy-apply' }, { title: 'FBA月度进销存表', path: '/finance/inventory/fba-monthly' }] }],
    [{ title: '亚马逊VAT', icon: 'PieChart', items: [{ title: 'VAT基础信息', path: '/finance/vat/info' }, { title: '源报告', path: '/finance/vat/source' }, { title: '税金测算Sales明细', path: '/finance/vat/sales-detail' }, { title: '税金测算VAT明细', path: '/finance/vat/vat-detail' }, { title: 'VAT核对表', path: '/finance/vat/check' }] },
     { title: 'AZ结算对账', icon: 'Wallet', items: [{ title: '基础信息', path: '/finance/settle/info' }, { title: '源报告业务', path: '/finance/settle/source' }, { title: '收入记录表', path: '/finance/settle/income' }, { title: '回款确认办理', path: '/finance/settle/receive' }, { title: '应收明细', path: '/finance/settle/ar-detail' }, { title: '仓储费', path: '/finance/settle/storage-fee' }, { title: '销毁移除费用', path: '/finance/settle/destroy-fee' }, { title: 'AZ结算异常', path: '/finance/settle/abnormal' }, { title: 'AZ费用索赔', path: '/finance/settle/claim' }] },
     { title: 'AZ结算报告', icon: 'DataAnalysis', items: [{ title: '站内费用分摊', path: '/finance/report/internal-fee' }, { title: '站外费用分摊', path: '/finance/report/external-fee' }, { title: '结算报告', path: '/finance/report/settle' }, { title: 'VC结算报告', path: '/finance/report/vc-settle' }] }],
    [{ title: '小平台结算报告', icon: 'Histogram', items: [{ title: '结算报告', path: '/finance/small/report' }] },
     { title: '基础资料', icon: 'List', items: [{ title: '结算报告参数表', path: '/finance/base/params' }] },
     { title: '财务内控业务', icon: 'Stamp', items: [{ title: '合同管理', path: '/finance/control/contract' }] },
     { title: '财务收付款业务', icon: 'CreditCard', items: [{ title: '开模费付款申请', path: '/finance/payment/mold' }, { title: '研发费报销', path: '/finance/payment/rd-expense' }, { title: '供应商退款', path: '/finance/payment/supplier-refund' }, { title: '个人账户管理', path: '/finance/payment/personal-account' }] },
     { title: '税务管理', icon: 'Ticket', items: [{ title: '发票登记与办理', path: '/finance/tax/invoice' }] }]
  ]
}

const operationSubMenu = {
  columns: [
    [{ title: '备货管理', icon: 'Box', items: [{ title: '每日备货推荐', path: '/op/stock/daily-rec' }, { title: '日常备货申请', path: '/op/stock/normal-apply' }, { title: '日常备货Team审核', path: '/op/stock/team-audit' }, { title: '日常备货事业部审核', path: '/op/stock/dept-audit' }, { title: '特殊备货申请', path: '/op/stock/special-apply' }, { title: '计划部审批', path: '/op/stock/plan-audit' }, { title: 'PMC审批', path: '/op/stock/pmc-audit' }, { title: '下单申请记录', path: '/op/stock/order-log' }, { title: '备货监控', path: '/op/stock/monitor' }, { title: '发货方式设置', path: '/op/stock/ship-set' }, { title: '备货申请记录', path: '/op/stock/apply-log' }, { title: '安全天数设置', path: '/op/stock/safe-days' }, { title: '备货天数设置', path: '/op/stock/stock-days' }, { title: '物流天数设置', path: '/op/stock/log-days' }, { title: '季节系数设置', path: '/op/stock/season-set' }, { title: '自动审核设置', path: '/op/stock/auto-audit' }, { title: '新品备货申请', path: '/op/stock/new-apply' }, { title: '备货数据权限设置', path: '/op/stock/auth-set' }, { title: '黑名单ASIN-AREA', path: '/op/stock/blacklist' }, { title: '备货店铺开票配置', path: '/op/stock/invoice-set' }] }],
    [{ title: '发货管理', icon: 'Van', items: [{ title: '每日发货推荐', path: '/op/ship/daily-rec' }, { title: '发货申请', path: '/op/ship/apply' }, { title: '发货申请审核', path: '/op/ship/audit' }, { title: '发货申请跟踪', path: '/op/ship/track' }, { title: '发货看板', path: '/op/ship/board' }, { title: '标签打印申请', path: '/op/ship/label' }, { title: '发货安全天数', path: '/op/ship/safe-days' }] },
     { title: '品牌业务', icon: 'Stamp', items: [{ title: '商标管理', path: '/op/brand/tm-manage' }, { title: '商标追踪报表', path: '/op/brand/tm-rep' }, { title: '商标证书', path: '/op/brand/tm-cert' }, { title: '品牌管理', path: '/op/brand/manage' }] },
     { title: '图文描述', icon: 'Edit', items: [{ title: '图文描述任务管理', path: '/op/desc/task' }, { title: '图文额度审核', path: '/op/desc/quota' }, { title: '图文描述文案设计', path: '/op/desc/copy' }, { title: '图文描述文案翻译', path: '/op/desc/trans' }, { title: '图文描述图片设计', path: '/op/desc/img' }, { title: '图文描述审核及应用', path: '/op/desc/apply' }, { title: '图文描述管理', path: '/op/desc/manage' }, { title: '图文描述应用列表', path: '/op/desc/list' }] }],
    [{ title: 'Amazon刊登-任务', icon: 'Files', items: [{ title: '页面新建', path: '/op/pub/task-new' }, { title: '页面修改', path: '/op/pub/task-edit' }, { title: '合并拆分', path: '/op/pub/task-merge' }] },
     { title: 'Amazon刊登-承接', icon: 'Connection', items: [{ title: '页面新建', path: '/op/pub/rec-new' }, { title: '页面修改', path: '/op/pub/rec-edit' }, { title: '合并拆分', path: '/op/pub/rec-merge' }] },
     { title: 'Amazon刊登-队列', icon: 'Operation', items: [{ title: '刊登队列', path: '/op/pub/queue' }] },
     { title: 'Listing', icon: 'List', items: [{ title: 'Listing管理', path: '/op/list/manage' }, { title: 'Listing草稿箱', path: '/op/list/draft' }] }]
  ]
}

const resourceSubMenu = {
  columns: [
    [{ title: '店铺创建', icon: 'Shop', items: [{ title: '店铺申请', path: '/res/shop/apply' }, { title: '税号管理', path: '/res/shop/tax' }, { title: '店铺异常管理', path: '/res/shop/abnormal' }, { title: '信用卡账号管理', path: '/res/shop/card' }, { title: '银行收款账户维护', path: '/res/shop/bank' }, { title: '收款银行账号申请变更', path: '/res/shop/change' }] },
     { title: '店铺管理', icon: 'Management', items: [{ title: 'Amazon 店铺管理', path: '/res/manage/amazon' }, { title: 'Walmart店铺管理', path: '/res/manage/walmart' }, { title: '乐天店铺管理', path: '/res/manage/rakuten' }, { title: '速卖通店铺管理', path: '/res/manage/aliexpress' }, { title: '阿里店铺管理', path: '/res/manage/alibaba' }, { title: 'Shopee店铺管理', path: '/res/manage/shopee' }, { title: 'EBAY店铺管理', path: '/res/manage/ebay' }, { title: '来赞达店铺管理', path: '/res/manage/lazada' }, { title: '店铺数据下载任务管理', path: '/res/manage/down' }] }],
    [{ title: '实体公司', icon: 'OfficeBuilding', items: [{ title: '实体公司管理', path: '/res/company/manage' }, { title: '证件印章管理', path: '/res/company/seal' }, { title: '银行设备管理', path: '/res/company/bank' }, { title: '证件印章数量统计', path: '/res/company/seal-stat' }, { title: '银行设备数量统计', path: '/res/company/bank-stat' }] },
     { title: 'Amazon刊登-资源', icon: 'Files', items: [{ title: '套版管理', path: '/res/amazon/tpl' }, { title: 'UPC管理', path: '/res/amazon/upc' }, { title: '颜色管理', path: '/res/amazon/color' }, { title: '违禁词管理', path: '/res/amazon/words' }, { title: '发货标签管理', path: '/res/amazon/label' }, { title: 'GTIN豁免管理', path: '/res/amazon/gtin' }] }],
    [{ title: '源数据采集管理', icon: 'Download', items: [{ title: '下载对象', path: '/res/data/target' }, { title: '报告实例管理', path: '/res/data/inst' }] },
     { title: 'TK东南亚', icon: 'Position', items: [{ title: '实体公司管理', path: '/res/tk/comp' }, { title: '店铺管理', path: '/res/tk/shop' }, { title: '快照记录', path: '/res/tk/snap' }, { title: '源报告', path: '/res/tk/rep' }, { title: '订单结算表', path: '/res/tk/order' }, { title: '结算收款表', path: '/res/tk/settle' }] }]
  ]
}

const supplyChainSubMenu = {
  columns: [
    [{ title: '物流管理', icon: 'Truck', items: [{ title: '物流基础信息', path: '/sc/log/info' }, { title: 'B2B订单发货', path: '/sc/log/b2b' }, { title: 'B2B物流单', path: '/sc/log/bill' }, { title: '物流单对账', path: '/sc/log/rec' }, { title: '物流费付款', path: '/sc/log/pay' }, { title: '物流商押金&预付', path: '/sc/log/dep' }, { title: '物流报表', path: '/sc/log/rep' }, { title: '物流发货', path: '/sc/log/ship' }, { title: '物流单', path: '/sc/log/bill-n' }, { title: '其他渠道物流单', path: '/sc/log/oth' }, { title: 'FBA头程费用测算', path: '/sc/log/fba' }] },
     { title: '报关清关管理', icon: 'Stamp', items: [{ title: '通关产品信息', path: '/sc/cl/prod' }, { title: '通关公司信息', path: '/sc/cl/comp' }, { title: '清关价格折算规则', path: '/sc/cl/price' }, { title: '清关产品合并', path: '/sc/cl/merge' }, { title: '报关单', path: '/sc/cl/bill' }, { title: '清关发票', path: '/sc/cl/inv' }] }],
    [{ title: 'AWD卫星仓', icon: 'Location', items: [{ title: 'AWD货件', path: '/sc/awd/ship' }, { title: 'AWD来货', path: '/sc/awd/arr' }, { title: 'AWD库存', path: '/sc/awd/inv' }] },
     { title: '海外仓', icon: 'House', items: [{ title: '库存管理列表', path: '/sc/os/inv' }, { title: '海外仓入库单', path: '/sc/os/in' }, { title: '海外仓出库单', path: '/sc/os/out' }, { title: '海外仓FNSKU查询', path: '/sc/os/fn' }, { title: '海外仓报表', path: '/sc/os/rep' }, { title: '同步K3异常管理', path: '/sc/os/k3' }, { title: '同步EBMS异常管理', path: '/sc/os/eb' }] }],
    [{ title: '产品供应商', icon: 'Avatar', items: [{ title: '供应商档案', path: '/sc/sup/arc' }, { title: '供应商审核', path: '/sc/sup/aud' }, { title: '供应商资质审核', path: '/sc/sup/lic' }, { title: '供应商审批', path: '/sc/sup/app' }] },
     { title: '亚马逊透明计划', icon: 'Odometer', items: [{ title: 'T-code管理', path: '/sc/tr/tcode' }, { title: '透明计划ASIN设置', path: '/sc/tr/asin' }] }]
  ]
}

const thirdPartySubMenu = {
  columns: [
    [{ title: '马帮-订单列表', icon: 'ShoppingCart', items: [{ title: 'B2B收款确认', path: '/tp/mabang/order/confirm' }, { title: '已发货订单列表', path: '/tp/mabang/order/shipped' }, { title: '已退货订单列表', path: '/tp/mabang/order/returned' }] },
     { title: '马帮-库存同步', icon: 'Box', items: [{ title: '物料价格信息列表', path: '/tp/mabang/stock/price' }, { title: '采购订单列表', path: '/tp/mabang/stock/purchase' }, { title: 'K3销售出库单列表', path: '/tp/mabang/stock/k3-out' }, { title: 'K3采购入库单列表', path: '/tp/mabang/stock/k3-in' }] }],
    [{ title: '马帮-基础数据管理', icon: 'DataAnalysis', items: [{ title: '物料同步记录', path: '/tp/mabang/base/sync' }, { title: '仓库列表', path: '/tp/mabang/base/wh' }, { title: '店铺列表', path: '/tp/mabang/base/shop' }] },
     { title: '领星-基础数据', icon: 'Connection', items: [{ title: '物料接口配置', icon: 'Setting', path: '/tp/lingxing/base/config' }, { title: '物料同步记录', path: '/tp/lingxing/base/sync' }] }]
  ]
}

const toolsSubMenu = {
  columns: [
    [{ title: '审批工作台', icon: 'Stamp', items: [{ title: '审批工作台', path: '/tools/approval/workbench' }] }]
  ]
}

const settingsSubMenu = {
  columns: [
    [{ title: '权限管理', icon: 'Key', items: [{ title: '用户管理', path: '/set/auth/user' }, { title: '店铺管理', path: '/set/auth/shop' }, { title: '角色管理', path: '/set/auth/role' }] },
     { title: '基础资料', icon: 'Files', items: [{ title: '站点管理', path: '/set/base/site' }] },
     { title: '组织架构', icon: 'OfficeBuilding', items: [{ title: '部门管理', path: '/set/org/dept' }] }],
    [{ title: '集成中心', icon: 'Connection', items: [{ title: '数据源配置', path: '/set/inte/source' }] },
     { title: '资源权限', icon: 'Guide', items: [{ title: '菜单管理', path: '/set/res/menu' }] },
     { title: '流程中心', icon: 'Share', items: [{ title: '单据流程配置', path: '/settings/workflow-list' }] }],
    [{ title: '系统管理', icon: 'Setting', items: [{ title: '系统公告', path: '/set/sys/notice' }, { title: '应用管理', path: '/set/sys/app' }, { title: '字典管理', path: '/set/sys/dict' }] },
     { title: '日志管理', icon: 'Notebook', items: [{ title: '业务日志', path: '/set/log/biz' }] }]
  ]
}

const activeMenuTitle = computed(() => activeSubMenu.value)
const activeMenuIcon = computed(() => menuItems.find(m => m.title === activeSubMenu.value)?.icon || 'Menu')
const currentSubMenuGroups = computed(() => {
  const map: any = { 
    '产品': productSubMenu.columns.flat(), 
    '财务': financeSubMenu.columns.flat(), 
    '运营': operationSubMenu.columns.flat(), 
    '供应链': supplyChainSubMenu.columns.flat(), 
    '资源': resourceSubMenu.columns.flat(), 
    '第三方': thirdPartySubMenu.columns.flat(), 
    '工具': toolsSubMenu.columns.flat(), 
    '设置': settingsSubMenu.columns.flat() 
  }
  return map[activeSubMenu.value] || []
})

const allSearchableMenus = computed(() => {
  const res: any[] = []; const menus = { '产品': productSubMenu, '财务': financeSubMenu, '运营': operationSubMenu, '供应链': supplyChainSubMenu, '资源': resourceSubMenu, '第三方': thirdPartySubMenu, '工具': toolsSubMenu, '设置': settingsSubMenu }
  Object.entries(menus).forEach(([cat, menu]) => menu.columns.forEach((col: any) => col.forEach((g: any) => g.items.forEach((i: any) => res.push({ value: i.title, title: i.title, category: cat, path: i.path })))))
  return res
})

const querySearch = (q: string, cb: any) => cb(q ? allSearchableMenus.value.filter(i => i.title.includes(q)) : [])
const handleSearchSelect = (i: any) => { searchQuery.value = ''; router.push(i.path) }
const handleKeyDown = (e: KeyboardEvent) => { if (e.ctrlKey && e.key === 'k') { e.preventDefault(); (document.querySelector('.menu-search-input input') as HTMLElement)?.focus() } }
onMounted(() => window.addEventListener('keydown', handleKeyDown)); onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))

const handleMenuClick = (item: any) => {
  const portalMenus = ['产品', '财务', '运营', '供应链', '资源', '第三方', '工具', '设置']
  if (portalMenus.includes(item.title)) {
    if (activeSubMenu.value === item.title) { showSubMenu.value = false; activeSubMenu.value = '' } 
    else { activeSubMenu.value = item.title; showSubMenu.value = true }
  } else {
    showSubMenu.value = false; activeSubMenu.value = ''; router.push(item.path)
  }
}

const handleSubMenuClick = (item: any) => {
  console.log('Menu Clicked:', item.title, 'Path:', item.path)
  if (!item.path) {
    console.warn('Menu item has no path:', item)
    return
  }
  
  showSubMenu.value = false
  activeSubMenu.value = ''
  
  router.push(item.path).catch(err => {
    console.error('Navigation failed:', err)
    // 回退方案
    window.location.hash = item.path
  })
}

const handleTagClick = (tag: any) => {
  router.push(tag.path)
}

const handleCloseTag = (tag: any) => {
  const index = tagsStore.visitedViews.findIndex(v => v.path === tag.path)
  tagsStore.delVisitedView(tag.path)
  if (currentPath.value === tag.path) {
    const nextTag = tagsStore.visitedViews[index] || tagsStore.visitedViews[index - 1]
    if (nextTag) router.push(nextTag.path)
  }
}

const closeSubMenu = () => { showSubMenu.value = false; activeSubMenu.value = '' }
</script>

<style lang="scss" scoped>
.app-wrapper { display: flex; flex-direction: column; height: 100vh; width: 100vw; overflow: hidden; }
.navbar { height: 48px; background-color: var(--navbar-bg); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; color: #fff; z-index: 1000;
  .navbar-left { display: flex; align-items: center; flex-shrink: 0; .logo-container { display: flex; align-items: center; padding-right: 20px; .logo-img { max-height: 28px; width: auto; } } }
  .tags-view-container { flex: 1; height: 100%; display: flex; align-items: flex-end; gap: 0; overflow-x: auto; margin-right: 20px; &::-webkit-scrollbar { display: none; }
    .tag-item { display: inline-flex; align-items: center; height: 34px; padding: 0 16px; font-size: 13px; color: rgba(255, 255, 255, 0.7); cursor: pointer; transition: all 0.2s; position: relative; gap: 8px; border-radius: 6px 6px 0 0;
      &:not(:first-child):not(.active)::before { content: ''; position: absolute; left: 0; top: 10px; bottom: 10px; width: 1px; background: rgba(255, 255, 255, 0.2); }
      &:hover { color: #fff; background: rgba(255, 255, 255, 0.1); }
      &.active { background: #fff; color: #1d1d1f; font-weight: 500; .tag-close { color: #86868b; &:hover { background: #f2f2f7; color: #1d1d1f; } } &::before { display: none; } & + .tag-item::before { display: none; } }
      .tag-close { width: 16px; height: 16px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; transition: all 0.2s; &:hover { background: rgba(0, 0, 0, 0.1); } } } }
  .right-menu { display: flex; align-items: center; gap: 24px; flex-shrink: 0;
    .menu-search-container { width: 240px; :deep(.menu-search-input) { .el-input__wrapper { background-color: rgba(255, 255, 255, 0.1); box-shadow: none !important; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; &:hover, &.is-focus { background-color: rgba(255, 255, 255, 0.15); border-color: rgba(255, 255, 255, 0.4); } } .el-input__inner { color: #fff; font-size: 12px; &::placeholder { color: rgba(255, 255, 255, 0.5); } } .el-input__icon { color: rgba(255, 255, 255, 0.5); } } }
    .action-icons { display: flex; align-items: center; gap: 16px; cursor: pointer; font-size: 18px; color: rgba(255, 255, 255, 0.8); .el-icon:hover { color: #fff; } } } }
.main-container { display: flex; flex: 1; overflow: hidden; position: relative; }
.sidebar-container { width: 60px; background-color: var(--sidebar-bg); display: flex; flex-direction: column; align-items: center; padding-top: 10px; color: var(--sidebar-text); border-right: 1px solid rgba(255, 255, 255, 0.05); flex-shrink: 0; z-index: 100;
  .sidebar-item { width: 100%; height: 64px; margin-bottom: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; position: relative; .el-icon { font-size: 20px; margin-bottom: 2px; } .menu-title { font-size: 12px; opacity: 0.9; } &:hover { color: #fff; background: var(--sidebar-hover); } &.active { color: #fff; background: var(--color-primary); &::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 3px; background: #fff; } } } }
.sub-menu-overlay { position: absolute; top: 0; left: 60px; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.1); z-index: 90; display: flex; align-items: flex-start; padding: 20px 20px 40px 20px; }
.portal-panel { width: fit-content; min-width: 300px; max-width: 880px; max-height: 100%; height: fit-content; background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(20px) saturate(180%); display: flex; flex-direction: column; border-radius: 20px; box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05); padding: 36px 40px; overflow: hidden; box-sizing: border-box;
  .portal-header { margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid rgba(0, 0, 0, 0.04); flex-shrink: 0; .portal-title { font-size: 20px; font-weight: 600; color: #1d1d1f; display: flex; align-items: center; gap: 10px; margin-bottom: 6px; .portal-icon { color: var(--color-primary); font-size: 24px; } } .portal-desc { font-size: 12px; color: #86868b; max-width: 280px; line-height: 1.6; } }
  .portal-grid { column-width: 200px; column-count: auto; column-gap: 40px; max-width: 720px; width: fit-content; flex: 1; overflow-y: auto; padding-right: 10px; scrollbar-gutter: stable; &::-webkit-scrollbar { width: 4px; } &::-webkit-scrollbar-track { background: transparent; } &::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
    .portal-group { break-inside: avoid; display: inline-block; width: 100%; margin-bottom: 32px; .group-caption { font-size: 12px; font-weight: 700; color: #1d1d1f; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; .caption-icon { width: 22px; height: 22px; background: rgba(0, 91, 245, 0.08); color: var(--color-primary); display: flex; align-items: center; justify-content: center; border-radius: 6px; font-size: 13px; } } .group-items { display: flex; flex-direction: column; gap: 1px; } } } }
.portal-item { padding: 7px 12px; margin-left: -12px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: all 0.2s ease; color: #424245;
  .item-label { font-size: 13px; font-weight: 400; line-height: 1.4; } .item-arrow { font-size: 11px; opacity: 0; transform: translateX(-5px); transition: all 0.2s; }
  &:hover { background: rgba(0, 91, 245, 0.05); color: var(--color-primary); .item-arrow { opacity: 1; transform: translateX(0); } }
  &.active { color: var(--color-primary); font-weight: 600; background: rgba(0, 91, 245, 0.08); } }
.staggered-fade-in { opacity: 0; animation: portalSlideIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
@keyframes portalSlideIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
.portal-fade-enter-active, .portal-fade-leave-active { transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); }
.portal-fade-enter-from, .portal-fade-leave-to { opacity: 0; transform: translateX(-20px); }
.search-result-item { display: flex; align-items: center; gap: 8px; .category { color: #909399; font-size: 12px; } .divider-icon { font-size: 10px; color: #c0c4cc; } .title { color: #303133; font-weight: 500; } }
.app-main { flex: 1; background-color: var(--color-bg-page); display: flex; flex-direction: column; overflow: hidden; .view-content { flex: 1; overflow: hidden; } }
</style>
