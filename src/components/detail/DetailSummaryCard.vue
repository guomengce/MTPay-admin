<template>
  <section class="detail-summary-card">
    <div v-for="item in items" :key="item.label" class="detail-summary-card__item">
      <span class="detail-summary-card__icon" :class="`is-${item.tone}`">
        <component :is="item.icon" />
      </span>

      <div class="detail-summary-card__body">
        <span>{{ item.label }}</span>
        <strong>
          {{ item.value }}
          <small v-if="item.suffix">{{ item.suffix }}</small>
        </strong>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface SummaryItem {
  icon: unknown;
  tone: 'mt' | 'blue' | 'purple';
  label: string;
  value: string | number;
  suffix?: string;
}

defineProps<{ items: SummaryItem[] }>();
</script>

<style scoped lang="scss">
.detail-summary-card {
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
    font-size: 22px;

    &.is-mt {
      color: #079d96;
      background: rgb(57 245 236 / 18%);
    }

    &.is-blue {
      color: #126df0;
      background: #e8f1ff;
    }

    &.is-purple {
      color: #7c4dff;
      background: #efe9ff;
    }
  }

  &__body {
    display: grid;
    gap: 7px;
    min-width: 0;

    span {
      color: var(--app-text-label);
      font-size: 14px;
      font-weight: 400;
    }

    strong {
      color: var(--app-text-heading);
      font-size: 17px;
      font-weight: 600;
      line-height: 1.25;
    }

    small {
      margin-left: 6px;
      color: var(--app-text-label);
      font-size: 14px;
      font-weight: 400;
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
      font-size: 20px;
    }

    &__body {
      gap: 5px;

      span,
      small {
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
      font-size: 20px;
    }

    &__body {
      gap: 4px;

      span,
      small {
        font-size: 12px;
      }

      strong {
        font-size: 14px;
      }
    }
  }
}
</style>
