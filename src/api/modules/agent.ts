import request from '../request';

/** 后端代理账户对象。金额、时间和状态名称均直接使用后端返回值。 */
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
}

/** Laravel 分页响应结构。列表数据读取 data，总数读取 total。 */
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

/** 后端邮件发送结果，用于展示发送状态、时间及失败原因。 */
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

/** 代理资产概览中的币种余额。金额字段保持后端返回的十进制字符串。 */
export interface AgentAssetBalance {
  currency: { id: number; code: string; name: string; decimal_places: number };
  available_balance: string;
  frozen_balance: string;
  total_balance: string;
}

/** 当前代理实际生效的兑换比例。 */
export interface AgentEffectiveRate {
  source_currency: { id: number; code: string; name: string };
  target_currency: { id: number; code: string; name: string };
  rate: string;
  rate_source: 'agent' | 'default';
  rate_source_name: string;
}

/** 资产概览最近交易统一列表项。查看详情必须使用 detail_type 和 detail_id。 */
export interface AgentRecentTransaction {
  transaction_key: string;
  business_type: 'deposit' | 'exchange' | 'withdrawal';
  business_name: string;
  id: number;
  business_id: number;
  order_no: string;
  user: Pick<AgentAccount, 'id' | 'agent_code' | 'company_name' | 'email'>;
  currency_code: string;
  network_code: string | null;
  amount: string;
  target_currency_code: string | null;
  target_amount: string | null;
  exchange_rate: string | null;
  fee_amount: string | null;
  total_amount: string | null;
  payer_name: string | null;
  payee_name: string | null;
  status: number;
  status_name: string;
  status_group: string;
  status_group_name: string;
  submitted_at: string;
  completed_at: string | null;
  finished_at: string | null;
  detail_type: 'deposit' | 'exchange' | 'withdrawal';
  detail_id: number;
}

export interface AgentAssetOverview {
  user: Pick<
    AgentAccount,
    'id' | 'agent_code' | 'company_name' | 'email' | 'status' | 'status_name'
  >;
  assets: AgentAssetBalance[];
  effective_exchange_rates: Partial<Record<'USDT' | 'USDC', AgentEffectiveRate>>;
  pending_counts: { deposit: number; exchange: number; withdrawal: number; total: number };
  capabilities: {
    deposit_channel_count: number;
    exchange_source_currencies: string[];
    exchange_target_currency: string;
    withdrawal_currency: string;
    withdrawal_fee_amount: string;
  };
  recent_orders: AgentRecentTransaction[];
  recent_fund_flows: unknown[];
}

/** UAT 会按代理实际配置省略部分概览区块，读取层需对这些字段做默认值归一化。 */
export type AgentAssetOverviewResponse = Pick<AgentAssetOverview, 'user'> &
  Partial<Omit<AgentAssetOverview, 'user'>>;

export interface AgentTransactionInfo {
  transaction: AgentRecentTransaction;
  detail: Record<string, unknown>;
}

/** 获取代理账户分页列表，可按编号/公司/邮箱/电话及状态筛选。 */
export function fetchAgentList(params: AgentListParams) {
  return request.get<unknown, AgentPageResult>('/admin/getUserList', { params });
}

/** 编辑代理前读取账户表单资料；该接口不再承担详情页展示。 */
export function fetchAgentInfoForEdit(id: number) {
  return request.get<unknown, AgentAccount>('/admin/getUserInfo', { params: { id } });
}

/** 获取单个代理的完整资产概览。GET /admin/getAgentAssetOverview?user_id=... */
export function fetchAgentAssetOverview(userId: number) {
  return request.get<unknown, AgentAssetOverviewResponse>('/admin/getAgentAssetOverview', {
    params: { user_id: userId },
  });
}

/** 获取最近交易的业务详情，参数严格取自列表返回的 detail_type/detail_id。 */
export function fetchAgentTransactionInfo(transaction: AgentRecentTransaction) {
  return request.get<unknown, AgentTransactionInfo>('/admin/getTransactionInfo', {
    params: { business_type: transaction.detail_type, business_id: transaction.detail_id },
  });
}

/** 新增代理。代理编号由后端生成，并由后端发送激活邀请邮件。 */
export function createAgent(payload: AgentFormPayload) {
  return request.post<unknown, AgentAccount & { invitation?: unknown }>('/admin/addUser', payload);
}

/** 修改代理公司名、邮箱和电话；邮箱变化时后端会使旧 Token 失效。 */
export function updateAgent(payload: AgentFormPayload & { id: number }) {
  return request.post<unknown, AgentAccount & { mail_notifications?: unknown[] }>(
    '/admin/editUser',
    payload,
  );
}

/** 修改代理状态。允许目标状态为正常(1)、暂停(2)或停用(3)。 */
export function updateAgentStatus(id: number, status: 1 | 2 | 3) {
  return request.post<unknown, AgentAccount>('/admin/editUserStatus', { id, status });
}

/** 重新发送代理激活邮件；仅状态为待激活(0)的代理允许调用。 */
export function resendAgentInvitation(id: number) {
  return request.post<unknown, MailResult>('/admin/resendUserInvitation', { id });
}

/** 发送代理密码重置邮件；仅状态为正常(1)或暂停(2)的代理允许调用。 */
export function sendAgentPasswordReset(id: number) {
  return request.post<unknown, MailResult>('/admin/resetUserPassword', { id });
}
