<template>
  <section class="admin-page">
    <AdminHero title="白名单审核" description="四种类型均只需一次审核" :icon="Checked" />

    <AdminPanel>
      <WhitelistTableList
        :data="pagedRows"
        @view="openDetail"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
      />
      <WhitelistCardList
        :data="pagedRows"
        @view="openDetail"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
      />
      <TablePager v-model="page" v-model:page-size="size" :total="total" />
    </AdminPanel>

    <WhitelistAddDialog
      v-model="dialogVisible"
      :row="activeRow"
      :mode="dialogMode"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Checked } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import { useTablePager } from '@/hooks/useTablePager';

import WhitelistAddDialog from './components/WhitelistAddDialog.vue';
import WhitelistCardList from './components/WhitelistCardList.vue';
import type { WhitelistRow } from './components/WhitelistTableList.vue';
import WhitelistTableList from './components/WhitelistTableList.vue';

const rows: WhitelistRow[] = [
  {
    id: 'WL-1005',
    time: '08/03 15:38',
    agent: '代理A · Apex Trading',
    type: '收款人 · B',
    subject: 'Atlas Commerce GmbH',
    country: 'Germany',
    bank: 'Deutsche Bank',
    account: 'DE8937040044053206194',
    status: '待审核',
    statusType: 'warning',
    statusEffect: 'pending',
  },
  {
    id: 'WL-2002',
    time: '08/01 17:08',
    agent: '代理B · Bluewave Capital',
    type: '收款人 · C',
    subject: 'Amelia Davis',
    country: 'Australia',
    bank: 'ANZ',
    account: '•• 2711',
    status: '已核准',
    statusType: 'success',
  },
  {
    id: 'WL-2001',
    time: '07/31 17:08',
    agent: '代理B · Bluewave Capital',
    type: '付款人 · B',
    subject: 'Bluewave Settlement Ltd.',
    country: 'Hong Kong',
    bank: 'Financial Institute',
    account: '72839104',
    status: '已核准',
    statusType: 'success',
  },
  {
    id: 'WL-1004',
    time: '07/30 17:08',
    agent: '代理A · Apex Trading',
    type: '收款人 · C',
    subject: 'Olivia Brown',
    country: 'United Kingdom',
    bank: 'Barclays',
    account: 'GB29NWBK601613319501',
    status: '已核准',
    statusType: 'success',
  },
];

const { page, size, total, pagedData: pagedRows } = useTablePager(rows);
const router = useRouter();

const dialogVisible = ref(false);
const dialogMode = ref<'view' | 'approve' | 'reject'>('view');
const activeRow = ref<WhitelistRow | null>(null);

function openDetail(row: WhitelistRow) {
  router.push(`/whitelist/detail/${row.id}`);
}

function openDialog(mode: 'view' | 'approve' | 'reject', row: WhitelistRow) {
  dialogMode.value = mode;
  activeRow.value = row;
  dialogVisible.value = true;
}

function handleSubmit(payload: { row: WhitelistRow; mode: 'approve' | 'reject'; reason?: string }) {
  // 接入 API：await api.whitelist.review(payload)
  console.log('whitelist review', payload);
  dialogVisible.value = false;
}
</script>

<style scoped lang="scss"></style>
