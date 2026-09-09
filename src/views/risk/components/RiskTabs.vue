<template>
  <el-segmented
    class="risk-tabs"
    :model-value="active"
    :options="options"
    aria-label="風控管理頁籤"
    @change="navigate"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePermission } from '@/composables/usePermission';
defineProps<{ active: 'cases' | 'config' }>();
const router = useRouter(),
  { canOperate } = usePermission();
const options = computed(() => [
  { label: '風控列表', value: 'cases' },
  ...(canOperate('riskCases.config') ? [{ label: '規則配置', value: 'config' }] : []),
]);
function navigate(value: string | number | boolean) {
  void router.push(value === 'config' ? '/risk/config' : '/risk');
}
</script>
<style scoped lang="scss">
.risk-tabs {
  --el-segmented-bg-color: #e9f1f4;
  --el-segmented-item-selected-bg-color: linear-gradient(135deg, #18b8ae, #078f89);
  --el-segmented-item-selected-color: #fff;
  --el-segmented-item-hover-color: #087f7b;
  width: fit-content;
  padding: 5px;
  border: 1px solid #cfe0e5;
  border-radius: 13px;
  background: #e9f1f4;
  box-shadow: inset 0 1px 2px rgb(20 55 83 / 6%);
}

.risk-tabs :deep(.el-segmented__group) {
  gap: 3px;
}

.risk-tabs :deep(.el-segmented__item) {
  min-width: 104px;
  height: 38px;
  border-radius: 9px;
  color: #40546a;
  font-size: 14px;
  font-weight: 700;
  transition: color 0.2s ease;
}

.risk-tabs :deep(.el-segmented__item:hover) {
  color: #087f7b;
}

.risk-tabs :deep(.el-segmented__item-selected) {
  border-radius: 9px;
  background: linear-gradient(135deg, #18b8ae, #078f89);
  box-shadow: 0 4px 10px rgb(8 143 137 / 24%);
}

.risk-tabs :deep(.el-segmented__item.is-selected) {
  color: #fff;
}

.risk-tabs :deep(.el-segmented__item.is-selected:hover) {
  color: #fff;
}

@include mobile {
  .risk-tabs {
    width: 100%;
  }

  .risk-tabs :deep(.el-segmented__group) {
    width: 100%;
  }

  .risk-tabs :deep(.el-segmented__item) {
    min-width: 0;
    flex: 1;
  }
}
</style>
