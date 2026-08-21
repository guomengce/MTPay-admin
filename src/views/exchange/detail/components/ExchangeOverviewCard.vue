<template>
  <section class="exchange-overview">
    <div class="exchange-overview__flow">
      <!-- 支付资产 -->
      <article class="exchange-asset is-source">
        <div class="exchange-asset__body">
          <small>支付资产</small>
          <p>
            <strong>{{ sourceAmount }}</strong>
            <span>{{ sourceCurrency.code }}</span>
          </p>
          <em>{{ sourceCurrency.name }}</em>
        </div>
        <span :class="['currency-glyph', `currency-glyph--${sourceTone}`]">
          {{ sourceSymbol }}
        </span>
      </article>

      <!-- 提交时汇率 -->
      <div class="exchange-rate">
        <span>
          <el-icon><Right /></el-icon>
        </span>
        <small>提交时汇率</small>
        <strong>
          1 {{ sourceCurrency.code }} = {{ formatExchangeRate(exchangeRate) }}
          {{ targetCurrency.code }}
        </strong>
        <!-- <em>{{ rateSourceName }}</em> -->
      </div>

      <!-- 预计到账 -->
      <article class="exchange-asset is-target">
        <span :class="['currency-glyph', `currency-glyph--${targetTone}`]">
          {{ targetSymbol }}
        </span>
        <div class="exchange-asset__body">
          <small>预计到账</small>
          <p>
            <strong>{{ targetAmount }}</strong>
            <span>{{ targetCurrency.code }}</span>
          </p>
          <em>{{ targetCurrency.name }}</em>
        </div>
      </article>
    </div>

    <div class="exchange-overview__meta">
      <article>
        <span class="is-purple">
          <el-icon><UserFilled /></el-icon>
        </span>
        <div>
          <small>申请代理</small>
          <strong>{{ user.company_name }}</strong>
          <p>{{ user.agent_code }} · {{ user.email }}</p>
        </div>
      </article>
      <article>
        <span class="is-blue">
          <el-icon><Calendar /></el-icon>
        </span>
        <div>
          <small>提交时间</small>
          <strong>{{ submittedAt || '—' }}</strong>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Calendar, Right, UserFilled } from '@element-plus/icons-vue';
import type { BusinessUser, CurrencyRef } from '@/api/modules/deposit';
import { formatExchangeRate } from '@/utils/decimal';

const props = defineProps<{
  sourceAmount: string;
  sourceCurrency: CurrencyRef;
  targetAmount: string;
  targetCurrency: CurrencyRef;
  exchangeRate: string;
  rateSourceName: string;
  user: BusinessUser;
  submittedAt: string;
}>();

/** 币种 → 图标字符 + 主色。USDT/USDC 用专属字形，其余币种用首个字符 + 配套色。 */
interface CurrencyGlyph {
  symbol: string;
  tone: 'teal' | 'mint' | 'blue' | 'indigo' | 'amber' | 'violet' | 'rose' | 'slate';
}

const GLYPH_MAP: Record<string, CurrencyGlyph> = {
  USDT: { symbol: '₮', tone: 'teal' },
  USDC: { symbol: '$', tone: 'blue' },
  USD: { symbol: '$', tone: 'mint' },
  CNY: { symbol: '¥', tone: 'rose' },
  BTC: { symbol: '₿', tone: 'amber' },
  ETH: { symbol: 'Ξ', tone: 'indigo' },
};

function resolveGlyph(code: string): CurrencyGlyph {
  const normalized = (code || '').toUpperCase();
  if (GLYPH_MAP[normalized]) return GLYPH_MAP[normalized];
  return {
    symbol: normalized.charAt(0) || '?',
    tone: 'slate',
  };
}

const sourceSymbol = computed(() => resolveGlyph(props.sourceCurrency.code).symbol);
const sourceTone = computed(() => resolveGlyph(props.sourceCurrency.code).tone);
const targetSymbol = computed(() => resolveGlyph(props.targetCurrency.code).symbol);
const targetTone = computed(() => resolveGlyph(props.targetCurrency.code).tone);
</script>

<style scoped lang="scss">
.exchange-overview {
  overflow: hidden;
  border: 1px solid #dce7f2;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 14px 34px rgb(15 42 78 / 7%);

  &__flow {
    display: grid;
    align-items: stretch;
    grid-template-columns: minmax(0, 1fr) minmax(230px, 0.65fr) minmax(0, 1fr);
  }

  &__meta {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(240px, 1fr);
    border-top: 1px solid #e4ebf3;
  }

  &__meta article {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 14px;
    padding: 18px 28px;

    + article {
      border-left: 1px solid #e4ebf3;
    }

    > span {
      display: inline-flex;
      width: 42px;
      height: 42px;
      flex: 0 0 42px;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      font-size: 21px;

      &.is-purple {
        color: #7457e8;
        background: #f0edff;
      }

      &.is-blue {
        color: #2678da;
        background: #eaf3ff;
      }
    }

    div {
      min-width: 0;
    }

    small {
      display: block;
      color: var(--app-text-label);
      font-size: 13px;
    }

    strong {
      display: block;
      margin-top: 4px;
      color: var(--app-text-body);
      font-size: 15px;
      font-weight: 600;
      overflow-wrap: anywhere;
    }

    p {
      margin: 4px 0 0;
      color: var(--app-text-label);
      font-size: 13px;
      overflow-wrap: anywhere;
    }
  }
}

