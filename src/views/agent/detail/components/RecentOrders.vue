<template>
  <AdminPanel title="交易記錄" :icon="Tickets">
    <template #extra>
      <el-button :icon="Refresh" @click="emit('refresh')">刷新</el-button>
    </template>
    <div class="recent-orders">
      <TransactionTable :data="orders" :loading="loading" @view="emit('view', $event)" />
      <el-empty v-if="!loading && orders.length === 0" description="暫無交易記錄" />
    </div>
    <TransactionCardList :data="orders" @view="emit('view', $event)" />
    <TablePager
      :model-value="page"
      :page-size="pageSize"
      :total="total"
      @update:model-value="emit('update:page', $event)"
      @update:page-size="emit('update:pageSize', $event)"
    />
  </AdminPanel>
</template>

<script setup lang="ts">
import { Refresh, Tickets } from '@element-plus/icons-vue';
import type { AgentRecentTransaction } from '@/api/modules/agent';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import TransactionTable from '@/views/transaction/components/TransactionTable.vue';
import TransactionCardList from '@/views/transaction/components/TransactionCardList.vue';

defineProps<{
  orders: AgentRecentTransaction[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
}>();

const emit = defineEmits<{
  (event: 'refresh'): void;
  (event: 'view', order: AgentRecentTransaction): void;
  (event: 'update:page', page: number): void;
  (event: 'update:pageSize', size: number): void;
}>();
</script>

<style scoped lang="scss">
.recent-orders { min-width: 0; }
</style>
