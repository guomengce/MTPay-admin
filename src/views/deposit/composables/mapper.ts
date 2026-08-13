/**
 * deposit mapper
 * 后端 DTO → 页面视图模型；状态映射集中维护。
 */
import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

import type { DepositListItem } from '@/api/modules/deposit';

/* -----------------------------------------------------------------------------
 * 状态 → badge
 * -------------------------------------------------------------------------- */
export interface StatusBadgeMeta {
  type: StatusBadgeType;
  effect?: StatusBadgeEffect;
}

const DEPOSIT_STATUS_BADGE_MAP: Record<string, StatusBadgeMeta> = {
  pending: { type: 'warning', effect: 'pending' },
  approved: { type: 'success' },
  rejected: { type: 'danger' },
  processing: { type: 'primary' },
  finished: { type: 'success' },
};

export function toDepositStatusBadge(status: string): StatusBadgeMeta {
  return DEPOSIT_STATUS_BADGE_MAP[status] ?? { type: 'gray' };
}

/* -----------------------------------------------------------------------------
 * 列表行 → 视图模型
 * -------------------------------------------------------------------------- */
export interface DepositListView extends DepositListItem {
  statusMeta: StatusBadgeMeta;
}

export function toDepositListView(row: DepositListItem): DepositListView {
  return {
    ...row,
    statusMeta: toDepositStatusBadge(row.status),
  };
}

export function toDepositListViewBatch(rows: DepositListItem[]): DepositListView[] {
  return rows.map(toDepositListView);
}
