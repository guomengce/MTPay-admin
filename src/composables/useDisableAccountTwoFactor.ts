import { h, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { disableAdminTwoFactor, disableUserTwoFactor } from '@/api/modules/twoFactor';
import { useAuthStore } from '@/stores/modules/auth';
import { confirmAdminAction } from '@/utils/adminMessageBox';

export function useDisableAccountTwoFactor(kind: 'admin' | 'agent', refresh: () => Promise<unknown>) {
  const authStore = useAuthStore();
  const twoFactorBusy = ref(false);
  async function disableTwoFactor(row: { id: number; name?: string; company_name?: string; email?: string }) {
    if (twoFactorBusy.value || !Number.isInteger(row.id) || row.id <= 0 || (kind === 'admin' && (row.id === 1 || String(row.id) === authStore.userInfo?.id))) return;
    const accountType = kind === 'admin' ? '管理員' : '代理';
    const accountName = row.company_name || row.name || row.email || String(row.id);
    const confirmed = await confirmAdminAction({
      title: '關閉 2FA',
      message: h('span', [
        `確認關閉${accountType}「`,
        h('strong', { class: 'admin-message-box__variable' }, accountName),
        '」的 2FA 嗎？',
      ]),
      confirmText: '確認關閉',
    });
    if (!confirmed) return;

    twoFactorBusy.value = true;
    try {
      await (kind === 'admin' ? disableAdminTwoFactor(row.id) : disableUserTwoFactor(row.id));
      ElMessage.success('已關閉該帳户的 2FA');
      await refresh();
    } catch { /* Request layer displays backend errors. */ }
    finally { twoFactorBusy.value = false; }
  }
  return { twoFactorBusy, disableTwoFactor };
}
