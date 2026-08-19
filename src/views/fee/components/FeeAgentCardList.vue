<template>
  <AdminPanel title="代理专属比例" subtitle="不同代理可设定不同的专属交易比例" :icon="UserFilled">
    <ul v-loading="loading" class="fee-agent-card-list">
      <li v-for="row in rows" :key="row.user_id" class="fee-agent-card-list__item">
        <header class="fee-agent-card-list__head">
          <strong>{{ row.company_name }}</strong>
          <span class="fee-agent-card-list__code">{{ row.agent_code }}</span>
        </header>

        <div class="fee-agent-card-list__metrics">
          <div class="fee-agent-card-list__metric">
            <span>USDT 比例</span>
            <strong>{{ row.usdt_rate }}</strong>
            <small :class="{ 'is-custom': row.usdt_source === '代理专属' }">{{ row.usdt_source }}</small>
          </div>
          <div class="fee-agent-card-list__metric">
            <span>USDC 比例</span>
            <strong>{{ row.usdc_rate }}</strong>
            <small :class="{ 'is-custom': row.usdc_source === '代理专属' }">{{ row.usdc_source }}</small>
          </div>
        </div>

        <div class="fee-agent-card-list__actions">
          <el-button plain :icon="Edit" @click="emit('edit', row)">修改</el-button>
          <el-button
            v-if="row.has_custom_rate"
            type="danger"
            plain
            :icon="RefreshLeft"
            @click="emit('clear', row)"
            >恢复默认</el-button
          >
        </div>
      </li>
    </ul>
  </AdminPanel>
</template>

<script setup lang="ts">
import { Edit, RefreshLeft, UserFilled } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import type { FeeAgentRow } from '../composables/useFeeSettings';

defineProps<{ rows: FeeAgentRow[]; loading?: boolean }>();
const emit = defineEmits<{
  (e: 'edit', row: FeeAgentRow): void;
  (e: 'clear', row: FeeAgentRow): void;
}>();
</script>

<style scoped lang="scss">
.fee-agent-card-list {
  display: grid;
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;

  &__item {
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-width: 0;
    padding: 20px;
    border: 1px solid #dce7f5;
    border-radius: 14px;
    background: #fbfdff;
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;

    strong {
      min-width: 0;
      overflow: hidden;
      color: var(--app-text-heading);
      font-size: 16px;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__code {
    display: inline-flex;
    flex: none;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    color: #126df0;
    background: #e8f1ff;
    font-size: 12px;
    font-weight: 600;
  }

  &__metrics {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 14px;
  }

  &__metric {
    display: grid;
    gap: 6px;
    min-width: 0;
    padding: 12px 14px;
    border: 1px solid #eef3f9;
    border-radius: 10px;
    background: #fff;

    span {
      color: var(--app-text-label);
      font-size: 12px;
      font-weight: 500;
    }

    strong {
      min-width: 0;
      overflow-wrap: anywhere;
      color: #126df0;
      font-family: ui-monospace, Consolas, monospace;
      font-size: 17px;
      font-weight: 600;
    }

    small {
      color: #8794a6;
      font-size: 11px;

      &.is-custom {
        color: #0a7f7a;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 10px;

    .el-button {
      flex: 1;
      min-width: 0;
    }
  }

  @include mobile {
    gap: 12px;

    &__item {
      padding: 16px;
    }

    &__metrics {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }
}
</style>
