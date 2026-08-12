import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export interface FlowTimelineItem {
  key: string;
  title: string;
  time?: string;
  description?: string;
  state: 'done' | 'active' | 'pending';
}

export interface FlowDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  statusType: StatusBadgeType;
  statusEffect?: StatusBadgeEffect;
  flowType: string;
  agent: string;
  direction: string;
  payAmount: string;
  payAsset: string;
  rate: string;
  receiveAmount: string;
  receiveAsset: string;
  submittedAt: string;
  fundChangeLabel: string;
  fundChangeAmount: string;
  timeline: FlowTimelineItem[];
}
