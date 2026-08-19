import { onMounted, ref, watch } from 'vue';
import { fetchAgentList, type AgentAccount } from '@/api/modules/agent';

/** 代理列表：负责后端分页、关键字搜索、状态筛选及页面初始化加载。 */
export function useAgentList() {
  const agents = ref<AgentAccount[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const limit = ref(15);
  const total = ref(0);
  const keyword = ref('');
  const status = ref<number>();

  /** 请求真实代理分页列表，不进行前端假分页或假数据回退。 */
  async function loadAgents() {
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
