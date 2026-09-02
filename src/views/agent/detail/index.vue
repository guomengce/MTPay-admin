<template>
  <section class="admin-page agent-overview-page">
    <div class="agent-overview-page__hero-actions">
      <el-button :icon="Back" @click="goBack">返回</el-button>
    </div>

    <template v-if="overview">
      <!-- 頂部：基本信息 + 資產餘額合併卡 -->
      <AgentOverviewCard
        :user="overview.user"
        :assets="overview.assets"
        :mail-loading="mailLoading !== null"
        @send-invitation="sendInvitation(overview.user)"
        @send-password-reset="sendPasswordReset(overview.user)"
        @adjust-asset="openAssetAdjustment"
      />

      <AgentWalletInfo
        v-if="authStore.cryptoEnabled && overview.wallet_addresses.length"
        :safeheron-account-key="overview.user.safeheron_account_key || ''"
        :addresses="overview.wallet_addresses"
      />

      <!-- 交易記錄 -->
      <RecentOrders
        :orders="recentTransactions"
        :loading="recentTransactionsLoading"
        :page="transactionPage"
        :page-size="transactionLimit"
        :total="transactionTotal"
        @update:page="setTransactionPage"
        @update:page-size="setTransactionLimit"
        @refresh="loadRecentTransactions()"
        @view="openTransaction"
      />
    </template>

    <el-empty v-else-if="!loading" description="未讀取到代理資產概覽">
      <el-button type="primary" @click="goBack">返回</el-button>
    </el-empty>

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
import { usePermission } from '@/composables/usePermission';
import { useAuthStore } from '@/stores/modules/auth';
import AgentOverviewCard from './components/AgentOverviewCard.vue';
import AssetAdjustmentDialog from './components/AssetAdjustmentDialog.vue';
import AgentWalletInfo from './components/AgentWalletInfo.vue';
import RecentOrders from './components/RecentOrders.vue';
import { useAgentOverview } from '../composables/useAgentOverview';

const {
  loading,
  overview,
  recentTransactions,
  recentTransactionsLoading,
  transactionPage,
  transactionLimit,
  transactionTotal,
  setTransactionPage,
  setTransactionLimit,
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
const { canOperate } = usePermission();
const authStore = useAuthStore();

function openAssetAdjustment(asset: AgentAssetBalance, mode: 'increase' | 'decrease') {
  if (!canOperate(mode === 'increase' ? 'agents.balanceIncrease' : 'agents.balanceDecrease')) return;
  adjustmentAsset.value = asset;
  adjustmentMode.value = mode;
  adjustmentVisible.value = true;
}

async function handleAssetAdjustment(payload: { asset: AgentAssetBalance; mode: 'increase' | 'decrease'; amount: string; remark: string }) {
  if (!canOperate(payload.mode === 'increase' ? 'agents.balanceIncrease' : 'agents.balanceDecrease')) return;
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
