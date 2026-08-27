/** 管理端币种基础资料 API。 */
import request from '../request';

export type CurrencyStatus = 0 | 1;
export type CurrencyType = 1 | 2;

export interface CurrencyItem {
  id: number;
  type: CurrencyType;
  type_name?: string;
  code: string;
  name: string;
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
}

export function getCurrencyList(params: CurrencyListParams) {
  return request.get<unknown, CurrencyListResult>('/admin/getCurrencyList', { params });
}

export function addCurrency(payload: AddCurrencyPayload) {
  const form = new FormData();
  form.append('type', String(payload.type));
  form.append('code', payload.code);
  form.append('name', payload.name);
  return request.post<unknown, CurrencyItem>('/admin/addCurrency', form);
}

export function editCurrencyStatus(payload: { id: number; status: CurrencyStatus }) {
  const form = new FormData();
  form.append('id', String(payload.id));
  form.append('status', String(payload.status));
  return request.post<unknown, CurrencyItem>('/admin/editCurrencyStatus', form);
}
