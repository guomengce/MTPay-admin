<template>
  <AdminPanel class="task-panel" title="待处理业务" subtitle="需要管理员审核、补件或付款处理">
    <template #extra>
      <span class="task-panel__count"><i />{{ total }} 项</span>
    </template>

    <div class="task-grid">
      <RouterLink v-for="task in tasks" :key="task.title" :to="task.to" class="task-card">
        <span class="task-card__icon" :class="`task-card__icon--${task.tone}`">
          <el-icon><component :is="task.icon" /></el-icon>
        </span>
        <div class="task-card__amount">
          <strong>{{ task.count }}</strong>
          <small>笔</small>
        </div>
        <div class="task-card__body">
          <strong>{{ task.title }}审核</strong>
          <span>{{ task.note }}</span>
        </div>
        <span class="task-card__arrow"
          ><el-icon><ArrowRight /></el-icon
        ></span>
      </RouterLink>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { ArrowRight, Download, Switch, Tickets, Wallet } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import type { OperationPendingBusinesses } from '@/api/modules/dashboard';
import AdminPanel from '@/components/admin/AdminPanel.vue';

const props = defineProps<{ pending: OperationPendingBusinesses | null }>();

const tasks = computed(() => [
  {
    title: '入金',
    note: '等待确认收款',
    count: props.pending?.deposit ?? 0,
    to: '/deposit',
    icon: Download,
    tone: 'blue',
  },
  {
    title: '兑换',
    note: '等待管理员审核',
    count: props.pending?.exchange ?? 0,
    to: '/exchange',
    icon: Switch,
    tone: 'purple',
  },
  {
    title: '白名单',
    note: '待审核或补件处理',
    count: props.pending?.whitelist ?? 0,
    to: '/whitelist',
    icon: Tickets,
    tone: 'amber',
  },
  {
    title: '出金',
    note: '待审核、补件或付款',
    count: props.pending?.withdrawal ?? 0,
    to: '/withdrawal',
    icon: Wallet,
    tone: 'teal',
  },
]);

const total = computed(() => props.pending?.total ?? 0);
</script>

<style scoped lang="scss">
.task-panel {
  position: relative;
  min-height: 344px;
  border-color: #d5e3ed;
  background:
    radial-gradient(circle at 0% 100%, rgb(30 190 179 / 7%), transparent 30%),
    rgb(255 255 255 / 96%);
  box-shadow: 0 18px 42px rgb(13 49 80 / 8%);

  &::before {
    content: '';
    position: absolute;
    z-index: 2;
    top: 0;
    left: 20px;
    width: 96px;
    height: 2px;
    background: linear-gradient(90deg, #21c5b4, transparent);
  }

  :deep(.admin-panel__header) {
    padding: 18px 20px;
  }

  :deep(.admin-panel__title) {
    gap: 0;
  }

  &__count {
    display: inline-flex;
    height: 29px;
    align-items: center;
    gap: 7px;
    padding: 0 11px;
    border-radius: 999px;
    color: #537082;
    background: #f0f5f6;
    font-size: 12px;
    font-weight: 700;

    i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #079b91;
    }
  }
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  padding: 18px 20px 20px;
}

.task-card {
  --task-accent: #078f87;
  --task-glow: rgb(7 143 135 / 9%);
  display: grid;
  min-width: 0;
  min-height: 106px;
  grid-template-columns: 46px 52px minmax(0, 1fr) 30px;
  align-items: center;
  gap: 12px;
  padding: 16px 14px 16px 16px;
  position: relative;
  overflow: hidden;
  border: 1px solid #dce6ed;
  border-radius: 14px;
  background: #fff;
  box-shadow: inset 0 1px 0 #fff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: #9fd6d1;
    box-shadow:
      0 12px 26px var(--task-glow),
      inset 0 1px 0 #fff;
    transform: translateY(-2px);

    &::after {
      transform: scaleY(1);
    }

    .task-card__arrow {
      color: #fff;
      background: var(--task-accent);
      transform: translateX(3px);
    }
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    width: 3px;
    height: 48px;
    border-radius: 0 3px 3px 0;
    background: var(--task-accent);
    box-shadow: none;
    transform: scaleY(0.35);
    transition: transform 0.2s ease;
  }

  &__icon {
    display: inline-flex;
    width: 46px;
    height: 46px;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    font-size: 21px;
    box-shadow: inset 0 0 0 1px rgb(255 255 255 / 70%);

    &--blue,
    &--purple,
    &--amber,
    &--teal {
      color: #078f87;
      background: #e8f7f5;
    }
  }

  &__amount {
    display: flex;
    align-items: baseline;
    gap: 3px;

    strong {
      color: var(--task-accent);
      font-size: 31px;
      font-weight: 750;
      letter-spacing: -0.04em;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }

    small {
      color: var(--app-text-subtle);
      font-size: 11px;
      font-weight: 600;
    }
  }

  &__body {
    display: grid;
    min-width: 0;
    gap: 6px;

    strong {
      color: var(--app-text-heading);
      font-size: 15px;
      font-weight: 700;
    }

    span {
      overflow: hidden;
      color: var(--app-text-label);
      font-size: 12px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__arrow {
    display: inline-flex;
    width: 28px;
    height: 28px;
    align-items: center;
    justify-content: center;
    border: 1px solid #dbe5ee;
    border-radius: 50%;
    color: #8b9bae;
    background: #fff;
    transition:
      color 0.2s ease,
      background 0.2s ease,
      transform 0.2s ease;
  }
}

@include narrow {
  .task-card {
    grid-template-columns: 42px 46px minmax(0, 1fr) 28px;
    padding: 14px;

    &__icon {
      width: 42px;
      height: 42px;
    }

    &__amount strong {
      font-size: 27px;
    }
  }
}

@include mobile {
  .task-panel {
    min-height: 0;
  }

  .task-grid {
    grid-template-columns: 1fr;
    padding: 14px;
  }

  .task-card {
    min-height: 84px;
    grid-template-columns: 42px 50px minmax(0, 1fr) 28px;
  }
}
</style>
