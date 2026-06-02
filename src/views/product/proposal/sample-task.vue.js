/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { CopyDocument, CircleCheckFilled, Timer, Plus, Warning } from '@element-plus/icons-vue';
const searchQuery = ref('');
const activeTab = ref('unfinished');
const currentTask = ref(null);
const statusTabs = computed(() => {
    const counts = {
        unfinished: 0,
        accepted: 0,
        custom_feedback: 0,
        purchase_apply: 0,
        sample_feedback: 0
    };
    tableData.value.forEach(item => {
        if (item.receiverStatus === '待反馈')
            counts.unfinished++;
        else if (item.receiverStatus === '已承接')
            counts.accepted++;
        else if (item.receiverStatus === '定制反馈')
            counts.custom_feedback++;
        else if (item.receiverStatus === '购样申请')
            counts.purchase_apply++;
        else if (item.receiverStatus === '样品待反馈')
            counts.sample_feedback++;
    });
    return [
        { label: '未完成', count: counts.unfinished, value: 'unfinished' },
        { label: '已承接', count: counts.accepted, value: 'accepted' },
        { label: '定制反馈', count: counts.custom_feedback, value: 'custom_feedback' },
        { label: '购样申请', count: counts.purchase_apply, value: 'purchase_apply' },
        { label: '样品待反馈', count: counts.sample_feedback, value: 'sample_feedback' }
    ];
});
const steps = computed(() => {
    if (currentTask.value?.sampleMethodText === '定制拿样') {
        return ['任务发布', '任务承接', '定制反馈', '购样申请', '费用审批', '样品登记', '开发反馈', '任务归档'];
    }
    return ['提案发起', '任务分配', '拿样反馈', '样品评估', '入库结案'];
});
const urgentList = computed(() => {
    return tableData.value.filter(item => {
        const isUrgent = item.isUrgent;
        const isSearchMatch = !searchQuery.value ||
            item.productName.includes(searchQuery.value) ||
            item.proposalNo.includes(searchQuery.value);
        return isUrgent && isSearchMatch;
    });
});
const filteredSideList = computed(() => {
    const statusMap = {
        unfinished: '待反馈',
        accepted: '已承接',
        custom_feedback: '定制反馈',
        purchase_apply: '购样申请',
        sample_feedback: '样品待反馈'
    };
    const targetStatus = statusMap[activeTab.value];
    return tableData.value.filter(item => {
        const isStatusMatch = item.receiverStatus === targetStatus;
        const isSearchMatch = !searchQuery.value ||
            item.productName.includes(searchQuery.value) ||
            item.proposalNo.includes(searchQuery.value);
        return isStatusMatch && isSearchMatch;
    });
});
const tableData = ref([
    // 待反馈 (Status: 待反馈) - 12 items
    {
        image: 'https://picsum.photos/100/100?random=1',
        proposalNo: 'TA-202605049',
        productName: 'DIY灯光板 - 亚克力透明款',
        devMethod: '派生品-拓新',
        level: 'C',
        pm: '颜沙沙',
        sampleMethodText: '现货拿样',
        category: '家居装饰',
        deadline: '2026-05-27',
        remainingDays: 7,
        isUrgent: true,
        receiverStatus: '待反馈',
        assignees: [{ name: '张三', status: '任务发布', step: 0, color: '#1890ff', time: '2026-05-20 09:30' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=11',
        proposalNo: 'TA-202605060',
        productName: '智能香薰机 - 木纹版',
        devMethod: '全新品-定制',
        level: 'B',
        pm: '王小明',
        sampleMethodText: '定制拿样',
        category: '生活电器',
        deadline: '2026-05-28',
        remainingDays: 8,
        isUrgent: false,
        receiverStatus: '待反馈',
        assignees: [{ name: '李华', status: '任务发布', step: 0, color: '#52c41a', time: '2026-05-20 10:00' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=12',
        proposalNo: 'TA-202605061',
        productName: '折叠笔记本支架',
        devMethod: '现货采购',
        level: 'A',
        pm: '赵敏',
        sampleMethodText: '现货拿样',
        category: '数码配件',
        deadline: '2026-05-25',
        remainingDays: 5,
        isUrgent: true,
        receiverStatus: '待反馈',
        assignees: [{ name: '孙悟空', status: '任务发布', step: 0, color: '#faad14', time: '2026-05-20 08:45' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=13',
        proposalNo: 'TA-202605062',
        productName: '车载吸尘器 - 无线版',
        devMethod: '全新品-定制',
        level: 'C',
        pm: '颜沙沙',
        sampleMethodText: '定制拿样',
        category: '汽车用品',
        deadline: '2026-05-30',
        remainingDays: 10,
        isUrgent: false,
        receiverStatus: '待反馈',
        assignees: [{ name: '猪八戒', status: '任务发布', step: 0, color: '#ff4d4f', time: '2026-05-20 11:30' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=14',
        proposalNo: 'TA-202605063',
        productName: '桌面空气净化器',
        devMethod: '派生品',
        level: 'B',
        pm: '周杰',
        sampleMethodText: '现货拿样',
        category: '生活电器',
        deadline: '2026-05-26',
        remainingDays: 6,
        isUrgent: true,
        receiverStatus: '待反馈',
        assignees: [{ name: '沙僧', status: '任务发布', step: 0, color: '#722ed1', time: '2026-05-20 09:15' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=15',
        proposalNo: 'TA-202605064',
        productName: '蓝牙防丢器 - 迷你款',
        devMethod: '拓新采购',
        level: 'D',
        pm: '刘德华',
        sampleMethodText: '现货拿样',
        category: '智能硬件',
        deadline: '2026-06-05',
        remainingDays: 15,
        isUrgent: false,
        receiverStatus: '待反馈',
        assignees: [{ name: '郭富城', status: '任务发布', step: 0, color: '#13c2c2', time: '2026-05-20 14:00' }]
    },
    ...Array(6).fill(0).map((_, i) => ({
        image: `https://picsum.photos/100/100?random=100${i}`,
        proposalNo: `TA-20260510${i}`,
        productName: `测试产品-待反馈-${i + 7}`,
        devMethod: '派生品',
        level: 'C',
        pm: '测试经理',
        sampleMethodText: '现货拿样',
        category: '通用类目',
        deadline: '2026-06-10',
        remainingDays: 15,
        isUrgent: false,
        receiverStatus: '待反馈',
        assignees: []
    })),
    // 已承接 (Status: 已承接) - 12 items
    {
        image: 'https://picsum.photos/100/100?random=21',
        proposalNo: 'TA-202605065',
        productName: '人体工学鼠标 - 旗舰版',
        devMethod: '全新品-定制',
        level: 'A',
        pm: '张学友',
        sampleMethodText: '定制拿样',
        category: '数码配件',
        deadline: '2026-05-29',
        remainingDays: 9,
        isUrgent: true,
        receiverStatus: '已承接',
        assignees: [{ name: '黎明', status: '任务承接', step: 1, color: '#1890ff', time: '2026-05-20 10:30' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=22',
        proposalNo: 'TA-202605066',
        productName: '多功能露营灯',
        devMethod: '派生品',
        level: 'C',
        pm: '颜沙沙',
        sampleMethodText: '现货拿样',
        category: '户外运动',
        deadline: '2026-06-01',
        remainingDays: 11,
        isUrgent: false,
        receiverStatus: '已承接',
        assignees: [{ name: '陈奕迅', status: '任务承接', step: 1, color: '#52c41a', time: '2026-05-20 11:00' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=23',
        proposalNo: 'TA-202605067',
        productName: '降噪蓝牙耳机',
        devMethod: '现货采购',
        level: 'B',
        pm: '周杰伦',
        sampleMethodText: '现货拿样',
        category: '数码配件',
        deadline: '2026-05-27',
        remainingDays: 7,
        isUrgent: true,
        receiverStatus: '已承接',
        assignees: [{ name: '林俊杰', status: '任务承接', step: 1, color: '#faad14', time: '2026-05-20 09:45' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=24',
        proposalNo: 'TA-202605068',
        productName: '桌面加湿器 - 极简版',
        devMethod: '拓新采购',
        level: 'D',
        pm: '邓紫棋',
        sampleMethodText: '现货拿样',
        category: '生活电器',
        deadline: '2026-06-03',
        remainingDays: 13,
        isUrgent: false,
        receiverStatus: '已承接',
        assignees: [{ name: '王嘉尔', status: '任务承接', step: 1, color: '#ff4d4f', time: '2026-05-20 15:00' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=25',
        proposalNo: 'TA-202605069',
        productName: '电子墨水屏阅读器',
        devMethod: '全新品-定制',
        level: 'A',
        pm: '李健',
        sampleMethodText: '定制拿样',
        category: '智能硬件',
        deadline: '2026-05-31',
        remainingDays: 11,
        isUrgent: false,
        receiverStatus: '已承接',
        assignees: [{ name: '毛不易', status: '任务承接', step: 1, color: '#722ed1', time: '2026-05-20 13:20' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=26',
        proposalNo: 'TA-202605070',
        productName: '机械键盘 - 复古款',
        devMethod: '派生品',
        level: 'B',
        pm: '颜沙沙',
        sampleMethodText: '现货拿样',
        category: '数码配件',
        deadline: '2026-06-02',
        remainingDays: 12,
        isUrgent: false,
        receiverStatus: '已承接',
        assignees: [{ name: '肖战', status: '任务承接', step: 1, color: '#13c2c2', time: '2026-05-20 16:30' }]
    },
    ...Array(6).fill(0).map((_, i) => ({
        image: `https://picsum.photos/100/100?random=200${i}`,
        proposalNo: `TA-20260520${i}`,
        productName: `测试产品-已承接-${i + 7}`,
        devMethod: '全新品',
        level: 'B',
        pm: '测试经理',
        sampleMethodText: '定制拿样',
        category: '通用类目',
        deadline: '2026-06-15',
        remainingDays: 20,
        isUrgent: false,
        receiverStatus: '已承接',
        assignees: []
    })),
    // 定制反馈 (Status: 定制反馈) - 12 items
    {
        image: 'https://picsum.photos/100/100?random=2',
        proposalNo: 'TA-202605051',
        productName: '儿童画板 - 底座RGB9色灯',
        devMethod: '全新品-定制',
        level: 'D',
        pm: '廖飞飞',
        sampleMethodText: '定制拿样',
        category: '游戏配件',
        deadline: '2026-05-27',
        remainingDays: 12,
        isUrgent: false,
        receiverStatus: '定制反馈',
        assignees: [
            { name: '李四', status: '定制反馈', step: 2, color: '#52c41a', time: '2026-05-19 14:20' },
            { name: '王五', status: '任务承接', step: 1, color: '#faad14', time: '2026-05-18 11:05' }
        ]
    },
    {
        image: 'https://picsum.photos/100/100?random=31',
        proposalNo: 'TA-202605071',
        productName: '智能猫砂盆 - 自动清理版',
        devMethod: '全新品-定制',
        level: 'S',
        pm: '严选',
        sampleMethodText: '定制拿样',
        category: '宠物用品',
        deadline: '2026-06-10',
        remainingDays: 20,
        isUrgent: true,
        receiverStatus: '定制反馈',
        assignees: [{ name: '李想', status: '定制反馈', step: 2, color: '#1890ff', time: '2026-05-20 09:00' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=32',
        proposalNo: 'TA-202605072',
        productName: '便携式咖啡机',
        devMethod: '派生品',
        level: 'B',
        pm: '颜沙沙',
        sampleMethodText: '定制拿样',
        category: '厨房电器',
        deadline: '2026-06-05',
        remainingDays: 15,
        isUrgent: false,
        receiverStatus: '定制反馈',
        assignees: [{ name: '何炅', status: '定制反馈', step: 2, color: '#52c41a', time: '2026-05-20 10:45' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=33',
        proposalNo: 'TA-202605073',
        productName: '全息投影音箱',
        devMethod: '拓新采购',
        level: 'A',
        pm: '汪涵',
        sampleMethodText: '定制拿样',
        category: '影音娱乐',
        deadline: '2026-06-15',
        remainingDays: 25,
        isUrgent: false,
        receiverStatus: '定制反馈',
        assignees: [{ name: '撒贝宁', status: '定制反馈', step: 2, color: '#faad14', time: '2026-05-20 14:15' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=34',
        proposalNo: 'TA-202605074',
        productName: '智能健身环 - 互动版',
        devMethod: '全新品-定制',
        level: 'B',
        pm: '蔡徐坤',
        sampleMethodText: '定制拿样',
        category: '运动器材',
        deadline: '2026-06-08',
        remainingDays: 18,
        isUrgent: false,
        receiverStatus: '定制反馈',
        assignees: [{ name: '王一博', status: '定制反馈', step: 2, color: '#ff4d4f', time: '2026-05-20 11:30' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=35',
        proposalNo: 'TA-202605075',
        productName: '恒温电水壶 - 彩屏版',
        devMethod: '派生品',
        level: 'C',
        pm: '赵丽颖',
        sampleMethodText: '定制拿样',
        category: '厨房电器',
        deadline: '2026-06-12',
        remainingDays: 22,
        isUrgent: false,
        receiverStatus: '定制反馈',
        assignees: [{ name: '杨幂', status: '定制反馈', step: 2, color: '#722ed1', time: '2026-05-20 15:45' }]
    },
    ...Array(6).fill(0).map((_, i) => ({
        image: `https://picsum.photos/100/100?random=300${i}`,
        proposalNo: `TA-20260530${i}`,
        productName: `测试产品-定制反馈-${i + 7}`,
        devMethod: '派生品',
        level: 'C',
        pm: '测试经理',
        sampleMethodText: '定制拿样',
        category: '通用类目',
        deadline: '2026-06-20',
        remainingDays: 25,
        isUrgent: false,
        receiverStatus: '定制反馈',
        assignees: []
    })),
    // 购样申请 (Status: 购样申请) - 12 items
    {
        image: 'https://picsum.photos/100/100?random=41',
        proposalNo: 'TA-202605076',
        productName: '折叠电动滑板车',
        devMethod: '拓新采购',
        level: 'A',
        pm: '颜沙沙',
        sampleMethodText: '现货拿样',
        category: '出行工具',
        deadline: '2026-05-26',
        remainingDays: 6,
        isUrgent: true,
        receiverStatus: '购样申请',
        assignees: [{ name: '易烊千玺', status: '购样申请', step: 3, color: '#1890ff', time: '2026-05-20 09:30' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=42',
        proposalNo: 'TA-202605077',
        productName: '智能感应垃圾桶',
        devMethod: '派生品',
        level: 'B',
        pm: '王俊凯',
        sampleMethodText: '现货拿样',
        category: '家居用品',
        deadline: '2026-05-30',
        remainingDays: 10,
        isUrgent: false,
        receiverStatus: '购样申请',
        assignees: [{ name: '王源', status: '购样申请', step: 3, color: '#52c41a', time: '2026-05-20 10:00' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=43',
        proposalNo: 'TA-202605078',
        productName: '高速吹风机 - 负离子版',
        devMethod: '全新品-定制',
        level: 'A',
        pm: '颜沙沙',
        sampleMethodText: '定制拿样',
        category: '个人护理',
        deadline: '2026-05-28',
        remainingDays: 8,
        isUrgent: true,
        receiverStatus: '购样申请',
        assignees: [{ name: '迪丽热巴', status: '购样申请', step: 3, color: '#faad14', time: '2026-05-20 11:20' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=44',
        proposalNo: 'TA-202605079',
        productName: '多功能早餐机',
        devMethod: '现货采购',
        level: 'C',
        pm: '古力娜扎',
        sampleMethodText: '现货拿样',
        category: '厨房电器',
        deadline: '2026-06-04',
        remainingDays: 14,
        isUrgent: false,
        receiverStatus: '购样申请',
        assignees: [{ name: '佟丽娅', status: '购样申请', step: 3, color: '#ff4d4f', time: '2026-05-20 14:40' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=45',
        proposalNo: 'TA-202605080',
        productName: '智能筋膜枪 - 迷你款',
        devMethod: '拓新采购',
        level: 'B',
        pm: '颜沙沙',
        sampleMethodText: '现货拿样',
        category: '健康保健',
        deadline: '2026-05-27',
        remainingDays: 7,
        isUrgent: true,
        receiverStatus: '购样申请',
        assignees: [{ name: '黄渤', status: '购样申请', step: 3, color: '#722ed1', time: '2026-05-20 15:50' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=46',
        proposalNo: 'TA-202605081',
        productName: '颈椎按摩仪',
        devMethod: '派生品',
        level: 'C',
        pm: '沈腾',
        sampleMethodText: '现货拿样',
        category: '健康保健',
        deadline: '2026-06-06',
        remainingDays: 16,
        isUrgent: false,
        receiverStatus: '购样申请',
        assignees: [{ name: '贾玲', status: '购样申请', step: 3, color: '#13c2c2', time: '2026-05-20 17:10' }]
    },
    ...Array(6).fill(0).map((_, i) => ({
        image: `https://picsum.photos/100/100?random=400${i}`,
        proposalNo: `TA-20260540${i}`,
        productName: `测试产品-购样申请-${i + 7}`,
        devMethod: '现货采购',
        level: 'B',
        pm: '测试经理',
        sampleMethodText: '现货拿样',
        category: '通用类目',
        deadline: '2026-06-25',
        remainingDays: 30,
        isUrgent: false,
        receiverStatus: '购样申请',
        assignees: []
    })),
    // 样品待反馈 (Status: 样品待反馈) - 12 items
    {
        image: 'https://picsum.photos/100/100?random=51',
        proposalNo: 'TA-202605082',
        productName: '猫咪自动饮水机',
        devMethod: '现货采购',
        level: 'B',
        pm: '颜沙沙',
        sampleMethodText: '现货拿样',
        category: '宠物用品',
        deadline: '2026-05-25',
        remainingDays: 5,
        isUrgent: true,
        receiverStatus: '样品待反馈',
        assignees: [{ name: '张子枫', status: '开发反馈', step: 6, color: '#1890ff', time: '2026-05-20 09:10' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=52',
        proposalNo: 'TA-202605083',
        productName: '智能感应小夜灯',
        devMethod: '派生品',
        level: 'D',
        pm: '彭昱畅',
        sampleMethodText: '现货拿样',
        category: '家居灯饰',
        deadline: '2026-05-29',
        remainingDays: 9,
        isUrgent: false,
        receiverStatus: '样品待反馈',
        assignees: [{ name: '张艺兴', status: '开发反馈', step: 6, color: '#52c41a', time: '2026-05-20 10:30' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=53',
        proposalNo: 'TA-202605084',
        productName: '多功能工具钳',
        devMethod: '拓新采购',
        level: 'C',
        pm: '颜沙沙',
        sampleMethodText: '现货拿样',
        category: '五金工具',
        deadline: '2026-05-28',
        remainingDays: 8,
        isUrgent: true,
        receiverStatus: '样品待反馈',
        assignees: [{ name: '黄磊', status: '开发反馈', step: 6, color: '#faad14', time: '2026-05-20 11:45' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=54',
        proposalNo: 'TA-202605085',
        productName: '便携式投影仪',
        devMethod: '全新品-定制',
        level: 'A',
        pm: '何炅',
        sampleMethodText: '定制拿样',
        category: '影音娱乐',
        deadline: '2026-06-07',
        remainingDays: 17,
        isUrgent: false,
        receiverStatus: '样品待反馈',
        assignees: [{ name: '谢娜', status: '开发反馈', step: 6, color: '#ff4d4f', time: '2026-05-20 15:15' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=55',
        proposalNo: 'TA-202605086',
        productName: '真无线降噪耳机',
        devMethod: '拓新采购',
        level: 'B',
        pm: '颜沙沙',
        sampleMethodText: '现货拿样',
        category: '数码配件',
        deadline: '2026-05-31',
        remainingDays: 11,
        isUrgent: false,
        receiverStatus: '样品待反馈',
        assignees: [{ name: '维嘉', status: '开发反馈', step: 6, color: '#722ed1', time: '2026-05-20 16:40' }]
    },
    {
        image: 'https://picsum.photos/100/100?random=56',
        proposalNo: 'TA-202605087',
        productName: '智能跳绳 - 计数版',
        devMethod: '派生品',
        level: 'C',
        pm: '吴昕',
        sampleMethodText: '现货拿样',
        category: '运动器材',
        deadline: '2026-06-03',
        remainingDays: 13,
        isUrgent: false,
        receiverStatus: '样品待反馈',
        assignees: [{ name: '海涛', status: '开发反馈', step: 6, color: '#13c2c2', time: '2026-05-20 17:50' }]
    },
    ...Array(6).fill(0).map((_, i) => ({
        image: `https://picsum.photos/100/100?random=500${i}`,
        proposalNo: `TA-20260550${i}`,
        productName: `测试产品-样品待反馈-${i + 7}`,
        devMethod: '现货采购',
        level: 'C',
        pm: '测试经理',
        sampleMethodText: '现货拿样',
        category: '通用类目',
        deadline: '2026-07-01',
        remainingDays: 40,
        isUrgent: false,
        receiverStatus: '样品待反馈',
        assignees: []
    }))
]);
const feedbackData = ref([
    { no: 'FB2026052001', user: '张三', moldFee: '1200', sampleFee: '50', cycle: '15', remark: '供应商反馈模具需重新开发' }
]);
const feedbackDialogVisible = ref(false);
const feedbackList = ref([]);
const addFeedbackItem = () => {
    feedbackList.value.push({
        source: '',
        moldFee: 0,
        sampleFee: 0,
        isRefundable: false,
        customTime: 0,
        initialQuote: 0,
        productionCycle: 0,
        moq: 0,
        additionalTerms: ''
    });
};
const removeFeedbackItem = (index) => {
    if (feedbackList.value.length > 1) {
        feedbackList.value.splice(index, 1);
    }
};
// 设置默认选中第一个任务
currentTask.value = tableData.value[0];
const getAssigneesAtStep = (index) => {
    return currentTask.value?.assignees?.filter((a) => a.step === index) || [];
};
const isStepFullyDone = (index) => {
    if (!currentTask.value?.assignees)
        return false;
    return currentTask.value.assignees.every((a) => a.step > index);
};
const getStepClass = (index) => {
    if (!currentTask.value?.assignees)
        return '';
    const anyAtStep = currentTask.value.assignees.some((a) => a.step === index);
    const allBeyondStep = currentTask.value.assignees.every((a) => a.step > index);
    if (allBeyondStep)
        return 'done';
    if (anyAtStep)
        return 'active';
    return '';
};
const handleAccept = () => {
    if (currentTask.value) {
        currentTask.value.receiverStatus = '已承接';
    }
};
const handleTransfer = () => {
    console.log('Open Transfer Task Dialog');
};
const handleCustomFeedback = () => {
    feedbackList.value = [{
            source: '1688供应商',
            moldFee: 1500,
            sampleFee: 50,
            isRefundable: true,
            customTime: 15,
            initialQuote: 32.5,
            productionCycle: 20,
            moq: 500,
            additionalTerms: ''
        }];
    feedbackDialogVisible.value = true;
};
const submitFeedback = () => {
    if (currentTask.value) {
        // 批量提交反馈
        feedbackList.value.forEach((item, index) => {
            feedbackData.value.unshift({
                no: 'FB' + (Date.now() + index).toString().slice(-8),
                user: '当前用户',
                source: item.source,
                moldFee: item.moldFee.toString(),
                sampleFee: item.sampleFee.toString(),
                cycle: item.productionCycle.toString(),
                remark: item.additionalTerms
            });
        });
        currentTask.value.receiverStatus = '定制反馈';
        // 同步更新流程步骤 (取第一条作为当前状态更新)
        if (currentTask.value.assignees && currentTask.value.assignees.length > 0) {
            currentTask.value.assignees[0].status = '定制反馈';
            currentTask.value.assignees[0].step = 2;
            currentTask.value.assignees[0].time = new Date().toISOString().replace('T', ' ').slice(0, 16);
        }
        else {
            currentTask.value.assignees = [{
                    name: '当前用户',
                    status: '定制反馈',
                    step: 2,
                    color: '#1890ff',
                    time: new Date().toISOString().replace('T', ' ').slice(0, 16)
                }];
        }
        feedbackDialogVisible.value = false;
    }
};
const handlePurchaseApply = () => {
    console.log('Open Purchase Apply Dialog');
};
const handleSampleReg = () => {
    console.log('Open Sample Registration Dialog');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['list-group-title']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-title']} */ ;
/** @type {__VLS_StyleScopedClasses['task-card-mini']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-border']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['no']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-img']} */ ;
/** @type {__VLS_StyleScopedClasses['main-info']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
/** @type {__VLS_StyleScopedClasses['step-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['step-line']} */ ;
/** @type {__VLS_StyleScopedClasses['step-label']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['step-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['step-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-block']} */ ;
/** @type {__VLS_StyleScopedClasses['c-line']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['c-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['c-line']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['c-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "workbench-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "list-side" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "side-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-bar" },
});
const __VLS_0 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.searchQuery),
    placeholder: "搜索编号/产品",
    prefixIcon: "Search",
    size: "small",
    clearable: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.searchQuery),
    placeholder: "搜索编号/产品",
    prefixIcon: "Search",
    size: "small",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
if (__VLS_ctx.urgentList.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "urgent-top-section" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "list-group-title urgent-title" },
    });
    const __VLS_4 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
    const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    const __VLS_8 = {}.Warning;
    /** @type {[typeof __VLS_components.Warning, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
    const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
    var __VLS_7;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "t-text" },
    });
    const __VLS_12 = {}.ElBadge;
    /** @type {[typeof __VLS_components.ElBadge, typeof __VLS_components.elBadge, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        value: (__VLS_ctx.urgentList.length),
        max: (99),
        ...{ class: "urgent-count-badge" },
    }));
    const __VLS_14 = __VLS_13({
        value: (__VLS_ctx.urgentList.length),
        max: (99),
        ...{ class: "urgent-count-badge" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "urgent-scroll-list custom-scrollbar" },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.urgentList))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.urgentList.length > 0))
                        return;
                    __VLS_ctx.currentTask = item;
                } },
            key: (item.proposalNo),
            ...{ class: "task-card-mini urgent-border" },
            ...{ class: ({ active: __VLS_ctx.currentTask?.proposalNo === item.proposalNo }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-top" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "no" },
        });
        (item.proposalNo);
        const __VLS_16 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            size: "small",
            type: "danger",
            effect: "dark",
        }));
        const __VLS_18 = __VLS_17({
            size: "small",
            type: "danger",
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        __VLS_19.slots.default;
        var __VLS_19;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-main" },
        });
        const __VLS_20 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            ...{ 'onClick': {} },
            src: (item.image),
            ...{ class: "mini-img" },
            previewSrcList: ([item.image]),
            previewTeleported: true,
        }));
        const __VLS_22 = __VLS_21({
            ...{ 'onClick': {} },
            src: (item.image),
            ...{ class: "mini-img" },
            previewSrcList: ([item.image]),
            previewTeleported: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        let __VLS_24;
        let __VLS_25;
        let __VLS_26;
        const __VLS_27 = {
            onClick: () => { }
        };
        var __VLS_23;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "main-info" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "name" },
        });
        (item.productName);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "meta" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "pm" },
        });
        (item.pm);
        const __VLS_28 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
            direction: "vertical",
        }));
        const __VLS_30 = __VLS_29({
            direction: "vertical",
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "type" },
        });
        (item.sampleMethodText);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-scroll-tabs" },
});
for (const [tab] of __VLS_getVForSourceType((__VLS_ctx.statusTabs))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.activeTab = tab.value;
            } },
        key: (tab.value),
        ...{ class: "mini-tab" },
        ...{ class: ({ active: __VLS_ctx.activeTab === tab.value }) },
    });
    (tab.label);
    (tab.count);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "side-content custom-scrollbar" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.filteredSideList.filter(i => !i.isUrgent)))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.currentTask = item;
            } },
        key: (item.proposalNo),
        ...{ class: "task-card-mini" },
        ...{ class: ({ active: __VLS_ctx.currentTask?.proposalNo === item.proposalNo }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-top" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "no" },
    });
    (item.proposalNo);
    const __VLS_32 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        size: "small",
        type: "warning",
        effect: "plain",
    }));
    const __VLS_34 = __VLS_33({
        size: "small",
        type: "warning",
        effect: "plain",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    (item.remainingDays);
    var __VLS_35;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-main" },
    });
    const __VLS_36 = {}.ElImage;
    /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        src: (item.image),
        ...{ class: "mini-img" },
        previewSrcList: ([item.image]),
        previewTeleported: true,
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        src: (item.image),
        ...{ class: "mini-img" },
        previewSrcList: ([item.image]),
        previewTeleported: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClick: () => { }
    };
    var __VLS_39;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "main-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "name" },
    });
    (item.productName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "meta" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "pm" },
    });
    (item.pm);
    const __VLS_44 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        direction: "vertical",
    }));
    const __VLS_46 = __VLS_45({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "type" },
    });
    (item.sampleMethodText);
    if (item.receiverStatus !== '待反馈') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-footer" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "progress-mini" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-track" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-bar" },
            ...{ style: ({ width: '70%' }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "status-text" },
        });
        (item.receiverStatus);
    }
}
if (__VLS_ctx.filteredSideList.length === 0) {
    const __VLS_48 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        description: "暂无此类任务",
    }));
    const __VLS_50 = __VLS_49({
        description: "暂无此类任务",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
}
if (__VLS_ctx.currentTask) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "detail-workspace" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "workspace-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-left" },
    });
    const __VLS_52 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        size: "small",
        type: "danger",
        effect: "plain",
        ...{ class: "mr-8" },
    }));
    const __VLS_54 = __VLS_53({
        size: "small",
        type: "danger",
        effect: "plain",
        ...{ class: "mr-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    __VLS_55.slots.default;
    var __VLS_55;
    const __VLS_56 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        size: "small",
        type: "warning",
        effect: "dark",
        ...{ class: "mr-8" },
    }));
    const __VLS_58 = __VLS_57({
        size: "small",
        type: "warning",
        effect: "dark",
        ...{ class: "mr-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    (__VLS_ctx.currentTask.level);
    var __VLS_59;
    const __VLS_60 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        size: "small",
        type: (__VLS_ctx.currentTask.sampleMethodText === '定制拿样' ? 'success' : 'info'),
        ...{ class: "mr-8" },
    }));
    const __VLS_62 = __VLS_61({
        size: "small",
        type: (__VLS_ctx.currentTask.sampleMethodText === '定制拿样' ? 'success' : 'info'),
        ...{ class: "mr-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    __VLS_63.slots.default;
    (__VLS_ctx.currentTask.sampleMethodText);
    var __VLS_63;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    (__VLS_ctx.currentTask.productName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "id-copy" },
    });
    (__VLS_ctx.currentTask.proposalNo);
    const __VLS_64 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
    const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
    __VLS_67.slots.default;
    const __VLS_68 = {}.CopyDocument;
    /** @type {[typeof __VLS_components.CopyDocument, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({}));
    const __VLS_70 = __VLS_69({}, ...__VLS_functionalComponentArgsRest(__VLS_69));
    var __VLS_67;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-right" },
    });
    if (__VLS_ctx.currentTask.receiverStatus === '待反馈') {
        const __VLS_72 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
            ...{ 'onClick': {} },
            size: "small",
            type: "primary",
        }));
        const __VLS_74 = __VLS_73({
            ...{ 'onClick': {} },
            size: "small",
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        let __VLS_76;
        let __VLS_77;
        let __VLS_78;
        const __VLS_79 = {
            onClick: (__VLS_ctx.handleAccept)
        };
        __VLS_75.slots.default;
        var __VLS_75;
        const __VLS_80 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
            ...{ 'onClick': {} },
            size: "small",
        }));
        const __VLS_82 = __VLS_81({
            ...{ 'onClick': {} },
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        let __VLS_84;
        let __VLS_85;
        let __VLS_86;
        const __VLS_87 = {
            onClick: (__VLS_ctx.handleTransfer)
        };
        __VLS_83.slots.default;
        var __VLS_83;
    }
    else if (__VLS_ctx.currentTask.receiverStatus === '已承接') {
        if (__VLS_ctx.currentTask.sampleMethodText === '定制拿样') {
            const __VLS_88 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
                ...{ 'onClick': {} },
                size: "small",
                type: "primary",
            }));
            const __VLS_90 = __VLS_89({
                ...{ 'onClick': {} },
                size: "small",
                type: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_89));
            let __VLS_92;
            let __VLS_93;
            let __VLS_94;
            const __VLS_95 = {
                onClick: (__VLS_ctx.handleCustomFeedback)
            };
            __VLS_91.slots.default;
            var __VLS_91;
        }
        else {
            const __VLS_96 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
                ...{ 'onClick': {} },
                size: "small",
                type: "warning",
            }));
            const __VLS_98 = __VLS_97({
                ...{ 'onClick': {} },
                size: "small",
                type: "warning",
            }, ...__VLS_functionalComponentArgsRest(__VLS_97));
            let __VLS_100;
            let __VLS_101;
            let __VLS_102;
            const __VLS_103 = {
                onClick: (__VLS_ctx.handlePurchaseApply)
            };
            __VLS_99.slots.default;
            var __VLS_99;
        }
        const __VLS_104 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
            ...{ 'onClick': {} },
            size: "small",
            type: "primary",
            icon: "Plus",
        }));
        const __VLS_106 = __VLS_105({
            ...{ 'onClick': {} },
            size: "small",
            type: "primary",
            icon: "Plus",
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        let __VLS_108;
        let __VLS_109;
        let __VLS_110;
        const __VLS_111 = {
            onClick: (__VLS_ctx.handleSampleReg)
        };
        __VLS_107.slots.default;
        var __VLS_107;
        const __VLS_112 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            size: "small",
        }));
        const __VLS_114 = __VLS_113({
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        __VLS_115.slots.default;
        var __VLS_115;
    }
    else {
        const __VLS_116 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            size: "small",
        }));
        const __VLS_118 = __VLS_117({
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        __VLS_119.slots.default;
        var __VLS_119;
        const __VLS_120 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
            size: "small",
            type: "primary",
        }));
        const __VLS_122 = __VLS_121({
            size: "small",
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        __VLS_123.slots.default;
        var __VLS_123;
        const __VLS_124 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            size: "small",
            type: "success",
            icon: "Check",
        }));
        const __VLS_126 = __VLS_125({
            size: "small",
            type: "success",
            icon: "Check",
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
        __VLS_127.slots.default;
        var __VLS_127;
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "workflow-stepper" },
    });
    for (const [step, index] of __VLS_getVForSourceType((__VLS_ctx.steps))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (index),
            ...{ class: "step-item" },
            ...{ class: (__VLS_ctx.getStepClass(index)) },
        });
        if (__VLS_ctx.getAssigneesAtStep(index).length > 0) {
            const __VLS_128 = {}.ElPopover;
            /** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
            // @ts-ignore
            const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
                placement: "bottom",
                width: (260),
                trigger: "hover",
                popperStyle: "padding: 0; border-radius: 8px; overflow: hidden;",
            }));
            const __VLS_130 = __VLS_129({
                placement: "bottom",
                width: (260),
                trigger: "hover",
                popperStyle: "padding: 0; border-radius: 8px; overflow: hidden;",
            }, ...__VLS_functionalComponentArgsRest(__VLS_129));
            __VLS_131.slots.default;
            {
                const { reference: __VLS_thisSlot } = __VLS_131.slots;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "step-node-trigger" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "step-icon" },
                });
                if (__VLS_ctx.isStepFullyDone(index)) {
                    const __VLS_132 = {}.ElIcon;
                    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                    // @ts-ignore
                    const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({}));
                    const __VLS_134 = __VLS_133({}, ...__VLS_functionalComponentArgsRest(__VLS_133));
                    __VLS_135.slots.default;
                    const __VLS_136 = {}.CircleCheckFilled;
                    /** @type {[typeof __VLS_components.CircleCheckFilled, ]} */ ;
                    // @ts-ignore
                    const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({}));
                    const __VLS_138 = __VLS_137({}, ...__VLS_functionalComponentArgsRest(__VLS_137));
                    var __VLS_135;
                }
                else {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
                    (index + 1);
                }
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "step-label" },
                });
                (step);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "member-badges" },
                });
                for (const [user] of __VLS_getVForSourceType((__VLS_ctx.getAssigneesAtStep(index)))) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        key: (user.name),
                        ...{ class: "m-dot" },
                        ...{ style: ({ backgroundColor: user.color }) },
                    });
                }
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "popper-detail-panel" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "p-header" },
            });
            (step);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "p-list" },
            });
            for (const [user] of __VLS_getVForSourceType((__VLS_ctx.getAssigneesAtStep(index)))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    key: (user.name),
                    ...{ class: "p-card" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "p-line-1" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "p-name" },
                });
                (user.name);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "p-status" },
                    ...{ style: ({ color: user.color, backgroundColor: user.color + '15' }) },
                });
                (user.status);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "p-time" },
                });
                (user.time);
            }
            var __VLS_131;
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "step-node-trigger" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "step-icon" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            (index + 1);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "step-label" },
            });
            (step);
        }
        if (index < __VLS_ctx.steps.length - 1) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "step-line" },
            });
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "workspace-body custom-scrollbar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dashboard-grid" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-block" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "block-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "field-grid-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "f-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.category);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "f-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "f-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.pm);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "f-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-truncate" },
    });
    (__VLS_ctx.currentTask.productName);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "f-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "f-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "f-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "f-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "f-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    if (__VLS_ctx.currentTask.receiverStatus !== '待反馈') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "info-block" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "block-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "field-grid-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        const __VLS_140 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
            size: "small",
            effect: "plain",
            type: "info",
        }));
        const __VLS_142 = __VLS_141({
            size: "small",
            effect: "plain",
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_141));
        __VLS_143.slots.default;
        (__VLS_ctx.currentTask.devMethod);
        var __VLS_143;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "price-text" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "info-block block-time" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "block-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "time-data-list" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "t-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    if (__VLS_ctx.currentTask.sampleMethodText === '定制拿样') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "t-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "t-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.currentTask.deadline.slice(5));
    const __VLS_144 = {}.ElDivider;
    /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
        borderStyle: "dashed",
        ...{ style: {} },
    }));
    const __VLS_146 = __VLS_145({
        borderStyle: "dashed",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "time-metrics" },
    });
    if (__VLS_ctx.currentTask.sampleMethodText === '定制拿样') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "metric" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "m-val warning" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "m-lab" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "metric" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "m-val" },
        ...{ class: ({ danger: __VLS_ctx.currentTask.remainingDays <= 7 }) },
    });
    (__VLS_ctx.currentTask.remainingDays);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "m-lab" },
    });
    if (__VLS_ctx.currentTask.receiverStatus !== '待反馈') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "info-block mt-16" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "block-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "field-grid-3" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item col-span-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "link-text" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "is-req" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "link-text text-truncate" },
            title: "https://www.amazon.com/Doerpuz-Jigsaw-Drawers-1500pcs-Adjustable/dp/B0FGMTFZ2D/...",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "f-item" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "preview-box" },
        });
        const __VLS_148 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
            src: "https://picsum.photos/100/100?random=50",
            previewSrcList: (['https://picsum.photos/100/100?random=50']),
            previewTeleported: true,
        }));
        const __VLS_150 = __VLS_149({
            src: "https://picsum.photos/100/100?random=50",
            previewSrcList: (['https://picsum.photos/100/100?random=50']),
            previewTeleported: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    }
    if (__VLS_ctx.currentTask.receiverStatus !== '待反馈') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "info-block mt-16" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "block-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "task-detail-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "group-header" },
        });
        if (__VLS_ctx.currentTask.sampleMethodText === '现货拿样') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "field-grid-3" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item highlight-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "price-text" },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item col-span-3 notice-block" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        else if (__VLS_ctx.currentTask.sampleMethodText === '定制拿样') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "field-grid-3" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item col-span-2" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "link-text" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item highlight-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "price-text" },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item col-span-3 notice-block" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "field-grid-3" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "link-text" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item col-span-2" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "f-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
        const __VLS_152 = {}.ElDivider;
        /** @type {[typeof __VLS_components.ElDivider, typeof __VLS_components.elDivider, ]} */ ;
        // @ts-ignore
        const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
            borderStyle: "dashed",
            ...{ style: {} },
        }));
        const __VLS_154 = __VLS_153({
            borderStyle: "dashed",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_153));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "task-detail-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "group-header" },
        });
        if (__VLS_ctx.currentTask.sampleMethodText === '定制拿样') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "mini-feedback-section mt-12" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "section-sub-label" },
            });
            (__VLS_ctx.feedbackData.length);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "feedback-action-table" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "fat-header" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "col-user" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "col-price" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "col-price" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "col-cycle" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "col-ops" },
            });
            for (const [item] of __VLS_getVForSourceType((__VLS_ctx.feedbackData))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "fat-row" },
                    key: (item.no),
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "fat-main" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "col-user" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({});
                (item.user);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "col-price price-text" },
                });
                (item.moldFee);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "col-price price-text" },
                });
                (item.sampleFee);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "col-cycle" },
                });
                (item.cycle);
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "col-ops" },
                });
                const __VLS_156 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
                    type: "primary",
                    link: true,
                    size: "small",
                }));
                const __VLS_158 = __VLS_157({
                    type: "primary",
                    link: true,
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_157));
                __VLS_159.slots.default;
                var __VLS_159;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "business-chain-panel" },
                });
                if (item.remark) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        ...{ class: "chain-remark" },
                    });
                    (item.remark);
                }
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "chain-steps" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "c-step done" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "c-line" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "c-dot" },
                });
                const __VLS_160 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({}));
                const __VLS_162 = __VLS_161({}, ...__VLS_functionalComponentArgsRest(__VLS_161));
                __VLS_163.slots.default;
                const __VLS_164 = {}.CircleCheckFilled;
                /** @type {[typeof __VLS_components.CircleCheckFilled, ]} */ ;
                // @ts-ignore
                const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({}));
                const __VLS_166 = __VLS_165({}, ...__VLS_functionalComponentArgsRest(__VLS_165));
                var __VLS_163;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "c-content" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "c-label" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "c-val" },
                });
                const __VLS_168 = {}.ElTag;
                /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
                // @ts-ignore
                const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
                    size: "small",
                    type: "success",
                    effect: "plain",
                }));
                const __VLS_170 = __VLS_169({
                    size: "small",
                    type: "success",
                    effect: "plain",
                }, ...__VLS_functionalComponentArgsRest(__VLS_169));
                __VLS_171.slots.default;
                var __VLS_171;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "c-step active" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "c-line" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "c-dot" },
                });
                const __VLS_172 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({}));
                const __VLS_174 = __VLS_173({}, ...__VLS_functionalComponentArgsRest(__VLS_173));
                __VLS_175.slots.default;
                const __VLS_176 = {}.Timer;
                /** @type {[typeof __VLS_components.Timer, ]} */ ;
                // @ts-ignore
                const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({}));
                const __VLS_178 = __VLS_177({}, ...__VLS_functionalComponentArgsRest(__VLS_177));
                var __VLS_175;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "c-content" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "c-label" },
                });
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "c-val text-placeholder" },
                });
                const __VLS_180 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
                    ...{ 'onClick': {} },
                    type: "primary",
                    size: "small",
                    icon: "Plus",
                }));
                const __VLS_182 = __VLS_181({
                    ...{ 'onClick': {} },
                    type: "primary",
                    size: "small",
                    icon: "Plus",
                }, ...__VLS_functionalComponentArgsRest(__VLS_181));
                let __VLS_184;
                let __VLS_185;
                let __VLS_186;
                const __VLS_187 = {
                    onClick: (__VLS_ctx.handleSampleReg)
                };
                __VLS_183.slots.default;
                var __VLS_183;
            }
        }
    }
    if (__VLS_ctx.currentTask.receiverStatus !== '待反馈') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "info-block mt-16" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "block-title" },
        });
        const __VLS_188 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
            type: "primary",
            link: true,
            icon: "Plus",
            size: "small",
        }));
        const __VLS_190 = __VLS_189({
            type: "primary",
            link: true,
            icon: "Plus",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_189));
        __VLS_191.slots.default;
        var __VLS_191;
        const __VLS_192 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
            data: (__VLS_ctx.feedbackData),
            size: "small",
            border: true,
            ...{ class: "flat-table" },
        }));
        const __VLS_194 = __VLS_193({
            data: (__VLS_ctx.feedbackData),
            size: "small",
            border: true,
            ...{ class: "flat-table" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_193));
        __VLS_195.slots.default;
        const __VLS_196 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
            prop: "no",
            label: "反馈编号",
            width: "150",
        }));
        const __VLS_198 = __VLS_197({
            prop: "no",
            label: "反馈编号",
            width: "150",
        }, ...__VLS_functionalComponentArgsRest(__VLS_197));
        const __VLS_200 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
            prop: "user",
            label: "采购员",
            width: "100",
        }));
        const __VLS_202 = __VLS_201({
            prop: "user",
            label: "采购员",
            width: "100",
        }, ...__VLS_functionalComponentArgsRest(__VLS_201));
        const __VLS_204 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
            prop: "moldFee",
            label: "开模费",
            width: "100",
        }));
        const __VLS_206 = __VLS_205({
            prop: "moldFee",
            label: "开模费",
            width: "100",
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
        __VLS_207.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_207.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "price-text" },
            });
            (row.moldFee);
        }
        var __VLS_207;
        const __VLS_208 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
            prop: "sampleFee",
            label: "拿样费",
            width: "100",
        }));
        const __VLS_210 = __VLS_209({
            prop: "sampleFee",
            label: "拿样费",
            width: "100",
        }, ...__VLS_functionalComponentArgsRest(__VLS_209));
        __VLS_211.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_211.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "price-text" },
            });
            (row.sampleFee);
        }
        var __VLS_211;
        const __VLS_212 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
            prop: "cycle",
            label: "定制周期",
            width: "100",
            align: "center",
        }));
        const __VLS_214 = __VLS_213({
            prop: "cycle",
            label: "定制周期",
            width: "100",
            align: "center",
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
        __VLS_215.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_215.slots;
            const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
            (row.cycle);
        }
        var __VLS_215;
        const __VLS_216 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
            prop: "remark",
            label: "采购备注",
            minWidth: "200",
            showOverflowTooltip: true,
        }));
        const __VLS_218 = __VLS_217({
            prop: "remark",
            label: "采购备注",
            minWidth: "200",
            showOverflowTooltip: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_217));
        var __VLS_195;
    }
    if (__VLS_ctx.currentTask.receiverStatus !== '待反馈') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "info-block mt-16" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "block-title" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "sku-cards-container" },
        });
        for (const [i] of __VLS_getVForSourceType((3))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (i),
                ...{ class: "sku-mini-card" },
            });
            const __VLS_220 = {}.ElImage;
            /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
            // @ts-ignore
            const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
                src: "https://picsum.photos/100/100?random=10",
                ...{ class: "sku-img" },
            }));
            const __VLS_222 = __VLS_221({
                src: "https://picsum.photos/100/100?random=10",
                ...{ class: "sku-img" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_221));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "sku-details" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "sku-row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "sku-row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "sku-row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "status-dot success" },
            });
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "sku-add-card" },
        });
        const __VLS_224 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({}));
        const __VLS_226 = __VLS_225({}, ...__VLS_functionalComponentArgsRest(__VLS_225));
        __VLS_227.slots.default;
        const __VLS_228 = {}.Plus;
        /** @type {[typeof __VLS_components.Plus, ]} */ ;
        // @ts-ignore
        const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({}));
        const __VLS_230 = __VLS_229({}, ...__VLS_functionalComponentArgsRest(__VLS_229));
        var __VLS_227;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-workspace" },
    });
    const __VLS_232 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
        description: "选择左侧任务开启高效办公",
    }));
    const __VLS_234 = __VLS_233({
        description: "选择左侧任务开启高效办公",
    }, ...__VLS_functionalComponentArgsRest(__VLS_233));
}
const __VLS_236 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    modelValue: (__VLS_ctx.feedbackDialogVisible),
    title: "定制拿样反馈",
    width: "900px",
    appendToBody: true,
}));
const __VLS_238 = __VLS_237({
    modelValue: (__VLS_ctx.feedbackDialogVisible),
    title: "定制拿样反馈",
    width: "900px",
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "feedback-batch-container custom-scrollbar" },
    ...{ style: {} },
});
for (const [form, index] of __VLS_getVForSourceType((__VLS_ctx.feedbackList))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (index),
        ...{ class: "feedback-item-block" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "block-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "block-num" },
    });
    (index + 1);
    if (__VLS_ctx.feedbackList.length > 1) {
        const __VLS_240 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
            ...{ 'onClick': {} },
            type: "danger",
            link: true,
            icon: "Delete",
        }));
        const __VLS_242 = __VLS_241({
            ...{ 'onClick': {} },
            type: "danger",
            link: true,
            icon: "Delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_241));
        let __VLS_244;
        let __VLS_245;
        let __VLS_246;
        const __VLS_247 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.feedbackList.length > 1))
                    return;
                __VLS_ctx.removeFeedbackItem(index);
            }
        };
        __VLS_243.slots.default;
        var __VLS_243;
    }
    const __VLS_248 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
        model: (form),
        labelWidth: "90px",
        labelPosition: "right",
    }));
    const __VLS_250 = __VLS_249({
        model: (form),
        labelWidth: "90px",
        labelPosition: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    __VLS_251.slots.default;
    const __VLS_252 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        gutter: (20),
    }));
    const __VLS_254 = __VLS_253({
        gutter: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    __VLS_255.slots.default;
    const __VLS_256 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
        span: (6),
    }));
    const __VLS_258 = __VLS_257({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    __VLS_259.slots.default;
    const __VLS_260 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
        label: "货源地:",
        required: true,
    }));
    const __VLS_262 = __VLS_261({
        label: "货源地:",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_261));
    __VLS_263.slots.default;
    const __VLS_264 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
        modelValue: (form.source),
        placeholder: "请选择",
        ...{ style: {} },
    }));
    const __VLS_266 = __VLS_265({
        modelValue: (form.source),
        placeholder: "请选择",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_265));
    __VLS_267.slots.default;
    const __VLS_268 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
        label: "1688",
        value: "1688",
    }));
    const __VLS_270 = __VLS_269({
        label: "1688",
        value: "1688",
    }, ...__VLS_functionalComponentArgsRest(__VLS_269));
    const __VLS_272 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
        label: "线下工厂",
        value: "线下工厂",
    }));
    const __VLS_274 = __VLS_273({
        label: "线下工厂",
        value: "线下工厂",
    }, ...__VLS_functionalComponentArgsRest(__VLS_273));
    const __VLS_276 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
        label: "自有开发",
        value: "自有开发",
    }));
    const __VLS_278 = __VLS_277({
        label: "自有开发",
        value: "自有开发",
    }, ...__VLS_functionalComponentArgsRest(__VLS_277));
    var __VLS_267;
    var __VLS_263;
    var __VLS_259;
    const __VLS_280 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
        span: (6),
    }));
    const __VLS_282 = __VLS_281({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    __VLS_283.slots.default;
    const __VLS_284 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
        label: "开模费用:",
        required: true,
    }));
    const __VLS_286 = __VLS_285({
        label: "开模费用:",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_285));
    __VLS_287.slots.default;
    const __VLS_288 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
        modelValue: (form.moldFee),
        min: (0),
        precision: (2),
        controls: (false),
        placeholder: "请输入",
        ...{ style: {} },
    }));
    const __VLS_290 = __VLS_289({
        modelValue: (form.moldFee),
        min: (0),
        precision: (2),
        controls: (false),
        placeholder: "请输入",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_289));
    var __VLS_287;
    var __VLS_283;
    const __VLS_292 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
        span: (6),
    }));
    const __VLS_294 = __VLS_293({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_293));
    __VLS_295.slots.default;
    const __VLS_296 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
        label: "打样费用:",
        required: true,
    }));
    const __VLS_298 = __VLS_297({
        label: "打样费用:",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_297));
    __VLS_299.slots.default;
    const __VLS_300 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
        modelValue: (form.sampleFee),
        min: (0),
        precision: (2),
        controls: (false),
        placeholder: "请输入",
        ...{ style: {} },
    }));
    const __VLS_302 = __VLS_301({
        modelValue: (form.sampleFee),
        min: (0),
        precision: (2),
        controls: (false),
        placeholder: "请输入",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
    var __VLS_299;
    var __VLS_295;
    const __VLS_304 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
        span: (6),
        ...{ style: {} },
    }));
    const __VLS_306 = __VLS_305({
        span: (6),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_305));
    __VLS_307.slots.default;
    const __VLS_308 = {}.ElCheckbox;
    /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
    // @ts-ignore
    const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
        modelValue: (form.isRefundable),
    }));
    const __VLS_310 = __VLS_309({
        modelValue: (form.isRefundable),
    }, ...__VLS_functionalComponentArgsRest(__VLS_309));
    __VLS_311.slots.default;
    var __VLS_311;
    var __VLS_307;
    var __VLS_255;
    const __VLS_312 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
        gutter: (20),
        ...{ class: "mt-8" },
    }));
    const __VLS_314 = __VLS_313({
        gutter: (20),
        ...{ class: "mt-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_313));
    __VLS_315.slots.default;
    const __VLS_316 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_317 = __VLS_asFunctionalComponent(__VLS_316, new __VLS_316({
        span: (6),
    }));
    const __VLS_318 = __VLS_317({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_317));
    __VLS_319.slots.default;
    const __VLS_320 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
        label: "定制用时:",
        required: true,
    }));
    const __VLS_322 = __VLS_321({
        label: "定制用时:",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_321));
    __VLS_323.slots.default;
    const __VLS_324 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_325 = __VLS_asFunctionalComponent(__VLS_324, new __VLS_324({
        modelValue: (form.customTime),
        placeholder: "请输入",
    }));
    const __VLS_326 = __VLS_325({
        modelValue: (form.customTime),
        placeholder: "请输入",
    }, ...__VLS_functionalComponentArgsRest(__VLS_325));
    __VLS_327.slots.default;
    {
        const { append: __VLS_thisSlot } = __VLS_327.slots;
    }
    var __VLS_327;
    var __VLS_323;
    var __VLS_319;
    const __VLS_328 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
        span: (6),
    }));
    const __VLS_330 = __VLS_329({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_329));
    __VLS_331.slots.default;
    const __VLS_332 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
        label: "初次报价:",
        required: true,
    }));
    const __VLS_334 = __VLS_333({
        label: "初次报价:",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_333));
    __VLS_335.slots.default;
    const __VLS_336 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
        modelValue: (form.initialQuote),
        placeholder: "请输入",
    }));
    const __VLS_338 = __VLS_337({
        modelValue: (form.initialQuote),
        placeholder: "请输入",
    }, ...__VLS_functionalComponentArgsRest(__VLS_337));
    __VLS_339.slots.default;
    {
        const { append: __VLS_thisSlot } = __VLS_339.slots;
    }
    var __VLS_339;
    var __VLS_335;
    var __VLS_331;
    const __VLS_340 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
        span: (6),
    }));
    const __VLS_342 = __VLS_341({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_341));
    __VLS_343.slots.default;
    const __VLS_344 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
        label: "生产周期:",
        required: true,
    }));
    const __VLS_346 = __VLS_345({
        label: "生产周期:",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_345));
    __VLS_347.slots.default;
    const __VLS_348 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
        modelValue: (form.productionCycle),
        placeholder: "请输入",
    }));
    const __VLS_350 = __VLS_349({
        modelValue: (form.productionCycle),
        placeholder: "请输入",
    }, ...__VLS_functionalComponentArgsRest(__VLS_349));
    __VLS_351.slots.default;
    {
        const { append: __VLS_thisSlot } = __VLS_351.slots;
    }
    var __VLS_351;
    var __VLS_347;
    var __VLS_343;
    const __VLS_352 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
        span: (6),
    }));
    const __VLS_354 = __VLS_353({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_353));
    __VLS_355.slots.default;
    const __VLS_356 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_357 = __VLS_asFunctionalComponent(__VLS_356, new __VLS_356({
        label: "起订量:",
        required: true,
    }));
    const __VLS_358 = __VLS_357({
        label: "起订量:",
        required: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_357));
    __VLS_359.slots.default;
    const __VLS_360 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
        modelValue: (form.moq),
        placeholder: "请输入",
        ...{ style: {} },
    }));
    const __VLS_362 = __VLS_361({
        modelValue: (form.moq),
        placeholder: "请输入",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_361));
    var __VLS_359;
    var __VLS_355;
    var __VLS_315;
    const __VLS_364 = {}.ElRow;
    /** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
    // @ts-ignore
    const __VLS_365 = __VLS_asFunctionalComponent(__VLS_364, new __VLS_364({
        gutter: (20),
        ...{ class: "mt-8" },
    }));
    const __VLS_366 = __VLS_365({
        gutter: (20),
        ...{ class: "mt-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_365));
    __VLS_367.slots.default;
    const __VLS_368 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
        span: (24),
    }));
    const __VLS_370 = __VLS_369({
        span: (24),
    }, ...__VLS_functionalComponentArgsRest(__VLS_369));
    __VLS_371.slots.default;
    const __VLS_372 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
        label: "附加条件:",
    }));
    const __VLS_374 = __VLS_373({
        label: "附加条件:",
    }, ...__VLS_functionalComponentArgsRest(__VLS_373));
    __VLS_375.slots.default;
    const __VLS_376 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
        modelValue: (form.additionalTerms),
        type: "textarea",
        rows: (2),
        placeholder: "请输入",
        maxlength: "200",
        showWordLimit: true,
    }));
    const __VLS_378 = __VLS_377({
        modelValue: (form.additionalTerms),
        type: "textarea",
        rows: (2),
        placeholder: "请输入",
        maxlength: "200",
        showWordLimit: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_377));
    var __VLS_375;
    var __VLS_371;
    var __VLS_367;
    var __VLS_251;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.addFeedbackItem) },
    ...{ class: "add-block-btn" },
});
const __VLS_380 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({}));
const __VLS_382 = __VLS_381({}, ...__VLS_functionalComponentArgsRest(__VLS_381));
__VLS_383.slots.default;
const __VLS_384 = {}.Plus;
/** @type {[typeof __VLS_components.Plus, ]} */ ;
// @ts-ignore
const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({}));
const __VLS_386 = __VLS_385({}, ...__VLS_functionalComponentArgsRest(__VLS_385));
var __VLS_383;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
{
    const { footer: __VLS_thisSlot } = __VLS_239.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ style: {} },
    });
    (__VLS_ctx.feedbackList.length);
    const __VLS_388 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
        ...{ 'onClick': {} },
    }));
    const __VLS_390 = __VLS_389({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_389));
    let __VLS_392;
    let __VLS_393;
    let __VLS_394;
    const __VLS_395 = {
        onClick: (...[$event]) => {
            __VLS_ctx.feedbackDialogVisible = false;
        }
    };
    __VLS_391.slots.default;
    var __VLS_391;
    const __VLS_396 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_397 = __VLS_asFunctionalComponent(__VLS_396, new __VLS_396({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_398 = __VLS_397({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_397));
    let __VLS_400;
    let __VLS_401;
    let __VLS_402;
    const __VLS_403 = {
        onClick: (__VLS_ctx.submitFeedback)
    };
    __VLS_399.slots.default;
    (__VLS_ctx.feedbackList.length);
    var __VLS_399;
}
var __VLS_239;
/** @type {__VLS_StyleScopedClasses['page-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['workbench-container']} */ ;
/** @type {__VLS_StyleScopedClasses['list-side']} */ ;
/** @type {__VLS_StyleScopedClasses['side-header']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-top-section']} */ ;
/** @type {__VLS_StyleScopedClasses['list-group-title']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-title']} */ ;
/** @type {__VLS_StyleScopedClasses['t-text']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-count-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-scroll-list']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['task-card-mini']} */ ;
/** @type {__VLS_StyleScopedClasses['urgent-border']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['no']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-img']} */ ;
/** @type {__VLS_StyleScopedClasses['main-info']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
/** @type {__VLS_StyleScopedClasses['pm']} */ ;
/** @type {__VLS_StyleScopedClasses['type']} */ ;
/** @type {__VLS_StyleScopedClasses['status-scroll-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-tab']} */ ;
/** @type {__VLS_StyleScopedClasses['side-content']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['task-card-mini']} */ ;
/** @type {__VLS_StyleScopedClasses['card-top']} */ ;
/** @type {__VLS_StyleScopedClasses['no']} */ ;
/** @type {__VLS_StyleScopedClasses['card-main']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-img']} */ ;
/** @type {__VLS_StyleScopedClasses['main-info']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
/** @type {__VLS_StyleScopedClasses['pm']} */ ;
/** @type {__VLS_StyleScopedClasses['type']} */ ;
/** @type {__VLS_StyleScopedClasses['card-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-mini']} */ ;
/** @type {__VLS_StyleScopedClasses['p-track']} */ ;
/** @type {__VLS_StyleScopedClasses['p-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['status-text']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-workspace']} */ ;
/** @type {__VLS_StyleScopedClasses['workspace-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['id-copy']} */ ;
/** @type {__VLS_StyleScopedClasses['header-right']} */ ;
/** @type {__VLS_StyleScopedClasses['workflow-stepper']} */ ;
/** @type {__VLS_StyleScopedClasses['step-item']} */ ;
/** @type {__VLS_StyleScopedClasses['step-node-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['step-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['step-label']} */ ;
/** @type {__VLS_StyleScopedClasses['member-badges']} */ ;
/** @type {__VLS_StyleScopedClasses['m-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['popper-detail-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['p-header']} */ ;
/** @type {__VLS_StyleScopedClasses['p-list']} */ ;
/** @type {__VLS_StyleScopedClasses['p-card']} */ ;
/** @type {__VLS_StyleScopedClasses['p-line-1']} */ ;
/** @type {__VLS_StyleScopedClasses['p-name']} */ ;
/** @type {__VLS_StyleScopedClasses['p-status']} */ ;
/** @type {__VLS_StyleScopedClasses['p-time']} */ ;
/** @type {__VLS_StyleScopedClasses['step-node-trigger']} */ ;
/** @type {__VLS_StyleScopedClasses['step-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['step-label']} */ ;
/** @type {__VLS_StyleScopedClasses['step-line']} */ ;
/** @type {__VLS_StyleScopedClasses['workspace-body']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['info-block']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['field-grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-block']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['field-grid-2']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-block']} */ ;
/** @type {__VLS_StyleScopedClasses['block-time']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['time-data-list']} */ ;
/** @type {__VLS_StyleScopedClasses['t-row']} */ ;
/** @type {__VLS_StyleScopedClasses['t-row']} */ ;
/** @type {__VLS_StyleScopedClasses['t-row']} */ ;
/** @type {__VLS_StyleScopedClasses['time-metrics']} */ ;
/** @type {__VLS_StyleScopedClasses['metric']} */ ;
/** @type {__VLS_StyleScopedClasses['m-val']} */ ;
/** @type {__VLS_StyleScopedClasses['warning']} */ ;
/** @type {__VLS_StyleScopedClasses['m-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['metric']} */ ;
/** @type {__VLS_StyleScopedClasses['m-val']} */ ;
/** @type {__VLS_StyleScopedClasses['m-lab']} */ ;
/** @type {__VLS_StyleScopedClasses['info-block']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['field-grid-3']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['link-text']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['is-req']} */ ;
/** @type {__VLS_StyleScopedClasses['link-text']} */ ;
/** @type {__VLS_StyleScopedClasses['text-truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-box']} */ ;
/** @type {__VLS_StyleScopedClasses['info-block']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['task-detail-group']} */ ;
/** @type {__VLS_StyleScopedClasses['group-header']} */ ;
/** @type {__VLS_StyleScopedClasses['field-grid-3']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight-item']} */ ;
/** @type {__VLS_StyleScopedClasses['price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-3']} */ ;
/** @type {__VLS_StyleScopedClasses['notice-block']} */ ;
/** @type {__VLS_StyleScopedClasses['field-grid-3']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['link-text']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['highlight-item']} */ ;
/** @type {__VLS_StyleScopedClasses['price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-3']} */ ;
/** @type {__VLS_StyleScopedClasses['notice-block']} */ ;
/** @type {__VLS_StyleScopedClasses['field-grid-3']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['link-text']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['col-span-2']} */ ;
/** @type {__VLS_StyleScopedClasses['f-item']} */ ;
/** @type {__VLS_StyleScopedClasses['task-detail-group']} */ ;
/** @type {__VLS_StyleScopedClasses['group-header']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-feedback-section']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['section-sub-label']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-action-table']} */ ;
/** @type {__VLS_StyleScopedClasses['fat-header']} */ ;
/** @type {__VLS_StyleScopedClasses['col-user']} */ ;
/** @type {__VLS_StyleScopedClasses['col-price']} */ ;
/** @type {__VLS_StyleScopedClasses['col-price']} */ ;
/** @type {__VLS_StyleScopedClasses['col-cycle']} */ ;
/** @type {__VLS_StyleScopedClasses['col-ops']} */ ;
/** @type {__VLS_StyleScopedClasses['fat-row']} */ ;
/** @type {__VLS_StyleScopedClasses['fat-main']} */ ;
/** @type {__VLS_StyleScopedClasses['col-user']} */ ;
/** @type {__VLS_StyleScopedClasses['col-price']} */ ;
/** @type {__VLS_StyleScopedClasses['price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['col-price']} */ ;
/** @type {__VLS_StyleScopedClasses['price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['col-cycle']} */ ;
/** @type {__VLS_StyleScopedClasses['col-ops']} */ ;
/** @type {__VLS_StyleScopedClasses['business-chain-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['chain-remark']} */ ;
/** @type {__VLS_StyleScopedClasses['chain-steps']} */ ;
/** @type {__VLS_StyleScopedClasses['c-step']} */ ;
/** @type {__VLS_StyleScopedClasses['done']} */ ;
/** @type {__VLS_StyleScopedClasses['c-line']} */ ;
/** @type {__VLS_StyleScopedClasses['c-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['c-content']} */ ;
/** @type {__VLS_StyleScopedClasses['c-label']} */ ;
/** @type {__VLS_StyleScopedClasses['c-val']} */ ;
/** @type {__VLS_StyleScopedClasses['c-step']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['c-line']} */ ;
/** @type {__VLS_StyleScopedClasses['c-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['c-content']} */ ;
/** @type {__VLS_StyleScopedClasses['c-label']} */ ;
/** @type {__VLS_StyleScopedClasses['c-val']} */ ;
/** @type {__VLS_StyleScopedClasses['text-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['info-block']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['flat-table']} */ ;
/** @type {__VLS_StyleScopedClasses['price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['price-text']} */ ;
/** @type {__VLS_StyleScopedClasses['info-block']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
/** @type {__VLS_StyleScopedClasses['block-title']} */ ;
/** @type {__VLS_StyleScopedClasses['sku-cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['sku-mini-card']} */ ;
/** @type {__VLS_StyleScopedClasses['sku-img']} */ ;
/** @type {__VLS_StyleScopedClasses['sku-details']} */ ;
/** @type {__VLS_StyleScopedClasses['sku-row']} */ ;
/** @type {__VLS_StyleScopedClasses['sku-row']} */ ;
/** @type {__VLS_StyleScopedClasses['sku-row']} */ ;
/** @type {__VLS_StyleScopedClasses['status-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['sku-add-card']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-workspace']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-batch-container']} */ ;
/** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
/** @type {__VLS_StyleScopedClasses['feedback-item-block']} */ ;
/** @type {__VLS_StyleScopedClasses['block-header']} */ ;
/** @type {__VLS_StyleScopedClasses['block-num']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
/** @type {__VLS_StyleScopedClasses['add-block-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CopyDocument: CopyDocument,
            CircleCheckFilled: CircleCheckFilled,
            Timer: Timer,
            Plus: Plus,
            Warning: Warning,
            searchQuery: searchQuery,
            activeTab: activeTab,
            currentTask: currentTask,
            statusTabs: statusTabs,
            steps: steps,
            urgentList: urgentList,
            filteredSideList: filteredSideList,
            feedbackData: feedbackData,
            feedbackDialogVisible: feedbackDialogVisible,
            feedbackList: feedbackList,
            addFeedbackItem: addFeedbackItem,
            removeFeedbackItem: removeFeedbackItem,
            getAssigneesAtStep: getAssigneesAtStep,
            isStepFullyDone: isStepFullyDone,
            getStepClass: getStepClass,
            handleAccept: handleAccept,
            handleTransfer: handleTransfer,
            handleCustomFeedback: handleCustomFeedback,
            submitFeedback: submitFeedback,
            handlePurchaseApply: handlePurchaseApply,
            handleSampleReg: handleSampleReg,
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