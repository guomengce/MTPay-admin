/**
 * whitelist 模块接口骨架
 * -----------------------------------------------------------------------------
 * 白名单审核：列表、详情、审核通过 / 拒绝。
 */
import request from '../request';
import type { WhitelistDetail } from '@/views/whitelist/detail/types';
import type { Id, PageParams, PageResult } from '../types';

export interface WhitelistListItem {
  id: Id;
  time: string;
  agent: string;
  type: string;
  subject: string;
  country: string;
  bank: string;
  account: string;
  status: string;
  statusType: 'warning' | 'success' | 'danger' | 'primary' | 'gray';
  statusEffect?: 'pending' | 'plain';
}

export type WhitelistListParams = PageParams & {
  status?: string;
  country?: string;
  agent?: string;
};

export function fetchWhitelistList(params: WhitelistListParams) {
  return request.get<unknown, PageResult<WhitelistListItem>>('/whitelist/list', { params });
}

export function fetchWhitelistDetail(id: Id) {
  return request.get<unknown, WhitelistDetail>(`/whitelist/detail/${id}`);
}

export interface ReviewWhitelistPayload {
  id: Id;
  mode: 'approve' | 'reject';
  remark?: string;
}

export function fetchReviewWhitelist(payload: ReviewWhitelistPayload) {
  return request.post<unknown, WhitelistDetail>('/whitelist/review', payload);
}
