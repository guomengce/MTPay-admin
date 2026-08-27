<template>
  <section class="admin-page agent-overview-page">
    <div class="agent-overview-page__hero-actions">
      <el-button :icon="Back" @click="goBack">返回列表</el-button>
    </div>

    <template v-if="overview">
      <!-- 顶部：基本信息 + 资产余额合并卡 -->
      <AgentOverviewCard
        :user="overview.user"
        :assets="overview.assets"
        :mail-loading="mailLoading !== null"
        @send-invitation="sendInvitation(overview.user)"
        @send-password-reset="sendPasswordReset(overview.user)"
        @adjust-asset="openAssetAdjustment"
      />

      <AgentWalletInfo
        :wallet-account-address="overview.wallet_account_address"
        :addresses="overview.crypto_receiving_addresses"
      />

      <!-- 最近交易 -->
      <RecentOrders
        :orders="recentTransactions"
        :loading="recentTransactionsLoading"
        @refresh="loadRecentTransactions()"
        @view="openTransaction"
      />
    </template>

    <el-empty v-else-if="!loading" description="未讀取到代理資產概覽">
      <el-button type="primary" @click="goBack">返回代理列表</el-button>
    </el-empty>

    <AgentTransactionDialog
      v-model="transactionVisible"
      :loading="transactionLoading"
      :info="transactionInfo"
    />
    <AssetAdjustmentDialog
      v-model="adjustmentVisible"
      :asset="adjustmentAsset"
      :mode="adjustmentMode"
      :submitting="adjustmentSubmitting"
      @submit="handleAssetAdjustment"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Back } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { usePageLoading } from '@/composables/usePageLoading';
import { adjustAgentBalance, type AgentAssetBalance } from '@/api/modules/agent';
import AgentOverviewCard from './components/AgentOverviewCard.vue';
import AssetAdjustmentDialog from './components/AssetAdjustmentDialog.vue';
import AgentWalletInfo from './components/AgentWalletInfo.vue';
import RecentOrders from './components/RecentOrders.vue';
import AgentTransactionDialog from '../components/AgentTransactionDialog.vue';
import { useAgentOverview } from '../composables/useAgentOverview';

const {
  loading,
  overview,
  transactionVisible,
  transactionLoading,
  transactionInfo,
  recentTransactions,
  recentTransactionsLoading,
  loadRecentTransactions,
  mailLoading,
  loadOverview,
  openTransaction,
  sendInvitation,
  sendPasswordReset,
  goBack,
} = useAgentOverview();
usePageLoading(loading);

const adjustmentVisible = ref(false);
const adjustmentAsset = ref<AgentAssetBalance | null>(null);
const adjustmentMode = ref<'increase' | 'decrease'>('increase');
const adjustmentSubmitting = ref(false);

function openAssetAdjustment(asset: AgentAssetBalance, mode: 'increase' | 'decrease') {
  adjustmentAsset.value = asset;
  adjustmentMode.value = mode;
  adjustmentVisible.value = true;
}

async function handleAssetAdjustment(payload: { asset: AgentAssetBalance; mode: 'increase' | 'decrease'; amount: string; remark: string }) {
  if (!overview.value) return;
  adjustmentSubmitting.value = true;
  try {
    await adjustAgentBalance({
      user_id: overview.value.user.id,
      currency_code: payload.asset.currency.code,
      direction: payload.mode,
      amount: payload.amount,
      reason: payload.remark || undefined,
    });
    ElMessage.success(payload.mode === 'increase' ? '資產增加成功' : '資產減少成功');
    adjustmentVisible.value = false;
    await loadOverview();
  } finally {
    adjustmentSubmitting.value = false;
  }
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
}

@include mobile {
  .agent-overview-page__hero-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .agent-overview-page__hero-actions :deep(.el-button) {
    width: 100%;
  }
}
</style>
