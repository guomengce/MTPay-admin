<template>
  <div class="withdrawal-table-list">
  <el-table class="admin-data-table" :data="data" stripe>
    <el-table-column label="编号" min-width="160">
      <template #default="{ row }">
        <div class="row-title">
          <strong>{{ row.id }}</strong>
          <span>{{ row.time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="agent" label="代理" min-width="220" />
    <el-table-column label="付款关系" min-width="310">
      <template #default="{ row }">
        <div class="row-title">
          <strong>{{ row.relation }}</strong>
          <span>{{ row.parties }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="收款" min-width="150">
      <template #default="{ row }">
        <strong>{{ row.amount }}</strong>
      </template>
    </el-table-column>
    <el-table-column prop="fee" label="费用 / 总扣款" min-width="190" />
    <el-table-column label="状态" min-width="150">
      <template #default="{ row }">
        <StatusBadge :label="row.status" :type="row.statusType" />
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="190" fixed="right">
      <template #default="{ row }">
        <div class="action-group">
          <el-button plain size="small" @click="emit('view', row)">详情</el-button>
          <el-button
            v-if="row.statusType === 'process'"
            type="primary"
            size="small"
            @click="emit('complete', row)"
          >
            付款完成
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/admin/StatusBadge.vue';

export interface WithdrawalRow {
  id: string;
  time: string;
  agent: string;
  relation: string;
  parties: string;
  amount: string;
  fee: string;
  status: string;
  statusType: 'process' | 'success' | 'danger';
}

defineProps<{ data: WithdrawalRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: WithdrawalRow): void;
  (e: 'complete', row: WithdrawalRow): void;
}>();
</script>

<style scoped lang="scss">
.withdrawal-table-list {
  display: block;

  @include mobile {
    display: none;
  }
}
</style>