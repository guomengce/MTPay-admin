<template>
  <div class="transaction-card-list">
    <AdminCardList :items="items" @action="handleAction" />
  </div>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import { computed } from 'vue';
import { businessDetailRoute } from '../businessDetailRoute';
import { View } from '@element-plus/icons-vue';

import type { TransactionItem } from '@/api/modules/transaction';
import AdminCardList, { type AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import { formatExchangeRate } from '@/utils/decimal';

const props = defineProps<{ data: TransactionItem[] }>();
const emit = defineEmits<{ (e: 'view', row: TransactionItem): void }>();

const items = computed<AdminCardItem[]>(() =>
  props.data.map((row) => ({
    key: row.transaction_key,
    title: row.order_no,
    subtitle: row.submitted_at || '—',
    status: {
      label: row.status_name,
      type: statusType(row),
      effect: isPending(row) ? 'pending' : undefined,
    },
    pending: isPending(row),
    fields: [
      { label: '類型', badge: { label: businessLabel(row), type: businessType(row) } },
      { label: '代理', value: row.user.company_name, subValue: row.user.email, strong: true },
      { label: '交易內容', value: contentLabel(row), strong: true },
      { label: '金額', value: displayAmount(row), subValue: amountSubValue(row), strong: true },
    ],
    actions: businessDetailRoute(row) ? [{ key: 'view', label: '查看詳情', icon: View, type: 'primary', plain: true }] : [],
  })),
);

function isPending(row: TransactionItem) {
  return row.status_group === 'pending' || row.status_group === 'needs_supplement';
}

function statusType(row: TransactionItem): StatusBadgeType {
  if (row.status_group === 'completed') return 'success';
  if (row.status_group === 'rejected') return 'danger';
  if (row.status_group === 'failed') return 'gray';
  if (row.status_group === 'processing') return 'primary';
  return 'warning';
}

function businessType(row: TransactionItem): StatusBadgeType {
  if (row.business_type === 'deposit') return 'success';
  if (row.business_type === 'exchange') return 'warning';
  if (row.business_type === 'manual_increase') return 'success';
  if (row.business_type === 'manual_decrease') return 'danger';
  return 'primary';
}

function businessLabel(row: TransactionItem) {
  if (row.business_type === 'deposit') return '數字貨幣入金';
  if (row.business_type === 'exchange') return '數字貨幣兌換';
  if (row.business_type === 'withdrawal') return '法幣出金';
  return row.business_name;
}

function contentLabel(row: TransactionItem) {
  if (row.business_type === 'manual_increase' || row.business_type === 'manual_decrease') return '—';
  if (row.business_type === 'withdrawal') {
    const payer = partyLabel(row.payer_name, row.payer_entity_type_name, row.payer_entity_type);
    const payee = partyLabel(row.payee_name, row.payee_entity_type_name, row.payee_entity_type);
    return [payer, payee].filter(Boolean).join(' → ') || '—';
  }
  if (row.business_type === 'exchange') {
    const rate = formatExchangeRate(row.exchange_rate);
    return `${row.currency_code} → ${row.target_currency_code || '—'}${rate ? ` · 數字貨幣兌換比例 ${rate}` : ''}`;
  }
  return [row.currency_code, row.network_code].filter(Boolean).join(' · ');
}

function partyLabel(name?: string | null, typeName?: string | null, type?: 1 | 2 | null) {
  const entity = typeName || (type === 1 ? '公司' : type === 2 ? '個人' : '');
  return [name, entity].filter(Boolean).join(' · ');
}

function amountSubValue(row: TransactionItem) {
  if (row.business_type === 'withdrawal') return `總扣款 ${formatMoney(row.total_amount || '—')} ${row.currency_code}`;
  if (row.business_type === 'exchange') return `獲得 ${formatMoney(row.target_amount || '—')} ${row.target_currency_code || ''}`;
  return undefined;
}

function displayAmount(row: TransactionItem) {
  const prefix = row.business_type === 'manual_increase' ? '+' : row.business_type === 'manual_decrease' ? '-' : '';
  return `${prefix}${formatMoney(row.amount)} ${row.currency_code}`;
}

function handleAction(actionKey: string, itemKey: string) {
  if (actionKey !== 'view') return;
  const row = props.data.find((item) => item.transaction_key === itemKey);
  if (row) emit('view', row);
}
</script>

<style scoped lang="scss">
.transaction-card-list { display: none; }
@include mobile { .transaction-card-list { display: block; } }
</style>
