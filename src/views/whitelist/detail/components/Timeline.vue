<template>
  <AdminPanel v-if="timelineItems.length" class="timeline-card" title="處理時間線" :icon="Clock">
    <div class="timeline-scroll">
      <AdminTimeline :items="timelineItems" class="timeline-panel">
        <template #item-extra="{ item }">
          <div v-if="getFileRound(item.key)" class="timeline-files">
            <p v-if="getFileRound(item.key)?.files.length" class="timeline-files__count">
              本次關聯 {{ getFileRound(item.key)?.files.length }} 個文件
            </p>
            <p v-else class="timeline-files__empty">本次未提交證明文件</p>
            <div v-if="getFileRound(item.key)?.files.length" class="file-list">
              <article v-for="file in getFileRound(item.key)?.files" :key="file.file_id">
                <span class="file-list__type">{{ file.extension?.toUpperCase() || 'FILE' }}</span>
                <div class="file-list__info">
                  <strong :title="file.original_name">{{ file.original_name }}</strong>
                  <p>{{ formatFileSize(file.size) }} · {{ file.uploaded_at || '—' }}</p>
                </div>
                <div class="file-list__actions">
                  <el-button
                    circle
                    size="small"
                    type="primary"
                    plain
                    :icon="View"
                    :loading="isFileLoading(file.file_id, 'preview')"
                    title="預覽文件"
                    aria-label="預覽文件"
                    @click="previewFile(file.file_id)"
                  />
                  <el-button
                    circle
                    size="small"
                    plain
                    :icon="Download"
                    :loading="isFileLoading(file.file_id, 'download')"
                    title="下載文件"
                    aria-label="下載文件"
                    @click="downloadFile(file.file_id, file.original_name)"
                  />
                </div>
              </article>
            </div>
          </div>
        </template>
      </AdminTimeline>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { Clock, Download, View } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminTimeline, { type AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';
import { useWhitelistAttachments } from '../../composables/useWhitelistAttachments';
import { formatFileSize, type WhitelistFileRound } from '../../composables/useWhitelistDetailView';

const props = defineProps<{
  timelineItems: AdminTimelineItem[];
  fileRounds: WhitelistFileRound[];
}>();

const {
  isLoading: isFileLoading,
  preview: previewFile,
  download: downloadFile,
} = useWhitelistAttachments();

function getFileRound(key: string) {
  return props.fileRounds.find((round) => String(round.key) === key);
}
</script>

<style scoped lang="scss">
.timeline-card {
  :deep(.admin-panel__header) {
    padding: 16px 20px;
  }
  :deep(.admin-panel__icon) {
    width: 42px;
    height: 42px;
    flex-basis: 42px;
    border-radius: 11px;
    font-size: 21px;
  }
}

.timeline-panel {
  padding: 22px;
}

.timeline-scroll {
  height: 700px;
  min-height: 0;
  padding-right: 4px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: #c8d2e0 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #c8d2e0;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.timeline-files {
  margin-top: 14px;
  overflow: hidden;
  border: 1px solid #e0e8f0;
  border-radius: 11px;
  background: #fbfcfe;

  &__count {
    margin: 0 !important;
    padding: 9px 12px;
    border-bottom: 1px solid #e6edf3;
    color: #087f7b !important;
    background: #f1faf8;
    font-size: 12px !important;
    font-weight: 600 !important;
  }

  &__empty {
    margin: 0 !important;
    padding: 11px 12px;
    color: var(--app-text-label) !important;
    font-size: 12px !important;
  }
}

.file-list {
  display: grid;
  padding: 8px;

  article {
    display: grid;
    min-width: 0;
    align-items: center;
    padding: 10px 8px;
    border-radius: 9px;
    grid-template-columns: 46px minmax(0, 1fr) auto;
    gap: 12px;
    &:hover {
      background: #f1f6fa;
    }
  }
  &__type {
    display: inline-flex;
    height: 38px;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    color: #126df0;
    background: #e9f2ff;
    font-size: 10px;
    font-weight: 700;
  }
  &__info {
    min-width: 0;
    strong {
      display: block;
      overflow: hidden;
      color: var(--app-text-body);
      font-size: 13px;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    p {
      margin: 4px 0 0;
      color: var(--app-text-label);
      font-size: 12px;
    }
  }
  &__actions {
    display: flex;
    gap: 8px;
    :deep(.el-button + .el-button) {
      margin-left: 0;
    }
    :deep(.el-button.is-circle) {
      width: 32px;
      min-width: 32px;
      height: 32px;
      padding: 0;
      border-radius: 50%;
    }
  }
}

@include mobile {
  .timeline-panel {
    padding: 18px 16px;
  }

  .file-list {
    padding: 6px;
  }
  .file-list article {
    align-items: start;
    grid-template-columns: 38px minmax(0, 1fr);
    gap: 10px;
  }
  .file-list__actions {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    grid-column: 1 / -1;
  }
}
</style>
