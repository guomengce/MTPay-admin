<template>
  <section v-loading="loading" class="admin-page agent-overview-page">
    <AdminHero
      :title="overview?.user.company_name || '代理详情'"
      :description="
        overview ? `${overview.user.agent_code} · ${overview.user.email}` : '正在读取代理资产概览'
      "
      :icon="UserFilled"
    >
      <template #extra>
        <div class="agent-overview-page__hero-actions">
          <el-button :icon="Back" @click="goBack">返回列表</el-button>
          <el-button
            v-if="overview?.user.status === 0"
            plain
            type="warning"
            :icon="Message"
            :loading="mailLoading === 'invitation'"
            @click="sendInvitation(overview.user)"
          >
            发送激活邮件
          </el-button>
          <el-button
            v-if="overview?.user.status === 1 || overview?.user.status === 2"
            plain
            type="primary"
            :icon="Key"
            :loading="mailLoading === 'password-reset'"
            @click="sendPasswordReset(overview.user)"
          >
            发送密码重置邮件
          </el-button>
        </div>
      </template>
    </AdminHero>

    <template v-if="overview">
      <div class="agent-overview-page__metrics">
        <article class="identity-card">
          <span class="identity-card__avatar">{{
            overview.user.company_name.charAt(0).toUpperCase()
          }}</span>
          <div>
            <small>代理账户</small><strong>{{ overview.user.company_name }}</strong
            ><span>{{ overview.user.agent_code }}</span>
          </div>
          <StatusBadge :label="overview.user.status_name" :type="accountStatusType" />
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

      <AdminPanel title="资产余额" subtitle="可用、冻结与总余额均为接口实时返回" :icon="Wallet">
        <div class="agent-overview-page__assets">
          <article v-for="asset in overview.assets" :key="asset.currency.id" class="asset-card">
            <header>
              <span>{{ asset.currency.code }}</span
              ><small>{{ asset.currency.name }}</small>
            </header>
            <div class="asset-card__total">
              <small>总余额</small><strong>{{ asset.total_balance }}</strong>
            </div>
            <footer>
              <div>
                <small>可用余额</small><strong>{{ asset.available_balance }}</strong>
              </div>
              <div>
                <small>冻结余额</small><strong>{{ asset.frozen_balance }}</strong>
              </div>
            </footer>
          </article>
          <el-empty v-if="overview.assets.length === 0" description="暂无资产余额" />
        </div>
      </AdminPanel>

      <div class="agent-overview-page__config-grid">
        <AdminPanel
          v-if="capabilitiesAvailable"
          title="业务能力"
          subtitle="当前代理可使用的通道和费用配置"
          :icon="Setting"
        >
          <div class="capability-list">
            <article>
              <small>入金通道</small
              ><strong>{{ overview.capabilities.deposit_channel_count }} 个</strong>
            </article>
            <article>
              <small>兑换方向</small><strong>{{ exchangeDirection }}</strong>
            </article>
            <article>
              <small>出金币种</small
              ><strong>{{ overview.capabilities.withdrawal_currency }}</strong>
            </article>
            <article>
              <small>出金手续费</small
              ><strong
                >{{ overview.capabilities.withdrawal_fee_amount }}
                {{ overview.capabilities.withdrawal_currency }}</strong
              >
            </article>
          </div>
        </AdminPanel>
      </div>

      <AdminPanel
        title="最近交易"
        subtitle="展示该代理最近 5 笔入金、兑换和出金订单"
        :icon="Tickets"
      >
        <template #extra>
          <el-button :icon="Refresh" @click="loadOverview">刷新</el-button>
        </template>
        <div class="recent-orders">
          <el-table :data="overview.recent_orders" class="admin-data-table" stripe>
            <el-table-column prop="order_no" label="订单号" min-width="190" />
            <el-table-column prop="business_name" label="业务类型" width="110" />
            <el-table-column label="金额" min-width="180">
              <template #default="{ row }"
                ><span class="amount-cell">{{ orderAmount(row) }}</span></template
              >
            </el-table-column>
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <StatusBadge
                  :label="row.status_name"
                  :type="transactionStatusType(row.status_group)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="submitted_at" label="提交时间" min-width="170" />
            <el-table-column label="操作" width="110" fixed="right">
              <template #default="{ row }">
                <el-button
                  plain
                  type="primary"
                  size="small"
                  :icon="View"
                  @click="openTransaction(row)"
                  >详情</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="overview.recent_orders.length === 0" description="暂无最近交易" />
        </div>
      </AdminPanel>
    </template>

    <el-empty v-else-if="!loading" description="未读取到代理资产概览">
      <el-button type="primary" @click="goBack">返回代理列表</el-button>
    </el-empty>

    <AgentTransactionDialog
      v-model="transactionVisible"
      :loading="transactionLoading"
      :info="transactionInfo"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Back,
  Coin,
  Key,
  Message,
  Refresh,
  Setting,
  Switch,
  Tickets,
  Upload,
  UserFilled,
  View,
  Wallet,
} from '@element-plus/icons-vue';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import type { AgentRecentTransaction } from '@/api/modules/agent';
import AgentTransactionDialog from '../components/AgentTransactionDialog.vue';
import { useAgentOverview } from '../composables/useAgentOverview';

