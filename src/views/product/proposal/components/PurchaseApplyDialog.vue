<template>
  <el-dialog
    v-model="visible"
    :title="isEditMode ? '编辑购样申请' : '购样申请'"
    width="1100px"
    class="purchase-apply-dialog"
    destroy-on-close
  >
    <!-- 顶部说明区域 -->
    <div class="feedback-instruction" v-if="!isEditMode">
      <el-icon class="mr-8"><InfoFilled /></el-icon>
      <span>支持发起多个样品的购样申请，提交后将进入对应的审批流程。</span>
    </div>

    <div class="feedback-content">
      <!-- 编辑模式：单纯表单，不使用任何 Tab 布局 -->
      <template v-if="isEditMode">
        <el-form :model="form" ref="formRef" label-position="left" label-width="100px" class="feedback-form custom-form">
          <!-- 模块 1：拿样渠道信息 -->
          <div class="form-section">
            <div class="section-title">
              <span class="title-bar blue"></span>
              <span>拿样渠道信息</span>
            </div>
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item 
                  label="拿样渠道" 
                  required
                  prop="items.0.channel"
                  :rules="{ required: true, message: '请选择渠道', trigger: 'change' }"
                >
                  <el-select v-model="form.items[0].channel" placeholder="请选择" class="w-full">
                    <el-option label="供应商" value="供应商" />
                    <el-option label="1688" value="1688" />
                    <el-option label="淘宝" value="淘宝" />
                  </el-select>
                </el-form-item>
              </el-col>
              <template v-if="form.items[0].channel === '供应商'">
                <el-col :span="6">
                  <el-form-item 
                    label="供应商类型" 
                    required
                    prop="items.0.supplierType"
                    :rules="{ required: true, message: '请选择类型', trigger: 'change' }"
                  >
                    <el-select v-model="form.items[0].supplierType" placeholder="请选择" class="w-full">
                      <el-option label="正式供应商" value="正式" />
                      <el-option label="临时供应商" value="临时" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item 
                    label="供应商" 
                    required
                    prop="items.0.supplier"
                    :rules="{ required: true, message: '请输入供应商', trigger: 'blur' }"
                  >
                    <el-select 
                      v-if="form.items[0].supplierType === '正式'" 
                      v-model="form.items[0].supplier" 
                      placeholder="选择供应商" 
                      class="w-full"
                      @change="(val: any) => handleSupplierChange(val, form.items[0])"
                    >
                      <el-option v-for="s in formalSuppliers" :key="s.value" :label="s.label" :value="s.label" />
                    </el-select>
                    <el-input v-else v-model="form.items[0].supplier" placeholder="输入名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item 
                    label="货源地" 
                    required
                    prop="items.0.source"
                    :rules="{ required: true, message: '请选择或输入货源地', trigger: 'blur' }"
                  >
                    <el-select 
                      v-model="form.items[0].source" 
                      placeholder="请选择" 
                      class="w-full"
                      :disabled="form.items[0].supplierType === '正式'"
                    >
                      <el-option label="广东深圳" value="广东深圳" />
                      <el-option label="浙江义乌" value="浙江义乌" />
                      <el-option label="江苏苏州" value="江苏苏州" />
                      <el-option label="福建泉州" value="福建泉州" />
                      <el-option label="山东临沂" value="山东临沂" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="14">
                  <el-form-item 
                    label="购买链接" 
                    required
                    prop="items.0.purchaseUrl"
                    :rules="{ required: true, message: '请输入购买链接', trigger: 'blur' }"
                  >
                    <el-input v-model="form.items[0].purchaseUrl" placeholder="粘贴 1688 或 淘宝 购买链接" />
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </div>

          <!-- 模块 2：费用与退款条款 -->
          <div class="form-section">
            <div class="section-title" style="display: flex; align-items: center; gap: 8px;">
              <span class="title-bar orange"></span>
              <span>费用与退款条款</span>
              <el-tag type="warning" size="small" effect="light" style="font-weight: 600; margin-left: 4px;">费用类型: {{ form.items[0].feeType }}</el-tag>
            </div>
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item 
                  label="样品名称" 
                  prop="items.0.sampleName"
                >
                  <el-input v-model="form.items[0].sampleName" placeholder="输入样品名称" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item 
                  label="购样数量" 
                  required
                  prop="items.0.quantity"
                  :rules="{ required: true, message: '请输入数量', trigger: 'blur' }"
                >
                  <el-input-number v-model="form.items[0].quantity" :min="1" :controls="false" class="w-full" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item 
                  label="费用(单价)" 
                  required
                  prop="items.0.price"
                  :rules="{ required: true, message: '请输入费用', trigger: 'blur' }"
                >
                  <el-input-number v-model="form.items[0].price" :min="0" :precision="2" :controls="false" class="w-full">
                    <template #append>CNY</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="费用合计">
                  <span class="total-price-text">¥ {{ (form.items[0].quantity * form.items[0].price).toFixed(2) }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24" v-if="form.items[0].channel === '供应商'">
              <el-col :span="6">
                <el-form-item label="是否可退款">
                  <el-switch
                    v-model="form.items[0].isRefundable"
                    inline-prompt
                    active-text="是"
                    inactive-text="否"
                  />
                </el-form-item>
              </el-col>
              <template v-if="form.items[0].isRefundable">
                <el-col :span="6">
                  <el-form-item label="退款方式" required>
                    <el-select v-model="form.items[0].refundMethod" placeholder="请选择" class="w-full">
                      <el-option label="首单退款" value="first_order" />
                      <el-option label="订单量退款" value="order_volume" />
                      <el-option label="订单金额退款" value="order_amount" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item 
                    label="退款条件" 
                    required
                    :rules="[
                      { required: ['order_volume', 'order_amount'].includes(form.items[0].refundMethod), message: '请输入退款条件', trigger: 'blur' }
                    ]"
                  >
                    <el-input v-model="form.items[0].refundCondition" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <div class="refund-tip-wrapper" v-if="form.items[0].refundMethod">
                    <div class="refund-tip">
                      <el-icon class="mr-4"><InfoFilled /></el-icon>
                      <span>{{ refundDescriptions[form.items[0].refundMethod] }}</span>
                    </div>
                  </div>
                </el-col>
              </template>
            </el-row>
          </div>

          <!-- 模块 3：收款账户信息 -->
          <div class="form-section" v-if="form.items[0].channel === '供应商'">
            <div class="section-title">
              <span class="title-bar purple"></span>
              <span>收款账户信息</span>
            </div>
            <el-row :gutter="24">
              <el-col :span="6">
                <el-form-item label="收款方式" required>
                  <el-select v-model="form.items[0].paymentMethod" placeholder="请选择" class="w-full">
                    <el-option label="银行转账" value="银行转账" />
                    <el-option label="支付宝" value="支付宝" />
                    <el-option label="微信" value="微信" />
                  </el-select>
                </el-form-item>
              </el-col>
              <template v-if="form.items[0].paymentMethod === '银行转账'">
                <el-col :span="6">
                  <el-form-item label="开户行" required>
                    <el-input v-model="form.items[0].bankName" placeholder="输入支行" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="账号户名" required>
                    <el-input v-model="form.items[0].accountName" placeholder="输入户名" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="银行账号" required>
                    <el-input v-model="form.items[0].bankAccount" placeholder="输入账号" />
                  </el-form-item>
                </el-col>
              </template>
              <template v-if="['支付宝', '微信'].includes(form.items[0].paymentMethod)">
                <el-col :span="8">
                  <el-form-item 
                    label="收款二维码"
                    :required="form.items[0].paymentMethod === '支付宝'"
                    prop="items.0.paymentQrCodes"
                    :rules="[
                      { 
                        validator: (rule: any, value: any, callback: any) => {
                          if (form.items[0].paymentMethod === '支付宝' && (!value || value.length === 0)) {
                            callback(new Error('请上传收款二维码'))
                          } else {
                            callback()
                          }
                        }, 
                        trigger: 'change' 
                      }
                    ]"
                  >
                    <el-upload
                      action="#"
                      :auto-upload="false"
                      :show-file-list="false"
                      :on-change="(file: any) => handleImageSuccess(file, form.items[0], 'paymentQrCodes')"
                      class="p-upload-inline"
                    >
                      <div class="p-upload-grid">
                        <div v-for="(img, i) in form.items[0].paymentQrCodes" :key="i" class="p-upload-item">
                          <img :src="img" />
                          <div class="p-upload-mask" @click.stop="removeImage(form.items[0], 'paymentQrCodes', i)">
                            <el-icon><Delete /></el-icon>
                          </div>
                        </div>
                        <div class="p-upload-add" v-if="form.items[0].paymentQrCodes.length === 0">
                          <el-icon><Picture /></el-icon>
                          <span>上传收款码</span>
                        </div>
                      </div>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </div>

          <!-- 模块 3.5：合同信息 -->
          <div class="form-section" v-if="form.items[0].feeType === '开模费'">
            <div class="section-title">
              <span class="title-bar cyan"></span>
              <span>合同信息</span>
            </div>
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="合同文件" required prop="items.0.contractFiles" :rules="{ required: true, type: 'array', message: '请上传合同文件', trigger: 'change' }">
                  <el-upload
                    action="#"
                    :auto-upload="false"
                    v-model:file-list="form.items[0].contractFiles"
                  >
                    <el-button type="primary" size="small" plain :icon="Upload">上传合同</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同金额" required prop="items.0.contractAmount" :rules="{ required: true, message: '请输入合同金额', trigger: 'blur' }">
                  <el-input-number v-model="form.items[0].contractAmount" :min="0" :precision="2" :controls="false" placeholder="请输入合同金额" class="w-full">
                    <template #append>CNY</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同备注" prop="items.0.contractRemark">
                  <el-input v-model="form.items[0].contractRemark" placeholder="请输入合同备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 模块 4：单据相关附件 -->
          <div class="form-section" v-if="form.items[0].channel !== '供应商'">
            <div class="section-title">
              <span class="title-bar green"></span>
              <span>单据相关附件</span>
            </div>
            <div class="attachments-upload-grid">
              <el-form-item label="样品图片" prop="items.0.sampleImages">
                <el-upload
                  action="#"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="(file: any) => handleImageSuccess(file, form.items[0], 'sampleImages')"
                  class="p-upload-inline"
                >
                  <div class="p-upload-grid">
                    <div v-for="(img, i) in form.items[0].sampleImages" :key="i" class="p-upload-item">
                      <img :src="img" />
                      <div class="p-upload-mask" @click.stop="removeImage(form.items[0], 'sampleImages', i)">
                        <el-icon><Delete /></el-icon>
                      </div>
                    </div>
                    <div class="p-upload-add">
                      <el-icon><Picture /></el-icon>
                      <span>添加图片</span>
                    </div>
                  </div>
                </el-upload>
              </el-form-item>
              <el-form-item label="订单截图" prop="items.0.orderScreenshots">
                <el-upload
                  action="#"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="(file: any) => handleImageSuccess(file, form.items[0], 'orderScreenshots')"
                  class="p-upload-inline"
                >
                  <div class="p-upload-grid">
                    <div v-for="(img, i) in form.items[0].orderScreenshots" :key="i" class="p-upload-item">
                      <img :src="img" />
                      <div class="p-upload-mask" @click.stop="removeImage(form.items[0], 'orderScreenshots', i)">
                        <el-icon><Delete /></el-icon>
                      </div>
                    </div>
                    <div class="p-upload-add">
                      <el-icon><Camera /></el-icon>
                      <span>添加截图</span>
                    </div>
                  </div>
                </el-upload>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </template>

      <!-- 新增模式：支持多方案 Tab 切换 -->
      <template v-else>
        <el-tabs
          v-model="activeTab"
          type="border-card"
          addable
          @tab-add="addItem"
          @tab-remove="removeItemByTab"
          class="feedback-tabs"
        >
          <el-tab-pane
            v-for="(item, index) in form.items"
            :key="item.id"
            :label="'购样方案 ' + (index + 1)"
            :name="item.id"
            :closable="form.items.length > 1"
          >
            <el-form :model="form" ref="formRef" label-position="left" label-width="100px" class="feedback-form custom-form">
              <!-- 模块 1：拿样渠道信息 -->
              <div class="form-section">
                <div class="section-title">
                  <span class="title-bar blue"></span>
                  <span>拿样渠道信息</span>
                </div>
                <el-row :gutter="24">
                  <el-col :span="6">
                    <el-form-item 
                      label="拿样渠道" 
                      required
                      :prop="'items.' + index + '.channel'"
                      :rules="{ required: true, message: '请选择渠道', trigger: 'change' }"
                    >
                      <el-select v-model="item.channel" placeholder="请选择" class="w-full">
                        <el-option label="供应商" value="供应商" />
                        <el-option label="1688" value="1688" />
                        <el-option label="淘宝" value="淘宝" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <template v-if="item.channel === '供应商'">
                    <el-col :span="6">
                      <el-form-item 
                        label="供应商类型" 
                        required
                        :prop="'items.' + index + '.supplierType'"
                        :rules="{ required: true, message: '请选择类型', trigger: 'change' }"
                      >
                        <el-select v-model="item.supplierType" placeholder="请选择" class="w-full">
                          <el-option label="正式供应商" value="正式" />
                          <el-option label="临时供应商" value="临时" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item 
                        label="供应商" 
                        required
                        :prop="'items.' + index + '.supplier'"
                        :rules="{ required: true, message: '请输入供应商', trigger: 'blur' }"
                      >
                        <el-select 
                          v-if="item.supplierType === '正式'" 
                          v-model="item.supplier" 
                          placeholder="选择供应商" 
                          class="w-full"
                          @change="(val: any) => handleSupplierChange(val, item)"
                        >
                          <el-option v-for="s in formalSuppliers" :key="s.value" :label="s.label" :value="s.label" />
                        </el-select>
                        <el-input v-else v-model="item.supplier" placeholder="输入名称" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item 
                        label="货源地" 
                        required
                        :prop="'items.' + index + '.source'"
                        :rules="{ required: true, message: '请选择或输入货源地', trigger: 'blur' }"
                      >
                        <el-select 
                          v-model="item.source" 
                          placeholder="请选择" 
                          class="w-full"
                          :disabled="item.supplierType === '正式'"
                        >
                          <el-option label="广东深圳" value="广东深圳" />
                          <el-option label="浙江义乌" value="浙江义乌" />
                          <el-option label="江苏苏州" value="江苏苏州" />
                          <el-option label="福建泉州" value="福建泉州" />
                          <el-option label="山东临沂" value="山东临沂" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </template>
                  <template v-else>
                    <el-col :span="14">
                      <el-form-item 
                        label="购买链接" 
                        required
                        :prop="'items.' + index + '.purchaseUrl'"
                        :rules="{ required: true, message: '请输入购买链接', trigger: 'blur' }"
                      >
                        <el-input v-model="item.purchaseUrl" placeholder="粘贴 1688 或 淘宝 购买链接" />
                      </el-form-item>
                    </el-col>
                  </template>
                </el-row>
              </div>

              <!-- 模块 2：费用与退款条款 -->
              <div class="form-section">
                <div class="section-title" style="display: flex; align-items: center; gap: 8px;">
                  <span class="title-bar orange"></span>
                  <span>费用与退款条款</span>
                  <el-tag type="warning" size="small" effect="light" style="font-weight: 600; margin-left: 4px;">费用类型: {{ item.feeType }}</el-tag>
                </div>
                <el-row :gutter="24">
                  <el-col :span="6">
                    <el-form-item 
                      label="样品名称" 
                      :prop="'items.' + index + '.sampleName'"
                    >
                      <el-input v-model="item.sampleName" placeholder="输入样品名称" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item 
                      label="购样数量" 
                      required
                      :prop="'items.' + index + '.quantity'"
                      :rules="{ required: true, message: '请输入数量', trigger: 'blur' }"
                    >
                      <el-input-number v-model="item.quantity" :min="1" :controls="false" class="w-full" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item 
                      label="费用(单价)" 
                      required
                      :prop="'items.' + index + '.price'"
                      :rules="{ required: true, message: '请输入费用', trigger: 'blur' }"
                    >
                      <el-input-number v-model="item.price" :min="0" :precision="2" :controls="false" class="w-full">
                        <template #append>CNY</template>
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="费用合计">
                      <span class="total-price-text">¥ {{ (item.quantity * item.price).toFixed(2) }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="24" v-if="item.channel === '供应商'">
                  <el-col :span="6">
                    <el-form-item label="是否可退款">
                      <el-switch
                        v-model="item.isRefundable"
                        inline-prompt
                        active-text="是"
                        inactive-text="否"
                      />
                    </el-form-item>
                  </el-col>
                  <template v-if="item.isRefundable">
                    <el-col :span="6">
                      <el-form-item label="退款方式" required>
                        <el-select v-model="item.refundMethod" placeholder="请选择" class="w-full">
                          <el-option label="首单退款" value="first_order" />
                          <el-option label="订单量退款" value="order_volume" />
                          <el-option label="订单金额退款" value="order_amount" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item 
                        label="退款条件" 
                        required
                        :rules="[
                          { required: ['order_volume', 'order_amount'].includes(item.refundMethod), message: '请输入退款条件', trigger: 'blur' }
                        ]"
                      >
                        <el-input v-model="item.refundCondition" placeholder="请输入" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <div class="refund-tip-wrapper" v-if="item.refundMethod">
                        <div class="refund-tip">
                          <el-icon class="mr-4"><InfoFilled /></el-icon>
                          <span>{{ refundDescriptions[item.refundMethod] }}</span>
                        </div>
                      </div>
                    </el-col>
                  </template>
                </el-row>
              </div>

              <!-- 模块 3：收款账户信息 -->
              <div class="form-section" v-if="item.channel === '供应商'">
                <div class="section-title">
                  <span class="title-bar purple"></span>
                  <span>收款账户信息</span>
                </div>
                <el-row :gutter="24">
                  <el-col :span="6">
                    <el-form-item label="收款方式" required>
                      <el-select v-model="item.paymentMethod" placeholder="请选择" class="w-full">
                        <el-option label="银行转账" value="银行转账" />
                        <el-option label="支付宝" value="支付宝" />
                        <el-option label="微信" value="微信" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <template v-if="item.paymentMethod === '银行转账'">
                    <el-col :span="6">
                      <el-form-item label="开户行" required>
                        <el-input v-model="item.bankName" placeholder="输入支行" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="账号户名" required>
                        <el-input v-model="item.accountName" placeholder="输入户名" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="银行账号" required>
                        <el-input v-model="item.bankAccount" placeholder="输入账号" />
                      </el-form-item>
                    </el-col>
                  </template>
                  <template v-if="['支付宝', '微信'].includes(item.paymentMethod)">
                    <el-col :span="8">
                      <el-form-item 
                        label="收款二维码"
                        :required="item.paymentMethod === '支付宝'"
                        :prop="'items.' + index + '.paymentQrCodes'"
                        :rules="[
                          { 
                            validator: (rule: any, value: any, callback: any) => {
                              if (item.paymentMethod === '支付宝' && (!value || value.length === 0)) {
                                callback(new Error('请上传收款二维码'))
                              } else {
                                callback()
                              }
                            }, 
                            trigger: 'change' 
                          }
                        ]"
                      >
                        <el-upload
                          action="#"
                          :auto-upload="false"
                          :show-file-list="false"
                          :on-change="(file: any) => handleImageSuccess(file, item, 'paymentQrCodes')"
                          class="p-upload-inline"
                        >
                          <div class="p-upload-grid">
                            <div v-for="(img, i) in item.paymentQrCodes" :key="i" class="p-upload-item">
                              <img :src="img" />
                              <div class="p-upload-mask" @click.stop="removeImage(item, 'paymentQrCodes', i)">
                                <el-icon><Delete /></el-icon>
                              </div>
                            </div>
                            <div class="p-upload-add" v-if="item.paymentQrCodes.length === 0">
                              <el-icon><Picture /></el-icon>
                              <span>上传收款码</span>
                            </div>
                          </div>
                        </el-upload>
                      </el-form-item>
                    </el-col>
                  </template>
                </el-row>
              </div>

              <!-- 模块 3.5：合同信息 -->
              <div class="form-section" v-if="item.feeType === '开模费'">
                <div class="section-title">
                  <span class="title-bar cyan"></span>
                  <span>合同信息</span>
                </div>
                <el-row :gutter="24">
                  <el-col :span="8">
                    <el-form-item label="合同文件" required :prop="'items.' + index + '.contractFiles'" :rules="{ required: true, type: 'array', message: '请上传合同文件', trigger: 'change' }">
                      <el-upload
                        action="#"
                        :auto-upload="false"
                        v-model:file-list="item.contractFiles"
                      >
                        <el-button type="primary" size="small" plain :icon="Upload">上传合同</el-button>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="合同金额" required :prop="'items.' + index + '.contractAmount'" :rules="{ required: true, message: '请输入合同金额', trigger: 'blur' }">
                      <el-input-number v-model="item.contractAmount" :min="0" :precision="2" :controls="false" placeholder="请输入合同金额" class="w-full">
                        <template #append>CNY</template>
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="合同备注" :prop="'items.' + index + '.contractRemark'">
                      <el-input v-model="item.contractRemark" placeholder="请输入合同备注" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>

              <!-- 模块 4：单据相关附件 -->
              <div class="form-section" v-if="item.channel !== '供应商'">
                <div class="section-title">
                  <span class="title-bar green"></span>
                  <span>单据相关附件</span>
                </div>
                <div class="attachments-upload-grid">
                  <el-form-item label="样品图片" :prop="'items.' + index + '.sampleImages'">
                    <el-upload
                      action="#"
                      :auto-upload="false"
                      :show-file-list="false"
                      :on-change="(file: any) => handleImageSuccess(file, item, 'sampleImages')"
                      class="p-upload-inline"
                    >
                      <div class="p-upload-grid">
                        <div v-for="(img, i) in item.sampleImages" :key="i" class="p-upload-item">
                          <img :src="img" />
                          <div class="p-upload-mask" @click.stop="removeImage(item, 'sampleImages', i)">
                            <el-icon><Delete /></el-icon>
                          </div>
                        </div>
                        <div class="p-upload-add">
                          <el-icon><Picture /></el-icon>
                          <span>添加图片</span>
                        </div>
                      </div>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="订单截图" :prop="'items.' + index + '.orderScreenshots'">
                    <el-upload
                      action="#"
                      :auto-upload="false"
                      :show-file-list="false"
                      :on-change="(file: any) => handleImageSuccess(file, item, 'orderScreenshots')"
                      class="p-upload-inline"
                    >
                      <div class="p-upload-grid">
                        <div v-for="(img, i) in item.orderScreenshots" :key="i" class="p-upload-item">
                          <img :src="img" />
                          <div class="p-upload-mask" @click.stop="removeImage(item, 'orderScreenshots', i)">
                            <el-icon><Delete /></el-icon>
                          </div>
                        </div>
                        <div class="p-upload-add">
                          <el-icon><Camera /></el-icon>
                          <span>添加截图</span>
                        </div>
                      </div>
                    </el-upload>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <div class="footer-left">
          <span class="batch-info" v-if="!isEditMode">共计 {{ form.items.length }} 个购样申请</span>
        </div>
        <div class="footer-right">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" plain @click="handleSave">保 存</el-button>
          <el-button type="primary" @click="handleSubmit">提 交</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, InfoFilled, Picture, Camera, Delete, Upload } from '@element-plus/icons-vue'

