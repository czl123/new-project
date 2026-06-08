/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { UserFilled, Shop, VideoPlay, InfoFilled, CircleCheckFilled, OfficeBuilding, User, Promotion, Pointer } from '@element-plus/icons-vue';
const activeMenu = ref('grade');
const searchKeyword = ref('');
const filterPlatform = ref('');
const logDialogVisible = ref(false);
const currentLogModule = ref('');
const logRecords = ref([
    { operator: '系统管理员', time: '2024-05-09 10:00:00', action: '修改配置', detail: '将提案S级的首单采购金额门槛从 400,000 调整为 500,000' },
    { operator: '张三', time: '2024-05-08 14:30:00', action: '新增规则', detail: '新增研发费审批阶梯：0-100 免审' },
    { operator: '李四', time: '2024-05-07 09:15:00', action: '开启状态', detail: '开启了 拿样时效标准 的自动审批开关' }
]);
const showLog = (module) => {
    currentLogModule.value = module;
    logDialogVisible.value = true;
};
const proposalGrades = ref([
    { grade: 'S', minQty: 10000, minAmount: 500000, autoApprove: false },
    { grade: 'A', minQty: 5000, minAmount: 300000, autoApprove: false },
    { grade: 'B', minQty: 3000, minAmount: 150000, autoApprove: false },
    { grade: 'C', minQty: 2000, minAmount: 80000, autoApprove: true },
    { grade: 'D', minQty: 1000, minAmount: 1, autoApprove: true }
]);
const sampleDurations = ref([
    { type: '现货', feedbackDays: 1, sampleDays: 7 },
    { type: '定制', feedbackDays: 3, sampleDays: 30 }
]);
const durationEditDialogVisible = ref(false);
const durationEditForm = ref({
    type: '',
    feedbackDays: 0,
    sampleDays: 0
});
let currentDurationIndex = -1;
const handleDurationEdit = (row) => {
    currentDurationIndex = sampleDurations.value.findIndex(i => i.type === row.type);
    durationEditForm.value = JSON.parse(JSON.stringify(row));
    durationEditDialogVisible.value = true;
};
const saveDurationEdit = () => {
    if (currentDurationIndex > -1) {
        sampleDurations.value[currentDurationIndex] = JSON.parse(JSON.stringify(durationEditForm.value));
    }
    durationEditDialogVisible.value = false;
    ElMessage.success('时效标准已更新');
};
// 提案节点审批人配置数据 (矩阵版)
const approverConfigs = ref([
    {
        grade: 'S',
        mandatoryL2: true,
        configs: [
            { platform: 'Amazon', firstApprover: ['张经理'], l2Triggers: ['mold'], costThreshold: 1000, secondApprover: ['陈副总'] },
            { platform: 'Tiktok', firstApprover: ['李总监'], l2Triggers: ['mold'], costThreshold: 1000, secondApprover: ['陈副总'] }
        ]
    },
    {
        grade: 'A',
        mandatoryL2: true,
        configs: [
            { platform: 'Amazon', firstApprover: ['李总监'], l2Triggers: [], costThreshold: 1000, secondApprover: ['陈副总'] },
            { platform: 'Tiktok', firstApprover: ['王组长'], l2Triggers: [], costThreshold: 1000, secondApprover: ['陈副总'] }
        ]
    },
    {
        grade: 'B',
        mandatoryL2: false,
        configs: [
            { platform: 'Tiktok', firstApprover: ['王组长'], l2Triggers: ['cost'], costThreshold: 2000, secondApprover: ['陈副总'] }
        ]
    },
    {
        grade: 'C',
        mandatoryL2: false,
        configs: [
            { platform: 'Amazon', firstApprover: ['王组长'], l2Triggers: [], costThreshold: 1000, secondApprover: [] },
            { platform: 'Tiktok', firstApprover: ['王组长'], l2Triggers: [], costThreshold: 1000, secondApprover: [] }
        ]
    }
]);
const rdFeeApprovals = ref([
    {
        id: 1,
        minAmount: 0,
        maxAmount: 100,
        enabled: true,
        isDefault: false,
        rules: [
            { enabled: true, skipApproval: true, categories: ['纺织品', '服装'], group: '纺织品类组', approvers: [], approvalType: 'or', ccList: [] },
            { enabled: true, skipApproval: true, categories: [], group: '通用开发组', approvers: [], approvalType: 'or', ccList: [] }
        ]
    },
    {
        id: 2,
        minAmount: 100,
        maxAmount: 300,
        enabled: true,
        isDefault: false,
        rules: [
            { enabled: true, skipApproval: false, categories: ['纺织品', '服装'], group: '纺织品类组', approvers: ['王经理', '张总监'], approvalType: 'and', ccList: ['财务部'] },
            { enabled: true, skipApproval: true, categories: [], group: '通用开发组', approvers: [], approvalType: 'or', ccList: [] }
        ]
    },
    {
        id: 3,
        minAmount: 300,
        maxAmount: 5000,
        enabled: true,
        isDefault: false,
        rules: [
            { enabled: true, skipApproval: false, categories: ['纺织品', '服装'], group: '纺织品类组', approvers: ['王经理'], approvalType: 'or', ccList: ['财务部'] },
            { enabled: true, skipApproval: false, categories: [], group: '通用开发组', approvers: ['余郝~', '财务BP'], approvalType: 'or', ccList: ['项目办'] }
        ]
    },
    {
        id: 4,
        minAmount: 5000,
        maxAmount: Infinity,
        enabled: true,
        isDefault: true,
        rules: [
            { enabled: true, skipApproval: false, categories: [], group: '决策委员会', approvers: ['CEO', 'CFO'], approvalType: 'and', ccList: ['总经办'] }
        ]
    }
]);
const rdEditDialogVisible = ref(false);
const rdEditForm = ref({
    minAmount: 0,
    maxAmount: 100,
    enabled: true,
    isDefault: false,
    rules: []
});
let currentRdEditingIndex = -1;
const handleRdEdit = (row) => {
    currentRdEditingIndex = rdFeeApprovals.value.findIndex(item => item.id === row.id);
    const cloned = JSON.parse(JSON.stringify(row));
    // 确保旧数据也有 approvalType 属性，保证响应式
    cloned.rules.forEach((rule) => {
        if (!rule.approvalType)
            rule.approvalType = 'or';
        if (!rule.approvers)
            rule.approvers = [];
    });
    rdEditForm.value = cloned;
    rdEditDialogVisible.value = true;
};
const handleRdAdd = () => {
    currentRdEditingIndex = -1;
    const maxMin = Math.max(...rdFeeApprovals.value.filter(i => !i.isDefault).map(i => i.maxAmount));
    rdEditForm.value = {
        id: Date.now(),
        minAmount: maxMin || 0,
        maxAmount: (maxMin || 0) + 100,
        enabled: true,
        skipApproval: false,
        isDefault: false,
        rules: [
            { enabled: true, skipApproval: false, categories: [], group: '', approvers: [], approvalType: 'or', ccList: [] }
        ]
    };
    rdEditDialogVisible.value = true;
};
const saveRdEdit = () => {
    if (currentRdEditingIndex > -1) {
        rdFeeApprovals.value[currentRdEditingIndex] = JSON.parse(JSON.stringify(rdEditForm.value));
    }
    else {
        rdFeeApprovals.value.push(JSON.parse(JSON.stringify(rdEditForm.value)));
    }
    rdFeeApprovals.value.sort((a, b) => {
        if (a.isDefault)
            return 1;
        if (b.isDefault)
            return -1;
        return a.minAmount - b.minAmount;
    });
    rdEditDialogVisible.value = false;
};
const handleRdDelete = (row) => {
    ElMessageBox.confirm(`确定要删除金额区间 [${row.minAmount} - ${row.maxAmount === Infinity ? '∞' : row.maxAmount}] 吗？删除后该区间的业务路由将全部失效。`, '删除警告', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
    }).then(() => {
        rdFeeApprovals.value = rdFeeApprovals.value.filter(item => item.id !== row.id);
        ElMessage.success('已成功删除该金额区间');
    }).catch(() => { });
};
const addRdRule = () => {
    rdEditForm.value.rules.push({ enabled: true, skipApproval: false, categories: [], group: '', approvers: [], approvalType: 'or', ccList: [] });
};
const removeRdRule = (index) => {
    rdEditForm.value.rules.splice(index, 1);
};
const getAmountRiskColor = (amount) => {
    if (amount < 500)
        return '#16a34a';
    if (amount < 1000)
        return '#ca8a04';
    return '#dc2626';
};
const filteredApprovals = computed(() => {
    return rdFeeApprovals.value.filter(item => {
        const kw = searchKeyword.value.toLowerCase();
        if (!kw)
            return true;
        return item.rules.some(rule => (rule.group && rule.group.toLowerCase().includes(kw)) ||
            (rule.approvers && rule.approvers.some((u) => u.toLowerCase().includes(kw))));
    });
});
const filteredApproverList = computed(() => {
    return approverConfigs.value.map(gradeGroup => {
        return {
            ...gradeGroup,
            configs: gradeGroup.configs.filter(c => !filterPlatform.value || c.platform === filterPlatform.value)
        };
    }).filter(group => group.configs.length > 0);
});
const getGradeType = (grade) => {
    const map = { S: 'danger', A: 'warning', B: 'primary', C: 'success', D: 'info' };
    return map[grade] || 'info';
};
const editDialogVisible = ref(false);
const editForm = ref({
    grade: '',
    mandatoryL2: false,
    configs: []
});
let currentEditingIndex = -1;
const handleEdit = (row) => {
    currentEditingIndex = approverConfigs.value.findIndex(item => item === row);
    editForm.value = JSON.parse(JSON.stringify(row));
    editDialogVisible.value = true;
};
const handleAdd = () => {
    currentEditingIndex = -1;
    editForm.value = {
        grade: '',
        mandatoryL2: false,
        configs: [
            { platform: '', firstApprover: [], l2Triggers: [], costThreshold: 1000, secondApprover: [] }
        ]
    };
    editDialogVisible.value = true;
};
const saveEdit = () => {
    if (currentEditingIndex > -1) {
        approverConfigs.value[currentEditingIndex] = JSON.parse(JSON.stringify(editForm.value));
    }
    else {
        approverConfigs.value.push(JSON.parse(JSON.stringify(editForm.value)));
        // 按级别排序 (优先处理 S-A-B-C-D，其余按字母)
        const order = ['S', 'A', 'B', 'C', 'D'];
        approverConfigs.value.sort((a, b) => {
            const idxA = order.indexOf(a.grade);
            const idxB = order.indexOf(b.grade);
            if (idxA > -1 && idxB > -1)
                return idxA - idxB;
            if (idxA > -1)
                return -1;
            if (idxB > -1)
                return 1;
            return a.grade.localeCompare(b.grade);
        });
    }
    editDialogVisible.value = false;
};
const addPlatformConfig = () => {
    editForm.value.configs.push({
        platform: '',
        firstApprover: [],
        l2Triggers: [],
        costThreshold: 1000,
        secondApprover: []
    });
};
const removePlatformConfig = (index) => {
    editForm.value.configs.splice(index, 1);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['item-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['item-text']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['l']} */ ;
/** @type {__VLS_StyleScopedClasses['l']} */ ;
/** @type {__VLS_StyleScopedClasses['l']} */ ;
/** @type {__VLS_StyleScopedClasses['l']} */ ;
/** @type {__VLS_StyleScopedClasses['l']} */ ;
/** @type {__VLS_StyleScopedClasses['sym']} */ ;
/** @type {__VLS_StyleScopedClasses['sym']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['platform-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['mini']} */ ;
/** @type {__VLS_StyleScopedClasses['logic-capsule-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['logic-capsule']} */ ;
/** @type {__VLS_StyleScopedClasses['capsule-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['mini']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['mode-placeholder']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "settings-master-detail" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "md-layout-body" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "md-sidebar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
    ...{ class: "md-menu" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ class: "menu-group-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.activeMenu = 'grade';
        } },
    ...{ class: "menu-item" },
    ...{ class: ({ active: __VLS_ctx.activeMenu === 'grade' }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "item-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.activeMenu = 'duration';
        } },
    ...{ class: "menu-item" },
    ...{ class: ({ active: __VLS_ctx.activeMenu === 'duration' }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "item-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ class: "menu-group-title mt-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.activeMenu = 'approver';
        } },
    ...{ class: "menu-item" },
    ...{ class: ({ active: __VLS_ctx.activeMenu === 'approver' }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "item-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.activeMenu = 'approval';
        } },
    ...{ class: "menu-item" },
    ...{ class: ({ active: __VLS_ctx.activeMenu === 'approval' }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "item-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "md-content" },
});
const __VLS_0 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    name: "fade-slide",
    mode: "out-in",
}));
const __VLS_2 = __VLS_1({
    name: "fade-slide",
    mode: "out-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
if (__VLS_ctx.activeMenu === 'grade') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-pane" },
        key: "grade",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pane-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "actions" },
    });
    const __VLS_4 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ 'onClick': {} },
        icon: "Document",
    }));
    const __VLS_6 = __VLS_5({
        ...{ 'onClick': {} },
        icon: "Document",
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    let __VLS_8;
    let __VLS_9;
    let __VLS_10;
    const __VLS_11 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.activeMenu === 'grade'))
                return;
            __VLS_ctx.showLog('grade');
        }
    };
    __VLS_7.slots.default;
    var __VLS_7;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pane-body" },
    });
    const __VLS_12 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        data: (__VLS_ctx.proposalGrades),
        ...{ class: "detail-table" },
        border: true,
    }));
    const __VLS_14 = __VLS_13({
        data: (__VLS_ctx.proposalGrades),
        ...{ class: "detail-table" },
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_15.slots.default;
    const __VLS_16 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        label: "提案等级",
        width: "120",
        align: "center",
    }));
    const __VLS_18 = __VLS_17({
        label: "提案等级",
        width: "120",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_19.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_20 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            type: (__VLS_ctx.getGradeType(row.grade)),
            effect: "dark",
            size: "small",
        }));
        const __VLS_22 = __VLS_21({
            type: (__VLS_ctx.getGradeType(row.grade)),
            effect: "dark",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        __VLS_23.slots.default;
        (row.grade);
        var __VLS_23;
    }
    var __VLS_19;
    const __VLS_24 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        label: "首单采购数量(>= PCS)",
    }));
    const __VLS_26 = __VLS_25({
        label: "首单采购数量(>= PCS)",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_27.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_28 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
            modelValue: (row.minQty),
            controls: (false),
            ...{ class: "full-input" },
        }));
        const __VLS_30 = __VLS_29({
            modelValue: (row.minQty),
            controls: (false),
            ...{ class: "full-input" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    }
    var __VLS_27;
    const __VLS_32 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        label: "首单采购金额(>= CNY)",
    }));
    const __VLS_34 = __VLS_33({
        label: "首单采购金额(>= CNY)",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_35.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_36 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            modelValue: (row.minAmount),
            precision: (2),
            controls: (false),
            ...{ class: "full-input" },
        }));
        const __VLS_38 = __VLS_37({
            modelValue: (row.minAmount),
            precision: (2),
            controls: (false),
            ...{ class: "full-input" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    }
    var __VLS_35;
    const __VLS_40 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        label: "开启自动审批",
        width: "120",
        align: "center",
    }));
    const __VLS_42 = __VLS_41({
        label: "开启自动审批",
        width: "120",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_43.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_44 = {}.ElSwitch;
        /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            modelValue: (row.autoApprove),
        }));
        const __VLS_46 = __VLS_45({
            modelValue: (row.autoApprove),
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    }
    var __VLS_43;
    var __VLS_15;
}
else if (__VLS_ctx.activeMenu === 'duration') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-pane" },
        key: "duration",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pane-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "actions" },
    });
    const __VLS_48 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ 'onClick': {} },
        icon: "Document",
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick': {} },
        icon: "Document",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_52;
    let __VLS_53;
    let __VLS_54;
    const __VLS_55 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.activeMenu === 'grade'))
                return;
            if (!(__VLS_ctx.activeMenu === 'duration'))
                return;
            __VLS_ctx.showLog('duration');
        }
    };
    __VLS_51.slots.default;
    var __VLS_51;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pane-body" },
    });
    const __VLS_56 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        data: (__VLS_ctx.sampleDurations),
        ...{ class: "detail-table" },
        border: true,
    }));
    const __VLS_58 = __VLS_57({
        data: (__VLS_ctx.sampleDurations),
        ...{ class: "detail-table" },
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    const __VLS_60 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        prop: "type",
        label: "样品类型",
        width: "150",
    }));
    const __VLS_62 = __VLS_61({
        prop: "type",
        label: "样品类型",
        width: "150",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    const __VLS_64 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        label: "要求反馈时效 (天)",
    }));
    const __VLS_66 = __VLS_65({
        label: "要求反馈时效 (天)",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_67.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_68 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
            modelValue: (row.feedbackDays),
            controls: (false),
            ...{ class: "full-input" },
        }));
        const __VLS_70 = __VLS_69({
            modelValue: (row.feedbackDays),
            controls: (false),
            ...{ class: "full-input" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    }
    var __VLS_67;
    const __VLS_72 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        label: "要求拿样时效 (天)",
    }));
    const __VLS_74 = __VLS_73({
        label: "要求拿样时效 (天)",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    __VLS_75.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_75.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_76 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
            modelValue: (row.sampleDays),
            controls: (false),
            ...{ class: "full-input" },
        }));
        const __VLS_78 = __VLS_77({
            modelValue: (row.sampleDays),
            controls: (false),
            ...{ class: "full-input" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    }
    var __VLS_75;
    const __VLS_80 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        label: "操作",
        width: "100",
        align: "center",
        fixed: "right",
    }));
    const __VLS_82 = __VLS_81({
        label: "操作",
        width: "100",
        align: "center",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_83.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_84 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            icon: "Edit",
        }));
        const __VLS_86 = __VLS_85({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            icon: "Edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_85));
        let __VLS_88;
        let __VLS_89;
        let __VLS_90;
        const __VLS_91 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeMenu === 'grade'))
                    return;
                if (!(__VLS_ctx.activeMenu === 'duration'))
                    return;
                __VLS_ctx.handleDurationEdit(row);
            }
        };
        __VLS_87.slots.default;
        var __VLS_87;
    }
    var __VLS_83;
    var __VLS_59;
    const __VLS_92 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        modelValue: (__VLS_ctx.durationEditDialogVisible),
        title: "编辑时效标准",
        width: "500px",
        appendToBody: true,
    }));
    const __VLS_94 = __VLS_93({
        modelValue: (__VLS_ctx.durationEditDialogVisible),
        title: "编辑时效标准",
        width: "500px",
        appendToBody: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    __VLS_95.slots.default;
    const __VLS_96 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        model: (__VLS_ctx.durationEditForm),
        labelWidth: "120px",
        ...{ style: {} },
    }));
    const __VLS_98 = __VLS_97({
        model: (__VLS_ctx.durationEditForm),
        labelWidth: "120px",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    const __VLS_100 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        label: "样品类型",
    }));
    const __VLS_102 = __VLS_101({
        label: "样品类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    __VLS_103.slots.default;
    const __VLS_104 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        modelValue: (__VLS_ctx.durationEditForm.type),
        disabled: true,
    }));
    const __VLS_106 = __VLS_105({
        modelValue: (__VLS_ctx.durationEditForm.type),
        disabled: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    var __VLS_103;
    const __VLS_108 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        label: "反馈时效 (天)",
    }));
    const __VLS_110 = __VLS_109({
        label: "反馈时效 (天)",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    __VLS_111.slots.default;
    const __VLS_112 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        modelValue: (__VLS_ctx.durationEditForm.feedbackDays),
        min: (1),
        ...{ style: {} },
    }));
    const __VLS_114 = __VLS_113({
        modelValue: (__VLS_ctx.durationEditForm.feedbackDays),
        min: (1),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    var __VLS_111;
    const __VLS_116 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        label: "拿样时效 (天)",
    }));
    const __VLS_118 = __VLS_117({
        label: "拿样时效 (天)",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    const __VLS_120 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        modelValue: (__VLS_ctx.durationEditForm.sampleDays),
        min: (1),
        ...{ style: {} },
    }));
    const __VLS_122 = __VLS_121({
        modelValue: (__VLS_ctx.durationEditForm.sampleDays),
        min: (1),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    var __VLS_119;
    var __VLS_99;
    {
        const { footer: __VLS_thisSlot } = __VLS_95.slots;
        const __VLS_124 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            ...{ 'onClick': {} },
        }));
        const __VLS_126 = __VLS_125({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
        let __VLS_128;
        let __VLS_129;
        let __VLS_130;
        const __VLS_131 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeMenu === 'grade'))
                    return;
                if (!(__VLS_ctx.activeMenu === 'duration'))
                    return;
                __VLS_ctx.durationEditDialogVisible = false;
            }
        };
        __VLS_127.slots.default;
        var __VLS_127;
        const __VLS_132 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_134 = __VLS_133({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        let __VLS_136;
        let __VLS_137;
        let __VLS_138;
        const __VLS_139 = {
            onClick: (__VLS_ctx.saveDurationEdit)
        };
        __VLS_135.slots.default;
        var __VLS_135;
    }
    var __VLS_95;
}
else if (__VLS_ctx.activeMenu === 'approver') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-pane" },
        key: "approver",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pane-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "actions" },
    });
    const __VLS_140 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        ...{ 'onClick': {} },
        icon: "Document",
    }));
    const __VLS_142 = __VLS_141({
        ...{ 'onClick': {} },
        icon: "Document",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    let __VLS_144;
    let __VLS_145;
    let __VLS_146;
    const __VLS_147 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.activeMenu === 'grade'))
                return;
            if (!!(__VLS_ctx.activeMenu === 'duration'))
                return;
            if (!(__VLS_ctx.activeMenu === 'approver'))
                return;
            __VLS_ctx.showLog('approver');
        }
    };
    __VLS_143.slots.default;
    var __VLS_143;
    const __VLS_148 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        modelValue: (__VLS_ctx.filterPlatform),
        placeholder: "平台过滤",
        clearable: true,
        ...{ style: {} },
        ...{ class: "pane-search" },
    }));
    const __VLS_150 = __VLS_149({
        modelValue: (__VLS_ctx.filterPlatform),
        placeholder: "平台过滤",
        clearable: true,
        ...{ style: {} },
        ...{ class: "pane-search" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    const __VLS_152 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        label: "Amazon",
        value: "Amazon",
    }));
    const __VLS_154 = __VLS_153({
        label: "Amazon",
        value: "Amazon",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    const __VLS_156 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        label: "Tiktok",
        value: "Tiktok",
    }));
    const __VLS_158 = __VLS_157({
        label: "Tiktok",
        value: "Tiktok",
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    var __VLS_151;
    const __VLS_160 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        ...{ 'onClick': {} },
        type: "primary",
        icon: "Plus",
    }));
    const __VLS_162 = __VLS_161({
        ...{ 'onClick': {} },
        type: "primary",
        icon: "Plus",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    let __VLS_164;
    let __VLS_165;
    let __VLS_166;
    const __VLS_167 = {
        onClick: (__VLS_ctx.handleAdd)
    };
    __VLS_163.slots.default;
    var __VLS_163;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pane-body" },
    });
    const __VLS_168 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        data: (__VLS_ctx.filteredApproverList),
        ...{ class: "detail-table pro-matrix-table" },
        border: true,
    }));
    const __VLS_170 = __VLS_169({
        data: (__VLS_ctx.filteredApproverList),
        ...{ class: "detail-table pro-matrix-table" },
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    const __VLS_172 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        label: "等级",
        width: "100",
        align: "center",
    }));
    const __VLS_174 = __VLS_173({
        label: "等级",
        width: "100",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    __VLS_175.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_175.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_176 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            type: (__VLS_ctx.getGradeType(row.grade)),
            effect: "dark",
            size: "small",
        }));
        const __VLS_178 = __VLS_177({
            type: (__VLS_ctx.getGradeType(row.grade)),
            effect: "dark",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        __VLS_179.slots.default;
        (row.grade);
        var __VLS_179;
    }
    var __VLS_175;
    const __VLS_180 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        label: "平台配置详情",
    }));
    const __VLS_182 = __VLS_181({
        label: "平台配置详情",
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    __VLS_183.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_183.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "platform-configs-list" },
        });
        for (const [conf] of __VLS_getVForSourceType((row.configs))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (conf.platform),
                ...{ class: "platform-row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "platform-info" },
            });
            const __VLS_184 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
                size: "small",
                ...{ class: "platform-tag" },
            }));
            const __VLS_186 = __VLS_185({
                size: "small",
                ...{ class: "platform-tag" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_185));
            __VLS_187.slots.default;
            if (conf.platform === 'Amazon') {
                const __VLS_188 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({}));
                const __VLS_190 = __VLS_189({}, ...__VLS_functionalComponentArgsRest(__VLS_189));
                __VLS_191.slots.default;
                const __VLS_192 = {}.Shop;
                /** @type {[typeof __VLS_components.Shop, ]} */ ;
                // @ts-ignore
                const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({}));
                const __VLS_194 = __VLS_193({}, ...__VLS_functionalComponentArgsRest(__VLS_193));
                var __VLS_191;
            }
            else {
                const __VLS_196 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({}));
                const __VLS_198 = __VLS_197({}, ...__VLS_functionalComponentArgsRest(__VLS_197));
                __VLS_199.slots.default;
                const __VLS_200 = {}.VideoPlay;
                /** @type {[typeof __VLS_components.VideoPlay, ]} */ ;
                // @ts-ignore
                const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({}));
                const __VLS_202 = __VLS_201({}, ...__VLS_functionalComponentArgsRest(__VLS_201));
                var __VLS_199;
            }
            (conf.platform);
            var __VLS_187;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "approver-info" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "node" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "chips" },
            });
            for (const [u] of __VLS_getVForSourceType((conf.firstApprover))) {
                const __VLS_204 = {}.ElTag;
                /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                // @ts-ignore
                const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
                    key: (u),
                    size: "small",
                    effect: "plain",
                }));
                const __VLS_206 = __VLS_205({
                    key: (u),
                    size: "small",
                    effect: "plain",
                }, ...__VLS_functionalComponentArgsRest(__VLS_205));
                __VLS_207.slots.default;
                (u);
                var __VLS_207;
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "node" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "label" },
            });
            if (row.mandatoryL2 || conf.l2Triggers.length > 0) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "chips" },
                });
                for (const [u] of __VLS_getVForSourceType((conf.secondApprover))) {
                    const __VLS_208 = {}.ElTag;
                    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                    // @ts-ignore
                    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
                        key: (u),
                        size: "small",
                        effect: "plain",
                        type: "success",
                    }));
                    const __VLS_210 = __VLS_209({
                        key: (u),
                        size: "small",
                        effect: "plain",
                        type: "success",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
                    __VLS_211.slots.default;
                    (u);
                    var __VLS_211;
                }
                if (conf.secondApprover.length === 0) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "placeholder" },
                    });
                }
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "skip" },
                });
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "trigger-info" },
            });
            if (row.mandatoryL2) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "mandatory" },
                });
            }
            else if (conf.l2Triggers.length > 0) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "condition" },
                });
                if (conf.l2Triggers.includes('mold')) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                }
                if (conf.l2Triggers.includes('cost')) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                    (conf.costThreshold);
                }
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "none" },
                });
            }
        }
    }
    var __VLS_183;
    const __VLS_212 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
        label: "操作",
        width: "100",
        align: "center",
        fixed: "right",
    }));
    const __VLS_214 = __VLS_213({
        label: "操作",
        width: "100",
        align: "center",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    __VLS_215.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_215.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_216 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            icon: "Edit",
        }));
        const __VLS_218 = __VLS_217({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
            icon: "Edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_217));
        let __VLS_220;
        let __VLS_221;
        let __VLS_222;
        const __VLS_223 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeMenu === 'grade'))
                    return;
                if (!!(__VLS_ctx.activeMenu === 'duration'))
                    return;
                if (!(__VLS_ctx.activeMenu === 'approver'))
                    return;
                __VLS_ctx.handleEdit(row);
            }
        };
        __VLS_219.slots.default;
        var __VLS_219;
    }
    var __VLS_215;
    var __VLS_171;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "matrix-hint" },
    });
    const __VLS_224 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({}));
    const __VLS_226 = __VLS_225({}, ...__VLS_functionalComponentArgsRest(__VLS_225));
    __VLS_227.slots.default;
    const __VLS_228 = {}.InfoFilled;
    /** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({}));
    const __VLS_230 = __VLS_229({}, ...__VLS_functionalComponentArgsRest(__VLS_229));
    var __VLS_227;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_232 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
        modelValue: (__VLS_ctx.editDialogVisible),
        title: (__VLS_ctx.currentEditingIndex === -1 ? '新增等级' : '编辑等级'),
        width: "1100px",
        appendToBody: true,
        customClass: "matrix-edit-dialog",
    }));
    const __VLS_234 = __VLS_233({
        modelValue: (__VLS_ctx.editDialogVisible),
        title: (__VLS_ctx.currentEditingIndex === -1 ? '新增等级' : '编辑等级'),
        width: "1100px",
        appendToBody: true,
        customClass: "matrix-edit-dialog",
    }, ...__VLS_functionalComponentArgsRest(__VLS_233));
    __VLS_235.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "edit-header" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "grade-label" },
    });
    if (__VLS_ctx.currentEditingIndex === -1) {
        const __VLS_236 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
            modelValue: (__VLS_ctx.editForm.grade),
            allowCreate: true,
            filterable: true,
            placeholder: "选择或输入级别",
            ...{ style: {} },
        }));
        const __VLS_238 = __VLS_237({
            modelValue: (__VLS_ctx.editForm.grade),
            allowCreate: true,
            filterable: true,
            placeholder: "选择或输入级别",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_237));
        __VLS_239.slots.default;
        for (const [g] of __VLS_getVForSourceType((['S', 'A', 'B', 'C', 'D', 'E', 'F']))) {
            const __VLS_240 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
                key: (g),
                label: (g + '级'),
                value: (g),
                disabled: (__VLS_ctx.approverConfigs.some(c => c.grade === g)),
            }));
            const __VLS_242 = __VLS_241({
                key: (g),
                label: (g + '级'),
                value: (g),
                disabled: (__VLS_ctx.approverConfigs.some(c => c.grade === g)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_241));
        }
        var __VLS_239;
    }
    else {
        const __VLS_244 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
            type: (__VLS_ctx.getGradeType(__VLS_ctx.editForm.grade)),
            effect: "dark",
        }));
        const __VLS_246 = __VLS_245({
            type: (__VLS_ctx.getGradeType(__VLS_ctx.editForm.grade)),
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_245));
        __VLS_247.slots.default;
        (__VLS_ctx.editForm.grade);
        var __VLS_247;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ style: {} },
    });
    const __VLS_248 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
        modelValue: (__VLS_ctx.editForm.mandatoryL2),
    }));
    const __VLS_250 = __VLS_249({
        modelValue: (__VLS_ctx.editForm.mandatoryL2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    const __VLS_252 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        data: (__VLS_ctx.editForm.configs),
        border: true,
        size: "small",
        ...{ class: "edit-sub-table" },
    }));
    const __VLS_254 = __VLS_253({
        data: (__VLS_ctx.editForm.configs),
        border: true,
        size: "small",
        ...{ class: "edit-sub-table" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    __VLS_255.slots.default;
    const __VLS_256 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
        label: "平台",
        width: "150",
    }));
    const __VLS_258 = __VLS_257({
        label: "平台",
        width: "150",
    }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    __VLS_259.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_259.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_260 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
            modelValue: (row.platform),
            placeholder: "选择平台",
        }));
        const __VLS_262 = __VLS_261({
            modelValue: (row.platform),
            placeholder: "选择平台",
        }, ...__VLS_functionalComponentArgsRest(__VLS_261));
        __VLS_263.slots.default;
        const __VLS_264 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
            label: "Amazon",
            value: "Amazon",
        }));
        const __VLS_266 = __VLS_265({
            label: "Amazon",
            value: "Amazon",
        }, ...__VLS_functionalComponentArgsRest(__VLS_265));
        const __VLS_268 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
            label: "Tiktok",
            value: "Tiktok",
        }));
        const __VLS_270 = __VLS_269({
            label: "Tiktok",
            value: "Tiktok",
        }, ...__VLS_functionalComponentArgsRest(__VLS_269));
        const __VLS_272 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
            label: "Shopee",
            value: "Shopee",
        }));
        const __VLS_274 = __VLS_273({
            label: "Shopee",
            value: "Shopee",
        }, ...__VLS_functionalComponentArgsRest(__VLS_273));
        const __VLS_276 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
            label: "Lazada",
            value: "Lazada",
        }));
        const __VLS_278 = __VLS_277({
            label: "Lazada",
            value: "Lazada",
        }, ...__VLS_functionalComponentArgsRest(__VLS_277));
        var __VLS_263;
    }
    var __VLS_259;
    const __VLS_280 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
        label: "一级审批人",
    }));
    const __VLS_282 = __VLS_281({
        label: "一级审批人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    __VLS_283.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_283.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_284 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
            modelValue: (row.firstApprover),
            multiple: true,
            collapseTags: true,
            placeholder: "选择人员",
            ...{ style: {} },
        }));
        const __VLS_286 = __VLS_285({
            modelValue: (row.firstApprover),
            multiple: true,
            collapseTags: true,
            placeholder: "选择人员",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_285));
        __VLS_287.slots.default;
        const __VLS_288 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
            label: "张经理",
            value: "张经理",
        }));
        const __VLS_290 = __VLS_289({
            label: "张经理",
            value: "张经理",
        }, ...__VLS_functionalComponentArgsRest(__VLS_289));
        const __VLS_292 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
            label: "李总监",
            value: "李总监",
        }));
        const __VLS_294 = __VLS_293({
            label: "李总监",
            value: "李总监",
        }, ...__VLS_functionalComponentArgsRest(__VLS_293));
        const __VLS_296 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
            label: "王组长",
            value: "王组长",
        }));
        const __VLS_298 = __VLS_297({
            label: "王组长",
            value: "王组长",
        }, ...__VLS_functionalComponentArgsRest(__VLS_297));
        var __VLS_287;
    }
    var __VLS_283;
    const __VLS_300 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
        label: "二级激活条件",
    }));
    const __VLS_302 = __VLS_301({
        label: "二级激活条件",
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
    __VLS_303.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_303.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (__VLS_ctx.editForm.mandatoryL2) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "mandatory-text" },
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "trigger-edit" },
            });
            const __VLS_304 = {}.ElCheckboxGroup;
            /** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
            // @ts-ignore
            const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
                modelValue: (row.l2Triggers),
            }));
            const __VLS_306 = __VLS_305({
                modelValue: (row.l2Triggers),
            }, ...__VLS_functionalComponentArgsRest(__VLS_305));
            __VLS_307.slots.default;
            const __VLS_308 = {}.ElCheckbox;
            /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
            // @ts-ignore
            const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
                label: "mold",
            }));
            const __VLS_310 = __VLS_309({
                label: "mold",
            }, ...__VLS_functionalComponentArgsRest(__VLS_309));
            __VLS_311.slots.default;
            var __VLS_311;
            const __VLS_312 = {}.ElCheckbox;
            /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
            // @ts-ignore
            const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
                label: "cost",
            }));
            const __VLS_314 = __VLS_313({
                label: "cost",
            }, ...__VLS_functionalComponentArgsRest(__VLS_313));
            __VLS_315.slots.default;
            var __VLS_315;
            var __VLS_307;
            if (row.l2Triggers.includes('cost')) {
                const __VLS_316 = {}.ElInputNumber;
                /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
                // @ts-ignore
                const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
                    modelValue: (row.costThreshold),
                    controls: (false),
                    size: "small",
                    ...{ style: {} },
                }));
                const __VLS_318 = __VLS_317({
                    modelValue: (row.costThreshold),
                    controls: (false),
                    size: "small",
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_317));
            }
        }
    }
    var __VLS_303;
    const __VLS_320 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
        label: "二级审批人",
    }));
    const __VLS_322 = __VLS_321({
        label: "二级审批人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_321));
    __VLS_323.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_323.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_324 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
            modelValue: (row.secondApprover),
            multiple: true,
            collapseTags: true,
            placeholder: "选择人员",
            ...{ style: {} },
            disabled: (!__VLS_ctx.editForm.mandatoryL2 && row.l2Triggers.length === 0),
        }));
        const __VLS_326 = __VLS_325({
            modelValue: (row.secondApprover),
            multiple: true,
            collapseTags: true,
            placeholder: "选择人员",
            ...{ style: {} },
            disabled: (!__VLS_ctx.editForm.mandatoryL2 && row.l2Triggers.length === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_325));
        __VLS_327.slots.default;
        const __VLS_328 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
            label: "陈副总",
            value: "陈副总",
        }));
        const __VLS_330 = __VLS_329({
            label: "陈副总",
            value: "陈副总",
        }, ...__VLS_functionalComponentArgsRest(__VLS_329));
        const __VLS_332 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
            label: "王副总",
            value: "王副总",
        }));
        const __VLS_334 = __VLS_333({
            label: "王副总",
            value: "王副总",
        }, ...__VLS_functionalComponentArgsRest(__VLS_333));
        var __VLS_327;
    }
    var __VLS_323;
    const __VLS_336 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
        label: "操作",
        width: "60",
        align: "center",
    }));
    const __VLS_338 = __VLS_337({
        label: "操作",
        width: "60",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_337));
    __VLS_339.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_339.slots;
        const [{ $index }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_340 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
            icon: "Delete",
        }));
        const __VLS_342 = __VLS_341({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
            icon: "Delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_341));
        let __VLS_344;
        let __VLS_345;
        let __VLS_346;
        const __VLS_347 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeMenu === 'grade'))
                    return;
                if (!!(__VLS_ctx.activeMenu === 'duration'))
                    return;
                if (!(__VLS_ctx.activeMenu === 'approver'))
                    return;
                __VLS_ctx.removePlatformConfig($index);
            }
        };
        var __VLS_343;
    }
    var __VLS_339;
    var __VLS_255;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-actions" },
    });
    const __VLS_348 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        icon: "Plus",
    }));
    const __VLS_350 = __VLS_349({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        icon: "Plus",
    }, ...__VLS_functionalComponentArgsRest(__VLS_349));
    let __VLS_352;
    let __VLS_353;
    let __VLS_354;
    const __VLS_355 = {
        onClick: (__VLS_ctx.addPlatformConfig)
    };
    __VLS_351.slots.default;
    var __VLS_351;
    {
        const { footer: __VLS_thisSlot } = __VLS_235.slots;
        const __VLS_356 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
            ...{ 'onClick': {} },
        }));
        const __VLS_358 = __VLS_357({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_357));
        let __VLS_360;
        let __VLS_361;
        let __VLS_362;
        const __VLS_363 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeMenu === 'grade'))
                    return;
                if (!!(__VLS_ctx.activeMenu === 'duration'))
                    return;
                if (!(__VLS_ctx.activeMenu === 'approver'))
                    return;
                __VLS_ctx.editDialogVisible = false;
            }
        };
        __VLS_359.slots.default;
        var __VLS_359;
        const __VLS_364 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (!__VLS_ctx.editForm.grade),
        }));
        const __VLS_366 = __VLS_365({
            ...{ 'onClick': {} },
            type: "primary",
            disabled: (!__VLS_ctx.editForm.grade),
        }, ...__VLS_functionalComponentArgsRest(__VLS_365));
        let __VLS_368;
        let __VLS_369;
        let __VLS_370;
        const __VLS_371 = {
            onClick: (__VLS_ctx.saveEdit)
        };
        __VLS_367.slots.default;
        var __VLS_367;
    }
    var __VLS_235;
}
else if (__VLS_ctx.activeMenu === 'approval') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-pane" },
        key: "approval",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pane-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "actions" },
    });
    const __VLS_372 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
        ...{ 'onClick': {} },
        icon: "Document",
    }));
    const __VLS_374 = __VLS_373({
        ...{ 'onClick': {} },
        icon: "Document",
    }, ...__VLS_functionalComponentArgsRest(__VLS_373));
    let __VLS_376;
    let __VLS_377;
    let __VLS_378;
    const __VLS_379 = {
        onClick: (...[$event]) => {
            if (!!(__VLS_ctx.activeMenu === 'grade'))
                return;
            if (!!(__VLS_ctx.activeMenu === 'duration'))
                return;
            if (!!(__VLS_ctx.activeMenu === 'approver'))
                return;
            if (!(__VLS_ctx.activeMenu === 'approval'))
                return;
            __VLS_ctx.showLog('approval');
        }
    };
    __VLS_375.slots.default;
    var __VLS_375;
    const __VLS_380 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
        modelValue: (__VLS_ctx.searchKeyword),
        placeholder: "检索业务组或审核人...",
        prefixIcon: "Search",
        ...{ class: "pane-search" },
        clearable: true,
        ...{ style: {} },
    }));
    const __VLS_382 = __VLS_381({
        modelValue: (__VLS_ctx.searchKeyword),
        placeholder: "检索业务组或审核人...",
        prefixIcon: "Search",
        ...{ class: "pane-search" },
        clearable: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_381));
    const __VLS_384 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({
        ...{ 'onClick': {} },
        type: "primary",
        icon: "Plus",
    }));
    const __VLS_386 = __VLS_385({
        ...{ 'onClick': {} },
        type: "primary",
        icon: "Plus",
    }, ...__VLS_functionalComponentArgsRest(__VLS_385));
    let __VLS_388;
    let __VLS_389;
    let __VLS_390;
    const __VLS_391 = {
        onClick: (__VLS_ctx.handleRdAdd)
    };
    __VLS_387.slots.default;
    var __VLS_387;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pane-body" },
    });
    const __VLS_392 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
        data: (__VLS_ctx.filteredApprovals),
        ...{ class: "detail-table pro-matrix-table" },
        border: true,
    }));
    const __VLS_394 = __VLS_393({
        data: (__VLS_ctx.filteredApprovals),
        ...{ class: "detail-table pro-matrix-table" },
        border: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_393));
    __VLS_395.slots.default;
    const __VLS_396 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({
        label: "状态/金额区间 (CNY)",
        width: "260",
    }));
    const __VLS_398 = __VLS_397({
        label: "状态/金额区间 (CNY)",
        width: "260",
    }, ...__VLS_functionalComponentArgsRest(__VLS_397));
    __VLS_399.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_399.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ style: {} },
        });
        const __VLS_400 = {}.ElSwitch;
        /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
        // @ts-ignore
        const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
            ...{ 'onClick': {} },
            modelValue: (row.enabled),
            size: "small",
        }));
        const __VLS_402 = __VLS_401({
            ...{ 'onClick': {} },
            modelValue: (row.enabled),
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_401));
        let __VLS_404;
        let __VLS_405;
        let __VLS_406;
        const __VLS_407 = {
            onClick: () => { }
        };
        var __VLS_403;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "visual-range" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "part inc" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "sym" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "val" },
            ...{ style: ({ color: __VLS_ctx.getAmountRiskColor(row.minAmount) }) },
        });
        (row.minAmount.toLocaleString());
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "divider" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "part exc" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "sym" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "val" },
            ...{ style: ({ color: row.maxAmount === Infinity ? '#6b7280' : __VLS_ctx.getAmountRiskColor(row.maxAmount) }) },
        });
        (row.maxAmount === Infinity ? '∞' : row.maxAmount.toLocaleString());
    }
    var __VLS_399;
    const __VLS_408 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({
        label: "业务路由及审批详情",
    }));
    const __VLS_410 = __VLS_409({
        label: "业务路由及审批详情",
    }, ...__VLS_functionalComponentArgsRest(__VLS_409));
    __VLS_411.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_411.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "platform-configs-list" },
        });
        for (const [rule, idx] of __VLS_getVForSourceType((row.rules))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (idx),
                ...{ class: "platform-row" },
                ...{ class: ({ 'rule-disabled': !row.enabled || !rule.enabled }) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "platform-info" },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ style: {} },
            });
            if (row.isDefault) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "default-rule-text" },
                });
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "chips-group" },
                });
                for (const [cat] of __VLS_getVForSourceType((rule.categories))) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        key: (cat),
                        ...{ class: "chip" },
                    });
                    (cat);
                }
                if (rule.categories.length === 0) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ style: {} },
                    });
                }
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "approver-info" },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "identity-node node-group" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "icon-box group-icon" },
            });
            const __VLS_412 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({}));
            const __VLS_414 = __VLS_413({}, ...__VLS_functionalComponentArgsRest(__VLS_413));
            __VLS_415.slots.default;
            const __VLS_416 = {}.OfficeBuilding;
            /** @type {[typeof __VLS_components.OfficeBuilding, ]} */ ;
            // @ts-ignore
            const __VLS_417 = __VLS_asFunctionalComponent(__VLS_416, new __VLS_416({}));
            const __VLS_418 = __VLS_417({}, ...__VLS_functionalComponentArgsRest(__VLS_417));
            var __VLS_415;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "text" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "role-tag" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "name" },
            });
            (rule.group || '-');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "identity-node node-approver" },
            });
            if (rule.skipApproval) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "icon-box skip-icon" },
                });
                const __VLS_420 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({}));
                const __VLS_422 = __VLS_421({}, ...__VLS_functionalComponentArgsRest(__VLS_421));
                __VLS_423.slots.default;
                const __VLS_424 = {}.CircleCheckFilled;
                /** @type {[typeof __VLS_components.CircleCheckFilled, ]} */ ;
                // @ts-ignore
                const __VLS_425 = __VLS_asFunctionalComponent(__VLS_424, new __VLS_424({}));
                const __VLS_426 = __VLS_425({}, ...__VLS_functionalComponentArgsRest(__VLS_425));
                var __VLS_423;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "text" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "role-tag" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "name skip-text" },
                });
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "icon-box approver-icon" },
                });
                const __VLS_428 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_429 = __VLS_asFunctionalComponent(__VLS_428, new __VLS_428({}));
                const __VLS_430 = __VLS_429({}, ...__VLS_functionalComponentArgsRest(__VLS_429));
                __VLS_431.slots.default;
                const __VLS_432 = {}.User;
                /** @type {[typeof __VLS_components.User, ]} */ ;
                // @ts-ignore
                const __VLS_433 = __VLS_asFunctionalComponent(__VLS_432, new __VLS_432({}));
                const __VLS_434 = __VLS_433({}, ...__VLS_functionalComponentArgsRest(__VLS_433));
                var __VLS_431;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "text" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "role-tag" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "approver-chips" },
                    ...{ style: {} },
                });
                for (const [u] of __VLS_getVForSourceType((rule.approvers))) {
                    const __VLS_436 = {}.ElTag;
                    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                    // @ts-ignore
                    const __VLS_437 = __VLS_asFunctionalComponent(__VLS_436, new __VLS_436({
                        key: (u),
                        size: "small",
                        effect: "plain",
                    }));
                    const __VLS_438 = __VLS_437({
                        key: (u),
                        size: "small",
                        effect: "plain",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_437));
                    __VLS_439.slots.default;
                    (u);
                    var __VLS_439;
                }
                if (!rule.approvers || rule.approvers.length === 0) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ style: {} },
                    });
                }
                if (rule.approvers && rule.approvers.length > 1) {
                    const __VLS_440 = {}.ElTooltip;
                    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
                    // @ts-ignore
                    const __VLS_441 = __VLS_asFunctionalComponent(__VLS_440, new __VLS_440({
                        content: (rule.approvalType === 'and' ? '会签：须所有成员审批通过' : '或签：任一成员审批通过即可'),
                    }));
                    const __VLS_442 = __VLS_441({
                        content: (rule.approvalType === 'and' ? '会签：须所有成员审批通过' : '或签：任一成员审批通过即可'),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_441));
                    __VLS_443.slots.default;
                    const __VLS_444 = {}.ElTag;
                    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                    // @ts-ignore
                    const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({
                        size: "small",
                        type: (rule.approvalType === 'and' ? 'warning' : 'info'),
                        effect: "dark",
                        ...{ style: {} },
                    }));
                    const __VLS_446 = __VLS_445({
                        size: "small",
                        type: (rule.approvalType === 'and' ? 'warning' : 'info'),
                        effect: "dark",
                        ...{ style: {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_445));
                    __VLS_447.slots.default;
                    (rule.approvalType === 'and' ? '会签' : '或签');
                    var __VLS_447;
                    var __VLS_443;
                }
            }
            if (!rule.skipApproval) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "identity-node node-cc" },
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "icon-box cc-icon" },
                });
                const __VLS_448 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({}));
                const __VLS_450 = __VLS_449({}, ...__VLS_functionalComponentArgsRest(__VLS_449));
                __VLS_451.slots.default;
                const __VLS_452 = {}.Promotion;
                /** @type {[typeof __VLS_components.Promotion, ]} */ ;
                // @ts-ignore
                const __VLS_453 = __VLS_asFunctionalComponent(__VLS_452, new __VLS_452({}));
                const __VLS_454 = __VLS_453({}, ...__VLS_functionalComponentArgsRest(__VLS_453));
                var __VLS_451;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "text" },
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "role-tag" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "cc-tag-list" },
                    ...{ style: {} },
                });
                for (const [cc] of __VLS_getVForSourceType((rule.ccList))) {
                    const __VLS_456 = {}.ElTag;
                    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                    // @ts-ignore
                    const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({
                        key: (cc),
                        size: "small",
                        effect: "plain",
                        type: "info",
                        round: true,
                    }));
                    const __VLS_458 = __VLS_457({
                        key: (cc),
                        size: "small",
                        effect: "plain",
                        type: "info",
                        round: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_457));
                    __VLS_459.slots.default;
                    (cc);
                    var __VLS_459;
                }
                if (!rule.ccList || rule.ccList.length === 0) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "none-text" },
                    });
                }
            }
        }
    }
    var __VLS_411;
    const __VLS_460 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_461 = __VLS_asFunctionalComponent(__VLS_460, new __VLS_460({
        label: "操作",
        width: "120",
        align: "center",
        fixed: "right",
    }));
    const __VLS_462 = __VLS_461({
        label: "操作",
        width: "120",
        align: "center",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_461));
    __VLS_463.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_463.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ style: {} },
        });
        const __VLS_464 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_465 = __VLS_asFunctionalComponent(__VLS_464, new __VLS_464({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_466 = __VLS_465({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_465));
        let __VLS_468;
        let __VLS_469;
        let __VLS_470;
        const __VLS_471 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeMenu === 'grade'))
                    return;
                if (!!(__VLS_ctx.activeMenu === 'duration'))
                    return;
                if (!!(__VLS_ctx.activeMenu === 'approver'))
                    return;
                if (!(__VLS_ctx.activeMenu === 'approval'))
                    return;
                __VLS_ctx.handleRdEdit(row);
            }
        };
        __VLS_467.slots.default;
        var __VLS_467;
        if (!row.isDefault) {
            const __VLS_472 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_473 = __VLS_asFunctionalComponent(__VLS_472, new __VLS_472({
                ...{ 'onClick': {} },
                link: true,
                type: "danger",
            }));
            const __VLS_474 = __VLS_473({
                ...{ 'onClick': {} },
                link: true,
                type: "danger",
            }, ...__VLS_functionalComponentArgsRest(__VLS_473));
            let __VLS_476;
            let __VLS_477;
            let __VLS_478;
            const __VLS_479 = {
                onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.activeMenu === 'grade'))
                        return;
                    if (!!(__VLS_ctx.activeMenu === 'duration'))
                        return;
                    if (!!(__VLS_ctx.activeMenu === 'approver'))
                        return;
                    if (!(__VLS_ctx.activeMenu === 'approval'))
                        return;
                    if (!(!row.isDefault))
                        return;
                    __VLS_ctx.handleRdDelete(row);
                }
            };
            __VLS_475.slots.default;
            var __VLS_475;
        }
    }
    var __VLS_463;
    var __VLS_395;
    const __VLS_480 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_481 = __VLS_asFunctionalComponent(__VLS_480, new __VLS_480({
        modelValue: (__VLS_ctx.rdEditDialogVisible),
        title: (__VLS_ctx.currentRdEditingIndex === -1 ? '新增区间' : '编辑区间'),
        width: "1250px",
        appendToBody: true,
        ...{ class: "approval-config-container" },
    }));
    const __VLS_482 = __VLS_481({
        modelValue: (__VLS_ctx.rdEditDialogVisible),
        title: (__VLS_ctx.currentRdEditingIndex === -1 ? '新增区间' : '编辑区间'),
        width: "1250px",
        appendToBody: true,
        ...{ class: "approval-config-container" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_481));
    __VLS_483.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "edit-header" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ style: {} },
    });
    const __VLS_484 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_485 = __VLS_asFunctionalComponent(__VLS_484, new __VLS_484({
        modelValue: (__VLS_ctx.rdEditForm.minAmount),
        controls: (false),
        size: "small",
        ...{ style: {} },
    }));
    const __VLS_486 = __VLS_485({
        modelValue: (__VLS_ctx.rdEditForm.minAmount),
        controls: (false),
        size: "small",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_485));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ style: {} },
    });
    if (__VLS_ctx.rdEditForm.maxAmount !== Infinity) {
        const __VLS_488 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_489 = __VLS_asFunctionalComponent(__VLS_488, new __VLS_488({
            modelValue: (__VLS_ctx.rdEditForm.maxAmount),
            controls: (false),
            size: "small",
            ...{ style: {} },
        }));
        const __VLS_490 = __VLS_489({
            modelValue: (__VLS_ctx.rdEditForm.maxAmount),
            controls: (false),
            size: "small",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_489));
    }
    const __VLS_492 = {}.ElCheckbox;
    /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
    // @ts-ignore
    const __VLS_493 = __VLS_asFunctionalComponent(__VLS_492, new __VLS_492({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.rdEditForm.maxAmount === Infinity),
    }));
    const __VLS_494 = __VLS_493({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.rdEditForm.maxAmount === Infinity),
    }, ...__VLS_functionalComponentArgsRest(__VLS_493));
    let __VLS_496;
    let __VLS_497;
    let __VLS_498;
    const __VLS_499 = {
        onChange: ((val) => __VLS_ctx.rdEditForm.maxAmount = val ? Infinity : 1000)
    };
    __VLS_495.slots.default;
    var __VLS_495;
    if (__VLS_ctx.rdEditForm.isDefault) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ style: {} },
        });
        const __VLS_500 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_501 = __VLS_asFunctionalComponent(__VLS_500, new __VLS_500({}));
        const __VLS_502 = __VLS_501({}, ...__VLS_functionalComponentArgsRest(__VLS_501));
        __VLS_503.slots.default;
        const __VLS_504 = {}.InfoFilled;
        /** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
        // @ts-ignore
        const __VLS_505 = __VLS_asFunctionalComponent(__VLS_504, new __VLS_504({}));
        const __VLS_506 = __VLS_505({}, ...__VLS_functionalComponentArgsRest(__VLS_505));
        var __VLS_503;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    const __VLS_508 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_509 = __VLS_asFunctionalComponent(__VLS_508, new __VLS_508({
        modelValue: (__VLS_ctx.rdEditForm.enabled),
        activeText: "开启区间",
    }));
    const __VLS_510 = __VLS_509({
        modelValue: (__VLS_ctx.rdEditForm.enabled),
        activeText: "开启区间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_509));
    const __VLS_512 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_513 = __VLS_asFunctionalComponent(__VLS_512, new __VLS_512({
        data: (__VLS_ctx.rdEditForm.rules),
        border: true,
        size: "small",
        ...{ class: "edit-sub-table" },
    }));
    const __VLS_514 = __VLS_513({
        data: (__VLS_ctx.rdEditForm.rules),
        border: true,
        size: "small",
        ...{ class: "edit-sub-table" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_513));
    __VLS_515.slots.default;
    const __VLS_516 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_517 = __VLS_asFunctionalComponent(__VLS_516, new __VLS_516({
        label: "状态",
        width: "70",
        align: "center",
    }));
    const __VLS_518 = __VLS_517({
        label: "状态",
        width: "70",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_517));
    __VLS_519.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_519.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_520 = {}.ElSwitch;
        /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
        // @ts-ignore
        const __VLS_521 = __VLS_asFunctionalComponent(__VLS_520, new __VLS_520({
            modelValue: (row.enabled),
            size: "small",
            disabled: (!__VLS_ctx.rdEditForm.enabled),
        }));
        const __VLS_522 = __VLS_521({
            modelValue: (row.enabled),
            size: "small",
            disabled: (!__VLS_ctx.rdEditForm.enabled),
        }, ...__VLS_functionalComponentArgsRest(__VLS_521));
    }
    var __VLS_519;
    const __VLS_524 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_525 = __VLS_asFunctionalComponent(__VLS_524, new __VLS_524({
        label: "免审",
        width: "70",
        align: "center",
    }));
    const __VLS_526 = __VLS_525({
        label: "免审",
        width: "70",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_525));
    __VLS_527.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_527.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_528 = {}.ElCheckbox;
        /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
        // @ts-ignore
        const __VLS_529 = __VLS_asFunctionalComponent(__VLS_528, new __VLS_528({
            modelValue: (row.skipApproval),
            disabled: (!__VLS_ctx.rdEditForm.enabled || !row.enabled),
        }));
        const __VLS_530 = __VLS_529({
            modelValue: (row.skipApproval),
            disabled: (!__VLS_ctx.rdEditForm.enabled || !row.enabled),
        }, ...__VLS_functionalComponentArgsRest(__VLS_529));
    }
    var __VLS_527;
    const __VLS_532 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_533 = __VLS_asFunctionalComponent(__VLS_532, new __VLS_532({
        label: "适用大类",
        minWidth: "200",
    }));
    const __VLS_534 = __VLS_533({
        label: "适用大类",
        minWidth: "200",
    }, ...__VLS_functionalComponentArgsRest(__VLS_533));
    __VLS_535.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_535.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (!__VLS_ctx.rdEditForm.isDefault) {
            const __VLS_536 = {}.ElSelect;
            /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
            // @ts-ignore
            const __VLS_537 = __VLS_asFunctionalComponent(__VLS_536, new __VLS_536({
                modelValue: (row.categories),
                multiple: true,
                collapseTags: true,
                placeholder: "选择大类",
                ...{ style: {} },
                disabled: (!__VLS_ctx.rdEditForm.enabled || !row.enabled),
            }));
            const __VLS_538 = __VLS_537({
                modelValue: (row.categories),
                multiple: true,
                collapseTags: true,
                placeholder: "选择大类",
                ...{ style: {} },
                disabled: (!__VLS_ctx.rdEditForm.enabled || !row.enabled),
            }, ...__VLS_functionalComponentArgsRest(__VLS_537));
            __VLS_539.slots.default;
            const __VLS_540 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_541 = __VLS_asFunctionalComponent(__VLS_540, new __VLS_540({
                label: "宠物用品",
                value: "宠物用品",
            }));
            const __VLS_542 = __VLS_541({
                label: "宠物用品",
                value: "宠物用品",
            }, ...__VLS_functionalComponentArgsRest(__VLS_541));
            const __VLS_544 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_545 = __VLS_asFunctionalComponent(__VLS_544, new __VLS_544({
                label: "水上运动",
                value: "水上运动",
            }));
            const __VLS_546 = __VLS_545({
                label: "水上运动",
                value: "水上运动",
            }, ...__VLS_functionalComponentArgsRest(__VLS_545));
            const __VLS_548 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_549 = __VLS_asFunctionalComponent(__VLS_548, new __VLS_548({
                label: "家居生活",
                value: "家居生活",
            }));
            const __VLS_550 = __VLS_549({
                label: "家居生活",
                value: "家居生活",
            }, ...__VLS_functionalComponentArgsRest(__VLS_549));
            const __VLS_552 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_553 = __VLS_asFunctionalComponent(__VLS_552, new __VLS_552({
                label: "美妆个护",
                value: "美妆个护",
            }));
            const __VLS_554 = __VLS_553({
                label: "美妆个护",
                value: "美妆个护",
            }, ...__VLS_functionalComponentArgsRest(__VLS_553));
            const __VLS_556 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_557 = __VLS_asFunctionalComponent(__VLS_556, new __VLS_556({
                label: "户外运动",
                value: "户外运动",
            }));
            const __VLS_558 = __VLS_557({
                label: "户外运动",
                value: "户外运动",
            }, ...__VLS_functionalComponentArgsRest(__VLS_557));
            const __VLS_560 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_561 = __VLS_asFunctionalComponent(__VLS_560, new __VLS_560({
                label: "电子产品",
                value: "电子产品",
            }));
            const __VLS_562 = __VLS_561({
                label: "电子产品",
                value: "电子产品",
            }, ...__VLS_functionalComponentArgsRest(__VLS_561));
            const __VLS_564 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_565 = __VLS_asFunctionalComponent(__VLS_564, new __VLS_564({
                label: "母婴玩具",
                value: "母婴玩具",
            }));
            const __VLS_566 = __VLS_565({
                label: "母婴玩具",
                value: "母婴玩具",
            }, ...__VLS_functionalComponentArgsRest(__VLS_565));
            var __VLS_539;
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "default-rule-text" },
            });
        }
    }
    var __VLS_535;
    const __VLS_568 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_569 = __VLS_asFunctionalComponent(__VLS_568, new __VLS_568({
        label: "业务组",
        width: "150",
    }));
    const __VLS_570 = __VLS_569({
        label: "业务组",
        width: "150",
    }, ...__VLS_functionalComponentArgsRest(__VLS_569));
    __VLS_571.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_571.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_572 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_573 = __VLS_asFunctionalComponent(__VLS_572, new __VLS_572({
            modelValue: (row.group),
            placeholder: "组名",
            disabled: (!__VLS_ctx.rdEditForm.enabled || !row.enabled),
        }));
        const __VLS_574 = __VLS_573({
            modelValue: (row.group),
            placeholder: "组名",
            disabled: (!__VLS_ctx.rdEditForm.enabled || !row.enabled),
        }, ...__VLS_functionalComponentArgsRest(__VLS_573));
    }
    var __VLS_571;
    const __VLS_576 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_577 = __VLS_asFunctionalComponent(__VLS_576, new __VLS_576({
        label: "主审人员",
        minWidth: "220",
    }));
    const __VLS_578 = __VLS_577({
        label: "主审人员",
        minWidth: "220",
    }, ...__VLS_functionalComponentArgsRest(__VLS_577));
    __VLS_579.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_579.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_580 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_581 = __VLS_asFunctionalComponent(__VLS_580, new __VLS_580({
            modelValue: (row.approvers),
            multiple: true,
            collapseTags: true,
            placeholder: "选择审核人",
            disabled: (!__VLS_ctx.rdEditForm.enabled || !row.enabled || row.skipApproval),
            ...{ style: {} },
        }));
        const __VLS_582 = __VLS_581({
            modelValue: (row.approvers),
            multiple: true,
            collapseTags: true,
            placeholder: "选择审核人",
            disabled: (!__VLS_ctx.rdEditForm.enabled || !row.enabled || row.skipApproval),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_581));
        __VLS_583.slots.default;
        const __VLS_584 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_585 = __VLS_asFunctionalComponent(__VLS_584, new __VLS_584({
            label: "余郝~",
            value: "余郝~",
        }));
        const __VLS_586 = __VLS_585({
            label: "余郝~",
            value: "余郝~",
        }, ...__VLS_functionalComponentArgsRest(__VLS_585));
        const __VLS_588 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_589 = __VLS_asFunctionalComponent(__VLS_588, new __VLS_588({
            label: "张海国",
            value: "张海国",
        }));
        const __VLS_590 = __VLS_589({
            label: "张海国",
            value: "张海国",
        }, ...__VLS_functionalComponentArgsRest(__VLS_589));
        const __VLS_592 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_593 = __VLS_asFunctionalComponent(__VLS_592, new __VLS_592({
            label: "CEO",
            value: "CEO",
        }));
        const __VLS_594 = __VLS_593({
            label: "CEO",
            value: "CEO",
        }, ...__VLS_functionalComponentArgsRest(__VLS_593));
        const __VLS_596 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_597 = __VLS_asFunctionalComponent(__VLS_596, new __VLS_596({
            label: "CFO",
            value: "CFO",
        }));
        const __VLS_598 = __VLS_597({
            label: "CFO",
            value: "CFO",
        }, ...__VLS_functionalComponentArgsRest(__VLS_597));
        const __VLS_600 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_601 = __VLS_asFunctionalComponent(__VLS_600, new __VLS_600({
            label: "财务BP",
            value: "财务BP",
        }));
        const __VLS_602 = __VLS_601({
            label: "财务BP",
            value: "财务BP",
        }, ...__VLS_functionalComponentArgsRest(__VLS_601));
        var __VLS_583;
    }
    var __VLS_579;
    const __VLS_604 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_605 = __VLS_asFunctionalComponent(__VLS_604, new __VLS_604({
        label: "审批模式",
        width: "160",
        align: "center",
    }));
    const __VLS_606 = __VLS_605({
        label: "审批模式",
        width: "160",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_605));
    __VLS_607.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_607.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (row.approvers && row.approvers.length > 1) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "logic-capsule-wrapper column-mode" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "logic-capsule" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.activeMenu === 'grade'))
                            return;
                        if (!!(__VLS_ctx.activeMenu === 'duration'))
                            return;
                        if (!!(__VLS_ctx.activeMenu === 'approver'))
                            return;
                        if (!(__VLS_ctx.activeMenu === 'approval'))
                            return;
                        if (!(row.approvers && row.approvers.length > 1))
                            return;
                        row.approvalType = 'and';
                    } },
                ...{ class: "capsule-item mini" },
                ...{ class: ({ active: row.approvalType === 'and' }) },
            });
            const __VLS_608 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_609 = __VLS_asFunctionalComponent(__VLS_608, new __VLS_608({}));
            const __VLS_610 = __VLS_609({}, ...__VLS_functionalComponentArgsRest(__VLS_609));
            __VLS_611.slots.default;
            const __VLS_612 = {}.UserFilled;
            /** @type {[typeof __VLS_components.UserFilled, ]} */ ;
            // @ts-ignore
            const __VLS_613 = __VLS_asFunctionalComponent(__VLS_612, new __VLS_612({}));
            const __VLS_614 = __VLS_613({}, ...__VLS_functionalComponentArgsRest(__VLS_613));
            var __VLS_611;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.activeMenu === 'grade'))
                            return;
                        if (!!(__VLS_ctx.activeMenu === 'duration'))
                            return;
                        if (!!(__VLS_ctx.activeMenu === 'approver'))
                            return;
                        if (!(__VLS_ctx.activeMenu === 'approval'))
                            return;
                        if (!(row.approvers && row.approvers.length > 1))
                            return;
                        row.approvalType = 'or';
                    } },
                ...{ class: "capsule-item mini" },
                ...{ class: ({ active: row.approvalType === 'or' }) },
            });
            const __VLS_616 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_617 = __VLS_asFunctionalComponent(__VLS_616, new __VLS_616({}));
            const __VLS_618 = __VLS_617({}, ...__VLS_functionalComponentArgsRest(__VLS_617));
            __VLS_619.slots.default;
            const __VLS_620 = {}.Pointer;
            /** @type {[typeof __VLS_components.Pointer, ]} */ ;
            // @ts-ignore
            const __VLS_621 = __VLS_asFunctionalComponent(__VLS_620, new __VLS_620({}));
            const __VLS_622 = __VLS_621({}, ...__VLS_functionalComponentArgsRest(__VLS_621));
            var __VLS_619;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        else if (!row.skipApproval && row.approvers.length === 1) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "mode-placeholder" },
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "mode-placeholder" },
            });
        }
    }
    var __VLS_607;
    const __VLS_624 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_625 = __VLS_asFunctionalComponent(__VLS_624, new __VLS_624({
        label: "抄送",
        minWidth: "180",
    }));
    const __VLS_626 = __VLS_625({
        label: "抄送",
        minWidth: "180",
    }, ...__VLS_functionalComponentArgsRest(__VLS_625));
    __VLS_627.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_627.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_628 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_629 = __VLS_asFunctionalComponent(__VLS_628, new __VLS_628({
            modelValue: (row.ccList),
            multiple: true,
            collapseTags: true,
            placeholder: "选择",
            disabled: (!__VLS_ctx.rdEditForm.enabled || !row.enabled || row.skipApproval),
        }));
        const __VLS_630 = __VLS_629({
            modelValue: (row.ccList),
            multiple: true,
            collapseTags: true,
            placeholder: "选择",
            disabled: (!__VLS_ctx.rdEditForm.enabled || !row.enabled || row.skipApproval),
        }, ...__VLS_functionalComponentArgsRest(__VLS_629));
        __VLS_631.slots.default;
        const __VLS_632 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_633 = __VLS_asFunctionalComponent(__VLS_632, new __VLS_632({
            label: "财务部",
            value: "财务部",
        }));
        const __VLS_634 = __VLS_633({
            label: "财务部",
            value: "财务部",
        }, ...__VLS_functionalComponentArgsRest(__VLS_633));
        const __VLS_636 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_637 = __VLS_asFunctionalComponent(__VLS_636, new __VLS_636({
            label: "项目办",
            value: "项目办",
        }));
        const __VLS_638 = __VLS_637({
            label: "项目办",
            value: "项目办",
        }, ...__VLS_functionalComponentArgsRest(__VLS_637));
        const __VLS_640 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_641 = __VLS_asFunctionalComponent(__VLS_640, new __VLS_640({
            label: "总经办",
            value: "总经办",
        }));
        const __VLS_642 = __VLS_641({
            label: "总经办",
            value: "总经办",
        }, ...__VLS_functionalComponentArgsRest(__VLS_641));
        var __VLS_631;
    }
    var __VLS_627;
    const __VLS_644 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_645 = __VLS_asFunctionalComponent(__VLS_644, new __VLS_644({
        label: "操作",
        width: "60",
        align: "center",
    }));
    const __VLS_646 = __VLS_645({
        label: "操作",
        width: "60",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_645));
    __VLS_647.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_647.slots;
        const [{ $index }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_648 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_649 = __VLS_asFunctionalComponent(__VLS_648, new __VLS_648({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
            icon: "Delete",
            disabled: (__VLS_ctx.rdEditForm.rules.length <= 1),
        }));
        const __VLS_650 = __VLS_649({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
            icon: "Delete",
            disabled: (__VLS_ctx.rdEditForm.rules.length <= 1),
        }, ...__VLS_functionalComponentArgsRest(__VLS_649));
        let __VLS_652;
        let __VLS_653;
        let __VLS_654;
        const __VLS_655 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeMenu === 'grade'))
                    return;
                if (!!(__VLS_ctx.activeMenu === 'duration'))
                    return;
                if (!!(__VLS_ctx.activeMenu === 'approver'))
                    return;
                if (!(__VLS_ctx.activeMenu === 'approval'))
                    return;
                __VLS_ctx.removeRdRule($index);
            }
        };
        var __VLS_651;
    }
    var __VLS_647;
    var __VLS_515;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-actions" },
    });
    const __VLS_656 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_657 = __VLS_asFunctionalComponent(__VLS_656, new __VLS_656({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        icon: "Plus",
    }));
    const __VLS_658 = __VLS_657({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        icon: "Plus",
    }, ...__VLS_functionalComponentArgsRest(__VLS_657));
    let __VLS_660;
    let __VLS_661;
    let __VLS_662;
    const __VLS_663 = {
        onClick: (__VLS_ctx.addRdRule)
    };
    __VLS_659.slots.default;
    var __VLS_659;
    {
        const { footer: __VLS_thisSlot } = __VLS_483.slots;
        const __VLS_664 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_665 = __VLS_asFunctionalComponent(__VLS_664, new __VLS_664({
            ...{ 'onClick': {} },
        }));
        const __VLS_666 = __VLS_665({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_665));
        let __VLS_668;
        let __VLS_669;
        let __VLS_670;
        const __VLS_671 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeMenu === 'grade'))
                    return;
                if (!!(__VLS_ctx.activeMenu === 'duration'))
                    return;
                if (!!(__VLS_ctx.activeMenu === 'approver'))
                    return;
                if (!(__VLS_ctx.activeMenu === 'approval'))
                    return;
                __VLS_ctx.rdEditDialogVisible = false;
            }
        };
        __VLS_667.slots.default;
        var __VLS_667;
        const __VLS_672 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_673 = __VLS_asFunctionalComponent(__VLS_672, new __VLS_672({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_674 = __VLS_673({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_673));
        let __VLS_676;
        let __VLS_677;
        let __VLS_678;
        const __VLS_679 = {
            onClick: (__VLS_ctx.saveRdEdit)
        };
        __VLS_675.slots.default;
        var __VLS_675;
    }
    var __VLS_483;
}
var __VLS_3;
const __VLS_680 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_681 = __VLS_asFunctionalComponent(__VLS_680, new __VLS_680({
    modelValue: (__VLS_ctx.logDialogVisible),
    title: "操作日志",
    width: "600px",
    appendToBody: true,
    customClass: "log-dialog",
}));
const __VLS_682 = __VLS_681({
    modelValue: (__VLS_ctx.logDialogVisible),
    title: "操作日志",
    width: "600px",
    appendToBody: true,
    customClass: "log-dialog",
}, ...__VLS_functionalComponentArgsRest(__VLS_681));
__VLS_683.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "history-timeline-wrapper" },
});
const __VLS_684 = {}.ElTimeline;
/** @type {[typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, typeof __VLS_components.ElTimeline, typeof __VLS_components.elTimeline, ]} */ ;
// @ts-ignore
const __VLS_685 = __VLS_asFunctionalComponent(__VLS_684, new __VLS_684({}));
const __VLS_686 = __VLS_685({}, ...__VLS_functionalComponentArgsRest(__VLS_685));
__VLS_687.slots.default;
for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.logRecords))) {
    const __VLS_688 = {}.ElTimelineItem;
    /** @type {[typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, typeof __VLS_components.ElTimelineItem, typeof __VLS_components.elTimelineItem, ]} */ ;
    // @ts-ignore
    const __VLS_689 = __VLS_asFunctionalComponent(__VLS_688, new __VLS_688({
        key: (index),
        timestamp: (item.time),
        placement: "top",
    }));
    const __VLS_690 = __VLS_689({
        key: (index),
        timestamp: (item.time),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_689));
    __VLS_691.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "history-round-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "h-round-no" },
    });
    (item.operator);
    const __VLS_692 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_693 = __VLS_asFunctionalComponent(__VLS_692, new __VLS_692({
        size: "small",
        type: (item.action.includes('新增') ? 'success' : 'primary'),
        effect: "plain",
    }));
    const __VLS_694 = __VLS_693({
        size: "small",
        type: (item.action.includes('新增') ? 'success' : 'primary'),
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_693));
    __VLS_695.slots.default;
    (item.action);
    var __VLS_695;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "h-card-reason" },
        ...{ style: {} },
    });
    (item.detail);
    var __VLS_691;
}
var __VLS_687;
var __VLS_683;
/** @type {__VLS_StyleScopedClasses['settings-master-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['md-layout-body']} */ ;
/** @type {__VLS_StyleScopedClasses['md-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['md-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-group-title']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['item-text']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['item-text']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-group-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['item-text']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['item-text']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['md-content']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-header']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-body']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-table']} */ ;
/** @type {__VLS_StyleScopedClasses['full-input']} */ ;
/** @type {__VLS_StyleScopedClasses['full-input']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-header']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-body']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-table']} */ ;
/** @type {__VLS_StyleScopedClasses['full-input']} */ ;
/** @type {__VLS_StyleScopedClasses['full-input']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-header']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-search']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-body']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-table']} */ ;
/** @type {__VLS_StyleScopedClasses['pro-matrix-table']} */ ;
/** @type {__VLS_StyleScopedClasses['platform-configs-list']} */ ;
/** @type {__VLS_StyleScopedClasses['platform-row']} */ ;
/** @type {__VLS_StyleScopedClasses['platform-info']} */ ;
/** @type {__VLS_StyleScopedClasses['platform-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['approver-info']} */ ;
/** @type {__VLS_StyleScopedClasses['node']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['chips']} */ ;
/** @type {__VLS_StyleScopedClasses['node']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['chips']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['skip']} */ ;
/** @type {__VLS_StyleScopedClasses['trigger-info']} */ ;
/** @type {__VLS_StyleScopedClasses['mandatory']} */ ;
/** @type {__VLS_StyleScopedClasses['condition']} */ ;
/** @type {__VLS_StyleScopedClasses['none']} */ ;
/** @type {__VLS_StyleScopedClasses['matrix-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-header']} */ ;
/** @type {__VLS_StyleScopedClasses['grade-label']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-sub-table']} */ ;
/** @type {__VLS_StyleScopedClasses['mandatory-text']} */ ;
/** @type {__VLS_StyleScopedClasses['trigger-edit']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-pane']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-header']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-search']} */ ;
/** @type {__VLS_StyleScopedClasses['pane-body']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-table']} */ ;
/** @type {__VLS_StyleScopedClasses['pro-matrix-table']} */ ;
/** @type {__VLS_StyleScopedClasses['visual-range']} */ ;
/** @type {__VLS_StyleScopedClasses['part']} */ ;
/** @type {__VLS_StyleScopedClasses['inc']} */ ;
/** @type {__VLS_StyleScopedClasses['sym']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['divider']} */ ;
/** @type {__VLS_StyleScopedClasses['part']} */ ;
/** @type {__VLS_StyleScopedClasses['exc']} */ ;
/** @type {__VLS_StyleScopedClasses['sym']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['platform-configs-list']} */ ;
/** @type {__VLS_StyleScopedClasses['platform-row']} */ ;
/** @type {__VLS_StyleScopedClasses['platform-info']} */ ;
/** @type {__VLS_StyleScopedClasses['default-rule-text']} */ ;
/** @type {__VLS_StyleScopedClasses['chips-group']} */ ;
/** @type {__VLS_StyleScopedClasses['chip']} */ ;
/** @type {__VLS_StyleScopedClasses['approver-info']} */ ;
/** @type {__VLS_StyleScopedClasses['identity-node']} */ ;
/** @type {__VLS_StyleScopedClasses['node-group']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
/** @type {__VLS_StyleScopedClasses['group-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['role-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['identity-node']} */ ;
/** @type {__VLS_StyleScopedClasses['node-approver']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
/** @type {__VLS_StyleScopedClasses['skip-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['role-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['skip-text']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
/** @type {__VLS_StyleScopedClasses['approver-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['role-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['approver-chips']} */ ;
/** @type {__VLS_StyleScopedClasses['identity-node']} */ ;
/** @type {__VLS_StyleScopedClasses['node-cc']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
/** @type {__VLS_StyleScopedClasses['cc-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['text']} */ ;
/** @type {__VLS_StyleScopedClasses['role-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['cc-tag-list']} */ ;
/** @type {__VLS_StyleScopedClasses['none-text']} */ ;
/** @type {__VLS_StyleScopedClasses['approval-config-container']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-header']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-sub-table']} */ ;
/** @type {__VLS_StyleScopedClasses['default-rule-text']} */ ;
/** @type {__VLS_StyleScopedClasses['logic-capsule-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['column-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['logic-capsule']} */ ;
/** @type {__VLS_StyleScopedClasses['capsule-item']} */ ;
/** @type {__VLS_StyleScopedClasses['mini']} */ ;
/** @type {__VLS_StyleScopedClasses['capsule-item']} */ ;
/** @type {__VLS_StyleScopedClasses['mini']} */ ;
/** @type {__VLS_StyleScopedClasses['mode-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['mode-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['history-timeline-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['history-round-card']} */ ;
/** @type {__VLS_StyleScopedClasses['h-card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['h-round-no']} */ ;
/** @type {__VLS_StyleScopedClasses['h-card-reason']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            UserFilled: UserFilled,
            Shop: Shop,
            VideoPlay: VideoPlay,
            InfoFilled: InfoFilled,
            CircleCheckFilled: CircleCheckFilled,
            OfficeBuilding: OfficeBuilding,
            User: User,
            Promotion: Promotion,
            Pointer: Pointer,
            activeMenu: activeMenu,
            searchKeyword: searchKeyword,
            filterPlatform: filterPlatform,
            logDialogVisible: logDialogVisible,
            logRecords: logRecords,
            showLog: showLog,
            proposalGrades: proposalGrades,
            sampleDurations: sampleDurations,
            durationEditDialogVisible: durationEditDialogVisible,
            durationEditForm: durationEditForm,
            handleDurationEdit: handleDurationEdit,
            saveDurationEdit: saveDurationEdit,
            approverConfigs: approverConfigs,
            rdEditDialogVisible: rdEditDialogVisible,
            rdEditForm: rdEditForm,
            currentRdEditingIndex: currentRdEditingIndex,
            handleRdEdit: handleRdEdit,
            handleRdAdd: handleRdAdd,
            saveRdEdit: saveRdEdit,
            handleRdDelete: handleRdDelete,
            addRdRule: addRdRule,
            removeRdRule: removeRdRule,
            getAmountRiskColor: getAmountRiskColor,
            filteredApprovals: filteredApprovals,
            filteredApproverList: filteredApproverList,
            getGradeType: getGradeType,
            editDialogVisible: editDialogVisible,
            editForm: editForm,
            currentEditingIndex: currentEditingIndex,
            handleEdit: handleEdit,
            handleAdd: handleAdd,
            saveEdit: saveEdit,
            addPlatformConfig: addPlatformConfig,
            removePlatformConfig: removePlatformConfig,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map