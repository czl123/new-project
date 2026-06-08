/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, watch } from 'vue';
import { Plus, Document, InfoFilled, ArrowDown, ArrowUp, Management, Monitor, Guide, Link } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    rowData: {
        type: Object,
        default: () => ({})
    }
});
const emit = defineEmits(['update:modelValue', 'save']);
const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});
const formRef = ref();
const saving = ref(false);
const isProposalReviewCollapsed = ref(true);
// 表单初始值声明
const form = ref({
    proposalNo: '',
    productName: '',
    manager: '',
    devMethod: '',
    level: '',
    totalAmount: 0,
    buyQty: 0,
    unitPrice: 0,
    category: '',
    teamLeader: '周亮亮',
    style: '',
    material: '',
    applicableObject: '',
    model: '',
    spu: '',
    productSource: '工厂选品',
    brand: '',
    logoPosition: '无',
    packagingMethod: '常规包装',
    mainMarket: [],
    userGroup: '',
    marketEst: '',
    usageScenario: '',
    seasonTags: [],
    holidayTags: [],
    sellingPoints: '',
    refLinks: [],
    refImages: [],
    researchFiles: [],
    designLogoPosition: '无',
    designFiles: [],
    estProposalDate: '',
    estProjectDate: '',
    listingTimeDev: '',
    listingTimeOps: '',
    taskNo: '',
    user: '杨登峰',
    samplingMethod: '现货拿样',
    priority: 'P1',
    feedbackDeadline: '',
    deadline: '',
    customCycle: '',
    bottomLinePrice: '32 CNY',
    styleRequirement: '符合图纸或参考样，无划痕',
    brandRequirement: '通用',
    materialRequirement: '防潮，防霉，承重性强',
    patternRequirement: '无图案',
    colorRequirement: '常规主色',
    sizeRequirement: '适配规格',
    weightRequirement: '单品不超过常规重量',
    packQtyRequirement: '1个/包',
    functionRequirement: '安全，经久耐用',
    accessoryRequirement: '配备必要装配螺丝/配件',
    packagingRequirement: '常规五层纸箱包装',
    complianceRequirement: '符合跨境电商出口标准',
    certRequirement: '无',
    supplementaryRequirement: '请重点确认材质的防刮擦性能与物理强度。'
});
// 监听 rowData，进行深度拷贝和任务生成预配置
watch(() => props.rowData, (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
        const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randNum = Math.floor(100 + Math.random() * 900);
        // 默认反馈截止时间为 2 天后
        const fd = new Date();
        fd.setDate(fd.getDate() + 2);
        const fdStr = fd.toISOString().slice(0, 10) + ' 18:00:00';
        // 默认任务截止时间为 7 天后
        const d = new Date();
        d.setDate(d.getDate() + 7);
        const dStr = d.toISOString().slice(0, 10) + ' 18:00:00';
        // 基础合并，保证数组 and 对象拥有默认结构 (与 EditDialog.vue 保持一致)
        const merged = {
            ...newVal,
            seasonTags: newVal.seasonTags || [],
            holidayTags: newVal.holidayTags || [],
            mainMarket: Array.isArray(newVal.mainMarket) ? newVal.mainMarket : (newVal.mainMarket ? [newVal.mainMarket] : []),
            refLinks: newVal.refLinks || [
                { label: '竞品参考链接 A', url: 'https://www.amazon.com/dp/B0GH4SLH8B' }
            ],
            refImages: newVal.refImages || [
                { name: '参考样照.jpg', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop' }
            ],
            researchFiles: newVal.researchFiles || [
                { name: newVal.researchFile || '深度调研报告_2026.pdf' },
                { name: newVal.roiFile || 'ROI利润测算表_V1.xlsx' }
            ],
            designFiles: newVal.designFiles || [
                { date: '2026-04-20', name: 'ZZ-牧羊人钩设计初稿_V1.pdf', uploader: '设计二组', method: '手动上传' }
            ]
        };
        // 补足可能不存在的属性
        if (!merged.applicableObject)
            merged.applicableObject = newVal.applicableObject || newVal.applicableTo || '-';
        if (!merged.listingTimeDev)
            merged.listingTimeDev = newVal.listingTime || '-';
        if (!merged.listingTimeOps)
            merged.listingTimeOps = newVal.listingTime || '-';
        if (!merged.buyQty)
            merged.buyQty = newVal.buyQty || 1000;
        if (!merged.unitPrice)
            merged.unitPrice = newVal.unitPrice || 10;
        if (!merged.totalAmount)
            merged.totalAmount = merged.buyQty * merged.unitPrice;
        if (!merged.sellingPoints)
            merged.sellingPoints = newVal.sellingPoints || '';
        if (!merged.marketEst)
            merged.marketEst = newVal.marketEst || '良好';
        if (!merged.researchFile)
            merged.researchFile = '深度调研报告_2026.pdf';
        if (!merged.roiFile)
            merged.roiFile = 'ROI利润测算表_V1.xlsx';
        // 任务特有配置 (支持回显已保存的草稿)
        merged.taskNo = newVal.taskNo || `TK${todayStr}${randNum}`;
        merged.user = newVal.user || '杨登峰';
        merged.samplingMethod = newVal.samplingMethod || ((newVal.devMethod && newVal.devMethod.includes('现货')) ? '现货拿样' : '定制拿样');
        merged.priority = newVal.priority || 'P1';
        merged.feedbackDeadline = newVal.feedbackDeadline !== undefined ? newVal.feedbackDeadline : fdStr;
        merged.deadline = newVal.deadline !== undefined ? newVal.deadline : dStr;
        merged.customCycle = newVal.customCycle !== undefined ? newVal.customCycle : '';
        merged.bottomLinePrice = newVal.bottomLinePrice !== undefined ? newVal.bottomLinePrice : '32 CNY';
        merged.styleRequirement = newVal.styleRequirement !== undefined ? newVal.styleRequirement : '符合图纸或参考样，无划痕';
        merged.brandRequirement = newVal.brandRequirement !== undefined ? newVal.brandRequirement : '通用';
        merged.materialRequirement = newVal.materialRequirement !== undefined ? newVal.materialRequirement : '防潮，防霉，承重性强';
        merged.patternRequirement = newVal.patternRequirement !== undefined ? newVal.patternRequirement : '无图案';
        merged.colorRequirement = newVal.colorRequirement !== undefined ? newVal.colorRequirement : '常规主色';
        merged.sizeRequirement = newVal.sizeRequirement !== undefined ? newVal.sizeRequirement : '适配规格';
        merged.weightRequirement = newVal.weightRequirement !== undefined ? newVal.weightRequirement : '单品不超过常规重量';
        merged.packQtyRequirement = newVal.packQtyRequirement !== undefined ? newVal.packQtyRequirement : '1个/包';
        merged.functionRequirement = newVal.functionRequirement !== undefined ? newVal.functionRequirement : '安全，经久耐用';
        merged.accessoryRequirement = newVal.accessoryRequirement !== undefined ? newVal.accessoryRequirement : '配备必要装配螺丝/配件';
        merged.packagingRequirement = newVal.packagingRequirement !== undefined ? newVal.packagingRequirement : '常规五层纸箱包装';
        merged.complianceRequirement = newVal.complianceRequirement !== undefined ? newVal.complianceRequirement : '符合跨境电商出口标准';
        merged.certRequirement = newVal.certRequirement !== undefined ? newVal.certRequirement : '无';
        merged.supplementaryRequirement = newVal.supplementaryRequirement !== undefined ? newVal.supplementaryRequirement : '请重点确认材质的防刮擦性能与物理强度。';
        form.value = JSON.parse(JSON.stringify(merged));
    }
}, { immediate: true });
const handleDesignFileUpload = (uploadFile) => {
    const newFile = {
        date: new Date().toISOString().split('T')[0],
        name: uploadFile.name || '产品规格书.pdf',
        uploader: form.value.manager || '系统用户',
        method: '手动上传'
    };
    form.value.designFiles.push(newFile);
    ElMessage.success('成功上传并登记产品规格书');
};
const removeDesignFile = (index) => {
    form.value.designFiles.splice(index, 1);
    ElMessage.warning('已移除该设计图档');
};
const handleClosed = () => {
    formRef.value?.resetFields();
};
// 校验规则
const rules = {
    samplingMethod: [{ required: true, message: '请选择拿样方式', trigger: 'change' }],
    logoPosition: [{ required: true, message: '请选择Logo位置', trigger: 'change' }],
    feedbackDeadline: [{ required: true, message: '请选择反馈截止时间', trigger: 'change' }],
    deadline: [{ required: true, message: '请选择任务截止时间', trigger: 'change' }],
    customCycle: [{ required: true, message: '请输入期望定制周期', trigger: 'blur' }]
};
// 保存并下发任务
const handleSave = async (isSubmit = true) => {
    if (isSubmit) {
        if (!formRef.value)
            return;
        await formRef.value.validate(async (valid) => {
            if (valid) {
                await executeSave(true);
            }
            else {
                ElMessage.warning('表单信息校验失败，请检查必填项');
            }
        });
    }
    else {
        await executeSave(false);
    }
};
const executeSave = async (isSubmit) => {
    saving.value = true;
    try {
        // 模拟网络传输延迟
        await new Promise((resolve) => setTimeout(resolve, 1000));
        emit('save', { ...JSON.parse(JSON.stringify(form.value)), isSubmit });
        ElMessage.success(isSubmit ? `任务 ${form.value.taskNo} 创建且已成功下发！` : `任务 ${form.value.taskNo} 草稿保存成功！`);
        visible.value = false;
    }
    finally {
        saving.value = false;
    }
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
    width: "1100px",
    ...{ class: "proposal-create-task-dialog" },
    destroyOnClose: true,
    alignCenter: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.visible),
    width: "1100px",
    ...{ class: "proposal-create-task-dialog" },
    destroyOnClose: true,
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClosed: (__VLS_ctx.handleClosed)
};
var __VLS_8 = {};
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dialog-header-custom" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title-main" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "proposal-no-badge" },
    });
    (__VLS_ctx.form.proposalNo);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "create-task-dialog-container" },
});
const __VLS_9 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "left",
    labelWidth: "130px",
    ...{ class: "workspace-form" },
    size: "small",
}));
const __VLS_11 = __VLS_10({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "left",
    labelWidth: "130px",
    ...{ class: "workspace-form" },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_13 = {};
__VLS_12.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "info-dashboard" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dash-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "value" },
});
(__VLS_ctx.form.totalAmount ? __VLS_ctx.form.totalAmount.toFixed(2) : '0.00');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dash-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "value" },
});
(__VLS_ctx.form.buyQty ? __VLS_ctx.form.buyQty.toLocaleString() : 0);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "unit" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dash-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "value" },
});
(__VLS_ctx.form.unitPrice || 0);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dash-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "value-tag" },
    'data-level': (__VLS_ctx.form.level),
});
(__VLS_ctx.form.level);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-card proposal-review-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
const __VLS_15 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_18.slots.default;
const __VLS_19 = {}.InfoFilled;
/** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({}));
const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
var __VLS_18;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_23 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
    size: "small",
    ...{ style: {} },
}));
const __VLS_25 = __VLS_24({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
    size: "small",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_27;
let __VLS_28;
let __VLS_29;
const __VLS_30 = {
    onClick: (...[$event]) => {
        __VLS_ctx.isProposalReviewCollapsed = !__VLS_ctx.isProposalReviewCollapsed;
    }
};
__VLS_26.slots.default;
(__VLS_ctx.isProposalReviewCollapsed ? '展开提案信息' : '收起提案信息');
const __VLS_31 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
    ...{ class: "el-icon--right" },
}));
const __VLS_33 = __VLS_32({
    ...{ class: "el-icon--right" },
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
__VLS_34.slots.default;
if (__VLS_ctx.isProposalReviewCollapsed) {
    const __VLS_35 = {}.ArrowDown;
    /** @type {[typeof __VLS_components.ArrowDown, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({}));
    const __VLS_37 = __VLS_36({}, ...__VLS_functionalComponentArgsRest(__VLS_36));
}
else {
    const __VLS_39 = {}.ArrowUp;
    /** @type {[typeof __VLS_components.ArrowUp, ]} */ ;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({}));
    const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
}
var __VLS_34;
var __VLS_26;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "proposal-review-content mt-12" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.isProposalReviewCollapsed) }, null, null);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "review-section-block" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-section-title" },
});
const __VLS_43 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({}));
const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_46.slots.default;
const __VLS_47 = {}.Management;
/** @type {[typeof __VLS_components.Management, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({}));
const __VLS_49 = __VLS_48({}, ...__VLS_functionalComponentArgsRest(__VLS_48));
var __VLS_46;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_51 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    column: (3),
    border: true,
    size: "small",
    ...{ class: "mb-12" },
}));
const __VLS_53 = __VLS_52({
    column: (3),
    border: true,
    size: "small",
    ...{ class: "mb-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
const __VLS_55 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    label: "运营大类",
}));
const __VLS_57 = __VLS_56({
    label: "运营大类",
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
__VLS_58.slots.default;
(__VLS_ctx.form.category || '-');
var __VLS_58;
const __VLS_59 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    label: "团队负责人",
}));
const __VLS_61 = __VLS_60({
    label: "团队负责人",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
(__VLS_ctx.form.teamLeader || '-');
var __VLS_62;
const __VLS_63 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    label: "产品经理",
}));
const __VLS_65 = __VLS_64({
    label: "产品经理",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
(__VLS_ctx.form.manager || '-');
var __VLS_66;
const __VLS_67 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    label: "产品名称",
}));
const __VLS_69 = __VLS_68({
    label: "产品名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
(__VLS_ctx.form.productName || '-');
var __VLS_70;
const __VLS_71 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    label: "款式",
}));
const __VLS_73 = __VLS_72({
    label: "款式",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_74.slots.default;
(__VLS_ctx.form.style || '-');
var __VLS_74;
const __VLS_75 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    label: "主材料",
}));
const __VLS_77 = __VLS_76({
    label: "主材料",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
__VLS_78.slots.default;
(__VLS_ctx.form.material || '-');
var __VLS_78;
const __VLS_79 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    label: "适用品牌/对象",
}));
const __VLS_81 = __VLS_80({
    label: "适用品牌/对象",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
__VLS_82.slots.default;
(__VLS_ctx.form.applicableObject || '-');
var __VLS_82;
const __VLS_83 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    label: "型号",
}));
const __VLS_85 = __VLS_84({
    label: "型号",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
__VLS_86.slots.default;
(__VLS_ctx.form.model || '-');
var __VLS_86;
const __VLS_87 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    label: "SPU",
}));
const __VLS_89 = __VLS_88({
    label: "SPU",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
__VLS_90.slots.default;
(__VLS_ctx.form.spu || '-');
var __VLS_90;
const __VLS_91 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    label: "产品来源",
}));
const __VLS_93 = __VLS_92({
    label: "产品来源",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
__VLS_94.slots.default;
(__VLS_ctx.form.productSource || '-');
var __VLS_94;
const __VLS_95 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    label: "开发方式",
}));
const __VLS_97 = __VLS_96({
    label: "开发方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
__VLS_98.slots.default;
(__VLS_ctx.form.devMethod || '-');
var __VLS_98;
const __VLS_99 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    label: "开发品牌",
}));
const __VLS_101 = __VLS_100({
    label: "开发品牌",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
__VLS_102.slots.default;
(__VLS_ctx.form.brand || '-');
var __VLS_102;
const __VLS_103 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({
    label: "初始Logo位置",
}));
const __VLS_105 = __VLS_104({
    label: "初始Logo位置",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
__VLS_106.slots.default;
(__VLS_ctx.form.logoPosition || '-');
var __VLS_106;
const __VLS_107 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({
    label: "初始包装方式",
}));
const __VLS_109 = __VLS_108({
    label: "初始包装方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
__VLS_110.slots.default;
(__VLS_ctx.form.packagingMethod || '-');
var __VLS_110;
const __VLS_111 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    label: "-",
}));
const __VLS_113 = __VLS_112({
    label: "-",
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
var __VLS_54;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-section-title mt-12" },
});
const __VLS_115 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({}));
const __VLS_117 = __VLS_116({}, ...__VLS_functionalComponentArgsRest(__VLS_116));
__VLS_118.slots.default;
const __VLS_119 = {}.Calendar;
/** @type {[typeof __VLS_components.Calendar, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({}));
const __VLS_121 = __VLS_120({}, ...__VLS_functionalComponentArgsRest(__VLS_120));
var __VLS_118;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_123 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
    column: (4),
    border: true,
    size: "small",
    ...{ class: "mb-4 date-descriptions" },
    labelStyle: ({ width: '15%' }),
    contentStyle: ({ width: '10%' }),
}));
const __VLS_125 = __VLS_124({
    column: (4),
    border: true,
    size: "small",
    ...{ class: "mb-4 date-descriptions" },
    labelStyle: ({ width: '15%' }),
    contentStyle: ({ width: '10%' }),
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
__VLS_126.slots.default;
const __VLS_127 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
    label: "提案预计结项日期",
}));
const __VLS_129 = __VLS_128({
    label: "提案预计结项日期",
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
__VLS_130.slots.default;
(__VLS_ctx.form.estProposalDate || '-');
var __VLS_130;
const __VLS_131 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
    label: "项目预计结项日期",
}));
const __VLS_133 = __VLS_132({
    label: "项目预计结项日期",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
__VLS_134.slots.default;
(__VLS_ctx.form.estProjectDate || '-');
var __VLS_134;
const __VLS_135 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    label: "开发上架时间要求",
}));
const __VLS_137 = __VLS_136({
    label: "开发上架时间要求",
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
__VLS_138.slots.default;
(__VLS_ctx.form.listingTimeDev || '-');
var __VLS_138;
const __VLS_139 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
    label: "运营上架时间要求",
}));
const __VLS_141 = __VLS_140({
    label: "运营上架时间要求",
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
__VLS_142.slots.default;
(__VLS_ctx.form.listingTimeOps || '-');
var __VLS_142;
var __VLS_126;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "review-section-block mt-16" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-section-title" },
});
const __VLS_143 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({}));
const __VLS_145 = __VLS_144({}, ...__VLS_functionalComponentArgsRest(__VLS_144));
__VLS_146.slots.default;
const __VLS_147 = {}.Monitor;
/** @type {[typeof __VLS_components.Monitor, ]} */ ;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({}));
const __VLS_149 = __VLS_148({}, ...__VLS_functionalComponentArgsRest(__VLS_148));
var __VLS_146;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_151 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
    column: (3),
    border: true,
    size: "small",
    ...{ class: "mb-12" },
}));
const __VLS_153 = __VLS_152({
    column: (3),
    border: true,
    size: "small",
    ...{ class: "mb-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
__VLS_154.slots.default;
const __VLS_155 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({
    label: "主攻市场",
}));
const __VLS_157 = __VLS_156({
    label: "主攻市场",
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
__VLS_158.slots.default;
if (Array.isArray(__VLS_ctx.form.mainMarket)) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.form.mainMarket.join('、') || '-');
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.form.mainMarket || '-');
}
var __VLS_158;
const __VLS_159 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
    label: "使用人群",
    span: (2),
}));
const __VLS_161 = __VLS_160({
    label: "使用人群",
    span: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
__VLS_162.slots.default;
(__VLS_ctx.form.userGroup || '-');
var __VLS_162;
const __VLS_163 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
    label: "市场评估",
    span: (3),
}));
const __VLS_165 = __VLS_164({
    label: "市场评估",
    span: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
__VLS_166.slots.default;
(__VLS_ctx.form.marketEst || '-');
var __VLS_166;
const __VLS_167 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
    label: "使用场景",
}));
const __VLS_169 = __VLS_168({
    label: "使用场景",
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
__VLS_170.slots.default;
(__VLS_ctx.form.usageScenario || '-');
var __VLS_170;
const __VLS_171 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
    label: "季节标签",
}));
const __VLS_173 = __VLS_172({
    label: "季节标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
__VLS_174.slots.default;
for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.form.seasonTags))) {
    const __VLS_175 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
        key: (tag),
        size: "small",
        ...{ class: "mr-4" },
    }));
    const __VLS_177 = __VLS_176({
        key: (tag),
        size: "small",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_176));
    __VLS_178.slots.default;
    (tag);
    var __VLS_178;
}
if (!__VLS_ctx.form.seasonTags || __VLS_ctx.form.seasonTags.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
var __VLS_174;
const __VLS_179 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({
    label: "节日标签",
}));
const __VLS_181 = __VLS_180({
    label: "节日标签",
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
__VLS_182.slots.default;
for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.form.holidayTags))) {
    const __VLS_183 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_184 = __VLS_asFunctionalComponent(__VLS_183, new __VLS_183({
        key: (tag),
        size: "small",
        type: "success",
        ...{ class: "mr-4" },
    }));
    const __VLS_185 = __VLS_184({
        key: (tag),
        size: "small",
        type: "success",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_184));
    __VLS_186.slots.default;
    (tag);
    var __VLS_186;
}
if (!__VLS_ctx.form.holidayTags || __VLS_ctx.form.holidayTags.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
var __VLS_182;
var __VLS_154;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-block-readonly mb-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "read-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "read-text-value" },
});
(__VLS_ctx.form.sellingPoints || '-');
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
    span: (12),
}));
const __VLS_193 = __VLS_192({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_192));
__VLS_194.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "link-block-readonly" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "read-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "multi-links-readonly mt-4" },
});
for (const [link, idx] of __VLS_getVForSourceType((__VLS_ctx.form.refLinks))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (idx),
        ...{ class: "link-item-readonly" },
    });
    const __VLS_195 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195({}));
    const __VLS_197 = __VLS_196({}, ...__VLS_functionalComponentArgsRest(__VLS_196));
    __VLS_198.slots.default;
    const __VLS_199 = {}.Link;
    /** @type {[typeof __VLS_components.Link, ]} */ ;
    // @ts-ignore
    const __VLS_200 = __VLS_asFunctionalComponent(__VLS_199, new __VLS_199({}));
    const __VLS_201 = __VLS_200({}, ...__VLS_functionalComponentArgsRest(__VLS_200));
    var __VLS_198;
    const __VLS_203 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_204 = __VLS_asFunctionalComponent(__VLS_203, new __VLS_203({
        type: "primary",
        href: (link.url),
        target: "_blank",
        size: "small",
    }));
    const __VLS_205 = __VLS_204({
        type: "primary",
        href: (link.url),
        target: "_blank",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_204));
    __VLS_206.slots.default;
    (link.label || link.url);
    var __VLS_206;
}
if (!__VLS_ctx.form.refLinks || __VLS_ctx.form.refLinks.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "text-secondary" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "file-block-readonly mt-12" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "read-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-4 flex-wrap" },
});
for (const [file, idx] of __VLS_getVForSourceType((__VLS_ctx.form.researchFiles))) {
    const __VLS_207 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207({
        key: (idx),
        size: "small",
        ...{ class: "file-tag mr-8 mb-4" },
    }));
    const __VLS_209 = __VLS_208({
        key: (idx),
        size: "small",
        ...{ class: "file-tag mr-8 mb-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_208));
    __VLS_210.slots.default;
    const __VLS_211 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_212 = __VLS_asFunctionalComponent(__VLS_211, new __VLS_211({}));
    const __VLS_213 = __VLS_212({}, ...__VLS_functionalComponentArgsRest(__VLS_212));
    __VLS_214.slots.default;
    const __VLS_215 = {}.Document;
    /** @type {[typeof __VLS_components.Document, ]} */ ;
    // @ts-ignore
    const __VLS_216 = __VLS_asFunctionalComponent(__VLS_215, new __VLS_215({}));
    const __VLS_217 = __VLS_216({}, ...__VLS_functionalComponentArgsRest(__VLS_216));
    var __VLS_214;
    (file.name);
    var __VLS_210;
}
if (!__VLS_ctx.form.researchFiles || __VLS_ctx.form.researchFiles.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-secondary" },
    });
}
var __VLS_194;
const __VLS_219 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_220 = __VLS_asFunctionalComponent(__VLS_219, new __VLS_219({
    span: (12),
}));
const __VLS_221 = __VLS_220({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_220));
__VLS_222.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "image-gallery-readonly" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "read-label mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "img-list-readonly" },
});
for (const [img, idx] of __VLS_getVForSourceType((__VLS_ctx.form.refImages))) {
    const __VLS_223 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    const __VLS_224 = __VLS_asFunctionalComponent(__VLS_223, new __VLS_223({
        key: (idx),
        src: (img.url || img),
        previewSrcList: (__VLS_ctx.form.refImages.map((i) => i.url || i)),
        fit: "cover",
        ...{ class: "gallery-item-readonly" },
    }));
    const __VLS_225 = __VLS_224({
        key: (idx),
        src: (img.url || img),
        previewSrcList: (__VLS_ctx.form.refImages.map((i) => i.url || i)),
        fit: "cover",
        ...{ class: "gallery-item-readonly" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_224));
}
if (!__VLS_ctx.form.refImages || __VLS_ctx.form.refImages.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-secondary" },
    });
}
var __VLS_222;
var __VLS_190;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "review-section-block mt-16" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-section-title" },
});
const __VLS_227 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_228 = __VLS_asFunctionalComponent(__VLS_227, new __VLS_227({}));
const __VLS_229 = __VLS_228({}, ...__VLS_functionalComponentArgsRest(__VLS_228));
__VLS_230.slots.default;
const __VLS_231 = {}.Guide;
/** @type {[typeof __VLS_components.Guide, ]} */ ;
// @ts-ignore
const __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({}));
const __VLS_233 = __VLS_232({}, ...__VLS_functionalComponentArgsRest(__VLS_232));
var __VLS_230;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_235 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent(__VLS_235, new __VLS_235({
    column: (2),
    border: true,
    size: "small",
    ...{ class: "mb-12" },
}));
const __VLS_237 = __VLS_236({
    column: (2),
    border: true,
    size: "small",
    ...{ class: "mb-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_236));
__VLS_238.slots.default;
const __VLS_239 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_240 = __VLS_asFunctionalComponent(__VLS_239, new __VLS_239({
    label: "Logo位置",
}));
const __VLS_241 = __VLS_240({
    label: "Logo位置",
}, ...__VLS_functionalComponentArgsRest(__VLS_240));
__VLS_242.slots.default;
(__VLS_ctx.form.designLogoPosition || '-');
var __VLS_242;
const __VLS_243 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_244 = __VLS_asFunctionalComponent(__VLS_243, new __VLS_243({
    label: "设计规格书/图档",
}));
const __VLS_245 = __VLS_244({
    label: "设计规格书/图档",
}, ...__VLS_functionalComponentArgsRest(__VLS_244));
__VLS_246.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "design-file-readonly-list" },
});
for (const [file, idx] of __VLS_getVForSourceType((__VLS_ctx.form.designFiles))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (idx),
        ...{ class: "design-file-readonly-item" },
    });
    const __VLS_247 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_248 = __VLS_asFunctionalComponent(__VLS_247, new __VLS_247({}));
    const __VLS_249 = __VLS_248({}, ...__VLS_functionalComponentArgsRest(__VLS_248));
    __VLS_250.slots.default;
    const __VLS_251 = {}.Document;
    /** @type {[typeof __VLS_components.Document, ]} */ ;
    // @ts-ignore
    const __VLS_252 = __VLS_asFunctionalComponent(__VLS_251, new __VLS_251({}));
    const __VLS_253 = __VLS_252({}, ...__VLS_functionalComponentArgsRest(__VLS_252));
    var __VLS_250;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "file-name-span" },
    });
    (file.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "file-meta-span" },
    });
    (file.uploader || '系统');
    (file.date || '-');
}
if (!__VLS_ctx.form.designFiles || __VLS_ctx.form.designFiles.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-secondary" },
    });
}
var __VLS_246;
var __VLS_238;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_255 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_256 = __VLS_asFunctionalComponent(__VLS_255, new __VLS_255({
    gutter: (24),
}));
const __VLS_257 = __VLS_256({
    gutter: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_256));
