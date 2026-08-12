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
    <div class="admin-hero__art" aria-hidden="true"></div>
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

  &__art {
    width: 230px;
    height: 85px;
    flex: 0 0 230px;
    opacity: 0.8;
    background:
      radial-gradient(circle at 70% 40%, rgb(67 130 255 / 24%), transparent 30%),
      linear-gradient(135deg, rgb(54 144 255 / 18%), rgb(34 211 190 / 8%));
    clip-path: polygon(15% 20%, 82% 0, 100% 65%, 43% 100%, 0 80%);
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

    &__art {
      position: absolute;
      right: -80px;
      bottom: -40px;
      width: 190px;
      height: 90px;
    }
  }
}
</style>
