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
      <NotificationPopover>
        <button class="app-header__bell" type="button" :aria-label="unreadCount ? `通知，${unreadCount} 条未读` : '通知'">
          <el-icon><Bell /></el-icon>
          <span v-if="unreadCount" class="app-header__bell-count">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
        </button>
      </NotificationPopover>
      <span class="app-header__divider" aria-hidden="true" />
      <el-dropdown trigger="click" @command="handleUserCommand">
        <button class="app-header__user-btn" type="button">
          <span class="app-header__avatar">{{ adminInitial }}</span>
          <span class="app-header__user-name">{{ adminName }}</span>
          <el-icon class="app-header__user-caret"><ArrowDown /></el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>
              <span class="app-header__user-email">{{ adminEmail }}</span>
            </el-dropdown-item>
            <el-dropdown-item command="account">
              <el-icon><Lock /></el-icon><span>账户与安全</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon><span>登出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowDown, ArrowRight, Bell, Fold, Lock, SwitchButton } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';
import NotificationPopover from './NotificationPopover.vue';
import { useNotifications } from '@/views/notifications/composables/useNotifications';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();
const { unreadCount } = useNotifications();

const pageTitle = computed(() => String(route.meta.title || '营运总览'));
const adminName = computed(() => authStore.userInfo?.name || 'MTPay管理員');
const adminEmail = computed(() => authStore.userInfo?.email || '—');
const adminInitial = computed(() => adminName.value.trim().charAt(0).toUpperCase() || 'M');

async function handleUserCommand(command: string) {
  if (command === 'account') { await router.push({ name: 'Account' }); return; }
  if (command !== 'logout') return;
  authStore.logout();
  await router.replace({ name: 'Login' }).catch(() => undefined);
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
    position: relative;
    display: grid;
    width: 40px;
    height: 40px;
    place-items: center;
    border: 1px solid #d8e3ef;
    border-radius: 12px;
    background: #fff;
    color: #10213c;
    font-size: 20px;
    cursor: pointer;
    &:hover { background: #f1f8fc; }
    &:focus-visible { outline: 2px solid #079d98; outline-offset: 2px; }
  }

  &__bell-count {
    position: absolute;
    top: -5px;
    right: -5px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    border-radius: 10px;
    background: #ef4444;
    color: #fff;
    box-shadow: 0 0 0 2px #fff;
    font-size: 11px;
    line-height: 18px;
    text-align: center;
  }

  &__divider { width: 1px; height: 22px; background: #dce5ef; }

  &__user-btn {
    display: inline-flex;
    height: 42px;
    align-items: center;
    gap: 8px;
    padding: 0 10px 0 6px;
    border: 0;
    border-radius: 999px;
    color: var(--app-text-body);
    background: #fff;
    box-shadow: 0 4px 14px rgb(28 77 120 / 7%);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  &__avatar {
    display: inline-flex;
    width: 32px;
    height: 32px;
    flex: 0 0 32px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #087f78;
    background: linear-gradient(135deg, #d9f7f2, #e6f2ff);
    font-size: 13px;
    font-weight: 800;
  }

  &__user-name { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  &__user-caret { color: var(--app-text-label); }
  &__user-email { max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

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
    &__divider,
    &__user-name {
      display: none;
    }

    &__admin {
      padding: 0 10px;
    }
  }
}
</style>
