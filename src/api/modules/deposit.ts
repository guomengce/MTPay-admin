/**
 * deposit 模块接口骨架
 * -----------------------------------------------------------------------------
 * 入金审核：列表、详情、审核通过 / 拒绝。
 * DetailViewModel 引用 views/deposit/detail/types.ts（已存在）。
 */
import request from '../request';
import type { DepositDetail } from '@/views/deposit/detail/types';
import type { Id, PageParams, PageResult } from '../types';

/** 列表项 */
export interface DepositListItem {
  id: Id;
  time: string;
  agent: string;
  asset: string;
  network: string;
  hash: string;
  amount: string;
  status: string;
  statusType: 'warning' | 'success' | 'danger' | 'primary' | 'gray';
  statusEffect?: 'pending' | 'plain';
}

export type DepositListParams = PageParams & {
  status?: string;
  agent?: string;
  asset?: string;
};

/** 列表 */
export function fetchDepositList(params: DepositListParams) {
  return request.get<unknown, PageResult<DepositListItem>>('/deposit/list', { params });
}

/** 详情 */
export function fetchDepositDetail(id: Id) {
  return request.get<unknown, DepositDetail>(`/deposit/detail/${id}`);
}

/** 审核 payload */
export interface ReviewDepositPayload {
  id: Id;
  mode: 'approve' | 'reject';
  reason?: string;
}

/** 通过 / 拒绝 */
export function fetchReviewDeposit(payload: ReviewDepositPayload) {
  return request.post<unknown, DepositDetail>('/deposit/review', payload);
}
