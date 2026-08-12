import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export interface DepositTimelineItem {
  key: string;
  title: string;
  time?: string;
  description?: string;
  state: 'done' | 'active' | 'pending';
}

export interface DepositDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  statusType: StatusBadgeType;
  statusEffect?: StatusBadgeEffect;
  amount: string;
  currency: string;
  asset: string;
  network: string;
  agent: string;
  agentCode: string;
  hash: string;
  address: string;
  submittedAt: string;
  remark: string;
  balanceChange: string;
  timeline: DepositTimelineItem[];
}
