/** 出金详情展示模型：根据接口真实字段生成主体、审核、付款、资金和时间线信息。 */
import { computed, type Ref } from 'vue';

import type { WithdrawalOrderDetail, WithdrawalParty } from '@/api/modules/withdrawal';
import type { AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';

export interface DetailField {
  key: string;
  label: string;
  value: string;
  wide?: boolean;
  mono?: boolean;
  accent?: boolean;
}

const FIELD_LABELS: Record<string, string> = {
  company_name: '公司名称',
  given_name: '名',
  surname: '姓',
  company_type: '公司类型',
  registration_date: '注册日期',
  registration_country: '注册国家／地区',
  operating_country: '经营国家／地区',
  nationality: '国籍',
  residence_country: '居住国家／地区',
  city: '城市',
  address: '详细地址',
  document_type: '证件类型',
  document_no: '证件编号',
  bank_name: '银行名称',
  bank_account: '银行账号',
  swift: 'SWIFT',
  intermediary_swift: '中间行 SWIFT',
  remittance_purpose: '汇款目的',
  remark: '备注',
};

const HIDDEN_PARTY_FIELDS = new Set([
  'id',
  'name',
  'subject_name',
  'whitelist_no',
  'whitelist_id',
  'role',
  'role_name',
  'entity_type',
  'entity_type_name',
  // KYC 字段：出金审核场景价值低，不展示
  'document_type',
  'document_no',
  'registration_date',
  'registration_country',
  'operating_country',
  'nationality',
  'residence_country',
]);

/** 出金场景最关心的银行收款信息，排在主体信息之前。 */
const BANK_FIELDS = new Set(['bank_name', 'bank_account', 'swift', 'intermediary_swift']);

function displayValue(raw: unknown) {
  if (raw === null || raw === undefined || raw === '') return '';
  if (typeof raw === 'boolean') return raw ? '是' : '否';
  if (typeof raw === 'object') return JSON.stringify(raw);
  return String(raw);
}

function collectSnapshot(snapshot: Record<string, unknown> | undefined) {
  if (!snapshot) return [];
  const merged: Record<string, unknown> = { ...snapshot };
  const businessData = snapshot.business_data;
  delete merged.business_data;
  if (businessData && typeof businessData === 'object' && !Array.isArray(businessData)) {
    Object.assign(merged, businessData);
  }

  const entries = Object.entries(merged)
    .filter(([key, value]) => !HIDDEN_PARTY_FIELDS.has(key) && displayValue(value))
    .map(([key, value]) => ({
      key,
      label: FIELD_LABELS[key] || key.split('_').join(' '),
      value: displayValue(value),
      wide: key === 'address' || key === 'remark' || key === 'remittance_purpose',
      mono: ['document_no', 'bank_account', 'swift', 'intermediary_swift'].includes(key),
    }));

  const bank = entries.filter((item) => BANK_FIELDS.has(item.key));
  const subject = entries.filter((item) => !BANK_FIELDS.has(item.key));
  return [...bank, ...subject];
}

export function formatFileSize(size: number) {
  if (!Number.isFinite(size) || size <= 0) return '—';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function useWithdrawalDetailView(detail: Ref<WithdrawalOrderDetail | null>) {
  const payerFields = computed(() => collectSnapshot(detail.value?.payer?.snapshot));
  const payeeFields = computed(() => collectSnapshot(detail.value?.payee?.snapshot));

  const payerBankFields = computed(() => payerFields.value.filter((f) => BANK_FIELDS.has(f.key)));
  const payeeBankFields = computed(() => payeeFields.value.filter((f) => BANK_FIELDS.has(f.key)));
  const payerSubjectFields = computed(() =>
    payerFields.value.filter((f) => !BANK_FIELDS.has(f.key)),
  );
  const payeeSubjectFields = computed(() =>
    payeeFields.value.filter((f) => !BANK_FIELDS.has(f.key)),
  );

  const reviewFields = computed<DetailField[]>(() => {
    const source = detail.value?.review;
    if (!source) return [];
    const fields: Array<DetailField | null> = [
      source.admin_name ? { key: 'review_admin', label: '审核人', value: source.admin_name } : null,
      source.reviewed_at
        ? { key: 'reviewed_at', label: '审核时间', value: source.reviewed_at }
        : null,
      source.note
        ? {
            key: 'review_note',
            label: detail.value?.status === 4 ? '驳回原因' : '审核说明',
            value: source.note,
            wide: true,
          }
        : null,
    ];
    return fields.filter((item): item is DetailField => item !== null);
  });

  const paymentFields = computed<DetailField[]>(() => {
    const source = detail.value?.payment;
    if (!source) return [];
    const fields: Array<DetailField | null> = [
      source.admin_name
        ? { key: 'payment_admin', label: '付款处理人', value: source.admin_name }
        : null,
      source.processing_at
        ? { key: 'processing_at', label: '进入付款处理', value: source.processing_at }
        : null,
      source.completed_at
        ? { key: 'completed_at', label: '付款完成时间', value: source.completed_at, accent: true }
        : null,
      source.failed_at
        ? { key: 'failed_at', label: '付款失败时间', value: source.failed_at }
        : null,
      source.failure_reason
        ? { key: 'failure_reason', label: '付款失败原因', value: source.failure_reason, wide: true }
        : null,
    ];
    return fields.filter((item): item is DetailField => item !== null);
  });

  const timelineItems = computed<AdminTimelineItem[]>(() =>
    (detail.value?.records ?? []).map((record, index) => ({
      key: String(record.id ?? index),
      title: record.action_name || record.name || record.event || '订单处理',
      time: record.created_at || record.time || undefined,
      description: [record.actor_name || record.actor_type_name, record.message]
        .filter(Boolean)
        .join(' · '),
      state: 'done',
    })),
  );

  function partyType(party: WithdrawalParty | undefined) {
    if (!party) return '—';
    return party.entity_type === 1 ? '公司' : '个人';
  }

  return {
    payerBankFields,
    payeeBankFields,
    payerSubjectFields,
    payeeSubjectFields,
    reviewFields,
    paymentFields,
    timelineItems,
    partyType,
  };
}
