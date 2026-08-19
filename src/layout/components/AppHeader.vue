<template>
  <header class="app-header">
    <div class="app-header__left">
      <el-button
        class="app-header__collapse"
        :icon="Fold"
        circle
        text
        @click="appStore.toggleSidebar"
      />
      <div class="app-header__crumb">
        <span>平台管理</span>
        <el-icon><ArrowRight /></el-icon>
        <strong>{{ pageTitle }}</strong>
      </div>
    </div>

    <div class="app-header__right">
      <el-button class="app-header__bell" :icon="Bell" circle text />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowRight, Bell, Fold, TopRight } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import { useAppStore } from '@/stores/modules/app';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const pageTitle = computed(() => String(route.meta.title || '营运总览'));

async function goAdmin() {
  await router.push('/dashboard');
}
</script>

<style scoped lang="scss">
.app-header {
  display: flex;
  height: 72px;
  min-height: 72px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0 32px;
  background: rgb(255 255 255 / 92%);
  border-bottom: 1px solid #dce5ef;
  backdrop-filter: blur(16px);

  &__left,
  &__right,
  &__crumb {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 14px;
  }

  &__collapse {
    display: none;
  }

  &__crumb {
    color: #7d8aa0;
    font-size: 14px;
    font-weight: 500;

    strong {
      color: var(--app-text-body);
    }
  }

  &__status {
    height: 38px;
    padding: 0 14px;
    color: #008f83;
    background: #f0fbf8;
    border-color: #cfe9e4;
    font-weight: 600;
  }

  &__dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin-right: 8px;
    background: #0aa39a;
    border-radius: 50%;
  }

  &__bell {
    color: #10213c;
    font-size: 20px;
  }

  &__admin {
    height: 38px;
    padding: 0 16px;
    border-color: #d8e1ec;
    border-radius: 8px;
    color: #14223a;
    font-weight: 600;
  }

  @include narrow {
    padding: 0 24px;
  }

  @include mobile {
    height: 64px;
    min-height: 64px;
    padding: 0 14px;

    &__collapse {
      display: inline-flex;
    }

    &__crumb span,
    &__crumb .el-icon,
    &__status,
    &__bell {
      display: none;
    }

    &__admin {
      padding: 0 10px;
    }
  }
}
</style>
