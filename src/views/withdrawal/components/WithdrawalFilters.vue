<template>
  <div class="withdrawal-filters filter-bar">
    <el-input
      v-model="keyword"
      class="filter-bar__keyword filter-bar__keyword--wide"
      placeholder="訂單編號 / 付款人 / 收款人 / 公司 / 郵箱"
      clearable
      :prefix-icon="Search"
      @keyup.enter="emit('search')"
    />
    <el-select v-model="status" placeholder="订单状态" clearable>
      <el-option v-for="item in statusOptions" :key="item.value" v-bind="item" />
    </el-select>
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
      <el-button type="primary" :loading="loading" :icon="Search" @click="emit('search')"
        >查询</el-button
      >
      <el-button plain :icon="RefreshLeft" @click="emit('reset')">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/** 出金列表筛选：仅维护筛选值，接口请求由 useWithdrawalList 统一负责。 */
import { computed } from 'vue';
import { RefreshLeft, Search } from '@element-plus/icons-vue';

import type { WithdrawalStatus } from '@/api/modules/withdrawal';
import type { WithdrawalQuery } from '../composables/useWithdrawalList';

const props = defineProps<{ query: WithdrawalQuery; loading?: boolean }>();
const emit = defineEmits<{
  (e: 'update', patch: Partial<WithdrawalQuery>): void;
  (e: 'search' | 'reset'): void;
}>();

const statusOptions = [
  { value: 0, label: '待审核' },
  { value: 1, label: '待补充文件' },
  { value: 2, label: '付款处理中' },
  { value: 3, label: '已完成' },
  { value: 4, label: '已驳回' },
  { value: 5, label: '付款失败' },
  { value: 6, label: '已取消' },
];

const status = computed<WithdrawalStatus | undefined>({
  get: () => props.query.status,
  set: (value) => emit('update', { status: value }),
});
const keyword = computed({
  get: () => props.query.keyword,
  set: (value: string) => emit('update', { keyword: value }),
});
const dateRange = computed<string[]>({
  get: () =>
    props.query.started_at && props.query.ended_at
      ? [props.query.started_at, props.query.ended_at]
      : [],
  set: (value: string[]) => emit('update', {
    started_at: value?.[0] || '',
    ended_at: value?.[1] || '',
  }),
});
</script>

<style scoped lang="scss">
.withdrawal-filters {
  > * {
    min-width: 0;
  }

  @include mobile {
    .filter-bar__keyword { grid-column: 1 / -1; }
  }
}
</style>
