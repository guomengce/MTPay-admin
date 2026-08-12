<template>
  <AdminPanel class="deposit-fund-impact">
    <h2>资金变化</h2>

    <div class="deposit-fund-impact__flow">
      <div class="deposit-fund-impact__node">
        <span class="deposit-fund-impact__icon is-blue">
          <Wallet />
        </span>
        <div>
          <span>当前：</span>
          <strong>尚未入账</strong>
        </div>
      </div>

      <div class="deposit-fund-impact__arrow" aria-hidden="true">
        <span></span>
        <i>
          <Right />
        </i>
        <span></span>
      </div>

      <div class="deposit-fund-impact__node is-positive">
        <span class="deposit-fund-impact__icon is-mt">
          <TrendCharts />
        </span>
        <div>
          <span>审核通过后：</span>
          <strong>
            代理余额
            <em>+{{ detail.balanceChange }}</em>
            <small>{{ detail.currency }}</small>
          </strong>
        </div>
      </div>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { Right, TrendCharts, Wallet } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import type { DepositDetail } from '../types';

defineProps<{ detail: DepositDetail }>();
</script>

<style scoped lang="scss">
.deposit-fund-impact {
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
    grid-template-columns: minmax(0, 1fr) 190px minmax(0, 1.18fr);
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

    &.is-positive {
      background: linear-gradient(135deg, rgb(57 245 236 / 9%), #ffffff);
    }

    span {
      color: #66758b;
      font-size: 14px;
      font-weight: 750;
    }

    strong {
      display: block;
      margin-top: 8px;
      color: #126df0;
      font-size: 24px;
      font-weight: 950;
      line-height: 1.2;
    }

    em {
      color: #079d96;
      font-size: 30px;
      font-style: normal;
    }

    small {
      margin-left: 6px;
      color: #079d96;
      font-size: 14px;
      font-weight: 850;
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

    &.is-blue {
      color: #126df0;
      background: #e8f1ff;
    }

    &.is-mt {
      color: #fff;
      background: linear-gradient(135deg, #0e9d98, #12b8b0);
    }
  }

  &__arrow {
    display: grid;
    grid-template-columns: 1fr 56px 1fr;
    align-items: center;
    gap: 10px;
    color: #126df0;

    span {
      border-top: 2px dotted #7bb1ff;
    }

    i {
      display: inline-flex;
      width: 56px;
      height: 56px;
      align-items: center;
      justify-content: center;
      border: 1px solid #7bb1ff;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 8px 18px rgb(18 109 240 / 12%);
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
      grid-template-columns: minmax(0, 1fr) 140px minmax(0, 1fr);
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

    &__arrow {
      grid-template-columns: 1fr 44px 1fr;
      gap: 6px;

      i {
        width: 44px;
        height: 44px;
        font-size: 20px;
      }
    }

    strong {
      font-size: 20px;
    }

    em {
      font-size: 24px;
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
        width: 40px;
        height: 40px;
        font-size: 18px;
        transform: rotate(90deg);
      }
    }

    strong {
      font-size: 18px;
    }

    em {
      font-size: 22px;
    }
  }
}
</style>
