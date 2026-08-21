<template>
  <el-dialog
    :model-value="modelValue"
    width="min(820px, calc(100vw - 24px))"
    class="agent-transaction-dialog"
    title="交易详情"
    append-to-body
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-loading="loading" class="transaction-detail">
      <template v-if="info">
        <header class="transaction-detail__hero">
          <div class="transaction-detail__hero-copy">
            <span class="transaction-detail__type">{{ info.transaction.business_name }}</span>
            <h3>{{ info.transaction.order_no }}</h3>
            <small>交易编号</small>
          </div>
          <div class="transaction-detail__hero-status">
            <small>当前状态</small>
            <StatusBadge
              :label="info.transaction.status_name"
              :type="statusType(info.transaction.status_group)"
              :effect="info.transaction.status_group === 'pending' ? 'pending' : undefined"
            />
          </div>
        </header>

        <div v-if="isWithdrawal" class="transaction-detail__withdrawal-sections">
          <section class="withdrawal-summary">
            <header class="transaction-detail__section-title">
              <span class="transaction-detail__section-icon is-teal">$</span>
              <div><h4>金额明细</h4><small>出金金额、手续费与账户实际扣款</small></div>
            </header>
            <div class="amount-formula">
              <div class="amount-formula__item">
                <small>出金金额</small>
                <strong>{{ info.transaction.amount }}</strong>
                <span>{{ info.transaction.currency_code }}</span>
              </div>
              <span class="amount-formula__operator">＋</span>
              <div class="amount-formula__item">
                <small>固定手续费</small>
                <strong>{{ formatFixedFee(info.transaction.fee_amount) || '—' }}</strong>
                <span>{{ info.transaction.currency_code }}</span>
              </div>
              <span class="amount-formula__operator">＝</span>
              <div class="amount-formula__item is-total">
                <small>账户合计扣款</small>
                <strong>{{ info.transaction.total_amount || '—' }}</strong>
                <span>{{ info.transaction.currency_code }}</span>
              </div>
            </div>
          </section>

          <section class="withdrawal-summary">
            <header class="transaction-detail__section-title">
              <span class="transaction-detail__section-icon">方</span>
              <div><h4>付款关系</h4><small>本次出金使用的付款人与收款人</small></div>
            </header>
            <div class="party-flow">
              <article>
                <small>付款方</small>
                <strong>{{ info.transaction.payer_name || '—' }}</strong>
                <span>资金发起方</span>
              </article>
              <span class="party-flow__arrow"><el-icon><Right /></el-icon></span>
              <article>
                <small>收款方</small>
                <strong>{{ info.transaction.payee_name || '—' }}</strong>
                <span>资金接收方</span>
              </article>
            </div>
          </section>
        </div>

        <section v-if="isExchange" class="exchange-summary">
          <header class="transaction-detail__section-title">
            <span class="transaction-detail__section-icon is-teal">兑</span>
            <div><h4>兑换明细</h4><small>支付资产、订单锁定汇率与到账结果</small></div>
          </header>
          <div class="exchange-flow">
            <article>
              <small>支付金额</small>
              <strong>{{ info.transaction.amount }}</strong>
              <span>{{ info.transaction.currency_code }}</span>
            </article>
            <div class="exchange-flow__rate">
              <small>锁定汇率</small>
              <strong>× {{ formatExchangeRate(info.transaction.exchange_rate) || '—' }}</strong>
              <el-icon><Right /></el-icon>
            </div>
            <article class="is-target">
              <small>到账金额</small>
              <strong>{{ info.transaction.target_amount || '—' }}</strong>
              <span>{{ info.transaction.target_currency_code || '—' }}</span>
            </article>
          </div>
        </section>

        <div v-if="detailGroups.length" class="transaction-detail__groups">
          <section
            v-for="group in detailGroups"
            :key="group.title"
            class="transaction-detail__section"
            :class="`is-${group.tone}`"
          >
            <header class="transaction-detail__section-title">
              <span class="transaction-detail__section-icon">{{ group.icon }}</span>
              <div>
                <h4>{{ group.title }}</h4>
                <small>{{ group.subtitle }}</small>
              </div>
            </header>
            <div class="transaction-detail__grid">
              <article
                v-for="field in group.fields"
                :key="field.label"
                :class="{ 'is-featured': field.featured, 'is-wide': field.wide }"
              >
                <small>{{ field.label }}</small>
                <strong>{{ field.value }}</strong>
              </article>
            </div>
          </section>
        </div>

        <AdminPanel
          v-if="timelineItems.length"
          class="transaction-detail__timeline-panel"
          title="处理时间线"
          subtitle="本次订单的处理流程与状态变更记录"
          :icon="Clock"
        >
          <div class="transaction-detail__timeline-scroll">
            <AdminTimeline :items="timelineItems" />
          </div>
        </AdminPanel>
      </template>
      <el-empty v-else-if="!loading" description="暂无交易详情" />
    </div>
    <template #footer>
      <el-button @click="emit('update:modelValue', false)">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Clock, Right } from '@element-plus/icons-vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminTimeline from '@/components/admin/AdminTimeline.vue';
