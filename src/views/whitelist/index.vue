<template>
  <section class="admin-page">
    <AdminHero
      title="白名单审核"
      description="核对代理提交的主体资料，处理审核、驳回与补件要求"
      :icon="Checked"
    />

    <AdminPanel>
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
import { Checked } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';

import WhitelistAddDialog from './components/WhitelistAddDialog.vue';
import type { WhitelistActionMode } from './components/WhitelistAddDialog.vue';
import WhitelistCardList from './components/WhitelistCardList.vue';
import WhitelistTableList from './components/WhitelistTableList.vue';
import type { WhitelistRow } from './composables/mapper';
import { useWhitelistDetail } from './composables/useWhitelistDetail';
import { useWhitelistList } from './composables/useWhitelistList';

const router = useRouter();
const { loading, list, total, page, limit, loadList, setPage, setLimit } = useWhitelistList();
const { submitting, submitReview, requestSupplement } = useWhitelistDetail();

const dialogVisible = ref(false);
const dialogMode = ref<WhitelistActionMode>('approve');
const activeRow = ref<WhitelistRow | null>(null);

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
