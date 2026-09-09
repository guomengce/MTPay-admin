<template>
  <section class="admin-page withdrawal-detail-page">
    <template v-if="detail">
      <div class="withdrawal-detail-page__toolbar">
        <el-button plain :icon="Back" @click="goBack">返回</el-button>
        <div
          v-if="heroActions.length || detail.status === 3"
          class="withdrawal-detail-page__actions"
        >
          <el-button
            v-if="detail.status === 3 && canOperate('fiatWithdrawal.cancel')"
            type="danger"
            plain
            :loading="cancelling"
            :disabled="submitting || cancelling"
            @click="cancelCompleted(toWithdrawalRow(detail))"
            >取消法幣出金</el-button
          >
          <el-button
            v-for="action in heroActions"
            :key="action.emitName"
            :type="action.type"
            :icon="action.icon"
            plain
            :loading="submitting"
            :disabled="submitting || cancelling"
            @click="openAction(action.emitName, action.paymentResult)"
            >{{ action.label }}</el-button
          >
        </div>
      </div>

      <OrderHeader :detail="detail" />

      <RiskAssessment
        v-if="detail.risk"
        :risk="detail.risk"
        :can-view-detail="canAccessMenu('riskCases')"
        @view="router.push(`/risk/detail/${$event}`)"
      />

      <div class="withdrawal-detail-page__workspace">
        <PartyPanel
          :detail="detail"
          :payer="detail.payer"
          :payee="detail.payee"
          :payer-subject-fields="payerSubjectFields"
          :payee-bank-fields="payeeBankFields"
          :payee-subject-fields="payeeSubjectFields"
        />

        <div class="withdrawal-detail-page__supporting">
          <div class="withdrawal-detail-page__supporting-left">
            <AgentCard :agent-company="detail.user.company_name" :agent-email="detail.user.email" />
            <ResultPanel :review-fields="reviewFields" :payment-fields="paymentFields" />
          </div>
          <Timeline :timeline-items="timelineItems" :file-rounds="fileRounds" />
        </div>
      </div>

      <WithdrawalActionDialog
        v-model="dialogVisible"
        :row="actionRow"
        :mode="actionMode"
        :initial-result="initialResult"
        :submitting="submitting"
        :uploading="uploading"
        :upload-file="uploadFile"
        @submit="handleAction"
      />
    </template>
    <el-empty v-else-if="!loading" description="未找到法幣出金訂單" />
  </section>
</template>

<script setup lang="ts">
/** 管理端 法幣出金詳情：頁面結構和可用動作完全由詳情接口字段決定。 */
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import {
  Back,
  CircleCheck,
  CircleClose,
  CreditCard,
  DocumentAdd,
  Upload,
} from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { usePageLoading } from '@/composables/usePageLoading';
import { usePermission } from '@/composables/usePermission';

import OrderHeader from './components/OrderHeader.vue';
import AgentCard from './components/AgentCard.vue';
import PartyPanel from './components/PartyPanel.vue';
import RiskAssessment from './components/RiskAssessment.vue';
import ResultPanel from './components/ResultPanel.vue';
import Timeline from './components/Timeline.vue';
import WithdrawalActionDialog from '../components/WithdrawalActionDialog.vue';
import type { WithdrawalActionMode } from '../components/WithdrawalActionDialog.vue';
import { toWithdrawalRow } from '../composables/mapper';
import { useCancelCompletedWithdrawal } from '../composables/useCancelCompletedWithdrawal';
import { useWithdrawalDetail } from '../composables/useWithdrawalDetail';
import { useWithdrawalDetailView } from '../composables/useWithdrawalDetailView';

const route = useRoute();
const router = useRouter();
const { canAccessMenu, canOperate } = usePermission();
const {
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
} = useWithdrawalDetail();
usePageLoading(loading);
const { cancelling, cancelCompleted } = useCancelCompletedWithdrawal(async () => {
  if (detail.value) await loadDetail(detail.value.id);
});
const {
  payeeBankFields,
  payerSubjectFields,
  payeeSubjectFields,
  reviewFields,
  paymentFields,
  timelineItems,
  fileRounds,
} = useWithdrawalDetailView(detail);

interface DetailAction {
  label: string;
  icon: unknown;
  type: 'primary' | 'warning' | 'danger';
  emitName: WithdrawalActionMode;
  paymentResult?: 'complete' | 'fail';
}

const heroActions = computed<DetailAction[]>(() => {
  const current = detail.value;
  if (!current || [3, 4, 6].includes(current.risk?.risk_status ?? 0)) return [];
  const available = current.available_actions;
  if (current.status === 0) {
    const actions: DetailAction[] = [];
    if (canOperate('fiatWithdrawal.review') && available?.admin_can_approve !== false) {
      actions.push({ label: '審核通過', icon: CircleCheck, type: 'primary', emitName: 'approve' });
    }
    if (
      canOperate('fiatWithdrawal.supplement') &&
      available?.admin_can_request_supplement !== false
    ) {
      actions.push({
        label: '要求補件',
        icon: DocumentAdd,
        type: 'warning',
        emitName: 'supplement',
      });
    }
    if (canOperate('fiatWithdrawal.review') && available?.admin_can_reject !== false) {
      actions.push({ label: '審核拒絕', icon: CircleClose, type: 'danger', emitName: 'reject' });
    }
    return actions;
  }
  if (
    current.status === 1 &&
    canOperate('fiatWithdrawal.review') &&
    available?.admin_can_reject !== false
  ) {
    return [{ label: '審核拒絕', icon: CircleClose, type: 'danger', emitName: 'reject' }];
  }
  if (
    current.status === 2 &&
    canOperate('fiatWithdrawal.payment') &&
    available?.admin_can_process_payment !== false
  ) {
    return [
      {
        label: '付款完成',
        icon: CreditCard,
        type: 'primary',
        emitName: 'payment',
        paymentResult: 'complete',
      },
      {
        label: '付款失敗',
        icon: CircleClose,
        type: 'danger',
        emitName: 'payment',
        paymentResult: 'fail',
      },
    ];
  }
  if (
    current.status === 3 &&
    canOperate('fiatWithdrawal.appendProof') &&
    available?.admin_can_append_payment_files !== false
  ) {
    return [{ label: '追加付款憑證', icon: Upload, type: 'primary', emitName: 'append' }];
  }
  return [];
});

