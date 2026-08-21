<template>
  <AdminPanel
    v-if="hasContent"
    title="处理结果"
    subtitle="审核、付款执行与资金状态的真实记录"
    :icon="CircleCheck"
  >
    <div class="result-sections">
      <ResultSection title="审核信息" :fields="reviewFields" />
      <ResultSection title="付款信息" :fields="paymentFields" />
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CircleCheck } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';

import ResultSection from './ResultSection.vue';
import type { DetailField } from '../../composables/useWithdrawalDetailView';

const props = defineProps<{
  reviewFields: DetailField[];
  paymentFields: DetailField[];
}>();

const hasContent = computed(
  () => props.reviewFields.length > 0 || props.paymentFields.length > 0,
);
</script>

<style scoped lang="scss">
.result-sections {
  display: grid;
  gap: 14px;
  padding: 6px 24px 24px;
}

@include mobile {
  .result-sections { padding: 4px 16px 16px; }
}
</style>