/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus';
import axios from 'axios';
import { useTableHeight } from '@/hooks/useTableHeight';
import { SAMPLE_STATUS, SAMPLE_SOURCE, SAMPLE_TYPE, INITIAL_QUERY_PARAMS, STATUS_MAP } from './constants';
import RegistrationDialog from './components/RegistrationDialog.vue';
import TestEvaluationDialog from './components/TestEvaluationDialog.vue';
import BatchStatusDialog from './components/BatchStatusDialog.vue';
import SampleTimeline from './components/SampleTimeline.vue';
const tableHeight = useTableHeight(190);
const route = useRoute();
const queryParams = reactive({ ...INITIAL_QUERY_PARAMS });
onMounted(() => {
    if (route.query.proposalNo) {
        queryParams.proposalNo = route.query.proposalNo;
    }
});
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(5);
const multipleTableRef = ref();
const regVisible = ref(false);
const testVisible = ref(false);
const batchStatusVisible = ref(false);
const targetStatus = ref('');
const detailVisible = ref(false);
const currentRow = ref(null);
const editRow = ref(null);
const selectedRows = ref([]);
const handleSelectionChange = (val) => {
    selectedRows.value = val;
};
const clearSelection = () => {
    multipleTableRef.value?.clearSelection();
};
const handleBatchExport = () => {
    console.log('批量导出：', selectedRows.value);
};
const handleBatchPrint = () => {
    if (!selectedRows.value.length)
        return;
    doPrint(selectedRows.value);
};
const handleBatchStatusChange = (status) => {
    targetStatus.value = status;
    batchStatusVisible.value = true;
};
const handleBatchStatusConfirm = (formData) => {
    // 模拟更新本地数据
    selectedRows.value.forEach(row => {
        const item = allData.value.find(d => d.id === row.id);
        if (item) {
            item.status = formData.status;
            item.updateTime = new Date().toLocaleString();
        }
    });
    clearSelection();
    handleQuery();
};
const handlePrint = (row) => {
    doPrint([row]);
};
/**
 * 调用后端 API 进行局域网远程打印
 */
const doPrint = async (data) => {
    if (!data || data.length === 0)
        return;
    const loading = ElLoading.service({
        text: '正在通知 ERP 系统进行标签打印...',
        background: 'rgba(255,255,255,0.7)'
    });
    try {
        // 动态获取 Token：尝试所有可能的 Key
        const defaultToken = 'eyJhbGciOiJIUzUxMiJ9.eyJhY2NvdW50SWQiOjI1Mywic3ViIjoiUzIwMTgwMjI5IiwiZXhwIjoxNzc5MjEzMjk3LCJpYXQiOjE3NzkxNTU2OTd9.Sb6wZlIYRx9ddpxwwEakInyFo8wA5fwk1CGFjfuEfPDKvdg7jUsswa_snexyUhu9iJcBgb41IKfCixZlNOG0Pg';
        const token = localStorage.getItem('Access-Token') ||
            localStorage.getItem('token') ||
            localStorage.getItem('BSCJC_Token') ||
            defaultToken;
        // 调用官方 ERP 打印接口
        const response = await axios.post('/bsc-cloud-product/rlMatLsInfoRegist/samplePrint', {
            sysSampleIdList: ['2056586352676388865']
        }, {
            headers: {
                'X-Access-Token': token,
                'token': token,
                'Authorization': token,
                'X-BSCJC-Token': token
            }
        });
        if (response.data?.success || response.data?.code === 200) {
            ElMessage.success(`打印指令已成功发送至云端 (${data.length}份)`);
        }
        else {
            throw new Error(response.data?.message || 'ERP 接口返回错误');
        }
    }
    catch (error) {
        console.error('ERP 打印出错:', error);
        ElMessage.error(`打印失败: ${error.message || '网络连接超时'}`);
    }
    finally {
        loading.close();
    }
};
const allData = ref([
    {
        id: '1001', sampleNo: 'YP-202605001', sampleName: '户外牧羊人钩-待提交', proposalNo: 'TA-202604100', productManager: '张三', purchaser: '李四',
        style: '经典款', mainMaterial: '不锈钢', applicableTo: '亚马逊/自营',
        sampleType: '1', source: '1', round: 1, sampleFee: 50.00, receiveDate: '2026-05-09', comparisonEndDate: '-',
        status: '1', expireDate: '2026-12-31', updateTime: '2026-05-09 10:00:00', supplier: '晨光文具', spec: '不锈钢材质',
        images: ['/uploads/img_2c4gj_1778668130970.jpg', '/uploads/img_2c4gj_1778668144849.jpg']
    },
    {
        id: '1005', sampleNo: 'YP-202605005', sampleName: '登山杖-领用中', proposalNo: 'TA-202604099', productManager: '张三', purchaser: '李四',
        style: '轻量化', mainMaterial: '碳纤维', applicableTo: '驴友',
        sampleType: '1', source: '1', round: 1, sampleFee: 180.00, receiveDate: '2026-05-18', comparisonEndDate: '-',
        status: '2', expireDate: '2026-12-01', updateTime: '2026-05-19 09:00:00', supplier: '户外用品厂', spec: '伸缩式',
        images: ['/uploads/img_cu3utr_1779162736788.jpg']
    },
    {
        id: '1006', sampleNo: 'YP-202605006', sampleName: '瑜伽垫-待领用', proposalNo: 'TA-20260506', productManager: '李经理', purchaser: '小王',
        style: '加厚款', mainMaterial: 'TPE', applicableTo: '女性',
        sampleType: '2', source: '2', round: 1, sampleFee: 35.00, receiveDate: '2026-05-10', comparisonEndDate: '-',
        status: '3', expireDate: '2026-11-20', updateTime: '2026-05-18 11:00:00', supplier: '义乌工厂', spec: '紫色，8mm',
        images: ['/uploads/img_j5aan9v_1778732746789.jpg']
    },
    {
        id: '1007', sampleNo: 'YP-202605007', sampleName: '睡袋-已归还', proposalNo: 'TA-20260507', productManager: '张经理', purchaser: '老林',
        style: '信封式', mainMaterial: '中空棉', applicableTo: '露营',
        sampleType: '3', source: '1', round: 1, sampleFee: 85.00, receiveDate: '2026-05-05', comparisonEndDate: '-',
        status: '4', expireDate: '2026-10-15', updateTime: '2026-05-15 15:30:00', supplier: '泰州工厂', spec: '1.5kg',
        images: ['/uploads/img_tdnzw_1778667025096.jpg']
    },
    {
        id: '1008', sampleNo: 'YP-202605008', sampleName: '营地灯-已封存', proposalNo: 'TA-20260508', productManager: '周经理', purchaser: '小赵',
        style: '复古款', mainMaterial: '马口铁', applicableTo: '氛围装饰',
        sampleType: '5', source: '3', round: 2, sampleFee: 45.00, receiveDate: '2026-04-20', comparisonEndDate: '-',
        status: '5', expireDate: '2027-01-01', updateTime: '2026-05-10 14:00:00', supplier: '模具开发部', spec: '暖黄光',
        images: ['/uploads/img_hz9z6_1778667092762.jpg']
    },
    {
        id: '1009', sampleNo: 'YP-202605009', sampleName: '损坏的帐篷-已销毁', proposalNo: 'TA-20260509', productManager: '刘经理', purchaser: '小钱',
        style: '速开款', mainMaterial: '涤纶', applicableTo: '家庭',
        sampleType: '1', source: '2', round: 1, sampleFee: 120.00, receiveDate: '2026-03-15', comparisonEndDate: '-',
        status: '6', expireDate: '-', updateTime: '2026-05-12 09:20:00', supplier: '未知', spec: '支架断裂',
        images: ['/uploads/img_ghw63_1778668026697.jpg']
    },
    {
        id: '1010', sampleNo: 'YP-202605010', sampleName: '失踪的指南针-已遗失', proposalNo: 'TA-20260510', productManager: '吴主管', purchaser: '小孙',
        style: '专业款', mainMaterial: '合金', applicableTo: '徒步',
        sampleType: '6', source: '1', round: 1, sampleFee: 65.00, receiveDate: '2026-04-10', comparisonEndDate: '-',
        status: '7', expireDate: '-', updateTime: '2026-05-14 17:00:00', supplier: '精密仪器厂', spec: '带夜光',
        images: ['/uploads/img_u76obs_1778666482733.jpg']
    },
    {
        id: '1011', sampleNo: 'YP-202605011', sampleName: '内部团购水壶-已内购', proposalNo: 'TA-20260511', productManager: '郑经理', purchaser: '小李',
        style: '运动款', mainMaterial: 'TRITAN', applicableTo: '员工',
        sampleType: '8', source: '1', round: 1, sampleFee: 12.00, receiveDate: '2026-05-01', comparisonEndDate: '-',
        status: '8', expireDate: '-', updateTime: '2026-05-19 16:00:00', supplier: '塑胶制品厂', spec: '1L大容量',
        images: ['/uploads/img_8bcba7_1778667260985.jpg']
    },
    {
        id: '1012', sampleNo: 'YP-202605012', sampleName: '借调库存样品-已退仓', proposalNo: 'TA-20260512', productManager: '吴主管', purchaser: '小赵',
        style: '标准款', mainMaterial: '多种', applicableTo: '对比测试',
        sampleType: '7', source: '1', round: 1, sampleFee: 0.00, receiveDate: '2026-05-01', comparisonEndDate: '2026-05-15',
        status: '12', expireDate: '-', updateTime: '2026-05-16 10:00:00', supplier: '自有仓库', spec: '库存样退回',
        images: ['/uploads/img_bbkk2_1779162323612.jpg']
    },
    {
        id: '1013', sampleNo: 'YP-202605013', sampleName: '供应商样机-已退供', proposalNo: 'TA-20260513', productManager: '陈经理', purchaser: '老林',
        style: '样机', mainMaterial: '金属', applicableTo: '选型',
        sampleType: '8', source: '1', round: 1, sampleFee: 0.00, receiveDate: '2026-05-05', comparisonEndDate: '2026-05-18',
        status: '13', expireDate: '-', updateTime: '2026-05-19 14:00:00', supplier: '华为终端', spec: '测试完毕退还',
        images: ['/uploads/img_bbkk2_1779162323682.jpg']
    },
    {
        id: '1014', sampleNo: 'YP-202605014', sampleName: '逾期未处理测试样', proposalNo: 'TA-20260514', productManager: '吴主管', purchaser: '小钱',
        style: '测试款', mainMaterial: '多种', applicableTo: '过期提醒测试',
        sampleType: '1', source: '1', round: 1, sampleFee: 20.00, receiveDate: '2026-04-10', comparisonEndDate: '-',
        status: '4', expireDate: '2026-05-10', updateTime: '2026-05-10 09:00:00', supplier: '测试厂家', spec: '该样品已过保留期，需及时处理',
        images: []
    }
]);
const tableData = computed(() => {
    let filtered = allData.value;
    // 1. 搜索表单过滤
    if (queryParams.sampleNo) {
        filtered = filtered.filter(item => item.sampleNo.includes(queryParams.sampleNo));
    }
    if (queryParams.proposalNo) {
        filtered = filtered.filter(item => item.proposalNo.includes(queryParams.proposalNo));
    }
    if (queryParams.round) {
        filtered = filtered.filter(item => String(item.round).includes(queryParams.round));
    }
    if (queryParams.sampleName) {
        filtered = filtered.filter(item => item.sampleName.includes(queryParams.sampleName));
    }
    if (queryParams.source) {
        filtered = filtered.filter(item => item.source === queryParams.source);
    }
    if (queryParams.sampleType) {
        filtered = filtered.filter(item => item.sampleType === queryParams.sampleType);
    }
    if (queryParams.status) {
        filtered = filtered.filter(item => item.status === queryParams.status);
    }
    return filtered;
});
const getStatusLabel = (val) => STATUS_MAP[val]?.label || val;
const getStatusType = (val) => STATUS_MAP[val]?.type || 'info';
const getSourceLabel = (val) => SAMPLE_SOURCE.find(s => s.value === val)?.label || val;
const getTypeLabel = (val) => SAMPLE_TYPE.find(t => t.value === val)?.label || val;
const getTypeDesc = (val) => SAMPLE_TYPE.find(t => t.value === val)?.desc || '';
const isComparisonType = (type) => ['6', '7', '8'].includes(type);
const isComparisonDateDelayed = (row) => {
    if (!isComparisonType(row.sampleType))
        return false;
    if (row.comparisonEndDate && row.comparisonEndDate !== '-')
        return false;
    if (!row.receiveDate || row.receiveDate === '-')
        return false;
    const receiveDate = new Date(row.receiveDate);
    if (isNaN(receiveDate.getTime()))
        return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - receiveDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 15;
};
const handleDateUpdate = (row, val) => {
    if (val) {
        ElMessage.success(`样品 ${row.sampleNo} 的对比结束日期已更新为：${val}`);
    }
};
/**
 * 判断保留期限是否异常（过期或3天内即将到期）
 * @param row 样品行数据
 */
