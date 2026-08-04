<template>
  <section class="admin-page">
    <AdminHero
      title="USD出金管理"
      description="一次审核后进入付款执行；付款完成不是第二次审核"
      :icon="Wallet"
    >
      <template #extra>
        <el-input class="search" placeholder="搜寻订单、代理或编号..." :prefix-icon="Search" />
      </template>
    </AdminHero>

    <div class="info-banner">每笔订单均可查看付款人、收款人、资金变化和完整处理时间线。</div>

    <AdminPanel title="USD出金订单列表" :icon="Document">
      <template #extra>
        <span class="pill pill--amber">1 笔待付款</span>
      </template>
      <el-table class="admin-data-table" :data="pagedRows" stripe>
        <el-table-column label="编号" min-width="160">
          <template #default="{ row }">
            <div class="row-title">
              <strong>{{ row.id }}</strong>
              <span>{{ row.time }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="agent" label="代理" min-width="220" />
        <el-table-column label="付款关系" min-width="310">
          <template #default="{ row }">
            <div class="row-title">
              <strong>{{ row.relation }}</strong>
              <span>{{ row.parties }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收款" min-width="150">
          <template #default="{ row }">
            <strong>{{ row.amount }}</strong>
          </template>
        </el-table-column>
        <el-table-column prop="fee" label="费用 / 总扣款" min-width="190" />
        <el-table-column label="状态" min-width="150">
          <template #default="{ row }">
            <StatusBadge :label="row.status" :type="row.statusType" />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="190" fixed="right">
          <template #default="{ row }">
            <div class="action-group">
              <el-button plain>详情</el-button>
              <el-button v-if="row.statusType === 'process'" type="primary">付款完成</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <TablePager v-model="page" v-model:page-size="size" :total="total" />
    </AdminPanel>
  </section>
</template>

<script setup lang="ts">
import { Document, Search, Wallet } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';
import TablePager from '@/components/common/TablePager.vue';
import { useTablePager } from '@/hooks/useTablePager';

const rows = [
  {
    id: 'WD-26073001',
    time: '08/03 14:08',
    agent: '代理A · Apex Trading',
    relation: 'B→B',
    parties: 'Harbor Trade Pte. Ltd. → Northstar Supplies LLC',
    amount: '5,000.00 USD',
    fee: '50.00 / 5,050.00 USD',
    status: '付款处理中',
    statusType: 'process' as const,
  },
  {
    id: 'WD-26072908',
    time: '07/31 17:08',
    agent: '代理A · Apex Trading',
    relation: 'C→C',
    parties: 'Michael Chen → Olivia Brown',
    amount: '12,500.00 USD',
    fee: '50.00 / 12,550.00 USD',
    status: '已完成',
    statusType: 'success' as const,
  },
];

const { page, size, total, pagedData: pagedRows } = useTablePager(rows);
</script>

<style scoped lang="scss">
.search {
  width: 360px;
}

.info-banner {
  padding: 18px 22px;
  border: 1px solid #bdd5ff;
  border-radius: 8px;
  color: #1254c8;
  background: #edf5ff;
  font-weight: 850;
}

@include mobile {
  .search {
    width: 100%;
  }
}
</style>
