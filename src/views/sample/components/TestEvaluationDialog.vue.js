/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, watch } from 'vue';
import { ElMessage } from 'element-plus';
const props = defineProps();
const emit = defineEmits(['update:modelValue', 'refresh']);
const visible = ref(false);
const loading = ref(false);
const formRef = ref();
const form = reactive({
    result: '',
    isUpgrade: false,
    isMassProduction: false,
    remark: ''
});
const rules = {
    result: [{ required: true, message: '请选择测试结果', trigger: 'change' }]
};
watch(() => props.modelValue, (val) => {
    visible.value = val;
});
watch(visible, (val) => {
    emit('update:modelValue', val);
});
// 级联重置逻辑：当结果改变时，重置下级选项
watch(() => form.result, (newVal) => {
    if (newVal !== '1') {
        form.isUpgrade = false;
        form.isMassProduction = false;
    }
});
watch(() => form.isUpgrade, (newVal) => {
    if (!newVal) {
        form.isMassProduction = false;
    }
});
const handleClosed = () => {
    formRef.value?.resetFields();
};
const handleSubmit = async () => {
    if (!formRef.value)
        return;
    await formRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            try {
                console.log('提交测试评估：', form);
                await new Promise(resolve => setTimeout(resolve, 800));
                ElMessage.success('评估提交成功');
                visible.value = false;
                emit('refresh');
            }
            finally {
                loading.value = false;
            }
        }
    });
};
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
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.visible),
    title: "样品测试评估",
    width: "550px",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.visible),
    title: "样品测试评估",
    width: "550px",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClosed: (__VLS_ctx.handleClosed)
};
var __VLS_8 = {};
__VLS_3.slots.default;
const __VLS_9 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "120px",
    size: "small",
}));
const __VLS_11 = __VLS_10({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "120px",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_13 = {};
__VLS_12.slots.default;
const __VLS_15 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    label: "样品信息",
}));
const __VLS_17 = __VLS_16({
    label: "样品信息",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.ElTag;
/** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    type: "info",
}));
const __VLS_21 = __VLS_20({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
__VLS_22.slots.default;
(__VLS_ctx.sampleData?.sampleNo);
var __VLS_22;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ style: {} },
});
(__VLS_ctx.sampleData?.sampleName);
var __VLS_18;
const __VLS_23 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    label: "测试结果",
    prop: "result",
}));
const __VLS_25 = __VLS_24({
    label: "测试结果",
    prop: "result",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
__VLS_26.slots.default;
const __VLS_27 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    modelValue: (__VLS_ctx.form.result),
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.form.result),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
const __VLS_31 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    label: "1",
}));
const __VLS_33 = __VLS_32({
    label: "1",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
var __VLS_34;
const __VLS_35 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
    label: "2",
}));
const __VLS_37 = __VLS_36({
    label: "2",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
__VLS_38.slots.default;
var __VLS_38;
const __VLS_39 = {}.ElRadio;
/** @type {[typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, typeof __VLS_components.ElRadio, typeof __VLS_components.elRadio, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    label: "3",
}));
const __VLS_41 = __VLS_40({
    label: "3",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
var __VLS_42;
var __VLS_30;
var __VLS_26;
const __VLS_43 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    name: "el-zoom-in-top",
}));
const __VLS_45 = __VLS_44({
    name: "el-zoom-in-top",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_46.slots.default;
if (__VLS_ctx.form.result === '1') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cascade-section" },
    });
    const __VLS_47 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
        label: "升级确认样",
        prop: "isUpgrade",
    }));
    const __VLS_49 = __VLS_48({
        label: "升级确认样",
        prop: "isUpgrade",
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    __VLS_50.slots.default;
    const __VLS_51 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
        modelValue: (__VLS_ctx.form.isUpgrade),
        activeText: "是",
        inactiveText: "否",
        inlinePrompt: true,
    }));
    const __VLS_53 = __VLS_52({
        modelValue: (__VLS_ctx.form.isUpgrade),
        activeText: "是",
        inactiveText: "否",
        inlinePrompt: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "hint-text" },
    });
    var __VLS_50;
    const __VLS_55 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
        name: "el-zoom-in-top",
    }));
    const __VLS_57 = __VLS_56({
        name: "el-zoom-in-top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    __VLS_58.slots.default;
    if (__VLS_ctx.form.isUpgrade) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_59 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
            label: "大货标准",
            prop: "isMassProduction",
        }));
        const __VLS_61 = __VLS_60({
            label: "大货标准",
            prop: "isMassProduction",
        }, ...__VLS_functionalComponentArgsRest(__VLS_60));
        __VLS_62.slots.default;
        const __VLS_63 = {}.ElCheckbox;
        /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
        // @ts-ignore
        const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
            modelValue: (__VLS_ctx.form.isMassProduction),
        }));
        const __VLS_65 = __VLS_64({
            modelValue: (__VLS_ctx.form.isMassProduction),
        }, ...__VLS_functionalComponentArgsRest(__VLS_64));
        __VLS_66.slots.default;
        var __VLS_66;
        var __VLS_62;
    }
    var __VLS_58;
}
var __VLS_46;
const __VLS_67 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    label: "测试备注",
    prop: "remark",
}));
const __VLS_69 = __VLS_68({
    label: "测试备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
const __VLS_71 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    modelValue: (__VLS_ctx.form.remark),
    type: "textarea",
    rows: (3),
    placeholder: "请输入测试详细评价或改进建议",
}));
const __VLS_73 = __VLS_72({
    modelValue: (__VLS_ctx.form.remark),
    type: "textarea",
    rows: (3),
    placeholder: "请输入测试详细评价或改进建议",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
var __VLS_70;
var __VLS_12;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_75 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_77 = __VLS_76({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    let __VLS_79;
    let __VLS_80;
    let __VLS_81;
    const __VLS_82 = {
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_78.slots.default;
    var __VLS_78;
    const __VLS_83 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_85 = __VLS_84({
        ...{ 'onClick': {} },
        size: "small",
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    let __VLS_87;
    let __VLS_88;
    let __VLS_89;
    const __VLS_90 = {
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_86.slots.default;
    var __VLS_86;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['cascade-section']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-text']} */ ;
// @ts-ignore
var __VLS_14 = __VLS_13;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            visible: visible,
            loading: loading,
            formRef: formRef,
            form: form,
            rules: rules,
            handleClosed: handleClosed,
            handleSubmit: handleSubmit,
        };
    },
    emits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TestEvaluationDialog.vue.js.map