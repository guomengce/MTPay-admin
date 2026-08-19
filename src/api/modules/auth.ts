import request from '../request';
import { createLoginEnvelope } from '@/utils/loginCrypto';

export interface AdminLoginResult {
  id: number;
  username?: string;
  name?: string;
  email?: string;
  status?: number;
  token: string;
  [key: string]: unknown;
}

async function fetchPublicKey(): Promise<string> {
  const result = await request.get<unknown, { public: string }>('/api/getPubKey');
  return result.public;
}

export async function fetchLogin(credentials: { email: string; password: string }) {
  const publicKey = await fetchPublicKey();
  const envelope = createLoginEnvelope(publicKey, credentials);
  return request.post<unknown, AdminLoginResult>('/admin/adminLogin', envelope);
}

export function fetchLogout() {
  return request.post<unknown, void>('/admin/adminLogout');
}
