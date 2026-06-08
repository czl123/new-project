/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, computed } from 'vue';
import { Document, InfoFilled, ArrowRight, CoffeeCup, Management, List, PriceTag, Monitor, Guide, Film, Link, DataAnalysis, QuestionFilled } from '@element-plus/icons-vue';
import TaskDetailDrawer from './TaskDetailDrawer.vue';
const props = defineProps({
    modelValue: Boolean,
    detailData: {
        type: Object,
        default: () => ({})
    }
});
const emit = defineEmits(['update:modelValue']);
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});
const activeTab = ref('tasks');
const finalTabActive = ref('attr');
const historyDialogVisible = ref(false);
const highlightedCode = ref('');
const taskDetailRef = ref();
// 打开任务详情
const handleViewTaskDetail = (row) => {
    taskDetailRef.value?.open(row);
};
// 根据物料编码获取定品规格详情
const getSpecByCode = (code) => {
    return detailData.finalSpecList.find(item => item.materialCode === code) || {};
};
// 快速跳转至定品规格/采购信息并高亮
const jumpToSpec = (code, tabName = 'attr') => {
    highlightedCode.value = code;
    finalTabActive.value = tabName; // 自动切换页签
    const target = document.getElementById('final-spec-section');
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // 3秒后自动取消高亮
    setTimeout(() => {
        highlightedCode.value = '';
    }, 3000);
};
// 表格行高亮逻辑
const tableRowClassName = ({ row }) => {
    if (highlightedCode.value && row.materialCode === highlightedCode.value) {
        return 'highlight-row';
    }
    return '';
};
// 模拟历史轮次数据 (增加多轮次演示)
const historyRecords = reactive([
    {
        round: 'R2',
        endDate: '2026-04-22',
        reason: '样品验证环节不通过：款式细节与品牌定位存在偏差，需重新寻样',
        actors: [
            { name: '王强', result: '样品材质手感偏硬', status: 'closed' },
            { name: '李华', result: '工厂打样周期过长', status: 'closed' }
        ]
    },
    {
        round: 'R1',
        endDate: '2026-04-21',
        reason: '采购承接环节整体不匹配：首轮采购反馈均不匹配需求或单价过高',
        actors: [
            { name: '王强', result: '工厂单价超出预算', status: 'closed' },
            { name: '李华', result: '工厂无法提供ABS+金属复合材质', status: 'closed' },
            { name: '赵敏', result: '样品款式与提案描述不符', status: 'closed' }
        ]
    }
]);
const showHistory = () => {
    historyDialogVisible.value = true;
};
// 模拟详情数据 (根据截图还原)
const detailData = reactive({
    proposalNo: 'TA-202604101',
    productName: 'ZZ-户外牧羊人挂钩',
    status: '待设计',
    category: '运动户外-通用',
    teamLeader: '周亮亮',
    manager: '谢东桥',
    spu: 'US0218',
    style: '防鼠挡板配件',
    material: 'ABS+金属',
    applicableObject: '户外喂鸟器挂钩',
    model: 'RV-HOOK-01',
    productSource: '工厂选品',
    devMethod: '全新品-现货',
    brand: 'Rhino Valley',
    logoPosition: '产品正面激光镭射',
    packagingMethod: 'OPP袋+彩卡',
    listingTimeOps: '2026-05-10',
    listingTimeDev: '2026-05-15',
    marketEst: '预计月均 1500+, 细分 Top 50 占有率 12%',
    usageScenario: '花园挂饰、庭院喂鸟器固定',
    seasonTags: ['春季', '夏季'],
    holidayTags: ['母亲节', '圣诞节'],
    buyQty: 20,
    unitPrice: 7.20,
    totalAmount: 144.00,
    level: 'D',
    sellingPoints: 'Rhino Valley牧羊人挂钩 新品物料号: US250113, 防鼠挡板配件的套装，装一起 做种子链接 补给顾客; 加厚金属杆身，承重可达 20lbs。',
    refLinks: [
        { label: '亚马逊竞品 A', url: 'https://www.amazon.com/dp/B0GH4SLH8B' },
        { label: '亚马逊竞品 B', url: 'https://www.amazon.com/dp/B0DJ789123' }
    ],
    researchFile: '深度调研报告_2026.pdf',
    roiFile: 'ROI利润测算表_V1.xlsx',
    mainMarket: '北美',
    userGroup: '户外园艺爱好者',
    estFinishDate: '2026-05-15',
    // 结项时效数据
    estProposalDate: '2026-05-10',
    estProjectDate: '2026-06-30',
    actProposalDate: '-',
    actProjectDate: '-',
    images: [
        'https://picsum.photos/200/200?random=1',
        'https://picsum.photos/200/200?random=2',
        'https://picsum.photos/200/200?random=3'
    ],
    tasks: [
        {
            no: 'TK2026042001',
            name: '样品采集与外观确认',
            samplingMethod: '1688采买',
            releaseTime: '2026-04-20 10:00',
            feedbackDeadline: '2026-04-22 18:00',
            feedbackCountdown: '18h 25m',
            deadline: '2026-04-25 18:00',
            taskCountdown: '3d 4h',
            user: '杨登峰',
            acceptanceTime: '2026-04-20 10:30',
            status: '进行中',
            priority: 'P0',
            progress: 65,
            remark: '关注ABS材质耐磨性'
        },
        {
            no: 'TK2026041803',
            name: '供应商资质初审',
            samplingMethod: '线下寄样',
            releaseTime: '2026-04-18 09:00',
            feedbackDeadline: '2026-04-19 18:00',
            feedbackCountdown: '-',
            deadline: '2026-04-20 18:00',
            taskCountdown: '-',
            user: '李华',
            acceptanceTime: '2026-04-18 09:15',
            status: '已完成',
            priority: 'P1',
            progress: 100,
            remark: '3家工厂均符合ISO认证'
        },
        {
            no: 'TK2026042105',
            name: '成本利润初步核算',
            samplingMethod: '无需拿样',
            releaseTime: '2026-04-21 14:00',
            feedbackDeadline: '2026-04-22 12:00',
            feedbackCountdown: '1h 10m',
            deadline: '2026-04-24 18:00',
            taskCountdown: '2d 6h',
            user: '周亮亮',
            acceptanceTime: '-',
            status: '待开始',
            priority: 'P2',
            progress: 0,
            remark: '需结合最新海运费报价'
        }
    ],
    finalSpecList: [
        {
            materialCode: 'MT2604-G01',
            brand: 'Rhino Valley', pattern: '复古雕花', color: '经典黑', hasBattery: '否', isCe: '否',
            specs: '标准套装', pkgMethod: 'OPP袋+彩卡', pkgQty: '2 PCS/Box', colorNo: 'BK-001',
            subCategory: '园艺挂钩', logoReplaceable: '是', suggestLogistics: '海运直发',
            firstLogistics: '快船', model: 'RV-HOOK-01', materialDetail: 'ABS+碳钢', multiPackage: '否', packageCount: '1',
            size: '120cm', diameter: '15mm', capacity: '-', unitSize: '120*15*2.5cm', pkgSize: '125*16*5cm', pkgWeight: '1.2kg',
            patentDesc: '外观专利已申请', patentCert: '已上传', patentDate: '2026-01-10', copyrightDesc: '自有版权',
            opsLeader: '谢东桥', copyLevel: 'A', copyReq: '突出防鼠卖点', imgLevel: 'S', imgReq: '渲染3D精修图', refLink: 'https://...',
            points: '防鼠挡板设计、超强承重', shortDesc: '户外牧羊人挂钩-黑色', qualityReq: '表面无划痕、承重测试 10kg'
        },
        {
            materialCode: 'MT2604-G02',
            brand: 'Rhino Valley', pattern: '纯平磨砂', color: '象牙白', hasBattery: '否', isCe: '否',
            specs: '加高版', pkgMethod: '彩盒装', pkgQty: '1 PC/Box', colorNo: 'WH-002',
            subCategory: '园艺挂钩', logoReplaceable: '是', suggestLogistics: '海运直发',
            firstLogistics: '空运', model: 'RV-HOOK-02', materialDetail: '不锈钢+烤漆', multiPackage: '否', packageCount: '1',
            size: '150cm', diameter: '18mm', capacity: '-', unitSize: '150*15*2.5cm', pkgSize: '155*16*5cm', pkgWeight: '1.5kg',
            patentDesc: '-', patentCert: '-', patentDate: '-', copyrightDesc: '公版',
            opsLeader: '谢东桥', copyLevel: 'B', copyReq: '强调极简风格', imgLevel: 'A', imgReq: '实拍图', refLink: 'https://...',
            points: '不锈钢不生锈、安装简单', shortDesc: '户外牧羊人挂钩-白色', qualityReq: '漆面均匀无气泡'
        },
        {
            materialCode: 'MT2604-G03',
            brand: 'Rhino Valley', pattern: '太阳能灯', color: '古铜色', hasBattery: '是', isCe: '是',
            specs: '带灯款', pkgMethod: '电商飞机盒', pkgQty: '4 PCS/Set', colorNo: 'BR-003',
            subCategory: '园艺亮化', logoReplaceable: '否', suggestLogistics: '空运',
            firstLogistics: '空运', model: 'RV-HOOK-LT', materialDetail: '铁艺+玻璃', multiPackage: '是', packageCount: '2',
            size: '110cm', diameter: '12mm', capacity: '600mAh', unitSize: '110*10*10cm', pkgSize: '60*25*15cm', pkgWeight: '2.8kg',
            patentDesc: '实用新型专利', patentCert: '审核中', patentDate: '-', copyrightDesc: '自有版权',
            opsLeader: '周亮亮', copyLevel: 'S', copyReq: '突出智能感应', imgLevel: 'S', imgReq: '夜景氛围视频', refLink: 'https://...',
            points: '自动感应亮灯、复古质感', shortDesc: '太阳能挂钩灯-古铜', qualityReq: 'IP65防水测试、电池容量实测'
        }
    ],
    procurementList: [
        {
            materialCode: 'MT2604-G01', procurement: '杨登峰', priceTaxInc: 7.20, priceTaxExc: 6.37, taxRate: '13%',
            latestPriceInc: 7.15, latestPriceExc: 6.33, moq: 500, moqMemo: '首单试样支持 200pcs', leadTime: '30天',
            estDelivery: '2026-05-20', actDelivery: '-', canInvoice: '是', invoiceUnit: '把',
            invoiceName: '园艺金属挂钩', invoiceSpecs: 'RV-HOOK-01/120cm', customsMaterial: 'ABS塑料+铁'
        },
        {
            materialCode: 'MT2604-G02', procurement: '杨登峰', priceTaxInc: 9.50, priceTaxExc: 8.41, taxRate: '13%',
            latestPriceInc: 9.50, latestPriceExc: 8.41, moq: 300, moqMemo: '起订量较硬', leadTime: '45天',
            estDelivery: '2026-05-25', actDelivery: '-', canInvoice: '是', invoiceUnit: '把',
            invoiceName: '不锈钢挂钩', invoiceSpecs: 'RV-HOOK-02/150cm', customsMaterial: '不锈钢'
        },
        {
            materialCode: 'MT2604-G03', procurement: '李小龙', priceTaxInc: 24.80, priceTaxExc: 21.95, taxRate: '13%',
            latestPriceInc: 24.00, latestPriceExc: 21.24, moq: 1000, moqMemo: '模具分摊费已含', leadTime: '55天',
            estDelivery: '2026-06-10', actDelivery: '-', canInvoice: '是', invoiceUnit: '套',
            invoiceName: '太阳能园艺灯', invoiceSpecs: 'RV-HOOK-LT/4只装', customsMaterial: '铁+玻璃'
        }
    ],
    firstOrderList: [
        {
            materialCode: 'MT2604-G01', procurement: '杨登峰', sourcingDate: '2026-04-20', inquiryDate: '2026-04-22',
            confirmDate: '2026-04-23', reqTeam: '北美A组', requester: '谢东桥', actualQty: 1200,
            changeMemo: '首单增加备货'
        },
        {
            materialCode: 'MT2604-G01', procurement: '杨登峰', sourcingDate: '2026-04-20', inquiryDate: '2026-04-22',
            confirmDate: '2026-04-23', reqTeam: '欧洲B组', requester: '李华', actualQty: 500,
            changeMemo: '同步铺货'
        },
        {
            materialCode: 'MT2604-G02', procurement: '杨登峰', sourcingDate: '2026-04-21', inquiryDate: '2026-04-24',
            confirmDate: '2026-04-25', reqTeam: '日本组', requester: '张三', actualQty: 800,
            changeMemo: '改为白色烤漆'
        },
        {
            materialCode: 'MT2604-G03', procurement: '李小龙', sourcingDate: '2026-04-22', inquiryDate: '2026-04-26',
            confirmDate: '2026-04-28', reqTeam: '东南亚组', requester: '李四', actualQty: 2000,
            changeMemo: '含电池'
        }
    ],
    finalSpecs: []
});
// 计算首单表格单元格合并逻辑
const firstOrderSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
    // 需要合并的列索引：序号(0), 物料编码(1), 采购负责人(2), 首单采集日期(3), 询价完成日期(4)
    // 需求详情中的项(5, 6, 7, 8, 9)不合并
    const mergeIndices = [0, 1, 2, 3, 4];
    if (mergeIndices.includes(columnIndex)) {
        const list = detailData.firstOrderList;
        const currentCode = row.materialCode;
        // 判断当前行是否是该物料的第一行
        if (rowIndex > 0 && list[rowIndex - 1].materialCode === currentCode) {
            return { rowspan: 0, colspan: 0 };
        }
        else {
            // 计算后续有多少行是相同的
            let rows = 1;
            for (let i = rowIndex + 1; i < list.length; i++) {
                if (list[i].materialCode === currentCode) {
                    rows++;
                }
                else {
                    break;
                }
            }
            return { rowspan: rows, colspan: 1 };
        }
    }
};
const getStatusType = (status) => {
    if (status === '已完结')
        return 'success';
    if (status === '待设计')
        return 'danger';
    return 'warning';
};
const getPriorityType = (priority) => {
    const map = { 'P0': 'danger', 'P1': 'warning', 'P2': 'info' };
    return map[priority] || 'info';
};
const getTaskStatusType = (status) => {
    const map = { '已完成': 'success', '进行中': 'primary', '待开始': 'info' };
    return map[status] || 'info';
};
const open = () => {
    visible.value = true;
};
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['p-head']} */ ;
/** @type {__VLS_StyleScopedClasses['p-nodes']} */ ;
/** @type {__VLS_StyleScopedClasses['p-head']} */ ;
/** @type {__VLS_StyleScopedClasses['p-nodes']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['p-nodes']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['p-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['p-name']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['p-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['p-name']} */ ;
/** @type {__VLS_StyleScopedClasses['p-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['card-status-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['current-node']} */ ;
/** @type {__VLS_StyleScopedClasses['card-status-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['current-node']} */ ;
/** @type {__VLS_StyleScopedClasses['card-status-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['card-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['prog-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['processing']} */ ;
/** @type {__VLS_StyleScopedClasses['pending']} */ ;
/** @type {__VLS_StyleScopedClasses['status-text']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['s-label']} */ ;
/** @type {__VLS_StyleScopedClasses['s-value']} */ ;
/** @type {__VLS_StyleScopedClasses['el-table__row']} */ ;
/** @type {__VLS_StyleScopedClasses['el-table__row']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['cd-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent']} */ ;
/** @type {__VLS_StyleScopedClasses['a-name']} */ ;
/** @type {__VLS_StyleScopedClasses['s-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['s-text']} */ ;
/** @type {__VLS_StyleScopedClasses['s-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['s-text']} */ ;
/** @type {__VLS_StyleScopedClasses['s-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['s-text']} */ ;
/** @type {__VLS_StyleScopedClasses['el-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['time-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    title: "提案详情",
    size: "85%",
    ...{ class: "proposal-detail-drawer" },
    destroyOnClose: (true),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    title: "提案详情",
    size: "85%",
    ...{ class: "proposal-detail-drawer" },
    destroyOnClose: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "drawer-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title-area" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "no" },
    });
    (__VLS_ctx.detailData.proposalNo);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "name" },
    });
    (__VLS_ctx.detailData.productName);
    const __VLS_4 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        type: (__VLS_ctx.getStatusType(__VLS_ctx.detailData.status)),
        effect: "dark",
        size: "small",
    }));
    const __VLS_6 = __VLS_5({
        type: (__VLS_ctx.getStatusType(__VLS_ctx.detailData.status)),
        effect: "dark",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    (__VLS_ctx.detailData.status);
    var __VLS_7;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "detail-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-card process-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "title-left" },
});
const __VLS_8 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    type: "warning",
    ...{ class: "header-action-link" },
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    type: "warning",
    ...{ class: "header-action-link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (__VLS_ctx.showHistory)
};
__VLS_11.slots.default;
const __VLS_16 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.History;
/** @type {[typeof __VLS_components.History, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
var __VLS_19;
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "phase-progress-v2" },
});
const __VLS_24 = {}.ElPopover;
/** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    placement: "bottom",
    width: (340),
    trigger: "hover",
    popperClass: "stage-detail-popper",
}));
const __VLS_26 = __VLS_25({
    placement: "bottom",
    width: (340),
    trigger: "hover",
    popperClass: "stage-detail-popper",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
{
    const { reference: __VLS_thisSlot } = __VLS_27.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "phase-node done has-tasks" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-circle-wrap" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-circle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-name" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-nodes" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "popover-task-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pop-header-v2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ph-top" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "ph-title" },
});
const __VLS_28 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    size: "small",
    type: "warning",
    effect: "dark",
    ...{ class: "round-badge" },
}));
const __VLS_30 = __VLS_29({
    size: "small",
    type: "warning",
    effect: "dark",
    ...{ class: "round-badge" },
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
var __VLS_31;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "task-cards-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.handleViewTaskDetail({ name: '创建任务', user: '谢东桥', status: '进行中', priority: 'P1', no: 'TK20260420001', deadline: '2026-04-25', type: '调研' });
        } },
    ...{ class: "actor-card-v2 processing" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-status-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-main" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-top" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "current-node" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "actor-name" },
});
const __VLS_32 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    type: "primary",
    underline: (false),
    ...{ class: "ml-8" },
}));
const __VLS_34 = __VLS_33({
    type: "primary",
    underline: (false),
    ...{ class: "ml-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
var __VLS_35;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mini-graph-steps mt-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item done" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line done" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item done" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line done" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item done" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
var __VLS_27;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "phase-line done" },
});
const __VLS_36 = {}.ElPopover;
/** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    placement: "bottom",
    width: (340),
    trigger: "hover",
    popperClass: "stage-detail-popper",
}));
const __VLS_38 = __VLS_37({
    placement: "bottom",
    width: (340),
    trigger: "hover",
    popperClass: "stage-detail-popper",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
{
    const { reference: __VLS_thisSlot } = __VLS_39.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "phase-node done has-tasks" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-circle-wrap" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-circle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "task-badge" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-name" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-nodes" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "popover-task-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pop-header-v2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ph-top" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "ph-title" },
});
const __VLS_40 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    size: "small",
    type: "warning",
    effect: "dark",
    ...{ class: "round-badge" },
}));
const __VLS_42 = __VLS_41({
    size: "small",
    type: "warning",
    effect: "dark",
    ...{ class: "round-badge" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
var __VLS_43;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "task-cards-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.handleViewTaskDetail({ name: '定制反馈', user: '李华', status: '进行中', priority: 'P0', no: 'TK20260420002', deadline: '2026-04-26', type: '购样' });
        } },
    ...{ class: "actor-card-v2 processing" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-status-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-main" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-top" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "current-node" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "actor-name" },
});
const __VLS_44 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    type: "primary",
    underline: (false),
    ...{ class: "ml-8" },
}));
const __VLS_46 = __VLS_45({
    type: "primary",
    underline: (false),
    ...{ class: "ml-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
var __VLS_47;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mini-graph-steps mt-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item done" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line done" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item active" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.handleViewTaskDetail({ name: '任务承接', user: '赵敏', status: '进行中', priority: 'P1', no: 'TK20260420003', deadline: '2026-04-27', type: '调研' });
        } },
    ...{ class: "actor-card-v2 processing" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-status-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-main" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-top" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "current-node" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "actor-name" },
});
const __VLS_48 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    type: "primary",
    underline: (false),
    ...{ class: "ml-8" },
}));
const __VLS_50 = __VLS_49({
    type: "primary",
    underline: (false),
    ...{ class: "ml-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
var __VLS_51;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mini-graph-steps mt-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item active" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
var __VLS_39;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "phase-line done" },
});
const __VLS_52 = {}.ElPopover;
/** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    placement: "bottom",
    width: (340),
    trigger: "hover",
    popperClass: "stage-detail-popper",
}));
const __VLS_54 = __VLS_53({
    placement: "bottom",
    width: (340),
    trigger: "hover",
    popperClass: "stage-detail-popper",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
{
    const { reference: __VLS_thisSlot } = __VLS_55.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "phase-node active has-tasks" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-circle-wrap" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-circle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "task-badge danger" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-name" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-nodes" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "popover-task-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pop-header-v2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ph-top" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "ph-title" },
});
const __VLS_56 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    size: "small",
    type: "warning",
    effect: "dark",
    ...{ class: "round-badge" },
}));
const __VLS_58 = __VLS_57({
    size: "small",
    type: "warning",
    effect: "dark",
    ...{ class: "round-badge" },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
var __VLS_59;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "task-cards-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.handleViewTaskDetail({ name: '购样申请', user: '王强', status: '进行中', priority: 'P0', no: 'TK20260420004', deadline: '2026-04-28', type: '购样' });
        } },
    ...{ class: "actor-card-v2 advanced" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-status-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-main" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-top" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "current-node" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "actor-name" },
});
const __VLS_60 = {}.ElLink;
/** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    type: "primary",
    underline: (false),
    ...{ class: "ml-8" },
}));
const __VLS_62 = __VLS_61({
    type: "primary",
    underline: (false),
    ...{ class: "ml-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
var __VLS_63;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mini-graph-steps mt-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item done" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line done" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item active" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
var __VLS_55;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "phase-line" },
});
const __VLS_64 = {}.ElPopover;
/** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    placement: "bottom",
    width: (340),
    trigger: "hover",
    popperClass: "stage-detail-popper",
}));
const __VLS_66 = __VLS_65({
    placement: "bottom",
    width: (340),
    trigger: "hover",
    popperClass: "stage-detail-popper",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
{
    const { reference: __VLS_thisSlot } = __VLS_67.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "phase-node wait" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-circle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-name" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-nodes" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "popover-task-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pop-header-v2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ph-top" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "ph-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "task-cards-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actor-card-v2 pending" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-status-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-main" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-top" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "current-node" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mini-graph-steps mt-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
var __VLS_67;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "phase-line" },
});
const __VLS_68 = {}.ElPopover;
/** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    placement: "bottom",
    width: (340),
    trigger: "hover",
    popperClass: "stage-detail-popper",
}));
const __VLS_70 = __VLS_69({
    placement: "bottom",
    width: (340),
    trigger: "hover",
    popperClass: "stage-detail-popper",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
{
    const { reference: __VLS_thisSlot } = __VLS_71.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "phase-node wait" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-circle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-name" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-nodes" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "popover-task-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pop-header-v2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ph-top" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "ph-title" },
});
const __VLS_72 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    size: "small",
    type: "warning",
    effect: "dark",
    ...{ class: "round-badge" },
}));
const __VLS_74 = __VLS_73({
    size: "small",
    type: "warning",
    effect: "dark",
    ...{ class: "round-badge" },
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
var __VLS_75;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "task-cards-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actor-card-v2 pending" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-status-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-main" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-top" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "current-node" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mini-graph-steps mt-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
var __VLS_71;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "phase-line" },
});
const __VLS_76 = {}.ElPopover;
/** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    placement: "bottom",
    width: (400),
    trigger: "hover",
    popperClass: "stage-detail-popper",
}));
const __VLS_78 = __VLS_77({
    placement: "bottom",
    width: (400),
    trigger: "hover",
    popperClass: "stage-detail-popper",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
__VLS_79.slots.default;
{
    const { reference: __VLS_thisSlot } = __VLS_79.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "phase-node wait" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-circle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-name" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-nodes" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "popover-task-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pop-header-v2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ph-top" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "ph-title" },
});
const __VLS_80 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    size: "small",
    type: "warning",
    effect: "dark",
    ...{ class: "round-badge" },
}));
const __VLS_82 = __VLS_81({
    size: "small",
    type: "warning",
    effect: "dark",
    ...{ class: "round-badge" },
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
var __VLS_83;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "task-cards-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actor-card-v2 pending" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-status-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-main" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card-top" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "current-node" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mini-graph-steps mt-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-line" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-item wait" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-dot" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-lab" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "gs-time" },
});
var __VLS_79;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-dashboard" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dash-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "value" },
});
(__VLS_ctx.detailData.totalAmount);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dash-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "value" },
});
(__VLS_ctx.detailData.buyQty);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "unit" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dash-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "value" },
});
(__VLS_ctx.detailData.unitPrice);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dash-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "value-tag" },
    'data-level': (__VLS_ctx.detailData.level),
});
(__VLS_ctx.detailData.level);
const __VLS_84 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    gutter: (16),
}));
const __VLS_86 = __VLS_85({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    span: (24),
}));
const __VLS_90 = __VLS_89({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-section-title" },
});
const __VLS_92 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({}));
const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
const __VLS_96 = {}.Management;
/** @type {[typeof __VLS_components.Management, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({}));
const __VLS_98 = __VLS_97({}, ...__VLS_functionalComponentArgsRest(__VLS_97));
var __VLS_95;
const __VLS_100 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    column: (3),
    border: true,
    size: "small",
    ...{ class: "mb-16" },
}));
const __VLS_102 = __VLS_101({
    column: (3),
    border: true,
    size: "small",
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    label: "运营大类",
}));
const __VLS_106 = __VLS_105({
    label: "运营大类",
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
(__VLS_ctx.detailData.category);
var __VLS_107;
const __VLS_108 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    label: "团队负责人",
}));
const __VLS_110 = __VLS_109({
    label: "团队负责人",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
__VLS_111.slots.default;
(__VLS_ctx.detailData.teamLeader);
var __VLS_111;
const __VLS_112 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    label: "产品经理",
}));
const __VLS_114 = __VLS_113({
    label: "产品经理",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
(__VLS_ctx.detailData.manager);
var __VLS_115;
const __VLS_116 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    label: "上架时间(运营)",
}));
const __VLS_118 = __VLS_117({
    label: "上架时间(运营)",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
(__VLS_ctx.detailData.listingTimeOps);
var __VLS_119;
const __VLS_120 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    label: "上架时间(开发)",
}));
const __VLS_122 = __VLS_121({
    label: "上架时间(开发)",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
(__VLS_ctx.detailData.listingTimeDev);
var __VLS_123;
const __VLS_124 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    label: "-",
}));
const __VLS_126 = __VLS_125({
    label: "-",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
var __VLS_103;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-section-title" },
});
const __VLS_128 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({}));
const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
__VLS_131.slots.default;
const __VLS_132 = {}.List;
/** @type {[typeof __VLS_components.List, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({}));
const __VLS_134 = __VLS_133({}, ...__VLS_functionalComponentArgsRest(__VLS_133));
var __VLS_131;
const __VLS_136 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    column: (3),
    border: true,
    size: "small",
    ...{ class: "mb-16" },
}));
const __VLS_138 = __VLS_137({
    column: (3),
    border: true,
    size: "small",
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
const __VLS_140 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    label: "产品名称",
}));
const __VLS_142 = __VLS_141({
    label: "产品名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
(__VLS_ctx.detailData.productName);
var __VLS_143;
const __VLS_144 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    label: "款式",
}));
const __VLS_146 = __VLS_145({
    label: "款式",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
__VLS_147.slots.default;
(__VLS_ctx.detailData.style);
var __VLS_147;
const __VLS_148 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    label: "主材料",
}));
const __VLS_150 = __VLS_149({
    label: "主材料",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
(__VLS_ctx.detailData.material);
var __VLS_151;
const __VLS_152 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    label: "适用品牌/对象",
}));
const __VLS_154 = __VLS_153({
    label: "适用品牌/对象",
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
(__VLS_ctx.detailData.applicableObject);
var __VLS_155;
const __VLS_156 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    label: "型号",
}));
const __VLS_158 = __VLS_157({
    label: "型号",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
(__VLS_ctx.detailData.model);
var __VLS_159;
const __VLS_160 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
    label: "SPU",
}));
const __VLS_162 = __VLS_161({
    label: "SPU",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
(__VLS_ctx.detailData.spu);
var __VLS_163;
var __VLS_139;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-section-title" },
});
const __VLS_164 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({}));
const __VLS_166 = __VLS_165({}, ...__VLS_functionalComponentArgsRest(__VLS_165));
__VLS_167.slots.default;
const __VLS_168 = {}.PriceTag;
/** @type {[typeof __VLS_components.PriceTag, ]} */ ;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({}));
const __VLS_170 = __VLS_169({}, ...__VLS_functionalComponentArgsRest(__VLS_169));
var __VLS_167;
const __VLS_172 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
    column: (3),
    border: true,
    size: "small",
}));
const __VLS_174 = __VLS_173({
    column: (3),
    border: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_175.slots.default;
const __VLS_176 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    label: "产品来源",
}));
const __VLS_178 = __VLS_177({
    label: "产品来源",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
(__VLS_ctx.detailData.productSource);
var __VLS_179;
const __VLS_180 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
    label: "开发方式",
}));
const __VLS_182 = __VLS_181({
    label: "开发方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
__VLS_183.slots.default;
(__VLS_ctx.detailData.devMethod);
var __VLS_183;
const __VLS_184 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    label: "开发品牌",
}));
const __VLS_186 = __VLS_185({
    label: "开发品牌",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_187.slots.default;
(__VLS_ctx.detailData.brand);
var __VLS_187;
const __VLS_188 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    label: "初始Logo位置",
}));
const __VLS_190 = __VLS_189({
    label: "初始Logo位置",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_191.slots.default;
(__VLS_ctx.detailData.logoPosition);
var __VLS_191;
const __VLS_192 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    label: "初始包装方式",
}));
const __VLS_194 = __VLS_193({
    label: "初始包装方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_195.slots.default;
(__VLS_ctx.detailData.packagingMethod);
var __VLS_195;
const __VLS_196 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    label: "-",
}));
const __VLS_198 = __VLS_197({
    label: "-",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
var __VLS_175;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-card mt-16" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "research-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-section-title" },
});
const __VLS_200 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({}));
const __VLS_202 = __VLS_201({}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
const __VLS_204 = {}.Monitor;
/** @type {[typeof __VLS_components.Monitor, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({}));
const __VLS_206 = __VLS_205({}, ...__VLS_functionalComponentArgsRest(__VLS_205));
var __VLS_203;
const __VLS_208 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    column: (3),
    border: true,
    size: "small",
    ...{ class: "mb-16" },
}));
const __VLS_210 = __VLS_209({
    column: (3),
    border: true,
    size: "small",
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
__VLS_211.slots.default;
const __VLS_212 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
    label: "主攻市场",
}));
const __VLS_214 = __VLS_213({
    label: "主攻市场",
}, ...__VLS_functionalComponentArgsRest(__VLS_213));
__VLS_215.slots.default;
(__VLS_ctx.detailData.mainMarket);
var __VLS_215;
const __VLS_216 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
    label: "使用人群",
    span: (2),
}));
const __VLS_218 = __VLS_217({
    label: "使用人群",
    span: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
(__VLS_ctx.detailData.userGroup);
var __VLS_219;
const __VLS_220 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
    label: "市场预估",
    span: (3),
}));
const __VLS_222 = __VLS_221({
    label: "市场预估",
    span: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
__VLS_223.slots.default;
(__VLS_ctx.detailData.marketEst);
var __VLS_223;
var __VLS_211;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-section-title" },
});
const __VLS_224 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({}));
const __VLS_226 = __VLS_225({}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
const __VLS_228 = {}.Guide;
/** @type {[typeof __VLS_components.Guide, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({}));
const __VLS_230 = __VLS_229({}, ...__VLS_functionalComponentArgsRest(__VLS_229));
var __VLS_227;
const __VLS_232 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    column: (3),
    border: true,
    size: "small",
    ...{ class: "mb-16" },
}));
const __VLS_234 = __VLS_233({
    column: (3),
    border: true,
    size: "small",
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
__VLS_235.slots.default;
const __VLS_236 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    label: "使用场景",
}));
const __VLS_238 = __VLS_237({
    label: "使用场景",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
(__VLS_ctx.detailData.usageScenario);
var __VLS_239;
const __VLS_240 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    label: "季节标签",
}));
const __VLS_242 = __VLS_241({
    label: "季节标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
__VLS_243.slots.default;
for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.detailData.seasonTags))) {
    const __VLS_244 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
        key: (tag),
        size: "small",
        ...{ class: "mr-4" },
    }));
    const __VLS_246 = __VLS_245({
        key: (tag),
        size: "small",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    __VLS_247.slots.default;
    (tag);
    var __VLS_247;
}
var __VLS_243;
const __VLS_248 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    label: "节日标签",
}));
const __VLS_250 = __VLS_249({
    label: "节日标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.detailData.holidayTags))) {
    const __VLS_252 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        key: (tag),
        size: "small",
        type: "success",
        ...{ class: "mr-4" },
    }));
    const __VLS_254 = __VLS_253({
        key: (tag),
        size: "small",
        type: "success",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    __VLS_255.slots.default;
    (tag);
    var __VLS_255;
}
var __VLS_251;
var __VLS_235;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-section-title" },
});
const __VLS_256 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({}));
const __VLS_258 = __VLS_257({}, ...__VLS_functionalComponentArgsRest(__VLS_257));
__VLS_259.slots.default;
const __VLS_260 = {}.Film;
/** @type {[typeof __VLS_components.Film, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({}));
const __VLS_262 = __VLS_261({}, ...__VLS_functionalComponentArgsRest(__VLS_261));
var __VLS_259;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-block mb-16" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "content-text" },
});
(__VLS_ctx.detailData.sellingPoints);
const __VLS_264 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
    gutter: (24),
}));
const __VLS_266 = __VLS_265({
    gutter: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
__VLS_267.slots.default;
const __VLS_268 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    span: (12),
}));
const __VLS_270 = __VLS_269({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
__VLS_271.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "link-block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "multi-links mt-8" },
});
for (const [link, idx] of __VLS_getVForSourceType((__VLS_ctx.detailData.refLinks))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (idx),
        ...{ class: "link-item" },
    });
    const __VLS_272 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({}));
    const __VLS_274 = __VLS_273({}, ...__VLS_functionalComponentArgsRest(__VLS_273));
    __VLS_275.slots.default;
    const __VLS_276 = {}.Link;
    /** @type {[typeof __VLS_components.Link, ]} */ ;
    // @ts-ignore
    const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({}));
    const __VLS_278 = __VLS_277({}, ...__VLS_functionalComponentArgsRest(__VLS_277));
    var __VLS_275;
    const __VLS_280 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
        type: "primary",
        href: (link.url),
        target: "_blank",
    }));
    const __VLS_282 = __VLS_281({
        type: "primary",
        href: (link.url),
        target: "_blank",
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    __VLS_283.slots.default;
    (link.label);
    var __VLS_283;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "file-block mt-16" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-8 flex-wrap" },
});
const __VLS_284 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
    size: "small",
    ...{ class: "file-tag mr-8 mb-4" },
}));
const __VLS_286 = __VLS_285({
    size: "small",
    ...{ class: "file-tag mr-8 mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_285));
__VLS_287.slots.default;
const __VLS_288 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({}));
const __VLS_290 = __VLS_289({}, ...__VLS_functionalComponentArgsRest(__VLS_289));
__VLS_291.slots.default;
const __VLS_292 = {}.Document;
/** @type {[typeof __VLS_components.Document, ]} */ ;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({}));
const __VLS_294 = __VLS_293({}, ...__VLS_functionalComponentArgsRest(__VLS_293));
var __VLS_291;
(__VLS_ctx.detailData.researchFile);
var __VLS_287;
const __VLS_296 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
    size: "small",
    ...{ class: "file-tag roi-tag mb-4" },
}));
const __VLS_298 = __VLS_297({
    size: "small",
    ...{ class: "file-tag roi-tag mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_297));
__VLS_299.slots.default;
const __VLS_300 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({}));
const __VLS_302 = __VLS_301({}, ...__VLS_functionalComponentArgsRest(__VLS_301));
__VLS_303.slots.default;
const __VLS_304 = {}.DataAnalysis;
/** @type {[typeof __VLS_components.DataAnalysis, ]} */ ;
// @ts-ignore
const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({}));
const __VLS_306 = __VLS_305({}, ...__VLS_functionalComponentArgsRest(__VLS_305));
var __VLS_303;
(__VLS_ctx.detailData.roiFile);
var __VLS_299;
var __VLS_271;
const __VLS_308 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
    span: (12),
}));
const __VLS_310 = __VLS_309({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
__VLS_311.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "image-gallery" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-label mb-8" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "img-list" },
});
for (const [img, idx] of __VLS_getVForSourceType((__VLS_ctx.detailData.images))) {
    const __VLS_312 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
        key: (idx),
        src: (img),
        previewSrcList: (__VLS_ctx.detailData.images),
        fit: "cover",
        ...{ class: "gallery-item" },
    }));
    const __VLS_314 = __VLS_313({
        key: (idx),
        src: (img),
        previewSrcList: (__VLS_ctx.detailData.images),
        fit: "cover",
        ...{ class: "gallery-item" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_313));
}
var __VLS_311;
var __VLS_267;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-card mt-16 task-section-v3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
const __VLS_316 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
    data: (__VLS_ctx.detailData.tasks),
    size: "small",
    stripe: true,
    ...{ class: "modern-task-table" },
}));
const __VLS_318 = __VLS_317({
    data: (__VLS_ctx.detailData.tasks),
    size: "small",
    stripe: true,
    ...{ class: "modern-task-table" },
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
__VLS_319.slots.default;
const __VLS_320 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
    type: "index",
    label: "#",
    width: "40",
    align: "center",
}));
const __VLS_322 = __VLS_321({
    type: "index",
    label: "#",
    width: "40",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_321));
