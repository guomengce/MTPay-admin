<template>
  <AdminPanel class="withdrawal-file-panel">
    <h2>合同及 Invoice</h2>

    <div class="withdrawal-file-panel__list">
      <article v-for="file in detail.files" :key="file.key" class="withdrawal-file-panel__item">
        <span class="withdrawal-file-panel__icon">
          <DocumentChecked />
        </span>

        <div class="withdrawal-file-panel__body">
          <span>{{ file.label }}</span>
          <strong>{{ file.name }}</strong>
          <small>{{ file.status }}</small>
        </div>

        <el-button plain :icon="View">查看</el-button>
      </article>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { DocumentChecked, View } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import type { WithdrawalDetail } from '../types';

defineProps<{ detail: WithdrawalDetail }>();
</script>

<style scoped lang="scss">
.withdrawal-file-panel {
  padding: 24px 28px;

  h2 {
    margin: 0 0 16px;
    color: #061936;
    font-size: 22px;
    font-weight: 950;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
    padding: 16px;
    border: 1px solid #dce7f5;
    border-radius: 14px;
    background: #fbfdff;
  }

  &__icon {
    display: inline-flex;
    width: 44px;
    height: 44px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    color: #fff;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    font-size: 22px;
  }

  &__body {
    display: grid;
    gap: 4px;
    min-width: 0;
    margin-right: auto;

    span,
    small {
      color: #66758b;
      font-size: 13px;
      font-weight: 750;
    }

    strong {
      min-width: 0;
      overflow: hidden;
      color: #061936;
      font-size: 15px;
      font-weight: 900;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  @include narrow {
    padding: 20px 22px;

    h2 {
      font-size: 20px;
    }

    &__list {
      gap: 14px;
    }

    &__item {
      padding: 14px;
    }

    &__icon {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }

    &__body {
      span,
      small {
        font-size: 12px;
      }

      strong {
        font-size: 14px;
      }
    }
  }

  @include mobile {
    padding: 20px;

    &__list {
      grid-template-columns: 1fr;
    }

    &__item {
      flex-wrap: wrap;
      align-items: flex-start;
      padding: 14px;
    }

    &__icon {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }

    &__body {
      flex: 1;
      min-width: 0;

      span,
      small {
        font-size: 12px;
      }

      strong {
        font-size: 14px;
        white-space: normal;
        word-break: break-all;
        line-height: 1.45;
      }
    }

    .el-button {
      width: 100%;
      margin-top: 4px;
    }
  }
}
</style>
