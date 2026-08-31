import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import {
  fetchAgentAssetOverview,
  type AgentAssetOverview,
  type AgentRecentTransaction,
} from '@/api/modules/agent';
import { fetchTransactionList, type TransactionItem } from '@/api/modules/transaction';
import { useAgentMail } from './useAgentMail';
import { businessDetailRoute } from '@/views/transaction/businessDetailRoute';
import { useListQueryState } from '@/composables/useListQueryState';

/**
 * 代理资产详情页：集中管理概览读取、交易记录导航和邮件动作。
 * 页面组件只负责展示，接口参数均在此处按接口文档组装。
 */
export function useAgentOverview() {
  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);
  const overview = ref<AgentAssetOverview | null>(null);
  const recentTransactions = ref<TransactionItem[]>([]);
  const recentTransactionsLoading = ref(false);
  const transactionPage = ref(1);
  const transactionLimit = ref(5);
  const transactionTotal = ref(0);
  const saveTransactionQuery = useListQueryState({ page: transactionPage, limit: transactionLimit });
  let transactionRequest = 0;
  const { mailLoading, sendInvitation, sendPasswordReset } = useAgentMail();

  async function loadOverview() {
    const userId = Number(route.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      ElMessage.error('代理账户参数无效');
      await router.replace('/agent');
      return;
    }

    loading.value = true;
    try {
      const response = await fetchAgentAssetOverview(userId);

      /**
       * UAT 接口会按实际配置省略部分概览区块，统一补齐展示默认值，
       * 避免可选字段缺失时中断 Vue 渲染并留下 Loading 遮罩。
       */
      overview.value = {
        ...response,
        assets: response.assets ?? [],
        wallet_account_address: response.wallet_account_address ?? '',
        crypto_receiving_addresses: response.crypto_receiving_addresses ?? [],
        effective_exchange_rates: response.effective_exchange_rates ?? {},
        pending_counts: {
          deposit: response.pending_counts?.deposit ?? 0,
          exchange: response.pending_counts?.exchange ?? 0,
          withdrawal: response.pending_counts?.withdrawal ?? 0,
          total: response.pending_counts?.total ?? 0,
        },
      };
      await loadRecentTransactions(userId);
    } finally {
      loading.value = false;
    }
  }

  async function loadRecentTransactions(userId = Number(route.params.id)) {
    if (!Number.isInteger(userId) || userId <= 0) return;
    const requestId = ++transactionRequest;
    await saveTransactionQuery();
    if (requestId !== transactionRequest) return;
    recentTransactionsLoading.value = true;
    try {
      const result = await fetchTransactionList({ user_id: userId, page: transactionPage.value, limit: transactionLimit.value });
      if (requestId !== transactionRequest) return;
      recentTransactions.value = result.data ?? [];
      transactionTotal.value = result.total ?? 0;
    } finally {
      if (requestId === transactionRequest) recentTransactionsLoading.value = false;
    }
  }

  function setTransactionPage(page: number) {
    if (!Number.isInteger(page) || page < 1) return;
    transactionPage.value = page;
    return loadRecentTransactions();
  }

  function setTransactionLimit(limit: number) {
    if (!Number.isInteger(limit) || limit < 1) return;
    transactionLimit.value = limit;
    transactionPage.value = 1;
    return loadRecentTransactions();
  }

  /** 复用业务详情路由，包含人工增减记录的独立详情页。 */
  async function openTransaction(transaction: AgentRecentTransaction) {
    const target = businessDetailRoute(transaction);
    if (target) await router.push(target);
  }

  function goBack() {
    return router.go(-1);
  }

  onMounted(loadOverview);

  return {
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
  };
}
