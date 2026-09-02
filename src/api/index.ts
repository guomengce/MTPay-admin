/**
 * API 統一齣口
 * -----------------------------------------------------------------------------
 * 推薦：`import { request, fetchDepositList } from '@/api';`
 *  - request：axios 實例（封裝 token / 攔截器 / 錯誤處理）
 *  - 各模塊導出：fetch<...>
 */
export { default as request, ApiError } from './request';
export * from './types';

// 模塊接口（命名空間收斂）
export * as AuthApi from './modules/auth';
export * as DashboardApi from './modules/dashboard';
export * as AgentApi from './modules/agent';
export * as CurrencyApi from './modules/currency';
export * as DepositApi from './modules/deposit';
export * as ExchangeApi from './modules/exchange';
export * as WhitelistApi from './modules/whitelist';
export * as WithdrawalApi from './modules/withdrawal';
export * as TransactionApi from './modules/transaction';
export * as FeeApi from './modules/fee';
export * as LogApi from './modules/log';
export * as ReservationApi from './modules/reservation';
export * as AdminAccountApi from './modules/adminAccount';
