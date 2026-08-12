<template>
  <AdminPanel class="deposit-business-info">
    <h2>业务信息</h2>

    <div class="deposit-business-info__rows">
      <div v-for="row in infoRows" :key="row.label" class="deposit-business-info__row">
        <span class="deposit-business-info__label">{{ row.label }}</span>
        <div class="deposit-business-info__value" :class="{ 'is-mono': row.mono }">
          <StatusBadge
            v-if="row.badge"
            :label="row.value"
            :type="detail.statusType"
            :effect="detail.statusEffect"
          />
          <span v-else>{{ row.value }}</span>

          <el-button
            v-if="row.copyable"
            class="deposit-business-info__copy"
            plain
            :icon="DocumentChecked"
            @click="copyText(row.value)"
          />
        </div>
      </div>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { DocumentChecked } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { DepositDetail } from '../types';

const props = defineProps<{ detail: DepositDetail }>();

const infoRows = computed(() => [
  { label: '交易编号：', value: props.detail.id },
  { label: '代理编号：', value: props.detail.agentCode },
  { label: '交易哈希：', value: props.detail.hash, copyable: true, mono: true },
  { label: '入金地址：', value: props.detail.address, copyable: true, mono: true },
  { label: '当前状态：', value: props.detail.status, badge: true },
  { label: '备注：', value: props.detail.remark },
]);

async function copyText(value: string) {
  await navigator.clipboard?.writeText(value);
  ElMessage.success('已复制');
}
</script>

<style scoped lang="scss">
.deposit-business-info {
  padding: 28px;

  h2 {
    margin: 0 0 24px;
    color: #061936;
    font-size: 24px;
    font-weight: 950;
  }

  &__rows {
    display: grid;
    gap: 0;
  }

  &__row {
    display: grid;
    grid-template-columns: 190px minmax(0, 1fr);
    align-items: center;
    gap: 18px;
    padding: 14px 0;
    border-bottom: 1px solid #eef3f9;

    &:last-child {
      border-bottom: 0;
    }
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
    gap: 12px;
    color: #061936;
    font-size: 16px;
    font-weight: 850;

    > span:not(.status-badge) {
      min-width: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    &.is-mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
  }

  &__copy {
    width: 38px;
    min-width: 38px;
    margin-left: auto;
    padding: 0;
  }

  @include narrow {
    padding: 22px 24px;

    h2 {
      margin-bottom: 18px;
      font-size: 22px;
    }

    &__row {
      grid-template-columns: 150px minmax(0, 1fr);
      gap: 14px;
    }
  }

  @include mobile {
    padding: 20px;

    h2 {
      font-size: 20px;
      margin-bottom: 16px;
    }

    &__row {
      grid-template-columns: 1fr;
      gap: 8px;
      padding-bottom: 14px;

      &:last-child {
        padding-bottom: 0;
      }
    }

    &__value {
      flex-wrap: wrap;
      font-size: 14px;
      gap: 10px;
    }

    &__copy {
      width: 32px;
      min-width: 32px;
    }
  }
}
</style>
