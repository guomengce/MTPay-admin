/** 管理端法幣出金私有附件：按文件和動作維護 loading，並保留原始文件名。 */
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

import { downloadWithdrawalFile, previewWithdrawalFile } from '@/api/modules/withdrawal';

export function useWithdrawalAttachments() {
  const activeAction = ref('');

  function key(fileId: number, action: 'preview' | 'download') {
    return `${action}:${fileId}`;
  }

  function isLoading(fileId: number, action: 'preview' | 'download') {
    return activeAction.value === key(fileId, action);
  }

  async function preview(fileId: number) {
    activeAction.value = key(fileId, 'preview');
    try {
      const blob = await previewWithdrawalFile(fileId);
      if (!(blob instanceof Blob) || blob.size === 0) throw new Error('empty');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      ElMessage.error('文件預覽失敗，請稍後重試');
    } finally {
      activeAction.value = '';
    }
  }

  async function download(fileId: number, originalName: string) {
    activeAction.value = key(fileId, 'download');
    try {
      const blob = await downloadWithdrawalFile(fileId);
      if (!(blob instanceof Blob) || blob.size === 0) throw new Error('empty');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName || `withdrawal-file-${fileId}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    } catch {
      ElMessage.error('文件下載失敗，請稍後重試');
    } finally {
      activeAction.value = '';
    }
  }

  return { isLoading, preview, download };
}
