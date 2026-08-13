<template>
  <section class="admin-page withdrawal-detail-page">
    <DetailHero
      order="出金管理"
      :title="detail.title"
      :description="detail.description"
      :order-id="detail.id"
      :status="heroStatus"
      :actions="heroActions"
      @back="goBack"
      @complete="openCompleteDialog"
      @return="handleReturn"
    />

    <DetailSummaryCard :items="summaryItems" />

    <div class="withdrawal-detail-page__split">
      <DetailBusinessInfo
        title="业务信息"
        :sections="businessSections"
        :status="detail.status ? { type: detail.statusType, effect: detail.statusEffect } : undefined"
      />

      <DetailTimelinePanel title="处理时间线" :items="detail.timeline" />
    </div>

    <AdminPanel class="withdrawal-detail-page__files">
      <h2>合同及 Invoice</h2>

      <div class="withdrawal-detail-page__file-list">
        <article
          v-for="file in detail.files"
          :key="file.key"
          class="withdrawal-detail-page__file-item"
        >
          <span class="withdrawal-detail-page__file-icon">
            <DocumentChecked />
          </span>

          <div class="withdrawal-detail-page__file-body">
            <span>{{ file.label }}</span>
            <strong>{{ file.name }}</strong>
            <small>{{ file.status }}</small>
          </div>

          <el-button plain :icon="View">查看</el-button>
        </article>
      </div>
    </AdminPanel>

    <DetailFundImpact
      :flow="fundFlowNode"
      :result="fundResultNode"
    />

    <WithdrawalAddDialog
      v-model="dialogVisible"
      :row="completeRow"
      mode="complete"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import {
  CircleCheck,
  CircleClose,
  DocumentChecked,
  Money,
  Switch,
  Tickets,
  UserFilled,
  View,
  Wallet,
} from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import DetailBusinessInfo, { type DetailSection } from '@/components/detail/DetailBusinessInfo.vue';
import DetailFundImpact, { type FundImpactNode } from '@/components/detail/DetailFundImpact.vue';
import DetailHero, { type HeroAction } from '@/components/detail/DetailHero.vue';
import DetailSummaryCard, { type SummaryItem } from '@/components/detail/DetailSummaryCard.vue';
import DetailTimelinePanel from '@/components/detail/DetailTimelinePanel.vue';

import WithdrawalAddDialog from '../components/WithdrawalAddDialog.vue';
import type { WithdrawalRow } from '../components/WithdrawalTableList.vue';
import type { WithdrawalDetail } from './types';

const route = useRoute();
const router = useRouter();

const detail = computed<WithdrawalDetail>(() => {
  const id = String(route.params.id || 'WD-26073001');

  return {
    id,
    title: 'USD 出金详情',
    description: '核对付款组合、收款主体、佐证文件与资金冻结影响',
    status: '付款处理中',
    statusType: 'primary',
    statusEffect: 'pending',
    agent: '代理A · Apex Trading',
    agentCode: 'AG-A',
    relation: 'B→B',
    payer: 'Harbor Trade Pte. Ltd.',
    payee: 'Northstar Supplies LLC',
    receiveAmount: '5,000.00',
    fixedFee: '50.00',
    totalDebit: '5,050.00',
    currency: 'USD',
    reference: '尚未产生',
    documentRequirement: '必须上传合同及 Invoice',
    submittedAt: '2026/08/10 15:09:26',
    files: [
      { key: 'contract', label: '合同', name: 'Harbor_Northstar_Contract.pdf', status: '已上传' },
      { key: 'invoice', label: 'Invoice', name: 'INV-20260730.pdf', status: '已上传' },
    ],
    timeline: [
      {
        key: 'submit',
        title: '代理提交 USD 出金',
        time: '2026/08/10 15:09:26',
        description: '收款金额 5,000.00 USD，固定手续费 50.00 USD',
        state: 'done',
      },
      {
        key: 'documents',
        title: '佐证文件已提交',
        time: '2026/08/10 15:09:26',
        description: '付款人和收款人为不同企业，已上传合同及 Invoice',
        state: 'done',
      },
      {
        key: 'freeze',
        title: 'USD 已冻结',
        time: '2026/08/10 15:09:27',
        description: '总扣款 5,050.00 USD 由可用余额转入冻结余额',
        state: 'done',
      },
      { key: 'processing', title: '等待付款完成', state: 'active' },
      { key: 'done', title: '付款完成 / 退回', state: 'pending' },
    ],
  };
});

const heroStatus = computed(() => ({
  label: detail.value.status,
  type: detail.value.statusType,
  effect: detail.value.statusEffect,
}));

const heroActions: HeroAction[] = [
  { label: '付款完成', icon: CircleCheck, type: 'primary', emitName: 'complete' },
  { label: '退回', icon: CircleClose, type: 'danger', emitName: 'return' },
];