const __VLS_324 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
    label: "任务信息",
    minWidth: "220",
}));
const __VLS_326 = __VLS_325({
    label: "任务信息",
    minWidth: "220",
}, ...__VLS_functionalComponentArgsRest(__VLS_325));
__VLS_327.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_327.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "task-info-v3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "t-name-wrap" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-name" },
    });
    (row.name);
    const __VLS_328 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
        size: "mini",
        type: (__VLS_ctx.getPriorityType(row.priority)),
        effect: "dark",
        ...{ class: "priority-dot" },
    }));
    const __VLS_330 = __VLS_329({
        size: "mini",
        type: (__VLS_ctx.getPriorityType(row.priority)),
        effect: "dark",
        ...{ class: "priority-dot" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_329));
    __VLS_331.slots.default;
    (row.priority);
    var __VLS_331;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "t-sub-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-no" },
    });
    (row.no);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "divider" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-method" },
    });
    const __VLS_332 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({}));
    const __VLS_334 = __VLS_333({}, ...__VLS_functionalComponentArgsRest(__VLS_333));
    __VLS_335.slots.default;
    const __VLS_336 = {}.CoffeeCup;
    /** @type {[typeof __VLS_components.CoffeeCup, ]} */ ;
    // @ts-ignore
    const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({}));
    const __VLS_338 = __VLS_337({}, ...__VLS_functionalComponentArgsRest(__VLS_337));
    var __VLS_335;
    (row.samplingMethod);
}
var __VLS_327;
const __VLS_340 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
    label: "发布时间",
    width: "140",
    align: "center",
}));
const __VLS_342 = __VLS_341({
    label: "发布时间",
    width: "140",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_341));
