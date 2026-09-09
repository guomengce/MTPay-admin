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
    <el-select v-model="status" placeholder="訂單狀態" clearable>
      <el-option v-for="item in statusOptions" :key="item.value" v-bind="item" />
    </el-select>
    <el-select v-model="riskLevel" placeholder="風險等級" clearable><el-option label="低風險" :value="1"/><el-option label="中風險" :value="2"/><el-option label="高風險" :value="3"/></el-select>
    <el-select v-model="riskStatus" placeholder="風控狀態" clearable><el-option v-for="item in riskStatusOptions" :key="item.value" v-bind="item"/></el-select>
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
        >查詢</el-button
      >
      <el-button plain :icon="RefreshLeft" @click="emit('reset')">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/** 法幣出金列表篩選：僅維護篩選值，接口請求由 useWithdrawalList 統一負責。 */
import { computed } from 'vue';
import { RefreshLeft, Search } from '@element-plus/icons-vue';

import type { WithdrawalStatus } from '@/api/modules/withdrawal';
import type { RiskLevel, RiskStatus } from '@/api/modules/withdrawalRisk';
import type { WithdrawalQuery } from '../composables/useWithdrawalList';

const props = defineProps<{ query: WithdrawalQuery; loading?: boolean }>();
const emit = defineEmits<{
  (e: 'update', patch: Partial<WithdrawalQuery>): void;
  (e: 'search' | 'reset'): void;
}>();

const statusOptions = [
  { value: 0, label: '待審核' },
  { value: 1, label: '待補充文件' },
  { value: 2, label: '付款處理中' },
  { value: 3, label: '已完成' },
  { value: 4, label: '已駁回' },
  { value: 5, label: '付款失敗' },
  { value: 6, label: '已取消' },
];
const riskStatusOptions = ['系統通過','加強核查','待風控覆核','待補件','已放行','已拒絕'].map((label,index)=>({label,value:index+1}));

const status = computed<WithdrawalStatus | undefined>({
  get: () => props.query.status,
  set: (value) => emit('update', { status: value }),
});
const keyword = computed({
  get: () => props.query.keyword,
  set: (value: string) => emit('update', { keyword: value }),
});
const riskLevel = computed<RiskLevel|undefined>({get:()=>props.query.risk_level,set:value=>emit('update',{risk_level:value})});
const riskStatus = computed<RiskStatus|undefined>({get:()=>props.query.risk_status,set:value=>emit('update',{risk_status:value})});
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
