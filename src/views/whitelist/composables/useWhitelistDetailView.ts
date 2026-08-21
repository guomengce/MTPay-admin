/**
 * 白名单详情展示模型
 *
 * 将后端 business_data 按"每个区块"暴露成单独的 computed，便于 SubjectInfo
 * 根据角色 × 主体类型显式组合。同时维护文件分轮和处理时间线。
 */
import { computed, type Ref } from 'vue';

import type { WhitelistDetail, WhitelistFile } from '@/api/modules/whitelist';
import type { AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';

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

const COMPANY_TYPES: Record<number, string> = { 1: '非金融机构', 2: '金融机构' };
const DOCUMENT_TYPES: Record<number, string> = { 1: '身份证件', 2: '护照' };

const REMITTANCE_PURPOSES = [
  'Salary (Compensation of employees)',
  'Purchase of real estate abroad from residents',
  'Allowance',
  'Agency Commissions',
  'Advance Payment against EOS',
  'Bonus',
  'Commission',
  'Compensation',
  'End of Service/ Final Settlement',
  'Leave Salary',
  'Own Account Transfer',
  'Overtime',
  'Pension',
  'Personal Investment',
  'Salary Advance',
  'Transfer of Funds between persons Normal and Judicial',
  'Educational Support',
  'Equity other than investment fund shares in not related companies abroad',
  'Investment fund shares foreign',
  'Tickets',
  'Leasing abroad',
  'Repos on foreign securities',
  'Trade credits and advances receivable',
  'Loan Interest Payments',
  'Loan Charges',
  'Monetary Claim Reimbursements',
  'Equated Monthly Installments',
  'Trade credits and advances payable',
  'Rent Payments',
  'Utility Bill Payments',
  'Goods sold',
  'Goods bought',
];

function presentValue(key: string, raw: unknown) {
  if (key === 'company_type') return COMPANY_TYPES[Number(raw)] || String(raw);
  if (key === 'document_type') return DOCUMENT_TYPES[Number(raw)] || String(raw);
  if (key === 'remittance_purpose') {
    const number = Number(raw);
    return REMITTANCE_PURPOSES[number - 1] || String(raw);
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
        value: options.optional ? '未填写' : '接口未返回',
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
      field('company_name', '公司名称'),
      field('company_type', '公司类型'),
      field('document_no', '证件编号', { mono: true }),
      field('registration_date', '注册日期'),
    ]),
  );

  const registrationFields = computed(() =>
    compact([
      field('registration_country', '注册国家／地区'),
      field('operating_country', '经营国家／地区'),
      field('city', '所在城市'),
      field('address', '详细地址', { wide: true }),
    ]),
  );

  /* ---------- 付款人 / 个人 ---------- */
  const payerIndividualIdentityFields = computed(() =>
    compact([
      field('given_name', '名'),
      field('surname', '姓'),
      field('nationality', '国籍'),
      field('birth_date', '出生日期'),
      field('document_type', '证件类型'),
      field('document_no', '证件编号', { mono: true }),
    ]),
  );

  const payerIndividualResidenceFields = computed(() =>
    compact([
      field('residence_country', '居住国家／地区'),
      field('city', '所在城市'),
      field('address', '详细地址', { wide: true }),
    ]),
  );

  /* ---------- 收款人 / 公司 ---------- */
  const payeeCompanyFields = computed(() => compact([field('company_name', '公司名称')]));

  const payeeCompanyLocationFields = computed(() =>
    compact([
      field('operating_country', '经营国家／地区'),
      field('city', '所在城市'),
      field('address', '详细地址', { wide: true }),
    ]),
  );

  /* ---------- 收款人 / 个人 ---------- */
  const payeeIndividualIdentityFields = computed(() =>
    compact([field('given_name', '名'), field('surname', '姓'), field('nationality', '国籍')]),
  );

  const payeeIndividualResidenceFields = computed(() =>
    compact([
      field('residence_country', '居住国家／地区'),
      field('city', '所在城市'),
      field('address', '详细地址', { wide: true }),
    ]),
  );

  /* ---------- 收款账户信息（收款人共用） ---------- */
  const payeeBankFields = computed(() =>
    compact([
      field('bank_name', '银行名称'),
      field('bank_account', '银行账号', { mono: true }),
      field('swift', 'SWIFT', { mono: true }),
      field('intermediary_swift', '中间行 SWIFT（可选）', { mono: true, optional: true }),
      field('remittance_purpose', '汇款目的', { wide: true }),
      field('remark', '备注（可选）', { wide: true, optional: true }),
    ]),
  );

  /* ---------- 附件 / 时间线 ---------- */
  const fileRounds = computed<WhitelistFileRound[]>(() =>
    (detail.value?.records ?? [])
      // 代理提交与补件记录即使没有附件也保留，让审核人员明确知道本轮未提交证明文件。
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
