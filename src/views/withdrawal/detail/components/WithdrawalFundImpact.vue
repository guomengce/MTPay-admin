<template>
  <AdminPanel class="withdrawal-fund-impact">
    <h2>资金变化</h2>

    <div class="withdrawal-fund-impact__flow">
      <div class="withdrawal-fund-impact__node">
        <span class="withdrawal-fund-impact__icon is-mt">
          <Wallet />
        </span>
        <div>
          <span>当前冻结 USD</span>
          <strong>
            {{ detail.totalDebit }}
            <small>{{ detail.currency }}</small>
          </strong>
        </div>
      </div>

      <div class="withdrawal-fund-impact__arrow" aria-hidden="true">
        <span></span>
        <i>
          <Right />
        </i>
        <span></span>
      </div>

      <div class="withdrawal-fund-impact__node is-final">
        <span class="withdrawal-fund-impact__icon is-blue">
          <Money />
        </span>
        <div>
          <span>付款完成后</span>
          <p>
            {{ detail.totalDebit }} {{ detail.currency }} 将从冻结余额中扣除，其中
            {{ detail.receiveAmount }} {{ detail.currency }} 支付给收款人， {{ detail.fixedFee }}
            {{ detail.currency }} 为固定手续费。
          </p>
        </div>
      </div>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { Money, Right, Wallet } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import type { WithdrawalDetail } from '../types';

defineProps<{ detail: WithdrawalDetail }>();
</script>

<style scoped lang="scss">
.withdrawal-fund-impact {
  padding: 28px;
  border-color: #cfe1ff;
  background: linear-gradient(135deg, #ffffff 0%, #f7fbff 100%);

  h2 {
    margin: 0 0 20px;
    color: #061936;
    font-size: 24px;
    font-weight: 950;
  }

  &__flow {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) 120px minmax(0, 1.6fr);
    align-items: center;
    gap: 18px;
  }

  &__node {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
    padding: 22px;
    border: 1px solid #d8e6f5;
    border-radius: 14px;
    background: #fbfdff;

    &.is-final {
      background: linear-gradient(135deg, #ffffff, #f4f9ff);
    }

    span {
      color: #66758b;
      font-size: 14px;
      font-weight: 750;
    }

    strong {
      display: block;
      margin-top: 8px;
      color: #079d96;
      font-size: 30px;
      font-weight: 950;
      line-height: 1.2;
    }

    small {
      margin-left: 6px;
      color: #079d96;
      font-size: 14px;
      font-weight: 850;
    }

    p {
      margin: 8px 0 0;
      color: #475569;
      font-size: 15px;
      font-weight: 750;
      line-height: 1.7;
    }
  }

  &__icon {
    display: inline-flex;
    width: 58px;
    height: 58px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 30px;

    &.is-mt {
      color: #fff;
      background: linear-gradient(135deg, #0e9d98, #12b8b0);
    }

    &.is-blue {
      color: #fff;
      background: linear-gradient(135deg, #126df0, #3b82f6);
    }
  }

  &__arrow {
    display: grid;
    grid-template-columns: 1fr 28px 1fr;
    align-items: center;
    gap: 8px;
    color: #0e9d98;

    span {
      border-top: 2px dotted #0e9d98;
    }

    i {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-style: normal;
    }
  }

  @include narrow {
    padding: 22px 24px;

    h2 {
      margin-bottom: 16px;
      font-size: 22px;
    }

    &__flow {
      grid-template-columns: minmax(0, 1fr) 90px minmax(0, 1.5fr);
      gap: 14px;
    }

    &__node {
      gap: 12px;
      padding: 18px;
    }

    &__icon {
      width: 48px;
      height: 48px;
      font-size: 24px;
    }

    strong {
      font-size: 24px;
    }

    p {
      font-size: 14px;
    }
  }

  @include mobile {
    padding: 20px;

    h2 {
      font-size: 22px;
    }

    &__flow {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    &__node {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
    }

    &__icon {
      width: 44px;
      height: 44px;
      font-size: 22px;
    }

    &__arrow {
      grid-template-columns: 1fr;
      justify-items: center;
      gap: 6px;
      margin: 0;

      span {
        display: none;
      }

      i {
        transform: rotate(90deg);
      }
    }

    strong {
      font-size: 20px;
    }

    p {
      margin-top: 6px;
      font-size: 13px;
      line-height: 1.6;
    }
  }
}
</style>
