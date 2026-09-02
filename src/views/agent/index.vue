<template>
  <section class="admin-page">
    <AdminHero title="代理帳户" :icon="UserFilled">
      <template #extra>
        <el-button v-if="canOperate('agents.create')" type="primary" :icon="Plus" @click="openCreate">新增代理</el-button>
      </template>
    </AdminHero>

    <AdminPanel>
      <AgentFilters
        v-model:keyword="keyword"
        v-model:status="status"
        @search="search"
        @reset="resetFilters"
      />
      <AgentTableList
        :data="agents"
        :loading="loading"
        :mail-loading="Boolean(mailLoading)"
        :two-factor-busy="twoFactorBusy"
        @crypto="toggleCrypto"
        @disable-2fa="disableTwoFactor"
        @detail="openDetail"
        @edit="openEdit"
        @status="changeStatus"
        @send-invitation="sendInvitation"
        @send-password-reset="sendPasswordReset"
      />
      <AgentCardList :data="agents" @crypto="toggleCrypto" @disable-2fa="disableTwoFactor" @detail="openDetail" @edit="openEdit" @status="changeStatus" />
      <el-empty v-if="!loading && agents.length === 0" description="暫無代理賬户" />
      <TablePager v-model="page" v-model:page-size="limit" :total="total" />
    </AdminPanel>

    <AgentFormDialog
      v-model="formVisible"
      :agent="editingAgent"
      :submitting="submitting"
      @submit="submitForm"
    />
  </section>
</template>

<script setup lang="ts">
import { Plus, UserFilled } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { updateAgentCryptoStatus, type AgentAccount } from '@/api/modules/agent';
import { usePermission } from '@/composables/usePermission';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';

import AgentCardList from './components/AgentCardList.vue';
import AgentFilters from './components/AgentFilters.vue';
import AgentFormDialog from './components/AgentFormDialog.vue';
import AgentTableList from './components/AgentTableList.vue';
import { useAgentManagement } from './composables/useAgentManagement';

/** 頁面只負責組件編排；接口、數據狀態和業務動作全部來自 composables。 */
const {
  agents,
  twoFactorBusy,
  disableTwoFactor,
  loading,
  page,
  limit,
  total,
  keyword,
  status,
  formVisible,
  submitting,
  editingAgent,
  search,
  resetFilters,
  openCreate,
  openEdit,
  submitForm,
  openDetail,
  changeStatus,
  mailLoading,
  sendInvitation,
  sendPasswordReset,
  loadAgents,
} = useAgentManagement();
const { canOperate } = usePermission();

async function toggleCrypto(row: AgentAccount) {
  await ElMessageBox.confirm(
    row.crypto_enabled ? '關閉後該代理將無法查看或使用數字貨幣業務，歷史數據不會刪除。' : '確認開啓該代理的數字貨幣業務？',
    '數字貨幣業務',
    { type: 'warning', confirmButtonText: '確認', cancelButtonText: '取消' },
  );
  await updateAgentCryptoStatus(row.id, row.crypto_enabled ? 0 : 1);
  ElMessage.success('設置已更新');
  await loadAgents();
}
</script>