const visible = ref(false)
const isEditMode = ref(false)
const formRef = ref<any>(null)
const emit = defineEmits(['submit'])

// 模拟正式供应商数据及其货源地
const formalSuppliers = [
  { label: '浙江恒太工贸有限公司', value: 'S001', source: '浙江义乌' },
  { label: '广东奥飞娱乐股份有限公司', value: 'S002', source: '广东深圳' },
  { label: '江苏美派玩具礼品有限公司', value: 'S003', source: '江苏苏州' }
]

const refundDescriptions: Record<string, string> = {
  first_order: '首单达到起订量即可退回费用',
  order_volume: '订单量累计达到设定数量后退回',
  order_amount: '订单金额累计达到设定金额后退回'
}

const handleSupplierChange = (val: string, item: any) => {
  const supplier = formalSuppliers.find(s => s.label === val)
  if (supplier) {
    item.source = supplier.source
  }
}

const handleImageSuccess = (file: any, item: any, field: 'sampleImages' | 'orderScreenshots' | 'paymentQrCodes') => {
  if (file.raw) {
    const url = URL.createObjectURL(file.raw)
    item[field].push(url)
  }
}

const removeImage = (item: any, field: 'sampleImages' | 'orderScreenshots' | 'paymentQrCodes', index: number) => {
  item[field].splice(index, 1)
}

