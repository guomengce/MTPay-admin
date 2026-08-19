<template>
  <AdminPanel class="detail-timeline">
    <AdminTimeline :title="title" :items="items" />
  </AdminPanel>
</template>

<script setup lang="ts">
import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminTimeline from '@/components/admin/AdminTimeline.vue';
import type { AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';

defineProps<{
  title?: string;
  items: AdminTimelineItem[];
}>();
</script>

<style scoped lang="scss">
.detail-timeline {
  display: flex;
  min-height: 480px;
  max-height: 70vh;
  flex-direction: column;
  overflow: hidden auto;
  padding: 26px;

  @include narrow {
    min-height: 420px;
    padding: 22px;
  }

  @include mobile {
    min-height: 0;
    max-height: none;
    overflow: visible;
    padding: 20px;
  }
}
</style>
