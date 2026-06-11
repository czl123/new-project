<template>
  <div class="dept-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-info">
        <h2>部门管理</h2>
        <p>管理企业组织架构，维护部门层级关系与人员归属，为系统权限、审批流等模块提供数据支撑。</p>
      </div>
      <div class="header-actions">
        <el-input
          v-model="deptSearchKeyword"
          placeholder="搜索部门名称..."
          prefix-icon="Search"
          clearable
          style="width: 220px"
        />
        <el-button type="primary" icon="Plus" @click="handleAddRootDept">新增根部门</el-button>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="page-body">
      <!-- 左：部门树 -->
      <div class="dept-tree-panel">
        <div class="tree-panel-header">
          <span class="panel-title">
            <el-icon><OfficeBuilding /></el-icon>
            组织架构树
          </span>
          <el-tag size="small" type="info" round>共 {{ totalDeptCount }} 个部门</el-tag>
        </div>
        <div class="tree-scroll-wrap">
          <el-tree
            ref="deptTreeRef"
            :data="deptTree"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            :default-expanded-keys="expandedDeptKeys"
            :filter-node-method="filterDeptNode"
            highlight-current
            class="dept-tree"
            @node-click="handleDeptNodeClick"
          >
            <template #default="{ node, data }">
              <div class="tree-node-row" :class="{ selected: selectedDeptId === data.id }">
                <div class="node-left">
                  <el-icon class="node-icon" :class="data.children && data.children.length ? 'has-children' : 'leaf'">
                    <component :is="data.children && data.children.length ? 'FolderOpened' : 'OfficeBuilding'" />
                  </el-icon>
                  <span class="node-name">{{ data.name }}</span>
                  <el-tag
                    v-if="data.memberCount || (data.members && data.members.length)"
                    size="small"
                    type="info"
                    class="member-count-tag"
                  >{{ data.memberCount || data.members.length }}人</el-tag>
                </div>
                <div class="node-actions" @click.stop>
                  <el-tooltip content="新增子部门" placement="top">
                    <el-icon class="action-icon" @click="handleAddChildDept(data)"><Plus /></el-icon>
                  </el-tooltip>
                  <el-tooltip content="编辑" placement="top">
                    <el-icon class="action-icon" @click="handleEditDept(data)"><Edit /></el-icon>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top">
                    <el-icon class="action-icon danger" @click="handleDeleteDept(data, node)"><Delete /></el-icon>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 右：部门详情 -->
      <div class="dept-detail-panel">
        <template v-if="selectedDept">
          <!-- 部门信息卡片 -->
          <div class="dept-info-card">
            <div class="dept-avatar">
              <el-icon><OfficeBuilding /></el-icon>
            </div>
            <div class="dept-meta">
              <div class="dept-name-row">
                <h3>{{ selectedDept.name }}</h3>
                <el-tag
                  v-if="selectedDept.type"
                  size="small"
                  :type="getDeptTypeColor(selectedDept.type)"
                  effect="light"
                >{{ selectedDept.type }}</el-tag>
              </div>
              <div class="dept-attrs">
                <span class="attr-item">
                  <el-icon><UserFilled /></el-icon>
                  负责人：{{ selectedDept.leader || '未设置' }}
                </span>
                <span class="attr-item">
                  <el-icon><Cellphone /></el-icon>
                  联系方式：{{ selectedDept.phone || '未设置' }}
                </span>
                <span class="attr-item">
                  <el-icon><Location /></el-icon>
                  办公地点：{{ selectedDept.location || '未设置' }}
                </span>
              </div>
              <p class="dept-desc">{{ selectedDept.desc || '暂无部门描述' }}</p>
            </div>
            <div class="dept-card-actions">
              <el-button size="small" icon="Edit" @click="handleEditDept(selectedDept)">编辑信息</el-button>
              <el-button size="small" type="primary" icon="Plus" @click="handleAddMember">添加成员</el-button>
            </div>
          </div>

          <!-- 面包屑路径 -->
          <div class="dept-breadcrumb" v-if="deptBreadcrumb.length > 1">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item
                v-for="bc in deptBreadcrumb"
                :key="bc.id"
                @click="handleDeptNodeClick(bc)"
                style="cursor: pointer"
              >{{ bc.name }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>

          <!-- 成员列表 -->
          <div class="member-section">
            <div class="section-header">
              <span class="section-title">成员列表</span>
              <span class="section-badge">{{ selectedDept.memberCount || (selectedDept.members ? selectedDept.members.length : 0) }}</span>
              <div class="section-actions">
                <el-input
                  v-model="memberSearchKeyword"
                  placeholder="搜索成员..."
                  prefix-icon="Search"
                  clearable
                  size="small"
                  style="width: 180px"
                />
              </div>
            </div>
            <el-table
              :data="filteredMembers"
              class="member-table"
              border
              stripe
            >
              <el-table-column label="姓名" prop="name" width="130">
                <template #default="{ row }">
                  <div class="member-name-cell">
                    <div class="member-avatar" :style="{ background: getAvatarColor(row.name) }">
                      {{ row.name.charAt(0) }}
                    </div>
                    <span class="member-name-text">{{ row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="工号" prop="empNo" width="100" />
              <el-table-column label="职位" prop="position" />
              <el-table-column label="角色" prop="role" width="120">
                <template #default="{ row }">
                  <el-tag :type="getRoleTagType(row.role)" size="small" effect="plain">{{ row.role }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="在职状态" prop="status" width="110" align="center">
                <template #default="{ row }">
                  <div class="status-dot-row">
                    <span class="status-dot" :class="row.status === '在职' ? 'active' : 'inactive'"></span>
                    <span>{{ row.status }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="入职日期" prop="joinDate" width="120" />
              <el-table-column label="操作" width="130" align="center" fixed="right">
                <template #default="{ row, $index }">
                  <el-button link type="primary" size="small" @click="handleEditMember(row, $index)">编辑</el-button>
                  <el-button link type="danger" size="small" @click="handleDeleteMember($index)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>

        <!-- 未选择状态 -->
        <div v-else class="empty-placeholder">
          <el-icon class="empty-icon"><OfficeBuilding /></el-icon>
          <h4>选择一个部门</h4>
          <p>从左侧部门树中点击一个部门，查看其详情与成员信息</p>
          <el-button type="primary" icon="Plus" @click="handleAddRootDept">新增根部门</el-button>
        </div>
      </div>
    </div>

    <!-- 新增/编辑部门弹窗 -->
    <el-dialog
      v-model="deptDialogVisible"
      :title="deptDialogMode === 'add-root' ? '新增根部门' : deptDialogMode === 'add-child' ? `新增子部门（${deptDialogParentName}）` : '编辑部门'"
      width="560px"
      append-to-body
    >
      <el-form
        :model="deptForm"
        :rules="deptFormRules"
        ref="deptFormRef"
        label-width="90px"
        style="padding: 8px 20px 0"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="deptForm.name" placeholder="请输入部门名称" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="部门类型" prop="type">
          <el-select v-model="deptForm.type" placeholder="请选择部门类型" style="width: 100%">
            <el-option label="事业部" value="事业部" />
            <el-option label="职能部门" value="职能部门" />
            <el-option label="业务团队" value="业务团队" />
            <el-option label="项目组" value="项目组" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门负责人">
          <el-input v-model="deptForm.leader" placeholder="请输入负责人姓名" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="deptForm.phone" placeholder="请输入联系电话或邮箱" />
        </el-form-item>
        <el-form-item label="办公地点">
          <el-input v-model="deptForm.location" placeholder="请输入办公地点" />
        </el-form-item>
        <el-form-item label="部门描述">
          <el-input
            v-model="deptForm.desc"
            type="textarea"
            :rows="3"
            placeholder="请输入部门职能描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="deptForm.sort" :min="0" :max="999" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="deptDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDept">确认保存</el-button>
      </template>
    </el-dialog>

    <!-- 新增/编辑成员弹窗 -->
    <el-dialog
      v-model="memberDialogVisible"
      :title="memberDialogMode === 'add' ? '添加成员' : '编辑成员'"
      width="480px"
      append-to-body
    >
      <el-form
        :model="memberForm"
        :rules="memberFormRules"
        ref="memberFormRef"
        label-width="80px"
        style="padding: 8px 16px 0"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="memberForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="memberForm.empNo" placeholder="请输入工号" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="memberForm.position" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="memberForm.role" placeholder="选择角色" style="width: 100%">
            <el-option label="部门主管" value="部门主管" />
            <el-option label="组长" value="组长" />
            <el-option label="普通员工" value="普通员工" />
            <el-option label="实习生" value="实习生" />
          </el-select>
        </el-form-item>
        <el-form-item label="在职状态">
          <el-radio-group v-model="memberForm.status">
            <el-radio value="在职">在职</el-radio>
            <el-radio value="离职">离职</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker
            v-model="memberForm.joinDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="memberDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMember">确认保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  Plus, Edit, Delete, Search, OfficeBuilding, UserFilled,
  FolderOpened, Cellphone, Location, ArrowRight
} from '@element-plus/icons-vue'
import { deptTree } from '@/store/orgData'

// ==================== 类型定义 ====================
interface Member {
  name: string
  empNo: string
  position: string
  role: string
  status: string
  joinDate: string
}

interface Department {
  id: number
  name: string
  type: string
  leader: string
  phone: string
  location: string
  desc: string
  sort: number
  members: Member[]
  memberCount?: number
  children?: Department[]
}

// ==================== 状态 ====================
const deptSearchKeyword = ref('')
const memberSearchKeyword = ref('')
const selectedDeptId = ref<number | null>(null)
const selectedDept = ref<Department | null>(null)
const deptTreeRef = ref<any>(null)
const deptFormRef = ref<FormInstance>()
const memberFormRef = ref<FormInstance>()

let deptIdCounter = 2000

// ==================== 计算属性 ====================
const flattenDepts = (list: Department[]): Department[] => {
  const result: Department[] = []
  const walk = (nodes: Department[]) => {
    for (const node of nodes) {
      result.push(node)
      if (node.children && node.children.length) walk(node.children)
    }
  }
  walk(list)
  return result
}

const totalDeptCount = computed(() => flattenDepts(deptTree.value).length)

const expandedDeptKeys = ref([1, 2, 3, 4, 5])

const filteredMembers = computed(() => {
  if (!selectedDept.value?.members) return []
  const kw = memberSearchKeyword.value.trim()
  if (!kw) return selectedDept.value.members
  return selectedDept.value.members.filter(m =>
    m.name.includes(kw) || m.position.includes(kw) || m.empNo.includes(kw)
  )
})

// 面包屑路径
const deptBreadcrumb = computed(() => {
  if (!selectedDept.value) return []
  const path: Department[] = []
  const find = (nodes: Department[], target: number): boolean => {
    for (const node of nodes) {
      if (node.id === target) { path.push(node); return true }
      if (node.children && find(node.children, target)) { path.unshift(node); return true }
    }
    return false
  }
  find(deptTree.value, selectedDept.value.id)
  return path
})

// ==================== 树操作 ====================
const filterDeptNode = (value: string, data: any) => {
  if (!value) return true
  return data.name.includes(value)
}

watch(deptSearchKeyword, (val) => {
  deptTreeRef.value?.filter(val)
})

const handleDeptNodeClick = (data: Department) => {
  selectedDeptId.value = data.id
  selectedDept.value = data
  memberSearchKeyword.value = ''
  // 同步高亮树节点
  deptTreeRef.value?.setCurrentKey(data.id)
}

const findNodeById = (tree: Department[], id: number): Department | null => {
  for (const node of tree) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

// ==================== 部门弹窗 ====================
const deptDialogVisible = ref(false)
const deptDialogMode = ref<'add-root' | 'add-child' | 'edit'>('add-root')
const deptDialogParentName = ref('')
const deptDialogTargetId = ref<number | null>(null)

const deptForm = ref({ name: '', type: '', leader: '', phone: '', location: '', desc: '', sort: 0 })

const deptFormRules = {
  name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '请选择部门类型', trigger: 'change' }]
}

const handleAddRootDept = () => {
  deptDialogMode.value = 'add-root'
  deptDialogTargetId.value = null
  deptForm.value = { name: '', type: '', leader: '', phone: '', location: '', desc: '', sort: 0 }
  deptDialogVisible.value = true
}

const handleAddChildDept = (data: Department) => {
  deptDialogMode.value = 'add-child'
  deptDialogTargetId.value = data.id
  deptDialogParentName.value = data.name
  deptForm.value = { name: '', type: '', leader: '', phone: '', location: '', desc: '', sort: 0 }
  deptDialogVisible.value = true
}

const handleEditDept = (data: Department) => {
  deptDialogMode.value = 'edit'
  deptDialogTargetId.value = data.id
  deptForm.value = {
    name: data.name, type: data.type, leader: data.leader,
    phone: data.phone, location: data.location, desc: data.desc, sort: data.sort
  }
  deptDialogVisible.value = true
}

const saveDept = async () => {
  await deptFormRef.value?.validate()
  if (deptDialogMode.value === 'add-root') {
    const newNode: Department = { id: ++deptIdCounter, ...deptForm.value, members: [], children: [] }
    deptTree.value.push(newNode)
    ElMessage.success('根部门新增成功')
  } else if (deptDialogMode.value === 'add-child' && deptDialogTargetId.value !== null) {
    const parent = findNodeById(deptTree.value, deptDialogTargetId.value)
    if (parent) {
      if (!parent.children) parent.children = []
      const newNode: Department = { id: ++deptIdCounter, ...deptForm.value, members: [], children: [] }
      parent.children.push(newNode)
      if (!expandedDeptKeys.value.includes(parent.id)) expandedDeptKeys.value.push(parent.id)
      ElMessage.success('子部门新增成功')
    }
  } else if (deptDialogMode.value === 'edit' && deptDialogTargetId.value !== null) {
    const node = findNodeById(deptTree.value, deptDialogTargetId.value)
    if (node) {
      Object.assign(node, deptForm.value)
      if (selectedDept.value?.id === deptDialogTargetId.value) selectedDept.value = node
      ElMessage.success('部门信息已更新')
    }
  }
  deptDialogVisible.value = false
}

const handleDeleteDept = (data: Department, node: any) => {
  const hasChildren = data.children && data.children.length > 0
  const msg = hasChildren
    ? `部门「${data.name}」下存在 ${data.children!.length} 个子部门，删除后将一并移除，确认操作？`
    : `确定删除部门「${data.name}」？该部门所有成员信息将一并清除。`
  ElMessageBox.confirm(msg, '删除部门', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger'
  }).then(() => {
    const parentNode = node.parent
    const siblings: Department[] = parentNode.data.children || parentNode.data
    const idx = siblings.findIndex((d: Department) => d.id === data.id)
    if (idx > -1) siblings.splice(idx, 1)
    if (selectedDeptId.value === data.id) { selectedDeptId.value = null; selectedDept.value = null }
    ElMessage.success('部门已删除')
  }).catch(() => {})
}

// ==================== 成员弹窗 ====================
const memberDialogVisible = ref(false)
const memberDialogMode = ref<'add' | 'edit'>('add')
const memberEditIndex = ref(-1)

const memberForm = ref<Member>({ name: '', empNo: '', position: '', role: '普通员工', status: '在职', joinDate: '' })

const memberFormRules = {
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  position: [{ required: true, message: '职位不能为空', trigger: 'blur' }]
}

const handleAddMember = () => {
  memberDialogMode.value = 'add'
  memberEditIndex.value = -1
  memberForm.value = { name: '', empNo: '', position: '', role: '普通员工', status: '在职', joinDate: '' }
  memberDialogVisible.value = true
}

const handleEditMember = (row: Member, index: number) => {
  memberDialogMode.value = 'edit'
  memberEditIndex.value = index
  memberForm.value = { ...row }
  memberDialogVisible.value = true
}

const handleDeleteMember = (index: number) => {
  ElMessageBox.confirm('确定将该成员从当前部门移除？', '移除成员', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (selectedDept.value?.members) {
      selectedDept.value.members.splice(index, 1)
      ElMessage.success('成员已移除')
    }
  }).catch(() => {})
}

const saveMember = async () => {
  await memberFormRef.value?.validate()
  if (!selectedDept.value) return
  if (!selectedDept.value.members) selectedDept.value.members = []
  if (memberDialogMode.value === 'add') {
    selectedDept.value.members.push({ ...memberForm.value })
    ElMessage.success('成员添加成功')
  } else {
    selectedDept.value.members[memberEditIndex.value] = { ...memberForm.value }
    ElMessage.success('成员信息已更新')
  }
  memberDialogVisible.value = false
}

// ==================== 工具函数 ====================
const getDeptTypeColor = (type: string) => {
  const map: Record<string, string> = { '事业部': 'danger', '职能部门': 'primary', '业务团队': 'success', '项目组': 'warning' }
  return map[type] || 'info'
}

const avatarColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9', '#ef4444', '#6366f1']
const getAvatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length]

