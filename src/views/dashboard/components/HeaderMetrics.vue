<template>
  <div class="dashboard-summary">
    <section class="agent-health-card">
      <div class="agent-health-card__heading">
        <div>
          <span class="dashboard-eyebrow">代理运营</span>
          <h2>正常代理</h2>
        </div>
        <span class="agent-health-card__icon"><UserFilled /></span>
      </div>

      <div class="agent-health-card__value">{{ agentSummary?.active_count ?? 0 }}</div>
      <p>可正常登录并使用业务功能</p>

      <div class="agent-health-card__progress">
        <div class="agent-health-card__progress-label">
          <span>正常使用占比</span>
          <strong>{{ agentSummary?.active_percentage ?? 0 }}%</strong>
        </div>
        <div class="agent-health-card__track">
          <i :style="{ width: `${agentSummary?.active_percentage ?? 0}%` }" />
        </div>
        <small>
          共 {{ agentSummary?.total_count ?? 0 }} 个代理账户，
          {{ agentSummary?.active_count ?? 0 }} 个状态正常
        </small>
      </div>
    </section>

    <AdminPanel
      class="asset-overview"
      title="全平台代理账户余额"
      subtitle="汇总所有代理的可用与冻结资金"
    >
      <template #extra>
        <span class="dashboard-count"><i />{{ assets.length }} 个币种</span>
      </template>

      <div class="asset-overview__grid">
        <article
          v-for="asset in assets"
          :key="asset.currency"
          class="asset-card"
          :class="`asset-card--${asset.tone}`"
        >
          <header>
            <div class="asset-card__identity">
              <span class="asset-card__symbol">{{ asset.symbol }}</span>
              <div>
                <strong>{{ asset.currency }}</strong>
                <small>{{ asset.name }} · {{ asset.kind }}</small>
              </div>
            </div>
          </header>

          <strong class="asset-card__total">{{ asset.total }}</strong>
          <span class="asset-card__caption">全部代理账户合计</span>

          <div class="asset-card__details">
            <div>
              <span>可用余额</span><strong>{{ asset.available }}</strong>
            </div>
            <div>
              <span>冻结余额</span><strong>{{ asset.frozen }}</strong>
            </div>
          </div>

          <div class="asset-card__track"><i :style="{ width: asset.frozenRate }" /></div>
        </article>
      </div>

      <footer class="asset-overview__footer">
        <span>统计范围：全部代理账户 · 按币种汇总</span>
        <span>余额不代表链上钱包或银行实际资产</span>
      </footer>
    </AdminPanel>
  </div>
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue';
import { computed } from 'vue';

import type { OperationAgentSummary, OperationBalanceTotal } from '@/api/modules/dashboard';
import AdminPanel from '@/components/admin/AdminPanel.vue';

const props = defineProps<{
  agentSummary: OperationAgentSummary | null;
  balanceTotals: OperationBalanceTotal[];
}>();

const assets = computed(() =>
  props.balanceTotals.map((item, index) => ({
    currency: item.currency.code,
    symbol: item.currency.code === 'USDT' ? '₮' : '$',
    name: item.currency.name,
    kind: item.currency.type_name,
    total: formatAmount(item.total_balance),
    available: formatAmount(item.available_balance),
    frozen: formatAmount(item.frozen_balance),
    frozenRate: `${clampPercentage(item.frozen_percentage)}%`,
    tone: index === 1 ? 'blue' : index === 2 ? 'mint' : 'teal',
  })),
);

function clampPercentage(value: string) {
  const percentage = Number(value);
  if (!Number.isFinite(percentage)) return 0;
  return Math.min(100, Math.max(0, percentage));
}

function formatAmount(value: string) {
  const [integer = '0', decimal] = String(value).split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decimal === undefined ? formattedInteger : `${formattedInteger}.${decimal}`;
}
</script>

<style scoped lang="scss">
.dashboard-summary {
  display: grid;
  grid-template-columns: minmax(220px, 0.28fr) minmax(0, 1fr);
  gap: 18px;
}

