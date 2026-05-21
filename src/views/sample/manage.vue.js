/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus';
import axios from 'axios';
import { useTableHeight } from '@/hooks/useTableHeight';
import { SAMPLE_STATUS, SAMPLE_SOURCE, SAMPLE_TYPE, INITIAL_QUERY_PARAMS, STATUS_MAP } from './constants';
import RegistrationDialog from './components/RegistrationDialog.vue';
import TestEvaluationDialog from './components/TestEvaluationDialog.vue';
import SampleTimeline from './components/SampleTimeline.vue';
const tableHeight = useTableHeight(190);
const queryParams = reactive({ ...INITIAL_QUERY_PARAMS });
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(5);
const multipleTableRef = ref();
const regVisible = ref(false);
const testVisible = ref(false);
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
        id: '1001', sampleNo: 'YP-202605001', sampleName: '户外牧羊人钩-待提交', proposalNo: 'TA-20260501', productManager: '张三', purchaser: '李四',
        style: '经典款', mainMaterial: '不锈钢', applicableTo: '亚马逊/自营',
        sampleType: '1', source: '1', round: 1, sampleFee: 50.00, receiveDate: '2026-05-09', comparisonEndDate: '-',
        status: '1', expireDate: '2026-12-31', updateTime: '2026-05-09 10:00:00', supplier: '晨光文具', spec: '不锈钢材质',
        images: ['/uploads/img_2c4gj_1778668130970.jpg', '/uploads/img_2c4gj_1778668144849.jpg']
    },
    {
        id: '1005', sampleNo: 'YP-202605005', sampleName: '登山杖-领用中', proposalNo: 'TA-20260505', productManager: '张三', purchaser: '李四',
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
    currentRow.value = row;
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
    label: "轮次",
}));
const __VLS_14 = __VLS_13({
    label: "轮次",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    modelValue: (__VLS_ctx.queryParams.round),
    placeholder: "轮次",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_18 = __VLS_17({
    modelValue: (__VLS_ctx.queryParams.round),
    placeholder: "轮次",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
var __VLS_15;
const __VLS_20 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    label: "样品名称",
}));
const __VLS_22 = __VLS_21({
    label: "样品名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    modelValue: (__VLS_ctx.queryParams.sampleName),
    placeholder: "请输入名称",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.queryParams.sampleName),
    placeholder: "请输入名称",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
var __VLS_23;
const __VLS_28 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "样品来源",
}));
const __VLS_30 = __VLS_29({
    label: "样品来源",
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
if (__VLS_ctx.selectedRows?.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "selection-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({
        ...{ class: "count" },
    });
    (__VLS_ctx.selectedRows.length);
    const __VLS_112 = {}.ElLink;
    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        ...{ 'onClick': {} },
        type: "primary",
        underline: (false),
    }));
    const __VLS_114 = __VLS_113({
        ...{ 'onClick': {} },
        type: "primary",
        underline: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    let __VLS_116;
    let __VLS_117;
    let __VLS_118;
    const __VLS_119 = {
        onClick: (__VLS_ctx.clearSelection)
    };
    __VLS_115.slots.default;
    var __VLS_115;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tool-group" },
});
const __VLS_120 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    ...{ 'onClick': {} },
    title: "刷新",
}));
const __VLS_122 = __VLS_121({
    ...{ 'onClick': {} },
    title: "刷新",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
let __VLS_124;
let __VLS_125;
let __VLS_126;
const __VLS_127 = {
    onClick: (__VLS_ctx.handleQuery)
};
__VLS_123.slots.default;
const __VLS_128 = {}.RefreshRight;
/** @type {[typeof __VLS_components.RefreshRight, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({}));
const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
var __VLS_123;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "table-container modern-card" },
});
const __VLS_132 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
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
const __VLS_134 = __VLS_133({
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    data: (__VLS_ctx.tableData),
    height: (__VLS_ctx.tableHeight),
    size: "small",
    stripe: true,
    headerCellClassName: "modern-header",
    rowClassName: "modern-row",
    highlightCurrentRow: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
let __VLS_136;
let __VLS_137;
let __VLS_138;
const __VLS_139 = {
    onSelectionChange: (__VLS_ctx.handleSelectionChange)
};
/** @type {typeof __VLS_ctx.multipleTableRef} */ ;
var __VLS_140 = {};
__VLS_135.slots.default;
const __VLS_142 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent(__VLS_142, new __VLS_142({
    type: "selection",
    width: "40",
    align: "center",
    fixed: true,
}));
const __VLS_144 = __VLS_143({
    type: "selection",
    width: "40",
    align: "center",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
const __VLS_146 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent(__VLS_146, new __VLS_146({
    type: "index",
    label: "#",
    width: "50",
    align: "center",
    fixed: true,
}));
const __VLS_148 = __VLS_147({
    type: "index",
    label: "#",
    width: "50",
    align: "center",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
const __VLS_150 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent(__VLS_150, new __VLS_150({
    width: "70",
    align: "center",
    fixed: true,
}));
const __VLS_152 = __VLS_151({
    width: "70",
    align: "center",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
__VLS_153.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_153.slots;
    const __VLS_154 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({}));
    const __VLS_156 = __VLS_155({}, ...__VLS_functionalComponentArgsRest(__VLS_155));
    __VLS_157.slots.default;
    const __VLS_158 = {}.Picture;
    /** @type {[typeof __VLS_components.Picture, ]} */ ;
    // @ts-ignore
    const __VLS_159 = __VLS_asFunctionalComponent(__VLS_158, new __VLS_158({}));
    const __VLS_160 = __VLS_159({}, ...__VLS_functionalComponentArgsRest(__VLS_159));
    var __VLS_157;
}
{
    const { default: __VLS_thisSlot } = __VLS_153.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_162 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent(__VLS_162, new __VLS_162({
        src: (row.images?.[0] || 'https://via.placeholder.com/40'),
        ...{ class: "sample-thumb" },
        previewSrcList: (row.images || []),
        previewTeleported: true,
        fit: "cover",
    }));
    const __VLS_164 = __VLS_163({
        src: (row.images?.[0] || 'https://via.placeholder.com/40'),
        ...{ class: "sample-thumb" },
        previewSrcList: (row.images || []),
        previewTeleported: true,
        fit: "cover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    __VLS_165.slots.default;
    {
        const { error: __VLS_thisSlot } = __VLS_165.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "thumb-placeholder" },
        });
        const __VLS_166 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_167 = __VLS_asFunctionalComponent(__VLS_166, new __VLS_166({}));
        const __VLS_168 = __VLS_167({}, ...__VLS_functionalComponentArgsRest(__VLS_167));
        __VLS_169.slots.default;
        const __VLS_170 = {}.Picture;
        /** @type {[typeof __VLS_components.Picture, ]} */ ;
        // @ts-ignore
        const __VLS_171 = __VLS_asFunctionalComponent(__VLS_170, new __VLS_170({}));
        const __VLS_172 = __VLS_171({}, ...__VLS_functionalComponentArgsRest(__VLS_171));
        var __VLS_169;
    }
    var __VLS_165;
}
var __VLS_153;
const __VLS_174 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_175 = __VLS_asFunctionalComponent(__VLS_174, new __VLS_174({
    label: "样品编号/名称/轮次",
    minWidth: "180",
    fixed: true,
}));
const __VLS_176 = __VLS_175({
    label: "样品编号/名称/轮次",
    minWidth: "180",
    fixed: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_175));
__VLS_177.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_177.slots;
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
var __VLS_177;
const __VLS_178 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_179 = __VLS_asFunctionalComponent(__VLS_178, new __VLS_178({
    prop: "proposalNo",
    label: "提案编号",
    width: "120",
    showOverflowTooltip: true,
}));
const __VLS_180 = __VLS_179({
    prop: "proposalNo",
    label: "提案编号",
    width: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_179));
const __VLS_182 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_183 = __VLS_asFunctionalComponent(__VLS_182, new __VLS_182({
    prop: "productManager",
    label: "产品经理",
    width: "90",
    align: "center",
}));
const __VLS_184 = __VLS_183({
    prop: "productManager",
    label: "产品经理",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_183));
const __VLS_186 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_187 = __VLS_asFunctionalComponent(__VLS_186, new __VLS_186({
    prop: "purchaser",
    label: "采购员",
    width: "90",
    align: "center",
}));
const __VLS_188 = __VLS_187({
    prop: "purchaser",
    label: "采购员",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_187));
const __VLS_190 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_191 = __VLS_asFunctionalComponent(__VLS_190, new __VLS_190({
    prop: "style",
    label: "款式",
    width: "90",
    showOverflowTooltip: true,
}));
const __VLS_192 = __VLS_191({
    prop: "style",
    label: "款式",
    width: "90",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_191));
const __VLS_194 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent(__VLS_194, new __VLS_194({
    prop: "mainMaterial",
    label: "主材料",
    width: "100",
    showOverflowTooltip: true,
}));
const __VLS_196 = __VLS_195({
    prop: "mainMaterial",
    label: "主材料",
    width: "100",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
const __VLS_198 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent(__VLS_198, new __VLS_198({
    prop: "applicableTo",
    label: "适用品牌/对象",
    width: "130",
    showOverflowTooltip: true,
}));
const __VLS_200 = __VLS_199({
    prop: "applicableTo",
    label: "适用品牌/对象",
    width: "130",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
const __VLS_202 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_203 = __VLS_asFunctionalComponent(__VLS_202, new __VLS_202({
    label: "样品类型",
    width: "95",
    align: "center",
}));
const __VLS_204 = __VLS_203({
    label: "样品类型",
    width: "95",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_203));
__VLS_205.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_205.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.getTypeLabel(row.sampleType));
}
var __VLS_205;
const __VLS_206 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_207 = __VLS_asFunctionalComponent(__VLS_206, new __VLS_206({
    prop: "receiveDate",
    label: "样品接收日期",
    width: "110",
    align: "center",
}));
const __VLS_208 = __VLS_207({
    prop: "receiveDate",
    label: "样品接收日期",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_207));
__VLS_209.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_209.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-with-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
{
    const { default: __VLS_thisSlot } = __VLS_209.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ({ 'text-secondary': !row.receiveDate || row.receiveDate === '-' }) },
    });
    (row.receiveDate || '-');
}
var __VLS_209;
const __VLS_210 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_211 = __VLS_asFunctionalComponent(__VLS_210, new __VLS_210({
    prop: "comparisonEndDate",
    label: "对比结束日期",
    width: "130",
    align: "center",
}));
const __VLS_212 = __VLS_211({
    prop: "comparisonEndDate",
    label: "对比结束日期",
    width: "130",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_211));
__VLS_213.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_213.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (__VLS_ctx.isComparisonType(row.sampleType) && (!row.comparisonEndDate || row.comparisonEndDate === '-')) {
        const __VLS_214 = {}.ElDatePicker;
        /** @type {[typeof __VLS_components.ElDatePicker, typeof __VLS_components.elDatePicker, ]} */ ;
        // @ts-ignore
        const __VLS_215 = __VLS_asFunctionalComponent(__VLS_214, new __VLS_214({
            ...{ 'onChange': {} },
            modelValue: (row.comparisonEndDate),
            type: "date",
            placeholder: "请选择",
            size: "small",
            valueFormat: "YYYY-MM-DD",
            ...{ style: {} },
        }));
        const __VLS_216 = __VLS_215({
            ...{ 'onChange': {} },
            modelValue: (row.comparisonEndDate),
            type: "date",
            placeholder: "请选择",
            size: "small",
            valueFormat: "YYYY-MM-DD",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_215));
        let __VLS_218;
        let __VLS_219;
        let __VLS_220;
        const __VLS_221 = {
            onChange: ((val) => __VLS_ctx.handleDateUpdate(row, val))
        };
        var __VLS_217;
        if (__VLS_ctx.isComparisonDateDelayed(row)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "warning-text-mini" },
            });
            const __VLS_222 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_223 = __VLS_asFunctionalComponent(__VLS_222, new __VLS_222({}));
            const __VLS_224 = __VLS_223({}, ...__VLS_functionalComponentArgsRest(__VLS_223));
            __VLS_225.slots.default;
            const __VLS_226 = {}.Warning;
            /** @type {[typeof __VLS_components.Warning, ]} */ ;
            // @ts-ignore
            const __VLS_227 = __VLS_asFunctionalComponent(__VLS_226, new __VLS_226({}));
            const __VLS_228 = __VLS_227({}, ...__VLS_functionalComponentArgsRest(__VLS_227));
            var __VLS_225;
        }
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: ({ 'text-secondary': !row.comparisonEndDate || row.comparisonEndDate === '-' }) },
        });
        (row.comparisonEndDate || '-');
    }
}
var __VLS_213;
const __VLS_230 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_231 = __VLS_asFunctionalComponent(__VLS_230, new __VLS_230({
    label: "样品费",
    width: "90",
    align: "right",
}));
const __VLS_232 = __VLS_231({
    label: "样品费",
    width: "90",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_231));
