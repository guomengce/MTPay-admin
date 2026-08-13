/**
 * auth 模块接口骨架
 * -----------------------------------------------------------------------------
 * 包含登录 / 登出 / 当前用户信息 / token 刷新等基础接口。
 * 路径为占位 —— 正式接入时按后端约定覆盖。
 */
import request from '../request';
import type { Id, PageParams, PageResult } from '../types';

/** 已登录管理员信息 */
export interface AdminProfile {
  id: Id;
  name: string;
  role: 'admin' | 'operator' | string;
  avatar?: string;
  email?: string;
}

/** 登录表单 */
export interface LoginPayload {
  email: string;
  password: string;
}

/** 登录响应 */
export interface LoginResult {
  token: string;
  userInfo: AdminProfile;
}

/** 登录 */
export function fetchLogin(payload: LoginPayload) {
  return request.post<unknown, LoginResult>('/auth/login', payload);
}

/** 登出 */
export function fetchLogout() {
  return request.post<unknown, void>('/auth/logout');
}

/** 当前管理员信息 */
export function fetchAdminProfile() {
  return request.get<unknown, AdminProfile>('/auth/profile');
}

/** 刷新 token */
export function fetchRefreshToken() {
  return request.post<unknown, { token: string }>('/auth/refresh');
}

/** 修改密码 */
export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export function fetchChangePassword(payload: ChangePasswordPayload) {
  return request.post<unknown, void>('/auth/change-password', payload);
}

/** 操作日志列表占位（登录相关辅助接口） */
export function fetchLoginHistory(params: PageParams) {
  return request.get<unknown, PageResult<AdminProfile>>('/auth/login-history', { params });
}
