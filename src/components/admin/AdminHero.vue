<template>
  <header class="admin-hero">
    <div class="admin-hero__main">
      <span class="admin-hero__icon">
        <el-icon><component :is="icon" /></el-icon>
      </span>
      <div>
        <h1>{{ title }}</h1>
      </div>
    </div>
    <slot name="extra" />
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  icon: unknown;
}>();
</script>

<style scoped lang="scss">
.admin-hero {
  position: relative;
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  overflow: hidden;

  &__main {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 14px;
  }

  &__icon {
    display: inline-flex;
    width: 48px;
    height: 48px;
    flex: 0 0 48px;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    color: #126df0;
    background: linear-gradient(135deg, #dff3ff, #eef0ff);
    // box-shadow: 0 20px 38px rgb(27 98 198 / 12%);
    font-size: 26px;
  }

  h1 {
    margin: 0;
    color: var(--app-text-heading);
    font-size: 26px;
    font-weight: 700;
    line-height: 1.15;
  }

  @include mobile {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;

    &__main {
      align-items: flex-start;
      gap: 11px;
    }

    &__icon {
      width: 42px;
      height: 42px;
      flex-basis: 42px;
      border-radius: 12px;
      font-size: 22px;
    }

    h1 {
      margin-bottom: 0;
      font-size: 22px;
      line-height: 1.18;
    }

  }
}
</style>
