<template>
  <AdminDialog
    v-if="mode !== 'clear'"
    :model-value="modelValue"
    :title="title"
    :icon="mode === 'reject' ? CircleClose : DocumentAdd"
    :tone="mode === 'reject' ? 'danger' : 'warning'"
    width="min(520px, calc(100vw - 24px))"
    destroy-on-close
    @update:model-value="emit('update:modelValue', $event)"
    ><el-form label-position="top"
      ><el-form-item
        :label="mode === 'supplement' ? '補件要求' : '處理備註'"
        required
        ><el-input
          :model-value="note"
          type="textarea"
          :rows="5"
          maxlength="1000"
          show-word-limit
          @update:model-value="emit('update:note', $event)" /></el-form-item></el-form
    ><template #footer
      ><el-button @click="emit('update:modelValue', false)">取消</el-button
      ><el-button
        :type="mode === 'reject' ? 'danger' : 'primary'"
        :loading="submitting"
        @click="emit('submit')"
        >確認</el-button
      ></template
    ></AdminDialog
  >
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';
import { CircleClose, DocumentAdd } from '@element-plus/icons-vue';
import AdminDialog from '@/components/admin/AdminDialog.vue';
import { confirmAdminAction } from '@/utils/adminMessageBox';
export type RiskActionMode = 'supplement' | 'clear' | 'reject';
const props = defineProps<{
  modelValue: boolean;
  mode: RiskActionMode;
  note: string;
  submitting?: boolean;
}>();
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'update:note', value: string): void;
  (event: 'submit'): void;
}>();
const title = computed(
  () => ({ supplement: '要求代理補件', clear: '確認放行', reject: '拒絕風控案件' })[props.mode],
);

watch(
  () => props.modelValue,
  async (visible) => {
    if (!visible || props.mode !== 'clear') return;
    const confirmed = await confirmAdminAction({
      title: '放行風控案件',
      message: '確認放行這筆風控案件嗎？',
      confirmText: '確認放行',
    });
    emit('update:modelValue', false);
    if (confirmed) emit('submit');
  },
);
</script>
