<template>
  <el-card class="role-form-card" shadow="never">
    <template #header><div class="role-form-card__title"><el-icon><Document /></el-icon><strong>基本信息</strong></div></template>
    <div class="role-form-card__grid">
      <el-form-item label="角色名称" prop="name"><el-input :model-value="modelValue.name" maxlength="40" show-word-limit placeholder="请输入角色名称" @update:model-value="update('name', String($event))" /></el-form-item>
      <el-form-item label="启用状态"><el-switch :model-value="modelValue.status === 1" inline-prompt active-text="启" inactive-text="停" @update:model-value="update('status', $event ? 1 : 0)" /></el-form-item>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import { Document } from '@element-plus/icons-vue';
import type { RolePayload } from '../../types';
const props = defineProps<{ modelValue: RolePayload }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: RolePayload): void }>();
function update<K extends keyof RolePayload>(key: K, value: RolePayload[K]) { emit('update:modelValue', { ...props.modelValue, [key]: value }); }
</script>
<style scoped lang="scss">
.role-form-card { border-color:#dfe8ef; border-radius:15px; }
.role-form-card__title { display:flex; align-items:center; gap:9px; color:#17324f; font-size:16px; }
.role-form-card__title .el-icon { color:#0b9e94; }
.role-form-card__grid { display:grid; grid-template-columns:minmax(0,1fr) minmax(220px,.45fr); align-items:start; gap:20px; }
.role-form-card :deep(.el-form-item) { margin-bottom:0; }
.role-form-card :deep(.el-card__header) { padding-top:13px; padding-bottom:13px; background:#f8fbfd; }
.role-form-card :deep(.el-card__body) { padding-top:16px; padding-bottom:16px; }
@include mobile { .role-form-card__grid { grid-template-columns:1fr; gap:14px; } }
</style>
