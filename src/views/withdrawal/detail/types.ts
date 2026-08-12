import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export interface WithdrawalFileItem {
  key: string;
  label: string;
  name: string;
  status: string;
}

export interface WithdrawalTimelineItem {
  key: string;
  title: string;
  time?: string;
  description?: string;
  state: 'done' | 'active' | 'pending';
}

export interface WithdrawalDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  statusType: StatusBadgeType;
  statusEffect?: StatusBadgeEffect;
  agent: string;
  agentCode: string;
  relation: string;
  payer: string;
  payee: string;
  receiveAmount: string;
  fixedFee: string;
  totalDebit: string;
  currency: string;
  reference: string;
  documentRequirement: string;
  submittedAt: string;
  files: WithdrawalFileItem[];
  timeline: WithdrawalTimelineItem[];
}
