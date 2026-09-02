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
 * 代理資產詳情頁：集中管理概覽讀取、交易記錄導航和郵件動作。
 * 頁面組件只負責展示，接口參數均在此處按接口文檔組裝。
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
      ElMessage.error('代理賬户參數無效');
      await router.replace('/agent');
      return;
    }

    loading.value = true;
    try {
      const response = await fetchAgentAssetOverview(userId);

      /**
       * UAT 接口會按實際配置省略部分概覽區塊，統一補齊展示默認值，
       * 避免可選字段缺失時中斷 Vue 渲染並留下 Loading 遮罩。
       */
      overview.value = {
        ...response,
        assets: response.assets ?? [],
        wallet_addresses: response.wallet_addresses ?? [],
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

  /** 複用業務詳情路由，包含人工增減記錄的獨立詳情頁。 */
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
