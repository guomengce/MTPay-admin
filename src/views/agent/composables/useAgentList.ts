/**
 * agent 列表 composable 骨架
 */
import { reactive, ref } from 'vue';

import * as AgentApi from '@/api/modules/agent';
import type { AgentListParams } from '@/api/modules/agent';

export interface UseAgentListOptions {
  pageSize?: number;
  defaultQuery?: Partial<AgentListParams>;
}

export function useAgentList(options: UseAgentListOptions = {}) {
  const loading = ref(false);
  const list = ref<AgentApi.AgentListItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(options.pageSize ?? 10);
  const query = reactive<Partial<AgentListParams>>({ ...(options.defaultQuery ?? {}) });

  async function fetchList() {
    loading.value = true;
    try {
      const result = await AgentApi.fetchAgentList({
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
      delete query[k as keyof AgentListParams];
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
