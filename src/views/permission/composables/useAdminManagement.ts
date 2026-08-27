import { onMounted, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  createAdminAccount,
  deleteAdminAccount,
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

  async function loadList() {
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
  async function remove(row: AdminAccount) {
    await ElMessageBox.confirm(`確定刪除管理員「${row.name}」？此操作無法復原。`, '刪除管理員', { type: 'warning', confirmButtonText: '確認刪除', cancelButtonText: '取消' });
    await deleteAdminAccount(row.id);
    ElMessage.success('管理員已刪除');
    await loadList();
  }

  watch(page, () => void loadList());
  watch(limit, () => { if (page.value !== 1) page.value = 1; else void loadList(); });
  onMounted(loadList);
  return { list, loading, submitting, page, limit, total, keyword, status, dialogVisible, editing, search, reset, openCreate, openEdit, submit, toggleStatus, remove };
}
