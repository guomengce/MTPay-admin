import { useListQueryState } from '@/composables/useListQueryState';
import { toRefs } from 'vue';
/**
 * 交易記錄列表組合邏輯
 * - 統一交易記錄接口 /admin/getTransactionList，只讀；
 * - 詳情跳轉使用列表返回的 detail_type / detail_id。
 */
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';

import * as TransactionApi from '@/api/modules/transaction';
import type {
  TransactionBusinessType,
  TransactionItem,
  TransactionListParams,
} from '@/api/modules/transaction';

export interface TransactionQuery {
  business_type: TransactionBusinessType | undefined;
  status_group: string;
  currency_code: string;
  keyword: string;
  started_at: string;
  ended_at: string;
}

const INITIAL_QUERY: TransactionQuery = {
  business_type: undefined,
  status_group: '',
  currency_code: '',
  keyword: '',
  started_at: '',
  ended_at: '',
};

export function useTransactionList() {
  const loading = ref(false);
  const list = ref<TransactionItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(15);
  const query = reactive<TransactionQuery>({ ...INITIAL_QUERY });

  function buildParams(): TransactionListParams {
    return {
      page: page.value,
      limit: limit.value,
      business_type: query.business_type,
      status_group: query.status_group.trim() || undefined,
      currency_code: query.currency_code.trim() || undefined,
      keyword: query.keyword.trim() || undefined,
      started_at: query.started_at || undefined,
      ended_at: query.ended_at || undefined,
    };
  }

  const saveListQuery = useListQueryState({ ...toRefs(query), page, limit }, ["status","role","entity_type"]);

  async function loadList() {
    await saveListQuery();
    loading.value = true;
    try {
      const result = await TransactionApi.fetchTransactionList(buildParams());
      list.value = result.data ?? [];
      total.value = result.total ?? 0;
      page.value = result.current_page ?? page.value;
      limit.value = result.per_page ?? limit.value;
    } finally {
      loading.value = false;
    }
  }

  function search() {
    if (query.started_at && query.ended_at && query.started_at > query.ended_at) {
      ElMessage.warning('起始日期不能晚於結束日期');
      return;
    }
    page.value = 1;
    void loadList();
  }

  function reset() {
    Object.assign(query, INITIAL_QUERY);
    page.value = 1;
    void loadList();
  }

  function setPage(value: number) {
    page.value = value;
    void loadList();
  }

  function setLimit(value: number) {
    limit.value = value;
    page.value = 1;
    void loadList();
  }

  return {
    loading,
    list,
    total,
    page,
    limit,
    query,
    loadList,
    search,
    reset,
    setPage,
    setLimit,
  };
}
