import { defineStore } from 'pinia';
import { ref } from 'vue';

/** 全局頁面切換進度，僅用於路由級加載，不替代表格和按鈕的局部 loading。 */
export const usePageLoadingStore = defineStore('pageLoading', () => {
  const active = ref(false);
  let pending = 0;
  let routePending = false;
  let startedAt = 0;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;

  function start() {
    if (closeTimer) clearTimeout(closeTimer);
    if (pending === 0) startedAt = Date.now();
    pending += 1;
    active.value = true;
  }

  function finish() {
    pending = Math.max(0, pending - 1);
    scheduleFinish();
  }

  function startRoute() {
    if (closeTimer) clearTimeout(closeTimer);
    if (!active.value) startedAt = Date.now();
    routePending = true;
    active.value = true;
  }

  function finishRoute() {
    routePending = false;
    scheduleFinish();
  }

  function scheduleFinish() {
    if (pending > 0 || routePending) return;
    const delay = Math.max(0, 260 - (Date.now() - startedAt));
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      active.value = false;
      closeTimer = undefined;
    }, delay);
  }

  return { active, start, finish, startRoute, finishRoute };
});