const createEmptyItem = (data?: any) => {
  const isPurchaseRow = data && (data.applyNo || data.qty !== undefined)
  return {
    id: Date.now() + Math.random().toString(36).substring(2, 9),
    applyNo: data?.applyNo || '',
    feeType: data?.feeType || '打样费',
    channel: isPurchaseRow ? (data.channel || '供应商') : (data?.source === '1688' || data?.source === '淘宝' ? data.source : '供应商'),
    supplierType: isPurchaseRow ? (data.supplierType || (data.supplier ? '正式' : '临时')) : '临时',
    supplier: isPurchaseRow ? (data.supplier || '') : '',
    source: isPurchaseRow ? (data.source || data.supplier || '') : (data?.source || ''),
    purchaseUrl: data?.purchaseUrl || '',
    isRefundable: isPurchaseRow ? (!!data.isRefundable) : (data?.isRefundable === '是'),
    sampleName: isPurchaseRow ? (data.sampleName || '') : (data?.productName || ''),
    quantity: isPurchaseRow ? (data.qty || 1) : 1,
    price: isPurchaseRow ? (typeof data.price === 'number' ? data.price : (parseFloat((data.price || '0').replace(/[^\d.]/g, '')) || 0)) : 0,
    paymentMethod: data?.paymentMethod || '银行转账',
    bankAccount: data?.bankAccount || '',
    accountName: data?.accountName || '',
    bankName: data?.bankName || '',
    refundMethod: data?.refundMethod || 'first_order',
    refundCondition: data?.refundCondition || '',
    sampleImages: data?.sampleImages || (data?.image ? [data.image] : [] as string[]),
    orderScreenshots: data?.orderScreenshots || [] as string[],
    paymentQrCodes: data?.paymentQrCodes || (data?.paymentQrCode ? [data.paymentQrCode] : [] as string[]),
    contractFiles: data?.contractFiles || (data?.contractFile ? [{ name: data.contractFile, url: '#' }] : []),
    contractAmount: data?.contractAmount || undefined,
    contractRemark: data?.contractRemark || ''
  }
}

