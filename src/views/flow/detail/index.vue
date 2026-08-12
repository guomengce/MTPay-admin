<template>
  <section class="admin-page flow-detail-page">
    <FlowDetailHero :detail="detail" @back="goBack" />

    <FlowSummaryCards :detail="detail" />
    <div class="flow-detail-page__grid">
      <main class="flow-detail-page__main">
        <FlowBusinessInfo :detail="detail" />
        <FlowFundChange :detail="detail" />
      </main>

      <aside class="flow-detail-page__aside">
        <FlowTimeline :detail="detail" />
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import FlowBusinessInfo from './components/FlowBusinessInfo.vue';
import FlowDetailHero from './components/FlowDetailHero.vue';
import FlowFundChange from './components/FlowFundChange.vue';
import FlowSummaryCards from './components/FlowSummaryCards.vue';
import FlowTimeline from './components/FlowTimeline.vue';
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

function goBack() {
  router.push('/flow');
}
</script>

<style scoped lang="scss">
.flow-detail-page {
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
