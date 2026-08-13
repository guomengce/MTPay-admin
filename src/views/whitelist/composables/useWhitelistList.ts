/**
 * whitelist 列表 composable 骨架
 */
import { reactive, ref } from 'vue';

import * as WhitelistApi from '@/api/modules/whitelist';
import type { WhitelistListParams } from '@/api/modules/whitelist';

export interface UseWhitelistListOptions {
  pageSize?: number;
  defaultQuery?: Partial<WhitelistListParams>;
}

export function useWhitelistList(options: UseWhitelistListOptions = {}) {
  const loading = ref(false);
  const list = ref<WhitelistApi.WhitelistListItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(options.pageSize ?? 10);
  const query = reactive<Partial<WhitelistListParams>>({ ...(options.defaultQuery ?? {}) });

  async function fetchList() {
    loading.value = true;
    try {
      const result = await WhitelistApi.fetchWhitelistList({
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
      delete query[k as keyof WhitelistListParams];
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
