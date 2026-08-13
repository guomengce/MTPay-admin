/**
 * fee mapper
 * 集中处理比例 / 金额格式化（页面不直接调 toFixed）
 */
export interface RateFormat {
  display: string;
  ratio: number;
}

export function parseRate(rate: string): number {
  const num = Number.parseFloat(rate);
  return Number.isFinite(num) ? num : 0;
}

/** 1 单位的输入资产 → 多少 USD 输出 */
export function toRateDisplay(rate: string, assetLabel: string): string {
  const value = parseRate(rate);
  if (!value) return '—';
  return `1 ${assetLabel} → ${value.toFixed(4)} USD`;
}

/** 输入金额 + 比例 → 可得 USD */
export function toConvertedUsd(amount: string, rate: string): string {
  const a = Number.parseFloat(amount);
  const r = parseRate(rate);
  if (!Number.isFinite(a) || !r) return '—';
  return (a * r).toFixed(2);
}

/** 提取比例数字用于编辑控件 */
export function toRateInputValue(rate: string): number {
  return parseRate(rate);
}
