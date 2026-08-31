import request from '../request';

export function disableAdminTwoFactor(id: number) {
  return request.post<unknown, []>('/admin/disableAdminTwoFactor', { id });
}
export function disableUserTwoFactor(id: number) {
  return request.post<unknown, []>('/admin/disableUserTwoFactor', { id });
}

// Contract: FRONTEND_AI_API_DOCUMENT(2).md, section 7.1.
export interface TwoFactorSetup { manual_key: string; expires_at: string; otpauth_uri: string }
export interface TwoFactorStatus { enabled: boolean; confirmed_at: string | null }

export async function getTwoFactorStatus(): Promise<boolean> {
  const data = await request.get<unknown, TwoFactorStatus>('/admin/getTwoFactorStatus');
  // Never interpret an unknown response as disabled.
  if (typeof data?.enabled !== 'boolean') throw new Error('Invalid 2FA status response');
  return data.enabled;
}

export async function startTwoFactorSetup(): Promise<TwoFactorSetup> {
  const data = await request.post<unknown, TwoFactorSetup>('/admin/startTwoFactorSetup');
  if (!data || typeof data.manual_key !== 'string' || !data.manual_key ||
      typeof data.otpauth_uri !== 'string' || !data.otpauth_uri.startsWith('otpauth://totp/')) {
    throw new Error('Invalid 2FA setup response');
  }
  return data;
}

export function confirmTwoFactorSetup(code: string) {
  return request.post<unknown, { enabled: true }>('/admin/confirmTwoFactorSetup', { code });
}

export function disableOwnTwoFactor(code: string) {
  return request.post<unknown, { enabled: false }>('/admin/disableOwnTwoFactor', { code });
}
