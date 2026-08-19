/**
 * 比例与费用页面组合逻辑
 * - 默认兑换比例 + 固定出金手续费来自 /admin/getRateFeeConfig；
 * - 代理专属比例来自 /admin/getAgentExchangeRateList，支持保存与恢复默认。
 */
import { reactive, ref } from 'vue';

import * as FeeApi from '@/api/modules/fee';
import type { RateFeeConfig } from '@/api/modules/fee';

export interface FeeAgentRow {
  user_id: number;
  agent_code: string;
  company_name: string;
  email: string;
  status: number;
  status_name: string;
  has_custom_rate: boolean;
  usdt_rate: string;
  usdt_source: string;
  usdc_rate: string;
  usdc_source: string;
}

function toAgentRow(item: FeeApi.AgentRateConfig): FeeAgentRow {
  const usdt = item.rates?.USDT;
  const usdc = item.rates?.USDC;
  return {
    user_id: item.user_id,
    agent_code: item.agent_code,
    company_name: item.company_name,
    email: item.email,
    status: item.status,
    status_name: item.status_name,
    has_custom_rate: item.has_custom_rate,
    usdt_rate: usdt?.effective_rate ?? '—',
    usdt_source: usdt?.rate_source_name ?? '—',
    usdc_rate: usdc?.effective_rate ?? '—',
    usdc_source: usdc?.rate_source_name ?? '—',
  };
}

export function useFeeSettings() {
  const loading = ref(false);
  const saving = ref(false);
  const config = ref<RateFeeConfig | null>(null);

  const agentList = ref<FeeAgentRow[]>([]);
  const agentTotal = ref(0);
  const agentPage = ref(1);
  const agentLimit = ref(10);
  const agentQuery = reactive({ keyword: '', status: undefined as number | undefined });

  async function fetchConfig() {
    loading.value = true;
    try {
      config.value = await FeeApi.fetchRateFeeConfig();
    } finally {
      loading.value = false;
    }
  }

  async function loadAgents() {
    loading.value = true;
    try {
      const result = await FeeApi.fetchAgentExchangeRateList({
        keyword: agentQuery.keyword.trim() || undefined,
        status: agentQuery.status,
        page: agentPage.value,
        limit: agentLimit.value,
      });
      agentList.value = result.data.map(toAgentRow);
      agentTotal.value = result.total;
      agentPage.value = result.current_page;
      agentLimit.value = result.per_page;
    } finally {
      loading.value = false;
    }
  }

  async function saveDefaultRates(payload: { usdt_rate: string; usdc_rate: string }) {
    saving.value = true;
    try {
      config.value = await FeeApi.setDefaultExchangeRates(payload);
    } finally {
      saving.value = false;
    }
  }

  async function saveFee(feeAmount: string) {
    saving.value = true;
    try {
      const fee = await FeeApi.setUsdWithdrawalFee({ fee_amount: feeAmount });
      if (config.value) {
        config.value = { ...config.value, usd_withdrawal_fee: fee };
      }
    } finally {
      saving.value = false;
    }
  }

  async function saveAgentRates(payload: {
    user_id: number;
    usdt_rate: string;
    usdc_rate: string;
  }) {
    saving.value = true;
    try {
      await FeeApi.setAgentExchangeRates(payload);
      await loadAgents();
    } finally {
      saving.value = false;
    }
  }

  async function clearAgentRates(userId: number) {
    saving.value = true;
    try {
      await FeeApi.clearAgentExchangeRates(userId);
      await loadAgents();
    } finally {
      saving.value = false;
    }
  }

  return {
    loading,
    saving,
    config,
    agentList,
    agentTotal,
    agentPage,
    agentLimit,
    agentQuery,
    fetchConfig,
    loadAgents,
    saveDefaultRates,
    saveFee,
    saveAgentRates,
    clearAgentRates,
  };
}
