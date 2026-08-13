/**
 * fee 模块接口骨架
 * -----------------------------------------------------------------------------
 * 比例与费用：预设兑换比例、固定出金手续费、代理专属比例。
 */
import request from '../request';
import type { Id, PageResult } from '../types';

/** 默认兑换比例（USDT/USDC → USD） */
export interface DefaultRatePayload {
  usdtRate: string;
  usdcRate: string;
}

export function fetchDefaultRate() {
  return request.get<unknown, DefaultRatePayload>('/fee/rate/default');
}

export function fetchUpdateDefaultRate(payload: DefaultRatePayload) {
  return request.put<unknown, void>('/fee/rate/default', payload);
}

/** 固定出金手续费 */
export interface FixedWithdrawalFee {
  fee: string;
  currency: string;
}

export function fetchFixedWithdrawalFee() {
  return request.get<unknown, FixedWithdrawalFee>('/fee/withdrawal-fee');
}

export function fetchUpdateFixedWithdrawalFee(payload: FixedWithdrawalFee) {
  return request.put<unknown, void>('/fee/withdrawal-fee', payload);
}

/** 代理专属比例列表（与 views/fee/components/FeeAgent*.vue 对齐） */
export interface FeeAgentRow {
  agent: string;
  code: string;
  usdt: string;
  usdc: string;
  min: string;
  max: string;
}

export function fetchFeeAgentList() {
  return request.get<unknown, PageResult<FeeAgentRow>>('/fee/agent/list');
}

export interface UpdateFeeAgentPayload extends FeeAgentRow {}

export function fetchUpdateFeeAgent(payload: UpdateFeeAgentPayload) {
  return request.put<unknown, void>('/fee/agent/update', payload);
}
