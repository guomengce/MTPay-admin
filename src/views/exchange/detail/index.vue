<template>
  <section class="admin-page exchange-detail-page">
    <ExchangeDetailHero
      :detail="detail"
      @back="goBack"
      @approve="openReviewDialog('approve')"
      @reject="openReviewDialog('reject')"
    />

    <ExchangeSummaryCards :detail="detail" />

    <div class="exchange-detail-page__grid">
      <main class="exchange-detail-page__main">
        <ExchangeBusinessInfo :detail="detail" />
        <ExchangeFundImpact :detail="detail" />
      </main>

      <aside class="exchange-detail-page__aside">
        <ExchangeTimeline :detail="detail" />
      </aside>
    </div>

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
import { useRoute, useRouter } from 'vue-router';

import ExchangeAddDialog from '../components/ExchangeAddDialog.vue';
import type { ExchangeRow } from '../components/ExchangeTableList.vue';
import ExchangeBusinessInfo from './components/ExchangeBusinessInfo.vue';
import ExchangeDetailHero from './components/ExchangeDetailHero.vue';
import ExchangeFundImpact from './components/ExchangeFundImpact.vue';
import ExchangeSummaryCards from './components/ExchangeSummaryCards.vue';
import ExchangeTimeline from './components/ExchangeTimeline.vue';
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
      {
        key: 'done',
        title: '审核通过 / 拒绝',
        state: 'pending',
      },
    ],
  };
});

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
      gap: 16px;
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
