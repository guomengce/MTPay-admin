import { ElMessage } from 'element-plus';

import type { DetailField } from '../../composables/useWithdrawalDetailView';

export async function copyPartyCard(label: string, fields: DetailField[], bankFields: DetailField[] = []) {
  const lines = [
    ...fields.map((item) => `${item.label}：${item.value}`),
    ...bankFields.map((item) => `${item.label}：${item.value}`),
  ];
  try {
    await navigator.clipboard.writeText(lines.join('\n'));
    ElMessage.success(`${label}資料已複製`);
  } catch {
    ElMessage.error('複製失敗，請手動複製');
  }
}
