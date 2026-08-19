/**
 * 管理端运营总览 API
 * -----------------------------------------------------------------------------
 * 首页只调用一次聚合接口，禁止前端分别拉取业务列表后自行统计。
 */
import request from '../request';

export interface OperationAgentSummary {
  total_count: number;
  active_count: number;
  active_percentage: number;
}

export interface OperationCurrency {
  id: number;
  code: string;
  name: string;
  type: number;
  type_name: string;
  decimal_places: number;
}

export interface OperationBalanceTotal {
  currency: OperationCurrency;
  available_balance: string;
  frozen_balance: string;
  total_balance: string;
  frozen_percentage: string;
}

export interface OperationPendingBusinesses {
  deposit: number;
  exchange: number;
  whitelist: number;
  withdrawal: number;
  total: number;
}

export interface OperationTrendItem {
  date: string;
  deposit: number;
  exchange: number;
  withdrawal: number;
  total: number;
}

export interface OperationTransactionTrend {
  days: number;
  started_at: string;
  ended_at: string;
  total: number;
  items: OperationTrendItem[];
}

export type TransactionBusinessType = 'deposit' | 'exchange' | 'withdrawal';

export interface OperationTransactionUser {
  id: number;
  agent_code: string;
  company_name: string;
  email: string;
}

export interface OperationTransactionItem {
  transaction_key: string;
  business_type: TransactionBusinessType;
  business_name: string;
  id: number;
  business_id: number;
  order_no: string;
  user: OperationTransactionUser;
  currency_code: string;
  network_code: string | null;
  amount: string;
  target_currency_code: string | null;
  target_amount: string | null;
  exchange_rate: string | null;
  fee_amount: string | null;
  total_amount: string | null;
  payer_name: string | null;
  payee_name: string | null;
  status: number;
  status_name: string;
  status_group: string;
  status_group_name: string;
  submitted_at: string;
  completed_at: string | null;
  finished_at: string | null;
  detail_type: TransactionBusinessType;
  detail_id: number;
}

export interface OperationOverview {
  agent_summary: OperationAgentSummary;
  balance_totals: OperationBalanceTotal[];
  pending_businesses: OperationPendingBusinesses;
  transaction_trend: OperationTransactionTrend;
  recent_transactions: OperationTransactionItem[];
}

/** 获取管理端运营总览。GET /admin/getOperationOverview（无参数） */
export function fetchOperationOverview() {
  return request.get<unknown, OperationOverview>('/admin/getOperationOverview');
}
