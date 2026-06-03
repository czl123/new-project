/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue';
const visible = ref(false);
const formRef = ref(null);
const createEmptyItem = () => ({
    id: Date.now() + Math.random().toString(36).substring(2, 9),
    source: '',
    feeType: 'mold_fee',
    moldFee: '',
    moldOwnership: 'company',
    isRefundable: false,
    refundType: '',
    refundCondition: '',
    customTime: '',
    initialQuote: '',
    productionCycle: '',
    moq: '',
    additionalNotes: ''
});
const refundDescriptions = {
    first_order: '首单达到起订量即可退回费用',
    order_volume: '订单量累计达到设定数量后退回',
    order_amount: '订单金额累计达到设定金额后退回'
};
const form = ref({
    items: [createEmptyItem()]
});
const activeTab = ref(form.value.items[0].id);
const open = () => {
    visible.value = true;
    const initialItem = createEmptyItem();
    form.value.items = [initialItem];
    activeTab.value = initialItem.id;
};
const addItem = () => {
    const newItem = createEmptyItem();
    form.value.items.push(newItem);
    activeTab.value = newItem.id;
};
const removeItemByTab = (targetName) => {
    const items = form.value.items;
    if (items.length <= 1)
        return;
    const index = items.findIndex(item => item.id === targetName);
    if (index === -1)
        return;
    ElMessageBox.confirm('确定要删除该反馈方案吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'small'
    }).then(() => {
        items.splice(index, 1);
        if (activeTab.value === targetName) {
            activeTab.value = items[Math.max(0, index - 1)].id;
        }
        ElMessage.success('方案已删除');
    }).catch(() => { });
};
const handleSave = () => {
    ElMessage.success('保存成功');
    visible.value = false;
};
const handleSubmit = async () => {
    if (!formRef.value)
        return;
    await formRef.value.validate((valid) => {
        if (valid) {
            ElMessage.success(`成功提交 ${form.value.items.length} 个反馈方案`);
            visible.value = false;
        }
        else {
            ElMessage.warning('请完善必填信息');
        }
    });
};
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-form-item__label']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    title: "定制反馈",
    width: "1100px",
    ...{ class: "custom-feedback-dialog" },
    destroyOnClose: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    title: "定制反馈",
    width: "1100px",
    ...{ class: "custom-feedback-dialog" },
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feedback-instruction" },
});
const __VLS_5 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    ...{ class: "mr-8" },
}));
const __VLS_7 = __VLS_6({
    ...{ class: "mr-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
const __VLS_9 = {}.InfoFilled;
/** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
var __VLS_8;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feedback-content" },
});
const __VLS_13 = {}.ElTabs;
/** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ...{ 'onTabAdd': {} },
    ...{ 'onTabRemove': {} },
    modelValue: (__VLS_ctx.activeTab),
    type: "border-card",
    addable: true,
    ...{ class: "feedback-tabs" },
}));
const __VLS_15 = __VLS_14({
    ...{ 'onTabAdd': {} },
    ...{ 'onTabRemove': {} },
    modelValue: (__VLS_ctx.activeTab),
    type: "border-card",
    addable: true,
    ...{ class: "feedback-tabs" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_17;
let __VLS_18;
let __VLS_19;
const __VLS_20 = {
    onTabAdd: (__VLS_ctx.addItem)
};
const __VLS_21 = {
    onTabRemove: (__VLS_ctx.removeItemByTab)
};
__VLS_16.slots.default;
for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.form.items))) {
    const __VLS_22 = {}.ElTabPane;
    /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
        key: (item.id),
        label: ('反馈方案 ' + (index + 1)),
        name: (item.id),
        closable: (__VLS_ctx.form.items.length > 1),
    }));
    const __VLS_24 = __VLS_23({
        key: (item.id),
        label: ('反馈方案 ' + (index + 1)),
        name: (item.id),
        closable: (__VLS_ctx.form.items.length > 1),
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    __VLS_25.slots.default;
    const __VLS_26 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
        model: (__VLS_ctx.form),
        ref: "formRef",
        labelPosition: "left",
        labelWidth: "100px",
        ...{ class: "feedback-form custom-form" },
    }));
    const __VLS_28 = __VLS_27({
        model: (__VLS_ctx.form),
        ref: "formRef",
        labelPosition: "left",
        labelWidth: "100px",
        ...{ class: "feedback-form custom-form" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    /** @type {typeof __VLS_ctx.formRef} */ ;
    var __VLS_30 = {};
    __VLS_29.slots.default;
    const __VLS_32 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        gutter: (24),
    }));
    const __VLS_34 = __VLS_33({
        gutter: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    const __VLS_36 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        span: (6),
    }));
    const __VLS_38 = __VLS_37({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    const __VLS_40 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        label: "货源地",
        required: true,
        prop: ('items.' + index + '.source'),
        rules: ({ required: true, message: '请选择货源地', trigger: 'change' }),
    }));
    const __VLS_42 = __VLS_41({
        label: "货源地",
        required: true,
        prop: ('items.' + index + '.source'),
        rules: ({ required: true, message: '请选择货源地', trigger: 'change' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    const __VLS_44 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        modelValue: (item.source),
        placeholder: "请选择",
        clearable: true,
        ...{ class: "w-full" },
    }));
    const __VLS_46 = __VLS_45({
        modelValue: (item.source),
        placeholder: "请选择",
        clearable: true,
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    const __VLS_48 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        label: "国内",
        value: "domestic",
    }));
    const __VLS_50 = __VLS_49({
        label: "国内",
        value: "domestic",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    const __VLS_52 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        label: "国外",
        value: "overseas",
    }));
    const __VLS_54 = __VLS_53({
        label: "国外",
        value: "overseas",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    var __VLS_47;
    var __VLS_43;
    var __VLS_39;
    const __VLS_56 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        span: (6),
    }));
    const __VLS_58 = __VLS_57({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    const __VLS_60 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        label: "费用类型",
        required: true,
        prop: ('items.' + index + '.feeType'),
        rules: ({ required: true, message: '请选择费用类型', trigger: 'change' }),
    }));
    const __VLS_62 = __VLS_61({
        label: "费用类型",
        required: true,
        prop: ('items.' + index + '.feeType'),
        rules: ({ required: true, message: '请选择费用类型', trigger: 'change' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    const __VLS_64 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        modelValue: (item.feeType),
        placeholder: "请选择",
        ...{ class: "w-full" },
    }));
    const __VLS_66 = __VLS_65({
        modelValue: (item.feeType),
        placeholder: "请选择",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    const __VLS_68 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        label: "开模费",
        value: "mold_fee",
    }));
    const __VLS_70 = __VLS_69({
        label: "开模费",
        value: "mold_fee",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    const __VLS_72 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        label: "打样费",
        value: "sample_fee",
    }));
    const __VLS_74 = __VLS_73({
        label: "打样费",
        value: "sample_fee",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    var __VLS_67;
    var __VLS_63;
    var __VLS_59;
    const __VLS_76 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        span: (6),
    }));
    const __VLS_78 = __VLS_77({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    __VLS_79.slots.default;
    const __VLS_80 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        label: "费用金额",
        required: true,
        prop: ('items.' + index + '.moldFee'),
        rules: ({ required: true, message: '请输入', trigger: 'blur' }),
    }));
    const __VLS_82 = __VLS_81({
        label: "费用金额",
        required: true,
        prop: ('items.' + index + '.moldFee'),
        rules: ({ required: true, message: '请输入', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    const __VLS_84 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        modelValue: (item.moldFee),
        placeholder: "请输入",
    }));
    const __VLS_86 = __VLS_85({
        modelValue: (item.moldFee),
        placeholder: "请输入",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    var __VLS_83;
    var __VLS_79;
    if (item.feeType === 'mold_fee') {
        const __VLS_88 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
            span: (6),
        }));
        const __VLS_90 = __VLS_89({
            span: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        __VLS_91.slots.default;
        const __VLS_92 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
            label: "模具归属",
            required: true,
            prop: ('items.' + index + '.moldOwnership'),
            rules: ({ required: true, message: '请选择模具归属', trigger: 'change' }),
        }));
        const __VLS_94 = __VLS_93({
            label: "模具归属",
            required: true,
            prop: ('items.' + index + '.moldOwnership'),
            rules: ({ required: true, message: '请选择模具归属', trigger: 'change' }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_93));
        __VLS_95.slots.default;
        const __VLS_96 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
            modelValue: (item.moldOwnership),
            placeholder: "请选择",
            ...{ class: "w-full" },
        }));
        const __VLS_98 = __VLS_97({
            modelValue: (item.moldOwnership),
            placeholder: "请选择",
            ...{ class: "w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        __VLS_99.slots.default;
        const __VLS_100 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
            label: "共有",
            value: "joint",
        }));
        const __VLS_102 = __VLS_101({
            label: "共有",
            value: "joint",
        }, ...__VLS_functionalComponentArgsRest(__VLS_101));
        const __VLS_104 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
            label: "公司",
            value: "company",
        }));
        const __VLS_106 = __VLS_105({
            label: "公司",
            value: "company",
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        const __VLS_108 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
            label: "供应商",
            value: "supplier",
        }));
        const __VLS_110 = __VLS_109({
            label: "供应商",
            value: "supplier",
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        var __VLS_99;
        var __VLS_95;
        var __VLS_91;
    }
    var __VLS_35;
    const __VLS_112 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        gutter: (24),
    }));
    const __VLS_114 = __VLS_113({
        gutter: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_115.slots.default;
    const __VLS_116 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        span: (6),
    }));
    const __VLS_118 = __VLS_117({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    __VLS_119.slots.default;
    const __VLS_120 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
        label: "定制用时",
        required: true,
        prop: ('items.' + index + '.customTime'),
        rules: ({ required: true, message: '请输入', trigger: 'blur' }),
    }));
    const __VLS_122 = __VLS_121({
        label: "定制用时",
        required: true,
        prop: ('items.' + index + '.customTime'),
        rules: ({ required: true, message: '请输入', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    __VLS_123.slots.default;
    const __VLS_124 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        modelValue: (item.customTime),
        placeholder: "请输入",
    }));
    const __VLS_126 = __VLS_125({
        modelValue: (item.customTime),
        placeholder: "请输入",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    __VLS_127.slots.default;
    {
        const { append: __VLS_thisSlot } = __VLS_127.slots;
    }
    var __VLS_127;
    var __VLS_123;
    var __VLS_119;
    const __VLS_128 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
        span: (6),
    }));
    const __VLS_130 = __VLS_129({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    __VLS_131.slots.default;
    const __VLS_132 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
        label: "初次报价",
        required: true,
        prop: ('items.' + index + '.initialQuote'),
        rules: ({ required: true, message: '请输入', trigger: 'blur' }),
    }));
    const __VLS_134 = __VLS_133({
        label: "初次报价",
        required: true,
        prop: ('items.' + index + '.initialQuote'),
        rules: ({ required: true, message: '请输入', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    const __VLS_136 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        modelValue: (item.initialQuote),
        placeholder: "请输入",
    }));
    const __VLS_138 = __VLS_137({
        modelValue: (item.initialQuote),
        placeholder: "请输入",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    {
        const { append: __VLS_thisSlot } = __VLS_139.slots;
    }
    var __VLS_139;
    var __VLS_135;
    var __VLS_131;
    const __VLS_140 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        span: (6),
    }));
    const __VLS_142 = __VLS_141({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    const __VLS_144 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        label: "生产周期",
        required: true,
        prop: ('items.' + index + '.productionCycle'),
        rules: ({ required: true, message: '请输入', trigger: 'blur' }),
    }));
    const __VLS_146 = __VLS_145({
        label: "生产周期",
        required: true,
        prop: ('items.' + index + '.productionCycle'),
        rules: ({ required: true, message: '请输入', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    const __VLS_148 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        modelValue: (item.productionCycle),
        placeholder: "请输入",
    }));
    const __VLS_150 = __VLS_149({
        modelValue: (item.productionCycle),
        placeholder: "请输入",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    {
        const { append: __VLS_thisSlot } = __VLS_151.slots;
    }
    var __VLS_151;
    var __VLS_147;
    var __VLS_143;
    const __VLS_152 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        span: (6),
    }));
    const __VLS_154 = __VLS_153({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    __VLS_155.slots.default;
    const __VLS_156 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        label: "起订量",
        required: true,
        prop: ('items.' + index + '.moq'),
        rules: ({ required: true, message: '请输入', trigger: 'blur' }),
    }));
    const __VLS_158 = __VLS_157({
        label: "起订量",
        required: true,
        prop: ('items.' + index + '.moq'),
        rules: ({ required: true, message: '请输入', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_159.slots.default;
    const __VLS_160 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        modelValue: (item.moq),
        placeholder: "请输入",
    }));
    const __VLS_162 = __VLS_161({
        modelValue: (item.moq),
        placeholder: "请输入",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    var __VLS_159;
    var __VLS_155;
    var __VLS_115;
    const __VLS_164 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        gutter: (24),
    }));
    const __VLS_166 = __VLS_165({
        gutter: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    __VLS_167.slots.default;
    const __VLS_168 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        span: (6),
    }));
    const __VLS_170 = __VLS_169({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    const __VLS_172 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
        ...{ class: "refundable-item" },
    }));
    const __VLS_174 = __VLS_173({
        ...{ class: "refundable-item" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    __VLS_175.slots.default;
    {
        const { label: __VLS_thisSlot } = __VLS_175.slots;
        const __VLS_176 = {}.ElCheckbox;
        /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            modelValue: (item.isRefundable),
        }));
        const __VLS_178 = __VLS_177({
            modelValue: (item.isRefundable),
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        __VLS_179.slots.default;
        var __VLS_179;
    }
    var __VLS_175;
    var __VLS_171;
    if (item.isRefundable) {
        const __VLS_180 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
            span: (6),
        }));
        const __VLS_182 = __VLS_181({
            span: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_181));
        __VLS_183.slots.default;
        const __VLS_184 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
            label: "退款方式",
            required: true,
        }));
        const __VLS_186 = __VLS_185({
            label: "退款方式",
            required: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_185));
        __VLS_187.slots.default;
        const __VLS_188 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
            modelValue: (item.refundType),
            placeholder: "请选择",
            ...{ class: "w-full" },
        }));
        const __VLS_190 = __VLS_189({
            modelValue: (item.refundType),
            placeholder: "请选择",
            ...{ class: "w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
        __VLS_191.slots.default;
        const __VLS_192 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
            label: "首单退款",
            value: "first_order",
        }));
        const __VLS_194 = __VLS_193({
            label: "首单退款",
            value: "first_order",
        }, ...__VLS_functionalComponentArgsRest(__VLS_193));
        const __VLS_196 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
            label: "订单量退款",
            value: "order_volume",
        }));
        const __VLS_198 = __VLS_197({
            label: "订单量退款",
            value: "order_volume",
        }, ...__VLS_functionalComponentArgsRest(__VLS_197));
        const __VLS_200 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
            label: "订单金额退款",
            value: "order_amount",
        }));
        const __VLS_202 = __VLS_201({
            label: "订单金额退款",
            value: "order_amount",
        }, ...__VLS_functionalComponentArgsRest(__VLS_201));
        var __VLS_191;
        var __VLS_187;
        var __VLS_183;
        const __VLS_204 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
            span: (6),
        }));
        const __VLS_206 = __VLS_205({
            span: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
        __VLS_207.slots.default;
        const __VLS_208 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
            label: "退款条件",
            required: true,
            prop: ('items.' + index + '.refundCondition'),
            rules: ([
                { required: ['order_volume', 'order_amount'].includes(item.refundType), message: '请输入退款条件', trigger: 'blur' }
            ]),
        }));
        const __VLS_210 = __VLS_209({
            label: "退款条件",
            required: true,
            prop: ('items.' + index + '.refundCondition'),
            rules: ([
                { required: ['order_volume', 'order_amount'].includes(item.refundType), message: '请输入退款条件', trigger: 'blur' }
            ]),
        }, ...__VLS_functionalComponentArgsRest(__VLS_209));
        __VLS_211.slots.default;
        const __VLS_212 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
            modelValue: (item.refundCondition),
            placeholder: "请输入",
            ...{ class: "w-full" },
        }));
        const __VLS_214 = __VLS_213({
            modelValue: (item.refundCondition),
            placeholder: "请输入",
            ...{ class: "w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
        var __VLS_211;
        var __VLS_207;
        const __VLS_216 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
            span: (6),
        }));
        const __VLS_218 = __VLS_217({
            span: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_217));
        __VLS_219.slots.default;
        if (item.refundType) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "refund-tip-wrapper" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "refund-tip" },
            });
            const __VLS_220 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
                ...{ class: "mr-4" },
            }));
            const __VLS_222 = __VLS_221({
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_221));
            __VLS_223.slots.default;
            const __VLS_224 = {}.InfoFilled;
            /** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
            // @ts-ignore
            const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({}));
            const __VLS_226 = __VLS_225({}, ...__VLS_functionalComponentArgsRest(__VLS_225));
            var __VLS_223;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.refundDescriptions[item.refundType]);
        }
        var __VLS_219;
    }
    var __VLS_167;
    const __VLS_228 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
        label: "附加条件",
    }));
    const __VLS_230 = __VLS_229({
        label: "附加条件",
    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
    __VLS_231.slots.default;
    const __VLS_232 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
        modelValue: (item.additionalNotes),
        type: "textarea",
        rows: (3),
        placeholder: "请输入方案特殊说明",
        maxlength: "500",
        showWordLimit: true,
    }));
    const __VLS_234 = __VLS_233({
        modelValue: (item.additionalNotes),
        type: "textarea",
        rows: (3),
        placeholder: "请输入方案特殊说明",
        maxlength: "500",
        showWordLimit: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_233));
    var __VLS_231;
    var __VLS_29;
    var __VLS_25;
}
var __VLS_16;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "footer-left" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "batch-info" },
    });
    (__VLS_ctx.form.items.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "footer-right" },
    });
    const __VLS_236 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
        ...{ 'onClick': {} },
    }));
    const __VLS_238 = __VLS_237({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
    let __VLS_240;
    let __VLS_241;
    let __VLS_242;
    const __VLS_243 = {
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_239.slots.default;
    var __VLS_239;
    const __VLS_244 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }));
    const __VLS_246 = __VLS_245({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    let __VLS_248;
    let __VLS_249;
    let __VLS_250;
    const __VLS_251 = {
        onClick: (__VLS_ctx.handleSave)
    };
    __VLS_247.slots.default;
    var __VLS_247;
    const __VLS_252 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_254 = __VLS_253({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    let __VLS_256;
    let __VLS_257;
    let __VLS_258;
    const __VLS_259 = {
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_255.slots.default;
    var __VLS_255;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['custom-feedback-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-instruction']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-content']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-form']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-form']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['refundable-item']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['refund-tip-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['refund-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-left']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-info']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-right']} */ ;
// @ts-ignore
var __VLS_31 = __VLS_30;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            InfoFilled: InfoFilled,
            visible: visible,
            formRef: formRef,
            refundDescriptions: refundDescriptions,
            form: form,
            activeTab: activeTab,
            addItem: addItem,
            removeItemByTab: removeItemByTab,
            handleSave: handleSave,
            handleSubmit: handleSubmit,
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
//# sourceMappingURL=CustomFeedbackDialog.vue.js.map