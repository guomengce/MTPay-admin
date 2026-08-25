<template>
  <div v-loading="loading" class="reservation-card-list">
    <AdminCardList v-if="data.length" :items="cardItems" />
    <el-empty v-else-if="!loading" description="暫無官網預約記錄" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AdminCardList, { type AdminCardItem } from '@/components/admin/AdminCardList.vue';
import type { ReservationRow } from '../composables/mapper';

const props = defineProps<{ data: ReservationRow[]; loading?: boolean }>();
const cardItems = computed<AdminCardItem[]>(() => props.data.map((row) => ({
  key: row.key,
  title: row.company,
  fields: [
    { label: '聯絡人', value: row.contactName, strong: true },
    { label: 'Email', value: row.email },
    { label: '業務類型', value: row.businessType, strong: true },
    { label: '所需幣種', value: row.currencies.join(' · ') || '—' },
    { label: '提交時間', value: row.submittedAt },
    // { label: 'IP', value: row.ip },
  ],
})));
</script>

<style scoped lang="scss">
.reservation-card-list { display: none; min-height: 120px; @include mobile { display: block; } }
</style>
