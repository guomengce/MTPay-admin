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
      <p v-if="mode === 'approve'">确认通过此兑换申请？</p>

      <el-form
        v-if="mode === 'reject'"
        ref="formRef"
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
            placeholder="请输入拒绝原因"
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
  props.mode === 'approve' ? '审核通过' : '拒绝兑换',
);

const formRef = ref<FormInstance>();
const reasonForm = reactive({ reason: '' });

const rules: FormRules<{ reason: string }> = {
  reason: [
    { required: true, message: '请填写拒绝原因', trigger: 'blur' },
    { max: 1000, message: '拒绝原因不能超过 1000 个字符', trigger: 'blur' },
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
