import request from '../request';
export type FiatDepositStatus = 0 | 1 | 2;
export interface FiatCurrency {
  id: number;
  code: string;
  name: string;
  decimal_places: number;
}
export interface FiatFile {
  file_id: number;
  original_name: string;
  extension: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
  bound_at: string | null;
}
export interface FiatOrder {
  id: number;
  order_no: string;
  user: { id: number; agent_code: string; company_name: string; email: string };
  currency: FiatCurrency;
  amount: string;
  payer_name: string;
  payer_bank: string;
  remittance_reference: string;
  remittance_date: string;
  status: FiatDepositStatus;
  status_name: string;
  file_count: number;
  submitted_at: string;
  updated_at: string;
}
export interface FiatOrderDetail extends FiatOrder {
  payer_account_last4: string;
  remark: string | null;
  review: {
    admin_id: number | null;
    admin_name: string | null;
    note: string | null;
    reviewed_at: string | null;
    credited_at: string | null;
  };
  files: FiatFile[];
  timeline: { event: string; name: string; time: string }[];
}
export interface FiatPage {
  current_page: number;
  data: FiatOrder[];
  last_page: number;
  per_page: number;
  total: number;
}
export interface FiatFilters {
  user_id?: number;
  currency_id?: number;
  status?: FiatDepositStatus;
  keyword?: string;
  order_no?: string;
  started_at?: string;
  ended_at?: string;
  page?: number;
  limit?: number;
}
export function fetchFiatList(params: FiatFilters) {
  return request.get<unknown, FiatPage>('/admin/getFiatDepositList', { params });
}
export function fetchFiatDetail(id: number) {
  return request.get<unknown, FiatOrderDetail>('/admin/getFiatDepositInfo', { params: { id } });
}
export function reviewFiatDeposit(payload: {
  id: number;
  decision: 'approve' | 'reject';
  review_note?: string;
}) {
  return request.post<unknown, FiatOrderDetail>('/admin/reviewFiatDeposit', payload);
}
export function previewFiatFile(file_id: number) {
  return request.get<unknown, Blob>('/admin/previewFiatDepositFile', {
    params: { file_id },
    responseType: 'blob',
    timeout: 120_000,
  });
}
export function downloadFiatFile(file_id: number) {
  return request.get<unknown, Blob>('/admin/downloadFiatDepositFile', {
    params: { file_id },
    responseType: 'blob',
    timeout: 120_000,
  });
}
export function exportFiatCsv(params: Omit<FiatFilters, 'page' | 'limit'>) {
  return request.get<unknown, Blob>('/admin/exportFiatDepositCsv', {
    params,
    responseType: 'blob',
  });
}
