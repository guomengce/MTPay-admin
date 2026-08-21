<template>
  <section v-loading="loading" class="admin-page transaction-detail-page">
    <template v-if="info">
      <template v-if="depositDetail">
        <DetailHero compact order="订单号" title="入金审核" description="核对链上凭证与申报金额后完成审核" :order-id="depositDetail.order_no" :status="heroStatus" @back="goBack" />
        <DepositCoreCard :amount="depositDetail.amount" :currency="depositDetail.currency" :network="depositDetail.network" :user="depositDetail.user" :submitted-at="depositDetail.submitted_at" />
        <div class="transaction-detail-page__split is-deposit">
          <div class="transaction-detail-page__split-col">
            <DepositChainVerification :txid="depositDetail.txid" :receiving-address="depositDetail.receiving_address_snapshot" @copy="copyValue" />
            <DepositReviewResult :items="depositView?.reviewFields ?? []" />
          </div>
          <DepositTimeline :items="timeline" />
        </div>
      </template>

      <template v-else-if="exchangeDetail">
        <DetailHero compact order="订单号" title="数字货币兑换审核" description="核对冻结资金与提交时的汇率快照后完成审核" :order-id="exchangeDetail.order_no" :status="heroStatus" @back="goBack" />
        <ExchangeOverviewCard
          :source-amount="exchangeDetail.source_amount" :source-currency="exchangeDetail.source_currency"
          :target-amount="exchangeDetail.target_amount" :target-currency="exchangeDetail.target_currency"
          :exchange-rate="exchangeDetail.exchange_rate" :rate-source-name="exchangeDetail.rate_source_name"
          :user="exchangeDetail.user" :submitted-at="exchangeDetail.submitted_at"
        />
        <div class="transaction-detail-page__split is-exchange">
          <div class="transaction-detail-page__split-col">
            <ExchangeReviewResult :items="exchangeView?.reviewFields ?? []" />
          </div>
          <ExchangeTimeline :items="timeline" />
        </div>
      </template>

      <template v-else-if="withdrawalDetail">
        <div class="transaction-detail-page__toolbar">
          <el-button plain :icon="Back" @click="goBack">返回交易记录</el-button>
        </div>
        <WithdrawalOrderHeader :detail="withdrawalDetail" />
        <div class="transaction-detail-page__withdrawal-workspace">
          <main class="transaction-detail-page__main">
            <WithdrawalSettlementCard :detail="withdrawalDetail" />
            <WithdrawalPartyPanel
              :payer="withdrawalDetail.payer" :payee="withdrawalDetail.payee"
              :payer-bank-fields="payerBankFields" :payer-subject-fields="payerSubjectFields"
              :payee-bank-fields="payeeBankFields" :payee-subject-fields="payeeSubjectFields"
              :party-type="partyType"
            />
            <WithdrawalAgentCard
              :agent-company="withdrawalDetail.user.company_name"
              :agent-code="withdrawalDetail.user.agent_code"
              :agent-email="withdrawalDetail.user.email"
            />
            <WithdrawalResultPanel :review-fields="withdrawalReviewFields" :payment-fields="withdrawalPaymentFields" />
          </main>
          <aside class="transaction-detail-page__aside">
            <WithdrawalTimeline :timeline-items="withdrawalTimelineItems" :file-rounds="withdrawalFileRounds" />
          </aside>
        </div>
      </template>
    </template>

    <el-empty v-else-if="!loading" :description="invalid ? '无效的交易记录参数' : '未找到交易记录'">
      <el-button type="primary" @click="goBack">返回交易记录</el-button>
    </el-empty>
  </section>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import { ElMessage } from 'element-plus';
