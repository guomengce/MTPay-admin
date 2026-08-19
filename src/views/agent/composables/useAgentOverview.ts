import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import {
  fetchAgentAssetOverview,
  fetchAgentTransactionInfo,
  type AgentAssetOverview,
  type AgentRecentTransaction,
  type AgentTransactionInfo,
} from '@/api/modules/agent';
import { useAgentMail } from './useAgentMail';

/**
 * 代理资产详情页：集中管理概览读取、最近交易详情弹框和邮件动作。
 * 页面组件只负责展示，接口参数均在此处按接口文档组装。
 */
export function useAgentOverview() {
  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);
  const overview = ref<AgentAssetOverview | null>(null);
  const capabilitiesAvailable = ref(false);
  const transactionVisible = ref(false);
  const transactionLoading = ref(false);
  const transactionInfo = ref<AgentTransactionInfo | null>(null);
  const { mailLoading, sendInvitation, sendPasswordReset } = useAgentMail();

  async function loadOverview() {
    const userId = Number(route.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      ElMessage.error('代理编号无效');
      await router.replace('/agent');
      return;
    }

    loading.value = true;
    capabilitiesAvailable.value = false;
    try {
      const response = await fetchAgentAssetOverview(userId);
      capabilitiesAvailable.value = Boolean(response.capabilities);

      /**
       * UAT 接口会按实际配置省略部分概览区块，统一补齐展示默认值，
       * 避免 capabilities 等可选字段缺失时中断 Vue 渲染并留下 Loading 遮罩。
       */
      overview.value = {
        ...response,
        assets: response.assets ?? [],
        effective_exchange_rates: response.effective_exchange_rates ?? {},
        pending_counts: {
          deposit: response.pending_counts?.deposit ?? 0,
          exchange: response.pending_counts?.exchange ?? 0,
          withdrawal: response.pending_counts?.withdrawal ?? 0,
          total: response.pending_counts?.total ?? 0,
        },
        capabilities: {
          deposit_channel_count: response.capabilities?.deposit_channel_count ?? 0,
          exchange_source_currencies: response.capabilities?.exchange_source_currencies ?? [],
          exchange_target_currency: response.capabilities?.exchange_target_currency ?? '',
          withdrawal_currency: response.capabilities?.withdrawal_currency ?? '',
          withdrawal_fee_amount: response.capabilities?.withdrawal_fee_amount ?? '',
        },
        recent_orders: response.recent_orders ?? [],
        recent_fund_flows: response.recent_fund_flows ?? [],
      };
    } finally {
      loading.value = false;
    }
  }

  /** 使用接口返回的 detail_type/detail_id 获取统一交易详情。 */
  async function openTransaction(transaction: AgentRecentTransaction) {
    transactionVisible.value = true;
    transactionLoading.value = true;
    transactionInfo.value = null;
    try {
      transactionInfo.value = await fetchAgentTransactionInfo(transaction);
    } finally {
      transactionLoading.value = false;
    }
  }

  function goBack() {
    return router.push('/agent');
  }

  onMounted(loadOverview);

  return {
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
  };
}
