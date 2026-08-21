<template>
  <div v-loading="loading" class="currency-card-list">
    <AdminCardList v-if="data.length" :items="cardItems" @action="handleAction" />
    <el-empty v-else-if="!loading" description="暂无币种网络关系" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CircleCheck, CircleClose, Edit, View } from '@element-plus/icons-vue';
import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { CurrencyNetwork } from '@/api/modules/currency';

type CardAction = 'detail' | 'set-address' | 'toggle-status';

const props = defineProps<{ data: CurrencyNetwork[]; loading: boolean }>();
const emit = defineEmits<{
  (event: 'detail', row: CurrencyNetwork): void;
  (event: 'set-address', row: CurrencyNetwork): void;
  (event: 'toggle-status', row: CurrencyNetwork): void;
}>();

const cardItems = computed<AdminCardItem[]>(() =>
  props.data.map((row) => ({
    key: String(row.id),
    title: `${row.currency.name} / ${row.network.name}`,
    subtitle: `${row.currency.code} · ${row.network.code}`,
    status: { label: row.status_name, type: row.status === 1 ? 'success' : 'danger' },
    fields: [
      {
        label: '当前地址',
        value: row.current_receiving_address?.address ?? '暂未设置',
        mono: !!row.current_receiving_address,
      },
      { label: '是否有效', value: row.is_effective ? '有效' : '无效' },
      { label: '更新时间', value: row.updated_at || '—' },
    ],
    actions: [
      { key: 'detail' as CardAction, label: '详情', icon: View, type: 'primary', plain: true },
      {
        key: 'set-address' as CardAction,
        label: row.current_receiving_address ? '更换地址' : '设置地址',
        icon: Edit,
        type: 'warning',
        plain: true,
      },
      {
        key: 'toggle-status' as CardAction,
        label: row.status === 1 ? '禁用' : '启用',
        icon: row.status === 1 ? CircleClose : CircleCheck,
        type: row.status === 1 ? 'danger' : 'primary',
        plain: true,
      },
    ],
  })),
);

function handleAction(actionKey: string, itemKey: string) {
  const row = props.data.find((item) => String(item.id) === itemKey);
  if (!row) return;
  if (actionKey === 'detail') emit('detail', row);
  else if (actionKey === 'set-address') emit('set-address', row);
  else if (actionKey === 'toggle-status') emit('toggle-status', row);
}
</script>

<style scoped lang="scss">
.currency-card-list {
  display: none;

  @include mobile {
    display: block;
  }
}
</style>
