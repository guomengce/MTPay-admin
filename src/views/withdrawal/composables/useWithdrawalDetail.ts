/** 管理端出金详情：加载详情并执行审核、补件、付款和追加凭证动作。 */
import { ref } from 'vue';

import {
  appendWithdrawalPaymentFiles,
  fetchWithdrawalDetail,
  processWithdrawalPayment,
  requestWithdrawalSupplement,
  reviewWithdrawal,
  uploadWithdrawalFile,
} from '@/api/modules/withdrawal';
import type {
  AppendWithdrawalPaymentFilesPayload,
  ProcessWithdrawalPaymentPayload,
  RequestWithdrawalSupplementPayload,
  ReviewWithdrawalPayload,
  WithdrawalOrderDetail,
} from '@/api/modules/withdrawal';

export function useWithdrawalDetail() {
  const detail = ref<WithdrawalOrderDetail | null>(null);
  const loading = ref(false);
  const submitting = ref(false);
  const uploading = ref(false);

  async function loadDetail(id: number) {
    loading.value = true;
    try {
      detail.value = await fetchWithdrawalDetail(id);
      return detail.value;
    } finally {
      loading.value = false;
    }
  }

  async function execute(
    request: () => Promise<WithdrawalOrderDetail>,
  ): Promise<WithdrawalOrderDetail> {
    submitting.value = true;
    try {
      detail.value = await request();
      return detail.value;
    } finally {
      submitting.value = false;
    }
  }

  function requestSupplement(payload: RequestWithdrawalSupplementPayload) {
    return execute(() => requestWithdrawalSupplement(payload));
  }

  function submitReview(payload: ReviewWithdrawalPayload) {
    return execute(() => reviewWithdrawal(payload));
  }

  function submitPayment(payload: ProcessWithdrawalPaymentPayload) {
    return execute(() => processWithdrawalPayment(payload));
  }

  function appendPaymentFiles(payload: AppendWithdrawalPaymentFilesPayload) {
    return execute(() => appendWithdrawalPaymentFiles(payload));
  }

  /** 每个文件单独上传，全部成功后再提交绑定 file_id 的业务动作。 */
  async function uploadFiles(files: File[]) {
    uploading.value = true;
    try {
      const ids: number[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const uploaded = await uploadWithdrawalFile(formData);
        ids.push(uploaded.file_id);
      }
      return ids;
    } finally {
      uploading.value = false;
    }
  }

  return {
    detail,
    loading,
    submitting,
    uploading,
    loadDetail,
    requestSupplement,
    submitReview,
    submitPayment,
    appendPaymentFiles,
    uploadFiles,
  };
}
