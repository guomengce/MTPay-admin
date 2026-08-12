import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export interface ExchangeTimelineItem {
  key: string;
  title: string;
  time?: string;
  description?: string;
  state: 'done' | 'active' | 'pending';
}

export interface ExchangeDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  statusType: StatusBadgeType;
  statusEffect?: StatusBadgeEffect;
  agent: string;
  agentCode: string;
  payAmount: string;
  payAsset: string;
  direction: string;
  rate: string;
  receiveAmount: string;
  receiveAsset: string;
  submittedAt: string;
  remark: string;
  timeline: ExchangeTimelineItem[];
}
