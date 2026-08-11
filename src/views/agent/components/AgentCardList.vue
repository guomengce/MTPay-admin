<template>
  <div class="agent-card-list">
  <ul class="agent-cards">
    <li v-for="row in data" :key="row.code" class="agent-card">
      <header class="agent-card__head">
        <span class="agent-card__avatar">{{ row.avatar }}</span>
        <div class="agent-card__id">
          <strong>{{ row.name }}</strong>
          <small>{{ row.code }}</small>
        </div>
        <StatusBadge label="正常使用" />
      </header>

      <dl class="agent-card__contact">
        <div>
          <dt><el-icon><Message /></el-icon>Email</dt>
          <dd>{{ row.email }}</dd>
        </div>
        <div>
          <dt><el-icon><Phone /></el-icon>电话</dt>
          <dd>{{ row.phone }}</dd>
        </div>
      </dl>

      <div class="agent-card__rates">
        <div class="rate-block">
          <small>USDT 比例</small>
          <span class="rate-chip rate-chip--teal">{{ row.usdt }}</span>
        </div>
        <div class="rate-block">
          <small>USDC 比例</small>
          <span class="rate-chip rate-chip--blue">{{ row.usdc }}</span>
        </div>
      </div>

      <div class="agent-card__balance">
        <small>USD 可用余额</small>
        <strong>{{ row.balance }}</strong>
      </div>

      <footer class="agent-card__actions">
        <el-button class="agent-card__action" @click="emit('edit', row)">编辑</el-button>
        <el-button type="primary" class="agent-card__action" @click="emit('settings', row)">设定</el-button>
      </footer>
    </li>
  </ul>
  </div>
</template>

<script setup lang="ts">
import { Message, Phone } from '@element-plus/icons-vue';

import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { AgentRow } from './AgentTableList.vue';

defineProps<{ data: AgentRow[] }>();
const emit = defineEmits<{
  (e: 'edit', row: AgentRow): void;
  (e: 'settings', row: AgentRow): void;
}>();
</script>

<style scoped lang="scss">
/* 默认隐藏，≤768px（全局 mobile 断点）显示 */
.agent-card-list {
  display: none;

  @include mobile {
    display: block;
  }
}

.agent-cards {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.agent-card {
  display: grid;
  gap: 14px;
  padding: 18px 18px 14px;
  border: 1px solid #e3ebf4;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgb(16 42 80 / 5%);

  &__head {
    display: grid;
    grid-template-columns: 48px 1fr auto;
    align-items: center;
    gap: 12px;
  }

  &__avatar {
    display: inline-flex;
    width: 48px;
    height: 48px;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    color: #ffffff;
    background: linear-gradient(135deg, #17c4ad, #1f73f2);
    font-size: 22px;
    font-weight: 950;
  }

  &__id {
    display: grid;
    gap: 4px;
    min-width: 0;

    strong {
      color: #071833;
      font-size: 16px;
      font-weight: 900;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    small {
      color: #7a8aa1;
      font-size: 12px;
      font-weight: 700;
    }
  }

  &__contact {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 12px 14px;
    border: 1px solid #eef2f7;
    border-radius: 10px;
    background: #f8fbfd;

    div {
      display: grid;
      grid-template-columns: 70px 1fr;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    dt {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin: 0;
      color: #6f7e94;
      font-size: 12px;
      font-weight: 800;
    }

    dd {
      margin: 0;
      color: #1f2a37;
      font-size: 13px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .el-icon {
      font-size: 13px;
    }
  }

  &__rates {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .rate-block {
    display: grid;
    gap: 6px;
    padding: 10px 12px;
    border: 1px solid #eef2f7;
    border-radius: 10px;
    background: #fbfdff;

    small {
      color: #6f7e94;
      font-size: 12px;
      font-weight: 800;
    }
  }

  .rate-chip {
    justify-self: start;
    display: inline-flex;
    height: 30px;
    align-items: center;
    padding: 0 14px;
    border-radius: 999px;
    font-weight: 950;

    &--teal {
      color: #049787;
      background: #d8f7f0;
    }

    &--blue {
      color: #126df0;
      background: #deecff;
    }
  }

  &__balance {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 12px 14px;
    border: 1px solid #eef2f7;
    border-radius: 10px;
    background: #fbfdff;

    small {
      color: #6f7e94;
      font-size: 12px;
      font-weight: 800;
    }

    strong {
      color: #071833;
      font-size: 18px;
      font-weight: 900;
    }
  }

  &__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding-top: 4px;
  }

  &__action {
    width: 100%;
  }
}
</style>