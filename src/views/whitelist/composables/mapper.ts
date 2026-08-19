import type { WhitelistItem, WhitelistStatus } from '@/api/modules/whitelist';
import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export interface WhitelistRow {
  businessId: number;
  id: string;
  time: string;
  updatedAt: string;
  agent: string;
  agentCode: string;
  role: string;
  entityType: string;
  type: string;
  subject: string;
  country: string;
  fileCount: number;
  status: string;
  statusCode: WhitelistStatus;
  statusType: StatusBadgeType;
  statusEffect?: StatusBadgeEffect;
}

const STATUS_META: Record<WhitelistStatus, { type: StatusBadgeType; effect?: StatusBadgeEffect }> =
  {
    0: { type: 'warning', effect: 'pending' },
    1: { type: 'primary' },
    2: { type: 'success' },
    3: { type: 'danger' },
  };

export function toWhitelistRow(item: WhitelistItem): WhitelistRow {
  const meta = STATUS_META[item.status];
  return {
    businessId: item.id,
    id: item.whitelist_no,
    time: item.submitted_at || '—',
    updatedAt: item.updated_at || '—',
    agent: item.user.company_name,
    agentCode: item.user.agent_code,
    role: item.role_name,
    entityType: item.entity_type_name,
    type: `${item.role_name} · ${item.entity_type_name}`,
    subject: item.subject_name,
    country: item.country || '—',
    fileCount: item.file_count,
    status: item.status_name,
    statusCode: item.status,
    statusType: meta.type,
    statusEffect: meta.effect,
  };
}

export function getWhitelistStatusMeta(status: WhitelistStatus) {
  return STATUS_META[status];
}
