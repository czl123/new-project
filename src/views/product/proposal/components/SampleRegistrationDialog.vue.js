/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Delete, DocumentAdd, Picture, InfoFilled, Box, Setting, CopyDocument, Cellphone, Loading, Check, QuestionFilled } from '@element-plus/icons-vue';
import { SAMPLE_SOURCE, SAMPLE_TYPE } from '../../../sample/constants';
const emit = defineEmits(['refresh']);
// 采用本地 ref 控制显示，确保 open() 方法 100% 有效
const dialogVisible = ref(false);
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
const open = (taskData) => {
    dialogVisible.value = true;
    if (taskData) {
        // Check if it is a registration detail row (has regNo and specific specs)
        const isRegistrationRow = taskData.regNo && (taskData.pattern !== undefined || taskData.color !== undefined);
        if (isRegistrationRow) {
            form.isLinkedToProposal = true;
            form.proposalId = taskData.proposalNo || 'P001';
            form.name = taskData.name || '样品打样件';
            form.style = taskData.style || '';
            form.mainMaterial = taskData.material || '';
            form.applicableTo = taskData.applicableTo || '通用';
            form.supplierName = taskData.supplierName || '';
            form.productManagerId = 'M201';
            form.purchaserId = 'U101';
            form.packagingMethod = taskData.packagingMethod || '盒装';
            form.packagingQuantity = taskData.packagingQuantity || '';
            form.initialQuote = taskData.initialQuote !== undefined ? taskData.initialQuote : 0;
            form.taxRate = taskData.taxRate !== undefined ? taskData.taxRate : 13;
            form.moq = taskData.moq !== undefined ? taskData.moq : 100;
            form.productionCycle = taskData.productionCycle !== undefined ? taskData.productionCycle : 15;
            form.description = taskData.description || '';
            form.hasBattery = taskData.hasBattery !== undefined ? taskData.hasBattery : false;
            form.isCE = taskData.isCE !== undefined ? taskData.isCE : false;
            form.sampleFee = parseFloat((taskData.sampleFee || '0').toString().replace(/[^\d.]/g, '')) || 0;
            form.receiveDate = taskData.receiveTime ? taskData.receiveTime.split(' ')[0] : '2026-05-24';
            // Parse sample size (e.g. "15.5×8.2×2.1 cm")
            let length = undefined;
            let width = undefined;
            let height = undefined;
            if (taskData.sampleSize) {
                const parts = taskData.sampleSize.replace(' cm', '').replace(' mm', '').split('×');
                if (parts.length === 3) {
                    length = parseFloat(parts[0]);
                    width = parseFloat(parts[1]);
                    height = parseFloat(parts[2]);
                }
            }
            // Parse packaging size (e.g. "18.0×10.5×4.0 cm")
            let pLength = undefined;
            let pWidth = undefined;
            let pHeight = undefined;
            if (taskData.packagingSize) {
                const parts = taskData.packagingSize.replace(' cm', '').replace(' mm', '').split('×');
                if (parts.length === 3) {
                    pLength = parseFloat(parts[0]);
                    pWidth = parseFloat(parts[1]);
                    pHeight = parseFloat(parts[2]);
                }
            }
            // Populate detail
            form.details = [{
                    pattern: taskData.pattern || '',
                    color: taskData.color || '',
                    spec: taskData.spec || '通用',
                    length,
                    width,
                    height,
                    sampleSizeUnit: taskData.sampleSize?.includes('mm') ? 'mm' : 'cm',
                    netWeight: parseFloat(taskData.netWeight) || undefined,
                    netWeightUnit: taskData.netWeight?.includes('kg') ? 'kg' : 'g',
                    images: taskData.image ? [taskData.image] : [],
                    pLength,
                    pWidth,
                    pHeight,
                    packagingSizeUnit: taskData.packagingSize?.includes('mm') ? 'mm' : 'cm',
                    packagingWeight: parseFloat(taskData.packagingWeight) || undefined,
                    packagingWeightUnit: taskData.packagingWeight?.includes('kg') ? 'kg' : 'g',
                    size: taskData.size || '',
                    diameter: parseFloat(taskData.diameter) || undefined,
                    diameterUnit: taskData.diameter?.includes('mm') ? 'mm' : 'cm',
                    capacity: parseFloat(taskData.capacity) || undefined,
                    capacityUnit: taskData.capacity?.includes('l') ? 'l' : 'ml'
                }];
        }
        else {
            // Normal task/feedback sync
            form.isLinkedToProposal = true;
            form.proposalId = taskData.proposalNo || '';
            form.name = taskData.productName || '';
            form.style = taskData.style || '';
            form.mainMaterial = taskData.material || '';
            form.applicableTo = taskData.applicableTo || '';
            if (taskData.isPurchaseSync) {
                form.source = taskData.sourceChannel || '1';
                form.supplierName = taskData.supplierName || '';
                form.purchaseUrl = taskData.purchaseUrl || '';
                form.sampleFee = taskData.sampleFee || 0;
            }
            else {
                form.source = '1';
                form.supplierName = taskData.source || '';
                form.purchaseUrl = '';
                form.sampleFee = 0;
            }
            form.productManagerId = 'M201';
            form.purchaserId = 'U101';
            if (form.details.length > 0) {
                form.details[0].pattern = taskData.model || '';
                form.details[0].color = taskData.style || '';
            }
        }
    }
};
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
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
    ...{ class: "p-grid-row" },
});
const __VLS_22 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(__VLS_22, new __VLS_22({
    gutter: (32),
}));
const __VLS_24 = __VLS_23({
    gutter: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
__VLS_25.slots.default;
const __VLS_26 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
    span: (6),
}));
const __VLS_28 = __VLS_27({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
__VLS_29.slots.default;
const __VLS_30 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
    label: "样品名称",
    prop: "name",
}));
const __VLS_32 = __VLS_31({
    label: "样品名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_33.slots.default;
const __VLS_34 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "输入样品完整名称",
}));
const __VLS_36 = __VLS_35({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "输入样品完整名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
var __VLS_33;
var __VLS_29;
const __VLS_38 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
    span: (6),
}));
const __VLS_40 = __VLS_39({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
__VLS_41.slots.default;
const __VLS_42 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
    label: "款式",
    prop: "style",
}));
const __VLS_44 = __VLS_43({
    label: "款式",
    prop: "style",
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
__VLS_45.slots.default;
const __VLS_46 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
    modelValue: (__VLS_ctx.form.style),
    placeholder: "如：升级款",
}));
const __VLS_48 = __VLS_47({
    modelValue: (__VLS_ctx.form.style),
    placeholder: "如：升级款",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
var __VLS_45;
var __VLS_41;
const __VLS_50 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
    span: (6),
}));
const __VLS_52 = __VLS_51({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
__VLS_53.slots.default;
const __VLS_54 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
    label: "主材料",
    prop: "mainMaterial",
}));
const __VLS_56 = __VLS_55({
    label: "主材料",
    prop: "mainMaterial",
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
__VLS_57.slots.default;
const __VLS_58 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    modelValue: (__VLS_ctx.form.mainMaterial),
    placeholder: "材质",
}));
const __VLS_60 = __VLS_59({
    modelValue: (__VLS_ctx.form.mainMaterial),
    placeholder: "材质",
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
var __VLS_57;
var __VLS_53;
const __VLS_62 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    span: (6),
}));
const __VLS_64 = __VLS_63({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
__VLS_65.slots.default;
const __VLS_66 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    label: "适用品牌或对象",
    prop: "applicableTo",
}));
const __VLS_68 = __VLS_67({
    label: "适用品牌或对象",
    prop: "applicableTo",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_69.slots.default;
const __VLS_70 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    modelValue: (__VLS_ctx.form.applicableTo),
    placeholder: "适用范围",
}));
const __VLS_72 = __VLS_71({
    modelValue: (__VLS_ctx.form.applicableTo),
    placeholder: "适用范围",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
var __VLS_69;
var __VLS_65;
var __VLS_25;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-grid-row" },
});
const __VLS_74 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    gutter: (32),
}));
const __VLS_76 = __VLS_75({
    gutter: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
__VLS_77.slots.default;
const __VLS_78 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    span: (6),
}));
const __VLS_80 = __VLS_79({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
__VLS_81.slots.default;
const __VLS_82 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    label: "样品类型",
    prop: "sampleType",
}));
const __VLS_84 = __VLS_83({
    label: "样品类型",
    prop: "sampleType",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
__VLS_85.slots.default;
const __VLS_86 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    modelValue: (__VLS_ctx.form.sampleType),
    ...{ class: "full-w" },
    clearable: true,
}));
const __VLS_88 = __VLS_87({
    modelValue: (__VLS_ctx.form.sampleType),
    ...{ class: "full-w" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
__VLS_89.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.SAMPLE_TYPE))) {
    const __VLS_90 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_92 = __VLS_91({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_91));
    __VLS_93.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ style: {} },
    });
    (item.desc);
    var __VLS_93;
}
var __VLS_89;
var __VLS_85;
var __VLS_81;
if (__VLS_ctx.form.sampleType === '1') {
    const __VLS_94 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
        span: (6),
    }));
    const __VLS_96 = __VLS_95({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    __VLS_97.slots.default;
    const __VLS_98 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
        label: "样品接收日期",
        prop: "receiveDate",
    }));
    const __VLS_100 = __VLS_99({
        label: "样品接收日期",
        prop: "receiveDate",
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    __VLS_101.slots.default;
    const __VLS_102 = {}.ElDatePicker;
    /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
        modelValue: (__VLS_ctx.form.receiveDate),
        type: "date",
        placeholder: "选择日期",
        ...{ class: "full-w" },
        valueFormat: "YYYY-MM-DD",
    }));
    const __VLS_104 = __VLS_103({
        modelValue: (__VLS_ctx.form.receiveDate),
        type: "date",
        placeholder: "选择日期",
        ...{ class: "full-w" },
        valueFormat: "YYYY-MM-DD",
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    var __VLS_101;
    var __VLS_97;
}
if (['6', '7', '8'].includes(__VLS_ctx.form.sampleType)) {
    const __VLS_106 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
        span: (6),
    }));
    const __VLS_108 = __VLS_107({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    __VLS_109.slots.default;
    const __VLS_110 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
        label: "对比结束日期",
        prop: "comparisonEndDate",
    }));
    const __VLS_112 = __VLS_111({
        label: "对比结束日期",
        prop: "comparisonEndDate",
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    __VLS_113.slots.default;
    const __VLS_114 = {}.ElDatePicker;
    /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
        modelValue: (__VLS_ctx.form.comparisonEndDate),
        type: "date",
        placeholder: "选择日期",
        ...{ class: "full-w" },
        valueFormat: "YYYY-MM-DD",
    }));
    const __VLS_116 = __VLS_115({
        modelValue: (__VLS_ctx.form.comparisonEndDate),
        type: "date",
        placeholder: "选择日期",
        ...{ class: "full-w" },
        valueFormat: "YYYY-MM-DD",
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    var __VLS_113;
    var __VLS_109;
}
const __VLS_118 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({
    span: (6),
}));
const __VLS_120 = __VLS_119({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
__VLS_121.slots.default;
const __VLS_122 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
    label: "样品费",
    prop: "sampleFee",
}));
const __VLS_124 = __VLS_123({
    label: "样品费",
    prop: "sampleFee",
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
__VLS_125.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-input-with-unit" },
});
const __VLS_126 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent(__VLS_126, new __VLS_126({
    modelValue: (__VLS_ctx.form.sampleFee),
    precision: (2),
    controls: (false),
    ...{ class: "full-w" },
}));
const __VLS_128 = __VLS_127({
    modelValue: (__VLS_ctx.form.sampleFee),
    precision: (2),
    controls: (false),
    ...{ class: "full-w" },
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "p-unit-tag" },
});
var __VLS_125;
var __VLS_121;
var __VLS_77;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-grid-row" },
});
const __VLS_130 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent(__VLS_130, new __VLS_130({
    gutter: (32),
}));
const __VLS_132 = __VLS_131({
    gutter: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
__VLS_133.slots.default;
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
    label: "拿样渠道",
    prop: "source",
}));
const __VLS_140 = __VLS_139({
    label: "拿样渠道",
    prop: "source",
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
__VLS_141.slots.default;
const __VLS_142 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
    modelValue: (__VLS_ctx.form.source),
    ...{ class: "full-w" },
    clearable: true,
}));
const __VLS_144 = __VLS_143({
    modelValue: (__VLS_ctx.form.source),
    ...{ class: "full-w" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
__VLS_145.slots.default;
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.SAMPLE_SOURCE))) {
    const __VLS_146 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_148 = __VLS_147({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_147));
}
var __VLS_145;
var __VLS_141;
var __VLS_137;
const __VLS_150 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
    span: (__VLS_ctx.form.source === '1' ? 4 : 0),
}));
const __VLS_152 = __VLS_151({
    span: (__VLS_ctx.form.source === '1' ? 4 : 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
__VLS_153.slots.default;
if (__VLS_ctx.form.source === '1') {
    const __VLS_154 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({
        label: "供应商类型",
    }));
    const __VLS_156 = __VLS_155({
        label: "供应商类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
    __VLS_157.slots.default;
    const __VLS_158 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({
        modelValue: (__VLS_ctx.form.supplierType),
        ...{ class: "full-w" },
        clearable: true,
    }));
    const __VLS_160 = __VLS_159({
        modelValue: (__VLS_ctx.form.supplierType),
        ...{ class: "full-w" },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_159));
    __VLS_161.slots.default;
    const __VLS_162 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
        label: "正式",
        value: "1",
    }));
    const __VLS_164 = __VLS_163({
        label: "正式",
        value: "1",
    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    const __VLS_166 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({
        label: "临时",
        value: "2",
    }));
    const __VLS_168 = __VLS_167({
        label: "临时",
        value: "2",
    }, ...__VLS_functionalComponentArgsRest(__VLS_167));
    var __VLS_161;
    var __VLS_157;
}
var __VLS_153;
const __VLS_170 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({
    span: (__VLS_ctx.form.source === '1' ? 14 : 18),
}));
const __VLS_172 = __VLS_171({
    span: (__VLS_ctx.form.source === '1' ? 14 : 18),
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
__VLS_173.slots.default;
if (__VLS_ctx.form.source === '1') {
    const __VLS_174 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
        label: "供应商名称",
        prop: "supplierName",
    }));
    const __VLS_176 = __VLS_175({
        label: "供应商名称",
        prop: "supplierName",
    }, ...__VLS_functionalComponentArgsRest(__VLS_175));
    __VLS_177.slots.default;
    if (__VLS_ctx.form.supplierType === '1') {
        const __VLS_178 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_179 = __VLS_asFunctionalComponent(__VLS_178, new __VLS_178({
            modelValue: (__VLS_ctx.form.supplierName),
            placeholder: "选择供应商",
            ...{ class: "full-w" },
            filterable: true,
            clearable: true,
        }));
        const __VLS_180 = __VLS_179({
            modelValue: (__VLS_ctx.form.supplierName),
            placeholder: "选择供应商",
            ...{ class: "full-w" },
            filterable: true,
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_179));
        __VLS_181.slots.default;
        for (const [s] of __VLS_getVForSourceType((__VLS_ctx.formalSuppliers))) {
            const __VLS_182 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
                key: (s.value),
                label: (s.label),
                value: (s.label),
            }));
            const __VLS_184 = __VLS_183({
                key: (s.value),
                label: (s.label),
                value: (s.label),
            }, ...__VLS_functionalComponentArgsRest(__VLS_183));
        }
        var __VLS_181;
    }
    else {
        const __VLS_186 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({
            modelValue: (__VLS_ctx.form.supplierName),
            placeholder: "输入临时供应商名称",
            clearable: true,
        }));
        const __VLS_188 = __VLS_187({
            modelValue: (__VLS_ctx.form.supplierName),
            placeholder: "输入临时供应商名称",
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_187));
    }
    var __VLS_177;
}
else {
    const __VLS_190 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({
        label: "购买链接",
        prop: "purchaseUrl",
    }));
    const __VLS_192 = __VLS_191({
        label: "购买链接",
        prop: "purchaseUrl",
    }, ...__VLS_functionalComponentArgsRest(__VLS_191));
    __VLS_193.slots.default;
    const __VLS_194 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({
        modelValue: (__VLS_ctx.form.purchaseUrl),
        placeholder: "粘贴链接",
        clearable: true,
    }));
    const __VLS_196 = __VLS_195({
        modelValue: (__VLS_ctx.form.purchaseUrl),
        placeholder: "粘贴链接",
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_195));
    __VLS_197.slots.default;
    {
        const { prepend: __VLS_thisSlot } = __VLS_197.slots;
        (__VLS_ctx.form.source === '2' ? '1688' : '淘宝');
    }
    var __VLS_197;
    var __VLS_193;
}
var __VLS_173;
var __VLS_133;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-grid-row" },
});
const __VLS_198 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent(__VLS_198, new __VLS_198({
    gutter: (32),
}));
const __VLS_200 = __VLS_199({
    gutter: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
__VLS_201.slots.default;
const __VLS_202 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({
    span: (6),
}));
const __VLS_204 = __VLS_203({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_203));
__VLS_205.slots.default;
const __VLS_206 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
    label: "包装方式",
}));
const __VLS_208 = __VLS_207({
    label: "包装方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_207));
__VLS_209.slots.default;
const __VLS_210 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_211 = __VLS_asFunctionalComponent(__VLS_210, new __VLS_210({
    modelValue: (__VLS_ctx.form.packagingMethod),
    placeholder: "请选择",
    ...{ class: "full-w" },
    clearable: true,
}));
const __VLS_212 = __VLS_211({
    modelValue: (__VLS_ctx.form.packagingMethod),
    placeholder: "请选择",
    ...{ class: "full-w" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_211));
__VLS_213.slots.default;
const __VLS_214 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({
    label: "盒装",
    value: "盒装",
}));
const __VLS_216 = __VLS_215({
    label: "盒装",
    value: "盒装",
}, ...__VLS_functionalComponentArgsRest(__VLS_215));
const __VLS_218 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_219 = __VLS_asFunctionalComponent(__VLS_218, new __VLS_218({
    label: "袋装",
    value: "袋装",
}));
const __VLS_220 = __VLS_219({
    label: "袋装",
    value: "袋装",
}, ...__VLS_functionalComponentArgsRest(__VLS_219));
var __VLS_213;
var __VLS_209;
var __VLS_205;
const __VLS_222 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_223 = __VLS_asFunctionalComponent(__VLS_222, new __VLS_222({
    span: (6),
}));
const __VLS_224 = __VLS_223({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_223));
__VLS_225.slots.default;
const __VLS_226 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({}));
const __VLS_228 = __VLS_227({}, ...__VLS_functionalComponentArgsRest(__VLS_227));
__VLS_229.slots.default;
{
    const { label: __VLS_thisSlot } = __VLS_229.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_230 = {}.ElTooltip;
    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_231 = __VLS_asFunctionalComponent(__VLS_230, new __VLS_230({
        effect: "dark",
        placement: "top",
    }));
    const __VLS_232 = __VLS_231({
        effect: "dark",
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_231));
    __VLS_233.slots.default;
    {
        const { content: __VLS_thisSlot } = __VLS_233.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
    }
    const __VLS_234 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_235 = __VLS_asFunctionalComponent(__VLS_234, new __VLS_234({
        ...{ style: {} },
    }));
    const __VLS_236 = __VLS_235({
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_235));
    __VLS_237.slots.default;
    const __VLS_238 = {}.QuestionFilled;
    /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
    // @ts-ignore
    const __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({}));
    const __VLS_240 = __VLS_239({}, ...__VLS_functionalComponentArgsRest(__VLS_239));
    var __VLS_237;
    var __VLS_233;
}
const __VLS_242 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_243 = __VLS_asFunctionalComponent(__VLS_242, new __VLS_242({
    modelValue: (__VLS_ctx.form.packagingQuantity),
    placeholder: "如: 1pack",
    ...{ class: "full-w" },
    clearable: true,
}));
const __VLS_244 = __VLS_243({
    modelValue: (__VLS_ctx.form.packagingQuantity),
    placeholder: "如: 1pack",
    ...{ class: "full-w" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_243));
var __VLS_229;
var __VLS_225;
const __VLS_246 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246({
    span: (6),
}));
const __VLS_248 = __VLS_247({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_247));
__VLS_249.slots.default;
const __VLS_250 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_251 = __VLS_asFunctionalComponent(__VLS_250, new __VLS_250({
    label: "是否带电",
}));
const __VLS_252 = __VLS_251({
    label: "是否带电",
}, ...__VLS_functionalComponentArgsRest(__VLS_251));
__VLS_253.slots.default;
const __VLS_254 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_255 = __VLS_asFunctionalComponent(__VLS_254, new __VLS_254({
    modelValue: (__VLS_ctx.form.hasBattery),
    ...{ class: "full-w" },
    clearable: true,
}));
const __VLS_256 = __VLS_255({
    modelValue: (__VLS_ctx.form.hasBattery),
    ...{ class: "full-w" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_255));
__VLS_257.slots.default;
const __VLS_258 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_259 = __VLS_asFunctionalComponent(__VLS_258, new __VLS_258({
    label: "是",
    value: (true),
}));
const __VLS_260 = __VLS_259({
    label: "是",
    value: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_259));
const __VLS_262 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({
    label: "否",
    value: (false),
}));
const __VLS_264 = __VLS_263({
    label: "否",
    value: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_263));
