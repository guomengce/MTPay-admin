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
  height: 700px;
  min-height: 0;
  flex-direction: column;
  overflow: hidden auto;
  overscroll-behavior: contain;
  padding: 26px;

  @include narrow {
    padding: 22px;
  }

  @include mobile {
    padding: 20px;
  }
}
</style>
