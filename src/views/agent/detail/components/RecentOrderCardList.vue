<template>
  <div class="recent-order-card-list">
    <AdminCardList :items="items" @action="handleAction" />
    <el-empty v-if="orders.length === 0" description="暫無最近交易" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { View } from '@element-plus/icons-vue';
import type { AgentRecentTransaction } from '@/api/modules/agent';
import AdminCardList, { type AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';

const props = defineProps<{ orders: AgentRecentTransaction[] }>();
const emit = defineEmits<{ (event: 'view', order: AgentRecentTransaction): void }>();

const items = computed<AdminCardItem[]>(() => props.orders.map((row) => ({
  key: row.transaction_key,
  title: row.order_no,
  subtitle: row.submitted_at || '—',
  status: { label: row.status_name, type: statusType(row.status_group) },
  pending: row.status_group === 'pending' || row.status_group === 'needs_supplement',
  fields: [
    { label: '業務類型', badge: { label: row.business_name, type: businessType(row.business_type) } },
    { label: '交易內容', value: transactionContent(row), strong: true },
    { label: '金額', value: orderAmount(row), strong: true },
  ],
  actions: [{ key: 'view', label: '查看詳情', icon: View, type: 'primary', plain: true }],
})));

function statusType(group: string): StatusBadgeType {
  if (group === 'completed' || group === 'success') return 'success';
  if (group === 'rejected' || group === 'failed') return 'danger';
  if (group === 'processing') return 'primary';
  return 'warning';
}

function businessType(type: AgentRecentTransaction['business_type']): StatusBadgeType {
  if (type === 'deposit') return 'success';
  if (type === 'exchange') return 'warning';
  return 'primary';
}

function transactionContent(row: AgentRecentTransaction) {
  if (row.business_type === 'withdrawal') return [row.payer_name, row.payee_name].filter(Boolean).join(' → ') || '—';
  if (row.business_type === 'exchange') return `${row.currency_code} → ${row.target_currency_code || '—'}`;
  return [row.currency_code, row.network_code].filter(Boolean).join(' · ');
}

function orderAmount(row: AgentRecentTransaction) {
  if (row.business_type === 'exchange') return `${row.amount} ${row.currency_code} → ${row.target_amount || '—'} ${row.target_currency_code || ''}`.trim();
  return `${row.amount} ${row.currency_code}`;
}

function handleAction(action: string, key: string) {
  if (action !== 'view') return;
  const row = props.orders.find((item) => item.transaction_key === key);
  if (row) emit('view', row);
}
</script>

<style scoped lang="scss">
.recent-order-card-list { display: none; }
@include mobile { .recent-order-card-list { display: block; padding: 14px; } }
</style>
