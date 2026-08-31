import { useListQueryState } from '@/composables/useListQueryState';
import { toRefs } from 'vue';
import { reactive, ref } from 'vue';

import { fetchContactReservationList } from '@/api/modules/reservation';
import { toReservationRow, type ReservationRow } from './mapper';

export interface ReservationQuery {
  keyword: string;
  started_at: string;
  ended_at: string;
}

export function useReservationList() {
  const loading = ref(false);
  const list = ref<ReservationRow[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(15);
  const query = reactive<ReservationQuery>({ keyword: '', started_at: '', ended_at: '' });

  const saveListQuery = useListQueryState({ ...toRefs(query), page, limit }, ["status","role","entity_type"]);

  async function loadList() {
    await saveListQuery();
    loading.value = true;
    try {
      const result = await fetchContactReservationList({
        page: page.value,
        limit: limit.value,
        keyword: query.keyword.trim() || undefined,
        started_at: query.started_at || undefined,
        ended_at: query.ended_at || undefined,
      });
      list.value = (result.data ?? []).map(toReservationRow);
      total.value = result.total ?? 0;
      page.value = result.current_page ?? page.value;
      limit.value = result.per_page ?? limit.value;
    } finally {
      loading.value = false;
    }
  }

  function search() { page.value = 1; void loadList(); }
  function reset() {
    Object.assign(query, { keyword: '', started_at: '', ended_at: '' });
    page.value = 1;
    void loadList();
  }
  function setPage(value: number) { page.value = value; void loadList(); }
  function setLimit(value: number) { limit.value = value; page.value = 1; void loadList(); }

  return { loading, list, total, page, limit, query, loadList, search, reset, setPage, setLimit };
}
