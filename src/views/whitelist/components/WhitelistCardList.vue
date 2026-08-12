<template>
  <div class="whitelist-card-list">
    <AdminCardList :items="cardItems" @action="handleCardAction" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CircleCheck, CircleClose, View } from '@element-plus/icons-vue';

import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { WhitelistRow } from './WhitelistTableList.vue';

const props = defineProps<{ data: WhitelistRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: WhitelistRow): void;
  (e: 'approve', row: WhitelistRow): void;
  (e: 'reject', row: WhitelistRow): void;
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
      { label: '类型', badge: { label: row.type, type: 'primary' } },
      { label: '主体', value: row.subject, subValue: row.country, strong: true },
      { label: '资料', value: row.bank, subValue: row.account, strong: true },
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
  })),
);

function handleCardAction(actionKey: string, itemKey: string) {
  const row = props.data.find((item) => item.id === itemKey);
  if (!row) return;

  if (actionKey === 'view') emit('view', row);
  if (actionKey === 'approve') emit('approve', row);
  if (actionKey === 'reject') emit('reject', row);
}
</script>

<style scoped lang="scss">
.whitelist-card-list {
  display: none;

  @include mobile {
    display: block;
  }
}
</style>
