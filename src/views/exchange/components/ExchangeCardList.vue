<template>
  <div class="exchange-card-list">
    <AdminCardList :items="cardItems" @action="handleAction" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CircleCheck, CircleClose, View } from '@element-plus/icons-vue';

import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { ExchangeRow } from './ExchangeTableList.vue';

const props = defineProps<{ data: ExchangeRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: ExchangeRow): void;
  (e: 'approve', row: ExchangeRow): void;
  (e: 'reject', row: ExchangeRow): void;
}>();

const cardItems = computed<AdminCardItem[]>(() =>
  props.data.map((row) => ({
    key: row.id,
    title: row.id,
    subtitle: row.time,
    status: {
      label: row.status,
      type: row.statusType,
      effect: row.statusEffect,
    },
    fields: [
      { label: '编号', value: row.id, strong: true },
      { label: '时间', value: row.time },
      { label: '代理', value: row.agent, subValue: row.code },
      { label: '支付资产', value: row.amount, subValue: row.asset, strong: true },
      { label: '比例', value: row.rate, strong: true },
      { label: '获得USD', value: row.usd, strong: true },
    ],
    actions: [
      { key: 'view', label: '详情', icon: View, plain: true },
      {
        key: 'approve',
        label: '通过',
        icon: CircleCheck,
        type: 'success',
        plain: true,
        visible: row.statusEffect === 'pending',
      },
      {
        key: 'reject',
        label: '拒绝',
        icon: CircleClose,
        type: 'danger',
        plain: true,
        visible: row.statusEffect === 'pending',
      },
    ],
    pending: row.statusEffect === 'pending',
  })),
);

function handleAction(actionKey: string, itemKey: string) {
  const row = props.data.find((item) => item.id === itemKey);
  if (!row) return;

  if (actionKey === 'view') {
    emit('view', row);
    return;
  }

  if (actionKey === 'approve') {
    emit('approve', row);
    return;
  }

  if (actionKey === 'reject') {
    emit('reject', row);
  }
}
</script>

<style scoped lang="scss">
.exchange-card-list {
  display: none;

  @include mobile {
    display: block;
  }
}
</style>
