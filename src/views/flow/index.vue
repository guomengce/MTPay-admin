<template>
  <section class="admin-page">
    <AdminHero
      title="资金流水"
      description="记录收付款交易详情，资金全链路清晰可追溯"
      :icon="Tickets"
    >
      <template #extra>
        <el-button type="primary" :icon="Download">导出CSV</el-button>
      </template>
    </AdminHero>

    <AdminPanel>
      <ResponsiveList>
        <template #desktop>
          <FlowTableList :data="pagedRows" @view="handleView" />
        </template>
        <template #mobile>
          <FlowCardList :data="pagedRows" @view="handleView" />
        </template>
      </ResponsiveList>
      <TablePager v-model="page" v-model:page-size="size" :total="total" />
    </AdminPanel>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Download, Tickets } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import ResponsiveList from '@/components/common/ResponsiveList.vue';
import TablePager from '@/components/common/TablePager.vue';
import { useTablePager } from '@/hooks/useTablePager';

import FlowCardList from './components/FlowCardList.vue';
import type { FlowRow } from './components/FlowTableList.vue';
import FlowTableList from './components/FlowTableList.vue';

const rows: FlowRow[] = [
  {
    time: '08/03 16:08',
    agent: '代理B · Bluewave Capital',
    type: '兑换',
    id: 'EX-26073002',
    content: 'USDC → USD · 0.9000',
    amount: '5,000.00 USDC',
    usd: '≈ 5,000.00 USD',
    status: '待审核',
    statusType: 'warning',
    statusEffect: 'pending',
  },
  {
    time: '08/03 15:08',
    agent: '代理A · Apex Trading',
    type: '入金',
    id: 'DEP-26073002',
    content: 'USDC · ERC20',
    amount: '待入账 12,000.00 USDC',
    usd: '',
    status: '待审核',
    statusType: 'warning',
    statusEffect: 'pending',
  },
  {
    time: '08/03 14:08',
    agent: '代理A · Apex Trading',
    type: '出金',
    id: 'WD-26073001',
    content: 'USD · B→B',
    amount: '-5,050.00 USD',
    usd: '≈ -5,050.00 USD',
    status: '付款处理中',
    statusType: 'primary',
    statusEffect: 'pending',
  },
  {
    time: '08/02 17:08',
    agent: '代理A · Apex Trading',
    type: '入金',
    id: 'DEP-26073001',
    content: 'USDT · TRC20',
    amount: '+50,000.00 USDT',
    usd: '≈ 50,000.00 USD',
    status: '已完成',
    statusType: 'success',
    statusEffect: undefined,
  },
  {
    time: '08/02 15:08',
    agent: '代理B · Bluewave Capital',
    type: '入金',
    id: 'DEP-26072911',
    content: 'USDT · TRC20',
    amount: '+25,000.00 USDT',
    usd: '≈ 25,000.00 USD',
    status: '已完成',
    statusType: 'success',
    statusEffect: undefined,
  },
  {
    time: '08/01 17:08',
    agent: '代理A · Apex Trading',
    type: '入金',
    id: 'DEP-26072908',
    content: 'USDC · ERC20',
    amount: '+12,500.00 USDC',
    usd: '≈ 12,500.00 USD',
    status: '已完成',
    statusType: 'success',
    statusEffect: undefined,
  },
  {
    time: '07/31 17:08',
    agent: '代理A · Apex Trading',
    type: '出金',
    id: 'WD-26072903',
    content: 'USD · C→C',
    amount: '-12,550.00 USD',
    usd: '≈ -12,550.00 USD',
    status: '已完成',
    statusType: 'success',
    statusEffect: undefined,
  },
];

const { page, size, total, pagedData: pagedRows } = useTablePager(rows);
const router = useRouter();

function handleView(row: FlowRow) {
  router.push(`/flow/detail/${row.id}`);
}
</script>
