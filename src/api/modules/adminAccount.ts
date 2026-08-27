import request from '../request';

export interface AdminAccount {
  id: number;
  name: string;
  email: string;
  status: 0 | 1;
}

export interface AdminAccountPageResult {
  current_page: number;
  data: AdminAccount[];
  per_page: number;
  total: number;
  last_page: number;
}

export interface AdminAccountPayload {
  name: string;
  email: string;
  password?: string;
}

export function fetchAdminAccountList(params: { keyword?: string; status?: 0 | 1; page: number; limit: number }) {
  return request.get<unknown, AdminAccountPageResult>('/admin/getAdminList', { params });
}

export function fetchAdminAccountInfo(id: number) {
  return request.get<unknown, Pick<AdminAccount, 'id' | 'name' | 'email'>>('/admin/getAdminInfo', { params: { id } });
}

export function createAdminAccount(payload: AdminAccountPayload & { password: string }) {
  return request.post('/admin/addAdmin', payload);
}

export function updateAdminAccount(payload: AdminAccountPayload & { id: number }) {
  return request.post('/admin/editAdmin', payload);
}

export function updateAdminAccountStatus(id: number, status: 0 | 1) {
  return request.post('/admin/editAdminStatus', { id, status });
}

export function deleteAdminAccount(id: number) {
  return request.post('/admin/delAdmin', { id });
}
