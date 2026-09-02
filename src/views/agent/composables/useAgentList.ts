import { useListQueryState } from '@/composables/useListQueryState';
import { onMounted, ref, watch } from 'vue';
import { fetchAgentList, type AgentAccount } from '@/api/modules/agent';

/** 代理列表：負責後端分頁、關鍵字搜索、狀態篩選及頁面初始化加載。 */
export function useAgentList() {
  const agents = ref<AgentAccount[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const limit = ref(15);
  const total = ref(0);
  const keyword = ref('');
  const status = ref<number>();

  /** 請求真實代理分頁列表，不進行前端假分頁或假數據回退。 */
  const saveListQuery = useListQueryState({ keyword, status, page, limit }, ["status"]);

  async function loadAgents() {
    await saveListQuery();
    loading.value = true;
    try {
      const result = await fetchAgentList({
        page: page.value,
        limit: limit.value,
        keyword: keyword.value.trim() || undefined,
        status: status.value,
      });
      agents.value = result.data;
      total.value = result.total;
    } finally {
      loading.value = false;
    }
  }

  function search() {
    if (page.value !== 1) page.value = 1;
    else void loadAgents();
  }

  function resetFilters() {
    keyword.value = '';
    status.value = undefined;
    search();
  }

  watch(page, () => void loadAgents());
  watch(limit, () => {
    if (page.value !== 1) page.value = 1;
    else void loadAgents();
  });
  onMounted(loadAgents);

  return { agents, loading, page, limit, total, keyword, status, loadAgents, search, resetFilters };
}
