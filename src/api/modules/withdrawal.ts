/** 管理端 USD 出金 API：列表、详情、审核、付款处理及私有附件。 */
import request from '../request';

import type { BusinessUser, CurrencyRef, ReviewDecision, ReviewInfo } from './deposit';

export type WithdrawalStatus = 0 | 1 | 2 | 3 | 4 | 5;
export type WithdrawalPaymentResult = 'complete' | 'fail';

export interface WithdrawalParty {
  whitelist_id: number;
  whitelist_no: string;
  entity_type: 1 | 2;
  name: string;
  snapshot?: Record<string, unknown>;
}

export interface WithdrawalFile {
  file_id: number;
  file_type: 1 | 2;
  file_type_name: string;
  uploader_type: 1 | 2;
  uploader_name: string;
  original_name: string;
  extension: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
  bound_at: string | null;
}

export interface WithdrawalRecord {
  id: number;
  action_type?: number;
  action_name?: string;
  event?: string;
  name?: string;
  actor_type?: number;
  actor_type_name?: string;
  actor_id?: number | null;
  actor_name?: string | null;
  message?: string | null;
  files?: WithdrawalFile[];
  created_at?: string | null;
  time?: string | null;
}

export interface WithdrawalOrder {
  id: number;
  order_no: string;
  user: BusinessUser;
  currency: CurrencyRef;
  amount: string;
  fee_amount: string;
  total_amount: string;
  payer: WithdrawalParty;
  payee: WithdrawalParty;
  status: WithdrawalStatus;
  status_name: string;
  application_file_count: number;
  payment_file_count: number;
  submitted_at: string | null;
  updated_at: string | null;
}

export interface WithdrawalOrderDetail extends WithdrawalOrder {
  review: ReviewInfo;
  payment: {
    admin_id: number | null;
    admin_name: string | null;
    failure_reason: string | null;
    processing_at: string | null;
    completed_at: string | null;
    failed_at: string | null;
  };
  application_files: WithdrawalFile[];
  payment_files: WithdrawalFile[];
  records: WithdrawalRecord[];
  available_actions?: {
    agent_can_supplement: boolean;
    admin_can_request_supplement: boolean;
    admin_can_approve: boolean;
    admin_can_reject: boolean;
    admin_can_process_payment: boolean;
    admin_can_append_payment_files: boolean;
    payment_retry_allowed: boolean;
  };
}

export interface WithdrawalPageResult {
  current_page: number;
  data: WithdrawalOrder[];
  per_page: number;
  total: number;
  last_page: number;
}

export interface WithdrawalListParams {
  user_id?: number;
  status?: WithdrawalStatus;
  keyword?: string;
  order_no?: string;
  started_at?: string;
  ended_at?: string;
  page: number;
  limit: number;
}

export interface RequestWithdrawalSupplementPayload {
  id: number;
  message: string;
}

export interface ReviewWithdrawalPayload {
  id: number;
  decision: ReviewDecision;
  review_note?: string;
}

export interface ProcessWithdrawalPaymentPayload {
  id: number;
  result: WithdrawalPaymentResult;
  file_ids?: number[];
  failure_reason?: string;
}

export interface AppendWithdrawalPaymentFilesPayload {
  id: number;
  file_ids: number[];
  message?: string;
}

/** 获取 USD 出金分页列表。 */
export function fetchWithdrawalList(params: WithdrawalListParams) {
  return request.get<unknown, WithdrawalPageResult>('/admin/getWithdrawalList', { params });
}

/** 获取单笔 USD 出金完整详情。 */
export function fetchWithdrawalDetail(id: number) {
  return request.get<unknown, WithdrawalOrderDetail>('/admin/getWithdrawalInfo', {
    params: { id },
  });
}

/** 待审核订单要求代理补充文件。 */
export function requestWithdrawalSupplement(payload: RequestWithdrawalSupplementPayload) {
  return request.post<unknown, WithdrawalOrderDetail>(
    '/admin/requestWithdrawalSupplement',
    payload,
  );
}

/** 审核订单；通过进入付款处理中，驳回会释放冻结资金。 */
export function reviewWithdrawal(payload: ReviewWithdrawalPayload) {
  return request.post<unknown, WithdrawalOrderDetail>('/admin/reviewWithdrawal', payload);
}

/** 上传未绑定的管理员付款凭证，返回 file_id 供后续动作绑定。 */
export function uploadWithdrawalFile(formData: FormData) {
  return request.post<unknown, WithdrawalFile>('/admin/uploadWithdrawalFile', formData);
}

/** 登记付款完成或失败；付款失败不得携带文件。 */
export function processWithdrawalPayment(payload: ProcessWithdrawalPaymentPayload) {
  return request.post<unknown, WithdrawalOrderDetail>('/admin/processWithdrawalPayment', payload);
}

/** 已完成订单追加付款凭证。 */
export function appendWithdrawalPaymentFiles(payload: AppendWithdrawalPaymentFilesPayload) {
  return request.post<unknown, WithdrawalOrderDetail>(
    '/admin/appendWithdrawalPaymentFiles',
    payload,
  );
}

/** 鉴权预览出金附件；响应拦截器对二进制直接返回 Blob。 */
export function previewWithdrawalFile(fileId: number) {
  return request.get<unknown, Blob>('/admin/previewWithdrawalFile', {
    params: { file_id: fileId },
    responseType: 'blob',
  });
}

/** 鉴权下载出金附件；响应拦截器对二进制直接返回 Blob。 */
export function downloadWithdrawalFile(fileId: number) {
  return request.get<unknown, Blob>('/admin/downloadWithdrawalFile', {
    params: { file_id: fileId },
    responseType: 'blob',
  });
}
