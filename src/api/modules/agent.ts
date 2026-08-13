/**
 * agent 模块接口骨架
 * -----------------------------------------------------------------------------
 * 代理账户的新增 / 编辑 / 启用停用 / 列表 / 详情等。
 */
import request from '../request';
import type { Id, PageParams, PageResult } from '../types';

/** 代理列表项（页面表格用）*/
export interface AgentListItem {
  id: Id;
  agent: string;
  code: string;
  type: string;
  status: string;
  statusType: string;
  statusEffect?: string;
  availableBalance?: string;
  updatedAt: string;
}

/** 列表查询参数 */
export type AgentListParams = PageParams & {
  status?: string;
  type?: string;
};

/** 代理列表 */
export function fetchAgentList(params: AgentListParams) {
  return request.get<unknown, PageResult<AgentListItem>>('/agent/list', { params });
}

/** 代理详情（同步视图模型） */
export interface AgentDetail extends AgentListItem {
  contact?: string;
  email?: string;
  bankInfo?: Array<{ label: string; value: string }>;
  rateSettings?: {
    usdt: string;
    usdc: string;
    min: string;
    max: string;
  };
  remark?: string;
}

export function fetchAgentDetail(id: Id) {
  return request.get<unknown, AgentDetail>(`/agent/detail/${id}`);
}

/** 新建代理 */
export interface CreateAgentPayload {
  name: string;
  code: string;
  type: string;
  contact?: string;
  email?: string;
  remark?: string;
}

export function fetchCreateAgent(payload: CreateAgentPayload) {
  return request.post<unknown, AgentDetail>('/agent/create', payload);
}

/** 更新代理 */
export type UpdateAgentPayload = Partial<CreateAgentPayload> & { id: Id };

export function fetchUpdateAgent(payload: UpdateAgentPayload) {
  return request.put<unknown, AgentDetail>('/agent/update', payload);
}

/** 启用 / 停用 */
export function fetchToggleAgentStatus(id: Id, enabled: boolean) {
  return request.patch<unknown, void>('/agent/status', { id, enabled });
}
