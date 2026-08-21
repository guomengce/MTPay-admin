<template>
  <div class="agent-filters filter-bar">
    <el-input
      :model-value="keyword"
      clearable
      placeholder="搜索编号、公司、Email 或电话"
      :prefix-icon="Search"
      @update:model-value="emit('update:keyword', String($event))"
      @keyup.enter="emit('search')"
    />
    <el-select
      :model-value="status"
      clearable
      placeholder="全部状态"
      @update:model-value="emit('update:status', $event as number | undefined)"
    >
      <el-option label="待激活" :value="0" />
      <el-option label="正常" :value="1" />
      <el-option label="暂停" :value="2" />
      <el-option label="停用" :value="3" />
    </el-select>
    <div class="filter-bar__actions">
      <el-button type="primary" :icon="Search" @click="emit('search')">查询</el-button>
      <el-button plain :icon="RefreshLeft" @click="emit('reset')">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RefreshLeft, Search } from '@element-plus/icons-vue';

defineProps<{ keyword: string; status?: number }>();
const emit = defineEmits<{
  (event: 'update:keyword', value: string): void;
  (event: 'update:status', value: number | undefined): void;
  (event: 'search'): void;
  (event: 'reset'): void;
}>();
</script>

<style scoped lang="scss">
.agent-filters {
  @media (min-width: $desktop-min) {
    grid-template-columns: minmax(260px, 250px) 180px auto;
  }
}
</style>
