<template>
  <AdminPanel class="task-panel" title="待处理业务" :icon="DocumentChecked">
    <div class="task-grid">
      <RouterLink v-for="task in tasks" :key="task.title" :to="task.to" class="task-link">
        <el-card class="task-card" :class="`task-card--${task.tone}`" shadow="never">
          <span class="task-card__icon">
            <el-icon><component :is="task.icon" /></el-icon>
          </span>
          <h3>{{ task.title }}</h3>
          <strong>{{ task.count }}</strong>
          <small>
            <i></i>
            {{ task.note }}
          </small>
        </el-card>
      </RouterLink>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { DocumentChecked, Download, Switch, Tickets, Wallet } from '@element-plus/icons-vue';
import { RouterLink } from 'vue-router';

import AdminPanel from '@/components/admin/AdminPanel.vue';

const tasks = [
  { title: '入金审核', note: '待确认收款', count: 1, to: '/deposit', icon: Download, tone: 'teal' },
  { title: '兑换审核', note: '待审核', count: 1, to: '/exchange', icon: Switch, tone: 'teal' },
  { title: '白名单审核', note: '待审核', count: 1, to: '/whitelist', icon: Tickets, tone: 'blue' },
  {
    title: '出金申请',
    note: '暂无待处理',
    count: 0,
    to: '/withdrawal',
    icon: Wallet,
    tone: 'muted',
  },
];
</script>

<style scoped lang="scss">
.task-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding: 22px 18px 24px;
}

.task-link {
  min-width: 0;
}

.task-card {
  min-height: 230px;
  border: 1px solid #dbe7f5;
  border-radius: 8px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  box-shadow: 0 20px 46px rgb(15 35 71 / 6%);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  :deep(.el-card__body) {
    display: grid;
    height: 100%;
    min-height: 230px;
    justify-items: center;
    align-content: center;
    gap: 14px;
    padding: 22px 12px 18px;
    text-align: center;
  }

  &:hover {
    border-color: #9fded8;
    box-shadow: 0 26px 60px rgb(8 112 128 / 12%);
    transform: translateY(-2px);
  }

  &__icon {
    display: inline-flex;
    width: 72px;
    height: 72px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--task-tone);
    background:
      radial-gradient(circle at 50% 38%, rgb(255 255 255 / 70%), transparent 42%),
      color-mix(in srgb, var(--task-tone) 14%, white);
    font-size: 36px;
  }

  h3 {
    margin: 6px 0 0;
    color: #061936;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.2;
  }

  strong {
    color: #001b42;
    font-size: 32px;
    font-weight: 950;
    line-height: 0.95;
  }

  small {
    display: inline-flex;
    min-width: 0;
    width: 100%;
    max-width: 140px;
    height: 36px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 14px;
    border-radius: 8px;
    color: var(--task-tone);
    background: color-mix(in srgb, var(--task-tone) 9%, #f7fafc);
    font-size: 14px;
    font-weight: 900;
    white-space: nowrap;

    i {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
    }
  }

  &--teal {
    --task-tone: #0aa99a;
  }

  &--blue {
    --task-tone: #1f73f2;
  }

  &--muted {
    --task-tone: #708099;
  }
}

@include narrow {
  .task-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    padding: 24px;
  }
}

@include mobile {
  .task-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 14px;
  }

  .task-card {
    min-height: 0;

    :deep(.el-card__body) {
      display: grid;
      grid-template-columns: 48px minmax(0, 1fr) auto;
      min-height: 0;
      align-items: center;
      justify-items: stretch;
      gap: 12px;
      padding: 14px;
      text-align: left;
    }

    h3 {
      margin: 0 0 5px;
      font-size: 17px;
      line-height: 1.2;
    }

    strong {
      grid-column: 2;
      color: var(--task-tone);
      font-size: 24px;
      line-height: 1;
    }

    &__icon {
      grid-row: 1 / span 2;
      width: 48px;
      height: 48px;
      font-size: 26px;
    }

    small {
      grid-column: 3;
      grid-row: 1 / span 2;
      width: auto;
      max-width: 118px;
      height: 32px;
      justify-self: end;
      padding: 0 10px;
      font-size: 12px;
    }
  }
}
</style>
