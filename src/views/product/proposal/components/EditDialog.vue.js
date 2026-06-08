/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, watch } from 'vue';
import { Plus, Delete, Document, InfoFilled, QuestionFilled, ArrowDown, ArrowUp, Calendar } from '@element-plus/icons-vue';
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
const submitting = ref(false);
const isReadonlyCollapsed = ref(true);
// 预设的多选标签
const presetSeasons = ['春季', '夏季', '秋季', '冬季', '常规/四季通用'];
const presetHolidays = ['圣诞节', '情人节', '母亲节', '父亲节', '万圣节', '感恩节', '无'];
// 表单初始值声明
const form = ref({
    proposalNo: '',
    productName: '',
    status: '待设计',
    category: '',
    teamLeader: '周亮亮',
    manager: '',
    spu: '',
    style: '',
    material: '',
    applicableObject: '',
    model: '',
    platform: 'Amazon',
    devMethod: '全新品-现货',
    brand: '',
    productSource: '工厂选品',
    logoPosition: '无',
    packagingMethod: '常规包装',
    buyQty: 0,
    unitPrice: 0,
    totalAmount: 0,
    level: 'D',
    listingTimeOps: '',
    listingTimeDev: '',
    sellingPoints: '',
    marketEst: '',
    usageScenario: '',
    userGroup: '',
    seasonTags: [],
    holidayTags: [],
    mainMarket: [],
    researchFile: '',
    roiFile: '',
    refLinks: [],
    refImages: [],
    researchFiles: [],
    designLogoPosition: '无',
    productManual: '',
    designFiles: [],
    estProposalDate: '',
    estProjectDate: '',
    date: ''
});
// 监听 rowData，进行深度拷贝
watch(() => props.rowData, (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
        // 基础合并，保证数组 and 对象拥有默认结构
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
            merged.applicableObject = newVal.applicableObject || '-';
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
        form.value = JSON.parse(JSON.stringify(merged));
    }
}, { immediate: true });
// 计算预估总额格式化
const formattedTotalAmount = computed(() => {
    const amount = form.value.buyQty * form.value.unitPrice;
    return amount ? amount.toFixed(2) : '0.00';
});
// 数量/单价变更联动逻辑
const handleFinancialChange = () => {
    form.value.totalAmount = form.value.buyQty * form.value.unitPrice;
};
const previewVisible = ref(false);
const previewImageUrl = ref('');
const handleRefImagePreview = (file) => {
    previewImageUrl.value = file.url || '';
    previewVisible.value = true;
};
const getFileIconClass = (fileName) => {
    if (!fileName)
        return 'pdf';
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['xls', 'xlsx'].includes(ext))
        return 'excel';
    if (['doc', 'docx'].includes(ext))
        return 'word';
    return 'pdf';
};
const handleResearchFileUpload = (uploadFile) => {
    const newFile = {
        name: uploadFile.name || '新上传文档.pdf'
    };
    if (!form.value.researchFiles) {
        form.value.researchFiles = [];
    }
    form.value.researchFiles.push(newFile);
    ElMessage.success('成功上传调研分析文档');
};
const removeResearchFile = (index) => {
    form.value.researchFiles.splice(index, 1);
    ElMessage.warning('已移除该文档');
};
// 季节标签切换
const toggleSeasonTag = (tag) => {
    const index = form.value.seasonTags.indexOf(tag);
    if (index > -1) {
        form.value.seasonTags.splice(index, 1);
    }
    else {
        form.value.seasonTags.push(tag);
    }
};
// 节日标签切换
const toggleHolidayTag = (tag) => {
    const index = form.value.holidayTags.indexOf(tag);
    if (index > -1) {
        form.value.holidayTags.splice(index, 1);
    }
    else {
        form.value.holidayTags.push(tag);
    }
};
// 获取状态对应 Tag 类型
const getStatusType = (status) => {
    const map = {
        '待设计': 'info',
        '拿样中': 'warning',
        '设计中': 'success'
    };
    return map[status] || 'info';
};
// 动态增删参考链接
const addRefLink = () => {
    form.value.refLinks.push({ label: '', url: '' });
};
const removeRefLink = (index) => {
    form.value.refLinks.splice(index, 1);
};
// 上传产品规格书模拟
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
    productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
    category: [{ required: true, message: '请选择运营大类', trigger: 'change' }],
    manager: [{ required: true, message: '请选择产品经理', trigger: 'change' }],
    level: [{ required: true, message: '请选择提案等级', trigger: 'change' }]
};
// 保存 / 提交数据
const handleSave = async (action) => {
    if (!formRef.value)
        return;
    await formRef.value.validate(async (valid) => {
        if (valid) {
            if (action === 'submit') {
                submitting.value = true;
            }
            else {
                saving.value = true;
            }
            try {
                // 模拟网络传输延迟
                await new Promise((resolve) => setTimeout(resolve, 1000));
                form.value.totalAmount = form.value.buyQty * form.value.unitPrice;
                if (action === 'submit') {
                    if (form.value.status === '待设计') {
                        form.value.status = '设计中';
                    }
                    emit('save', JSON.parse(JSON.stringify(form.value)));
                    ElMessage.success('提案已成功提交并同步状态');
                }
                else {
                    emit('save', JSON.parse(JSON.stringify(form.value)));
                    ElMessage.success('提案内容已保存草稿');
                }
                visible.value = false;
            }
            finally {
                saving.value = false;
                submitting.value = false;
            }
        }
        else {
            ElMessage.warning('表单信息校验失败，请检查红框必填项');
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
    width: "1100px",
    ...{ class: "proposal-edit-dialog" },
    destroyOnClose: true,
    alignCenter: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.visible),
    width: "1100px",
    ...{ class: "proposal-edit-dialog" },
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
    const __VLS_9 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
        type: (__VLS_ctx.getStatusType(__VLS_ctx.form.status)),
        size: "small",
        effect: "dark",
    }));
    const __VLS_11 = __VLS_10({
        type: (__VLS_ctx.getStatusType(__VLS_ctx.form.status)),
        size: "small",
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    __VLS_12.slots.default;
    (__VLS_ctx.form.status);
    var __VLS_12;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "edit-dialog-container" },
});
const __VLS_13 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "left",
    labelWidth: "130px",
    ...{ class: "workspace-form" },
    size: "small",
}));
const __VLS_15 = __VLS_14({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "left",
    labelWidth: "130px",
    ...{ class: "workspace-form" },
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_17 = {};
__VLS_16.slots.default;
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
(__VLS_ctx.formattedTotalAmount);
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
    ...{ class: "section-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_19 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
    size: "small",
    ...{ style: {} },
}));
const __VLS_21 = __VLS_20({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
    size: "small",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_23;
let __VLS_24;
let __VLS_25;
const __VLS_26 = {
    onClick: (...[$event]) => {
        __VLS_ctx.isReadonlyCollapsed = !__VLS_ctx.isReadonlyCollapsed;
    }
};
__VLS_22.slots.default;
(__VLS_ctx.isReadonlyCollapsed ? '展开只读信息' : '收起只读信息');
const __VLS_27 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
    ...{ class: "el-icon--right" },
}));
const __VLS_29 = __VLS_28({
    ...{ class: "el-icon--right" },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_30.slots.default;
if (__VLS_ctx.isReadonlyCollapsed) {
    const __VLS_31 = {}.ArrowDown;
    /** @type {[typeof __VLS_components.ArrowDown, ]} */ ;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({}));
    const __VLS_33 = __VLS_32({}, ...__VLS_functionalComponentArgsRest(__VLS_32));
}
else {
    const __VLS_35 = {}.ArrowUp;
    /** @type {[typeof __VLS_components.ArrowUp, ]} */ ;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(__VLS_35, new __VLS_35({}));
    const __VLS_37 = __VLS_36({}, ...__VLS_functionalComponentArgsRest(__VLS_36));
}
var __VLS_30;
var __VLS_22;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "readonly-content-collapse-wrapper mb-12" },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.isReadonlyCollapsed) }, null, null);
const __VLS_39 = {}.ElDescriptions;
/** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(__VLS_39, new __VLS_39({
    column: (3),
    border: true,
    size: "small",
    ...{ class: "mb-12" },
}));
const __VLS_41 = __VLS_40({
    column: (3),
    border: true,
    size: "small",
    ...{ class: "mb-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
__VLS_42.slots.default;
const __VLS_43 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({
    label: "运营大类",
}));
const __VLS_45 = __VLS_44({
    label: "运营大类",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_46.slots.default;
(__VLS_ctx.form.category || '-');
var __VLS_46;
const __VLS_47 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(__VLS_47, new __VLS_47({
    label: "团队负责人",
}));
const __VLS_49 = __VLS_48({
    label: "团队负责人",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
__VLS_50.slots.default;
(__VLS_ctx.form.teamLeader || '-');
var __VLS_50;
const __VLS_51 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent(__VLS_51, new __VLS_51({
    label: "产品经理",
}));
const __VLS_53 = __VLS_52({
    label: "产品经理",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_54.slots.default;
(__VLS_ctx.form.manager || '-');
var __VLS_54;
const __VLS_55 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({
    label: "产品名称",
}));
const __VLS_57 = __VLS_56({
    label: "产品名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
__VLS_58.slots.default;
(__VLS_ctx.form.productName || '-');
var __VLS_58;
const __VLS_59 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent(__VLS_59, new __VLS_59({
    label: "款式",
}));
const __VLS_61 = __VLS_60({
    label: "款式",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
__VLS_62.slots.default;
(__VLS_ctx.form.style || '-');
var __VLS_62;
const __VLS_63 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent(__VLS_63, new __VLS_63({
    label: "主材料",
}));
const __VLS_65 = __VLS_64({
    label: "主材料",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
__VLS_66.slots.default;
(__VLS_ctx.form.material || '-');
var __VLS_66;
const __VLS_67 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({
    label: "适用品牌/对象",
}));
const __VLS_69 = __VLS_68({
    label: "适用品牌/对象",
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_70.slots.default;
(__VLS_ctx.form.applicableObject || '-');
var __VLS_70;
const __VLS_71 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent(__VLS_71, new __VLS_71({
    label: "型号",
}));
const __VLS_73 = __VLS_72({
    label: "型号",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_74.slots.default;
(__VLS_ctx.form.model || '-');
var __VLS_74;
const __VLS_75 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent(__VLS_75, new __VLS_75({
    label: "SPU",
}));
const __VLS_77 = __VLS_76({
    label: "SPU",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
__VLS_78.slots.default;
(__VLS_ctx.form.spu || '-');
var __VLS_78;
const __VLS_79 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({
    label: "产品来源",
}));
const __VLS_81 = __VLS_80({
    label: "产品来源",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
__VLS_82.slots.default;
(__VLS_ctx.form.productSource || '-');
var __VLS_82;
const __VLS_83 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent(__VLS_83, new __VLS_83({
    label: "开发方式",
}));
const __VLS_85 = __VLS_84({
    label: "开发方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
__VLS_86.slots.default;
(__VLS_ctx.form.devMethod || '-');
var __VLS_86;
const __VLS_87 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({
    label: "开发品牌",
}));
const __VLS_89 = __VLS_88({
    label: "开发品牌",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
__VLS_90.slots.default;
(__VLS_ctx.form.brand || '-');
var __VLS_90;
const __VLS_91 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({
    label: "初始Logo位置",
}));
const __VLS_93 = __VLS_92({
    label: "初始Logo位置",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
__VLS_94.slots.default;
(__VLS_ctx.form.logoPosition || '-');
var __VLS_94;
const __VLS_95 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent(__VLS_95, new __VLS_95({
    label: "初始包装方式",
}));
const __VLS_97 = __VLS_96({
    label: "初始包装方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
__VLS_98.slots.default;
(__VLS_ctx.form.packagingMethod || '-');
var __VLS_98;
const __VLS_99 = {}.ElDescriptionsItem;
/** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent(__VLS_99, new __VLS_99({
    label: "-",
}));
const __VLS_101 = __VLS_100({
    label: "-",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
var __VLS_42;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sub-section-title" },
});
const __VLS_103 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({}));
const __VLS_105 = __VLS_104({}, ...__VLS_functionalComponentArgsRest(__VLS_104));
__VLS_106.slots.default;
const __VLS_107 = {}.Calendar;
/** @type {[typeof __VLS_components.Calendar, ]} */ ;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent(__VLS_107, new __VLS_107({}));
const __VLS_109 = __VLS_108({}, ...__VLS_functionalComponentArgsRest(__VLS_108));
var __VLS_106;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_111 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent(__VLS_111, new __VLS_111({
    gutter: (24),
}));
const __VLS_113 = __VLS_112({
    gutter: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
__VLS_114.slots.default;
const __VLS_115 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({
    span: (6),
}));
const __VLS_117 = __VLS_116({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
__VLS_118.slots.default;
const __VLS_119 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
    prop: "estProposalDate",
}));
const __VLS_121 = __VLS_120({
    prop: "estProposalDate",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
__VLS_122.slots.default;
{
    const { label: __VLS_thisSlot } = __VLS_122.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-label-with-tip" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_123 = {}.ElTooltip;
    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
        content: "预计下单日期",
        placement: "top",
        effect: "dark",
    }));
    const __VLS_125 = __VLS_124({
        content: "预计下单日期",
        placement: "top",
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    __VLS_126.slots.default;
    const __VLS_127 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent(__VLS_127, new __VLS_127({
        ...{ class: "label-info-icon" },
    }));
    const __VLS_129 = __VLS_128({
        ...{ class: "label-info-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    __VLS_130.slots.default;
    const __VLS_131 = {}.QuestionFilled;
    /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
    // @ts-ignore
    const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({}));
    const __VLS_133 = __VLS_132({}, ...__VLS_functionalComponentArgsRest(__VLS_132));
    var __VLS_130;
    var __VLS_126;
}
const __VLS_135 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({
    modelValue: (__VLS_ctx.form.estProposalDate),
    type: "date",
    placeholder: "选择下单日期",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "w-full" },
}));
const __VLS_137 = __VLS_136({
    modelValue: (__VLS_ctx.form.estProposalDate),
    type: "date",
    placeholder: "选择下单日期",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
var __VLS_122;
var __VLS_118;
const __VLS_139 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent(__VLS_139, new __VLS_139({
    span: (6),
}));
const __VLS_141 = __VLS_140({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
__VLS_142.slots.default;
const __VLS_143 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({
    prop: "estProjectDate",
}));
const __VLS_145 = __VLS_144({
    prop: "estProjectDate",
}, ...__VLS_functionalComponentArgsRest(__VLS_144));
__VLS_146.slots.default;
{
    const { label: __VLS_thisSlot } = __VLS_146.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-label-with-tip" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_147 = {}.ElTooltip;
    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({
        content: "预计首单入库日期",
        placement: "top",
        effect: "dark",
    }));
    const __VLS_149 = __VLS_148({
        content: "预计首单入库日期",
        placement: "top",
        effect: "dark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    __VLS_150.slots.default;
    const __VLS_151 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_152 = __VLS_asFunctionalComponent(__VLS_151, new __VLS_151({
        ...{ class: "label-info-icon" },
    }));
    const __VLS_153 = __VLS_152({
        ...{ class: "label-info-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_152));
    __VLS_154.slots.default;
    const __VLS_155 = {}.QuestionFilled;
    /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
    // @ts-ignore
    const __VLS_156 = __VLS_asFunctionalComponent(__VLS_155, new __VLS_155({}));
    const __VLS_157 = __VLS_156({}, ...__VLS_functionalComponentArgsRest(__VLS_156));
    var __VLS_154;
    var __VLS_150;
}
const __VLS_159 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent(__VLS_159, new __VLS_159({
    modelValue: (__VLS_ctx.form.estProjectDate),
    type: "date",
    placeholder: "选择入库交期",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "w-full" },
}));
const __VLS_161 = __VLS_160({
    modelValue: (__VLS_ctx.form.estProjectDate),
    type: "date",
    placeholder: "选择入库交期",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
var __VLS_146;
var __VLS_142;
const __VLS_163 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent(__VLS_163, new __VLS_163({
    span: (6),
}));
const __VLS_165 = __VLS_164({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
__VLS_166.slots.default;
const __VLS_167 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent(__VLS_167, new __VLS_167({
    label: "开发上架时间要求",
    prop: "listingTimeDev",
}));
const __VLS_169 = __VLS_168({
    label: "开发上架时间要求",
    prop: "listingTimeDev",
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
__VLS_170.slots.default;
const __VLS_171 = {}.ElDatePicker;
/** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
// @ts-ignore
const __VLS_172 = __VLS_asFunctionalComponent(__VLS_171, new __VLS_171({
    modelValue: (__VLS_ctx.form.listingTimeDev),
    type: "date",
    placeholder: "选择上架日期",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "w-full" },
}));
const __VLS_173 = __VLS_172({
    modelValue: (__VLS_ctx.form.listingTimeDev),
    type: "date",
    placeholder: "选择上架日期",
    valueFormat: "YYYY-MM-DD",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_172));
var __VLS_170;
var __VLS_166;
const __VLS_175 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent(__VLS_175, new __VLS_175({
    span: (6),
}));
const __VLS_177 = __VLS_176({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
__VLS_178.slots.default;
const __VLS_179 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent(__VLS_179, new __VLS_179({
    label: "运营上架时间要求",
    prop: "listingTimeOps",
}));
const __VLS_181 = __VLS_180({
    label: "运营上架时间要求",
    prop: "listingTimeOps",
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
__VLS_182.slots.default;
const __VLS_183 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent(__VLS_183, new __VLS_183({
    modelValue: (__VLS_ctx.form.listingTimeOps),
    disabled: true,
    placeholder: "-",
}));
const __VLS_185 = __VLS_184({
    modelValue: (__VLS_ctx.form.listingTimeOps),
    disabled: true,
    placeholder: "-",
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
var __VLS_182;
var __VLS_178;
var __VLS_114;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
const __VLS_187 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent(__VLS_187, new __VLS_187({
    gutter: (24),
    ...{ class: "mb-8" },
}));
const __VLS_189 = __VLS_188({
    gutter: (24),
    ...{ class: "mb-8" },
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
const __VLS_195 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_196 = __VLS_asFunctionalComponent(__VLS_195, new __VLS_195({
    label: "主攻市场",
    prop: "mainMarket",
}));
const __VLS_197 = __VLS_196({
    label: "主攻市场",
    prop: "mainMarket",
}, ...__VLS_functionalComponentArgsRest(__VLS_196));
__VLS_198.slots.default;
const __VLS_199 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_200 = __VLS_asFunctionalComponent(__VLS_199, new __VLS_199({
    modelValue: (__VLS_ctx.form.mainMarket),
    multiple: true,
    collapseTags: true,
    placeholder: "选择销售市场",
    ...{ class: "w-full" },
}));
const __VLS_201 = __VLS_200({
    modelValue: (__VLS_ctx.form.mainMarket),
    multiple: true,
    collapseTags: true,
    placeholder: "选择销售市场",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_200));
__VLS_202.slots.default;
const __VLS_203 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_204 = __VLS_asFunctionalComponent(__VLS_203, new __VLS_203({
    label: "北美市场 (🇺🇸/🇨🇦)",
    value: "北美",
}));
const __VLS_205 = __VLS_204({
    label: "北美市场 (🇺🇸/🇨🇦)",
    value: "北美",
}, ...__VLS_functionalComponentArgsRest(__VLS_204));
const __VLS_207 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_208 = __VLS_asFunctionalComponent(__VLS_207, new __VLS_207({
    label: "欧洲市场 (🇪🇺)",
    value: "欧洲",
}));
const __VLS_209 = __VLS_208({
    label: "欧洲市场 (🇪🇺)",
    value: "欧洲",
}, ...__VLS_functionalComponentArgsRest(__VLS_208));
const __VLS_211 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_212 = __VLS_asFunctionalComponent(__VLS_211, new __VLS_211({
    label: "日本市场 (🇯🇵)",
    value: "日本",
}));
const __VLS_213 = __VLS_212({
    label: "日本市场 (🇯🇵)",
    value: "日本",
}, ...__VLS_functionalComponentArgsRest(__VLS_212));
const __VLS_215 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_216 = __VLS_asFunctionalComponent(__VLS_215, new __VLS_215({
    label: "澳洲市场 (🇦🇺)",
    value: "澳洲",
}));
const __VLS_217 = __VLS_216({
    label: "澳洲市场 (🇦🇺)",
    value: "澳洲",
}, ...__VLS_functionalComponentArgsRest(__VLS_216));
var __VLS_202;
var __VLS_198;
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
const __VLS_223 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_224 = __VLS_asFunctionalComponent(__VLS_223, new __VLS_223({
    label: "使用人群",
    prop: "userGroup",
}));
const __VLS_225 = __VLS_224({
    label: "使用人群",
    prop: "userGroup",
}, ...__VLS_functionalComponentArgsRest(__VLS_224));
__VLS_226.slots.default;
const __VLS_227 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_228 = __VLS_asFunctionalComponent(__VLS_227, new __VLS_227({
    modelValue: (__VLS_ctx.form.userGroup),
    placeholder: "如：中高端户外爱好者",
}));
const __VLS_229 = __VLS_228({
    modelValue: (__VLS_ctx.form.userGroup),
    placeholder: "如：中高端户外爱好者",
}, ...__VLS_functionalComponentArgsRest(__VLS_228));
var __VLS_226;
var __VLS_222;
var __VLS_190;
const __VLS_231 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_232 = __VLS_asFunctionalComponent(__VLS_231, new __VLS_231({
    gutter: (24),
    ...{ class: "mb-4" },
}));
const __VLS_233 = __VLS_232({
    gutter: (24),
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_232));
__VLS_234.slots.default;
const __VLS_235 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent(__VLS_235, new __VLS_235({
    span: (24),
}));
const __VLS_237 = __VLS_236({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_236));
__VLS_238.slots.default;
const __VLS_239 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_240 = __VLS_asFunctionalComponent(__VLS_239, new __VLS_239({
    label: "市场评估",
    prop: "marketEst",
}));
const __VLS_241 = __VLS_240({
    label: "市场评估",
    prop: "marketEst",
}, ...__VLS_functionalComponentArgsRest(__VLS_240));
__VLS_242.slots.default;
const __VLS_243 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_244 = __VLS_asFunctionalComponent(__VLS_243, new __VLS_243({
    modelValue: (__VLS_ctx.form.marketEst),
    type: "textarea",
    rows: (3),
    placeholder: "提示要点：&#10;1. 对应竞品月销预估与客单价定位&#10;2. 核心流量入口与搜索热度趋势&#10;3. ROI测算与目标毛利率范围",
}));
const __VLS_245 = __VLS_244({
    modelValue: (__VLS_ctx.form.marketEst),
    type: "textarea",
    rows: (3),
    placeholder: "提示要点：&#10;1. 对应竞品月销预估与客单价定位&#10;2. 核心流量入口与搜索热度趋势&#10;3. ROI测算与目标毛利率范围",
}, ...__VLS_functionalComponentArgsRest(__VLS_244));
var __VLS_242;
var __VLS_238;
var __VLS_234;
const __VLS_247 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_248 = __VLS_asFunctionalComponent(__VLS_247, new __VLS_247({
    gutter: (24),
    ...{ class: "mb-4" },
}));
const __VLS_249 = __VLS_248({
    gutter: (24),
    ...{ class: "mb-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_248));
__VLS_250.slots.default;
const __VLS_251 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_252 = __VLS_asFunctionalComponent(__VLS_251, new __VLS_251({
    span: (8),
}));
const __VLS_253 = __VLS_252({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_252));
__VLS_254.slots.default;
const __VLS_255 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_256 = __VLS_asFunctionalComponent(__VLS_255, new __VLS_255({
    label: "使用场景",
    prop: "usageScenario",
}));
const __VLS_257 = __VLS_256({
    label: "使用场景",
    prop: "usageScenario",
}, ...__VLS_functionalComponentArgsRest(__VLS_256));
__VLS_258.slots.default;
const __VLS_259 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_260 = __VLS_asFunctionalComponent(__VLS_259, new __VLS_259({
    modelValue: (__VLS_ctx.form.usageScenario),
    placeholder: "如：户外露营、庭院美化",
}));
const __VLS_261 = __VLS_260({
    modelValue: (__VLS_ctx.form.usageScenario),
    placeholder: "如：户外露营、庭院美化",
}, ...__VLS_functionalComponentArgsRest(__VLS_260));
var __VLS_258;
var __VLS_254;
const __VLS_263 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_264 = __VLS_asFunctionalComponent(__VLS_263, new __VLS_263({
    span: (8),
}));
const __VLS_265 = __VLS_264({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_264));
__VLS_266.slots.default;
const __VLS_267 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_268 = __VLS_asFunctionalComponent(__VLS_267, new __VLS_267({
    label: "季节标签",
    prop: "seasonTags",
}));
const __VLS_269 = __VLS_268({
    label: "季节标签",
    prop: "seasonTags",
}, ...__VLS_functionalComponentArgsRest(__VLS_268));
__VLS_270.slots.default;
const __VLS_271 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_272 = __VLS_asFunctionalComponent(__VLS_271, new __VLS_271({
    modelValue: (__VLS_ctx.form.seasonTags),
    multiple: true,
    collapseTags: true,
    placeholder: "选择季节",
    ...{ class: "w-full" },
}));
const __VLS_273 = __VLS_272({
    modelValue: (__VLS_ctx.form.seasonTags),
    multiple: true,
    collapseTags: true,
    placeholder: "选择季节",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_272));
__VLS_274.slots.default;
for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.presetSeasons))) {
    const __VLS_275 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_276 = __VLS_asFunctionalComponent(__VLS_275, new __VLS_275({
        key: (tag),
        label: (tag),
        value: (tag),
    }));
    const __VLS_277 = __VLS_276({
        key: (tag),
        label: (tag),
        value: (tag),
    }, ...__VLS_functionalComponentArgsRest(__VLS_276));
}
var __VLS_274;
var __VLS_270;
var __VLS_266;
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
    label: "节日属性",
    prop: "holidayTags",
}));
const __VLS_285 = __VLS_284({
    label: "节日属性",
    prop: "holidayTags",
}, ...__VLS_functionalComponentArgsRest(__VLS_284));
__VLS_286.slots.default;
const __VLS_287 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_288 = __VLS_asFunctionalComponent(__VLS_287, new __VLS_287({
    modelValue: (__VLS_ctx.form.holidayTags),
    multiple: true,
    collapseTags: true,
    placeholder: "选择节日",
    ...{ class: "w-full" },
}));
const __VLS_289 = __VLS_288({
    modelValue: (__VLS_ctx.form.holidayTags),
    multiple: true,
    collapseTags: true,
    placeholder: "选择节日",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_288));
__VLS_290.slots.default;
for (const [tag] of __VLS_getVForSourceType((__VLS_ctx.presetHolidays))) {
    const __VLS_291 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_292 = __VLS_asFunctionalComponent(__VLS_291, new __VLS_291({
        key: (tag),
        label: (tag),
        value: (tag),
    }));
    const __VLS_293 = __VLS_292({
        key: (tag),
        label: (tag),
        value: (tag),
    }, ...__VLS_functionalComponentArgsRest(__VLS_292));
}
var __VLS_290;
var __VLS_286;
var __VLS_282;
var __VLS_250;
const __VLS_295 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_296 = __VLS_asFunctionalComponent(__VLS_295, new __VLS_295({
    gutter: (24),
    ...{ class: "mb-8" },
}));
const __VLS_297 = __VLS_296({
    gutter: (24),
    ...{ class: "mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_296));
__VLS_298.slots.default;
const __VLS_299 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_300 = __VLS_asFunctionalComponent(__VLS_299, new __VLS_299({
    span: (12),
}));
const __VLS_301 = __VLS_300({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_300));
__VLS_302.slots.default;
const __VLS_303 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_304 = __VLS_asFunctionalComponent(__VLS_303, new __VLS_303({
    label: "卖点说明",
    prop: "sellingPoints",
}));
const __VLS_305 = __VLS_304({
    label: "卖点说明",
    prop: "sellingPoints",
}, ...__VLS_functionalComponentArgsRest(__VLS_304));
__VLS_306.slots.default;
const __VLS_307 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_308 = __VLS_asFunctionalComponent(__VLS_307, new __VLS_307({
    modelValue: (__VLS_ctx.form.sellingPoints),
    type: "textarea",
    rows: (4),
    placeholder: "提示要点：&#10;1. 核心材质及物理优势&#10;2. 结构创新与功能亮点&#10;3. 配套赠品及视觉差异化",
    maxlength: "500",
    showWordLimit: true,
}));
const __VLS_309 = __VLS_308({
    modelValue: (__VLS_ctx.form.sellingPoints),
    type: "textarea",
    rows: (4),
    placeholder: "提示要点：&#10;1. 核心材质及物理优势&#10;2. 结构创新与功能亮点&#10;3. 配套赠品及视觉差异化",
    maxlength: "500",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_308));
var __VLS_306;
var __VLS_302;
const __VLS_311 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_312 = __VLS_asFunctionalComponent(__VLS_311, new __VLS_311({
    span: (12),
}));
const __VLS_313 = __VLS_312({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_312));
__VLS_314.slots.default;
const __VLS_315 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_316 = __VLS_asFunctionalComponent(__VLS_315, new __VLS_315({
    label: "调研分析文档",
}));
const __VLS_317 = __VLS_316({
    label: "调研分析文档",
}, ...__VLS_functionalComponentArgsRest(__VLS_316));
__VLS_318.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "research-capsule-list mb-4" },
});
for (const [file, idx] of __VLS_getVForSourceType((__VLS_ctx.form.researchFiles))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (idx),
        ...{ class: "design-capsule-item" },
    });
    const __VLS_319 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_320 = __VLS_asFunctionalComponent(__VLS_319, new __VLS_319({
        ...{ class: "file-icon" },
        ...{ class: (__VLS_ctx.getFileIconClass(file.name)) },
    }));
    const __VLS_321 = __VLS_320({
        ...{ class: "file-icon" },
        ...{ class: (__VLS_ctx.getFileIconClass(file.name)) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_320));
    __VLS_322.slots.default;
    const __VLS_323 = {}.Document;
    /** @type {[typeof __VLS_components.Document, ]} */ ;
    // @ts-ignore
    const __VLS_324 = __VLS_asFunctionalComponent(__VLS_323, new __VLS_323({}));
    const __VLS_325 = __VLS_324({}, ...__VLS_functionalComponentArgsRest(__VLS_324));
    var __VLS_322;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "file-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "file-name" },
        title: (file.name),
    });
    (file.name);
    const __VLS_327 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_328 = __VLS_asFunctionalComponent(__VLS_327, new __VLS_327({
        ...{ 'onClick': {} },
        type: "danger",
        link: true,
        size: "small",
        ...{ class: "delete-btn" },
    }));
    const __VLS_329 = __VLS_328({
        ...{ 'onClick': {} },
        type: "danger",
        link: true,
        size: "small",
        ...{ class: "delete-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_328));
    let __VLS_331;
    let __VLS_332;
    let __VLS_333;
    const __VLS_334 = {
        onClick: (...[$event]) => {
            __VLS_ctx.removeResearchFile(idx);
        }
    };
    __VLS_330.slots.default;
    var __VLS_330;
}
if (!__VLS_ctx.form.researchFiles || __VLS_ctx.form.researchFiles.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "no-design-placeholder" },
    });
}
const __VLS_335 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_336 = __VLS_asFunctionalComponent(__VLS_335, new __VLS_335({
    action: "#",
    showFileList: (false),
    autoUpload: (false),
    onChange: (__VLS_ctx.handleResearchFileUpload),
    ...{ class: "doc-upload-inline" },
}));
const __VLS_337 = __VLS_336({
    action: "#",
    showFileList: (false),
    autoUpload: (false),
    onChange: (__VLS_ctx.handleResearchFileUpload),
    ...{ class: "doc-upload-inline" },
}, ...__VLS_functionalComponentArgsRest(__VLS_336));
__VLS_338.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "doc-upload-trigger-dashed" },
});
const __VLS_339 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_340 = __VLS_asFunctionalComponent(__VLS_339, new __VLS_339({}));
const __VLS_341 = __VLS_340({}, ...__VLS_functionalComponentArgsRest(__VLS_340));
__VLS_342.slots.default;
const __VLS_343 = {}.Plus;
/** @type {[typeof __VLS_components.Plus, ]} */ ;
// @ts-ignore
const __VLS_344 = __VLS_asFunctionalComponent(__VLS_343, new __VLS_343({}));
const __VLS_345 = __VLS_344({}, ...__VLS_functionalComponentArgsRest(__VLS_344));
var __VLS_342;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_338;
var __VLS_318;
var __VLS_314;
var __VLS_298;
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
    span: (12),
}));
const __VLS_353 = __VLS_352({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_352));
__VLS_354.slots.default;
const __VLS_355 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_356 = __VLS_asFunctionalComponent(__VLS_355, new __VLS_355({
    label: "参考竞品",
}));
const __VLS_357 = __VLS_356({
    label: "参考竞品",
}, ...__VLS_functionalComponentArgsRest(__VLS_356));
__VLS_358.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "links-list-v3" },
});
for (const [link, idx] of __VLS_getVForSourceType((__VLS_ctx.form.refLinks))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (idx),
        ...{ class: "link-row-v3 mb-4" },
    });
    const __VLS_359 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_360 = __VLS_asFunctionalComponent(__VLS_359, new __VLS_359({
        modelValue: (link.url),
        placeholder: "链接地址 (例: https://...)",
        ...{ style: {} },
    }));
    const __VLS_361 = __VLS_360({
        modelValue: (link.url),
        placeholder: "链接地址 (例: https://...)",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_360));
    const __VLS_363 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_364 = __VLS_asFunctionalComponent(__VLS_363, new __VLS_363({
        ...{ 'onClick': {} },
        type: "danger",
        plain: true,
        icon: (__VLS_ctx.Delete),
        circle: true,
        size: "small",
    }));
    const __VLS_365 = __VLS_364({
        ...{ 'onClick': {} },
        type: "danger",
        plain: true,
        icon: (__VLS_ctx.Delete),
        circle: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_364));
    let __VLS_367;
    let __VLS_368;
    let __VLS_369;
    const __VLS_370 = {
        onClick: (...[$event]) => {
            __VLS_ctx.removeRefLink(idx);
        }
    };
    var __VLS_366;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.addRefLink) },
    ...{ class: "link-add-dashed-row" },
});
const __VLS_371 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_372 = __VLS_asFunctionalComponent(__VLS_371, new __VLS_371({}));
const __VLS_373 = __VLS_372({}, ...__VLS_functionalComponentArgsRest(__VLS_372));
__VLS_374.slots.default;
const __VLS_375 = {}.Plus;
/** @type {[typeof __VLS_components.Plus, ]} */ ;
// @ts-ignore
const __VLS_376 = __VLS_asFunctionalComponent(__VLS_375, new __VLS_375({}));
const __VLS_377 = __VLS_376({}, ...__VLS_functionalComponentArgsRest(__VLS_376));
var __VLS_374;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_358;
var __VLS_354;
const __VLS_379 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_380 = __VLS_asFunctionalComponent(__VLS_379, new __VLS_379({
    span: (12),
}));
const __VLS_381 = __VLS_380({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_380));
__VLS_382.slots.default;
const __VLS_383 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_384 = __VLS_asFunctionalComponent(__VLS_383, new __VLS_383({
    label: "参考图片",
    ...{ class: "ref-images-form-item" },
}));
const __VLS_385 = __VLS_384({
    label: "参考图片",
    ...{ class: "ref-images-form-item" },
}, ...__VLS_functionalComponentArgsRest(__VLS_384));
__VLS_386.slots.default;
const __VLS_387 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_388 = __VLS_asFunctionalComponent(__VLS_387, new __VLS_387({
    action: "#",
    fileList: (__VLS_ctx.form.refImages),
    listType: "picture-card",
    autoUpload: (false),
    onPreview: (__VLS_ctx.handleRefImagePreview),
}));
const __VLS_389 = __VLS_388({
    action: "#",
    fileList: (__VLS_ctx.form.refImages),
    listType: "picture-card",
    autoUpload: (false),
    onPreview: (__VLS_ctx.handleRefImagePreview),
}, ...__VLS_functionalComponentArgsRest(__VLS_388));
__VLS_390.slots.default;
const __VLS_391 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_392 = __VLS_asFunctionalComponent(__VLS_391, new __VLS_391({}));
const __VLS_393 = __VLS_392({}, ...__VLS_functionalComponentArgsRest(__VLS_392));
__VLS_394.slots.default;
const __VLS_395 = {}.Plus;
/** @type {[typeof __VLS_components.Plus, ]} */ ;
// @ts-ignore
const __VLS_396 = __VLS_asFunctionalComponent(__VLS_395, new __VLS_395({}));
const __VLS_397 = __VLS_396({}, ...__VLS_functionalComponentArgsRest(__VLS_396));
var __VLS_394;
var __VLS_390;
var __VLS_386;
var __VLS_382;
var __VLS_350;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "section-title" },
});
const __VLS_399 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_400 = __VLS_asFunctionalComponent(__VLS_399, new __VLS_399({
    gutter: (24),
    ...{ class: "mb-8" },
}));
const __VLS_401 = __VLS_400({
    gutter: (24),
    ...{ class: "mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_400));
__VLS_402.slots.default;
const __VLS_403 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_404 = __VLS_asFunctionalComponent(__VLS_403, new __VLS_403({
    span: (12),
}));
const __VLS_405 = __VLS_404({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_404));
__VLS_406.slots.default;
const __VLS_407 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_408 = __VLS_asFunctionalComponent(__VLS_407, new __VLS_407({
    label: "Logo位置",
    prop: "designLogoPosition",
}));
const __VLS_409 = __VLS_408({
    label: "Logo位置",
    prop: "designLogoPosition",
}, ...__VLS_functionalComponentArgsRest(__VLS_408));
__VLS_410.slots.default;
const __VLS_411 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_412 = __VLS_asFunctionalComponent(__VLS_411, new __VLS_411({
    modelValue: (__VLS_ctx.form.designLogoPosition),
    placeholder: "例: 产品背部激光打标, 印白",
}));
const __VLS_413 = __VLS_412({
    modelValue: (__VLS_ctx.form.designLogoPosition),
    placeholder: "例: 产品背部激光打标, 印白",
}, ...__VLS_functionalComponentArgsRest(__VLS_412));
var __VLS_410;
var __VLS_406;
const __VLS_415 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_416 = __VLS_asFunctionalComponent(__VLS_415, new __VLS_415({
    span: (12),
}));
const __VLS_417 = __VLS_416({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_416));
__VLS_418.slots.default;
const __VLS_419 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_420 = __VLS_asFunctionalComponent(__VLS_419, new __VLS_419({
    label: "产品规格书",
}));
const __VLS_421 = __VLS_420({
    label: "产品规格书",
}, ...__VLS_functionalComponentArgsRest(__VLS_420));
__VLS_422.slots.default;
const __VLS_423 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_424 = __VLS_asFunctionalComponent(__VLS_423, new __VLS_423({
    action: "#",
    showFileList: (false),
    autoUpload: (false),
    onChange: (__VLS_ctx.handleDesignFileUpload),
    ...{ class: "doc-upload-inline" },
}));
const __VLS_425 = __VLS_424({
    action: "#",
    showFileList: (false),
    autoUpload: (false),
    onChange: (__VLS_ctx.handleDesignFileUpload),
    ...{ class: "doc-upload-inline" },
}, ...__VLS_functionalComponentArgsRest(__VLS_424));
__VLS_426.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "doc-upload-trigger-dashed" },
});
const __VLS_427 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_428 = __VLS_asFunctionalComponent(__VLS_427, new __VLS_427({}));
const __VLS_429 = __VLS_428({}, ...__VLS_functionalComponentArgsRest(__VLS_428));
__VLS_430.slots.default;
const __VLS_431 = {}.Plus;
/** @type {[typeof __VLS_components.Plus, ]} */ ;
// @ts-ignore
const __VLS_432 = __VLS_asFunctionalComponent(__VLS_431, new __VLS_431({}));
const __VLS_433 = __VLS_432({}, ...__VLS_functionalComponentArgsRest(__VLS_432));
var __VLS_430;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_426;
var __VLS_422;
var __VLS_418;
var __VLS_402;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "design-capsule-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "design-capsule-list" },
});
for (const [file, idx] of __VLS_getVForSourceType((__VLS_ctx.form.designFiles))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (idx),
        ...{ class: "design-capsule-item" },
    });
    const __VLS_435 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_436 = __VLS_asFunctionalComponent(__VLS_435, new __VLS_435({
        ...{ class: "file-icon" },
    }));
    const __VLS_437 = __VLS_436({
        ...{ class: "file-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_436));
    __VLS_438.slots.default;
    const __VLS_439 = {}.Document;
    /** @type {[typeof __VLS_components.Document, ]} */ ;
    // @ts-ignore
    const __VLS_440 = __VLS_asFunctionalComponent(__VLS_439, new __VLS_439({}));
    const __VLS_441 = __VLS_440({}, ...__VLS_functionalComponentArgsRest(__VLS_440));
    var __VLS_438;
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
    const __VLS_443 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_444 = __VLS_asFunctionalComponent(__VLS_443, new __VLS_443({
        ...{ 'onClick': {} },
        type: "danger",
        link: true,
        size: "small",
        ...{ class: "delete-btn" },
    }));
    const __VLS_445 = __VLS_444({
        ...{ 'onClick': {} },
        type: "danger",
        link: true,
        size: "small",
        ...{ class: "delete-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_444));
    let __VLS_447;
    let __VLS_448;
    let __VLS_449;
    const __VLS_450 = {
        onClick: (...[$event]) => {
            __VLS_ctx.removeDesignFile(idx);
        }
    };
    __VLS_446.slots.default;
    var __VLS_446;
}
if (!__VLS_ctx.form.designFiles || __VLS_ctx.form.designFiles.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "no-design-placeholder" },
    });
}
var __VLS_16;
const __VLS_451 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_452 = __VLS_asFunctionalComponent(__VLS_451, new __VLS_451({
    modelValue: (__VLS_ctx.previewVisible),
    title: "参考图片预览",
    width: "50%",
    appendToBody: true,
    alignCenter: true,
}));
const __VLS_453 = __VLS_452({
    modelValue: (__VLS_ctx.previewVisible),
    title: "参考图片预览",
    width: "50%",
    appendToBody: true,
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_452));
__VLS_454.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
    src: (__VLS_ctx.previewImageUrl),
    ...{ style: {} },
});
var __VLS_454;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "edit-dialog-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "footer-left-info" },
    });
    const __VLS_455 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_456 = __VLS_asFunctionalComponent(__VLS_455, new __VLS_455({}));
    const __VLS_457 = __VLS_456({}, ...__VLS_functionalComponentArgsRest(__VLS_456));
    __VLS_458.slots.default;
    const __VLS_459 = {}.InfoFilled;
    /** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
    // @ts-ignore
    const __VLS_460 = __VLS_asFunctionalComponent(__VLS_459, new __VLS_459({}));
    const __VLS_461 = __VLS_460({}, ...__VLS_functionalComponentArgsRest(__VLS_460));
    var __VLS_458;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "footer-actions" },
    });
    const __VLS_463 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_464 = __VLS_asFunctionalComponent(__VLS_463, new __VLS_463({
        ...{ 'onClick': {} },
        size: "small",
    }));
    const __VLS_465 = __VLS_464({
        ...{ 'onClick': {} },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_464));
    let __VLS_467;
    let __VLS_468;
    let __VLS_469;
    const __VLS_470 = {
        onClick: (...[$event]) => {
            __VLS_ctx.visible = false;
        }
    };
    __VLS_466.slots.default;
    var __VLS_466;
    const __VLS_471 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_472 = __VLS_asFunctionalComponent(__VLS_471, new __VLS_471({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
        loading: (__VLS_ctx.saving),
        size: "small",
    }));
    const __VLS_473 = __VLS_472({
        ...{ 'onClick': {} },
        type: "primary",
        plain: true,
        loading: (__VLS_ctx.saving),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_472));
    let __VLS_475;
    let __VLS_476;
    let __VLS_477;
    const __VLS_478 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleSave('save');
        }
    };
    __VLS_474.slots.default;
    var __VLS_474;
    const __VLS_479 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_480 = __VLS_asFunctionalComponent(__VLS_479, new __VLS_479({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
        size: "small",
    }));
    const __VLS_481 = __VLS_480({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_480));
    let __VLS_483;
    let __VLS_484;
    let __VLS_485;
    const __VLS_486 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleSave('submit');
        }
    };
    __VLS_482.slots.default;
    var __VLS_482;
}
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['proposal-edit-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['dialog-header-custom']} */ ;
/** @type {__VLS_StyleScopedClasses['title-main']} */ ;
/** @type {__VLS_StyleScopedClasses['proposal-no-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-dialog-container']} */ ;
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
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
/** @type {__VLS_StyleScopedClasses['readonly-content-collapse-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label-with-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['label-info-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label-with-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['label-info-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['research-capsule-list']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['design-capsule-item']} */ ;
/** @type {__VLS_StyleScopedClasses['file-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['file-info']} */ ;
/** @type {__VLS_StyleScopedClasses['file-name']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['no-design-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-upload-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-upload-trigger-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['links-list-v3']} */ ;
/** @type {__VLS_StyleScopedClasses['link-row-v3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['link-add-dashed-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-images-form-item']} */ ;
/** @type {__VLS_StyleScopedClasses['section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-upload-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['doc-upload-trigger-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['design-capsule-wrapper']} */ ;
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
var __VLS_18 = __VLS_17;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Delete: Delete,
            Document: Document,
            InfoFilled: InfoFilled,
            QuestionFilled: QuestionFilled,
            ArrowDown: ArrowDown,
            ArrowUp: ArrowUp,
            Calendar: Calendar,
            visible: visible,
            formRef: formRef,
            saving: saving,
            submitting: submitting,
            isReadonlyCollapsed: isReadonlyCollapsed,
            presetSeasons: presetSeasons,
            presetHolidays: presetHolidays,
            form: form,
            formattedTotalAmount: formattedTotalAmount,
            previewVisible: previewVisible,
            previewImageUrl: previewImageUrl,
            handleRefImagePreview: handleRefImagePreview,
            getFileIconClass: getFileIconClass,
            handleResearchFileUpload: handleResearchFileUpload,
            removeResearchFile: removeResearchFile,
            getStatusType: getStatusType,
            addRefLink: addRefLink,
            removeRefLink: removeRefLink,
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
//# sourceMappingURL=EditDialog.vue.js.map