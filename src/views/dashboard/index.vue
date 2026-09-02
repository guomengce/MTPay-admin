<template>
  <section class="admin-page overview-page">
    <div
      v-if="loading"
      class="overview-page__loading"
      element-loading-text="正在載入營運資料…"
      element-loading-background="rgba(245, 249, 252, 0.82)"
    />

    <template v-else>
      <HeaderMetrics
        :agent-summary="overview?.agent_summary ?? null"
        :balance-totals="visibleBalances"
      />

      <div class="overview-page__split">
        <Tasks :pending="overview?.pending_businesses ?? null" />
        <TradingTrend :trend="overview?.transaction_trend ?? null" />
      </div>

      <AssetFlows :transactions="visibleTransactions" />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usePageLoading } from '@/composables/usePageLoading';

import AssetFlows from './components/AssetFlows.vue';
import HeaderMetrics from './components/HeaderMetrics.vue';
import Tasks from './components/Tasks.vue';
import TradingTrend from './components/TradingTrend.vue';
import { useDashboard } from './composables/useDashboard';
import { useAuthStore } from '@/stores/modules/auth';

const { loading, overview, fetchOverview } = useDashboard();
const authStore = useAuthStore();
const visibleBalances = computed(() => (overview.value?.balance_totals ?? []).filter((item) => authStore.cryptoEnabled || item.currency.type === 2));
const visibleTransactions = computed(() => (overview.value?.recent_transactions ?? []).filter((item) => authStore.cryptoEnabled || !['deposit', 'exchange'].includes(item.business_type)));
usePageLoading(loading);

onMounted(fetchOverview);
</script>

<style scoped lang="scss">
.overview-page {
  position: relative;
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: -24px;
    pointer-events: none;
    background:
      radial-gradient(circle at 8% 8%, rgb(22 189 180 / 9%), transparent 25%),
      radial-gradient(circle at 94% 30%, rgb(25 121 132 / 6%), transparent 28%),
      linear-gradient(rgb(35 94 143 / 2%) 1px, transparent 1px),
      linear-gradient(90deg, rgb(35 94 143 / 2%) 1px, transparent 1px);
    background-size:
      auto,
      auto,
      32px 32px,
      32px 32px;
    mask-image: linear-gradient(to bottom, #000 0%, rgb(0 0 0 / 45%) 58%, transparent 100%);
  }

  &__split {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  &__loading {
    min-height: clamp(360px, 62vh, 680px);
    border: 1px solid #dce7ef;
    border-radius: 20px;
    background: rgb(255 255 255 / 72%);
  }
}

@include narrow {
  .overview-page__split {
    grid-template-columns: 1fr;
  }
}

@include mobile {
  .overview-page__split {
    grid-template-columns: 1fr;
  }
}
</style>