var __VLS_257;
var __VLS_253;
var __VLS_249;
const __VLS_266 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_267 = __VLS_asFunctionalComponent(__VLS_266, new __VLS_266({
    span: (6),
}));
const __VLS_268 = __VLS_267({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_267));
__VLS_269.slots.default;
const __VLS_270 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_271 = __VLS_asFunctionalComponent(__VLS_270, new __VLS_270({
    label: "是否CE类",
}));
const __VLS_272 = __VLS_271({
    label: "是否CE类",
}, ...__VLS_functionalComponentArgsRest(__VLS_271));
__VLS_273.slots.default;
const __VLS_274 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_275 = __VLS_asFunctionalComponent(__VLS_274, new __VLS_274({
    modelValue: (__VLS_ctx.form.isCE),
    ...{ class: "full-w" },
    clearable: true,
}));
const __VLS_276 = __VLS_275({
    modelValue: (__VLS_ctx.form.isCE),
    ...{ class: "full-w" },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_275));
__VLS_277.slots.default;
const __VLS_278 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_279 = __VLS_asFunctionalComponent(__VLS_278, new __VLS_278({
    label: "是",
    value: (true),
}));
const __VLS_280 = __VLS_279({
    label: "是",
    value: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_279));
const __VLS_282 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_283 = __VLS_asFunctionalComponent(__VLS_282, new __VLS_282({
    label: "否",
    value: (false),
}));
const __VLS_284 = __VLS_283({
    label: "否",
    value: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_283));
