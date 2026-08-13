<template>
  <header class="admin-hero">
    <div class="admin-hero__main">
      <span class="admin-hero__icon">
        <el-icon><component :is="icon" /></el-icon>
      </span>
      <div>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>
    </div>
    <slot name="extra" />
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
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
  gap: 24px;
  overflow: hidden;

  &__main {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 22px;
  }

  &__icon {
    display: inline-flex;
    width: 62px;
    height: 62px;
    flex: 0 0 62px;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    color: #126df0;
    background: linear-gradient(135deg, #dff3ff, #eef0ff);
    // box-shadow: 0 20px 38px rgb(27 98 198 / 12%);
    font-size: 36px;
  }

  h1 {
    margin: 0 0 8px;
    color: #071833;
    font-size: 30px;
    font-weight: 950;
    line-height: 1.15;
  }

  p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
    font-weight: 700;
  }

  @include mobile {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;

    &__main {
      align-items: flex-start;
      gap: 14px;
    }

    &__icon {
      width: 52px;
      height: 52px;
      flex-basis: 52px;
      border-radius: 15px;
      font-size: 27px;
    }

    h1 {
      margin-bottom: 6px;
      font-size: 24px;
      line-height: 1.18;
    }

    p {
      font-size: 13px;
      line-height: 1.45;
    }
  }
}
</style>
