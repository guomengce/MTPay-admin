<template>
  <AdminPanel class="whitelist-info-panel">
    <h2>白名单资料</h2>

    <section v-for="section in sections" :key="section.title" class="whitelist-info-panel__section">
      <h3>
        <span>
          <component :is="section.icon" />
        </span>
        {{ section.title }}
      </h3>

      <div class="whitelist-info-panel__fields">
        <div v-for="field in section.fields" :key="field.label" class="whitelist-info-panel__field">
          <span class="whitelist-info-panel__label">{{ field.label }}</span>
          <div class="whitelist-info-panel__value" :class="{ 'is-mono': field.mono }">
            <span>{{ field.value }}</span>
            <el-button
              v-if="field.copyable"
              class="whitelist-info-panel__copy"
              plain
              :icon="DocumentChecked"
              @click="copyText(field.value)"
            />
          </div>
        </div>
      </div>
    </section>
  </AdminPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { DocumentChecked, Money, Tickets, Wallet } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import type { WhitelistDetail } from '../types';

const props = defineProps<{ detail: WhitelistDetail }>();

const sections = computed(() => [
  {
    title: '基础信息',
    icon: Tickets,
    fields: [
      { label: '白名单编号：', value: props.detail.id },
      { label: '公司所在国家 / 地区：', value: props.detail.country },
      { label: '公司所在城市：', value: props.detail.city },
      { label: '公司地址：', value: props.detail.address },
    ],
  },
  {
    title: '银行信息',
    icon: Money,
    fields: [
      { label: '银行名称：', value: props.detail.bankName },
      { label: '银行账号 / IBAN：', value: props.detail.iban, copyable: true, mono: true },
      { label: 'SWIFT：', value: props.detail.swift, mono: true },
      { label: '中间行 SWIFT：', value: props.detail.intermediarySwift, mono: true },
    ],
  },
  {
    title: '业务信息',
    icon: Wallet,
    fields: [
      { label: '汇款目的：', value: props.detail.purpose },
      { label: '备注：', value: props.detail.remark },
      { label: '提交时间：', value: props.detail.submittedAt },
    ],
  },
]);

async function copyText(value: string) {
  await navigator.clipboard?.writeText(value);
  ElMessage.success('已复制');
}
</script>

<style scoped lang="scss">
.whitelist-info-panel {
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
      grid-template-columns: 1fr;
      gap: 14px 0;
    }

    &__field {
      grid-template-columns: 150px minmax(0, 1fr);
      gap: 12px;
    }
  }

  @include mobile {
    padding: 20px;

    h2 {
      font-size: 20px;
      margin-bottom: 16px;
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
