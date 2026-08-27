<template>
  <section class="admin-page">
    <AdminHero title="兑换审核" :icon="Switch">
      <template #extra>
        <el-button type="primary" plain :icon="Download" :loading="exporting" @click="exportOrders">匯出 CSV</el-button>
      </template>
    </AdminHero>

    <AdminPanel>
      <ReviewFilters
        :query="query"
        keyword-placeholder="訂單編號 / 代理編號 / 公司 / 郵箱"
        completed-label="已完成"
        :loading="loading"
        @update="Object.assign(query, $event)"
        @search="search"
        @reset="reset"
      />
      <ExchangeTableList
        :data="list"
        :loading="loading"
        @view="openDetail"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
      />
      <ExchangeCardList
        :data="list"
        @view="openDetail"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
      />
      <TablePager v-model="page" v-model:page-size="limit" :total="total" />
    </AdminPanel>

    <ExchangeAddDialog
      v-model="dialogVisible"
      :row="activeRow"
      :mode="dialogMode"
      :submitting="reviewing"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Download, Switch } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

import { fetchExchangeList, reviewExchange } from '@/api/modules/exchange';
import { useCsvExport } from '@/composables/useCsvExport';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import ReviewFilters from '@/components/admin/ReviewFilters.vue';
import TablePager from '@/components/common/TablePager.vue';

import ExchangeAddDialog from './components/ExchangeAddDialog.vue';
import ExchangeCardList from './components/ExchangeCardList.vue';
import ExchangeTableList from './components/ExchangeTableList.vue';
import type { ExchangeRow } from './composables/mapper';
import { toExchangeRow } from './composables/mapper';
import { useExchangeList } from './composables/useExchangeList';

const router = useRouter();
const { list, loading, total, page, limit, query, loadList, search, reset } = useExchangeList();
const dialogVisible = ref(false);
const dialogMode = ref<'approve' | 'reject'>('approve');
const activeRow = ref<ExchangeRow | null>(null);
const reviewing = ref(false);
const { exporting, exportPagedCsv } = useCsvExport();

function exportOrders() {
  void exportPagedCsv<ExchangeRow>({
    filename: '兌換訂單',
    columns: [
      { label: '訂單編號', value: 'id' }, { label: '提交時間', value: 'time' },
      { label: '代理公司', value: 'agent' }, { label: '代理編號', value: 'code' },
      { label: '支付金額', value: 'amount' }, { label: '支付資產', value: 'asset' },
      { label: '兌換比例', value: 'rate' }, { label: '比例來源', value: 'rateSource' },
      { label: '到賬金額', value: 'usd' }, { label: '到賬資產', value: 'toSymbol' },
      { label: '狀態', value: 'status' },
    ],
    fetchPage: async (page, limit) => {
      const result = await fetchExchangeList({ page, limit, status: query.status, keyword: query.keyword.trim() || undefined, started_at: query.started_at || undefined, ended_at: query.ended_at || undefined });
      return { ...result, data: result.data.map(toExchangeRow) };
    },
  });
}

function openDetail(row: ExchangeRow) {
  void router.push({ name: 'ExchangeDetail', params: { id: row.businessId } });
}

function openDialog(mode: 'approve' | 'reject', row: ExchangeRow) {
  dialogMode.value = mode;
  activeRow.value = row;
  dialogVisible.value = true;
}

async function handleSubmit(payload: {
  row: ExchangeRow;
  mode: 'approve' | 'reject';
  reason?: string;
}) {
  reviewing.value = true;
  try {
    await reviewExchange({
      id: payload.row.businessId,
      decision: payload.mode,
      review_note: payload.mode === 'reject' ? payload.reason?.trim() : undefined,
    });
    ElMessage.success(payload.mode === 'approve' ? '兑换审核已通过' : '兑换申请已驳回');
    dialogVisible.value = false;
    activeRow.value = null;
    await loadList();
  } finally {
    reviewing.value = false;
  }
}
</script>

<style scoped lang="scss"></style>
