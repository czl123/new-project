import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Delete, DocumentAdd, Picture, InfoFilled, Box, Setting, CopyDocument, Cellphone, Loading, Check, QuestionFilled } from '@element-plus/icons-vue';
import { SAMPLE_SOURCE, SAMPLE_TYPE } from '../constants';
const props = defineProps();
const emit = defineEmits(['update:modelValue', 'refresh']);
const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});
const loading = ref(false);
const saving = ref(false);
const showQrCode = ref(false);
const qrCodeUrl = ref('');
const uploadStatus = ref('idle');
const currentImgIndex = ref(-1);
const formRef = ref();
const createDefaultDetail = () => ({
    pattern: '',
    color: '',
    spec: '',
    length: undefined,
    width: undefined,
    height: undefined,
    sampleSizeUnit: 'cm',
    netWeight: undefined,
    netWeightUnit: 'g',
    images: [],
    pLength: undefined,
    pWidth: undefined,
    pHeight: undefined,
    packagingSizeUnit: 'cm',
    packagingWeight: undefined,
    packagingWeightUnit: 'g',
    size: '',
    diameter: undefined,
    diameterUnit: 'cm',
    capacity: undefined,
    capacityUnit: 'ml'
});
// 模拟正式供应商数据
const formalSuppliers = [
    { label: '浙江恒太工贸有限公司', value: 'S001' },
    { label: '广东奥飞娱乐股份有限公司', value: 'S002' },
    { label: '江苏美派玩具礼品有限公司', value: 'S003' }
];
// 模拟提案数据
const mockProposals = [
    {
        label: 'PRP20260510-001 | 硅胶耐热厨具套装',
        value: 'P001',
        name: '硅胶耐热厨具套装',
        manager: 'M201',
        style: '经典款',
        mainMaterial: '食品级硅胶',
        applicableTo: '家庭厨房'
    },
    {
        label: 'PRP20260511-042 | 智能降噪头戴式耳机',
        value: 'P002',
        name: '智能降噪头戴式耳机',
        manager: 'M202',
        style: '商务旗舰款',
        mainMaterial: '蛋白皮+轻质合金',
        applicableTo: '商务人士'
    },
    {
        label: 'PRP20260512-015 | 便携式无线充移动电源',
        value: 'P003',
        name: '便携式无线充移动电源',
        manager: 'M203',
        style: '极简便携款',
        mainMaterial: '防火PC+ABS',
        applicableTo: '通用'
    }
];
// 模拟人员数据
const mockStaff = {
    purchasers: [
        { label: '张三 (采购部)', value: 'U101' },
        { label: '李四 (采购部)', value: 'U102' },
        { label: '王五 (供应链组)', value: 'U103' }
    ],
    productManagers: [
        { label: '陈经理 (电子事业部)', value: 'M201' },
        { label: '林主管 (家居生活组)', value: 'M202' },
        { label: '赵经理 (运动户外组)', value: 'M203' }
    ]
};
const form = reactive({
    isLinkedToProposal: false,
    proposalId: '',
    source: '1',
    sampleType: '1',
    supplierType: '1',
    supplierName: '',
    purchaseUrl: '',
    shopName: '',
    purchaserId: '',
    productManagerId: '',
    name: '',
    style: '',
    mainMaterial: '',
    applicableTo: '',
    packagingMethod: '',
    packagingQuantity: '',
    hasBattery: false,
    isCE: false,
    sampleFee: 0,
    initialQuote: 0,
    taxRate: 13,
    moq: 100,
    productionCycle: 15,
    receiveDate: '',
    comparisonEndDate: '',
    description: '',
    qualifications: [],
    details: [createDefaultDetail()]
});
const rules = computed(() => ({
    name: [{ required: true, message: '请输入样品名称', trigger: 'blur' }],
    style: [{ required: true, message: '请输入款式', trigger: 'blur' }],
    mainMaterial: [{ required: true, message: '请输入主材料', trigger: 'blur' }],
    applicableTo: [{ required: true, message: '请输入适用品牌或对象', trigger: 'blur' }],
    sampleFee: [{ required: true, message: '请输入样品费', trigger: 'blur' }],
    proposalId: [{ required: form.isLinkedToProposal, message: '请选择对应提案项目', trigger: 'change' }],
    source: [{ required: true, message: '请选择拿样渠道', trigger: 'change' }],
    sampleType: [{ required: true, message: '请选择样品类型', trigger: 'change' }],
    receiveDate: [{ required: form.sampleType === '1', message: '请选择样品接收日期', trigger: 'change' }],
    supplierType: [{ required: true, message: '请选择供应商类型', trigger: 'change' }],
    supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
    purchaseUrl: [{ required: true, message: '请输入购买页面链接', trigger: 'blur' }],
    purchaserId: [{ required: true, message: '请选择采购员', trigger: 'change' }],
    productManagerId: [{ required: true, message: '请选择产品经理', trigger: 'change' }]
}));
const handleProposalChange = (val) => {
    const proposal = mockProposals.find(p => p.value === val);
    if (proposal) {
        form.name = proposal.name;
        form.productManagerId = proposal.manager;
        form.style = proposal.style;
        form.mainMaterial = proposal.mainMaterial;
        form.applicableTo = proposal.applicableTo;
        ElMessage.success('已自动填充提案关联信息');
    }
};
const handleAddDetail = () => {
    form.details.push(createDefaultDetail());
};
const handleCopyDetail = (index) => {
    const copy = JSON.parse(JSON.stringify(form.details[index]));
    form.details.splice(index + 1, 0, copy);
    ElMessage.success('已复制规格行');
};
const handleImageSuccess = (file, index) => {
    if (file.raw) {
        const url = URL.createObjectURL(file.raw);
        form.details[index].images.push(url);
        ElMessage.success('图片已添加');
    }
};
const handleScanUpload = async (index) => {
    currentImgIndex.value = index;
    uploadStatus.value = 'idle';
    try {
        // 1. 从本地服务器获取 Token 和 移动端上传地址
        const response = await fetch('http://127.0.0.1:3001/api/token/generate');
        const { token, mobileUrl } = await response.json();
        // 2. 生成二维码（使用公共 API 将移动端地址转为二维码）
        qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(mobileUrl)}`;
        showQrCode.value = true;
        // 3. 开始轮询服务器状态
        const pollInterval = setInterval(async () => {
            if (!showQrCode.value) {
                clearInterval(pollInterval);
                return;
            }
            try {
                const statusRes = await fetch(`http://127.0.0.1:3001/api/status/${token}`);
                const data = await statusRes.json();
                if (data.status === 'uploaded' && data.images.length > 0) {
                    // 比较当前已有的图片，只添加新上传的
                    const currentImages = form.details[index].images;
                    data.images.forEach((url) => {
                        if (!currentImages.includes(url)) {
                            currentImages.push(url);
                            uploadStatus.value = 'success';
                            // 1秒后重置为 waiting，以便显示“检测到新图片”
                            setTimeout(() => { if (showQrCode.value)
                                uploadStatus.value = 'waiting'; }, 1000);
                        }
                    });
                }
            }
            catch (err) {
                console.error('轮询失败:', err);
            }
        }, 2000);
    }
    catch (err) {
        ElMessage.error('无法连接本地服务器，请确保 server.js 已启动');
    }
};
const handleRemoveImage = (rowIndex, imgIndex) => {
    form.details[rowIndex].images.splice(imgIndex, 1);
};
const handleRemoveDetail = (index) => {
    if (form.details.length > 1) {
        form.details.splice(index, 1);
    }
    else {
        ElMessage.warning('请至少保留一项规格明细');
    }
};
const handleClosed = () => {
    formRef.value?.resetFields();
    form.details = [createDefaultDetail()];
};
const handleSubmit = async () => {
    if (!formRef.value)
        return;
    await formRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                ElMessage({
                    message: '数据已同步至云端',
                    type: 'success',
                    plain: true
                });
                dialogVisible.value = false;
                emit('refresh');
            }
            finally {
                loading.value = false;
            }
        }
    });
};
const handleSave = async () => {
    // 保存通常不进行强制校验，或者只进行基础校验
    saving.value = true;
    try {
        await new Promise(resolve => setTimeout(resolve, 800));
        ElMessage.success('草稿已保存');
        // 保存后不关闭弹窗
    }
    finally {
        saving.value = false;
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-textarea__inner']} */ ;
/** @type {__VLS_StyleScopedClasses['el-select__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-radio-button__inner']} */ ;
/** @type {__VLS_StyleScopedClasses['el-form-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-form-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-form-item__content']} */ ;
/** @type {__VLS_StyleScopedClasses['el-form-item__error']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-select__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['p-mgr-del']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['is-focus']} */ ;
/** @type {__VLS_StyleScopedClasses['el-select__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['is-focused']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input-number']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['is-focus']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['p-table-input-number']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input-number']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['el-select__wrapper']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: "开发样登记",
    width: "1400px",
    ...{ class: "premium-dialog" },
    alignCenter: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: "开发样登记",
    width: "1400px",
    ...{ class: "premium-dialog" },
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClosed: (__VLS_ctx.handleClosed)
};
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-container" },
});
const __VLS_8 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "left",
    labelWidth: "110px",
    ...{ class: "p-form" },
}));
const __VLS_10 = __VLS_9({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelPosition: "left",
    labelWidth: "110px",
    ...{ class: "p-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_12 = {};
__VLS_11.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-main-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-form-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "section-basic",
    ...{ class: "p-section-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-section-header" },
});
const __VLS_14 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(__VLS_14, new __VLS_14({
    ...{ class: "p-section-icon" },
}));
const __VLS_16 = __VLS_15({
    ...{ class: "p-section-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
__VLS_17.slots.default;
const __VLS_18 = {}.Box;
/** @type {[typeof __VLS_components.Box, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18({}));
const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
var __VLS_17;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-grid-row responsibility-row" },
});
const __VLS_22 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
    gutter: (20),
}));
const __VLS_24 = __VLS_23({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
__VLS_25.slots.default;
const __VLS_26 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    span: (4),
}));
const __VLS_28 = __VLS_27({
    span: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
__VLS_29.slots.default;
const __VLS_30 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    label: "关联提案",
}));
const __VLS_32 = __VLS_31({
    label: "关联提案",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_33.slots.default;
const __VLS_34 = {}.ElSwitch;
/** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.isLinkedToProposal),
}));
const __VLS_36 = __VLS_35({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.isLinkedToProposal),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
let __VLS_38;
let __VLS_39;
let __VLS_40;
const __VLS_41 = {
    onChange: (...[$event]) => {
        __VLS_ctx.form.proposalId = '';
    }
};
var __VLS_37;
var __VLS_33;
var __VLS_29;
const __VLS_42 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
    span: (__VLS_ctx.form.isLinkedToProposal ? 8 : 0),
}));
const __VLS_44 = __VLS_43({
    span: (__VLS_ctx.form.isLinkedToProposal ? 8 : 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
__VLS_45.slots.default;
if (__VLS_ctx.form.isLinkedToProposal) {
    const __VLS_46 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
        label: "对应提案项目",
        prop: "proposalId",
    }));
    const __VLS_48 = __VLS_47({
        label: "对应提案项目",
        prop: "proposalId",
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    __VLS_49.slots.default;
    const __VLS_50 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.form.proposalId),
        placeholder: "搜索项目",
        ...{ class: "full-w" },
        filterable: true,
    }));
    const __VLS_52 = __VLS_51({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.form.proposalId),
        placeholder: "搜索项目",
        ...{ class: "full-w" },
        filterable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    let __VLS_54;
    let __VLS_55;
    let __VLS_56;
    const __VLS_57 = {
        onChange: (__VLS_ctx.handleProposalChange)
    };
    __VLS_53.slots.default;
    for (const [p] of __VLS_getVForSourceType((__VLS_ctx.mockProposals))) {
        const __VLS_58 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
            key: (p.value),
            label: (p.label),
            value: (p.value),
        }));
        const __VLS_60 = __VLS_59({
            key: (p.value),
            label: (p.label),
            value: (p.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    }
    var __VLS_53;
    var __VLS_49;
}
var __VLS_45;
const __VLS_62 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    span: (__VLS_ctx.form.isLinkedToProposal ? 6 : 10),
}));
const __VLS_64 = __VLS_63({
    span: (__VLS_ctx.form.isLinkedToProposal ? 6 : 10),
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
__VLS_65.slots.default;
const __VLS_66 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    label: "产品经理",
    prop: "productManagerId",
}));
const __VLS_68 = __VLS_67({
    label: "产品经理",
    prop: "productManagerId",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_69.slots.default;
const __VLS_70 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    modelValue: (__VLS_ctx.form.productManagerId),
    ...{ class: "full-w" },
    filterable: true,
}));
const __VLS_72 = __VLS_71({
    modelValue: (__VLS_ctx.form.productManagerId),
    ...{ class: "full-w" },
    filterable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
__VLS_73.slots.default;
for (const [m] of __VLS_getVForSourceType((__VLS_ctx.mockStaff.productManagers))) {
    const __VLS_74 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
        key: (m.value),
        label: (m.label),
        value: (m.value),
    }));
    const __VLS_76 = __VLS_75({
        key: (m.value),
        label: (m.label),
        value: (m.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_75));
}
var __VLS_73;
var __VLS_69;
var __VLS_65;
const __VLS_78 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    span: (__VLS_ctx.form.isLinkedToProposal ? 6 : 10),
}));
const __VLS_80 = __VLS_79({
    span: (__VLS_ctx.form.isLinkedToProposal ? 6 : 10),
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
__VLS_81.slots.default;
const __VLS_82 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    label: "采购员",
    prop: "purchaserId",
}));
const __VLS_84 = __VLS_83({
    label: "采购员",
    prop: "purchaserId",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
__VLS_85.slots.default;
const __VLS_86 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    modelValue: (__VLS_ctx.form.purchaserId),
    ...{ class: "full-w" },
    filterable: true,
}));
const __VLS_88 = __VLS_87({
    modelValue: (__VLS_ctx.form.purchaserId),
    ...{ class: "full-w" },
    filterable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
__VLS_89.slots.default;
for (const [u] of __VLS_getVForSourceType((__VLS_ctx.mockStaff.purchasers))) {
    const __VLS_90 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
        key: (u.value),
        label: (u.label),
        value: (u.value),
    }));
    const __VLS_92 = __VLS_91({
        key: (u.value),
        label: (u.label),
        value: (u.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_91));
}
var __VLS_89;
var __VLS_85;
var __VLS_81;
var __VLS_25;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-grid-row" },
});
const __VLS_94 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
    gutter: (32),
}));
const __VLS_96 = __VLS_95({
    gutter: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
__VLS_97.slots.default;
const __VLS_98 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
    span: (6),
}));
const __VLS_100 = __VLS_99({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
__VLS_101.slots.default;
const __VLS_102 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
    label: "样品名称",
    prop: "name",
}));
const __VLS_104 = __VLS_103({
    label: "样品名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
__VLS_105.slots.default;
const __VLS_106 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "输入样品完整名称",
}));
const __VLS_108 = __VLS_107({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "输入样品完整名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
var __VLS_105;
var __VLS_101;
const __VLS_110 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
    span: (6),
}));
const __VLS_112 = __VLS_111({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
__VLS_113.slots.default;
const __VLS_114 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
    label: "款式",
    prop: "style",
}));
const __VLS_116 = __VLS_115({
    label: "款式",
    prop: "style",
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
__VLS_117.slots.default;
const __VLS_118 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    modelValue: (__VLS_ctx.form.style),
    placeholder: "如：升级款",
}));
const __VLS_120 = __VLS_119({
    modelValue: (__VLS_ctx.form.style),
    placeholder: "如：升级款",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
var __VLS_117;
var __VLS_113;
const __VLS_122 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
    span: (6),
}));
const __VLS_124 = __VLS_123({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
__VLS_125.slots.default;
const __VLS_126 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
    label: "主材料",
    prop: "mainMaterial",
}));
const __VLS_128 = __VLS_127({
    label: "主材料",
    prop: "mainMaterial",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
__VLS_129.slots.default;
const __VLS_130 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
    modelValue: (__VLS_ctx.form.mainMaterial),
    placeholder: "材质",
}));
const __VLS_132 = __VLS_131({
    modelValue: (__VLS_ctx.form.mainMaterial),
    placeholder: "材质",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
var __VLS_129;
var __VLS_125;
const __VLS_134 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent(__VLS_134, new __VLS_134({
    span: (6),
}));
const __VLS_136 = __VLS_135({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
__VLS_137.slots.default;
const __VLS_138 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({
    label: "适用品牌或对象",
    prop: "applicableTo",
}));
const __VLS_140 = __VLS_139({
    label: "适用品牌或对象",
    prop: "applicableTo",
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
__VLS_141.slots.default;
const __VLS_142 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
    modelValue: (__VLS_ctx.form.applicableTo),
    placeholder: "适用范围",
}));
const __VLS_144 = __VLS_143({
    modelValue: (__VLS_ctx.form.applicableTo),
    placeholder: "适用范围",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
var __VLS_141;
var __VLS_137;
var __VLS_97;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-grid-row" },
});
const __VLS_146 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    gutter: (32),
}));
const __VLS_148 = __VLS_147({
    gutter: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
__VLS_149.slots.default;
const __VLS_150 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
    span: (6),
}));
const __VLS_152 = __VLS_151({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
__VLS_153.slots.default;
const __VLS_154 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
    label: "样品类型",
    prop: "sampleType",
}));
const __VLS_156 = __VLS_155({
    label: "样品类型",
    prop: "sampleType",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
__VLS_157.slots.default;
const __VLS_158 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
    modelValue: (__VLS_ctx.form.sampleType),
    ...{ class: "full-w" },
    clearable: true,
}));
const __VLS_160 = __VLS_159({
    modelValue: (__VLS_ctx.form.sampleType),
    ...{ class: "full-w" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
__VLS_161.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.SAMPLE_TYPE))) {
    const __VLS_162 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_164 = __VLS_163({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    __VLS_165.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ style: {} },
    });
    (item.desc);
    var __VLS_165;
}
var __VLS_161;
var __VLS_157;
var __VLS_153;
if (__VLS_ctx.form.sampleType === '1') {
    const __VLS_166 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
        span: (6),
    }));
    const __VLS_168 = __VLS_167({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_167));
    __VLS_169.slots.default;
    const __VLS_170 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
        label: "样品接收日期",
        prop: "receiveDate",
    }));
    const __VLS_172 = __VLS_171({
        label: "样品接收日期",
        prop: "receiveDate",
    }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    __VLS_173.slots.default;
    const __VLS_174 = {}.ElDatePicker;
    /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
    // @ts-ignore
    const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
        modelValue: (__VLS_ctx.form.receiveDate),
        type: "date",
        placeholder: "选择日期",
        ...{ class: "full-w" },
        valueFormat: "YYYY-MM-DD",
    }));
    const __VLS_176 = __VLS_175({
        modelValue: (__VLS_ctx.form.receiveDate),
        type: "date",
        placeholder: "选择日期",
        ...{ class: "full-w" },
        valueFormat: "YYYY-MM-DD",
    }, ...__VLS_functionalComponentArgsRest(__VLS_175));
    var __VLS_173;
    var __VLS_169;
}
if (['6', '7', '8'].includes(__VLS_ctx.form.sampleType)) {
    const __VLS_178 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_179 = __VLS_asFunctionalComponent(__VLS_178, new __VLS_178({
        span: (6),
    }));
    const __VLS_180 = __VLS_179({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_179));
    __VLS_181.slots.default;
    const __VLS_182 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
        label: "对比结束日期",
        prop: "comparisonEndDate",
    }));
    const __VLS_184 = __VLS_183({
        label: "对比结束日期",
        prop: "comparisonEndDate",
    }, ...__VLS_functionalComponentArgsRest(__VLS_183));
    __VLS_185.slots.default;
    const __VLS_186 = {}.ElDatePicker;
    /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
    // @ts-ignore
    const __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({
        modelValue: (__VLS_ctx.form.comparisonEndDate),
        type: "date",
        placeholder: "选择日期",
        ...{ class: "full-w" },
        valueFormat: "YYYY-MM-DD",
    }));
    const __VLS_188 = __VLS_187({
        modelValue: (__VLS_ctx.form.comparisonEndDate),
        type: "date",
        placeholder: "选择日期",
        ...{ class: "full-w" },
        valueFormat: "YYYY-MM-DD",
    }, ...__VLS_functionalComponentArgsRest(__VLS_187));
    var __VLS_185;
    var __VLS_181;
}
const __VLS_190 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({
    span: (6),
}));
const __VLS_192 = __VLS_191({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_191));
__VLS_193.slots.default;
const __VLS_194 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({
    label: "样品费",
    prop: "sampleFee",
}));
const __VLS_196 = __VLS_195({
    label: "样品费",
    prop: "sampleFee",
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
__VLS_197.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-input-with-unit" },
});
const __VLS_198 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent(__VLS_198, new __VLS_198({
    modelValue: (__VLS_ctx.form.sampleFee),
    precision: (2),
    controls: (false),
    ...{ class: "full-w" },
}));
const __VLS_200 = __VLS_199({
    modelValue: (__VLS_ctx.form.sampleFee),
    precision: (2),
    controls: (false),
    ...{ class: "full-w" },
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "p-unit-tag" },
});
var __VLS_197;
var __VLS_193;
var __VLS_149;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-grid-row" },
});
const __VLS_202 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({
    gutter: (32),
}));
const __VLS_204 = __VLS_203({
    gutter: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_203));
__VLS_205.slots.default;
const __VLS_206 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
    span: (6),
}));
const __VLS_208 = __VLS_207({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_207));
__VLS_209.slots.default;
const __VLS_210 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_211 = __VLS_asFunctionalComponent(__VLS_210, new __VLS_210({
    label: "拿样渠道",
    prop: "source",
}));
const __VLS_212 = __VLS_211({
    label: "拿样渠道",
    prop: "source",
}, ...__VLS_functionalComponentArgsRest(__VLS_211));
__VLS_213.slots.default;
const __VLS_214 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({
    modelValue: (__VLS_ctx.form.source),
    ...{ class: "full-w" },
    clearable: true,
}));
const __VLS_216 = __VLS_215({
    modelValue: (__VLS_ctx.form.source),
    ...{ class: "full-w" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_215));
__VLS_217.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.SAMPLE_SOURCE))) {
    const __VLS_218 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_219 = __VLS_asFunctionalComponent(__VLS_218, new __VLS_218({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_220 = __VLS_219({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_219));
}
var __VLS_217;
var __VLS_213;
var __VLS_209;
const __VLS_222 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_223 = __VLS_asFunctionalComponent(__VLS_222, new __VLS_222({
    span: (__VLS_ctx.form.source === '1' ? 4 : 0),
}));
const __VLS_224 = __VLS_223({
    span: (__VLS_ctx.form.source === '1' ? 4 : 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_223));
__VLS_225.slots.default;
if (__VLS_ctx.form.source === '1') {
    const __VLS_226 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({
        label: "供应商类型",
    }));
    const __VLS_228 = __VLS_227({
        label: "供应商类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_227));
    __VLS_229.slots.default;
    const __VLS_230 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_231 = __VLS_asFunctionalComponent(__VLS_230, new __VLS_230({
        modelValue: (__VLS_ctx.form.supplierType),
        ...{ class: "full-w" },
        clearable: true,
    }));
    const __VLS_232 = __VLS_231({
        modelValue: (__VLS_ctx.form.supplierType),
        ...{ class: "full-w" },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_231));
    __VLS_233.slots.default;
    const __VLS_234 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_235 = __VLS_asFunctionalComponent(__VLS_234, new __VLS_234({
        label: "正式",
        value: "1",
    }));
    const __VLS_236 = __VLS_235({
        label: "正式",
        value: "1",
    }, ...__VLS_functionalComponentArgsRest(__VLS_235));
    const __VLS_238 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({
        label: "临时",
        value: "2",
    }));
    const __VLS_240 = __VLS_239({
        label: "临时",
        value: "2",
    }, ...__VLS_functionalComponentArgsRest(__VLS_239));
    var __VLS_233;
    var __VLS_229;
}
var __VLS_225;
const __VLS_242 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_243 = __VLS_asFunctionalComponent(__VLS_242, new __VLS_242({
    span: (__VLS_ctx.form.source === '1' ? 14 : 18),
}));
const __VLS_244 = __VLS_243({
    span: (__VLS_ctx.form.source === '1' ? 14 : 18),
}, ...__VLS_functionalComponentArgsRest(__VLS_243));
__VLS_245.slots.default;
if (__VLS_ctx.form.source === '1') {
    const __VLS_246 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246({
        label: "供应商名称",
        prop: "supplierName",
    }));
    const __VLS_248 = __VLS_247({
        label: "供应商名称",
        prop: "supplierName",
    }, ...__VLS_functionalComponentArgsRest(__VLS_247));
    __VLS_249.slots.default;
    if (__VLS_ctx.form.supplierType === '1') {
        const __VLS_250 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_251 = __VLS_asFunctionalComponent(__VLS_250, new __VLS_250({
            modelValue: (__VLS_ctx.form.supplierName),
            placeholder: "选择供应商",
            ...{ class: "full-w" },
            filterable: true,
            clearable: true,
        }));
        const __VLS_252 = __VLS_251({
            modelValue: (__VLS_ctx.form.supplierName),
            placeholder: "选择供应商",
            ...{ class: "full-w" },
            filterable: true,
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_251));
        __VLS_253.slots.default;
        for (const [s] of __VLS_getVForSourceType((__VLS_ctx.formalSuppliers))) {
            const __VLS_254 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_255 = __VLS_asFunctionalComponent(__VLS_254, new __VLS_254({
                key: (s.value),
                label: (s.label),
                value: (s.label),
            }));
            const __VLS_256 = __VLS_255({
                key: (s.value),
                label: (s.label),
                value: (s.label),
            }, ...__VLS_functionalComponentArgsRest(__VLS_255));
        }
        var __VLS_253;
    }
    else {
        const __VLS_258 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_259 = __VLS_asFunctionalComponent(__VLS_258, new __VLS_258({
            modelValue: (__VLS_ctx.form.supplierName),
            placeholder: "输入临时供应商名称",
            clearable: true,
        }));
        const __VLS_260 = __VLS_259({
            modelValue: (__VLS_ctx.form.supplierName),
            placeholder: "输入临时供应商名称",
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_259));
    }
    var __VLS_249;
}
else {
    const __VLS_262 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({
        label: "购买链接",
        prop: "purchaseUrl",
    }));
    const __VLS_264 = __VLS_263({
        label: "购买链接",
        prop: "purchaseUrl",
    }, ...__VLS_functionalComponentArgsRest(__VLS_263));
    __VLS_265.slots.default;
    const __VLS_266 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_267 = __VLS_asFunctionalComponent(__VLS_266, new __VLS_266({
        modelValue: (__VLS_ctx.form.purchaseUrl),
        placeholder: "粘贴链接",
        clearable: true,
    }));
    const __VLS_268 = __VLS_267({
        modelValue: (__VLS_ctx.form.purchaseUrl),
        placeholder: "粘贴链接",
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_267));
    __VLS_269.slots.default;
    {
        const { prepend: __VLS_thisSlot } = __VLS_269.slots;
        (__VLS_ctx.form.source === '2' ? '1688' : '淘宝');
    }
    var __VLS_269;
    var __VLS_265;
}
var __VLS_245;
var __VLS_205;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-grid-row" },
});
const __VLS_270 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_271 = __VLS_asFunctionalComponent(__VLS_270, new __VLS_270({
    gutter: (32),
}));
const __VLS_272 = __VLS_271({
    gutter: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_271));
__VLS_273.slots.default;
const __VLS_274 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_275 = __VLS_asFunctionalComponent(__VLS_274, new __VLS_274({
    span: (6),
}));
const __VLS_276 = __VLS_275({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_275));
__VLS_277.slots.default;
const __VLS_278 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_279 = __VLS_asFunctionalComponent(__VLS_278, new __VLS_278({
    label: "包装方式",
}));
const __VLS_280 = __VLS_279({
    label: "包装方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_279));
__VLS_281.slots.default;
const __VLS_282 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_283 = __VLS_asFunctionalComponent(__VLS_282, new __VLS_282({
    modelValue: (__VLS_ctx.form.packagingMethod),
    placeholder: "请选择",
    ...{ class: "full-w" },
    clearable: true,
}));
const __VLS_284 = __VLS_283({
    modelValue: (__VLS_ctx.form.packagingMethod),
    placeholder: "请选择",
    ...{ class: "full-w" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_283));
__VLS_285.slots.default;
const __VLS_286 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_287 = __VLS_asFunctionalComponent(__VLS_286, new __VLS_286({
    label: "盒装",
    value: "盒装",
}));
const __VLS_288 = __VLS_287({
    label: "盒装",
    value: "盒装",
}, ...__VLS_functionalComponentArgsRest(__VLS_287));
const __VLS_290 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_291 = __VLS_asFunctionalComponent(__VLS_290, new __VLS_290({
    label: "袋装",
    value: "袋装",
}));
const __VLS_292 = __VLS_291({
    label: "袋装",
    value: "袋装",
}, ...__VLS_functionalComponentArgsRest(__VLS_291));
var __VLS_285;
var __VLS_281;
var __VLS_277;
const __VLS_294 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_295 = __VLS_asFunctionalComponent(__VLS_294, new __VLS_294({
    span: (6),
}));
const __VLS_296 = __VLS_295({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_295));
__VLS_297.slots.default;
const __VLS_298 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_299 = __VLS_asFunctionalComponent(__VLS_298, new __VLS_298({}));
const __VLS_300 = __VLS_299({}, ...__VLS_functionalComponentArgsRest(__VLS_299));
__VLS_301.slots.default;
{
    const { label: __VLS_thisSlot } = __VLS_301.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_302 = {}.ElTooltip;
    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_303 = __VLS_asFunctionalComponent(__VLS_302, new __VLS_302({
        effect: "dark",
        placement: "top",
    }));
    const __VLS_304 = __VLS_303({
        effect: "dark",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_303));
    __VLS_305.slots.default;
    {
        const { content: __VLS_thisSlot } = __VLS_305.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
    }
    const __VLS_306 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_307 = __VLS_asFunctionalComponent(__VLS_306, new __VLS_306({
        ...{ style: {} },
    }));
    const __VLS_308 = __VLS_307({
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_307));
    __VLS_309.slots.default;
    const __VLS_310 = {}.QuestionFilled;
    /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
    // @ts-ignore
    const __VLS_311 = __VLS_asFunctionalComponent(__VLS_310, new __VLS_310({}));
    const __VLS_312 = __VLS_311({}, ...__VLS_functionalComponentArgsRest(__VLS_311));
    var __VLS_309;
    var __VLS_305;
}
const __VLS_314 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_315 = __VLS_asFunctionalComponent(__VLS_314, new __VLS_314({
    modelValue: (__VLS_ctx.form.packagingQuantity),
    placeholder: "如: 1pack",
    ...{ class: "full-w" },
    clearable: true,
}));
const __VLS_316 = __VLS_315({
    modelValue: (__VLS_ctx.form.packagingQuantity),
    placeholder: "如: 1pack",
    ...{ class: "full-w" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_315));
var __VLS_301;
var __VLS_297;
const __VLS_318 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_319 = __VLS_asFunctionalComponent(__VLS_318, new __VLS_318({
    span: (6),
}));
const __VLS_320 = __VLS_319({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_319));
__VLS_321.slots.default;
const __VLS_322 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_323 = __VLS_asFunctionalComponent(__VLS_322, new __VLS_322({
    label: "是否带电",
}));
const __VLS_324 = __VLS_323({
    label: "是否带电",
}, ...__VLS_functionalComponentArgsRest(__VLS_323));
__VLS_325.slots.default;
const __VLS_326 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_327 = __VLS_asFunctionalComponent(__VLS_326, new __VLS_326({
    modelValue: (__VLS_ctx.form.hasBattery),
    ...{ class: "full-w" },
    clearable: true,
}));
const __VLS_328 = __VLS_327({
    modelValue: (__VLS_ctx.form.hasBattery),
    ...{ class: "full-w" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_327));
__VLS_329.slots.default;
const __VLS_330 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_331 = __VLS_asFunctionalComponent(__VLS_330, new __VLS_330({
    label: "是",
    value: (true),
}));
const __VLS_332 = __VLS_331({
    label: "是",
    value: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_331));
const __VLS_334 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_335 = __VLS_asFunctionalComponent(__VLS_334, new __VLS_334({
    label: "否",
    value: (false),
}));
const __VLS_336 = __VLS_335({
    label: "否",
    value: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_335));
var __VLS_329;
var __VLS_325;
var __VLS_321;
const __VLS_338 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_339 = __VLS_asFunctionalComponent(__VLS_338, new __VLS_338({
    span: (6),
}));
const __VLS_340 = __VLS_339({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_339));
__VLS_341.slots.default;
const __VLS_342 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_343 = __VLS_asFunctionalComponent(__VLS_342, new __VLS_342({
    label: "是否CE类",
}));
const __VLS_344 = __VLS_343({
    label: "是否CE类",
}, ...__VLS_functionalComponentArgsRest(__VLS_343));
__VLS_345.slots.default;
const __VLS_346 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_347 = __VLS_asFunctionalComponent(__VLS_346, new __VLS_346({
    modelValue: (__VLS_ctx.form.isCE),
    ...{ class: "full-w" },
    clearable: true,
}));
const __VLS_348 = __VLS_347({
    modelValue: (__VLS_ctx.form.isCE),
    ...{ class: "full-w" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_347));
__VLS_349.slots.default;
const __VLS_350 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_351 = __VLS_asFunctionalComponent(__VLS_350, new __VLS_350({
    label: "是",
    value: (true),
}));
const __VLS_352 = __VLS_351({
    label: "是",
    value: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_351));
const __VLS_354 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_355 = __VLS_asFunctionalComponent(__VLS_354, new __VLS_354({
    label: "否",
    value: (false),
}));
const __VLS_356 = __VLS_355({
    label: "否",
    value: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_355));
var __VLS_349;
var __VLS_345;
var __VLS_341;
var __VLS_273;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-grid-row" },
});
const __VLS_358 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_359 = __VLS_asFunctionalComponent(__VLS_358, new __VLS_358({
    gutter: (32),
}));
const __VLS_360 = __VLS_359({
    gutter: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_359));
__VLS_361.slots.default;
const __VLS_362 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_363 = __VLS_asFunctionalComponent(__VLS_362, new __VLS_362({
    span: (6),
}));
const __VLS_364 = __VLS_363({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_363));
__VLS_365.slots.default;
const __VLS_366 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_367 = __VLS_asFunctionalComponent(__VLS_366, new __VLS_366({
    label: "初次报价",
}));
const __VLS_368 = __VLS_367({
    label: "初次报价",
}, ...__VLS_functionalComponentArgsRest(__VLS_367));
__VLS_369.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-input-with-unit" },
});
const __VLS_370 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_371 = __VLS_asFunctionalComponent(__VLS_370, new __VLS_370({
    modelValue: (__VLS_ctx.form.initialQuote),
    precision: (2),
    controls: (false),
    ...{ class: "full-w" },
}));
const __VLS_372 = __VLS_371({
    modelValue: (__VLS_ctx.form.initialQuote),
    precision: (2),
    controls: (false),
    ...{ class: "full-w" },
}, ...__VLS_functionalComponentArgsRest(__VLS_371));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "p-unit-tag" },
});
var __VLS_369;
var __VLS_365;
const __VLS_374 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_375 = __VLS_asFunctionalComponent(__VLS_374, new __VLS_374({
    span: (6),
}));
const __VLS_376 = __VLS_375({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_375));
__VLS_377.slots.default;
const __VLS_378 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_379 = __VLS_asFunctionalComponent(__VLS_378, new __VLS_378({
    label: "税率",
}));
const __VLS_380 = __VLS_379({
    label: "税率",
}, ...__VLS_functionalComponentArgsRest(__VLS_379));
__VLS_381.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-input-with-unit" },
});
const __VLS_382 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_383 = __VLS_asFunctionalComponent(__VLS_382, new __VLS_382({
    modelValue: (__VLS_ctx.form.taxRate),
    controls: (false),
    ...{ class: "full-w" },
}));
const __VLS_384 = __VLS_383({
    modelValue: (__VLS_ctx.form.taxRate),
    controls: (false),
    ...{ class: "full-w" },
}, ...__VLS_functionalComponentArgsRest(__VLS_383));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "p-unit-tag" },
});
var __VLS_381;
var __VLS_377;
const __VLS_386 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_387 = __VLS_asFunctionalComponent(__VLS_386, new __VLS_386({
    span: (6),
}));
const __VLS_388 = __VLS_387({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_387));
__VLS_389.slots.default;
const __VLS_390 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_391 = __VLS_asFunctionalComponent(__VLS_390, new __VLS_390({
    label: "起订量",
}));
const __VLS_392 = __VLS_391({
    label: "起订量",
}, ...__VLS_functionalComponentArgsRest(__VLS_391));
__VLS_393.slots.default;
const __VLS_394 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_395 = __VLS_asFunctionalComponent(__VLS_394, new __VLS_394({
    modelValue: (__VLS_ctx.form.moq),
    controls: (false),
    ...{ class: "full-w" },
}));
const __VLS_396 = __VLS_395({
    modelValue: (__VLS_ctx.form.moq),
    controls: (false),
    ...{ class: "full-w" },
}, ...__VLS_functionalComponentArgsRest(__VLS_395));
var __VLS_393;
var __VLS_389;
const __VLS_398 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_399 = __VLS_asFunctionalComponent(__VLS_398, new __VLS_398({
    span: (6),
}));
const __VLS_400 = __VLS_399({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_399));
__VLS_401.slots.default;
const __VLS_402 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_403 = __VLS_asFunctionalComponent(__VLS_402, new __VLS_402({
    label: "生产周期",
}));
const __VLS_404 = __VLS_403({
    label: "生产周期",
}, ...__VLS_functionalComponentArgsRest(__VLS_403));
__VLS_405.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-input-with-unit" },
});
const __VLS_406 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_407 = __VLS_asFunctionalComponent(__VLS_406, new __VLS_406({
    modelValue: (__VLS_ctx.form.productionCycle),
    controls: (false),
    ...{ class: "full-w" },
}));
const __VLS_408 = __VLS_407({
    modelValue: (__VLS_ctx.form.productionCycle),
    controls: (false),
    ...{ class: "full-w" },
}, ...__VLS_functionalComponentArgsRest(__VLS_407));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "p-unit-tag" },
});
var __VLS_405;
var __VLS_401;
var __VLS_361;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-grid-row" },
});
const __VLS_410 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_411 = __VLS_asFunctionalComponent(__VLS_410, new __VLS_410({
    gutter: (32),
}));
const __VLS_412 = __VLS_411({
    gutter: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_411));
__VLS_413.slots.default;
const __VLS_414 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_415 = __VLS_asFunctionalComponent(__VLS_414, new __VLS_414({
    span: (16),
}));
const __VLS_416 = __VLS_415({
    span: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_415));
__VLS_417.slots.default;
const __VLS_418 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_419 = __VLS_asFunctionalComponent(__VLS_418, new __VLS_418({
    label: "样品说明",
}));
const __VLS_420 = __VLS_419({
    label: "样品说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_419));
__VLS_421.slots.default;
const __VLS_422 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_423 = __VLS_asFunctionalComponent(__VLS_422, new __VLS_422({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (1),
    placeholder: "详情描述...",
}));
const __VLS_424 = __VLS_423({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (1),
    placeholder: "详情描述...",
}, ...__VLS_functionalComponentArgsRest(__VLS_423));
var __VLS_421;
var __VLS_417;
const __VLS_426 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_427 = __VLS_asFunctionalComponent(__VLS_426, new __VLS_426({
    span: (8),
}));
const __VLS_428 = __VLS_427({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_427));
__VLS_429.slots.default;
const __VLS_430 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_431 = __VLS_asFunctionalComponent(__VLS_430, new __VLS_430({
    label: "产品资质",
}));
const __VLS_432 = __VLS_431({
    label: "产品资质",
}, ...__VLS_functionalComponentArgsRest(__VLS_431));
__VLS_433.slots.default;
const __VLS_434 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_435 = __VLS_asFunctionalComponent(__VLS_434, new __VLS_434({
    action: "#",
    autoUpload: (false),
    fileList: (__VLS_ctx.form.qualifications),
    multiple: true,
    limit: (5),
    ...{ class: "p-qual-upload" },
}));
const __VLS_436 = __VLS_435({
    action: "#",
    autoUpload: (false),
    fileList: (__VLS_ctx.form.qualifications),
    multiple: true,
    limit: (5),
    ...{ class: "p-qual-upload" },
}, ...__VLS_functionalComponentArgsRest(__VLS_435));
__VLS_437.slots.default;
{
    const { trigger: __VLS_thisSlot } = __VLS_437.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-upload-trigger-mini" },
    });
    const __VLS_438 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_439 = __VLS_asFunctionalComponent(__VLS_438, new __VLS_438({}));
    const __VLS_440 = __VLS_439({}, ...__VLS_functionalComponentArgsRest(__VLS_439));
    __VLS_441.slots.default;
    const __VLS_442 = {}.DocumentAdd;
    /** @type {[typeof __VLS_components.DocumentAdd, ]} */ ;
    // @ts-ignore
    const __VLS_443 = __VLS_asFunctionalComponent(__VLS_442, new __VLS_442({}));
    const __VLS_444 = __VLS_443({}, ...__VLS_functionalComponentArgsRest(__VLS_443));
    var __VLS_441;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
var __VLS_437;
var __VLS_433;
var __VLS_429;
var __VLS_413;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    id: "section-table",
    ...{ class: "p-section-card no-padding" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-section-header between" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "left" },
    ...{ style: {} },
});
const __VLS_446 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_447 = __VLS_asFunctionalComponent(__VLS_446, new __VLS_446({
    ...{ class: "p-section-icon" },
}));
const __VLS_448 = __VLS_447({
    ...{ class: "p-section-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_447));
__VLS_449.slots.default;
const __VLS_450 = {}.Setting;
/** @type {[typeof __VLS_components.Setting, ]} */ ;
// @ts-ignore
const __VLS_451 = __VLS_asFunctionalComponent(__VLS_450, new __VLS_450({}));
const __VLS_452 = __VLS_451({}, ...__VLS_functionalComponentArgsRest(__VLS_451));
var __VLS_449;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_454 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_455 = __VLS_asFunctionalComponent(__VLS_454, new __VLS_454({
    ...{ 'onClick': {} },
    ...{ class: "p-add-row-btn" },
    icon: (__VLS_ctx.Plus),
}));
const __VLS_456 = __VLS_455({
    ...{ 'onClick': {} },
    ...{ class: "p-add-row-btn" },
    icon: (__VLS_ctx.Plus),
}, ...__VLS_functionalComponentArgsRest(__VLS_455));
let __VLS_458;
let __VLS_459;
let __VLS_460;
const __VLS_461 = {
    onClick: (__VLS_ctx.handleAddDetail)
};
__VLS_457.slots.default;
var __VLS_457;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-data-grid" },
});
const __VLS_462 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_463 = __VLS_asFunctionalComponent(__VLS_462, new __VLS_462({
    data: (__VLS_ctx.form.details),
    ...{ class: "p-table" },
    border: (false),
    ...{ style: {} },
    maxHeight: "400px",
}));
const __VLS_464 = __VLS_463({
    data: (__VLS_ctx.form.details),
    ...{ class: "p-table" },
    border: (false),
    ...{ style: {} },
    maxHeight: "400px",
}, ...__VLS_functionalComponentArgsRest(__VLS_463));
__VLS_465.slots.default;
const __VLS_466 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_467 = __VLS_asFunctionalComponent(__VLS_466, new __VLS_466({
    label: "图片",
    width: "80",
    align: "center",
    fixed: true,
    labelClassName: "p-required",
}));
const __VLS_468 = __VLS_467({
    label: "图片",
    width: "80",
    align: "center",
    fixed: true,
    labelClassName: "p-required",
}, ...__VLS_functionalComponentArgsRest(__VLS_467));
__VLS_469.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_469.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_470 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_471 = __VLS_asFunctionalComponent(__VLS_470, new __VLS_470({
        prop: ('details.' + scope.$index + '.images'),
        rules: ({ required: true, type: 'array', min: 1, message: '', trigger: 'change' }),
    }));
    const __VLS_472 = __VLS_471({
        prop: ('details.' + scope.$index + '.images'),
        rules: ({ required: true, type: 'array', min: 1, message: '', trigger: 'change' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_471));
    __VLS_473.slots.default;
    const __VLS_474 = {}.ElPopover;
    /** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
    // @ts-ignore
    const __VLS_475 = __VLS_asFunctionalComponent(__VLS_474, new __VLS_474({
        placement: "right",
        width: (260),
        trigger: "click",
        popperClass: "p-img-manager-popover",
    }));
    const __VLS_476 = __VLS_475({
        placement: "right",
        width: (260),
        trigger: "click",
        popperClass: "p-img-manager-popover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_475));
    __VLS_477.slots.default;
    {
        const { reference: __VLS_thisSlot } = __VLS_477.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-cell-img-preview" },
        });
        if (scope.row.images.length === 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "p-img-empty" },
            });
            const __VLS_478 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_479 = __VLS_asFunctionalComponent(__VLS_478, new __VLS_478({}));
            const __VLS_480 = __VLS_479({}, ...__VLS_functionalComponentArgsRest(__VLS_479));
            __VLS_481.slots.default;
            const __VLS_482 = {}.Picture;
            /** @type {[typeof __VLS_components.Picture, ]} */ ;
            // @ts-ignore
            const __VLS_483 = __VLS_asFunctionalComponent(__VLS_482, new __VLS_482({}));
            const __VLS_484 = __VLS_483({}, ...__VLS_functionalComponentArgsRest(__VLS_483));
            var __VLS_481;
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "p-img-main-wrapper" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (scope.row.images[0]),
                ...{ class: "p-img-main" },
            });
            if (scope.row.images.length > 1) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "p-img-count-badge" },
                });
                (scope.row.images.length - 1);
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-img-manager" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-mgr-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (scope.row.images.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-mgr-btns" },
    });
    const __VLS_486 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_487 = __VLS_asFunctionalComponent(__VLS_486, new __VLS_486({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        icon: (__VLS_ctx.Cellphone),
    }));
    const __VLS_488 = __VLS_487({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        icon: (__VLS_ctx.Cellphone),
    }, ...__VLS_functionalComponentArgsRest(__VLS_487));
    let __VLS_490;
    let __VLS_491;
    let __VLS_492;
    const __VLS_493 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleScanUpload(scope.$index);
        }
    };
    __VLS_489.slots.default;
    var __VLS_489;
    const __VLS_494 = {}.ElUpload;
    /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
    // @ts-ignore
    const __VLS_495 = __VLS_asFunctionalComponent(__VLS_494, new __VLS_494({
        action: "#",
        showFileList: (false),
        autoUpload: (false),
        onChange: ((file) => __VLS_ctx.handleImageSuccess(file, scope.$index)),
    }));
    const __VLS_496 = __VLS_495({
        action: "#",
        showFileList: (false),
        autoUpload: (false),
        onChange: ((file) => __VLS_ctx.handleImageSuccess(file, scope.$index)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_495));
    __VLS_497.slots.default;
    const __VLS_498 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_499 = __VLS_asFunctionalComponent(__VLS_498, new __VLS_498({
        link: true,
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_500 = __VLS_499({
        link: true,
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_499));
    __VLS_501.slots.default;
    var __VLS_501;
    var __VLS_497;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-mgr-grid" },
    });
    for (const [img, idx] of __VLS_getVForSourceType((scope.row.images))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (idx),
            ...{ class: "p-mgr-item" },
        });
        const __VLS_502 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        const __VLS_503 = __VLS_asFunctionalComponent(__VLS_502, new __VLS_502({
            src: (img),
            previewSrcList: (scope.row.images),
            initialIndex: (idx),
            fit: "cover",
            previewTeleported: true,
            ...{ class: "p-mgr-el-img" },
        }));
        const __VLS_504 = __VLS_503({
            src: (img),
            previewSrcList: (scope.row.images),
            initialIndex: (idx),
            fit: "cover",
            previewTeleported: true,
            ...{ class: "p-mgr-el-img" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_503));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    __VLS_ctx.handleRemoveImage(scope.$index, idx);
                } },
            ...{ class: "p-mgr-del" },
        });
        const __VLS_506 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_507 = __VLS_asFunctionalComponent(__VLS_506, new __VLS_506({}));
        const __VLS_508 = __VLS_507({}, ...__VLS_functionalComponentArgsRest(__VLS_507));
        __VLS_509.slots.default;
        const __VLS_510 = {}.Delete;
        /** @type {[typeof __VLS_components.Delete, ]} */ ;
        // @ts-ignore
        const __VLS_511 = __VLS_asFunctionalComponent(__VLS_510, new __VLS_510({}));
        const __VLS_512 = __VLS_511({}, ...__VLS_functionalComponentArgsRest(__VLS_511));
        var __VLS_509;
    }
    if (scope.row.images.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-mgr-empty" },
        });
    }
    var __VLS_477;
    var __VLS_473;
}
var __VLS_469;
const __VLS_514 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_515 = __VLS_asFunctionalComponent(__VLS_514, new __VLS_514({
    label: "图案",
    minWidth: "100",
    labelClassName: "p-required",
}));
const __VLS_516 = __VLS_515({
    label: "图案",
    minWidth: "100",
    labelClassName: "p-required",
}, ...__VLS_functionalComponentArgsRest(__VLS_515));
__VLS_517.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_517.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_518 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_519 = __VLS_asFunctionalComponent(__VLS_518, new __VLS_518({
        prop: ('details.' + scope.$index + '.pattern'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }));
    const __VLS_520 = __VLS_519({
        prop: ('details.' + scope.$index + '.pattern'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_519));
    __VLS_521.slots.default;
    const __VLS_522 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_523 = __VLS_asFunctionalComponent(__VLS_522, new __VLS_522({
        modelValue: (scope.row.pattern),
        placeholder: "输入图案",
        ...{ class: "p-ghost-input" },
        clearable: true,
    }));
    const __VLS_524 = __VLS_523({
        modelValue: (scope.row.pattern),
        placeholder: "输入图案",
        ...{ class: "p-ghost-input" },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_523));
    var __VLS_521;
}
var __VLS_517;
const __VLS_526 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_527 = __VLS_asFunctionalComponent(__VLS_526, new __VLS_526({
    label: "颜色",
    minWidth: "100",
    labelClassName: "p-required",
}));
const __VLS_528 = __VLS_527({
    label: "颜色",
    minWidth: "100",
    labelClassName: "p-required",
}, ...__VLS_functionalComponentArgsRest(__VLS_527));
__VLS_529.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_529.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_530 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_531 = __VLS_asFunctionalComponent(__VLS_530, new __VLS_530({
        prop: ('details.' + scope.$index + '.color'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }));
    const __VLS_532 = __VLS_531({
        prop: ('details.' + scope.$index + '.color'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_531));
    __VLS_533.slots.default;
    const __VLS_534 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_535 = __VLS_asFunctionalComponent(__VLS_534, new __VLS_534({
        modelValue: (scope.row.color),
        placeholder: "输入颜色",
        ...{ class: "p-ghost-input" },
        clearable: true,
    }));
    const __VLS_536 = __VLS_535({
        modelValue: (scope.row.color),
        placeholder: "输入颜色",
        ...{ class: "p-ghost-input" },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_535));
    var __VLS_533;
}
var __VLS_529;
const __VLS_538 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_539 = __VLS_asFunctionalComponent(__VLS_538, new __VLS_538({
    label: "规格",
    minWidth: "120",
    labelClassName: "p-required",
}));
const __VLS_540 = __VLS_539({
    label: "规格",
    minWidth: "120",
    labelClassName: "p-required",
}, ...__VLS_functionalComponentArgsRest(__VLS_539));
__VLS_541.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_541.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_542 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_543 = __VLS_asFunctionalComponent(__VLS_542, new __VLS_542({
        prop: ('details.' + scope.$index + '.spec'),
        rules: ({ required: true, message: '', trigger: 'change' }),
    }));
    const __VLS_544 = __VLS_543({
        prop: ('details.' + scope.$index + '.spec'),
        rules: ({ required: true, message: '', trigger: 'change' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_543));
    __VLS_545.slots.default;
    const __VLS_546 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_547 = __VLS_asFunctionalComponent(__VLS_546, new __VLS_546({
        modelValue: (scope.row.spec),
        placeholder: "选择规格",
        ...{ class: "p-ghost-select full-w" },
        clearable: true,
    }));
    const __VLS_548 = __VLS_547({
        modelValue: (scope.row.spec),
        placeholder: "选择规格",
        ...{ class: "p-ghost-select full-w" },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_547));
    __VLS_549.slots.default;
    const __VLS_550 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_551 = __VLS_asFunctionalComponent(__VLS_550, new __VLS_550({
        label: "通用",
        value: "通用",
    }));
    const __VLS_552 = __VLS_551({
        label: "通用",
        value: "通用",
    }, ...__VLS_functionalComponentArgsRest(__VLS_551));
    const __VLS_554 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_555 = __VLS_asFunctionalComponent(__VLS_554, new __VLS_554({
        label: "英规",
        value: "英规",
    }));
    const __VLS_556 = __VLS_555({
        label: "英规",
        value: "英规",
    }, ...__VLS_functionalComponentArgsRest(__VLS_555));
    const __VLS_558 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_559 = __VLS_asFunctionalComponent(__VLS_558, new __VLS_558({
        label: "美规",
        value: "美规",
    }));
    const __VLS_560 = __VLS_559({
        label: "美规",
        value: "美规",
    }, ...__VLS_functionalComponentArgsRest(__VLS_559));
    const __VLS_562 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_563 = __VLS_asFunctionalComponent(__VLS_562, new __VLS_562({
        label: "欧规",
        value: "欧规",
    }));
    const __VLS_564 = __VLS_563({
        label: "欧规",
        value: "欧规",
    }, ...__VLS_functionalComponentArgsRest(__VLS_563));
    const __VLS_566 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_567 = __VLS_asFunctionalComponent(__VLS_566, new __VLS_566({
        label: "日规",
        value: "日规",
    }));
    const __VLS_568 = __VLS_567({
        label: "日规",
        value: "日规",
    }, ...__VLS_functionalComponentArgsRest(__VLS_567));
    var __VLS_549;
    var __VLS_545;
}
var __VLS_541;
const __VLS_570 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_571 = __VLS_asFunctionalComponent(__VLS_570, new __VLS_570({
    label: "样品尺寸",
    minWidth: "210",
    labelClassName: "p-required",
}));
const __VLS_572 = __VLS_571({
    label: "样品尺寸",
    minWidth: "210",
    labelClassName: "p-required",
}, ...__VLS_functionalComponentArgsRest(__VLS_571));
__VLS_573.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_573.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_574 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_575 = __VLS_asFunctionalComponent(__VLS_574, new __VLS_574({
        prop: ('details.' + scope.$index + '.length'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }));
    const __VLS_576 = __VLS_575({
        prop: ('details.' + scope.$index + '.length'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_575));
    __VLS_577.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-input-group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-dim-group" },
    });
    const __VLS_578 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_579 = __VLS_asFunctionalComponent(__VLS_578, new __VLS_578({
        modelValue: (scope.row.length),
        controls: (false),
        placeholder: "长",
        ...{ class: "p-dim-input" },
    }));
    const __VLS_580 = __VLS_579({
        modelValue: (scope.row.length),
        controls: (false),
        placeholder: "长",
        ...{ class: "p-dim-input" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_579));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-dim-sep" },
    });
    const __VLS_582 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_583 = __VLS_asFunctionalComponent(__VLS_582, new __VLS_582({
        modelValue: (scope.row.width),
        controls: (false),
        placeholder: "宽",
        ...{ class: "p-dim-input" },
    }));
    const __VLS_584 = __VLS_583({
        modelValue: (scope.row.width),
        controls: (false),
        placeholder: "宽",
        ...{ class: "p-dim-input" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_583));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-dim-sep" },
    });
    const __VLS_586 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_587 = __VLS_asFunctionalComponent(__VLS_586, new __VLS_586({
        modelValue: (scope.row.height),
        controls: (false),
        placeholder: "高",
        ...{ class: "p-dim-input" },
    }));
    const __VLS_588 = __VLS_587({
        modelValue: (scope.row.height),
        controls: (false),
        placeholder: "高",
        ...{ class: "p-dim-input" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_587));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-switcher" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                scope.row.sampleSizeUnit = 'cm';
            } },
        ...{ class: ({ active: scope.row.sampleSizeUnit === 'cm' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                scope.row.sampleSizeUnit = 'mm';
            } },
        ...{ class: ({ active: scope.row.sampleSizeUnit === 'mm' }) },
    });
    var __VLS_577;
}
var __VLS_573;
const __VLS_590 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_591 = __VLS_asFunctionalComponent(__VLS_590, new __VLS_590({
    label: "净重",
    width: "110",
    labelClassName: "p-required",
}));
const __VLS_592 = __VLS_591({
    label: "净重",
    width: "110",
    labelClassName: "p-required",
}, ...__VLS_functionalComponentArgsRest(__VLS_591));
__VLS_593.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_593.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_594 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_595 = __VLS_asFunctionalComponent(__VLS_594, new __VLS_594({
        prop: ('details.' + scope.$index + '.netWeight'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }));
    const __VLS_596 = __VLS_595({
        prop: ('details.' + scope.$index + '.netWeight'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_595));
    __VLS_597.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-input-group" },
    });
    const __VLS_598 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_599 = __VLS_asFunctionalComponent(__VLS_598, new __VLS_598({
        modelValue: (scope.row.netWeight),
        controls: (false),
        placeholder: "净重",
        ...{ class: "p-table-input-number" },
    }));
    const __VLS_600 = __VLS_599({
        modelValue: (scope.row.netWeight),
        controls: (false),
        placeholder: "净重",
        ...{ class: "p-table-input-number" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_599));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-switcher mini" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                scope.row.netWeightUnit = 'g';
            } },
        ...{ class: ({ active: scope.row.netWeightUnit === 'g' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                scope.row.netWeightUnit = 'kg';
            } },
        ...{ class: ({ active: scope.row.netWeightUnit === 'kg' }) },
    });
    var __VLS_597;
}
var __VLS_593;
const __VLS_602 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_603 = __VLS_asFunctionalComponent(__VLS_602, new __VLS_602({
    label: "包装尺寸",
    minWidth: "210",
}));
const __VLS_604 = __VLS_603({
    label: "包装尺寸",
    minWidth: "210",
}, ...__VLS_functionalComponentArgsRest(__VLS_603));
__VLS_605.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_605.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-input-group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-dim-group" },
    });
    const __VLS_606 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_607 = __VLS_asFunctionalComponent(__VLS_606, new __VLS_606({
        modelValue: (scope.row.pLength),
        controls: (false),
        placeholder: "长",
        ...{ class: "p-dim-input" },
    }));
    const __VLS_608 = __VLS_607({
        modelValue: (scope.row.pLength),
        controls: (false),
        placeholder: "长",
        ...{ class: "p-dim-input" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_607));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-dim-sep" },
    });
    const __VLS_610 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_611 = __VLS_asFunctionalComponent(__VLS_610, new __VLS_610({
        modelValue: (scope.row.pWidth),
        controls: (false),
        placeholder: "宽",
        ...{ class: "p-dim-input" },
    }));
    const __VLS_612 = __VLS_611({
        modelValue: (scope.row.pWidth),
        controls: (false),
        placeholder: "宽",
        ...{ class: "p-dim-input" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_611));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-dim-sep" },
    });
    const __VLS_614 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_615 = __VLS_asFunctionalComponent(__VLS_614, new __VLS_614({
        modelValue: (scope.row.pHeight),
        controls: (false),
        placeholder: "高",
        ...{ class: "p-dim-input" },
    }));
    const __VLS_616 = __VLS_615({
        modelValue: (scope.row.pHeight),
        controls: (false),
        placeholder: "高",
        ...{ class: "p-dim-input" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_615));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-switcher" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                scope.row.packagingSizeUnit = 'cm';
            } },
        ...{ class: ({ active: scope.row.packagingSizeUnit === 'cm' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                scope.row.packagingSizeUnit = 'mm';
            } },
        ...{ class: ({ active: scope.row.packagingSizeUnit === 'mm' }) },
    });
}
var __VLS_605;
const __VLS_618 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_619 = __VLS_asFunctionalComponent(__VLS_618, new __VLS_618({
    label: "包装重量",
    width: "110",
}));
const __VLS_620 = __VLS_619({
    label: "包装重量",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_619));
