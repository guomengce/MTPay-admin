/** 管理端出金展示映射：只格式化接口字段，不制造业务数据。 */
import type { WithdrawalOrder, WithdrawalStatus } from '@/api/modules/withdrawal';
import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export interface WithdrawalStatusMeta {
  type: StatusBadgeType;
  effect?: StatusBadgeEffect;
}

const STATUS_META: Record<WithdrawalStatus, WithdrawalStatusMeta> = {
  0: { type: 'warning', effect: 'pending' },
  1: { type: 'warning' },
  2: { type: 'primary', effect: 'pending' },
  3: { type: 'success' },
  4: { type: 'danger' },
  5: { type: 'gray' },
};

export function getWithdrawalStatusMeta(status: WithdrawalStatus): WithdrawalStatusMeta {
  return STATUS_META[status] ?? { type: 'gray' };
}

export interface WithdrawalRow {
  businessId: number;
  id: string;
  time: string;
  updatedAt: string;
  agent: string;
  agentCode: string;
  agentEmail: string;
  payer: string;
  payerNo: string;
  payerType: string;
  payee: string;
  payeeNo: string;
  payeeType: string;
  amount: string;
  feeAmount: string;
  totalAmount: string;
  currency: string;
  applicationFileCount: number;
  paymentFileCount: number;
  status: string;
  statusCode: WithdrawalStatus;
  statusType: StatusBadgeType;
  statusEffect?: StatusBadgeEffect;
}

function entityTypeName(value: 1 | 2) {
  return value === 1 ? '公司' : '个人';
}

export function toWithdrawalRow(order: WithdrawalOrder): WithdrawalRow {
  const statusMeta = getWithdrawalStatusMeta(order.status);
  return {
    businessId: order.id,
    id: order.order_no,
    time: order.submitted_at || '—',
    updatedAt: order.updated_at || '—',
    agent: order.user.company_name,
    agentCode: order.user.agent_code,
    agentEmail: order.user.email,
    payer: order.payer.name,
    payerNo: order.payer.whitelist_no,
    payerType: entityTypeName(order.payer.entity_type),
    payee: order.payee.name,
    payeeNo: order.payee.whitelist_no,
    payeeType: entityTypeName(order.payee.entity_type),
    amount: order.amount,
    feeAmount: order.fee_amount,
    totalAmount: order.total_amount,
    currency: order.currency.code,
    applicationFileCount: order.application_file_count,
    paymentFileCount: order.payment_file_count,
    status: order.status_name,
    statusCode: order.status,
    statusType: statusMeta.type,
    statusEffect: statusMeta.effect,
  };
}
