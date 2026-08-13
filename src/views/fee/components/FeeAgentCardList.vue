<template>
  <AdminPanel title="代理专属比例" subtitle="不同代理可设定不同的专属交易比例" :icon="UserFilled">
    <ul class="fee-agent-card-list">
      <li
        v-for="row in rows"
        :key="row.code"
        class="fee-agent-card-list__item"
      >
        <header class="fee-agent-card-list__head">
          <strong>{{ row.agent }}</strong>
          <span class="fee-agent-card-list__code">{{ row.code }}</span>
        </header>

        <div class="fee-agent-card-list__metrics">
          <div class="fee-agent-card-list__metric">
            <span>USDT 比例</span>
            <strong>{{ row.usdt }}</strong>
          </div>
          <div class="fee-agent-card-list__metric">
            <span>USDC 比例</span>
            <strong>{{ row.usdc }}</strong>
          </div>
          <div class="fee-agent-card-list__metric fee-agent-card-list__metric--range">
            <span>金额区间（USD）</span>
            <strong>{{ row.min }} ~ {{ row.max }}</strong>
          </div>
        </div>

        <div class="fee-agent-card-list__actions">
          <el-button plain :icon="Edit" @click="emit('edit', row)">修改</el-button>
        </div>
      </li>
    </ul>
  </AdminPanel>
</template>

<script setup lang="ts">
import { Edit, UserFilled } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';

export interface FeeAgentRow {
  agent: string;
  code: string;
  usdt: string;
  usdc: string;
  min: string;
  max: string;
}

defineProps<{ rows: FeeAgentRow[] }>();
const emit = defineEmits<{ (e: 'edit', row: FeeAgentRow): void }>();
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
      color: #061936;
      font-size: 16px;
      font-weight: 950;
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
    font-weight: 850;
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
      color: #66758b;
      font-size: 12px;
      font-weight: 750;
    }

    strong {
      min-width: 0;
      overflow-wrap: anywhere;
      color: #126df0;
      font-size: 17px;
      font-weight: 950;
    }

    &--range {
      grid-column: span 2;

      strong {
        color: #061936;
        font-size: 15px;
        font-weight: 850;
      }
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;

    .el-button {
      min-width: 110px;
    }
  }

  @include mobile {
    gap: 12px;

    &__item {
      padding: 16px;
    }

    &__metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    &__metric {
      padding: 10px 12px;

      strong {
        font-size: 15px;
      }
    }

    &__metric--range {
      grid-column: span 2;

      strong {
        font-size: 13px;
      }
    }

    &__actions .el-button {
      width: 100%;
      min-width: 0;
    }
  }
}
</style>
