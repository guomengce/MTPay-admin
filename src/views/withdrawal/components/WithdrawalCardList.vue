<template>
  <div class="withdrawal-card-list">
    <AdminCardList :items="cardItems" @action="handleCardAction" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CircleCheck, View } from '@element-plus/icons-vue';

import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { WithdrawalRow } from './WithdrawalTableList.vue';

const props = defineProps<{ data: WithdrawalRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: WithdrawalRow): void;
  (e: 'complete', row: WithdrawalRow): void;
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
    pending: row.statusEffect === 'pending',
    fields: [
      { label: '编号', value: row.id, strong: true },
      { label: '时间', value: row.time },
      { label: '代理', value: row.agent, strong: true },
      { label: '关系', badge: { label: row.relation, type: 'primary' }, subValue: row.parties },
      { label: '收款', value: row.amount, strong: true },
      { label: '费用', value: row.fee, strong: true },
    ],
    actions: [
      { key: 'view', label: '详情', icon: View, plain: true },
      {
        key: 'complete',
        label: '付款完成',
        icon: CircleCheck,
        type: 'primary',
        plain: true,
        visible: row.statusEffect === 'pending',
      },
    ],
  })),
);

function handleCardAction(actionKey: string, itemKey: string) {
  const row = props.data.find((item) => item.id === itemKey);
  if (!row) return;

  if (actionKey === 'view') emit('view', row);
  if (actionKey === 'complete') emit('complete', row);
}
</script>

<style scoped lang="scss">
.withdrawal-card-list {
  display: none;

  @include mobile {
    display: block;
  }
}
</style>
