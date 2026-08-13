/**
 * exchange mapper
 */
import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

import type { ExchangeListItem } from '@/api/modules/exchange';

export interface StatusBadgeMeta {
  type: StatusBadgeType;
  effect?: StatusBadgeEffect;
}

const EXCHANGE_STATUS_BADGE_MAP: Record<string, StatusBadgeMeta> = {
  pending: { type: 'warning', effect: 'pending' },
  approved: { type: 'success' },
  rejected: { type: 'danger' },
  processing: { type: 'primary' },
  finished: { type: 'success' },
};

export function toExchangeStatusBadge(status: string): StatusBadgeMeta {
  return EXCHANGE_STATUS_BADGE_MAP[status] ?? { type: 'gray' };
}

export interface ExchangeListView extends ExchangeListItem {
  statusMeta: StatusBadgeMeta;
}

export function toExchangeListView(row: ExchangeListItem): ExchangeListView {
  return { ...row, statusMeta: toExchangeStatusBadge(row.status) };
}

export function toExchangeListViewBatch(rows: ExchangeListItem[]): ExchangeListView[] {
  return rows.map(toExchangeListView);
}
