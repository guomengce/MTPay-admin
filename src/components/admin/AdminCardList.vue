<template>
  <div class="admin-card-list">
    <el-card
      v-for="item in normalizedItems"
      :key="item.key"
      class="admin-card-list__item"
      :class="{ 'is-pending': item.pending }"
      shadow="never"
    >
      <template #header>
        <div class="admin-card-list__header">
          <div class="admin-card-list__title">
            <strong>{{ item.title }}</strong>
            <span v-if="item.subtitle">{{ item.subtitle }}</span>
          </div>
          <StatusBadge
            v-if="item.status"
            :label="item.status.label"
            :type="item.status.type"
            :effect="item.status.effect"
          />
        </div>
      </template>

      <div class="admin-card-list__fields">
        <div v-for="field in item.fields" :key="field.label" class="admin-card-list__field">
          <span class="admin-card-list__label">{{ field.label }}</span>
          <div class="admin-card-list__content">
            <StatusBadge
              v-if="field.badge"
              :label="field.badge.label"
              :type="field.badge.type"
              :effect="field.badge.effect"
            />
            <span
              v-else
              class="admin-card-list__value"
              :class="[field.valueClass, { 'is-strong': field.strong, 'is-mono': field.mono }]"
            >
              {{ field.value }}
            </span>
            <small v-if="field.subValue" class="admin-card-list__sub-value">{{
              field.subValue
            }}</small>
          </div>
        </div>
      </div>

      <div
        v-if="visibleActions(item).length"
        class="admin-card-list__actions"
        :class="`is-${visibleActions(item).length}`"
      >
        <el-button
          v-for="action in visibleActions(item)"
          :key="`${item.key}-${action.key}`"
          class="admin-card-list__action"
          :type="action.type"
          :plain="action.plain"
          :icon="action.icon"
          @click="emit('action', action.key, item.key, item.raw)"
        >
          {{ action.label }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import type { StatusBadgeEffect, StatusBadgeType } from './StatusBadge.vue';

export interface AdminCardBadge {
  label: string;
  type?: StatusBadgeType;
  effect?: StatusBadgeEffect;
}

export interface AdminCardField {
  label: string;
  value?: string;
  subValue?: string;
  badge?: AdminCardBadge;
  valueClass?: string | Record<string, boolean>;
  strong?: boolean;
  mono?: boolean;
}

export type AdminCardValueGetter = string | ((row: AdminCardRecord, index: number) => unknown);
export type AdminCardBadgeGetter =
  AdminCardBadge | ((row: AdminCardRecord, index: number) => AdminCardBadge | undefined);
export type AdminCardClassGetter =
  | string
  | Record<string, boolean>
  | ((row: AdminCardRecord, index: number) => string | Record<string, boolean> | undefined);
export type AdminCardBooleanGetter = boolean | ((row: AdminCardRecord, index: number) => boolean);

export interface AdminCardFieldConfig {
  label: string;
  prop?: string;
  value?: AdminCardValueGetter;
  subValue?: AdminCardValueGetter;
  badge?: AdminCardBadgeGetter;
  valueClass?: AdminCardClassGetter;
  strong?: AdminCardBooleanGetter;
  mono?: AdminCardBooleanGetter;
  visible?: AdminCardBooleanGetter;
}

export interface AdminCardAction {
  key: string;
  label: string;
  icon?: unknown;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  plain?: boolean;
  visible?: boolean;
}

export interface AdminCardActionConfig {
  key: string;
  label: string;
  icon?: unknown;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  plain?: boolean;
  visible?: AdminCardBooleanGetter;
}

export interface AdminCardItem {
  key: string;
  title: string;
  subtitle?: string;
  status?: AdminCardBadge;
  fields: AdminCardField[];
  actions?: AdminCardAction[];
  pending?: boolean;
}

export type AdminCardRecord = object;

interface NormalizedAdminCardItem extends AdminCardItem {
  raw?: AdminCardRecord;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';

import StatusBadge from './StatusBadge.vue';

const props = defineProps<{
  items?: AdminCardItem[];
  data?: AdminCardRecord[];
  rowKey?: string | ((row: AdminCardRecord, index: number) => string | number);
  title?: AdminCardValueGetter;
  subtitle?: AdminCardValueGetter;
  status?: AdminCardBadgeGetter;
  pending?: AdminCardBooleanGetter;
  fields?: AdminCardFieldConfig[];
  actions?: AdminCardActionConfig[];
}>();

const emit = defineEmits<{
  (e: 'action', actionKey: string, itemKey: string, row?: AdminCardRecord): void;
}>();

const normalizedItems = computed<NormalizedAdminCardItem[]>(() => {
  if (props.items) return props.items;

  return (props.data ?? []).map((row, index) => {
    const key = resolveRowKey(row, index);

    return {
      key,
      raw: row,
      title: stringifyValue(resolveValue(props.title, row, index) ?? key),
      subtitle: stringifyValue(resolveValue(props.subtitle, row, index)),
      status: resolveBadge(props.status, row, index),
      pending: resolveBoolean(props.pending, row, index),
      fields: resolveFields(row, index),
      actions: resolveActions(row, index),
    };
  });
});

function visibleActions(item: AdminCardItem) {
  return item.actions?.filter((action) => action.visible !== false) ?? [];
}

function resolveRowKey(row: AdminCardRecord, index: number) {
  if (typeof props.rowKey === 'function') return String(props.rowKey(row, index));
  if (typeof props.rowKey === 'string') {
    return stringifyValue(getByPath(row, props.rowKey)) || String(index);
  }
  return stringifyValue(getByPath(row, 'id')) || String(index);
}

function resolveFields(row: AdminCardRecord, index: number): AdminCardField[] {
  return (props.fields ?? [])
    .filter((field) => resolveBoolean(field.visible, row, index, true))
    .map((field) => {
      const fieldValue = resolveValue(field.value ?? field.prop, row, index);
      const fieldSubValue = resolveValue(field.subValue, row, index);

      return {
        label: field.label,
        value: stringifyValue(fieldValue),
        subValue: stringifyValue(fieldSubValue),
        badge: resolveBadge(field.badge, row, index),
        valueClass: resolveClass(field.valueClass, row, index),
        strong: resolveBoolean(field.strong, row, index),
        mono: resolveBoolean(field.mono, row, index),
      };
    });
}

function resolveActions(row: AdminCardRecord, index: number): AdminCardAction[] {
  return (props.actions ?? []).map((action) => ({
    key: action.key,
    label: action.label,
    icon: action.icon,
    type: action.type,
    plain: action.plain,
    visible: resolveBoolean(action.visible, row, index, true),
  }));
}

function resolveValue(
  getter: AdminCardValueGetter | undefined,
  row: AdminCardRecord,
  index: number,
) {
  if (typeof getter === 'function') return getter(row, index);
  if (typeof getter === 'string') return getByPath(row, getter);
  return undefined;
}

function resolveBadge(
  getter: AdminCardBadgeGetter | undefined,
  row: AdminCardRecord,
  index: number,
) {
  if (typeof getter === 'function') return getter(row, index);
  return getter;
}

function resolveClass(
  getter: AdminCardClassGetter | undefined,
  row: AdminCardRecord,
  index: number,
) {
  if (typeof getter === 'function') return getter(row, index);
  return getter;
}

function resolveBoolean(
  getter: AdminCardBooleanGetter | undefined,
  row: AdminCardRecord,
  index: number,
  fallback = false,
) {
  if (typeof getter === 'function') return getter(row, index);
  if (typeof getter === 'boolean') return getter;
  return fallback;
}

function stringifyValue(value: unknown): string {
  if (value === undefined || value === null) return '';
  return String(value);
}

function getByPath(row: AdminCardRecord, path: string) {
  return path.split('.').reduce<unknown>((target, key) => {
    if (target && typeof target === 'object' && key in target) {
      return (target as Record<string, unknown>)[key];
    }
    return undefined;
  }, row);
}
</script>

<style scoped lang="scss">
.admin-card-list {
  display: grid;
  gap: 10px;
  padding: 12px;

  &__item {
    border-color: #e3ebf4;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 8px 24px rgb(16 42 80 / 5%);

    :deep(.el-card__header) {
      padding: 12px 14px;
      border-bottom-color: #eef2f7;
    }

    :deep(.el-card__body) {
      display: grid;
      gap: 8px;
      padding: 6px 14px 10px;
    }
  }

  &__header {
    display: flex;
    min-width: 0;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  &__title {
    display: grid;
    min-width: 0;
    gap: 5px;

    strong {
      color: var(--app-text-heading);
      font-size: 16px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      color: var(--app-text-subtle);
      font-size: 12px;
      font-weight: 400;
    }
  }

  &__fields {
    display: grid;
  }

  &__field {
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr);
    align-items: center;
    gap: 10px;
    min-height: 32px;
    padding: 6px 0;
    border-bottom: 1px solid #eef2f7;

    &:last-child {
      border-bottom: 0;
    }
  }

  &__label {
    color: var(--app-text-label);
    font-size: 12px;
    font-weight: 400;
  }

  &__content {
    min-width: 0;
    color: var(--app-text-body);
    font-size: 13px;
    font-weight: 500;
  }

  &__value {
    display: block;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.is-strong {
      color: var(--app-text-body);
      font-weight: 600;
    }

    &.is-mono {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
      word-break: break-all;
      white-space: normal;
    }
  }

  &__sub-value {
    display: block;
    margin-top: 3px;
    color: var(--app-text-subtle);
    font-size: 12px;
    font-weight: 400;
  }

  &__actions {
    display: grid;
    gap: 8px;
    padding-top: 4px;

    &.is-1 {
      grid-template-columns: 1fr;
    }

    &.is-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &.is-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  &__action {
    width: 100%;
    min-width: 0;
    margin-left: 0 !important;
  }
}
</style>
