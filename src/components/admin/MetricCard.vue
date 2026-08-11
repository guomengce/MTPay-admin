<template>
  <article class="metric-card" :class="`metric-card--${tone}`">
    <div class="metric-card__body">
      <p class="metric-card__label">
        {{ label }}
        <span v-if="badge">{{ badge }}</span>
      </p>
      <strong>{{ value }}</strong>
      <small>{{ subtext }}</small>
    </div>
    <span class="metric-card__icon" aria-hidden="true">
      <el-icon><component :is="icon" /></el-icon>
    </span>
  </article>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    subtext: string;
    badge?: string;
    icon: unknown;
    tone?: 'teal' | 'blue' | 'purple' | 'amber';
  }>(),
  {
    badge: '',
    tone: 'teal',
  },
);
</script>

<style scoped lang="scss">
.metric-card {
  position: relative;
  min-width: 0;
  padding: 24px;
  border: 1px solid #d8e4ef;
  border-radius: 8px;
  background: radial-gradient(circle at 100% 0, rgb(255 255 255 / 80%), transparent 30%), #ffffff;
  box-shadow: 0 16px 38px rgb(19 40 74 / 6%);

  &__body {
    min-width: 0;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 14px;
    padding-right: 76px; /* 给绝对定位的 icon 留出空间，避免文字与图标重叠 */
    color: #243554;
    font-weight: 850;

    span {
      display: inline-flex;
      height: 24px;
      align-items: center;
      padding: 0 9px;
      border-radius: 8px;
      color: var(--tone);
      background: color-mix(in srgb, var(--tone) 13%, white);
      font-size: 12px;
    }
  }

  strong {
    display: block;
    color: #071833;
    font-size: 32px;
    line-height: 1.05;
  }

  small {
    display: block;
    margin-top: 10px;
    color: #61708a;
    font-size: 14px;
    font-weight: 650;
  }

  &__icon {
    position: absolute;
    top: 20px;
    right: 20px;
    display: inline-flex;
    width: 60px;
    height: 60px;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    color: var(--tone);
    background: color-mix(in srgb, var(--tone) 12%, white);
    font-size: 30px;
  }

  &--teal {
    --tone: #0aa99a;
  }

  &--blue {
    --tone: #1f73f2;
  }

  &--purple {
    --tone: #7a52e8;
  }

  &--amber {
    --tone: #f58a13;
  }

  @include mobile {
    padding: 18px;

    strong {
      font-size: 26px;
    }

    &__icon {
      top: 16px;
      right: 16px;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      font-size: 24px;
    }

    &__label {
      padding-right: 60px;
    }
  }
}
</style>