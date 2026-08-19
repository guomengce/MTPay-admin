<template>
  <AdminPanel
    title="最近交易"
    subtitle="展示该代理最近 5 笔入金、兑换和出金订单"
    :icon="Tickets"
  >
    <template #extra>
      <el-button :icon="Refresh" @click="emit('refresh')">刷新</el-button>
    </template>
    <div class="recent-orders">
      <el-table :data="orders" class="admin-data-table" stripe>
        <el-table-column prop="order_no" label="订单号" min-width="190" />
        <el-table-column prop="business_name" label="业务类型" width="110" />
        <el-table-column label="金额" min-width="180">
          <template #default="{ row }"
            ><span class="amount-cell">{{ orderAmount(row) }}</span></template
          >
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <StatusBadge
              :label="row.status_name"
              :type="transactionStatusType(row.status_group)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="submitted_at" label="提交时间" min-width="170" />
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{ row }">
            <el-button
              plain
              type="primary"
              size="small"
              :icon="View"
              @click="emit('view', row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="orders.length === 0" description="暂无最近交易" />
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { Refresh, Tickets, View } from '@element-plus/icons-vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import type { AgentRecentTransaction } from '@/api/modules/agent';

defineProps<{
  orders: AgentRecentTransaction[];
}>();

const emit = defineEmits<{
  (event: 'refresh'): void;
  (event: 'view', order: AgentRecentTransaction): void;
}>();

function orderAmount(order: AgentRecentTransaction) {
  if (order.business_type === 'exchange') {
    return `${order.amount} ${order.currency_code} → ${order.target_amount || '—'} ${order.target_currency_code || ''}`.trim();
  }
  return `${order.amount} ${order.currency_code}`;
}

function transactionStatusType(group: string): StatusBadgeType {
  if (group === 'completed' || group === 'success') return 'success';
  if (group === 'rejected' || group === 'failed') return 'danger';
  return 'warning';
}
</script>

<style scoped lang="scss">
.recent-orders {
  min-width: 0;
  overflow-x: auto;
  padding: 0 20px 20px;
}
.amount-cell {
  color: var(--app-text-body);
  font-variant-numeric: tabular-nums;
}

@include mobile {
  .recent-orders {
    padding: 0 16px 16px;
  }
}
</style>