__VLS_258.slots.default;
const __VLS_259 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_260 = __VLS_asFunctionalComponent(__VLS_259, new __VLS_259({
    span: (8),
}));
const __VLS_261 = __VLS_260({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_260));
__VLS_262.slots.default;
const __VLS_263 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_264 = __VLS_asFunctionalComponent(__VLS_263, new __VLS_263({
    label: "拿样方式",
    prop: "samplingMethod",
}));
const __VLS_265 = __VLS_264({
    label: "拿样方式",
    prop: "samplingMethod",
}, ...__VLS_functionalComponentArgsRest(__VLS_264));
__VLS_266.slots.default;
const __VLS_267 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_268 = __VLS_asFunctionalComponent(__VLS_267, new __VLS_267({
    modelValue: (__VLS_ctx.form.samplingMethod),
    placeholder: "请选择拿样方式",
    ...{ class: "w-full" },
}));
const __VLS_269 = __VLS_268({
    modelValue: (__VLS_ctx.form.samplingMethod),
    placeholder: "请选择拿样方式",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_268));
__VLS_270.slots.default;
const __VLS_271 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_272 = __VLS_asFunctionalComponent(__VLS_271, new __VLS_271({
    label: "现货拿样",
    value: "现货拿样",
}));
const __VLS_273 = __VLS_272({
    label: "现货拿样",
    value: "现货拿样",
}, ...__VLS_functionalComponentArgsRest(__VLS_272));
const __VLS_275 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_276 = __VLS_asFunctionalComponent(__VLS_275, new __VLS_275({
    label: "定制拿样",
    value: "定制拿样",
}));
const __VLS_277 = __VLS_276({
    label: "定制拿样",
    value: "定制拿样",
}, ...__VLS_functionalComponentArgsRest(__VLS_276));
var __VLS_270;
var __VLS_266;
var __VLS_262;
const __VLS_279 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_280 = __VLS_asFunctionalComponent(__VLS_279, new __VLS_279({
    span: (8),
}));
const __VLS_281 = __VLS_280({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_280));
__VLS_282.slots.default;
const __VLS_283 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_284 = __VLS_asFunctionalComponent(__VLS_283, new __VLS_283({
    label: "Logo位置",
    prop: "logoPosition",
}));
const __VLS_285 = __VLS_284({
    label: "Logo位置",
    prop: "logoPosition",
}, ...__VLS_functionalComponentArgsRest(__VLS_284));
__VLS_286.slots.default;
const __VLS_287 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_288 = __VLS_asFunctionalComponent(__VLS_287, new __VLS_287({
    modelValue: (__VLS_ctx.form.logoPosition),
    placeholder: "请选择Logo位置",
    ...{ class: "w-full" },
}));
const __VLS_289 = __VLS_288({
    modelValue: (__VLS_ctx.form.logoPosition),
    placeholder: "请选择Logo位置",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_288));
