import type { DepositOrder } from '@/api/modules/deposit';
import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export interface DepositRow {
  businessId: number;
  id: string;
  time: string;
  agent: string;
  agentCode: string;
  asset: string;
  network: string;
  hash: string;
  amount: string;
  status: string;
  statusCode: 0 | 1 | 2;
  statusType: StatusBadgeType;
  statusEffect?: StatusBadgeEffect;
}

const statusMeta = {
  0: { type: 'warning' as const, effect: 'pending' as const },
  1: { type: 'success' as const },
  2: { type: 'danger' as const },
};

export function toDepositRow(order: DepositOrder): DepositRow {
  return {
    businessId: order.id,
    id: order.order_no,
    time: order.submitted_at ?? '—',
    agent: order.user.company_name,
    agentCode: order.user.agent_code,
    asset: order.currency.code,
    network: order.network.code,
    hash: order.txid,
    amount: order.amount,
    status: order.status_name,
    statusCode: order.status,
    statusType: statusMeta[order.status].type,
    statusEffect: order.status === 0 ? statusMeta[0].effect : undefined,
  };
}
