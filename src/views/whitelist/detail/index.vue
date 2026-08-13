<template>
  <section class="admin-page whitelist-detail-page">
    <DetailHero
      order="白名单审核"
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

    <div class="whitelist-detail-page__split">
      <DetailBusinessInfo title="白名单资料" :sections="businessSections" />

      <DetailTimelinePanel title="处理时间线" :items="detail.timeline" />
    </div>

    <AdminPanel class="whitelist-detail-page__remark">
      <h2>审核备注</h2>
      <div class="whitelist-detail-page__remark-box">
        <span class="whitelist-detail-page__remark-icon">
          <ChatDotRound />
        </span>
        <strong>{{ detail.reviewRemark }}</strong>
      </div>
    </AdminPanel>

    <WhitelistAddDialog
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
  ChatDotRound,
  CircleCheck,
  CircleClose,
  Money,
  Tickets,
  UserFilled,
  Wallet,
} from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import DetailBusinessInfo, { type DetailSection } from '@/components/detail/DetailBusinessInfo.vue';
import DetailHero, { type HeroAction } from '@/components/detail/DetailHero.vue';
import DetailSummaryCard, { type SummaryItem } from '@/components/detail/DetailSummaryCard.vue';
import DetailTimelinePanel from '@/components/detail/DetailTimelinePanel.vue';

import WhitelistAddDialog from '../components/WhitelistAddDialog.vue';
import type { WhitelistRow } from '../components/WhitelistTableList.vue';
import type { WhitelistDetail } from './types';

const route = useRoute();
const router = useRouter();

const detail = computed<WhitelistDetail>(() => {
  const id = String(route.params.id || 'WL-1005');

  return {
    id,
    title: '白名单详情',
    description: '核对收付款主体、银行资料与审核风险',
    status: '待审核',
    statusType: 'warning',
    statusEffect: 'pending',
    subjectName: 'Atlas Commerce GmbH',
    role: '收款人',
    subjectType: '企业（B）',
    agent: '代理A · Apex Trading',
    country: 'Germany',
    city: 'Berlin',
    address: '18 Friedrichstrasse, Berlin',
    bankName: 'Deutsche Bank',
    iban: 'DE8937040044053206194',
    swift: 'DEUTDEBB',
    intermediarySwift: '—',
    purpose: 'Agency Commissions',
    remark: 'Service payment',
    submittedAt: '2026/08/10 16:39:26',
    reviewRemark: '等待 MTPay 后台审核',
    timeline: [
      { key: 'submit', title: '代理提交白名单资料', time: '2026/08/10 16:39:26', state: 'done' },
      { key: 'reviewing', title: '等待后台审核', state: 'active' },
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
  { label: '主体名称', value: detail.value.subjectName, icon: Tickets, tone: 'mt' },
  { label: '白名单角色', value: detail.value.role, icon: UserFilled, tone: 'blue' },
  { label: '主体类型', value: detail.value.subjectType, icon: Wallet, tone: 'mt' },
  { label: '所属代理', value: detail.value.agent, icon: Money, tone: 'blue' },
]);

const businessSections = computed<DetailSection[]>(() => [
  {
    title: '基础信息',
    icon: Tickets,
    fields: [
      { label: '白名单编号：', value: detail.value.id },
      { label: '公司所在国家 / 地区：', value: detail.value.country },
      { label: '公司所在城市：', value: detail.value.city },
      { label: '公司地址：', value: detail.value.address },
    ],
  },
  {
    title: '银行信息',
    icon: Money,
    fields: [
      { label: '银行名称：', value: detail.value.bankName },
      { label: '银行账号 / IBAN：', value: detail.value.iban, copyable: true, mono: true },
      { label: 'SWIFT：', value: detail.value.swift, mono: true },
      { label: '中间行 SWIFT：', value: detail.value.intermediarySwift, mono: true },
    ],
  },
  {
    title: '业务信息',
    icon: Wallet,
    fields: [
      { label: '汇款目的：', value: detail.value.purpose },
      { label: '备注：', value: detail.value.remark },
      { label: '提交时间：', value: detail.value.submittedAt },
    ],
  },
]);

const reviewRow = computed<WhitelistRow>(() => ({
  id: detail.value.id,
  time: '08/03 15:38',
  agent: detail.value.agent,
  type: `${detail.value.role} · B`,
  subject: detail.value.subjectName,
  country: detail.value.country,
  bank: detail.value.bankName,
  account: detail.value.iban,
  status: detail.value.status,
  statusType: 'warning',
  statusEffect: 'pending',
}));

const dialogVisible = ref(false);
const dialogMode = ref<'approve' | 'reject'>('approve');

function goBack() {
  router.push('/whitelist');
}

function openReviewDialog(mode: 'approve' | 'reject') {
  dialogMode.value = mode;
  dialogVisible.value = true;
}

function handleSubmit(payload: { row: WhitelistRow; mode: 'approve' | 'reject'; reason?: string }) {
  // 接入 API：await api.whitelist.review(payload)
  console.log('whitelist detail review', payload);
  dialogVisible.value = false;
}
</script>

<style scoped lang="scss">
.whitelist-detail-page {
  gap: 20px;

  &__split {
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr;

    @media (min-width: 1311px) {
      grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    }
  }

  &__remark {
    padding: 24px 28px;

    h2 {
      margin: 0 0 14px;
      color: #061936;
      font-size: 22px;
      font-weight: 950;
    }
  }

  &__remark-box {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 22px;
    border: 1px solid #dce7f5;
    border-radius: 14px;
    background: #fbfdff;
  }

  &__remark-icon {
    display: inline-flex;
    width: 40px;
    height: 40px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    color: #079d96;
    background: rgb(57 245 236 / 14%);
    font-size: 22px;
  }

  &__remark-box strong {
    color: #061936;
    font-size: 15px;
    font-weight: 850;
  }
}
</style>