__VLS_290.slots.default;
const __VLS_291 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_292 = __VLS_asFunctionalComponent(__VLS_291, new __VLS_291({
    label: "无",
    value: "无",
}));
const __VLS_293 = __VLS_292({
    label: "无",
    value: "无",
}, ...__VLS_functionalComponentArgsRest(__VLS_292));
const __VLS_295 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_296 = __VLS_asFunctionalComponent(__VLS_295, new __VLS_295({
    label: "正面",
    value: "正面",
}));
const __VLS_297 = __VLS_296({
    label: "正面",
    value: "正面",
}, ...__VLS_functionalComponentArgsRest(__VLS_296));
const __VLS_299 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_300 = __VLS_asFunctionalComponent(__VLS_299, new __VLS_299({
    label: "背面",
    value: "背面",
}));
const __VLS_301 = __VLS_300({
    label: "背面",
    value: "背面",
}, ...__VLS_functionalComponentArgsRest(__VLS_300));
const __VLS_303 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_304 = __VLS_asFunctionalComponent(__VLS_303, new __VLS_303({
    label: "侧面",
    value: "侧面",
}));
const __VLS_305 = __VLS_304({
    label: "侧面",
    value: "侧面",
}, ...__VLS_functionalComponentArgsRest(__VLS_304));
const __VLS_307 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_308 = __VLS_asFunctionalComponent(__VLS_307, new __VLS_307({
    label: "顶部",
    value: "顶部",
}));
const __VLS_309 = __VLS_308({
    label: "顶部",
    value: "顶部",
}, ...__VLS_functionalComponentArgsRest(__VLS_308));
const __VLS_311 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_312 = __VLS_asFunctionalComponent(__VLS_311, new __VLS_311({
    label: "底部",
    value: "底部",
}));
const __VLS_313 = __VLS_312({
    label: "底部",
    value: "底部",
}, ...__VLS_functionalComponentArgsRest(__VLS_312));
const __VLS_315 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_316 = __VLS_asFunctionalComponent(__VLS_315, new __VLS_315({
    label: "面板",
    value: "面板",
}));
const __VLS_317 = __VLS_316({
    label: "面板",
    value: "面板",
}, ...__VLS_functionalComponentArgsRest(__VLS_316));
const __VLS_319 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_320 = __VLS_asFunctionalComponent(__VLS_319, new __VLS_319({
    label: "其他",
    value: "其他",
}));
const __VLS_321 = __VLS_320({
    label: "其他",
    value: "其他",
}, ...__VLS_functionalComponentArgsRest(__VLS_320));
var __VLS_290;
var __VLS_286;
var __VLS_282;
if (__VLS_ctx.form.samplingMethod === '现货拿样') {
    const __VLS_323 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_324 = __VLS_asFunctionalComponent(__VLS_323, new __VLS_323({
        span: (8),
    }));
    const __VLS_325 = __VLS_324({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_324));
    __VLS_326.slots.default;
    const __VLS_327 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_328 = __VLS_asFunctionalComponent(__VLS_327, new __VLS_327({
        label: "任务截止时间",
        prop: "deadline",
    }));
    const __VLS_329 = __VLS_328({
        label: "任务截止时间",
        prop: "deadline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_328));
    __VLS_330.slots.default;
    const __VLS_331 = {}.ElDatePicker;
    /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
    // @ts-ignore
    const __VLS_332 = __VLS_asFunctionalComponent(__VLS_331, new __VLS_331({
        modelValue: (__VLS_ctx.form.deadline),
        type: "datetime",
        placeholder: "选择任务截止时间",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        ...{ class: "w-full" },
    }));
    const __VLS_333 = __VLS_332({
        modelValue: (__VLS_ctx.form.deadline),
        type: "datetime",
        placeholder: "选择任务截止时间",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_332));
    var __VLS_330;
    var __VLS_326;
}
if (__VLS_ctx.form.samplingMethod === '定制拿样') {
    const __VLS_335 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_336 = __VLS_asFunctionalComponent(__VLS_335, new __VLS_335({
        span: (8),
    }));
    const __VLS_337 = __VLS_336({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_336));
    __VLS_338.slots.default;
    const __VLS_339 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_340 = __VLS_asFunctionalComponent(__VLS_339, new __VLS_339({
        label: "期望定制周期",
        prop: "customCycle",
    }));
    const __VLS_341 = __VLS_340({
        label: "期望定制周期",
        prop: "customCycle",
    }, ...__VLS_functionalComponentArgsRest(__VLS_340));
    __VLS_342.slots.default;
    const __VLS_343 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_344 = __VLS_asFunctionalComponent(__VLS_343, new __VLS_343({
        modelValue: (__VLS_ctx.form.customCycle),
        placeholder: "请输入天数",
        ...{ class: "w-full" },
    }));
    const __VLS_345 = __VLS_344({
        modelValue: (__VLS_ctx.form.customCycle),
        placeholder: "请输入天数",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_344));
    __VLS_346.slots.default;
    {
        const { append: __VLS_thisSlot } = __VLS_346.slots;
    }
    var __VLS_346;
    var __VLS_342;
    var __VLS_338;
}
var __VLS_258;
if (__VLS_ctx.form.samplingMethod === '定制拿样') {
    const __VLS_347 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_348 = __VLS_asFunctionalComponent(__VLS_347, new __VLS_347({
        gutter: (24),
    }));
    const __VLS_349 = __VLS_348({
        gutter: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_348));
    __VLS_350.slots.default;
    const __VLS_351 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_352 = __VLS_asFunctionalComponent(__VLS_351, new __VLS_351({
        span: (8),
    }));
    const __VLS_353 = __VLS_352({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_352));
    __VLS_354.slots.default;
    const __VLS_355 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_356 = __VLS_asFunctionalComponent(__VLS_355, new __VLS_355({
        label: "反馈截止时间",
        prop: "feedbackDeadline",
    }));
    const __VLS_357 = __VLS_356({
        label: "反馈截止时间",
        prop: "feedbackDeadline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_356));
    __VLS_358.slots.default;
    const __VLS_359 = {}.ElDatePicker;
    /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
    // @ts-ignore
    const __VLS_360 = __VLS_asFunctionalComponent(__VLS_359, new __VLS_359({
        modelValue: (__VLS_ctx.form.feedbackDeadline),
        type: "datetime",
        placeholder: "选择反馈截止时间",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        ...{ class: "w-full" },
    }));
    const __VLS_361 = __VLS_360({
        modelValue: (__VLS_ctx.form.feedbackDeadline),
        type: "datetime",
        placeholder: "选择反馈截止时间",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_360));
    var __VLS_358;
    var __VLS_354;
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
        label: "任务截止时间",
        prop: "deadline",
    }));
    const __VLS_369 = __VLS_368({
        label: "任务截止时间",
        prop: "deadline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_368));
    __VLS_370.slots.default;
    const __VLS_371 = {}.ElDatePicker;
    /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
    // @ts-ignore
    const __VLS_372 = __VLS_asFunctionalComponent(__VLS_371, new __VLS_371({
        modelValue: (__VLS_ctx.form.deadline),
        type: "datetime",
        placeholder: "选择任务截止时间",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        ...{ class: "w-full" },
    }));
    const __VLS_373 = __VLS_372({
        modelValue: (__VLS_ctx.form.deadline),
        type: "datetime",
        placeholder: "选择任务截止时间",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_372));
    var __VLS_370;
    var __VLS_366;
    var __VLS_350;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
if (__VLS_ctx.form.samplingMethod === '现货拿样') {
    const __VLS_375 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_376 = __VLS_asFunctionalComponent(__VLS_375, new __VLS_375({
        gutter: (24),
    }));
    const __VLS_377 = __VLS_376({
        gutter: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_376));
    __VLS_378.slots.default;
    const __VLS_379 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_380 = __VLS_asFunctionalComponent(__VLS_379, new __VLS_379({
        span: (8),
    }));
    const __VLS_381 = __VLS_380({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_380));
    __VLS_382.slots.default;
    const __VLS_383 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_384 = __VLS_asFunctionalComponent(__VLS_383, new __VLS_383({
        label: "底线采购价",
        prop: "bottomLinePrice",
    }));
    const __VLS_385 = __VLS_384({
        label: "底线采购价",
        prop: "bottomLinePrice",
    }, ...__VLS_functionalComponentArgsRest(__VLS_384));
    __VLS_386.slots.default;
    const __VLS_387 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_388 = __VLS_asFunctionalComponent(__VLS_387, new __VLS_387({
        modelValue: (__VLS_ctx.form.bottomLinePrice),
        placeholder: "例: 32 CNY",
    }));
    const __VLS_389 = __VLS_388({
        modelValue: (__VLS_ctx.form.bottomLinePrice),
        placeholder: "例: 32 CNY",
    }, ...__VLS_functionalComponentArgsRest(__VLS_388));
    var __VLS_386;
    var __VLS_382;
    const __VLS_391 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_392 = __VLS_asFunctionalComponent(__VLS_391, new __VLS_391({
        span: (8),
    }));
    const __VLS_393 = __VLS_392({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_392));
    __VLS_394.slots.default;
    const __VLS_395 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_396 = __VLS_asFunctionalComponent(__VLS_395, new __VLS_395({
        label: "款式要求",
        prop: "styleRequirement",
    }));
    const __VLS_397 = __VLS_396({
        label: "款式要求",
        prop: "styleRequirement",
    }, ...__VLS_functionalComponentArgsRest(__VLS_396));
    __VLS_398.slots.default;
    const __VLS_399 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_400 = __VLS_asFunctionalComponent(__VLS_399, new __VLS_399({
        modelValue: (__VLS_ctx.form.styleRequirement),
        placeholder: "款式/形态要求",
    }));
    const __VLS_401 = __VLS_400({
        modelValue: (__VLS_ctx.form.styleRequirement),
        placeholder: "款式/形态要求",
    }, ...__VLS_functionalComponentArgsRest(__VLS_400));
    var __VLS_398;
    var __VLS_394;
    const __VLS_403 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_404 = __VLS_asFunctionalComponent(__VLS_403, new __VLS_403({
        span: (8),
    }));
    const __VLS_405 = __VLS_404({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_404));
    __VLS_406.slots.default;
    const __VLS_407 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_408 = __VLS_asFunctionalComponent(__VLS_407, new __VLS_407({
        label: "适用品牌/对象",
        prop: "brandRequirement",
    }));
    const __VLS_409 = __VLS_408({
        label: "适用品牌/对象",
        prop: "brandRequirement",
    }, ...__VLS_functionalComponentArgsRest(__VLS_408));
    __VLS_410.slots.default;
    const __VLS_411 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_412 = __VLS_asFunctionalComponent(__VLS_411, new __VLS_411({
        modelValue: (__VLS_ctx.form.brandRequirement),
        placeholder: "适用品牌/对象要求",
    }));
    const __VLS_413 = __VLS_412({
        modelValue: (__VLS_ctx.form.brandRequirement),
        placeholder: "适用品牌/对象要求",
    }, ...__VLS_functionalComponentArgsRest(__VLS_412));
    var __VLS_410;
    var __VLS_406;
    var __VLS_378;
    const __VLS_415 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_416 = __VLS_asFunctionalComponent(__VLS_415, new __VLS_415({
        gutter: (24),
    }));
    const __VLS_417 = __VLS_416({
        gutter: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_416));
    __VLS_418.slots.default;
    const __VLS_419 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_420 = __VLS_asFunctionalComponent(__VLS_419, new __VLS_419({
        span: (8),
    }));
    const __VLS_421 = __VLS_420({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_420));
    __VLS_422.slots.default;
    const __VLS_423 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_424 = __VLS_asFunctionalComponent(__VLS_423, new __VLS_423({
        label: "材质要求",
        prop: "materialRequirement",
    }));
    const __VLS_425 = __VLS_424({
        label: "材质要求",
        prop: "materialRequirement",
    }, ...__VLS_functionalComponentArgsRest(__VLS_424));
    __VLS_426.slots.default;
    const __VLS_427 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_428 = __VLS_asFunctionalComponent(__VLS_427, new __VLS_427({
        modelValue: (__VLS_ctx.form.materialRequirement),
        placeholder: "材质要求",
    }));
    const __VLS_429 = __VLS_428({
        modelValue: (__VLS_ctx.form.materialRequirement),
        placeholder: "材质要求",
    }, ...__VLS_functionalComponentArgsRest(__VLS_428));
    var __VLS_426;
    var __VLS_422;
    const __VLS_431 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_432 = __VLS_asFunctionalComponent(__VLS_431, new __VLS_431({
        span: (8),
    }));
    const __VLS_433 = __VLS_432({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_432));
    __VLS_434.slots.default;
    const __VLS_435 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_436 = __VLS_asFunctionalComponent(__VLS_435, new __VLS_435({
        label: "图案要求",
        prop: "patternRequirement",
    }));
    const __VLS_437 = __VLS_436({
        label: "图案要求",
        prop: "patternRequirement",
    }, ...__VLS_functionalComponentArgsRest(__VLS_436));
    __VLS_438.slots.default;
    const __VLS_439 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_440 = __VLS_asFunctionalComponent(__VLS_439, new __VLS_439({
        modelValue: (__VLS_ctx.form.patternRequirement),
        placeholder: "图案/Logo印刷要求",
    }));
    const __VLS_441 = __VLS_440({
        modelValue: (__VLS_ctx.form.patternRequirement),
        placeholder: "图案/Logo印刷要求",
    }, ...__VLS_functionalComponentArgsRest(__VLS_440));
    var __VLS_438;
    var __VLS_434;
    const __VLS_443 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_444 = __VLS_asFunctionalComponent(__VLS_443, new __VLS_443({
        span: (8),
    }));
    const __VLS_445 = __VLS_444({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_444));
    __VLS_446.slots.default;
    const __VLS_447 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_448 = __VLS_asFunctionalComponent(__VLS_447, new __VLS_447({
        label: "颜色要求",
        prop: "colorRequirement",
    }));
    const __VLS_449 = __VLS_448({
        label: "颜色要求",
        prop: "colorRequirement",
    }, ...__VLS_functionalComponentArgsRest(__VLS_448));
    __VLS_450.slots.default;
    const __VLS_451 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_452 = __VLS_asFunctionalComponent(__VLS_451, new __VLS_451({
        modelValue: (__VLS_ctx.form.colorRequirement),
        placeholder: "颜色要求",
    }));
    const __VLS_453 = __VLS_452({
        modelValue: (__VLS_ctx.form.colorRequirement),
        placeholder: "颜色要求",
    }, ...__VLS_functionalComponentArgsRest(__VLS_452));
    var __VLS_450;
    var __VLS_446;
    var __VLS_418;
    const __VLS_455 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_456 = __VLS_asFunctionalComponent(__VLS_455, new __VLS_455({
        gutter: (24),
    }));
    const __VLS_457 = __VLS_456({
        gutter: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_456));
    __VLS_458.slots.default;
    const __VLS_459 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_460 = __VLS_asFunctionalComponent(__VLS_459, new __VLS_459({
        span: (8),
    }));
    const __VLS_461 = __VLS_460({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_460));
    __VLS_462.slots.default;
    const __VLS_463 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_464 = __VLS_asFunctionalComponent(__VLS_463, new __VLS_463({
        label: "尺寸要求",
        prop: "sizeRequirement",
    }));
    const __VLS_465 = __VLS_464({
        label: "尺寸要求",
        prop: "sizeRequirement",
    }, ...__VLS_functionalComponentArgsRest(__VLS_464));
    __VLS_466.slots.default;
    const __VLS_467 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_468 = __VLS_asFunctionalComponent(__VLS_467, new __VLS_467({
        modelValue: (__VLS_ctx.form.sizeRequirement),
        placeholder: "尺寸/大小要求",
    }));
    const __VLS_469 = __VLS_468({
        modelValue: (__VLS_ctx.form.sizeRequirement),
        placeholder: "尺寸/大小要求",
    }, ...__VLS_functionalComponentArgsRest(__VLS_468));
    var __VLS_466;
    var __VLS_462;
    const __VLS_471 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_472 = __VLS_asFunctionalComponent(__VLS_471, new __VLS_471({
        span: (8),
    }));
    const __VLS_473 = __VLS_472({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_472));
    __VLS_474.slots.default;
    const __VLS_475 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_476 = __VLS_asFunctionalComponent(__VLS_475, new __VLS_475({
        label: "重量要求",
        prop: "weightRequirement",
    }));
    const __VLS_477 = __VLS_476({
        label: "重量要求",
        prop: "weightRequirement",
    }, ...__VLS_functionalComponentArgsRest(__VLS_476));
    __VLS_478.slots.default;
    const __VLS_479 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_480 = __VLS_asFunctionalComponent(__VLS_479, new __VLS_479({
        modelValue: (__VLS_ctx.form.weightRequirement),
        placeholder: "重量要求",
    }));
    const __VLS_481 = __VLS_480({
        modelValue: (__VLS_ctx.form.weightRequirement),
        placeholder: "重量要求",
    }, ...__VLS_functionalComponentArgsRest(__VLS_480));
    var __VLS_478;
    var __VLS_474;
    const __VLS_483 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_484 = __VLS_asFunctionalComponent(__VLS_483, new __VLS_483({
        span: (8),
    }));
    const __VLS_485 = __VLS_484({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_484));
    __VLS_486.slots.default;
    const __VLS_487 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_488 = __VLS_asFunctionalComponent(__VLS_487, new __VLS_487({
        label: "包装数量要求",
        prop: "packQtyRequirement",
    }));
    const __VLS_489 = __VLS_488({
        label: "包装数量要求",
        prop: "packQtyRequirement",
    }, ...__VLS_functionalComponentArgsRest(__VLS_488));
    __VLS_490.slots.default;
    const __VLS_491 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_492 = __VLS_asFunctionalComponent(__VLS_491, new __VLS_491({
        modelValue: (__VLS_ctx.form.packQtyRequirement),
        placeholder: "包装数量要求",
    }));
    const __VLS_493 = __VLS_492({
        modelValue: (__VLS_ctx.form.packQtyRequirement),
        placeholder: "包装数量要求",
    }, ...__VLS_functionalComponentArgsRest(__VLS_492));
    var __VLS_490;
    var __VLS_486;
    var __VLS_458;
    const __VLS_495 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_496 = __VLS_asFunctionalComponent(__VLS_495, new __VLS_495({
        gutter: (24),
    }));
    const __VLS_497 = __VLS_496({
        gutter: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_496));
    __VLS_498.slots.default;
    const __VLS_499 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_500 = __VLS_asFunctionalComponent(__VLS_499, new __VLS_499({
        span: (8),
    }));
    const __VLS_501 = __VLS_500({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_500));
    __VLS_502.slots.default;
    const __VLS_503 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_504 = __VLS_asFunctionalComponent(__VLS_503, new __VLS_503({
        label: "功能要求",
        prop: "functionRequirement",
    }));
    const __VLS_505 = __VLS_504({
        label: "功能要求",
        prop: "functionRequirement",
    }, ...__VLS_functionalComponentArgsRest(__VLS_504));
    __VLS_506.slots.default;
    const __VLS_507 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_508 = __VLS_asFunctionalComponent(__VLS_507, new __VLS_507({
        modelValue: (__VLS_ctx.form.functionRequirement),
        placeholder: "功能/物理优势要求",
    }));
    const __VLS_509 = __VLS_508({
        modelValue: (__VLS_ctx.form.functionRequirement),
        placeholder: "功能/物理优势要求",
    }, ...__VLS_functionalComponentArgsRest(__VLS_508));
    var __VLS_506;
    var __VLS_502;
    const __VLS_511 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_512 = __VLS_asFunctionalComponent(__VLS_511, new __VLS_511({
        span: (8),
    }));
    const __VLS_513 = __VLS_512({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_512));
    __VLS_514.slots.default;
    const __VLS_515 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_516 = __VLS_asFunctionalComponent(__VLS_515, new __VLS_515({
        label: "配件要求",
        prop: "accessoryRequirement",
    }));
    const __VLS_517 = __VLS_516({
        label: "配件要求",
        prop: "accessoryRequirement",
    }, ...__VLS_functionalComponentArgsRest(__VLS_516));
    __VLS_518.slots.default;
    const __VLS_519 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_520 = __VLS_asFunctionalComponent(__VLS_519, new __VLS_519({
        modelValue: (__VLS_ctx.form.accessoryRequirement),
        placeholder: "配件要求",
    }));
    const __VLS_521 = __VLS_520({
        modelValue: (__VLS_ctx.form.accessoryRequirement),
        placeholder: "配件要求",
    }, ...__VLS_functionalComponentArgsRest(__VLS_520));
    var __VLS_518;
    var __VLS_514;
    const __VLS_523 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_524 = __VLS_asFunctionalComponent(__VLS_523, new __VLS_523({
        span: (8),
    }));
    const __VLS_525 = __VLS_524({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_524));
    __VLS_526.slots.default;
    const __VLS_527 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_528 = __VLS_asFunctionalComponent(__VLS_527, new __VLS_527({
        label: "包装要求",
        prop: "packagingRequirement",
    }));
    const __VLS_529 = __VLS_528({
        label: "包装要求",
        prop: "packagingRequirement",
    }, ...__VLS_functionalComponentArgsRest(__VLS_528));
    __VLS_530.slots.default;
    const __VLS_531 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_532 = __VLS_asFunctionalComponent(__VLS_531, new __VLS_531({
        modelValue: (__VLS_ctx.form.packagingRequirement),
        placeholder: "包装要求",
    }));
    const __VLS_533 = __VLS_532({
        modelValue: (__VLS_ctx.form.packagingRequirement),
        placeholder: "包装要求",
    }, ...__VLS_functionalComponentArgsRest(__VLS_532));
    var __VLS_530;
    var __VLS_526;
    var __VLS_498;
    const __VLS_535 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_536 = __VLS_asFunctionalComponent(__VLS_535, new __VLS_535({
        gutter: (24),
    }));
    const __VLS_537 = __VLS_536({
        gutter: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_536));
    __VLS_538.slots.default;
    const __VLS_539 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_540 = __VLS_asFunctionalComponent(__VLS_539, new __VLS_539({
        span: (8),
    }));
    const __VLS_541 = __VLS_540({
        span: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_540));
    __VLS_542.slots.default;
    const __VLS_543 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_544 = __VLS_asFunctionalComponent(__VLS_543, new __VLS_543({
        label: "合规要求",
        prop: "complianceRequirement",
    }));
    const __VLS_545 = __VLS_544({
        label: "合规要求",
        prop: "complianceRequirement",
    }, ...__VLS_functionalComponentArgsRest(__VLS_544));
    __VLS_546.slots.default;
    const __VLS_547 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_548 = __VLS_asFunctionalComponent(__VLS_547, new __VLS_547({
        modelValue: (__VLS_ctx.form.complianceRequirement),
        placeholder: "合规/物理参数",
    }));
    const __VLS_549 = __VLS_548({
        modelValue: (__VLS_ctx.form.complianceRequirement),
        placeholder: "合规/物理参数",
    }, ...__VLS_functionalComponentArgsRest(__VLS_548));
    var __VLS_546;
    var __VLS_542;
    const __VLS_551 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_552 = __VLS_asFunctionalComponent(__VLS_551, new __VLS_551({
        span: (16),
    }));
    const __VLS_553 = __VLS_552({
        span: (16),
    }, ...__VLS_functionalComponentArgsRest(__VLS_552));
    __VLS_554.slots.default;
    const __VLS_555 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_556 = __VLS_asFunctionalComponent(__VLS_555, new __VLS_555({
        label: "认证要求",
        prop: "certRequirement",
    }));
    const __VLS_557 = __VLS_556({
        label: "认证要求",
        prop: "certRequirement",
    }, ...__VLS_functionalComponentArgsRest(__VLS_556));
    __VLS_558.slots.default;
    const __VLS_559 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_560 = __VLS_asFunctionalComponent(__VLS_559, new __VLS_559({
        modelValue: (__VLS_ctx.form.certRequirement),
        placeholder: "认证/标准要求",
    }));
    const __VLS_561 = __VLS_560({
        modelValue: (__VLS_ctx.form.certRequirement),
        placeholder: "认证/标准要求",
    }, ...__VLS_functionalComponentArgsRest(__VLS_560));
    var __VLS_558;
    var __VLS_554;
    var __VLS_538;
}
else {
    const __VLS_563 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_564 = __VLS_asFunctionalComponent(__VLS_563, new __VLS_563({
        gutter: (24),
        ...{ class: "mb-8" },
    }));
    const __VLS_565 = __VLS_564({
        gutter: (24),
        ...{ class: "mb-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_564));
    __VLS_566.slots.default;
    const __VLS_567 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_568 = __VLS_asFunctionalComponent(__VLS_567, new __VLS_567({
        span: (12),
    }));
    const __VLS_569 = __VLS_568({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_568));
    __VLS_570.slots.default;
    const __VLS_571 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_572 = __VLS_asFunctionalComponent(__VLS_571, new __VLS_571({
        label: "底线采购价",
        prop: "bottomLinePrice",
    }));
    const __VLS_573 = __VLS_572({
        label: "底线采购价",
        prop: "bottomLinePrice",
    }, ...__VLS_functionalComponentArgsRest(__VLS_572));
    __VLS_574.slots.default;
    const __VLS_575 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_576 = __VLS_asFunctionalComponent(__VLS_575, new __VLS_575({
        modelValue: (__VLS_ctx.form.bottomLinePrice),
        placeholder: "例: 32 CNY",
    }));
    const __VLS_577 = __VLS_576({
        modelValue: (__VLS_ctx.form.bottomLinePrice),
        placeholder: "例: 32 CNY",
    }, ...__VLS_functionalComponentArgsRest(__VLS_576));
    var __VLS_574;
    var __VLS_570;
    const __VLS_579 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_580 = __VLS_asFunctionalComponent(__VLS_579, new __VLS_579({
        span: (12),
    }));
    const __VLS_581 = __VLS_580({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_580));
    __VLS_582.slots.default;
    const __VLS_583 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_584 = __VLS_asFunctionalComponent(__VLS_583, new __VLS_583({
        label: "产品规格书",
    }));
    const __VLS_585 = __VLS_584({
        label: "产品规格书",
    }, ...__VLS_functionalComponentArgsRest(__VLS_584));
    __VLS_586.slots.default;
    const __VLS_587 = {}.ElUpload;
    /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
    // @ts-ignore
    const __VLS_588 = __VLS_asFunctionalComponent(__VLS_587, new __VLS_587({
        action: "#",
        showFileList: (false),
        autoUpload: (false),
        onChange: (__VLS_ctx.handleDesignFileUpload),
        ...{ class: "doc-upload-inline" },
    }));
    const __VLS_589 = __VLS_588({
        action: "#",
        showFileList: (false),
        autoUpload: (false),
        onChange: (__VLS_ctx.handleDesignFileUpload),
        ...{ class: "doc-upload-inline" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_588));
    __VLS_590.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "doc-upload-trigger-dashed" },
    });
    const __VLS_591 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_592 = __VLS_asFunctionalComponent(__VLS_591, new __VLS_591({}));
    const __VLS_593 = __VLS_592({}, ...__VLS_functionalComponentArgsRest(__VLS_592));
    __VLS_594.slots.default;
    const __VLS_595 = {}.Plus;
    /** @type {[typeof __VLS_components.Plus, ]} */ ;
    // @ts-ignore
    const __VLS_596 = __VLS_asFunctionalComponent(__VLS_595, new __VLS_595({}));
    const __VLS_597 = __VLS_596({}, ...__VLS_functionalComponentArgsRest(__VLS_596));
    var __VLS_594;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    var __VLS_590;
    var __VLS_586;
    var __VLS_582;
    var __VLS_566;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "design-capsule-wrapper mb-12" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "design-capsule-list" },
    });
    for (const [file, idx] of __VLS_getVForSourceType((__VLS_ctx.form.designFiles))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (idx),
            ...{ class: "design-capsule-item" },
        });
        const __VLS_599 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_600 = __VLS_asFunctionalComponent(__VLS_599, new __VLS_599({
            ...{ class: "file-icon" },
        }));
        const __VLS_601 = __VLS_600({
            ...{ class: "file-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_600));
        __VLS_602.slots.default;
        const __VLS_603 = {}.Document;
        /** @type {[typeof __VLS_components.Document, ]} */ ;
        // @ts-ignore
        const __VLS_604 = __VLS_asFunctionalComponent(__VLS_603, new __VLS_603({}));
        const __VLS_605 = __VLS_604({}, ...__VLS_functionalComponentArgsRest(__VLS_604));
        var __VLS_602;
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
        const __VLS_607 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_608 = __VLS_asFunctionalComponent(__VLS_607, new __VLS_607({
            ...{ 'onClick': {} },
            type: "danger",
            link: true,
            size: "small",
            ...{ class: "delete-btn" },
        }));
        const __VLS_609 = __VLS_608({
            ...{ 'onClick': {} },
            type: "danger",
            link: true,
            size: "small",
            ...{ class: "delete-btn" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_608));
        let __VLS_611;
        let __VLS_612;
        let __VLS_613;
        const __VLS_614 = {
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.form.samplingMethod === '现货拿样'))
                    return;
                __VLS_ctx.removeDesignFile(idx);
            }
        };
        __VLS_610.slots.default;
        var __VLS_610;
    }
    if (!__VLS_ctx.form.designFiles || __VLS_ctx.form.designFiles.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "no-design-placeholder" },
        });
    }
}
const __VLS_615 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_616 = __VLS_asFunctionalComponent(__VLS_615, new __VLS_615({
    gutter: (24),
}));
const __VLS_617 = __VLS_616({
    gutter: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_616));
