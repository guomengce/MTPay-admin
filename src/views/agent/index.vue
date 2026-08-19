<template>
  <section class="admin-page">
    <AdminHero title="代理帐户" description="新增、查看和管理代理帐户" :icon="UserFilled">
      <template #extra>
        <el-button type="primary" :icon="Plus" @click="openCreate">新增代理</el-button>
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
        @detail="openDetail"
        @edit="openEdit"
        @status="changeStatus"
      />
      <AgentCardList :data="agents" @detail="openDetail" @edit="openEdit" @status="changeStatus" />
      <el-empty v-if="!loading && agents.length === 0" description="暂无代理账户" />
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
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';

import AgentCardList from './components/AgentCardList.vue';
import AgentFilters from './components/AgentFilters.vue';
import AgentFormDialog from './components/AgentFormDialog.vue';
import AgentTableList from './components/AgentTableList.vue';
import { useAgentManagement } from './composables/useAgentManagement';

/** 页面只负责组件编排；接口、数据状态和业务动作全部来自 composables。 */
const {
  agents,
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
} = useAgentManagement();
</script>