const isExpireWarning = (row) => {
    const dateStr = row.expireDate;
    if (!dateStr || dateStr === '-')
        return false;
    // 排除已处理的终态
    if (['6', '7', '8', '12', '13'].includes(row.status))
        return false;
    const expireDate = new Date(dateStr);
    if (isNaN(expireDate.getTime()))
        return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expireDate.setHours(0, 0, 0, 0);
    const diffTime = expireDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
};
const isExpired = (dateStr) => {
    if (!dateStr || dateStr === '-')
        return false;
    const expireDate = new Date(dateStr);
    if (isNaN(expireDate.getTime()))
        return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expireDate.setHours(0, 0, 0, 0);
    return expireDate.getTime() < today.getTime();
};
/**
 * 判断是否即将到期（3天内）
 * 已废弃，改用 isExpireWarning
 */
const isNearExpire = (dateStr) => {
    return false;
};
const handleQuery = () => {
    console.log('查询参数：', queryParams);
};
const resetQuery = () => {
    Object.assign(queryParams, INITIAL_QUERY_PARAMS);
    handleQuery();
};
const handleDetail = (row) => {
    // 注入丰富的模拟数据，确保详情页（预览模式）内容完整
    currentRow.value = {
        ...row,
        isLinkedToProposal: !!row.proposalNo,
        supplierType: '1',
        purchaseUrl: row.source !== '1' ? 'https://detail.1688.com/offer/12345678.html' : '',
        packagingMethod: '盒装',
        packagingQuantity: '1pack',
        hasBattery: false,
        isCE: true,
        initialQuote: row.sampleFee ? row.sampleFee * 0.8 : 0,
        taxRate: 13,
        moq: 500,
        productionCycle: 20,
        description: '此样品为高精密材质打造，专为高端市场设计。经过第一轮内部评估，其耐用性和外观质感均达到行业领先水平。建议作为本季主推款式。',
        details: [
            {
                images: row.images || [],
                pattern: '哑光/拉丝',
                color: '碳黑/银灰',
                spec: '通用',
                length: 24, width: 18, height: 12, sampleSizeUnit: 'cm',
                netWeight: 850, netWeightUnit: 'g',
                pLength: 26, pWidth: 20, pHeight: 14, packagingSizeUnit: 'cm',
                packagingWeight: 1050, packagingWeightUnit: 'g',
                size: 'Standard',
                diameter: 0, diameterUnit: 'cm',
                capacity: 0, capacityUnit: 'ml'
            }
        ]
    };
    // 模拟流转时间轴数据
    const mockTimelines = {
        '1': [
            { content: '待提交', timestamp: row.updateTime, operator: row.purchaser, type: 'info' }
        ],
        '2': [
            { content: '领用中', timestamp: row.updateTime, operator: '业务部-小王', type: 'primary', status: '进行中', statusType: 'warning' },
            { content: '样品入库', timestamp: '2026-05-10 10:00', operator: '仓储组', remark: '质检合格，准予入库' },
            { content: '开发样登记', timestamp: row.receiveDate + ' 09:00', operator: row.purchaser }
        ],
        '3': [
            { content: '待领用', timestamp: row.updateTime, operator: '仓储组', type: 'warning', remark: '样品已归还，等待下次领用' },
            { content: '领用结束', timestamp: '2026-05-15 16:00', operator: '业务部-小王', status: '已归还', statusType: 'success' },
            { content: '样品入库', timestamp: '2026-05-10 10:00', operator: '仓储组' }
        ],
        '4': [
            { content: '已归还', timestamp: row.updateTime, operator: '仓储组', type: 'success' },
            { content: '样品入库', timestamp: '2026-05-06 14:00', operator: '仓储组' },
            { content: '开发样登记', timestamp: row.receiveDate + ' 10:00', operator: row.purchaser }
        ]
    };
    timelineData.value = mockTimelines[row.status] || [
        { content: getStatusLabel(row.status), timestamp: row.updateTime, operator: '系统', type: getStatusType(row.status) },
        { content: '样品入库', timestamp: row.receiveDate + ' 10:00', operator: '仓储组' }
    ];
    detailVisible.value = true;
};
const handleEdit = (row) => {
    editRow.value = row;
    regVisible.value = true;
};
const handleDelete = (row) => {
    ElMessageBox.confirm(`确认删除样品 ${row.sampleNo} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        // 模拟删除逻辑
        const index = allData.value.findIndex(item => item.id === row.id);
        if (index > -1) {
            allData.value.splice(index, 1);
            total.value = allData.value.length;
            ElMessage.success('删除成功');
        }
    }).catch(() => { });
};
// 模拟时间轴数据
const timelineData = ref([]);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-panel modern-card" },
});
const __VLS_0 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    model: (__VLS_ctx.queryParams),
    inline: true,
    size: "small",
    ...{ class: "search-form" },
}));
const __VLS_2 = __VLS_1({
    model: (__VLS_ctx.queryParams),
    inline: true,
    size: "small",
    ...{ class: "search-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    label: "样品编号",
}));
const __VLS_6 = __VLS_5({
    label: "样品编号",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    modelValue: (__VLS_ctx.queryParams.sampleNo),
    placeholder: "请输入编号",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.queryParams.sampleNo),
    placeholder: "请输入编号",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_7;
const __VLS_12 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    label: "样品名称",
}));
const __VLS_14 = __VLS_13({
    label: "样品名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.queryParams.sampleName),
    placeholder: "请输入名称",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.queryParams.sampleName),
    placeholder: "请输入名称",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
var __VLS_15;
const __VLS_20 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    label: "提案编号",
}));
const __VLS_22 = __VLS_21({
    label: "提案编号",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.queryParams.proposalNo),
    placeholder: "请输入提案编号",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.queryParams.proposalNo),
    placeholder: "请输入提案编号",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
var __VLS_23;
const __VLS_28 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "拿样渠道",
}));
const __VLS_30 = __VLS_29({
    label: "拿样渠道",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
const __VLS_32 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.queryParams.source),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.queryParams.source),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.SAMPLE_SOURCE))) {
    const __VLS_36 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        key: (s.value),
        label: (s.label),
        value: (s.value),
    }));
    const __VLS_38 = __VLS_37({
        key: (s.value),
        label: (s.label),
        value: (s.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
}
var __VLS_35;
var __VLS_31;
const __VLS_40 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    label: "样品类型",
}));
const __VLS_42 = __VLS_41({
    label: "样品类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
const __VLS_44 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.queryParams.sampleType),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.queryParams.sampleType),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
for (const [t] of __VLS_getVForSourceType((__VLS_ctx.SAMPLE_TYPE))) {
    const __VLS_48 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        key: (t.value),
        label: (t.label),
        value: (t.value),
    }));
    const __VLS_50 = __VLS_49({
        key: (t.value),
        label: (t.label),
        value: (t.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (t.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ style: {} },
    });
    (t.desc);
    var __VLS_51;
}
var __VLS_47;
var __VLS_43;
const __VLS_52 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "状态",
}));
const __VLS_54 = __VLS_53({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_58 = __VLS_57({
    modelValue: (__VLS_ctx.queryParams.status),
    placeholder: "请选择",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
for (const [s] of __VLS_getVForSourceType((__VLS_ctx.SAMPLE_STATUS))) {
    const __VLS_60 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        key: (s.value),
        label: (s.label),
        value: (s.value),
    }));
    const __VLS_62 = __VLS_61({
        key: (s.value),
        label: (s.label),
        value: (s.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
}
var __VLS_59;
var __VLS_55;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-btns" },
});
const __VLS_64 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_66 = __VLS_65({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_68;
let __VLS_69;
let __VLS_70;
const __VLS_71 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_67.slots.default;
var __VLS_67;
const __VLS_72 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ 'onClick': {} },
}));
const __VLS_74 = __VLS_73({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_76;
let __VLS_77;
let __VLS_78;
const __VLS_79 = {
    onClick: (__VLS_ctx.resetQuery)
};
__VLS_75.slots.default;
var __VLS_75;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "action-toolbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "left" },
});
const __VLS_80 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
    icon: "Plus",
}));
const __VLS_82 = __VLS_81({
    ...{ 'onClick': {} },
    type: "primary",
    size: "small",
    icon: "Plus",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
let __VLS_84;
let __VLS_85;
let __VLS_86;
const __VLS_87 = {
    onClick: (...[$event]) => {
        __VLS_ctx.regVisible = true;
    }
};
__VLS_83.slots.default;
var __VLS_83;
const __VLS_88 = {}.ElDivider;
/** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    direction: "vertical",
}));
const __VLS_90 = __VLS_89({
    direction: "vertical",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const __VLS_92 = {}.ElButtonGroup;
/** @type {[typeof __VLS_components.ElButtonGroup, typeof __VLS_components.elButtonGroup, typeof __VLS_components.ElButtonGroup, typeof __VLS_components.elButtonGroup, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({}));
const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
const __VLS_96 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    ...{ 'onClick': {} },
    size: "small",
    icon: "Download",
    disabled: (!__VLS_ctx.selectedRows?.length),
}));
const __VLS_98 = __VLS_97({
    ...{ 'onClick': {} },
    size: "small",
    icon: "Download",
    disabled: (!__VLS_ctx.selectedRows?.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
let __VLS_100;
let __VLS_101;
let __VLS_102;
const __VLS_103 = {
    onClick: (__VLS_ctx.handleBatchExport)
};
__VLS_99.slots.default;
var __VLS_99;
const __VLS_104 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
    ...{ 'onClick': {} },
    size: "small",
    icon: "Printer",
    disabled: (!__VLS_ctx.selectedRows?.length),
}));
const __VLS_106 = __VLS_105({
    ...{ 'onClick': {} },
    size: "small",
    icon: "Printer",
    disabled: (!__VLS_ctx.selectedRows?.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
let __VLS_108;
let __VLS_109;
let __VLS_110;
const __VLS_111 = {
    onClick: (__VLS_ctx.handleBatchPrint)
};
__VLS_107.slots.default;
var __VLS_107;
var __VLS_95;
const __VLS_112 = {}.ElDropdown;
/** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    ...{ 'onCommand': {} },
    trigger: "click",
    disabled: (!__VLS_ctx.selectedRows?.length),
    ...{ style: {} },
}));
const __VLS_114 = __VLS_113({
    ...{ 'onCommand': {} },
    trigger: "click",
    disabled: (!__VLS_ctx.selectedRows?.length),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
let __VLS_116;
let __VLS_117;
let __VLS_118;
const __VLS_119 = {
    onCommand: (__VLS_ctx.handleBatchStatusChange)
};
__VLS_115.slots.default;
const __VLS_120 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    size: "small",
    type: "warning",
    plain: true,
    icon: "Operation",
    disabled: (!__VLS_ctx.selectedRows?.length),
}));
const __VLS_122 = __VLS_121({
    size: "small",
    type: "warning",
    plain: true,
    icon: "Operation",
    disabled: (!__VLS_ctx.selectedRows?.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
const __VLS_124 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
    ...{ class: "el-icon--right" },
}));
const __VLS_126 = __VLS_125({
    ...{ class: "el-icon--right" },
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
const __VLS_128 = {}.ArrowDown;
/** @type {[typeof __VLS_components.ArrowDown, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({}));
const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
var __VLS_127;
var __VLS_123;
{
    const { dropdown: __VLS_thisSlot } = __VLS_115.slots;
    const __VLS_132 = {}.ElDropdownMenu;
    /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({}));
    const __VLS_134 = __VLS_133({}, ...__VLS_functionalComponentArgsRest(__VLS_133));
    __VLS_135.slots.default;
    const __VLS_136 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
        command: "2",
    }));
    const __VLS_138 = __VLS_137({
        command: "2",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    __VLS_139.slots.default;
    var __VLS_139;
    const __VLS_140 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
        command: "4",
    }));
    const __VLS_142 = __VLS_141({
        command: "4",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    __VLS_143.slots.default;
    var __VLS_143;
    const __VLS_144 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        command: "5",
    }));
    const __VLS_146 = __VLS_145({
        command: "5",
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_147.slots.default;
    var __VLS_147;
    const __VLS_148 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
        command: "6",
    }));
    const __VLS_150 = __VLS_149({
        command: "6",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    __VLS_151.slots.default;
    var __VLS_151;
    const __VLS_152 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
        command: "7",
    }));
    const __VLS_154 = __VLS_153({
        command: "7",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    __VLS_155.slots.default;
    var __VLS_155;
    const __VLS_156 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
        command: "8",
    }));
    const __VLS_158 = __VLS_157({
        command: "8",
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    __VLS_159.slots.default;
    var __VLS_159;
    const __VLS_160 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
        command: "12",
    }));
    const __VLS_162 = __VLS_161({
        command: "12",
    }, ...__VLS_functionalComponentArgsRest(__VLS_161));
    __VLS_163.slots.default;
    var __VLS_163;
    const __VLS_164 = {}.ElDropdownItem;
    /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
        command: "13",
    }));
    const __VLS_166 = __VLS_165({
        command: "13",
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    __VLS_167.slots.default;
    var __VLS_167;
    var __VLS_135;
}
var __VLS_115;
if (__VLS_ctx.selectedRows?.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "selection-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({
        ...{ class: "count" },
    });
    (__VLS_ctx.selectedRows.length);
    const __VLS_168 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        ...{ 'onClick': {} },
        type: "primary",
        underline: (false),
    }));
    const __VLS_170 = __VLS_169({
        ...{ 'onClick': {} },
        type: "primary",
        underline: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    let __VLS_172;
    let __VLS_173;
    let __VLS_174;
    const __VLS_175 = {
        onClick: (__VLS_ctx.clearSelection)
    };
    __VLS_171.slots.default;
    var __VLS_171;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tool-group" },
});
const __VLS_176 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
    ...{ 'onClick': {} },
    title: "刷新",
}));
const __VLS_178 = __VLS_177({
    ...{ 'onClick': {} },
    title: "刷新",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
let __VLS_180;
let __VLS_181;
let __VLS_182;
const __VLS_183 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_179.slots.default;
const __VLS_184 = {}.RefreshRight;
/** @type {[typeof __VLS_components.RefreshRight, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({}));
const __VLS_186 = __VLS_185({}, ...__VLS_functionalComponentArgsRest(__VLS_185));
var __VLS_179;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "table-container modern-card" },
});
const __VLS_188 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    data: (__VLS_ctx.tableData),
    height: (__VLS_ctx.tableHeight),
    size: "small",
    stripe: true,
    headerCellClassName: "modern-header",
    rowClassName: "modern-row",
    highlightCurrentRow: true,
}));
const __VLS_190 = __VLS_189({
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    data: (__VLS_ctx.tableData),
    height: (__VLS_ctx.tableHeight),
    size: "small",
    stripe: true,
    headerCellClassName: "modern-header",
    rowClassName: "modern-row",
    highlightCurrentRow: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
let __VLS_192;
let __VLS_193;
let __VLS_194;
const __VLS_195 = {
    onSelectionChange: (__VLS_ctx.handleSelectionChange)
};
/** @type {typeof __VLS_ctx.multipleTableRef} */ ;
var __VLS_196 = {};
__VLS_191.slots.default;
const __VLS_198 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent(__VLS_198, new __VLS_198({
    type: "selection",
    width: "40",
    align: "center",
    fixed: true,
}));
const __VLS_200 = __VLS_199({
    type: "selection",
    width: "40",
    align: "center",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
const __VLS_202 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({
    type: "index",
    label: "#",
    width: "50",
    align: "center",
    fixed: true,
}));
const __VLS_204 = __VLS_203({
    type: "index",
    label: "#",
    width: "50",
    align: "center",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_203));
const __VLS_206 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
    width: "70",
    align: "center",
    fixed: true,
}));
const __VLS_208 = __VLS_207({
    width: "70",
    align: "center",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_207));
__VLS_209.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_209.slots;
    const __VLS_210 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_211 = __VLS_asFunctionalComponent(__VLS_210, new __VLS_210({}));
    const __VLS_212 = __VLS_211({}, ...__VLS_functionalComponentArgsRest(__VLS_211));
    __VLS_213.slots.default;
    const __VLS_214 = {}.Picture;
    /** @type {[typeof __VLS_components.Picture, ]} */ ;
    // @ts-ignore
    const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({}));
    const __VLS_216 = __VLS_215({}, ...__VLS_functionalComponentArgsRest(__VLS_215));
    var __VLS_213;
}
{
    const { default: __VLS_thisSlot } = __VLS_209.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_218 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    const __VLS_219 = __VLS_asFunctionalComponent(__VLS_218, new __VLS_218({
        src: (row.images?.[0] || 'https://via.placeholder.com/40'),
        ...{ class: "sample-thumb" },
        previewSrcList: (row.images || []),
        previewTeleported: true,
        fit: "cover",
    }));
    const __VLS_220 = __VLS_219({
        src: (row.images?.[0] || 'https://via.placeholder.com/40'),
        ...{ class: "sample-thumb" },
        previewSrcList: (row.images || []),
        previewTeleported: true,
        fit: "cover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_219));
    __VLS_221.slots.default;
    {
        const { error: __VLS_thisSlot } = __VLS_221.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "thumb-placeholder" },
        });
        const __VLS_222 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_223 = __VLS_asFunctionalComponent(__VLS_222, new __VLS_222({}));
        const __VLS_224 = __VLS_223({}, ...__VLS_functionalComponentArgsRest(__VLS_223));
        __VLS_225.slots.default;
        const __VLS_226 = {}.Picture;
        /** @type {[typeof __VLS_components.Picture, ]} */ ;
        // @ts-ignore
        const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({}));
        const __VLS_228 = __VLS_227({}, ...__VLS_functionalComponentArgsRest(__VLS_227));
        var __VLS_225;
    }
    var __VLS_221;
}
var __VLS_209;
const __VLS_230 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_231 = __VLS_asFunctionalComponent(__VLS_230, new __VLS_230({
    label: "样品编号/名称/轮次",
    minWidth: "180",
    fixed: true,
}));
const __VLS_232 = __VLS_231({
    label: "样品编号/名称/轮次",
    minWidth: "180",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_231));
__VLS_233.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_233.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "sample-info-cell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "no" },
    });
    (row.sampleNo);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "round-tag-mini" },
    });
    (row.round);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "name" },
        title: (row.sampleName),
    });
    (row.sampleName);
}
var __VLS_233;
const __VLS_234 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_235 = __VLS_asFunctionalComponent(__VLS_234, new __VLS_234({
    prop: "proposalNo",
    label: "提案编号",
    width: "120",
    showOverflowTooltip: true,
}));
const __VLS_236 = __VLS_235({
    prop: "proposalNo",
    label: "提案编号",
    width: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_235));
const __VLS_238 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({
    prop: "productManager",
    label: "产品经理",
    width: "90",
    align: "center",
}));
const __VLS_240 = __VLS_239({
    prop: "productManager",
    label: "产品经理",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
const __VLS_242 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_243 = __VLS_asFunctionalComponent(__VLS_242, new __VLS_242({
    prop: "purchaser",
    label: "采购员",
    width: "90",
    align: "center",
}));
const __VLS_244 = __VLS_243({
    prop: "purchaser",
    label: "采购员",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_243));
const __VLS_246 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246({
    prop: "style",
    label: "款式",
    width: "90",
    showOverflowTooltip: true,
}));
const __VLS_248 = __VLS_247({
    prop: "style",
    label: "款式",
    width: "90",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_247));
const __VLS_250 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_251 = __VLS_asFunctionalComponent(__VLS_250, new __VLS_250({
    prop: "mainMaterial",
    label: "主材料",
    width: "100",
    showOverflowTooltip: true,
}));
const __VLS_252 = __VLS_251({
    prop: "mainMaterial",
    label: "主材料",
    width: "100",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_251));
const __VLS_254 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_255 = __VLS_asFunctionalComponent(__VLS_254, new __VLS_254({
    prop: "applicableTo",
    label: "适用品牌/对象",
    width: "130",
    showOverflowTooltip: true,
}));
const __VLS_256 = __VLS_255({
    prop: "applicableTo",
    label: "适用品牌/对象",
    width: "130",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_255));
const __VLS_258 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_259 = __VLS_asFunctionalComponent(__VLS_258, new __VLS_258({
    label: "样品类型",
    width: "95",
    align: "center",
}));
const __VLS_260 = __VLS_259({
    label: "样品类型",
    width: "95",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_259));
__VLS_261.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_261.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.getTypeLabel(row.sampleType));
}
var __VLS_261;
const __VLS_262 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({
    prop: "receiveDate",
    label: "样品接收日期",
    width: "110",
    align: "center",
}));
const __VLS_264 = __VLS_263({
    prop: "receiveDate",
    label: "样品接收日期",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_263));
__VLS_265.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_265.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-with-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
{
    const { default: __VLS_thisSlot } = __VLS_265.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ({ 'text-secondary': !row.receiveDate || row.receiveDate === '-' }) },
    });
    (row.receiveDate || '-');
}
var __VLS_265;
const __VLS_266 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_267 = __VLS_asFunctionalComponent(__VLS_266, new __VLS_266({
    prop: "comparisonEndDate",
    label: "对比结束日期",
    width: "130",
    align: "center",
}));
const __VLS_268 = __VLS_267({
    prop: "comparisonEndDate",
    label: "对比结束日期",
    width: "130",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_267));
__VLS_269.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_269.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (__VLS_ctx.isComparisonType(row.sampleType) && (!row.comparisonEndDate || row.comparisonEndDate === '-')) {
        const __VLS_270 = {}.ElDatePicker;
        /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
        // @ts-ignore
        const __VLS_271 = __VLS_asFunctionalComponent(__VLS_270, new __VLS_270({
            ...{ 'onChange': {} },
            modelValue: (row.comparisonEndDate),
            type: "date",
            placeholder: "请选择",
            size: "small",
            valueFormat: "YYYY-MM-DD",
            ...{ style: {} },
        }));
        const __VLS_272 = __VLS_271({
            ...{ 'onChange': {} },
            modelValue: (row.comparisonEndDate),
            type: "date",
            placeholder: "请选择",
            size: "small",
            valueFormat: "YYYY-MM-DD",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_271));
        let __VLS_274;
        let __VLS_275;
        let __VLS_276;
        const __VLS_277 = {
            onChange: ((val) => __VLS_ctx.handleDateUpdate(row, val))
        };
        var __VLS_273;
        if (__VLS_ctx.isComparisonDateDelayed(row)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "warning-text-mini" },
            });
            const __VLS_278 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_279 = __VLS_asFunctionalComponent(__VLS_278, new __VLS_278({}));
            const __VLS_280 = __VLS_279({}, ...__VLS_functionalComponentArgsRest(__VLS_279));
            __VLS_281.slots.default;
            const __VLS_282 = {}.Warning;
            /** @type {[typeof __VLS_components.Warning, ]} */ ;
            // @ts-ignore
            const __VLS_283 = __VLS_asFunctionalComponent(__VLS_282, new __VLS_282({}));
            const __VLS_284 = __VLS_283({}, ...__VLS_functionalComponentArgsRest(__VLS_283));
            var __VLS_281;
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: ({ 'text-secondary': !row.comparisonEndDate || row.comparisonEndDate === '-' }) },
        });
        (row.comparisonEndDate || '-');
    }
}
var __VLS_269;
const __VLS_286 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_287 = __VLS_asFunctionalComponent(__VLS_286, new __VLS_286({
    label: "样品费",
    width: "90",
    align: "right",
}));
const __VLS_288 = __VLS_287({
    label: "样品费",
    width: "90",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_287));
__VLS_289.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_289.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-with-icon j-end" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
{
    const { default: __VLS_thisSlot } = __VLS_289.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "price-text" },
    });
    (row.sampleFee?.toFixed(2));
}
var __VLS_289;
const __VLS_290 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_291 = __VLS_asFunctionalComponent(__VLS_290, new __VLS_290({
    label: "拿样渠道",
    width: "85",
    align: "center",
}));
const __VLS_292 = __VLS_291({
    label: "拿样渠道",
    width: "85",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_291));
__VLS_293.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_293.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "source-tag" },
    });
    (__VLS_ctx.getSourceLabel(row.source));
}
var __VLS_293;
const __VLS_294 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_295 = __VLS_asFunctionalComponent(__VLS_294, new __VLS_294({
    prop: "expireDate",
    label: "保留期限",
    width: "125",
    align: "center",
}));
const __VLS_296 = __VLS_295({
    prop: "expireDate",
    label: "保留期限",
    width: "125",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_295));
__VLS_297.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_297.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-with-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_298 = {}.ElTooltip;
    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_299 = __VLS_asFunctionalComponent(__VLS_298, new __VLS_298({
        placement: "top",
    }));
    const __VLS_300 = __VLS_299({
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_299));
    __VLS_301.slots.default;
    {
        const { content: __VLS_thisSlot } = __VLS_301.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
    }
    const __VLS_302 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_303 = __VLS_asFunctionalComponent(__VLS_302, new __VLS_302({
        ...{ class: "header-help-icon" },
    }));
    const __VLS_304 = __VLS_303({
        ...{ class: "header-help-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_303));
    __VLS_305.slots.default;
    const __VLS_306 = {}.InfoFilled;
    /** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
    // @ts-ignore
    const __VLS_307 = __VLS_asFunctionalComponent(__VLS_306, new __VLS_306({}));
    const __VLS_308 = __VLS_307({}, ...__VLS_functionalComponentArgsRest(__VLS_307));
    var __VLS_305;
    var __VLS_301;
}
{
    const { default: __VLS_thisSlot } = __VLS_297.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "expire-column-cell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "date-val" },
        ...{ class: ({ 'is-warning': __VLS_ctx.isExpireWarning(row) }) },
    });
    (row.expireDate || '-');
    if (__VLS_ctx.isExpired(row.expireDate) && !['6', '7', '8', '12', '13'].includes(row.status)) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "expire-tag" },
        });
    }
}
var __VLS_297;
const __VLS_310 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_311 = __VLS_asFunctionalComponent(__VLS_310, new __VLS_310({
    label: "状态",
    width: "100",
    align: "center",
    fixed: "right",
}));
const __VLS_312 = __VLS_311({
    label: "状态",
    width: "100",
    align: "center",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_311));
__VLS_313.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_313.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "status-cell" },
        ...{ class: ([`status-${row.status}`]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "status-dot" },
        ...{ style: ({ background: __VLS_ctx.STATUS_MAP[row.status]?.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "status-label" },
    });
    (__VLS_ctx.getStatusLabel(row.status));
}
var __VLS_313;
const __VLS_314 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_315 = __VLS_asFunctionalComponent(__VLS_314, new __VLS_314({
    label: "操作",
    width: "160",
    fixed: "right",
    align: "center",
}));
const __VLS_316 = __VLS_315({
    label: "操作",
    width: "160",
    fixed: "right",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_315));
__VLS_317.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_317.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "action-cell-modern" },
    });
    const __VLS_318 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_319 = __VLS_asFunctionalComponent(__VLS_318, new __VLS_318({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_320 = __VLS_319({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_319));
    let __VLS_322;
    let __VLS_323;
    let __VLS_324;
    const __VLS_325 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDetail(row);
        }
    };
    __VLS_321.slots.default;
    var __VLS_321;
    if (row.status === '1') {
        const __VLS_326 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_327 = __VLS_asFunctionalComponent(__VLS_326, new __VLS_326({
            direction: "vertical",
        }));
        const __VLS_328 = __VLS_327({
            direction: "vertical",
        }, ...__VLS_functionalComponentArgsRest(__VLS_327));
        const __VLS_330 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_331 = __VLS_asFunctionalComponent(__VLS_330, new __VLS_330({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
            link: true,
        }));
        const __VLS_332 = __VLS_331({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_331));
        let __VLS_334;
        let __VLS_335;
        let __VLS_336;
        const __VLS_337 = {
            onClick: (...[$event]) => {
                if (!(row.status === '1'))
                    return;
                __VLS_ctx.handleEdit(row);
            }
        };
        __VLS_333.slots.default;
        var __VLS_333;
        const __VLS_338 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_339 = __VLS_asFunctionalComponent(__VLS_338, new __VLS_338({
            direction: "vertical",
        }));
        const __VLS_340 = __VLS_339({
            direction: "vertical",
        }, ...__VLS_functionalComponentArgsRest(__VLS_339));
        const __VLS_342 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_343 = __VLS_asFunctionalComponent(__VLS_342, new __VLS_342({
            ...{ 'onClick': {} },
            type: "danger",
            size: "small",
            link: true,
        }));
        const __VLS_344 = __VLS_343({
            ...{ 'onClick': {} },
            type: "danger",
            size: "small",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_343));
        let __VLS_346;
        let __VLS_347;
        let __VLS_348;
        const __VLS_349 = {
            onClick: (...[$event]) => {
                if (!(row.status === '1'))
                    return;
                __VLS_ctx.handleDelete(row);
            }
        };
        __VLS_345.slots.default;
        var __VLS_345;
    }
    else {
        const __VLS_350 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_351 = __VLS_asFunctionalComponent(__VLS_350, new __VLS_350({
            direction: "vertical",
        }));
        const __VLS_352 = __VLS_351({
            direction: "vertical",
        }, ...__VLS_functionalComponentArgsRest(__VLS_351));
        const __VLS_354 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_355 = __VLS_asFunctionalComponent(__VLS_354, new __VLS_354({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
            link: true,
        }));
        const __VLS_356 = __VLS_355({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_355));
        let __VLS_358;
        let __VLS_359;
        let __VLS_360;
        const __VLS_361 = {
            onClick: (...[$event]) => {
                if (!!(row.status === '1'))
                    return;
                __VLS_ctx.handlePrint(row);
            }
        };
        __VLS_357.slots.default;
        var __VLS_357;
    }
}
var __VLS_317;
var __VLS_191;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination-footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "footer-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "footer-right" },
});
const __VLS_362 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_363 = __VLS_asFunctionalComponent(__VLS_362, new __VLS_362({
    currentPage: (__VLS_ctx.currentPage),
    pageSize: (__VLS_ctx.pageSize),
    pageSizes: ([20, 50, 100]),
    layout: "prev, pager, next, sizes, jumper",
    total: (__VLS_ctx.total),
    background: true,
}));
const __VLS_364 = __VLS_363({
    currentPage: (__VLS_ctx.currentPage),
    pageSize: (__VLS_ctx.pageSize),
    pageSizes: ([20, 50, 100]),
    layout: "prev, pager, next, sizes, jumper",
    total: (__VLS_ctx.total),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_363));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "total-count" },
});
(__VLS_ctx.total);
const __VLS_366 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_367 = __VLS_asFunctionalComponent(__VLS_366, new __VLS_366({
    modelValue: (__VLS_ctx.detailVisible),
    title: "样品详情",
    size: "1400px",
    destroyOnClose: true,
    ...{ class: "premium-detail-drawer" },
}));
const __VLS_368 = __VLS_367({
    modelValue: (__VLS_ctx.detailVisible),
    title: "样品详情",
    size: "1400px",
    destroyOnClose: true,
    ...{ class: "premium-detail-drawer" },
}, ...__VLS_functionalComponentArgsRest(__VLS_367));
__VLS_369.slots.default;
if (__VLS_ctx.currentRow) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-drawer-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-section-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-section-header" },
    });
    const __VLS_370 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_371 = __VLS_asFunctionalComponent(__VLS_370, new __VLS_370({
        ...{ class: "p-section-icon" },
    }));
    const __VLS_372 = __VLS_371({
        ...{ class: "p-section-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_371));
    __VLS_373.slots.default;
    const __VLS_374 = {}.Box;
    /** @type {[typeof __VLS_components.Box, ]} */ ;
    // @ts-ignore
    const __VLS_375 = __VLS_asFunctionalComponent(__VLS_374, new __VLS_374({}));
    const __VLS_376 = __VLS_375({}, ...__VLS_functionalComponentArgsRest(__VLS_375));
    var __VLS_373;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-grid-row responsibility-row" },
    });
    const __VLS_378 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_379 = __VLS_asFunctionalComponent(__VLS_378, new __VLS_378({
        gutter: (20),
    }));
    const __VLS_380 = __VLS_379({
        gutter: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_379));
    __VLS_381.slots.default;
    const __VLS_382 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_383 = __VLS_asFunctionalComponent(__VLS_382, new __VLS_382({
        span: (4),
    }));
    const __VLS_384 = __VLS_383({
        span: (4),
    }, ...__VLS_functionalComponentArgsRest(__VLS_383));
    __VLS_385.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    const __VLS_386 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_387 = __VLS_asFunctionalComponent(__VLS_386, new __VLS_386({
        type: (__VLS_ctx.currentRow.isLinkedToProposal ? 'success' : 'info'),
        size: "small",
    }));
    const __VLS_388 = __VLS_387({
        type: (__VLS_ctx.currentRow.isLinkedToProposal ? 'success' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_387));
    __VLS_389.slots.default;
    (__VLS_ctx.currentRow.isLinkedToProposal ? '是' : '否');
    var __VLS_389;
    var __VLS_385;
    const __VLS_390 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_391 = __VLS_asFunctionalComponent(__VLS_390, new __VLS_390({
        span: (__VLS_ctx.currentRow.isLinkedToProposal ? 8 : 0),
    }));
    const __VLS_392 = __VLS_391({
        span: (__VLS_ctx.currentRow.isLinkedToProposal ? 8 : 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_391));
    __VLS_393.slots.default;
    if (__VLS_ctx.currentRow.isLinkedToProposal) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-detail-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "p-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "p-value highlight" },
        });
        (__VLS_ctx.currentRow.proposalNo);
    }
    var __VLS_393;
    const __VLS_394 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_395 = __VLS_asFunctionalComponent(__VLS_394, new __VLS_394({
        span: (__VLS_ctx.currentRow.isLinkedToProposal ? 6 : 10),
    }));
    const __VLS_396 = __VLS_395({
        span: (__VLS_ctx.currentRow.isLinkedToProposal ? 6 : 10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_395));
    __VLS_397.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.productManager);
    var __VLS_397;
    const __VLS_398 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_399 = __VLS_asFunctionalComponent(__VLS_398, new __VLS_398({
        span: (__VLS_ctx.currentRow.isLinkedToProposal ? 6 : 10),
    }));
    const __VLS_400 = __VLS_399({
        span: (__VLS_ctx.currentRow.isLinkedToProposal ? 6 : 10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_399));
    __VLS_401.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.purchaser);
    var __VLS_401;
    var __VLS_381;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-grid-row" },
    });
    const __VLS_402 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_403 = __VLS_asFunctionalComponent(__VLS_402, new __VLS_402({
        gutter: (32),
    }));
    const __VLS_404 = __VLS_403({
        gutter: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_403));
    __VLS_405.slots.default;
    const __VLS_406 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_407 = __VLS_asFunctionalComponent(__VLS_406, new __VLS_406({
        span: (6),
    }));
    const __VLS_408 = __VLS_407({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_407));
    __VLS_409.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.sampleName);
    var __VLS_409;
    const __VLS_410 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_411 = __VLS_asFunctionalComponent(__VLS_410, new __VLS_410({
        span: (6),
    }));
    const __VLS_412 = __VLS_411({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_411));
    __VLS_413.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.style);
    var __VLS_413;
    const __VLS_414 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_415 = __VLS_asFunctionalComponent(__VLS_414, new __VLS_414({
        span: (6),
    }));
    const __VLS_416 = __VLS_415({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_415));
    __VLS_417.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.mainMaterial);
    var __VLS_417;
    const __VLS_418 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_419 = __VLS_asFunctionalComponent(__VLS_418, new __VLS_418({
        span: (6),
    }));
    const __VLS_420 = __VLS_419({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_419));
    __VLS_421.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.applicableTo);
    var __VLS_421;
    var __VLS_405;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-grid-row" },
    });
    const __VLS_422 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_423 = __VLS_asFunctionalComponent(__VLS_422, new __VLS_422({
        gutter: (32),
    }));
    const __VLS_424 = __VLS_423({
        gutter: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_423));
    __VLS_425.slots.default;
    const __VLS_426 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_427 = __VLS_asFunctionalComponent(__VLS_426, new __VLS_426({
        span: (6),
    }));
    const __VLS_428 = __VLS_427({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_427));
    __VLS_429.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.getTypeLabel(__VLS_ctx.currentRow.sampleType));
    var __VLS_429;
    const __VLS_430 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_431 = __VLS_asFunctionalComponent(__VLS_430, new __VLS_430({
        span: (6),
    }));
    const __VLS_432 = __VLS_431({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_431));
    __VLS_433.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.receiveDate);
    var __VLS_433;
    const __VLS_434 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_435 = __VLS_asFunctionalComponent(__VLS_434, new __VLS_434({
        span: (6),
    }));
    const __VLS_436 = __VLS_435({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_435));
    __VLS_437.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.comparisonEndDate || '-');
    var __VLS_437;
    const __VLS_438 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_439 = __VLS_asFunctionalComponent(__VLS_438, new __VLS_438({
        span: (6),
    }));
    const __VLS_440 = __VLS_439({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_439));
    __VLS_441.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value price" },
    });
    (__VLS_ctx.currentRow.sampleFee?.toFixed(2));
    var __VLS_441;
    var __VLS_425;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-grid-row" },
    });
    const __VLS_442 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_443 = __VLS_asFunctionalComponent(__VLS_442, new __VLS_442({
        gutter: (32),
    }));
    const __VLS_444 = __VLS_443({
        gutter: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_443));
    __VLS_445.slots.default;
    const __VLS_446 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_447 = __VLS_asFunctionalComponent(__VLS_446, new __VLS_446({
        span: (6),
    }));
    const __VLS_448 = __VLS_447({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_447));
    __VLS_449.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.getSourceLabel(__VLS_ctx.currentRow.source));
    var __VLS_449;
    const __VLS_450 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_451 = __VLS_asFunctionalComponent(__VLS_450, new __VLS_450({
        span: (__VLS_ctx.currentRow.source === '1' ? 6 : 0),
    }));
    const __VLS_452 = __VLS_451({
        span: (__VLS_ctx.currentRow.source === '1' ? 6 : 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_451));
    __VLS_453.slots.default;
    if (__VLS_ctx.currentRow.source === '1') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-detail-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "p-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "p-value" },
        });
        (__VLS_ctx.currentRow.supplierType === '1' ? '正式' : '临时');
    }
    var __VLS_453;
    const __VLS_454 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_455 = __VLS_asFunctionalComponent(__VLS_454, new __VLS_454({
        span: (__VLS_ctx.currentRow.source === '1' ? 12 : 18),
    }));
    const __VLS_456 = __VLS_455({
        span: (__VLS_ctx.currentRow.source === '1' ? 12 : 18),
    }, ...__VLS_functionalComponentArgsRest(__VLS_455));
    __VLS_457.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    (__VLS_ctx.currentRow.source === '1' ? '供应商名称' : '购买链接');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.source === '1' ? (__VLS_ctx.currentRow.supplier || '-') : __VLS_ctx.currentRow.purchaseUrl);
    var __VLS_457;
    var __VLS_445;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-grid-row" },
    });
    const __VLS_458 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_459 = __VLS_asFunctionalComponent(__VLS_458, new __VLS_458({
        gutter: (32),
    }));
    const __VLS_460 = __VLS_459({
        gutter: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_459));
    __VLS_461.slots.default;
    const __VLS_462 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_463 = __VLS_asFunctionalComponent(__VLS_462, new __VLS_462({
        span: (6),
    }));
    const __VLS_464 = __VLS_463({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_463));
    __VLS_465.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.packagingMethod || '-');
    var __VLS_465;
    const __VLS_466 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_467 = __VLS_asFunctionalComponent(__VLS_466, new __VLS_466({
        span: (6),
    }));
    const __VLS_468 = __VLS_467({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_467));
    __VLS_469.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.packagingQuantity || '-');
    var __VLS_469;
    const __VLS_470 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_471 = __VLS_asFunctionalComponent(__VLS_470, new __VLS_470({
        span: (6),
    }));
    const __VLS_472 = __VLS_471({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_471));
    __VLS_473.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.hasBattery ? '是' : '否');
    var __VLS_473;
    const __VLS_474 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_475 = __VLS_asFunctionalComponent(__VLS_474, new __VLS_474({
        span: (6),
    }));
    const __VLS_476 = __VLS_475({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_475));
    __VLS_477.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.isCE ? '是' : '否');
    var __VLS_477;
    var __VLS_461;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-grid-row" },
    });
    const __VLS_478 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_479 = __VLS_asFunctionalComponent(__VLS_478, new __VLS_478({
        gutter: (32),
    }));
    const __VLS_480 = __VLS_479({
        gutter: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_479));
    __VLS_481.slots.default;
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.initialQuote?.toFixed(2));
    var __VLS_485;
    const __VLS_486 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_487 = __VLS_asFunctionalComponent(__VLS_486, new __VLS_486({
        span: (6),
    }));
    const __VLS_488 = __VLS_487({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_487));
    __VLS_489.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.taxRate);
    var __VLS_489;
    const __VLS_490 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_491 = __VLS_asFunctionalComponent(__VLS_490, new __VLS_490({
        span: (6),
    }));
    const __VLS_492 = __VLS_491({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_491));
    __VLS_493.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.moq);
    var __VLS_493;
    const __VLS_494 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_495 = __VLS_asFunctionalComponent(__VLS_494, new __VLS_494({
        span: (6),
    }));
    const __VLS_496 = __VLS_495({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_495));
    __VLS_497.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.productionCycle);
    var __VLS_497;
    var __VLS_481;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-grid-row" },
    });
    const __VLS_498 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_499 = __VLS_asFunctionalComponent(__VLS_498, new __VLS_498({
        gutter: (32),
    }));
    const __VLS_500 = __VLS_499({
        gutter: (32),
    }, ...__VLS_functionalComponentArgsRest(__VLS_499));
    __VLS_501.slots.default;
    const __VLS_502 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_503 = __VLS_asFunctionalComponent(__VLS_502, new __VLS_502({
        span: (24),
    }));
    const __VLS_504 = __VLS_503({
        span: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_503));
    __VLS_505.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-detail-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "p-value" },
    });
    (__VLS_ctx.currentRow.description || '-');
    var __VLS_505;
    var __VLS_501;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        id: "section-table",
        ...{ class: "p-section-card no-padding" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-section-header" },
        ...{ style: {} },
    });
    const __VLS_506 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_507 = __VLS_asFunctionalComponent(__VLS_506, new __VLS_506({
        ...{ class: "p-section-icon" },
    }));
    const __VLS_508 = __VLS_507({
        ...{ class: "p-section-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_507));
    __VLS_509.slots.default;
    const __VLS_510 = {}.Setting;
    /** @type {[typeof __VLS_components.Setting, ]} */ ;
    // @ts-ignore
    const __VLS_511 = __VLS_asFunctionalComponent(__VLS_510, new __VLS_510({}));
    const __VLS_512 = __VLS_511({}, ...__VLS_functionalComponentArgsRest(__VLS_511));
    var __VLS_509;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-data-grid" },
    });
    const __VLS_514 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_515 = __VLS_asFunctionalComponent(__VLS_514, new __VLS_514({
        data: (__VLS_ctx.currentRow.details),
        ...{ class: "p-table" },
        border: (false),
        ...{ style: {} },
    }));
    const __VLS_516 = __VLS_515({
        data: (__VLS_ctx.currentRow.details),
        ...{ class: "p-table" },
        border: (false),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_515));
    __VLS_517.slots.default;
    const __VLS_518 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_519 = __VLS_asFunctionalComponent(__VLS_518, new __VLS_518({
        label: "图片",
        width: "100",
        align: "center",
    }));
    const __VLS_520 = __VLS_519({
        label: "图片",
        width: "100",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_519));
    __VLS_521.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_521.slots;
        const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-cell-img-preview" },
        });
        if (scope.row.images?.length) {
            const __VLS_522 = {}.ElImage;
            /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
            // @ts-ignore
            const __VLS_523 = __VLS_asFunctionalComponent(__VLS_522, new __VLS_522({
                src: (scope.row.images[0]),
                previewSrcList: (scope.row.images),
                ...{ class: "p-img-main" },
                fit: "cover",
                previewTeleported: true,
            }));
            const __VLS_524 = __VLS_523({
                src: (scope.row.images[0]),
                previewSrcList: (scope.row.images),
                ...{ class: "p-img-main" },
                fit: "cover",
                previewTeleported: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_523));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "p-img-empty mini" },
            });
            const __VLS_526 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_527 = __VLS_asFunctionalComponent(__VLS_526, new __VLS_526({}));
            const __VLS_528 = __VLS_527({}, ...__VLS_functionalComponentArgsRest(__VLS_527));
            __VLS_529.slots.default;
            const __VLS_530 = {}.Picture;
            /** @type {[typeof __VLS_components.Picture, ]} */ ;
            // @ts-ignore
            const __VLS_531 = __VLS_asFunctionalComponent(__VLS_530, new __VLS_530({}));
            const __VLS_532 = __VLS_531({}, ...__VLS_functionalComponentArgsRest(__VLS_531));
            var __VLS_529;
        }
    }
    var __VLS_521;
    const __VLS_534 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_535 = __VLS_asFunctionalComponent(__VLS_534, new __VLS_534({
        label: "图案",
        prop: "pattern",
        minWidth: "100",
        align: "center",
    }));
    const __VLS_536 = __VLS_535({
        label: "图案",
        prop: "pattern",
        minWidth: "100",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_535));
    const __VLS_538 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_539 = __VLS_asFunctionalComponent(__VLS_538, new __VLS_538({
        label: "颜色",
        prop: "color",
        minWidth: "100",
        align: "center",
    }));
    const __VLS_540 = __VLS_539({
        label: "颜色",
        prop: "color",
        minWidth: "100",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_539));
    const __VLS_542 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_543 = __VLS_asFunctionalComponent(__VLS_542, new __VLS_542({
        label: "规格",
        prop: "spec",
        minWidth: "100",
        align: "center",
    }));
    const __VLS_544 = __VLS_543({
        label: "规格",
        prop: "spec",
        minWidth: "100",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_543));
    const __VLS_546 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_547 = __VLS_asFunctionalComponent(__VLS_546, new __VLS_546({
        label: "样品尺寸",
        minWidth: "160",
        align: "center",
    }));
    const __VLS_548 = __VLS_547({
        label: "样品尺寸",
        minWidth: "160",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_547));
    __VLS_549.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_549.slots;
        const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
        (scope.row.length);
        (scope.row.width);
        (scope.row.height);
        (scope.row.sampleSizeUnit);
    }
    var __VLS_549;
    const __VLS_550 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_551 = __VLS_asFunctionalComponent(__VLS_550, new __VLS_550({
        label: "净重",
        width: "100",
        align: "center",
    }));
    const __VLS_552 = __VLS_551({
        label: "净重",
        width: "100",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_551));
    __VLS_553.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_553.slots;
        const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
        (scope.row.netWeight);
        (scope.row.netWeightUnit);
    }
    var __VLS_553;
    const __VLS_554 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_555 = __VLS_asFunctionalComponent(__VLS_554, new __VLS_554({
        label: "包装尺寸",
        minWidth: "160",
        align: "center",
    }));
    const __VLS_556 = __VLS_555({
        label: "包装尺寸",
        minWidth: "160",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_555));
    __VLS_557.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_557.slots;
        const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
        if (scope.row.pLength) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (scope.row.pLength);
            (scope.row.pWidth);
            (scope.row.pHeight);
            (scope.row.packagingSizeUnit);
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-secondary" },
            });
        }
    }
    var __VLS_557;
    const __VLS_558 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_559 = __VLS_asFunctionalComponent(__VLS_558, new __VLS_558({
        label: "包装重量",
        width: "100",
        align: "center",
    }));
    const __VLS_560 = __VLS_559({
        label: "包装重量",
        width: "100",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_559));
    __VLS_561.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_561.slots;
        const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
        (scope.row.packagingWeight ? scope.row.packagingWeight + scope.row.packagingWeightUnit : '-');
    }
    var __VLS_561;
    const __VLS_562 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_563 = __VLS_asFunctionalComponent(__VLS_562, new __VLS_562({
        label: "尺码",
        prop: "size",
        width: "80",
        align: "center",
    }));
    const __VLS_564 = __VLS_563({
        label: "尺码",
        prop: "size",
        width: "80",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_563));
    const __VLS_566 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_567 = __VLS_asFunctionalComponent(__VLS_566, new __VLS_566({
        label: "直径",
        width: "100",
        align: "center",
    }));
    const __VLS_568 = __VLS_567({
        label: "直径",
        width: "100",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_567));
    __VLS_569.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_569.slots;
        const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
        (scope.row.diameter ? scope.row.diameter + scope.row.diameterUnit : '-');
    }
    var __VLS_569;
    const __VLS_570 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_571 = __VLS_asFunctionalComponent(__VLS_570, new __VLS_570({
        label: "容量",
        width: "100",
        align: "center",
    }));
    const __VLS_572 = __VLS_571({
        label: "容量",
        width: "100",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_571));
    __VLS_573.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_573.slots;
        const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
        (scope.row.capacity ? scope.row.capacity + scope.row.capacityUnit : '-');
    }
    var __VLS_573;
    var __VLS_517;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-section-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-section-header" },
    });
    const __VLS_574 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_575 = __VLS_asFunctionalComponent(__VLS_574, new __VLS_574({
        ...{ class: "p-section-icon" },
    }));
    const __VLS_576 = __VLS_575({
        ...{ class: "p-section-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_575));
    __VLS_577.slots.default;
    const __VLS_578 = {}.List;
    /** @type {[typeof __VLS_components.List, ]} */ ;
    // @ts-ignore
    const __VLS_579 = __VLS_asFunctionalComponent(__VLS_578, new __VLS_578({}));
    const __VLS_580 = __VLS_579({}, ...__VLS_functionalComponentArgsRest(__VLS_579));
    var __VLS_577;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    /** @type {[typeof SampleTimeline, ]} */ ;
    // @ts-ignore
    const __VLS_582 = __VLS_asFunctionalComponent(SampleTimeline, new SampleTimeline({
        data: (__VLS_ctx.timelineData),
        currentStatus: (__VLS_ctx.currentRow.status),
    }));
    const __VLS_583 = __VLS_582({
        data: (__VLS_ctx.timelineData),
        currentStatus: (__VLS_ctx.currentRow.status),
    }, ...__VLS_functionalComponentArgsRest(__VLS_582));
}
var __VLS_369;
/** @type {[typeof RegistrationDialog, ]} */ ;
// @ts-ignore
const __VLS_585 = __VLS_asFunctionalComponent(RegistrationDialog, new RegistrationDialog({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.regVisible),
}));
const __VLS_586 = __VLS_585({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.regVisible),
}, ...__VLS_functionalComponentArgsRest(__VLS_585));
let __VLS_588;
let __VLS_589;
let __VLS_590;
const __VLS_591 = {
    onRefresh: (__VLS_ctx.handleQuery)
};
var __VLS_587;
/** @type {[typeof TestEvaluationDialog, ]} */ ;
// @ts-ignore
const __VLS_592 = __VLS_asFunctionalComponent(TestEvaluationDialog, new TestEvaluationDialog({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.testVisible),
    sampleData: (__VLS_ctx.currentRow),
}));
const __VLS_593 = __VLS_592({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.testVisible),
    sampleData: (__VLS_ctx.currentRow),
}, ...__VLS_functionalComponentArgsRest(__VLS_592));
let __VLS_595;
let __VLS_596;
let __VLS_597;
const __VLS_598 = {
    onRefresh: (__VLS_ctx.handleQuery)
};
var __VLS_594;
/** @type {[typeof BatchStatusDialog, ]} */ ;
// @ts-ignore
const __VLS_599 = __VLS_asFunctionalComponent(BatchStatusDialog, new BatchStatusDialog({
    ...{ 'onConfirm': {} },
    modelValue: (__VLS_ctx.batchStatusVisible),
    targetStatus: (__VLS_ctx.targetStatus),
    selectedCount: (__VLS_ctx.selectedRows.length),
}));
const __VLS_600 = __VLS_599({
    ...{ 'onConfirm': {} },
    modelValue: (__VLS_ctx.batchStatusVisible),
    targetStatus: (__VLS_ctx.targetStatus),
    selectedCount: (__VLS_ctx.selectedRows.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_599));
let __VLS_602;
let __VLS_603;
let __VLS_604;
const __VLS_605 = {
    onConfirm: (__VLS_ctx.handleBatchStatusConfirm)
};
var __VLS_601;
/** @type {__VLS_StyleScopedClasses['page-container']} */ ;
/** @type {__VLS_StyleScopedClasses['search-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['modern-card']} */ ;
/** @type {__VLS_StyleScopedClasses['search-form']} */ ;
/** @type {__VLS_StyleScopedClasses['search-btns']} */ ;
/** @type {__VLS_StyleScopedClasses['action-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
/** @type {__VLS_StyleScopedClasses['selection-info']} */ ;
/** @type {__VLS_StyleScopedClasses['count']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['tool-group']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['modern-card']} */ ;
/** @type {__VLS_StyleScopedClasses['sample-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['thumb-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['sample-info-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['no']} */ ;
/** @type {__VLS_StyleScopedClasses['round-tag-mini']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['header-with-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['warning-text-mini']} */ ;
/** @type {__VLS_StyleScopedClasses['header-with-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['j-end']} */ ;
/** @type {__VLS_StyleScopedClasses['price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['source-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['header-with-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['header-help-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['expire-column-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['date-val']} */ ;
/** @type {__VLS_StyleScopedClasses['expire-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['status-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['status-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['status-label']} */ ;
/** @type {__VLS_StyleScopedClasses['action-cell-modern']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-left']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-right']} */ ;
/** @type {__VLS_StyleScopedClasses['total-count']} */ ;
/** @type {__VLS_StyleScopedClasses['premium-detail-drawer']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-drawer-content']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['p-grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['responsibility-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
/** @type {__VLS_StyleScopedClasses['p-grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-grid-row']} */ ;
/** @type {__VLS_StyleScopedClasses['p-detail-item']} */ ;
/** @type {__VLS_StyleScopedClasses['p-label']} */ ;
/** @type {__VLS_StyleScopedClasses['p-value']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['no-padding']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['p-data-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['p-table']} */ ;
/** @type {__VLS_StyleScopedClasses['p-cell-img-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['p-img-main']} */ ;
/** @type {__VLS_StyleScopedClasses['p-img-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['mini']} */ ;
/** @type {__VLS_StyleScopedClasses['text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-icon']} */ ;
// @ts-ignore
var __VLS_197 = __VLS_196;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SAMPLE_STATUS: SAMPLE_STATUS,
            SAMPLE_SOURCE: SAMPLE_SOURCE,
            SAMPLE_TYPE: SAMPLE_TYPE,
            STATUS_MAP: STATUS_MAP,
            RegistrationDialog: RegistrationDialog,
            TestEvaluationDialog: TestEvaluationDialog,
            BatchStatusDialog: BatchStatusDialog,
            SampleTimeline: SampleTimeline,
            tableHeight: tableHeight,
            queryParams: queryParams,
            currentPage: currentPage,
            pageSize: pageSize,
            total: total,
            multipleTableRef: multipleTableRef,
            regVisible: regVisible,
            testVisible: testVisible,
            batchStatusVisible: batchStatusVisible,
            targetStatus: targetStatus,
            detailVisible: detailVisible,
            currentRow: currentRow,
            selectedRows: selectedRows,
            handleSelectionChange: handleSelectionChange,
            clearSelection: clearSelection,
            handleBatchExport: handleBatchExport,
            handleBatchPrint: handleBatchPrint,
            handleBatchStatusChange: handleBatchStatusChange,
            handleBatchStatusConfirm: handleBatchStatusConfirm,
            handlePrint: handlePrint,
            tableData: tableData,
            getStatusLabel: getStatusLabel,
            getSourceLabel: getSourceLabel,
            getTypeLabel: getTypeLabel,
            isComparisonType: isComparisonType,
            isComparisonDateDelayed: isComparisonDateDelayed,
            handleDateUpdate: handleDateUpdate,
            isExpireWarning: isExpireWarning,
            isExpired: isExpired,
            handleQuery: handleQuery,
            resetQuery: resetQuery,
            handleDetail: handleDetail,
            handleEdit: handleEdit,
            handleDelete: handleDelete,
            timelineData: timelineData,
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