var __VLS_277;
var __VLS_273;
var __VLS_269;
var __VLS_201;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-grid-row" },
});
const __VLS_286 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_287 = __VLS_asFunctionalComponent(__VLS_286, new __VLS_286({
    gutter: (32),
}));
const __VLS_288 = __VLS_287({
    gutter: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_287));
__VLS_289.slots.default;
const __VLS_290 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_291 = __VLS_asFunctionalComponent(__VLS_290, new __VLS_290({
    span: (6),
}));
const __VLS_292 = __VLS_291({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_291));
__VLS_293.slots.default;
const __VLS_294 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_295 = __VLS_asFunctionalComponent(__VLS_294, new __VLS_294({
    label: "初次报价",
}));
const __VLS_296 = __VLS_295({
    label: "初次报价",
}, ...__VLS_functionalComponentArgsRest(__VLS_295));
__VLS_297.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-input-with-unit" },
});
const __VLS_298 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_299 = __VLS_asFunctionalComponent(__VLS_298, new __VLS_298({
    modelValue: (__VLS_ctx.form.initialQuote),
    precision: (2),
    controls: (false),
    ...{ class: "full-w" },
}));
const __VLS_300 = __VLS_299({
    modelValue: (__VLS_ctx.form.initialQuote),
    precision: (2),
    controls: (false),
    ...{ class: "full-w" },
}, ...__VLS_functionalComponentArgsRest(__VLS_299));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "p-unit-tag" },
});
var __VLS_297;
var __VLS_293;
const __VLS_302 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_303 = __VLS_asFunctionalComponent(__VLS_302, new __VLS_302({
    span: (6),
}));
const __VLS_304 = __VLS_303({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_303));
__VLS_305.slots.default;
const __VLS_306 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_307 = __VLS_asFunctionalComponent(__VLS_306, new __VLS_306({
    label: "税率",
}));
const __VLS_308 = __VLS_307({
    label: "税率",
}, ...__VLS_functionalComponentArgsRest(__VLS_307));
__VLS_309.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-input-with-unit" },
});
const __VLS_310 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_311 = __VLS_asFunctionalComponent(__VLS_310, new __VLS_310({
    modelValue: (__VLS_ctx.form.taxRate),
    controls: (false),
    ...{ class: "full-w" },
}));
const __VLS_312 = __VLS_311({
    modelValue: (__VLS_ctx.form.taxRate),
    controls: (false),
    ...{ class: "full-w" },
}, ...__VLS_functionalComponentArgsRest(__VLS_311));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "p-unit-tag" },
});
var __VLS_309;
var __VLS_305;
const __VLS_314 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_315 = __VLS_asFunctionalComponent(__VLS_314, new __VLS_314({
    span: (6),
}));
const __VLS_316 = __VLS_315({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_315));
__VLS_317.slots.default;
const __VLS_318 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_319 = __VLS_asFunctionalComponent(__VLS_318, new __VLS_318({
    label: "起订量",
}));
const __VLS_320 = __VLS_319({
    label: "起订量",
}, ...__VLS_functionalComponentArgsRest(__VLS_319));
__VLS_321.slots.default;
const __VLS_322 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_323 = __VLS_asFunctionalComponent(__VLS_322, new __VLS_322({
    modelValue: (__VLS_ctx.form.moq),
    controls: (false),
    ...{ class: "full-w" },
}));
const __VLS_324 = __VLS_323({
    modelValue: (__VLS_ctx.form.moq),
    controls: (false),
    ...{ class: "full-w" },
}, ...__VLS_functionalComponentArgsRest(__VLS_323));
var __VLS_321;
var __VLS_317;
const __VLS_326 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_327 = __VLS_asFunctionalComponent(__VLS_326, new __VLS_326({
    span: (6),
}));
const __VLS_328 = __VLS_327({
    span: (6),
}, ...__VLS_functionalComponentArgsRest(__VLS_327));
__VLS_329.slots.default;
const __VLS_330 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_331 = __VLS_asFunctionalComponent(__VLS_330, new __VLS_330({
    label: "生产周期",
}));
const __VLS_332 = __VLS_331({
    label: "生产周期",
}, ...__VLS_functionalComponentArgsRest(__VLS_331));
__VLS_333.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-input-with-unit" },
});
const __VLS_334 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_335 = __VLS_asFunctionalComponent(__VLS_334, new __VLS_334({
    modelValue: (__VLS_ctx.form.productionCycle),
    controls: (false),
    ...{ class: "full-w" },
}));
const __VLS_336 = __VLS_335({
    modelValue: (__VLS_ctx.form.productionCycle),
    controls: (false),
    ...{ class: "full-w" },
}, ...__VLS_functionalComponentArgsRest(__VLS_335));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "p-unit-tag" },
});
var __VLS_333;
var __VLS_329;
var __VLS_289;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-grid-row" },
});
const __VLS_338 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_339 = __VLS_asFunctionalComponent(__VLS_338, new __VLS_338({
    gutter: (32),
}));
const __VLS_340 = __VLS_339({
    gutter: (32),
}, ...__VLS_functionalComponentArgsRest(__VLS_339));
__VLS_341.slots.default;
const __VLS_342 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_343 = __VLS_asFunctionalComponent(__VLS_342, new __VLS_342({
    span: (16),
}));
const __VLS_344 = __VLS_343({
    span: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_343));