__VLS_343.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_343.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "release-time-v3" },
    });
    (row.releaseTime);
}
var __VLS_343;
const __VLS_344 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
    width: "170",
}));
const __VLS_346 = __VLS_345({
    width: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_345));
__VLS_347.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_347.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-with-hint" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_348 = {}.ElTooltip;
    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
        content: "此为采购反馈截止时间",
        placement: "top",
    }));
    const __VLS_350 = __VLS_349({
        content: "此为采购反馈截止时间",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_349));
    __VLS_351.slots.default;
    const __VLS_352 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
        ...{ class: "header-hint-icon" },
    }));
    const __VLS_354 = __VLS_353({
        ...{ class: "header-hint-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_353));
    __VLS_355.slots.default;
    const __VLS_356 = {}.QuestionFilled;
    /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
    // @ts-ignore
    const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({}));
    const __VLS_358 = __VLS_357({}, ...__VLS_functionalComponentArgsRest(__VLS_357));
    var __VLS_355;
    var __VLS_351;
}
{
    const { default: __VLS_thisSlot } = __VLS_347.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "deadline-group-v3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-time" },
    });
    (row.feedbackDeadline);
    if (row.status !== '已完成' && row.feedbackCountdown !== '-') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-countdown" },
            ...{ class: ({ 'urgent': row.feedbackCountdown.includes('h') }) },
        });
        (row.feedbackCountdown);
    }
    else if (row.status === '已完成') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-done" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-done" },
        });
    }
}
var __VLS_347;
const __VLS_360 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
    label: "任务截止/倒计时",
    width: "170",
}));
const __VLS_362 = __VLS_361({
    label: "任务截止/倒计时",
    width: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_361));
