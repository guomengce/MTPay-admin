<template>
  <section class="whitelist-summary-card">
    <div v-for="item in summaryItems" :key="item.label" class="whitelist-summary-card__item">
      <span class="whitelist-summary-card__icon" :class="`is-${item.tone}`">
        <component :is="item.icon" />
      </span>

      <div class="whitelist-summary-card__body">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Money, Tickets, UserFilled, Wallet } from '@element-plus/icons-vue';

import type { WhitelistDetail } from '../types';

const props = defineProps<{ detail: WhitelistDetail }>();

const summaryItems = computed(() => [
  {
    label: '主体名称',
    value: props.detail.subjectName,
    icon: Tickets,
    tone: 'mt',
  },
  {
    label: '白名单角色',
    value: props.detail.role,
    icon: UserFilled,
    tone: 'blue',
  },
  {
    label: '主体类型',
    value: props.detail.subjectType,
    icon: Wallet,
    tone: 'mt',
  },
  {
    label: '所属代理',
    value: props.detail.agent,
    icon: Money,
    tone: 'blue',
  },
]);
</script>

<style scoped lang="scss">
.whitelist-summary-card {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid #dce7f5;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 24px rgb(15 23 42 / 6%);

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    padding: 22px 24px;

    & + & {
      border-left: 1px solid #e4edf8;
    }
  }

  &__icon {
    display: inline-flex;
    width: 48px;
    height: 48px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 25px;

    &.is-mt {
      color: #079d96;
      background: rgb(57 245 236 / 18%);
    }

    &.is-blue {
      color: #126df0;
      background: #e8f1ff;
    }
  }

  &__body {
    display: grid;
    gap: 7px;
    min-width: 0;

    span {
      color: #66758b;
      font-size: 14px;
      font-weight: 750;
    }

    strong {
      color: #061936;
      font-size: 17px;
      font-weight: 900;
      line-height: 1.25;
    }
  }

  @include narrow {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    &__item {
      padding: 18px 20px;

      &:nth-child(2n) {
        border-left: 1px solid #e4edf8;
      }

      &:nth-child(odd) {
        border-left: 0;
      }

      &:nth-child(n + 3) {
        border-top: 1px solid #e4edf8;
      }
    }

    &__icon {
      width: 42px;
      height: 42px;
      font-size: 22px;
    }

    &__body {
      gap: 5px;

      span {
        font-size: 13px;
      }

      strong {
        font-size: 15px;
      }
    }
  }

  @include mobile {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    &__item {
      align-items: flex-start;
      padding: 16px;

      & + & {
        border-left: 0;
      }

      &:nth-child(n + 3) {
        border-top: 1px solid #e4edf8;
      }

      &:nth-child(even) {
        border-left: 1px solid #e4edf8;
      }
    }

    &__icon {
      width: 40px;
      height: 40px;
      font-size: 22px;
    }

    &__body {
      gap: 4px;

      span {
        font-size: 12px;
      }

      strong {
        font-size: 14px;
      }
    }
  }
}
</style>
