<template>
  <el-table v-loading="loading" :data="items" class="admin-data-table" stripe>
    <el-table-column prop="name" label="角色名稱" min-width="200">
      <template #default="{ row }"
        ><strong>{{ row.name }}</strong></template
      >
    </el-table-column>
    <el-table-column prop="description" label="角色描述" min-width="280" show-overflow-tooltip>
      <template #default="{ row }">{{ row.description || '—' }}</template>
    </el-table-column>
    <el-table-column prop="admin_count" label="管理員數量" min-width="150" align="center" />
    <el-table-column prop="created_at" label="創建時間" min-width="180" />
    <el-table-column
      v-if="canEdit || canDelete"
      label="操作"
      width="110"
      fixed="right"
      align="center"
    >
      <template #default="{ row }">
        <el-dropdown trigger="click" @command="handleCommand($event, row)">
          <el-button plain :icon="MoreFilled">操作</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="canEdit" command="edit" :icon="Edit">編輯</el-dropdown-item>
              <el-dropdown-item
                v-if="canDelete"
                command="delete"
                :icon="Delete"
                :disabled="row.admin_count > 0"
                :divided="canEdit"
                >刪除</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { Delete, Edit, MoreFilled } from '@element-plus/icons-vue';
import type { RoleItem } from '../types';

defineProps<{ items: RoleItem[]; loading: boolean; canEdit: boolean; canDelete: boolean }>();
const emit = defineEmits<{
  (e: 'edit', row: RoleItem): void;
  (e: 'delete', row: RoleItem): void;
}>();

function handleCommand(command: string | number | object, row: RoleItem) {
  if (command === 'edit') emit('edit', row);
  if (command === 'delete' && row.admin_count === 0) emit('delete', row);
}
</script>
