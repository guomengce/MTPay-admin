<template>
  <AdminPanel title="案件概覽" :icon="Tickets">
    <div class="detail-grid">
      <div class="detail-grid__item">
        <span class="detail-grid__label">案件狀態</span>
        <StatusBadge v-bind="caseStatusMap[detail.status]" />
      </div>
      <div class="detail-grid__item">
        <span class="detail-grid__label">風險等級</span>
        <StatusBadge v-bind="riskLevelMap[detail.risk_level]" />
      </div>
      <div v-for="field in fields" :key="field.label" class="detail-grid__item">
        <span class="detail-grid__label">{{ field.label }}</span>
        <strong>{{ field.value }}</strong>
      </div>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Tickets } from '@element-plus/icons-vue';
import type { RiskCaseDetail } from '@/api/modules/withdrawalRisk';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import { caseStatusMap, riskLevelMap } from '../../presentation';

const props = defineProps<{ detail: RiskCaseDetail }>();
const fields = computed(() => [
  { label: '建立時間', value: props.detail.opened_at || '—' },
  { label: '結案時間', value: props.detail.closed_at || '—' },
  { label: '處理管理員', value: props.detail.handled_admin?.name || '—' },
  { label: '處理備註', value: props.detail.decision_note || '—' },
]);
</script>

<style scoped lang="scss">
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  padding: 22px 24px;
}
.detail-grid__item {
  display: grid;
  gap: 6px;
}
.detail-grid__label {
  color: var(--app-text-label);
  font-size: 12px;
}
@include mobile {
  .detail-grid {
    grid-template-columns: 1fr;
    padding: 18px;
  }
}
</style>
