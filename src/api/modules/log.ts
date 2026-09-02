/**
 * 操作記錄（管理員行為審計）
 * -----------------------------------------------------------------------------
 * 第一版只提供列表，不提供篩選、詳情和導出。
 */
import request from '../request';

export interface AdminOperationLog {
  id: number;
  admin_id: number;
  admin_name: string;
  admin_email: string;
  module_name: string;
  action_name: string;
  content: string;
  target_type: string;
  target_id: string;
  ip: string;
  operated_at: string;
}

export interface OperationLogPageResult {
  current_page: number;
  data: AdminOperationLog[];
  per_page: number;
  total: number;
  last_page: number;
}

export interface OperationLogListParams {
  page?: number;
  limit?: number;
}

export function fetchOperationLogList(params: OperationLogListParams = {}) {
  return request.get<unknown, OperationLogPageResult>('/admin/getOperationLogList', { params });
}