const actionRow = computed(() => (detail.value ? toWithdrawalRow(detail.value) : null));
const dialogVisible = ref(false);
const actionMode = ref<WithdrawalActionMode>('approve');
const initialResult = ref<'complete' | 'fail' | undefined>();

function goBack() {
  router.go(-1);
}
function openAction(mode: WithdrawalActionMode, paymentResult?: 'complete' | 'fail') {
  actionMode.value = mode;
  initialResult.value = paymentResult;
  dialogVisible.value = true;
}

async function handleAction(payload: {
  mode: WithdrawalActionMode;
  message?: string;
  result?: 'complete' | 'fail';
  failureReason?: string;
  fileIds: number[];
}) {
  if (!detail.value) return;
  const id = detail.value.id;
  try {
    if (payload.mode === 'supplement') {
      await requestSupplement({ id, message: payload.message! });
      ElMessage.success('補件要求已發送');
    } else if (payload.mode === 'approve' || payload.mode === 'reject') {
      await submitReview({ id, decision: payload.mode, review_note: payload.message });
      ElMessage.success(
        payload.mode === 'approve'
          ? '法幣出金審核已通過，進入付款處理'
          : '法幣出金已駁回，凍結資金已釋放',
      );
    } else if (payload.mode === 'payment') {
      const fileIds = payload.result === 'complete' ? payload.fileIds : [];
      await submitPayment({
        id,
        result: payload.result!,
        file_ids: fileIds.length ? fileIds : undefined,
        failure_reason: payload.result === 'fail' ? payload.failureReason : undefined,
      });
      ElMessage.success(
        payload.result === 'complete' ? '付款完成已登記' : '付款失敗已登記，凍結資金已釋放',
      );
    } else {
      await appendPaymentFiles({ id, file_ids: payload.fileIds, message: payload.message });
      ElMessage.success('付款憑證已追加');
    }
    dialogVisible.value = false;
    await loadDetail(id);
  } catch {
    /* 後端可能因風控狀態或處理人衝突拒絕操作，立即同步最新詳情。 */
    await loadDetail(id);
  }
}

onMounted(() => {
  const id = Number(route.params.id);
  if (Number.isInteger(id) && id > 0) void loadDetail(id);
});
</script>

<style scoped lang="scss">
.withdrawal-detail-page {
  gap: 20px;

  &__toolbar {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__actions {
    display: flex;
    min-width: 0;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 10px;

    :deep(.el-button + .el-button) {
      margin-left: 0;
    }
  }

  &__workspace {
    display: grid;
    min-width: 0;
    align-items: start;
    gap: 20px;
  }

  &__supporting {
    display: grid;
    min-width: 0;
    align-items: start;
    grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.2fr);
    gap: 20px;
  }

  &__supporting-left {
    display: grid;
    min-width: 0;
    align-content: start;
    gap: 20px;
  }

  :deep(.admin-panel) {
    border-radius: 15px;
    box-shadow: 0 8px 24px rgb(20 46 78 / 5%);
  }

  :deep(.admin-panel__header) {
    padding: 16px 18px;
  }

  :deep(.admin-panel__title) {
    gap: 12px;
  }

  :deep(.admin-panel__icon) {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
    border-radius: 10px;
    font-size: 19px;
  }

  :deep(.admin-panel h2) {
    font-size: 16px;
  }

  :deep(.admin-panel__header p) {
    margin-top: 3px;
    font-size: 12px;
  }
}

@include narrow {
  .withdrawal-detail-page__supporting {
    grid-template-columns: 1fr;
  }
}

@include mobile {
  .withdrawal-detail-page {
    gap: 16px;
  }
  .withdrawal-detail-page__supporting {
    grid-template-columns: 1fr;
  }
  .withdrawal-detail-page__toolbar {
    align-items: flex-start;
    flex-direction: column;

    > :deep(.el-button) {
      width: fit-content;
    }
  }
  .withdrawal-detail-page__actions {
    width: 100%;
    flex-wrap: nowrap;

    :deep(.el-button) {
      min-width: 0;
      flex: 1 1 0;
      margin-left: 0;
      padding-right: 8px;
      padding-left: 8px;
    }

    :deep(.el-button:only-child) {
      flex: 0 0 auto;
    }
  }
  .withdrawal-detail-page__workspace,
  .withdrawal-detail-page__supporting,
  .withdrawal-detail-page__supporting-left {
    gap: 14px;
  }
}
</style>
