/**
 * exchange 列表 composable 骨架
 */
import { reactive, ref } from 'vue';

import * as ExchangeApi from '@/api/modules/exchange';
import type { ExchangeListParams } from '@/api/modules/exchange';

export interface UseExchangeListOptions {
  pageSize?: number;
  defaultQuery?: Partial<ExchangeListParams>;
}

export function useExchangeList(options: UseExchangeListOptions = {}) {
  const loading = ref(false);
  const list = ref<ExchangeApi.ExchangeListItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(options.pageSize ?? 10);
  const query = reactive<Partial<ExchangeListParams>>({ ...(options.defaultQuery ?? {}) });

  async function fetchList() {
    loading.value = true;
    try {
      const result = await ExchangeApi.fetchExchangeList({
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
      delete query[k as keyof ExchangeListParams];
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
