<template>
  <div class="deposit-table-list">
  <el-table
    class="admin-data-table"
    :data="data"
    :row-class-name="getRowClassName"
    stripe
  >
    <el-table-column label="编号" min-width="170">
      <template #default="{ row }">
        <div class="row-title">
          <strong>{{ row.id }}</strong>
          <span>{{ row.time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="agent" label="代理" min-width="220" />
    <el-table-column label="资产 / 网络" min-width="140">
      <template #default="{ row }">
        <div class="asset">
          <span>{{ row.asset }}</span>
          <small>{{ row.network }}</small>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="hash" label="交易哈希" min-width="190" />
    <el-table-column label="申报金额" min-width="150">
      <template #default="{ row }">
        <strong>{{ row.amount }}</strong>
        <small class="asset-currency">{{ row.asset }}</small>
      </template>
    </el-table-column>
    <el-table-column label="状态" min-width="130">
      <template #default="{ row }">
        <StatusBadge :label="row.status" :type="row.statusType" />
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="220" fixed="right">
      <template #default="{ row }">
        <div class="action-group">
          <el-button plain size="small" @click="emit('view', row)">详情</el-button>
          <el-button
            v-if="row.statusType === 'pending'"
            type="success"
            size="small"
            @click="emit('approve', row)"
          >
            通过
          </el-button>
          <el-button
            v-if="row.statusType === 'pending'"
            type="danger"
            plain
            size="small"
            @click="emit('reject', row)"
          >
            拒绝
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/admin/StatusBadge.vue';

export interface DepositRow {
  id: string;
  time: string;
  agent: string;
  asset: string;
  network: string;
  hash: string;
  amount: string;
  status: string;
  statusType: 'pending' | 'success' | 'danger';
}

defineProps<{ data: DepositRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: DepositRow): void;
  (e: 'approve', row: DepositRow): void;
  (e: 'reject', row: DepositRow): void;
}>();

function getRowClassName({ row }: { row: DepositRow }) {
  return row.statusType === 'pending' ? 'is-pending' : '';
}
</script>

<style scoped lang="scss">
/* PC 显示，移动端隐藏（跟随全局 mobile 断点 ≤768px） */
.deposit-table-list {
  display: block;

  @include mobile {
    display: none;
  }
}

.asset {
  display: grid;
  gap: 6px;

  span {
    font-size: 18px;
    font-weight: 950;
  }

  small,
  .asset-currency {
    color: #126df0;
    font-weight: 850;
  }
}
</style>