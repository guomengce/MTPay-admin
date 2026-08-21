/** 管理端白名单审核 API：列表、详情、补件要求、审核及鉴权文件。 */
import request from '../request';

export type WhitelistStatus = 0 | 1 | 2 | 3;
/** 白名单角色：1 付款人，2 收款人。 */
export type WhitelistRole = 1 | 2;
/** 主体类型：1 公司，2 个人。该枚举必须与提交白名单接口保持一致。 */
export type WhitelistEntityType = 1 | 2;

export interface WhitelistUser {
  id: number;
  agent_code: string;
  company_name: string;
  email: string;
}

export interface WhitelistFile {
  file_id: number;
  original_name: string;
  extension: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
}

export interface WhitelistRecord {
  id: number;
  action_type: number;
  action_name: string;
  actor_type: number;
  actor_type_name: string;
  actor_id: number | null;
  actor_name: string | null;
  message: string | null;
  files: WhitelistFile[];
  created_at: string | null;
}

export interface WhitelistItem {
  id: number;
  whitelist_no: string;
  user: WhitelistUser;
  role: WhitelistRole;
  role_name: string;
  entity_type: WhitelistEntityType;
  entity_type_name: string;
  subject_name: string;
  country: string;
  status: WhitelistStatus;
  status_name: string;
  file_count: number;
  submitted_at: string | null;
  updated_at: string | null;
}

export interface WhitelistDetail extends WhitelistItem {
  business_data: Record<string, unknown>;
  review: {
    admin_id: number | null;
    admin_name: string | null;
    note: string | null;
    reviewed_at: string | null;
  };
  records: WhitelistRecord[];
}

export interface WhitelistPageResult {
  current_page: number;
  data: WhitelistItem[];
  per_page: number;
  total: number;
  last_page: number;
}

export interface WhitelistListParams {
  page: number;
  limit: number;
}

export interface ReviewWhitelistPayload {
  id: number;
  decision: 'approve' | 'reject';
  review_note?: string;
}

export interface RequestWhitelistSupplementPayload {
  id: number;
  message: string;
}

/** 获取白名单分页列表；第一版仅支持 page/limit。 */
export function fetchWhitelistList(params: WhitelistListParams) {
  return request.get<unknown, WhitelistPageResult>('/admin/getWhitelistList', { params });
}

/** 获取白名单详情。 */
export function fetchWhitelistDetail(id: number) {
  return request.get<unknown, WhitelistDetail>('/admin/getWhitelistInfo', { params: { id } });
}

/** 要求代理补件；仅待审核状态可调用。 */
export function requestWhitelistSupplement(payload: RequestWhitelistSupplementPayload) {
  return request.post<unknown, WhitelistDetail>('/admin/requestWhitelistSupplement', payload);
}

/** 审核白名单；通过仅状态 0，驳回允许状态 0/1。 */
export function reviewWhitelist(payload: ReviewWhitelistPayload) {
  return request.post<unknown, WhitelistDetail>('/admin/reviewWhitelist', payload);
}

/** 鉴权预览白名单文件。 */
export function previewWhitelistFile(fileId: number) {
  return request.get<unknown, Blob>('/admin/previewWhitelistFile', {
    params: { file_id: fileId },
    responseType: 'blob',
  });
}

/** 鉴权下载白名单文件。 */
export function downloadWhitelistFile(fileId: number) {
  return request.get<unknown, Blob>('/admin/downloadWhitelistFile', {
    params: { file_id: fileId },
    responseType: 'blob',
  });
}
