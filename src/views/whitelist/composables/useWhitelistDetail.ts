/**
 * whitelist 详情 composable 骨架
 */
import { ref } from 'vue';

import * as WhitelistApi from '@/api/modules/whitelist';
import type { AsyncResult, Id } from '@/api/types';
import type { WhitelistDetail } from '@/views/whitelist/detail/types';

export function useWhitelistDetail() {
  const loading = ref(false);
  const detail = ref<WhitelistDetail | null>(null);
  const error = ref<string | null>(null);

  async function fetchDetail(id: Id): Promise<AsyncResult<WhitelistDetail>> {
    loading.value = true;
    error.value = null;
    try {
      const data = await WhitelistApi.fetchWhitelistDetail(id);
      detail.value = data;
      return { ok: true, data };
    } catch (e) {
      error.value = e instanceof Error ? e.message : '详情加载失败';
      return { ok: false, error: e instanceof Error ? e : new Error('failed') };
    } finally {
      loading.value = false;
    }
  }

  async function submitReview(payload: WhitelistApi.ReviewWhitelistPayload) {
    return WhitelistApi.fetchReviewWhitelist(payload);
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
