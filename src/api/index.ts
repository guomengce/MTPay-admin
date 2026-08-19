/**
 * API 统一出口
 * -----------------------------------------------------------------------------
 * 推荐：`import { request, fetchDepositList } from '@/api';`
 *  - request：axios 实例（封装 token / 拦截器 / 错误处理）
 *  - 各模块导出：fetch<...>
 */
export { default as request, ApiError } from './request';
export * from './types';

// 模块接口（命名空间收敛）
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
