/**
 * fee mapper
 * 集中處理比例 / 金額格式化（頁面不直接調 toFixed）
 */
import { formatExchangeRate } from '@/utils/decimal';
export interface RateFormat {
  display: string;
  ratio: number;
}

export function parseRate(rate: string): number {
  const num = Number.parseFloat(rate);
  return Number.isFinite(num) ? num : 0;
}

/** 1 單位的輸入資產 → 多少 USD 輸出 */
export function toRateDisplay(rate: string, assetLabel: string): string {
  const value = parseRate(rate);
  if (!value) return '—';
  return `1 ${assetLabel} → ${formatExchangeRate(rate)} USD`;
}

/** 輸入金額 + 比例 → 可得 USD */
export function toConvertedUsd(amount: string, rate: string): string {
  const a = Number.parseFloat(amount);
  const r = parseRate(rate);
  if (!Number.isFinite(a) || !r) return '—';
  return (a * r).toFixed(2);
}

/** 提取比例數字用於編輯控件 */
export function toRateInputValue(rate: string): number {
  return parseRate(rate);
}