.dashboard-eyebrow {
  color: var(--app-text-subtle);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.agent-health-card {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 330px;
  overflow: hidden;
  flex-direction: column;
  padding: 24px;
  border: 1px solid rgb(74 206 205 / 28%);
  border-radius: 20px;
  background:
    radial-gradient(circle at 88% 15%, rgb(36 198 199 / 21%), transparent 30%),
    radial-gradient(circle at 20% 110%, rgb(42 111 204 / 26%), transparent 42%),
    linear-gradient(148deg, #0b3152 0%, #082744 48%, #061d35 100%);
  box-shadow:
    0 22px 48px rgb(5 30 57 / 18%),
    inset 0 1px 0 rgb(255 255 255 / 8%);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.42;
    background:
      linear-gradient(90deg, transparent 49.5%, rgb(90 221 220 / 7%) 50%, transparent 50.5%),
      linear-gradient(transparent 49.5%, rgb(90 221 220 / 7%) 50%, transparent 50.5%);
    background-size: 34px 34px;
    mask-image: linear-gradient(135deg, transparent 5%, #000 75%);
  }

  &::after {
    content: 'AG';
    position: absolute;
    right: -8px;
    bottom: -24px;
    color: rgb(79 226 221 / 8%);
    font-size: 92px;
    font-weight: 800;
    letter-spacing: -0.08em;
  }

  .dashboard-eyebrow {
    color: #68d7d0;
  }

  &__heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;

    h2 {
      margin: 6px 0 0;
      color: #f5fbff;
      font-size: 19px;
      font-weight: 700;
    }
  }

  &__icon {
    display: inline-flex;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    border: 1px solid rgb(107 235 226 / 25%);
    color: #6ee7dc;
    background: rgb(52 202 194 / 10%);
    box-shadow:
      0 0 24px rgb(44 211 202 / 12%),
      inset 0 0 14px rgb(57 212 204 / 8%);

    svg {
      width: 21px;
    }
  }

  &__value {
    margin-top: 28px;
    color: #fff;
    font-size: clamp(52px, 5vw, 70px);
    font-weight: 700;
    letter-spacing: -0.05em;
    line-height: 1;
    text-shadow: 0 0 30px rgb(87 225 216 / 16%);
  }

  > p {
    margin: 8px 0 0;
    color: #9cb6ca;
    font-size: 14px;
  }

  &__progress {
    position: relative;
    z-index: 1;
    margin-top: auto;
  }

  &__progress-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 9px;
    color: #9db8cc;
    font-size: 13px;

    strong {
      color: #5de3d5;
      font-weight: 700;
    }
  }

  &__track {
    height: 7px;
    overflow: hidden;
    border-radius: 999px;
    background: rgb(255 255 255 / 10%);

    i {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #28d6c3, #40b7ef);
      box-shadow: 0 0 16px rgb(48 221 208 / 48%);
    }
  }

  small {
    display: block;
    margin-top: 10px;
    color: #7898af;
    font-size: 12px;
  }
}

.dashboard-count {
  display: inline-flex;
  height: 30px;
  align-items: center;
  gap: 7px;
  padding: 0 12px;
  border-radius: 999px;
  color: #087b65;
  background: #eaf9f3;
  font-size: 12px;
  font-weight: 700;

  i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #13a27d;
  }
}

