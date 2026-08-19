<template>
  <AdminPanel title="交易摘要" subtitle="统一交易记录的公共字段" :icon="Tickets">
    <dl class="transaction-summary">
      <div>
        <dt>业务类型</dt>
        <dd>
          <span class="type-chip" :class="`is-${transaction.business_type}`">
            {{ transaction.business_name }}
          </span>
        </dd>
      </div>
      <div>
        <dt>订单号</dt>
        <dd class="is-mono">{{ transaction.order_no }}</dd>
      </div>
      <div>
        <dt>代理</dt>
        <dd>{{ transaction.user.company_name }} · {{ transaction.user.agent_code }}</dd>
      </div>
      <div>
        <dt>提交时间</dt>
        <dd>{{ transaction.submitted_at || '—' }}</dd>
      </div>
      <div v-if="transaction.completed_at">
        <dt>完成时间</dt>
        <dd>{{ transaction.completed_at }}</dd>
      </div>
      <div v-if="transaction.finished_at">
        <dt>终态时间</dt>
        <dd>{{ transaction.finished_at }}</dd>
      </div>
      <div>
        <dt>状态</dt>
        <dd>
          <StatusBadge :label="transaction.status_name" :type="statusType" :effect="statusEffect" />
        </dd>
      </div>
      <div v-if="transaction.business_type === 'deposit'">
        <dt>入金金额</dt>
        <dd class="is-accent">
          {{ transaction.amount }} {{ transaction.currency_code }}
          <small v-if="transaction.network_code">· {{ transaction.network_code }}</small>
        </dd>
      </div>
      <div v-if="transaction.business_type === 'exchange'">
        <dt>兑换</dt>
        <dd class="is-accent">
          {{ transaction.amount }} {{ transaction.currency_code }} →
          {{ transaction.target_amount }} {{ transaction.target_currency_code }}
          <small v-if="transaction.exchange_rate">· 比例 {{ transaction.exchange_rate }}</small>
        </dd>
      </div>
      <template v-if="transaction.business_type === 'withdrawal'">
        <div>
          <dt>出金金额（实收）</dt>
          <dd class="is-accent">{{ transaction.amount }} {{ transaction.currency_code }}</dd>
        </div>
        <div>
          <dt>手续费 / 总扣款</dt>
          <dd>
            {{ transaction.fee_amount }} / {{ transaction.total_amount }}
            {{ transaction.currency_code }}
          </dd>
        </div>
        <div>
          <dt>付款人 → 收款人</dt>
          <dd>{{ transaction.payer_name }} → {{ transaction.payee_name }}</dd>
        </div>
      </template>
    </dl>
  </AdminPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Tickets } from '@element-plus/icons-vue';

import type { TransactionItem } from '@/api/modules/transaction';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge, { type StatusBadgeType } from '@/components/admin/StatusBadge.vue';

const props = defineProps<{ transaction: TransactionItem }>();

const statusType = computed<StatusBadgeType>(() => {
  const group = props.transaction.status_group;
  if (group === 'completed') return 'success';
  if (group === 'rejected') return 'danger';
  if (group === 'failed') return 'gray';
  if (group === 'processing') return 'primary';
  return 'warning';
});
const statusEffect = computed(() =>
  props.transaction.status_group === 'pending' ||
  props.transaction.status_group === 'needs_supplement'
    ? 'pending'
    : undefined,
);
</script>

<style scoped lang="scss">
.transaction-summary {
  display: grid;
  margin: 0;
  padding: 6px 24px 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 28px;

  > div {
    min-width: 0;
    padding: 14px 0;
    border-bottom: 1px dashed #dfe7ef;
  }

  dt {
    color: var(--app-text-label);
    font-size: 12px;
  }

  dd {
    margin: 6px 0 0;
    color: var(--app-text-body);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
    overflow-wrap: anywhere;

    &.is-mono {
      font-family: ui-monospace, Consolas, monospace;
    }

    &.is-accent {
      color: #078f89;
      font-size: 16px;

      small {
        color: var(--app-text-label);
        font-size: 12px;
        font-weight: 500;
      }
    }
  }
}

@include narrow {
  .transaction-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@include mobile {
  .transaction-summary {
    grid-template-columns: 1fr;
    padding: 4px 16px 16px;
  }
}
</style>
