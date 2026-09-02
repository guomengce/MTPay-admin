/** 管理端兑換審核 API：列表、詳情、審核。 */
import request from '../request';
import type {
  BusinessUser,
  CurrencyRef,
  ReviewDecision,
  ReviewInfo,
  TimelineItem,
} from './deposit';

export type ExchangeStatus = 0 | 1 | 2;

export interface ExchangeOrder {
  id: number;
  order_no: string;
  user: BusinessUser;
  source_currency: CurrencyRef;
  target_currency: CurrencyRef;
  source_amount: string;
  exchange_rate: string;
  rate_source: 'agent' | 'default';
  rate_source_name: string;
  target_amount: string;
  status: ExchangeStatus;
  status_name: string;
  submitted_at: string;
  frozen_at: string;
  updated_at: string;
}

export interface ExchangeOrderDetail extends ExchangeOrder {
  review: ReviewInfo;
  completed_at: string | null;
  timeline: TimelineItem[];
}

export interface ExchangePageResult {
  current_page: number;
  data: ExchangeOrder[];
  per_page: number;
  total: number;
  last_page: number;
}

export interface ExchangeListParams {
  user_id?: number;
  source_currency_id?: number;
  status?: ExchangeStatus;
  keyword?: string;
  order_no?: string;
  started_at?: string;
  ended_at?: string;
  page: number;
  limit: number;
}

export interface ReviewExchangePayload {
  id: number;
  decision: ReviewDecision;
  review_note?: string;
}

/** 獲取兑換分頁列表。GET /admin/getExchangeList */
export function fetchExchangeList(params: ExchangeListParams) {
  return request.get<unknown, ExchangePageResult>('/admin/getExchangeList', { params });
}

/** 獲取兑換詳情。GET /admin/getExchangeInfo?id=... */
export function fetchExchangeDetail(id: number) {
  return request.get<unknown, ExchangeOrderDetail>('/admin/getExchangeInfo', { params: { id } });
}

/** 審核兑換；僅待審核訂單允許操作。POST /admin/reviewExchange */
export function reviewExchange(payload: ReviewExchangePayload) {
  return request.post<unknown, ExchangeOrderDetail>('/admin/reviewExchange', payload);
}
