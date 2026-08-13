/**
 * whitelist mapper
 */
import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

import type { WhitelistListItem } from '@/api/modules/whitelist';

export interface StatusBadgeMeta {
  type: StatusBadgeType;
  effect?: StatusBadgeEffect;
}

const WHITELIST_STATUS_BADGE_MAP: Record<string, StatusBadgeMeta> = {
  pending: { type: 'warning', effect: 'pending' },
  approved: { type: 'success' },
  rejected: { type: 'danger' },
  revising: { type: 'primary' },
};

export function toWhitelistStatusBadge(status: string): StatusBadgeMeta {
  return WHITELIST_STATUS_BADGE_MAP[status] ?? { type: 'gray' };
}

export interface WhitelistListView extends WhitelistListItem {
  statusMeta: StatusBadgeMeta;
}

export function toWhitelistListView(row: WhitelistListItem): WhitelistListView {
  return { ...row, statusMeta: toWhitelistStatusBadge(row.status) };
}

export function toWhitelistListViewBatch(rows: WhitelistListItem[]): WhitelistListView[] {
  return rows.map(toWhitelistListView);
}