__VLS_621.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_621.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-input-group" },
    });
    const __VLS_622 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_623 = __VLS_asFunctionalComponent(__VLS_622, new __VLS_622({
        modelValue: (scope.row.packagingWeight),
        controls: (false),
        placeholder: "重量",
        ...{ class: "p-table-input-number" },
    }));
    const __VLS_624 = __VLS_623({
        modelValue: (scope.row.packagingWeight),
        controls: (false),
        placeholder: "重量",
        ...{ class: "p-table-input-number" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_623));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-switcher mini" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                scope.row.packagingWeightUnit = 'g';
            } },
        ...{ class: ({ active: scope.row.packagingWeightUnit === 'g' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                scope.row.packagingWeightUnit = 'kg';
            } },
        ...{ class: ({ active: scope.row.packagingWeightUnit === 'kg' }) },
    });
}
var __VLS_621;
const __VLS_626 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_627 = __VLS_asFunctionalComponent(__VLS_626, new __VLS_626({
    label: "尺码",
    width: "90",
}));
const __VLS_628 = __VLS_627({
    label: "尺码",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_627));
__VLS_629.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_629.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_630 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_631 = __VLS_asFunctionalComponent(__VLS_630, new __VLS_630({
        modelValue: (scope.row.size),
        placeholder: "尺码",
        ...{ class: "p-ghost-input" },
        clearable: true,
    }));
    const __VLS_632 = __VLS_631({
        modelValue: (scope.row.size),
        placeholder: "尺码",
        ...{ class: "p-ghost-input" },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_631));
}
var __VLS_629;
const __VLS_634 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_635 = __VLS_asFunctionalComponent(__VLS_634, new __VLS_634({
    label: "直径",
    width: "130",
}));
const __VLS_636 = __VLS_635({
    label: "直径",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_635));
