/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { Document, Check, ArrowRight, Plus, ShoppingCart, List, Edit, Calendar, User } from '@element-plus/icons-vue';
import PurchaseDetailDialog from './PurchaseDetailDialog.vue';
import PurchaseApplyDialog from './PurchaseApplyDialog.vue';
import SampleRegistrationDialog from './SampleRegistrationDialog.vue';
import SampleRegistrationDetailDialog from './SampleRegistrationDetailDialog.vue';
const purchaseDetailRef = ref(null);
const purchaseApplyRef = ref(null);
const sampleRegistrationRef = ref(null);
const sampleRegistrationDetailRef = ref(null);
const handlePurchaseApplyDetail = (row) => purchaseDetailRef.value?.open(row);
const handleEditPurchase = (row) => purchaseApplyRef.value?.open(row);
const handleSampleRegistrationDetail = (row) => sampleRegistrationDetailRef.value?.open({ ...row, proposalNo: feedbackData.value?.code });
const handleEditSampleRegistration = (row) => sampleRegistrationRef.value?.open(row);
const handleRegisterSampleDirect = (row) => {
    sampleRegistrationRef.value?.open({
        isPurchaseSync: true,
        proposalNo: feedbackData.value?.code,
        productName: row.sampleName,
        supplierName: row.supplier,
        purchaseUrl: row.purchaseUrl,
        sampleFee: parseFloat((row.price || '0').replace(/[^\d.]/g, '')) || 0
    });
};
const handlePurchaseApplySubmit = (items) => {
    if (!items)
        return;
    items.forEach(item => {
        const idx = purchaseList.value.findIndex(p => p.applyNo === item.applyNo);
        if (idx !== -1) {
            purchaseList.value[idx] = { ...purchaseList.value[idx], ...item };
        }
        else {
            const newApplyNo = 'PO-NEW-' + Date.now();
            purchaseList.value.push({ ...item, applyNo: newApplyNo, registrations: [], approvalNodes: [] });
            selectedCategory.value = 'purchase';
            selectedApplyNo.value = newApplyNo;
        }
    });
};
const visible = ref(false);
const feedbackData = ref(null);
const purchaseList = ref([]);
const directRegistrations = ref([]);
const selectedCategory = ref('purchase');
const selectedApplyNo = ref('');
const selectedApply = computed(() => {
    const row = purchaseList.value.find(p => p.applyNo === selectedApplyNo.value);
    if (!row)
        return null;
    // 补齐查看详情时可能缺失的默认字段数据，以展示完整的多渠道特异信息
    const defaultBank = {
        paymentMethod: '银行转账',
        bankName: '中国工商银行义乌支行',
        accountName: row.supplier || '义乌市得力商贸服务部',
        bankAccount: '6217 0038 9001 0293 848'
    };
    const defaultRefund = {
        isRefundable: row.status === '已通过',
        refundMethod: '抵扣首单货款',
        refundCondition: '首批大货订单满1000件返还'
    };
    return {
        ...defaultBank,
        ...defaultRefund,
        ...row,
        // 如果是 1688 / 淘宝，我们配给它对应的付款截图或店铺名
        shopName: row.channel !== '供应商' ? `${row.channel}优质货源店` : '',
        orderScreenshot: row.channel !== '供应商' ? 'https://picsum.photos/300/200?random=40' : '',
        paymentQrCode: (row.paymentQrCodes && row.paymentQrCodes.length > 0) ? row.paymentQrCodes[0] : (row.paymentQrCode || (['支付宝', '微信'].includes(row.paymentMethod) ? 'https://picsum.photos/200/200?random=50' : ''))
    };
});
const drawerSize = computed(() => (purchaseList.value.length === 1 || (purchaseList.value.length === 0 && directRegistrations.value.length > 0)) ? '1100px' : '1250px');
const getCurrentPathStep = () => {
    if (getTotalRegCount() > 0)
        return 3;
    if (purchaseList.value.length > 0)
        return 2;
    return 1;
};
const getStepStatus = (stepNum) => {
    const current = getCurrentPathStep();
    if (current > stepNum)
        return 'completed';
    if (current === stepNum)
        return 'active';
    return 'pending';
};
const getTotalRegCount = () => (purchaseList.value.reduce((acc, p) => acc + (p.registrations?.length || 0), 0) + directRegistrations.value.length);
const open = (row) => {
    feedbackData.value = row;
    if (row.feeAmount === '¥ 0.00') {
        purchaseList.value = [];
        directRegistrations.value = [{ regNo: 'DJ-20260522-71', name: row.additionalConditions || '样品打样件', source: '供应商', sampleFee: '¥ 0.00', sampleStatus: '合格', receiveTime: '2026-05-24 10:00', receiver: '李四' }];
        selectedCategory.value = 'direct';
        selectedApplyNo.value = '';
    }
    else {
        directRegistrations.value = [];
        purchaseList.value = [{ applyNo: 'PO-20260520-01', sampleName: 'DIY灯光板 - 款式A', channel: '供应商', supplier: row.source, qty: 1, price: '¥ 50.00', amount: row.feeAmount, status: '已通过', applyTime: '2026-05-21 14:00', registrations: [{ regNo: 'DJ-20260522-11', pattern: '复古雕花', color: '曜石黑', spec: '通用', status: '待提交', image: 'https://picsum.photos/60/60?random=1' }], approvalNodes: [{ nodeName: "提交申请", operator: "张三", time: "2026-05-21 14:00", status: "completed" }, { nodeName: "部门主管审批", operator: "经理", time: "2026-05-21 15:30", status: "completed" }] }];
        selectedCategory.value = 'purchase';
        selectedApplyNo.value = purchaseList.value[0]?.applyNo || '';
    }
    visible.value = true;
};
const getStatusTagType = (status) => status === '已通过' ? 'success' : (status === '审批中' ? 'warning' : 'info');
const formatTimeWithoutYear = (ts) => ts.split(' ').length === 2 ? ts.split(' ')[0].split('-').slice(1).join('-') + ' ' + ts.split(' ')[1] : ts;
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['nav-item-top']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-no']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-node-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-node-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline-line']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline-line']} */ ;
/** @type {__VLS_StyleScopedClasses['node-bullet']} */ ;
/** @type {__VLS_StyleScopedClasses['node-content']} */ ;
/** @type {__VLS_StyleScopedClasses['node-title']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline-line']} */ ;
/** @type {__VLS_StyleScopedClasses['node-bullet']} */ ;
/** @type {__VLS_StyleScopedClasses['node-content']} */ ;
/** @type {__VLS_StyleScopedClasses['node-title']} */ ;
/** @type {__VLS_StyleScopedClasses['node-bullet']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['warning']} */ ;
/** @type {__VLS_StyleScopedClasses['text-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    size: (__VLS_ctx.drawerSize),
    destroyOnClose: true,
    ...{ class: "premium-drawer" },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    size: (__VLS_ctx.drawerSize),
    destroyOnClose: true,
    ...{ class: "premium-drawer" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "drawer-header-v4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title-main" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title-icon" },
    });
    const __VLS_5 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
    const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_8.slots.default;
    const __VLS_9 = {}.Document;
    /** @type {[typeof __VLS_components.Document, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
    const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
    var __VLS_8;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title-divider" },
    });
    if (__VLS_ctx.feedbackData) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-sub" },
        });
        (__VLS_ctx.feedbackData.code);
    }
}
if (__VLS_ctx.feedbackData) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "workspace-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "workspace-sidebar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "sidebar-block context-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "block-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "block-title-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "context-details" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "ctx-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ctx-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "ctx-value font-mono" },
    });
    (__VLS_ctx.feedbackData.code);
    if (__VLS_ctx.feedbackData.source) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "ctx-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "ctx-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "ctx-value" },
        });
        (__VLS_ctx.feedbackData.source);
    }
    if (__VLS_ctx.feedbackData.feeAmount) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "ctx-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "ctx-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "ctx-value price-highlight" },
        });
        (__VLS_ctx.feedbackData.feeAmount);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "quick-kpis" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-box" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "kpi-num" },
    });
    (__VLS_ctx.purchaseList.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "kpi-lbl" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-box" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "kpi-num" },
    });
    (__VLS_ctx.getTotalRegCount());
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "kpi-lbl" },
    });
    if (__VLS_ctx.purchaseList.length > 0 || __VLS_ctx.directRegistrations.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "sidebar-block nav-list-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "block-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "block-title-text" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "master-navigation-list" },
        });
        if (__VLS_ctx.purchaseList.length > 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "nav-section-title" },
            });
            const __VLS_13 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
                ...{ class: "mr-4" },
            }));
            const __VLS_15 = __VLS_14({
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_14));
            __VLS_16.slots.default;
            const __VLS_17 = {}.ShoppingCart;
            /** @type {[typeof __VLS_components.ShoppingCart, ]} */ ;
            // @ts-ignore
            const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({}));
            const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
            var __VLS_16;
            (__VLS_ctx.purchaseList.length);
        }
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.purchaseList))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.feedbackData))
                            return;
                        if (!(__VLS_ctx.purchaseList.length > 0 || __VLS_ctx.directRegistrations.length > 0))
                            return;
                        __VLS_ctx.selectedCategory = 'purchase';
                        __VLS_ctx.selectedApplyNo = item.applyNo;
                    } },
                key: (item.applyNo),
                ...{ class: "master-nav-item" },
                ...{ class: ({ active: __VLS_ctx.selectedCategory === 'purchase' && __VLS_ctx.selectedApplyNo === item.applyNo }) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "nav-item-top" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "nav-item-no" },
            });
            (item.applyNo);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: (['nav-status-dot', __VLS_ctx.getStatusTagType(item.status)]) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "nav-item-name" },
            });
            (item.sampleName);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "nav-item-footer" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "nav-price" },
            });
            (item.amount);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "nav-reg-count" },
            });
            (item.registrations?.length || 0);
            if (item.approvalNodes && item.approvalNodes.length > 0) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "nav-item-approval-nodes" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "approval-nodes-flow" },
                });
                for (const [node, nIdx] of __VLS_getVForSourceType((item.approvalNodes))) {
                    (nIdx);
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "mini-node" },
                        ...{ class: (node.status) },
                        title: (node.nodeName + (node.operator ? ' (' + node.operator + ')' : '')),
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "mini-node-dot" },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "mini-node-text" },
                    });
                    (node.nodeName);
                    if (nIdx < item.approvalNodes.length - 1) {
                        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                            ...{ class: "node-arrow" },
                        });
                        const __VLS_21 = {}.ElIcon;
                        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                        // @ts-ignore
                        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
                        const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
                        __VLS_24.slots.default;
                        const __VLS_25 = {}.ArrowRight;
                        /** @type {[typeof __VLS_components.ArrowRight, ]} */ ;
                        // @ts-ignore
                        const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({}));
                        const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
                        var __VLS_24;
                    }
                }
            }
        }
        if (__VLS_ctx.directRegistrations.length > 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "nav-section-title mt-16" },
            });
            const __VLS_29 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
                ...{ class: "mr-4" },
            }));
            const __VLS_31 = __VLS_30({
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_30));
            __VLS_32.slots.default;
            const __VLS_33 = {}.List;
            /** @type {[typeof __VLS_components.List, ]} */ ;
            // @ts-ignore
            const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
            const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
            var __VLS_32;
        }
        if (__VLS_ctx.directRegistrations.length > 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.feedbackData))
                            return;
                        if (!(__VLS_ctx.purchaseList.length > 0 || __VLS_ctx.directRegistrations.length > 0))
                            return;
                        if (!(__VLS_ctx.directRegistrations.length > 0))
                            return;
                        __VLS_ctx.selectedCategory = 'direct';
                        __VLS_ctx.selectedApplyNo = '';
                    } },
                ...{ class: "master-nav-item" },
                ...{ class: ({ active: __VLS_ctx.selectedCategory === 'direct' }) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "nav-item-top" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "nav-item-no" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "nav-status-dot success" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "nav-item-name" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "nav-item-footer" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "nav-price" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "nav-reg-count" },
            });
            (__VLS_ctx.directRegistrations.length);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "sidebar-block path-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "block-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "block-title-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "vertical-timeline mt-16" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "timeline-node-item" },
        ...{ class: ('status-' + __VLS_ctx.getStepStatus(1)) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "timeline-line" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-bullet" },
    });
    if (__VLS_ctx.getStepStatus(1) === 'completed') {
        const __VLS_37 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
        const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
        __VLS_40.slots.default;
        const __VLS_41 = {}.Check;
        /** @type {[typeof __VLS_components.Check, ]} */ ;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({}));
        const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
        var __VLS_40;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-desc" },
    });
    (__VLS_ctx.feedbackData.code);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "timeline-node-item" },
        ...{ class: ('status-' + __VLS_ctx.getStepStatus(2)) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "timeline-line" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-bullet" },
    });
    if (__VLS_ctx.getStepStatus(2) === 'completed') {
        const __VLS_45 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({}));
        const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
        __VLS_48.slots.default;
        const __VLS_49 = {}.Check;
        /** @type {[typeof __VLS_components.Check, ]} */ ;
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({}));
        const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
        var __VLS_48;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-desc" },
    });
    if (__VLS_ctx.purchaseList.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.purchaseList.length);
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "timeline-node-item" },
        ...{ class: ('status-' + __VLS_ctx.getStepStatus(3)) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-bullet" },
    });
    if (__VLS_ctx.getStepStatus(3) === 'completed') {
        const __VLS_53 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({}));
        const __VLS_55 = __VLS_54({}, ...__VLS_functionalComponentArgsRest(__VLS_54));
        __VLS_56.slots.default;
        const __VLS_57 = {}.Check;
        /** @type {[typeof __VLS_components.Check, ]} */ ;
        // @ts-ignore
        const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({}));
        const __VLS_59 = __VLS_58({}, ...__VLS_functionalComponentArgsRest(__VLS_58));
        var __VLS_56;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-desc" },
    });
    (__VLS_ctx.getTotalRegCount());
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "workspace-main" },
    });
    if (__VLS_ctx.selectedCategory === 'purchase' && __VLS_ctx.selectedApply) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-workspace-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-header-bar" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "header-left" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "header-icon" },
        });
        const __VLS_61 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({}));
        const __VLS_63 = __VLS_62({}, ...__VLS_functionalComponentArgsRest(__VLS_62));
        __VLS_64.slots.default;
        const __VLS_65 = {}.ShoppingCart;
        /** @type {[typeof __VLS_components.ShoppingCart, ]} */ ;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({}));
        const __VLS_67 = __VLS_66({}, ...__VLS_functionalComponentArgsRest(__VLS_66));
        var __VLS_64;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "header-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.selectedApply.applyNo);
        const __VLS_69 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
            type: (__VLS_ctx.getStatusTagType(__VLS_ctx.selectedApply.status)),
            size: "small",
            effect: "light",
            ...{ class: "ml-12 custom-status-tag" },
        }));
        const __VLS_71 = __VLS_70({
            type: (__VLS_ctx.getStatusTagType(__VLS_ctx.selectedApply.status)),
            size: "small",
            effect: "light",
            ...{ class: "ml-12 custom-status-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_70));
        __VLS_72.slots.default;
        (__VLS_ctx.selectedApply.status);
        var __VLS_72;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "header-right" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "time-label" },
        });
        const __VLS_73 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({}));
        const __VLS_75 = __VLS_74({}, ...__VLS_functionalComponentArgsRest(__VLS_74));
        __VLS_76.slots.default;
        const __VLS_77 = {}.Calendar;
        /** @type {[typeof __VLS_components.Calendar, ]} */ ;
        // @ts-ignore
        const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({}));
        const __VLS_79 = __VLS_78({}, ...__VLS_functionalComponentArgsRest(__VLS_78));
        var __VLS_76;
        (__VLS_ctx.selectedApply.applyTime);
        if (__VLS_ctx.selectedApply.status === '待提交') {
            const __VLS_81 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
                ...{ 'onClick': {} },
                type: "primary",
                link: true,
                size: "small",
                ...{ class: "ml-16 edit-btn" },
            }));
            const __VLS_83 = __VLS_82({
                ...{ 'onClick': {} },
                type: "primary",
                link: true,
                size: "small",
                ...{ class: "ml-16 edit-btn" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_82));
            let __VLS_85;
            let __VLS_86;
            let __VLS_87;
            const __VLS_88 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.feedbackData))
                        return;
                    if (!(__VLS_ctx.selectedCategory === 'purchase' && __VLS_ctx.selectedApply))
                        return;
                    if (!(__VLS_ctx.selectedApply.status === '待提交'))
                        return;
                    __VLS_ctx.handleEditPurchase(__VLS_ctx.selectedApply);
                }
            };
            __VLS_84.slots.default;
            const __VLS_89 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
                ...{ class: "mr-4" },
            }));
            const __VLS_91 = __VLS_90({
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_90));
            __VLS_92.slots.default;
            const __VLS_93 = {}.Edit;
            /** @type {[typeof __VLS_components.Edit, ]} */ ;
            // @ts-ignore
            const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({}));
            const __VLS_95 = __VLS_94({}, ...__VLS_functionalComponentArgsRest(__VLS_94));
            var __VLS_92;
            var __VLS_84;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-section mb-20 mt-16" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-12" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar blue" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        if (__VLS_ctx.selectedApply.channel === '供应商') {
            const __VLS_97 = {}.ElDescriptions;
            /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
            // @ts-ignore
            const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
                column: (2),
                border: true,
                ...{ class: "custom-desc-table" },
            }));
            const __VLS_99 = __VLS_98({
                column: (2),
                border: true,
                ...{ class: "custom-desc-table" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_98));
            __VLS_100.slots.default;
            const __VLS_101 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
                label: "拿样渠道",
            }));
            const __VLS_103 = __VLS_102({
                label: "拿样渠道",
            }, ...__VLS_functionalComponentArgsRest(__VLS_102));
            __VLS_104.slots.default;
            const __VLS_105 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
                size: "small",
                type: "info",
                effect: "plain",
            }));
            const __VLS_107 = __VLS_106({
                size: "small",
                type: "info",
                effect: "plain",
            }, ...__VLS_functionalComponentArgsRest(__VLS_106));
            __VLS_108.slots.default;
            var __VLS_108;
            var __VLS_104;
            const __VLS_109 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
                label: "供应商类型",
            }));
            const __VLS_111 = __VLS_110({
                label: "供应商类型",
            }, ...__VLS_functionalComponentArgsRest(__VLS_110));
            __VLS_112.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.selectedApply.supplierType || '临时供应商');
            var __VLS_112;
            const __VLS_113 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
                label: "供应商名称",
            }));
            const __VLS_115 = __VLS_114({
                label: "供应商名称",
            }, ...__VLS_functionalComponentArgsRest(__VLS_114));
            __VLS_116.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "font-semibold text-bold" },
            });
            (__VLS_ctx.selectedApply.supplier);
            var __VLS_116;
            const __VLS_117 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
                label: "货源地",
            }));
            const __VLS_119 = __VLS_118({
                label: "货源地",
            }, ...__VLS_functionalComponentArgsRest(__VLS_118));
            __VLS_120.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.selectedApply.source || '广东深圳');
            var __VLS_120;
            var __VLS_100;
        }
        else {
            const __VLS_121 = {}.ElDescriptions;
            /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
            // @ts-ignore
            const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
                column: (2),
                border: true,
                ...{ class: "custom-desc-table" },
            }));
            const __VLS_123 = __VLS_122({
                column: (2),
                border: true,
                ...{ class: "custom-desc-table" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_122));
            __VLS_124.slots.default;
            const __VLS_125 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
                label: "拿样渠道",
            }));
            const __VLS_127 = __VLS_126({
                label: "拿样渠道",
            }, ...__VLS_functionalComponentArgsRest(__VLS_126));
            __VLS_128.slots.default;
            const __VLS_129 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
                size: "small",
                type: "warning",
                effect: "plain",
            }));
            const __VLS_131 = __VLS_130({
                size: "small",
                type: "warning",
                effect: "plain",
            }, ...__VLS_functionalComponentArgsRest(__VLS_130));
            __VLS_132.slots.default;
            (__VLS_ctx.selectedApply.channel);
            var __VLS_132;
            var __VLS_128;
            const __VLS_133 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
                label: "购买链接",
                span: (2),
            }));
            const __VLS_135 = __VLS_134({
                label: "购买链接",
                span: (2),
            }, ...__VLS_functionalComponentArgsRest(__VLS_134));
            __VLS_136.slots.default;
            if (__VLS_ctx.selectedApply.purchaseUrl) {
                const __VLS_137 = {}.ElLink;
                /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
                // @ts-ignore
                const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
                    href: (__VLS_ctx.selectedApply.purchaseUrl),
                    target: "_blank",
                    type: "primary",
                    underline: (false),
                    ...{ class: "link-text-ellipsis" },
                }));
                const __VLS_139 = __VLS_138({
                    href: (__VLS_ctx.selectedApply.purchaseUrl),
                    target: "_blank",
                    type: "primary",
                    underline: (false),
                    ...{ class: "link-text-ellipsis" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_138));
                __VLS_140.slots.default;
                (__VLS_ctx.selectedApply.purchaseUrl);
                var __VLS_140;
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            }
            var __VLS_136;
            var __VLS_124;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-section mb-20" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-12" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar orange" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        const __VLS_141 = {}.ElDescriptions;
        /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
        // @ts-ignore
        const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
            column: (2),
            border: true,
            ...{ class: "custom-desc-table" },
        }));
        const __VLS_143 = __VLS_142({
            column: (2),
            border: true,
            ...{ class: "custom-desc-table" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_142));
        __VLS_144.slots.default;
        const __VLS_145 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
            label: "样品名称",
        }));
        const __VLS_147 = __VLS_146({
            label: "样品名称",
        }, ...__VLS_functionalComponentArgsRest(__VLS_146));
        __VLS_148.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-semibold text-bold" },
        });
        (__VLS_ctx.selectedApply.sampleName);
        var __VLS_148;
        const __VLS_149 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
            label: "购样数量",
        }));
        const __VLS_151 = __VLS_150({
            label: "购样数量",
        }, ...__VLS_functionalComponentArgsRest(__VLS_150));
        __VLS_152.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedApply.qty);
        var __VLS_152;
        const __VLS_153 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
            label: "购样单价",
        }));
        const __VLS_155 = __VLS_154({
            label: "购样单价",
        }, ...__VLS_functionalComponentArgsRest(__VLS_154));
        __VLS_156.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedApply.price);
        var __VLS_156;
        const __VLS_157 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
            label: "费用合计",
        }));
        const __VLS_159 = __VLS_158({
            label: "费用合计",
        }, ...__VLS_functionalComponentArgsRest(__VLS_158));
        __VLS_160.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "price-text font-bold" },
        });
        (__VLS_ctx.selectedApply.amount);
        var __VLS_160;
        if (__VLS_ctx.selectedApply.channel === '供应商') {
            const __VLS_161 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
                label: "是否可退款",
            }));
            const __VLS_163 = __VLS_162({
                label: "是否可退款",
            }, ...__VLS_functionalComponentArgsRest(__VLS_162));
            __VLS_164.slots.default;
            const __VLS_165 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
                type: (__VLS_ctx.selectedApply.isRefundable ? 'success' : 'info'),
                size: "small",
            }));
            const __VLS_167 = __VLS_166({
                type: (__VLS_ctx.selectedApply.isRefundable ? 'success' : 'info'),
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_166));
            __VLS_168.slots.default;
            (__VLS_ctx.selectedApply.isRefundable ? '是' : '否');
            var __VLS_168;
            var __VLS_164;
        }
        if (__VLS_ctx.selectedApply.channel === '供应商') {
            const __VLS_169 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
                label: "收款方式",
            }));
            const __VLS_171 = __VLS_170({
                label: "收款方式",
            }, ...__VLS_functionalComponentArgsRest(__VLS_170));
            __VLS_172.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.selectedApply.paymentMethod || '银行转账');
            var __VLS_172;
        }
        if (__VLS_ctx.selectedApply.channel === '供应商' && __VLS_ctx.selectedApply.isRefundable) {
            const __VLS_173 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
                label: "退款条款",
                span: (2),
            }));
            const __VLS_175 = __VLS_174({
                label: "退款条款",
                span: (2),
            }, ...__VLS_functionalComponentArgsRest(__VLS_174));
            __VLS_176.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "refund-policy" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "policy-tag" },
            });
            (__VLS_ctx.selectedApply.refundMethod || '抵扣首单');
            if (__VLS_ctx.selectedApply.refundCondition) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "policy-cond" },
                });
                (__VLS_ctx.selectedApply.refundCondition);
            }
            var __VLS_176;
        }
        var __VLS_144;
        if (__VLS_ctx.selectedApply.channel === '供应商') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "detail-section mb-20" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "section-title mb-12" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "title-bar purple" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            if (__VLS_ctx.selectedApply.paymentMethod === '银行转账') {
                const __VLS_177 = {}.ElDescriptions;
                /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
                // @ts-ignore
                const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
                    column: (2),
                    border: true,
                    ...{ class: "custom-desc-table" },
                }));
                const __VLS_179 = __VLS_178({
                    column: (2),
                    border: true,
                    ...{ class: "custom-desc-table" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_178));
                __VLS_180.slots.default;
                const __VLS_181 = {}.ElDescriptionsItem;
                /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
                // @ts-ignore
                const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
                    label: "开户行",
                }));
                const __VLS_183 = __VLS_182({
                    label: "开户行",
                }, ...__VLS_functionalComponentArgsRest(__VLS_182));
                __VLS_184.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (__VLS_ctx.selectedApply.bankName || '中国工商银行义乌支行');
                var __VLS_184;
                const __VLS_185 = {}.ElDescriptionsItem;
                /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
                // @ts-ignore
                const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
                    label: "账户名称",
                }));
                const __VLS_187 = __VLS_186({
                    label: "账户名称",
                }, ...__VLS_functionalComponentArgsRest(__VLS_186));
                __VLS_188.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (__VLS_ctx.selectedApply.accountName || '义乌得力商贸有限公司');
                var __VLS_188;
                const __VLS_189 = {}.ElDescriptionsItem;
                /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
                // @ts-ignore
                const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
                    label: "银行账号",
                    span: (2),
                }));
                const __VLS_191 = __VLS_190({
                    label: "银行账号",
                    span: (2),
                }, ...__VLS_functionalComponentArgsRest(__VLS_190));
                __VLS_192.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "font-semibold code-style" },
                });
                (__VLS_ctx.selectedApply.bankAccount || '6217 0038 9001 0293 848');
                var __VLS_192;
                var __VLS_180;
            }
            else {
                const __VLS_193 = {}.ElDescriptions;
                /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
                // @ts-ignore
                const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
                    column: (2),
                    border: true,
                    ...{ class: "custom-desc-table" },
                }));
                const __VLS_195 = __VLS_194({
                    column: (2),
                    border: true,
                    ...{ class: "custom-desc-table" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_194));
                __VLS_196.slots.default;
                const __VLS_197 = {}.ElDescriptionsItem;
                /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
                // @ts-ignore
                const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
                    label: "收款方式",
                }));
                const __VLS_199 = __VLS_198({
                    label: "收款方式",
                }, ...__VLS_functionalComponentArgsRest(__VLS_198));
                __VLS_200.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (__VLS_ctx.selectedApply.paymentMethod);
                var __VLS_200;
                const __VLS_201 = {}.ElDescriptionsItem;
                /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
                // @ts-ignore
                const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
                    label: "收款二维码",
                }));
                const __VLS_203 = __VLS_202({
                    label: "收款二维码",
                }, ...__VLS_functionalComponentArgsRest(__VLS_202));
                __VLS_204.slots.default;
                if (__VLS_ctx.selectedApply.paymentQrCode) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "attach-images" },
                    });
                    const __VLS_205 = {}.ElImage;
                    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
                    // @ts-ignore
                    const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
                        src: (__VLS_ctx.selectedApply.paymentQrCode),
                        previewSrcList: ([__VLS_ctx.selectedApply.paymentQrCode]),
                        fit: "cover",
                        ...{ class: "attach-img-preview" },
                        previewTeleported: true,
                    }));
                    const __VLS_207 = __VLS_206({
                        src: (__VLS_ctx.selectedApply.paymentQrCode),
                        previewSrcList: ([__VLS_ctx.selectedApply.paymentQrCode]),
                        fit: "cover",
                        ...{ class: "attach-img-preview" },
                        previewTeleported: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_206));
                }
                else {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "no-attach" },
                    });
                }
                var __VLS_204;
                var __VLS_196;
            }
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-section mb-20" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-12" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar green" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "attachments-grid" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "attach-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "attach-label" },
        });
        if (__VLS_ctx.selectedApply.image) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "attach-images" },
            });
            const __VLS_209 = {}.ElImage;
            /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
            // @ts-ignore
            const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
                src: (__VLS_ctx.selectedApply.image),
                previewSrcList: ([__VLS_ctx.selectedApply.image]),
                fit: "cover",
                ...{ class: "attach-img-preview" },
                previewTeleported: true,
            }));
            const __VLS_211 = __VLS_210({
                src: (__VLS_ctx.selectedApply.image),
                previewSrcList: ([__VLS_ctx.selectedApply.image]),
                fit: "cover",
                ...{ class: "attach-img-preview" },
                previewTeleported: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_210));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "no-attach" },
            });
        }
        if (__VLS_ctx.selectedApply.orderScreenshot) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "attach-group mt-12" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "attach-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "attach-images" },
            });
            const __VLS_213 = {}.ElImage;
            /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
            // @ts-ignore
            const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
                src: (__VLS_ctx.selectedApply.orderScreenshot),
                previewSrcList: ([__VLS_ctx.selectedApply.orderScreenshot]),
                fit: "cover",
                ...{ class: "attach-img-preview" },
                previewTeleported: true,
            }));
            const __VLS_215 = __VLS_214({
                src: (__VLS_ctx.selectedApply.orderScreenshot),
                previewSrcList: ([__VLS_ctx.selectedApply.orderScreenshot]),
                fit: "cover",
                ...{ class: "attach-img-preview" },
                previewTeleported: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_214));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "sub-table-wrapper mt-24" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "sub-table-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "sub-table-title" },
        });
        (__VLS_ctx.selectedApply.registrations?.length || 0);
        if (__VLS_ctx.selectedApply.status === '已通过') {
            const __VLS_217 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
                ...{ 'onClick': {} },
                type: "primary",
                size: "small",
                icon: (__VLS_ctx.Plus),
                ...{ class: "action-btn-styled" },
            }));
            const __VLS_219 = __VLS_218({
                ...{ 'onClick': {} },
                type: "primary",
                size: "small",
                icon: (__VLS_ctx.Plus),
                ...{ class: "action-btn-styled" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_218));
            let __VLS_221;
            let __VLS_222;
            let __VLS_223;
            const __VLS_224 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.feedbackData))
                        return;
                    if (!(__VLS_ctx.selectedCategory === 'purchase' && __VLS_ctx.selectedApply))
                        return;
                    if (!(__VLS_ctx.selectedApply.status === '已通过'))
                        return;
                    __VLS_ctx.handleRegisterSampleDirect(__VLS_ctx.selectedApply);
                }
            };
            __VLS_220.slots.default;
            var __VLS_220;
        }
        const __VLS_225 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
            data: (__VLS_ctx.selectedApply.registrations),
            size: "small",
            ...{ class: "premium-table-v4" },
            border: true,
        }));
        const __VLS_227 = __VLS_226({
            data: (__VLS_ctx.selectedApply.registrations),
            size: "small",
            ...{ class: "premium-table-v4" },
            border: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_226));
        __VLS_228.slots.default;
        const __VLS_229 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
            label: "实物图",
            width: "75",
            align: "center",
        }));
        const __VLS_231 = __VLS_230({
            label: "实物图",
            width: "75",
            align: "center",
        }, ...__VLS_functionalComponentArgsRest(__VLS_230));
        __VLS_232.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_232.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            if (row.image) {
                const __VLS_233 = {}.ElImage;
                /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
                // @ts-ignore
                const __VLS_234 = __VLS_asFunctionalComponent(__VLS_233, new __VLS_233({
                    src: (row.image),
                    previewSrcList: ([row.image]),
                    fit: "cover",
                    ...{ class: "table-img" },
                    previewTeleported: true,
                }));
                const __VLS_235 = __VLS_234({
                    src: (row.image),
                    previewSrcList: ([row.image]),
                    fit: "cover",
                    ...{ class: "table-img" },
                    previewTeleported: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_234));
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "no-img-text" },
                });
            }
        }
        var __VLS_232;
        const __VLS_237 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({
            prop: "regNo",
            label: "登记单号",
            width: "140",
        }));
        const __VLS_239 = __VLS_238({
            prop: "regNo",
            label: "登记单号",
            width: "140",
        }, ...__VLS_functionalComponentArgsRest(__VLS_238));
        __VLS_240.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_240.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_241 = {}.ElLink;
            /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
            // @ts-ignore
            const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
                ...{ 'onClick': {} },
                type: "primary",
                ...{ class: "font-bold font-mono" },
                underline: (false),
            }));
            const __VLS_243 = __VLS_242({
                ...{ 'onClick': {} },
                type: "primary",
                ...{ class: "font-bold font-mono" },
                underline: (false),
            }, ...__VLS_functionalComponentArgsRest(__VLS_242));
            let __VLS_245;
            let __VLS_246;
            let __VLS_247;
            const __VLS_248 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.feedbackData))
                        return;
                    if (!(__VLS_ctx.selectedCategory === 'purchase' && __VLS_ctx.selectedApply))
                        return;
                    __VLS_ctx.handleSampleRegistrationDetail(row);
                }
            };
            __VLS_244.slots.default;
            (row.regNo);
            var __VLS_244;
        }
        var __VLS_240;
        const __VLS_249 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_250 = __VLS_asFunctionalComponent(__VLS_249, new __VLS_249({
            prop: "status",
            label: "样品状态",
            width: "90",
            align: "center",
        }));
        const __VLS_251 = __VLS_250({
            prop: "status",
            label: "样品状态",
            width: "90",
            align: "center",
        }, ...__VLS_functionalComponentArgsRest(__VLS_250));
        __VLS_252.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_252.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: (['status-badge-pill', row.status === '合格' || row.status === '有效' ? 'success' : 'warning']) },
            });
            (row.status || '待验');
        }
        var __VLS_252;
        const __VLS_253 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_254 = __VLS_asFunctionalComponent(__VLS_253, new __VLS_253({
            prop: "pattern",
            label: "款式型号",
            showOverflowTooltip: true,
        }));
        const __VLS_255 = __VLS_254({
            prop: "pattern",
            label: "款式型号",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_254));
        const __VLS_257 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({
            prop: "spec",
            label: "规格尺寸",
            width: "120",
        }));
        const __VLS_259 = __VLS_258({
            prop: "spec",
            label: "规格尺寸",
            width: "120",
        }, ...__VLS_functionalComponentArgsRest(__VLS_258));
        const __VLS_261 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
            label: "操作",
            width: "90",
            align: "center",
            fixed: "right",
        }));
        const __VLS_263 = __VLS_262({
            label: "操作",
            width: "90",
            align: "center",
            fixed: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_262));
        __VLS_264.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_264.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            if (row.status === '待提交') {
                const __VLS_265 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_266 = __VLS_asFunctionalComponent(__VLS_265, new __VLS_265({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                    size: "small",
                    ...{ class: "table-edit-btn" },
                }));
                const __VLS_267 = __VLS_266({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                    size: "small",
                    ...{ class: "table-edit-btn" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_266));
                let __VLS_269;
                let __VLS_270;
                let __VLS_271;
                const __VLS_272 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.feedbackData))
                            return;
                        if (!(__VLS_ctx.selectedCategory === 'purchase' && __VLS_ctx.selectedApply))
                            return;
                        if (!(row.status === '待提交'))
                            return;
                        __VLS_ctx.handleEditSampleRegistration(row);
                    }
                };
                __VLS_268.slots.default;
                const __VLS_273 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_274 = __VLS_asFunctionalComponent(__VLS_273, new __VLS_273({
                    ...{ class: "mr-2" },
                }));
                const __VLS_275 = __VLS_274({
                    ...{ class: "mr-2" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_274));
                __VLS_276.slots.default;
                const __VLS_277 = {}.Edit;
                /** @type {[typeof __VLS_components.Edit, ]} */ ;
                // @ts-ignore
                const __VLS_278 = __VLS_asFunctionalComponent(__VLS_277, new __VLS_277({}));
                const __VLS_279 = __VLS_278({}, ...__VLS_functionalComponentArgsRest(__VLS_278));
                var __VLS_276;
                var __VLS_268;
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "text-placeholder" },
                });
            }
        }
        var __VLS_264;
        var __VLS_228;
    }
    if (__VLS_ctx.selectedCategory === 'direct' && __VLS_ctx.directRegistrations.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-workspace-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-header-bar" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "header-left" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "header-icon direct" },
        });
        const __VLS_281 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_282 = __VLS_asFunctionalComponent(__VLS_281, new __VLS_281({}));
        const __VLS_283 = __VLS_282({}, ...__VLS_functionalComponentArgsRest(__VLS_282));
        __VLS_284.slots.default;
        const __VLS_285 = {}.List;
        /** @type {[typeof __VLS_components.List, ]} */ ;
        // @ts-ignore
        const __VLS_286 = __VLS_asFunctionalComponent(__VLS_285, new __VLS_285({}));
        const __VLS_287 = __VLS_286({}, ...__VLS_functionalComponentArgsRest(__VLS_286));
        var __VLS_284;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "header-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.directRegistrations.length);
        for (const [reg, rIdx] of __VLS_getVForSourceType((__VLS_ctx.directRegistrations))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (reg.regNo),
                ...{ class: "direct-detail-item" },
                ...{ class: ({ 'mt-16': rIdx > 0 }) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "direct-item-header" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "reg-no" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
            (reg.regNo);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: (['status-badge-pill ml-12', reg.sampleStatus === '合格' ? 'success' : 'warning']) },
            });
            (reg.sampleStatus || '待验');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "flex-grow" },
            });
            const __VLS_289 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_290 = __VLS_asFunctionalComponent(__VLS_289, new __VLS_289({
                ...{ 'onClick': {} },
                link: true,
                type: "primary",
                size: "small",
                ...{ class: "detail-btn" },
            }));
            const __VLS_291 = __VLS_290({
                ...{ 'onClick': {} },
                link: true,
                type: "primary",
                size: "small",
                ...{ class: "detail-btn" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_290));
            let __VLS_293;
            let __VLS_294;
            let __VLS_295;
            const __VLS_296 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.feedbackData))
                        return;
                    if (!(__VLS_ctx.selectedCategory === 'direct' && __VLS_ctx.directRegistrations.length > 0))
                        return;
                    __VLS_ctx.handleSampleRegistrationDetail(reg);
                }
            };
            __VLS_292.slots.default;
            const __VLS_297 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_298 = __VLS_asFunctionalComponent(__VLS_297, new __VLS_297({
                ...{ class: "mr-4" },
            }));
            const __VLS_299 = __VLS_298({
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_298));
            __VLS_300.slots.default;
            const __VLS_301 = {}.Document;
            /** @type {[typeof __VLS_components.Document, ]} */ ;
            // @ts-ignore
            const __VLS_302 = __VLS_asFunctionalComponent(__VLS_301, new __VLS_301({}));
            const __VLS_303 = __VLS_302({}, ...__VLS_functionalComponentArgsRest(__VLS_302));
            var __VLS_300;
            var __VLS_292;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "card-grid mt-12" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-col span-4" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-value text-bold" },
            });
            (reg.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-col span-2" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-value" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "channel-badge" },
            });
            (reg.source);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-col span-2" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-value price-highlight-large" },
            });
            (reg.sampleFee);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-col span-4" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-value font-mono" },
            });
            (reg.spec || '-');
            (reg.color || '-');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-col span-4" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "grid-value font-semibold" },
            });
            const __VLS_305 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_306 = __VLS_asFunctionalComponent(__VLS_305, new __VLS_305({
                ...{ class: "mr-4" },
            }));
            const __VLS_307 = __VLS_306({
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_306));
            __VLS_308.slots.default;
            const __VLS_309 = {}.User;
            /** @type {[typeof __VLS_components.User, ]} */ ;
            // @ts-ignore
            const __VLS_310 = __VLS_asFunctionalComponent(__VLS_309, new __VLS_309({}));
            const __VLS_311 = __VLS_310({}, ...__VLS_functionalComponentArgsRest(__VLS_310));
            var __VLS_308;
            (reg.receiver);
            if (reg.receiveTime) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "time-label ml-12" },
                });
                (reg.receiveTime);
            }
        }
    }
    if (!__VLS_ctx.purchaseList.length && !__VLS_ctx.directRegistrations.length) {
        const __VLS_313 = {}.ElEmpty;
        /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
        // @ts-ignore
        const __VLS_314 = __VLS_asFunctionalComponent(__VLS_313, new __VLS_313({
            description: "暂无关联单据数据",
            ...{ class: "custom-empty" },
        }));
        const __VLS_315 = __VLS_314({
            description: "暂无关联单据数据",
            ...{ class: "custom-empty" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_314));
    }
}
/** @type {[typeof PurchaseDetailDialog, ]} */ ;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent(PurchaseDetailDialog, new PurchaseDetailDialog({
    ref: "purchaseDetailRef",
}));
const __VLS_318 = __VLS_317({
    ref: "purchaseDetailRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
/** @type {typeof __VLS_ctx.purchaseDetailRef} */ ;
var __VLS_320 = {};
var __VLS_319;
/** @type {[typeof PurchaseApplyDialog, ]} */ ;
// @ts-ignore
const __VLS_322 = __VLS_asFunctionalComponent(PurchaseApplyDialog, new PurchaseApplyDialog({
    ...{ 'onSubmit': {} },
    ref: "purchaseApplyRef",
}));
const __VLS_323 = __VLS_322({
    ...{ 'onSubmit': {} },
    ref: "purchaseApplyRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_322));
let __VLS_325;
let __VLS_326;
let __VLS_327;
const __VLS_328 = {
    onSubmit: (__VLS_ctx.handlePurchaseApplySubmit)
};
/** @type {typeof __VLS_ctx.purchaseApplyRef} */ ;
var __VLS_329 = {};
var __VLS_324;
/** @type {[typeof SampleRegistrationDialog, ]} */ ;
// @ts-ignore
const __VLS_331 = __VLS_asFunctionalComponent(SampleRegistrationDialog, new SampleRegistrationDialog({
    ref: "sampleRegistrationRef",
}));
const __VLS_332 = __VLS_331({
    ref: "sampleRegistrationRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_331));
/** @type {typeof __VLS_ctx.sampleRegistrationRef} */ ;
var __VLS_334 = {};
var __VLS_333;
/** @type {[typeof SampleRegistrationDetailDialog, ]} */ ;
// @ts-ignore
const __VLS_336 = __VLS_asFunctionalComponent(SampleRegistrationDetailDialog, new SampleRegistrationDetailDialog({
    ref: "sampleRegistrationDetailRef",
}));
const __VLS_337 = __VLS_336({
    ref: "sampleRegistrationDetailRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_336));
/** @type {typeof __VLS_ctx.sampleRegistrationDetailRef} */ ;
var __VLS_339 = {};
var __VLS_338;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['premium-drawer']} */ ;
/** @type {__VLS_StyleScopedClasses['drawer-header-v4']} */ ;
/** @type {__VLS_StyleScopedClasses['title-main']} */ ;
/** @type {__VLS_StyleScopedClasses['title-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['title-text']} */ ;
/** @type {__VLS_StyleScopedClasses['title-divider']} */ ;
/** @type {__VLS_StyleScopedClasses['title-sub']} */ ;
/** @type {__VLS_StyleScopedClasses['workspace-container']} */ ;
/** @type {__VLS_StyleScopedClasses['workspace-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-block']} */ ;
/** @type {__VLS_StyleScopedClasses['context-card']} */ ;
/** @type {__VLS_StyleScopedClasses['block-header']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title-text']} */ ;
/** @type {__VLS_StyleScopedClasses['context-details']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-value']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-value']} */ ;
/** @type {__VLS_StyleScopedClasses['price-highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-kpis']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-box']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-num']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-lbl']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-box']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-num']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-lbl']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-block']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-list-card']} */ ;
/** @type {__VLS_StyleScopedClasses['block-header']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title-text']} */ ;
/** @type {__VLS_StyleScopedClasses['master-navigation-list']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['master-nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-top']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-no']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-price']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-reg-count']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-approval-nodes']} */ ;
/** @type {__VLS_StyleScopedClasses['approval-nodes-flow']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-node']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-node-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-node-text']} */ ;
/** @type {__VLS_StyleScopedClasses['node-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['master-nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-top']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-no']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-status-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-price']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-reg-count']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-block']} */ ;
/** @type {__VLS_StyleScopedClasses['path-card']} */ ;
/** @type {__VLS_StyleScopedClasses['block-header']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title-text']} */ ;
/** @type {__VLS_StyleScopedClasses['vertical-timeline']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline-node-item']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline-line']} */ ;
/** @type {__VLS_StyleScopedClasses['node-bullet']} */ ;
/** @type {__VLS_StyleScopedClasses['node-content']} */ ;
/** @type {__VLS_StyleScopedClasses['node-title']} */ ;
/** @type {__VLS_StyleScopedClasses['node-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline-node-item']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline-line']} */ ;
/** @type {__VLS_StyleScopedClasses['node-bullet']} */ ;
/** @type {__VLS_StyleScopedClasses['node-content']} */ ;
/** @type {__VLS_StyleScopedClasses['node-title']} */ ;
/** @type {__VLS_StyleScopedClasses['node-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['timeline-node-item']} */ ;
/** @type {__VLS_StyleScopedClasses['node-bullet']} */ ;
/** @type {__VLS_StyleScopedClasses['node-content']} */ ;
/** @type {__VLS_StyleScopedClasses['node-title']} */ ;
/** @type {__VLS_StyleScopedClasses['node-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['workspace-main']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-workspace-card']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-header-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['header-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['header-title']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-status-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['header-right']} */ ;
/** @type {__VLS_StyleScopedClasses['time-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['link-text-ellipsis']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['orange']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['refund-policy']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-cond']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['purple']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['code-style']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-images']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-img-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['no-attach']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['attachments-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-group']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-label']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-images']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-img-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['no-attach']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-group']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-label']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-images']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-img-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-table-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-table-header']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-table-title']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn-styled']} */ ;
/** @type {__VLS_StyleScopedClasses['premium-table-v4']} */ ;
/** @type {__VLS_StyleScopedClasses['table-img']} */ ;
/** @type {__VLS_StyleScopedClasses['no-img-text']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['table-edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-workspace-card']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-header-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['header-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['direct']} */ ;
/** @type {__VLS_StyleScopedClasses['header-title']} */ ;
/** @type {__VLS_StyleScopedClasses['direct-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['direct-item-header']} */ ;
/** @type {__VLS_StyleScopedClasses['reg-no']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-grow']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['card-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-col']} */ ;
/** @type {__VLS_StyleScopedClasses['span-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-label']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-value']} */ ;
/** @type {__VLS_StyleScopedClasses['text-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-col']} */ ;
/** @type {__VLS_StyleScopedClasses['span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-label']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-value']} */ ;
/** @type {__VLS_StyleScopedClasses['channel-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-col']} */ ;
/** @type {__VLS_StyleScopedClasses['span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-label']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-value']} */ ;
/** @type {__VLS_StyleScopedClasses['price-highlight-large']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-col']} */ ;
/** @type {__VLS_StyleScopedClasses['span-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-label']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-value']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-col']} */ ;
/** @type {__VLS_StyleScopedClasses['span-4']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-label']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-value']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['time-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-empty']} */ ;
// @ts-ignore
var __VLS_321 = __VLS_320, __VLS_330 = __VLS_329, __VLS_335 = __VLS_334, __VLS_340 = __VLS_339;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Document: Document,
            Check: Check,
            ArrowRight: ArrowRight,
            Plus: Plus,
            ShoppingCart: ShoppingCart,
            List: List,
            Edit: Edit,
            Calendar: Calendar,
            User: User,
            PurchaseDetailDialog: PurchaseDetailDialog,
            PurchaseApplyDialog: PurchaseApplyDialog,
            SampleRegistrationDialog: SampleRegistrationDialog,
            SampleRegistrationDetailDialog: SampleRegistrationDetailDialog,
            purchaseDetailRef: purchaseDetailRef,
            purchaseApplyRef: purchaseApplyRef,
            sampleRegistrationRef: sampleRegistrationRef,
            sampleRegistrationDetailRef: sampleRegistrationDetailRef,
            handleEditPurchase: handleEditPurchase,
            handleSampleRegistrationDetail: handleSampleRegistrationDetail,
            handleEditSampleRegistration: handleEditSampleRegistration,
            handleRegisterSampleDirect: handleRegisterSampleDirect,
            handlePurchaseApplySubmit: handlePurchaseApplySubmit,
            visible: visible,
            feedbackData: feedbackData,
            purchaseList: purchaseList,
            directRegistrations: directRegistrations,
            selectedCategory: selectedCategory,
            selectedApplyNo: selectedApplyNo,
            selectedApply: selectedApply,
            drawerSize: drawerSize,
            getStepStatus: getStepStatus,
            getTotalRegCount: getTotalRegCount,
            getStatusTagType: getStatusTagType,
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
//# sourceMappingURL=ExecutionDetailDrawer.vue.js.map