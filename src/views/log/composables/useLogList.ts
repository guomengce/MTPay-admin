/**
 * log 列表 composable 骨架
 */
import { reactive, ref } from 'vue';

import * as LogApi from '@/api/modules/log';
import type { LogListParams } from '@/api/modules/log';

export interface UseLogListOptions {
  pageSize?: number;
  defaultQuery?: Partial<LogListParams>;
}

export function useLogList(options: UseLogListOptions = {}) {
  const loading = ref(false);
  const list = ref<LogApi.LogEntry[]>([]);
  const total = ref(0);
  const page = ref(1);
  const pageSize = ref(options.pageSize ?? 10);
  const query = reactive<Partial<LogListParams>>({ ...(options.defaultQuery ?? {}) });

  async function fetchList() {
    loading.value = true;
    try {
      const result = await LogApi.fetchLogList({
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
      delete query[k as keyof LogListParams];
    }
    page.value = 1;
  }

  async function exportLog() {
    const blob = await LogApi.fetchExportLog({
      page: page.value,
      pageSize: pageSize.value,
      ...query,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `操作记录-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    exportLog,
  };
}
