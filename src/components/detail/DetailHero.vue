<template>
  <section class="detail-hero">
    <div class="detail-hero__header">
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

export interface HeroAction {
  label: string;
  icon?: unknown;
  type?: 'primary' | 'danger' | 'plain';
  emitName: string;
}

export interface HeroStatus {
  label: string;
  type: string;
  effect?: string;
}

withDefaults(
  defineProps<{
    title: string;
    description: string;
    order: string;
    orderId: string;
    status?: HeroStatus;
    actions?: HeroAction[];
  }>(),
  { status: undefined, actions: () => [] },
);

// 动态 emit 名（action.emitName）+ 固定 back，使用宽松 emits 类型。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const emit = defineEmits<{ (e: string): void }>();
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
      color: #061936;
      font-size: 28px;
      font-weight: 950;
      line-height: 1.2;
    }

    p {
      margin: 0;
      color: #66758b;
      font-size: 14px;
      font-weight: 700;
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
    color: #66758b;
    font-size: 13px;
    font-weight: 800;
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
    color: #061936;
    font-size: 14px;
    font-weight: 950;
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
  }
}
</style>
