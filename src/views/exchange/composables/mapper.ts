import type { ExchangeOrder } from '@/api/modules/exchange';
import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export interface ExchangeRow {
  businessId: number;
  id: string;
  time: string;
  agent: string;
  code: string;
  amount: string;
  asset: string;
  rate: string;
  rateSource: string;
  usd: string;
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

export function toExchangeRow(order: ExchangeOrder): ExchangeRow {
  return {
    businessId: order.id,
    id: order.order_no,
    time: order.submitted_at ?? '—',
    agent: order.user.company_name,
    code: order.user.agent_code,
    amount: order.source_amount,
    asset: order.source_currency.code,
    rate: order.exchange_rate,
    rateSource: order.rate_source_name,
    usd: `${order.target_amount} ${order.target_currency.code}`,
    status: order.status_name,
    statusCode: order.status,
    statusType: statusMeta[order.status].type,
    statusEffect: order.status === 0 ? statusMeta[0].effect : undefined,
  };
}
