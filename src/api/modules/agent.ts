import request from '../request';

/** 後端代理賬户對象。金額、時間和狀態名稱均直接使用後端返回值。 */
export interface AgentAccount {
  id: number;
  agent_code: string;
  company_name: string;
  email: string;
  phone: string;
  status: 0 | 1 | 2 | 3;
  status_name: string;
  activated_at: string | null;
  last_login_at: string | null;
  locked_until: string | null;
  created_at: string;
  crypto_enabled: boolean;
  two_factor_enabled?: boolean;
  safeheron_account_key?: string | null;
}

/** Laravel 分頁響應結構。列表數據讀取 data，總數讀取 total。 */
export interface AgentPageResult {
  current_page: number;
  data: AgentAccount[];
  per_page: number;
  total: number;
  last_page: number;
}

export interface AgentListParams {
  keyword?: string;
  status?: number;
  page: number;
  limit: number;
}

export interface AgentFormPayload {
  company_name: string;
  email: string;
  phone: string;
}

/** 後端郵件發送結果，用於展示發送狀態、時間及失敗原因。 */
export interface MailResult {
  id: number;
  mail_type: 'invitation' | 'password_reset' | 'email_changed';
  to_email: string;
  attempt_no: number;
  status: 0 | 1 | 2;
  status_name: string;
  failure_reason: string | null;
  sent_at: string | null;
  created_at: string;
}

/** 代理資產概覽中的幣種餘額。金額字段保持後端返回的十進制字符串。 */
export interface AgentAssetBalance {
  currency: { id: number; code: string; name: string; decimal_places: number };
  available_balance: string;
  frozen_balance: string;
  total_balance: string;
}

/** 代理數字貨幣收款地址。字段與資產概覽接口新增返回保持一致。 */
export interface AgentCryptoReceivingAddress {
  wallet_address_id: number;
  coin_key: string;
  currency: { id: number; code: string; name: string };
  network: { id: number; code: string; name: string };
  address: string;
  status: number;
  status_name: string;
}

/** 當前代理實際生效的兑換比例。 */
export interface AgentEffectiveRate {
  source_currency: { id: number; code: string; name: string };
  target_currency: { id: number; code: string; name: string };
  rate: string;
  rate_source: 'agent' | 'default';
  rate_source_name: string;
}

/** 資產概覽最近交易統一列表項。查看詳情必須使用 detail_type 和 detail_id。 */
/** 代理詳情近期交易直接複用統一交易記錄的數據結構。 */
export type AgentRecentTransaction = import('./transaction').TransactionItem;

export interface AgentAssetOverview {
  user: Pick<
    AgentAccount,
    'id' | 'agent_code' | 'company_name' | 'email' | 'status' | 'status_name' | 'safeheron_account_key'
  >;
  assets: AgentAssetBalance[];
  wallet_addresses: AgentCryptoReceivingAddress[];
  effective_exchange_rates: Partial<Record<'USDT' | 'USDC', AgentEffectiveRate>>;
  pending_counts: { deposit: number; exchange: number; withdrawal: number; total: number };
}

/** UAT 會按代理實際配置省略部分概覽區塊，讀取層需對這些字段做默認值歸一化。 */
export type AgentAssetOverviewResponse = Pick<AgentAssetOverview, 'user'> &
  Partial<Omit<AgentAssetOverview, 'user'>>;

export interface AdjustAgentBalancePayload {
  user_id: number;
  currency_code: 'USDT' | 'USDC' | 'USD' | string;
  direction: 'increase' | 'decrease';
  amount: string;
  reason?: string;
}

/** 獲取代理賬户分頁列表，可按編號/公司/郵箱/電話及狀態篩選。 */
export function fetchAgentList(params: AgentListParams) {
  return request.get<unknown, AgentPageResult>('/admin/getUserList', { params });
}

/** 編輯代理前讀取賬户表單資料；該接口不再承擔詳情頁展示。 */
export function fetchAgentInfoForEdit(id: number) {
  return request.get<unknown, AgentAccount>('/admin/getUserInfo', { params: { id } });
}

/** 獲取單個代理的完整資產概覽。GET /admin/getAgentAssetOverview?user_id=... */
export function fetchAgentAssetOverview(userId: number) {
  return request.get<unknown, AgentAssetOverviewResponse>('/admin/getAgentAssetOverview', {
    params: { user_id: userId },
  });
}

/** 管理員人工增加或減少代理幣種資產。POST /admin/adjustAgentBalance */
export function adjustAgentBalance(payload: AdjustAgentBalancePayload) {
  const form = new FormData();
  form.append('user_id', String(payload.user_id));
  form.append('currency_code', payload.currency_code);
  form.append('direction', payload.direction);
  form.append('amount', payload.amount);
  if (payload.reason) form.append('reason', payload.reason);
  return request.post('/admin/adjustAgentBalance', form);
}

/** 新增代理。代理編號由後端生成，並由後端發送激活邀請郵件。 */
export function createAgent(payload: AgentFormPayload) {
  return request.post<unknown, AgentAccount & { invitation?: unknown }>('/admin/addUser', payload);
}

/** 修改代理公司名、郵箱和電話；郵箱變化時後端會使舊 Token 失效。 */
export function updateAgent(payload: AgentFormPayload & { id: number }) {
  return request.post<unknown, AgentAccount & { mail_notifications?: unknown[] }>(
    '/admin/editUser',
    payload,
  );
}

/** 修改代理狀態。允許目標狀態為正常(1)、暫停(2)或停用(3)。 */
export function updateAgentStatus(id: number, status: 1 | 2) {
  return request.post<unknown, AgentAccount>('/admin/editUserStatus', { id, status });
}

export function updateAgentCryptoStatus(id: number, crypto_enabled: 0 | 1) {
  return request.post('/admin/editUserCryptoStatus', { id, crypto_enabled });
}

/** 重新發送代理激活郵件；僅狀態為待激活(0)的代理允許調用。 */
export function resendAgentInvitation(id: number) {
  return request.post<unknown, MailResult>('/admin/resendUserInvitation', { id });
}

/** 發送代理密碼重置郵件；僅狀態為正常(1)或暫停(2)的代理允許調用。 */
export function sendAgentPasswordReset(id: number) {
  return request.post<unknown, MailResult>('/admin/resetUserPassword', { id });
}
