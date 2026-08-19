<template>
  <AdminPanel title="代理专属比例" subtitle="不同代理可设定不同的专属交易比例" :icon="UserFilled">
    <el-table class="admin-data-table" v-loading="loading" :data="rows" stripe>
      <el-table-column label="代理" min-width="260" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="row-title">
            <strong>{{ row.company_name }}</strong>
            <span>{{ row.agent_code }} · {{ row.email }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="USDT 比例" min-width="170">
        <template #default="{ row }">
          <div class="fee-agent-table__rate">
            <strong>{{ row.usdt_rate }}</strong>
            <span :class="{ 'is-custom': row.usdt_source === '代理专属' }">{{ row.usdt_source }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="USDC 比例" min-width="170">
        <template #default="{ row }">
          <div class="fee-agent-table__rate">
            <strong>{{ row.usdc_rate }}</strong>
            <span :class="{ 'is-custom': row.usdc_source === '代理专属' }">{{ row.usdc_source }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="90">
        <template #default="{ row }">
          <StatusBadge :label="row.status_name" :type="row.status === 1 ? 'success' : 'warning'" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180" fixed="right" align="center">
        <template #default="{ row }">
          <div class="fee-agent-table__actions">
            <el-button plain size="small" :icon="Edit" @click="emit('edit', row)">修改</el-button>
            <el-button
              v-if="row.has_custom_rate"
              type="danger"
              plain
              size="small"
              :icon="RefreshLeft"
              @click="emit('clear', row)"
              >恢复默认</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </AdminPanel>
</template>

<script setup lang="ts">
import { Edit, RefreshLeft, UserFilled } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { FeeAgentRow } from '../composables/useFeeSettings';

defineProps<{ rows: FeeAgentRow[]; loading?: boolean }>();
const emit = defineEmits<{
  (e: 'edit', row: FeeAgentRow): void;
  (e: 'clear', row: FeeAgentRow): void;
}>();
</script>

<style scoped lang="scss">
.fee-agent-table {
  &__rate {
    display: flex;
    align-items: center;
    gap: 8px;

    strong {
      color: var(--app-text-body);
      font-family: ui-monospace, Consolas, monospace;
      font-size: 13px;
    }

    span {
      padding: 2px 8px;
      border-radius: 999px;
      color: #5e7186;
      background: #edf2f6;
      font-size: 11px;
      font-weight: 600;

      &.is-custom {
        color: #0a7f7a;
        background: #e4f6f2;
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    :deep(.el-button + .el-button) {
      margin-left: 0;
    }
  }
}
</style>
