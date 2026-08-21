<template>
  <section class="admin-page">
    <AdminHero
      title="交易记录"
      description="统一查看入金、兑换与 USD 出金订单，本页仅只读"
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
      <el-empty v-if="!loading && list.length === 0" description="暂无交易记录" />
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
/** 交易记录列表：真实筛选、后端分页，详情只读跳转。 */
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
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
  void router.push({
    name: 'TransactionDetail',
    params: { businessType: row.detail_type, businessId: row.detail_id },
  });
}

onMounted(loadList);
</script>

<style scoped lang="scss"></style>
