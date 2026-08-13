/**
 * flow 列表 composable 骨架
 */
import { reactive, ref } from 'vue';

import * as FlowApi from '@/api/modules/flow';
import type { FlowListParams } from '@/api/modules/flow';

export interface UseFlowListOptions {
  pageSize?: number;
  defaultQuery?: Partial<FlowListParams>;
}

export function useFlowList(options: UseFlowListOptions = {}) {
  const loading = ref(false);
  const list = ref<FlowApi.FlowListItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(options.pageSize ?? 10);
  const query = reactive<Partial<FlowListParams>>({ ...(options.defaultQuery ?? {}) });

  async function fetchList() {
    loading.value = true;
    try {
      const result = await FlowApi.fetchFlowList({
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
      delete query[k as keyof FlowListParams];
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