__VLS_618.slots.default;
const __VLS_619 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_620 = __VLS_asFunctionalComponent(__VLS_619, new __VLS_619({
    span: (24),
}));
const __VLS_621 = __VLS_620({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_620));
__VLS_622.slots.default;
const __VLS_623 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_624 = __VLS_asFunctionalComponent(__VLS_623, new __VLS_623({
    label: "补充说明",
    prop: "supplementaryRequirement",
}));
const __VLS_625 = __VLS_624({
    label: "补充说明",
    prop: "supplementaryRequirement",
}, ...__VLS_functionalComponentArgsRest(__VLS_624));
__VLS_626.slots.default;
const __VLS_627 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_628 = __VLS_asFunctionalComponent(__VLS_627, new __VLS_627({
    modelValue: (__VLS_ctx.form.supplementaryRequirement),
    type: "textarea",
    rows: (3),
    placeholder: "请输入对该任务的补充说明或特殊注意事项...",
    maxlength: "500",
    showWordLimit: true,
}));
const __VLS_629 = __VLS_628({
    modelValue: (__VLS_ctx.form.supplementaryRequirement),
    type: "textarea",
    rows: (3),
    placeholder: "请输入对该任务的补充说明或特殊注意事项...",
    maxlength: "500",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_628));
var __VLS_626;
var __VLS_622;
var __VLS_618;
var __VLS_12;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "edit-dialog-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "footer-left-info" },
    });
    const __VLS_631 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_632 = __VLS_asFunctionalComponent(__VLS_631, new __VLS_631({}));
    const __VLS_633 = __VLS_632({}, ...__VLS_functionalComponentArgsRest(__VLS_632));
    __VLS_634.slots.default;
    const __VLS_635 = {}.InfoFilled;
    /** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
    // @ts-ignore
    const __VLS_636 = __VLS_asFunctionalComponent(__VLS_635, new __VLS_635({}));
    const __VLS_637 = __VLS_636({}, ...__VLS_functionalComponentArgsRest(__VLS_636));
    var __VLS_634;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "footer-actions" },
    });
    const __VLS_639 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_640 = __VLS_asFunctionalComponent(__VLS_639, new __VLS_639({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_641 = __VLS_640({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_640));
    let __VLS_643;
    let __VLS_644;
    let __VLS_645;
    const __VLS_646 = {
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_642.slots.default;
    var __VLS_642;
    const __VLS_647 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_648 = __VLS_asFunctionalComponent(__VLS_647, new __VLS_647({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
        loading: (__VLS_ctx.saving),
        size: "small",
    }));
    const __VLS_649 = __VLS_648({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
        loading: (__VLS_ctx.saving),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_648));
    let __VLS_651;
    let __VLS_652;
    let __VLS_653;
    const __VLS_654 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleSave(false);
        }
    };
    __VLS_650.slots.default;
    var __VLS_650;
    const __VLS_655 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_656 = __VLS_asFunctionalComponent(__VLS_655, new __VLS_655({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
        size: "small",
    }));
    const __VLS_657 = __VLS_656({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_656));
    let __VLS_659;
    let __VLS_660;
    let __VLS_661;
    const __VLS_662 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleSave(true);
        }
    };
    __VLS_658.slots.default;
    var __VLS_658;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['proposal-create-task-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-header-custom']} */ ;