__VLS_363.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_363.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "deadline-group-v3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "d-time" },
    });
    (row.deadline);
    if (row.status !== '已完成' && row.taskCountdown !== '-') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-countdown" },
        });
        (row.taskCountdown);
    }
    else if (row.status === '已完成') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-done" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "d-done" },
        });
    }
}
var __VLS_363;
const __VLS_364 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
    label: "承接详情",
    width: "160",
}));
const __VLS_366 = __VLS_365({
    label: "承接详情",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_365));
__VLS_367.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_367.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "assignee-info-v3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "a-user" },
    });
    const __VLS_368 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
        size: (20),
        ...{ class: "a-avatar" },
    }));
    const __VLS_370 = __VLS_369({
        size: (20),
        ...{ class: "a-avatar" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_369));
    __VLS_371.slots.default;
    (row.user.charAt(0));
    var __VLS_371;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "a-name" },
    });
    (row.user);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "a-time" },
    });
    (row.acceptanceTime === '-' ? '未承接' : row.acceptanceTime);
}
var __VLS_367;
const __VLS_372 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
    label: "状态",
    width: "90",
    align: "center",
}));
const __VLS_374 = __VLS_373({
    label: "状态",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_373));
__VLS_375.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_375.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "status-indicator" },
        ...{ class: (row.status) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "s-dot" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "s-text" },
    });
    (row.status);
}
var __VLS_375;
const __VLS_376 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
    label: "操作",
    width: "70",
    align: "center",
    fixed: "right",
}));
const __VLS_378 = __VLS_377({
    label: "操作",
    width: "70",
    align: "center",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_377));
__VLS_379.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_379.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_380 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        ...{ class: "btn-detail-v3" },
    }));
    const __VLS_382 = __VLS_381({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        ...{ class: "btn-detail-v3" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_381));
    let __VLS_384;
    let __VLS_385;
    let __VLS_386;
    const __VLS_387 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleViewTaskDetail(row);
        }
    };
    __VLS_383.slots.default;
    const __VLS_388 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
        ...{ class: "el-icon--right" },
    }));
    const __VLS_390 = __VLS_389({
        ...{ class: "el-icon--right" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_389));
    __VLS_391.slots.default;
    const __VLS_392 = {}.ArrowRight;
    /** @type {[typeof __VLS_components.ArrowRight, ]} */ ;
    // @ts-ignore
    const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({}));
    const __VLS_394 = __VLS_393({}, ...__VLS_functionalComponentArgsRest(__VLS_393));
    var __VLS_391;
    var __VLS_383;
}
var __VLS_379;
var __VLS_319;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-card mt-16" },
    id: "final-spec-section",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
const __VLS_396 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({
    modelValue: (__VLS_ctx.finalTabActive),
    ...{ class: "inner-tabs" },
}));
const __VLS_398 = __VLS_397({
    modelValue: (__VLS_ctx.finalTabActive),
    ...{ class: "inner-tabs" },
}, ...__VLS_functionalComponentArgsRest(__VLS_397));
__VLS_399.slots.default;
const __VLS_400 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
    label: "属性信息",
    name: "attr",
}));
const __VLS_402 = __VLS_401({
    label: "属性信息",
    name: "attr",
}, ...__VLS_functionalComponentArgsRest(__VLS_401));
__VLS_403.slots.default;
const __VLS_404 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({
    data: (__VLS_ctx.detailData.finalSpecList),
    size: "small",
    border: true,
    ...{ class: "business-spec-table" },
    ...{ style: {} },
    rowClassName: (__VLS_ctx.tableRowClassName),
}));
const __VLS_406 = __VLS_405({
    data: (__VLS_ctx.detailData.finalSpecList),
    size: "small",
    border: true,
    ...{ class: "business-spec-table" },
    ...{ style: {} },
    rowClassName: (__VLS_ctx.tableRowClassName),
}, ...__VLS_functionalComponentArgsRest(__VLS_405));
__VLS_407.slots.default;
const __VLS_408 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({
    prop: "materialCode",
    label: "物料编码",
    width: "120",
    fixed: true,
}));
const __VLS_410 = __VLS_409({
    prop: "materialCode",
    label: "物料编码",
    width: "120",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_409));
const __VLS_412 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
    label: "基本属性",
    headerAlign: "center",
    labelClassName: "h-basic",
}));
const __VLS_414 = __VLS_413({
    label: "基本属性",
    headerAlign: "center",
    labelClassName: "h-basic",
}, ...__VLS_functionalComponentArgsRest(__VLS_413));
__VLS_415.slots.default;
const __VLS_416 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_417 = __VLS_asFunctionalComponent(__VLS_416, new __VLS_416({
    prop: "brand",
    width: "100",
}));
const __VLS_418 = __VLS_417({
    prop: "brand",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_417));
__VLS_419.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_419.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_419;
const __VLS_420 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({
    prop: "pattern",
    width: "100",
}));
const __VLS_422 = __VLS_421({
    prop: "pattern",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_421));
__VLS_423.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_423.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_423;
const __VLS_424 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_425 = __VLS_asFunctionalComponent(__VLS_424, new __VLS_424({
    prop: "color",
    width: "90",
}));
const __VLS_426 = __VLS_425({
    prop: "color",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_425));
__VLS_427.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_427.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_427;
const __VLS_428 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_429 = __VLS_asFunctionalComponent(__VLS_428, new __VLS_428({
    prop: "hasBattery",
    width: "80",
}));
const __VLS_430 = __VLS_429({
    prop: "hasBattery",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_429));
__VLS_431.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_431.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_431;
const __VLS_432 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_433 = __VLS_asFunctionalComponent(__VLS_432, new __VLS_432({
    prop: "isCe",
    width: "80",
}));
const __VLS_434 = __VLS_433({
    prop: "isCe",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_433));
__VLS_435.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_435.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_435;
const __VLS_436 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_437 = __VLS_asFunctionalComponent(__VLS_436, new __VLS_436({
    prop: "specs",
    width: "90",
}));
const __VLS_438 = __VLS_437({
    prop: "specs",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_437));
__VLS_439.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_439.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_439;
const __VLS_440 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_441 = __VLS_asFunctionalComponent(__VLS_440, new __VLS_440({
    prop: "pkgMethod",
    width: "110",
}));
const __VLS_442 = __VLS_441({
    prop: "pkgMethod",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_441));
__VLS_443.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_443.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_443;
const __VLS_444 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({
    prop: "pkgQty",
    width: "90",
}));
const __VLS_446 = __VLS_445({
    prop: "pkgQty",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_445));
__VLS_447.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_447.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_447;
const __VLS_448 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({
    prop: "colorNo",
    width: "80",
}));
const __VLS_450 = __VLS_449({
    prop: "colorNo",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_449));
__VLS_451.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_451.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_451;
const __VLS_452 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_453 = __VLS_asFunctionalComponent(__VLS_452, new __VLS_452({
    prop: "subCategory",
    width: "100",
}));
const __VLS_454 = __VLS_453({
    prop: "subCategory",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_453));
__VLS_455.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_455.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_455;
const __VLS_456 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({
    prop: "logoReplaceable",
    width: "100",
}));
const __VLS_458 = __VLS_457({
    prop: "logoReplaceable",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_457));
__VLS_459.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_459.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_459;
const __VLS_460 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_461 = __VLS_asFunctionalComponent(__VLS_460, new __VLS_460({
    prop: "suggestLogistics",
    width: "110",
}));
const __VLS_462 = __VLS_461({
    prop: "suggestLogistics",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_461));
__VLS_463.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_463.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_463;
const __VLS_464 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_465 = __VLS_asFunctionalComponent(__VLS_464, new __VLS_464({
    prop: "firstLogistics",
    width: "110",
}));
const __VLS_466 = __VLS_465({
    prop: "firstLogistics",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_465));
__VLS_467.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_467.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_467;
const __VLS_468 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_469 = __VLS_asFunctionalComponent(__VLS_468, new __VLS_468({
    prop: "model",
    width: "110",
}));
const __VLS_470 = __VLS_469({
    prop: "model",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_469));
