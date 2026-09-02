<template>
  <section class="admin-page">
    <AdminHero
      title="法幣出金管理"
      :icon="Wallet"
    >
      <template #extra>
        <el-button type="primary" plain :icon="Download" :loading="exporting" :disabled="loading || !exportFilters" @click="exportOrders">匯出 CSV</el-button>
      </template>
    </AdminHero>

    <AdminPanel>
      <WithdrawalFilters
        :query="query"
        :loading="loading"
        @update="Object.assign(query, $event)"
        @search="search"
        @reset="reset"
      />
      <WithdrawalTableList
        :data="list"
        :loading="loading"
        @view="openDetail"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
        @supplement="openDialog('supplement', $event)"
        @payment="openPayment"
        @append="openDialog('append', $event)"
        @cancel-completed="cancelCompleted"
      />
      <WithdrawalCardList
        :data="list"
        @view="openDetail"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
        @supplement="openDialog('supplement', $event)"
        @payment="openPayment"
        @append="openDialog('append', $event)"
        @cancel-completed="cancelCompleted"
      />
      <el-empty v-if="!loading && list.length === 0" description="暫無法幣出金訂單" />
      <TablePager
        :model-value="page"
        :page-size="limit"
        :total="total"
        @update:model-value="setPage"
        @update:page-size="setLimit"
      />
    </AdminPanel>

    <WithdrawalActionDialog
      v-model="dialogVisible"
      :row="actionRow"
      :mode="actionMode"
      :submitting="submitting"
      :uploading="uploading"
      :initial-result="initialResult"
      :upload-file="uploadFile"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
/** 管理端法幣出金列表：真實篩選、後端分頁，並按狀態在行內完成審核、付款與補件處理。 */
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Download, Wallet } from '@element-plus/icons-vue';

import { type WithdrawalPaymentResult } from '@/api/modules/withdrawal';
import { useBusinessCsvExport } from '@/composables/useBusinessCsvExport';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';

import WithdrawalCardList from './components/WithdrawalCardList.vue';
import WithdrawalActionDialog from './components/WithdrawalActionDialog.vue';
import type { WithdrawalActionMode } from './components/WithdrawalActionDialog.vue';
import WithdrawalFilters from './components/WithdrawalFilters.vue';
import WithdrawalTableList from './components/WithdrawalTableList.vue';
import type { WithdrawalRow } from './composables/mapper';
import { useWithdrawalDetail } from './composables/useWithdrawalDetail';
import { useCancelCompletedWithdrawal } from './composables/useCancelCompletedWithdrawal';
import { useWithdrawalList } from './composables/useWithdrawalList';

const router = useRouter();
const { cancelCompleted } = useCancelCompletedWithdrawal(() => loadList());
const { exportFilters, loading, list, total, page, limit, query, loadList, search, reset, setPage, setLimit } =
  useWithdrawalList();
const { exporting, downloadCsv } = useBusinessCsvExport('withdrawal', () => exportFilters.value);

function exportOrders() { void downloadCsv(); }

function openDetail(row: WithdrawalRow) {
  void router.push({ name: 'WithdrawalDetail', params: { id: row.businessId } });
}

const dialogVisible = ref(false);
const actionMode = ref<WithdrawalActionMode>('approve');
const actionRow = ref<WithdrawalRow | null>(null);
const initialResult = ref<WithdrawalPaymentResult | undefined>(undefined);
const { submitting, uploading, requestSupplement, submitReview, submitPayment, appendPaymentFiles, uploadFile } =
  useWithdrawalDetail();

function openDialog(mode: WithdrawalActionMode, row: WithdrawalRow) {
  actionMode.value = mode;
  actionRow.value = row;
  initialResult.value = undefined;
  dialogVisible.value = true;
}

function openPayment(payload: { row: WithdrawalRow; result: WithdrawalPaymentResult }) {
  actionMode.value = 'payment';
  actionRow.value = payload.row;
  initialResult.value = payload.result;
  dialogVisible.value = true;
}

async function handleSubmit(payload: {
  mode: WithdrawalActionMode;
  message?: string;
  result?: WithdrawalPaymentResult;
  failureReason?: string;
  fileIds: number[];
}) {
  const row = actionRow.value;
  if (!row) return;
  const id = row.businessId;
  try {
    if (payload.mode === 'supplement') {
      await requestSupplement({ id, message: payload.message! });
      ElMessage.success('補件要求已發送');
    } else if (payload.mode === 'approve' || payload.mode === 'reject') {
      await submitReview({
        id,
        decision: payload.mode,
        review_note: payload.mode === 'reject' ? payload.message : undefined,
      });
      ElMessage.success(payload.mode === 'approve' ? '法幣出金審核已通過，進入付款處理' : '法幣出金已駁回，凍結資金已釋放');
    } else if (payload.mode === 'payment') {
      const fileIds = payload.result === 'complete' ? payload.fileIds : [];
      await submitPayment({
        id,
        result: payload.result!,
        file_ids: fileIds.length ? fileIds : undefined,
        failure_reason: payload.result === 'fail' ? payload.failureReason : undefined,
      });
      ElMessage.success(payload.result === 'complete' ? '付款完成已登記' : '付款失敗已登記，凍結資金已釋放');
    } else {
      await appendPaymentFiles({ id, file_ids: payload.fileIds, message: payload.message });
      ElMessage.success('付款憑證已追加');
    }
    dialogVisible.value = false;
    await loadList();
  } catch {
    /* 統一請求層已顯示後端錯誤 */
  }
}

onMounted(loadList);
</script>

<style scoped lang="scss"></style>
