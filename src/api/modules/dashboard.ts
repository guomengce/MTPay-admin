/**
 * dashboard 模块接口骨架
 * -----------------------------------------------------------------------------
 * 营运总览面板所需的指标、图表、待办列表等接口。
 */
import request from '../request';

/** 顶部 4 个统计卡 */
export interface DashboardMetric {
  label: string;
  value: string | number;
  subtext?: string;
}

export function fetchDashboardMetrics() {
  return request.get<unknown, DashboardMetric[]>('/dashboard/metrics');
}

/** 待办列表 */
export interface DashboardTask {
  id: string;
  type: 'deposit' | 'exchange' | 'whitelist' | 'withdrawal';
  title: string;
  createdAt: string;
}

export function fetchDashboardTasks() {
  return request.get<unknown, DashboardTask[]>('/dashboard/tasks');
}

/** 资产流向图表数据 */
export interface DashboardFlowPoint {
  date: string;
  deposit: number;
  withdrawal: number;
  exchange: number;
}

export function fetchDashboardFlows(params: { range: '7d' | '30d' | '90d' }) {
  return request.get<unknown, DashboardFlowPoint[]>('/dashboard/flows', { params });
}

/** 比例设定快照 */
export interface DashboardRateSnapshot {
  usdt: string;
  usdc: string;
  fixedFee: string;
  updatedAt: string;
}

export function fetchDashboardRateSnapshot() {
  return request.get<unknown, DashboardRateSnapshot>('/dashboard/rate-snapshot');
}

/** 汇总 */
export interface DashboardOverview {
  metrics: DashboardMetric[];
  tasks: DashboardTask[];
  flows: DashboardFlowPoint[];
  rateSnapshot: DashboardRateSnapshot;
}

export function fetchDashboardOverview(params: { range?: '7d' | '30d' | '90d' }) {
  return request.get<unknown, DashboardOverview>('/dashboard/overview', { params });
}
