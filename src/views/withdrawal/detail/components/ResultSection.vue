<template>
  <section v-if="fields.length">
    <h3>{{ title }}</h3>
    <dl class="detail-fields">
      <div
        v-for="item in fields"
        :key="item.key"
        :class="{ 'is-wide': item.wide }"
      >
        <dt>{{ item.label }}</dt>
        <dd :class="{ 'is-accent': item.accent }">{{ item.value }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import type { DetailField } from '../../composables/useWithdrawalDetailView';

defineProps<{
  title: string;
  fields: DetailField[];
}>();
</script>

<style scoped lang="scss">
section {
  padding: 0 16px 14px;
  overflow: hidden;
  border: 1px solid #e0e8f0;
  border-radius: 13px;
  background: #fbfcfe;

  h3 {
    margin: 0 -16px;
    padding: 12px 16px;
    border-bottom: 1px solid #e6edf3;
    color: var(--app-text-heading);
    background: #f5f8fb;
    font-size: 14px;
  }
}

.detail-fields {
  display: grid;
  margin: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;

  > div { min-width: 0; padding: 11px 0; border-bottom: 1px dashed #dfe7ef; }
  > div.is-wide { grid-column: 1 / -1; }
  dt { color: var(--app-text-label); font-size: 11px; }
  dd {
    margin: 5px 0 0;
    color: var(--app-text-body);
    font-size: 13px;
    font-weight: 600;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }
  dd.is-accent { color: #078f89; }
}

@include mobile {
  .detail-fields { grid-template-columns: 1fr; }
  .detail-fields > div.is-wide { grid-column: auto; }
}
</style>