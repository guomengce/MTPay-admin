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
      <el-table-column label="联络方式" min-width="240">
        <template #default="{ row }"><div class="contact-lines"><span>{{ row.email }}</span><span>{{ row.phone }}</span></div></template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template #default="{ row }"><StatusBadge :label="row.status_name" :type="statusType(row.status)" /></template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" min-width="160" />
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <div class="agent-actions">
            <el-button plain type="primary" size="small" :icon="View" @click="emit('detail', row)">详情</el-button>
            <el-button plain type="warning" size="small" :icon="Edit" @click="emit('edit', row)">修改</el-button>
            <el-dropdown
              v-if="statusOptions(row.status).length"
              trigger="click"
              @command="(status: AgentStatus) => emit('status', row, status)"
            >
              <el-button plain type="success" size="small" :icon="Setting">修改状态</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="option in statusOptions(row.status)"
                    :key="option.value"
                    :command="option.value"
                  >
                    {{ option.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { Edit, Setting, View } from '@element-plus/icons-vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import type { StatusBadgeType } from '@/components/admin/StatusBadge.vue';
import type { AgentAccount } from '@/api/modules/agent';

export type AgentStatus = 1 | 2 | 3;
defineProps<{ data: AgentAccount[]; loading: boolean }>();
const emit = defineEmits<{
  (event: 'detail', row: AgentAccount): void;
  (event: 'edit', row: AgentAccount): void;
  (event: 'status', row: AgentAccount, status: AgentStatus): void;
}>();

function statusType(status: AgentAccount['status']): StatusBadgeType {
  return ({ 0: 'warning', 1: 'success', 2: 'gray', 3: 'danger' } as const)[status];
}

function statusOptions(status: AgentAccount['status']): Array<{ label: string; value: AgentStatus }> {
  if (status === 0) return [{ label: '停用', value: 3 }];
  if (status === 1) return [{ label: '暂停', value: 2 }, { label: '停用', value: 3 }];
  if (status === 2) return [{ label: '恢复正常', value: 1 }, { label: '停用', value: 3 }];
  return [];
}
</script>

<style scoped lang="scss">
.agent-table-list { display: block; @include mobile { display: none; } }
.agent-cell { display: flex; align-items: center; gap: 14px; }
.agent-cell > span { display: inline-flex; width: 42px; height: 42px; align-items: center; justify-content: center; border-radius: 10px; color: #fff; background: linear-gradient(135deg, #17c4ad, #1f73f2); font-weight: 600; }
.contact-lines { display: grid; gap: 6px; color: #52637b; }
.agent-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  white-space: nowrap;
}
.agent-actions :deep(.el-button + .el-button) { margin-left: 0; }
.agent-actions :deep(.el-dropdown) { display: inline-flex; align-items: center; }
</style>
