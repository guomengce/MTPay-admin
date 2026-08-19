<template>
  <AdminPanel
    title="业务能力"
    subtitle="当前代理可使用的通道和费用配置"
    :icon="Setting"
  >
    <div class="capability-list">
      <article>
        <small>入金通道</small
        ><strong>{{ capabilities.deposit_channel_count }} 个</strong>
      </article>
      <article>
        <small>兑换方向</small><strong>{{ exchangeDirection }}</strong>
      </article>
      <article>
        <small>出金币种</small
        ><strong>{{ capabilities.withdrawal_currency }}</strong>
      </article>
      <article>
        <small>出金手续费</small
        ><strong
          >{{ capabilities.withdrawal_fee_amount }}
          {{ capabilities.withdrawal_currency }}</strong
        >
      </article>
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Setting } from '@element-plus/icons-vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';

interface AgentCapabilities {
  deposit_channel_count: number;
  exchange_source_currencies: string[];
  exchange_target_currency: string;
  withdrawal_currency: string;
  withdrawal_fee_amount: string;
}

const props = defineProps<{
  capabilities: AgentCapabilities;
}>();

const exchangeDirection = computed(() => {
  const { exchange_source_currencies, exchange_target_currency } = props.capabilities;
  const source = exchange_source_currencies?.join(' / ') || '—';
  const target = exchange_target_currency || '—';
  return `${source} → ${target}`;
});
</script>

<style scoped lang="scss">
.capability-list {
  display: grid;
  gap: 10px;
  padding: 20px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.capability-list article {
  display: grid;
  gap: 6px;
  padding: 14px;
  border-radius: 12px;
  background: #f6f9fc;
}
.capability-list small {
  color: var(--app-text-label);
  font-size: 12px;
}
.capability-list strong {
  overflow-wrap: anywhere;
  color: var(--app-text-body);
  font-size: 14px;
  font-weight: 600;
}

@include mobile {
  .capability-list {
    grid-template-columns: 1fr;
    padding: 16px;
  }
}
</style>
