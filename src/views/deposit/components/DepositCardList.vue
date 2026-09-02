<template>
  <div class="deposit-card-list">
    <AdminCardList :items="cardItems" @action="handleAction" />
  </div>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import { computed } from 'vue';
import { View } from '@element-plus/icons-vue';

import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { DepositRow } from '../composables/mapper';
import { formatLongIdentifier } from '@/utils/text';

const props = defineProps<{ data: DepositRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: DepositRow): void;
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
      { label: '編號', value: row.id, strong: true },
      { label: '時間', value: row.time },
      { label: '代理', value: row.agent },
      { label: '資產', value: row.asset, subValue: row.network, strong: true },
      { label: '交易哈希', value: formatLongIdentifier(row.hash), mono: true },
      { label: '申報金額', value: `${formatMoney(row.amount)} ${row.asset}`, strong: true },
    ],
    actions: [
      { key: 'view', label: '查看詳情', icon: View, type: 'primary', plain: true },
    ],
    pending: row.statusEffect === 'pending',
  })),
);

function handleAction(actionKey: string, itemKey: string) {
  const row = props.data.find((item) => item.id === itemKey);
  if (!row) return;

  if (actionKey === 'view') emit('view', row);
}
</script>

<style scoped lang="scss">
.deposit-card-list {
  display: none;

  @include mobile {
    display: block;
  }
}
</style>
