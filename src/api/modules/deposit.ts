/** 管理端入金記錄 API：列表與詳情。 */
import request from '../request';

export type DepositStatus = 0 | 1 | 2;
/** 兑換、出金等仍需審核的模塊共用類型；入金流程不再使用。 */
export type ReviewDecision = 'approve' | 'reject';

export interface BusinessUser {
  id: number;
  agent_code: string;
  company_name: string;
  email: string;
}

export interface CurrencyRef {
  id: number;
  code: string;
  name: string;
  decimal_places: number;
}

export interface NetworkRef {
  id: number;
  code: string;
  name: string;
}

/** 兑換、出金等仍需審核的模塊共用審核信息。 */
export interface ReviewInfo {
  admin_id: number | null;
  admin_name: string | null;
  note: string | null;
  reviewed_at: string | null;
}

export interface TimelineItem {
  event: string;
  name: string;
  time: string | null;
}

export interface DepositOrder {
  id: number;
  order_no: string;
  user: BusinessUser;
  currency: CurrencyRef;
  network: NetworkRef;
  amount: string;
  txid: string;
  safeheron_tx_key: string;
  coin_key: string;
  source_address_snapshot: string;
  receiving_address_snapshot: string;
  status: DepositStatus;
  status_name: string;
  submitted_at: string;
  updated_at: string;
}

export interface DepositOrderDetail extends DepositOrder {
  credited_at: string | null;
  timeline: TimelineItem[];
}

export interface DepositPageResult {
  current_page: number;
  data: DepositOrder[];
  per_page: number;
  total: number;
  last_page: number;
}

export interface DepositListParams {
  user_id?: number;
  currency_id?: number;
  network_id?: number;
  status?: DepositStatus;
  keyword?: string;
  order_no?: string;
  txid?: string;
  started_at?: string;
  ended_at?: string;
  page: number;
  limit: number;
}

/** 獲取入金分頁列表。GET /admin/getDepositList */
export function fetchDepositList(params: DepositListParams) {
  return request.get<unknown, DepositPageResult>('/admin/getDepositList', { params });
}

/** 獲取入金詳情。GET /admin/getDepositInfo?id=... */
export function fetchDepositDetail(id: number) {
  return request.get<unknown, DepositOrderDetail>('/admin/getDepositInfo', { params: { id } });
}