__VLS_345.slots.default;
const __VLS_346 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_347 = __VLS_asFunctionalComponent(__VLS_346, new __VLS_346({
    label: "样品说明",
}));
const __VLS_348 = __VLS_347({
    label: "样品说明",
}, ...__VLS_functionalComponentArgsRest(__VLS_347));
__VLS_349.slots.default;
const __VLS_350 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_351 = __VLS_asFunctionalComponent(__VLS_350, new __VLS_350({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (1),
    placeholder: "详情描述...",
}));
const __VLS_352 = __VLS_351({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (1),
    placeholder: "详情描述...",
}, ...__VLS_functionalComponentArgsRest(__VLS_351));
var __VLS_349;
var __VLS_345;
const __VLS_354 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_355 = __VLS_asFunctionalComponent(__VLS_354, new __VLS_354({
    span: (8),
}));
const __VLS_356 = __VLS_355({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_355));
__VLS_357.slots.default;
const __VLS_358 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_359 = __VLS_asFunctionalComponent(__VLS_358, new __VLS_358({
    label: "产品资质",
}));
const __VLS_360 = __VLS_359({
    label: "产品资质",
}, ...__VLS_functionalComponentArgsRest(__VLS_359));
__VLS_361.slots.default;
const __VLS_362 = {}.ElUpload;
/** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
// @ts-ignore
const __VLS_363 = __VLS_asFunctionalComponent(__VLS_362, new __VLS_362({
    action: "#",
    autoUpload: (false),
    fileList: (__VLS_ctx.form.qualifications),
    multiple: true,
    limit: (5),
    ...{ class: "p-qual-upload" },
}));
const __VLS_364 = __VLS_363({
    action: "#",
    autoUpload: (false),
    fileList: (__VLS_ctx.form.qualifications),
    multiple: true,
    limit: (5),
    ...{ class: "p-qual-upload" },
}, ...__VLS_functionalComponentArgsRest(__VLS_363));
__VLS_365.slots.default;
{
    const { trigger: __VLS_thisSlot } = __VLS_365.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-upload-trigger-mini" },
    });
    const __VLS_366 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_367 = __VLS_asFunctionalComponent(__VLS_366, new __VLS_366({}));
    const __VLS_368 = __VLS_367({}, ...__VLS_functionalComponentArgsRest(__VLS_367));
    __VLS_369.slots.default;
    const __VLS_370 = {}.DocumentAdd;
    /** @type {[typeof __VLS_components.DocumentAdd, ]} */ ;
    // @ts-ignore
    const __VLS_371 = __VLS_asFunctionalComponent(__VLS_370, new __VLS_370({}));
    const __VLS_372 = __VLS_371({}, ...__VLS_functionalComponentArgsRest(__VLS_371));
    var __VLS_369;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
