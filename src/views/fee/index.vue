<template>
  <section class="admin-page fee-setting-page" v-loading="loading">
    <header class="fee-setting-page__header">
      <h1>比例与费用</h1>
      <p>维护兑换比例、出金手续费以及各代理的专属交易设置</p>
    </header>

    <div class="fee-setting-page__grid">
      <FeeRateForm
        :usdt-rate="config?.default_exchange_rates?.USDT?.rate"
        :usdc-rate="config?.default_exchange_rates?.USDC?.rate"
        :saving="saving"
        @save="handleSaveRates"
      />
      <FeeWithdrawalForm
        :fee-amount="config?.usd_withdrawal_fee?.fee_amount"
        :saving="saving"
        @save="handleSaveFee"
      />
    </div>

    <AdminPanel title="代理专属比例" subtitle="不同代理可设定不同的专属交易比例">
      <div class="fee-setting-page__filters filter-bar">
        <el-input
          v-model="agentQuery.keyword"
          clearable
          placeholder="代理编号 / 公司 / Email"
          :prefix-icon="Search"
          @keyup.enter="searchAgents"
        />
        <el-select v-model="agentQuery.status" clearable placeholder="代理状态">
          <el-option label="待激活" :value="0" />
          <el-option label="正常" :value="1" />
          <el-option label="暂停" :value="2" />
          <el-option label="停用" :value="3" />
        </el-select>
        <div class="filter-bar__actions">
          <el-button type="primary" :icon="Search" @click="searchAgents">查询</el-button>
          <el-button plain :icon="RefreshLeft" @click="resetAgents">重置</el-button>
        </div>
      </div>

      <FeeAgentTable v-if="!isCompact" :rows="agentList" :loading="loading" @edit="openEdit" @clear="handleClear" />
      <FeeAgentCardList v-else :rows="agentList" :loading="loading" @edit="openEdit" @clear="handleClear" />

      <div class="fee-setting-page__pager">
        <TablePager
          :model-value="agentPage"
          :page-size="agentLimit"
          :total="agentTotal"
          @update:model-value="changePage"
          @update:page-size="changeLimit"
        />
      </div>
    </AdminPanel>

    <FeeAgentEditDialog
      v-model="dialogVisible"
      :row="editingRow"
      :saving="saving"
      @submit="handleSaveAgent"
    />
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { RefreshLeft, Search } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import FeeAgentCardList from './components/FeeAgentCardList.vue';
import FeeAgentEditDialog from './components/FeeAgentEditDialog.vue';
import FeeAgentTable from './components/FeeAgentTable.vue';
import FeeRateForm from './components/FeeRateForm.vue';
import FeeWithdrawalForm from './components/FeeWithdrawalForm.vue';
import type { FeeAgentRow } from './composables/useFeeSettings';
import { useFeeSettings } from './composables/useFeeSettings';

const {
  loading,
  saving,
  config,
  agentList,
  agentTotal,
  agentPage,
  agentLimit,
  agentQuery,
  fetchConfig,
  loadAgents,
  saveDefaultRates,
  saveFee,
  saveAgentRates,
  clearAgentRates,
} = useFeeSettings();

const dialogVisible = ref(false);
const editingRow = ref<FeeAgentRow | null>(null);

const COMPACT_QUERY = '(max-width: 768px)';
const isCompact = ref(false);
let mql: MediaQueryList | null = null;

function syncCompact(event: MediaQueryListEvent | MediaQueryList) {
  isCompact.value = event.matches;
}

onMounted(() => {
  void Promise.all([fetchConfig(), loadAgents()]);
  if (typeof window === 'undefined' || !window.matchMedia) return;
  mql = window.matchMedia(COMPACT_QUERY);
  syncCompact(mql);
  mql.addEventListener('change', syncCompact);
});

onBeforeUnmount(() => {
  mql?.removeEventListener('change', syncCompact);
  mql = null;
});

async function handleSaveRates(payload: { usdt_rate: string; usdc_rate: string }) {
  try {
    await saveDefaultRates(payload);
    ElMessage.success('默认兑换比例已保存');
  } catch {
    /* 统一请求层已提示 */
  }
}

async function handleSaveFee(payload: { fee_amount: string }) {
  try {
    await saveFee(payload.fee_amount);
    ElMessage.success('出金手续费已保存');
  } catch {
    /* 统一请求层已提示 */
  }
}

function openEdit(row: FeeAgentRow) {
  editingRow.value = row;
  dialogVisible.value = true;
}

async function handleSaveAgent(payload: { user_id: number; usdt_rate: string; usdc_rate: string }) {
  try {
    await saveAgentRates(payload);
    ElMessage.success('代理专属比例已保存');
  } catch {
    /* 统一请求层已提示 */
  }
}

async function handleClear(row: FeeAgentRow) {
  try {
    await clearAgentRates(row.user_id);
    ElMessage.success(`已清除 ${row.company_name} 的专属比例，恢复平台默认`);
  } catch {
    /* 统一请求层已提示 */
  }
}

function searchAgents() {
  agentPage.value = 1;
  void loadAgents();
}

function resetAgents() {
  agentQuery.keyword = '';
  agentQuery.status = undefined;
  agentPage.value = 1;
  void loadAgents();
}

function changePage(value: number) {
  agentPage.value = value;
  void loadAgents();
}

function changeLimit(value: number) {
  agentLimit.value = value;
  agentPage.value = 1;
  void loadAgents();
}
</script>

<style scoped lang="scss">
.fee-setting-page {
  gap: 24px;

  &__header {
    h1 {
      margin: 0 0 6px;
      color: var(--app-text-heading);
      font-size: 22px;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: var(--app-text-label);
      font-size: 14px;
      font-weight: 600;
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

  &__filters {
    margin: 0 0 4px;
  }

  &__pager {
    display: flex;
    justify-content: flex-end;
    padding: 4px 0 8px;
  }
}
</style>
