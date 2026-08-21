<template>
  <AdminPanel
    class="review-result"
    title="审核结果"
    subtitle="本次审核处理记录"
    :icon="CircleCheck"
  >
    <dl v-if="items.length" class="review-result__grid">
      <div
        v-for="item in items"
        :key="item.label"
        :class="{ 'is-wide': item.wide }"
      >
        <dt>{{ item.label }}</dt>
        <dd :class="{ 'is-accent': item.accent }">{{ item.value }}</dd>
      </div>
    </dl>
    <div v-else class="review-result__placeholder">
      <el-icon><Clock /></el-icon>
      <p>待审核，审核结果尚未产生</p>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { CircleCheck, Clock } from '@element-plus/icons-vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';

export interface ReviewResultItem {
  label: string;
  value: string;
  wide?: boolean;
  accent?: boolean;
}

defineProps<{
  items: ReviewResultItem[];
}>();
</script>

<style scoped lang="scss">
.review-result__grid {
  display: grid;
  margin: 0;
  padding: 4px 24px 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 24px;
}

.review-result__grid > div {
  min-width: 0;
  padding: 20px 0;
  border-bottom: 1px dashed #dde6f0;

  &.is-wide {
    grid-column: 1 / -1;
  }
}

.review-result dt {
  color: var(--app-text-label);
  font-size: 14px;
  font-weight: 500;
}

.review-result dd {
  margin: 8px 0 0;
  color: var(--app-text-body);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.65;
  overflow-wrap: anywhere;

  &.is-accent {
    color: #078f89;
  }
}

.review-result__placeholder {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 22px 24px 24px;
  color: var(--app-text-label);

  .el-icon {
    font-size: 18px;
    color: var(--app-text-subtle);
  }

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
  }
}

@include mobile {
  .review-result__grid {
    grid-template-columns: 1fr;
    padding-right: 18px;
    padding-left: 18px;
  }

  .review-result__grid > div.is-wide {
    grid-column: auto;
  }
}
</style>