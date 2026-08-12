<template>
  <section class="admin-page withdrawal-detail-page">
    <WithdrawalDetailHero
      :detail="detail"
      @back="goBack"
      @complete="openCompleteDialog"
      @return="handleReturn"
    />

    <div class="withdrawal-detail-page__grid">
      <main class="withdrawal-detail-page__main">
        <WithdrawalSummaryCards :detail="detail" />
        <WithdrawalBusinessInfo :detail="detail" />
        <WithdrawalFilePanel :detail="detail" />
        <WithdrawalFundImpact :detail="detail" />
      </main>

      <aside class="withdrawal-detail-page__aside">
        <WithdrawalTimeline :detail="detail" />
      </aside>
    </div>

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
import { useRoute, useRouter } from 'vue-router';

import WithdrawalAddDialog from '../components/WithdrawalAddDialog.vue';
import type { WithdrawalRow } from '../components/WithdrawalTableList.vue';
import WithdrawalBusinessInfo from './components/WithdrawalBusinessInfo.vue';
import WithdrawalDetailHero from './components/WithdrawalDetailHero.vue';
import WithdrawalFilePanel from './components/WithdrawalFilePanel.vue';
import WithdrawalFundImpact from './components/WithdrawalFundImpact.vue';
import WithdrawalSummaryCards from './components/WithdrawalSummaryCards.vue';
import WithdrawalTimeline from './components/WithdrawalTimeline.vue';
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
      {
        key: 'contract',
        label: '合同',
        name: 'Harbor_Northstar_Contract.pdf',
        status: '已上传',
      },
      {
        key: 'invoice',
        label: 'Invoice',
        name: 'INV-20260730.pdf',
        status: '已上传',
      },
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
      {
        key: 'processing',
        title: '等待付款完成',
        state: 'active',
      },
      {
        key: 'done',
        title: '付款完成 / 退回',
        state: 'pending',
      },
    ],
  };
});

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

  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 24px;
    align-items: start;
  }

  &__main,
  &__aside {
    display: grid;
    gap: 20px;
    min-width: 0;
  }

  @include narrow {
    &__grid {
      grid-template-columns: minmax(0, 1fr) 300px;
      gap: 18px;
    }

    &__main,
    &__aside {
      gap: 18px;
    }
  }

  @include mobile {
    &__grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    &__main,
    &__aside {
      gap: 16px;
    }
  }
}
</style>
