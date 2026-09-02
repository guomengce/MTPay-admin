import type { LoginChallenge } from '@/utils/loginChallenge';
import request from '../request';
import { createLoginEnvelope } from '@/utils/loginCrypto';

export interface AdminLoginResult {
  id: number;
  username?: string;
  name?: string;
  email?: string;
  status?: number;
  token: string;
  crypto_enabled: boolean;
  role: { id: number; name: string } | null;
  menus: string[];
  actions: string[];
  [key: string]: unknown;
}

export interface CurrentAdminInfo {
  id: number;
  username?: string;
  name?: string;
  email?: string;
  status?: number;
  crypto_enabled: boolean;
  role: { id: number; name: string } | null;
  menus: string[];
  actions: string[];
  two_factor_enabled?: boolean;
}

export function fetchCurrentAdminInfo() {
  return request.get<unknown, CurrentAdminInfo>('/admin/getCurrentAdminInfo');
}

async function fetchPublicKey(): Promise<string> {
  const result = await request.get<unknown, { public: string }>('/api/getPubKey');
  return result.public;
}

export async function fetchLogin(credentials: { email: string; password: string }) {
  const publicKey = await fetchPublicKey();
  const envelope = createLoginEnvelope(publicKey, credentials);
  return request.post<unknown, AdminLoginResult | LoginChallenge>('/admin/adminLogin', envelope);
}

export function fetchLogout() {
  return request.post<unknown, void>('/admin/adminLogout');
}

/** Public second login step; only this success grants a session after a challenge. */
export function verifyTwoFactorLogin(payload: { login_challenge: string; code: string }) {
  return request.post<unknown, AdminLoginResult>('/admin/verifyTwoFactorLogin', payload);
}
