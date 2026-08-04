<template>
  <footer class="table-pager">
    <slot name="prefix">
      <span class="table-pager__total">显示第 {{ start }} - {{ end }} 笔，共 {{ total }} 笔</span>
    </slot>
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="size"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="prev, pager, next, sizes, jumper"
      background
      small
    />
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: number;
    pageSize: number;
    total: number;
  }>(),
  {
    pageSize: 10,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void;
  (e: 'update:pageSize', val: number): void;
}>();

const page = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const size = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val),
});

const start = computed(() => {
  if (props.total === 0) return 0;
  return (props.modelValue - 1) * props.pageSize + 1;
});

const end = computed(() => {
  return Math.min(props.modelValue * props.pageSize, props.total);
});
</script>

<style scoped lang="scss">
.table-pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 20px 24px;

  &__total {
    color: #738197;
    font-weight: 800;
  }
}

@include mobile {
  .table-pager {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;

    :deep(.el-pagination) {
      justify-content: center;
    }
  }
}
</style>
