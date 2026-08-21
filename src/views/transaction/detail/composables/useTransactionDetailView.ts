/**
 * 统一交易详情展示模型
 * -----------------------------------------------------------------------------
 * - 纯函数 / computed 集合，不发起任何网络请求；
 * - 将接口数据转换成页面需要的结构化展示模型；
 * - 过滤空值字段，避免在模板里出现 "—" 风暴；
 * - 构造审核字段、金额关系、付款关系、时间线、附件分组。
 */
import { computed, type Ref } from 'vue';
import { formatExchangeRate, formatFixedFee } from '@/utils/decimal';

import type { DepositOrderDetail } from '@/api/modules/deposit';
import type { ExchangeOrderDetail } from '@/api/modules/exchange';
import type {
  TransactionDetail,
  TransactionItem,
  TransactionWithdrawalDetail,
} from '@/api/modules/transaction';
import type { WithdrawalFile } from '@/api/modules/withdrawal';
import type { AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export interface DetailField {
  key: string;
  label: string;
  value: string;
  wide?: boolean;
  mono?: boolean;
  accent?: boolean;
}

export interface FileGroup {
  key: string;
  title: string;
  actor: string;
  time: string;
  message: string;
  files: WithdrawalFile[];
}

export interface PartySummary {
  role: 'payer' | 'payee';
  roleLabel: string;
  name: string;
  whitelistNo: string;
  entityTypeLabel: string;
  identityLabel: string;
}

const WITHDRAWAL_STATUS_TYPE: Record<number, StatusBadgeType> = {
  0: 'warning',
  1: 'warning',
  2: 'primary',
  3: 'success',
  4: 'danger',
  5: 'gray',
};
const WITHDRAWAL_STATUS_EFFECT: Record<number, 'pending' | undefined> = {
  0: 'pending',
  1: 'pending',
};

function present(value: unknown): string {
  if (value === null || value === undefined || value === '') return '';
  return String(value);
}

function buildField(
  key: string,
  label: string,
  value: unknown,
  options: Pick<DetailField, 'wide' | 'mono' | 'accent'> = {},
): DetailField | null {
  const text = present(value);
  if (!text) return null;
  return { key, label, value: text, ...options };
}

/** 根据业务类型生成统一的 StatusBadge type。 */
export function resolveStatusType(item: TransactionItem): StatusBadgeType {
  const group = item.status_group;
  if (group === 'completed') return 'success';
  if (group === 'rejected') return 'danger';
  if (group === 'failed') return 'gray';
  if (group === 'processing') return 'primary';
  return 'warning';
}

export function resolveStatusEffect(item: TransactionItem): 'pending' | undefined {
  return item.status_group === 'pending' || item.status_group === 'needs_supplement'
    ? 'pending'
    : undefined;
}

export function resolveWithdrawalStatusType(status: number): StatusBadgeType {
  return WITHDRAWAL_STATUS_TYPE[status] ?? 'gray';
}

export function resolveWithdrawalStatusEffect(
  status: number,
): 'pending' | undefined {
  return WITHDRAWAL_STATUS_EFFECT[status];
}

function isDepositDetail(detail: TransactionDetail): detail is DepositOrderDetail {
  return 'txid' in detail && 'receiving_address_snapshot' in detail;
}

function isExchangeDetail(detail: TransactionDetail): detail is ExchangeOrderDetail {
  return 'source_currency' in detail && 'target_currency' in detail;
}

function isWithdrawalDetail(
  detail: TransactionDetail,
): detail is TransactionWithdrawalDetail {
  return 'payer' in detail && 'payee' in detail && 'fee_amount' in detail;
}

function buildTimelineFromRows(
  rows: Array<{ event?: string; name?: string; time?: string | null }>,
): AdminTimelineItem[] {
  const items = rows.map((row, index) => ({
    key: `${row.event ?? 'event'}-${index}`,
    title: row.name || row.event || '处理事件',
    time: row.time || undefined,
    state: row.time ? ('done' as const) : ('pending' as const),
  }));
  if (!items.length) return items;
  const activeIndex = rows.findIndex((row) => !row.time);
  if (activeIndex < 0) return items;
  return items.map((item, index) => {
    if (item.state === 'done') return item;
    if (index === activeIndex) return { ...item, state: 'active' as const };
    return item;
  });
}

function buildTimelineFromRecords(
  records: TransactionWithdrawalDetail['records'],
): AdminTimelineItem[] {
  return records.map((record, index) => {
    const id = record.id ?? index;
    return {
      key: String(id),
      title: record.action_name || record.name || record.event || '订单处理',
      time: record.created_at || record.time || undefined,
      description: [record.actor_name || record.actor_type_name, record.message]
        .filter(Boolean)
        .join(' · '),
      state: 'done' as const,
    };
  });
}

function buildFileRounds(
  records: TransactionWithdrawalDetail['records'],
): FileGroup[] {
  return records
    .filter((record) => Array.isArray(record.files) && record.files.length > 0)
    .map((record, index) => {
      const id = record.id ?? index;
      return {
        key: String(id),
        title: record.action_name || record.name || record.event || '订单处理',
        actor: record.actor_name || record.actor_type_name || '—',
        time: record.created_at || record.time || '—',
        message: record.message || '',
        files: record.files ?? [],
      };
    });
}

function entityTypeLabel(type: 1 | 2 | undefined): string {
  if (type === 1) return '公司';
  if (type === 2) return '个人';
  return '—';
}

function buildParty(
  detail: TransactionWithdrawalDetail | null,
  role: 'payer' | 'payee',
): PartySummary | null {
  if (!detail) return null;
  const party = role === 'payer' ? detail.payer : detail.payee;
  if (!party || !party.whitelist_no) return null;
  return {
    role,
    roleLabel: role === 'payer' ? '付款方' : '收款方',
    name: party.name || '—',
    whitelistNo: party.whitelist_no,
    entityTypeLabel: entityTypeLabel(party.entity_type),
    identityLabel: `${party.name || '—'} · ${party.whitelist_no}`,
  };
}

export interface TransactionViewModel {
  header: {
    businessTypeLabel: string;
    orderNo: string;
    statusLabel: string;
    statusType: StatusBadgeType;
    statusEffect: 'pending' | undefined;
    submittedAt: string;
    completedAt: string | null;
    finishedAt: string | null;
  };
  isDeposit: boolean;
  isExchange: boolean;
  isWithdrawal: boolean;
  withdrawal: {
    amount: string;
    feeAmount: string;
    totalAmount: string;
    currencyCode: string;
    reviewFields: DetailField[];
    paymentFields: DetailField[];
  } | null;
  deposit: {
    amount: string;
    currencyCode: string;
    currencyName: string;
    networkCode: string;
    networkName: string;
    txid: string;
    receivingAddress: string;
    creditedAt: string | null;
    reviewFields: DetailField[];
    timeline: AdminTimelineItem[];
  } | null;
  exchange: {
    sourceAmount: string;
    sourceCode: string;
    sourceName: string;
    targetAmount: string;
    targetCode: string;
    targetName: string;
    exchangeRate: string;
    rateSourceLabel: string;
    frozenAt: string | null;
    completedAt: string | null;
    reviewFields: DetailField[];
    timeline: AdminTimelineItem[];
  } | null;
  payer: PartySummary | null;
  payee: PartySummary | null;
  applicationFiles: WithdrawalFile[];
  paymentFiles: WithdrawalFile[];
  timeline: AdminTimelineItem[];
  fileRounds: FileGroup[];
  agent: {
    companyName: string;
    agentCode: string;
    email: string;
  } | null;
}

export function useTransactionDetailView(
  state: Ref<{ transaction: TransactionItem; detail: TransactionDetail } | null>,
) {
  const isDeposit = computed(() => state.value?.transaction.business_type === 'deposit');
  const isExchange = computed(() => state.value?.transaction.business_type === 'exchange');
  const isWithdrawal = computed(() => state.value?.transaction.business_type === 'withdrawal');

  const header = computed<TransactionViewModel['header'] | null>(() => {
    const value = state.value;
    if (!value) return null;
    const { transaction } = value;
    return {
      businessTypeLabel: transaction.business_name,
      orderNo: transaction.order_no,
      statusLabel: transaction.status_name,
      statusType: resolveStatusType(transaction),
      statusEffect: resolveStatusEffect(transaction),
      submittedAt: transaction.submitted_at || '',
      completedAt: transaction.completed_at,
      finishedAt: transaction.finished_at,
    };
  });

  const agent = computed<TransactionViewModel['agent']>(() => {
    const value = state.value;
    if (!value) return null;
    return {
      companyName: value.transaction.user.company_name,
      agentCode: value.transaction.user.agent_code,
      email: value.transaction.user.email,
    };
  });

  const depositView = computed<TransactionViewModel['deposit']>(() => {
    const value = state.value;
    if (!value || !isDepositDetail(value.detail)) return null;
    const detail = value.detail;
    const review = detail.review;
    const reviewFields: DetailField[] = [];
    const reviewAdmin = buildField('review_admin', '审核管理员', review?.admin_name);
    if (reviewAdmin) reviewFields.push(reviewAdmin);
    const reviewedAt = buildField('reviewed_at', '审核时间', review?.reviewed_at);
    if (reviewedAt) reviewFields.push(reviewedAt);
    const note = buildField(
      'review_note',
      detail.status === 2 ? '驳回原因' : '审核备注',
      review?.note,
      { wide: true },
    );
    if (note) reviewFields.push(note);
    const credited = buildField('credited_at', '入账时间', detail.credited_at, {
      accent: detail.status === 1,
    });
    if (credited) reviewFields.push(credited);
    return {
      amount: detail.amount,
      currencyCode: detail.currency.code,
      currencyName: detail.currency.name,
      networkCode: detail.network.code,
      networkName: detail.network.name,
      txid: detail.txid,
      receivingAddress: detail.receiving_address_snapshot,
      creditedAt: detail.credited_at,
      reviewFields,
      timeline: buildTimelineFromRows(detail.timeline ?? []),
    };
  });

  const exchangeView = computed<TransactionViewModel['exchange']>(() => {
    const value = state.value;
    if (!value || !isExchangeDetail(value.detail)) return null;
    const detail = value.detail;
    const review = detail.review;
    const reviewFields: DetailField[] = [];
    const reviewAdmin = buildField('review_admin', '审核管理员', review?.admin_name);
    if (reviewAdmin) reviewFields.push(reviewAdmin);
    const reviewedAt = buildField('reviewed_at', '审核时间', review?.reviewed_at);
    if (reviewedAt) reviewFields.push(reviewedAt);
    const note = buildField(
      'review_note',
      detail.status === 2 ? '驳回原因' : '审核备注',
      review?.note,
      { wide: true },
    );
    if (note) reviewFields.push(note);
    return {
      sourceAmount: detail.source_amount,
      sourceCode: detail.source_currency.code,
      sourceName: detail.source_currency.name,
      targetAmount: detail.target_amount,
      targetCode: detail.target_currency.code,
      targetName: detail.target_currency.name,
      exchangeRate: formatExchangeRate(detail.exchange_rate),
      rateSourceLabel: detail.rate_source_name,
      frozenAt: detail.frozen_at || null,
      completedAt: detail.completed_at || null,
      reviewFields,
      timeline: buildTimelineFromRows(detail.timeline ?? []),
    };
  });

  const withdrawalView = computed<TransactionViewModel['withdrawal']>(() => {
    const value = state.value;
    if (!value || !isWithdrawalDetail(value.detail)) return null;
    const detail = value.detail;
    const review = detail.review;
    const reviewFields: DetailField[] = [];
    const reviewAdmin = buildField('review_admin', '审核管理员', review?.admin_name);
    if (reviewAdmin) reviewFields.push(reviewAdmin);
    const reviewedAt = buildField('reviewed_at', '审核时间', review?.reviewed_at);
    if (reviewedAt) reviewFields.push(reviewedAt);
    const note = buildField(
      'review_note',
      detail.status === 4 ? '驳回原因' : '审核备注',
      review?.note,
      { wide: true },
    );
    if (note) reviewFields.push(note);

    const payment = detail.payment;
    const paymentFields: DetailField[] = [];
    const paymentAdmin = buildField(
      'payment_admin',
      '付款处理管理员',
      payment?.admin_name,
    );
    if (paymentAdmin) paymentFields.push(paymentAdmin);
    const processingAt = buildField(
      'processing_at',
      '进入付款处理时间',
      payment?.processing_at,
    );
    if (processingAt) paymentFields.push(processingAt);
    const completedAt = buildField(
      'payment_completed_at',
      '付款完成时间',
      payment?.completed_at,
      { accent: true },
    );
    if (completedAt) paymentFields.push(completedAt);
    const failedAt = buildField(
      'payment_failed_at',
      '付款失败时间',
      payment?.failed_at,
    );
    if (failedAt) paymentFields.push(failedAt);
    const failureReason = buildField(
      'payment_failure_reason',
      '付款失败原因',
      payment?.failure_reason,
      { wide: true },
    );
    if (failureReason) paymentFields.push(failureReason);

    return {
      amount: detail.amount,
      feeAmount: formatFixedFee(detail.fee_amount),
      totalAmount: detail.total_amount,
      currencyCode: detail.currency.code,
      reviewFields,
      paymentFields,
    };
  });

  const payer = computed<PartySummary | null>(() => {
    const value = state.value;
    if (!value || !isWithdrawalDetail(value.detail)) return null;
    return buildParty(value.detail, 'payer');
  });
  const payee = computed<PartySummary | null>(() => {
    const value = state.value;
    if (!value || !isWithdrawalDetail(value.detail)) return null;
    return buildParty(value.detail, 'payee');
  });

  const timeline = computed<AdminTimelineItem[]>(() => {
    const value = state.value;
    if (!value) return [];
    if (isDepositDetail(value.detail)) {
      return buildTimelineFromRows(value.detail.timeline ?? []);
    }
    if (isExchangeDetail(value.detail)) {
      return buildTimelineFromRows(value.detail.timeline ?? []);
    }
    if (isWithdrawalDetail(value.detail)) {
      return buildTimelineFromRecords(value.detail.records ?? []);
    }
    return [];
  });

  const fileRounds = computed<FileGroup[]>(() => {
    const value = state.value;
    if (!value || !isWithdrawalDetail(value.detail)) return [];
    return buildFileRounds(value.detail.records ?? []);
  });

  /** 按时间线条目 key 索引的文件列表，供模板中 #item-extra 查找。 */
  const timelineFiles = computed<Record<string, WithdrawalFile[]>>(() => {
    const out: Record<string, WithdrawalFile[]> = {};
    for (const round of fileRounds.value) {
      out[round.key] = round.files;
    }
    return out;
  });

  const applicationFiles = computed<WithdrawalFile[]>(() => {
    const value = state.value;
    if (!value || !isWithdrawalDetail(value.detail)) return [];
    return value.detail.application_files ?? [];
  });

  const paymentFiles = computed<WithdrawalFile[]>(() => {
    const value = state.value;
    if (!value || !isWithdrawalDetail(value.detail)) return [];
    return value.detail.payment_files ?? [];
  });

  return {
    header,
    agent,
    isDeposit,
    isExchange,
    isWithdrawal,
    depositView,
    exchangeView,
    withdrawalView,
    payer,
    payee,
    timeline,
    fileRounds,
    timelineFiles,
    applicationFiles,
    paymentFiles,
  };
}
