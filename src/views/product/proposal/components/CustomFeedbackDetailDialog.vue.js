/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onUnmounted } from 'vue';
import { InfoFilled, Management, Document, Picture } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const visible = ref(false);
const taskInfo = ref({});
const feedbackList = ref([]);
// 倒计时
const feedbackCountdown = ref(null);
const taskCountdown = ref(null);
let countdownTimer = null;
const calcCountdown = (dateStr) => {
    const target = new Date(dateStr).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0)
        return null;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { days, hours, minutes, seconds, urgent: diff < 86400000 };
};
const startCountdown = () => {
    if (countdownTimer)
        clearInterval(countdownTimer);
    const tick = () => {
        feedbackCountdown.value = taskInfo.value.feedbackDeadline ? calcCountdown(taskInfo.value.feedbackDeadline) : null;
        taskCountdown.value = taskInfo.value.taskDeadline ? calcCountdown(taskInfo.value.taskDeadline) : null;
    };
    tick();
    countdownTimer = setInterval(tick, 1000);
};
onUnmounted(() => {
    if (countdownTimer)
        clearInterval(countdownTimer);
});
// 模拟不同任务反馈数据的生成器
const getMockFeedbacks = (proposalNo) => {
    const num = parseInt(proposalNo.replace(/\D/g, '')) || 0;
    const randomSeed = num % 3;
    if (randomSeed === 0) {
        return [
            {
                code: 'FB-20260424-001',
                date: '2026-04-24',
                user: '李强',
                source: '浙江义乌',
                feeType: '打样费',
                fee: '¥ 150.00',
                isRefundable: '是',
                refundCondition: '首单达到1000件返还',
                initialQuote: '¥ 32.00',
                productionCycle: '10 天',
                customDuration: '5 天',
                moq: '1000',
                additionalConditions: '含增值税专票，包邮',
                isAdopted: '已采纳',
                notes: '打样板质量优良，魔术贴抗拉强度高，缝线牢固，推荐采纳'
            },
            {
                code: 'FB-20260425-002',
                date: '2026-04-25',
                user: '张华',
                source: '广东深圳',
                feeType: '开模费',
                fee: '¥ 3000.00',
                isRefundable: '否',
                refundCondition: '-',
                initialQuote: '¥ 29.50',
                productionCycle: '15 天',
                customDuration: '8 天',
                moq: '2000',
                additionalConditions: '需首付50%模具费',
                isAdopted: '已驳回',
                notes: '模具费用较高，且起订量要求大，周期较长，不作为首选'
            }
        ];
    }
    else if (randomSeed === 1) {
        return [
            {
                code: 'FB-20260502-001',
                date: '2026-05-02',
                user: '王健',
                source: '江苏常州',
                feeType: '打样费',
                fee: '¥ 200.00',
                isRefundable: '是',
                refundCondition: '首单订货金额满1万退还',
                initialQuote: '¥ 18.50',
                productionCycle: '8 天',
                customDuration: '4 天',
                moq: '500',
                additionalConditions: '不含税，运费到付',
                isAdopted: '待决策',
                notes: ''
            },
            {
                code: 'FB-20260503-002',
                date: '2026-05-03',
                user: '吴美林',
                source: '福建厦门',
                feeType: '无',
                fee: '免费',
                isRefundable: '否',
                refundCondition: '-',
                initialQuote: '¥ 22.00',
                productionCycle: '12 天',
                customDuration: '6 天',
                moq: '1000',
                additionalConditions: '提供免费设计微调服务',
                isAdopted: '已采纳',
                notes: '打样免费，厂家实力强，虽然单价略高，但整体质量非常符合要求'
            },
            {
                code: 'FB-20260504-003',
                date: '2026-05-04',
                user: '赵铁柱',
                source: '河北廊坊',
                feeType: '打样费',
                fee: '¥ 100.00',
                isRefundable: '是',
                refundCondition: '首单即退',
                initialQuote: '¥ 21.00',
                productionCycle: '14 天',
                customDuration: '7 天',
                moq: '800',
                additionalConditions: '含税13%专票',
                isAdopted: '已驳回',
                notes: '生产周期较慢，不满足紧急上架需求'
            }
        ];
    }
    else {
        return [
            {
                code: 'FB-20260510-001',
                date: '2026-05-10',
                user: '汪宇',
                source: '河北省-廊坊市',
                feeType: '打样费',
                fee: '¥ 80.00',
                isRefundable: '是',
                refundCondition: '首单满800件退还',
                initialQuote: '¥ 60.00',
                productionCycle: '30 天',
                customDuration: '15 天',
                moq: '1000',
                additionalConditions: '含外包装设计',
                isAdopted: '已采纳',
                notes: '各方面测试反馈完美，打样费极低，满足提案标准，确定采纳'
            }
        ];
    }
};
const open = (row) => {
    taskInfo.value = {
        proposalNo: row.proposalNo || '',
        productName: row.productName || 'ZZ-定制产品',
        manager: row.manager || '杨登峰',
        category: row.category || '默认大类',
        status: row.status || '拿样中',
        date: row.date || '2026-06-08',
        bottomLinePrice: row.bottomLinePrice || '32 CNY',
        customCycle: row.customCycle || '10天',
        supplementaryRequirement: row.supplementaryRequirement || '请重点确认魔术贴的使用寿命，以及边缘缝线是否容易脱落。',
        designFiles: row.designFiles || [],
        feedbackDeadline: row.feedbackDeadline || '2026-06-15 18:00:00',
        taskDeadline: row.taskDeadline || '2026-06-30 23:59:59'
    };
    feedbackList.value = getMockFeedbacks(taskInfo.value.proposalNo);
    startCountdown();
    visible.value = true;
};
// 采纳操作
const handleAdopt = (row) => {
    ElMessageBox.prompt(`请输入采纳方案【${row.code}】的开发反馈说明：`, '确认采纳', {
        confirmButtonText: '确定采纳',
        cancelButtonText: '取消',
        inputPlaceholder: '请填写采纳理由说明，例如：样品符合设计规格，且报价具有较高性价比，满足上架计划。',
        inputValidator: (val) => {
            if (!val || !val.trim()) {
                return '开发反馈说明不能为空';
            }
            return true;
        },
        buttonSize: 'small'
    }).then(({ value }) => {
        feedbackList.value.forEach(item => {
            if (item.code === row.code) {
                item.isAdopted = '已采纳';
                item.notes = value;
            }
            else {
                item.isAdopted = '不采纳';
                if (item.isAdopted === '待决策') {
                    item.notes = '未被采纳';
                }
            }
        });
        ElMessage.success(`方案【${row.code}】已成功采纳！`);
    }).catch(() => { });
};
// 不采纳操作
const handleNotAdopt = (row) => {
    ElMessageBox.prompt(`请输入不采纳方案【${row.code}】的开发反馈说明：`, '确认不采纳', {
        confirmButtonText: '确定不采纳',
        cancelButtonText: '取消',
        inputPlaceholder: '请填写不采纳理由说明，例如：不符合设计规格 / 预算超标。',
        inputValidator: (val) => {
            if (!val || !val.trim()) {
                return '不采纳原因说明不能为空';
            }
            return true;
        },
        buttonSize: 'small'
    }).then(({ value }) => {
        row.isAdopted = '不采纳';
        row.notes = value;
        ElMessage.success(`方案【${row.code}】已设定为“不采纳”`);
    }).catch(() => { });
};
// 驳回操作
const handleReject = (row) => {
    ElMessageBox.prompt(`请输入驳回方案【${row.code}】的开发反馈原因：`, '确认驳回', {
        confirmButtonText: '确定驳回',
        cancelButtonText: '取消',
        inputPlaceholder: '请填写驳回原因说明，例如：方案信息不全，需采购重新核实后提交。',
        inputValidator: (val) => {
            if (!val || !val.trim()) {
                return '驳回原因说明不能为空';
            }
            return true;
        },
        buttonSize: 'small'
    }).then(({ value }) => {
        row.isAdopted = '已驳回';
        row.notes = value;
        ElMessage.success(`方案【${row.code}】已驳回`);
    }).catch(() => { });
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
    width: "1200px",
    ...{ class: "custom-feedback-detail-dialog" },
    destroyOnClose: true,
    alignCenter: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    width: "1200px",
    ...{ class: "custom-feedback-detail-dialog" },
    destroyOnClose: true,
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-header-custom" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title-main" },
    });
    if (__VLS_ctx.taskInfo.proposalNo) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "proposal-no-badge" },
        });
        (__VLS_ctx.taskInfo.proposalNo);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dialog-container left-right-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "left-pane custom-scrollbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "logo-area" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "logo-placeholder" },
});
const __VLS_5 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ class: "logo-icon" },
}));
const __VLS_7 = __VLS_6({
    ...{ class: "logo-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.Picture;
/** @type {[typeof __VLS_components.Picture, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
var __VLS_8;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "logo-hint" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "logo-meta" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "logo-title" },
});
(__VLS_ctx.taskInfo.productName || 'ZZ-定制产品');
const __VLS_13 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    size: "small",
    type: "warning",
    effect: "dark",
    ...{ class: "logo-tag" },
}));
const __VLS_15 = __VLS_14({
    size: "small",
    type: "warning",
    effect: "dark",
    ...{ class: "logo-tag" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
var __VLS_16;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pane-divider" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pane-title" },
});
const __VLS_17 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    ...{ class: "title-icon" },
}));
const __VLS_19 = __VLS_18({
    ...{ class: "title-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
const __VLS_21 = {}.InfoFilled;
/** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
var __VLS_20;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "task-info-vertical" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value font-mono font-bold" },
});
(__VLS_ctx.taskInfo.proposalNo || '-');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value font-bold" },
});
(__VLS_ctx.taskInfo.productName || '-');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value" },
});
(__VLS_ctx.taskInfo.manager || '-');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value" },
});
(__VLS_ctx.taskInfo.category || '-');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value highlight-price" },
});
(__VLS_ctx.taskInfo.bottomLinePrice || '32 CNY');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value" },
});
(__VLS_ctx.taskInfo.customCycle || '7天');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value" },
});
(__VLS_ctx.taskInfo.date || '-');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "value" },
});
const __VLS_25 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    size: "small",
    type: (__VLS_ctx.taskInfo.status === '待设计' ? 'info' : 'warning'),
}));
const __VLS_27 = __VLS_26({
    size: "small",
    type: (__VLS_ctx.taskInfo.status === '待设计' ? 'info' : 'warning'),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_28.slots.default;
(__VLS_ctx.taskInfo.status || '-');
var __VLS_28;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-row deadline-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "deadline-block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "deadline-date" },
});
(__VLS_ctx.taskInfo.feedbackDeadline || '-');
if (__VLS_ctx.feedbackCountdown) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "countdown-chips" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "chip" },
        ...{ class: ({ urgent: __VLS_ctx.feedbackCountdown.urgent }) },
    });
    (__VLS_ctx.feedbackCountdown.days);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "chip" },
        ...{ class: ({ urgent: __VLS_ctx.feedbackCountdown.urgent }) },
    });
    (__VLS_ctx.feedbackCountdown.hours);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "chip" },
        ...{ class: ({ urgent: __VLS_ctx.feedbackCountdown.urgent }) },
    });
    (__VLS_ctx.feedbackCountdown.minutes);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "chip" },
        ...{ class: ({ urgent: __VLS_ctx.feedbackCountdown.urgent }) },
    });
    (__VLS_ctx.feedbackCountdown.seconds);
}
else if (__VLS_ctx.taskInfo.feedbackDeadline) {
    const __VLS_29 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        size: "small",
        type: "info",
    }));
    const __VLS_31 = __VLS_30({
        size: "small",
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    __VLS_32.slots.default;
    var __VLS_32;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-row deadline-row border-none" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "deadline-block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "deadline-date" },
});
(__VLS_ctx.taskInfo.taskDeadline || '-');
if (__VLS_ctx.taskCountdown) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "countdown-chips" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "chip" },
        ...{ class: ({ urgent: __VLS_ctx.taskCountdown.urgent }) },
    });
    (__VLS_ctx.taskCountdown.days);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "chip" },
        ...{ class: ({ urgent: __VLS_ctx.taskCountdown.urgent }) },
    });
    (__VLS_ctx.taskCountdown.hours);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "chip" },
        ...{ class: ({ urgent: __VLS_ctx.taskCountdown.urgent }) },
    });
    (__VLS_ctx.taskCountdown.minutes);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "chip" },
        ...{ class: ({ urgent: __VLS_ctx.taskCountdown.urgent }) },
    });
    (__VLS_ctx.taskCountdown.seconds);
}
else if (__VLS_ctx.taskInfo.taskDeadline) {
    const __VLS_33 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        size: "small",
        type: "danger",
    }));
    const __VLS_35 = __VLS_34({
        size: "small",
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    __VLS_36.slots.default;
    var __VLS_36;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pane-divider" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "supp-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-value" },
});
(__VLS_ctx.taskInfo.supplementaryRequirement || '请重点确认魔术贴的使用寿命，以及边缘缝线是否容易脱落。');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pane-divider" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "attach-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "attach-list" },
});
for (const [file, idx] of __VLS_getVForSourceType((__VLS_ctx.taskInfo.designFiles))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (idx),
        ...{ class: "file-chip" },
    });
    const __VLS_37 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        ...{ class: "file-icon" },
    }));
    const __VLS_39 = __VLS_38({
        ...{ class: "file-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    __VLS_40.slots.default;
    const __VLS_41 = {}.Document;
    /** @type {[typeof __VLS_components.Document, ]} */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({}));
    const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
    var __VLS_40;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "file-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "file-name" },
        title: (file.name),
    });
    (file.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "file-meta" },
    });
    (file.uploader);
    (file.date);
}
if (!__VLS_ctx.taskInfo.designFiles || __VLS_ctx.taskInfo.designFiles.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "file-chip" },
    });
    const __VLS_45 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
        ...{ class: "file-icon" },
    }));
    const __VLS_47 = __VLS_46({
        ...{ class: "file-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    __VLS_48.slots.default;
    const __VLS_49 = {}.Document;
    /** @type {[typeof __VLS_components.Document, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({}));
    const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
    var __VLS_48;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "file-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "file-name" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "file-meta" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "right-pane" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pane-title" },
});
const __VLS_53 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
    ...{ class: "title-icon" },
}));
const __VLS_55 = __VLS_54({
    ...{ class: "title-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
__VLS_56.slots.default;
const __VLS_57 = {}.Management;
/** @type {[typeof __VLS_components.Management, ]} */ ;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({}));
const __VLS_59 = __VLS_58({}, ...__VLS_functionalComponentArgsRest(__VLS_58));
var __VLS_56;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "subtitle-desc ml-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feedback-table-wrapper" },
});
const __VLS_61 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    data: (__VLS_ctx.feedbackList),
    border: true,
    stripe: true,
    size: "small",
    ...{ class: "premium-table" },
    headerCellClassName: "premium-header",
    rowClassName: "premium-row",
    height: "100%",
}));
const __VLS_63 = __VLS_62({
    data: (__VLS_ctx.feedbackList),
    border: true,
    stripe: true,
    size: "small",
    ...{ class: "premium-table" },
    headerCellClassName: "premium-header",
    rowClassName: "premium-row",
    height: "100%",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_64.slots.default;
const __VLS_65 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    label: "反馈编号",
    prop: "code",
    width: "135",
}));
const __VLS_67 = __VLS_66({
    label: "反馈编号",
    prop: "code",
    width: "135",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_68.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_68.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "code-text" },
    });
    (row.code);
}
var __VLS_68;
const __VLS_69 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    label: "反馈日期",
    prop: "date",
    width: "95",
    align: "center",
}));
const __VLS_71 = __VLS_70({
    label: "反馈日期",
    prop: "date",
    width: "95",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
const __VLS_73 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    label: "反馈人",
    prop: "user",
    width: "90",
    align: "center",
}));
const __VLS_75 = __VLS_74({
    label: "反馈人",
    prop: "user",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
__VLS_76.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_76.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "user-cell" },
    });
    const __VLS_77 = {}.ElAvatar;
    /** @type {[typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, typeof __VLS_components.ElAvatar, typeof __VLS_components.elAvatar, ]} */ ;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
        size: (20),
        ...{ class: "mr-4" },
    }));
    const __VLS_79 = __VLS_78({
        size: (20),
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    __VLS_80.slots.default;
    (row.user.charAt(0));
    var __VLS_80;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (row.user);
}
var __VLS_76;
const __VLS_81 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    label: "货源地",
    prop: "source",
    width: "100",
    align: "center",
}));
const __VLS_83 = __VLS_82({
    label: "货源地",
    prop: "source",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
__VLS_84.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_84.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_85 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
        size: "small",
        type: "info",
        effect: "light",
    }));
    const __VLS_87 = __VLS_86({
        size: "small",
        type: "info",
        effect: "light",
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    __VLS_88.slots.default;
    (row.source);
    var __VLS_88;
}
var __VLS_84;
const __VLS_89 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    label: "费用类型",
    prop: "feeType",
    width: "85",
    align: "center",
}));
const __VLS_91 = __VLS_90({
    label: "费用类型",
    prop: "feeType",
    width: "85",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
const __VLS_93 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    label: "费用",
    prop: "fee",
    width: "90",
    align: "right",
}));
const __VLS_95 = __VLS_94({
    label: "费用",
    prop: "fee",
    width: "90",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
__VLS_96.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_96.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "fee-text font-bold" },
    });
    (row.fee);
}
var __VLS_96;
const __VLS_97 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    label: "是否可退",
    prop: "isRefundable",
    width: "80",
    align: "center",
}));
const __VLS_99 = __VLS_98({
    label: "是否可退",
    prop: "isRefundable",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
__VLS_100.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_100.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_101 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
        size: "small",
        type: (row.isRefundable === '是' ? 'success' : 'danger'),
        effect: "plain",
    }));
    const __VLS_103 = __VLS_102({
        size: "small",
        type: (row.isRefundable === '是' ? 'success' : 'danger'),
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    __VLS_104.slots.default;
    (row.isRefundable);
    var __VLS_104;
}
var __VLS_100;
const __VLS_105 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
    label: "退款条件",
    prop: "refundCondition",
    width: "150",
    showOverflowTooltip: true,
}));
const __VLS_107 = __VLS_106({
    label: "退款条件",
    prop: "refundCondition",
    width: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
__VLS_108.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_108.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ({ 'text-secondary': row.isRefundable === '否' }) },
    });
    (row.refundCondition);
}
var __VLS_108;
const __VLS_109 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    label: "初次报价",
    prop: "initialQuote",
    width: "90",
    align: "right",
}));
const __VLS_111 = __VLS_110({
    label: "初次报价",
    prop: "initialQuote",
    width: "90",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
__VLS_112.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_112.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "price-text" },
    });
    (row.initialQuote);
}
var __VLS_112;
const __VLS_113 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    label: "生产周期",
    prop: "productionCycle",
    width: "85",
    align: "center",
}));
const __VLS_115 = __VLS_114({
    label: "生产周期",
    prop: "productionCycle",
    width: "85",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
__VLS_116.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_116.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "cycle-text" },
    });
    (row.productionCycle);
}
var __VLS_116;
const __VLS_117 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    label: "定制用时",
    prop: "customDuration",
    width: "85",
    align: "center",
}));
const __VLS_119 = __VLS_118({
    label: "定制用时",
    prop: "customDuration",
    width: "85",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
__VLS_120.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_120.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "duration-text" },
    });
    (row.customDuration);
}
var __VLS_120;
const __VLS_121 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
    label: "起订量",
    prop: "moq",
    width: "75",
    align: "center",
}));
const __VLS_123 = __VLS_122({
    label: "起订量",
    prop: "moq",
    width: "75",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
const __VLS_125 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    label: "附加条件",
    prop: "additionalConditions",
    minWidth: "140",
    showOverflowTooltip: true,
}));
const __VLS_127 = __VLS_126({
    label: "附加条件",
    prop: "additionalConditions",
    minWidth: "140",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
const __VLS_129 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    label: "备注说明",
    prop: "notes",
    minWidth: "170",
    showOverflowTooltip: true,
}));
const __VLS_131 = __VLS_130({
    label: "备注说明",
    prop: "notes",
    minWidth: "170",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
__VLS_132.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_132.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (row.notes || '-');
}
var __VLS_132;
const __VLS_133 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    label: "操作",
    width: "160",
    align: "center",
}));
const __VLS_135 = __VLS_134({
    label: "操作",
    width: "160",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
__VLS_136.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_136.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.isAdopted === '待决策') {
        const __VLS_137 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
            size: "small",
        }));
        const __VLS_139 = __VLS_138({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_138));
        let __VLS_141;
        let __VLS_142;
        let __VLS_143;
        const __VLS_144 = {
            onClick: (...[$event]) => {
                if (!(row.isAdopted === '待决策'))
                    return;
                __VLS_ctx.handleAdopt(row);
            }
        };
        __VLS_140.slots.default;
        var __VLS_140;
        const __VLS_145 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
            ...{ 'onClick': {} },
            type: "danger",
            link: true,
            size: "small",
        }));
        const __VLS_147 = __VLS_146({
            ...{ 'onClick': {} },
            type: "danger",
            link: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_146));
        let __VLS_149;
        let __VLS_150;
        let __VLS_151;
        const __VLS_152 = {
            onClick: (...[$event]) => {
                if (!(row.isAdopted === '待决策'))
                    return;
                __VLS_ctx.handleNotAdopt(row);
            }
        };
        __VLS_148.slots.default;
        var __VLS_148;
        const __VLS_153 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
            ...{ 'onClick': {} },
            type: "warning",
            link: true,
            size: "small",
        }));
        const __VLS_155 = __VLS_154({
            ...{ 'onClick': {} },
            type: "warning",
            link: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_154));
        let __VLS_157;
        let __VLS_158;
        let __VLS_159;
        const __VLS_160 = {
            onClick: (...[$event]) => {
                if (!(row.isAdopted === '待决策'))
                    return;
                __VLS_ctx.handleReject(row);
            }
        };
        __VLS_156.slots.default;
        var __VLS_156;
    }
    else if (row.isAdopted === '已采纳') {
        const __VLS_161 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
            size: "small",
            type: "success",
            effect: "dark",
        }));
        const __VLS_163 = __VLS_162({
            size: "small",
            type: "success",
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_162));
        __VLS_164.slots.default;
        var __VLS_164;
    }
    else if (row.isAdopted === '不采纳') {
        const __VLS_165 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
            size: "small",
            type: "info",
            effect: "dark",
        }));
        const __VLS_167 = __VLS_166({
            size: "small",
            type: "info",
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_166));
        __VLS_168.slots.default;
        var __VLS_168;
    }
    else if (row.isAdopted === '已驳回') {
        const __VLS_169 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
            size: "small",
            type: "warning",
            effect: "dark",
        }));
        const __VLS_171 = __VLS_170({
            size: "small",
            type: "warning",
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_170));
        __VLS_172.slots.default;
        var __VLS_172;
    }
}
var __VLS_136;
var __VLS_64;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-footer" },
    });
    const __VLS_173 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
        ...{ 'onClick': {} },
    }));
    const __VLS_175 = __VLS_174({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_174));
    let __VLS_177;
    let __VLS_178;
    let __VLS_179;
    const __VLS_180 = {
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_176.slots.default;
    var __VLS_176;
    const __VLS_181 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_183 = __VLS_182({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_182));
    let __VLS_185;
    let __VLS_186;
    let __VLS_187;
    const __VLS_188 = {
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_184.slots.default;
    var __VLS_184;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['custom-feedback-detail-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-header-custom']} */ ;
/** @type {__VLS_StyleScopedClasses['title-main']} */ ;
/** @type {__VLS_StyleScopedClasses['proposal-no-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-container']} */ ;
/** @type {__VLS_StyleScopedClasses['left-right-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['left-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-area']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-title']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-divider']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['task-info-vertical']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight-price']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['deadline-row']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['deadline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['deadline-date']} */ ;
/** @type {__VLS_StyleScopedClasses['countdown-chips']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['info-row']} */ ;
/** @type {__VLS_StyleScopedClasses['deadline-row']} */ ;
/** @type {__VLS_StyleScopedClasses['border-none']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['deadline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['deadline-date']} */ ;
/** @type {__VLS_StyleScopedClasses['countdown-chips']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-divider']} */ ;
/** @type {__VLS_StyleScopedClasses['supp-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-label']} */ ;
/** @type {__VLS_StyleScopedClasses['section-value']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-divider']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-label']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-list']} */ ;
/** @type {__VLS_StyleScopedClasses['file-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['file-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['file-info']} */ ;
/** @type {__VLS_StyleScopedClasses['file-name']} */ ;
/** @type {__VLS_StyleScopedClasses['file-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['file-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['file-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['file-info']} */ ;
/** @type {__VLS_StyleScopedClasses['file-name']} */ ;
/** @type {__VLS_StyleScopedClasses['file-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['right-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-table-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['premium-table']} */ ;
/** @type {__VLS_StyleScopedClasses['code-text']} */ ;
/** @type {__VLS_StyleScopedClasses['user-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['fee-text']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['cycle-text']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-text']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            InfoFilled: InfoFilled,
            Management: Management,
            Document: Document,
            Picture: Picture,
            visible: visible,
            taskInfo: taskInfo,
            feedbackList: feedbackList,
            feedbackCountdown: feedbackCountdown,
            taskCountdown: taskCountdown,
            handleAdopt: handleAdopt,
            handleNotAdopt: handleNotAdopt,
            handleReject: handleReject,
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
//# sourceMappingURL=CustomFeedbackDetailDialog.vue.js.map