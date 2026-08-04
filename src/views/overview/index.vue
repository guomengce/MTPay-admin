<template>
  <section class="admin-page overview-page">
    <AdminHero title="MTPay 营运总览" description="管理代理、资金与审核流程" :icon="DataAnalysis">
      <template #extra>
        <el-button type="primary" size="large" :icon="Plus">新增代理</el-button>
      </template>
    </AdminHero>

    <OverviewMetrics />

    <div class="overview-page__split">
      <OverviewTasks />
      <OverviewSettings />
    </div>

    <OverviewFlows />
  </section>
</template>

<script setup lang="ts">
import { DataAnalysis, Plus } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import OverviewFlows from './components/OverviewFlows.vue';
import OverviewMetrics from './components/OverviewMetrics.vue';
import OverviewSettings from './components/OverviewSettings.vue';
import OverviewTasks from './components/OverviewTasks.vue';
</script>

<style scoped lang="scss">
.overview-page {
  &__split {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 18px;
  }
}

@include narrow {
  .overview-page__split {
    grid-template-columns: 1fr;
  }
}
</style>
