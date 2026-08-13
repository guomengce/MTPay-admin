/**
 * exchange 详情 composable 骨架
 */
import { ref } from 'vue';

import * as ExchangeApi from '@/api/modules/exchange';
import type { AsyncResult, Id } from '@/api/types';
import type { ExchangeDetail } from '@/views/exchange/detail/types';

export function useExchangeDetail() {
  const loading = ref(false);
  const detail = ref<ExchangeDetail | null>(null);
  const error = ref<string | null>(null);

  async function fetchDetail(id: Id): Promise<AsyncResult<ExchangeDetail>> {
    loading.value = true;
    error.value = null;
    try {
      const data = await ExchangeApi.fetchExchangeDetail(id);
      detail.value = data;
      return { ok: true, data };
    } catch (e) {
      error.value = e instanceof Error ? e.message : '详情加载失败';
      return { ok: false, error: e instanceof Error ? e : new Error('failed') };
    } finally {
      loading.value = false;
    }
  }

  async function submitReview(payload: ExchangeApi.ReviewExchangePayload) {
    return ExchangeApi.fetchReviewExchange(payload);
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
