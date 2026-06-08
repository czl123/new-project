/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { STAT_TABS, STATUS_COLORS, INITIAL_QUERY_PARAMS } from './constants';
import DetailDrawer from './components/DetailDrawer.vue';
import EditDialog from './components/EditDialog.vue';
import CreateTaskDialog from './components/CreateTaskDialog.vue';
import CustomFeedbackDetailDialog from './components/CustomFeedbackDetailDialog.vue';
const router = useRouter();
const tableContainerRef = ref(null);
const tableHeight = ref(400);
const calcTableHeight = () => {
    if (tableContainerRef.value) {
        const rect = tableContainerRef.value.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // pagination-footer is 48px, plus some padding/margin (10px). Let's subtract 58px.
        tableHeight.value = Math.max(windowHeight - rect.top - 58, 200);
    }
};
let resizeObserver = null;
onMounted(() => {
    calcTableHeight();
    window.addEventListener('resize', calcTableHeight);
    if (typeof ResizeObserver !== 'undefined' && tableContainerRef.value) {
        resizeObserver = new ResizeObserver(() => {
            calcTableHeight();
        });
        const pageEl = tableContainerRef.value.parentElement;
        if (pageEl) {
            resizeObserver.observe(pageEl);
        }
    }
});
onUnmounted(() => {
    window.removeEventListener('resize', calcTableHeight);
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
});
const activeStat = ref('全部');
const editDialogVisible = ref(false);
const currentEditRow = ref({});
const handleEdit = (row) => {
    currentEditRow.value = row;
    editDialogVisible.value = true;
};
const handleSaveEdit = (updatedData) => {
    const index = allTableData.value.findIndex(item => item.proposalNo === updatedData.proposalNo);
    if (index > -1) {
        allTableData.value[index] = {
            ...allTableData.value[index],
            ...updatedData
        };
    }
};
const createTaskDialogVisible = ref(false);
const currentCreateTaskRow = ref({});
const customFeedbackDetailDialogRef = ref(null);
const handleCreateTask = (row) => {
    currentCreateTaskRow.value = row;
    createTaskDialogVisible.value = true;
};
const handleCustomFeedback = (row) => {
    customFeedbackDetailDialogRef.value?.open(row);
};
const handleSaveCreateTask = (taskData) => {
    const index = allTableData.value.findIndex(item => item.proposalNo === taskData.proposalNo);
    if (index > -1) {
        // 将表单修改的数据回写到本地列表中
        allTableData.value[index] = {
            ...allTableData.value[index],
            ...taskData
        };
        // 只有在点击“提交”时才流转状态
        if (taskData.isSubmit) {
            const row = allTableData.value[index];
            row.status = '拿样中';
            if (row.taskRounds && row.taskRounds.includes('0/0/0')) {
                row.taskRounds = '共【0/1/0】轮';
            }
        }
    }
};
const goToSampleManage = (proposalNo) => {
    if (!proposalNo || proposalNo === '-')
        return;
    router.push({
        path: '/product/proposal/sample-manage',
        query: { proposalNo }
    });
};
const currentPage = ref(1);
const pageSize = ref(20);
const expandedRowKeys = ref([]);
const detailDrawerVisible = ref(false);
const currentDetail = ref({});
const handleDetail = (row) => {
    currentDetail.value = row;
    detailDrawerVisible.value = true;
};
const handleExpandChange = (row, expandedRows) => {
    if (expandedRows.length > 0) {
        expandedRowKeys.value = [row.proposalNo];
    }
    else {
        expandedRowKeys.value = [];
    }
};
const statTabs = STAT_TABS;
const queryParams = reactive({ ...INITIAL_QUERY_PARAMS });
const batchSearchVisible = ref(false);
const batchSearchValue = ref('');
const handleBatchSearch = () => {
    // 将换行符转换为逗号或其他后端支持的格式赋值给 proposalNo
    queryParams.proposalNo = batchSearchValue.value.replace(/\n/g, ',');
    batchSearchVisible.value = false;
    handleQuery();
};
const clearBatchSearch = () => {
    batchSearchValue.value = '';
};
const allTableData = ref([
    {
        proposalNo: 'TA-202604101', source: '开发预案', date: '2026-04-22', status: '待设计', spu: 'US0218', platform: 'Amazon', category: '运动户外', productName: 'ZZ-户外牧羊人钩', style: '防鼠挡板配件', material: 'ABS+金属', manager: '谢东桥', devMethod: '全新品-现货', level: 'D', estProposalDate: '2026-05-15', devStatus: '未完结-正常', brand: '-', model: '-', launchTime: '-', isResearched: '否', actProposalDate: '-',
        taskRounds: '共【0/0/0】轮', mouldCount: '共【0】次', proposalRounds: '共【0】轮', proposalDays: '共【0(0)】天', sampleCountDesc: '共【0/0/0】件', rdCost: '共【0】元', feedbackCount: 2
    },
    {
        proposalNo: 'TA-202604100', source: '需求预案', date: '2026-04-20', status: '拿样中', hasBadge: true, spu: 'HC0867', platform: 'Amazon', category: '个人护理', productName: 'ZZ-牙刷保护套', style: '-', material: '-', manager: '吴美林', devMethod: '全新品-现货', level: 'D', estProposalDate: '2026-05-15', devStatus: '未完结-正常', brand: '-', model: '-', launchTime: '2026-05', isResearched: '', actProposalDate: '-',
        taskRounds: '共【0/1/1】轮', mouldCount: '共【0】次', proposalRounds: '共【1】轮', proposalDays: '共【7(0)】天', sampleCountDesc: '共【1/1/0】件', rdCost: '共【50】元', feedbackCount: 3
    },
    {
        proposalNo: 'TA-202604099', source: '需求预案', date: '2026-04-20', status: '拿样中', hasBadge: true, spu: 'HC0866', platform: 'Amazon', category: '个人护理', productName: 'ZZ-牙刷头保护套', style: '保护套', material: '-', manager: '吴美林', devMethod: '全新品-现货', level: 'D', estProposalDate: '2026-05-15', devStatus: '未完结-正常', brand: '-', model: '-', launchTime: '2026-05', isResearched: '', actProposalDate: '-',
        taskRounds: '共【0/1/1】轮', mouldCount: '共【0】次', proposalRounds: '共【1】轮', proposalDays: '共【10(2)】天', sampleCountDesc: '共【1/0/1】件', rdCost: '共【180】元', feedbackCount: 1
    },
    {
        proposalNo: 'TA-202604093', source: '开发预案', date: '2026-04-20', status: '设计中', spu: 'HW0548', platform: 'Amazon', category: '家装工具', productName: '自行车支架', style: '停车架可折叠', material: '碳钢+塑料', manager: '闵咪咪', devMethod: '全新品-现货', level: 'D', estProposalDate: '2026-06-05', devStatus: '未完结-正常', brand: '-', model: '-', launchTime: '-', isResearched: '是', actProposalDate: '-',
        taskRounds: '共【0/0/0】轮', mouldCount: '共【0】次', proposalRounds: '共【0】轮', proposalDays: '共【15(0)】天', sampleCountDesc: '共【0/0/0】件', rdCost: '共【0】元', feedbackCount: 2
    },
]);
const tableData = computed(() => {
    let filtered = allTableData.value;
    // 1. 待办状态筛选
    if (activeStat.value !== '全部') {
        filtered = filtered.filter(item => item.status === activeStat.value);
    }
    // 2. 平台筛选
    if (queryParams.platform) {
        filtered = filtered.filter(item => item.platform === queryParams.platform);
    }
    // 3. 运营大类筛选
    if (queryParams.category) {
        filtered = filtered.filter(item => item.category === queryParams.category);
    }
    // 4. 产品经理筛选
    if (queryParams.manager) {
        filtered = filtered.filter(item => item.manager === queryParams.manager);
    }
    // 5. 当前进度 (status) 筛选
    if (queryParams.progress) {
        filtered = filtered.filter(item => item.status === queryParams.progress);
    }
    // 6. 开发方式筛选
    if (queryParams.devMethod) {
        filtered = filtered.filter(item => item.devMethod === queryParams.devMethod);
    }
    // 7. 提案等级筛选
    if (queryParams.level) {
        filtered = filtered.filter(item => item.level === queryParams.level);
    }
    // 8. 新品开发进度 (devStatus) 筛选
    if (queryParams.newDevProgress) {
        filtered = filtered.filter(item => item.devStatus === queryParams.newDevProgress);
    }
    // 9. 提案编号 / 产品名称 (搜索关键字) 模糊/批量筛选
    if (queryParams.proposalNo) {
        const queryVal = queryParams.proposalNo.trim();
        if (queryParams.searchType === '1') {
            // 提案编号搜索，支持批量输入逗号分割的单号
            const ids = queryVal.split(',').map(s => s.trim()).filter(Boolean);
            if (ids.length > 0) {
                filtered = filtered.filter(item => ids.some(id => item.proposalNo.toLowerCase().includes(id.toLowerCase())));
            }
        }
        else if (queryParams.searchType === '2') {
            // 产品名称模糊搜索
            filtered = filtered.filter(item => item.productName.toLowerCase().includes(queryVal.toLowerCase()));
        }
    }
    // 10. 立项日期 / 结项日期时间段筛选
    if (queryParams.dateRange && queryParams.dateRange.length === 2) {
        const [start, end] = queryParams.dateRange;
        if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);
            endDate.setHours(23, 59, 59, 999); // 包含结束当天
            filtered = filtered.filter(item => {
                const dateStr = queryParams.dateType === '1' ? item.date : item.actProposalDate;
                if (!dateStr || dateStr === '-')
                    return false;
                const d = new Date(dateStr);
                return d >= startDate && d <= endDate;
            });
        }
    }
    return filtered;
});
const getStatCount = (label) => {
    if (label === '全部')
        return allTableData.value.length;
    return allTableData.value.filter(item => item.status === label).length;
};
const handleStatClick = (label) => activeStat.value = label;
const getStatusClass = (status) => {
    const map = { '待设计': 'blue', '拿样中': 'orange', '设计中': 'green' };
    return map[status] || 'grey';
};
const getStatusColor = (label) => STATUS_COLORS[label] || '#bfbfbf';
const handleQuery = () => {
    console.log('查询参数：', queryParams);
};
const handleRefresh = () => {
    console.log('刷新数据');
};
const resetQuery = () => {
    Object.assign(queryParams, INITIAL_QUERY_PARAMS);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['count']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['val-link']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['status-text']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['mock-chart']} */ ;
