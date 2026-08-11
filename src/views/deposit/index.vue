<template>
  <section class="admin-page">
    <AdminHero
      title="数字货币入金审核"
      description="确认平台已收到USDT或USDC后，审核通过并增加代理余额"
      :icon="Checked"
    >
      <template #extra>
        <span class="pill pill--amber">{{ pendingCount }} 笔待审核</span>
      </template>
    </AdminHero>

    <AdminPanel title="入金申请" :icon="Wallet">
      <DepositTableList
        :data="pagedRows"
        @view="openDialog('view', $event)"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
      />
      <DepositCardList
        :data="pagedRows"
        @view="openDialog('view', $event)"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
      />
      <TablePager v-model="page" v-model:page-size="size" :total="total" />
    </AdminPanel>

    <DepositAddDialog
      v-model="dialogVisible"
      :row="activeRow"
      :mode="dialogMode"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Checked, Wallet } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import { useTablePager } from '@/hooks/useTablePager';

import DepositAddDialog from './components/DepositAddDialog.vue';
import DepositCardList from './components/DepositCardList.vue';
import type { DepositRow } from './components/DepositTableList.vue';
import DepositTableList from './components/DepositTableList.vue';

const rows: DepositRow[] = [
  {
    id: 'DEP-26073002',
    time: '08/03 15:08',
    agent: '代理A · Apex Trading',
    asset: 'USDC',
    network: 'ERC20',
    hash: '0x98aefd33...1e72f0',
    amount: '12,000.00',
    status: '待审核',
    statusType: 'pending',
  },
  {
    id: 'DEP-26073001',
    time: '08/02 17:08',
    agent: '代理A · Apex Trading',
    asset: 'USDT',
    network: 'TRC20',
    hash: 'a7f8d2c5b9...9e93c1',
    amount: '50,000.00',
    status: '已完成',
    statusType: 'success',
  },
  {
    id: 'DEP-26072911',
    time: '08/02 15:08',
    agent: '代理B · Bluewave Capital',
    asset: 'USDT',
    network: 'TRC20',
    hash: 'bb172e92d0...ad4c6a',
    amount: '25,000.00',
    status: '已完成',
    statusType: 'success',
  },
];

const { page, size, total, pagedData: pagedRows } = useTablePager(rows);

const pendingCount = computed(() => rows.filter((r) => r.statusType === 'pending').length);

const dialogVisible = ref(false);
const dialogMode = ref<'view' | 'approve' | 'reject'>('view');
const activeRow = ref<DepositRow | null>(null);

function openDialog(mode: 'view' | 'approve' | 'reject', row: DepositRow) {
  dialogMode.value = mode;
  activeRow.value = row;
  dialogVisible.value = true;
}

function handleSubmit(payload: { row: DepositRow; mode: 'approve' | 'reject'; reason?: string }) {
  // 接入 API：await api.deposits.review(payload)
  console.log('deposit review', payload);
  dialogVisible.value = false;
}
</script>

<style scoped lang="scss">

</style>