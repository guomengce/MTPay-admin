<template>
  <AdminPanel class="detail-business-info">
    <h2>{{ title }}</h2>

    <section
      v-for="section in sections"
      :key="section.title"
      class="detail-business-info__section"
    >
      <h3 v-if="section.title">
        <span v-if="section.icon">
          <component :is="section.icon" />
        </span>
        {{ section.title }}
      </h3>

      <div class="detail-business-info__fields">
        <div
          v-for="field in section.fields"
          :key="field.label"
          class="detail-business-info__field"
        >
          <span class="detail-business-info__label">{{ field.label }}</span>
          <div
            class="detail-business-info__value"
            :class="{ 'is-mono': field.mono }"
          >
            <StatusBadge
              v-if="field.badge && status"
              :label="field.value"
              :type="status.type"
              :effect="status.effect"
            />
            <span v-else>{{ field.value }}</span>

            <el-button
              v-if="field.copyable"
              class="detail-business-info__copy"
              plain
              :icon="DocumentCopy"
              @click="copyText(field.value)"
            />
          </div>
        </div>
      </div>
    </section>
  </AdminPanel>
</template>

<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';

export interface DetailField {
  label: string;
  value: string;
  copyable?: boolean;
  mono?: boolean;
  badge?: boolean;
}

export interface DetailSection {
  title?: string;
  icon?: unknown;
  fields: DetailField[];
}

withDefaults(
  defineProps<{
    title: string;
    sections: DetailSection[];
    status?: { type: string; effect?: string };
  }>(),
  { status: undefined },
);

const emit = defineEmits<{ (e: 'copy', value: string): void }>();

async function copyText(value: string) {
  try {
    await navigator.clipboard?.writeText(value);
    ElMessage.success('已复制');
    emit('copy', value);
  } catch {
    ElMessage.error('复制失败');
  }
}
</script>

<style scoped lang="scss">
.detail-business-info {
  padding: 28px;

  h2 {
    margin: 0 0 24px;
    color: #061936;
    font-size: 24px;
    font-weight: 950;
  }

  &__section {
    padding: 22px 0;
    border-top: 1px solid #eef3f9;

    &:first-of-type {
      padding-top: 0;
      border-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }
  }

  h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 18px;
    color: #079d96;
    font-size: 17px;
    font-weight: 950;

    span {
      display: inline-flex;
      width: 24px;
      height: 24px;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgb(57 245 236 / 14%);
      font-size: 16px;
    }
  }

  &__fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 54px;
  }

  &__field {
    display: grid;
    grid-template-columns: 150px minmax(0, 1fr);
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  &__label {
    color: #66758b;
    font-size: 15px;
    font-weight: 800;
  }

  &__value {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 10px;
    color: #061936;
    font-size: 15px;
    font-weight: 850;

    > span {
      min-width: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    &.is-mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
  }

  &__copy {
    width: 34px;
    min-width: 34px;
    height: 34px;
    margin-left: 4px;
    padding: 0;
  }

  @include narrow {
    padding: 22px 24px;

    h2 {
      margin-bottom: 18px;
      font-size: 22px;
    }

    h3 {
      font-size: 16px;
    }

    &__fields {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px 32px;
    }

    &__field {
      grid-template-columns: 130px minmax(0, 1fr);
      gap: 12px;
    }
  }

  @include mobile {
    padding: 20px;

    h2 {
      margin-bottom: 16px;
      font-size: 20px;
    }

    &__fields {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    &__field {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    &__value {
      flex-wrap: wrap;
      font-size: 14px;
    }

    &__copy {
      width: 30px;
      min-width: 30px;
      height: 30px;
    }
  }
}
</style>