/** @type {__VLS_StyleScopedClasses['y-axis-right']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['yellow']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "compact-stat-bar modern-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "stat-list" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.statTabs))) {
    const __VLS_0 = {}.ElTooltip;
    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        key: (item.label),
        content: (item.desc),
        placement: "bottom",
        showAfter: (200),
    }));
    const __VLS_2 = __VLS_1({
        key: (item.label),
        content: (item.desc),
        placement: "bottom",
        showAfter: (200),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleStatClick(item.label);
            } },
        ...{ class: "stat-chip" },
        ...{ class: ({ active: __VLS_ctx.activeStat === item.label }) },
        ...{ style: ({ '--status-color': __VLS_ctx.getStatusColor(item.label) }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dot" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "label" },
    });
    (item.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "count" },
    });
    (__VLS_ctx.getStatCount(item.label));
    var __VLS_3;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-panel modern-card" },
});
const __VLS_4 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    model: (__VLS_ctx.queryParams),
    inline: true,
    size: "small",
    ...{ class: "search-form" },
}));
const __VLS_6 = __VLS_5({
    model: (__VLS_ctx.queryParams),
    inline: true,
    size: "small",
    ...{ class: "search-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "composite-picker" },
});
const __VLS_12 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.queryParams.dateType),
    ...{ style: {} },
    ...{ class: "type-select" },
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.queryParams.dateType),
    ...{ style: {} },
    ...{ class: "type-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: "立项日期",
    value: "1",
}));
const __VLS_18 = __VLS_17({
    label: "立项日期",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_20 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    label: "结项日期",
    value: "2",
}));
const __VLS_22 = __VLS_21({
    label: "结项日期",
    value: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
var __VLS_15;
const __VLS_24 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.queryParams.dateRange),
    type: "daterange",
    rangeSeparator: "至",
    startPlaceholder: "开始时间",
    endPlaceholder: "结束时间",
    ...{ style: {} },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.queryParams.dateRange),
    type: "daterange",
    rangeSeparator: "至",
    startPlaceholder: "开始时间",
    endPlaceholder: "结束时间",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
var __VLS_11;
const __VLS_28 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.queryParams.platform),
    placeholder: "平台",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.queryParams.platform),
    placeholder: "平台",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "Amazon",
    value: "Amazon",
}));
const __VLS_38 = __VLS_37({
    label: "Amazon",
    value: "Amazon",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
var __VLS_35;
var __VLS_31;
const __VLS_40 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.queryParams.category),
    placeholder: "运营大类",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.queryParams.category),
    placeholder: "运营大类",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
const __VLS_48 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "运动户外",
    value: "运动户外",
}));
const __VLS_50 = __VLS_49({
    label: "运动户外",
    value: "运动户外",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const __VLS_52 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "个人护理",
    value: "个人护理",
}));
const __VLS_54 = __VLS_53({
    label: "个人护理",
    value: "个人护理",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const __VLS_56 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    label: "家装工具",
    value: "家装工具",
}));
const __VLS_58 = __VLS_57({
    label: "家装工具",
    value: "家装工具",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
var __VLS_47;
var __VLS_43;
const __VLS_60 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
__VLS_63.slots.default;
const __VLS_64 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    modelValue: (__VLS_ctx.queryParams.manager),
    placeholder: "产品经理",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_66 = __VLS_65({
    modelValue: (__VLS_ctx.queryParams.manager),
    placeholder: "产品经理",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    label: "谢东桥",
    value: "谢东桥",
}));
const __VLS_70 = __VLS_69({
    label: "谢东桥",
    value: "谢东桥",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
const __VLS_72 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "吴美林",
    value: "吴美林",
}));
const __VLS_74 = __VLS_73({
    label: "吴美林",
    value: "吴美林",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const __VLS_76 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    label: "闵咪咪",
    value: "闵咪咪",
}));
const __VLS_78 = __VLS_77({
    label: "闵咪咪",
    value: "闵咪咪",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
var __VLS_67;
var __VLS_63;
const __VLS_80 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({}));
const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    modelValue: (__VLS_ctx.queryParams.progress),
    placeholder: "当前进度",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_86 = __VLS_85({
    modelValue: (__VLS_ctx.queryParams.progress),
    placeholder: "当前进度",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
const __VLS_88 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    label: "待设计",
    value: "待设计",
}));
const __VLS_90 = __VLS_89({
    label: "待设计",
    value: "待设计",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const __VLS_92 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    label: "拿样中",
    value: "拿样中",
}));
const __VLS_94 = __VLS_93({
    label: "拿样中",
    value: "拿样中",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const __VLS_96 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    label: "设计中",
    value: "设计中",
}));
const __VLS_98 = __VLS_97({
    label: "设计中",
    value: "设计中",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
var __VLS_87;
var __VLS_83;
const __VLS_100 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({}));
const __VLS_102 = __VLS_101({}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
const __VLS_104 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    modelValue: (__VLS_ctx.queryParams.devMethod),
    placeholder: "开发方式",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_106 = __VLS_105({
    modelValue: (__VLS_ctx.queryParams.devMethod),
    placeholder: "开发方式",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
const __VLS_108 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
    label: "全新品-现货",
    value: "全新品-现货",
}));
const __VLS_110 = __VLS_109({
    label: "全新品-现货",
    value: "全新品-现货",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
var __VLS_107;
var __VLS_103;
const __VLS_112 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({}));
const __VLS_114 = __VLS_113({}, ...__VLS_functionalComponentArgsRest(__VLS_113));
__VLS_115.slots.default;
const __VLS_116 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    modelValue: (__VLS_ctx.queryParams.level),
    placeholder: "提案等级",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_118 = __VLS_117({
    modelValue: (__VLS_ctx.queryParams.level),
    placeholder: "提案等级",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
const __VLS_120 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    label: "A",
    value: "A",
}));
const __VLS_122 = __VLS_121({
    label: "A",
    value: "A",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
const __VLS_124 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    label: "B",
    value: "B",
}));
const __VLS_126 = __VLS_125({
    label: "B",
    value: "B",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const __VLS_128 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
    label: "C",
    value: "C",
}));
const __VLS_130 = __VLS_129({
    label: "C",
    value: "C",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
const __VLS_132 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    label: "D",
    value: "D",
}));
const __VLS_134 = __VLS_133({
    label: "D",
    value: "D",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
var __VLS_119;
var __VLS_115;
const __VLS_136 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({}));
const __VLS_138 = __VLS_137({}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
const __VLS_140 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
    modelValue: (__VLS_ctx.queryParams.newDevProgress),
    placeholder: "新品开发进度",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_142 = __VLS_141({
    modelValue: (__VLS_ctx.queryParams.newDevProgress),
    placeholder: "新品开发进度",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
    label: "未完结-正常",
    value: "未完结-正常",
}));
const __VLS_146 = __VLS_145({
    label: "未完结-正常",
    value: "未完结-正常",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
var __VLS_143;
var __VLS_139;
const __VLS_148 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({}));
const __VLS_150 = __VLS_149({}, ...__VLS_functionalComponentArgsRest(__VLS_149));
__VLS_151.slots.default;
const __VLS_152 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    modelValue: (__VLS_ctx.queryParams.proposalNo),
    placeholder: "请输入内容",
    ...{ style: {} },
    ...{ class: "search-keyword" },
    clearable: true,
}));
const __VLS_154 = __VLS_153({
    modelValue: (__VLS_ctx.queryParams.proposalNo),
    placeholder: "请输入内容",
    ...{ style: {} },
    ...{ class: "search-keyword" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
{
    const { prepend: __VLS_thisSlot } = __VLS_155.slots;
    const __VLS_156 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        modelValue: (__VLS_ctx.queryParams.searchType),
        ...{ style: {} },
    }));
    const __VLS_158 = __VLS_157({
        modelValue: (__VLS_ctx.queryParams.searchType),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_159.slots.default;
    const __VLS_160 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        label: "提案编号",
        value: "1",
    }));
    const __VLS_162 = __VLS_161({
        label: "提案编号",
        value: "1",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    const __VLS_164 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        label: "产品名称",
        value: "2",
    }));
    const __VLS_166 = __VLS_165({
        label: "产品名称",
        value: "2",
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    var __VLS_159;
}
{
    const { suffix: __VLS_thisSlot } = __VLS_155.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "input-suffix-icons" },
    });
    const __VLS_168 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        ...{ 'onClick': {} },
        ...{ class: "search-btn-icon" },
    }));
    const __VLS_170 = __VLS_169({
        ...{ 'onClick': {} },
        ...{ class: "search-btn-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    let __VLS_172;
    let __VLS_173;
    let __VLS_174;
    const __VLS_175 = {
        onClick: (__VLS_ctx.handleQuery)
    };
    __VLS_171.slots.default;
    const __VLS_176 = {}.Search;
    /** @type {[typeof __VLS_components.Search, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({}));
    const __VLS_178 = __VLS_177({}, ...__VLS_functionalComponentArgsRest(__VLS_177));
    var __VLS_171;
    const __VLS_180 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        direction: "vertical",
    }));
    const __VLS_182 = __VLS_181({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    const __VLS_184 = {}.ElPopover;
    /** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        visible: (__VLS_ctx.batchSearchVisible),
        placement: "bottom-end",
        width: (200),
        trigger: "click",
        popperClass: "batch-search-popper",
    }));
    const __VLS_186 = __VLS_185({
        visible: (__VLS_ctx.batchSearchVisible),
        placement: "bottom-end",
        width: (200),
        trigger: "click",
        popperClass: "batch-search-popper",
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    __VLS_187.slots.default;
    {
        const { reference: __VLS_thisSlot } = __VLS_187.slots;
        const __VLS_188 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
            ...{ class: "grid-menu" },
        }));
        const __VLS_190 = __VLS_189({
            ...{ class: "grid-menu" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
        __VLS_191.slots.default;
        const __VLS_192 = {}.Menu;
        /** @type {[typeof __VLS_components.Menu, ]} */ ;
        // @ts-ignore
        const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({}));
        const __VLS_194 = __VLS_193({}, ...__VLS_functionalComponentArgsRest(__VLS_193));
        var __VLS_191;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "batch-search-container" },
    });
    const __VLS_196 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        modelValue: (__VLS_ctx.batchSearchValue),
        type: "textarea",
        rows: (12),
        placeholder: "一行一项",
        resize: "none",
        ...{ class: "batch-textarea" },
    }));
    const __VLS_198 = __VLS_197({
        modelValue: (__VLS_ctx.batchSearchValue),
        type: "textarea",
        rows: (12),
        placeholder: "一行一项",
        resize: "none",
        ...{ class: "batch-textarea" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "batch-footer" },
    });
    const __VLS_200 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        ...{ 'onClick': {} },
        size: "small",
        ...{ class: "btn-clear" },
    }));
    const __VLS_202 = __VLS_201({
        ...{ 'onClick': {} },
        size: "small",
        ...{ class: "btn-clear" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    let __VLS_204;
    let __VLS_205;
    let __VLS_206;
    const __VLS_207 = {
        onClick: (__VLS_ctx.clearBatchSearch)
    };
    __VLS_203.slots.default;
    var __VLS_203;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "right-btns" },
    });
    const __VLS_208 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_210 = __VLS_209({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
    let __VLS_212;
    let __VLS_213;
    let __VLS_214;
    const __VLS_215 = {
        onClick: (...[$event]) => {
            __VLS_ctx.batchSearchVisible = false;
        }
    };
    __VLS_211.slots.default;
    var __VLS_211;
    const __VLS_216 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
    }));
    const __VLS_218 = __VLS_217({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_217));
    let __VLS_220;
    let __VLS_221;
    let __VLS_222;
    const __VLS_223 = {
        onClick: (__VLS_ctx.handleBatchSearch)
    };
    __VLS_219.slots.default;
    var __VLS_219;
    var __VLS_187;
}
var __VLS_155;
var __VLS_151;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-btns" },
});
const __VLS_224 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_226 = __VLS_225({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
let __VLS_228;
let __VLS_229;
let __VLS_230;
const __VLS_231 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_227.slots.default;
var __VLS_227;
const __VLS_232 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    ...{ 'onClick': {} },
}));
const __VLS_234 = __VLS_233({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
let __VLS_236;
let __VLS_237;
let __VLS_238;
const __VLS_239 = {
    onClick: (__VLS_ctx.resetQuery)
};
__VLS_235.slots.default;
var __VLS_235;
var __VLS_7;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "action-toolbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "left" },
});
const __VLS_240 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
    type: "primary",
    size: "small",
    icon: "Plus",
}));
const __VLS_242 = __VLS_241({
    type: "primary",
    size: "small",
    icon: "Plus",
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
__VLS_243.slots.default;
var __VLS_243;
const __VLS_244 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    size: "small",
    icon: "Download",
}));
const __VLS_246 = __VLS_245({
    size: "small",
    icon: "Download",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
var __VLS_247;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tool-group" },
});
const __VLS_248 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    ...{ 'onClick': {} },
    title: "刷新",
}));
const __VLS_250 = __VLS_249({
    ...{ 'onClick': {} },
    title: "刷新",
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
let __VLS_252;
let __VLS_253;
let __VLS_254;
const __VLS_255 = {
    onClick: (__VLS_ctx.handleRefresh)
};
__VLS_251.slots.default;
const __VLS_256 = {}.RefreshRight;
/** @type {[typeof __VLS_components.RefreshRight, ]} */ ;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({}));
const __VLS_258 = __VLS_257({}, ...__VLS_functionalComponentArgsRest(__VLS_257));
var __VLS_251;
const __VLS_260 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
    title: "设置",
}));
const __VLS_262 = __VLS_261({
    title: "设置",
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
__VLS_263.slots.default;
const __VLS_264 = {}.Operation;
/** @type {[typeof __VLS_components.Operation, ]} */ ;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({}));
const __VLS_266 = __VLS_265({}, ...__VLS_functionalComponentArgsRest(__VLS_265));
var __VLS_263;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "table-container modern-card" },
    ref: "tableContainerRef",
});
/** @type {typeof __VLS_ctx.tableContainerRef} */ ;
const __VLS_268 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
    ...{ 'onExpandChange': {} },
    data: (__VLS_ctx.tableData),
    height: (__VLS_ctx.tableHeight),
    size: "small",
    headerCellClassName: "modern-header",
    rowClassName: "modern-row",
    highlightCurrentRow: true,
    rowKey: "proposalNo",
    expandRowKeys: (__VLS_ctx.expandedRowKeys),
}));
const __VLS_270 = __VLS_269({
    ...{ 'onExpandChange': {} },
    data: (__VLS_ctx.tableData),
    height: (__VLS_ctx.tableHeight),
    size: "small",
    headerCellClassName: "modern-header",
    rowClassName: "modern-row",
    highlightCurrentRow: true,
    rowKey: "proposalNo",
    expandRowKeys: (__VLS_ctx.expandedRowKeys),
}, ...__VLS_functionalComponentArgsRest(__VLS_269));
let __VLS_272;
let __VLS_273;
let __VLS_274;
const __VLS_275 = {
    onExpandChange: (__VLS_ctx.handleExpandChange)
};
__VLS_271.slots.default;
const __VLS_276 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
    type: "index",
    label: "#",
    width: "45",
    align: "center",
    fixed: true,
}));
const __VLS_278 = __VLS_277({
    type: "index",
    label: "#",
    width: "45",
    align: "center",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_277));
