<template>
  <AdminPanel class="deposit-timeline">
    <AdminTimeline title="处理时间线" :items="detail.timeline" />
  </AdminPanel>
</template>

<script setup lang="ts">
import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminTimeline from '@/components/admin/AdminTimeline.vue';
import type { DepositDetail } from '../types';

defineProps<{ detail: DepositDetail }>();
</script>

<style scoped lang="scss">
.deposit-timeline {
  padding: 26px;

  @include narrow {
    padding: 22px;
  }

  @include mobile {
    padding: 20px;
  }
}
</style>