var __VLS_365;
var __VLS_361;
var __VLS_357;
var __VLS_341;
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
const __VLS_374 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_375 = __VLS_asFunctionalComponent(__VLS_374, new __VLS_374({
    ...{ class: "p-section-icon" },
}));
const __VLS_376 = __VLS_375({
    ...{ class: "p-section-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_375));
__VLS_377.slots.default;
const __VLS_378 = {}.Setting;
/** @type {[typeof __VLS_components.Setting, ]} */ ;
// @ts-ignore
const __VLS_379 = __VLS_asFunctionalComponent(__VLS_378, new __VLS_378({}));
const __VLS_380 = __VLS_379({}, ...__VLS_functionalComponentArgsRest(__VLS_379));
var __VLS_377;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_382 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_383 = __VLS_asFunctionalComponent(__VLS_382, new __VLS_382({
    ...{ 'onClick': {} },
    ...{ class: "p-add-row-btn" },
    icon: (__VLS_ctx.Plus),
}));
const __VLS_384 = __VLS_383({
    ...{ 'onClick': {} },
    ...{ class: "p-add-row-btn" },
    icon: (__VLS_ctx.Plus),
}, ...__VLS_functionalComponentArgsRest(__VLS_383));
let __VLS_386;
let __VLS_387;
let __VLS_388;
const __VLS_389 = {
    onClick: (__VLS_ctx.handleAddDetail)
};
__VLS_385.slots.default;
var __VLS_385;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "p-data-grid" },
});
const __VLS_390 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_391 = __VLS_asFunctionalComponent(__VLS_390, new __VLS_390({
    data: (__VLS_ctx.form.details),
    ...{ class: "p-table" },
    border: (false),
    ...{ style: {} },
    maxHeight: "400px",
}));
const __VLS_392 = __VLS_391({
    data: (__VLS_ctx.form.details),
    ...{ class: "p-table" },
    border: (false),
    ...{ style: {} },
    maxHeight: "400px",
}, ...__VLS_functionalComponentArgsRest(__VLS_391));
__VLS_393.slots.default;
const __VLS_394 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_395 = __VLS_asFunctionalComponent(__VLS_394, new __VLS_394({
    label: "图片",
    width: "80",
    align: "center",
    fixed: true,
    labelClassName: "p-required",
}));
const __VLS_396 = __VLS_395({
    label: "图片",
    width: "80",
    align: "center",
    fixed: true,
    labelClassName: "p-required",
}, ...__VLS_functionalComponentArgsRest(__VLS_395));
__VLS_397.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_397.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_398 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_399 = __VLS_asFunctionalComponent(__VLS_398, new __VLS_398({
        prop: ('details.' + scope.$index + '.images'),
        rules: ({ required: true, type: 'array', min: 1, message: '', trigger: 'change' }),
    }));
    const __VLS_400 = __VLS_399({
        prop: ('details.' + scope.$index + '.images'),
        rules: ({ required: true, type: 'array', min: 1, message: '', trigger: 'change' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_399));
    __VLS_401.slots.default;
    const __VLS_402 = {}.ElPopover;
    /** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
    // @ts-ignore
    const __VLS_403 = __VLS_asFunctionalComponent(__VLS_402, new __VLS_402({
        placement: "right",
        width: (260),
        trigger: "click",
        popperClass: "p-img-manager-popover",
    }));
    const __VLS_404 = __VLS_403({
        placement: "right",
        width: (260),
        trigger: "click",
        popperClass: "p-img-manager-popover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_403));
    __VLS_405.slots.default;
    {
        const { reference: __VLS_thisSlot } = __VLS_405.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-cell-img-preview" },
        });
        if (scope.row.images.length === 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "p-img-empty" },
            });
            const __VLS_406 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_407 = __VLS_asFunctionalComponent(__VLS_406, new __VLS_406({}));
            const __VLS_408 = __VLS_407({}, ...__VLS_functionalComponentArgsRest(__VLS_407));
            __VLS_409.slots.default;
            const __VLS_410 = {}.Picture;
            /** @type {[typeof __VLS_components.Picture, ]} */ ;
            // @ts-ignore
            const __VLS_411 = __VLS_asFunctionalComponent(__VLS_410, new __VLS_410({}));
            const __VLS_412 = __VLS_411({}, ...__VLS_functionalComponentArgsRest(__VLS_411));
            var __VLS_409;
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
    const __VLS_414 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_415 = __VLS_asFunctionalComponent(__VLS_414, new __VLS_414({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        icon: (__VLS_ctx.Cellphone),
    }));
    const __VLS_416 = __VLS_415({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        icon: (__VLS_ctx.Cellphone),
    }, ...__VLS_functionalComponentArgsRest(__VLS_415));
    let __VLS_418;
    let __VLS_419;
    let __VLS_420;
    const __VLS_421 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleScanUpload(scope.$index);
        }
    };
    __VLS_417.slots.default;
    var __VLS_417;
    const __VLS_422 = {}.ElUpload;
    /** @type {[typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, typeof __VLS_components.ElUpload, typeof __VLS_components.elUpload, ]} */ ;
    // @ts-ignore
    const __VLS_423 = __VLS_asFunctionalComponent(__VLS_422, new __VLS_422({
        action: "#",
        showFileList: (false),
        autoUpload: (false),
        onChange: ((file) => __VLS_ctx.handleImageSuccess(file, scope.$index)),
    }));
    const __VLS_424 = __VLS_423({
        action: "#",
        showFileList: (false),
        autoUpload: (false),
        onChange: ((file) => __VLS_ctx.handleImageSuccess(file, scope.$index)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_423));
    __VLS_425.slots.default;
    const __VLS_426 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_427 = __VLS_asFunctionalComponent(__VLS_426, new __VLS_426({
        link: true,
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }));
    const __VLS_428 = __VLS_427({
        link: true,
        type: "primary",
        icon: (__VLS_ctx.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_427));
    __VLS_429.slots.default;
    var __VLS_429;
    var __VLS_425;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-mgr-grid" },
    });
    for (const [img, idx] of __VLS_getVForSourceType((scope.row.images))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (idx),
            ...{ class: "p-mgr-item" },
        });
        const __VLS_430 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        const __VLS_431 = __VLS_asFunctionalComponent(__VLS_430, new __VLS_430({
            src: (img),
            previewSrcList: (scope.row.images),
            initialIndex: (idx),
            fit: "cover",
            previewTeleported: true,
            ...{ class: "p-mgr-el-img" },
        }));
        const __VLS_432 = __VLS_431({
            src: (img),
            previewSrcList: (scope.row.images),
            initialIndex: (idx),
            fit: "cover",
            previewTeleported: true,
            ...{ class: "p-mgr-el-img" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_431));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    __VLS_ctx.handleRemoveImage(scope.$index, idx);
                } },
            ...{ class: "p-mgr-del" },
        });
        const __VLS_434 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_435 = __VLS_asFunctionalComponent(__VLS_434, new __VLS_434({}));
        const __VLS_436 = __VLS_435({}, ...__VLS_functionalComponentArgsRest(__VLS_435));
        __VLS_437.slots.default;
        const __VLS_438 = {}.Delete;
        /** @type {[typeof __VLS_components.Delete, ]} */ ;
        // @ts-ignore
        const __VLS_439 = __VLS_asFunctionalComponent(__VLS_438, new __VLS_438({}));
        const __VLS_440 = __VLS_439({}, ...__VLS_functionalComponentArgsRest(__VLS_439));
        var __VLS_437;
    }
    if (scope.row.images.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-mgr-empty" },
        });
    }
    var __VLS_405;
    var __VLS_401;
}
var __VLS_397;
const __VLS_442 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_443 = __VLS_asFunctionalComponent(__VLS_442, new __VLS_442({
    label: "图案",
    minWidth: "100",
    labelClassName: "p-required",
}));
const __VLS_444 = __VLS_443({
    label: "图案",
    minWidth: "100",
    labelClassName: "p-required",
}, ...__VLS_functionalComponentArgsRest(__VLS_443));
__VLS_445.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_445.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_446 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_447 = __VLS_asFunctionalComponent(__VLS_446, new __VLS_446({
        prop: ('details.' + scope.$index + '.pattern'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }));
    const __VLS_448 = __VLS_447({
        prop: ('details.' + scope.$index + '.pattern'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_447));
    __VLS_449.slots.default;
    const __VLS_450 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_451 = __VLS_asFunctionalComponent(__VLS_450, new __VLS_450({
        modelValue: (scope.row.pattern),
        placeholder: "输入图案",
        ...{ class: "p-ghost-input" },
        clearable: true,
    }));
    const __VLS_452 = __VLS_451({
        modelValue: (scope.row.pattern),
        placeholder: "输入图案",
        ...{ class: "p-ghost-input" },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_451));
    var __VLS_449;
}
var __VLS_445;
const __VLS_454 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_455 = __VLS_asFunctionalComponent(__VLS_454, new __VLS_454({
    label: "颜色",
    minWidth: "100",
    labelClassName: "p-required",
}));
const __VLS_456 = __VLS_455({
    label: "颜色",
    minWidth: "100",
    labelClassName: "p-required",
}, ...__VLS_functionalComponentArgsRest(__VLS_455));
__VLS_457.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_457.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_458 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_459 = __VLS_asFunctionalComponent(__VLS_458, new __VLS_458({
        prop: ('details.' + scope.$index + '.color'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }));
    const __VLS_460 = __VLS_459({
        prop: ('details.' + scope.$index + '.color'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_459));
    __VLS_461.slots.default;
    const __VLS_462 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_463 = __VLS_asFunctionalComponent(__VLS_462, new __VLS_462({
        modelValue: (scope.row.color),
        placeholder: "输入颜色",
        ...{ class: "p-ghost-input" },
        clearable: true,
    }));
    const __VLS_464 = __VLS_463({
        modelValue: (scope.row.color),
        placeholder: "输入颜色",
        ...{ class: "p-ghost-input" },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_463));
    var __VLS_461;
}
var __VLS_457;
const __VLS_466 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_467 = __VLS_asFunctionalComponent(__VLS_466, new __VLS_466({
    label: "规格",
    minWidth: "120",
    labelClassName: "p-required",
}));
const __VLS_468 = __VLS_467({
    label: "规格",
    minWidth: "120",
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
        prop: ('details.' + scope.$index + '.spec'),
        rules: ({ required: true, message: '', trigger: 'change' }),
    }));
    const __VLS_472 = __VLS_471({
        prop: ('details.' + scope.$index + '.spec'),
        rules: ({ required: true, message: '', trigger: 'change' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_471));
    __VLS_473.slots.default;
    const __VLS_474 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_475 = __VLS_asFunctionalComponent(__VLS_474, new __VLS_474({
        modelValue: (scope.row.spec),
        placeholder: "选择规格",
        ...{ class: "p-ghost-select full-w" },
        clearable: true,
    }));
    const __VLS_476 = __VLS_475({
        modelValue: (scope.row.spec),
        placeholder: "选择规格",
        ...{ class: "p-ghost-select full-w" },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_475));
    __VLS_477.slots.default;
    const __VLS_478 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_479 = __VLS_asFunctionalComponent(__VLS_478, new __VLS_478({
        label: "通用",
        value: "通用",
    }));
    const __VLS_480 = __VLS_479({
        label: "通用",
        value: "通用",
    }, ...__VLS_functionalComponentArgsRest(__VLS_479));
    const __VLS_482 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_483 = __VLS_asFunctionalComponent(__VLS_482, new __VLS_482({
        label: "英规",
        value: "英规",
    }));
    const __VLS_484 = __VLS_483({
        label: "英规",
        value: "英规",
    }, ...__VLS_functionalComponentArgsRest(__VLS_483));
    const __VLS_486 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_487 = __VLS_asFunctionalComponent(__VLS_486, new __VLS_486({
        label: "美规",
        value: "美规",
    }));
    const __VLS_488 = __VLS_487({
        label: "美规",
        value: "美规",
    }, ...__VLS_functionalComponentArgsRest(__VLS_487));
    const __VLS_490 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_491 = __VLS_asFunctionalComponent(__VLS_490, new __VLS_490({
        label: "欧规",
        value: "欧规",
    }));
    const __VLS_492 = __VLS_491({
        label: "欧规",
        value: "欧规",
    }, ...__VLS_functionalComponentArgsRest(__VLS_491));
    const __VLS_494 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_495 = __VLS_asFunctionalComponent(__VLS_494, new __VLS_494({
        label: "日规",
        value: "日规",
    }));
    const __VLS_496 = __VLS_495({
        label: "日规",
        value: "日规",
    }, ...__VLS_functionalComponentArgsRest(__VLS_495));
    var __VLS_477;
    var __VLS_473;
}
var __VLS_469;
const __VLS_498 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_499 = __VLS_asFunctionalComponent(__VLS_498, new __VLS_498({
    label: "样品尺寸",
    minWidth: "210",
    labelClassName: "p-required",
}));
const __VLS_500 = __VLS_499({
    label: "样品尺寸",
    minWidth: "210",
    labelClassName: "p-required",
}, ...__VLS_functionalComponentArgsRest(__VLS_499));
__VLS_501.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_501.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_502 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_503 = __VLS_asFunctionalComponent(__VLS_502, new __VLS_502({
        prop: ('details.' + scope.$index + '.length'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }));
    const __VLS_504 = __VLS_503({
        prop: ('details.' + scope.$index + '.length'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_503));
    __VLS_505.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-input-group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-dim-group" },
    });
    const __VLS_506 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_507 = __VLS_asFunctionalComponent(__VLS_506, new __VLS_506({
        modelValue: (scope.row.length),
        controls: (false),
        placeholder: "长",
        ...{ class: "p-dim-input" },
    }));
    const __VLS_508 = __VLS_507({
        modelValue: (scope.row.length),
        controls: (false),
        placeholder: "长",
        ...{ class: "p-dim-input" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_507));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-dim-sep" },
    });
    const __VLS_510 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_511 = __VLS_asFunctionalComponent(__VLS_510, new __VLS_510({
        modelValue: (scope.row.width),
        controls: (false),
        placeholder: "宽",
        ...{ class: "p-dim-input" },
    }));
    const __VLS_512 = __VLS_511({
        modelValue: (scope.row.width),
        controls: (false),
        placeholder: "宽",
        ...{ class: "p-dim-input" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_511));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-dim-sep" },
    });
    const __VLS_514 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_515 = __VLS_asFunctionalComponent(__VLS_514, new __VLS_514({
        modelValue: (scope.row.height),
        controls: (false),
        placeholder: "高",
        ...{ class: "p-dim-input" },
    }));
    const __VLS_516 = __VLS_515({
        modelValue: (scope.row.height),
        controls: (false),
        placeholder: "高",
        ...{ class: "p-dim-input" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_515));
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
    var __VLS_505;
}
var __VLS_501;
const __VLS_518 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_519 = __VLS_asFunctionalComponent(__VLS_518, new __VLS_518({
    label: "净重",
    width: "110",
    labelClassName: "p-required",
}));
const __VLS_520 = __VLS_519({
    label: "净重",
    width: "110",
    labelClassName: "p-required",
}, ...__VLS_functionalComponentArgsRest(__VLS_519));
__VLS_521.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_521.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_522 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_523 = __VLS_asFunctionalComponent(__VLS_522, new __VLS_522({
        prop: ('details.' + scope.$index + '.netWeight'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }));
    const __VLS_524 = __VLS_523({
        prop: ('details.' + scope.$index + '.netWeight'),
        rules: ({ required: true, message: '', trigger: 'blur' }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_523));
    __VLS_525.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-input-group" },
    });
    const __VLS_526 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_527 = __VLS_asFunctionalComponent(__VLS_526, new __VLS_526({
        modelValue: (scope.row.netWeight),
        controls: (false),
        placeholder: "净重",
        ...{ class: "p-table-input-number" },
    }));
    const __VLS_528 = __VLS_527({
        modelValue: (scope.row.netWeight),
        controls: (false),
        placeholder: "净重",
        ...{ class: "p-table-input-number" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_527));
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
    var __VLS_525;
}
var __VLS_521;
const __VLS_530 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_531 = __VLS_asFunctionalComponent(__VLS_530, new __VLS_530({
    label: "包装尺寸",
    minWidth: "210",
}));
const __VLS_532 = __VLS_531({
    label: "包装尺寸",
    minWidth: "210",
}, ...__VLS_functionalComponentArgsRest(__VLS_531));
__VLS_533.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_533.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-input-group" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-dim-group" },
    });
    const __VLS_534 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_535 = __VLS_asFunctionalComponent(__VLS_534, new __VLS_534({
        modelValue: (scope.row.pLength),
        controls: (false),
        placeholder: "长",
        ...{ class: "p-dim-input" },
    }));
    const __VLS_536 = __VLS_535({
        modelValue: (scope.row.pLength),
        controls: (false),
        placeholder: "长",
        ...{ class: "p-dim-input" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_535));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-dim-sep" },
    });
    const __VLS_538 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_539 = __VLS_asFunctionalComponent(__VLS_538, new __VLS_538({
        modelValue: (scope.row.pWidth),
        controls: (false),
        placeholder: "宽",
        ...{ class: "p-dim-input" },
    }));
    const __VLS_540 = __VLS_539({
        modelValue: (scope.row.pWidth),
        controls: (false),
        placeholder: "宽",
        ...{ class: "p-dim-input" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_539));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-dim-sep" },
    });
    const __VLS_542 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_543 = __VLS_asFunctionalComponent(__VLS_542, new __VLS_542({
        modelValue: (scope.row.pHeight),
        controls: (false),
        placeholder: "高",
        ...{ class: "p-dim-input" },
    }));
    const __VLS_544 = __VLS_543({
        modelValue: (scope.row.pHeight),
        controls: (false),
        placeholder: "高",
        ...{ class: "p-dim-input" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_543));
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
var __VLS_533;
const __VLS_546 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_547 = __VLS_asFunctionalComponent(__VLS_546, new __VLS_546({
    label: "包装重量",
    width: "110",
}));
const __VLS_548 = __VLS_547({
    label: "包装重量",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_547));
__VLS_549.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_549.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-input-group" },
    });
    const __VLS_550 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_551 = __VLS_asFunctionalComponent(__VLS_550, new __VLS_550({
        modelValue: (scope.row.packagingWeight),
        controls: (false),
        placeholder: "重量",
        ...{ class: "p-table-input-number" },
    }));
    const __VLS_552 = __VLS_551({
        modelValue: (scope.row.packagingWeight),
        controls: (false),
        placeholder: "重量",
        ...{ class: "p-table-input-number" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_551));
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
var __VLS_549;
const __VLS_554 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_555 = __VLS_asFunctionalComponent(__VLS_554, new __VLS_554({
    label: "尺码",
    width: "90",
}));
const __VLS_556 = __VLS_555({
    label: "尺码",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_555));
__VLS_557.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_557.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_558 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_559 = __VLS_asFunctionalComponent(__VLS_558, new __VLS_558({
        modelValue: (scope.row.size),
        placeholder: "尺码",
        ...{ class: "p-ghost-input" },
        clearable: true,
    }));
    const __VLS_560 = __VLS_559({
        modelValue: (scope.row.size),
        placeholder: "尺码",
        ...{ class: "p-ghost-input" },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_559));
}
var __VLS_557;
const __VLS_562 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_563 = __VLS_asFunctionalComponent(__VLS_562, new __VLS_562({
    label: "直径",
    width: "130",
}));
const __VLS_564 = __VLS_563({
    label: "直径",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_563));
