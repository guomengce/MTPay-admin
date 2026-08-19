<template>
  <el-dialog
    :model-value="modelValue"
    :title="dialogTitle"
    width="560px"
    :close-on-click-modal="false"
    align-center
    @open="resetForm"
    @update:model-value="handleVisibleChange"
  >
    <template v-if="row">
      <p class="deposit-dialog__hint">
        {{
          mode === 'view'
            ? '核对币种、网络、金额与交易哈希。审核通过后才会增加代理可用余额。'
            : mode === 'approve'
              ? '审核通过后，系统将自动增加该代理可用余额并完成本笔入金。'
              : '拒绝后将通知代理重新提交，请填写拒绝原因。'
        }}
      </p>

      <el-form
        v-if="mode === 'reject'"
        ref="formRef"
        class="deposit-dialog__form"
        :model="reasonForm"
        :rules="rules"
        label-position="top"
        @submit.prevent
      >
        <el-form-item label="拒绝原因" prop="reason">
          <el-input
            v-model="reasonForm.reason"
            type="textarea"
            :rows="3"
            placeholder="例如：金额与链上转账记录不符"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <dl v-else class="deposit-dialog__detail">
        <div>
          <dt>编号</dt>
          <dd>{{ row.id }}</dd>
        </div>
        <div>
          <dt>提交时间</dt>
          <dd>{{ row.time }}</dd>
        </div>
        <div>
          <dt>代理</dt>
          <dd>{{ row.agent }}</dd>
        </div>
        <div>
          <dt>资产 / 网络</dt>
          <dd>{{ row.asset }} · {{ row.network }}</dd>
        </div>
        <div>
          <dt>交易哈希</dt>
          <dd class="mono">{{ row.hash }}</dd>
        </div>
        <div>
          <dt>申报金额</dt>
          <dd class="strong">{{ row.amount }} {{ row.asset }}</dd>
        </div>
      </dl>
    </template>

    <template #footer>
      <el-button plain @click="emit('update:modelValue', false)">取消</el-button>
      <el-button v-if="mode === 'view'" plain @click="handleViewClose">关闭</el-button>
      <el-button
        v-else-if="mode === 'approve'"
        type="success"
        :icon="CircleCheck"
        :loading="submitting"
        @click="handleSubmit"
        >确认通过</el-button
      >
      <el-button
        v-else
        type="danger"
        :icon="CircleClose"
        :loading="submitting"
        @click="handleSubmit"
        >确认拒绝</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { CircleCheck, CircleClose } from '@element-plus/icons-vue';

import type { DepositRow } from './DepositTableList.vue';

type Mode = 'view' | 'approve' | 'reject';

const props = defineProps<{
  modelValue: boolean;
  row: DepositRow | null;
  mode: Mode;
  submitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'submit', payload: { row: DepositRow; mode: 'approve' | 'reject'; reason?: string }): void;
}>();

const dialogTitle = computed(() =>
  props.mode === 'view' ? '入金详情' : props.mode === 'approve' ? '审核通过' : '拒绝入金',
);

const formRef = ref<FormInstance>();
const reasonForm = reactive({ reason: '' });

const rules: FormRules<{ reason: string }> = {
  reason: [
    { required: true, message: '请填写拒绝原因', trigger: 'blur' },
    { max: 1000, message: '拒绝原因不能超过 1000 个字符', trigger: 'blur' },
  ],
};

function resetForm() {
  reasonForm.reason = '';
  formRef.value?.clearValidate();
}

function handleViewClose() {
  emit('update:modelValue', false);
}

function handleVisibleChange(value: boolean) {
  emit('update:modelValue', value);
}

async function handleSubmit() {
  if (!props.row) return;
  if (props.mode === 'reject') {
    if (!formRef.value) return;
    await formRef.value.validate((valid) => {
      if (valid) {
        emit('submit', { row: props.row!, mode: 'reject', reason: reasonForm.reason });
      }
    });
    return;
  }
  if (props.mode === 'approve') emit('submit', { row: props.row, mode: 'approve' });
}
</script>

<style scoped lang="scss">
.deposit-dialog {
  &__hint {
    margin: 0 0 18px;
    padding: 10px 14px;
    border-radius: 8px;
    color: #50617b;
    background: #f3f8fc;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.6;
  }

  &__detail {
    display: grid;
    gap: 0;
    margin: 0;
    padding: 4px 0;
    border-top: 1px solid #eef2f7;

    div {
      display: grid;
      grid-template-columns: 110px 1fr;
      align-items: center;
      gap: 12px;
      padding: 12px 4px;
      border-bottom: 1px solid #eef2f7;
    }

    dt {
      color: var(--app-text-label);
      font-size: 13px;
      font-weight: 600;
    }

    dd {
      margin: 0;
      color: #1f2a37;
      font-size: 14px;
      font-weight: 600;

      &.strong {
        color: var(--app-text-heading);
        font-size: 16px;
        font-weight: 600;
      }

      &.mono {
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
        font-size: 13px;
        word-break: break-all;
      }
    }
  }

  &__form {
    :deep(.el-form-item) {
      margin-bottom: 0;
    }
    :deep(.el-form-item__label) {
      color: var(--app-text-heading);
      font-weight: 600;
      padding-bottom: 6px;
    }
  }
}
</style>
