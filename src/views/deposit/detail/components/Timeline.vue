<template>
  <AdminPanel
    v-if="items.length"
    title="處理時間線"
    subtitle="本次入金訂單的處理流程"
    :icon="Clock"
  >
    <AdminTimeline class="deposit-timeline" :items="items" />
  </AdminPanel>
</template>

<script setup lang="ts">
import { Clock } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminTimeline from '@/components/admin/AdminTimeline.vue';
import type { AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';

defineProps<{
  items: AdminTimelineItem[];
}>();
</script>

<style scoped lang="scss">
.deposit-timeline {
  padding: 24px;
}
</style>