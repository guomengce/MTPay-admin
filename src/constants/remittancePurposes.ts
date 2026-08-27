/** 匯款目的枚舉；value 必須與後端 remittance_purpose 編號保持一致。 */
export const REMITTANCE_PURPOSE_OPTIONS = [
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
] as const;

/** 未知編號保留原值，避免隱藏後端新增枚舉。 */
export function getRemittancePurposeLabel(value: unknown): string {
  const index = Number(value) - 1;
  return REMITTANCE_PURPOSE_OPTIONS[index] || String(value ?? '—');
}
