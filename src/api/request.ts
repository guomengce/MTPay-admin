/**
 * 统一 axios 实例
 * - baseURL / timeout 从 appConfig 读取
 * - 请求拦截：注入 Bearer token
 * - 响应拦截：解包 { code, message, data } 约定，401 强制下线
 */
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { ElMessage } from 'element-plus';

import { appConfig } from '@/config';
import router from '@/router';
import { useAuthStore } from '@/stores/modules/auth';

import type { ApiResponse } from './types';

/** 约定的业务成功状态码（白名单） */
/** 创建 axios 实例 */
export const request = axios.create({
  baseURL: appConfig.apiBaseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

/** 仅凭证失效才清理登录态；兼容 HTTP 401 与后端业务失效状态。 */
const AUTH_EXPIRED_STATUSES = new Set([401, 50013, 50039]);
const PUBLIC_AUTH_PATHS = new Set(['/api/getPubKey', '/admin/verifyTwoFactorLogin', '/admin/adminLogin']);
let sessionExpiredHandled = false;

/* =============================================================================
 * 请求拦截：注入 token
 * ========================================================================== */
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    if (authStore.token && !isPublicAuthRequest(config.url)) {
      sessionExpiredHandled = false;
      config.headers.set('Authorization', `Bearer ${authStore.token}`);
    }
    // FormData 上传：移除默认 JSON 头，交由浏览器生成 multipart（含 boundary）。
    // 否则 axios 会把 FormData 序列化成 {"file":{"uid":...}} 发送。
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      config.headers.delete('Content-Type');
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/* =============================================================================
 * 响应拦截：解包业务信封；统一错误；401 跳登录
 * ========================================================================== */
request.interceptors.response.use(
  async (response: AxiosResponse<any>) => {
    const refreshedToken = response.headers.authorization;
    if (refreshedToken && !isPublicAuthRequest(response.config.url)) {
      useAuthStore().setToken(refreshedToken.replace(/^Bearer\s+/i, ''));
    }
    const body = response.data instanceof Blob && /json/i.test(response.data.type)
      ? JSON.parse(await response.data.text()) : response.data;

    // 约定返回 { code, message, data }：解包
    if (isApiEnvelope(body)) {
      const businessStatus = Number(body.status);
      if (businessStatus === 200) {
        return body.data;
      }
      if (
        AUTH_EXPIRED_STATUSES.has(businessStatus) &&
        !isPublicAuthRequest(response.config.url)
      ) {
        await handleSessionExpired();
        return Promise.reject(new ApiError(body.message, businessStatus, body.data));
      }
      ElMessage.error(body.message || '请求失败，请稍后重试');
      return Promise.reject(new ApiError(body.message, businessStatus, body.data));
    }

    // 兼容非信封格式：直接返回原始 body
    return body;
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.data instanceof Blob && /json/i.test(error.response.data.type)) {
      try { error.response.data = JSON.parse(await error.response.data.text()); } catch { /* Retain HTTP error. */ }
    }
    const status = error.response?.status;

    if (status && AUTH_EXPIRED_STATUSES.has(status) && !isPublicAuthRequest(error.config?.url)) {
      await handleSessionExpired();
      return Promise.reject(error);
    }

    const message =
      error.response?.data?.message ||
      (status ? `请求失败（${status}）` : '网络异常，请稍后重试');

    ElMessage.error(message);
    return Promise.reject(new ApiError(message, status ?? 0, error.response?.data));
  },
);

/* =============================================================================
 * 工具函数 / 类型守卫
 * ========================================================================== */
function isApiEnvelope(value: unknown): value is ApiResponse<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    'data' in value
  );
}

function isPublicAuthRequest(url?: string) {
  return Boolean(url && PUBLIC_AUTH_PATHS.has(url.split('?')[0]));
}

/**
 * 并发请求可能同时收到 401，只允许首次响应清登录态、提示并跳转。
 * Token 失效后不要再调用退出接口，否则会造成 401 循环。
 */
async function handleSessionExpired() {
  if (sessionExpiredHandled) return;
  sessionExpiredHandled = true;

  const authStore = useAuthStore();
  const currentRoute = router.currentRoute.value;
  const redirect = currentRoute.name === 'Login' ? undefined : currentRoute.fullPath;

  authStore.clearAuth();
  ElMessage.error('登錄狀態已失效，請重新登錄');
  await router
    .replace({ name: 'Login', query: redirect ? { redirect } : undefined })
    .catch(() => undefined);
}

export class ApiError<T = unknown> extends Error {
  public readonly code: number;
  public readonly data?: T;

  constructor(message: string, code: number, data?: T) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.data = data;
  }
}

export default request;
