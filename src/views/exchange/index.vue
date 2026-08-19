<template>
  <section class="admin-page">
    <AdminHero title="兑换审核" description="核对冻结资金和汇率快照后完成审核" :icon="Switch" />

    <AdminPanel>
      <ExchangeTableList
        :data="list"
        :loading="loading"
        @view="openDetail"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
      />
      <ExchangeCardList
        :data="list"
        @view="openDetail"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
      />
      <TablePager v-model="page" v-model:page-size="limit" :total="total" />
    </AdminPanel>

    <ExchangeAddDialog
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
import { Switch } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

import { reviewExchange } from '@/api/modules/exchange';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';

import ExchangeAddDialog from './components/ExchangeAddDialog.vue';
import ExchangeCardList from './components/ExchangeCardList.vue';
import ExchangeTableList from './components/ExchangeTableList.vue';
import type { ExchangeRow } from './composables/mapper';
import { useExchangeList } from './composables/useExchangeList';

const router = useRouter();
const { list, loading, total, page, limit, loadList } = useExchangeList();
const dialogVisible = ref(false);
const dialogMode = ref<'approve' | 'reject'>('approve');
const activeRow = ref<ExchangeRow | null>(null);
const reviewing = ref(false);

function openDetail(row: ExchangeRow) {
  void router.push({ name: 'ExchangeDetail', params: { id: row.businessId } });
}

function openDialog(mode: 'approve' | 'reject', row: ExchangeRow) {
  dialogMode.value = mode;
  activeRow.value = row;
  dialogVisible.value = true;
}

async function handleSubmit(payload: {
  row: ExchangeRow;
  mode: 'approve' | 'reject';
  reason?: string;
}) {
  reviewing.value = true;
  try {
    await reviewExchange({
      id: payload.row.businessId,
      decision: payload.mode,
      review_note: payload.mode === 'reject' ? payload.reason?.trim() : undefined,
    });
    ElMessage.success(payload.mode === 'approve' ? '兑换审核已通过' : '兑换申请已驳回');
    dialogVisible.value = false;
    activeRow.value = null;
    await loadList();
  } finally {
    reviewing.value = false;
  }
}
</script>

<style scoped lang="scss"></style>