__VLS_637.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_637.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-input-group" },
    });
    const __VLS_638 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_639 = __VLS_asFunctionalComponent(__VLS_638, new __VLS_638({
        modelValue: (scope.row.diameter),
        controls: (false),
        placeholder: "直径",
        ...{ class: "p-table-input-number" },
    }));
    const __VLS_640 = __VLS_639({
        modelValue: (scope.row.diameter),
        controls: (false),
        placeholder: "直径",
        ...{ class: "p-table-input-number" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_639));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-switcher mini" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                scope.row.diameterUnit = 'cm';
            } },
        ...{ class: ({ active: scope.row.diameterUnit === 'cm' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                scope.row.diameterUnit = 'mm';
            } },
        ...{ class: ({ active: scope.row.diameterUnit === 'mm' }) },
    });
}
var __VLS_637;
const __VLS_642 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_643 = __VLS_asFunctionalComponent(__VLS_642, new __VLS_642({
    label: "容量",
    width: "110",
}));
const __VLS_644 = __VLS_643({
    label: "容量",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_643));
__VLS_645.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_645.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-input-group" },
    });
    const __VLS_646 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_647 = __VLS_asFunctionalComponent(__VLS_646, new __VLS_646({
        modelValue: (scope.row.capacity),
        controls: (false),
        placeholder: "容量",
        ...{ class: "p-table-input-number" },
    }));
    const __VLS_648 = __VLS_647({
        modelValue: (scope.row.capacity),
        controls: (false),
        placeholder: "容量",
        ...{ class: "p-table-input-number" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_647));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-switcher mini" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                scope.row.capacityUnit = 'ml';
            } },
        ...{ class: ({ active: scope.row.capacityUnit === 'ml' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                scope.row.capacityUnit = 'l';
            } },
        ...{ class: ({ active: scope.row.capacityUnit === 'l' }) },
    });
}
var __VLS_645;
const __VLS_650 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_651 = __VLS_asFunctionalComponent(__VLS_650, new __VLS_650({
    label: "操作",
    width: "90",
    align: "center",
    fixed: "right",
}));
const __VLS_652 = __VLS_651({
    label: "操作",
    width: "90",
    align: "center",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_651));
