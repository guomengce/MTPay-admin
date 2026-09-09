<template>
  <AdminPanel class="risk-record-panel" title="案件記錄" :icon="Clock">
    <AdminTimeline
      v-if="timelineItems.length"
      class="risk-record-panel__timeline"
      :items="timelineItems"
    >
      <template #item-extra="{ item }"
        ><div v-if="recordFiles(item.key).length" class="timeline-files">
          <p class="timeline-files__count">本次關聯 {{ recordFiles(item.key).length }} 個文件</p>
          <div class="file-list">
            <div v-for="file in recordFiles(item.key)" :key="file.id" class="file-list__item">
              <span class="file-list__type">{{ file.extension }}</span
              ><strong class="file-list__name" :title="file.name">{{ file.name }}</strong>
              <div class="file-list__actions">
                <el-button
                  circle
                  size="small"
                  type="primary"
                  plain
                  :icon="View"
                  title="預覽文件"
                  @click="previewFile(file)"
                /><el-button
                  circle
                  size="small"
                  plain
                  :icon="Download"
                  title="下載文件"
                  @click="downloadFile(file)"
                />
              </div>
            </div>
          </div></div
      ></template>
    </AdminTimeline>
    <el-empty v-else description="暫無案件記錄" />
  </AdminPanel>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { Clock, Download, View } from '@element-plus/icons-vue';
import {
  downloadWithdrawalRiskFile,
  previewWithdrawalRiskFile,
  type RiskCaseRecord,
} from '@/api/modules/withdrawalRisk';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminTimeline, { type AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';
const props = defineProps<{ records: RiskCaseRecord[] }>();
const labels: Record<number, string> = {
  1: '提交法幣出金申請',
  2: '凍結出金資金',
  13: '命中風控規則',
  14: '建立風控案件',
  15: '要求代理補充風控資料',
  16: '代理提交風控補件',
};
interface RecordFile {
  id: number;
  name: string;
  extension: string;
}
function normalizeFiles(record: RiskCaseRecord): RecordFile[] {
  const metadata = Array.isArray(record.files) ? record.files : [];
  if (metadata.length)
    return metadata
      .map((file) => {
        const id = Number(file.file_id ?? file.id);
        return {
          id,
          name: file.original_name || file.name || `風控附件 #${id}`,
          extension: (file.extension || 'FILE').toUpperCase(),
        };
      })
      .filter((file) => file.id > 0);
  return (Array.isArray(record.file_ids) ? record.file_ids : Object.values(record.file_ids || {}))
    .map((fileId) => {
      const id = Number(fileId);
      return { id, name: `風控附件 #${id}`, extension: 'FILE' };
    })
    .filter((file) => file.id > 0);
}
const normalized = computed(() =>
  props.records.map((record) => ({ ...record, files: normalizeFiles(record) })),
);
const timelineItems = computed<AdminTimelineItem[]>(() =>
  normalized.value.map((record) => ({
    key: String(record.id),
    title:
      record.action_name || labels[record.action_type] || `案件操作（類型 ${record.action_type}）`,
    time: record.created_at || undefined,
    description: [record.actor_name || '系統', record.message].filter(Boolean).join(' · '),
    state: 'done',
  })),
);
function recordFiles(key: string) {
  return normalized.value.find((record) => String(record.id) === key)?.files ?? [];
}
function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function previewFile(file: RecordFile) {
  const url = URL.createObjectURL(await previewWithdrawalRiskFile(file.id));
  window.open(url, '_blank', 'noopener');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
async function downloadFile(file: RecordFile) {
  saveBlob(await downloadWithdrawalRiskFile(file.id), file.name);
}
</script>
<style scoped lang="scss">
.risk-record-panel {
  display: flex;
  height: 700px;
  min-height: 0;
  flex-direction: column;
}
.risk-record-panel__timeline {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  padding: 22px 24px;
}
.timeline-files {
  margin-top: 14px;
  overflow: hidden;
  border: 1px solid #e0e8f0;
  border-radius: 11px;
  background: #fbfcfe;
}
.timeline-files__count {
  margin: 0;
  padding: 9px 12px;
  border-bottom: 1px solid #e6edf3;
  color: #087f7b;
  background: #f1faf8;
  font-size: 12px;
  font-weight: 600;
}
.file-list {
  display: grid;
  padding: 8px;
}
.file-list__item {
  display: grid;
  min-width: 0;
  align-items: center;
  padding: 10px 8px;
  border-radius: 9px;
  grid-template-columns: 46px minmax(0, 1fr) auto;
  gap: 12px;
}
.file-list__item:hover {
  background: #f1f6fa;
}
.file-list__type {
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
.file-list__name {
  overflow: hidden;
  color: var(--app-text-body);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-list__actions {
  display: flex;
  gap: 8px;
}
.file-list__actions :deep(.el-button + .el-button) {
  margin-left: 0;
}
@include mobile {
  .file-list__item {
    align-items: start;
    grid-template-columns: 38px minmax(0, 1fr);
  }
  .file-list__actions {
    width: 100%;
    justify-content: flex-end;
    grid-column: 1/-1;
  }
}
</style>
