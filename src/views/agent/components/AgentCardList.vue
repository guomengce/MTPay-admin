<template>
  <div class="agent-card-list">
    <AdminCardList :items="cardItems" @action="handleAction" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Unlock, CircleCheck, Edit, VideoPause, View, SwitchButton } from '@element-plus/icons-vue';
import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { AgentAccount } from '@/api/modules/agent';
import type { AgentStatus } from './AgentTableList.vue';
import { usePermission } from '@/composables/usePermission';
import { useAuthStore } from '@/stores/modules/auth';

const props = defineProps<{ data: AgentAccount[] }>();
const { canOperate } = usePermission();
const authStore = useAuthStore();
const emit = defineEmits<{
  (e: 'disable-2fa', row: AgentAccount): void;
  (e: 'crypto', row: AgentAccount): void;
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
      { label: '電話', value: row.phone },
      ...(authStore.cryptoEnabled ? [{ label: '數字貨幣', badge: { label: row.crypto_enabled ? '已開啟' : '未開啟', type: row.crypto_enabled ? 'success' as const : 'gray' as const } }] : []),
      { label: '2FA', badge: { label: row.two_factor_enabled ? '已開啟' : '未開啟', type: row.two_factor_enabled ? 'success' : 'warning' } },
      { label: '創建時間', value: row.created_at || '—' },
    ],
    actions: [
      { key: 'detail', label: '詳情', icon: View, type: 'primary', plain: true },
      ...(authStore.cryptoEnabled && canOperate('agents.cryptoToggle') ? [{ key: 'crypto', label: row.crypto_enabled ? '關閉數字貨幣' : '開啓數字貨幣', icon: SwitchButton, type: 'primary' as const, plain: true }] : []),
      ...(canOperate('agents.disable2fa') ? [{ key: 'disable-2fa', label: '關閉 2FA', icon: Unlock, type: 'warning' as const, plain: true }] : []),
      ...(canOperate('agents.edit') ? [{ key: 'edit', label: '修改', icon: Edit, type: 'warning' as const, plain: true }] : []),
      ...(canOperate('agents.status') && row.status === 1
          ? [{ key: 'status-2', label: '凍結', icon: VideoPause, type: 'warning' as const, plain: true }]
          : canOperate('agents.status') && row.status === 2
            ? [{ key: 'status-1', label: '恢復正常', icon: CircleCheck, type: 'primary' as const, plain: true }]
            : []),
    ],
  })),
);

function handleAction(actionKey: string, itemKey: string) {
  const row = props.data.find((item) => String(item.id) === itemKey);
  if (!row) return;

  if (actionKey === 'disable-2fa') emit('disable-2fa', row);
  if (actionKey === 'crypto') emit('crypto', row);
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
