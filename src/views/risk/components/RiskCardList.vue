<template>
  <div class="risk-card-list"><AdminCardList :items="items" @action="handleAction" /></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { View } from '@element-plus/icons-vue';
import type { RiskCaseItem } from '@/api/modules/withdrawalRisk';
import AdminCardList, { type AdminCardItem } from '@/components/admin/AdminCardList.vue';
import { getCaseStatus, getRiskLevel } from '../presentation';

const props = defineProps<{ data: RiskCaseItem[] }>();
const emit = defineEmits<{ (event: 'view', row: RiskCaseItem): void }>();
const items = computed<AdminCardItem[]>(() =>
  props.data.map((row) => ({
    key: String(row.id),
    title: row.case_no,
    subtitle: row.opened_at || '—',
    status: getCaseStatus(row.status),
    pending: row.status === 0 || row.status === 1,
    fields: [
      {
        label: '代理',
        value: row.user.company_name,
        subValue: `${row.user.agent_code} · ${row.user.email}`,
        strong: true,
      },
      {
        label: '出金訂單',
        value: row.withdrawal.order_no,
        subValue: `${row.withdrawal.amount} ${row.withdrawal.currency}`,
        strong: true,
      },
      { label: '風險等級', badge: getRiskLevel(row.risk_level) },
    ],
    actions: [{ key: 'view', label: '詳情', icon: View, type: 'primary', plain: true }],
  })),
);
function handleAction(action: string, key: string) {
  if (action === 'view') {
    const row = props.data.find((item) => String(item.id) === key);
    if (row) emit('view', row);
  }
}
</script>

<style scoped lang="scss">
.risk-card-list {
  display: none;
}
@include mobile {
  .risk-card-list {
    display: block;
  }
}
</style>
