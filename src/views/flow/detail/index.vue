<template>
  <section class="admin-page flow-detail-page">
    <DetailHero
      order="资金流水"
      :title="detail.title"
      :description="detail.description"
      :order-id="detail.id"
      :status="heroStatus"
      @back="goBack"
    />

    <DetailSummaryCard :items="summaryItems" />

    <div class="flow-detail-page__split">
      <DetailBusinessInfo
        title="交易信息"
        :sections="businessSections"
        :status="detail.status ? { type: detail.statusType, effect: detail.statusEffect } : undefined"
      />

      <DetailTimelinePanel title="处理时间线" :items="detail.timeline" />
    </div>

    <DetailFundImpact :result="fundResultNode" />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Clock,
  Money,
  Switch,
  Tickets,
  UserFilled,
  Wallet,
} from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import DetailBusinessInfo, { type DetailSection } from '@/components/detail/DetailBusinessInfo.vue';
import DetailFundImpact, { type FundImpactNode } from '@/components/detail/DetailFundImpact.vue';
import DetailHero from '@/components/detail/DetailHero.vue';
import DetailSummaryCard, { type SummaryItem } from '@/components/detail/DetailSummaryCard.vue';
import DetailTimelinePanel from '@/components/detail/DetailTimelinePanel.vue';

import type { FlowDetail } from './types';

const route = useRoute();
const router = useRouter();

const detail = computed<FlowDetail>(() => {
  const id = String(route.params.id || 'EX-26073002');

  return {
    id,
    title: '资金流水详情',
    description: '记录交易详情、资金变化与处理时间线',
    status: '待审核',
    statusType: 'warning',
    statusEffect: 'pending',
    flowType: '兑换',
    agent: '代理B · Bluewave Capital',
    direction: 'USDC → USD',
    payAmount: '5,000.00',
    payAsset: 'USDC',
    rate: '0.9000',
    receiveAmount: '4,500.00',
    receiveAsset: 'USD',
    submittedAt: '2026/08/10 17:09:26',
    fundChangeLabel: '冻结USDC',
    fundChangeAmount: '5,000.00',
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
    ],
  };
});

const heroStatus = computed(() => ({
  label: detail.value.status,
  type: detail.value.statusType,
  effect: detail.value.statusEffect,
}));

const summaryItems = computed<SummaryItem[]>(() => [
  { label: '流水类型', value: detail.value.flowType, icon: Switch, tone: 'mt' },
  { label: '代理', value: detail.value.agent, icon: UserFilled, tone: 'blue' },
  {
    label: '交易金额',
    value: detail.value.payAmount,
    suffix: detail.value.payAsset,
    icon: Money,
    tone: 'mt',
  },
  { label: '提交时间', value: detail.value.submittedAt, icon: Clock, tone: 'blue' },
]);

const businessSections = computed<DetailSection[]>(() => [
  {
    title: '基础信息',
    icon: Tickets,
    fields: [
      { label: '交易编号：', value: detail.value.id },
      { label: '代理：', value: detail.value.agent },
      { label: '流水类型：', value: detail.value.flowType },
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
      { label: '提交时间：', value: detail.value.submittedAt },
    ],
  },
]);

const fundResultNode = computed<FundImpactNode>(() => ({
  icon: Wallet,
  tone: 'blue',
  label: detail.value.fundChangeLabel,
  value: detail.value.fundChangeAmount,
  suffix: detail.value.payAsset,
}));

function goBack() {
  router.push('/flow');
}
</script>

<style scoped lang="scss">
.flow-detail-page {
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
