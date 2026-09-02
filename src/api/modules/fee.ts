/**
 * fee 模塊真實接口
 * -----------------------------------------------------------------------------
 * 比例與費用：默認兑換比例、代理專屬比例。
 * 金額與比例一律十進制字符串，不做浮點計算。
 */
import request from '../request';

export interface RateCurrencyRef {
  id: number;
  code: string;
  name: string;
}

export interface RateItem {
  id: number;
  source_currency: RateCurrencyRef;
  target_currency: RateCurrencyRef;
  rate: string;
  updated_at: string | null;
}

export interface RateFeeConfig {
  default_exchange_rates: {
    USDT?: RateItem;
    USDC?: RateItem;
  };
  usd_withdrawal_fee: {
    id: number;
    currency: RateCurrencyRef;
    fee_amount: string;
    updated_at: string | null;
  };
}

export interface AgentRateEntry {
  source_currency: RateCurrencyRef;
  target_currency: RateCurrencyRef;
  default_rate: string;
  custom_rate: string | null;
  effective_rate: string;
  rate_source: 'agent' | 'default';
  rate_source_name: string;
}

export interface AgentRateConfig {
  user_id: number;
  agent_code: string;
  company_name: string;
  email: string;
  status: number;
  status_name: string;
  has_custom_rate: boolean;
  rates: {
    USDT?: AgentRateEntry;
    USDC?: AgentRateEntry;
  };
}

export interface AgentRatePageResult {
  current_page: number;
  data: AgentRateConfig[];
  per_page: number;
  total: number;
  last_page: number;
}

export interface AgentRateListParams {
  keyword?: string;
  status?: number;
  page?: number;
  limit?: number;
}

/** 默認兑換比例與固定手續費配置。 */
export function fetchRateFeeConfig() {
  return request.get<unknown, RateFeeConfig>('/admin/getRateFeeConfig');
}

/** 保存平台默認兑換比例。 */
export function setDefaultExchangeRates(payload: { usdt_rate: string; usdc_rate: string }) {
  return request.post<unknown, RateFeeConfig>('/admin/setDefaultExchangeRates', payload);
}

/** 代理專屬比例分頁列表。 */
export function fetchAgentExchangeRateList(params: AgentRateListParams = {}) {
  return request.get<unknown, AgentRatePageResult>('/admin/getAgentExchangeRateList', { params });
}

/** 設置代理專屬比例。 */
export function setAgentExchangeRates(payload: {
  user_id: number;
  usdt_rate: string;
  usdc_rate: string;
}) {
  return request.post<unknown, AgentRateConfig>('/admin/setAgentExchangeRates', payload);
}

/** 清除代理專屬比例，恢復使用平台默認。 */
export function clearAgentExchangeRates(userId: number) {
  return request.post<unknown, AgentRateConfig>('/admin/clearAgentExchangeRates', {
    user_id: userId,
  });
}
