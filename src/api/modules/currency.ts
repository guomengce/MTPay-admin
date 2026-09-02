/** 管理端幣種基礎資料 API。 */
import request from '../request';

export type CurrencyStatus = 0 | 1;
export type CurrencyType = 1 | 2;

export interface CurrencyItem {
  id: number;
  type: CurrencyType;
  type_name?: string;
  code: string;
  name: string;
  fee_amount?: string | null;
  status: CurrencyStatus;
  status_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CurrencyListParams {
  keyword?: string;
  status?: CurrencyStatus;
  page: number;
  limit: number;
}

export interface CurrencyListResult {
  current_page: number;
  data: CurrencyItem[];
  per_page: number;
  total: number;
  last_page: number;
}

export interface AddCurrencyPayload {
  type: CurrencyType;
  code: string;
  name: string;
  fee_amount?: string;
}

export function getCurrencyList(params: CurrencyListParams) {
  return request.get<unknown, CurrencyListResult>('/admin/getCurrencyList', { params });
}

export function addCurrency(payload: AddCurrencyPayload) {
  const form = new FormData();
  form.append('type', String(payload.type));
  form.append('code', payload.code);
  form.append('name', payload.name);
  if (payload.type === 2 && payload.fee_amount !== undefined) {
    form.append('fee_amount', payload.fee_amount);
  }
  return request.post<unknown, CurrencyItem>('/admin/addCurrency', form);
}

export interface EditCurrencyPayload {
  id: number;
  name: string;
  fee_amount?: string;
}

export function editCurrency(payload: EditCurrencyPayload) {
  const form = new FormData();
  form.append('id', String(payload.id));
  form.append('name', payload.name);
  if (payload.fee_amount !== undefined) form.append('fee_amount', payload.fee_amount);
  return request.post<unknown, CurrencyItem>('/admin/editCurrency', form);
}
export function editCurrencyStatus(payload: { id: number; status: CurrencyStatus }) {
  const form = new FormData();
  form.append('id', String(payload.id));
  form.append('status', String(payload.status));
  return request.post<unknown, CurrencyItem>('/admin/editCurrencyStatus', form);
}
