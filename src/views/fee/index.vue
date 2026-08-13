<template>
  <section class="admin-page fee-setting-page">
    <header class="fee-setting-page__header">
      <h1>比例与费用</h1>
      <p>维护兑换比例、出金手续费以及各代理的专属交易设置</p>
    </header>

    <div class="fee-setting-page__grid">
      <FeeRateForm />
      <FeeWithdrawalForm />
    </div>

    <FeeAgentTable
      v-if="!isCompact"
      :rows="agentRows"
      @edit="openEditDialog"
    />
    <FeeAgentCardList
      v-else
      :rows="agentRows"
      @edit="openEditDialog"
    />

    <FeeAgentEditDialog
      v-model="dialogVisible"
      :row="editingRow"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';

import FeeAgentCardList, {
  type FeeAgentRow,
} from './components/FeeAgentCardList.vue';
import FeeAgentEditDialog from './components/FeeAgentEditDialog.vue';
import FeeAgentTable from './components/FeeAgentTable.vue';
import FeeRateForm from './components/FeeRateForm.vue';
import FeeWithdrawalForm from './components/FeeWithdrawalForm.vue';

const dialogVisible = ref(false);
const editingRow = ref<FeeAgentRow | null>(null);

// 小于 narrow (≤768px) 切到卡视图，否则用表格。
const COMPACT_QUERY = '(max-width: 768px)';
const isCompact = ref(false);
let mql: MediaQueryList | null = null;

function syncCompact(event: MediaQueryListEvent | MediaQueryList) {
  isCompact.value = event.matches;
}

onMounted(() => {
  if (typeof window === 'undefined' || !window.matchMedia) return;
  mql = window.matchMedia(COMPACT_QUERY);
  syncCompact(mql);
  mql.addEventListener('change', syncCompact);
});

onBeforeUnmount(() => {
  mql?.removeEventListener('change', syncCompact);
  mql = null;
});

const agentRows = ref<FeeAgentRow[]>([
  {
    agent: '代理A · Apex Trading',
    code: 'AG-A',
    usdt: '0.9900',
    usdc: '0.9900',
    min: '90.00 USD',
    max: '990.00 USD',
  },
  {
    agent: '代理B · Bluewave Capital',
    code: 'AG-B',
    usdt: '0.9000',
    usdc: '0.9000',
    min: '50.00 USD',
    max: '500.00 USD',
  },
]);

function openEditDialog(row: FeeAgentRow) {
  editingRow.value = row;
  dialogVisible.value = true;
}

function handleSubmit(payload: FeeAgentRow) {
  // 接入 API：await api.fee.updateAgent(payload)
  agentRows.value = agentRows.value.map((item) =>
    item.code === payload.code ? payload : item,
  );
  ElMessage.success(`已更新 ${payload.agent} 的专属比例`);
}
</script>

<style scoped lang="scss">
.fee-setting-page {
  gap: 24px;

  &__header {
    h1 {
      margin: 0 0 6px;
      color: #061936;
      font-size: 22px;
      font-weight: 950;
    }

    p {
      margin: 0;
      color: #66758b;
      font-size: 14px;
      font-weight: 700;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;

    @include narrow {
      grid-template-columns: 1fr;
    }
  }
}
</style>
