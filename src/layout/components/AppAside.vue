<template>
  <aside class="app-aside">
    <div class="app-aside__brand">
      <img class="app-aside__logo" src="/assets/mtpay-logo.png" alt="MTPay" />
    </div>
    <el-menu class="app-aside__menu" :default-active="activeMenuPath" :default-openeds="openedMenus" :collapse="isCollapsed" router>
      <template v-for="menu in routeStore.menus" :key="menu.path">
        <el-sub-menu v-if="menu.children?.length" :index="menu.path">
          <template #title>
            <span class="app-aside__icon"><el-icon><component :is="resolveIcon(menu.icon)" /></el-icon></span>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item v-for="child in menu.children" :key="child.path" :index="child.path" class="app-aside__submenu-item">
            <span class="app-aside__child-icon"><el-icon><component :is="resolveIcon(child.icon)" /></el-icon></span>
            <template #title><span>{{ child.title }}</span></template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="menu.path">
          <span class="app-aside__icon"><el-icon><component :is="resolveIcon(menu.icon)" /></el-icon></span>
          <template #title><span>{{ menu.title }}</span></template>
        </el-menu-item>
      </template>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import {
  Coin,
  Calendar,
  Grid,
  List,
  Lock,
  Key,
  Money,
  Postcard,
  Switch,
  Tickets,
  Upload,
  User,
  Wallet,
  WarningFilled,
} from '@element-plus/icons-vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useAppStore } from '@/stores/modules/app';
import { useRouteStore } from '@/stores/modules/route';

const route = useRoute();
const appStore = useAppStore();
const routeStore = useRouteStore();
const isCollapsed = computed(() => appStore.sidebarCollapsed && appStore.device !== 'mobile');
const activeMenuPath = computed(() => String(route.meta.activeMenu || route.path));
const openedMenus = computed(() => routeStore.menus.filter((menu) => menu.children?.some((child) => child.path === activeMenuPath.value)).map((menu) => menu.path));

const icons = {
  Calendar,
  Coin,
  Grid,
  List,
  Lock,
  Key,
  Money,
  Postcard,
  Switch,
  Tickets,
  Upload,
  User,
  Wallet,
  WarningFilled,
};

function resolveIcon(name: string) {
  return icons[name as keyof typeof icons] || Grid;
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
    position: relative;
    display: flex;
    min-height: 52px;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgb(125 163 214 / 20%);
  }

  &__brand::before {
    position: absolute;
    inset: -24px -14px -12px;
    z-index: 0;
    background: radial-gradient(
      ellipse at 50% 48%,
      rgb(94 207 239 / 36%) 0%,
      rgb(48 137 188 / 14%) 48%,
      transparent 76%
    );
    content: '';
    filter: blur(8px);
    pointer-events: none;
  }

  &__logo {
    position: relative;
    z-index: 1;
    display: block;
    width: 156px;
    max-width: 100%;
    height: auto;
    margin: 0 auto;
    filter:
      brightness(1.08)
      drop-shadow(0 2px 7px rgb(71 199 236 / 24%));
  }

  &__mark {
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

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 50px;
    margin: 10px 0;
    padding: 0 10px !important;
    color: #d8e4f6;
    border-radius: 8px;
    font-weight: 600;
  }

  :deep(.el-sub-menu__title:hover) { background: rgb(255 255 255 / 8%); }
  :deep(.el-sub-menu .el-menu) { background: transparent; }
  :deep(.el-sub-menu.is-active > .el-sub-menu__title) { color: #8eece7; }
  :deep(.app-aside__submenu-item) { height: 42px; margin: 4px 0 4px 18px; color: #bfd0e5; }
  :deep(.app-aside__submenu-item.is-active) { color: #39f5ec; }

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
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
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

  &__child-icon {
    display: inline-flex;
    width: 30px;
    align-items: center;
    justify-content: center;
    margin-right: 9px;
    font-size: 17px;
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

}
</style>
