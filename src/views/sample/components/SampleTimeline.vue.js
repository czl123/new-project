/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
const props = defineProps();
const activities = computed(() => {
    if (!props.data || props.data.length === 0) {
        // 默认示例数据
        return [
            {
                content: '提交测试: 升级为确认样',
                timestamp: '2026-05-09 14:20',
                operator: '张三',
                type: 'primary',
                size: 'large',
                status: '合格',
                statusType: 'success',
                remark: '样品各项指标均符合大货生产要求。'
            },
            {
                content: '样品入库',
                timestamp: '2026-05-08 10:00',
                operator: '系统自动',
                remark: '调研样自动同步入库'
            },
            {
                content: '开发样登记',
                timestamp: '2026-05-08 09:30',
                operator: '李四'
            }
        ];
    }
    return props.data;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "timeline-container" },
});
const __VLS_0 = {}.ElTimeline;
/** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
for (const [activity, index] of __VLS_getVForSourceType((__VLS_ctx.activities))) {
    const __VLS_4 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        key: (index),
        type: (activity.type),
        color: (activity.color),
        size: (activity.size),
        timestamp: (activity.timestamp),
    }));
    const __VLS_6 = __VLS_5({
        key: (index),
        type: (activity.type),
        color: (activity.color),
        size: (activity.size),
        timestamp: (activity.timestamp),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "activity-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "activity-node" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "node-label" },
    });
    (activity.content);
    if (activity.status) {
        const __VLS_8 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
            size: "small",
            type: (activity.statusType),
            ...{ class: "node-status" },
        }));
        const __VLS_10 = __VLS_9({
            size: "small",
            type: (activity.statusType),
            ...{ class: "node-status" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        __VLS_11.slots.default;
        (activity.status);
        var __VLS_11;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "activity-meta" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "operator" },
    });
    const __VLS_12 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
    const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    const __VLS_16 = {}.User;
    /** @type {[typeof __VLS_components.User, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
    const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
    var __VLS_15;
    (activity.operator);
    if (activity.remark) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "remark" },
        });
        (activity.remark);
    }
    var __VLS_7;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['timeline-container']} */ ;
/** @type {__VLS_StyleScopedClasses['activity-content']} */ ;
/** @type {__VLS_StyleScopedClasses['activity-node']} */ ;
/** @type {__VLS_StyleScopedClasses['node-label']} */ ;
/** @type {__VLS_StyleScopedClasses['node-status']} */ ;
/** @type {__VLS_StyleScopedClasses['activity-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['operator']} */ ;
/** @type {__VLS_StyleScopedClasses['remark']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            activities: activities,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=SampleTimeline.vue.js.map