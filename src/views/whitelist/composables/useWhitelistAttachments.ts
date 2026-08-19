/**
 * 管理端白名单附件操作
 *
 * - API 请求拦截器已直接返回 Blob，禁止再次读取 response.data；
 * - 预览使用新标签页打开鉴权接口返回的临时 Blob URL；
 * - 下载使用后端文件元数据中的原始文件名；
 * - loading 精确到当前文件和操作，避免所有附件按钮同时进入加载状态。
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

  /** 预览 PDF/图片等浏览器支持的文件格式。 */
  async function preview(fileId: number) {
    activeAction.value = actionKey(fileId, 'preview');
    try {
      const blob = await previewWhitelistFile(fileId);
      if (!(blob instanceof Blob) || blob.size === 0) throw new Error('文件内容为空');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      ElMessage.error('文件预览失败，请稍后重试');
    } finally {
      activeAction.value = '';
    }
  }

  /** 下载文件并保留代理上传时的原始文件名。 */
  async function download(fileId: number, originalName: string) {
    activeAction.value = actionKey(fileId, 'download');
    try {
      const blob = await downloadWhitelistFile(fileId);
      if (!(blob instanceof Blob) || blob.size === 0) throw new Error('文件内容为空');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName || `whitelist-file-${fileId}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    } catch {
      ElMessage.error('文件下载失败，请稍后重试');
    } finally {
      activeAction.value = '';
    }
  }

  return { isLoading, preview, download };
}
