<template>
  <div class="agent-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="代理" min-width="240">
        <template #default="{ row }">
          <div class="agent-cell">
            <AgentAvatar :name="row.company_name" />
            <div class="row-title"><strong>{{ row.company_name }}</strong><small>{{ row.email }}</small></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="手機號" prop="phone" min-width="240">
      </el-table-column>
      <el-table-column v-if="authStore.cryptoEnabled" label="數字貨幣" width="120">
        <template #default="{ row }"><StatusBadge :label="row.crypto_enabled ? '已開啟' : '未開啟'" :type="row.crypto_enabled ? 'success' : 'gray'" /></template>
      </el-table-column>
      <el-table-column label="2FA" width="110">
        <template #default="{ row }"><StatusBadge :label="row.two_factor_enabled ? '已開啟' : '未開啟'" :type="row.two_factor_enabled ? 'success' : 'warning'" /></template>
      </el-table-column>
      <el-table-column label="狀態" width="120">
        <template #default="{ row }"><StatusBadge :label="row.status_name" :effect="row.status == 0 ? 'pending' : undefined" :type="statusType(row.status)" /></template>
      </el-table-column>
      <el-table-column prop="created_at" label="創建時間" min-width="160" />
      <el-table-column label="操作" width="120" fixed="right" align="center">
        <template #default="{ row }">
          <el-dropdown trigger="click" @command="(command: AgentCommand) => handleCommand(row, command)">
            <el-button plain  :icon="MoreFilled" size="small">
              操作
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="detail" :icon="View">詳情</el-dropdown-item>
                <el-dropdown-item v-if="canOperate('agents.edit')" command="edit" :icon="Edit">修改</el-dropdown-item>
                <el-dropdown-item
                  v-if="row.status === 0 && canOperate('agents.resendInvite')"
                  command="invitation"
                  :icon="Promotion"
                  :disabled="mailLoading"
                  divided
                >發送激活郵件</el-dropdown-item>
                <el-dropdown-item
                  v-if="(row.status === 1 || row.status === 2) && canOperate('agents.resetPassword')"
                  command="password-reset"
                  :icon="Key"
                  :disabled="mailLoading"
                  divided
                >重置密碼</el-dropdown-item>
                 <el-dropdown-item v-if="authStore.cryptoEnabled && canOperate('agents.cryptoToggle')" command="crypto" :icon="SwitchButton">{{ row.crypto_enabled ? '關閉數字貨幣' : '開啓數字貨幣' }}</el-dropdown-item>
                 <el-dropdown-item v-if="canOperate('agents.disable2fa')" command="disable-2fa" :icon="Unlock" :disabled="twoFactorBusy">關閉 2FA</el-dropdown-item>
                <el-dropdown-item
                  v-for="(option, index) in statusOptions(row.status)"
                  v-if="canOperate('agents.status')"
                  :key="option.value"
                  :command="`status-${option.value}`"
                  :icon="Setting"
                  :divided="index === 0"
                >
                  {{ option.label }}
                </el-dropdown-item>
               
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { Unlock, ArrowDown, Edit, Key, Promotion, Setting, View,MoreFilled,SwitchButton } from '@element-plus/icons-vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import type { AgentAccount } from '@/api/modules/agent';
import { usePermission } from '@/composables/usePermission';
import AgentAvatar from './AgentAvatar.vue';
import { useAuthStore } from '@/stores/modules/auth';

export type AgentStatus = 1 | 2;
type AgentCommand = 'crypto' | 'disable-2fa' | 'detail' | 'edit' | 'invitation' | 'password-reset' | `status-${AgentStatus}`;

const props = defineProps<{ data: AgentAccount[]; loading: boolean; mailLoading?: boolean; twoFactorBusy?: boolean }>();
const { canOperate } = usePermission();
const authStore = useAuthStore();
const emit = defineEmits<{
  (event: 'disable-2fa', row: AgentAccount): void;
  (event: 'crypto', row: AgentAccount): void;
  (event: 'detail', row: AgentAccount): void;
  (event: 'edit', row: AgentAccount): void;
  (event: 'status', row: AgentAccount, status: AgentStatus): void;
  (event: 'send-invitation', row: AgentAccount): void;
  (event: 'send-password-reset', row: AgentAccount): void;
}>();

function statusType(status: AgentAccount['status']): StatusBadgeType {
  return ({ 0: 'warning', 1: 'success', 2: 'gray', 3: 'danger' } as const)[status];
}

function statusOptions(status: AgentAccount['status']): Array<{ label: string; value: AgentStatus }> {
  if (status === 1) return [{ label: '凍結', value: 2 }];
  if (status === 2) return [{ label: '恢復正常', value: 1 }];
  return [];
}

function handleCommand(row: AgentAccount, command: AgentCommand) {
  if (command === 'crypto') emit('crypto', row);
  else if (command === 'disable-2fa' && !props.twoFactorBusy) emit('disable-2fa', row);
  else if (command === 'detail') emit('detail', row);
  else if (command === 'edit') emit('edit', row);
  else if (command === 'invitation' && !props.mailLoading) emit('send-invitation', row);
  else if (command === 'password-reset' && !props.mailLoading) emit('send-password-reset', row);
  else if (command.startsWith('status-')) {
    emit('status', row, Number(command.slice(7)) as AgentStatus);
  }
}
</script>

<style scoped lang="scss">
.agent-table-list { display: block; @include mobile { display: none; } }
.agent-cell { display: flex; align-items: center; gap: 14px; }
.contact-lines { display: grid; gap: 6px; color: #52637b; }
.agent-action-trigger__arrow { margin-left: 5px; }
</style>
