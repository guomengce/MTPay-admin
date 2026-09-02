import type { Ref } from 'vue';

/**
 * 僅將頁面實例的首次異步加載映射到全局遮罩。
 * 後續查詢、刷新和彈框操作使用組件自身的局部 loading，避免整頁白屏。
 */
export function usePageLoading(_source: Ref<boolean>) {}
