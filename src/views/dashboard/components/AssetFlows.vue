<template>
  <AdminPanel title="近期资金流水" :icon="Tickets">
    <template #extra>
      <RouterLink class="text-link" to="/flow">查看全部 →</RouterLink>
    </template>
    <ResponsiveList>
      <template #desktop>
        <el-table class="admin-data-table" :data="pagedFlows" stripe>
          <el-table-column prop="time" label="时间" min-width="120" />
          <el-table-column prop="agent" label="代理" min-width="220" />
          <el-table-column label="类型" min-width="100">
            <template #default="{ row }">
              <StatusBadge :label="row.type" type="primary" />
            </template>
          </el-table-column>
          <el-table-column prop="id" label="编号" min-width="150" />
          <el-table-column prop="content" label="内容" min-width="180" />
          <el-table-column label="金额" min-width="180">
            <template #default="{ row }">
              <span :class="getAmountClass(row)">
                {{ row.amount }}
              </span>
            </template>
          </el-table-column>
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
import { RouterLink } from 'vue-router';
import { computed } from 'vue';

import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import ResponsiveList from '@/components/common/ResponsiveList.vue';
import { useTablePager } from '@/hooks/useTablePager';

const flows = [
  {
    time: '08/03 16:08',
    agent: '代理B · Bluewave Capital',
    type: '兑换',
    id: 'EX-26073002',
    content: 'USDC → USD · 0.9000',
    amount: '5,000.00 USDC',
    status: '待审核',
    statusType: 'warning' as const,
    statusEffect: 'pending' as const,
  },
  {
    time: '08/03 15:08',
    agent: '代理A · Apex Trading',
    type: '入金',
    id: 'DEP-26073002',
    content: 'USDC · ERC20',
    amount: '待入帐 12,000.00 USDC',
    status: '待审核',
    statusType: 'warning' as const,
    statusEffect: 'pending' as const,
  },
  {
    time: '08/03 14:08',
    agent: '代理A · Apex Trading',
    type: '出金',
    id: 'WD-26073001',
    content: 'USD · B→B',
    amount: '-5,050.00 USD',
    status: '付款处理中',
    statusType: 'primary' as const,
    statusEffect: 'pending' as const,
  },
  {
    time: '08/02 17:08',
    agent: '代理A · Apex Trading',
    type: '入金',
    id: 'DEP-26073001',
    content: 'USDT · TRC20',
    amount: '+50,000.00 USDT',
    status: '已完成',
    statusType: 'success' as const,
    statusEffect: undefined,
  },
];

const { pagedData: pagedFlows } = useTablePager(flows);

type AssetFlowRow = (typeof flows)[number];

const flowCards = computed<AdminCardItem[]>(() =>
  pagedFlows.value.map((row) => ({
    key: row.id,
    title: row.id,
    subtitle: row.time,
    status: {
      label: row.status,
      type: row.statusType,
      effect: row.statusEffect,
    },
    fields: [
      { label: '时间', value: row.time },
      { label: '代理', value: row.agent },
      { label: '类型', badge: { label: row.type, type: 'primary' } },
      { label: '编号', value: row.id, strong: true },
      { label: '内容', value: row.content },
      { label: '金额', value: row.amount, valueClass: getAmountClass(row), strong: true },
    ],
    pending: row.statusEffect === 'pending',
  })),
);

function getAmountClass(row: AssetFlowRow) {
  return {
    'amount-danger': row.amount.startsWith('-'),
    'amount-success': row.amount.startsWith('+'),
  };
}
</script>
