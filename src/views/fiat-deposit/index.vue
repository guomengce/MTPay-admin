<template>
  <section class="admin-page">
    <AdminHero title="法幣入金" :icon="CreditCard"
      ><template #extra
        ><el-button type="primary" plain :icon="Download" :loading="exporting" @click="exportCsv"
          >導出 CSV</el-button
        ></template
      ></AdminHero
    ><AdminPanel
      ><ReviewFilters
        :query="query"
      keyword-placeholder="訂單號 / 付款人 / 銀行 / 參考號 / 代理"
      completed-label="已完成"
        :loading="loading"
        @update="Object.assign(query, $event)"
        @search="search"
        @reset="reset" /><FiatDepositTableList
        :items="list"
        :loading="loading"
        @view="view" /><FiatDepositCardList :items="list" @view="view" /><TablePager
        v-model="page"
        v-model:page-size="limit"
        :total="total"
    /></AdminPanel>
  </section>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { CreditCard, Download } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import ReviewFilters from '@/components/admin/ReviewFilters.vue';
import TablePager from '@/components/common/TablePager.vue';
import {
  exportFiatCsv,
  fetchFiatList,
  type FiatFilters,
  type FiatOrder,
} from '@/api/modules/fiatDeposit';
import FiatDepositTableList from './components/FiatDepositTableList.vue';
import FiatDepositCardList from './components/FiatDepositCardList.vue';
const router = useRouter();
const list = ref<FiatOrder[]>([]);
const loading = ref(false);
const exporting = ref(false);
const page = ref(1);
const limit = ref(15);
const total = ref(0);
const query = reactive({ keyword: '', started_at: '', ended_at: '', status: undefined as FiatFilters['status'] });
const applied = ref<FiatFilters>({});
async function load() {
  loading.value = true;
  try {
    const result = await fetchFiatList({ ...applied.value, page: page.value, limit: limit.value });
    list.value = result.data;
    total.value = result.total;
  } finally {
    loading.value = false;
  }
}
function search() {
  applied.value = { ...query };
  page.value = 1;
  void load();
}
function reset() {
  Object.assign(query, { keyword: '', started_at: '', ended_at: '', status: undefined });
  search();
}
function view(id: number) {
  void router.push({ name: 'FiatDepositDetail', params: { id } });
}
async function exportCsv() {
  exporting.value = true;
  try {
    const blob = await exportFiatCsv(applied.value);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fiat-deposits.csv';
    a.click();
    URL.revokeObjectURL(url);
  } finally {
    exporting.value = false;
  }
}
watch([page, limit], load);
onMounted(load);
</script>
<style scoped lang="scss">
@include mobile {
  .admin-page :deep(.table-list) {
    display: none;
  }
}
</style>
