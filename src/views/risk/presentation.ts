import type { RiskCaseStatus, RiskLevel, RiskStatus } from '@/api/modules/withdrawalRisk';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export const caseStatusMap: Record<RiskCaseStatus, { label: string; type: StatusBadgeType }> = {
  0: { label: '待風控覆核', type: 'warning' },
  1: { label: '待代理補件', type: 'primary' },
  2: { label: '已放行', type: 'success' },
  3: { label: '已拒絕', type: 'danger' },
};
export const riskLevelMap: Record<RiskLevel, { label: string; type: StatusBadgeType }> = {
  0: { label: '不適用', type: 'gray' },
  1: { label: '低風險', type: 'success' },
  2: { label: '中風險', type: 'warning' },
  3: { label: '高風險', type: 'danger' },
};
export const riskStatusMap: Record<RiskStatus, string> = {
  0: '未評估',
  1: '系統通過',
  2: '加強核查',
  3: '待風控覆核',
  4: '待補件',
  5: '已放行',
  6: '已拒絕',
};
export function getCaseStatus(value: RiskCaseStatus) {
  return caseStatusMap[value] ?? { label: '未知狀態', type: 'gray' as const };
}
export function getRiskLevel(value: RiskLevel) {
  return riskLevelMap[value] ?? { label: '未知風險', type: 'gray' as const };
}
export function getRiskStatus(value: RiskStatus) {
  return riskStatusMap[value] ?? '未知狀態';
}
