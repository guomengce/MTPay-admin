/**
 * 縮略展示哈希、錢包地址等長標識符。僅用於 UI，複製與接口提交應保留原值。
 */
export function formatLongIdentifier(value: unknown, head = 8, tail = 8): string {
  if (value === null || value === undefined || value === '') return '—';
  const text = String(value);
  if (text.length <= head + tail + 3) return text;
  return `${text.slice(0, head)}...${text.slice(-tail)}`;
}
