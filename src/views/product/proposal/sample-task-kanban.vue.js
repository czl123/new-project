/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Management, Warning, Timer, Money, CreditCard, FolderOpened, DataAnalysis } from '@element-plus/icons-vue';
import TaskDetailDrawer from './components/TaskDetailDrawer.vue';
export default await (async () => {
    // 筛选响应式变量
    const searchQuery = ref('');
    const selectedPm = ref('全部');
    const selectedAssignee = ref('全部');
    const selectedMethod = ref('全部');
    const selectedUrgency = ref('全部');
    const taskDetailDrawerRef = ref(null);
    // 选项列表数据
    const pmOptions = ['颜沙沙', '王小明', '张学友', '严选', '赵敏', '李健'];
    const assigneeOptions = ['张三', '李四', '王五', '黎明', '李想', '易烊千玺', '张子枫', '赵铁柱', '孙悟空'];
    // 模拟任务列表原始数据
    const rawTasks = ref([
        {
            image: 'https://picsum.photos/100/100?random=1',
            proposalNo: 'TA-202605049',
            productName: 'DIY灯光板 - 亚克力透明款',
            pm: '颜沙沙',
            category: '家居装饰',
            level: 'A',
            remainingDays: 2,
            isUrgent: true,
            receiverStatus: '待承接',
            assignees: [],
            costText: '打样费: ¥ 150',
            sampleMethodText: '定制拿样'
        },
        {
            image: 'https://picsum.photos/100/100?random=11',
            proposalNo: 'TA-202605060',
            productName: '智能香薰机 - 木纹版',
            pm: '王小明',
            category: '生活电器',
            level: 'B',
            remainingDays: 8,
            isUrgent: false,
            receiverStatus: '已承接',
            assignees: [{ name: '李华', color: '#3b82f6' }],
            costText: '无',
            sampleMethodText: '现货拿样'
        },
        {
            image: 'https://picsum.photos/100/100?random=21',
            proposalNo: 'TA-202605065',
            productName: '人体工学鼠标 - 旗舰版',
            pm: '张学友',
            category: '数码配件',
            level: 'A',
            remainingDays: 1,
            isUrgent: true,
            receiverStatus: '待审批',
            assignees: [{ name: '黎明', color: '#10b981' }],
            costText: '开模费: ¥ 8,000',
            sampleMethodText: '定制拿样'
        },
        {
            image: 'https://picsum.photos/100/100?random=31',
            proposalNo: 'TA-202605071',
            productName: '智能猫砂盆 - 自动清理',
            pm: '严选',
            category: '宠物用品',
            level: 'S',
            remainingDays: 20,
            isUrgent: false,
            receiverStatus: '样品运输中',
            assignees: [{ name: '李想', color: '#8b5cf6' }],
            costText: '购样费: ¥ 450',
            sampleMethodText: '现货拿样'
        },
        {
            image: 'https://picsum.photos/100/100?random=41',
            proposalNo: 'TA-202605076',
            productName: '折叠电动滑板车',
            pm: '颜沙沙',
            category: '出行工具',
            level: 'A',
            remainingDays: 6,
            isUrgent: true,
            receiverStatus: '样品评估中',
            assignees: [{ name: '易烊千玺', color: '#ec4899' }],
            costText: '打样费: ¥ 600',
            sampleMethodText: '定制拿样'
        },
        {
            image: 'https://picsum.photos/100/100?random=51',
            proposalNo: 'TA-202605082',
            productName: '猫咪自动饮水机',
            pm: '颜沙沙',
            category: '宠物用品',
            level: 'B',
            remainingDays: 0,
            isUrgent: true,
            receiverStatus: '已归档',
            assignees: [{ name: '张子枫', color: '#f59e0b' }],
            costText: '购样费: ¥ 120',
            sampleMethodText: '现货拿样'
        },
        {
            image: 'https://picsum.photos/100/100?random=61',
            proposalNo: 'TA-202605088',
            productName: '露营多功能手电筒',
            pm: '赵敏',
            category: '户外运动',
            level: 'C',
            remainingDays: 4,
            isUrgent: false,
            receiverStatus: '待承接',
            assignees: [],
            costText: '无',
            sampleMethodText: '现货拿样'
        },
        {
            image: 'https://picsum.photos/100/100?random=71',
            proposalNo: 'TA-202605090',
            productName: '亲肤减压腰带 - 隐身薄款',
            pm: '李健',
            category: '个护健康',
            level: 'A',
            remainingDays: 12,
            isUrgent: false,
            receiverStatus: '已承接',
            assignees: [{ name: '王五', color: '#6366f1' }],
            costText: '开模费: ¥ 5,000',
            sampleMethodText: '定制拿样'
        },
        {
            image: 'https://picsum.photos/100/100?random=81',
            proposalNo: 'TA-202605092',
            productName: '复古蓝牙音箱',
            pm: '王小明',
            category: '数码配件',
            level: 'B',
            remainingDays: -2,
            isUrgent: true,
            receiverStatus: '待审批',
            assignees: [{ name: '赵铁柱', color: '#14b8a6' }],
            costText: '打样费: ¥ 200',
            sampleMethodText: '现货拿样'
        },
        {
            image: 'https://picsum.photos/100/100?random=91',
            proposalNo: 'TA-202605095',
            productName: '户外防潮睡垫',
            pm: '严选',
            category: '户外运动',
            level: 'C',
            remainingDays: 15,
            isUrgent: false,
            receiverStatus: '样品评估中',
            assignees: [{ name: '孙悟空', color: '#a855f7' }],
            costText: '无',
            sampleMethodText: '现货拿样'
        }
    ]);
    // 组合筛选过滤逻辑
    const filteredTasks = computed(() => {
        return rawTasks.value.filter(task => {
            // 关键字搜索
            if (searchQuery.value) {
                const q = searchQuery.value.toLowerCase();
                const matchNo = task.proposalNo.toLowerCase().includes(q);
                const matchName = task.productName.toLowerCase().includes(q);
                const matchCat = task.category.toLowerCase().includes(q);
                if (!matchNo && !matchName && !matchCat)
                    return false;
            }
            // PM 筛选
            if (selectedPm.value !== '全部' && task.pm !== selectedPm.value) {
                return false;
            }
            // 承接人筛选
            if (selectedAssignee.value !== '全部') {
                const hasAssignee = task.assignees.some(u => u.name === selectedAssignee.value);
                if (!hasAssignee)
                    return false;
            }
            // 拿样方式筛选
            if (selectedMethod.value !== '全部' && task.sampleMethodText !== selectedMethod.value) {
                return false;
            }
            // 紧急度筛选
            if (selectedUrgency.value !== '全部') {
                const isUrgent = selectedUrgency.value === '紧急';
                if (task.isUrgent !== isUrgent)
                    return false;
            }
            return true;
        });
    });
    // 看板列计算数据
    const kanbanColumns = computed(() => [
        { label: '待承接', status: '待承接', color: '#64748b', bgColor: '#f1f5f9', tasks: filteredTasks.value.filter(t => t.receiverStatus === '待承接') },
        { label: '已承接/定制中', status: '已承接', color: '#3b82f6', bgColor: '#eff6ff', tasks: filteredTasks.value.filter(t => t.receiverStatus === '已承接') },
        { label: '待审批', status: '待审批', color: '#fa8c16', bgColor: '#fff7e6', tasks: filteredTasks.value.filter(t => t.receiverStatus === '待审批') },
        { label: '样品运输中', status: '样品运输中', color: '#9c27b0', bgColor: '#fdf4ff', tasks: filteredTasks.value.filter(t => t.receiverStatus === '样品运输中') },
        { label: '样品评估中', status: '样品评估中', color: '#10b981', bgColor: '#ecfdf5', tasks: filteredTasks.value.filter(t => t.receiverStatus === '样品评估中') },
        { label: '已归档/已完成', status: '已归档', color: '#8c8c8c', bgColor: '#f5f5f5', tasks: filteredTasks.value.filter(t => t.receiverStatus === '已归档') }
    ]);
    // 拿样环节耗时分析模拟数据
    const bottleneckSteps = ref([
        { name: '任务发布 ➔ 业务承接', duration: 0.5, percent: 15, isBottleneck: false },
        { name: '业务承接 ➔ 定制反馈(寻源)', duration: 2.1, percent: 85, isBottleneck: true },
        { name: '方案确认 ➔ 发起购样申请', duration: 0.8, percent: 25, isBottleneck: false },
        { name: '购样申请 ➔ 财务及经理审批', duration: 1.2, percent: 45, isBottleneck: false },
        { name: '审批同意 ➔ 样品到货登记', duration: 5.8, percent: 100, isBottleneck: false }, // 国际或定制生产长耗时属常规但正常
        { name: '样品到货 ➔ 评估及开发反馈', duration: 2.3, percent: 65, isBottleneck: false }
    ]);
    // 模具/样品退款监控闭环表格模拟数据
    const refundTrackerData = ref([
        {
            proposalNo: 'TA-202605069',
            productName: '电子墨水屏阅读器 (皮套模具)',
            supplier: '东莞模具厂',
            amount: '¥ 8,000.00',
            feeType: '模具费',
            terms: '大货满2,000套退款',
            currentQty: 2500,
            targetQty: 2000,
            status: '已达门槛(待催退)'
        },
        {
            proposalNo: 'TA-202605065',
            productName: '人体工学鼠标底壳模具',
            supplier: '中山光源五金厂',
            amount: '¥ 5,000.00',
            feeType: '模具费',
            terms: '大货满5,000套退款',
            currentQty: 1600,
            targetQty: 5000,
            status: '未达门槛'
        },
        {
            proposalNo: 'TA-202605021',
            productName: '厨房收纳置物架打样',
            supplier: '廊坊收纳制品厂',
            amount: '¥ 80.00',
            feeType: '打样费',
            terms: '首单满100套返现金',
            currentQty: 120,
            targetQty: 100,
            status: '退款申请中'
        },
        {
            proposalNo: 'TA-202604901',
            productName: '多功能露营灯外壳模具',
            supplier: '深圳精密塑料厂',
            amount: '¥ 12,000.00',
            feeType: '模具费',
            terms: '累计大货抵扣完毕',
            currentQty: 10000,
            targetQty: 10000,
            status: '已退款/归档'
        }
    ]);
    const handleFilter = () => {
        ElMessage.success('筛选条件已应用');
    };
    const handleResetFilters = () => {
        searchQuery.value = '';
        selectedPm.value = '全部';
        selectedAssignee.value = '全部';
        selectedMethod.value = '全部';
        selectedUrgency.value = '全部';
        ElMessage.success('筛选条件已重置');
    };
    // 标签样式计算
    const getRefundStatusTag = (status) => {
        switch (status) {
            case '已达门槛(待催退)': return 'danger';
            case '未达门槛': return 'info';
            case '退款申请中': return 'warning';
            case '已退款/归档': return 'success';
            default: return 'info';
        }
    };
    // 催办样品退款
    const handleRemindRefund = (row) => {
        ElMessageBox.confirm(`系统将向采购承接人员及供应商发送“催退样品/模具费”商务邮件与站内提示，确认催办？`, '退款催款提醒', {
            confirmButtonText: '确定发送',
            cancelButtonText: '取消',
            type: 'warning',
            buttonSize: 'small'
        }).then(() => {
            row.status = '退款申请中';
            ElMessage.success(`已向 ${row.supplier} 发起模具费 ¥ ${row.amount} 退款催办，状态已更新为“退款申请中”`);
        }).catch(() => { });
    };
    // 点击卡片打开详情抽屉
    const handleCardClick = (task) => {
        if (taskDetailDrawerRef.value) {
            taskDetailDrawerRef.value.open({
                no: task.proposalNo,
                name: task.productName,
                priority: task.isUrgent ? 'P0' : 'P1',
                status: task.receiverStatus,
                user: task.assignees?.[0]?.name || '未指派/待承接',
                deadline: task.remainingDays < 0 ? `已超期 ${Math.abs(task.remainingDays)} 天` : `剩余 ${task.remainingDays} 天`
            });
        }
        else {
            ElMessage.error('详情抽屉未正确加载');
        }
    };
    debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
    const __VLS_ctx = {};
    let __VLS_components;
    let __VLS_directives;
    /** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-card-inner']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
    /** @type {__VLS_StyleScopedClasses['value']} */ ;
    /** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
    /** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
    /** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-card-inner']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
    /** @type {__VLS_StyleScopedClasses['value']} */ ;
    /** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
    /** @type {__VLS_StyleScopedClasses['title']} */ ;
    /** @type {__VLS_StyleScopedClasses['title-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['no']} */ ;
    /** @type {__VLS_StyleScopedClasses['name']} */ ;
    // CSS variable injection 
    // CSS variable injection end 
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kanban-page custom-scrollbar" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "dashboard-header-wrapper mb-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header-title-line" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title-left" },
    });
    const __VLS_0 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "title-icon" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "title-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    const __VLS_4 = {}.DataAnalysis;
    /** @type {[typeof __VLS_components.DataAnalysis, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
    const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
    var __VLS_3;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "title-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "subtitle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title-right" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "refresh-time" },
    });
    const __VLS_8 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        size: "small",
        icon: "Refresh",
        circle: true,
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        size: "small",
        icon: "Refresh",
        circle: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    let __VLS_14;
    const __VLS_15 = {
        onClick: (__VLS_ctx.handleResetFilters)
    };
    var __VLS_11;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-cards-grid" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card total-tasks" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card-inner" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "value" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "unit" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "icon-box" },
    });
    const __VLS_16 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
    const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    const __VLS_20 = {}.Management;
    /** @type {[typeof __VLS_components.Management, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
    const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
    var __VLS_19;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "trendup" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "desc" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card urgent-tasks" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card-inner" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "value" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "unit" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "icon-box" },
    });
    const __VLS_24 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
    const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    const __VLS_28 = {}.Warning;
    /** @type {[typeof __VLS_components.Warning, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
    const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
    var __VLS_27;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "trenddown" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "desc" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card avg-cycle" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card-inner" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "value" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "unit" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "icon-box" },
    });
    const __VLS_32 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
    const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    const __VLS_36 = {}.Timer;
    /** @type {[typeof __VLS_components.Timer, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
    const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
    var __VLS_35;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "trendup" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "desc" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card total-cost" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card-inner" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "value" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "icon-box" },
    });
    const __VLS_40 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({}));
    const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    const __VLS_44 = {}.Money;
    /** @type {[typeof __VLS_components.Money, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
    const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
    var __VLS_43;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "accent-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "desc" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card refund-pending" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card-inner" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "value" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "icon-box" },
    });
    const __VLS_48 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({}));
    const __VLS_50 = __VLS_49({}, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    const __VLS_52 = {}.CreditCard;
    /** @type {[typeof __VLS_components.CreditCard, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({}));
    const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
    var __VLS_51;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-footer" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "highlight-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "desc" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-panel modern-card mb-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "filter-label" },
    });
    const __VLS_56 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        modelValue: (__VLS_ctx.selectedPm),
        placeholder: "请选择 PM",
        size: "default",
        ...{ style: {} },
    }));
    const __VLS_58 = __VLS_57({
        modelValue: (__VLS_ctx.selectedPm),
        placeholder: "请选择 PM",
        size: "default",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    const __VLS_60 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        label: "全部 PM",
        value: "全部",
    }));
    const __VLS_62 = __VLS_61({
        label: "全部 PM",
        value: "全部",
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.pmOptions))) {
        const __VLS_64 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
            key: (item),
            label: (item),
            value: (item),
        }));
        const __VLS_66 = __VLS_65({
            key: (item),
            label: (item),
            value: (item),
        }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    }
    var __VLS_59;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "filter-label" },
    });
    const __VLS_68 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        modelValue: (__VLS_ctx.selectedAssignee),
        placeholder: "请选择承接人",
        size: "default",
        ...{ style: {} },
    }));
    const __VLS_70 = __VLS_69({
        modelValue: (__VLS_ctx.selectedAssignee),
        placeholder: "请选择承接人",
        size: "default",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    __VLS_71.slots.default;
    const __VLS_72 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
        label: "全部承接人",
        value: "全部",
    }));
    const __VLS_74 = __VLS_73({
        label: "全部承接人",
        value: "全部",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.assigneeOptions))) {
        const __VLS_76 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
            key: (item),
            label: (item),
            value: (item),
        }));
        const __VLS_78 = __VLS_77({
            key: (item),
            label: (item),
            value: (item),
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    }
    var __VLS_71;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "filter-label" },
    });
    const __VLS_80 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
        modelValue: (__VLS_ctx.selectedMethod),
        placeholder: "请选择",
        size: "default",
        ...{ style: {} },
    }));
    const __VLS_82 = __VLS_81({
        modelValue: (__VLS_ctx.selectedMethod),
        placeholder: "请选择",
        size: "default",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    __VLS_83.slots.default;
    const __VLS_84 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        label: "全部方式",
        value: "全部",
    }));
    const __VLS_86 = __VLS_85({
        label: "全部方式",
        value: "全部",
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    const __VLS_88 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
        label: "现货拿样",
        value: "现货拿样",
    }));
    const __VLS_90 = __VLS_89({
        label: "现货拿样",
        value: "现货拿样",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    const __VLS_92 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        label: "定制拿样",
        value: "定制拿样",
    }));
    const __VLS_94 = __VLS_93({
        label: "定制拿样",
        value: "定制拿样",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    var __VLS_83;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "filter-label" },
    });
    const __VLS_96 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
        modelValue: (__VLS_ctx.selectedUrgency),
        placeholder: "请选择",
        size: "default",
        ...{ style: {} },
    }));
    const __VLS_98 = __VLS_97({
        modelValue: (__VLS_ctx.selectedUrgency),
        placeholder: "请选择",
        size: "default",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    __VLS_99.slots.default;
    const __VLS_100 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        label: "全部",
        value: "全部",
    }));
    const __VLS_102 = __VLS_101({
        label: "全部",
        value: "全部",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    const __VLS_104 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
        label: "紧急",
        value: "紧急",
    }));
    const __VLS_106 = __VLS_105({
        label: "紧急",
        value: "紧急",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    const __VLS_108 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
        label: "普通",
        value: "普通",
    }));
    const __VLS_110 = __VLS_109({
        label: "普通",
        value: "普通",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    var __VLS_99;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-item flex-grow" },
    });
    const __VLS_112 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
        modelValue: (__VLS_ctx.searchQuery),
        placeholder: "搜索提案编号/产品名称/大类...",
        prefixIcon: "Search",
        clearable: true,
        size: "default",
        ...{ style: {} },
    }));
    const __VLS_114 = __VLS_113({
        modelValue: (__VLS_ctx.searchQuery),
        placeholder: "搜索提案编号/产品名称/大类...",
        prefixIcon: "Search",
        clearable: true,
        size: "default",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "filter-actions" },
    });
    const __VLS_116 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        type: "primary",
        size: "default",
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        type: "primary",
        size: "default",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_120;
    let __VLS_121;
    let __VLS_122;
    const __VLS_123 = {
        onClick: (__VLS_ctx.handleFilter)
    };
    __VLS_119.slots.default;
    var __VLS_119;
    const __VLS_124 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
        ...{ 'onClick': {} },
        size: "default",
        plain: true,
    }));
    const __VLS_126 = __VLS_125({
        ...{ 'onClick': {} },
        size: "default",
        plain: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    let __VLS_128;
    let __VLS_129;
    let __VLS_130;
    const __VLS_131 = {
        onClick: (__VLS_ctx.handleResetFilters)
    };
    __VLS_127.slots.default;
    var __VLS_127;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "kanban-container custom-scrollbar mb-20" },
    });
    for (const [column] of __VLS_getVForSourceType((__VLS_ctx.kanbanColumns))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (column.status),
            ...{ class: "kanban-column" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "column-header" },
            ...{ style: ({ borderTopColor: column.color }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "header-left" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "dot" },
            ...{ style: ({ backgroundColor: column.color }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "title" },
        });
        (column.label);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "count-badge" },
            ...{ style: ({ backgroundColor: column.bgColor, color: column.color }) },
        });
        (column.tasks.length);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "column-body custom-scrollbar" },
        });
        for (const [task] of __VLS_getVForSourceType((column.tasks))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: (...[$event]) => {
                        __VLS_ctx.handleCardClick(task);
                    } },
                key: (task.proposalNo),
                ...{ class: "task-card" },
                ...{ class: ({ urgent: task.isUrgent }) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "card-tag-wrapper" },
            });
            const __VLS_132 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
                size: "small",
                type: (task.isUrgent ? 'danger' : 'info'),
                effect: "dark",
                ...{ class: "level-tag" },
            }));
            const __VLS_134 = __VLS_133({
                size: "small",
                type: (task.isUrgent ? 'danger' : 'info'),
                effect: "dark",
                ...{ class: "level-tag" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_133));
            __VLS_135.slots.default;
            (task.isUrgent ? 'P0' : 'P1');
            var __VLS_135;
            const __VLS_136 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
                size: "small",
                type: (task.sampleMethodText === '定制拿样' ? 'success' : 'primary'),
                effect: "plain",
                ...{ class: "method-tag" },
            }));
            const __VLS_138 = __VLS_137({
                size: "small",
                type: (task.sampleMethodText === '定制拿样' ? 'success' : 'primary'),
                effect: "plain",
                ...{ class: "method-tag" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_137));
            __VLS_139.slots.default;
            (task.sampleMethodText);
            var __VLS_139;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "task-top" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "no" },
            });
            (task.proposalNo);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "level-indicator" },
            });
            (task.level);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "task-info" },
            });
            const __VLS_140 = {}.ElImage;
            /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
            // @ts-ignore
            const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
                src: (task.image),
                ...{ class: "task-img" },
                fit: "cover",
            }));
            const __VLS_142 = __VLS_141({
                src: (task.image),
                ...{ class: "task-img" },
                fit: "cover",
            }, ...__VLS_functionalComponentArgsRest(__VLS_141));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "task-details" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "name" },
                title: (task.productName),
            });
            (task.productName);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "meta" },
            });
            (task.category);
            (task.pm);
            if (task.costText && task.costText !== '无') {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                    ...{ class: "task-cost-line" },
                });
                const __VLS_144 = {}.ElIcon;
                /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
                // @ts-ignore
                const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
                    ...{ class: "cost-icon" },
                }));
                const __VLS_146 = __VLS_145({
                    ...{ class: "cost-icon" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_145));
                __VLS_147.slots.default;
                const __VLS_148 = {}.Money;
                /** @type {[typeof __VLS_components.Money, ]} */ ;
                // @ts-ignore
                const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({}));
                const __VLS_150 = __VLS_149({}, ...__VLS_functionalComponentArgsRest(__VLS_149));
                var __VLS_147;
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "cost-val" },
                });
                (task.costText);
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "task-footer" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "time" },
                ...{ class: ({ danger: task.remainingDays <= 3 }) },
            });
            const __VLS_152 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({}));
            const __VLS_154 = __VLS_153({}, ...__VLS_functionalComponentArgsRest(__VLS_153));
            __VLS_155.slots.default;
            const __VLS_156 = {}.Timer;
            /** @type {[typeof __VLS_components.Timer, ]} */ ;
            // @ts-ignore
            const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({}));
            const __VLS_158 = __VLS_157({}, ...__VLS_functionalComponentArgsRest(__VLS_157));
            var __VLS_155;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
            if (task.remainingDays < 0) {
                (Math.abs(task.remainingDays));
            }
            else if (task.remainingDays === 0) {
            }
            else {
                (task.remainingDays);
            }
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "assignees-box" },
            });
            if (task.assignees && task.assignees.length) {
                for (const [user] of __VLS_getVForSourceType((task.assignees))) {
                    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                        key: (user.name),
                        ...{ class: "avatar-circle" },
                        ...{ style: ({ backgroundColor: user.color }) },
                        title: ('承接人: ' + user.name),
                    });
                    (user.name.charAt(0));
                }
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "no-assignee" },
                });
            }
        }
        if (column.tasks.length === 0) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "empty-column-placeholder" },
            });
            const __VLS_160 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
                ...{ class: "empty-icon" },
            }));
            const __VLS_162 = __VLS_161({
                ...{ class: "empty-icon" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_161));
            __VLS_163.slots.default;
            const __VLS_164 = {}.FolderOpened;
            /** @type {[typeof __VLS_components.FolderOpened, ]} */ ;
            // @ts-ignore
            const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({}));
            const __VLS_166 = __VLS_165({}, ...__VLS_functionalComponentArgsRest(__VLS_165));
            var __VLS_163;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "bottom-analytics-grid" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "analytics-card modern-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-header-v4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title" },
    });
    const __VLS_168 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        ...{ class: "title-icon" },
    }));
    const __VLS_170 = __VLS_169({
        ...{ class: "title-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    const __VLS_172 = {}.Timer;
    /** @type {[typeof __VLS_components.Timer, ]} */ ;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({}));
    const __VLS_174 = __VLS_173({}, ...__VLS_functionalComponentArgsRest(__VLS_173));
    var __VLS_171;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "header-desc" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "funnel-container" },
    });
    for (const [step, idx] of __VLS_getVForSourceType((__VLS_ctx.bottleneckSteps))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (step.name),
            ...{ class: "funnel-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "step-meta" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "step-num" },
        });
        (idx + 1);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "step-name" },
        });
        (step.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "step-progress-wrapper" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "step-bar-bg" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "step-bar-fill" },
            ...{ style: ({ width: step.percent + '%', backgroundColor: step.isBottleneck ? '#ef4444' : '#3b82f6' }) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "duration-text" },
        });
        (step.duration);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "step-status" },
        });
        if (step.isBottleneck) {
            const __VLS_176 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
                size: "small",
                type: "danger",
                effect: "dark",
                ...{ class: "bottleneck-tag" },
            }));
            const __VLS_178 = __VLS_177({
                size: "small",
                type: "danger",
                effect: "dark",
                ...{ class: "bottleneck-tag" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_177));
            __VLS_179.slots.default;
            var __VLS_179;
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "normal-status" },
            });
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "efficiency-insights mt-20" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "insight-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "insight-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "analytics-card modern-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-header-v4" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "title" },
    });
    const __VLS_180 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
        ...{ class: "title-icon" },
    }));
    const __VLS_182 = __VLS_181({
        ...{ class: "title-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    __VLS_183.slots.default;
    const __VLS_184 = {}.CreditCard;
    /** @type {[typeof __VLS_components.CreditCard, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({}));
    const __VLS_186 = __VLS_185({}, ...__VLS_functionalComponentArgsRest(__VLS_185));
    var __VLS_183;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "header-desc" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "refund-table-wrapper" },
    });
    const __VLS_188 = {}.ElTable;
    /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        data: (__VLS_ctx.refundTrackerData),
        border: true,
        stripe: true,
        size: "small",
        ...{ class: "refund-table" },
    }));
    const __VLS_190 = __VLS_189({
        data: (__VLS_ctx.refundTrackerData),
        border: true,
        stripe: true,
        size: "small",
        ...{ class: "refund-table" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    __VLS_191.slots.default;
    const __VLS_192 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        label: "提案/产品",
        minWidth: "150",
        showOverflowTooltip: true,
    }));
    const __VLS_194 = __VLS_193({
        label: "提案/产品",
        minWidth: "150",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    __VLS_195.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_195.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "refund-product-cell" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "no" },
        });
        (row.proposalNo);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "name" },
        });
        (row.productName);
    }
    var __VLS_195;
    const __VLS_196 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
        label: "供应商",
        prop: "supplier",
        width: "130",
        showOverflowTooltip: true,
    }));
    const __VLS_198 = __VLS_197({
        label: "供应商",
        prop: "supplier",
        width: "130",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    const __VLS_200 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({
        label: "垫付款项",
        width: "105",
    }));
    const __VLS_202 = __VLS_201({
        label: "垫付款项",
        width: "105",
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    __VLS_203.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_203.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "cost-cell" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "amt" },
        });
        (row.amount);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "type" },
        });
        (row.feeType);
    }
    var __VLS_203;
    const __VLS_204 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        label: "退款条款",
        prop: "terms",
        width: "125",
        showOverflowTooltip: true,
    }));
    const __VLS_206 = __VLS_205({
        label: "退款条款",
        prop: "terms",
        width: "125",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    const __VLS_208 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
        label: "大货采购进度",
        minWidth: "160",
    }));
    const __VLS_210 = __VLS_209({
        label: "大货采购进度",
        minWidth: "160",
    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
    __VLS_211.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_211.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "progress-cell" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "progress-text" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (row.currentQty);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "target" },
        });
        (row.targetQty);
        const __VLS_212 = {}.ElProgress;
        /** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
            percentage: (Math.min(Math.round((row.currentQty / row.targetQty) * 100), 100)),
            status: (row.currentQty >= row.targetQty ? 'success' : 'exception'),
            color: (row.currentQty >= row.targetQty ? '#10b981' : '#f59e0b'),
            strokeWidth: (6),
        }));
        const __VLS_214 = __VLS_213({
            percentage: (Math.min(Math.round((row.currentQty / row.targetQty) * 100), 100)),
            status: (row.currentQty >= row.targetQty ? 'success' : 'exception'),
            color: (row.currentQty >= row.targetQty ? '#10b981' : '#f59e0b'),
            strokeWidth: (6),
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    }
    var __VLS_211;
    const __VLS_216 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
        label: "状态",
        width: "115",
        align: "center",
    }));
    const __VLS_218 = __VLS_217({
        label: "状态",
        width: "115",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_217));
    __VLS_219.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_219.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_220 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
            type: (__VLS_ctx.getRefundStatusTag(row.status)),
            size: "small",
            effect: "dark",
        }));
        const __VLS_222 = __VLS_221({
            type: (__VLS_ctx.getRefundStatusTag(row.status)),
            size: "small",
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_221));
        __VLS_223.slots.default;
        (row.status);
        var __VLS_223;
    }
    var __VLS_219;
    const __VLS_224 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
        label: "操作",
        width: "90",
        align: "center",
        fixed: "right",
    }));
    const __VLS_226 = __VLS_225({
        label: "操作",
        width: "90",
        align: "center",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_225));
    __VLS_227.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_227.slots;
        const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
        if (row.status === '已达门槛(待催退)') {
            const __VLS_228 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
                ...{ 'onClick': {} },
                type: "danger",
                size: "small",
                link: true,
                icon: "Bell",
            }));
            const __VLS_230 = __VLS_229({
                ...{ 'onClick': {} },
                type: "danger",
                size: "small",
                link: true,
                icon: "Bell",
            }, ...__VLS_functionalComponentArgsRest(__VLS_229));
            let __VLS_232;
            let __VLS_233;
            let __VLS_234;
            const __VLS_235 = {
                onClick: (...[$event]) => {
                    if (!(row.status === '已达门槛(待催退)'))
                        return;
                    __VLS_ctx.handleRemindRefund(row);
                }
            };
            __VLS_231.slots.default;
            var __VLS_231;
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "text-muted" },
            });
        }
    }
    var __VLS_227;
    var __VLS_191;
    /** @type {[typeof TaskDetailDrawer, ]} */ ;
    // @ts-ignore
    const __VLS_236 = __VLS_asFunctionalComponent(TaskDetailDrawer, new TaskDetailDrawer({
        ref: "taskDetailDrawerRef",
    }));
    const __VLS_237 = __VLS_236({
        ref: "taskDetailDrawerRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_236));
    /** @type {typeof __VLS_ctx.taskDetailDrawerRef} */ ;
    var __VLS_239 = {};
    var __VLS_238;
    /** @type {__VLS_StyleScopedClasses['kanban-page']} */ ;
    /** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
    /** @type {__VLS_StyleScopedClasses['dashboard-header-wrapper']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
    /** @type {__VLS_StyleScopedClasses['header-title-line']} */ ;
    /** @type {__VLS_StyleScopedClasses['title-left']} */ ;
    /** @type {__VLS_StyleScopedClasses['title-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['title-text']} */ ;
    /** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
    /** @type {__VLS_StyleScopedClasses['title-right']} */ ;
    /** @type {__VLS_StyleScopedClasses['refresh-time']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-cards-grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['total-tasks']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-card-inner']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
    /** @type {__VLS_StyleScopedClasses['label']} */ ;
    /** @type {__VLS_StyleScopedClasses['value']} */ ;
    /** @type {__VLS_StyleScopedClasses['unit']} */ ;
    /** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['trendup']} */ ;
    /** @type {__VLS_StyleScopedClasses['desc']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['urgent-tasks']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-card-inner']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
    /** @type {__VLS_StyleScopedClasses['label']} */ ;
    /** @type {__VLS_StyleScopedClasses['value']} */ ;
    /** @type {__VLS_StyleScopedClasses['unit']} */ ;
    /** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['trenddown']} */ ;
    /** @type {__VLS_StyleScopedClasses['desc']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['avg-cycle']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-card-inner']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
    /** @type {__VLS_StyleScopedClasses['label']} */ ;
    /** @type {__VLS_StyleScopedClasses['value']} */ ;
    /** @type {__VLS_StyleScopedClasses['unit']} */ ;
    /** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['trendup']} */ ;
    /** @type {__VLS_StyleScopedClasses['desc']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['total-cost']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-card-inner']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
    /** @type {__VLS_StyleScopedClasses['label']} */ ;
    /** @type {__VLS_StyleScopedClasses['value']} */ ;
    /** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['accent-text']} */ ;
    /** @type {__VLS_StyleScopedClasses['desc']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['refund-pending']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-card-inner']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
    /** @type {__VLS_StyleScopedClasses['label']} */ ;
    /** @type {__VLS_StyleScopedClasses['value']} */ ;
    /** @type {__VLS_StyleScopedClasses['icon-box']} */ ;
    /** @type {__VLS_StyleScopedClasses['stat-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['highlight-text']} */ ;
    /** @type {__VLS_StyleScopedClasses['desc']} */ ;
    /** @type {__VLS_StyleScopedClasses['filter-panel']} */ ;
    /** @type {__VLS_StyleScopedClasses['modern-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
    /** @type {__VLS_StyleScopedClasses['filter-row']} */ ;
    /** @type {__VLS_StyleScopedClasses['filter-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['filter-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['filter-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['filter-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['filter-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['filter-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['filter-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['filter-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['filter-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-grow']} */ ;
    /** @type {__VLS_StyleScopedClasses['filter-actions']} */ ;
    /** @type {__VLS_StyleScopedClasses['kanban-container']} */ ;
    /** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-20']} */ ;
    /** @type {__VLS_StyleScopedClasses['kanban-column']} */ ;
    /** @type {__VLS_StyleScopedClasses['column-header']} */ ;
    /** @type {__VLS_StyleScopedClasses['header-left']} */ ;
    /** @type {__VLS_StyleScopedClasses['dot']} */ ;
    /** @type {__VLS_StyleScopedClasses['title']} */ ;
    /** @type {__VLS_StyleScopedClasses['count-badge']} */ ;
    /** @type {__VLS_StyleScopedClasses['column-body']} */ ;
    /** @type {__VLS_StyleScopedClasses['custom-scrollbar']} */ ;
    /** @type {__VLS_StyleScopedClasses['task-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['card-tag-wrapper']} */ ;
    /** @type {__VLS_StyleScopedClasses['level-tag']} */ ;
    /** @type {__VLS_StyleScopedClasses['method-tag']} */ ;
    /** @type {__VLS_StyleScopedClasses['task-top']} */ ;
    /** @type {__VLS_StyleScopedClasses['no']} */ ;
    /** @type {__VLS_StyleScopedClasses['level-indicator']} */ ;
    /** @type {__VLS_StyleScopedClasses['task-info']} */ ;
    /** @type {__VLS_StyleScopedClasses['task-img']} */ ;
    /** @type {__VLS_StyleScopedClasses['task-details']} */ ;
    /** @type {__VLS_StyleScopedClasses['name']} */ ;
    /** @type {__VLS_StyleScopedClasses['meta']} */ ;
    /** @type {__VLS_StyleScopedClasses['task-cost-line']} */ ;
    /** @type {__VLS_StyleScopedClasses['cost-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['cost-val']} */ ;
    /** @type {__VLS_StyleScopedClasses['task-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['time']} */ ;
    /** @type {__VLS_StyleScopedClasses['assignees-box']} */ ;
    /** @type {__VLS_StyleScopedClasses['avatar-circle']} */ ;
    /** @type {__VLS_StyleScopedClasses['no-assignee']} */ ;
    /** @type {__VLS_StyleScopedClasses['empty-column-placeholder']} */ ;
    /** @type {__VLS_StyleScopedClasses['empty-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['bottom-analytics-grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['analytics-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['modern-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['card-header-v4']} */ ;
    /** @type {__VLS_StyleScopedClasses['title']} */ ;
    /** @type {__VLS_StyleScopedClasses['title-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['header-desc']} */ ;
    /** @type {__VLS_StyleScopedClasses['funnel-container']} */ ;
    /** @type {__VLS_StyleScopedClasses['funnel-row']} */ ;
    /** @type {__VLS_StyleScopedClasses['step-meta']} */ ;
    /** @type {__VLS_StyleScopedClasses['step-num']} */ ;
    /** @type {__VLS_StyleScopedClasses['step-name']} */ ;
    /** @type {__VLS_StyleScopedClasses['step-progress-wrapper']} */ ;
    /** @type {__VLS_StyleScopedClasses['step-bar-bg']} */ ;
    /** @type {__VLS_StyleScopedClasses['step-bar-fill']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-text']} */ ;
    /** @type {__VLS_StyleScopedClasses['step-status']} */ ;
    /** @type {__VLS_StyleScopedClasses['bottleneck-tag']} */ ;
    /** @type {__VLS_StyleScopedClasses['normal-status']} */ ;
    /** @type {__VLS_StyleScopedClasses['efficiency-insights']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-20']} */ ;
    /** @type {__VLS_StyleScopedClasses['insight-title']} */ ;
    /** @type {__VLS_StyleScopedClasses['insight-text']} */ ;
    /** @type {__VLS_StyleScopedClasses['analytics-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['modern-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['card-header-v4']} */ ;
    /** @type {__VLS_StyleScopedClasses['title']} */ ;
    /** @type {__VLS_StyleScopedClasses['title-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['header-desc']} */ ;
    /** @type {__VLS_StyleScopedClasses['refund-table-wrapper']} */ ;
    /** @type {__VLS_StyleScopedClasses['refund-table']} */ ;
    /** @type {__VLS_StyleScopedClasses['refund-product-cell']} */ ;
    /** @type {__VLS_StyleScopedClasses['no']} */ ;
    /** @type {__VLS_StyleScopedClasses['name']} */ ;
    /** @type {__VLS_StyleScopedClasses['cost-cell']} */ ;
    /** @type {__VLS_StyleScopedClasses['amt']} */ ;
    /** @type {__VLS_StyleScopedClasses['type']} */ ;
    /** @type {__VLS_StyleScopedClasses['progress-cell']} */ ;
    /** @type {__VLS_StyleScopedClasses['progress-text']} */ ;
    /** @type {__VLS_StyleScopedClasses['target']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-muted']} */ ;
    // @ts-ignore
    var __VLS_240 = __VLS_239;
    var __VLS_dollars;
    const __VLS_self = (await import('vue')).defineComponent({
        setup() {
            return {
                Management: Management,
                Warning: Warning,
                Timer: Timer,
                Money: Money,
                CreditCard: CreditCard,
                FolderOpened: FolderOpened,
                DataAnalysis: DataAnalysis,
                TaskDetailDrawer: TaskDetailDrawer,
                searchQuery: searchQuery,
                selectedPm: selectedPm,
                selectedAssignee: selectedAssignee,
                selectedMethod: selectedMethod,
                selectedUrgency: selectedUrgency,
                taskDetailDrawerRef: taskDetailDrawerRef,
                pmOptions: pmOptions,
                assigneeOptions: assigneeOptions,
                kanbanColumns: kanbanColumns,
                bottleneckSteps: bottleneckSteps,
                refundTrackerData: refundTrackerData,
                handleFilter: handleFilter,
                handleResetFilters: handleResetFilters,
                getRefundStatusTag: getRefundStatusTag,
                handleRemindRefund: handleRemindRefund,
                handleCardClick: handleCardClick,
            };
        },
        name: 'SampleTaskKanban'
    });
    return (await import('vue')).defineComponent({
        setup() {
            return {};
        },
        name: 'SampleTaskKanban'
    });
})(); /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=sample-task-kanban.vue.js.map