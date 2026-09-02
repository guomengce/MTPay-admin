import type { CsvFilters } from '@/api/modules/csvExport';
import { useListQueryState } from '@/composables/useListQueryState';
import { toRefs } from 'vue';
import { onMounted, reactive, ref, watch } from 'vue';
import { fetchDepositList } from '@/api/modules/deposit';
import type { DepositRow } from './mapper';
import { toDepositRow } from './mapper';

/** 入金記錄列表：真實後端分頁，不做前端假分頁。 */
export function useDepositList() {
  const loading = ref(false);
  const exportFilters = ref<CsvFilters | null>(null);
  const list = ref<DepositRow[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(15);
  const query = reactive({
    keyword: '',
    started_at: '',
    ended_at: '',
  });

  const saveListQuery = useListQueryState({ ...toRefs(query), page, limit }, ["status","role","entity_type"]);

  async function loadList() {
    const filters = { ...query };
    await saveListQuery();
    loading.value = true;
    try {
      const result = await fetchDepositList({
        page: page.value,
        limit: limit.value,
        keyword: filters.keyword.trim() || undefined,
        started_at: filters.started_at || undefined,
        ended_at: filters.ended_at || undefined,
      });
      list.value = result.data.map(toDepositRow);
      total.value = result.total;
      exportFilters.value = filters;
    } finally {
      loading.value = false;
    }
  }

  watch(page, () => void loadList());
  watch(limit, () => {
    if (page.value !== 1) page.value = 1;
    else void loadList();
  });
  onMounted(loadList);

  function search() {
    if (page.value !== 1) page.value = 1;
    else void loadList();
  }

  function reset() {
    Object.assign(query, { keyword: '', started_at: '', ended_at: '' });
    search();
  }

  return { exportFilters, loading, list, total, page, limit, query, loadList, search, reset };
}
