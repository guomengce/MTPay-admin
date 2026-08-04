<template>
  <section class="admin-page">
    <AdminHero
      title="数字货币入金审核"
      description="确认平台已收到USDT或USDC后，审核通过并增加代理余额"
      :icon="Checked"
    >
      <template #extra>
        <span class="pill pill--amber">1 笔待审核</span>
      </template>
    </AdminHero>

    <div class="notice">
      管理员需核对币种、网络、金额及交易哈希，完成一次审核。审核通过前不增加代理余额。
    </div>

    <AdminPanel title="入金申请" :icon="Wallet">
      <el-table class="admin-data-table" :data="rows" :row-class-name="getRowClassName">
        <el-table-column label="编号" min-width="170">
          <template #default="{ row }">
            <div class="row-title">
              <strong>{{ row.id }}</strong>
              <span>{{ row.time }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="agent" label="代理" min-width="220" />
        <el-table-column label="资产 / 网络" min-width="140">
          <template #default="{ row }">
            <div class="asset">
              <span>{{ row.asset }}</span>
              <small>{{ row.network }}</small>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="hash" label="交易哈希" min-width="190" />
        <el-table-column label="申报金额" min-width="150">
          <template #default="{ row }">
            <strong>{{ row.amount }}</strong>
            <small class="asset-currency">{{ row.asset }}</small>
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
              <el-button v-if="row.statusType === 'pending'" type="success" plain>通过</el-button>
              <el-button v-if="row.statusType === 'pending'" type="danger" plain>拒绝</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </AdminPanel>
  </section>
</template>

<script setup lang="ts">
import { Checked, Wallet } from '@element-plus/icons-vue';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';

const rows = [
  {
    id: 'DEP-26073002',
    time: '08/03 15:08',
    agent: '代理A · Apex Trading',
    asset: 'USDC',
    network: 'ERC20',
    hash: '0x98aefd33...1e72f0',
    amount: '12,000.00',
    status: '待审核',
    statusType: 'pending' as const,
  },
  {
    id: 'DEP-26073001',
    time: '08/02 17:08',
    agent: '代理A · Apex Trading',
    asset: 'USDT',
    network: 'TRC20',
    hash: 'a7f8d2c5b9...9e93c1',
    amount: '50,000.00',
    status: '已完成',
    statusType: 'success' as const,
  },
  {
    id: 'DEP-26072911',
    time: '08/02 15:08',
    agent: '代理B · Bluewave Capital',
    asset: 'USDT',
    network: 'TRC20',
    hash: 'bb172e92d0...ad4c6a',
    amount: '25,000.00',
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
  gap: 6px;

  span {
    font-size: 18px;
    font-weight: 950;
  }

  small,
  .asset-currency {
    color: #126df0;
    font-weight: 850;
  }
}
</style>
