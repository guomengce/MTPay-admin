import { useListQueryState } from '@/composables/useListQueryState';
import { onMounted, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  addCurrency,
  editCurrencyStatus,
  getCurrencyList,
  type AddCurrencyPayload,
  type CurrencyItem,
  type CurrencyListParams,
  type CurrencyStatus,
} from '@/api/modules/currency';

export function useCurrencyManagement() {
  const list = ref<CurrencyItem[]>([]);
  const loading = ref(false);
  const adding = ref(false);
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

  async function changeStatus(row: CurrencyItem) {
    const nextStatus: CurrencyStatus = row.status === 1 ? 0 : 1;
    const verb = nextStatus === 1 ? '啓用' : '禁用';
    try {
      await ElMessageBox.confirm(`確認要${verb}「${row.name}（${row.code}）」嗎？`, `${verb}幣種`, {
        type: nextStatus === 1 ? 'info' : 'warning',
        confirmButtonText: `確認${verb}`,
        cancelButtonText: '取消',
      });
    } catch {
      return;
    }
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
    list, loading, adding, page, limit, total, keyword, status,
    search, resetFilters, createCurrency, changeStatus,
  };
}
