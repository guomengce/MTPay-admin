/** 管理端法幣出金詳情：加載詳情並執行審核、補件、付款和追加憑證動作。 */
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
  WithdrawalFile,
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

  async function uploadFile(file: File): Promise<WithdrawalFile> {
    uploading.value=true;
    try{const formData=new FormData();formData.append('file',file);return await uploadWithdrawalFile(formData)}finally{uploading.value=false}
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
    uploadFile,
  };
}
