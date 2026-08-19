<template>
  <div class="currency-filters filter-bar">
    <el-input
      :model-value="keyword"
      clearable
      maxlength="100"
      placeholder="搜索币种代码或名称"
      :prefix-icon="Search"
      @update:model-value="emit('update:keyword', String($event))"
      @keyup.enter="emit('search')"
    />
    <el-select
      :model-value="status"
      clearable
      placeholder="全部状态"
      @update:model-value="emit('update:status', $event as CurrencyStatus | undefined)"
    >
      <el-option label="启用" :value="1" />
      <el-option label="禁用" :value="0" />
    </el-select>
    <div class="filter-bar__actions">
      <el-button type="primary" :icon="Search" @click="emit('search')">查询</el-button>
      <el-button plain :icon="RefreshLeft" @click="emit('reset')">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RefreshLeft, Search } from '@element-plus/icons-vue';

import type { CurrencyStatus } from '@/api/modules/currency';

defineProps<{
  keyword: string;
  status?: CurrencyStatus;
}>();

const emit = defineEmits<{
  (event: 'update:keyword', value: string): void;
  (event: 'update:status', value: CurrencyStatus | undefined): void;
  (event: 'search'): void;
  (event: 'reset'): void;
}>();
</script>

<style scoped lang="scss">
.currency-filters {
  @media (min-width: $desktop-min) {
    grid-template-columns: minmax(220px, 1fr) 160px auto;
  }
}
</style>
