/** 管理端白名單詳情與審核操作。 */
import { ElMessage } from 'element-plus';
import { h, ref } from 'vue';

import {
  editWhitelistStatus,
  fetchWhitelistDetail,
  requestWhitelistSupplement,
  reviewWhitelist,
  type EditWhitelistStatusPayload,
  type RequestWhitelistSupplementPayload,
  type ReviewWhitelistPayload,
  type WhitelistDetail,
} from '@/api/modules/whitelist';
import type { WhitelistRow } from './mapper';
import { confirmAdminAction } from '@/utils/adminMessageBox';

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

  async function submitStatus(payload: EditWhitelistStatusPayload) {
    submitting.value = true;
    try {
      detail.value = await editWhitelistStatus(payload);
      return detail.value;
    } finally {
      submitting.value = false;
    }
  }

  async function toggleStatus(row: WhitelistRow, refresh?: () => Promise<void>) {
    if (row.statusCode !== 2 && row.statusCode !== 4) return;
    const nextStatus = row.statusCode === 2 ? 4 : 2;
    const action = nextStatus === 4 ? '停用' : '啟用';
    const confirmed = await confirmAdminAction({
      title: `${action}白名單`,
      message: h('span', [
        `確認${action}白名單「`,
        h('strong', { class: 'admin-message-box__variable' }, row.subject || row.id),
        '」嗎？',
      ]),
      confirmText: `確認${action}`,
    });
    if (!confirmed) return;
    await submitStatus({ id: row.businessId, status: nextStatus });
    ElMessage.success(`白名單已${action}`);
    if (refresh) await refresh();
  }

  return { loading, submitting, detail, loadDetail, submitReview, requestSupplement, submitStatus, toggleStatus };
}
