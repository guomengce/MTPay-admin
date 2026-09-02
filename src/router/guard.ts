import { getLoginChallenge, clearLoginChallenge } from '@/utils/loginChallenge';
import { appConfig } from '@/config';
import router from '@/router';
import { useAuthStore } from '@/stores/modules/auth';
import { usePageLoadingStore } from '@/stores/modules/pageLoading';

let initialNavigation = true;

router.beforeEach(async (to) => {
  if (initialNavigation) usePageLoadingStore().startRoute();
  const authStore = useAuthStore();
  const title = to.meta?.title ? `${String(to.meta.title)} - ${appConfig.title}` : appConfig.title;
  document.title = title;

  if ((to.name === 'Login' || to.name === 'TwoFactor') && authStore.isLoggedIn) {
    return { path: '/dashboard', replace: true };
  }

  if (to.meta?.requiresAuth && !authStore.isLoggedIn) {
    return {
      name: 'Login',
      query: {
        redirect: to.fullPath,
      },
      replace: true,
    };
  }

  if (to.meta?.requiresAuth && authStore.isLoggedIn && !authStore.permissionReady) {
    try { await authStore.refreshCurrentAdmin(); }
    catch { return { name: 'Login', replace: true }; }
  }
  if (to.meta?.cryptoOnly && !authStore.cryptoEnabled) return { path: '/dashboard', replace: true };

  const menuPermission = String(to.meta?.menuPermission || '');
  if (menuPermission && !authStore.canAccessMenu(menuPermission)) {
    const firstAllowed = ['/dashboard', '/agent', '/currency', '/fiat-deposit', '/whitelist', '/withdrawal', '/transactions', '/permission', '/roles', '/log', '/deposit', '/exchange', '/fee']
      .find((path) => authStore.canAccessMenu(String(router.resolve(path).matched.at(-1)?.meta?.menuPermission || '')));
    return { path: firstAllowed || '/account', replace: true };
  }
  const actionPermission = String(to.meta?.actionPermission || '');
  if (actionPermission && !authStore.canOperate(actionPermission)) return { path: String(to.meta?.activeMenu || '/dashboard'), replace: true };

  if (to.name === 'TwoFactor' && !getLoginChallenge()) return { name: 'Login', replace: true };
  if (to.name !== 'TwoFactor') clearLoginChallenge();
  return true;
});

router.afterEach(() => {
  if (!initialNavigation) return;
  initialNavigation = false;
  usePageLoadingStore().finishRoute();
});
router.onError(() => {
  if (!initialNavigation) return;
  initialNavigation = false;
  usePageLoadingStore().finishRoute();
});
