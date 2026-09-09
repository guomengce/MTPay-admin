<template>
  <div class="risk-filters filter-bar">
    <el-input
      v-model="keyword"
      class="filter-bar__keyword filter-bar__keyword--wide"
      clearable
      :prefix-icon="Search"
      placeholder="案件編號 / 出金訂單號 / 代理 / 郵箱"
      @keyup.enter="emit('search')"
    />
    <el-select v-model="status" clearable placeholder="案件狀態">
      <el-option
        v-for="(item, key) in caseStatusMap"
        :key="key"
        :value="Number(key)"
        :label="item.label"
      />
    </el-select>
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      value-format="YYYY-MM-DD"
      range-separator="至"
      start-placeholder="開始日期"
      end-placeholder="結束日期"
    />
    <div class="filter-bar__actions">
      <el-button type="primary" :icon="Search" :loading="loading" @click="emit('search')"
        >查詢</el-button
      >
      <el-button plain :icon="RefreshLeft" @click="emit('reset')">重置</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import type { RiskCaseStatus } from '@/api/modules/withdrawalRisk';

export interface RiskCaseQuery {
  keyword: string;
  status?: RiskCaseStatus;
  started_at: string;
  ended_at: string;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { RefreshLeft, Search } from '@element-plus/icons-vue';
import { caseStatusMap } from '../presentation';

const props = defineProps<{ query: RiskCaseQuery; loading?: boolean }>();
const emit = defineEmits<{
  (event: 'update', patch: Partial<RiskCaseQuery>): void;
  (event: 'search' | 'reset'): void;
}>();

const keyword = computed({
  get: () => props.query.keyword,
  set: (value: string) => emit('update', { keyword: value }),
});
const status = computed({
  get: () => props.query.status,
  set: (value) => emit('update', { status: value }),
});
const dateRange = computed<string[]>({
  get: () =>
    props.query.started_at && props.query.ended_at
      ? [props.query.started_at, props.query.ended_at]
      : [],
  set: (value) => emit('update', { started_at: value?.[0] || '', ended_at: value?.[1] || '' }),
});
</script>

<style scoped lang="scss">
@include mobile {
  .risk-filters .filter-bar__keyword {
    grid-column: 1 / -1;
  }
}
</style>
