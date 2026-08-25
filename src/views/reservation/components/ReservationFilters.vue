<template>
  <div class="reservation-filters filter-bar">
    <el-input
      v-model="keyword"
      class="filter-bar__keyword filter-bar__keyword--wide"
      :prefix-icon="Search"
      clearable
      placeholder="公司名稱 / 聯絡人 / 企業郵箱"
      @keyup.enter="emit('search')"
    />
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      range-separator="至"
      start-placeholder="開始日期"
      end-placeholder="結束日期"
      value-format="YYYY-MM-DD"
      unlink-panels
    />
    <div class="filter-bar__actions">
      <el-button type="primary" :icon="Search" :loading="loading" @click="emit('search')">查詢</el-button>
      <el-button plain :icon="RefreshLeft" @click="emit('reset')">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RefreshLeft, Search } from '@element-plus/icons-vue';
import type { ReservationQuery } from '../composables/useReservationList';

const props = defineProps<{ query: ReservationQuery; loading?: boolean }>();
const emit = defineEmits<{
  (event: 'update', patch: Partial<ReservationQuery>): void;
  (event: 'search' | 'reset'): void;
}>();

const keyword = computed({
  get: () => props.query.keyword,
  set: (value: string) => emit('update', { keyword: value }),
});
const dateRange = computed<string[]>({
  get: () => props.query.started_at && props.query.ended_at
    ? [props.query.started_at, props.query.ended_at]
    : [],
  set: (value) => emit('update', {
    started_at: value?.[0] || '',
    ended_at: value?.[1] || '',
  }),
});
</script>

<style scoped lang="scss">
@include mobile {
  .reservation-filters .filter-bar__keyword { grid-column: 1 / -1; }
}
</style>
