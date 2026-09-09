<template>
  <section class="admin-page">
    <AdminHero title="管理員管理" :icon="Lock">
      <template #extra
        ><el-button
          v-if="canOperate('admins.create')"
          type="primary"
          :icon="Plus"
          @click="openCreate"
          >新增管理員</el-button
        ></template
      >
    </AdminHero>
    <AdminPanel>
      <div class="filter-bar">
        <el-input
          v-model="keyword"
          class="filter-bar__keyword"
          placeholder="管理員名稱 / Email"
          clearable
          :prefix-icon="Search"
          @keyup.enter="search"
        />
        <el-select v-model="status" placeholder="全部狀態" clearable
          ><el-option label="啟用" :value="1" /><el-option label="停用" :value="0"
        /></el-select>
        <div class="filter-bar__actions">
          <el-button type="primary" :icon="Search" @click="search">查詢</el-button
          ><el-button :icon="RefreshLeft" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="permission-table">
        <el-table v-loading="loading" class="admin-data-table" :data="list" stripe>
          <el-table-column prop="name" label="管理員" min-width="220" />
          <el-table-column prop="email" label="Email" min-width="260" />
          <el-table-column label="角色" min-width="180"
            ><template #default="{ row }"
              ><StatusBadge :label="row.role?.name || '未分配'" type="primary" /></template
          ></el-table-column>
          <el-table-column v-if="authStore.cryptoEnabled" label="數字貨幣" width="120"
            ><template #default="{ row }"
              ><StatusBadge
                :label="row.crypto_enabled ? '已開啟' : '未開啟'"
                :type="row.crypto_enabled ? 'success' : 'gray'" /></template
          ></el-table-column>
          <el-table-column label="狀態" width="110"
            ><template #default="{ row }"
              ><StatusBadge
                :label="row.status === 1 ? '正常' : '停用'"
                :type="row.status === 1 ? 'success' : 'gray'" /></template
          ></el-table-column>
          <el-table-column label="2FA" width="110"
            ><template #default="{ row }"
              ><StatusBadge
                :label="row.two_factor_enabled ? '已開啟' : '未開啟'"
                :type="row.two_factor_enabled ? 'success' : 'warning'" /></template
          ></el-table-column>
          <el-table-column v-if="hasActions" label="操作" width="120" fixed="right" align="center">
            <template #default="{ row }">
              <el-button
                v-if="isProtectedAdmin(row) && isOwnAdmin(row)"
                plain
                size="small"
                :icon="Key"
                @click="openOwnPassword(row)"
                >修改密碼</el-button
              >
              <span v-else-if="isProtectedAdmin(row)" class="protected-admin-label">—</span>
              <el-dropdown
                v-else
                trigger="click"
                @command="(command: string) => handleTableAction(command, row)"
              >
                <el-button plain size="small" :icon="MoreFilled">操作</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="canOperate('admins.edit')" command="edit" :icon="Edit"
                      >修改</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="canOperate('admins.status')"
                      command="status"
                      :icon="SwitchButton"
                      :divided="canOperate('admins.edit')"
                      >{{ row.status === 1 ? '停用' : '啟用' }}</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="!isOwnAdmin(row) && canOperate('admins.disable2fa')"
                      command="disable-2fa"
                      :icon="Unlock"
                      :disabled="twoFactorBusy"
                      >關閉 2FA</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="authStore.cryptoEnabled && canOperate('admins.cryptoToggle')"
                      command="crypto"
                      :icon="SwitchButton"
                      >{{ row.crypto_enabled ? '關閉數字貨幣' : '開啓數字貨幣' }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="permission-cards">
        <AdminCardList :items="cardItems" @action="handleCardAction" />
      </div>
      <el-empty v-if="!loading && list.length === 0" description="暫無管理員" />
      <TablePager v-model="page" v-model:page-size="limit" :total="total" />
    </AdminPanel>
    <AdminFormDialog
      v-model="dialogVisible"
      :admin="editing"
      :password-only="passwordOnly"
      :submitting="submitting"
      @submit="submit"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Unlock,
  Edit,
  Key,
  Lock,
  MoreFilled,
  Plus,
  RefreshLeft,
  Search,
  SwitchButton,
} from '@element-plus/icons-vue';
import type { AdminAccount } from '@/api/modules/adminAccount';
import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import AdminCardList from '@/components/admin/AdminCardList.vue';
import type { AdminCardItem } from '@/components/admin/AdminCardList.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import TablePager from '@/components/common/TablePager.vue';
import AdminFormDialog from './components/AdminFormDialog.vue';
import { useAdminManagement } from './composables/useAdminManagement';
import { usePermission } from '@/composables/usePermission';
import { useAuthStore } from '@/stores/modules/auth';

