<template>
  <div class="agent-card-list">
    <AdminCardList :items="cardItems" @action="handleAction" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Edit, Setting } from '@element-plus/icons-vue';

import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { AgentRow } from './AgentTableList.vue';

const props = defineProps<{ data: AgentRow[] }>();
const emit = defineEmits<{
  (e: 'edit', row: AgentRow): void;
  (e: 'settings', row: AgentRow): void;
}>();

const cardItems = computed<AdminCardItem[]>(() =>
  props.data.map((row) => ({
    key: row.code,
    title: row.name,
    subtitle: row.code,
    status: { label: '正常使用', type: 'success' },
    fields: [
      { label: 'Email', value: row.email },
      { label: '电话', value: row.phone },
      { label: 'USDT比例', badge: { label: row.usdt, type: 'mt' } },
      { label: 'USDC比例', badge: { label: row.usdc, type: 'primary' } },
      { label: 'USD可用', value: row.balance, strong: true },
    ],
    actions: [
      { key: 'edit', label: '编辑', icon: Edit, plain: true },
    ],
  })),
);

function handleAction(actionKey: string, itemKey: string) {
  const row = props.data.find((item) => item.code === itemKey);
  if (!row) return;

  if (actionKey === 'edit') {
    emit('edit', row);
    return;
  }

  if (actionKey === 'settings') {
    emit('settings', row);
  }
}
</script>

<style scoped lang="scss">
.agent-card-list {
  display: none;

  @include mobile {
    display: block;
  }
}
</style>
