<template>
  <section class="admin-page">
    <AdminHero title="入金記錄" :icon="Checked">
      <template #extra>
        <el-button type="primary" plain :icon="Download" :loading="exporting" :disabled="loading || !exportFilters" @click="exportOrders">匯出 CSV</el-button>
      </template>
    </AdminHero>

    <AdminPanel>
      <ReviewFilters
        :query="query"
        keyword-placeholder="訂單編號 / 交易哈希 / 公司 / 郵箱"
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

import { useBusinessCsvExport } from '@/composables/useBusinessCsvExport';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import ReviewFilters from '@/components/admin/ReviewFilters.vue';
import TablePager from '@/components/common/TablePager.vue';

import DepositCardList from './components/DepositCardList.vue';
import DepositTableList from './components/DepositTableList.vue';
import type { DepositRow } from './composables/mapper';
import { useDepositList } from './composables/useDepositList';

const router = useRouter();
const { exportFilters, list, loading, total, page, limit, query, search, reset } = useDepositList();
const { exporting, downloadCsv } = useBusinessCsvExport('deposit', () => exportFilters.value);

function exportOrders() { void downloadCsv(); }

function openDetail(row: DepositRow) {
  void router.push({ name: 'DepositDetail', params: { id: row.businessId } });
}

</script>

<style scoped lang="scss"></style>