__VLS_653.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_653.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-row-actions" },
    });
    const __VLS_654 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_655 = __VLS_asFunctionalComponent(__VLS_654, new __VLS_654({
        ...{ 'onClick': {} },
        ...{ class: "p-row-action-btn" },
        link: true,
        icon: (__VLS_ctx.CopyDocument),
        title: "复制此行",
    }));
    const __VLS_656 = __VLS_655({
        ...{ 'onClick': {} },
        ...{ class: "p-row-action-btn" },
        link: true,
        icon: (__VLS_ctx.CopyDocument),
        title: "复制此行",
    }, ...__VLS_functionalComponentArgsRest(__VLS_655));
    let __VLS_658;
    let __VLS_659;
    let __VLS_660;
    const __VLS_661 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleCopyDetail(scope.$index);
        }
    };
    var __VLS_657;
    const __VLS_662 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_663 = __VLS_asFunctionalComponent(__VLS_662, new __VLS_662({
        ...{ 'onClick': {} },
        ...{ class: "p-row-action-btn del" },
        link: true,
        icon: (__VLS_ctx.Delete),
        title: "删除此行",
    }));
    const __VLS_664 = __VLS_663({
        ...{ 'onClick': {} },
        ...{ class: "p-row-action-btn del" },
        link: true,
        icon: (__VLS_ctx.Delete),
        title: "删除此行",
    }, ...__VLS_functionalComponentArgsRest(__VLS_663));
    let __VLS_666;
    let __VLS_667;
    let __VLS_668;
    const __VLS_669 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleRemoveDetail(scope.$index);
        }
    };
    var __VLS_665;
}
var __VLS_653;
var __VLS_465;
var __VLS_11;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-footer-info" },
    });
    const __VLS_670 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_671 = __VLS_asFunctionalComponent(__VLS_670, new __VLS_670({
        ...{ class: "p-info-icon" },
    }));
    const __VLS_672 = __VLS_671({
        ...{ class: "p-info-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_671));
    __VLS_673.slots.default;
    const __VLS_674 = {}.InfoFilled;
    /** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
    // @ts-ignore
    const __VLS_675 = __VLS_asFunctionalComponent(__VLS_674, new __VLS_674({}));
    const __VLS_676 = __VLS_675({}, ...__VLS_functionalComponentArgsRest(__VLS_675));
    var __VLS_673;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.form.details.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-footer-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.dialogVisible = false;
            } },
        ...{ class: "p-btn-secondary" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleSave) },
        ...{ class: "p-btn-secondary" },
        disabled: (__VLS_ctx.saving || __VLS_ctx.loading),
    });
    if (__VLS_ctx.saving) {
        const __VLS_678 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_679 = __VLS_asFunctionalComponent(__VLS_678, new __VLS_678({
            ...{ class: "is-loading" },
        }));
        const __VLS_680 = __VLS_679({
            ...{ class: "is-loading" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_679));
        __VLS_681.slots.default;
        const __VLS_682 = {}.Loading;
        /** @type {[typeof __VLS_components.Loading, ]} */ ;
        // @ts-ignore
        const __VLS_683 = __VLS_asFunctionalComponent(__VLS_682, new __VLS_682({}));
        const __VLS_684 = __VLS_683({}, ...__VLS_functionalComponentArgsRest(__VLS_683));
        var __VLS_681;
    }
    (__VLS_ctx.saving ? '保存中...' : '保存');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleSubmit) },
        ...{ class: "p-btn-primary" },
        disabled: (__VLS_ctx.loading || __VLS_ctx.saving),
    });
    if (__VLS_ctx.loading) {
        const __VLS_686 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_687 = __VLS_asFunctionalComponent(__VLS_686, new __VLS_686({
            ...{ class: "is-loading" },
        }));
        const __VLS_688 = __VLS_687({
            ...{ class: "is-loading" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_687));
        __VLS_689.slots.default;
        const __VLS_690 = {}.Loading;
        /** @type {[typeof __VLS_components.Loading, ]} */ ;
        // @ts-ignore
        const __VLS_691 = __VLS_asFunctionalComponent(__VLS_690, new __VLS_690({}));
        const __VLS_692 = __VLS_691({}, ...__VLS_functionalComponentArgsRest(__VLS_691));
        var __VLS_689;
    }
    (__VLS_ctx.loading ? '提交中...' : '提交');
}
var __VLS_3;
const __VLS_694 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_695 = __VLS_asFunctionalComponent(__VLS_694, new __VLS_694({
    modelValue: (__VLS_ctx.showQrCode),
    title: "扫码同步样品图片",
    width: "420px",
    alignCenter: true,
    ...{ class: "qr-upload-dialog" },
    closeOnClickModal: (false),
}));
const __VLS_696 = __VLS_695({
    modelValue: (__VLS_ctx.showQrCode),
    title: "扫码同步样品图片",
    width: "420px",
    alignCenter: true,
    ...{ class: "qr-upload-dialog" },
    closeOnClickModal: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_695));
