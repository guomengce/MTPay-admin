import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/modules/auth';

export function usePermission() {
  const authStore = useAuthStore();
  const { userInfo, permissionReady } = storeToRefs(authStore);
  return { userInfo, permissionReady, canAccessMenu: authStore.canAccessMenu, canOperate: authStore.canOperate };
}
