<template>
  <section class="admin-page">
    <AdminHero title="風控管理" :icon="WarningFilled">
      <template #extra><RiskTabs active="cases" /></template>
    </AdminHero>

    <AdminPanel>
      <RiskFilters
        :query="query"
        :loading="loading"
        @update="Object.assign(query, $event)"
        @search="search"
        @reset="reset"
      />
      <RiskTableList :data="list" :loading="loading" @view="viewDetail" />
      <RiskCardList :data="list" @view="viewDetail" />
      <el-empty v-if="!loading && !list.length" description="暫無風控案件" />
      <TablePager
        :model-value="page"
        :page-size="limit"
        :total="total"
        @update:model-value="changePage"
      />
    </AdminPanel>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { WarningFilled } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

import { getWithdrawalRiskCaseList, type RiskCaseItem } from '@/api/modules/withdrawalRisk';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';

import RiskCardList from './components/RiskCardList.vue';
import RiskFilters, { type RiskCaseQuery } from './components/RiskFilters.vue';
import RiskTableList from './components/RiskTableList.vue';
import RiskTabs from './components/RiskTabs.vue';

const router = useRouter();
const loading = ref(false);
const list = ref<RiskCaseItem[]>([]);
const total = ref(0);
const page = ref(1);
const limit = ref(15);
const query = reactive<RiskCaseQuery>({
  keyword: '',
  status: undefined,
  started_at: '',
  ended_at: '',
});

async function load() {
  loading.value = true;
  try {
    const result = await getWithdrawalRiskCaseList({
      page: page.value,
      limit: limit.value,
      keyword: query.keyword.trim() || undefined,
      status: query.status,
      started_at: query.started_at || undefined,
      ended_at: query.ended_at || undefined,
    });
    list.value = result.data;
    total.value = result.total;
    page.value = result.current_page;
    limit.value = result.per_page;
  } finally {
    loading.value = false;
  }
}

function search() {
  page.value = 1;
  void load();
}

function reset() {
  Object.assign(query, {
    keyword: '',
    status: undefined,
    started_at: '',
    ended_at: '',
  });
  search();
}

function changePage(value: number) {
  page.value = value;
  void load();
}

function viewDetail(row: RiskCaseItem) {
  void router.push(`/risk/detail/${row.id}`);
}

onMounted(load);
</script>
