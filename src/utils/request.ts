import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';

import { appConfig } from '@/config';
import router from '@/router';
import { useAuthStore } from '@/stores/modules/auth';

const request = axios.create({
  baseURL: appConfig.apiBaseURL,
  timeout: 15000,
  headers: {
    'Accept-Language': 'zh-TW',
  },
});

request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore();

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config;
});

request.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;

    if (status === 401) {
      const authStore = useAuthStore();
      authStore.clearAuth();
      await router.replace({ name: 'Login' });
      ElMessage.error('登錄狀態已失效，請重新登錄');
      return Promise.reject(error);
    }

    ElMessage.error(error.response?.data?.message || '請求失敗，請稍後重試');
    return Promise.reject(error);
  },
);

export default request;