const form = ref({
  items: [createEmptyItem()]
})

const activeTab = ref(form.value.items[0].id)

const addItem = () => {
  const newItem = createEmptyItem()
  form.value.items.push(newItem)
  activeTab.value = newItem.id
}

const removeItemByTab = (targetName: string | number) => {
  const items = form.value.items
  if (items.length <= 1) return
  
  const index = items.findIndex(item => item.id === targetName)
  if (index === -1) return

  ElMessageBox.confirm('确定要删除该购样方案吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    buttonSize: 'small'
  }).then(() => {
    items.splice(index, 1)
    if (activeTab.value === targetName) {
      activeTab.value = items[Math.max(0, index - 1)].id
    }
    ElMessage.success('方案已删除')
  }).catch(() => {})
}

const handleSave = () => {
  ElMessage.success('保存成功')
  visible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  const forms = Array.isArray(formRef.value) ? formRef.value : [formRef.value]
  let isValid = true
  
  for (const formInst of forms) {
    if (formInst && typeof formInst.validate === 'function') {
      const valid = await new Promise<boolean>((resolve) => {
        formInst.validate((isValidForm: boolean) => resolve(isValidForm))
      })
      if (!valid) {
        isValid = false
      }
    }
  }
  
  if (!isValid) {
    ElMessage.warning('请完善必填信息')
    return
  }
  
  ElMessage.success(`成功提交 ${form.value.items.length} 个购样申请`)
  emit('submit', form.value.items)
  visible.value = false
}

