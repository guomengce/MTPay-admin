/**
 * deposit 详情 composable 骨架
 */
import { ref } from 'vue';

import * as DepositApi from '@/api/modules/deposit';
import type { AsyncResult, Id } from '@/api/types';
import type { DepositDetail } from '@/views/deposit/detail/types';

export function useDepositDetail() {
  const loading = ref(false);
  const detail = ref<DepositDetail | null>(null);
  const error = ref<string | null>(null);

  async function fetchDetail(id: Id): Promise<AsyncResult<DepositDetail>> {
    loading.value = true;
    error.value = null;
    try {
      const data = await DepositApi.fetchDepositDetail(id);
      detail.value = data;
      return { ok: true, data };
    } catch (e) {
      error.value = e instanceof Error ? e.message : '详情加载失败';
      return { ok: false, error: e instanceof Error ? e : new Error('failed') };
    } finally {
      loading.value = false;
    }
  }

  async function submitReview(payload: DepositApi.ReviewDepositPayload) {
    return DepositApi.fetchReviewDeposit(payload);
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
    submitReview,
    reset,
  };
}
