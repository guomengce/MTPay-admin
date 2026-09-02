import request from '../request';

export interface PermissionCatalogItem {
  code: string;
  name: string;
  type: 'general' | 'fiat' | 'mixed' | 'crypto';
  actions: Array<{ code: string; name: string }>;
}
export interface RoleItem { id: number; name: string; description?: string; admin_count: number; created_at: string }
export interface RoleInfo extends RoleItem { menus: string[]; actions: string[] }
export interface RolePayload { name: string; description?: string; menus: string[]; actions: string[] }
export interface RolePage { current_page: number; data: RoleItem[]; per_page: number; total: number; last_page: number }

export const fetchPermissionCatalog = () => request.get<unknown, PermissionCatalogItem[]>('/admin/getPermissionCatalog');
export const fetchRoleList = (params: { keyword?: string; page?: number; limit?: number }) => request.get<unknown, RolePage>('/admin/getRoleList', { params });
export const fetchRoleInfo = (id: number) => request.get<unknown, RoleInfo>('/admin/getRoleInfo', { params: { id } });
export const createRole = (payload: RolePayload) => request.post('/admin/addRole', payload);
export const updateRole = (payload: RolePayload & { id: number }) => request.post('/admin/editRole', payload);
export const deleteRole = (id: number) => request.post('/admin/deleteRole', { id });
