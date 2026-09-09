/**
 * 白名單詳情展示模型
 *
 * 將後端 business_data 按"每個區塊"暴露成單獨的 computed，便於 SubjectInfo
 * 根據角色 × 主體類型顯式組合。同時維護文件分輪和處理時間線。
 */
import { computed, type Ref } from 'vue';

import type { WhitelistDetail, WhitelistFile } from '@/api/modules/whitelist';
import type { AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';
import { getCountryLabel } from '@/constants/countries';
import { getRemittancePurposeLabel } from '@/constants/remittancePurposes';

export interface WhitelistDetailField {
  key: string;
  label: string;
  value: string;
  wide?: boolean;
  mono?: boolean;
  optional?: boolean;
  missing?: boolean;
}

export interface WhitelistFileRound {
  key: number;
  title: string;
  actor: string;
  time: string;
  message: string;
  files: WhitelistFile[];
}

const COMPANY_TYPES: Record<number, string> = { 1: '非金融機構', 2: '金融機構' };
const DOCUMENT_TYPES: Record<number, string> = { 1: '身份證件', 2: '護照' };

function presentValue(key: string, raw: unknown) {
  if (key === 'company_type') return COMPANY_TYPES[Number(raw)] || String(raw);
  if (key === 'document_type') return DOCUMENT_TYPES[Number(raw)] || String(raw);
  if (key === 'remittance_purpose') return getRemittancePurposeLabel(raw);
  if (['registration_country', 'operating_country', 'nationality', 'residence_country'].includes(key)) {
    return getCountryLabel(raw);
  }
  return String(raw);
}

export function formatFileSize(size: number) {
  if (!Number.isFinite(size) || size <= 0) return '—';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function useWhitelistDetailView(detail: Ref<WhitelistDetail | null>) {
  function field(
    key: string,
    label: string,
    options: Pick<WhitelistDetailField, 'wide' | 'mono' | 'optional'> = {},
  ): WhitelistDetailField {
    const raw = detail.value?.business_data?.[key];
    if (raw === undefined || raw === null || raw === '') {
      return {
        key,
        label,
        value: options.optional ? '未填寫' : '接口未返回',
        missing: true,
        ...options,
      };
    }
    return { key, label, value: presentValue(key, raw), ...options };
  }

  function compact(items: Array<WhitelistDetailField | null>) {
    return items.filter((item): item is WhitelistDetailField => Boolean(item));
  }

  /* ---------- 付款人 / 公司 ---------- */
  const companyIdentityFields = computed(() =>
    compact([
      field('company_name', '公司名稱'),
      field('company_type', '公司類型'),
      field('document_no', '公司編號', { mono: true }),
      field('registration_date', '註冊日期'),
    ]),
  );

  const registrationFields = computed(() =>
    compact([
      field('registration_country', '註冊國家／地區'),
      field('operating_country', '經營國家／地區'),
      field('city', '所在城市'),
      field('address', '詳細地址', { wide: true }),
    ]),
  );

  /* ---------- 付款人 / 個人 ---------- */
  const payerIndividualIdentityFields = computed(() =>
    compact([
      field('given_name', '名'),
      field('surname', '姓'),
      field('nationality', '國籍'),
      field('birth_date', '出生日期'),
      field('document_type', '證件類型'),
      field('document_no', '證件編號', { mono: true }),
    ]),
  );

  const payerIndividualResidenceFields = computed(() =>
    compact([
      field('residence_country', '居住國家／地區'),
      field('city', '所在城市'),
      field('address', '詳細地址', { wide: true }),
    ]),
  );

  /* ---------- 收款人 / 公司 ---------- */
  const payeeCompanyFields = computed(() => compact([field('company_name', '公司名稱')]));

  const payeeCompanyLocationFields = computed(() =>
    compact([
      field('operating_country', '經營國家／地區'),
      field('city', '所在城市'),
      field('address', '詳細地址', { wide: true }),
    ]),
  );

  /* ---------- 收款人 / 個人 ---------- */
  const payeeIndividualIdentityFields = computed(() =>
    compact([field('given_name', '名'), field('surname', '姓'), field('nationality', '國籍')]),
  );

  const payeeIndividualResidenceFields = computed(() =>
    compact([
      field('residence_country', '居住國家／地區'),
      field('city', '所在城市'),
      field('address', '詳細地址', { wide: true }),
    ]),
  );

  /* ---------- 收款賬户信息（收款人共用） ---------- */
  const payeeBankFields = computed(() =>
    compact([
      field('bank_name', '銀行名稱'),
      field('bank_account', '銀行賬號', { mono: true }),
      field('swift', 'SWIFT', { mono: true }),
      field('intermediary_swift', '中間行 SWIFT（可選）', { mono: true, optional: true }),
      field('remittance_purpose', '匯款目的', { wide: true }),
      field('remark', '備註（可選）', { wide: true, optional: true }),
    ]),
  );

  /* ---------- 附件 / 時間線 ---------- */
  const fileRounds = computed<WhitelistFileRound[]>(() =>
    (detail.value?.records ?? [])
      // 代理提交與補件記錄即使沒有附件也保留，讓審核人員明確知道本輪未提交證明文件。
      .filter((record) => record.actor_type === 1)
      .map((record) => ({
        key: record.id,
        title: record.action_name,
        actor: record.actor_name || record.actor_type_name,
        time: record.created_at || '—',
        message: record.message || '',
        files: record.files,
      })),
  );

  const timelineItems = computed<AdminTimelineItem[]>(() =>
    (detail.value?.records ?? []).map((record) => ({
      key: String(record.id),
      title: record.action_name,
      time: record.created_at || undefined,
      description: [record.actor_name || record.actor_type_name, record.message]
        .filter(Boolean)
        .join(' · '),
      state: 'done',
    })),
  );

  return {
    companyIdentityFields,
    registrationFields,
    payerIndividualIdentityFields,
    payerIndividualResidenceFields,
    payeeCompanyFields,
    payeeCompanyLocationFields,
    payeeIndividualIdentityFields,
    payeeIndividualResidenceFields,
    payeeBankFields,
    fileRounds,
    timelineItems,
  };
}
