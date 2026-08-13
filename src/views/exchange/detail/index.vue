<template>
  <section class="admin-page exchange-detail-page">
    <DetailHero
      order="兑换审核"
      :title="detail.title"
      :description="detail.description"
      :order-id="detail.id"
      :status="heroStatus"
      :actions="heroActions"
      @back="goBack"
      @approve="openReviewDialog('approve')"
      @reject="openReviewDialog('reject')"
    />

    <DetailSummaryCard :items="summaryItems" />

    <div class="exchange-detail-page__split">
      <DetailBusinessInfo
        title="业务信息"
        :sections="businessSections"
        :status="detail.status ? { type: detail.statusType, effect: detail.statusEffect } : undefined"
      />

      <DetailTimelinePanel title="处理时间线" :items="detail.timeline" />
    </div>

    <DetailFundImpact
      :flow="fundFlowNode"
      :result="fundResultNode"
    />

    <ExchangeAddDialog
      v-model="dialogVisible"
      :row="reviewRow"
      :mode="dialogMode"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  CircleCheck,
  CircleClose,
  Clock,
  Document,
  Money,
  Switch,
  Tickets,
  TrendCharts,
} from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import DetailBusinessInfo, { type DetailSection } from '@/components/detail/DetailBusinessInfo.vue';
import DetailFundImpact, { type FundImpactNode } from '@/components/detail/DetailFundImpact.vue';
import DetailHero, { type HeroAction } from '@/components/detail/DetailHero.vue';
import DetailSummaryCard, { type SummaryItem } from '@/components/detail/DetailSummaryCard.vue';
import DetailTimelinePanel from '@/components/detail/DetailTimelinePanel.vue';

import ExchangeAddDialog from '../components/ExchangeAddDialog.vue';
import type { ExchangeRow } from '../components/ExchangeTableList.vue';
import type { ExchangeDetail } from './types';

const route = useRoute();
const router = useRouter();

const detail = computed<ExchangeDetail>(() => {
  const id = String(route.params.id || 'EX-26073002');

  return {
    id,
    title: '数字货币兑换详情',
    description: '核对冻结资金、兑换比例与代理余额影响',
    status: '待审核',
    statusType: 'warning',
    statusEffect: 'pending',
    agent: '代理B · Bluewave Capital',
    agentCode: 'AG-B',
    payAmount: '5,000.00',
    payAsset: 'USDC',
    direction: 'USDC → USD',
    rate: '0.9000',
    receiveAmount: '4,500.00',
    receiveAsset: 'USD',
    submittedAt: '2026/08/10 17:09:26',
    remark: '订单将使用提交时的0.9000比例',
    timeline: [
      {
        key: 'submit',
        title: '代理提交兑换',
        time: '2026/08/10 17:09:26',
        description: '申请将5,000.00 USDC兑换为USD。',
        state: 'done',
      },
      {
        key: 'freeze',
        title: 'USDC已冻结',
        time: '2026/08/10 17:09:27',
        description: '5,000.00 USDC已由可用余额转入冻结余额。',
        state: 'done',
      },
      {
        key: 'reviewing',
        title: '等待后台审核',
        time: '2026/08/10 17:09:28',
        description: '订单将使用提交时的0.9000比例。',
        state: 'active',
      },
      { key: 'done', title: '审核通过 / 拒绝', state: 'pending' },
    ],
  };
});

const heroStatus = computed(() => ({
  label: detail.value.status,
  type: detail.value.statusType,
  effect: detail.value.statusEffect,
}));

const heroActions: HeroAction[] = [
  { label: '通过', icon: CircleCheck, type: 'primary', emitName: 'approve' },
  { label: '拒绝', icon: CircleClose, type: 'danger', emitName: 'reject' },
];

const summaryItems = computed<SummaryItem[]>(() => [
  { label: '支付数量', value: detail.value.payAmount, suffix: detail.value.payAsset, icon: Money, tone: 'blue' },
  { label: '兑换方向', value: detail.value.direction, icon: Switch, tone: 'mt' },
  { label: '采用比例', value: detail.value.rate, icon: TrendCharts, tone: 'purple' },
  { label: '提交时间', value: detail.value.submittedAt, icon: Clock, tone: 'blue' },
]);

const businessSections = computed<DetailSection[]>(() => [
  {
    title: '基础信息',
    icon: Tickets,
    fields: [
      { label: '交易编号：', value: detail.value.id },
      { label: '代理编号：', value: detail.value.agentCode },
      { label: '代理：', value: detail.value.agent },
      { label: '当前状态：', value: detail.value.status, badge: true },
    ],
  },
  {
    title: '兑换明细',
    icon: Switch,
    fields: [
      { label: '兑换方向：', value: detail.value.direction },
      { label: '支付数量：', value: `${detail.value.payAmount} ${detail.value.payAsset}` },
      { label: '采用比例：', value: detail.value.rate },
      { label: '获得金额：', value: `${detail.value.receiveAmount} ${detail.value.receiveAsset}` },
    ],
  },
  {
    title: '备注',
    icon: Document,
    fields: [
      { label: '提交时间：', value: detail.value.submittedAt },
      { label: '业务备注：', value: detail.value.remark },
    ],
  },
]);

const fundFlowNode: FundImpactNode = {
  icon: Money,
  tone: 'blue',
  label: '当前：',
  value: '已冻结',
  suffix: 'USDC',
};

const fundResultNode = computed<FundImpactNode>(() => ({
  icon: TrendCharts,
  tone: 'mt',
  label: '审核通过后：',
  value: '代理余额',
  delta: detail.value.receiveAmount,
  suffix: detail.value.receiveAsset,
}));

const reviewRow = computed<ExchangeRow>(() => ({
  id: detail.value.id,
  time: '08/03 16:08',
  agent: detail.value.agent,
  code: detail.value.agentCode,
  amount: `${detail.value.payAmount} ${detail.value.payAsset}`,
  asset: detail.value.payAsset,
  rate: detail.value.rate,
  usd: `${detail.value.receiveAmount} ${detail.value.receiveAsset}`,
  status: detail.value.status,
  statusType: 'warning',
  statusEffect: 'pending',
}));

const dialogVisible = ref(false);
const dialogMode = ref<'approve' | 'reject'>('approve');

function goBack() {
  router.push('/exchange');
}

function openReviewDialog(mode: 'approve' | 'reject') {
  dialogMode.value = mode;
  dialogVisible.value = true;
}

function handleSubmit(payload: { row: ExchangeRow; mode: 'approve' | 'reject'; reason?: string }) {
  // 接入 API：await api.exchanges.review(payload)
  console.log('exchange detail review', payload);
  dialogVisible.value = false;
}
</script>

<style scoped lang="scss">
.exchange-detail-page {
  gap: 20px;

  &__split {
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr;

    @media (min-width: 1311px) {
      grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    }
  }
}
</style>
