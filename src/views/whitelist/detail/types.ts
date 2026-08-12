import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export interface WhitelistTimelineItem {
  key: string;
  title: string;
  time?: string;
  state: 'done' | 'active' | 'pending';
}

export interface WhitelistDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  statusType: StatusBadgeType;
  statusEffect?: StatusBadgeEffect;
  subjectName: string;
  role: string;
  subjectType: string;
  agent: string;
  country: string;
  city: string;
  address: string;
  bankName: string;
  iban: string;
  swift: string;
  intermediarySwift: string;
  purpose: string;
  remark: string;
  submittedAt: string;
  reviewRemark: string;
  timeline: WhitelistTimelineItem[];
}
