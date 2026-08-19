/**
 * 操作记录（管理员行为审计）
 * -----------------------------------------------------------------------------
 * 第一版只提供列表，不提供筛选、详情和导出。
 */
import request from '../request';

export interface AdminOperationLog {
  id: number;
  admin_id: number;
  admin_name: string;
  admin_email: string;
  module: string;
  action: string;
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
