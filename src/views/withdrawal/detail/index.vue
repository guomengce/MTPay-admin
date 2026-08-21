<template>
  <section v-loading="loading" class="admin-page withdrawal-detail-page">
    <template v-if="detail">
      <div class="withdrawal-detail-page__toolbar">
        <el-button plain :icon="Back" @click="goBack">返回出金列表</el-button>
        <div v-if="heroActions.length" class="withdrawal-detail-page__actions">
          <el-button
            v-for="action in heroActions"
            :key="action.emitName"
            :type="action.type"
            :icon="action.icon"
            @click="openAction(action.emitName)"
          >{{ action.label }}</el-button>
        </div>
      </div>

      <OrderHeader :detail="detail" />

      <div class="withdrawal-detail-page__workspace">
        <main class="withdrawal-detail-page__main">
          <SettlementCard :detail="detail" />

          <PartyPanel
            :payer="detail.payer"
            :payee="detail.payee"
            :payer-bank-fields="payerBankFields"
            :payer-subject-fields="payerSubjectFields"
            :payee-bank-fields="payeeBankFields"
            :payee-subject-fields="payeeSubjectFields"
            :party-type="partyType"
          />

          <AgentCard
            :agent-company="detail.user.company_name"
            :agent-code="detail.user.agent_code"
            :agent-email="detail.user.email"
          />

          <ResultPanel
            :review-fields="reviewFields"
            :payment-fields="paymentFields"
          />
        </main>

        <aside class="withdrawal-detail-page__aside">
          <Timeline :timeline-items="timelineItems" :file-rounds="fileRounds" />
        </aside>
      </div>

      <WithdrawalActionDialog
        v-model="dialogVisible"
        :row="actionRow"
        :mode="actionMode"
        :submitting="submitting"
        :uploading="uploading"
        :upload-file="uploadFile"
        @submit="handleAction"
      />
    </template>
    <el-empty v-else-if="!loading" description="未找到出金订单" />
  </section>
</template>

<script setup lang="ts">
/** 管理端 USD 出金详情：页面结构和可用动作完全由详情接口字段决定。 */
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

import OrderHeader from './components/OrderHeader.vue';
import SettlementCard from './components/SettlementCard.vue';
import AgentCard from './components/AgentCard.vue';
import PartyPanel from './components/PartyPanel.vue';
import ResultPanel from './components/ResultPanel.vue';
import Timeline from './components/Timeline.vue';
import WithdrawalActionDialog from '../components/WithdrawalActionDialog.vue';
import type { WithdrawalActionMode } from '../components/WithdrawalActionDialog.vue';
import { toWithdrawalRow } from '../composables/mapper';
import { useWithdrawalDetail } from '../composables/useWithdrawalDetail';
import { useWithdrawalDetailView } from '../composables/useWithdrawalDetailView';

const route = useRoute();
const router = useRouter();
const { detail, loading, submitting, uploading, loadDetail, requestSupplement, submitReview, submitPayment, appendPaymentFiles, uploadFile } = useWithdrawalDetail();
const { payerBankFields, payeeBankFields, payerSubjectFields, payeeSubjectFields, reviewFields, paymentFields, timelineItems, fileRounds, partyType } = useWithdrawalDetailView(detail);

interface DetailAction {
  label: string;
  icon: unknown;
  type: 'primary' | 'warning' | 'danger';
  emitName: WithdrawalActionMode;
}

const heroActions = computed<DetailAction[]>(() => {
  const status = detail.value?.status;
  if (status === 0) {
    return [
      { label: '审核通过', icon: CircleCheck, type: 'primary', emitName: 'approve' },
      { label: '要求补件', icon: DocumentAdd, type: 'warning', emitName: 'supplement' },
      { label: '审核拒绝', icon: CircleClose, type: 'danger', emitName: 'reject' },
    ];
  }
  if (status === 1) {
    return [{ label: '审核拒绝', icon: CircleClose, type: 'danger', emitName: 'reject' }];
  }
  if (status === 2) {
    return [{ label: '登记付款结果', icon: CreditCard, type: 'primary', emitName: 'payment' }];
  }
  if (status === 3) {
    return [{ label: '追加付款凭证', icon: Upload, type: 'primary', emitName: 'append' }];
  }
  return [];
});

const actionRow = computed(() => (detail.value ? toWithdrawalRow(detail.value) : null));
const dialogVisible = ref(false);
const actionMode = ref<WithdrawalActionMode>('approve');

function goBack() { void router.push('/withdrawal'); }
function openAction(mode: WithdrawalActionMode) { actionMode.value = mode; dialogVisible.value = true; }

async function handleAction(payload: { mode: WithdrawalActionMode; message?: string; result?: 'complete' | 'fail'; failureReason?: string; fileIds: number[] }) {
  if (!detail.value) return;
  const id = detail.value.id;
  try {
    if (payload.mode === 'supplement') {
      await requestSupplement({ id, message: payload.message! });
      ElMessage.success('补件要求已发送');
    } else if (payload.mode === 'approve' || payload.mode === 'reject') {
      await submitReview({ id, decision: payload.mode, review_note: payload.mode === 'reject' ? payload.message : undefined });
      ElMessage.success(payload.mode === 'approve' ? '出金审核已通过，进入付款处理' : '出金已驳回，冻结资金已释放');
    } else if (payload.mode === 'payment') {
      const fileIds = payload.result === 'complete' ? payload.fileIds : [];
      await submitPayment({ id, result: payload.result!, file_ids: fileIds.length ? fileIds : undefined, failure_reason: payload.result === 'fail' ? payload.failureReason : undefined });
      ElMessage.success(payload.result === 'complete' ? '付款完成已登记' : '付款失败已登记，冻结资金已释放');
    } else {
      await appendPaymentFiles({ id, file_ids: payload.fileIds, message: payload.message });
      ElMessage.success('付款凭证已追加');
    }
    dialogVisible.value = false;
  } catch { /* 统一请求层已显示后端错误 */ }
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

    :deep(.el-button + .el-button) { margin-left: 0; }
  }

  &__workspace {
    display: grid;
    min-width: 0;
    align-items: start;
    grid-template-columns: minmax(0, 1.15fr) minmax(420px, 0.95fr);
    gap: 20px;
  }

  &__main,
  &__aside {
    display: grid;
    min-width: 0;
    gap: 20px;
  }

  &__aside {
    position: sticky;
    top: 20px;
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
  .withdrawal-detail-page__workspace { grid-template-columns: 1fr; }
  .withdrawal-detail-page__aside { position: static; }
}

@include mobile {
  .withdrawal-detail-page { gap: 16px; }
  .withdrawal-detail-page__toolbar {
    align-items: flex-start;
    flex-direction: column;

    > :deep(.el-button) { width: fit-content; }
  }
  .withdrawal-detail-page__actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    :deep(.el-button) { width: 100%; margin-left: 0; }
  }
  .withdrawal-detail-page__workspace {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }
  .withdrawal-detail-page__aside { position: static; }
}
</style>