import { Back } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import type { DepositOrderDetail } from '@/api/modules/deposit';
import type { ExchangeOrderDetail } from '@/api/modules/exchange';
import type { TransactionBusinessType } from '@/api/modules/transaction';
import type { WithdrawalOrderDetail } from '@/api/modules/withdrawal';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import DetailHero from '@/components/detail/DetailHero.vue';
import DepositChainVerification from '@/views/deposit/detail/components/ChainVerification.vue';
import DepositCoreCard from '@/views/deposit/detail/components/CoreCard.vue';
import DepositReviewResult from '@/views/deposit/detail/components/ReviewResult.vue';
import DepositTimeline from '@/views/deposit/detail/components/Timeline.vue';
import ExchangeOverviewCard from '@/views/exchange/detail/components/ExchangeOverviewCard.vue';
import ExchangeReviewResult from '@/views/exchange/detail/components/ReviewResult.vue';
import ExchangeTimeline from '@/views/exchange/detail/components/Timeline.vue';
import WithdrawalAgentCard from '@/views/withdrawal/detail/components/AgentCard.vue';
import WithdrawalOrderHeader from '@/views/withdrawal/detail/components/OrderHeader.vue';
import WithdrawalPartyPanel from '@/views/withdrawal/detail/components/PartyPanel.vue';
import WithdrawalResultPanel from '@/views/withdrawal/detail/components/ResultPanel.vue';
import WithdrawalSettlementCard from '@/views/withdrawal/detail/components/SettlementCard.vue';
import WithdrawalTimeline from '@/views/withdrawal/detail/components/Timeline.vue';
import { useWithdrawalDetailView } from '@/views/withdrawal/composables/useWithdrawalDetailView';
import { useTransactionDetail } from './composables/useTransactionDetail';
import { useTransactionDetailView } from './composables/useTransactionDetailView';

const route = useRoute();
const router = useRouter();
const businessTypeRef = toRef(() => route.params.businessType as TransactionBusinessType | string | undefined);
const businessIdRef = toRef(() => (route.params.businessId ?? '') as string);
const { loading, info, invalid } = useTransactionDetail(businessTypeRef, businessIdRef);
const { depositView, exchangeView, timeline } = useTransactionDetailView(info);

const depositDetail = computed(() => info.value?.transaction.business_type === 'deposit' ? info.value.detail as DepositOrderDetail : null);
const exchangeDetail = computed(() => info.value?.transaction.business_type === 'exchange' ? info.value.detail as ExchangeOrderDetail : null);
const withdrawalDetail = computed<WithdrawalOrderDetail | null>(() => info.value?.transaction.business_type === 'withdrawal' ? info.value.detail as WithdrawalOrderDetail : null);

const {
  payerBankFields, payeeBankFields, payerSubjectFields, payeeSubjectFields,
  reviewFields: withdrawalReviewFields, paymentFields: withdrawalPaymentFields,
  timelineItems: withdrawalTimelineItems, fileRounds: withdrawalFileRounds, partyType,
} = useWithdrawalDetailView(withdrawalDetail);

const heroStatus = computed(() => {
  const transaction = info.value?.transaction;
  const group = transaction?.status_group;
  let type: StatusBadgeType = 'warning';
  if (group === 'completed') type = 'success';
  else if (group === 'rejected') type = 'danger';
  else if (group === 'failed') type = 'gray';
  else if (group === 'processing') type = 'primary';
  return {
    label: transaction?.status_name || '未知状态', type,
    effect: group === 'pending' || group === 'needs_supplement' ? 'pending' as const : undefined,
  };
});

function goBack() { void router.push({ name: 'Transactions' }).catch(() => router.back()); }
async function copyValue(label: string, value: string) {
  try { await navigator.clipboard.writeText(value); ElMessage.success(`${label}已复制`); }
  catch { ElMessage.error('复制失败，请手动复制'); }
}
</script>

<style scoped lang="scss">
.transaction-detail-page {
  gap: 20px;

  &__split { display: grid; min-width: 0; align-items: start; gap: 20px; }
  &__split.is-deposit { grid-template-columns: minmax(0, 1.65fr) minmax(280px, 0.75fr); }
  &__split.is-exchange { grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.85fr); }
  &__split-col, &__main, &__aside { display: grid; min-width: 0; gap: 20px; }
  &__toolbar { display: flex; align-items: center; }
  &__withdrawal-workspace {
    display: grid; min-width: 0; align-items: start;
    grid-template-columns: minmax(0, 1.15fr) minmax(420px, 0.95fr); gap: 20px;
  }
  &__aside { position: sticky; top: 20px; }
}

@include narrow {
  .transaction-detail-page__split,
  .transaction-detail-page__split.is-deposit,
  .transaction-detail-page__split.is-exchange,
  .transaction-detail-page__withdrawal-workspace { grid-template-columns: 1fr; }
  .transaction-detail-page__aside { position: static; }
}

@include mobile { .transaction-detail-page { gap: 16px; } }
</style>
