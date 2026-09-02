<template>
  <div class="transaction-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="訂單號" min-width="250" class-name="transaction-order-cell">
        <template #default="{ row }">
          <strong>{{ row.order_no }}</strong>
          <small class="transaction-time">{{ row.submitted_at || '—' }}</small>
        </template>
      </el-table-column>
      <el-table-column label="類型" min-width="150">
        <template #default="{ row }">
          <span class="type-chip" :class="`is-${row.business_type}`">{{ businessLabel(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.user.company_name }}</strong>
            <span>{{ row.user.email }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="內容" min-width="320" align="center" header-align="center">
        <template #default="{ row }">
          <WithdrawalPartyFlow
            v-if="row.business_type === 'withdrawal'"
            :payer-name="row.payer_name"
            :payer-type="entityTypeLabel(row.payer_entity_type_name, row.payer_entity_type)"
            :payee-name="row.payee_name"
            :payee-type="entityTypeLabel(row.payee_entity_type_name, row.payee_entity_type)"
          />
          <div v-else-if="row.business_type === 'exchange'" class="transaction-content is-exchange">
            <div class="transaction-content__exchange-flow">
              <strong>{{ row.currency_code }}</strong>
              <FlowArrow />
              <strong>{{ row.target_currency_code || '—' }}</strong>
            </div>
            <small>數字貨幣兌換比例：{{ formatExchangeRate(row.exchange_rate) || '—' }}</small>
          </div>
          <span v-else class="transaction-content">{{ contentLabel(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金額" min-width="220">
        <template #default="{ row }">
          <div class="transaction-amount">
            <strong>{{ displayAmount(row) }}</strong>
            <small v-if="row.business_type === 'withdrawal'">
              總扣款 {{ formatMoney(row.total_amount || '—') }} {{ row.currency_code }}
            </small>
            <small v-else-if="row.business_type === 'exchange'">
              獲得 {{ formatMoney(row.target_amount || '—') }} {{ row.target_currency_code || '' }}
            </small>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="狀態" min-width="120">
        <template #default="{ row }">
          <StatusBadge
            :label="row.status_name"
            :type="statusType(row)"
            :effect="statusEffect(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" fixed="right" align="center">
        <template #default="{ row }">
          <el-button v-if="businessDetailRoute(row)" type="primary" plain size="small" :icon="View" @click="emit('view', row)">
            詳情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import { businessDetailRoute } from '../businessDetailRoute';
import { View } from '@element-plus/icons-vue';

import type { TransactionItem } from '@/api/modules/transaction';
import StatusBadge, { type StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import FlowArrow from '@/components/common/FlowArrow.vue';
import { formatExchangeRate } from '@/utils/decimal';
import WithdrawalPartyFlow from '@/views/withdrawal/components/WithdrawalPartyFlow.vue';

defineProps<{ data: TransactionItem[]; loading?: boolean }>();
const emit = defineEmits<{ (e: 'view', row: TransactionItem): void }>();

function contentLabel(row: TransactionItem) {
  if (row.business_type === 'manual_increase' || row.business_type === 'manual_decrease') return '—';
  if (row.business_type === 'deposit') {
    return [row.currency_code, row.network_code].filter(Boolean).join(' · ');
  }
  return [row.payer_name, row.payee_name].filter(Boolean).join(' → ') || '—';
}

function businessLabel(row: TransactionItem) {
  if (row.business_type === 'deposit') return '數字貨幣入金';
  if (row.business_type === 'exchange') return '數字貨幣兌換';
  if (row.business_type === 'withdrawal') return '法幣出金';
  return row.business_name;
}

function displayAmount(row: TransactionItem) {
  const prefix = row.business_type === 'manual_increase' ? '+' : row.business_type === 'manual_decrease' ? '-' : '';
  return `${prefix}${formatMoney(row.amount)} ${row.currency_code}`;
}

function entityTypeLabel(name?: string | null, type?: 1 | 2 | null) {
  return name || (type === 1 ? '公司' : type === 2 ? '個人' : undefined);
}

function statusType(row: TransactionItem): StatusBadgeType {
  const group = row.status_group;
  if (group === 'completed') return 'success';
  if (group === 'rejected') return 'danger';
  if (group === 'failed') return 'gray';
  if (group === 'processing') return 'primary';
  return 'warning';
}

function statusEffect(row: TransactionItem) {
  return row.status_group === 'pending' || row.status_group === 'needs_supplement'
    ? 'pending'
    : undefined;
}
</script>

<style scoped lang="scss">
.transaction-table-list {
  display: block;

  .type-chip {
    &.is-withdrawal {
      color: #0a7f7a;
      background: #e4f6f2;
    }

    &.is-exchange {
      color: #b45309;
      background: #fef3c7;
    }

    &.is-manual_increase { color: #047857; background: #dff7ec; }
    &.is-manual_decrease { color: #dc2626; background: #fee2e2; }
  }
}

@include mobile {
  .transaction-table-list { display: none; }
}

.transaction-time {
  display: block;
  margin-top: 5px;
  color: var(--app-text-label);
  font-size: 12px;
}

:deep(.transaction-order-cell .cell) {
  white-space: nowrap;
}

:deep(.transaction-order-cell .text-link) {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
  white-space: nowrap;
}

.transaction-content {
  color: var(--app-text-body);
  font-size: 13px;
  font-weight: 500;
  text-align: center;

  &.is-exchange {
    display: grid;
    gap: 5px;

    strong {
      color: var(--app-text-body);
      font-size: 13px;
      font-weight: 600;
      text-align: center;
    }

    small {
      color: var(--app-text-label);
      font-size: 11px;
      text-align: center;
    }
  }

  &__exchange-flow {
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: minmax(48px, auto) 32px minmax(48px, auto);
    gap: 10px;

    > strong:first-child {
      text-align: right;
    }

    > strong:last-child {
      text-align: left;
    }
  }
}

.transaction-amount {
  display: grid;
  gap: 5px;

  strong {
    color: var(--app-text-heading);
    font-size: 15px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  small {
    color: var(--app-text-label);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }
}
</style>
