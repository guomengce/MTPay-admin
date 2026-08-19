import { ref } from 'vue';
import {
  fetchExchangeDetail,
  reviewExchange,
  type ExchangeOrderDetail,
  type ReviewExchangePayload,
} from '@/api/modules/exchange';

export function useExchangeDetail() {
  const loading = ref(false);
  const reviewing = ref(false);
  const detail = ref<ExchangeOrderDetail | null>(null);

  async function loadDetail(id: number) {
    loading.value = true;
    try {
      detail.value = await fetchExchangeDetail(id);
      return detail.value;
    } finally {
      loading.value = false;
    }
  }

  async function submitReview(payload: ReviewExchangePayload) {
    reviewing.value = true;
    try {
      detail.value = await reviewExchange(payload);
      return detail.value;
    } finally {
      reviewing.value = false;
    }
  }

  return { loading, reviewing, detail, loadDetail, submitReview };
}
