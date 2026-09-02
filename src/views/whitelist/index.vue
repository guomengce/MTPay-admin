<template>
  <section class="admin-page">
    <AdminHero
      title="白名單審核"
      :icon="Checked"
    >
      <template #extra>
        <el-button type="primary" plain :icon="Download" :loading="exporting" :disabled="loading || !exportFilters" @click="exportWhitelist">
          匯出 CSV
        </el-button>
      </template>
    </AdminHero>

    <AdminPanel>
      <WhitelistFilters
        :query="query"
        :loading="loading"
        @update="Object.assign(query, $event)"
        @search="search"
        @reset="reset"
      />
      <WhitelistTableList
        :data="list"
        :loading="loading"
        @view="openDetail"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
        @supplement="openDialog('supplement', $event)"
      />
      <WhitelistCardList
        :data="list"
        @view="openDetail"
        @approve="openDialog('approve', $event)"
        @reject="openDialog('reject', $event)"
        @supplement="openDialog('supplement', $event)"
      />
      <TablePager
        :model-value="page"
        :page-size="limit"
        :total="total"
        @update:model-value="setPage"
        @update:page-size="setLimit"
      />
    </AdminPanel>

    <WhitelistAddDialog
      v-model="dialogVisible"
      :row="activeRow"
      :mode="dialogMode"
      :submitting="submitting"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
/** 管理端白名單列表：真實分頁、狀態操作與詳情路由入口。 */
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Checked, Download } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import { useBusinessCsvExport } from '@/composables/useBusinessCsvExport';

import WhitelistAddDialog from './components/WhitelistAddDialog.vue';
import type { WhitelistActionMode } from './components/WhitelistAddDialog.vue';
import WhitelistCardList from './components/WhitelistCardList.vue';
import WhitelistFilters from './components/WhitelistFilters.vue';
import WhitelistTableList from './components/WhitelistTableList.vue';
import type { WhitelistRow } from './composables/mapper';
import { useWhitelistDetail } from './composables/useWhitelistDetail';
import { useWhitelistList } from './composables/useWhitelistList';

const router = useRouter();
const { exportFilters, loading, list, total, page, limit, query, loadList, search, reset, setPage, setLimit } =
  useWhitelistList();
const { submitting, submitReview, requestSupplement } = useWhitelistDetail();
const { exporting, downloadCsv } = useBusinessCsvExport('whitelist', () => exportFilters.value);

const dialogVisible = ref(false);
const dialogMode = ref<WhitelistActionMode>('approve');
const activeRow = ref<WhitelistRow | null>(null);

function exportWhitelist() { void downloadCsv(); }

function openDetail(row: WhitelistRow) {
  void router.push({ name: 'WhitelistDetail', params: { id: row.businessId } });
}

function openDialog(mode: WhitelistActionMode, row: WhitelistRow) {
  dialogMode.value = mode;
  activeRow.value = row;
  dialogVisible.value = true;
}

async function handleSubmit(payload: {
  row: WhitelistRow;
  mode: WhitelistActionMode;
  message?: string;
}) {
  try {
    if (payload.mode === 'supplement') {
      await requestSupplement({ id: payload.row.businessId, message: payload.message! });
      ElMessage.success('補件要求已發送');
    } else {
      await submitReview({
        id: payload.row.businessId,
        decision: payload.mode,
        review_note: payload.mode === 'reject' ? payload.message : undefined,
      });
      ElMessage.success(payload.mode === 'approve' ? '白名單審核已通過' : '白名單已駁回');
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
