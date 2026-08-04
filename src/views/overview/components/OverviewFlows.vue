<template>
  <AdminPanel title="近期资金流水" :icon="Tickets">
    <template #extra>
      <RouterLink class="text-link" to="/flow">查看全部 →</RouterLink>
    </template>
    <el-table class="admin-data-table" :data="pagedFlows" stripe>
      <el-table-column prop="time" label="时间" min-width="120" />
      <el-table-column prop="agent" label="代理" min-width="220" />
      <el-table-column label="类型" min-width="100">
        <template #default="{ row }">
          <span class="type-chip">{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="编号" min-width="150" />
      <el-table-column prop="content" label="内容" min-width="180" />
      <el-table-column label="金额" min-width="180">
        <template #default="{ row }">
          <span
            :class="{
              'amount-danger': row.amount.startsWith('-'),
              'amount-success': row.amount.startsWith('+'),
            }"
          >
            {{ row.amount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="140">
        <template #default="{ row }">
          <StatusBadge :label="row.status" :type="row.statusType" />
        </template>
      </el-table-column>
      <el-table-column label="详情" width="130" fixed="right">
        <template #default>
          <el-button plain size="small" :icon="View">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <TablePager v-model="page" v-model:page-size="size" :total="total" />
  </AdminPanel>
</template>

<script setup lang="ts">
import { Tickets, View } from '@element-plus/icons-vue';
import { RouterLink } from 'vue-router';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import TablePager from '@/components/common/TablePager.vue';
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
    statusType: 'pending' as const,
  },
  {
    time: '08/03 15:08',
    agent: '代理A · Apex Trading',
    type: '入金',
    id: 'DEP-26073002',
    content: 'USDC · ERC20',
    amount: '待入帐 12,000.00 USDC',
    status: '待审核',
    statusType: 'pending' as const,
  },
  {
    time: '08/03 14:08',
    agent: '代理A · Apex Trading',
    type: '出金',
    id: 'WD-26073001',
    content: 'USD · B→B',
    amount: '-5,050.00 USD',
    status: '付款处理中',
    statusType: 'process' as const,
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
  },
];

const { page, size, total, pagedData: pagedFlows } = useTablePager(flows);
</script>