__VLS_233.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_233.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-with-icon j-end" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
{
    const { default: __VLS_thisSlot } = __VLS_233.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "price-text" },
    });
    (row.sampleFee?.toFixed(2));
}
var __VLS_233;
const __VLS_234 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_235 = __VLS_asFunctionalComponent(__VLS_234, new __VLS_234({
    label: "渠道",
    width: "85",
    align: "center",
}));
const __VLS_236 = __VLS_235({
    label: "渠道",
    width: "85",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_235));
__VLS_237.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_237.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "source-tag" },
    });
    (__VLS_ctx.getSourceLabel(row.source));
}
var __VLS_237;
const __VLS_238 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent(__VLS_238, new __VLS_238({
    prop: "expireDate",
    label: "保留期限",
    width: "125",
    align: "center",
}));
const __VLS_240 = __VLS_239({
    prop: "expireDate",
    label: "保留期限",
    width: "125",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
__VLS_241.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_241.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-with-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_242 = {}.ElTooltip;
    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_243 = __VLS_asFunctionalComponent(__VLS_242, new __VLS_242({
        placement: "top",
    }));
    const __VLS_244 = __VLS_243({
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_243));
    __VLS_245.slots.default;
    {
        const { content: __VLS_thisSlot } = __VLS_245.slots;
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
    const __VLS_246 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_247 = __VLS_asFunctionalComponent(__VLS_246, new __VLS_246({
        ...{ class: "header-help-icon" },
    }));
    const __VLS_248 = __VLS_247({
        ...{ class: "header-help-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_247));
    __VLS_249.slots.default;
    const __VLS_250 = {}.InfoFilled;
    /** @type {[typeof __VLS_components.InfoFilled, ]} */ ;
    // @ts-ignore
    const __VLS_251 = __VLS_asFunctionalComponent(__VLS_250, new __VLS_250({}));
    const __VLS_252 = __VLS_251({}, ...__VLS_functionalComponentArgsRest(__VLS_251));
    var __VLS_249;
    var __VLS_245;
}
{
    const { default: __VLS_thisSlot } = __VLS_241.slots;
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
var __VLS_241;
const __VLS_254 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_255 = __VLS_asFunctionalComponent(__VLS_254, new __VLS_254({
    label: "状态",
    width: "100",
    align: "center",
    fixed: "right",
}));
const __VLS_256 = __VLS_255({
    label: "状态",
    width: "100",
    align: "center",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_255));
__VLS_257.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_257.slots;
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
var __VLS_257;
const __VLS_258 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_259 = __VLS_asFunctionalComponent(__VLS_258, new __VLS_258({
    label: "操作",
    width: "130",
    fixed: "right",
    align: "center",
}));
const __VLS_260 = __VLS_259({
    label: "操作",
    width: "130",
    fixed: "right",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_259));
__VLS_261.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_261.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "action-cell-modern" },
    });
    const __VLS_262 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_263 = __VLS_asFunctionalComponent(__VLS_262, new __VLS_262({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_264 = __VLS_263({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_263));
    let __VLS_266;
    let __VLS_267;
    let __VLS_268;
    const __VLS_269 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDetail(row);
        }
    };
    __VLS_265.slots.default;
    var __VLS_265;
    if (row.status === '1') {
        const __VLS_270 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_271 = __VLS_asFunctionalComponent(__VLS_270, new __VLS_270({
            direction: "vertical",
        }));
        const __VLS_272 = __VLS_271({
            direction: "vertical",
        }, ...__VLS_functionalComponentArgsRest(__VLS_271));
        const __VLS_274 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_275 = __VLS_asFunctionalComponent(__VLS_274, new __VLS_274({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
            link: true,
        }));
        const __VLS_276 = __VLS_275({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_275));
        let __VLS_278;
        let __VLS_279;
        let __VLS_280;
        const __VLS_281 = {
            onClick: (...[$event]) => {
                if (!(row.status === '1'))
                    return;
                __VLS_ctx.handleEdit(row);
            }
        };
        __VLS_277.slots.default;
        var __VLS_277;
        const __VLS_282 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_283 = __VLS_asFunctionalComponent(__VLS_282, new __VLS_282({
            direction: "vertical",
        }));
        const __VLS_284 = __VLS_283({
            direction: "vertical",
        }, ...__VLS_functionalComponentArgsRest(__VLS_283));
        const __VLS_286 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_287 = __VLS_asFunctionalComponent(__VLS_286, new __VLS_286({
            ...{ 'onClick': {} },
            type: "danger",
            size: "small",
            link: true,
        }));
        const __VLS_288 = __VLS_287({
            ...{ 'onClick': {} },
            type: "danger",
            size: "small",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_287));
        let __VLS_290;
        let __VLS_291;
        let __VLS_292;
        const __VLS_293 = {
            onClick: (...[$event]) => {
                if (!(row.status === '1'))
                    return;
                __VLS_ctx.handleDelete(row);
            }
        };
        __VLS_289.slots.default;
        var __VLS_289;
    }
    else {
        const __VLS_294 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_295 = __VLS_asFunctionalComponent(__VLS_294, new __VLS_294({
            direction: "vertical",
        }));
        const __VLS_296 = __VLS_295({
            direction: "vertical",
        }, ...__VLS_functionalComponentArgsRest(__VLS_295));
        const __VLS_298 = {}.ElDropdown;
        /** @type {[typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, typeof __VLS_components.ElDropdown, typeof __VLS_components.elDropdown, ]} */ ;
        // @ts-ignore
        const __VLS_299 = __VLS_asFunctionalComponent(__VLS_298, new __VLS_298({
            trigger: "click",
        }));
        const __VLS_300 = __VLS_299({
            trigger: "click",
        }, ...__VLS_functionalComponentArgsRest(__VLS_299));
        __VLS_301.slots.default;
        const __VLS_302 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_303 = __VLS_asFunctionalComponent(__VLS_302, new __VLS_302({
            link: true,
            type: "primary",
            size: "small",
        }));
        const __VLS_304 = __VLS_303({
            link: true,
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_303));
        __VLS_305.slots.default;
        var __VLS_305;
        {
            const { dropdown: __VLS_thisSlot } = __VLS_301.slots;
            const __VLS_306 = {}.ElDropdownMenu;
            /** @type {[typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, typeof __VLS_components.ElDropdownMenu, typeof __VLS_components.elDropdownMenu, ]} */ ;
            // @ts-ignore
            const __VLS_307 = __VLS_asFunctionalComponent(__VLS_306, new __VLS_306({
                ...{ class: "p-dropdown" },
            }));
            const __VLS_308 = __VLS_307({
                ...{ class: "p-dropdown" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_307));
            __VLS_309.slots.default;
            const __VLS_310 = {}.ElDropdownItem;
            /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
            // @ts-ignore
            const __VLS_311 = __VLS_asFunctionalComponent(__VLS_310, new __VLS_310({
                icon: "Refresh",
            }));
            const __VLS_312 = __VLS_311({
                icon: "Refresh",
            }, ...__VLS_functionalComponentArgsRest(__VLS_311));
            __VLS_313.slots.default;
            var __VLS_313;
            const __VLS_314 = {}.ElDropdownItem;
            /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
            // @ts-ignore
            const __VLS_315 = __VLS_asFunctionalComponent(__VLS_314, new __VLS_314({
                ...{ 'onClick': {} },
                icon: "Printer",
            }));
            const __VLS_316 = __VLS_315({
                ...{ 'onClick': {} },
                icon: "Printer",
            }, ...__VLS_functionalComponentArgsRest(__VLS_315));
            let __VLS_318;
            let __VLS_319;
            let __VLS_320;
            const __VLS_321 = {
                onClick: (...[$event]) => {
                    if (!!(row.status === '1'))
                        return;
                    __VLS_ctx.handlePrint(row);
                }
            };
            __VLS_317.slots.default;
            var __VLS_317;
            const __VLS_322 = {}.ElDropdownItem;
            /** @type {[typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, typeof __VLS_components.ElDropdownItem, typeof __VLS_components.elDropdownItem, ]} */ ;
            // @ts-ignore
            const __VLS_323 = __VLS_asFunctionalComponent(__VLS_322, new __VLS_322({
                icon: "List",
            }));
            const __VLS_324 = __VLS_323({
                icon: "List",
            }, ...__VLS_functionalComponentArgsRest(__VLS_323));
            __VLS_325.slots.default;
            var __VLS_325;
            var __VLS_309;
        }
        var __VLS_301;
    }
}
var __VLS_261;
var __VLS_135;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pagination-footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "footer-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "footer-right" },
});
const __VLS_326 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_327 = __VLS_asFunctionalComponent(__VLS_326, new __VLS_326({
    currentPage: (__VLS_ctx.currentPage),
    pageSize: (__VLS_ctx.pageSize),
    pageSizes: ([20, 50, 100]),
    layout: "prev, pager, next, sizes, jumper",
    total: (__VLS_ctx.total),
    background: true,
}));
const __VLS_328 = __VLS_327({
    currentPage: (__VLS_ctx.currentPage),
    pageSize: (__VLS_ctx.pageSize),
    pageSizes: ([20, 50, 100]),
    layout: "prev, pager, next, sizes, jumper",
    total: (__VLS_ctx.total),
    background: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_327));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "total-count" },
});
(__VLS_ctx.total);
const __VLS_330 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_331 = __VLS_asFunctionalComponent(__VLS_330, new __VLS_330({
    modelValue: (__VLS_ctx.detailVisible),
    title: "样品详情",
    size: "700px",
    destroyOnClose: true,
    customClass: "premium-detail-drawer",
}));
const __VLS_332 = __VLS_331({
    modelValue: (__VLS_ctx.detailVisible),
    title: "样品详情",
    size: "700px",
    destroyOnClose: true,
    customClass: "premium-detail-drawer",
}, ...__VLS_functionalComponentArgsRest(__VLS_331));
__VLS_333.slots.default;
if (__VLS_ctx.currentRow) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-wrapper" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-header-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "sample-main-info" },
    });
    const __VLS_334 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    const __VLS_335 = __VLS_asFunctionalComponent(__VLS_334, new __VLS_334({
        src: (__VLS_ctx.currentRow.images?.[0] || 'https://via.placeholder.com/100'),
        ...{ class: "detail-main-img" },
        previewSrcList: (__VLS_ctx.currentRow.images || []),
    }));
    const __VLS_336 = __VLS_335({
        src: (__VLS_ctx.currentRow.images?.[0] || 'https://via.placeholder.com/100'),
        ...{ class: "detail-main-img" },
        previewSrcList: (__VLS_ctx.currentRow.images || []),
    }, ...__VLS_functionalComponentArgsRest(__VLS_335));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "name" },
    });
    (__VLS_ctx.currentRow.sampleName);
    const __VLS_338 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_339 = __VLS_asFunctionalComponent(__VLS_338, new __VLS_338({
        type: (__VLS_ctx.getStatusType(__VLS_ctx.currentRow.status)),
        size: "small",
        effect: "light",
    }));
    const __VLS_340 = __VLS_339({
        type: (__VLS_ctx.getStatusType(__VLS_ctx.currentRow.status)),
        size: "small",
        effect: "light",
    }, ...__VLS_functionalComponentArgsRest(__VLS_339));
    __VLS_341.slots.default;
    (__VLS_ctx.getStatusLabel(__VLS_ctx.currentRow.status));
    var __VLS_341;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "no-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "val" },
    });
    (__VLS_ctx.currentRow.sampleNo);
    const __VLS_342 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    const __VLS_343 = __VLS_asFunctionalComponent(__VLS_342, new __VLS_342({
        direction: "vertical",
    }));
    const __VLS_344 = __VLS_343({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_343));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "val" },
    });
    (__VLS_ctx.currentRow.proposalNo);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-scroll-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-section-card mini" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-section-header" },
    });
    const __VLS_346 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_347 = __VLS_asFunctionalComponent(__VLS_346, new __VLS_346({
        ...{ class: "p-section-icon" },
    }));
    const __VLS_348 = __VLS_347({
        ...{ class: "p-section-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_347));
    __VLS_349.slots.default;
    const __VLS_350 = {}.Box;
    /** @type {[typeof __VLS_components.Box, ]} */ ;
    // @ts-ignore
    const __VLS_351 = __VLS_asFunctionalComponent(__VLS_350, new __VLS_350({}));
    const __VLS_352 = __VLS_351({}, ...__VLS_functionalComponentArgsRest(__VLS_351));
    var __VLS_349;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_354 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_355 = __VLS_asFunctionalComponent(__VLS_354, new __VLS_354({
        column: (2),
        border: true,
        size: "small",
    }));
    const __VLS_356 = __VLS_355({
        column: (2),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_355));
    __VLS_357.slots.default;
    const __VLS_358 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_359 = __VLS_asFunctionalComponent(__VLS_358, new __VLS_358({
        label: "产品经理",
    }));
    const __VLS_360 = __VLS_359({
        label: "产品经理",
    }, ...__VLS_functionalComponentArgsRest(__VLS_359));
    __VLS_361.slots.default;
    (__VLS_ctx.currentRow.productManager);
    var __VLS_361;
    const __VLS_362 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_363 = __VLS_asFunctionalComponent(__VLS_362, new __VLS_362({
        label: "采购员",
    }));
    const __VLS_364 = __VLS_363({
        label: "采购员",
    }, ...__VLS_functionalComponentArgsRest(__VLS_363));
    __VLS_365.slots.default;
    (__VLS_ctx.currentRow.purchaser);
    var __VLS_365;
    const __VLS_366 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_367 = __VLS_asFunctionalComponent(__VLS_366, new __VLS_366({
        label: "款式",
    }));
    const __VLS_368 = __VLS_367({
        label: "款式",
    }, ...__VLS_functionalComponentArgsRest(__VLS_367));
    __VLS_369.slots.default;
    (__VLS_ctx.currentRow.style);
    var __VLS_369;
    const __VLS_370 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_371 = __VLS_asFunctionalComponent(__VLS_370, new __VLS_370({
        label: "主材料",
    }));
    const __VLS_372 = __VLS_371({
        label: "主材料",
    }, ...__VLS_functionalComponentArgsRest(__VLS_371));
    __VLS_373.slots.default;
    (__VLS_ctx.currentRow.mainMaterial);
    var __VLS_373;
    const __VLS_374 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_375 = __VLS_asFunctionalComponent(__VLS_374, new __VLS_374({
        label: "适用对象",
        span: (2),
    }));
    const __VLS_376 = __VLS_375({
        label: "适用对象",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_375));
    __VLS_377.slots.default;
    (__VLS_ctx.currentRow.applicableTo);
    var __VLS_377;
    const __VLS_378 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_379 = __VLS_asFunctionalComponent(__VLS_378, new __VLS_378({
        label: "规格描述",
        span: (2),
    }));
    const __VLS_380 = __VLS_379({
        label: "规格描述",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_379));
    __VLS_381.slots.default;
    (__VLS_ctx.currentRow.spec);
    var __VLS_381;
    var __VLS_357;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-section-card mini" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-section-header" },
    });
    const __VLS_382 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_383 = __VLS_asFunctionalComponent(__VLS_382, new __VLS_382({
        ...{ class: "p-section-icon" },
    }));
    const __VLS_384 = __VLS_383({
        ...{ class: "p-section-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_383));
    __VLS_385.slots.default;
    const __VLS_386 = {}.Money;
    /** @type {[typeof __VLS_components.Money, ]} */ ;
    // @ts-ignore
    const __VLS_387 = __VLS_asFunctionalComponent(__VLS_386, new __VLS_386({}));
    const __VLS_388 = __VLS_387({}, ...__VLS_functionalComponentArgsRest(__VLS_387));
    var __VLS_385;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    const __VLS_390 = {}.ElDescriptions;
    /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
    // @ts-ignore
    const __VLS_391 = __VLS_asFunctionalComponent(__VLS_390, new __VLS_390({
        column: (2),
        border: true,
        size: "small",
    }));
    const __VLS_392 = __VLS_391({
        column: (2),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_391));
    __VLS_393.slots.default;
    const __VLS_394 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_395 = __VLS_asFunctionalComponent(__VLS_394, new __VLS_394({
        label: "拿样渠道",
    }));
    const __VLS_396 = __VLS_395({
        label: "拿样渠道",
    }, ...__VLS_functionalComponentArgsRest(__VLS_395));
    __VLS_397.slots.default;
    (__VLS_ctx.getSourceLabel(__VLS_ctx.currentRow.source));
    var __VLS_397;
    const __VLS_398 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_399 = __VLS_asFunctionalComponent(__VLS_398, new __VLS_398({
        label: "供应商",
    }));
    const __VLS_400 = __VLS_399({
        label: "供应商",
    }, ...__VLS_functionalComponentArgsRest(__VLS_399));
    __VLS_401.slots.default;
    (__VLS_ctx.currentRow.supplier || '-');
    var __VLS_401;
    const __VLS_402 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_403 = __VLS_asFunctionalComponent(__VLS_402, new __VLS_402({
        label: "样品类型",
    }));
    const __VLS_404 = __VLS_403({
        label: "样品类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_403));
    __VLS_405.slots.default;
    (__VLS_ctx.getTypeLabel(__VLS_ctx.currentRow.sampleType));
    var __VLS_405;
    const __VLS_406 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_407 = __VLS_asFunctionalComponent(__VLS_406, new __VLS_406({
        label: "样品费用",
    }));
    const __VLS_408 = __VLS_407({
        label: "样品费用",
    }, ...__VLS_functionalComponentArgsRest(__VLS_407));
    __VLS_409.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "price-text" },
    });
    (__VLS_ctx.currentRow.sampleFee?.toFixed(2));
    var __VLS_409;
    const __VLS_410 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_411 = __VLS_asFunctionalComponent(__VLS_410, new __VLS_410({
        label: "接收日期",
    }));
    const __VLS_412 = __VLS_411({
        label: "接收日期",
    }, ...__VLS_functionalComponentArgsRest(__VLS_411));
    __VLS_413.slots.default;
    (__VLS_ctx.currentRow.receiveDate);
    var __VLS_413;
    const __VLS_414 = {}.ElDescriptionsItem;
    /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
    // @ts-ignore
    const __VLS_415 = __VLS_asFunctionalComponent(__VLS_414, new __VLS_414({
        label: "保留期限",
    }));
    const __VLS_416 = __VLS_415({
        label: "保留期限",
    }, ...__VLS_functionalComponentArgsRest(__VLS_415));
    __VLS_417.slots.default;
    (__VLS_ctx.currentRow.expireDate);
    var __VLS_417;
    var __VLS_393;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-section-card mini" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "p-section-header" },
    });
    const __VLS_418 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_419 = __VLS_asFunctionalComponent(__VLS_418, new __VLS_418({
        ...{ class: "p-section-icon" },
    }));
    const __VLS_420 = __VLS_419({
        ...{ class: "p-section-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_419));
    __VLS_421.slots.default;
    const __VLS_422 = {}.List;
    /** @type {[typeof __VLS_components.List, ]} */ ;
    // @ts-ignore
    const __VLS_423 = __VLS_asFunctionalComponent(__VLS_422, new __VLS_422({}));
    const __VLS_424 = __VLS_423({}, ...__VLS_functionalComponentArgsRest(__VLS_423));
    var __VLS_421;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    /** @type {[typeof SampleTimeline, ]} */ ;
    // @ts-ignore
    const __VLS_426 = __VLS_asFunctionalComponent(SampleTimeline, new SampleTimeline({
        data: (__VLS_ctx.timelineData),
    }));
    const __VLS_427 = __VLS_426({
        data: (__VLS_ctx.timelineData),
    }, ...__VLS_functionalComponentArgsRest(__VLS_426));
}
var __VLS_333;
/** @type {[typeof RegistrationDialog, ]} */ ;
// @ts-ignore
const __VLS_429 = __VLS_asFunctionalComponent(RegistrationDialog, new RegistrationDialog({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.regVisible),
}));
const __VLS_430 = __VLS_429({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.regVisible),
}, ...__VLS_functionalComponentArgsRest(__VLS_429));
let __VLS_432;
let __VLS_433;
let __VLS_434;
const __VLS_435 = {
    onRefresh: (__VLS_ctx.handleQuery)
};
var __VLS_431;
/** @type {[typeof TestEvaluationDialog, ]} */ ;
// @ts-ignore
const __VLS_436 = __VLS_asFunctionalComponent(TestEvaluationDialog, new TestEvaluationDialog({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.testVisible),
    sampleData: (__VLS_ctx.currentRow),
}));
const __VLS_437 = __VLS_436({
    ...{ 'onRefresh': {} },
    modelValue: (__VLS_ctx.testVisible),
    sampleData: (__VLS_ctx.currentRow),
}, ...__VLS_functionalComponentArgsRest(__VLS_436));
let __VLS_439;
let __VLS_440;
let __VLS_441;
const __VLS_442 = {
    onRefresh: (__VLS_ctx.handleQuery)
};
var __VLS_438;
/** @type {__VLS_StyleScopedClasses['page-container']} */ ;
/** @type {__VLS_StyleScopedClasses['search-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['modern-card']} */ ;
/** @type {__VLS_StyleScopedClasses['search-form']} */ ;
/** @type {__VLS_StyleScopedClasses['search-btns']} */ ;
/** @type {__VLS_StyleScopedClasses['action-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
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
/** @type {__VLS_StyleScopedClasses['p-dropdown']} */ ;
/** @type {__VLS_StyleScopedClasses['pagination-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-left']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-right']} */ ;
/** @type {__VLS_StyleScopedClasses['total-count']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-header-card']} */ ;
/** @type {__VLS_StyleScopedClasses['sample-main-info']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-main-img']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['title-row']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['no-row']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-scroll-content']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mini']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mini']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mini']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['p-section-icon']} */ ;
// @ts-ignore
var __VLS_141 = __VLS_140;
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
            SampleTimeline: SampleTimeline,
            tableHeight: tableHeight,
            queryParams: queryParams,
            currentPage: currentPage,
            pageSize: pageSize,
            total: total,
            multipleTableRef: multipleTableRef,
            regVisible: regVisible,
            testVisible: testVisible,
            detailVisible: detailVisible,
            currentRow: currentRow,
            selectedRows: selectedRows,
            handleSelectionChange: handleSelectionChange,
            clearSelection: clearSelection,
            handleBatchExport: handleBatchExport,
            handleBatchPrint: handleBatchPrint,
            handlePrint: handlePrint,
            tableData: tableData,
            getStatusLabel: getStatusLabel,
            getStatusType: getStatusType,
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