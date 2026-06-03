/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Clock, CopyDocument, Check, Document, Management } from '@element-plus/icons-vue';
import CustomFeedbackDialog from './components/CustomFeedbackDialog.vue';
import PurchaseApplyDialog from './components/PurchaseApplyDialog.vue';
import SampleRegistrationDialog from './components/SampleRegistrationDialog.vue';
import ExecutionDetailDrawer from './components/ExecutionDetailDrawer.vue';
const searchQuery = ref('');
const activeTab = ref('accepted');
const currentTask = ref(null);
const customFeedbackRef = ref(null);
const purchaseApplyRef = ref(null);
const sampleRegistrationRef = ref(null);
const executionDetailDrawerRef = ref(null);
const statusTabs = [
    { label: '未完成', value: 'unfinished' },
    { label: '已承接', value: 'accepted' },
    { label: '定制反馈', value: 'custom_feedback' },
    { label: '购样申请', value: 'purchase_apply' },
    { label: '样品待反馈', value: 'sample_feedback' }
];
const steps = ['任务发布', '任务承接', '定制反馈', '购样申请', '费用审批', '样品登记', '开发反馈', '任务归档'];
const tableData = ref([
    {
        image: 'https://picsum.photos/100/100?random=1',
        proposalNo: 'TA-202605049',
        productName: 'DIY灯光板 - 亚克力透明款',
        pm: '颜沙沙',
        sampleMethodText: '现货拿样',
        category: '家居装饰',
        remainingDays: 7,
        isUrgent: true,
        style: '透明款',
        material: '亚克力',
        model: 'DIY-001',
        applicableTo: '通用',
        spu: 'SPU001',
        brand: 'MoKo',
        logoPosition: '侧面',
        packagingMethod: '盒装',
        buyQty: '100',
        totalAmount: '2,000.00',
        launchTime: '2026-06-30'
    },
    {
        image: 'https://picsum.photos/100/100?random=11',
        proposalNo: 'TA-202605061',
        productName: '折叠笔记本支架 - 加厚版',
        pm: '赵敏',
        sampleMethodText: '现货拿样',
        category: '数码配件',
        remainingDays: 5,
        isUrgent: true,
        style: '加厚版',
        material: '铝合金',
        model: 'NB-ST01',
        applicableTo: '笔记本电脑',
        spu: 'SPU002',
        brand: 'MoKo',
        logoPosition: '面板',
        packagingMethod: '盒装',
        buyQty: '200',
        totalAmount: '8,000.00',
        launchTime: '2026-07-10'
    },
    {
        image: 'https://picsum.photos/200/200?random=25',
        proposalNo: 'TA-202605069',
        productName: '电子墨水屏阅读器',
        pm: '李健',
        sampleMethodText: '定制拿样',
        category: '智能硬件',
        remainingDays: 11,
        isUrgent: false,
        style: '墨水屏Pro版',
        material: '复合塑胶 + 电子墨水屏',
        model: 'EP-2026-V1',
        applicableTo: '商务人士',
        spu: 'SPU882910',
        brand: 'MoKo',
        logoPosition: '背面',
        packagingMethod: '礼盒装',
        buyQty: '500',
        totalAmount: '115,000.00',
        launchTime: '2026-07-15'
    },
    {
        image: 'https://picsum.photos/200/200?random=22',
        proposalNo: 'TA-202605066',
        productName: '多功能露营灯',
        pm: '颜沙沙',
        sampleMethodText: '现货拿样',
        category: '户外运动',
        remainingDays: 11,
        isUrgent: false,
        style: '多功能款',
        material: 'ABS',
        model: 'CP-L01',
        applicableTo: '露营爱好者',
        spu: 'SPU004',
        brand: 'MoKo',
        logoPosition: '顶部',
        packagingMethod: '彩盒',
        buyQty: '300',
        totalAmount: '5,000.00',
        launchTime: '2026-08-01'
    },
    {
        image: 'https://picsum.photos/200/200?random=24',
        proposalNo: 'TA-202605068',
        productName: '桌面加湿器 - 极简版',
        pm: '邓紫棋',
        sampleMethodText: '现货拿样',
        category: '生活电器',
        remainingDays: 13,
        isUrgent: false,
        style: '极简版',
        material: 'PP',
        model: 'HM-D01',
        applicableTo: '通用',
        spu: 'SPU005',
        brand: 'MoKo',
        logoPosition: '正面',
        packagingMethod: '白盒',
        buyQty: '1000',
        totalAmount: '12,000.00',
        launchTime: '2026-09-01'
    },
    {
        image: 'https://picsum.photos/200/200?random=26',
        proposalNo: 'TA-202605070',
        productName: '机械键盘 - 复古款',
        pm: '颜沙沙',
        sampleMethodText: '现货拿样',
        category: '数码配件',
        remainingDays: 12,
        isUrgent: false,
        style: '复古款',
        material: 'PBT',
        model: 'KB-R01',
        applicableTo: '电脑用户',
        spu: 'SPU006',
        brand: 'MoKo',
        logoPosition: '底部',
        packagingMethod: '礼盒',
        buyQty: '150',
        totalAmount: '15,000.00',
        launchTime: '2026-10-15'
    }
]);
currentTask.value = tableData.value[2];
const urgentTasks = computed(() => tableData.value.filter(i => i.isUrgent));
const normalTasks = computed(() => tableData.value.filter(i => !i.isUrgent));
const getStepStatus = (index) => {
    if (index < 1)
        return 'done';
    if (index === 1)
        return 'active';
    return 'pending';
};
const handleCustomFeedback = () => {
    customFeedbackRef.value?.open();
};
const handlePurchaseApply = (row) => {
    console.log('Opening Purchase Apply Dialog', row);
    if (purchaseApplyRef.value) {
        purchaseApplyRef.value.open(row);
    }
    else {
        console.error('purchaseApplyRef is not initialized');
    }
};
const handleDeleteFeedback = (row) => {
    ElMessageBox.confirm(`确定要删除反馈方案 ${row.code} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'small'
    }).then(() => {
        const index = feedbackListData.value.findIndex(i => i.code === row.code);
        if (index !== -1) {
            feedbackListData.value.splice(index, 1);
            ElMessage.success('方案已删除');
        }
    }).catch(() => { });
};
const handleSampleRegistration = (taskData) => {
    console.log('Opening Sample Registration Dialog', taskData);
    if (sampleRegistrationRef.value) {
        // 这里的 taskData 可能是反馈列表中的某一行，也可能为空（点击顶部按钮）
        // 为了同步规格信息，我们需要确保传给弹窗的数据包含 currentTask 的基础信息
        const syncData = {
            ...(currentTask.value || {}),
            ...(taskData || {})
        };
        sampleRegistrationRef.value.open(syncData);
    }
    else {
        console.error('sampleRegistrationRef is not initialized');
    }
};
const handleExecutionDetail = (row) => {
    if (executionDetailDrawerRef.value) {
        executionDetailDrawerRef.value.open(row);
    }
};
const feedbackListData = ref([
    {
        code: 'FA-20260520-01',
        source: '1688-广州某工厂',
        feeType: '开模费',
        feeAmount: '¥ 5,000.00',
        moldOwnership: '公司',
        customDuration: '15天',
        initialQuote: '¥ 85.00',
        productionCycle: '25天',
        moq: '1000',
        isRefundable: '是',
        refundMethod: '返现金',
        refundCondition: '首单满1万',
        additionalConditions: '含彩盒包装',
        status: '待开发反馈',
        statusType: 'primary'
    },
    {
        code: 'FA-20260520-02',
        source: '线下-深圳供应商',
        feeType: '打样费',
        feeAmount: '¥ 50.00',
        moldOwnership: '-',
        customDuration: '7天',
        initialQuote: '¥ 78.00',
        productionCycle: '20天',
        moq: '500',
        isRefundable: '否',
        refundMethod: '-',
        refundCondition: '-',
        additionalConditions: '无',
        status: '已采纳',
        statusType: 'success'
    },
    {
        code: 'FA-20260523-07',
        source: '阿里国际-义乌供应商',
        feeType: '打样费',
        feeAmount: '¥ 120.00',
        moldOwnership: '-',
        customDuration: '4天',
        initialQuote: '¥ 88.00',
        productionCycle: '20天',
        moq: '1000',
        isRefundable: '是',
        refundMethod: '抵扣货款',
        refundCondition: '首单退',
        additionalConditions: '测试单个待提交购样单',
        status: '已采纳',
        statusType: 'success'
    },
    {
        code: 'FA-20260523-08',
        source: '阿里国际-宁波供应商',
        feeType: '打样费',
        feeAmount: '¥ 350.00',
        moldOwnership: '-',
        customDuration: '6天',
        initialQuote: '¥ 95.00',
        productionCycle: '25天',
        moq: '1500',
        isRefundable: '是',
        refundMethod: '抵扣货款',
        refundCondition: '满2万退',
        additionalConditions: '测试多个购样申请记录',
        status: '已采纳',
        statusType: 'success'
    },
    {
        code: 'FA-20260520-03',
        source: '阿里国际-义乌供应商',
        feeType: '打样费',
        feeAmount: '¥ 150.00',
        moldOwnership: '-',
        customDuration: '5天',
        initialQuote: '¥ 92.00',
        productionCycle: '30天',
        moq: '2000',
        isRefundable: '是',
        refundMethod: '抵扣货款',
        refundCondition: '起订量翻倍',
        additionalConditions: '运费自理',
        status: '未采纳',
        statusType: 'info'
    },
    {
        code: 'FA-20260521-04',
        source: '東莞某五金厂',
        feeType: '开模费',
        feeAmount: '¥ 12,000.00',
        moldOwnership: '共有',
        customDuration: '30天',
        initialQuote: '¥ 65.00',
        productionCycle: '45天',
        moq: '5000',
        isRefundable: '否',
        refundMethod: '-',
        refundCondition: '-',
        additionalConditions: '模具寿命20万模',
        status: '已驳回',
        statusType: 'danger'
    },
    {
        code: 'FA-20260521-05',
        source: '线下-苏州电子',
        feeType: '开模费',
        feeAmount: '¥ 8,000.00',
        moldOwnership: '供应商',
        customDuration: '20天',
        initialQuote: '¥ 110.00',
        productionCycle: '35天',
        moq: '1500',
        isRefundable: '是',
        refundMethod: '抵扣首单',
        refundCondition: '满5万退',
        additionalConditions: '含两轮功能验证',
        status: '待提交',
        statusType: 'warning'
    },
    {
        code: 'FA-20260522-06',
        source: '长期合作-惠州工厂',
        feeType: '打样费',
        feeAmount: '¥ 0.00',
        moldOwnership: '-',
        customDuration: '3天',
        initialQuote: '¥ 62.00',
        productionCycle: '15天',
        moq: '300',
        isRefundable: '否',
        refundMethod: '-',
        refundCondition: '-',
        additionalConditions: '样机免费寄送',
        status: '已采纳',
        statusType: 'success'
    },
    {
        code: 'FA-20260522-07',
        source: '长期合作-中山光源厂',
        feeType: '打样费',
        feeAmount: '¥ 0.00',
        moldOwnership: '-',
        customDuration: '4天',
        initialQuote: '¥ 45.00',
        productionCycle: '12天',
        moq: '500',
        isRefundable: '否',
        refundMethod: '-',
        refundCondition: '-',
        additionalConditions: '测试多个直接登记（免费打样）',
        status: '已采纳',
        statusType: 'success'
    }
]);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['id']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['product-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['circle']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['circle']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sample-task-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "workbench-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "side-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "side-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-box" },
});
const __VLS_0 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.searchQuery),
    placeholder: "搜索编号/产品",
    prefixIcon: "Search",
    size: "small",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.searchQuery),
    placeholder: "搜索编号/产品",
    prefixIcon: "Search",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "urgent-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "urgent-summary-line" },
});
const __VLS_4 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ class: "clock-icon" },
}));
const __VLS_6 = __VLS_5({
    ...{ class: "clock-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.Clock;
/** @type {[typeof __VLS_components.Clock, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_7;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "count-badge" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "urgent-card-list" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.urgentTasks))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.currentTask = item;
            } },
        key: (item.proposalNo),
        ...{ class: (['urgent-mini-card', { active: __VLS_ctx.currentTask?.proposalNo === item.proposalNo }]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-top" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "id" },
    });
    (item.proposalNo);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "urgent-label-tag" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-main" },
    });
    const __VLS_12 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        src: (item.image),
        ...{ class: "product-thumb" },
    }));
    const __VLS_14 = __VLS_13({
        src: (item.image),
        ...{ class: "product-thumb" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title" },
    });
    (item.productName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "sub" },
    });
    (item.pm);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "v-line" },
    });
    (item.sampleMethodText);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tabs-scroll-nav" },
});
for (const [tab] of __VLS_getVForSourceType((__VLS_ctx.statusTabs))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.activeTab = tab.value;
            } },
        key: (tab.value),
        ...{ class: (['tab-item', { active: __VLS_ctx.activeTab === tab.value }]) },
    });
    (tab.label);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "side-body custom-scrollbar" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.normalTasks))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.currentTask = item;
            } },
        key: (item.proposalNo),
        ...{ class: (['normal-task-card', { active: __VLS_ctx.currentTask?.proposalNo === item.proposalNo }]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-top" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "id" },
    });
    (item.proposalNo);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "days-tag" },
    });
    (item.remainingDays);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-main" },
    });
    const __VLS_16 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        src: (item.image),
        ...{ class: "product-thumb" },
    }));
    const __VLS_18 = __VLS_17({
        src: (item.image),
        ...{ class: "product-thumb" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title" },
    });
    (item.productName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "sub" },
    });
    (item.pm);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "v-line" },
    });
    (item.sampleMethodText);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "separator-line" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "status-link" },
    });
}
if (__VLS_ctx.currentTask) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
        ...{ class: "main-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
        ...{ class: "content-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-left" },
    });
    const __VLS_20 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        size: "small",
        type: "danger",
        effect: "plain",
        ...{ class: "tag-p0" },
    }));
    const __VLS_22 = __VLS_21({
        size: "small",
        type: "danger",
        effect: "plain",
        ...{ class: "tag-p0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    var __VLS_23;
    const __VLS_24 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        size: "small",
        color: "#faad14",
        effect: "dark",
        ...{ class: "tag-level" },
    }));
    const __VLS_26 = __VLS_25({
        size: "small",
        color: "#faad14",
        effect: "dark",
        ...{ class: "tag-level" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    var __VLS_27;
    const __VLS_28 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
        size: "small",
        type: "success",
        effect: "plain",
        ...{ class: "tag-method" },
    }));
    const __VLS_30 = __VLS_29({
        size: "small",
        type: "success",
        effect: "plain",
        ...{ class: "tag-method" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    var __VLS_31;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: "product-name" },
    });
    (__VLS_ctx.currentTask.productName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "proposal-id" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.proposalNo);
    const __VLS_32 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        ...{ class: "copy-btn" },
    }));
    const __VLS_34 = __VLS_33({
        ...{ class: "copy-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    const __VLS_36 = {}.CopyDocument;
    /** @type {[typeof __VLS_components.CopyDocument, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
    const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
    var __VLS_35;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-actions" },
    });
    if (__VLS_ctx.currentTask.sampleMethodText === '定制拿样') {
        const __VLS_40 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
            ...{ 'onClick': {} },
            type: "primary",
            ...{ class: "action-btn blue" },
        }));
        const __VLS_42 = __VLS_41({
            ...{ 'onClick': {} },
            type: "primary",
            ...{ class: "action-btn blue" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        let __VLS_44;
        let __VLS_45;
        let __VLS_46;
        const __VLS_47 = {
            onClick: (__VLS_ctx.handleCustomFeedback)
        };
        __VLS_43.slots.default;
        var __VLS_43;
        const __VLS_48 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
            ...{ class: "action-btn plain" },
        }));
        const __VLS_50 = __VLS_49({
            ...{ class: "action-btn plain" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        __VLS_51.slots.default;
        var __VLS_51;
    }
    else if (__VLS_ctx.currentTask.sampleMethodText === '现货拿样') {
        const __VLS_52 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            ...{ 'onClick': {} },
            type: "primary",
            ...{ class: "action-btn blue" },
        }));
        const __VLS_54 = __VLS_53({
            ...{ 'onClick': {} },
            type: "primary",
            ...{ class: "action-btn blue" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        let __VLS_56;
        let __VLS_57;
        let __VLS_58;
        const __VLS_59 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.currentTask))
                    return;
                if (!!(__VLS_ctx.currentTask.sampleMethodText === '定制拿样'))
                    return;
                if (!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                    return;
                __VLS_ctx.handlePurchaseApply();
            }
        };
        __VLS_55.slots.default;
        var __VLS_55;
        const __VLS_60 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
            ...{ 'onClick': {} },
            type: "primary",
            icon: "Plus",
            ...{ class: "action-btn blue" },
        }));
        const __VLS_62 = __VLS_61({
            ...{ 'onClick': {} },
            type: "primary",
            icon: "Plus",
            ...{ class: "action-btn blue" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        let __VLS_64;
        let __VLS_65;
        let __VLS_66;
        const __VLS_67 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.currentTask))
                    return;
                if (!!(__VLS_ctx.currentTask.sampleMethodText === '定制拿样'))
                    return;
                if (!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                    return;
                __VLS_ctx.handleSampleRegistration();
            }
        };
        __VLS_63.slots.default;
        var __VLS_63;
        const __VLS_68 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
            ...{ class: "action-btn plain" },
        }));
        const __VLS_70 = __VLS_69({
            ...{ class: "action-btn plain" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        __VLS_71.slots.default;
        var __VLS_71;
    }
    else {
        const __VLS_72 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
            type: "primary",
            ...{ class: "action-btn blue" },
        }));
        const __VLS_74 = __VLS_73({
            type: "primary",
            ...{ class: "action-btn blue" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        __VLS_75.slots.default;
        var __VLS_75;
        const __VLS_76 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
            ...{ 'onClick': {} },
            type: "primary",
            icon: "Plus",
            ...{ class: "action-btn blue" },
        }));
        const __VLS_78 = __VLS_77({
            ...{ 'onClick': {} },
            type: "primary",
            icon: "Plus",
            ...{ class: "action-btn blue" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        let __VLS_80;
        let __VLS_81;
        let __VLS_82;
        const __VLS_83 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.currentTask))
                    return;
                if (!!(__VLS_ctx.currentTask.sampleMethodText === '定制拿样'))
                    return;
                if (!!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                    return;
                __VLS_ctx.handleSampleRegistration();
            }
        };
        __VLS_79.slots.default;
        var __VLS_79;
        const __VLS_84 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
            ...{ class: "action-btn plain" },
        }));
        const __VLS_86 = __VLS_85({
            ...{ class: "action-btn plain" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        __VLS_87.slots.default;
        var __VLS_87;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stepper-container" },
    });
    for (const [step, index] of __VLS_getVForSourceType((__VLS_ctx.steps))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (index),
            ...{ class: (['step-node', __VLS_ctx.getStepStatus(index)]) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "node-main" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "circle" },
        });
        if (index < 1) {
            const __VLS_88 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({}));
            const __VLS_90 = __VLS_89({}, ...__VLS_functionalComponentArgsRest(__VLS_89));
            __VLS_91.slots.default;
            const __VLS_92 = {}.Check;
            /** @type {[typeof __VLS_components.Check, ]} */ ;
            // @ts-ignore
            const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({}));
            const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
            var __VLS_91;
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (index + 1);
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "label" },
        });
        (step);
        if (index < __VLS_ctx.steps.length - 1) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: (['line', { completed: index < 1 }]) },
            });
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "content-body custom-scrollbar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-cards-row mb-12" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "card-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-grid grid-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.pm);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.productName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.style || '亚克力透明款');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.model || 'JK-2026-X1');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.material || '亚克力 + LED');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.applicableTo || '通用 / 通用');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.spu || 'SPU882910');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "card-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-grid grid-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item flex-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    const __VLS_96 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        size: "small",
        ...{ class: "custom-tag" },
    }));
    const __VLS_98 = __VLS_97({
        size: "small",
        ...{ class: "custom-tag" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    (__VLS_ctx.currentTask.devMethod || '全新品-定制');
    var __VLS_99;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.brand || 'MoKo');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.logoPosition || '无');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.packagingMethod || '盒装');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.buyQty || '500');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.totalAmount || '115,000.00');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.launchTime || '2026-07-15');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-card no-padding-bottom" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "card-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "time-list" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "time-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "time-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "time-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "custom-dotted-divider" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-countdown" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cd-box feedback" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "lab" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cd-box task" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "lab" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-card mb-12" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "card-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "data-grid grid-3 mb-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item span-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "value-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    const __VLS_100 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        type: "primary",
        underline: (false),
    }));
    const __VLS_102 = __VLS_101({
        type: "primary",
        underline: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    var __VLS_103;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item flex-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "red-star" },
    });
    const __VLS_104 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        type: "primary",
        underline: (false),
        ...{ class: "ml-4" },
    }));
    const __VLS_106 = __VLS_105({
        type: "primary",
        underline: (false),
        ...{ class: "ml-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    __VLS_107.slots.default;
    var __VLS_107;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item flex-row align-start" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    const __VLS_108 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        src: (__VLS_ctx.currentTask.image),
        ...{ class: "ref-image-box" },
    }));
    const __VLS_110 = __VLS_109({
        src: (__VLS_ctx.currentTask.image),
        ...{ class: "ref-image-box" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "card-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-sub-title mb-12" },
    });
    const __VLS_112 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        ...{ class: "icon" },
    }));
    const __VLS_114 = __VLS_113({
        ...{ class: "icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    const __VLS_116 = {}.Document;
    /** @type {[typeof __VLS_components.Document, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({}));
    const __VLS_118 = __VLS_117({}, ...__VLS_functionalComponentArgsRest(__VLS_117));
    var __VLS_115;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "data-grid grid-2 mb-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    const __VLS_120 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        type: "primary",
        underline: (false),
    }));
    const __VLS_122 = __VLS_121({
        type: "primary",
        underline: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_123.slots.default;
    var __VLS_123;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item flex-row justify-end" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "value" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "supplementary-box mb-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-sub-title mb-12" },
    });
    const __VLS_124 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        ...{ class: "icon" },
    }));
    const __VLS_126 = __VLS_125({
        ...{ class: "icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    const __VLS_128 = {}.Management;
    /** @type {[typeof __VLS_components.Management, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({}));
    const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
    var __VLS_127;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "feedback-list-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "list-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title" },
    });
    const __VLS_132 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        icon: "Plus",
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        icon: "Plus",
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_136;
    let __VLS_137;
    let __VLS_138;
    const __VLS_139 = {
        onClick: (__VLS_ctx.handleCustomFeedback)
    };
    __VLS_135.slots.default;
    var __VLS_135;
    const __VLS_140 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        data: (__VLS_ctx.feedbackListData),
        border: true,
        stripe: true,
        size: "small",
        ...{ class: "custom-table" },
    }));
    const __VLS_142 = __VLS_141({
        data: (__VLS_ctx.feedbackListData),
        border: true,
        stripe: true,
        size: "small",
        ...{ class: "custom-table" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    const __VLS_144 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        label: "反馈编号",
        prop: "code",
        width: "130",
        fixed: "left",
    }));
    const __VLS_146 = __VLS_145({
        label: "反馈编号",
        prop: "code",
        width: "130",
        fixed: "left",
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    const __VLS_148 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        label: "货源地",
        prop: "source",
        width: "140",
    }));
    const __VLS_150 = __VLS_149({
        label: "货源地",
        prop: "source",
        width: "140",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    const __VLS_152 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        label: "费用(类型)",
        width: "100",
    }));
    const __VLS_154 = __VLS_153({
        label: "费用(类型)",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    __VLS_155.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_155.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "fee-cell" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "fee-amt" },
        });
        (row.feeAmount);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "fee-type" },
        });
        (row.feeType);
    }
    var __VLS_155;
    const __VLS_156 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        label: "模具归属",
        prop: "moldOwnership",
        width: "80",
    }));
    const __VLS_158 = __VLS_157({
        label: "模具归属",
        prop: "moldOwnership",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    const __VLS_160 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        label: "定制用时",
        prop: "customDuration",
        width: "80",
    }));
    const __VLS_162 = __VLS_161({
        label: "定制用时",
        prop: "customDuration",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    const __VLS_164 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        label: "初次报价",
        prop: "initialQuote",
        width: "90",
    }));
    const __VLS_166 = __VLS_165({
        label: "初次报价",
        prop: "initialQuote",
        width: "90",
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    const __VLS_168 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        label: "生产周期",
        prop: "productionCycle",
        width: "80",
    }));
    const __VLS_170 = __VLS_169({
        label: "生产周期",
        prop: "productionCycle",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    const __VLS_172 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        label: "起订量",
        prop: "moq",
        width: "75",
    }));
    const __VLS_174 = __VLS_173({
        label: "起订量",
        prop: "moq",
        width: "75",
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    const __VLS_176 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
        label: "是否可退款",
        prop: "isRefundable",
        width: "90",
    }));
    const __VLS_178 = __VLS_177({
        label: "是否可退款",
        prop: "isRefundable",
        width: "90",
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    const __VLS_180 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        label: "退款条款",
        minWidth: "160",
        showOverflowTooltip: true,
    }));
    const __VLS_182 = __VLS_181({
        label: "退款条款",
        minWidth: "160",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    __VLS_183.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_183.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (row.isRefundable === '是') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "refund-cell" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "refund-method" },
            });
            (row.refundMethod);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "refund-condition" },
            });
            (row.refundCondition);
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-secondary" },
            });
        }
    }
    var __VLS_183;
    const __VLS_184 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        label: "附加条件",
        prop: "additionalConditions",
        minWidth: "160",
        showOverflowTooltip: true,
    }));
    const __VLS_186 = __VLS_185({
        label: "附加条件",
        prop: "additionalConditions",
        minWidth: "160",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    const __VLS_188 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        label: "状态",
        width: "95",
        fixed: "right",
    }));
    const __VLS_190 = __VLS_189({
        label: "状态",
        width: "95",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    __VLS_191.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_191.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_192 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
            type: (row.statusType),
            size: "small",
        }));
        const __VLS_194 = __VLS_193({
            type: (row.statusType),
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_193));
        __VLS_195.slots.default;
        (row.status);
        var __VLS_195;
    }
    var __VLS_191;
    const __VLS_196 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        label: "操作",
        width: "160",
        fixed: "right",
    }));
    const __VLS_198 = __VLS_197({
        label: "操作",
        width: "160",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    __VLS_199.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_199.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (['待提交', '已驳回'].includes(row.status)) {
            const __VLS_200 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
                type: "primary",
                link: true,
                size: "small",
            }));
            const __VLS_202 = __VLS_201({
                type: "primary",
                link: true,
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_201));
            __VLS_203.slots.default;
            var __VLS_203;
            const __VLS_204 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
                ...{ 'onClick': {} },
                type: "danger",
                link: true,
                size: "small",
            }));
            const __VLS_206 = __VLS_205({
                ...{ 'onClick': {} },
                type: "danger",
                link: true,
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_205));
            let __VLS_208;
            let __VLS_209;
            let __VLS_210;
            const __VLS_211 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentTask))
                        return;
                    if (!(['待提交', '已驳回'].includes(row.status)))
                        return;
                    __VLS_ctx.handleDeleteFeedback(row);
                }
            };
            __VLS_207.slots.default;
            var __VLS_207;
        }
        if (row.status === '已采纳') {
            if (row.feeAmount === '¥ 0.00') {
                const __VLS_212 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
                    ...{ 'onClick': {} },
                    type: "primary",
                    link: true,
                    size: "small",
                }));
                const __VLS_214 = __VLS_213({
                    ...{ 'onClick': {} },
                    type: "primary",
                    link: true,
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_213));
                let __VLS_216;
                let __VLS_217;
                let __VLS_218;
                const __VLS_219 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.currentTask))
                            return;
                        if (!(row.status === '已采纳'))
                            return;
                        if (!(row.feeAmount === '¥ 0.00'))
                            return;
                        __VLS_ctx.handleSampleRegistration(row);
                    }
                };
                __VLS_215.slots.default;
                var __VLS_215;
            }
            else {
                const __VLS_220 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
                    ...{ 'onClick': {} },
                    type: "primary",
                    link: true,
                    size: "small",
                }));
                const __VLS_222 = __VLS_221({
                    ...{ 'onClick': {} },
                    type: "primary",
                    link: true,
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_221));
                let __VLS_224;
                let __VLS_225;
                let __VLS_226;
                const __VLS_227 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.currentTask))
                            return;
                        if (!(row.status === '已采纳'))
                            return;
                        if (!!(row.feeAmount === '¥ 0.00'))
                            return;
                        __VLS_ctx.handlePurchaseApply(row);
                    }
                };
                __VLS_223.slots.default;
                var __VLS_223;
            }
            const __VLS_228 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
                ...{ 'onClick': {} },
                type: "primary",
                link: true,
                size: "small",
            }));
            const __VLS_230 = __VLS_229({
                ...{ 'onClick': {} },
                type: "primary",
                link: true,
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_229));
            let __VLS_232;
            let __VLS_233;
            let __VLS_234;
            const __VLS_235 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentTask))
                        return;
                    if (!(row.status === '已采纳'))
                        return;
                    __VLS_ctx.handleExecutionDetail(row);
                }
            };
            __VLS_231.slots.default;
            var __VLS_231;
        }
    }
    var __VLS_199;
    var __VLS_143;
}
/** @type {[typeof CustomFeedbackDialog, ]} */ ;
// @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent(CustomFeedbackDialog, new CustomFeedbackDialog({
    ref: "customFeedbackRef",
}));
const __VLS_237 = __VLS_236({
    ref: "customFeedbackRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_236));
/** @type {typeof __VLS_ctx.customFeedbackRef} */ ;
var __VLS_239 = {};
var __VLS_238;
/** @type {[typeof PurchaseApplyDialog, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(PurchaseApplyDialog, new PurchaseApplyDialog({
    ref: "purchaseApplyRef",
}));
const __VLS_242 = __VLS_241({
    ref: "purchaseApplyRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
/** @type {typeof __VLS_ctx.purchaseApplyRef} */ ;
var __VLS_244 = {};
var __VLS_243;
/** @type {[typeof SampleRegistrationDialog, ]} */ ;
// @ts-ignore
const __VLS_246 = __VLS_asFunctionalComponent(SampleRegistrationDialog, new SampleRegistrationDialog({
    ref: "sampleRegistrationRef",
}));
const __VLS_247 = __VLS_246({
    ref: "sampleRegistrationRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_246));
/** @type {typeof __VLS_ctx.sampleRegistrationRef} */ ;
var __VLS_249 = {};
var __VLS_248;
/** @type {[typeof ExecutionDetailDrawer, ]} */ ;
// @ts-ignore
const __VLS_251 = __VLS_asFunctionalComponent(ExecutionDetailDrawer, new ExecutionDetailDrawer({
    ref: "executionDetailDrawerRef",
}));
const __VLS_252 = __VLS_251({
    ref: "executionDetailDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_251));
/** @type {typeof __VLS_ctx.executionDetailDrawerRef} */ ;
var __VLS_254 = {};
var __VLS_253;
/** @type {__VLS_StyleScopedClasses['sample-task-page']} */ ;
/** @type {__VLS_StyleScopedClasses['workbench-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['side-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['side-header']} */ ;
/** @type {__VLS_StyleScopedClasses['search-box']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-container']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-summary-line']} */ ;
/** @type {__VLS_StyleScopedClasses['clock-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['count-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-card-list']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['id']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-label-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['product-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['v-line']} */ ;
/** @type {__VLS_StyleScopedClasses['tabs-scroll-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['side-body']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['id']} */ ;
/** @type {__VLS_StyleScopedClasses['days-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['product-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['v-line']} */ ;
/** @type {__VLS_StyleScopedClasses['card-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['separator-line']} */ ;
/** @type {__VLS_StyleScopedClasses['status-link']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-p0']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-level']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-method']} */ ;
/** @type {__VLS_StyleScopedClasses['product-name']} */ ;
/** @type {__VLS_StyleScopedClasses['proposal-id']} */ ;
/** @type {__VLS_StyleScopedClasses['copy-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['plain']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['plain']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['plain']} */ ;
/** @type {__VLS_StyleScopedClasses['stepper-container']} */ ;
/** @type {__VLS_StyleScopedClasses['node-main']} */ ;
/** @type {__VLS_StyleScopedClasses['circle']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['content-body']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['info-cards-row']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['no-padding-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['time-list']} */ ;
/** @type {__VLS_StyleScopedClasses['time-row']} */ ;
/** @type {__VLS_StyleScopedClasses['time-row']} */ ;
/** @type {__VLS_StyleScopedClasses['time-row']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-dotted-divider']} */ ;
/** @type {__VLS_StyleScopedClasses['card-countdown']} */ ;
/** @type {__VLS_StyleScopedClasses['cd-box']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['lab']} */ ;
/** @type {__VLS_StyleScopedClasses['cd-box']} */ ;
/** @type {__VLS_StyleScopedClasses['task']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['lab']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['data-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['value-text']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['red-star']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['align-start']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-image-box']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-sub-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['data-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['supplementary-box']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-sub-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-list-container']} */ ;
/** @type {__VLS_StyleScopedClasses['list-header']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-table']} */ ;
/** @type {__VLS_StyleScopedClasses['fee-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['fee-amt']} */ ;
/** @type {__VLS_StyleScopedClasses['fee-type']} */ ;
/** @type {__VLS_StyleScopedClasses['refund-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['refund-method']} */ ;
/** @type {__VLS_StyleScopedClasses['refund-condition']} */ ;
/** @type {__VLS_StyleScopedClasses['text-secondary']} */ ;
// @ts-ignore
var __VLS_240 = __VLS_239, __VLS_245 = __VLS_244, __VLS_250 = __VLS_249, __VLS_255 = __VLS_254;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Clock: Clock,
            CopyDocument: CopyDocument,
            Check: Check,
            Document: Document,
            Management: Management,
            CustomFeedbackDialog: CustomFeedbackDialog,
            PurchaseApplyDialog: PurchaseApplyDialog,
            SampleRegistrationDialog: SampleRegistrationDialog,
            ExecutionDetailDrawer: ExecutionDetailDrawer,
            searchQuery: searchQuery,
            activeTab: activeTab,
            currentTask: currentTask,
            customFeedbackRef: customFeedbackRef,
            purchaseApplyRef: purchaseApplyRef,
            sampleRegistrationRef: sampleRegistrationRef,
            executionDetailDrawerRef: executionDetailDrawerRef,
            statusTabs: statusTabs,
            steps: steps,
            urgentTasks: urgentTasks,
            normalTasks: normalTasks,
            getStepStatus: getStepStatus,
            handleCustomFeedback: handleCustomFeedback,
            handlePurchaseApply: handlePurchaseApply,
            handleDeleteFeedback: handleDeleteFeedback,
            handleSampleRegistration: handleSampleRegistration,
            handleExecutionDetail: handleExecutionDetail,
            feedbackListData: feedbackListData,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=sample-task.vue.js.map