.asset-overview {
  position: relative;
  border-color: #d4e3ee;
  background:
    radial-gradient(circle at 94% -10%, rgb(27 181 177 / 9%), transparent 32%),
    linear-gradient(145deg, rgb(255 255 255 / 98%), rgb(248 252 255 / 96%));
  box-shadow:
    0 20px 46px rgb(13 49 80 / 9%),
    inset 0 1px 0 #fff;

  &::before {
    content: '';
    position: absolute;
    z-index: 2;
    top: 0;
    left: 24px;
    width: 120px;
    height: 2px;
    border-radius: 0 0 3px 3px;
    background: linear-gradient(90deg, #20b9ad, transparent);
    box-shadow: 0 2px 12px rgb(32 194 187 / 30%);
  }

  :deep(.admin-panel__header) {
    padding: 20px 22px;
  }

  :deep(.admin-panel__title) {
    gap: 0;
  }

  :deep(.admin-panel__title h2) {
    font-size: 19px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    padding: 18px 20px 14px;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 0 22px 18px;
    color: var(--app-text-subtle);
    font-size: 11px;
  }
}

.asset-card {
  --asset-color: #079b91;
  --asset-soft: #e8f7f5;
  min-width: 0;
  padding: 18px;
  position: relative;
  overflow: hidden;
  border: 1px solid #dce7ee;
  border-radius: 16px;
  background: #fff;
  box-shadow:
    0 8px 22px rgb(16 50 78 / 5%),
    inset 0 1px 0 #fff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: #9fd8d3;
    box-shadow:
      0 14px 30px rgb(15 72 91 / 9%),
      inset 0 3px 0 #12aaa0;
    transform: translateY(-2px);
  }

  &--blue {
    --asset-color: #079b91;
    --asset-soft: #e8f7f5;
  }

  &--mint {
    --asset-color: #079b91;
    --asset-soft: #e8f7f5;
    border-color: #dce7ee;
  }

  header,
  &__identity,
  &__details > div {
    display: flex;
    align-items: center;
  }

  header {
    justify-content: space-between;
    gap: 12px;
  }

  &__identity {
    gap: 11px;

    .asset-card__symbol {
      display: inline-flex;
      width: 40px;
      height: 40px;
      flex: 0 0 40px;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: var(--asset-color);
      background: var(--asset-soft);
      font-size: 18px;
      font-weight: 750;
      border: 1px solid #d8ece9;
      box-shadow: none;
    }

    > div {
      display: grid;
      gap: 3px;

      strong {
        color: #1c3049;
        font-size: 16px;
        line-height: 1.1;
      }

      small {
        color: #8492a3;
        font-size: 11px;
        font-weight: 500;
      }
    }
  }

  &__total {
    display: block;
    min-width: 0;
    margin-top: 20px;
    overflow: hidden;
    color: #102743;
    font-size: clamp(20px, 2vw, 27px);
    font-weight: 650;
    letter-spacing: -0.035em;
    line-height: 1.1;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    text-shadow: none;
  }

  &__caption {
    display: block;
    margin-top: 5px;
    color: #8997a8;
    font-size: 11px;
  }

  &__details {
    display: grid;
    gap: 8px;
    margin-top: 16px;
    padding-top: 14px;
    padding: 12px;
    border: 1px solid #e7edf2;
    border-radius: 10px;
    background: #f8fafc;

    > div {
      justify-content: space-between;
      gap: 12px;
      color: #69798d;
      font-size: 12px;

      strong {
        min-width: 0;
        overflow: hidden;
        color: #2d415a;
        font-size: 12px;
        font-weight: 650;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }

      &:last-child strong {
        color: var(--asset-color);
      }
    }
  }

  &__track {
    height: 5px;
    margin-top: 12px;
    overflow: hidden;
    border-radius: 999px;
    background: #e5ecef;

    i {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: var(--asset-color);
      box-shadow: 0 0 10px color-mix(in srgb, var(--asset-color) 45%, transparent);
    }
  }
}

@include narrow {
  .dashboard-summary {
    grid-template-columns: minmax(200px, 0.32fr) minmax(0, 1fr);
  }

  .asset-overview__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .asset-card:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .dashboard-summary {
    grid-template-columns: 1fr;
  }

  .agent-health-card {
    min-height: 260px;
  }
}

@include mobile {
  .agent-health-card {
    min-height: 240px;
    padding: 20px;
  }

  .asset-overview {
    &__grid {
      grid-template-columns: 1fr;
      padding: 14px;
    }

    &__footer {
      flex-direction: column;
      gap: 4px;
      padding: 0 16px 16px;
    }
  }

  .asset-card:last-child {
    grid-column: auto;
  }
}
</style>
