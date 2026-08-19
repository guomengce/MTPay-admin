<template>
  <div class="agent-overview-metrics">
    <article class="identity-card">
      <span class="identity-card__avatar">{{ avatarInitial }}</span>
      <div>
        <small>代理账户</small><strong>{{ user.company_name }}</strong
        ><span>{{ user.agent_code }}</span>
      </div>
      <StatusBadge :label="user.status_name" :type="accountStatusType" />
    </article>
    <article v-for="item in pendingItems" :key="item.label" class="metric-card">
      <span :class="item.tone"
        ><el-icon><component :is="item.icon" /></el-icon
      ></span>
      <div>
        <small>{{ item.label }}</small
        ><strong>{{ item.value }}</strong>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';
import { Coin, Switch, Tickets, Upload } from '@element-plus/icons-vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import type { AgentAccount } from '@/api/modules/agent';

const props = defineProps<{
  user: Pick<AgentAccount, 'agent_code' | 'company_name' | 'status' | 'status_name'>;
  pendingCounts: { deposit: number; exchange: number; withdrawal: number; total: number };
}>();

const accountStatusType = computed<StatusBadgeType>(() => {
  if (props.user.status === 1) return 'success';
  if (props.user.status === 3) return 'danger';
  if (props.user.status === 2) return 'gray';
  return 'warning';
});

const avatarInitial = computed(() =>
  props.user.company_name ? props.user.company_name.charAt(0).toUpperCase() : '?',
);

interface PendingItem {
  label: string;
  value: number;
  icon: Component;
  tone: string;
}

const pendingItems = computed<PendingItem[]>(() => [
  {
    label: '待处理总数',
    value: props.pendingCounts.total ?? 0,
    icon: Tickets,
    tone: 'teal',
  },
  {
    label: '待审入金',
    value: props.pendingCounts.deposit ?? 0,
    icon: Coin,
    tone: 'blue',
  },
  {
    label: '待审兑换',
    value: props.pendingCounts.exchange ?? 0,
    icon: Switch,
    tone: 'violet',
  },
  {
    label: '待审出金',
    value: props.pendingCounts.withdrawal ?? 0,
    icon: Upload,
    tone: 'orange',
  },
]);
</script>

<style scoped lang="scss">
.agent-overview-metrics {
  display: grid;
  grid-template-columns: minmax(260px, 1.5fr) repeat(4, minmax(140px, 1fr));
  gap: 14px;
}

.identity-card,
.metric-card {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 13px;
  padding: 17px;
  border: 1px solid #dce5ef;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 28px rgb(16 42 80 / 5%);
}
.identity-card__avatar {
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  place-items: center;
  border-radius: 13px;
  color: #fff;
  background: linear-gradient(135deg, #16b9aa, #1f73f2);
  font-size: 20px;
  font-weight: 700;
}
.identity-card > div,
.metric-card > div {
  display: grid;
  min-width: 0;
  gap: 3px;
}
.identity-card small,
.metric-card small {
  color: var(--app-text-label);
  font-size: 12px;
}
.identity-card strong {
  overflow: hidden;
  color: var(--app-text-heading);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.identity-card div span {
  color: var(--app-text-label);
  font-size: 12px;
}
.identity-card > :last-child {
  margin-left: auto;
}
.metric-card > span {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  place-items: center;
  border-radius: 11px;
  font-size: 20px;
}
.metric-card > span.teal {
  color: #07978f;
  background: #e5f7f4;
}
.metric-card > span.blue {
  color: #1f73f2;
  background: #eaf2ff;
}
.metric-card > span.violet {
  color: #7857ed;
  background: #f1edff;
}
.metric-card > span.orange {
  color: #d98212;
  background: #fff3df;
}
.metric-card strong {
  color: var(--app-text-heading);
  font-size: 23px;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 1280px) {
  .agent-overview-metrics {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .identity-card {
    grid-column: 1 / -1;
  }
}

@include mobile {
  .agent-overview-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .identity-card {
    grid-column: 1 / -1;
  }
  .metric-card {
    padding: 14px;
  }
  .metric-card > span {
    display: none;
  }
}
</style>
