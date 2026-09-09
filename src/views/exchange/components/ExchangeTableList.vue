<template>
  <div class="exchange-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="編號" min-width="170">
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.id }}</strong>
            <span>{{ row.time }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="代理" min-width="180">
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.agent }}</strong>
            <span>{{ row.code }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="支付資產" min-width="160">
        <template #default="{ row }">
          <div class="asset">
            <span>{{ formatMoney(row.amount) }}</span>
            <small>{{ row.asset }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="比例" min-width="120" />
      <el-table-column label="獲得USD" min-width="160">
        <template #default="{ row }">
          <div class="asset">
            <strong>{{ formatMoney(row.usd) }}</strong>
            <small>{{ row.toSymbol }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="狀態" min-width="100">
        <template #default="{ row }">
          <StatusBadge :label="row.status" :type="row.statusType" :effect="row.statusEffect" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-dropdown trigger="click" @command="handleCommand($event, row)">
            <el-button plain size="small" :icon="MoreFilled">操作</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="view" :icon="View">詳情</el-dropdown-item>
                <template v-if="row.statusEffect === 'pending'">
                  <el-dropdown-item v-if="canOperate('cryptoExchange.review')" command="approve" :icon="CircleCheck">
                    <span class="review-command">通過</span>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="canOperate('cryptoExchange.review')" command="reject" :icon="CircleClose">
                    <span class="review-command">拒絕</span>
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { formatMoney } from '@/utils/formatMoney';

import { CircleCheck, CircleClose, MoreFilled, View } from '@element-plus/icons-vue';

import StatusBadge from '@/components/admin/StatusBadge.vue';
import { usePermission } from '@/composables/usePermission';

import type { ExchangeRow } from '../composables/mapper';
export type { ExchangeRow } from '../composables/mapper';

defineProps<{ data: ExchangeRow[]; loading?: boolean }>();
const { canOperate } = usePermission();
const emit = defineEmits<{
  (e: 'view', row: ExchangeRow): void;
  (e: 'approve', row: ExchangeRow): void;
  (e: 'reject', row: ExchangeRow): void;
}>();

function handleCommand(command: string | number | object, row: ExchangeRow) {
  if (command === 'view') emit('view', row);
  if (command === 'approve') emit('approve', row);
  if (command === 'reject') emit('reject', row);
}
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
    font-weight: 600;
  }

  small {
    color: var(--app-text-label);
    font-weight: 700;
    color:#048F8F;
  }
}

.review-command {
  font-weight: 600;
}
</style>
