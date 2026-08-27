<template>
  <div class="filter-bar">
    <el-input
      :model-value="query.keyword"
      :class="['filter-bar__keyword', { 'filter-bar__keyword--wide': wideKeyword }]"
      :placeholder="keywordPlaceholder"
      clearable
      :prefix-icon="Search"
      @update:model-value="updateKeyword"
      @keyup.enter="emit('search')"
    />
    <el-select v-if="showStatus" :model-value="query.status" placeholder="訂單狀態" clearable @update:model-value="updateStatus">
      <el-option label="待審核" :value="0" />
      <el-option :label="completedLabel" :value="1" />
      <el-option label="已駁回" :value="2" />
    </el-select>
    <el-date-picker
      :model-value="dateRange"
      type="daterange"
      range-separator="至"
      start-placeholder="開始日期"
      end-placeholder="結束日期"
      value-format="YYYY-MM-DD"
      unlink-panels
      @update:model-value="updateDateRange"
    />
    <div class="filter-bar__actions">
      <el-button type="primary" :icon="Search" :loading="loading" @click="emit('search')">查詢</el-button>
      <el-button :icon="RefreshLeft" @click="emit('reset')">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RefreshLeft, Search } from '@element-plus/icons-vue';

export interface ReviewFilterQuery {
  status?: 0 | 1 | 2;
  keyword: string;
  started_at: string;
  ended_at: string;
}

const props = withDefaults(defineProps<{
  query: ReviewFilterQuery;
  keywordPlaceholder: string;
  completedLabel: string;
  wideKeyword?: boolean;
  loading?: boolean;
  showStatus?: boolean;
}>(), { showStatus: true });

const emit = defineEmits<{
  (event: 'update', patch: Partial<ReviewFilterQuery>): void;
  (event: 'search' | 'reset'): void;
}>();

const dateRange = computed(() =>
  props.query.started_at && props.query.ended_at
    ? [props.query.started_at, props.query.ended_at]
    : [],
);

function updateStatus(value: 0 | 1 | 2 | undefined) {
  emit('update', { status: value });
}

function updateKeyword(value: string) {
  emit('update', { keyword: value });
}

function updateDateRange(value: string[] | null) {
  emit('update', {
    started_at: value?.[0] || '',
    ended_at: value?.[1] || '',
  });
}
</script>

<style scoped lang="scss">
@include mobile {
  .filter-bar__keyword,
  .el-date-editor {
    grid-column: 1 / -1;
  }
}
</style>
