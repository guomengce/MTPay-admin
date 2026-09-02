/** 法幣出金詳情展示模型：根據接口真實字段生成主體、審核、付款、資金和時間線信息。 */
import { computed, type Ref } from 'vue';

import type { WithdrawalFile, WithdrawalOrderDetail, WithdrawalParty } from '@/api/modules/withdrawal';
import type { AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';
import { getRemittancePurposeLabel } from '@/constants/remittancePurposes';

export interface DetailField {
  key: string;
  label: string;
  value: string;
  wide?: boolean;
  mono?: boolean;
  accent?: boolean;
}

export interface WithdrawalFileRound {
  key: number;
  title: string;
  actor: string;
  time: string;
  message: string;
  files: WithdrawalFile[];
}

const FIELD_LABELS: Record<string, string> = {
  company_name: '公司名稱',
  given_name: '名',
  surname: '姓',
  company_type: '公司類型',
  registration_date: '註冊日期',
  registration_country: '註冊國家／地區',
  operating_country: '經營國家／地區',
  nationality: '國籍',
  residence_country: '居住國家／地區',
  city: '所在城市',
  address: '詳細地址',
  birth_date: '出生日期',
  document_type: '證件類型',
  document_no: '證件編號',
  bank_name: '銀行名稱',
  bank_address: '銀行地址',
  bank_account: '銀行賬號',
  account_no: '銀行賬號',
  iban: 'IBAN',
  swift: 'SWIFT',
  swift_code: 'SWIFT Code',
  intermediary_swift: '中間行 SWIFT（可選）',
  remittance_purpose: '匯款目的',
  remark: '備註（可選）',
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
  'account_no',
  'swift_code',
]);

/** 法幣出金場景最關心的銀行收款信息，排在主體信息之前。 */
const BANK_FIELDS = new Set([
  'bank_name',
  'bank_address',
  'bank_account',
  'account_no',
  'iban',
  'swift',
  'swift_code',
  'intermediary_swift',
  'remittance_purpose',
  'remark',
]);

const PAYER_COMPANY_FIELDS = [
  'company_name',
  'registration_country',
  'operating_country',
  'city',
  'address',
  'registration_date',
  'company_type',
  'document_no',
];
const PAYEE_COMPANY_FIELDS = ['company_name', 'operating_country', 'city', 'address'];
const PAYER_PERSON_FIELDS = [
  'given_name',
  'surname',
  'nationality',
  'residence_country',
  'city',
  'address',
  'birth_date',
  'document_type',
  'document_no',
];
const PAYEE_PERSON_FIELDS = [
  'given_name',
  'surname',
  'nationality',
  'residence_country',
  'city',
  'address',
];
const PAYEE_BANK_FIELDS = [
  'bank_name',
  'bank_account',
  'swift',
  'intermediary_swift',
  'remittance_purpose',
  'remark',
];

const COMPANY_TYPES: Record<number, string> = { 1: '非金融機構', 2: '金融機構' };
const DOCUMENT_TYPES: Record<number, string> = { 1: '身份證件', 2: '護照' };

function displayValue(key: string, raw: unknown) {
  if (raw === null || raw === undefined || raw === '') return '';
  if (key === 'company_type') return COMPANY_TYPES[Number(raw)] || String(raw);
  if (key === 'document_type') return DOCUMENT_TYPES[Number(raw)] || String(raw);
  if (key === 'remittance_purpose') return getRemittancePurposeLabel(raw);
  if (typeof raw === 'boolean') return raw ? '是' : '否';
  if (typeof raw === 'object') return JSON.stringify(raw);
  return String(raw);
}