const __VLS_280 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
    type: "expand",
    width: "20",
    fixed: true,
}));
const __VLS_282 = __VLS_281({
    type: "expand",
    width: "20",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_281));
__VLS_283.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_283.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "expand-wrapper" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "expand-column-left" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "expand-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-list" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "val" },
    });
    (row.taskRounds || '共【0/0/0】轮');
    const __VLS_284 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
        ...{ class: "hint-icon" },
    }));
    const __VLS_286 = __VLS_285({
        ...{ class: "hint-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_285));
    __VLS_287.slots.default;
    const __VLS_288 = {}.QuestionFilled;
    /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
    // @ts-ignore
    const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({}));
    const __VLS_290 = __VLS_289({}, ...__VLS_functionalComponentArgsRest(__VLS_289));
    var __VLS_287;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "val" },
    });
    (row.mouldCount || '共【0】次');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "val" },
    });
    (row.proposalRounds || '共【0】轮');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "val" },
    });
    (row.proposalDays || '共【0(0)】天');
    const __VLS_292 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
        ...{ class: "hint-icon" },
    }));
    const __VLS_294 = __VLS_293({
        ...{ class: "hint-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_293));
    __VLS_295.slots.default;
    const __VLS_296 = {}.QuestionFilled;
    /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
    // @ts-ignore
    const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({}));
    const __VLS_298 = __VLS_297({}, ...__VLS_functionalComponentArgsRest(__VLS_297));
    var __VLS_295;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.goToSampleManage(row.proposalNo);
            } },
        ...{ class: "val-link" },
    });
    (row.sampleCountDesc || '共【0/0/0】件');
    const __VLS_300 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
        ...{ class: "hint-icon" },
    }));
    const __VLS_302 = __VLS_301({
        ...{ class: "hint-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
    __VLS_303.slots.default;
    const __VLS_304 = {}.QuestionFilled;
    /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
    // @ts-ignore
    const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({}));
    const __VLS_306 = __VLS_305({}, ...__VLS_functionalComponentArgsRest(__VLS_305));
    var __VLS_303;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "val" },
    });
    (row.rdCost || '共【0】元');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "expand-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "todo-pipeline" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pipeline-node" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-tag" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-item" },
    });
    const __VLS_308 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
        ...{ 'onClick': {} },
        type: "primary",
        underline: (false),
        disabled: (row.status !== '待设计'),
    }));
    const __VLS_310 = __VLS_309({
        ...{ 'onClick': {} },
        type: "primary",
        underline: (false),
        disabled: (row.status !== '待设计'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_309));
    let __VLS_312;
    let __VLS_313;
    let __VLS_314;
    const __VLS_315 = {
        onClick: (...[$event]) => {
            row.status === '待设计' && __VLS_ctx.handleCreateTask(row);
        }
    };
    __VLS_311.slots.default;
    (row.status === '待设计' ? 1 : 0);
    var __VLS_311;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-item" },
    });
    const __VLS_316 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
        ...{ 'onClick': {} },
        type: "primary",
        underline: (false),
    }));
    const __VLS_318 = __VLS_317({
        ...{ 'onClick': {} },
        type: "primary",
        underline: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_317));
    let __VLS_320;
    let __VLS_321;
    let __VLS_322;
    const __VLS_323 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleCustomFeedback(row);
        }
    };
    __VLS_319.slots.default;
    (row.feedbackCount || 1);
    var __VLS_319;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pipeline-node" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-tag" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-item" },
    });
    const __VLS_324 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
        type: "primary",
        underline: (false),
    }));
    const __VLS_326 = __VLS_325({
        type: "primary",
        underline: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_325));
    __VLS_327.slots.default;
    var __VLS_327;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-item" },
    });
    const __VLS_328 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
        type: "primary",
        underline: (false),
    }));
    const __VLS_330 = __VLS_329({
        type: "primary",
        underline: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_329));
    __VLS_331.slots.default;
    var __VLS_331;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pipeline-node" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-tag" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "node-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-item" },
    });
    const __VLS_332 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
        type: "primary",
        underline: (false),
    }));
    const __VLS_334 = __VLS_333({
        type: "primary",
        underline: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_333));
    __VLS_335.slots.default;
    var __VLS_335;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "status-text" },
    });
    const __VLS_336 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
        ...{ class: "hint-icon" },
    }));
    const __VLS_338 = __VLS_337({
        ...{ class: "hint-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_337));
    __VLS_339.slots.default;
    const __VLS_340 = {}.QuestionFilled;
    /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
    // @ts-ignore
    const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({}));
    const __VLS_342 = __VLS_341({}, ...__VLS_functionalComponentArgsRest(__VLS_341));
    var __VLS_339;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-item" },
    });
    const __VLS_344 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
        type: "primary",
        underline: (false),
    }));
    const __VLS_346 = __VLS_345({
        type: "primary",
        underline: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_345));
    __VLS_347.slots.default;
    var __VLS_347;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "expand-section chart-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-legend" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "leg-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
        ...{ class: "dot blue" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "leg-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
        ...{ class: "dot green" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "leg-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.i, __VLS_intrinsicElements.i)({
        ...{ class: "dot yellow" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mock-chart" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "y-axis" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "chart-area" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid-line" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid-line" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid-line" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid-line" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid-line" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bars" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-group" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bars-inner" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar blue" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar green" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar yellow" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "label-bottom" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-group" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bars-inner" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar blue" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar green" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar yellow" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "label-bottom" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-group" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bars-inner" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar blue" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar green" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar yellow" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "label-bottom" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-group" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bars-inner" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar blue" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar green" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar-val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bar yellow" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "label-bottom" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mock-line-bg" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "y-axis-right" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
var __VLS_283;
const __VLS_348 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
    prop: "proposalNo",
    label: "提案编号",
    width: "120",
    fixed: true,
    className: "font-bold text-dark",
}));
const __VLS_350 = __VLS_349({
    prop: "proposalNo",
    label: "提案编号",
    width: "120",
    fixed: true,
    className: "font-bold text-dark",
}, ...__VLS_functionalComponentArgsRest(__VLS_349));
const __VLS_352 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
    prop: "platform",
    label: "平台",
    minWidth: "80",
    align: "center",
}));
const __VLS_354 = __VLS_353({
    prop: "platform",
    label: "平台",
    minWidth: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_353));
