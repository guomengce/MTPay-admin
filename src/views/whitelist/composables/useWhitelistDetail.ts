/** 管理端白名单详情与审核操作。 */
import { ref } from 'vue';

import {
  fetchWhitelistDetail,
  requestWhitelistSupplement,
  reviewWhitelist,
  type RequestWhitelistSupplementPayload,
  type ReviewWhitelistPayload,
  type WhitelistDetail,
} from '@/api/modules/whitelist';

export function useWhitelistDetail() {
  const loading = ref(false);
  const submitting = ref(false);
  const detail = ref<WhitelistDetail | null>(null);

  async function loadDetail(id: number) {
    loading.value = true;
    try {
      detail.value = await fetchWhitelistDetail(id);
      return detail.value;
    } finally {
      loading.value = false;
    }
  }

  async function submitReview(payload: ReviewWhitelistPayload) {
    submitting.value = true;
    try {
      detail.value = await reviewWhitelist(payload);
      return detail.value;
    } finally {
      submitting.value = false;
    }
  }

  async function requestSupplement(payload: RequestWhitelistSupplementPayload) {
    submitting.value = true;
    try {
      detail.value = await requestWhitelistSupplement(payload);
      return detail.value;
    } finally {
      submitting.value = false;
    }
  }

  return { loading, submitting, detail, loadDetail, submitReview, requestSupplement };
}
