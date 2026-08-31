import { useListQueryState } from '@/composables/useListQueryState';
import { useDisableAccountTwoFactor } from '@/composables/useDisableAccountTwoFactor';
import { onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import {
  createAdminAccount,
  fetchAdminAccountInfo,
  fetchAdminAccountList,
  updateAdminAccount,
  updateAdminAccountStatus,
  type AdminAccount,
  type AdminAccountPayload,
} from '@/api/modules/adminAccount';

export function useAdminManagement() {
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
  function openCreate() { editing.value = null; dialogVisible.value = true; }
  async function openEdit(row: AdminAccount) {
    const info = await fetchAdminAccountInfo(row.id);
    editing.value = { ...row, ...info };
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
    const next = row.status === 1 ? 0 : 1;
    await updateAdminAccountStatus(row.id, next);
    ElMessage.success(next ? '管理員已啟用' : '管理員已停用');
    await loadList();
  }
  const { twoFactorBusy, disableTwoFactor } = useDisableAccountTwoFactor('admin', loadList);

  watch(page, () => void loadList());
  watch(limit, () => { if (page.value !== 1) page.value = 1; else void loadList(); });
  onMounted(loadList);
  return { list, loading, submitting, page, limit, total, keyword, status, dialogVisible, editing, search, reset, openCreate, openEdit, submit, toggleStatus, twoFactorBusy, disableTwoFactor };
}