const {
  loading,
  overview,
  capabilitiesAvailable,
  transactionVisible,
  transactionLoading,
  transactionInfo,
  mailLoading,
  loadOverview,
  openTransaction,
  sendInvitation,
  sendPasswordReset,
  goBack,
} = useAgentOverview();

const accountStatusType = computed<StatusBadgeType>(() => {
  if (overview.value?.user.status === 1) return 'success';
  if (overview.value?.user.status === 3) return 'danger';
  if (overview.value?.user.status === 2) return 'gray';
  return 'warning';
});

const pendingItems = computed(() => [
  {
    label: '待处理总数',
    value: overview.value?.pending_counts.total ?? 0,
    icon: Tickets,
    tone: 'teal',
  },
  {
    label: '待审入金',
    value: overview.value?.pending_counts.deposit ?? 0,
    icon: Coin,
    tone: 'blue',
  },
  {
    label: '待审兑换',
    value: overview.value?.pending_counts.exchange ?? 0,
    icon: Switch,
    tone: 'violet',
  },
  {
    label: '待审出金',
    value: overview.value?.pending_counts.withdrawal ?? 0,
    icon: Upload,
    tone: 'orange',
  },
]);

const exchangeDirection = computed(() => {
  if (!overview.value) return '—';
  return `${overview.value.capabilities.exchange_source_currencies.join(' / ') || '—'} → ${overview.value.capabilities.exchange_target_currency || '—'}`;
});

function orderAmount(order: AgentRecentTransaction) {
  if (order.business_type === 'exchange') {
    return `${order.amount} ${order.currency_code} → ${order.target_amount || '—'} ${order.target_currency_code || ''}`.trim();
  }
  return `${order.amount} ${order.currency_code}`;
}

function transactionStatusType(group: string): StatusBadgeType {
  if (group === 'completed' || group === 'success') return 'success';
  if (group === 'rejected' || group === 'failed') return 'danger';
  return 'warning';
}
</script>

<style scoped lang="scss">
.agent-overview-page {
  gap: 20px;

  &__hero-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
  &__hero-actions :deep(.el-button + .el-button) {
    margin-left: 0;
  }
  &__metrics {
    display: grid;
    grid-template-columns: minmax(260px, 1.5fr) repeat(4, minmax(140px, 1fr));
    gap: 14px;
  }
  &__assets {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    padding: 20px;
  }
  &__config-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }
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
.metric-card small,
.asset-card small,
.capability-list small {
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

.asset-card {
  padding: 18px;
  border: 1px solid #dce7ef;
  border-radius: 15px;
  background: linear-gradient(145deg, #fff, #f7fbfd);
}
.asset-card header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.asset-card header span {
  color: #087f78;
  font-size: 18px;
  font-weight: 700;
}
.asset-card__total {
  display: grid;
  gap: 5px;
  margin: 20px 0;
}
.asset-card__total strong {
  overflow-wrap: anywhere;
  color: var(--app-text-heading);
  font-size: 24px;
  font-variant-numeric: tabular-nums;
}
.asset-card footer {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid #e4ebf2;
}
.asset-card footer div {
  display: grid;
  min-width: 0;
  gap: 5px;
}
.asset-card footer strong {
  overflow-wrap: anywhere;
  color: var(--app-text-body);
  font-size: 13px;
  font-weight: 600;
}

.capability-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.capability-list article {
  display: grid;
  gap: 6px;
  padding: 14px;
  border-radius: 12px;
  background: #f6f9fc;
}
.capability-list strong {
  overflow-wrap: anywhere;
  color: var(--app-text-body);
  font-size: 14px;
  font-weight: 600;
}
.recent-orders {
  min-width: 0;
  overflow-x: auto;
  padding: 0 20px 20px;
}
.amount-cell {
  color: var(--app-text-body);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 1280px) {
  .agent-overview-page__metrics {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .identity-card {
    grid-column: 1 / -1;
  }
}

@include narrow {
  .agent-overview-page__assets {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .agent-overview-page__config-grid {
    grid-template-columns: 1fr;
  }
}

@include mobile {
  .agent-overview-page__hero-actions,
  .agent-overview-page__hero-actions .el-button {
    width: 100%;
  }
  .agent-overview-page__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .identity-card {
    grid-column: 1 / -1;
  }
  .agent-overview-page__assets {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  .metric-card {
    padding: 14px;
  }
  .metric-card > span {
    display: none;
  }
  .capability-list {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  .recent-orders {
    padding: 0 16px 16px;
  }
}
</style>
