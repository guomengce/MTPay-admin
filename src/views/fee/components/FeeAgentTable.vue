<template>
  <AdminPanel title="代理专属比例" subtitle="不同代理可设定不同的专属交易比例" :icon="UserFilled">
    <el-table class="admin-data-table" :data="pagedRows" stripe>
      <el-table-column label="代理" min-width="260">
        <template #default="{ row }">
          <strong>{{ row.agent }}</strong> <span class="type-chip">{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="usdt" label="USDT 比例" min-width="130" />
      <el-table-column prop="usdc" label="USDC 比例" min-width="130" />
      <el-table-column prop="min" label="最低 USD 可得" min-width="160" />
      <el-table-column prop="max" label="最高 USD 可得" min-width="160" />
      <el-table-column label="操作" width="110" fixed="right">
        <template #default>
          <el-button plain>修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <TablePager v-model="page" v-model:page-size="size" :total="total" />
    <div class="purple-note">代理专属比例优先级高于预设比例，将应用于该代理的所有交易。</div>
  </AdminPanel>
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue';

import AdminPanel from '@/components/admin/AdminPanel.vue';
import TablePager from '@/components/common/TablePager.vue';
import { useTablePager } from '@/hooks/useTablePager';

const rows = [
  {
    agent: '代理A · Apex Trading',
    code: 'AG-A',
    usdt: '0.9900',
    usdc: '0.9900',
    min: '90.00 USD',
    max: '990.00 USD',
  },
  {
    agent: '代理B · Bluewave Capital',
    code: 'AG-B',
    usdt: '0.9000',
    usdc: '0.9000',
    min: '50.00 USD',
    max: '500.00 USD',
  },
];

const { page, size, total, pagedData: pagedRows } = useTablePager(rows);
</script>

<style scoped lang="scss">
.purple-note {
  margin: 18px 28px;
  padding: 13px 16px;
  border: 1px solid #d8c7ff;
  border-radius: 8px;
  color: #6b45d8;
  background: #fbf8ff;
  font-weight: 800;
}
</style>