import type { AdminTimelineItem } from '@/components/admin/AdminTimeline.vue';
import type { AgentTransactionInfo } from '@/api/modules/agent';
import { formatExchangeRate, formatFixedFee } from '@/utils/decimal';

const props = defineProps<{
  modelValue: boolean;
  loading: boolean;
  info: AgentTransactionInfo | null;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
}>();

const isWithdrawal = computed(() => props.info?.transaction.business_type === 'withdrawal');
const isExchange = computed(() => props.info?.transaction.business_type === 'exchange');

interface DetailField {
  label: string;
  value: string;
  featured?: boolean;
  wide?: boolean;
}

interface DetailGroup {
  title: string;
  subtitle: string;
  icon: string;
  tone: 'blue' | 'teal' | 'orange' | 'gray';
  fields: DetailField[];
}

const detailGroups = computed<DetailGroup[]>(() => {
  const transaction = props.info?.transaction;
  if (!transaction) return [];

  if (transaction.business_type === 'deposit') {
    return [
      {
        title: '入金信息',
        subtitle: '本次入金的资产与链上通道',
        icon: '充',
        tone: 'teal',
        fields: [
          { label: '入金金额', value: `${transaction.amount} ${transaction.currency_code}`, featured: true },
          {
            label: '币种 / 网络',
            value: [transaction.currency_code, transaction.network_code].filter(Boolean).join(' · '),
          },
        ],
      },
      {
        title: '链上信息',
        subtitle: '用于核对到账记录的链上凭据',
        icon: '链',
        tone: 'blue',
        fields: [
          { label: '交易哈希', value: detailText('txid'), wide: true },
          { label: '平台收款地址', value: detailText('receiving_address_snapshot'), wide: true },
        ],
      },
    ];
  }
  if (transaction.business_type === 'exchange') {
    return [];
  }
  return [];
});

const timelineItems = computed<AdminTimelineItem[]>(() => {
  const value = props.info?.detail.timeline;
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      key: String(row.id || row.event || index),
      title: String(row.name || row.action_name || row.event || '处理记录'),
      time: row.time || row.created_at ? String(row.time || row.created_at) : undefined,
      description: [row.actor_name || row.actor_type_name, row.message]
        .filter(Boolean)
        .map(String)
        .join(' · ') || undefined,
      state: 'done',
    };
  });
});

function detailText(key: string) {
  const value = props.info?.detail[key];
  return typeof value === 'string' || typeof value === 'number' ? String(value) : '—';
}

function statusType(group: string): StatusBadgeType {
  if (group === 'completed' || group === 'success') return 'success';
  if (group === 'rejected' || group === 'failed') return 'danger';
  return 'warning';
}
</script>

