import type { RouteRecordRaw } from 'vue-router';

export const featureRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/overview/index.vue'),
    meta: {
      title: '营运总览',
      icon: 'Grid',
      requiresAuth: true,
      hidden: false,
      keepAlive: true,
    },
  },
  {
    path: '/agent',
    name: 'Agent',
    component: () => import('@/views/agent/index.vue'),
    meta: {
      title: '代理帐户',
      icon: 'User',
      requiresAuth: true,
      hidden: false,
      keepAlive: false,
    },
  },
  {
    path: '/deposit',
    name: 'Deposit',
    component: () => import('@/views/deposit/index.vue'),
    meta: {
      title: '入金审核',
      icon: 'Wallet',
      requiresAuth: true,
      hidden: false,
      keepAlive: false,
    },
  },
  {
    path: '/exchange',
    name: 'Exchange',
    component: () => import('@/views/exchange/index.vue'),
    meta: {
      title: '兑换审核',
      icon: 'Switch',
      requiresAuth: true,
      hidden: false,
      keepAlive: false,
    },
  },
  {
    path: '/whitelist',
    name: 'Whitelist',
    component: () => import('@/views/whitelist/index.vue'),
    meta: {
      title: '白名单审核',
      icon: 'List',
      requiresAuth: true,
      hidden: false,
      keepAlive: false,
    },
  },
  {
    path: '/withdrawal',
    name: 'Withdrawal',
    component: () => import('@/views/withdrawal/index.vue'),
    meta: {
      title: '出金管理',
      icon: 'Upload',
      requiresAuth: true,
      hidden: false,
      keepAlive: false,
    },
  },
  {
    path: '/fee',
    name: 'Fee',
    component: () => import('@/views/fee/index.vue'),
    meta: {
      title: '比例与费用',
      icon: 'Money',
      requiresAuth: true,
      hidden: false,
      keepAlive: false,
    },
  },
  {
    path: '/flow',
    name: 'Flow',
    component: () => import('@/views/flow/index.vue'),
    meta: {
      title: '资金流水',
      icon: 'Tickets',
      requiresAuth: true,
      hidden: false,
      keepAlive: false,
    },
  },
  {
    path: '/log',
    name: 'Log',
    component: () => import('@/views/log/index.vue'),
    meta: {
      title: '操作记录',
      icon: 'List',
      requiresAuth: true,
      hidden: false,
      keepAlive: false,
    },
  },
];
