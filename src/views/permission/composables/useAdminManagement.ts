import { useListQueryState } from '@/composables/useListQueryState';
import { useDisableAccountTwoFactor } from '@/composables/useDisableAccountTwoFactor';
import { onMounted, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  createAdminAccount,
  fetchAdminAccountInfo,
  fetchAdminAccountList,
  updateAdminAccount,
  updateAdminAccountStatus,
  updateAdminCryptoStatus,
  type AdminAccount,
  type AdminAccountPayload,
} from '@/api/modules/adminAccount';
import { useAuthStore } from '@/stores/modules/auth';

export function useAdminManagement() {
  const authStore = useAuthStore();
  const list = ref<AdminAccount[]>([]);
  const loading = ref(false);
  const submitting = ref(false);
  const page = ref(1);
  const limit = ref(15);
  const total = ref(0);
  const keyword = ref('');
  const status = ref<0 | 1 | undefined>();
  const dialogVisible = ref(false);
  const editing = ref<AdminAccount | null>(null);
  const passwordOnly = ref(false);

  const saveListQuery = useListQueryState({ keyword, status, page, limit }, ["status"]);

  async function loadList() {
    await saveListQuery();
    loading.value = true;
    try {
      const result = await fetchAdminAccountList({ page: page.value, limit: limit.value, keyword: keyword.value.trim() || undefined, status: status.value });
      list.value = result.data;
      total.value = result.total;
    } finally { loading.value = false; }
  }

  function search() { if (page.value !== 1) page.value = 1; else void loadList(); }
  function reset() { keyword.value = ''; status.value = undefined; search(); }
  function openCreate() { passwordOnly.value = false; editing.value = null; dialogVisible.value = true; }
  async function openEdit(row: AdminAccount) {
    if (Number(row.id) === 1) return;
    passwordOnly.value = false;
    const info = await fetchAdminAccountInfo(row.id);
    editing.value = { ...row, ...info };
    dialogVisible.value = true;
  }
  function openOwnPassword(row: AdminAccount) {
    const current = authStore.userInfo;
    const sameId = current?.id != null && String(row.id) === String(current.id);
    const sameEmail = Boolean(current?.email && row.email) && row.email.trim().toLowerCase() === current!.email.trim().toLowerCase();
    if (Number(row.id) !== 1 || (!sameId && !sameEmail)) return;
    passwordOnly.value = true;
    editing.value = row;
    dialogVisible.value = true;
  }
  async function submit(payload: AdminAccountPayload) {
    submitting.value = true;
    try {
      if (editing.value) await updateAdminAccount({ id: editing.value.id, ...payload });
      else await createAdminAccount(payload as AdminAccountPayload & { password: string });
      ElMessage.success(editing.value ? '管理員資料已更新' : '管理員已新增');
      dialogVisible.value = false;
      await loadList();
    } finally { submitting.value = false; }
  }
  async function toggleStatus(row: AdminAccount) {
    if (Number(row.id) === 1) return;
    const next = row.status === 1 ? 0 : 1;
    await updateAdminAccountStatus(row.id, next);
    ElMessage.success(next ? '管理員已啟用' : '管理員已停用');
    await loadList();
  }
  async function toggleCrypto(row: AdminAccount) {
    if (Number(row.id) === 1) return;
    await ElMessageBox.confirm(
      row.crypto_enabled ? '關閉後該管理員將無法查看或操作數字貨幣業務，餘額與歷史訂單不會刪除。' : '確認開啓該管理員的數字貨幣業務？',
      '數字貨幣業務',
      { type: 'warning', confirmButtonText: '確認', cancelButtonText: '取消' },
    );
    await updateAdminCryptoStatus(row.id, row.crypto_enabled ? 0 : 1);
    ElMessage.success(row.crypto_enabled ? '數字貨幣業務已關閉' : '數字貨幣業務已開啓');
    if (String(row.id) === authStore.userInfo?.id) await authStore.refreshCurrentAdmin();
    await loadList();
  }
  const { twoFactorBusy, disableTwoFactor } = useDisableAccountTwoFactor('admin', loadList);

  watch(page, () => void loadList());
  watch(limit, () => { if (page.value !== 1) page.value = 1; else void loadList(); });
  onMounted(loadList);
  return { list, loading, submitting, page, limit, total, keyword, status, dialogVisible, editing, passwordOnly, search, reset, openCreate, openEdit, openOwnPassword, submit, toggleStatus, toggleCrypto, twoFactorBusy, disableTwoFactor };
}
