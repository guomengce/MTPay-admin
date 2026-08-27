<template>
  <section class="admin-page">
    <AdminHero
      title="白名单审核"
      :icon="Checked"
    >
      <template #extra>
        <el-button type="primary" plain :icon="Download" :loading="exporting" @click="exportWhitelist">
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
/** 管理端白名单列表：真实分页、状态操作与详情路由入口。 */
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Checked, Download } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

import { fetchWhitelistList } from '@/api/modules/whitelist';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import { useCsvExport } from '@/composables/useCsvExport';

import WhitelistAddDialog from './components/WhitelistAddDialog.vue';
import type { WhitelistActionMode } from './components/WhitelistAddDialog.vue';
import WhitelistCardList from './components/WhitelistCardList.vue';
import WhitelistFilters from './components/WhitelistFilters.vue';
import WhitelistTableList from './components/WhitelistTableList.vue';
import { toWhitelistRow } from './composables/mapper';
import type { WhitelistRow } from './composables/mapper';
import { useWhitelistDetail } from './composables/useWhitelistDetail';
import { useWhitelistList } from './composables/useWhitelistList';

const router = useRouter();
const { loading, list, total, page, limit, query, loadList, search, reset, setPage, setLimit } =
  useWhitelistList();
const { submitting, submitReview, requestSupplement } = useWhitelistDetail();
const { exporting, exportPagedCsv } = useCsvExport();

const dialogVisible = ref(false);
const dialogMode = ref<WhitelistActionMode>('approve');
const activeRow = ref<WhitelistRow | null>(null);

function exportWhitelist() {
  void exportPagedCsv<WhitelistRow>({
    filename: '白名單審核記錄',
    columns: [
      { label: '白名單編號', value: 'id' },
      { label: '提交時間', value: 'time' },
      { label: '更新時間', value: 'updatedAt' },
      { label: '代理公司', value: 'agent' },
      { label: '代理編號', value: 'agentCode' },
      { label: '白名單角色', value: 'role' },
      { label: '主體類型', value: 'entityType' },
      { label: '主體名稱', value: 'subject' },
      { label: '國家 / 地區', value: 'country' },
      { label: '附件數量', value: 'fileCount' },
      { label: '狀態', value: 'status' },
    ],
    fetchPage: async (page, limit) => {
      const result = await fetchWhitelistList({
        page,
        limit,
        keyword: query.keyword.trim() || undefined,
        role: query.role,
        entity_type: query.entity_type,
      });
      return { ...result, data: result.data.map(toWhitelistRow) };
    },
  });
}

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
      ElMessage.success('补件要求已发送');
    } else {
      await submitReview({
        id: payload.row.businessId,
        decision: payload.mode,
        review_note: payload.mode === 'reject' ? payload.message : undefined,
      });
      ElMessage.success(payload.mode === 'approve' ? '白名单审核已通过' : '白名单已驳回');
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
