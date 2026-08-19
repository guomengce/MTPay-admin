<template>
  <el-dialog
    :model-value="modelValue"
    width="min(720px, calc(100vw - 24px))"
    class="agent-transaction-dialog"
    title="交易详情"
    append-to-body
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-loading="loading" class="transaction-detail">
      <template v-if="info">
        <header class="transaction-detail__hero">
          <div>
            <span>{{ info.transaction.business_name }}</span>
            <h3>{{ info.transaction.order_no }}</h3>
          </div>
          <StatusBadge
            :label="info.transaction.status_name"
            :type="statusType(info.transaction.status_group)"
            :effect="info.transaction.status_group === 'pending' ? 'pending' : undefined"
          />
        </header>

        <section class="transaction-detail__section">
          <h4>业务信息</h4>
          <div class="transaction-detail__grid">
            <article v-for="field in businessFields" :key="field.label">
              <small>{{ field.label }}</small>
              <strong>{{ field.value }}</strong>
            </article>
          </div>
        </section>

        <section v-if="timeline.length" class="transaction-detail__section">
          <h4>处理时间线</h4>
          <div class="transaction-detail__timeline">
            <article v-for="(item, index) in timeline" :key="`${item.name}-${index}`">
              <i />
              <div>
                <strong>{{ item.name }}</strong
                ><small>{{ item.time || '—' }}</small>
              </div>
            </article>
          </div>
        </section>
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
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import type { AgentTransactionInfo } from '@/api/modules/agent';

const props = defineProps<{
  modelValue: boolean;
  loading: boolean;
  info: AgentTransactionInfo | null;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
}>();

const businessFields = computed(() => {
  const transaction = props.info?.transaction;
  if (!transaction) return [];

  const common = [
    { label: '提交时间', value: transaction.submitted_at || '—' },
    { label: '完成时间', value: transaction.completed_at || transaction.finished_at || '—' },
  ];
  if (transaction.business_type === 'deposit') {
    return [
      {
        label: '入金币种 / 网络',
        value: [transaction.currency_code, transaction.network_code].filter(Boolean).join(' · '),
      },
      { label: '入金金额', value: `${transaction.amount} ${transaction.currency_code}` },
      { label: '交易哈希', value: detailText('txid') },
      { label: '收款地址', value: detailText('receiving_address_snapshot') },
      ...common,
    ];
  }
  if (transaction.business_type === 'exchange') {
    return [
      { label: '支付金额', value: `${transaction.amount} ${transaction.currency_code}` },
      { label: '兑换比例', value: transaction.exchange_rate || '—' },
      {
        label: '到账金额',
        value:
          `${transaction.target_amount || '—'} ${transaction.target_currency_code || ''}`.trim(),
      },
      { label: '比例来源', value: detailText('rate_source_name') },
      ...common,
    ];
  }
  return [
    { label: '出金金额', value: `${transaction.amount} ${transaction.currency_code}` },
    { label: '手续费', value: `${transaction.fee_amount || '—'} ${transaction.currency_code}` },
    { label: '合计扣款', value: `${transaction.total_amount || '—'} ${transaction.currency_code}` },
    { label: '付款方', value: transaction.payer_name || '—' },
    { label: '收款方', value: transaction.payee_name || '—' },
    ...common,
  ];
});

const timeline = computed(() => {
  const value = props.info?.detail.timeline;
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      name: String(row.name || row.event || '处理记录'),
      time: row.time ? String(row.time) : null,
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
    padding: 18px;
    border-radius: 14px;
    background: linear-gradient(135deg, #eefaf8, #f1f6ff);

    span {
      color: var(--app-text-label);
      font-size: 13px;
    }
    h3 {
      margin: 5px 0 0;
      color: var(--app-text-heading);
      font-size: 18px;
    }
  }

  &__section {
    margin-top: 22px;
  }
  &__section h4 {
    margin: 0 0 12px;
    color: var(--app-text-heading);
    font-size: 15px;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  &__grid article {
    display: grid;
    min-width: 0;
    gap: 7px;
    padding: 14px;
    border: 1px solid #e2e9f2;
    border-radius: 11px;
    background: #fafcff;
  }
  &__grid small,
  &__timeline small {
    color: var(--app-text-label);
    font-size: 12px;
  }
  &__grid strong {
    overflow-wrap: anywhere;
    color: var(--app-text-body);
    font-size: 14px;
    font-weight: 500;
  }
  &__timeline {
    display: grid;
    gap: 12px;
  }
  &__timeline article {
    display: flex;
    align-items: flex-start;
    gap: 11px;
  }
  &__timeline i {
    width: 9px;
    height: 9px;
    margin-top: 5px;
    border-radius: 50%;
    background: #12a99e;
    box-shadow: 0 0 0 5px #e5f7f4;
  }
  &__timeline div {
    display: grid;
    gap: 4px;
  }
  &__timeline strong {
    color: var(--app-text-body);
    font-size: 14px;
    font-weight: 600;
  }
}

@include mobile {
  .transaction-detail__grid {
    grid-template-columns: 1fr;
  }
}
</style>
