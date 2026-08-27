<template>
  <section class="admin-page">
    <AdminHero title="入金記錄" :icon="Checked">
      <template #extra>
        <el-button type="primary" plain :icon="Download" :loading="exporting" @click="exportOrders">匯出 CSV</el-button>
      </template>
    </AdminHero>

    <AdminPanel>
      <ReviewFilters
        :query="query"
        keyword-placeholder="訂單編號 / 交易哈希 / 代理編號 / 公司 / 郵箱"
        completed-label="已入賬"
        :show-status="false"
        wide-keyword
        :loading="loading"
        @update="Object.assign(query, $event)"
        @search="search"
        @reset="reset"
      />
      <DepositTableList
        :data="list"
        :loading="loading"
        @view="openDetail"
      />
      <DepositCardList
        :data="list"
        @view="openDetail"
      />
      <TablePager v-model="page" v-model:page-size="limit" :total="total" />
    </AdminPanel>

  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Checked, Download } from '@element-plus/icons-vue';

import { fetchDepositList } from '@/api/modules/deposit';
import { useCsvExport } from '@/composables/useCsvExport';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import ReviewFilters from '@/components/admin/ReviewFilters.vue';
import TablePager from '@/components/common/TablePager.vue';

import DepositCardList from './components/DepositCardList.vue';
import DepositTableList from './components/DepositTableList.vue';
import type { DepositRow } from './composables/mapper';
import { toDepositRow } from './composables/mapper';
import { useDepositList } from './composables/useDepositList';

const router = useRouter();
const { list, loading, total, page, limit, query, search, reset } = useDepositList();
const { exporting, exportPagedCsv } = useCsvExport();

function exportOrders() {
  void exportPagedCsv<DepositRow>({
    filename: '入金訂單',
    columns: [
      { label: '訂單編號', value: 'id' }, { label: '提交時間', value: 'time' },
      { label: '代理公司', value: 'agent' }, { label: '代理編號', value: 'agentCode' },
      { label: '資產', value: 'asset' }, { label: '網絡', value: 'network' },
      { label: '交易哈希', value: 'hash' }, { label: '申報金額', value: 'amount' },
      { label: '狀態', value: 'status' },
    ],
    fetchPage: async (page, limit) => {
      const result = await fetchDepositList({ page, limit, keyword: query.keyword.trim() || undefined, started_at: query.started_at || undefined, ended_at: query.ended_at || undefined });
      return { ...result, data: result.data.map(toDepositRow) };
    },
  });
}

function openDetail(row: DepositRow) {
  void router.push({ name: 'DepositDetail', params: { id: row.businessId } });
}

</script>

<style scoped lang="scss"></style>
