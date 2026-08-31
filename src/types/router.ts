import type { RouteRecordRaw } from 'vue-router';

export interface AppRouteMeta {
  title: string;
  icon: string;
  description?: string;
  subtitle?: string;
  requiresAuth: boolean;
  hidden: boolean;
  showPageHeader?: boolean;
  menuGroup?: { path: string; title: string; icon: string };
}

export type AppRouteRecordRaw = RouteRecordRaw & {
  meta: AppRouteMeta;
};

export interface MenuItem {
  path: string;
  title: string;
  icon: string;
  children?: MenuItem[];
}