const management = useAdminManagement();
const {
  list,
  loading,
  submitting,
  page,
  limit,
  total,
  keyword,
  status,
  dialogVisible,
  editing,
  passwordOnly,
  search,
  reset,
  openCreate,
  openEdit,
  openOwnPassword,
  submit,
  toggleStatus,
  toggleCrypto,
  twoFactorBusy,
  disableTwoFactor,
} = management;
const { canOperate } = usePermission();
const authStore = useAuthStore();
const hasActions = computed(
  () =>
    ['admins.edit', 'admins.status', 'admins.disable2fa'].some(canOperate) ||
    (authStore.cryptoEnabled && canOperate('admins.cryptoToggle')) ||
    list.value.some((row) => isProtectedAdmin(row) && isOwnAdmin(row)),
);
function isProtectedAdmin(row: AdminAccount) {
  return Number(row.id) === 1;
}
function isOwnAdmin(row: AdminAccount) {
  const current = authStore.userInfo;
  if (!current) return false;
  const sameId = current.id != null && String(row.id) === String(current.id);
  const sameEmail =
    Boolean(current.email && row.email) &&
    row.email.trim().toLowerCase() === current.email.trim().toLowerCase();
  return sameId || sameEmail;
}
const cardItems = computed<AdminCardItem[]>(() =>
  list.value.map((row) => ({
    key: String(row.id),
    title: row.name,
    subtitle: row.email,
    status: {
      label: row.status === 1 ? '正常' : '停用',
      type: row.status === 1 ? 'success' : 'gray',
    },
    fields: [
      { label: '角色', value: row.role?.name || '未分配' },
      ...(authStore.cryptoEnabled
        ? [
            {
              label: '數字貨幣',
              badge: {
                label: row.crypto_enabled ? '已開啟' : '未開啟',
                type: row.crypto_enabled ? ('success' as const) : ('gray' as const),
              },
            },
          ]
        : []),
      {
        label: '2FA',
        badge: {
          label: row.two_factor_enabled ? '已開啟' : '未開啟',
          type: row.two_factor_enabled ? 'success' : 'warning',
        },
      },
    ],
    actions: isProtectedAdmin(row)
      ? isOwnAdmin(row)
        ? [
            {
              key: 'account-password',
              label: '修改密碼',
              icon: Key,
              type: 'primary' as const,
              plain: true,
            },
          ]
        : []
      : [
          ...(canOperate('admins.edit')
            ? [{ key: 'edit', label: '修改', icon: Edit, type: 'primary' as const, plain: true }]
            : []),
          ...(canOperate('admins.status')
            ? [
                {
                  key: 'status',
                  label: row.status === 1 ? '停用' : '啟用',
                  type: row.status === 1 ? ('warning' as const) : ('primary' as const),
                  plain: true,
                },
              ]
            : []),
          ...(!isOwnAdmin(row) && canOperate('admins.disable2fa')
            ? [
                {
                  key: 'disable-2fa',
                  label: '關閉 2FA',
                  icon: Unlock,
                  type: 'warning' as const,
                  plain: true,
                },
              ]
            : []),
          ...(authStore.cryptoEnabled && canOperate('admins.cryptoToggle')
            ? [
                {
                  key: 'crypto',
                  label: row.crypto_enabled ? '關閉數字貨幣' : '開啓數字貨幣',
                  type: 'primary' as const,
                  plain: true,
                },
              ]
            : []),
        ],
  })),
);
function handleCardAction(action: string, key: string) {
  const row = list.value.find((item) => String(item.id) === key);
  if (!row) return;
  if (action === 'account-password' && isProtectedAdmin(row) && isOwnAdmin(row)) {
    openOwnPassword(row);
    return;
  }
  if (isProtectedAdmin(row)) return;
  if (action === 'edit') void openEdit(row);
  else if (action === 'status') void toggleStatus(row);
  else if (action === 'disable-2fa' && !isOwnAdmin(row)) void disableTwoFactor(row);
  else if (action === 'crypto') void toggleCrypto(row);
}
function handleTableAction(action: string, row: AdminAccount) {
  if (isProtectedAdmin(row)) return;
  if (action === 'edit') void openEdit(row);
  else if (action === 'status') void toggleStatus(row);
  else if (action === 'disable-2fa' && !isOwnAdmin(row)) void disableTwoFactor(row);
  else if (action === 'crypto') void toggleCrypto(row);
}
</script>

<style scoped lang="scss">
.permission-cards {
  display: none;
}
.protected-admin-label {
  color: #8293a8;
  font-size: 12px;
}
@include mobile {
  .permission-table {
    display: none;
  }
  .permission-cards {
    display: block;
  }
}
</style>
