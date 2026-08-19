<template>
  <div class="transaction-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="提交时间" min-width="150">
        <template #default="{ row }">{{ row.submitted_at || '—' }}</template>
      </el-table-column>
      <el-table-column label="类型" min-width="90">
        <template #default="{ row }">
          <span class="type-chip" :class="`is-${row.business_type}`">{{ row.business_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" min-width="180">
        <template #default="{ row }">
          <a class="text-link" href="javascript:void(0)" @click.prevent="emit('view', row)">
            {{ row.order_no }}
          </a>
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
      <el-table-column label="内容" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">{{ contentLabel(row) }}</template>
      </el-table-column>
      <el-table-column label="金额" min-width="200" align="right">
        <template #default="{ row }">
          <div class="row-title is-right">
            <strong>{{ amountLabel(row) }}</strong>
            <span v-if="row.business_type === 'withdrawal'">总扣款 {{ row.total_amount }} USD</span>
            <span v-else-if="row.business_type === 'exchange'">
              获得 {{ row.target_amount }} {{ row.target_currency_code }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="120">
        <template #default="{ row }">
          <StatusBadge :label="row.status_name" :type="statusType(row)" :effect="statusEffect(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" fixed="right" align="center">
        <template #default="{ row }">
          <el-button type="primary" plain size="small" :icon="View" @click="emit('view', row)">
            查看详情
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

defineProps<{ data: TransactionItem[]; loading?: boolean }>();
const emit = defineEmits<{ (e: 'view', row: TransactionItem): void }>();

function contentLabel(row: TransactionItem) {
  if (row.business_type === 'deposit') {
    return [row.currency_code, row.network_code].filter(Boolean).join(' · ');
  }
  if (row.business_type === 'exchange') {
    return `${row.currency_code} → ${row.target_currency_code}`;
  }
  return [row.payer_name, row.payee_name].filter(Boolean).join(' → ');
}

function amountLabel(row: TransactionItem) {
  if (row.business_type === 'exchange') {
    return `${row.amount} ${row.currency_code}`;
  }
  return `${row.amount} ${row.currency_code}`;
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
  return row.status_group === 'pending' || row.status_group === 'needs_supplement' ? 'pending' : undefined;
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

  .row-title.is-right {
    align-items: flex-end;
  }
}
</style>
