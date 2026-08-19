<template>
  <section class="admin-page">
    <AdminHero title="入金审核" description="核对链上入金并处理代理余额" :icon="Checked" />

    <AdminPanel>
      <DepositTableList
        :data="list"
        :loading="loading"
        @view="openDetail"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
      />
      <DepositCardList
        :data="list"
        @view="openDetail"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
      />
      <TablePager v-model="page" v-model:page-size="limit" :total="total" />
    </AdminPanel>

    <DepositAddDialog
      v-model="dialogVisible"
      :row="activeRow"
      :mode="dialogMode"
      :submitting="reviewing"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Checked } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

import { reviewDeposit } from '@/api/modules/deposit';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';

import DepositAddDialog from './components/DepositAddDialog.vue';
import DepositCardList from './components/DepositCardList.vue';
import DepositTableList from './components/DepositTableList.vue';
import type { DepositRow } from './composables/mapper';
import { useDepositList } from './composables/useDepositList';

const router = useRouter();
const { list, loading, total, page, limit, loadList } = useDepositList();
const dialogVisible = ref(false);
const dialogMode = ref<'approve' | 'reject'>('approve');
const activeRow = ref<DepositRow | null>(null);
const reviewing = ref(false);

function openDetail(row: DepositRow) {
  void router.push({ name: 'DepositDetail', params: { id: row.businessId } });
}

function openDialog(mode: 'approve' | 'reject', row: DepositRow) {
  dialogMode.value = mode;
  activeRow.value = row;
  dialogVisible.value = true;
}

async function handleSubmit(payload: {
  row: DepositRow;
  mode: 'approve' | 'reject';
  reason?: string;
}) {
  reviewing.value = true;
  try {
    await reviewDeposit({
      id: payload.row.businessId,
      decision: payload.mode,
      review_note: payload.mode === 'reject' ? payload.reason?.trim() : undefined,
    });
    ElMessage.success(payload.mode === 'approve' ? '入金审核已通过' : '入金申请已驳回');
    dialogVisible.value = false;
    activeRow.value = null;
    await loadList();
  } finally {
    reviewing.value = false;
  }
}
</script>

<style scoped lang="scss"></style>
