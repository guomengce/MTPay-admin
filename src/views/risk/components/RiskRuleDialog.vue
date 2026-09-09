<template>
  <AdminDialog
    :model-value="modelValue"
    title="配置風控條件"
    :icon="Setting"
    tone="brand"
    width="min(560px, calc(100vw - 24px))"
    destroy-on-close
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-if="rule">
      <div class="rule-dialog__summary">
        <span class="rule-dialog__category">{{ categoryLabel(rule.category) }}</span>
        <strong class="rule-dialog__name">{{ rule.name }}</strong>
      </div>

      <el-form label-position="top" class="rule-dialog__form">
        <el-form-item
          v-for="(type, key) in rule.parameter_types"
          :key="key"
          :label="parameterLabel(String(key))"
          required
        >
          <el-input
            v-model="rule.parameters[key]"
            :inputmode="type === 'integer' ? 'numeric' : 'decimal'"
            :placeholder="type === 'integer' ? '請輸入正整數' : '請輸入正數，最多 8 位小數'"
          >
            <template #append>{{ parameterUnit(String(key), type, currency) }}</template>
          </el-input>
        </el-form-item>

        <el-form-item label="命中後固定處理">
          <div class="fixed-action">
            <span class="fixed-action__badge">固定</span>
            <div class="fixed-action__content">
              <strong class="fixed-action__title">{{ actionLabel(rule.action) }}</strong>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="規則狀態">
          <div class="rule-status" :class="rule.enabled ? 'is-enabled' : 'is-disabled'">
            <el-switch
              v-model="rule.enabled"
              class="rule-status__switch"
              size="large"
              :width="78"
              inline-prompt
              active-text="啟用"
              inactive-text="停用"
            />
            <strong class="rule-status__text">{{ rule.enabled ? '已啟用' : '已停用' }}</strong>
          </div>
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <el-button @click="emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" :loading="saving" @click="emit('save')">儲存配置</el-button>
    </template>
  </AdminDialog>
</template>

<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue';

import type { RiskRule } from '@/api/modules/withdrawalRisk';
import AdminDialog from '@/components/admin/AdminDialog.vue';
import { actionLabel, categoryLabel, parameterLabel, parameterUnit } from '../rulePresentation';

defineProps<{ modelValue: boolean; currency: string; saving?: boolean }>();
const rule = defineModel<RiskRule | null>('rule', { required: true });
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'save'): void;
}>();
</script>

<style scoped lang="scss">
.rule-dialog__summary {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
  padding: 15px;
  border: 1px solid #dfe8f1;
  border-radius: 12px;
  background: #f7faff;
}

.rule-dialog__category {
  padding: 5px 9px;
  border-radius: 7px;
  color: #42617e;
  background: #eef4fa;
  font-size: 12px;
  font-weight: 700;
}

.rule-dialog__name {
  color: var(--app-text-heading);
  font-size: 14px;
}

.rule-dialog__form :deep(.el-input__inner) {
  text-align: left;
}

.fixed-action {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  border: 1px solid #cfdff8;
  border-radius: 10px;
  background: #eef4ff;
}

.fixed-action__badge {
  display: inline-flex;
  height: 24px;
  flex: none;
  align-items: center;
  padding: 0 8px;
  border-radius: 6px;
  color: #fff;
  background: #17223e;
  font-size: 10px;
  font-weight: 800;
}

.fixed-action__content {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.fixed-action__title {
  color: var(--app-text-heading);
  font-size: 13px;
}

.rule-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rule-status__switch {
  --el-switch-on-color: #07966f;
  --el-switch-off-color: #df4d57;
}

.rule-status__switch :deep(.el-switch__core) {
  box-sizing: border-box;
  height: 32px;
  border-radius: 16px;
}

.rule-status__switch :deep(.el-switch__action) {
  left: 3px;
  width: 26px;
  height: 26px;
  transform: none;
}

.rule-status__switch.is-checked :deep(.el-switch__action) {
  left: calc(100% - 29px);
  transform: none;
}

.rule-status__text {
  font-size: 13px;
}

.rule-status.is-enabled .rule-status__text {
  color: #087b5d;
}
.rule-status.is-disabled .rule-status__text {
  color: #c33742;
}
</style>
