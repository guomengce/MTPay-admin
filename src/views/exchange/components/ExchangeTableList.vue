<template>
  <div class="exchange-table-list">
  <el-table class="admin-data-table" :data="data" stripe>
    <el-table-column label="编号" min-width="170">
      <template #default="{ row }">
        <div class="row-title">
          <strong>{{ row.id }}</strong>
          <span>{{ row.time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="代理" min-width="240">
      <template #default="{ row }">
        <div class="row-title">
          <strong>{{ row.agent }}</strong>
          <span>{{ row.code }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="支付资产" min-width="180">
      <template #default="{ row }">
        <div class="asset">
          <span>{{ row.amount }}</span>
          <small>{{ row.asset }}</small>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="rate" label="比例" min-width="100" />
    <el-table-column label="获得USD" min-width="160">
      <template #default="{ row }">
        <strong>{{ row.usd }}</strong>
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

export interface ExchangeRow {
  id: string;
  time: string;
  agent: string;
  code: string;
  amount: string;
  asset: string;
  rate: string;
  usd: string;
  status: string;
  statusType: 'pending' | 'success' | 'danger';
}

defineProps<{ data: ExchangeRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: ExchangeRow): void;
  (e: 'approve', row: ExchangeRow): void;
  (e: 'reject', row: ExchangeRow): void;
}>();
</script>

<style scoped lang="scss">
.exchange-table-list {
  display: block;

  @include mobile {
    display: none;
  }
}

.asset {
  display: grid;
  gap: 5px;

  span {
    font-weight: 950;
  }

  small {
    color: #66758b;
    font-weight: 750;
  }
}
</style>