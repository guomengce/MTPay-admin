/**
 * withdrawal 列表 composable 骨架
 */
import { reactive, ref } from 'vue';

import * as WithdrawalApi from '@/api/modules/withdrawal';
import type { WithdrawalListParams } from '@/api/modules/withdrawal';

export interface UseWithdrawalListOptions {
  pageSize?: number;
  defaultQuery?: Partial<WithdrawalListParams>;
}

export function useWithdrawalList(options: UseWithdrawalListOptions = {}) {
  const loading = ref(false);
  const list = ref<WithdrawalApi.WithdrawalListItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(options.pageSize ?? 10);
  const query = reactive<Partial<WithdrawalListParams>>({ ...(options.defaultQuery ?? {}) });

  async function fetchList() {
    loading.value = true;
    try {
      const result = await WithdrawalApi.fetchWithdrawalList({
        page: page.value,
        pageSize: pageSize.value,
        ...query,
      });
      list.value = result.list;
      total.value = result.total;
    } finally {
      loading.value = false;
    }
  }

  async function refresh() {
    page.value = 1;
    await fetchList();
  }

  function resetQuery() {
    for (const k of Object.keys(query)) {
      delete query[k as keyof WithdrawalListParams];
    }
    page.value = 1;
  }

  return {
    loading,
    list,
    total,
    page,
    pageSize,
    query,
    fetchList,
    refresh,
    resetQuery,
  };
}
