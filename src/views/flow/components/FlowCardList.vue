<template>
  <AdminCardList
    :data="data"
    row-key="id"
    title="id"
    subtitle="time"
    :status="getStatusBadge"
    :pending="isPending"
    :fields="fields"
    :actions="actions"
    @action="handleCardAction"
  />
</template>

<script setup lang="ts">
import { View } from '@element-plus/icons-vue';

import AdminCardList from '@/components/admin/AdminCardList.vue';
import type {
  AdminCardActionConfig,
  AdminCardFieldConfig,
  AdminCardRecord,
} from '@/components/admin/AdminCardList.vue';
import type { FlowRow } from './FlowTableList.vue';

defineProps<{ data: FlowRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: FlowRow): void;
}>();

const fields: AdminCardFieldConfig[] = [
  { label: '时间', prop: 'time' },
  { label: '代理', prop: 'agent', strong: true },
  { label: '类型', badge: (row) => ({ label: toFlowRow(row).type, type: 'primary' }) },
  { label: '编号', prop: 'id', strong: true },
  { label: '内容', prop: 'content' },
  {
    label: '金额',
    prop: 'amount',
    subValue: 'usd',
    valueClass: (row) => getAmountClass(toFlowRow(row)),
    strong: true,
  },
];

const actions: AdminCardActionConfig[] = [
  { key: 'view', label: '查看详情', icon: View, plain: true },
];

function getStatusBadge(row: AdminCardRecord) {
  const flow = toFlowRow(row);

  return {
    label: flow.status,
    type: flow.statusType,
    effect: flow.statusEffect,
  };
}

function isPending(row: AdminCardRecord) {
  return toFlowRow(row).statusEffect === 'pending';
}

function getAmountClass(row: FlowRow) {
  return {
    'amount-success': row.amount.startsWith('+'),
    'amount-danger': row.amount.startsWith('-'),
  };
}

function handleCardAction(actionKey: string, _itemKey: string, row?: AdminCardRecord) {
  if (actionKey !== 'view' || !row) return;
  emit('view', toFlowRow(row));
}

function toFlowRow(row: AdminCardRecord) {
  return row as FlowRow;
}
</script>
