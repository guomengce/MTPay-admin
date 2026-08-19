<template>
  <aside class="app-aside">
    <div class="app-aside__brand">
      <span class="app-aside__mark">M</span>
      <div v-if="!isCollapsed" class="app-aside__brand-text">
        <strong>MTPay-Admin</strong>
        <span>ADMIN CONSOLE</span>
      </div>
    </div>
    <el-menu class="app-aside__menu" :default-active="activeMenuPath" :collapse="isCollapsed" router>
      <el-menu-item v-for="menu in routeStore.menus" :key="menu.path" :index="menu.path">
        <span class="app-aside__icon">
          <el-icon><component :is="resolveIcon(menu.icon)" /></el-icon>
        </span>
        <template #title>
          <span>{{ menu.title }}</span>
        </template>
      </el-menu-item>
    </el-menu>

    <div class="app-aside__profile">
      <div class="app-aside__profile-main">
        <span class="app-aside__avatar">{{ adminInitial }}</span>
        <div v-if="!isCollapsed">
          <strong>{{ adminName }}</strong>
          <span>{{ adminEmail }}</span>
        </div>
      </div>
      <el-button class="app-aside__logout" text @click="handleLogout">
        <el-icon><SwitchButton /></el-icon>
        <span v-if="!isCollapsed">登出</span>
      </el-button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  Grid,
  List,
  Money,
  Switch,
  SwitchButton,
  Tickets,
  Upload,
  User,
  Wallet,
} from '@element-plus/icons-vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAppStore } from '@/stores/modules/app';
import { useAuthStore } from '@/stores/modules/auth';
import { useRouteStore } from '@/stores/modules/route';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();
const routeStore = useRouteStore();
const isCollapsed = computed(() => appStore.sidebarCollapsed && appStore.device !== 'mobile');
const activeMenuPath = computed(() => String(route.meta.activeMenu || route.path));
const adminName = computed(() => authStore.userInfo?.name || 'MTPay 管理员');
const adminEmail = computed(() => authStore.userInfo?.email || '—');
const adminInitial = computed(() => adminName.value.trim().charAt(0).toUpperCase() || 'M');

const icons = {
  Grid,
  List,
  Money,
  Switch,
  Tickets,
  Upload,
  User,
  Wallet,
};

function resolveIcon(name: string) {
  return icons[name as keyof typeof icons] || Grid;
}

async function handleLogout() {
  authStore.logout();
  await router.replace({ name: 'Login' });
}
</script>

<style scoped lang="scss">
.app-aside {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  flex-direction: column;
  padding: 22px 14px 16px;
  color: #ffffff;
  background:
    radial-gradient(circle at 12% 0, rgb(31 197 203 / 24%), transparent 22%),
    radial-gradient(circle at 90% 22%, rgb(37 116 255 / 22%), transparent 28%),
    linear-gradient(180deg, #061d3d 0%, #02132f 100%);
  box-shadow: 1px 0 0 rgb(255 255 255 / 8%) inset;

  &__brand {
    display: flex;
    min-height: 52px;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgb(125 163 214 / 20%);
  }

  &__mark,
  &__avatar {
    display: inline-flex;
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: #00152d;
    background: linear-gradient(135deg, #23dac7, #10aab8);
    box-shadow: 0 12px 30px rgb(20 221 201 / 26%);
    font-weight: 600;
  }

  &__brand-text {
    display: grid;
    gap: 4px;

    strong {
      font-size: 25px;
      line-height: 1;
    }

    span {
      color: #c4d7ef;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.4px;
    }
  }

  &__menu {
    flex: 1;
    min-width: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background: transparent;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
  }

  :deep(.el-menu-item) {
    height: 50px;
    margin: 14px 0;
    padding: 0 10px !important;
    color: #d8e4f6;
    border-radius: 8px;
    font-weight: 600;
  }

  :deep(.el-menu-item .el-icon) {
    width: 22px;
    height: 22px;
    margin-right: 0;
    color: #d8e9ff;
    font-size: 22px;
  }

  :deep(.el-menu-item.is-active) {
    position: relative;
    overflow: hidden;
    color: #39f5ec;
    border: 1px solid rgb(35 224 231 / 64%);
    background:
      linear-gradient(90deg, rgb(22 231 217 / 18%), rgb(4 35 73 / 28%) 42%, rgb(7 36 72 / 12%)),
      rgb(3 28 62 / 22%);
    box-shadow:
      0 0 0 1px rgb(35 224 231 / 10%) inset,
      4px 0 14px rgb(38 240 225 / 34%) inset,
      0 0 22px rgb(22 218 225 / 18%);
  }

  :deep(.el-menu-item.is-active) .app-aside__icon {
    border-radius: 50%;
  }

  :deep(.el-menu-item:hover) {
    background: rgb(255 255 255 / 8%);
  }

  :deep(.el-menu-tooltip__trigger) {
    justify-content: center;
  }

  &__icon {
    position: relative;
    display: inline-flex;
    width: 46px;
    height: 46px;
    flex: 0 0 46px;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    overflow: hidden;
    border: 1px solid rgb(65 135 191 / 28%);
    border-radius: 12px;
    background: linear-gradient(180deg, rgb(20 69 112 / 70%), rgb(7 37 70 / 88%)), #08284b;
    box-shadow:
      0 0 0 1px rgb(255 255 255 / 4%) inset,
      0 12px 24px rgb(0 0 0 / 18%);
  }

  &__icon::before {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0, rgb(33 196 217 / 24%), transparent 58%);
    content: '';
  }

  &__badge {
    display: inline-flex;
    min-width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    padding: 0 6px;
    border-radius: 999px;
    color: #ffffff;
    background: #ff4d4f;
    font-size: 12px;
    font-style: normal;
    line-height: 20px;
  }

  &__profile {
    overflow: hidden;
    border: 1px solid rgb(125 163 214 / 20%);
    border-radius: 8px;
    background: rgb(17 50 94 / 36%);
  }

  &__profile-main {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 12px;
    border-bottom: 1px solid rgb(125 163 214 / 14%);

    div {
      display: grid;
      min-width: 0;
      flex: 1;
      gap: 4px;
    }

    strong,
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      color: #b2c0d5;
      font-size: 12px;
    }
  }

  &__logout {
    width: 100%;
    justify-content: center;
    padding: 18px 14px;
    color: #d8e4f6;
    font-weight: 600;
    // border: 1px solid #15c4b9;
  }
}
</style>
