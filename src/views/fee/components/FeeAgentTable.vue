<template>
  <AdminPanel title="代理专属比例" subtitle="不同代理可设定不同的专属交易比例" :icon="UserFilled">
    <el-table class="admin-data-table" :data="rows" stripe>
      <el-table-column label="代理" min-width="260">
        <template #default="{ row }">
          <strong>{{ row.agent }}</strong>
          <span class="fee-agent-table__code">{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="usdt" label="USDT 比例" min-width="130" />
      <el-table-column prop="usdc" label="USDC 比例" min-width="130" />
      <el-table-column prop="min" label="最低 USD 可得" min-width="160" />
      <el-table-column prop="max" label="最高 USD 可得" min-width="160" />
      <el-table-column label="操作" width="110" fixed="right">
        <template #default="{ row }">
          <el-button plain size="small" :icon="Edit" @click="emit('edit', row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="fee-agent-table__pager">
      <TablePager v-model:page="page" v-model:page-size="size" :total="total" />
    </div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Edit, UserFilled } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import { useTablePager } from '@/hooks/useTablePager';

export interface FeeAgentRow {
  agent: string;
  code: string;
  usdt: string;
  usdc: string;
  min: string;
  max: string;
}

const props = defineProps<{ rows: FeeAgentRow[] }>();
const emit = defineEmits<{ (e: 'edit', row: FeeAgentRow): void }>();

const { page, size, total, pagedData } = useTablePager(() => props.rows);
const pagedRows = computed(() => pagedData.value);
</script>

<style scoped lang="scss">
.fee-agent-table {
  &__code {
    margin-left: 8px;
    padding: 2px 10px;
    border-radius: 999px;
    color: #126df0;
    background: #e8f1ff;
    font-size: 12px;
    font-weight: 850;
  }

  &__pager {
    margin-top: 14px;
    text-align: right;
  }
}
</style>
