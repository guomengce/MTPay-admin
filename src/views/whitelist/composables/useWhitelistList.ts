/** 管理端白名单列表：真实后端分页，不做本地假分页或虚构筛选。 */
import { reactive, ref } from 'vue';

import { fetchWhitelistList } from '@/api/modules/whitelist';
import type { WhitelistEntityType, WhitelistRole } from '@/api/modules/whitelist';
import type { WhitelistRow } from './mapper';
import { toWhitelistRow } from './mapper';

export interface WhitelistQuery {
  keyword: string;
  role?: WhitelistRole;
  entity_type?: WhitelistEntityType;
}

export function useWhitelistList() {
  const loading = ref(false);
  const list = ref<WhitelistRow[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(15);
  const query = reactive<WhitelistQuery>({ keyword: '', role: undefined, entity_type: undefined });

  async function loadList() {
    loading.value = true;
    try {
      const result = await fetchWhitelistList({
        page: page.value,
        limit: limit.value,
        keyword: query.keyword.trim() || undefined,
        role: query.role,
        entity_type: query.entity_type,
      });
      list.value = result.data.map(toWhitelistRow);
      total.value = result.total;
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
    Object.assign(query, { keyword: '', role: undefined, entity_type: undefined });
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

  return { loading, list, total, page, limit, query, loadList, search, reset, setPage, setLimit };
}
