<template>
  <AdminPanel
    title="交易记录"
    :icon="Tickets"
  >
    <template #extra>
      <el-button :icon="Refresh" @click="emit('refresh')">刷新</el-button>
    </template>
    <div v-loading="loading" class="recent-orders">
      <el-table :data="orders" class="admin-data-table" stripe>
        <el-table-column prop="order_no" label="訂單號" min-width="190" />
        <el-table-column label="業務類型" width="110">
          <template #default="{ row }">
            <StatusBadge :label="row.business_name" :type="businessType(row.business_type)" />
          </template>
        </el-table-column>
        <el-table-column label="金額" min-width="180">
          <template #default="{ row }"
            ><span class="amount-cell">{{ orderAmount(row) }}</span></template
          >
        </el-table-column>
        <el-table-column label="狀態" width="120">
          <template #default="{ row }">
            <StatusBadge
              :label="row.status_name"
              :type="transactionStatusType(row.status_group)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="submitted_at" label="提交時間" min-width="170" />
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="businessDetailRoute(row)"
              plain
              type="primary"
              size="small"
              :icon="View"
              @click="emit('view', row)"
              >詳情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="orders.length === 0" description="暫無交易記錄" />
    </div>
    <RecentOrderCardList :orders="orders" @view="emit('view', $event)" />
    <TablePager
      :model-value="page"
      :page-size="pageSize"
      :total="total"
      @update:model-value="emit('update:page', $event)"
      @update:page-size="emit('update:pageSize', $event)"
    />
  </AdminPanel>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import { Refresh, Tickets, View } from '@element-plus/icons-vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import type { AgentRecentTransaction } from '@/api/modules/agent';
import RecentOrderCardList from './RecentOrderCardList.vue';
import TablePager from '@/components/common/TablePager.vue';
import { businessDetailRoute } from '@/views/transaction/businessDetailRoute';

defineProps<{
  orders: AgentRecentTransaction[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
}>();

const emit = defineEmits<{
  (event: 'refresh'): void;
  (event: 'view', order: AgentRecentTransaction): void;
  (event: 'update:page', page: number): void;
  (event: 'update:pageSize', size: number): void;
}>();

function orderAmount(order: AgentRecentTransaction) {
  if (order.business_type === 'exchange') {
    return `${formatMoney(order.amount)} ${order.currency_code} → ${formatMoney(order.target_amount || '—')} ${order.target_currency_code || ''}`.trim();
  }
  if (order.business_type === 'manual_increase') return `+${formatMoney(order.amount)} ${order.currency_code}`;
  if (order.business_type === 'manual_decrease') return `-${formatMoney(order.amount)} ${order.currency_code}`;
  return `${formatMoney(order.amount)} ${order.currency_code}`;
}

function transactionStatusType(group: string): StatusBadgeType {
  if (group === 'completed' || group === 'success') return 'success';
  if (group === 'rejected' || group === 'failed') return 'danger';
  return 'warning';
}

function businessType(type: AgentRecentTransaction['business_type']): StatusBadgeType {
  if (type === 'deposit' || type === 'manual_increase') return 'success';
  if (type === 'exchange') return 'warning';
  if (type === 'manual_decrease') return 'danger';
  return 'primary';
}
</script>

<style scoped lang="scss">
.recent-orders {
  min-width: 0;
  overflow-x: auto;
}
.amount-cell {
  color: var(--app-text-body);
  font-variant-numeric: tabular-nums;
}

@include mobile {
  .recent-orders {
    display: none;
  }
}
</style>
