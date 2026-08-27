import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import Layout from '@/layout/index.vue';
import { featureRoutes } from './modules';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      icon: '',
      requiresAuth: false,
      hidden: true,
    },
  },
  {
    path: '/two-factor', name: 'TwoFactor',
    component: () => import('@/views/login/two-factor.vue'),
    meta: { title: '雙重認證', icon: '', requiresAuth: false, hidden: true },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      title: 'MTPay',
      icon: '',
      requiresAuth: true,
      hidden: true,
    },
    children: featureRoutes,
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '无权访问',
      icon: '',
      requiresAuth: false,
      hidden: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      icon: '',
      requiresAuth: false,
      hidden: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

export default router;
