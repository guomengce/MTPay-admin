import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchTransactionInfo, type TransactionInfoResult } from '@/api/modules/transaction';

export function useManualAdjustment() {
  const route = useRoute();
  const loading = ref(false);
  const info = ref<TransactionInfoResult | null>(null);
  const error = ref('');
  let version = 0;
  async function load() {
    const current = ++version;
    const type = route.params.type;
    const id = Number(route.params.id);
    info.value = null;
    error.value = '';
    if ((type !== 'manual_increase' && type !== 'manual_decrease') || !Number.isSafeInteger(id) || id <= 0) {
      error.value = '无效的调账记录';
      return;
    }
    loading.value = true;
    try {
      const result = await fetchTransactionInfo({ business_type: type, business_id: id });
      if (current !== version) return;
      if (!result?.transaction || !result.detail || result.transaction.business_type !== type) throw new Error('Invalid adjustment');
      info.value = result;
    } catch {
      if (current === version) error.value = '读取调账详情失败';
    } finally {
      if (current === version) loading.value = false;
    }
  }
  onMounted(load);
  onBeforeUnmount(() => { version++; });
  return { loading, info, error, load };
}
