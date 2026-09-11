<template>
  <div class="whitelist-card-list">
    <AdminCardList :items="cardItems" @action="handleCardAction" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CircleCheck, CircleClose, DocumentAdd, SwitchButton, View } from '@element-plus/icons-vue';

import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import { getIdentityBadgeType } from '@/utils/identityBadge';
import type { WhitelistRow } from '../composables/mapper';
import { usePermission } from '@/composables/usePermission';

const props = defineProps<{ data: WhitelistRow[] }>();
const { canOperate } = usePermission();
const emit = defineEmits<{
  (e: 'view', row: WhitelistRow): void;
  (e: 'approve', row: WhitelistRow): void;
  (e: 'reject', row: WhitelistRow): void;
  (e: 'supplement', row: WhitelistRow): void;
  (e: 'toggle-status', row: WhitelistRow): void;
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
    pending: row.statusCode === 0 || row.statusCode === 1,
    fields: [
      { label: '編號', value: row.id, strong: true },
      { label: '時間', value: row.time },
      { label: '代理', value: row.agent, subValue: row.agentEmail, strong: true },
      { label: '類型', badge: { label: row.type, type: identityBadgeType(row) } },
      { label: '主體', value: row.subject, subValue: row.country, strong: true },
      { label: '附件', value: `${row.fileCount} 個` },
    ],
    actions: [
      { key: 'view', label: '詳情', icon: View, type: 'primary', plain: true },
      {
        key: 'approve',
        label: '通過',
        icon: CircleCheck,
        type: 'primary',
        plain: true,
        visible: (row.statusCode === 0 || row.statusCode === 1) && canOperate('whitelist.review'),
      },
      {
        key: 'supplement',
        label: '補件',
        icon: DocumentAdd,
        type: 'warning',
        plain: true,
        visible: row.statusCode === 0 && canOperate('whitelist.supplement'),
      },
      {
        key: 'reject',
        label: '拒絕',
        icon: CircleClose,
        type: 'danger',
        plain: true,
        visible: (row.statusCode === 0 || row.statusCode === 1) && canOperate('whitelist.review'),
      },
      {
        key: 'toggle-status',
        label: row.statusCode === 2 ? '停用' : '啟用',
        icon: SwitchButton,
        type: row.statusCode === 2 ? 'danger' : 'success',
        plain: true,
        visible: (row.statusCode === 2 || row.statusCode === 4) && canOperate('whitelist.review'),
      },
    ],
  })),
);

function identityBadgeType(row: WhitelistRow): StatusBadgeType {
  return getIdentityBadgeType(row.role, row.entityType);
}

function handleCardAction(actionKey: string, itemKey: string) {
  const row = props.data.find((item) => item.id === itemKey);
  if (!row) return;

  if (actionKey === 'view') emit('view', row);
  if (actionKey === 'approve') emit('approve', row);
  if (actionKey === 'reject') emit('reject', row);
  if (actionKey === 'supplement') emit('supplement', row);
  if (actionKey === 'toggle-status') emit('toggle-status', row);
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
