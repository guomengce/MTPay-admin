<template>
  <div class="filter-bar">
    <el-input
      v-model="keyword"
      class="filter-bar__keyword filter-bar__keyword--wide"
      placeholder="白名單編號 / 主體 / 公司 / 郵箱"
      clearable
      :prefix-icon="Search"
      @keyup.enter="emit('search')"
    />
    <el-select v-model="role" placeholder="白名單角色" clearable>
      <el-option label="付款人" :value="1" />
      <el-option label="收款人" :value="2" />
    </el-select>
    <el-select v-model="entityType" placeholder="主體類型" clearable>
      <el-option label="公司" :value="1" />
      <el-option label="個人" :value="2" />
    </el-select>
    <div class="filter-bar__actions">
      <el-button type="primary" :icon="Search" :loading="loading" @click="emit('search')">查詢</el-button>
      <el-button :icon="RefreshLeft" @click="emit('reset')">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RefreshLeft, Search } from '@element-plus/icons-vue';
import type { WhitelistQuery } from '../composables/useWhitelistList';

const props = defineProps<{ query: WhitelistQuery; loading?: boolean }>();
const emit = defineEmits<{
  (event: 'update', patch: Partial<WhitelistQuery>): void;
  (event: 'search' | 'reset'): void;
}>();

const keyword = computed({
  get: () => props.query.keyword,
  set: (value: string) => emit('update', { keyword: value }),
});
const role = computed({
  get: () => props.query.role,
  set: (value: 1 | 2 | undefined) => emit('update', { role: value }),
});
const entityType = computed({
  get: () => props.query.entity_type,
  set: (value: 1 | 2 | undefined) => emit('update', { entity_type: value }),
});
</script>

<style scoped lang="scss">
@include mobile {
  .filter-bar__keyword { grid-column: 1 / -1; }
}
</style>
