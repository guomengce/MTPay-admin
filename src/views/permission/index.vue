<template>
  <section class="admin-page">
    <AdminHero title="權限管理" :icon="Lock">
      <template #extra><el-button type="primary" :icon="Plus" @click="openCreate">新增管理員</el-button></template>
    </AdminHero>
    <AdminPanel>
      <div class="filter-bar">
        <el-input v-model="keyword" class="filter-bar__keyword" placeholder="管理員名稱 / Email" clearable :prefix-icon="Search" @keyup.enter="search" />
        <el-select v-model="status" placeholder="全部狀態" clearable><el-option label="啟用" :value="1" /><el-option label="停用" :value="0" /></el-select>
        <div class="filter-bar__actions"><el-button type="primary" :icon="Search" @click="search">查詢</el-button><el-button :icon="RefreshLeft" @click="reset">重置</el-button></div>
      </div>
      <div class="permission-table">
        <el-table v-loading="loading" class="admin-data-table" :data="list" stripe>
          <el-table-column prop="name" label="管理員" min-width="220" />
          <el-table-column prop="email" label="Email" min-width="260" />
          <el-table-column label="權限" min-width="160"><template #default><StatusBadge label="管理端完整權限" type="primary" /></template></el-table-column>
          <el-table-column label="狀態" width="120"><template #default="{ row }"><StatusBadge :label="row.status === 1 ? '啟用' : '停用'" :type="row.status === 1 ? 'success' : 'gray'" /></template></el-table-column>
          <el-table-column label="操作" width="120" fixed="right" align="center">
            <template #default="{ row }">
              <el-dropdown trigger="click" @command="(command: string) => handleTableAction(command, row)">
                <el-button plain size="small" :icon="MoreFilled">操作</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="edit" :icon="Edit">修改</el-dropdown-item>
                    <el-dropdown-item command="status" :icon="SwitchButton" divided>{{ row.status === 1 ? '停用' : '啟用' }}</el-dropdown-item>
                    <el-dropdown-item v-if="row.id !== 1" command="disable-2fa" :icon="Unlock" :disabled="twoFactorBusy" divided>關閉 2FA</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="permission-cards"><AdminCardList :items="cardItems" @action="handleCardAction" /></div>
      <el-empty v-if="!loading && list.length === 0" description="暫無管理員" />
      <TablePager v-model="page" v-model:page-size="limit" :total="total" />
    </AdminPanel>
    <AdminFormDialog v-model="dialogVisible" :admin="editing" :submitting="submitting" @submit="submit" />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Unlock, Edit, Lock, MoreFilled, Plus, RefreshLeft, Search, SwitchButton } from '@element-plus/icons-vue';
import type { AdminAccount } from '@/api/modules/adminAccount';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import TablePager from '@/components/common/TablePager.vue';
import AdminFormDialog from './components/AdminFormDialog.vue';
import { useAdminManagement } from './composables/useAdminManagement';

const management = useAdminManagement();
const { list, loading, submitting, page, limit, total, keyword, status, dialogVisible, editing, search, reset, openCreate, openEdit, submit, toggleStatus, twoFactorBusy, disableTwoFactor } = management;
const cardItems = computed<AdminCardItem[]>(() => list.value.map((row) => ({ key: String(row.id), title: row.name, subtitle: row.email, status: { label: row.status === 1 ? '啟用' : '停用', type: row.status === 1 ? 'success' : 'gray' }, fields: [{ label: '權限', value: '管理端完整權限' }, { label: 'Email', value: row.email }], actions: [{ key: 'edit', label: '修改', icon: Edit, type: 'primary', plain: true }, { key: 'status', label: row.status === 1 ? '停用' : '啟用', type: row.status === 1 ? 'warning' : 'primary', plain: true }, ...(row.id === 1 ? [] : [{ key: 'disable-2fa', label: '關閉 2FA', icon: Unlock, type: 'warning' as const, plain: true }])] })));
function handleCardAction(action: string, key: string) { const row = list.value.find((item) => String(item.id) === key); if (!row) return; if (action === 'edit') void openEdit(row); else if (action === 'status') void toggleStatus(row); else if (action === 'disable-2fa' && row.id !== 1) void disableTwoFactor(row); }
function handleTableAction(action: string, row: AdminAccount) { if (action === 'edit') void openEdit(row); else if (action === 'status') void toggleStatus(row); else if (action === 'disable-2fa' && row.id !== 1) void disableTwoFactor(row); }
</script>

<style scoped lang="scss">
.permission-cards { display: none; }
@include mobile { .permission-table { display: none; } .permission-cards { display: block; } }
</style>