function collectSnapshot(party: WithdrawalParty | undefined, includeBank: boolean) {
  const source = party?.data ?? party?.snapshot;
  const merged: Record<string, unknown> = source ? { ...source } : {};
  const businessData = source?.business_data;
  delete merged.business_data;
  if (businessData && typeof businessData === 'object' && !Array.isArray(businessData)) {
    Object.assign(merged, businessData);
  }
  if (!merged.bank_account && merged.account_no) merged.bank_account = merged.account_no;
  if (!merged.swift && merged.swift_code) merged.swift = merged.swift_code;
  if (!merged.company_name && party?.entity_type === 1) merged.company_name = party.name;

  const subjectKeys = party?.entity_type === 2
    ? (includeBank ? PAYEE_PERSON_FIELDS : PAYER_PERSON_FIELDS)
    : (includeBank ? PAYEE_COMPANY_FIELDS : PAYER_COMPANY_FIELDS);
  const expectedKeys = [...subjectKeys, ...(includeBank ? PAYEE_BANK_FIELDS : [])];
  const entries = expectedKeys.map((key) => {
    const value = merged[key];
    return {
      key,
      label: key === 'document_no'
        ? (party?.entity_type === 1 ? '公司編號' : '證件編號')
        : (FIELD_LABELS[key] || key.split('_').join(' ')),
      value: displayValue(key, value) || '—',
      wide: ['address', 'bank_address', 'remark', 'remittance_purpose'].includes(key),
      mono: ['document_no', 'bank_account', 'account_no', 'iban', 'swift', 'swift_code', 'intermediary_swift'].includes(key),
    };
  });

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
  const payerFields = computed(() => collectSnapshot(detail.value?.payer, false));
  const payeeFields = computed(() => collectSnapshot(detail.value?.payee, true));

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
      source.admin_name ? { key: 'review_admin', label: '審核人', value: source.admin_name } : null,
      source.reviewed_at
        ? { key: 'reviewed_at', label: '審核時間', value: source.reviewed_at }
        : null,
      source.note
        ? {
            key: 'review_note',
            label: detail.value?.status === 4 ? '駁回原因' : '審核説明',
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
        ? { key: 'payment_admin', label: '付款處理人', value: source.admin_name }
        : null,
      source.processing_at
        ? { key: 'processing_at', label: '進入付款處理', value: source.processing_at }
        : null,
      source.completed_at
        ? { key: 'completed_at', label: '付款完成時間', value: source.completed_at, accent: true }
        : null,
      source.failed_at
        ? { key: 'failed_at', label: '付款失敗時間', value: source.failed_at }
        : null,
      source.failure_reason
        ? { key: 'failure_reason', label: '付款失敗原因', value: source.failure_reason, wide: true }
        : null,
    ];
    return fields.filter((item): item is DetailField => item !== null);
  });

  const timelineItems = computed<AdminTimelineItem[]>(() =>
    (detail.value?.records ?? []).map((record, index) => ({
      key: String(record.id ?? index),
      title: record.action_name || record.name || record.event || '訂單處理',
      time: record.created_at || record.time || undefined,
      description: [record.actor_name || record.actor_type_name, record.message]
        .filter(Boolean)
        .join(' · '),
      state: 'done',
    })),
  );

  /** 附件按每次處理記錄分輪展示，時間線節點直接展示本次關聯的文件。 */
  const fileRounds = computed<WithdrawalFileRound[]>(() =>
    (detail.value?.records ?? [])
      .filter((record) => (record.files?.length ?? 0) > 0)
      .map((record) => ({
        key: record.id,
        title: record.action_name || record.name || record.event || '訂單處理',
        actor: record.actor_name || record.actor_type_name || '—',
        time: record.created_at || record.time || '—',
        message: record.message || '',
        files: record.files ?? [],
      })),
  );

  /** 交易記錄詳情仍依賴該兼容方法；法幣出金審核詳情已改用四種獨立卡片。 */
  function partyType(party: WithdrawalParty | undefined) {
    if (!party) return '—';
    return party.entity_type === 1 ? '公司' : '個人';
  }

  return {
    payerBankFields,
    payeeBankFields,
    payerSubjectFields,
    payeeSubjectFields,
    reviewFields,
    paymentFields,
    timelineItems,
    fileRounds,
    partyType,
  };
}