__VLS_471.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_471.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_471;
const __VLS_472 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_473 = __VLS_asFunctionalComponent(__VLS_472, new __VLS_472({
    prop: "materialDetail",
    width: "120",
    showOverflowTooltip: true,
}));
const __VLS_474 = __VLS_473({
    prop: "materialDetail",
    width: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_473));
__VLS_475.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_475.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_475;
const __VLS_476 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_477 = __VLS_asFunctionalComponent(__VLS_476, new __VLS_476({
    prop: "multiPackage",
    width: "80",
}));
const __VLS_478 = __VLS_477({
    prop: "multiPackage",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_477));
__VLS_479.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_479.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_479;
const __VLS_480 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_481 = __VLS_asFunctionalComponent(__VLS_480, new __VLS_480({
    prop: "packageCount",
    width: "80",
}));
const __VLS_482 = __VLS_481({
    prop: "packageCount",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_481));
__VLS_483.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_483.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_483;
var __VLS_415;
const __VLS_484 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_485 = __VLS_asFunctionalComponent(__VLS_484, new __VLS_484({
    label: "规格参数",
    headerAlign: "center",
    labelClassName: "h-params",
}));
const __VLS_486 = __VLS_485({
    label: "规格参数",
    headerAlign: "center",
    labelClassName: "h-params",
}, ...__VLS_functionalComponentArgsRest(__VLS_485));
__VLS_487.slots.default;
const __VLS_488 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_489 = __VLS_asFunctionalComponent(__VLS_488, new __VLS_488({
    prop: "size",
    width: "80",
}));
const __VLS_490 = __VLS_489({
    prop: "size",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_489));
__VLS_491.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_491.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "req-star" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_491;
const __VLS_492 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_493 = __VLS_asFunctionalComponent(__VLS_492, new __VLS_492({
    prop: "diameter",
    width: "80",
}));
const __VLS_494 = __VLS_493({
    prop: "diameter",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_493));
__VLS_495.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_495.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "req-star" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_495;
const __VLS_496 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_497 = __VLS_asFunctionalComponent(__VLS_496, new __VLS_496({
    prop: "capacity",
    width: "80",
}));
const __VLS_498 = __VLS_497({
    prop: "capacity",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_497));
__VLS_499.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_499.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_499;
const __VLS_500 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_501 = __VLS_asFunctionalComponent(__VLS_500, new __VLS_500({
    prop: "unitSize",
    width: "100",
}));
const __VLS_502 = __VLS_501({
    prop: "unitSize",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_501));
__VLS_503.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_503.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_503;
const __VLS_504 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_505 = __VLS_asFunctionalComponent(__VLS_504, new __VLS_504({
    prop: "pkgSize",
    width: "100",
}));
const __VLS_506 = __VLS_505({
    prop: "pkgSize",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_505));
__VLS_507.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_507.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_507;
const __VLS_508 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_509 = __VLS_asFunctionalComponent(__VLS_508, new __VLS_508({
    prop: "pkgWeight",
    width: "90",
}));
const __VLS_510 = __VLS_509({
    prop: "pkgWeight",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_509));
__VLS_511.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_511.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_511;
var __VLS_487;
const __VLS_512 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_513 = __VLS_asFunctionalComponent(__VLS_512, new __VLS_512({
    label: "知识产权信息",
    headerAlign: "center",
    labelClassName: "h-ip",
}));
const __VLS_514 = __VLS_513({
    label: "知识产权信息",
    headerAlign: "center",
    labelClassName: "h-ip",
}, ...__VLS_functionalComponentArgsRest(__VLS_513));
__VLS_515.slots.default;
const __VLS_516 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_517 = __VLS_asFunctionalComponent(__VLS_516, new __VLS_516({
    prop: "patentDesc",
    width: "120",
}));
const __VLS_518 = __VLS_517({
    prop: "patentDesc",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_517));
__VLS_519.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_519.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-ip" },
    });
}
var __VLS_519;
const __VLS_520 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_521 = __VLS_asFunctionalComponent(__VLS_520, new __VLS_520({
    prop: "patentCert",
    width: "100",
}));
const __VLS_522 = __VLS_521({
    prop: "patentCert",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_521));
__VLS_523.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_523.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-ip" },
    });
}
var __VLS_523;
const __VLS_524 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_525 = __VLS_asFunctionalComponent(__VLS_524, new __VLS_524({
    prop: "patentDate",
    width: "100",
}));
const __VLS_526 = __VLS_525({
    prop: "patentDate",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_525));
__VLS_527.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_527.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-ip" },
    });
}
var __VLS_527;
const __VLS_528 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_529 = __VLS_asFunctionalComponent(__VLS_528, new __VLS_528({
    prop: "copyrightDesc",
    width: "120",
}));
const __VLS_530 = __VLS_529({
    prop: "copyrightDesc",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_529));
__VLS_531.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_531.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-ip" },
    });
}
var __VLS_531;
var __VLS_515;
const __VLS_532 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_533 = __VLS_asFunctionalComponent(__VLS_532, new __VLS_532({
    label: "营销卖点设计",
    headerAlign: "center",
    labelClassName: "h-marketing",
}));
const __VLS_534 = __VLS_533({
    label: "营销卖点设计",
    headerAlign: "center",
    labelClassName: "h-marketing",
}, ...__VLS_functionalComponentArgsRest(__VLS_533));
__VLS_535.slots.default;
const __VLS_536 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_537 = __VLS_asFunctionalComponent(__VLS_536, new __VLS_536({
    prop: "opsLeader",
    width: "90",
}));
const __VLS_538 = __VLS_537({
    prop: "opsLeader",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_537));
__VLS_539.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_539.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-marketing" },
    });
}
var __VLS_539;
const __VLS_540 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_541 = __VLS_asFunctionalComponent(__VLS_540, new __VLS_540({
    prop: "copyLevel",
    width: "80",
}));
const __VLS_542 = __VLS_541({
    prop: "copyLevel",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_541));
__VLS_543.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_543.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-marketing" },
    });
}
var __VLS_543;
const __VLS_544 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_545 = __VLS_asFunctionalComponent(__VLS_544, new __VLS_544({
    prop: "copyReq",
    width: "120",
}));
const __VLS_546 = __VLS_545({
    prop: "copyReq",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_545));
__VLS_547.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_547.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-marketing" },
    });
}
var __VLS_547;
const __VLS_548 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_549 = __VLS_asFunctionalComponent(__VLS_548, new __VLS_548({
    prop: "imgLevel",
    width: "80",
}));
const __VLS_550 = __VLS_549({
    prop: "imgLevel",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_549));
__VLS_551.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_551.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-marketing" },
    });
}
var __VLS_551;
const __VLS_552 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_553 = __VLS_asFunctionalComponent(__VLS_552, new __VLS_552({
    prop: "imgReq",
    width: "120",
}));
const __VLS_554 = __VLS_553({
    prop: "imgReq",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_553));
__VLS_555.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_555.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-marketing" },
    });
}
var __VLS_555;
const __VLS_556 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_557 = __VLS_asFunctionalComponent(__VLS_556, new __VLS_556({
    prop: "refLink",
    width: "120",
    showOverflowTooltip: true,
}));
const __VLS_558 = __VLS_557({
    prop: "refLink",
    width: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_557));
__VLS_559.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_559.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-marketing" },
    });
}
var __VLS_559;
var __VLS_535;
const __VLS_560 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_561 = __VLS_asFunctionalComponent(__VLS_560, new __VLS_560({
    label: "营销核心卖点",
    headerAlign: "center",
    labelClassName: "h-core",
}));
const __VLS_562 = __VLS_561({
    label: "营销核心卖点",
    headerAlign: "center",
    labelClassName: "h-core",
}, ...__VLS_functionalComponentArgsRest(__VLS_561));
__VLS_563.slots.default;
const __VLS_564 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_565 = __VLS_asFunctionalComponent(__VLS_564, new __VLS_564({
    prop: "points",
    width: "180",
    showOverflowTooltip: true,
}));
const __VLS_566 = __VLS_565({
    prop: "points",
    width: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_565));
__VLS_567.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_567.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-core" },
    });
}
var __VLS_567;
var __VLS_563;
const __VLS_568 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_569 = __VLS_asFunctionalComponent(__VLS_568, new __VLS_568({
    label: "仓储识别标识",
    headerAlign: "center",
    labelClassName: "h-storage",
}));
const __VLS_570 = __VLS_569({
    label: "仓储识别标识",
    headerAlign: "center",
    labelClassName: "h-storage",
}, ...__VLS_functionalComponentArgsRest(__VLS_569));
__VLS_571.slots.default;
const __VLS_572 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_573 = __VLS_asFunctionalComponent(__VLS_572, new __VLS_572({
    prop: "shortDesc",
    width: "180",
    showOverflowTooltip: true,
}));
const __VLS_574 = __VLS_573({
    prop: "shortDesc",
    width: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_573));
__VLS_575.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_575.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-storage" },
    });
}
var __VLS_575;
var __VLS_571;
const __VLS_576 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_577 = __VLS_asFunctionalComponent(__VLS_576, new __VLS_576({
    label: "质量与生产要求",
    headerAlign: "center",
    labelClassName: "h-quality",
}));
const __VLS_578 = __VLS_577({
    label: "质量与生产要求",
    headerAlign: "center",
    labelClassName: "h-quality",
}, ...__VLS_functionalComponentArgsRest(__VLS_577));
__VLS_579.slots.default;
const __VLS_580 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_581 = __VLS_asFunctionalComponent(__VLS_580, new __VLS_580({
    prop: "qualityReq",
    width: "180",
    showOverflowTooltip: true,
}));
const __VLS_582 = __VLS_581({
    prop: "qualityReq",
    width: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_581));
