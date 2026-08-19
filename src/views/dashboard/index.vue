<template>
  <section v-loading="loading" class="admin-page overview-page">
    <HeaderMetrics
      :agent-summary="overview?.agent_summary ?? null"
      :balance-totals="overview?.balance_totals ?? []"
    />

    <div class="overview-page__split">
      <Tasks :pending="overview?.pending_businesses ?? null" />
      <TradingTrend :trend="overview?.transaction_trend ?? null" />
    </div>

    <AssetFlows :transactions="overview?.recent_transactions ?? []" />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import AssetFlows from './components/AssetFlows.vue';
import HeaderMetrics from './components/HeaderMetrics.vue';
import Tasks from './components/Tasks.vue';
import TradingTrend from './components/TradingTrend.vue';
import { useDashboard } from './composables/useDashboard';

const { loading, overview, fetchOverview } = useDashboard();

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
