/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Clock, CopyDocument, Document, Management } from '@element-plus/icons-vue';
import CustomFeedbackDialog from './components/CustomFeedbackDialog.vue';
import PurchaseApplyDialog from './components/PurchaseApplyDialog.vue';
import PurchaseDetailDialog from './components/PurchaseDetailDialog.vue';
import SampleRegistrationDialog from './components/SampleRegistrationDialog.vue';
import SampleRegistrationDetailDialog from './components/SampleRegistrationDetailDialog.vue';
import ExecutionDetailDrawer from './components/ExecutionDetailDrawer.vue';
const searchQuery = ref('');
const activeTab = ref('accepted');
const currentTask = ref(null);
const customFeedbackRef = ref(null);
const purchaseApplyRef = ref(null);
const purchaseDetailRef = ref(null);
const sampleRegistrationRef = ref(null);
const sampleRegistrationDetailRef = ref(null);
const executionDetailDrawerRef = ref(null);
const daysTooltipContent = computed(() => {
    if (activeTab.value === 'unfinished') {
        return '计算逻辑：当前时间-任务发布时间';
    }
    if (activeTab.value === 'accepted') {
        return '计算逻辑：当前时间-任务承接时间';
    }
    if (activeTab.value === 'completed') {
        return '计算逻辑：任务完成时间-任务发布时间';
    }
    return '';
});
const statusTabs = [
    { label: '未完成', value: 'unfinished' },
    { label: '已承接', value: 'accepted' },
    { label: '已完成', value: 'completed' },
    { label: '购样申请', value: 'purchase_apply' },
    { label: '样品待反馈', value: 'sample_feedback' }
];
const steps = ['任务发布', '任务承接', '定制反馈', '购样申请', '费用审批', '样品登记', '开发反馈', '任务归档'];
const tableData = ref([
    {
        image: 'https://picsum.photos/100/100?random=1',
        proposalNo: 'TA-202605049',
        productName: 'DIY灯光板 - 亚克力透明款',
        pm: '颜沙沙',
        sampleMethodText: '现货拿样',
        category: '家居装饰',
        remainingDays: 7,
        isUrgent: true,
        style: '透明款',
        material: '亚克力',
        model: 'DIY-001',
        applicableTo: '通用',
        spu: 'SPU001',
        brand: 'MoKo',
        logoPosition: '侧面',
        packagingMethod: '盒装',
        buyQty: '100',
        totalAmount: '2,000.00',
        launchTime: '2026-06-30',
        bottomLinePrice: '32 CNY',
        styleRequirement: '透明无划痕，边缘光滑',
        materialRequirement: '高透亚克力，厚度不低于3mm',
        colorRequirement: '无色透明',
        weightRequirement: '单品重量不超过150g',
        functionRequirement: '防尘、通透度好',
        packagingRequirement: '独立OPP袋+气泡袋保护',
        certRequirement: '无',
        brandRequirement: '通用',
        patternRequirement: '无图案',
        sizeRequirement: '适配 20*20*15cm 的拼图成品',
        packQtyRequirement: '1个/盒',
        accessoryRequirement: '无',
        complianceRequirement: '符合玩具安全标准 EN71',
        supplementaryRequirement: '请重点确认材质的防刮擦性能',
        acceptors: ['张三', '李四']
    },
    {
        image: 'https://picsum.photos/100/100?random=11',
        proposalNo: 'TA-202605061',
        productName: '折叠笔记本支架 - 加厚版',
        pm: '赵敏',
        sampleMethodText: '现货拿样',
        category: '数码配件',
        remainingDays: 5,
        isUrgent: true,
        style: '加厚版',
        material: '铝合金',
        model: 'NB-ST01',
        applicableTo: '笔记本电脑',
        spu: 'SPU002',
        brand: 'MoKo',
        logoPosition: '面板',
        packagingMethod: '盒装',
        buyQty: '200',
        totalAmount: '8,000.00',
        launchTime: '2026-07-10',
        acceptors: ['王五']
    },
    {
        image: 'https://picsum.photos/200/200?random=25',
        proposalNo: 'TA-202605069',
        productName: '电子墨水屏阅读器',
        pm: '李健',
        sampleMethodText: '定制拿样',
        category: '智能硬件',
        remainingDays: 11,
        isUrgent: false,
        style: '墨水屏Pro版',
        material: '复合塑胶 + 电子墨水屏',
        model: 'EP-2026-V1',
        applicableTo: '商务人士',
        spu: 'SPU882910',
        brand: 'MoKo',
        logoPosition: '背面',
        packagingMethod: '礼盒装',
        buyQty: '500',
        totalAmount: '115,000.00',
        launchTime: '2026-07-15',
        acceptors: []
    },
    {
        image: 'https://picsum.photos/200/200?random=22',
        proposalNo: 'TA-202605066',
        productName: '多功能露营灯',
        pm: '颜沙沙',
        sampleMethodText: '现货拿样',
        category: '户外运动',
        remainingDays: 11,
        isUrgent: false,
        style: '多功能款',
        material: 'ABS',
        model: 'CP-L01',
        applicableTo: '露营爱好者',
        spu: 'SPU004',
        brand: 'MoKo',
        logoPosition: '顶部',
        packagingMethod: '彩盒',
        buyQty: '300',
        totalAmount: '5,000.00',
        launchTime: '2026-08-01',
        acceptors: ['李四', '赵铁柱']
    },
    {
        image: 'https://picsum.photos/200/200?random=24',
        proposalNo: 'TA-202605068',
        productName: '桌面加湿器 - 极简版',
        pm: '邓紫棋',
        sampleMethodText: '现货拿样',
        category: '生活电器',
        remainingDays: 13,
        isUrgent: false,
        style: '极简版',
        material: 'PP',
        model: 'HM-D01',
        applicableTo: '通用',
        spu: 'SPU005',
        brand: 'MoKo',
        logoPosition: '正面',
        packagingMethod: '白盒',
        buyQty: '1000',
        totalAmount: '12,000.00',
        launchTime: '2026-09-01',
        acceptors: []
    },
    {
        image: 'https://picsum.photos/200/200?random=26',
        proposalNo: 'TA-202605070',
        productName: '机械键盘 - 复古款',
        pm: '颜沙沙',
        sampleMethodText: '现货拿样',
        category: '数码配件',
        remainingDays: 12,
        isUrgent: false,
        style: '复古款',
        material: 'PBT',
        model: 'KB-R01',
        applicableTo: '电脑用户',
        spu: 'SPU006',
        brand: 'MoKo',
        logoPosition: '底部',
        packagingMethod: '礼盒',
        buyQty: '150',
        totalAmount: '15,000.00',
        launchTime: '2026-10-15',
        acceptors: ['张三']
    }
]);
currentTask.value = tableData.value[2];
const urgentTasks = computed(() => tableData.value.filter(i => i.isUrgent));
const normalTasks = computed(() => tableData.value.filter(i => !i.isUrgent));
const getStepStatus = (index) => {
    if (index < 1)
        return 'done';
    if (index === 1)
        return 'active';
    return 'pending';
};
const handleAcceptTask = () => {
    if (!currentTask.value)
        return;
    if (!currentTask.value.acceptors) {
        currentTask.value.acceptors = [];
    }
    if (currentTask.value.acceptors.includes('我')) {
        ElMessage.warning('您已经承接了该任务');
        return;
    }
    ElMessageBox.confirm(`确定要承接提案任务吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        buttonSize: 'small'
    }).then(() => {
        currentTask.value.acceptors.push('我');
        ElMessage.success('任务承接成功');
    }).catch(() => { });
};
const handleCustomFeedback = () => {
    customFeedbackRef.value?.open();
};
const handlePurchaseApply = (row) => {
    console.log('Opening Purchase Apply Dialog', row);
    if (purchaseApplyRef.value) {
        const data = row ? { ...row } : {};
        if (currentTask.value?.sampleMethodText === '现货拿样' && !data.feeType) {
            data.feeType = '购样费';
        }
        purchaseApplyRef.value.open(data);
    }
    else {
        console.error('purchaseApplyRef is not initialized');
    }
};
const handlePurchaseDetail = (row) => {
    purchaseDetailRef.value?.open(row);
};
const handlePurchaseEdit = (row) => {
    purchaseApplyRef.value?.open(row);
};
const handlePurchaseDelete = (row) => {
    ElMessageBox.confirm(`确定要删除购样申请 ${row.applyNo} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'small'
    }).then(() => {
        const index = purchaseListData.value.findIndex(i => i.applyNo === row.applyNo);
        if (index !== -1) {
            purchaseListData.value.splice(index, 1);
            ElMessage.success('删除成功');
        }
    }).catch(() => { });
};
const handlePurchaseApplySubmit = (items) => {
    if (!items)
        return;
    items.forEach(item => {
        const idx = purchaseListData.value.findIndex(p => p.applyNo === item.applyNo);
        if (idx !== -1) {
            purchaseListData.value[idx] = { ...purchaseListData.value[idx], ...item };
            ElMessage.success('保存成功');
        }
        else {
            const newApplyNo = 'PO-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900);
            purchaseListData.value.push({
                ...item,
                applyNo: newApplyNo,
                status: '待提交',
                applyTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
                registrations: []
            });
            ElMessage.success('成功发起购样申请');
        }
    });
};
const getStatusTagType = (status) => {
    switch (status) {
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
const purchaseListData = ref([
    {
        applyNo: 'PO-20260524-01',
        sampleName: 'DIY灯光板样品',
        channel: '1688',
        purchaseUrl: 'https://detail.1688.com/offer/6791028391.html',
        qty: 10,
        price: '¥ 15.00',
        amount: '¥ 150.00',
        feeType: '购样费',
        status: '待提交',
        applyTime: '2026-06-03 17:00'
    },
    {
        applyNo: 'PO-20260524-02',
        sampleName: '亚克力保护外壳',
        channel: '供应商',
        supplier: '线下-深圳供应商',
        qty: 1,
        price: '¥ 200.00',
        amount: '¥ 200.00',
        feeType: '打样费',
        status: '待审批',
        applyTime: '2026-06-03 14:00'
    },
    {
        applyNo: 'PO-20260524-03',
        sampleName: '折叠笔记本底座',
        channel: '供应商',
        supplier: '长期合作-东莞五金厂',
        qty: 2,
        price: '¥ 4000.00',
        amount: '¥ 8000.00',
        feeType: '开模费',
        status: '待更新合同',
        applyTime: '2026-06-01 09:30',
        contractFiles: [{ name: '五金底座开模合同.pdf', url: '#' }],
        contractAmount: 8000,
        contractRemark: '模具产权归我司，订单满5万件退还'
    },
    {
        applyNo: 'PO-20260524-04',
        sampleName: '发光LED灯珠小样',
        channel: '淘宝',
        purchaseUrl: 'https://item.taobao.com/item.htm?id=12891923',
        qty: 50,
        price: '¥ 1.20',
        amount: '¥ 60.00',
        feeType: '购样费',
        status: '同意',
        applyTime: '2026-05-21 14:00',
        registrations: [
            {
                regNo: 'DJ-20260603-10',
                pattern: '高亮红光',
                color: '红色',
                spec: '3mm圆头',
                sampleSize: '3*3*5mm',
                netWeight: '0.01kg',
                status: '待提交',
                image: 'https://picsum.photos/60/60?random=15'
            }
        ]
    },
    {
        applyNo: 'PO-20260524-05',
        sampleName: '多功能露营灯外壳',
        channel: '1688',
        purchaseUrl: 'https://detail.1688.com/offer/982103982.html',
        qty: 2,
        price: '¥ 35.00',
        amount: '¥ 70.00',
        feeType: '购样费',
        status: '不同意',
        applyTime: '2026-06-02 10:00'
    },
    {
        applyNo: 'DJ-20260603-12',
        sampleName: '亚克力外壳拼图框样品',
        channel: '供应商',
        supplier: '长期合作-中山光源厂',
        qty: 1,
        price: '¥ 0.00',
        amount: '免费',
        feeType: '无',
        status: '已登记',
        type: 'direct',
        applyTime: '2026-06-03 18:00',
        registrations: [
            {
                regNo: 'DJ-20260603-12',
                name: '亚克力外壳拼图框样品',
                pattern: '无',
                color: '透明',
                spec: '通用',
                sampleSize: '20×20×15 cm',
                netWeight: '120g',
                status: '有效',
                image: 'https://picsum.photos/60/60?random=18'
            }
        ]
    },
    {
        applyNo: 'DJ-20260603-13',
        sampleName: 'LED高亮红光灯珠配件',
        channel: '淘宝',
        purchaseUrl: 'https://item.taobao.com/item.htm?id=12891923',
        qty: 10,
        price: '¥ 0.00',
        amount: '免费',
        feeType: '无',
        status: '待提交',
        type: 'direct',
        applyTime: '2026-06-03 19:30',
        registrations: [
            {
                regNo: 'DJ-20260603-13',
                name: 'LED高亮红光灯珠配件',
                pattern: '红光',
                color: '红色',
                spec: '英规',
                sampleSize: '5×5×8 mm',
                netWeight: '5g',
                status: '待提交',
                image: 'https://picsum.photos/60/60?random=19'
            }
        ]
    }
]);
const handleDeleteFeedback = (row) => {
    ElMessageBox.confirm(`确定要删除反馈方案 ${row.code} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'small'
    }).then(() => {
        const index = feedbackListData.value.findIndex(i => i.code === row.code);
        if (index !== -1) {
            feedbackListData.value.splice(index, 1);
            ElMessage.success('方案已删除');
        }
    }).catch(() => { });
};
const activeRegisteringPurchase = ref(null);
const editingRegNo = ref('');
const handleSampleRegistration = (taskData) => {
    console.log('Opening Sample Registration Dialog', taskData);
    if (sampleRegistrationRef.value) {
        activeRegisteringPurchase.value = taskData || null;
        const syncData = {
            ...(currentTask.value || {}),
            ...(taskData || {})
        };
        sampleRegistrationRef.value.open(syncData);
    }
    else {
        console.error('sampleRegistrationRef is not initialized');
    }
};
const handleSampleEdit = (row) => {
    const reg = row.registrations?.[0] || row;
    editingRegNo.value = reg.regNo;
    sampleRegistrationRef.value?.open(reg);
};
const handleViewSample = (row) => {
    if (row.registrations && row.registrations.length > 0) {
        sampleRegistrationDetailRef.value?.open(row.registrations[0]);
    }
    else if (row.type === 'direct') {
        sampleRegistrationDetailRef.value?.open(row.registrations?.[0] || row);
    }
};
const handleSampleRegistrationSubmit = (formData) => {
    const newRegNo = 'DJ-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900);
    if (editingRegNo.value) {
        const row = purchaseListData.value.find(p => p.registrations && p.registrations.some((r) => r.regNo === editingRegNo.value));
        if (row) {
            const reg = row.registrations.find((r) => r.regNo === editingRegNo.value);
            if (reg) {
                reg.name = formData.name;
                if (formData.details && formData.details[0]) {
                    reg.pattern = formData.details[0].pattern;
                    reg.color = formData.details[0].color;
                    reg.spec = formData.details[0].spec;
                    reg.sampleSize = `${formData.details[0].length || 0}×${formData.details[0].width || 0}×${formData.details[0].height || 0} ${formData.details[0].sampleSizeUnit}`;
                    reg.netWeight = `${formData.details[0].netWeight || 0}${formData.details[0].netWeightUnit}`;
                    reg.image = formData.details[0].images?.[0] || reg.image;
                }
                if (row.type === 'direct') {
                    row.sampleName = formData.name;
                    row.channel = formData.source === '1' ? '供应商' : (formData.source === '2' ? '1688' : '淘宝');
                    row.supplier = formData.supplierName;
                    row.purchaseUrl = formData.purchaseUrl;
                    row.price = '¥ ' + (formData.sampleFee || 0).toFixed(2);
                    row.amount = formData.sampleFee > 0 ? '¥ ' + (formData.sampleFee || 0).toFixed(2) : '免费';
                }
                ElMessage.success('保存成功');
            }
        }
        editingRegNo.value = '';
        return;
    }
    if (activeRegisteringPurchase.value && activeRegisteringPurchase.value.applyNo) {
        const po = purchaseListData.value.find(p => p.applyNo === activeRegisteringPurchase.value.applyNo);
        if (po) {
            if (!po.registrations)
                po.registrations = [];
            po.registrations.push({
                regNo: newRegNo,
                name: formData.name,
                pattern: formData.details?.[0]?.pattern || '',
                color: formData.details?.[0]?.color || '',
                spec: formData.details?.[0]?.spec || '通用',
                sampleSize: `${formData.details?.[0]?.length || 0}×${formData.details?.[0]?.width || 0}×${formData.details?.[0]?.height || 0} ${formData.details?.[0]?.sampleSizeUnit || 'cm'}`,
                netWeight: `${formData.details?.[0]?.netWeight || 0}${formData.details?.[0]?.netWeightUnit || 'g'}`,
                status: '已提交',
                image: formData.details?.[0]?.images?.[0] || 'https://picsum.photos/60/60?random=15'
            });
            ElMessage.success('样品登记成功');
        }
    }
    else {
        purchaseListData.value.push({
            applyNo: newRegNo,
            sampleName: formData.name || '样品直接登记',
            channel: formData.source === '1' ? '供应商' : (formData.source === '2' ? '1688' : '淘宝'),
            supplier: formData.supplierName,
            purchaseUrl: formData.purchaseUrl,
            qty: 1,
            price: '¥ ' + (formData.sampleFee || 0).toFixed(2),
            amount: formData.sampleFee > 0 ? '¥ ' + (formData.sampleFee || 0).toFixed(2) : '免费',
            feeType: '无',
            status: '已登记',
            type: 'direct',
            applyTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            registrations: [{
                    regNo: newRegNo,
                    name: formData.name,
                    pattern: formData.details?.[0]?.pattern || '',
                    color: formData.details?.[0]?.color || '',
                    spec: formData.details?.[0]?.spec || '通用',
                    sampleSize: `${formData.details?.[0]?.length || 0}×${formData.details?.[0]?.width || 0}×${formData.details?.[0]?.height || 0} ${formData.details?.[0]?.sampleSizeUnit || 'cm'}`,
                    netWeight: `${formData.details?.[0]?.netWeight || 0}${formData.details?.[0]?.netWeightUnit || 'g'}`,
                    status: '已提交',
                    image: formData.details?.[0]?.images?.[0] || 'https://picsum.photos/60/60?random=15'
                }]
        });
        ElMessage.success('样品直接登记成功');
    }
};
const handleExecutionDetail = (row) => {
    if (executionDetailDrawerRef.value) {
        executionDetailDrawerRef.value.open(row);
    }
};
const feedbackListData = ref([
    {
        code: 'FA-20260520-01',
        source: '1688-广州某工厂',
        feeType: '开模费',
        feeAmount: '¥ 5,000.00',
        moldOwnership: '公司',
        customDuration: '15天',
        initialQuote: '¥ 85.00',
        productionCycle: '25天',
        moq: '1000',
        isRefundable: '是',
        refundMethod: '返现金',
        refundCondition: '首单满1万',
        additionalConditions: '含彩盒包装',
        status: '待开发反馈',
        statusType: 'primary'
    },
    {
        code: 'FA-20260520-02',
        source: '线下-深圳供应商',
        feeType: '打样费',
        feeAmount: '¥ 50.00',
        moldOwnership: '-',
        customDuration: '7天',
        initialQuote: '¥ 78.00',
        productionCycle: '20天',
        moq: '500',
        isRefundable: '否',
        refundMethod: '-',
        refundCondition: '-',
        additionalConditions: '无',
        status: '已采纳',
        statusType: 'success'
    },
    {
        code: 'FA-20260523-07',
        source: '阿里国际-义乌供应商',
        feeType: '打样费',
        feeAmount: '¥ 120.00',
        moldOwnership: '-',
        customDuration: '4天',
        initialQuote: '¥ 88.00',
        productionCycle: '20天',
        moq: '1000',
        isRefundable: '是',
        refundMethod: '抵扣货款',
        refundCondition: '首单退',
        additionalConditions: '测试单个待提交购样单',
        status: '已采纳',
        statusType: 'success'
    },
    {
        code: 'FA-20260523-08',
        source: '阿里国际-宁波供应商',
        feeType: '打样费',
        feeAmount: '¥ 350.00',
        moldOwnership: '-',
        customDuration: '6天',
        initialQuote: '¥ 95.00',
        productionCycle: '25天',
        moq: '1500',
        isRefundable: '是',
        refundMethod: '抵扣货款',
        refundCondition: '满2万退',
        additionalConditions: '测试多个购样申请记录',
        status: '已采纳',
        statusType: 'success'
    },
    {
        code: 'FA-20260525-09',
        source: '长期合作-东莞模具厂',
        feeType: '开模费',
        feeAmount: '¥ 8,000.00',
        moldOwnership: '公司',
        customDuration: '18天',
        initialQuote: '¥ 120.00',
        productionCycle: '30天',
        moq: '2000',
        isRefundable: '是',
        refundMethod: '抵扣大货款',
        refundCondition: '满10万退',
        additionalConditions: '含试模样品及两次改模',
        status: '已采纳',
        statusType: 'success'
    },
    {
        code: 'FA-20260520-03',
        source: '阿里国际-义乌供应商',
        feeType: '打样费',
        feeAmount: '¥ 150.00',
        moldOwnership: '-',
        customDuration: '5天',
        initialQuote: '¥ 92.00',
        productionCycle: '30天',
        moq: '2000',
        isRefundable: '是',
        refundMethod: '抵扣货款',
        refundCondition: '起订量翻倍',
        additionalConditions: '运费自理',
        status: '未采纳',
        statusType: 'info'
    },
    {
        code: 'FA-20260521-04',
        source: '東莞某五金厂',
        feeType: '开模费',
        feeAmount: '¥ 12,000.00',
        moldOwnership: '共有',
        customDuration: '30天',
        initialQuote: '¥ 65.00',
        productionCycle: '45天',
        moq: '5000',
        isRefundable: '否',
        refundMethod: '-',
        refundCondition: '-',
        additionalConditions: '模具寿命20万模',
        status: '已驳回',
        statusType: 'danger'
    },
    {
        code: 'FA-20260521-05',
        source: '线下-苏州电子',
        feeType: '开模费',
        feeAmount: '¥ 8,000.00',
        moldOwnership: '供应商',
        customDuration: '20天',
        initialQuote: '¥ 110.00',
        productionCycle: '35天',
        moq: '1500',
        isRefundable: '是',
        refundMethod: '抵扣首单',
        refundCondition: '满5万退',
        additionalConditions: '含两轮功能验证',
        status: '待提交',
        statusType: 'warning'
    },
    {
        code: 'FA-20260522-06',
        source: '长期合作-惠州工厂',
        feeType: '打样费',
        feeAmount: '¥ 0.00',
        moldOwnership: '-',
        customDuration: '3天',
        initialQuote: '¥ 62.00',
        productionCycle: '15天',
        moq: '300',
        isRefundable: '否',
        refundMethod: '-',
        refundCondition: '-',
        additionalConditions: '样机免费寄送',
        status: '已采纳',
        statusType: 'success'
    },
    {
        code: 'FA-20260522-07',
        source: '长期合作-中山光源厂',
        feeType: '打样费',
        feeAmount: '¥ 0.00',
        moldOwnership: '-',
        customDuration: '4天',
        initialQuote: '¥ 45.00',
        productionCycle: '12天',
        moq: '500',
        isRefundable: '否',
        refundMethod: '-',
        refundCondition: '-',
        additionalConditions: '测试多个直接登记（免费打样）',
        status: '已采纳',
        statusType: 'success'
    }
]);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-count-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['id']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['product-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['circle']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['circle']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "sample-task-page" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "workbench-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "side-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "side-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "search-box" },
});
const __VLS_0 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.searchQuery),
    placeholder: "搜索编号/产品",
    prefixIcon: "Search",
    size: "small",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.searchQuery),
    placeholder: "搜索编号/产品",
    prefixIcon: "Search",
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "urgent-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "urgent-summary-line" },
});
const __VLS_4 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ class: "clock-icon" },
}));
const __VLS_6 = __VLS_5({
    ...{ class: "clock-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.Clock;
/** @type {[typeof __VLS_components.Clock, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_7;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "count-badge" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "urgent-card-list" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.urgentTasks))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.currentTask = item;
            } },
        key: (item.proposalNo),
        ...{ class: (['urgent-mini-card', { active: __VLS_ctx.currentTask?.proposalNo === item.proposalNo }]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-top" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "id" },
    });
    (item.proposalNo);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "urgent-label-tag" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-main" },
    });
    const __VLS_12 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        src: (item.image),
        ...{ class: "product-thumb" },
    }));
    const __VLS_14 = __VLS_13({
        src: (item.image),
        ...{ class: "product-thumb" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title" },
    });
    (item.category ? `${item.category}-${item.productName}` : item.productName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "sub" },
    });
    (item.pm);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "v-line" },
    });
    (item.sampleMethodText);
    if (__VLS_ctx.activeTab === 'unfinished') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "urgent-acceptors-line" },
        });
        (item.acceptors && item.acceptors.length ? item.acceptors.join('、') : '暂无');
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tabs-scroll-nav" },
});
for (const [tab] of __VLS_getVForSourceType((__VLS_ctx.statusTabs))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.activeTab = tab.value;
            } },
        key: (tab.value),
        ...{ class: (['tab-item', { active: __VLS_ctx.activeTab === tab.value }]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (tab.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "tab-count-badge" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "side-body custom-scrollbar" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.normalTasks))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.currentTask = item;
            } },
        key: (item.proposalNo),
        ...{ class: (['normal-task-card', { active: __VLS_ctx.currentTask?.proposalNo === item.proposalNo }]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-top" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "id" },
    });
    (item.proposalNo);
    const __VLS_16 = {}.ElTooltip;
    /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        disabled: (!__VLS_ctx.daysTooltipContent),
        effect: "dark",
        content: (__VLS_ctx.daysTooltipContent),
        placement: "top",
    }));
    const __VLS_18 = __VLS_17({
        disabled: (!__VLS_ctx.daysTooltipContent),
        effect: "dark",
        content: (__VLS_ctx.daysTooltipContent),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "days-tag" },
    });
    (item.remainingDays);
    var __VLS_19;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-main" },
    });
    const __VLS_20 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
        src: (item.image),
        ...{ class: "product-thumb" },
    }));
    const __VLS_22 = __VLS_21({
        src: (item.image),
        ...{ class: "product-thumb" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title" },
    });
    (item.category ? `${item.category}-${item.productName}` : item.productName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "sub" },
    });
    (item.pm);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "v-line" },
    });
    (item.sampleMethodText);
    if (__VLS_ctx.activeTab === 'unfinished') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-footer" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "separator-line" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "acceptors-info" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "names" },
            title: (item.acceptors && item.acceptors.length ? item.acceptors.join('、') : '暂无'),
        });
        (item.acceptors && item.acceptors.length ? item.acceptors.join('、') : '暂无');
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-footer" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "separator-line" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "status-link" },
        });
    }
}
if (__VLS_ctx.currentTask) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
        ...{ class: "main-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
        ...{ class: "content-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-left" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
        ...{ class: "product-name" },
    });
    (__VLS_ctx.currentTask.productName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "proposal-id" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.proposalNo);
    const __VLS_24 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        ...{ class: "copy-btn" },
    }));
    const __VLS_26 = __VLS_25({
        ...{ class: "copy-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = {}.CopyDocument;
    /** @type {[typeof __VLS_components.CopyDocument, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
    const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
    var __VLS_27;
    const __VLS_32 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        size: "small",
        type: (__VLS_ctx.currentTask.sampleMethodText === '定制拿样' ? 'success' : 'primary'),
        effect: "plain",
        ...{ class: "tag-method" },
    }));
    const __VLS_34 = __VLS_33({
        size: "small",
        type: (__VLS_ctx.currentTask.sampleMethodText === '定制拿样' ? 'success' : 'primary'),
        effect: "plain",
        ...{ class: "tag-method" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    (__VLS_ctx.currentTask.sampleMethodText);
    var __VLS_35;
    const __VLS_36 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        size: "small",
        color: "#faad14",
        effect: "dark",
        ...{ class: "tag-level" },
    }));
    const __VLS_38 = __VLS_37({
        size: "small",
        color: "#faad14",
        effect: "dark",
        ...{ class: "tag-level" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    var __VLS_39;
    const __VLS_40 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        size: "small",
        type: "danger",
        effect: "plain",
        ...{ class: "tag-p0" },
    }));
    const __VLS_42 = __VLS_41({
        size: "small",
        type: "danger",
        effect: "plain",
        ...{ class: "tag-p0" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    var __VLS_43;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-actions" },
    });
    if (__VLS_ctx.activeTab === 'unfinished') {
        const __VLS_44 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            ...{ 'onClick': {} },
            type: "primary",
            ...{ class: "action-btn blue" },
        }));
        const __VLS_46 = __VLS_45({
            ...{ 'onClick': {} },
            type: "primary",
            ...{ class: "action-btn blue" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        let __VLS_48;
        let __VLS_49;
        let __VLS_50;
        const __VLS_51 = {
            onClick: (__VLS_ctx.handleAcceptTask)
        };
        __VLS_47.slots.default;
        var __VLS_47;
    }
    else {
        if (__VLS_ctx.currentTask.sampleMethodText === '定制拿样') {
            const __VLS_52 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
                ...{ 'onClick': {} },
                type: "primary",
                ...{ class: "action-btn blue" },
            }));
            const __VLS_54 = __VLS_53({
                ...{ 'onClick': {} },
                type: "primary",
                ...{ class: "action-btn blue" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_53));
            let __VLS_56;
            let __VLS_57;
            let __VLS_58;
            const __VLS_59 = {
                onClick: (__VLS_ctx.handleCustomFeedback)
            };
            __VLS_55.slots.default;
            var __VLS_55;
            const __VLS_60 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
                ...{ class: "action-btn plain" },
            }));
            const __VLS_62 = __VLS_61({
                ...{ class: "action-btn plain" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_61));
            __VLS_63.slots.default;
            var __VLS_63;
        }
        else if (__VLS_ctx.currentTask.sampleMethodText === '现货拿样') {
            const __VLS_64 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
                ...{ 'onClick': {} },
                type: "primary",
                ...{ class: "action-btn blue" },
            }));
            const __VLS_66 = __VLS_65({
                ...{ 'onClick': {} },
                type: "primary",
                ...{ class: "action-btn blue" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_65));
            let __VLS_68;
            let __VLS_69;
            let __VLS_70;
            const __VLS_71 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentTask))
                        return;
                    if (!!(__VLS_ctx.activeTab === 'unfinished'))
                        return;
                    if (!!(__VLS_ctx.currentTask.sampleMethodText === '定制拿样'))
                        return;
                    if (!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                        return;
                    __VLS_ctx.handlePurchaseApply();
                }
            };
            __VLS_67.slots.default;
            var __VLS_67;
            const __VLS_72 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
                ...{ 'onClick': {} },
                type: "primary",
                icon: "Plus",
                ...{ class: "action-btn blue" },
            }));
            const __VLS_74 = __VLS_73({
                ...{ 'onClick': {} },
                type: "primary",
                icon: "Plus",
                ...{ class: "action-btn blue" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_73));
            let __VLS_76;
            let __VLS_77;
            let __VLS_78;
            const __VLS_79 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentTask))
                        return;
                    if (!!(__VLS_ctx.activeTab === 'unfinished'))
                        return;
                    if (!!(__VLS_ctx.currentTask.sampleMethodText === '定制拿样'))
                        return;
                    if (!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                        return;
                    __VLS_ctx.handleSampleRegistration();
                }
            };
            __VLS_75.slots.default;
            var __VLS_75;
            const __VLS_80 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
                ...{ class: "action-btn plain" },
            }));
            const __VLS_82 = __VLS_81({
                ...{ class: "action-btn plain" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_81));
            __VLS_83.slots.default;
            var __VLS_83;
        }
        else {
            const __VLS_84 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
                type: "primary",
                ...{ class: "action-btn blue" },
            }));
            const __VLS_86 = __VLS_85({
                type: "primary",
                ...{ class: "action-btn blue" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_85));
            __VLS_87.slots.default;
            var __VLS_87;
            const __VLS_88 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
                ...{ 'onClick': {} },
                type: "primary",
                icon: "Plus",
                ...{ class: "action-btn blue" },
            }));
            const __VLS_90 = __VLS_89({
                ...{ 'onClick': {} },
                type: "primary",
                icon: "Plus",
                ...{ class: "action-btn blue" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_89));
            let __VLS_92;
            let __VLS_93;
            let __VLS_94;
            const __VLS_95 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentTask))
                        return;
                    if (!!(__VLS_ctx.activeTab === 'unfinished'))
                        return;
                    if (!!(__VLS_ctx.currentTask.sampleMethodText === '定制拿样'))
                        return;
                    if (!!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                        return;
                    __VLS_ctx.handleSampleRegistration();
                }
            };
            __VLS_91.slots.default;
            var __VLS_91;
            const __VLS_96 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
                ...{ class: "action-btn plain" },
            }));
            const __VLS_98 = __VLS_97({
                ...{ class: "action-btn plain" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_97));
            __VLS_99.slots.default;
            var __VLS_99;
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "content-body custom-scrollbar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: (['info-cards-row', 'mb-12', { 'grid-2-cols': __VLS_ctx.activeTab === 'unfinished' }]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "card-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-grid grid-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.pm);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.productName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.style || '亚克力透明款');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.model || 'JK-2026-X1');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.material || '亚克力 + LED');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.applicableTo || '通用 / 通用');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.spu || 'SPU882910');
    if (__VLS_ctx.activeTab === 'unfinished') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item span-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "acceptors-tags" },
        });
        if (__VLS_ctx.currentTask.acceptors && __VLS_ctx.currentTask.acceptors.length) {
            for (const [user] of __VLS_getVForSourceType((__VLS_ctx.currentTask.acceptors))) {
                const __VLS_100 = {}.ElTag;
                /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                // @ts-ignore
                const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
                    key: (user),
                    size: "small",
                    type: "primary",
                    effect: "plain",
                }));
                const __VLS_102 = __VLS_101({
                    key: (user),
                    size: "small",
                    type: "primary",
                    effect: "plain",
                }, ...__VLS_functionalComponentArgsRest(__VLS_101));
                __VLS_103.slots.default;
                (user);
                var __VLS_103;
            }
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "no-acceptors" },
            });
        }
    }
    if (__VLS_ctx.activeTab !== 'unfinished') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "info-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "card-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-grid grid-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item flex-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        const __VLS_104 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
            size: "small",
            ...{ class: "custom-tag" },
        }));
        const __VLS_106 = __VLS_105({
            size: "small",
            ...{ class: "custom-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        __VLS_107.slots.default;
        (__VLS_ctx.currentTask.devMethod || '全新品-定制');
        var __VLS_107;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.currentTask.brand || 'MoKo');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.currentTask.logoPosition || '无');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.currentTask.packagingMethod || '盒装');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.currentTask.buyQty || '500');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.currentTask.totalAmount || '115,000.00');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.currentTask.launchTime || '2026-07-15');
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-card no-padding-bottom" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ class: "card-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "time-list" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "time-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "time-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "time-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "custom-dotted-divider" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-countdown" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cd-box feedback" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "lab" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "cd-box task" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "val" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "lab" },
    });
    if (__VLS_ctx.activeTab !== 'unfinished') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "info-card mb-12" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "card-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "data-grid grid-3 mb-20" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item span-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "value-text" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        const __VLS_108 = {}.ElLink;
        /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
            type: "primary",
            underline: (false),
        }));
        const __VLS_110 = __VLS_109({
            type: "primary",
            underline: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        __VLS_111.slots.default;
        var __VLS_111;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item flex-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "red-star" },
        });
        const __VLS_112 = {}.ElLink;
        /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            type: "primary",
            underline: (false),
            ...{ class: "ml-4" },
        }));
        const __VLS_114 = __VLS_113({
            type: "primary",
            underline: (false),
            ...{ class: "ml-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        __VLS_115.slots.default;
        var __VLS_115;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "item flex-row align-start" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        const __VLS_116 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            src: (__VLS_ctx.currentTask.image),
            ...{ class: "ref-image-box" },
        }));
        const __VLS_118 = __VLS_117({
            src: (__VLS_ctx.currentTask.image),
            ...{ class: "ref-image-box" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    }
    if (__VLS_ctx.activeTab !== 'unfinished') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "info-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
            ...{ class: "card-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-sub-title mb-12" },
        });
        const __VLS_120 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            ...{ class: "icon" },
        }));
        const __VLS_122 = __VLS_121({
            ...{ class: "icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        __VLS_123.slots.default;
        const __VLS_124 = {}.Document;
        /** @type {[typeof __VLS_components.Document, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({}));
        const __VLS_126 = __VLS_125({}, ...__VLS_functionalComponentArgsRest(__VLS_125));
        var __VLS_123;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        if (__VLS_ctx.currentTask.sampleMethodText === '现货拿样') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "data-grid grid-3 mb-20 spec-requirements-grid" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item span-3 highlight-price" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "value" },
            });
            (__VLS_ctx.currentTask.bottomLinePrice || '32 CNY');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.currentTask.styleRequirement || '透明无划痕，边缘光滑');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.currentTask.brandRequirement || '通用');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.currentTask.materialRequirement || '高透亚克力，厚度不低于3mm');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.currentTask.patternRequirement || '无图案');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.currentTask.colorRequirement || '无色透明');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.currentTask.sizeRequirement || '适配 20*20*15cm 的拼图成品');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.currentTask.weightRequirement || '单品重量不超过150g');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.currentTask.packQtyRequirement || '1个/盒');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.currentTask.functionRequirement || '防尘、通透度好');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.currentTask.accessoryRequirement || '无');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.currentTask.packagingRequirement || '独立OPP袋+气泡袋保护');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.currentTask.complianceRequirement || '符合玩具安全标准 EN71');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (__VLS_ctx.currentTask.certRequirement || '无');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "supplementary-box mb-20" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "content" },
            });
            (__VLS_ctx.currentTask.supplementaryRequirement || '请重点确认材质的防刮擦性能');
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "data-grid grid-2 mb-20" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            const __VLS_128 = {}.ElLink;
            /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
            // @ts-ignore
            const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
                type: "primary",
                underline: (false),
            }));
            const __VLS_130 = __VLS_129({
                type: "primary",
                underline: (false),
            }, ...__VLS_functionalComponentArgsRest(__VLS_129));
            __VLS_131.slots.default;
            var __VLS_131;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "item flex-row justify-end" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "value" },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "supplementary-box mb-20" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "label" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "content" },
            });
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "detail-sub-title mb-12" },
        });
        const __VLS_132 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
            ...{ class: "icon" },
        }));
        const __VLS_134 = __VLS_133({
            ...{ class: "icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        __VLS_135.slots.default;
        const __VLS_136 = {}.Management;
        /** @type {[typeof __VLS_components.Management, ]} */ ;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({}));
        const __VLS_138 = __VLS_137({}, ...__VLS_functionalComponentArgsRest(__VLS_137));
        var __VLS_135;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        if (__VLS_ctx.currentTask.sampleMethodText === '定制拿样') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feedback-list-container" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "list-header" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "title" },
            });
            const __VLS_140 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
                ...{ 'onClick': {} },
                type: "primary",
                link: true,
                icon: "Plus",
            }));
            const __VLS_142 = __VLS_141({
                ...{ 'onClick': {} },
                type: "primary",
                link: true,
                icon: "Plus",
            }, ...__VLS_functionalComponentArgsRest(__VLS_141));
            let __VLS_144;
            let __VLS_145;
            let __VLS_146;
            const __VLS_147 = {
                onClick: (__VLS_ctx.handleCustomFeedback)
            };
            __VLS_143.slots.default;
            var __VLS_143;
            const __VLS_148 = {}.ElTable;
            /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
            // @ts-ignore
            const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
                data: (__VLS_ctx.feedbackListData),
                border: true,
                stripe: true,
                size: "small",
                ...{ class: "custom-table" },
            }));
            const __VLS_150 = __VLS_149({
                data: (__VLS_ctx.feedbackListData),
                border: true,
                stripe: true,
                size: "small",
                ...{ class: "custom-table" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_149));
            __VLS_151.slots.default;
            const __VLS_152 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
                label: "反馈编号",
                prop: "code",
                width: "130",
                fixed: "left",
            }));
            const __VLS_154 = __VLS_153({
                label: "反馈编号",
                prop: "code",
                width: "130",
                fixed: "left",
            }, ...__VLS_functionalComponentArgsRest(__VLS_153));
            const __VLS_156 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
                label: "货源地",
                prop: "source",
                width: "140",
            }));
            const __VLS_158 = __VLS_157({
                label: "货源地",
                prop: "source",
                width: "140",
            }, ...__VLS_functionalComponentArgsRest(__VLS_157));
            const __VLS_160 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
                label: "费用(类型)",
                width: "100",
            }));
            const __VLS_162 = __VLS_161({
                label: "费用(类型)",
                width: "100",
            }, ...__VLS_functionalComponentArgsRest(__VLS_161));
            __VLS_163.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_163.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "fee-cell" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "fee-amt" },
                });
                (row.feeAmount);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "fee-type" },
                });
                (row.feeType);
            }
            var __VLS_163;
            const __VLS_164 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({
                label: "模具归属",
                prop: "moldOwnership",
                width: "80",
            }));
            const __VLS_166 = __VLS_165({
                label: "模具归属",
                prop: "moldOwnership",
                width: "80",
            }, ...__VLS_functionalComponentArgsRest(__VLS_165));
            const __VLS_168 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
                label: "定制用时",
                prop: "customDuration",
                width: "80",
            }));
            const __VLS_170 = __VLS_169({
                label: "定制用时",
                prop: "customDuration",
                width: "80",
            }, ...__VLS_functionalComponentArgsRest(__VLS_169));
            const __VLS_172 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
                label: "初次报价",
                prop: "initialQuote",
                width: "90",
            }));
            const __VLS_174 = __VLS_173({
                label: "初次报价",
                prop: "initialQuote",
                width: "90",
            }, ...__VLS_functionalComponentArgsRest(__VLS_173));
            const __VLS_176 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
                label: "生产周期",
                prop: "productionCycle",
                width: "80",
            }));
            const __VLS_178 = __VLS_177({
                label: "生产周期",
                prop: "productionCycle",
                width: "80",
            }, ...__VLS_functionalComponentArgsRest(__VLS_177));
            const __VLS_180 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
                label: "起订量",
                prop: "moq",
                width: "75",
            }));
            const __VLS_182 = __VLS_181({
                label: "起订量",
                prop: "moq",
                width: "75",
            }, ...__VLS_functionalComponentArgsRest(__VLS_181));
            const __VLS_184 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
                label: "是否可退款",
                prop: "isRefundable",
                width: "90",
            }));
            const __VLS_186 = __VLS_185({
                label: "是否可退款",
                prop: "isRefundable",
                width: "90",
            }, ...__VLS_functionalComponentArgsRest(__VLS_185));
            const __VLS_188 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
                label: "退款条款",
                minWidth: "160",
                showOverflowTooltip: true,
            }));
            const __VLS_190 = __VLS_189({
                label: "退款条款",
                minWidth: "160",
                showOverflowTooltip: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_189));
            __VLS_191.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_191.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                if (row.isRefundable === '是') {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "refund-cell" },
                    });
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "refund-method" },
                    });
                    (row.refundMethod);
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "refund-condition" },
                    });
                    (row.refundCondition);
                }
                else {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ class: "text-secondary" },
                    });
                }
            }
            var __VLS_191;
            const __VLS_192 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
                label: "附加条件",
                prop: "additionalConditions",
                minWidth: "160",
                showOverflowTooltip: true,
            }));
            const __VLS_194 = __VLS_193({
                label: "附加条件",
                prop: "additionalConditions",
                minWidth: "160",
                showOverflowTooltip: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_193));
            const __VLS_196 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
                label: "状态",
                width: "95",
                fixed: "right",
            }));
            const __VLS_198 = __VLS_197({
                label: "状态",
                width: "95",
                fixed: "right",
            }, ...__VLS_functionalComponentArgsRest(__VLS_197));
            __VLS_199.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_199.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                const __VLS_200 = {}.ElTag;
                /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                // @ts-ignore
                const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
                    type: (row.statusType),
                    size: "small",
                }));
                const __VLS_202 = __VLS_201({
                    type: (row.statusType),
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_201));
                __VLS_203.slots.default;
                (row.status);
                var __VLS_203;
            }
            var __VLS_199;
            const __VLS_204 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
                label: "操作",
                width: "160",
                fixed: "right",
            }));
            const __VLS_206 = __VLS_205({
                label: "操作",
                width: "160",
                fixed: "right",
            }, ...__VLS_functionalComponentArgsRest(__VLS_205));
            __VLS_207.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_207.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                if (['待提交', '已驳回'].includes(row.status)) {
                    const __VLS_208 = {}.ElButton;
                    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                    // @ts-ignore
                    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
                        type: "primary",
                        link: true,
                        size: "small",
                    }));
                    const __VLS_210 = __VLS_209({
                        type: "primary",
                        link: true,
                        size: "small",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
                    __VLS_211.slots.default;
                    var __VLS_211;
                    const __VLS_212 = {}.ElButton;
                    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                    // @ts-ignore
                    const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
                        ...{ 'onClick': {} },
                        type: "danger",
                        link: true,
                        size: "small",
                    }));
                    const __VLS_214 = __VLS_213({
                        ...{ 'onClick': {} },
                        type: "danger",
                        link: true,
                        size: "small",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
                    let __VLS_216;
                    let __VLS_217;
                    let __VLS_218;
                    const __VLS_219 = {
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.currentTask))
                                return;
                            if (!(__VLS_ctx.activeTab !== 'unfinished'))
                                return;
                            if (!(__VLS_ctx.currentTask.sampleMethodText === '定制拿样'))
                                return;
                            if (!(['待提交', '已驳回'].includes(row.status)))
                                return;
                            __VLS_ctx.handleDeleteFeedback(row);
                        }
                    };
                    __VLS_215.slots.default;
                    var __VLS_215;
                }
                if (row.status === '已采纳') {
                    if (row.feeAmount === '¥ 0.00') {
                        const __VLS_220 = {}.ElButton;
                        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                        // @ts-ignore
                        const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
                            ...{ 'onClick': {} },
                            type: "primary",
                            link: true,
                            size: "small",
                        }));
                        const __VLS_222 = __VLS_221({
                            ...{ 'onClick': {} },
                            type: "primary",
                            link: true,
                            size: "small",
                        }, ...__VLS_functionalComponentArgsRest(__VLS_221));
                        let __VLS_224;
                        let __VLS_225;
                        let __VLS_226;
                        const __VLS_227 = {
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.currentTask))
                                    return;
                                if (!(__VLS_ctx.activeTab !== 'unfinished'))
                                    return;
                                if (!(__VLS_ctx.currentTask.sampleMethodText === '定制拿样'))
                                    return;
                                if (!(row.status === '已采纳'))
                                    return;
                                if (!(row.feeAmount === '¥ 0.00'))
                                    return;
                                __VLS_ctx.handleSampleRegistration(row);
                            }
                        };
                        __VLS_223.slots.default;
                        var __VLS_223;
                    }
                    else {
                        const __VLS_228 = {}.ElButton;
                        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                        // @ts-ignore
                        const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
                            ...{ 'onClick': {} },
                            type: "primary",
                            link: true,
                            size: "small",
                        }));
                        const __VLS_230 = __VLS_229({
                            ...{ 'onClick': {} },
                            type: "primary",
                            link: true,
                            size: "small",
                        }, ...__VLS_functionalComponentArgsRest(__VLS_229));
                        let __VLS_232;
                        let __VLS_233;
                        let __VLS_234;
                        const __VLS_235 = {
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.currentTask))
                                    return;
                                if (!(__VLS_ctx.activeTab !== 'unfinished'))
                                    return;
                                if (!(__VLS_ctx.currentTask.sampleMethodText === '定制拿样'))
                                    return;
                                if (!(row.status === '已采纳'))
                                    return;
                                if (!!(row.feeAmount === '¥ 0.00'))
                                    return;
                                __VLS_ctx.handlePurchaseApply(row);
                            }
                        };
                        __VLS_231.slots.default;
                        (row.feeType === '开模费' ? '模具申请' : '购样申请');
                        var __VLS_231;
                    }
                    const __VLS_236 = {}.ElButton;
                    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                    // @ts-ignore
                    const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
                        ...{ 'onClick': {} },
                        type: "primary",
                        link: true,
                        size: "small",
                    }));
                    const __VLS_238 = __VLS_237({
                        ...{ 'onClick': {} },
                        type: "primary",
                        link: true,
                        size: "small",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
                    let __VLS_240;
                    let __VLS_241;
                    let __VLS_242;
                    const __VLS_243 = {
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.currentTask))
                                return;
                            if (!(__VLS_ctx.activeTab !== 'unfinished'))
                                return;
                            if (!(__VLS_ctx.currentTask.sampleMethodText === '定制拿样'))
                                return;
                            if (!(row.status === '已采纳'))
                                return;
                            __VLS_ctx.handleExecutionDetail(row);
                        }
                    };
                    __VLS_239.slots.default;
                    var __VLS_239;
                }
            }
            var __VLS_207;
            var __VLS_151;
        }
        if (__VLS_ctx.currentTask.sampleMethodText === '现货拿样') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feedback-list-container" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "list-header" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "title" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ style: {} },
            });
            const __VLS_244 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
                ...{ 'onClick': {} },
                type: "primary",
                link: true,
                icon: "Plus",
            }));
            const __VLS_246 = __VLS_245({
                ...{ 'onClick': {} },
                type: "primary",
                link: true,
                icon: "Plus",
            }, ...__VLS_functionalComponentArgsRest(__VLS_245));
            let __VLS_248;
            let __VLS_249;
            let __VLS_250;
            const __VLS_251 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentTask))
                        return;
                    if (!(__VLS_ctx.activeTab !== 'unfinished'))
                        return;
                    if (!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                        return;
                    __VLS_ctx.handlePurchaseApply();
                }
            };
            __VLS_247.slots.default;
            var __VLS_247;
            const __VLS_252 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
                ...{ 'onClick': {} },
                type: "primary",
                link: true,
                icon: "Plus",
            }));
            const __VLS_254 = __VLS_253({
                ...{ 'onClick': {} },
                type: "primary",
                link: true,
                icon: "Plus",
            }, ...__VLS_functionalComponentArgsRest(__VLS_253));
            let __VLS_256;
            let __VLS_257;
            let __VLS_258;
            const __VLS_259 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.currentTask))
                        return;
                    if (!(__VLS_ctx.activeTab !== 'unfinished'))
                        return;
                    if (!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                        return;
                    __VLS_ctx.handleSampleRegistration();
                }
            };
            __VLS_255.slots.default;
            var __VLS_255;
            const __VLS_260 = {}.ElTable;
            /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
            // @ts-ignore
            const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
                data: (__VLS_ctx.purchaseListData),
                border: true,
                stripe: true,
                size: "small",
                ...{ class: "custom-table" },
            }));
            const __VLS_262 = __VLS_261({
                data: (__VLS_ctx.purchaseListData),
                border: true,
                stripe: true,
                size: "small",
                ...{ class: "custom-table" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_261));
            __VLS_263.slots.default;
            const __VLS_264 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
                label: "单据编号",
                prop: "applyNo",
                width: "145",
                fixed: "left",
            }));
            const __VLS_266 = __VLS_265({
                label: "单据编号",
                prop: "applyNo",
                width: "145",
                fixed: "left",
            }, ...__VLS_functionalComponentArgsRest(__VLS_265));
            __VLS_267.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_267.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "font-mono" },
                });
                (row.applyNo);
            }
            var __VLS_267;
            const __VLS_268 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
                label: "单据类型",
                width: "95",
            }));
            const __VLS_270 = __VLS_269({
                label: "单据类型",
                width: "95",
            }, ...__VLS_functionalComponentArgsRest(__VLS_269));
            __VLS_271.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_271.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                if (row.type === 'direct') {
                    const __VLS_272 = {}.ElTag;
                    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                    // @ts-ignore
                    const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
                        size: "small",
                        type: "success",
                        effect: "light",
                    }));
                    const __VLS_274 = __VLS_273({
                        size: "small",
                        type: "success",
                        effect: "light",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_273));
                    __VLS_275.slots.default;
                    var __VLS_275;
                }
                else {
                    const __VLS_276 = {}.ElTag;
                    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                    // @ts-ignore
                    const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
                        size: "small",
                        type: "primary",
                        effect: "light",
                    }));
                    const __VLS_278 = __VLS_277({
                        size: "small",
                        type: "primary",
                        effect: "light",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_277));
                    __VLS_279.slots.default;
                    var __VLS_279;
                }
            }
            var __VLS_271;
            const __VLS_280 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
                label: "样品名称",
                prop: "sampleName",
                minWidth: "120",
            }));
            const __VLS_282 = __VLS_281({
                label: "样品名称",
                prop: "sampleName",
                minWidth: "120",
            }, ...__VLS_functionalComponentArgsRest(__VLS_281));
            const __VLS_284 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
                label: "渠道",
                prop: "channel",
                width: "80",
            }));
            const __VLS_286 = __VLS_285({
                label: "渠道",
                prop: "channel",
                width: "80",
            }, ...__VLS_functionalComponentArgsRest(__VLS_285));
            const __VLS_288 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
                label: "供应商/链接",
                minWidth: "160",
                showOverflowTooltip: true,
            }));
            const __VLS_290 = __VLS_289({
                label: "供应商/链接",
                minWidth: "160",
                showOverflowTooltip: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_289));
            __VLS_291.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_291.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                if (row.channel === '供应商') {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                    (row.supplier);
                }
                else {
                    const __VLS_292 = {}.ElLink;
                    /** @type {[typeof __VLS_components.ElLink, typeof __VLS_components.elLink, typeof __VLS_components.ElLink, typeof __VLS_components.elLink, ]} */ ;
                    // @ts-ignore
                    const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
                        type: "primary",
                        underline: (false),
                        href: (row.purchaseUrl),
                        target: "_blank",
                        ...{ class: "link-text-ellipsis" },
                    }));
                    const __VLS_294 = __VLS_293({
                        type: "primary",
                        underline: (false),
                        href: (row.purchaseUrl),
                        target: "_blank",
                        ...{ class: "link-text-ellipsis" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_293));
                    __VLS_295.slots.default;
                    (row.purchaseUrl);
                    var __VLS_295;
                }
            }
            var __VLS_291;
            const __VLS_296 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
                label: "数量",
                prop: "qty",
                width: "70",
            }));
            const __VLS_298 = __VLS_297({
                label: "数量",
                prop: "qty",
                width: "70",
            }, ...__VLS_functionalComponentArgsRest(__VLS_297));
            const __VLS_300 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
                label: "单价",
                prop: "price",
                width: "80",
            }));
            const __VLS_302 = __VLS_301({
                label: "单价",
                prop: "price",
                width: "80",
            }, ...__VLS_functionalComponentArgsRest(__VLS_301));
            const __VLS_304 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
                label: "费用合计",
                prop: "amount",
                width: "100",
            }));
            const __VLS_306 = __VLS_305({
                label: "费用合计",
                prop: "amount",
                width: "100",
            }, ...__VLS_functionalComponentArgsRest(__VLS_305));
            __VLS_307.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_307.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                if (row.type === 'direct') {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ style: {} },
                    });
                    (row.amount);
                }
                else {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                        ...{ style: {} },
                    });
                    (row.amount);
                }
            }
            var __VLS_307;
            const __VLS_308 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
                label: "费用类型",
                width: "90",
            }));
            const __VLS_310 = __VLS_309({
                label: "费用类型",
                width: "90",
            }, ...__VLS_functionalComponentArgsRest(__VLS_309));
            __VLS_311.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_311.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                const __VLS_312 = {}.ElTag;
                /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                // @ts-ignore
                const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
                    size: "small",
                    type: "warning",
                    effect: "light",
                }));
                const __VLS_314 = __VLS_313({
                    size: "small",
                    type: "warning",
                    effect: "light",
                }, ...__VLS_functionalComponentArgsRest(__VLS_313));
                __VLS_315.slots.default;
                (row.feeType || '购样费');
                var __VLS_315;
            }
            var __VLS_311;
            const __VLS_316 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
                label: "状态",
                width: "95",
                fixed: "right",
            }));
            const __VLS_318 = __VLS_317({
                label: "状态",
                width: "95",
                fixed: "right",
            }, ...__VLS_functionalComponentArgsRest(__VLS_317));
            __VLS_319.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_319.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                const __VLS_320 = {}.ElTag;
                /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                // @ts-ignore
                const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
                    type: (__VLS_ctx.getStatusTagType(row.status)),
                    size: "small",
                }));
                const __VLS_322 = __VLS_321({
                    type: (__VLS_ctx.getStatusTagType(row.status)),
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_321));
                __VLS_323.slots.default;
                (row.status);
                var __VLS_323;
            }
            var __VLS_319;
            const __VLS_324 = {}.ElTableColumn;
            /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
            // @ts-ignore
            const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
                label: "操作",
                width: "220",
                fixed: "right",
            }));
            const __VLS_326 = __VLS_325({
                label: "操作",
                width: "220",
                fixed: "right",
            }, ...__VLS_functionalComponentArgsRest(__VLS_325));
            __VLS_327.slots.default;
            {
                const { default: __VLS_thisSlot } = __VLS_327.slots;
                const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
                if (row.type === 'direct') {
                    const __VLS_328 = {}.ElButton;
                    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                    // @ts-ignore
                    const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
                        ...{ 'onClick': {} },
                        type: "primary",
                        link: true,
                        size: "small",
                    }));
                    const __VLS_330 = __VLS_329({
                        ...{ 'onClick': {} },
                        type: "primary",
                        link: true,
                        size: "small",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_329));
                    let __VLS_332;
                    let __VLS_333;
                    let __VLS_334;
                    const __VLS_335 = {
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.currentTask))
                                return;
                            if (!(__VLS_ctx.activeTab !== 'unfinished'))
                                return;
                            if (!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                                return;
                            if (!(row.type === 'direct'))
                                return;
                            __VLS_ctx.handleExecutionDetail(row);
                        }
                    };
                    __VLS_331.slots.default;
                    var __VLS_331;
                    if (row.status === '待提交') {
                        const __VLS_336 = {}.ElButton;
                        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                        // @ts-ignore
                        const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
                            ...{ 'onClick': {} },
                            type: "primary",
                            link: true,
                            size: "small",
                        }));
                        const __VLS_338 = __VLS_337({
                            ...{ 'onClick': {} },
                            type: "primary",
                            link: true,
                            size: "small",
                        }, ...__VLS_functionalComponentArgsRest(__VLS_337));
                        let __VLS_340;
                        let __VLS_341;
                        let __VLS_342;
                        const __VLS_343 = {
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.currentTask))
                                    return;
                                if (!(__VLS_ctx.activeTab !== 'unfinished'))
                                    return;
                                if (!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                                    return;
                                if (!(row.type === 'direct'))
                                    return;
                                if (!(row.status === '待提交'))
                                    return;
                                __VLS_ctx.handleSampleEdit(row);
                            }
                        };
                        __VLS_339.slots.default;
                        var __VLS_339;
                    }
                    if (row.status === '待提交') {
                        const __VLS_344 = {}.ElButton;
                        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                        // @ts-ignore
                        const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
                            ...{ 'onClick': {} },
                            type: "danger",
                            link: true,
                            size: "small",
                        }));
                        const __VLS_346 = __VLS_345({
                            ...{ 'onClick': {} },
                            type: "danger",
                            link: true,
                            size: "small",
                        }, ...__VLS_functionalComponentArgsRest(__VLS_345));
                        let __VLS_348;
                        let __VLS_349;
                        let __VLS_350;
                        const __VLS_351 = {
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.currentTask))
                                    return;
                                if (!(__VLS_ctx.activeTab !== 'unfinished'))
                                    return;
                                if (!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                                    return;
                                if (!(row.type === 'direct'))
                                    return;
                                if (!(row.status === '待提交'))
                                    return;
                                __VLS_ctx.handlePurchaseDelete(row);
                            }
                        };
                        __VLS_347.slots.default;
                        var __VLS_347;
                    }
                }
                else {
                    const __VLS_352 = {}.ElButton;
                    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                    // @ts-ignore
                    const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
                        ...{ 'onClick': {} },
                        type: "primary",
                        link: true,
                        size: "small",
                    }));
                    const __VLS_354 = __VLS_353({
                        ...{ 'onClick': {} },
                        type: "primary",
                        link: true,
                        size: "small",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_353));
                    let __VLS_356;
                    let __VLS_357;
                    let __VLS_358;
                    const __VLS_359 = {
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.currentTask))
                                return;
                            if (!(__VLS_ctx.activeTab !== 'unfinished'))
                                return;
                            if (!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                                return;
                            if (!!(row.type === 'direct'))
                                return;
                            __VLS_ctx.handleExecutionDetail(row);
                        }
                    };
                    __VLS_355.slots.default;
                    var __VLS_355;
                    if (['待提交', '待更新合同'].includes(row.status)) {
                        const __VLS_360 = {}.ElButton;
                        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                        // @ts-ignore
                        const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
                            ...{ 'onClick': {} },
                            type: "primary",
                            link: true,
                            size: "small",
                        }));
                        const __VLS_362 = __VLS_361({
                            ...{ 'onClick': {} },
                            type: "primary",
                            link: true,
                            size: "small",
                        }, ...__VLS_functionalComponentArgsRest(__VLS_361));
                        let __VLS_364;
                        let __VLS_365;
                        let __VLS_366;
                        const __VLS_367 = {
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.currentTask))
                                    return;
                                if (!(__VLS_ctx.activeTab !== 'unfinished'))
                                    return;
                                if (!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                                    return;
                                if (!!(row.type === 'direct'))
                                    return;
                                if (!(['待提交', '待更新合同'].includes(row.status)))
                                    return;
                                __VLS_ctx.handlePurchaseEdit(row);
                            }
                        };
                        __VLS_363.slots.default;
                        var __VLS_363;
                    }
                    if (row.status === '待提交') {
                        const __VLS_368 = {}.ElButton;
                        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                        // @ts-ignore
                        const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
                            ...{ 'onClick': {} },
                            type: "danger",
                            link: true,
                            size: "small",
                        }));
                        const __VLS_370 = __VLS_369({
                            ...{ 'onClick': {} },
                            type: "danger",
                            link: true,
                            size: "small",
                        }, ...__VLS_functionalComponentArgsRest(__VLS_369));
                        let __VLS_372;
                        let __VLS_373;
                        let __VLS_374;
                        const __VLS_375 = {
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.currentTask))
                                    return;
                                if (!(__VLS_ctx.activeTab !== 'unfinished'))
                                    return;
                                if (!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                                    return;
                                if (!!(row.type === 'direct'))
                                    return;
                                if (!(row.status === '待提交'))
                                    return;
                                __VLS_ctx.handlePurchaseDelete(row);
                            }
                        };
                        __VLS_371.slots.default;
                        var __VLS_371;
                    }
                    if (row.status === '同意') {
                        const __VLS_376 = {}.ElButton;
                        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                        // @ts-ignore
                        const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
                            ...{ 'onClick': {} },
                            type: "primary",
                            link: true,
                            size: "small",
                        }));
                        const __VLS_378 = __VLS_377({
                            ...{ 'onClick': {} },
                            type: "primary",
                            link: true,
                            size: "small",
                        }, ...__VLS_functionalComponentArgsRest(__VLS_377));
                        let __VLS_380;
                        let __VLS_381;
                        let __VLS_382;
                        const __VLS_383 = {
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.currentTask))
                                    return;
                                if (!(__VLS_ctx.activeTab !== 'unfinished'))
                                    return;
                                if (!(__VLS_ctx.currentTask.sampleMethodText === '现货拿样'))
                                    return;
                                if (!!(row.type === 'direct'))
                                    return;
                                if (!(row.status === '同意'))
                                    return;
                                __VLS_ctx.handleSampleRegistration(row);
                            }
                        };
                        __VLS_379.slots.default;
                        var __VLS_379;
                    }
                }
            }
            var __VLS_327;
            var __VLS_263;
        }
    }
}
/** @type {[typeof CustomFeedbackDialog, ]} */ ;
// @ts-ignore
const __VLS_384 = __VLS_asFunctionalComponent(CustomFeedbackDialog, new CustomFeedbackDialog({
    ref: "customFeedbackRef",
}));
const __VLS_385 = __VLS_384({
    ref: "customFeedbackRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_384));
/** @type {typeof __VLS_ctx.customFeedbackRef} */ ;
var __VLS_387 = {};
var __VLS_386;
/** @type {[typeof PurchaseApplyDialog, ]} */ ;
// @ts-ignore
const __VLS_389 = __VLS_asFunctionalComponent(PurchaseApplyDialog, new PurchaseApplyDialog({
    ...{ 'onSubmit': {} },
    ref: "purchaseApplyRef",
}));
const __VLS_390 = __VLS_389({
    ...{ 'onSubmit': {} },
    ref: "purchaseApplyRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_389));
let __VLS_392;
let __VLS_393;
let __VLS_394;
const __VLS_395 = {
    onSubmit: (__VLS_ctx.handlePurchaseApplySubmit)
};
/** @type {typeof __VLS_ctx.purchaseApplyRef} */ ;
var __VLS_396 = {};
var __VLS_391;
/** @type {[typeof PurchaseDetailDialog, ]} */ ;
// @ts-ignore
const __VLS_398 = __VLS_asFunctionalComponent(PurchaseDetailDialog, new PurchaseDetailDialog({
    ref: "purchaseDetailRef",
}));
const __VLS_399 = __VLS_398({
    ref: "purchaseDetailRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_398));
/** @type {typeof __VLS_ctx.purchaseDetailRef} */ ;
var __VLS_401 = {};
var __VLS_400;
/** @type {[typeof SampleRegistrationDialog, ]} */ ;
// @ts-ignore
const __VLS_403 = __VLS_asFunctionalComponent(SampleRegistrationDialog, new SampleRegistrationDialog({
    ...{ 'onRefresh': {} },
    ref: "sampleRegistrationRef",
}));
const __VLS_404 = __VLS_403({
    ...{ 'onRefresh': {} },
    ref: "sampleRegistrationRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_403));
let __VLS_406;
let __VLS_407;
let __VLS_408;
const __VLS_409 = {
    onRefresh: (__VLS_ctx.handleSampleRegistrationSubmit)
};
/** @type {typeof __VLS_ctx.sampleRegistrationRef} */ ;
var __VLS_410 = {};
var __VLS_405;
/** @type {[typeof SampleRegistrationDetailDialog, ]} */ ;
// @ts-ignore
const __VLS_412 = __VLS_asFunctionalComponent(SampleRegistrationDetailDialog, new SampleRegistrationDetailDialog({
    ref: "sampleRegistrationDetailRef",
}));
const __VLS_413 = __VLS_412({
    ref: "sampleRegistrationDetailRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_412));
/** @type {typeof __VLS_ctx.sampleRegistrationDetailRef} */ ;
var __VLS_415 = {};
var __VLS_414;
/** @type {[typeof ExecutionDetailDrawer, ]} */ ;
// @ts-ignore
const __VLS_417 = __VLS_asFunctionalComponent(ExecutionDetailDrawer, new ExecutionDetailDrawer({
    ref: "executionDetailDrawerRef",
}));
const __VLS_418 = __VLS_417({
    ref: "executionDetailDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_417));
/** @type {typeof __VLS_ctx.executionDetailDrawerRef} */ ;
var __VLS_420 = {};
var __VLS_419;
/** @type {__VLS_StyleScopedClasses['sample-task-page']} */ ;
/** @type {__VLS_StyleScopedClasses['workbench-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['side-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['side-header']} */ ;
/** @type {__VLS_StyleScopedClasses['search-box']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-container']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-summary-line']} */ ;
/** @type {__VLS_StyleScopedClasses['clock-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['count-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-card-list']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['id']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-label-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['product-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['v-line']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-acceptors-line']} */ ;
/** @type {__VLS_StyleScopedClasses['tabs-scroll-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['tab-count-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['side-body']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['id']} */ ;
/** @type {__VLS_StyleScopedClasses['days-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['product-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['info']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['sub']} */ ;
/** @type {__VLS_StyleScopedClasses['v-line']} */ ;
/** @type {__VLS_StyleScopedClasses['card-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['separator-line']} */ ;
/** @type {__VLS_StyleScopedClasses['acceptors-info']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['names']} */ ;
/** @type {__VLS_StyleScopedClasses['card-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['separator-line']} */ ;
/** @type {__VLS_StyleScopedClasses['status-link']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['product-name']} */ ;
/** @type {__VLS_StyleScopedClasses['proposal-id']} */ ;
/** @type {__VLS_StyleScopedClasses['copy-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-method']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-level']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-p0']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['plain']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['plain']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['blue']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['plain']} */ ;
/** @type {__VLS_StyleScopedClasses['content-body']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['acceptors-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['no-acceptors']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['no-padding-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['time-list']} */ ;
/** @type {__VLS_StyleScopedClasses['time-row']} */ ;
/** @type {__VLS_StyleScopedClasses['time-row']} */ ;
/** @type {__VLS_StyleScopedClasses['time-row']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-dotted-divider']} */ ;
/** @type {__VLS_StyleScopedClasses['card-countdown']} */ ;
/** @type {__VLS_StyleScopedClasses['cd-box']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['lab']} */ ;
/** @type {__VLS_StyleScopedClasses['cd-box']} */ ;
/** @type {__VLS_StyleScopedClasses['task']} */ ;
/** @type {__VLS_StyleScopedClasses['val']} */ ;
/** @type {__VLS_StyleScopedClasses['lab']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['data-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['value-text']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['red-star']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['align-start']} */ ;
/** @type {__VLS_StyleScopedClasses['ref-image-box']} */ ;
/** @type {__VLS_StyleScopedClasses['info-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-sub-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['data-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-3']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['spec-requirements-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['span-3']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight-price']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['supplementary-box']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['data-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['value']} */ ;
/** @type {__VLS_StyleScopedClasses['supplementary-box']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-sub-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-list-container']} */ ;
/** @type {__VLS_StyleScopedClasses['list-header']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-table']} */ ;
/** @type {__VLS_StyleScopedClasses['fee-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['fee-amt']} */ ;
/** @type {__VLS_StyleScopedClasses['fee-type']} */ ;
/** @type {__VLS_StyleScopedClasses['refund-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['refund-method']} */ ;
/** @type {__VLS_StyleScopedClasses['refund-condition']} */ ;
/** @type {__VLS_StyleScopedClasses['text-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-list-container']} */ ;
/** @type {__VLS_StyleScopedClasses['list-header']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-table']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['link-text-ellipsis']} */ ;
// @ts-ignore
var __VLS_388 = __VLS_387, __VLS_397 = __VLS_396, __VLS_402 = __VLS_401, __VLS_411 = __VLS_410, __VLS_416 = __VLS_415, __VLS_421 = __VLS_420;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Clock: Clock,
            CopyDocument: CopyDocument,
            Document: Document,
            Management: Management,
            CustomFeedbackDialog: CustomFeedbackDialog,
            PurchaseApplyDialog: PurchaseApplyDialog,
            PurchaseDetailDialog: PurchaseDetailDialog,
            SampleRegistrationDialog: SampleRegistrationDialog,
            SampleRegistrationDetailDialog: SampleRegistrationDetailDialog,
            ExecutionDetailDrawer: ExecutionDetailDrawer,
            searchQuery: searchQuery,
            activeTab: activeTab,
            currentTask: currentTask,
            customFeedbackRef: customFeedbackRef,
            purchaseApplyRef: purchaseApplyRef,
            purchaseDetailRef: purchaseDetailRef,
            sampleRegistrationRef: sampleRegistrationRef,
            sampleRegistrationDetailRef: sampleRegistrationDetailRef,
            executionDetailDrawerRef: executionDetailDrawerRef,
            daysTooltipContent: daysTooltipContent,
            statusTabs: statusTabs,
            urgentTasks: urgentTasks,
            normalTasks: normalTasks,
            handleAcceptTask: handleAcceptTask,
            handleCustomFeedback: handleCustomFeedback,
            handlePurchaseApply: handlePurchaseApply,
            handlePurchaseEdit: handlePurchaseEdit,
            handlePurchaseDelete: handlePurchaseDelete,
            handlePurchaseApplySubmit: handlePurchaseApplySubmit,
            getStatusTagType: getStatusTagType,
            purchaseListData: purchaseListData,
            handleDeleteFeedback: handleDeleteFeedback,
            handleSampleRegistration: handleSampleRegistration,
            handleSampleEdit: handleSampleEdit,
            handleSampleRegistrationSubmit: handleSampleRegistrationSubmit,
            handleExecutionDetail: handleExecutionDetail,
            feedbackListData: feedbackListData,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=sample-task.vue.js.map