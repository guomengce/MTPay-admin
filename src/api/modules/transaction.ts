/**
 * 管理端統一交易記錄
 * -----------------------------------------------------------------------------
 * 聚合入金、兑換、出金與人工資產調整；列表與詳情均只讀。
 */
import request from '../request';
import type { DepositOrderDetail, ReviewInfo } from './deposit';
import type { ExchangeOrderDetail } from './exchange';
import type { WithdrawalFile, WithdrawalParty, WithdrawalRecord } from './withdrawal';

export type TransactionBusinessType =
  | 'deposit'
  | 'fiat_deposit'
  | 'exchange'
  | 'withdrawal'
  | 'manual_increase'
  | 'manual_decrease';

export interface TransactionUserRef {
  id: number;
  agent_code: string;
  company_name: string;
  email: string;
}

export interface TransactionItem {
  transaction_key: string;
  business_type: TransactionBusinessType;
  business_name: string;
  id: number;
  business_id: number;
  order_no: string;
  user: TransactionUserRef;
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
  /** 後端補充後用於統一交易列表展示主體類別；舊接口可能不返回。 */
  payer_entity_type?: 1 | 2 | null;
  payer_entity_type_name?: string | null;
  payee_entity_type?: 1 | 2 | null;
  payee_entity_type_name?: string | null;
  status: number;
  status_name: string;
  status_group: string;
  status_group_name: string;
  submitted_at: string | null;
  completed_at: string | null;
  finished_at: string | null;
  detail_type: TransactionBusinessType;
  detail_id: number;
}

export interface TransactionListParams {
  user_id?: number;
  business_type?: TransactionBusinessType;
  status_group?: string;
  currency_code?: string;
  order_no?: string;
  keyword?: string;
  started_at?: string;
  ended_at?: string;
  page?: number;
  limit?: number;
}

export interface TransactionPageResult {
  current_page: number;
  data: TransactionItem[];
  per_page: number;
  total: number;
  last_page: number;
}

/**
 * 統一交易詳情中允許出現的出金詳情字段：
 * - 後端當前接口不返回 `fund_times` 與 `available_actions`；
 * - `review` / `payment` / `application_files` / `payment_files` / `records` 與原詳情接口一致；
 * - `payer.snapshot` / `payee.snapshot` 當前接口不返回，僅展示白名單基礎信息。
 */
export interface TransactionWithdrawalDetail {
  id: number;
  order_no: string;
  user: import('./deposit').BusinessUser;
  currency: import('./deposit').CurrencyRef;
  amount: string;
  fee_amount: string;
  total_amount: string;
  payer: WithdrawalParty;
  payee: WithdrawalParty;
  status: import('./withdrawal').WithdrawalStatus;
  status_name: string;
  application_file_count: number;
  payment_file_count: number;
  submitted_at: string | null;
  updated_at: string | null;
  review: ReviewInfo;
  payment: {
    admin_id: number | null;
    admin_name: string | null;
    failure_reason: string | null;
    processing_at: string | null;
    completed_at: string | null;
    failed_at: string | null;
  };
  application_files: WithdrawalFile[];
  payment_files: WithdrawalFile[];
  records: WithdrawalRecord[];
}

export interface ManualBalanceAdjustmentDetail {
  id?: number;
  user_id?: number;
  currency_code?: string;
  direction?: 'increase' | 'decrease' | 1 | 2;
  amount?: string;
  balance_before?: string | null;
  balance_after?: string | null;
  reason?: string | null;
  admin_name?: string | null;
  admin?: { id: number; name: string } | null;
  adjusted_at?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
}

/** 業務詳情聯合類型；通過 `transaction.business_type` 區分。 */
export type TransactionDetail =
  | DepositOrderDetail
  | ExchangeOrderDetail
  | TransactionWithdrawalDetail
  | ManualBalanceAdjustmentDetail;

export interface TransactionInfoResult {
  transaction: TransactionItem;
  detail: TransactionDetail;
}

/** 統一交易分頁列表。 */
export function fetchTransactionList(params: TransactionListParams = {}) {
  return request.get<unknown, TransactionPageResult>('/admin/getTransactionList', { params });
}

/** 統一交易詳情（只讀，返回交易公共字段 + 對應業務詳情）。 */
export function fetchTransactionInfo(payload: {
  business_type: TransactionBusinessType;
  business_id: number;
}) {
  return request.get<unknown, TransactionInfoResult>('/admin/getTransactionInfo', {
    params: payload,
  });
}
