import { useListQueryState } from '@/composables/useListQueryState';
import { h, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import {
  addCurrency,
  editCurrency,
  editCurrencyStatus,
  getCurrencyList,
  type AddCurrencyPayload,
  type CurrencyItem,
  type EditCurrencyPayload,
  type CurrencyListParams,
  type CurrencyStatus,
} from '@/api/modules/currency';
import { confirmAdminAction } from '@/utils/adminMessageBox';

export function useCurrencyManagement() {
  const list = ref<CurrencyItem[]>([]);
  const loading = ref(false);
  const adding = ref(false);
  const editing = ref(false);
  const page = ref(1);
  const limit = ref(15);
  const total = ref(0);
  const keyword = ref('');
  const status = ref<CurrencyStatus>();

  const saveListQuery = useListQueryState({ keyword, status, page, limit }, ["status"]);

  async function loadList() {
    await saveListQuery();
    loading.value = true;
    try {
      const params: CurrencyListParams = { page: page.value, limit: limit.value };
      if (keyword.value.trim()) params.keyword = keyword.value.trim();
      if (status.value !== undefined) params.status = status.value;
      const result = await getCurrencyList(params);
      list.value = result.data;
      total.value = result.total;
    } finally {
      loading.value = false;
    }
  }

  function search() {
    if (page.value !== 1) page.value = 1;
    else void loadList();
  }

  function resetFilters() {
    keyword.value = '';
    status.value = undefined;
    search();
  }

  async function createCurrency(payload: AddCurrencyPayload) {
    adding.value = true;
    try {
      await addCurrency(payload);
      ElMessage.success('幣種新增成功');
      if (page.value !== 1) page.value = 1;
      else await loadList();
      return true;
    } finally {
      adding.value = false;
    }
  }

  async function updateCurrency(payload: EditCurrencyPayload) {
    editing.value = true;
    try {
      await editCurrency(payload);
      ElMessage.success('幣種修改成功');
      await loadList();
      return true;
    } finally {
      editing.value = false;
    }
  }
  async function changeStatus(row: CurrencyItem) {
    const nextStatus: CurrencyStatus = row.status === 1 ? 0 : 1;
    const verb = nextStatus === 1 ? '啓用' : '禁用';
    const confirmed = await confirmAdminAction({
      title: `${verb}幣種`,
      message: h('span', [
        `確認${verb}「`,
        h('strong', { class: 'admin-message-box__variable' }, `${row.name}（${row.code}）`),
        '」嗎？',
      ]),
      confirmText: `確認${verb}`,
    });
    if (!confirmed) return;
    await editCurrencyStatus({ id: row.id, status: nextStatus });
    ElMessage.success(`已${verb} ${row.code}`);
    await loadList();
  }

  watch(page, () => void loadList());
  watch(limit, () => {
    if (page.value !== 1) page.value = 1;
    else void loadList();
  });
  onMounted(loadList);

  return {
    list, loading, adding, editing, page, limit, total, keyword, status,
    search, resetFilters, createCurrency, updateCurrency, changeStatus,
  };
}
