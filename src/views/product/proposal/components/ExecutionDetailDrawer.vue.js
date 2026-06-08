/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Document, Clock, ArrowRight, Plus, Edit, Delete, Calendar, QuestionFilled } from '@element-plus/icons-vue';
import PurchaseDetailDialog from './PurchaseDetailDialog.vue';
import PurchaseApplyDialog from './PurchaseApplyDialog.vue';
import SampleRegistrationDialog from './SampleRegistrationDialog.vue';
import SampleRegistrationDetailDialog from './SampleRegistrationDetailDialog.vue';
const purchaseDetailRef = ref(null);
const purchaseApplyRef = ref(null);
const sampleRegistrationRef = ref(null);
const sampleRegistrationDetailRef = ref(null);
const editingRegNo = ref('');
const handleEditPurchase = (row) => purchaseApplyRef.value?.open(row);
const handleDeletePurchase = (row) => {
    ElMessageBox.confirm('确定要删除该购样申请吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        const idx = purchaseList.value.findIndex(p => p.applyNo === row.applyNo);
        if (idx !== -1) {
            purchaseList.value.splice(idx, 1);
            ElMessage.success('删除成功');
            if (purchaseList.value.length > 0) {
                selectedApplyNo.value = purchaseList.value[0].applyNo;
            }
            else {
                selectedApplyNo.value = '';
                if (directRegistrations.value.length > 0) {
                    selectedCategory.value = 'direct';
                    selectedDirectRegNo.value = directRegistrations.value[0].regNo;
                }
            }
        }
    }).catch(() => { });
};
const handleSampleRegistrationDetail = (row) => sampleRegistrationDetailRef.value?.open({ ...row, proposalNo: feedbackData.value?.code });
const handleEditSampleRegistration = (row) => {
    editingRegNo.value = row.regNo;
    sampleRegistrationRef.value?.open(row);
};
const handleSampleRegistrationSubmit = (formData) => {
    if (selectedCategory.value === 'direct') {
        const reg = directRegistrations.value.find(r => r.regNo === selectedDirectRegNo.value);
        if (reg) {
            reg.name = formData.name;
            reg.source = formData.source === '1' ? formData.supplierName : (formData.source === '2' ? '1688' : '淘宝');
            reg.sampleType = formData.sampleType === '1' ? '开发样' : '大货样';
            reg.sampleFee = '¥ ' + (formData.sampleFee || 0).toFixed(2);
            reg.initialQuote = formData.initialQuote;
            reg.taxRate = formData.taxRate;
            reg.moq = formData.moq;
            reg.productionCycle = formData.productionCycle;
            reg.description = formData.description;
            reg.hasBattery = formData.hasBattery;
            reg.isCE = formData.isCE;
            if (formData.details && formData.details[0]) {
                reg.pattern = formData.details[0].pattern;
                reg.color = formData.details[0].color;
                reg.spec = formData.details[0].spec;
                reg.sampleSize = `${formData.details[0].length || 0}×${formData.details[0].width || 0}×${formData.details[0].height || 0} ${formData.details[0].sampleSizeUnit}`;
                reg.netWeight = `${formData.details[0].netWeight || 0}${formData.details[0].netWeightUnit}`;
            }
            ElMessage.success('保存成功');
        }
    }
    else {
        const purchase = purchaseList.value.find(p => p.applyNo === selectedApplyNo.value);
        if (purchase && purchase.registrations) {
            const reg = purchase.registrations.find((r) => r.regNo === editingRegNo.value);
            if (reg) {
                reg.name = formData.name;
                reg.status = reg.status || '待提交';
                if (formData.details && formData.details[0]) {
                    reg.pattern = formData.details[0].pattern;
                    reg.color = formData.details[0].color;
                    reg.spec = formData.details[0].spec;
                    reg.sampleSize = `${formData.details[0].length || 0}×${formData.details[0].width || 0}×${formData.details[0].height || 0} ${formData.details[0].sampleSizeUnit}`;
                    reg.netWeight = `${formData.details[0].netWeight || 0}${formData.details[0].netWeightUnit}`;
                }
                ElMessage.success('保存成功');
            }
        }
    }
};
const handleDeleteSampleRegistration = (row) => {
    ElMessageBox.confirm('确定要删除该样品登记记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        if (selectedCategory.value === 'direct') {
            const idx = directRegistrations.value.findIndex(d => d.regNo === row.regNo);
            if (idx !== -1) {
                directRegistrations.value.splice(idx, 1);
                ElMessage.success('删除成功');
                if (selectedDirectRegNo.value === row.regNo) {
                    selectedDirectRegNo.value = directRegistrations.value[0]?.regNo || '';
                }
            }
        }
        else {
            const purchase = purchaseList.value.find(p => p.applyNo === selectedApplyNo.value);
            if (purchase && purchase.registrations) {
                const idx = purchase.registrations.findIndex((r) => r.regNo === row.regNo);
                if (idx !== -1) {
                    purchase.registrations.splice(idx, 1);
                    ElMessage.success('删除成功');
                }
            }
        }
    }).catch(() => { });
};
const getRegStatusClass = (status) => {
    switch (status) {
        case '有效': return 'success';
        case '待反馈': return 'warning';
        case '待提交': return 'info';
        case '无效': return 'danger';
        case '已驳回': return 'danger';
        default: return 'info';
    }
};
const getPurchaseDuration = (item) => {
    if (!item)
        return '';
    if (!item.applyTime)
        return '';
    const startTime = new Date(item.applyTime).getTime();
    if (isNaN(startTime))
        return item.duration || '';
    let endTime = Date.now();
    if (['已通过', '同意', '待更新合同'].includes(item.status) && item.approvalNodes && item.approvalNodes.length > 0) {
        const completedNodes = item.approvalNodes.filter((n) => n.status === 'completed' && n.time);
        if (completedNodes.length > 0) {
            const lastNode = completedNodes[completedNodes.length - 1];
            const lastTime = new Date(lastNode.time).getTime();
            if (!isNaN(lastTime)) {
                endTime = lastTime;
            }
        }
    }
    const diffMs = endTime - startTime;
    if (diffMs <= 0)
        return '1分钟';
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60) {
        return `${diffMinutes}分钟`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    const remMinutes = diffMinutes % 60;
    if (remMinutes === 0) {
        return `${diffHours}小时`;
    }
    const decimalHours = (diffHours + remMinutes / 60).toFixed(1);
    if (decimalHours.endsWith('.0')) {
        return `${diffHours}小时`;
    }
    return `${decimalHours}小时`;
};
const handleRegisterSampleDirect = (row) => {
    sampleRegistrationRef.value?.open({
        isPurchaseSync: true,
        proposalNo: feedbackData.value?.code,
        productName: row.sampleName,
        supplierName: row.supplier,
        purchaseUrl: row.purchaseUrl,
        sampleFee: parseFloat((row.price || '0').replace(/[^\d.]/g, '')) || 0
    });
};
const handlePurchaseApplySubmit = (items) => {
    if (!items)
        return;
    items.forEach(item => {
        const idx = purchaseList.value.findIndex(p => p.applyNo === item.applyNo);
        if (idx !== -1) {
            purchaseList.value[idx] = { ...purchaseList.value[idx], ...item };
        }
        else {
            const newApplyNo = 'PO-NEW-' + Date.now();
            purchaseList.value.push({ ...item, applyNo: newApplyNo, registrations: [], approvalNodes: [] });
            selectedCategory.value = 'purchase';
            selectedApplyNo.value = newApplyNo;
        }
    });
};
const visible = ref(false);
const feedbackData = ref(null);
const purchaseList = ref([]);
const directRegistrations = ref([]);
const isSpotSample = ref(false);
const selectedCategory = ref('purchase');
const selectedApplyNo = ref('');
const selectedDirectRegNo = ref('');
const selectedApply = computed(() => {
    const row = purchaseList.value.find(p => p.applyNo === selectedApplyNo.value);
    if (!row)
        return null;
    // 补齐查看详情时可能缺失的默认字段数据，以展示完整的多渠道特异信息
    const defaultBank = {
        paymentMethod: '银行转账',
        bankName: '中国工商银行义乌支行',
        accountName: row.supplier || '义乌市得力商贸服务部',
        bankAccount: '6217 0038 9001 0293 848'
    };
    const defaultRefund = {
        isRefundable: ['已通过', '同意', '待更新合同'].includes(row.status),
        refundMethod: '抵扣首单货款',
        refundCondition: '首批大货订单满1000件返还'
    };
    return {
        ...defaultBank,
        ...defaultRefund,
        ...row,
        // 如果是 1688 / 淘宝，我们配给它对应的付款截图或店铺名
        shopName: row.channel !== '供应商' ? `${row.channel}优质货源店` : '',
        orderScreenshot: row.channel !== '供应商' ? 'https://picsum.photos/300/200?random=40' : '',
        paymentQrCode: (row.paymentQrCodes && row.paymentQrCodes.length > 0) ? row.paymentQrCodes[0] : (row.paymentQrCode || (['支付宝', '微信'].includes(row.paymentMethod) ? 'https://picsum.photos/200/200?random=50' : ''))
    };
});
const selectedDirectDetail = computed(() => {
    if (directRegistrations.value.length === 0)
        return null;
    const reg = directRegistrations.value.find(r => r.regNo === selectedDirectRegNo.value) || directRegistrations.value[0];
    const defaultMeta = {
        sampleType: '开发样',
        packagingMethod: '盒装',
        packagingQuantity: '1pack',
        style: '经典系列',
        initialQuote: '85.00',
        taxRate: 13,
        moq: 500,
        productionCycle: 20,
        hasBattery: false,
        isCE: true,
        receiver: '李四',
        receiveDate: '2026-05-24',
        purchaserName: '黄小军',
        pmName: '陈招娣',
        receiveTime: '2026-05-24 10:00',
        feedbackTime: '2026-05-26 14:20',
        qualifications: [
            { name: 'CE符合性证书.pdf', url: '#' },
            { name: '产品质检报告.pdf', url: '#' }
        ],
        description: '样品尺寸及结构完全契合要求，抛光打磨优秀，推荐批量采纳。',
        // Physical properties
        spec: reg.spec || '通用',
        color: reg.color || '磨砂透',
        pattern: reg.pattern || '无图案',
        sampleSize: reg.sampleSize || '25*25*8cm',
        netWeight: reg.netWeight || '0.45kg',
        packagingSize: reg.packagingSize || '26*26*10cm',
        size: reg.size || 'M',
        diameter: reg.diameter || '-',
        capacity: reg.capacity || '-'
    };
    const status = reg.sampleStatus || '有效';
    const result = {
        ...defaultMeta,
        ...reg,
        status
    };
    if (!['有效', '无效', '已反馈'].includes(status) || !reg.feedbackTime) {
        delete result.feedbackTime;
    }
    return result;
});
const getDirectStatusTagType = (status) => {
    switch (status) {
        case '合格':
        case '有效': return 'success';
        case '待反馈': return 'warning';
        case '待提交': return 'info';
        case '无效':
        case '已驳回': return 'danger';
        default: return 'info';
    }
};
const getDirectDuration = (item) => {
    if (!item)
        return '';
    const t1Str = item.receiveTime;
    if (!t1Str)
        return '';
    const t1 = new Date(t1Str).getTime();
    if (isNaN(t1))
        return '';
    let t2;
    const status = item.sampleStatus || item.status;
    if (['有效', '无效', '已反馈'].includes(status)) {
        if (item.feedbackTime) {
            t2 = new Date(item.feedbackTime).getTime();
        }
        else {
            t2 = t1 + 2 * 24 * 60 * 60 * 1000;
        }
    }
    else {
        t2 = Date.now();
    }
    if (isNaN(t2))
        return '';
    const diffMs = t2 - t1;
    if (diffMs <= 0)
        return '1分钟';
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60) {
        return `${diffMinutes}分钟`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    const days = Math.floor(diffHours / 24);
    const hours = diffHours % 24;
    if (days > 0) {
        return `${days}天${hours}小时`;
    }
    return `${hours}小时`;
};
const drawerSize = computed(() => (purchaseList.value.length === 1 || (purchaseList.value.length === 0 && directRegistrations.value.length > 0)) ? '1200px' : '1250px');
const getTotalRegCount = () => (purchaseList.value.reduce((acc, p) => acc + (p.registrations?.length || 0), 0) + directRegistrations.value.length);
const open = (row) => {
    feedbackData.value = row;
    isSpotSample.value = !!row.applyNo;
    if (isSpotSample.value) {
        directRegistrations.value = [];
        const purchaseItem = {
            applyNo: row.applyNo,
            sampleName: row.sampleName || row.name,
            channel: row.channel || '供应商',
            supplier: row.supplier,
            purchaseUrl: row.purchaseUrl,
            qty: row.qty || 1,
            price: row.price || '¥ 0.00',
            amount: row.amount || '免费',
            status: row.status,
            applyTime: row.applyTime,
            type: row.type || 'purchase',
            registrations: row.registrations || [],
            approvalNodes: row.approvalNodes || [
                { nodeName: "提交申请", operator: "系统", time: row.applyTime, status: "completed" },
                { nodeName: "完成登记", operator: "系统", time: row.applyTime, status: "completed" }
            ]
        };
        purchaseList.value = [purchaseItem];
        selectedCategory.value = 'purchase';
        selectedApplyNo.value = purchaseItem.applyNo;
    }
    else {
        if (row.feeAmount === '¥ 0.00' || row.type === 'direct' || row.amount === '免费') {
            purchaseList.value = [];
            const firstReg = (row.type === 'direct' && row.registrations && row.registrations.length > 0) ? {
                regNo: row.applyNo || 'DJ-20260603-71',
                name: row.sampleName || '亚克力透光隔板',
                source: row.channel || '供应商',
                sampleType: '开发样',
                sampleStatus: '有效',
                receiveTime: row.applyTime || '2026-06-03 10:00',
                receiver: '李四',
                sampleFee: '¥ 0.00',
                ...row.registrations[0]
            } : {
                regNo: 'DJ-20260603-71',
                name: '亚克力透光隔板',
                source: '供应商',
                sampleType: '开发样',
                sampleStatus: '待提交',
                receiveTime: '2026-06-03 10:00',
                receiver: '李四',
                sampleFee: '¥ 0.00'
            };
            directRegistrations.value = [
                firstReg,
                {
                    regNo: 'DJ-20260603-72',
                    name: 'LED七彩发光线圈',
                    source: '供应商',
                    sampleType: '开发样',
                    sampleStatus: '待反馈',
                    receiveTime: '2026-06-02 09:00',
                    receiver: '李四',
                    sampleFee: '¥ 0.00'
                },
                {
                    regNo: 'DJ-20260603-73',
                    name: '不锈钢微调固定座',
                    source: '供应商',
                    sampleType: '开发样',
                    sampleStatus: '已驳回',
                    receiveTime: '2026-06-01 14:00',
                    receiver: '李四',
                    sampleFee: '¥ 0.00'
                },
                {
                    regNo: 'DJ-20260603-74',
                    name: '高亮白光背板',
                    source: '淘宝',
                    sampleType: '开发样',
                    sampleStatus: '有效',
                    receiveTime: '2026-05-24 10:00',
                    feedbackTime: '2026-05-26 14:20',
                    receiver: '李四',
                    sampleFee: '¥ 0.00'
                },
                {
                    regNo: 'DJ-20260603-75',
                    name: '超细铜导线样品',
                    source: '1688',
                    sampleType: '开发样',
                    sampleStatus: '无效',
                    receiveTime: '2026-05-25 09:00',
                    feedbackTime: '2026-05-25 17:30',
                    receiver: '李四',
                    sampleFee: '¥ 0.00'
                }
            ];
            selectedCategory.value = 'direct';
            selectedApplyNo.value = '';
            selectedDirectRegNo.value = directRegistrations.value[0]?.regNo || '';
        }
        else {
            directRegistrations.value = [];
            const firstPurchase = (row.applyNo && row.applyNo.startsWith('PO-')) ? {
                applyNo: row.applyNo,
                sampleName: row.sampleName,
                channel: row.channel,
                supplier: row.supplier,
                qty: row.qty,
                price: row.price,
                amount: row.amount,
                status: row.status,
                applyTime: row.applyTime,
                registrations: row.registrations || [],
                approvalNodes: row.approvalNodes || [
                    { nodeName: "提交申请", operator: "张三", time: row.applyTime, status: "completed" },
                    { nodeName: "部门主管审批", operator: "经理", time: row.applyTime, status: "completed" }
                ]
            } : {
                applyNo: 'PO-20260520-01',
                sampleName: 'DIY灯光板 - 款式A',
                channel: '供应商',
                supplier: row.source || '线下-深圳供应商',
                qty: 1,
                price: '¥ 50.00',
                amount: row.feeAmount || '¥ 50.00',
                status: '同意',
                applyTime: '2026-05-21 14:00',
                duration: '1.5小时',
                registrations: [
                    {
                        regNo: 'DJ-20260603-01',
                        pattern: '复古雕花',
                        color: '曜石黑',
                        spec: '500*500mm',
                        sampleSize: '50*50*10cm',
                        netWeight: '1.2kg',
                        status: '待提交',
                        image: 'https://picsum.photos/60/60?random=1'
                    },
                    {
                        regNo: 'DJ-20260603-02',
                        pattern: '现代简约',
                        color: '极光银',
                        spec: '400*400mm',
                        sampleSize: '40*40*8cm',
                        netWeight: '0.9kg',
                        status: '待反馈',
                        image: 'https://picsum.photos/60/60?random=2'
                    },
                    {
                        regNo: 'DJ-20260603-03',
                        pattern: '欧式浮雕',
                        color: '象牙白',
                        spec: '600*600mm',
                        sampleSize: '60*60*12cm',
                        netWeight: '1.5kg',
                        status: '有效',
                        image: 'https://picsum.photos/60/60?random=3'
                    },
                    {
                        regNo: 'DJ-20260603-04',
                        pattern: '波西米亚',
                        color: '古铜色',
                        spec: '300*300mm',
                        sampleSize: '30*30*6cm',
                        netWeight: '0.7kg',
                        status: '无效',
                        image: 'https://picsum.photos/60/60?random=4'
                    },
                    {
                        regNo: 'DJ-20260603-05',
                        pattern: '几何线条',
                        color: '香槟金',
                        spec: '450*450mm',
                        sampleSize: '45*45*9cm',
                        netWeight: '1.1kg',
                        status: '已驳回',
                        image: 'https://picsum.photos/60/60?random=5'
                    }
                ],
                approvalNodes: [
                    { nodeName: "提交申请", operator: "张三", time: "2026-05-21 14:00", status: "completed" },
                    { nodeName: "部门主管审批", operator: "经理", time: "2026-05-21 15:30", status: "completed" }
                ]
            };
            purchaseList.value = [
                firstPurchase,
                {
                    applyNo: 'PO-20260521-02',
                    sampleName: '亚克力防尘保护盒 - 淘宝样',
                    channel: '淘宝',
                    purchaseUrl: 'https://item.taobao.com/item.htm?id=68291039281',
                    qty: 2,
                    price: '¥ 15.00',
                    amount: '¥ 30.00',
                    status: '待审批',
                    applyTime: '2026-06-03 14:00',
                    duration: '3.5小时',
                    registrations: [
                        {
                            regNo: 'DJ-20260603-06',
                            pattern: '透明高透款',
                            color: '无色透明',
                            spec: '20*20*15cm',
                            sampleSize: '20*20*15cm',
                            netWeight: '0.3kg',
                            status: '有效',
                            image: 'https://picsum.photos/60/60?random=10'
                        }
                    ],
                    approvalNodes: [
                        { nodeName: "提交申请", operator: "张三", time: "2026-06-03 14:00", status: "completed" },
                        { nodeName: "部门主管审批", operator: "经理", status: "processing" }
                    ]
                },
                {
                    applyNo: 'PO-20260522-03',
                    sampleName: 'LED高亮背光板 - 1688样',
                    channel: '1688',
                    purchaseUrl: 'https://detail.1688.com/offer/6791028391.html',
                    qty: 5,
                    price: '¥ 8.00',
                    amount: '¥ 40.00',
                    status: '不同意',
                    applyTime: '2026-06-02 10:00',
                    duration: '1.5小时',
                    registrations: [
                        {
                            regNo: 'DJ-20260603-07',
                            pattern: '暖白光微调',
                            color: '银白面板',
                            spec: '12V直流输入',
                            sampleSize: '15*15*0.5cm',
                            netWeight: '0.15kg',
                            status: '待提交',
                            image: 'https://picsum.photos/60/60?random=11'
                        }
                    ],
                    approvalNodes: [
                        { nodeName: "提交申请", operator: "张三", time: "2026-06-02 10:00", status: "completed" },
                        { nodeName: "部门主管审批", operator: "经理", time: "2026-06-02 11:30", status: "rejected" }
                    ]
                },
                {
                    applyNo: 'PO-20260523-04',
                    sampleName: '不锈钢微调固定座 - 供应商样',
                    channel: '供应商',
                    supplier: '长期合作-华强北电子',
                    qty: 1,
                    price: '¥ 120.00',
                    amount: '¥ 120.00',
                    status: '待更新合同',
                    applyTime: '2026-06-01 09:30',
                    duration: '4.5小时',
                    registrations: [
                        {
                            regNo: 'DJ-20260603-08',
                            pattern: '螺纹加强型',
                            color: '金属拉丝',
                            spec: 'M8螺纹规格',
                            sampleSize: '10*5*5cm',
                            netWeight: '0.25kg',
                            status: '待提交',
                            image: 'https://picsum.photos/60/60?random=12'
                        }
                    ],
                    approvalNodes: [
                        { nodeName: "提交申请", operator: "张三", time: "2026-06-01 09:30", status: "completed" },
                        { nodeName: "部门主管审批", operator: "经理", time: "2026-06-01 10:30", status: "completed" },
                        { nodeName: "合同初审", operator: "法务", time: "2026-06-01 14:00", status: "completed" }
                    ]
                },
                {
                    applyNo: 'PO-20260524-05',
                    sampleName: '超细铜导线样品 - 1688样',
                    channel: '1688',
                    purchaseUrl: 'https://detail.1688.com/offer/7930192831.html',
                    qty: 10,
                    price: '¥ 2.50',
                    amount: '¥ 25.00',
                    status: '待提交',
                    applyTime: '2026-06-03 17:00',
                    registrations: [],
                    approvalNodes: []
                }
            ];
            selectedCategory.value = 'purchase';
            selectedApplyNo.value = purchaseList.value[0]?.applyNo || '';
        }
    }
    visible.value = true;
};
const getStatusTagType = (status) => {
    switch (status) {
        case '已登记':
        case '同意':
        case '已通过': return 'success';
        case '待审批':
        case '审批中': return 'warning';
        case '不同意':
        case '已驳回': return 'danger';
        case '待更新合同': return 'primary';
        case '待提交': return 'info';
        default: return 'info';
    }
};
const formatTimeWithoutYear = (ts) => ts.split(' ').length === 2 ? ts.split(' ')[0].split('-').slice(1).join('-') + ' ' + ts.split(' ')[1] : ts;
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['nav-item-top']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-no']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['warning']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-node-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-node-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['warning']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['danger']} */ ;
/** @type {__VLS_StyleScopedClasses['text-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['info-icon']} */ ;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElDrawer;
/** @type {[typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, typeof __VLS_components.ElDrawer, typeof __VLS_components.elDrawer, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    size: (__VLS_ctx.drawerSize),
    destroyOnClose: true,
    ...{ class: "premium-drawer" },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    size: (__VLS_ctx.drawerSize),
    destroyOnClose: true,
    ...{ class: "premium-drawer" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "drawer-header-v4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title-main" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title-icon" },
    });
    const __VLS_5 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
    const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_8.slots.default;
    const __VLS_9 = {}.Document;
    /** @type {[typeof __VLS_components.Document, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
    const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
    var __VLS_8;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title-text" },
    });
}
if (__VLS_ctx.feedbackData) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "workspace-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "workspace-sidebar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "sidebar-block context-card" },
    });
    if (!__VLS_ctx.isSpotSample) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "block-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "block-title-text" },
        });
    }
    if (!__VLS_ctx.isSpotSample) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "context-details" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "ctx-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "ctx-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "ctx-value font-mono" },
        });
        (__VLS_ctx.feedbackData.code);
        if (__VLS_ctx.feedbackData.source) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "ctx-row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "ctx-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "ctx-value" },
            });
            (__VLS_ctx.feedbackData.source);
        }
        if (__VLS_ctx.feedbackData.feeAmount) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "ctx-row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "ctx-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "ctx-value price-highlight" },
            });
            (__VLS_ctx.feedbackData.feeAmount);
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "quick-kpis" },
        ...{ class: ({ 'no-border': __VLS_ctx.isSpotSample }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-box" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "kpi-num" },
    });
    (__VLS_ctx.purchaseList.length);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "kpi-lbl" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kpi-box" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "kpi-num" },
    });
    (__VLS_ctx.getTotalRegCount());
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "kpi-lbl" },
    });
    if (__VLS_ctx.purchaseList.length > 0 || __VLS_ctx.directRegistrations.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "sidebar-block nav-list-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "block-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "block-title-text" },
        });
        (__VLS_ctx.purchaseList.length > 0 ? '购样申请记录' : '样品登记记录');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "master-navigation-list" },
        });
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.purchaseList))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.feedbackData))
                            return;
                        if (!(__VLS_ctx.purchaseList.length > 0 || __VLS_ctx.directRegistrations.length > 0))
                            return;
                        __VLS_ctx.selectedCategory = 'purchase';
                        __VLS_ctx.selectedApplyNo = item.applyNo;
                    } },
                key: (item.applyNo),
                ...{ class: "master-nav-item" },
                ...{ class: ({ active: __VLS_ctx.selectedCategory === 'purchase' && __VLS_ctx.selectedApplyNo === item.applyNo }) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "nav-item-top" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "nav-item-no" },
            });
            (item.applyNo);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: (['nav-status-dot', __VLS_ctx.getStatusTagType(item.status)]) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "nav-item-name" },
            });
            (item.sampleName);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "nav-item-footer" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "footer-left" },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "nav-price" },
            });
            (item.amount);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: (['nav-status-text', __VLS_ctx.getStatusTagType(item.status)]) },
            });
            (item.status);
            if (__VLS_ctx.getPurchaseDuration(item)) {
                const __VLS_13 = {}.ElTooltip;
                /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
                // @ts-ignore
                const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
                    placement: "top",
                    effect: "dark",
                }));
                const __VLS_15 = __VLS_14({
                    placement: "top",
                    effect: "dark",
                }, ...__VLS_functionalComponentArgsRest(__VLS_14));
                __VLS_16.slots.default;
                {
                    const { content: __VLS_thisSlot } = __VLS_16.slots;
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ style: {} },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
                }
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "nav-duration" },
                });
                const __VLS_17 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
                    ...{ class: "mr-2" },
                }));
                const __VLS_19 = __VLS_18({
                    ...{ class: "mr-2" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_18));
                __VLS_20.slots.default;
                const __VLS_21 = {}.Clock;
                /** @type {[typeof __VLS_components.Clock, ]} */ ;
                // @ts-ignore
                const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
                const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
                var __VLS_20;
                (__VLS_ctx.getPurchaseDuration(item));
                const __VLS_25 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
                    ...{ class: "ml-2 info-icon" },
                }));
                const __VLS_27 = __VLS_26({
                    ...{ class: "ml-2 info-icon" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_26));
                __VLS_28.slots.default;
                const __VLS_29 = {}.QuestionFilled;
                /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
                // @ts-ignore
                const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({}));
                const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
                var __VLS_28;
                var __VLS_16;
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "nav-reg-count" },
            });
            (item.registrations?.length || 0);
            if (item.approvalNodes && item.approvalNodes.length > 0) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "nav-item-approval-nodes" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "approval-nodes-flow" },
                });
                for (const [node, nIdx] of __VLS_getVForSourceType((item.approvalNodes))) {
                    (nIdx);
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "mini-node" },
                        ...{ class: (node.status) },
                        title: (node.nodeName + (node.operator ? ' (' + node.operator + ')' : '')),
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "mini-node-dot" },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "mini-node-text" },
                    });
                    (node.nodeName);
                    if (nIdx < item.approvalNodes.length - 1) {
                        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                            ...{ class: "node-arrow" },
                        });
                        const __VLS_33 = {}.ElIcon;
                        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                        // @ts-ignore
                        const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({}));
                        const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
                        __VLS_36.slots.default;
                        const __VLS_37 = {}.ArrowRight;
                        /** @type {[typeof __VLS_components.ArrowRight, ]} */ ;
                        // @ts-ignore
                        const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({}));
                        const __VLS_39 = __VLS_38({}, ...__VLS_functionalComponentArgsRest(__VLS_38));
                        var __VLS_36;
                    }
                }
            }
        }
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.directRegistrations))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.feedbackData))
                            return;
                        if (!(__VLS_ctx.purchaseList.length > 0 || __VLS_ctx.directRegistrations.length > 0))
                            return;
                        __VLS_ctx.selectedCategory = 'direct';
                        __VLS_ctx.selectedDirectRegNo = item.regNo;
                        __VLS_ctx.selectedApplyNo = '';
                    } },
                key: (item.regNo),
                ...{ class: "master-nav-item" },
                ...{ class: ({ active: __VLS_ctx.selectedCategory === 'direct' && __VLS_ctx.selectedDirectRegNo === item.regNo }) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "nav-item-top" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "nav-item-no" },
            });
            (item.regNo);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: (['nav-status-dot', __VLS_ctx.getDirectStatusTagType(item.sampleStatus)]) },
                title: (item.sampleStatus),
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "nav-item-name-row" },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "nav-item-name" },
                ...{ style: {} },
            });
            (item.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "nav-meta-val" },
                ...{ style: {} },
            });
            (item.source);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "nav-item-footer" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "footer-left" },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "nav-type-text" },
            });
            (item.sampleType || '开发样');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: (['nav-status-text', __VLS_ctx.getDirectStatusTagType(item.sampleStatus)]) },
            });
            (item.sampleStatus);
            if (__VLS_ctx.getDirectDuration(item)) {
                const __VLS_41 = {}.ElTooltip;
                /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
                // @ts-ignore
                const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
                    placement: "top",
                    effect: "dark",
                }));
                const __VLS_43 = __VLS_42({
                    placement: "top",
                    effect: "dark",
                }, ...__VLS_functionalComponentArgsRest(__VLS_42));
                __VLS_44.slots.default;
                {
                    const { content: __VLS_thisSlot } = __VLS_44.slots;
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ style: {} },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
                }
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ onClick: () => { } },
                    ...{ class: "nav-duration" },
                });
                const __VLS_45 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
                    ...{ class: "mr-2" },
                }));
                const __VLS_47 = __VLS_46({
                    ...{ class: "mr-2" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_46));
                __VLS_48.slots.default;
                const __VLS_49 = {}.Clock;
                /** @type {[typeof __VLS_components.Clock, ]} */ ;
                // @ts-ignore
                const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({}));
                const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
                var __VLS_48;
                (__VLS_ctx.getDirectDuration(item));
                const __VLS_53 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
                    ...{ class: "ml-2 info-icon" },
                }));
                const __VLS_55 = __VLS_54({
                    ...{ class: "ml-2 info-icon" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_54));
                __VLS_56.slots.default;
                const __VLS_57 = {}.QuestionFilled;
                /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
                // @ts-ignore
                const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({}));
                const __VLS_59 = __VLS_58({}, ...__VLS_functionalComponentArgsRest(__VLS_58));
                var __VLS_56;
                var __VLS_44;
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "workspace-main" },
    });
    if (__VLS_ctx.selectedCategory === 'purchase' && __VLS_ctx.selectedApply) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-workspace-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-header-bar" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "header-left" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "header-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.selectedApply.applyNo);
        const __VLS_61 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
            type: (__VLS_ctx.getStatusTagType(__VLS_ctx.selectedApply.status)),
            size: "small",
            effect: "light",
            ...{ class: "ml-12 custom-status-tag" },
        }));
        const __VLS_63 = __VLS_62({
            type: (__VLS_ctx.getStatusTagType(__VLS_ctx.selectedApply.status)),
            size: "small",
            effect: "light",
            ...{ class: "ml-12 custom-status-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_62));
        __VLS_64.slots.default;
        (__VLS_ctx.selectedApply.status);
        var __VLS_64;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "header-right" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "time-label" },
        });
        const __VLS_65 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({}));
        const __VLS_67 = __VLS_66({}, ...__VLS_functionalComponentArgsRest(__VLS_66));
        __VLS_68.slots.default;
        const __VLS_69 = {}.Calendar;
        /** @type {[typeof __VLS_components.Calendar, ]} */ ;
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({}));
        const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
        var __VLS_68;
        (__VLS_ctx.selectedApply.applyTime);
        if (__VLS_ctx.getPurchaseDuration(__VLS_ctx.selectedApply)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "time-label ml-16" },
            });
            const __VLS_73 = {}.ElTooltip;
            /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
            // @ts-ignore
            const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
                placement: "top",
                effect: "dark",
            }));
            const __VLS_75 = __VLS_74({
                placement: "top",
                effect: "dark",
            }, ...__VLS_functionalComponentArgsRest(__VLS_74));
            __VLS_76.slots.default;
            {
                const { content: __VLS_thisSlot } = __VLS_76.slots;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
                __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
                __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "duration-explain-trigger" },
            });
            const __VLS_77 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({}));
            const __VLS_79 = __VLS_78({}, ...__VLS_functionalComponentArgsRest(__VLS_78));
            __VLS_80.slots.default;
            const __VLS_81 = {}.Clock;
            /** @type {[typeof __VLS_components.Clock, ]} */ ;
            // @ts-ignore
            const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({}));
            const __VLS_83 = __VLS_82({}, ...__VLS_functionalComponentArgsRest(__VLS_82));
            var __VLS_80;
            (__VLS_ctx.getPurchaseDuration(__VLS_ctx.selectedApply));
            const __VLS_85 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
                ...{ class: "ml-4 info-icon" },
            }));
            const __VLS_87 = __VLS_86({
                ...{ class: "ml-4 info-icon" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_86));
            __VLS_88.slots.default;
            const __VLS_89 = {}.QuestionFilled;
            /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
            // @ts-ignore
            const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({}));
            const __VLS_91 = __VLS_90({}, ...__VLS_functionalComponentArgsRest(__VLS_90));
            var __VLS_88;
            var __VLS_76;
        }
        if (['待提交', '待更新合同'].includes(__VLS_ctx.selectedApply.status)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ style: {} },
                ...{ class: "ml-16" },
            });
            const __VLS_93 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
                ...{ 'onClick': {} },
                link: true,
                type: "primary",
                icon: (__VLS_ctx.Edit),
                ...{ class: "header-action-link" },
            }));
            const __VLS_95 = __VLS_94({
                ...{ 'onClick': {} },
                link: true,
                type: "primary",
                icon: (__VLS_ctx.Edit),
                ...{ class: "header-action-link" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_94));
            let __VLS_97;
            let __VLS_98;
            let __VLS_99;
            const __VLS_100 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.feedbackData))
                        return;
                    if (!(__VLS_ctx.selectedCategory === 'purchase' && __VLS_ctx.selectedApply))
                        return;
                    if (!(['待提交', '待更新合同'].includes(__VLS_ctx.selectedApply.status)))
                        return;
                    __VLS_ctx.handleEditPurchase(__VLS_ctx.selectedApply);
                }
            };
            __VLS_96.slots.default;
            var __VLS_96;
            if (__VLS_ctx.selectedApply.status === '待提交') {
                const __VLS_101 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "danger",
                    icon: (__VLS_ctx.Delete),
                    ...{ class: "header-action-link" },
                }));
                const __VLS_103 = __VLS_102({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "danger",
                    icon: (__VLS_ctx.Delete),
                    ...{ class: "header-action-link" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_102));
                let __VLS_105;
                let __VLS_106;
                let __VLS_107;
                const __VLS_108 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.feedbackData))
                            return;
                        if (!(__VLS_ctx.selectedCategory === 'purchase' && __VLS_ctx.selectedApply))
                            return;
                        if (!(['待提交', '待更新合同'].includes(__VLS_ctx.selectedApply.status)))
                            return;
                        if (!(__VLS_ctx.selectedApply.status === '待提交'))
                            return;
                        __VLS_ctx.handleDeletePurchase(__VLS_ctx.selectedApply);
                    }
                };
                __VLS_104.slots.default;
                var __VLS_104;
            }
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-section mb-20 mt-16" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-12" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar blue" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        if (__VLS_ctx.selectedApply.channel === '供应商') {
            const __VLS_109 = {}.ElDescriptions;
            /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
            // @ts-ignore
            const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
                column: (2),
                border: true,
                ...{ class: "custom-desc-table" },
            }));
            const __VLS_111 = __VLS_110({
                column: (2),
                border: true,
                ...{ class: "custom-desc-table" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_110));
            __VLS_112.slots.default;
            const __VLS_113 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
                label: "拿样渠道",
            }));
            const __VLS_115 = __VLS_114({
                label: "拿样渠道",
            }, ...__VLS_functionalComponentArgsRest(__VLS_114));
            __VLS_116.slots.default;
            const __VLS_117 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
                size: "small",
                type: "info",
                effect: "plain",
            }));
            const __VLS_119 = __VLS_118({
                size: "small",
                type: "info",
                effect: "plain",
            }, ...__VLS_functionalComponentArgsRest(__VLS_118));
            __VLS_120.slots.default;
            var __VLS_120;
            var __VLS_116;
            const __VLS_121 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
                label: "供应商类型",
            }));
            const __VLS_123 = __VLS_122({
                label: "供应商类型",
            }, ...__VLS_functionalComponentArgsRest(__VLS_122));
            __VLS_124.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.selectedApply.supplierType || '临时供应商');
            var __VLS_124;
            const __VLS_125 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
                label: "供应商名称",
            }));
            const __VLS_127 = __VLS_126({
                label: "供应商名称",
            }, ...__VLS_functionalComponentArgsRest(__VLS_126));
            __VLS_128.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "font-semibold text-bold" },
            });
            (__VLS_ctx.selectedApply.supplier);
            var __VLS_128;
            const __VLS_129 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
                label: "货源地",
            }));
            const __VLS_131 = __VLS_130({
                label: "货源地",
            }, ...__VLS_functionalComponentArgsRest(__VLS_130));
            __VLS_132.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.selectedApply.source || '广东深圳');
            var __VLS_132;
            var __VLS_112;
        }
        else {
            const __VLS_133 = {}.ElDescriptions;
            /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
            // @ts-ignore
            const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
                column: (2),
                border: true,
                ...{ class: "custom-desc-table" },
            }));
            const __VLS_135 = __VLS_134({
                column: (2),
                border: true,
                ...{ class: "custom-desc-table" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_134));
            __VLS_136.slots.default;
            const __VLS_137 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
                label: "拿样渠道",
            }));
            const __VLS_139 = __VLS_138({
                label: "拿样渠道",
            }, ...__VLS_functionalComponentArgsRest(__VLS_138));
            __VLS_140.slots.default;
            const __VLS_141 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
                size: "small",
                type: "warning",
                effect: "plain",
            }));
            const __VLS_143 = __VLS_142({
                size: "small",
                type: "warning",
                effect: "plain",
            }, ...__VLS_functionalComponentArgsRest(__VLS_142));
            __VLS_144.slots.default;
            (__VLS_ctx.selectedApply.channel);
            var __VLS_144;
            var __VLS_140;
            const __VLS_145 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
                label: "购买链接",
                span: (2),
            }));
            const __VLS_147 = __VLS_146({
                label: "购买链接",
                span: (2),
            }, ...__VLS_functionalComponentArgsRest(__VLS_146));
            __VLS_148.slots.default;
            if (__VLS_ctx.selectedApply.purchaseUrl) {
                const __VLS_149 = {}.ElLink;
                /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
                // @ts-ignore
                const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
                    href: (__VLS_ctx.selectedApply.purchaseUrl),
                    target: "_blank",
                    type: "primary",
                    underline: (false),
                    ...{ class: "link-text-ellipsis" },
                }));
                const __VLS_151 = __VLS_150({
                    href: (__VLS_ctx.selectedApply.purchaseUrl),
                    target: "_blank",
                    type: "primary",
                    underline: (false),
                    ...{ class: "link-text-ellipsis" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_150));
                __VLS_152.slots.default;
                (__VLS_ctx.selectedApply.purchaseUrl);
                var __VLS_152;
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            }
            var __VLS_148;
            var __VLS_136;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-section mb-20" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-12" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar orange" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        const __VLS_153 = {}.ElDescriptions;
        /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
        // @ts-ignore
        const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
            column: (2),
            border: true,
            ...{ class: "custom-desc-table" },
        }));
        const __VLS_155 = __VLS_154({
            column: (2),
            border: true,
            ...{ class: "custom-desc-table" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_154));
        __VLS_156.slots.default;
        const __VLS_157 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
            label: "样品名称",
        }));
        const __VLS_159 = __VLS_158({
            label: "样品名称",
        }, ...__VLS_functionalComponentArgsRest(__VLS_158));
        __VLS_160.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-semibold text-bold" },
        });
        (__VLS_ctx.selectedApply.sampleName);
        var __VLS_160;
        const __VLS_161 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
            label: "购样数量",
        }));
        const __VLS_163 = __VLS_162({
            label: "购样数量",
        }, ...__VLS_functionalComponentArgsRest(__VLS_162));
        __VLS_164.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedApply.qty);
        var __VLS_164;
        const __VLS_165 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
            label: "购样单价",
        }));
        const __VLS_167 = __VLS_166({
            label: "购样单价",
        }, ...__VLS_functionalComponentArgsRest(__VLS_166));
        __VLS_168.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedApply.price);
        var __VLS_168;
        const __VLS_169 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
            label: "费用合计",
        }));
        const __VLS_171 = __VLS_170({
            label: "费用合计",
        }, ...__VLS_functionalComponentArgsRest(__VLS_170));
        __VLS_172.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "price-text font-bold" },
        });
        (__VLS_ctx.selectedApply.amount);
        var __VLS_172;
        if (__VLS_ctx.selectedApply.channel === '供应商') {
            const __VLS_173 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
                label: "是否可退款",
            }));
            const __VLS_175 = __VLS_174({
                label: "是否可退款",
            }, ...__VLS_functionalComponentArgsRest(__VLS_174));
            __VLS_176.slots.default;
            const __VLS_177 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
                type: (__VLS_ctx.selectedApply.isRefundable ? 'success' : 'info'),
                size: "small",
            }));
            const __VLS_179 = __VLS_178({
                type: (__VLS_ctx.selectedApply.isRefundable ? 'success' : 'info'),
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_178));
            __VLS_180.slots.default;
            (__VLS_ctx.selectedApply.isRefundable ? '是' : '否');
            var __VLS_180;
            var __VLS_176;
        }
        if (__VLS_ctx.selectedApply.channel === '供应商') {
            const __VLS_181 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
                label: "收款方式",
            }));
            const __VLS_183 = __VLS_182({
                label: "收款方式",
            }, ...__VLS_functionalComponentArgsRest(__VLS_182));
            __VLS_184.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.selectedApply.paymentMethod || '银行转账');
            var __VLS_184;
        }
        if (__VLS_ctx.selectedApply.channel === '供应商' && __VLS_ctx.selectedApply.isRefundable) {
            const __VLS_185 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
                label: "退款条款",
                span: (2),
            }));
            const __VLS_187 = __VLS_186({
                label: "退款条款",
                span: (2),
            }, ...__VLS_functionalComponentArgsRest(__VLS_186));
            __VLS_188.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "refund-policy" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "policy-tag" },
            });
            (__VLS_ctx.selectedApply.refundMethod || '抵扣首单');
            if (__VLS_ctx.selectedApply.refundCondition) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "policy-cond" },
                });
                (__VLS_ctx.selectedApply.refundCondition);
            }
            var __VLS_188;
        }
        var __VLS_156;
        if (__VLS_ctx.selectedApply.channel === '供应商') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "detail-section mb-20" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "section-title mb-12" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "title-bar purple" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            if (__VLS_ctx.selectedApply.paymentMethod === '银行转账') {
                const __VLS_189 = {}.ElDescriptions;
                /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
                // @ts-ignore
                const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
                    column: (2),
                    border: true,
                    ...{ class: "custom-desc-table" },
                }));
                const __VLS_191 = __VLS_190({
                    column: (2),
                    border: true,
                    ...{ class: "custom-desc-table" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_190));
                __VLS_192.slots.default;
                const __VLS_193 = {}.ElDescriptionsItem;
                /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
                // @ts-ignore
                const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
                    label: "开户行",
                }));
                const __VLS_195 = __VLS_194({
                    label: "开户行",
                }, ...__VLS_functionalComponentArgsRest(__VLS_194));
                __VLS_196.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (__VLS_ctx.selectedApply.bankName || '中国工商银行义乌支行');
                var __VLS_196;
                const __VLS_197 = {}.ElDescriptionsItem;
                /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
                // @ts-ignore
                const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
                    label: "账户名称",
                }));
                const __VLS_199 = __VLS_198({
                    label: "账户名称",
                }, ...__VLS_functionalComponentArgsRest(__VLS_198));
                __VLS_200.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (__VLS_ctx.selectedApply.accountName || '义乌得力商贸有限公司');
                var __VLS_200;
                const __VLS_201 = {}.ElDescriptionsItem;
                /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
                // @ts-ignore
                const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
                    label: "银行账号",
                    span: (2),
                }));
                const __VLS_203 = __VLS_202({
                    label: "银行账号",
                    span: (2),
                }, ...__VLS_functionalComponentArgsRest(__VLS_202));
                __VLS_204.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "font-semibold code-style" },
                });
                (__VLS_ctx.selectedApply.bankAccount || '6217 0038 9001 0293 848');
                var __VLS_204;
                var __VLS_192;
            }
            else {
                const __VLS_205 = {}.ElDescriptions;
                /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
                // @ts-ignore
                const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
                    column: (2),
                    border: true,
                    ...{ class: "custom-desc-table" },
                }));
                const __VLS_207 = __VLS_206({
                    column: (2),
                    border: true,
                    ...{ class: "custom-desc-table" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_206));
                __VLS_208.slots.default;
                const __VLS_209 = {}.ElDescriptionsItem;
                /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
                // @ts-ignore
                const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
                    label: "收款方式",
                }));
                const __VLS_211 = __VLS_210({
                    label: "收款方式",
                }, ...__VLS_functionalComponentArgsRest(__VLS_210));
                __VLS_212.slots.default;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                (__VLS_ctx.selectedApply.paymentMethod);
                var __VLS_212;
                const __VLS_213 = {}.ElDescriptionsItem;
                /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
                // @ts-ignore
                const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
                    label: "收款二维码",
                }));
                const __VLS_215 = __VLS_214({
                    label: "收款二维码",
                }, ...__VLS_functionalComponentArgsRest(__VLS_214));
                __VLS_216.slots.default;
                if (__VLS_ctx.selectedApply.paymentQrCode) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "attach-images" },
                    });
                    const __VLS_217 = {}.ElImage;
                    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
                    // @ts-ignore
                    const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
                        src: (__VLS_ctx.selectedApply.paymentQrCode),
                        previewSrcList: ([__VLS_ctx.selectedApply.paymentQrCode]),
                        fit: "cover",
                        ...{ class: "attach-img-preview" },
                        previewTeleported: true,
                    }));
                    const __VLS_219 = __VLS_218({
                        src: (__VLS_ctx.selectedApply.paymentQrCode),
                        previewSrcList: ([__VLS_ctx.selectedApply.paymentQrCode]),
                        fit: "cover",
                        ...{ class: "attach-img-preview" },
                        previewTeleported: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_218));
                }
                else {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "no-attach" },
                    });
                }
                var __VLS_216;
                var __VLS_208;
            }
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-section mb-20" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-12" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar green" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "attachments-grid" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "attach-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "attach-label" },
        });
        if (__VLS_ctx.selectedApply.image) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "attach-images" },
            });
            const __VLS_221 = {}.ElImage;
            /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
            // @ts-ignore
            const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
                src: (__VLS_ctx.selectedApply.image),
                previewSrcList: ([__VLS_ctx.selectedApply.image]),
                fit: "cover",
                ...{ class: "attach-img-preview" },
                previewTeleported: true,
            }));
            const __VLS_223 = __VLS_222({
                src: (__VLS_ctx.selectedApply.image),
                previewSrcList: ([__VLS_ctx.selectedApply.image]),
                fit: "cover",
                ...{ class: "attach-img-preview" },
                previewTeleported: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_222));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "no-attach" },
            });
        }
        if (__VLS_ctx.selectedApply.orderScreenshot) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "attach-group mt-12" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "attach-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "attach-images" },
            });
            const __VLS_225 = {}.ElImage;
            /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
            // @ts-ignore
            const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
                src: (__VLS_ctx.selectedApply.orderScreenshot),
                previewSrcList: ([__VLS_ctx.selectedApply.orderScreenshot]),
                fit: "cover",
                ...{ class: "attach-img-preview" },
                previewTeleported: true,
            }));
            const __VLS_227 = __VLS_226({
                src: (__VLS_ctx.selectedApply.orderScreenshot),
                previewSrcList: ([__VLS_ctx.selectedApply.orderScreenshot]),
                fit: "cover",
                ...{ class: "attach-img-preview" },
                previewTeleported: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_226));
        }
        if (['已通过', '同意', '已登记'].includes(__VLS_ctx.selectedApply.status) || __VLS_ctx.selectedApply.type === 'direct') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "sub-table-wrapper mt-24" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "sub-table-header" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "sub-table-title" },
            });
            (__VLS_ctx.selectedApply.registrations?.length || 0);
            const __VLS_229 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
                ...{ 'onClick': {} },
                type: "primary",
                size: "small",
                icon: (__VLS_ctx.Plus),
                ...{ class: "action-btn-styled" },
            }));
            const __VLS_231 = __VLS_230({
                ...{ 'onClick': {} },
                type: "primary",
                size: "small",
                icon: (__VLS_ctx.Plus),
                ...{ class: "action-btn-styled" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_230));
            let __VLS_233;
            let __VLS_234;
            let __VLS_235;
            const __VLS_236 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.feedbackData))
                        return;
                    if (!(__VLS_ctx.selectedCategory === 'purchase' && __VLS_ctx.selectedApply))
                        return;
                    if (!(['已通过', '同意', '已登记'].includes(__VLS_ctx.selectedApply.status) || __VLS_ctx.selectedApply.type === 'direct'))
                        return;
                    __VLS_ctx.handleRegisterSampleDirect(__VLS_ctx.selectedApply);
                }
            };
            __VLS_232.slots.default;
            var __VLS_232;
            const __VLS_237 = {}.ElTable;
            /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
            // @ts-ignore
            const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({
                data: (__VLS_ctx.selectedApply.registrations),
                size: "small",
                ...{ class: "premium-table-v4" },
                border: true,
            }));
            const __VLS_239 = __VLS_238({
                data: (__VLS_ctx.selectedApply.registrations),
                size: "small",
                ...{ class: "premium-table-v4" },
                border: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_238));
            __VLS_240.slots.default;
            const __VLS_241 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
                prop: "regNo",
                label: "登记单号",
                width: "120",
            }));
            const __VLS_243 = __VLS_242({
                prop: "regNo",
                label: "登记单号",
                width: "120",
            }, ...__VLS_functionalComponentArgsRest(__VLS_242));
            __VLS_244.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_244.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                const __VLS_245 = {}.ElLink;
                /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
                // @ts-ignore
                const __VLS_246 = __VLS_asFunctionalComponent(__VLS_245, new __VLS_245({
                    ...{ 'onClick': {} },
                    type: "primary",
                    ...{ class: "font-bold font-mono" },
                    underline: (false),
                }));
                const __VLS_247 = __VLS_246({
                    ...{ 'onClick': {} },
                    type: "primary",
                    ...{ class: "font-bold font-mono" },
                    underline: (false),
                }, ...__VLS_functionalComponentArgsRest(__VLS_246));
                let __VLS_249;
                let __VLS_250;
                let __VLS_251;
                const __VLS_252 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.feedbackData))
                            return;
                        if (!(__VLS_ctx.selectedCategory === 'purchase' && __VLS_ctx.selectedApply))
                            return;
                        if (!(['已通过', '同意', '已登记'].includes(__VLS_ctx.selectedApply.status) || __VLS_ctx.selectedApply.type === 'direct'))
                            return;
                        __VLS_ctx.handleSampleRegistrationDetail(row);
                    }
                };
                __VLS_248.slots.default;
                (row.regNo);
                var __VLS_248;
            }
            var __VLS_244;
            const __VLS_253 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_254 = __VLS_asFunctionalComponent(__VLS_253, new __VLS_253({
                prop: "status",
                label: "状态",
                width: "75",
                align: "center",
            }));
            const __VLS_255 = __VLS_254({
                prop: "status",
                label: "状态",
                width: "75",
                align: "center",
            }, ...__VLS_functionalComponentArgsRest(__VLS_254));
            __VLS_256.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_256.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: (['status-badge-pill', __VLS_ctx.getRegStatusClass(row.status)]) },
                });
                (row.status || '待提交');
            }
            var __VLS_256;
            const __VLS_257 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({
                label: "图片",
                width: "65",
                align: "center",
            }));
            const __VLS_259 = __VLS_258({
                label: "图片",
                width: "65",
                align: "center",
            }, ...__VLS_functionalComponentArgsRest(__VLS_258));
            __VLS_260.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_260.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                if (row.image) {
                    const __VLS_261 = {}.ElImage;
                    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
                    // @ts-ignore
                    const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
                        src: (row.image),
                        previewSrcList: ([row.image]),
                        fit: "cover",
                        ...{ class: "table-img" },
                        previewTeleported: true,
                    }));
                    const __VLS_263 = __VLS_262({
                        src: (row.image),
                        previewSrcList: ([row.image]),
                        fit: "cover",
                        ...{ class: "table-img" },
                        previewTeleported: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_262));
                }
                else {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "no-img-text" },
                    });
                }
            }
            var __VLS_260;
            const __VLS_265 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_266 = __VLS_asFunctionalComponent(__VLS_265, new __VLS_265({
                prop: "pattern",
                label: "图案",
                showOverflowTooltip: true,
            }));
            const __VLS_267 = __VLS_266({
                prop: "pattern",
                label: "图案",
                showOverflowTooltip: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_266));
            const __VLS_269 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_270 = __VLS_asFunctionalComponent(__VLS_269, new __VLS_269({
                prop: "color",
                label: "颜色",
                width: "80",
            }));
            const __VLS_271 = __VLS_270({
                prop: "color",
                label: "颜色",
                width: "80",
            }, ...__VLS_functionalComponentArgsRest(__VLS_270));
            const __VLS_273 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_274 = __VLS_asFunctionalComponent(__VLS_273, new __VLS_273({
                prop: "spec",
                label: "规格",
                width: "80",
            }));
            const __VLS_275 = __VLS_274({
                prop: "spec",
                label: "规格",
                width: "80",
            }, ...__VLS_functionalComponentArgsRest(__VLS_274));
            const __VLS_277 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_278 = __VLS_asFunctionalComponent(__VLS_277, new __VLS_277({
                prop: "sampleSize",
                label: "样品尺寸",
                width: "95",
            }));
            const __VLS_279 = __VLS_278({
                prop: "sampleSize",
                label: "样品尺寸",
                width: "95",
            }, ...__VLS_functionalComponentArgsRest(__VLS_278));
            const __VLS_281 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_282 = __VLS_asFunctionalComponent(__VLS_281, new __VLS_281({
                prop: "netWeight",
                label: "净重",
                width: "75",
            }));
            const __VLS_283 = __VLS_282({
                prop: "netWeight",
                label: "净重",
                width: "75",
            }, ...__VLS_functionalComponentArgsRest(__VLS_282));
            const __VLS_285 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_286 = __VLS_asFunctionalComponent(__VLS_285, new __VLS_285({
                label: "操作",
                width: "110",
                align: "center",
                fixed: "right",
            }));
            const __VLS_287 = __VLS_286({
                label: "操作",
                width: "110",
                align: "center",
                fixed: "right",
            }, ...__VLS_functionalComponentArgsRest(__VLS_286));
            __VLS_288.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_288.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ style: {} },
                });
                if (row.status === '待提交' || row.status === '已驳回') {
                    const __VLS_289 = {}.ElButton;
                    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                    // @ts-ignore
                    const __VLS_290 = __VLS_asFunctionalComponent(__VLS_289, new __VLS_289({
                        ...{ 'onClick': {} },
                        link: true,
                        type: "primary",
                        size: "small",
                        ...{ class: "table-edit-btn" },
                    }));
                    const __VLS_291 = __VLS_290({
                        ...{ 'onClick': {} },
                        link: true,
                        type: "primary",
                        size: "small",
                        ...{ class: "table-edit-btn" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_290));
                    let __VLS_293;
                    let __VLS_294;
                    let __VLS_295;
                    const __VLS_296 = {
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.feedbackData))
                                return;
                            if (!(__VLS_ctx.selectedCategory === 'purchase' && __VLS_ctx.selectedApply))
                                return;
                            if (!(['已通过', '同意', '已登记'].includes(__VLS_ctx.selectedApply.status) || __VLS_ctx.selectedApply.type === 'direct'))
                                return;
                            if (!(row.status === '待提交' || row.status === '已驳回'))
                                return;
                            __VLS_ctx.handleEditSampleRegistration(row);
                        }
                    };
                    __VLS_292.slots.default;
                    const __VLS_297 = {}.ElIcon;
                    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                    // @ts-ignore
                    const __VLS_298 = __VLS_asFunctionalComponent(__VLS_297, new __VLS_297({
                        ...{ class: "mr-2" },
                    }));
                    const __VLS_299 = __VLS_298({
                        ...{ class: "mr-2" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_298));
                    __VLS_300.slots.default;
                    const __VLS_301 = {}.Edit;
                    /** @type {[typeof __VLS_components.Edit, ]} */ ;
                    // @ts-ignore
                    const __VLS_302 = __VLS_asFunctionalComponent(__VLS_301, new __VLS_301({}));
                    const __VLS_303 = __VLS_302({}, ...__VLS_functionalComponentArgsRest(__VLS_302));
                    var __VLS_300;
                    var __VLS_292;
                }
                if (row.status === '待提交' || row.status === '已驳回') {
                    const __VLS_305 = {}.ElButton;
                    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                    // @ts-ignore
                    const __VLS_306 = __VLS_asFunctionalComponent(__VLS_305, new __VLS_305({
                        ...{ 'onClick': {} },
                        link: true,
                        type: "danger",
                        size: "small",
                        ...{ class: "table-edit-btn" },
                    }));
                    const __VLS_307 = __VLS_306({
                        ...{ 'onClick': {} },
                        link: true,
                        type: "danger",
                        size: "small",
                        ...{ class: "table-edit-btn" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_306));
                    let __VLS_309;
                    let __VLS_310;
                    let __VLS_311;
                    const __VLS_312 = {
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.feedbackData))
                                return;
                            if (!(__VLS_ctx.selectedCategory === 'purchase' && __VLS_ctx.selectedApply))
                                return;
                            if (!(['已通过', '同意', '已登记'].includes(__VLS_ctx.selectedApply.status) || __VLS_ctx.selectedApply.type === 'direct'))
                                return;
                            if (!(row.status === '待提交' || row.status === '已驳回'))
                                return;
                            __VLS_ctx.handleDeleteSampleRegistration(row);
                        }
                    };
                    __VLS_308.slots.default;
                    const __VLS_313 = {}.ElIcon;
                    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                    // @ts-ignore
                    const __VLS_314 = __VLS_asFunctionalComponent(__VLS_313, new __VLS_313({
                        ...{ class: "mr-2" },
                    }));
                    const __VLS_315 = __VLS_314({
                        ...{ class: "mr-2" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_314));
                    __VLS_316.slots.default;
                    const __VLS_317 = {}.Delete;
                    /** @type {[typeof __VLS_components.Delete, ]} */ ;
                    // @ts-ignore
                    const __VLS_318 = __VLS_asFunctionalComponent(__VLS_317, new __VLS_317({}));
                    const __VLS_319 = __VLS_318({}, ...__VLS_functionalComponentArgsRest(__VLS_318));
                    var __VLS_316;
                    var __VLS_308;
                }
                if (row.status !== '待提交' && row.status !== '已驳回') {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "text-placeholder" },
                    });
                }
            }
            var __VLS_288;
            var __VLS_240;
        }
    }
    if (__VLS_ctx.selectedCategory === 'direct' && __VLS_ctx.selectedDirectDetail) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-workspace-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-header-bar" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "header-left" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "header-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        (__VLS_ctx.selectedDirectDetail.regNo);
        const __VLS_321 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_322 = __VLS_asFunctionalComponent(__VLS_321, new __VLS_321({
            type: (__VLS_ctx.getDirectStatusTagType(__VLS_ctx.selectedDirectDetail.status)),
            size: "small",
            effect: "light",
            ...{ class: "ml-12 custom-status-tag" },
        }));
        const __VLS_323 = __VLS_322({
            type: (__VLS_ctx.getDirectStatusTagType(__VLS_ctx.selectedDirectDetail.status)),
            size: "small",
            effect: "light",
            ...{ class: "ml-12 custom-status-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_322));
        __VLS_324.slots.default;
        (__VLS_ctx.selectedDirectDetail.status);
        var __VLS_324;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "header-right" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "time-label" },
        });
        const __VLS_325 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_326 = __VLS_asFunctionalComponent(__VLS_325, new __VLS_325({}));
        const __VLS_327 = __VLS_326({}, ...__VLS_functionalComponentArgsRest(__VLS_326));
        __VLS_328.slots.default;
        const __VLS_329 = {}.Calendar;
        /** @type {[typeof __VLS_components.Calendar, ]} */ ;
        // @ts-ignore
        const __VLS_330 = __VLS_asFunctionalComponent(__VLS_329, new __VLS_329({}));
        const __VLS_331 = __VLS_330({}, ...__VLS_functionalComponentArgsRest(__VLS_330));
        var __VLS_328;
        (__VLS_ctx.selectedDirectDetail.receiveTime);
        if (__VLS_ctx.getDirectDuration(__VLS_ctx.selectedDirectDetail)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "time-label ml-16" },
            });
            const __VLS_333 = {}.ElTooltip;
            /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
            // @ts-ignore
            const __VLS_334 = __VLS_asFunctionalComponent(__VLS_333, new __VLS_333({
                placement: "top",
                effect: "dark",
            }));
            const __VLS_335 = __VLS_334({
                placement: "top",
                effect: "dark",
            }, ...__VLS_functionalComponentArgsRest(__VLS_334));
            __VLS_336.slots.default;
            {
                const { content: __VLS_thisSlot } = __VLS_336.slots;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
                __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
                __VLS_asFunctionalElement(__VLS_intrinsicElements.br)({});
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "duration-explain-trigger" },
            });
            const __VLS_337 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_338 = __VLS_asFunctionalComponent(__VLS_337, new __VLS_337({}));
            const __VLS_339 = __VLS_338({}, ...__VLS_functionalComponentArgsRest(__VLS_338));
            __VLS_340.slots.default;
            const __VLS_341 = {}.Clock;
            /** @type {[typeof __VLS_components.Clock, ]} */ ;
            // @ts-ignore
            const __VLS_342 = __VLS_asFunctionalComponent(__VLS_341, new __VLS_341({}));
            const __VLS_343 = __VLS_342({}, ...__VLS_functionalComponentArgsRest(__VLS_342));
            var __VLS_340;
            (__VLS_ctx.getDirectDuration(__VLS_ctx.selectedDirectDetail));
            const __VLS_345 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_346 = __VLS_asFunctionalComponent(__VLS_345, new __VLS_345({
                ...{ class: "ml-4 info-icon" },
            }));
            const __VLS_347 = __VLS_346({
                ...{ class: "ml-4 info-icon" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_346));
            __VLS_348.slots.default;
            const __VLS_349 = {}.QuestionFilled;
            /** @type {[typeof __VLS_components.QuestionFilled, ]} */ ;
            // @ts-ignore
            const __VLS_350 = __VLS_asFunctionalComponent(__VLS_349, new __VLS_349({}));
            const __VLS_351 = __VLS_350({}, ...__VLS_functionalComponentArgsRest(__VLS_350));
            var __VLS_348;
            var __VLS_336;
        }
        if (__VLS_ctx.selectedDirectDetail.status === '待提交' || __VLS_ctx.selectedDirectDetail.status === '已驳回') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ style: {} },
                ...{ class: "ml-16" },
            });
            const __VLS_353 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_354 = __VLS_asFunctionalComponent(__VLS_353, new __VLS_353({
                ...{ 'onClick': {} },
                link: true,
                type: "primary",
                icon: (__VLS_ctx.Edit),
                ...{ class: "header-action-link" },
            }));
            const __VLS_355 = __VLS_354({
                ...{ 'onClick': {} },
                link: true,
                type: "primary",
                icon: (__VLS_ctx.Edit),
                ...{ class: "header-action-link" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_354));
            let __VLS_357;
            let __VLS_358;
            let __VLS_359;
            const __VLS_360 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.feedbackData))
                        return;
                    if (!(__VLS_ctx.selectedCategory === 'direct' && __VLS_ctx.selectedDirectDetail))
                        return;
                    if (!(__VLS_ctx.selectedDirectDetail.status === '待提交' || __VLS_ctx.selectedDirectDetail.status === '已驳回'))
                        return;
                    __VLS_ctx.handleEditSampleRegistration(__VLS_ctx.selectedDirectDetail);
                }
            };
            __VLS_356.slots.default;
            var __VLS_356;
            const __VLS_361 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_362 = __VLS_asFunctionalComponent(__VLS_361, new __VLS_361({
                ...{ 'onClick': {} },
                link: true,
                type: "danger",
                icon: (__VLS_ctx.Delete),
                ...{ class: "header-action-link" },
            }));
            const __VLS_363 = __VLS_362({
                ...{ 'onClick': {} },
                link: true,
                type: "danger",
                icon: (__VLS_ctx.Delete),
                ...{ class: "header-action-link" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_362));
            let __VLS_365;
            let __VLS_366;
            let __VLS_367;
            const __VLS_368 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.feedbackData))
                        return;
                    if (!(__VLS_ctx.selectedCategory === 'direct' && __VLS_ctx.selectedDirectDetail))
                        return;
                    if (!(__VLS_ctx.selectedDirectDetail.status === '待提交' || __VLS_ctx.selectedDirectDetail.status === '已驳回'))
                        return;
                    __VLS_ctx.handleDeleteSampleRegistration(__VLS_ctx.selectedDirectDetail);
                }
            };
            __VLS_364.slots.default;
            var __VLS_364;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-section mb-20" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-12" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar blue" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        const __VLS_369 = {}.ElDescriptions;
        /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
        // @ts-ignore
        const __VLS_370 = __VLS_asFunctionalComponent(__VLS_369, new __VLS_369({
            column: (3),
            border: true,
            ...{ class: "custom-desc-table" },
        }));
        const __VLS_371 = __VLS_370({
            column: (3),
            border: true,
            ...{ class: "custom-desc-table" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_370));
        __VLS_372.slots.default;
        const __VLS_373 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_374 = __VLS_asFunctionalComponent(__VLS_373, new __VLS_373({
            label: "样品类型",
        }));
        const __VLS_375 = __VLS_374({
            label: "样品类型",
        }, ...__VLS_functionalComponentArgsRest(__VLS_374));
        __VLS_376.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.sampleType || '开发样');
        var __VLS_376;
        const __VLS_377 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_378 = __VLS_asFunctionalComponent(__VLS_377, new __VLS_377({
            label: "拿样渠道",
        }));
        const __VLS_379 = __VLS_378({
            label: "拿样渠道",
        }, ...__VLS_functionalComponentArgsRest(__VLS_378));
        __VLS_380.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.source || '供应商');
        var __VLS_380;
        if (__VLS_ctx.selectedDirectDetail.supplierName || __VLS_ctx.selectedDirectDetail.supplier) {
            const __VLS_381 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_382 = __VLS_asFunctionalComponent(__VLS_381, new __VLS_381({
                label: "供应商",
                span: (2),
            }));
            const __VLS_383 = __VLS_382({
                label: "供应商",
                span: (2),
            }, ...__VLS_functionalComponentArgsRest(__VLS_382));
            __VLS_384.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "font-medium" },
            });
            (__VLS_ctx.selectedDirectDetail.supplierName || __VLS_ctx.selectedDirectDetail.supplier || '长期合作-中山光源厂');
            var __VLS_384;
        }
        else if (__VLS_ctx.selectedDirectDetail.purchaseUrl) {
            const __VLS_385 = {}.ElDescriptionsItem;
            /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
            // @ts-ignore
            const __VLS_386 = __VLS_asFunctionalComponent(__VLS_385, new __VLS_385({
                label: "购买链接",
                span: (2),
            }));
            const __VLS_387 = __VLS_386({
                label: "购买链接",
                span: (2),
            }, ...__VLS_functionalComponentArgsRest(__VLS_386));
            __VLS_388.slots.default;
            const __VLS_389 = {}.ElLink;
            /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
            // @ts-ignore
            const __VLS_390 = __VLS_asFunctionalComponent(__VLS_389, new __VLS_389({
                href: (__VLS_ctx.selectedDirectDetail.purchaseUrl),
                target: "_blank",
                type: "primary",
                underline: (false),
                ...{ class: "link-text-ellipsis" },
            }));
            const __VLS_391 = __VLS_390({
                href: (__VLS_ctx.selectedDirectDetail.purchaseUrl),
                target: "_blank",
                type: "primary",
                underline: (false),
                ...{ class: "link-text-ellipsis" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_390));
            __VLS_392.slots.default;
            (__VLS_ctx.selectedDirectDetail.purchaseUrl);
            var __VLS_392;
            var __VLS_388;
        }
        const __VLS_393 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_394 = __VLS_asFunctionalComponent(__VLS_393, new __VLS_393({
            label: "样品费",
        }));
        const __VLS_395 = __VLS_394({
            label: "样品费",
        }, ...__VLS_functionalComponentArgsRest(__VLS_394));
        __VLS_396.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "price-text font-bold" },
        });
        (__VLS_ctx.selectedDirectDetail.sampleFee || '¥ 0.00');
        var __VLS_396;
        const __VLS_397 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_398 = __VLS_asFunctionalComponent(__VLS_397, new __VLS_397({
            label: "样品名称",
        }));
        const __VLS_399 = __VLS_398({
            label: "样品名称",
        }, ...__VLS_functionalComponentArgsRest(__VLS_398));
        __VLS_400.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-medium" },
        });
        (__VLS_ctx.selectedDirectDetail.name);
        var __VLS_400;
        const __VLS_401 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_402 = __VLS_asFunctionalComponent(__VLS_401, new __VLS_401({
            label: "款式",
        }));
        const __VLS_403 = __VLS_402({
            label: "款式",
        }, ...__VLS_functionalComponentArgsRest(__VLS_402));
        __VLS_404.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-medium" },
        });
        (__VLS_ctx.selectedDirectDetail.style || '经典系列');
        var __VLS_404;
        const __VLS_405 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_406 = __VLS_asFunctionalComponent(__VLS_405, new __VLS_405({
            label: "主材料",
        }));
        const __VLS_407 = __VLS_406({
            label: "主材料",
        }, ...__VLS_functionalComponentArgsRest(__VLS_406));
        __VLS_408.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.material || '亚克力');
        var __VLS_408;
        const __VLS_409 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_410 = __VLS_asFunctionalComponent(__VLS_409, new __VLS_409({
            label: "适用品牌/对象",
        }));
        const __VLS_411 = __VLS_410({
            label: "适用品牌/对象",
        }, ...__VLS_functionalComponentArgsRest(__VLS_410));
        __VLS_412.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.applicableTo || '通用');
        var __VLS_412;
        const __VLS_413 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_414 = __VLS_asFunctionalComponent(__VLS_413, new __VLS_413({
            label: "包装方式",
        }));
        const __VLS_415 = __VLS_414({
            label: "包装方式",
        }, ...__VLS_functionalComponentArgsRest(__VLS_414));
        __VLS_416.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.packagingMethod || '盒装');
        var __VLS_416;
        const __VLS_417 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_418 = __VLS_asFunctionalComponent(__VLS_417, new __VLS_417({
            label: "包装数量",
        }));
        const __VLS_419 = __VLS_418({
            label: "包装数量",
        }, ...__VLS_functionalComponentArgsRest(__VLS_418));
        __VLS_420.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.packagingQuantity || '1pack');
        var __VLS_420;
        const __VLS_421 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_422 = __VLS_asFunctionalComponent(__VLS_421, new __VLS_421({
            label: "样品特征",
        }));
        const __VLS_423 = __VLS_422({
            label: "样品特征",
        }, ...__VLS_functionalComponentArgsRest(__VLS_422));
        __VLS_424.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ style: {} },
        });
        const __VLS_425 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_426 = __VLS_asFunctionalComponent(__VLS_425, new __VLS_425({
            size: "small",
            type: (__VLS_ctx.selectedDirectDetail.hasBattery ? 'danger' : 'info'),
            effect: "light",
        }));
        const __VLS_427 = __VLS_426({
            size: "small",
            type: (__VLS_ctx.selectedDirectDetail.hasBattery ? 'danger' : 'info'),
            effect: "light",
        }, ...__VLS_functionalComponentArgsRest(__VLS_426));
        __VLS_428.slots.default;
        (__VLS_ctx.selectedDirectDetail.hasBattery ? '带电' : '不带电');
        var __VLS_428;
        const __VLS_429 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_430 = __VLS_asFunctionalComponent(__VLS_429, new __VLS_429({
            size: "small",
            type: (__VLS_ctx.selectedDirectDetail.isCE ? 'success' : 'info'),
            effect: "light",
        }));
        const __VLS_431 = __VLS_430({
            size: "small",
            type: (__VLS_ctx.selectedDirectDetail.isCE ? 'success' : 'info'),
            effect: "light",
        }, ...__VLS_functionalComponentArgsRest(__VLS_430));
        __VLS_432.slots.default;
        (__VLS_ctx.selectedDirectDetail.isCE ? 'CE认证' : '无CE');
        var __VLS_432;
        var __VLS_424;
        var __VLS_372;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-section mb-20" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-12" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar orange" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        const __VLS_433 = {}.ElDescriptions;
        /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
        // @ts-ignore
        const __VLS_434 = __VLS_asFunctionalComponent(__VLS_433, new __VLS_433({
            column: (3),
            border: true,
            ...{ class: "custom-desc-table" },
        }));
        const __VLS_435 = __VLS_434({
            column: (3),
            border: true,
            ...{ class: "custom-desc-table" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_434));
        __VLS_436.slots.default;
        const __VLS_437 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_438 = __VLS_asFunctionalComponent(__VLS_437, new __VLS_437({
            label: "规格",
        }));
        const __VLS_439 = __VLS_438({
            label: "规格",
        }, ...__VLS_functionalComponentArgsRest(__VLS_438));
        __VLS_440.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.spec || '通用');
        var __VLS_440;
        const __VLS_441 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_442 = __VLS_asFunctionalComponent(__VLS_441, new __VLS_441({
            label: "颜色",
        }));
        const __VLS_443 = __VLS_442({
            label: "颜色",
        }, ...__VLS_functionalComponentArgsRest(__VLS_442));
        __VLS_444.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-medium" },
        });
        (__VLS_ctx.selectedDirectDetail.color || '-');
        var __VLS_444;
        const __VLS_445 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_446 = __VLS_asFunctionalComponent(__VLS_445, new __VLS_445({
            label: "图案",
        }));
        const __VLS_447 = __VLS_446({
            label: "图案",
        }, ...__VLS_functionalComponentArgsRest(__VLS_446));
        __VLS_448.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.pattern || '-');
        var __VLS_448;
        const __VLS_449 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_450 = __VLS_asFunctionalComponent(__VLS_449, new __VLS_449({
            label: "样品尺寸",
            span: (2),
        }));
        const __VLS_451 = __VLS_450({
            label: "样品尺寸",
            span: (2),
        }, ...__VLS_functionalComponentArgsRest(__VLS_450));
        __VLS_452.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-medium" },
        });
        (__VLS_ctx.selectedDirectDetail.sampleSize || '-');
        var __VLS_452;
        const __VLS_453 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_454 = __VLS_asFunctionalComponent(__VLS_453, new __VLS_453({
            label: "净重",
        }));
        const __VLS_455 = __VLS_454({
            label: "净重",
        }, ...__VLS_functionalComponentArgsRest(__VLS_454));
        __VLS_456.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.netWeight || '-');
        var __VLS_456;
        const __VLS_457 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_458 = __VLS_asFunctionalComponent(__VLS_457, new __VLS_457({
            label: "包装尺寸",
            span: (2),
        }));
        const __VLS_459 = __VLS_458({
            label: "包装尺寸",
            span: (2),
        }, ...__VLS_functionalComponentArgsRest(__VLS_458));
        __VLS_460.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.packagingSize || '-');
        var __VLS_460;
        const __VLS_461 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_462 = __VLS_asFunctionalComponent(__VLS_461, new __VLS_461({
            label: "尺码",
        }));
        const __VLS_463 = __VLS_462({
            label: "尺码",
        }, ...__VLS_functionalComponentArgsRest(__VLS_462));
        __VLS_464.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.size || '-');
        var __VLS_464;
        const __VLS_465 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_466 = __VLS_asFunctionalComponent(__VLS_465, new __VLS_465({
            label: "直径",
        }));
        const __VLS_467 = __VLS_466({
            label: "直径",
        }, ...__VLS_functionalComponentArgsRest(__VLS_466));
        __VLS_468.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.diameter || '-');
        var __VLS_468;
        const __VLS_469 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_470 = __VLS_asFunctionalComponent(__VLS_469, new __VLS_469({
            label: "容量",
        }));
        const __VLS_471 = __VLS_470({
            label: "容量",
        }, ...__VLS_functionalComponentArgsRest(__VLS_470));
        __VLS_472.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.capacity || '-');
        var __VLS_472;
        var __VLS_436;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-section mb-20" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-12" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar purple" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        const __VLS_473 = {}.ElDescriptions;
        /** @type {[typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, typeof __VLS_components.ElDescriptions, typeof __VLS_components.elDescriptions, ]} */ ;
        // @ts-ignore
        const __VLS_474 = __VLS_asFunctionalComponent(__VLS_473, new __VLS_473({
            column: (4),
            border: true,
            ...{ class: "custom-desc-table" },
        }));
        const __VLS_475 = __VLS_474({
            column: (4),
            border: true,
            ...{ class: "custom-desc-table" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_474));
        __VLS_476.slots.default;
        const __VLS_477 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_478 = __VLS_asFunctionalComponent(__VLS_477, new __VLS_477({
            label: "初次报价",
        }));
        const __VLS_479 = __VLS_478({
            label: "初次报价",
        }, ...__VLS_functionalComponentArgsRest(__VLS_478));
        __VLS_480.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "price-text font-bold" },
        });
        (__VLS_ctx.selectedDirectDetail.initialQuote !== undefined && __VLS_ctx.selectedDirectDetail.initialQuote !== null ? '¥ ' + __VLS_ctx.selectedDirectDetail.initialQuote : '-');
        var __VLS_480;
        const __VLS_481 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_482 = __VLS_asFunctionalComponent(__VLS_481, new __VLS_481({
            label: "税率",
        }));
        const __VLS_483 = __VLS_482({
            label: "税率",
        }, ...__VLS_functionalComponentArgsRest(__VLS_482));
        __VLS_484.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.taxRate !== undefined && __VLS_ctx.selectedDirectDetail.taxRate !== null ? __VLS_ctx.selectedDirectDetail.taxRate + ' %' : '-');
        var __VLS_484;
        const __VLS_485 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_486 = __VLS_asFunctionalComponent(__VLS_485, new __VLS_485({
            label: "起订量",
        }));
        const __VLS_487 = __VLS_486({
            label: "起订量",
        }, ...__VLS_functionalComponentArgsRest(__VLS_486));
        __VLS_488.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.moq !== undefined && __VLS_ctx.selectedDirectDetail.moq !== null ? __VLS_ctx.selectedDirectDetail.moq + ' 个' : '-');
        var __VLS_488;
        const __VLS_489 = {}.ElDescriptionsItem;
        /** @type {[typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, typeof __VLS_components.ElDescriptionsItem, typeof __VLS_components.elDescriptionsItem, ]} */ ;
        // @ts-ignore
        const __VLS_490 = __VLS_asFunctionalComponent(__VLS_489, new __VLS_489({
            label: "生产周期",
        }));
        const __VLS_491 = __VLS_490({
            label: "生产周期",
        }, ...__VLS_functionalComponentArgsRest(__VLS_490));
        __VLS_492.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.selectedDirectDetail.productionCycle !== undefined && __VLS_ctx.selectedDirectDetail.productionCycle !== null ? __VLS_ctx.selectedDirectDetail.productionCycle + ' 天' : '-');
        var __VLS_492;
        var __VLS_476;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-section mb-10" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "section-title mb-12" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title-bar green" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "attachments-grid" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "attach-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "attach-label" },
        });
        if (__VLS_ctx.selectedDirectDetail.image) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "attach-images" },
            });
            const __VLS_493 = {}.ElImage;
            /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
            // @ts-ignore
            const __VLS_494 = __VLS_asFunctionalComponent(__VLS_493, new __VLS_493({
                src: (__VLS_ctx.selectedDirectDetail.image),
                previewSrcList: ([__VLS_ctx.selectedDirectDetail.image]),
                fit: "cover",
                ...{ class: "attach-img-preview" },
                previewTeleported: true,
            }));
            const __VLS_495 = __VLS_494({
                src: (__VLS_ctx.selectedDirectDetail.image),
                previewSrcList: ([__VLS_ctx.selectedDirectDetail.image]),
                fit: "cover",
                ...{ class: "attach-img-preview" },
                previewTeleported: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_494));
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "no-attach" },
            });
        }
        if (__VLS_ctx.selectedDirectDetail.qualifications && __VLS_ctx.selectedDirectDetail.qualifications.length > 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "attach-group mt-12" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "attach-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "qual-links" },
            });
            for (const [file, i] of __VLS_getVForSourceType((__VLS_ctx.selectedDirectDetail.qualifications))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: (i),
                    ...{ class: "qual-link-item" },
                });
                const __VLS_497 = {}.ElLink;
                /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
                // @ts-ignore
                const __VLS_498 = __VLS_asFunctionalComponent(__VLS_497, new __VLS_497({
                    type: "primary",
                    underline: (false),
                    href: (file.url),
                    target: "_blank",
                }));
                const __VLS_499 = __VLS_498({
                    type: "primary",
                    underline: (false),
                    href: (file.url),
                    target: "_blank",
                }, ...__VLS_functionalComponentArgsRest(__VLS_498));
                __VLS_500.slots.default;
                (file.name);
                var __VLS_500;
            }
        }
        if (__VLS_ctx.selectedDirectDetail.description) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "desc-group mt-12" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "attach-label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "desc-content" },
            });
            (__VLS_ctx.selectedDirectDetail.description);
        }
    }
    if (!__VLS_ctx.purchaseList.length && !__VLS_ctx.directRegistrations.length) {
        const __VLS_501 = {}.ElEmpty;
        /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
        // @ts-ignore
        const __VLS_502 = __VLS_asFunctionalComponent(__VLS_501, new __VLS_501({
            description: "暂无关联单据数据",
            ...{ class: "custom-empty" },
        }));
        const __VLS_503 = __VLS_502({
            description: "暂无关联单据数据",
            ...{ class: "custom-empty" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_502));
    }
}
/** @type {[typeof PurchaseDetailDialog, ]} */ ;
// @ts-ignore
const __VLS_505 = __VLS_asFunctionalComponent(PurchaseDetailDialog, new PurchaseDetailDialog({
    ref: "purchaseDetailRef",
}));
const __VLS_506 = __VLS_505({
    ref: "purchaseDetailRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_505));
/** @type {typeof __VLS_ctx.purchaseDetailRef} */ ;
var __VLS_508 = {};
var __VLS_507;
/** @type {[typeof PurchaseApplyDialog, ]} */ ;
// @ts-ignore
const __VLS_510 = __VLS_asFunctionalComponent(PurchaseApplyDialog, new PurchaseApplyDialog({
    ...{ 'onSubmit': {} },
    ref: "purchaseApplyRef",
}));
const __VLS_511 = __VLS_510({
    ...{ 'onSubmit': {} },
    ref: "purchaseApplyRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_510));
let __VLS_513;
let __VLS_514;
let __VLS_515;
const __VLS_516 = {
    onSubmit: (__VLS_ctx.handlePurchaseApplySubmit)
};
/** @type {typeof __VLS_ctx.purchaseApplyRef} */ ;
var __VLS_517 = {};
var __VLS_512;
/** @type {[typeof SampleRegistrationDialog, ]} */ ;
// @ts-ignore
const __VLS_519 = __VLS_asFunctionalComponent(SampleRegistrationDialog, new SampleRegistrationDialog({
    ...{ 'onRefresh': {} },
    ref: "sampleRegistrationRef",
}));
const __VLS_520 = __VLS_519({
    ...{ 'onRefresh': {} },
    ref: "sampleRegistrationRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_519));
let __VLS_522;
let __VLS_523;
let __VLS_524;
const __VLS_525 = {
    onRefresh: (__VLS_ctx.handleSampleRegistrationSubmit)
};
/** @type {typeof __VLS_ctx.sampleRegistrationRef} */ ;
var __VLS_526 = {};
var __VLS_521;
/** @type {[typeof SampleRegistrationDetailDialog, ]} */ ;
// @ts-ignore
const __VLS_528 = __VLS_asFunctionalComponent(SampleRegistrationDetailDialog, new SampleRegistrationDetailDialog({
    ref: "sampleRegistrationDetailRef",
}));
const __VLS_529 = __VLS_528({
    ref: "sampleRegistrationDetailRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_528));
/** @type {typeof __VLS_ctx.sampleRegistrationDetailRef} */ ;
var __VLS_531 = {};
var __VLS_530;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['premium-drawer']} */ ;
/** @type {__VLS_StyleScopedClasses['drawer-header-v4']} */ ;
/** @type {__VLS_StyleScopedClasses['title-main']} */ ;
/** @type {__VLS_StyleScopedClasses['title-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['title-text']} */ ;
/** @type {__VLS_StyleScopedClasses['workspace-container']} */ ;
/** @type {__VLS_StyleScopedClasses['workspace-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-block']} */ ;
/** @type {__VLS_StyleScopedClasses['context-card']} */ ;
/** @type {__VLS_StyleScopedClasses['block-header']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title-text']} */ ;
/** @type {__VLS_StyleScopedClasses['context-details']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-value']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ctx-value']} */ ;
/** @type {__VLS_StyleScopedClasses['price-highlight']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-kpis']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-box']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-num']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-lbl']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-box']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-num']} */ ;
/** @type {__VLS_StyleScopedClasses['kpi-lbl']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-block']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-list-card']} */ ;
/** @type {__VLS_StyleScopedClasses['block-header']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title-text']} */ ;
/** @type {__VLS_StyleScopedClasses['master-navigation-list']} */ ;
/** @type {__VLS_StyleScopedClasses['master-nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-top']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-no']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-left']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-price']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-duration']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['info-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-reg-count']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-approval-nodes']} */ ;
/** @type {__VLS_StyleScopedClasses['approval-nodes-flow']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-node']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-node-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-node-text']} */ ;
/** @type {__VLS_StyleScopedClasses['node-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['master-nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-top']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-no']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-name-row']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-name']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-meta-val']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-left']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-type-text']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-duration']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
/** @type {__VLS_StyleScopedClasses['info-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['workspace-main']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-workspace-card']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-header-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['header-title']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-status-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['header-right']} */ ;
/** @type {__VLS_StyleScopedClasses['time-label']} */ ;
/** @type {__VLS_StyleScopedClasses['time-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-explain-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['info-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
/** @type {__VLS_StyleScopedClasses['header-action-link']} */ ;
/** @type {__VLS_StyleScopedClasses['header-action-link']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['link-text-ellipsis']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['orange']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['refund-policy']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['policy-cond']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['purple']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['code-style']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-images']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-img-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['no-attach']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['attachments-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-group']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-label']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-images']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-img-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['no-attach']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-group']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-label']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-images']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-img-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-table-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-table-header']} */ ;
/** @type {__VLS_StyleScopedClasses['sub-table-title']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn-styled']} */ ;
/** @type {__VLS_StyleScopedClasses['premium-table-v4']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['table-img']} */ ;
/** @type {__VLS_StyleScopedClasses['no-img-text']} */ ;
/** @type {__VLS_StyleScopedClasses['table-edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['table-edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-workspace-card']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-header-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['header-title']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-status-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['header-right']} */ ;
/** @type {__VLS_StyleScopedClasses['time-label']} */ ;
/** @type {__VLS_StyleScopedClasses['time-label']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-explain-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['info-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
/** @type {__VLS_StyleScopedClasses['header-action-link']} */ ;
/** @type {__VLS_StyleScopedClasses['header-action-link']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['link-text-ellipsis']} */ ;
/** @type {__VLS_StyleScopedClasses['price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['orange']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['purple']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-desc-table']} */ ;
/** @type {__VLS_StyleScopedClasses['price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-10']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['title-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['attachments-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-group']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-label']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-images']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-img-preview']} */ ;
/** @type {__VLS_StyleScopedClasses['no-attach']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-group']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-label']} */ ;
/** @type {__VLS_StyleScopedClasses['qual-links']} */ ;
/** @type {__VLS_StyleScopedClasses['qual-link-item']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-group']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['attach-label']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-content']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-empty']} */ ;
// @ts-ignore
var __VLS_509 = __VLS_508, __VLS_518 = __VLS_517, __VLS_527 = __VLS_526, __VLS_532 = __VLS_531;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Document: Document,
            Clock: Clock,
            ArrowRight: ArrowRight,
            Plus: Plus,
            Edit: Edit,
            Delete: Delete,
            Calendar: Calendar,
            QuestionFilled: QuestionFilled,
            PurchaseDetailDialog: PurchaseDetailDialog,
            PurchaseApplyDialog: PurchaseApplyDialog,
            SampleRegistrationDialog: SampleRegistrationDialog,
            SampleRegistrationDetailDialog: SampleRegistrationDetailDialog,
            purchaseDetailRef: purchaseDetailRef,
            purchaseApplyRef: purchaseApplyRef,
            sampleRegistrationRef: sampleRegistrationRef,
            sampleRegistrationDetailRef: sampleRegistrationDetailRef,
            handleEditPurchase: handleEditPurchase,
            handleDeletePurchase: handleDeletePurchase,
            handleSampleRegistrationDetail: handleSampleRegistrationDetail,
            handleEditSampleRegistration: handleEditSampleRegistration,
            handleSampleRegistrationSubmit: handleSampleRegistrationSubmit,
            handleDeleteSampleRegistration: handleDeleteSampleRegistration,
            getRegStatusClass: getRegStatusClass,
            getPurchaseDuration: getPurchaseDuration,
            handleRegisterSampleDirect: handleRegisterSampleDirect,
            handlePurchaseApplySubmit: handlePurchaseApplySubmit,
            visible: visible,
            feedbackData: feedbackData,
            purchaseList: purchaseList,
            directRegistrations: directRegistrations,
            isSpotSample: isSpotSample,
            selectedCategory: selectedCategory,
            selectedApplyNo: selectedApplyNo,
            selectedDirectRegNo: selectedDirectRegNo,
            selectedApply: selectedApply,
            selectedDirectDetail: selectedDirectDetail,
            getDirectStatusTagType: getDirectStatusTagType,
            getDirectDuration: getDirectDuration,
            drawerSize: drawerSize,
            getTotalRegCount: getTotalRegCount,
            getStatusTagType: getStatusTagType,
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
//# sourceMappingURL=ExecutionDetailDrawer.vue.js.map