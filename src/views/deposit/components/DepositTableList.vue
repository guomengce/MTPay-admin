<template>
  <div class="deposit-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="編號" min-width="170">
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.id }}</strong>
            <span>{{ row.time }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="agent" label="代理" min-width="220" />
      <el-table-column label="資產 / 網絡" min-width="140">
        <template #default="{ row }">
          <div class="asset">
            <span>{{ row.asset }}</span>
            <small>{{ row.network }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="交易哈希" min-width="230"><template #default="{row}"><span class="hash-cell">{{formatLongIdentifier(row.hash)}}</span></template></el-table-column>
      <el-table-column label="申報金額" min-width="150">
        <template #default="{ row }">
          <div class="asset">
            <strong>{{ formatMoney(row.amount) }}</strong>
            <small class="asset-currency">{{ row.asset }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="狀態" min-width="130">
        <template #default="{ row }">
          <StatusBadge :label="row.status" :type="row.statusType" :effect="row.statusEffect" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" fixed="right">
        <template #default="{ row }">
          <div class="fee-agent-table__actions">
            <el-button plain type="primary" size="small" :icon="View" @click="emit('view', row)">詳情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import { View } from '@element-plus/icons-vue';

import StatusBadge from '@/components/admin/StatusBadge.vue';
import { formatLongIdentifier } from '@/utils/text';

import type { DepositRow } from '../composables/mapper';
export type { DepositRow } from '../composables/mapper';

defineProps<{ data: DepositRow[]; loading?: boolean }>();
const emit = defineEmits<{
  (e: 'view', row: DepositRow): void;
}>();
</script>

<style scoped lang="scss">
/* PC 顯示，移動端隱藏（跟隨全局 mobile 斷點 ≤768px） */
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
    font-weight: 600;
  }

  small,
  .asset-currency {
    color: #048F8F;
    font-weight: 600;
  }
}

.hash-cell { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
</style>
