import { onMounted, reactive, ref, watch } from 'vue';
import { fetchDepositList } from '@/api/modules/deposit';
import type { DepositStatus } from '@/api/modules/deposit';
import type { DepositRow } from './mapper';
import { toDepositRow } from './mapper';

/** 入金审核列表：真实后端分页，不做前端假分页。 */
export function useDepositList() {
  const loading = ref(false);
  const list = ref<DepositRow[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(15);
  const query = reactive({
    status: undefined as DepositStatus | undefined,
    keyword: '',
    started_at: '',
    ended_at: '',
  });

  async function loadList() {
    loading.value = true;
    try {
      const result = await fetchDepositList({
        page: page.value,
        limit: limit.value,
        status: query.status,
        keyword: query.keyword.trim() || undefined,
        started_at: query.started_at || undefined,
        ended_at: query.ended_at || undefined,
      });
      list.value = result.data.map(toDepositRow);
      total.value = result.total;
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
    Object.assign(query, { status: undefined, keyword: '', started_at: '', ended_at: '' });
    search();
  }

  return { loading, list, total, page, limit, query, loadList, search, reset };
}
