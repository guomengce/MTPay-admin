/**
 * 管理端运营总览：统一处理首页聚合接口、加载状态与错误状态。
 */
import { ref } from 'vue';

import * as DashboardApi from '@/api/modules/dashboard';
import type { AsyncResult } from '@/api/types';

export function useDashboard() {
  const loading = ref(false);
  const overview = ref<DashboardApi.OperationOverview | null>(null);
  const error = ref<string | null>(null);

  async function fetchOverview(): Promise<AsyncResult<DashboardApi.OperationOverview>> {
    loading.value = true;
    error.value = null;
    try {
      const data = await DashboardApi.fetchOperationOverview();
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
