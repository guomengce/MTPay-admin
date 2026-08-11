<template>
  <section class="admin-page">
    <AdminHero title="代理帐户" description="直接新增管理代理帐户" :icon="UserFilled">
      <template #extra>
        <el-button type="primary" size="large" :icon="Plus" @click="openCreate">新增代理</el-button>
      </template>
    </AdminHero>

    <AdminPanel>
      <AgentTableList :data="pagedAgents" @edit="openEdit" />
      <AgentCardList :data="pagedAgents" @edit="openEdit" />
      <TablePager v-model="page" v-model:page-size="size" :total="total" />
    </AdminPanel>

    <AgentFormDialog
      v-model="dialogVisible"
      :agent="editingAgent"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, UserFilled } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import { useTablePager } from '@/hooks/useTablePager';

import AgentCardList from './components/AgentCardList.vue';
import AgentFormDialog from './components/AgentFormDialog.vue';
import type { AgentFormModel } from './components/AgentFormDialog.vue';
import AgentTableList from './components/AgentTableList.vue';
import type { AgentRow } from './components/AgentTableList.vue';

const agents: AgentRow[] = [
  {
    avatar: 'A',
    name: '代理A · Apex Trading',
    code: 'AG-A',
    email: 'finance@apex.test',
    phone: '+65 6123 8801',
    usdt: '0.9900',
    usdc: '0.9900',
    balance: '184,350.00 USD',
  },
  {
    avatar: 'B',
    name: '代理B · Bluewave Capital',
    code: 'AG-B',
    email: 'ops@bluewave.test',
    phone: '+852 3123 9910',
    usdt: '0.9900',
    usdc: '0.9000',
    balance: '75,920.00 USD',
  },
];

const { page, size, total, pagedData: pagedAgents } = useTablePager(agents);

const dialogVisible = ref(false);
const editingAgent = ref<Partial<AgentFormModel> | null>(null);

function openCreate() {
  editingAgent.value = null;
  dialogVisible.value = true;
}

function openEdit(row: AgentRow) {
  editingAgent.value = {
    name: row.name,
    code: row.code,
    email: row.email,
    phone: row.phone,
    usdt: row.usdt,
    usdc: row.usdc,
  };
  dialogVisible.value = true;
}

function handleSubmit(form: AgentFormModel) {
  // 接入 API：await api.agents.upsert(form)
  console.log('submit agent', form);
  dialogVisible.value = false;
}
</script>

<style scoped lang="scss">
/* 响应式切换由 AgentTableList / AgentCardList 各自处理 */
</style>