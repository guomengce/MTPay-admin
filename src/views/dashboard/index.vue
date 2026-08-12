<template>
  <section class="admin-page overview-page">
    <AdminHero title="MTPay 营运总览" description="管理代理、资金与审核流程" :icon="DataAnalysis">
    </AdminHero>

    <HeaderMetrics />

    <div class="overview-page__split">
      <Tasks />
      <RateSettings />
    </div>

    <AssetFlows />
  </section>
</template>

<script setup lang="ts">
import { DataAnalysis } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AssetFlows from './components/AssetFlows.vue';
import HeaderMetrics from './components/HeaderMetrics.vue';
import RateSettings from './components/RateSettings.vue';
import Tasks from './components/Tasks.vue';
</script>

<style scoped lang="scss">
.overview-page {
  &__split {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
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
