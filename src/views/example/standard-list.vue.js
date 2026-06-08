/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { reactive, ref, onMounted } from 'vue';
import { useTableHeightById } from '@/hooks/useTableHeight';
const queryForm = reactive({
    keyword: '',
    status: '',
    refreshCount: 0
});
const pager = reactive({
    pageNo: 1,
    pageSize: 20,
    total: 0
});
const loading = ref(false);
const tableData = ref([]);
const selectedRows = ref([]);
const { tableHeight } = useTableHeightById(null, 0); // Placeholder for demo
const handleSearch = () => {
    queryForm.refreshCount++;
    getPage();
};
const resetQuery = () => {
    queryForm.keyword = '';
    queryForm.status = '';
    handleSearch();
};
const getPage = () => {
    loading.value = true;
    // Mock API call
    setTimeout(() => {
        tableData.value = [
            { id: 1, name: '示例数据 1', code: 'CODE_001', status: '1', updateTime: '2026-04-22 10:00:00' },
            { id: 2, name: '示例数据 2', code: 'CODE_002', status: '0', updateTime: '2026-04-22 11:00:00' },
        ];
        pager.total = 2;
        loading.value = false;
    }, 500);
};
const handlePageChange = ({ currentPage, pageSize }) => {
    pager.pageNo = currentPage;
    pager.pageSize = pageSize;
    getPage();
};
const handleSelectionChange = ({ records }) => {
    selectedRows.value = records;
};
onMounted(() => {
    getPage();
    // Correctly link table height
    const tableEl = document.getElementById('mainTable');
    if (tableEl) {
        const { tableHeight: h } = useTableHeightById(tableEl, 0);
        // In a real project, we'd use a more robust way to sync this
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "standard-list-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "query-card" },
});
const __VLS_0 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    model: (__VLS_ctx.queryForm),
    inline: true,
    ...{ class: "non-check-form" },
    size: "small",
}));
const __VLS_2 = __VLS_1({
    model: (__VLS_ctx.queryForm),
    inline: true,
    ...{ class: "non-check-form" },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    label: "关键词",
}));
const __VLS_6 = __VLS_5({
    label: "关键词",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    modelValue: (__VLS_ctx.queryForm.keyword),
    placeholder: "请输入关键词",
    clearable: true,
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.queryForm.keyword),
    placeholder: "请输入关键词",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_7;
const __VLS_12 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    label: "状态",
}));
const __VLS_14 = __VLS_13({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.queryForm.status),
    placeholder: "请选择",
    ...{ style: {} },
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.queryForm.status),
    placeholder: "请选择",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    label: "全部",
    value: "",
}));
const __VLS_22 = __VLS_21({
    label: "全部",
    value: "",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "启用",
    value: "1",
}));
const __VLS_26 = __VLS_25({
    label: "启用",
    value: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "禁用",
    value: "0",
}));
const __VLS_30 = __VLS_29({
    label: "禁用",
    value: "0",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
var __VLS_19;
var __VLS_15;
const __VLS_32 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onClick: (__VLS_ctx.handleSearch)
};
__VLS_39.slots.default;
var __VLS_39;
const __VLS_44 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onClick: (__VLS_ctx.resetQuery)
};
__VLS_47.slots.default;
var __VLS_47;
var __VLS_35;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ak-operate-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ak-operate-section" },
});
const __VLS_52 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    type: "primary",
    icon: "Plus",
    size: "small",
}));
const __VLS_54 = __VLS_53({
    type: "primary",
    icon: "Plus",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
var __VLS_55;
const __VLS_56 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    type: "danger",
    icon: "Delete",
    size: "small",
    disabled: (!__VLS_ctx.selectedRows.length),
}));
const __VLS_58 = __VLS_57({
    type: "danger",
    icon: "Delete",
    size: "small",
    disabled: (!__VLS_ctx.selectedRows.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
var __VLS_59;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "ak-table-btn" },
});
const __VLS_60 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    ...{ 'onClick': {} },
    icon: "Refresh",
    circle: true,
    size: "small",
}));
const __VLS_62 = __VLS_61({
    ...{ 'onClick': {} },
    icon: "Refresh",
    circle: true,
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
let __VLS_64;
let __VLS_65;
let __VLS_66;
const __VLS_67 = {
    onClick: (__VLS_ctx.handleSearch)
};
var __VLS_63;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "table-card" },
    id: "mainTable",
});
const __VLS_68 = {}.VxeTable;
/** @type {[typeof __VLS_components.VxeTable, typeof __VLS_components.vxeTable, typeof __VLS_components.VxeTable, typeof __VLS_components.vxeTable, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    ...{ 'onCheckboxChange': {} },
    ...{ 'onCheckboxAll': {} },
    border: true,
    showOverflow: true,
    keepSource: true,
    size: "mini",
    loading: (__VLS_ctx.loading),
    data: (__VLS_ctx.tableData),
    height: (__VLS_ctx.tableHeight),
}));
const __VLS_70 = __VLS_69({
    ...{ 'onCheckboxChange': {} },
    ...{ 'onCheckboxAll': {} },
    border: true,
    showOverflow: true,
    keepSource: true,
    size: "mini",
    loading: (__VLS_ctx.loading),
    data: (__VLS_ctx.tableData),
    height: (__VLS_ctx.tableHeight),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_72;
let __VLS_73;
let __VLS_74;
const __VLS_75 = {
    onCheckboxChange: (__VLS_ctx.handleSelectionChange)
};
const __VLS_76 = {
    onCheckboxAll: (__VLS_ctx.handleSelectionChange)
};
__VLS_71.slots.default;
const __VLS_77 = {}.VxeColumn;
/** @type {[typeof __VLS_components.VxeColumn, typeof __VLS_components.vxeColumn, typeof __VLS_components.VxeColumn, typeof __VLS_components.vxeColumn, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    type: "checkbox",
    width: "40",
    fixed: "left",
}));
const __VLS_79 = __VLS_78({
    type: "checkbox",
    width: "40",
    fixed: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
const __VLS_81 = {}.VxeColumn;
/** @type {[typeof __VLS_components.VxeColumn, typeof __VLS_components.vxeColumn, typeof __VLS_components.VxeColumn, typeof __VLS_components.vxeColumn, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    type: "seq",
    title: "序号",
    width: "60",
    fixed: "left",
}));
const __VLS_83 = __VLS_82({
    type: "seq",
    title: "序号",
    width: "60",
    fixed: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
const __VLS_85 = {}.VxeColumn;
/** @type {[typeof __VLS_components.VxeColumn, typeof __VLS_components.vxeColumn, typeof __VLS_components.VxeColumn, typeof __VLS_components.vxeColumn, ]} */ ;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
    field: "name",
    title: "名称",
    minWidth: "150",
}));
const __VLS_87 = __VLS_86({
    field: "name",
    title: "名称",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
const __VLS_89 = {}.VxeColumn;
/** @type {[typeof __VLS_components.VxeColumn, typeof __VLS_components.vxeColumn, typeof __VLS_components.VxeColumn, typeof __VLS_components.vxeColumn, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    field: "code",
    title: "编码",
    width: "120",
}));
const __VLS_91 = __VLS_90({
    field: "code",
    title: "编码",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
const __VLS_93 = {}.VxeColumn;
/** @type {[typeof __VLS_components.VxeColumn, typeof __VLS_components.vxeColumn, typeof __VLS_components.VxeColumn, typeof __VLS_components.vxeColumn, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    field: "status",
    title: "状态",
    width: "100",
}));
const __VLS_95 = __VLS_94({
    field: "status",
    title: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
__VLS_96.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_96.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_97 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
        type: (row.status === '1' ? 'success' : 'info'),
        size: "small",
    }));
    const __VLS_99 = __VLS_98({
        type: (row.status === '1' ? 'success' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    __VLS_100.slots.default;
    (row.status === '1' ? '启用' : '禁用');
    var __VLS_100;
}
var __VLS_96;
const __VLS_101 = {}.VxeColumn;
/** @type {[typeof __VLS_components.VxeColumn, typeof __VLS_components.vxeColumn, typeof __VLS_components.VxeColumn, typeof __VLS_components.vxeColumn, ]} */ ;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
    field: "updateTime",
    title: "更新时间",
    width: "160",
}));
const __VLS_103 = __VLS_102({
    field: "updateTime",
    title: "更新时间",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
const __VLS_105 = {}.VxeColumn;
/** @type {[typeof __VLS_components.VxeColumn, typeof __VLS_components.vxeColumn, typeof __VLS_components.VxeColumn, typeof __VLS_components.vxeColumn, ]} */ ;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
    title: "操作",
    width: "150",
    fixed: "right",
}));
const __VLS_107 = __VLS_106({
    title: "操作",
    width: "150",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
__VLS_108.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_108.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_109 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
        type: "primary",
        link: true,
        size: "small",
    }));
    const __VLS_111 = __VLS_110({
        type: "primary",
        link: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    __VLS_112.slots.default;
    var __VLS_112;
    const __VLS_113 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
        type: "danger",
        link: true,
        size: "small",
    }));
    const __VLS_115 = __VLS_114({
        type: "danger",
        link: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    __VLS_116.slots.default;
    var __VLS_116;
}
var __VLS_108;
var __VLS_71;
const __VLS_117 = {}.VxePager;
/** @type {[typeof __VLS_components.VxePager, typeof __VLS_components.vxePager, typeof __VLS_components.VxePager, typeof __VLS_components.vxePager, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    ...{ 'onPageChange': {} },
    currentPage: (__VLS_ctx.pager.pageNo),
    pageSize: (__VLS_ctx.pager.pageSize),
    total: (__VLS_ctx.pager.total),
    layouts: (['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']),
}));
const __VLS_119 = __VLS_118({
    ...{ 'onPageChange': {} },
    currentPage: (__VLS_ctx.pager.pageNo),
    pageSize: (__VLS_ctx.pager.pageSize),
    total: (__VLS_ctx.pager.total),
    layouts: (['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']),
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
let __VLS_121;
let __VLS_122;
let __VLS_123;
const __VLS_124 = {
    onPageChange: (__VLS_ctx.handlePageChange)
};
var __VLS_120;
/** @type {__VLS_StyleScopedClasses['standard-list-container']} */ ;
/** @type {__VLS_StyleScopedClasses['query-card']} */ ;
/** @type {__VLS_StyleScopedClasses['non-check-form']} */ ;
/** @type {__VLS_StyleScopedClasses['ak-operate-container']} */ ;
/** @type {__VLS_StyleScopedClasses['ak-operate-section']} */ ;
/** @type {__VLS_StyleScopedClasses['ak-table-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['table-card']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            queryForm: queryForm,
            pager: pager,
            loading: loading,
            tableData: tableData,
            selectedRows: selectedRows,
            tableHeight: tableHeight,
            handleSearch: handleSearch,
            resetQuery: resetQuery,
            handlePageChange: handlePageChange,
            handleSelectionChange: handleSelectionChange,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=standard-list.vue.js.map