<style scoped lang="scss">
.transaction-detail {
  min-height: 220px;

  &__hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 22px 24px;
    border: 1px solid #dce9f5;
    border-radius: 16px;
    background: linear-gradient(135deg, #eaf8f6, #edf4ff);

    small {
      color: var(--app-text-label);
      font-size: 12px;
    }
    h3 {
      margin: 5px 0 0;
      color: var(--app-text-heading);
      font-size: 18px;
    }
  }

  &__hero-copy {
    display: flex;
    flex-direction: column;
  }
  &__type {
    align-self: flex-start;
    padding: 4px 9px;
    border-radius: 6px;
    color: #087f78;
    background: rgb(18 169 158 / 10%);
    font-size: 12px;
    font-weight: 600;
  }
  &__hero-status {
    display: grid;
    justify-items: end;
    gap: 8px;
  }

  &__groups {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin-top: 18px;
  }

  &__section {
    min-width: 0;
    padding: 18px;
    border: 1px solid #e1e9f2;
    border-radius: 15px;
    background: #fff;
  }
  &__section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  &__section-title h4 {
    margin: 0;
    color: var(--app-text-heading);
    font-size: 15px;
  }
  &__section-title small {
    display: block;
    margin-top: 3px;
    color: var(--app-text-label);
    font-size: 11px;
  }
  &__section-icon {
    display: grid;
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    place-items: center;
    border-radius: 10px;
    color: #1267e8;
    background: #eaf2ff;
    font-size: 13px;
    font-weight: 700;
  }
  &__section-icon.is-teal {
    color: #087f78;
    background: #e4f7f4;
  }
  &__section.is-teal &__section-icon {
    color: #087f78;
    background: #e4f7f4;
  }
  &__section.is-gray &__section-icon {
    color: #64748b;
    background: #eef2f7;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 20px;
  }
  &__grid article {
    display: grid;
    min-width: 0;
    gap: 6px;
    padding-bottom: 12px;
    border-bottom: 1px solid #edf1f6;
  }
  &__grid article.is-wide {
    grid-column: 1 / -1;
  }
  &__grid article.is-featured strong {
    color: #087f78;
    font-size: 17px;
    font-weight: 700;
  }
  &__grid small {
    color: var(--app-text-label);
    font-size: 12px;
  }
  &__grid strong {
    overflow-wrap: anywhere;
    color: var(--app-text-body);
    font-size: 14px;
    font-weight: 600;
  }
  &__section:nth-child(3) {
    grid-column: 1 / -1;
  }
  &__section:only-child {
    grid-column: 1 / -1;
  }
  &__section:nth-child(3) &__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  &__section:nth-child(3) &__grid article {
    padding-bottom: 0;
    border-bottom: 0;
  }
  &__timeline-panel {
    margin-top: 22px;
    overflow: hidden;
  }
  &__timeline-scroll {
    min-height: 220px;
    max-height: 440px;
    padding: 22px 26px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #c8d2e0 transparent;

    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-thumb { border-radius: 3px; background: #c8d2e0; }
    &::-webkit-scrollbar-track { background: transparent; }
  }
}

.transaction-detail__withdrawal-sections {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.withdrawal-summary {
  padding: 18px;
  border: 1px solid #e1e9f2;
  border-radius: 15px;
  background: #fff;
}

.exchange-summary {
  margin-top: 18px;
  padding: 18px;
  border: 1px solid #e1e9f2;
  border-radius: 15px;
  background: #fff;
}

.exchange-flow {
  display: grid;
  align-items: stretch;
  grid-template-columns: minmax(0, 1fr) minmax(150px, 0.7fr) minmax(0, 1fr);
  gap: 14px;

  article {
    display: grid;
    min-width: 0;
    align-content: center;
    padding: 18px 20px;
    border: 1px solid #e0e8f0;
    border-radius: 12px;
    background: #f8fafc;

    small { color: var(--app-text-label); font-size: 11px; }
    strong { margin-top: 6px; overflow-wrap: anywhere; color: var(--app-text-heading); font-size: 24px; font-weight: 730; font-variant-numeric: tabular-nums; }
    span { margin-top: 3px; color: #087f78; font-size: 12px; font-weight: 700; }

    &.is-target {
      border-color: #bfe3de;
      background: #edf9f7;
      strong { color: #078c84; }
    }
  }

  &__rate {
    display: grid;
    min-width: 0;
    place-items: center;
    align-content: center;
    gap: 5px;
    text-align: center;

    small { color: var(--app-text-label); font-size: 10px; }
    strong { color: #1267e8; font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
    span { color: #8796a8; font-size: 10px; }
    i {
      display: grid;
      width: 40px;
      height: 40px;
      margin-top: 3px;
      place-items: center;
      border: 1px solid #bfe0dd;
      border-radius: 50%;
      color: #0b9f98;
      background: #fff;
      font-size: 20px;
      font-style: normal;
    }
  }
}

.amount-formula {
  display: grid;
  align-items: stretch;
  grid-template-columns: minmax(0, 1fr) 36px minmax(0, 1fr) 36px minmax(0, 1.15fr);
  gap: 8px;

  &__item {
    display: grid;
    min-width: 0;
    align-content: center;
    padding: 16px 18px;
    border: 1px solid #e0e8f0;
    border-radius: 12px;
    background: #f8fafc;

    small { color: var(--app-text-label); font-size: 11px; }
    strong { margin-top: 6px; overflow-wrap: anywhere; color: var(--app-text-heading); font-size: 22px; font-weight: 730; font-variant-numeric: tabular-nums; }
    span { margin-top: 3px; color: #087f78; font-size: 11px; font-weight: 700; }

    &.is-total {
      border-color: #bfe3de;
      background: #edf9f7;
      strong { color: #078c84; }
    }
  }

  &__operator {
    display: grid;
    place-items: center;
    color: #7b8da3;
    font-size: 22px;
    font-weight: 400;
  }
}

.party-flow {
  display: grid;
  align-items: center;
  grid-template-columns: minmax(0, 1fr) 52px minmax(0, 1fr);
  gap: 14px;

  article {
    display: grid;
    min-width: 0;
    gap: 5px;
    padding: 16px 18px;
    border: 1px solid #e0e8f0;
    border-radius: 12px;
    background: #f8fafc;
  }
  small { color: var(--app-text-label); font-size: 11px; }
  strong { overflow-wrap: anywhere; color: var(--app-text-heading); font-size: 16px; font-weight: 700; }
  article > span { color: #8997a8; font-size: 11px; }

  &__arrow {
    display: inline-flex;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    justify-self: center;
    border: 1px solid #bfe0dd;
    border-radius: 50%;
    color: #0b9f98;
    background: #fff;
    font-size: 20px;
  }
}

@include mobile {
  .transaction-detail__hero {
    align-items: flex-start;
  }
  .transaction-detail__groups {
    grid-template-columns: 1fr;
  }
  .transaction-detail__section:nth-child(3) {
    grid-column: auto;
  }
  .transaction-detail__grid {
    grid-template-columns: 1fr;
  }
  .transaction-detail__grid article.is-wide {
    grid-column: auto;
  }
  .amount-formula,
  .party-flow,
  .exchange-flow {
    grid-template-columns: 1fr;
  }
  .amount-formula__operator { min-height: 24px; }
  .party-flow__arrow { transform: rotate(90deg); }
  .exchange-flow__rate i { transform: rotate(90deg); }
}
</style>
