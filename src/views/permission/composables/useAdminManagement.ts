import { useListQueryState } from '@/composables/useListQueryState';
import { useDisableAccountTwoFactor } from '@/composables/useDisableAccountTwoFactor';
import { h, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
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
import { confirmAdminAction } from '@/utils/adminMessageBox';

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
    const action = next === 1 ? '啟用' : '停用';
    const confirmed = await confirmAdminAction({
      title: `${action}管理員`,
      message: h('span', [
        `確認${action}管理員「`,
        h('strong', { class: 'admin-message-box__variable' }, row.name || row.email),
        '」嗎？',
      ]),
      confirmText: `確認${action}`,
    });
    if (!confirmed) return;
    await updateAdminAccountStatus(row.id, next);
    ElMessage.success(`管理員已${action}`);
    await loadList();
  }
  async function toggleCrypto(row: AdminAccount) {
    if (Number(row.id) === 1) return;
    const isDisabling = row.crypto_enabled;
    const confirmed = await confirmAdminAction({
      title: isDisabling ? '關閉數字貨幣業務' : '開啓數字貨幣業務',
      message: h('span', [
        `確認${isDisabling ? '關閉' : '開啓'}管理員「`,
        h('strong', { class: 'admin-message-box__variable' }, row.name || row.email),
        '」的數字貨幣業務嗎？',
      ]),
      confirmText: isDisabling ? '確認關閉' : '確認開啓',
    });
    if (!confirmed) return;
    await updateAdminCryptoStatus(row.id, isDisabling ? 0 : 1);
    ElMessage.success(isDisabling ? '數字貨幣業務已關閉' : '數字貨幣業務已開啓');
    if (String(row.id) === authStore.userInfo?.id) await authStore.refreshCurrentAdmin();
    await loadList();
  }
  const { twoFactorBusy, disableTwoFactor } = useDisableAccountTwoFactor('admin', loadList);

  watch(page, () => void loadList());
  watch(limit, () => { if (page.value !== 1) page.value = 1; else void loadList(); });
  onMounted(loadList);
  return { list, loading, submitting, page, limit, total, keyword, status, dialogVisible, editing, passwordOnly, search, reset, openCreate, openEdit, openOwnPassword, submit, toggleStatus, toggleCrypto, twoFactorBusy, disableTwoFactor };
}
