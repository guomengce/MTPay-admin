<template>
  <div class="whitelist-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="白名單編號" min-width="180">
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.id }}</strong
            ><span>{{ row.time }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="代理" min-width="190">
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.agent }}</strong
            ><span>{{ row.agentEmail }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="類型" min-width="150">
        <template #default="{ row }">
          <StatusBadge :label="row.type" :type="identityBadgeType(row)" />
        </template>
      </el-table-column>
      <el-table-column label="主體" min-width="220">
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.subject }}</strong
            ><span>{{ row.country }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="狀態" min-width="120">
        <template #default="{ row }">
          <StatusBadge :label="row.status" :type="row.statusType" :effect="row.statusEffect" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" fixed="right">
        <template #default="{ row }">
          <el-dropdown
            trigger="click"
            @command="(command: string | number | object) => handleCommand(command, row)"
          >
            <el-button plain :icon="MoreFilled">操作</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="view" :icon="View">詳情</el-dropdown-item>
                <el-dropdown-item
                  v-if="(row.statusCode === 0 || row.statusCode === 1) && canOperate('whitelist.review')"
                  command="approve"
                  :icon="CircleCheck"
                >通過</el-dropdown-item>
                <template v-if="row.statusCode === 0">
                  <el-dropdown-item v-if="canOperate('whitelist.supplement')" command="supplement" :icon="DocumentAdd"
                    >要求補件</el-dropdown-item
                  >
                </template>
                <el-dropdown-item
                  v-if="(row.statusCode === 0 || row.statusCode === 1) && canOperate('whitelist.review')"
                  command="reject"
                  :icon="CircleClose"
                  >駁回</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="(row.statusCode === 2 || row.statusCode === 4) && canOperate('whitelist.review')"
                  command="toggle-status"
                  :icon="SwitchButton"
                  divided
                >{{ row.statusCode === 2 ? '停用' : '啟用' }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { CircleCheck, CircleClose, DocumentAdd, MoreFilled, SwitchButton, View } from '@element-plus/icons-vue';

import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import { usePermission } from '@/composables/usePermission';
import { getIdentityBadgeType } from '@/utils/identityBadge';
import type { WhitelistRow } from '../composables/mapper';
export type { WhitelistRow } from '../composables/mapper';

defineProps<{ data: WhitelistRow[]; loading?: boolean }>();
const { canOperate } = usePermission();
const emit = defineEmits<{
  (e: 'view' | 'approve' | 'reject' | 'supplement' | 'toggle-status', row: WhitelistRow): void;
}>();

function handleCommand(command: string | number | object, row: WhitelistRow) {
  if (
    command === 'view' ||
    command === 'approve' ||
    command === 'reject' ||
    command === 'supplement' ||
    command === 'toggle-status'
  ) {
    emit(command, row);
  }
}

function identityBadgeType(row: WhitelistRow): StatusBadgeType {
  return getIdentityBadgeType(row.role, row.entityType);
}
</script>

<style scoped lang="scss">
.whitelist-table-list {
  display: block;

  @include mobile {
    display: none;
  }
}
</style>
