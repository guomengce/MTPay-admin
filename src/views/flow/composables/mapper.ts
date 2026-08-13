/**
 * flow mapper
 */
import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

import type { FlowListItem } from '@/api/modules/flow';

export interface StatusBadgeMeta {
  type: StatusBadgeType;
  effect?: StatusBadgeEffect;
}

const FLOW_STATUS_BADGE_MAP: Record<string, StatusBadgeMeta> = {
  pending: { type: 'warning', effect: 'pending' },
  reviewing: { type: 'primary' },
  approved: { type: 'success' },
  rejected: { type: 'danger' },
  frozen: { type: 'mt' },
};

export function toFlowStatusBadge(status: string): StatusBadgeMeta {
  return FLOW_STATUS_BADGE_MAP[status] ?? { type: 'gray' };
}

export interface FlowListView extends FlowListItem {
  statusMeta: StatusBadgeMeta;
}

export function toFlowListView(row: FlowListItem): FlowListView {
  return { ...row, statusMeta: toFlowStatusBadge(row.status) };
}

export function toFlowListViewBatch(rows: FlowListItem[]): FlowListView[] {
  return rows.map(toFlowListView);
}
