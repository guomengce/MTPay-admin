<template>
  <AdminPanel class="flow-timeline">
    <AdminTimeline title="处理时间线" :items="detail.timeline" />
  </AdminPanel>
</template>

<script setup lang="ts">
import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminTimeline from '@/components/admin/AdminTimeline.vue';
import type { FlowDetail } from '../types';

defineProps<{ detail: FlowDetail }>();
</script>

<style scoped lang="scss">
.flow-timeline {
  padding: 26px;

  @include mobile {
    padding: 20px;
  }
}
</style>
