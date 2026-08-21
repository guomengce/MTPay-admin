<template>
  <div class="whitelist-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="白名单编号" min-width="180">
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
            ><span>{{ row.agentCode }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="150">
        <template #default="{ row }">
          <StatusBadge :label="row.type" :type="identityBadgeType(row)" />
        </template>
      </el-table-column>
      <el-table-column label="主体" min-width="220">
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.subject }}</strong
            ><span>{{ row.country }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="80">
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
                <el-dropdown-item command="view" :icon="View">详情</el-dropdown-item>
                <template v-if="row.statusCode === 0">
                  <el-dropdown-item command="approve" :icon="CircleCheck">通过</el-dropdown-item>
                  <el-dropdown-item command="supplement" :icon="DocumentAdd"
                    >要求补件</el-dropdown-item
                  >
                </template>
                <el-dropdown-item
                  v-if="row.statusCode === 0 || row.statusCode === 1"
                  command="reject"
                  :icon="CircleClose"
                  >驳回</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { CircleCheck, CircleClose, DocumentAdd, MoreFilled, View } from '@element-plus/icons-vue';

import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import type { WhitelistRow } from '../composables/mapper';
export type { WhitelistRow } from '../composables/mapper';

defineProps<{ data: WhitelistRow[]; loading?: boolean }>();
const emit = defineEmits<{
  (e: 'view' | 'approve' | 'reject' | 'supplement', row: WhitelistRow): void;
}>();

function handleCommand(command: string | number | object, row: WhitelistRow) {
  if (
    command === 'view' ||
    command === 'approve' ||
    command === 'reject' ||
    command === 'supplement'
  ) {
    emit(command, row);
  }
}

function identityBadgeType(row: WhitelistRow): StatusBadgeType {
  if (row.role === '付款人' && row.entityType === '公司') return 'primary';
  if (row.role === '付款人' && row.entityType === '个人') return 'warning';
  if (row.role === '收款人' && row.entityType === '公司') return 'mt';
  return 'success';
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
