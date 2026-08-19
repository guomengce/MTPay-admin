<template>
  <div class="admin-timeline">
    <h2 v-if="title" class="admin-timeline__title">{{ title }}</h2>

    <el-timeline>
      <el-timeline-item
        v-for="item in items"
        :key="item.key"
        :icon="getIcon(item)"
        :type="getType(item)"
        :color="getColor(item)"
        :hollow="item.state !== 'done'"
        size="large"
      >
        <div class="admin-timeline__content" :class="`is-${item.state}`">
          <strong>{{ item.title }}</strong>
          <time v-if="item.time">{{ item.time }}</time>
          <p v-if="item.description">{{ item.description }}</p>
          <slot name="item-extra" :item="item" />
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { CircleCheck } from '@element-plus/icons-vue';

export type AdminTimelineState = 'done' | 'active' | 'pending';

export interface AdminTimelineItem {
  key: string;
  title: string;
  time?: string;
  description?: string;
  state: AdminTimelineState;
}

defineProps<{
  title?: string;
  items: AdminTimelineItem[];
}>();

const getIcon = (item: AdminTimelineItem): Component | undefined =>
  item.state === 'done' ? CircleCheck : undefined;

const getType = (item: AdminTimelineItem) => {
  if (item.state === 'done') return 'success';
  if (item.state === 'active') return 'primary';
  return 'info';
};

const getColor = (item: AdminTimelineItem) => {
  if (item.state === 'done') return '#0ea5a2';
  if (item.state === 'active') return '#126df0';
  return '#b8c4d4';
};
</script>

<style scoped lang="scss">
.admin-timeline {
  &__title {
    margin: 0 0 28px;
    color: var(--app-text-heading);
    font-size: 24px;
    font-weight: 700;
  }

  :deep(.el-timeline) {
    padding-left: 4px;
  }

  :deep(.el-timeline-item) {
    padding-bottom: 34px;
  }

  :deep(.el-timeline-item:last-child) {
    padding-bottom: 0;
  }

  :deep(.el-timeline-item__node) {
    box-shadow: 0 0 0 4px #fff;
  }

  :deep(.el-timeline-item__node--large) {
    left: -3px;
    width: 20px;
    height: 20px;
  }

  :deep(.el-timeline-item__icon) {
    color: #fff;
    font-size: 13px;
  }

  :deep(.el-timeline-item__wrapper) {
    top: -3px;
    padding-left: 26px;
  }

  &__content {
    strong {
      display: block;
      color: var(--app-text-body);
      font-size: 17px;
      font-weight: 600;
    }

    time,
    p {
      display: block;
      margin-top: 8px;
      color: var(--app-text-label);
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
    }

    p {
      margin-bottom: 0;
    }

    &.is-active strong {
      color: #126df0;
    }

    &.is-pending strong {
      color: #475569;
    }
  }

  @include mobile {
    &__title {
      font-size: 22px;
    }

    :deep(.el-timeline-item) {
      padding-bottom: 28px;
    }
  }
}
</style>
