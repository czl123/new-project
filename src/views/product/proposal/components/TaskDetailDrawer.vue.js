/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, nextTick, computed } from 'vue';
import { Management, Money, User, Timer, List, CircleCheckFilled, CircleClose, Warning } from '@element-plus/icons-vue';
const visible = ref(false);
const feedbackTableRef = ref();
const taskInfo = reactive({ no: '', name: '', priority: '', status: '', user: '', deadline: '' });
const handleOpened = () => { nextTick(() => { feedbackTableRef.value?.doLayout(); }); };
// 1. 跨表联动逻辑
const activeFeedbackNo = ref('');
const setHighlight = (no) => { activeFeedbackNo.value = no; };
const clearHighlight = () => { activeFeedbackNo.value = ''; };
const getRowClass = ({ row }) => {
    if (!activeFeedbackNo.value)
        return '';
    return (row.feedbackNo === activeFeedbackNo.value || row.no === activeFeedbackNo.value) ? 'row-highlight-link' : '';
};
// 2. 模拟数据
const feedbackList = reactive([{
        no: 'Task-FB-202604060', user: '汪宇', date: '2026-04-22', source: '河北省-廊坊市', moldFee: '-', sampleFee: '80', quote: '60', customCycle: '15', prodCycle: '30', moq: '1000', refundable: '是', remark: '', result: '采纳', devStatus: '已完成', devTime: '2026-04-23 14:20', devRemark: '符合 D 级标准。'
    }]);
