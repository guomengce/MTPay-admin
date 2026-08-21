<template>
  <div class="transaction-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="订单号" min-width="200">
        <template #default="{ row }">
          <a class="text-link" href="javascript:void(0)" @click.prevent="emit('view', row)">
            {{ row.order_no }}
          </a>
          <small class="transaction-time">{{ row.submitted_at || '—' }}</small>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="90">
        <template #default="{ row }">
          <span class="type-chip" :class="`is-${row.business_type}`">{{ row.business_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.user.company_name }}</strong>
            <span>{{ row.user.agent_code }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="320" align="center" header-align="center">
        <template #default="{ row }">
          <WithdrawalPartyFlow
            v-if="row.business_type === 'withdrawal'"
            :payer-name="row.payer_name"
            :payee-name="row.payee_name"
          />
          <div v-else-if="row.business_type === 'exchange'" class="transaction-content is-exchange">
            <div class="transaction-content__exchange-flow">
              <strong>{{ row.currency_code }}</strong>
              <FlowArrow />
              <strong>{{ row.target_currency_code || '—' }}</strong>
            </div>
            <small>兑换比例：{{ formatExchangeRate(row.exchange_rate) || '—' }}</small>
          </div>
          <span v-else class="transaction-content">{{ contentLabel(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" min-width="220">
        <template #default="{ row }">
          <div class="transaction-amount">
            <strong>{{ row.amount }} {{ row.currency_code }}</strong>
            <small v-if="row.business_type === 'withdrawal'">
              总扣款 {{ row.total_amount || '—' }} {{ row.currency_code }}
            </small>
            <small v-else-if="row.business_type === 'exchange'">
              获得 {{ row.target_amount || '—' }} {{ row.target_currency_code || '' }}
            </small>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="120">
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
          <el-button type="primary" plain size="small" :icon="View" @click="emit('view', row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { View } from '@element-plus/icons-vue';

import type { TransactionItem } from '@/api/modules/transaction';
import StatusBadge, { type StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import FlowArrow from '@/components/common/FlowArrow.vue';
import { formatExchangeRate } from '@/utils/decimal';
import WithdrawalPartyFlow from '@/views/withdrawal/components/WithdrawalPartyFlow.vue';

defineProps<{ data: TransactionItem[]; loading?: boolean }>();
const emit = defineEmits<{ (e: 'view', row: TransactionItem): void }>();

function contentLabel(row: TransactionItem) {
  if (row.business_type === 'deposit') {
    return [row.currency_code, row.network_code].filter(Boolean).join(' · ');
  }
  return [row.payer_name, row.payee_name].filter(Boolean).join(' → ') || '—';
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
