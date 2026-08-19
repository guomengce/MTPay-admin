<template>
  <div class="withdrawal-card-list">
    <AdminCardList :items="cardItems" @action="handleAction" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CircleCheck, CircleClose, CreditCard, DocumentAdd, Upload, View } from '@element-plus/icons-vue';

import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { WithdrawalPaymentResult } from '@/api/modules/withdrawal';
import type { WithdrawalRow } from '../composables/mapper';

const props = defineProps<{ data: WithdrawalRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: WithdrawalRow): void;
  (e: 'approve', row: WithdrawalRow): void;
  (e: 'reject', row: WithdrawalRow): void;
  (e: 'supplement', row: WithdrawalRow): void;
  (e: 'payment', payload: { row: WithdrawalRow; result: WithdrawalPaymentResult }): void;
  (e: 'append', row: WithdrawalRow): void;
}>();

const cardItems = computed<AdminCardItem[]>(() =>
  props.data.map((row) => {
    const actions: AdminCardItem['actions'] = [
      { key: 'view', label: '详情', icon: View, type: 'primary', plain: true },
    ];
    if (row.statusCode === 0) {
      actions.unshift(
        { key: 'approve', label: '通过', icon: CircleCheck, type: 'success', plain: true },
        { key: 'reject', label: '驳回', icon: CircleClose, type: 'danger', plain: true },
        { key: 'supplement', label: '要求补件', icon: DocumentAdd, type: 'warning', plain: true },
      );
    } else if (row.statusCode === 1) {
      actions.unshift({ key: 'reject', label: '驳回', icon: CircleClose, type: 'danger', plain: true });
    } else if (row.statusCode === 2) {
      actions.unshift(
        { key: 'pay-complete', label: '付款完成', icon: CreditCard, type: 'success', plain: true },
        { key: 'pay-fail', label: '付款失败', icon: CircleClose, type: 'danger', plain: true },
      );
    } else if (row.statusCode === 3) {
      actions.unshift({ key: 'append', label: '追加凭证', icon: Upload, type: 'primary', plain: true });
    }

    return {
      key: String(row.businessId),
      title: row.id,
      subtitle: row.time,
      status: {
        label: row.status,
        type: row.statusType,
        effect: row.statusEffect,
      },
      pending: row.statusCode === 0 || row.statusCode === 1 || row.statusCode === 2,
      fields: [
        { label: '代理', value: row.agent, subValue: row.agentCode, strong: true },
        { label: '付款人', value: `${row.payerType} · ${row.payer}`, subValue: row.payerNo },
        { label: '收款人', value: `${row.payeeType} · ${row.payee}`, subValue: row.payeeNo },
        { label: '出金金额', value: `${row.amount} ${row.currency}`, subValue: '收款人实收', strong: true },
        {
          label: '总扣款',
          value: `${row.totalAmount} ${row.currency}`,
          subValue: `含手续费 ${row.feeAmount} ${row.currency}`,
        },
      ],
      actions,
    };
  }),
);

function handleAction(actionKey: string, itemKey: string) {
  const row = props.data.find((item) => String(item.businessId) === itemKey);
  if (row && actionKey === 'view') emit('view', row);
  if (row && actionKey === 'approve') emit('approve', row);
  if (row && actionKey === 'reject') emit('reject', row);
  if (row && actionKey === 'supplement') emit('supplement', row);
  if (row && actionKey === 'pay-complete') emit('payment', { row, result: 'complete' });
  if (row && actionKey === 'pay-fail') emit('payment', { row, result: 'fail' });
  if (row && actionKey === 'append') emit('append', row);
}
</script>

<style scoped lang="scss">
.withdrawal-card-list {
  display: none;

  :deep(.admin-card-list__item.is-pending) {
    border-color: #bfe3de;
    box-shadow: 0 8px 24px rgb(10 127 122 / 8%);
  }

  @include mobile {
    display: block;
  }
}
</style>
