/** 管理端兑换审核 API：列表、详情、审核。 */
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

/** 获取兑换分页列表。GET /admin/getExchangeList */
export function fetchExchangeList(params: ExchangeListParams) {
  return request.get<unknown, ExchangePageResult>('/admin/getExchangeList', { params });
}

/** 获取兑换详情。GET /admin/getExchangeInfo?id=... */
export function fetchExchangeDetail(id: number) {
  return request.get<unknown, ExchangeOrderDetail>('/admin/getExchangeInfo', { params: { id } });
}

/** 审核兑换；仅待审核订单允许操作。POST /admin/reviewExchange */
export function reviewExchange(payload: ReviewExchangePayload) {
  return request.post<unknown, ExchangeOrderDetail>('/admin/reviewExchange', payload);
}
