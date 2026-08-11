<template>
  <div class="whitelist-table-list">
  <el-table class="admin-data-table" :data="data" stripe>
    <el-table-column label="编号" min-width="150">
      <template #default="{ row }">
        <div class="row-title">
          <strong>{{ row.id }}</strong>
          <span>{{ row.time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="agent" label="代理" min-width="220" />
    <el-table-column label="类型" min-width="130">
      <template #default="{ row }">
        <span class="type-chip">{{ row.type }}</span>
      </template>
    </el-table-column>
    <el-table-column label="主体" min-width="240">
      <template #default="{ row }">
        <div class="row-title">
          <strong>{{ row.subject }}</strong>
          <span>{{ row.country }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="关键资料" min-width="250">
      <template #default="{ row }">
        <div class="row-title">
          <strong>{{ row.bank }}</strong>
          <span>{{ row.account }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="状态" min-width="130">
      <template #default="{ row }">
        <StatusBadge :label="row.status" :type="row.statusType" />
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="220" fixed="right">
      <template #default="{ row }">
        <div class="action-group">
          <el-button plain size="small" @click="emit('view', row)">详情</el-button>
          <el-button
            v-if="row.statusType === 'pending'"
            type="success"
            size="small"
            @click="emit('approve', row)"
          >
            通过
          </el-button>
          <el-button
            v-if="row.statusType === 'pending'"
            type="danger"
            plain
            size="small"
            @click="emit('reject', row)"
          >
            拒绝
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from '@/components/admin/StatusBadge.vue';

export interface WhitelistRow {
  id: string;
  time: string;
  agent: string;
  type: string;
  subject: string;
  country: string;
  bank: string;
  account: string;
  status: string;
  statusType: 'pending' | 'success' | 'danger';
}

defineProps<{ data: WhitelistRow[] }>();
const emit = defineEmits<{
  (e: 'view', row: WhitelistRow): void;
  (e: 'approve', row: WhitelistRow): void;
  (e: 'reject', row: WhitelistRow): void;
}>();
</script>

<style scoped lang="scss">
.whitelist-table-list {
  display: block;

  @include mobile {
    display: none;
  }
}
</style>