<template>
  <section class="agent-overview-card">
    <!-- 顶部：身份 + 概览统计 -->
    <div class="agent-overview-card__top">
      <div class="identity-card">
        <div class="identity-card__avatar">
          <el-icon><UserFilled /></el-icon>
        </div>
        <div class="identity-card__body">
          <h3 class="identity-card__name">{{ user.company_name }}</h3>
          <div class="identity-card__meta">
            <span>{{ user.agent_code }}</span>
            <span class="dot">·</span>
            <span class="email">{{ user.email }}</span>
            <el-icon class="copy-icon" @click="emit('copy-email')"><CopyDocument /></el-icon>
          </div>
        </div>
      </div>

      <div class="identity-stats">
        <div class="identity-stats__status">
          <small>账户状态</small>
          <StatusBadge
            :label="user.status_name"
            :type="accountStatusType"
            :effect="user.status === 0 ? 'pending' : undefined"
          />
        </div>
        <el-button
          v-if="user.status === 0"
          class="identity-stats__action"
          type="primary"
          :icon="Promotion"
          :loading="mailLoading"
          @click="emit('send-invitation')"
        >发送激活邮件</el-button>
        <el-button
          v-else-if="user.status === 1 || user.status === 2"
          class="identity-stats__action"
          type="primary"
          :icon="Key"
          :loading="mailLoading"
          @click="emit('send-password-reset')"
        >发送密码重置邮件</el-button>
      </div>
    </div>

    <div class="agent-overview-card__divider" />

    <!-- 底部：资产卡片 -->
    <div class="agent-overview-card__assets">
      <article v-for="asset in assets" :key="asset.currency.id" class="asset-card">
        <header>
          <span class="asset-card__icon" :class="currencyTone(asset.currency.code)">
            {{ currencySymbol(asset.currency.code) }}
          </span>
          <div>
            <strong class="asset-card__code">{{ asset.currency.code }}</strong>
            <small>{{ asset.currency.name }}</small>
          </div>
          <em class="asset-card__bg-icon" aria-hidden="true">
            {{ currencySymbol(asset.currency.code) }}
          </em>
        </header>
        <div class="asset-card__total">
          <small>总余额</small>
          <strong>{{ asset.total_balance }}</strong>
        </div>
        <footer>
          <div>
            <small>可用余额</small>
            <strong>{{ asset.available_balance }}</strong>
          </div>
          <div>
            <small>冻结余额</small>
            <strong>{{ asset.frozen_balance }}</strong>
          </div>
        </footer>
      </article>
      <el-empty v-if="!assets.length" description="暂无资产余额" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CopyDocument, Key, Promotion, UserFilled } from '@element-plus/icons-vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import type { AgentAssetBalance } from '@/api/modules/agent';

interface BasicUser {
  agent_code: string;
  company_name: string;
  email: string;
  status: 0 | 1 | 2 | 3;
  status_name: string;
}

const props = defineProps<{
  user: BasicUser;
  assets: AgentAssetBalance[];
  mailLoading?: boolean;
}>();

const emit = defineEmits<{
  (event: 'copy-email'): void;
  (event: 'send-invitation'): void;
  (event: 'send-password-reset'): void;
}>();

const accountStatusType = computed<StatusBadgeType>(() => {
  if (props.user.status === 1) return 'success';
  if (props.user.status === 3) return 'danger';
  if (props.user.status === 2) return 'gray';
  return 'warning';
});

function currencySymbol(code: string): string {
  if (code === 'USDT') return '₮';
  if (code === 'USDC' || code === 'USD') return '$';
  return code.slice(0, 1);
}

function currencyTone(code: string) {
  if (code === 'USDT') return 'is-teal';
  if (code === 'USDC') return 'is-blue';
  if (code === 'USD') return 'is-green';
  return 'is-gray';
}
</script>

<style scoped lang="scss">
.agent-overview-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  padding: 26px 28px 28px;
  border: 1px solid #dce5ef;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 14px 36px rgb(16 42 80 / 6%);
  gap: 18px;

  &__top {
    display: grid;
    align-items: center;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: 24px;
  }

  &__divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #e4ebf2 20%, #e4ebf2 80%, transparent);
  }

  &__assets {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
}

