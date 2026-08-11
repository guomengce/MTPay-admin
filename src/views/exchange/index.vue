<template>
  <section class="admin-page">
    <AdminHero title="兑换审核" description="查看资金冻结和处理时间线后完成一次审核" :icon="Switch">
      <template #extra>
        <span class="pill pill--amber">{{ pendingCount }} 笔待审核</span>
      </template>
    </AdminHero>


    <AdminPanel title="兑换申请列表" :icon="Document">
      <ExchangeTableList
        :data="pagedRows"
        @view="openDialog('view', $event)"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
      />
      <ExchangeCardList
        :data="pagedRows"
        @view="openDialog('view', $event)"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
      />
      <TablePager v-model="page" v-model:page-size="size" :total="total" />
    </AdminPanel>

    <ExchangeAddDialog
      v-model="dialogVisible"
      :row="activeRow"
      :mode="dialogMode"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Document, Switch } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import { useTablePager } from '@/hooks/useTablePager';

import ExchangeAddDialog from './components/ExchangeAddDialog.vue';
import ExchangeCardList from './components/ExchangeCardList.vue';
import type { ExchangeRow } from './components/ExchangeTableList.vue';
import ExchangeTableList from './components/ExchangeTableList.vue';

const rows: ExchangeRow[] = [
  {
    id: 'EX-26073002',
    time: '08/03 16:08',
    agent: '代理B · Bluewave Capital',
    code: 'AG-B',
    amount: '5,000.00 USDC',
    asset: 'USDC',
    rate: '0.9000',
    usd: '4,500.00 USD',
    status: '待审核',
    statusType: 'pending',
  },
  {
    id: 'EX-26073001',
    time: '08/01 17:08',
    agent: '代理A · Apex Trading',
    code: 'AG-A',
    amount: '10,000.00 USDT',
    asset: 'USDT',
    rate: '0.9900',
    usd: '9,900.00 USD',
    status: '已完成',
    statusType: 'success',
  },
];

const { page, size, total, pagedData: pagedRows } = useTablePager(rows);

const pendingCount = computed(() => rows.filter((r) => r.statusType === 'pending').length);

const dialogVisible = ref(false);
const dialogMode = ref<'view' | 'approve' | 'reject'>('view');
const activeRow = ref<ExchangeRow | null>(null);

function openDialog(mode: 'view' | 'approve' | 'reject', row: ExchangeRow) {
  dialogMode.value = mode;
  activeRow.value = row;
  dialogVisible.value = true;
}

function handleSubmit(payload: { row: ExchangeRow; mode: 'approve' | 'reject'; reason?: string }) {
  // 接入 API：await api.exchanges.review(payload)
  console.log('exchange review', payload);
  dialogVisible.value = false;
}
</script>

<style scoped lang="scss">

</style>