<template>
  <div class="withdrawal-filters filter-bar">
    <el-select v-model="status" placeholder="订单状态" clearable>
      <el-option v-for="item in statusOptions" :key="item.value" v-bind="item" />
    </el-select>
    <el-input
      v-model="keyword"
      placeholder="代理编号 / 公司 / Email"
      clearable
      :prefix-icon="Search"
    />
    <el-input v-model="orderNo" placeholder="订单号" clearable />
    <el-date-picker
      v-model="startedAt"
      type="date"
      placeholder="起始日期"
      value-format="YYYY-MM-DD"
    />
    <el-date-picker
      v-model="endedAt"
      type="date"
      placeholder="结束日期"
      value-format="YYYY-MM-DD"
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
];

const status = computed<WithdrawalStatus | undefined>({
  get: () => props.query.status,
  set: (value) => emit('update', { status: value }),
});
const keyword = computed({
  get: () => props.query.keyword,
  set: (value: string) => emit('update', { keyword: value }),
});
const orderNo = computed({
  get: () => props.query.order_no,
  set: (value: string) => emit('update', { order_no: value }),
});
const startedAt = computed({
  get: () => props.query.started_at,
  set: (value: string) => emit('update', { started_at: value || '' }),
});
const endedAt = computed({
  get: () => props.query.ended_at,
  set: (value: string) => emit('update', { ended_at: value || '' }),
});
</script>

<style scoped lang="scss">
.withdrawal-filters {
  > * {
    min-width: 0;
  }

  @include desktop {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    .filter-bar__actions {
      grid-column: 2 / -1;
    }
  }

  @include wide {
    grid-template-columns:
      minmax(130px, 0.7fr)
      minmax(200px, 1.15fr)
      minmax(170px, 0.9fr)
      minmax(150px, 0.8fr)
      minmax(150px, 0.8fr)
      max-content;
  }

  @include ultra-wide {
    grid-template-columns:
      minmax(130px, 0.7fr)
      minmax(200px, 1.15fr)
      minmax(170px, 0.9fr)
      minmax(150px, 0.8fr)
      minmax(150px, 0.8fr)
      max-content;
  }
}
</style>
