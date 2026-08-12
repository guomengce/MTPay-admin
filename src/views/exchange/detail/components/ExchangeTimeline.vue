<template>
  <AdminPanel class="exchange-timeline">
    <AdminTimeline title="处理时间线" :items="detail.timeline" />
  </AdminPanel>
</template>

<script setup lang="ts">
import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminTimeline from '@/components/admin/AdminTimeline.vue';
import type { ExchangeDetail } from '../types';

defineProps<{ detail: ExchangeDetail }>();
</script>

<style scoped lang="scss">
.exchange-timeline {
  padding: 26px;

  @include narrow {
    padding: 22px;
  }

  @include mobile {
    padding: 20px;
  }
}
</style>
