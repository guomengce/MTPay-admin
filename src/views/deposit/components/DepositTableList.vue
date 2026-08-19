<template>
  <div class="deposit-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
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
      <el-table-column prop="hash" show-overflow-tooltip label="交易哈希" min-width="190" />
      <el-table-column label="申报金额" min-width="150">
        <template #default="{ row }">
          <strong>{{ row.amount }}</strong>
          <small class="asset-currency">{{ row.asset }}</small>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="130">
        <template #default="{ row }">
          <StatusBadge :label="row.status" :type="row.statusType" :effect="row.statusEffect" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" fixed="right">
        <template #default="{ row }">
          <el-dropdown trigger="click" @command="handleCommand($event, row)">
            <el-button plain size="small" :icon="MoreFilled">操作</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="view" :icon="View">详情</el-dropdown-item>
                <template v-if="row.statusEffect === 'pending'">
                  <el-dropdown-item command="approve" :icon="CircleCheck">
                    <span class="review-command review-command--success">通过</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="reject" :icon="CircleClose">
                    <span class="review-command review-command--danger">拒绝</span>
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
import { CircleCheck, CircleClose, MoreFilled, View } from '@element-plus/icons-vue';

import StatusBadge from '@/components/admin/StatusBadge.vue';

import type { DepositRow } from '../composables/mapper';
export type { DepositRow } from '../composables/mapper';

defineProps<{ data: DepositRow[]; loading?: boolean }>();
const emit = defineEmits<{
  (e: 'view', row: DepositRow): void;
  (e: 'approve', row: DepositRow): void;
  (e: 'reject', row: DepositRow): void;
}>();

function handleCommand(command: string | number | object, row: DepositRow) {
  if (command === 'view') emit('view', row);
  if (command === 'approve') emit('approve', row);
  if (command === 'reject') emit('reject', row);
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
    font-weight: 600;
  }

  small,
  .asset-currency {
    color: #126df0;
    font-weight: 600;
  }
}

.review-command {
  font-weight: 600;

  &--success {
    color: #16a34a;
  }

  &--danger {
    color: #dc2626;
  }
}
</style>
