/**
 * flow 详情 composable 骨架（只读，无审核）
 */
import { ref } from 'vue';

import * as FlowApi from '@/api/modules/flow';
import type { AsyncResult, Id } from '@/api/types';
import type { FlowDetail } from '@/views/flow/detail/types';

export function useFlowDetail() {
  const loading = ref(false);
  const detail = ref<FlowDetail | null>(null);
  const error = ref<string | null>(null);

  async function fetchDetail(id: Id): Promise<AsyncResult<FlowDetail>> {
    loading.value = true;
    error.value = null;
    try {
      const data = await FlowApi.fetchFlowDetail(id);
      detail.value = data;
      return { ok: true, data };
    } catch (e) {
      error.value = e instanceof Error ? e.message : '详情加载失败';
      return { ok: false, error: e instanceof Error ? e : new Error('failed') };
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    detail.value = null;
    error.value = null;
  }

  return {
    loading,
    detail,
    error,
    fetchDetail,
    reset,
  };
}
