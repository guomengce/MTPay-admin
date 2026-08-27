<template>
  <section class="admin-page currency-page">
    <AdminHero title="幣種管理" :icon="Coin">
      <template #extra><el-button type="primary" :icon="Plus" @click="dialogVisible = true">新增幣種</el-button></template>
    </AdminHero>
    <AdminPanel>
      <CurrencyFilters v-model:keyword="keyword" v-model:status="status" @search="search" @reset="resetFilters" />
      <CurrencyTable :data="list" :loading="loading" @toggle-status="changeStatus" />
      <CurrencyCardList :data="list" :loading="loading" @toggle-status="changeStatus" />
      <TablePager v-model="page" v-model:page-size="limit" :total="total" />
    </AdminPanel>
    <AddCurrencyDialog v-model="dialogVisible" :submitting="adding" @submit="submitCurrency" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Coin, Plus } from '@element-plus/icons-vue';
import type { AddCurrencyPayload } from '@/api/modules/currency';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import AddCurrencyDialog from './components/AddCurrencyDialog.vue';
import CurrencyCardList from './components/CurrencyCardList.vue';
import CurrencyFilters from './components/CurrencyFilters.vue';
import CurrencyTable from './components/CurrencyTable.vue';
import { useCurrencyManagement } from './composables/useCurrencyManagement';
const dialogVisible = ref(false);
const { list, loading, adding, page, limit, total, keyword, status, search, resetFilters, createCurrency, changeStatus } = useCurrencyManagement();
async function submitCurrency(payload: AddCurrencyPayload) { if (await createCurrency(payload)) dialogVisible.value = false; }
</script>

<style scoped lang="scss">.currency-page { gap: 22px; }</style>
