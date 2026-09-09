<template>
  <AdminDialog
    v-if="mode === 'reject'"
    :model-value="modelValue"
    title="拒絕數字貨幣兌換"
    :icon="CircleClose"
    tone="danger"
    width="min(440px, calc(100vw - 24px))"
    @open="resetForm"
    @update:model-value="handleVisibleChange"
  >
    <template v-if="row">
      <el-form
        ref="formRef"
        :model="reasonForm"
        :rules="rules"
        label-position="top"
        @submit.prevent
      >
        <el-form-item label="拒絕原因" prop="reason">
          <el-input
            v-model="reasonForm.reason"
            type="textarea"
            :rows="3"
            placeholder="請輸入拒絕原因"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <el-button plain @click="emit('update:modelValue', false)">取消</el-button>
      <el-button
        type="danger"
        :icon="CircleClose"
        :loading="submitting"
        @click="handleSubmit"
        >確認拒絕</el-button
      >
    </template>
  </AdminDialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { CircleClose } from '@element-plus/icons-vue';
import AdminDialog from '@/components/admin/AdminDialog.vue';
import { confirmAdminAction } from '@/utils/adminMessageBox';

import type { ExchangeRow } from './ExchangeTableList.vue';

type Mode = 'approve' | 'reject';

const props = defineProps<{
  modelValue: boolean;
  row: ExchangeRow | null;
  mode: Mode;
  submitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'submit', payload: { row: ExchangeRow; mode: 'approve' | 'reject'; reason?: string }): void;
}>();

const formRef = ref<FormInstance>();
const reasonForm = reactive({ reason: '' });

const rules: FormRules<{ reason: string }> = {
  reason: [
    { required: true, message: '請填寫拒絕原因', trigger: 'blur' },
    { max: 1000, message: '拒絕原因不能超過 1000 個字符', trigger: 'blur' },
  ],
};

function handleVisibleChange(value: boolean) {
  emit('update:modelValue', value);
}

function resetForm() {
  reasonForm.reason = '';
  formRef.value?.clearValidate();
}

watch(
  () => props.modelValue,
  async (visible) => {
    if (!visible || props.mode !== 'approve' || !props.row) return;
    const confirmed = await confirmAdminAction({
      title: '通過數字貨幣兌換',
      message: '確認通過這筆數字貨幣兌換申請嗎？',
      confirmText: '確認通過',
    });
    emit('update:modelValue', false);
    if (confirmed) emit('submit', { row: props.row, mode: 'approve' });
  },
);

async function handleSubmit() {
  if (!props.row) return;
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', { row: props.row!, mode: 'reject', reason: reasonForm.reason });
    }
  });
}
</script>
