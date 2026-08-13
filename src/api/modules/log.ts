/**
 * log 模块接口骨架
 * -----------------------------------------------------------------------------
 * 操作记录（管理员行为审计）。
 */
import request from '../request';
import type { Id, ISODateString, PageParams, PageResult } from '../types';

export interface LogEntry {
  id: Id;
  user: string;
  type: string;
  iconKey?: string;
  description: string;
  ip: string;
  userAgent: string;
  time: ISODateString;
}

export type LogListParams = PageParams & {
  user?: string;
  action?: string;
  range?: [ISODateString, ISODateString];
};

export function fetchLogList(params: LogListParams) {
  return request.get<unknown, PageResult<LogEntry>>('/log/list', { params });
}

/** 导出 */
export function fetchExportLog(params: LogListParams) {
  return request.get<unknown, Blob>('/log/export', {
    params,
    responseType: 'blob',
  });
}
