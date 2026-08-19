<template>
  <section class="detail-hero" :class="{ 'is-compact': compact }">
    <div v-if="compact" class="detail-hero__compact-header">
      <div class="detail-hero__compact-main">
        <el-button
          class="detail-hero__compact-back"
          plain
          :icon="ArrowLeft"
          @click="emit('back')"
        />
        <div class="detail-hero__compact-content">
          <h1>{{ title }}</h1>
          <div class="detail-hero__compact-meta">
            <span v-if="orderId" class="detail-hero__compact-order-label">{{ order }}</span>
            <strong v-if="orderId">{{ orderId }}</strong>
            <StatusBadge
              v-if="status"
              :label="status.label"
              :type="status.type"
              :effect="status.effect"
            />
          </div>
        </div>
      </div>
      <div v-if="actions.length" class="detail-hero__compact-actions">
        <el-button
          v-for="action in actions"
          :key="action.emitName"
          :type="action.type"
          :icon="action.icon"
          @click="emit(action.emitName)"
        >
          {{ action.label }}
        </el-button>
      </div>
    </div>

    <div v-else class="detail-hero__header">
      <div class="detail-hero__identity">
        <el-button class="detail-hero__back" plain :icon="ArrowLeft" @click="emit('back')" />

        <div class="detail-hero__title">
          <h1>{{ title }}</h1>
          <p>{{ description }}</p>
        </div>
      </div>

      <div v-if="orderId || status || actions.length" class="detail-hero__controls">
        <StatusBadge
          v-if="status"
          class="detail-hero__status"
          :label="status.label"
          :type="status.type"
          :effect="status.effect"
        />
        <div v-if="orderId" class="detail-hero__order">
          <span class="detail-hero__order-icon">
            <Tickets />
          </span>
          <span class="detail-hero__order-label">{{ order }}</span>
          <strong class="detail-hero__order-id">{{ orderId }}</strong>
        </div>
        <div v-if="actions.length" class="detail-hero__actions">
          <el-button
            v-for="action in actions"
            :key="action.emitName"
            :type="action.type"
            :icon="action.icon"
            @click="emit(action.emitName)"
          >
            {{ action.label }}
          </el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowLeft, Tickets } from '@element-plus/icons-vue';

import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeEffect, StatusBadgeType } from '@/components/admin/StatusBadge.vue';

export interface HeroAction {
  label: string;
  icon?: unknown;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'plain';
  emitName: 'approve' | 'reject' | 'supplement' | 'complete' | 'return' | 'payment' | 'append';
}

export interface HeroStatus {
  label: string;
  type: StatusBadgeType;
  effect?: StatusBadgeEffect;
}

withDefaults(
  defineProps<{
    title: string;
    description: string;
    order: string;
    orderId: string;
    compact?: boolean;
    status?: HeroStatus;
    actions?: HeroAction[];
  }>(),
  { compact: false, status: undefined, actions: () => [] },
);

const emit = defineEmits<{
  (e: 'back' | HeroAction['emitName']): void;
}>();
</script>

