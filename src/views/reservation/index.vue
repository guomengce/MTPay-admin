<template>
  <section class="admin-page reservation-page">
    <AdminHero title="官網預約" :icon="Calendar" />
    <AdminPanel>
      <ReservationFilters
        :query="query"
        :loading="loading"
        @update="Object.assign(query, $event)"
        @search="search"
        @reset="reset"
      />
      <ReservationTableList :data="list" :loading="loading" />
      <ReservationCardList :data="list" :loading="loading" />
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
import { onMounted } from 'vue';
import { Calendar } from '@element-plus/icons-vue';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import ReservationFilters from './components/ReservationFilters.vue';
import ReservationTableList from './components/ReservationTableList.vue';
import ReservationCardList from './components/ReservationCardList.vue';
import { useReservationList } from './composables/useReservationList';

const { loading, list, total, page, limit, query, loadList, search, reset, setPage, setLimit } = useReservationList();
onMounted(loadList);
</script>