const summaryItems = computed<SummaryItem[]>(() => [
  {
    label: '总扣款',
    value: detail.value.totalDebit,
    suffix: detail.value.currency,
    icon: Wallet,
    tone: 'mt',
  },
  {
    label: '收款金额',
    value: detail.value.receiveAmount,
    suffix: detail.value.currency,
    icon: UserFilled,
    tone: 'blue',
  },
  {
    label: '固定手续费',
    value: detail.value.fixedFee,
    suffix: detail.value.currency,
    icon: Money,
    tone: 'mt',
  },
  { label: '付款组合', value: detail.value.relation, icon: Switch, tone: 'blue' },
]);

const businessSections = computed<DetailSection[]>(() => [
  {
    title: '基础信息',
    icon: Tickets,
    fields: [
      { label: '交易编号：', value: detail.value.id },
      { label: '当前状态：', value: detail.value.status, badge: true },
      { label: '所属代理：', value: detail.value.agent },
      { label: '付款参考号：', value: detail.value.reference },
    ],
  },
  {
    title: '收付款信息',
    icon: UserFilled,
    fields: [
      { label: '付款人：', value: detail.value.payer },
      { label: '收款金额：', value: `${detail.value.receiveAmount} ${detail.value.currency}` },
      { label: '收款人：', value: detail.value.payee },
      { label: '总扣款：', value: `${detail.value.totalDebit} ${detail.value.currency}` },
    ],
  },
  {
    title: '费用与要求',
    icon: Money,
    fields: [
      { label: '固定手续费：', value: `${detail.value.fixedFee} ${detail.value.currency}` },
      { label: '佐证文件要求：', value: detail.value.documentRequirement },
    ],
  },
]);

const fundFlowNode: FundImpactNode = {
  icon: Money,
  tone: 'blue',
  label: '当前：',
  value: '已冻结',
  suffix: 'USD',
};

const fundResultNode = computed<FundImpactNode>(() => ({
  icon: Wallet,
  tone: 'mt',
  label: '付款完成后：',
  value: '已扣款',
  delta: detail.value.totalDebit,
  suffix: 'USD',
}));

const completeRow = computed<WithdrawalRow>(() => ({
  id: detail.value.id,
  time: '08/03 14:08',
  agent: detail.value.agent,
  relation: detail.value.relation,
  parties: `${detail.value.payer} → ${detail.value.payee}`,
  amount: `${detail.value.receiveAmount} ${detail.value.currency}`,
  fee: `${detail.value.fixedFee} / ${detail.value.totalDebit} ${detail.value.currency}`,
  status: detail.value.status,
  statusType: 'primary',
  statusEffect: 'pending',
}));

const dialogVisible = ref(false);

function goBack() {
  router.push('/withdrawal');
}

function openCompleteDialog() {
  dialogVisible.value = true;
}

function handleReturn() {
  ElMessage.info('退回功能待接入');
}

function handleSubmit(payload: {
  row: WithdrawalRow;
  mode: 'complete';
  reference?: string;
  note?: string;
}) {
  // 接入 API：await api.withdrawals.complete(payload)
  console.log('withdrawal detail complete', payload);
  dialogVisible.value = false;
}
</script>

<style scoped lang="scss">
.withdrawal-detail-page {
  gap: 20px;

  &__split {
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr;

    @media (min-width: 1311px) {
      grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    }
  }

  &__files {
    padding: 24px 28px;

    h2 {
      margin: 0 0 16px;
      color: #061936;
      font-size: 22px;
      font-weight: 950;
    }
  }

  &__file-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  &__file-item {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
    padding: 16px;
    border: 1px solid #dce7f5;
    border-radius: 14px;
    background: #fbfdff;
  }

  &__file-icon {
    display: inline-flex;
    width: 44px;
    height: 44px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    color: #fff;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    font-size: 22px;
  }

  &__file-body {
    display: grid;
    gap: 4px;
    min-width: 0;
    margin-right: auto;

    span,
    small {
      color: #66758b;
      font-size: 13px;
      font-weight: 750;
    }

    strong {
      min-width: 0;
      overflow: hidden;
      color: #061936;
      font-size: 15px;
      font-weight: 900;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  @include narrow {
    &__file-list {
      gap: 14px;
    }

    &__file-item {
      padding: 14px;
    }

    &__file-icon {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }
  }

  @media (max-width: 1310px) {
    // ≤ narrow：先从 2 列降为 1 列，避免两侧挤
    &__file-list {
      grid-template-columns: 1fr;
    }
  }

  @include mobile {
    // ≤768：单列布局进一步收紧
    &__file-list {
      gap: 12px;
    }

    &__file-item {
      flex-wrap: wrap;
      align-items: flex-start;
      padding: 14px;
    }
  }
}
</style>
