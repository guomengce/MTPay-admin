<template>
  <section class="admin-page fee-setting-page">
    <header class="fee-setting-page__header">
      <h1>比例與費用</h1>
      <p>維護數字貨幣兌換比例以及各代理的專屬交易設置</p>
    </header>

    <div class="fee-setting-page__grid">
      <FeeRateForm
        :usdt-rate="config?.default_exchange_rates?.USDT?.rate"
        :usdc-rate="config?.default_exchange_rates?.USDC?.rate"
        :saving="saving"
        @save="handleSaveRates"
      />
    </div>

    <AdminPanel title="代理專屬比例" subtitle="不同代理可設定不同的專屬交易比例" :icon="UserFilled">
      <div class="fee-setting-page__filters filter-bar">
        <el-input
          v-model="agentQuery.keyword"
          clearable
          placeholder="公司 / Email"
          :prefix-icon="Search"
          @keyup.enter="searchAgents"
        />
        <el-select v-model="agentQuery.status" clearable placeholder="代理狀態">
          <el-option label="待啟用" :value="0" />
          <el-option label="正常" :value="1" />
          <el-option label="暫停" :value="2" />
          <el-option label="停用" :value="3" />
        </el-select>
        <div class="filter-bar__actions">
          <el-button type="primary" :icon="Search" @click="searchAgents">查詢</el-button>
          <el-button plain :icon="RefreshLeft" @click="resetAgents">重置</el-button>
        </div>
      </div>

      <FeeAgentTable
        v-if="!isCompact"
        :rows="agentList"
        :loading="loading"
        @edit="openEdit"
        @clear="handleClear"
      />
      <FeeAgentCardList
        v-else
        :rows="agentList"
        :loading="loading"
        @edit="openEdit"
        @clear="handleClear"
      />

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
import { h, onBeforeUnmount, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { RefreshLeft, Search, UserFilled } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import { usePageLoading } from '@/composables/usePageLoading';
import { confirmAdminAction } from '@/utils/adminMessageBox';
import TablePager from '@/components/common/TablePager.vue';
import FeeAgentCardList from './components/FeeAgentCardList.vue';
import FeeAgentEditDialog from './components/FeeAgentEditDialog.vue';
import FeeAgentTable from './components/FeeAgentTable.vue';
import FeeRateForm from './components/FeeRateForm.vue';
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
  saveAgentRates,
  clearAgentRates,
} = useFeeSettings();
usePageLoading(loading);

const dialogVisible = ref(false);
const editingRow = ref<FeeAgentRow | null>(null);

// 與 styles/breakpoints.scss 的 narrow-max 保持一致：窄屏 PC 也切換為卡片佈局。
const COMPACT_QUERY = '(max-width: 1310px)';
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
    ElMessage.success('默認數字貨幣兌換比例已保存');
  } catch {
    /* 統一請求層已提示 */
  }
}

function openEdit(row: FeeAgentRow) {
  editingRow.value = row;
  dialogVisible.value = true;
}

async function handleSaveAgent(payload: { user_id: number; usdt_rate: string; usdc_rate: string }) {
  try {
    await saveAgentRates(payload);
    dialogVisible.value = false;
    ElMessage.success('代理專屬比例已保存');
  } catch {
    /* 統一請求層已提示 */
  }
}

async function handleClear(row: FeeAgentRow) {
  const confirmed = await confirmAdminAction({
    title: '恢復平台默認比例',
    message: h('span', null, [
      '確認將 ',
      h('span', { class: 'admin-message-box__variable' }, row.company_name),
      ' 的專屬比例恢復為平台默認嗎？',
    ]),
    confirmText: '確認恢復',
  });
  if (!confirmed) return;

  try {
    await clearAgentRates(row.user_id);
    ElMessage.success('已恢復平台默認比例');
  } catch {
    /* 統一請求層已提示 */
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
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;

    @include narrow {
      grid-template-columns: 1fr;
    }
  }

  @include mobile {
    gap: 16px;

    &__header {
      h1 { font-size: 20px; }
      p { font-size: 13px; line-height: 1.6; }
    }

    &__grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 14px;
    }
    &__pager { justify-content: flex-end; overflow-x: auto; padding: 4px 0; }
  }

  &__filters {
    margin: 0 0 4px;

    @media (min-width: $desktop-min) {
      grid-template-columns: minmax(260px, 1fr) 180px auto;
    }
  }

  &__pager {
    display: flex;
    justify-content: flex-end;
    padding: 6px 8px;
  }
}
</style>
