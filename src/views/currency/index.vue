<template>
  <section class="admin-page currency-page">
    <AdminHero
      title="币种管理"
      description="维护币种网络关系、启停状态及平台收款地址"
      :icon="Coin"
    />

    <AdminPanel>
      <CurrencyFilters
        v-model:keyword="keyword"
        v-model:status="status"
        @search="search"
        @reset="resetFilters"
      />

      <CurrencyTable
        :data="list"
        :loading="loading"
        @detail="openDetail"
        @set-address="openAddressDialog"
        @toggle-status="changeStatus"
      />

      <CurrencyCardList
        :data="list"
        :loading="loading"
        @detail="openDetail"
        @set-address="openAddressDialog"
        @toggle-status="changeStatus"
      />

      <TablePager
        :model-value="page"
        :page-size="limit"
        :total="total"
        @update:model-value="onPageChange"
        @update:page-size="onLimitChange"
      />
    </AdminPanel>

    <CurrencyDetailDialog
      v-model="detailVisible"
      :detail="detail"
      :loading="detailLoading"
      @set-address="openAddressDialogFromDetail"
      @toggle-status="toggleStatusFromDetail"
    />

    <ReceivingAddressDialog
      v-model="addressVisible"
      :replacing="!!addressTarget?.current_receiving_address"
      :current-address="addressTarget?.current_receiving_address?.address ?? null"
      :submitting="addressSubmitting"
      @submit="submitAddress"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Coin } from '@element-plus/icons-vue';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';

import CurrencyCardList from './components/CurrencyCardList.vue';
import CurrencyDetailDialog from './components/CurrencyDetailDialog.vue';
import CurrencyFilters from './components/CurrencyFilters.vue';
import CurrencyTable from './components/CurrencyTable.vue';
import ReceivingAddressDialog from './components/ReceivingAddressDialog.vue';
import { useCurrencyManagement } from './composables/useCurrencyManagement';
import type { CurrencyNetwork } from '@/api/modules/currency';

/**
 * 页面编排：仅负责组件绑定与业务流程串联。
 * 所有数据、接口、业务动作统一来自 useCurrencyManagement。
 */
const {
  // 列表
  list,
  loading,
  page,
  limit,
  total,
  keyword,
  status,
  search,
  resetFilters,
  onPageChange,
  onLimitChange,

  // 详情
  detailVisible,
  detailLoading,
  detail,
  openDetail,

  // 业务
  changeStatus,
  submitReceivingAddress,
} = useCurrencyManagement();

/* ======== 收款地址弹框 ===================================================== */
const addressVisible = ref(false);
const addressSubmitting = ref(false);
const addressTarget = ref<CurrencyNetwork | null>(null);

function openAddressDialog(row: CurrencyNetwork) {
  addressTarget.value = row;
  addressVisible.value = true;
}

function openAddressDialogFromDetail() {
  if (!detail.value) return;
  addressTarget.value = detail.value;
  addressVisible.value = true;
}

async function submitAddress(payload: { address: string; remark?: string }) {
  if (!addressTarget.value) return;
  addressSubmitting.value = true;
  try {
    const submitted = await submitReceivingAddress(addressTarget.value, payload);
    if (!submitted) return;
    addressVisible.value = false;
    addressTarget.value = null;
  } finally {
    addressSubmitting.value = false;
  }
}

/** 详情弹框的启用/禁用触发：基于 detail 当前值 */
async function toggleStatusFromDetail() {
  if (!detail.value) return;
  await changeStatus(detail.value);
}
</script>

<style scoped lang="scss">
.currency-page {
  gap: 22px;
}
</style>
