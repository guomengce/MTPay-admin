/** 匯款目的枚舉；value 必須與後端 remittance_purpose 編號保持一致。 */
export const REMITTANCE_PURPOSE_OPTIONS = [
  { id: 1, label: '薪金（僱員報酬）' },
  { id: 2, label: '向居民購買境外房地產' },
  { id: 3, label: '津貼' },
  { id: 4, label: '代理佣金' },
  { id: 5, label: '離職結算預付款' },
  { id: 6, label: '獎金' },
  { id: 7, label: '佣金' },
  { id: 8, label: '補償款' },
  { id: 9, label: '離職／最終結算' },
  { id: 10, label: '休假薪金' },
  { id: 11, label: '本人帳戶轉帳' },
  { id: 12, label: '加班費' },
  { id: 13, label: '退休金' },
  { id: 14, label: '個人投資' },
  { id: 15, label: '薪金預支' },
  { id: 16, label: '自然人與法人之間的資金轉帳' },
  { id: 17, label: '教育資助' },
  { id: 18, label: '境外非關聯公司的非投資基金份額股權' },
  { id: 19, label: '境外投資基金份額' },
  { id: 20, label: '票務費用' },
  { id: 21, label: '境外租賃' },
  { id: 22, label: '境外證券回購' },
  { id: 23, label: '應收貿易信貸及預付款' },
  { id: 24, label: '貸款利息支付' },
  { id: 25, label: '貸款費用' },
  { id: 26, label: '貨幣債權償付' },
  { id: 27, label: '等額月供' },
  { id: 28, label: '應付貿易信貸及預付款' },
  { id: 29, label: '租金支付' },
  { id: 30, label: '公用事業帳單支付' },
  { id: 31, label: '銷售貨物' },
  { id: 32, label: '購買貨物' },
] as const;

const REMITTANCE_PURPOSE_LABELS = new Map<number, string>(
  REMITTANCE_PURPOSE_OPTIONS.map(({ id, label }) => [id, label]),
);

/** 未知編號保留原值，避免隱藏後端新增枚舉。 */
export function getRemittancePurposeLabel(value: unknown): string {
  return REMITTANCE_PURPOSE_LABELS.get(Number(value)) || String(value ?? '—');
}
