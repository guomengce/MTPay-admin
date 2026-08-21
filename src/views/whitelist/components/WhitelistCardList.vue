<template>
  <div class="whitelist-card-list">
    <AdminCardList :items="cardItems" @action="handleCardAction" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CircleCheck, CircleClose, DocumentAdd, View } from '@element-plus/icons-vue';

import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import type { WhitelistRow } from '../composables/mapper';

const props = defineProps<{ data: WhitelistRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: WhitelistRow): void;
  (e: 'approve', row: WhitelistRow): void;
  (e: 'reject', row: WhitelistRow): void;
  (e: 'supplement', row: WhitelistRow): void;
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
      { label: '编号', value: row.id, strong: true },
      { label: '时间', value: row.time },
      { label: '代理', value: row.agent, subValue: row.agentCode, strong: true },
      { label: '类型', badge: { label: row.type, type: identityBadgeType(row) } },
      { label: '主体', value: row.subject, subValue: row.country, strong: true },
      { label: '附件', value: `${row.fileCount} 个` },
    ],
    actions: [
      { key: 'view', label: '详情', icon: View, type: 'primary', plain: true },
      {
        key: 'approve',
        label: '通过',
        icon: CircleCheck,
        type: 'primary',
        plain: true,
        visible: row.statusCode === 0,
      },
      {
        key: 'supplement',
        label: '补件',
        icon: DocumentAdd,
        type: 'warning',
        plain: true,
        visible: row.statusCode === 0,
      },
      {
        key: 'reject',
        label: '拒绝',
        icon: CircleClose,
        type: 'danger',
        plain: true,
        visible: row.statusCode === 0 || row.statusCode === 1,
      },
    ],
  })),
);

function identityBadgeType(row: WhitelistRow): StatusBadgeType {
  if (row.role === '付款人' && row.entityType === '公司') return 'primary';
  if (row.role === '付款人' && row.entityType === '个人') return 'warning';
  if (row.role === '收款人' && row.entityType === '公司') return 'mt';
  return 'success';
}

function handleCardAction(actionKey: string, itemKey: string) {
  const row = props.data.find((item) => item.id === itemKey);
  if (!row) return;

  if (actionKey === 'view') emit('view', row);
  if (actionKey === 'approve') emit('approve', row);
  if (actionKey === 'reject') emit('reject', row);
  if (actionKey === 'supplement') emit('supplement', row);
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
