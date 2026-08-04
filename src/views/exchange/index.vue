<template>
  <section class="admin-page">
    <AdminHero title="兑换审核" description="查看资金冻结和处理时间线后完成一次审核" :icon="Switch">
      <template #extra>
        <span class="pill pill--amber">2 笔待审核</span>
      </template>
    </AdminHero>

    <div class="notice">订单使用提交时的代理专属比例，后续修改比例不影响已提交订单。</div>

    <AdminPanel title="兑换申请列表" :icon="Document">
      <el-table class="admin-data-table" :data="rows" :row-class-name="getRowClassName">
        <el-table-column label="编号" min-width="170">
          <template #default="{ row }">
            <div class="row-title">
              <strong>{{ row.id }}</strong>
              <span>{{ row.time }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="代理" min-width="240">
          <template #default="{ row }">
            <div class="row-title">
              <strong>{{ row.agent }}</strong>
              <span>{{ row.code }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="支付资产" min-width="180">
          <template #default="{ row }">
            <div class="asset">
              <span>{{ row.amount }}</span>
              <small>{{ row.asset }}</small>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="比例" min-width="100" />
        <el-table-column label="获得USD" min-width="160">
          <template #default="{ row }">
            <strong>{{ row.usd }}</strong>
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
    </AdminPanel>
  </section>
</template>

<script setup lang="ts">
import { Document, Switch } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';

const rows = [
  {
    id: 'EX-26073002',
    time: '08/03 16:08',
    agent: '代理B · Bluewave Capital',
    code: 'AG-B',
    amount: '5,000.00 USDC',
    asset: 'USDC',
    rate: '0.9000',
    usd: '4,500.00 USD',
    status: '待审核',
    statusType: 'pending' as const,
  },
  {
    id: 'EX-26073001',
    time: '08/01 17:08',
    agent: '代理A · Apex Trading',
    code: 'AG-A',
    amount: '10,000.00 USDT',
    asset: 'USDT',
    rate: '0.9900',
    usd: '9,900.00 USD',
    status: '已完成',
    statusType: 'success' as const,
  },
];

function getRowClassName({ row }: { row: (typeof rows)[number] }) {
  return row.statusType === 'pending' ? 'is-pending' : '';
}
</script>

<style scoped lang="scss">
.notice {
  padding: 18px 22px;
  border: 1px solid #f5cc80;
  border-radius: 8px;
  color: #9b6510;
  background: #fff8e8;
  font-weight: 850;
}

.asset {
  display: grid;
  gap: 5px;

  span {
    font-weight: 950;
  }

  small {
    color: #66758b;
    font-weight: 750;
  }
}
</style>
