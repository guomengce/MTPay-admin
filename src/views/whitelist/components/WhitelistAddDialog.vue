<template>
  <el-dialog
    :model-value="modelValue"
    :title="dialogTitle"
    width="min(440px, calc(100vw - 24px))"
    :close-on-click-modal="false"
    align-center
    @open="resetForm"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-if="row">
      <p v-if="mode === 'approve'">确认通过此白名单申请？</p>

      <el-form
        v-if="mode !== 'approve'"
        ref="formRef"
        :model="formState"
        :rules="rules"
        label-position="top"
        @submit.prevent
      >
        <el-form-item :label="mode === 'reject' ? '驳回原因' : '补件要求'" prop="message">
          <el-input
            v-model="formState.message"
            type="textarea"
            :rows="3"
            :placeholder="mode === 'reject' ? '请说明驳回原因' : '请输入补件要求'"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <el-button plain @click="emit('update:modelValue', false)">取消</el-button>
      <el-button
        :type="mode === 'reject' ? 'danger' : 'primary'"
        :icon="mode === 'reject' ? CircleClose : mode === 'approve' ? CircleCheck : DocumentAdd"
        :loading="submitting"
        @click="handleSubmit"
        >{{ submitLabel }}</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { CircleCheck, CircleClose, DocumentAdd } from '@element-plus/icons-vue';

import type { WhitelistRow } from '../composables/mapper';

export type WhitelistActionMode = 'approve' | 'reject' | 'supplement';

const props = defineProps<{
  modelValue: boolean;
  row: WhitelistRow | null;
  mode: WhitelistActionMode;
  submitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', payload: { row: WhitelistRow; mode: WhitelistActionMode; message?: string }): void;
}>();

const dialogTitle = computed(() =>
  props.mode === 'approve' ? '审核通过' : props.mode === 'reject' ? '驳回白名单' : '要求补件',
);
const submitLabel = computed(() =>
  props.mode === 'approve' ? '确认通过' : props.mode === 'reject' ? '确认驳回' : '发送补件要求',
);

const formRef = ref<FormInstance>();
const formState = reactive({ message: '' });
const rules: FormRules<{ message: string }> = {
  message: [{ required: true, message: '请填写处理说明', trigger: 'blur' }],
};

function resetForm() {
  formState.message = '';
  formRef.value?.clearValidate();
}

async function handleSubmit() {
  if (!props.row) return;
  if (props.mode !== 'approve') {
    if (!formRef.value || !(await formRef.value.validate().catch(() => false))) return;
  }
  emit('submit', {
    row: props.row,
    mode: props.mode,
    message: formState.message.trim() || undefined,
  });
}
</script>