.exchange-asset {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 16px;
  padding: 30px 32px;

  &.is-source {
    background: linear-gradient(135deg, #f4fbff, #f7faff);
  }

  &.is-target {
    flex-direction: row-reverse;
    text-align: right;
    background: linear-gradient(135deg, #f5fffc, #effbf8);
  }

  &__body {
    display: grid;
    min-width: 0;
    flex: 1;
    gap: 0;
  }

  small,
  em {
    display: block;
    color: var(--app-text-label);
    font-size: 14px;
    font-style: normal;
  }

  p {
    display: flex;
    min-width: 0;
    align-items: baseline;
    gap: 10px;
    margin: 10px 0 7px;
  }

  &.is-target p {
    justify-content: flex-end;
  }

  strong {
    color: var(--app-text-heading);
    font-size: clamp(30px, 3vw, 42px);
    font-weight: 700;
    letter-spacing: -1px;
    line-height: 1.05;
    overflow-wrap: anywhere;
  }

  p span {
    color: #078f89;
    font-size: 16px;
    font-weight: 700;
  }
}

/* 币种图标：彩色圆底 + 字形字符 */
.currency-glyph {
  display: inline-flex;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;

  &--teal {
    color: #079b91;
    background: color-mix(in srgb, #079b91 14%, white);
    box-shadow: inset 0 0 0 1px rgb(7 155 145 / 18%);
  }

  &--mint {
    color: #0a9b6a;
    background: color-mix(in srgb, #0a9b6a 14%, white);
    box-shadow: inset 0 0 0 1px rgb(10 155 106 / 18%);
  }

  &--blue {
    color: #2776e0;
    background: color-mix(in srgb, #2776e0 14%, white);
    box-shadow: inset 0 0 0 1px rgb(39 118 224 / 18%);
  }

  &--indigo {
    color: #4664f0;
    background: color-mix(in srgb, #4664f0 14%, white);
    box-shadow: inset 0 0 0 1px rgb(70 100 240 / 18%);
  }

  &--amber {
    color: #c97c0a;
    background: color-mix(in srgb, #c97c0a 14%, white);
    box-shadow: inset 0 0 0 1px rgb(201 124 10 / 18%);
  }

  &--violet {
    color: #7857ed;
    background: color-mix(in srgb, #7857ed 14%, white);
    box-shadow: inset 0 0 0 1px rgb(120 87 237 / 18%);
  }

  &--rose {
    color: #d23a4d;
    background: color-mix(in srgb, #d23a4d 14%, white);
    box-shadow: inset 0 0 0 1px rgb(210 58 77 / 18%);
  }

  &--slate {
    color: #4d5b6e;
    background: color-mix(in srgb, #4d5b6e 14%, white);
    box-shadow: inset 0 0 0 1px rgb(77 91 110 / 18%);
  }
}

.exchange-rate {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 22px 18px;
  text-align: center;
  background: #fff;

  > span {
    display: inline-flex;
    width: 42px;
    height: 42px;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    border-radius: 50%;
    color: #fff;
    background: linear-gradient(135deg, #19b8a8, #268ee6);
    box-shadow: 0 8px 20px rgb(20 166 174 / 22%);
    font-size: 22px;
  }

  small,
  em {
    color: var(--app-text-label);
    font-size: 13px;
    font-style: normal;
  }

  strong {
    margin: 5px 0;
    color: var(--app-text-body);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
  }
}

@include narrow {
  .exchange-overview {
    &__flow {
      grid-template-columns: minmax(0, 1fr) 190px minmax(0, 1fr);
    }

    &__meta {
      grid-template-columns: 1fr 1fr;
    }
  }
}

@include mobile {
  .exchange-overview {
    &__flow,
    &__meta {
      grid-template-columns: 1fr;
    }

    &__meta article + article {
      border-top: 1px solid #e4ebf3;
      border-left: 0;
    }

    &__meta article {
      padding: 17px 18px;
    }
  }

  .exchange-asset {
    padding: 23px 20px;

    &.is-target {
      flex-direction: row;
      text-align: left;
    }

    &.is-target p {
      justify-content: flex-start;
    }
  }

  .exchange-rate {
    padding: 16px 18px;
    border-top: 1px solid #e4ebf3;
    border-bottom: 1px solid #e4ebf3;
  }
}
</style>