__VLS_565.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_565.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-input-group" },
    });
    const __VLS_566 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_567 = __VLS_asFunctionalComponent(__VLS_566, new __VLS_566({
        modelValue: (scope.row.diameter),
        controls: (false),
        placeholder: "直径",
        ...{ class: "p-table-input-number" },
    }));
    const __VLS_568 = __VLS_567({
        modelValue: (scope.row.diameter),
        controls: (false),
        placeholder: "直径",
        ...{ class: "p-table-input-number" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_567));
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
var __VLS_565;
const __VLS_570 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_571 = __VLS_asFunctionalComponent(__VLS_570, new __VLS_570({
    label: "容量",
    width: "110",
}));
const __VLS_572 = __VLS_571({
    label: "容量",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_571));
__VLS_573.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_573.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-unit-input-group" },
    });
    const __VLS_574 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_575 = __VLS_asFunctionalComponent(__VLS_574, new __VLS_574({
        modelValue: (scope.row.capacity),
        controls: (false),
        placeholder: "容量",
        ...{ class: "p-table-input-number" },
    }));
    const __VLS_576 = __VLS_575({
        modelValue: (scope.row.capacity),
        controls: (false),
        placeholder: "容量",
        ...{ class: "p-table-input-number" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_575));
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
var __VLS_573;
const __VLS_578 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_579 = __VLS_asFunctionalComponent(__VLS_578, new __VLS_578({
    label: "操作",
    width: "90",
    align: "center",
    fixed: "right",
}));
const __VLS_580 = __VLS_579({
    label: "操作",
    width: "90",
    align: "center",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_579));
__VLS_581.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_581.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-row-actions" },
    });
    const __VLS_582 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_583 = __VLS_asFunctionalComponent(__VLS_582, new __VLS_582({
        ...{ 'onClick': {} },
        ...{ class: "p-row-action-btn" },
        link: true,
        icon: (__VLS_ctx.CopyDocument),
        title: "复制此行",
    }));
    const __VLS_584 = __VLS_583({
        ...{ 'onClick': {} },
        ...{ class: "p-row-action-btn" },
        link: true,
        icon: (__VLS_ctx.CopyDocument),
        title: "复制此行",
    }, ...__VLS_functionalComponentArgsRest(__VLS_583));
    let __VLS_586;
    let __VLS_587;
    let __VLS_588;
    const __VLS_589 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleCopyDetail(scope.$index);
        }
    };
    var __VLS_585;
    const __VLS_590 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_591 = __VLS_asFunctionalComponent(__VLS_590, new __VLS_590({
        ...{ 'onClick': {} },
        ...{ class: "p-row-action-btn del" },
        link: true,
        icon: (__VLS_ctx.Delete),
        title: "删除此行",
    }));
    const __VLS_592 = __VLS_591({
        ...{ 'onClick': {} },
        ...{ class: "p-row-action-btn del" },
        link: true,
        icon: (__VLS_ctx.Delete),
        title: "删除此行",
    }, ...__VLS_functionalComponentArgsRest(__VLS_591));
    let __VLS_594;
    let __VLS_595;
    let __VLS_596;
    const __VLS_597 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleRemoveDetail(scope.$index);
        }
    };
    var __VLS_593;
}
var __VLS_581;
var __VLS_393;
var __VLS_11;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-footer-info" },
    });
    const __VLS_598 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_599 = __VLS_asFunctionalComponent(__VLS_598, new __VLS_598({
        ...{ class: "p-info-icon" },
    }));
    const __VLS_600 = __VLS_599({
        ...{ class: "p-info-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_599));
    __VLS_601.slots.default;
    const __VLS_602 = {}.InfoFilled;
    /** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
    // @ts-ignore
    const __VLS_603 = __VLS_asFunctionalComponent(__VLS_602, new __VLS_602({}));
    const __VLS_604 = __VLS_603({}, ...__VLS_functionalComponentArgsRest(__VLS_603));
    var __VLS_601;
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
        const __VLS_606 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_607 = __VLS_asFunctionalComponent(__VLS_606, new __VLS_606({
            ...{ class: "is-loading" },
        }));
        const __VLS_608 = __VLS_607({
            ...{ class: "is-loading" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_607));
        __VLS_609.slots.default;
        const __VLS_610 = {}.Loading;
        /** @type {[typeof __VLS_components.Loading, ]} */ ;
        // @ts-ignore
        const __VLS_611 = __VLS_asFunctionalComponent(__VLS_610, new __VLS_610({}));
        const __VLS_612 = __VLS_611({}, ...__VLS_functionalComponentArgsRest(__VLS_611));
        var __VLS_609;
    }
    (__VLS_ctx.saving ? '保存中...' : '保存');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleSubmit) },
        ...{ class: "p-btn-primary" },
        disabled: (__VLS_ctx.loading || __VLS_ctx.saving),
    });
    if (__VLS_ctx.loading) {
        const __VLS_614 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_615 = __VLS_asFunctionalComponent(__VLS_614, new __VLS_614({
            ...{ class: "is-loading" },
        }));
        const __VLS_616 = __VLS_615({
            ...{ class: "is-loading" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_615));
        __VLS_617.slots.default;
        const __VLS_618 = {}.Loading;
        /** @type {[typeof __VLS_components.Loading, ]} */ ;
        // @ts-ignore
        const __VLS_619 = __VLS_asFunctionalComponent(__VLS_618, new __VLS_618({}));
        const __VLS_620 = __VLS_619({}, ...__VLS_functionalComponentArgsRest(__VLS_619));
        var __VLS_617;
    }
    (__VLS_ctx.loading ? '提交中...' : '提交');
}
var __VLS_3;
const __VLS_622 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_623 = __VLS_asFunctionalComponent(__VLS_622, new __VLS_622({
    modelValue: (__VLS_ctx.showQrCode),
    title: "扫码同步样品图片",
    width: "420px",
    alignCenter: true,
    ...{ class: "qr-upload-dialog" },
    closeOnClickModal: (false),
}));
const __VLS_624 = __VLS_623({
    modelValue: (__VLS_ctx.showQrCode),
    title: "扫码同步样品图片",
    width: "420px",
    alignCenter: true,
    ...{ class: "qr-upload-dialog" },
    closeOnClickModal: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_623));
