import type { AdminLoginResult } from '@/api/modules/auth';
import { useAuthStore } from '@/stores/modules/auth';
import { clearLoginChallenge, validLoginResult } from './loginChallenge';
export function completeLogin(result: AdminLoginResult) {
  if (!validLoginResult(result)) throw new Error('Invalid login response');
    useAuthStore().login({
      token: result.token,
      userInfo: {
        id: String(result.id),
        name: String(result.name || result.username || result.email || 'MTPay 管理員'),
        email: String(result.email || ''),
        status: result.status,
        cryptoEnabled: Boolean(result.crypto_enabled),
        role: result.role || null,
        menus: result.menus || [],
        actions: result.actions || [],
      },
    });
  clearLoginChallenge();
}
