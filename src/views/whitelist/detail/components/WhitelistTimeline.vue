<template>
  <AdminPanel class="whitelist-timeline">
    <AdminTimeline title="审核时间线" :items="detail.timeline" />
  </AdminPanel>
</template>

<script setup lang="ts">
import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminTimeline from '@/components/admin/AdminTimeline.vue';
import type { WhitelistDetail } from '../types';

defineProps<{ detail: WhitelistDetail }>();
</script>

<style scoped lang="scss">
.whitelist-timeline {
  padding: 26px;

  @include narrow {
    padding: 22px;
  }

  @include mobile {
    padding: 20px;
  }
}
</style>
