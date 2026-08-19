<template>
  <AdminPanel class="detail-fund-impact">
    <h2>{{ title }}</h2>

    <div v-if="flow" class="detail-fund-impact__flow">
      <div class="detail-fund-impact__node">
        <span class="detail-fund-impact__icon" :class="flow.tone ? `is-${flow.tone}` : 'is-blue'">
          <component :is="flow.icon" />
        </span>
        <div>
          <span>{{ flow.label }}</span>
          <strong>
            {{ flow.value }}
            <small v-if="flow.suffix">{{ flow.suffix }}</small>
          </strong>
        </div>
      </div>

      <div class="detail-fund-impact__arrow" aria-hidden="true">
        <span></span>
        <i>
          <Right />
        </i>
        <span></span>
      </div>

      <div class="detail-fund-impact__node is-positive">
        <span class="detail-fund-impact__icon" :class="result.tone ? `is-${result.tone}` : 'is-mt'">
          <component :is="result.icon" />
        </span>
        <div>
          <span>{{ result.label }}</span>
          <strong>
            {{ result.value }}
            <em v-if="result.delta">+{{ result.delta }}</em>
            <small v-if="result.suffix">{{ result.suffix }}</small>
          </strong>
        </div>
      </div>
    </div>

    <div v-else class="detail-fund-impact__single">
      <span>{{ result.label }}</span>
      <strong>
        {{ result.value }}
        <small v-if="result.suffix">{{ result.suffix }}</small>
      </strong>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { Right } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';

export interface FundImpactNode {
  icon: unknown;
  tone?: 'mt' | 'blue' | 'purple' | 'amber';
  label: string;
  value: string;
  delta?: string;
  suffix?: string;
}

withDefaults(
  defineProps<{
    title?: string;
    flow?: FundImpactNode;
    result: FundImpactNode;
  }>(),
  { title: '资金变化', flow: undefined },
);
</script>

<style scoped lang="scss">
.detail-fund-impact {
  padding: 28px;
  border-color: #cfe1ff;
  background: linear-gradient(135deg, #ffffff 0%, #f7fbff 100%);

  h2 {
    margin: 0 0 20px;
    color: var(--app-text-heading);
    font-size: 24px;
    font-weight: 700;
  }

  &__flow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px minmax(0, 1.18fr);
    align-items: center;
    gap: 24px;
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

    > div {
      min-width: 0;
    }

    &.is-positive {
      background: linear-gradient(135deg, rgb(57 245 236 / 9%), #ffffff);
    }

    span {
      color: var(--app-text-label);
      font-size: 14px;
      font-weight: 400;
    }

    strong {
      display: block;
      margin-top: 8px;
      overflow-wrap: break-word;
      color: #126df0;
      font-size: 24px;
      font-weight: 600;
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
      font-weight: 600;
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
    font-size: 26px;

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

  &__single {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 22px 26px;
    border: 1px solid #d8e6f5;
    border-radius: 14px;
    background: linear-gradient(135deg, #ffffff, #f7fbff);

    span {
      color: var(--app-text-heading);
      font-size: 16px;
      font-weight: 600;
    }

    strong {
      color: #126df0;
      font-size: 22px;
      font-weight: 600;
    }

    small {
      margin-left: 6px;
      color: #126df0;
      font-size: 14px;
      font-weight: 600;
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
      font-size: 22px;
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

    &__single {
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

    &__single {
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
