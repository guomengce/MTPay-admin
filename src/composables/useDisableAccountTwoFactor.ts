import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { disableAdminTwoFactor, disableUserTwoFactor } from '@/api/modules/twoFactor';
import { useAuthStore } from '@/stores/modules/auth';

export function useDisableAccountTwoFactor(kind: 'admin' | 'agent', refresh: () => Promise<unknown>) {
  const authStore = useAuthStore();
  const twoFactorBusy = ref(false);
  async function disableTwoFactor(row: { id: number; name?: string; company_name?: string; email?: string }) {
    if (twoFactorBusy.value || !Number.isInteger(row.id) || row.id <= 0 || (kind === 'admin' && (row.id === 1 || String(row.id) === authStore.userInfo?.id))) return;
    twoFactorBusy.value = true;
    try {
      try {
        await ElMessageBox.confirm(`確定關閉${kind === 'admin' ? '管理員' : '代理'}「${row.company_name || row.name || row.email || row.id}」的 2FA？關閉後該帳户登入將不再要求動態驗證碼。`, '關閉 2FA', {
          type: 'warning', confirmButtonText: '確認關閉', cancelButtonText: '取消',
        });
      } catch { return; }
      await (kind === 'admin' ? disableAdminTwoFactor(row.id) : disableUserTwoFactor(row.id));
      ElMessage.success('已關閉該帳户的 2FA');
      await refresh();
    } catch { /* Request layer displays backend errors. */ }
    finally { twoFactorBusy.value = false; }
  }
  return { twoFactorBusy, disableTwoFactor };
}
