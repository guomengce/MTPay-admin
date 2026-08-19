<template>
  <section class="admin-page">
    <AdminHero
      title="USD 出金管理"
      description="审核代理出金申请，并跟踪付款执行、失败释放和付款凭证"
      :icon="Wallet"
    />

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
      />
      <WithdrawalCardList
        :data="list"
        @view="openDetail"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
        @supplement="openDialog('supplement', $event)"
        @payment="openPayment"
        @append="openDialog('append', $event)"
      />
      <el-empty v-if="!loading && list.length === 0" description="暂无出金订单" />
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
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
/** 管理端出金列表：真实筛选、后端分页，并按状态在行内完成审核、付款与补件处理。 */
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Wallet } from '@element-plus/icons-vue';

import type { WithdrawalPaymentResult } from '@/api/modules/withdrawal';
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
import { useWithdrawalList } from './composables/useWithdrawalList';

const router = useRouter();
const { loading, list, total, page, limit, query, loadList, search, reset, setPage, setLimit } =
  useWithdrawalList();

function openDetail(row: WithdrawalRow) {
  void router.push({ name: 'WithdrawalDetail', params: { id: row.businessId } });
}

const dialogVisible = ref(false);
const actionMode = ref<WithdrawalActionMode>('approve');
const actionRow = ref<WithdrawalRow | null>(null);
const initialResult = ref<WithdrawalPaymentResult | undefined>(undefined);
const { submitting, uploading, requestSupplement, submitReview, submitPayment, appendPaymentFiles, uploadFiles } =
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
  files: File[];
}) {
  const row = actionRow.value;
  if (!row) return;
  const id = row.businessId;
  try {
    if (payload.mode === 'supplement') {
      await requestSupplement({ id, message: payload.message! });
      ElMessage.success('补件要求已发送');
    } else if (payload.mode === 'approve' || payload.mode === 'reject') {
      await submitReview({
        id,
        decision: payload.mode,
        review_note: payload.mode === 'reject' ? payload.message : undefined,
      });
      ElMessage.success(payload.mode === 'approve' ? '出金审核已通过，进入付款处理' : '出金已驳回，冻结资金已释放');
    } else if (payload.mode === 'payment') {
      const fileIds = payload.result === 'complete' ? await uploadFiles(payload.files) : [];
      await submitPayment({
        id,
        result: payload.result!,
        file_ids: fileIds.length ? fileIds : undefined,
        failure_reason: payload.result === 'fail' ? payload.failureReason : undefined,
      });
      ElMessage.success(payload.result === 'complete' ? '付款完成已登记' : '付款失败已登记，冻结资金已释放');
    } else {
      const fileIds = await uploadFiles(payload.files);
      await appendPaymentFiles({ id, file_ids: fileIds, message: payload.message });
      ElMessage.success('付款凭证已追加');
    }
    dialogVisible.value = false;
    await loadList();
  } catch {
    /* 统一请求层已显示后端错误 */
  }
}

onMounted(loadList);
</script>

<style scoped lang="scss"></style>
