<template>
  <div class="agent-table-list">
    <el-table v-loading="loading" class="admin-data-table" :data="data" stripe>
      <el-table-column label="代理" min-width="240">
        <template #default="{ row }">
          <div class="agent-cell">
            <span>{{ row.company_name.charAt(0).toUpperCase() }}</span>
            <div class="row-title"><strong>{{ row.company_name }}</strong><small>{{ row.agent_code }}</small></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="郵箱" prop="email" min-width="240">
      </el-table-column>
      <el-table-column label="手機號" prop="phone" min-width="240">
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
                <el-dropdown-item command="edit" :icon="Edit">修改</el-dropdown-item>
                <el-dropdown-item
                  v-if="row.status === 0"
                  command="invitation"
                  :icon="Promotion"
                  :disabled="mailLoading"
                  divided
                >發送激活郵件</el-dropdown-item>
                <el-dropdown-item
                  v-if="row.status === 1 || row.status === 2"
                  command="password-reset"
                  :icon="Key"
                  :disabled="mailLoading"
                  divided
                >重置密碼</el-dropdown-item>
                <el-dropdown-item
                  v-for="(option, index) in statusOptions(row.status)"
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
import { ArrowDown, Edit, Key, Promotion, Setting, View,MoreFilled } from '@element-plus/icons-vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import type { AgentAccount } from '@/api/modules/agent';

export type AgentStatus = 1 | 2 | 3;
type AgentCommand = 'detail' | 'edit' | 'invitation' | 'password-reset' | `status-${AgentStatus}`;

const props = defineProps<{ data: AgentAccount[]; loading: boolean; mailLoading?: boolean }>();
const emit = defineEmits<{
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
  if (status === 1) return [{ label: '冻结', value: 2 }];
  if (status === 2) return [{ label: '恢复正常', value: 1 }];
  return [];
}

function handleCommand(row: AgentAccount, command: AgentCommand) {
  if (command === 'detail') emit('detail', row);
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
.agent-cell > span { display: inline-flex; width: 42px; height: 42px; align-items: center; justify-content: center; border-radius: 10px; color: #fff; background: linear-gradient(135deg, #17c4ad, #1f73f2); font-weight: 600; }
.contact-lines { display: grid; gap: 6px; color: #52637b; }
.agent-action-trigger__arrow { margin-left: 5px; }
</style>
