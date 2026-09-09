<template>
  <el-dialog
    v-bind="$attrs"
    :model-value="modelValue"
    :width="width"
    :class="['admin-dialog', `admin-dialog--${tone}`]"
    :close-on-click-modal="closeOnClickModal"
    :destroy-on-close="destroyOnClose"
    :align-center="alignCenter"
    @open="emit('open')"
    @closed="emit('closed')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div class="admin-dialog__heading">
        <span v-if="icon" class="admin-dialog__icon" aria-hidden="true">
          <el-icon><component :is="icon" /></el-icon>
        </span>
        <div class="admin-dialog__heading-copy">
          <h2>{{ title }}</h2>
          <p v-if="description">{{ description }}</p>
        </div>
      </div>
    </template>

    <slot />

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<{
  modelValue: boolean;
  title: string;
  description?: string;
  icon?: Component;
  tone?: 'brand' | 'primary' | 'success' | 'warning' | 'danger';
  width?: string;
  closeOnClickModal?: boolean;
  destroyOnClose?: boolean;
  alignCenter?: boolean;
}>(), {
  description: '',
  icon: undefined,
  tone: 'brand',
  width: 'min(520px, calc(100vw - 24px))',
  closeOnClickModal: false,
  destroyOnClose: true,
  alignCenter: true,
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'open'): void;
  (event: 'closed'): void;
}>();
</script>

<style lang="scss">
.admin-dialog {
  --admin-dialog-accent: var(--app-primary);
  --admin-dialog-accent-soft: var(--app-primary-soft);
  --admin-dialog-accent-border: #bfe8e3;
  --admin-dialog-line: linear-gradient(90deg, #2563eb 0%, #00b8e6 54%, #16c5a3 100%);
  --admin-dialog-header-glow: rgb(37 99 235 / 7%);

  &--brand {
    --admin-dialog-accent: #087ca7;
    --admin-dialog-accent-soft: #edf8fc;
    --admin-dialog-accent-border: #b9deea;
  }

  &--success {
    --admin-dialog-accent: #16865f;
    --admin-dialog-accent-soft: #eaf8f1;
    --admin-dialog-accent-border: #c3e9d5;
    --admin-dialog-line: linear-gradient(90deg, #16865f, #39c891);
    --admin-dialog-header-glow: rgb(22 134 95 / 7%);
  }

  &--warning {
    --admin-dialog-accent: #b56a08;
    --admin-dialog-accent-soft: #fff7e6;
    --admin-dialog-accent-border: #f2d8a6;
    --admin-dialog-line: linear-gradient(90deg, #b56a08, #f0b13d);
    --admin-dialog-header-glow: rgb(181 106 8 / 7%);
  }

  &--danger {
    --admin-dialog-accent: #cf3f4b;
    --admin-dialog-accent-soft: #fff0f1;
    --admin-dialog-accent-border: #f3c6ca;
    --admin-dialog-line: linear-gradient(90deg, #bf3340, #ee6872);
    --admin-dialog-header-glow: rgb(191 51 64 / 7%);
  }

  .el-dialog__header {
    padding-top: 20px;
    padding-bottom: 19px;
    overflow: hidden;
    background:
      radial-gradient(circle at 8% -80%, var(--admin-dialog-header-glow) 0, transparent 58%),
      linear-gradient(105deg, #fbfdff 0%, #f6fafc 58%, #f4fbfa 100%);

    &::after {
      content: '';
      position: absolute;
      right: 0;
      bottom: -1px;
      left: 0;
      height: 2px;
      background: var(--admin-dialog-line);
      box-shadow: 0 0 12px color-mix(in srgb, var(--admin-dialog-accent) 22%, transparent);
    }
  }

  &__heading {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 14px;
  }

  &__icon {
    display: inline-grid;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    place-items: center;
    border: 1px solid var(--admin-dialog-accent-border);
    border-radius: 13px;
    color: var(--admin-dialog-accent);
    background:
      linear-gradient(145deg, rgb(255 255 255 / 88%), transparent),
      var(--admin-dialog-accent-soft);
    box-shadow:
      0 7px 18px color-mix(in srgb, var(--admin-dialog-accent) 10%, transparent),
      0 0 0 3px rgb(255 255 255 / 72%);
    font-size: 22px;
  }

  &__heading-copy {
    min-width: 0;

    h2 {
      margin: 0;
      color: var(--app-text-heading);
      font-size: 18px;
      font-weight: 700;
      line-height: 1.4;
    }

    p {
      margin: 4px 0 0;
      color: var(--app-text-label);
      font-size: 13px;
      line-height: 1.5;
    }
  }
}

@media (max-width: 767px) {
  .admin-dialog {
    .el-dialog__header {
      padding-top: 16px;
      padding-bottom: 15px;
    }

    &__heading {
      gap: 11px;
    }

    &__icon {
      width: 40px;
      height: 40px;
      flex-basis: 40px;
      border-radius: 11px;
      font-size: 20px;
    }

    &__heading-copy h2 {
      font-size: 17px;
    }

    &__heading-copy p {
      display: none;
    }
  }
}
</style>
