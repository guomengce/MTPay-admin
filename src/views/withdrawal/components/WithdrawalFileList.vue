<template>
  <div class="withdrawal-file-list">
    <article v-for="file in files" :key="file.file_id">
      <span class="withdrawal-file-list__type">{{ file.extension?.toUpperCase() || 'FILE' }}</span>
      <div class="withdrawal-file-list__info">
        <strong :title="file.original_name">{{ file.original_name }}</strong>
        <p>
          {{ file.uploader_name || file.file_type_name }} · {{ formatFileSize(file.size) }} ·
          {{ file.uploaded_at || '—' }}
        </p>
      </div>
      <div class="withdrawal-file-list__actions">
        <el-button
          size="small"
          type="primary"
          plain
          :icon="View"
          :loading="isLoading(file.file_id, 'preview')"
          @click="emit('preview', file.file_id)"
          >预览</el-button
        >
        <el-button
          size="small"
          plain
          :icon="Download"
          :loading="isLoading(file.file_id, 'download')"
          @click="emit('download', file.file_id, file.original_name)"
          >下载</el-button
        >
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { Download, View } from '@element-plus/icons-vue';
import type { WithdrawalFile } from '@/api/modules/withdrawal';
import { formatFileSize } from '../composables/useWithdrawalDetailView';

defineProps<{
  files: WithdrawalFile[];
  isLoading: (fileId: number, action: 'preview' | 'download') => boolean;
}>();
const emit = defineEmits<{
  (e: 'preview', fileId: number): void;
  (e: 'download', fileId: number, originalName: string): void;
}>();
</script>

<style scoped lang="scss">
.withdrawal-file-list {
  display: grid;
  padding: 7px;

  article {
    display: grid;
    min-width: 0;
    align-items: center;
    padding: 9px 7px;
    border-radius: 9px;
    grid-template-columns: 44px minmax(0, 1fr) auto;
    gap: 10px;
    &:hover {
      background: #f1f6fa;
    }
  }

  &__type {
    display: inline-flex;
    height: 36px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: #126df0;
    background: #e9f2ff;
    font-size: 9px;
    font-weight: 700;
  }
  &__info {
    min-width: 0;
  }
  &__info strong {
    display: block;
    overflow: hidden;
    color: var(--app-text-body);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__info p {
    margin: 3px 0 0;
    color: var(--app-text-label);
    font-size: 11px;
    overflow-wrap: anywhere;
  }
  &__actions {
    display: flex;
    gap: 7px;
  }
  &__actions :deep(.el-button + .el-button) {
    margin-left: 0;
  }
}

@include mobile {
  .withdrawal-file-list article {
    align-items: start;
    grid-template-columns: 38px minmax(0, 1fr);
  }
  .withdrawal-file-list__actions {
    width: 100%;
    grid-column: 1 / -1;
  }
}
</style>
