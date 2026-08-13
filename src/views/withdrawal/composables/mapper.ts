/**
 * withdrawal mapper
 */
import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

import type { WithdrawalListItem } from '@/api/modules/withdrawal';

export interface StatusBadgeMeta {
  type: StatusBadgeType;
  effect?: StatusBadgeEffect;
}

const WITHDRAWAL_STATUS_BADGE_MAP: Record<string, StatusBadgeMeta> = {
  pending: { type: 'warning', effect: 'pending' },
  processing: { type: 'primary' },
  completed: { type: 'success' },
  returned: { type: 'danger' },
  failed: { type: 'danger' },
};

export function toWithdrawalStatusBadge(status: string): StatusBadgeMeta {
  return WITHDRAWAL_STATUS_BADGE_MAP[status] ?? { type: 'gray' };
}

export interface WithdrawalListView extends WithdrawalListItem {
  statusMeta: StatusBadgeMeta;
}

export function toWithdrawalListView(row: WithdrawalListItem): WithdrawalListView {
  return { ...row, statusMeta: toWithdrawalStatusBadge(row.status) };
}

export function toWithdrawalListViewBatch(rows: WithdrawalListItem[]): WithdrawalListView[] {
  return rows.map(toWithdrawalListView);
}
