<template>
  <section class="deposit-core">
    <div class="deposit-core__amount">
      <span class="deposit-core__icon">
        <el-icon><Wallet /></el-icon>
      </span>
      <div>
        <small>申报入金金额</small>
        <p>
          <strong>{{ amount }}</strong
          ><span>{{ currency.code }}</span>
        </p>
        <em
          >{{ currency.name }} · {{ network.name }}（{{ network.code }}）</em
        >
      </div>
    </div>
    <div class="deposit-core__meta">
      <article>
        <span class="is-purple">
          <el-icon><UserFilled /></el-icon>
        </span>
        <div>
          <small>申请代理</small><strong>{{ user.company_name }}</strong>
          <p>{{ user.agent_code }} · {{ user.email }}</p>
        </div>
      </article>
      <article>
        <span class="is-blue">
          <el-icon><Calendar /></el-icon>
        </span>
        <div>
          <small>提交时间</small><strong>{{ submittedAt || '—' }}</strong>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Calendar, UserFilled, Wallet } from '@element-plus/icons-vue';
import type { CurrencyRef, NetworkRef, BusinessUser } from '@/api/modules/deposit';

defineProps<{
  amount: string;
  currency: CurrencyRef;
  network: NetworkRef;
  user: BusinessUser;
  submittedAt: string;
}>();
</script>

<style scoped lang="scss">
.deposit-core {
  display: grid;
  overflow: hidden;
  grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1.1fr);
  border: 1px solid #dce7f2;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 14px 34px rgb(15 42 78 / 7%);

  &__amount {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 20px;
    padding: 28px 32px;
    background: linear-gradient(135deg, #f3fffd, #f4f9ff);
  }

  &__icon,
  &__meta article > span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    width: 62px;
    height: 62px;
    flex: 0 0 62px;
    border-radius: 18px;
    color: #fff;
    background: linear-gradient(135deg, #19b8a8, #268ee6);
    box-shadow: 0 10px 24px rgb(20 166 174 / 24%);
    font-size: 30px;
  }

  small {
    display: block;
    color: var(--app-text-label);
    font-size: 14px;
    font-weight: 500;
  }

  &__amount p {
    display: flex;
    min-width: 0;
    align-items: baseline;
    gap: 10px;
    margin: 7px 0 5px;
  }

  &__amount strong {
    color: var(--app-text-heading);
    font-size: clamp(30px, 3.2vw, 42px);
    font-weight: 700;
    letter-spacing: -1px;
    line-height: 1.05;
    overflow-wrap: anywhere;
  }

  &__amount p span {
    color: #0c8f8b;
    font-size: 16px;
    font-weight: 700;
  }

  &__amount em {
    color: var(--app-text-label);
    font-size: 14px;
    font-style: normal;
  }

  &__meta {
    display: grid;
    min-width: 0;
    grid-template-columns: minmax(0, 1fr) minmax(185px, 1fr);
  }

  &__meta article {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 14px;
    padding: 24px;
    border-left: 1px solid #e5ebf2;
  }

  &__meta article > span {
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    border-radius: 13px;
    font-size: 22px;

    &.is-purple {
      color: #7457e8;
      background: #f0edff;
    }

    &.is-blue {
      color: #2678da;
      background: #eaf3ff;
    }
  }

  &__meta article div {
    min-width: 0;
  }

  &__meta strong {
    display: block;
    margin-top: 5px;
    color: var(--app-text-body);
    font-size: 16px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  &__meta p {
    margin: 5px 0 0;
    color: var(--app-text-label);
    font-size: 13px;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }
}

@include narrow {
  .deposit-core {
    grid-template-columns: 1fr;

    &__meta article:first-child {
      border-left: 0;
    }

    &__meta article {
      border-top: 1px solid #e5ebf2;
    }
  }
}

@include mobile {
  .deposit-core {
    &__amount {
      align-items: flex-start;
      padding: 22px 18px;
    }

    &__icon {
      width: 50px;
      height: 50px;
      flex-basis: 50px;
      border-radius: 14px;
      font-size: 24px;
    }

    &__meta {
      grid-template-columns: 1fr;
    }

    &__meta article {
      padding: 18px;
      border-left: 0;
    }
  }
}
</style>