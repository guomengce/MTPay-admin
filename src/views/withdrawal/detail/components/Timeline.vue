<template>
  <AdminPanel
    v-if="timelineItems.length"
    title="处理时间线"
    subtitle="本次出金订单的处理流程与文件记录"
    :icon="Clock"
  >
    <div class="timeline-scroll">
      <AdminTimeline :items="timelineItems" class="timeline-panel">
        <template #item-extra="{ item }">
          <div v-if="getFileRound(item.key)" class="timeline-files">
            <p class="timeline-files__count">
              本次关联 {{ getFileRound(item.key)?.files.length }} 个文件
            </p>
            <div class="file-list">
              <article
                v-for="file in getFileRound(item.key)?.files"
                :key="file.file_id"
              >
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
                    title="预览文件"
                    aria-label="预览文件"
                    @click="previewFile(file.file_id)"
                  />
                  <el-button
                    circle
                    size="small"
                    plain
                    :icon="Download"
                    :loading="isFileLoading(file.file_id, 'download')"
                    title="下载文件"
                    aria-label="下载文件"
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
import { useWithdrawalAttachments } from '../../composables/useWithdrawalAttachments';
import {
  formatFileSize,
  type WithdrawalFileRound,
} from '../../composables/useWithdrawalDetailView';

const props = defineProps<{
  timelineItems: AdminTimelineItem[];
  fileRounds: WithdrawalFileRound[];
}>();

const { isLoading: isFileLoading, preview: previewFile, download: downloadFile } =
  useWithdrawalAttachments();

function getFileRound(key: string) {
  return props.fileRounds.find((round) => String(round.key) === key);
}
</script>

<style scoped lang="scss">
.timeline-panel { padding: 22px; }

.timeline-scroll {
  min-height: 300px;
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
    &:hover { background: #f1f6fa; }
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
    strong { display: block; overflow: hidden; color: var(--app-text-body); font-size: 13px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
    p { margin: 4px 0 0; color: var(--app-text-label); font-size: 12px; }
  }
  &__actions {
    display: flex;
    gap: 8px;
    :deep(.el-button + .el-button) { margin-left: 0; }
    :deep(.el-button.is-circle) { width: 32px; min-width: 32px; height: 32px; padding: 0; border-radius: 50%; }
  }
}

@include mobile {
  .timeline-panel { padding: 18px 16px; }

  .file-list { padding: 6px; }
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
