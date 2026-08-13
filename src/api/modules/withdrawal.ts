/**
 * withdrawal 模块接口骨架
 * -----------------------------------------------------------------------------
 * 出金管理：列表、详情、付款完成 / 退回。
 */
import request from '../request';
import type { WithdrawalDetail } from '@/views/withdrawal/detail/types';
import type { Id, PageParams, PageResult } from '../types';

export interface WithdrawalListItem {
  id: Id;
  time: string;
  agent: string;
  relation: string;
  parties: string;
  amount: string;
  fee: string;
  status: string;
  statusType: 'warning' | 'success' | 'danger' | 'primary' | 'gray';
  statusEffect?: 'pending' | 'plain';
}

export type WithdrawalListParams = PageParams & {
  status?: string;
  agent?: string;
};

export function fetchWithdrawalList(params: WithdrawalListParams) {
  return request.get<unknown, PageResult<WithdrawalListItem>>('/withdrawal/list', { params });
}

export function fetchWithdrawalDetail(id: Id) {
  return request.get<unknown, WithdrawalDetail>(`/withdrawal/detail/${id}`);
}

/** 付款完成 */
export interface CompleteWithdrawalPayload {
  id: Id;
  reference: string;
  note?: string;
}

export function fetchCompleteWithdrawal(payload: CompleteWithdrawalPayload) {
  return request.post<unknown, WithdrawalDetail>('/withdrawal/complete', payload);
}

/** 退回 */
export interface ReturnWithdrawalPayload {
  id: Id;
  reason: string;
}

export function fetchReturnWithdrawal(payload: ReturnWithdrawalPayload) {
  return request.post<unknown, WithdrawalDetail>('/withdrawal/return', payload);
}
