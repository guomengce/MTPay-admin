import type { CsvFilters } from '@/api/modules/csvExport';
import { useListQueryState } from '@/composables/useListQueryState';
import { toRefs } from 'vue';
/** 管理端法幣出金列表：後端分頁與真實篩選參數。 */
import { reactive, ref } from 'vue';

import { fetchWithdrawalList } from '@/api/modules/withdrawal';
import type { WithdrawalListParams, WithdrawalStatus } from '@/api/modules/withdrawal';
import type { RiskLevel, RiskStatus } from '@/api/modules/withdrawalRisk';

import { toWithdrawalRow, type WithdrawalRow } from './mapper';

export interface WithdrawalQuery {
  user_id?: number;
  status?: WithdrawalStatus;
  keyword: string;
  started_at: string;
  ended_at: string;
  risk_level?: RiskLevel;
  risk_status?: RiskStatus;
}

const INITIAL_QUERY: WithdrawalQuery = {
  user_id: undefined,
  status: undefined,
  keyword: '',
  started_at: '',
  ended_at: '',
  risk_level: undefined,
  risk_status: undefined,
};

export function useWithdrawalList() {
  const loading = ref(false);
  const exportFilters = ref<CsvFilters | null>(null);
  const list = ref<WithdrawalRow[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(15);
  const query = reactive<WithdrawalQuery>({ ...INITIAL_QUERY });

  function buildParams(filters: WithdrawalQuery): WithdrawalListParams {
    return {
      page: page.value,
      limit: limit.value,
      user_id: filters.user_id,
      status: filters.status,
      keyword: filters.keyword.trim() || undefined,
      started_at: filters.started_at || undefined,
      ended_at: filters.ended_at || undefined,
      risk_level: filters.risk_level,
      risk_status: filters.risk_status,
    };
  }

  const saveListQuery = useListQueryState({ ...toRefs(query), page, limit }, ["user_id","status","role","entity_type"]);

  async function loadList() {
    const filters = { ...query };
    await saveListQuery();
    loading.value = true;
    try {
      const result = await fetchWithdrawalList(buildParams(filters));
      list.value = result.data.map(toWithdrawalRow);
      total.value = result.total;
      exportFilters.value = filters;
      page.value = result.current_page;
      limit.value = result.per_page;
    } finally {
      loading.value = false;
    }
  }

  function search() {
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
    exportFilters,
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