__VLS_583.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_583.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-quality" },
    });
}
var __VLS_583;
var __VLS_579;
var __VLS_407;
var __VLS_403;
const __VLS_584 = {}.ElTabPane;
/** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
// @ts-ignore
const __VLS_585 = __VLS_asFunctionalComponent(__VLS_584, new __VLS_584({
    label: "采购信息",
    name: "design",
}));
const __VLS_586 = __VLS_585({
    label: "采购信息",
    name: "design",
}, ...__VLS_functionalComponentArgsRest(__VLS_585));
__VLS_587.slots.default;
const __VLS_588 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_589 = __VLS_asFunctionalComponent(__VLS_588, new __VLS_588({
    data: (__VLS_ctx.detailData.procurementList),
    size: "small",
    border: true,
    stripe: true,
    ...{ style: {} },
    ...{ class: "business-spec-table" },
    rowClassName: (__VLS_ctx.tableRowClassName),
}));
const __VLS_590 = __VLS_589({
    data: (__VLS_ctx.detailData.procurementList),
    size: "small",
    border: true,
    stripe: true,
    ...{ style: {} },
    ...{ class: "business-spec-table" },
    rowClassName: (__VLS_ctx.tableRowClassName),
}, ...__VLS_functionalComponentArgsRest(__VLS_589));
__VLS_591.slots.default;
const __VLS_592 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_593 = __VLS_asFunctionalComponent(__VLS_592, new __VLS_592({
    prop: "materialCode",
    label: "物料编码",
    width: "120",
    fixed: true,
}));
const __VLS_594 = __VLS_593({
    prop: "materialCode",
    label: "物料编码",
    width: "120",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_593));
const __VLS_596 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_597 = __VLS_asFunctionalComponent(__VLS_596, new __VLS_596({
    label: "基础项",
    headerAlign: "center",
    labelClassName: "h-basic",
}));
const __VLS_598 = __VLS_597({
    label: "基础项",
    headerAlign: "center",
    labelClassName: "h-basic",
}, ...__VLS_functionalComponentArgsRest(__VLS_597));
__VLS_599.slots.default;
const __VLS_600 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_601 = __VLS_asFunctionalComponent(__VLS_600, new __VLS_600({
    prop: "procurement",
    width: "100",
}));
const __VLS_602 = __VLS_601({
    prop: "procurement",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_601));
__VLS_603.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_603.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_603;
var __VLS_599;
const __VLS_604 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_605 = __VLS_asFunctionalComponent(__VLS_604, new __VLS_604({
    label: "成本与税项",
    headerAlign: "center",
    labelClassName: "h-ip",
}));
const __VLS_606 = __VLS_605({
    label: "成本与税项",
    headerAlign: "center",
    labelClassName: "h-ip",
}, ...__VLS_functionalComponentArgsRest(__VLS_605));
__VLS_607.slots.default;
const __VLS_608 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_609 = __VLS_asFunctionalComponent(__VLS_608, new __VLS_608({
    prop: "priceTaxInc",
    width: "100",
}));
const __VLS_610 = __VLS_609({
    prop: "priceTaxInc",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_609));
__VLS_611.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_611.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-ip" },
    });
}
var __VLS_611;
const __VLS_612 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_613 = __VLS_asFunctionalComponent(__VLS_612, new __VLS_612({
    prop: "priceTaxExc",
    width: "110",
}));
const __VLS_614 = __VLS_613({
    prop: "priceTaxExc",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_613));
__VLS_615.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_615.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-ip" },
    });
}
var __VLS_615;
const __VLS_616 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_617 = __VLS_asFunctionalComponent(__VLS_616, new __VLS_616({
    prop: "taxRate",
    width: "70",
}));
const __VLS_618 = __VLS_617({
    prop: "taxRate",
    width: "70",
}, ...__VLS_functionalComponentArgsRest(__VLS_617));
__VLS_619.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_619.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-ip" },
    });
}
var __VLS_619;
const __VLS_620 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_621 = __VLS_asFunctionalComponent(__VLS_620, new __VLS_620({
    prop: "latestPriceInc",
    width: "140",
}));
const __VLS_622 = __VLS_621({
    prop: "latestPriceInc",
    width: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_621));
__VLS_623.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_623.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-ip" },
    });
}
var __VLS_623;
const __VLS_624 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_625 = __VLS_asFunctionalComponent(__VLS_624, new __VLS_624({
    prop: "latestPriceExc",
    width: "150",
}));
const __VLS_626 = __VLS_625({
    prop: "latestPriceExc",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_625));
__VLS_627.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_627.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-ip" },
    });
}
var __VLS_627;
var __VLS_607;
const __VLS_628 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_629 = __VLS_asFunctionalComponent(__VLS_628, new __VLS_628({
    label: "订购与周期",
    headerAlign: "center",
    labelClassName: "h-marketing",
}));
const __VLS_630 = __VLS_629({
    label: "订购与周期",
    headerAlign: "center",
    labelClassName: "h-marketing",
}, ...__VLS_functionalComponentArgsRest(__VLS_629));
__VLS_631.slots.default;
const __VLS_632 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_633 = __VLS_asFunctionalComponent(__VLS_632, new __VLS_632({
    prop: "moq",
    width: "100",
}));
const __VLS_634 = __VLS_633({
    prop: "moq",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_633));
__VLS_635.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_635.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-marketing" },
    });
}
var __VLS_635;
const __VLS_636 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_637 = __VLS_asFunctionalComponent(__VLS_636, new __VLS_636({
    prop: "moqMemo",
    width: "150",
    showOverflowTooltip: true,
}));
const __VLS_638 = __VLS_637({
    prop: "moqMemo",
    width: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_637));
__VLS_639.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_639.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-marketing" },
    });
}
var __VLS_639;
const __VLS_640 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_641 = __VLS_asFunctionalComponent(__VLS_640, new __VLS_640({
    prop: "leadTime",
    width: "100",
}));
const __VLS_642 = __VLS_641({
    prop: "leadTime",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_641));
__VLS_643.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_643.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-marketing" },
    });
}
var __VLS_643;
var __VLS_631;
const __VLS_644 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_645 = __VLS_asFunctionalComponent(__VLS_644, new __VLS_644({
    label: "交付进度",
    headerAlign: "center",
    labelClassName: "h-storage",
}));
const __VLS_646 = __VLS_645({
    label: "交付进度",
    headerAlign: "center",
    labelClassName: "h-storage",
}, ...__VLS_functionalComponentArgsRest(__VLS_645));
__VLS_647.slots.default;
const __VLS_648 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_649 = __VLS_asFunctionalComponent(__VLS_648, new __VLS_648({
    prop: "estDelivery",
    width: "130",
}));
const __VLS_650 = __VLS_649({
    prop: "estDelivery",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_649));
__VLS_651.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_651.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-storage" },
    });
}
var __VLS_651;
const __VLS_652 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_653 = __VLS_asFunctionalComponent(__VLS_652, new __VLS_652({
    prop: "actDelivery",
    width: "130",
}));
const __VLS_654 = __VLS_653({
    prop: "actDelivery",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_653));
__VLS_655.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_655.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-storage" },
    });
}
var __VLS_655;
var __VLS_647;
const __VLS_656 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_657 = __VLS_asFunctionalComponent(__VLS_656, new __VLS_656({
    label: "开票与报关",
    headerAlign: "center",
    labelClassName: "h-params",
}));
const __VLS_658 = __VLS_657({
    label: "开票与报关",
    headerAlign: "center",
    labelClassName: "h-params",
}, ...__VLS_functionalComponentArgsRest(__VLS_657));
__VLS_659.slots.default;
const __VLS_660 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_661 = __VLS_asFunctionalComponent(__VLS_660, new __VLS_660({
    prop: "canInvoice",
    width: "80",
}));
const __VLS_662 = __VLS_661({
    prop: "canInvoice",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_661));
__VLS_663.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_663.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_663;
const __VLS_664 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_665 = __VLS_asFunctionalComponent(__VLS_664, new __VLS_664({
    prop: "invoiceUnit",
    width: "80",
}));
const __VLS_666 = __VLS_665({
    prop: "invoiceUnit",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_665));
__VLS_667.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_667.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_667;
const __VLS_668 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_669 = __VLS_asFunctionalComponent(__VLS_668, new __VLS_668({
    prop: "invoiceName",
    width: "120",
}));
const __VLS_670 = __VLS_669({
    prop: "invoiceName",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_669));
__VLS_671.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_671.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_671;
const __VLS_672 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_673 = __VLS_asFunctionalComponent(__VLS_672, new __VLS_672({
    prop: "invoiceSpecs",
    width: "150",
    showOverflowTooltip: true,
}));
const __VLS_674 = __VLS_673({
    prop: "invoiceSpecs",
    width: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_673));
__VLS_675.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_675.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_675;
const __VLS_676 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_677 = __VLS_asFunctionalComponent(__VLS_676, new __VLS_676({
    prop: "customsMaterial",
    width: "120",
}));
const __VLS_678 = __VLS_677({
    prop: "customsMaterial",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_677));
__VLS_679.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_679.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_679;
var __VLS_659;
var __VLS_591;
var __VLS_587;
var __VLS_399;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-card mt-16" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
const __VLS_680 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_681 = __VLS_asFunctionalComponent(__VLS_680, new __VLS_680({
    data: (__VLS_ctx.detailData.firstOrderList),
    spanMethod: (__VLS_ctx.firstOrderSpanMethod),
    size: "small",
    border: true,
    stripe: true,
    ...{ style: {} },
    ...{ class: "business-spec-table" },
}));
const __VLS_682 = __VLS_681({
    data: (__VLS_ctx.detailData.firstOrderList),
    spanMethod: (__VLS_ctx.firstOrderSpanMethod),
    size: "small",
    border: true,
    stripe: true,
    ...{ style: {} },
    ...{ class: "business-spec-table" },
}, ...__VLS_functionalComponentArgsRest(__VLS_681));
__VLS_683.slots.default;
const __VLS_684 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_685 = __VLS_asFunctionalComponent(__VLS_684, new __VLS_684({
    type: "index",
    label: "序号",
    width: "50",
    fixed: true,
}));
const __VLS_686 = __VLS_685({
    type: "index",
    label: "序号",
    width: "50",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_685));
const __VLS_688 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_689 = __VLS_asFunctionalComponent(__VLS_688, new __VLS_688({
    label: "基础归属",
    headerAlign: "center",
    labelClassName: "h-basic",
}));
const __VLS_690 = __VLS_689({
    label: "基础归属",
    headerAlign: "center",
    labelClassName: "h-basic",
}, ...__VLS_functionalComponentArgsRest(__VLS_689));
__VLS_691.slots.default;
const __VLS_692 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_693 = __VLS_asFunctionalComponent(__VLS_692, new __VLS_692({
    prop: "materialCode",
    width: "120",
}));
const __VLS_694 = __VLS_693({
    prop: "materialCode",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_693));
__VLS_695.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_695.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
{
    const { default: __VLS_thisSlot } = __VLS_695.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_696 = {}.ElPopover;
    /** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
    // @ts-ignore
    const __VLS_697 = __VLS_asFunctionalComponent(__VLS_696, new __VLS_696({
        placement: "right",
        width: (300),
        trigger: "hover",
        popperClass: "spec-preview-popper",
    }));
    const __VLS_698 = __VLS_697({
        placement: "right",
        width: (300),
        trigger: "hover",
        popperClass: "spec-preview-popper",
    }, ...__VLS_functionalComponentArgsRest(__VLS_697));
    __VLS_699.slots.default;
    {
        const { reference: __VLS_thisSlot } = __VLS_699.slots;
        const __VLS_700 = {}.ElLink;
        /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
        // @ts-ignore
        const __VLS_701 = __VLS_asFunctionalComponent(__VLS_700, new __VLS_700({
            ...{ 'onClick': {} },
            type: "primary",
            underline: (false),
            ...{ class: "jump-link" },
        }));
        const __VLS_702 = __VLS_701({
            ...{ 'onClick': {} },
            type: "primary",
            underline: (false),
            ...{ class: "jump-link" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_701));
        let __VLS_704;
        let __VLS_705;
        let __VLS_706;
        const __VLS_707 = {
            onClick: (...[$event]) => {
                __VLS_ctx.jumpToSpec(row.materialCode);
            }
        };
        __VLS_703.slots.default;
        (row.materialCode);
        var __VLS_703;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "spec-preview-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-title" },
    });
    (row.materialCode);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-l" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-v" },
    });
    (__VLS_ctx.getSpecByCode(row.materialCode).brand);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-l" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-v" },
    });
    (__VLS_ctx.getSpecByCode(row.materialCode).pattern);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-l" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-v" },
    });
    (__VLS_ctx.getSpecByCode(row.materialCode).color);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-l" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-v" },
    });
    (__VLS_ctx.getSpecByCode(row.materialCode).size);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-l" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-v" },
    });
    (__VLS_ctx.getSpecByCode(row.materialCode).specs);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-l" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-v" },
    });
    (__VLS_ctx.getSpecByCode(row.materialCode).pkgQty);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-l" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-v" },
    });
    (__VLS_ctx.getSpecByCode(row.materialCode).pkgMethod);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-l" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-v" },
    });
    (__VLS_ctx.getSpecByCode(row.materialCode).materialDetail);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-l" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-v" },
    });
    (__VLS_ctx.getSpecByCode(row.materialCode).unitSize);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-l" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-v" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-l" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-v" },
    });
    (__VLS_ctx.getSpecByCode(row.materialCode).pkgSize);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-l" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-v" },
    });
    (__VLS_ctx.getSpecByCode(row.materialCode).pkgWeight);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-footer" },
    });
    var __VLS_699;
}
var __VLS_695;
const __VLS_708 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_709 = __VLS_asFunctionalComponent(__VLS_708, new __VLS_708({
    prop: "procurement",
    width: "100",
}));
const __VLS_710 = __VLS_709({
    prop: "procurement",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_709));
__VLS_711.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_711.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-basic" },
    });
}
var __VLS_711;
var __VLS_691;
const __VLS_712 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_713 = __VLS_asFunctionalComponent(__VLS_712, new __VLS_712({
    label: "流程时效",
    headerAlign: "center",
    labelClassName: "h-marketing",
}));
const __VLS_714 = __VLS_713({
    label: "流程时效",
    headerAlign: "center",
    labelClassName: "h-marketing",
}, ...__VLS_functionalComponentArgsRest(__VLS_713));
__VLS_715.slots.default;
const __VLS_716 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_717 = __VLS_asFunctionalComponent(__VLS_716, new __VLS_716({
    prop: "sourcingDate",
    width: "120",
}));
const __VLS_718 = __VLS_717({
    prop: "sourcingDate",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_717));
__VLS_719.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_719.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-marketing" },
    });
}
var __VLS_719;
const __VLS_720 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_721 = __VLS_asFunctionalComponent(__VLS_720, new __VLS_720({
    prop: "inquiryDate",
    width: "120",
}));
const __VLS_722 = __VLS_721({
    prop: "inquiryDate",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_721));
__VLS_723.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_723.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-marketing" },
    });
}
var __VLS_723;
var __VLS_715;
const __VLS_724 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_725 = __VLS_asFunctionalComponent(__VLS_724, new __VLS_724({
    label: "需求详情",
    headerAlign: "center",
    labelClassName: "h-params",
}));
const __VLS_726 = __VLS_725({
    label: "需求详情",
    headerAlign: "center",
    labelClassName: "h-params",
}, ...__VLS_functionalComponentArgsRest(__VLS_725));
__VLS_727.slots.default;
const __VLS_728 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_729 = __VLS_asFunctionalComponent(__VLS_728, new __VLS_728({
    prop: "reqTeam",
    width: "130",
}));
const __VLS_730 = __VLS_729({
    prop: "reqTeam",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_729));
__VLS_731.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_731.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_731;
const __VLS_732 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_733 = __VLS_asFunctionalComponent(__VLS_732, new __VLS_732({
    prop: "requester",
    width: "100",
}));
const __VLS_734 = __VLS_733({
    prop: "requester",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_733));
__VLS_735.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_735.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_735;
const __VLS_736 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_737 = __VLS_asFunctionalComponent(__VLS_736, new __VLS_736({
    prop: "actualQty",
    width: "110",
}));
const __VLS_738 = __VLS_737({
    prop: "actualQty",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_737));
__VLS_739.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_739.slots;
    const __VLS_740 = {}.ElTooltip;
    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_741 = __VLS_asFunctionalComponent(__VLS_740, new __VLS_740({
        content: "运营确认后的数量",
        placement: "top",
    }));
    const __VLS_742 = __VLS_741({
        content: "运营确认后的数量",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_741));
    __VLS_743.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
    const __VLS_744 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_745 = __VLS_asFunctionalComponent(__VLS_744, new __VLS_744({
        ...{ class: "header-hint-icon" },
    }));
    const __VLS_746 = __VLS_745({
        ...{ class: "header-hint-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_745));
    __VLS_747.slots.default;
    const __VLS_748 = {}.QuestionFilled;
    /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
    // @ts-ignore
    const __VLS_749 = __VLS_asFunctionalComponent(__VLS_748, new __VLS_748({}));
    const __VLS_750 = __VLS_749({}, ...__VLS_functionalComponentArgsRest(__VLS_749));
    var __VLS_747;
    var __VLS_743;
}
var __VLS_739;
const __VLS_752 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_753 = __VLS_asFunctionalComponent(__VLS_752, new __VLS_752({
    prop: "confirmDate",
    minWidth: "120",
}));
const __VLS_754 = __VLS_753({
    prop: "confirmDate",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_753));
__VLS_755.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_755.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_755;
const __VLS_756 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_757 = __VLS_asFunctionalComponent(__VLS_756, new __VLS_756({
    prop: "changeMemo",
    minWidth: "200",
    showOverflowTooltip: true,
}));
const __VLS_758 = __VLS_757({
    prop: "changeMemo",
    minWidth: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_757));
__VLS_759.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_759.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-params" },
    });
}
var __VLS_759;
var __VLS_727;
var __VLS_683;
var __VLS_91;
var __VLS_87;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "completion-schedule-bar mt-16" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "schedule-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-label" },
});
const __VLS_760 = {}.ElTooltip;
/** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
// @ts-ignore
const __VLS_761 = __VLS_asFunctionalComponent(__VLS_760, new __VLS_760({
    content: "说明：首单预计下单日期",
    placement: "top",
}));
const __VLS_762 = __VLS_761({
    content: "说明：首单预计下单日期",
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_761));
__VLS_763.slots.default;
const __VLS_764 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_765 = __VLS_asFunctionalComponent(__VLS_764, new __VLS_764({
    ...{ class: "info-btn" },
}));
const __VLS_766 = __VLS_765({
    ...{ class: "info-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_765));
__VLS_767.slots.default;
const __VLS_768 = {}.InfoFilled;
/** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
// @ts-ignore
const __VLS_769 = __VLS_asFunctionalComponent(__VLS_768, new __VLS_768({}));
const __VLS_770 = __VLS_769({}, ...__VLS_functionalComponentArgsRest(__VLS_769));
var __VLS_767;
var __VLS_763;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-value" },
});
(__VLS_ctx.detailData.estProposalDate);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "schedule-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-label" },
});
const __VLS_772 = {}.ElTooltip;
/** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
// @ts-ignore
const __VLS_773 = __VLS_asFunctionalComponent(__VLS_772, new __VLS_772({
    content: "说明：首单预计入库日期",
    placement: "top",
}));
const __VLS_774 = __VLS_773({
    content: "说明：首单预计入库日期",
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_773));
__VLS_775.slots.default;
const __VLS_776 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_777 = __VLS_asFunctionalComponent(__VLS_776, new __VLS_776({
    ...{ class: "info-btn" },
}));
const __VLS_778 = __VLS_777({
    ...{ class: "info-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_777));
__VLS_779.slots.default;
const __VLS_780 = {}.InfoFilled;
/** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
// @ts-ignore
const __VLS_781 = __VLS_asFunctionalComponent(__VLS_780, new __VLS_780({}));
const __VLS_782 = __VLS_781({}, ...__VLS_functionalComponentArgsRest(__VLS_781));
var __VLS_779;
var __VLS_775;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-value" },
});
(__VLS_ctx.detailData.estProjectDate);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "schedule-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-label" },
});
const __VLS_784 = {}.ElTooltip;
/** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
// @ts-ignore
const __VLS_785 = __VLS_asFunctionalComponent(__VLS_784, new __VLS_784({
    content: "说明：首单实际下单日期(取值来源：金蝶采购订单首单审核时间)",
    placement: "top",
}));
const __VLS_786 = __VLS_785({
    content: "说明：首单实际下单日期(取值来源：金蝶采购订单首单审核时间)",
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_785));
__VLS_787.slots.default;
const __VLS_788 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_789 = __VLS_asFunctionalComponent(__VLS_788, new __VLS_788({
    ...{ class: "info-btn" },
}));
const __VLS_790 = __VLS_789({
    ...{ class: "info-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_789));
__VLS_791.slots.default;
const __VLS_792 = {}.InfoFilled;
/** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
// @ts-ignore
const __VLS_793 = __VLS_asFunctionalComponent(__VLS_792, new __VLS_792({}));
const __VLS_794 = __VLS_793({}, ...__VLS_functionalComponentArgsRest(__VLS_793));
var __VLS_791;
var __VLS_787;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-value" },
});
(__VLS_ctx.detailData.actProposalDate);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "schedule-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-label" },
});
const __VLS_796 = {}.ElTooltip;
/** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
// @ts-ignore
const __VLS_797 = __VLS_asFunctionalComponent(__VLS_796, new __VLS_796({
    content: "说明：首单实际入库日期(取值来源：金蝶采购入库单首单审核时间)",
    placement: "top",
}));
const __VLS_798 = __VLS_797({
    content: "说明：首单实际入库日期(取值来源：金蝶采购入库单首单审核时间)",
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_797));
__VLS_799.slots.default;
const __VLS_800 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_801 = __VLS_asFunctionalComponent(__VLS_800, new __VLS_800({
    ...{ class: "info-btn" },
}));
const __VLS_802 = __VLS_801({
    ...{ class: "info-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_801));
__VLS_803.slots.default;
const __VLS_804 = {}.InfoFilled;
/** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
// @ts-ignore
const __VLS_805 = __VLS_asFunctionalComponent(__VLS_804, new __VLS_804({}));
const __VLS_806 = __VLS_805({}, ...__VLS_functionalComponentArgsRest(__VLS_805));
var __VLS_803;
var __VLS_799;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "s-value" },
});
(__VLS_ctx.detailData.actProjectDate);
var __VLS_3;
const __VLS_808 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_809 = __VLS_asFunctionalComponent(__VLS_808, new __VLS_808({
    modelValue: (__VLS_ctx.historyDialogVisible),
    title: "历史任务档案追踪",
    width: "600px",
    appendToBody: true,
    customClass: "history-records-dialog",
}));
const __VLS_810 = __VLS_809({
    modelValue: (__VLS_ctx.historyDialogVisible),
    title: "历史任务档案追踪",
    width: "600px",
    appendToBody: true,
    customClass: "history-records-dialog",
}, ...__VLS_functionalComponentArgsRest(__VLS_809));
__VLS_811.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "history-timeline-wrapper" },
});
const __VLS_812 = {}.ElTimeline;
/** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
// @ts-ignore
const __VLS_813 = __VLS_asFunctionalComponent(__VLS_812, new __VLS_812({}));
const __VLS_814 = __VLS_813({}, ...__VLS_functionalComponentArgsRest(__VLS_813));
__VLS_815.slots.default;
for (const [record, index] of __VLS_getVForSourceType((__VLS_ctx.historyRecords))) {
    const __VLS_816 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_817 = __VLS_asFunctionalComponent(__VLS_816, new __VLS_816({
        key: (index),
        timestamp: (record.endDate),
        placement: "top",
        type: "danger",
    }));
    const __VLS_818 = __VLS_817({
        key: (index),
        timestamp: (record.endDate),
        placement: "top",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_817));
    __VLS_819.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "history-round-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "h-round-no" },
    });
    (record.round);
    const __VLS_820 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_821 = __VLS_asFunctionalComponent(__VLS_820, new __VLS_820({
        size: "mini",
        type: "info",
    }));
    const __VLS_822 = __VLS_821({
        size: "mini",
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_821));
    __VLS_823.slots.default;
    var __VLS_823;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-card-reason mt-8" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
    (record.reason);
    const __VLS_824 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    const __VLS_825 = __VLS_asFunctionalComponent(__VLS_824, new __VLS_824({
        borderStyle: "dashed",
        ...{ class: "my-12" },
    }));
    const __VLS_826 = __VLS_825({
        borderStyle: "dashed",
        ...{ class: "my-12" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_825));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-card-actors" },
    });
    for (const [actor] of __VLS_getVForSourceType((record.actors))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (actor.name),
            ...{ class: "h-actor-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "ha-name" },
        });
        (actor.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "ha-res" },
        });
        (actor.result);
        const __VLS_828 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_829 = __VLS_asFunctionalComponent(__VLS_828, new __VLS_828({
            ...{ class: "ha-status" },
        }));
        const __VLS_830 = __VLS_829({
            ...{ class: "ha-status" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_829));
        __VLS_831.slots.default;
        const __VLS_832 = {}.CircleCloseFilled;
        /** @type {[typeof __VLS_components.CircleCloseFilled, ]} */ ;
        // @ts-ignore
        const __VLS_833 = __VLS_asFunctionalComponent(__VLS_832, new __VLS_832({}));
        const __VLS_834 = __VLS_833({}, ...__VLS_functionalComponentArgsRest(__VLS_833));
        var __VLS_831;
    }
    var __VLS_819;
}
var __VLS_815;
var __VLS_811;
/** @type {[typeof TaskDetailDrawer, ]} */ ;
// @ts-ignore
const __VLS_836 = __VLS_asFunctionalComponent(TaskDetailDrawer, new TaskDetailDrawer({
    ref: "taskDetailRef",
}));
const __VLS_837 = __VLS_836({
    ref: "taskDetailRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_836));
/** @type {typeof __VLS_ctx.taskDetailRef} */ ;
var __VLS_839 = {};
var __VLS_838;
/** @type {__VLS_StyleScopedClasses['proposal-detail-drawer']} */ ;
/** @type {__VLS_StyleScopedClasses['drawer-header']} */ ;
/** @type {__VLS_StyleScopedClasses['title-area']} */ ;
/** @type {__VLS_StyleScopedClasses['no']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-container']} */ ;
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['process-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-left']} */ ;
/** @type {__VLS_StyleScopedClasses['header-action-link']} */ ;
/** @type {__VLS_StyleScopedClasses['phase-progress-v2']} */ ;
/** @type {__VLS_StyleScopedClasses['phase-node']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['has-tasks']} */ ;
/** @type {__VLS_StyleScopedClasses['p-circle-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['p-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['p-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-name']} */ ;
/** @type {__VLS_StyleScopedClasses['p-nodes']} */ ;
/** @type {__VLS_StyleScopedClasses['popover-task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['pop-header-v2']} */ ;
/** @type {__VLS_StyleScopedClasses['ph-top']} */ ;
/** @type {__VLS_StyleScopedClasses['ph-title']} */ ;
/** @type {__VLS_StyleScopedClasses['round-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['task-cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['actor-card-v2']} */ ;
/** @type {__VLS_StyleScopedClasses['processing']} */ ;
/** @type {__VLS_StyleScopedClasses['card-status-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['current-node']} */ ;
/** @type {__VLS_StyleScopedClasses['actor-name']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-graph-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['phase-line']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['phase-node']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['has-tasks']} */ ;
/** @type {__VLS_StyleScopedClasses['p-circle-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['p-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['task-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['p-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-name']} */ ;
/** @type {__VLS_StyleScopedClasses['p-nodes']} */ ;
/** @type {__VLS_StyleScopedClasses['popover-task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['pop-header-v2']} */ ;
/** @type {__VLS_StyleScopedClasses['ph-top']} */ ;
/** @type {__VLS_StyleScopedClasses['ph-title']} */ ;
/** @type {__VLS_StyleScopedClasses['round-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['task-cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['actor-card-v2']} */ ;
/** @type {__VLS_StyleScopedClasses['processing']} */ ;
/** @type {__VLS_StyleScopedClasses['card-status-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['current-node']} */ ;
/** @type {__VLS_StyleScopedClasses['actor-name']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-graph-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['actor-card-v2']} */ ;
/** @type {__VLS_StyleScopedClasses['processing']} */ ;
/** @type {__VLS_StyleScopedClasses['card-status-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['current-node']} */ ;
/** @type {__VLS_StyleScopedClasses['actor-name']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-graph-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['phase-line']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['phase-node']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['has-tasks']} */ ;
/** @type {__VLS_StyleScopedClasses['p-circle-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['p-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['task-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['p-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-name']} */ ;
/** @type {__VLS_StyleScopedClasses['p-nodes']} */ ;
/** @type {__VLS_StyleScopedClasses['popover-task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['pop-header-v2']} */ ;
/** @type {__VLS_StyleScopedClasses['ph-top']} */ ;
/** @type {__VLS_StyleScopedClasses['ph-title']} */ ;
/** @type {__VLS_StyleScopedClasses['round-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['task-cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['actor-card-v2']} */ ;
/** @type {__VLS_StyleScopedClasses['advanced']} */ ;
/** @type {__VLS_StyleScopedClasses['card-status-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['current-node']} */ ;
/** @type {__VLS_StyleScopedClasses['actor-name']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-graph-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['phase-line']} */ ;
/** @type {__VLS_StyleScopedClasses['phase-node']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['p-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['p-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-name']} */ ;
/** @type {__VLS_StyleScopedClasses['p-nodes']} */ ;
/** @type {__VLS_StyleScopedClasses['popover-task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['pop-header-v2']} */ ;
/** @type {__VLS_StyleScopedClasses['ph-top']} */ ;
/** @type {__VLS_StyleScopedClasses['ph-title']} */ ;
/** @type {__VLS_StyleScopedClasses['task-cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['actor-card-v2']} */ ;
/** @type {__VLS_StyleScopedClasses['pending']} */ ;
/** @type {__VLS_StyleScopedClasses['card-status-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['current-node']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-graph-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['phase-line']} */ ;
/** @type {__VLS_StyleScopedClasses['phase-node']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['p-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['p-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-name']} */ ;
/** @type {__VLS_StyleScopedClasses['p-nodes']} */ ;
/** @type {__VLS_StyleScopedClasses['popover-task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['pop-header-v2']} */ ;
/** @type {__VLS_StyleScopedClasses['ph-top']} */ ;
/** @type {__VLS_StyleScopedClasses['ph-title']} */ ;
/** @type {__VLS_StyleScopedClasses['round-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['task-cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['actor-card-v2']} */ ;
/** @type {__VLS_StyleScopedClasses['pending']} */ ;
/** @type {__VLS_StyleScopedClasses['card-status-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['current-node']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-graph-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['phase-line']} */ ;
/** @type {__VLS_StyleScopedClasses['phase-node']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['p-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['p-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-name']} */ ;
/** @type {__VLS_StyleScopedClasses['p-nodes']} */ ;
/** @type {__VLS_StyleScopedClasses['popover-task-list']} */ ;
/** @type {__VLS_StyleScopedClasses['pop-header-v2']} */ ;
/** @type {__VLS_StyleScopedClasses['ph-top']} */ ;
/** @type {__VLS_StyleScopedClasses['ph-title']} */ ;
/** @type {__VLS_StyleScopedClasses['round-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['task-cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['actor-card-v2']} */ ;
/** @type {__VLS_StyleScopedClasses['pending']} */ ;
/** @type {__VLS_StyleScopedClasses['card-status-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['current-node']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-graph-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-line']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-item']} */ ;
/** @type {__VLS_StyleScopedClasses['wait']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['gs-time']} */ ;
/** @type {__VLS_StyleScopedClasses['info-dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['dash-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['dash-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['unit']} */ ;
/** @type {__VLS_StyleScopedClasses['dash-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['dash-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['research-content']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['text-block']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-label']} */ ;
/** @type {__VLS_StyleScopedClasses['content-text']} */ ;
/** @type {__VLS_StyleScopedClasses['link-block']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-label']} */ ;
/** @type {__VLS_StyleScopedClasses['multi-links']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['link-item']} */ ;
/** @type {__VLS_StyleScopedClasses['file-block']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-label']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['file-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['file-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['roi-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['image-gallery']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-label']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['img-list']} */ ;
/** @type {__VLS_StyleScopedClasses['gallery-item']} */ ;
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['task-section-v3']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['modern-task-table']} */ ;
/** @type {__VLS_StyleScopedClasses['task-info-v3']} */ ;
/** @type {__VLS_StyleScopedClasses['t-name-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['t-name']} */ ;
/** @type {__VLS_StyleScopedClasses['priority-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['t-sub-info']} */ ;
/** @type {__VLS_StyleScopedClasses['t-no']} */ ;
/** @type {__VLS_StyleScopedClasses['divider']} */ ;
/** @type {__VLS_StyleScopedClasses['t-method']} */ ;
/** @type {__VLS_StyleScopedClasses['release-time-v3']} */ ;
/** @type {__VLS_StyleScopedClasses['header-with-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['header-hint-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['deadline-group-v3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-time']} */ ;
/** @type {__VLS_StyleScopedClasses['d-countdown']} */ ;
/** @type {__VLS_StyleScopedClasses['d-done']} */ ;
/** @type {__VLS_StyleScopedClasses['d-done']} */ ;
/** @type {__VLS_StyleScopedClasses['deadline-group-v3']} */ ;
/** @type {__VLS_StyleScopedClasses['d-time']} */ ;
/** @type {__VLS_StyleScopedClasses['d-countdown']} */ ;
/** @type {__VLS_StyleScopedClasses['d-done']} */ ;
/** @type {__VLS_StyleScopedClasses['d-done']} */ ;
/** @type {__VLS_StyleScopedClasses['assignee-info-v3']} */ ;
/** @type {__VLS_StyleScopedClasses['a-user']} */ ;
/** @type {__VLS_StyleScopedClasses['a-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['a-name']} */ ;
/** @type {__VLS_StyleScopedClasses['a-time']} */ ;
/** @type {__VLS_StyleScopedClasses['status-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['s-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['s-text']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-detail-v3']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['inner-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['business-spec-table']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['req-star']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['req-star']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['t-ip']} */ ;
/** @type {__VLS_StyleScopedClasses['t-ip']} */ ;
/** @type {__VLS_StyleScopedClasses['t-ip']} */ ;
/** @type {__VLS_StyleScopedClasses['t-ip']} */ ;
/** @type {__VLS_StyleScopedClasses['t-marketing']} */ ;
/** @type {__VLS_StyleScopedClasses['t-marketing']} */ ;
/** @type {__VLS_StyleScopedClasses['t-marketing']} */ ;
/** @type {__VLS_StyleScopedClasses['t-marketing']} */ ;
/** @type {__VLS_StyleScopedClasses['t-marketing']} */ ;
/** @type {__VLS_StyleScopedClasses['t-marketing']} */ ;
/** @type {__VLS_StyleScopedClasses['t-core']} */ ;
/** @type {__VLS_StyleScopedClasses['t-storage']} */ ;
/** @type {__VLS_StyleScopedClasses['t-quality']} */ ;
/** @type {__VLS_StyleScopedClasses['business-spec-table']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-ip']} */ ;
/** @type {__VLS_StyleScopedClasses['t-ip']} */ ;
/** @type {__VLS_StyleScopedClasses['t-ip']} */ ;
/** @type {__VLS_StyleScopedClasses['t-ip']} */ ;
/** @type {__VLS_StyleScopedClasses['t-ip']} */ ;
/** @type {__VLS_StyleScopedClasses['t-marketing']} */ ;
/** @type {__VLS_StyleScopedClasses['t-marketing']} */ ;
/** @type {__VLS_StyleScopedClasses['t-marketing']} */ ;
/** @type {__VLS_StyleScopedClasses['t-storage']} */ ;
/** @type {__VLS_StyleScopedClasses['t-storage']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['business-spec-table']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['jump-link']} */ ;
/** @type {__VLS_StyleScopedClasses['spec-preview-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-title']} */ ;
/** @type {__VLS_StyleScopedClasses['p-content']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-l']} */ ;
/** @type {__VLS_StyleScopedClasses['p-v']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-l']} */ ;
/** @type {__VLS_StyleScopedClasses['p-v']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-l']} */ ;
/** @type {__VLS_StyleScopedClasses['p-v']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-l']} */ ;
/** @type {__VLS_StyleScopedClasses['p-v']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-l']} */ ;
/** @type {__VLS_StyleScopedClasses['p-v']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-l']} */ ;
/** @type {__VLS_StyleScopedClasses['p-v']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-l']} */ ;
/** @type {__VLS_StyleScopedClasses['p-v']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-l']} */ ;
/** @type {__VLS_StyleScopedClasses['p-v']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-l']} */ ;
/** @type {__VLS_StyleScopedClasses['p-v']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-l']} */ ;
/** @type {__VLS_StyleScopedClasses['p-v']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-l']} */ ;
/** @type {__VLS_StyleScopedClasses['p-v']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-l']} */ ;
/** @type {__VLS_StyleScopedClasses['p-v']} */ ;
/** @type {__VLS_StyleScopedClasses['p-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['t-basic']} */ ;
/** @type {__VLS_StyleScopedClasses['t-marketing']} */ ;
/** @type {__VLS_StyleScopedClasses['t-marketing']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['header-hint-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['t-params']} */ ;
/** @type {__VLS_StyleScopedClasses['completion-schedule-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['schedule-item']} */ ;
/** @type {__VLS_StyleScopedClasses['s-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['s-value']} */ ;
/** @type {__VLS_StyleScopedClasses['schedule-item']} */ ;
/** @type {__VLS_StyleScopedClasses['s-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['s-value']} */ ;
/** @type {__VLS_StyleScopedClasses['schedule-item']} */ ;
/** @type {__VLS_StyleScopedClasses['s-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['s-value']} */ ;
/** @type {__VLS_StyleScopedClasses['schedule-item']} */ ;
/** @type {__VLS_StyleScopedClasses['s-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['s-value']} */ ;
/** @type {__VLS_StyleScopedClasses['history-timeline-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['history-round-card']} */ ;
/** @type {__VLS_StyleScopedClasses['h-card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['h-round-no']} */ ;
/** @type {__VLS_StyleScopedClasses['h-card-reason']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['my-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-card-actors']} */ ;
/** @type {__VLS_StyleScopedClasses['h-actor-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ha-name']} */ ;
/** @type {__VLS_StyleScopedClasses['ha-res']} */ ;
/** @type {__VLS_StyleScopedClasses['ha-status']} */ ;
// @ts-ignore
var __VLS_840 = __VLS_839;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Document: Document,
            InfoFilled: InfoFilled,
            ArrowRight: ArrowRight,
            CoffeeCup: CoffeeCup,
            Management: Management,
            List: List,
            PriceTag: PriceTag,
            Monitor: Monitor,
            Guide: Guide,
            Film: Film,
            Link: Link,
            DataAnalysis: DataAnalysis,
            QuestionFilled: QuestionFilled,
            TaskDetailDrawer: TaskDetailDrawer,
            visible: visible,
            finalTabActive: finalTabActive,
            historyDialogVisible: historyDialogVisible,
            taskDetailRef: taskDetailRef,
            handleViewTaskDetail: handleViewTaskDetail,
            getSpecByCode: getSpecByCode,
            jumpToSpec: jumpToSpec,
            tableRowClassName: tableRowClassName,
            historyRecords: historyRecords,
            showHistory: showHistory,
            detailData: detailData,
            firstOrderSpanMethod: firstOrderSpanMethod,
            getStatusType: getStatusType,
            getPriorityType: getPriorityType,
        };
    },
    emits: {},
    props: {
        modelValue: Boolean,
        detailData: {
            type: Object,
            default: () => ({})
        }
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    emits: {},
    props: {
        modelValue: Boolean,
        detailData: {
            type: Object,
            default: () => ({})
        }
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DetailDrawer.vue.js.map