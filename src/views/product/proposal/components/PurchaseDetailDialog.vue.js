/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { Document } from '@element-plus/icons-vue';
const visible = ref(false);
const detailData = ref(null);
const open = (row) => {
    // 补齐查看详情时可能缺失的默认字段数据，以展示完整的多渠道特异信息
    const defaultBank = {
        paymentMethod: '银行转账',
        bankName: '中国工商银行义乌支行',
        accountName: row.supplier || '义乌市得力商贸服务部',
        bankAccount: '6217 0038 9001 0293 848'
    };
    const defaultRefund = {
        isRefundable: ['已通过', '同意', '待更新合同'].includes(row.status),
        refundMethod: '抵扣首单货款',
        refundCondition: '首批大货订单满1000件返还'
    };
    const defaultContract = row.feeType === '开模费' ? {
        contractFiles: row.contractFiles || [{ name: '不锈钢微调固定座开模合同.pdf', url: '#' }],
        contractAmount: row.contractAmount || 8000.00,
        contractRemark: row.contractRemark || '开模费用一次性付清，模具所有权归我司所有。'
    } : {};
    detailData.value = {
        ...defaultBank,
        ...defaultRefund,
        ...defaultContract,
        feeType: row.feeType || '打样费',
        ...row,
        // 如果是 1688 / 淘宝，我们配给它对应的付款截图或店铺名
        shopName: row.channel !== '供应商' ? `${row.channel}优质货源店` : '',
        orderScreenshot: row.channel !== '供应商' ? 'https://picsum.photos/300/200?random=40' : '',
        paymentQrCode: (row.paymentQrCodes && row.paymentQrCodes.length > 0) ? row.paymentQrCodes[0] : (row.paymentQrCode || (['支付宝', '微信'].includes(row.paymentMethod) ? 'https://picsum.photos/200/200?random=50' : ''))
    };
    visible.value = true;
};
const getStatusTagType = (status) => {
    switch (status) {
        case '同意':
        case '已通过': return 'success';
        case '待审批':
        case '审批中': return 'warning';
        case '不同意':
        case '已驳回': return 'danger';
        case '待更新合同': return 'primary';
        case '待提交': return 'info';
        default: return 'info';
    }
};
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    title: "购样申请单详情",
    width: "850px",
    ...{ class: "premium-dialog" },
    destroyOnClose: true,
    alignCenter: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    title: "购样申请单详情",
    width: "850px",
    ...{ class: "premium-dialog" },
    destroyOnClose: true,
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
if (__VLS_ctx.detailData) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "purchase-detail-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-header-card mb-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-left" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bill-no-badge" },
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.detailData.applyNo);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "apply-time mt-6" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.detailData.applyTime);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-right" },
    });
    const __VLS_13 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        type: (__VLS_ctx.getStatusTagType(__VLS_ctx.detailData.status)),
        size: "medium",
        effect: "dark",
    }));
    const __VLS_15 = __VLS_14({
        type: (__VLS_ctx.getStatusTagType(__VLS_ctx.detailData.status)),
        size: "medium",
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_16.slots.default;
    (__VLS_ctx.detailData.status);
    var __VLS_16;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-section mb-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title mb-12" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title-bar blue" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    if (__VLS_ctx.detailData.channel === '供应商') {
        const __VLS_17 = {}.ElDescriptions;
        /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
            column: (2),
            border: true,
            ...{ class: "custom-desc-table" },
        }));
        const __VLS_19 = __VLS_18({
            column: (2),
            border: true,
            ...{ class: "custom-desc-table" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        __VLS_20.slots.default;
        const __VLS_21 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
            label: "拿样渠道",
        }));
        const __VLS_23 = __VLS_22({
            label: "拿样渠道",
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        __VLS_24.slots.default;
        const __VLS_25 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
            size: "small",
            type: "info",
            effect: "plain",
        }));
        const __VLS_27 = __VLS_26({
            size: "small",
            type: "info",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        __VLS_28.slots.default;
        var __VLS_28;
        var __VLS_24;
        const __VLS_29 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
            label: "供应商类型",
        }));
        const __VLS_31 = __VLS_30({
            label: "供应商类型",
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        __VLS_32.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.detailData.supplierType || '临时供应商');
        var __VLS_32;
        const __VLS_33 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
            label: "供应商名称",
        }));
        const __VLS_35 = __VLS_34({
            label: "供应商名称",
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
        __VLS_36.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-medium" },
        });
        (__VLS_ctx.detailData.supplier);
        var __VLS_36;
        const __VLS_37 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
            label: "货源地",
        }));
        const __VLS_39 = __VLS_38({
            label: "货源地",
        }, ...__VLS_functionalComponentArgsRest(__VLS_38));
        __VLS_40.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.detailData.source || '广东深圳');
        var __VLS_40;
        var __VLS_20;
    }
    else {
        const __VLS_41 = {}.ElDescriptions;
        /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
            column: (2),
            border: true,
            ...{ class: "custom-desc-table" },
        }));
        const __VLS_43 = __VLS_42({
            column: (2),
            border: true,
            ...{ class: "custom-desc-table" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        __VLS_44.slots.default;
        const __VLS_45 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
            label: "拿样渠道",
        }));
        const __VLS_47 = __VLS_46({
            label: "拿样渠道",
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        __VLS_48.slots.default;
        const __VLS_49 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
            size: "small",
            type: "warning",
            effect: "plain",
        }));
        const __VLS_51 = __VLS_50({
            size: "small",
            type: "warning",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_50));
        __VLS_52.slots.default;
        (__VLS_ctx.detailData.channel);
        var __VLS_52;
        var __VLS_48;
        const __VLS_53 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
            label: "购买链接",
            span: (2),
        }));
        const __VLS_55 = __VLS_54({
            label: "购买链接",
            span: (2),
        }, ...__VLS_functionalComponentArgsRest(__VLS_54));
        __VLS_56.slots.default;
        if (__VLS_ctx.detailData.purchaseUrl) {
            const __VLS_57 = {}.ElLink;
            /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
            // @ts-ignore
            const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
                href: (__VLS_ctx.detailData.purchaseUrl),
                target: "_blank",
                type: "primary",
                underline: (false),
                ...{ class: "link-text-ellipsis" },
            }));
            const __VLS_59 = __VLS_58({
                href: (__VLS_ctx.detailData.purchaseUrl),
                target: "_blank",
                type: "primary",
                underline: (false),
                ...{ class: "link-text-ellipsis" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_58));
            __VLS_60.slots.default;
            (__VLS_ctx.detailData.purchaseUrl);
            var __VLS_60;
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        var __VLS_56;
        var __VLS_44;
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
    const __VLS_61 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
        column: (2),
        border: true,
        ...{ class: "custom-desc-table" },
    }));
    const __VLS_63 = __VLS_62({
        column: (2),
        border: true,
        ...{ class: "custom-desc-table" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    __VLS_64.slots.default;
    const __VLS_65 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
        label: "样品名称",
    }));
    const __VLS_67 = __VLS_66({
        label: "样品名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    __VLS_68.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "font-medium" },
    });
    (__VLS_ctx.detailData.sampleName);
    var __VLS_68;
    const __VLS_69 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
        label: "费用类型",
    }));
    const __VLS_71 = __VLS_70({
        label: "费用类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    __VLS_72.slots.default;
    const __VLS_73 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
        type: "warning",
        size: "small",
        effect: "light",
        ...{ style: {} },
    }));
    const __VLS_75 = __VLS_74({
        type: "warning",
        size: "small",
        effect: "light",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    __VLS_76.slots.default;
    (__VLS_ctx.detailData.feeType || '打样费');
    var __VLS_76;
    var __VLS_72;
    const __VLS_77 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
        label: "购样数量",
    }));
    const __VLS_79 = __VLS_78({
        label: "购样数量",
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    __VLS_80.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.detailData.qty);
    var __VLS_80;
    const __VLS_81 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
        label: "购样单价",
    }));
    const __VLS_83 = __VLS_82({
        label: "购样单价",
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    __VLS_84.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.detailData.price);
    var __VLS_84;
    const __VLS_85 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
        label: "费用合计",
    }));
    const __VLS_87 = __VLS_86({
        label: "费用合计",
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    __VLS_88.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "price-text font-bold" },
    });
    (__VLS_ctx.detailData.amount);
    var __VLS_88;
    if (__VLS_ctx.detailData.channel === '供应商') {
        const __VLS_89 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
            label: "是否可退款",
        }));
        const __VLS_91 = __VLS_90({
            label: "是否可退款",
        }, ...__VLS_functionalComponentArgsRest(__VLS_90));
        __VLS_92.slots.default;
        const __VLS_93 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
            type: (__VLS_ctx.detailData.isRefundable ? 'success' : 'info'),
            size: "small",
        }));
        const __VLS_95 = __VLS_94({
            type: (__VLS_ctx.detailData.isRefundable ? 'success' : 'info'),
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_94));
        __VLS_96.slots.default;
        (__VLS_ctx.detailData.isRefundable ? '是' : '否');
        var __VLS_96;
        var __VLS_92;
    }
    if (__VLS_ctx.detailData.channel === '供应商' && __VLS_ctx.detailData.isRefundable) {
        const __VLS_97 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
            label: "退款条款",
            span: (2),
        }));
        const __VLS_99 = __VLS_98({
            label: "退款条款",
            span: (2),
        }, ...__VLS_functionalComponentArgsRest(__VLS_98));
        __VLS_100.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "refund-policy" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "policy-tag" },
        });
        (__VLS_ctx.detailData.refundMethod || '抵扣首单');
        if (__VLS_ctx.detailData.refundCondition) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "policy-cond" },
            });
            (__VLS_ctx.detailData.refundCondition);
        }
        var __VLS_100;
    }
    var __VLS_64;
    if (__VLS_ctx.detailData.channel === '供应商') {
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
        if (__VLS_ctx.detailData.paymentMethod === '银行转账') {
            const __VLS_101 = {}.ElDescriptions;
            /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
            // @ts-ignore
            const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
                column: (2),
                border: true,
                ...{ class: "custom-desc-table" },
            }));
            const __VLS_103 = __VLS_102({
                column: (2),
                border: true,
                ...{ class: "custom-desc-table" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_102));
            __VLS_104.slots.default;
            const __VLS_105 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
                label: "收款方式",
            }));
            const __VLS_107 = __VLS_106({
                label: "收款方式",
            }, ...__VLS_functionalComponentArgsRest(__VLS_106));
            __VLS_108.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.detailData.paymentMethod || '银行转账');
            var __VLS_108;
            const __VLS_109 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
                label: "开户行",
            }));
            const __VLS_111 = __VLS_110({
                label: "开户行",
            }, ...__VLS_functionalComponentArgsRest(__VLS_110));
            __VLS_112.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.detailData.bankName || '中国工商银行义乌支行');
            var __VLS_112;
            const __VLS_113 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
                label: "账户名称",
            }));
            const __VLS_115 = __VLS_114({
                label: "账户名称",
            }, ...__VLS_functionalComponentArgsRest(__VLS_114));
            __VLS_116.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.detailData.accountName || '义乌得力商贸有限公司');
            var __VLS_116;
            const __VLS_117 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
                label: "银行账号",
            }));
            const __VLS_119 = __VLS_118({
                label: "银行账号",
            }, ...__VLS_functionalComponentArgsRest(__VLS_118));
            __VLS_120.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "font-medium code-style" },
            });
            (__VLS_ctx.detailData.bankAccount || '6217 0038 9001 0293 848');
            var __VLS_120;
            var __VLS_104;
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
                label: "收款方式",
            }));
            const __VLS_127 = __VLS_126({
                label: "收款方式",
            }, ...__VLS_functionalComponentArgsRest(__VLS_126));
            __VLS_128.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.detailData.paymentMethod);
            var __VLS_128;
            const __VLS_129 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
                label: "收款二维码",
            }));
            const __VLS_131 = __VLS_130({
                label: "收款二维码",
            }, ...__VLS_functionalComponentArgsRest(__VLS_130));
            __VLS_132.slots.default;
            if (__VLS_ctx.detailData.paymentQrCode) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "attach-images" },
                });
                const __VLS_133 = {}.ElImage;
                /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
                // @ts-ignore
                const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
                    src: (__VLS_ctx.detailData.paymentQrCode),
                    previewSrcList: ([__VLS_ctx.detailData.paymentQrCode]),
                    fit: "cover",
                    ...{ class: "attach-img-preview" },
                    previewTeleported: true,
                }));
                const __VLS_135 = __VLS_134({
                    src: (__VLS_ctx.detailData.paymentQrCode),
                    previewSrcList: ([__VLS_ctx.detailData.paymentQrCode]),
                    fit: "cover",
                    ...{ class: "attach-img-preview" },
                    previewTeleported: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_134));
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "no-attach" },
                });
            }
            var __VLS_132;
            var __VLS_124;
        }
    }
    if (__VLS_ctx.detailData.feeType === '开模费') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-section mb-20" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-12" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar cyan" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        const __VLS_137 = {}.ElDescriptions;
        /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
        // @ts-ignore
        const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
            column: (2),
            border: true,
            ...{ class: "custom-desc-table" },
        }));
        const __VLS_139 = __VLS_138({
            column: (2),
            border: true,
            ...{ class: "custom-desc-table" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_138));
        __VLS_140.slots.default;
        const __VLS_141 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
            label: "合同文件",
        }));
        const __VLS_143 = __VLS_142({
            label: "合同文件",
        }, ...__VLS_functionalComponentArgsRest(__VLS_142));
        __VLS_144.slots.default;
        if (__VLS_ctx.detailData.contractFiles && __VLS_ctx.detailData.contractFiles.length > 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "contract-file-list" },
            });
            for (const [file, idx] of __VLS_getVForSourceType((__VLS_ctx.detailData.contractFiles))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: (idx),
                    ...{ class: "contract-file-item" },
                    ...{ style: {} },
                });
                const __VLS_145 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({}));
                const __VLS_147 = __VLS_146({}, ...__VLS_functionalComponentArgsRest(__VLS_146));
                __VLS_148.slots.default;
                const __VLS_149 = {}.Document;
                /** @type {[typeof __VLS_components.Document, ]} */ ;
                // @ts-ignore
                const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({}));
                const __VLS_151 = __VLS_150({}, ...__VLS_functionalComponentArgsRest(__VLS_150));
                var __VLS_148;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "file-name" },
                    ...{ style: {} },
                });
                (file.name);
            }
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "no-attach" },
            });
        }
        var __VLS_144;
        const __VLS_153 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
            label: "合同金额",
        }));
        const __VLS_155 = __VLS_154({
            label: "合同金额",
        }, ...__VLS_functionalComponentArgsRest(__VLS_154));
        __VLS_156.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-semibold text-danger" },
        });
        (typeof __VLS_ctx.detailData.contractAmount === 'number' ? __VLS_ctx.detailData.contractAmount.toFixed(2) : (__VLS_ctx.detailData.contractAmount || '0.00'));
        var __VLS_156;
        const __VLS_157 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
            label: "合同备注",
            span: (2),
        }));
        const __VLS_159 = __VLS_158({
            label: "合同备注",
            span: (2),
        }, ...__VLS_functionalComponentArgsRest(__VLS_158));
        __VLS_160.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.detailData.contractRemark || '暂无合同备注');
        var __VLS_160;
        var __VLS_140;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-section mb-10" },
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
    if (__VLS_ctx.detailData.image) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "attach-images" },
        });
        const __VLS_161 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
            src: (__VLS_ctx.detailData.image),
            previewSrcList: ([__VLS_ctx.detailData.image]),
            fit: "cover",
            ...{ class: "attach-img-preview" },
            previewTeleported: true,
        }));
        const __VLS_163 = __VLS_162({
            src: (__VLS_ctx.detailData.image),
            previewSrcList: ([__VLS_ctx.detailData.image]),
            fit: "cover",
            ...{ class: "attach-img-preview" },
            previewTeleported: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_162));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "no-attach" },
        });
    }
    if (__VLS_ctx.detailData.orderScreenshot) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "attach-group mt-12" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "attach-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "attach-images" },
        });
        const __VLS_165 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
            src: (__VLS_ctx.detailData.orderScreenshot),
            previewSrcList: ([__VLS_ctx.detailData.orderScreenshot]),
            fit: "cover",
            ...{ class: "attach-img-preview" },
            previewTeleported: true,
        }));
        const __VLS_167 = __VLS_166({
            src: (__VLS_ctx.detailData.orderScreenshot),
            previewSrcList: ([__VLS_ctx.detailData.orderScreenshot]),
            fit: "cover",
            ...{ class: "attach-img-preview" },
            previewTeleported: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_166));
    }
}
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-footer-actions" },
    });
    const __VLS_169 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_171 = __VLS_170({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
    let __VLS_173;
    let __VLS_174;
    let __VLS_175;
    const __VLS_176 = {
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_172.slots.default;
    var __VLS_172;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['premium-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['purchase-detail-container']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-header-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['bill-no-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['apply-time']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['header-right']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['link-text-ellipsis']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['orange']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
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
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
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
/** @type {__VLS_StyleScopedClasses['cyan']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['contract-file-list']} */ ;
/** @type {__VLS_StyleScopedClasses['contract-file-item']} */ ;
/** @type {__VLS_StyleScopedClasses['file-name']} */ ;
/** @type {__VLS_StyleScopedClasses['no-attach']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-10']} */ ;
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
/** @type {__VLS_StyleScopedClasses['dialog-footer-actions']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Document: Document,
            visible: visible,
            detailData: detailData,
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
//# sourceMappingURL=PurchaseDetailDialog.vue.js.map