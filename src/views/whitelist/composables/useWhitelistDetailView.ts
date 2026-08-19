/**
 * 白名单详情展示模型
 *
 * 将后端 business_data、records 按审核场景分组，页面不再遍历无序对象：
 * 1. 主体身份与登记信息；2. 地址信息；3. 银行与汇款信息；
 * 4. 与处理记录关联的文件；5. 处理时间线。
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
    options: Pick<WhitelistDetailField, 'wide' | 'mono'> = {},
  ): WhitelistDetailField | null {
    const raw = detail.value?.business_data?.[key];
    if (raw === undefined || raw === null || raw === '') return null;
    return { key, label, value: presentValue(key, raw), ...options };
  }

  function compact(items: Array<WhitelistDetailField | null>) {
    return items.filter((item): item is WhitelistDetailField => Boolean(item));
  }

  /** 身份与登记：标题已展示主体名称，因此不重复 company_name / given_name / surname。 */
  const identityFields = computed(() =>
    compact([
      field('company_type', '公司类型'),
      field('registration_date', '注册日期'),
      field('birth_date', '出生日期'),
      field('document_type', '证件类型'),
      field('document_no', '证件编号', { mono: true }),
    ]),
  );

  /** 地址资料：保留不同业务含义的注册、经营、国籍与居住国家，不使用顶层 country 重复占位。 */
  const locationFields = computed(() =>
    compact([
      field('registration_country', '注册国家／地区'),
      field('operating_country', '经营国家／地区'),
      field('nationality', '国籍'),
      field('residence_country', '居住国家／地区'),
      field('city', '城市'),
      field('address', '详细地址', { wide: true }),
    ]),
  );

  /** 银行与汇款资料：仅收款人会有数据，无数据时整个区块不渲染。 */
  const bankFields = computed(() =>
    compact([
      field('bank_name', '银行名称'),
      field('bank_account', '银行账号', { mono: true }),
      field('swift', 'SWIFT', { mono: true }),
      field('intermediary_swift', '中间行 SWIFT', { mono: true }),
      field('remittance_purpose', '汇款目的', { wide: true }),
      field('remark', '备注', { wide: true }),
    ]),
  );

  /** 附件按每次提交/补件记录分轮展示，审核人员能看清材料来源和时间。 */
  const fileRounds = computed<WhitelistFileRound[]>(() =>
    (detail.value?.records ?? [])
      .filter((record) => record.files?.length)
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
    identityFields,
    locationFields,
    bankFields,
    fileRounds,
    timelineItems,
  };
}
