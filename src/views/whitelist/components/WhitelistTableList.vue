<template>
  <div class="whitelist-table-list">
    <el-table class="admin-data-table" :data="data" stripe>
      <el-table-column label="编号" min-width="150">
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.id }}</strong>
            <span>{{ row.time }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="agent" label="代理" min-width="220" />
      <el-table-column label="类型" min-width="130">
        <template #default="{ row }">
          <StatusBadge :label="row.type" type="primary" />
        </template>
      </el-table-column>
      <el-table-column label="主体" min-width="240">
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.subject }}</strong>
            <span>{{ row.country }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="关键资料" min-width="250">
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.bank }}</strong>
            <span>{{ row.account }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="130">
        <template #default="{ row }">
          <StatusBadge :label="row.status" :type="row.statusType" :effect="row.statusEffect" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" fixed="right">
        <template #default="{ row }">
          <el-dropdown trigger="click" @command="(command) => handleCommand(command, row)">
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

export interface WhitelistRow {
  id: string;
  time: string;
  agent: string;
  type: string;
  subject: string;
  country: string;
  bank: string;
  account: string;
  status: string;
  statusType: 'warning' | 'success' | 'danger';
  statusEffect?: 'pending';
}

defineProps<{ data: WhitelistRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: WhitelistRow): void;
  (e: 'approve', row: WhitelistRow): void;
  (e: 'reject', row: WhitelistRow): void;
}>();

function handleCommand(command: string | number | object, row: WhitelistRow) {
  if (command === 'view') emit('view', row);
  if (command === 'approve') emit('approve', row);
  if (command === 'reject') emit('reject', row);
}
</script>

<style scoped lang="scss">
.whitelist-table-list {
  display: block;

  @include mobile {
    display: none;
  }
}

.review-command {
  font-weight: 850;

  &--success {
    color: #16a34a;
  }

  &--danger {
    color: #dc2626;
  }
}
</style>
