<template>
  <div class="card-list">
    <AdminCardList
      :data="items"
      row-key="id"
      title="order_no"
      :subtitle="(row) => (row as FiatOrder).user.company_name"
      :status="status"
      :fields="fields"
      :actions="actions"
      @action="(_a, _k, row) => row && emit('view', (row as FiatOrder).id)"
    />
  </div>
</template>
<script setup lang="ts">
import { View } from '@element-plus/icons-vue';
import AdminCardList, {
  type AdminCardActionConfig,
  type AdminCardFieldConfig,
} from '@/components/admin/AdminCardList.vue';
import { formatMoney } from '@/utils/formatMoney';
import type { FiatOrder } from '@/api/modules/fiatDeposit';
defineProps<{ items: FiatOrder[] }>();
const emit = defineEmits<{ (e: 'view', id: number): void }>();
const status = (row: object) => {
  const r = row as FiatOrder;
  return {
    label: r.status_name,
    type:
      r.status === 1
        ? ('success' as const)
        : r.status === 2
          ? ('danger' as const)
          : ('warning' as const),
  };
};
const fields: AdminCardFieldConfig[] = [
  {
    label: '金额',
    value: (r) => `${formatMoney((r as FiatOrder).amount)} ${(r as FiatOrder).currency.code}`,
  },
  { label: '付款人', prop: 'payer_name' },
  { label: '参考号', prop: 'remittance_reference' },
];
const actions: AdminCardActionConfig[] = [
  { key: 'view', label: '查看详情', icon: View, type: 'primary', plain: true },
];
</script>
<style scoped lang="scss">
.card-list {
  display: none;
}
@include mobile {
  .card-list {
    display: block;
  }
}
</style>
