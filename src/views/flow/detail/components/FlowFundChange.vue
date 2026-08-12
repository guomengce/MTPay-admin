<template>
  <AdminPanel class="flow-fund-change">
    <h2>资金变化</h2>

    <div class="flow-fund-change__box">
      <span>{{ detail.fundChangeLabel }}</span>
      <strong>{{ detail.fundChangeAmount }} {{ detail.payAsset }}</strong>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import AdminPanel from '@/components/admin/AdminPanel.vue';
import type { FlowDetail } from '../types';

defineProps<{ detail: FlowDetail }>();
</script>

<style scoped lang="scss">
.flow-fund-change {
  padding: 28px;

  h2 {
    margin: 0 0 18px;
    color: #061936;
    font-size: 24px;
    font-weight: 950;
  }

  &__box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 18px 20px;
    border: 1px solid #d8e6f5;
    border-radius: 14px;
    background: linear-gradient(135deg, #ffffff, #f7fbff);

    span {
      color: #061936;
      font-size: 16px;
      font-weight: 850;
    }

    strong {
      color: #126df0;
      font-size: 18px;
      font-weight: 950;
    }
  }

  @include narrow {
    padding: 22px 24px;

    h2 {
      margin-bottom: 14px;
      font-size: 22px;
    }

    &__box {
      gap: 14px;
      padding: 16px 18px;

      span {
        font-size: 15px;
      }

      strong {
        font-size: 17px;
      }
    }
  }

  @include mobile {
    padding: 20px;

    h2 {
      font-size: 22px;
    }

    &__box {
      align-items: flex-start;
      flex-direction: column;
      gap: 8px;
      padding: 14px 16px;

      span {
        font-size: 14px;
      }

      strong {
        font-size: 16px;
      }
    }
  }
}
</style>
