<template>
  <section class="admin-page">
    <AdminHero title="白名单审核" description="四种类型均只需一次审核" :icon="Checked">
      <template #extra>
        <span class="pill pill--amber">1 笔待审核</span>
      </template>
    </AdminHero>

    <AdminPanel>
      <el-table class="admin-data-table" :data="pagedRows" :row-class-name="getRowClassName">
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
              <el-button plain>详情</el-button>
              <el-button v-if="row.statusType === 'pending'" type="success">通过</el-button>
              <el-button v-if="row.statusType === 'pending'" type="danger" plain>拒绝</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <TablePager v-model="page" v-model:page-size="size" :total="total" />
    </AdminPanel>
  </section>
</template>

<script setup lang="ts">
import { Checked } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import TablePager from '@/components/common/TablePager.vue';
import { useTablePager } from '@/hooks/useTablePager';

const rows = [
  {
    id: 'WL-1005',
    time: '08/03 15:38',
    agent: '代理A · Apex Trading',
    type: '收款人 · B',
    subject: 'Atlas Commerce GmbH',
    country: 'Germany',
    bank: 'Deutsche Bank',
    account: 'DE8937040044053206194',
    status: '待审核',
    statusType: 'pending' as const,
  },
  {
    id: 'WL-2002',
    time: '08/01 17:08',
    agent: '代理B · Bluewave Capital',
    type: '收款人 · C',
    subject: 'Amelia Davis',
    country: 'Australia',
    bank: 'ANZ',
    account: '•• 2711',
    status: '已核准',
    statusType: 'success' as const,
  },
  {
    id: 'WL-2001',
    time: '07/31 17:08',
    agent: '代理B · Bluewave Capital',
    type: '付款人 · B',
    subject: 'Bluewave Settlement Ltd.',
    country: 'Hong Kong',
    bank: 'Financial Institute',
    account: '72839104',
    status: '已核准',
    statusType: 'success' as const,
  },
  {
    id: 'WL-1004',
    time: '07/30 17:08',
    agent: '代理A · Apex Trading',
    type: '收款人 · C',
    subject: 'Olivia Brown',
    country: 'United Kingdom',
    bank: 'Barclays',
    account: 'GB29NWBK601613319501',
    status: '已核准',
    statusType: 'success' as const,
  },
];

const { page, size, total, pagedData: pagedRows } = useTablePager(rows);

function getRowClassName({ row }: { row: (typeof rows)[number] }) {
  return row.statusType === 'pending' ? 'is-pending' : '';
}
</script>

<style scoped lang="scss"></style>
