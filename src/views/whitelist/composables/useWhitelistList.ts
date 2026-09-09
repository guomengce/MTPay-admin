import type { CsvFilters } from '@/api/modules/csvExport';
import { useListQueryState } from '@/composables/useListQueryState';
import { toRefs } from 'vue';
/** 管理端白名單列表：真實後端分頁，不做本地假分頁或虛構篩選。 */
import { reactive, ref } from 'vue';

import { fetchWhitelistList } from '@/api/modules/whitelist';
import type { WhitelistEntityType, WhitelistRole } from '@/api/modules/whitelist';
import type { WhitelistStatus } from '@/api/modules/whitelist';
import type { WhitelistRow } from './mapper';
import { toWhitelistRow } from './mapper';

export interface WhitelistQuery {
  keyword: string;
  role?: WhitelistRole;
  entity_type?: WhitelistEntityType;
  status?: WhitelistStatus;
}

export function useWhitelistList() {
  const loading = ref(false);
  const exportFilters = ref<CsvFilters | null>(null);
  const list = ref<WhitelistRow[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(15);
  const query = reactive<WhitelistQuery>({ keyword: '', role: undefined, entity_type: undefined, status: undefined });

  const saveListQuery = useListQueryState({ ...toRefs(query), page, limit }, ["status","role","entity_type"]);

  async function loadList() {
    const filters = { ...query };
    await saveListQuery();
    loading.value = true;
    try {
      const result = await fetchWhitelistList({
        page: page.value,
        limit: limit.value,
        keyword: filters.keyword.trim() || undefined,
        role: filters.role,
        entity_type: filters.entity_type,
        status: filters.status,
      });
      list.value = result.data.map(toWhitelistRow);
      total.value = result.total;
      exportFilters.value = filters;
      page.value = result.current_page;
      limit.value = result.per_page;
    } finally {
      loading.value = false;
    }
  }

  function search() {
    page.value = 1;
    void loadList();
  }

  function reset() {
    Object.assign(query, { keyword: '', role: undefined, entity_type: undefined, status: undefined });
    page.value = 1;
    void loadList();
  }

  function setPage(value: number) {
    page.value = value;
    void loadList();
  }

  function setLimit(value: number) {
    limit.value = value;
    page.value = 1;
    void loadList();
  }

  return { exportFilters, loading, list, total, page, limit, query, loadList, search, reset, setPage, setLimit };
}