const getRoleTagType = (role: string) => {
  const map: Record<string, string> = { '部门主管': 'danger', '组长': 'warning', '普通员工': '', '实习生': 'info' }
  return map[role] || ''
}
</script>

<style scoped lang="scss">
$color-bg: #f3f4f6;
$color-surface: #ffffff;
$color-border: #e2e8f0;
$color-text-primary: #111827;
$color-text-secondary: #6b7280;
$color-brand: #2563eb;

.dept-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $color-bg;
  font-family: -apple-system, 'PingFang SC', sans-serif;
  overflow: hidden;
}

// ==================== 页头 ====================
.page-header {
  background: $color-surface;
  border-bottom: 1px solid $color-border;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  .header-info {
    h2 {
      margin: 0 0 6px 0;
      font-size: 22px;
      font-weight: 700;
      color: $color-text-primary;
    }
    p {
      margin: 0;
      font-size: 13px;
      color: $color-text-secondary;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

// ==================== 主体 ====================
.page-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

// ==================== 左侧树面板 ====================
.dept-tree-panel {
  width: 300px;
  flex-shrink: 0;
  background: $color-surface;
  border-right: 1px solid $color-border;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .tree-panel-header {
    padding: 14px 16px;
    border-bottom: 1px solid $color-border;
    background: #fafafa;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;

    .panel-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 700;
      color: #374151;

      .el-icon {
        color: $color-brand;
        font-size: 15px;
      }
    }
  }

  .tree-scroll-wrap {
    flex: 1;
    overflow-y: auto;
    padding: 8px;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
  }

  .dept-tree {
    :deep(.el-tree-node__content) {
      height: auto;
      padding: 0;
      border-radius: 8px;
      transition: background 0.15s;
      &:hover { background: #f0f7ff; }
    }
    :deep(.el-tree-node.is-current > .el-tree-node__content) {
      background: #eff6ff;
    }
  }

  .tree-node-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 6px;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;

    .node-left {
      display: flex;
      align-items: center;
      gap: 7px;
      flex: 1;
      min-width: 0;

      .node-icon {
        font-size: 15px;
        flex-shrink: 0;
        &.has-children { color: #f59e0b; }
        &.leaf { color: #6b7280; }
      }

      .node-name {
        font-size: 13px;
        font-weight: 500;
        color: $color-text-primary;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .member-count-tag {
        flex-shrink: 0;
        font-size: 10px;
      }
    }

    .node-actions {
      display: none;
      align-items: center;
      gap: 2px;
      flex-shrink: 0;

      .action-icon {
        font-size: 14px;
        color: #9ca3af;
        padding: 4px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.15s;
        &:hover { color: $color-brand; background: rgba(37, 99, 235, 0.08); }
        &.danger:hover { color: #ef4444; background: rgba(239, 68, 68, 0.08); }
      }
    }

    &:hover .node-actions,
    &.selected .node-actions {
      display: flex;
    }
  }
}

// ==================== 右侧详情面板 ====================
.dept-detail-panel {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: $color-bg;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 6px; }
}

// ==================== 部门信息卡片 ====================
.dept-info-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px;
  background: $color-surface;
  border-radius: 16px;
  border: 1px solid $color-border;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  .dept-avatar {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    flex-shrink: 0;
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
  }

  .dept-meta {
    flex: 1;
    min-width: 0;

    .dept-name-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      h3 { margin: 0; font-size: 20px; font-weight: 700; color: $color-text-primary; }
    }

    .dept-attrs {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 10px;

      .attr-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 13px;
        color: #475569;
        .el-icon { color: $color-brand; font-size: 14px; }
      }
    }

    .dept-desc {
      margin: 0;
      font-size: 13px;
      color: $color-text-secondary;
      line-height: 1.6;
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 3px solid #dbeafe;
    }
  }

  .dept-card-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
  }
}

// ==================== 面包屑 ====================
.dept-breadcrumb {
  padding: 0 4px;
  :deep(.el-breadcrumb__item .el-breadcrumb__inner) {
    color: $color-brand;
    cursor: pointer;
    &:hover { text-decoration: underline; }
  }
}

// ==================== 成员列表 ====================
.member-section {
  background: $color-surface;
  border-radius: 12px;
  border: 1px solid $color-border;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  .section-title {
    font-size: 14px;
    font-weight: 700;
    color: $color-text-primary;
  }

  .section-badge {
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    background: $color-brand;
    padding: 1px 8px;
    border-radius: 10px;
    min-width: 22px;
    text-align: center;
  }

  .section-actions {
    margin-left: auto;
  }
}

.member-table {
  :deep(.el-table__header) th {
    background: #f9fafb !important;
    font-size: 12px;
    color: #4b5563;
    font-weight: 600;
  }

  :deep(.el-table__row:hover > td) {
    background: #f0f7ff !important;
  }

  .member-name-cell {
    display: flex;
    align-items: center;
    gap: 10px;

    .member-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    .member-name-text {
      font-weight: 500;
      color: $color-text-primary;
    }
  }

  .status-dot-row {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      &.active {
        background: #10b981;
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        animation: pulse-green 2s infinite;
      }
      &.inactive { background: #9ca3af; }
    }
  }
}

@keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2); }
  50% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
}

// ==================== 空状态 ====================
.empty-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #94a3b8;
  padding: 80px 0;

  .empty-icon {
    font-size: 80px;
    color: #dbeafe;
    filter: drop-shadow(0 4px 12px rgba(37, 99, 235, 0.15));
  }

  h4 {
    margin: 0;
    font-size: 18px;
    color: #374151;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: $color-text-secondary;
  }
}
</style>
