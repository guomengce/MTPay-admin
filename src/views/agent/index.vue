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
import { h } from 'vue';
import { Plus, UserFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { updateAgentCryptoStatus, type AgentAccount } from '@/api/modules/agent';
import { usePermission } from '@/composables/usePermission';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import { confirmAdminAction } from '@/utils/adminMessageBox';

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
  const isDisabling = row.crypto_enabled;
  const confirmed = await confirmAdminAction({
    title: isDisabling ? '關閉數字貨幣業務' : '開啓數字貨幣業務',
    message: h('span', [
      `確認${isDisabling ? '關閉' : '開啓'}「`,
      h('strong', { class: 'admin-message-box__variable' }, row.company_name),
      '」的數字貨幣業務嗎？',
    ]),
    confirmText: isDisabling ? '確認關閉' : '確認開啓',
  });
  if (!confirmed) return;
  await updateAgentCryptoStatus(row.id, isDisabling ? 0 : 1);
  ElMessage.success('設置已更新');
  await loadAgents();
}
</script>