const open = (taskData?: any) => {
  visible.value = true
  isEditMode.value = !!(taskData && (taskData.applyNo || taskData.qty !== undefined))
  const initialItem = createEmptyItem(taskData)
  form.value.items = [initialItem]
  activeTab.value = initialItem.id
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.feedback-instruction {
  margin: 0 20px 12px;
  padding: 8px 16px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #0369a1;
  .mr-8 { margin-right: 8px; }
}

.feedback-content {
  padding: 0 20px;
}

.feedback-tabs {
  border: 1px solid #e2e8f0 !important;
  border-radius: 8px !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02) !important;
  overflow: hidden;
  
  :deep(.el-tabs__header) {
    background-color: #f8fafc !important;
    margin: 0 !important;
    border-bottom: 1px solid #e2e8f0 !important;
    display: flex;
    align-items: center;
    padding: 0 4px;
  }

  :deep(.el-tabs__nav-wrap) {
    margin-bottom: -1px !important;
    &::after { display: none; }
  }

  :deep(.el-tabs__item) {
    height: 36px !important;
    line-height: 36px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    color: #64748b !important;
    border: none !important;
    transition: all 0.2s;
    margin: 0 2px;
    
    &.is-active {
      color: var(--el-color-primary) !important;
      background: #fff !important;
      font-weight: 600 !important;
      border-left: 1px solid #e2e8f0 !important;
      border-right: 1px solid #e2e8f0 !important;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: var(--el-color-primary);
      }
    }
    
    &:hover:not(.is-active) {
      color: var(--el-color-primary) !important;
    }
  }

  :deep(.el-tabs__new-tab) {
    margin-left: 12px !important;
    background: transparent !important;
    border: none !important;
    color: var(--el-color-primary) !important;
    width: auto !important;
    height: 36px !important;
    padding: 0 8px !important;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    cursor: pointer;
    
    .el-icon { 
      margin: 0 !important; 
      font-weight: bold;
      font-size: 14px;
    }
    &::after { 
      content: '新增方案'; 
      margin-left: 4px; 
      font-size: 13px; 
      font-weight: 500; 
    }
    
    &:hover {
      opacity: 0.8;
      background: transparent !important;
    }
  }

  :deep(.el-tabs__content) {
    padding: 20px 24px !important;
    background: #fff !important;
  }
}

