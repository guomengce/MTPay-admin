<template>
  <AdminPanel title="业务详情" subtitle="对应业务的只读详情快照" :icon="Document">
    <dl class="transaction-business">
      <div v-for="item in fields" :key="item.label" :class="{ 'is-wide': item.wide }">
        <dt>{{ item.label }}</dt>
        <dd :class="{ 'is-mono': item.mono }">{{ item.value }}</dd>
      </div>
    </dl>
  </AdminPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Document } from '@element-plus/icons-vue';

import type { TransactionBusinessType } from '@/api/modules/transaction';
import AdminPanel from '@/components/admin/AdminPanel.vue';

interface FieldItem {
  label: string;
  value: string;
  wide?: boolean;
  mono?: boolean;
}

const props = defineProps<{
  businessType: TransactionBusinessType;
  detail: Record<string, unknown>;
}>();

function text(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return String(record.name ?? record.code ?? JSON.stringify(record));
  }
  return String(value);
}

function pick(record: Record<string, unknown>, keys: string[]): FieldItem[] {
  const items: FieldItem[] = [];
  for (const key of keys) {
    const value = record[key];
    if (value === null || value === undefined || value === '') continue;
    items.push({ label: key, value: text(value) });
  }
  return items;
}

const fields = computed<FieldItem[]>(() => {
  const d = props.detail;
  if (props.businessType === 'deposit') {
    const review = (d.review ?? {}) as Record<string, unknown>;
    return [
      ...pick(d, ['currency', 'network']),
      { label: '入金金额', value: text(d.amount), mono: true },
      { label: '交易哈希', value: text(d.txid), wide: true, mono: true },
      { label: '平台收款地址', value: text(d.receiving_address_snapshot), wide: true, mono: true },
      { label: '审核人', value: text(review.admin_name) },
      { label: '审核时间', value: text(review.reviewed_at) },
      { label: '审核说明', value: text(review.note), wide: true },
      { label: '入账时间', value: text(d.credited_at) },
      { label: '当前状态', value: text(d.status_name) },
    ].filter((item) => item.value !== '—');
  }
  if (props.businessType === 'exchange') {
    const review = (d.review ?? {}) as Record<string, unknown>;
    return [
      ...pick(d, ['source_currency', 'target_currency']),
      { label: '支付数量', value: text(d.source_amount), mono: true },
      { label: '采用比例', value: text(d.exchange_rate), mono: true },
      { label: '比例来源', value: text(d.rate_source_name) },
      { label: '获得金额', value: text(d.target_amount), mono: true },
      { label: '冻结时间', value: text(d.frozen_at) },
      { label: '审核人', value: text(review.admin_name) },
      { label: '审核时间', value: text(review.reviewed_at) },
      { label: '审核说明', value: text(review.note), wide: true },
      { label: '完成时间', value: text(d.completed_at) },
      { label: '当前状态', value: text(d.status_name) },
    ].filter((item) => item.value !== '—');
  }
  const payer = (d.payer ?? {}) as Record<string, unknown>;
  const payee = (d.payee ?? {}) as Record<string, unknown>;
  const review = (d.review ?? {}) as Record<string, unknown>;
  const payment = (d.payment ?? {}) as Record<string, unknown>;
  return [
    { label: '出金金额（实收）', value: text(d.amount), mono: true },
    { label: '固定手续费', value: text(d.fee_amount), mono: true },
    { label: '总扣款', value: text(d.total_amount), mono: true },
    { label: '付款人', value: text(payer.name), wide: true },
    { label: '付款人白名单编号', value: text(payer.whitelist_no), mono: true },
    { label: '收款人', value: text(payee.name), wide: true },
    { label: '收款人白名单编号', value: text(payee.whitelist_no), mono: true },
    { label: '审核人', value: text(review.admin_name) },
    { label: '审核时间', value: text(review.reviewed_at) },
    { label: '审核说明', value: text(review.note), wide: true },
    { label: '进入付款处理', value: text(payment.processing_at) },
    { label: '付款完成时间', value: text(payment.completed_at) },
    { label: '付款失败时间', value: text(payment.failed_at) },
    { label: '付款失败原因', value: text(payment.failure_reason), wide: true },
    { label: '当前状态', value: text(d.status_name) },
  ].filter((item) => item.value !== '—');
});
</script>

<style scoped lang="scss">
.transaction-business {
  display: grid;
  margin: 0;
  padding: 6px 24px 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 28px;

  > div {
    min-width: 0;
    padding: 13px 0;
    border-bottom: 1px dashed #dfe7ef;

    &.is-wide {
      grid-column: 1 / -1;
    }
  }

  dt {
    color: var(--app-text-label);
    font-size: 12px;
  }

  dd {
    margin: 5px 0 0;
    color: var(--app-text-body);
    font-size: 13px;
    font-weight: 600;
    line-height: 1.55;
    overflow-wrap: anywhere;

    &.is-mono {
      font-family: ui-monospace, Consolas, monospace;
    }
  }
}

@include mobile {
  .transaction-business {
    grid-template-columns: 1fr;
    padding: 4px 16px 16px;

    > div.is-wide {
      grid-column: auto;
    }
  }
}
</style>
