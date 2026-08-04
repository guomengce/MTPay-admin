import type { RouteRecordRaw } from 'vue-router';

export interface AppRouteMeta {
  title: string;
  icon: string;
  description?: string;
  subtitle?: string;
  requiresAuth: boolean;
  hidden: boolean;
  keepAlive: boolean;
  showPageHeader?: boolean;
}

export type AppRouteRecordRaw = RouteRecordRaw & {
  meta: AppRouteMeta;
};

export interface MenuItem {
  path: string;
  title: string;
  icon: string;
}
