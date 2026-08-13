/**
 * fee composable 骨架
 * 比例与费用页面：默认兑换比例 + 固定出金手续费 + 代理专属比例
 */
import { ref } from 'vue';

import * as FeeApi from '@/api/modules/fee';
import type { AsyncResult, Id } from '@/api/types';

export function useFeeSettings() {
  const loading = ref(false);
  const saving = ref(false);

  const defaultRate = ref<FeeApi.DefaultRatePayload>({ usdtRate: '', usdcRate: '' });
  const fixedFee = ref<FeeApi.FixedWithdrawalFee>({ fee: '', currency: 'USD' });
  const agentList = ref<FeeApi.FeeAgentRow[]>([]);

  async function fetchAll(): Promise<AsyncResult<void>> {
    loading.value = true;
    try {
      const [rate, fee, list] = await Promise.all([
        FeeApi.fetchDefaultRate(),
        FeeApi.fetchFixedWithdrawalFee(),
        FeeApi.fetchFeeAgentList(),
      ]);
      defaultRate.value = rate;
      fixedFee.value = fee;
      agentList.value = list.list;
      return { ok: true, data: undefined };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e : new Error('failed') };
    } finally {
      loading.value = false;
    }
  }

  async function saveDefaultRate(payload: FeeApi.DefaultRatePayload) {
    saving.value = true;
    try {
      await FeeApi.fetchUpdateDefaultRate(payload);
      defaultRate.value = payload;
    } finally {
      saving.value = false;
    }
  }

  async function saveFixedFee(payload: FeeApi.FixedWithdrawalFee) {
    saving.value = true;
    try {
      await FeeApi.fetchUpdateFixedWithdrawalFee(payload);
      fixedFee.value = payload;
    } finally {
      saving.value = false;
    }
  }

  async function saveAgent(code: Id, payload: Omit<FeeApi.UpdateFeeAgentPayload, 'code'>) {
    saving.value = true;
    try {
      await FeeApi.fetchUpdateFeeAgent({ code, ...payload });
      const idx = agentList.value.findIndex((it) => it.code === code);
      if (idx >= 0) {
        agentList.value[idx] = { ...agentList.value[idx], ...payload };
      }
    } finally {
      saving.value = false;
    }
  }

  return {
    loading,
    saving,
    defaultRate,
    fixedFee,
    agentList,
    fetchAll,
    saveDefaultRate,
    saveFixedFee,
    saveAgent,
  };
}
