/**
 * 管理端白名單附件操作
 *
 * - API 請求攔截器已直接返回 Blob，禁止再次讀取 response.data；
 * - 預覽使用新標籤頁打開鑑權接口返回的臨時 Blob URL；
 * - 下載使用後端文件元數據中的原始文件名；
 * - loading 精確到當前文件和操作，避免所有附件按鈕同時進入加載狀態。
 */
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

import { downloadWhitelistFile, previewWhitelistFile } from '@/api/modules/whitelist';

export function useWhitelistAttachments() {
  const activeAction = ref('');

  function actionKey(fileId: number, action: 'preview' | 'download') {
    return `${action}:${fileId}`;
  }

  function isLoading(fileId: number, action: 'preview' | 'download') {
    return activeAction.value === actionKey(fileId, action);
  }

  /** 預覽 PDF/圖片等瀏覽器支持的文件格式。 */
  async function preview(fileId: number) {
    activeAction.value = actionKey(fileId, 'preview');
    try {
      const blob = await previewWhitelistFile(fileId);
      if (!(blob instanceof Blob) || blob.size === 0) throw new Error('文件內容為空');
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

  /** 下載文件並保留代理上傳時的原始文件名。 */
  async function download(fileId: number, originalName: string) {
    activeAction.value = actionKey(fileId, 'download');
    try {
      const blob = await downloadWhitelistFile(fileId);
      if (!(blob instanceof Blob) || blob.size === 0) throw new Error('文件內容為空');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName || `whitelist-file-${fileId}`;
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
