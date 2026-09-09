<template>
  <AdminDialog
    v-if="mode !== 'approve'"
    :model-value="modelValue"
    :title="dialogTitle"
    :icon="mode === 'reject' ? CircleClose : DocumentAdd"
    :tone="mode === 'reject' ? 'danger' : 'warning'"
    width="min(440px, calc(100vw - 24px))"
    @open="resetForm"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-if="row">
      <el-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        label-position="top"
        @submit.prevent
      >
        <el-form-item :label="mode === 'reject' ? '駁回原因' : '補件要求'" prop="message">
          <el-input
            v-model="formState.message"
            type="textarea"
            :rows="3"
            :placeholder="mode === 'reject' ? '請説明駁回原因' : '請輸入補件要求'"
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
        :icon="mode === 'reject' ? CircleClose : DocumentAdd"
        :loading="submitting"
        @click="handleSubmit"
        >{{ submitLabel }}</el-button
      >
    </template>
  </AdminDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { CircleClose, DocumentAdd } from '@element-plus/icons-vue';
import AdminDialog from '@/components/admin/AdminDialog.vue';
import { confirmAdminAction } from '@/utils/adminMessageBox';

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
  props.mode === 'reject' ? '駁回白名單' : '要求補件',
);
const submitLabel = computed(() =>
  props.mode === 'reject' ? '確認駁回' : '發送補件要求',
);

const formRef = ref<FormInstance>();
const formState = reactive({ message: '' });
const rules: FormRules<{ message: string }> = {
  message: [{ required: true, message: '請填寫處理説明', trigger: 'blur' }],
};

function resetForm() {
  formState.message = '';
  formRef.value?.clearValidate();
}

watch(
  () => props.modelValue,
  async (visible) => {
    if (!visible || props.mode !== 'approve' || !props.row) return;
    const confirmed = await confirmAdminAction({
      title: '通過白名單申請',
      message: '確認通過這筆白名單申請嗎？',
      confirmText: '確認通過',
    });
    emit('update:modelValue', false);
    if (confirmed) emit('submit', { row: props.row, mode: 'approve' });
  },
);

async function handleSubmit() {
  if (!props.row) return;
  if (!formRef.value || !(await formRef.value.validate().catch(() => false))) return;
  emit('submit', {
    row: props.row,
    mode: props.mode,
    message: formState.message.trim() || undefined,
  });
}
</script>
