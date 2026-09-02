/** 管理端 USD 出金 API：列表、詳情、審核、付款處理及私有附件。 */
import request from '../request';

import type { BusinessUser, CurrencyRef, ReviewDecision, ReviewInfo } from './deposit';

export type WithdrawalStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function cancelCompletedWithdrawal(id: number, reason?: string) {
  const form = new FormData();
  form.append('id', String(id));
  if (reason?.trim()) form.append('reason', reason.trim());
  return request.post<unknown, unknown>('/admin/cancelCompletedWithdrawal', form);
}
export type WithdrawalPaymentResult = 'complete' | 'fail';

export interface WithdrawalParty {
  whitelist_id: number;
  whitelist_no: string;
  entity_type: 1 | 2;
  name: string;
  data?: Record<string, unknown>;
  /** 兼容舊版詳情響應，新接口以 data 為準。 */
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

/** 獲取 USD 出金分頁列表。 */
export function fetchWithdrawalList(params: WithdrawalListParams) {
  return request.get<unknown, WithdrawalPageResult>('/admin/getWithdrawalList', { params });
}

/** 獲取單筆 USD 出金完整詳情。 */
export function fetchWithdrawalDetail(id: number) {
  return request.get<unknown, WithdrawalOrderDetail>('/admin/getWithdrawalInfo', {
    params: { id },
  });
}

/** 待審核訂單要求代理補充文件。 */
export function requestWithdrawalSupplement(payload: RequestWithdrawalSupplementPayload) {
  return request.post<unknown, WithdrawalOrderDetail>(
    '/admin/requestWithdrawalSupplement',
    payload,
  );
}

/** 審核訂單；通過進入付款處理中，駁回會釋放凍結資金。 */
export function reviewWithdrawal(payload: ReviewWithdrawalPayload) {
  return request.post<unknown, WithdrawalOrderDetail>('/admin/reviewWithdrawal', payload);
}

/** 上傳未綁定的管理員付款憑證，返回 file_id 供後續動作綁定。 */
export function uploadWithdrawalFile(formData: FormData) {
  return request.post<unknown, WithdrawalFile>('/admin/uploadWithdrawalFile', formData);
}

/** 登記付款完成或失敗；付款失敗不得攜帶文件。 */
export function processWithdrawalPayment(payload: ProcessWithdrawalPaymentPayload) {
  return request.post<unknown, WithdrawalOrderDetail>('/admin/processWithdrawalPayment', payload);
}

/** 已完成訂單追加付款憑證。 */
export function appendWithdrawalPaymentFiles(payload: AppendWithdrawalPaymentFilesPayload) {
  return request.post<unknown, WithdrawalOrderDetail>(
    '/admin/appendWithdrawalPaymentFiles',
    payload,
  );
}

/** 鑑權預覽出金附件；響應攔截器對二進制直接返回 Blob。 */
export function previewWithdrawalFile(fileId: number) {
  return request.get<unknown, Blob>('/admin/previewWithdrawalFile', {
    params: { file_id: fileId },
    responseType: 'blob',
    timeout: 120_000,
    silent: true,
  });
}

/** 鑑權下載出金附件；響應攔截器對二進制直接返回 Blob。 */
export function downloadWithdrawalFile(fileId: number) {
  return request.get<unknown, Blob>('/admin/downloadWithdrawalFile', {
    params: { file_id: fileId },
    responseType: 'blob',
    timeout: 120_000,
    silent: true,
  });
}
