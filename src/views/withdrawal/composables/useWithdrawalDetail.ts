/**
 * withdrawal 详情 composable 骨架
 */
import { ref } from 'vue';

import * as WithdrawalApi from '@/api/modules/withdrawal';
import type { AsyncResult, Id } from '@/api/types';
import type { WithdrawalDetail } from '@/views/withdrawal/detail/types';

export function useWithdrawalDetail() {
  const loading = ref(false);
  const detail = ref<WithdrawalDetail | null>(null);
  const error = ref<string | null>(null);

  async function fetchDetail(id: Id): Promise<AsyncResult<WithdrawalDetail>> {
    loading.value = true;
    error.value = null;
    try {
      const data = await WithdrawalApi.fetchWithdrawalDetail(id);
      detail.value = data;
      return { ok: true, data };
    } catch (e) {
      error.value = e instanceof Error ? e.message : '详情加载失败';
      return { ok: false, error: e instanceof Error ? e : new Error('failed') };
    } finally {
      loading.value = false;
    }
  }

  async function completeWithdrawal(payload: WithdrawalApi.CompleteWithdrawalPayload) {
    return WithdrawalApi.fetchCompleteWithdrawal(payload);
  }

  async function returnWithdrawal(payload: WithdrawalApi.ReturnWithdrawalPayload) {
    return WithdrawalApi.fetchReturnWithdrawal(payload);
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
    completeWithdrawal,
    returnWithdrawal,
    reset,
  };
}
