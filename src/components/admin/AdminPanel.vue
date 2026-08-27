<template>
  <section class="admin-panel">
    <header v-if="title || $slots.extra" class="admin-panel__header">
      <div class="admin-panel__title">
        <span v-if="icon" class="admin-panel__icon">
          <el-icon><component :is="icon" /></el-icon>
        </span>
        <h2 v-if="title">{{ title }}</h2>
      </div>
      <slot name="extra" />
    </header>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
  icon?: unknown;
}>();
</script>

<style scoped lang="scss">
.admin-panel {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #dce5ef;
  border-radius: 20px;
  background: rgb(255 255 255 / 94%);
  box-shadow: 0 18px 42px rgb(16 42 80 / 7%);

  &__header {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 24px;
    border-bottom: 1px solid #e2e9f2;
  }

  &__title {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 16px;
  }

  &__icon {
    display: inline-flex;
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    color: #1f73f2;
    background: linear-gradient(135deg, #e9f4ff, #eef0ff);
    font-size: 26px;
  }

  h2 {
    margin: 0;
    color: var(--app-text-heading);
    font-size: 20px;
    font-weight: 700;
  }

  @include mobile {
    &__header {
      align-items: flex-start;
      flex-direction: column;
      padding: 18px;
    }

    h2 {
      font-size: 20px;
    }
  }
}
</style>
