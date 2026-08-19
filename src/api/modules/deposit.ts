/** 管理端入金审核 API：列表、详情、审核。 */
import request from '../request';

export type DepositStatus = 0 | 1 | 2;
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
  receiving_address_snapshot: string;
  status: DepositStatus;
  status_name: string;
  submitted_at: string;
  updated_at: string;
}

export interface DepositOrderDetail extends DepositOrder {
  review: ReviewInfo;
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

export interface ReviewDepositPayload {
  id: number;
  decision: ReviewDecision;
  review_note?: string;
}

/** 获取入金分页列表。GET /admin/getDepositList */
export function fetchDepositList(params: DepositListParams) {
  return request.get<unknown, DepositPageResult>('/admin/getDepositList', { params });
}

/** 获取入金详情。GET /admin/getDepositInfo?id=... */
export function fetchDepositDetail(id: number) {
  return request.get<unknown, DepositOrderDetail>('/admin/getDepositInfo', { params: { id } });
}

/** 审核入金；仅待审核订单允许操作。POST /admin/reviewDeposit */
export function reviewDeposit(payload: ReviewDepositPayload) {
  return request.post<unknown, DepositOrderDetail>('/admin/reviewDeposit', payload);
}