const __VLS_356 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
    label: "提案来源",
    minWidth: "100",
}));
const __VLS_358 = __VLS_357({
    label: "提案来源",
    minWidth: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_357));
__VLS_359.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_359.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_360 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
        type: "primary",
        underline: (false),
        ...{ class: "source-link" },
    }));
    const __VLS_362 = __VLS_361({
        type: "primary",
        underline: (false),
        ...{ class: "source-link" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_361));
    __VLS_363.slots.default;
    (row.source);
    var __VLS_363;
}
var __VLS_359;
const __VLS_364 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
    prop: "date",
    label: "立项日期",
    width: "95",
    align: "center",
}));
const __VLS_366 = __VLS_365({
    prop: "date",
    label: "立项日期",
    width: "95",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_365));
const __VLS_368 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
    label: "当前进度",
    width: "100",
    align: "center",
}));
const __VLS_370 = __VLS_369({
    label: "当前进度",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_369));
__VLS_371.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_371.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_372 = {}.ElPopover;
    /** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
        placement: "top",
        width: (220),
        trigger: "hover",
        popperClass: "modern-status-popover",
    }));
    const __VLS_374 = __VLS_373({
        placement: "top",
        width: (220),
        trigger: "hover",
        popperClass: "modern-status-popover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_373));
    __VLS_375.slots.default;
    {
        const { reference: __VLS_thisSlot } = __VLS_375.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "modern-status-wrap" },
        });
        const __VLS_376 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
            ...{ class: (['soft-tag', __VLS_ctx.getStatusClass(row.status)]) },
            size: "small",
        }));
        const __VLS_378 = __VLS_377({
            ...{ class: (['soft-tag', __VLS_ctx.getStatusClass(row.status)]) },
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_377));
        __VLS_379.slots.default;
        (row.status);
        var __VLS_379;
        if (row.hasBadge) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "modern-badge" },
            });
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "popover-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pop-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "value" },
    });
    (row.handler || '杨登峰');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "pop-row" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "value-box" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "highlight-red" },
    });
    (row.waitingDays || '2');
    var __VLS_375;
}
var __VLS_371;
const __VLS_380 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
    prop: "manager",
    label: "产品经理",
    minWidth: "85",
    align: "center",
}));
const __VLS_382 = __VLS_381({
    prop: "manager",
    label: "产品经理",
    minWidth: "85",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_381));
const __VLS_384 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({
    prop: "devMethod",
    label: "开发方式",
    minWidth: "110",
}));
const __VLS_386 = __VLS_385({
    prop: "devMethod",
    label: "开发方式",
    minWidth: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_385));
const __VLS_388 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
    prop: "level",
    label: "提案等级",
    width: "90",
    align: "center",
}));
const __VLS_390 = __VLS_389({
    prop: "level",
    label: "提案等级",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_389));
const __VLS_392 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
    prop: "launchTime",
    label: "上架时间",
    width: "100",
    align: "center",
}));
const __VLS_394 = __VLS_393({
    prop: "launchTime",
    label: "上架时间",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_393));
const __VLS_396 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({
    prop: "isResearched",
    label: "预调研",
    width: "70",
    align: "center",
}));
const __VLS_398 = __VLS_397({
    prop: "isResearched",
    label: "预调研",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_397));
const __VLS_400 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
    label: "预计结项日期",
    width: "130",
    align: "center",
}));
const __VLS_402 = __VLS_401({
    label: "预计结项日期",
    width: "130",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_401));
__VLS_403.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_403.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-hint" },
    });
    const __VLS_404 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_405 = __VLS_asFunctionalComponent(__VLS_404, new __VLS_404({}));
    const __VLS_406 = __VLS_405({}, ...__VLS_functionalComponentArgsRest(__VLS_405));
    __VLS_407.slots.default;
    const __VLS_408 = {}.InfoFilled;
    /** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
    // @ts-ignore
    const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({}));
    const __VLS_410 = __VLS_409({}, ...__VLS_functionalComponentArgsRest(__VLS_409));
    var __VLS_407;
}
{
    const { default: __VLS_thisSlot } = __VLS_403.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (row.estProposalDate);
}
var __VLS_403;
const __VLS_412 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
    prop: "actProposalDate",
    label: "实际结项",
    width: "110",
    align: "center",
    className: "text-secondary",
}));
const __VLS_414 = __VLS_413({
    prop: "actProposalDate",
    label: "实际结项",
    width: "110",
    align: "center",
    className: "text-secondary",
}, ...__VLS_functionalComponentArgsRest(__VLS_413));
const __VLS_416 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_417 = __VLS_asFunctionalComponent(__VLS_416, new __VLS_416({
    label: "新品开发进度",
    width: "120",
    align: "center",
}));
const __VLS_418 = __VLS_417({
    label: "新品开发进度",
    width: "120",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_417));
__VLS_419.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_419.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.devStatus) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "dev-progress-cell" },
        });
        (row.devStatus);
        const __VLS_420 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({
            ...{ class: "icon-success" },
        }));
        const __VLS_422 = __VLS_421({
            ...{ class: "icon-success" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_421));
        __VLS_423.slots.default;
        const __VLS_424 = {}.SuccessFilled;
        /** @type {[typeof __VLS_components.SuccessFilled, ]} */ ;
        // @ts-ignore
        const __VLS_425 = __VLS_asFunctionalComponent(__VLS_424, new __VLS_424({}));
        const __VLS_426 = __VLS_425({}, ...__VLS_functionalComponentArgsRest(__VLS_425));
        var __VLS_423;
    }
}
var __VLS_419;
const __VLS_428 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_429 = __VLS_asFunctionalComponent(__VLS_428, new __VLS_428({
    prop: "archiveTime",
    label: "归档时间",
    width: "110",
    align: "center",
    className: "text-secondary",
}));
const __VLS_430 = __VLS_429({
    prop: "archiveTime",
    label: "归档时间",
    width: "110",
    align: "center",
    className: "text-secondary",
}, ...__VLS_functionalComponentArgsRest(__VLS_429));
const __VLS_432 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_433 = __VLS_asFunctionalComponent(__VLS_432, new __VLS_432({
    prop: "archiveDesc",
    label: "归档说明",
    minWidth: "120",
    showOverflowTooltip: true,
}));
const __VLS_434 = __VLS_433({
    prop: "archiveDesc",
    label: "归档说明",
    minWidth: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_433));
