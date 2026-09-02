import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { AUTH_TOKEN_KEY, USER_INFO_KEY } from '@/constants';
import type { UserInfo } from '@/types/user';
import { storage } from '@/utils/storage';
import { clearListQueryState } from '@/composables/useListQueryState';
import { fetchCurrentAdminInfo } from '@/api/modules/auth';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(storage.get<string>(AUTH_TOKEN_KEY) || '');
  const userInfo = ref<UserInfo | null>(storage.get<UserInfo>(USER_INFO_KEY));
  const isLoggedIn = computed(() => Boolean(token.value));
  const permissionReady = ref(false);
  const menuPermissions = computed(() => new Set(userInfo.value?.menus || []));
  const actionPermissions = computed(() => new Set(userInfo.value?.actions || []));
  const cryptoEnabled = computed(() => userInfo.value?.cryptoEnabled !== false);

  function setToken(value: string) {
    token.value = value;
    storage.set(AUTH_TOKEN_KEY, value);
  }

  function login(payload: { token: string; userInfo: UserInfo }) {
    clearListQueryState();
    setToken(payload.token);
    userInfo.value = payload.userInfo;
    storage.set(USER_INFO_KEY, payload.userInfo);
    permissionReady.value = true;
  }

  function setUserInfo(value: UserInfo) {
    userInfo.value = value;
    storage.set(USER_INFO_KEY, value);
    permissionReady.value = true;
  }

  async function refreshCurrentAdmin() {
    const result = await fetchCurrentAdminInfo();
    setUserInfo({
      id: String(result.id),
      name: String(result.name || result.username || result.email || 'MTPay 管理員'),
      email: String(result.email || ''),
      status: result.status,
      twoFactorEnabled: Boolean(result.two_factor_enabled),
      cryptoEnabled: Boolean(result.crypto_enabled),
      role: result.role || null,
      menus: result.menus || [],
      actions: result.actions || [],
    });
    return userInfo.value;
  }

  const canAccessMenu = (code?: string) => !code || menuPermissions.value.has(code);
  const canOperate = (code: string) => actionPermissions.value.has(code);

  function clearAuth() {
    clearListQueryState();
    token.value = '';
    userInfo.value = null;
    permissionReady.value = false;
    storage.remove(AUTH_TOKEN_KEY);
    storage.remove(USER_INFO_KEY);
  }

  function logout() {
    clearAuth();
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
    setToken,
    clearAuth,
    setUserInfo,
    refreshCurrentAdmin,
    permissionReady,
    menuPermissions,
    actionPermissions,
    canAccessMenu,
    canOperate,
    cryptoEnabled,
  };
});
