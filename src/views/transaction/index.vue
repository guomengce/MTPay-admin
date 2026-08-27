<template>
  <section class="admin-page">
    <AdminHero
      title="交易记录"
      :icon="Tickets"
    >
      <template #extra>
        <el-button type="primary" plain :icon="Download" :loading="exporting" @click="exportOrders">匯出 CSV</el-button>
      </template>
    </AdminHero>

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
import { Download, Tickets } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import type { TransactionItem } from '@/api/modules/transaction';
import { fetchTransactionList } from '@/api/modules/transaction';
import { useCsvExport } from '@/composables/useCsvExport';
import TransactionFilters from './components/TransactionFilters.vue';
import TransactionCardList from './components/TransactionCardList.vue';
import TransactionTable from './components/TransactionTable.vue';
import { useTransactionList } from './composables/useTransactionList';

const router = useRouter();
const { loading, list, total, page, limit, query, loadList, search, reset, setPage, setLimit } =
  useTransactionList();
const { exporting, exportPagedCsv } = useCsvExport();

function exportOrders() {
  void exportPagedCsv<TransactionItem>({
    filename: '交易記錄',
    columns: [
      { label: '訂單編號', value: 'order_no' }, { label: '業務類型', value: 'business_name' },
      { label: '提交時間', value: 'submitted_at' }, { label: '完成時間', value: 'completed_at' },
      { label: '代理公司', value: (row) => row.user.company_name },
      { label: '代理編號', value: (row) => row.user.agent_code },
      { label: '代理郵箱', value: (row) => row.user.email },
      { label: '付款方', value: 'payer_name' }, { label: '收款方', value: 'payee_name' },
      { label: '金額', value: 'amount' }, { label: '幣種', value: 'currency_code' },
      { label: '目標金額', value: 'target_amount' }, { label: '目標幣種', value: 'target_currency_code' },
      { label: '兌換比例', value: 'exchange_rate' }, { label: '賬戶扣款', value: 'total_amount' },
      { label: '狀態', value: 'status_name' },
    ],
    fetchPage: (page, limit) => fetchTransactionList({ page, limit, business_type: query.business_type, status_group: query.status_group.trim() || undefined, currency_code: query.currency_code.trim() || undefined, keyword: query.keyword.trim() || undefined, started_at: query.started_at || undefined, ended_at: query.ended_at || undefined }),
  });
}

function openDetail(row: TransactionItem) {
  void router.push({
    name: 'TransactionDetail',
    params: { businessType: row.detail_type, businessId: row.detail_id },
  });
}

onMounted(loadList);
</script>

<style scoped lang="scss"></style>
