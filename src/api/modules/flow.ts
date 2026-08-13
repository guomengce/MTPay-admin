/**
 * flow 模块接口骨架
 * -----------------------------------------------------------------------------
 * 资金流水：列表 + 详情（只读）。
 */
import request from '../request';
import type { FlowDetail } from '@/views/flow/detail/types';
import type { Id, PageParams, PageResult } from '../types';

export interface FlowListItem {
  id: Id;
  time: string;
  flowType: string;
  agent: string;
  amount: string;
  asset: string;
  status: string;
  statusType: 'warning' | 'success' | 'danger' | 'primary' | 'gray';
  statusEffect?: 'pending' | 'plain';
}

export type FlowListParams = PageParams & {
  status?: string;
  flowType?: string;
  agent?: string;
};

export function fetchFlowList(params: FlowListParams) {
  return request.get<unknown, PageResult<FlowListItem>>('/flow/list', { params });
}

export function fetchFlowDetail(id: Id) {
  return request.get<unknown, FlowDetail>(`/flow/detail/${id}`);
}
