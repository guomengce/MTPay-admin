<template>
  <section class="admin-page overview-page">
    <AdminHero title="MTPay 营运总览" description="管理代理、资金与审核流程" :icon="DataAnalysis">
      <template #extra>
        <el-button type="primary" size="large" :icon="Plus">新增代理</el-button>
      </template>
    </AdminHero>

    <div class="metric-grid">
      <MetricCard label="正常代理" value="2" subtext="后台直接建立" badge="AG" :icon="UserFilled" />
      <MetricCard
        label="待审核入金 / 兑换"
        value="2"
        subtext="1 入金 · 1 兑换"
        badge="审"
        :icon="RefreshRight"
        tone="blue"
      />
      <MetricCard
        label="白名单 / 出金待办"
        value="1"
        subtext="1 白名单 · 0 出金"
        badge="待"
        :icon="Tickets"
        tone="purple"
      />
      <MetricCard
        label="出金手续费"
        value="100.00"
        subtext="已处理订单"
        badge="USD"
        :icon="Coin"
        tone="amber"
      />
    </div>

    <div class="overview-page__split">
      <AdminPanel title="待处理业务" :icon="DocumentChecked">
        <template #extra>
          <span class="pill pill--amber">3 项</span>
        </template>
        <div class="task-grid">
          <RouterLink v-for="task in tasks" :key="task.title" :to="task.to" class="task-card">
            <el-icon><component :is="task.icon" /></el-icon>
            <strong>{{ task.count }}</strong>
            <span>{{ task.title }}</span>
            <small>{{ task.note }}</small>
            <i>→</i>
          </RouterLink>
        </div>
      </AdminPanel>

      <AdminPanel title="目前设定" :icon="Setting">
        <template #extra>
          <RouterLink class="text-link" to="/fee">管理</RouterLink>
        </template>
        <dl class="settings-list">
          <div>
            <dt>USDT 预设比例</dt>
            <dd>0.9900</dd>
          </div>
          <div>
            <dt>USDC 预设比例</dt>
            <dd>0.9900</dd>
          </div>
          <div>
            <dt>固定出金费</dt>
            <dd>50.00 USD</dd>
          </div>
        </dl>
      </AdminPanel>
    </div>

    <AdminPanel title="近期资金流水" :icon="Tickets">
      <template #extra>
        <RouterLink class="text-link" to="/flow">查看全部 →</RouterLink>
      </template>
      <el-table class="admin-data-table" :data="flows" stripe>
        <el-table-column prop="time" label="时间" min-width="120" />
        <el-table-column prop="agent" label="代理" min-width="220" />
        <el-table-column label="类型" min-width="100">
          <template #default="{ row }">
            <span class="type-chip">{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="编号" min-width="150" />
        <el-table-column prop="content" label="内容" min-width="180" />
        <el-table-column label="金额" min-width="180">
          <template #default="{ row }">
            <span
              :class="{
                'amount-danger': row.amount.startsWith('-'),
                'amount-success': row.amount.startsWith('+'),
              }"
            >
              {{ row.amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="140">
          <template #default="{ row }">
            <StatusBadge :label="row.status" :type="row.statusType" />
          </template>
        </el-table-column>
        <el-table-column label="详情" width="130" fixed="right">
          <template #default>
            <el-button plain size="small" :icon="View">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </AdminPanel>
  </section>
</template>

<script setup lang="ts">
import {
  Coin,
  DataAnalysis,
  DocumentChecked,
  Money,
  Plus,
  RefreshRight,
  Setting,
  Switch,
  Tickets,
  UserFilled,
  View,
  Wallet,
} from '@element-plus/icons-vue';
import { RouterLink } from 'vue-router';

import AdminHero from '@/components/admin/AdminHero.vue';
import AdminPanel from '@/components/admin/AdminPanel.vue';
import MetricCard from '@/components/admin/MetricCard.vue';
import StatusBadge from '@/components/admin/StatusBadge.vue';

const tasks = [
  { title: '笔入金', note: '确认收款', count: 1, to: '/deposit', icon: Money },
  { title: '笔兑换', note: '进入审核', count: 1, to: '/exchange', icon: Switch },
  { title: '笔白名单', note: '查看资料', count: 1, to: '/whitelist', icon: Tickets },
  { title: '笔出金', note: '查看付款', count: 0, to: '/withdrawal', icon: Wallet },
];

const flows = [
  {
    time: '08/03 16:08',
    agent: '代理B · Bluewave Capital',
    type: '兑换',
    id: 'EX-26073002',
    content: 'USDC → USD · 0.9000',
    amount: '5,000.00 USDC',
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
    status: '已完成',
    statusType: 'success' as const,
  },
];
</script>

<style scoped lang="scss">
.overview-page {
  &__split {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.9fr);
    gap: 18px;
  }
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  padding: 22px;
}

.task-card {
  position: relative;
  display: grid;
  min-height: 142px;
  align-content: center;
  gap: 6px;
  padding: 18px 18px 18px 64px;
  border: 1px solid #dce7f5;
  border-radius: 8px;
  color: #071833;
  background: linear-gradient(135deg, #f4fffd, #ffffff);

  .el-icon {
    position: absolute;
    top: 24px;
    left: 20px;
    color: #0aa99a;
    font-size: 26px;
  }

  strong {
    font-size: 30px;
  }

  span,
  small {
    font-weight: 800;
  }

  small {
    color: #65758d;
  }

  i {
    position: absolute;
    right: 18px;
    bottom: 16px;
    color: #0aa99a;
    font-style: normal;
    font-size: 24px;
  }
}

.settings-list {
  display: grid;
  margin: 0;
  padding: 18px 28px;

  div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid #e6edf5;
  }

  div:last-child {
    border-bottom: 0;
  }

  dt {
    color: #394862;
    font-weight: 850;
  }

  dd {
    margin: 0;
    color: #071833;
    font-weight: 900;
  }
}

@include narrow {
  .task-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@include mobile {
  .overview-page__split {
    grid-template-columns: 1fr;
  }

  .task-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
}
</style>
