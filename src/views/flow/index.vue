<template>
  <section class="admin-page">
    <AdminHero
      title="资金流水"
      description="记录每笔收付款交易详情，资金全链路清晰可追溯"
      :icon="Tickets"
    >
      <template #extra>
        <el-button plain :icon="Download">导出CSV</el-button>
      </template>
    </AdminHero>

    <AdminPanel>
      <el-table class="admin-data-table" :data="rows" stripe>
        <el-table-column prop="time" label="时间" sortable min-width="130" />
        <el-table-column prop="agent" label="代理" sortable min-width="220" />
        <el-table-column label="类型" min-width="100">
          <template #default="{ row }">
            <span class="type-chip">{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="编号" min-width="150" />
        <el-table-column prop="content" label="内容" min-width="190" />
        <el-table-column label="金额" min-width="190">
          <template #default="{ row }">
            <div
              :class="{
                'amount-success': row.amount.startsWith('+'),
                'amount-danger': row.amount.startsWith('-'),
              }"
            >
              <strong>{{ row.amount }}</strong>
              <small>{{ row.usd }}</small>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="140">
          <template #default="{ row }">
            <StatusBadge :label="row.status" :type="row.statusType" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" fixed="right">
          <template #default>
            <el-button plain size="small" :icon="View">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <footer class="flow-footer">
        <span>共 7 条</span>
        <el-pagination background layout="prev, pager, next, sizes" :total="7" :page-size="10" />
      </footer>
    </AdminPanel>
  </section>
</template>

<script setup lang="ts">
import { Download, Tickets, View } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';

const rows = [
  {
    time: '08/03 16:08',
    agent: '代理B · Bluewave Capital',
    type: '兑换',
    id: 'EX-26073002',
    content: 'USDC → USD · 0.9000',
    amount: '5,000.00 USDC',
    usd: '≈ 5,000.00 USD',
    status: '待审核',
    statusType: 'pending' as const,
  },
  {
    time: '08/03 15:08',
    agent: '代理A · Apex Trading',
    type: '入金',
    id: 'DEP-26073002',
    content: 'USDC · ERC20',
    amount: '待入帐 12,000.00 USDC',
    usd: '',
    status: '待审核',
    statusType: 'pending' as const,
  },
  {
    time: '08/03 14:08',
    agent: '代理A · Apex Trading',
    type: '出金',
    id: 'WD-26073001',
    content: 'USD · B→B',
    amount: '-5,050.00 USD',
    usd: '≈ -5,050.00 USD',
    status: '付款处理中',
    statusType: 'process' as const,
  },
  {
    time: '08/02 17:08',
    agent: '代理A · Apex Trading',
    type: '入金',
    id: 'DEP-26073001',
    content: 'USDT · TRC20',
    amount: '+50,000.00 USDT',
    usd: '≈ 50,000.00 USD',
    status: '已完成',
    statusType: 'success' as const,
  },
  {
    time: '08/02 15:08',
    agent: '代理B · Bluewave Capital',
    type: '入金',
    id: 'DEP-26072911',
    content: 'USDT · TRC20',
    amount: '+25,000.00 USDT',
    usd: '≈ 25,000.00 USD',
    status: '已完成',
    statusType: 'success' as const,
  },
  {
    time: '08/01 17:08',
    agent: '代理A · Apex Trading',
    type: '入金',
    id: 'DEP-26072908',
    content: 'USDC · ERC20',
    amount: '+12,500.00 USDC',
    usd: '≈ 12,500.00 USD',
    status: '已完成',
    statusType: 'success' as const,
  },
  {
    time: '07/31 17:08',
    agent: '代理A · Apex Trading',
    type: '出金',
    id: 'WD-26072903',
    content: 'USD · C→C',
    amount: '-12,550.00 USD',
    usd: '≈ -12,550.00 USD',
    status: '已完成',
    statusType: 'success' as const,
  },
];
</script>

<style scoped lang="scss">
td small {
  display: block;
  margin-top: 5px;
  color: #64748b;
  font-weight: 700;
}

.flow-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 24px;

  span {
    font-weight: 850;
  }
}

@include mobile {
  .flow-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
