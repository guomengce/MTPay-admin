<template>
  <el-dialog
    :model-value="modelValue"
    :title="dialogTitle"
    width="min(440px, calc(100vw - 24px))"
    :close-on-click-modal="false"
    align-center
    @open="resetForm"
    @update:model-value="handleVisibleChange"
  >
    <template v-if="row">
      <p v-if="mode === 'approve'">確認通過此數字貨幣兌換申請？</p>

      <el-form
        v-if="mode === 'reject'"
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
        v-if="mode === 'approve'"
        type="primary"
        :icon="CircleCheck"
        :loading="submitting"
        @click="handleSubmit"
        >確認通過</el-button
      >
      <el-button
        v-else
        type="danger"
        :icon="CircleClose"
        :loading="submitting"
        @click="handleSubmit"
        >確認拒絕</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { CircleCheck, CircleClose } from '@element-plus/icons-vue';

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

const dialogTitle = computed(() =>
  props.mode === 'approve' ? '審核通過' : '拒絕數字貨幣兌換',
);

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