/** @type {__VLS_StyleScopedClasses['title-main']} */ ;
/** @type {__VLS_StyleScopedClasses['proposal-no-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['create-task-dialog-container']} */ ;
/** @type {__VLS_StyleScopedClasses['workspace-form']} */ ;
/** @type {__VLS_StyleScopedClasses['info-dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['dash-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['dash-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['unit']} */ ;
/** @type {__VLS_StyleScopedClasses['dash-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['dash-item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['value-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['proposal-review-card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
/** @type {__VLS_StyleScopedClasses['proposal-review-content']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['review-section-block']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['date-descriptions']} */ ;
/** @type {__VLS_StyleScopedClasses['review-section-block']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-block-readonly']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['read-label']} */ ;
/** @type {__VLS_StyleScopedClasses['read-text-value']} */ ;
/** @type {__VLS_StyleScopedClasses['link-block-readonly']} */ ;
/** @type {__VLS_StyleScopedClasses['read-label']} */ ;
/** @type {__VLS_StyleScopedClasses['multi-links-readonly']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['link-item-readonly']} */ ;
/** @type {__VLS_StyleScopedClasses['text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['file-block-readonly']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['read-label']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['file-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['image-gallery-readonly']} */ ;
/** @type {__VLS_StyleScopedClasses['read-label']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['img-list-readonly']} */ ;
/** @type {__VLS_StyleScopedClasses['gallery-item-readonly']} */ ;
/** @type {__VLS_StyleScopedClasses['text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['review-section-block']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['design-file-readonly-list']} */ ;
/** @type {__VLS_StyleScopedClasses['design-file-readonly-item']} */ ;
/** @type {__VLS_StyleScopedClasses['file-name-span']} */ ;
/** @type {__VLS_StyleScopedClasses['file-meta-span']} */ ;
/** @type {__VLS_StyleScopedClasses['text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-upload-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-upload-trigger-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['design-capsule-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['design-capsule-list']} */ ;
/** @type {__VLS_StyleScopedClasses['design-capsule-item']} */ ;
/** @type {__VLS_StyleScopedClasses['file-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['file-info']} */ ;
/** @type {__VLS_StyleScopedClasses['file-name']} */ ;
/** @type {__VLS_StyleScopedClasses['file-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['no-design-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-dialog-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-left-info']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-actions']} */ ;
// @ts-ignore
var __VLS_14 = __VLS_13;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Document: Document,
            InfoFilled: InfoFilled,
            ArrowDown: ArrowDown,
            ArrowUp: ArrowUp,
            Management: Management,
            Monitor: Monitor,
            Guide: Guide,
            Link: Link,
            visible: visible,
            formRef: formRef,
            saving: saving,
            isProposalReviewCollapsed: isProposalReviewCollapsed,
            form: form,
            handleDesignFileUpload: handleDesignFileUpload,
            removeDesignFile: removeDesignFile,
            handleClosed: handleClosed,
            rules: rules,
            handleSave: handleSave,
        };
    },
    emits: {},
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        rowData: {
            type: Object,
            default: () => ({})
        }
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    emits: {},
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        rowData: {
            type: Object,
            default: () => ({})
        }
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=CreateTaskDialog.vue.js.map