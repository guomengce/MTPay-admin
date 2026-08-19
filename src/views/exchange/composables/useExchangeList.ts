import { onMounted, ref, watch } from 'vue';
import { fetchExchangeList } from '@/api/modules/exchange';
import type { ExchangeRow } from './mapper';
import { toExchangeRow } from './mapper';

/** 兑换审核列表：真实后端分页，不做前端假分页。 */
export function useExchangeList() {
  const loading = ref(false);
  const list = ref<ExchangeRow[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(15);

  async function loadList() {
    loading.value = true;
    try {
      const result = await fetchExchangeList({ page: page.value, limit: limit.value });
      list.value = result.data.map(toExchangeRow);
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

  return { loading, list, total, page, limit, loadList };
}
