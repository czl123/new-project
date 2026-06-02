/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { Timer } from '@element-plus/icons-vue';
const rawTasks = ref([
    {
        image: 'https://picsum.photos/100/100?random=1',
        proposalNo: 'TA-202605049',
        productName: 'DIY灯光板 - 亚克力透明款',
        pm: '颜沙沙',
        category: '家居装饰',
        level: 'C',
        remainingDays: 2,
        isUrgent: true,
        receiverStatus: '待反馈',
        assignees: [{ name: '张三', color: '#1890ff' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=11',
        proposalNo: 'TA-202605060',
        productName: '智能香薰机 - 木纹版',
        pm: '王小明',
        category: '生活电器',
        level: 'B',
        remainingDays: 8,
        isUrgent: false,
        receiverStatus: '待反馈',
        assignees: [{ name: '李华', color: '#52c41a' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=21',
        proposalNo: 'TA-202605065',
        productName: '人体工学鼠标 - 旗舰版',
        pm: '张学友',
        category: '数码配件',
        level: 'A',
        remainingDays: 9,
        isUrgent: true,
        receiverStatus: '已承接',
        assignees: [{ name: '黎明', color: '#1890ff' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=31',
        proposalNo: 'TA-202605071',
        productName: '智能猫砂盆 - 自动清理',
        pm: '严选',
        category: '宠物用品',
        level: 'S',
        remainingDays: 20,
        isUrgent: false,
        receiverStatus: '定制反馈',
        assignees: [{ name: '李想', color: '#1890ff' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=41',
        proposalNo: 'TA-202605076',
        productName: '折叠电动滑板车',
        pm: '颜沙沙',
        category: '出行工具',
        level: 'A',
        remainingDays: 6,
        isUrgent: true,
        receiverStatus: '购样申请',
        assignees: [{ name: '易烊千玺', color: '#1890ff' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=51',
        proposalNo: 'TA-202605082',
        productName: '猫咪自动饮水机',
        pm: '颜沙沙',
        category: '宠物用品',
        level: 'B',
        remainingDays: 1,
        isUrgent: true,
        receiverStatus: '样品待反馈',
        assignees: [{ name: '张子枫', color: '#1890ff' }]
    }
]);
const kanbanColumns = computed(() => [
    { label: '待反馈', status: '待反馈', color: '#d9d9d9', tasks: rawTasks.value.filter(t => t.receiverStatus === '待反馈') },
    { label: '已承接', status: '已承接', color: '#1890ff', tasks: rawTasks.value.filter(t => t.receiverStatus === '已承接') },
    { label: '定制反馈', status: '定制反馈', color: '#faad14', tasks: rawTasks.value.filter(t => t.receiverStatus === '定制反馈') },
    { label: '购样申请', status: '购样申请', color: '#722ed1', tasks: rawTasks.value.filter(t => t.receiverStatus === '购样申请') },
    { label: '样品评估', status: '样品待反馈', color: '#52c41a', tasks: rawTasks.value.filter(t => t.receiverStatus === '样品待反馈') }
]);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "kanban-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dashboard-header modern-card mb-16" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "trend up" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-card urgent" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "trend danger" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "trend down" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-card success" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "value" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "trend" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "kanban-container custom-scrollbar" },
});
for (const [column] of __VLS_getVForSourceType((__VLS_ctx.kanbanColumns))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (column.status),
        ...{ class: "kanban-column" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "column-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dot" },
        ...{ style: ({ backgroundColor: column.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title" },
    });
    (column.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "count" },
    });
    (column.tasks.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "column-body" },
    });
    for (const [task] of __VLS_getVForSourceType((column.tasks))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (task.proposalNo),
            ...{ class: "task-card" },
            ...{ class: ({ urgent: task.isUrgent }) },
        });
        if (task.isUrgent) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "card-tag" },
            });
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "task-top" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "no" },
        });
        (task.proposalNo);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "pm" },
        });
        (task.pm);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "task-info" },
        });
        const __VLS_0 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            src: (task.image),
            ...{ class: "task-img" },
        }));
        const __VLS_2 = __VLS_1({
            src: (task.image),
            ...{ class: "task-img" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "task-details" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "name" },
        });
        (task.productName);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "meta" },
        });
        (task.category);
        (task.level);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "task-footer" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "time" },
            ...{ class: ({ danger: task.remainingDays <= 3 }) },
        });
        const __VLS_4 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
        const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
        __VLS_7.slots.default;
        const __VLS_8 = {}.Timer;
        /** @type {[typeof __VLS_components.Timer, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
        const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
        var __VLS_7;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (task.remainingDays);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "assignees" },
        });
        for (const [user] of __VLS_getVForSourceType((task.assignees.slice(0, 2)))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (user.name),
                ...{ class: "avatar-mini" },
                ...{ style: ({ backgroundColor: user.color }) },
                title: (user.name),
            });
            (user.name.charAt(0));
        }
    }
}
/** @type {__VLS_StyleScopedClasses['kanban-page']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-header']} */ ;
/** @type {__VLS_StyleScopedClasses['modern-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['trend']} */ ;
/** @type {__VLS_StyleScopedClasses['up']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['trend']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['trend']} */ ;
/** @type {__VLS_StyleScopedClasses['down']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['trend']} */ ;
/** @type {__VLS_StyleScopedClasses['kanban-container']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['kanban-column']} */ ;
/** @type {__VLS_StyleScopedClasses['column-header']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['count']} */ ;
/** @type {__VLS_StyleScopedClasses['column-body']} */ ;
/** @type {__VLS_StyleScopedClasses['task-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['task-top']} */ ;
/** @type {__VLS_StyleScopedClasses['no']} */ ;
/** @type {__VLS_StyleScopedClasses['pm']} */ ;
/** @type {__VLS_StyleScopedClasses['task-info']} */ ;
/** @type {__VLS_StyleScopedClasses['task-img']} */ ;
/** @type {__VLS_StyleScopedClasses['task-details']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
/** @type {__VLS_StyleScopedClasses['task-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['time']} */ ;
/** @type {__VLS_StyleScopedClasses['assignees']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-mini']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Timer: Timer,
            kanbanColumns: kanbanColumns,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=sample-task-kanban.vue.js.map