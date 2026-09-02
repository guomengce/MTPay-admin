<template>
  <section class="role-form-card">
    <div class="role-form-card__grid">
      <el-form-item label="角色名稱" prop="name"><el-input :model-value="modelValue.name" maxlength="50" show-word-limit
          placeholder="請輸入角色名稱" @update:model-value="update('name', String($event))" /></el-form-item>
      <el-form-item label="角色描述" prop="description"><el-input :model-value="modelValue.description" maxlength="200" show-word-limit
          placeholder="請輸入角色描述" @update:model-value="update('description', String($event))" /></el-form-item>
    </div>
  </section>
</template>
<script setup lang="ts">
import type { RolePayload } from '../../types';
const props = defineProps<{ modelValue: RolePayload }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: RolePayload): void }>();
function update<K extends keyof RolePayload>(key: K, value: RolePayload[K]) { emit('update:modelValue', { ...props.modelValue, [key]: value }); }
</script>
<style scoped lang="scss">
.role-form-card {
  padding: 16px 20px 18px;
  border-bottom: 1px solid #dfe8ef;
  background: #fff;
}

.role-form-card__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: 20px;
}

.role-form-card :deep(.el-form-item) {
  margin-bottom: 0;
}

@include mobile {
  .role-form-card__grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}
</style>
