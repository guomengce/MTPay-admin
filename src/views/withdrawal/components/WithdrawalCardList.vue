<template>
  <div class="withdrawal-card-list">
    <AdminCardList :items="cardItems" @action="handleAction" />
  </div>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import { computed } from 'vue';
import {
  CircleCheck,
  CircleClose,
  CreditCard,
  DocumentAdd,
  Upload,
  View,
} from '@element-plus/icons-vue';

import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { WithdrawalPaymentResult } from '@/api/modules/withdrawal';
import type { WithdrawalRow } from '../composables/mapper';
import { usePermission } from '@/composables/usePermission';
import { getRiskLevel, getRiskStatus } from '@/views/risk/presentation';

const props = defineProps<{ data: WithdrawalRow[] }>();
const { canOperate } = usePermission();
const emit = defineEmits<{
  (e: 'cancel-completed', row: WithdrawalRow): void;
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
      { key: 'view', label: '詳情', icon: View, type: 'primary', plain: true },
    ];
    if (row.statusCode === 0 && !row.riskBlocked) {
      if (canOperate('fiatWithdrawal.review')) {
        actions.push(
          { key: 'approve', label: '通過', icon: CircleCheck, type: 'primary', plain: true },
          { key: 'reject', label: '駁回', icon: CircleClose, type: 'danger', plain: true },
        );
      }
      if (canOperate('fiatWithdrawal.supplement')) {
        actions.push({
          key: 'supplement',
          label: '要求補件',
          icon: DocumentAdd,
          type: 'warning',
          plain: true,
        });
      }
    } else if (row.statusCode === 1 && !row.riskBlocked && canOperate('fiatWithdrawal.review')) {
      actions.push({
        key: 'reject',
        label: '駁回',
        icon: CircleClose,
        type: 'danger',
        plain: true,
      });
    } else if (row.statusCode === 2 && !row.riskBlocked && canOperate('fiatWithdrawal.payment')) {
      actions.push(
        { key: 'pay-complete', label: '付款完成', icon: CreditCard, type: 'primary', plain: true },
        { key: 'pay-fail', label: '付款失敗', icon: CircleClose, type: 'danger', plain: true },
      );
    } else if (row.statusCode === 3 && canOperate('fiatWithdrawal.appendProof')) {
      actions.push({
        key: 'append',
        label: '追加憑證',
        icon: Upload,
        type: 'primary',
        plain: true,
      });
    }
    if (row.statusCode === 3 && canOperate('fiatWithdrawal.cancel')) {
      actions.push({
        key: 'cancel-completed',
        label: '取消法幣出金',
        icon: CircleClose,
        type: 'danger',
        plain: true,
      });
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
        { label: '代理', value: row.agent, subValue: row.agentEmail, strong: true },
        { label: '付款人', value: `${row.payerType} · ${row.payer}`, subValue: row.payerNo },
        { label: '收款人', value: `${row.payeeType} · ${row.payee}`, subValue: row.payeeNo },
        {
          label: '法幣出金金額',
          value: `${formatMoney(row.amount)} ${row.currency}`,
          subValue: '收款人實收',
          strong: true,
        },
        { label: '總扣款', value: `${formatMoney(row.totalAmount)} ${row.currency}` },
        { label: '風險等級', badge: getRiskLevel(row.riskLevel) },
        {
          label: '風控狀態',
          value: getRiskStatus(row.riskStatus),
          subValue: [
            row.riskCaseId ? `案件 ${row.riskCaseNo}` : '',
            row.riskHitCount ? `${row.riskHitCount} 項命中` : '',
          ]
            .filter(Boolean)
            .join(' · '),
        },
      ],
      actions,
    };
  }),
);

function handleAction(actionKey: string, itemKey: string) {
  const row = props.data.find((item) => String(item.businessId) === itemKey);
  if (row && row.statusCode === 3 && actionKey === 'cancel-completed')
    emit('cancel-completed', row);
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
