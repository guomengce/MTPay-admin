/**
 * dashboard composable 骨架
 * 营运总览页面：指标卡、待办、流向、比例快照。
 * 接入页面：在 setup() 内 await fetchOverview()。
 */
import { ref } from 'vue';

import * as DashboardApi from '@/api/modules/dashboard';
import type { AsyncResult } from '@/api/types';

export function useDashboard() {
  const loading = ref(false);
  const overview = ref<DashboardApi.DashboardOverview | null>(null);
  const error = ref<string | null>(null);

  async function fetchOverview(params?: {
    range?: '7d' | '30d' | '90d';
  }): Promise<AsyncResult<DashboardApi.DashboardOverview>> {
    loading.value = true;
    error.value = null;
    try {
      const data = await DashboardApi.fetchDashboardOverview(params ?? {});
      overview.value = data;
      return { ok: true, data };
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载面板数据失败';
      return { ok: false, error: e instanceof Error ? e : new Error('failed') };
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    overview.value = null;
    error.value = null;
  }

  return {
    loading,
    overview,
    error,
    fetchOverview,
    reset,
  };
}
