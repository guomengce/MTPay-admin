<template>
  <div class="exchange-card-list">
    <AdminCardList :items="cardItems" @action="handleAction" />
  </div>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import { computed } from 'vue';
import { CircleCheck, CircleClose, View } from '@element-plus/icons-vue';

import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { ExchangeRow } from '../composables/mapper';
import { usePermission } from '@/composables/usePermission';

const props = defineProps<{ data: ExchangeRow[] }>();
const { canOperate } = usePermission();
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
      { label: '編號', value: row.id, strong: true },
      { label: '時間', value: row.time },
      { label: '代理', value: row.agent, subValue: row.code },
      { label: '支付資產', value: formatMoney(row.amount), subValue: row.asset, strong: true },
      { label: '比例', value: row.rate, strong: true },
      { label: '獲得USD', value: formatMoney(row.usd), strong: true },
    ],
    actions: [
      { key: 'view', label: '詳情', icon: View, type: 'primary', plain: true },
      {
        key: 'approve',
        label: '通過',
        icon: CircleCheck,
        type: 'primary',
        plain: true,
        visible: row.statusEffect === 'pending' && canOperate('cryptoExchange.review'),
      },
      {
        key: 'reject',
        label: '拒絕',
        icon: CircleClose,
        type: 'danger',
        plain: true,
        visible: row.statusEffect === 'pending' && canOperate('cryptoExchange.review'),
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
