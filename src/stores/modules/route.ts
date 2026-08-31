import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';

import type { MenuItem } from '@/types/router';

export const useRouteStore = defineStore('route', () => {
  const menus = ref<MenuItem[]>([]);

  function setMenus(value: MenuItem[]) {
    menus.value = value;
  }

  function generateMenus(routes: RouteRecordRaw[]) {
    const nextMenus: MenuItem[] = [];
    routes.filter((route) => !route.meta?.hidden).forEach((route) => {
      const item: MenuItem = {
        path: route.path,
        title: String(route.meta?.title || ''),
        icon: String(route.meta?.icon || ''),
      };
      const group = route.meta?.menuGroup as { path: string; title: string; icon: string } | undefined;
      if (!group) {
        nextMenus.push(item);
        return;
      }
      let parent = nextMenus.find((menu) => menu.path === group.path);
      if (!parent) {
        parent = { ...group, children: [] };
        nextMenus.push(parent);
      }
      parent.children?.push(item);
    });

    setMenus(nextMenus);
    return nextMenus;
  }

  return {
    menus,
    setMenus,
    generateMenus,
  };
});
