<template>
  <section class="admin-page deposit-detail-page">
    <DepositDetailHero
      :detail="detail"
      @back="goBack"
      @approve="openReviewDialog('approve')"
      @reject="openReviewDialog('reject')"
    />

    <DepositSummaryCards :detail="detail" />

    <div class="deposit-detail-page__grid">
      <main class="deposit-detail-page__main">
        <DepositBusinessInfo :detail="detail" />
        <DepositFundImpact :detail="detail" />
      </main>

      <aside class="deposit-detail-page__aside">
        <DepositTimeline :detail="detail" />
      </aside>
    </div>

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
import { useRoute, useRouter } from 'vue-router';

import DepositAddDialog from '../components/DepositAddDialog.vue';
import type { DepositRow } from '../components/DepositTableList.vue';
import DepositBusinessInfo from './components/DepositBusinessInfo.vue';
import DepositDetailHero from './components/DepositDetailHero.vue';
import DepositFundImpact from './components/DepositFundImpact.vue';
import DepositSummaryCards from './components/DepositSummaryCards.vue';
import DepositTimeline from './components/DepositTimeline.vue';
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
    gap: 14px;

    &__grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    &__main,
    &__aside {
      gap: 14px;
    }
  }
}
</style>
