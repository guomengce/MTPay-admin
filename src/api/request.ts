/**
 * 統一 axios 實例
 * - baseURL / timeout 從 appConfig 讀取
 * - 請求攔截：注入 Bearer token
 * - 響應攔截：解包 { code, message, data } 約定，401 強制下線
 */
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

import { appConfig } from '@/config';
import router from '@/router';
import { useAuthStore } from '@/stores/modules/auth';

import type { ApiResponse } from './types';

declare module 'axios' {
  export interface AxiosRequestConfig {
    silent?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    /** 跳過全局錯誤提示，由文件操作等業務層顯示明確錯誤。 */
    silent?: boolean;
  }
}

/** 約定的業務成功狀態碼（白名單） */
/** 創建 axios 實例 */
export const request = axios.create({
  baseURL: appConfig.apiBaseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

/** 僅憑證失效才清理登錄態；兼容 HTTP 401 與後端業務失效狀態。 */
const AUTH_EXPIRED_STATUSES = new Set([401, 50013, 50039]);
const PUBLIC_AUTH_PATHS = new Set(['/api/getPubKey', '/admin/verifyTwoFactorLogin', '/admin/adminLogin']);
let sessionExpiredHandled = false;
let permissionDeniedPromise: Promise<void> | null = null;

/* =============================================================================
 * 請求攔截：注入 token
 * ========================================================================== */
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    if (authStore.token && !isPublicAuthRequest(config.url)) {
      sessionExpiredHandled = false;
      config.headers.set('Authorization', `Bearer ${authStore.token}`);
    }
    // FormData 上傳：移除默認 JSON 頭，交由瀏覽器生成 multipart（含 boundary）。
    // 否則 axios 會把 FormData 序列化成 {"file":{"uid":...}} 發送。
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      config.headers.delete('Content-Type');
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/* =============================================================================
 * 響應攔截：解包業務信封；統一錯誤；401 跳登錄
 * ========================================================================== */
request.interceptors.response.use(
  async (response: AxiosResponse<any>) => {
    const refreshedToken = response.headers.authorization;
    if (refreshedToken && !isPublicAuthRequest(response.config.url)) {
      useAuthStore().setToken(refreshedToken.replace(/^Bearer\s+/i, ''));
    }
    const body = response.data instanceof Blob && /json/i.test(response.data.type)
      ? JSON.parse(await response.data.text()) : response.data;

    // 約定返回 { code, message, data }：解包
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
      if (businessStatus === 50012 && response.config.url !== '/admin/getCurrentAdminInfo') {
        await handlePermissionChanged();
        return Promise.reject(new ApiError(body.message, businessStatus, body.data));
      }
      if (!response.config.silent) ElMessage.error(body.message || '請求失敗，請稍後重試');
      return Promise.reject(new ApiError(body.message, businessStatus, body.data));
    }

    // 兼容非信封格式：直接返回原始 body
    return body;
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    logRequestError(error);
    if (error.response?.data instanceof Blob && /json/i.test(error.response.data.type)) {
      try { error.response.data = JSON.parse(await error.response.data.text()); } catch { /* Retain HTTP error. */ }
    }
    const status = error.response?.status;
    const businessStatus = Number(error.response?.data?.status);

    if (businessStatus === 50012 && error.config?.url !== '/admin/getCurrentAdminInfo' && !isPublicAuthRequest(error.config?.url)) {
      await handlePermissionChanged();
      return Promise.reject(new ApiError(error.response?.data?.message || '權限不足', businessStatus, error.response?.data));
    }

    if (status && AUTH_EXPIRED_STATUSES.has(status) && !isPublicAuthRequest(error.config?.url)) {
      await handleSessionExpired();
      return Promise.reject(error);
    }

    const message =
      error.response?.data?.message ||
      (status ? `請求失敗（${status}）` : '網絡異常，請稍後重試');

    if (!error.config?.silent) ElMessage.error(message);
    return Promise.reject(new ApiError(message, status ?? 0, error.response?.data));
  },
);

/** 保留接口原始错误，便于区分前端超时、HTTP 错误和传输中断。 */
function logRequestError(error: AxiosError<ApiResponse<unknown>>) {
  console.error('[API request failed]', {
    method: error.config?.method?.toUpperCase(),
    url: error.config?.url,
    timeout: error.config?.timeout,
    code: error.code,
    httpStatus: error.response?.status,
    message: error.message,
    response: error.response?.data,
  }, error);
}

/* =============================================================================
 * 工具函數 / 類型守衞
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
 * 併發請求可能同時收到 401，只允許首次響應清登錄態、提示並跳轉。
 * Token 失效後不要再調用退出接口，否則會造成 401 循環。
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

async function handlePermissionChanged() {
  if (!permissionDeniedPromise) {
    permissionDeniedPromise = (async () => {
      try {
        await ElMessageBox.alert('權限不足', '警告', {
          type: 'warning',
          confirmButtonText: '確認',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showClose: false,
        });
      } finally {
        window.location.reload();
      }
    })().finally(() => { permissionDeniedPromise = null; });
  }
  await permissionDeniedPromise;
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
