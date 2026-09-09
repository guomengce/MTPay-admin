const parameterLabels: Record<string, string> = {
  amount: '金額',
  threshold: '閾值',
  count: '筆數',
  hours: '時間窗口',
  days: '天數',
  limit: '上限',
};
const categoryLabels: Record<string, string> = {
  amount: '金額',
  aggregate: '累計金額',
  frequency: '交易頻率',
  behavior: '行為風險',
};
const actionLabels: Record<string, string> = {
  business_review_with_note: '進入業務審核並要求填寫核查說明',
  open_risk_case: '暫停出金並建立風控案件',
  risk_review: '進入風控覆核',
  risk_review_with_supplement: '進入風控覆核並允許要求補件',
  block: '阻止出金',
  reject: '拒絕出金',
  allow: '直接放行',
};

function readableEnum(value: string) {
  return value.split('_').filter(Boolean).join(' ');
}
export function parameterLabel(value: string) {
  return parameterLabels[value] || readableEnum(value);
}
export function categoryLabel(value: string) {
  return categoryLabels[value] || readableEnum(value);
}
export function actionLabel(value: string) {
  return actionLabels[value.trim().toLowerCase()] || '未知處理方式';
}
export function parameterUnit(key: string, type: string | undefined, currency = 'USD') {
  if (type === 'amount') return currency;
  if (key === 'hours') return 'h';
  if (key === 'days') return '日';
  if (type === 'integer' || key === 'count') return '筆';
  return '';
}
export function formatRuleParameter(
  value: string | number,
  key: string,
  type: string | undefined,
  currency = 'USD',
) {
  const unit = parameterUnit(key, type, currency);
  return unit ? `${value} ${unit}` : String(value);
}