__VLS_625.slots.default;
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
const __VLS_626 = {}.ElImage;
/** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
// @ts-ignore
const __VLS_627 = __VLS_asFunctionalComponent(__VLS_626, new __VLS_626({
    src: (__VLS_ctx.qrCodeUrl),
    ...{ class: "qr-image" },
}));
const __VLS_628 = __VLS_627({
    src: (__VLS_ctx.qrCodeUrl),
    ...{ class: "qr-image" },
}, ...__VLS_functionalComponentArgsRest(__VLS_627));
if (__VLS_ctx.uploadStatus === 'success') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "qr-status-toast" },
    });
    const __VLS_630 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_631 = __VLS_asFunctionalComponent(__VLS_630, new __VLS_630({}));
    const __VLS_632 = __VLS_631({}, ...__VLS_functionalComponentArgsRest(__VLS_631));
    __VLS_633.slots.default;
    const __VLS_634 = {}.Check;
    /** @type {[typeof __VLS_components.Check, ]} */ ;
    // @ts-ignore
    const __VLS_635 = __VLS_asFunctionalComponent(__VLS_634, new __VLS_634({}));
    const __VLS_636 = __VLS_635({}, ...__VLS_functionalComponentArgsRest(__VLS_635));
    var __VLS_633;
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
const __VLS_638 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_639 = __VLS_asFunctionalComponent(__VLS_638, new __VLS_638({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "qr-done-btn" },
}));
const __VLS_640 = __VLS_639({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "qr-done-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_639));
let __VLS_642;
let __VLS_643;
let __VLS_644;
const __VLS_645 = {
    onClick: (...[$event]) => {
        __VLS_ctx.showQrCode = false;
    }
};
__VLS_641.slots.default;
var __VLS_641;
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "qr-timer" },
});
var __VLS_625;
/** @type {__VLS_StyleScopedClasses['premium-dialog']} */ ;
/** @type {__VLS_StyleScopedClasses['p-container']} */ ;
/** @type {__VLS_StyleScopedClasses['p-form']} */ ;
/** @type {__VLS_StyleScopedClasses['p-main-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['p-form-content']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-icon']} */ ;
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
            form: form,
            rules: rules,
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
//# sourceMappingURL=SampleRegistrationDialog.vue.js.map