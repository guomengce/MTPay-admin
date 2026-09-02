<template>
  <section class="admin-page">
    <AdminHero
      title="交易記錄"
      :icon="Tickets"
    />

    <AdminPanel>
      <TransactionFilters
        :query="query"
        :loading="loading"
        @update="Object.assign(query, $event)"
        @search="search"
        @reset="reset"
      />
      <TransactionTable :data="list" :loading="loading" @view="openDetail" />
      <TransactionCardList :data="list" @view="openDetail" />
      <el-empty v-if="!loading && list.length === 0" description="暫無交易記錄" />
      <TablePager
        :model-value="page"
        :page-size="limit"
        :total="total"
        @update:model-value="setPage"
        @update:page-size="setLimit"
      />
    </AdminPanel>
  </section>
</template>

<script setup lang="ts">
/** 交易記錄列表：真實篩選、後端分頁，詳情只讀跳轉。 */
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { businessDetailRoute } from '@/views/transaction/businessDetailRoute';
import { Tickets } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import type { TransactionItem } from '@/api/modules/transaction';
import TransactionFilters from './components/TransactionFilters.vue';
import TransactionCardList from './components/TransactionCardList.vue';
import TransactionTable from './components/TransactionTable.vue';
import { useTransactionList } from './composables/useTransactionList';

const router = useRouter();
const { loading, list, total, page, limit, query, loadList, search, reset, setPage, setLimit } =
  useTransactionList();

function openDetail(row: TransactionItem) {
  const target = businessDetailRoute(row);
  if (target) void router.push(target);
}

onMounted(loadList);
</script>

<style scoped lang="scss"></style>
