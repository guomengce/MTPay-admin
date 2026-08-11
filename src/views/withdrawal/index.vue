<template>
  <section class="admin-page">
    <AdminHero
      title="USD出金管理"
      description="一次审核后进入付款执行；付款完成不是第二次审核"
      :icon="Wallet"
    >
      <template #extra>
        <el-input class="search" placeholder="搜寻订单、代理或编号..." :prefix-icon="Search" />
      </template>
    </AdminHero>
    <AdminPanel title="USD出金订单列表" :icon="Document">
      <template #extra>
        <span class="pill pill--amber">{{ processCount }} 笔待付款</span>
      </template>
      <WithdrawalTableList :data="pagedRows" @view="openDialog('view', $event)" @complete="openDialog('complete', $event)" />
      <WithdrawalCardList :data="pagedRows" @view="openDialog('view', $event)" @complete="openDialog('complete', $event)" />
      <TablePager v-model="page" v-model:page-size="size" :total="total" />
    </AdminPanel>

    <WithdrawalAddDialog
      v-model="dialogVisible"
      :row="activeRow"
      :mode="dialogMode"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Document, Search, Wallet } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import { useTablePager } from '@/hooks/useTablePager';

import WithdrawalAddDialog from './components/WithdrawalAddDialog.vue';
import WithdrawalCardList from './components/WithdrawalCardList.vue';
import type { WithdrawalRow } from './components/WithdrawalTableList.vue';
import WithdrawalTableList from './components/WithdrawalTableList.vue';

const rows: WithdrawalRow[] = [
  {
    id: 'WD-26073001',
    time: '08/03 14:08',
    agent: '代理A · Apex Trading',
    relation: 'B→B',
    parties: 'Harbor Trade Pte. Ltd. → Northstar Supplies LLC',
    amount: '5,000.00 USD',
    fee: '50.00 / 5,050.00 USD',
    status: '付款处理中',
    statusType: 'process',
  },
  {
    id: 'WD-26072908',
    time: '07/31 17:08',
    agent: '代理A · Apex Trading',
    relation: 'C→C',
    parties: 'Michael Chen → Olivia Brown',
    amount: '12,500.00 USD',
    fee: '50.00 / 12,550.00 USD',
    status: '已完成',
    statusType: 'success',
  },
];

const { page, size, total, pagedData: pagedRows } = useTablePager(rows);

const processCount = computed(() => rows.filter((r) => r.statusType === 'process').length);

const dialogVisible = ref(false);
const dialogMode = ref<'view' | 'complete'>('view');
const activeRow = ref<WithdrawalRow | null>(null);

function openDialog(mode: 'view' | 'complete', row: WithdrawalRow) {
  dialogMode.value = mode;
  activeRow.value = row;
  dialogVisible.value = true;
}

function handleSubmit(payload: {
  row: WithdrawalRow;
  mode: 'complete';
  reference?: string;
  note?: string;
}) {
  // 接入 API：await api.withdrawals.complete(payload)
  console.log('withdrawal complete', payload);
  dialogVisible.value = false;
}
</script>

<style scoped lang="scss">
.search {
  width: 360px;
}

.info-banner {
  padding: 18px 22px;
  border: 1px solid #bdd5ff;
  border-radius: 8px;
  color: #1254c8;
  background: #edf5ff;
  font-weight: 850;
}

@include mobile {
  .search {
    width: 100%;
  }
}
</style>