<style scoped lang="scss">
.detail-hero {
  position: relative;
  overflow: hidden;
  padding: 26px 36px;
  border: 1px solid #dce7f5;
  border-radius: 0 0 18px 18px;
  background:
    radial-gradient(circle at 56% 52%, rgb(18 109 240 / 10%), transparent 26%),
    linear-gradient(135deg, #ffffff 0%, #f7fbff 58%, #eef7ff 100%);
  box-shadow: 0 12px 30px rgb(15 23 42 / 8%);

  &::after {
    position: absolute;
    right: 30%;
    bottom: -56px;
    width: 290px;
    height: 200px;
    border: 1px solid rgb(18 109 240 / 10%);
    border-radius: 50%;
    content: '';
    transform: rotate(-18deg);
  }

  &__header,
  &__controls,
  &__identity,
  &__title,
  &__order,
  &__actions {
    position: relative;
    z-index: 1;
  }

  /* 审核详情紧凑头部：只调整排版，状态徽标与业务按钮继续使用公共组件样式。 */
  &.is-compact {
    padding: 22px 28px;
    border-radius: 14px;
    background: linear-gradient(105deg, #ffffff 0%, #f8fbff 66%, #f2f7fc 100%);

    &::after {
      display: none;
    }
  }

  &__compact-header,
  &__compact-main,
  &__compact-meta,
  &__compact-actions {
    display: flex;
    align-items: center;
  }

  &__compact-header {
    position: relative;
    z-index: 1;
    min-width: 0;
    justify-content: space-between;
    gap: 28px;
  }

  &__compact-main {
    min-width: 0;
    gap: 20px;
  }

  &__compact-back {
    width: 40px;
    height: 40px;
    min-width: 40px;
    flex: none;
    padding: 0;
    border-radius: 8px;
  }

  &__compact-content {
    min-width: 0;

    h1 {
      margin: 0;
      color: var(--app-text-heading);
      font-size: 22px;
      font-weight: 700;
      line-height: 1.25;
    }
  }

  &__compact-meta {
    min-width: 0;
    gap: 12px;
    margin-top: 10px;
    color: var(--app-text-label);
    font-size: 13px;

    strong {
      overflow: hidden;
      color: var(--app-text-body);
      font-size: 13px;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__compact-order-label {
    flex: none;
  }

  &__compact-actions {
    flex: none;
    gap: 10px;

    :deep(.el-button + .el-button) {
      margin-left: 0;
    }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
  }

  &__identity {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1 1 auto;
    min-width: 0;
  }

  &__back {
    width: 60px;
    height: 60px;
    min-width: 60px;
    flex: none;
    padding: 0;
    border-radius: 14px;
  }

  &__title {
    display: grid;
    align-content: center;
    min-width: 0;

    h1 {
      min-width: 0;
      margin: 0 0 6px;
      overflow-wrap: anywhere;
      color: var(--app-text-heading);
      font-size: 28px;
      font-weight: 700;
      line-height: 1.2;
    }

    p {
      margin: 0;
      color: var(--app-text-label);
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
    }
  }

  &__controls {
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }

  &__order {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border: 1px solid #dce7f5;
    border-radius: 999px;
    background: rgb(255 255 255 / 72%);
    color: var(--app-text-label);
    font-size: 13px;
    font-weight: 400;
    line-height: 1;
  }

  &__order-icon {
    display: inline-flex;
    width: 22px;
    height: 22px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    color: #079d96;
    background: rgb(57 245 236 / 14%);
    font-size: 13px;
  }

  &__order-label {
    color: #94a3b8;
  }

  &__order-id {
    color: var(--app-text-heading);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  &__status {
    height: 38px;
    flex: none;
    padding: 0 18px;
    border-radius: 999px;
    font-size: 14px;
  }

  &__actions {
    display: flex;
    flex: none;
    gap: 10px;
  }

  @include narrow {
    padding: 22px 28px;

    &__identity {
      gap: 14px;
    }

    &__back {
      width: 52px;
      height: 52px;
      min-width: 52px;
      border-radius: 12px;
    }

    &__title h1 {
      font-size: 24px;
    }

    &__title p {
      font-size: 13px;
    }

    &__controls {
      gap: 10px;
    }

    &__status {
      height: 34px;
      padding: 0 14px;
      font-size: 13px;
    }

    &__actions {
      gap: 8px;
    }

    &__order {
      padding: 5px 12px;
      font-size: 12px;
    }

    &.is-compact {
      padding: 20px 24px;
    }
  }

  @include mobile {
    padding: 18px;

    &__header {
      align-items: stretch;
      flex-direction: column;
      gap: 16px;
    }

    &__identity {
      gap: 12px;
    }

    &__back {
      width: 44px;
      height: 44px;
      min-width: 44px;
      border-radius: 10px;
    }

    &__title h1 {
      font-size: 20px;
    }

    &__title p {
      font-size: 13px;
      line-height: 1.45;
    }

    &__controls {
      align-items: stretch;
      gap: 10px;
    }

    &__order {
      align-self: flex-start;
    }

    &__status {
      align-self: flex-start;
      height: 32px;
      padding: 0 14px;
      font-size: 13px;
    }

    &__actions {
      gap: 8px;
    }

    &__actions > * {
      flex: 1;
    }

    &.is-compact {
      padding: 18px;
    }

    &__compact-header {
      align-items: stretch;
      flex-direction: column;
      gap: 16px;
    }

    &__compact-main {
      align-items: flex-start;
      gap: 12px;
    }

    &__compact-content h1 {
      font-size: 20px;
    }

    &__compact-meta {
      flex-wrap: wrap;
      gap: 8px 10px;
    }

    &__compact-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));

      > :deep(.el-button) {
        width: 100%;
        min-width: 0;
      }

      > :last-child:nth-child(odd) {
        grid-column: 1 / -1;
      }
    }
  }
}

@media (max-width: 480px) {
  .detail-hero__compact-actions {
    grid-template-columns: 1fr;

    > :last-child:nth-child(odd) {
      grid-column: auto;
    }
  }
}
</style>
