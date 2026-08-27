import { ref } from 'vue';
import {
  fetchDepositDetail,
  type DepositOrderDetail,
} from '@/api/modules/deposit';

export function useDepositDetail() {
  const loading = ref(false);
  const detail = ref<DepositOrderDetail | null>(null);

  async function loadDetail(id: number) {
    loading.value = true;
    try {
      detail.value = await fetchDepositDetail(id);
      return detail.value;
    } finally {
      loading.value = false;
    }
  }

  return { loading, detail, loadDetail };
}
