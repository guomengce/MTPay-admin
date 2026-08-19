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

/* =============================================================================
 * 请求拦截：注入 token
 * ========================================================================== */
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    if (authStore.token) {
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
  (response: AxiosResponse<any>) => {
    const refreshedToken = response.headers.authorization;
    if (refreshedToken) {
      useAuthStore().setToken(refreshedToken.replace(/^Bearer\s+/i, ''));
    }
    const body = response.data;

    // 约定返回 { code, message, data }：解包
    if (isApiEnvelope(body)) {
      if (Number(body.status) === 200) {
        return body.data;
      }
      ElMessage.error(body.message || '请求失败，请稍后重试');
      return Promise.reject(new ApiError(body.message, Number(body.status), body.data));
    }

    // 兼容非信封格式：直接返回原始 body
    return body;
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const status = error.response?.status;

    if (status === 401) {
      const authStore = useAuthStore();
      authStore.clearAuth();
      await router.replace({ name: 'Login' });
      ElMessage.error('登录状态已失效，请重新登录');
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
