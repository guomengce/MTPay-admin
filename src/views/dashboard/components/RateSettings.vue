<template>
  <AdminPanel title="当前设定">
    <template #extra>
      <RouterLink class="settings-manage" to="/fee">
        <el-icon><Setting /></el-icon>
        <span>管理</span>
      </RouterLink>
    </template>
    <ul class="settings-list">
      <li class="settings-list__item">
        <span class="settings-list__icon settings-list__icon--teal">T</span>
        <span class="settings-list__label">USDT 预设比例</span>
        <span class="settings-list__divider" aria-hidden="true" />
        <span class="settings-list__value">0.9900</span>
      </li>
      <li class="settings-list__item">
        <span class="settings-list__icon settings-list__icon--blue">$</span>
        <span class="settings-list__label">USDC 预设比例</span>
        <span class="settings-list__divider" aria-hidden="true" />
        <span class="settings-list__value">0.9900</span>
      </li>
      <li class="settings-list__item">
        <span class="settings-list__icon settings-list__icon--indigo">
          <el-icon><Wallet /></el-icon>
        </span>
        <span class="settings-list__label">固定出金费</span>
        <span class="settings-list__divider" aria-hidden="true" />
        <span class="settings-list__value">50.00 USD</span>
      </li>
    </ul>
  </AdminPanel>
</template>

<script setup lang="ts">
import { Setting, Wallet } from '@element-plus/icons-vue';
import { RouterLink } from 'vue-router';

import AdminPanel from '@/components/admin/AdminPanel.vue';
</script>

<style scoped lang="scss">
.settings-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 22px 24px 24px;

  &__item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    border: 1px solid #e6edf5;
    border-radius: 10px;
    background: #fcfdff;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;

    &:hover {
      border-color: #cfd9e6;
      box-shadow: 0 4px 14px rgb(15 42 80 / 4%);
    }
  }

  &__icon {
    display: inline-flex;
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 17px;
    font-weight: 950;
    line-height: 1;

    &--teal {
      color: var(--app-primary);
      background: color-mix(in srgb, var(--app-primary) 12%, white);
    }

    &--blue {
      color: #2e6bf5;
      background: color-mix(in srgb, #2e6bf5 12%, white);
    }

    &--indigo {
      color: #4664f0;
      background: color-mix(in srgb, #4664f0 12%, white);
      font-size: 18px;
    }
  }

  &__label {
    flex: 1;
    min-width: 0;
    color: #243554;
    font-size: 14px;
    font-weight: 700;
  }

  &__divider {
    width: 1px;
    height: 18px;
    background: #e2e9f2;
  }

  &__value {
    color: #0b1b35;
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 0.3px;
  }
}

.settings-manage {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  color: #2e6bf5;
  background: color-mix(in srgb, #2e6bf5 10%, white);
  font-size: 13px;
  font-weight: 800;
  transition: background 0.18s ease;

  &:hover {
    background: color-mix(in srgb, #2e6bf5 18%, white);
  }

  .el-icon {
    font-size: 14px;
  }
}

/* 标题左侧的青色竖条 */
:deep(.admin-panel__title) {
  position: relative;
  padding-left: 12px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 18px;
    border-radius: 2px;
    background: var(--app-primary);
  }
}
</style>