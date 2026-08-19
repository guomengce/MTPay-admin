<template>
  <AdminPanel title="近期资金流水" :icon="Tickets">
    <template #extra>
      <RouterLink class="text-link" to="/flow">查看全部 →</RouterLink>
    </template>
    <ResponsiveList>
      <template #desktop>
        <el-table class="admin-data-table" :data="flows" stripe>
          <el-table-column prop="time" label="时间" min-width="140" />
          <el-table-column prop="agent" label="代理" min-width="220" />
          <el-table-column label="类型" min-width="100">
            <template #default="{ row }">
              <StatusBadge :label="row.type" type="primary" />
            </template>
          </el-table-column>
          <el-table-column prop="id" label="编号" min-width="170" />
          <el-table-column prop="content" label="内容" min-width="210" />
          <el-table-column prop="amount" label="金额" min-width="220" />
          <el-table-column label="状态" min-width="140">
            <template #default="{ row }">
              <StatusBadge :label="row.status" :type="row.statusType" :effect="row.statusEffect" />
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template #mobile>
        <AdminCardList :items="flowCards" />
      </template>
    </ResponsiveList>
  </AdminPanel>
</template>

<script setup lang="ts">
import { Tickets } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import type { OperationTransactionItem } from '@/api/modules/dashboard';
import AdminCardList, { type AdminCardItem } from '@/components/admin/AdminCardList.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge, {
  type StatusBadgeEffect,
  type StatusBadgeType,
} from '@/components/admin/StatusBadge.vue';
import ResponsiveList from '@/components/common/ResponsiveList.vue';

const props = defineProps<{ transactions: OperationTransactionItem[] }>();

const flows = computed(() => props.transactions.map(mapTransaction));

const flowCards = computed<AdminCardItem[]>(() =>
  flows.value.map((row) => ({
    key: row.key,
    title: row.id,
    subtitle: row.time,
    status: {
      label: row.status,
      type: row.statusType,
      effect: row.statusEffect,
    },
    fields: [
      { label: '代理', value: row.agent },
      { label: '类型', badge: { label: row.type, type: 'primary' } },
      { label: '内容', value: row.content },
      { label: '金额', value: row.amount, strong: true },
    ],
    pending: row.statusEffect === 'pending',
  })),
);

function mapTransaction(item: OperationTransactionItem) {
  const status = mapStatus(item.status_group);
  return {
    key: item.transaction_key,
    time: item.submitted_at,
    agent: `${item.user.agent_code} · ${item.user.company_name}`,
    type: item.business_name,
    id: item.order_no,
    content: formatContent(item),
    amount: formatAmount(item),
    status: item.status_group_name || item.status_name,
    statusType: status.type,
    statusEffect: status.effect,
  };
}

function formatContent(item: OperationTransactionItem) {
  if (item.business_type === 'deposit') {
    return [item.currency_code, item.network_code].filter(Boolean).join(' · ');
  }
  if (item.business_type === 'exchange') {
    return `${item.currency_code} → ${item.target_currency_code || 'USD'}${
      item.exchange_rate ? ` · ${item.exchange_rate}` : ''
    }`;
  }
  return [item.payer_name, item.payee_name].filter(Boolean).join(' → ') || item.currency_code;
}

function formatAmount(item: OperationTransactionItem) {
  if (item.business_type === 'exchange' && item.target_amount) {
    return `${item.amount} ${item.currency_code} → ${item.target_amount} ${
      item.target_currency_code || 'USD'
    }`;
  }
  if (item.business_type === 'withdrawal' && item.total_amount) {
    return `${item.amount} ${item.currency_code} · 总扣款 ${item.total_amount} ${item.currency_code}`;
  }
  return `${item.amount} ${item.currency_code}`;
}

function mapStatus(statusGroup: string): {
  type: StatusBadgeType;
  effect?: StatusBadgeEffect;
} {
  if (statusGroup === 'completed') return { type: 'success' };
  if (statusGroup === 'rejected' || statusGroup === 'failed') return { type: 'danger' };
  if (statusGroup === 'processing') return { type: 'primary', effect: 'pending' };
  return { type: 'warning', effect: 'pending' };
}
</script>