.custom-form {
  :deep(.el-form-item) { 
    margin-bottom: 12px !important; 
    display: flex; 
    align-items: flex-start; 
  }
  
  :deep(.el-form-item__label) { 
    font-weight: 600;
    color: #475569;
    padding-right: 8px !important;
    line-height: 30px !important;
    height: 30px !important;
    display: flex;
    align-items: center;
    font-size: 12px;
  }

  /* 统一所有输入控件的样式 - 参考样品登记的超紧凑风格 */
  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper),
  :deep(.el-input-number__wrapper) {
    background-color: #ffffff !important;
    box-shadow: 0 0 0 1px #e5e7eb inset !important;
    border-radius: 4px !important;
    padding: 2px 10px !important;
    height: 30px !important;
    font-size: 12px !important;
    transition: all 0.15s ease;
    
    &:hover {
      box-shadow: 0 0 0 1px #cbd5e1 inset !important;
    }
    
    &.is-focus, &.is-focused {
      background-color: #ffffff !important;
      box-shadow: 0 0 0 1px #1890ff inset, 0 0 0 2px rgba(24, 144, 255, 0.05) !important;
    }
  }

  :deep(.el-input-number) {
    width: 100%;
    .el-input__wrapper {
      padding-right: 0 !important;
    }
  }
}