const __VLS_436 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_437 = __VLS_asFunctionalComponent(__VLS_436, new __VLS_436({
    label: "操作",
    width: "100",
    fixed: "right",
    align: "center",
}));
const __VLS_438 = __VLS_437({
    label: "操作",
    width: "100",
    fixed: "right",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_437));
__VLS_439.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_439.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "action-cell" },
    });
    const __VLS_440 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_441 = __VLS_asFunctionalComponent(__VLS_440, new __VLS_440({
        ...{ 'onClick': {} },
        type: "primary",
        underline: (false),
        ...{ class: "action-link" },
    }));
    const __VLS_442 = __VLS_441({
        ...{ 'onClick': {} },
        type: "primary",
        underline: (false),
        ...{ class: "action-link" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_441));
    let __VLS_444;
    let __VLS_445;
    let __VLS_446;
    const __VLS_447 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDetail(row);
        }
    };
    __VLS_443.slots.default;
    var __VLS_443;
    const __VLS_448 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({
        direction: "vertical",
    }));
    const __VLS_450 = __VLS_449({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_449));
    const __VLS_452 = {}.ElDropdown;
    /** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
    // @ts-ignore
    const __VLS_453 = __VLS_asFunctionalComponent(__VLS_452, new __VLS_452({
        trigger: "click",
    }));
    const __VLS_454 = __VLS_453({
        trigger: "click",
    }, ...__VLS_functionalComponentArgsRest(__VLS_453));
    __VLS_455.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "dropdown-trigger" },
    });
    {
        const { dropdown: __VLS_thisSlot } = __VLS_455.slots;
        const __VLS_456 = {}.ElDropdownMenu;
        /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
        // @ts-ignore
        const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({}));
        const __VLS_458 = __VLS_457({}, ...__VLS_functionalComponentArgsRest(__VLS_457));
        __VLS_459.slots.default;
        const __VLS_460 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_461 = __VLS_asFunctionalComponent(__VLS_460, new __VLS_460({
            ...{ 'onClick': {} },
        }));
        const __VLS_462 = __VLS_461({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_461));
        let __VLS_464;
        let __VLS_465;
        let __VLS_466;
        const __VLS_467 = {
            onClick: (...[$event]) => {
                __VLS_ctx.handleEdit(row);
            }
        };
        __VLS_463.slots.default;
        var __VLS_463;
        const __VLS_468 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_469 = __VLS_asFunctionalComponent(__VLS_468, new __VLS_468({
            ...{ 'onClick': {} },
        }));
        const __VLS_470 = __VLS_469({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_469));
        let __VLS_472;
        let __VLS_473;
        let __VLS_474;
        const __VLS_475 = {
            onClick: (...[$event]) => {
                __VLS_ctx.handleCreateTask(row);
            }
        };
        __VLS_471.slots.default;
        var __VLS_471;
        const __VLS_476 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_477 = __VLS_asFunctionalComponent(__VLS_476, new __VLS_476({}));
        const __VLS_478 = __VLS_477({}, ...__VLS_functionalComponentArgsRest(__VLS_477));
        __VLS_479.slots.default;
        var __VLS_479;
        const __VLS_480 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_481 = __VLS_asFunctionalComponent(__VLS_480, new __VLS_480({}));
        const __VLS_482 = __VLS_481({}, ...__VLS_functionalComponentArgsRest(__VLS_481));
        __VLS_483.slots.default;
        var __VLS_483;
        const __VLS_484 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_485 = __VLS_asFunctionalComponent(__VLS_484, new __VLS_484({}));
        const __VLS_486 = __VLS_485({}, ...__VLS_functionalComponentArgsRest(__VLS_485));
        __VLS_487.slots.default;
        var __VLS_487;
        const __VLS_488 = {}.ElDropdownItem;
        /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
        // @ts-ignore
        const __VLS_489 = __VLS_asFunctionalComponent(__VLS_488, new __VLS_488({}));
        const __VLS_490 = __VLS_489({}, ...__VLS_functionalComponentArgsRest(__VLS_489));
        __VLS_491.slots.default;
        var __VLS_491;
        var __VLS_459;
    }
    var __VLS_455;
}
var __VLS_439;
var __VLS_271;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination-footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "footer-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-tip" },
});
const __VLS_492 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_493 = __VLS_asFunctionalComponent(__VLS_492, new __VLS_492({}));
const __VLS_494 = __VLS_493({}, ...__VLS_functionalComponentArgsRest(__VLS_493));
__VLS_495.slots.default;
const __VLS_496 = {}.InfoFilled;
/** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
// @ts-ignore
const __VLS_497 = __VLS_asFunctionalComponent(__VLS_496, new __VLS_496({}));
const __VLS_498 = __VLS_497({}, ...__VLS_functionalComponentArgsRest(__VLS_497));
var __VLS_495;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_500 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_501 = __VLS_asFunctionalComponent(__VLS_500, new __VLS_500({
    ...{ class: "mini-expand" },
}));
const __VLS_502 = __VLS_501({
    ...{ class: "mini-expand" },
}, ...__VLS_functionalComponentArgsRest(__VLS_501));
__VLS_503.slots.default;
const __VLS_504 = {}.ArrowRight;
/** @type {[typeof __VLS_components.ArrowRight, ]} */ ;
// @ts-ignore
const __VLS_505 = __VLS_asFunctionalComponent(__VLS_504, new __VLS_504({}));
const __VLS_506 = __VLS_505({}, ...__VLS_functionalComponentArgsRest(__VLS_505));
var __VLS_503;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "footer-right" },
});
const __VLS_508 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_509 = __VLS_asFunctionalComponent(__VLS_508, new __VLS_508({
    currentPage: (__VLS_ctx.currentPage),
    pageSize: (__VLS_ctx.pageSize),
    pageSizes: ([20, 50, 100]),
    layout: "prev, pager, next, sizes, jumper",
    total: (2292),
    background: true,
}));
const __VLS_510 = __VLS_509({
    currentPage: (__VLS_ctx.currentPage),
    pageSize: (__VLS_ctx.pageSize),
    pageSizes: ([20, 50, 100]),
    layout: "prev, pager, next, sizes, jumper",
    total: (2292),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_509));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "total-count" },
});
/** @type {[typeof DetailDrawer, ]} */ ;
// @ts-ignore
const __VLS_512 = __VLS_asFunctionalComponent(DetailDrawer, new DetailDrawer({
    modelValue: (__VLS_ctx.detailDrawerVisible),
    detailData: (__VLS_ctx.currentDetail),
}));
const __VLS_513 = __VLS_512({
    modelValue: (__VLS_ctx.detailDrawerVisible),
    detailData: (__VLS_ctx.currentDetail),
}, ...__VLS_functionalComponentArgsRest(__VLS_512));
/** @type {[typeof EditDialog, ]} */ ;
// @ts-ignore
const __VLS_515 = __VLS_asFunctionalComponent(EditDialog, new EditDialog({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.editDialogVisible),
    rowData: (__VLS_ctx.currentEditRow),
}));
const __VLS_516 = __VLS_515({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.editDialogVisible),
    rowData: (__VLS_ctx.currentEditRow),
}, ...__VLS_functionalComponentArgsRest(__VLS_515));
let __VLS_518;
let __VLS_519;
let __VLS_520;
const __VLS_521 = {
    onSave: (__VLS_ctx.handleSaveEdit)
};
var __VLS_517;
/** @type {[typeof CreateTaskDialog, ]} */ ;
// @ts-ignore
const __VLS_522 = __VLS_asFunctionalComponent(CreateTaskDialog, new CreateTaskDialog({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.createTaskDialogVisible),
    rowData: (__VLS_ctx.currentCreateTaskRow),
}));
const __VLS_523 = __VLS_522({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.createTaskDialogVisible),
    rowData: (__VLS_ctx.currentCreateTaskRow),
}, ...__VLS_functionalComponentArgsRest(__VLS_522));
let __VLS_525;
let __VLS_526;
let __VLS_527;
const __VLS_528 = {
    onSave: (__VLS_ctx.handleSaveCreateTask)
};
var __VLS_524;
/** @type {[typeof CustomFeedbackDetailDialog, ]} */ ;
// @ts-ignore
const __VLS_529 = __VLS_asFunctionalComponent(CustomFeedbackDetailDialog, new CustomFeedbackDetailDialog({
    ref: "customFeedbackDetailDialogRef",
}));
const __VLS_530 = __VLS_529({
    ref: "customFeedbackDetailDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_529));
/** @type {typeof __VLS_ctx.customFeedbackDetailDialogRef} */ ;
var __VLS_532 = {};
var __VLS_531;
/** @type {__VLS_StyleScopedClasses['page-container']} */ ;
/** @type {__VLS_StyleScopedClasses['compact-stat-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['modern-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-title']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-list']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['count']} */ ;
/** @type {__VLS_StyleScopedClasses['search-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['modern-card']} */ ;
/** @type {__VLS_StyleScopedClasses['search-form']} */ ;
/** @type {__VLS_StyleScopedClasses['composite-picker']} */ ;
/** @type {__VLS_StyleScopedClasses['type-select']} */ ;
/** @type {__VLS_StyleScopedClasses['search-keyword']} */ ;
/** @type {__VLS_StyleScopedClasses['input-suffix-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['search-btn-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-menu']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-search-container']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-clear']} */ ;
/** @type {__VLS_StyleScopedClasses['right-btns']} */ ;
/** @type {__VLS_StyleScopedClasses['search-btns']} */ ;
/** @type {__VLS_StyleScopedClasses['action-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['tool-group']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['modern-card']} */ ;
/** @type {__VLS_StyleScopedClasses['expand-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['expand-column-left']} */ ;
/** @type {__VLS_StyleScopedClasses['expand-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['info-list']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['val-link']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['expand-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['todo-pipeline']} */ ;
/** @type {__VLS_StyleScopedClasses['pipeline-node']} */ ;
/** @type {__VLS_StyleScopedClasses['node-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['node-content']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['pipeline-node']} */ ;
/** @type {__VLS_StyleScopedClasses['node-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['node-content']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['pipeline-node']} */ ;
/** @type {__VLS_StyleScopedClasses['node-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['node-content']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['status-text']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['expand-section']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-container']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-legend']} */ ;
/** @type {__VLS_StyleScopedClasses['leg-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['leg-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['leg-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['yellow']} */ ;
/** @type {__VLS_StyleScopedClasses['mock-chart']} */ ;
/** @type {__VLS_StyleScopedClasses['y-axis']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-area']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-line']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-line']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-line']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-line']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-line']} */ ;
/** @type {__VLS_StyleScopedClasses['bars']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-group']} */ ;
/** @type {__VLS_StyleScopedClasses['bars-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-item']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-val']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-item']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-val']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-item']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-val']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['yellow']} */ ;
/** @type {__VLS_StyleScopedClasses['label-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-group']} */ ;
/** @type {__VLS_StyleScopedClasses['bars-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-item']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-val']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-item']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-val']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-item']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-val']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['yellow']} */ ;
/** @type {__VLS_StyleScopedClasses['label-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-group']} */ ;
/** @type {__VLS_StyleScopedClasses['bars-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-item']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-val']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-item']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-val']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-item']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-val']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['yellow']} */ ;
/** @type {__VLS_StyleScopedClasses['label-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-group']} */ ;
/** @type {__VLS_StyleScopedClasses['bars-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-item']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-val']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-item']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-val']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-item']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-val']} */ ;
/** @type {__VLS_StyleScopedClasses['bar']} */ ;
/** @type {__VLS_StyleScopedClasses['yellow']} */ ;
/** @type {__VLS_StyleScopedClasses['label-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['mock-line-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['y-axis-right']} */ ;
/** @type {__VLS_StyleScopedClasses['source-link']} */ ;
/** @type {__VLS_StyleScopedClasses['modern-status-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['modern-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['popover-content']} */ ;
/** @type {__VLS_StyleScopedClasses['pop-row']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['pop-row']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value-box']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight-red']} */ ;
/** @type {__VLS_StyleScopedClasses['header-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['dev-progress-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-success']} */ ;
/** @type {__VLS_StyleScopedClasses['action-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['action-link']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-left']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-expand']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-right']} */ ;
/** @type {__VLS_StyleScopedClasses['total-count']} */ ;
// @ts-ignore
var __VLS_533 = __VLS_532;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DetailDrawer: DetailDrawer,
            EditDialog: EditDialog,
            CreateTaskDialog: CreateTaskDialog,
            CustomFeedbackDetailDialog: CustomFeedbackDetailDialog,
            tableContainerRef: tableContainerRef,
            tableHeight: tableHeight,
            activeStat: activeStat,
            editDialogVisible: editDialogVisible,
            currentEditRow: currentEditRow,
            handleEdit: handleEdit,
            handleSaveEdit: handleSaveEdit,
            createTaskDialogVisible: createTaskDialogVisible,
            currentCreateTaskRow: currentCreateTaskRow,
            customFeedbackDetailDialogRef: customFeedbackDetailDialogRef,
            handleCreateTask: handleCreateTask,
            handleCustomFeedback: handleCustomFeedback,
            handleSaveCreateTask: handleSaveCreateTask,
            goToSampleManage: goToSampleManage,
            currentPage: currentPage,
            pageSize: pageSize,
            expandedRowKeys: expandedRowKeys,
            detailDrawerVisible: detailDrawerVisible,
            currentDetail: currentDetail,
            handleDetail: handleDetail,
            handleExpandChange: handleExpandChange,
            statTabs: statTabs,
            queryParams: queryParams,
            batchSearchVisible: batchSearchVisible,
            batchSearchValue: batchSearchValue,
            handleBatchSearch: handleBatchSearch,
            clearBatchSearch: clearBatchSearch,
            tableData: tableData,
            getStatCount: getStatCount,
            handleStatClick: handleStatClick,
            getStatusClass: getStatusClass,
            getStatusColor: getStatusColor,
            handleQuery: handleQuery,
            handleRefresh: handleRefresh,
            resetQuery: resetQuery,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=manage.vue.js.map