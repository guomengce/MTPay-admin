<template>
  <router-view />
  <Transition name="app-loading-fade">
    <div v-if="active" class="app-route-loading" role="status" aria-label="頁面加載中">
      <span class="app-route-loading__spinner" aria-hidden="true"></span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePageLoadingStore } from '@/stores/modules/pageLoading';

const { active } = storeToRefs(usePageLoadingStore());
</script>

<style lang="scss">
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
}

.app-route-loading {
  position: fixed;
  z-index: 10000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f7fb;

  &__spinner {
    width: 38px;
    height: 38px;
    box-sizing: border-box;
    border: 3px solid rgb(9 158 151 / 16%);
    border-top-color: #099e97;
    border-radius: 50%;
    animation: app-route-spin 0.75s linear infinite;
  }
}

.app-loading-fade-leave-active {
  transition: opacity 0.18s ease;
}

.app-loading-fade-leave-to {
  opacity: 0;
}

@keyframes app-route-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .app-route-loading__spinner { animation-duration: 1.5s; }
}
</style>