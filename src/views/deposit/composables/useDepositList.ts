/**
 * deposit 列表 composable 骨架
 */
import { reactive, ref } from 'vue';

import * as DepositApi from '@/api/modules/deposit';
import type { DepositListParams } from '@/api/modules/deposit';

export interface UseDepositListOptions {
  pageSize?: number;
  defaultQuery?: Partial<DepositListParams>;
}

export function useDepositList(options: UseDepositListOptions = {}) {
  const loading = ref(false);
  const list = ref<DepositApi.DepositListItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(options.pageSize ?? 10);
  const query = reactive<Partial<DepositListParams>>({ ...(options.defaultQuery ?? {}) });

  async function fetchList() {
    loading.value = true;
    try {
      const result = await DepositApi.fetchDepositList({
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
      delete query[k as keyof DepositListParams];
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
