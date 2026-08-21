<template>
  <section v-loading="loading" class="admin-page agent-overview-page">
    <div class="agent-overview-page__hero-actions">
      <el-button :icon="Back" @click="goBack">返回列表</el-button>
    </div>

    <template v-if="overview">
      <!-- 顶部：基本信息 + 资产余额合并卡 -->
      <AgentOverviewCard
        :user="overview.user"
        :assets="overview.assets"
        :mail-loading="mailLoading !== null"
        @copy-email="copyEmail"
        @send-invitation="sendInvitation(overview.user)"
        @send-password-reset="sendPasswordReset(overview.user)"
      />

      <!-- 业务能力 -->
      <div v-if="capabilitiesAvailable" class="agent-overview-page__config-grid">
        <AdminPanel
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
                >{{ formatFixedFee(overview.capabilities.withdrawal_fee_amount) }}
                {{ overview.capabilities.withdrawal_currency }}</strong
              >
            </article>
          </div>
        </AdminPanel>
      </div>

      <!-- 最近交易 -->
      <RecentOrders :orders="overview.recent_orders" @refresh="loadOverview" @view="openTransaction" />
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
import { ElMessage } from 'element-plus';
import { Back, Setting } from '@element-plus/icons-vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import { formatFixedFee } from '@/utils/decimal';
import type { AgentRecentTransaction } from '@/api/modules/agent';
import AgentOverviewCard from './components/AgentOverviewCard.vue';
import RecentOrders from './components/RecentOrders.vue';
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

const exchangeDirection = computed(() => {
  if (!overview.value) return '—';
  return `${overview.value.capabilities.exchange_source_currencies.join(' / ') || '—'} → ${overview.value.capabilities.exchange_target_currency || '—'}`;
});

function copyEmail() {
  const email = overview.value?.user.email;
  if (!email) return;
  navigator.clipboard?.writeText(email).then(
    () => ElMessage.success('邮箱已复制'),
    () => ElMessage.error('复制失败，请手动选择'),
  );
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
  &__config-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
}

.capability-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 20px;
}
.capability-list article {
  display: grid;
  gap: 6px;
  padding: 14px;
  border-radius: 12px;
  background: #f6f9fc;
}
.capability-list small {
  color: var(--app-text-label);
  font-size: 12px;
}
.capability-list strong {
  overflow-wrap: anywhere;
  color: var(--app-text-body);
  font-size: 14px;
  font-weight: 600;
}

@include mobile {
  .agent-overview-page__hero-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .agent-overview-page__hero-actions :deep(.el-button) {
    width: 100%;
  }
  .capability-list {
    grid-template-columns: 1fr;
    padding: 16px;
  }
}
</style>