const feeAppList = reactive([{ batch: 'GYSQPC260187', no: 'FeeApp-202604220003', channel: '供应商', refundable: '是', name: '厨房收纳架', qty: 1, moldFee: '-', sampleFee: '80', purchaseFee: '-', status: '样品待登记', audit: '同意' }]);
const sampleList = reactive([{ feedbackNo: 'Task-FB-202604060', feeNo: 'FeeApp-202604220003', sampleNo: 'S20260422-01', channel: '供应商', user: '汪宇', name: '厨房收纳架', image: 'https://picsum.photos/200/200?random=20', regTime: '2026-04-23 10:00', isValid: true, status: '已入库' }]);
const efficiencyStatus = computed(() => 'normal');
const closeInfo = reactive({ method: '正常关闭', user: '谢东桥', reason: '样品在材质耐用性与初始报价上最具优势。' });
const open = (data) => { if (data)
    Object.assign(taskInfo, data); visible.value = true; };
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ms-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['cell']} */ ;
/** @type {__VLS_StyleScopedClasses['el-table__row']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-base']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-purchase']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-dev']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onOpened': {} },
    modelValue: (__VLS_ctx.visible),
    title: "任务执行详情",
    size: "78%",
    ...{ class: "task-detail-drawer-v4" },
    destroyOnClose: (true),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onOpened': {} },
    modelValue: (__VLS_ctx.visible),
    title: "任务执行详情",
    size: "78%",
    ...{ class: "task-detail-drawer-v4" },
    destroyOnClose: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onOpened: (__VLS_ctx.handleOpened)
};
var __VLS_8 = {};
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "task-drawer-header-v4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title-main" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title-tag" },
        ...{ class: (__VLS_ctx.taskInfo.priority) },
    });
    (__VLS_ctx.taskInfo.priority);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title-text" },
    });
    (__VLS_ctx.taskInfo.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title-id" },
    });
    (__VLS_ctx.taskInfo.no);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "status-pill" },
        ...{ class: (__VLS_ctx.taskInfo.status) },
    });
    (__VLS_ctx.taskInfo.status);
}
if (__VLS_ctx.visible) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "task-main-v4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "perspective-stats" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-stat-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-icon ic-stage" },
    });
    const __VLS_9 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
    const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_12.slots.default;
    const __VLS_13 = {}.Management;
    /** @type {[typeof __VLS_components.Management, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
    var __VLS_12;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-value" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-stat-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-icon ic-fee" },
    });
    const __VLS_17 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({}));
    const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
    __VLS_20.slots.default;
    const __VLS_21 = {}.Money;
    /** @type {[typeof __VLS_components.Money, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
    const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
    var __VLS_20;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-value price" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-stat-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-icon ic-user" },
    });
    const __VLS_25 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
    const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_28.slots.default;
    const __VLS_29 = {}.User;
    /** @type {[typeof __VLS_components.User, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
    const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
    var __VLS_28;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-value user" },
    });
    (__VLS_ctx.taskInfo.user);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-stat-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-icon ic-time" },
    });
    const __VLS_33 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
    const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
    __VLS_36.slots.default;
    const __VLS_37 = {}.Timer;
    /** @type {[typeof __VLS_components.Timer, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
    const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
    var __VLS_36;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-value countdown" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "content-body-v4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "biz-module-v4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "m-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "m-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "spec-table-container" },
    });
    const __VLS_41 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        ...{ 'onCellMouseEnter': {} },
        ...{ 'onCellMouseLeave': {} },
        key: (__VLS_ctx.activeFeedbackNo),
        ref: "feedbackTableRef",
        data: (__VLS_ctx.feedbackList),
        border: true,
        size: "small",
        ...{ class: "final-spec-style-table" },
        rowClassName: (__VLS_ctx.getRowClass),
    }));
    const __VLS_43 = __VLS_42({
        ...{ 'onCellMouseEnter': {} },
        ...{ 'onCellMouseLeave': {} },
        key: (__VLS_ctx.activeFeedbackNo),
        ref: "feedbackTableRef",
        data: (__VLS_ctx.feedbackList),
        border: true,
        size: "small",
        ...{ class: "final-spec-style-table" },
        rowClassName: (__VLS_ctx.getRowClass),
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    let __VLS_45;
    let __VLS_46;
    let __VLS_47;
    const __VLS_48 = {
        onCellMouseEnter: ((row) => __VLS_ctx.setHighlight(row.no))
    };
    const __VLS_49 = {
        onCellMouseLeave: (__VLS_ctx.clearHighlight)
    };
    /** @type {typeof __VLS_ctx.feedbackTableRef} */ ;
    var __VLS_50 = {};
    __VLS_44.slots.default;
    const __VLS_52 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        label: "基础归属",
        align: "center",
        className: "bg-base",
        labelClassName: "t-base",
    }));
    const __VLS_54 = __VLS_53({
        label: "基础归属",
        align: "center",
        className: "bg-base",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    const __VLS_56 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        type: "index",
        label: "序号",
        width: "50",
        align: "center",
        labelClassName: "t-base",
    }));
    const __VLS_58 = __VLS_57({
        type: "index",
        label: "序号",
        width: "50",
        align: "center",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    const __VLS_60 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        prop: "no",
        label: "反馈编号",
        width: "160",
        align: "center",
        labelClassName: "t-base",
    }));
    const __VLS_62 = __VLS_61({
        prop: "no",
        label: "反馈编号",
        width: "160",
        align: "center",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    const __VLS_64 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        prop: "user",
        label: "采购员",
        width: "90",
        align: "center",
        labelClassName: "t-base",
    }));
    const __VLS_66 = __VLS_65({
        prop: "user",
        label: "采购员",
        width: "90",
        align: "center",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const __VLS_68 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        prop: "date",
        label: "反馈日期",
        width: "110",
        align: "center",
        labelClassName: "t-base",
    }));
    const __VLS_70 = __VLS_69({
        prop: "date",
        label: "反馈日期",
        width: "110",
        align: "center",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    var __VLS_55;
    const __VLS_72 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        label: "采购反馈详情",
        align: "center",
        className: "bg-purchase",
        labelClassName: "t-purchase",
    }));
    const __VLS_74 = __VLS_73({
        label: "采购反馈详情",
        align: "center",
        className: "bg-purchase",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    const __VLS_76 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        prop: "source",
        label: "货源地",
        width: "140",
        showOverflowTooltip: true,
        labelClassName: "t-purchase",
    }));
    const __VLS_78 = __VLS_77({
        prop: "source",
        label: "货源地",
        width: "140",
        showOverflowTooltip: true,
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    const __VLS_80 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        prop: "moldFee",
        label: "开模费",
        width: "90",
        align: "right",
        labelClassName: "t-purchase",
    }));
    const __VLS_82 = __VLS_81({
        prop: "moldFee",
        label: "开模费",
        width: "90",
        align: "right",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    const __VLS_84 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        prop: "sampleFee",
        label: "打样费",
        width: "90",
        align: "right",
        labelClassName: "t-purchase",
    }));
    const __VLS_86 = __VLS_85({
        prop: "sampleFee",
        label: "打样费",
        width: "90",
        align: "right",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    const __VLS_88 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        prop: "quote",
        label: "初始报价",
        width: "90",
        align: "right",
        labelClassName: "t-purchase",
    }));
    const __VLS_90 = __VLS_89({
        prop: "quote",
        label: "初始报价",
        width: "90",
        align: "right",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    const __VLS_92 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        prop: "customCycle",
        label: "定制周期",
        width: "85",
        align: "center",
        labelClassName: "t-purchase",
    }));
    const __VLS_94 = __VLS_93({
        prop: "customCycle",
        label: "定制周期",
        width: "85",
        align: "center",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    const __VLS_96 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        prop: "prodCycle",
        label: "生产周期",
        width: "85",
        align: "center",
        labelClassName: "t-purchase",
    }));
    const __VLS_98 = __VLS_97({
        prop: "prodCycle",
        label: "生产周期",
        width: "85",
        align: "center",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    const __VLS_100 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        prop: "moq",
        label: "起订量",
        width: "90",
        align: "center",
        labelClassName: "t-purchase",
    }));
    const __VLS_102 = __VLS_101({
        prop: "moq",
        label: "起订量",
        width: "90",
        align: "center",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    const __VLS_104 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        prop: "refundable",
        label: "是否可退款",
        width: "100",
        align: "center",
        labelClassName: "t-purchase",
    }));
    const __VLS_106 = __VLS_105({
        prop: "refundable",
        label: "是否可退款",
        width: "100",
        align: "center",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    const __VLS_108 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        prop: "remark",
        label: "附加条件",
        width: "150",
        showOverflowTooltip: true,
        labelClassName: "t-purchase",
    }));
    const __VLS_110 = __VLS_109({
        prop: "remark",
        label: "附加条件",
        width: "150",
        showOverflowTooltip: true,
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    var __VLS_75;
    const __VLS_112 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        label: "开发反馈信息",
        align: "center",
        className: "bg-dev",
        labelClassName: "t-dev",
    }));
    const __VLS_114 = __VLS_113({
        label: "开发反馈信息",
        align: "center",
        className: "bg-dev",
        labelClassName: "t-dev",
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    const __VLS_116 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        prop: "result",
        label: "反馈结果",
        width: "100",
        align: "center",
        labelClassName: "t-dev",
    }));
    const __VLS_118 = __VLS_117({
        prop: "result",
        label: "反馈结果",
        width: "100",
        align: "center",
        labelClassName: "t-dev",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_119.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "res-mini-tag" },
            ...{ class: ({ 'is-ok': row.result === '采纳' }) },
        });
        (row.result);
    }
    var __VLS_119;
    const __VLS_120 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        prop: "devStatus",
        label: "反馈状态",
        width: "90",
        align: "center",
        labelClassName: "t-dev",
    }));
    const __VLS_122 = __VLS_121({
        prop: "devStatus",
        label: "反馈状态",
        width: "90",
        align: "center",
        labelClassName: "t-dev",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    const __VLS_124 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        prop: "devTime",
        label: "反馈时间",
        width: "145",
        align: "center",
        labelClassName: "t-dev",
    }));
    const __VLS_126 = __VLS_125({
        prop: "devTime",
        label: "反馈时间",
        width: "145",
        align: "center",
        labelClassName: "t-dev",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    const __VLS_128 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        prop: "devRemark",
        label: "反馈说明",
        width: "280",
        showOverflowTooltip: true,
        labelClassName: "t-dev",
    }));
    const __VLS_130 = __VLS_129({
        prop: "devRemark",
        label: "反馈说明",
        width: "280",
        showOverflowTooltip: true,
        labelClassName: "t-dev",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    var __VLS_115;
    var __VLS_44;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "biz-module-v4 mt-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "m-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "m-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "spec-table-container" },
    });
    const __VLS_132 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        ...{ 'onCellMouseEnter': {} },
        ...{ 'onCellMouseLeave': {} },
        key: (__VLS_ctx.activeFeedbackNo),
        data: (__VLS_ctx.feeAppList),
        border: true,
        size: "small",
        ...{ class: "final-spec-style-table" },
        rowClassName: (__VLS_ctx.getRowClass),
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onCellMouseEnter': {} },
        ...{ 'onCellMouseLeave': {} },
        key: (__VLS_ctx.activeFeedbackNo),
        data: (__VLS_ctx.feeAppList),
        border: true,
        size: "small",
        ...{ class: "final-spec-style-table" },
        rowClassName: (__VLS_ctx.getRowClass),
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_136;
    let __VLS_137;
    let __VLS_138;
    const __VLS_139 = {
        onCellMouseEnter: ((row) => __VLS_ctx.setHighlight(row.no))
    };
    const __VLS_140 = {
        onCellMouseLeave: (__VLS_ctx.clearHighlight)
    };
    __VLS_135.slots.default;
    const __VLS_141 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
        label: "申请基础",
        align: "center",
        className: "bg-base",
        labelClassName: "t-base",
    }));
    const __VLS_143 = __VLS_142({
        label: "申请基础",
        align: "center",
        className: "bg-base",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    __VLS_144.slots.default;
    const __VLS_145 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
        type: "index",
        label: "序号",
        width: "50",
        align: "center",
        labelClassName: "t-base",
    }));
    const __VLS_147 = __VLS_146({
        type: "index",
        label: "序号",
        width: "50",
        align: "center",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_146));
    const __VLS_149 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
        prop: "batch",
        label: "费用申请批次",
        width: "120",
        labelClassName: "t-base",
    }));
    const __VLS_151 = __VLS_150({
        prop: "batch",
        label: "费用申请批次",
        width: "120",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_150));
    const __VLS_153 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
        prop: "no",
        label: "费用申请编号",
        width: "150",
        labelClassName: "t-base",
    }));
    const __VLS_155 = __VLS_154({
        prop: "no",
        label: "费用申请编号",
        width: "150",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_154));
    const __VLS_157 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
        prop: "channel",
        label: "拿样渠道",
        width: "100",
        align: "center",
        labelClassName: "t-base",
    }));
    const __VLS_159 = __VLS_158({
        prop: "channel",
        label: "拿样渠道",
        width: "100",
        align: "center",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    const __VLS_161 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
        prop: "refundable",
        label: "是否可退款",
        width: "100",
        align: "center",
        labelClassName: "t-base",
    }));
    const __VLS_163 = __VLS_162({
        prop: "refundable",
        label: "是否可退款",
        width: "100",
        align: "center",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_162));
    var __VLS_144;
    const __VLS_165 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
        label: "样品详情",
        align: "center",
        className: "bg-purchase",
        labelClassName: "t-purchase",
    }));
    const __VLS_167 = __VLS_166({
        label: "样品详情",
        align: "center",
        className: "bg-purchase",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_166));
    __VLS_168.slots.default;
    const __VLS_169 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
        prop: "name",
        label: "样品名称",
        minWidth: "180",
        showOverflowTooltip: true,
        labelClassName: "t-purchase",
    }));
    const __VLS_171 = __VLS_170({
        prop: "name",
        label: "样品名称",
        minWidth: "180",
        showOverflowTooltip: true,
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
    const __VLS_173 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
        prop: "qty",
        label: "购样数量",
        width: "80",
        align: "center",
        labelClassName: "t-purchase",
    }));
    const __VLS_175 = __VLS_174({
        prop: "qty",
        label: "购样数量",
        width: "80",
        align: "center",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_174));
    const __VLS_177 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
        prop: "moldFee",
        label: "开模费",
        width: "85",
        align: "right",
        labelClassName: "t-purchase",
    }));
    const __VLS_179 = __VLS_178({
        prop: "moldFee",
        label: "开模费",
        width: "85",
        align: "right",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_178));
    const __VLS_181 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
        prop: "sampleFee",
        label: "打样费",
        width: "85",
        align: "right",
        labelClassName: "t-purchase",
    }));
    const __VLS_183 = __VLS_182({
        prop: "sampleFee",
        label: "打样费",
        width: "85",
        align: "right",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_182));
    const __VLS_185 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
        prop: "purchaseFee",
        label: "购样费",
        width: "85",
        align: "right",
        labelClassName: "t-purchase",
    }));
    const __VLS_187 = __VLS_186({
        prop: "purchaseFee",
        label: "购样费",
        width: "85",
        align: "right",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_186));
    var __VLS_168;
    const __VLS_189 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
        label: "申请状态",
        align: "center",
        className: "bg-dev",
        labelClassName: "t-dev",
    }));
    const __VLS_191 = __VLS_190({
        label: "申请状态",
        align: "center",
        className: "bg-dev",
        labelClassName: "t-dev",
    }, ...__VLS_functionalComponentArgsRest(__VLS_190));
    __VLS_192.slots.default;
    const __VLS_193 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
        prop: "status",
        label: "状态",
        width: "100",
        align: "center",
        labelClassName: "t-dev",
    }));
    const __VLS_195 = __VLS_194({
        prop: "status",
        label: "状态",
        width: "100",
        align: "center",
        labelClassName: "t-dev",
    }, ...__VLS_functionalComponentArgsRest(__VLS_194));
    const __VLS_197 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
        prop: "audit",
        label: "审核结果",
        width: "90",
        align: "center",
        labelClassName: "t-dev",
    }));
    const __VLS_199 = __VLS_198({
        prop: "audit",
        label: "审核结果",
        width: "90",
        align: "center",
        labelClassName: "t-dev",
    }, ...__VLS_functionalComponentArgsRest(__VLS_198));
    __VLS_200.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_200.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: ({ 'text-success': row.audit === '同意' }) },
        });
        (row.audit);
    }
    var __VLS_200;
    var __VLS_192;
    var __VLS_135;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "biz-module-v4 mt-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "m-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "m-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "m-stats-cards-v4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ms-card" },
    });
    const __VLS_201 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
        ...{ class: "ms-icon ic-total" },
    }));
    const __VLS_203 = __VLS_202({
        ...{ class: "ms-icon ic-total" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_202));
    __VLS_204.slots.default;
    const __VLS_205 = {}.List;
    /** @type {[typeof __VLS_components.List, ]} */ ;
    // @ts-ignore
    const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({}));
    const __VLS_207 = __VLS_206({}, ...__VLS_functionalComponentArgsRest(__VLS_206));
    var __VLS_204;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ms-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ms-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({
        ...{ class: "ms-value" },
    });
    (__VLS_ctx.sampleList.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ms-card success" },
    });
    const __VLS_209 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
        ...{ class: "ms-icon ic-success" },
    }));
    const __VLS_211 = __VLS_210({
        ...{ class: "ms-icon ic-success" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_210));
    __VLS_212.slots.default;
    const __VLS_213 = {}.CircleCheckFilled;
    /** @type {[typeof __VLS_components.CircleCheckFilled, ]} */ ;
    // @ts-ignore
    const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({}));
    const __VLS_215 = __VLS_214({}, ...__VLS_functionalComponentArgsRest(__VLS_214));
    var __VLS_212;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ms-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ms-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({
        ...{ class: "ms-value" },
    });
    (__VLS_ctx.sampleList.filter(s => s.isValid).length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ms-card info" },
    });
    const __VLS_217 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
        ...{ class: "ms-icon ic-info" },
    }));
    const __VLS_219 = __VLS_218({
        ...{ class: "ms-icon ic-info" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_218));
    __VLS_220.slots.default;
    const __VLS_221 = {}.CircleClose;
    /** @type {[typeof __VLS_components.CircleClose, ]} */ ;
    // @ts-ignore
    const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({}));
    const __VLS_223 = __VLS_222({}, ...__VLS_functionalComponentArgsRest(__VLS_222));
    var __VLS_220;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ms-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ms-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({
        ...{ class: "ms-value" },
    });
    (__VLS_ctx.sampleList.filter(s => !s.isValid).length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ms-card warning" },
        ...{ class: ({ 'is-shining': __VLS_ctx.efficiencyStatus === 'normal' }) },
    });
    const __VLS_225 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
        ...{ class: "ms-icon ic-warning" },
    }));
    const __VLS_227 = __VLS_226({
        ...{ class: "ms-icon ic-warning" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_226));
    __VLS_228.slots.default;
    const __VLS_229 = {}.Timer;
    /** @type {[typeof __VLS_components.Timer, ]} */ ;
    // @ts-ignore
    const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({}));
    const __VLS_231 = __VLS_230({}, ...__VLS_functionalComponentArgsRest(__VLS_230));
    var __VLS_228;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ms-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ms-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({
        ...{ class: "ms-value" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ms-card danger" },
    });
    const __VLS_233 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_234 = __VLS_asFunctionalComponent(__VLS_233, new __VLS_233({
        ...{ class: "ms-icon ic-danger" },
    }));
    const __VLS_235 = __VLS_234({
        ...{ class: "ms-icon ic-danger" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_234));
    __VLS_236.slots.default;
    const __VLS_237 = {}.Warning;
    /** @type {[typeof __VLS_components.Warning, ]} */ ;
    // @ts-ignore
    const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({}));
    const __VLS_239 = __VLS_238({}, ...__VLS_functionalComponentArgsRest(__VLS_238));
    var __VLS_236;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ms-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ms-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({
        ...{ class: "ms-value" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "spec-table-container" },
    });
    const __VLS_241 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
        data: (__VLS_ctx.sampleList),
        border: true,
        size: "small",
        ...{ class: "final-spec-style-table" },
        rowClassName: (__VLS_ctx.getRowClass),
    }));
    const __VLS_243 = __VLS_242({
        data: (__VLS_ctx.sampleList),
        border: true,
        size: "small",
        ...{ class: "final-spec-style-table" },
        rowClassName: (__VLS_ctx.getRowClass),
    }, ...__VLS_functionalComponentArgsRest(__VLS_242));
    __VLS_244.slots.default;
    const __VLS_245 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_246 = __VLS_asFunctionalComponent(__VLS_245, new __VLS_245({
        label: "关联归属",
        align: "center",
        className: "bg-base",
        labelClassName: "t-base",
    }));
    const __VLS_247 = __VLS_246({
        label: "关联归属",
        align: "center",
        className: "bg-base",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_246));
    __VLS_248.slots.default;
    const __VLS_249 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_250 = __VLS_asFunctionalComponent(__VLS_249, new __VLS_249({
        type: "index",
        label: "序号",
        width: "50",
        align: "center",
        labelClassName: "t-base",
    }));
    const __VLS_251 = __VLS_250({
        type: "index",
        label: "序号",
        width: "50",
        align: "center",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_250));
    const __VLS_253 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_254 = __VLS_asFunctionalComponent(__VLS_253, new __VLS_253({
        prop: "feedbackNo",
        label: "反馈编号",
        width: "150",
        labelClassName: "t-base",
    }));
    const __VLS_255 = __VLS_254({
        prop: "feedbackNo",
        label: "反馈编号",
        width: "150",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_254));
    const __VLS_257 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({
        prop: "feeNo",
        label: "费用申请编号",
        width: "160",
        labelClassName: "t-base",
    }));
    const __VLS_259 = __VLS_258({
        prop: "feeNo",
        label: "费用申请编号",
        width: "160",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_258));
    const __VLS_261 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
        prop: "sampleNo",
        label: "样品编号",
        width: "130",
        labelClassName: "t-base",
    }));
    const __VLS_263 = __VLS_262({
        prop: "sampleNo",
        label: "样品编号",
        width: "130",
        labelClassName: "t-base",
    }, ...__VLS_functionalComponentArgsRest(__VLS_262));
    var __VLS_248;
    const __VLS_265 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_266 = __VLS_asFunctionalComponent(__VLS_265, new __VLS_265({
        label: "采集详情",
        align: "center",
        className: "bg-purchase",
        labelClassName: "t-purchase",
    }));
    const __VLS_267 = __VLS_266({
        label: "采集详情",
        align: "center",
        className: "bg-purchase",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_266));
    __VLS_268.slots.default;
    const __VLS_269 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_270 = __VLS_asFunctionalComponent(__VLS_269, new __VLS_269({
        label: "实物图",
        width: "70",
        align: "center",
        labelClassName: "t-purchase",
    }));
    const __VLS_271 = __VLS_270({
        label: "实物图",
        width: "70",
        align: "center",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_270));
    __VLS_272.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_272.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_273 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        const __VLS_274 = __VLS_asFunctionalComponent(__VLS_273, new __VLS_273({
            src: (row.image),
            previewSrcList: ([row.image]),
            previewTeleported: (true),
            ...{ class: "sample-mini-img" },
            fit: "cover",
        }));
        const __VLS_275 = __VLS_274({
            src: (row.image),
            previewSrcList: ([row.image]),
            previewTeleported: (true),
            ...{ class: "sample-mini-img" },
            fit: "cover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_274));
    }
    var __VLS_272;
    const __VLS_277 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_278 = __VLS_asFunctionalComponent(__VLS_277, new __VLS_277({
        prop: "channel",
        label: "拿样渠道",
        width: "100",
        align: "center",
        labelClassName: "t-purchase",
    }));
    const __VLS_279 = __VLS_278({
        prop: "channel",
        label: "拿样渠道",
        width: "100",
        align: "center",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_278));
    const __VLS_281 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_282 = __VLS_asFunctionalComponent(__VLS_281, new __VLS_281({
        prop: "user",
        label: "拿样人",
        width: "90",
        align: "center",
        labelClassName: "t-purchase",
    }));
    const __VLS_283 = __VLS_282({
        prop: "user",
        label: "拿样人",
        width: "90",
        align: "center",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_282));
    const __VLS_285 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_286 = __VLS_asFunctionalComponent(__VLS_285, new __VLS_285({
        prop: "name",
        label: "样品名称",
        minWidth: "180",
        showOverflowTooltip: true,
        labelClassName: "t-purchase",
    }));
    const __VLS_287 = __VLS_286({
        prop: "name",
        label: "样品名称",
        minWidth: "180",
        showOverflowTooltip: true,
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_286));
    const __VLS_289 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_290 = __VLS_asFunctionalComponent(__VLS_289, new __VLS_289({
        prop: "regTime",
        label: "登记时间",
        width: "140",
        align: "center",
        labelClassName: "t-purchase",
    }));
    const __VLS_291 = __VLS_290({
        prop: "regTime",
        label: "登记时间",
        width: "140",
        align: "center",
        labelClassName: "t-purchase",
    }, ...__VLS_functionalComponentArgsRest(__VLS_290));
    var __VLS_268;
    const __VLS_293 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_294 = __VLS_asFunctionalComponent(__VLS_293, new __VLS_293({
        label: "入库状态",
        align: "center",
        className: "bg-dev",
        labelClassName: "t-dev",
    }));
    const __VLS_295 = __VLS_294({
        label: "入库状态",
        align: "center",
        className: "bg-dev",
        labelClassName: "t-dev",
    }, ...__VLS_functionalComponentArgsRest(__VLS_294));
    __VLS_296.slots.default;
    const __VLS_297 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_298 = __VLS_asFunctionalComponent(__VLS_297, new __VLS_297({
        prop: "isValid",
        label: "是否有效",
        width: "90",
        align: "center",
        labelClassName: "t-dev",
    }));
    const __VLS_299 = __VLS_298({
        prop: "isValid",
        label: "是否有效",
        width: "90",
        align: "center",
        labelClassName: "t-dev",
    }, ...__VLS_functionalComponentArgsRest(__VLS_298));
    __VLS_300.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_300.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (row.isValid) {
            const __VLS_301 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_302 = __VLS_asFunctionalComponent(__VLS_301, new __VLS_301({
                size: "mini",
                type: "success",
                effect: "dark",
            }));
            const __VLS_303 = __VLS_302({
                size: "mini",
                type: "success",
                effect: "dark",
            }, ...__VLS_functionalComponentArgsRest(__VLS_302));
            __VLS_304.slots.default;
            var __VLS_304;
        }
        else {
            const __VLS_305 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_306 = __VLS_asFunctionalComponent(__VLS_305, new __VLS_305({
                size: "mini",
                type: "info",
            }));
            const __VLS_307 = __VLS_306({
                size: "mini",
                type: "info",
            }, ...__VLS_functionalComponentArgsRest(__VLS_306));
            __VLS_308.slots.default;
            var __VLS_308;
        }
    }
    var __VLS_300;
    const __VLS_309 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_310 = __VLS_asFunctionalComponent(__VLS_309, new __VLS_309({
        prop: "status",
        label: "样品状态",
        width: "100",
        align: "center",
        labelClassName: "t-dev",
    }));
    const __VLS_311 = __VLS_310({
        prop: "status",
        label: "样品状态",
        width: "100",
        align: "center",
        labelClassName: "t-dev",
    }, ...__VLS_functionalComponentArgsRest(__VLS_310));
    var __VLS_296;
    var __VLS_244;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "biz-module-v4 mt-20 conclusion-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "m-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "m-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "conclusion-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "c-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "c-col" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.closeInfo.method);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "c-col" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.closeInfo.user);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "c-col" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "c-row mt-12" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "c-col full" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.closeInfo.reason);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "conclusion-stamp" },
    });
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['task-detail-drawer-v4']} */ ;
/** @type {__VLS_StyleScopedClasses['task-drawer-header-v4']} */ ;
/** @type {__VLS_StyleScopedClasses['title-main']} */ ;
/** @type {__VLS_StyleScopedClasses['title-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['title-text']} */ ;
/** @type {__VLS_StyleScopedClasses['title-id']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['status-pill']} */ ;
/** @type {__VLS_StyleScopedClasses['task-main-v4']} */ ;
/** @type {__VLS_StyleScopedClasses['perspective-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['p-stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ic-stage']} */ ;
/** @type {__VLS_StyleScopedClasses['p-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ic-fee']} */ ;
/** @type {__VLS_StyleScopedClasses['p-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
/** @type {__VLS_StyleScopedClasses['p-stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ic-user']} */ ;
/** @type {__VLS_StyleScopedClasses['p-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['user']} */ ;
/** @type {__VLS_StyleScopedClasses['p-stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ic-time']} */ ;
/** @type {__VLS_StyleScopedClasses['p-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['countdown']} */ ;
/** @type {__VLS_StyleScopedClasses['content-body-v4']} */ ;
/** @type {__VLS_StyleScopedClasses['biz-module-v4']} */ ;
/** @type {__VLS_StyleScopedClasses['m-header']} */ ;
/** @type {__VLS_StyleScopedClasses['m-title']} */ ;
/** @type {__VLS_StyleScopedClasses['spec-table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['final-spec-style-table']} */ ;
/** @type {__VLS_StyleScopedClasses['res-mini-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['biz-module-v4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-20']} */ ;
/** @type {__VLS_StyleScopedClasses['m-header']} */ ;
/** @type {__VLS_StyleScopedClasses['m-title']} */ ;
/** @type {__VLS_StyleScopedClasses['spec-table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['final-spec-style-table']} */ ;
/** @type {__VLS_StyleScopedClasses['biz-module-v4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-20']} */ ;
/** @type {__VLS_StyleScopedClasses['m-header']} */ ;
/** @type {__VLS_StyleScopedClasses['m-title']} */ ;
/** @type {__VLS_StyleScopedClasses['m-stats-cards-v4']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ic-total']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-card']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ic-success']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-card']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ic-info']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-card']} */ ;
/** @type {__VLS_StyleScopedClasses['warning']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ic-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-card']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ic-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-content']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ms-value']} */ ;
/** @type {__VLS_StyleScopedClasses['spec-table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['final-spec-style-table']} */ ;
/** @type {__VLS_StyleScopedClasses['sample-mini-img']} */ ;
/** @type {__VLS_StyleScopedClasses['biz-module-v4']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-20']} */ ;
/** @type {__VLS_StyleScopedClasses['conclusion-card']} */ ;
/** @type {__VLS_StyleScopedClasses['m-header']} */ ;
/** @type {__VLS_StyleScopedClasses['m-title']} */ ;
/** @type {__VLS_StyleScopedClasses['conclusion-content']} */ ;
/** @type {__VLS_StyleScopedClasses['c-row']} */ ;
/** @type {__VLS_StyleScopedClasses['c-col']} */ ;
/** @type {__VLS_StyleScopedClasses['c-col']} */ ;
/** @type {__VLS_StyleScopedClasses['c-col']} */ ;
/** @type {__VLS_StyleScopedClasses['c-row']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['c-col']} */ ;
/** @type {__VLS_StyleScopedClasses['full']} */ ;
/** @type {__VLS_StyleScopedClasses['conclusion-stamp']} */ ;
// @ts-ignore
var __VLS_51 = __VLS_50;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Management: Management,
            Money: Money,
            User: User,
            Timer: Timer,
            List: List,
            CircleCheckFilled: CircleCheckFilled,
            CircleClose: CircleClose,
            Warning: Warning,
            visible: visible,
            feedbackTableRef: feedbackTableRef,
            taskInfo: taskInfo,
            handleOpened: handleOpened,
            activeFeedbackNo: activeFeedbackNo,
            setHighlight: setHighlight,
            clearHighlight: clearHighlight,
            getRowClass: getRowClass,
            feedbackList: feedbackList,
            feeAppList: feeAppList,
            sampleList: sampleList,
            efficiencyStatus: efficiencyStatus,
            closeInfo: closeInfo,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TaskDetailDrawer.vue.js.map