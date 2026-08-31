<template>
  <div class="agent-card-list">
    <AdminCardList :items="cardItems" @action="handleAction" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Unlock, CircleCheck, Edit, VideoPause, View } from '@element-plus/icons-vue';
import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { AgentAccount } from '@/api/modules/agent';
import type { AgentStatus } from './AgentTableList.vue';

const props = defineProps<{ data: AgentAccount[] }>();
const emit = defineEmits<{
  (e: 'disable-2fa', row: AgentAccount): void;
  (e: 'detail', row: AgentAccount): void;
  (e: 'edit', row: AgentAccount): void;
  (e: 'status', row: AgentAccount, status: AgentStatus): void;
}>();

const cardItems = computed<AdminCardItem[]>(() =>
  props.data.map((row) => ({
    key: String(row.id),
    title: row.company_name,
    subtitle: row.email,
    status: { label: row.status_name, type: row.status === 1 ? 'success' : row.status === 3 ? 'danger' : 'warning' },
    fields: [
      { label: 'Email', value: row.email },
      { label: '电话', value: row.phone },
      { label: '创建时间', value: row.created_at || '—' },
    ],
    actions: [
      { key: 'disable-2fa', label: '關閉 2FA', icon: Unlock, type: 'warning', plain: true },
      { key: 'detail', label: '详情', icon: View, type: 'primary', plain: true },
      { key: 'edit', label: '修改', icon: Edit, type: 'warning', plain: true },
      ...(row.status === 1
          ? [{ key: 'status-2', label: '暂停', icon: VideoPause, type: 'warning' as const, plain: true }]
          : row.status === 2
            ? [{ key: 'status-1', label: '恢复正常', icon: CircleCheck, type: 'primary' as const, plain: true }]
            : []),
    ],
  })),
);

function handleAction(actionKey: string, itemKey: string) {
  const row = props.data.find((item) => String(item.id) === itemKey);
  if (!row) return;

  if (actionKey === 'disable-2fa') emit('disable-2fa', row);
  if (actionKey === 'detail') emit('detail', row);
  if (actionKey === 'edit') emit('edit', row);
  if (actionKey.startsWith('status-')) {
    emit('status', row, Number(actionKey.slice(7)) as AgentStatus);
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
