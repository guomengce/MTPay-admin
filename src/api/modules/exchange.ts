/**
 * exchange 模块接口骨架
 * -----------------------------------------------------------------------------
 * 兑换审核：列表、详情、审核通过 / 拒绝。
 */
import request from '../request';
import type { ExchangeDetail } from '@/views/exchange/detail/types';
import type { Id, PageParams, PageResult } from '../types';

export interface ExchangeListItem {
  id: Id;
  time: string;
  agent: string;
  code: string;
  amount: string;
  asset: string;
  rate: string;
  usd: string;
  status: string;
  statusType: 'warning' | 'success' | 'danger' | 'primary' | 'gray';
  statusEffect?: 'pending' | 'plain';
}

export type ExchangeListParams = PageParams & {
  status?: string;
  agent?: string;
};

export function fetchExchangeList(params: ExchangeListParams) {
  return request.get<unknown, PageResult<ExchangeListItem>>('/exchange/list', { params });
}

export function fetchExchangeDetail(id: Id) {
  return request.get<unknown, ExchangeDetail>(`/exchange/detail/${id}`);
}

export interface ReviewExchangePayload {
  id: Id;
  mode: 'approve' | 'reject';
  reason?: string;
}

export function fetchReviewExchange(payload: ReviewExchangePayload) {
  return request.post<unknown, ExchangeDetail>('/exchange/review', payload);
}
