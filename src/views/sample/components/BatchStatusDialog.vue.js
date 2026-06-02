/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';
const props = defineProps();
const emit = defineEmits(['update:modelValue', 'confirm']);
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});
const loading = ref(false);
const formRef = ref();
const statusLabel = computed(() => {
    const map = {
        '2': '领用中',
        '4': '已归还',
        '5': '已封存',
        '6': '已销毁',
        '7': '已遗失',
        '8': '已内购',
        '12': '已退仓',
        '13': '已退供'
    };
    return map[props.targetStatus] || '';
});
const form = reactive({
    operator: '',
    time: '',
    location: '',
    remark: ''
});
const rules = {
    operator: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
    time: [{ required: true, message: '请选择操作时间', trigger: 'change' }],
    location: [{ required: true, message: '请输入封存地点', trigger: 'blur' }]
};
// 默认值设置
watch(() => props.modelValue, (val) => {
    if (val) {
        form.operator = '';
        form.time = dayjs().format('YYYY-MM-DD HH:mm:ss');
        form.location = '';
        form.remark = '';
    }
});
const handleSubmit = async () => {
    if (!formRef.value)
        return;
    await formRef.value.validate((valid) => {
        if (valid) {
            loading.value = true;
            // 模拟提交逻辑
            setTimeout(() => {
                emit('confirm', { ...form, status: props.targetStatus });
                loading.value = false;
                visible.value = false;
                ElMessage.success(`成功将 ${props.selectedCount} 个样品转换为 ${statusLabel.value} 状态`);
            }, 800);
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
    modelValue: (__VLS_ctx.visible),
    title: (`批量转换状态 - ${__VLS_ctx.statusLabel}`),
    width: "500px",
    destroyOnClose: true,
    appendToBody: true,
    ...{ class: "batch-status-dialog" },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    title: (`批量转换状态 - ${__VLS_ctx.statusLabel}`),
    width: "500px",
    destroyOnClose: true,
    appendToBody: true,
    ...{ class: "batch-status-dialog" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "selection-notice" },
});
const __VLS_5 = {}.ElAlert;
/** @type {[typeof __VLS_components.ElAlert, typeof __VLS_components.elAlert, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    title: (`您已选择 ${__VLS_ctx.selectedCount} 个样品进行状态转换`),
    type: "info",
    showIcon: true,
    closable: (false),
}));
const __VLS_7 = __VLS_6({
    title: (`您已选择 ${__VLS_ctx.selectedCount} 个样品进行状态转换`),
    type: "info",
    showIcon: true,
    closable: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const __VLS_9 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
    ...{ style: {} },
}));
const __VLS_11 = __VLS_10({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "100px",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_13 = {};
__VLS_12.slots.default;
if (__VLS_ctx.targetStatus === '5') {
    const __VLS_15 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
        label: "封存地点",
        prop: "location",
    }));
    const __VLS_17 = __VLS_16({
        label: "封存地点",
        prop: "location",
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    __VLS_18.slots.default;
    const __VLS_19 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        modelValue: (__VLS_ctx.form.location),
        placeholder: "请输入封存地点（如：A库房-03架）",
    }));
    const __VLS_21 = __VLS_20({
        modelValue: (__VLS_ctx.form.location),
        placeholder: "请输入封存地点（如：A库房-03架）",
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    var __VLS_18;
}
else {
    const __VLS_23 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
        label: "承接人",
        prop: "operator",
    }));
    const __VLS_25 = __VLS_24({
        label: "承接人",
        prop: "operator",
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    __VLS_26.slots.default;
    const __VLS_27 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
        modelValue: (__VLS_ctx.form.operator),
        placeholder: (`请输入${__VLS_ctx.statusLabel}承接人`),
    }));
    const __VLS_29 = __VLS_28({
        modelValue: (__VLS_ctx.form.operator),
        placeholder: (`请输入${__VLS_ctx.statusLabel}承接人`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    var __VLS_26;
    const __VLS_31 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        label: "操作时间",
        prop: "time",
    }));
    const __VLS_33 = __VLS_32({
        label: "操作时间",
        prop: "time",
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    __VLS_34.slots.default;
    const __VLS_35 = {}.ElDatePicker;
    /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        modelValue: (__VLS_ctx.form.time),
        type: "datetime",
        placeholder: "请选择时间",
        format: "YYYY-MM-DD HH:mm:ss",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        ...{ style: {} },
    }));
    const __VLS_37 = __VLS_36({
        modelValue: (__VLS_ctx.form.time),
        type: "datetime",
        placeholder: "请选择时间",
        format: "YYYY-MM-DD HH:mm:ss",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    var __VLS_34;
}
const __VLS_39 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    label: "操作备注",
    prop: "remark",
}));
const __VLS_41 = __VLS_40({
    label: "操作备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
const __VLS_43 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    modelValue: (__VLS_ctx.form.remark),
    type: "textarea",
    rows: "3",
    placeholder: "请输入补充备注信息（可选）",
}));
const __VLS_45 = __VLS_44({
    modelValue: (__VLS_ctx.form.remark),
    type: "textarea",
    rows: "3",
    placeholder: "请输入补充备注信息（可选）",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
var __VLS_42;
var __VLS_12;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-footer" },
    });
    const __VLS_47 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
        ...{ 'onClick': {} },
    }));
    const __VLS_49 = __VLS_48({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    let __VLS_51;
    let __VLS_52;
    let __VLS_53;
    const __VLS_54 = {
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_50.slots.default;
    var __VLS_50;
    const __VLS_55 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_57 = __VLS_56({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    let __VLS_59;
    let __VLS_60;
    let __VLS_61;
    const __VLS_62 = {
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_58.slots.default;
    var __VLS_58;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['batch-status-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['selection-notice']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
// @ts-ignore
var __VLS_14 = __VLS_13;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            visible: visible,
            loading: loading,
            formRef: formRef,
            statusLabel: statusLabel,
            form: form,
            rules: rules,
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
//# sourceMappingURL=BatchStatusDialog.vue.js.map