.identity-card {
  display: flex;
  align-items: center;
  gap: 26px;
  min-width: 0;

  &__avatar {
    display: grid;
    width: 96px;
    height: 96px;
    flex: none;
    place-items: center;
    border-radius: 50%;
    color: #1f73f2;
    background: radial-gradient(circle at 30% 30%, #f0f7ff, #d6e8ff);
    font-size: 46px;
    box-shadow: inset 0 0 0 1px rgb(31 115 242 / 12%);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  &__name {
    margin: 0;
    color: var(--app-text-heading);
    font-size: clamp(34px, 3.2vw, 44px);
    font-weight: 700;
    letter-spacing: 0.5px;
    line-height: 1.1;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    color: var(--app-text-label);
    font-size: 15px;

    .dot { color: #b8c2cf; }
    .email {
      color: var(--app-text-body);
      font-weight: 500;
    }

    .copy-icon {
      display: inline-flex;
      width: 28px;
      height: 28px;
      align-items: center;
      justify-content: center;
      border-radius: 7px;
      color: #1f73f2;
      background: #eaf2ff;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.15s ease;

      &:hover { background: #d6e8ff; }
    }
  }

}

.identity-stats {
  display: flex;
  align-items: center;
  justify-self: end;
  gap: 18px;
  padding: 10px 10px 10px 16px;
  border: 1px solid #e0e8f1;
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 8px 22px rgb(20 46 78 / 5%);

  &__status {
    display: flex;
    align-items: center;
    gap: 10px;

    > small {
      padding-right: 14px;
      border-right: 1px solid #e5ebf2;
    }
  }

  &__action {
    min-width: 174px;
    height: 40px;
    margin-left: 0;
    padding: 0 16px;
    border: 1px solid #c8e9e5;
    border-radius: 9px;
    color: #087f78;
    background: #edf9f7;
    box-shadow: none;
    font-size: 14px;
    font-weight: 600;
    transition:
      border-color 0.18s ease,
      color 0.18s ease,
      box-shadow 0.18s ease,
      transform 0.18s ease;

    &:hover,
    &:focus {
      border-color: #83cbc5;
      color: #06736d;
      background: #e2f5f2;
      box-shadow: none;
      transform: none;
    }

    &:active { background: #d8f0ed; }

    :deep(.el-icon) {
      width: auto;
      height: auto;
      margin-right: 7px;
      color: #087f78;
      font-size: 15px;
    }
  }

  small {
    color: var(--app-text-label);
    font-size: 12px;
  }

}

.asset-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  padding: 18px 18px 14px;
  overflow: hidden;
  border: 1px solid #dce7ef;
  border-radius: 15px;
  background: linear-gradient(145deg, #fff, #f7fbfd);

  > header {
    display: flex;
    align-items: center;
    gap: 10px;

    > div {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .asset-card__code {
      color: #087f78;
      font-size: 17px;
      font-weight: 700;
    }

    > div small {
      color: var(--app-text-label);
      font-size: 12px;
    }
  }

  &__icon {
    display: grid;
    width: 50px;
    height: 50px;
    flex: 0 0 50px;
    place-items: center;
    border-radius: 50%;
    font-family: Arial, sans-serif;
    font-size: 30px;
    font-weight: 700;

    &.is-teal {
      color: #fff;
      background: linear-gradient(135deg, #26c8a6, #07978f);
    }
    &.is-blue {
      color: #fff;
      background: linear-gradient(135deg, #2f7cf2, #1267e8);
    }
    &.is-green {
      color: #fff;
      background: linear-gradient(135deg, #22a06b, #088a55);
    }
    &.is-gray {
      color: #5e7186;
      background: #e6edf6;
    }
  }

  &__bg-icon {
    position: absolute;
    top: 14px;
    right: 14px;
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    color: #eaf2ff;
    font-family: Arial, sans-serif;
    font-size: 60px;
    font-style: normal;
    font-weight: 700;
    opacity: 0.5;
    pointer-events: none;

  }

  &__total {
    display: grid;
    gap: 5px;
    margin-top: 6px;

    small {
      color: var(--app-text-label);
      font-size: 12px;
    }

    strong {
      overflow-wrap: anywhere;
      color: var(--app-text-heading);
      font-size: 22px;
      font-variant-numeric: tabular-nums;
      font-weight: 700;
    }
  }

  > footer {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    padding-top: 12px;
    border-top: 1px solid #e4ebf2;

    > div {
      display: grid;
      min-width: 0;
      gap: 5px;
    }

    small {
      color: var(--app-text-label);
      font-size: 12px;
    }

    strong {
      overflow-wrap: anywhere;
      color: var(--app-text-body);
      font-size: 13px;
      font-weight: 600;
    }
  }
}

@include narrow {
  .agent-overview-card__top {
    grid-template-columns: 1fr;
  }
  .agent-overview-card__assets {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@include mobile {
  .agent-overview-card {
    padding: 18px;
  }
  .identity-card {
    gap: 16px;
    &__name { font-size: 28px; }
  }
  .agent-overview-card__assets {
    grid-template-columns: 1fr;
  }
  .identity-stats {
    width: auto;
    justify-self: stretch;
    align-items: stretch;
    flex-direction: column;
    &__status { justify-content: space-between; }
    &__action { width: 100%; }
  }
}
</style>
