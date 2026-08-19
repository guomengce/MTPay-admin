import { ref } from 'vue';
import {
  fetchDepositDetail,
  reviewDeposit,
  type DepositOrderDetail,
  type ReviewDepositPayload,
} from '@/api/modules/deposit';

export function useDepositDetail() {
  const loading = ref(false);
  const reviewing = ref(false);
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

  async function submitReview(payload: ReviewDepositPayload) {
    reviewing.value = true;
    try {
      detail.value = await reviewDeposit(payload);
      return detail.value;
    } finally {
      reviewing.value = false;
    }
  }

  return { loading, reviewing, detail, loadDetail, submitReview };
}
