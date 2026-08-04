import { computed, ref } from 'vue';

export interface UseTablePagerOptions {
  defaultPageSize?: number;
}

/**
 * 通用表格分页逻辑 composable
 * 用法：const { page, size, total, pagedData } = useTablePager(sourceData)
 */
export function useTablePager<T>(source: T[], options: UseTablePagerOptions = {}) {
  const page = ref(1);
  const size = ref(options.defaultPageSize ?? 10);
  const total = computed(() => source.length);

  const pagedData = computed(() => {
    const start = (page.value - 1) * size.value;
    return source.slice(start, start + size.value);
  });

  return {
    page,
    size,
    total,
    pagedData,
  };
}