__VLS_697.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "qr-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "qr-main-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "qr-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "qr-code-wrapper" },
});
const __VLS_698 = {}.ElImage;
/** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
// @ts-ignore
const __VLS_699 = __VLS_asFunctionalComponent(__VLS_698, new __VLS_698({
    src: (__VLS_ctx.qrCodeUrl),
    ...{ class: "qr-image" },
}));
const __VLS_700 = __VLS_699({
    src: (__VLS_ctx.qrCodeUrl),
    ...{ class: "qr-image" },
}, ...__VLS_functionalComponentArgsRest(__VLS_699));
if (__VLS_ctx.uploadStatus === 'success') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-status-toast" },
    });
    const __VLS_702 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_703 = __VLS_asFunctionalComponent(__VLS_702, new __VLS_702({}));
    const __VLS_704 = __VLS_703({}, ...__VLS_functionalComponentArgsRest(__VLS_703));
    __VLS_705.slots.default;
    const __VLS_706 = {}.Check;
    /** @type {[typeof __VLS_components.Check, ]} */ ;
    // @ts-ignore
    const __VLS_707 = __VLS_asFunctionalComponent(__VLS_706, new __VLS_706({}));
    const __VLS_708 = __VLS_707({}, ...__VLS_functionalComponentArgsRest(__VLS_707));
    var __VLS_705;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "qr-hint" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "qr-sync-list" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sync-header" },
});
(__VLS_ctx.form.details[__VLS_ctx.currentImgIndex]?.images.length || 0);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sync-grid" },
});
for (const [img, i] of __VLS_getVForSourceType((__VLS_ctx.form.details[__VLS_ctx.currentImgIndex]?.images))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (i),
        ...{ class: "sync-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (img),
    });
}
if (!__VLS_ctx.form.details[__VLS_ctx.currentImgIndex]?.images.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "sync-empty" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "qr-footer-actions" },
});
const __VLS_710 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_711 = __VLS_asFunctionalComponent(__VLS_710, new __VLS_710({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "qr-done-btn" },
}));
const __VLS_712 = __VLS_711({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "qr-done-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_711));
let __VLS_714;
let __VLS_715;
let __VLS_716;
const __VLS_717 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showQrCode = false;
    }
};
__VLS_713.slots.default;
var __VLS_713;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "qr-timer" },
});
var __VLS_697;
/** @type {__VLS_StyleScopedClasses['premium-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['p-container']} */ ;
/** @type {__VLS_StyleScopedClasses['p-form']} */ ;
/** @type {__VLS_StyleScopedClasses['p-main-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['p-form-content']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['p-grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['responsibility-row']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['p-grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['p-input-with-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['p-grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['p-grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['p-grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-input-with-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['p-input-with-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['p-input-with-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['p-grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-qual-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['p-upload-trigger-mini']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['no-padding']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['between']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['p-add-row-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['p-data-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['p-table']} */ ;
/** @type {__VLS_StyleScopedClasses['p-cell-img-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['p-img-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['p-img-main-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['p-img-main']} */ ;
/** @type {__VLS_StyleScopedClasses['p-img-count-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['p-img-manager']} */ ;
/** @type {__VLS_StyleScopedClasses['p-mgr-header']} */ ;
/** @type {__VLS_StyleScopedClasses['p-mgr-btns']} */ ;
/** @type {__VLS_StyleScopedClasses['p-mgr-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['p-mgr-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-mgr-el-img']} */ ;
/** @type {__VLS_StyleScopedClasses['p-mgr-del']} */ ;
/** @type {__VLS_StyleScopedClasses['p-mgr-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['p-ghost-input']} */ ;
/** @type {__VLS_StyleScopedClasses['p-ghost-input']} */ ;
/** @type {__VLS_StyleScopedClasses['p-ghost-select']} */ ;
/** @type {__VLS_StyleScopedClasses['full-w']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['p-dim-group']} */ ;
/** @type {__VLS_StyleScopedClasses['p-dim-input']} */ ;
/** @type {__VLS_StyleScopedClasses['p-dim-sep']} */ ;
/** @type {__VLS_StyleScopedClasses['p-dim-input']} */ ;
/** @type {__VLS_StyleScopedClasses['p-dim-sep']} */ ;
/** @type {__VLS_StyleScopedClasses['p-dim-input']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-switcher']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['p-table-input-number']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-switcher']} */ ;
/** @type {__VLS_StyleScopedClasses['mini']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['p-dim-group']} */ ;
/** @type {__VLS_StyleScopedClasses['p-dim-input']} */ ;
/** @type {__VLS_StyleScopedClasses['p-dim-sep']} */ ;
/** @type {__VLS_StyleScopedClasses['p-dim-input']} */ ;
/** @type {__VLS_StyleScopedClasses['p-dim-sep']} */ ;
/** @type {__VLS_StyleScopedClasses['p-dim-input']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-switcher']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['p-table-input-number']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-switcher']} */ ;
/** @type {__VLS_StyleScopedClasses['mini']} */ ;
/** @type {__VLS_StyleScopedClasses['p-ghost-input']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['p-table-input-number']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-switcher']} */ ;
/** @type {__VLS_StyleScopedClasses['mini']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['p-table-input-number']} */ ;
/** @type {__VLS_StyleScopedClasses['p-unit-switcher']} */ ;
/** @type {__VLS_StyleScopedClasses['mini']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row-action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['p-row-action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['del']} */ ;
/** @type {__VLS_StyleScopedClasses['p-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['p-footer-info']} */ ;
/** @type {__VLS_StyleScopedClasses['p-info-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['p-footer-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['p-btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['p-btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['p-btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-upload-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-container']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-main-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-left']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-code-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-image']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-status-toast']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-sync-list']} */ ;
/** @type {__VLS_StyleScopedClasses['sync-header']} */ ;
/** @type {__VLS_StyleScopedClasses['sync-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['sync-item']} */ ;
/** @type {__VLS_StyleScopedClasses['sync-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-footer-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-done-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-timer']} */ ;
// @ts-ignore
var __VLS_13 = __VLS_12;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Plus: Plus,
            Delete: Delete,
            DocumentAdd: DocumentAdd,
            Picture: Picture,
            InfoFilled: InfoFilled,
            Box: Box,
            Setting: Setting,
            CopyDocument: CopyDocument,
            Cellphone: Cellphone,
            Loading: Loading,
            Check: Check,
            QuestionFilled: QuestionFilled,
            SAMPLE_SOURCE: SAMPLE_SOURCE,
            SAMPLE_TYPE: SAMPLE_TYPE,
            dialogVisible: dialogVisible,
            loading: loading,
            saving: saving,
            showQrCode: showQrCode,
            qrCodeUrl: qrCodeUrl,
            uploadStatus: uploadStatus,
            currentImgIndex: currentImgIndex,
            formRef: formRef,
            formalSuppliers: formalSuppliers,
            mockProposals: mockProposals,
            mockStaff: mockStaff,
            form: form,
            rules: rules,
            handleProposalChange: handleProposalChange,
            handleAddDetail: handleAddDetail,
            handleCopyDetail: handleCopyDetail,
            handleImageSuccess: handleImageSuccess,
            handleScanUpload: handleScanUpload,
            handleRemoveImage: handleRemoveImage,
            handleRemoveDetail: handleRemoveDetail,
            handleClosed: handleClosed,
            handleSubmit: handleSubmit,
            handleSave: handleSave,
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
//# sourceMappingURL=RegistrationDialog.vue.js.map