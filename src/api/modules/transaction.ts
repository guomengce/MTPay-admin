/**
 * 管理端统一交易记录
 * -----------------------------------------------------------------------------
 * 聚合入金、兑换、出金三类订单；列表与详情均只读。
 */
import request from '../request';
import type { DepositOrderDetail, ReviewInfo } from './deposit';
import type { ExchangeOrderDetail } from './exchange';
import type { WithdrawalFile, WithdrawalParty, WithdrawalRecord } from './withdrawal';

export type TransactionBusinessType = 'deposit' | 'exchange' | 'withdrawal';

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
 * 统一交易详情中允许出现的出金详情字段：
 * - 后端当前接口不返回 `fund_times` 与 `available_actions`；
 * - `review` / `payment` / `application_files` / `payment_files` / `records` 与原详情接口一致；
 * - `payer.snapshot` / `payee.snapshot` 当前接口不返回，仅展示白名单基础信息。
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

/** 三类业务详情的联合类型；通过 `transaction.business_type` 区分。 */
export type TransactionDetail =
  | DepositOrderDetail
  | ExchangeOrderDetail
  | TransactionWithdrawalDetail;

export interface TransactionInfoResult {
  transaction: TransactionItem;
  detail: TransactionDetail;
}

/** 统一交易分页列表。 */
export function fetchTransactionList(params: TransactionListParams = {}) {
  return request.get<unknown, TransactionPageResult>('/admin/getTransactionList', { params });
}

/** 统一交易详情（只读，返回交易公共字段 + 对应业务详情）。 */
export function fetchTransactionInfo(payload: {
  business_type: TransactionBusinessType;
  business_id: number;
}) {
  return request.get<unknown, TransactionInfoResult>('/admin/getTransactionInfo', {
    params: payload,
  });
}
