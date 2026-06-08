/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { InfoFilled, Picture, Camera, Delete, Upload } from '@element-plus/icons-vue';
const visible = ref(false);
const isEditMode = ref(false);
const formRef = ref(null);
const emit = defineEmits(['submit']);
// 模拟正式供应商数据及其货源地
const formalSuppliers = [
    { label: '浙江恒太工贸有限公司', value: 'S001', source: '浙江义乌' },
    { label: '广东奥飞娱乐股份有限公司', value: 'S002', source: '广东深圳' },
    { label: '江苏美派玩具礼品有限公司', value: 'S003', source: '江苏苏州' }
];
const refundDescriptions = {
    first_order: '首单达到起订量即可退回费用',
    order_volume: '订单量累计达到设定数量后退回',
    order_amount: '订单金额累计达到设定金额后退回'
};
const handleSupplierChange = (val, item) => {
    const supplier = formalSuppliers.find(s => s.label === val);
    if (supplier) {
        item.source = supplier.source;
    }
};
const handleImageSuccess = (file, item, field) => {
    if (file.raw) {
        const url = URL.createObjectURL(file.raw);
        item[field].push(url);
    }
};
const removeImage = (item, field, index) => {
    item[field].splice(index, 1);
};
const createEmptyItem = (data) => {
    const isPurchaseRow = data && (data.applyNo || data.qty !== undefined);
    return {
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        applyNo: data?.applyNo || '',
        feeType: data?.feeType || '打样费',
        channel: isPurchaseRow ? (data.channel || '供应商') : (data?.source === '1688' || data?.source === '淘宝' ? data.source : '供应商'),
        supplierType: isPurchaseRow ? (data.supplierType || (data.supplier ? '正式' : '临时')) : '临时',
        supplier: isPurchaseRow ? (data.supplier || '') : '',
        source: isPurchaseRow ? (data.source || data.supplier || '') : (data?.source || ''),
        purchaseUrl: data?.purchaseUrl || '',
        isRefundable: isPurchaseRow ? (!!data.isRefundable) : (data?.isRefundable === '是'),
        sampleName: isPurchaseRow ? (data.sampleName || '') : (data?.productName || ''),
        quantity: isPurchaseRow ? (data.qty || 1) : 1,
        price: isPurchaseRow ? (typeof data.price === 'number' ? data.price : (parseFloat((data.price || '0').replace(/[^\d.]/g, '')) || 0)) : 0,
        paymentMethod: data?.paymentMethod || '银行转账',
        bankAccount: data?.bankAccount || '',
        accountName: data?.accountName || '',
        bankName: data?.bankName || '',
        refundMethod: data?.refundMethod || 'first_order',
        refundCondition: data?.refundCondition || '',
        sampleImages: data?.sampleImages || (data?.image ? [data.image] : []),
        orderScreenshots: data?.orderScreenshots || [],
        paymentQrCodes: data?.paymentQrCodes || (data?.paymentQrCode ? [data.paymentQrCode] : []),
        contractFiles: data?.contractFiles || (data?.contractFile ? [{ name: data.contractFile, url: '#' }] : []),
        contractAmount: data?.contractAmount || undefined,
        contractRemark: data?.contractRemark || ''
    };
};
const form = ref({
    items: [createEmptyItem()]
});
const activeTab = ref(form.value.items[0].id);
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
    ElMessageBox.confirm('确定要删除该购样方案吗？', '提示', {
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
    const forms = Array.isArray(formRef.value) ? formRef.value : [formRef.value];
    let isValid = true;
    for (const formInst of forms) {
        if (formInst && typeof formInst.validate === 'function') {
            const valid = await new Promise((resolve) => {
                formInst.validate((isValidForm) => resolve(isValidForm));
            });
            if (!valid) {
                isValid = false;
            }
        }
    }
    if (!isValid) {
        ElMessage.warning('请完善必填信息');
        return;
    }
    ElMessage.success(`成功提交 ${form.value.items.length} 个购样申请`);
    emit('submit', form.value.items);
    visible.value = false;
};
const open = (taskData) => {
    visible.value = true;
    isEditMode.value = !!(taskData && (taskData.applyNo || taskData.qty !== undefined));
    const initialItem = createEmptyItem(taskData);
    form.value.items = [initialItem];
    activeTab.value = initialItem.id;
};
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['is-active']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-mask']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-form-item']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.isEditMode ? (__VLS_ctx.form.items[0]?.feeType === '开模费' ? '编辑模具申请' : '编辑购样申请') : (__VLS_ctx.form.items[0]?.feeType === '开模费' ? '模具申请' : '购样申请')),
    width: "1100px",
    ...{ class: "purchase-apply-dialog" },
    destroyOnClose: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.isEditMode ? (__VLS_ctx.form.items[0]?.feeType === '开模费' ? '编辑模具申请' : '编辑购样申请') : (__VLS_ctx.form.items[0]?.feeType === '开模费' ? '模具申请' : '购样申请')),
    width: "1100px",
    ...{ class: "purchase-apply-dialog" },
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
if (!__VLS_ctx.isEditMode) {
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
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feedback-content" },
});
if (__VLS_ctx.isEditMode) {
    const __VLS_13 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
        model: (__VLS_ctx.form),
        ref: "formRef",
        labelPosition: "left",
        labelWidth: "100px",
        ...{ class: "feedback-form custom-form" },
    }));
    const __VLS_15 = __VLS_14({
        model: (__VLS_ctx.form),
        ref: "formRef",
        labelPosition: "left",
        labelWidth: "100px",
        ...{ class: "feedback-form custom-form" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    /** @type {typeof __VLS_ctx.formRef} */ ;
    var __VLS_17 = {};
    __VLS_16.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title-bar blue" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_19 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        gutter: (24),
    }));
    const __VLS_21 = __VLS_20({
        gutter: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_22.slots.default;
    const __VLS_23 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
        span: (6),
    }));
    const __VLS_25 = __VLS_24({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    __VLS_26.slots.default;
    const __VLS_27 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
        label: "拿样渠道",
        required: true,
        prop: "items.0.channel",
        rules: ({ required: true, message: '请选择渠道', trigger: 'change' }),
    }));
    const __VLS_29 = __VLS_28({
        label: "拿样渠道",
        required: true,
        prop: "items.0.channel",
        rules: ({ required: true, message: '请选择渠道', trigger: 'change' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    __VLS_30.slots.default;
    const __VLS_31 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
        modelValue: (__VLS_ctx.form.items[0].channel),
        placeholder: "请选择",
        ...{ class: "w-full" },
    }));
    const __VLS_33 = __VLS_32({
        modelValue: (__VLS_ctx.form.items[0].channel),
        placeholder: "请选择",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    __VLS_34.slots.default;
    const __VLS_35 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({
        label: "供应商",
        value: "供应商",
    }));
    const __VLS_37 = __VLS_36({
        label: "供应商",
        value: "供应商",
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    const __VLS_39 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
        label: "1688",
        value: "1688",
    }));
    const __VLS_41 = __VLS_40({
        label: "1688",
        value: "1688",
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    const __VLS_43 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
        label: "淘宝",
        value: "淘宝",
    }));
    const __VLS_45 = __VLS_44({
        label: "淘宝",
        value: "淘宝",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    var __VLS_34;
    var __VLS_30;
    var __VLS_26;
    if (__VLS_ctx.form.items[0].channel === '供应商') {
        const __VLS_47 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
            span: (6),
        }));
        const __VLS_49 = __VLS_48({
            span: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_48));
        __VLS_50.slots.default;
        const __VLS_51 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
            label: "供应商类型",
            required: true,
            prop: "items.0.supplierType",
            rules: ({ required: true, message: '请选择类型', trigger: 'change' }),
        }));
        const __VLS_53 = __VLS_52({
            label: "供应商类型",
            required: true,
            prop: "items.0.supplierType",
            rules: ({ required: true, message: '请选择类型', trigger: 'change' }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_52));
        __VLS_54.slots.default;
        const __VLS_55 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
            modelValue: (__VLS_ctx.form.items[0].supplierType),
            placeholder: "请选择",
            ...{ class: "w-full" },
        }));
        const __VLS_57 = __VLS_56({
            modelValue: (__VLS_ctx.form.items[0].supplierType),
            placeholder: "请选择",
            ...{ class: "w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_56));
        __VLS_58.slots.default;
        const __VLS_59 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
            label: "正式供应商",
            value: "正式",
        }));
        const __VLS_61 = __VLS_60({
            label: "正式供应商",
            value: "正式",
        }, ...__VLS_functionalComponentArgsRest(__VLS_60));
        const __VLS_63 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
            label: "临时供应商",
            value: "临时",
        }));
        const __VLS_65 = __VLS_64({
            label: "临时供应商",
            value: "临时",
        }, ...__VLS_functionalComponentArgsRest(__VLS_64));
        var __VLS_58;
        var __VLS_54;
        var __VLS_50;
        const __VLS_67 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
            span: (6),
        }));
        const __VLS_69 = __VLS_68({
            span: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_68));
        __VLS_70.slots.default;
        const __VLS_71 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
            label: "供应商",
            required: true,
            prop: "items.0.supplier",
            rules: ({ required: true, message: '请输入供应商', trigger: 'blur' }),
        }));
        const __VLS_73 = __VLS_72({
            label: "供应商",
            required: true,
            prop: "items.0.supplier",
            rules: ({ required: true, message: '请输入供应商', trigger: 'blur' }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_72));
        __VLS_74.slots.default;
        if (__VLS_ctx.form.items[0].supplierType === '正式') {
            const __VLS_75 = {}.ElSelect;
            /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
            // @ts-ignore
            const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
                ...{ 'onChange': {} },
                modelValue: (__VLS_ctx.form.items[0].supplier),
                placeholder: "选择供应商",
                ...{ class: "w-full" },
            }));
            const __VLS_77 = __VLS_76({
                ...{ 'onChange': {} },
                modelValue: (__VLS_ctx.form.items[0].supplier),
                placeholder: "选择供应商",
                ...{ class: "w-full" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_76));
            let __VLS_79;
            let __VLS_80;
            let __VLS_81;
            const __VLS_82 = {
                onChange: ((val) => __VLS_ctx.handleSupplierChange(val, __VLS_ctx.form.items[0]))
            };
            __VLS_78.slots.default;
            for (const [s] of __VLS_getVForSourceType((__VLS_ctx.formalSuppliers))) {
                const __VLS_83 = {}.ElOption;
                /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
                // @ts-ignore
                const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
                    key: (s.value),
                    label: (s.label),
                    value: (s.label),
                }));
                const __VLS_85 = __VLS_84({
                    key: (s.value),
                    label: (s.label),
                    value: (s.label),
                }, ...__VLS_functionalComponentArgsRest(__VLS_84));
            }
            var __VLS_78;
        }
        else {
            const __VLS_87 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
                modelValue: (__VLS_ctx.form.items[0].supplier),
                placeholder: "输入名称",
            }));
            const __VLS_89 = __VLS_88({
                modelValue: (__VLS_ctx.form.items[0].supplier),
                placeholder: "输入名称",
            }, ...__VLS_functionalComponentArgsRest(__VLS_88));
        }
        var __VLS_74;
        var __VLS_70;
        const __VLS_91 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
            span: (6),
        }));
        const __VLS_93 = __VLS_92({
            span: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_92));
        __VLS_94.slots.default;
        const __VLS_95 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
            label: "货源地",
            required: true,
            prop: "items.0.source",
            rules: ({ required: true, message: '请选择或输入货源地', trigger: 'blur' }),
        }));
        const __VLS_97 = __VLS_96({
            label: "货源地",
            required: true,
            prop: "items.0.source",
            rules: ({ required: true, message: '请选择或输入货源地', trigger: 'blur' }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_96));
        __VLS_98.slots.default;
        const __VLS_99 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
            modelValue: (__VLS_ctx.form.items[0].source),
            placeholder: "请选择",
            ...{ class: "w-full" },
            disabled: (__VLS_ctx.form.items[0].supplierType === '正式'),
        }));
        const __VLS_101 = __VLS_100({
            modelValue: (__VLS_ctx.form.items[0].source),
            placeholder: "请选择",
            ...{ class: "w-full" },
            disabled: (__VLS_ctx.form.items[0].supplierType === '正式'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_100));
        __VLS_102.slots.default;
        const __VLS_103 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
            label: "广东深圳",
            value: "广东深圳",
        }));
        const __VLS_105 = __VLS_104({
            label: "广东深圳",
            value: "广东深圳",
        }, ...__VLS_functionalComponentArgsRest(__VLS_104));
        const __VLS_107 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
            label: "浙江义乌",
            value: "浙江义乌",
        }));
        const __VLS_109 = __VLS_108({
            label: "浙江义乌",
            value: "浙江义乌",
        }, ...__VLS_functionalComponentArgsRest(__VLS_108));
        const __VLS_111 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
            label: "江苏苏州",
            value: "江苏苏州",
        }));
        const __VLS_113 = __VLS_112({
            label: "江苏苏州",
            value: "江苏苏州",
        }, ...__VLS_functionalComponentArgsRest(__VLS_112));
        const __VLS_115 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
            label: "福建泉州",
            value: "福建泉州",
        }));
        const __VLS_117 = __VLS_116({
            label: "福建泉州",
            value: "福建泉州",
        }, ...__VLS_functionalComponentArgsRest(__VLS_116));
        const __VLS_119 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
            label: "山东临沂",
            value: "山东临沂",
        }));
        const __VLS_121 = __VLS_120({
            label: "山东临沂",
            value: "山东临沂",
        }, ...__VLS_functionalComponentArgsRest(__VLS_120));
        var __VLS_102;
        var __VLS_98;
        var __VLS_94;
    }
    else {
        const __VLS_123 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
            span: (14),
        }));
        const __VLS_125 = __VLS_124({
            span: (14),
        }, ...__VLS_functionalComponentArgsRest(__VLS_124));
        __VLS_126.slots.default;
        const __VLS_127 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
            label: "购买链接",
            required: true,
            prop: "items.0.purchaseUrl",
            rules: ({ required: true, message: '请输入购买链接', trigger: 'blur' }),
        }));
        const __VLS_129 = __VLS_128({
            label: "购买链接",
            required: true,
            prop: "items.0.purchaseUrl",
            rules: ({ required: true, message: '请输入购买链接', trigger: 'blur' }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_128));
        __VLS_130.slots.default;
        const __VLS_131 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
            modelValue: (__VLS_ctx.form.items[0].purchaseUrl),
            placeholder: "粘贴 1688 或 淘宝 购买链接",
        }));
        const __VLS_133 = __VLS_132({
            modelValue: (__VLS_ctx.form.items[0].purchaseUrl),
            placeholder: "粘贴 1688 或 淘宝 购买链接",
        }, ...__VLS_functionalComponentArgsRest(__VLS_132));
        var __VLS_130;
        var __VLS_126;
    }
    var __VLS_22;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "section-title" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title-bar orange" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_135 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
        type: "warning",
        size: "small",
        effect: "light",
        ...{ style: {} },
    }));
    const __VLS_137 = __VLS_136({
        type: "warning",
        size: "small",
        effect: "light",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_136));
    __VLS_138.slots.default;
    (__VLS_ctx.form.items[0].feeType);
    var __VLS_138;
    const __VLS_139 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
        gutter: (24),
    }));
    const __VLS_141 = __VLS_140({
        gutter: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_140));
    __VLS_142.slots.default;
    const __VLS_143 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
        span: (6),
    }));
    const __VLS_145 = __VLS_144({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_144));
    __VLS_146.slots.default;
    const __VLS_147 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
        label: "样品名称",
        prop: "items.0.sampleName",
    }));
    const __VLS_149 = __VLS_148({
        label: "样品名称",
        prop: "items.0.sampleName",
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    __VLS_150.slots.default;
    const __VLS_151 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
        modelValue: (__VLS_ctx.form.items[0].sampleName),
        placeholder: "输入样品名称",
    }));
    const __VLS_153 = __VLS_152({
        modelValue: (__VLS_ctx.form.items[0].sampleName),
        placeholder: "输入样品名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_152));
    var __VLS_150;
    var __VLS_146;
    const __VLS_155 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
        span: (6),
    }));
    const __VLS_157 = __VLS_156({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_156));
    __VLS_158.slots.default;
    const __VLS_159 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
        label: "购样数量",
        required: true,
        prop: "items.0.quantity",
        rules: ({ required: true, message: '请输入数量', trigger: 'blur' }),
    }));
    const __VLS_161 = __VLS_160({
        label: "购样数量",
        required: true,
        prop: "items.0.quantity",
        rules: ({ required: true, message: '请输入数量', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_160));
    __VLS_162.slots.default;
    const __VLS_163 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
        modelValue: (__VLS_ctx.form.items[0].quantity),
        min: (1),
        controls: (false),
        ...{ class: "w-full" },
    }));
    const __VLS_165 = __VLS_164({
        modelValue: (__VLS_ctx.form.items[0].quantity),
        min: (1),
        controls: (false),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_164));
    var __VLS_162;
    var __VLS_158;
    const __VLS_167 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
        span: (6),
    }));
    const __VLS_169 = __VLS_168({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_168));
    __VLS_170.slots.default;
    const __VLS_171 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
        label: "费用(单价)",
        required: true,
        prop: "items.0.price",
        rules: ({ required: true, message: '请输入费用', trigger: 'blur' }),
    }));
    const __VLS_173 = __VLS_172({
        label: "费用(单价)",
        required: true,
        prop: "items.0.price",
        rules: ({ required: true, message: '请输入费用', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_172));
    __VLS_174.slots.default;
    const __VLS_175 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
        modelValue: (__VLS_ctx.form.items[0].price),
        min: (0),
        precision: (2),
        controls: (false),
        ...{ class: "w-full" },
    }));
    const __VLS_177 = __VLS_176({
        modelValue: (__VLS_ctx.form.items[0].price),
        min: (0),
        precision: (2),
        controls: (false),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_176));
    __VLS_178.slots.default;
    {
        const { append: __VLS_thisSlot } = __VLS_178.slots;
    }
    var __VLS_178;
    var __VLS_174;
    var __VLS_170;
    const __VLS_179 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({
        span: (6),
    }));
    const __VLS_181 = __VLS_180({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_180));
    __VLS_182.slots.default;
    const __VLS_183 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_184 = __VLS_asFunctionalComponent(__VLS_183, new __VLS_183({
        label: "费用合计",
    }));
    const __VLS_185 = __VLS_184({
        label: "费用合计",
    }, ...__VLS_functionalComponentArgsRest(__VLS_184));
    __VLS_186.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "total-price-text" },
    });
    ((__VLS_ctx.form.items[0].quantity * __VLS_ctx.form.items[0].price).toFixed(2));
    var __VLS_186;
    var __VLS_182;
    var __VLS_142;
    if (__VLS_ctx.form.items[0].channel === '供应商') {
        const __VLS_187 = {}.ElRow;
        /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
        // @ts-ignore
        const __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({
            gutter: (24),
        }));
        const __VLS_189 = __VLS_188({
            gutter: (24),
        }, ...__VLS_functionalComponentArgsRest(__VLS_188));
        __VLS_190.slots.default;
        const __VLS_191 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_192 = __VLS_asFunctionalComponent(__VLS_191, new __VLS_191({
            span: (6),
        }));
        const __VLS_193 = __VLS_192({
            span: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_192));
        __VLS_194.slots.default;
        const __VLS_195 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195({
            label: "是否可退款",
        }));
        const __VLS_197 = __VLS_196({
            label: "是否可退款",
        }, ...__VLS_functionalComponentArgsRest(__VLS_196));
        __VLS_198.slots.default;
        const __VLS_199 = {}.ElSwitch;
        /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
        // @ts-ignore
        const __VLS_200 = __VLS_asFunctionalComponent(__VLS_199, new __VLS_199({
            modelValue: (__VLS_ctx.form.items[0].isRefundable),
            inlinePrompt: true,
            activeText: "是",
            inactiveText: "否",
        }));
        const __VLS_201 = __VLS_200({
            modelValue: (__VLS_ctx.form.items[0].isRefundable),
            inlinePrompt: true,
            activeText: "是",
            inactiveText: "否",
        }, ...__VLS_functionalComponentArgsRest(__VLS_200));
        var __VLS_198;
        var __VLS_194;
        if (__VLS_ctx.form.items[0].isRefundable) {
            const __VLS_203 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_204 = __VLS_asFunctionalComponent(__VLS_203, new __VLS_203({
                span: (6),
            }));
            const __VLS_205 = __VLS_204({
                span: (6),
            }, ...__VLS_functionalComponentArgsRest(__VLS_204));
            __VLS_206.slots.default;
            const __VLS_207 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207({
                label: "退款方式",
                required: true,
            }));
            const __VLS_209 = __VLS_208({
                label: "退款方式",
                required: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_208));
            __VLS_210.slots.default;
            const __VLS_211 = {}.ElSelect;
            /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
            // @ts-ignore
            const __VLS_212 = __VLS_asFunctionalComponent(__VLS_211, new __VLS_211({
                modelValue: (__VLS_ctx.form.items[0].refundMethod),
                placeholder: "请选择",
                ...{ class: "w-full" },
            }));
            const __VLS_213 = __VLS_212({
                modelValue: (__VLS_ctx.form.items[0].refundMethod),
                placeholder: "请选择",
                ...{ class: "w-full" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_212));
            __VLS_214.slots.default;
            const __VLS_215 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_216 = __VLS_asFunctionalComponent(__VLS_215, new __VLS_215({
                label: "首单退款",
                value: "first_order",
            }));
            const __VLS_217 = __VLS_216({
                label: "首单退款",
                value: "first_order",
            }, ...__VLS_functionalComponentArgsRest(__VLS_216));
            const __VLS_219 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_220 = __VLS_asFunctionalComponent(__VLS_219, new __VLS_219({
                label: "订单量退款",
                value: "order_volume",
            }));
            const __VLS_221 = __VLS_220({
                label: "订单量退款",
                value: "order_volume",
            }, ...__VLS_functionalComponentArgsRest(__VLS_220));
            const __VLS_223 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_224 = __VLS_asFunctionalComponent(__VLS_223, new __VLS_223({
                label: "订单金额退款",
                value: "order_amount",
            }));
            const __VLS_225 = __VLS_224({
                label: "订单金额退款",
                value: "order_amount",
            }, ...__VLS_functionalComponentArgsRest(__VLS_224));
            var __VLS_214;
            var __VLS_210;
            var __VLS_206;
            const __VLS_227 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_228 = __VLS_asFunctionalComponent(__VLS_227, new __VLS_227({
                span: (6),
            }));
            const __VLS_229 = __VLS_228({
                span: (6),
            }, ...__VLS_functionalComponentArgsRest(__VLS_228));
            __VLS_230.slots.default;
            const __VLS_231 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({
                label: "退款条件",
                required: true,
                rules: ([
                    { required: ['order_volume', 'order_amount'].includes(__VLS_ctx.form.items[0].refundMethod), message: '请输入退款条件', trigger: 'blur' }
                ]),
            }));
            const __VLS_233 = __VLS_232({
                label: "退款条件",
                required: true,
                rules: ([
                    { required: ['order_volume', 'order_amount'].includes(__VLS_ctx.form.items[0].refundMethod), message: '请输入退款条件', trigger: 'blur' }
                ]),
            }, ...__VLS_functionalComponentArgsRest(__VLS_232));
            __VLS_234.slots.default;
            const __VLS_235 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_236 = __VLS_asFunctionalComponent(__VLS_235, new __VLS_235({
                modelValue: (__VLS_ctx.form.items[0].refundCondition),
                placeholder: "请输入",
            }));
            const __VLS_237 = __VLS_236({
                modelValue: (__VLS_ctx.form.items[0].refundCondition),
                placeholder: "请输入",
            }, ...__VLS_functionalComponentArgsRest(__VLS_236));
            var __VLS_234;
            var __VLS_230;
            const __VLS_239 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_240 = __VLS_asFunctionalComponent(__VLS_239, new __VLS_239({
                span: (6),
            }));
            const __VLS_241 = __VLS_240({
                span: (6),
            }, ...__VLS_functionalComponentArgsRest(__VLS_240));
            __VLS_242.slots.default;
            if (__VLS_ctx.form.items[0].refundMethod) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "refund-tip-wrapper" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "refund-tip" },
                });
                const __VLS_243 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_244 = __VLS_asFunctionalComponent(__VLS_243, new __VLS_243({
                    ...{ class: "mr-4" },
                }));
                const __VLS_245 = __VLS_244({
                    ...{ class: "mr-4" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_244));
                __VLS_246.slots.default;
                const __VLS_247 = {}.InfoFilled;
                /** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
                // @ts-ignore
                const __VLS_248 = __VLS_asFunctionalComponent(__VLS_247, new __VLS_247({}));
                const __VLS_249 = __VLS_248({}, ...__VLS_functionalComponentArgsRest(__VLS_248));
                var __VLS_246;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (__VLS_ctx.refundDescriptions[__VLS_ctx.form.items[0].refundMethod]);
            }
            var __VLS_242;
        }
        var __VLS_190;
    }
    if (__VLS_ctx.form.items[0].channel === '供应商') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "form-section" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar purple" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        const __VLS_251 = {}.ElRow;
        /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
        // @ts-ignore
        const __VLS_252 = __VLS_asFunctionalComponent(__VLS_251, new __VLS_251({
            gutter: (24),
        }));
        const __VLS_253 = __VLS_252({
            gutter: (24),
        }, ...__VLS_functionalComponentArgsRest(__VLS_252));
        __VLS_254.slots.default;
        const __VLS_255 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_256 = __VLS_asFunctionalComponent(__VLS_255, new __VLS_255({
            span: (6),
        }));
        const __VLS_257 = __VLS_256({
            span: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_256));
        __VLS_258.slots.default;
        const __VLS_259 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_260 = __VLS_asFunctionalComponent(__VLS_259, new __VLS_259({
            label: "收款方式",
            required: true,
        }));
        const __VLS_261 = __VLS_260({
            label: "收款方式",
            required: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_260));
        __VLS_262.slots.default;
        const __VLS_263 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_264 = __VLS_asFunctionalComponent(__VLS_263, new __VLS_263({
            modelValue: (__VLS_ctx.form.items[0].paymentMethod),
            placeholder: "请选择",
            ...{ class: "w-full" },
        }));
        const __VLS_265 = __VLS_264({
            modelValue: (__VLS_ctx.form.items[0].paymentMethod),
            placeholder: "请选择",
            ...{ class: "w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_264));
        __VLS_266.slots.default;
        const __VLS_267 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_268 = __VLS_asFunctionalComponent(__VLS_267, new __VLS_267({
            label: "银行转账",
            value: "银行转账",
        }));
        const __VLS_269 = __VLS_268({
            label: "银行转账",
            value: "银行转账",
        }, ...__VLS_functionalComponentArgsRest(__VLS_268));
        const __VLS_271 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_272 = __VLS_asFunctionalComponent(__VLS_271, new __VLS_271({
            label: "支付宝",
            value: "支付宝",
        }));
        const __VLS_273 = __VLS_272({
            label: "支付宝",
            value: "支付宝",
        }, ...__VLS_functionalComponentArgsRest(__VLS_272));
        const __VLS_275 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_276 = __VLS_asFunctionalComponent(__VLS_275, new __VLS_275({
            label: "微信",
            value: "微信",
        }));
        const __VLS_277 = __VLS_276({
            label: "微信",
            value: "微信",
        }, ...__VLS_functionalComponentArgsRest(__VLS_276));
        var __VLS_266;
        var __VLS_262;
        var __VLS_258;
        if (__VLS_ctx.form.items[0].paymentMethod === '银行转账') {
            const __VLS_279 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_280 = __VLS_asFunctionalComponent(__VLS_279, new __VLS_279({
                span: (6),
            }));
            const __VLS_281 = __VLS_280({
                span: (6),
            }, ...__VLS_functionalComponentArgsRest(__VLS_280));
            __VLS_282.slots.default;
            const __VLS_283 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_284 = __VLS_asFunctionalComponent(__VLS_283, new __VLS_283({
                label: "开户行",
                required: true,
            }));
            const __VLS_285 = __VLS_284({
                label: "开户行",
                required: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_284));
            __VLS_286.slots.default;
            const __VLS_287 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_288 = __VLS_asFunctionalComponent(__VLS_287, new __VLS_287({
                modelValue: (__VLS_ctx.form.items[0].bankName),
                placeholder: "输入支行",
            }));
            const __VLS_289 = __VLS_288({
                modelValue: (__VLS_ctx.form.items[0].bankName),
                placeholder: "输入支行",
            }, ...__VLS_functionalComponentArgsRest(__VLS_288));
            var __VLS_286;
            var __VLS_282;
            const __VLS_291 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_292 = __VLS_asFunctionalComponent(__VLS_291, new __VLS_291({
                span: (6),
            }));
            const __VLS_293 = __VLS_292({
                span: (6),
            }, ...__VLS_functionalComponentArgsRest(__VLS_292));
            __VLS_294.slots.default;
            const __VLS_295 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_296 = __VLS_asFunctionalComponent(__VLS_295, new __VLS_295({
                label: "账号户名",
                required: true,
            }));
            const __VLS_297 = __VLS_296({
                label: "账号户名",
                required: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_296));
            __VLS_298.slots.default;
            const __VLS_299 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_300 = __VLS_asFunctionalComponent(__VLS_299, new __VLS_299({
                modelValue: (__VLS_ctx.form.items[0].accountName),
                placeholder: "输入户名",
            }));
            const __VLS_301 = __VLS_300({
                modelValue: (__VLS_ctx.form.items[0].accountName),
                placeholder: "输入户名",
            }, ...__VLS_functionalComponentArgsRest(__VLS_300));
            var __VLS_298;
            var __VLS_294;
            const __VLS_303 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_304 = __VLS_asFunctionalComponent(__VLS_303, new __VLS_303({
                span: (6),
            }));
            const __VLS_305 = __VLS_304({
                span: (6),
            }, ...__VLS_functionalComponentArgsRest(__VLS_304));
            __VLS_306.slots.default;
            const __VLS_307 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_308 = __VLS_asFunctionalComponent(__VLS_307, new __VLS_307({
                label: "银行账号",
                required: true,
            }));
            const __VLS_309 = __VLS_308({
                label: "银行账号",
                required: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_308));
            __VLS_310.slots.default;
            const __VLS_311 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_312 = __VLS_asFunctionalComponent(__VLS_311, new __VLS_311({
                modelValue: (__VLS_ctx.form.items[0].bankAccount),
                placeholder: "输入账号",
            }));
            const __VLS_313 = __VLS_312({
                modelValue: (__VLS_ctx.form.items[0].bankAccount),
                placeholder: "输入账号",
            }, ...__VLS_functionalComponentArgsRest(__VLS_312));
            var __VLS_310;
            var __VLS_306;
        }
        if (['支付宝', '微信'].includes(__VLS_ctx.form.items[0].paymentMethod)) {
            const __VLS_315 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_316 = __VLS_asFunctionalComponent(__VLS_315, new __VLS_315({
                span: (8),
            }));
            const __VLS_317 = __VLS_316({
                span: (8),
            }, ...__VLS_functionalComponentArgsRest(__VLS_316));
            __VLS_318.slots.default;
            const __VLS_319 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_320 = __VLS_asFunctionalComponent(__VLS_319, new __VLS_319({
                label: "收款二维码",
                required: (__VLS_ctx.form.items[0].paymentMethod === '支付宝'),
                prop: "items.0.paymentQrCodes",
                rules: ([
                    {
                        validator: (rule, value, callback) => {
                            if (__VLS_ctx.form.items[0].paymentMethod === '支付宝' && (!value || value.length === 0)) {
                                callback(new Error('请上传收款二维码'));
                            }
                            else {
                                callback();
                            }
                        },
                        trigger: 'change'
                    }
                ]),
            }));
            const __VLS_321 = __VLS_320({
                label: "收款二维码",
                required: (__VLS_ctx.form.items[0].paymentMethod === '支付宝'),
                prop: "items.0.paymentQrCodes",
                rules: ([
                    {
                        validator: (rule, value, callback) => {
                            if (__VLS_ctx.form.items[0].paymentMethod === '支付宝' && (!value || value.length === 0)) {
                                callback(new Error('请上传收款二维码'));
                            }
                            else {
                                callback();
                            }
                        },
                        trigger: 'change'
                    }
                ]),
            }, ...__VLS_functionalComponentArgsRest(__VLS_320));
            __VLS_322.slots.default;
            const __VLS_323 = {}.ElUpload;
            /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
            // @ts-ignore
            const __VLS_324 = __VLS_asFunctionalComponent(__VLS_323, new __VLS_323({
                action: "#",
                autoUpload: (false),
                showFileList: (false),
                onChange: ((file) => __VLS_ctx.handleImageSuccess(file, __VLS_ctx.form.items[0], 'paymentQrCodes')),
                ...{ class: "p-upload-inline" },
            }));
            const __VLS_325 = __VLS_324({
                action: "#",
                autoUpload: (false),
                showFileList: (false),
                onChange: ((file) => __VLS_ctx.handleImageSuccess(file, __VLS_ctx.form.items[0], 'paymentQrCodes')),
                ...{ class: "p-upload-inline" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_324));
            __VLS_326.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "p-upload-grid" },
            });
            for (const [img, i] of __VLS_getVForSourceType((__VLS_ctx.form.items[0].paymentQrCodes))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: (i),
                    ...{ class: "p-upload-item" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                    src: (img),
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ onClick: (...[$event]) => {
                            if (!(__VLS_ctx.isEditMode))
                                return;
                            if (!(__VLS_ctx.form.items[0].channel === '供应商'))
                                return;
                            if (!(['支付宝', '微信'].includes(__VLS_ctx.form.items[0].paymentMethod)))
                                return;
                            __VLS_ctx.removeImage(__VLS_ctx.form.items[0], 'paymentQrCodes', i);
                        } },
                    ...{ class: "p-upload-mask" },
                });
                const __VLS_327 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_328 = __VLS_asFunctionalComponent(__VLS_327, new __VLS_327({}));
                const __VLS_329 = __VLS_328({}, ...__VLS_functionalComponentArgsRest(__VLS_328));
                __VLS_330.slots.default;
                const __VLS_331 = {}.Delete;
                /** @type {[typeof __VLS_components.Delete, ]} */ ;
                // @ts-ignore
                const __VLS_332 = __VLS_asFunctionalComponent(__VLS_331, new __VLS_331({}));
                const __VLS_333 = __VLS_332({}, ...__VLS_functionalComponentArgsRest(__VLS_332));
                var __VLS_330;
            }
            if (__VLS_ctx.form.items[0].paymentQrCodes.length === 0) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "p-upload-add" },
                });
                const __VLS_335 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_336 = __VLS_asFunctionalComponent(__VLS_335, new __VLS_335({}));
                const __VLS_337 = __VLS_336({}, ...__VLS_functionalComponentArgsRest(__VLS_336));
                __VLS_338.slots.default;
                const __VLS_339 = {}.Picture;
                /** @type {[typeof __VLS_components.Picture, ]} */ ;
                // @ts-ignore
                const __VLS_340 = __VLS_asFunctionalComponent(__VLS_339, new __VLS_339({}));
                const __VLS_341 = __VLS_340({}, ...__VLS_functionalComponentArgsRest(__VLS_340));
                var __VLS_338;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            }
            var __VLS_326;
            var __VLS_322;
            var __VLS_318;
        }
        var __VLS_254;
    }
    if (__VLS_ctx.form.items[0].feeType === '开模费') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "form-section" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar cyan" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        const __VLS_343 = {}.ElRow;
        /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
        // @ts-ignore
        const __VLS_344 = __VLS_asFunctionalComponent(__VLS_343, new __VLS_343({
            gutter: (24),
        }));
        const __VLS_345 = __VLS_344({
            gutter: (24),
        }, ...__VLS_functionalComponentArgsRest(__VLS_344));
        __VLS_346.slots.default;
        const __VLS_347 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_348 = __VLS_asFunctionalComponent(__VLS_347, new __VLS_347({
            span: (8),
        }));
        const __VLS_349 = __VLS_348({
            span: (8),
        }, ...__VLS_functionalComponentArgsRest(__VLS_348));
        __VLS_350.slots.default;
        const __VLS_351 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_352 = __VLS_asFunctionalComponent(__VLS_351, new __VLS_351({
            label: "合同文件",
            required: true,
            prop: "items.0.contractFiles",
            rules: ({ required: true, type: 'array', message: '请上传合同文件', trigger: 'change' }),
        }));
        const __VLS_353 = __VLS_352({
            label: "合同文件",
            required: true,
            prop: "items.0.contractFiles",
            rules: ({ required: true, type: 'array', message: '请上传合同文件', trigger: 'change' }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_352));
        __VLS_354.slots.default;
        const __VLS_355 = {}.ElUpload;
        /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
        // @ts-ignore
        const __VLS_356 = __VLS_asFunctionalComponent(__VLS_355, new __VLS_355({
            action: "#",
            autoUpload: (false),
            fileList: (__VLS_ctx.form.items[0].contractFiles),
        }));
        const __VLS_357 = __VLS_356({
            action: "#",
            autoUpload: (false),
            fileList: (__VLS_ctx.form.items[0].contractFiles),
        }, ...__VLS_functionalComponentArgsRest(__VLS_356));
        __VLS_358.slots.default;
        const __VLS_359 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_360 = __VLS_asFunctionalComponent(__VLS_359, new __VLS_359({
            type: "primary",
            size: "small",
            plain: true,
            icon: (__VLS_ctx.Upload),
        }));
        const __VLS_361 = __VLS_360({
            type: "primary",
            size: "small",
            plain: true,
            icon: (__VLS_ctx.Upload),
        }, ...__VLS_functionalComponentArgsRest(__VLS_360));
        __VLS_362.slots.default;
        var __VLS_362;
        var __VLS_358;
        var __VLS_354;
        var __VLS_350;
        const __VLS_363 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_364 = __VLS_asFunctionalComponent(__VLS_363, new __VLS_363({
            span: (8),
        }));
        const __VLS_365 = __VLS_364({
            span: (8),
        }, ...__VLS_functionalComponentArgsRest(__VLS_364));
        __VLS_366.slots.default;
        const __VLS_367 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_368 = __VLS_asFunctionalComponent(__VLS_367, new __VLS_367({
            label: "合同金额",
            required: true,
            prop: "items.0.contractAmount",
            rules: ({ required: true, message: '请输入合同金额', trigger: 'blur' }),
        }));
        const __VLS_369 = __VLS_368({
            label: "合同金额",
            required: true,
            prop: "items.0.contractAmount",
            rules: ({ required: true, message: '请输入合同金额', trigger: 'blur' }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_368));
        __VLS_370.slots.default;
        const __VLS_371 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_372 = __VLS_asFunctionalComponent(__VLS_371, new __VLS_371({
            modelValue: (__VLS_ctx.form.items[0].contractAmount),
            min: (0),
            precision: (2),
            controls: (false),
            placeholder: "请输入合同金额",
            ...{ class: "w-full" },
        }));
        const __VLS_373 = __VLS_372({
            modelValue: (__VLS_ctx.form.items[0].contractAmount),
            min: (0),
            precision: (2),
            controls: (false),
            placeholder: "请输入合同金额",
            ...{ class: "w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_372));
        __VLS_374.slots.default;
        {
            const { append: __VLS_thisSlot } = __VLS_374.slots;
        }
        var __VLS_374;
        var __VLS_370;
        var __VLS_366;
        const __VLS_375 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_376 = __VLS_asFunctionalComponent(__VLS_375, new __VLS_375({
            span: (8),
        }));
        const __VLS_377 = __VLS_376({
            span: (8),
        }, ...__VLS_functionalComponentArgsRest(__VLS_376));
        __VLS_378.slots.default;
        const __VLS_379 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_380 = __VLS_asFunctionalComponent(__VLS_379, new __VLS_379({
            label: "合同备注",
            prop: "items.0.contractRemark",
        }));
        const __VLS_381 = __VLS_380({
            label: "合同备注",
            prop: "items.0.contractRemark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_380));
        __VLS_382.slots.default;
        const __VLS_383 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_384 = __VLS_asFunctionalComponent(__VLS_383, new __VLS_383({
            modelValue: (__VLS_ctx.form.items[0].contractRemark),
            placeholder: "请输入合同备注",
        }));
        const __VLS_385 = __VLS_384({
            modelValue: (__VLS_ctx.form.items[0].contractRemark),
            placeholder: "请输入合同备注",
        }, ...__VLS_functionalComponentArgsRest(__VLS_384));
        var __VLS_382;
        var __VLS_378;
        var __VLS_346;
    }
    if (__VLS_ctx.form.items[0].channel !== '供应商') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "form-section" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar green" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "attachments-upload-grid" },
        });
        const __VLS_387 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_388 = __VLS_asFunctionalComponent(__VLS_387, new __VLS_387({
            label: "样品图片",
            prop: "items.0.sampleImages",
        }));
        const __VLS_389 = __VLS_388({
            label: "样品图片",
            prop: "items.0.sampleImages",
        }, ...__VLS_functionalComponentArgsRest(__VLS_388));
        __VLS_390.slots.default;
        const __VLS_391 = {}.ElUpload;
        /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
        // @ts-ignore
        const __VLS_392 = __VLS_asFunctionalComponent(__VLS_391, new __VLS_391({
            action: "#",
            autoUpload: (false),
            showFileList: (false),
            onChange: ((file) => __VLS_ctx.handleImageSuccess(file, __VLS_ctx.form.items[0], 'sampleImages')),
            ...{ class: "p-upload-inline" },
        }));
        const __VLS_393 = __VLS_392({
            action: "#",
            autoUpload: (false),
            showFileList: (false),
            onChange: ((file) => __VLS_ctx.handleImageSuccess(file, __VLS_ctx.form.items[0], 'sampleImages')),
            ...{ class: "p-upload-inline" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_392));
        __VLS_394.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-upload-grid" },
        });
        for (const [img, i] of __VLS_getVForSourceType((__VLS_ctx.form.items[0].sampleImages))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (i),
                ...{ class: "p-upload-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (img),
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.isEditMode))
                            return;
                        if (!(__VLS_ctx.form.items[0].channel !== '供应商'))
                            return;
                        __VLS_ctx.removeImage(__VLS_ctx.form.items[0], 'sampleImages', i);
                    } },
                ...{ class: "p-upload-mask" },
            });
            const __VLS_395 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_396 = __VLS_asFunctionalComponent(__VLS_395, new __VLS_395({}));
            const __VLS_397 = __VLS_396({}, ...__VLS_functionalComponentArgsRest(__VLS_396));
            __VLS_398.slots.default;
            const __VLS_399 = {}.Delete;
            /** @type {[typeof __VLS_components.Delete, ]} */ ;
            // @ts-ignore
            const __VLS_400 = __VLS_asFunctionalComponent(__VLS_399, new __VLS_399({}));
            const __VLS_401 = __VLS_400({}, ...__VLS_functionalComponentArgsRest(__VLS_400));
            var __VLS_398;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-upload-add" },
        });
        const __VLS_403 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_404 = __VLS_asFunctionalComponent(__VLS_403, new __VLS_403({}));
        const __VLS_405 = __VLS_404({}, ...__VLS_functionalComponentArgsRest(__VLS_404));
        __VLS_406.slots.default;
        const __VLS_407 = {}.Picture;
        /** @type {[typeof __VLS_components.Picture, ]} */ ;
        // @ts-ignore
        const __VLS_408 = __VLS_asFunctionalComponent(__VLS_407, new __VLS_407({}));
        const __VLS_409 = __VLS_408({}, ...__VLS_functionalComponentArgsRest(__VLS_408));
        var __VLS_406;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        var __VLS_394;
        var __VLS_390;
        const __VLS_411 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_412 = __VLS_asFunctionalComponent(__VLS_411, new __VLS_411({
            label: "订单截图",
            prop: "items.0.orderScreenshots",
        }));
        const __VLS_413 = __VLS_412({
            label: "订单截图",
            prop: "items.0.orderScreenshots",
        }, ...__VLS_functionalComponentArgsRest(__VLS_412));
        __VLS_414.slots.default;
        const __VLS_415 = {}.ElUpload;
        /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
        // @ts-ignore
        const __VLS_416 = __VLS_asFunctionalComponent(__VLS_415, new __VLS_415({
            action: "#",
            autoUpload: (false),
            showFileList: (false),
            onChange: ((file) => __VLS_ctx.handleImageSuccess(file, __VLS_ctx.form.items[0], 'orderScreenshots')),
            ...{ class: "p-upload-inline" },
        }));
        const __VLS_417 = __VLS_416({
            action: "#",
            autoUpload: (false),
            showFileList: (false),
            onChange: ((file) => __VLS_ctx.handleImageSuccess(file, __VLS_ctx.form.items[0], 'orderScreenshots')),
            ...{ class: "p-upload-inline" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_416));
        __VLS_418.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-upload-grid" },
        });
        for (const [img, i] of __VLS_getVForSourceType((__VLS_ctx.form.items[0].orderScreenshots))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (i),
                ...{ class: "p-upload-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (img),
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.isEditMode))
                            return;
                        if (!(__VLS_ctx.form.items[0].channel !== '供应商'))
                            return;
                        __VLS_ctx.removeImage(__VLS_ctx.form.items[0], 'orderScreenshots', i);
                    } },
                ...{ class: "p-upload-mask" },
            });
            const __VLS_419 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_420 = __VLS_asFunctionalComponent(__VLS_419, new __VLS_419({}));
            const __VLS_421 = __VLS_420({}, ...__VLS_functionalComponentArgsRest(__VLS_420));
            __VLS_422.slots.default;
            const __VLS_423 = {}.Delete;
            /** @type {[typeof __VLS_components.Delete, ]} */ ;
            // @ts-ignore
            const __VLS_424 = __VLS_asFunctionalComponent(__VLS_423, new __VLS_423({}));
            const __VLS_425 = __VLS_424({}, ...__VLS_functionalComponentArgsRest(__VLS_424));
            var __VLS_422;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-upload-add" },
        });
        const __VLS_427 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_428 = __VLS_asFunctionalComponent(__VLS_427, new __VLS_427({}));
        const __VLS_429 = __VLS_428({}, ...__VLS_functionalComponentArgsRest(__VLS_428));
        __VLS_430.slots.default;
        const __VLS_431 = {}.Camera;
        /** @type {[typeof __VLS_components.Camera, ]} */ ;
        // @ts-ignore
        const __VLS_432 = __VLS_asFunctionalComponent(__VLS_431, new __VLS_431({}));
        const __VLS_433 = __VLS_432({}, ...__VLS_functionalComponentArgsRest(__VLS_432));
        var __VLS_430;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        var __VLS_418;
        var __VLS_414;
    }
    var __VLS_16;
}
else {
    const __VLS_435 = {}.ElTabs;
    /** @type {[typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ]} */ ;
    // @ts-ignore
    const __VLS_436 = __VLS_asFunctionalComponent(__VLS_435, new __VLS_435({
        ...{ 'onTabAdd': {} },
        ...{ 'onTabRemove': {} },
        modelValue: (__VLS_ctx.activeTab),
        type: "border-card",
        addable: true,
        ...{ class: "feedback-tabs" },
    }));
    const __VLS_437 = __VLS_436({
        ...{ 'onTabAdd': {} },
        ...{ 'onTabRemove': {} },
        modelValue: (__VLS_ctx.activeTab),
        type: "border-card",
        addable: true,
        ...{ class: "feedback-tabs" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_436));
    let __VLS_439;
    let __VLS_440;
    let __VLS_441;
    const __VLS_442 = {
        onTabAdd: (__VLS_ctx.addItem)
    };
    const __VLS_443 = {
        onTabRemove: (__VLS_ctx.removeItemByTab)
    };
    __VLS_438.slots.default;
    for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.form.items))) {
        const __VLS_444 = {}.ElTabPane;
        /** @type {[typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ]} */ ;
        // @ts-ignore
        const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({
            key: (item.id),
            label: ('购样方案 ' + (index + 1)),
            name: (item.id),
            closable: (__VLS_ctx.form.items.length > 1),
        }));
        const __VLS_446 = __VLS_445({
            key: (item.id),
            label: ('购样方案 ' + (index + 1)),
            name: (item.id),
            closable: (__VLS_ctx.form.items.length > 1),
        }, ...__VLS_functionalComponentArgsRest(__VLS_445));
        __VLS_447.slots.default;
        const __VLS_448 = {}.ElForm;
        /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
        // @ts-ignore
        const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({
            model: (__VLS_ctx.form),
            ref: "formRef",
            labelPosition: "left",
            labelWidth: "100px",
            ...{ class: "feedback-form custom-form" },
        }));
        const __VLS_450 = __VLS_449({
            model: (__VLS_ctx.form),
            ref: "formRef",
            labelPosition: "left",
            labelWidth: "100px",
            ...{ class: "feedback-form custom-form" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_449));
        /** @type {typeof __VLS_ctx.formRef} */ ;
        var __VLS_452 = {};
        __VLS_451.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "form-section" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar blue" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        const __VLS_454 = {}.ElRow;
        /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
        // @ts-ignore
        const __VLS_455 = __VLS_asFunctionalComponent(__VLS_454, new __VLS_454({
            gutter: (24),
        }));
        const __VLS_456 = __VLS_455({
            gutter: (24),
        }, ...__VLS_functionalComponentArgsRest(__VLS_455));
        __VLS_457.slots.default;
        const __VLS_458 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_459 = __VLS_asFunctionalComponent(__VLS_458, new __VLS_458({
            span: (6),
        }));
        const __VLS_460 = __VLS_459({
            span: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_459));
        __VLS_461.slots.default;
        const __VLS_462 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_463 = __VLS_asFunctionalComponent(__VLS_462, new __VLS_462({
            label: "拿样渠道",
            required: true,
            prop: ('items.' + index + '.channel'),
            rules: ({ required: true, message: '请选择渠道', trigger: 'change' }),
        }));
        const __VLS_464 = __VLS_463({
            label: "拿样渠道",
            required: true,
            prop: ('items.' + index + '.channel'),
            rules: ({ required: true, message: '请选择渠道', trigger: 'change' }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_463));
        __VLS_465.slots.default;
        const __VLS_466 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_467 = __VLS_asFunctionalComponent(__VLS_466, new __VLS_466({
            modelValue: (item.channel),
            placeholder: "请选择",
            ...{ class: "w-full" },
        }));
        const __VLS_468 = __VLS_467({
            modelValue: (item.channel),
            placeholder: "请选择",
            ...{ class: "w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_467));
        __VLS_469.slots.default;
        const __VLS_470 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_471 = __VLS_asFunctionalComponent(__VLS_470, new __VLS_470({
            label: "供应商",
            value: "供应商",
        }));
        const __VLS_472 = __VLS_471({
            label: "供应商",
            value: "供应商",
        }, ...__VLS_functionalComponentArgsRest(__VLS_471));
        const __VLS_474 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_475 = __VLS_asFunctionalComponent(__VLS_474, new __VLS_474({
            label: "1688",
            value: "1688",
        }));
        const __VLS_476 = __VLS_475({
            label: "1688",
            value: "1688",
        }, ...__VLS_functionalComponentArgsRest(__VLS_475));
        const __VLS_478 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_479 = __VLS_asFunctionalComponent(__VLS_478, new __VLS_478({
            label: "淘宝",
            value: "淘宝",
        }));
        const __VLS_480 = __VLS_479({
            label: "淘宝",
            value: "淘宝",
        }, ...__VLS_functionalComponentArgsRest(__VLS_479));
        var __VLS_469;
        var __VLS_465;
        var __VLS_461;
        if (item.channel === '供应商') {
            const __VLS_482 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_483 = __VLS_asFunctionalComponent(__VLS_482, new __VLS_482({
                span: (6),
            }));
            const __VLS_484 = __VLS_483({
                span: (6),
            }, ...__VLS_functionalComponentArgsRest(__VLS_483));
            __VLS_485.slots.default;
            const __VLS_486 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_487 = __VLS_asFunctionalComponent(__VLS_486, new __VLS_486({
                label: "供应商类型",
                required: true,
                prop: ('items.' + index + '.supplierType'),
                rules: ({ required: true, message: '请选择类型', trigger: 'change' }),
            }));
            const __VLS_488 = __VLS_487({
                label: "供应商类型",
                required: true,
                prop: ('items.' + index + '.supplierType'),
                rules: ({ required: true, message: '请选择类型', trigger: 'change' }),
            }, ...__VLS_functionalComponentArgsRest(__VLS_487));
            __VLS_489.slots.default;
            const __VLS_490 = {}.ElSelect;
            /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
            // @ts-ignore
            const __VLS_491 = __VLS_asFunctionalComponent(__VLS_490, new __VLS_490({
                modelValue: (item.supplierType),
                placeholder: "请选择",
                ...{ class: "w-full" },
            }));
            const __VLS_492 = __VLS_491({
                modelValue: (item.supplierType),
                placeholder: "请选择",
                ...{ class: "w-full" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_491));
            __VLS_493.slots.default;
            const __VLS_494 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_495 = __VLS_asFunctionalComponent(__VLS_494, new __VLS_494({
                label: "正式供应商",
                value: "正式",
            }));
            const __VLS_496 = __VLS_495({
                label: "正式供应商",
                value: "正式",
            }, ...__VLS_functionalComponentArgsRest(__VLS_495));
            const __VLS_498 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_499 = __VLS_asFunctionalComponent(__VLS_498, new __VLS_498({
                label: "临时供应商",
                value: "临时",
            }));
            const __VLS_500 = __VLS_499({
                label: "临时供应商",
                value: "临时",
            }, ...__VLS_functionalComponentArgsRest(__VLS_499));
            var __VLS_493;
            var __VLS_489;
            var __VLS_485;
            const __VLS_502 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_503 = __VLS_asFunctionalComponent(__VLS_502, new __VLS_502({
                span: (6),
            }));
            const __VLS_504 = __VLS_503({
                span: (6),
            }, ...__VLS_functionalComponentArgsRest(__VLS_503));
            __VLS_505.slots.default;
            const __VLS_506 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_507 = __VLS_asFunctionalComponent(__VLS_506, new __VLS_506({
                label: "供应商",
                required: true,
                prop: ('items.' + index + '.supplier'),
                rules: ({ required: true, message: '请输入供应商', trigger: 'blur' }),
            }));
            const __VLS_508 = __VLS_507({
                label: "供应商",
                required: true,
                prop: ('items.' + index + '.supplier'),
                rules: ({ required: true, message: '请输入供应商', trigger: 'blur' }),
            }, ...__VLS_functionalComponentArgsRest(__VLS_507));
            __VLS_509.slots.default;
            if (item.supplierType === '正式') {
                const __VLS_510 = {}.ElSelect;
                /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
                // @ts-ignore
                const __VLS_511 = __VLS_asFunctionalComponent(__VLS_510, new __VLS_510({
                    ...{ 'onChange': {} },
                    modelValue: (item.supplier),
                    placeholder: "选择供应商",
                    ...{ class: "w-full" },
                }));
                const __VLS_512 = __VLS_511({
                    ...{ 'onChange': {} },
                    modelValue: (item.supplier),
                    placeholder: "选择供应商",
                    ...{ class: "w-full" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_511));
                let __VLS_514;
                let __VLS_515;
                let __VLS_516;
                const __VLS_517 = {
                    onChange: ((val) => __VLS_ctx.handleSupplierChange(val, item))
                };
                __VLS_513.slots.default;
                for (const [s] of __VLS_getVForSourceType((__VLS_ctx.formalSuppliers))) {
                    const __VLS_518 = {}.ElOption;
                    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
                    // @ts-ignore
                    const __VLS_519 = __VLS_asFunctionalComponent(__VLS_518, new __VLS_518({
                        key: (s.value),
                        label: (s.label),
                        value: (s.label),
                    }));
                    const __VLS_520 = __VLS_519({
                        key: (s.value),
                        label: (s.label),
                        value: (s.label),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_519));
                }
                var __VLS_513;
            }
            else {
                const __VLS_522 = {}.ElInput;
                /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
                // @ts-ignore
                const __VLS_523 = __VLS_asFunctionalComponent(__VLS_522, new __VLS_522({
                    modelValue: (item.supplier),
                    placeholder: "输入名称",
                }));
                const __VLS_524 = __VLS_523({
                    modelValue: (item.supplier),
                    placeholder: "输入名称",
                }, ...__VLS_functionalComponentArgsRest(__VLS_523));
            }
            var __VLS_509;
            var __VLS_505;
            const __VLS_526 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_527 = __VLS_asFunctionalComponent(__VLS_526, new __VLS_526({
                span: (6),
            }));
            const __VLS_528 = __VLS_527({
                span: (6),
            }, ...__VLS_functionalComponentArgsRest(__VLS_527));
            __VLS_529.slots.default;
            const __VLS_530 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_531 = __VLS_asFunctionalComponent(__VLS_530, new __VLS_530({
                label: "货源地",
                required: true,
                prop: ('items.' + index + '.source'),
                rules: ({ required: true, message: '请选择或输入货源地', trigger: 'blur' }),
            }));
            const __VLS_532 = __VLS_531({
                label: "货源地",
                required: true,
                prop: ('items.' + index + '.source'),
                rules: ({ required: true, message: '请选择或输入货源地', trigger: 'blur' }),
            }, ...__VLS_functionalComponentArgsRest(__VLS_531));
            __VLS_533.slots.default;
            const __VLS_534 = {}.ElSelect;
            /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
            // @ts-ignore
            const __VLS_535 = __VLS_asFunctionalComponent(__VLS_534, new __VLS_534({
                modelValue: (item.source),
                placeholder: "请选择",
                ...{ class: "w-full" },
                disabled: (item.supplierType === '正式'),
            }));
            const __VLS_536 = __VLS_535({
                modelValue: (item.source),
                placeholder: "请选择",
                ...{ class: "w-full" },
                disabled: (item.supplierType === '正式'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_535));
            __VLS_537.slots.default;
            const __VLS_538 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_539 = __VLS_asFunctionalComponent(__VLS_538, new __VLS_538({
                label: "广东深圳",
                value: "广东深圳",
            }));
            const __VLS_540 = __VLS_539({
                label: "广东深圳",
                value: "广东深圳",
            }, ...__VLS_functionalComponentArgsRest(__VLS_539));
            const __VLS_542 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_543 = __VLS_asFunctionalComponent(__VLS_542, new __VLS_542({
                label: "浙江义乌",
                value: "浙江义乌",
            }));
            const __VLS_544 = __VLS_543({
                label: "浙江义乌",
                value: "浙江义乌",
            }, ...__VLS_functionalComponentArgsRest(__VLS_543));
            const __VLS_546 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_547 = __VLS_asFunctionalComponent(__VLS_546, new __VLS_546({
                label: "江苏苏州",
                value: "江苏苏州",
            }));
            const __VLS_548 = __VLS_547({
                label: "江苏苏州",
                value: "江苏苏州",
            }, ...__VLS_functionalComponentArgsRest(__VLS_547));
            const __VLS_550 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_551 = __VLS_asFunctionalComponent(__VLS_550, new __VLS_550({
                label: "福建泉州",
                value: "福建泉州",
            }));
            const __VLS_552 = __VLS_551({
                label: "福建泉州",
                value: "福建泉州",
            }, ...__VLS_functionalComponentArgsRest(__VLS_551));
            const __VLS_554 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_555 = __VLS_asFunctionalComponent(__VLS_554, new __VLS_554({
                label: "山东临沂",
                value: "山东临沂",
            }));
            const __VLS_556 = __VLS_555({
                label: "山东临沂",
                value: "山东临沂",
            }, ...__VLS_functionalComponentArgsRest(__VLS_555));
            var __VLS_537;
            var __VLS_533;
            var __VLS_529;
        }
        else {
            const __VLS_558 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_559 = __VLS_asFunctionalComponent(__VLS_558, new __VLS_558({
                span: (14),
            }));
            const __VLS_560 = __VLS_559({
                span: (14),
            }, ...__VLS_functionalComponentArgsRest(__VLS_559));
            __VLS_561.slots.default;
            const __VLS_562 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_563 = __VLS_asFunctionalComponent(__VLS_562, new __VLS_562({
                label: "购买链接",
                required: true,
                prop: ('items.' + index + '.purchaseUrl'),
                rules: ({ required: true, message: '请输入购买链接', trigger: 'blur' }),
            }));
            const __VLS_564 = __VLS_563({
                label: "购买链接",
                required: true,
                prop: ('items.' + index + '.purchaseUrl'),
                rules: ({ required: true, message: '请输入购买链接', trigger: 'blur' }),
            }, ...__VLS_functionalComponentArgsRest(__VLS_563));
            __VLS_565.slots.default;
            const __VLS_566 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_567 = __VLS_asFunctionalComponent(__VLS_566, new __VLS_566({
                modelValue: (item.purchaseUrl),
                placeholder: "粘贴 1688 或 淘宝 购买链接",
            }));
            const __VLS_568 = __VLS_567({
                modelValue: (item.purchaseUrl),
                placeholder: "粘贴 1688 或 淘宝 购买链接",
            }, ...__VLS_functionalComponentArgsRest(__VLS_567));
            var __VLS_565;
            var __VLS_561;
        }
        var __VLS_457;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "form-section" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar orange" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        const __VLS_570 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_571 = __VLS_asFunctionalComponent(__VLS_570, new __VLS_570({
            type: "warning",
            size: "small",
            effect: "light",
            ...{ style: {} },
        }));
        const __VLS_572 = __VLS_571({
            type: "warning",
            size: "small",
            effect: "light",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_571));
        __VLS_573.slots.default;
        (item.feeType);
        var __VLS_573;
        const __VLS_574 = {}.ElRow;
        /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
        // @ts-ignore
        const __VLS_575 = __VLS_asFunctionalComponent(__VLS_574, new __VLS_574({
            gutter: (24),
        }));
        const __VLS_576 = __VLS_575({
            gutter: (24),
        }, ...__VLS_functionalComponentArgsRest(__VLS_575));
        __VLS_577.slots.default;
        const __VLS_578 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_579 = __VLS_asFunctionalComponent(__VLS_578, new __VLS_578({
            span: (6),
        }));
        const __VLS_580 = __VLS_579({
            span: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_579));
        __VLS_581.slots.default;
        const __VLS_582 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_583 = __VLS_asFunctionalComponent(__VLS_582, new __VLS_582({
            label: "样品名称",
            prop: ('items.' + index + '.sampleName'),
        }));
        const __VLS_584 = __VLS_583({
            label: "样品名称",
            prop: ('items.' + index + '.sampleName'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_583));
        __VLS_585.slots.default;
        const __VLS_586 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_587 = __VLS_asFunctionalComponent(__VLS_586, new __VLS_586({
            modelValue: (item.sampleName),
            placeholder: "输入样品名称",
        }));
        const __VLS_588 = __VLS_587({
            modelValue: (item.sampleName),
            placeholder: "输入样品名称",
        }, ...__VLS_functionalComponentArgsRest(__VLS_587));
        var __VLS_585;
        var __VLS_581;
        const __VLS_590 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_591 = __VLS_asFunctionalComponent(__VLS_590, new __VLS_590({
            span: (6),
        }));
        const __VLS_592 = __VLS_591({
            span: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_591));
        __VLS_593.slots.default;
        const __VLS_594 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_595 = __VLS_asFunctionalComponent(__VLS_594, new __VLS_594({
            label: "购样数量",
            required: true,
            prop: ('items.' + index + '.quantity'),
            rules: ({ required: true, message: '请输入数量', trigger: 'blur' }),
        }));
        const __VLS_596 = __VLS_595({
            label: "购样数量",
            required: true,
            prop: ('items.' + index + '.quantity'),
            rules: ({ required: true, message: '请输入数量', trigger: 'blur' }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_595));
        __VLS_597.slots.default;
        const __VLS_598 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_599 = __VLS_asFunctionalComponent(__VLS_598, new __VLS_598({
            modelValue: (item.quantity),
            min: (1),
            controls: (false),
            ...{ class: "w-full" },
        }));
        const __VLS_600 = __VLS_599({
            modelValue: (item.quantity),
            min: (1),
            controls: (false),
            ...{ class: "w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_599));
        var __VLS_597;
        var __VLS_593;
        const __VLS_602 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_603 = __VLS_asFunctionalComponent(__VLS_602, new __VLS_602({
            span: (6),
        }));
        const __VLS_604 = __VLS_603({
            span: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_603));
        __VLS_605.slots.default;
        const __VLS_606 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_607 = __VLS_asFunctionalComponent(__VLS_606, new __VLS_606({
            label: "费用(单价)",
            required: true,
            prop: ('items.' + index + '.price'),
            rules: ({ required: true, message: '请输入费用', trigger: 'blur' }),
        }));
        const __VLS_608 = __VLS_607({
            label: "费用(单价)",
            required: true,
            prop: ('items.' + index + '.price'),
            rules: ({ required: true, message: '请输入费用', trigger: 'blur' }),
        }, ...__VLS_functionalComponentArgsRest(__VLS_607));
        __VLS_609.slots.default;
        const __VLS_610 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_611 = __VLS_asFunctionalComponent(__VLS_610, new __VLS_610({
            modelValue: (item.price),
            min: (0),
            precision: (2),
            controls: (false),
            ...{ class: "w-full" },
        }));
        const __VLS_612 = __VLS_611({
            modelValue: (item.price),
            min: (0),
            precision: (2),
            controls: (false),
            ...{ class: "w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_611));
        __VLS_613.slots.default;
        {
            const { append: __VLS_thisSlot } = __VLS_613.slots;
        }
        var __VLS_613;
        var __VLS_609;
        var __VLS_605;
        const __VLS_614 = {}.ElCol;
        /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
        // @ts-ignore
        const __VLS_615 = __VLS_asFunctionalComponent(__VLS_614, new __VLS_614({
            span: (6),
        }));
        const __VLS_616 = __VLS_615({
            span: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_615));
        __VLS_617.slots.default;
        const __VLS_618 = {}.ElFormItem;
        /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
        // @ts-ignore
        const __VLS_619 = __VLS_asFunctionalComponent(__VLS_618, new __VLS_618({
            label: "费用合计",
        }));
        const __VLS_620 = __VLS_619({
            label: "费用合计",
        }, ...__VLS_functionalComponentArgsRest(__VLS_619));
        __VLS_621.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "total-price-text" },
        });
        ((item.quantity * item.price).toFixed(2));
        var __VLS_621;
        var __VLS_617;
        var __VLS_577;
        if (item.channel === '供应商') {
            const __VLS_622 = {}.ElRow;
            /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
            // @ts-ignore
            const __VLS_623 = __VLS_asFunctionalComponent(__VLS_622, new __VLS_622({
                gutter: (24),
            }));
            const __VLS_624 = __VLS_623({
                gutter: (24),
            }, ...__VLS_functionalComponentArgsRest(__VLS_623));
            __VLS_625.slots.default;
            const __VLS_626 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_627 = __VLS_asFunctionalComponent(__VLS_626, new __VLS_626({
                span: (6),
            }));
            const __VLS_628 = __VLS_627({
                span: (6),
            }, ...__VLS_functionalComponentArgsRest(__VLS_627));
            __VLS_629.slots.default;
            const __VLS_630 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_631 = __VLS_asFunctionalComponent(__VLS_630, new __VLS_630({
                label: "是否可退款",
            }));
            const __VLS_632 = __VLS_631({
                label: "是否可退款",
            }, ...__VLS_functionalComponentArgsRest(__VLS_631));
            __VLS_633.slots.default;
            const __VLS_634 = {}.ElSwitch;
            /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
            // @ts-ignore
            const __VLS_635 = __VLS_asFunctionalComponent(__VLS_634, new __VLS_634({
                modelValue: (item.isRefundable),
                inlinePrompt: true,
                activeText: "是",
                inactiveText: "否",
            }));
            const __VLS_636 = __VLS_635({
                modelValue: (item.isRefundable),
                inlinePrompt: true,
                activeText: "是",
                inactiveText: "否",
            }, ...__VLS_functionalComponentArgsRest(__VLS_635));
            var __VLS_633;
            var __VLS_629;
            if (item.isRefundable) {
                const __VLS_638 = {}.ElCol;
                /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
                // @ts-ignore
                const __VLS_639 = __VLS_asFunctionalComponent(__VLS_638, new __VLS_638({
                    span: (6),
                }));
                const __VLS_640 = __VLS_639({
                    span: (6),
                }, ...__VLS_functionalComponentArgsRest(__VLS_639));
                __VLS_641.slots.default;
                const __VLS_642 = {}.ElFormItem;
                /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
                // @ts-ignore
                const __VLS_643 = __VLS_asFunctionalComponent(__VLS_642, new __VLS_642({
                    label: "退款方式",
                    required: true,
                }));
                const __VLS_644 = __VLS_643({
                    label: "退款方式",
                    required: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_643));
                __VLS_645.slots.default;
                const __VLS_646 = {}.ElSelect;
                /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
                // @ts-ignore
                const __VLS_647 = __VLS_asFunctionalComponent(__VLS_646, new __VLS_646({
                    modelValue: (item.refundMethod),
                    placeholder: "请选择",
                    ...{ class: "w-full" },
                }));
                const __VLS_648 = __VLS_647({
                    modelValue: (item.refundMethod),
                    placeholder: "请选择",
                    ...{ class: "w-full" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_647));
                __VLS_649.slots.default;
                const __VLS_650 = {}.ElOption;
                /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
                // @ts-ignore
                const __VLS_651 = __VLS_asFunctionalComponent(__VLS_650, new __VLS_650({
                    label: "首单退款",
                    value: "first_order",
                }));
                const __VLS_652 = __VLS_651({
                    label: "首单退款",
                    value: "first_order",
                }, ...__VLS_functionalComponentArgsRest(__VLS_651));
                const __VLS_654 = {}.ElOption;
                /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
                // @ts-ignore
                const __VLS_655 = __VLS_asFunctionalComponent(__VLS_654, new __VLS_654({
                    label: "订单量退款",
                    value: "order_volume",
                }));
                const __VLS_656 = __VLS_655({
                    label: "订单量退款",
                    value: "order_volume",
                }, ...__VLS_functionalComponentArgsRest(__VLS_655));
                const __VLS_658 = {}.ElOption;
                /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
                // @ts-ignore
                const __VLS_659 = __VLS_asFunctionalComponent(__VLS_658, new __VLS_658({
                    label: "订单金额退款",
                    value: "order_amount",
                }));
                const __VLS_660 = __VLS_659({
                    label: "订单金额退款",
                    value: "order_amount",
                }, ...__VLS_functionalComponentArgsRest(__VLS_659));
                var __VLS_649;
                var __VLS_645;
                var __VLS_641;
                const __VLS_662 = {}.ElCol;
                /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
                // @ts-ignore
                const __VLS_663 = __VLS_asFunctionalComponent(__VLS_662, new __VLS_662({
                    span: (6),
                }));
                const __VLS_664 = __VLS_663({
                    span: (6),
                }, ...__VLS_functionalComponentArgsRest(__VLS_663));
                __VLS_665.slots.default;
                const __VLS_666 = {}.ElFormItem;
                /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
                // @ts-ignore
                const __VLS_667 = __VLS_asFunctionalComponent(__VLS_666, new __VLS_666({
                    label: "退款条件",
                    required: true,
                    rules: ([
                        { required: ['order_volume', 'order_amount'].includes(item.refundMethod), message: '请输入退款条件', trigger: 'blur' }
                    ]),
                }));
                const __VLS_668 = __VLS_667({
                    label: "退款条件",
                    required: true,
                    rules: ([
                        { required: ['order_volume', 'order_amount'].includes(item.refundMethod), message: '请输入退款条件', trigger: 'blur' }
                    ]),
                }, ...__VLS_functionalComponentArgsRest(__VLS_667));
                __VLS_669.slots.default;
                const __VLS_670 = {}.ElInput;
                /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
                // @ts-ignore
                const __VLS_671 = __VLS_asFunctionalComponent(__VLS_670, new __VLS_670({
                    modelValue: (item.refundCondition),
                    placeholder: "请输入",
                }));
                const __VLS_672 = __VLS_671({
                    modelValue: (item.refundCondition),
                    placeholder: "请输入",
                }, ...__VLS_functionalComponentArgsRest(__VLS_671));
                var __VLS_669;
                var __VLS_665;
                const __VLS_674 = {}.ElCol;
                /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
                // @ts-ignore
                const __VLS_675 = __VLS_asFunctionalComponent(__VLS_674, new __VLS_674({
                    span: (6),
                }));
                const __VLS_676 = __VLS_675({
                    span: (6),
                }, ...__VLS_functionalComponentArgsRest(__VLS_675));
                __VLS_677.slots.default;
                if (item.refundMethod) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "refund-tip-wrapper" },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "refund-tip" },
                    });
                    const __VLS_678 = {}.ElIcon;
                    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                    // @ts-ignore
                    const __VLS_679 = __VLS_asFunctionalComponent(__VLS_678, new __VLS_678({
                        ...{ class: "mr-4" },
                    }));
                    const __VLS_680 = __VLS_679({
                        ...{ class: "mr-4" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_679));
                    __VLS_681.slots.default;
                    const __VLS_682 = {}.InfoFilled;
                    /** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
                    // @ts-ignore
                    const __VLS_683 = __VLS_asFunctionalComponent(__VLS_682, new __VLS_682({}));
                    const __VLS_684 = __VLS_683({}, ...__VLS_functionalComponentArgsRest(__VLS_683));
                    var __VLS_681;
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                    (__VLS_ctx.refundDescriptions[item.refundMethod]);
                }
                var __VLS_677;
            }
            var __VLS_625;
        }
        if (item.channel === '供应商') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "form-section" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "section-title" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "title-bar purple" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            const __VLS_686 = {}.ElRow;
            /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
            // @ts-ignore
            const __VLS_687 = __VLS_asFunctionalComponent(__VLS_686, new __VLS_686({
                gutter: (24),
            }));
            const __VLS_688 = __VLS_687({
                gutter: (24),
            }, ...__VLS_functionalComponentArgsRest(__VLS_687));
            __VLS_689.slots.default;
            const __VLS_690 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_691 = __VLS_asFunctionalComponent(__VLS_690, new __VLS_690({
                span: (6),
            }));
            const __VLS_692 = __VLS_691({
                span: (6),
            }, ...__VLS_functionalComponentArgsRest(__VLS_691));
            __VLS_693.slots.default;
            const __VLS_694 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_695 = __VLS_asFunctionalComponent(__VLS_694, new __VLS_694({
                label: "收款方式",
                required: true,
            }));
            const __VLS_696 = __VLS_695({
                label: "收款方式",
                required: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_695));
            __VLS_697.slots.default;
            const __VLS_698 = {}.ElSelect;
            /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
            // @ts-ignore
            const __VLS_699 = __VLS_asFunctionalComponent(__VLS_698, new __VLS_698({
                modelValue: (item.paymentMethod),
                placeholder: "请选择",
                ...{ class: "w-full" },
            }));
            const __VLS_700 = __VLS_699({
                modelValue: (item.paymentMethod),
                placeholder: "请选择",
                ...{ class: "w-full" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_699));
            __VLS_701.slots.default;
            const __VLS_702 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_703 = __VLS_asFunctionalComponent(__VLS_702, new __VLS_702({
                label: "银行转账",
                value: "银行转账",
            }));
            const __VLS_704 = __VLS_703({
                label: "银行转账",
                value: "银行转账",
            }, ...__VLS_functionalComponentArgsRest(__VLS_703));
            const __VLS_706 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_707 = __VLS_asFunctionalComponent(__VLS_706, new __VLS_706({
                label: "支付宝",
                value: "支付宝",
            }));
            const __VLS_708 = __VLS_707({
                label: "支付宝",
                value: "支付宝",
            }, ...__VLS_functionalComponentArgsRest(__VLS_707));
            const __VLS_710 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_711 = __VLS_asFunctionalComponent(__VLS_710, new __VLS_710({
                label: "微信",
                value: "微信",
            }));
            const __VLS_712 = __VLS_711({
                label: "微信",
                value: "微信",
            }, ...__VLS_functionalComponentArgsRest(__VLS_711));
            var __VLS_701;
            var __VLS_697;
            var __VLS_693;
            if (item.paymentMethod === '银行转账') {
                const __VLS_714 = {}.ElCol;
                /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
                // @ts-ignore
                const __VLS_715 = __VLS_asFunctionalComponent(__VLS_714, new __VLS_714({
                    span: (6),
                }));
                const __VLS_716 = __VLS_715({
                    span: (6),
                }, ...__VLS_functionalComponentArgsRest(__VLS_715));
                __VLS_717.slots.default;
                const __VLS_718 = {}.ElFormItem;
                /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
                // @ts-ignore
                const __VLS_719 = __VLS_asFunctionalComponent(__VLS_718, new __VLS_718({
                    label: "开户行",
                    required: true,
                }));
                const __VLS_720 = __VLS_719({
                    label: "开户行",
                    required: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_719));
                __VLS_721.slots.default;
                const __VLS_722 = {}.ElInput;
                /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
                // @ts-ignore
                const __VLS_723 = __VLS_asFunctionalComponent(__VLS_722, new __VLS_722({
                    modelValue: (item.bankName),
                    placeholder: "输入支行",
                }));
                const __VLS_724 = __VLS_723({
                    modelValue: (item.bankName),
                    placeholder: "输入支行",
                }, ...__VLS_functionalComponentArgsRest(__VLS_723));
                var __VLS_721;
                var __VLS_717;
                const __VLS_726 = {}.ElCol;
                /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
                // @ts-ignore
                const __VLS_727 = __VLS_asFunctionalComponent(__VLS_726, new __VLS_726({
                    span: (6),
                }));
                const __VLS_728 = __VLS_727({
                    span: (6),
                }, ...__VLS_functionalComponentArgsRest(__VLS_727));
                __VLS_729.slots.default;
                const __VLS_730 = {}.ElFormItem;
                /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
                // @ts-ignore
                const __VLS_731 = __VLS_asFunctionalComponent(__VLS_730, new __VLS_730({
                    label: "账号户名",
                    required: true,
                }));
                const __VLS_732 = __VLS_731({
                    label: "账号户名",
                    required: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_731));
                __VLS_733.slots.default;
                const __VLS_734 = {}.ElInput;
                /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
                // @ts-ignore
                const __VLS_735 = __VLS_asFunctionalComponent(__VLS_734, new __VLS_734({
                    modelValue: (item.accountName),
                    placeholder: "输入户名",
                }));
                const __VLS_736 = __VLS_735({
                    modelValue: (item.accountName),
                    placeholder: "输入户名",
                }, ...__VLS_functionalComponentArgsRest(__VLS_735));
                var __VLS_733;
                var __VLS_729;
                const __VLS_738 = {}.ElCol;
                /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
                // @ts-ignore
                const __VLS_739 = __VLS_asFunctionalComponent(__VLS_738, new __VLS_738({
                    span: (6),
                }));
                const __VLS_740 = __VLS_739({
                    span: (6),
                }, ...__VLS_functionalComponentArgsRest(__VLS_739));
                __VLS_741.slots.default;
                const __VLS_742 = {}.ElFormItem;
                /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
                // @ts-ignore
                const __VLS_743 = __VLS_asFunctionalComponent(__VLS_742, new __VLS_742({
                    label: "银行账号",
                    required: true,
                }));
                const __VLS_744 = __VLS_743({
                    label: "银行账号",
                    required: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_743));
                __VLS_745.slots.default;
                const __VLS_746 = {}.ElInput;
                /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
                // @ts-ignore
                const __VLS_747 = __VLS_asFunctionalComponent(__VLS_746, new __VLS_746({
                    modelValue: (item.bankAccount),
                    placeholder: "输入账号",
                }));
                const __VLS_748 = __VLS_747({
                    modelValue: (item.bankAccount),
                    placeholder: "输入账号",
                }, ...__VLS_functionalComponentArgsRest(__VLS_747));
                var __VLS_745;
                var __VLS_741;
            }
            if (['支付宝', '微信'].includes(item.paymentMethod)) {
                const __VLS_750 = {}.ElCol;
                /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
                // @ts-ignore
                const __VLS_751 = __VLS_asFunctionalComponent(__VLS_750, new __VLS_750({
                    span: (8),
                }));
                const __VLS_752 = __VLS_751({
                    span: (8),
                }, ...__VLS_functionalComponentArgsRest(__VLS_751));
                __VLS_753.slots.default;
                const __VLS_754 = {}.ElFormItem;
                /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
                // @ts-ignore
                const __VLS_755 = __VLS_asFunctionalComponent(__VLS_754, new __VLS_754({
                    label: "收款二维码",
                    required: (item.paymentMethod === '支付宝'),
                    prop: ('items.' + index + '.paymentQrCodes'),
                    rules: ([
                        {
                            validator: (rule, value, callback) => {
                                if (item.paymentMethod === '支付宝' && (!value || value.length === 0)) {
                                    callback(new Error('请上传收款二维码'));
                                }
                                else {
                                    callback();
                                }
                            },
                            trigger: 'change'
                        }
                    ]),
                }));
                const __VLS_756 = __VLS_755({
                    label: "收款二维码",
                    required: (item.paymentMethod === '支付宝'),
                    prop: ('items.' + index + '.paymentQrCodes'),
                    rules: ([
                        {
                            validator: (rule, value, callback) => {
                                if (item.paymentMethod === '支付宝' && (!value || value.length === 0)) {
                                    callback(new Error('请上传收款二维码'));
                                }
                                else {
                                    callback();
                                }
                            },
                            trigger: 'change'
                        }
                    ]),
                }, ...__VLS_functionalComponentArgsRest(__VLS_755));
                __VLS_757.slots.default;
                const __VLS_758 = {}.ElUpload;
                /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
                // @ts-ignore
                const __VLS_759 = __VLS_asFunctionalComponent(__VLS_758, new __VLS_758({
                    action: "#",
                    autoUpload: (false),
                    showFileList: (false),
                    onChange: ((file) => __VLS_ctx.handleImageSuccess(file, item, 'paymentQrCodes')),
                    ...{ class: "p-upload-inline" },
                }));
                const __VLS_760 = __VLS_759({
                    action: "#",
                    autoUpload: (false),
                    showFileList: (false),
                    onChange: ((file) => __VLS_ctx.handleImageSuccess(file, item, 'paymentQrCodes')),
                    ...{ class: "p-upload-inline" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_759));
                __VLS_761.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "p-upload-grid" },
                });
                for (const [img, i] of __VLS_getVForSourceType((item.paymentQrCodes))) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        key: (i),
                        ...{ class: "p-upload-item" },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                        src: (img),
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ onClick: (...[$event]) => {
                                if (!!(__VLS_ctx.isEditMode))
                                    return;
                                if (!(item.channel === '供应商'))
                                    return;
                                if (!(['支付宝', '微信'].includes(item.paymentMethod)))
                                    return;
                                __VLS_ctx.removeImage(item, 'paymentQrCodes', i);
                            } },
                        ...{ class: "p-upload-mask" },
                    });
                    const __VLS_762 = {}.ElIcon;
                    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                    // @ts-ignore
                    const __VLS_763 = __VLS_asFunctionalComponent(__VLS_762, new __VLS_762({}));
                    const __VLS_764 = __VLS_763({}, ...__VLS_functionalComponentArgsRest(__VLS_763));
                    __VLS_765.slots.default;
                    const __VLS_766 = {}.Delete;
                    /** @type {[typeof __VLS_components.Delete, ]} */ ;
                    // @ts-ignore
                    const __VLS_767 = __VLS_asFunctionalComponent(__VLS_766, new __VLS_766({}));
                    const __VLS_768 = __VLS_767({}, ...__VLS_functionalComponentArgsRest(__VLS_767));
                    var __VLS_765;
                }
                if (item.paymentQrCodes.length === 0) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "p-upload-add" },
                    });
                    const __VLS_770 = {}.ElIcon;
                    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                    // @ts-ignore
                    const __VLS_771 = __VLS_asFunctionalComponent(__VLS_770, new __VLS_770({}));
                    const __VLS_772 = __VLS_771({}, ...__VLS_functionalComponentArgsRest(__VLS_771));
                    __VLS_773.slots.default;
                    const __VLS_774 = {}.Picture;
                    /** @type {[typeof __VLS_components.Picture, ]} */ ;
                    // @ts-ignore
                    const __VLS_775 = __VLS_asFunctionalComponent(__VLS_774, new __VLS_774({}));
                    const __VLS_776 = __VLS_775({}, ...__VLS_functionalComponentArgsRest(__VLS_775));
                    var __VLS_773;
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                }
                var __VLS_761;
                var __VLS_757;
                var __VLS_753;
            }
            var __VLS_689;
        }
        if (item.feeType === '开模费') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "form-section" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "section-title" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "title-bar cyan" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            const __VLS_778 = {}.ElRow;
            /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
            // @ts-ignore
            const __VLS_779 = __VLS_asFunctionalComponent(__VLS_778, new __VLS_778({
                gutter: (24),
            }));
            const __VLS_780 = __VLS_779({
                gutter: (24),
            }, ...__VLS_functionalComponentArgsRest(__VLS_779));
            __VLS_781.slots.default;
            const __VLS_782 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_783 = __VLS_asFunctionalComponent(__VLS_782, new __VLS_782({
                span: (8),
            }));
            const __VLS_784 = __VLS_783({
                span: (8),
            }, ...__VLS_functionalComponentArgsRest(__VLS_783));
            __VLS_785.slots.default;
            const __VLS_786 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_787 = __VLS_asFunctionalComponent(__VLS_786, new __VLS_786({
                label: "合同文件",
                required: true,
                prop: ('items.' + index + '.contractFiles'),
                rules: ({ required: true, type: 'array', message: '请上传合同文件', trigger: 'change' }),
            }));
            const __VLS_788 = __VLS_787({
                label: "合同文件",
                required: true,
                prop: ('items.' + index + '.contractFiles'),
                rules: ({ required: true, type: 'array', message: '请上传合同文件', trigger: 'change' }),
            }, ...__VLS_functionalComponentArgsRest(__VLS_787));
            __VLS_789.slots.default;
            const __VLS_790 = {}.ElUpload;
            /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
            // @ts-ignore
            const __VLS_791 = __VLS_asFunctionalComponent(__VLS_790, new __VLS_790({
                action: "#",
                autoUpload: (false),
                fileList: (item.contractFiles),
            }));
            const __VLS_792 = __VLS_791({
                action: "#",
                autoUpload: (false),
                fileList: (item.contractFiles),
            }, ...__VLS_functionalComponentArgsRest(__VLS_791));
            __VLS_793.slots.default;
            const __VLS_794 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_795 = __VLS_asFunctionalComponent(__VLS_794, new __VLS_794({
                type: "primary",
                size: "small",
                plain: true,
                icon: (__VLS_ctx.Upload),
            }));
            const __VLS_796 = __VLS_795({
                type: "primary",
                size: "small",
                plain: true,
                icon: (__VLS_ctx.Upload),
            }, ...__VLS_functionalComponentArgsRest(__VLS_795));
            __VLS_797.slots.default;
            var __VLS_797;
            var __VLS_793;
            var __VLS_789;
            var __VLS_785;
            const __VLS_798 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_799 = __VLS_asFunctionalComponent(__VLS_798, new __VLS_798({
                span: (8),
            }));
            const __VLS_800 = __VLS_799({
                span: (8),
            }, ...__VLS_functionalComponentArgsRest(__VLS_799));
            __VLS_801.slots.default;
            const __VLS_802 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_803 = __VLS_asFunctionalComponent(__VLS_802, new __VLS_802({
                label: "合同金额",
                required: true,
                prop: ('items.' + index + '.contractAmount'),
                rules: ({ required: true, message: '请输入合同金额', trigger: 'blur' }),
            }));
            const __VLS_804 = __VLS_803({
                label: "合同金额",
                required: true,
                prop: ('items.' + index + '.contractAmount'),
                rules: ({ required: true, message: '请输入合同金额', trigger: 'blur' }),
            }, ...__VLS_functionalComponentArgsRest(__VLS_803));
            __VLS_805.slots.default;
            const __VLS_806 = {}.ElInputNumber;
            /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
            // @ts-ignore
            const __VLS_807 = __VLS_asFunctionalComponent(__VLS_806, new __VLS_806({
                modelValue: (item.contractAmount),
                min: (0),
                precision: (2),
                controls: (false),
                placeholder: "请输入合同金额",
                ...{ class: "w-full" },
            }));
            const __VLS_808 = __VLS_807({
                modelValue: (item.contractAmount),
                min: (0),
                precision: (2),
                controls: (false),
                placeholder: "请输入合同金额",
                ...{ class: "w-full" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_807));
            __VLS_809.slots.default;
            {
                const { append: __VLS_thisSlot } = __VLS_809.slots;
            }
            var __VLS_809;
            var __VLS_805;
            var __VLS_801;
            const __VLS_810 = {}.ElCol;
            /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
            // @ts-ignore
            const __VLS_811 = __VLS_asFunctionalComponent(__VLS_810, new __VLS_810({
                span: (8),
            }));
            const __VLS_812 = __VLS_811({
                span: (8),
            }, ...__VLS_functionalComponentArgsRest(__VLS_811));
            __VLS_813.slots.default;
            const __VLS_814 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_815 = __VLS_asFunctionalComponent(__VLS_814, new __VLS_814({
                label: "合同备注",
                prop: ('items.' + index + '.contractRemark'),
            }));
            const __VLS_816 = __VLS_815({
                label: "合同备注",
                prop: ('items.' + index + '.contractRemark'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_815));
            __VLS_817.slots.default;
            const __VLS_818 = {}.ElInput;
            /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
            // @ts-ignore
            const __VLS_819 = __VLS_asFunctionalComponent(__VLS_818, new __VLS_818({
                modelValue: (item.contractRemark),
                placeholder: "请输入合同备注",
            }));
            const __VLS_820 = __VLS_819({
                modelValue: (item.contractRemark),
                placeholder: "请输入合同备注",
            }, ...__VLS_functionalComponentArgsRest(__VLS_819));
            var __VLS_817;
            var __VLS_813;
            var __VLS_781;
        }
        if (item.channel !== '供应商') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "form-section" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "section-title" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "title-bar green" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "attachments-upload-grid" },
            });
            const __VLS_822 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_823 = __VLS_asFunctionalComponent(__VLS_822, new __VLS_822({
                label: "样品图片",
                prop: ('items.' + index + '.sampleImages'),
            }));
            const __VLS_824 = __VLS_823({
                label: "样品图片",
                prop: ('items.' + index + '.sampleImages'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_823));
            __VLS_825.slots.default;
            const __VLS_826 = {}.ElUpload;
            /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
            // @ts-ignore
            const __VLS_827 = __VLS_asFunctionalComponent(__VLS_826, new __VLS_826({
                action: "#",
                autoUpload: (false),
                showFileList: (false),
                onChange: ((file) => __VLS_ctx.handleImageSuccess(file, item, 'sampleImages')),
                ...{ class: "p-upload-inline" },
            }));
            const __VLS_828 = __VLS_827({
                action: "#",
                autoUpload: (false),
                showFileList: (false),
                onChange: ((file) => __VLS_ctx.handleImageSuccess(file, item, 'sampleImages')),
                ...{ class: "p-upload-inline" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_827));
            __VLS_829.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "p-upload-grid" },
            });
            for (const [img, i] of __VLS_getVForSourceType((item.sampleImages))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: (i),
                    ...{ class: "p-upload-item" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                    src: (img),
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.isEditMode))
                                return;
                            if (!(item.channel !== '供应商'))
                                return;
                            __VLS_ctx.removeImage(item, 'sampleImages', i);
                        } },
                    ...{ class: "p-upload-mask" },
                });
                const __VLS_830 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_831 = __VLS_asFunctionalComponent(__VLS_830, new __VLS_830({}));
                const __VLS_832 = __VLS_831({}, ...__VLS_functionalComponentArgsRest(__VLS_831));
                __VLS_833.slots.default;
                const __VLS_834 = {}.Delete;
                /** @type {[typeof __VLS_components.Delete, ]} */ ;
                // @ts-ignore
                const __VLS_835 = __VLS_asFunctionalComponent(__VLS_834, new __VLS_834({}));
                const __VLS_836 = __VLS_835({}, ...__VLS_functionalComponentArgsRest(__VLS_835));
                var __VLS_833;
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "p-upload-add" },
            });
            const __VLS_838 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_839 = __VLS_asFunctionalComponent(__VLS_838, new __VLS_838({}));
            const __VLS_840 = __VLS_839({}, ...__VLS_functionalComponentArgsRest(__VLS_839));
            __VLS_841.slots.default;
            const __VLS_842 = {}.Picture;
            /** @type {[typeof __VLS_components.Picture, ]} */ ;
            // @ts-ignore
            const __VLS_843 = __VLS_asFunctionalComponent(__VLS_842, new __VLS_842({}));
            const __VLS_844 = __VLS_843({}, ...__VLS_functionalComponentArgsRest(__VLS_843));
            var __VLS_841;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            var __VLS_829;
            var __VLS_825;
            const __VLS_846 = {}.ElFormItem;
            /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
            // @ts-ignore
            const __VLS_847 = __VLS_asFunctionalComponent(__VLS_846, new __VLS_846({
                label: "订单截图",
                prop: ('items.' + index + '.orderScreenshots'),
            }));
            const __VLS_848 = __VLS_847({
                label: "订单截图",
                prop: ('items.' + index + '.orderScreenshots'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_847));
            __VLS_849.slots.default;
            const __VLS_850 = {}.ElUpload;
            /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
            // @ts-ignore
            const __VLS_851 = __VLS_asFunctionalComponent(__VLS_850, new __VLS_850({
                action: "#",
                autoUpload: (false),
                showFileList: (false),
                onChange: ((file) => __VLS_ctx.handleImageSuccess(file, item, 'orderScreenshots')),
                ...{ class: "p-upload-inline" },
            }));
            const __VLS_852 = __VLS_851({
                action: "#",
                autoUpload: (false),
                showFileList: (false),
                onChange: ((file) => __VLS_ctx.handleImageSuccess(file, item, 'orderScreenshots')),
                ...{ class: "p-upload-inline" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_851));
            __VLS_853.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "p-upload-grid" },
            });
            for (const [img, i] of __VLS_getVForSourceType((item.orderScreenshots))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: (i),
                    ...{ class: "p-upload-item" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                    src: (img),
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.isEditMode))
                                return;
                            if (!(item.channel !== '供应商'))
                                return;
                            __VLS_ctx.removeImage(item, 'orderScreenshots', i);
                        } },
                    ...{ class: "p-upload-mask" },
                });
                const __VLS_854 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_855 = __VLS_asFunctionalComponent(__VLS_854, new __VLS_854({}));
                const __VLS_856 = __VLS_855({}, ...__VLS_functionalComponentArgsRest(__VLS_855));
                __VLS_857.slots.default;
                const __VLS_858 = {}.Delete;
                /** @type {[typeof __VLS_components.Delete, ]} */ ;
                // @ts-ignore
                const __VLS_859 = __VLS_asFunctionalComponent(__VLS_858, new __VLS_858({}));
                const __VLS_860 = __VLS_859({}, ...__VLS_functionalComponentArgsRest(__VLS_859));
                var __VLS_857;
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "p-upload-add" },
            });
            const __VLS_862 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_863 = __VLS_asFunctionalComponent(__VLS_862, new __VLS_862({}));
            const __VLS_864 = __VLS_863({}, ...__VLS_functionalComponentArgsRest(__VLS_863));
            __VLS_865.slots.default;
            const __VLS_866 = {}.Camera;
            /** @type {[typeof __VLS_components.Camera, ]} */ ;
            // @ts-ignore
            const __VLS_867 = __VLS_asFunctionalComponent(__VLS_866, new __VLS_866({}));
            const __VLS_868 = __VLS_867({}, ...__VLS_functionalComponentArgsRest(__VLS_867));
            var __VLS_865;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            var __VLS_853;
            var __VLS_849;
        }
        var __VLS_451;
        var __VLS_447;
    }
    var __VLS_438;
}
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "footer-left" },
    });
    if (!__VLS_ctx.isEditMode) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "batch-info" },
        });
        (__VLS_ctx.form.items.length);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "footer-right" },
    });
    const __VLS_870 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_871 = __VLS_asFunctionalComponent(__VLS_870, new __VLS_870({
        ...{ 'onClick': {} },
    }));
    const __VLS_872 = __VLS_871({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_871));
    let __VLS_874;
    let __VLS_875;
    let __VLS_876;
    const __VLS_877 = {
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_873.slots.default;
    var __VLS_873;
    const __VLS_878 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_879 = __VLS_asFunctionalComponent(__VLS_878, new __VLS_878({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }));
    const __VLS_880 = __VLS_879({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_879));
    let __VLS_882;
    let __VLS_883;
    let __VLS_884;
    const __VLS_885 = {
        onClick: (__VLS_ctx.handleSave)
    };
    __VLS_881.slots.default;
    var __VLS_881;
    const __VLS_886 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_887 = __VLS_asFunctionalComponent(__VLS_886, new __VLS_886({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_888 = __VLS_887({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_887));
    let __VLS_890;
    let __VLS_891;
    let __VLS_892;
    const __VLS_893 = {
        onClick: (__VLS_ctx.handleSubmit)
    };
    __VLS_889.slots.default;
    var __VLS_889;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['purchase-apply-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-instruction']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-content']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-form']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['orange']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['total-price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['refund-tip-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['refund-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['purple']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-mask']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-add']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['cyan']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['attachments-upload-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-mask']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-add']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-mask']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-add']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-form']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-form']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['orange']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['total-price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['refund-tip-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['refund-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['purple']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-mask']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-add']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['cyan']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['attachments-upload-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-mask']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-add']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-mask']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-add']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-left']} */ ;
/** @type {__VLS_StyleScopedClasses['batch-info']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-right']} */ ;
// @ts-ignore
var __VLS_18 = __VLS_17, __VLS_453 = __VLS_452;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            InfoFilled: InfoFilled,
            Picture: Picture,
            Camera: Camera,
            Delete: Delete,
            Upload: Upload,
            visible: visible,
            isEditMode: isEditMode,
            formRef: formRef,
            formalSuppliers: formalSuppliers,
            refundDescriptions: refundDescriptions,
            handleSupplierChange: handleSupplierChange,
            handleImageSuccess: handleImageSuccess,
            removeImage: removeImage,
            form: form,
            activeTab: activeTab,
            addItem: addItem,
            removeItemByTab: removeItemByTab,
            handleSave: handleSave,
            handleSubmit: handleSubmit,
        };
    },
    emits: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    emits: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=PurchaseApplyDialog.vue.js.map