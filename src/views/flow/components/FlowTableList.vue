<template>
  <el-table class="admin-data-table" :data="data" stripe>
    <el-table-column prop="time" label="时间" sortable min-width="130" />
    <el-table-column prop="agent" label="代理" sortable min-width="220" />
    <el-table-column label="类型" min-width="100">
      <template #default="{ row }">
        <StatusBadge :label="row.type" type="primary" />
      </template>
    </el-table-column>
    <el-table-column prop="id" label="编号" min-width="150" />
    <el-table-column prop="content" label="内容" min-width="190" />
    <el-table-column label="金额" min-width="190">
      <template #default="{ row }">
        <div :class="getAmountClass(row)">
          <strong>{{ row.amount }}</strong>
          <small v-if="row.usd">{{ row.usd }}</small>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="状态" min-width="140">
      <template #default="{ row }">
        <StatusBadge :label="row.status" :type="row.statusType" :effect="row.statusEffect" />
      </template>
    </el-table-column>
    <el-table-column label="操作" width="100" fixed="right">
      <template #default="{ row }">
        <el-button plain size="small" :icon="View" @click="emit('view', row)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { View } from '@element-plus/icons-vue';

import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export interface FlowRow {
  time: string;
  agent: string;
  type: string;
  id: string;
  content: string;
  amount: string;
  usd: string;
  status: string;
  statusType: StatusBadgeType;
  statusEffect?: StatusBadgeEffect;
}

defineProps<{ data: FlowRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: FlowRow): void;
}>();

function getAmountClass(row: FlowRow) {
  return {
    'amount-success': row.amount.startsWith('+'),
    'amount-danger': row.amount.startsWith('-'),
  };
}
</script>

<style scoped lang="scss">
td small {
  display: block;
  margin-top: 5px;
  color: #64748b;
  font-weight: 700;
}
</style>
