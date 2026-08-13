<template>
  <section class="admin-page deposit-detail-page">
    <DetailHero
      order="入金审核"
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

    <div class="deposit-detail-page__split">
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

    <DepositAddDialog
      v-model="dialogVisible"
      :row="reviewRow"
      :mode="dialogMode"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, CircleClose, Document, Link, Tickets, TrendCharts, Wallet } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import DetailBusinessInfo, {
  type DetailSection,
} from '@/components/detail/DetailBusinessInfo.vue';
import DetailFundImpact, {
  type FundImpactNode,
} from '@/components/detail/DetailFundImpact.vue';
import DetailHero, { type HeroAction } from '@/components/detail/DetailHero.vue';
import DetailSummaryCard, {
  type SummaryItem,
} from '@/components/detail/DetailSummaryCard.vue';
import DetailTimelinePanel from '@/components/detail/DetailTimelinePanel.vue';

import DepositAddDialog from '../components/DepositAddDialog.vue';
import type { DepositRow } from '../components/DepositTableList.vue';
import type { DepositDetail } from './types';

const route = useRoute();
const router = useRouter();

const detail = computed<DepositDetail>(() => {
  const id = String(route.params.id || 'DEP-26073002');

  return {
    id,
    title: '数字货币入金详情',
    description: '核对链上交易、代理信息与资金入账影响',
    status: '待审核',
    statusType: 'warning',
    statusEffect: 'pending',
    amount: '12,000.00',
    currency: 'USDC',
    asset: 'USDC',
    network: 'ERC20',
    agent: '代理A · Apex Trading',
    agentCode: 'AG-A',
    hash: '0x98aefd33e5571d507234239c1a698bc7801e72f0',
    address: '0x98d1C74E49C7F46C7D7FA82C31A73D05A6F41C28',
    submittedAt: '2026/08/10 16:09:26',
    remark: '等待后台核对链上到账',
    balanceChange: '12,000.00',
    timeline: [
      {
        key: 'submit',
        title: '代理提交入金',
        time: '2026/08/10 16:09:26',
        description: '代理提交12,000.00 USDC入金记录及交易哈希。',
        state: 'done',
      },
      {
        key: 'reviewing',
        title: '等待后台审核',
        time: '2026/08/10 16:09:27',
        state: 'active',
      },
      {
        key: 'done',
        title: '审核通过 / 拒绝',
        state: 'pending',
      },
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
  {
    label: '申报金额',
    value: detail.value.amount,
    suffix: detail.value.currency,
    icon: Wallet,
    tone: 'mt',
  },
  {
    label: '资产 / 网络',
    value: `${detail.value.asset} · ${detail.value.network}`,
    icon: Link,
    tone: 'blue',
  },
  {
    label: '代理',
    value: detail.value.agent,
    icon: Tickets,
    tone: 'purple',
  },
  {
    label: '提交时间',
    value: detail.value.submittedAt,
    icon: Document,
    tone: 'blue',
  },
]);

const businessSections = computed<DetailSection[]>(() => [
  {
    title: '基础信息',
    icon: Tickets,
    fields: [
      { label: '交易编号：', value: detail.value.id },
      { label: '代理编号：', value: detail.value.agentCode },
      { label: '当前状态：', value: detail.value.status, badge: true },
    ],
  },
  {
    title: '链上信息',
    icon: Link,
    fields: [
      { label: '交易哈希：', value: detail.value.hash, copyable: true, mono: true },
      { label: '入金地址：', value: detail.value.address, copyable: true, mono: true },
    ],
  },
  {
    title: '备注',
    icon: Document,
    fields: [{ label: '业务备注：', value: detail.value.remark }],
  },
]);

const fundFlowNode: FundImpactNode = {
  icon: Wallet,
  tone: 'blue',
  label: '当前：',
  value: '尚未入账',
};

const fundResultNode = computed<FundImpactNode>(() => ({
  icon: TrendCharts,
  tone: 'mt',
  label: '审核通过后：',
  value: '代理余额',
  delta: detail.value.balanceChange,
  suffix: detail.value.currency,
}));

const reviewRow = computed<DepositRow>(() => ({
  id: detail.value.id,
  time: '08/03 15:08',
  agent: detail.value.agent,
  asset: detail.value.asset,
  network: detail.value.network,
  hash: `${detail.value.hash.slice(0, 10)}...${detail.value.hash.slice(-6)}`,
  amount: detail.value.amount,
  status: detail.value.status,
  statusType: 'warning',
  statusEffect: 'pending',
}));

const dialogVisible = ref(false);
const dialogMode = ref<'approve' | 'reject'>('approve');

function goBack() {
  router.push('/deposit');
}

function openReviewDialog(mode: 'approve' | 'reject') {
  dialogMode.value = mode;
  dialogVisible.value = true;
}

function handleSubmit(payload: { row: DepositRow; mode: 'approve' | 'reject'; reason?: string }) {
  // 接入 API：await api.deposits.review(payload)
  console.log('deposit detail review', payload);
  dialogVisible.value = false;
}
</script>

<style scoped lang="scss">
.deposit-detail-page {
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
