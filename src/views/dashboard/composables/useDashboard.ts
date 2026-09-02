/**
 * 管理端運營總覽：統一處理首頁聚合接口、加載狀態與錯誤狀態。
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
      error.value = e instanceof Error ? e.message : '加載面板數據失敗';
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