.total-price-text {
  color: #fa8c16;
  font-weight: 700;
  font-size: 18px;
}

/* 退款提示样式 */
.refund-tip-wrapper {
  display: flex;
  align-items: center;
  height: 30px;
}
.refund-tip {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #0369a1;
  background: #f0f9ff;
  padding: 2px 10px;
  border-radius: 4px;
  border: 1px solid #bae6fd;
  line-height: 1.3;
  .el-icon { font-size: 13px; margin-right: 4px; }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 44px;
  box-sizing: border-box;
  
  .batch-info { font-size: 13px; color: #64748b; }
  
  .footer-right {
    display: flex; gap: 8px;
    :deep(.el-button) { height: 32px; padding: 0 20px; font-size: 13px; border-radius: 4px; }
  }
}

.w-full { width: 100%; }
.mr-8 { margin-right: 8px; }

/* 附件上传样式 */
.p-upload-inline {
  width: 100%;
}
.p-upload-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.p-upload-item {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  img { width: 100%; height: 100%; object-fit: cover; }
  
  &:hover .p-upload-mask { opacity: 1; }
}
.p-upload-mask {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
  .el-icon { color: #fff; font-size: 16px; &:hover { color: var(--el-color-danger); } }
}
.p-upload-add {
  width: 60px;
  height: 60px;
  border: 1px dashed #cbd5e1;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: var(--el-color-primary); color: var(--el-color-primary); }
  .el-icon { font-size: 16px; margin-bottom: 2px; }
  span { font-size: 10px; transform: scale(0.9); }
}

/* 表单模块卡片式设计 */
.form-section {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 16px 20px 8px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.02);
  animation: formSectionFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  
  .title-bar {
    width: 3px;
    height: 13px;
    border-radius: 2px;
    
    &.blue { background-color: #1890ff; }
    &.orange { background-color: #fa8c16; }
    &.purple { background-color: #722ed1; }
    &.green { background-color: #52c41a; }
    &.cyan { background-color: #13c2c2; }
  }
  
  span {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
  }
}

@keyframes formSectionFadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.attachments-upload-grid {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  :deep(.el-form-item) {
    margin-bottom: 0 !important;
  }
}
</style>
