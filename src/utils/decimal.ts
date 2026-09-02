/** 去除十進制字符串末尾無意義的 0，不經過 Number，避免資金精度損失。 */
export function trimDecimalZeros(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '';
  const text = String(value).trim();
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(text)) return text;
  if (!text.includes('.')) return text;
  return text.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
}

/** 兑換比例固定顯示 4 位小數，超過 4 位時四捨五入。 */
export function formatExchangeRate(value: string | number | null | undefined): string {
  const text = trimDecimalZeros(value);
  if (!text || !/^[+-]?\d+(?:\.\d+)?$/.test(text)) return text;

  const [integerPart, fractionPart = ''] = text.split('.');
  if (fractionPart.length <= 4) {
    return `${integerPart}.${fractionPart.padEnd(4, '0')}`;
  }

  const negative = integerPart.startsWith('-');
  const unsignedInteger = integerPart.replace(/^[+-]/, '');
  const digits = `${unsignedInteger}${fractionPart.slice(0, 4)}`.split('').map(Number);

  if (Number(fractionPart[4]) >= 5) {
    for (let index = digits.length - 1; index >= 0; index -= 1) {
      digits[index] += 1;
      if (digits[index] < 10) break;
      digits[index] = 0;
      if (index === 0) digits.unshift(1);
    }
  }

  const rounded = digits.join('');
  const integer = rounded.slice(0, -4) || '0';
  const fraction = rounded.slice(-4).padStart(4, '0');
  return `${negative ? '-' : ''}${integer}.${fraction}`;
}

/** 固定手續費展示格式；正常的整數手續費會顯示為 50 而不是 50.00000000。 */
export const formatFixedFee = trimDecimalZeros;


/** 限制非負十進制輸入的小數位數，用於輸入過程中直接阻止超長精度。 */
export function limitDecimalInput(value: string, decimalPlaces = 2): string {
  const cleaned = value.replace(/[^\d.]/g, '');
  const [integer = '', ...fractionParts] = cleaned.split('.');
  if (!fractionParts.length) return integer;
  const fraction = fractionParts.join('').slice(0, Math.max(0, decimalPlaces));
  return `${integer || '0'}.${fraction}`;
}
